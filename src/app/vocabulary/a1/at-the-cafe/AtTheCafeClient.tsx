"use client";

import { useState, useEffect } from "react";
import AdUnit from "@/components/AdUnit";

/*
  Dialogue: "At the Café"
  Maria and Pedro go to a café for breakfast.
  Each QUESTION has a sentence with one blank and 3 options.
  Only one option is clearly correct from context.
*/
type Question = {
  id: number;
  before: string;   // text before the gap
  after: string;    // text after the gap
  options: string[];
  correct: string;
  explanation: string;
  speaker?: string; // optional speaker label
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    speaker: "Narrator",
    before: "Maria and Pedro go to a café. They want to have",
    after: ".",
    options: ["breakfast", "homework", "exercise"],
    correct: "breakfast",
    explanation: "You have breakfast at a café in the morning. Homework and exercise are not things you have at a café.",
  },
  {
    id: 2,
    speaker: "Waiter",
    before: "Good morning! Here is the",
    after: ". Please take a look.",
    options: ["menu", "bed", "shoe"],
    correct: "menu",
    explanation: "A waiter gives you a menu at a café so you can choose your food and drinks.",
  },
  {
    id: 3,
    speaker: "Pedro",
    before: "Can I have a",
    after: ", please? I need something hot to drink.",
    options: ["coffee", "chair", "flower"],
    correct: "coffee",
    explanation: "Coffee is a hot drink. A chair is furniture and a flower is a plant — you don't drink them!",
  },
  {
    id: 4,
    speaker: "Waiter",
    before: "Of course! Do you want",
    after: " in your coffee?",
    options: ["milk", "sand", "music"],
    correct: "milk",
    explanation: "Milk is a liquid you can put in coffee. Sand is from the beach and music is a sound — they don't go in coffee.",
  },
  {
    id: 5,
    speaker: "Maria",
    before: "I'd like a",
    after: " with cheese, please. I'm very hungry!",
    options: ["sandwich", "pencil", "cloud"],
    correct: "sandwich",
    explanation: "A sandwich is food with bread and filling. A pencil is for writing and a cloud is in the sky.",
  },
  {
    id: 6,
    speaker: "Waiter",
    before: "We also have fresh juice — orange juice and",
    after: " juice.",
    options: ["apple", "book", "door"],
    correct: "apple",
    explanation: "Apple juice is a popular drink. Books and doors are objects — you can't make juice from them!",
  },
  {
    id: 7,
    speaker: "Pedro",
    before: "This coffee is very",
    after: ". I need to wait before I drink it.",
    options: ["hot", "long", "green"],
    correct: "hot",
    explanation: "Hot coffee needs time to cool down before you drink it. Long and green don't explain why you need to wait.",
  },
  {
    id: 8,
    speaker: "Maria",
    before: "Can we have the",
    after: ", please? We need to leave soon.",
    options: ["bill", "song", "cat"],
    correct: "bill",
    explanation: "You ask for the bill at a café when you want to pay and leave. A song or a cat don't help you pay!",
  },
  {
    id: 9,
    speaker: "Waiter",
    before: "Of course! That's ten",
    after: ", please.",
    options: ["euros", "kilos", "hours"],
    correct: "euros",
    explanation: "Euros are money. You pay for food with money, not kilos (weight) or hours (time).",
  },
  {
    id: 10,
    speaker: "Pedro",
    before: "Excuse me, can I have a",
    after: " for my sandwich? I want to take it with me.",
    options: ["bag", "dream", "lesson"],
    correct: "bag",
    explanation: "You put food in a bag to take it away. A dream is when you sleep and a lesson is at school.",
  },
];

const VOCAB_FOCUS = [
  { word: "menu", def: "a list of food and drinks at a café or restaurant" },
  { word: "breakfast", def: "the first meal of the day, usually in the morning" },
  { word: "bill", def: "a piece of paper showing how much you need to pay" },
  { word: "juice", def: "a cold drink made from fruit" },
  { word: "sandwich", def: "two pieces of bread with food inside" },
];

export default function AtTheCafeClient() {
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [checked, setChecked] = useState(false);

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
      body: JSON.stringify({ category: "vocabulary", level: "a1", slug: "at-the-cafe", exerciseNo: 1, score: percent, questionsTotal: QUESTIONS.length }),
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
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["A1", "/vocabulary/a1"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">At the Café</span>
      </nav>

      {/* Hero */}
      <div className="mt-6 flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">A1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Dialogue</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">10 questions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
            At the <span className="relative inline-block">
              Café
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
            Maria and Pedro go to a café for breakfast. Read the dialogue and choose the correct word
            for each gap. Think about the context!
          </p>
        </div>
      </div>

      {/* How-to */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { n: "1", label: "Read the sentence", sub: "understand the situation" },
          { n: "2", label: "Choose the word", sub: "that fits the context" },
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
                  {grade === "great" ? "Excellent! You have great vocabulary for a beginner." :
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
                            q.speaker === "Waiter"   ? "text-sky-400" :
                            q.speaker === "Pedro"    ? "text-violet-500" :
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
              href="/vocabulary/a1"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All A1 Exercises
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
                <p className="text-[11px] text-slate-400 mt-0.5">Useful café vocabulary</p>
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

            {/* A1 tip */}
            <div className="rounded-2xl border border-yellow-100 bg-yellow-50 px-4 py-4">
              <p className="text-xs font-black text-yellow-700 uppercase tracking-wide mb-2">A1 Tip</p>
              <p className="text-xs text-yellow-800/70 leading-relaxed">
                When you don't know a word, look at the <span className="font-semibold text-yellow-800">whole sentence</span> for clues. The situation, other words and common sense will help you choose correctly.
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
