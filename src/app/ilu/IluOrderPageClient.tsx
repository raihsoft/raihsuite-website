'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Droplet,
  AlertCircle,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Send,
  Users,
  PartyPopper,
  ChevronDown,
  ShieldCheck,
  Search,
  Check,
  X,
  Soup,
  Eye,
  EyeOff,
  Phone,
  Calendar,
  Timer,
  Sparkles,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import {
  Club,
  Order,
  FALLBACK_BACKEND_CLUBS,
  fetchClubsApi,
  submitOrderApi,
  validateOrderQuantity,
  validateSecurityCode,
  fetchOrderStatusApi,
  OrderStatusResponse,
} from '@/lib/iluService';
import { broadcastOrderPlaced, subscribeToOrderEvents } from '@/lib/iluSync';

function useAnimatedCount(targetNumber: number, stepIntervalMs: number = 1000 / 3) {
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [overlayProgress, setOverlayProgress] = useState<number>(0);
  const displayedCountRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If targetNumber is not a positive number yet, hold current or zero
    if (!targetNumber || targetNumber <= 0) {
      if (!isInitializedRef.current) {
        setDisplayedCount(0);
        displayedCountRef.current = 0;
        setOverlayProgress(0);
      }
      return;
    }

    // On initial load: display current target immediately without delay
    if (!isInitializedRef.current) {
      setDisplayedCount(targetNumber);
      displayedCountRef.current = targetNumber;
      setOverlayProgress(1);
      isInitializedRef.current = true;
      return;
    }

    const currentVal = displayedCountRef.current;
    const diff = targetNumber - currentVal;

    // If target equals current value, nothing to do
    if (diff === 0) {
      return;
    }

    // If target decreased (e.g. data correction), update directly
    if (diff < 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setDisplayedCount(targetNumber);
      displayedCountRef.current = targetNumber;
      setOverlayProgress(1);
      return;
    }

    // Keep the first and last 60 counts at three per second. Increase the
    // middle section by three counts per second for every additional 100 counts.
    const baseRate = 1000 / stepIntervalMs;
    const middleRate = diff > 120 ? baseRate + 3 * Math.ceil((diff - 120) / 100) : baseRate;
    const animationStart = currentVal;
    const acceleratedMiddleCount = diff > 120 ? diff - 120 : 0;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setOverlayProgress(1);

    const scheduleNextStep = () => {
      const progressed = displayedCountRef.current - animationStart;
      const isAcceleratedMiddle =
        acceleratedMiddleCount > 0 && progressed >= 60 && progressed < 60 + acceleratedMiddleCount;
      const interval = isAcceleratedMiddle ? 1000 / middleRate : stepIntervalMs;

      timeoutRef.current = setTimeout(() => {
        const nextVal = Math.min(targetNumber, displayedCountRef.current + 1);
        displayedCountRef.current = nextVal;
        setDisplayedCount(nextVal);

        if (nextVal >= targetNumber) {
          timeoutRef.current = null;
        } else {
          scheduleNextStep();
        }
      }, interval);
    };

    scheduleNextStep();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [targetNumber, stepIntervalMs]);

  return { displayedCount, overlayProgress };
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// Order Submission Deadline: 2026 October 31 (IST 23:59:59)
const ORDER_DEADLINE_TARGET_TIMESTAMP = new Date('2026-10-31T23:59:59+05:30').getTime();

function calculateChallengeTimeLeft(): TimeLeft {
  const diff = ORDER_DEADLINE_TARGET_TIMESTAMP - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  };
}

