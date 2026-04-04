import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import DownloadWorksheet from "../DownloadWorksheet";

export const metadata: Metadata = {
  title: "Slang C1 — Advanced Cultural English Slang | English Nerd",
  description: "Master 12 sophisticated C1 slang terms that describe cultural and social phenomena. Download a free printable worksheet with exercises and answer key.",
  keywords: ["English slang C1", "advanced cultural slang", "C1 informal English", "social media vocabulary", "contemporary English terms"],
  alternates: { canonical: "/nerd-zone/slang/c1" },
  openGraph: {
    title: "Slang C1 — Advanced Cultural English Slang | English Nerd",
    description: "12 sophisticated C1 cultural slang terms + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/slang/c1",
    type: "article",
  },
};

const WORDS = [
  { word: "gaslighting",       meaning: "making someone question their own reality through manipulation",           example: "He kept telling her she imagined things — classic gaslighting." },
  { word: "gatekeeping",       meaning: "preventing others from accessing something or joining a group",           example: "Telling fans they're not 'real' fans is pure gatekeeping." },
  { word: "virtue signalling", meaning: "publicly performing morality to gain social approval",                    example: "Posting about charity just to get likes is a form of virtue signalling." },
  { word: "cancel",            meaning: "to publicly withdraw support from someone due to controversial behaviour", example: "Fans threatened to cancel the brand after the ad." },
  { word: "parasocial",        meaning: "describing a one-sided emotional bond (e.g. fan to influencer)",         example: "The relationship between a fan and a celebrity is inherently parasocial." },
  { word: "chronically online", meaning: "so absorbed in internet culture that you lose real-world perspective",  example: "If you're upset about a meme at 2 am, you might be chronically online." },
  { word: "red flag",          meaning: "a warning sign of problematic behaviour in a person or situation",       example: "He never listens and always blames others — that's a huge red flag." },
  { word: "NPC",               meaning: "someone acting robotically, without independent thought (from gaming)",  example: "He just nodded and agreed with everything — total NPC energy." },
  { word: "delulu",            meaning: "short for delusional; having unrealistic expectations",                  example: "Thinking he'll text back after three months is a bit delulu." },
  { word: "situationship",     meaning: "a romantic connection that is undefined or lacks commitment",            example: "They've been in a situationship for six months — neither will define it." },
  { word: "lore",              meaning: "someone's personal backstory or accumulated history",                    example: "That argument is now part of the office lore." },
  { word: "unhinged",          meaning: "wildly irrational or chaotic — often used humorously",                  example: "That reply was completely unhinged — I can't stop laughing." },
];

const WORD_BANK = ["gaslighting", "gatekeeping", "virtue signalling", "cancel", "parasocial", "chronically online", "red flag", "NPC", "delulu", "situationship"];

const EXERCISES = [
  { before: "He kept telling her she imagined things — classic ",                   answer: "gaslighting",        after: "."                                                            },
  { before: "Telling people they're not 'real' fans is pure ",                      answer: "gatekeeping",        after: " — everyone is welcome."                                      },
  { before: "Posting about charity just to get likes is a form of ",                answer: "virtue signalling",  after: "."                                                            },
  { before: "Fans threatened to ",                                                   answer: "cancel",             after: " the brand after the controversial ad."                        },
  { before: "The relationship between a fan and a celebrity is inherently ",         answer: "parasocial",         after: " — they don't know you exist."                                },
  { before: "If you're upset about a meme at 2 am, you might be ",                  answer: "chronically online", after: "."                                                            },
  { before: "He never listens and always blames others — that's a huge ",            answer: "red flag",           after: "."                                                            },
  { before: "He just nodded and agreed with everything — total ",                    answer: "NPC",                after: " energy."                                                     },
  { before: "Thinking he'll text back after three months? That's a bit ",            answer: "delulu",             after: "."                                                            },
  { before: "They've been in a ",                                                    answer: "situationship",      after: " for six months — neither one will define it."                },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/slang",     active: false },
  { label: "B1",    href: "/nerd-zone/slang/b1",  active: false },
  { label: "B2",    href: "/nerd-zone/slang/b2",  active: false },
  { label: "C1",    href: "/nerd-zone/slang/c1",  active: true  },
];

export default async function SlangC1Page() {
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
          <span className="text-slate-700 font-medium">C1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-pink-100 px-3 py-0.5 text-[11px] font-black text-pink-700">Slang</span>
            <span className="rounded-full bg-sky-500 px-3 py-0.5 text-[11px] font-black text-white">C1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Advanced</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              Slang
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 sophisticated C1 terms that describe cultural and social phenomena — essential for understanding modern media, politics and online discourse.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, active }) => (
              active ? (
                <span key={label} className="rounded-xl bg-sky-500 px-5 py-2 text-sm font-black text-white shadow-sm">{label}</span>
              ) : (
                <a key={label} href={href} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isPro={isPro} level="C1" title="English Slang" wordBank={WORD_BANK} exercises={EXERCISES} filename="Slang_C1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-sm text-pink-700">
          ⚠️ C1 slang is often conceptual — these words describe cultural phenomena. Knowing them helps you understand debates in media, politics and online discourse.
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
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 words · C1 Advanced · cultural & social discourse</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">C1 slang is often conceptual and appears in media and social commentary. Follow English-language podcasts and news discussions — you'll hear these terms used to describe real events and cultural debates.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/slang/b2" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← B2
          </a>
          <a href="/nerd-zone" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            Nerd Zone
          </a>
        </div>
      </div>
    </div>
  );
}
