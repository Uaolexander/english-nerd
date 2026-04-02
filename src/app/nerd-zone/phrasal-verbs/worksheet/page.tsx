import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PrintButton from "./PrintButton";

export const metadata = {
  title: "Phrasal Verbs A1 Worksheet — English Nerd",
};

const WORD_BANK = [
  "come in", "get up", "turn on", "turn off",
  "put on", "take off", "look for", "wake up",
  "pick up", "go out",
];

const EXERCISES: { before: string; answer: string; after: string }[] = [
  { before: "",                               answer: "Come in",    after: ", please! The teacher is ready to start the lesson."   },
  { before: "I usually ",                     answer: "get up",     after: " at 7 o'clock every morning."                          },
  { before: "Can you ",                       answer: "turn on",    after: " the lights? It's too dark in here."                   },
  { before: "Please ",                        answer: "turn off",   after: " your phone — the film is about to start."             },
  { before: "It's cold outside. Don't forget to ", answer: "put on", after: " your coat before you leave."                        },
  { before: "I always ",                      answer: "take off",   after: " my shoes before entering the house."                  },
  { before: "I usually ",                     answer: "wake up",    after: " very early because of the birds outside."             },
  { before: "Have you seen my keys? I'm ",    answer: "looking for", after: " them everywhere."                                   },
  { before: "Can you ",                       answer: "pick up",    after: " that box? It's too heavy for me."                    },
  { before: "They love to ",                  answer: "go out",     after: " and try new restaurants at the weekend."              },
];

export default async function WorksheetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/nerd-zone/phrasal-verbs/worksheet");
  }

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: A4; margin: 15mm 18mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Screen wrapper */}
      <div className="min-h-screen bg-slate-100 py-10 print:bg-white print:py-0">

        {/* Screen-only controls */}
        <div className="mx-auto mb-6 flex max-w-[700px] items-center justify-between print:hidden">
          <a
            href="/nerd-zone/phrasal-verbs"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back
          </a>
          <PrintButton />
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* PAGE 1 — Exercise                                             */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="mx-auto w-full max-w-[700px] bg-white shadow-xl print:shadow-none print:max-w-none">

          {/* Header bar */}
          <div className="flex items-center justify-between bg-[#F5DA20] px-8 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black">
                <span className="text-[11px] font-black text-[#F5DA20]">EN</span>
              </div>
              <span className="text-sm font-black text-black">EnglishNerd.cc</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#F5DA20]">A1 Level</span>
              <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">Worksheet</span>
            </div>
          </div>

          <div className="px-8 pt-8 pb-10">

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Phrasal Verbs</h1>
              <p className="mt-1 text-lg font-semibold text-slate-500">Fill in the Blanks</p>
              <div className="mt-3 h-1 w-16 rounded-full bg-[#F5DA20]" />
            </div>

            {/* Word bank */}
            <div className="mb-6 overflow-hidden rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50">
              <div className="border-b border-violet-200 bg-violet-100 px-5 py-2.5">
                <p className="text-[11px] font-black uppercase tracking-widest text-violet-700">Word Bank — use each verb once</p>
              </div>
              <div className="flex flex-wrap gap-2 px-5 py-4">
                {WORD_BANK.map((v) => (
                  <span
                    key={v}
                    className="rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-violet-800 shadow-sm"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <p className="mb-5 text-sm italic text-slate-500">
              Fill in each blank with the correct phrasal verb from the word bank above. Use each verb once. Change the form if necessary.
            </p>

            {/* Exercises */}
            <ol className="space-y-5">
              {EXERCISES.map(({ before, after }, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5DA20] text-[11px] font-black text-black">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-[15px] leading-relaxed text-slate-800">
                    {before}
                    <span className="inline-block w-32 border-b-2 border-slate-400 align-bottom mx-1" />
                    {after}
                  </p>
                </li>
              ))}
            </ol>

            {/* Score box */}
            <div className="mt-10 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
              <span className="text-sm font-semibold text-slate-500">Name: <span className="inline-block w-40 border-b border-slate-400" /></span>
              <span className="text-sm font-semibold text-slate-500">Score: <span className="font-black text-slate-800">____ / 10</span></span>
            </div>

          </div>

          {/* Page footer */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-8 py-3">
            <span className="text-[11px] text-slate-400">EnglishNerd.cc — Free for registered users</span>
            <span className="text-[11px] text-slate-400">Page 1 of 2</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* PAGE 2 — Answer Key                                           */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="mx-auto mt-6 w-full max-w-[700px] bg-white shadow-xl print:shadow-none print:max-w-none print:mt-0 print:break-before-page">

          {/* Header bar */}
          <div className="flex items-center justify-between bg-[#F5DA20] px-8 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black">
                <span className="text-[11px] font-black text-[#F5DA20]">EN</span>
              </div>
              <span className="text-sm font-black text-black">EnglishNerd.cc</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#F5DA20]">A1 Level</span>
              <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">Answer Key</span>
            </div>
          </div>

          <div className="px-8 pt-8 pb-10">

            {/* Title */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                  <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">Answer Key</h1>
                  <p className="text-sm text-slate-500">Phrasal Verbs — Fill in the Blanks · A1</p>
                </div>
              </div>
              <div className="mt-4 h-1 w-16 rounded-full bg-emerald-400" />
            </div>

            {/* Answers */}
            <ol className="space-y-4">
              {EXERCISES.map(({ before, answer, after }, i) => (
                <li key={i} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-black text-emerald-700">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-[15px] leading-relaxed text-slate-800">
                    {before}
                    <span className="font-black text-red-600">{answer}</span>
                    {after}
                  </p>
                </li>
              ))}
            </ol>

          </div>

          {/* Page footer */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-8 py-3">
            <span className="text-[11px] text-slate-400">EnglishNerd.cc — Free for registered users</span>
            <span className="text-[11px] text-slate-400">Page 2 of 2</span>
          </div>
        </div>

        {/* Bottom spacing (screen only) */}
        <div className="h-10 print:hidden" />
      </div>
    </>
  );
}
