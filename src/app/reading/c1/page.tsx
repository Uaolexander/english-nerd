import AdUnit from "@/components/AdUnit";
import type { Metadata } from "next";
import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata: Metadata = {
  title: "C1 Reading Practice | English Nerd",
  description:
    "C1 advanced English reading exercises. Academic papers, complex essays and analytical texts with comprehension, true/false and fill-in-the-blanks tasks.",
  alternates: { canonical: "/reading/c1" },
};

type Exercise = {
  slug: string;
  title: string;
  description: string;
  questions: number;
  tag: string;
  image: string;
  isNew?: boolean;
};

const EXERCISES: Exercise[] = [
  {
    slug: "rethinking-intelligence",
    title: "Rethinking Intelligence",
    description:
      "Read what four researchers say about intelligence and cognitive ability. Are the statements true or false?",
    questions: 8,
    tag: "True / False",
    image: "/topics/reading/c1/rethinking-intelligence.jpg",
    isNew: true,
  },
  {
    slug: "the-attention-economy",
    title: "The Attention Economy",
    description:
      "Read the analytical essay about how tech companies compete for human attention and answer the questions.",
    questions: 6,
    tag: "Comprehension",
    image: "/topics/reading/c1/the-attention-economy.jpg",
    isNew: true,
  },
  {
    slug: "language-and-thought",
    title: "Language and Thought",
    description:
      "Read the academic article about the relationship between language and cognition and fill in the missing words.",
    questions: 8,
    tag: "Fill in Blanks",
    image: "/topics/reading/c1/language-and-thought.jpg",
    isNew: true,
  },
];

export default function ReadingC1Page() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      {/* Background glows */}
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
            <a className="hover:text-white transition" href="/reading">Reading</a>{" "}
            <span className="text-white/35">/</span>{" "}
            <span className="text-white/90">C1</span>
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
            C1 Reading <span className="text-[#F5DA20]">Exercises</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/55 text-base leading-relaxed">
            Advanced level: academic papers, analytical essays and complex texts with
            comprehension tasks to sharpen your critical reading skills.
          </p>

          {/* Level switcher */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { lvl: "A1", href: "/reading/a1" },
              { lvl: "A2", href: "/reading/a2" },
              { lvl: "B1", href: "/reading/b1" },
              { lvl: "B2", href: "/reading/b2" },
              { lvl: "C1", href: "/reading/c1" },
            ].map(({ lvl, href }) => {
              const active = lvl === "C1";
              return (
                <a
                  key={lvl}
                  href={href}
                  className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold transition ${
                    active
                      ? "bg-sky-400 text-black shadow-sm"
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
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20]/20 text-lg">
              📖
            </span>
            <div>
              <p className="font-bold text-white text-sm">How to approach advanced texts</p>
              <p className="mt-0.5 text-sm text-white/45">
                Read the whole text before attempting any questions. Pay close attention to
                hedging language, qualifications and the precise claims each author makes.
                The difference between a correct and incorrect answer often lies in a single
                qualifier.
              </p>
            </div>
          </div>

          {/* Layout: cards + ad sidebar */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">

            {/* Cards */}
            <section>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {EXERCISES.map((ex) => (
                  <article
                    key={ex.slug}
                    className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
                  >
                    {/* Image area */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/10 bg-black/30">
                      <ImageWithFallback
                        src={ex.image}
                        alt={ex.title}
                        className="h-full w-full object-cover"
                      />

                      {/* C1 badge */}
                      <div className="absolute top-3 left-3 rounded-full bg-sky-400 px-3 py-1 text-xs font-black text-black shadow-lg">
                        C1
                      </div>

                      {/* New badge */}
                      {ex.isNew && (
                        <div className="absolute top-3 right-3 rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-black shadow-lg">
                          New
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      {/* Tag */}
                      <span className="inline-flex items-center rounded-md bg-white/8 px-2.5 py-0.5 text-xs font-semibold text-white/60">
                        {ex.tag}
                      </span>

                      <h2 className="mt-2 text-xl font-black leading-snug transition group-hover:text-[#F5DA20]">
                        {ex.title}
                      </h2>

                      <p className="mt-2 text-sm text-white/60 leading-relaxed">
                        {ex.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Full-card overlay link */}
                        <a
                          href={`/reading/c1/${ex.slug}`}
                          className="absolute inset-0 z-10"
                          aria-label={`Start ${ex.title}`}
                        />

                        <a
                          href={`/reading/c1/${ex.slug}`}
                          className="relative z-20 inline-flex items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-bold text-black hover:opacity-90 transition"
                        >
                          Start Exercise
                        </a>

                        <span className="relative z-20 text-xs text-white/40">
                          {ex.questions} questions
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Mobile ad placeholder */}
              <AdUnit variant="mobile-dark" />
            </section>
            <AdUnit variant="sidebar-dark" />
          </div>

        </div>
      </div>
    </main>
  );
}
