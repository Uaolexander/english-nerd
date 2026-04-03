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
    title: "Exercise 1 — Affirmative: have/has been + verb-ing",
    instructions: "Tap the tiles in the correct order to build an affirmative Present Perfect Continuous sentence.",
    questions: [
      { id: "1-1",  words: ["for", "She", "here", ".", "has", "been", "five", "years", "working"],           correct: "She has been working here for five years .",          explanation: "She → has been working. Duration: for five years." },
      { id: "1-2",  words: ["since", "noon", "waiting", "been", "I", "have", ".", "you", "for"],             correct: "I have been waiting for you since noon .",            explanation: "I → have been waiting. Time anchor: since noon." },
      { id: "1-3",  words: ["in", "2018", "London", "since", "have", "been", "They", ".", "living"],         correct: "They have been living in London since 2018 .",         explanation: "They → have been living. Time anchor: since 2018." },
      { id: "1-4",  words: ["He", "all", "studying", "morning", "has", ".", "been"],                         correct: "He has been studying all morning .",                  explanation: "He → has been studying. Duration: all morning." },
      { id: "1-5",  words: ["for", "you", "hours", "trying", "to", "been", "We", "reach", "have", "."],      correct: "We have been trying to reach you for hours .",        explanation: "We → have been trying. Duration: for hours." },
      { id: "1-6",  words: ["all", "garden", "been", "the", "playing", "in", "The", "have", "afternoon", "children", "."], correct: "The children have been playing in the garden all afternoon .", explanation: "The children (= they) → have been playing." },
      { id: "1-7",  words: ["morning", "It", "has", "raining", "been", "early", "since", "."],               correct: "It has been raining since early morning .",           explanation: "It → has been raining. Time anchor: since early morning." },
      { id: "1-8",  words: ["lately", "job", "a", "great", "been", "You", "doing", "have", "."],             correct: "You have been doing a great job lately .",            explanation: "You → have been doing. Time expression: lately." },
      { id: "1-9",  words: ["every", "morning", "running", "She", "this", "week", "has", "been", "."],       correct: "She has been running every morning this week .",      explanation: "She → has been running. run → running (double consonant)." },
      { id: "1-10", words: ["for", "Spanish", "years", "two", "learning", "been", "She", "has", "."],        correct: "She has been learning Spanish for two years .",       explanation: "She → has been learning. Duration: for two years." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative & Questions",
    instructions: "Tap the tiles to build negative sentences or questions. Some sentences use How long.",
    questions: [
      { id: "2-1",  words: ["lately", "well", "feeling", "hasn't", "She", "been", "."],                      correct: "She hasn't been feeling well lately .",               explanation: "She + negative → hasn't been feeling." },
      { id: "2-2",  words: ["much", "this", "week", "I", "sleeping", "haven't", "been", "."],                correct: "I haven't been sleeping much this week .",            explanation: "I + negative → haven't been sleeping." },
      { id: "2-3",  words: ["recently", "the", "haven't", "on", "project", "working", "been", "They", "."],  correct: "They haven't been working on the project recently .", explanation: "They + negative → haven't been working." },
      { id: "2-4",  words: ["long", "?", "she", "Has", "been", "waiting"],                                   correct: "Has she been waiting long ?",                        explanation: "She → Has: Has she been waiting long?" },
      { id: "2-5",  words: ["English", "?", "you", "learning", "Have", "been", "long", "for"],               correct: "Have you been learning English for long ?",           explanation: "You → Have: Have you been learning English for long?" },
      { id: "2-6",  words: ["?", "How", "she", "medicine", "has", "studying", "been", "long"],               correct: "How long has she been studying medicine ?",           explanation: "She → has: How long has she been studying medicine?" },
      { id: "2-7",  words: ["?", "How", "you", "this", "living", "long", "have", "been", "city", "in"],      correct: "How long have you been living in this city ?",        explanation: "You → have: How long have you been living in this city?" },
      { id: "2-8",  words: ["hasn't", "enough", "hard", "studying", "been", "The", "student", "."],          correct: "The student hasn't been studying hard enough .",      explanation: "The student (= he/she) → hasn't been studying." },
      { id: "2-9",  words: ["?", "he", "feeling", "tired", "lately", "Has", "been"],                         correct: "Has he been feeling tired lately ?",                  explanation: "He → Has: Has he been feeling tired lately?" },
      { id: "2-10", words: ["haven't", "we", "gym", "lately", "been", "going", "to", "the", "."],            correct: "We haven't been going to the gym lately .",           explanation: "We + negative → haven't been going." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Mixed including stative verbs",
    instructions: "Build sentences using the tiles. Some use Present Perfect Continuous; stative verb sentences use PP Simple.",
    questions: [
      { id: "3-1",  words: ["She", "an", "for", "has", "running", "been", "hour", "."],                      correct: "She has been running for an hour .",                  explanation: "She → has been running. Ongoing action with duration." },
      { id: "3-2",  words: ["her", "ten", "years", "I", "known", "for", "have", "."],                        correct: "I have known her for ten years .",                    explanation: "know is stative → PP Simple: have known (NOT have been knowing)." },
      { id: "3-3",  words: ["?", "all", "Has", "working", "he", "been", "day"],                              correct: "Has he been working all day ?",                       explanation: "He → Has: Has he been working all day?" },
      { id: "3-4",  words: ["this", "three", "books", "I", "have", "read", "month", "."],                    correct: "I have read three books this month .",                explanation: "Completed quantity → PP Simple: have read." },
      { id: "3-5",  words: ["She", "business", "for", "has", "owned", "this", "decade", "a", "."],           correct: "She has owned this business for a decade .",          explanation: "own is stative → PP Simple: has owned." },
      { id: "3-6",  words: ["lately", "to", "lot", "gym", "been", "going", "a", "I've", "the", "."],         correct: "I've been going to the gym a lot lately .",           explanation: "I → I've been going. Repeated action over a period." },
      { id: "3-7",  words: ["you", "No", ",", ".", "haven't", "I"],                                          correct: "No , I haven't .",                                   explanation: "Short negative answer: No, I haven't." },
      { id: "3-8",  words: ["?", "Has", "she", "crying", "been"],                                            correct: "Has she been crying ?",                              explanation: "She → Has: Has she been crying? Visible result." },
      { id: "3-9",  words: ["since", "years", "English", "been", "learning", "I", "have", "five", "for", "."], correct: "I have been learning English for five years .",    explanation: "I → have been learning. Duration: for five years." },
      { id: "3-10", words: ["Yes", "has", ".", "she", ","],                                                   correct: "Yes , she has .",                                    explanation: "Short positive answer: Yes, she has." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3, string> = {
  1: "Affirmative",
  2: "Neg + Questions",
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-perfect-continuous">Present Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Builder</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the English tiles in the correct order to build a sentence. Three exercise sets — affirmative (have/has been + verb-ing), negatives &amp; questions, and mixed including stative verbs.
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

          {/* Right ad */}
          <AdUnit variant="sidebar-dark" />
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-perfect-continuous/spot-the-mistake" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Spot the Mistake</a>
          <a href="/tenses/present-perfect-continuous" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Present Perfect Continuous →</a>
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
            { text: "have / has", color: "yellow" },
            { text: "been", color: "violet" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I have been working.  ·  She has been studying.  ·  They have been waiting." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "haven't / hasn't", color: "red" },
            { text: "been", color: "violet" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I haven't been sleeping well.  ·  She hasn't been feeling well." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Have / Has", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "been", color: "violet" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Have you been waiting long?  ·  Has she been crying?  ·  How long have you been learning English?" />
          </div>
        </div>
      </div>

      {/* have / has table */}
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
                ["I / You / We / They", "have been working", "haven't been working", "Have you been working?"],
                ["He / She / It ★", "has been working", "hasn't been working", "Has she been working?"],
              ].map(([subj, aff, neg, que], i) => (
                <tr key={i} className={i === 1 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{que}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> He / She / It → <b>has been</b>, not have been.<br />
          <span className="text-xs">She <b>has been</b> working ✅ &nbsp; She have been working ❌</span>
        </div>
      </div>

      {/* Stative verbs */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Stative verbs — no continuous form! Use PP Simple.</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {["know", "believe", "understand", "like", "love", "hate", "want", "need", "seem", "own", "belong", "have (possession)"].map((v) => (
            <span key={v} className="rounded-lg bg-white border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">{v}</span>
          ))}
        </div>
        <div className="mt-2 text-xs text-amber-700">✅ I have known her for 10 years. &nbsp;|&nbsp; ❌ I have been knowing her for 10 years.</div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use the Present Perfect Continuous</div>
        <div className="space-y-2">
          {[
            { label: "Action ongoing since the past (for / since)", ex: "I have been living here for 5 years. / She has been working there since 2020." },
            { label: "Recently finished action with visible result", ex: "He's been running — he's sweaty. / I've been crying — my eyes are red." },
            { label: "Repeated action over a period", ex: "I've been going to the gym a lot lately." },
            { label: "Emphasise duration (How long?)", ex: "How long have you been studying English?" },
          ].map(({ label, ex }) => (
            <div key={label} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{label}</div>
              <div className="text-xs text-slate-500 mt-0.5 italic">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PPC vs PP Simple */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">PPC vs PP Simple — side by side</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-4">
            <div className="text-xs font-black text-sky-700 uppercase tracking-wider mb-2">PP Continuous — duration / activity</div>
            <Ex en="I've been reading this book for an hour." />
            <div className="mt-1.5 text-xs text-slate-500">→ Emphasises the ongoing activity</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-4">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-2">PP Simple — completion / result</div>
            <Ex en="I've read 3 books this month." />
            <div className="mt-1.5 text-xs text-slate-500">→ Emphasises the completed number/result</div>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">📌 Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["for (5 years)", "since (2020)", "all day", "all morning", "all week", "lately", "recently", "how long?", "the whole time"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
