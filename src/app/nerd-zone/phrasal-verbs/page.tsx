import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phrasal Verbs — Nerd Zone — English Nerd",
  description:
    "High-frequency verb + particle combinations with meanings and real examples every fluent speaker uses.",
  alternates: { canonical: "/nerd-zone/phrasal-verbs" },
};

const PHRASAL_VERBS = [
  {
    verb: "give up",
    meaning: "to stop trying; to quit",
    example: "Don't give up — you're so close!",
  },
  {
    verb: "figure out",
    meaning: "to understand or solve something",
    example: "I finally figured out how to fix the bug.",
  },
  {
    verb: "come across",
    meaning: "to find or meet by chance",
    example: "I came across this book at a second-hand shop.",
  },
  {
    verb: "put off",
    meaning: "to delay or postpone",
    example: "Stop putting off the conversation — just do it.",
  },
  {
    verb: "bring up",
    meaning: "to mention a topic; to raise a child",
    example: "She brought up the salary issue at the end.",
  },
  {
    verb: "look into",
    meaning: "to investigate or research something",
    example: "We're looking into the problem right now.",
  },
  {
    verb: "run into",
    meaning: "to meet someone unexpectedly",
    example: "I ran into my old teacher at the supermarket.",
  },
  {
    verb: "carry on",
    meaning: "to continue",
    example: "Carry on — I'm listening.",
  },
  {
    verb: "turn down",
    meaning: "to reject; to reduce volume/heat",
    example: "She turned down the job offer.",
  },
  {
    verb: "get over",
    meaning: "to recover from something",
    example: "It took him months to get over the breakup.",
  },
  {
    verb: "set up",
    meaning: "to establish or arrange something",
    example: "They set up the meeting for Friday.",
  },
  {
    verb: "go through",
    meaning: "to experience something difficult",
    example: "She went through a lot last year.",
  },
];

export default function PhrasalVerbsPage() {
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
          <span className="text-white/70">Phrasal Verbs</span>
        </div>

        {/* Hero */}
        <div className="mt-6">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Phrasal</span>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30"
              />
            </span>{" "}
            Verbs
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/45">
            Verb + particle combinations that every fluent speaker uses.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PHRASAL_VERBS.map((pv) => (
            <div
              key={pv.verb}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-[#F5DA20]/25 hover:bg-[#F5DA20]/5"
            >
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="text-xl font-black text-[#F5DA20]">{pv.verb}</span>
                <span className="ml-1 text-sm text-white/60">— {pv.meaning}</span>
              </div>
              <p className="mt-2 text-sm italic text-white/45">{pv.example}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
