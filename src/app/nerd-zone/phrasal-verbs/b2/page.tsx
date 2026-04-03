import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import DownloadWorksheet from "../DownloadWorksheet";

export const metadata: Metadata = {
  title: "Phrasal Verbs B2 — Upper-Intermediate English | English Nerd",
  description: "Learn 12 high-frequency B2 phrasal verbs used in professional and academic English. Download a free printable worksheet with exercises and a full answer key.",
  keywords: ["phrasal verbs B2", "upper intermediate phrasal verbs", "B2 English worksheet", "advanced phrasal verbs exercises", "IELTS phrasal verbs"],
  alternates: { canonical: "/nerd-zone/phrasal-verbs/b2" },
  openGraph: {
    title: "Phrasal Verbs B2 — Upper-Intermediate English | English Nerd",
    description: "12 essential B2 phrasal verbs + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/phrasal-verbs/b2",
    type: "article",
  },
};

const VERBS = [
  { verb: "come up with",  meaning: "to think of an idea or solution",         example: "She came up with a brilliant plan." },
  { verb: "cut back on",   meaning: "to reduce the amount of something",       example: "We need to cut back on spending." },
  { verb: "fall through",  meaning: "to fail to happen",                       example: "The deal fell through at the last minute." },
  { verb: "get rid of",    meaning: "to remove or throw away",                 example: "It's time to get rid of these old files." },
  { verb: "let down",      meaning: "to disappoint someone",                   example: "I don't want to let the team down." },
  { verb: "make out",      meaning: "to see or understand with difficulty",    example: "I could barely make out the text in the dark." },
  { verb: "rule out",      meaning: "to exclude a possibility",                example: "We can't rule out the possibility of delays." },
  { verb: "stand for",     meaning: "to represent / to tolerate",              example: "I won't stand for this kind of behaviour." },
  { verb: "take on",       meaning: "to accept responsibility or hire staff",  example: "The company decided to take on ten new staff." },
  { verb: "break down",    meaning: "to stop working / to analyse step by step", example: "The car broke down on the motorway." },
  { verb: "bring about",   meaning: "to cause something to happen",            example: "The reforms brought about significant change." },
  { verb: "account for",   meaning: "to explain or give a reason for",         example: "How do you account for the missing data?" },
];

const WORD_BANK = ["come up with", "cut back on", "fall through", "get rid of", "let down", "make out", "rule out", "stand for", "take on", "break down"];

const EXERCISES = [
  { before: "The negotiations ",             answer: "fell through",   after: " and both sides walked away." },
  { before: "She ",                          answer: "came up with",   after: " a creative solution nobody had considered." },
  { before: "The company needs to ",         answer: "cut back on",    after: " unnecessary costs this quarter." },
  { before: "It's time to ",                 answer: "get rid of",     after: " all the old equipment in the office." },
  { before: "I promised I wouldn't ",        answer: "let down",       after: " the people who believed in me." },
  { before: "The sign was so small I could barely ", answer: "make out", after: " the letters from a distance." },
  { before: "The investigation couldn't ",   answer: "rule out",       after: " the possibility of human error." },
  { before: '"FREE" here ',                  answer: "stands for",     after: ' "no hidden charges".' },
  { before: "The firm decided to ",          answer: "take on",        after: " extra staff for the busy season." },
  { before: "The engine ",                   answer: "broke down",     after: " just as we reached the motorway." },
];

const LEVELS = [
  { label: "A1", href: "/nerd-zone/phrasal-verbs",    active: false },
  { label: "B1", href: "/nerd-zone/phrasal-verbs/b1", active: false },
  { label: "B2", href: "/nerd-zone/phrasal-verbs/b2", active: true  },
  { label: "C1", href: "/nerd-zone/phrasal-verbs/c1", active: false },
];

export default async function PhrasalVerbsB2Page() {
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
          <span className="text-slate-700 font-medium">B2</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-[11px] font-black text-violet-700">Phrasal Verbs</span>
            <span className="rounded-full bg-orange-500 px-3 py-0.5 text-[11px] font-black text-white">B2</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Upper-Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Phrasal{" "}
            <span className="relative inline-block">
              Verbs
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 high-frequency B2 phrasal verbs used in professional emails, academic writing and advanced conversations.
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
            <DownloadWorksheet isPro={isPro} level="B2" wordBank={WORD_BANK} exercises={EXERCISES} filename="PhrasalVerbs_B2_Worksheet_EnglishNerd.pdf" />
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
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 phrasal verbs · B2 Upper-Intermediate · professional & academic English</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">At B2, you should be using these in your writing. Pick 3 phrasal verbs from this list and write a short email or paragraph using them today.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/phrasal-verbs/b1" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← B1
          </a>
          <a href="/nerd-zone/phrasal-verbs/c1" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            C1 →
          </a>
        </div>
      </div>
    </div>
  );
}
