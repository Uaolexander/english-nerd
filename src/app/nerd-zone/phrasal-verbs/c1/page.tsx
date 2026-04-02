import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DownloadWorksheet from "../DownloadWorksheet";

export const metadata: Metadata = {
  title: "Phrasal Verbs C1 — Advanced English | English Nerd",
  description: "Master 12 sophisticated C1 phrasal verbs for advanced English speakers. Download a free printable worksheet with challenging exercises and a full answer key.",
  keywords: ["phrasal verbs C1", "advanced phrasal verbs", "C1 English worksheet", "advanced English exercises", "CAE phrasal verbs", "C1 level English"],
  alternates: { canonical: "/nerd-zone/phrasal-verbs/c1" },
  openGraph: {
    title: "Phrasal Verbs C1 — Advanced English | English Nerd",
    description: "12 sophisticated C1 phrasal verbs + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/phrasal-verbs/c1",
    type: "article",
  },
};

const VERBS = [
  { verb: "boil down to",     meaning: "to be essentially about something",        example: "It all boils down to a lack of trust." },
  { verb: "come to terms with", meaning: "to accept something difficult",          example: "She's coming to terms with the diagnosis." },
  { verb: "draw on",          meaning: "to use knowledge, experience or resources", example: "He drew on years of research for the report." },
  { verb: "fall back on",     meaning: "to use when other options fail",            example: "It's good to have savings to fall back on." },
  { verb: "get round to",     meaning: "to finally find time to do something",     example: "I keep meaning to call but never get round to it." },
  { verb: "iron out",         meaning: "to resolve small difficulties or problems", example: "We need to iron out a few details before signing." },
  { verb: "live up to",       meaning: "to be as good as expected",                example: "The film didn't live up to the hype." },
  { verb: "phase out",        meaning: "to gradually stop using something",        example: "The company is phasing out plastic packaging." },
  { verb: "single out",       meaning: "to choose or highlight one from a group",  example: "She was singled out for exceptional performance." },
  { verb: "stand up for",     meaning: "to defend someone or a principle",         example: "You need to stand up for what you believe in." },
  { verb: "bring to light",   meaning: "to reveal or expose information",          example: "The audit brought to light several accounting errors." },
  { verb: "grapple with",     meaning: "to struggle to deal with a difficult problem", example: "Governments are grappling with rising inflation." },
];

const WORD_BANK = ["boil down to", "come to terms with", "draw on", "fall back on", "iron out", "live up to", "phase out", "single out", "stand up for", "bring to light"];

const EXERCISES = [
  { before: "The conflict ",                      answer: "boils down to",      after: " a fundamental difference in values." },
  { before: "He's still struggling to ",          answer: "come to terms with", after: " the sudden loss of his job." },
  { before: "For the speech, she ",               answer: "drew on",            after: " decades of experience in the field." },
  { before: "It's wise to have an emergency fund to ", answer: "fall back on",  after: " if things go wrong." },
  { before: "We need to ",                        answer: "iron out",           after: " a few technical issues before the product launch." },
  { before: "The sequel failed to ",              answer: "live up to",         after: " the expectations set by the original." },
  { before: "The company plans to ",              answer: "phase out",          after: " single-use plastics by next year." },
  { before: "One employee was ",                  answer: "singled out",        after: " for a special achievement award." },
  { before: "Don't be afraid to ",                answer: "stand up for",       after: " your rights in the workplace." },
  { before: "The investigation ",                 answer: "brought to light",   after: " serious flaws in the approval process." },
];

const LEVELS = [
  { label: "A1", href: "/nerd-zone/phrasal-verbs",    active: false },
  { label: "B1", href: "/nerd-zone/phrasal-verbs/b1", active: false },
  { label: "B2", href: "/nerd-zone/phrasal-verbs/b2", active: false },
  { label: "C1", href: "/nerd-zone/phrasal-verbs/c1", active: true  },
];

export default async function PhrasalVerbsC1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

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
          <span className="text-slate-700 font-medium">C1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-[11px] font-black text-violet-700">Phrasal Verbs</span>
            <span className="rounded-full bg-red-500 px-3 py-0.5 text-[11px] font-black text-white">C1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Advanced</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Phrasal{" "}
            <span className="relative inline-block">
              Verbs
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 sophisticated C1 phrasal verbs that separate good English from truly fluent English — used in journalism, business and intellectual discourse.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, active }) => (
              active ? (
                <span key={label} className="rounded-xl bg-red-500 px-5 py-2 text-sm font-black text-white shadow-sm">{label}</span>
              ) : (
                <a key={label} href={href} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isLoggedIn={isLoggedIn} level="C1" wordBank={WORD_BANK} exercises={EXERCISES} loginRedirect="/nerd-zone/phrasal-verbs/c1" filename="PhrasalVerbs_C1_Worksheet_EnglishNerd.pdf" />
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
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 phrasal verbs · C1 Advanced · journalism, business & academic English</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">C1 phrasal verbs sound most natural in writing. Read quality journalism (The Guardian, The Economist) and notice how often these appear — then consciously use them in your own writing.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/phrasal-verbs/b2" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
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
