import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DownloadWorksheet from "./DownloadWorksheet";

export const metadata: Metadata = {
  title: "Slang A1 — Basic Informal English | English Nerd",
  description: "Learn 12 essential A1 informal English words and expressions used every day. Download a free printable fill-in-the-blank worksheet with answer key.",
  keywords: ["English slang A1", "basic informal English", "everyday informal English", "beginner English slang", "informal English expressions"],
  alternates: { canonical: "/nerd-zone/slang" },
  openGraph: {
    title: "Slang A1 — Basic Informal English | English Nerd",
    description: "12 essential A1 informal words + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/slang",
    type: "article",
  },
};

const WORDS = [
  { word: "cool",      meaning: "great, impressive, or acceptable",            example: "That design looks really cool — everyone will love it." },
  { word: "yeah",      meaning: "yes (informal)",                               example: "— Did you like the film? — Yeah, it was great!" },
  { word: "nope",      meaning: "no (informal)",                                example: "— Are you coming tonight? — Nope, I'm too tired." },
  { word: "wanna",     meaning: "want to (informal spoken form)",               example: "I wanna try that new café everyone's talking about." },
  { word: "gonna",     meaning: "going to (informal spoken form)",              example: "Are you gonna join us for dinner tonight?" },
  { word: "gotta",     meaning: "have to / must (informal spoken form)",        example: "You've gotta see this film — it's absolutely brilliant." },
  { word: "kinda",     meaning: "kind of / a little (informal)",               example: "I'm kinda tired, but I'll come to the party anyway." },
  { word: "no biggie", meaning: "it's not important / no problem",              example: "— Sorry I broke your pen. — No biggie, I have more." },
  { word: "totally",   meaning: "absolutely / completely",                      example: "I totally agree with everything you just said." },
  { word: "hang out",  meaning: "to spend casual time with friends",            example: "We should hang out more — I never see you anymore." },
  { word: "a big deal", meaning: "something very important or significant",     example: "Moving abroad is a big deal — think it through." },
  { word: "stuff",     meaning: "things in general (informal)",                 example: "I need to sort out some stuff before the weekend." },
];

const WORD_BANK = ["cool", "yeah", "gonna", "gotta", "kinda", "no biggie", "totally", "hang out", "a big deal", "wanna"];

const EXERCISES = [
  { before: "Are you ",               answer: "gonna",      after: " join us for dinner tonight?"                              },
  { before: "I ",                     answer: "wanna",      after: " try that new café everyone's talking about."              },
  { before: "You've ",                answer: "gotta",      after: " see this film — it's absolutely brilliant."               },
  { before: "I'm ",                   answer: "kinda",      after: " tired, but I'll come to the party anyway."                },
  { before: "— Sorry I broke your pen. — ", answer: "No biggie", after: ", I have plenty more."                               },
  { before: "That new design looks really ", answer: "cool", after: " — everyone's going to love it."                         },
  { before: "I ",                     answer: "totally",    after: " agree with everything you just said."                    },
  { before: "We should ",             answer: "hang out",   after: " more — I feel like I never see you anymore."             },
  { before: "— Did you like the film? — ", answer: "Yeah", after: ", it was great!"                                           },
  { before: "Moving abroad is ",      answer: "a big deal", after: " — make sure you've thought it through."                  },
];

const LEVELS = [
  { label: "A1", href: "/nerd-zone/slang",     color: "bg-[#F5DA20] text-black" },
  { label: "B1", href: "/nerd-zone/slang/b1",  color: "bg-violet-500 text-white" },
  { label: "B2", href: "/nerd-zone/slang/b2",  color: "bg-orange-500 text-white" },
  { label: "C1", href: "/nerd-zone/slang/c1",  color: "bg-sky-500 text-white" },
];

export default async function SlangA1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">Slang · A1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-pink-100 px-3 py-0.5 text-[11px] font-black text-pink-700">Slang</span>
            <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">A1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Beginner</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              Slang
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 basic informal words every English learner encounters — used daily in conversations, messages and media. Start here.
          </p>
        </div>

        {/* Level nav + download */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, color }) => (
              label === "A1" ? (
                <span key={label} className={`rounded-xl ${color} px-5 py-2 text-sm font-black shadow-sm`}>{label}</span>
              ) : (
                <a key={label} href={href} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isLoggedIn={isLoggedIn} level="A1" title="English Slang" wordBank={WORD_BANK} exercises={EXERCISES} loginRedirect="/nerd-zone/slang" filename="Slang_A1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-sm text-pink-700">
          ⚠️ These words are informal — perfect for casual conversation and messages, but avoid them in formal writing or professional emails.
        </div>

        {/* Table */}
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
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 words · A1 Beginner · everyday informal English</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">These basics are used every day in informal English. Start with them in casual chats and messages — they'll immediately make your English feel more natural and relaxed.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            Next level:
            <a href="/nerd-zone/slang/b1" className="font-bold text-violet-600 hover:underline">B1 →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
