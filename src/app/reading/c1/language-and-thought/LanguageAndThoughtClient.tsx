"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";

const WORD_BANK = [
  "contested",
  "relativity",
  "perception",
  "embedded",
  "nuanced",
  "compelling",
  "cognition",
  "acquisition",
];

type Segment =
  | { type: "text"; content: string }
  | { type: "gap"; index: number };

const SEGMENTS: Segment[] = [
  { type: "text", content: "The relationship between language and thought remains one of the most " },
  { type: "gap", index: 0 },
  { type: "text", content: " questions in cognitive science. The hypothesis of linguistic " },
  { type: "gap", index: 1 },
  { type: "text", content: ", associated with Whorf and Sapir, proposes that the language we speak shapes our " },
  { type: "gap", index: 2 },
  { type: "text", content: " of reality. In its strong form, this view holds that thought is fundamentally " },
  { type: "gap", index: 3 },
  { type: "text", content: " within language. This extreme version has been largely discredited. However, a weaker and more " },
  { type: "gap", index: 4 },
  { type: "text", content: " interpretation continues to attract " },
  { type: "gap", index: 5 },
  { type: "text", content: " empirical support. Studies of colour " },
  { type: "gap", index: 6 },
  { type: "text", content: " have shown that speakers of languages with more colour terms distinguish certain hues more rapidly. The debate has significant implications for language " },
  { type: "gap", index: 7 },
  { type: "text", content: ", suggesting that the languages children learn first may shape not only what they say but how they experience the world." },
];

const ANSWERS = [
  "contested",
  "relativity",
  "perception",
  "embedded",
  "nuanced",
  "compelling",
  "cognition",
  "acquisition",
];

