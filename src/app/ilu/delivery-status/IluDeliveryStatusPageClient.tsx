'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  RefreshCw,
  AlertTriangle,
  X,
  Truck,
} from 'lucide-react';

import {
  DeliveryStatusResponse,
  fetchDeliveryStatusApi,
} from '@/lib/iluService';

function useAnimatedCount(targetNumber: number, stepIntervalMs: number = 1000 / 3) {
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [overlayProgress, setOverlayProgress] = useState<number>(0);
  const displayedCountRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!targetNumber || targetNumber <= 0) {
      if (!isInitializedRef.current) {
        setDisplayedCount(0);
        displayedCountRef.current = 0;
        setOverlayProgress(0);
      }
      return;
    }

    if (!isInitializedRef.current) {
      setDisplayedCount(targetNumber);
      displayedCountRef.current = targetNumber;
      setOverlayProgress(1);
      isInitializedRef.current = true;
      return;
    }

    const currentVal = displayedCountRef.current;
    const diff = targetNumber - currentVal;

    if (diff === 0) return;

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

export default function IluDeliveryStatusPageClient() {
  const [data, setData] = useState<DeliveryStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isFetchingRef = useRef(false);
  const refreshQueuedRef = useRef(false);

  const loadDeliveryStatus = async (mode: 'initial' | 'manual' | 'silent' = 'initial') => {
    if (isFetchingRef.current) {
      refreshQueuedRef.current = true;
      return;
    }

    try {
      isFetchingRef.current = true;
      if (mode === 'manual') {
        setRefreshing(true);
      } else if (mode === 'initial') {
        setLoading(true);
      }
      setError(null);

      const res = await fetchDeliveryStatusApi();
      if (res) {
        setData(res);
      }
    } catch (err: unknown) {
      if (mode !== 'silent') {
        const msg = err instanceof Error ? err.message : 'ഡെലിവറി വിവരങ്ങൾ ലഭ്യമാക്കാൻ കഴിഞ്ഞില്ല.';
        setError(msg);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetchingRef.current = false;
      if (refreshQueuedRef.current) {
        refreshQueuedRef.current = false;
        loadDeliveryStatus('silent');
      }
    }
  };

  useEffect(() => {
    loadDeliveryStatus('initial');
    const interval = setInterval(() => {
      loadDeliveryStatus('silent');
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filter summaries based on search query
  const filteredSummaries = useMemo(() => {
    if (!data?.summaries) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data.summaries;

    return data.summaries.filter(
      (s) =>
        s.clubName.toLowerCase().includes(query) ||
        (s.location && s.location.toLowerCase().includes(query))
    );
  }, [data?.summaries, searchQuery]);

  // Grand total delivered liters animation
  const totalDeliveredLiters = data?.totalDeliveredLiters || 0;
  const { displayedCount, overlayProgress } = useAnimatedCount(totalDeliveredLiters);

  return (
    <div className="min-h-screen bg-[#fffdf7] text-slate-800 relative selection:bg-amber-400 selection:text-amber-950">
      {/* BACKGROUND GRAPHIC */}
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

      {/* HERO BANNER SECTION (DESKTOP) */}
      <section className="hidden sm:block w-full relative z-10 shadow-md">
        <div className="w-full relative">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="https://media.raihsuite.com/RS0001/web/ilu/order-status-banner-mobile.webp"
            />
            <source
              media="(min-width: 641px)"
              srcSet="https://media.raihsuite.com/RS0001/web/ilu/orderstatus-page-banner.jpeg"
            />
            <img
              src="https://media.raihsuite.com/RS0001/web/ilu/orderstatus-page-banner.jpeg"
              alt="ILU Foundation Palada Challenge Delivery Status"
              className="w-full h-auto object-cover block"
            />
          </picture>

          {/* Signature Festival Gradient Bottom Ribbon */}
          <div
            className="w-full h-1.5 sm:h-2 bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] shadow-sm"
            aria-hidden="true"
          />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-8 relative z-10 space-y-4 sm:space-y-6">

        {/* TOP STATUS NAVIGATION TABS */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1 bg-amber-100/80 border border-amber-200/90 rounded-full shadow-inner gap-1">
            <Link
              href="/ilu/order-status"
              className="px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 hover:bg-white/60 transition-all flex items-center gap-1.5"
            >
              <span>📋 Order Status</span>
            </Link>
            <div
              className="px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-black bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] text-white shadow-md flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span>Delivery Status</span>
            </div>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-4 text-sm shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={() => loadDeliveryStatus('manual')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
            >
              Retry
            </button>
          </div>
        )}

        {/* TOTAL DELIVERED STAT CARD - SHOWCASE MILESTONE */}
        <section>
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#14532d] via-[#15803d] via-[#047857] to-[#0284c7] p-4 sm:p-6 md:p-8 shadow-xl shadow-emerald-950/20 border-2 border-white/20 text-white relative overflow-hidden min-h-[110px] sm:min-h-[150px] flex flex-col justify-between">
            {/* Top hairline border glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            {/* Ambient Background Glow */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out z-0"
              style={{ opacity: overlayProgress }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-emerald-200/15 to-white/20 transition-transform duration-500 ease-out"
                style={{
                  transform: `scaleX(${0.1 + overlayProgress * 0.9})`,
                  transformOrigin: 'right center',
                }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-500 ease-out"
                style={{
                  transform: `scale(${0.7 + overlayProgress * 0.4})`,
                  opacity: 0.3 + overlayProgress * 0.7,
                }}
              >
                <div className="w-96 h-96 rounded-full bg-emerald-300/25 blur-3xl" />
              </div>
            </div>

            {/* Top Header Row */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-sm">
                  Total Palada Delivered
                </h2>
                <p className="text-[11px] sm:text-xs text-emerald-100/90 font-medium">
                  വിതരണം പൂർത്തിയായ ആകെ അളവ്
                </p>
              </div>

              {/* Live Status Pill */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-sm border border-white/20 text-emerald-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Delivery
                </span>
                <button
                  type="button"
                  onClick={() => loadDeliveryStatus('manual')}
                  disabled={refreshing || loading}
                  title="Refresh Delivery Status"
                  className="p-1.5 sm:p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 text-white transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Center: Big Highlighted Count + LTR */}
            <div className="relative z-10 flex items-baseline justify-center gap-2 sm:gap-3 py-2 sm:py-3 my-auto">
              <span className="text-5xl sm:text-7xl md:text-8xl font-black text-yellow-300 font-mono tracking-tight drop-shadow-[0_4px_16px_rgba(250,204,21,0.45)]">
                {loading ? '...' : displayedCount.toLocaleString()}
              </span>
              <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wider drop-shadow-md">
                LTR
              </span>
            </div>
          </div>
        </section>

        {/* DELIVERY LEADERBOARD TABLE SECTION */}
        <section className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl shadow-amber-950/5 border border-amber-200/60 overflow-hidden relative">
          {/* Header & Search Bar */}
          <div className="p-3.5 sm:p-6 border-b border-amber-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                  Organization Delivery Leaderboard
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ഏറ്റവും കൂടുതൽ വിതരണം ചെയ്ത ക്ലബ്ബുകൾ ക്രമത്തിൽ (More delivered on top)
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search club name or place..."
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-600">
                  <th scope="col" className="py-3.5 px-4 text-center w-16">
                    #
                  </th>
                  <th scope="col" className="py-3.5 px-6 font-bold">
                    Club / Organization
                  </th>
                  <th scope="col" className="py-3.5 px-6 font-bold text-right">
                    Total Delivered (Liters)
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [1, 2, 3, 4, 5].map((idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-4 text-center">
                        <div className="h-6 w-6 bg-slate-100 rounded-full mx-auto" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-slate-100 rounded w-48" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="h-5 bg-emerald-100 rounded w-24 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : filteredSummaries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-slate-500 font-medium">
                      {searchQuery
                        ? `No organizations found matching "${searchQuery}"`
                        : 'No delivered orders recorded yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredSummaries.map((summary) => (
                    <tr
                      key={summary.clubId}
                      className={`transition-colors ${
                        summary.totalDeliveredLiters > 0
                          ? 'hover:bg-emerald-50/30'
                          : 'opacity-65 hover:bg-slate-50'
                      }`}
                    >
                      {/* Rank # */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-xs sm:text-sm text-slate-500 font-mono">
                          {summary.rank}
                        </span>
                      </td>

                      {/* Club Name */}
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm sm:text-base font-bold text-slate-900">
                            {summary.clubName}
                          </span>
                          {summary.location && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-normal">
                              {summary.location}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Delivered in Litres */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-baseline justify-end gap-1.5">
                          <span
                            className={`text-base sm:text-lg font-black tracking-tight ${
                              summary.totalDeliveredLiters > 0
                                ? 'text-emerald-700 font-mono font-black'
                                : 'text-slate-400 font-mono'
                            }`}
                          >
                            {summary.totalDeliveredLiters.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            LTR
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="md:hidden divide-y divide-slate-100">
            {loading ? (
              [1, 2, 3, 4].map((idx) => (
                <div key={idx} className="p-3.5 space-y-2.5 animate-pulse">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-slate-100 rounded-full" />
                    <div className="h-4 bg-slate-100 rounded w-36" />
                  </div>
                  <div className="h-6 bg-slate-100 rounded w-28 ml-auto" />
                </div>
              ))
            ) : filteredSummaries.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-xs font-medium">
                {searchQuery
                  ? `No organizations found matching "${searchQuery}"`
                  : 'No delivered orders recorded yet.'}
              </div>
            ) : (
              filteredSummaries.map((summary) => (
                <div
                  key={summary.clubId}
                  className={`p-3.5 transition-colors ${
                    summary.totalDeliveredLiters > 0
                      ? 'hover:bg-slate-50/50'
                      : 'opacity-65'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    {/* Left: Rank + Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200/70 font-mono">
                        #{summary.rank}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {summary.clubName}
                          </span>
                        </div>
                        {summary.location && (
                          <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                            {summary.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Quantity in Liters */}
                    <div className="text-right shrink-0">
                      <span className={`text-sm sm:text-base font-black font-mono ${summary.totalDeliveredLiters > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {summary.totalDeliveredLiters.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 ml-1">
                        LTR
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* BOTTOM ACTION BUTTONS */}
        <section className="pt-2 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/ilu/order-status"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm shadow-sm transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>📋 View Order Status Portal</span>
          </Link>
          <Link
            href="/ilu"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#ea183c]/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Submit New Orders</span>
          </Link>
        </section>
      </div>
    </div>
  );
}

