import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recommendations — Nerd Zone — English Nerd",
  description:
    "Books, podcasts, YouTube channels and films that genuinely improve your English.",
  alternates: { canonical: "/nerd-zone/recommendations" },
};

type Level = "B1" | "B2";

function levelColor(level: Level) {
  if (level === "B1") return { bg: "bg-sky-400", text: "text-black" };
  if (level === "B2") return { bg: "bg-orange-400", text: "text-black" };
  return { bg: "bg-white/20", text: "text-white" };
}

const RECS: {
  icon: string;
  title: string;
  author: string;
  level: Level;
  description: string;
  category: string;
}[] = [
  {
    icon: "📗",
    title: "The Alchemist",
    author: "Paulo Coelho",
    level: "B1",
    description:
      "Beautifully simple English. A philosophical adventure story that's impossible to put down.",
    category: "Book",
  },
  {
    icon: "📘",
    title: "Animal Farm",
    author: "George Orwell",
    level: "B2",
    description:
      "Short, clear prose. A political allegory that rewards every re-read.",
    category: "Book",
  },
  {
    icon: "🎙️",
    title: "6 Minute English",
    author: "BBC Learning English",
    level: "B1",
    description:
      "Real news topics discussed in plain English. Perfect for daily listening practice.",
    category: "Podcast",
  },
  {
    icon: "🎧",
    title: "All Ears English",
    author: "Lindsay & Michelle",
    level: "B2",
    description:
      "Natural American English conversations about real life. Great for fluency.",
    category: "Podcast",
  },
  {
    icon: "▶️",
    title: "TED-Ed",
    author: "TED",
    level: "B2",
    description:
      "5-minute animated lessons on everything. Visual learning at its best.",
    category: "YouTube",
  },
  {
    icon: "🎬",
    title: "The Social Network",
    author: "David Fincher",
    level: "B2",
    description:
      "Fast, intelligent dialogue. Excellent example of contemporary American English.",
    category: "Film",
  },
];

export default function RecommendationsPage() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/6 blur-[150px]" />
        <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/4 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-amber-500/4 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-white/40">
          <a href="/" className="transition hover:text-white">Home</a>
          <span className="mx-2 text-white/20">/</span>
          <a href="/nerd-zone" className="transition hover:text-white">Nerd Zone</a>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">Recommendations</span>
        </div>

        {/* Hero */}
        <div className="mt-6">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Recommendations</span>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30"
              />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/45">
            Books, podcasts, YouTube channels and films that genuinely improve your English.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RECS.map((r) => {
            const { bg, text } = levelColor(r.level);
            return (
              <div
                key={r.title}
                className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#F5DA20]/25 hover:bg-[#F5DA20]/5"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl leading-none">{r.icon}</span>
                    <div>
                      <div className="font-black text-white leading-tight">{r.title}</div>
                      <div className="mt-0.5 text-xs text-white/45">{r.author}</div>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black ${bg} ${text}`}
                  >
                    {r.level}
                  </span>
                </div>

                {/* Description */}
                <p className="flex-1 text-sm leading-relaxed text-white/55">
                  {r.description}
                </p>

                {/* Category pill */}
                <div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[11px] font-bold text-white/40">
                    {r.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
