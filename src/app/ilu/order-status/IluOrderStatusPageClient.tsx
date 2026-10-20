'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  BarChart3,
  X,
  Trophy,
  Medal,
} from 'lucide-react';
import { OrderStatusResponse, fetchOrderStatusApi } from '@/lib/iluService';
import { subscribeToOrderEvents } from '@/lib/iluSync';

function useAnimatedCount(targetNumber: number, stepIntervalMs: number = 250) {
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [overlayProgress, setOverlayProgress] = useState<number>(0);
  const displayedCountRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayedCount(targetNumber);
      displayedCountRef.current = targetNumber;
      setOverlayProgress(1);
      return;
    }

    // Step-by-step increment every 250ms until reaching targetNumber
    // For diff <= 50: full scroll 1-by-1 (+1 per tick, no short fixed-time compression)
    // For diff > 50: 1:3 ratio (+3 per tick)
    const stepSize = diff <= 50 ? 1 : Math.max(3, Math.ceil(diff / 100));

    // Clear any previous interval before starting the new stepping
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setOverlayProgress(1);

    intervalRef.current = setInterval(() => {
      const nextVal = Math.min(targetNumber, displayedCountRef.current + stepSize);
      displayedCountRef.current = nextVal;
      setDisplayedCount(nextVal);

      if (nextVal >= targetNumber) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, stepIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [targetNumber, stepIntervalMs]);

  return { displayedCount, overlayProgress };
}

