'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  RefreshCw,
  Droplet,
  ArrowLeft,
  AlertTriangle,
  BarChart3,
  X,
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

  const filteredSummaries = useMemo(() => {
    if (!data?.summaries) return [];
    const list = [...data.summaries];

    // Strictly sort in descending order of total_count from the API
    list.sort((a, b) => (b.totalQuantityLiters || 0) - (a.totalQuantityLiters || 0));

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (s) =>
        s.clubName.toLowerCase().includes(q) ||
        (s.location && s.location.toLowerCase().includes(q)) ||
        (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
        (s.mobileNumber && s.mobileNumber.toLowerCase().includes(q))
    );
  }, [data, searchQuery]);

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10 space-y-8 sm:space-y-10">
        {/* HERO HEADER */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center pt-2">
          {/* Left Title */}
          <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#1e3a8a] uppercase">
              ILU FOUNDATION
            </span>

            <h1 className="tracking-tight leading-tight">
              <span className="text-[#1e3a8a] font-black text-3xl sm:text-5xl lg:text-6xl block">
                Payasam Challenge
              </span>
              <span className="text-[#dc2626] font-black text-3xl sm:text-5xl lg:text-6xl block mt-1">
                Order Status
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 font-medium">
              Track the total payasam quantity ordered by each participating club in real time.
            </p>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full scale-105 pointer-events-none" />
              <img
                src="https://media.raihsuite.com/RS0001/web/ilu/payasam-img.png"
                alt="Kerala Payasam in Uruli"
                className="relative z-10 w-64 sm:w-80 lg:w-96 max-w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(217,119,6,0.18)]"
              />
            </div>
          </div>
        </section>

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
                <Droplet className="w-8 h-8 sm:w-10 sm:h-10 fill-[#ea183c]/30" />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Total Quantity Ordered
                </p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  ക്ലബ്ബ് ഓർഡറുകളുടെ ആകെ പായസം അളവ്
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
                placeholder="Search by club name or contact person..."
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

        {/* ORDER SUMMARY TABLE */}
        <section>
          <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-800">
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-xs font-bold text-slate-700">
                  <tr>
                    <th scope="col" className="py-4 px-4 text-center w-12 text-slate-500">
                      #
                    </th>
                    <th scope="col" className="py-4 px-6 font-bold">
                      Club / Organization
                    </th>
                    <th scope="col" className="py-4 px-6 font-bold">
                      Contact Person
                    </th>
                    <th scope="col" className="py-4 px-6 font-bold">
                      Mobile Number
                    </th>
                    <th scope="col" className="py-4 px-6 font-bold text-right">
                      Total Quantity
                    </th>
                    <th scope="col" className="py-4 px-6 w-52 font-bold">
                      Progress
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    // Skeleton Rows
                    [1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-4 px-4 text-center">
                          <div className="h-4 bg-slate-100 rounded-full w-5 mx-auto" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 bg-slate-100 rounded w-36" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 bg-slate-100 rounded w-28" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 bg-slate-100 rounded w-24" />
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
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                        {searchQuery
                          ? `No clubs found matching "${searchQuery}"`
                          : 'No orders recorded yet.'}
                      </td>
                    </tr>
                  ) : (
                    filteredSummaries.map((summary, idx) => {
                      const percent = Math.min(
                        100,
                        Math.max(4, Math.round((summary.totalQuantityLiters / maxLiters) * 100))
                      );

                      return (
                        <tr
                          key={summary.clubId}
                          className="hover:bg-amber-50/40 transition-colors"
                        >
                          {/* # */}
                          <td className="py-4 px-4 text-center font-bold text-xs text-slate-500">
                            {idx + 1}
                          </td>

                          {/* Club Name */}
                          <td className="py-4 px-6 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{summary.clubName}</span>
                              {summary.location && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-normal">
                                  {summary.location}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Contact Person */}
                          <td className="py-4 px-6 text-slate-600 font-medium text-xs sm:text-sm">
                            {summary.contactPerson || '—'}
                          </td>

                          {/* Mobile */}
                          <td className="py-4 px-6 text-slate-600 font-mono text-xs sm:text-sm">
                            {summary.mobileNumber || '—'}
                          </td>

                          {/* Quantity */}
                          <td className="py-4 px-6 text-right">
                            <span className="font-black text-slate-900 text-sm sm:text-base">
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

            {/* Total Row */}
            {!loading && (
              <div className="bg-gradient-to-r from-[#ea183c]/5 via-[#f3631f]/10 to-[#faa70c]/10 border-t border-[#f3631f]/20 p-5 px-6 sm:px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] text-white shadow-sm">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base sm:text-lg text-slate-900 block">
                      Total Quantity Ordered
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Organization Total
                    </span>
                  </div>
                </div>

                <div>
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
