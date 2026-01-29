export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b061a]">
            <div className="relative">
                {/* Outer Ring */}
                <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-brand-light animate-spin"></div>
                {/* Inner Ring */}
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-l-2 border-r-2 border-purple-500/30 animate-spin transition-all duration-1000 rotate-45"></div>
                {/* Center Logo/Dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
            </div>
        </div>
    );
}
