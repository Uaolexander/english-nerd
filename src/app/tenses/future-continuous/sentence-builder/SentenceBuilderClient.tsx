"use client";

import { useState } from "react";

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
      { id: "1-1",  words: ["watching", "will", "match", "the", "I", "be", "tonight", "."],               correct: "I will be watching the match tonight .",        explanation: "I will be watching — affirmative Future Continuous." },
      { id: "1-2",  words: ["next", "be", "sitting", "week", "beach", "the", "on", "We'll", "."],         correct: "We'll be sitting on the beach next week .",      explanation: "We'll be sitting — contraction: We'll = We will." },
      { id: "1-3",  words: ["cooking", "When", "dinner", "I'll", "you", "arrive", "be", ",", "."],        correct: "When you arrive , I'll be cooking dinner .",     explanation: "I'll be cooking — action in progress when another action happens." },
      { id: "1-4",  words: ["at", "driving", "He'll", "airport", "be", "noon", "the", "to", "."],        correct: "He'll be driving to the airport at noon .",      explanation: "He'll be driving — action in progress at a specific future time." },
      { id: "1-5",  words: ["working", "time", "next", "be", "They'll", "year", "university", "at", "."], correct: "They'll be working at university next year .",   explanation: "They'll be working — planned/expected future event." },
      { id: "1-6",  words: ["won't", "this", "be", "She", "joining", "us", "weekend", "."],               correct: "She won't be joining us this weekend .",         explanation: "She won't be joining — negative Future Continuous." },
      { id: "1-7",  words: ["longer", "working", "be", "won't", "They", "much", "."],                     correct: "They won't be working much longer .",            explanation: "They won't be working — negative reassurance." },
      { id: "1-8",  words: ["midnight", "won't", "I", "sleeping", "be", "at", "."],                      correct: "I won't be sleeping at midnight .",              explanation: "I won't be sleeping — negative Future Continuous." },
      { id: "1-9",  words: ["be", "morning", "all", "won't", "It", "raining", "."],                      correct: "It won't be raining all morning .",              explanation: "It won't be raining — negative about a natural event." },
      { id: "1-10", words: ["tomorrow", "making", "She'll", "be", "breakfast", "."],                     correct: "She'll be making breakfast tomorrow .",          explanation: "She'll be making — make → making (drop -e)." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Questions & Short Answers",
    instructions: "Build the Future Continuous question or short answer using the tiles in the correct order.",
    questions: [
      { id: "2-1",  words: ["late", "be", "you", "Will", "working", "tonight", "?"],                      correct: "Will you be working late tonight ?",            explanation: "Will + subject + be + verb-ing: Will you be working?" },
      { id: "2-2",  words: ["she", "Will", "party", "be", "to", "coming", "the", "?"],                   correct: "Will she be coming to the party ?",             explanation: "Will she be coming? — Future Continuous question." },
      { id: "2-3",  words: ["be", "time", "they", "at", "Will", "travelling", "that", "?"],              correct: "Will they be travelling at that time ?",        explanation: "Will they be travelling? — action in progress at future time." },
      { id: "2-4",  words: ["the", "meeting", "he", "Will", "attending", "be", "?"],                     correct: "Will he be attending the meeting ?",            explanation: "Will he be attending? — Future Continuous question." },
      { id: "2-5",  words: ["tomorrow", "Will", "running", "be", "you", "?"],                            correct: "Will you be running tomorrow ?",                explanation: "Will you be running? — run → running (double consonant)." },
      { id: "2-6",  words: ["\"Will", "tonight?\"", "car", "be", "you", "using", "—", "the", "\"Yes,", "will.", "I", "\""],  correct: "\"Will you be using the car tonight?\" — \"Yes, I will.\"",  explanation: "Short affirmative answer: Yes, I will." },
      { id: "2-7",  words: ["\"Will", "party?\"", "coming", "—", "she", "be", "to", "\"No,", "won't.\"", "she", "the"],     correct: "\"Will she be coming to the party?\" — \"No, she won't.\"", explanation: "Short negative answer: No, she won't." },
      { id: "2-8",  words: ["\"Will", "travelling?\"", "—", "they", "be", "\"Yes,", "will.\"", "they"],                     correct: "\"Will they be travelling?\" — \"Yes, they will.\"",        explanation: "Short affirmative answer: Yes, they will." },
      { id: "2-9",  words: ["\"Will", "tonight?\"", "working", "—", "you", "be", "\"No,", "won't.\"", "I"],                 correct: "\"Will you be working tonight?\" — \"No, I won't.\"",       explanation: "Short negative answer: No, I won't." },
      { id: "2-10", words: ["there", "Will", "be", "driving", "he", "?"],                                correct: "Will he be driving there ?",                    explanation: "Will he be driving? — drive → driving (drop -e)." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Mixed (all forms, time expressions)",
    instructions: "Build affirmative, negative, or question sentences including 'at this time tomorrow', 'when you arrive', and other time expressions.",
    questions: [
      { id: "3-1",  words: ["time", "be", "at", "this", "match", "watching", "I'll", "the", "tomorrow", "."],                 correct: "At this time tomorrow I'll be watching the match .",        explanation: "At this time tomorrow — I'll be watching. Affirmative." },
      { id: "3-2",  words: ["you", "cooking", "I'll", "be", "dinner", "When", "arrive", ".", ","],                            correct: "When you arrive , I'll be cooking dinner .",               explanation: "When you arrive — action in progress at that moment." },
      { id: "3-3",  words: ["using", "be", "tonight", "you", "Will", "the", "car", "?"],                                      correct: "Will you be using the car tonight ?",                      explanation: "Polite Future Continuous question about plans." },
      { id: "3-4",  words: ["time", "won't", "be", "next", "this", "sleeping", "She", "week", "."],                           correct: "She won't be sleeping this time next week .",              explanation: "She won't be sleeping — negative with 'this time next week'." },
      { id: "3-5",  words: ["be", "will", "all", "studying", "They", "day", "tomorrow", "."],                                 correct: "They will be studying all day tomorrow .",                 explanation: "They will be studying — 'all day tomorrow' signals ongoing future action." },
      { id: "3-6",  words: ["you", "call", "When", "running", "still", "be", "I'll", ".", ","],                               correct: "When you call , I'll still be running .",                  explanation: "When you call — I'll still be running. Action in progress at future moment." },
      { id: "3-7",  words: ["midnight", "won't", "working", "be", "The", "team", "by", "."],                                  correct: "The team won't be working by midnight .",                  explanation: "The team won't be working — negative with 'by midnight'." },
      { id: "3-8",  words: ["tomorrow", "at", "be", "she", "sleeping", "8", "Will", "AM", "?"],                               correct: "Will she be sleeping at 8 AM tomorrow ?",                  explanation: "Will she be sleeping? — question about action at specific future time." },
      { id: "3-9",  words: ["next", "be", "sitting", "year", "beach", "This", "time", "we'll", "the", "on", "."],             correct: "This time next year we'll be sitting on the beach .",       explanation: "This time next year — we'll be sitting. Planned future event." },
      { id: "3-10", words: ["noon", "be", "He'll", "at", "driving", "to", "airport", "tomorrow", "the", "."],                 correct: "He'll be driving to the airport at noon tomorrow .",        explanation: "He'll be driving — action in progress at a specific future time." },
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-continuous">Future Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Builder</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the English tiles in the correct order to build a sentence. Three exercise sets — affirmative &amp; negative, questions, and mixed with time expressions.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>

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
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>
        </div>

        {/* Mobile ad */}
        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-continuous/spot-the-mistake" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Spot the Mistake</a>
          <a href="/tenses/future-continuous" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Future Continuous →</a>
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
            { text: "will be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will be working.  ·  She will be sleeping.  ·  They will be travelling." />
            <Ex en="I'll be working.  ·  She'll be sleeping.  ·  They'll be travelling." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't be", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't be working tomorrow.  ·  She won't be joining us." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you be working tonight?  ·  Will she be coming?" />
          </div>
        </div>
      </div>

      {/* will be — same for all subjects */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will be is the same for ALL subjects</div>
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
                ["I", "will be working", "won't be working", "Will I be working?"],
                ["He / She / It", "will be working ★", "won't be working", "Will she be working?"],
                ["You / We / They", "will be working", "won't be working", "Will they be working?"],
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
          <span className="font-black">★ Key rule:</span> &quot;will be&quot; is the same for all subjects — no exceptions!<br />
          <span className="text-xs">✅ She <b>will be</b> working &nbsp;|&nbsp; ❌ She <b>will working</b> (missing &quot;be&quot;)</span>
        </div>
      </div>

      {/* Short answers */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short answers</div>
        <div className="space-y-2">
          {[
            { q: "Will she be joining us?", yes: "Yes, she will.", no: "No, she won't." },
            { q: "Will they be travelling?", yes: "Yes, they will.", no: "No, they won't." },
            { q: "Will you be working late?", yes: "Yes, I will.", no: "No, I won't." },
          ].map(({ q, yes, no }) => (
            <div key={q} className="rounded-xl bg-white border border-black/10 px-4 py-3 grid sm:grid-cols-3 gap-2 text-sm">
              <div className="font-semibold text-slate-700">{q}</div>
              <div className="text-emerald-700 font-semibold">{yes}</div>
              <div className="text-red-700 font-semibold">{no}</div>
            </div>
          ))}
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Future Continuous</div>
        <div className="space-y-2">
          {[
            { use: "Action in progress at a specific future time", ex: "At 8 PM tomorrow, I'll be watching the match." },
            { use: "Action in progress when another action happens", ex: "When you arrive, I'll be cooking dinner." },
            { use: "Polite questions about plans", ex: "Will you be using the car tonight?" },
            { use: "Planned/expected events in the future", ex: "This time next week, we'll be sitting on the beach." },
          ].map(({ use, ex }) => (
            <div key={use} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{use}</div>
              <div className="text-xs text-slate-500 mt-0.5 italic">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* -ing spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ing", ex: "work → working · play → playing · read → reading" },
            { rule: "Ends in -e → drop the -e, add -ing", ex: "make → making · come → coming · write → writing · drive → driving" },
            { rule: "Short verb (CVC) → double the final consonant", ex: "run → running · sit → sitting · swim → swimming · stop → stopping" },
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
          {["at this time tomorrow", "at 8 o'clock tomorrow", "this time next week", "this time next month", "this time next year", "when you arrive", "when you call", "all day tomorrow", "soon", "tonight", "by midnight", "at noon tomorrow"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
