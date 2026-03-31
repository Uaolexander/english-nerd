import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Phrases — Nerd Zone — English Nerd",
  description:
    "Expressions native speakers use every day — natural, real-world English with meanings and examples.",
  alternates: { canonical: "/nerd-zone/live-phrases" },
};

const PHRASES = [
  {
    phrase: "That said…",
    meaning: "Despite what I just said… (introduces a contrast)",
    example: "It's a tough course. That said, I learned more than anywhere else.",
  },
  {
    phrase: "Fair enough",
    meaning: "I accept that / I understand",
    example: "— I can't come on Friday. — Fair enough, we'll reschedule.",
  },
  {
    phrase: "Bear with me",
    meaning: "Please be patient with me for a moment",
    example: "Bear with me — the file is taking a while to load.",
  },
  {
    phrase: "To be fair",
    meaning: "Used to add a balanced or honest point",
    example: "He was late, but to be fair, the traffic was terrible.",
  },
  {
    phrase: "It goes without saying",
    meaning: "It's obvious, but worth stating anyway",
    example: "It goes without saying that the client comes first.",
  },
  {
    phrase: "No wonder",
    meaning: "It makes perfect sense / It's not surprising",
    example: "You've been working 14-hour days. No wonder you're exhausted.",
  },
  {
    phrase: "By all means",
    meaning: "Of course / please go ahead",
    example: "— Can I borrow your pen? — By all means.",
  },
  {
    phrase: "On second thought",
    meaning: "After reconsidering",
    example: "I'll take the small one. On second thought, make it a large.",
  },
];

export default function LivePhrasesPage() {
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
          <span className="text-white/70">Live Phrases</span>
        </div>

        {/* Hero */}
        <div className="mt-6">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Live</span>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30"
              />
            </span>{" "}
            Phrases
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/45">
            Expressions native speakers use every day — natural, real-world English.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 flex flex-col gap-3">
          {PHRASES.map((p) => (
            <div
              key={p.phrase}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-5 transition hover:border-[#F5DA20]/25 hover:bg-[#F5DA20]/5"
            >
              <div className="text-xl font-black text-[#F5DA20]">{p.phrase}</div>
              <div className="mt-0.5 text-sm text-white/60">{p.meaning}</div>
              <div className="mt-2 border-l-2 border-[#F5DA20]/30 pl-3 text-sm italic text-white/45">
                {p.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