export default function LanguageAndThoughtClient() {
  const [selected, setSelected] = useState<(string | null)[]>(
    Array(ANSWERS.length).fill(null)
  );
  const [activeGap, setActiveGap] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const usedWords = selected.filter((w): w is string => w !== null);
  const filledCount = selected.filter((w) => w !== null).length;
  const allFilled = filledCount === ANSWERS.length;

  const correctCount = checked
    ? selected.reduce<number>(
        (n, w, i) => n + (w === ANSWERS[i] ? 1 : 0),
        0
      )
    : null;
  const percent =
    correctCount !== null
      ? Math.round((correctCount / ANSWERS.length) * 100)
      : null;

  function handleGapClick(index: number) {
    if (checked) return;
    setActiveGap((prev) => (prev === index ? null : index));
  }

  function handleWordClick(word: string) {
    if (checked) return;
    if (activeGap === null) return;
    const current = selected[activeGap];
    if (current === word) {
      // deselect
      const next = [...selected];
      next[activeGap] = null;
      setSelected(next);
      setActiveGap(null);
      return;
    }
    // If word is already placed somewhere, remove it from that gap
    const existingGapIndex = selected.indexOf(word);
    const next = [...selected];
    if (existingGapIndex !== -1) {
      next[existingGapIndex] = current;
    }
    next[activeGap] = word;
    setSelected(next);
    setActiveGap(null);
  }

  function removeFromGap(index: number) {
    if (checked) return;
    const next = [...selected];
    next[index] = null;
    setSelected(next);
    setActiveGap(index);
  }

  function check() {
    if (!allFilled) return;
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
    setSelected(Array(ANSWERS.length).fill(null));
    setActiveGap(null);
    setChecked(false);
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "reading",
        level: "c1",
        slug: "language-and-thought",
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
            <a className="hover:text-white transition" href="/reading/c1">C1</a>{" "}
            <span className="text-white/30">/</span>{" "}
            <span className="text-white/80">Language and Thought</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sky-400 px-3 py-1 text-xs font-black text-black">
              C1
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              Fill in Blanks
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              8 questions
            </span>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            Language and Thought
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Click a gap in the text, then click the correct word from the word bank to fill it.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Word bank */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-3">
            Word Bank
          </p>
          <div className="flex flex-wrap gap-2">
            {WORD_BANK.map((word) => {
              const isUsed = usedWords.includes(word);
              const isActive =
                activeGap !== null && selected[activeGap] === word;
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => handleWordClick(word)}
                  disabled={checked || (isUsed && activeGap === null)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition select-none ${
                    checked
                      ? isUsed
                        ? "border-slate-200 text-slate-400 line-through cursor-default"
                        : "border-slate-200 text-slate-400 cursor-default"
                      : isActive
                      ? "bg-[#F5DA20] border-[#F5DA20] text-black"
                      : isUsed
                      ? "border-slate-200 text-slate-300 line-through cursor-default"
                      : activeGap !== null
                      ? "border-sky-300 text-sky-700 bg-sky-50 hover:bg-sky-100 cursor-pointer"
                      : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50 cursor-pointer"
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>Progress</span>
            <span>{filledCount} / {ANSWERS.length}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
              style={{ width: `${(filledCount / ANSWERS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Text with gaps */}
        <div
          ref={resultsRef}
          className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
        >
          <h2 className="text-base font-black text-slate-800 uppercase tracking-wide mb-4">
            Fill in the blanks
          </h2>
          <p className="text-slate-700 leading-[2.4] text-base">
            {SEGMENTS.map((seg, i) => {
              if (seg.type === "text") {
                return <span key={i}>{seg.content}</span>;
              }

              const gapIndex = seg.index;
              const word = selected[gapIndex];
              const isActive = activeGap === gapIndex;
              const isCorrect = checked ? word === ANSWERS[gapIndex] : null;

              let gapClass =
                "inline-flex items-center justify-center rounded-lg border-2 px-2 py-0.5 text-sm font-bold transition cursor-pointer select-none mx-0.5 min-w-[100px] ";

              if (!checked) {
                if (isActive) {
                  gapClass += "border-[#F5DA20] bg-[#F5DA20]/10 text-slate-800";
                } else if (word) {
                  gapClass += "border-sky-400 bg-sky-50 text-sky-800";
                } else {
                  gapClass += "border-dashed border-slate-300 text-slate-400 hover:border-slate-500";
                }
              } else {
                if (isCorrect) {
                  gapClass += "border-emerald-400 bg-emerald-50 text-emerald-700";
                } else {
                  gapClass += "border-red-400 bg-red-50 text-red-700";
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  className={gapClass}
                  onClick={() => {
                    if (word && !checked) {
                      removeFromGap(gapIndex);
                    } else {
                      handleGapClick(gapIndex);
                    }
                  }}
                  disabled={checked}
                  title={
                    checked
                      ? isCorrect
                        ? "Correct"
                        : `Correct answer: ${ANSWERS[gapIndex]}`
                      : word
                      ? `Remove "${word}"`
                      : "Click to select"
                  }
                >
                  {word ? (
                    <span>
                      {word}
                      {checked && !isCorrect && (
                        <span className="ml-1.5 text-xs font-black text-emerald-600">
                          ({ANSWERS[gapIndex]})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-slate-400">
                      {gapIndex + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </p>
        </div>

        {/* Check / score area */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {!checked ? (
            <button
              type="button"
              onClick={check}
              disabled={!allFilled}
              className={`rounded-2xl px-8 py-3 text-base font-black transition ${
                allFilled
                  ? "bg-[#F5DA20] text-black hover:opacity-90"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {allFilled ? "Check Answers" : `Fill in all ${ANSWERS.length} gaps`}
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
                {correctCount} / {ANSWERS.length}
              </p>
              <p className="mt-1 text-slate-500 text-sm">{percent}% correct</p>
              <p className="mt-3 text-slate-700 font-semibold">
                {grade === "great"
                  ? "Excellent vocabulary in context. Well done."
                  : grade === "ok"
                  ? "Good effort. Review the words you missed and note how they are used in the text."
                  : "Keep practising. Read the full text first, then try the word bank again."}
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
