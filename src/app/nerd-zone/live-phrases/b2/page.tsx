import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import DownloadWorksheet from "../DownloadWorksheet";

export const metadata: Metadata = {
  title: "Live Phrases B2 — Upper-Intermediate English Expressions | English Nerd",
  description: "Learn 12 sophisticated B2 English expressions used in professional and academic English. Download a free printable worksheet with exercises and answer key.",
  keywords: ["live phrases B2", "upper intermediate English expressions", "B2 English phrases", "professional English expressions", "IELTS expressions"],
  alternates: { canonical: "/nerd-zone/live-phrases/b2" },
  openGraph: {
    title: "Live Phrases B2 — Upper-Intermediate English Expressions | English Nerd",
    description: "12 essential B2 everyday expressions + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/live-phrases/b2",
    type: "article",
  },
};

const PHRASES = [
  { phrase: "For what it's worth",    meaning: "My opinion may not matter, but…",              example: "For what it's worth, I think you made the right call." },
  { phrase: "Having said that",       meaning: "Despite what was just said",                   example: "It's expensive. Having said that, the quality is superb." },
  { phrase: "All things considered",  meaning: "Taking everything into account",               example: "All things considered, the event was a success." },
  { phrase: "More often than not",    meaning: "Usually / in most cases",                      example: "More often than not, the simplest solution is the best." },
  { phrase: "On the face of it",      meaning: "At first glance / apparently",                 example: "On the face of it, the proposal sounds reasonable." },
  { phrase: "Read between the lines", meaning: "To understand hidden or implied meaning",      example: "His message seemed friendly, but read between the lines." },
  { phrase: "Up in the air",          meaning: "Uncertain / not yet decided",                  example: "The launch date is still up in the air." },
  { phrase: "Touch base",             meaning: "To briefly make contact / check in",           example: "Let's touch base next week to see how things are going." },
  { phrase: "Push the envelope",      meaning: "To exceed normal limits / try new things",     example: "This company always pushes the envelope with its designs." },
  { phrase: "In the long run",        meaning: "Over a long period of time / eventually",      example: "Saving money now will pay off in the long run." },
  { phrase: "By the same token",      meaning: "For the same reason / similarly",              example: "He works hard; by the same token, he expects the same from others." },
  { phrase: "For the time being",     meaning: "For now / temporarily",                        example: "For the time being, let's keep this between us." },
];

const WORD_BANK = ["for what it's worth", "having said that", "all things considered", "more often than not", "on the face of it", "read between the lines", "up in the air", "touch base", "push the envelope", "in the long run"];

const EXERCISES = [
  { before: "",                                  answer: "For what it's worth",      after: ", I think you made the right decision."                    },
  { before: "It's a difficult situation. ",      answer: "Having said that",         after: ", I believe it can still be resolved."                     },
  { before: "",                                  answer: "All things considered",    after: ", the project was a success despite the delays."            },
  { before: "",                                  answer: "More often than not",      after: ", the simplest solution turns out to be the best one."      },
  { before: "",                                  answer: "On the face of it",        after: ", the proposal sounds reasonable, but I have some concerns." },
  { before: "His message seemed friendly, but you need to ", answer: "read between the lines", after: "."                                              },
  { before: "The launch date is still ",         answer: "up in the air",            after: " — we need another meeting to confirm."                    },
  { before: "Let's ",                            answer: "touch base",               after: " next week to see how things are going."                   },
  { before: "This company always tries to ",     answer: "push the envelope",        after: " with its product designs."                                },
  { before: "Saving money now will pay off ",    answer: "in the long run",          after: "."                                                         },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/live-phrases",     active: false },
  { label: "B1",    href: "/nerd-zone/live-phrases/b1",  active: false },
  { label: "B2",    href: "/nerd-zone/live-phrases/b2",  active: true  },
  { label: "C1", href: "/nerd-zone/live-phrases/c1",  active: false },
];

export default async function LivePhrasesB2Page() {
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
          <span className="text-slate-700 font-medium">B2</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-700">Live Phrases</span>
            <span className="rounded-full bg-orange-500 px-3 py-0.5 text-[11px] font-black text-white">B2</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Upper-Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Live{" "}
            <span className="relative inline-block">
              Phrases
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 sophisticated B2 expressions used in professional emails, presentations and nuanced conversations — phrases that show you can think in English.
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
            <DownloadWorksheet isPro={isPro} level="B2" title="Live Phrases" wordBank={WORD_BANK} exercises={EXERCISES} filename="LivePhrases_B2_Worksheet_EnglishNerd.pdf" />
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
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 expressions · B2 Upper-Intermediate · professional & academic English</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">At B2, these phrases help you sound sophisticated and balanced. Use them in emails and reports to show you can see multiple perspectives — they're especially powerful in writing.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/live-phrases/b1" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← B1
          </a>
          <a href="/nerd-zone/live-phrases/c1" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            C1 →
          </a>
        </div>
      </div>
    </div>
  );
}
