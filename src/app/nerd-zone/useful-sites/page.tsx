import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Useful Websites — Nerd Zone — English Nerd",
  description:
    "The best tools serious English learners actually use — dictionaries, pronunciation, flashcards and more.",
  alternates: { canonical: "/nerd-zone/useful-sites" },
};

const SITES = [
  {
    icon: "🎙️",
    name: "BBC Learning English",
    url: "https://www.bbc.co.uk/learningenglish",
    displayUrl: "bbc.co.uk/learningenglish",
    description:
      "News-based lessons, grammar videos and pronunciation guides from the BBC.",
  },
  {
    icon: "📖",
    name: "Cambridge Dictionary",
    url: "https://dictionary.cambridge.org",
    displayUrl: "dictionary.cambridge.org",
    description:
      "The most authoritative dictionary for learners. Includes examples, pronunciation and level tags.",
  },
  {
    icon: "🎬",
    name: "YouGlish",
    url: "https://youglish.com",
    displayUrl: "youglish.com",
    description:
      "Hear any word pronounced in real YouTube videos. Perfect for natural English.",
  },
  {
    icon: "🔊",
    name: "Forvo",
    url: "https://forvo.com",
    displayUrl: "forvo.com",
    description:
      "Native speakers pronounce any word in any language. Great for tricky proper nouns.",
  },
  {
    icon: "🧠",
    name: "Anki",
    url: "https://apps.ankiweb.net",
    displayUrl: "apps.ankiweb.net",
    description:
      "Free spaced-repetition flashcard app. The best tool for remembering vocabulary long-term.",
  },
  {
    icon: "🏛️",
    name: "Oxford Learner's Dictionary",
    url: "https://www.oxfordlearnersdictionaries.com",
    displayUrl: "oxfordlearnersdictionaries.com",
    description:
      "Oxford's learner-focused dictionary with word families and collocations.",
  },
];

export default function UsefulSitesPage() {
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
          <span className="text-white/70">Useful Websites</span>
        </div>

        {/* Hero */}
        <div className="mt-6">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Useful{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Websites</span>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30"
              />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/45">
            The best tools serious English learners actually use.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SITES.map((site) => (
            <a
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#F5DA20]/30 hover:bg-[#F5DA20]/5"
            >
              {/* Icon */}
              <div className="text-4xl">{site.icon}</div>

              {/* Name + URL */}
              <div className="mt-4">
                <div className="font-black text-white">{site.name}</div>
                <div className="mt-0.5 text-xs text-white/40">{site.displayUrl}</div>
              </div>

              {/* Description */}
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">
                {site.description}
              </p>

              {/* Open link */}
              <div className="mt-4 text-right text-xs text-white/30 transition group-hover:text-[#F5DA20]/70">
                Open →
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
