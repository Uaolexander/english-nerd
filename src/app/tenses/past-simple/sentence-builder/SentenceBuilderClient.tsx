"use client";

import { useState } from "react";
import { useLiveSync } from "@/lib/useLiveSync";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import TenseRecommendations from "@/components/TenseRecommendations";
import { PS_SPEED_QUESTIONS, PS_PDF_CONFIG } from "../psSharedData";

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
    title: "Exercise 1 — Regular verbs & negatives",
    instructions: "Tap the tiles in the correct order to build the Past Simple sentence.",
    questions: [
      { id: "1-1",  words: ["yesterday", "She", ".", "hard", "worked"],                                correct: "She worked hard yesterday .",                    explanation: "Affirmative: subject + past form. work → worked (regular)" },
      { id: "1-2",  words: ["last", "They", ".", "tennis", "played", "Sunday"],                        correct: "They played tennis last Sunday .",               explanation: "Affirmative: play → played (regular)" },
      { id: "1-3",  words: ["to", "He", "tried", "but", "couldn't", ".", "call"],                      correct: "He tried to call but couldn't .",                explanation: "try → tried (consonant + y → ied)" },
      { id: "1-4",  words: ["the", "She", ".", "carefully", "closed", "door"],                         correct: "She closed the door carefully .",                explanation: "close → closed (drop -e, add -d)" },
      { id: "1-5",  words: ["the", "at", "car", "He", ".", "stopped", "lights"],                       correct: "He stopped the car at the lights .",             explanation: "stop → stopped (CVC: double the final consonant)" },
      { id: "1-6",  words: ["last", "She", "didn't", "night", ".", "work"],                            correct: "She didn't work last night .",                   explanation: "Negative: didn't + base form → didn't work" },
      { id: "1-7",  words: ["to", "They", "come", ".", "didn't", "party", "the"],                      correct: "They didn't come to the party .",                explanation: "Negative: didn't + base form → didn't come" },
      { id: "1-8",  words: ["his", "He", "didn't", "finish", ".", "homework"],                         correct: "He didn't finish his homework .",                explanation: "Negative: didn't + base form → didn't finish" },
      { id: "1-9",  words: ["We", "the", "didn't", "match", ".", "watch"],                             correct: "We didn't watch the match .",                    explanation: "Negative: didn't + base form → didn't watch" },
      { id: "1-10", words: ["plan", "She", "didn't", "the", "trip", "."],                              correct: "She didn't plan the trip .",                     explanation: "Negative: didn't + base form → didn't plan" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Irregular verbs & questions",
    instructions: "Build irregular Past Simple sentences and questions using the tiles in the correct order.",
    questions: [
      { id: "2-1",  words: ["yesterday", "She", ".", "went", "gym", "to", "the"],                      correct: "She went to the gym yesterday .",                explanation: "go → went (irregular)" },
      { id: "2-2",  words: ["a", "He", "wonderful", ".", "had", "time"],                               correct: "He had a wonderful time .",                      explanation: "have → had (irregular)" },
      { id: "2-3",  words: ["last", "I", "night", "saw", "film", "a", "great", "."],                   correct: "I saw a great film last night .",                explanation: "see → saw (irregular)" },
      { id: "2-4",  words: ["a", "She", "wrote", "email", "boss", "her", "to", "."],                   correct: "She wrote an email to her boss .",               explanation: "write → wrote (irregular)" },
      { id: "2-5",  words: ["new", "He", "bought", "a", "last", "laptop", "week", "."],                correct: "He bought a new laptop last week .",             explanation: "buy → bought (irregular)" },
      { id: "2-6",  words: ["?", "Did", "go", "she", "cinema", "the", "to"],                           correct: "Did she go to the cinema ?",                     explanation: "Question: Did + subject + base form" },
      { id: "2-7",  words: ["?", "Did", "him", "you", "see"],                                          correct: "Did you see him ?",                              explanation: "Question: Did + subject + base form" },
      { id: "2-8",  words: ["the", "they", "?", "Did", "find", "keys"],                               correct: "Did they find the keys ?",                       explanation: "Question: Did + subject + base form" },
      { id: "2-9",  words: ["he", "?", "Did", "come", "work", "to"],                                  correct: "Did he come to work ?",                          explanation: "Question: Did + subject + base form" },
      { id: "2-10", words: ["what", "?", "you", "did", "eat", "for", "breakfast"],                    correct: "what did you eat for breakfast ?",               explanation: "Wh- question: what + did + subject + base form?" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Mixed: all forms",
    instructions: "Build affirmative, negative, or question sentences in the Past Simple using the tiles.",
    questions: [
      { id: "3-1",  words: ["Paris", ".", "last", "They", "visited", "summer"],                        correct: "They visited Paris last summer .",               explanation: "Affirmative: visit → visited (regular)" },
      { id: "3-2",  words: ["breakfast", "didn't", "I", ".", "eat"],                                   correct: "I didn't eat breakfast .",                       explanation: "Negative: didn't + base form → didn't eat" },
      { id: "3-3",  words: ["home", "She", ".", "late", "came"],                                       correct: "She came home late .",                           explanation: "Affirmative: come → came (irregular)" },
      { id: "3-4",  words: ["call", "He", "didn't", "back", ".", "me"],                                correct: "He didn't call me back .",                       explanation: "Negative: didn't + base form → didn't call" },
      { id: "3-5",  words: ["the", "?", "win", "Did", "team", "they"],                                correct: "Did they win the team ?",                        explanation: "Question: Did + subject + base form" },
      { id: "3-6",  words: ["the", "We", "spent", "beach", "at", ".", "day"],                          correct: "We spent the day at the beach .",                explanation: "Affirmative: spend → spent (irregular)" },
      { id: "3-7",  words: ["know", "about", "We", "it", "didn't", "."],                               correct: "We didn't know about it .",                      explanation: "Negative: didn't + base form → didn't know" },
      { id: "3-8",  words: ["the", "?", "Did", "she", "enjoy", "trip"],                               correct: "Did she enjoy the trip ?",                       explanation: "Question: Did + subject + base form" },
      { id: "3-9",  words: ["a", "He", "new", ".", "started", "job", "last", "month"],                correct: "He started a new job last month .",              explanation: "Affirmative: start → started (regular)" },
      { id: "3-10", words: ["where", "holiday", "?", "you", "go", "did", "for", "your"],             correct: "where did you go for your holiday ?",            explanation: "Wh- question: where + did + subject + base form?" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3, string> = {
  1: "Regular + Neg",
  2: "Irregular + Q",
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
    try { await generateLessonPDF(PS_PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  const { broadcast } = useLiveSync((payload) => {
    const a = payload.answers as {
      tiles: Record<string, number[]>;
      qIdx: number;
      checked: Record<string, boolean>;
    };
    setAnswers(a.tiles ?? {});
    setQIdx(a.qIdx ?? 0);
    setChecked(a.checked ?? {});
    setExNo((payload.exNo ?? 1) as 1 | 2 | 3);
  });

  function broadcastSB(params: {
    tiles?: Record<string, number[]>;
    qIdx?: number;
    checked?: Record<string, boolean>;
    exNo?: number;
  } = {}) {
    broadcast({
      answers: {
        tiles: params.tiles ?? answers,
        qIdx: params.qIdx ?? qIdx,
        checked: params.checked ?? checked,
      },
      checked: false,
      exNo: params.exNo ?? exNo,
    });
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
    const newAnswers = { ...answers, [q.id]: [...(answers[q.id] ?? []), idx] };
    setAnswers(newAnswers);
    broadcastSB({ tiles: newAnswers });
  }

  function removeWord(pos: number) {
    if (isChecked) return;
    const newAnswers = { ...answers, [q.id]: (answers[q.id] ?? []).filter((_, i) => i !== pos) };
    setAnswers(newAnswers);
    broadcastSB({ tiles: newAnswers });
  }

  function checkAnswer() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const newChecked = { ...checked, [q.id]: true };
    setChecked(newChecked);
    broadcastSB({ checked: newChecked });
  }

  function resetQuestion() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const newAnswers = { ...answers, [q.id]: [] };
    const newChecked = { ...checked, [q.id]: false };
    setAnswers(newAnswers);
    setChecked(newChecked);
    broadcastSB({ tiles: newAnswers, checked: newChecked });
  }

  function switchSet(n: 1 | 2 | 3) {
    setExNo(n);
    setQIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
    broadcastSB({ tiles: {}, qIdx: 0, checked: {}, exNo: n });
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-simple">Past Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Builder</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the English tiles in the correct order to build a Past Simple sentence. Three exercise sets — regular verbs &amp; negatives, irregular verbs &amp; questions, and mixed.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="ps-sentence-builder" subject="Past Simple" questions={PS_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                        <button key={sq.id} onClick={() => { setQIdx(i); broadcastSB({ qIdx: i }); }}
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
                            <button onClick={() => { const nq = qIdx + 1; setQIdx(nq); broadcastSB({ qIdx: nq }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
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
            <TenseRecommendations tense="past-simple" />
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/past-simple/spot-the-mistake" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Spot the Mistake</a>
          <a href="/tenses/past-simple" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Past Simple →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation ─────────────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) =>
        p.dim ? (
          <span key={i} className="text-slate-400 font-bold text-sm">+</span>
        ) : (
          <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${p.color ? colors[p.color] : colors.slate}`}>
            {p.text}
          </span>
        )
      )}
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
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">How to Build Past Simple Sentences</h2>
        <p className="text-slate-500 text-sm">Three patterns — learn the formula, then practise.</p>
      </div>

      {/* 3 sentence types */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Affirmative */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Affirmative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "past form", color: "green" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="She worked hard." />
            <Ex en="He went home." />
            <Ex en="They played tennis." />
          </div>
        </div>

        {/* Negative */}
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Negative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "didn't", color: "red" }, { dim: true, text: "+" },
            { text: "base form", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="She didn't work." />
            <Ex en="He didn't go." />
            <Ex en="They didn't play." />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[
            { text: "Did", color: "violet" }, { dim: true, text: "+" },
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "base form", color: "slate" }, { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Did she work?" />
            <Ex en="Did he go?" />
            <Ex en="Did they play?" />
          </div>
        </div>
      </div>

      {/* Conjugation table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Past Simple is the same for all persons</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Subject</th>
                <th className="text-left font-black text-emerald-600 pb-2 pr-4">✅ Affirmative</th>
                <th className="text-left font-black text-red-500 pb-2 pr-4">❌ Negative</th>
                <th className="text-left font-black text-sky-600 pb-2">❓ Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I",          "I worked",          "I didn't work",          "Did I work?"],
                ["You",        "You worked",         "You didn't work",         "Did you work?"],
                ["He / She ★", "She worked",         "She didn't work",         "Did she work?"],
                ["It",         "It worked",          "It didn't work",          "Did it work?"],
                ["We / They",  "They worked",        "They didn't work",        "Did they work?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="py-2 pr-4 font-black text-slate-700">{subj}</td>
                  <td className="py-2 pr-4 font-mono text-sm text-emerald-700">{aff}</td>
                  <td className="py-2 pr-4 font-mono text-sm text-red-600">{neg}</td>
                  <td className="py-2 font-mono text-sm text-sky-700">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ Remember:</b> always use the <b>base form</b> after <b>didn&apos;t</b> and <b>Did</b>.<br />
          <span className="font-mono">She didn&apos;t go</span> ✅ &nbsp;|&nbsp; <span className="font-mono line-through opacity-60">She didn&apos;t went</span> ❌
        </div>
      </div>

      {/* Common irregular verbs */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <h3 className="font-black text-slate-900 mb-4">Common irregular verbs</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "go → went", "have → had", "see → saw", "eat → ate", "come → came",
            "take → took", "make → made", "give → gave", "say → said", "do → did",
            "get → got", "find → found", "know → knew", "think → thought", "buy → bought",
            "leave → left", "write → wrote", "tell → told", "hear → heard", "begin → began",
            "feel → felt", "meet → met", "run → ran", "sit → sat", "stand → stood",
            "fly → flew", "drink → drank", "drive → drove", "wake → woke", "speak → spoke",
            "bring → brought", "catch → caught", "fall → fell", "keep → kept", "lose → lost",
            "pay → paid", "put → put", "send → sent", "sleep → slept", "spend → spent",
            "teach → taught", "wear → wore", "win → won",
          ].map((verb) => (
            <div key={verb} className="rounded-lg bg-violet-50 border border-violet-200 px-2.5 py-1">
              <span className="font-semibold text-violet-800 text-xs">{verb}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">📌</span>
          <h3 className="font-black text-slate-900">Common time expressions</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">These words and phrases signal that the Past Simple is needed:</p>
        <div className="flex flex-wrap gap-2">
          {["yesterday", "last week", "last month", "last year", "last night", "ago", "in 2020", "when I was young", "this morning", "in the past", "once", "at that time"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
