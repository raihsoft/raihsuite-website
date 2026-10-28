'use client';

import React, { useState } from 'react';
import {
  QrCode,
  Building2,
  Smartphone,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';

interface IluPaymentBankDetailsProps {
  amount?: string;
  donationRef?: string;
  donorName?: string;
  className?: string;
}

export const ILU_PAYMENT_INFO = {
  accountName: 'Ilu Foundation',
  accountNumber: '10220001463593',
  bankName: 'Esaf Small Finance Bank',
  branch: 'Manjeri',
  ifsc: 'ESMF0001165',
  gpayNumber: '79075 31608',
  gpayRawNumber: '7907531608',
  upiId: 'getepay.esafbank136779@icici',
  upiName: 'ILU FOUNDATION',
  qrImageUrl: 'https://media.raihsuite.com/RS0001/web/ilu/Donation-QR.jpeg',
};

export default function IluPaymentBankDetails({
  amount,
  donationRef,
  donorName,
  className = '',
}: IluPaymentBankDetailsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    }
  };

  const whatsappMessage = donationRef
    ? `Donation Ref: ${donationRef}\nName: ${donorName || ''}\nAmount: ${amount ? `₹${amount}` : ''}\n(Payment Screenshot Attached)`
    : `ILU Foundation Donation Payment Screenshot\n${amount ? `Amount: ₹${amount}` : ''}`;

  const whatsappUrl = `https://wa.me/91${ILU_PAYMENT_INFO.gpayRawNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div
      className={`rounded-3xl border-2 border-emerald-300/80 bg-gradient-to-br from-[#f0fdf4] via-white to-emerald-50/50 p-4 sm:p-6 shadow-md shadow-emerald-950/5 space-y-4 sm:space-y-5 ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm border-b border-emerald-100 pb-3">
        <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
          <QrCode className="w-4 h-4" />
        </div>
        <span>Scan to Pay & Bank Details • പേയ്‌മെന്റ് വിവരങ്ങൾ</span>
      </div>

      {/* Main Grid: QR Code (Left) + Details (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        {/* Left: QR Code Card */}
        <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <QrCode className="w-3.5 h-3.5" />
            <span>UPI QR Code</span>
          </div>

          <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-full">
            <img
              src={ILU_PAYMENT_INFO.qrImageUrl}
              alt="ILU Foundation Donation QR Code"
              className="w-44 sm:w-52 h-auto mx-auto rounded-xl object-contain block"
            />
          </div>

          <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-tight max-w-xs">
            Scan using <span className="font-bold text-slate-800">GPay, PhonePe, Paytm</span> or any UPI app
          </p>
        </div>

        {/* Right: GPay Number & Bank Details */}
        <div className="flex flex-col justify-between space-y-3">
          {/* GPay / PhonePe Number Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border border-emerald-200 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-800">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Google Pay / PhonePe
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="font-mono text-base sm:text-lg font-black text-slate-900 tracking-wider">
                {ILU_PAYMENT_INFO.gpayNumber}
              </div>

              <button
                type="button"
                onClick={() => handleCopy(ILU_PAYMENT_INFO.gpayRawNumber, 'gpay')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs transition cursor-pointer"
                title="Copy GPay number"
              >
                {copiedKey === 'gpay' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bank Account Details Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-2 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs border-b border-slate-100 pb-1.5">
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bank Account Transfer Details</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {/* Account Name */}
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-medium">A/c Name:</span>
                <span className="font-bold text-slate-900 text-right">{ILU_PAYMENT_INFO.accountName}</span>
              </div>

              {/* Account Number */}
              <div className="flex justify-between items-center py-0.5 border-t border-slate-100">
                <span className="text-slate-500 font-medium">A/c No:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900 tracking-wider">
                    {ILU_PAYMENT_INFO.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(ILU_PAYMENT_INFO.accountNumber, 'acno')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedKey === 'acno' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bank Name */}
              <div className="flex justify-between items-center py-0.5 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Bank:</span>
                <span className="font-semibold text-slate-900 text-right">{ILU_PAYMENT_INFO.bankName}</span>
              </div>

              {/* Branch */}
              <div className="flex justify-between items-center py-0.5 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Branch:</span>
                <span className="font-semibold text-slate-900 text-right">{ILU_PAYMENT_INFO.branch}</span>
              </div>

              {/* IFSC */}
              <div className="flex justify-between items-center py-0.5 border-t border-slate-100">
                <span className="text-slate-500 font-medium">IFSC:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-emerald-700 tracking-wider">
                    {ILU_PAYMENT_INFO.ifsc}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(ILU_PAYMENT_INFO.ifsc, 'ifsc')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    title="Copy IFSC code"
                  >
                    {copiedKey === 'ifsc' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Screenshot Confirmation Bar */}
      <div className="pt-2.5 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="text-xs text-slate-700 leading-snug">
          തുക അയച്ച ശേഷം <span className="font-bold text-emerald-700">{ILU_PAYMENT_INFO.gpayNumber}</span> എന്ന നമ്പറിലേക്ക് സ്ക്രീൻഷോട്ട് WhatsApp ചെയ്യുക
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Screenshot</span>
        </a>
      </div>
    </div>
  );
}
