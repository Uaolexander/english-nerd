import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DownloadWorksheet from "./DownloadWorksheet";

export const metadata: Metadata = {
  title: "Live Phrases A1 — Everyday English Expressions | English Nerd",
  description: "Learn 12 essential A1 everyday English expressions that native speakers use constantly. Download a free printable fill-in-the-blank worksheet with answer key.",
  keywords: ["live phrases A1", "everyday English expressions", "natural English phrases", "A1 English expressions", "beginner English phrases"],
  alternates: { canonical: "/nerd-zone/live-phrases" },
  openGraph: {
    title: "Live Phrases A1 — Everyday English Expressions | English Nerd",
    description: "12 essential A1 everyday expressions + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/live-phrases",
    type: "article",
  },
};

const PHRASES = [
  { phrase: "Sounds good",        meaning: "That's agreeable / I like that idea",      example: "— Let's meet at 3. — Sounds good, see you then." },
  { phrase: "No worries",         meaning: "It's fine / don't worry about it",          example: "— Sorry I'm late! — No worries, we just started." },
  { phrase: "Go ahead",           meaning: "Please proceed / feel free",                example: "— Can I use your pen? — Go ahead." },
  { phrase: "I see",              meaning: "I understand",                               example: "— The deadline is Friday. — I see, I'll prioritise it." },
  { phrase: "Fair enough",        meaning: "I accept that / I understand",              example: "— I can't come Friday. — Fair enough, we'll reschedule." },
  { phrase: "Bear with me",       meaning: "Please be patient for a moment",            example: "Bear with me — the file is taking a while to load." },
  { phrase: "By all means",       meaning: "Of course / please go ahead",               example: "— Can I ask you something? — By all means." },
  { phrase: "No wonder",          meaning: "It makes perfect sense / not surprising",   example: "You've been working 14-hour days. No wonder you're tired." },
  { phrase: "My bad",             meaning: "My mistake / I'm sorry",                    example: "I forgot to reply. My bad — I'll do it now." },
  { phrase: "Hang on",            meaning: "Wait a moment",                             example: "Hang on — let me check the schedule first." },
  { phrase: "Cheers",             meaning: "Thank you / goodbye (informal, British)",   example: "— Here's your coffee. — Cheers!" },
  { phrase: "That said",          meaning: "Despite what I just said (introduces contrast)", example: "It's a tough course. That said, I learned a lot." },
];

const WORD_BANK = ["sounds good", "no worries", "go ahead", "fair enough", "bear with me", "by all means", "my bad", "hang on", "cheers", "that said"];

const EXERCISES = [
  { before: "— Can I use your computer? — ", answer: "Go ahead",      after: ", it's not being used right now."             },
  { before: "Sorry I'm late! — ",            answer: "No worries",    after: ", we haven't started yet."                    },
  { before: "— Let's meet at 3 pm. — ",      answer: "Sounds good",   after: ", I'll see you then."                         },
  { before: "— Can I ask you something? — ", answer: "By all means",  after: ", what would you like to know?"               },
  { before: "I forgot to send the email. ",   answer: "My bad",        after: " — I'll do it right now."                    },
  { before: "Just ",                          answer: "bear with me",  after: " for a second — I'm finding the file."       },
  { before: "— I can't come on Friday. — ",  answer: "Fair enough",   after: ", we'll move it to Saturday."                 },
  { before: "",                               answer: "Hang on",       after: " — let me check the schedule before we confirm." },
  { before: "Thanks for your help! — ",      answer: "Cheers",        after: ", anytime!"                                   },
  { before: "It's a tough job. ",            answer: "That said",     after: ", the pay is excellent."                      },
];

const LEVELS = [
  { label: "A1", href: "/nerd-zone/live-phrases",     color: "bg-[#F5DA20] text-black" },
  { label: "B1", href: "/nerd-zone/live-phrases/b1",  color: "bg-violet-500 text-white" },
  { label: "B2", href: "/nerd-zone/live-phrases/b2",  color: "bg-orange-500 text-white" },
  { label: "C1", href: "/nerd-zone/live-phrases/c1",  color: "bg-sky-500 text-white" },
];

export default async function LivePhrasesA1Page() {
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
          <span className="text-slate-700 font-medium">Live Phrases · A1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-700">Live Phrases</span>
            <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">A1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Beginner</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Live{" "}
            <span className="relative inline-block">
              Phrases
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 essential A1 expressions that native speakers use every day — in shops, offices, and casual conversations. Start here.
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
            <DownloadWorksheet isLoggedIn={isLoggedIn} level="A1" title="Live Phrases" wordBank={WORD_BANK} exercises={EXERCISES} loginRedirect="/nerd-zone/live-phrases" filename="LivePhrases_A1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        {/* Table */}
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
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 expressions · A1 Beginner · everyday spoken English</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">Start using these phrases in everyday conversation this week. Native speakers use them constantly — even 2–3 of these will immediately make your English sound more natural.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            Next level:
            <a href="/nerd-zone/live-phrases/b1" className="font-bold text-violet-600 hover:underline">B1 →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
