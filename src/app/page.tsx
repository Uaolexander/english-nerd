import React from "react";
import FadeIn from "@/components/FadeIn";
import LetterboxSection from "@/components/LetterboxSection";
import ImageWithFallback from "@/components/ImageWithFallback";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "English Nerd",
  url: "https://englishnerd.cc",
  description: "Free English grammar lessons, vocabulary tests, and exercises for all levels A1 to C1.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://englishnerd.cc/grammar/a1?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const metadata = {
  title: "English Nerd — Free English Grammar Lessons & Exercises",
  description: "Practice English grammar, vocabulary, listening and reading — all levels A1 to C1. Free interactive exercises with instant feedback and English level tests.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Hero />
      <Skills />
      <PlacementTest />
      <MeetTheTeacher />
      <LetterboxSection />
    </main>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      {/* Background glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[#F5DA20]/6 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[300px] w-[400px] rounded-full bg-[#F5DA20]/4 blur-[100px]" />

      {/* Floating level badges (decorative) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <div className="absolute top-20 left-[6%] rotate-[-8deg] rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 text-xs font-black text-emerald-400/50 hidden sm:block">A1</div>
        <div className="absolute top-14 right-[10%] rotate-[6deg] rounded-xl border border-teal-400/20 bg-teal-400/8 px-3 py-1.5 text-xs font-black text-teal-400/50 hidden sm:block">A2</div>
        <div className="absolute top-1/3 left-[3%] rotate-[-4deg] rounded-xl border border-sky-400/20 bg-sky-400/8 px-3 py-1.5 text-xs font-black text-sky-400/50 hidden md:block">B1</div>
        <div className="absolute top-1/4 right-[5%] rotate-[8deg] rounded-xl border border-violet-400/20 bg-violet-400/8 px-3 py-1.5 text-xs font-black text-violet-400/50 hidden md:block">B2</div>
        <div className="absolute bottom-32 left-[12%] rotate-[-5deg] rounded-xl border border-orange-400/20 bg-orange-400/8 px-3 py-1.5 text-xs font-black text-orange-400/50 hidden sm:block">C1</div>
        <div className="absolute bottom-20 right-[8%] rotate-[4deg] rounded-xl border border-pink-400/20 bg-pink-400/8 px-3 py-1.5 text-xs font-black text-pink-400/50 hidden md:block">C2</div>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Pill badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/60 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F5DA20]" />
          Grammar · Vocabulary · Listening · Reading · Tests
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
          Master
          <br />
          <span className="text-[#F5DA20]">English.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base text-white/60 md:text-lg">
          Practice grammar, expand vocabulary, improve listening and reading — all in one place. Pick a topic, do exercises, see your score.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/grammar/a1"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F5DA20] px-7 py-3.5 text-sm font-black text-black transition hover:opacity-90 shadow-lg shadow-[#F5DA20]/20"
          >
            Start Learning
          </a>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl border border-[#F5DA20]/30 bg-[#F5DA20]/5 px-7 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-[#F5DA20]/10 hover:border-[#F5DA20]/50 shadow-[0_0_12px_rgba(245,218,32,0.08)] backdrop-blur"
          >
            Log in
          </a>
        </div>

        {/* Stats row */}
        <div className="mx-auto mt-16 grid max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <Stat value="100+" label="Lessons" />
          <Stat value="A1–C1" label="All Levels" />
          <Stat value="PRO" label="Available" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-6 py-5 text-center">
      <div className="text-xl font-black text-white">{value}</div>
      <div className="mt-0.5 text-xs text-white/55">{label}</div>
    </div>
  );
}

/* ─── Skills grid ───────────────────────────────────────────────────────── */

const SKILL_ICONS: Record<string, React.ReactNode> = {
  Grammar: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Vocabulary: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Listening: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  ),
  Reading: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Tests: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
};

