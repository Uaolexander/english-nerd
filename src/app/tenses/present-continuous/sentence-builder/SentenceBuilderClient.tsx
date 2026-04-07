"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import PresentContinuousGameSection from "../PresentContinuousGameSection";

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
      { id: "1-1",  words: ["now", "She", ".", "a", "is", "reading", "book"],               correct: "She is reading a book now .",        explanation: "She → is reading. Affirmative: subject + is/am/are + verb-ing." },
      { id: "1-2",  words: ["moment", "cooking", "the", "I", "at", "dinner", "am", "."],    correct: "I am cooking dinner at the moment .", explanation: "I → am cooking." },
      { id: "1-3",  words: ["today", "from", "He", "home", ".", "is", "working"],           correct: "He is working from home today .",     explanation: "He → is working." },
      { id: "1-4",  words: ["park", "in", ".", "playing", "They", "the", "are", "football"], correct: "They are playing football in the park .", explanation: "They → are playing." },
      { id: "1-5",  words: ["watching", "tonight", "We", "a", "film", "are", "."],          correct: "We are watching a film tonight .",    explanation: "We → are watching." },
      { id: "1-6",  words: ["today", "isn't", "She", ".", "working"],                       correct: "She isn't working today .",           explanation: "She + negative → isn't working." },
      { id: "1-7",  words: ["the", "to", "party", "aren't", "They", "coming", "."],         correct: "They aren't coming to the party .",   explanation: "They + negative → aren't coming." },
      { id: "1-8",  words: ["at", "paying", "class", "isn't", "He", "attention", "in", "."], correct: "He isn't paying attention in class .", explanation: "He + negative → isn't paying." },
      { id: "1-9",  words: ["tonight", "aren't", "We", "out", "going", "."],                correct: "We aren't going out tonight .",       explanation: "We + negative → aren't going." },
      { id: "1-10", words: ["moment", "charging", "isn't", "the", "at", "phone", "My", "."], correct: "My phone isn't charging at the moment .", explanation: "My phone (= it) + negative → isn't charging." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Questions",
    instructions: "Build the Present Continuous question using the tiles in the correct order.",
    questions: [
      { id: "2-1",  words: ["?", "Is", "sleeping", "she"],                                  correct: "Is she sleeping ?",                  explanation: "She → Is: Is she sleeping?" },
      { id: "2-2",  words: ["to", "Are", "?", "listening", "me", "you"],                    correct: "Are you listening to me ?",           explanation: "You → Are: Are you listening?" },
      { id: "2-3",  words: ["coming", "meeting", "Are", "to", "the", "?", "they"],          correct: "Are they coming to the meeting ?",    explanation: "They → Are: Are they coming?" },
      { id: "2-4",  words: ["TV", "right", "Is", "now", "?", "he", "watching"],             correct: "Is he watching TV right now ?",       explanation: "He → Is: Is he watching?" },
      { id: "2-5",  words: ["fast", "Am", "I", "too", "?", "talking"],                      correct: "Am I talking too fast ?",             explanation: "I → Am: Am I talking?" },
      { id: "2-6",  words: ["raining", "Is", "it", "?"],                                    correct: "Is it raining ?",                    explanation: "It → Is: Is it raining?" },
      { id: "2-7",  words: ["Are", "bus", "the", "waiting", "?", "for", "they"],            correct: "Are they waiting for the bus ?",      explanation: "They → Are: Are they waiting?" },
      { id: "2-8",  words: ["phone", "Is", "on", "she", "the", "talking", "?"],             correct: "Is she talking on the phone ?",       explanation: "She → Is: Is she talking?" },
      { id: "2-9",  words: ["you", "?", "Are", "enjoying", "party", "the"],                 correct: "Are you enjoying the party ?",        explanation: "You → Are: Are you enjoying?" },
      { id: "2-10", words: ["Is", "from", "today", "?", "home", "working", "he"],           correct: "Is he working from home today ?",     explanation: "He → Is: Is he working from home?" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Mixed: all forms",
    instructions: "Build affirmative, negative, or question sentences using the tiles.",
    questions: [
      { id: "3-1",  words: ["tree", "cat", ".", "is", "the", "The", "climbing"],            correct: "The cat is climbing the tree .",      explanation: "The cat (= it) → is climbing. Affirmative." },
      { id: "3-2",  words: ["well", "not", "I", "today", ".", "feeling", "am"],             correct: "I am not feeling well today .",        explanation: "I + negative → am not feeling." },
      { id: "3-3",  words: ["?", "Are", "party", "coming", "to", "the", "they"],           correct: "Are they coming to the party ?",      explanation: "They → Are: Are they coming?" },
      { id: "3-4",  words: ["attention", "He", "in", "isn't", "class", "paying", "."],     correct: "He isn't paying attention in class .", explanation: "He + negative → isn't paying." },
      { id: "3-5",  words: ["exam", "?", "studying", "Is", "the", "for", "she"],           correct: "Is she studying for the exam ?",      explanation: "She → Is: Is she studying?" },
      { id: "3-6",  words: ["fast", "year", "Prices", "this", ".", "are", "rising"],       correct: "Prices are rising fast this year .",  explanation: "Prices (= they) → are rising. Temporary trend." },
      { id: "3-7",  words: ["to", "talking", "me", "She", "isn't", ".", "any", "more"],    correct: "She isn't talking to me any more .",  explanation: "She + negative → isn't talking." },
      { id: "3-8",  words: ["the", "?", "Are", "park", "running", "you", "in"],            correct: "Are you running in the park ?",       explanation: "You → Are: Are you running? (run → running: double r)" },
      { id: "3-9",  words: ["sandwich", "He", "making", "a", "is", "."],                   correct: "He is making a sandwich .",           explanation: "He → is making. (make → making: drop -e)" },
      { id: "3-10", words: ["at", "now", "?", "Is", "right", "raining", "it"],             correct: "Is it raining right now ?",           explanation: "It → Is: Is it raining right now?" },
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-continuous">Present Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Builder</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the English tiles in the correct order to build a sentence. Three exercise sets — affirmative & negative, questions, and mixed.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <AdUnit variant="sidebar-dark" />

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
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

          {/* Right ad */}
          <AdUnit variant="sidebar-dark" />
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        <PresentContinuousGameSection />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-continuous/spot-the-mistake" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Spot the Mistake</a>
          <a href="/tenses/present-continuous" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Present Continuous →</a>
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">How to Build Sentences</h2>
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
            { text: "am/is/are", color: "yellow" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I am working." />
            <Ex en="She is working." />
            <Ex en="They are working." />
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
            { text: "'m not / isn't / aren't", color: "red" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I'm not working." />
            <Ex en="She isn't working." />
            <Ex en="They aren't working." />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[
            { text: "Am/Is/Are", color: "violet" }, { dim: true, text: "+" },
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "slate" }, { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Am I working?" />
            <Ex en="Is she working?" />
            <Ex en="Are they working?" />
          </div>
        </div>
      </div>

      {/* am/is/are table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Choosing am / is / are</h3>
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
                ["I",          "I am working",          "I'm not working",        "Am I working?"],
                ["You",        "You are working",       "You aren't working",      "Are you working?"],
                ["He / She",   "She is working ← (is!)", "She isn't working",      "Is she working?"],
                ["It",         "It is raining ← (is!)", "It isn't raining",        "Is it raining?"],
                ["We / They",  "They are working",      "They aren't working",     "Are they working?"],
              ].map(([subj, aff, neg, q]) => (
                <tr key={subj}>
                  <td className="py-2 pr-4 font-black text-slate-700">{subj}</td>
                  <td className={`py-2 pr-4 font-mono text-sm ${subj.startsWith("He") || subj === "It" ? "text-emerald-700 font-black" : "text-slate-600"}`}>{aff}</td>
                  <td className={`py-2 pr-4 font-mono text-sm ${subj.startsWith("He") || subj === "It" ? "text-red-600 font-black" : "text-slate-600"}`}>{neg}</td>
                  <td className={`py-2 font-mono text-sm ${subj.startsWith("He") || subj === "It" ? "text-sky-700 font-black" : "text-slate-600"}`}>{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ Remember:</b> never use <b>don&apos;t / doesn&apos;t</b> with continuous forms.<br />
          <span className="font-mono">She isn&apos;t working</span> ✅ &nbsp;|&nbsp; <span className="font-mono line-through opacity-60">She doesn&apos;t working</span> ❌
        </div>
      </div>

      {/* Common -ing verbs */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <h3 className="font-black text-slate-900 mb-4">Common verbs in Present Continuous</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {[
            "working", "reading", "watching", "playing",
            "running", "sitting", "making", "writing",
            "coming", "going", "talking", "listening",
            "eating", "sleeping", "studying", "waiting",
            "raining", "snowing", "rising", "staying",
          ].map((verb) => (
            <div key={verb} className="flex items-center rounded-xl bg-black/[0.025] px-3 py-2">
              <span className="font-black text-slate-900 text-sm">{verb}</span>
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
        <p className="text-sm text-slate-600 mb-3">These words often appear with Present Continuous to show the action is happening around now:</p>
        <div className="space-y-2">
          {[
            ["now / right now", true],
            ["at the moment", true],
            ["currently / today / this week", true],
            ["Look! / Listen!", true],
          ].map(([ex, ok]) => (
            <div key={ex as string} className="flex items-start gap-2 rounded-xl px-3 py-2.5 bg-emerald-50 border border-emerald-100">
              <span className="text-sm shrink-0">✅</span>
              <div className="font-semibold text-sm text-emerald-800">{ex as string}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
