'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  RefreshCw,
  Soup,
  ArrowLeft,
  AlertTriangle,
  BarChart3,
  X,
  Trophy,
  Medal,
} from 'lucide-react';
import { OrderStatusResponse, fetchOrderStatusApi } from '@/lib/iluService';

export default function IluOrderStatusPageClient() {
  const [data, setData] = useState<OrderStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadOrderStatus = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const res = await fetchOrderStatusApi();
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ഓർഡർ വിവരങ്ങൾ ലഭ്യമാക്കാൻ കഴിഞ്ഞില്ല.';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrderStatus();
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

  // Max liters for progress bar proportion calculation
  const maxLiters = useMemo(() => {
    if (!data?.summaries || data.summaries.length === 0) return 5;
    const maxVal = Math.max(...data.summaries.map((s) => s.totalQuantityLiters || 0));
    return maxVal > 0 ? maxVal : 5;
  }, [data]);

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

      {/* HERO SECTION: FULL WIDTH BANNER WITH FESTIVAL GRADIENT BORDER */}
      <section className="w-full relative z-10 shadow-md">
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

        {/* TOTAL QUANTITY ORDERED STAT CARD */}
        <section>
          <div className="rounded-3xl bg-white border-2 border-slate-200/90 p-5 sm:p-7 md:p-8 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 relative overflow-hidden">
            <div className="flex items-center gap-3.5 sm:gap-5 w-full sm:w-auto">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#ea183c]/10 via-[#f3631f]/10 to-[#faa70c]/10 text-[#ea183c] shrink-0 border border-[#ea183c]/15 shadow-sm">
                <Soup className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Total Quantity Ordered
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto text-left sm:text-right bg-slate-50 sm:bg-transparent p-3.5 sm:p-0 rounded-2xl sm:rounded-none border sm:border-0 border-slate-100">
              <div className="text-3xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] bg-clip-text text-transparent tracking-tight">
                {loading ? '...' : `${data?.organizationTotalLiters ?? 0} L`}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
                Live organization total from ILU Foundation
              </p>
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
                    <th scope="col" className="py-4 px-6 w-48 sm:w-60 font-bold">
                      Progress
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
                        <td className="py-4 px-6">
                          <div className="h-3 bg-slate-100 rounded-full w-full" />
                        </td>
                      </tr>
                    ))
                  ) : filteredSummaries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">
                        {searchQuery
                          ? `No clubs found matching "${searchQuery}"`
                          : 'No orders recorded yet.'}
                      </td>
                    </tr>
                  ) : (
                    filteredSummaries.map((summary) => {
                      const percent = Math.min(
                        100,
                        Math.max(4, Math.round((summary.totalQuantityLiters / maxLiters) * 100))
                      );

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

                          {/* Progress */}
                          <td className="py-4 px-6">
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] h-full rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
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
                    <div className="h-2 w-full bg-slate-100 rounded-full" />
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
                  const percent = Math.min(
                    100,
                    Math.max(4, Math.round((summary.totalQuantityLiters / maxLiters) * 100))
                  );

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

                      {/* Progress Bar with Percent */}
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 shrink-0">
                          {percent}%
                        </span>
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
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                      Organization Total
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
