"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";

const TEXT = `Sofia and her family drove to the mountains last weekend. They left home on Saturday morning at eight o'clock. The drive took two hours. When they arrived, they checked into a small hotel near a lake. In the afternoon, Sofia and her brother went for a walk in the forest. They saw a deer and took many photos. On Sunday morning, they had breakfast at the hotel. It was a big breakfast with eggs, bread, cheese, and fresh orange juice. After breakfast, they rented bicycles and rode around the lake. The weather was perfect, sunny and not too hot. They stopped at a small cafe for lunch and had soup and sandwiches. They drove home on Sunday evening. Sofia said it was the best weekend of the summer.`;

type Option = { label: string; text: string };
type Question = {
  id: number;
  text: string;
  options: Option[];
  answer: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What time did Sofia and her family leave home on Saturday?",
    options: [
      { label: "A", text: "At seven o'clock" },
      { label: "B", text: "At eight o'clock" },
      { label: "C", text: "At nine o'clock" },
    ],
    answer: "B",
  },
  {
    id: 2,
    text: "How long did the drive to the mountains take?",
    options: [
      { label: "A", text: "One hour" },
      { label: "B", text: "Three hours" },
      { label: "C", text: "Two hours" },
    ],
    answer: "C",
  },
  {
    id: 3,
    text: "What did Sofia and her brother see in the forest?",
    options: [
      { label: "A", text: "A rabbit" },
      { label: "B", text: "A deer" },
      { label: "C", text: "A fox" },
    ],
    answer: "B",
  },
  {
    id: 4,
    text: "Which of these was part of their Sunday breakfast?",
    options: [
      { label: "A", text: "Pancakes and honey" },
      { label: "B", text: "Eggs, bread and cheese" },
      { label: "C", text: "Cereal and milk" },
    ],
    answer: "B",
  },
  {
    id: 5,
    text: "What did they do after breakfast on Sunday?",
    options: [
      { label: "A", text: "They went hiking in the mountains" },
      { label: "B", text: "They swam in the lake" },
      { label: "C", text: "They rented bicycles and rode around the lake" },
    ],
    answer: "C",
  },
  {
    id: 6,
    text: "What did Sofia think about the weekend?",
    options: [
      { label: "A", text: "It was the best weekend of the summer" },
      { label: "B", text: "It was a little boring" },
      { label: "C", text: "She wanted to stay longer" },
    ],
    answer: "A",
  },
];

