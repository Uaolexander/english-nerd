import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata = {
  title: "English Listening Practice — English Nerd",
  description:
    "Improve your English listening skills from A1 to C1. Real-life audio exercises, dialogues and comprehension tasks graded by level.",
  alternates: { canonical: "/listening" },
};

type Level = {
  lvl: string;
  label: string;
  description: string;
  topics: number;
  color: string;
  comingSoon?: boolean;
};

const LEVELS: Level[] = [
  {
    lvl: "A1",
    label: "Beginner",
    description: "Short, slow dialogues: introductions, numbers, simple questions and answers.",
    topics: 15,
    color: "bg-[#F5DA20]",
    comingSoon: true,
  },
  {
    lvl: "A2",
    label: "Elementary",
    description: "Everyday situations: at a café, asking for directions, phone calls.",
    topics: 16,
    color: "bg-emerald-400",
    comingSoon: true,
  },
  {
    lvl: "B1",
    label: "Intermediate",
    description: "Natural-speed conversations, interviews, short podcasts and news summaries.",
    topics: 18,
    color: "bg-violet-400",
    comingSoon: true,
  },
  {
    lvl: "B2",
    label: "Upper-Intermediate",
    description: "Authentic audio: debates, lectures, radio programmes and TED-style talks.",
    topics: 16,
    color: "bg-orange-400",
  },
  {
    lvl: "C1",
    label: "Advanced",
    description: "Complex academic and professional audio with implicit meaning and fast speech.",
    topics: 14,
    color: "bg-sky-400",
    comingSoon: true,
  },
];

function LevelCard({ lvl }: { lvl: Level }) {
  return (
    <article className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 ${lvl.comingSoon ? "opacity-60" : "hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"}`}>
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-white/10 bg-black/30">
        <ImageWithFallback
          src={`/topics/listening/${lvl.lvl.toLowerCase()}.jpg`}
          alt={`${lvl.lvl} Listening`}
          className={`h-full w-full object-cover ${lvl.comingSoon ? "grayscale" : ""}`}
        />
        <div className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-black text-black shadow-lg sm:top-3 sm:right-3 sm:px-3 sm:py-1 sm:text-xs ${lvl.comingSoon ? "bg-white/40" : lvl.color}`}>
          {lvl.lvl}
        </div>
        {lvl.comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-xl bg-black/60 px-3 py-1.5 text-xs font-black text-white/80 backdrop-blur-sm">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <h3 className="text-sm font-black leading-snug text-white sm:text-xl">
          {lvl.lvl} — {lvl.label}
        </h3>
        <p className="mt-1 text-[11px] text-white/55 leading-relaxed sm:mt-2 sm:text-sm">
          {lvl.description}
        </p>

        <div className="mt-3 sm:mt-4">
          {!lvl.comingSoon && (
            <a
              href={`/listening/${lvl.lvl.toLowerCase()}`}
              className="absolute inset-0 z-10"
              aria-label={`${lvl.lvl} ${lvl.label} Listening`}
            />
          )}
          <p className="relative z-20 mb-3 text-[10px] text-white/30 sm:text-[11px]">
            {lvl.topics} exercises
          </p>
          {lvl.comingSoon ? (
            <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white/40 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm">
              🔒 Coming Soon
            </span>
          ) : (
            <a
              href={`/listening/${lvl.lvl.toLowerCase()}`}
              className={`relative z-20 inline-flex items-center justify-center rounded-lg ${lvl.color} px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm`}
            >
              Start
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ListeningPage() {
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
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2 text-white/35">/</span>
          <span className="text-white/70">Listening</span>
        </div>

        {/* Hero */}
        <div className="mt-6">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Listening</span>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30"
              />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-white/45 text-base leading-relaxed">
            Real audio. Real English. Comprehension exercises from A1 to C1 — train your ear at exactly the right level.
          </p>
        </div>

        {/* Level overview bar */}
        <div className="mt-10 flex items-center gap-0 overflow-hidden rounded-2xl border border-white/8">
          {[
            { label: "A1", sub: "Beginner",     color: "bg-[#F5DA20]/15",   dot: "bg-[#F5DA20]" },
            { label: "A2", sub: "Elementary",    color: "bg-emerald-400/10", dot: "bg-emerald-400" },
            { label: "B1", sub: "Intermediate",  color: "bg-violet-400/10",  dot: "bg-violet-400" },
            { label: "B2", sub: "Upper-Int",     color: "bg-orange-400/10",  dot: "bg-orange-400" },
            { label: "C1", sub: "Advanced",      color: "bg-sky-400/10",     dot: "bg-sky-400" },
          ].map(({ label, sub, color, dot }, i) => (
            <div
              key={label}
              className={`flex flex-1 flex-col items-center gap-1 py-4 ${color} ${i > 0 ? "border-l border-white/8" : ""}`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                <span className="text-sm font-black text-white">{label}</span>
              </div>
              <span className="hidden text-[10px] text-white/35 sm:block">{sub}</span>
            </div>
          ))}
        </div>

        {/* Tip card */}
        <div className="mt-10 flex items-start gap-4 overflow-hidden rounded-2xl border border-[#F5DA20]/25 bg-[#F5DA20]/8 px-6 py-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20] text-xl shadow-md">🎧</span>
          <div>
            <p className="font-black text-white">How to use listening exercises</p>
            <p className="mt-0.5 text-sm text-white/50">
              Listen once without pausing. Then answer the questions. Finally, listen again while reading the transcript to check your understanding.
            </p>
          </div>
        </div>

        {/* Level cards — grid on all screens */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((lvl) => (
            <LevelCard key={lvl.lvl} lvl={lvl} />
          ))}
        </div>

      </div>
    </main>
  );
}