export default function IluOrderStatusPageClient() {
  const [data, setData] = useState<OrderStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const totalLiters = data?.organizationTotalLiters ?? 0;
  const { displayedCount, overlayProgress } = useAnimatedCount(totalLiters);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isFetchingRef = useRef(false);
  const refreshQueuedRef = useRef(false);

  const loadOrderStatus = async (mode: 'initial' | 'manual' | 'silent' | boolean = 'initial') => {
    if (isFetchingRef.current) {
      refreshQueuedRef.current = true;
      return;
    }
    const resolvedMode = mode === true ? 'manual' : mode === false ? 'initial' : mode;

    try {
      isFetchingRef.current = true;
      if (resolvedMode === 'manual') {
        setRefreshing(true);
      } else if (resolvedMode === 'initial') {
        setLoading(true);
      }
      setError(null);
      const res = await fetchOrderStatusApi();
      if (res) {
        setData(res);
      }
    } catch (err: unknown) {
      if (resolvedMode !== 'silent') {
        const msg = err instanceof Error ? err.message : 'ഓർഡർ വിവരങ്ങൾ ലഭ്യമാക്കാൻ കഴിഞ്ഞില്ല.';
        setError(msg);
      }
    } finally {
      if (resolvedMode === 'manual') {
        setRefreshing(false);
      } else if (resolvedMode === 'initial') {
        setLoading(false);
      }
      isFetchingRef.current = false;
      if (refreshQueuedRef.current) {
        refreshQueuedRef.current = false;
        void loadOrderStatus('silent');
      }
    }
  };

  useEffect(() => {
    loadOrderStatus('initial');

    // Auto-fetch updated count every 10 seconds in the background
    const pollInterval = setInterval(() => {
      loadOrderStatus('silent');
    }, 10000);

    // Cross-tab real-time sync: when an order is placed anywhere, immediately refresh
    const unsubscribe = subscribeToOrderEvents(() => {
      loadOrderStatus('silent');
    });

    return () => {
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, []);

  const rankedSummaries = useMemo(() => {
    if (!data?.summaries) return [];
    const list = [...data.summaries];

    // Strictly sort in descending order of total_count from the API
    list.sort((a, b) => (b.totalQuantityLiters || 0) - (a.totalQuantityLiters || 0));

    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [data]);

  const filteredSummaries = useMemo(() => {
    if (!searchQuery.trim()) return rankedSummaries;

    const q = searchQuery.toLowerCase().trim();
    return rankedSummaries.filter(
      (s) =>
        s.clubName.toLowerCase().includes(q) ||
        (s.location && s.location.toLowerCase().includes(q))
    );
  }, [rankedSummaries, searchQuery]);


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

      {/* HERO SECTION: FULL WIDTH BANNER WITH FESTIVAL GRADIENT BORDER (DESKTOP ONLY) */}
      <section className="hidden sm:block w-full relative z-10 shadow-md">
        <div className="w-full relative">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="https://media.raihsuite.com/RS0001/web/ilu/order-status-banner-mobile.webp"
            />
            <source
              media="(min-width: 641px)"
              srcSet="https://media.raihsuite.com/RS0001/web/ilu/order-status-banner.webp"
            />
            <img
              src="https://media.raihsuite.com/RS0001/web/ilu/order-status-banner.webp"
              alt="ILU Foundation Payasam Challenge Order Status"
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10 space-y-8 sm:space-y-10">

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-4 text-sm shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={() => loadOrderStatus(true)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
            >
              Retry
            </button>
          </div>
        )}

        {/* TOTAL QUANTITY ORDERED STAT CARD - STANDOUT SHOWCASE MILESTONE */}
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
                {loading ? '...' : displayedCount.toLocaleString()}
              </span>
              <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wider drop-shadow-md">
                LTR
              </span>
            </div>
          </div>
        </section>

        {/* SEARCH & REFRESH TOOLBAR */}
        <section>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by club name or location..."
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Refresh Button with Brand Gradient */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => loadOrderStatus(true)}
                disabled={refreshing}
                className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#ea183c]/20 flex items-center gap-2 transition disabled:opacity-50 active:scale-95 text-center"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Live</span>
              </button>
            </div>
          </div>
        </section>

        {/* ORDER SUMMARY TABLE & MOBILE LEADERBOARD */}
        <section>
          <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
            {/* Desktop Table View (md and up) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-800">
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-xs font-bold text-slate-700">
                  <tr>
                    <th scope="col" className="py-4 px-4 text-center w-16 text-slate-500">
                      #
                    </th>
                    <th scope="col" className="py-4 px-6 font-bold">
                      Club / Organization
                    </th>
                    <th scope="col" className="py-4 px-6 font-bold text-right">
                      Total Quantity
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    // Skeleton Rows
                    [1, 2, 3, 4, 5, 6].map((idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-4 px-4 text-center">
                          <div className="h-6 w-6 bg-slate-100 rounded-full mx-auto" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 bg-slate-100 rounded w-40" />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="h-4 bg-amber-100 rounded w-16 ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : filteredSummaries.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-500 font-medium">
                        {searchQuery
                          ? `No clubs found matching "${searchQuery}"`
                          : 'No orders recorded yet.'}
                      </td>
                    </tr>
                  ) : (
                    filteredSummaries.map((summary) => {
                      const isFirst = summary.rank === 1;
                      const isSecond = summary.rank === 2;
                      const isThird = summary.rank === 3;

                      return (
                        <tr
                          key={summary.clubId}
                          className={`transition-colors ${
                            isFirst
                              ? 'bg-gradient-to-r from-amber-500/15 via-amber-100/30 to-amber-50/10 border-l-4 border-l-amber-500 hover:bg-amber-100/40'
                              : isSecond
                              ? 'bg-gradient-to-r from-slate-200/50 via-slate-100/30 to-slate-50/10 border-l-4 border-l-slate-400 hover:bg-slate-100/60'
                              : isThird
                              ? 'bg-gradient-to-r from-orange-200/40 via-orange-100/20 to-orange-50/10 border-l-4 border-l-orange-500 hover:bg-orange-100/40'
                              : 'hover:bg-amber-50/30'
                          }`}
                        >
                          {/* # Rank */}
                          <td className="py-4 px-4 text-center">
                            {isFirst ? (
                              <div
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md shadow-amber-500/30 border border-amber-200 mx-auto"
                                title="1st Position"
                              >
                                <Trophy className="w-4 h-4 text-amber-950 fill-amber-950/20" />
                              </div>
                            ) : isSecond ? (
                              <div
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-800 font-black text-xs sm:text-sm flex items-center justify-center shadow-sm border border-slate-200 mx-auto"
                                title="2nd Position"
                              >
                                <Medal className="w-4 h-4 text-slate-800" />
                              </div>
                            ) : isThird ? (
                              <div
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-sm border border-orange-300 mx-auto"
                                title="3rd Position"
                              >
                                <Medal className="w-4 h-4 text-amber-100" />
                              </div>
                            ) : (
                              <span className="font-bold text-xs sm:text-sm text-slate-500">
                                {summary.rank}
                              </span>
                            )}
                          </td>

                          {/* Club Name */}
                          <td className="py-4 px-6 font-bold text-slate-900">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-sm sm:text-base ${isFirst ? 'font-black text-amber-950' : 'font-bold'}`}>
                                {summary.clubName}
                              </span>
                              {isFirst && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950 border border-amber-400 shadow-xs">
                                  1st Place
                                </span>
                              )}
                              {isSecond && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/90 text-slate-800 border border-slate-300 shadow-xs">
                                  2nd Place
                                </span>
                              )}
                              {isThird && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-200/90 text-orange-950 border border-orange-300 shadow-xs">
                                  3rd Place
                                </span>
                              )}
                              {summary.location && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-normal">
                                  {summary.location}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="py-4 px-6 text-right">
                            <span className={`font-black text-sm sm:text-base ${isFirst ? 'text-amber-950' : 'text-slate-900'}`}>
                              {summary.totalQuantityLiters} L
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Leaderboard Cards View (screens < md) */}
            <div className="block md:hidden p-3 sm:p-4 space-y-2.5">
              {loading ? (
                // Mobile Skeletons
                [1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 bg-white animate-pulse space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100" />
                        <div className="h-4 w-28 bg-slate-100 rounded" />
                      </div>
                      <div className="h-5 w-12 bg-amber-100 rounded" />
                    </div>
                  </div>
                ))
              ) : filteredSummaries.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-xs font-medium">
                  {searchQuery
                    ? `No clubs found matching "${searchQuery}"`
                    : 'No orders recorded yet.'}
                </div>
              ) : (
                filteredSummaries.map((summary) => {
                  const isFirst = summary.rank === 1;
                  const isSecond = summary.rank === 2;
                  const isThird = summary.rank === 3;

                  return (
                    <div
                      key={summary.clubId}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isFirst
                          ? 'bg-gradient-to-br from-amber-500/10 via-amber-50/70 to-white border-amber-300/90 shadow-md shadow-amber-500/10 ring-1 ring-amber-400/30'
                          : isSecond
                          ? 'bg-gradient-to-br from-slate-100/90 via-slate-50/60 to-white border-slate-300 shadow-sm'
                          : isThird
                          ? 'bg-gradient-to-br from-orange-100/60 via-orange-50/40 to-white border-orange-300 shadow-sm'
                          : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                      }`}
                    >
                      {/* Top Header: Rank + Club Name + Quantity */}
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Rank Badge */}
                          {isFirst ? (
                            <div
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/30 border border-amber-200 shrink-0"
                              title="1st Position"
                            >
                              <Trophy className="w-4 h-4 text-amber-950 fill-amber-950/20" />
                            </div>
                          ) : isSecond ? (
                            <div
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-800 font-black text-xs flex items-center justify-center shadow-sm border border-slate-200 shrink-0"
                              title="2nd Position"
                            >
                              <Medal className="w-4 h-4 text-slate-800" />
                            </div>
                          ) : isThird ? (
                            <div
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white font-black text-xs flex items-center justify-center shadow-sm border border-orange-300 shrink-0"
                              title="3rd Position"
                            >
                              <Medal className="w-4 h-4 text-amber-100" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200/70">
                              #{summary.rank}
                            </div>
                          )}

                          {/* Club Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-xs sm:text-sm truncate ${isFirst ? 'font-black text-amber-950' : 'font-bold text-slate-900'}`}>
                                {summary.clubName}
                              </span>
                              {isFirst && (
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300 shrink-0">
                                  1st
                                </span>
                              )}
                              {isSecond && (
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-slate-300 shrink-0">
                                  2nd
                                </span>
                              )}
                              {isThird && (
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-200 text-orange-950 border border-orange-300 shrink-0">
                                  3rd
                                </span>
                              )}
                            </div>
                            {summary.location && (
                              <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                {summary.location}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quantity Liters on Right */}
                        <div className="text-right shrink-0">
                          <span className={`text-sm sm:text-base font-black ${isFirst ? 'text-amber-950' : 'text-slate-900'}`}>
                            {summary.totalQuantityLiters} L
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Total Row */}
            {!loading && (
              <div className="bg-gradient-to-r from-[#ea183c]/5 via-[#f3631f]/10 to-[#faa70c]/10 border-t border-[#f3631f]/20 p-4 sm:p-5 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] text-white shadow-sm shrink-0">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base md:text-lg text-slate-900 block">
                      Total Quantity Ordered
                    </span>
                  </div>
                </div>

                <div className="text-right sm:text-right flex items-center justify-between sm:block">
                  <span className="text-xs sm:hidden text-slate-500 font-bold">Total:</span>
                  <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] bg-clip-text text-transparent tracking-tight">
                    {data?.organizationTotalLiters ?? 0} L
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Back Button */}
        <section className="pt-2 text-center">
          <Link
            href="/ilu"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#ea183c]/25 hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Order Page</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
