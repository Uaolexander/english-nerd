"use client";

import { useState, useCallback } from "react";
import AdUnit from "@/components/AdUnit";

type Question = {
  id: number;
  text: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
};

const ARTICLE = `The slow travel movement is a growing trend among travellers who want to explore destinations more deeply instead of rushing from place to place. Rather than trying to visit ten cities in two weeks, slow travellers choose to spend more time in one or two locations. They rent apartments, shop at local markets, and try to live like residents rather than tourists.

The idea first became popular in the early 2000s, inspired by the slow food movement which started in Italy. Supporters argue that slow travel is better for the environment because it reduces the number of flights and car journeys. It is also better for local economies, as travellers spend money in local businesses rather than large international hotels.

However, critics point out that not everyone has the time or money to travel slowly. People with limited holidays or tight budgets often have no choice but to travel quickly. Despite this, many travel bloggers and writers say that even small changes, like staying in a city for a week instead of two days, can transform the experience completely.`;

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What do slow travellers typically do differently from regular tourists?",
    options: [
      "They visit as many cities as possible in a short time.",
      "They stay longer in fewer places and try to live like locals.",
      "They avoid using local markets and prefer international hotels.",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    text: "When did the slow travel movement first become popular?",
    options: [
      "In the 1990s.",
      "In the early 2000s.",
      "In the 2010s.",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    text: "What movement inspired slow travel?",
    options: [
      "The slow fashion movement from France.",
      "The eco-tourism movement from Scandinavia.",
      "The slow food movement from Italy.",
    ],
    correctIndex: 2,
  },
  {
    id: 4,
    text: "Why do supporters say slow travel is better for the environment?",
    options: [
      "It uses fewer vehicles and reduces transport emissions.",
      "It encourages travellers to stay in eco-friendly hotels.",
      "It stops people from buying souvenirs and plastic products.",
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    text: "How does slow travel benefit local economies according to the article?",
    options: [
      "It brings more tax revenue to governments.",
      "Travellers spend money in local businesses rather than big international hotels.",
      "It creates more jobs in the aviation industry.",
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    text: "What is the main criticism of slow travel mentioned in the article?",
    options: [
      "It is boring because travellers see fewer places.",
      "Not everyone can afford it or has enough holiday time.",
      "It is harmful to local cultures and traditions.",
    ],
    correctIndex: 1,
  },
];

async function saveResult(score: number) {
  try {
    await fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "reading",
        level: "b1",
        slug: "the-slow-travel-movement",
        exerciseNo: 1,
        score,
        questionsTotal: 6,
      }),
    });
  } catch {
    // Silent -- never break exercise flow
  }
}

export default function SlowTravelClient() {
  const [answers, setAnswers] = useState<Record<number, number | null>>(() =>
    Object.fromEntries(QUESTIONS.map((q) => [q.id, null]))
  );
  const [checked, setChecked] = useState(false);
  const [saved, setSaved] = useState(false);

  const answered = Object.values(answers).filter((v) => v !== null).length;
  const progress = Math.round((answered / QUESTIONS.length) * 100);

  const handleSelect = useCallback(
    (id: number, idx: number) => {
      if (checked) return;
      setAnswers((prev) => ({ ...prev, [id]: idx }));
    },
    [checked]
  );

  const handleCheck = useCallback(async () => {
    if (answered < QUESTIONS.length) return;
    setChecked(true);
    const correct = QUESTIONS.filter((q) => answers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / QUESTIONS.length) * 100);
    if (!saved) {
      setSaved(true);
      await saveResult(score);
    }
  }, [answered, answers, saved]);

  const handleReset = useCallback(() => {
    setAnswers(Object.fromEntries(QUESTIONS.map((q) => [q.id, null])));
    setChecked(false);
    setSaved(false);
  }, []);

  const correct = checked
    ? QUESTIONS.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Dark header */}
      <div className="bg-[#0E0F13] text-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-white/50">
            <a className="hover:text-white transition" href="/">Home</a>{" "}
            <span className="text-white/25">/</span>{" "}
            <a className="hover:text-white transition" href="/reading">Reading</a>{" "}
            <span className="text-white/25">/</span>{" "}
            <a className="hover:text-white transition" href="/reading/b1">B1</a>{" "}
            <span className="text-white/25">/</span>{" "}
            <span className="text-white/80">The Slow Travel Movement</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-violet-400 px-3 py-1 text-xs font-black text-black">
              B1
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
              Comprehension
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
              6 questions
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-black md:text-3xl">The Slow Travel Movement</h1>
          <p className="mt-1 text-sm text-white/50">
            Read the article, then choose the best answer for each comprehension question.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">

        {/* Article */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="mb-4 text-lg font-black text-slate-800">Read the article</h2>
          {ARTICLE.split("\n\n").map((para, i) => (
            <p key={i} className="text-slate-700 leading-relaxed text-base mb-4 last:mb-0">
              {para}
            </p>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
            <span>{answered} / {QUESTIONS.length} answered</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">Comprehension questions</h2>
          {QUESTIONS.map((q) => {
            const userAnswer = answers[q.id];
            const isAnswered = userAnswer !== null;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border-2 bg-white p-5 transition ${
                  checked
                    ? userAnswer === q.correctIndex
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-red-400 bg-red-50"
                    : isAnswered
                    ? "border-[#F5DA20]"
                    : "border-slate-200"
                }`}
              >
                <p className="mb-4 font-bold text-slate-800 text-sm">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-500">
                    {q.id}
                  </span>
                  {q.text}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, idx) => {
                    const isSelected = userAnswer === idx;
                    const isCorrectOption = checked && idx === q.correctIndex;
                    const isWrongSelected = checked && isSelected && idx !== q.correctIndex;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelect(q.id, idx)}
                        disabled={checked}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                          isCorrectOption
                            ? "bg-emerald-100 border-2 border-emerald-400 text-emerald-800"
                            : isWrongSelected
                            ? "bg-red-100 border-2 border-red-400 text-red-800"
                            : isSelected
                            ? "bg-[#F5DA20]/20 border-2 border-[#F5DA20] text-slate-800"
                            : "bg-slate-50 border-2 border-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-200"
                        } disabled:cursor-default`}
                      >
                        <span className="mr-2 font-black text-slate-400">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {opt}
                        {isCorrectOption && (
                          <span className="ml-2 text-xs font-black text-emerald-600">Correct</span>
                        )}
                        {isWrongSelected && (
                          <span className="ml-2 text-xs font-black text-red-500">Wrong</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* Result */}
        {checked && (
          <div className="rounded-2xl border-2 border-[#F5DA20] bg-[#F5DA20]/10 p-5 text-center">
            <p className="text-2xl font-black text-slate-800">
              {correct} / {QUESTIONS.length}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {correct === QUESTIONS.length
                ? "Perfect! You understood the article completely."
                : correct >= 5
                ? "Excellent reading! Only one small mistake."
                : correct >= 4
                ? "Good work. Read the article again to review the tricky parts."
                : "Keep practising. Re-read the article carefully and try again."}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          {!checked ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={answered < QUESTIONS.length}
              className="inline-flex items-center rounded-xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check Answers
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:border-slate-400"
            >
              Try Again
            </button>
          )}
          <a
            href="/reading/b1"
            className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300"
          >
            Back to B1
          </a>
        </div>

      <div className="mt-10">
        <AdUnit variant="inline-light" />
      </div>
      </div>
    </main>
  );
}
