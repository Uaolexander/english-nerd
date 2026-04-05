import ImageWithFallback from "@/components/ImageWithFallback";
import AdUnit from "@/components/AdUnit";

export const metadata = {
  title: "English Tenses — English Nerd",
  description:
    "Master all 12 English tenses — Present, Past and Future. Clear rules, structure tables and graded exercises from A1 to C1.",
  alternates: { canonical: "/tenses" },
};

type Tense = {
  slug: string;
  title: string;
  level: string;
  use: string;
  structure: string;
};

const PRESENT: Tense[] = [
  {
    slug: "present-simple",
    title: "Present Simple",
    level: "A1",
    use: "Routines, facts, permanent states",
    structure: "I work / She works",
  },
  {
    slug: "present-continuous",
    title: "Present Continuous",
    level: "A1",
    use: "Actions happening right now or temporary situations",
    structure: "I am working",
  },
  {
    slug: "present-perfect",
    title: "Present Perfect",
    level: "B1",
    use: "Past actions with present relevance",
    structure: "I have worked",
  },
  {
    slug: "present-perfect-continuous",
    title: "Present Perfect Continuous",
    level: "B1–B2",
    use: "Actions that started in the past and are still ongoing",
    structure: "I have been working",
  },
];

const PAST: Tense[] = [
  {
    slug: "past-simple",
    title: "Past Simple",
    level: "A2",
    use: "Completed actions at a specific time in the past",
    structure: "I worked",
  },
  {
    slug: "past-continuous",
    title: "Past Continuous",
    level: "A2–B1",
    use: "Actions in progress at a moment in the past",
    structure: "I was working",
  },
  {
    slug: "past-perfect",
    title: "Past Perfect",
    level: "B1–B2",
    use: "Action completed before another past action",
    structure: "I had worked",
  },
  {
    slug: "past-perfect-continuous",
    title: "Past Perfect Continuous",
    level: "B2",
    use: "Duration of an action before a past moment",
    structure: "I had been working",
  },
];

const FUTURE: Tense[] = [
  {
    slug: "future-simple",
    title: "Future Simple (will)",
    level: "A2",
    use: "Spontaneous decisions, predictions, promises",
    structure: "I will work",
  },
  {
    slug: "be-going-to",
    title: "Be going to",
    level: "A2",
    use: "Plans and intentions, evidence-based predictions",
    structure: "I am going to work",
  },
  {
    slug: "future-continuous",
    title: "Future Continuous",
    level: "B2",
    use: "Actions in progress at a specific future time",
    structure: "I will be working",
  },
  {
    slug: "future-perfect",
    title: "Future Perfect",
    level: "B2–C1",
    use: "Actions completed before a specific future moment",
    structure: "I will have worked",
  },
  {
    slug: "future-perfect-continuous",
    title: "Future Perfect Continuous",
    level: "C1",
    use: "Duration of an action up to a specific future moment",
    structure: "I will have been working",
  },
];

function levelBadge(level: string): string {
  if (level.startsWith("A1")) return "bg-[#F5DA20]";
  if (level.startsWith("A2")) return "bg-emerald-400";
  if (level.startsWith("B1")) return "bg-violet-400";
  if (level.startsWith("B2")) return "bg-orange-400";
  if (level.startsWith("C1")) return "bg-cyan-400";
  return "bg-white/40";
}

