import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Materials — Nerd Zone — English Nerd",
  description: "PDF materials for learning English — speaking games, grammar guides, irregular verbs and more, curated by Oleksandr.",
  alternates: { canonical: "/nerd-zone/my-materials" },
};

const MATERIALS = [
  {
    title: "Speak Up: Speaking Games",
    url: "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/Speaking%20games.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvU3BlYWtpbmcgZ2FtZXMucGRmIiwiaWF0IjoxNzc1MDc4OTY1LCJleHAiOjE5MzI3NTg5NjV9.2yFIgGqN1mK9BlXBb43cFCbsIdr3F2BfUtWJxs_gPrc",
    emoji: "🎲",
    accent: "#34d399",
    accentClass: "bg-emerald-400",
    label: "Games",
    tags: ["Speaking", "Group activity", "All levels"],
    description: "10 engaging speaking games and 200 prompts — Never Have I Ever, This or That, Would You Rather, Tell Me a Story and more. Perfect for playing with friends or using in class.",
  },
  {
    title: "100 Most Common English Mistakes",
    url: "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/100%20Most%20Common%20English%20Mistakes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvMTAwIE1vc3QgQ29tbW9uIEVuZ2xpc2ggTWlzdGFrZXMucGRmIiwiaWF0IjoxNzc1MDc4ODIyLCJleHAiOjE5MzI3NTg4MjJ9.j7L0e1uHbb7kfFUCK3VZBceYUoAbEC6sQp8v3Z3js4I",
    emoji: "❌",
    accent: "#f87171",
    accentClass: "bg-red-400",
    label: "Grammar",
    tags: ["Grammar", "Word choice", "Prepositions"],
    description: "A practical guide to the 100 mistakes English learners make most often. Covers grammar, word choice, prepositions and more — great for self-study and for teachers.",
  },
  {
    title: "Irregular Verbs",
    url: "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/Irregular%20Verbs.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvSXJyZWd1bGFyIFZlcmJzLnBkZiIsImlhdCI6MTc3NTA3OTQ0OSwiZXhwIjoxOTMyNzU5NDQ5fQ.XF3xF8BRNO0OvzlWEdCVTqaH_NcN_uN5knRlJI-A41E",
    emoji: "🔁",
    accent: "#38bdf8",
    accentClass: "bg-sky-400",
    label: "Verbs",
    tags: ["Grammar", "Printable", "B1–B2"],
    description: "25 key irregular verbs with exercises. Printable in colour or black-and-white. Includes a 'Find the Mistake' drill to sharpen accuracy.",
  },
  {
    title: "Look, Think, Speak!",
    url: "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/Look,%20Think,%20Speak!.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvTG9vaywgVGhpbmssIFNwZWFrIS5wZGYiLCJpYXQiOjE3NzUwNzk0NzYsImV4cCI6MTkzMjc1OTQ3Nn0.q9luvGZfdTxGz6WuHOXEXqpAEd0P6f34H81eXP9mlRY",
    emoji: "🖼️",
    accent: "#a78bfa",
    accentClass: "bg-violet-400",
    label: "Speaking",
    tags: ["Speaking", "Vocabulary", "Description"],
    description: "Picture-description tasks with vocabulary hints and model answers. Learners describe what they see using guided vocabulary — ideal for teachers and students.",
  },
  {
    title: "Never Have I Ever",
    url: "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/Never%20have%20I%20ever.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvTmV2ZXIgaGF2ZSBJIGV2ZXIucGRmIiwiaWF0IjoxNzc1MDc5NDk3LCJleHAiOjE5MzI3NTk0OTd9.wZ0NBiEayuxsqhxpohO7hZpsUkmorM878A2gOnWKnsw",
    emoji: "🃏",
    accent: "#fb923c",
    accentClass: "bg-orange-400",
    label: "Games",
    tags: ["Speaking", "Group activity", "Printable"],
    description: "75 'Never Have I Ever' cards to print, cut out and play. A natural way to spark real English conversation — perfect for classes and friend groups alike.",
  },
];

export default function MyMaterialsPage() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">

      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#F5DA20]/6 blur-[180px]" />
        <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-violet-500/4 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12">

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
          <div className="flex flex-wrap items-center gap-2 mb-4">
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
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/50">
            Handpicked resources — games, grammar guides and speaking activities. Download and use straight away.
          </p>
        </div>

        {/* Material rows */}
        <div className="mt-10 space-y-4">
          {MATERIALS.map((m, i) => (
            <a
              key={m.title}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="group flex items-center gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50"
            >
              {/* Left — cover panel */}
              <div
                className="relative flex h-[120px] w-[120px] shrink-0 flex-col items-center justify-center gap-2 sm:h-[140px] sm:w-[160px]"
                style={{ background: `linear-gradient(135deg, ${m.accent}22 0%, ${m.accent}08 100%)` }}
              >
                {/* Number */}
                <span className="absolute top-3 left-3 text-[11px] font-black text-white/20 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Emoji */}
                <span className="text-4xl sm:text-5xl select-none">{m.emoji}</span>
                {/* Label badge */}
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black text-black ${m.accentClass}`}>
                  {m.label}
                </span>
                {/* Right border accent */}
                <div className="absolute right-0 top-0 h-full w-[3px]" style={{ background: m.accent, opacity: 0.5 }} />
              </div>

              {/* Right — content */}
              <div className="flex flex-1 items-center justify-between gap-4 px-5 py-5 min-w-0">
                <div className="min-w-0">
                  <h2 className="text-base font-black text-white leading-snug sm:text-lg">{m.title}</h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/50 sm:text-sm line-clamp-2">
                    {m.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[10px] font-medium text-white/35">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Download arrow */}
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5DA20]/10 border border-[#F5DA20]/20 text-[#F5DA20] transition group-hover:bg-[#F5DA20] group-hover:text-black group-hover:border-transparent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
              </div>
            </a>
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
