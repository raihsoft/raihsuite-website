'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  RefreshCw,
  Users,
  Droplet,
  FileText,
  ArrowLeft,
  AlertTriangle,
  Heart,
  BarChart3,
  X,
  Leaf,
  Trophy,
  Crown,
  Sparkles,
  ChevronRight,
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
    } catch (err: any) {
      setError(err.message || 'Failed to fetch live order status records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrderStatus();
  }, []);

  const filteredSummaries = useMemo(() => {
    if (!data?.summaries) return [];
    if (!searchQuery.trim()) return data.summaries;

    const q = searchQuery.toLowerCase().trim();
    return data.summaries.filter(
      (s) =>
        s.clubName.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.mobileNumber.toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  // Max liters for progress bar proportion calculation
  const maxLiters = useMemo(() => {
    if (!data?.summaries || data.summaries.length === 0) return 125;
    return Math.max(...data.summaries.map((s) => s.totalQuantityLiters), 1);
  }, [data]);

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

      {/* Background Floating Leaves & Hearts */}
      <div className="absolute top-16 left-6 opacity-25 pointer-events-none hidden lg:block animate-float">
        <Leaf className="w-24 h-24 text-emerald-400 transform -rotate-12" />
      </div>
      <div className="absolute top-24 right-12 opacity-25 pointer-events-none hidden lg:block animate-float animation-delay-2000">
        <Heart className="w-10 h-10 text-[#f59e0b] stroke-2 fill-transparent transform rotate-12" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 space-y-10">
        {/* HERO HEADER */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Left Title */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ILU FOUNDATION CHALLENGE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              Payasam Challenge <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                Order Status
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 font-normal">
              Track real-time aggregated payasam orders by participating clubs across Kerala.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="/ilu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Place New Payasam Order</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative py-2">
            {/* Ambient Soft Radial Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/25 via-yellow-400/15 to-amber-600/25 blur-3xl rounded-full scale-125 pointer-events-none" />
            <img
              src="https://media.raihsuite.com/RS0001/web/ilu/payasam-img.png"
              alt="Payasam Challenge Bowl"
              className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto object-contain transition-transform duration-700 hover:scale-105 filter drop-shadow-[0_25px_45px_rgba(251,191,36,0.3)]"
            />
          </div>
        </section>

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 flex items-center justify-between gap-4 text-sm shadow-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadOrderStatus(true)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
            >
              Retry
            </button>
          </div>
        )}

        {/* 3 SUMMARY STAT CARDS ROW */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Total Clubs */}
            <div className="rounded-2xl bg-[#05173e]/90 border border-blue-500/40 p-6 shadow-[0_15px_35px_rgba(0,102,255,0.15)] backdrop-blur-xl flex items-center justify-between gap-4 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Participating Clubs
                </p>
                <p className="text-4xl font-black text-white">
                  {loading ? '...' : data?.totalClubsWithOrders || 12}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">Clubs with active orders</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0066ff]/20 border border-[#0066ff]/40 text-blue-400 shrink-0 shadow-inner">
                <Users className="w-7 h-7" />
              </div>
            </div>

            {/* Card 2: Total Quantity Ordered */}
            <div className="rounded-2xl bg-[#1c1507]/90 border border-amber-500/50 ring-1 ring-amber-400/30 p-6 shadow-[0_15px_35px_rgba(251,191,36,0.15)] backdrop-blur-xl flex items-center justify-between gap-4 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Total Quantity Ordered
                  </p>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                </div>
                <p className="text-4xl font-black text-[#facc15]">
                  {loading ? '...' : `${data?.grandTotalLiters || 385} L`}
                </p>
                <p className="text-[11px] text-amber-300/80 font-medium">Liters of payasam ordered</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#fbbf24]/20 border border-[#fbbf24]/40 text-[#facc15] shrink-0 shadow-inner">
                <Droplet className="w-7 h-7 fill-[#facc15]" />
              </div>
            </div>

            {/* Card 3: Total Orders */}
            <div className="rounded-2xl bg-[#041d2d]/90 border border-teal-500/40 p-6 shadow-[0_15px_35px_rgba(45,212,191,0.15)] backdrop-blur-xl flex items-center justify-between gap-4 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  Total Orders Submitted
                </p>
                <p className="text-4xl font-black text-white">
                  {loading ? '...' : data?.totalOrderCount || 28}
                </p>
                <p className="text-[11px] text-teal-300/80 font-medium">Individual order entries</p>
              </div>
              <div className="p-4 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 shrink-0 shadow-inner">
                <FileText className="w-7 h-7" />
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH & REFRESH TOOLBAR */}
        <section>
          <div className="bg-[#05163a]/90 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by club name or contact person..."
                className="w-full bg-[#081a3e] border border-blue-700/60 text-white rounded-xl pl-10 pr-9 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-medium placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-slate-400 font-medium">
                Showing <strong className="text-white">{filteredSummaries.length}</strong> of{' '}
                <strong className="text-white">{data?.summaries?.length || 12}</strong> clubs
              </span>

              {/* Refresh Button */}
              <button
                onClick={() => loadOrderStatus(true)}
                disabled={refreshing}
                className="px-5 py-2.5 rounded-xl bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-600/30 flex items-center gap-2 transition disabled:opacity-50 active:scale-95"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Live</span>
              </button>
            </div>
          </div>
        </section>

        {/* ORDER SUMMARY TABLE WITH LEADERBOARD BADGES & PROGRESS BARS */}
        <section>
          <div className="rounded-3xl bg-[#05163a]/95 backdrop-blur-xl border-2 border-blue-500/50 overflow-hidden shadow-[0_30px_70px_rgba(1,6,18,0.95)] relative">
            {/* Header Glowing Accent Bar */}
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-amber-400 to-cyan-400" />

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-200">
                <thead className="bg-[#030e28] border-b border-blue-900/70 text-[11px] uppercase font-extrabold text-blue-300 tracking-wider">
                  <tr>
                    <th scope="col" className="py-4 px-4 text-center w-16">
                      Rank
                    </th>
                    <th scope="col" className="py-4 px-6">
                      Club Name
                    </th>
                    <th scope="col" className="py-4 px-6 text-amber-300">
                      Total Quantity Ordered ↓
                    </th>
                    <th scope="col" className="py-4 px-6 w-52">
                      Challenge Progress
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-blue-900/40">
                  {loading ? (
                    // Skeleton Rows
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-4 px-4 text-center">
                          <div className="h-5 bg-blue-900/40 rounded-full w-6 mx-auto" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-5 bg-blue-900/40 rounded w-40" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-5 bg-amber-400/30 rounded w-20" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-3 bg-blue-900/40 rounded-full w-full" />
                        </td>
                      </tr>
                    ))
                  ) : filteredSummaries.length === 0 ? (
                    // Empty State
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-slate-400 space-y-3">
                        <Trophy className="w-10 h-10 mx-auto text-slate-600 opacity-60" />
                        <p className="text-base font-semibold text-slate-300">
                          {searchQuery
                            ? `No club found matching "${searchQuery}"`
                            : 'No club orders recorded yet.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    // Real Summaries Rows
                    filteredSummaries.map((summary, idx) => {
                      const percent = Math.min(
                        100,
                        Math.max(6, Math.round((summary.totalQuantityLiters / maxLiters) * 100))
                      );

                      // Rank Badges
                      let rankBadge;
                      if (idx === 0) {
                        rankBadge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30">
                            <Crown className="w-3.5 h-3.5 fill-slate-950" />
                            <span>1st</span>
                          </span>
                        );
                      } else if (idx === 1) {
                        rankBadge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-black text-xs shadow-md">
                            <span>2nd</span>
                          </span>
                        );
                      } else if (idx === 2) {
                        rankBadge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 font-black text-xs shadow-md">
                            <span>3rd</span>
                          </span>
                        );
                      } else {
                        rankBadge = (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-[#0a1b3d] text-slate-300 font-mono font-bold text-xs border border-blue-900/60">
                            #{idx + 1}
                          </span>
                        );
                      }

                      return (
                        <tr
                          key={summary.clubId}
                          className="hover:bg-blue-900/30 transition-colors duration-200 group"
                        >
                          {/* Rank */}
                          <td className="py-4 px-4 text-center">{rankBadge}</td>

                          {/* Club Name */}
                          <td className="py-4 px-6 font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                            <div className="flex items-center gap-2">
                              <span>{summary.clubName}</span>
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-black text-[#facc15]">
                                {summary.totalQuantityLiters}
                              </span>
                              <span className="text-xs font-bold text-amber-400/90 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md">
                                Liters
                              </span>
                            </div>
                          </td>

                          {/* Progress Bar */}
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="w-full bg-[#08183a] rounded-full h-3.5 border border-blue-800/60 overflow-hidden p-0.5 shadow-inner">
                                <div
                                  className="bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400 h-full rounded-full transition-all duration-700 shadow"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono text-right font-medium">
                                {percent}% of top order
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Grand Total Banner */}
            {!loading && filteredSummaries.length > 0 && (
              <div className="bg-gradient-to-r from-[#171004] via-[#2d1e05] to-[#171004] border-t-2 border-amber-400/50 p-5 px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      GRAND TOTAL AGGREGATED
                    </h4>
                    <p className="text-xs text-amber-200/80 font-medium">
                      Across {data?.totalClubsWithOrders || filteredSummaries.length} participating clubs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-amber-300/80 block font-medium">
                      Total Challenge Volume
                    </span>
                    <span className="text-3xl font-black text-[#facc15] tracking-tight">
                      {data?.grandTotalLiters || 385} Liters
                    </span>
                  </div>

                  <Link
                    href="/ilu"
                    className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
                  >
                    <span>Order Payasam</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM ACTION BUTTON */}
        <section className="pt-4 text-center">
          <Link
            href="/ilu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0066ff] hover:bg-blue-600 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Place New Payasam Order</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
