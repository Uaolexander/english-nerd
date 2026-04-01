"use client";

import { useState, useEffect, useRef } from "react";

const WORD_BOX = ["quiet", "transport", "nature", "exciting", "neighbours", "expensive", "fresh", "busy"];

type Segment =
  | { type: "text"; content: string }
  | { type: "gap"; index: number; number: number };

const SEGMENTS: Segment[] = [
  { type: "text", content: "Some people love living in the city because it is " },
  { type: "gap", index: 0, number: 1 },
  { type: "text", content: " and there is always something to do. Cities have good public " },
  { type: "gap", index: 1, number: 2 },
  { type: "text", content: ", so you can get around easily. However, city life can be " },
  { type: "gap", index: 2, number: 3 },
  { type: "text", content: " and many people do not know their " },
  { type: "gap", index: 3, number: 4 },
  { type: "text", content: ". In the country, life is more " },
  { type: "gap", index: 4, number: 5 },
  { type: "text", content: " and peaceful. You are close to " },
  { type: "gap", index: 5, number: 6 },
  { type: "text", content: " and can enjoy walking and cycling. The air is " },
  { type: "gap", index: 6, number: 7 },
  { type: "text", content: " and clean. But there are fewer jobs and it can be hard to get around without a car. Both city and country life have good points. It depends on what you enjoy and what kind of life you want to live." },
];

const ANSWERS = ["exciting", "transport", "expensive", "neighbours", "quiet", "nature", "fresh", "busy"];

