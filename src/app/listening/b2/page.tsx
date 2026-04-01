import type { Metadata } from "next";
import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata: Metadata = {
  title: "B2 Listening Practice — English Nerd",
  description:
    "B2 Upper-Intermediate listening exercises. Authentic dialogues, TED-style talks and real-world conversations with comprehension tasks.",
  alternates: { canonical: "/listening/b2" },
};

type Exercise = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  tag: string;
  image: string;
  isNew?: boolean;
};

const EXERCISES: Exercise[] = [
  {
    slug: "work-life-balance",
    title: "Work-Life Balance",
    description:
      "A conversation about burnout, long working hours and finding a healthier balance between career and personal life.",
    duration: "~4 min",
    tag: "Dialogue",
    image: "/topics/listening/b2/work-life-balance.jpg",
    isNew: true,
  },
];

export default function ListeningB2Page() {
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
            <a className="hover:text-white transition" href="/listening">Listening</a>{" "}
            <span className="text-white/35">/</span>{" "}
            <span className="text-white/90">B2</span>
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
            B2 Listening <span className="text-[#F5DA20]">Exercises</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/55 text-base leading-relaxed">
            Upper-Intermediate level — authentic dialogues, debates and real-world conversations
            with comprehension tasks.
          </p>

          {/* Level switcher */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { lvl: "A1", href: "/listening/a1" },
              { lvl: "A2", href: "/listening/a2" },
              { lvl: "B1", href: "/listening/b1" },
              { lvl: "B2", href: "/listening/b2" },
              { lvl: "C1", href: "/listening/c1" },
            ].map(({ lvl, href }) => {
              const active = lvl === "B2";
              return (
                <a
                  key={lvl}
                  href={href}
                  className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold transition ${
                    active
                      ? "bg-orange-400 text-black shadow-sm"
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
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20]/20 text-lg">🎧</span>
            <div>
              <p className="font-bold text-white text-sm">How to practise</p>
              <p className="mt-0.5 text-sm text-white/45">
                Watch the video once without pausing. Then answer the True / False questions. Finally, read the transcript to check your understanding.
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
              <div className="grid gap-6 sm:grid-cols-2">
                {EXERCISES.map((ex) => (
                  <article
                    key={ex.slug}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                      <ImageWithFallback
                        src={ex.image}
                        alt={ex.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition duration-300 group-hover:opacity-100">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5DA20] shadow-lg">
                          <svg className="h-6 w-6 translate-x-0.5 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      {/* Badges */}
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className="rounded-full bg-orange-400 px-2.5 py-0.5 text-[10px] font-black text-black">B2</span>
                        <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-0.5 text-[10px] font-semibold text-white/80 backdrop-blur-sm">
                          {ex.tag}
                        </span>
                      </div>
                      {ex.isNew && (
                        <span className="absolute right-3 top-3 rounded-full bg-emerald-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-black">
                          New
                        </span>
                      )}
                      {/* Duration */}
                      <span className="absolute bottom-2.5 right-3 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white/70 backdrop-blur-sm">
                        {ex.duration}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h2 className="text-lg font-black text-white leading-snug">{ex.title}</h2>
                      <p className="mt-2 text-sm text-white/45 leading-relaxed">{ex.description}</p>
                      <div className="mt-4 flex items-center gap-3">
                        <a
                          href={`/listening/b2/${ex.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-5 py-2.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                          Start Exercise
                        </a>
                        <span className="text-xs text-white/30">10 questions</span>
                      </div>
                    </div>

                    {/* Full card link */}
                    <a href={`/listening/b2/${ex.slug}`} className="absolute inset-0" aria-label={ex.title} />
                  </article>
                ))}

                {/* Coming soon placeholder */}
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-2xl">🎙️</div>
                  <p className="text-sm font-bold text-white/30">More exercises coming soon</p>
                  <p className="text-xs text-white/20">New dialogues and talks added regularly</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
