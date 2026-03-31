"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function AllConditionalsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "input",
      title: "Exercise 1 (Easy) — Write the correct verb form",
      instructions: "Write the correct form of the verb in brackets. The sentences are a mix of zero, first, and second conditionals.",
      questions: [
        { id: "e1q1", prompt: "If you heat metal, it ___ (expand). (zero)", correct: "expands", explanation: "Zero conditional → present simple: expands." },
        { id: "e1q2", prompt: "If it ___ (rain) tomorrow, we'll cancel the picnic. (first)", correct: "rains", explanation: "First conditional if-clause → present simple: rains." },
        { id: "e1q3", prompt: "If I ___ (have) a million pounds, I'd buy a castle. (second)", correct: "had", explanation: "Second conditional if-clause → past simple: had." },
        { id: "e1q4", prompt: "She always ___ (get) headaches if she doesn't sleep. (zero)", correct: "gets", explanation: "Zero conditional result → present simple: gets." },
        { id: "e1q5", prompt: "If he calls me, I ___ (tell) him the news. (first)", correct: "will tell", explanation: "First conditional result → will tell." },
        { id: "e1q6", prompt: "If I ___ (be) you, I wouldn't say that. (second)", correct: "were", explanation: "Second conditional if-clause → were (standard form)." },
        { id: "e1q7", prompt: "Water ___ (freeze) if the temperature drops below 0°C. (zero)", correct: "freezes", explanation: "Zero conditional result → present simple: freezes." },
        { id: "e1q8", prompt: "If they ___ (not / hurry), they'll miss the bus. (first)", correct: "don't hurry", explanation: "First conditional negative if-clause → don't hurry." },
        { id: "e1q9", prompt: "If dogs ___ (can) talk, life would be very different. (second)", correct: "could", explanation: "Second conditional if-clause → could (past form of can)." },
        { id: "e1q10", prompt: "Plants ___ (die) if they don't get water. (zero)", correct: "die", explanation: "Zero conditional result → present simple: die." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Choose the correct verb form",
      instructions: "Choose the correct form. There are zero, first, and second conditionals mixed together.",
      questions: [
        { id: "e2q1", prompt: "If I ___ a car, I'd drive to work every day. (I don't have one)", options: ["had", "have", "will have"], correctIndex: 0, explanation: "Unreal present → Second conditional: had." },
        { id: "e2q2", prompt: "If you press this button, the alarm ___.", options: ["goes off", "would go off", "went off"], correctIndex: 0, explanation: "Factual/mechanical truth → Zero conditional: goes off." },
        { id: "e2q3", prompt: "She ___ be delighted if you visited her. (she'd really like a visit)", options: ["would", "will", "does"], correctIndex: 0, explanation: "Hypothetical, unlikely → Second: would." },
        { id: "e2q4", prompt: "If he ___ the exam, he'll go to university. (he's working hard)", options: ["passes", "passed", "will pass"], correctIndex: 0, explanation: "Real future possibility → First: passes." },
        { id: "e2q5", prompt: "Glass ___ if you drop it.", options: ["breaks", "would break", "will break"], correctIndex: 0, explanation: "General fact → Zero: breaks." },
        { id: "e2q6", prompt: "If I ___ fluent in Chinese, I'd get that job easily.", options: ["were", "am", "will be"], correctIndex: 0, explanation: "Unreal/hypothetical → Second: were." },
        { id: "e2q7", prompt: "I'll call you if I ___ any problems.", options: ["have", "had", "would have"], correctIndex: 0, explanation: "Real future → First: have." },
        { id: "e2q8", prompt: "If she ___ her diet, she'll feel much better.", options: ["improves", "improved", "would improve"], correctIndex: 0, explanation: "Real future action and result → First: improves." },
        { id: "e2q9", prompt: "Metal ___ if you cool it down.", options: ["contracts", "would contract", "will contract"], correctIndex: 0, explanation: "Scientific law → Zero: contracts." },
        { id: "e2q10", prompt: "If he ___ harder, he might get promoted. (he could do it)", options: ["worked", "works", "will work"], correctIndex: 0, explanation: "Hypothetical but possible → Second: worked." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Hard) — Write the correct form",
      instructions: "Write the correct form of the verb in brackets. The conditional type is given in brackets.",
      questions: [
        { id: "e3q1", prompt: "If you ___ (not / eat) breakfast, you feel tired. (zero)", correct: "don't eat", explanation: "Zero conditional if-clause → present simple: don't eat." },
        { id: "e3q2", prompt: "If she ___ (pass) the test, she'll celebrate. (first)", correct: "passes", explanation: "First conditional if-clause → present simple: passes." },
        { id: "e3q3", prompt: "If I ___ (be) rich, I'd give a lot to charity. (second)", correct: "were", explanation: "Second conditional if-clause → past simple: were." },
        { id: "e3q4", prompt: "We ___ (go) to the beach if it's sunny on Saturday. (first)", correct: "will go", explanation: "First conditional result → will go." },
        { id: "e3q5", prompt: "Ice cream ___ (melt) if you leave it in the sun. (zero)", correct: "melts", explanation: "Zero conditional result → present simple: melts." },
        { id: "e3q6", prompt: "He ___ (travel) more if he had more holiday time. (second)", correct: "would travel", explanation: "Second conditional result → would travel." },
        { id: "e3q7", prompt: "If the bus ___ (not / come), I'll take a taxi. (first)", correct: "doesn't come", explanation: "First conditional if-clause → present negative: doesn't come." },
        { id: "e3q8", prompt: "Dogs ___ (follow) you if you give them food. (zero)", correct: "follow", explanation: "Zero conditional result → present simple: follow." },
        { id: "e3q9", prompt: "She ___ (be) a great teacher if she chose that career. (second)", correct: "would be", explanation: "Second conditional result → would be." },
        { id: "e3q10", prompt: "If you ___ (study) tonight, you'll be ready for the test. (first)", correct: "study", explanation: "First conditional if-clause → present simple: study." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Harder) — Mixed challenge",
      instructions: "Read each sentence and choose the correct option. These questions test your understanding of all three types.",
      questions: [
        { id: "e4q1", prompt: "Which sentence uses the SECOND conditional correctly?", options: ["If it rains, I'll stay home.", "If I were a bird, I'd fly away.", "If you heat water, it boils."], correctIndex: 1, explanation: "If I were a bird → unreal/impossible → Second conditional." },
        { id: "e4q2", prompt: "Which sentence uses the ZERO conditional correctly?", options: ["If I won the lottery, I'd be rich.", "If you mix red and blue, you get purple.", "If she calls, I'll answer."], correctIndex: 1, explanation: "Colour mixing = scientific fact → Zero conditional." },
        { id: "e4q3", prompt: "Which sentence uses the FIRST conditional correctly?", options: ["If I had time, I'd help.", "If it's sunny tomorrow, we'll go out.", "If you freeze water, it becomes ice."], correctIndex: 1, explanation: "Real future possibility → First conditional." },
        { id: "e4q4", prompt: "'If I ___ you, I'd apologise.' What's the missing word?", options: ["am", "were", "will be"], correctIndex: 1, explanation: "If I were you → standard Second conditional advice phrase." },
        { id: "e4q5", prompt: "'If she ___, she'll miss the meeting.' (She might be late)", options: ["is late", "were late", "was late"], correctIndex: 0, explanation: "Real future possibility → First conditional: is late." },
        { id: "e4q6", prompt: "'Babies ___ if they're hungry.' Which form fits?", options: ["will cry", "would cry", "cry"], correctIndex: 2, explanation: "General truth about babies → Zero conditional: cry." },
        { id: "e4q7", prompt: "What does this sentence express? 'If I spoke Japanese, I'd work in Tokyo.'", options: ["A real future plan", "A hypothetical situation (I don't speak Japanese)", "A general fact"], correctIndex: 1, explanation: "The speaker doesn't speak Japanese → Second conditional = hypothetical." },
        { id: "e4q8", prompt: "'If you ___ this switch, the light goes off.' (always true)", options: ["flip", "flipped", "will flip"], correctIndex: 0, explanation: "Zero conditional fact → present simple: flip." },
        { id: "e4q9", prompt: "Which sentence is grammatically INCORRECT?", options: ["If I had more time, I would read more.", "If it will rain, I'll take an umbrella.", "If plants don't get light, they die."], correctIndex: 1, explanation: "Never use 'will' in the if-clause: ✗ If it will rain → ✓ If it rains." },
        { id: "e4q10", prompt: "'If he ___ his glasses, he can't read.' (general truth)", options: ["doesn't wear", "didn't wear", "wouldn't wear"], correctIndex: 0, explanation: "Zero conditional fact about him → doesn't wear." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b1">Grammar B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">All Conditionals (0 / 1 / 2)</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          All Conditionals{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">0 / 1 / 2</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Mixed practice for all three conditionals. <b>Zero</b> (if + present → present) for facts and habits. <b>First</b> (if + present → will) for real future situations. <b>Second</b> (if + past → would) for hypothetical and unreal situations.
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
                        {score.percent >= 80 ? "Excellent! You've mastered all three conditionals." : score.percent >= 50 ? "Good effort! Review any conditional you're unsure about." : "Keep practising — check the Explanation tab for a summary of all three."}
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
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/relative-clauses-defining" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Relative Clauses — Defining →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>All Conditionals — Quick Reference (B1)</h2>

      <div className="not-prose mt-4 grid gap-4">
        {[
          {
            type: "Zero Conditional",
            structure: "If + present simple → present simple",
            use: "Facts, scientific laws, habits — always true",
            ex: "If you heat water to 100°C, it boils.",
            color: "border-sky-200 bg-sky-50",
            badge: "bg-sky-200 text-sky-800",
          },
          {
            type: "First Conditional",
            structure: "If + present simple → will + infinitive",
            use: "Real, possible future situations",
            ex: "If it rains tomorrow, I'll stay home.",
            color: "border-violet-200 bg-violet-50",
            badge: "bg-violet-200 text-violet-800",
          },
          {
            type: "Second Conditional",
            structure: "If + past simple → would + infinitive",
            use: "Hypothetical, unlikely or impossible situations",
            ex: "If I had a million pounds, I'd travel the world.",
            color: "border-emerald-200 bg-emerald-50",
            badge: "bg-emerald-200 text-emerald-800",
          },
        ].map(({ type, structure, use, ex, color, badge }) => (
          <div key={type} className={`rounded-2xl border p-5 ${color}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-black ${badge}`}>{type}</span>
            </div>
            <div className="text-sm font-black text-slate-900 mb-1">{structure}</div>
            <div className="text-sm text-slate-600 mb-2">{use}</div>
            <div className="text-sm text-slate-700 italic">{ex}</div>
          </div>
        ))}
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800 space-y-2">
          <div className="font-black text-slate-900">💡 Key rules for all conditionals:</div>
          <div>✓ <b>Never use 'will' in the if-clause</b>: If it rains (not: if it will rain)</div>
          <div>✓ <b>Second conditional: 'were' for all persons</b>: If I were you… (formal)</div>
          <div>✓ <b>Comma only when if-clause comes first</b>: If it rains, I'll stay. / I'll stay if it rains.</div>
        </div>
      </div>
    </div>
  );
}
