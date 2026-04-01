import type { Metadata } from "next";
import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata: Metadata = {
  title: "B1 Vocabulary Exercises — English Nerd",
  description:
    "B1 Intermediate vocabulary exercises. Read dialogues and texts with more complex vocabulary. Focus on collocations, phrasal verbs and topic-specific words.",
  alternates: { canonical: "/vocabulary/b1" },
};

type Exercise = {
  slug: string;
  title: string;
  description: string;
  questions: number;
  tag: string;
  image: string;
  isNew?: boolean;
  comingSoon?: boolean;
};

const EXERCISES: Exercise[] = [
  {
    slug: "job-interview",
    title: "A Job Interview",
    description:
      "Tom prepares for a job interview at a marketing company. Read the dialogue and choose the correct word for each gap.",
    questions: 10,
    tag: "Dialogue",
    image: "/topics/vocabulary/b1/job-interview.jpg",
    isNew: true,
  },
  {
    slug: "health-and-fitness",
    title: "Health & Fitness",
    description:
      "Learn health and fitness vocabulary with three activities: multiple choice, choose the word, and fill in the blanks.",
    questions: 10,
    tag: "3 Exercises",
    image: "/topics/vocabulary/b1/health-and-fitness.jpg",
    isNew: true,
  },
  {
    slug: "travel-plans",
    title: "Travel Plans",
    description:
      "Laura and Mike discuss their holiday plans. Read the dialogue and choose the correct word for each gap.",
    questions: 10,
    tag: "Dialogue",
    image: "/topics/vocabulary/b1/travel-plans.jpg",
    isNew: true,
  },
  {
    slug: "city-life",
    title: "City Life",
    description:
      "Learn city and urban life vocabulary with three activities: multiple choice, choose the word, and fill in the blanks.",
    questions: 10,
    tag: "3 Exercises",
    image: "/topics/vocabulary/b1/city-life.jpg",
    isNew: true,
  },
];

export default function VocabularyB1Page() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#F5DA20]/15 blur-[140px]" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/8 blur-[160px]" />
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-[#0B0B0D] to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-10">

          {/* Breadcrumb */}
          <div className="text-sm text-white/60">
            <a className="hover:text-white transition" href="/">Home</a>{" "}
            <span className="text-white/35">/</span>{" "}
            <a className="hover:text-white transition" href="/vocabulary">Vocabulary</a>{" "}
            <span className="text-white/35">/</span>{" "}
            <span className="text-white/90">B1</span>
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
            B1 Vocabulary <span className="text-[#F5DA20]">Exercises</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/55 text-base leading-relaxed">
            Intermediate level — read dialogues and texts with more complex vocabulary. Focus on collocations, phrasal verbs and topic-specific words.
          </p>

          {/* Level switcher */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { lvl: "A1", href: "/vocabulary/a1" },
              { lvl: "A2", href: "/vocabulary/a2" },
              { lvl: "B1", href: "/vocabulary/b1" },
              { lvl: "B2", href: "/vocabulary/b2" },
              { lvl: "C1", href: "/vocabulary/c1" },
            ].map(({ lvl, href }) => {
              const active = lvl === "B1";
              return (
                <a
                  key={lvl}
                  href={href}
                  className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold transition ${
                    active
                      ? "bg-violet-400 text-black shadow-sm"
                      : "border border-white/15 text-white/55 hover:border-white/30 hover:text-white/85"
                  }`}
                >
                  {lvl}
                </a>
              );
            })}
          </div>

          {/* Tip */}
          <div className="mt-8 flex items-start gap-4 overflow-hidden rounded-2xl border border-[#F5DA20]/20 bg-[#F5DA20]/6 px-5 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20]/20 text-lg">📚</span>
            <div>
              <p className="font-bold text-white text-sm">How to practise</p>
              <p className="mt-0.5 text-sm text-white/45">
                Intermediate level — read dialogues and texts with more complex vocabulary. Focus on collocations, phrasal verbs and topic-specific words.
              </p>
            </div>
          </div>

          {/* Layout */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">

            {/* Left ad */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-white/30">ADVERTISEMENT</p>
                <div className="mt-3 flex h-[600px] items-center justify-center rounded-xl border border-white/8 bg-black/30 text-sm text-white/20">
                  300 × 600
                </div>
              </div>
            </aside>

            {/* Exercise cards */}
            <section>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {EXERCISES.map((ex) => (
                  <article
                    key={ex.slug}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 ${
                      ex.comingSoon ? "opacity-60" : "hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                      <ImageWithFallback
                        src={ex.image}
                        alt={ex.title}
                        className={`h-full w-full object-cover transition duration-500 ${ex.comingSoon ? "" : "group-hover:scale-105"}`}
                      />
                      {/* Dark overlay for coming soon */}
                      {ex.comingSoon && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold text-white/60 backdrop-blur-sm">
                            Coming Soon
                          </span>
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className="rounded-full bg-violet-400 px-2.5 py-0.5 text-[10px] font-black text-black">B1</span>
                        <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-0.5 text-[10px] font-semibold text-white/80 backdrop-blur-sm">
                          {ex.tag}
                        </span>
                      </div>
                      {ex.isNew && (
                        <span className="absolute right-3 top-3 rounded-full bg-emerald-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-black">
                          New
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h2 className="text-lg font-black text-white leading-snug">{ex.title}</h2>
                      <p className="mt-2 text-sm text-white/70 leading-relaxed">{ex.description}</p>
                      <div className="mt-4 flex items-center gap-3">
                        {ex.comingSoon ? (
                          <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-black text-white/30">
                            Coming Soon
                          </span>
                        ) : (
                          <a
                            href={`/vocabulary/b1/${ex.slug}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-5 py-2.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm"
                          >
                            Start Exercise
                          </a>
                        )}
                        <span className="text-xs text-white/30">{ex.questions} questions</span>
                      </div>
                    </div>

                    {/* Full card link */}
                    {!ex.comingSoon && (
                      <a href={`/vocabulary/b1/${ex.slug}`} className="absolute inset-0" aria-label={ex.title} />
                    )}
                  </article>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
