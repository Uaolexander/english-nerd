"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function FuturePerfectLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct Future Perfect form",
      instructions: "Choose the correct Future Perfect form (will have + past participle).",
      questions: [
        { id: "e1q1", prompt: "By Friday, I ___ the report.", options: ["will finish", "will have finished", "will be finishing"], correctIndex: 1, explanation: "will have finished = completed before Friday → Future Perfect." },
        { id: "e1q2", prompt: "By the time you arrive, we ___ dinner.", options: ["have eaten", "will eat", "will have eaten"], correctIndex: 2, explanation: "will have eaten = before you arrive (future point) → Future Perfect." },
        { id: "e1q3", prompt: "She ___ English for 10 years by the time she graduates.", options: ["will study", "will have studied", "will be studying"], correctIndex: 1, explanation: "will have studied = duration completed before graduation." },
        { id: "e1q4", prompt: "___ you ___ the book by next Monday?", options: ["Will / read", "Will / have read", "Will / be reading"], correctIndex: 1, explanation: "Will you have read = Future Perfect question." },
        { id: "e1q5", prompt: "By 2030, scientists ___ a cure for many diseases.", options: ["find", "will find", "will have found"], correctIndex: 2, explanation: "will have found = completed before 2030 → Future Perfect." },
        { id: "e1q6", prompt: "Don't call at 9 — she ___ to bed by then.", options: ["goes", "will go", "will have gone"], correctIndex: 2, explanation: "will have gone = completed before 9pm → Future Perfect." },
        { id: "e1q7", prompt: "They ___ this building for 5 years by the time it's finished.", options: ["will build", "will have been building", "will have built"], correctIndex: 1, explanation: "will have been building = duration up to completion → Future Perfect Continuous (also acceptable)." },
        { id: "e1q8", prompt: "By next spring, we ___ in this flat for two years.", options: ["will live", "will have lived", "will be living"], correctIndex: 1, explanation: "will have lived = duration completed by next spring." },
        { id: "e1q9", prompt: "He ___ all his savings by the end of the trip.", options: ["will spend", "will have spent", "will be spending"], correctIndex: 1, explanation: "will have spent = completed before the end of the trip." },
        { id: "e1q10", prompt: "By the time the film starts, they ___ the popcorn!", options: ["eat", "will eat", "will have eaten"], correctIndex: 2, explanation: "will have eaten = completed before the film starts." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the Future Perfect form",
      instructions: "Write the correct Future Perfect form of the verb in brackets (will have + past participle).",
      questions: [
        { id: "e2q1", prompt: "By tomorrow morning, I (sleep) ___ for 10 hours.", correct: "will have slept", explanation: "will have slept = completed before tomorrow morning." },
        { id: "e2q2", prompt: "She (finish) ___ her degree by June.", correct: "will have finished", explanation: "will have finished = completed before June." },
        { id: "e2q3", prompt: "(he/write) ___ the report by the time the meeting starts?", correct: "will he have written", explanation: "will he have written = Future Perfect question." },
        { id: "e2q4", prompt: "We (not/read) ___ all the material before the exam.", correct: "won't have read", explanation: "won't have read = negative Future Perfect." },
        { id: "e2q5", prompt: "By 2025, they (sell) ___ over a million copies.", correct: "will have sold", explanation: "will have sold = completed by a future point." },
        { id: "e2q6", prompt: "I (live) ___ here for 20 years by my next birthday.", correct: "will have lived", explanation: "will have lived = duration completed by a future date." },
        { id: "e2q7", prompt: "The construction team (complete) ___ the bridge before winter.", correct: "will have completed", explanation: "will have completed = finished before a future point." },
        { id: "e2q8", prompt: "She (travel) ___ to 30 countries by the time she's 40.", correct: "will have travelled", explanation: "will have travelled = completed by age 40." },
        { id: "e2q9", prompt: "How many books (you/read) ___ by the end of the year?", correct: "will you have read", explanation: "will you have read = Future Perfect question about quantity." },
        { id: "e2q10", prompt: "They (not/arrive) ___ by 8 — the traffic is terrible.", correct: "won't have arrived", explanation: "won't have arrived = negative — not completed by 8." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Future Perfect vs Future Continuous vs will",
      instructions: "Choose the most appropriate future form. Think about completion, duration in progress, or simple future fact.",
      questions: [
        { id: "e3q1", prompt: "At noon tomorrow, I ___ my presentation — come and watch.", options: ["will give", "will be giving", "will have given"], correctIndex: 1, explanation: "will be giving = in progress at noon → Future Continuous." },
        { id: "e3q2", prompt: "Don't come at 5 — I ___ the report by then.", options: ["don't finish", "won't have finished", "won't be finishing"], correctIndex: 1, explanation: "won't have finished = not completed by 5 → Future Perfect negative." },
        { id: "e3q3", prompt: "By the end of this year, she ___ 500 hours of research.", options: ["will be doing", "will do", "will have done"], correctIndex: 2, explanation: "will have done = completed before end of year → Future Perfect." },
        { id: "e3q4", prompt: "I think it ___ rain tomorrow — look at the forecast.", options: ["will", "will be raining", "will have rained"], correctIndex: 0, explanation: "will rain = simple prediction → will." },
        { id: "e3q5", prompt: "In two years, he ___ for the company for a decade.", options: ["works", "will be working", "will have worked"], correctIndex: 2, explanation: "will have worked = completed period → Future Perfect." },
        { id: "e3q6", prompt: "This time next month, we ___ somewhere on the coast.", options: ["will relax", "will be relaxing", "will have relaxed"], correctIndex: 1, explanation: "will be relaxing = in progress at a future moment → Future Continuous." },
        { id: "e3q7", prompt: "She ___ all her savings by the end of the holiday unless she's careful.", options: ["will spend", "will be spending", "will have spent"], correctIndex: 2, explanation: "will have spent = completed by end of holiday → Future Perfect." },
        { id: "e3q8", prompt: "Don't call at 7 — they ___ dinner then.", options: ["will have", "will be having", "will have had"], correctIndex: 1, explanation: "will be having = in progress at 7 → Future Continuous." },
        { id: "e3q9", prompt: "By 2050, sea levels ___ by 20 cm, scientists warn.", options: ["rise", "will be rising", "will have risen"], correctIndex: 2, explanation: "will have risen = completed change by 2050 → Future Perfect." },
        { id: "e3q10", prompt: "A: Are you busy later? B: Yes, I ___ from 3 to 5.", options: ["will work", "will be working", "will have worked"], correctIndex: 1, explanation: "will be working = in progress during that period → Future Continuous." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Mixed Future Tenses",
      instructions: "Write the correct future form: will, going to, Future Continuous, or Future Perfect.",
      questions: [
        { id: "e4q1", prompt: "By the time the guests arrive, I (cook) ___ everything.", correct: "will have cooked", explanation: "will have cooked = completed before they arrive → Future Perfect." },
        { id: "e4q2", prompt: "Watch out! That ladder (fall) ___.", correct: "is going to fall", explanation: "is going to fall = evidence of imminent event → going to." },
        { id: "e4q3", prompt: "At 9am on Monday, we (have) ___ our team briefing.", correct: "will be having", explanation: "will be having = in progress at that time → Future Continuous." },
        { id: "e4q4", prompt: "She (study) ___ medicine for six years by the time she qualifies.", correct: "will have studied", explanation: "will have studied = completed duration → Future Perfect." },
        { id: "e4q5", prompt: "A: The printer is jammed. B: I (have) ___ a look.", correct: "will have", explanation: "will have a look = spontaneous offer → will." },
        { id: "e4q6", prompt: "This time tomorrow, they (fly) ___ over the Atlantic.", correct: "will be flying", explanation: "will be flying = in progress at that time → Future Continuous." },
        { id: "e4q7", prompt: "We (not/finish) ___ the project by the deadline unless we work faster.", correct: "won't have finished", explanation: "won't have finished = not completed by deadline → Future Perfect negative." },
        { id: "e4q8", prompt: "I've made up my mind — I (apply) ___ for the scholarship.", correct: "am going to apply", explanation: "am going to apply = decision already made → going to." },
        { id: "e4q9", prompt: "How long (you/wait) ___ by the time the doctor sees you?", correct: "will you have been waiting", explanation: "will you have been waiting = duration up to a future point → Future Perfect Continuous." },
        { id: "e4q10", prompt: "She (work) ___ here for 25 years next spring.", correct: "will have been working", explanation: "will have been working = duration up to next spring → Future Perfect Continuous (also: will have worked)." },
      ],
    },
  }), []);

  const current = sets[exNo];

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    const total = current.questions.length;
    if (current.type === "mcq") {
      for (const q of current.questions) { if (mcqAnswers[q.id] === q.correctIndex) correct++; }
    } else {
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }, [checked, current, mcqAnswers, inputAnswers]);

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Future Perfect</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Future{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Perfect</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The Future Perfect uses <b>will have + past participle</b>. It describes an action that will be <b>completed before</b> a specific future time or event: <i>By Friday, I <b>will have finished</b> the report.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
            <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
          </div>
        </aside>

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
              Exercises:
              {([1, 2, 3, 4] as const).map((n) => (
                <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {([1, 2, 3, 4] as const).map((n) => (
                      <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  {current.type === "mcq" ? (
                    current.questions.map((q, idx) => {
                      const chosen = mcqAnswers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))} />
                                    <span className="text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    current.questions.map((q, idx) => {
                      const val = inputAnswers[q.id] ?? "";
                      const answered = normalize(val) !== "";
                      const isCorrect = checked && answered && normalize(val) === normalize(q.correct);
                      const wrong = checked && answered && !isCorrect;
                      const noAnswer = checked && !answered;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3">
                                <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-sm rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                    ) : (
                      <button onClick={resetExercise} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                    )}
                    {checked && exNo < 4 && (
                      <button onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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
                        {score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
            <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
          </div>
        </aside>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/passive-advanced" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Passive Voice Advanced →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Future Perfect (B2)</h2>
      <p>The Future Perfect (<b>will have + past participle</b>) describes an action that will be <b>completed before</b> a specific future time or another future event.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Forms</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Positive", rows: ["I / she / they will have finished.", "By noon, he will have left."] },
            { label: "Negative", rows: ["I / she / they won't have finished.", "She won't have arrived by 8."] },
            { label: "Question", rows: ["Will you have finished by then?", "Will she have left by midnight?"] },
            { label: "Short answers", rows: ["Yes, I will. / No, I won't.", "Yes, she will. / No, she won't."] },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
              {rows.map((r) => <div key={r} className="text-sm text-slate-800 italic">{r}</div>)}
            </div>
          ))}
        </div>
      </div>

      <h3>Key signal words</h3>
      <div className="not-prose flex flex-wrap gap-2 mt-2">
        {["by (+ time/date)", "by the time", "before", "by then", "in (+ period)", "when"].map((w) => (
          <span key={w} className="rounded-xl border border-black/10 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">{w}</span>
        ))}
      </div>

      <h3>Future Perfect vs Future Continuous</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="text-xs font-bold text-orange-700 mb-2">FUTURE PERFECT — completed by a point</div>
            <div className="text-sm italic text-slate-800">By 6pm, I will have written the report.</div>
            <div className="mt-1 text-xs text-slate-500">The report will be done before 6pm.</div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <div className="text-xs font-bold text-sky-700 mb-2">FUTURE CONTINUOUS — in progress at a point</div>
            <div className="text-sm italic text-slate-800">At 6pm, I will be writing the report.</div>
            <div className="mt-1 text-xs text-slate-500">The report will still be in progress at 6pm.</div>
          </div>
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Tip:</span> After <i>by the time</i>, <i>when</i>, <i>before</i>, <i>after</i>, <i>as soon as</i> — use <b>present simple</b>, not a future tense: <i>By the time she <b>arrives</b> (not will arrive), I will have cooked dinner.</i>
        </div>
      </div>
    </div>
  );
}
