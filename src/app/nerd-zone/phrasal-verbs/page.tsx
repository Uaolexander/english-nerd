import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DownloadWorksheet from "./DownloadWorksheet";

export const metadata: Metadata = {
  title: "Phrasal Verbs A1 — Beginner English | English Nerd",
  description: "Learn 12 essential A1 phrasal verbs with meanings and examples. Download a free printable fill-in-the-blank worksheet with answer key — perfect for beginners.",
  keywords: ["phrasal verbs A1", "beginner phrasal verbs", "English phrasal verbs worksheet", "A1 English exercises", "learn phrasal verbs"],
  alternates: { canonical: "/nerd-zone/phrasal-verbs" },
  openGraph: {
    title: "Phrasal Verbs A1 — Beginner English | English Nerd",
    description: "12 essential A1 phrasal verbs + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/phrasal-verbs",
    type: "article",
  },
};

const VERBS = [
  { verb: "wake up",  meaning: "to stop sleeping",                    example: "I wake up at 7 every morning." },
  { verb: "get up",   meaning: "to rise from bed",                    example: "She gets up and makes coffee." },
  { verb: "turn on",  meaning: "to start a device",                   example: "Can you turn on the TV?" },
  { verb: "turn off", meaning: "to stop a device",                    example: "Turn off the lights when you leave." },
  { verb: "put on",   meaning: "to dress yourself in",                example: "He puts on his coat before going out." },
  { verb: "take off", meaning: "to remove clothing",                  example: "She takes off her shoes at the door." },
  { verb: "look for", meaning: "to try to find something",            example: "I'm looking for my phone." },
  { verb: "come in",  meaning: "to enter a place",                    example: "Come in! The door is open." },
  { verb: "go out",   meaning: "to leave / socialise",                example: "They go out every Friday night." },
  { verb: "pick up",  meaning: "to lift something",                   example: "Can you pick up that box?" },
  { verb: "sit down", meaning: "to take a seat",                      example: "Please sit down and relax." },
  { verb: "stand up", meaning: "to rise from a sitting position",     example: "Stand up when the teacher enters." },
];

const WORD_BANK = ["come in", "get up", "turn on", "turn off", "put on", "take off", "look for", "wake up", "pick up", "go out"];

const EXERCISES = [
  { before: "",                                    answer: "Come in",    after: ", please! The teacher is ready to start the lesson."  },
  { before: "I usually ",                          answer: "get up",     after: " at 7 o'clock every morning."                         },
  { before: "Can you ",                            answer: "turn on",    after: " the lights? It's too dark in here."                  },
  { before: "Please ",                             answer: "turn off",   after: " your phone — the film is about to start."            },
  { before: "It's cold outside. Don't forget to ", answer: "put on",     after: " your coat before you leave."                         },
  { before: "I always ",                           answer: "take off",   after: " my shoes before entering the house."                 },
  { before: "I usually ",                          answer: "wake up",    after: " very early because of the birds outside."            },
  { before: "Have you seen my keys? I'm ",         answer: "looking for", after: " them everywhere."                                  },
  { before: "Can you ",                            answer: "pick up",    after: " that box? It's too heavy for me."                   },
  { before: "They love to ",                       answer: "go out",     after: " and try new restaurants at the weekend."             },
];

const LEVELS = [
  { label: "A1", href: "/nerd-zone/phrasal-verbs",     color: "bg-emerald-500" },
  { label: "B1", href: "/nerd-zone/phrasal-verbs/b1",  color: "bg-violet-500" },
  { label: "B2", href: "/nerd-zone/phrasal-verbs/b2",  color: "bg-orange-500" },
  { label: "C1", href: "/nerd-zone/phrasal-verbs/c1",  color: "bg-red-500" },
];

export default async function PhrasalVerbsA1Page() {
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
          <span className="text-slate-700 font-medium">Phrasal Verbs · A1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-[11px] font-black text-violet-700">Phrasal Verbs</span>
            <span className="rounded-full bg-emerald-500 px-3 py-0.5 text-[11px] font-black text-white">A1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Beginner</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Phrasal{" "}
            <span className="relative inline-block">
              Verbs
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            Start with these 12 essential A1 phrasal verbs. They appear in everyday conversations, instructions and short texts — master them first.
          </p>
        </div>

        {/* Level nav + download */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, color }) => (
              label === "A1" ? (
                <span key={label} className={`rounded-xl ${color} px-5 py-2 text-sm font-black text-white shadow-sm`}>{label}</span>
              ) : (
                <a key={label} href={href} className={`rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition`}>{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isLoggedIn={isLoggedIn} level="A1" wordBank={WORD_BANK} exercises={EXERCISES} loginRedirect="/nerd-zone/phrasal-verbs" filename="PhrasalVerbs_A1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        {/* Table */}
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
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-400">12 phrasal verbs · A1 Beginner · everyday English</span></div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">Phrasal verbs are easier to remember in context. Say the whole example sentence out loud 3 times — your brain stores it as a chunk, not a translation.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            Next level:
            <a href="/nerd-zone/phrasal-verbs/b1" className="font-bold text-violet-600 hover:underline">B1 →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
