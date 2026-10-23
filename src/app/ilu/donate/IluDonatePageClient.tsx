'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  Users,
  Package,
  Send,
  Loader2,
  Check,
  PartyPopper,
  Sparkles,
  RefreshCw,
  Search,
  ChevronDown,
  X,
  ShieldCheck,
  Eye,
  EyeOff,
  Building2,
  FileText,
  BadgeIndianRupee,
  QrCode,
  MessageCircle,
} from 'lucide-react';
import {
  Club,
  FALLBACK_BACKEND_CLUBS,
  fetchClubsApi,
  validateSecurityCode,
  DonationPayload,
  DonationResponse,
  submitDonationApi,
} from '@/lib/iluService';

type DonorType = 'INDIVIDUAL' | 'ORGANIZATION';
type DonationType = 'CASH' | 'COMMODITY';

export default function IluDonatePageClient() {
  // 1. Donor Type (firstly: Individual or Club)
  const [donorType, setDonorType] = useState<DonorType>('INDIVIDUAL');

  // Club Dropdown State
  const [clubs, setClubs] = useState<Club[]>(FALLBACK_BACKEND_CLUBS);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubSearchTerm, setClubSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form Fields State
  const [donorName, setDonorName] = useState('');
  const [mobile, setMobile] = useState('');
  const [donationType, setDonationType] = useState<DonationType>('CASH');
  const [amount, setAmount] = useState('');
  const [fundraisingItem, setFundraisingItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  // Security Code State (Last field when Club is selected)
  const [securityCode, setSecurityCode] = useState('');
  const [showSecurityCode, setShowSecurityCode] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedDonation, setSubmittedDonation] = useState<DonationResponse | null>(null);

  // Load clubs on mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoadingClubs(true);
        const res = await fetchClubsApi();
        if (isMounted && res.clubs && res.clubs.length > 0) {
          setClubs(res.clubs);
        }
      } catch {
        // Fallback clubs remain available
      } finally {
        if (isMounted) setLoadingClubs(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

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

  // Filter clubs by search term
  const filteredClubs = useMemo(() => {
    const q = clubSearchTerm.toLowerCase().trim();
    if (!q) return clubs;
    return clubs.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(q))
    );
  }, [clubs, clubSearchTerm]);

  const handleSelectClub = (club: Club) => {
    setSelectedClubId(club.id);
    setSelectedClub(club);
    setIsDropdownOpen(false);
    setClubSearchTerm('');
    setErrorMessage(null);

    // Auto-fill coordinator name if empty
    if (!donorName.trim() && club.contactPerson) {
      setDonorName(club.contactPerson);
    }
    if (!mobile.trim() && club.mobileNumber) {
      setMobile(club.mobileNumber.replace(/[^0-9]/g, '').slice(0, 10));
    }
  };

  const handleClearClub = () => {
    setSelectedClubId('');
    setSelectedClub(null);
    setClubSearchTerm('');
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanNumber = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setMobile(cleanNumber);
  };

  const handleSecurityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanCode = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setSecurityCode(cleanCode);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanAmount = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(cleanAmount);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Club validation
    if (donorType === 'ORGANIZATION') {
      if (!selectedClubId) {
        setErrorMessage('ദയവായി ക്ലബ്ബ് / സംഘടന തിരഞ്ഞെടുക്കുക (Please select a club/organization).');
        return;
      }
    }

    // 2. Name validation
    const trimmedName = donorName.trim();
    if (!trimmedName) {
      setErrorMessage(
        donorType === 'ORGANIZATION'
          ? 'ദയവായി പ്രതിനിധിയുടെ പേര് നൽകുക (Please enter coordinator/representative name).'
          : 'ദയവായി ദാതാവിന്റെ പേര് നൽകുക (Please enter donor name).'
      );
      return;
    }

    // 3. Mobile validation
    const cleanMobile = mobile.trim();
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMessage(
        'ദയവായി ശരിയായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക (Please enter a valid 10-digit mobile number).'
      );
      return;
    }

    // 4. Mode specific validation (Cash vs Commodity)
    if (donationType === 'CASH') {
      const numAmount = Number(amount);
      if (!amount || Number.isNaN(numAmount) || numAmount <= 0) {
        setErrorMessage('ദയവായി സാധുവായ ഒരു തുക നൽകുക (Please enter a valid donation amount).');
        return;
      }
    } else {
      if (!fundraisingItem.trim()) {
        setErrorMessage('ദയവായി സംഭാവന നൽകുന്ന ഇനം നൽകുക (Please enter a fundraising item).');
        return;
      }

      if (!quantity.trim()) {
        setErrorMessage('ദയവായി അളവ് രേഖപ്പെടുത്തുക (Please enter a valid quantity).');
        return;
      }
    }

    // 5. Security Code validation (only when Club is selected - last field)
    if (donorType === 'ORGANIZATION') {
      const secValidation = validateSecurityCode(securityCode);
      if (!secValidation.isValid) {
        setErrorMessage(
          secValidation.error ||
            'ദയവായി 6 അക്ക സെക്യൂരിറ്റി കോഡ് നൽകുക (Please enter 6-digit security code).'
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const todayStr = new Date().toISOString().split('T')[0];

      const payloadToSend: Omit<DonationPayload, 'tenant' | 'fundraising'> = {
        donor_type: donorType,
        organization: donorType === 'ORGANIZATION' ? selectedClubId : null,
        donation_type: donationType,
        donor_name: trimmedName,
        mobile: cleanMobile,
        donation_date: todayStr,
        amount: donationType === 'CASH' ? Number(amount).toFixed(2) : null,
        fundraising_item: donationType === 'COMMODITY' ? fundraisingItem.trim() : null,
        quantity: donationType === 'COMMODITY' ? quantity.trim() : null,
        notes: notes.trim(),
      };

      // Only include security_code if donor_type is CLUB
      if (donorType === 'ORGANIZATION') {
        payloadToSend.security_code = securityCode.trim();
      }

      const result = await submitDonationApi(payloadToSend);

      setSubmittedDonation(result);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Donation submission failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedDonation(null);
    setDonorType('INDIVIDUAL');
    setSelectedClubId('');
    setSelectedClub(null);
    setClubSearchTerm('');
    setDonorName('');
    setMobile('');
    setDonationType('CASH');
    setAmount('');
    setFundraisingItem('');
    setQuantity('');
    setNotes('');
    setSecurityCode('');
    setShowSecurityCode(false);
    setErrorMessage(null);
  };

  return (
    <div className="relative overflow-x-hidden bg-[#fffdf7] text-slate-800 min-h-screen font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <picture className="block w-full h-full opacity-35">
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
        <div className="absolute inset-0 bg-[#fffdf7]/50" />
      </div>

      <div className="py-6 sm:py-10 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
          {/* SUCCESS CONFIRMATION RECEIPT */}
          {submittedDonation ? (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-3xl bg-white border-2 border-emerald-500 shadow-2xl p-6 sm:p-10 text-center space-y-6 animate-fade-in relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

              <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                <PartyPopper className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Donation Registered!
                </h2>
                <p className="text-xs sm:text-sm text-emerald-800 font-semibold">
                  സംഭാവന വിജയകരമായി രജിസ്റ്റർ ചെയ്തു. നിങ്ങളുടെ പിന്തുണയ്ക്ക് നന്ദി!
                </p>
              </div>

              {/* Donation Details Summary Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-left space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="text-slate-500 font-medium">Receipt Ref / ID:</span>
                  <span className="font-mono font-bold text-slate-900 break-all">
                    {submittedDonation.id}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="text-slate-500 font-medium">Donor Type:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-200 text-emerald-900">
                    {donorType}
                  </span>
                </div>

                {donorType === 'ORGANIZATION' && selectedClub && (
                  <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                    <span className="text-slate-500 font-medium">Club / Organization:</span>
                    <span className="font-bold text-slate-900">
                      {selectedClub.name} {selectedClub.location ? `(${selectedClub.location})` : ''}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="text-slate-500 font-medium">
                    {donorType === 'ORGANIZATION' ? 'Representative Name:' : 'Donor Name:'}
                  </span>
                  <span className="font-bold text-slate-900">{submittedDonation.donor_name}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="text-slate-500 font-medium">Mobile:</span>
                  <span className="font-mono font-bold text-slate-800">{submittedDonation.mobile}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="text-slate-500 font-medium">Donation Type:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-200 text-emerald-900">
                    {submittedDonation.donation_type}
                  </span>
                </div>

                {submittedDonation.donation_type === 'CASH' && (
                  <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                    <span className="text-slate-500 font-medium">Amount:</span>
                    <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
                      ₹{submittedDonation.amount}
                    </span>
                  </div>
                )}

                {submittedDonation.donation_type === 'COMMODITY' && (
                  <>
                    <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                      <span className="text-slate-500 font-medium">Item:</span>
                      <span className="font-bold text-slate-900">
                        {submittedDonation.fundraising_item || fundraisingItem || 'Item'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                      <span className="text-slate-500 font-medium">Quantity:</span>
                      <span className="font-bold text-emerald-700">
                        {submittedDonation.quantity}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">Date:</span>
                  <span className="font-semibold text-slate-700">{submittedDonation.donation_date}</span>
                </div>

                {submittedDonation.notes && (
                  <div className="pt-1 text-xs text-slate-600 border-t border-emerald-100">
                    <span className="font-medium text-slate-500 block">Notes:</span>
                    <p className="mt-0.5 italic">{submittedDonation.notes}</p>
                  </div>
                )}
              </div>

              {/* QR Code in Success Confirmation if CASH */}
              {submittedDonation.donation_type === 'CASH' && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Scan to Pay via UPI / QR കോഡ് സ്കാൻ ചെയ്യുക</span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm inline-block mx-auto max-w-full">
                    <img
                      src="https://media.raihsuite.com/RS0001/web/ilu/Donation-QR.jpeg"
                      alt="Donation UPI QR Code"
                      className="w-44 sm:w-52 h-auto mx-auto rounded-xl object-contain block"
                    />
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed max-w-md mx-auto">
                    തുക അയച്ച ശേഷം <span className="font-bold text-emerald-700">7907531608</span> എന്ന നമ്പറിലേക് സ്ക്രീൻ ഷോർട്ട് WhatsApp ചെയ്യുക
                  </p>

                  <a
                    href={`https://wa.me/917907531608?text=${encodeURIComponent(
                      `Donation Ref: ${submittedDonation.id}\nName: ${submittedDonation.donor_name}\nAmount: ₹${submittedDonation.amount || ''}\n(Donation Screenshot Attached)`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Screenshot (+91 79075 31608)</span>
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Make Another Donation</span>
                </button>
                <Link
                  href="/ilu"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Challenge Page</span>
                </Link>
              </div>
            </div>
            </div>
          ) : (
            /* TWO-COLUMN LAYOUT: FORM (LEFT) AND QR SECTION (RIGHT) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* LEFT SECTION: MAIN DONATION FORM */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl bg-white border-2 border-emerald-500 ring-4 ring-emerald-500/15 shadow-2xl p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-7 relative">
              <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

              {/* Form Header */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  <span>സംഭാവനകൾ രജിസ്റ്റർ ചെയ്യാം • Donation Form</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Support ILU Foundation
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Please select donor type and complete the details below.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm animate-slide-up">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
                {/* 1. FIRSTLY: CHOOSE INDIVIDUAL OR CLUB */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800">
                    Donor Type / വിഭാഗം <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                    {/* INDIVIDUAL BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setDonorType('INDIVIDUAL');
                        setSecurityCode('');
                        setShowSecurityCode(false);
                        setSelectedClubId('');
                        setSelectedClub(null);
                        setErrorMessage(null);
                      }}
                      className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        donorType === 'INDIVIDUAL'
                          ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/20 scale-[1.01]'
                          : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Individual (വ്യക്തിഗതം)</span>
                      {donorType === 'INDIVIDUAL' && <Check className="w-4 h-4" />}
                    </button>

                    {/* CLUB BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setDonorType('ORGANIZATION');
                        setErrorMessage(null);
                      }}
                      className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        donorType === 'ORGANIZATION'
                          ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/20 scale-[1.01]'
                          : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Club / Organization (ക്ലബ്ബ്)</span>
                      {donorType === 'ORGANIZATION' && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2. CLUB DROPDOWN (ONLY WHEN CLUB IS SELECTED) */}
                {donorType === 'ORGANIZATION' && (
                  <div className="space-y-1.5 animate-fade-in" ref={dropdownRef}>
                    <div className="flex items-center justify-between">
                      <label htmlFor="club-search-input" className="block text-xs sm:text-sm font-bold text-slate-800">
                        Select Club / സംഘടന തിരഞ്ഞെടുക്കുക <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                        {clubs.length > 0 ? `${clubs.length} ക്ലബ്ബുകൾ ലഭ്യമാണ്` : ''}
                      </span>
                    </div>

                    <div>
                      {selectedClub ? (
                        /* Selected Club Chip - Self-contained icon inside the chip */
                        <div
                          onClick={() => setIsDropdownOpen((prev) => !prev)}
                          className={`w-full bg-slate-50/80 hover:bg-white text-slate-900 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition shadow-xs ${
                            isDropdownOpen
                              ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/15 bg-white'
                              : 'border border-slate-300 hover:border-emerald-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-bold text-slate-900 truncate">{selectedClub.name}</span>
                            {selectedClub.location && (
                              <span className="text-[10px] sm:text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-medium shrink-0">
                                {selectedClub.location}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClearClub();
                              }}
                              className="p-1 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 cursor-pointer"
                              title="ക്ലബ്ബ് മാറ്റുക"
                            >
                              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                                isDropdownOpen ? 'rotate-180 text-emerald-600' : ''
                              }`}
                            />
                          </div>
                        </div>
                      ) : (
                        /* Search Combobox Input - Self-contained icon inside the input wrapper */
                        <div
                          className="relative flex items-center cursor-pointer"
                          onClick={() => setIsDropdownOpen(true)}
                        >
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <Search className="w-4 h-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            id="club-search-input"
                            value={clubSearchTerm}
                            onChange={(e) => {
                              setClubSearchTerm(e.target.value);
                              setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            placeholder="ക്ലബ്ബ് തിരയുക അല്ലെങ്കിൽ തിരഞ്ഞെടുക്കുക..."
                            className={`w-full bg-slate-50/80 hover:bg-white focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm font-medium focus:outline-none transition shadow-xs ${
                              isDropdownOpen
                                ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/15 bg-white'
                                : 'border border-slate-300 hover:border-slate-400'
                            }`}
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isDropdownOpen ? 'rotate-180 text-emerald-600' : ''
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      {/* Dropdown Options Popup */}
                      {isDropdownOpen && (
                        <div className="mt-2 bg-white border-2 border-emerald-500/80 rounded-2xl shadow-lg p-2 max-h-60 overflow-y-auto space-y-1 animate-fade-in">
                          {loadingClubs ? (
                            <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
                              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                              <span>ക്ലബ്ബുകൾ ലോഡ് ചെയ്യുന്നു...</span>
                            </div>
                          ) : filteredClubs.length === 0 ? (
                            <div className="py-6 text-center text-xs text-slate-500 font-medium space-y-1">
                              <p>&quot;{clubSearchTerm}&quot; എന്ന പേരിൽ ക്ലബ്ബ് കണ്ടെത്താനായില്ല</p>
                              <button
                                type="button"
                                onClick={() => setClubSearchTerm('')}
                                className="text-xs text-emerald-600 hover:text-emerald-800 font-bold underline cursor-pointer"
                              >
                                മുഴുവൻ ക്ലബ്ബുകളും കാണുക
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center border-b border-slate-100 mb-1">
                                <span>ക്ലബ്ബ് തിരഞ്ഞെടുക്കുക</span>
                                <span>{filteredClubs.length} ലഭ്യമാണ്</span>
                              </div>
                              {filteredClubs.map((club) => {
                                const isSelected = club.id === selectedClubId;
                                return (
                                  <button
                                    key={club.id}
                                    type="button"
                                    onClick={() => handleSelectClub(club)}
                                    className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-all text-xs sm:text-sm cursor-pointer ${
                                      isSelected
                                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                                        : 'hover:bg-emerald-50 text-slate-800 font-semibold'
                                    }`}
                                  >
                                    <div className="space-y-0.5 min-w-0">
                                      <p className="truncate font-semibold">{club.name}</p>
                                      {club.location && (
                                        <span
                                          className={`text-[10px] px-1.5 py-0.2 rounded font-normal inline-block ${
                                            isSelected
                                              ? 'bg-emerald-700 text-white'
                                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                                          }`}
                                        >
                                          {club.location}
                                        </span>
                                      )}
                                    </div>
                                    {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                                  </button>
                                );
                              })}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. DONOR / REPRESENTATIVE NAME */}
                <div className="space-y-1.5">
                  <label htmlFor="donor-name" className="block text-xs sm:text-sm font-bold text-slate-800">
                    {donorType === 'ORGANIZATION' ? 'Representative / Coordinator Name' : 'Donor Name'} / പേര്{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-2xl shadow-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <input
                      type="text"
                      id="donor-name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={
                        donorType === 'ORGANIZATION'
                          ? 'Enter coordinator / representative name'
                          : 'Enter donor name'
                      }
                      required
                      className="block w-full rounded-2xl border border-slate-300 bg-slate-50/80 hover:bg-white focus:bg-white pl-10 pr-4 py-2.5 sm:py-3 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* 4. MOBILE NUMBER */}
                <div className="space-y-1.5">
                  <label htmlFor="donor-mobile" className="block text-xs sm:text-sm font-bold text-slate-800">
                    Mobile Number / ഫോൺ നമ്പർ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-2xl shadow-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <input
                      type="tel"
                      id="donor-mobile"
                      value={mobile}
                      onChange={handleMobileChange}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      required
                      className="block w-full rounded-2xl border border-slate-300 bg-slate-50/80 hover:bg-white focus:bg-white pl-10 pr-4 py-2.5 sm:py-3 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition font-mono"
                    />
                  </div>
                </div>

                {/* 5. DONATION TYPE: CASH OR COMMODITY */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800">
                    Donation Type / സംഭാവന തരം <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                    {/* CASH BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setDonationType('CASH');
                        setErrorMessage(null);
                      }}
                      className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        donationType === 'CASH'
                          ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/20 scale-[1.01]'
                          : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <span className="font-mono text-xs opacity-70">1.</span>
                      <span>CASH (പണം)</span>
                      {donationType === 'CASH' && <Check className="w-4 h-4" />}
                    </button>

                    {/* COMMODITY BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setDonationType('COMMODITY');
                        setErrorMessage(null);
                      }}
                      className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        donationType === 'COMMODITY'
                          ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/20 scale-[1.01]'
                          : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <span className="font-mono text-xs opacity-70">2.</span>
                      <span>COMMODITY (സാധനങ്ങൾ)</span>
                      {donationType === 'COMMODITY' && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 6. MODE SPECIFIC FIELDS: CASH AMOUNT OR COMMODITY ITEM & QUANTITY */}
                {donationType === 'CASH' ? (
                  /* CASH MODE: AMOUNT ONLY */
                  <div className="space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <label htmlFor="cash-amount" className="block text-xs sm:text-sm font-bold text-slate-800">
                        Amount (₹) / തുക <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">In Indian Rupees (INR)</span>
                    </div>
                    <div className="relative rounded-2xl shadow-xs">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 font-bold text-base sm:text-lg">
                        ₹
                      </div>
                      <input
                        type="text"
                        id="cash-amount"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter donation amount"
                        required
                        className="block w-full rounded-2xl border border-slate-300 bg-slate-50/80 hover:bg-white focus:bg-white pl-9 pr-4 py-2.5 sm:py-3 text-slate-900 text-base font-bold placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  /* COMMODITY MODE: FUNDRAISING_ITEM TEXT FIELD & QUANTITY */
                  <div className="space-y-4 animate-fade-in">
                    {/* Fundraising Item Text Input */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="fundraising-item"
                        className="block text-xs sm:text-sm font-bold text-slate-800"
                      >
                        Fundraising Item / വസ്‌തു <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative rounded-2xl shadow-xs">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                        </div>
                        <input
                          type="text"
                          id="fundraising-item"
                          value={fundraisingItem}
                          onChange={(e) => setFundraisingItem(e.target.value)}
                          placeholder="Enter fundraising item name"
                          required
                          className="block w-full rounded-2xl border border-slate-300 bg-slate-50/80 hover:bg-white focus:bg-white pl-10 pr-4 py-2.5 sm:py-3 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Quantity Field */}
                    <div className="space-y-1.5">
                      <label htmlFor="commodity-quantity" className="block text-xs sm:text-sm font-bold text-slate-800">
                        Quantity / അളവ് <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative rounded-2xl shadow-xs">
                        <input
                          type="text"
                          id="commodity-quantity"
                          value={quantity}
                          onChange={handleQuantityChange}
                          placeholder="Enter quantity"
                          required
                          className="block w-full rounded-2xl border border-slate-300 bg-slate-50/80 hover:bg-white focus:bg-white px-4 py-2.5 sm:py-3 text-slate-900 text-sm font-bold placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. NOTES (OPTIONAL) */}
                <div className="space-y-1.5">
                  <label htmlFor="donation-notes" className="block text-xs sm:text-sm font-bold text-slate-800">
                    Notes / കുറിപ്പ് <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative rounded-2xl shadow-xs">
                    <textarea
                      id="donation-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter remarks or notes (optional)"
                      className="block w-full rounded-2xl border border-slate-300 bg-slate-50/80 hover:bg-white focus:bg-white px-4 py-2.5 sm:py-3 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>

                {/* 8. SECURITY CODE INPUT FIELD (WHEN CLUB IS CHOSEN - LAST FIELD BEFORE SUBMIT) */}
                {donorType === 'ORGANIZATION' && (
                  <div className="space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <label htmlFor="security-code" className="block text-xs sm:text-sm font-bold text-slate-800">
                        Security Code / സെക്യൂരിറ്റി കോഡ് (6 അക്കങ്ങൾ) <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                        Required for Club
                      </span>
                    </div>

                    <div className="relative rounded-2xl shadow-xs">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
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
                        className="block w-full rounded-2xl border border-slate-300 bg-slate-50/80 hover:bg-white focus:bg-white text-slate-900 pl-10 pr-11 py-2.5 sm:py-3 text-sm font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal placeholder:text-xs sm:placeholder:text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecurityCode((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
                        title={showSecurityCode ? 'സെക്യൂരിറ്റി കോഡ് മറയ്ക്കുക' : 'സെക്യൂരിറ്റി കോഡ് കാണുക'}
                      >
                        {showSecurityCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      ക്ലബ്ബ് രജിസ്ട്രേഷൻ സമയത്ത് നൽകിയ 6 അക്ക രഹസ്യ കോഡ് നൽകുക
                    </p>
                  </div>
                )}

                {/* 9. SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                        <span>Submitting Donation...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 fill-white shrink-0" />
                        <span>
                          Submit {donorType === 'ORGANIZATION' ? 'Club ' : ''}{donationType === 'CASH' ? 'Cash' : 'Commodity'} Donation
                        </span>
                        <Send className="w-4 h-4 shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              </form>
                </div>
              </div>

              {/* RIGHT SECTION: STANDALONE QR CODE PAYMENT SECTION */}
              <div className="lg:col-span-5 lg:sticky lg:top-8">
                <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-5 text-center relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

                  <div className="space-y-1.5 max-w-md mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Scan & Pay via UPI • ബാങ്ക് / UPI വഴി തുക നൽകാം</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Payment QR Code / സംഭാവന ക്യുആർ കോഡ്
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Scan using Google Pay, PhonePe, Paytm or any UPI app
                    </p>
                  </div>

                  <div className="bg-gradient-to-b from-slate-50 to-white p-3.5 sm:p-4 rounded-2xl border-2 border-emerald-500/25 shadow-md inline-block mx-auto max-w-full">
                    <img
                      src="https://media.raihsuite.com/RS0001/web/ilu/Donation-QR.jpeg"
                      alt="ILU Donation QR Code"
                      className="w-56 sm:w-64 h-auto mx-auto rounded-xl object-contain block shadow-xs"
                    />
                  </div>

                  <div className="space-y-3 max-w-md mx-auto">
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-xs sm:text-sm leading-relaxed">
                      തുക അയച്ച ശേഷം <span className="text-emerald-700 font-black">7907531608</span> എന്ന നമ്പറിലേക് സ്ക്രീൻ ഷോർട്ട് WhatsApp ചെയ്യുക
                    </div>

                    <a
                      href="https://wa.me/917907531608?text=%E0%B4%A4%E0%B5%81%E0%B4%95%20%E0%B4%85%E0%B4%AF%E0%B4%9A%E0%B5%8D%E0%B4%9A%E0%B4%A4%E0%B4%BF%E0%B4%A8%E0%B5%8D%E0%B4%B1%E0%B5%86%20%E0%B4%B8%E0%B5%8D%E0%B4%95%E0%B5%8D%E0%B4%B0%E0%B5%80%E0%B4%A8%E0%B5%8D%E2%80%8D%20%E0%B4%B7%E0%B5%8B%E0%B4%9F%E0%B5%8D%E0%B4%9F%E0%B5%8D%20(Donation%20Screenshot)"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Screenshot (+91 79075 31608)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
