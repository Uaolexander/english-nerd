"use client";

import { useState, useEffect } from "react";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import ReadingRecommendations from "@/components/ReadingRecommendations";
import PDFButton from "@/components/PDFButton";
import { generateReadingPDF, type ReadingPDFConfig } from "@/lib/generateReadingPDF";

const WORD_BANK = ["fruit", "flowers", "money", "open", "people", "buy", "cold", "favourite"];

type Segment =
  | { type: "text"; value: string }
  | { type: "gap"; index: number; label: string };

const SEGMENTS: Segment[] = [
  { type: "text", value: "Every Saturday morning, the market is " },
  { type: "gap", index: 0, label: "(1)" },
  { type: "text", value: " in the town centre. Many " },
  { type: "gap", index: 1, label: "(2)" },
  { type: "text", value: " come to the market. They want to " },
  { type: "gap", index: 2, label: "(3)" },
  { type: "text", value: " food and other things. You can find fresh " },
  { type: "gap", index: 3, label: "(4)" },
  { type: "text", value: " and vegetables. There are also beautiful " },
  { type: "gap", index: 4, label: "(5)" },
  { type: "text", value: ". The market is Tom's " },
  { type: "gap", index: 5, label: "(6)" },
  { type: "text", value: " place in town. He always brings some " },
  { type: "gap", index: 6, label: "(7)" },
  { type: "text", value: " to buy apples and oranges. In winter, the market can be " },
  { type: "gap", index: 7, label: "(8)" },
  { type: "text", value: ", but people still come." },
];

const ANSWERS = ["open", "people", "buy", "fruit", "flowers", "favourite", "money", "cold"];

