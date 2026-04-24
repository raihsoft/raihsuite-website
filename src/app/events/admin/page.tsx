"use client";

import React, { useState, useEffect } from "react";
import TextField from "@/components/form/TextField";

interface ScanLog {
    id: string;
    ticketId: string;
    attendee: string;
    status: "VALID" | "INVALID" | "ALREADY_SCANNED";
    timestamp: string;
    seat: string;
}

export default function AdminScannerPage() {
    const [ticketInput, setTicketInput] = useState("");
    const [lastScan, setLastScan] = useState<ScanLog | null>(null);
    const [logs, setLogs] = useState<ScanLog[]>([
        { id: "1", ticketId: "TCKT-A12-X9J2", attendee: "John Doe", status: "VALID", timestamp: "14:32:01", seat: "A12" },
        { id: "2", ticketId: "TCKT-B04-L8W1", attendee: "Sarah Smith", status: "VALID", timestamp: "14:31:45", seat: "B04" },
        { id: "3", ticketId: "TCKT-C09-K2M3", attendee: "Michael Brown", status: "ALREADY_SCANNED", timestamp: "14:28:12", seat: "C09" },
    ]);
    const [isScanning, setIsScanning] = useState(false);
    const [stats, setStats] = useState({ total: 450, entered: 182, pending: 268 });

    const handleManualScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketInput) return;

        setIsScanning(true);

        // Simulate API delay
        setTimeout(() => {
            const isDuplicate = logs.some(log => log.ticketId === ticketInput && log.status === "VALID");
            const isValidFormat = ticketInput.startsWith("TCKT-");

            const newScan: ScanLog = {
                id: Math.random().toString(36).substr(2, 9),
                ticketId: ticketInput,
                attendee: isValidFormat ? "Recognized Guest" : "Unknown",
                status: !isValidFormat ? "INVALID" : isDuplicate ? "ALREADY_SCANNED" : "VALID",
                timestamp: new Date().toLocaleTimeString([], { hour12: false }),
                seat: isValidFormat ? ticketInput.split("-")[1] || "N/A" : "N/A"
            };

            setLastScan(newScan);
            setLogs([newScan, ...logs]);
            setTicketInput("");
            setIsScanning(false);

            if (newScan.status === "VALID") {
                setStats(prev => ({ ...prev, entered: prev.entered + 1, pending: prev.pending - 1 }));
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#05030f] text-white">
            {/* Top Header */}
            <div className="border-b border-white/10 bg-[#0b061a]/80 backdrop-blur-md sticky top-0 z-40">
                <div className="container-base mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Staff Terminal</h1>
                            <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Entry Point Alpha • Live</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Attendance</span>
                            <span className="text-sm font-black">{stats.entered} / {stats.total}</span>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="container-base mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Scanner Section */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Scan Status Display */}
                        <div className={`aspect-video rounded-[40px] border-2 flex flex-col items-center justify-center text-center p-12 transition-all duration-500 relative overflow-hidden ${!lastScan ? "bg-white/5 border-white/10" :
                                lastScan.status === "VALID" ? "bg-green-500/10 border-green-500/50" :
                                    lastScan.status === "ALREADY_SCANNED" ? "bg-amber-500/10 border-amber-500/50" : "bg-red-500/10 border-red-500/50"
                            }`}>
                            {/* Animated Background Rings for validation */}
                            {lastScan?.status === "VALID" && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-64 h-64 border border-green-500/20 rounded-full animate-ping" />
                                    <div className="absolute w-96 h-96 border border-green-500/10 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
                                </div>
                            )}

                            {!lastScan ? (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                        <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white/40">Ready to Scan</h2>
                                    <p className="text-white/20 text-sm max-w-xs mx-auto">Position the ticket QR code in front of the camera or enter ID manually.</p>
                                </div>
                            ) : (
                                <div className="relative z-10 space-y-4">
                                    <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 ${lastScan.status === "VALID" ? "bg-green-500 text-white" :
                                            lastScan.status === "ALREADY_SCANNED" ? "bg-amber-500 text-white" : "bg-red-500 text-white"
                                        }`}>
                                        {lastScan.status === "VALID" ? (
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                                        {lastScan.status === "VALID" ? "Access Granted" :
                                            lastScan.status === "ALREADY_SCANNED" ? "Duplicate Entry" : "Invalid Ticket"}
                                    </h2>
                                    <div className="pt-4 space-y-1">
                                        <p className="text-2xl font-bold">{lastScan.attendee}</p>
                                        <p className="text-white/60 font-mono">SEAT: {lastScan.seat} • {lastScan.ticketId}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Manual Entry Form */}
                        <form onSubmit={handleManualScan} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <TextField
                                    label="Manual Ticket ID Entry"
                                    placeholder="TCKT-A12-XXXX"
                                    variant="dark"
                                    value={ticketInput}
                                    onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isScanning}
                                className="bg-white text-black h-[52px] px-8 rounded-xl font-bold hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50 w-full sm:w-auto"
                            >
                                {isScanning ? "Processing..." : "Validate"}
                            </button>
                        </form>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Expected</p>
                                    <p className="text-2xl font-black">{stats.total}</p>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
                                <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Checked In</p>
                                    <p className="text-2xl font-black">{stats.entered}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Sidebar */}
                    <div className="lg:col-span-5 flex flex-col h-[700px]">
                        <div className="bg-white/5 border border-white/10 rounded-t-[32px] p-6 border-b-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full" />
                                    Recent Activity
                                </h3>
                                <span className="text-[10px] font-black text-white/20 uppercase">Last 50 Scans</span>
                            </div>
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/10 border-t-0 p-4 overflow-y-auto space-y-2 custom-scrollbar">
                            {logs.map((log) => (
                                <div key={log.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1.5 h-1.5 rounded-full ${log.status === "VALID" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" :
                                                log.status === "ALREADY_SCANNED" ? "bg-amber-500" : "bg-red-500"
                                            }`} />
                                        <div>
                                            <p className="font-bold text-sm">{log.attendee}</p>
                                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">{log.ticketId} • SEAT {log.seat}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${log.status === "VALID" ? "text-green-400" :
                                                log.status === "ALREADY_SCANNED" ? "text-amber-400" : "text-red-400"
                                            }`}>
                                            {log.status.replace("_", " ")}
                                        </p>
                                        <p className="text-[10px] text-white/20">{log.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-b-[32px] p-4 border-t-0">
                            <button className="w-full py-3 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors">
                                Download Full Entry Log
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
}
