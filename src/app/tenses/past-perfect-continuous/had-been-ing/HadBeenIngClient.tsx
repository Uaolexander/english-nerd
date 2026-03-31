"use client";
import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

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
    title: "Set 1 — Mixed Forms: had / hadn't / Had been",
    instructions:
      "Choose the correct auxiliary or question form. The set mixes affirmative (had been), negative (hadn't been), and question forms (Had … been).",
    questions: [
      {
        id: "h1-1",
        prompt: "She ___ been waiting for over an hour when the bus arrived.",
        options: ["had", "has", "hadn't", "was"],
        correctIndex: 0,
        explanation: "had been waiting — affirmative PPC: had + been + -ing.",
      },
      {
        id: "h1-2",
        prompt: "He ___ been sleeping well — that's why he was so tired.",
        options: ["had", "hadn't", "Has", "wasn't"],
        correctIndex: 1,
        explanation: "hadn't been sleeping — negative PPC explains past tiredness.",
      },
      {
        id: "h1-3",
        prompt: "___ they been arguing before you arrived?",
        options: ["Were", "Had", "Have", "Did"],
        correctIndex: 1,
        explanation: "Had they been arguing? — PPC question: Had + subject + been + -ing.",
      },
      {
        id: "h1-4",
        prompt: "The ground was wet because it ___ been raining.",
        options: ["has", "hadn't", "had", "was"],
        correctIndex: 2,
        explanation: "had been raining — affirmative PPC explains the wet ground.",
      },
      {
        id: "h1-5",
        prompt: "___ she been crying before the interview?",
        options: ["Was", "Had", "Has", "Did"],
        correctIndex: 1,
        explanation: "Had she been crying? — PPC question form.",
      },
      {
        id: "h1-6",
        prompt: "They ___ been practising — and it showed in the performance.",
        options: ["hadn't", "had", "Have", "were"],
        correctIndex: 1,
        explanation: "had been practising — affirmative PPC; the good performance proves they had been practising.",
      },
      {
        id: "h1-7",
        prompt: "He ___ been eating properly, so he felt weak.",
        options: ["had", "hadn't", "Has", "wasn't"],
        correctIndex: 1,
        explanation: "hadn't been eating — negative PPC; lack of eating explains feeling weak.",
      },
      {
        id: "h1-8",
        prompt: "___ you been waiting long when the doctor called you in?",
        options: ["Were", "Have", "Had", "Did"],
        correctIndex: 2,
        explanation: "Had you been waiting? — PPC question about a past duration.",
      },
      {
        id: "h1-9",
        prompt: "By the time she graduated, she ___ been studying for four years.",
        options: ["has", "hadn't", "have", "had"],
        correctIndex: 3,
        explanation: "had been studying — affirmative PPC with 'for' for total duration.",
      },
      {
        id: "h1-10",
        prompt: "I ___ been paying attention, so I missed the announcement.",
        options: ["had", "hadn't", "Has", "wasn't"],
        correctIndex: 1,
        explanation: "hadn't been paying — negative PPC explains missing the announcement.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Choosing the Correct -ing Form",
    instructions:
      "Choose the correctly spelled -ing form to complete each Past Perfect Continuous sentence.",
    questions: [
      {
        id: "h2-1",
        prompt: "She had been ___ in the pool for 30 minutes.",
        options: ["swimm", "swiming", "swimming", "swimmed"],
        correctIndex: 2,
        explanation: "swimming — swim → swimming (double m: short vowel + single consonant).",
      },
      {
        id: "h2-2",
        prompt: "He had been ___ his essay all morning.",
        options: ["writeing", "writting", "writing", "writen"],
        correctIndex: 2,
        explanation: "writing — write → writing (drop the 'e' before adding -ing).",
      },
      {
        id: "h2-3",
        prompt: "They had been ___ on the sofa for hours.",
        options: ["lieing", "laying", "lying", "lie-ing"],
        correctIndex: 2,
        explanation: "lying — lie → lying (change -ie to -y before adding -ing).",
      },
      {
        id: "h2-4",
        prompt: "She had been ___ in her office since 7 a.m.",
        options: ["siting", "sitting", "sitted", "satting"],
        correctIndex: 1,
        explanation: "sitting — sit → sitting (double t: short vowel + single consonant).",
      },
      {
        id: "h2-5",
        prompt: "He had been ___ to music when the fire alarm went off.",
        options: ["listening", "listning", "listenning", "listining"],
        correctIndex: 0,
        explanation: "listening — listen → listening (just add -ing; no doubling for two-syllable words with stress on first syllable).",
      },
      {
        id: "h2-6",
        prompt: "The children had been ___ in the garden all afternoon.",
        options: ["runing", "running", "runned", "runeing"],
        correctIndex: 1,
        explanation: "running — run → running (double n: short vowel + single consonant).",
      },
      {
        id: "h2-7",
        prompt: "She had been ___ a cake for two hours.",
        options: ["makeing", "making", "makking", "macking"],
        correctIndex: 1,
        explanation: "making — make → making (drop the 'e', add -ing).",
      },
      {
        id: "h2-8",
        prompt: "He had been ___ in the garden since morning.",
        options: ["diging", "digging", "digged", "digeing"],
        correctIndex: 1,
        explanation: "digging — dig → digging (double g: short vowel + single consonant).",
      },
      {
        id: "h2-9",
        prompt: "They had been ___ about the problem for hours.",
        options: ["arguing", "argueing", "arrguing", "arguying"],
        correctIndex: 0,
        explanation: "arguing — argue → arguing (drop the 'e', add -ing).",
      },
      {
        id: "h2-10",
        prompt: "She had been ___ at the hospital since the accident.",
        options: ["working", "workking", "workeing", "workning"],
        correctIndex: 0,
        explanation: "working — work → working (just add -ing; no doubling needed).",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — had been doing vs was/were doing (PPC vs Past Continuous)",
    instructions:
      "Choose between Past Perfect Continuous (had been doing) and Past Continuous (was/were doing) based on context.",
    questions: [
      {
        id: "h3-1",
        prompt: "When I called her, she ___ in the garden. (at that exact moment)",
        options: ["had been working", "was working", "had worked", "worked"],
        correctIndex: 1,
        explanation: "was working — Past Continuous for an action in progress at the exact moment of the call.",
      },
      {
        id: "h3-2",
        prompt: "She was tired because she ___ all day. (duration causing result)",
        options: ["was working", "worked", "had been working", "had worked"],
        correctIndex: 2,
        explanation: "had been working — PPC; the day-long activity explains the tiredness.",
      },
      {
        id: "h3-3",
        prompt: "He ___ when the phone rang, so he didn't hear it. (in progress at that moment)",
        options: ["had been showering", "showered", "was showering", "had showered"],
        correctIndex: 2,
        explanation: "was showering — Past Continuous for an action in progress when another event interrupted.",
      },
      {
        id: "h3-4",
        prompt: "By the time she arrived, I ___ for two hours. (duration before arrival)",
        options: ["was waiting", "waited", "had waited", "had been waiting"],
        correctIndex: 3,
        explanation: "had been waiting — PPC with 'by the time' and duration (two hours).",
      },
      {
        id: "h3-5",
        prompt: "While she ___, the children sneaked out. (background, interrupted action)",
        options: ["had been sleeping", "slept", "had slept", "was sleeping"],
        correctIndex: 3,
        explanation: "was sleeping — Past Continuous for a background action interrupted by another event.",
      },
      {
        id: "h3-6",
        prompt: "His hands were dirty because he ___ in the garden. (result from past activity)",
        options: ["was digging", "dug", "had been digging", "had dug"],
        correctIndex: 2,
        explanation: "had been digging — PPC; the dirty hands are the result of a completed ongoing activity.",
      },
      {
        id: "h3-7",
        prompt: "At 3 p.m. yesterday, she ___ a report. (specific time in the past)",
        options: ["had been writing", "had written", "wrote", "was writing"],
        correctIndex: 3,
        explanation: "was writing — Past Continuous for an action in progress at a specific past time.",
      },
      {
        id: "h3-8",
        prompt: "He looked exhausted because he ___ for 10 hours straight. (duration before past moment)",
        options: ["was driving", "drove", "had been driving", "had driven"],
        correctIndex: 2,
        explanation: "had been driving — PPC with duration (10 hours) explains the exhaustion.",
      },
      {
        id: "h3-9",
        prompt: "I saw him when I left — he ___ outside my window.",
        options: ["had been standing", "had stood", "stands", "was standing"],
        correctIndex: 3,
        explanation: "was standing — Past Continuous for an action in progress when you saw him.",
      },
      {
        id: "h3-10",
        prompt: "The kitchen smelled of smoke because she ___ for hours. (result of past activity)",
        options: ["was cooking", "cooked", "had cooked", "had been cooking"],
        correctIndex: 3,
        explanation: "had been cooking — PPC; hours of cooking caused the lingering smell.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Set 4 — Mixed All Forms + Common Confusers",
    instructions:
      "Choose the correct form. Options mix PPC, Past Continuous, Past Perfect, and Present Perfect Continuous. Read context clues carefully.",
    questions: [
      {
        id: "h4-1",
        prompt: "How long ___ you been learning English?",
        options: ["are", "were", "had", "have"],
        correctIndex: 2,
        explanation: "How long had you been learning? — PPC question; the past reference means 'had', not 'have'.",
      },
      {
        id: "h4-2",
        prompt: "She said she ___ been trying to contact him all morning.",
        options: ["has", "had", "was", "is"],
        correctIndex: 1,
        explanation: "had been trying — PPC in reported speech (backshift from 'has been trying').",
      },
      {
        id: "h4-3",
        prompt: "By the time the meeting started, I ___ for 45 minutes.",
        options: ["was waiting", "have been waiting", "had been waiting", "waited"],
        correctIndex: 2,
        explanation: "had been waiting — PPC with 'by the time' and duration before a past event.",
      },
      {
        id: "h4-4",
        prompt: "She ___ been working there since 2015. (She still works there now.)",
        options: ["had", "has", "was", "is"],
        correctIndex: 1,
        explanation: "has been working — Present Perfect Continuous for duration up to NOW (not a past point).",
      },
      {
        id: "h4-5",
        prompt: "___ they been waiting long when you got there? (past context)",
        options: ["Have", "Were", "Had", "Are"],
        correctIndex: 2,
        explanation: "Had they been waiting? — PPC question about duration before another past event.",
      },
      {
        id: "h4-6",
        prompt: "I ___ been feeling well, so I decided to stay home.",
        options: ["hadn't", "hasn't", "wasn't", "am not"],
        correctIndex: 0,
        explanation: "hadn't been feeling — negative PPC explains the past decision to stay home.",
      },
      {
        id: "h4-7",
        prompt: "The phone died because he ___ it all day.",
        options: ["uses", "used", "has been using", "had been using"],
        correctIndex: 3,
        explanation: "had been using — PPC; hours of use drained the battery (completed past duration).",
      },
      {
        id: "h4-8",
        prompt: "At that moment, he ___ on the project for three days without a break.",
        options: ["works", "has been working", "had been working", "worked"],
        correctIndex: 2,
        explanation: "had been working — PPC with duration (three days) at a past reference point.",
      },
      {
        id: "h4-9",
        prompt: "She ___ been paying attention, so she understood everything.",
        options: ["hadn't", "had", "Has", "was"],
        correctIndex: 1,
        explanation: "had been paying — affirmative PPC; she WAS paying attention (explains understanding).",
      },
      {
        id: "h4-10",
        prompt: "He looked pale because he ___ outside all summer.",
        options: ["wasn't working", "hadn't been working", "hasn't been working", "didn't work"],
        correctIndex: 1,
        explanation: "hadn't been working — negative PPC; lack of outdoor activity in the past explains pallor.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Mixed Forms",
  2: "-ing Spelling",
  3: "PPC vs PC",
  4: "Mixed Hard",
};

export default function HadBeenIngClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect-continuous">Past Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">had been + -ing</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              had been + -ing
            </span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">
            Medium
          </span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
            B2
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions focusing on the structure of Past Perfect Continuous: the auxiliary had/hadn&apos;t/Had,
          the particle been, -ing spelling rules, and PPC vs Past Continuous.
        </p>

        {/* Layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>

          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                        <button key={n} onClick={() => switchSet(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))} className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600"><b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
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
                        <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <HadBeenIngExplanation />
              )}
            </div>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>
        </div>

        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/past-perfect-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Past Perfect Continuous</a>
          <a href="/tenses/past-perfect-continuous/for-since-past" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: for vs since →</a>
        </div>
      </div>
    </div>
  );
}

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

function HadBeenIngExplanation() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[{ text: "Subject", color: "sky" }, { text: "had", color: "yellow" }, { text: "been", color: "orange" }, { text: "verb + -ing", color: "green" }, { text: ".", color: "slate" }]} />
          <Ex en="She had been waiting.  ·  They had been studying.  ·  He had been running." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[{ text: "Subject", color: "sky" }, { text: "hadn't", color: "red" }, { text: "been", color: "orange" }, { text: "verb + -ing", color: "green" }, { text: ".", color: "slate" }]} />
          <Ex en="He hadn't been sleeping.  ·  She hadn't been eating properly." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[{ text: "Had", color: "violet" }, { text: "subject", color: "sky" }, { text: "been", color: "orange" }, { text: "verb + -ing", color: "green" }, { text: "?", color: "slate" }]} />
          <Ex en="Had they been waiting?  ·  How long had she been working?  ·  Had it been raining?" />
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing Spelling Rules</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-slate-700">Rule</th>
                <th className="px-4 py-2.5 font-black text-left text-slate-700">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Most verbs: add -ing", "work→working · read→reading · talk→talking"],
                ["Ends in -e: drop e, add -ing", "make→making · write→writing · argue→arguing"],
                ["Short vowel + consonant: double it", "run→running · sit→sitting · swim→swimming · dig→digging"],
                ["Ends in -ie: change to y + -ing", "lie→lying · die→dying · tie→tying"],
              ].map(([rule, ex], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                  <td className="px-4 py-2.5 text-slate-700 font-semibold">{rule}</td>
                  <td className="px-4 py-2.5 text-slate-600 font-mono text-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">PPC vs Past Continuous</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-emerald-700">PPC (had been + -ing)</th>
                <th className="px-4 py-2.5 font-black text-left text-sky-700">Past Continuous (was/were + -ing)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Duration before another past event", "In progress at a specific past moment"],
                ["Explains a past result or state", "Background action / interrupted by another event"],
                ["She had been running (so she was tired)", "She was running when I called"],
                ["Used with for / since / how long", "Used with when / while / at [time]"],
              ].map(([a, b], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                  <td className="px-4 py-2.5 text-slate-700">{a}</td>
                  <td className="px-4 py-2.5 text-slate-700">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-black mb-1">⚠ Stative verbs — no continuous form</div>
        <p>Verbs like <b>know, believe, understand, want, love, hate, need</b> cannot be used in continuous form. Use Past Perfect: <b>She had known him for years</b> (not &ldquo;had been knowing&rdquo;).</p>
      </div>
    </div>
  );
}
