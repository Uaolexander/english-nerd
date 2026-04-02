import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Phrasal Verbs A1 — Nerd Zone — English Nerd",
  description:
    "Essential A1 phrasal verbs with meanings and examples. Download a free fill-in-the-blank worksheet.",
  alternates: { canonical: "/nerd-zone/phrasal-verbs" },
};

const VERBS = [
  { verb: "wake up",  meaning: "to stop sleeping",           example: "I wake up at 7 every morning." },
  { verb: "get up",   meaning: "to rise from bed",           example: "She gets up and makes coffee." },
  { verb: "turn on",  meaning: "to start a device",          example: "Can you turn on the TV?" },
  { verb: "turn off", meaning: "to stop a device",           example: "Turn off the lights when you leave." },
  { verb: "put on",   meaning: "to dress yourself in",       example: "He puts on his coat before going out." },
  { verb: "take off", meaning: "to remove clothing",         example: "She takes off her shoes at the door." },
  { verb: "look for", meaning: "to try to find something",   example: "I'm looking for my phone." },
  { verb: "come in",  meaning: "to enter a place",           example: "Come in! The door is open." },
  { verb: "go out",   meaning: "to leave / socialise",       example: "They go out every Friday night." },
  { verb: "pick up",  meaning: "to lift something",          example: "Can you pick up that box?" },
  { verb: "sit down", meaning: "to take a seat",             example: "Please sit down and relax." },
  { verb: "stand up", meaning: "to rise from a sitting position", example: "Stand up when the teacher enters." },
];

export default async function PhrasalVerbsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">Phrasal Verbs</span>
        </nav>

        {/* Hero */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-[11px] font-black text-violet-700">Phrasal Verbs</span>
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-700">A1</span>
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

        {/* Level tabs — expandable in future */}
        <div className="mt-8 flex items-center gap-2">
          <button className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-black text-white shadow-sm">
            A1
          </button>
          <button className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed" disabled>
            A2 <span className="ml-1 text-[10px] font-normal opacity-60">soon</span>
          </button>
          <button className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed" disabled>
            B1 <span className="ml-1 text-[10px] font-normal opacity-60">soon</span>
          </button>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b-2 border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-5 py-4">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-700">Phrasal Verb</span>
            </div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-5 py-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Meaning</span>
            </div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-5 py-4">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Example</span>
            </div>
          </div>

          {/* Rows */}
          <div>
            {VERBS.map(({ verb, meaning, example }, i) => (
              <div
                key={verb}
                className={`group grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${
                  i % 2 === 1 ? "bg-slate-50/40" : "bg-white"
                }`}
              >
                <div className="flex items-center px-5 py-3.5">
                  <span className="text-sm font-black text-slate-900">{verb}</span>
                </div>
                <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-5 py-3.5 group-hover:bg-emerald-50/60">
                  <span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">
                    {meaning}
                  </span>
                </div>
                <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-5 py-3.5 group-hover:bg-sky-50/60">
                  <span className="text-sm italic text-sky-800">{example}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Table footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
            <span className="text-xs text-slate-400">12 phrasal verbs · A1 level · everyday English</span>
          </div>
        </div>

        {/* Worksheet download */}
        <div className="mt-8 flex flex-col gap-5 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-slate-50 p-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-violet-500 px-2.5 py-0.5 text-[10px] font-black text-white">FREE WORKSHEET</span>
              <span className="text-[10px] text-slate-400 font-medium">For registered users</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Phrasal Verbs A1 — Fill in the Blanks
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A printable PDF worksheet with 10 exercises + a full answer key. Use it in class or for self-study.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            {isLoggedIn ? (
              <a
                href="/nerd-zone/phrasal-verbs/worksheet"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-[#F5DA20] px-6 py-3.5 text-sm font-black text-black shadow-md hover:opacity-90 transition"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>
                Open Worksheet
              </a>
            ) : (
              <>
                <a
                  href="/login?next=/nerd-zone/phrasal-verbs/worksheet"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-[#F5DA20] px-6 py-3.5 text-sm font-black text-black shadow-md hover:opacity-90 transition"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Log in to download
                </a>
                <a
                  href="/register"
                  className="text-center text-xs text-slate-500 hover:text-slate-700 transition underline underline-offset-2"
                >
                  No account? Register free
                </a>
              </>
            )}
          </div>
        </div>

        {/* Tip */}
        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">
            💡
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">
              Phrasal verbs are easier to remember in context. Don&apos;t just memorise the meaning — say the whole example sentence out loud 3 times. Your brain stores it as a chunk, not a translation.
            </p>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 border-t border-slate-100 pt-6">
          <a
            href="/nerd-zone"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
        </div>

      </div>
    </div>
  );
}
