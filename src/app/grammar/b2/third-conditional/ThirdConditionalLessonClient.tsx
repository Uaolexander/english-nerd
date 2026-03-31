"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function ThirdConditionalLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct Third Conditional form",
      instructions: "Choose the correct form. Third Conditional: If + Past Perfect, would/could/might have + past participle.",
      questions: [
        { id: "e1q1", prompt: "If I had studied harder, I ___ the exam.", options: ["would pass", "would have passed", "had passed"], correctIndex: 1, explanation: "would have passed = result clause of Third Conditional (would + have + pp)." },
        { id: "e1q2", prompt: "If she ___ earlier, she wouldn't have missed the flight.", options: ["left", "had left", "would have left"], correctIndex: 1, explanation: "had left = if-clause of Third Conditional (Past Perfect)." },
        { id: "e1q3", prompt: "He ___ the job if he had prepared better for the interview.", options: ["gets", "got", "would have got"], correctIndex: 2, explanation: "would have got = result clause (would + have + pp)." },
        { id: "e1q4", prompt: "If they ___ us, we would have been lost.", options: ["didn't help", "hadn't helped", "wouldn't have helped"], correctIndex: 1, explanation: "hadn't helped = negative if-clause (Past Perfect negative)." },
        { id: "e1q5", prompt: "I ___ you if I had known your number.", options: ["called", "would call", "would have called"], correctIndex: 2, explanation: "would have called = result clause." },
        { id: "e1q6", prompt: "If it ___ so cold, we would have gone for a walk.", options: ["wasn't", "weren't", "hadn't been"], correctIndex: 2, explanation: "hadn't been = Past Perfect negative in the if-clause." },
        { id: "e1q7", prompt: "She ___ ill if she had eaten that fish.", options: ["might have got", "might get", "had got"], correctIndex: 0, explanation: "might have got = possibility result clause (might + have + pp)." },
        { id: "e1q8", prompt: "If he had listened to the doctor, he ___ so much pain.", options: ["wouldn't be in", "wouldn't have been in", "hadn't been in"], correctIndex: 1, explanation: "wouldn't have been in = Third Conditional result (wouldn't + have + pp)." },
        { id: "e1q9", prompt: "We ___ the project on time if we had had more staff.", options: ["could complete", "could have completed", "had completed"], correctIndex: 1, explanation: "could have completed = possibility result clause (could + have + pp)." },
        { id: "e1q10", prompt: "If you ___ me, I wouldn't have made such a mistake.", options: ["warned", "had warned", "would have warned"], correctIndex: 1, explanation: "had warned = if-clause (Past Perfect)." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct Third Conditional form",
      instructions: "Complete the Third Conditional sentence. Write the correct form of the verb in brackets.",
      questions: [
        { id: "e2q1", prompt: "If I (know) ___ about the traffic, I would have left earlier.", correct: "had known", explanation: "had known = Past Perfect in the if-clause." },
        { id: "e2q2", prompt: "She would have got the role if she (audition) ___ properly.", correct: "had auditioned", explanation: "had auditioned = Past Perfect in the if-clause." },
        { id: "e2q3", prompt: "If they (not/miss) ___ the deadline, the client wouldn't have cancelled.", correct: "hadn't missed", explanation: "hadn't missed = negative Past Perfect in the if-clause." },
        { id: "e2q4", prompt: "We (visit) ___ you if we had been in the area.", correct: "would have visited", explanation: "would have visited = result clause (would + have + pp)." },
        { id: "e2q5", prompt: "He might (not/crash) ___ if he had been paying attention.", correct: "not have crashed", explanation: "might not have crashed = negative result with might." },
        { id: "e2q6", prompt: "If she (take) ___ the job offer, she would have earned more.", correct: "had taken", explanation: "had taken = Past Perfect in the if-clause." },
        { id: "e2q7", prompt: "They could (win) ___ the match if the referee hadn't made that call.", correct: "have won", explanation: "could have won = possibility result clause." },
        { id: "e2q8", prompt: "If you (tell) ___ me sooner, I would have helped you.", correct: "had told", explanation: "had told = Past Perfect in the if-clause." },
        { id: "e2q9", prompt: "I (not/buy) ___ the house if I had known about the problems.", correct: "would not have bought", explanation: "would not have bought = negative result clause." },
        { id: "e2q10", prompt: "She (be) ___ much healthier if she had exercised more.", correct: "would have been", explanation: "would have been = result clause with be." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Second vs Third Conditional",
      instructions: "Choose Second or Third Conditional. Think: is the situation hypothetical present/future or hypothetical past?",
      questions: [
        { id: "e3q1", prompt: "If I ___ rich, I would travel the world. (I'm not rich now)", options: ["were", "had been", "would be"], correctIndex: 0, explanation: "were = Second Conditional (hypothetical present — I'm not rich)." },
        { id: "e3q2", prompt: "If I ___ the lottery, I would have quit my job. (I didn't win)", options: ["won", "had won", "would have won"], correctIndex: 1, explanation: "had won = Third Conditional (hypothetical past — the lottery was already drawn)." },
        { id: "e3q3", prompt: "She would feel better if she ___ more sleep last night.", options: ["got", "had got", "would get"], correctIndex: 1, explanation: "had got = Third Conditional (last night is past — she didn't sleep enough)." },
        { id: "e3q4", prompt: "If he ___ harder, he could get a promotion. (He could still try)", options: ["worked", "had worked", "works"], correctIndex: 0, explanation: "worked = Second Conditional (still possible in the present/future)." },
        { id: "e3q5", prompt: "They wouldn't have lost if their best player ___ sent off.", options: ["wasn't", "hadn't been", "wouldn't have been"], correctIndex: 1, explanation: "hadn't been = Third Conditional (the match is in the past)." },
        { id: "e3q6", prompt: "If I ___ you, I'd be more careful with your money.", options: ["were", "had been", "am"], correctIndex: 0, explanation: "were = Second Conditional (advice about present — 'If I were in your position')." },
        { id: "e3q7", prompt: "She could have been a doctor if she ___ medicine.", options: ["studied", "had studied", "would study"], correctIndex: 1, explanation: "had studied = Third Conditional (her career choice is already in the past)." },
        { id: "e3q8", prompt: "If the government ___ action now, the situation would improve.", options: ["took", "had taken", "takes"], correctIndex: 0, explanation: "took = Second Conditional (action in the present/future is still possible)." },
        { id: "e3q9", prompt: "If I ___ the alarm, I wouldn't have missed the meeting.", options: ["set", "had set", "would set"], correctIndex: 1, explanation: "had set = Third Conditional (the meeting is past — I didn't set the alarm)." },
        { id: "e3q10", prompt: "I would understand if you ___ to leave early.", options: ["wanted", "had wanted", "want"], correctIndex: 0, explanation: "wanted = Second Conditional (present/future hypothetical situation)." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — could/might have + mixed modals",
      instructions: "Complete the sentence with the correct Third Conditional form. could have, might have, should have, or would have — choose the most natural modal.",
      questions: [
        { id: "e4q1", prompt: "If you had practised more, you ___ (could/win) the competition.", correct: "could have won", explanation: "could have won = possibility result with could." },
        { id: "e4q2", prompt: "She ___ (should/tell) him the truth if she had known how he felt.", correct: "should have told", explanation: "should have told = moral obligation in a past hypothetical." },
        { id: "e4q3", prompt: "If the storm hadn't hit, the crops ___ (might/survive).", correct: "might have survived", explanation: "might have survived = uncertain possibility result." },
        { id: "e4q4", prompt: "He ___ (would/not/be) so stressed if he had planned better.", correct: "would not have been", explanation: "would not have been = negative result clause." },
        { id: "e4q5", prompt: "If the surgery had gone wrong, she ___ (might/die).", correct: "might have died", explanation: "might have died = uncertain past possibility." },
        { id: "e4q6", prompt: "You ___ (should/check) the weather forecast if you were going hiking.", correct: "should have checked", explanation: "should have checked = criticism/advice about the past." },
        { id: "e4q7", prompt: "We ___ (could/save) more money if we had been more careful.", correct: "could have saved", explanation: "could have saved = possibility result." },
        { id: "e4q8", prompt: "If she hadn't been so nervous, she ___ (would/perform) better.", correct: "would have performed", explanation: "would have performed = standard Third Conditional result." },
        { id: "e4q9", prompt: "He ___ (might/not/notice) the error if you hadn't pointed it out.", correct: "might not have noticed", explanation: "might not have noticed = uncertain negative possibility." },
        { id: "e4q10", prompt: "If the company had invested earlier, it ___ (would/avoid) the crisis.", correct: "would have avoided", explanation: "would have avoided = result clause." },
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
        <span className="text-slate-700 font-medium">Third Conditional</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Third{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Conditional</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The Third Conditional uses <b>If + Past Perfect, would/could/might have + past participle</b>. It refers to <b>hypothetical past situations</b> — things that didn&apos;t happen and their imagined consequences: <i>If I <b>had studied</b> harder, I <b>would have passed</b>.</i>
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
        <a href="/grammar/b2/mixed-conditionals" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Mixed Conditionals →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Third Conditional (B2)</h2>
      <p>The Third Conditional describes <b>hypothetical situations in the past</b> — things that did not happen — and their imagined consequences. It is often used to express <b>regret</b> or <b>criticism</b>.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Structure</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="text-xs font-bold text-orange-700 mb-1">IF-CLAUSE</div>
            <div className="font-mono text-slate-800 text-sm">If + Past Perfect</div>
            <div className="italic text-slate-600 text-sm mt-1">If I had known…</div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <div className="text-xs font-bold text-sky-700 mb-1">RESULT CLAUSE</div>
            <div className="font-mono text-slate-800 text-sm">would / could / might + have + pp</div>
            <div className="italic text-slate-600 text-sm mt-1">…I would have told you.</div>
          </div>
        </div>
      </div>

      <h3>Result modals: would / could / might</h3>
      <div className="not-prose space-y-2 mt-2">
        {[
          { modal: "would have", use: "Certain imagined result", ex: "If she had tried, she would have succeeded." },
          { modal: "could have", use: "Possible ability or opportunity", ex: "If they had practised, they could have won." },
          { modal: "might have", use: "Uncertain possibility", ex: "If he had eaten less, he might have felt better." },
          { modal: "should have", use: "Advice / criticism (what was the right thing to do)", ex: "If you had asked, I should have helped. / You should have called if you had a problem." },
        ].map(({ modal, use, ex }) => (
          <div key={modal} className="rounded-2xl border border-black/10 bg-white p-4 text-sm">
            <span className="font-black text-orange-700">{modal}</span>
            <span className="text-slate-500 ml-2">— {use}</span>
            <div className="italic text-slate-700 mt-1">{ex}</div>
          </div>
        ))}
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Contraction tip:</span> In spoken English, <i>would have</i> is often contracted to <i>&apos;d have</i> and <i>would not have</i> to <i>wouldn&apos;t have</i>: <i>If I&apos;d known, I wouldn&apos;t have come.</i>
        </div>
      </div>
    </div>
  );
}
