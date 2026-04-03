"use client";

import { useEffect, useState } from "react";
import type { TopicRec } from "@/lib/getRecommendations";
import AdUnit from "@/components/AdUnit";

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  firstName: string;
  email: string;
  greeting: string;
  isPro: boolean;
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
  recs: TopicRec[];
  createdAt: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

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

const LEVEL_CONFIG: Record<string, { color: string; bar: string; text: string; label: string }> = {
  a1: { color: "text-emerald-600", bar: "bg-emerald-500", text: "text-emerald-700", label: "A1 · Beginner" },
  a2: { color: "text-sky-600",     bar: "bg-sky-500",     text: "text-sky-700",     label: "A2 · Elementary" },
  b1: { color: "text-violet-600",  bar: "bg-violet-500",  text: "text-violet-700",  label: "B1 · Intermediate" },
  b2: { color: "text-amber-600",   bar: "bg-amber-500",   text: "text-amber-700",   label: "B2 · Upper-Int." },
  c1: { color: "text-rose-600",    bar: "bg-rose-500",    text: "text-rose-700",    label: "C1 · Advanced" },
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

// ── Progress ring (SVG) ───────────────────────────────────────────────────────

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

// ── Main component ────────────────────────────────────────────────────────────

export default function DashboardClient({
  firstName, greeting, isPro,
  streak, totalCompleted, avgScore, topicsMastered,
  overallPct, currentLevel, byLevel,
  weekly, maxWeekly, recentActivity, recs,
}: Props) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <main className="min-h-screen bg-[#F6F6F7]">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className={`grid gap-5 ${isPro ? "xl:grid-cols-[1fr_256px]" : "xl:grid-cols-[220px_1fr_256px]"}`}>

        {/* ══ LEFT: AdSense ══ */}
        <AdUnit variant="sidebar-account" />

        {/* ══ CENTER: Main content ══ */}
        <div>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <p className="text-sm text-slate-400">{today}</p>
              {isPro && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F5DA20] px-2.5 py-0.5 text-[11px] font-black text-black">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  PRO
                </span>
              )}
            </div>
            <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              {greeting}, <span className="text-[#b8a200]">{firstName}</span> 👋
            </h1>
            {streak > 0 ? (
              <p className="mt-1 text-sm text-slate-500">
                You&apos;re on a <span className="font-bold text-orange-500">{streak}-day streak</span> — keep it going!
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-400">Start learning today to begin your streak!</p>
            )}
          </div>

          {/* Level badge + settings */}
          <div className="flex items-center gap-2">
            {currentLevel ? (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm ring-1 ring-black/[0.03]">
                <div className="text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Current Level</div>
                  <div className="mt-0.5 text-2xl font-black text-slate-900">{currentLevel}</div>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div className="text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Overall</div>
                  <div className="mt-0.5 text-2xl font-black text-[#b8a200]">{overallPct}%</div>
                </div>
              </div>
            ) : (
              <a
                href="/tests/grammar"
                className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-3 text-center shadow-sm ring-1 ring-black/[0.03] transition hover:border-[#F5DA20] hover:bg-[#F5DA20]/5"
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Current Level</div>
                <div className="text-sm font-bold text-slate-500">Take the test →</div>
              </a>
            )}
            <a
              href="/account"
              title="Account Settings"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-slate-300 hover:text-slate-600"
            >
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">

          <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 shadow-sm ring-1 ring-black/[0.03]">
            <div className="absolute -right-2 -top-2 text-5xl opacity-[0.07] select-none">🔥</div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-orange-400">Streak</div>
            <div className="mt-2 text-4xl font-black text-slate-900 leading-none">
              <AnimatedNumber value={streak} />
            </div>
            <div className="mt-1 text-xs text-slate-400">days in a row</div>
            <div className="mt-3 h-1 w-full rounded-full bg-slate-100">
              <div className="h-1 rounded-full bg-orange-400 transition-all duration-700" style={{ width: `${Math.min(streak * 10, 100)}%` }} />
            </div>
          </div>

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

          <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-5 shadow-sm ring-1 ring-black/[0.03]">
            <div className="absolute -right-2 -top-2 text-5xl opacity-[0.07] select-none">⭐</div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-violet-600">Mastered</div>
            <div className="mt-2 text-4xl font-black text-slate-900 leading-none">
              <AnimatedNumber value={topicsMastered} />
            </div>
            <div className="mt-1 text-xs text-slate-400">topics ≥ 80%</div>
            <div className="mt-3 h-1 w-full rounded-full bg-slate-100">
              <div className="h-1 rounded-full bg-violet-400 transition-all duration-700" style={{ width: `${Math.min(topicsMastered * 2, 100)}%` }} />
            </div>
          </div>

        </div>

        {/* ── Middle row ──────────────────────────────────────────────────── */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">

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
                        <span className="text-xs text-slate-400">{cfg.label.split(" · ")[1]}</span>
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
                  {totalCompleted} of 384 total exercises completed
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
                <span className="font-bold text-slate-700">{Math.max(...weekly.map((w) => w.count))} exercises</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Recent activity ──────────────────────────────────────────────── */}
        {recentActivity.length > 0 && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/[0.03]">
            <div className="mb-4">
              <h2 className="text-base font-black text-slate-900">Recent Activity</h2>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {recentActivity.map((r, i) => {
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
        )}

        {/* ── Quick links ─────────────────────────────────────────────────── */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Grammar",    href: "/grammar/a1", icon: "G", bg: "bg-violet-100",           text: "text-violet-700",  hover: "hover:bg-violet-200", border: "border-violet-200" },
            { label: "Vocabulary", href: "/vocabulary", icon: "V", bg: "bg-emerald-100",          text: "text-emerald-700", hover: "hover:bg-emerald-200",border: "border-emerald-200" },
            { label: "Nerd Zone",  href: "/nerd-zone",  icon: "N", bg: "bg-[#F5DA20]/20",        text: "text-amber-700",   hover: "hover:bg-[#F5DA20]/35",border: "border-amber-200" },
            { label: "Take a Test",href: "/tests",      icon: "★", bg: "bg-sky-100",              text: "text-sky-700",     hover: "hover:bg-sky-200",    border: "border-sky-200" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-bold shadow-sm transition ${link.bg} ${link.text} ${link.hover} ${link.border}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/60 text-xs font-black">
                {link.icon}
              </span>
              {link.label}
            </a>
          ))}
        </div>

        </div>{/* end center column */}

        {/* ══ RIGHT: Recommendations ══ */}
        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-3">
            <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Recommended for you</p>
            {recs.map((rec) => (
              <a
                key={rec.slug}
                href={rec.href}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={rec.img}
                    alt={rec.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md ${rec.badge}`}>
                    {rec.level}
                  </span>
                </div>
                <div className="px-4 py-3.5">
                  <p className="text-sm font-bold leading-snug text-slate-800 group-hover:text-slate-900 transition">
                    {rec.title}
                  </p>
                  {rec.reason && (
                    <p className="mt-1.5 text-[11px] leading-snug text-amber-600 font-semibold">
                      {rec.reason}
                    </p>
                  )}
                </div>
              </a>
            ))}
            <a
              href="/grammar"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              Browse all topics
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
        </aside>

        </div>{/* end 3-col grid */}
      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

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
          ? isToday
            ? "bg-[#F5DA20] shadow-[0_2px_12px_rgba(245,218,32,0.5)]"
            : "bg-slate-200"
          : "bg-slate-100"
      }`}
      style={{ height: `${Math.max(h, hasActivity ? 8 : 3)}%` }}
    />
  );
}
