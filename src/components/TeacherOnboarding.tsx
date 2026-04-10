"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

type Plan = "starter" | "solo" | "plus";

// ── Plan theme ────────────────────────────────────────────────────────────────

const THEME: Record<Plan, { hex: string; bar: string; badge: string; badgeText: string; ring: string; label: string }> = {
  starter: { hex: "#38BDF8", bar: "bg-sky-500",    badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",    badgeText: "text-sky-400",    ring: "ring-sky-500/40", label: "Starter" },
  solo:    { hex: "#F5DA20", bar: "bg-[#F5DA20]",   badge: "bg-[#F5DA20]/15 text-[#F5DA20] border-[#F5DA20]/30", badgeText: "text-[#F5DA20]", ring: "ring-[#F5DA20]/40", label: "Solo" },
  plus:    { hex: "#8B5CF6", bar: "bg-violet-500",  badge: "bg-violet-500/15 text-violet-400 border-violet-500/30", badgeText: "text-violet-400", ring: "ring-violet-500/40", label: "Plus" },
};

// ── Step illustrations ────────────────────────────────────────────────────────

function IllustrationDashboard({ plan }: { plan: Plan }) {
  const t = THEME[plan];
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-3 flex gap-1.5">
        {["Students", "Classes", "Assignments"].map((tab, i) => (
          <div key={tab} className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${i === 0 ? `text-white border` : "text-white/50 bg-white/[0.03]"}`}
            style={i === 0 ? { borderColor: `${t.hex}50`, backgroundColor: `${t.hex}15`, color: t.hex } : {}}>
            {tab}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Students", value: "0" },
          { label: "Assignments", value: "0" },
          { label: "Avg Score", value: "—" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white/[0.04] px-3 py-2.5 text-center">
            <div className="text-lg font-black text-white">{s.value}</div>
            <div className="mt-0.5 text-[10px] text-white/50">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IllustrationInvite({ plan, studentLimit }: { plan: Plan; studentLimit: number }) {
  const t = THEME[plan];
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
        <svg className="h-4 w-4 shrink-0 text-white/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <span className="flex-1 text-xs text-white/50">student@school.com</span>
        <div className="rounded-lg px-2.5 py-1 text-[10px] font-black" style={{ backgroundColor: `${t.hex}20`, color: t.hex }}>Send Invite</div>
      </div>
      <div className="space-y-1.5">
        {[
          { email: "maria@school.com", status: "active", score: "84%" },
          { email: "john@school.com",  status: "pending", score: null },
        ].map((s) => (
          <div key={s.email} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-black text-white">{s.email[0].toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-xs font-semibold text-white/70">{s.email}</div>
              <div className={`text-[10px] ${s.status === "active" ? "text-emerald-400" : "text-white/50"}`}>{s.status}</div>
            </div>
            {s.score && <div className="text-xs font-black" style={{ color: t.hex }}>{s.score}</div>}
          </div>
        ))}
      </div>
      <div className="text-center text-[10px] text-white/45">Up to <span className="font-black text-white/50">{studentLimit}</span> students on your plan</div>
    </div>
  );
}

function IllustrationClasses({ plan }: { plan: Plan }) {
  const t = THEME[plan];
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        {[
          { emoji: "📚", name: "Morning Group", count: 6 },
          { emoji: "🌙", name: "Evening Group", count: 4 },
        ].map((c) => (
          <div key={c.name} className="rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3">
            <div className="text-xl">{c.emoji}</div>
            <div className="mt-1.5 text-xs font-black text-white">{c.name}</div>
            <div className="mt-0.5 text-[10px] text-white/50">{c.count} students</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-2.5 text-center text-xs text-white/45">
        + Create new class
      </div>
      <div className="text-center text-[10px] text-white/45">Assign work to a whole class at once</div>
    </div>
  );
}

function IllustrationAssignment({ plan }: { plan: Plan }) {
  const t = THEME[plan];
  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-black text-sky-400">Grammar</span>
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/55">B1</span>
            </div>
            <div className="text-xs font-black text-white">Present Perfect — Mix</div>
            <div className="mt-1 text-[10px] text-white/50">Due: Apr 15 · <span className="text-amber-400">8 days left</span></div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-white/55">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          Everyone
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-2.5 text-center text-xs text-white/45">
        + New assignment
      </div>
    </div>
  );
}

function IllustrationAnalytics({ plan }: { plan: Plan }) {
  const t = THEME[plan];
  const students = [
    { name: "Maria K.", pct: 84, color: "bg-emerald-500" },
    { name: "John D.",  pct: 53, color: "bg-amber-400" },
    { name: "Ana R.",   pct: 97, color: "bg-emerald-500" },
  ];
  return (
    <div className="space-y-2">
      {students.map((s) => (
        <div key={s.name} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-black text-white">{s.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-white/70">{s.name}</span>
              <span className="text-xs font-black text-white/80">{s.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/8">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
            </div>
          </div>
          <svg className="h-3.5 w-3.5 shrink-0 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      ))}
      <div className="text-center text-[10px] text-white/45">Click any student to see question-by-question breakdown</div>
    </div>
  );
}

function IllustrationReady({ plan }: { plan: Plan }) {
  const t = THEME[plan];
  const items = [
    "Invite your first student",
    "Create your first assignment",
    "Review student results",
  ];
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={item} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: `${t.hex}50` }}>
            <span className="text-xs font-black" style={{ color: t.hex }}>{i + 1}</span>
          </div>
          <span className="text-sm text-white/60">{item}</span>
        </div>
      ))}
    </div>
  );
}

// ── Step data ─────────────────────────────────────────────────────────────────

type StepData = {
  id: string;
  emoji: string;
  title: string;
  subtitle: (plan: Plan) => string;
  desc: (plan: Plan, limit: number) => string;
  tip: string;
  illustration: (plan: Plan, limit: number) => React.ReactNode;
  plansOnly?: Plan[];
};

const ALL_STEPS: StepData[] = [
  {
    id: "dashboard",
    emoji: "🏫",
    title: "Your Teacher Dashboard",
    subtitle: () => "Everything in one place",
    desc: () => "Your dashboard has three main sections: Students, Classes, and Assignments. This is your command center — invite students, assign exercises, and track results.",
    tip: "The dashboard is also available in your Account page under the Teacher tab.",
    illustration: (plan) => <IllustrationDashboard plan={plan} />,
  },
  {
    id: "invite",
    emoji: "👥",
    title: "Invite Your Students",
    subtitle: (plan) => `Up to ${THEME[plan] ? { starter: 5, solo: 15, plus: 40 }[plan] : "?"} students on your plan`,
    desc: (plan, limit) => `Enter a student's email address and they'll receive a unique invite link. Once they join, they appear as Active and you can start tracking their progress. You can have up to ${limit} students.`,
    tip: "Students don't need to create an account first — they can do it when they open the invite link.",
    illustration: (plan, limit) => <IllustrationInvite plan={plan} studentLimit={limit} />,
  },
  {
    id: "classes",
    emoji: "📚",
    title: "Organize into Classes",
    subtitle: () => "Group students for easier management",
    desc: () => "Create classes to group students by level, time slot, or any other way you like. When you create an assignment you can target an entire class at once — no need to select students one by one.",
    tip: "A student can be in multiple classes at the same time.",
    illustration: (plan) => <IllustrationClasses plan={plan} />,
    plansOnly: ["solo", "plus"],
  },
  {
    id: "assignments",
    emoji: "📋",
    title: "Assign Grammar Exercises",
    subtitle: () => "With deadlines and targets",
    desc: () => "Pick any grammar lesson, vocabulary topic, or test from the site and assign it. Set a due date, choose who gets it (everyone, a class, or specific students), and students will see it in their account.",
    tip: "You can also assign essay prompts and custom homework with a link or instructions.",
    illustration: (plan) => <IllustrationAssignment plan={plan} />,
  },
  {
    id: "analytics",
    emoji: "📊",
    title: "Track Student Progress",
    subtitle: () => "Know exactly where students struggle",
    desc: () => "See each student's completion count, average score, and last activity at a glance. Click any student to dive into a question-by-question breakdown — so you know exactly which grammar rules to review in class.",
    tip: "Scores are color-coded: green (≥80%), amber (≥50%), and red (<50%) for quick scanning.",
    illustration: (plan) => <IllustrationAnalytics plan={plan} />,
  },
  {
    id: "ready",
    emoji: "🚀",
    title: "You're All Set!",
    subtitle: (plan) => `Teacher ${THEME[plan].label} is active`,
    desc: () => "Your Teacher Dashboard is ready to go. Here are the three first steps to get the most out of it right away:",
    tip: "Need help? Reach out anytime at hello@englishnerd.cc",
    illustration: (plan) => <IllustrationReady plan={plan} />,
  },
];

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  plan: Plan;
  studentLimit: number;
  userEmail: string;
  onDone: () => void;
}

export default function TeacherOnboarding({ plan, studentLimit, userEmail, onDone }: Props) {
  const t = THEME[plan];
  const steps = ALL_STEPS.filter((s) => !s.plansOnly || s.plansOnly.includes(plan));
  const total = steps.length;

  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<"forward" | "backward">("forward");
  const [animKey, setAnimKey] = useState(0);

  const step = steps[current];

  function goTo(idx: number) {
    if (idx === current) return;
    setDir(idx > current ? "forward" : "backward");
    setAnimKey((k) => k + 1);
    setCurrent(idx);
  }

  function next() {
    if (current < total - 1) goTo(current + 1);
    else finish();
  }

  function back() {
    if (current > 0) goTo(current - 1);
  }

  function finish() {
    localStorage.setItem(`teacher_onboarding_done_${userEmail}`, "1");
    onDone();
  }

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "Enter") next();
    else if (e.key === "ArrowLeft") back();
    else if (e.key === "Escape") finish();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (typeof document === "undefined") return null;

  const isLast = current === total - 1;

  return createPortal(
    <div className="fixed inset-0 z-[9990] overflow-y-auto">
      <style>{`
        @keyframes ob-slide-fwd {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes ob-slide-bwd {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ob-enter-fwd { animation: ob-slide-fwd 0.3s cubic-bezier(.22,1,.36,1) both; }
        .ob-enter-bwd { animation: ob-slide-bwd 0.3s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Card wrapper */}
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-[480px] overflow-hidden rounded-3xl border border-white/10 bg-[#141416] shadow-2xl">

          {/* Progress bar */}
          <div className="h-1 w-full bg-white/6">
            <div
              className={`h-full transition-all duration-500 ease-out ${t.bar}`}
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-0">
            <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black ${t.badge}`}>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
              Teacher {t.label}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/45">{current + 1} / {total}</span>
              <button
                onClick={finish}
                className="rounded-full p-1.5 text-white/45 transition hover:bg-white/8 hover:text-white/60"
                aria-label="Skip onboarding"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Step content — animated */}
          <div
            key={animKey}
            className={dir === "forward" ? "ob-enter-fwd" : "ob-enter-bwd"}
          >
            {/* Emoji + title */}
            <div className="px-6 pt-5 pb-4">
              <div className="mb-3 text-4xl">{step.emoji}</div>
              <h2 className="text-xl font-black text-white">{step.title}</h2>
              <p className={`mt-0.5 text-sm font-semibold ${t.badgeText}`}>
                {step.subtitle(plan)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                {step.desc(plan, studentLimit)}
              </p>
            </div>

            {/* Illustration */}
            <div className="px-6">
              {step.illustration(plan, studentLimit)}
            </div>

            {/* Tip */}
            <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-xl bg-white/[0.04] px-4 py-3">
              <span className="mt-0.5 text-base leading-none">💡</span>
              <p className="text-xs leading-relaxed text-white/55">{step.tip}</p>
            </div>
          </div>

          {/* Step dots */}
          <div className="mt-5 flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  backgroundColor: i === current ? t.hex : "rgba(255,255,255,0.15)",
                }}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 px-6 pb-6 pt-4">
            <button
              onClick={back}
              disabled={current === 0}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/50 transition hover:text-white/60 disabled:opacity-0"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>

            <button
              onClick={isLast ? finish : next}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-black text-black shadow-lg transition hover:opacity-90"
              style={{ backgroundColor: t.hex, boxShadow: `0 4px 20px ${t.hex}35` }}
            >
              {isLast ? (
                <>Open Teacher Dashboard →</>
              ) : (
                <>
                  Next
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </>
              )}
            </button>
          </div>

          {/* Keyboard hint */}
          <div className="pb-4 text-center text-[10px] text-white/15">
            ← → arrow keys to navigate · Esc to skip
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
