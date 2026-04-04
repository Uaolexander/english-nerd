import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import DownloadWorksheet from "../DownloadWorksheet";

export const metadata: Metadata = {
  title: "Slang B2 — Upper-Intermediate English Slang | English Nerd",
  description: "Learn 12 popular B2 Gen Z and internet slang terms used in 2024–2025 English. Download a free printable worksheet with exercises and answer key.",
  keywords: ["English slang B2", "Gen Z slang", "internet slang 2024", "B2 informal English", "modern English slang"],
  alternates: { canonical: "/nerd-zone/slang/b2" },
  openGraph: {
    title: "Slang B2 — Upper-Intermediate English Slang | English Nerd",
    description: "12 popular B2 Gen Z slang terms + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/slang/b2",
    type: "article",
  },
};

const WORDS = [
  { word: "hits different",           meaning: "feels uniquely good, often with emotion",              example: "Listening to that song at sunset just hits different." },
  { word: "rent-free",                meaning: "living in your head constantly without effort",        example: "That song has been rent-free in my head all week." },
  { word: "goated",                   meaning: "being the greatest (from GOAT = Greatest of All Time)", example: "His last album was goated — pure perfection." },
  { word: "main character",           meaning: "acting as if you're the protagonist of your own story", example: "She walked in like she was the main character of a film." },
  { word: "it's giving…",             meaning: "it has the energy / vibe of something",               example: "That outfit? It's giving vintage 90s — love it." },
  { word: "rizz",                     meaning: "natural charm or ability to attract others",           example: "He has so much rizz — he makes everyone feel at ease." },
  { word: "salty",                    meaning: "bitter, upset or resentful about something",           example: "Don't be salty about losing — it was a fair game." },
  { word: "based",                    meaning: "holding unpopular opinions confidently",               example: "That's a pretty based take — I respect that you stand by it." },
  { word: "understood the assignment", meaning: "did exactly what was needed, perfectly",             example: "Her outfit was perfect — she understood the assignment." },
  { word: "touch grass",              meaning: "to go outside / disconnect from the internet",         example: "You've been online for 10 hours. Go touch grass." },
  { word: "era",                      meaning: "a specific phase or period of your life",              example: "I'm in my fitness era right now — gym every morning." },
  { word: "situationship",            meaning: "a romantic connection that is undefined or uncommitted", example: "They've been in a situationship for months — neither will define it." },
];

const WORD_BANK = ["hits different", "rent-free", "goated", "main character", "rizz", "salty", "based", "understood the assignment", "touch grass", "it's giving"];

const EXERCISES = [
  { before: "Listening to that song at sunset just ", answer: "hits different",            after: " — nothing compares to it."                                    },
  { before: "That embarrassing moment has been living ", answer: "rent-free",              after: " in my head all week."                                         },
  { before: "His performance last night was absolutely ", answer: "goated",                after: " — nobody compares."                                           },
  { before: "She walked in like she was the ", answer: "main character",                   after: " of a film — all eyes were on her."                            },
  { before: "He has so much ", answer: "rizz",                                             after: " — he can make anyone feel comfortable instantly."              },
  { before: "Don't be ", answer: "salty",                                                  after: " about losing — it was a completely fair game."                },
  { before: "That's a pretty ", answer: "based",                                           after: " take — I respect that you stand by it."                       },
  { before: "She completely ", answer: "understood the assignment",                        after: " — her outfit was perfect for the occasion."                   },
  { before: "You've been online for 10 hours. You need to go ", answer: "touch grass",    after: "."                                                             },
  { before: "That colour combination? ", answer: "It's giving",                            after: " vintage 90s — I love it."                                     },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/slang",     active: false },
  { label: "B1",    href: "/nerd-zone/slang/b1",  active: false },
  { label: "B2",    href: "/nerd-zone/slang/b2",  active: true  },
  { label: "C1", href: "/nerd-zone/slang/c1",  active: false },
];

export default async function SlangB2Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"], ["Slang", "/nerd-zone/slang"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">B2</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-pink-100 px-3 py-0.5 text-[11px] font-black text-pink-700">Slang</span>
            <span className="rounded-full bg-orange-500 px-3 py-0.5 text-[11px] font-black text-white">B2</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Upper-Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              Slang
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 popular B2 Gen Z and internet slang terms widely used in 2024–2025 — understand them to follow real English conversations online.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, active }) => (
              active ? (
                <span key={label} className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-black text-white shadow-sm">{label}</span>
              ) : (
                <a key={label} href={href} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isPro={isPro} level="B2" title="English Slang" wordBank={WORD_BANK} exercises={EXERCISES} filename="Slang_B2_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-sm text-pink-700">
          ⚠️ Slang changes fast. These terms were widely used in 2024–2025 — understanding them helps you follow real conversations on social media and in everyday speech.
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b-2 border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-5 py-4"><span className="h-2 w-2 rounded-full bg-pink-500" /><span className="text-[10px] font-black uppercase tracking-widest text-pink-700">Word / Phrase</span></div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Meaning</span></div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-sky-500" /><span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Example</span></div>
          </div>
          <div>
            {WORDS.map(({ word, meaning, example }, i) => (
              <div key={word} className={`group grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
                <div className="flex items-center px-5 py-3.5"><span className="text-sm font-black text-pink-600">{word}</span></div>
                <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-5 py-3.5 group-hover:bg-emerald-50/60"><span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">{meaning}</span></div>
                <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-5 py-3.5 group-hover:bg-sky-50/60"><span className="text-sm italic text-sky-800">{example}</span></div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 words · B2 Upper-Intermediate · Gen Z & internet English (2024–2025)</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">Gen Z slang travels fast — but also dates fast. Understanding these terms helps you follow real conversations online. You don't need to use all of them, but recognising them is essential at B2.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/slang/b1" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← B1
          </a>
          <a href="/nerd-zone/slang/c1" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            C1 →
          </a>
        </div>
      </div>
    </div>
  );
}