export default function CityOrCountryClient() {
  // filled[gapIndex] = word placed in that gap (or null)
  const [filled, setFilled] = useState<(string | null)[]>(Array(8).fill(null));
  const [selectedGap, setSelectedGap] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const questionsTopRef = useRef<HTMLDivElement>(null);

  // Words still available in the word box (not yet placed)
  const usedWords = filled.filter(Boolean) as string[];
  const available = WORD_BOX.filter((w) => !usedWords.includes(w));

  const answeredCount = filled.filter(Boolean).length;
  const allAnswered = answeredCount === 8;

  const correctCount = checked
    ? filled.reduce((n, w, i) => n + (w === ANSWERS[i] ? 1 : 0), 0)
    : null;
  const percent =
    correctCount !== null ? Math.round((correctCount / 8) * 100) : null;

  function clickGap(index: number) {
    if (checked) return;
    setSelectedGap((prev) => (prev === index ? null : index));
  }

  function clickWord(word: string) {
    if (checked) return;
    if (selectedGap === null) return;
    setFilled((prev) => {
      const next = [...prev];
      // If a word was already in this gap, return it to box
      // (handled automatically since we filter usedWords)
      next[selectedGap] = word;
      return next;
    });
    setSelectedGap(null);
  }

  function removeFromGap(index: number) {
    if (checked) return;
    setFilled((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setSelectedGap(null);
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
    setFilled(Array(8).fill(null));
    setSelectedGap(null);
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
        slug: "city-or-country",
        exerciseNo: 1,
        score: percent,
        questionsTotal: 8,
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
            <span className="text-white/70 font-medium">City or Country?</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-400 px-3 py-0.5 text-[11px] font-black text-black">A2</span>
            <span className="rounded-full border border-white/15 px-3 py-0.5 text-[11px] font-semibold text-white/40">Fill in Blanks</span>
            <span className="rounded-full border border-white/15 px-3 py-0.5 text-[11px] font-semibold text-white/40">8 gaps</span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            City or <span className="text-[#F5DA20]">Country?</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/45 leading-relaxed">
            Read the article and fill in the missing words. Click a gap to select it, then click a word from the box below.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">

        {/* Instructions */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20]/20 text-base">💡</span>
          <div>
            <p className="text-sm font-bold text-slate-700">How to answer</p>
            <p className="mt-0.5 text-sm text-slate-500">
              Click on a numbered gap to select it (it will highlight in yellow). Then click a word from the word box to place it. Click a filled gap to remove the word and choose again.
            </p>
          </div>
        </div>

        {/* Word box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Word box</h2>
          <div className="flex flex-wrap gap-2">
            {WORD_BOX.map((word) => {
              const isUsed = usedWords.includes(word);
              return (
                <button
                  key={word}
                  onClick={() => !isUsed && !checked && clickWord(word)}
                  disabled={isUsed || checked || selectedGap === null}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-all duration-150 ${
                    isUsed
                      ? "border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through"
                      : checked
                      ? "border border-slate-200 bg-slate-50 text-slate-400 cursor-default"
                      : selectedGap !== null
                      ? "border-2 border-[#F5DA20] bg-[#F5DA20]/15 text-slate-700 hover:bg-[#F5DA20]/25 cursor-pointer shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 cursor-default opacity-60"
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
          {selectedGap !== null && !checked && (
            <p className="mt-3 text-xs text-[#c9a800] font-semibold">
              Gap ({selectedGap + 1}) selected. Now click a word above to fill it in.
            </p>
          )}
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
                {correctCount} out of 8 correct
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#F5DA20] transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {grade === "great"
                  ? "Excellent! You filled in all the gaps correctly."
                  : grade === "ok"
                  ? "Good effort. Read the text again and try once more."
                  : "Read the text carefully again, then try again."}
              </p>
            </div>
          </div>
        )}

        {/* Text with gaps */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Read and fill the gaps</h2>
          <p className="text-slate-700 leading-relaxed text-base">
            {SEGMENTS.map((seg, i) => {
              if (seg.type === "text") {
                return <span key={i}>{seg.content}</span>;
              }

              const gapIndex = seg.index;
              const word = filled[gapIndex];
              const isSelected = selectedGap === gapIndex;
              const isCorrect = checked && word === ANSWERS[gapIndex];
              const isWrong = checked && word != null && word !== ANSWERS[gapIndex];

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (checked) return;
                    if (word) {
                      removeFromGap(gapIndex);
                    } else {
                      clickGap(gapIndex);
                    }
                  }}
                  disabled={checked}
                  className={`relative mx-0.5 inline-flex min-w-[90px] items-center justify-center rounded-lg border px-2 py-0.5 text-sm font-bold align-middle transition-all duration-150 ${
                    isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : isWrong
                      ? "border-red-400 bg-red-50 text-red-600"
                      : isSelected
                      ? "border-[#F5DA20] bg-[#F5DA20]/20 text-slate-700 shadow-sm"
                      : word
                      ? "border-[#F5DA20]/60 bg-[#F5DA20]/10 text-slate-700 hover:border-red-300 hover:bg-red-50 cursor-pointer"
                      : "border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 cursor-pointer"
                  }`}
                >
                  {word ? (
                    <span className="flex items-center gap-1">
                      {!checked && (
                        <span className="text-[10px] opacity-50">x</span>
                      )}
                      {word}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">({seg.number})</span>
                  )}
                  {checked && isCorrect && (
                    <span className="ml-1 text-xs text-emerald-500">✓</span>
                  )}
                  {checked && isWrong && (
                    <span className="ml-1 text-xs text-red-400">✗</span>
                  )}
                </button>
              );
            })}
          </p>

          {/* Correction row shown after checking */}
          {checked && (
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Correct answers</p>
              <div className="flex flex-wrap gap-2">
                {ANSWERS.map((ans, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-semibold ${
                      filled[i] === ans
                        ? "bg-emerald-50 border border-emerald-400 text-emerald-700"
                        : "bg-red-50 border border-red-400 text-red-600"
                    }`}
                  >
                    <span className="text-xs font-black text-slate-400">({i + 1})</span>
                    {ans}
                    {filled[i] !== ans && filled[i] && (
                      <span className="text-xs text-red-400 line-through">{filled[i]}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Check / reset buttons */}
        <div className="flex items-center gap-3">
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
                  {8 - answeredCount} gap{8 - answeredCount !== 1 ? "s" : ""} remaining
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

      </div>
    </main>
  );
}
