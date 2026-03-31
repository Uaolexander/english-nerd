"use client";

import { useMemo, useState } from "react";

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

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Completion vs duration: choose FP or FPC",
    instructions:
      "Choose Future Perfect (will have + past participle) for completed results or Future Perfect Continuous (will have been + -ing) for duration/process. Context is key.",
    questions: [
      {
        id: "1-1",
        prompt: "By 5 PM, she ___ the report. (result: the report exists, it's done)",
        options: ["will have been writing", "will have written", "will be writing", "will write"],
        correctIndex: 1,
        explanation: "Future Perfect: will have written — the report is finished (completed result).",
      },
      {
        id: "1-2",
        prompt: "By 5 PM, she ___ for six hours. (duration: the activity is ongoing)",
        options: ["will have been writing", "will have written", "will be writing", "wrote"],
        correctIndex: 0,
        explanation: "FPC: will have been writing — six hours of duration, emphasis on the process.",
      },
      {
        id: "1-3",
        prompt: "When I arrive, they ___ all the food. (nothing will be left)",
        options: ["will have been eating", "will be eating", "will have eaten", "had eaten"],
        correctIndex: 2,
        explanation: "Future Perfect: will have eaten — completion, there's a result (no food left).",
      },
      {
        id: "1-4",
        prompt: "By the end of the race, she ___ for four hours without stopping.",
        options: ["will have been running", "will have run", "will be running", "has run"],
        correctIndex: 0,
        explanation: "FPC: will have been running — four hours of duration, emphasising the effort/process.",
      },
      {
        id: "1-5",
        prompt: "He ___ the whole novel by the time the film adaptation is released.",
        options: ["will have been reading", "will be reading", "had read", "will have read"],
        correctIndex: 3,
        explanation: "Future Perfect: will have read — the novel is finished (completed, countable result).",
      },
      {
        id: "1-6",
        prompt: "By the time you call, I ___ for an hour trying to fix this bug.",
        options: ["will have fixed", "will have been working", "will be working", "had worked"],
        correctIndex: 1,
        explanation: "FPC: will have been working — one hour of ongoing, frustrating effort.",
      },
      {
        id: "1-7",
        prompt: "By next year, she ___ three albums. (counting a measurable output)",
        options: ["will have recorded", "will have been recording", "will be recording", "has recorded"],
        correctIndex: 0,
        explanation: "Future Perfect: will have recorded — three albums = countable completed output.",
      },
      {
        id: "1-8",
        prompt: "By next year, she ___ for twelve months on her debut album.",
        options: ["will have recorded", "will be recording", "will have been recording", "records"],
        correctIndex: 2,
        explanation: "FPC: will have been recording — twelve months of continuous process.",
      },
      {
        id: "1-9",
        prompt: "The builders ___ on the stadium for three years by the opening ceremony.",
        options: ["will have completed", "will be working", "had been working", "will have been working"],
        correctIndex: 3,
        explanation: "FPC: will have been working — three years of ongoing construction process.",
      },
      {
        id: "1-10",
        prompt: "The builders ___ the stadium by the opening ceremony. (it's ready)",
        options: ["will have been completing", "will have completed", "will be completing", "had completed"],
        correctIndex: 1,
        explanation: "Future Perfect: will have completed — the stadium is a finished result.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Numbers/count vs duration",
    instructions:
      "A count or number in the sentence usually signals Future Perfect (completed result). A duration phrase signals Future Perfect Continuous (ongoing process). Choose accordingly.",
    questions: [
      {
        id: "2-1",
        prompt: "By June, he ___ 20 books. (count: 20 is the result)",
        options: ["will have been reading", "will have read", "will be reading", "has read"],
        correctIndex: 1,
        explanation: "Future Perfect: will have read — 20 books = a countable completed result.",
      },
      {
        id: "2-2",
        prompt: "By June, he ___ for a whole year. (duration: a year is the period)",
        options: ["will have been reading", "will have read", "will be reading", "has been reading"],
        correctIndex: 0,
        explanation: "FPC: will have been reading — a year of reading = duration, not count.",
      },
      {
        id: "2-3",
        prompt: "By the time she retires, she ___ over 5,000 patients. (treating is complete)",
        options: ["will have been treating", "will be treating", "will have treated", "had treated"],
        correctIndex: 2,
        explanation: "Future Perfect: will have treated — 5,000 patients = countable completed result.",
      },
      {
        id: "2-4",
        prompt: "By the time she retires, she ___ patients for 40 years.",
        options: ["will have treated", "will have been treating", "will be treating", "has treated"],
        correctIndex: 1,
        explanation: "FPC: will have been treating — 40 years of ongoing work = duration.",
      },
      {
        id: "2-5",
        prompt: "The marathon runner ___ 42 km by the finish line.",
        options: ["will have run", "will have been running", "will be running", "has run"],
        correctIndex: 0,
        explanation: "Future Perfect: will have run — 42 km = a measurable completed distance.",
      },
      {
        id: "2-6",
        prompt: "The marathon runner ___ for over four hours by the finish line.",
        options: ["will have run", "will be running", "will have been running", "ran"],
        correctIndex: 2,
        explanation: "FPC: will have been running — four hours = ongoing duration of effort.",
      },
      {
        id: "2-7",
        prompt: "By graduation day, she ___ seven exams. (completed count)",
        options: ["will have been sitting", "will have sat", "will be sitting", "has sat"],
        correctIndex: 1,
        explanation: "Future Perfect: will have sat — seven exams = a countable completed set.",
      },
      {
        id: "2-8",
        prompt: "By graduation day, she ___ for her degree for four years.",
        options: ["will have studied", "will be studying", "has studied", "will have been studying"],
        correctIndex: 3,
        explanation: "FPC: will have been studying — four years of ongoing study = duration.",
      },
      {
        id: "2-9",
        prompt: "By 2030, the factory ___ two million cars. (production count)",
        options: ["will have been producing", "will have produced", "will be producing", "had produced"],
        correctIndex: 1,
        explanation: "Future Perfect: will have produced — two million cars = countable completed output.",
      },
      {
        id: "2-10",
        prompt: "By 2030, the factory ___ cars for 50 years. (operation duration)",
        options: ["will have produced", "will be producing", "produced", "will have been producing"],
        correctIndex: 3,
        explanation: "FPC: will have been producing — 50 years of continuous operation = duration.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Stative verbs and active verbs",
    instructions:
      "Stative verbs (know, understand, believe, want, love) cannot use continuous forms — always Future Perfect. Active verbs can be FP (completion) or FPC (duration) depending on context.",
    questions: [
      {
        id: "3-1",
        prompt: "By next year, I ___ her for ten years. (know — stative verb)",
        options: ["will have known", "will have been knowing", "will be knowing", "have been knowing"],
        correctIndex: 0,
        explanation: "'know' is stative — no continuous form. Future Perfect: will have known her for ten years.",
      },
      {
        id: "3-2",
        prompt: "By graduation, he ___ calculus for three years. (study — active verb, duration)",
        options: ["will have studied", "will have been studying", "will be studying", "has studied"],
        correctIndex: 1,
        explanation: "FPC: will have been studying — 'study' is active, three years = duration.",
      },
      {
        id: "3-3",
        prompt: "By the time she moves, she ___ this flat for five years. (own — stative)",
        options: ["will have been owning", "will be owning", "has owned", "will have owned"],
        correctIndex: 3,
        explanation: "'own' is stative — no continuous form. Future Perfect: will have owned.",
      },
      {
        id: "3-4",
        prompt: "By the time she moves, she ___ in this flat for five years. (live — active, duration)",
        options: ["will have owned", "will have been living", "will be living", "had lived"],
        correctIndex: 1,
        explanation: "FPC: will have been living — 'live' is active (in this usage), five years = duration.",
      },
      {
        id: "3-5",
        prompt: "By then, they ___ the solution for months. (understand — stative)",
        options: ["will have been understanding", "will be understanding", "will have understood", "have understood"],
        correctIndex: 2,
        explanation: "'understand' is stative — no continuous form. Future Perfect: will have understood.",
      },
      {
        id: "3-6",
        prompt: "By the finals, she ___ tennis for twelve years. (play — active, duration)",
        options: ["will have been playing", "will have played", "will be playing", "played"],
        correctIndex: 0,
        explanation: "FPC: will have been playing — 'play' is active, twelve years = duration of practice.",
      },
      {
        id: "3-7",
        prompt: "By the time he proposes, he ___ her for two years. (love — stative)",
        options: ["will have been loving", "will have loved", "will be loving", "has loved"],
        correctIndex: 1,
        explanation: "'love' is stative — no continuous form. Future Perfect: will have loved.",
      },
      {
        id: "3-8",
        prompt: "By the time he retires, he ___ his colleagues for thirty years. (work with — active, duration)",
        options: ["will have worked with", "will be working with", "had worked with", "will have been working with"],
        correctIndex: 3,
        explanation: "FPC: will have been working with — 'work' is active, thirty years = duration.",
      },
      {
        id: "3-9",
        prompt: "By their anniversary, they ___ each other for 20 years. (know — stative)",
        options: ["will have been knowing", "will have known", "will be knowing", "had known"],
        correctIndex: 1,
        explanation: "'know' is stative — no continuous form allowed. Future Perfect: will have known.",
      },
      {
        id: "3-10",
        prompt: "By the album launch, the band ___ together for two years. (rehearse — active, duration)",
        options: ["will have rehearsed", "will be rehearsing", "will have been rehearsing", "has rehearsed"],
        correctIndex: 2,
        explanation: "FPC: will have been rehearsing — 'rehearse' is active, two years = duration of process.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Hard mixed: Future Simple, FP, and FPC",
    instructions:
      "Choose from Future Simple (will do), Future Perfect (will have done), and Future Perfect Continuous (will have been doing). Read for time references and intent.",
    questions: [
      {
        id: "4-1",
        prompt: "She ___ by noon. (simple future event, no duration or completion reference)",
        options: ["will finish", "will have finished", "will have been finishing", "will be finishing"],
        correctIndex: 0,
        explanation: "Future Simple: will finish — a straightforward future event, no 'by + past' or duration.",
      },
      {
        id: "4-2",
        prompt: "She ___ her work by noon. (completed before noon)",
        options: ["will finish", "will have finished", "will have been finishing", "will be finishing"],
        correctIndex: 1,
        explanation: "Future Perfect: will have finished — 'by noon' + completed result before that point.",
      },
      {
        id: "4-3",
        prompt: "She ___ for six hours by noon. (duration up to noon)",
        options: ["will finish", "will have finished", "will have been working", "will be working"],
        correctIndex: 2,
        explanation: "FPC: will have been working — six hours of continuous process leading up to noon.",
      },
      {
        id: "4-4",
        prompt: "Look at those clouds — it ___. (immediate prediction based on evidence)",
        options: ["will have rained", "will have been raining", "will rain", "is going to rain"],
        correctIndex: 3,
        explanation: "Going to — visible evidence (clouds) signals an immediate prediction.",
      },
      {
        id: "4-5",
        prompt: "By the time you read this letter, I ___ already. (departed before reading)",
        options: ["will leave", "will have left", "will have been leaving", "will be leaving"],
        correctIndex: 1,
        explanation: "Future Perfect: will have left — 'by the time' + completed action before reading.",
      },
      {
        id: "4-6",
        prompt: "By the time you read this, I ___ for 24 hours. (duration of travel)",
        options: ["will have been travelling", "will have left", "will leave", "will be travelling"],
        correctIndex: 0,
        explanation: "FPC: will have been travelling — 24 hours of continuous journey up to reading.",
      },
      {
        id: "4-7",
        prompt: "By next Christmas, they ___ in their new house for a full year.",
        options: ["will live", "will be living", "will have been living", "will have lived"],
        correctIndex: 2,
        explanation: "FPC: will have been living — a full year of continuous living up to Christmas.",
      },
      {
        id: "4-8",
        prompt: "Don't call me at 3 PM — I ___ my presentation then. (in progress at that moment)",
        options: ["will give", "will have given", "will have been giving", "will be giving"],
        correctIndex: 3,
        explanation: "Future Continuous: will be giving — in progress at a specific future moment (3 PM).",
      },
      {
        id: "4-9",
        prompt: "I think I ___ the right decision. (expressing a belief/prediction about the future)",
        options: ["will make", "will have made", "will have been making", "will be making"],
        correctIndex: 0,
        explanation: "Future Simple: will make — a general future belief or prediction.",
      },
      {
        id: "4-10",
        prompt: "By the time he turns 40, he ___ three marathons. (completed count)",
        options: ["will be running", "will have been running", "will run", "will have run"],
        correctIndex: 3,
        explanation: "Future Perfect: will have run — three marathons = countable completed achievement.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Completion vs Duration",
  2: "Count vs Duration",
  3: "Stative Verbs",
  4: "Hard Mixed",
};

export default function FpVsFpcClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect-continuous">Future Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Future Perfect vs FPC</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            FPC <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Future Perfect vs FPC</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">C1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions distinguishing <b>Future Perfect</b> (will have done) from <b>Future Perfect Continuous</b> (will have been doing). Result/completion vs ongoing process.
        </p>

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
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
        <div className="mt-10 flex items-center gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-perfect-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Perfect Continuous exercises</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation helpers ────────────────────────────────────────────────── */

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
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">Future Perfect — result / completion</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will have", color: "yellow" },
            { text: "past participle", color: "slate" },
            { text: "(result)", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By 5 PM, she will have written the report. (the report is done)" />
            <Ex en="By June, he will have read 20 books. (20 books = countable result)" />
            <Ex en="They will have finished building the bridge by December." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">Future Perfect Continuous — process / duration</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "for/since", color: "violet" },
            { text: "(duration)", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By 5 PM, she will have been writing for six hours. (six hours of effort)" />
            <Ex en="By June, he will have been reading for a whole year. (year-long process)" />
            <Ex en="By December, they will have been building the bridge for three years." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-amber-50 to-white border border-amber-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-amber-500 px-3 py-1 text-xs font-black text-white">Stative verbs — always Future Perfect</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {["know", "believe", "understand", "want", "love", "hate", "own", "belong", "seem", "need", "have (possession)"].map((v) => (
              <span key={v} className="rounded-lg bg-white border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">{v}</span>
            ))}
          </div>
          <div className="space-y-1.5">
            <Ex en="By then, I will have known her for 10 years. ✅" />
            <Ex en="By then, I will have been knowing her for 10 years. ❌" />
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">5 example pairs — FP vs FPC</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-sky-700">Future Perfect (result)</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Future Perfect Continuous (duration)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["She will have written 3 chapters.", "She will have been writing for 3 hours."],
                ["He will have run 10 km.", "He will have been running for 2 hours."],
                ["They will have built the house.", "They will have been building for 6 months."],
                ["I will have read the novel.", "I will have been reading since Monday."],
                ["She will have treated 1,000 patients.", "She will have been treating patients for 20 years."],
              ].map(([fp, fpc], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{fp}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{fpc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key signals */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Key decision signals</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-3">
            <div className="text-xs font-black text-sky-700 mb-2">Use Future Perfect when you see:</div>
            <div className="space-y-1">
              {["a count or number (20 books, 3 chapters)", "stative verbs (know, love, own)", "completion language (finished, done)", "by + time without duration"].map((s) => (
                <div key={s} className="text-xs text-sky-800">• {s}</div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
            <div className="text-xs font-black text-emerald-700 mb-2">Use FPC when you see:</div>
            <div className="space-y-1">
              {["for [duration] (for 3 hours, for years)", "since [starting point]", "emphasis on effort/process", "how long will… have been…?"].map((s) => (
                <div key={s} className="text-xs text-emerald-800">• {s}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
