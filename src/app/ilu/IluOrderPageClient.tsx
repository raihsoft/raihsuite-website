'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Leaf,
  User,
  Phone,
  Droplet,
  AlertCircle,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Send,
  Users,
  Sparkles,
  PartyPopper,
  ChevronDown,
} from 'lucide-react';
import { Club, Order, fetchClubsApi, submitOrderApi } from '@/lib/iluService';

export default function IluOrderPageClient() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [clubsError, setClubsError] = useState<string | null>(null);

  // Form State
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [quantity, setQuantity] = useState<string>('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoadingClubs(true);
        const data = await fetchClubsApi();
        if (isMounted) {
          setClubs(data);
          setClubsError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setClubsError(err.message || 'Failed to load clubs list');
        }
      } finally {
        if (isMounted) setLoadingClubs(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clubId = e.target.value;
    setSelectedClubId(clubId);
    setValidationError(null);

    const found = clubs.find((c) => c.id === clubId);
    setSelectedClub(found || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedClubId) {
      setValidationError('Please select your club from the directory.');
      return;
    }

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setValidationError('Please enter a valid payasam quantity in liters.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = await submitOrderApi(selectedClubId, qtyNum);
      setSubmittedOrder(newOrder);
      setSelectedClubId('');
      setSelectedClub(null);
      setQuantity('');
    } catch (err: any) {
      setValidationError(err.message || 'An error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-transparent text-slate-100 min-h-screen font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Background Image Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#030b1e]">
        <picture className="block w-full h-full">
          <source media="(max-width: 1023px)" srcSet="https://media.raihsuite.com/RS0001/web/ilu/ilu-bg-mobile.png" />
          <img
            src="https://media.raihsuite.com/RS0001/web/ilu/ilu-bg.png"
            alt="Background"
            className="w-full h-full object-cover object-top"
          />
        </picture>
        <div className="absolute inset-0 bg-[#030b1e]/40" />
      </div>

      {/* Background Decorator Elements */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#05163b]/60 via-[#030b1e]/60 to-transparent pointer-events-none" />

      {/* Floating Leaves & Gold Hearts Motifs */}
      <div className="absolute top-16 left-6 opacity-30 pointer-events-none hidden lg:block animate-float">
        <Leaf className="w-20 h-20 text-emerald-400 transform -rotate-12" />
      </div>
      <div className="absolute top-24 right-12 opacity-25 pointer-events-none hidden lg:block animate-float animation-delay-2000">
        <Heart className="w-12 h-12 text-[#f59e0b] stroke-2 fill-transparent transform rotate-12" />
      </div>
      <div className="absolute top-[480px] right-20 opacity-25 pointer-events-none hidden lg:block animate-float">
        <Leaf className="w-24 h-24 text-emerald-400 transform rotate-45" />
      </div>
      <div className="absolute top-[520px] left-12 opacity-30 pointer-events-none hidden lg:block animate-float animation-delay-4000">
        <Heart className="w-10 h-10 text-[#f59e0b] stroke-2 fill-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 space-y-12">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pt-2 relative">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4 text-center lg:text-left relative z-10">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-blue-300/80 uppercase">
              ILU FOUNDATION
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              Join the <span className="text-[#facc15]">Payasam</span> <br />
              Challenge!
            </h1>

            <div className="space-y-1 text-slate-300 text-xs sm:text-base max-w-lg mx-auto lg:mx-0 font-normal">
              <p>Be part of this special initiative by ILU Foundation.</p>
              <p>Place your club’s payasam order and join the challenge.</p>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative -mb-8 sm:-mb-20 lg:-mb-36 mr-0 lg:-mr-28 xl:-mr-36 translate-x-0 lg:translate-x-16 z-0 pointer-events-none">
            {/* Soft Subtle Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-400/05 to-amber-600/10 blur-2xl rounded-full scale-110 pointer-events-none opacity-40" />
            
            <img
              src="https://media.raihsuite.com/RS0001/web/ilu/payasam-img.png"
              alt="Kerala Payasam in Brass Uruli"
              className="relative z-0 w-64 sm:w-[420px] lg:w-[580px] xl:w-[680px] max-w-full lg:max-w-none h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(251,191,36,0.15)]"
            />
          </div>
        </section>

        {/* MAIN CLUB ORDER FORM CARD - Moved Upward & Highlighted */}
        <section id="order-form" className="scroll-mt-28 relative z-20 -mt-10 sm:-mt-16 lg:-mt-24">
          <div className="rounded-3xl bg-[#05163a]/95 backdrop-blur-xl border-2 border-blue-500/60 ring-1 ring-amber-400/40 p-6 sm:p-10 shadow-[0_30px_70px_rgba(1,6,18,0.95),0_0_45px_rgba(0,102,255,0.3)] space-y-8 relative overflow-hidden transition-all duration-300">
            {/* Top Glowing Highlight Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />
            
            {/* Form Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#fbbf24]/20 border border-[#fbbf24]/40 text-[#facc15] shadow-inner">
                <Droplet className="w-6 h-6 fill-[#facc15]" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                  Place Your Order
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  Select your club and enter the payasam quantity to join the challenge.
                </p>
              </div>
            </div>

            {/* Validation Alerts */}
            {validationError && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 flex items-center gap-3 text-sm animate-slide-up">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {clubsError && (
              <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{clubsError}</span>
              </div>
            )}

            {/* Form Fields Grid (2x2) */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 1: Select Club */}
                <div className="space-y-2">
                  <label htmlFor="club-select" className="block text-xs font-bold text-slate-200">
                    Select Club <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Users className="w-4 h-4" />
                    </div>
                    <select
                      id="club-select"
                      value={selectedClubId}
                      onChange={handleClubChange}
                      required
                      disabled={loadingClubs}
                      className="w-full bg-[#0c1f48] border border-blue-800/60 text-white rounded-xl pl-10 pr-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition appearance-none font-medium"
                    >
                      <option value="">
                        {loadingClubs ? 'Loading clubs directory...' : 'Choose your club'}
                      </option>
                      {clubs.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#081a3a] text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Field 2: Contact Person */}
                <div className="space-y-2">
                  <label htmlFor="contact-person" className="block text-xs font-bold text-slate-200">
                    Contact Person
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="contact-person"
                      readOnly
                      disabled
                      value={selectedClub ? selectedClub.contactPerson : ''}
                      placeholder="Auto-filled from club data"
                      className="w-full bg-[#0c1f48] border border-blue-900/40 text-slate-300 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none font-medium opacity-80 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Field 3: Mobile Number */}
                <div className="space-y-2">
                  <label htmlFor="mobile-number" className="block text-xs font-bold text-slate-200">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="mobile-number"
                      readOnly
                      disabled
                      value={selectedClub ? selectedClub.mobileNumber : ''}
                      placeholder="Auto-filled from club data"
                      className="w-full bg-[#0c1f48] border border-blue-900/40 text-slate-300 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none font-medium opacity-80 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Field 4: Quantity in Liters */}
                <div className="space-y-2">
                  <label htmlFor="quantity-input" className="block text-xs font-bold text-slate-200">
                    Quantity (Liters) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Droplet className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      id="quantity-input"
                      step="0.5"
                      min="0.5"
                      required
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="Enter quantity"
                      className="w-full bg-[#0c1f48] border border-blue-800/60 text-white rounded-xl pl-10 pr-14 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-semibold"
                    />
                    <div className="absolute right-3 bg-[#081738] text-blue-200 border border-blue-800/60 text-xs font-extrabold px-3 py-1 rounded-lg pointer-events-none">
                      L
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Enter the required payasam quantity in liters.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || loadingClubs}
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                      <span>Submitting Order...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950 fill-slate-950" />
                      <span>Submit Order</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* SUCCESS MODAL */}
        {submittedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md rounded-3xl bg-[#06173a] border border-amber-400/50 p-6 shadow-2xl text-slate-100 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <PartyPopper className="w-8 h-8 animate-bounce" />
              </div>

              <h3 className="text-2xl font-bold text-white">Order Submitted!</h3>

              <div className="p-4 rounded-2xl bg-[#040e21] border border-blue-900/60 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Ref:</span>
                  <span className="font-mono font-bold text-amber-300">{submittedOrder.orderRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Club:</span>
                  <span className="font-bold text-white">{submittedOrder.clubName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity:</span>
                  <span className="font-bold text-amber-400">{submittedOrder.quantityLiters} Liters (L)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/ilu/order-status"
                  className="py-2.5 px-4 rounded-full bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs shadow-md"
                >
                  View Order Status
                </Link>
                <button
                  onClick={() => setSubmittedOrder(null)}
                  className="py-2.5 px-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: "Want to see the latest orders?" */}
        <section>
          <div className="rounded-3xl bg-[#06173a] border border-blue-900/40 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Want to see the latest orders?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Check the total payasam quantity ordered by each club and see how the challenge is going!
              </p>
              <div className="pt-2">
                <Link
                  href="/ilu/order-status"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0066ff] hover:bg-blue-600 text-white font-semibold text-sm rounded-full shadow-lg shadow-blue-600/30 transition"
                >
                  <span>Check Order Status</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Payasam Bowl Photo */}
            <div className="relative shrink-0 w-28 sm:w-36 h-auto flex items-center justify-center">
              <img
                src="https://media.raihsuite.com/RS0001/web/ilu/payasam-img.png"
                alt="Payasam Bowl"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* 4 FEATURE COLUMNS */}
        <section className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-5 rounded-2xl bg-[#06173a]/80 border border-blue-900/30 space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto sm:mx-0">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Community Spirit</h4>
              <p className="text-xs text-slate-400">
                Clubs coming together for a larger purpose
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-2xl bg-[#06173a]/80 border border-blue-900/30 space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto sm:mx-0">
                <Heart className="w-5 h-5 fill-rose-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Support a Cause</h4>
              <p className="text-xs text-slate-400">
                Your participation creates real impact
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-2xl bg-[#06173a]/80 border border-blue-900/30 space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto sm:mx-0">
                <Leaf className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Spread Kindness</h4>
              <p className="text-xs text-slate-400">
                Every portion makes a difference
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-2xl bg-[#06173a]/80 border border-blue-900/30 space-y-2 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto sm:mx-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Build an Inclusive Tomorrow</h4>
              <p className="text-xs text-slate-400">
                Together for a brighter, more inclusive society
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
