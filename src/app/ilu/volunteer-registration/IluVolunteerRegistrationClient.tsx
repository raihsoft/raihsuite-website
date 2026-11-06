'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Phone,
  Building2,
  MapPin,
  CheckCircle2,
  Download,
  Printer,
  AlertCircle,
  Loader2,
  PlusCircle,
  IdCard,
} from 'lucide-react';

import {
  registerVolunteer,
  formatVolunteerPassId,
  validateMobileNumber,
  resolveProgramIdByCode,
  ILU_VOLUNTEER_PROGRAM_CODE,
  VolunteerParticipant,
} from '@/lib/iluVolunteerService';
import {
  generateVolunteerSlipDataUrl,
  downloadVolunteerSlipImage,
} from '@/lib/iluVolunteerSlip';

const LOCAL_STORAGE_KEY = 'ilu_volunteer_registration_last';

export default function IluVolunteerRegistrationClient() {
  // Form fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [clubName, setClubName] = useState('');
  const [place, setPlace] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    mobile?: string;
    clubName?: string;
    place?: string;
  }>({});

  // Success & Slip State
  const [registeredVolunteer, setRegisteredVolunteer] =
    useState<VolunteerParticipant | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Pre-resolve program ID from code on mount & check localStorage for recent slip
  useEffect(() => {
    resolveProgramIdByCode(ILU_VOLUNTEER_PROGRAM_CODE).catch(() => {});

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.first_name) {
          setRegisteredVolunteer(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanNumber = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setMobile(cleanNumber);
    if (fieldErrors.mobile) {
      setFieldErrors((prev) => ({ ...prev, mobile: undefined }));
    }
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const errors: {
      name?: string;
      mobile?: string;
      clubName?: string;
      place?: string;
    } = {};

    if (!name.trim()) {
      errors.name = 'Please enter full name.';
    }

    const mobVal = validateMobileNumber(mobile);
    if (!mobVal.isValid) {
      errors.mobile = mobVal.error;
    }

    if (!place.trim()) {
      errors.place = 'Please enter place.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const volunteer = await registerVolunteer({
        name: name.trim(),
        mobile: mobVal.cleanNumber,
        clubName: clubName.trim(),
        place: place.trim(),
        programCode: ILU_VOLUNTEER_PROGRAM_CODE,
      });

      setRegisteredVolunteer(volunteer);

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(volunteer));
      } catch {
        // Ignore storage errors
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSlip = async () => {
    if (!registeredVolunteer) return;
    setIsDownloading(true);
    try {
      const dataUrl = await generateVolunteerSlipDataUrl(registeredVolunteer);
      const passId =
        registeredVolunteer.code ||
        formatVolunteerPassId(registeredVolunteer);
      downloadVolunteerSlipImage(
        dataUrl,
        registeredVolunteer.first_name || registeredVolunteer.participant_name,
        passId
      );
    } catch (err) {
      console.error('Failed to generate volunteer slip image:', err);
      alert('Could not download slip. Please use Print to save as PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRegisterAnother = () => {
    setRegisteredVolunteer(null);
    setName('');
    setMobile('');
    setClubName('');
    setPlace('');
    setErrorMessage(null);
    setFieldErrors({});
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-[#fffdf7] text-slate-800 min-h-screen font-sans">
      <div className="py-6 sm:py-10 pb-16 relative z-10">
        <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Top Back Navigation */}
          <div className="print:hidden">
            <Link
              href="/ilu"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>

          {/* ================= SUCCESS VIEW: VOLUNTEER SLIP PASS ================= */}
          {registeredVolunteer ? (
            <div className="space-y-5">
              {/* Top Banner with Highlighted Add New Button */}
              <div className="print:hidden rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-emerald-950 leading-tight">
                      Volunteer Registered!
                    </h3>
                    <p className="text-xs text-emerald-700">
                      Pass #{registeredVolunteer.code || formatVolunteerPassId(registeredVolunteer)} is ready.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRegisterAnother}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400 ring-offset-1 transition active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="print:hidden flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadSlip}
                  disabled={isDownloading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition disabled:opacity-75"
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>Download Slip</span>
                </button>

                <button
                  type="button"
                  onClick={handleRegisterAnother}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400 ring-offset-2 transition active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-300 shadow-xs transition"
                  title="Print Slip"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>

              {/* VOLUNTEER PASS CARD (NO QR CODE) */}
              <div
                id="printable-volunteer-slip"
                className="rounded-2xl bg-white border border-emerald-500 shadow-xl overflow-hidden print:border print:shadow-none print:m-0"
              >
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://media.raihsuite.com/RS0001/web/ilu/tv-display-logo.png"
                      alt="ILU Foundation"
                      className="h-12 w-auto object-contain rounded-md"
                    />
                    <div>
                      <span className="text-[11px] font-bold tracking-widest uppercase text-amber-300">
                        PALADA CHALLENGE 2026
                      </span>
                      <h2 className="text-xl font-black text-white">
                        OFFICIAL VOLUNTEER PASS
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Pass Number Badge */}
                <div className="pt-5 text-center">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm tracking-wide">
                    <IdCard className="w-4 h-4" />
                    <span>
                      PASS NO: {registeredVolunteer.code || formatVolunteerPassId(registeredVolunteer)}
                    </span>
                  </span>
                </div>

                {/* Volunteer Details */}
                <div className="p-6 space-y-5">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Volunteer Name
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {registeredVolunteer.first_name ||
                        registeredVolunteer.participant_name}
                    </h1>
                    <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Volunteer</span>
                    </div>
                  </div>

                  {/* 2x2 Clean Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        WhatsApp Number
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900">
                        +91 {registeredVolunteer.phone}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Date
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900">
                        {new Date(
                          registeredVolunteer.created_at || Date.now()
                        ).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block truncate" title="Club / Organization / Institution">
                        Club / Organization / Institution
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 truncate block">
                        {(registeredVolunteer.custom_data?.club_name as string) || '-'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Place
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 truncate block">
                        {registeredVolunteer.place || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-emerald-900">
                    ILU Foundation Kerala
                  </span>
                  <span>raihsoft.com</span>
                </div>
              </div>

              {/* Highlighted Add New Volunteer Button */}
              <div className="print:hidden pt-2 text-center">
                <button
                  type="button"
                  onClick={handleRegisterAnother}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-400 ring-offset-2 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Add New Volunteer</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= REGISTRATION FORM VIEW ================= */
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  ILU Palada Challenge 2026
                </span>
                <h1 className="text-2xl font-black text-slate-900">
                  Volunteer Registration
                </h1>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 border border-rose-300 p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Name */}
                <div className="space-y-1">
                  <label
                    htmlFor="volunteer-name"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="volunteer-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) {
                          setFieldErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      }}
                      placeholder="Enter full name"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition ${
                        fieldErrors.name
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white'
                      }`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-xs text-rose-600">{fieldErrors.name}</p>
                  )}
                </div>

                {/* 2. WhatsApp Number */}
                <div className="space-y-1">
                  <label
                    htmlFor="volunteer-mobile"
                    className="block text-xs font-bold text-slate-700"
                  >
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
                      <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>+91</span>
                    </div>
                    <input
                      id="volunteer-mobile"
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={handleMobileChange}
                      placeholder="10-digit WhatsApp number"
                      className={`w-full pl-14 pr-3.5 py-2.5 rounded-lg border text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition ${
                        fieldErrors.mobile
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white'
                      }`}
                    />
                  </div>
                  {fieldErrors.mobile && (
                    <p className="text-xs text-rose-600">{fieldErrors.mobile}</p>
                  )}
                </div>

                {/* 3. Club / Organization / Institution Name (Optional) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="volunteer-club"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Club / Organization / Institution Name
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Optional
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      id="volunteer-club"
                      type="text"
                      value={clubName}
                      onChange={(e) => {
                        setClubName(e.target.value);
                        if (fieldErrors.clubName) {
                          setFieldErrors((prev) => ({ ...prev, clubName: undefined }));
                        }
                      }}
                      placeholder="Enter club / organization / institution (optional)"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition ${
                        fieldErrors.clubName
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white'
                      }`}
                    />
                  </div>
                  {fieldErrors.clubName && (
                    <p className="text-xs text-rose-600">{fieldErrors.clubName}</p>
                  )}
                </div>

                {/* 4. Place */}
                <div className="space-y-1">
                  <label
                    htmlFor="volunteer-place"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Place
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      id="volunteer-place"
                      type="text"
                      required
                      value={place}
                      onChange={(e) => {
                        setPlace(e.target.value);
                        if (fieldErrors.place) {
                          setFieldErrors((prev) => ({ ...prev, place: undefined }));
                        }
                      }}
                      placeholder="Enter place / town"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition ${
                        fieldErrors.place
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white'
                      }`}
                    />
                  </div>
                  {fieldErrors.place && (
                    <p className="text-xs text-rose-600">{fieldErrors.place}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md transition flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Register Volunteer</span>
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
