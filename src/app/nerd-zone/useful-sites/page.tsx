import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Useful Websites — Best Tools for Learning English | English Nerd",
  description: "The best websites and tools for learning English — pronunciation, vocabulary, games and speaking practice. Hand-picked for real learners.",
  keywords: ["useful websites for learning English", "YouGlish", "Quizlet", "PlayPhrase", "English learning tools", "English pronunciation websites"],
  alternates: { canonical: "/nerd-zone/useful-sites" },
  openGraph: {
    title: "Useful Websites — Best Tools for Learning English | English Nerd",
    description: "Hand-picked websites and tools for pronunciation, vocabulary, games and speaking practice.",
    url: "https://englishnerd.cc/nerd-zone/useful-sites",
    type: "article",
  },
};

type Tag = "Pronunciation" | "Listening" | "Vocabulary" | "Games" | "Speaking" | "YouTube";

const TAG_STYLE: Record<Tag, string> = {
  "Pronunciation": "bg-sky-100 text-sky-700",
  "Listening":     "bg-violet-100 text-violet-700",
  "Vocabulary":    "bg-emerald-100 text-emerald-700",
  "Games":         "bg-orange-100 text-orange-700",
  "Speaking":      "bg-pink-100 text-pink-700",
  "YouTube":       "bg-red-100 text-red-700",
};

const SITES: {
  image: string;
  name: string;
  url: string;
  displayUrl: string;
  tags: Tag[];
  description: string;
}[] = [
  {
    image: "youglish.jpg",
    name: "YouGlish",
    url: "https://youglish.com",
    displayUrl: "youglish.com",
    tags: ["Pronunciation", "Listening"],
    description: "Type any word and hear it pronounced in thousands of real YouTube videos — with context. The fastest way to nail pronunciation and natural usage.",
  },
  {
    image: "playphrase.jpg",
    name: "PlayPhrase",
    url: "https://playphrase.me",
    displayUrl: "playphrase.me",
    tags: ["Listening", "Speaking"],
    description: "Search a phrase and instantly watch dozens of film and TV clips where it's said. See exactly how native speakers use expressions in real life.",
  },
  {
    image: "quizlet.jpg",
    name: "Quizlet",
    url: "https://quizlet.com",
    displayUrl: "quizlet.com",
    tags: ["Vocabulary", "Games"],
    description: "The world's most popular flashcard tool. Create sets, study with games and tests — perfect for building and reviewing vocabulary at any level.",
  },
  {
    image: "bamboozle.jpg",
    name: "Bamboozle",
    url: "https://bamboozle.io",
    displayUrl: "bamboozle.io",
    tags: ["Games", "Vocabulary"],
    description: "Fun team-based quiz games for classrooms and self-study. Thousands of ready-made English games — or build your own in minutes.",
  },
  {
    image: "blooket.jpg",
    name: "Blooket",
    url: "https://blooket.com",
    displayUrl: "blooket.com",
    tags: ["Games", "Vocabulary"],
    description: "Addictive classroom games that make vocabulary review genuinely fun. Students compete in real time — a teacher favourite for engagement.",
  },
  {
    image: "ted-ed.jpg",
    name: "TED-Ed",
    url: "https://www.youtube.com/@TEDEd",
    displayUrl: "youtube.com/@TEDEd",
    tags: ["YouTube", "Listening"],
    description: "Short, beautifully animated lessons on science, history, language and philosophy — clear academic English with rich vocabulary in just 5 minutes.",
  },
  {
    image: "rachels-english.jpg",
    name: "Rachel's English",
    url: "https://www.youtube.com/@rachelsenglish",
    displayUrl: "youtube.com/@rachelsenglish",
    tags: ["YouTube", "Pronunciation"],
    description: "The gold standard for American English pronunciation on YouTube. Rachel breaks down every sound, stress pattern and connected speech feature in detail.",
  },
];

export default async function UsefulSitesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">Useful Websites</span>
        </nav>

        {/* Hero */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-cyan-100 px-3 py-0.5 text-[11px] font-black text-cyan-700">Tools</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">7 resources</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Useful{" "}
            <span className="relative inline-block">
              Websites
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            The best tools serious English learners actually use — pronunciation, vocabulary games, speaking practice and more.
          </p>
        </div>

        {/* Ad */}
        <div className="mt-8">
          <AdUnit variant="inline-light" />
        </div>

        {/* Cards grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SITES.map((site, idx) => {
            const locked = idx > 0 && !isPro;
            return (
              <div key={site.name} className="relative flex flex-col">

                {/* Card */}
                <div className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-full transition-all duration-200 ${locked ? "pointer-events-none select-none" : "hover:-translate-y-1 hover:shadow-md"}`}>

                  {/* Screenshot */}
                  <div className={`relative h-44 overflow-hidden bg-slate-100 shrink-0 ${locked ? "blur-[14px] saturate-0 scale-105" : ""}`}>
                    <img
                      src={`/topics/nerd-zone/useful-sites/${site.image}`}
                      alt={site.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Card body */}
                  <div className={`flex flex-col flex-1 p-5 ${locked ? "blur-[3px] saturate-50 opacity-60" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-base font-black text-slate-900 leading-tight">{site.name}</div>
                      <div className="flex flex-wrap gap-1 shrink-0">
                        {site.tags.map((tag) => (
                          <span key={tag} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TAG_STYLE[tag]}`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">{site.displayUrl}</div>
                    <p className="mt-2.5 text-sm text-slate-500 leading-relaxed flex-1">{site.description}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>

                {/* Pro overlay */}
                {locked && (
                  <a
                    href="/pro"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/50 backdrop-blur-[2px] transition hover:bg-white/60"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5DA20] shadow-lg">
                      <svg className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black text-slate-900">Pro only</div>
                      <div className="mt-0.5 text-xs text-slate-500">Upgrade to see all websites</div>
                    </div>
                    <span className="rounded-xl bg-[#F5DA20] px-4 py-2 text-xs font-black text-black shadow-sm hover:bg-[#e8cf00] transition">
                      Get Pro →
                    </span>
                  </a>
                )}

              </div>
            );
          })}
        </div>

        {/* Pro banner (shown only to non-Pro) */}
        {!isPro && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#F5DA20]/10 border border-[#F5DA20]/25 px-6 py-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20]">
                <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Unlock all 7 websites with Pro</p>
                <p className="text-xs text-slate-500">Plus no ads, streak freeze, certificates and all PDF materials</p>
              </div>
            </div>
            <a
              href="/pro"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-5 py-2.5 text-sm font-black text-black transition hover:bg-[#e8cf00] hover:shadow-[0_0_20px_rgba(245,218,32,0.35)]"
            >
              Get Pro
            </a>
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-10 border-t border-slate-100 pt-6">
          <a href="/nerd-zone" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
        </div>

      </div>
    </div>
  );
}
