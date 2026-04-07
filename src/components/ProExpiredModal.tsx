"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ProExpiredModal({ userKey }: { userKey: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const key = `pro_expired_seen_${userKey}`;
    if (!sessionStorage.getItem(key)) {
      // Small delay so page loads first, then modal appears
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, [userKey]);

  function dismiss() {
    sessionStorage.setItem(`pro_expired_seen_${userKey}`, "1");
    setShow(false);
  }

  if (!show) return null;

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto"
      onClick={dismiss}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative flex min-h-full items-center justify-center p-4">
      {/* Modal */}
      <div
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#F5DA20] via-amber-400 to-[#F5DA20]" />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-slate-500 transition hover:bg-black/10"
          aria-label="Close"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="px-7 pb-8 pt-7">
          {/* Icon */}
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F5DA20] to-amber-500 shadow-lg shadow-[#F5DA20]/30">
            <svg className="h-7 w-7 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black text-slate-900">Your PRO has expired</h2>
          <p className="mt-1 text-sm font-semibold text-amber-600">Come back to the full experience</p>

          {/* Description */}
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            You&apos;ve already seen what PRO can do. SpeedRound games, PDF worksheets, certificates and more — all waiting for you.
          </p>

          {/* What they're missing */}
          <ul className="mt-4 space-y-2">
            {[
              "SpeedRound on every grammar lesson",
              "Print-ready PDF worksheets",
              "Downloadable certificates",
              "Progress stats dashboard",
              "Ad-free experience",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F5DA20] text-[10px] font-black text-black">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Price reminder */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <div>
              <div className="text-xs text-slate-400 line-through">$59.88/yr</div>
              <div className="text-lg font-black text-slate-900">$29.99<span className="text-sm font-semibold text-slate-400">/year</span></div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">Save 50%</span>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="/pro"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F5DA20] to-amber-400 px-5 py-3.5 text-sm font-black text-black shadow-lg shadow-[#F5DA20]/25 transition hover:opacity-90"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
              </svg>
              Renew PRO — $29.99/year
            </a>
            <button
              onClick={dismiss}
              className="w-full rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-black/5"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>,
    document.body
  );
}
