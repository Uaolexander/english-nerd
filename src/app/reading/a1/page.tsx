import type { Metadata } from "next";
import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata: Metadata = {
  title: "A1 Reading Practice — English Nerd",
  description:
    "A1 beginner English reading exercises. Short texts, profiles and stories with True/False, comprehension and fill-in-the-blanks tasks. Free practice.",
  alternates: { canonical: "/reading/a1" },
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
    slug: "four-friends",
    title: "Four Friends",
    description:
      "Read short profiles of four friends and decide if the statements are true or false.",
    questions: 8,
    tag: "True / False",
    image: "/topics/reading/a1/four-friends.jpg",
    isNew: true,
  },
  {
    slug: "my-school-day",
    title: "My School Day",
    description:
      "Read about Emma's school day and answer the comprehension questions.",
    questions: 6,
    tag: "Comprehension",
    image: "/topics/reading/a1/my-school-day.jpg",
    isNew: true,
  },
  {
    slug: "at-the-market",
    title: "At the Market",
    description:
      "Read the text about a weekend market and fill in the missing words.",
    questions: 8,
    tag: "Fill in Blanks",
    image: "/topics/reading/a1/at-the-market.jpg",
    isNew: true,
  },
];

export default function ReadingA1Page() {
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
            <a className="hover:text-white transition" href="/reading">Reading</a>{" "}
            <span className="text-white/35">/</span>{" "}
            <span className="text-white/90">A1</span>
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
            A1 Reading <span className="text-[#F5DA20]">Exercises</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/55 text-base leading-relaxed">
            Beginner level — short texts, personal profiles and simple stories with
            comprehension tasks to build your reading confidence.
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
              const active = lvl === "A1";
              return (
                <a
                  key={lvl}
                  href={href}
                  className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold transition ${
                    active
                      ? "bg-[#F5DA20] text-black shadow-sm"
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
              <p className="font-bold text-white text-sm">How to practise</p>
              <p className="mt-0.5 text-sm text-white/45">
                Read the text carefully once. Then try to answer the questions without
                looking back. Check your answers and read again to understand any mistakes.
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

                      {/* A1 badge */}
                      <div className="absolute top-3 left-3 rounded-full bg-[#F5DA20] px-3 py-1 text-xs font-black text-black shadow-lg">
                        A1
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
                          href={`/reading/a1/${ex.slug}`}
                          className="absolute inset-0 z-10"
                          aria-label={`Start ${ex.title}`}
                        />

                        <button
                          type="button"
                          className="relative z-20 inline-flex items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-bold text-black hover:opacity-90 transition"
                        >
                          Start Exercise
                        </button>

                        <span className="relative z-20 text-xs text-white/40">
                          {ex.questions} questions
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Mobile ad placeholder */}
              <div className="mt-8 lg:hidden rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-white/50">ADVERTISEMENT</div>
                <div className="mt-3 h-[250px] rounded-xl border border-white/10 bg-black/30 flex items-center justify-center text-white/20 text-sm">
                  Ad
                </div>
              </div>
            </section>

            {/* Sidebar ad (300x600) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-4 will-change-transform">
                <div className="text-xs font-semibold text-white/50">ADVERTISEMENT</div>
                <div className="mt-3 h-[600px] rounded-xl border border-white/10 bg-black/30 flex items-center justify-center text-white/20 text-sm">
                  Ad
                </div>
              </div>
            </aside>
          </div>

        </div>
      </div>
    </main>
  );
}
