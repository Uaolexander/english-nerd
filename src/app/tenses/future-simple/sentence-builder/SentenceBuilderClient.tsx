"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { FUTSIM_SPEED_QUESTIONS, FUTSIM_PDF_CONFIG } from "../futSimSharedData";
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
    title: "Exercise 1 — Affirmative & Negative",
    instructions: "Tap the English tiles in the correct order to build the sentence.",
    questions: [
      { id: "1-1",  words: ["later", "I", ".", "you", "will", "call"],                          correct: "I will call you later .",           explanation: "Affirmative: I will call you later. (subject + will + base form)" },
      { id: "1-2",  words: ["tomorrow", "She", ".", "the", "will", "finish", "project"],        correct: "She will finish the project tomorrow .", explanation: "Affirmative: She will finish the project tomorrow." },
      { id: "1-3",  words: ["by", "6", "train", "PM", "at", "The", "arrive", ".", "will"],      correct: "The train will arrive at 6 PM .",    explanation: "Affirmative: The train will arrive at 6 PM." },
      { id: "1-4",  words: ["They", "soon", ".", "will", "us", "help"],                         correct: "They will help us soon .",           explanation: "Affirmative: They will help us soon." },
      { id: "1-5",  words: ["year", "next", ".", "30", "She", "turn", "will"],                  correct: "She will turn 30 next year .",       explanation: "Fact about the future: She will turn 30 next year." },
      { id: "1-6",  words: ["about", "tell", "I", "won't", ".", "this", "anyone"],              correct: "I won't tell anyone about this .",   explanation: "Negative promise: I won't tell anyone about this." },
      { id: "1-7",  words: ["on", "They", "won't", ".", "be", "time"],                          correct: "They won't be on time .",            explanation: "Negative prediction: They won't be on time." },
      { id: "1-8",  words: ["won't", "party", "She", "the", "come", "to", "."],                 correct: "She won't come to the party .",      explanation: "Negative: She won't come to the party." },
      { id: "1-9",  words: ["down", "I", "won't", ".", "let", "you"],                           correct: "I won't let you down .",             explanation: "Negative promise: I won't let you down." },
      { id: "1-10", words: ["week", "won't", "The", "this", "weather", "improve", "."],         correct: "The weather won't improve this week .", explanation: "Negative prediction: The weather won't improve this week." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Questions & Short Answers",
    instructions: "Build the Future Simple question or short answer using the tiles in the correct order.",
    questions: [
      { id: "2-1",  words: ["?", "Will", "you", "help", "me"],                                  correct: "Will you help me ?",                explanation: "Question: Will + subject + base form? → Will you help me?" },
      { id: "2-2",  words: ["?", "Will", "she", "come", "meeting", "the", "to"],               correct: "Will she come to the meeting ?",     explanation: "Will she come to the meeting?" },
      { id: "2-3",  words: ["time", "?", "Will", "on", "they", "arrive"],                      correct: "Will they arrive on time ?",         explanation: "Will they arrive on time?" },
      { id: "2-4",  words: ["tomorrow", "?", "Will", "rain", "it"],                            correct: "Will it rain tomorrow ?",            explanation: "Will it rain tomorrow?" },
      { id: "2-5",  words: ["?", "Will", "home", "you", "be", "dinner", "for"],                correct: "Will you be home for dinner ?",      explanation: "Will you be home for dinner?" },
      { id: "2-6",  words: ["will", ".", "Yes", ",", "I"],                                     correct: "Yes , I will .",                     explanation: "Short affirmative answer: Yes, I will." },
      { id: "2-7",  words: ["won't", ".", "No", ",", "she"],                                   correct: "No , she won't .",                   explanation: "Short negative answer: No, she won't." },
      { id: "2-8",  words: ["will", ".", "Yes", ",", "it"],                                    correct: "Yes , it will .",                    explanation: "Short affirmative answer: Yes, it will." },
      { id: "2-9",  words: ["won't", ".", "No", ",", "they"],                                  correct: "No , they won't .",                  explanation: "Short negative answer: No, they won't." },
      { id: "2-10", words: ["office", "?", "Will", "at", "tomorrow", "the", "he", "be"],       correct: "Will he be at the office tomorrow ?", explanation: "Will he be at the office tomorrow?" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Mixed & Contractions",
    instructions: "Build affirmative, negative, or question sentences. Some use contractions (I'll, won't, she'll, etc.).",
    questions: [
      { id: "3-1",  words: ["it", "I'll", ".", "get"],                                          correct: "I'll get it .",                     explanation: "Contraction: I'll = I will. Spontaneous decision." },
      { id: "3-2",  words: ["later", "call", "I'll", ".", "you"],                               correct: "I'll call you later .",             explanation: "I'll = I will. Promise." },
      { id: "3-3",  words: ["exam", "She'll", "pass", ".", "the"],                              correct: "She'll pass the exam .",            explanation: "She'll = She will. Prediction." },
      { id: "3-4",  words: ["the", "They'll", "help", ".", "with", "move", "us"],               correct: "They'll help us with the move .",   explanation: "They'll = They will. Offer." },
      { id: "3-5",  words: ["?", "Will", "for", "you", "wait", "me"],                          correct: "Will you wait for me ?",            explanation: "Request: Will you wait for me?" },
      { id: "3-6",  words: ["about", "We", "won't", "tell", ".", "anyone", "this"],             correct: "We won't tell anyone about this .", explanation: "won't = will not. Negative promise." },
      { id: "3-7",  words: ["soon", "It'll", ".", "be", "ready"],                               correct: "It'll be ready soon .",             explanation: "It'll = It will. Prediction." },
      { id: "3-8",  words: ["probably", "He'll", "late", ".", "be"],                            correct: "He'll probably be late .",          explanation: "He'll = He will. Prediction with 'probably'." },
      { id: "3-9",  words: ["?", "she", "Will", "be", "office", "the", "at"],                  correct: "Will she be at the office ?",       explanation: "Will she be at the office? (question)" },
      { id: "3-10", words: ["fine", ".", "think", "everything", "I", "will", "be"],             correct: "I think everything will be fine .", explanation: "I think everything will be fine. Prediction based on opinion." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3, string> = {
  1: "Aff + Neg",
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
    try { await generateLessonPDF(FUTSIM_PDF_CONFIG); } finally { setPdfLoading(false); }
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-simple">Future Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Builder</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the English tiles in the correct order to build a Future Simple sentence. Three exercise sets — affirmative &amp; negative, questions &amp; short answers, and mixed with contractions.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="futsim-sentence-builder" subject="Future Simple" questions={FUTSIM_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                            <div className="font-mono font-black text-base">{q.correct.replace(/ \./g, ".").replace(/ \?/g, "?").replace(/ ,/g, ",")}</div>
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
            <TenseRecommendations tense="future-simple" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-simple/spot-the-mistake" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Spot the Mistake</a>
          <a href="/tenses/future-simple" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Future Simple →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

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
            { text: "will", color: "yellow" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will call.  ·  She will go.  ·  They will be ready." />
            <Ex en="Contractions: I'll call.  ·  She'll go.  ·  They'll be ready." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't", color: "red" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't tell.  ·  She won't come.  ·  They won't forget." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb (base form)", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you help me?  ·  Will she come?  ·  Will it rain?" />
          </div>
        </div>
      </div>

      {/* will is same for all subjects table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will is the same for ALL subjects — no changes!</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
                <th className="px-4 py-2.5 font-black text-sky-700">?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "will work / I'll work", "won't work", "Will I work?"],
                ["You", "will work / you'll work", "won't work", "Will you work?"],
                ["He / She / It", "will work / she'll work ★", "won't work", "Will she work?"],
                ["We / They", "will work / they'll work", "won't work", "Will they work?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> will never changes — no &quot;wills&quot; or &quot;willing&quot;!<br />
          <span className="text-xs">She <b>will work</b> ✅ &nbsp; She <b>will working</b> ❌ &nbsp; She <b>will works</b> ❌</span>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">After will / won&apos;t: ALWAYS base form only!</div>
        <div className="space-y-1 text-sm text-amber-900">
          <div>She will <b>go</b> ✅ &nbsp;|&nbsp; She will <b>goes</b> ❌ &nbsp;|&nbsp; She will <b>going</b> ❌</div>
          <div>He won&apos;t <b>be</b> late ✅ &nbsp;|&nbsp; He won&apos;t <b>being</b> late ❌</div>
        </div>
      </div>

      {/* When to use will */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use will</div>
        <div className="space-y-2">
          {[
            { label: "Spontaneous decisions", ex: "\"I'll get it!\" (phone ringing)" },
            { label: "Predictions based on opinion", ex: "\"I think it will rain.\" / \"She'll probably be late.\"" },
            { label: "Promises", ex: "\"I'll call you later.\" / \"I won't forget.\"" },
            { label: "Offers", ex: "\"I'll carry that for you.\"" },
            { label: "Facts about the future", ex: "\"The sun will rise at 6 AM.\"" },
          ].map(({ label, ex }) => (
            <div key={label} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{label}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* will vs be going to */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will vs be going to</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-b from-yellow-50 to-white border border-yellow-200 p-4 space-y-2">
            <div className="text-sm font-black text-yellow-800">will</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• Spontaneous decisions</div>
              <div>• Predictions / opinions</div>
              <div>• Promises &amp; offers</div>
            </div>
            <Ex en="&quot;I'll open the window.&quot; (decided now)" />
          </div>
          <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-200 p-4 space-y-2">
            <div className="text-sm font-black text-sky-800">be going to</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• Pre-made plans &amp; intentions</div>
              <div>• Predictions with visible evidence</div>
            </div>
            <Ex en="&quot;I&apos;m going to visit Paris.&quot; (booked!)" />
          </div>
        </div>
      </div>

      {/* Contractions grid */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Contractions</div>
        <div className="flex flex-wrap gap-2">
          {["I'll", "you'll", "he'll", "she'll", "it'll", "we'll", "they'll", "won't"].map((c) => (
            <span key={c} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{c}</span>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["tomorrow", "next week", "next month", "next year", "soon", "in the future", "one day", "later", "tonight", "in 5 years", "someday", "eventually"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
