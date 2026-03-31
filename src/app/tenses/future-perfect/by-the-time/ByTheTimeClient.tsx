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
    title: "Exercise 1 — 'by [time]' with mixed affirmative and question forms",
    instructions:
      "Some sentences are affirmative (will have + pp), some are questions (Will subject have + pp?). Watch for the 'by [time]' trigger and the context.",
    questions: [
      {
        id: "1-1",
        prompt: "By Monday, she ___ finished the report.",
        options: ["will have", "won't have", "will be", "has"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have finished'. By Monday = deadline by which the action is complete.",
      },
      {
        id: "1-2",
        prompt: "By the time he arrives, ___ you ___ eaten?",
        options: ["will / have", "are / eating", "do / eat", "have / eaten"],
        correctIndex: 0,
        explanation: "'Will you have eaten?' — Future Perfect question with 'by the time' trigger.",
      },
      {
        id: "1-3",
        prompt: "By 2035, scientists ___ discovered a cure for that disease.",
        options: ["won't have", "will have", "will be", "discover"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have discovered'. By 2035 = a future deadline.",
      },
      {
        id: "1-4",
        prompt: "___ they have left by the time the party starts?",
        options: ["Have", "Do", "Will", "Are"],
        correctIndex: 2,
        explanation: "Question: Will + subject + have + pp? Future Perfect question.",
      },
      {
        id: "1-5",
        prompt: "By the end of the month, she ___ saved enough for the deposit.",
        options: ["will have", "won't have", "will be", "saves"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have saved'. By the end of the month = deadline.",
      },
      {
        id: "1-6",
        prompt: "By next spring, they ___ built the new bridge — the construction is way behind.",
        options: ["will have", "won't have", "will be", "build"],
        correctIndex: 1,
        explanation: "Negative: 'won't have built'. 'Construction is way behind' signals it won't be done in time.",
      },
      {
        id: "1-7",
        prompt: "___ you have read the whole book by Friday?",
        options: ["Have", "Do", "Will", "Are"],
        correctIndex: 2,
        explanation: "Question: Will + subject + have + pp? — Will you have read?",
      },
      {
        id: "1-8",
        prompt: "By the time the ambulance arrives, the patient ___ already received first aid.",
        options: ["won't have", "will have", "will be", "has"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have received'. By the time = a future deadline before which the action is complete.",
      },
      {
        id: "1-9",
        prompt: "___ she have graduated by the time her parents visit in June?",
        options: ["Has", "Does", "Will", "Is"],
        correctIndex: 2,
        explanation: "Question: Will + subject + have + pp?",
      },
      {
        id: "1-10",
        prompt: "By noon, I ___ been on hold for three hours — this is outrageous!",
        options: ["will have", "won't have", "will be", "have"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have been' (Future Perfect for a duration up to a future point). By noon = deadline.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — 'By then' questions with short answers",
    instructions:
      "Complete the question or short answer. Questions use 'Will + subject + have + pp?' Short answers: Yes, [subject] will. / No, [subject] won't.",
    questions: [
      {
        id: "2-1",
        prompt: "\"Will you have finished by then?\" — \"Yes, ___\"",
        options: ["I have.", "I will.", "I do.", "I finished."],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, I will.",
      },
      {
        id: "2-2",
        prompt: "\"Will they have left by then?\" — \"No, ___\"",
        options: ["they haven't.", "they won't.", "they didn't.", "they don't."],
        correctIndex: 1,
        explanation: "Short negative: No, they won't.",
      },
      {
        id: "2-3",
        prompt: "___ he have landed by the time we get to the airport?",
        options: ["Has", "Does", "Will", "Is"],
        correctIndex: 2,
        explanation: "Future Perfect question: Will + subject + have + pp?",
      },
      {
        id: "2-4",
        prompt: "\"Will the renovation have been completed by then?\" — \"Yes, ___\"",
        options: ["it has.", "it will.", "it does.", "it was."],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, it will.",
      },
      {
        id: "2-5",
        prompt: "\"Will you have sent all the emails by then?\" — \"No, ___\"",
        options: ["I haven't.", "I didn't.", "I won't.", "I don't."],
        correctIndex: 2,
        explanation: "Short negative: No, I won't.",
      },
      {
        id: "2-6",
        prompt: "___ the team have reviewed all the applications by Friday?",
        options: ["Have", "Has", "Will", "Do"],
        correctIndex: 2,
        explanation: "Future Perfect question: Will + subject + have + pp?",
      },
      {
        id: "2-7",
        prompt: "\"Will she have recovered by the time of the marathon?\" — \"Yes, ___\"",
        options: ["she has.", "she will.", "she recovered.", "she does."],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, she will.",
      },
      {
        id: "2-8",
        prompt: "\"Will the package have arrived by Thursday?\" — \"No, ___\"",
        options: ["it hasn't.", "it won't.", "it didn't.", "it doesn't."],
        correctIndex: 1,
        explanation: "Short negative: No, it won't.",
      },
      {
        id: "2-9",
        prompt: "___ you have saved enough money by the time you retire?",
        options: ["Have", "Do", "Will", "Are"],
        correctIndex: 2,
        explanation: "Future Perfect question: Will + subject + have + pp?",
      },
      {
        id: "2-10",
        prompt: "\"Will they have eaten by the time we get there?\" — \"Yes, ___\"",
        options: ["they have.", "they will.", "they do.", "they ate."],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, they will.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — 'by [time]' → Future Perfect vs 'at [time]' → other forms",
    instructions:
      "Choose the correct form based on the time expression: 'by [time]' usually signals Future Perfect (completed before that point); 'at [time]' can signal Future Continuous (in progress at that point) or Future Simple (at exactly that moment).",
    questions: [
      {
        id: "3-1",
        prompt: "By 5 PM, she ___ submitted the report. (before 5 PM — completed)",
        options: ["will submit", "will be submitting", "will have submitted", "submits"],
        correctIndex: 2,
        explanation: "'will have submitted' — Future Perfect: completed before 5 PM ('by 5 PM').",
      },
      {
        id: "3-2",
        prompt: "At 5 PM, she ___ still working on the report. (in progress at 5 PM)",
        options: ["will have worked", "will work", "will be working", "worked"],
        correctIndex: 2,
        explanation: "'will be working' — Future Continuous: ongoing action at exactly 5 PM ('at 5 PM').",
      },
      {
        id: "3-3",
        prompt: "By the time the guests arrive, I ___ cooked dinner. (completed before they arrive)",
        options: ["will cook", "will be cooking", "will have cooked", "cook"],
        correctIndex: 2,
        explanation: "'will have cooked' — Future Perfect: completed before the guests arrive.",
      },
      {
        id: "3-4",
        prompt: "At 8 PM, the guests ___ arriving for the party. (in progress at 8 PM)",
        options: ["will have arrived", "will be arriving", "arrived", "will arrive"],
        correctIndex: 1,
        explanation: "'will be arriving' — Future Continuous: action in progress at 8 PM.",
      },
      {
        id: "3-5",
        prompt: "By next year, she ___ completed her PhD. (before next year)",
        options: ["will be completing", "will complete", "will have completed", "completes"],
        correctIndex: 2,
        explanation: "'will have completed' — Future Perfect for completion before a future deadline.",
      },
      {
        id: "3-6",
        prompt: "At exactly 9 AM, the ceremony ___ start. (a single scheduled event)",
        options: ["will have started", "will be starting", "will start", "starts"],
        correctIndex: 2,
        explanation: "'will start' — Future Simple for a single scheduled event at an exact time.",
      },
      {
        id: "3-7",
        prompt: "By the time you read this, they ___ already left. (completed before you read it)",
        options: ["will be leaving", "will leave", "will have left", "left"],
        correctIndex: 2,
        explanation: "'will have left' — Future Perfect: completed before the reading moment.",
      },
      {
        id: "3-8",
        prompt: "At midnight, we ___ dancing to celebrate the New Year. (in progress at midnight)",
        options: ["will have danced", "will dance", "will be dancing", "danced"],
        correctIndex: 2,
        explanation: "'will be dancing' — Future Continuous: action in progress at midnight.",
      },
      {
        id: "3-9",
        prompt: "By Friday, the plumber ___ fixed the leak. (before Friday — completed)",
        options: ["will fix", "will be fixing", "will have fixed", "fixes"],
        correctIndex: 2,
        explanation: "'will have fixed' — Future Perfect for completion before Friday.",
      },
      {
        id: "3-10",
        prompt: "At 3 PM on Saturday, ___ you be working or relaxing?",
        options: ["will", "did", "will you", "do"],
        correctIndex: 0,
        explanation: "'will' (Future Continuous question: Will you be working?) — 'at 3 PM' signals an action in progress, not completion.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed 'by the time / by then / by + year' — all Future Perfect forms",
    instructions:
      "This mixed set uses 'by the time', 'by then', and 'by [year]' with all Future Perfect forms: affirmative, negative, and questions. Correct answers are varied — read each sentence carefully.",
    questions: [
      {
        id: "4-1",
        prompt: "By 2040, the world population ___ reached 9 billion.",
        options: ["won't have", "will have", "will be", "reaches"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have reached'. By 2040 = a future deadline.",
      },
      {
        id: "4-2",
        prompt: "___ she have retired by the time the new policy takes effect?",
        options: ["Has", "Does", "Will", "Is"],
        correctIndex: 2,
        explanation: "Question: Will + subject + have + pp? Future Perfect question.",
      },
      {
        id: "4-3",
        prompt: "By then, I ___ forgotten all the grammar rules — it's been too long!",
        options: ["will have", "won't have", "will be", "have"],
        correctIndex: 0,
        explanation: "Affirmative: 'will have forgotten'. The speaker expects to forget by that future point.",
      },
      {
        id: "4-4",
        prompt: "By the time the film ends, the children ___ fallen asleep.",
        options: ["won't have", "will have", "will be", "fall"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have fallen'. The film ending is the future deadline.",
      },
      {
        id: "4-5",
        prompt: "By next week, the team ___ made a decision — they need more time.",
        options: ["will have", "won't have", "will be", "make"],
        correctIndex: 1,
        explanation: "Negative: 'won't have made'. 'They need more time' signals it won't be done by next week.",
      },
      {
        id: "4-6",
        prompt: "___ the project have been launched by the time you present at the conference?",
        options: ["Has", "Is", "Will", "Does"],
        correctIndex: 2,
        explanation: "Question: Will + subject + have + pp? Future Perfect question.",
      },
      {
        id: "4-7",
        prompt: "By 2050, many coastal cities ___ flooded due to rising sea levels.",
        options: ["won't have", "will have", "will be", "flood"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have flooded'. By 2050 = future deadline for this predicted completion.",
      },
      {
        id: "4-8",
        prompt: "By the time you finish reading this article, you ___ learned ten new words.",
        options: ["won't have", "will have", "will be", "learn"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have learned'. The action (learning words) is complete before/by the time you finish.",
      },
      {
        id: "4-9",
        prompt: "By then, I ___ waited over an hour — I'm leaving.",
        options: ["won't have", "will have", "will be", "wait"],
        correctIndex: 1,
        explanation: "Affirmative: 'will have waited'. By then = the future deadline after which the person leaves.",
      },
      {
        id: "4-10",
        prompt: "___ the scientists have published their findings by the end of the year?",
        options: ["Have", "Do", "Will", "Are"],
        correctIndex: 2,
        explanation: "Question: Will + subject + have + pp? Future Perfect question.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "by [time] mixed",
  2: "By then + answers",
  3: "by vs at",
  4: "All by phrases",
};

export default function ByTheTimeClient() {
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
          <span className="text-slate-700 font-medium">by the time / by then</span>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Future Perfect <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">by the time / by then</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Upper-intermediate</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B2</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">40 questions mastering the &quot;by&quot; trigger for Future Perfect. Learn to distinguish &quot;by [deadline]&quot; from &quot;at [moment]&quot;.</p>
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
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">Core formula with &quot;by&quot;</span>
          <Formula parts={[
            { text: "By [time]", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "will have", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By Friday, she will have finished the report." />
            <Ex en="By the time you arrive, I will have cooked dinner." />
            <Ex en="By 2030, they will have completed the project." />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">by the time + present tense clause</span>
          <Formula parts={[
            { text: "By the time", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "+ present tense", color: "slate" },
            { text: ", subject", color: "sky" },
            { text: "will have", color: "yellow" },
            { text: "pp", color: "green" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By the time he arrives, we will have eaten." />
            <Ex en="By the time she reads this, I will have left." />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Key rule: &quot;by the time + present tense&quot;</div>
        <div className="text-xs text-amber-700 space-y-1 mt-2">
          <div>✅ By the time <b>he arrives</b> (present simple), I will have left. ← correct</div>
          <div>❌ By the time <b>he will arrive</b>, I will have left. ← wrong (no future after &apos;by the time&apos;)</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Signal word table</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Signal word</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Tense</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["by [time]", "Future Perfect", "Completed before that point"],
                ["by the time…", "Future Perfect", "Completed before the other event"],
                ["by then", "Future Perfect", "Completed before a mentioned future time"],
                ["at [time]", "Future Continuous", "In progress at that exact moment"],
                ["when…", "Future Continuous", "In progress when the other event occurs"],
                ["at exactly…", "Future Simple", "Happens at that moment"],
              ].map(([signal, tense, meaning], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-violet-700 font-mono text-xs">{signal}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-bold text-xs">{tense}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">All &quot;by&quot; signal phrases</div>
        <div className="flex flex-wrap gap-2">
          {["by Friday", "by then", "by the time…", "by next week", "by 2030", "by the end of the year", "by midnight", "by the time you read this"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
