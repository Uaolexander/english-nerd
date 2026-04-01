"use client";

import { useState, useEffect, useRef } from "react";

const TEXT = `Emma is 10 years old. She gets up at 7 o'clock every morning. She has breakfast with her family. She eats cereal and drinks orange juice. She goes to school by bus. School starts at 9 o'clock. Emma's favourite subject is art. She also likes maths. She has lunch at school at 12 o'clock. She usually eats a sandwich and an apple. After school she goes home at 3 o'clock. She does her homework and then watches TV. In the evening she reads a book before bed. She goes to bed at 9 o'clock.`;

type Question = {
  id: number;
  text: string;
  options: { label: string; text: string }[];
  answer: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What time does Emma get up?",
    options: [
      { label: "A", text: "6 o'clock" },
      { label: "B", text: "7 o'clock" },
      { label: "C", text: "8 o'clock" },
    ],
    answer: "B",
  },
  {
    id: 2,
    text: "How does Emma go to school?",
    options: [
      { label: "A", text: "by car" },
      { label: "B", text: "by bike" },
      { label: "C", text: "by bus" },
    ],
    answer: "C",
  },
  {
    id: 3,
    text: "What is Emma's favourite subject?",
    options: [
      { label: "A", text: "maths" },
      { label: "B", text: "art" },
      { label: "C", text: "music" },
    ],
    answer: "B",
  },
  {
    id: 4,
    text: "What time does Emma have lunch?",
    options: [
      { label: "A", text: "11 o'clock" },
      { label: "B", text: "12 o'clock" },
      { label: "C", text: "1 o'clock" },
    ],
    answer: "B",
  },
  {
    id: 5,
    text: "What does Emma eat for lunch?",
    options: [
      { label: "A", text: "a pizza" },
      { label: "B", text: "a sandwich" },
      { label: "C", text: "pasta" },
    ],
    answer: "B",
  },
  {
    id: 6,
    text: "What does Emma do before bed?",
    options: [
      { label: "A", text: "watches TV" },
      { label: "B", text: "plays games" },
      { label: "C", text: "reads a book" },
    ],
    answer: "C",
  },
];

export default function MySchoolDayClient() {
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [checked, setChecked] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

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
    setAnswers((prev) => ({ ...prev, [id]: label }));
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    setTimeout(() => {
      if (resultsRef.current) {
        const top =
          resultsRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
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
        level: "a1",
        slug: "my-school-day",
        exerciseNo: 1,
        score: percent,
        questionsTotal: 6,
      }),
    }).catch(() => {});
  }, [checked, percent]);

  const grade =
    percent === null
      ? null
      : percent >= 80
      ? "great"
      : percent >= 60
      ? "ok"
      : "low";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark header bar */}
      <div className="bg-[#0E0F13] text-white">
        <div className="mx-auto max-w-3xl px-6 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-white/55">
            <a className="hover:text-white transition" href="/">Home</a>{" "}
            <span className="text-white/30">/</span>{" "}
            <a className="hover:text-white transition" href="/reading">Reading</a>{" "}
            <span className="text-white/30">/</span>{" "}
            <a className="hover:text-white transition" href="/reading/a1">A1</a>{" "}
            <span className="text-white/30">/</span>{" "}
            <span className="text-white/80">My School Day</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#F5DA20] px-3 py-1 text-xs font-black text-black">
              A1
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              Comprehension
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              6 questions
            </span>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            My School Day
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Read the text and choose the correct answer for each question.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Reading text */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-black text-slate-800 uppercase tracking-wide mb-4">
            Read the text
          </h2>
          <p className="text-slate-700 leading-relaxed text-base">{TEXT}</p>
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>Progress</span>
            <span>{answeredCount} / {QUESTIONS.length}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
              style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div ref={resultsRef} className="mt-6 flex flex-col gap-5">
          {QUESTIONS.map((q) => {
            const chosen = answers[q.id];
            const isCorrect = checked ? chosen === q.answer : null;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border bg-white shadow-sm p-5 transition ${
                  checked && isCorrect === true
                    ? "border-emerald-400 bg-emerald-50"
                    : checked && isCorrect === false
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200"
                }`}
              >
                <p
                  className={`font-semibold text-base mb-4 ${
                    checked && isCorrect === true
                      ? "text-emerald-700"
                      : checked && isCorrect === false
                      ? "text-red-700"
                      : "text-slate-800"
                  }`}
                >
                  <span className="mr-2 text-slate-400 font-normal text-sm">{q.id}.</span>
                  {q.text}
                </p>

                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => {
                    const selected = chosen === opt.label;
                    const isThisCorrect = opt.label === q.answer;

                    let btnClass =
                      "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold text-left transition ";

                    if (!checked) {
                      btnClass += selected
                        ? "bg-[#F5DA20]/20 border-[#F5DA20] text-slate-800"
                        : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50 cursor-pointer";
                    } else {
                      if (selected && isThisCorrect) {
                        btnClass += "bg-emerald-50 border-emerald-400 text-emerald-700";
                      } else if (selected && !isThisCorrect) {
                        btnClass += "bg-red-50 border-red-400 text-red-700";
                      } else if (!selected && isThisCorrect) {
                        btnClass += "bg-emerald-50 border-emerald-300 text-emerald-700";
                      } else {
                        btnClass += "border-slate-200 text-slate-400";
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        type="button"
                        className={btnClass}
                        onClick={() => pick(q.id, opt.label)}
                        disabled={checked}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black border ${
                            !checked
                              ? selected
                                ? "bg-[#F5DA20] border-[#F5DA20] text-black"
                                : "border-slate-300 text-slate-500"
                              : isThisCorrect
                              ? "bg-emerald-400 border-emerald-400 text-white"
                              : selected
                              ? "bg-red-400 border-red-400 text-white"
                              : "border-slate-300 text-slate-400"
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span>{opt.text}</span>
                        {checked && isThisCorrect && (
                          <span className="ml-auto text-emerald-500 font-black text-base">
                            ✓
                          </span>
                        )}
                        {checked && selected && !isThisCorrect && (
                          <span className="ml-auto text-red-500 font-black text-base">
                            ✗
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Check / score area */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {!checked ? (
            <button
              type="button"
              onClick={check}
              disabled={!allAnswered}
              className={`rounded-2xl px-8 py-3 text-base font-black transition ${
                allAnswered
                  ? "bg-[#F5DA20] text-black hover:opacity-90"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {allAnswered ? "Check Answers" : `Answer all ${QUESTIONS.length} questions`}
            </button>
          ) : (
            <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">
                Your score
              </p>
              <p
                className={`mt-1 text-5xl font-black ${
                  grade === "great"
                    ? "text-emerald-500"
                    : grade === "ok"
                    ? "text-[#F5DA20]"
                    : "text-red-500"
                }`}
              >
                {correctCount} / {QUESTIONS.length}
              </p>
              <p className="mt-1 text-slate-500 text-sm">{percent}% correct</p>
              <p className="mt-3 text-slate-700 font-semibold">
                {grade === "great"
                  ? "Excellent work! Keep it up."
                  : grade === "ok"
                  ? "Good effort. Review the wrong answers."
                  : "Keep practising. Read the text again and try once more."}
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 rounded-xl border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
