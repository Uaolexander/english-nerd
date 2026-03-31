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
    title: "Exercise 1 — Mixed forms: will have / won't have / Will…have?",
    instructions:
      "Choose the correct Future Perfect form: affirmative (will have + pp), negative (won't have + pp), or question (Will + subject + have + pp?). Watch the context clues.",
    questions: [
      {
        id: "1-1",
        prompt: "By Friday, she ___ finished the whole report.",
        options: ["will have", "won't have", "will be having", "has"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have + past participle'. By Friday = deadline before which it will be complete.",
      },
      {
        id: "1-2",
        prompt: "By the time you arrive, they ___ eaten all the food.",
        options: ["will have", "won't have", "will be", "have"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have eaten'. The eating will be completed before you arrive.",
      },
      {
        id: "1-3",
        prompt: "He ___ submitted his application by the deadline — he always leaves things late.",
        options: ["will have", "won't have", "will be having", "has"],
        correctIndex: 1,
        explanation: "Negative: 'won't have submitted'. 'He always leaves things late' signals it won't be done.",
      },
      {
        id: "1-4",
        prompt: "___ you have completed the course by July?",
        options: ["Have", "Do", "Will", "Are"],
        correctIndex: 2,
        explanation: "Question form: 'Will + subject + have + past participle?' — Will you have completed?",
      },
      {
        id: "1-5",
        prompt: "By next year, the company ___ launched three new products.",
        options: ["will have", "won't have", "will be", "launches"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have launched'. By next year = deadline by which the launches will be complete.",
      },
      {
        id: "1-6",
        prompt: "Don't worry — by the time the guests arrive, I ___ prepared everything.",
        options: ["won't have", "will have", "will be", "am"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have prepared'. Reassurance that preparation will be complete before the guests come.",
      },
      {
        id: "1-7",
        prompt: "They ___ solved the problem by then — it's far too complex.",
        options: ["will have", "won't have", "are going to have", "have"],
        correctIndex: 1,
        explanation: "Negative: 'won't have solved'. 'It's far too complex' signals it won't be done in time.",
      },
      {
        id: "1-8",
        prompt: "___ she have recovered fully by the race day?",
        options: ["Has", "Does", "Will", "Is"],
        correctIndex: 2,
        explanation: "Question: 'Will + subject + have + past participle?' — Will she have recovered?",
      },
      {
        id: "1-9",
        prompt: "By 10 PM, we ___ watched three episodes already.",
        options: ["won't have", "will have", "are", "have been"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have watched'. By 10 PM = the watching will be complete.",
      },
      {
        id: "1-10",
        prompt: "I ___ forgotten everything by the exam — I need to revise!",
        options: ["will have", "won't have", "will be", "have"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have forgotten'. The speaker fears forgetting everything before the exam.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Choose the correct past participle",
    instructions:
      "Each sentence uses Future Perfect. Choose the correct past participle to complete the structure 'will have + ___'. Watch for irregular verbs.",
    questions: [
      {
        id: "2-1",
        prompt: "By next month, she will have ___ (write) her whole dissertation.",
        options: ["wrote", "writed", "written", "writing"],
        correctIndex: 2,
        explanation: "write → written. Irregular past participle.",
      },
      {
        id: "2-2",
        prompt: "They will have ___ (finish) the construction by December.",
        options: ["finish", "finishing", "finished", "finishen"],
        correctIndex: 2,
        explanation: "finish → finished. Regular past participle: add -ed.",
      },
      {
        id: "2-3",
        prompt: "He won't have ___ (eat) before the meeting — he never does.",
        options: ["ate", "eaten", "eat", "eating"],
        correctIndex: 1,
        explanation: "eat → eaten. Irregular past participle.",
      },
      {
        id: "2-4",
        prompt: "Will you have ___ (speak) to the manager before Monday?",
        options: ["spoke", "spoken", "speaked", "speaking"],
        correctIndex: 1,
        explanation: "speak → spoken. Irregular past participle.",
      },
      {
        id: "2-5",
        prompt: "By tomorrow, I will have ___ (send) all the invitations.",
        options: ["send", "sended", "sent", "sending"],
        correctIndex: 2,
        explanation: "send → sent. Irregular past participle.",
      },
      {
        id: "2-6",
        prompt: "She won't have ___ (choose) a venue by then — she's very indecisive.",
        options: ["chose", "chosen", "choose", "choosing"],
        correctIndex: 1,
        explanation: "choose → chosen. Irregular past participle.",
      },
      {
        id: "2-7",
        prompt: "By 2030, scientists will have ___ (make) many new discoveries.",
        options: ["make", "maked", "making", "made"],
        correctIndex: 3,
        explanation: "make → made. Irregular past participle.",
      },
      {
        id: "2-8",
        prompt: "Will they have ___ (build) the bridge by next year?",
        options: ["build", "builded", "building", "built"],
        correctIndex: 3,
        explanation: "build → built. Irregular past participle.",
      },
      {
        id: "2-9",
        prompt: "I will have ___ (take) my driving test three times by then.",
        options: ["took", "taking", "taken", "take"],
        correctIndex: 2,
        explanation: "take → taken. Irregular past participle.",
      },
      {
        id: "2-10",
        prompt: "By Monday, the team won't have ___ (receive) the funds yet.",
        options: ["receive", "receaved", "received", "receiving"],
        correctIndex: 2,
        explanation: "receive → received. Regular past participle: drop -e, add -d.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions and short answers",
    instructions:
      "Choose the correct question form or short answer for Future Perfect. Questions: Will + subject + have + pp? Short answers: Yes, [subject] will. / No, [subject] won't.",
    questions: [
      {
        id: "3-1",
        prompt: "\"Will they have arrived by 9 PM?\" — \"Yes, ___\"",
        options: ["they have.", "they will.", "they do.", "they will have."],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, they will. (just the modal, no need to repeat 'have + pp')",
      },
      {
        id: "3-2",
        prompt: "\"Will she have finished by then?\" — \"No, ___\"",
        options: ["she hasn't.", "she doesn't.", "she won't.", "she isn't."],
        correctIndex: 2,
        explanation: "Short negative: No, she won't.",
      },
      {
        id: "3-3",
        prompt: "___ you have submitted the form by the deadline?",
        options: ["Have", "Do", "Will", "Are"],
        correctIndex: 2,
        explanation: "Future Perfect question: Will + subject + have + past participle?",
      },
      {
        id: "3-4",
        prompt: "\"Will the builders have completed the roof by next week?\" — \"Yes, ___\"",
        options: ["they have.", "they will.", "they do.", "they completed."],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, they will.",
      },
      {
        id: "3-5",
        prompt: "Will ___ have read the document before the meeting?",
        options: ["them", "they", "their", "theirs"],
        correctIndex: 1,
        explanation: "Will + subject (they) + have + pp. Subject pronoun after 'Will'.",
      },
      {
        id: "3-6",
        prompt: "\"Will you have packed your bags by 6 AM?\" — \"No, ___\"",
        options: ["I haven't.", "I won't.", "I didn't.", "I don't."],
        correctIndex: 1,
        explanation: "Short negative: No, I won't.",
      },
      {
        id: "3-7",
        prompt: "___ he have gone to bed by the time we get back?",
        options: ["Has", "Does", "Will", "Is"],
        correctIndex: 2,
        explanation: "Future Perfect question: Will + subject + have + pp?",
      },
      {
        id: "3-8",
        prompt: "\"Will the company have reached its target by December?\" — \"Yes, ___\"",
        options: ["it has.", "it will.", "it does.", "it reached."],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, it will.",
      },
      {
        id: "3-9",
        prompt: "\"Will you have learned all the vocabulary by Friday?\" — \"No, ___\"",
        options: ["I haven't.", "I didn't.", "I don't.", "I won't."],
        correctIndex: 3,
        explanation: "Short negative: No, I won't.",
      },
      {
        id: "3-10",
        prompt: "Will she have ___ all her exams by June?",
        options: ["pass", "passing", "passed", "past"],
        correctIndex: 2,
        explanation: "Will + subject + have + past participle: Will she have passed all her exams?",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — All Future Perfect forms mixed",
    instructions:
      "This mixed set covers affirmative, negative and question forms of Future Perfect. Also watch for distractors like Future Perfect Continuous (will have been + -ing) and Future Simple (will + base).",
    questions: [
      {
        id: "4-1",
        prompt: "By the time he retires, he ___ worked here for 40 years.",
        options: ["will have", "won't have", "will be having", "has"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have worked'. By [future time] = deadline before which the action is complete.",
      },
      {
        id: "4-2",
        prompt: "She ___ completed the training by Monday — there's too much left.",
        options: ["will have", "won't have", "will be", "has"],
        correctIndex: 1,
        explanation: "Negative: 'won't have completed'. 'There's too much left' confirms it won't be done in time.",
      },
      {
        id: "4-3",
        prompt: "___ the team have solved the problem before the presentation?",
        options: ["Have", "Has", "Will", "Do"],
        correctIndex: 2,
        explanation: "Question: 'Will + subject + have + pp?' — Will the team have solved…?",
      },
      {
        id: "4-4",
        prompt: "I ___ read this book three times by next year.",
        options: ["won't have", "will have", "will be", "am going to"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have read'. Future Perfect for a completed action before a future time.",
      },
      {
        id: "4-5",
        prompt: "By the time the film ends, you ___ eaten all the popcorn!",
        options: ["will have", "won't have", "have been", "will be"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have eaten'. The eating will be complete before/by the time the film ends.",
      },
      {
        id: "4-6",
        prompt: "They ___ finished negotiating by noon — the talks are expected to go on all day.",
        options: ["will have", "won't have", "will be having", "have"],
        correctIndex: 1,
        explanation: "Negative: 'won't have finished'. The talks are expected to continue all day.",
      },
      {
        id: "4-7",
        prompt: "___ you have saved enough money by the end of the year?",
        options: ["Have", "Do", "Will", "Are"],
        correctIndex: 2,
        explanation: "Question: Will + subject + have + pp? — Will you have saved?",
      },
      {
        id: "4-8",
        prompt: "By 2030, renewable energy ___ replaced most fossil fuels in this country.",
        options: ["won't have", "will have", "will be", "is going to"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have replaced'. By 2030 = deadline before which replacement will be complete.",
      },
      {
        id: "4-9",
        prompt: "I ___ forget to call her — I've set a reminder.",
        options: ["will have", "won't have", "will", "won't"],
        correctIndex: 3,
        explanation: "Future Simple negative: 'won't forget'. This is a promise/reassurance, not Future Perfect.",
      },
      {
        id: "4-10",
        prompt: "By the time the rescue team arrives, she ___ been waiting for six hours.",
        options: ["will have", "won't have", "will be", "has"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have been waiting' (Future Perfect Continuous — but here the option 'will have' pairs with 'been waiting' making it FPC). The waiting will be complete/ongoing by that future point.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Mixed forms",
  2: "Past participle",
  3: "Questions",
  4: "All forms",
};

export default function WillHavePastParticipleClient() {
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
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect">Future Perfect</a><span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">will have + participle</span>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Future Perfect <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">will have + participle</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Upper-intermediate</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B2</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">40 questions to master will have + past participle: form, use, and choosing correct participles.</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <aside className="hidden lg:block"><div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4"><div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div><div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div></div></aside>
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
                          <div><div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div><div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div></div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden"><div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} /></div>
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (<Explanation />)}
            </div>
          </section>
          <aside className="hidden lg:block"><div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4"><div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div><div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div></div></aside>
        </div>
        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4"><div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div><div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div></div>
        <div className="mt-10 flex items-center gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-perfect" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Perfect exercises</a>
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
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will have", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By Friday, she will have finished the report." />
            <Ex en="By 2030, they will have built the new station." />
            <Ex en="Contractions: I'll have, you'll have, he'll have, she'll have" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't have", color: "red" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She won't have arrived by then — her flight is late." />
            <Ex en="They won't have solved it in time." />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "have", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you have finished by noon?" />
            <Ex en="Will she have left by the time we arrive?" />
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will have is the SAME for all subjects</div>
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
                ["I", "will have finished", "won't have finished"],
                ["You", "will have finished", "won't have finished"],
                ["He / She / It ★", "will have finished", "won't have finished"],
                ["We / They", "will have finished", "won't have finished"],
              ].map(([subj, aff, neg], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> &quot;will have&quot; is invariable — no &quot;has&quot; for he/she/it!
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Future Perfect vs Future Simple</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-emerald-700">Future Perfect</th>
                <th className="px-4 py-2.5 font-black text-sky-700">Future Simple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Completed before a future point", "Happens at / around that time"],
                ["By Friday she will have finished.", "She will finish on Friday."],
                ["Trigger: by [time], by the time", "Trigger: tomorrow, next week, soon"],
              ].map((row, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{row[0]}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Signal words for Future Perfect</div>
        <div className="flex flex-wrap gap-2">
          {["by [time]", "by then", "by the time…", "before…", "by next week", "by 2030", "already (by that point)", "by the end of…"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
