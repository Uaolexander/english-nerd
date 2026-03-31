"use client";

import { useMemo, useState } from "react";

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
    title: "Exercise 1 — Affirmative: have been / has been",
    instructions:
      "Choose the correct auxiliary for the Present Perfect Continuous affirmative. Use have been with I / you / we / they and has been with he / she / it.",
    questions: [
      { id: "1-1", prompt: "She ___ working here for five years.", options: ["have been", "has been", "is been", "was been"], correctIndex: 1, explanation: "She → has been: She has been working here for five years." },
      { id: "1-2", prompt: "I ___ waiting for you since noon.", options: ["has been", "have been", "am been", "were been"], correctIndex: 1, explanation: "I → have been: I have been waiting since noon." },
      { id: "1-3", prompt: "They ___ living in London since 2018.", options: ["has been", "is been", "have been", "was been"], correctIndex: 2, explanation: "They → have been: They have been living in London since 2018." },
      { id: "1-4", prompt: "He ___ studying all morning.", options: ["have been", "has been", "had been", "is been"], correctIndex: 1, explanation: "He → has been: He has been studying all morning." },
      { id: "1-5", prompt: "We ___ trying to reach you for hours.", options: ["has been", "have been", "are been", "was been"], correctIndex: 1, explanation: "We → have been: We have been trying to reach you." },
      { id: "1-6", prompt: "The children ___ playing in the garden all afternoon.", options: ["has been", "is been", "have been", "was been"], correctIndex: 2, explanation: "The children (= they) → have been: They have been playing." },
      { id: "1-7", prompt: "It ___ raining since early morning.", options: ["have been", "has been", "is been", "were been"], correctIndex: 1, explanation: "It → has been: It has been raining since early morning." },
      { id: "1-8", prompt: "You ___ doing a great job lately.", options: ["has been", "have been", "is been", "was been"], correctIndex: 1, explanation: "You → have been: You have been doing a great job." },
      { id: "1-9", prompt: "My parents ___ travelling around Europe for three weeks.", options: ["has been", "is been", "have been", "was been"], correctIndex: 2, explanation: "My parents (= they) → have been: They have been travelling." },
      { id: "1-10", prompt: "She ___ learning Spanish for two years.", options: ["have been", "has been", "is been", "were been"], correctIndex: 1, explanation: "She → has been: She has been learning Spanish for two years." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: haven't been / hasn't been",
    instructions:
      "Choose the correct negative auxiliary. Use haven't been with I / you / we / they and hasn't been with he / she / it.",
    questions: [
      { id: "2-1", prompt: "She ___ feeling well lately.", options: ["haven't been", "hasn't been", "isn't been", "didn't been"], correctIndex: 1, explanation: "She → hasn't been: She hasn't been feeling well." },
      { id: "2-2", prompt: "I ___ sleeping much this week.", options: ["hasn't been", "haven't been", "isn't been", "didn't been"], correctIndex: 1, explanation: "I → haven't been: I haven't been sleeping much." },
      { id: "2-3", prompt: "They ___ working on the project recently.", options: ["hasn't been", "haven't been", "isn't been", "weren't been"], correctIndex: 1, explanation: "They → haven't been: They haven't been working on it." },
      { id: "2-4", prompt: "He ___ eating properly since the illness.", options: ["haven't been", "hasn't been", "isn't been", "didn't been"], correctIndex: 1, explanation: "He → hasn't been: He hasn't been eating properly." },
      { id: "2-5", prompt: "We ___ going to the gym lately.", options: ["hasn't been", "haven't been", "aren't been", "wasn't been"], correctIndex: 1, explanation: "We → haven't been: We haven't been going to the gym." },
      { id: "2-6", prompt: "The team ___ performing well this season.", options: ["have been", "haven't been", "hasn't been", "isn't been"], correctIndex: 2, explanation: "The team (= it/they, singular) → hasn't been: The team hasn't been performing well." },
      { id: "2-7", prompt: "It ___ snowing much this winter.", options: ["haven't been", "has been", "hasn't been", "wasn't been"], correctIndex: 2, explanation: "It → hasn't been: It hasn't been snowing much this winter." },
      { id: "2-8", prompt: "You ___ paying attention during the lecture.", options: ["hasn't been", "haven't been", "isn't been", "didn't been"], correctIndex: 1, explanation: "You → haven't been: You haven't been paying attention." },
      { id: "2-9", prompt: "My sister ___ replying to my messages.", options: ["have been", "haven't been", "hasn't been", "isn't been"], correctIndex: 2, explanation: "My sister (= she) → hasn't been: She hasn't been replying." },
      { id: "2-10", prompt: "The students ___ studying hard enough.", options: ["hasn't been", "have been", "haven't been", "isn't been"], correctIndex: 2, explanation: "The students (= they) → haven't been: They haven't been studying." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions, short answers & How long",
    instructions:
      "Choose the correct question form or short answer. Questions invert Have/Has and the subject. Short answers repeat only have/has.",
    questions: [
      { id: "3-1", prompt: "___ she been waiting long?", options: ["Have", "Did", "Was", "Has"], correctIndex: 3, explanation: "She → Has: Has she been waiting long?" },
      { id: "3-2", prompt: "___ you been learning English for a long time?", options: ["Has", "Did", "Were", "Have"], correctIndex: 3, explanation: "You → Have: Have you been learning English for a long time?" },
      { id: "3-3", prompt: "___ they been living here since last year?", options: ["Has", "Did", "Were", "Have"], correctIndex: 3, explanation: "They → Have: Have they been living here since last year?" },
      { id: "3-4", prompt: "\"Has he been working all day?\" — \"Yes, ___.\"", options: ["he has been", "he did", "he has", "he is"], correctIndex: 2, explanation: "Short positive answer: Yes, he has. (Never repeat 'been working'.)" },
      { id: "3-5", prompt: "\"Have you been waiting long?\" — \"No, ___.\"", options: ["I haven't been", "I didn't", "I haven't", "I wasn't"], correctIndex: 2, explanation: "Short negative answer: No, I haven't." },
      { id: "3-6", prompt: "How long ___ she been studying medicine?", options: ["did", "was", "has", "have"], correctIndex: 2, explanation: "She → has: How long has she been studying medicine?" },
      { id: "3-7", prompt: "How long ___ you been living in this city?", options: ["did", "has", "were", "have"], correctIndex: 3, explanation: "You → have: How long have you been living in this city?" },
      { id: "3-8", prompt: "\"Has it been raining?\" — \"Yes, ___.\"", options: ["it has been", "it did", "it has", "it was"], correctIndex: 2, explanation: "Short positive answer: Yes, it has." },
      { id: "3-9", prompt: "\"Have they been arguing?\" — \"No, ___.\"", options: ["they haven't been", "they didn't", "they haven't", "they weren't"], correctIndex: 2, explanation: "Short negative answer: No, they haven't." },
      { id: "3-10", prompt: "___ he been feeling tired lately?", options: ["Have", "Is", "Did", "Has"], correctIndex: 3, explanation: "He → Has: Has he been feeling tired lately?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all forms + PPC vs PP Simple",
    instructions:
      "This set mixes all forms of the Present Perfect Continuous and tests the distinction between it and the Present Perfect Simple. Choose the best option for each sentence.",
    questions: [
      { id: "4-1", prompt: "Look — she's tired. She ___ running for an hour.", options: ["has run", "has been running", "is running", "had been running"], correctIndex: 1, explanation: "Visible result of an ongoing action → Present Perfect Continuous: has been running." },
      { id: "4-2", prompt: "I ___ three books this month. (completed action)", options: ["have been reading", "was reading", "have read", "had read"], correctIndex: 2, explanation: "Emphasis on a completed quantity/result → Present Perfect Simple: have read." },
      { id: "4-3", prompt: "They ___ here since last Monday.", options: ["have been staying", "are staying", "stayed", "had been staying"], correctIndex: 0, explanation: "Action started in the past and still ongoing (since) → PPC: have been staying." },
      { id: "4-4", prompt: "How long ___ you been working on this project?", options: ["did", "have", "has", "were"], correctIndex: 1, explanation: "You → have: How long have you been working on this project?" },
      { id: "4-5", prompt: "She ___ her key. She can't get in. (result matters)", options: ["has been losing", "was losing", "has lost", "had lost"], correctIndex: 2, explanation: "Completed action with a present result → PP Simple: has lost." },
      { id: "4-6", prompt: "I ___ Spanish for five years and I'm still learning.", options: ["studied", "had studied", "have studied", "have been studying"], correctIndex: 3, explanation: "Duration of ongoing activity → PPC: have been studying." },
      { id: "4-7", prompt: "\"Has she been crying?\" — \"Yes, ___.\"", options: ["she has been", "she did", "she has", "she was"], correctIndex: 2, explanation: "Short answer: Yes, she has." },
      { id: "4-8", prompt: "He ___ known her for ten years. (stative verb)", options: ["has been knowing", "knew", "is knowing", "has known"], correctIndex: 3, explanation: "Know is a stative verb — no continuous form. Use PP Simple: has known." },
      { id: "4-9", prompt: "We ___ been going to the gym a lot recently.", options: ["has", "have", "are", "were"], correctIndex: 1, explanation: "We → have: We have been going to the gym a lot recently." },
      { id: "4-10", prompt: "They ___ the report. It's ready. (completed)", options: ["have been finishing", "were finishing", "have finished", "had been finishing"], correctIndex: 2, explanation: "Completed result → PP Simple: have finished." },
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

export default function PresentPerfectContinuousQuizClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

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
          <a className="hover:text-slate-900 transition" href="/tenses/present-perfect-continuous">Present Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Present Perfect Continuous</b> with 40 multiple choice questions across four sets: affirmative (have/has been), negative (haven't/hasn't been), questions &amp; short answers, and a mixed set including PPC vs PP Simple.
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
          <a href="/tenses/present-perfect-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Present Perfect Continuous exercises</a>
          <a href="/tenses/present-perfect-continuous/fill-in-blank" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Fill in the Blank →</a>
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

      {/* have/has been table */}
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
          <span className="font-black">★ Key rule:</span> He / She / It → <b>has been</b>, not <b>have been</b>.<br />
          <span className="text-xs">She <b>has been</b> working ✅ &nbsp; She have been working ❌</span>
        </div>
      </div>

      {/* Stative verbs warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Stative verbs — no continuous form! Use PP Simple instead.</div>
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
