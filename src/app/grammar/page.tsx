import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "English Grammar Lessons A1 to C1 — English Nerd",
  description:
    "Free English grammar lessons for all levels — A1 Beginner to C1 Advanced. Clear explanations, interactive exercises, and instant feedback. Pick your level and start practising.",
  alternates: { canonical: "/grammar" },
};

const LEVELS = [
  {
    slug: "a1",
    label: "A1",
    name: "Beginner",
    desc: "Verb to be, articles, present simple, pronouns, basic questions and modals.",
    topics: 20,
    color: "text-emerald-400",
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/[0.06]",
    dot: "bg-emerald-400",
  },
  {
    slug: "a2",
    label: "A2",
    name: "Elementary",
    desc: "Past simple, present continuous, comparatives, superlatives, going to and should.",
    topics: 20,
    color: "text-teal-400",
    border: "border-teal-500/25",
    bg: "bg-teal-500/[0.06]",
    dot: "bg-teal-400",
  },
  {
    slug: "b1",
    label: "B1",
    name: "Intermediate",
    desc: "Conditionals, passive voice, reported speech, modal verbs and phrasal verbs.",
    topics: 21,
    color: "text-sky-400",
    border: "border-sky-500/25",
    bg: "bg-sky-500/[0.06]",
    dot: "bg-sky-400",
  },
  {
    slug: "b2",
    label: "B2",
    name: "Upper-Intermediate",
    desc: "Advanced passives, inversion, mixed conditionals, participle clauses and more.",
    topics: 18,
    color: "text-violet-400",
    border: "border-violet-500/25",
    bg: "bg-violet-500/[0.06]",
    dot: "bg-violet-400",
  },
  {
    slug: "c1",
    label: "C1",
    name: "Advanced",
    desc: "Complex noun phrases, subjunctive, ellipsis, advanced modals and nominalisation.",
    topics: 18,
    color: "text-orange-400",
    border: "border-orange-500/25",
    bg: "bg-orange-500/[0.06]",
    dot: "bg-orange-400",
  },
];

export default function GrammarPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] text-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#F5DA20]/60">
            Grammar
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            All levels. Every rule.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/55">
            Grammar lessons from A1 to C1 — clear explanations, graded exercises, and instant feedback. Pick your level to get started.
          </p>
        </div>

        {/* Level cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((level) => (
            <a
              key={level.slug}
              href={`/grammar/${level.slug}`}
              className={`group flex flex-col rounded-2xl border p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 ${level.border} ${level.bg}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className={`text-3xl font-black ${level.color}`}>{level.label}</span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white/50 bg-white/[0.06]`}>
                  {level.topics} topics
                </span>
              </div>
              <div className="text-lg font-black text-white">{level.name}</div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{level.desc}</p>
              <div className={`mt-5 flex items-center gap-1.5 text-sm font-bold ${level.color}`}>
                Start {level.label}
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom hint */}
        <p className="mt-10 text-center text-sm text-white/40">
          Not sure which level?{" "}
          <a href="/tests/grammar" className="font-bold text-[#F5DA20]/70 hover:text-[#F5DA20] transition">
            Take the grammar test →
          </a>
        </p>
      </div>
    </main>
  );
}
