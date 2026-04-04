import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import DownloadWorksheet from "../DownloadWorksheet";

export const metadata: Metadata = {
  title: "Slang B1 — Intermediate Informal English | English Nerd",
  description: "Master 12 essential B1 English slang words used in social media and everyday conversation. Download a free printable worksheet with exercises and answer key.",
  keywords: ["English slang B1", "intermediate slang", "social media English slang", "B1 informal English", "common internet slang"],
  alternates: { canonical: "/nerd-zone/slang/b1" },
  openGraph: {
    title: "Slang B1 — Intermediate Informal English | English Nerd",
    description: "12 essential B1 slang words + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/slang/b1",
    type: "article",
  },
};

const WORDS = [
  { word: "lowkey",    meaning: "slightly, or secretly / in a subtle way",          example: "I'm lowkey obsessed with this new series." },
  { word: "vibe",      meaning: "feeling, mood, or atmosphere",                      example: "This place has such an amazing vibe." },
  { word: "lit",       meaning: "exciting, excellent, or lively",                    example: "The party last night was absolutely lit." },
  { word: "chill",     meaning: "relaxed; or to relax and do nothing",               example: "Let's just stay in and chill tonight." },
  { word: "no cap",    meaning: "no lie / I'm being completely honest",              example: "That's the best pizza I've ever had, no cap." },
  { word: "slay",      meaning: "to do something impressively well",                 example: "She walked in and absolutely slayed that outfit." },
  { word: "flex",      meaning: "to show off / a display of wealth or skill",        example: "He's always flexing his new gadgets online." },
  { word: "ghost",     meaning: "to suddenly stop responding to someone",            example: "He just ghosted me after three weeks of texting." },
  { word: "extra",     meaning: "over the top, dramatic or excessive",               example: "She cried at a TV advert — isn't that a bit extra?" },
  { word: "bussin",    meaning: "extremely good, usually said about food",           example: "This ramen is absolutely bussin — best in the city." },
  { word: "dead",      meaning: "very funny (e.g. 'I'm dead' = I'm laughing hard)", example: "That video had me dead — I watched it five times." },
  { word: "vibe check", meaning: "an assessment of someone's mood or energy",       example: "This new colleague passed the vibe check immediately." },
];

const WORD_BANK = ["lowkey", "vibe", "lit", "chill", "no cap", "slay", "flex", "ghost", "extra", "bussin"];

const EXERCISES = [
  { before: "I'm ",                          answer: "lowkey",    after: " obsessed with this new series — I can't stop watching."    },
  { before: "This place has such an amazing ", answer: "vibe",   after: " — I could stay here all day."                              },
  { before: "The party last night was absolutely ", answer: "lit", after: " — we didn't leave until 3 am."                          },
  { before: "Let's just stay in and ",        answer: "chill",    after: " — I don't feel like going out."                          },
  { before: "That pizza is completely ",      answer: "bussin",   after: " — best I've had in months."                              },
  { before: "She walked in and absolutely ", answer: "slayed",    after: " — everyone was staring."                                 },
  { before: "Don't ",                         answer: "flex",     after: " your car in front of them — they'll find it annoying."   },
  { before: "He just ",                       answer: "ghosted",  after: " me after three weeks of texting — no explanation."       },
  { before: "She cried at a TV advert — isn't that a bit ", answer: "extra", after: "?"                                            },
  { before: "This is the best burger I've ever eaten, ", answer: "no cap", after: "."                                               },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/slang",     active: false },
  { label: "B1",    href: "/nerd-zone/slang/b1",  active: true  },
  { label: "B2", href: "/nerd-zone/slang/b2",  active: false },
  { label: "C1", href: "/nerd-zone/slang/c1",  active: false },
];

export default async function SlangB1Page() {
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
          <span className="text-slate-700 font-medium">B1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-pink-100 px-3 py-0.5 text-[11px] font-black text-pink-700">Slang</span>
            <span className="rounded-full bg-violet-500 px-3 py-0.5 text-[11px] font-black text-white">B1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              Slang
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 B1 slang words you'll hear constantly in English-speaking social media, podcasts and casual conversations.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, active }) => (
              active ? (
                <span key={label} className="rounded-xl bg-violet-500 px-5 py-2 text-sm font-black text-white shadow-sm">{label}</span>
              ) : (
                <a key={label} href={href} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isPro={isPro} level="B1" title="English Slang" wordBank={WORD_BANK} exercises={EXERCISES} filename="Slang_B1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-sm text-pink-700">
          ⚠️ These terms are informal and context-sensitive — use them with friends, but avoid them in formal or professional settings.
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
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 words · B1 Intermediate · social media & casual conversation</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">These terms are common in English-speaking social media and everyday conversation. Use them with friends, but always read the room — slang can sound awkward in the wrong context.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/slang" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← A1
          </a>
          <a href="/nerd-zone/slang/b2" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            B2 →
          </a>
        </div>
      </div>
    </div>
  );
}
