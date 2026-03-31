"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

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
    title: "Exercise 1 — Affirmative: write will + base form",
    instructions:
      "Write the correct Future Simple affirmative form: will + base form of the verb in brackets. Remember: will is the same for all subjects.",
    questions: [
      { id: "1-1", prompt: "She ___ (call) you later.", hint: "(call)", correct: ["will call"], explanation: "Affirmative: She will call you later." },
      { id: "1-2", prompt: "I ___ (help) you move the furniture.", hint: "(help)", correct: ["will help", "I'll help"], explanation: "Affirmative: I will help you." },
      { id: "1-3", prompt: "They ___ (arrive) tomorrow morning.", hint: "(arrive)", correct: ["will arrive"], explanation: "Affirmative: They will arrive tomorrow." },
      { id: "1-4", prompt: "He ___ (probably / be) late again.", hint: "(be)", correct: ["will probably be", "will be"], explanation: "Affirmative: He will probably be late." },
      { id: "1-5", prompt: "We ___ (finish) the project by Friday.", hint: "(finish)", correct: ["will finish"], explanation: "Affirmative: We will finish the project." },
      { id: "1-6", prompt: "The sun ___ (rise) at 6 AM tomorrow.", hint: "(rise)", correct: ["will rise"], explanation: "Fact about the future: The sun will rise at 6 AM." },
      { id: "1-7", prompt: "I think it ___ (be) a great concert.", hint: "(be)", correct: ["will be"], explanation: "Prediction based on opinion: I think it will be great." },
      { id: "1-8", prompt: "She ___ (turn) 30 next year.", hint: "(turn)", correct: ["will turn"], explanation: "Future fact: She will turn 30 next year." },
      { id: "1-9", prompt: "Technology ___ (change) a lot in the future.", hint: "(change)", correct: ["will change"], explanation: "Prediction: Technology will change a lot." },
      { id: "1-10", prompt: "I ___ (carry) that bag for you.", hint: "(carry)", correct: ["will carry", "I'll carry"], explanation: "Offer: I will carry that bag for you." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: write won't + base form",
    instructions:
      "Write the correct Future Simple negative form: won't + base form of the verb in brackets. won't = will not.",
    questions: [
      { id: "2-1", prompt: "I ___ (tell) anyone about this.", hint: "(tell)", correct: ["won't tell", "will not tell"], explanation: "Negative promise: I won't tell anyone." },
      { id: "2-2", prompt: "She ___ (be) at the party — she has other plans.", hint: "(be)", correct: ["won't be", "will not be"], explanation: "Negative prediction: She won't be at the party." },
      { id: "2-3", prompt: "It ___ (snow) in the desert.", hint: "(snow)", correct: ["won't snow", "will not snow"], explanation: "Negative prediction: It won't snow in the desert." },
      { id: "2-4", prompt: "They ___ (forget) your help.", hint: "(forget)", correct: ["won't forget", "will not forget"], explanation: "Negative promise: They won't forget your help." },
      { id: "2-5", prompt: "I ___ (give up) easily.", hint: "(give up)", correct: ["won't give up", "will not give up"], explanation: "Negative: I won't give up easily." },
      { id: "2-6", prompt: "He ___ (accept) their offer.", hint: "(accept)", correct: ["won't accept", "will not accept"], explanation: "Negative prediction: He won't accept the offer." },
      { id: "2-7", prompt: "We ___ (be) home before midnight.", hint: "(be)", correct: ["won't be", "will not be"], explanation: "Negative: We won't be home before midnight." },
      { id: "2-8", prompt: "The weather ___ (improve) this week.", hint: "(improve)", correct: ["won't improve", "will not improve"], explanation: "Negative prediction: The weather won't improve this week." },
      { id: "2-9", prompt: "I ___ (let) you down, I promise.", hint: "(let)", correct: ["won't let", "will not let"], explanation: "Negative promise: I won't let you down." },
      { id: "2-10", prompt: "She ___ (mind) waiting for a few minutes.", hint: "(mind)", correct: ["won't mind", "will not mind"], explanation: "Negative prediction: She won't mind waiting." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions & short answers",
    instructions:
      "Write the correct Future Simple question or short answer. Questions: Will + subject + base form? Short answers: Yes, ... will. / No, ... won't.",
    questions: [
      { id: "3-1", prompt: "___ you help me with this? (help)", hint: "(help)", correct: ["will you help me with this?", "will you help me?", "will you help me with this"], explanation: "Question: Will you help me?" },
      { id: "3-2", prompt: "___ she come to the meeting? (come)", hint: "(come)", correct: ["will she come to the meeting?", "will she come to the meeting", "will she come?", "will she come"], explanation: "Question: Will she come to the meeting?" },
      { id: "3-3", prompt: "___ they arrive on time? (arrive)", hint: "(arrive)", correct: ["will they arrive on time?", "will they arrive on time", "will they arrive?", "will they arrive"], explanation: "Question: Will they arrive on time?" },
      { id: "3-4", prompt: "___ it rain tomorrow? (rain)", hint: "(rain)", correct: ["will it rain tomorrow?", "will it rain tomorrow", "will it rain?", "will it rain"], explanation: "Question: Will it rain tomorrow?" },
      { id: "3-5", prompt: "___ he call back? (call)", hint: "(call)", correct: ["will he call back?", "will he call back", "will he call?", "will he call"], explanation: "Question: Will he call back?" },
      { id: "3-6", prompt: "\"Will you be there?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i will", "yes, i will"], explanation: "Short affirmative answer: Yes, I will." },
      { id: "3-7", prompt: "\"Will she pass?\" — \"No, ___.\"", hint: "(short answer)", correct: ["she won't", "no, she won't", "she will not", "no, she will not"], explanation: "Short negative answer: No, she won't." },
      { id: "3-8", prompt: "\"Will it rain?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["it will", "yes, it will"], explanation: "Short affirmative answer: Yes, it will." },
      { id: "3-9", prompt: "\"Will they come?\" — \"No, ___.\"", hint: "(short answer)", correct: ["they won't", "no, they won't", "they will not", "no, they will not"], explanation: "Short negative answer: No, they won't." },
      { id: "3-10", prompt: "\"Will he be there?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["he will", "yes, he will"], explanation: "Short affirmative answer: Yes, he will." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: affirmative, negative, and questions",
    instructions:
      "Write the correct Future Simple form. Read each sentence carefully to decide whether it is affirmative, negative, or a question.",
    questions: [
      { id: "4-1", prompt: "Don't worry — I ___ (help) you.", hint: "(help)", correct: ["will help", "I'll help"], explanation: "Spontaneous offer: I will help you." },
      { id: "4-2", prompt: "I ___ (not / tell) anyone your secret.", hint: "(not / tell)", correct: ["won't tell", "will not tell"], explanation: "Negative promise: I won't tell anyone." },
      { id: "4-3", prompt: "___ (you / be) home for dinner? (be)", hint: "(you / be)", correct: ["will you be home for dinner?", "will you be home for dinner", "will you be home?", "will you be home"], explanation: "Question: Will you be home for dinner?" },
      { id: "4-4", prompt: "She ___ (probably / pass) the exam — she studied hard.", hint: "(pass)", correct: ["will probably pass", "will pass"], explanation: "Prediction: She will probably pass." },
      { id: "4-5", prompt: "He ___ (not / accept) that offer.", hint: "(not / accept)", correct: ["won't accept", "will not accept"], explanation: "Negative: He won't accept that offer." },
      { id: "4-6", prompt: "I ___ (have) the soup, please.", hint: "(have)", correct: ["will have", "I'll have"], explanation: "Spontaneous decision (ordering food): I'll have the soup." },
      { id: "4-7", prompt: "___ (she / be) at the office tomorrow? (be)", hint: "(she / be)", correct: ["will she be at the office tomorrow?", "will she be at the office tomorrow", "will she be at the office?", "will she be there tomorrow?", "will she be there"], explanation: "Question: Will she be at the office tomorrow?" },
      { id: "4-8", prompt: "\"Will you call me?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i will", "yes, i will"], explanation: "Short affirmative answer: Yes, I will." },
      { id: "4-9", prompt: "They ___ (not / be) ready on time.", hint: "(not / be)", correct: ["won't be", "will not be"], explanation: "Negative prediction: They won't be ready on time." },
      { id: "4-10", prompt: "I think everything ___ (be) fine.", hint: "(be)", correct: ["will be"], explanation: "Prediction based on opinion: I think everything will be fine." },
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-simple">Future Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Future Simple (will)</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions &amp; short answers, and mixed.
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
                                          className={`rounded-lg border px-3 py-1 text-sm font-mono outline-none transition min-w-[160px] ${
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
          <a href="/tenses/future-simple/quiz" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Multiple Choice</a>
          <a href="/tenses/future-simple/spot-the-mistake" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Spot the Mistake →</a>
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
                ["I", "will work", "won't work", "Will I work?"],
                ["You", "will work", "won't work", "Will you work?"],
                ["He / She / It", "will work ★", "won't work", "Will she work?"],
                ["We / They", "will work", "won't work", "Will they work?"],
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
          <span className="text-xs">She <b>will work</b> ✅ &nbsp; She <b>wills</b> work ❌ &nbsp; She <b>will working</b> ❌</span>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">After will / won&apos;t: ALWAYS use the base form only!</div>
        <div className="space-y-1 text-sm text-amber-900">
          <div>She will <b>go</b> ✅ &nbsp;|&nbsp; She will <b>goes</b> ❌ &nbsp;|&nbsp; She will <b>going</b> ❌</div>
          <div>He won&apos;t <b>be</b> late ✅ &nbsp;|&nbsp; He won&apos;t <b>is</b> late ❌</div>
        </div>
      </div>

      {/* When to use will */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use will</div>
        <div className="space-y-2">
          {[
            { label: "Spontaneous decisions", ex: "\"The phone is ringing.\" → \"I'll get it!\"" },
            { label: "Predictions based on opinion", ex: "\"I think it will rain tomorrow.\" / \"She'll probably be late.\"" },
            { label: "Promises", ex: "\"I'll call you later.\" / \"I won't forget.\"" },
            { label: "Offers", ex: "\"I'll carry that for you.\" / \"I'll help you.\"" },
            { label: "Facts about the future", ex: "\"The sun will rise at 6 AM.\" / \"You will turn 30 one day.\"" },
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
            <Ex en="&quot;I&apos;m going to visit Paris.&quot; (already planned)" />
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