const SKILLS = [
  {
    href: "/grammar/a1",
    label: "Grammar",
    description: "Clear rules, examples, and graded exercises from A1 to C1.",
    tag: "A1 → C1",
  },
  {
    href: "/vocabulary",
    label: "Vocabulary",
    description: "Topic-based word lists with quizzes and spaced repetition.",
    tag: "All levels",
  },
  {
    href: "/listening",
    label: "Listening",
    description: "Real audio with comprehension questions and transcripts.",
    tag: "A2 → C1",
  },
  {
    href: "/reading",
    label: "Reading",
    description: "Short texts with vocabulary highlights and exercises.",
    tag: "A1 → C1",
  },
  {
    href: "/tests/grammar",
    label: "Tests",
    description: "Placement and topic tests with instant score and feedback.",
    tag: "All levels",
  },
];

function Skills() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h2 className="text-2xl font-black md:text-3xl">What you&apos;ll practice</h2>
          <p className="mt-2 text-sm text-white/55">Five core skills. Pick any, start anywhere.</p>
        </div>

        {/* Top 3 */}
        <div className="grid gap-4 md:grid-cols-3">
          {SKILLS.slice(0, 3).map((s, i) => (
            <FadeIn key={s.label} delay={i * 80} className="h-full">
              <SkillCard href={s.href} label={s.label} description={s.description} tag={s.tag} />
            </FadeIn>
          ))}
        </div>
        {/* Bottom 2 */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {SKILLS.slice(3).map((s, i) => (
            <FadeIn key={s.label} delay={i * 80} className="h-full">
              <SkillCard href={s.href} label={s.label} description={s.description} tag={s.tag} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({
  href,
  label,
  description,
  tag,
}: {
  href: string;
  label: string;
  description: string;
  tag: string;
}) {
  return (
    <a
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition hover:border-[#F5DA20]/30 hover:bg-white/[0.06]"
    >
      {/* Icon */}
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5DA20]/10 border border-[#F5DA20]/15 text-[#F5DA20] transition group-hover:bg-[#F5DA20]/18">
        {SKILL_ICONS[label]}
      </div>

      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white/50">{tag}</span>
      </div>

      {/* Label */}
      <div className="mt-2 text-xl font-black text-white">{label}</div>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-white/55">{description}</p>

      {/* Bottom accent line */}
      <div className="mt-6 h-px w-0 bg-[#F5DA20]/50 transition-all duration-300 group-hover:w-full" />
    </a>
  );
}

/* ─── Placement test ────────────────────────────────────────────────────── */

function PlacementTest() {
  return (
    <section className="px-6 pb-28">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] px-8 py-12 text-center md:px-16">
          {/* Glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5DA20]/5 blur-3xl" />

          {/* Corner decorations */}
          <div className="pointer-events-none absolute top-0 left-0 h-24 w-24 rounded-tl-3xl border-t-2 border-l-2 border-[#F5DA20]/15" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 rounded-br-3xl border-b-2 border-r-2 border-[#F5DA20]/15" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F5DA20]/20 bg-[#F5DA20]/10 px-4 py-1.5 text-xs font-bold text-[#F5DA20]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5DA20]" />
              Takes only 2 minutes
            </div>

            <h2 className="text-3xl font-black md:text-4xl">
              Not sure where to start?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/55">
              Take a quick English level test. We&apos;ll tell you your current level and suggest what to practice first.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/tests/grammar"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F5DA20] px-7 py-3.5 text-sm font-black text-black transition hover:opacity-90 shadow-lg shadow-[#F5DA20]/20"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Grammar test
              </a>
              <a
                href="/tests/vocabulary"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Vocabulary test
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Meet the teacher ──────────────────────────────────────────────────── */

function MeetTheTeacher() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] px-8 py-10 sm:px-12">
          <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-[#F5DA20]/6 blur-[80px]" />
          <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-center">
            <div className="shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border border-[#F5DA20]/20 shadow-xl shadow-black/40 sm:h-28 sm:w-28">
                <ImageWithFallback
                  src="/oleksandr.JPG"
                  alt="Oleksandr Vdovychenko"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">Behind the site</p>
              <h2 className="text-xl font-black text-white sm:text-2xl">Oleksandr Vdovychenko</h2>
              <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-lg">
                English teacher with 8+ years of experience, polyglot, and a genuine language nerd. Lived across seven countries, speaks five languages, and built this site to make English learning cleaner and more accessible.
              </p>
              <a href="/about" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#F5DA20] hover:opacity-80 transition">
                Read more →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

