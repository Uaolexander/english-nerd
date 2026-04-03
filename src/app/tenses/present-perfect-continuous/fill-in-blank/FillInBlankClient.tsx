"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type InputQ = {
  id: string;
  prompt: string;
  hint: string;
  correct: string[];
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: InputQ[];
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/'/g, "'").replace(/'/g, "'");
}

function isAccepted(val: string, correct: string[]) {
  const n = normalize(val);
  return correct.some((c) => normalize(c) === n);
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Affirmative: have/has been + verb-ing",
    instructions:
      "Write the correct Present Perfect Continuous affirmative form. Use have been with I / you / we / they and has been with he / she / it. Add the correct -ing ending.",
    questions: [
      { id: "1-1", prompt: "She ___ (work) here for five years.", hint: "(work)", correct: ["has been working"], explanation: "She → has been working." },
      { id: "1-2", prompt: "I ___ (wait) for you since noon.", hint: "(wait)", correct: ["have been waiting"], explanation: "I → have been waiting." },
      { id: "1-3", prompt: "They ___ (live) in London since 2018.", hint: "(live)", correct: ["have been living"], explanation: "They → have been living. (live → living: drop -e)" },
      { id: "1-4", prompt: "He ___ (study) all morning.", hint: "(study)", correct: ["has been studying"], explanation: "He → has been studying." },
      { id: "1-5", prompt: "We ___ (try) to reach you for hours.", hint: "(try)", correct: ["have been trying"], explanation: "We → have been trying." },
      { id: "1-6", prompt: "The children ___ (play) in the garden all afternoon.", hint: "(play)", correct: ["have been playing"], explanation: "The children (= they) → have been playing." },
      { id: "1-7", prompt: "It ___ (rain) since early morning.", hint: "(rain)", correct: ["has been raining"], explanation: "It → has been raining." },
      { id: "1-8", prompt: "You ___ (do) a great job lately.", hint: "(do)", correct: ["have been doing"], explanation: "You → have been doing." },
      { id: "1-9", prompt: "My parents ___ (travel) around Europe for three weeks.", hint: "(travel)", correct: ["have been travelling", "have been traveling"], explanation: "My parents (= they) → have been travelling." },
      { id: "1-10", prompt: "She ___ (run) every morning this week.", hint: "(run)", correct: ["has been running"], explanation: "She → has been running. (run → running: double final consonant)" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: haven't/hasn't been + verb-ing",
    instructions:
      "Write the correct Present Perfect Continuous negative form. Use haven't been with I / you / we / they and hasn't been with he / she / it.",
    questions: [
      { id: "2-1", prompt: "She ___ (feel) well lately.", hint: "(feel)", correct: ["hasn't been feeling", "has not been feeling"], explanation: "She + negative → hasn't been feeling." },
      { id: "2-2", prompt: "I ___ (sleep) much this week.", hint: "(sleep)", correct: ["haven't been sleeping", "have not been sleeping"], explanation: "I + negative → haven't been sleeping." },
      { id: "2-3", prompt: "They ___ (work) on the project recently.", hint: "(work)", correct: ["haven't been working", "have not been working"], explanation: "They + negative → haven't been working." },
      { id: "2-4", prompt: "He ___ (eat) properly since the illness.", hint: "(eat)", correct: ["hasn't been eating", "has not been eating"], explanation: "He + negative → hasn't been eating." },
      { id: "2-5", prompt: "We ___ (go) to the gym lately.", hint: "(go)", correct: ["haven't been going", "have not been going"], explanation: "We + negative → haven't been going." },
      { id: "2-6", prompt: "The team ___ (perform) well this season.", hint: "(perform)", correct: ["hasn't been performing", "has not been performing"], explanation: "The team (singular) + negative → hasn't been performing." },
      { id: "2-7", prompt: "It ___ (snow) much this winter.", hint: "(snow)", correct: ["hasn't been snowing", "has not been snowing"], explanation: "It + negative → hasn't been snowing." },
      { id: "2-8", prompt: "You ___ (pay) attention during the lecture.", hint: "(pay)", correct: ["haven't been paying", "have not been paying"], explanation: "You + negative → haven't been paying." },
      { id: "2-9", prompt: "My sister ___ (reply) to my messages.", hint: "(reply)", correct: ["hasn't been replying", "has not been replying"], explanation: "My sister (= she) + negative → hasn't been replying." },
      { id: "2-10", prompt: "The students ___ (study) hard enough.", hint: "(study)", correct: ["haven't been studying", "have not been studying"], explanation: "The students (= they) + negative → haven't been studying." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions and short answers",
    instructions:
      "Write the correct Present Perfect Continuous question or short answer. Start questions with Have / Has. Short answers use have / has only.",
    questions: [
      { id: "3-1", prompt: "___ she been waiting long? (wait)", hint: "(wait)", correct: ["has she been waiting long?", "has she been waiting long", "has she been waiting?", "has she been waiting"], explanation: "She → Has: Has she been waiting long?" },
      { id: "3-2", prompt: "___ you been learning English for a long time? (learn)", hint: "(learn)", correct: ["have you been learning english for a long time?", "have you been learning english for a long time", "have you been learning?", "have you been learning"], explanation: "You → Have: Have you been learning English for a long time?" },
      { id: "3-3", prompt: "___ they been living here since last year? (live)", hint: "(live)", correct: ["have they been living here since last year?", "have they been living here since last year", "have they been living?", "have they been living"], explanation: "They → Have: Have they been living here since last year?" },
      { id: "3-4", prompt: "How long ___ she been studying medicine? (study)", hint: "(study)", correct: ["how long has she been studying medicine?", "how long has she been studying?", "has she been studying"], explanation: "She → has: How long has she been studying medicine?" },
      { id: "3-5", prompt: "How long ___ you been living in this city? (live)", hint: "(live)", correct: ["how long have you been living in this city?", "how long have you been living?", "have you been living"], explanation: "You → have: How long have you been living in this city?" },
      { id: "3-6", prompt: "___ he been feeling tired lately? (feel)", hint: "(feel)", correct: ["has he been feeling tired lately?", "has he been feeling lately?", "has he been feeling?", "has he been feeling"], explanation: "He → Has: Has he been feeling tired lately?" },
      { id: "3-7", prompt: "\"Has he been working all day?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["he has", "yes, he has"], explanation: "Short positive answer: Yes, he has." },
      { id: "3-8", prompt: "\"Have you been waiting long?\" — \"No, ___.\"", hint: "(short answer)", correct: ["i haven't", "i have not", "no, i haven't", "no, i have not"], explanation: "Short negative answer: No, I haven't." },
      { id: "3-9", prompt: "\"Has it been raining?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["it has", "yes, it has"], explanation: "Short positive answer: Yes, it has." },
      { id: "3-10", prompt: "\"Have they been arguing?\" — \"No, ___.\"", hint: "(short answer)", correct: ["they haven't", "they have not", "no, they haven't", "no, they have not"], explanation: "Short negative answer: No, they haven't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: affirmative, negative, and questions",
    instructions:
      "Write the correct form of the Present Perfect Continuous. Read carefully — some sentences require PP Simple (stative verbs or completed results).",
    questions: [
      { id: "4-1", prompt: "Look — she's tired. She ___ (run) for an hour.", hint: "(run)", correct: ["has been running"], explanation: "Visible result of ongoing action → has been running." },
      { id: "4-2", prompt: "They ___ (not / work) on the project this week.", hint: "(not / work)", correct: ["haven't been working", "have not been working"], explanation: "They + negative → haven't been working." },
      { id: "4-3", prompt: "How long ___ (you / study) English?", hint: "(you / study)", correct: ["have you been studying english?", "have you been studying?", "have you been studying"], explanation: "You → Have you been studying…?" },
      { id: "4-4", prompt: "I ___ (know) her for ten years. (stative verb)", hint: "(know)", correct: ["have known"], explanation: "Know is stative — use PP Simple: have known." },
      { id: "4-5", prompt: "She ___ (not / feel) well since Monday.", hint: "(not / feel)", correct: ["hasn't been feeling", "has not been feeling"], explanation: "She + negative → hasn't been feeling." },
      { id: "4-6", prompt: "___ (he / work) at the company for a long time?", hint: "(he / work)", correct: ["has he been working at the company for a long time?", "has he been working for a long time?", "has he been working?", "has he been working"], explanation: "He → Has he been working…?" },
      { id: "4-7", prompt: "We ___ (save) money for the trip all year.", hint: "(save)", correct: ["have been saving"], explanation: "We → have been saving. (save → saving: drop -e)" },
      { id: "4-8", prompt: "She ___ (lose) her key. She can't get in. (completed result)", hint: "(lose)", correct: ["has lost"], explanation: "Completed action with present result → PP Simple: has lost." },
      { id: "4-9", prompt: "\"Have you been waiting long?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i have", "yes, i have"], explanation: "Short positive answer: Yes, I have." },
      { id: "4-10", prompt: "It ___ (snow) non-stop since yesterday.", hint: "(snow)", correct: ["has been snowing"], explanation: "It → has been snowing. Ongoing since yesterday." },
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

export default function FillInBlankClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

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
      if (isAccepted(answers[q.id] ?? "", q.correct)) correct++;
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
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Present Perfect Continuous</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions, and mixed. Pay attention to the -ing spelling rules and stative verbs.
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

                  <div className="mt-8 space-y-4">
                    {current.questions.map((q, idx) => {
                      const val = answers[q.id] ?? "";
                      const answered = normalize(val) !== "";
                      const correct = checked && answered && isAccepted(val, q.correct);
                      const wrong = checked && answered && !correct;
                      const noAnswer = checked && !answered;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 leading-relaxed">
                                {q.prompt.split("___").map((part, i, arr) =>
                                  i < arr.length - 1 ? (
                                    <span key={i}>
                                      {part}
                                      <span className="inline-block align-baseline mx-1">
                                        <input
                                          type="text"
                                          value={val}
                                          disabled={checked}
                                          autoComplete="off"
                                          autoCorrect="off"
                                          autoCapitalize="off"
                                          spellCheck={false}
                                          placeholder={q.hint}
                                          onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                                          className={`rounded-lg border px-3 py-1 text-sm font-mono outline-none transition min-w-[200px] ${
                                            checked
                                              ? correct
                                                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                                : wrong
                                                ? "border-red-400 bg-red-50 text-red-800"
                                                : noAnswer
                                                ? "border-amber-300 bg-amber-50"
                                                : ""
                                              : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
                                          }`}
                                        />
                                      </span>
                                    </span>
                                  ) : (
                                    part
                                  )
                                )}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {correct && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong — you wrote: <span className="font-mono">{val}</span></div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    <span className="font-mono font-bold text-slate-800">{q.correct[0]}</span> — {q.explanation}
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
          <a href="/tenses/present-perfect-continuous/quiz" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Multiple Choice</a>
          <a href="/tenses/present-perfect-continuous/spot-the-mistake" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Spot the Mistake →</a>
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

      {/* PPC vs PP Simple */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">PPC vs PP Simple</div>
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
