"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import TextField from "@/components/form/TextField";
import TicketForm from "@/components/ticket/TicketForm";
import GeneratedTicketDisplay from "@/components/ticket/GeneratedTicketDisplay";
import { fetchEvents, fetchParticipants, generateTicket, Ticket, Event, Participant } from "@/lib/ticketService";

// Mock Data
const EVENT_DATA = {
    id: "evt_001",
    name: "Neo-Classical Fusion",
    type: "Music",
    artist: "Elena Rivers & The Midnight Symphony",
    venue: "Aura Grand Theater, Level 42",
    city: "Neo-Tokyo",
    duration: "150 Minutes",
    description: "An immersive journey through sound, blending classical orchestration with futuristic electronic soundscapes.",
    banner: "https://media.raihsuite.com/RS0001/web/fusion-event.avif",
    shows: [
        { id: "s1", datetime: "2026-04-12T19:00:00Z", gate: "North Gate 1" },
        { id: "s2", datetime: "2026-04-12T22:00:00Z", gate: "North Gate 2" },
        { id: "s3", datetime: "2026-04-13T20:00:00Z", gate: "Main Plaza Gate" },
    ],
    ticketTypes: [
        {
            id: "VIP",
            label: "VIP",
            price: 299,
            description: "Front-row experience with exclusive lounge access, complimentary drinks & premium merchandise.",
            available: 24,
            color: "from-purple-600 to-purple-800",
            accent: "purple",
            icon: "⭐",
            perks: ["Lounge Access", "Complimentary Drinks", "Meet & Greet"],
        },
        {
            id: "Platinum",
            label: "Platinum",
            price: 199,
            description: "Premium center-stage seats with priority entry and exclusive event programme.",
            available: 50,
            color: "from-indigo-600 to-indigo-800",
            accent: "indigo",
            icon: "💎",
            perks: ["Priority Entry", "Event Programme", "Reserved Parking"],
        },
        {
            id: "Gold",
            label: "Gold",
            price: 129,
            description: "Great views from the elevated tier with comfortable padded seating.",
            available: 120,
            color: "from-amber-500 to-amber-700",
            accent: "amber",
            icon: "🏅",
            perks: ["Elevated Tier", "Padded Seating", "Standard Entry"],
        },
        {
            id: "Silver",
            label: "Silver",
            price: 79,
            description: "General admission with standing room and full event access.",
            available: 300,
            color: "from-slate-500 to-slate-700",
            accent: "slate",
            icon: "🎫",
            perks: ["General Admission", "Standing Area", "Full Event Access"],
        },
    ],
};

type Mode = "booking" | "generate";
type Step = "selection" | "tickets" | "attendees" | "payment" | "ticket";
type TicketSelection = { typeId: string; qty: number };

const accentClasses: Record<string, { border: string; glow: string; badge: string; btn: string; text: string; ring: string }> = {
    purple: {
        border: "border-purple-500/60",
        glow: "shadow-purple-600/20",
        badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        btn: "bg-purple-600 hover:bg-purple-700",
        text: "text-purple-400",
        ring: "ring-purple-500",
    },
    indigo: {
        border: "border-indigo-500/60",
        glow: "shadow-indigo-600/20",
        badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
        btn: "bg-indigo-600 hover:bg-indigo-700",
        text: "text-indigo-400",
        ring: "ring-indigo-500",
    },
    amber: {
        border: "border-amber-500/60",
        glow: "shadow-amber-600/20",
        badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        btn: "bg-amber-500 hover:bg-amber-600",
        text: "text-amber-400",
        ring: "ring-amber-500",
    },
    slate: {
        border: "border-slate-400/40",
        glow: "shadow-slate-500/10",
        badge: "bg-slate-500/20 text-slate-300 border-slate-400/30",
        btn: "bg-slate-600 hover:bg-slate-700",
        text: "text-slate-400",
        ring: "ring-slate-400",
    },
};

