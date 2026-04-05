"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";

const ARTICLE = `Habits are remarkably powerful forces in human behaviour. Research suggests that approximately 40 per cent of daily actions are habitual rather than the result of conscious decision-making. Understanding how habits form can help people change unwanted behaviours and establish new, positive ones.

According to psychologist Charles Duhigg, habits operate through a three-part loop: a cue, a routine and a reward. The cue is a trigger that tells the brain to initiate a behaviour. The routine is the behaviour itself. The reward reinforces the habit by telling the brain that the loop is worth remembering.

One of the most effective strategies for changing habits is known as habit stacking, where a new behaviour is attached to an existing one. For example, someone who wants to start meditating might do so immediately after making their morning coffee. The established habit of making coffee becomes the cue for the new habit of meditating.

Research from University College London suggests it takes an average of 66 days to form a new habit, though this varies significantly between individuals and behaviours. Contrary to the popular claim that habits form in 21 days, some behaviours can take up to 254 days to become automatic.

Importantly, missing one day does not significantly derail the habit formation process. The key is consistency over time rather than perfection.`;

type Question = {
  id: number;
  text: string;
  options: string[];
  answer: number;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "According to the article, what percentage of daily actions are habitual?",
    options: [
      "Around 20 per cent",
      "Around 40 per cent",
      "Around 60 per cent",
    ],
    answer: 1,
  },
  {
    id: 2,
    text: "According to Charles Duhigg, what is the function of the 'cue' in a habit loop?",
    options: [
      "It reinforces the habit after the behaviour.",
      "It is the behaviour itself.",
      "It triggers the brain to begin a behaviour.",
    ],
    answer: 2,
  },
  {
    id: 3,
    text: "What is 'habit stacking'?",
    options: [
      "Replacing an old habit with a completely new one.",
      "Linking a new behaviour to an existing habit.",
      "Repeating a behaviour 66 times to make it automatic.",
    ],
    answer: 1,
  },
  {
    id: 4,
    text: "What example of habit stacking does the article give?",
    options: [
      "Meditating after making morning coffee.",
      "Going for a run after waking up.",
      "Reading after brushing teeth at night.",
    ],
    answer: 0,
  },
  {
    id: 5,
    text: "What does University College London research suggest about habit formation?",
    options: [
      "It takes exactly 21 days to form any habit.",
      "It takes an average of 66 days, though it varies.",
      "It takes a minimum of 254 days for all habits.",
    ],
    answer: 1,
  },
  {
    id: 6,
    text: "What does the article say about missing a single day during habit formation?",
    options: [
      "It significantly disrupts the process and you must restart.",
      "It has no effect at all on habit formation.",
      "It does not significantly derail the process.",
    ],
    answer: 2,
  },
];

export default function PsychologyHabitsClient() {
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
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

  function pick(id: number, idx: number) {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [id]: idx }));
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
        level: "b2",
        slug: "the-psychology-of-habits",
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
      {/* Dark header */}
      <div className="bg-[#0E0F13] text-white">
        <div className="mx-auto max-w-3xl px-6 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-white/55">
            <a className="hover:text-white transition" href="/">Home</a>{" "}
            <span className="text-white/30">/</span>{" "}
            <a className="hover:text-white transition" href="/reading">Reading</a>{" "}
            <span className="text-white/30">/</span>{" "}
            <a className="hover:text-white transition" href="/reading/b2">B2</a>{" "}
            <span className="text-white/30">/</span>{" "}
            <span className="text-white/80">The Psychology of Habits</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-orange-400 px-3 py-1 text-xs font-black text-black">
              B2
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              Comprehension
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              6 questions
            </span>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            The Psychology of Habits
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Read the article, then choose the best answer for each question.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Article card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-black text-slate-800 mb-4">
            The Psychology of Habits
          </h2>
          {ARTICLE.split("\n\n").map((para, i) => (
            <p key={i} className="text-slate-700 leading-relaxed text-base mb-4 last:mb-0">
              {para}
            </p>
          ))}
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
                  className={`font-semibold text-base mb-3 ${
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
                  {q.options.map((opt, idx) => {
                    const selected = chosen === idx;
                    let btnClass =
                      "w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition ";

                    if (!checked) {
                      btnClass += selected
                        ? "bg-[#F5DA20] border-[#F5DA20] text-black font-bold"
                        : "border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-800 cursor-pointer bg-white";
                    } else {
                      const isThisCorrect = idx === q.answer;
                      if (selected && isThisCorrect) {
                        btnClass += "bg-emerald-400 border-emerald-400 text-white font-bold";
                      } else if (selected && !isThisCorrect) {
                        btnClass += "bg-red-400 border-red-400 text-white font-bold";
                      } else if (!selected && isThisCorrect) {
                        btnClass += "bg-emerald-50 border-emerald-400 text-emerald-700 font-bold";
                      } else {
                        btnClass += "border-slate-200 text-slate-300 bg-white";
                      }
                    }

                    const optionLabel = ["A", "B", "C"][idx];

                    return (
                      <button
                        key={idx}
                        type="button"
                        className={btnClass}
                        onClick={() => pick(q.id, idx)}
                        disabled={checked}
                      >
                        <span className="mr-2 font-black">{optionLabel}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {checked && (
                  <div className="mt-3 text-sm">
                    {isCorrect ? (
                      <span className="text-emerald-600 font-semibold">Correct!</span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Wrong. The correct answer is{" "}
                        <span className="font-black">
                          {["A", "B", "C"][q.answer]}
                        </span>
                        .
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Check / score */}
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
                  ? "Excellent comprehension! Well done."
                  : grade === "ok"
                  ? "Good effort. Read the article again to review any mistakes."
                  : "Keep practising. Reread the article carefully and try once more."}
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

      <div className="mt-10">
        <AdUnit variant="inline-light" />
      </div>
      </div>
    </div>
  );
}
