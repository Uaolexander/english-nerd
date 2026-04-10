export default function BillingPortalLoading() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white flex items-center justify-center overflow-hidden">

      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#F5DA20]/8 blur-[160px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/4 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/4 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">

        {/* Animated ring + icon */}
        <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
          {/* Outer pulsing glow */}
          <div className="absolute inset-0 rounded-full bg-[#F5DA20]/15 animate-pulse" />
          {/* Spinning ring */}
          <svg
            className="absolute inset-0 h-full w-full animate-spin"
            style={{ animationDuration: "2s" }}
            viewBox="0 0 112 112"
            fill="none"
          >
            <circle
              cx="56"
              cy="56"
              r="50"
              stroke="url(#spinGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="80 235"
            />
            <defs>
              <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F5DA20" stopOpacity="0" />
                <stop offset="100%" stopColor="#F5DA20" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
          {/* Inner circle */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#F5DA20]/10 border border-[#F5DA20]/25">
            <svg className="h-9 w-9 text-[#F5DA20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">
          Connecting to{" "}
          <span className="text-[#F5DA20]">billing portal</span>
        </h1>
        <p className="mt-3 max-w-sm text-sm text-white/50 leading-relaxed">
          Fetching your secure billing session. You&apos;ll be redirected to LemonSqueezy in a moment.
        </p>

        {/* Animated dots */}
        <div className="mt-8 flex items-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#F5DA20]/60 animate-pulse"
              style={{ animationDelay: `${i * 180}ms`, animationDuration: "1.2s" }}
            />
          ))}
        </div>

        {/* Security badge */}
        <div className="mt-10 flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-xs text-white/35">
          <svg className="h-3.5 w-3.5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Secured by LemonSqueezy</span>
        </div>

      </div>
    </main>
  );
}
