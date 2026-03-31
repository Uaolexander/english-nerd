"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function ModalPerfectLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Modal Perfect: meaning",
      instructions: "Choose the meaning of each modal perfect structure: deduction (almost certain), possibility (maybe), criticism/regret, or unnecessary action.",
      questions: [
        { id: "e1q1", prompt: "She must have forgotten the meeting. She's never late.", options: ["Deduction (almost certain)", "Possibility (maybe)", "Unnecessary action"], correctIndex: 0, explanation: "must have + pp = near-certain deduction based on evidence." },
        { id: "e1q2", prompt: "You needn't have bought flowers — we already have some.", options: ["Criticism", "Unnecessary action", "Possibility"], correctIndex: 1, explanation: "needn't have + pp = something was done but wasn't necessary." },
        { id: "e1q3", prompt: "He might have left his keys at the office.", options: ["Deduction (almost certain)", "Possibility (maybe)", "Criticism"], correctIndex: 1, explanation: "might have + pp = a weaker possibility about the past." },
        { id: "e1q4", prompt: "You should have told me earlier. I could have helped.", options: ["Deduction", "Unnecessary action", "Criticism / regret"], correctIndex: 2, explanation: "should have + pp = criticism of a past action (or regret for not doing it)." },
        { id: "e1q5", prompt: "They can't have arrived yet — the flight lands in an hour.", options: ["Negative deduction", "Possibility", "Criticism"], correctIndex: 0, explanation: "can't have + pp = near-certain negative deduction." },
        { id: "e1q6", prompt: "She could have warned us about the traffic!", options: ["Deduction", "Criticism / missed opportunity", "Unnecessary action"], correctIndex: 1, explanation: "could have + pp = criticism that someone had the ability but didn't act." },
        { id: "e1q7", prompt: "It might not have been her fault after all.", options: ["Possibility about the past", "Deduction", "Criticism"], correctIndex: 0, explanation: "might not have + pp = uncertain possibility (maybe it wasn't her fault)." },
        { id: "e1q8", prompt: "He must have been working all night — he looks exhausted.", options: ["Criticism", "Deduction", "Unnecessary action"], correctIndex: 1, explanation: "must have been + -ing = strong deduction about an ongoing past activity." },
        { id: "e1q9", prompt: "You shouldn't have spent so much on that gift!", options: ["Criticism (you did the wrong thing)", "Deduction", "Possibility"], correctIndex: 0, explanation: "shouldn't have + pp = criticism that something was the wrong thing to do." },
        { id: "e1q10", prompt: "She may have taken the wrong bus.", options: ["Deduction", "Criticism", "Possibility about the past"], correctIndex: 2, explanation: "may have + pp = a polite or formal expression of possibility about the past." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct modal perfect",
      instructions: "Complete each sentence using the correct modal perfect form. Use the modal in brackets and the verb in parentheses.",
      questions: [
        { id: "e2q1", prompt: "She's not answering. She (must / go) ___ to bed already.", correct: "must have gone", explanation: "must have gone = strong deduction about the past." },
        { id: "e2q2", prompt: "You (needn't / cook) ___ dinner — I already ordered pizza.", correct: "needn't have cooked", explanation: "needn't have cooked = you cooked, but it wasn't necessary." },
        { id: "e2q3", prompt: "He (might / miss) ___ the train. Let's wait a bit more.", correct: "might have missed", explanation: "might have missed = uncertain past possibility." },
        { id: "e2q4", prompt: "They (should / call) ___ us. We were worried.", correct: "should have called", explanation: "should have called = criticism / they had an obligation but didn't." },
        { id: "e2q5", prompt: "She (can't / see) ___ us — she walked straight past!", correct: "can't have seen", explanation: "can't have seen = near-certain negative deduction." },
        { id: "e2q6", prompt: "You (could / warn) ___ me it was going to rain!", correct: "could have warned", explanation: "could have warned = criticism — you had the ability but didn't." },
        { id: "e2q7", prompt: "They (must / be / travel) ___ for hours — they look exhausted.", correct: "must have been travelling", explanation: "must have been travelling = deduction about a past continuous action." },
        { id: "e2q8", prompt: "He (shouldn't / drink) ___ so much at the party.", correct: "shouldn't have drunk", explanation: "shouldn't have drunk = criticism of a past decision." },
        { id: "e2q9", prompt: "I (may / leave) ___ my phone in the restaurant.", correct: "may have left", explanation: "may have left = formal possibility about the past." },
        { id: "e2q10", prompt: "You (needn't / wait) ___ for me — I had my own keys.", correct: "needn't have waited", explanation: "needn't have waited = the action was done but turned out to be unnecessary." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Choose the right modal perfect in context",
      instructions: "Read the context carefully and choose the most natural modal perfect.",
      questions: [
        { id: "e3q1", prompt: "The car is gone from the driveway. Tom ___ taken it.", options: ["must have", "needn't have", "shouldn't have"], correctIndex: 0, explanation: "must have = logical deduction from evidence (car is gone)." },
        { id: "e3q2", prompt: "I ___ booked the tickets online — the queue at the box office took an hour!", options: ["must have", "should have", "might have"], correctIndex: 1, explanation: "should have = regret / better decision would have been to book online." },
        { id: "e3q3", prompt: "She ___ seen the email — her inbox was open on the screen.", options: ["can't have", "must have", "might have"], correctIndex: 1, explanation: "must have seen = deduction: the email was there, so she almost certainly saw it." },
        { id: "e3q4", prompt: "I paid the plumber for two hours but he finished in 20 minutes. I ___ paid so much.", options: ["must not have", "needn't have", "could have"], correctIndex: 1, explanation: "needn't have paid = you paid, but it wasn't necessary in hindsight." },
        { id: "e3q5", prompt: "No one answered the door. They ___ gone out.", options: ["must have", "needn't have", "should have"], correctIndex: 0, explanation: "must have = strong deduction from available evidence." },
        { id: "e3q6", prompt: "He looked furious — someone ___ said something to upset him.", options: ["must have", "needn't have", "can't have"], correctIndex: 0, explanation: "must have = deduction based on appearance." },
        { id: "e3q7", prompt: "The test result came back positive. She ___ been infected before the trip.", options: ["must have", "can't have", "needn't have"], correctIndex: 0, explanation: "must have been = certain deduction based on the result." },
        { id: "e3q8", prompt: "He ___ told her the surprise! Now it's ruined.", options: ["must have", "can't have", "shouldn't have"], correctIndex: 2, explanation: "shouldn't have told = criticism — he did something wrong." },
        { id: "e3q9", prompt: "There's still food in the fridge. You ___ cooked — I've already eaten.", options: ["needn't have", "must have", "might not have"], correctIndex: 0, explanation: "needn't have cooked = you cooked, but it wasn't necessary." },
        { id: "e3q10", prompt: "Nobody has seen Mark since Friday. He ___ gone abroad.", options: ["must have", "might have", "can't have"], correctIndex: 1, explanation: "might have = one possibility, but we're not sure (could also be other explanations)." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Mixed modal perfects: rewrite or complete",
      instructions: "Rewrite or complete each sentence using the correct modal perfect. Write the full modal perfect phrase.",
      questions: [
        { id: "e4q1", prompt: "I'm sure he left the keys here. → He ___ the keys here. (must)", correct: "must have left", explanation: "must have left = near-certain deduction." },
        { id: "e4q2", prompt: "It wasn't necessary for her to apologise, but she did. → She ___ but she did. (needn't)", correct: "needn't have apologised", explanation: "needn't have apologised = unnecessary action that was still done." },
        { id: "e4q3", prompt: "It's possible that he didn't understand the instructions. → He ___ the instructions. (might not)", correct: "might not have understood", explanation: "might not have understood = uncertain negative past possibility." },
        { id: "e4q4", prompt: "It was wrong of you to leave without saying goodbye. → You ___ without saying goodbye. (shouldn't)", correct: "shouldn't have left", explanation: "shouldn't have left = criticism of a past decision." },
        { id: "e4q5", prompt: "I'm certain they weren't sleeping when I called — the lights were on. → They ___ when I called. (can't)", correct: "can't have been sleeping", explanation: "can't have been sleeping = negative deduction (continuous form)." },
        { id: "e4q6", prompt: "It was possible for him to ask for help but he didn't. → He ___ for help. (could)", correct: "could have asked", explanation: "could have asked = missed opportunity / implicit criticism." },
        { id: "e4q7", prompt: "I regret not saving the document. → I ___ the document. (should)", correct: "should have saved", explanation: "should have saved = personal regret about a past omission." },
        { id: "e4q8", prompt: "I'm sure they were waiting for hours — the flight was delayed by four hours. → They ___ for hours. (must / be)", correct: "must have been waiting", explanation: "must have been waiting = deduction about a past continuous action." },
        { id: "e4q9", prompt: "Perhaps she misread the address. → She ___ the address. (may)", correct: "may have misread", explanation: "may have misread = polite / formal expression of past possibility." },
        { id: "e4q10", prompt: "It was unnecessary for you to rush — the show doesn't start until 9. → You ___. (needn't)", correct: "needn't have rushed", explanation: "needn't have rushed = unnecessary past action." },
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
        <span className="text-slate-700 font-medium">Modal Verbs: Perfect</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Modal Verbs:{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Perfect</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Modal perfect structures combine a modal verb with <b>have + past participle</b>. They are used to make deductions, express possibility, give criticism, or talk about unnecessary actions in the past.
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
                  {current.type === "mcq" ? current.questions.map((q, idx) => {
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
                  }) : current.questions.map((q, idx) => {
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
                              <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-lg rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
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
                  })}
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
                      <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}</div>
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
        <a href="/grammar/b2/gerunds-infinitives" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Gerunds & Infinitives →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Modal Verbs: Perfect (B2)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { modal: "must have + pp", use: "Near-certain deduction (positive)", ex: "She must have forgotten. / He must have been sleeping." },
          { modal: "can't have + pp", use: "Near-certain deduction (negative)", ex: "She can't have seen us. / They can't have arrived yet." },
          { modal: "might / may have + pp", use: "Possibility about the past (uncertain)", ex: "He might have missed the bus. / She may have left already." },
          { modal: "should have + pp", use: "Criticism or regret (should have but didn't)", ex: "You should have told me. / I should have saved the file." },
          { modal: "shouldn't have + pp", use: "Criticism (did something wrong)", ex: "You shouldn't have shouted. / He shouldn't have driven so fast." },
          { modal: "could have + pp", use: "Missed opportunity or implicit criticism", ex: "You could have asked for help. / She could have called." },
          { modal: "needn't have + pp", use: "Unnecessary past action (you did it but it was not needed)", ex: "You needn't have cooked — I'd already eaten." },
        ].map(({ modal, use, ex }) => (
          <div key={modal} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-orange-700 text-sm">{modal}</span>
              <span className="text-xs text-slate-500">— {use}</span>
            </div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black">⚠ needn&apos;t have vs didn&apos;t need to:</span> <i>needn&apos;t have done</i> = you DID it, but it wasn&apos;t necessary. <i>didn&apos;t need to do</i> = it wasn&apos;t necessary (and usually you didn&apos;t do it).
        </div>
      </div>
    </div>
  );
}