export default function AWeekendTripClient() {
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [checked, setChecked] = useState(false);

  const questionsTopRef = useRef<HTMLDivElement>(null);

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] != null).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const correctCount = checked
    ? QUESTIONS.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0)
    : null;
  const percent =
    correctCount !== null
      ? Math.round((correctCount / QUESTIONS.length) * 100)
      : null;

  function pick(id: number, label: string) {
    if (checked) return;
    setAnswers((p) => ({ ...p, [id]: label }));
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    setTimeout(() => {
      if (!questionsTopRef.current) return;
      const top =
        questionsTopRef.current.getBoundingClientRect().top +
        window.scrollY -
        80;
      window.scrollTo({ top, behavior: "smooth" });
    }, 50);
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
      body: JSON.stringify({
        category: "reading",
        level: "a2",
        slug: "a-weekend-trip",
        exerciseNo: 1,
        score: percent,
        questionsTotal: 6,
      }),
    }).catch(() => {});
  }, [checked, percent]);

  const grade =
    percent === null ? null : percent >= 80 ? "great" : percent >= 60 ? "ok" : "low";

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Dark header */}
      <div className="bg-[#0E0F13] text-white">
        <div className="mx-auto max-w-4xl px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/40">
            <a href="/" className="hover:text-white transition">Home</a>
            <svg className="h-3 w-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            <a href="/reading" className="hover:text-white transition">Reading</a>
            <svg className="h-3 w-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            <a href="/reading/a2" className="hover:text-white transition">A2</a>
            <svg className="h-3 w-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            <span className="text-white/70 font-medium">A Weekend Trip</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-400 px-3 py-0.5 text-[11px] font-black text-black">A2</span>
            <span className="rounded-full border border-white/15 px-3 py-0.5 text-[11px] font-semibold text-white/40">Comprehension</span>
            <span className="rounded-full border border-white/15 px-3 py-0.5 text-[11px] font-semibold text-white/40">6 questions</span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            A Weekend <span className="text-[#F5DA20]">Trip</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/45 leading-relaxed">
            Read about Sofia's weekend trip to the mountains. Then answer the comprehension questions.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">

        {/* Reading text */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Read the text</h2>
          <p className="text-slate-700 leading-relaxed text-base">{TEXT}</p>
        </div>

        {/* Scroll anchor */}
        <div ref={questionsTopRef} />

        {/* Score panel */}
        {checked && percent !== null && (
          <div
            className={`flex items-center gap-5 rounded-2xl border px-6 py-5 ${
              grade === "great"
                ? "border-emerald-400/40 bg-emerald-50"
                : grade === "ok"
                ? "border-amber-400/40 bg-amber-50"
                : "border-red-400/40 bg-red-50"
            }`}
          >
            <div
              className={`text-5xl font-black tabular-nums ${
                grade === "great"
                  ? "text-emerald-600"
                  : grade === "ok"
                  ? "text-amber-600"
                  : "text-red-600"
              }`}
            >
              {percent}<span className="text-2xl">%</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-600">
                {correctCount} out of {QUESTIONS.length} correct
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#F5DA20] transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {grade === "great"
                  ? "Excellent! You understood the text very well."
                  : grade === "ok"
                  ? "Good effort. Read the text again and try once more."
                  : "Read the text carefully again, then try again."}
              </p>
            </div>
          </div>
        )}

        {/* Questions card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-[15px] font-black text-slate-800">Comprehension Questions</h2>
              <p className="text-xs text-slate-400 mt-0.5">Choose the best answer for each question.</p>
            </div>
            {!checked ? (
              <div className="flex items-center gap-2.5">
                <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                    style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 tabular-nums">
                  {answeredCount}/{QUESTIONS.length}
                </span>
              </div>
            ) : (
              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  grade === "great"
                    ? "bg-emerald-100 text-emerald-700"
                    : grade === "ok"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {correctCount}/{QUESTIONS.length}
              </span>
            )}
          </div>

          {/* Questions list */}
          <div className="divide-y divide-slate-100">
            {QUESTIONS.map((q, idx) => {
              const chosen = answers[q.id];
              const isCorrect = checked && chosen === q.answer;
              const isWrong = checked && chosen != null && chosen !== q.answer;

              return (
                <div
                  key={q.id}
                  className={`px-6 py-5 transition-colors duration-200 ${
                    isCorrect ? "bg-emerald-50" : isWrong ? "bg-red-50" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Number bubble */}
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black transition-all ${
                        isCorrect
                          ? "bg-emerald-400 text-white"
                          : isWrong
                          ? "bg-red-400 text-white"
                          : chosen != null
                          ? "bg-[#F5DA20] text-black"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {checked ? (isCorrect ? "✓" : "✗") : String(idx + 1).padStart(2, "0")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] text-slate-700 leading-snug font-medium mb-3.5">
                        {q.text}
                      </p>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const sel = chosen === opt.label;
                          const ok = checked && sel && opt.label === q.answer;
                          const bad = checked && sel && opt.label !== q.answer;
                          const reveal = checked && !sel && opt.label === q.answer;

                          return (
                            <button
                              key={opt.label}
                              onClick={() => pick(q.id, opt.label)}
                              disabled={checked}
                              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all duration-150 ${
                                ok
                                  ? "bg-emerald-400 text-white shadow-sm"
                                  : bad
                                  ? "bg-red-400 text-white shadow-sm"
                                  : reveal
                                  ? "border border-emerald-400/50 bg-emerald-50 text-emerald-700"
                                  : sel
                                  ? "bg-[#F5DA20] text-black shadow-sm"
                                  : checked
                                  ? "border border-slate-200 bg-slate-50 text-slate-300"
                                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#F5DA20]/60 hover:bg-[#F5DA20]/10 hover:text-slate-700 active:scale-[0.99]"
                              }`}
                            >
                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                  ok
                                    ? "bg-white/20 text-white"
                                    : bad
                                    ? "bg-white/20 text-white"
                                    : sel
                                    ? "bg-black/10 text-black"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {opt.label}
                              </span>
                              {opt.text}
                            </button>
                          );
                        })}
                      </div>

                      {checked && (
                        <p
                          className={`mt-2 text-xs font-medium ${
                            isCorrect ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {isCorrect
                            ? "Correct!"
                            : `Incorrect. The correct answer is ${q.answer}.`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card footer */}
          <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
            {!checked ? (
              <>
                <button
                  onClick={check}
                  disabled={!allAnswered}
                  className="rounded-xl bg-[#F5DA20] px-6 py-2.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Check Answers
                </button>
                {!allAnswered && (
                  <span className="text-xs text-slate-400">
                    {QUESTIONS.length - answeredCount} question
                    {QUESTIONS.length - answeredCount !== 1 ? "s" : ""} remaining
                  </span>
                )}
              </>
            ) : (
              <button
                onClick={reset}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
              >
                Try Again
              </button>
            )}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <a
            href="/reading/a2"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7" /></svg>
            All A2 Reading
          </a>
        </div>

      <div className="mt-10">
        <AdUnit variant="inline-light" />
      </div>
      </div>
    </main>
  );
}
