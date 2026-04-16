"use client";

import { useState, useCallback } from "react";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import ReadingRecommendations from "@/components/ReadingRecommendations";
import PDFButton from "@/components/PDFButton";
import { generateReadingPDF, type ReadingPDFConfig } from "@/lib/generateReadingPDF";

const WORD_BOX = [
  "productive",
  "commute",
  "boundaries",
  "routine",
  "colleagues",
  "distracted",
  "flexible",
  "isolation",
] as const;

type Word = (typeof WORD_BOX)[number];

// Correct answer for each gap (1-indexed)
const ANSWERS: Record<number, Word> = {
  1: "flexible",
  2: "commute",
  3: "productive",
  4: "distracted",
  5: "isolation",
  6: "colleagues",
  7: "boundaries",
  8: "routine",
};

// Text segments between gaps
// Each "part" is the text before gap N
const TEXT_PARTS = [
  "Working from home has become very common in recent years, especially since the global pandemic changed the way millions of people work. Many employers now offer hybrid or fully remote positions, and many people enjoy the freedom to set their own ", // before gap 1
  " schedule and work at times that suit them best. Without the need to ", // before gap 2
  " to an office every morning, workers save both time and money, and often feel less stressed at the start of their day. Many employees also report feeling more ", // before gap 3
  " in a home environment because they can focus without the constant noise and interruptions of an open-plan office. However, remote work is not without its challenges. Some people find it difficult to stay focused and feel ", // before gap 4
  " by household tasks, family responsibilities, or the temptation to watch television. Others struggle with ", // before gap 5
  ", missing the social side of office life, the chance to have informal chats, and daily contact with ", // before gap 6
  ". Without these connections, motivation can drop over time. Experts recommend setting clear ", // before gap 7
  " between work and personal time, for example by finishing work at the same time every day and switching off work notifications in the evening. Having a dedicated workspace at home also helps the brain switch into work mode. Overall, remote work suits some people very well, but others prefer the structure and social environment of an office.", // after gap 8 (appended after gap 8)
];

async function saveResult(score: number) {
  try {
    await fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "reading",
        level: "b1",
        slug: "work-from-home",
        exerciseNo: 1,
        score,
        questionsTotal: 8,
      }),
    });
  } catch {
    // Silent -- never break exercise flow
  }
}