export default function IluOrderPageClient() {
  // Countdown State for 2026 November 8 Challenge
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateChallengeTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateChallengeTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateChallengeTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  // Preloaded with verified backend organizations so dropdown is immediately populated
  const [clubs, setClubs] = useState<Club[]>(FALLBACK_BACKEND_CLUBS);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [clubsError, setClubsError] = useState<string | null>(null);

  // Form State
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [securityCode, setSecurityCode] = useState<string>('');
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const isFetchingRef = useRef(false);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusResponse | null>(null);
  const [loadingOrderStatus, setLoadingOrderStatus] = useState<boolean>(true);
  const totalLiters = orderStatusData?.organizationTotalLiters ?? 0;
  const { displayedCount, overlayProgress } = useAnimatedCount(totalLiters);

  // Searchable dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clubSearchTerm, setClubSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredClubs = clubs.filter((c) => {
    const q = clubSearchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(q))
    );
  });

  const handleSelectClub = (club: Club) => {
    setSelectedClubId(club.id);
    setSelectedClub(club);
    setIsDropdownOpen(false);
    setClubSearchTerm('');
    setValidationError(null);
  };

  const handleClearClub = () => {
    setSelectedClubId('');
    setSelectedClub(null);
    setClubSearchTerm('');
    setValidationError(null);
  };

  const loadClubs = async (isManualRetry = false) => {
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      if (isManualRetry) {
        setIsRetrying(true);
      }
      setClubsError(null);
      const res = await fetchClubsApi();
      if (res.clubs && res.clubs.length > 0) {
        setClubs(res.clubs);
      }
    } catch {
      // Keep verified fallback clubs active without disrupting the dropdown
    } finally {
      setLoadingClubs(false);
      setIsRetrying(false);
      isFetchingRef.current = false;
    }
  };

  const isFetchingOrderStatusRef = useRef(false);
  const orderStatusRefreshQueuedRef = useRef(false);

  const loadOrderStatusTotal = async (isSilent = false) => {
    if (isFetchingOrderStatusRef.current) {
      orderStatusRefreshQueuedRef.current = true;
      return;
    }

    try {
      isFetchingOrderStatusRef.current = true;
      if (!isSilent) {
        setLoadingOrderStatus(true);
      }
      const res = await fetchOrderStatusApi();
      if (res && typeof res.organizationTotalLiters === 'number') {
        setOrderStatusData(res);
      }
    } catch {
      // Keep graceful fallback
    } finally {
      if (!isSilent) {
        setLoadingOrderStatus(false);
      }
      isFetchingOrderStatusRef.current = false;
      if (orderStatusRefreshQueuedRef.current) {
        orderStatusRefreshQueuedRef.current = false;
        void loadOrderStatusTotal(true);
      }
    }
  };

  useEffect(() => {
    loadClubs(false);
    loadOrderStatusTotal(false);

    // Auto-fetch updated count every 10 seconds in the background
    const pollInterval = setInterval(() => {
      loadOrderStatusTotal(true);
    }, 10000);

    // Cross-tab real-time sync: when an order is placed in another tab, immediately update
    const unsubscribe = subscribeToOrderEvents(() => {
      loadOrderStatusTotal(true);
    });

    return () => {
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, []);

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent decimal point, comma, exponent, signs, and arrow up/down increment
    if (['.', ',', 'e', 'E', '+', '-', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setQuantity('');
      setValidationError(null);
      return;
    }
    const cleanVal = val.replace(/[^0-9]/g, '');
    setQuantity(cleanVal);
    setValidationError(null);
  };

  const handleSecurityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setSecurityCode(val);
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current || isSubmitting) return;

    setValidationError(null);

    if (!selectedClubId) {
      setValidationError('ദയവായി നിങ്ങളുടെ ക്ലബ് / കൂട്ടായ്മ / കോർഡിനേറ്റർ തിരഞ്ഞെടുക്കുക.');
      return;
    }

    const qtyValidation = validateOrderQuantity(quantity);
    if (!qtyValidation.isValid || qtyValidation.quantity === undefined) {
      setValidationError(qtyValidation.error || 'സാധുവായ പായസം അളവ് നൽകുക (പൂർണ്ണ സംഖ്യ മാത്രം).');
      return;
    }

    const secValidation = validateSecurityCode(securityCode);
    if (!secValidation.isValid || !secValidation.code) {
      setValidationError(secValidation.error || 'ദയവായി 6 അക്ക സെക്യൂരിറ്റി കോഡ് നൽകുക.');
      return;
    }

    try {
      setIsSubmitting(true);
      isSubmittingRef.current = true;

      const newOrder = await submitOrderApi(
        selectedClubId,
        qtyValidation.quantity,
        secValidation.code,
        selectedClub?.name
      );

      setSubmittedOrder(newOrder);
      setSelectedClubId('');
      setSelectedClub(null);
      setQuantity('');
      setSecurityCode('');
      loadOrderStatusTotal(true);
      broadcastOrderPlaced();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ഓർഡർ സമർപ്പിക്കുന്നതിൽ പിശക് സംഭവിച്ചു.';
      setValidationError(msg);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-[#fffdf7] text-slate-800 min-h-screen font-sans selection:bg-amber-300 selection:text-amber-950">
      {/* Background Image Layer with Faded Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <picture className="block w-full h-full opacity-40">
          <source
            media="(max-width: 1023px)"
            srcSet="https://media.raihsuite.com/RS0001/web/ilu/ilu-bg-white-mobile.webp"
          />
          <img
            src="https://media.raihsuite.com/RS0001/web/ilu/ilu-bg-white.webp"
            alt="ILU Background"
            className="w-full h-full object-cover object-top"
          />
        </picture>
        <div className="absolute inset-0 bg-[#fffdf7]/40" />
      </div>

      {/* HERO SECTION: RESPONSIVE FULL WIDTH BANNER */}
      <section className="w-full relative z-10 shadow-sm">
        <div className="w-full">
          <img
            src="https://media.raihsuite.com/RS0001/web/ilu/hero-banner.webp"
            alt="ILU Foundation Palada Challenge 2026"
            className="w-full h-auto object-cover block"
          />
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10 space-y-8 sm:space-y-10">

        {/* TOGETHER WE ACHIEVED TOTAL STAT CARD - STANDOUT SHOWCASE MILESTONE */}
        <section>
          <div className="rounded-3xl bg-gradient-to-r from-[#800720] via-[#be123c] via-[#ea580c] to-[#f59e0b] p-5 sm:p-7 md:p-8 shadow-2xl shadow-rose-950/20 border-2 border-white/20 text-white relative overflow-hidden min-h-[140px] sm:min-h-[160px] flex flex-col justify-between">
            {/* Top hairline border glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            {/* Slowly Faded Gradient Overlay increasing as numbers climb */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out z-0"
              style={{
                opacity: overlayProgress,
              }}
            >
              {/* Expanding warm light wash across the card */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-amber-200/15 to-white/20 transition-transform duration-500 ease-out"
                style={{
                  transform: `scaleX(${0.1 + overlayProgress * 0.9})`,
                  transformOrigin: 'right center',
                }}
              />
              {/* Luminous soft ambient radial glow behind the numbers */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-500 ease-out"
                style={{
                  transform: `scale(${0.7 + overlayProgress * 0.4})`,
                  opacity: 0.3 + overlayProgress * 0.7,
                }}
              >
                <div className="w-96 h-96 rounded-full bg-amber-300/25 blur-3xl" />
              </div>
            </div>

            {/* Top-left: Together we achieved */}
            <div className="relative z-10 text-left">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-sm">
                Together we achieved
              </h2>
            </div>

            {/* Center: Big Highlighted Count + LTR */}
            <div className="relative z-10 flex items-baseline justify-center gap-2 sm:gap-3 py-2 sm:py-3 my-auto">
              <span className="text-5xl sm:text-7xl md:text-8xl font-black text-yellow-300 font-mono tracking-tight drop-shadow-[0_4px_16px_rgba(250,204,21,0.45)]">
                {loadingOrderStatus ? '...' : displayedCount.toLocaleString()}
              </span>
              <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wider drop-shadow-md">
                LTR
              </span>
            </div>
          </div>
        </section>

        {/* MAIN CLUB ORDER FORM CARD - HIGHLIGHTED AMBER BORDER MATCHING DROPDOWN */}
        <section id="order-form" className="scroll-mt-24 relative z-20">
          <div className="rounded-3xl bg-white border-2 border-amber-500 ring-4 ring-amber-500/15 shadow-2xl shadow-slate-900/5 p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 relative">
            {/* Form Header */}
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 shadow-sm shrink-0">
                <Soup className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Add Order Quantity
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Select your club/organization and enter the palada quantity.
                </p>
              </div>
            </div>

            {/* Validation Alert */}
            {validationError && (
              <div className="p-3 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm animate-slide-up">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
                <span className="font-medium">{validationError}</span>
              </div>
            )}

            {/* Form Fields Grid */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Field 1: Select Club (Searchable Combobox) */}
                <div className="space-y-1.5 relative md:col-span-2" ref={dropdownRef}>
                  <div className="flex items-center justify-between">
                    <label htmlFor="club-search-input" className="block text-xs sm:text-sm font-bold text-slate-800">
                      ക്ലബ് / കൂട്ടായ്മ / കോർഡിനേറ്റർ <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                      {clubs.length > 0 ? `${clubs.length} ക്ലബ്ബുകൾ ലഭ്യമാണ്` : ''}
                    </span>
                  </div>

                  {/* Combobox Trigger */}
                  <div className="relative">
                    <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                      {selectedClub ? (
                        <Users className="w-4 h-4 text-slate-600" />
                      ) : (
                        <Search className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {selectedClub ? (
                      /* Selected Club Chip */
                      <div
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className={`w-full bg-slate-50 text-slate-900 rounded-xl pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer shadow-sm ${
                          isDropdownOpen
                            ? 'border-2 border-amber-500 ring-2 ring-amber-400/20 bg-white'
                            : 'border-2 border-slate-300 hover:border-amber-400 hover:bg-white'
                        }`}
                        title="സംഘടന മാറ്റാൻ ക്ലിക്ക് ചെയ്യുക"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
                          <span className="font-bold text-slate-900 truncate">{selectedClub.name}</span>
                          {selectedClub.location && (
                            <span className="text-[10px] sm:text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 sm:px-2 py-0.5 rounded-md font-medium shrink-0">
                              {selectedClub.location}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearClub();
                            }}
                            className="p-1 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800"
                            title="തിരഞ്ഞെടുത്തത് മാറ്റുക"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    ) : (
                      /* Direct Search Input */
                      <div
                        className="relative flex items-center cursor-pointer"
                        onClick={() => setIsDropdownOpen(true)}
                      >
                        <input
                          type="text"
                          id="club-search-input"
                          value={clubSearchTerm}
                          onChange={(e) => {
                            setClubSearchTerm(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          onFocus={() => setIsDropdownOpen(true)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(true);
                          }}
                          placeholder="ക്ലബ് / കൂട്ടായ്മ / കോർഡിനേറ്റർ തിരഞ്ഞെടുക്കുക..."
                          className={`w-full bg-slate-50 hover:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl pl-9 sm:pl-10 pr-12 sm:pr-14 py-2.5 sm:py-3.5 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm focus:outline-none font-medium cursor-pointer ${
                            isDropdownOpen
                              ? 'border-2 border-amber-500 ring-2 ring-amber-400/20 bg-white'
                              : 'border-2 border-slate-300 hover:border-amber-400 focus:border-amber-500'
                          }`}
                        />
                        <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {clubSearchTerm && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setClubSearchTerm('');
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600"
                              title="തിരച്ചിൽ മാറ്റുക"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDropdownOpen((prev) => !prev);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="ലിസ്റ്റ് കാണുക"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Dropdown Popup List - Anchored immediately below the input with z-50 overlay */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-white border-2 border-amber-500 ring-4 ring-amber-500/15 shadow-2xl overflow-hidden text-slate-800">
                        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                          {filteredClubs.length === 0 ? (
                            <div className="p-3.5 sm:p-4 text-center text-xs text-slate-500 space-y-1">
                              <p>
                                {clubSearchTerm
                                  ? `"${clubSearchTerm}" എന്ന പേരിൽ ക്ലബ്ബുകൾ കണ്ടെത്തിയില്ല`
                                  : 'ക്ലബ്ബുകൾ ലഭ്യമല്ല'}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                പുതിയ ക്ലബ് ചേർക്കാൻ:{' '}
                                <a href="tel:+917907531608" className="text-amber-800 font-bold underline">
                                  +91 79075 31608
                                </a>
                              </p>
                            </div>
                          ) : (
                            filteredClubs.map((club) => {
                              const isSelected = selectedClubId === club.id;
                              return (
                                <button
                                  key={club.id}
                                  type="button"
                                  onClick={() => handleSelectClub(club)}
                                  className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm flex items-center justify-between group ${
                                    isSelected
                                      ? 'bg-slate-100 text-slate-900 font-bold'
                                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                  }`}
                                >
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                      <p className="font-semibold text-slate-900 group-hover:text-amber-800 text-xs sm:text-sm">
                                        {club.name}
                                      </p>
                                      {club.location && (
                                        <span className="text-[9px] sm:text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded font-normal">
                                          {club.location}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notice for adding new club/organization - directly under input field, covered when dropdown opens */}
                  <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
                    <span className="font-bold text-amber-950 bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-200/80">
                      പുതിയ ക്ലബ് / കൂട്ടായ്മ / കോർഡിനേറ്റർ
                    </span>
                    <span> എന്നിവ ചേർക്കുന്നതിനായി </span>
                    <a
                      href="tel:+917907531608"
                      className="font-bold text-amber-800 bg-amber-100/70 hover:bg-amber-200/80 px-1.5 py-0.5 rounded border border-amber-200/80 whitespace-nowrap inline-block transition touch-manipulation underline underline-offset-2"
                    >
                      +91 79075 31608
                    </a>
                    <span> എന്ന നമ്പറിൽ ബന്ധപ്പെടുക.</span>
                  </p>
                </div>

                {/* Field 2: Quantity (Liters) */}
                <div className="space-y-1.5 sm:space-y-2 md:col-span-1">
                  <label htmlFor="quantity-input" className="block text-xs sm:text-sm font-bold text-slate-800">
                    ലിറ്റർ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Droplet className="w-4 h-4 fill-slate-300" />
                    </div>
                    <input
                      type="number"
                      id="quantity-input"
                      step="1"
                      min="1"
                      inputMode="numeric"
                      required
                      value={quantity}
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={handleQuantityKeyDown}
                      onChange={handleQuantityChange}
                      placeholder="എണ്ണം നൽകുക"
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-900 rounded-xl pl-9 sm:pl-10 pr-14 sm:pr-16 py-2.5 sm:py-3.5 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute right-3 sm:right-3.5 text-slate-600 font-bold text-xs sm:text-sm pointer-events-none tracking-wider">
                      LTR
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                    കൂട്ടിച്ചേർക്കേണ്ട ലിറ്റർ മാത്രം നൽകുക
                  </p>
                </div>

                {/* Field 3: Security Code */}
                <div className="space-y-1.5 sm:space-y-2 md:col-span-1">
                  <label htmlFor="security-code" className="block text-xs sm:text-sm font-bold text-slate-800">
                    സെക്യൂരിറ്റി കോഡ് (6 അക്കങ്ങൾ) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <input
                      type={showSecurityCode ? 'text' : 'password'}
                      id="security-code"
                      required
                      maxLength={6}
                      inputMode="numeric"
                      value={securityCode}
                      onChange={handleSecurityCodeChange}
                      placeholder="6 അക്ക സെക്യൂരിറ്റി കോഡ് നൽകുക"
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-900 rounded-xl pl-9 sm:pl-10 pr-10 sm:pr-11 py-2.5 sm:py-3.5 text-xs sm:text-sm font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal placeholder:text-xs sm:placeholder:text-sm placeholder:text-slate-400 font-bold focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecurityCode((prev) => !prev)}
                      className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                      title={showSecurityCode ? 'സെക്യൂരിറ്റി കോഡ് മറയ്ക്കുക' : 'സെക്യൂരിറ്റി കോഡ് കാണുക'}
                    >
                      {showSecurityCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-1 sm:pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || loadingClubs || !selectedClubId || clubs.length === 0}
                  className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-black text-xs sm:text-sm md:text-base shadow-lg shadow-[#ea183c]/30 hover:shadow-xl hover:shadow-[#ea183c]/40 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white" />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>

              {/* Contact for any support */}
              <div className="pt-2 sm:pt-3 text-center border-t border-slate-100 flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-slate-600 font-medium">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Contact for any support / പുതിയ ക്ലബ് ചേർക്കാൻ :
                </span>
                <a
                  href="tel:+917907531608"
                  className="font-bold text-amber-700 hover:text-amber-800 hover:underline transition inline-flex items-center gap-1"
                >
                  +91 79075 31608
                </a>
              </div>
            </form>
          </div>
        </section>

        {/* DUAL ACTION SECTION: 1. DONATION (LEFT) & 2. LATEST ORDERS / LEADERBOARD (RIGHT) */}
        <section id="donation-section" className="scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
            {/* 1ST: DONATION SECTION (LEFT) */}
            <div className="rounded-3xl bg-gradient-to-br from-[#f0fdf4] via-[#f7fee7]/40 to-[#fffdf7] border-2 border-emerald-300/80 p-4 sm:p-5 lg:px-6 lg:py-4.5 shadow-md shadow-emerald-950/5 relative overflow-hidden flex flex-col justify-between h-full">
              {/* Ambient Festive Glows */}
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
              <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

              <div className="relative z-10 space-y-1.5 sm:space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] sm:text-xs font-bold shadow-xs w-fit">
                  <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  <span>സംഭാവനകൾ രജിസ്റ്റർ ചെയ്യാം • Support ILU Mission</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                  Support Our Noble Cause with a Donation
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-normal sm:leading-relaxed font-medium">
                  Contribute directly with cash or essential commodities to support community welfare initiatives.
                </p>
              </div>

              {/* Action Button & Donation Illustration */}
              <div className="relative z-10 pt-3 sm:pt-4 flex items-center justify-between gap-4">
                <Link
                  href="/ilu/donate"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 group whitespace-nowrap"
                >
                  <Heart className="w-3.5 h-3.5 fill-white shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Register Donation</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="relative shrink-0 w-16 sm:w-20 h-auto flex items-center justify-center">
                  <img
                    src="https://media.raihsuite.com/RS0001/web/ilu/donation.png"
                    alt="Donation Box"
                    className="w-full max-h-14 sm:max-h-16 object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* 2ND: WANT TO SEE THE LATEST ORDERS? SECTION (RIGHT) */}
            <div className="rounded-3xl bg-gradient-to-br from-rose-50/70 via-amber-50/50 to-orange-50/70 border-2 border-orange-200/80 p-4 sm:p-5 lg:px-6 lg:py-4.5 shadow-md shadow-orange-950/5 relative overflow-hidden flex flex-col justify-between h-full">
              {/* Ambient Festive Glows */}
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-orange-400/15 blur-3xl pointer-events-none" />
              <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#ea183c]/10 blur-3xl pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#ea183c] via-[#f3631f] to-[#faa70c]" />

              <div className="relative z-10 space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-[#ea183c]/15 via-[#f3631f]/15 to-[#faa70c]/15 text-[#ea183c] shadow-xs border border-[#ea183c]/20 shrink-0">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                    Want to see the order status and club performance?
                  </h3>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-normal sm:leading-relaxed font-medium">
                  Check the total palada quantity ordered by each club and see how the challenge is progressing!
                </p>
              </div>

              {/* Action Button & Palada Bowl */}
              <div className="relative z-10 pt-3 sm:pt-4 flex items-center justify-between gap-4">
                <Link
                  href="/ilu/order-status"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-[#ea183c]/20 hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 text-center whitespace-nowrap"
                >
                  <span>Leaderboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="relative shrink-0 w-16 sm:w-20 h-auto flex items-center justify-center">
                  <img
                    src="https://media.raihsuite.com/RS0001/web/ilu/payasam-img.png"
                    alt="Kerala Palada Bowl"
                    className="w-full max-h-14 sm:max-h-16 object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ORDER SUBMISSION DEADLINE COUNTDOWN CARD - TARGET: 31/10/2026 */}
        <section>
          <div className="rounded-3xl bg-gradient-to-br from-[#fffbeb] via-[#fff7ed] to-[#fef2f2] border-2 border-amber-300/80 p-5 sm:p-7 md:p-8 shadow-xl shadow-amber-950/5 relative overflow-hidden">
            {/* Ambient Festive Radial Glows */}
            <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-rose-400/15 blur-3xl pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center justify-center gap-1.5 mb-3 sm:mb-4">
                <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span>Last Date for Order Submission: 31/10/2026</span>
              </p>

              {timeLeft.isExpired ? (
                <div className="py-4 px-6 rounded-2xl bg-rose-100/90 border border-rose-300 text-rose-950 font-black text-base sm:text-lg flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
                  <span>Order Submissions Closed</span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:gap-3.5 w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto">
                  {/* Days */}
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 sm:h-22 md:h-26 rounded-xl sm:rounded-2xl bg-white border-2 border-amber-300/90 shadow-md shadow-amber-500/10 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
                      <span
                        className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-mono tracking-tight"
                        suppressHydrationWarning
                      >
                        {String(timeLeft.days).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 mt-1.5 sm:mt-2">
                      Days
                    </span>
                  </div>

                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 sm:h-22 md:h-26 rounded-xl sm:rounded-2xl bg-white border-2 border-amber-300/90 shadow-md shadow-amber-500/10 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
                      <span
                        className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-mono tracking-tight"
                        suppressHydrationWarning
                      >
                        {String(timeLeft.hours).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 mt-1.5 sm:mt-2">
                      Hours
                    </span>
                  </div>

                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 sm:h-22 md:h-26 rounded-xl sm:rounded-2xl bg-white border-2 border-amber-300/90 shadow-md shadow-amber-500/10 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
                      <span
                        className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-mono tracking-tight"
                        suppressHydrationWarning
                      >
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 mt-1.5 sm:mt-2">
                      Mins
                    </span>
                  </div>

                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 sm:h-22 md:h-26 rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-100/90 via-orange-50 to-rose-50 border-2 border-[#ea183c]/60 shadow-lg shadow-[#ea183c]/15 flex items-center justify-center relative overflow-hidden ring-2 ring-amber-400/30">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ea183c] via-[#f3631f] to-[#faa70c]" />
                      <span
                        className="text-2xl sm:text-4xl md:text-5xl font-black text-[#ea183c] font-mono tracking-tight"
                        suppressHydrationWarning
                      >
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#ea183c] mt-1.5 sm:mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ea183c] animate-ping" />
                      Secs
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SUCCESS MODAL */}
        {submittedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 animate-fade-in pointer-events-auto">
            <div className="relative w-full max-w-md rounded-3xl bg-white border border-amber-200 p-6 sm:p-8 shadow-2xl text-slate-900 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                <PartyPopper className="w-8 h-8 animate-bounce" />
              </div>

              <h3 className="text-2xl font-black text-slate-900">Order Submitted!</h3>
              <p className="text-xs text-slate-600">
                Your club's palada order has been successfully recorded.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Ref:</span>
                  <span className="font-mono font-bold text-amber-800">{submittedOrder.orderRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Club:</span>
                  <span className="font-bold text-slate-900">{submittedOrder.clubName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quantity:</span>
                  <span className="font-bold text-amber-700">{submittedOrder.quantityLiters} Liters (L)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                <Link
                  href="/ilu/order-status"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ea183c] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#ea183c]/20 text-center transition flex items-center justify-center"
                >
                  View Order Status
                </Link>
                <button
                  type="button"
                  onClick={() => setSubmittedOrder(null)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center justify-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
