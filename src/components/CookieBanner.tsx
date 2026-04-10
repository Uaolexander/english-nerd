"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function acceptAll() {
    localStorage.setItem("cookie-consent", "all");
    setVisible(false);
  }

  function rejectNonEssential() {
    localStorage.setItem("cookie-consent", "essential");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pt-3 sm:px-6 sm:pt-6" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))' }}>
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#111114] shadow-2xl shadow-black/60 backdrop-blur px-4 py-3 sm:p-5 flex items-center gap-3 sm:gap-6">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 shrink-0 text-[#F5DA20]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>
            <span className="text-xs font-black text-white">Cookies</span>
            <span className="hidden sm:inline text-xs text-white/50">— we use essential + optional analytics cookies.</span>
          </div>
          <p className="hidden sm:block mt-0.5 text-xs text-white/50 leading-relaxed">
            See our <a href="/privacy-policy" className="text-[#F5DA20] hover:underline">Privacy Policy</a> for details.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={rejectNonEssential}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-white/60 hover:border-white/30 hover:text-white transition whitespace-nowrap"
          >
            Essential only
          </button>
          <button
            onClick={acceptAll}
            className="rounded-lg bg-[#F5DA20] px-4 py-1.5 text-xs font-black text-black hover:opacity-90 transition whitespace-nowrap"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
