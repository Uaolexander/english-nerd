"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { FUTPERFCONT_SPEED_QUESTIONS, FUTPERFCONT_PDF_CONFIG } from "../futPerfContSharedData";
import TenseRecommendations from "@/components/TenseRecommendations";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type SentenceQ = {
  id: string;
  words: string[];
  correct: string;
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3;
  title: string;
  instructions: string;
  questions: SentenceQ[];
};

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Affirmative with duration",
    instructions: "Tap the tiles in the correct order to build a Future Perfect Continuous affirmative sentence with a duration phrase.",
    questions: [
      { id: "1-1",  words: ["years", "By", "June", "will", ".", "working", "have", "she", "five", "for", "been", "next"],              correct: "By next June she will have been working for five years .",       explanation: "will have been working + for + duration. By next June = future deadline." },
      { id: "1-2",  words: ["When", "film", "the", "ends", ".", "watching", "three", "hours", "have", "for", "been", "will", "they"],  correct: "When the film ends they will have been watching for three hours .", explanation: "will have been watching — emphasising duration of the activity." },
      { id: "1-3",  words: ["hour", "By", "will", "the", ".", "waiting", "an", "over", "time", "for", "been", "I", "have", "you", "arrive"], correct: "By the time you arrive I will have been waiting for over an hour .", explanation: "By the time + clause → FPC to show duration until that moment." },
      { id: "1-4",  words: ["2030", "he", "will", "By", ".", "teaching", "twenty", "years", "have", "for", "been", "school", "at", "this"],   correct: "By 2030 he will have been teaching at this school for twenty years .", explanation: "will have been teaching — 20-year duration up to 2030." },
      { id: "1-5",  words: ["line", "running", "she", "four", ".", "for", "hours", "have", "been", "will", "When", "she", "crosses", "the", "finish"], correct: "When she crosses the finish line she will have been running for four hours .", explanation: "will have been running — emphasises the physical effort / duration." },
      { id: "1-6",  words: ["months", "six", "read", "you", "I", "By", ".", "travelling", "this", "for", "been", "will", "have", "time", "the"],   correct: "By the time you read this I will have been travelling for six months .", explanation: "will have been travelling — duration up to the moment of reading." },
      { id: "1-7",  words: ["By", "midnight", ".", "dancing", "five", "hours", "will", "have", "for", "been", "they", "straight"],           correct: "By midnight they will have been dancing for five hours straight .",   explanation: "will have been dancing — emphasises the unbroken duration." },
      { id: "1-8",  words: ["he", "medicine", "six", "years", ".", "studying", "By", "graduates", "for", "been", "will", "time", "the", "have", "he"],  correct: "By the time he graduates he will have been studying medicine for six years .", explanation: "will have been studying — long academic duration." },
      { id: "1-9",  words: ["apartment", "decade", "By", "next", ".", "living", "in", "a", "for", "been", "we", "will", "have", "year", "this"],  correct: "By next year we will have been living in this apartment for a decade .",  explanation: "will have been living — live → living (drop -e)." },
      { id: "1-10", words: ["ends", "project", "working", "three", "years", "the", ".", "team", "By", "time", "on", "for", "been", "will", "have", "the", "it", "the"],  correct: "By the time the project ends the team will have been working on it for three years .", explanation: "will have been working on it — duration until the project's end." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Questions with How long",
    instructions: "Build Future Perfect Continuous questions starting with Will or How long will.",
    questions: [
      { id: "2-1",  words: ["here", "?", "a", "Will", "year", "she", "working", "been", "have", "for"],                   correct: "Will she have been working here for a year ?",          explanation: "Will + subject + have been + verb-ing? — future duration question." },
      { id: "2-2",  words: ["long", "How", "you", "here", "?", "living", "will", "have", "been", "summer", "next", "by"], correct: "How long will you have been living here by next summer ?", explanation: "How long will you have been living? — duration up to next summer." },
      { id: "2-3",  words: ["bus", "waiting", "they", "?", "the", "Will", "two", "for", "hours", "have", "been", "when", "finally", "comes", "the"],  correct: "Will they have been waiting for two hours when the bus finally comes ?", explanation: "Will they have been waiting? — checks the duration at a future point." },
      { id: "2-4",  words: ["long", "How", "?", "she", "will", "studying", "have", "been", "French"],                    correct: "How long will she have been studying French ?",          explanation: "How long will she have been studying? — open-ended duration question." },
      { id: "2-5",  words: ["the", "for", "stadium", "long", "they", "How", "?", "building", "will", "have", "been", "July", "new", "by"],           correct: "How long will they have been building the new stadium by July ?",    explanation: "How long will they have been building? — duration question with deadline." },
      { id: "2-6",  words: ["hours", "he", "?", "three", "running", "Will", "have", "for", "been"],                       correct: "Will he have been running for three hours ?",            explanation: "Will he have been running? — yes/no question about duration." },
      { id: "2-7",  words: ["I", "?", "Will", "month", "a", "for", "travelling", "have", "been"],                         correct: "Will I have been travelling for a month ?",              explanation: "Will I have been travelling? — first-person future duration question." },
      { id: "2-8",  words: ["long", "English", "will", "she", "?", "learning", "How", "have", "been"],                    correct: "How long will she have been learning English ?",         explanation: "How long will she have been learning? — duration question." },
      { id: "2-9",  words: ["Will", "all", "?", "been", "day", "he", "studying", "have"],                                 correct: "Will he have been studying all day ?",                   explanation: "Will he have been studying all day? — time-span question." },
      { id: "2-10", words: ["long", "ten", "will", "?", "How", "years", "teaching", "have", "been", "you", "by", "then"],  correct: "How long will you have been teaching by then for ten years ?", explanation: "How long will you have been teaching? — open duration question." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Mixed: affirmative, negative, and by the time",
    instructions: "Build affirmative, negative, or question sentences using the tiles. Watch for 'by the time' structures and negatives.",
    questions: [
      { id: "3-1",  words: ["she", "won't", "long", ".", "waiting", "have", "been"],                                                    correct: "She won't have been waiting long .",                              explanation: "Negative: won't have been waiting — short duration." },
      { id: "3-2",  words: ["By", "next", "year", ".", "working", "will", "I", "decade", "for", "a", "have", "been", "here"],            correct: "By next year I will have been working here for a decade .",       explanation: "Affirmative: will have been working + for + duration." },
      { id: "3-3",  words: ["studying", "?", "Will", "all", "they", "night", "have", "been"],                                            correct: "Will they have been studying all night ?",                        explanation: "Will they have been studying? — yes/no question." },
      { id: "3-4",  words: ["retires", "By", "he", ".", "teaching", "forty", "years", "for", "been", "will", "have", "the", "time", "he"], correct: "By the time he retires he will have been teaching for forty years .", explanation: "By the time + clause — FPC emphasises the long duration." },
      { id: "3-5",  words: ["long", ".", "won't", "waiting", "they", "have", "been"],                                                    correct: "They won't have been waiting long .",                             explanation: "Negative: won't have been waiting — duration is short." },
      { id: "3-6",  words: ["By", "living", "?", "will", "long", "How", "have", "you", "here", "been", "summer", "next"],                correct: "How long will you have been living here by next summer ?",        explanation: "How long will you have been living? — duration question." },
      { id: "3-7",  words: ["finish", "he", ".", "been", "running", "When", "he", "will", "hours", "have", "four", "for", "crosses", "line", "the"], correct: "When he crosses the finish line he will have been running for four hours .", explanation: "When + present clause → FPC to describe the ongoing duration." },
      { id: "3-8",  words: ["won't", "She", "long", ".", "sleeping", "have", "been"],                                                    correct: "She won't have been sleeping long .",                             explanation: "Negative: won't have been sleeping — she just fell asleep." },
      { id: "3-9",  words: ["December", "By", ".", "building", "the", "bridge", "for", "years", "two", "will", "have", "been", "they"],   correct: "By December they will have been building the bridge for two years .", explanation: "will have been building — duration up to December." },
      { id: "3-10", words: ["long", "working", "How", "?", "you", "here", "will", "have", "been"],                                       correct: "How long will you have been working here ?",                     explanation: "How long will you have been working here? — open duration question." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3, string> = {
  1: "Affirmative",
  2: "Questions",
  3: "Mixed",
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function SentenceBuilderClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3>(1);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(FUTPERFCONT_PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  const current = SETS[exNo];
  const q = current.questions[qIdx];
  const ans = answers[q.id] ?? [];

  const isChecked = checked[q.id] ?? false;

  const usedSet = new Set(ans);
  const builtSentence = ans.map((i) => q.words[i]).join(" ");
  const isCorrect = normalize(builtSentence) === normalize(q.correct);

  function addWord(idx: number) {
    if (isChecked) return;
    setAnswers((p) => ({ ...p, [q.id]: [...(p[q.id] ?? []), idx] }));
  }

  function removeWord(pos: number) {
    if (isChecked) return;
    setAnswers((p) => ({ ...p, [q.id]: (p[q.id] ?? []).filter((_, i) => i !== pos) }));
  }

  function checkAnswer() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked((p) => ({ ...p, [q.id]: true }));
  }

  function resetQuestion() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAnswers((p) => ({ ...p, [q.id]: [] }));
    setChecked((p) => ({ ...p, [q.id]: false }));
  }

  function switchSet(n: 1 | 2 | 3) {
    setExNo(n);
    setQIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const completedCount = current.questions.filter((sq) => {
    const sqAns = answers[sq.id] ?? [];
    return checked[sq.id] && normalize(sqAns.map((i) => sq.words[i]).join(" ")) === normalize(sq.correct);
  }).length;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect-continuous">Future Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Builder</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">C1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the English tiles in the correct order to build a sentence. Three exercise sets — affirmative with duration, questions with How long, and mixed including by the time clauses.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="fpc-sentence-builder" subject="Future Perfect Continuous Sentence Builder" questions={FUTPERFCONT_SPEED_QUESTIONS} variant="sidebar" /></div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <PDFButton onDownload={handlePDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition text-sm ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition text-sm ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question navigator */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {current.questions.map((sq, i) => {
                      const sqAns = answers[sq.id] ?? [];
                      const sqBuilt = sqAns.map((wi) => sq.words[wi]).join(" ");
                      const sqDone = checked[sq.id];
                      const sqCorrect = sqDone && normalize(sqBuilt) === normalize(sq.correct);
                      const sqWrong = sqDone && !sqCorrect;
                      return (
                        <button key={sq.id} onClick={() => setQIdx(i)}
                          className={`h-8 w-8 rounded-lg border text-xs font-black transition ${
                            i === qIdx ? "border-[#F5DA20] bg-[#F5DA20] text-black"
                            : sqCorrect ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                            : sqWrong ? "border-red-300 bg-red-100 text-red-600"
                            : "border-black/10 bg-white text-slate-600 hover:bg-black/5"
                          }`}>
                          {i + 1}
                        </button>
                      );
                    })}
                    <div className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                      <span className="font-black text-emerald-600">{completedCount}</span>
                      <span>/ {current.questions.length}</span>
                    </div>
                  </div>

                  {/* Question card */}
                  <div className={`rounded-2xl border p-5 md:p-6 transition ${
                    isChecked && isCorrect ? "border-emerald-300 bg-emerald-50/30"
                    : isChecked && !isCorrect ? "border-red-200 bg-red-50/20"
                    : "border-black/10 bg-white"
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">{qIdx + 1} / {current.questions.length}</span>
                      {isChecked && (
                        <span className={`text-sm font-black ${isCorrect ? "text-emerald-600" : "text-red-500"}`}>
                          {isCorrect ? "✅ Correct!" : "❌ Not quite"}
                        </span>
                      )}
                    </div>

                    {/* Answer zone */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Your sentence</div>
                      <div className={`min-h-[52px] flex flex-wrap gap-2 items-center rounded-xl border-2 border-dashed p-3 transition ${
                        isChecked && isCorrect ? "border-emerald-400 bg-emerald-50"
                        : isChecked && !isCorrect ? "border-red-300 bg-red-50"
                        : ans.length > 0 ? "border-[#F5DA20]/60 bg-[#FFFBDC]"
                        : "border-black/15 bg-black/[0.02]"
                      }`}>
                        {ans.length === 0 ? (
                          <span className="text-slate-300 text-sm select-none">Tap words below to build the sentence…</span>
                        ) : (
                          ans.map((wordIdx, pos) => (
                            <button key={pos} onClick={() => removeWord(pos)} disabled={isChecked}
                              className={`rounded-lg px-3 py-1.5 text-sm font-bold border transition select-none ${
                                isChecked
                                  ? isCorrect ? "border-emerald-300 bg-emerald-100 text-emerald-800 cursor-default"
                                    : "border-red-300 bg-red-100 text-red-700 cursor-default"
                                  : "border-[#F5DA20] bg-[#F5DA20] text-black hover:bg-amber-300 cursor-pointer"
                              }`}>
                              {q.words[wordIdx]}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Word bank */}
                    <div className="mb-5">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Word bank</div>
                      <div className="flex flex-wrap gap-2">
                        {q.words.map((word, idx) => {
                          const isUsed = usedSet.has(idx);
                          return (
                            <button key={idx} onClick={() => !isChecked && !isUsed && addWord(idx)}
                              disabled={isChecked || isUsed}
                              className={`rounded-lg px-3 py-1.5 text-sm font-bold border transition select-none ${
                                isUsed || isChecked
                                  ? "border-black/8 bg-black/[0.03] text-slate-300 cursor-default"
                                  : "border-black/15 bg-white text-slate-800 hover:border-[#F5DA20] hover:bg-[#FFF9C2] cursor-pointer active:scale-95"
                              }`}>
                              {word}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Feedback */}
                    {isChecked && (
                      <div className={`rounded-xl px-4 py-3 mb-4 text-sm ${isCorrect ? "bg-emerald-100 text-emerald-900" : "bg-amber-50 text-amber-900 border border-amber-200"}`}>
                        {isCorrect ? (
                          <span className="font-bold">👍 {q.explanation}</span>
                        ) : (
                          <>
                            <div className="font-bold mb-1">Correct sentence:</div>
                            <div className="font-mono font-black text-base">{q.correct.replace(/ \./g, ".").replace(/ \?/g, "?")}</div>
                            <div className="mt-1 text-xs text-amber-700">{q.explanation}</div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {!isChecked ? (
                        <>
                          <button onClick={checkAnswer} disabled={ans.length === 0}
                            className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                            Check
                          </button>
                          <button onClick={resetQuestion} disabled={ans.length === 0}
                            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-black/5 transition disabled:opacity-30">
                            Clear
                          </button>
                        </>
                      ) : (
                        <>
                          {!isCorrect && (
                            <button onClick={resetQuestion} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                              Try Again
                            </button>
                          )}
                          {qIdx < current.questions.length - 1 && (
                            <button onClick={() => setQIdx((p) => p + 1)} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                              Next →
                            </button>
                          )}
                          {qIdx === current.questions.length - 1 && exNo < 3 && (
                            <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3)} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                              Next Set →
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <Explanation />
              )}
            </div>
          </section>

          {/* Right column */}
          {isPro ? (
            <TenseRecommendations tense="future-perfect-continuous" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {!isPro && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
            <div className="hidden lg:block" />
            <SpeedRound gameId="fpc-sentence-builder" subject="Future Perfect Continuous Sentence Builder" questions={FUTPERFCONT_SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-perfect-continuous/spot-the-mistake" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Spot the Mistake</a>
          <a href="/tenses/future-perfect-continuous" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Future Perfect Continuous →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation ─────────────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}>{p.text}</span>
      ))}
    </div>
  );
}

function Ex({ en }: { en: string }) {
  return (
    <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
      <div className="font-semibold text-slate-900 text-sm">{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">

      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will have been working for 3 hours.  ·  She will have been studying all day." />
            <Ex en="They will have been waiting for an hour.  ·  He'll have been teaching for 20 years." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't have been", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't have been working long.  ·  She won't have been waiting." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you have been working for long?  ·  Will she have been waiting long?" />
            <Ex en="How long will you have been working there by next year?" />
          </div>
        </div>
      </div>

      {/* Same form table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will have been is the same for ALL subjects</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I / You / He / She / It / We / They", "will have been working", "won't have been working"],
              ].map(([subj, aff, neg], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          <span className="font-black">Key point:</span> <b>will have been</b> is the same for every subject — no exceptions!
        </div>
      </div>

      {/* Stative verbs */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Stative verbs — no continuous form!</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {["know", "believe", "understand", "like", "love", "hate", "want", "need", "seem", "own", "belong", "have (possession)"].map((v) => (
            <span key={v} className="rounded-lg bg-white border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">{v}</span>
          ))}
        </div>
        <div className="mt-2 text-xs text-amber-700">✅ By then, I will have known her for 10 years. &nbsp;|&nbsp; ❌ I will have been knowing her.</div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Future Perfect Continuous</div>
        <div className="space-y-3">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-sm font-black text-slate-800 mb-2">Duration up to a future point</div>
            <Ex en="By next month, I will have been learning English for 3 years." />
            <Ex en="By the time he retires, he will have been teaching for 40 years." />
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-sm font-black text-slate-800 mb-2">Emphasise continuous activity</div>
            <Ex en="When she finishes the marathon, she will have been running for 4 hours." />
          </div>
        </div>
      </div>

      {/* FPC vs Future Perfect */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">FPC vs Future Perfect</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Future Perfect Continuous</div>
            <div className="text-xs text-slate-500 mb-2">Emphasises duration / ongoing process</div>
            <Ex en="By 5 PM, I'll have been working for 8 hours." />
          </div>
          <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
            <div className="text-xs font-black text-sky-700 uppercase tracking-widest mb-2">Future Perfect Simple</div>
            <div className="text-xs text-slate-500 mb-2">Emphasises completion / result</div>
            <Ex en="By 5 PM, I'll have finished the report." />
          </div>
        </div>
      </div>

      {/* -ing spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ing", ex: "work → working · play → playing · read → reading" },
            { rule: "Ends in -e → drop the -e, add -ing", ex: "make → making · come → coming · write → writing" },
            { rule: "Short verb (CVC) → double the final consonant", ex: "run → running · sit → sitting · swim → swimming" },
            { rule: "Ends in -ie → change to -y, add -ing", ex: "die → dying · lie → lying · tie → tying" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{rule}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["by next year", "for + duration", "by the time", "how long", "when + future clause", "by + future date", "by then", "for hours / days / years"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