function TenseCard({ tense }: { tense: Tense }) {
  return (
    <article className="group relative w-[200px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 sm:w-full sm:shrink">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-white/10 bg-black/30">
        <ImageWithFallback
          src={`/topics/tenses/${tense.slug}.jpg`}
          alt={tense.title}
          className="h-full w-full object-cover"
        />
        <div className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-black text-black shadow-lg sm:top-3 sm:right-3 sm:px-3 sm:py-1 sm:text-xs ${levelBadge(tense.level)}`}>
          {tense.level}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <h3 className="text-sm font-black leading-snug text-white sm:text-xl">{tense.title}</h3>
        <p className="mt-1 text-[11px] text-white/55 leading-relaxed sm:mt-2 sm:text-sm">{tense.use}</p>

        <div className="mt-3 sm:mt-4">
          <a
            href={`/tenses/${tense.slug}`}
            className="absolute inset-0 z-10"
            aria-label={tense.title}
          />
          <code className="relative z-20 mb-3 block rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-white/50 sm:rounded-lg sm:px-2.5 sm:text-[11px]">
            {tense.structure}
          </code>
          <button
            className="relative z-20 inline-flex items-center justify-center rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
            type="button"
          >
            Start
          </button>
        </div>
      </div>
    </article>
  );
}

type GroupProps = {
  label: string;
  sublabel: string;
  tenses: Tense[];
  dotColor: string;
};

function TenseGroup({ label, sublabel, tenses, dotColor }: GroupProps) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor} shadow-lg`} />
        <div>
          <h2 className="text-xl font-black text-white">{label}</h2>
          <p className="text-xs text-white/35">{sublabel}</p>
        </div>
      </div>

      {/* Mobile: horizontal carousel | Desktop: grid */}
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:-mx-0 sm:px-0 lg:grid-cols-4">
        {tenses.map((t) => (
          <div key={t.slug} className="snap-start">
            <TenseCard tense={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TensesPage() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/6 blur-[150px]" />
        <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-sky-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">

        {/* Breadcrumb */}
        <div className="text-sm text-white/40">
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">Tenses</span>
        </div>

        {/* Hero */}
        <div className="mt-6">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Tenses</span>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30"
              />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-white/45 text-base leading-relaxed">
            All 12 tenses — from Present Simple to Future Perfect. Clear rules, structure tables, and graded exercises.
          </p>
        </div>

        {/* Timeline bar */}
        <div className="mt-10 flex items-center gap-0 overflow-hidden rounded-2xl border border-white/8">
          {[
            { label: "Past", sub: "4 tenses", color: "bg-amber-400/15", dot: "bg-amber-400" },
            { label: "Present", sub: "4 tenses", color: "bg-[#F5DA20]/15", dot: "bg-[#F5DA20]" },
            { label: "Future", sub: "4 tenses", color: "bg-sky-400/15", dot: "bg-sky-400" },
          ].map(({ label, sub, color, dot }, i) => (
            <div key={label} className={`flex flex-1 flex-col items-center gap-1 py-4 ${color} ${i === 1 ? "border-x border-white/8" : ""}`}>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                <span className="text-sm font-black text-white">{label}</span>
              </div>
              <span className="text-[10px] text-white/35">{sub}</span>
            </div>
          ))}
        </div>

        {/* Tenses test CTA */}
        <a
          href="/tests/tenses"
          className="group mt-10 flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-violet-400/25 bg-violet-500/8 px-6 py-5 transition hover:border-violet-400/40 hover:bg-violet-500/12"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400 text-xl shadow-md">⏱</span>
            <div>
              <p className="font-black text-white">Not sure which tenses you know?</p>
              <p className="mt-0.5 text-sm text-white/50">Take the Tenses Test — get a full breakdown in 10 minutes.</p>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-violet-400 px-4 py-2 text-sm font-black text-black transition group-hover:opacity-90">
            Take test
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>

        {/* Tense groups */}
        <div className="mt-14 flex flex-col gap-14">
          <TenseGroup
            label="Present"
            sublabel="What is happening now, what is always true"
            tenses={PRESENT}
            dotColor="bg-[#F5DA20]"
          />
          <TenseGroup
            label="Past"
            sublabel="What happened, was happening, or had happened"
            tenses={PAST}
            dotColor="bg-emerald-400"
          />
          <TenseGroup
            label="Future"
            sublabel="What will happen, will be happening, or will have happened"
            tenses={FUTURE}
            dotColor="bg-sky-400"
          />
        </div>

        {/* Ad */}
        <div className="mt-14">
          <AdUnit variant="inline-light" />
        </div>

        {/* Quick-reference card */}
        <div className="mt-10 rounded-3xl border border-white/8 bg-white/[0.02] p-8">
          <h2 className="text-lg font-black text-white">Quick reference</h2>
          <p className="mt-1 text-sm text-white/35">All 12 tenses at a glance — structure only.</p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left">
                  <th className="pb-3 pr-6 text-xs font-bold uppercase tracking-widest text-white/25">Tense</th>
                  <th className="pb-3 pr-6 text-xs font-bold uppercase tracking-widest text-white/25">Positive</th>
                  <th className="pb-3 text-xs font-bold uppercase tracking-widest text-white/25">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...PRESENT, ...PAST, ...FUTURE].map((t) => (
                  <tr key={t.slug} className="group">
                    <td className="py-3 pr-6">
                      <a href={`/tenses/${t.slug}`} className="font-semibold text-white/70 transition group-hover:text-white">
                        {t.title}
                      </a>
                    </td>
                    <td className="py-3 pr-6">
                      <code className="text-[12px] text-white/40 font-mono">{t.structure}</code>
                    </td>
                    <td className="py-3">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/35">
                        {t.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
