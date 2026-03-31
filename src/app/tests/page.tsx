export const metadata = {
  title: "Tests — English Nerd",
  description:
    "Free English tests: vocabulary size test, grammar placement test, and tenses test. Find your level instantly.",
  alternates: { canonical: "/tests" },
};

function VocabIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4h14a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M22 8h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 10h8M9 14h8M9 18h5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function GrammarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" rx="4" stroke="white" strokeWidth="2"/>
      <path d="M10 11h12M10 16h12M10 21h7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="21" r="4" fill="white"/>
      <path d="M22 21l1.5 1.5L26 19" stroke="#121216" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TensesIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" stroke="white" strokeWidth="2"/>
      <path d="M16 9v7l4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 16h2M26 16h2M16 4v2M16 26v2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function TestsPage() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#F5DA20]/8 blur-[140px]" />
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-[#0B0B0D] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-14">
        {/* Breadcrumb */}
        <div className="text-sm text-white/50">
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2 text-white/25">/</span>
          <span className="text-white/80">Tests</span>
        </div>

        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
          English{" "}
          <span className="rounded-lg bg-[#F5DA20] px-2 py-0.5 text-[#0F0F12]">Tests</span>
        </h1>
        <p className="mt-3 max-w-xl text-white/55">
          Find your level in minutes. Free, no sign-up, no tracking — just honest results.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* ── Vocabulary ── */}
          <a href="/tests/vocabulary" className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1.5 hover:border-[#F5DA20]/30 hover:shadow-2xl hover:shadow-[#F5DA20]/10">
            {/* Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#F5DA20] to-[#e8c800] px-7 pt-7 pb-10">
              {/* Dot grid */}
              <div aria-hidden className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
              {/* Deco */}
              <div aria-hidden className="absolute -bottom-3 -right-3 text-[88px] font-black leading-none text-black/10 select-none">Aa</div>
              {/* Level pill */}
              <span className="absolute top-4 right-4 rounded-full bg-black/12 px-2.5 py-0.5 text-[10px] font-black text-black/60">A1 → C2</span>
              {/* Icon */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/10">
                <VocabIcon />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-xl font-black leading-tight">Vocabulary Size Test</h2>
              <p className="mt-2 text-sm text-white/50 leading-relaxed flex-1">
                Tick the words you know across three rounds. Get an estimated vocabulary size from A1 to C2.
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {["~5 min", "90 words"].map((t) => (
                    <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/35">{t}</span>
                  ))}
                </div>
                <span className="flex items-center gap-1 rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-black text-black transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#F5DA20]/30">
                  Start
                </span>
              </div>
            </div>
          </a>

          {/* ── Grammar ── */}
          <a href="/tests/grammar" className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1.5 hover:border-sky-400/30 hover:shadow-2xl hover:shadow-sky-500/10">
            {/* Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 px-7 pt-7 pb-10">
              <div aria-hidden className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
              <div aria-hidden className="absolute -bottom-3 -right-3 text-[88px] font-black leading-none text-white/8 select-none">B1</div>
              <span className="absolute top-4 right-4 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-black text-white/70">A1 → C1</span>
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <GrammarIcon />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-xl font-black leading-tight">Grammar Placement Test</h2>
              <p className="mt-2 text-sm text-white/50 leading-relaxed flex-1">
                60 questions from beginner to advanced. See your CEFR level with a topic-by-topic breakdown.
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {["~15 min", "60 questions"].map((t) => (
                    <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/35">{t}</span>
                  ))}
                </div>
                <span className="flex items-center gap-1 rounded-xl bg-sky-500 px-4 py-2 text-sm font-black text-white transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-sky-500/30">
                  Start
                </span>
              </div>
            </div>
          </a>

          {/* ── Tenses ── */}
          <a href="/tests/tenses" className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1.5 hover:border-violet-400/30 hover:shadow-2xl hover:shadow-violet-500/10">
            {/* Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-700 px-7 pt-7 pb-10">
              <div aria-hidden className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
              <div aria-hidden className="absolute -bottom-3 -right-3 text-[88px] font-black leading-none text-white/8 select-none">12</div>
              <span className="absolute top-4 right-4 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-black text-white/70">A1 → C1</span>
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <TensesIcon />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-xl font-black leading-tight">Tenses Test</h2>
              <p className="mt-2 text-sm text-white/50 leading-relaxed flex-1">
                Test all 12 English tenses at once. Get a tense-by-tense breakdown with direct links to practice.
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {["~10 min", "34 questions"].map((t) => (
                    <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/35">{t}</span>
                  ))}
                </div>
                <span className="flex items-center gap-1 rounded-xl bg-violet-500 px-4 py-2 text-sm font-black text-white transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-violet-500/30">
                  Start
                </span>
              </div>
            </div>
          </a>

        </div>
      </div>
    </main>
  );
}
