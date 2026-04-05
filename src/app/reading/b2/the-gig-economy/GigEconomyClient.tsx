"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";

const WORD_BOX = [
  "precarious",
  "autonomy",
  "exploit",
  "entitlements",
  "surge",
  "transparency",
  "regulate",
  "vulnerable",
] as const;

type Word = (typeof WORD_BOX)[number];

// Text segments: string = plain text, number = gap index (1-based)
type Segment = string | number;

const SEGMENTS: Segment[] = [
  "The rapid ",
  1,
  " in app-based work platforms has transformed labour markets across the world. Millions of people now earn income through companies such as Uber, Deliveroo and TaskRabbit, which classify their workers as independent contractors rather than employees. Proponents argue that this model offers workers genuine ",
  2,
  " and flexibility. Workers can choose their own hours and work as much or as little as they wish. Critics, however, contend that this classification is used to ",
  3,
  " workers by denying them basic employment ",
  4,
  " such as sick pay, holiday pay and pension contributions. Without these protections, gig workers remain financially ",
  5,
  " and unable to plan for the future. Governments around the world are now attempting to ",
  6,
  " these platforms, though legislation has struggled to keep pace with technological change. Many argue that what is needed is greater ",
  7,
  " from platforms about how pay is calculated and how workers are rated. The debate ultimately reflects broader questions about what constitutes ",
  8,
  " work in the modern economy.",
];

const ANSWERS: Record<number, Word> = {
  1: "surge",
  2: "autonomy",
  3: "exploit",
  4: "entitlements",
  5: "vulnerable",
  6: "regulate",
  7: "transparency",
  8: "precarious",
};

const GAP_COUNT = 8;

export default function GigEconomyClient() {
  const [selected, setSelected] = useState<Record<number, Word | null>>({});
  const [activeGap, setActiveGap] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const usedWords = Object.values(selected).filter(Boolean) as Word[];
  const answeredCount = Object.values(selected).filter((v) => v != null).length;
  const allAnswered = answeredCount === GAP_COUNT;

  const correctCount = checked
    ? Object.entries(ANSWERS).reduce(
        (n, [gapStr, correct]) =>
          n + (selected[Number(gapStr)] === correct ? 1 : 0),
        0
      )
    : null;
  const percent =
    correctCount !== null ? Math.round((correctCount / GAP_COUNT) * 100) : null;

  function handleGapClick(gapNum: number) {
    if (checked) return;
    setActiveGap((prev) => (prev === gapNum ? null : gapNum));
  }

  function handleWordClick(word: Word) {
    if (checked) return;
    if (activeGap == null) return;

    setSelected((prev) => {
      const next = { ...prev };
      // If word is already placed somewhere else, remove it first
      const existingGap = Object.entries(prev).find(([, w]) => w === word);
      if (existingGap) {
        next[Number(existingGap[0])] = null;
      }
      // If clicking a word that is already in active gap, remove it
      if (prev[activeGap] === word) {
        next[activeGap] = null;
      } else {
        next[activeGap] = word;
      }
      return next;
    });
    setActiveGap(null);
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
    setSelected({});
    setChecked(false);
    setActiveGap(null);
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "reading",
        level: "b2",
        slug: "the-gig-economy",
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
            <span className="text-white/80">The Gig Economy</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-orange-400 px-3 py-1 text-xs font-black text-black">
              B2
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              Fill in Blanks
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              8 questions
            </span>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            The Gig Economy
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Select a gap in the text, then click the correct word from the word box below.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Word box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
            Word box
          </p>
          <div className="flex flex-wrap gap-2">
            {WORD_BOX.map((word) => {
              const isUsed = usedWords.includes(word);
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => handleWordClick(word)}
                  disabled={checked}
                  className={`rounded-xl border px-4 py-2 text-sm font-bold transition select-none ${
                    isUsed
                      ? "line-through border-slate-200 text-slate-300 bg-slate-50 cursor-default"
                      : activeGap != null
                      ? "border-[#F5DA20] bg-[#F5DA20]/10 text-slate-700 hover:bg-[#F5DA20] hover:text-black cursor-pointer"
                      : "border-slate-300 text-slate-600 bg-white hover:border-slate-400 hover:text-slate-800 cursor-pointer"
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
            <span>{answeredCount} / {GAP_COUNT}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
              style={{ width: `${(answeredCount / GAP_COUNT) * 100}%` }}
            />
          </div>
        </div>

        {/* Text with gaps */}
        <div ref={resultsRef} className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <p className="text-slate-700 leading-[2] text-base">
            {SEGMENTS.map((seg, i) => {
              if (typeof seg === "string") {
                return <span key={i}>{seg}</span>;
              }

              const gapNum = seg;
              const filled = selected[gapNum] ?? null;
              const isActive = activeGap === gapNum;

              let gapClass =
                "inline-flex items-center justify-center rounded-lg border-2 px-3 py-0.5 mx-0.5 text-sm font-bold cursor-pointer transition min-w-[120px] ";

              if (checked) {
                const correct = filled === ANSWERS[gapNum];
                if (correct) {
                  gapClass +=
                    "border-emerald-400 bg-emerald-50 text-emerald-700 cursor-default";
                } else {
                  gapClass +=
                    "border-red-400 bg-red-50 text-red-700 cursor-default";
                }
              } else if (isActive) {
                gapClass += "border-[#F5DA20] bg-[#F5DA20]/20 text-slate-800";
              } else if (filled) {
                gapClass +=
                  "border-[#F5DA20] bg-[#F5DA20]/10 text-slate-800 hover:border-[#F5DA20]/70";
              } else {
                gapClass +=
                  "border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10";
              }

              return (
                <button
                  key={i}
                  type="button"
                  className={gapClass}
                  onClick={() => handleGapClick(gapNum)}
                  disabled={checked}
                >
                  {filled ? (
                    <>
                      <span className="mr-1 text-slate-400 font-normal text-xs">
                        ({gapNum})
                      </span>
                      {filled}
                      {checked && filled !== ANSWERS[gapNum] && (
                        <span className="ml-2 text-xs text-slate-500">
                          ({ANSWERS[gapNum]})
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">({gapNum}) ___</span>
                  )}
                </button>
              );
            })}
          </p>
        </div>

        {/* Hint */}
        {!checked && (
          <p className="mt-3 text-xs text-slate-400 text-center">
            {activeGap != null
              ? `Gap (${activeGap}) selected. Choose a word from the word box above.`
              : "Click a gap in the text to select it, then choose a word."}
          </p>
        )}

        {/* Check / score */}
        <div className="mt-6 flex flex-col items-center gap-4">
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
              {allAnswered ? "Check Answers" : `Fill in all ${GAP_COUNT} gaps`}
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
                {correctCount} / {GAP_COUNT}
              </p>
              <p className="mt-1 text-slate-500 text-sm">{percent}% correct</p>
              <p className="mt-3 text-slate-700 font-semibold">
                {grade === "great"
                  ? "Excellent vocabulary range! Well done."
                  : grade === "ok"
                  ? "Good effort. Review the incorrect gaps and their context."
                  : "Keep practising. Reread the text and focus on the context clues."}
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
