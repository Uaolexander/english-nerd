import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import DownloadWorksheet from "../DownloadWorksheet";

export const metadata: Metadata = {
  title: "Phrasal Verbs B1 — Intermediate English | English Nerd",
  description: "Master 12 essential B1 phrasal verbs for intermediate English learners. Download a free printable worksheet with 10 fill-in-the-blank exercises and an answer key.",
  keywords: ["phrasal verbs B1", "intermediate phrasal verbs", "B1 English worksheet", "phrasal verbs exercises", "intermediate English"],
  alternates: { canonical: "/nerd-zone/phrasal-verbs/b1" },
  openGraph: {
    title: "Phrasal Verbs B1 — Intermediate English | English Nerd",
    description: "12 essential B1 phrasal verbs + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/phrasal-verbs/b1",
    type: "article",
  },
};

const VERBS = [
  { verb: "carry on",        meaning: "to continue doing something",              example: "Carry on — I'll join you in a moment." },
  { verb: "bring up",        meaning: "to mention a topic",                       example: "She brought up an interesting point." },
  { verb: "come across",     meaning: "to find or meet by chance",                example: "I came across this café by accident." },
  { verb: "deal with",       meaning: "to handle a problem or situation",         example: "How do you deal with stress at work?" },
  { verb: "fall out with",   meaning: "to have an argument and stop being friends", example: "She fell out with her flatmate." },
  { verb: "give up",         meaning: "to stop trying",                           example: "Don't give up — you're nearly there!" },
  { verb: "look forward to", meaning: "to be excited about something in the future", example: "I'm looking forward to the holiday." },
  { verb: "make up",         meaning: "to reconcile after an argument",           example: "They fought but made up the next day." },
  { verb: "put off",         meaning: "to postpone",                              example: "Stop putting things off and just start!" },
  { verb: "set up",          meaning: "to establish or start something",          example: "She set up her own business at 25." },
  { verb: "take up",         meaning: "to start a new hobby or activity",         example: "He took up running after lockdown." },
  { verb: "work out",        meaning: "to exercise / to solve a problem",         example: "I go to the gym to work out three times a week." },
];

const WORD_BANK = ["carry on", "bring up", "come across", "deal with", "give up", "look forward to", "put off", "set up", "take up", "work out"];

const EXERCISES = [
  { before: "Don't ",                         answer: "give up",         after: " — you've almost finished the project." },
  { before: "Could I ",                       answer: "bring up",        after: " a problem we've been having recently?" },
  { before: "I ",                             answer: "came across",     after: " this great café by accident when I was walking home." },
  { before: "How do you usually ",            answer: "deal with",       after: " difficult customers at work?" },
  { before: "We've been ",                    answer: "putting off",     after: " the meeting for two weeks now." },
  { before: "She decided to ",               answer: "set up",          after: " her own business after years of experience." },
  { before: "He ",                            answer: "took up",         after: " yoga after his doctor recommended it." },
  { before: "Please ",                        answer: "carry on",        after: " — I'll join you in five minutes." },
  { before: "I'm really ",                    answer: "looking forward to", after: " seeing everyone at the party." },
  { before: "I usually ",                     answer: "work out",        after: " at the gym before work." },
];

const LEVELS = [
  { label: "A1", href: "/nerd-zone/phrasal-verbs",    active: false },
  { label: "B1", href: "/nerd-zone/phrasal-verbs/b1", active: true  },
  { label: "B2", href: "/nerd-zone/phrasal-verbs/b2", active: false },
  { label: "C1", href: "/nerd-zone/phrasal-verbs/c1", active: false },
];

export default async function PhrasalVerbsB1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"], ["Phrasal Verbs", "/nerd-zone/phrasal-verbs"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">B1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-[11px] font-black text-violet-700">Phrasal Verbs</span>
            <span className="rounded-full bg-violet-500 px-3 py-0.5 text-[11px] font-black text-white">B1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Phrasal{" "}
            <span className="relative inline-block">
              Verbs
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 key B1 phrasal verbs that intermediate speakers use daily — in meetings, conversations and everyday situations.
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
            <DownloadWorksheet isPro={isPro} level="B1" wordBank={WORD_BANK} exercises={EXERCISES} filename="PhrasalVerbs_B1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b-2 border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-5 py-4"><span className="h-2 w-2 rounded-full bg-violet-500" /><span className="text-[10px] font-black uppercase tracking-widest text-violet-700">Phrasal Verb</span></div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Meaning</span></div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-sky-500" /><span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Example</span></div>
          </div>
          <div>
            {VERBS.map(({ verb, meaning, example }, i) => (
              <div key={verb} className={`group grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
                <div className="flex items-center px-5 py-3.5"><span className="text-sm font-black text-slate-900">{verb}</span></div>
                <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-5 py-3.5 group-hover:bg-emerald-50/60"><span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">{meaning}</span></div>
                <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-5 py-3.5 group-hover:bg-sky-50/60"><span className="text-sm italic text-sky-800">{example}</span></div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 phrasal verbs · B1 Intermediate · work & everyday English</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">At B1 level, focus on phrasal verbs you can use at work and in conversation. Try using 2–3 new ones in writing or speech every day this week.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/phrasal-verbs" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← A1
          </a>
          <a href="/nerd-zone/phrasal-verbs/b2" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            B2 →
          </a>
        </div>
      </div>
    </div>
  );
}
