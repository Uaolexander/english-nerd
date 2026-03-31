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
    title: "Exercise 1 — Mixed forms: affirmative, negative, and questions",
    instructions:
      "Choose the correct Future Perfect Continuous form. Some sentences are affirmative, some negative, some questions. Watch the context carefully.",
    questions: [
      {
        id: "1-1",
        prompt: "By next June, she ___ teaching at this school for twenty years.",
        options: ["will have been teaching", "will be teaching", "will have taught", "has been teaching"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been teaching — duration up to a future point.",
      },
      {
        id: "1-2",
        prompt: "Don't worry — by the time we arrive, they ___ waiting for long.",
        options: ["will have been waiting", "won't have been waiting", "will be waiting", "have been waiting"],
        correctIndex: 1,
        explanation: "Negative FPC: won't have been waiting — the wait will be short.",
      },
      {
        id: "1-3",
        prompt: "___ you have been living in London for five years by this Christmas?",
        options: ["Have", "Will", "Would", "Are"],
        correctIndex: 1,
        explanation: "Question form: Will + subject + have been + verb-ing? → Will you have been living…?",
      },
      {
        id: "1-4",
        prompt: "By 2030, he ___ running his own business for a decade.",
        options: ["will have been running", "will be running", "will have run", "had been running"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been running — emphasises duration up to 2030.",
      },
      {
        id: "1-5",
        prompt: "She ___ studying for long — she only started an hour ago.",
        options: ["will have been studying", "won't have been studying", "will be studying", "has studied"],
        correctIndex: 1,
        explanation: "Negative FPC: won't have been studying for long because she started recently.",
      },
      {
        id: "1-6",
        prompt: "___ they have been working on this project for three months by Friday?",
        options: ["Have", "Are", "Will", "Would"],
        correctIndex: 2,
        explanation: "Question: Will they have been working…? — future duration question.",
      },
      {
        id: "1-7",
        prompt: "By the time you read this, I ___ travelling around the world for six months.",
        options: ["will have been travelling", "will be travelling", "have been travelling", "will have travelled"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been travelling — duration up to the reading moment.",
      },
      {
        id: "1-8",
        prompt: "He ___ practising long enough — he skipped most rehearsals.",
        options: ["will have been practising", "won't have been practising", "will be practising", "has been practising"],
        correctIndex: 1,
        explanation: "Negative FPC: won't have been practising — he skipped rehearsals so the duration is insufficient.",
      },
      {
        id: "1-9",
        prompt: "How long ___ she have been waiting by the time the doctor calls her name?",
        options: ["has", "will", "would", "is"],
        correctIndex: 1,
        explanation: "How long will she have been waiting? — the question word 'will' signals FPC question.",
      },
      {
        id: "1-10",
        prompt: "By midnight, they ___ dancing for five hours straight.",
        options: ["will have been dancing", "will be dancing", "will have danced", "are dancing"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been dancing — ongoing duration up to midnight.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — -ing spelling and duration triggers: for / since",
    instructions:
      "Choose the correctly spelled -ing form and the right auxiliary to complete each Future Perfect Continuous sentence. Pay attention to for/since signals.",
    questions: [
      {
        id: "2-1",
        prompt: "By summer, I will have been ___ English for three years.",
        options: ["studing", "studying", "studiing", "study"],
        correctIndex: 1,
        explanation: "study → studying: -y ending after consonant — just add -ing. Duration with 'for'.",
      },
      {
        id: "2-2",
        prompt: "___ she have been running for an hour by the time we arrive?",
        options: ["Has", "Will", "Is", "Would"],
        correctIndex: 1,
        explanation: "Question: Will she have been running…? — Will signals future perfect continuous question.",
      },
      {
        id: "2-3",
        prompt: "By noon, he will have been ___ for three hours straight.",
        options: ["runing", "runned", "running", "ran"],
        correctIndex: 2,
        explanation: "run → running: CVC pattern — double the final consonant before -ing.",
      },
      {
        id: "2-4",
        prompt: "By December, she ___ working here since 2019.",
        options: ["will have been", "won't have been", "will be", "has been"],
        correctIndex: 0,
        explanation: "Affirmative FPC with 'since': will have been working since a starting point.",
      },
      {
        id: "2-5",
        prompt: "They ___ waiting for long — we arrive just a few minutes after them.",
        options: ["will have been", "won't have been", "will be", "had been"],
        correctIndex: 1,
        explanation: "Negative FPC: won't have been waiting for long — the gap is small.",
      },
      {
        id: "2-6",
        prompt: "By March, I will have been ___ this novel for six months.",
        options: ["writeing", "writting", "writing", "written"],
        correctIndex: 2,
        explanation: "write → writing: drop final -e, then add -ing.",
      },
      {
        id: "2-7",
        prompt: "How long ___ you have been living here by your tenth anniversary?",
        options: ["have", "will", "are", "would"],
        correctIndex: 1,
        explanation: "How long will you have been living…? — question form of FPC.",
      },
      {
        id: "2-8",
        prompt: "By the time she retires, she will have been ___ since 1998.",
        options: ["teaching", "teacheing", "teachhing", "teaches"],
        correctIndex: 0,
        explanation: "teach → teaching: regular -ing, no doubling. Since 1998 = starting point.",
      },
      {
        id: "2-9",
        prompt: "He ___ sleeping for more than six hours by 6 AM — he went to bed at midnight.",
        options: ["will have been", "won't have been", "will be", "has been"],
        correctIndex: 0,
        explanation: "Affirmative: will have been sleeping — six hours from midnight to 6 AM.",
      },
      {
        id: "2-10",
        prompt: "By Friday, will they have been ___ on this report for a full week?",
        options: ["work", "worked", "working", "works"],
        correctIndex: 2,
        explanation: "will have been + working: present participle required after 'have been'.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Negatives, short answers, and question responses",
    instructions:
      "Choose the correct negative form, question structure, or short answer. Mix of won't have been, Will…? and Yes/No responses.",
    questions: [
      {
        id: "3-1",
        prompt: "By Friday, he ___ working here for long — he only started on Monday.",
        options: ["will have been", "won't have been", "will be", "had been"],
        correctIndex: 1,
        explanation: "Negative FPC: won't have been working for long — very short time in the job.",
      },
      {
        id: "3-2",
        prompt: "Will she have been living there for ten years by then? — 'Yes, ___.'",
        options: ["she will be", "she has", "she will", "she would"],
        correctIndex: 2,
        explanation: "Short affirmative answer: Yes, she will. (No need to repeat have been living.)",
      },
      {
        id: "3-3",
        prompt: "___ we have been waiting here for over an hour by the time the bus arrives?",
        options: ["Have", "Are", "Will", "Would"],
        correctIndex: 2,
        explanation: "Question: Will we have been waiting…? — Will starts the FPC question.",
      },
      {
        id: "3-4",
        prompt: "Will he have been training for long by competition day? — 'No, ___.'",
        options: ["he won't be", "he hasn't", "he won't", "he won't have been"],
        correctIndex: 2,
        explanation: "Short negative answer: No, he won't. (Short for he won't have been training long.)",
      },
      {
        id: "3-5",
        prompt: "They ___ rehearsing long when the director arrives — it just started.",
        options: ["will have been", "won't have been", "will be", "are"],
        correctIndex: 1,
        explanation: "Negative FPC: won't have been rehearsing — just started, very short duration.",
      },
      {
        id: "3-6",
        prompt: "Will you have been studying French for five years by graduation? — 'Yes, ___.'",
        options: ["I will be", "I have", "I will", "I would"],
        correctIndex: 2,
        explanation: "Short affirmative: Yes, I will. Confirms duration up to future graduation.",
      },
      {
        id: "3-7",
        prompt: "By the time the concert ends, the band ___ playing for three hours.",
        options: ["will have been", "won't have been", "will be", "has been"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been playing — ongoing three-hour performance.",
      },
      {
        id: "3-8",
        prompt: "___ the team have been working on this bug for a week by the sprint review?",
        options: ["Have", "Will", "Are", "Would"],
        correctIndex: 1,
        explanation: "Question: Will the team have been working…? — FPC question structure.",
      },
      {
        id: "3-9",
        prompt: "She ___ sleeping well lately — she looks exhausted. (prediction about the past week)",
        options: ["will have been", "won't have been", "will be", "has been"],
        correctIndex: 1,
        explanation: "Negative FPC: won't have been sleeping well — evidenced by exhaustion.",
      },
      {
        id: "3-10",
        prompt: "Will they have been travelling for 24 hours by the time they land? — 'Yes, ___.'",
        options: ["they will be", "they have", "they will", "they had"],
        correctIndex: 2,
        explanation: "Short answer: Yes, they will. Confirms the 24-hour duration up to landing.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — All forms mixed: complex sentences",
    instructions:
      "All three Future Perfect Continuous forms (affirmative, negative, question) in complex sentences with by / by the time / for / since. Choose carefully.",
    questions: [
      {
        id: "4-1",
        prompt: "By the time you arrive at the party, I ___ cooking for four hours.",
        options: ["will have been cooking", "will be cooking", "will have cooked", "am cooking"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been cooking — ongoing duration until your arrival.",
      },
      {
        id: "4-2",
        prompt: "She ___ waiting long by the time we get there — she just left the office.",
        options: ["will have been", "won't have been", "will be", "has been"],
        correctIndex: 1,
        explanation: "Negative FPC: won't have been waiting long — she only just left.",
      },
      {
        id: "4-3",
        prompt: "___ the children have been playing outside for two hours by dinner time?",
        options: ["Have", "Are", "Will", "Do"],
        correctIndex: 2,
        explanation: "Question: Will the children have been playing…? — FPC question form.",
      },
      {
        id: "4-4",
        prompt: "By 2035, this university ___ educating students since 1885.",
        options: ["will have been educating", "will be educating", "will have educated", "has been educating"],
        correctIndex: 0,
        explanation: "Affirmative FPC with 'since': will have been educating since 1885 — 150-year duration.",
      },
      {
        id: "4-5",
        prompt: "He ___ exercising for long — he only does five minutes a day.",
        options: ["will have been", "won't have been", "will be", "has been"],
        correctIndex: 1,
        explanation: "Negative FPC: won't have been exercising for long — five minutes is minimal.",
      },
      {
        id: "4-6",
        prompt: "By next autumn, how long ___ she have been learning to drive?",
        options: ["has", "will", "is", "would"],
        correctIndex: 1,
        explanation: "Question with 'how long': will she have been learning — FPC question.",
      },
      {
        id: "4-7",
        prompt: "By the time the documentary ends, we ___ watching it for three hours.",
        options: ["will have been watching", "will be watching", "have been watching", "will have watched"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been watching — duration up to the end of the documentary.",
      },
      {
        id: "4-8",
        prompt: "They ___ working together for long by the time the project is reviewed.",
        options: ["will have been", "won't have been", "are", "will be"],
        correctIndex: 1,
        explanation: "Negative FPC: won't have been working together for long — new partnership.",
      },
      {
        id: "4-9",
        prompt: "___ your parents have been living in that house for forty years by next spring?",
        options: ["Have", "Will", "Are", "Do"],
        correctIndex: 1,
        explanation: "Question: Will your parents have been living…? — FPC question with 'by'.",
      },
      {
        id: "4-10",
        prompt: "By the end of the marathon, the lead runner ___ running for just over two hours.",
        options: ["will have been running", "will be running", "will have run", "has been running"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been running — emphasises the two-hour duration of effort.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Mixed Forms",
  2: "-ing Spelling",
  3: "Negatives & Answers",
  4: "All Forms Mixed",
};

export default function WillHaveBeenIngClient() {
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
          <span className="text-slate-700 font-medium">will have been + -ing</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            FPC <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">will have been + -ing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">C1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions to master <b>will have been + -ing</b>: form the Future Perfect Continuous correctly across positive, negative, and question structures.
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
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "for / since", color: "violet" },
            { text: "duration", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By June, I will have been working here for 10 years." />
            <Ex en="She will have been studying medicine since 2020 by the time she qualifies." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't have been", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: "for long", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Don't worry — they won't have been waiting for long when we arrive." />
            <Ex en="He won't have been sleeping more than two hours by morning." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "for / since?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you have been working there for five years by December?" />
            <Ex en="How long will she have been learning piano by the recital?" />
          </div>
        </div>
      </div>

      {/* Usage section */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Future Perfect Continuous</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Use</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Duration up to future point", "By 2030, she will have been running the company for 15 years."],
                ["Emphasise effort/process", "He'll have been training all year for this race."],
                ["How long questions", "How long will you have been living there by then?"],
                ["Cause of future state", "I'll be exhausted — I'll have been driving for 8 hours."],
              ].map(([use, ex], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{use}</td>
                  <td className="px-4 py-2.5 text-slate-600 font-mono text-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FPC vs FP comparison */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">FPC vs Future Perfect — process vs result</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-emerald-700">Future Perfect Continuous</th>
                <th className="px-4 py-2.5 font-black text-sky-700">Future Perfect Simple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I will have been writing for 3 hours. (process, effort)", "I will have written 3 chapters. (count, completion)"],
                ["She'll have been running (the activity matters)", "She'll have run 10 km (the result matters)"],
                ["They will have been building the road for 2 years.", "They will have built the road. (it's finished)"],
              ].map(([fpc, fp], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{fpc}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{fp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signal words */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Key signal words</div>
        <div className="flex flex-wrap gap-2">
          {["by [time]", "by the time", "for [duration]", "since [starting point]", "how long", "all day / all week", "for ages"].map((w) => (
            <span key={w} className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-1.5 text-xs font-black text-yellow-800">{w}</span>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Stative verb warning:</span> Verbs like <b>know, believe, want, love, understand</b> cannot take continuous form. Use Future Perfect Simple instead: "By then, I will have known her for 10 years." ✅
        </div>
      </div>

      {/* -ing spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Rule</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Most verbs — add -ing", "work → working, play → playing, eat → eating"],
                ["End in -e — drop -e + add -ing", "write → writing, live → living, dance → dancing"],
                ["Short CVC — double final consonant", "run → running, swim → swimming, sit → sitting"],
                ["End in -ie — change to -y + add -ing", "die → dying, lie → lying, tie → tying"],
                ["End in -y — just add -ing", "study → studying, play → playing"],
              ].map(([rule, ex], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{rule}</td>
                  <td className="px-4 py-2.5 text-slate-600 font-mono text-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
