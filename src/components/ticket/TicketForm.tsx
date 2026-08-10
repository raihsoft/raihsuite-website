'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { Event, Participant } from '@/lib/ticketService';

interface TicketFormProps {
  events: Event[];
  participants: Participant[];
  onSubmit: (eventId: string, participantId: string) => void;
  isLoading: boolean;
  isGenerating: boolean;
  onEventChange: (eventId: string) => void;
}

export default function TicketForm({
  events,
  participants,
  onSubmit,
  isLoading,
  isGenerating,
  onEventChange,
}: TicketFormProps) {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState('');

  const handleEventChange = (value: string) => {
    setSelectedEvent(value);
    setSelectedParticipant('');
    onEventChange(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent && selectedParticipant) {
      onSubmit(selectedEvent, selectedParticipant);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-700 rounded-lg p-8 max-w-md mx-auto space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">
          Generate Ticket
        </h2>
        <p className="text-slate-400 text-sm">
          Select an event and participant to generate an admission ticket
        </p>
      </div>

      {/* Event Selection */}
      <div className="space-y-2">
        <label htmlFor="event" className="block text-sm font-semibold text-white">
          Select Event *
        </label>
        <select
          id="event"
          value={selectedEvent}
          onChange={(e) => handleEventChange(e.target.value)}
          disabled={isLoading}
          required
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">-- Choose an event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
        {isLoading && events.length === 0 && (
          <p className="text-xs text-slate-500">Loading events...</p>
        )}
      </div>

      {/* Participant Selection */}
      <div className="space-y-2">
        <label htmlFor="participant" className="block text-sm font-semibold text-white">
          Select Participant *
        </label>
        <select
          id="participant"
          value={selectedParticipant}
          onChange={(e) => setSelectedParticipant(e.target.value)}
          disabled={!selectedEvent || isLoading}
          required
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {!selectedEvent
              ? '-- Select an event first --'
              : participants.length === 0
                ? '-- No participants available --'
                : '-- Choose a participant --'}
          </option>
          {participants.map((participant) => (
            <option key={participant.id} value={participant.id}>
              {participant.name}
            </option>
          ))}
        </select>
        {isLoading && selectedEvent && participants.length === 0 && (
          <p className="text-xs text-slate-500">Loading participants...</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!selectedEvent || !selectedParticipant || isGenerating}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating Ticket...' : 'Generate Ticket'}
      </Button>
    </form>
  );
}
