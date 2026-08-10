'use client';

import React from 'react';
import QRCode from 'react-qr-code';

interface GeneratedTicketDisplayProps {
  ticket: {
    id: string;
    token: string;
    participant_name: string;
    issued_at: string;
    status: string;
  };
  eventName: string;
}

export default function GeneratedTicketDisplay({
  ticket,
  eventName,
}: GeneratedTicketDisplayProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">
          Ticket Generated Successfully
        </h2>
        <p className="text-slate-400 text-sm">Your admission token</p>
      </div>

      {/* Event & Participant Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6 space-y-3">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Event</p>
          <p className="text-white font-semibold">{eventName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Participant</p>
          <p className="text-white font-semibold">{ticket.participant_name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Ticket ID</p>
          <p className="text-cyan-300 font-mono text-sm break-all">{ticket.id}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Status</p>
          <span className="inline-block bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/40">
            {ticket.status}
          </span>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-lg p-4 flex justify-center mb-6">
        <QRCode value={ticket.token} size={200} level="H" />
      </div>

      {/* Token Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Admission Token</p>
        <p className="text-blue-300 font-mono text-xs break-all bg-slate-900/50 p-2 rounded border border-slate-600">
          {ticket.token}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 border-t border-slate-700 pt-4">
        <p>Issued: {formatDate(ticket.issued_at)}</p>
        <p className="mt-2">
          Please present the QR code or token at the event entrance for verification
        </p>
      </div>
    </div>
  );
}
