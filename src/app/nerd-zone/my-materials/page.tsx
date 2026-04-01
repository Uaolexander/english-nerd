import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Materials — Nerd Zone — English Nerd",
  description: "Free PDF materials for learning English — speaking games, grammar guides, irregular verbs and more, curated by Oleksandr.",
  alternates: { canonical: "/nerd-zone/my-materials" },
};

const BASE = "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/public/materials";

const MATERIALS = [
  {
    title: "Speak Up: Speaking Games",
    file: "Speaking%20games.pdf",
    emoji: "🎲",
    color: "bg-emerald-400",
    label: "Games",
    tags: ["Speaking", "Group activity", "All levels"],
    description:
      "10 engaging speaking games and 200 prompts — Never Have I Ever, This or That, Would You Rather, Tell Me a Story and more. Perfect for playing with friends or using in class.",
  },
  {
    title: "100 Most Common English Mistakes",
    file: "100%20Most%20Common%20English%20Mistakes.pdf",
    emoji: "❌",
    color: "bg-red-400",
    label: "Grammar",
    tags: ["Grammar", "Word choice", "Prepositions"],
    description:
      "A practical guide to the 100 mistakes learners make most often. Covers grammar, word choice, prepositions and more — great for self-study and for teachers working with students.",
  },
  {
    title: "Irregular Verbs",
    file: "Irregular%20Verbs.pdf",
    emoji: "🔁",
    color: "bg-sky-400",
    label: "Verbs",
    tags: ["Grammar", "Printable", "B1–B2"],
    description:
      "25 key irregular verbs with plenty of exercises. Printable in colour or black-and-white, includes a 'Find the Mistake' drill to sharpen accuracy.",
  },
  {
    title: "Look, Think, Speak!",
    file: "Look%2C%20Think%2C%20Speak!.pdf",
    emoji: "🖼️",
    color: "bg-violet-400",
    label: "Speaking",
    tags: ["Speaking", "Vocabulary", "Description"],
    description:
      "Picture-description tasks with vocabulary hints and model answers. A great warm-up for speaking lessons — learners describe what they see using guided vocabulary.",
  },
  {
    title: "Never Have I Ever",
    file: "Never%20have%20I%20ever.pdf",
    emoji: "🃏",
    color: "bg-orange-400",
    label: "Games",
    tags: ["Speaking", "Group activity", "Printable"],
    description:
      "75 ready-made 'Never Have I Ever' cards to print and cut out. A fun way to practise English with friends or kick off a lesson with real conversation.",
  },
];

export default function MyMaterialsPage() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/6 blur-[160px]" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/3 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">

        {/* Breadcrumb */}
        <nav className="text-sm text-white/50">
          <a href="/" className="hover:text-white/80 transition">Home</a>
          <span className="mx-2 text-white/25">/</span>
          <a href="/nerd-zone" className="hover:text-white/80 transition">Nerd Zone</a>
          <span className="mx-2 text-white/25">/</span>
          <span className="text-white/75">My Materials</span>
        </nav>

        {/* Hero */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">Free</span>
            <span className="rounded-full border border-white/15 px-3 py-0.5 text-[11px] font-semibold text-white/40">PDF</span>
            <span className="rounded-full border border-white/15 px-3 py-0.5 text-[11px] font-semibold text-white/40">{MATERIALS.length} materials</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            My{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Materials</span>
              <span aria-hidden className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30" />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/55">
            Handpicked PDF resources — games, grammar guides and speaking activities. All free to download and use.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {MATERIALS.map((m) => (
            <div
              key={m.file}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40"
            >
              {/* Top accent bar */}
              <div className={`h-1 w-full ${m.color}`} />

              <div className="flex flex-1 flex-col p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl">
                      {m.emoji}
                    </div>
                    <div>
                      <h2 className="text-base font-black leading-snug text-white">{m.title}</h2>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-black text-black ${m.color}`}>
                        {m.label}
                      </span>
                    </div>
                  </div>
                  {/* PDF icon */}
                  <div className="shrink-0 text-white/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <path d="M14 2v6h6"/>
                      <path d="M9 13h6M9 17h4"/>
                    </svg>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm leading-relaxed text-white/55 flex-1">
                  {m.description}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {m.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] font-medium text-white/40">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Download button */}
                <div className="mt-5">
                  <a
                    href={`${BASE}/${m.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-5 py-2.5 text-sm font-black text-black transition hover:opacity-90 active:scale-[0.98]"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="mt-10 border-t border-white/8 pt-6">
          <a
            href="/nerd-zone"
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/50 hover:bg-white/10 hover:text-white transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
        </div>

      </div>
    </main>
  );
}
