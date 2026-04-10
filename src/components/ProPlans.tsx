"use client";

import { useState } from "react";

function Check() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[#F5DA20]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const PRO_FEATURES = [
  "SpeedRound game on every lesson",
  "PDF worksheets + full answer keys",
  "Related Topics on all tenses",
  "Watch & Learn video exercises",
  "Downloadable certificates",
  "Progress statistics dashboard",
  "Ad-free experience · PRO crown badge",
];

export default function ProPlans() {
  // Default = annual — user anchors on the best deal first
  const [annual, setAnnual] = useState(true);

  return (
    <div className="mx-auto max-w-3xl">
      {/* ── Billing toggle ──────────────────────────────────────────────── */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 gap-1">
          <button
            onClick={() => setAnnual(false)}
            className={`rounded-xl px-6 py-2.5 text-sm font-black transition ${
              !annual ? "bg-white/10 text-white" : "text-white/50 hover:text-white/60"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-black transition ${
              annual ? "bg-[#F5DA20] text-black" : "text-white/50 hover:text-white/60"
            }`}
          >
            Annual
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                annual ? "bg-black/15 text-black/70" : "bg-emerald-500/20 text-emerald-400"
              }`}
            >
              Save 50%
            </span>
          </button>
        </div>
        <p className="text-xs text-white/45">
          {annual ? "Billed once per year · Cancel any time" : "Billed monthly · Cancel any time"}
        </p>
      </div>

      {/* ── Cards — Annual FIRST (left) for price anchoring ─────────────── */}
      <div className="grid gap-5 sm:grid-cols-2">

        {/* ── Annual card — shown first so users anchor on $2.50, not $4.99 */}
        <div
          className={`relative flex flex-col overflow-hidden rounded-2xl border-2 p-8 transition-all duration-200 ${
            annual
              ? "border-[#F5DA20]/55 bg-gradient-to-br from-[#F5DA20]/10 to-amber-600/5 shadow-[0_0_70px_rgba(245,218,32,0.18)]"
              : "border-[#F5DA20]/20 bg-gradient-to-br from-[#F5DA20]/4 to-transparent opacity-70"
          }`}
        >
          {/* Ribbon */}
          <div className="absolute -right-9 top-6 rotate-45 bg-[#F5DA20] px-10 py-0.5 text-[10px] font-black text-black uppercase tracking-widest shadow-lg">
            Best Value
          </div>

          <div className="mb-1 text-xs font-black uppercase tracking-widest text-[#F5DA20]/70">Annual</div>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-white/50 line-through">$4.99/mo</span>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-black text-emerald-400">
              Save 50%
            </span>
          </div>
          <div className="mt-1 flex items-end gap-1.5">
            <span className="text-5xl font-black text-white">$2.50</span>
            <span className="mb-2 text-sm text-white/55">/ month</span>
          </div>
          <p className="mt-1 text-xs text-white/55">
            Billed as <span className="font-black text-white/70">$29.99 / year</span>
            <span className="ml-2 text-white/30">· $0.08/day</span>
          </p>

          <ul className="mt-6 mb-8 flex-1 space-y-3">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                <Check />{f}
              </li>
            ))}
          </ul>

          <a
            href="https://englishnerd.lemonsqueezy.com/checkout/buy/cdf8978d-3113-4911-ac9f-ec0f336ef92f"
            className="block w-full rounded-xl bg-[#F5DA20] py-3.5 text-center text-sm font-black text-black shadow-[0_4px_28px_rgba(245,218,32,0.32)] transition hover:bg-[#ffe033]"
          >
            Get Annual PRO — $29.99/year
          </a>
          <p className="mt-3 text-center text-xs text-white/50">🛡 7-day money-back guarantee</p>
        </div>

        {/* ── Monthly card ── */}
        <div
          className={`flex flex-col rounded-2xl border p-8 transition-all duration-200 ${
            !annual
              ? "border-white/20 bg-white/[0.06]"
              : "border-white/6 bg-white/[0.02] opacity-60"
          }`}
        >
          <div className="mb-1 text-xs font-black uppercase tracking-widest text-white/50">Monthly</div>

          <div className="mt-3 flex items-end gap-1.5">
            <span className="text-5xl font-black text-white">$4.99</span>
            <span className="mb-2 text-sm text-white/50">/ month</span>
          </div>
          <p className="mt-1 text-xs text-white/45">
            Billed monthly · <span className="text-white/35">$59.88/year total</span>
          </p>

          <p className="mt-3 text-xs text-white/55">
            Or{" "}
            <button
              onClick={() => setAnnual(true)}
              className="font-bold text-[#F5DA20]/70 underline underline-offset-2 hover:text-[#F5DA20] transition"
            >
              switch to Annual
            </button>{" "}
            and save <span className="font-bold text-white/60">$30/year</span>
          </p>

          <ul className="mt-6 mb-8 flex-1 space-y-3">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-white/50">
                <Check />{f}
              </li>
            ))}
          </ul>

          <a
            href="https://englishnerd.lemonsqueezy.com/checkout/buy/d99ea748-d180-4c9d-ba5b-aa420e67a040"
            className="block w-full rounded-xl border border-white/12 bg-white/6 py-3.5 text-center text-sm font-black text-white transition hover:bg-white/10"
          >
            Get Monthly PRO
          </a>
        </div>
      </div>
    </div>
  );
}
