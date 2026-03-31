import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slang — Nerd Zone — English Nerd",
  description:
    "Modern informal English slang from 2024–2025. Understand it, use it wisely.",
  alternates: { canonical: "/nerd-zone/slang" },
};

type Level = "A2" | "B1" | "B2";

function levelColor(level: Level) {
  if (level === "A2") return { bg: "bg-emerald-400", text: "text-black" };
  if (level === "B1") return { bg: "bg-sky-400", text: "text-black" };
  if (level === "B2") return { bg: "bg-orange-400", text: "text-black" };
  return { bg: "bg-white/20", text: "text-white" };
}

const SLANG: { word: string; level: Level; meaning: string; example: string }[] = [
  {
    word: "lowkey",
    level: "B1",
    meaning: "Slightly, or secretly",
    example: "I'm lowkey obsessed with this show.",
  },
  {
    word: "slay",
    level: "B1",
    meaning: "To do something impressively well",
    example: "She absolutely slayed that presentation.",
  },
  {
    word: "no cap",
    level: "A2",
    meaning: "No lie / I'm being serious",
    example: "That's the best pizza I've ever had, no cap.",
  },
  {
    word: "hits different",
    level: "B1",
    meaning: "Feels uniquely good, often with emotion",
    example: "Coffee at sunrise hits different.",
  },
  {
    word: "vibe",
    level: "A2",
    meaning: "The feeling or atmosphere of a place or person",
    example: "I love the vibe of this café.",
  },
  {
    word: "goated",
    level: "B2",
    meaning: "Being the Greatest of All Time (GOAT)",
    example: "His last album was goated — pure perfection.",
  },
  {
    word: "rent-free",
    level: "B2",
    meaning: "Living in your head constantly",
    example: "That song has been rent-free in my head all week.",
  },
  {
    word: "bussin",
    level: "A2",
    meaning: "Extremely good (usually food)",
    example: "This ramen is absolutely bussin.",
  },
];

export default function SlangPage() {
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
          <span className="text-white/70">Slang</span>
        </div>

        {/* Hero */}
        <div className="mt-6">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Slang</span>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30"
              />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/45">
            Modern informal English. Understand it, use it wisely.
          </p>
        </div>

        {/* Warning note */}
        <div className="mt-10 rounded-2xl border border-[#F5DA20]/20 bg-[#F5DA20]/5 px-5 py-4 text-sm text-white/55">
          ⚠️ Slang changes fast and is context-sensitive. These words are widely used in 2024–2025 English-speaking internet and conversation.
        </div>

        {/* Cards grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SLANG.map((s) => {
            const { bg, text } = levelColor(s.level);
            return (
              <div
                key={s.word}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-pink-400/30 hover:bg-pink-400/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-pink-300">{s.word}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${bg} ${text}`}>
                    {s.level}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/60">{s.meaning}</p>
                <p className="mt-2 text-xs italic text-white/40">{s.example}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
