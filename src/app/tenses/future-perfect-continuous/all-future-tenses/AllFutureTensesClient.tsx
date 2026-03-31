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
    title: "Exercise 1 — will vs going to: spontaneous decisions vs plans",
    instructions:
      "Choose 'will' (spontaneous decision or prediction) or 'going to' (existing plan or visible evidence). Context clues are essential.",
    questions: [
      {
        id: "1-1",
        prompt: "The phone's ringing. I ___ answer it.",
        options: ["am going to", "am going to be", "would", "will"],
        correctIndex: 3,
        explanation: "'Will' for spontaneous decisions made at the moment of speaking.",
      },
      {
        id: "1-2",
        prompt: "I've already booked my ticket. I ___ visit Paris next summer.",
        options: ["will visit", "am going to visit", "will be visiting", "visit"],
        correctIndex: 1,
        explanation: "'Going to' for pre-planned decisions — the ticket is already booked.",
      },
      {
        id: "1-3",
        prompt: "Look at those dark clouds — it ___ rain.",
        options: ["will be going to", "rains", "is going to", "will"],
        correctIndex: 2,
        explanation: "'Going to' with present evidence (visible clouds) predicting immediate future.",
      },
      {
        id: "1-4",
        prompt: "A: 'We've run out of coffee.' B: 'Don't worry, I ___ buy some on my way home.'",
        options: ["will", "am going to", "am going to be", "would be"],
        correctIndex: 0,
        explanation: "'Will' for a spontaneous offer made in response to new information.",
      },
      {
        id: "1-5",
        prompt: "She ___ start her own company next year — she's been preparing for months.",
        options: ["will", "will be", "would", "is going to"],
        correctIndex: 3,
        explanation: "'Going to' for a pre-planned intention — months of preparation confirm the plan.",
      },
      {
        id: "1-6",
        prompt: "They ___ renovate the kitchen — they've hired a contractor.",
        options: ["are going to renovate", "will renovate", "will be renovating", "renovate"],
        correctIndex: 0,
        explanation: "'Going to' — they have already hired a contractor, confirming the plan.",
      },
      {
        id: "1-7",
        prompt: "I promise I ___ help you move house this weekend.",
        options: ["am going to", "am going to be", "will", "would"],
        correctIndex: 2,
        explanation: "'Will' for a promise or commitment made at the moment of speaking.",
      },
      {
        id: "1-8",
        prompt: "That box looks very heavy. Be careful — you ___ drop it!",
        options: ["will", "are going to", "will be", "would"],
        correctIndex: 1,
        explanation: "'Going to' — visible evidence (heavy box + current position) predicts an imminent event.",
      },
      {
        id: "1-9",
        prompt: "A: 'Can someone help me with this?' B: 'Sure, I ___ do it for you.'",
        options: ["am going to", "am going to be", "am to", "will"],
        correctIndex: 3,
        explanation: "'Will' for a spontaneous offer in response to a request.",
      },
      {
        id: "1-10",
        prompt: "We ___ get married in June — we've already sent the invitations.",
        options: ["will get", "will be getting", "get", "are going to get"],
        correctIndex: 3,
        explanation: "'Going to' — invitations sent = concrete plan already in motion.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Future Continuous vs Future Simple",
    instructions:
      "Choose Future Continuous (will be + -ing) for actions in progress at a specific future moment, or Future Simple (will + verb) for single events or predictions.",
    questions: [
      {
        id: "2-1",
        prompt: "This time tomorrow, I ___ on the beach in Bali.",
        options: ["will be lying", "will lie", "will have lain", "will have been lying"],
        correctIndex: 0,
        explanation: "Future Continuous: will be lying — in progress at 'this time tomorrow'.",
      },
      {
        id: "2-2",
        prompt: "I ___ you when I land. Just wait for my message.",
        options: ["will be calling", "will have called", "call", "will call"],
        correctIndex: 3,
        explanation: "Future Simple: will call — a single event that happens at landing.",
      },
      {
        id: "2-3",
        prompt: "Don't call at 3 PM — I ___ my presentation then.",
        options: ["will give", "will have given", "will be giving", "give"],
        correctIndex: 2,
        explanation: "Future Continuous: will be giving — in progress at the specific moment (3 PM).",
      },
      {
        id: "2-4",
        prompt: "She ___ the contract once her lawyer has reviewed it.",
        options: ["will sign", "will be signing", "will have signed", "signs"],
        correctIndex: 0,
        explanation: "Future Simple: will sign — a single event that occurs after a condition is met.",
      },
      {
        id: "2-5",
        prompt: "When you arrive, they ___ — so don't make noise.",
        options: ["will sleep", "will be sleeping", "will have slept", "sleep"],
        correctIndex: 1,
        explanation: "Future Continuous: will be sleeping — in progress when you arrive (a future moment).",
      },
      {
        id: "2-6",
        prompt: "I think it ___ tomorrow — the forecast says sunny.",
        options: ["will have warmed up", "warms up", "will be warming up", "will warm up"],
        correctIndex: 3,
        explanation: "Future Simple: will warm up — a general prediction about tomorrow.",
      },
      {
        id: "2-7",
        prompt: "Next month, the team ___ on the new product launch.",
        options: ["will work", "will have worked", "works", "will be working"],
        correctIndex: 3,
        explanation: "Future Continuous: will be working — an ongoing activity throughout next month.",
      },
      {
        id: "2-8",
        prompt: "She ___ the report to the board next Thursday at 10 AM.",
        options: ["will present", "will be presenting", "will have presented", "presents"],
        correctIndex: 1,
        explanation: "Future Continuous: will be presenting — a scheduled ongoing event at 10 AM Thursday.",
      },
      {
        id: "2-9",
        prompt: "I can't meet you at 6 — I ___ yoga at that time.",
        options: ["will do", "will have done", "do", "will be doing"],
        correctIndex: 3,
        explanation: "Future Continuous: will be doing — in progress at the specific time (6 PM).",
      },
      {
        id: "2-10",
        prompt: "Don't worry — everything ___ fine in the end.",
        options: ["will be being", "will be", "will have been", "is going to be being"],
        correctIndex: 1,
        explanation: "Future Simple: will be — a reassuring general prediction.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Future Perfect vs Future Perfect Continuous",
    instructions:
      "Choose Future Perfect (will have + pp) for completed actions/results, or Future Perfect Continuous (will have been + -ing) for duration/ongoing process.",
    questions: [
      {
        id: "3-1",
        prompt: "By noon, she ___ the report. (it's finished, the result exists)",
        options: ["will have finished", "will have been finishing", "will be finishing", "will finish"],
        correctIndex: 0,
        explanation: "Future Perfect: will have finished — completed result by noon.",
      },
      {
        id: "3-2",
        prompt: "By noon, she ___ for six hours. (duration of the process)",
        options: ["will have finished", "will have been working", "will be working", "will work"],
        correctIndex: 1,
        explanation: "FPC: will have been working — six hours of continuous process up to noon.",
      },
      {
        id: "3-3",
        prompt: "By the time he turns 30, he ___ five countries. (visited = count)",
        options: ["will have been visiting", "will be visiting", "will have visited", "visits"],
        correctIndex: 2,
        explanation: "Future Perfect: will have visited — five countries = countable completed result.",
      },
      {
        id: "3-4",
        prompt: "By the time he turns 30, he ___ for over a decade. (decade of travel duration)",
        options: ["will have visited", "will have been travelling", "will be travelling", "travelled"],
        correctIndex: 1,
        explanation: "FPC: will have been travelling — a decade of ongoing travel = duration.",
      },
      {
        id: "3-5",
        prompt: "By the opening ceremony, they ___ the stadium. (the stadium is complete)",
        options: ["will have been building", "will have built", "will be building", "build"],
        correctIndex: 1,
        explanation: "Future Perfect: will have built — the stadium is a completed result.",
      },
      {
        id: "3-6",
        prompt: "By the opening ceremony, the workers ___ for three years. (three years of work)",
        options: ["will have built", "will be working", "worked", "will have been working"],
        correctIndex: 3,
        explanation: "FPC: will have been working — three years of continuous construction.",
      },
      {
        id: "3-7",
        prompt: "I'll be exhausted at the finish line — I ___ for four hours straight.",
        options: ["will have run", "will have been running", "will be running", "run"],
        correctIndex: 1,
        explanation: "FPC: will have been running — four hours of effort explains the exhaustion.",
      },
      {
        id: "3-8",
        prompt: "By the time she retires, she ___ over 10,000 patients. (treating = count)",
        options: ["will have treated", "will have been treating", "will be treating", "treats"],
        correctIndex: 0,
        explanation: "Future Perfect: will have treated — 10,000 patients = measurable completed count.",
      },
      {
        id: "3-9",
        prompt: "By their silver anniversary, they ___ married for 25 years. (duration of marriage)",
        options: ["will have married", "will be married", "will have been married", "married"],
        correctIndex: 2,
        explanation: "FPC: will have been married — 25 years = ongoing duration of the marriage.",
      },
      {
        id: "3-10",
        prompt: "By Friday, he ___ 50 calls this week. (count of completed calls)",
        options: ["will have been making", "will be making", "makes", "will have made"],
        correctIndex: 3,
        explanation: "Future Perfect: will have made — 50 calls = countable completed result.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — All 5 future tenses: choose the right one",
    instructions:
      "All five future forms in one set: will, going to, Future Continuous, Future Perfect, Future Perfect Continuous. Read every sentence carefully for the right clue.",
    questions: [
      {
        id: "4-1",
        prompt: "I've just heard the news — I ___ tell everyone!",
        options: ["am going to tell", "will be telling", "will tell", "will have told"],
        correctIndex: 2,
        explanation: "'Will' — spontaneous reaction to new information.",
      },
      {
        id: "4-2",
        prompt: "She has enrolled in a cooking class. She ___ become a chef someday.",
        options: ["is going to become", "will become", "will be becoming", "will have become"],
        correctIndex: 0,
        explanation: "'Going to' — enrolment = evidence of an existing plan/intention.",
      },
      {
        id: "4-3",
        prompt: "At 9 AM tomorrow, I ___ in a job interview. Please don't call.",
        options: ["will sit", "will be sitting", "will have sat", "am going to sit"],
        correctIndex: 1,
        explanation: "Future Continuous: will be sitting — in progress at 9 AM tomorrow.",
      },
      {
        id: "4-4",
        prompt: "By the time you wake up, I ___ already.",
        options: ["will leave", "will have left", "will be leaving", "am going to leave"],
        correctIndex: 1,
        explanation: "Future Perfect: will have left — completed before the future waking point.",
      },
      {
        id: "4-5",
        prompt: "By retirement, she ___ in this office for 30 years.",
        options: ["will work", "will be working", "will have worked", "will have been working"],
        correctIndex: 3,
        explanation: "FPC: will have been working — 30 years of duration up to retirement.",
      },
      {
        id: "4-6",
        prompt: "This evening, they ___ their final concert at the Royal Albert Hall.",
        options: ["will have performed", "will be performing", "will perform", "will have been performing"],
        correctIndex: 1,
        explanation: "Future Continuous: will be performing — an event in progress throughout 'this evening'.",
      },
      {
        id: "4-7",
        prompt: "Look at him run — he ___ win this race easily.",
        options: ["will be winning", "will have won", "is going to win", "will be going to win"],
        correctIndex: 2,
        explanation: "'Going to' — present evidence (watching him run fast) predicts the outcome.",
      },
      {
        id: "4-8",
        prompt: "By the time the guests arrive, we ___ all the food. (nothing left)",
        options: ["will be eating", "will have been eating", "are going to eat", "will have eaten"],
        correctIndex: 3,
        explanation: "Future Perfect: will have eaten — all food = completed result before guests arrive.",
      },
      {
        id: "4-9",
        prompt: "By next March, the researchers ___ on this project since 2020.",
        options: ["will work", "will have been working", "will be working", "will have worked"],
        correctIndex: 1,
        explanation: "FPC: will have been working since 2020 — duration from a starting point.",
      },
      {
        id: "4-10",
        prompt: "Don't worry — I ___ be at the airport on time. My flight is at 6 PM.",
        options: ["am going to", "will be", "will have been", "will"],
        correctIndex: 3,
        explanation: "'Will' — a simple reassurance/promise about a future state.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "will vs going to",
  2: "FC vs Simple",
  3: "FP vs FPC",
  4: "All 5 Tenses",
};

export default function AllFutureTensesClient() {
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
          <span className="text-slate-700 font-medium">All Future Tenses</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            FPC <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">All Future Tenses</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">C1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions to master all <b>5 future forms</b>: will, going to, Future Continuous, Future Perfect, and Future Perfect Continuous. Can you pick the right one every time?
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
    orange: "bg-orange-100 text-orange-800 border-orange-200",
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

      {/* Summary table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">All 5 future tenses at a glance</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Tense</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Form</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Use</th>
                <th className="px-4 py-2.5 font-black text-slate-700 hidden sm:table-cell">Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Future Simple", "will + verb", "Spontaneous decisions, promises, predictions", "I'll, I think, maybe, probably"],
                ["Going to", "am/is/are going to + verb", "Plans, intentions, evidence-based predictions", "I've decided, look!, already booked"],
                ["Future Continuous", "will be + -ing", "Action in progress at future moment", "at 3 PM, this time tomorrow, while"],
                ["Future Perfect", "will have + past participle", "Completed action before future point", "by [time], before, already"],
                ["Future Perfect Continuous", "will have been + -ing", "Duration up to future point", "for [period], since [point], how long"],
              ].map(([tense, form, use, signal], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700 text-xs">{tense}</td>
                  <td className="px-4 py-2.5 text-violet-700 font-mono text-xs">{form}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{use}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs hidden sm:table-cell">{signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5 mini cards */}
      <div className="space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Quick reference cards</div>

        <div className="rounded-2xl bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-xl bg-yellow-400 px-3 py-1 text-xs font-black text-black">will</span>
            <span className="text-xs font-semibold text-slate-500">Future Simple</span>
          </div>
          <Formula parts={[{ text: "will", color: "yellow" }, { text: "+" }, { text: "base verb", color: "slate" }]} />
          <Ex en="I'll help you. · It will rain tomorrow. · She'll be there." />
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-sky-50 to-white border border-sky-200 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">going to</span>
            <span className="text-xs font-semibold text-slate-500">Plan / Evidence</span>
          </div>
          <Formula parts={[{ text: "am/is/are", color: "sky" }, { text: "going to", color: "sky" }, { text: "base verb", color: "slate" }]} />
          <Ex en="I'm going to study tonight. · Look — it's going to fall!" />
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-white border border-violet-200 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-xl bg-violet-500 px-3 py-1 text-xs font-black text-white">Future Continuous</span>
            <span className="text-xs font-semibold text-slate-500">In progress at a moment</span>
          </div>
          <Formula parts={[{ text: "will be", color: "violet" }, { text: "verb-ing", color: "green" }]} />
          <Ex en="At 9 AM, I will be sitting in my exam. · This time next week, she'll be flying." />
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">Future Perfect</span>
            <span className="text-xs font-semibold text-slate-500">Completed before future point</span>
          </div>
          <Formula parts={[{ text: "will have", color: "yellow" }, { text: "past participle", color: "slate" }]} />
          <Ex en="By noon, she will have finished the report. · He'll have left by 8." />
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-white border border-rose-200 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-xl bg-rose-500 px-3 py-1 text-xs font-black text-white">Future Perfect Continuous</span>
            <span className="text-xs font-semibold text-slate-500">Duration up to future point</span>
          </div>
          <Formula parts={[{ text: "will have been", color: "yellow" }, { text: "verb-ing", color: "green" }, { text: "for / since", color: "violet" }]} />
          <Ex en="By June, I will have been working here for 10 years." />
        </div>
      </div>

      {/* Decision guide */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Decision guide — quick flowchart</div>
        <div className="rounded-2xl bg-slate-50 border border-black/10 p-5 space-y-2.5 text-sm">
          {[
            { q: "Is it spontaneous or a promise?", a: "→ will" },
            { q: "Is there an existing plan or visible evidence?", a: "→ going to" },
            { q: "Is the action in progress at a specific future moment?", a: "→ Future Continuous (will be + -ing)" },
            { q: "Will the action be completed before a future point? (result)", a: "→ Future Perfect (will have + pp)" },
            { q: "Will the action have been going on for a period up to a future point? (duration)", a: "→ FPC (will have been + -ing)" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5DA20] text-xs font-black">{i + 1}</span>
              <div>
                <span className="font-semibold text-slate-700">{item.q}</span>
                <span className="ml-2 font-black text-slate-900">{item.a}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Key tip:</span> Look for time signals first. <b>By + time</b> = Future Perfect or FPC. <b>At + time</b> = Future Continuous. <b>For + period</b> = FPC. <b>Count/number</b> = Future Perfect.
        </div>
      </div>

    </div>
  );
}
