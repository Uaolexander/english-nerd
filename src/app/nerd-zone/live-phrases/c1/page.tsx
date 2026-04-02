import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DownloadWorksheet from "../DownloadWorksheet";

export const metadata: Metadata = {
  title: "Live Phrases C1 — Advanced English Expressions | English Nerd",
  description: "Master 12 sophisticated C1 English expressions used in journalism, business and intellectual discourse. Download a free printable worksheet with exercises and answer key.",
  keywords: ["live phrases C1", "advanced English expressions", "C1 English phrases", "idiomatic English C1", "CAE expressions"],
  alternates: { canonical: "/nerd-zone/live-phrases/c1" },
  openGraph: {
    title: "Live Phrases C1 — Advanced English Expressions | English Nerd",
    description: "12 sophisticated C1 everyday expressions + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/live-phrases/c1",
    type: "article",
  },
};

const PHRASES = [
  { phrase: "Bite the bullet",         meaning: "To endure a painful or difficult situation",       example: "We need to bite the bullet and have that difficult conversation." },
  { phrase: "Go the extra mile",        meaning: "To make a special effort beyond what's expected",  example: "Our team always goes the extra mile for every client." },
  { phrase: "Speak volumes",            meaning: "To clearly indicate something without words",      example: "The silence in the room spoke volumes — no one agreed." },
  { phrase: "Leave no stone unturned",  meaning: "To try every possible option",                     example: "The detectives left no stone unturned in their search." },
  { phrase: "Raise the bar",            meaning: "To set a higher standard",                         example: "That performance has raised the bar for everyone." },
  { phrase: "Cut corners",              meaning: "To do something cheaply, reducing quality",        example: "You can't cut corners when it comes to safety standards." },
  { phrase: "On balance",              meaning: "Taking everything into account",                   example: "On balance, the benefits outweigh the risks." },
  { phrase: "Come to a head",           meaning: "To reach a crisis or turning point",              example: "The tensions finally came to a head during the review meeting." },
  { phrase: "Draw a blank",             meaning: "To be unable to remember or think of something",  example: "I drew a blank when she asked me for the author's name." },
  { phrase: "Fly in the face of",       meaning: "To openly contradict or oppose",                  example: "His decision flies in the face of all the evidence presented." },
  { phrase: "Stand one's ground",       meaning: "To maintain your position under pressure",        example: "She stood her ground despite fierce opposition from the board." },
  { phrase: "Cut to the bone",          meaning: "To reduce something to the minimum possible",     example: "After the losses, the company cut costs to the bone." },
];

const WORD_BANK = ["bite the bullet", "go the extra mile", "speak volumes", "leave no stone unturned", "raise the bar", "cut corners", "on balance", "come to a head", "draw a blank", "fly in the face of"];

const EXERCISES = [
  { before: "We need to ",                    answer: "bite the bullet",          after: " and have that difficult conversation with the board."       },
  { before: "Our team always tries to ",      answer: "go the extra mile",        after: " for every client, no matter how small the project."         },
  { before: "The silence in the room ",       answer: "spoke volumes",            after: " — no one supported the idea."                               },
  { before: "The detectives ",                answer: "left no stone unturned",   after: " in their search for evidence."                              },
  { before: "That performance has really ",   answer: "raised the bar",           after: " for everyone in the competition."                           },
  { before: "You can't ",                     answer: "cut corners",              after: " when it comes to safety standards."                         },
  { before: "",                               answer: "On balance",               after: ", I think the benefits of the plan outweigh the risks."      },
  { before: "The tensions finally ",          answer: "came to a head",           after: " during the annual review meeting."                          },
  { before: "I ",                             answer: "drew a blank",             after: " when she asked me for the name of the author."              },
  { before: "His decision ",                  answer: "flies in the face of",     after: " all the evidence presented to the committee."               },
];

const LEVELS = [
  { label: "A1", href: "/nerd-zone/live-phrases",     active: false },
  { label: "B1", href: "/nerd-zone/live-phrases/b1",  active: false },
  { label: "B2", href: "/nerd-zone/live-phrases/b2",  active: false },
  { label: "C1", href: "/nerd-zone/live-phrases/c1",  active: true  },
];

export default async function LivePhrasesC1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

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
          <span className="text-slate-700 font-medium">C1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-700">Live Phrases</span>
            <span className="rounded-full bg-sky-500 px-3 py-0.5 text-[11px] font-black text-white">C1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Advanced</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Live{" "}
            <span className="relative inline-block">
              Phrases
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 advanced C1 expressions that separate good English from truly fluent English — used in journalism, business and intellectual discourse.
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
            <DownloadWorksheet isLoggedIn={isLoggedIn} level="C1" title="Live Phrases" wordBank={WORD_BANK} exercises={EXERCISES} loginRedirect="/nerd-zone/live-phrases/c1" filename="LivePhrases_C1_Worksheet_EnglishNerd.pdf" />
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
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 expressions · C1 Advanced · journalism, business & intellectual discourse</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">C1 speakers use these expressions naturally in serious discussions. Read quality journalism (The Guardian, The Economist) and notice how often these appear — then consciously use them in your own writing and speech.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/live-phrases/b2" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
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
