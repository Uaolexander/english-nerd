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
    title: "Exercise 1 — Affirmative: write will have been + verb-ing",
    instructions:
      "Write the correct Future Perfect Continuous form of the verb in brackets. Use will have been + verb-ing for all subjects. Include a 'for' phrase where indicated.",
    questions: [
      { id: "1-1", prompt: "By next June, she ___ (work) at this company for five years.", hint: "(work)", correct: ["will have been working"], explanation: "will have been + working. Duration up to a future point." },
      { id: "1-2", prompt: "When the film ends, they ___ (watch) it for nearly three hours.", hint: "(watch)", correct: ["will have been watching"], explanation: "will have been watching — emphasises the ongoing duration." },
      { id: "1-3", prompt: "By the time you arrive, I ___ (wait) for over an hour.", hint: "(wait)", correct: ["will have been waiting"], explanation: "will have been waiting — continuous action up to arrival." },
      { id: "1-4", prompt: "By 2030, he ___ (teach) at this school for twenty years.", hint: "(teach)", correct: ["will have been teaching"], explanation: "will have been teaching — duration up to a future date." },
      { id: "1-5", prompt: "When she crosses the finish line, she ___ (run) for four hours.", hint: "(run)", correct: ["will have been running"], explanation: "will have been running — run → running (double n)." },
      { id: "1-6", prompt: "By the time you read this, I ___ (travel) around the world for six months.", hint: "(travel)", correct: ["will have been travelling", "will have been traveling"], explanation: "will have been travelling — duration of ongoing travel." },
      { id: "1-7", prompt: "By midnight, they ___ (dance) for five hours straight.", hint: "(dance)", correct: ["will have been dancing"], explanation: "will have been dancing — dance → dancing (drop -e)." },
      { id: "1-8", prompt: "He ___ (study) medicine for six years by the time he graduates.", hint: "(study)", correct: ["will have been studying"], explanation: "will have been studying — study → studying." },
      { id: "1-9", prompt: "By next year, we ___ (live) in this apartment for a decade.", hint: "(live)", correct: ["will have been living"], explanation: "will have been living — live → living (drop -e)." },
      { id: "1-10", prompt: "By the time the project ends, the team ___ (work) on it for three years.", hint: "(work)", correct: ["will have been working"], explanation: "will have been working — all subjects use the same form." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: write won't have been + verb-ing",
    instructions:
      "Write the negative Future Perfect Continuous form. Use won't have been + verb-ing. Both won't have been and will not have been are accepted.",
    questions: [
      { id: "2-1", prompt: "Don't worry — they ___ (wait) for long when we arrive.", hint: "(wait)", correct: ["won't have been waiting", "will not have been waiting"], explanation: "Negative: won't have been waiting — the wait is short." },
      { id: "2-2", prompt: "She ___ (sleep) long — she only went to bed an hour ago.", hint: "(sleep)", correct: ["won't have been sleeping", "will not have been sleeping"], explanation: "won't have been sleeping — she hasn't been asleep long." },
      { id: "2-3", prompt: "By the time he retires, he ___ (work) in that field for long.", hint: "(work)", correct: ["won't have been working", "will not have been working"], explanation: "won't have been working — he changed careers recently." },
      { id: "2-4", prompt: "I ___ (live) abroad for very long when you visit.", hint: "(live)", correct: ["won't have been living", "will not have been living"], explanation: "won't have been living — short period of living abroad." },
      { id: "2-5", prompt: "They ___ (study) for the exam — they never prepare.", hint: "(study)", correct: ["won't have been studying", "will not have been studying"], explanation: "won't have been studying — they do not study." },
      { id: "2-6", prompt: "By the time she calls, he ___ (drive) for more than an hour.", hint: "(drive)", correct: ["won't have been driving", "will not have been driving"], explanation: "won't have been driving — drive → driving (drop -e)." },
      { id: "2-7", prompt: "The children ___ (play) outside long — it will start raining soon.", hint: "(play)", correct: ["won't have been playing", "will not have been playing"], explanation: "won't have been playing — rain will stop play early." },
      { id: "2-8", prompt: "She ___ (practise) the piano today — she has a headache.", hint: "(practise)", correct: ["won't have been practising", "won't have been practicing", "will not have been practising", "will not have been practicing"], explanation: "won't have been practising — ill, so she skipped it." },
      { id: "2-9", prompt: "We ___ (wait) here long by the time the gates open.", hint: "(wait)", correct: ["won't have been waiting", "will not have been waiting"], explanation: "won't have been waiting — they arrive just before the gates open." },
      { id: "2-10", prompt: "He ___ (run) for more than ten minutes when he gives up.", hint: "(run)", correct: ["won't have been running", "will not have been running"], explanation: "won't have been running — run → running (double n). Very short run." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions and short answers",
    instructions:
      "Write the correct Future Perfect Continuous question or short answer. For questions, start with Will. For short answers, use Yes, [subject] will or No, [subject] won't.",
    questions: [
      { id: "3-1", prompt: "___ she have been working there for a year by March? (work)", hint: "(work)", correct: ["will she have been working there for a year by march?", "will she have been working there for a year by march", "will she have been working?", "will she have been working"], explanation: "Will she have been working? — future continuous question form." },
      { id: "3-2", prompt: "How long ___ you have been living here by next summer? (live)", hint: "(live)", correct: ["will you have been living here by next summer?", "will you have been living here?", "will you have been living?"], explanation: "How long will you have been living? — duration question." },
      { id: "3-3", prompt: "___ they have been waiting for two hours when the bus finally comes? (wait)", hint: "(wait)", correct: ["will they have been waiting for two hours when the bus finally comes?", "will they have been waiting for two hours?", "will they have been waiting?"], explanation: "Will they have been waiting? — duration at a future point." },
      { id: "3-4", prompt: "\"Will he have been studying all day?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["he will", "yes, he will"], explanation: "Short affirmative answer: Yes, he will." },
      { id: "3-5", prompt: "\"Will she have been sleeping long?\" — \"No, ___.\"", hint: "(short answer)", correct: ["she won't", "no, she won't", "she will not", "no, she will not"], explanation: "Short negative answer: No, she won't." },
      { id: "3-6", prompt: "___ long will they have been building the new stadium by July? (build)", hint: "(build)", correct: ["how long will they have been building the new stadium by july?", "how long will they have been building?"], explanation: "How long will they have been building? — duration question with 'how long'." },
      { id: "3-7", prompt: "___ I have been travelling for a month when you join me? (travel)", hint: "(travel)", correct: ["will i have been travelling for a month when you join me?", "will i have been travelling for a month?", "will i have been travelling?", "will i have been traveling for a month when you join me?", "will i have been traveling for a month?", "will i have been traveling?"], explanation: "Will I have been travelling? — first person question." },
      { id: "3-8", prompt: "\"Will you have been working here for ten years by December?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i will", "yes, i will"], explanation: "Short affirmative: Yes, I will." },
      { id: "3-9", prompt: "How long ___ she have been learning the violin by her first concert? (learn)", hint: "(learn)", correct: ["will she have been learning the violin by her first concert?", "will she have been learning?"], explanation: "How long will she have been learning? — duration up to concert." },
      { id: "3-10", prompt: "\"Will they have been waiting long?\" — \"No, ___.\"", hint: "(short answer)", correct: ["they won't", "no, they won't", "they will not", "no, they will not"], explanation: "Short negative: No, they won't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all forms",
    instructions:
      "Write the correct Future Perfect Continuous form. Read each sentence carefully to decide if it is affirmative, negative, or a question.",
    questions: [
      { id: "4-1", prompt: "By the time you wake up, I ___ (cook) breakfast for an hour.", hint: "(cook)", correct: ["will have been cooking"], explanation: "Affirmative: will have been cooking — duration up to waking." },
      { id: "4-2", prompt: "She ___ (not / work) for more than a year when she quits.", hint: "(not / work)", correct: ["won't have been working", "will not have been working"], explanation: "Negative: won't have been working — very short employment." },
      { id: "4-3", prompt: "___ (how long / he / run) by the time he crosses the finish line? (run)", hint: "(how long / he / run)", correct: ["how long will he have been running by the time he crosses the finish line?", "how long will he have been running?"], explanation: "How long will he have been running? — duration question." },
      { id: "4-4", prompt: "They ___ (not / wait) long — the doors open in two minutes.", hint: "(not / wait)", correct: ["won't have been waiting", "will not have been waiting"], explanation: "Negative: won't have been waiting long." },
      { id: "4-5", prompt: "By next March, she ___ (write) her novel for two years.", hint: "(write)", correct: ["will have been writing"], explanation: "Affirmative: will have been writing — write → writing (drop -e)." },
      { id: "4-6", prompt: "___ (they / study) for five hours when the exam begins? (study)", hint: "(they / study)", correct: ["will they have been studying for five hours when the exam begins?", "will they have been studying for five hours?", "will they have been studying?"], explanation: "Will they have been studying? — duration question." },
      { id: "4-7", prompt: "\"Will you have been driving for long?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i will", "yes, i will"], explanation: "Short affirmative: Yes, I will." },
      { id: "4-8", prompt: "He ___ (swim) in competitions for 10 years by the next Olympics.", hint: "(swim)", correct: ["will have been swimming"], explanation: "Affirmative: will have been swimming — swim → swimming (double m)." },
      { id: "4-9", prompt: "By the time winter ends, the bears ___ (not / hibernate) for a full season.", hint: "(not / hibernate)", correct: ["won't have been hibernating", "will not have been hibernating"], explanation: "Negative: won't have been hibernating — a shorter hibernation." },
      { id: "4-10", prompt: "How long ___ (you / teach) English by the time you retire?", hint: "(you / teach)", correct: ["will you have been teaching english by the time you retire?", "will you have been teaching?"], explanation: "How long will you have been teaching? — duration question." },
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect-continuous">Future Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">C1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Future Perfect Continuous</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions, and mixed. Pay attention to the will have been structure and -ing spelling rules.
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
                                          className={`rounded-lg border px-3 py-1 text-sm font-mono outline-none transition min-w-[220px] ${
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
          <a href="/tenses/future-perfect-continuous/quiz" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Multiple Choice</a>
          <a href="/tenses/future-perfect-continuous/spot-the-mistake" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Spot the Mistake →</a>
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
            { text: "will have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will have been working for 3 hours.  ·  She will have been studying all day." />
            <Ex en="They will have been waiting.  ·  He'll have been teaching for 20 years." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't have been", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't have been working long.  ·  She won't have been waiting." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you have been working for long?  ·  Will she have been waiting long?" />
            <Ex en="How long will you have been working there by next year?" />
          </div>
        </div>
      </div>

      {/* Same form table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will have been is the same for ALL subjects</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I / You / He / She / It / We / They", "will have been working", "won't have been working"],
              ].map(([subj, aff, neg], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          <span className="font-black">Key point:</span> <b>will have been</b> is the same for every subject — no he/she/it exception!
        </div>
      </div>

      {/* Stative verbs */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Stative verbs — no continuous form!</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {["know", "believe", "understand", "like", "love", "hate", "want", "need", "seem", "own", "belong", "have (possession)"].map((v) => (
            <span key={v} className="rounded-lg bg-white border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">{v}</span>
          ))}
        </div>
        <div className="mt-2 text-xs text-amber-700">✅ By then, I will have known her for 10 years. &nbsp;|&nbsp; ❌ I will have been knowing her.</div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Future Perfect Continuous</div>
        <div className="space-y-3">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-sm font-black text-slate-800 mb-2">Duration up to a future point (for + by)</div>
            <Ex en="By next month, I will have been learning English for 3 years." />
            <Ex en="By the time he retires, he will have been teaching for 40 years." />
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-sm font-black text-slate-800 mb-2">FPC vs Future Perfect</div>
            <Ex en="FPC (duration): By 5 PM, I'll have been working for 8 hours." />
            <Ex en="FP (completion): By 5 PM, I'll have finished the report." />
          </div>
        </div>
      </div>

      {/* -ing spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ing", ex: "work → working · play → playing · read → reading" },
            { rule: "Ends in -e → drop the -e, add -ing", ex: "make → making · come → coming · write → writing" },
            { rule: "Short verb (CVC) → double the final consonant", ex: "run → running · sit → sitting · swim → swimming" },
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
          {["by next year", "for + duration", "by the time", "how long", "when + future clause", "by + future date", "by then", "for hours / days / years"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
