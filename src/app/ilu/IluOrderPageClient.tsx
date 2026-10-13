'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Heart,
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
} from 'lucide-react';
import {
  Club,
  Order,
  FALLBACK_BACKEND_CLUBS,
  fetchClubsApi,
  submitOrderApi,
  validateOrderQuantity,
  validateSecurityCode,
} from '@/lib/iluService';

export default function IluOrderPageClient() {
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

  useEffect(() => {
    loadClubs(false);
  }, []);

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent decimal point, comma, exponent, and signs
    if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
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
      setValidationError('ദയവായി നിങ്ങളുടെ ക്ലബ്ബ് / സംഘടന തിരഞ്ഞെടുക്കുക.');
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

      {/* HERO SECTION: FULL WIDTH BANNER */}
      <section className="w-full relative z-10">
        <div className="w-full">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="https://media.raihsuite.com/RS0001/web/ilu/ilu-banner-mobile.png"
            />
            <source
              media="(min-width: 641px)"
              srcSet="https://media.raihsuite.com/RS0001/web/ilu/ilu%20banner.png"
            />
            <img
              src="https://media.raihsuite.com/RS0001/web/ilu/ilu%20banner.png"
              alt="ILU Foundation Palada Payasam Challenge 2026"
              className="w-full h-auto object-cover block shadow-md"
            />
          </picture>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10 space-y-8 sm:space-y-10">

        {/* MAIN CLUB ORDER FORM CARD - CLEAN WHITE WITH STANDARD HIGHLIGHT BORDER */}
        <section id="order-form" className="scroll-mt-24 relative z-20">
          <div className="rounded-3xl bg-white border-2 border-slate-200/90 shadow-xl shadow-slate-900/5 p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 relative">
            {/* Form Header */}
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 shadow-sm shrink-0">
                <Soup className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Place Your Club Order
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Select your club/organization and enter the payasam quantity.
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
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Field 1: Select Club (Searchable Combobox) */}
                <div className="space-y-1.5 sm:space-y-2 relative md:col-span-2" ref={dropdownRef}>
                  <div className="flex items-center justify-between">
                    <label htmlFor="club-search-input" className="block text-xs sm:text-sm font-bold text-slate-800">
                      ക്ലബ്ബ് / സംഘടന <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                      {clubs.length > 0 ? `${clubs.length} സംഘടനകൾ ലഭ്യമാണ്` : ''}
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
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer hover:border-slate-300 hover:bg-white transition shadow-sm"
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
                            className="p-1 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition"
                            title="തിരഞ്ഞെടുത്തത് മാറ്റുക"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
                          placeholder="ക്ലബ്ബ് / സംഘടന തിരഞ്ഞെടുക്കുക..."
                          className="w-full bg-slate-50 hover:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pl-9 sm:pl-10 pr-12 sm:pr-14 py-2.5 sm:py-3.5 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 focus:bg-white transition font-medium cursor-pointer"
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
                            className="p-1 text-slate-400 hover:text-slate-700 transition"
                            title="ലിസ്റ്റ് കാണുക"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Popup List */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 sm:mt-2 z-50 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-fade-in text-slate-800">
                      <div className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-600">
                        <span>ലഭ്യമായ സംഘടനകൾ / ക്ലബ്ബുകൾ ({filteredClubs.length})</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal">ക്ലിക്ക് ചെയ്ത് തിരഞ്ഞെടുക്കുക</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                        {filteredClubs.length === 0 ? (
                          <div className="p-3.5 sm:p-4 text-center text-xs text-slate-500">
                            {clubSearchTerm
                              ? `"${clubSearchTerm}" എന്ന പേരിൽ ക്ലബ്ബുകൾ കണ്ടെത്തിയില്ല`
                              : 'ക്ലബ്ബുകൾ ലഭ്യമല്ല'}
                          </div>
                        ) : (
                          filteredClubs.map((club) => {
                            const isSelected = selectedClubId === club.id;
                            return (
                              <button
                                key={club.id}
                                type="button"
                                onClick={() => handleSelectClub(club)}
                                className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm transition flex items-center justify-between group ${
                                  isSelected
                                    ? 'bg-slate-100 text-slate-900 font-bold'
                                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <p className="font-semibold text-slate-900 group-hover:text-amber-800 transition text-xs sm:text-sm">
                                      {club.name}
                                    </p>
                                    {club.location && (
                                      <span className="text-[9px] sm:text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded font-normal">
                                        {club.location}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 shrink-0" />
                                ) : (
                                  <span className="text-[10px] sm:text-xs text-slate-400 group-hover:text-slate-800">
                                    തിരഞ്ഞെടുക്കുക
                                  </span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Field 2: Quantity (Liters) */}
                <div className="space-y-1.5 sm:space-y-2 md:col-span-1">
                  <label htmlFor="quantity-input" className="block text-xs sm:text-sm font-bold text-slate-800">
                    പായസം അളവ് (ലിറ്റർ) <span className="text-rose-500">*</span>
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
                      required
                      value={quantity}
                      onKeyDown={handleQuantityKeyDown}
                      onChange={handleQuantityChange}
                      placeholder="അളവ് നൽകുക"
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-900 rounded-xl pl-9 sm:pl-10 pr-12 sm:pr-14 py-2.5 sm:py-3.5 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition font-bold"
                    />
                    <div className="absolute right-3 sm:right-3.5 text-slate-600 font-bold text-xs sm:text-sm pointer-events-none">
                      L
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                    പൂർണ്ണ ലിറ്റർ മാത്രം നൽകുക (ഉദാ: 10, 20, 50).
                  </p>
                </div>

                {/* Field 3: Club Security Code */}
                <div className="space-y-1.5 sm:space-y-2 md:col-span-1">
                  <label htmlFor="security-code" className="block text-xs sm:text-sm font-bold text-slate-800">
                    ക്ലബ് സെക്യൂരിറ്റി കോഡ് (6 അക്കങ്ങൾ) <span className="text-rose-500">*</span>
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
                      <span>ഓർഡർ സമർപ്പിക്കുന്നു...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white" />
                      <span>ഓർഡർ സമർപ്പിക്കുക</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* SUCCESS MODAL */}
        {submittedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md rounded-3xl bg-white border border-amber-200 p-6 sm:p-8 shadow-2xl text-slate-900 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                <PartyPopper className="w-8 h-8 animate-bounce" />
              </div>

              <h3 className="text-2xl font-black text-slate-900">Order Submitted!</h3>
              <p className="text-xs text-slate-600">
                Your club's payasam order has been successfully recorded.
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

        {/* PROMO BANNER CARD */}
        <section>
          <div className="rounded-3xl bg-gradient-to-r from-rose-50/70 via-amber-50/50 to-orange-50/70 border border-orange-100/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#ea183c]/15 via-[#f3631f]/15 to-[#faa70c]/15 text-[#ea183c] shadow-sm border border-[#ea183c]/20">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Want to see the latest orders?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed font-medium">
                Check the total payasam quantity ordered by each club and see how the challenge is progressing!
              </p>
              <div className="pt-1 w-full sm:w-auto">
                <Link
                  href="/ilu/order-status"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-[#ea183c]/20 hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  <span>Check Order Status</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Payasam Uruli Preview Photo */}
            <div className="relative shrink-0 w-32 sm:w-44 h-auto flex items-center justify-center">
              <img
                src="https://media.raihsuite.com/RS0001/web/ilu/payasam-img.png"
                alt="Kerala Payasam Bowl"
                className="w-full h-auto object-contain drop-shadow-md"
              />
            </div>
          </div>
        </section>

        {/* 4 FEATURE PILLARS IN ENGLISH */}
        <section id="features" className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="p-5 rounded-2xl bg-white/95 border border-slate-100 shadow-sm hover:shadow-md transition space-y-2.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Community Spirit</h4>
              <p className="text-xs text-slate-500 font-medium">
                Clubs coming together for a greater cause
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-2xl bg-white/95 border border-slate-100 shadow-sm hover:shadow-md transition space-y-2.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <Heart className="w-5 h-5 fill-rose-600" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Support a Cause</h4>
              <p className="text-xs text-slate-500 font-medium">
                Your participation creates real impact
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-2xl bg-white/95 border border-slate-100 shadow-sm hover:shadow-md transition space-y-2.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <Droplet className="w-5 h-5 fill-cyan-600/30" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Spread Kindness</h4>
              <p className="text-xs text-slate-500 font-medium">
                Every portion makes a difference
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-2xl bg-white/95 border border-slate-100 shadow-sm hover:shadow-md transition space-y-2.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Foster Inclusion</h4>
              <p className="text-xs text-slate-500 font-medium">
                Together for a brighter, more inclusive world
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
