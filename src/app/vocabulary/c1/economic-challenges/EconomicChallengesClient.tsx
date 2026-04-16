"use client";

import { useState, useEffect } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import VocabRecommendations from "@/components/VocabRecommendations";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Economists discuss the main ___ facing the global economy.", options: ["hobbies", "challenges", "colours", "trends"], answer: 1 },
  { q: "Rising ___ has eroded the purchasing power of ordinary people.", options: ["weather", "music", "inflation", "taxation"], answer: 2 },
  { q: "___ measures involve cutting public spending to reduce deficits.", options: ["Austerity", "Generous", "Holiday", "Cultural"], answer: 0 },
  { q: "Central banks used ___ to inject money into the economy.", options: ["budget cuts", "tax increases", "quantitative easing", "austerity"], answer: 2 },
  { q: "___ policy refers to central bank decisions about interest rates.", options: ["Social", "Cultural", "Monetary", "Personal"], answer: 2 },
  { q: "A ___ is a period when GDP falls for two or more quarters.", options: ["celebration", "recession", "improvement", "boom"], answer: 1 },
  { q: "The ___ deficit refers to the gap between spending and revenue.", options: ["personal", "minor", "fiscal", "cultural"], answer: 2 },
  { q: "Unemployment and stagnation are closely ___.", options: ["confused", "compared", "contrasted", "correlated"], answer: 3 },
  { q: "Structural ___ change the fundamental workings of an economy.", options: ["holidays", "delays", "collapses", "reforms"], answer: 3 },
  { q: "The ___ between developed and emerging economies continues to narrow.", options: ["colour", "weather", "gap", "similarity"], answer: 2 },
  { q: "A ___ tax is a percentage of earnings paid to the government.", options: ["income", "value", "trade", "property"], answer: 0 },
  { q: "The ___ of a country is the total value of goods and services produced.", options: ["inflation", "GDP", "deficit", "tax"], answer: 1 },
  { q: "To ___ the economy means to encourage growth.", options: ["stagnate", "stimulate", "deflate", "restrict"], answer: 1 },
  { q: "A ___ policy involves how governments spend and collect taxes.", options: ["monetary", "fiscal", "cultural", "social"], answer: 1 },
  { q: "A ___ is a period of sustained economic growth.", options: ["recession", "deflation", "boom", "deficit"], answer: 2 },
  { q: "___ is a sustained fall in the general level of prices.", options: ["Inflation", "Deflation", "Austerity", "Stagnation"], answer: 1 },
  { q: "An emerging ___ is a developing country with rapid growth.", options: ["deficit", "economy", "recession", "policy"], answer: 1 },
  { q: "To ___ means to officially reduce the value of a currency.", options: ["inflate", "deflate", "devalue", "stimulate"], answer: 2 },
  { q: "The ___ rate measures the proportion of people without work.", options: ["inflation", "fiscal", "unemployment", "interest"], answer: 2 },
  { q: "___ refers to the amount of goods and services bought and sold internationally.", options: ["Trade", "Inflation", "Deficit", "Austerity"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Economic Challenges",
  subtitle: "C1 economics vocabulary — dialogue",
  level: "C1",
  keyRule: "Economics vocabulary: inflation · austerity · quantitative easing · monetary policy · recession · fiscal · structural reforms",
  exercises: [
    {
      number: 1, title: "Dialogue Exercise", difficulty: "Advanced",
      instruction: "Choose the correct word for each gap.",
      questions: [
        "Two economists discuss the main ___ facing the global economy. (challenges / hobbies / colours)",
        "Rising ___ has eroded the purchasing power of ordinary people. (inflation / weather / music)",
        "Governments responded with ___ measures — cutting spending to reduce the deficit. (austerity / generous / holiday)",
        "Central banks used ___ to inject money into the economy. (quantitative easing / tax increases / budget cuts)",
        "The ___ policy of keeping interest rates low stimulated borrowing. (monetary / cultural / social)",
        "The country experienced a severe ___ — GDP fell for three consecutive quarters. (recession / celebration / improvement)",
        "Increasing the ___ deficit can stimulate growth in the short term. (fiscal / personal / minor)",
        "Rising unemployment is ___ with economic stagnation. (correlated / confused / compared)",
        "We need structural ___ to make the economy more competitive long-term. (reforms / holidays / delays)",
        "The ___ between developed and emerging economies continues to narrow. (gap / colour / weather)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Dialogue Exercise", answers: ["challenges", "inflation", "austerity", "quantitative easing", "monetary", "recession", "fiscal", "correlated", "reforms", "gap"] },
  ],
};

/*
  Dialogue: "Economic Challenges"
  Professor Maria (economist) and Dr. James (analyst) discuss economic issues.
  Each QUESTION has a sentence with one blank and 3 options.
  Only one option is clearly correct from context.
*/
type Question = {
  id: number;
  before: string;
  after: string;
  options: string[];
  correct: string;
  explanation: string;
  speaker?: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    speaker: "Narrator",
    before: "Two economists discuss the main",
    after: "facing the global economy.",
    options: ["challenges", "hobbies", "colours"],
    correct: "challenges",
    explanation: "Economists discuss 'challenges' facing the economy — the difficulties and problems that need to be addressed.",
  },
  {
    id: 2,
    speaker: "James",
    before: "Rising",
    after: "has eroded the purchasing power of ordinary people.",
    options: ["inflation", "weather", "music"],
    correct: "inflation",
    explanation: "'Inflation' is the sustained increase in prices that reduces purchasing power. Weather and music are unrelated to economics.",
  },
  {
    id: 3,
    speaker: "Maria",
    before: "Governments responded with",
    after: "measures — cutting spending to reduce the deficit.",
    options: ["austerity", "generous", "holiday"],
    correct: "austerity",
    explanation: "'Austerity' measures involve cutting public spending to reduce budget deficits. It is an economic policy, not a mood or a break.",
  },
  {
    id: 4,
    speaker: "James",
    before: "Central banks used",
    after: "to inject money into the economy.",
    options: ["quantitative easing", "tax increases", "budget cuts"],
    correct: "quantitative easing",
    explanation: "'Quantitative easing' is a monetary policy tool where central banks create money to stimulate the economy. Tax increases and budget cuts do the opposite.",
  },
  {
    id: 5,
    speaker: "Maria",
    before: "The",
    after: "policy of keeping interest rates low stimulated borrowing.",
    options: ["monetary", "cultural", "social"],
    correct: "monetary",
    explanation: "'Monetary policy' refers to central bank decisions about interest rates and money supply. It is not cultural or social policy.",
  },
  {
    id: 6,
    speaker: "James",
    before: "The country experienced a severe",
    after: "— GDP fell for three consecutive quarters.",
    options: ["recession", "celebration", "improvement"],
    correct: "recession",
    explanation: "A 'recession' is defined as two or more consecutive quarters of declining GDP. A celebration and improvement are the opposite of economic decline.",
  },
  {
    id: 7,
    speaker: "Maria",
    before: "Increasing the",
    after: "deficit can stimulate growth in the short term.",
    options: ["fiscal", "personal", "minor"],
    correct: "fiscal",
    explanation: "A 'fiscal deficit' refers to the gap between government spending and revenue. 'Fiscal' relates to government finances specifically.",
  },
  {
    id: 8,
    speaker: "James",
    before: "Rising unemployment is",
    after: "with economic stagnation.",
    options: ["correlated", "confused", "compared"],
    correct: "correlated",
    explanation: "'Correlated' means there is a statistical relationship between two variables. Unemployment and economic stagnation tend to move together.",
  },
  {
    id: 9,
    speaker: "Maria",
    before: "We need structural",
    after: "to make the economy more competitive long-term.",
    options: ["reforms", "holidays", "delays"],
    correct: "reforms",
    explanation: "'Structural reforms' are changes to the fundamental workings of an economy, such as labour laws or market regulation.",
  },
  {
    id: 10,
    speaker: "James",
    before: "The",
    after: "between developed and emerging economies continues to narrow.",
    options: ["gap", "colour", "weather"],
    correct: "gap",
    explanation: "The 'gap' between developed and emerging economies refers to differences in GDP, living standards, and development levels.",
  },
];

const VOCAB_FOCUS = [
  { word: "austerity", def: "strict government spending cuts to reduce a budget deficit" },
  { word: "monetary policy", def: "central bank decisions about interest rates and money supply" },
  { word: "fiscal", def: "relating to government revenue and expenditure" },
  { word: "recession", def: "a period of economic decline lasting at least two quarters" },
  { word: "quantitative easing", def: "a policy of creating money to stimulate the economy" },
];

export default function EconomicChallengesClient() {
  const isPro = useIsPro();
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [checked, setChecked] = useState(false);

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] != null).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const correctCount = checked
    ? QUESTIONS.reduce((n, q) => n + (answers[q.id] === q.correct ? 1 : 0), 0)
    : null;
  const percent = correctCount !== null ? Math.round((correctCount / QUESTIONS.length) * 100) : null;

  function pick(id: number, val: string) {
    if (checked) return;
    setAnswers((p) => ({ ...p, [id]: val }));
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers({});
    setChecked(false);
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "vocabulary", level: "c1", slug: "economic-challenges", exerciseNo: 1, score: percent, questionsTotal: QUESTIONS.length }),
    }).catch(() => {});
  }, [checked, percent]);

  const grade =
    percent === null ? null :
    percent >= 80 ? "great" :
    percent >= 60 ? "ok" : "low";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["C1", "/vocabulary/c1"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">Economic Challenges</span>
      </nav>

      {/* Hero */}
      <div className="mt-6 flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-sky-400 px-3 py-0.5 text-[11px] font-black text-black">C1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Dialogue</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">10 questions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
            Economic{" "}
            <span className="relative inline-block">
              Challenges
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
            Two economists debate the main economic issues facing modern societies. Read the dialogue and choose the correct word for each gap.
          </p>
        </div>
      </div>

      {/* How-to */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { n: "1", label: "Read the sentence", sub: "understand the context" },
          { n: "2", label: "Choose the word", sub: "that fits the meaning" },
          { n: "3", label: "Check your answers", sub: "and read the explanations" },
        ].map(({ n, label, sub }) => (
          <div key={n} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20] text-xs font-black text-black shadow-sm">{n}</div>
            <div>
              <div className="text-sm font-bold text-slate-800">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3-col grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr_240px]">

        {/* Left ad */}
        <AdUnit variant="sidebar-light" />

        {/* Main */}
        <div className="min-w-0 space-y-5">

          {/* Score panel */}
          {checked && percent !== null && (
            <div className={`flex items-center gap-5 rounded-2xl border px-6 py-5 ${
              grade === "great" ? "border-emerald-200 bg-emerald-50" :
              grade === "ok"   ? "border-amber-200 bg-amber-50" :
                                 "border-red-200 bg-red-50"
            }`}>
              <div className={`text-5xl font-black tabular-nums leading-none ${
                grade === "great" ? "text-emerald-600" :
                grade === "ok"   ? "text-amber-600" :
                                   "text-red-600"
              }`}>
                {percent}<span className="text-2xl">%</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-700">{correctCount} out of {QUESTIONS.length} correct</div>
                <div className="mt-2.5 h-2 w-full rounded-full bg-black/8 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      grade === "great" ? "bg-emerald-500" :
                      grade === "ok"   ? "bg-amber-400" :
                                         "bg-red-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {grade === "great" ? "Excellent! You have strong C1 economics vocabulary." :
                   grade === "ok"   ? "Good effort! Read the explanations and try again." :
                                      "Keep practising! Review the explanations below to improve."}
                </p>
              </div>
              <div className="text-4xl">{grade === "great" ? "🎉" : grade === "ok" ? "💪" : "📖"}</div>
            </div>
          )}

          {/* Questions card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">

            {/* Card header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div>
                <h2 className="text-[15px] font-black text-slate-900">Choose the correct word</h2>
                <p className="text-xs text-slate-400 mt-0.5">Read each sentence and select the word that fits best.</p>
              </div>
              {!checked ? (
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                      style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 tabular-nums">{answeredCount}/{QUESTIONS.length}</span>
                </div>
              ) : (
                <span className={`rounded-full px-3 py-1 text-xs font-black border ${
                  grade === "great" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                  grade === "ok"   ? "border-amber-200 bg-amber-50 text-amber-700" :
                                     "border-red-200 bg-red-50 text-red-700"
                }`}>
                  {correctCount}/{QUESTIONS.length}
                </span>
              )}
            </div>

            {/* Questions list */}
            <div className="divide-y divide-slate-50">
              {QUESTIONS.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = checked && chosen === q.correct;
                const isWrong   = checked && chosen != null && chosen !== q.correct;

                return (
                  <div
                    key={q.id}
                    className={`px-6 py-6 transition-colors duration-200 ${
                      isCorrect ? "bg-emerald-50/60" :
                      isWrong   ? "bg-red-50/60" : ""
                    }`}
                  >
                    <div className="flex gap-4">

                      {/* Number */}
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect      ? "bg-emerald-500 text-white" :
                        isWrong        ? "bg-red-500 text-white" :
                        chosen != null ? "bg-[#F5DA20] text-black" :
                                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>

                      <div className="flex-1 min-w-0">

                        {/* Speaker label */}
                        {q.speaker && (
                          <div className={`mb-1.5 text-[11px] font-black uppercase tracking-wider ${
                            q.speaker === "Narrator" ? "text-slate-300" :
                            q.speaker === "James"    ? "text-violet-500" :
                            "text-orange-500"
                          }`}>
                            {q.speaker}
                          </div>
                        )}

                        {/* Sentence with gap */}
                        <p className="text-[16px] text-slate-800 leading-relaxed font-medium">
                          {q.before}{" "}
                          <span className={`inline-block min-w-[80px] rounded-lg px-3 py-0.5 text-center font-black transition-all ${
                            isCorrect ? "bg-emerald-100 text-emerald-700" :
                            isWrong   ? "bg-red-100 text-red-600 line-through" :
                            chosen    ? "bg-[#F5DA20]/30 text-slate-800" :
                            "border-2 border-dashed border-slate-200 text-slate-300"
                          }`}>
                            {chosen ?? "???"}
                          </span>
                          {" "}{q.after}
                        </p>

                        {/* Corrected word if wrong */}
                        {isWrong && (
                          <p className="mt-1 text-sm font-semibold text-emerald-600">
                            ✓ Correct answer: <span className="font-black">{q.correct}</span>
                          </p>
                        )}

                        {/* Options */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {q.options.map((opt) => {
                            const sel     = chosen === opt;
                            const ok      = checked && sel && opt === q.correct;
                            const bad     = checked && sel && opt !== q.correct;
                            const reveal  = checked && !sel && opt === q.correct;

                            return (
                              <button
                                key={opt}
                                onClick={() => pick(q.id, opt)}
                                disabled={checked}
                                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-150
                                  ${ok     ? "bg-emerald-500 text-white shadow-sm" :
                                    bad    ? "bg-red-500 text-white shadow-sm" :
                                    reveal ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700" :
                                    sel    ? "bg-[#F5DA20] text-black shadow-sm" :
                                    checked ? "border border-slate-100 bg-slate-50 text-slate-300" :
                                    "border border-slate-200 bg-white text-slate-700 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 hover:text-slate-900 active:scale-95"
                                  }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">{isCorrect ? "✓ Correct! " : "Explanation: "}</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              {!checked ? (
                <>
                  <button
                    onClick={check}
                    disabled={!allAnswered}
                    className="rounded-xl bg-[#F5DA20] px-6 py-2.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm disabled:opacity-35 disabled:cursor-not-allowed"
                  >
                    Check Answers
                  </button>
                  {!allAnswered && (
                    <span className="text-xs text-slate-400">
                      {QUESTIONS.length - answeredCount} question{QUESTIONS.length - answeredCount !== 1 ? "s" : ""} remaining
                    </span>
                  )}
                </>
              ) : (
                <button
                  onClick={reset}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <a
              href="/vocabulary/c1"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All C1 Exercises
            </a>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">

            {/* Vocabulary spotlight */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
              <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wide">Key Words</p>
                <p className="text-[11px] text-slate-400 mt-0.5">C1 economics vocabulary</p>
              </div>
              <div className="px-4 py-3 space-y-3.5">
                {VOCAB_FOCUS.map(({ word, def }) => (
                  <div key={word}>
                    <span className="text-sm font-black text-[#b8a200]">{word}</span>
                    <p className="mt-0.5 text-[12px] text-slate-500 leading-snug">{def}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* C1 tip */}
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4">
              <p className="text-xs font-black text-sky-700 uppercase tracking-wide mb-2">C1 Tip</p>
              <p className="text-xs text-sky-800/70 leading-relaxed">
                At C1 level, focus on <span className="font-semibold text-sky-800">collocations and register</span>. Many economics terms have specific collocates — for example, you implement or pursue a policy, not just "do" one.
              </p>
            </div>

            {/* Ad */}
            <AdUnit variant="inline-light" />

          </div>
        </aside>

      </div>
    </div>
  );
}
