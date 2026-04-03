"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: MCQ[];
};

/* ─── Question data ─────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Affirmative: choose was / were",
    instructions:
      "Past Continuous uses was / were + verb-ing. Use was with I / he / she / it, and were with you / we / they.",
    questions: [
      { id: "1-1", prompt: "She ___ reading a book at 9 PM last night.", options: ["were", "was", "be", "is"], correctIndex: 1, explanation: "She → was: She was reading." },
      { id: "1-2", prompt: "I ___ cooking dinner when you called.", options: ["were", "was", "am", "be"], correctIndex: 1, explanation: "I → was: I was cooking." },
      { id: "1-3", prompt: "They ___ playing football all afternoon.", options: ["was", "be", "were", "is"], correctIndex: 2, explanation: "They → were: They were playing." },
      { id: "1-4", prompt: "He ___ working from home yesterday.", options: ["were", "be", "am", "was"], correctIndex: 3, explanation: "He → was: He was working." },
      { id: "1-5", prompt: "We ___ watching a film at that time.", options: ["was", "be", "were", "is"], correctIndex: 2, explanation: "We → were: We were watching." },
      { id: "1-6", prompt: "The dog ___ sleeping on the sofa all morning.", options: ["were", "be", "is", "was"], correctIndex: 3, explanation: "The dog (= it) → was: The dog was sleeping." },
      { id: "1-7", prompt: "You ___ doing a great job during the test.", options: ["was", "be", "were", "is"], correctIndex: 2, explanation: "You → were: You were doing." },
      { id: "1-8", prompt: "My parents ___ visiting my aunt this time last week.", options: ["was", "be", "were", "is"], correctIndex: 2, explanation: "My parents (= they) → were: They were visiting." },
      { id: "1-9", prompt: "It ___ raining all night long.", options: ["were", "be", "is", "was"], correctIndex: 3, explanation: "It → was: It was raining." },
      { id: "1-10", prompt: "The children ___ making a lot of noise when I arrived.", options: ["was", "be", "were", "is"], correctIndex: 2, explanation: "The children (= they) → were: They were making." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: choose wasn't / weren't",
    instructions:
      "Negative Past Continuous: I / he / she / it + wasn't + verb-ing. You / we / they + weren't + verb-ing. Never use 'didn't' with continuous forms.",
    questions: [
      { id: "2-1", prompt: "She ___ working yesterday — she was ill.", options: ["didn't", "weren't", "wasn't", "not"], correctIndex: 2, explanation: "She → wasn't: She wasn't working." },
      { id: "2-2", prompt: "I ___ listening to you at that moment.", options: ["weren't", "didn't", "wasn't", "not"], correctIndex: 2, explanation: "I → wasn't: I wasn't listening." },
      { id: "2-3", prompt: "They ___ coming to the party after all.", options: ["wasn't", "didn't", "weren't", "not"], correctIndex: 2, explanation: "They → weren't: They weren't coming." },
      { id: "2-4", prompt: "He ___ paying attention during the lesson.", options: ["weren't", "wasn't", "didn't", "not"], correctIndex: 1, explanation: "He → wasn't: He wasn't paying attention." },
      { id: "2-5", prompt: "We ___ going out that evening.", options: ["wasn't", "didn't", "weren't", "not"], correctIndex: 2, explanation: "We → weren't: We weren't going." },
      { id: "2-6", prompt: "It ___ snowing when we left the house.", options: ["didn't", "weren't", "wasn't", "not"], correctIndex: 2, explanation: "It → wasn't: It wasn't snowing." },
      { id: "2-7", prompt: "You ___ wearing a coat — weren't you cold?", options: ["wasn't", "didn't", "weren't", "not"], correctIndex: 2, explanation: "You → weren't: You weren't wearing." },
      { id: "2-8", prompt: "My phone ___ charging when I needed it.", options: ["didn't", "weren't", "wasn't", "not"], correctIndex: 2, explanation: "My phone (= it) → wasn't: My phone wasn't charging." },
      { id: "2-9", prompt: "She ___ talking to me any more that day.", options: ["didn't", "wasn't", "weren't", "not"], correctIndex: 1, explanation: "She → wasn't: She wasn't talking." },
      { id: "2-10", prompt: "The kids ___ doing their homework when I came home.", options: ["wasn't", "didn't", "weren't", "not"], correctIndex: 2, explanation: "The kids (= they) → weren't: They weren't doing." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: Was / Were + short answers",
    instructions:
      "Questions invert the subject and the auxiliary: Was I…? Was he/she/it…? Were you/we/they…? Short answers use was / were / wasn't / weren't.",
    questions: [
      { id: "3-1", prompt: "___ she sleeping when you arrived?", options: ["Am", "Were", "Was", "Did"], correctIndex: 2, explanation: "She → Was: Was she sleeping?" },
      { id: "3-2", prompt: "___ you listening to me at that point?", options: ["Was", "Am", "Did", "Were"], correctIndex: 3, explanation: "You → Were: Were you listening?" },
      { id: "3-3", prompt: "___ they coming to the meeting yesterday?", options: ["Was", "Am", "Were", "Did"], correctIndex: 2, explanation: "They → Were: Were they coming?" },
      { id: "3-4", prompt: '"Was it raining?" — "Yes, ___.', options: ["it rained", "it did", "it was", "it were"], correctIndex: 2, explanation: "Short answer with was: Yes, it was." },
      { id: "3-5", prompt: '"Were you working?" — "No, ___.', options: ["I wasn't", "I didn't", "I weren't", "I wasn't be"], correctIndex: 0, explanation: "Short negative answer: No, I wasn't." },
      { id: "3-6", prompt: '"Was she coming?" — "Yes, ___.', options: ["she did", "she was", "she were", "she is"], correctIndex: 1, explanation: "Short answer with was: Yes, she was." },
      { id: "3-7", prompt: "___ he watching TV at 8 PM last night?", options: ["Were", "Am", "Was", "Did"], correctIndex: 2, explanation: "He → Was: Was he watching?" },
      { id: "3-8", prompt: '"Were they leaving?" — "No, ___.', options: ["they didn't", "they wasn't", "they weren't", "they not"], correctIndex: 2, explanation: "Short negative answer: No, they weren't." },
      { id: "3-9", prompt: "___ I talking too fast during the presentation?", options: ["Was", "Were", "Am", "Did"], correctIndex: 0, explanation: "I → Was: Was I talking…?" },
      { id: "3-10", prompt: '"Was he working from home?" — "No, ___.', options: ["he didn't", "he not", "he wasn't", "he weren't"], correctIndex: 2, explanation: "Short negative answer: No, he wasn't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: was/were, when/while, interrupted actions",
    instructions:
      "This exercise mixes affirmative, negative, and question forms, including sentences with when and while. Choose the correct option.",
    questions: [
      { id: "4-1", prompt: "I ___ cooking when the phone rang.", options: ["were", "am", "was", "be"], correctIndex: 2, explanation: "I → was: I was cooking (in progress) when the phone rang (interruption)." },
      { id: "4-2", prompt: "While she ___ reading, he was cooking dinner.", options: ["is", "am", "were", "was"], correctIndex: 3, explanation: "She → was: While she was reading (parallel action)." },
      { id: "4-3", prompt: "They ___ waiting for the bus when it started to rain.", options: ["was", "am", "were", "be"], correctIndex: 2, explanation: "They → were: They were waiting (in progress) when it started (interruption)." },
      { id: "4-4", prompt: "___ you sleeping when I called you last night?", options: ["Was", "Am", "Did", "Were"], correctIndex: 3, explanation: "You → Were: Were you sleeping?" },
      { id: "4-5", prompt: "She ___ talking on the phone at midnight.", options: ["were", "am", "wasn't", "was"], correctIndex: 3, explanation: "She → was: She was talking (at a specific past moment)." },
      { id: "4-6", prompt: "He ___ watching TV — he was studying all evening.", options: ["weren't", "am not", "wasn't", "not"], correctIndex: 2, explanation: "He → wasn't: He wasn't watching TV." },
      { id: "4-7", prompt: "While the children ___ playing, the parents were cooking.", options: ["am", "was", "is", "were"], correctIndex: 1, explanation: "The children → were: While they were playing (parallel actions with while)." },
      { id: "4-8", prompt: "It ___ snowing when we woke up.", options: ["is", "am", "were", "was"], correctIndex: 3, explanation: "It → was: It was snowing (in progress when we woke up)." },
      { id: "4-9", prompt: '"Were you coming to the party?" — "No, ___.', options: ["I didn't", "I wasn't", "I weren't", "I aren't"], correctIndex: 1, explanation: "Short negative: No, I wasn't." },
      { id: "4-10", prompt: "We ___ having lunch when the fire alarm went off.", options: ["is", "am", "were", "was"], correctIndex: 2, explanation: "We → were: We were having lunch (in progress when alarm went off)." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative",
  3: "Questions",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function PastContinuousQuizClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

  const { save } = useProgress();

  useEffect(() => {
    if (checked && score) {
      save(exNo, score.percent, score.total);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    for (const q of current.questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, answers]);

  function reset() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setAnswers({});
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setAnswers({});
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-continuous">Past Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Past Continuous</b> with 40 multiple choice questions across four sets: affirmative, negative, questions, and a mixed review with when/while. Pick the correct form and check your answers.
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
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const chosen = answers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi}
                                      onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))}
                                      className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {!checked ? (
                        <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                          Check Answers
                        </button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">
                          Next Exercise →
                        </button>
                      )}
                    </div>
                    {score && (
                      <div className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div>
                            <div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div>
                          </div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}
                        </div>
                      </div>
                    )}
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
          <a href="/tenses/past-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Past Continuous exercises</a>
          <a href="/tenses/past-continuous/fill-in-blank" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Fill in the Blank →</a>
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
            { text: "was / were", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I was sleeping.  ·  She was reading.  ·  They were playing." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "wasn't / weren't", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I wasn't sleeping.  ·  She wasn't reading.  ·  They weren't playing." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Was / Were", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Was I sleeping?  ·  Was she reading?  ·  Were they playing?" />
          </div>
        </div>
      </div>

      {/* was / were table */}
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
                ["I", "was working", "wasn't working", "Was I working?"],
                ["He / She / It ★", "was working", "wasn't working", "Was he working?"],
                ["You / We / They", "were working", "weren't working", "Were you working?"],
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
          <span className="font-black">★ Key rule:</span> I and He/She/It both use <b>was</b>. Only You/We/They use <b>were</b>.<br />
          <span className="text-xs">She <b>was</b> working ✅ &nbsp; She were working ❌ &nbsp;&nbsp; I <b>was</b> sleeping ✅ &nbsp; I were sleeping ❌</span>
        </div>
      </div>

      {/* Short answers */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short answers</div>
        <div className="space-y-2">
          {[
            { q: "Was she reading?", yes: "Yes, she was.", no: "No, she wasn't." },
            { q: "Were they coming?", yes: "Yes, they were.", no: "No, they weren't." },
            { q: "Were you working?", yes: "Yes, I was.", no: "No, I wasn't." },
          ].map(({ q, yes, no }) => (
            <div key={q} className="rounded-xl bg-white border border-black/10 px-4 py-3 grid sm:grid-cols-3 gap-2 text-sm">
              <div className="font-semibold text-slate-700">{q}</div>
              <div className="text-emerald-700 font-semibold">{yes}</div>
              <div className="text-red-700 font-semibold">{no}</div>
            </div>
          ))}
        </div>
      </div>

      {/* when / while usage */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When & While: key patterns</div>
        <div className="space-y-3">
          <div className="rounded-xl bg-white border border-black/10 px-4 py-3">
            <div className="text-sm font-black text-slate-800 mb-1">Interrupted action — Past Continuous + when + Past Simple</div>
            <div className="space-y-1">
              <div className="text-xs text-red-500 font-mono">✗ I cooked when the phone rang.</div>
              <div className="text-xs text-emerald-600 font-mono">✓ I was cooking when the phone rang.</div>
            </div>
          </div>
          <div className="rounded-xl bg-white border border-black/10 px-4 py-3">
            <div className="text-sm font-black text-slate-800 mb-1">Parallel actions — while + Past Continuous … Past Continuous</div>
            <div className="text-xs text-emerald-600 font-mono">✓ While she was reading, he was cooking.</div>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["at 8 o'clock", "at that time", "this time yesterday", "when", "while", "all morning", "all evening", "all night", "all day long"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
