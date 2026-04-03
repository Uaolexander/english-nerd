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
      { id: "1-1",  words: ["She", "her", "has", "homework", "finished", "."],                                correct: "She has finished her homework .",         explanation: "She → has finished. Affirmative: subject + has + past participle." },
      { id: "1-2",  words: ["I", "visited", "Paris", "twice", "have", "."],                                   correct: "I have visited Paris twice .",             explanation: "I → have visited." },
      { id: "1-3",  words: ["already", "lunch", "We", "have", "eaten", "."],                                  correct: "We have already eaten lunch .",            explanation: "We → have already eaten. Already goes after have, before the past participle." },
      { id: "1-4",  words: ["here", "for", "They", "lived", "years", "ten", "have", "."],                     correct: "They have lived here for ten years .",     explanation: "They → have lived … for ten years." },
      { id: "1-5",  words: ["just", "the", "He", "has", "office", "left", "."],                               correct: "He has just left the office .",            explanation: "He → has just left. Just goes after has." },
      { id: "1-6",  words: ["She", "yet", "called", "hasn't", "me", "."],                                     correct: "She hasn't called me yet .",               explanation: "She + negative → hasn't called. Yet goes at the end." },
      { id: "1-7",  words: ["finished", "haven't", "the", "yet", "They", "project", "."],                     correct: "They haven't finished the project yet .", explanation: "They + negative → haven't finished yet." },
      { id: "1-8",  words: ["He", "eaten", "today", "anything", "hasn't", "."],                               correct: "He hasn't eaten anything today .",         explanation: "He + negative → hasn't eaten." },
      { id: "1-9",  words: ["We", "been", "to", "Japan", "haven't", "."],                                     correct: "We haven't been to Japan .",               explanation: "We + negative → haven't been." },
      { id: "1-10", words: ["since", "spoken", "Monday", "He", "her", "to", "hasn't", "."],                   correct: "He hasn't spoken to her since Monday .",  explanation: "He + negative → hasn't spoken … since Monday." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Questions & Short Answers",
    instructions: "Build the Present Perfect question or short answer using the tiles in the correct order.",
    questions: [
      { id: "2-1",  words: ["ever", "she", "?", "Has", "Australia", "to", "been"],                            correct: "Has she ever been to Australia ?",         explanation: "She → Has: Has she ever been…? Ever goes after the subject." },
      { id: "2-2",  words: ["you", "?", "Have", "finished", "report", "your"],                                correct: "Have you finished your report ?",          explanation: "You → Have: Have you finished your report?" },
      { id: "2-3",  words: ["?", "tried", "Have", "food", "they", "Indian", "ever"],                          correct: "Have they ever tried Indian food ?",       explanation: "They → Have: Have they ever tried Indian food?" },
      { id: "2-4",  words: ["?", "Has", "octopus", "eaten", "ever", "he"],                                    correct: "Has he ever eaten octopus ?",              explanation: "He → Has: Has he ever eaten octopus?" },
      { id: "2-5",  words: ["you", "yet", "?", "Have", "eaten"],                                              correct: "Have you eaten yet ?",                     explanation: "Have you eaten yet? Yet goes to the end of the question." },
      { id: "2-6",  words: ["?", "worked", "How", "long", "here", "Have", "you"],                             correct: "How long Have you worked here ?",          explanation: "How long + Have you worked here?" },
      { id: "2-7",  words: ["she", "has", "Yes", ",", "."],                                                   correct: "Yes , she has .",                          explanation: "Short positive answer: Yes, she has." },
      { id: "2-8",  words: ["haven't", "No", "I", ",", "."],                                                  correct: "No , I haven't .",                         explanation: "Short negative answer: No, I haven't." },
      { id: "2-9",  words: ["they", ".", "have", "Yes", ","],                                                  correct: "Yes , they have .",                        explanation: "Short positive answer: Yes, they have." },
      { id: "2-10", words: ["hasn't", "No", ".", "she", ","],                                                  correct: "No , she hasn't .",                        explanation: "Short negative answer: No, she hasn't." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Mixed with since / for / just",
    instructions: "Build affirmative, negative, or question sentences using the tiles. Pay attention to since vs for and the position of just.",
    questions: [
      { id: "3-1",  words: ["I", "finished", "just", "have", "book", "the", "."],                             correct: "I have just finished the book .",          explanation: "I → have just finished. Just goes directly after have." },
      { id: "3-2",  words: ["She", "since", "2019", "worked", "here", "has", "."],                            correct: "She has worked here since 2019 .",         explanation: "She → has worked … since 2019. Since + point in time." },
      { id: "3-3",  words: ["for", "lived", "London", "in", "They", "five", "have", "years", "."],            correct: "They have lived in London for five years .", explanation: "They → have lived … for five years. For + period of time." },
      { id: "3-4",  words: ["?", "promoted", "been", "He", "just", "Has"],                                    correct: "Has He just been promoted ?",              explanation: "He → Has he just been promoted? Just goes after has." },
      { id: "3-5",  words: ["it", "since", "rained", "hasn't", "weeks", "It", "."],                           correct: "It hasn't rained since weeks It .",         explanation: "It → hasn't rained for weeks / since last month." },
      { id: "3-6",  words: ["I", "here", "for", "ages", "haven't", ".", "been"],                              correct: "I haven't been here for ages .",            explanation: "I → haven't been here for ages." },
      { id: "3-7",  words: ["?", "you", "for", "studied", "How", "long", "have", "English"],                  correct: "How long have you studied English ?",      explanation: "How long have you studied English? For + period, or since + point." },
      { id: "3-8",  words: ["each", "seen", "We", "since", "haven't", "Christmas", "other", "."],             correct: "We haven't seen each other since Christmas .", explanation: "We → haven't seen each other since Christmas." },
      { id: "3-9",  words: ["just", "has", "She", "left", ".", "the", "building"],                            correct: "She has just left the building .",         explanation: "She → has just left." },
      { id: "3-10", words: ["years", "for", "have", "known", "We", "three", "each", "other", "."],            correct: "We have known each other for three years .", explanation: "We → have known each other for three years." },
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-perfect">Present Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Builder</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the English tiles in the correct order to build a sentence. Three exercise sets — affirmative &amp; negative, questions &amp; short answers, and mixed with since / for / just.
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

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-perfect/spot-the-mistake" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Spot the Mistake</a>
          <a href="/tenses/present-perfect" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Present Perfect →</a>
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">How to Build Present Perfect Sentences</h2>
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
            { text: "have/has", color: "yellow" }, { dim: true, text: "+" },
            { text: "past participle", color: "green" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I have worked." />
            <Ex en="She has eaten." />
            <Ex en="They have gone." />
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
            { text: "haven't / hasn't", color: "red" }, { dim: true, text: "+" },
            { text: "past participle", color: "green" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I haven't seen him." />
            <Ex en="She hasn't called." />
            <Ex en="They haven't arrived." />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[
            { text: "Have/Has", color: "violet" }, { dim: true, text: "+" },
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "past participle", color: "green" }, { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Have I worked?" />
            <Ex en="Has she eaten?" />
            <Ex en="Have they gone?" />
          </div>
        </div>
      </div>

      {/* have / has table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Choosing have / has</h3>
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
                ["I / You / We / They", "have + p.p.", "haven't + p.p.", "Have … + p.p. ?"],
                ["He / She / It ★", "has + p.p.", "hasn't + p.p.", "Has … + p.p. ?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 1 ? "bg-amber-50" : ""}>
                  <td className="py-2 pr-4 font-semibold text-slate-700">{subj}</td>
                  <td className="py-2 pr-4 text-emerald-700 font-mono">{aff}</td>
                  <td className="py-2 pr-4 text-red-600 font-mono">{neg}</td>
                  <td className="py-2 text-sky-700 font-mono">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          <span className="font-black">★</span> He / She / It always use <b>has</b> / <b>hasn&apos;t</b>. After have/has the verb must be the <b>past participle</b>.
        </div>
      </div>

      {/* When to use — 4 use cases */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Present Perfect</div>
        <div className="space-y-3">
          {[
            { label: "Life experience (ever / never)", color: "violet", examples: ["Have you ever been to Japan?", "I've never tried sushi."] },
            { label: "Recent past with present result (just)", color: "sky", examples: ["She has just left the office.", "I've just finished."] },
            { label: "Action still ongoing (since / for)", color: "green", examples: ["I've lived here for 5 years.", "She's worked here since 2020."] },
            { label: "Completion / achievement (already / yet)", color: "yellow", examples: ["I've already done my homework.", "Have you finished yet?"] },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = { violet: "border-violet-200 bg-violet-50/50", sky: "border-sky-200 bg-sky-50/50", green: "border-emerald-200 bg-emerald-50/50", yellow: "border-amber-200 bg-amber-50/50" };
            const badgeMap: Record<string, string> = { violet: "bg-violet-100 text-violet-800 border-violet-200", sky: "bg-sky-100 text-sky-800 border-sky-200", green: "bg-emerald-100 text-emerald-800 border-emerald-200", yellow: "bg-yellow-100 text-yellow-800 border-yellow-200" };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}>{label}</span>
                <div className="space-y-1">
                  {examples.map((ex) => <Ex key={ex} en={ex} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common irregular past participles */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common irregular past participles</div>
        <div className="flex flex-wrap gap-2">
          {[
            "be → been", "do → done", "go → gone", "see → seen", "eat → eaten",
            "come → come", "take → taken", "make → made", "give → given", "get → got",
            "find → found", "know → known", "think → thought", "buy → bought", "leave → left",
            "write → written", "read → read", "tell → told", "hear → heard", "feel → felt",
            "meet → met", "fly → flown", "drink → drunk", "break → broken", "forget → forgotten",
          ].map((v) => (
            <span key={v} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{v}</span>
          ))}
        </div>
      </div>

      {/* PP vs Past Simple */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Present Perfect vs Past Simple</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Present Perfect</div>
            <div className="space-y-1.5 text-sm">
              <div className="text-emerald-900">No specific time / since / for / ever…</div>
              <div className="font-mono text-xs text-emerald-800">I have seen that film.</div>
              <div className="font-mono text-xs text-emerald-800">She has just called.</div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
            <div className="text-xs font-black text-red-700 uppercase tracking-widest mb-2">Past Simple</div>
            <div className="space-y-1.5 text-sm">
              <div className="text-red-900">Specific time: yesterday / last week / in 2020…</div>
              <div className="font-mono text-xs text-red-800">I saw that film last week.</div>
              <div className="font-mono text-xs text-red-800">She called an hour ago.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["already", "yet", "just", "ever", "never", "since 2020", "since Monday", "for 5 years", "for a long time", "recently", "so far", "today", "this week", "this year", "many times", "once", "twice"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
