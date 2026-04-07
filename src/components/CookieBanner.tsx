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
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}>
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#111114] shadow-2xl shadow-black/60 backdrop-blur p-5 sm:flex sm:items-center sm:gap-6">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-black text-white">We use cookies 🍪</div>
          <p className="mt-1 text-xs text-white/50 leading-relaxed">
            We use essential cookies to run the site and optional cookies for analytics and personalised advertising via Google AdSense. See our{" "}
            <a href="/privacy-policy" className="text-[#F5DA20] hover:underline">Privacy Policy</a>{" "}
            for details.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 shrink-0">
          <button
            onClick={rejectNonEssential}
            className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-white/60 hover:border-white/30 hover:text-white transition"
          >
            Essential only
          </button>
          <button
            onClick={acceptAll}
            className="rounded-xl bg-[#F5DA20] px-5 py-2 text-xs font-black text-black hover:opacity-90 transition"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
