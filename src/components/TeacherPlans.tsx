"use client";

import { useState } from "react";
import PromoCodeModal from "@/components/PromoCodeModal";

function Check({ cls }: { cls?: string }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${cls ?? "text-[#F5DA20]"}`}
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

const FEATURES = [
  "Student management dashboard",
  "Invite students by email",
  "Create & assign exercises, essays, quizzes",
  "Track student progress & weak areas",
  "Test result breakdowns",
  "Essay review with feedback",
  "Email notifications to students",
];

type Theme = {
  label: string;       // label text color
  labelBg: string;     // "TEACHER" label color
  badge: string;       // "Most Popular" badge (only Solo)
  card: string;        // card border + bg
  numText: string;     // big student number
  numBg: string;       // student block bg
  iconColor: string;   // people icon
  saveChip: string;    // Save X% chip
  cta: string;         // CTA button
};

const THEMES: Record<string, Theme> = {
  starter: {
    label: "text-sky-400/70",
    labelBg: "text-sky-400/70",
    badge: "",
    card: "border border-white/10 bg-white/[0.04]",
    numText: "text-sky-400",
    numBg: "bg-sky-500/10",
    iconColor: "text-sky-400/60",
    saveChip: "bg-sky-500/20 text-sky-400",
    cta: "border border-white/12 bg-white/6 text-white hover:bg-white/10",
  },
  solo: {
    label: "text-[#F5DA20]/70",
    labelBg: "text-[#F5DA20]/70",
    badge: "bg-[#F5DA20] text-black",
    card: "border-2 border-[#F5DA20]/50 bg-gradient-to-br from-[#F5DA20]/8 to-amber-600/4 shadow-[0_0_50px_rgba(245,218,32,0.1)]",
    numText: "text-[#F5DA20]",
    numBg: "bg-[#F5DA20]/12",
    iconColor: "text-[#F5DA20]/70",
    saveChip: "bg-emerald-500/20 text-emerald-400",
    cta: "bg-[#F5DA20] text-black hover:bg-[#ffe033] shadow-[0_4px_20px_rgba(245,218,32,0.25)]",
  },
  plus: {
    label: "text-violet-400/70",
    labelBg: "text-violet-400/70",
    badge: "",
    card: "border border-violet-500/25 bg-violet-500/[0.05]",
    numText: "text-violet-400",
    numBg: "bg-violet-500/12",
    iconColor: "text-violet-400/60",
    saveChip: "bg-violet-500/20 text-violet-400",
    cta: "border border-white/12 bg-white/6 text-white hover:bg-white/10",
  },
};

type Plan = {
  id: string;
  name: string;
  studentNum: number;
  monthlyPrice: string;
  annualTotal: string;
  annualMonthly: string;
  savePercent: string;
  savePerYear: string;
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    studentNum: 5,
    monthlyPrice: "$6.99",
    annualTotal: "$59",
    annualMonthly: "$4.92",
    savePercent: "30%",
    savePerYear: "$25",
  },
  {
    id: "solo",
    name: "Solo",
    studentNum: 15,
    monthlyPrice: "$9.99",
    annualTotal: "$79",
    annualMonthly: "$6.58",
    savePercent: "34%",
    savePerYear: "$41",
    popular: true,
  },
  {
    id: "plus",
    name: "Plus",
    studentNum: 40,
    monthlyPrice: "$15.99",
    annualTotal: "$129",
    annualMonthly: "$10.75",
    savePercent: "33%",
    savePerYear: "$63",
  },
];

export default function TeacherPlans() {
  // Default = annual — anchors on the best-value option immediately
  const [annual, setAnnual] = useState(true);


  return (
    <div>
      {/* ── Billing toggle ──────────────────────────────────────────────── */}
      <div className="mb-12 flex flex-col items-center gap-3">
        <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 gap-1">
          <button
            onClick={() => setAnnual(false)}
            className={`rounded-xl px-6 py-2.5 text-sm font-black transition ${
              !annual ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-black transition ${
              annual ? "bg-[#F5DA20] text-black" : "text-white/35 hover:text-white/60"
            }`}
          >
            Annual
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                annual ? "bg-black/15 text-black/70" : "bg-emerald-500/20 text-emerald-400"
              }`}
            >
              Save up to 34%
            </span>
          </button>
        </div>
        <p className="text-xs text-white/25">
          {annual ? "Billed once per year · Cancel any time" : "Billed monthly · Cancel any time"}
        </p>
      </div>

      {/* ── Cards ───────────────────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-3">
        {PLANS.map((plan) => {
          const t = THEMES[plan.id];
          return (
            <div key={plan.id} className="relative flex flex-col pt-5">

              {/* "Most Popular" badge — invisible on non-popular to preserve alignment */}
              <div className={`absolute top-0 left-0 right-0 flex justify-center ${!plan.popular ? "invisible" : ""}`}>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-black shadow-lg whitespace-nowrap ${t.badge}`}>
                  ★ Most Popular
                </span>
              </div>

              {/* Card */}
              <div className={`flex flex-1 flex-col rounded-2xl p-7 ${t.card}`}>

                {/* Header */}
                <div>
                  <div className={`mb-0.5 text-[10px] font-black uppercase tracking-widest ${t.labelBg}`}>
                    Teacher
                  </div>
                  <div className="text-xl font-black text-white">{plan.name}</div>

                  {/* Student limit — the key differentiator */}
                  <div className={`mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 ${t.numBg}`}>
                    <svg className={`h-5 w-5 shrink-0 ${t.iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <div>
                      <div className={`text-2xl font-black leading-none ${t.numText}`}>
                        {plan.studentNum}
                      </div>
                      <div className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-white/35">
                        students max
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-5 mb-6">
                  {annual ? (
                    <>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-semibold text-white/30 line-through">
                          {plan.monthlyPrice}/mo
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${t.saveChip}`}>
                          Save {plan.savePercent}
                        </span>
                      </div>
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-black text-white">{plan.annualMonthly}</span>
                        <span className="mb-1 text-sm text-white/40">/ mo</span>
                      </div>
                      <p className="mt-1.5 text-xs text-white/35">
                        Billed as{" "}
                        <span className="font-black text-white/60">
                          {plan.annualTotal} / year
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-black text-white">{plan.monthlyPrice}</span>
                        <span className="mb-1 text-sm text-white/35">/ mo</span>
                      </div>
                      <p className="mt-1.5 text-xs text-white/30">
                        Or{" "}
                        <button
                          onClick={() => setAnnual(true)}
                          className="font-bold text-[#F5DA20]/70 underline underline-offset-2 hover:text-[#F5DA20] transition"
                        >
                          pay annually
                        </button>{" "}
                        — save <span className="font-bold text-white/50">{plan.savePerYear}/year</span>
                      </p>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-3">
                  {FEATURES.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.popular ? "text-white/70" : "text-white/50"}`}>
                      <Check cls={`mt-0.5 shrink-0 ${t.numText}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="/contact"
                  className={`block w-full rounded-xl py-3.5 text-center text-sm font-black transition ${t.cta}`}
                >
                  Get in touch →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voucher */}
      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20]/15 text-xl">
          🎟️
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white">Have a teacher voucher?</p>
          <p className="text-xs text-white/40">Got a code from us? Redeem it to activate your Teacher account instantly.</p>
        </div>
        <PromoCodeModal />
      </div>
    </div>
  );
}
