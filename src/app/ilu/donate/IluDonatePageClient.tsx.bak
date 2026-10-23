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
  Package,
  Send,
  Loader2,
  Check,
  PartyPopper,
  Sparkles,
  RefreshCw,
  ChevronDown,
  Search,
  X,
} from 'lucide-react';
import {
  FundraisingItem,
  DonationResponse,
  fetchFundraisingItemsApi,
  submitDonationApi,
} from '@/lib/iluService';

type DonationType = 'CASH' | 'COMMODITY';

export default function IluDonatePageClient() {
  // Form State
  const [donationType, setDonationType] = useState<DonationType>('CASH');
  const [donorName, setDonorName] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [fundraisingItemId, setFundraisingItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  // Dropdown UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Commodity Items state
  const [fundraisingItems, setFundraisingItems] = useState<FundraisingItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedDonation, setSubmittedDonation] = useState<DonationResponse | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        // Reset search term back to selected item's name if not matching
        const currentSelected = fundraisingItems.find((item) => item.id === fundraisingItemId);
        if (currentSelected) {
          setItemSearchTerm(currentSelected.name);
        } else {
          setItemSearchTerm('');
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fundraisingItems, fundraisingItemId]);

  // Fetch fundraising items on mount
  useEffect(() => {
    let isMounted = true;
    async function loadItems() {
      setLoadingItems(true);
      setItemsError(null);
      try {
        const items = await fetchFundraisingItemsApi();
        if (isMounted) {
          setFundraisingItems(items);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setItemsError(
            err instanceof Error ? err.message : 'Failed to load fundraising items'
          );
        }
      } finally {
        if (isMounted) {
          setLoadingItems(false);
        }
      }
    }

    loadItems();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter items by search
  const filteredItems = useMemo(() => {
    const query = itemSearchTerm.trim().toLowerCase();
    const currentSelected = fundraisingItems.find((item) => item.id === fundraisingItemId);

    // If query is empty or matches the currently selected item's name, show all items
    if (!query || (currentSelected && query === currentSelected.name.toLowerCase())) {
      return fundraisingItems;
    }
    return fundraisingItems.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [fundraisingItems, itemSearchTerm, fundraisingItemId]);

  const handleSelectItem = (item: FundraisingItem) => {
    setFundraisingItemId(item.id);
    setItemSearchTerm(item.name);
    setIsDropdownOpen(false);
    setErrorMessage(null);
  };

  const handleClearItem = () => {
    setFundraisingItemId('');
    setItemSearchTerm('');
    setIsDropdownOpen(true);
    inputRef.current?.focus();
  };

  const handleToggleDropdown = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      const currentSelected = fundraisingItems.find((item) => item.id === fundraisingItemId);
      if (currentSelected) {
        setItemSearchTerm(currentSelected.name);
      } else {
        setItemSearchTerm('');
      }
    } else {
      setIsDropdownOpen(true);
      inputRef.current?.focus();
    }
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
    inputRef.current?.select();
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanNumber = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setMobile(cleanNumber);
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

    // Validation
    const trimmedName = donorName.trim();
    if (!trimmedName) {
      setErrorMessage('ദയവായി ദാതാവിന്റെ പേര് നൽകുക (Please enter donor name).');
      return;
    }

    const cleanMobile = mobile.trim();
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMessage('ദയവായി ശരിയായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക (Please enter a valid 10-digit mobile number).');
      return;
    }

    if (donationType === 'CASH') {
      const numAmount = Number(amount);
      if (!amount || Number.isNaN(numAmount) || numAmount <= 0) {
        setErrorMessage('ദയവായി സാധുവായ ഒരു തുക നൽകുക (Please enter a valid donation amount).');
        return;
      }
    } else {
      if (!fundraisingItemId) {
        setErrorMessage('ദയവായി സംഭാവന നൽകുന്ന ഇനം തിരഞ്ഞെടുക്കുക (Please select a fundraising item).');
        return;
      }

      if (!quantity.trim()) {
        setErrorMessage('ദയവായി അളവ് രേഖപ്പെടുത്തുക (Please enter a valid quantity).');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await submitDonationApi({
        donation_type: donationType,
        donor_name: trimmedName,
        mobile: cleanMobile,
        amount: donationType === 'CASH' ? Number(amount).toFixed(2) : null,
        fundraising_item: donationType === 'COMMODITY' ? fundraisingItemId : null,
        quantity: donationType === 'COMMODITY' ? quantity.trim() : null,
        notes: notes.trim(),
      });

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
    setDonorName('');
    setMobile('');
    setAmount('');
    setFundraisingItemId('');
    setItemSearchTerm('');
    setQuantity('');
    setNotes('');
    setErrorMessage(null);
  };

  const selectedItemObj = fundraisingItems.find((item) => item.id === fundraisingItemId);

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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
          {/* Back Navigation Button */}
          <div>
            <Link
              href="/ilu"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-700 transition group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Palada Challenge & Order Submission</span>
            </Link>
          </div>

          {/* SUCCESS CONFIRMATION RECEIPT */}
          {submittedDonation ? (
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
                  <span className="text-slate-500 font-medium">Donor Name:</span>
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
                        {selectedItemObj?.name || 'Item'}
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
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
          ) : (
            /* MAIN DONATION FORM CARD */
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
                  Please select your donation type and fill in the details below.
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
                {/* 1. DONATION TYPE TOGGLE BUTTONS: 1. CASH | 2. COMMODITY */}
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
                      className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
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
                      className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
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

                {/* 2. COMMON FIELD: DONOR NAME */}
                <div className="space-y-1.5">
                  <label htmlFor="donor-name" className="block text-xs sm:text-sm font-bold text-slate-800">
                    Donor Name / പേര് <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <input
                      type="text"
                      id="donor-name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Enter donor name"
                      required
                      className="block w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 sm:py-3 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* 3. COMMON FIELD: MOBILE NUMBER */}
                <div className="space-y-1.5">
                  <label htmlFor="donor-mobile" className="block text-xs sm:text-sm font-bold text-slate-800">
                    Mobile Number / ഫോൺ നമ്പർ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-xs">
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
                      className="block w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 sm:py-3 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition font-mono"
                    />
                  </div>
                </div>

                {/* 4. MODE SPECIFIC FIELDS */}
                {donationType === 'CASH' ? (
                  /* CASH MODE: AMOUNT ONLY (Numbers section removed) */
                  <div className="space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <label htmlFor="cash-amount" className="block text-xs sm:text-sm font-bold text-slate-800">
                        Amount (₹) / തുക <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">In Indian Rupees (INR)</span>
                    </div>
                    <div className="relative rounded-xl shadow-xs">
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
                        className="block w-full rounded-xl border border-slate-300 pl-9 pr-4 py-2.5 sm:py-3 text-slate-900 text-base font-bold placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  /* COMMODITY MODE: FUNDRAISING_ITEM & QUANTITY */
                  <div className="space-y-4 animate-fade-in">
                    {/* SELECT & SEARCH COMBOBOX FOR FUNDRAISING ITEM */}
                    <div className="space-y-1.5" ref={dropdownRef}>
                      <div className="flex items-center justify-between">
                        <label htmlFor="item-combobox-input" className="block text-xs sm:text-sm font-bold text-slate-800">
                          Fundraising Item / സാധനം <span className="text-rose-500">*</span>
                        </label>
                        {loadingItems ? (
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Loading items...
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            {fundraisingItems.length} {fundraisingItems.length === 1 ? 'item' : 'items'}
                          </span>
                        )}
                      </div>

                      {/* Select & Search Input Container */}
                      <div className="relative">
                        {/* Left Icon: Package if item selected, else Search */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          {selectedItemObj ? (
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                          ) : (
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                          )}
                        </div>

                        <input
                          ref={inputRef}
                          type="text"
                          id="item-combobox-input"
                          value={itemSearchTerm}
                          onChange={(e) => {
                            setItemSearchTerm(e.target.value);
                            if (!isDropdownOpen) setIsDropdownOpen(true);
                            if (selectedItemObj && e.target.value.toLowerCase() !== selectedItemObj.name.toLowerCase()) {
                              setFundraisingItemId('');
                            }
                          }}
                          onFocus={handleInputFocus}
                          onClick={() => {
                            if (!isDropdownOpen) setIsDropdownOpen(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setIsDropdownOpen(false);
                            } else if (e.key === 'ArrowDown' && !isDropdownOpen) {
                              setIsDropdownOpen(true);
                            }
                          }}
                          placeholder="Select or search fundraising item"
                          autoComplete="off"
                          className={`block w-full rounded-xl pl-10 pr-20 py-2.5 sm:py-3 text-sm font-semibold transition-all shadow-xs ${
                            isDropdownOpen
                              ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/15 bg-white text-slate-900 focus:outline-none'
                              : selectedItemObj
                              ? 'border-2 border-emerald-400/80 bg-emerald-50/30 text-emerald-950 hover:border-emerald-500'
                              : 'border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none'
                          }`}
                        />

                        {/* Right Controls: Clear (X) + Dropdown Toggle Chevron */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                          {(itemSearchTerm || fundraisingItemId) && (
                            <button
                              type="button"
                              onClick={handleClearItem}
                              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                              title="Clear selection"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={handleToggleDropdown}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                            title={isDropdownOpen ? 'Close items list' : 'Show all items'}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isDropdownOpen ? 'rotate-180 text-emerald-600' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Dropdown In-Flow List (Pushes down Quantity field below instead of overlaying it) */}
                      {isDropdownOpen && (
                        <div className="mt-2 rounded-2xl bg-white border-2 border-emerald-500 shadow-xl shadow-emerald-950/10 p-2 animate-fade-in space-y-1 max-h-60 overflow-y-auto">
                          {loadingItems ? (
                            <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
                              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                              <span>Loading fundraising items...</span>
                            </div>
                          ) : filteredItems.length === 0 ? (
                            <div className="py-6 text-center text-xs text-slate-500 font-medium space-y-1">
                              <p>No items found matching &quot;{itemSearchTerm}&quot;</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setItemSearchTerm('');
                                  inputRef.current?.focus();
                                }}
                                className="text-xs text-emerald-600 hover:text-emerald-800 font-bold underline"
                              >
                                Clear search to view all {fundraisingItems.length} items
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center border-b border-slate-100 mb-1">
                                <span>Select an item</span>
                                <span>{filteredItems.length} available</span>
                              </div>
                              {filteredItems.map((item) => {
                                const isSelected = item.id === fundraisingItemId;
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelectItem(item)}
                                    className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-all text-xs sm:text-sm ${
                                      isSelected
                                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                                        : 'hover:bg-emerald-50/80 text-slate-800 hover:text-emerald-950 font-semibold'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div
                                        className={`p-1.5 rounded-lg shrink-0 ${
                                          isSelected
                                            ? 'bg-emerald-700 text-white'
                                            : 'bg-emerald-100 text-emerald-800'
                                        }`}
                                      >
                                        <Package className="w-4 h-4" />
                                      </div>
                                      <span className="capitalize truncate">{item.name}</span>
                                    </div>
                                    {isSelected && (
                                      <Check className="w-4 h-4 shrink-0 text-white stroke-[2.5] ml-2" />
                                    )}
                                  </button>
                                );
                              })}
                            </>
                          )}
                        </div>
                      )}

                      {itemsError && (
                        <p className="text-[11px] text-rose-500 font-medium">{itemsError}</p>
                      )}
                    </div>

                    {/* Quantity Field */}
                    <div className="space-y-1.5">
                      <label htmlFor="commodity-quantity" className="block text-xs sm:text-sm font-bold text-slate-800">
                        Quantity / അളവ് <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative rounded-xl shadow-xs">
                        <input
                          type="text"
                          id="commodity-quantity"
                          value={quantity}
                          onChange={handleQuantityChange}
                          placeholder="Enter quantity"
                          required
                          className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 sm:py-3 text-slate-900 text-sm font-bold placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                )}


                {/* 6. COMMON FIELD: NOTES (OPTIONAL) */}
                <div className="space-y-1.5">
                  <label htmlFor="donation-notes" className="block text-xs sm:text-sm font-bold text-slate-800">
                    Notes / കുറിപ്പ് <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <textarea
                      id="donation-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter remarks or notes (optional)"
                      className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 sm:py-3 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
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
                          Submit {donationType === 'CASH' ? 'Cash' : 'Commodity'} Donation
                        </span>
                        <Send className="w-4 h-4 shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
