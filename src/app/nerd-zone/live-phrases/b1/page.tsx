import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import DownloadWorksheet from "../DownloadWorksheet";

export const metadata: Metadata = {
  title: "Live Phrases B1 — Intermediate English Expressions | English Nerd",
  description: "Master 12 essential B1 English expressions used in everyday conversations and the workplace. Download a free printable worksheet with exercises and answer key.",
  keywords: ["live phrases B1", "intermediate English expressions", "B1 English phrases", "everyday English B1", "natural English expressions"],
  alternates: { canonical: "/nerd-zone/live-phrases/b1" },
  openGraph: {
    title: "Live Phrases B1 — Intermediate English Expressions | English Nerd",
    description: "12 essential B1 everyday expressions + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/live-phrases/b1",
    type: "article",
  },
};

const PHRASES = [
  { phrase: "Long story short",       meaning: "To summarise briefly",                         example: "Long story short, we missed the flight." },
  { phrase: "At the end of the day",  meaning: "Ultimately / when everything is considered",   example: "At the end of the day, the client comes first." },
  { phrase: "Give it a shot",         meaning: "Try it",                                        example: "You've never tried sushi? Give it a shot!" },
  { phrase: "Cut to the chase",       meaning: "Get to the main point quickly",                 example: "Let's cut to the chase — are you interested?" },
  { phrase: "Out of the blue",        meaning: "Suddenly and unexpectedly",                     example: "She called out of the blue after five years." },
  { phrase: "On the same page",       meaning: "Having the same understanding",                 example: "Are we all on the same page about the deadline?" },
  { phrase: "In a nutshell",          meaning: "In summary / briefly",                          example: "In a nutshell, the project is behind schedule." },
  { phrase: "Keep me posted",         meaning: "Keep me informed / give me updates",            example: "Let me know how it goes — keep me posted." },
  { phrase: "Pull someone's leg",     meaning: "To joke with someone / tease",                  example: "I'm just pulling your leg — relax!" },
  { phrase: "It's on me",             meaning: "I'll pay for it / it's my treat",               example: "Don't worry about the bill — it's on me tonight." },
  { phrase: "I'm all for it",         meaning: "I fully support it",                            example: "A shorter working week? I'm all for it." },
  { phrase: "That's the thing",       meaning: "That's exactly the issue or point",             example: "That's the thing — nobody told me about the change." },
];

const WORD_BANK = ["long story short", "at the end of the day", "give it a shot", "cut to the chase", "out of the blue", "on the same page", "in a nutshell", "keep me posted", "pull your leg", "it's on me"];

const EXERCISES = [
  { before: "I was sitting at home when, ",          answer: "out of the blue",         after: ", she called after five years of silence."          },
  { before: "I don't have time for the full version — just explain it ", answer: "in a nutshell", after: "."                                        },
  { before: "You've never tried Thai food? ",        answer: "Give it a shot",          after: " — I think you'll love it."                         },
  { before: "Stop going around the topic and just ", answer: "cut to the chase",        after: "."                                                  },
  { before: "Are we all ",                           answer: "on the same page",        after: " about the new deadline?"                           },
  { before: "Don't worry about the bill — ",         answer: "it's on me",              after: " tonight."                                          },
  { before: "I'm just ",                             answer: "pulling your leg",        after: " — I didn't really forget your birthday!"           },
  { before: "",                                      answer: "Long story short",        after: ", we missed the flight and had to book a hotel."    },
  { before: "",                                      answer: "At the end of the day",   after: ", what matters most is that the client is happy."   },
  { before: "Let me know how the meeting goes — ",   answer: "keep me posted",          after: "."                                                  },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/live-phrases",     active: false },
  { label: "B1",    href: "/nerd-zone/live-phrases/b1",  active: true  },
  { label: "B2", href: "/nerd-zone/live-phrases/b2",  active: false },
  { label: "C1", href: "/nerd-zone/live-phrases/c1",  active: false },
];

export default async function LivePhrasesB1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"], ["Live Phrases", "/nerd-zone/live-phrases"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">B1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-700">Live Phrases</span>
            <span className="rounded-full bg-violet-500 px-3 py-0.5 text-[11px] font-black text-white">B1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Live{" "}
            <span className="relative inline-block">
              Phrases
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 key B1 expressions used at work, in meetings and everyday conversations — phrases that make you sound fluent and confident.
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
            <DownloadWorksheet isPro={isPro} level="B1" title="Live Phrases" wordBank={WORD_BANK} exercises={EXERCISES} filename="LivePhrases_B1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b-2 border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-5 py-4"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Expression</span></div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Meaning</span></div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-sky-500" /><span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Example</span></div>
          </div>
          <div>
            {PHRASES.map(({ phrase, meaning, example }, i) => (
              <div key={phrase} className={`group grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
                <div className="flex items-center px-5 py-3.5"><span className="text-sm font-black text-slate-900">{phrase}</span></div>
                <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-5 py-3.5 group-hover:bg-emerald-50/60"><span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">{meaning}</span></div>
                <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-5 py-3.5 group-hover:bg-sky-50/60"><span className="text-sm italic text-sky-800">{example}</span></div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 expressions · B1 Intermediate · work & everyday English</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">These phrases are common in workplace conversations and emails. Try slipping 2–3 of them into your next meeting or message today — they'll make you sound far more natural.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/live-phrases" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← A1
          </a>
          <a href="/nerd-zone/live-phrases/b2" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            B2 →
          </a>
        </div>
      </div>
    </div>
  );
}