export default function AtTheMarketClient() {
  const isPro = useIsPro();
  const [filled, setFilled] = useState<(string | null)[]>(Array(8).fill(null));
  const [activeGap, setActiveGap] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const textParts = SEGMENTS
        .filter(s => s.type === "text")
        .map(s => (s as { type: "text"; value: string }).value);
      const config: ReadingPDFConfig = {
        title: "At the Market",
        level: "A1",
        filename: "EnglishNerd_At-the-Market_A1.pdf",
        passages: [{ text: "Fill in the gaps using the words from the word bank." }],
        fillBlank: {
          wordBank: [...WORD_BANK],
          textParts,
          answers: [...ANSWERS],
        },
      };
      await generateReadingPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  const answeredCount = filled.filter((f) => f !== null).length;
  const allAnswered = answeredCount === 8;

  const correctCount = checked
    ? filled.reduce<number>(
        (n, val, i) => n + (val?.toLowerCase() === ANSWERS[i] ? 1 : 0),
        0
      )
    : null;
  const percent =
    correctCount !== null ? Math.round((correctCount / 8) * 100) : null;

  const usedWords = new Set(filled.filter(Boolean) as string[]);

  function selectGap(index: number) {
    if (checked) return;
    setActiveGap((prev) => (prev === index ? null : index));
  }

  function placeWord(word: string) {
    if (checked) return;
    if (activeGap === null) return;

    setFilled((prev) => {
      const next = [...prev];
      // If word already placed somewhere else, remove it first
      const existingIdx = next.findIndex((w) => w === word);
      if (existingIdx !== -1 && existingIdx !== activeGap) {
        next[existingIdx] = null;
      }
      // If gap already had a word, return it to pool (just set to null)
      next[activeGap] = word;
      return next;
    });
    setActiveGap(null);
  }

  function removeWord(gapIndex: number) {
    if (checked) return;
    setFilled((prev) => {
      const next = [...prev];
      next[gapIndex] = null;
      return next;
    });
    setActiveGap(gapIndex);
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    setActiveGap(null);
  }

  function reset() {
    setFilled(Array(8).fill(null));
    setChecked(false);
    setShowAnswers(false);
    setActiveGap(null);
  }

  function revealAnswers() {
    setFilled([...ANSWERS]);
    setShowAnswers(true);
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
        level: "a1",
        slug: "at-the-market",
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
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/reading">Reading</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/reading/a1">A1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">At the Market</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          At the Market
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Click a gap to select it, then click a word from the box to fill it in.
      </p>

      <div className="mt-3 flex items-center gap-3">
        <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
      </div>

      {/* Layout grid */}
      <div className={`mt-10 grid gap-6 ${isPro ? "lg:grid-cols-[1fr_300px]" : "lg:grid-cols-[260px_1fr_260px]"}`}>
        {!isPro && <AdUnit variant="sidebar-dark" />}

        {/* Main content card */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="p-6 md:p-8">

            {/* Word bank */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-3">
                Word Bank
              </p>
              <div className="flex flex-wrap gap-2">
                {WORD_BANK.map((word) => {
                  const isUsed = usedWords.has(word);
                  return (
                    <button
                      key={word}
                      type="button"
                      onClick={() => !isUsed && !checked && placeWord(word)}
                      disabled={isUsed || checked}
                      className={`rounded-xl border px-4 py-2 text-sm font-bold transition select-none ${
                        isUsed
                          ? "border-slate-200 text-slate-300 line-through cursor-default"
                          : activeGap !== null
                          ? "border-[#F5DA20] bg-[#F5DA20]/10 text-slate-800 hover:bg-[#F5DA20]/20 cursor-pointer"
                          : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50 cursor-pointer"
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
              {activeGap !== null && !checked && (
                <p className="mt-3 text-xs text-slate-400">
                  Gap {activeGap + 1} selected. Click a word above to fill it.
                </p>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>Progress</span>
                <span>{answeredCount} / 8</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                  style={{ width: `${(answeredCount / 8) * 100}%` }}
                />
              </div>
            </div>

            {/* Text with gaps */}
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <p className="text-slate-700 leading-relaxed text-base">
                {SEGMENTS.map((seg, i) => {
                  if (seg.type === "text") {
                    return <span key={i}>{seg.value}</span>;
                  }

                  const { index, label } = seg;
                  const value = filled[index];
                  const isActive = activeGap === index;
                  const isCorrect = checked ? value?.toLowerCase() === ANSWERS[index] : null;

                  let gapClass =
                    "inline-flex items-center justify-center min-w-[90px] rounded-lg border-2 px-3 py-0.5 text-sm font-bold transition mx-0.5 cursor-pointer select-none ";

                  if (checked) {
                    gapClass +=
                      isCorrect === true
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-red-400 bg-red-50 text-red-700";
                  } else if (isActive) {
                    gapClass += "border-[#F5DA20] bg-[#F5DA20]/10 text-slate-800";
                  } else if (value) {
                    gapClass += "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400";
                  } else {
                    gapClass += "border-dashed border-slate-300 text-slate-400 hover:border-[#F5DA20] hover:bg-[#F5DA20]/5";
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      className={gapClass}
                      onClick={() => {
                        if (checked) return;
                        if (value) {
                          removeWord(index);
                        } else {
                          selectGap(index);
                        }
                      }}
                      title={value ? "Click to remove" : `Fill gap ${label}`}
                    >
                      {value ? (
                        <span className="flex items-center gap-1">
                          {value}
                          {checked && isCorrect === true && (
                            <span className="text-emerald-500 text-xs">✓</span>
                          )}
                          {checked && isCorrect === false && (
                            <span className="text-red-500 text-xs">✗</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-normal">{label}</span>
                      )}
                    </button>
                  );
                })}
              </p>

              {/* Correct answers shown after check (wrong ones) */}
              {checked && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-3">
                    Correct Answers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ANSWERS.map((ans, i) => {
                      const userAns = filled[i];
                      const isCorrect = userAns?.toLowerCase() === ans;
                      return (
                        <span
                          key={i}
                          className={`rounded-lg px-3 py-1 text-sm font-bold border ${
                            isCorrect
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                              : "bg-red-50 border-red-300 text-red-700"
                          }`}
                        >
                          ({i + 1}) {ans}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col items-center gap-4">
              {!checked && !showAnswers ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={check}
                    disabled={!allAnswered}
                    className={`w-full sm:w-auto rounded-2xl px-8 py-3 text-base font-black transition ${
                      allAnswered
                        ? "bg-[#F5DA20] text-black hover:opacity-90"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {allAnswered ? "Check Answers" : `Fill all ${8 - answeredCount} remaining gaps`}
                  </button>
                  <button
                    type="button"
                    onClick={revealAnswers}
                    className="w-full sm:w-auto rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
                  >
                    Show Answers
                  </button>
                </div>
              ) : showAnswers && !checked ? (
                <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center">
                  <p className="text-slate-600 font-semibold">
                    Answers revealed. Study them and try again when you are ready.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-4 rounded-xl border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
                  >
                    Try Again
                  </button>
                </div>
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
                    {correctCount} / 8
                  </p>
                  <p className="mt-1 text-slate-500 text-sm">{percent}% correct</p>
                  <p className="mt-3 text-slate-700 font-semibold">
                    {grade === "great"
                      ? "Excellent work! All gaps filled correctly."
                      : grade === "ok"
                      ? "Good effort. Check the answers above."
                      : "Keep practising. Review the correct answers and try once more."}
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
        </section>

        {isPro ? (
          <ReadingRecommendations level="a1" currentSlug="at-the-market" />
        ) : (
          <AdUnit variant="sidebar-dark" />
        )}
      </div>
    </div>
  );
}
