"use client";

import { useEffect, useState } from "react";
import type { TopicRec } from "@/lib/getRecommendations";

// ── Placeholder data for blur preview ────────────────────────────────────────

const PLACEHOLDER_ACTIVITY = [
  { category: "grammar", level: "b1", slug: "second-conditional",  score: 85, completed_at: new Date(Date.now() - 3_600_000).toISOString() },
  { category: "tenses",  level: null, slug: "present-perfect",     score: 72, completed_at: new Date(Date.now() - 86_400_000).toISOString() },
  { category: "vocabulary", level: "a2", slug: "clothes-and-shopping", score: 91, completed_at: new Date(Date.now() - 172_800_000).toISOString() },
  { category: "grammar", level: "a1", slug: "to-be-am-is-are",     score: 100, completed_at: new Date(Date.now() - 259_200_000).toISOString() },
];

// ── Pro gate overlay ──────────────────────────────────────────────────────────

function ProGate({ children, isPro }: { children: React.ReactNode; isPro: boolean }) {
  if (isPro) return <>{children}</>;
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[6px] saturate-50 opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[2px]">
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5DA20] shadow-md">
            <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">Pro feature</p>
            <p className="mt-0.5 text-xs text-slate-500">Detailed stats are available for Pro subscribers</p>
          </div>
          <a
            href="/pro"
            className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-[#F5DA20] px-4 py-2 text-xs font-black text-black shadow-sm transition hover:bg-[#e8cf00]"
          >
            Upgrade to Pro
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type WeakTopic = {
  category: string;
  level: string | null;
  slug: string;
  bestScore: number;
  href: string;
};

export type DashboardTabProps = {
  streak: number;
  totalCompleted: number;
  avgScore: number;
  topicsMastered: number;
  overallPct: number;
  currentLevel: string | null;
  byLevel: Record<string, { completed: number; avgScore: number; pct: number }>;
  weekly: { day: string; label: string; count: number }[];
  maxWeekly: number;
  recentActivity: Array<{
    category: string;
    level: string | null;
    slug: string;
    score: number;
    completed_at: string;
  }>;
  isPro: boolean;
  recs: TopicRec[];
  freezeCount: number;
  canUseFreeze: boolean;
  weakTopics: WeakTopic[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugToTitle(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const LEVEL_CONFIG: Record<string, { color: string; bar: string; label: string }> = {
  a1: { color: "text-emerald-600", bar: "bg-emerald-500", label: "Beginner" },
  a2: { color: "text-sky-600",     bar: "bg-sky-500",     label: "Elementary" },
  b1: { color: "text-violet-600",  bar: "bg-violet-500",  label: "Intermediate" },
  b2: { color: "text-amber-600",   bar: "bg-amber-500",   label: "Upper-Int." },
  c1: { color: "text-rose-600",    bar: "bg-rose-500",    label: "Advanced" },
};

const CAT_ICON: Record<string, string> = {
  grammar: "G", tenses: "T", vocabulary: "V",
  reading: "R", listening: "L", test: "★",
};

const CAT_COLOR: Record<string, string> = {
  grammar:    "bg-violet-100 text-violet-700 border-violet-200",
  tenses:     "bg-sky-100 text-sky-700 border-sky-200",
  vocabulary: "bg-emerald-100 text-emerald-700 border-emerald-200",
  reading:    "bg-amber-100 text-amber-700 border-amber-200",
  listening:  "bg-pink-100 text-pink-700 border-pink-200",
  test:       "bg-[#F5DA20]/20 text-amber-700 border-amber-200",
};

// ── Streak milestones ─────────────────────────────────────────────────────────

const MILESTONES = [10, 30, 50, 100, 365];

function getNextMilestone(streak: number) {
  return MILESTONES.find((m) => m > streak) ?? null;
}

function getStreakTier(streak: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (streak === 0) return 0;
  if (streak < 10) return 1;
  if (streak < 30) return 2;
  if (streak < 50) return 3;
  if (streak < 100) return 4;
  return 5;
}

const TIER_CONFIG = [
  { label: "",           bg: "from-slate-50 to-slate-100",    border: "border-slate-200",   numColor: "text-slate-400",   shadow: "" },
  { label: "Building",   bg: "from-orange-50 to-amber-50",    border: "border-orange-200",  numColor: "text-orange-600",  shadow: "shadow-[0_4px_24px_rgba(251,146,60,0.15)]" },
  { label: "Hot Streak", bg: "from-orange-50 to-red-50",      border: "border-orange-300",  numColor: "text-orange-700",  shadow: "shadow-[0_4px_32px_rgba(251,146,60,0.25)]" },
  { label: "On Fire!",   bg: "from-red-50 to-orange-50",      border: "border-red-300",     numColor: "text-red-600",     shadow: "shadow-[0_4px_40px_rgba(239,68,68,0.3)]" },
  { label: "Epic!",      bg: "from-amber-50 to-yellow-50",    border: "border-amber-400",   numColor: "text-amber-700",   shadow: "shadow-[0_4px_48px_rgba(245,218,32,0.4)]" },
  { label: "Legendary!", bg: "from-yellow-50 via-amber-50 to-orange-50", border: "border-yellow-500", numColor: "text-amber-800", shadow: "shadow-[0_4px_60px_rgba(245,218,32,0.55)]" },
];

// ── Flame SVG ─────────────────────────────────────────────────────────────────

function FlameSVG({ tier }: { tier: 0 | 1 | 2 | 3 | 4 | 5 }) {
  if (tier === 0) {
    return (
      <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
        {/* Ice crystal / snowflake */}
        <line x1="20" y1="4" x2="20" y2="44" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
        <line x1="4" y1="24" x2="36" y2="24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="7" x2="33" y2="41" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
        <line x1="33" y1="7" x2="7" y2="41" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
        {/* Sparkle dots */}
        <circle cx="20" cy="4" r="2.5" fill="#CBD5E1"/>
        <circle cx="20" cy="44" r="2.5" fill="#CBD5E1"/>
        <circle cx="4" cy="24" r="2.5" fill="#CBD5E1"/>
        <circle cx="36" cy="24" r="2.5" fill="#CBD5E1"/>
        <circle cx="7" cy="7" r="2" fill="#E2E8F0"/>
        <circle cx="33" cy="7" r="2" fill="#E2E8F0"/>
        <circle cx="7" cy="41" r="2" fill="#E2E8F0"/>
        <circle cx="33" cy="41" r="2" fill="#E2E8F0"/>
        <circle cx="20" cy="24" r="4" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1"/>
      </svg>
    );
  }

  // Flame parameters by tier
  const configs: Record<number, {
    outerTop: string; outerBot: string;
    innerTop: string; innerBot: string;
    coreTop: string;  coreBot: string;
    h: number;
  }> = {
    1: { outerTop: "#FDE68A", outerBot: "#F97316", innerTop: "#FEF3C7", innerBot: "#FB923C", coreTop: "#FFFFFF", coreBot: "#FDE68A", h: 44 },
    2: { outerTop: "#FCD34D", outerBot: "#DC2626", innerTop: "#FDE68A", innerBot: "#F97316", coreTop: "#FFFFFF", coreBot: "#FCD34D", h: 54 },
    3: { outerTop: "#FBBF24", outerBot: "#B91C1C", innerTop: "#FCD34D", innerBot: "#EF4444", coreTop: "#FFFFFF", coreBot: "#FEF08A", h: 64 },
    4: { outerTop: "#F5DA20", outerBot: "#EA580C", innerTop: "#FEF08A", innerBot: "#F5DA20", coreTop: "#FFFFFF", coreBot: "#FEF9C3", h: 76 },
    5: { outerTop: "#FFFBEB", outerBot: "#F5DA20", innerTop: "#FEFCE8", innerBot: "#FDE68A", coreTop: "#FFFFFF", coreBot: "#FFFFFF", h: 90 },
  };

  const c = configs[tier];
  const id = `flm${tier}`;
  const w = Math.round(c.h * 0.6);

  return (
    <svg width={w} height={c.h} viewBox="0 0 40 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glow base */}
      {tier >= 3 && (
        <ellipse cx="20" cy="64" rx={16 + tier * 2} ry="6" fill={c.outerBot} opacity="0.25"/>
      )}
      {/* Outer flame body */}
      <path
        d="M20 65 C11 56 4 47 7 34 C10 22 16 17 18 8 C19 4 19.5 1.5 20 0 C20.5 1.5 21 4 22 8 C24 17 30 22 33 34 C36 47 29 56 20 65Z"
        fill={`url(#${id}a)`}
        opacity="0.95"
      />
      {/* Inner flame */}
      <path
        d="M20 57 C14 49 12 41 14 32 C16 24 18 20 20 14 C22 20 24 24 26 32 C28 41 26 49 20 57Z"
        fill={`url(#${id}b)`}
      />
      {/* Hot core */}
      <path
        d="M20 49 C17 43 17 36 18 30 C19 25 20 22 20 19 C20 22 21 25 22 30 C23 36 23 43 20 49Z"
        fill={`url(#${id}c)`}
      />
      {/* Extra inner glow for high tiers */}
      {tier >= 4 && (
        <path
          d="M20 42 C18.5 38 18.5 34 19 30 C19.5 27 20 25 20 23 C20 25 20.5 27 21 30 C21.5 34 21.5 38 20 42Z"
          fill="white"
          opacity="0.6"
        />
      )}
      <defs>
        <linearGradient id={`${id}a`} x1="20" y1="0" x2="20" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.outerTop} stopOpacity="0.35"/>
          <stop offset="35%" stopColor={c.outerTop}/>
          <stop offset="100%" stopColor={c.outerBot}/>
        </linearGradient>
        <linearGradient id={`${id}b`} x1="20" y1="14" x2="20" y2="57" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.innerTop}/>
          <stop offset="80%" stopColor={c.innerBot}/>
        </linearGradient>
        <linearGradient id={`${id}c`} x1="20" y1="19" x2="20" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c.coreTop}/>
          <stop offset="65%" stopColor={c.coreBot}/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}{suffix}</>;
}

// ── Progress ring ─────────────────────────────────────────────────────────────

function Ring({ pct, size = 80, stroke = 7 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ * (1 - pct / 100)), 100);
    return () => clearTimeout(t);
  }, [pct, circ]);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#F5DA20" strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ pct, barClass }: { pct: number; barClass: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div
      className={`absolute left-0 top-0 h-full rounded-full ${barClass} transition-all duration-1000 ease-out`}
      style={{ width: `${width}%` }}
    />
  );
}