export default function BookTicketsPage() {
    const [mode, setMode] = useState<Mode>("booking");
    const [currentStep, setCurrentStep] = useState<Step>("selection");
    const [selectedShow, setSelectedShow] = useState(EVENT_DATA.shows[0]);
    const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([]);
    const [attendees, setAttendees] = useState<Record<string, { name: string; email: string }>>({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Ticket Generation state
    const [events, setEvents] = useState<Event[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [generatedTicket, setGeneratedTicket] = useState<Ticket | null>(null);
    const [selectedEventForTicket, setSelectedEventForTicket] = useState<Event | null>(null);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
    const [isGeneratingTicket, setIsGeneratingTicket] = useState(false);
    const [ticketError, setTicketError] = useState<string | null>(null);

    const ticketRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Load events on component mount or when generating mode is active
    useEffect(() => {
      if (mode === "generate" && events.length === 0) {
        loadEvents();
      }
    }, [mode]);

    const loadEvents = async () => {
      setIsLoadingEvents(true);
      setTicketError(null);
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        setTicketError(error instanceof Error ? error.message : "Failed to load events");
        console.error("Error loading events:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    const handleEventChange = async (eventId: string) => {
      setParticipants([]);
      setIsDefaultParticipants(false);
      if (!eventId) return;

      const selected = events.find(e => e.id === eventId);
      setSelectedEventForTicket(selected || null);
      
      setIsLoadingParticipants(true);
      setTicketError(null);
      try {
        const data = await fetchParticipants(eventId);
        setParticipants(data);
      } catch (error) {
        setTicketError(error instanceof Error ? error.message : "Failed to load participants");
        console.error("Error loading participants:", error);
      } finally {
        setIsLoadingParticipants(false);
      }
    };

    const [isDefaultParticipants, setIsDefaultParticipants] = useState(false);

    const handleGenerateTicket = async (eventId: string, participantId: string) => {
      setIsGeneratingTicket(true);
      setTicketError(null);
      try {
        const ticket = await generateTicket(eventId, participantId);
        setGeneratedTicket(ticket);
      } catch (error) {
        setTicketError(error instanceof Error ? error.message : "Failed to generate ticket");
        console.error("Error generating ticket:", error);
      } finally {
        setIsGeneratingTicket(false);
      }
    };

    const resetTicketGeneration = () => {
      setGeneratedTicket(null);
      setSelectedEventForTicket(null);
      setParticipants([]);
      setTicketError(null);
    };

    const handleDownload = async (seatId: string) => {
        const el = ticketRefs.current[seatId];
        if (!el) { window.print(); return; }

        try {
            const h2c = await new Promise<any>((resolve, reject) => {
                if ((window as any).html2canvas) { resolve((window as any).html2canvas); return; }
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
                script.onload = () => resolve((window as any).html2canvas);
                script.onerror = reject;
                document.head.appendChild(script);
            });
            const canvas = await h2c(el, { useCORS: true, scale: 2, backgroundColor: "#1a1625" });
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `ticket-${seatId}.png`;
            link.click();
        } catch {
            window.print();
        }
    };

    // Derived booleans
    const totalTickets = useMemo(
        () => ticketSelections.reduce((sum, s) => sum + s.qty, 0),
        [ticketSelections]
    );
    const totalPrice = useMemo(() => {
        return ticketSelections.reduce((sum, sel) => {
            const type = EVENT_DATA.ticketTypes.find((t) => t.id === sel.typeId);
            return sum + (type ? type.price * sel.qty : 0);
        }, 0);
    }, [ticketSelections]);

    const flatTickets = useMemo(() => {
        const result: { typeId: string; label: string; price: number; index: number }[] = [];
        ticketSelections.forEach((sel) => {
            const type = EVENT_DATA.ticketTypes.find((t) => t.id === sel.typeId)!;
            for (let i = 0; i < sel.qty; i++) {
                result.push({ typeId: sel.typeId, label: type.label, price: type.price, index: result.length });
            }
        });
        return result;
    }, [ticketSelections]);

    const getQty = (typeId: string) => ticketSelections.find((s) => s.typeId === typeId)?.qty ?? 0;

    const setQty = (typeId: string, delta: number) => {
        const current = getQty(typeId);
        const next = Math.max(0, Math.min(6, current + delta));
        const total = totalTickets - current + next;
        if (total > 6) { alert("Maximum 6 tickets per booking."); return; }
        if (next === 0) {
            setTicketSelections(ticketSelections.filter((s) => s.typeId !== typeId));
        } else if (current === 0) {
            setTicketSelections([...ticketSelections, { typeId, qty: next }]);
        } else {
            setTicketSelections(ticketSelections.map((s) => s.typeId === typeId ? { ...s, qty: next } : s));
        }
    };

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => { setIsProcessing(false); setCurrentStep("ticket"); }, 2000);
    };

    const renderStepIndicator = () => {
        const steps: Step[] = ["selection", "tickets", "attendees", "payment", "ticket"];
        const labels = ["Show", "Tickets", "Attendees", "Payment", "Done"];
        return (
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12">
                {steps.map((step, i) => {
                    const isActive = currentStep === step;
                    const isPast = steps.indexOf(currentStep) > i;
                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isActive ? "bg-purple-500 scale-150 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : isPast ? "bg-purple-400" : "bg-white/20"}`} />
                                <span className={`text-[10px] font-bold tracking-widest uppercase hidden sm:block ${isActive ? "text-purple-400" : isPast ? "text-purple-400/60" : "text-white/20"}`}>{labels[i]}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`h-[2px] w-8 sm:w-16 mb-4 transition-colors duration-500 ${isPast ? "bg-purple-400" : "bg-white/10"}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0b061a] text-white pb-20">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <div className="relative container-base mx-auto px-6">
                {/* Mode Toggle */}
                <div className="pt-24 flex justify-center mb-12">
                    <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-1">
                        <button
                            onClick={() => { setMode("booking"); setGeneratedTicket(null); }}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${
                                mode === "booking"
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                                    : "text-white/60 hover:text-white"
                            }`}
                        >
                            Book Tickets
                        </button>
                        <button
                            onClick={() => { setMode("generate"); if (events.length === 0) loadEvents(); }}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${
                                mode === "generate"
                                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                                    : "text-white/60 hover:text-white"
                            }`}
                        >
                            Generate Ticket
                        </button>
                    </div>
                </div>

                {/* Generate Ticket Mode */}
                {mode === "generate" && (
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h1 className="text-5xl lg:text-7xl font-bold mb-6">Generate Event Ticket</h1>
                            <p className="text-xl text-white/60">Select an event and participant to generate an admission ticket with QR code</p>
                        </div>

                        {/* Error Message */}
                        {ticketError && (
                            <div className="max-w-md mx-auto mb-8 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                                <p className="text-red-300 text-sm">{ticketError}</p>
                            </div>
                        )}

                        {/* Generated Ticket Display */}
                        {generatedTicket && selectedEventForTicket && (
                            <div className="mb-8">
                                <GeneratedTicketDisplay
                                    ticket={generatedTicket}
                                    eventName={selectedEventForTicket.name}
                                />
                                <div className="text-center mt-8">
                                    <button
                                        onClick={resetTicketGeneration}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                                    >
                                        Generate Another Ticket
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Ticket Form */}
                        {!generatedTicket && (
                            <TicketForm
                                events={events}
                                participants={participants}
                                onSubmit={handleGenerateTicket}
                                isLoading={isLoadingParticipants || isLoadingEvents}
                                isGenerating={isGeneratingTicket}
                                onEventChange={handleEventChange}
                            />
                        )}
                    </div>
                )}

                {/* Booking Mode (Original) */}
                {mode === "booking" && (
                    <>
                        {/* Header Section */}
                        <div className="pt-12 lg:pt-16 mb-16 text-center animate-fade-in">
                            <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase text-purple-400 mb-6 inline-block">
                                {EVENT_DATA.type} Booking
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-bold mb-6">{EVENT_DATA.name}</h1>
                            <p className="text-xl text-white/60 flex items-center justify-center gap-4">
                                <span>{EVENT_DATA.artist}</span>
                                <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                <span>{EVENT_DATA.venue}</span>
                            </p>
                        </div>

                {renderStepIndicator()}

                {/* Step 1: Show Selection */}
                {currentStep === "selection" && (
                    <div className="max-w-4xl mx-auto animate-slide-up">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="relative group overflow-hidden rounded-3xl aspect-[4/5] border border-white/10">
                                <img src={EVENT_DATA.banner} alt={EVENT_DATA.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b061a] via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-sm font-medium text-white/50 mb-2">Duration: {EVENT_DATA.duration}</p>
                                    <p className="text-lg font-medium leading-relaxed">{EVENT_DATA.description}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h2 className="text-2xl font-bold">Choose a Show</h2>
                                <div className="space-y-4">
                                    {EVENT_DATA.shows.map((show) => (
                                        <button
                                            key={show.id}
                                            onClick={() => setSelectedShow(show)}
                                            className={`w-full p-6 rounded-2xl border transition-all flex items-center justify-between group ${selectedShow.id === show.id ? "bg-purple-600 border-purple-500 shadow-lg shadow-purple-600/20" : "bg-white/5 border-white/10 hover:border-white/30"}`}
                                        >
                                            <div className="text-left">
                                                <p className={`text-sm ${selectedShow.id === show.id ? "text-purple-200" : "text-white/40"}`}>
                                                    {new Date(show.datetime).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                                                </p>
                                                <p className="text-xl font-bold">{new Date(show.datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                            </div>
                                            <div className={`p-2 rounded-full transition-colors ${selectedShow.id === show.id ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"}`}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentStep("tickets")}
                                    className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all hover:scale-[1.02]"
                                >
                                    Select Tickets →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Ticket Type Selection */}
                {currentStep === "tickets" && (
                    <div className="animate-slide-up">
                        <div className="max-w-5xl mx-auto">
                            {/* Section header */}
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold mb-2">Choose Your Ticket Type</h2>
                                <p className="text-white/40">Select up to 6 tickets across any combination of categories.</p>
                            </div>

                            {/* Ticket type cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                {EVENT_DATA.ticketTypes.map((type) => {
                                    const qty = getQty(type.id);
                                    const ac = accentClasses[type.accent];
                                    const isSelected = qty > 0;

                                    return (
                                        <div
                                            key={type.id}
                                            className={`relative group rounded-3xl border transition-all duration-300 overflow-hidden
                                                ${isSelected
                                                    ? `${ac.border} shadow-xl ${ac.glow} bg-white/5`
                                                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                                                }`}
                                        >
                                            {/* Top gradient strip */}
                                            <div className={`h-1.5 w-full bg-gradient-to-r ${type.color}`} />

                                            <div className="p-7">
                                                {/* Header row */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-3xl">{type.icon}</span>
                                                        <div>
                                                            <h3 className="text-xl font-black tracking-tight">{type.label}</h3>
                                                            <p className={`text-xs font-bold uppercase tracking-widest ${ac.text}`}>
                                                                ${type.price} / ticket
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${ac.badge}`}>
                                                        {type.available} left
                                                    </span>
                                                </div>

                                                {/* Description */}
                                                <p className="text-sm text-white/50 leading-relaxed mb-5">{type.description}</p>

                                                {/* Perks */}
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {type.perks.map((perk) => (
                                                        <span key={perk} className="text-[11px] font-semibold px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-white/50">
                                                            {perk}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Quantity selector */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-white/40">Quantity</span>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => setQty(type.id, -1)}
                                                            disabled={qty === 0}
                                                            className={`w-10 h-10 rounded-full font-bold text-xl flex items-center justify-center transition-all duration-200
                                                                ${qty > 0
                                                                    ? `bg-white/10 hover:bg-white/20 text-white`
                                                                    : "bg-white/5 text-white/20 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            −
                                                        </button>
                                                        <span className={`text-2xl font-black w-8 text-center transition-all ${qty > 0 ? "text-white" : "text-white/20"}`}>
                                                            {qty}
                                                        </span>
                                                        <button
                                                            onClick={() => setQty(type.id, +1)}
                                                            disabled={totalTickets >= 6 || qty >= 6}
                                                            className={`w-10 h-10 rounded-full font-bold text-xl flex items-center justify-center transition-all duration-200
                                                                ${totalTickets < 6 && qty < 6
                                                                    ? `bg-gradient-to-br ${type.color} text-white hover:opacity-90 shadow-lg`
                                                                    : "bg-white/5 text-white/20 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Selected subtotal */}
                                                {isSelected && (
                                                    <div className={`mt-4 pt-4 border-t border-white/5 flex items-center justify-between`}>
                                                        <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">{qty} ticket{qty > 1 ? "s" : ""}</span>
                                                        <span className={`font-black text-lg ${ac.text}`}>${type.price * qty}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bottom bar */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div>
                                    <p className="text-sm font-bold text-white/40 uppercase tracking-wider mb-1">Your Selection</p>
                                    <div className="flex flex-wrap gap-2">
                                        {ticketSelections.length === 0 ? (
                                            <span className="text-white/30 text-sm italic">No tickets selected yet</span>
                                        ) : (
                                            ticketSelections.map((sel) => {
                                                const type = EVENT_DATA.ticketTypes.find((t) => t.id === sel.typeId)!;
                                                const ac = accentClasses[type.accent];
                                                return (
                                                    <span key={sel.typeId} className={`px-3 py-1 rounded-full text-xs font-bold border ${ac.badge}`}>
                                                        {sel.qty}× {type.label}
                                                    </span>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 w-full sm:w-auto">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Total</p>
                                        <p className="text-3xl font-black">${totalPrice}</p>
                                    </div>
                                    <button
                                        disabled={totalTickets === 0}
                                        onClick={() => setCurrentStep("attendees")}
                                        className={`px-8 py-4 rounded-2xl font-bold text-base transition-all flex-1 sm:flex-initial ${totalTickets > 0
                                            ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                                            : "bg-white/5 text-white/20 cursor-not-allowed"
                                            }`}
                                    >
                                        Continue →
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <button onClick={() => setCurrentStep("selection")} className="text-white/40 hover:text-white transition-colors">
                                    ← Back to Shows
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Attendee Details */}
                {currentStep === "attendees" && (
                    <div className="max-w-2xl mx-auto animate-slide-up">
                        <h2 className="text-3xl font-bold mb-2">Attendee Information</h2>
                        <p className="text-white/40 mb-8">Fill in the details for each ticket holder.</p>
                        <div className="space-y-6">
                            {flatTickets.map((ticket, i) => {
                                const ticketKey = `${ticket.typeId}-${i}`;
                                const ac = accentClasses[EVENT_DATA.ticketTypes.find((t) => t.id === ticket.typeId)!.accent];
                                return (
                                    <div key={ticketKey} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-black uppercase tracking-widest ${ac.text}`}>
                                                TICKET {i + 1} · {ticket.label}
                                            </span>
                                            <span className="text-sm font-bold text-white/40">${ticket.price}</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <TextField
                                                label="Full Name"
                                                placeholder="Attendee name"
                                                variant="dark"
                                                required
                                                value={attendees[ticketKey]?.name || ""}
                                                onChange={(e) => setAttendees({ ...attendees, [ticketKey]: { ...attendees[ticketKey], name: e.target.value } })}
                                            />
                                            <TextField
                                                label="Email Address"
                                                placeholder="Email for e-ticket"
                                                variant="dark"
                                                required
                                                value={attendees[ticketKey]?.email || ""}
                                                onChange={(e) => setAttendees({ ...attendees, [ticketKey]: { ...attendees[ticketKey], email: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCurrentStep("tickets")}
                                    className="flex-1 border border-white/10 py-4 rounded-xl font-bold hover:bg-white/5 transition-all"
                                >
                                    Change Tickets
                                </button>
                                <button
                                    onClick={() => setCurrentStep("payment")}
                                    className="flex-[2] bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === "payment" && (
                    <div className="max-w-4xl mx-auto animate-slide-up">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-8">
                                <section>
                                    <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {["Credit Card", "PayPal", "Apple Pay", "Google Pay"].map((method) => (
                                            <button key={method} className="p-4 bg-white/5 border border-purple-500/30 rounded-2xl text-center hover:bg-white/10 transition-colors">
                                                <div className="w-8 h-8 bg-white/10 rounded-full mx-auto mb-3" />
                                                <span className="text-xs font-bold">{method}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <TextField label="Card Number" placeholder="**** **** **** ****" variant="dark" />
                                        <TextField label="Cardholder Name" placeholder="John Doe" variant="dark" />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                        <TextField label="Expiry" placeholder="MM/YY" variant="dark" />
                                        <TextField label="CVV" placeholder="***" variant="dark" />
                                        <TextField label="Zip Code" placeholder="00000" variant="dark" />
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-purple-600 rounded-[32px] p-8 shadow-2xl">
                                    <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                                    <div className="space-y-3 mb-8">
                                        {ticketSelections.map((sel) => {
                                            const type = EVENT_DATA.ticketTypes.find((t) => t.id === sel.typeId)!;
                                            return (
                                                <div key={sel.typeId} className="flex justify-between text-sm text-purple-200">
                                                    <span>{sel.qty}× {type.label}</span>
                                                    <span>${type.price * sel.qty}</span>
                                                </div>
                                            );
                                        })}
                                        <div className="flex justify-between text-sm text-purple-200">
                                            <span>Booking Fee</span>
                                            <span>$12.50</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/10 flex justify-between">
                                            <span className="font-bold">Total</span>
                                            <span className="text-2xl font-black">${(totalPrice + 12.50).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button
                                        disabled={isProcessing}
                                        onClick={handlePayment}
                                        className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3 shadow-lg"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : "Confirm & Pay"}
                                    </button>
                                </div>
                                <p className="text-center text-white/30 text-xs px-4 leading-relaxed">
                                    By clicking &quot;Confirm &amp; Pay&quot;, you agree to the Terms of Service and Refund Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: E-Ticket */}
                {currentStep === "ticket" && (
                    <div className="max-w-3xl mx-auto animate-slide-up space-y-12">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-bold mb-4">Payment Successful!</h2>
                            <p className="text-white/60">Your e-tickets have been sent to your registered emails.</p>
                        </div>

                        <div className="space-y-8">
                            {flatTickets.map((ticket, i) => {
                                const ticketKey = `${ticket.typeId}-${i}`;
                                const attendee = attendees[ticketKey] || { name: "Valued Guest", email: "" };
                                const participantId = `RS-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${ticket.typeId}${i + 1}`;
                                const type = EVENT_DATA.ticketTypes.find((t) => t.id === ticket.typeId)!;
                                const ac = accentClasses[type.accent];

                                return (
                                    <div key={ticketKey} className="relative group mx-auto max-w-2xl">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                        <div
                                            ref={(el) => { ticketRefs.current[ticketKey] = el; }}
                                            className="relative flex flex-col md:flex-row bg-[#1a1625] text-white rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
                                        >
                                            <div className={`w-full md:w-48 bg-gradient-to-b ${type.color} relative overflow-hidden hidden md:block`}>
                                                <img src={EVENT_DATA.banner} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" alt="" />
                                                <div className="absolute inset-0 flex items-center justify-center -rotate-90">
                                                    <span className="text-4xl font-black tracking-[0.5em] text-white/20 whitespace-nowrap uppercase">{EVENT_DATA.type}</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 p-8 md:p-10 relative">
                                                <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-gradient-to-br from-purple-700 via-transparent to-transparent" />
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-8">
                                                        <div>
                                                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${ac.text}`}>PID: {participantId}</p>
                                                            <h3 className="text-2xl font-black leading-tight bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">{EVENT_DATA.name}</h3>
                                                        </div>
                                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${ac.badge}`}>{type.label}</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-y-5 gap-x-8 mb-6">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Guest Name</p>
                                                            <p className="font-bold">{attendee.name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Ticket #</p>
                                                            <p className="font-bold">{i + 1} of {totalTickets}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Schedule</p>
                                                            <p className="font-bold">{new Date(selectedShow.datetime).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Entrance</p>
                                                            <p className="font-bold uppercase">{selectedShow.gate}</p>
                                                        </div>
                                                    </div>

                                                    <div className="relative my-4">
                                                        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/20" />
                                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a1625] px-2 text-xs">✁</span>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">{type.icon}</span>
                                                            <span className={`text-xs font-black uppercase tracking-widest ${ac.text}`}>{type.label} ADMISSION</span>
                                                        </div>
                                                        <p className="text-[10px] font-mono text-white/20">{participantId}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-56 bg-white/5 md:bg-black/20 p-8 flex flex-col items-center justify-between relative border-t md:border-t-0 md:border-l border-dashed border-white/10">
                                                <div className="hidden md:block absolute -top-4 -left-4 w-8 h-8 bg-[#0b061a] rounded-full border border-white/5" />
                                                <div className="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 bg-[#0b061a] rounded-full border border-white/5" />
                                                <div className="p-4 bg-white rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center">
                                                    <QRCode value={participantId} size={120} bgColor="#fff" fgColor="#000" />
                                                </div>
                                                <p className="text-xs font-bold text-purple-400 tracking-widest">RAIHSUITE PRO</p>
                                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                                    <button
                                                        onClick={() => handleDownload(ticketKey)}
                                                        className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-purple-500 hover:text-white transition-all scale-90 group-hover:scale-100 duration-300 flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        Save Pass (PDF)
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Tickets
                            </button>
                            <a href="/" className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all text-center">
                                Return to Home
                            </a>
                        </div>
                    </div>
                )}

                {/* Admin/Staff Validation Simulation - Only in Booking Mode */}
                {mode === "booking" && (
                    <div className="mt-32 pt-20 border-t border-white/5">
                        <div className="bg-purple-900/10 border border-purple-500/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Staff Terminal (Admin Mode)</h2>
                                        <p className="text-white/40 text-sm max-w-md">
                                            Simulate entry point validation. Scan tickets to check validity and prevent duplicate entry.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <a
                                            href="/events/admin"
                                            className="bg-purple-600 text-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                            Launch Digital Terminal
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                                        <p className="text-xs font-bold text-white/40 uppercase mb-4 tracking-wider">Validation Logic</p>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2 text-green-400">
                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                                One-time scan only
                                            </li>
                                            <li className="flex items-center gap-2 text-white/60">
                                                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                                Auto-timestamp entry
                                            </li>
                                            <li className="flex items-center gap-2 text-white/60">
                                                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                                Manual override enabled
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="md:col-span-2 bg-black/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10 flex items-center justify-between h-full">
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Terminal Preview</p>
                                                <h3 className="text-xl font-bold">Real-time Entry Monitor</h3>
                                                <p className="text-white/40 text-sm italic">Simulated data: 182 entries validated today.</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <div className="w-24 h-24 border-4 border-dashed border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
                                                    <div className="w-12 h-12 bg-white/5 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -mr-32 -mt-32" />
                        </div>
                    </div>
                )}
                    </>
                )}
            </div>
        </div>
    );
}
