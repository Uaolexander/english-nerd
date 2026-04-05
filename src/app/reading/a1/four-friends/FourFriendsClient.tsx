"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";

type Profile = {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  text: string;
};

const PROFILES: Profile[] = [
  {
    name: "Tom",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500",
    text:
      "Tom is 10 years old. He loves playing football with his friends after school. He has a dog named Max. Max is big and brown. Tom takes Max for a walk every morning.",
  },
  {
    name: "Lily",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500",
    text:
      "Lily is 9 years old. She loves drawing pictures of animals and people. She has a cat named Bella. Lily lives near a park. She often goes to the park with her cat on sunny days.",
  },
  {
    name: "Ben",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500",
    text:
      "Ben is 11 years old. He likes reading books very much. His favourite books are about science and nature. Ben has two sisters. They sometimes read books together in the evening.",
  },
  {
    name: "Sara",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500",
    text:
      "Sara is 10 years old. She loves dancing and swimming. She goes to a dance class every Tuesday. Sara has a brother. Her brother also likes swimming, so they go to the pool together.",
  },
];

type Statement = {
  id: number;
  text: string;
  answer: boolean;
  person: string;
};

const STATEMENTS: Statement[] = [
  { id: 1, text: "Tom has a cat.", answer: false, person: "Tom" },
  { id: 2, text: "Tom takes his dog for a walk every morning.", answer: true, person: "Tom" },
  { id: 3, text: "Lily lives near a school.", answer: false, person: "Lily" },
  { id: 4, text: "Lily has a cat named Bella.", answer: true, person: "Lily" },
  { id: 5, text: "Ben has two brothers.", answer: false, person: "Ben" },
  { id: 6, text: "Ben likes reading books about science and nature.", answer: true, person: "Ben" },
  { id: 7, text: "Sara loves cooking.", answer: false, person: "Sara" },
  { id: 8, text: "Sara's brother also likes swimming.", answer: true, person: "Sara" },
];

export default function FourFriendsClient() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [checked, setChecked] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const answeredCount = STATEMENTS.filter((s) => answers[s.id] != null).length;
  const allAnswered = answeredCount === STATEMENTS.length;

  const correctCount = checked
    ? STATEMENTS.reduce((n, s) => n + (answers[s.id] === s.answer ? 1 : 0), 0)
    : null;
  const percent =
    correctCount !== null
      ? Math.round((correctCount / STATEMENTS.length) * 100)
      : null;

  function pick(id: number, val: boolean) {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [id]: val }));
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
        slug: "four-friends",
        exerciseNo: 1,
        score: percent,
        questionsTotal: 8,
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
            <span className="text-white/80">Four Friends</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#F5DA20] px-3 py-1 text-xs font-black text-black">
              A1
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              True / False
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              8 questions
            </span>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            Four Friends
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Read the profiles and decide if each statement is True or False.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Profiles grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {PROFILES.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border-l-4 ${p.borderColor} ${p.bgColor} bg-white border border-slate-200 shadow-sm p-6`}
            >
              <h2 className={`text-lg font-black ${p.color}`}>{p.name}</h2>
              <p className="mt-2 text-slate-700 leading-relaxed text-base">{p.text}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>Progress</span>
            <span>{answeredCount} / {STATEMENTS.length}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
              style={{ width: `${(answeredCount / STATEMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Statements */}
        <div ref={resultsRef} className="mt-6 flex flex-col gap-4">
          {STATEMENTS.map((s) => {
            const chosen = answers[s.id];
            const isCorrect = checked ? chosen === s.answer : null;

            return (
              <div
                key={s.id}
                className={`rounded-2xl border bg-white shadow-sm p-5 transition ${
                  checked && isCorrect === true
                    ? "border-emerald-400 bg-emerald-50"
                    : checked && isCorrect === false
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p
                    className={`font-semibold text-base ${
                      checked && isCorrect === true
                        ? "text-emerald-700"
                        : checked && isCorrect === false
                        ? "text-red-700"
                        : "text-slate-800"
                    }`}
                  >
                    <span className="mr-2 text-slate-400 font-normal text-sm">
                      {s.id}.
                    </span>
                    {s.text}
                  </p>

                  <div className="flex gap-2 shrink-0">
                    {(["TRUE", "FALSE"] as const).map((label) => {
                      const val = label === "TRUE";
                      const selected = chosen === val;
                      let btnClass =
                        "rounded-xl border px-4 py-2 text-sm font-bold transition select-none ";

                      if (!checked) {
                        btnClass += selected
                          ? "bg-[#F5DA20] border-[#F5DA20] text-black"
                          : "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 cursor-pointer";
                      } else {
                        // After check
                        const isThisCorrect = val === s.answer;
                        if (selected && isThisCorrect) {
                          btnClass += "bg-emerald-400 border-emerald-400 text-white";
                        } else if (selected && !isThisCorrect) {
                          btnClass += "bg-red-400 border-red-400 text-white";
                        } else if (!selected && isThisCorrect) {
                          btnClass += "bg-emerald-100 border-emerald-400 text-emerald-700";
                        } else {
                          btnClass += "border-slate-200 text-slate-300";
                        }
                      }

                      return (
                        <button
                          key={label}
                          type="button"
                          className={btnClass}
                          onClick={() => pick(s.id, val)}
                          disabled={checked}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {checked && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {isCorrect ? (
                      <span className="text-emerald-600 font-semibold">
                        Correct! The statement is {s.answer ? "True" : "False"}.
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Wrong. The correct answer is{" "}
                        <span className="uppercase font-black">
                          {s.answer ? "True" : "False"}
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
              {allAnswered ? "Check Answers" : `Answer all ${STATEMENTS.length} questions`}
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
                {correctCount} / {STATEMENTS.length}
              </p>
              <p className="mt-1 text-slate-500 text-sm">
                {percent}% correct
              </p>
              <p className="mt-3 text-slate-700 font-semibold">
                {grade === "great"
                  ? "Excellent work! Keep it up."
                  : grade === "ok"
                  ? "Good effort. Review the wrong answers."
                  : "Keep practising. Read the profiles again and try once more."}
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