export default function WorkFromHomeClient() {
  const isPro = useIsPro();
  // gapAnswers: gap index (1-8) -> word placed there or null
  const [gapAnswers, setGapAnswers] = useState<Record<number, Word | null>>({
    1: null, 2: null, 3: null, 4: null,
    5: null, 6: null, 7: null, 8: null,
  });
  // activeGap: which gap is currently selected for input
  const [activeGap, setActiveGap] = useState<number | null>(1);
  const [checked, setChecked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: ReadingPDFConfig = {
        title: "Work from Home",
        level: "B1",
        filename: "EnglishNerd_Work-from-Home_B1.pdf",
        passages: [{ text: "Fill in each gap with a word from the word box. The words relate to working from home." }],
        fillBlank: {
          wordBank: [...WORD_BOX],
          textParts: TEXT_PARTS,
          answers: [ANSWERS[1], ANSWERS[2], ANSWERS[3], ANSWERS[4], ANSWERS[5], ANSWERS[6], ANSWERS[7], ANSWERS[8]],
        },
      };
      await generateReadingPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  const usedWords = new Set(Object.values(gapAnswers).filter(Boolean) as Word[]);
  const answered = Object.values(gapAnswers).filter((v) => v !== null).length;
  const progress = Math.round((answered / 8) * 100);

  const handleGapClick = useCallback((gapNo: number) => {
    if (checked) return;
    setActiveGap(gapNo);
  }, [checked]);

  const handleWordClick = useCallback((word: Word) => {
    if (checked || activeGap === null) return;

    setGapAnswers((prev) => {
      const next = { ...prev };

      // If word is already placed in another gap, remove it from there
      for (const [key, val] of Object.entries(next)) {
        if (val === word) {
          next[Number(key)] = null;
        }
      }

      // If the active gap already has a word, unplace it
      next[activeGap] = word;

      return next;
    });

    // Advance to next empty gap
    setActiveGap((prev) => {
      const nextEmpty = [1, 2, 3, 4, 5, 6, 7, 8].find(
        (n) => n !== prev && gapAnswers[n] === null && n !== activeGap
      );
      return nextEmpty ?? null;
    });
  }, [checked, activeGap, gapAnswers]);

  const handleRemoveGap = useCallback((gapNo: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (checked) return;
    setGapAnswers((prev) => ({ ...prev, [gapNo]: null }));
    setActiveGap(gapNo);
  }, [checked]);

  const handleCheck = useCallback(async () => {
    if (answered < 8) return;
    setChecked(true);
    const correctCount = Object.entries(ANSWERS).filter(
      ([gap, word]) => gapAnswers[Number(gap)] === word
    ).length;
    const score = Math.round((correctCount / 8) * 100);
    if (!saved) {
      setSaved(true);
      await saveResult(score);
    }
  }, [answered, gapAnswers, saved]);

  const handleReset = useCallback(() => {
    setGapAnswers({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null });
    setActiveGap(1);
    setChecked(false);
    setSaved(false);
  }, []);

  const correctCount = checked
    ? Object.entries(ANSWERS).filter(([gap, word]) => gapAnswers[Number(gap)] === word).length
    : 0;

  function renderGap(gapNo: number) {
    const word = gapAnswers[gapNo];
    const isActive = activeGap === gapNo && !checked;
    const isCorrect = checked && word === ANSWERS[gapNo];
    const isWrong = checked && word !== null && word !== ANSWERS[gapNo];
    const isEmpty = checked && word === null;

    return (
      <button
        key={gapNo}
        type="button"
        onClick={() => handleGapClick(gapNo)}
        className={`relative mx-0.5 inline-flex min-w-[110px] items-center justify-center rounded-lg border-2 px-3 py-1 text-sm font-bold transition align-baseline ${
          isCorrect
            ? "border-emerald-400 bg-emerald-100 text-emerald-800"
            : isWrong
            ? "border-red-400 bg-red-100 text-red-800"
            : isEmpty
            ? "border-red-300 bg-red-50 text-red-400"
            : isActive
            ? "border-[#F5DA20] bg-[#F5DA20]/20 text-slate-800"
            : word
            ? "border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-400"
            : "border-dashed border-slate-300 bg-white text-slate-300 hover:border-[#F5DA20]"
        }`}
      >
        {word ? (
          <>
            <span>{word}</span>
            {!checked && (
              <span
                role="button"
                aria-label="Remove word"
                onClick={(e) => handleRemoveGap(gapNo, e)}
                className="ml-1.5 text-slate-400 hover:text-slate-600 text-xs leading-none"
              >
                x
              </span>
            )}
            {checked && isCorrect && (
              <span className="ml-1 text-emerald-600 text-xs">+</span>
            )}
            {checked && isWrong && (
              <span className="ml-1 text-xs text-red-500">({ANSWERS[gapNo]})</span>
            )}
          </>
        ) : (
          <span className="text-xs">{`___(${gapNo})___`}</span>
        )}
      </button>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/reading">Reading</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/reading/b1">B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Work from Home</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Work from Home
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700 border border-blue-200">
          B1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Read the article and answer the multiple choice questions.
      </p>

      <div className="mt-3 flex items-center gap-3"><PDFButton onDownload={downloadPDF} loading={pdfLoading} /></div>

      {/* Layout grid */}
      <div className={`mt-10 grid gap-6 ${isPro ? "lg:grid-cols-[1fr_300px]" : "lg:grid-cols-[260px_1fr_260px]"}`}>
        {!isPro && <AdUnit variant="sidebar-dark" />}

        {/* Main content card */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="space-y-8">

              {/* Word box */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Word box -- click a gap first, then choose your word
                </p>
                <div className="flex flex-wrap gap-2">
                  {WORD_BOX.map((word) => {
                    const isUsed = usedWords.has(word);
                    return (
                      <button
                        key={word}
                        type="button"
                        onClick={() => handleWordClick(word)}
                        disabled={checked || activeGap === null}
                        className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition ${
                          isUsed
                            ? "border-slate-200 bg-slate-50 text-slate-300 line-through cursor-not-allowed"
                            : activeGap !== null && !checked
                            ? "border-[#F5DA20] bg-[#F5DA20]/10 text-slate-800 hover:bg-[#F5DA20]/20 cursor-pointer"
                            : "border-slate-200 bg-slate-50 text-slate-500 cursor-default"
                        } disabled:cursor-default`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                  <span>{answered} / 8 gaps filled</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Text with inline gaps */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <h2 className="mb-4 text-base font-bold text-slate-800">Fill in the gaps</h2>
                <p className="text-slate-700 leading-loose text-base">
                  {TEXT_PARTS[0]}
                  {renderGap(1)}
                  {TEXT_PARTS[1]}
                  {renderGap(2)}
                  {TEXT_PARTS[2]}
                  {renderGap(3)}
                  {TEXT_PARTS[3]}
                  {renderGap(4)}
                  {TEXT_PARTS[4]}
                  {renderGap(5)}
                  {TEXT_PARTS[5]}
                  {renderGap(6)}
                  {TEXT_PARTS[6]}
                  {renderGap(7)}
                  {" between work and personal time, for example by finishing work at the same time every day. Having a dedicated workspace also helps. Overall, remote work suits some people very well, but others prefer the structure and social environment of an office."}
                </p>
                {answered < 8 && !checked && (
                  <p className="mt-4 text-xs text-slate-400 italic">
                    {activeGap !== null
                      ? `Gap ${activeGap} is selected. Click a word from the box above.`
                      : "Click a gap to select it, then click a word from the box."}
                  </p>
                )}
              </div>

              {/* Result */}
              {checked && (
                <div className="rounded-2xl border-2 border-[#F5DA20] bg-[#F5DA20]/10 p-5 text-center">
                  <p className="text-2xl font-black text-slate-800">
                    {correctCount} / 8
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {correctCount === 8
                      ? "Perfect! All gaps filled correctly."
                      : correctCount >= 6
                      ? "Great job! Just a couple of mistakes."
                      : correctCount >= 4
                      ? "Good effort. Review the words you got wrong and try again."
                      : "Keep practising. Re-read the text and think about meaning and context."}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {!checked ? (
                  <button
                    type="button"
                    onClick={handleCheck}
                    disabled={answered < 8}
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
              </div>

            </div>
          </div>
        </section>

        {isPro ? (
          <ReadingRecommendations level="b1" currentSlug="work-from-home" />
        ) : (
          <AdUnit variant="sidebar-dark" />
        )}
      </div>
    </div>
  );
}
