"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

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
    title: "Exercise 1 — Affirmative: will have been / won't have been",
    instructions:
      "Choose will have been or won't have been to complete each sentence about duration. All subjects use the same form in Future Perfect Continuous.",
    questions: [
      { id: "1-1", prompt: "By next year, she ___ working at this company for a decade.", options: ["will have been", "won't have been", "will been", "would have been"], correctIndex: 0, explanation: "Affirmative: will have been + working. She will have been working for a decade." },
      { id: "1-2", prompt: "Don't worry — by the time they arrive, we ___ waiting for long.", options: ["will have been", "won't have been", "will be", "have been"], correctIndex: 1, explanation: "Negative: won't have been waiting. They won't arrive late so the wait is short." },
      { id: "1-3", prompt: "When the film ends, they ___ watching it for three hours.", options: ["won't have been", "will have been", "will been", "have been"], correctIndex: 1, explanation: "Affirmative: will have been watching for three hours — emphasising duration." },
      { id: "1-4", prompt: "By 2030, he ___ teaching at this school for 20 years.", options: ["will have been", "won't have been", "will been teaching", "had been teaching"], correctIndex: 0, explanation: "Affirmative: will have been + teaching. Duration up to a future point." },
      { id: "1-5", prompt: "She ___ sleeping long — she only went to bed an hour ago.", options: ["will have been", "won't have been", "have been", "would have been"], correctIndex: 1, explanation: "Negative: won't have been sleeping — she hasn't been asleep long enough." },
      { id: "1-6", prompt: "By the time you read this letter, I ___ travelling for six months.", options: ["won't have been", "will have been", "will be", "would been"], correctIndex: 1, explanation: "Affirmative: will have been travelling for six months." },
      { id: "1-7", prompt: "They ___ waiting long — the meeting starts in five minutes.", options: ["will have been", "won't have been", "will been", "have been"], correctIndex: 1, explanation: "Negative: won't have been waiting long because the meeting is imminent." },
      { id: "1-8", prompt: "By the time the doctor retires, he ___ treating patients for 40 years.", options: ["won't have been", "will have been", "will been", "has been"], correctIndex: 1, explanation: "Affirmative: will have been treating — duration up to retirement." },
      { id: "1-9", prompt: "I ___ working here for 5 years by March — can you believe it?", options: ["won't have been", "will have been", "am being", "had been"], correctIndex: 1, explanation: "Affirmative: will have been working — by March is a future deadline." },
      { id: "1-10", prompt: "She ___ studying abroad for long — she moves back next month.", options: ["will have been", "won't have been", "will been", "has been"], correctIndex: 1, explanation: "Negative: won't have been studying abroad for long since she's returning soon." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Questions: Will + have been + verb-ing / How long?",
    instructions:
      "Choose the correct option to complete each question. Remember: Will + subject + have been + verb-ing?",
    questions: [
      { id: "2-1", prompt: "___ you have been working here for a year by June?", options: ["Will", "Would", "Have", "Are"], correctIndex: 0, explanation: "Questions: Will + subject + have been + verb-ing? → Will you have been working?" },
      { id: "2-2", prompt: "How long ___ she have been studying French by next summer?", options: ["has", "will", "would", "is"], correctIndex: 1, explanation: "How long will she have been studying? — future duration question." },
      { id: "2-3", prompt: "Will they ___ waiting for two hours when the train finally arrives?", options: ["have been", "be", "been", "having been"], correctIndex: 0, explanation: "Will they have been waiting? — the auxiliary phrase is have been + verb-ing." },
      { id: "2-4", prompt: "\"Will he have been running for 3 hours by the finish line?\" — \"Yes, ___.\"", options: ["he will", "he will be", "he will have", "he has"], correctIndex: 0, explanation: "Short answer with will: Yes, he will. (No need to repeat have been running.)" },
      { id: "2-5", prompt: "How long will you have been ___ here by your anniversary?", options: ["live", "lived", "living", "lives"], correctIndex: 2, explanation: "Will + have been + verb-ing: living (not lived or live)." },
      { id: "2-6", prompt: "Will she have been ___ that project for a month by Friday?", options: ["work on", "worked on", "working on", "works on"], correctIndex: 2, explanation: "Have been + working on: present participle form required." },
      { id: "2-7", prompt: "\"Will you have been waiting long?\" — \"No, ___.\"", options: ["I won't", "I won't have", "I will not be", "No, not been"], correctIndex: 0, explanation: "Short negative answer: No, I won't. (Short for I won't have been waiting long.)" },
      { id: "2-8", prompt: "___ long will they have been building the new bridge by December?", options: ["What", "How", "When", "Which"], correctIndex: 1, explanation: "How long asks about duration: How long will they have been building?" },
      { id: "2-9", prompt: "Will the company have been ___ for 100 years by 2050?", options: ["operate", "operated", "operating", "operates"], correctIndex: 2, explanation: "Have been + operating: present participle." },
      { id: "2-10", prompt: "By the time she graduates, how long will she have been ___?", options: ["study", "studied", "studies", "studying"], correctIndex: 3, explanation: "Will have been studying: continuous participle form." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Choose the correct -ing form",
    instructions:
      "Select the correct -ing form of the verb to complete each Future Perfect Continuous sentence. Watch for spelling rules: CVC doubling, drop -e, -ie → -y.",
    questions: [
      { id: "3-1", prompt: "By noon, he will have been ___ for 3 hours.", options: ["runing", "running", "runned", "runs"], correctIndex: 1, explanation: "run → running: short CVC verb (consonant-vowel-consonant) — double the final consonant." },
      { id: "3-2", prompt: "She will have been ___ her essay all evening.", options: ["writeing", "writting", "writing", "writes"], correctIndex: 2, explanation: "write → writing: drop the final -e, then add -ing (NOT writeing)." },
      { id: "3-3", prompt: "They will have been ___ in the pool for an hour.", options: ["swiming", "swimmming", "swimmed", "swimming"], correctIndex: 3, explanation: "swim → swimming: CVC pattern — double the final consonant." },
      { id: "3-4", prompt: "By Sunday, he will have been ___ to classical music all week.", options: ["listenning", "listening", "listening", "listens"], correctIndex: 2, explanation: "listen → listening: no doubling needed — the stress is not on the final syllable." },
      { id: "3-5", prompt: "She will have been ___ the answer for hours.", options: ["diying", "dying", "dieing", "dye-ing"], correctIndex: 1, explanation: "die → dying: -ie verbs change -ie to -y before adding -ing." },
      { id: "3-6", prompt: "By March, I will have been ___ Spanish for two years.", options: ["studyed", "studying", "studing", "studiing"], correctIndex: 1, explanation: "study → studying: -y ending (preceded by a consonant) — just add -ing." },
      { id: "3-7", prompt: "They will have been ___ on the project for three months.", options: ["working", "workking", "worken", "workes"], correctIndex: 0, explanation: "work → working: regular verb — simply add -ing." },
      { id: "3-8", prompt: "He will have been ___ all night before the exam.", options: ["reving", "revising", "revissing", "reviseing"], correctIndex: 1, explanation: "revise → revising: drop the final -e, then add -ing." },
      { id: "3-9", prompt: "By Friday, she will have been ___ at that gym for a year.", options: ["traing", "trainning", "training", "trained"], correctIndex: 2, explanation: "train → training: ends in a vowel-consonant cluster but the final n is not a single CVC — just add -ing." },
      { id: "3-10", prompt: "We will have been ___ for a new house for six months by then.", options: ["lookking", "loking", "looking", "lookin"], correctIndex: 2, explanation: "look → looking: regular — double vowel before consonant means no doubling needed." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: FPC vs Future Perfect & all forms",
    instructions:
      "Choose the correct option. Some questions contrast Future Perfect Continuous (emphasises duration) with Future Perfect (emphasises completion).",
    questions: [
      { id: "4-1", prompt: "By 5 PM, I ___ for 8 hours. (emphasise the ongoing process)", options: ["will have worked", "will have been working", "will be working", "would have worked"], correctIndex: 1, explanation: "Duration / ongoing process → Future Perfect Continuous: will have been working for 8 hours." },
      { id: "4-2", prompt: "By 5 PM, I ___ the report. (emphasise completion)", options: ["will have been finishing", "will be finishing", "will have finished", "have finished"], correctIndex: 2, explanation: "Result / completion → Future Perfect Simple: will have finished the report." },
      { id: "4-3", prompt: "When she crosses the finish line, she ___ for four hours.", options: ["will have been running", "will have run", "will run", "would be running"], correctIndex: 0, explanation: "Emphasis on the continuous activity still in progress → will have been running." },
      { id: "4-4", prompt: "By the time you arrive, we ___ all the food. (nothing left)", options: ["will have been eating", "will have eaten", "will be eating", "had eaten"], correctIndex: 1, explanation: "Completion with a result (no food left) → will have eaten." },
      { id: "4-5", prompt: "He ___ here for a year by Christmas. (duration focus)", options: ["will have been living", "will have lived", "will live", "would live"], correctIndex: 0, explanation: "Duration of living up to Christmas → Future Perfect Continuous: will have been living." },
      { id: "4-6", prompt: "They ___ three albums by 2026. (completion focus)", options: ["will have been recording", "will have recorded", "will be recording", "had recorded"], correctIndex: 1, explanation: "Completed result (three albums = countable achievement) → will have recorded." },
      { id: "4-7", prompt: "By the time he turns 60, he ___ for the same firm for 35 years.", options: ["will have been working", "will have worked", "will work", "has been working"], correctIndex: 0, explanation: "Emphasises the ongoing duration up to age 60 → will have been working." },
      { id: "4-8", prompt: "___ she have been studying all night by the time the exam starts?", options: ["Has", "Will", "Would", "Is"], correctIndex: 1, explanation: "Future Perfect Continuous question: Will + subject + have been + verb-ing?" },
      { id: "4-9", prompt: "I won't have been ___ long when you call.", options: ["sleep", "slept", "sleeping", "sleeps"], correctIndex: 2, explanation: "Won't have been + sleeping: continuous participle (present participle) form." },
      { id: "4-10", prompt: "By next month, we ___ this problem for six months without a solution.", options: ["will have been discussing", "will have discussed", "will discuss", "would discuss"], correctIndex: 0, explanation: "Emphasises the frustrating ongoing duration → will have been discussing." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Questions",
  3: "-ing Forms",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function FuturePerfectContinuousQuizClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect-continuous">Future Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">C1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Future Perfect Continuous</b> with 40 multiple choice questions across four sets: affirmative/negative, questions, -ing spelling, and a mixed review including FPC vs Future Perfect distinction. Pick the correct form and check your answers.
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
          <a href="/tenses/future-perfect-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Perfect Continuous exercises</a>
          <a href="/tenses/future-perfect-continuous/fill-in-blank" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Fill in the Blank →</a>
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
            <Ex en="They will have been waiting for an hour.  ·  He'll have been teaching for 20 years." />
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

      {/* Same form for all subjects table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will have been is the same for ALL subjects</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Affirmative</th>
                <th className="px-4 py-2.5 font-black text-red-700">Negative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "I will have been working", "I won't have been working"],
                ["You", "You will have been working", "You won't have been working"],
                ["He / She / It", "She will have been working", "She won't have been working"],
                ["We / They", "They will have been working", "They won't have been working"],
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
          <span className="font-black">Key point:</span> Unlike Present Simple (is/are/am), Future Perfect Continuous uses <b>will have been</b> for every subject — no exceptions!
        </div>
      </div>

      {/* Stative verbs warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Stative verbs — no continuous form!</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {["know", "believe", "understand", "like", "love", "hate", "want", "need", "seem", "own", "belong", "have (possession)"].map((v) => (
            <span key={v} className="rounded-lg bg-white border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">{v}</span>
          ))}
        </div>
        <div className="mt-2 text-xs text-amber-700">
          ✅ By then, I will have known her for 10 years. &nbsp;|&nbsp; ❌ I will have been knowing her for 10 years.
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Future Perfect Continuous</div>
        <div className="space-y-3">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-sm font-black text-slate-800 mb-2">1. Duration up to a specific future point</div>
            <Ex en="By next month, I will have been learning English for 3 years." />
            <Ex en="She will have been working here for a decade by June." />
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-sm font-black text-slate-800 mb-2">2. Action still in progress at a future time</div>
            <Ex en="By the time he retires, he will have been teaching for 40 years." />
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-sm font-black text-slate-800 mb-2">3. Emphasis on the continuous activity (not just completion)</div>
            <Ex en="When she finishes the marathon, she will have been running for 4 hours." />
          </div>
        </div>
      </div>

      {/* FPC vs Future Perfect */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">FPC vs Future Perfect</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Future Perfect Continuous</div>
            <div className="text-xs text-slate-500 mb-2">Emphasises duration / ongoing process</div>
            <Ex en="By 5 PM, I'll have been working for 8 hours." />
            <Ex en="She'll have been running for 4 hours." />
          </div>
          <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
            <div className="text-xs font-black text-sky-700 uppercase tracking-widest mb-2">Future Perfect Simple</div>
            <div className="text-xs text-slate-500 mb-2">Emphasises completion / result</div>
            <Ex en="By 5 PM, I'll have finished the report." />
            <Ex en="She'll have run 42 km." />
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
