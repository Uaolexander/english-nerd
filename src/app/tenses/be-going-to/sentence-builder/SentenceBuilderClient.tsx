"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";

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
      { id: "1-1",  words: ["tomorrow", "She", ".", "going", "is", "to", "leave"],                    correct: "She is going to leave tomorrow .",           explanation: "She → is going to leave. Affirmative: subject + is + going to + base form." },
      { id: "1-2",  words: ["parents", "visit", "am", "I", "to", "my", "going", "."],                 correct: "I am going to visit my parents .",            explanation: "I → am going to visit." },
      { id: "1-3",  words: ["medicine", "He", "to", ".", "is", "study", "going"],                     correct: "He is going to study medicine .",             explanation: "He → is going to study." },
      { id: "1-4",  words: ["Japan", "to", ".", "travel", "going", "They", "to", "are"],              correct: "They are going to travel to Japan .",         explanation: "They → are going to travel." },
      { id: "1-5",  words: ["weekend", "We", "the", "paint", "are", "to", "going", ".", "house"],     correct: "We are going to paint the house .",           explanation: "We → are going to paint." },
      { id: "1-6",  words: ["tonight", "isn't", "She", ".", "come", "going", "to"],                   correct: "She isn't going to come tonight .",           explanation: "She + negative → isn't going to come." },
      { id: "1-7",  words: ["wait", "to", "longer", "aren't", "They", "going", "any", "."],           correct: "They aren't going to wait any longer .",      explanation: "They + negative → aren't going to wait." },
      { id: "1-8",  words: ["time", "isn't", "He", "on", "going", ".", "to", "finish"],               correct: "He isn't going to finish on time .",          explanation: "He + negative → isn't going to finish." },
      { id: "1-9",  words: ["tonight", "aren't", "We", "out", "going", "to", ".", "stay"],            correct: "We aren't going to stay out tonight .",       explanation: "We + negative → aren't going to stay." },
      { id: "1-10", words: ["time", "on", "isn't", "project", "to", "going", "The", ".", "finish"],   correct: "The project isn't going to finish on time .", explanation: "The project (= it) + negative → isn't going to finish." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Questions & Short Answers",
    instructions: "Build the be going to question or short answer using the tiles in the correct order.",
    questions: [
      { id: "2-1",  words: ["?", "Is", "to", "leave", "going", "she"],                                correct: "Is she going to leave ?",                    explanation: "She → Is: Is she going to leave?" },
      { id: "2-2",  words: ["to", "Are", "?", "apply", "going", "you"],                               correct: "Are you going to apply ?",                   explanation: "You → Are: Are you going to apply?" },
      { id: "2-3",  words: ["join", "going", "Are", "to", "us", "?", "they"],                         correct: "Are they going to join us ?",                 explanation: "They → Are: Are they going to join us?" },
      { id: "2-4",  words: ["back", "right", "Is", "now", "?", "he", "going", "call", "to"],          correct: "Is he going to call back right now ?",        explanation: "He → Is: Is he going to call back?" },
      { id: "2-5",  words: ["pass", "Am", "I", "to", "?", "going"],                                   correct: "Am I going to pass ?",                       explanation: "I → Am: Am I going to pass?" },
      { id: "2-6",  words: ["rain", "Is", "it", "?", "going", "to"],                                  correct: "Is it going to rain ?",                      explanation: "It → Is: Is it going to rain?" },
      { id: "2-7",  words: ["Are", "bus", "the", "going", "?", "for", "they", "to", "wait"],          correct: "Are they going to wait for the bus ?",        explanation: "They → Are: Are they going to wait?" },
      { id: "2-8",  words: ["abroad", "Is", "to", "she", "going", "?", "study"],                      correct: "Is she going to study abroad ?",              explanation: "She → Is: Is she going to study abroad?" },
      { id: "2-9",  words: ["you", "?", "Are", "going", "quit", "to"],                                correct: "Are you going to quit ?",                    explanation: "You → Are: Are you going to quit?" },
      { id: "2-10", words: ["Is", "from", "today", "?", "home", "going", "working", "he", "to"],      correct: "Is he going to work from home today ?",       explanation: "He → Is: Is he going to work from home today?" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Mixed: all forms",
    instructions: "Build affirmative, negative, or question sentences using the tiles.",
    questions: [
      { id: "3-1",  words: ["storm", "!", "going", "it", "to", "is", "It"],                            correct: "It is going to storm !",                    explanation: "It → is going to storm. Prediction based on evidence." },
      { id: "3-2",  words: ["not", "I", "up", "give", ".", "am", "going", "to"],                       correct: "I am not going to give up .",                explanation: "I + negative → am not going to give up." },
      { id: "3-3",  words: ["?", "Are", "party", "coming", "to", "the", "going", "they", "to"],        correct: "Are they going to come to the party ?",      explanation: "They → Are: Are they going to come?" },
      { id: "3-4",  words: ["attention", "He", "in", "isn't", "class", "to", "going", ".", "pay"],     correct: "He isn't going to pay attention in class .", explanation: "He + negative → isn't going to pay." },
      { id: "3-5",  words: ["exam", "?", "studying", "Is", "the", "for", "she", "going", "to"],        correct: "Is she going to study for the exam ?",       explanation: "She → Is: Is she going to study for the exam?" },
      { id: "3-6",  words: ["soon", "results", ".", "announce", "going", "They", "to", "are", "the"],  correct: "They are going to announce the results soon .", explanation: "They → are going to announce. Plan." },
      { id: "3-7",  words: ["to", "talking", "me", "She", "isn't", ".", "any", "going", "more", "to"], correct: "She isn't going to talk to me any more .",   explanation: "She + negative → isn't going to talk." },
      { id: "3-8",  words: ["?", "Are", "weekend", "renovate", "going", "you", "to", "this"],          correct: "Are you going to renovate this weekend ?",   explanation: "You → Are: Are you going to renovate?" },
      { id: "3-9",  words: ["doctor", "He", "a", "brilliant", "is", "to", ".", "going", "be"],         correct: "He is going to be a brilliant doctor .",     explanation: "He → is going to be. Future prediction." },
      { id: "3-10", words: ["now", "?", "Is", "right", "raining", "it", "going", "to"],                correct: "Is it going to rain right now ?",            explanation: "It → Is: Is it going to rain right now?" },
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
          <a className="hover:text-slate-900 transition" href="/tenses/be-going-to">Be Going To</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Be Going To{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Builder</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the English tiles in the correct order to build a sentence. Three exercise sets — affirmative &amp; negative, questions, and mixed be going to forms.
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
                            <div className="font-mono font-black text-base">{q.correct.replace(/ \./g, ".").replace(/ \?/g, "?").replace(/ !/g, "!")}</div>
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

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/be-going-to/spot-the-mistake" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Spot the Mistake</a>
          <a href="/tenses/be-going-to" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Be Going To →</a>
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
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">How to Build Sentences</h2>
        <p className="text-slate-500 text-sm">Three patterns — learn the formula, then practise.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "am / is / are", color: "yellow" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I am going to work.  ·  She is going to leave.  ·  They are going to play." />
            <Ex en="I'm going to start.  ·  He's going to call.  ·  We're going to travel." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "am not / isn't / aren't", color: "red" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I'm not going to stay.  ·  She isn't going to come.  ·  They aren't going to wait." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Am / Is / Are", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Am I going to pass?  ·  Is she going to leave?  ·  Are they going to join us?" />
          </div>
        </div>
      </div>

      {/* am / is / are table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Which auxiliary to use</div>
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
                ["I", "am going to work", "'m not going to work", "Am I going to work?"],
                ["He / She / It", "is going to work ★", "isn't going to work", "Is she going to work?"],
                ["You", "are going to work", "aren't going to work", "Are you going to work?"],
                ["We / They", "are going to work", "aren't going to work", "Are they going to work?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 1 ? "bg-amber-50 font-bold" : "bg-white"}>
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
          <span className="font-black">★ Key rule:</span> <b>&quot;going to&quot;</b> never changes — only <b>am / is / are</b> changes!<br />
          <span className="text-xs">He <b>is</b> going to work ✅ &nbsp; He <b>are</b> going to work ❌ &nbsp; He is going to <b>works</b> ❌</span>
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use be going to</div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="text-sm font-black text-emerald-800 mb-2">1. Plans and intentions (already decided)</div>
            <Ex en="I'm going to visit my parents this weekend." />
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
            <div className="text-sm font-black text-sky-800 mb-2">2. Predictions based on visible evidence</div>
            <Ex en="Look at those clouds — it's going to rain!" />
          </div>
        </div>
      </div>

      {/* be going to vs will */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Be going to vs Will</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-violet-700">be going to</th>
                <th className="px-4 py-2.5 font-black text-sky-700">will</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Pre-planned decisions", "Spontaneous decisions"],
                ["Predictions with visible evidence", "General predictions (opinion)"],
                ["I'm going to buy a car. (planned)", "I'll help you carry that. (spontaneous)"],
              ].map(([a, b], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-violet-700 text-sm">{a}</td>
                  <td className="px-4 py-2.5 text-sky-700 text-sm">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["tomorrow", "next week", "next month", "next year", "soon", "tonight", "this weekend", "in the future", "this summer"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
