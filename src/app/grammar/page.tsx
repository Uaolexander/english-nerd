import ImageWithFallback from "@/components/ImageWithFallback";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "English Grammar Lessons A1 to C1 — English Nerd",
  description:
    "Free English grammar lessons for all levels — A1 Beginner to C1 Advanced. Clear explanations, interactive exercises, and instant feedback. Pick your level and start practising.",
  alternates: { canonical: "/grammar" },
};

type Level = {
  lvl: string;
  label: string;
  description: string;
  topics: number;
  color: string;
  textColor: string;
  dot: string;
  levelBarColor: string;
};

const LEVELS: Level[] = [
  {
    lvl: "A1",
    label: "Beginner",
    description: "Verb to be, articles, present simple, pronouns, basic questions and modals.",
    topics: 20,
    color: "bg-emerald-400",
    textColor: "text-black",
    dot: "bg-emerald-400",
    levelBarColor: "bg-emerald-400/10",
  },
  {
    lvl: "A2",
    label: "Elementary",
    description: "Past simple, present continuous, comparatives, superlatives, going to and should.",
    topics: 20,
    color: "bg-teal-400",
    textColor: "text-black",
    dot: "bg-teal-400",
    levelBarColor: "bg-teal-400/10",
  },
  {
    lvl: "B1",
    label: "Intermediate",
    description: "Conditionals, passive voice, reported speech, modal verbs and phrasal verbs.",
    topics: 21,
    color: "bg-sky-400",
    textColor: "text-black",
    dot: "bg-sky-400",
    levelBarColor: "bg-sky-400/10",
  },
  {
    lvl: "B2",
    label: "Upper-Intermediate",
    description: "Advanced passives, inversion, mixed conditionals, participle clauses and more.",
    topics: 18,
    color: "bg-violet-400",
    textColor: "text-black",
    dot: "bg-violet-400",
    levelBarColor: "bg-violet-400/10",
  },
  {
    lvl: "C1",
    label: "Advanced",
    description: "Complex noun phrases, subjunctive, ellipsis, advanced modals and nominalisation.",
    topics: 18,
    color: "bg-orange-400",
    textColor: "text-black",
    dot: "bg-orange-400",
    levelBarColor: "bg-orange-400/10",
  },
];

function LevelCard({ lvl }: { lvl: Level }) {
  return (
    <article className="group relative w-[200px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 sm:w-full sm:shrink">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-white/10 bg-black/30">
        <ImageWithFallback
          src={`/topics/grammar/${lvl.lvl.toLowerCase()}.jpg`}
          alt={`${lvl.lvl} Grammar`}
          className="h-full w-full object-cover"
        />
        <div className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-black text-black shadow-lg sm:top-3 sm:right-3 sm:px-3 sm:py-1 sm:text-xs ${lvl.color}`}>
          {lvl.lvl}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <h3 className="text-sm font-black leading-snug text-white sm:text-xl">
          {lvl.lvl} — {lvl.label}
        </h3>
        <p className="mt-1 text-[11px] text-white/55 leading-relaxed sm:mt-2 sm:text-sm">
          {lvl.description}
        </p>

        <div className="mt-3 sm:mt-4">
          <a
            href={`/grammar/${lvl.lvl.toLowerCase()}`}
            className="absolute inset-0 z-10"
            aria-label={`${lvl.lvl} ${lvl.label} Grammar`}
          />
          <p className="relative z-20 mb-3 text-[10px] text-white/30 sm:text-[11px]">
            {lvl.topics} topics
          </p>
          <a
            href={`/grammar/${lvl.lvl.toLowerCase()}`}
            className={`relative z-20 inline-flex items-center justify-center rounded-lg ${lvl.color} px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm`}
          >
            Start
          </a>
        </div>
      </div>
    </article>
  );
}

export default function GrammarPage() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/6 blur-[150px]" />
        <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/4 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-emerald-500/4 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">

        {/* Breadcrumb */}
        <div className="text-sm text-white/40">
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2 text-white/35">/</span>
          <span className="text-white/70">Grammar</span>
        </div>

        {/* Hero */}
        <div className="mt-6">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Grammar</span>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30"
              />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-white/45 text-base leading-relaxed">
            Grammar lessons from A1 to C1 — clear explanations, graded exercises, and instant feedback. Pick your level to get started.
          </p>
        </div>

        {/* Level overview bar */}
        <div className="mt-10 flex items-center gap-0 overflow-hidden rounded-2xl border border-white/8">
          {LEVELS.map(({ lvl, label, dot, levelBarColor }, i) => (
            <div
              key={lvl}
              className={`flex flex-1 flex-col items-center gap-1 py-4 ${levelBarColor} ${i > 0 ? "border-l border-white/8" : ""}`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                <span className="text-sm font-black text-white">{lvl}</span>
              </div>
              <span className="hidden text-[10px] text-white/35 sm:block">{label}</span>
            </div>
          ))}
        </div>

        {/* Grammar test CTA */}
        <a
          href="/tests/grammar"
          className="group mt-10 flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[#F5DA20]/25 bg-[#F5DA20]/8 px-6 py-5 transition hover:border-[#F5DA20]/40 hover:bg-[#F5DA20]/12"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20] shadow-md">
              <svg className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </span>
            <div>
              <p className="font-black text-white">Not sure what level your grammar is?</p>
              <p className="mt-0.5 text-sm text-white/50">Take the Grammar Test — get your level in minutes.</p>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-black text-black transition group-hover:opacity-90">
            Take test
          </span>
        </a>

        {/* Level cards — mobile: horizontal carousel | desktop: grid */}
        <div className="mt-14 flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:-mx-0 sm:px-0 lg:grid-cols-3">
          {LEVELS.map((lvl) => (
            <div key={lvl.lvl} className="snap-start">
              <LevelCard lvl={lvl} />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