// ── Week bar ──────────────────────────────────────────────────────────────────

function WeekBar({ heightPct, isToday, hasActivity }: { heightPct: number; isToday: boolean; hasActivity: boolean }) {
  const [h, setH] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setH(heightPct), 150);
    return () => clearTimeout(t);
  }, [heightPct]);
  return (
    <div
      className={`w-full rounded-t-lg transition-all duration-700 ease-out ${
        hasActivity
          ? isToday ? "bg-[#F5DA20] shadow-[0_2px_12px_rgba(245,218,32,0.5)]" : "bg-slate-200"
          : "bg-slate-100"
      }`}
      style={{ height: `${Math.max(h, hasActivity ? 8 : 3)}%` }}
    />
  );
}

// ── Streak card ───────────────────────────────────────────────────────────────

function StreakCard({
  streak, isPro, freezeCount, canUseFreeze,
}: {
  streak: number; isPro: boolean; freezeCount: number; canUseFreeze: boolean;
}) {
  const tier = getStreakTier(streak);
  const cfg = TIER_CONFIG[tier];
  const nextMilestone = getNextMilestone(streak);
  const prevMilestone = MILESTONES.slice().reverse().find((m) => m <= streak) ?? 0;
  const milestoneProgress = nextMilestone
    ? Math.round(((streak - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
    : 100;
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [freezeUsed, setFreezeUsed] = useState(false);
  const [localFreezeCount, setLocalFreezeCount] = useState(freezeCount);
  const animClass = tier >= 2
    ? "animate-[flameWave_2s_ease-in-out_infinite]"
    : tier === 1 ? "animate-[flameSway_3s_ease-in-out_infinite]" : "";

  async function handleUseFreeze() {
    setFreezeLoading(true);
    try {
      const res = await fetch("/api/streak/freeze", { method: "POST" });
      if (res.ok) {
        setFreezeUsed(true);
        setLocalFreezeCount((n) => Math.max(0, n - 1));
        // Reload to recalculate streak with the new freeze date
        setTimeout(() => window.location.reload(), 800);
      }
    } finally {
      setFreezeLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes flameWave {
          0%, 100% { transform: scaleX(1) scaleY(1) rotate(-0.5deg); }
          25% { transform: scaleX(0.96) scaleY(1.03) rotate(0.8deg); }
          50% { transform: scaleX(1.03) scaleY(0.97) rotate(-0.8deg); }
          75% { transform: scaleX(0.98) scaleY(1.02) rotate(0.4deg); }
        }
        @keyframes flameSway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes legendaryGlow {
          0%, 100% { box-shadow: 0 4px 60px rgba(245,218,32,0.45), 0 0 0 1px rgba(245,218,32,0.3); }
          50% { box-shadow: 0 4px 80px rgba(245,218,32,0.7), 0 0 0 1px rgba(245,218,32,0.5); }
        }
      `}</style>

      <div
        className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${cfg.bg} ${cfg.border} p-5 sm:p-6 ${cfg.shadow}`}
        style={tier === 5 ? { animation: "legendaryGlow 2s ease-in-out infinite" } : undefined}
      >
        {/* Legendary shimmer overlay */}
        {tier === 5 && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-yellow-200/20 via-transparent to-amber-200/20" />
        )}

        <div className="flex items-start gap-5">
          {/* Flame */}
          <div className={`shrink-0 origin-bottom ${animClass}`}>
            <FlameSVG tier={tier} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Streak</span>
              {tier > 0 && (
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                  tier === 5 ? "bg-amber-400 text-black" :
                  tier === 4 ? "bg-[#F5DA20] text-black" :
                  tier === 3 ? "bg-red-500 text-white" :
                  tier === 2 ? "bg-orange-500 text-white" :
                  "bg-orange-200 text-orange-800"
                }`}>
                  {cfg.label}
                </span>
              )}
            </div>

            <div className={`mt-1 flex items-end gap-2 leading-none`}>
              <span className={`text-5xl font-black ${cfg.numColor}`}>
                <AnimatedNumber value={streak} />
              </span>
              <span className="mb-1.5 text-sm text-slate-400">days</span>
            </div>

            {/* Milestone progress */}
            {streak > 0 && nextMilestone && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>{streak} / {nextMilestone} days</span>
                  <span>Next: {nextMilestone}-day badge</span>
                </div>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-black/8">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                      tier >= 4 ? "bg-[#F5DA20]" : tier >= 3 ? "bg-red-500" : "bg-orange-400"
                    }`}
                    style={{ width: `${milestoneProgress}%` }}
                  />
                </div>
              </div>
            )}

            {streak === 0 && (
              <div className="mt-2 text-xs text-slate-400">Complete an exercise today to start your streak!</div>
            )}

            {/* Streak milestones achieved */}
            {streak >= 10 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {MILESTONES.filter((m) => m <= streak).map((m) => (
                  <span key={m} className="rounded-full bg-black/6 px-2 py-0.5 text-[10px] font-black text-slate-500">
                    🏅 {m}d
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Streak Freeze — show when streak is active OR when PRO can restore a lost streak */}
        {(streak > 0 || canUseFreeze || isPro) && (
          <div className={`mt-4 flex items-center justify-between rounded-xl border border-dashed px-4 py-3 ${canUseFreeze && !freezeUsed ? "border-amber-300 bg-amber-50/60" : "border-sky-200 bg-sky-50/60"}`}>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{canUseFreeze && !freezeUsed ? "🔥" : "🛡️"}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-black ${canUseFreeze && !freezeUsed ? "text-amber-700" : "text-sky-700"}`}>
                    {canUseFreeze && !freezeUsed ? "Streak at risk!" : "Streak Freeze"}
                  </span>
                  {!isPro && (
                    <span className="rounded-full bg-[#F5DA20]/30 px-1.5 py-0.5 text-[9px] font-black text-amber-700">
                      Pro feature
                    </span>
                  )}
                </div>
                <div className={`text-[10px] ${canUseFreeze && !freezeUsed ? "text-amber-600" : "text-sky-500"}`}>
                  {!isPro
                    ? "Protect your streak when you miss a day"
                    : canUseFreeze && !freezeUsed
                      ? `You missed yesterday — use a freeze to restore your streak`
                      : localFreezeCount > 0
                        ? `${localFreezeCount} of 7 available this month`
                        : "Used up this month"}
                </div>
              </div>
            </div>
            {!isPro ? (
              <a
                href="/pro"
                className="rounded-xl bg-[#F5DA20] px-3.5 py-2 text-xs font-black text-black transition hover:bg-[#e8cf00]"
              >
                Upgrade
              </a>
            ) : canUseFreeze && !freezeUsed && localFreezeCount > 0 ? (
              <button
                onClick={handleUseFreeze}
                disabled={freezeLoading}
                className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-black text-white transition hover:bg-amber-600 disabled:opacity-50"
              >
                {freezeLoading ? "…" : "Restore"}
              </button>
            ) : freezeUsed ? (
              <span className="rounded-xl bg-sky-100 border border-sky-200 px-3 py-1.5 text-[10px] font-black text-sky-600">
                ✓ Protected
              </span>
            ) : (
              <span className="text-[10px] text-sky-400">
                {localFreezeCount === 0 ? "Resets next month" : "No missed days"}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const LS_KEY = "eng_dismissed_weak";

export default function DashboardTab({
  streak, totalCompleted, avgScore,
  overallPct, currentLevel, byLevel,
  weekly, maxWeekly, recentActivity, isPro,
  freezeCount, canUseFreeze, weakTopics,
}: DashboardTabProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
      setDismissed(new Set(saved));
    } catch { /* ignore */ }
  }, []);

  function dismissTopic(key: string) {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(key);
      try { localStorage.setItem(LS_KEY, JSON.stringify(Array.from(next))); } catch { /* ignore */ }
      return next;
    });
  }

  function restoreAll() {
    setDismissed(new Set());
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  }

  const visibleWeak = weakTopics.filter((t) => !dismissed.has(`${t.category}:${t.level ?? ""}:${t.slug}`));
  const hiddenCount = weakTopics.length - visibleWeak.length;

  return (
    <div className="space-y-4">

      {/* ── Featured streak card ─────────────────────────────────────────── */}
      <StreakCard
        streak={streak}
        isPro={isPro}
        freezeCount={freezeCount}
        canUseFreeze={canUseFreeze}
      />

      {/* ── Other stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">

        <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-white p-5 shadow-sm ring-1 ring-black/[0.03]">
          <div className="absolute -right-2 -top-2 text-5xl opacity-[0.07] select-none">📚</div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-sky-500">Completed</div>
          <div className="mt-2 text-4xl font-black text-slate-900 leading-none">
            <AnimatedNumber value={totalCompleted} />
          </div>
          <div className="mt-1 text-xs text-slate-400">exercises done</div>
          <div className="mt-3 h-1 w-full rounded-full bg-slate-100">
            <div className="h-1 rounded-full bg-sky-400 transition-all duration-700" style={{ width: `${Math.min(overallPct, 100)}%` }} />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm ring-1 ring-black/[0.03]">
          <div className="absolute -right-2 -top-2 text-5xl opacity-[0.07] select-none">🎯</div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Avg. Score</div>
          <div className="mt-2 text-4xl font-black text-slate-900 leading-none">
            <AnimatedNumber value={avgScore} suffix="%" />
          </div>
          <div className="mt-1 text-xs text-slate-400">across all exercises</div>
          <div className="mt-3 h-1 w-full rounded-full bg-slate-100">
            <div className="h-1 rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${avgScore}%` }} />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-rose-100 bg-white p-5 shadow-sm ring-1 ring-black/[0.03]">
          <div className="absolute -right-2 -top-2 text-5xl opacity-[0.07] select-none">🎯</div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-rose-500">To Improve</div>
          <div className="mt-2 text-4xl font-black text-slate-900 leading-none">
            <AnimatedNumber value={visibleWeak.length} />
          </div>
          <div className="mt-1 text-xs text-slate-400">topics &lt; 70%</div>
          <div className="mt-3 h-1 w-full rounded-full bg-slate-100">
            <div className="h-1 rounded-full bg-rose-400 transition-all duration-700"
              style={{ width: visibleWeak.length > 0 ? "100%" : "0%" }} />
          </div>
        </div>

      </div>

      {/* ── Weak Topics panel ─────────────────────────────────────────────── */}
      {(visibleWeak.length > 0 || hiddenCount > 0) && (
        <div className="rounded-2xl border border-rose-100 bg-white shadow-sm ring-1 ring-black/[0.03] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-rose-50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50">
                <svg className="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Areas to Strengthen</p>
                <p className="text-[11px] text-slate-400">{visibleWeak.length} topic{visibleWeak.length !== 1 ? "s" : ""} below 70% — practice to improve</p>
              </div>
            </div>
            {hiddenCount > 0 && (
              <button onClick={restoreAll} className="text-[11px] font-semibold text-slate-400 hover:text-violet-600 transition shrink-0">
                {hiddenCount} hidden · Restore
              </button>
            )}
          </div>

          {visibleWeak.length > 0 && (
            <div className="divide-y divide-slate-50">
              {visibleWeak.map((t) => {
                const key = `${t.category}:${t.level ?? ""}:${t.slug}`;
                const catColor: Record<string, string> = {
                  grammar: "bg-violet-500",
                  tenses: "bg-sky-500",
                  vocabulary: "bg-amber-500",
                  reading: "bg-emerald-500",
                  listening: "bg-pink-500",
                };
                const scoreColor = t.bestScore < 40 ? "text-rose-600 bg-rose-50 border-rose-200"
                  : t.bestScore < 60 ? "text-amber-600 bg-amber-50 border-amber-200"
                  : "text-orange-600 bg-orange-50 border-orange-200";

                return (
                  <div key={key} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors group">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${catColor[t.category] ?? "bg-slate-400"}`} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{slugToTitle(t.slug)}</p>
                        <p className="text-[11px] text-slate-400">
                          {t.category}{t.level ? ` · ${t.level.toUpperCase()}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded-lg border px-2.5 py-0.5 text-xs font-black ${scoreColor}`}>
                        {t.bestScore}%
                      </span>
                      <a
                        href={t.href}
                        className="flex items-center gap-1 rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rose-600 shadow-sm"
                      >
                        Practice
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </a>
                      <button
                        onClick={() => dismissTopic(key)}
                        title="Hide this topic"
                        className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-rose-50 px-5 py-3 bg-rose-50/40">
            <p className="text-[11px] text-rose-400 font-semibold">
              Tip: aim for 80%+ to master a topic. Regular practice on weak areas builds fluency fast.
            </p>
          </div>
        </div>
      )}

      {/* ── Level progress + weekly chart ────────────────────────────────── */}
      <ProGate isPro={isPro}>
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">

        {/* Level progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/[0.03]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-slate-900">Level Progress</h2>
            <span className="text-xs text-slate-400">{totalCompleted} / 384 exercises</span>
          </div>

          <div className="space-y-4">
            {(["a1", "a2", "b1", "b2", "c1"] as const).map((lvl) => {
              const data = byLevel[lvl] ?? { completed: 0, avgScore: 0, pct: 0 };
              const cfg = LEVEL_CONFIG[lvl];
              return (
                <div key={lvl}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-sm font-black ${cfg.color}`}>{lvl.toUpperCase()}</span>
                      <span className="text-xs text-slate-400">{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {data.avgScore > 0 && (
                        <span className="text-xs text-slate-300">avg {data.avgScore}%</span>
                      )}
                      <span className={`text-sm font-bold ${cfg.color}`}>{data.pct}%</span>
                    </div>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <ProgressBar pct={data.pct} barClass={cfg.bar} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall ring */}
          <div className="mt-6 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <Ring pct={overallPct} size={80} stroke={7} />
              <span className="absolute text-sm font-black text-slate-900">{overallPct}%</span>
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">Overall Completion</div>
              <div className="mt-0.5 text-xs text-slate-400">
                {totalCompleted} of 384 total exercises
              </div>
              {overallPct >= 80 ? (
                <div className="mt-2 text-xs font-bold text-amber-600">Outstanding progress! 🏆</div>
              ) : overallPct >= 50 ? (
                <div className="mt-2 text-xs font-bold text-emerald-600">Great progress! Keep it up 💪</div>
              ) : overallPct >= 20 ? (
                <div className="mt-2 text-xs font-bold text-sky-600">Building momentum! 🚀</div>
              ) : (
                <div className="mt-2 text-xs font-bold text-slate-400">Every exercise counts — let&apos;s go! ✨</div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/[0.03]">
          <h2 className="text-base font-black text-slate-900 mb-1">This Week</h2>
          <p className="text-xs text-slate-400 mb-5">Exercises completed per day</p>

          <div className="flex items-end justify-between gap-1.5 h-28">
            {weekly.map((w) => {
              const isToday = w.day === new Date().toISOString().slice(0, 10);
              const heightPct = maxWeekly > 0 ? (w.count / maxWeekly) * 100 : 0;
              return (
                <div key={w.day} className="flex flex-1 flex-col items-center gap-1.5">
                  {w.count > 0 && (
                    <span className="text-[9px] font-bold text-slate-400">{w.count}</span>
                  )}
                  <div className="relative flex w-full items-end justify-center" style={{ height: "80px" }}>
                    <WeekBar heightPct={heightPct} isToday={isToday} hasActivity={w.count > 0} />
                  </div>
                  <span className={`text-[10px] font-semibold ${isToday ? "text-[#b8a200]" : "text-slate-300"}`}>
                    {w.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">This week</span>
              <span className="font-bold text-slate-700">{weekly.reduce((s, w) => s + w.count, 0)} exercises</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Best day</span>
              <span className="font-bold text-slate-700">{Math.max(...weekly.map((w) => w.count), 0)} exercises</span>
            </div>
          </div>
        </div>

      </div>
      </ProGate>

      {/* ── Current level ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-black/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Current Level</div>
            {currentLevel ? (
              <div className="mt-1 text-3xl font-black text-slate-900">{currentLevel}</div>
            ) : (
              <div className="mt-1 text-sm text-slate-400">Take the grammar test to find your level</div>
            )}
          </div>
          {currentLevel ? (
            <a
              href="/tests/grammar"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
            >
              Retake test →
            </a>
          ) : (
            <a
              href="/tests/grammar"
              className="rounded-xl bg-[#F5DA20] px-4 py-2 text-xs font-black text-black transition hover:bg-[#e8cf00]"
            >
              Take the test →
            </a>
          )}
        </div>
      </div>

      {/* ── Recent activity ──────────────────────────────────────────────── */}
      <ProGate isPro={isPro}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/[0.03]">
          <h2 className="text-base font-black text-slate-900 mb-4">Recent Activity</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {(recentActivity.length > 0 ? recentActivity : PLACEHOLDER_ACTIVITY).map((r, i) => {
              const catColor = CAT_COLOR[r.category] ?? "bg-slate-100 text-slate-500 border-slate-200";
              const catIcon = CAT_ICON[r.category] ?? "·";
              const scoreColor = r.score >= 80 ? "text-emerald-600" : r.score >= 60 ? "text-amber-600" : "text-rose-500";
              const lvlCfg = r.level ? LEVEL_CONFIG[r.level] : null;
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${catColor}`}>
                    {catIcon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {r.level && lvlCfg && (
                        <span className={`text-[10px] font-black ${lvlCfg.color}`}>{r.level.toUpperCase()}</span>
                      )}
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs capitalize text-slate-400">{r.category}</span>
                    </div>
                    <div className="truncate text-sm font-semibold text-slate-800">
                      {slugToTitle(r.slug)}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className={`text-sm font-black ${scoreColor}`}>{r.score}%</div>
                    <div className="text-[10px] text-slate-300">{timeAgo(r.completed_at)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ProGate>

      {/* ── Quick links ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Grammar",     href: "/grammar/a1" },
          { label: "Vocabulary",  href: "/vocabulary" },
          { label: "Nerd Zone",   href: "/nerd-zone" },
          { label: "Take a Test", href: "/tests" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            {link.label}
            <svg className="h-3.5 w-3.5 shrink-0 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </a>
        ))}
      </div>

    </div>
  );
}
