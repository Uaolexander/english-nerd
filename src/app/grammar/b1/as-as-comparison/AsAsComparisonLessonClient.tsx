"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function AsAsComparisonLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — as…as or not as…as?",
      instructions: "Choose the correct form to complete the comparison.",
      questions: [
        { id: "e1q1", prompt: "Tom is 180cm. Paul is 180cm. Tom is ___ tall ___ Paul.", options: ["as / as", "not as / as", "more / than"], correctIndex: 0, explanation: "Equal height → as tall as." },
        { id: "e1q2", prompt: "My car is slow. Your car is fast. My car is ___ fast ___ yours.", options: ["as / as", "not as / as", "so / as"], correctIndex: 1, explanation: "Unequal — mine is slower → not as fast as." },
        { id: "e1q3", prompt: "This test was easy. The last test was easy too. This test was ___ difficult ___ the last one.", options: ["as / as", "not as / as", "more / than"], correctIndex: 0, explanation: "Equal difficulty → as difficult as." },
        { id: "e1q4", prompt: "She earns £2000. He earns £3000. She doesn't earn ___ much ___ him.", options: ["as / as", "so / as", "more / than"], correctIndex: 0, explanation: "not as much as = less than." },
        { id: "e1q5", prompt: "Both cities have a population of 1 million. City A is ___ big ___ City B.", options: ["as / as", "not as / as", "such / as"], correctIndex: 0, explanation: "Equal size → as big as." },
        { id: "e1q6", prompt: "Her new flat is smaller than her old one. Her new flat is ___ spacious ___ her old one.", options: ["as / as", "not as / as", "more / than"], correctIndex: 1, explanation: "The new flat is smaller → not as spacious as." },
        { id: "e1q7", prompt: "The film got great reviews. The book got great reviews too. The film was ___ good ___ the book.", options: ["as / as", "not as / as", "so / than"], correctIndex: 0, explanation: "Equal quality → as good as." },
        { id: "e1q8", prompt: "I run 10km/h. She runs 12km/h. I don't run ___ fast ___ her.", options: ["as / as", "so / as", "more / than"], correctIndex: 0, explanation: "not as fast as = slower." },
        { id: "e1q9", prompt: "Both phones cost £500. This phone is ___ expensive ___ that one.", options: ["as / as", "not as / as", "more / than"], correctIndex: 0, explanation: "Equal price → as expensive as." },
        { id: "e1q10", prompt: "He's usually calm but today he's very angry. He's ___ calm ___ usual.", options: ["as / as", "not as / as", "more / than"], correctIndex: 1, explanation: "Less calm than usual → not as calm as." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Choose the correct comparison",
      instructions: "Choose the sentence that correctly expresses the comparison.",
      questions: [
        { id: "e2q1", prompt: "Anna: 165cm. Maria: 165cm. Which is correct?", options: ["Anna is as tall as Maria.", "Anna is not as tall as Maria."], correctIndex: 0, explanation: "Same height → as tall as." },
        { id: "e2q2", prompt: "This coffee is weak. The other one was strong. Which is correct?", options: ["This coffee is as strong as the other.", "This coffee isn't as strong as the other."], correctIndex: 1, explanation: "This one is weaker → isn't as strong as." },
        { id: "e2q3", prompt: "Both brothers are 30 years old. Which is correct?", options: ["He's as old as his brother.", "He's not as old as his brother."], correctIndex: 0, explanation: "Same age → as old as." },
        { id: "e2q4", prompt: "My score: 70%. Her score: 90%. Which is correct?", options: ["I didn't do as well as her.", "I did as well as her."], correctIndex: 0, explanation: "Lower score → didn't do as well as." },
        { id: "e2q5", prompt: "The film: 2 hours. The book: 2 hours to read. Which is correct?", options: ["Reading the book takes as long as watching the film.", "Reading the book doesn't take as long as watching the film."], correctIndex: 0, explanation: "Same duration → as long as." },
        { id: "e2q6", prompt: "Train: 2 hours. Bus: 3 hours. Which is correct?", options: ["The train is as fast as the bus.", "The train isn't as slow as the bus."], correctIndex: 1, explanation: "The train is faster → isn't as slow as the bus." },
        { id: "e2q7", prompt: "Room A: 20m². Room B: 20m². Which is correct?", options: ["Room A is as big as Room B.", "Room A isn't as big as Room B."], correctIndex: 0, explanation: "Equal size → as big as." },
        { id: "e2q8", prompt: "Today 15°C. Yesterday 20°C. Which is correct?", options: ["Today is as warm as yesterday.", "Today isn't as warm as yesterday."], correctIndex: 1, explanation: "Cooler today → isn't as warm as yesterday." },
        { id: "e2q9", prompt: "He works 8hrs/day. She works 8hrs/day. Which is correct?", options: ["He works as hard as she does.", "He doesn't work as hard as she does."], correctIndex: 0, explanation: "Same hours → as hard as." },
        { id: "e2q10", prompt: "His essay: B+. Her essay: A+. Which is correct?", options: ["His essay was as good as hers.", "His essay wasn't as good as hers."], correctIndex: 1, explanation: "Lower grade → wasn't as good as." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the comparison",
      instructions: "Complete the sentence using as…as or not as…as + the adjective given.",
      questions: [
        { id: "e3q1", prompt: "My sister is 25. I'm also 25. I'm ___ (old) ___ my sister.", correct: "as old as", explanation: "Equal age → as old as." },
        { id: "e3q2", prompt: "Her phone costs €300. Mine costs €200. My phone isn't ___ (expensive) ___ hers.", correct: "as expensive as", explanation: "Mine is cheaper → not as expensive as." },
        { id: "e3q3", prompt: "He speaks Spanish perfectly. She speaks it perfectly too. She speaks ___ (well) ___ him.", correct: "as well as", explanation: "Equal skill → as well as." },
        { id: "e3q4", prompt: "This summer was 28°C average. Last summer was 32°C. This summer wasn't ___ (hot) ___ last year.", correct: "as hot as", explanation: "Cooler this year → not as hot as." },
        { id: "e3q5", prompt: "The journey takes 3 hours. It took 3 hours last time too. It took ___ (long) ___ before.", correct: "as long as", explanation: "Same duration → as long as." },
        { id: "e3q6", prompt: "He's 80kg. His brother is 90kg. He isn't ___ (heavy) ___ his brother.", correct: "as heavy as", explanation: "Lighter → not as heavy as." },
        { id: "e3q7", prompt: "She plays piano professionally. I play it well too. I play ___ (well) ___ she does.", correct: "as well as", explanation: "Equal skill → as well as." },
        { id: "e3q8", prompt: "The new model costs €500. The old one cost €800. The new model isn't ___ (expensive) ___ the old one.", correct: "as expensive as", explanation: "Cheaper → not as expensive as." },
        { id: "e3q9", prompt: "The second test was easy. The first was easy too. The second test was ___ (difficult) ___ the first.", correct: "as difficult as", explanation: "Equal difficulty → as difficult as." },
        { id: "e3q10", prompt: "I arrived at 9. She arrived at 9 too. I arrived ___ (early) ___ she did.", correct: "as early as", explanation: "Same time → as early as." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Hardest) — twice as…as and other multipliers",
      instructions: "Choose the correct sentence with multipliers (twice as…as, three times as…as, half as…as).",
      questions: [
        { id: "e4q1", prompt: "His salary is £60,000. Hers is £30,000. Which is correct?", options: ["He earns twice as much as her.", "He earns as twice much as her."], correctIndex: 0, explanation: "twice as much as = correct order." },
        { id: "e4q2", prompt: "This building is 100m tall. That one is 200m tall. Which is correct?", options: ["That building is twice as tall as this one.", "That building is as twice tall as this one."], correctIndex: 0, explanation: "twice + as + adj + as." },
        { id: "e4q3", prompt: "My journey: 1 hour. His: 3 hours. Which is correct?", options: ["His journey takes three times as long as mine.", "His journey takes as three times long as mine."], correctIndex: 0, explanation: "multiplier + as + adj + as." },
        { id: "e4q4", prompt: "She earns €1000. He earns €500. Which is correct?", options: ["He earns half as much as her.", "He earns as half much as her."], correctIndex: 0, explanation: "half as much as = correct." },
        { id: "e4q5", prompt: "The car costs £20,000. The motorbike costs £10,000. Which is correct?", options: ["The car is twice as expensive as the motorbike.", "The car is as expensive as twice the motorbike."], correctIndex: 0, explanation: "twice as expensive as." },
        { id: "e4q6", prompt: "Which sentence uses 'as…as' correctly with 'not'?", options: ["She's not as clever as I thought.", "She's not clever as I thought."], correctIndex: 0, explanation: "not as + adj + as: not as clever as." },
        { id: "e4q7", prompt: "Which sentence is correct?", options: ["He's not as fast as his brother.", "He's not as fast than his brother."], correctIndex: 0, explanation: "as…as (not as…than): not as fast as." },
        { id: "e4q8", prompt: "City A: 4 million people. City B: 2 million. Which is correct?", options: ["City A has twice as many people as City B.", "City A has as twice many people as City B."], correctIndex: 0, explanation: "twice as many as = correct order." },
        { id: "e4q9", prompt: "Which sentence is correct?", options: ["This task took as long as I expected.", "This task took as long than I expected."], correctIndex: 0, explanation: "as long as (not as long than)." },
        { id: "e4q10", prompt: "Package A: 5kg. Package B: 5kg. Which is correct?", options: ["Package A is as heavy as Package B.", "Package A is as heavy than Package B."], correctIndex: 0, explanation: "as heavy as (not than)." },
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
        <span className="text-slate-700 font-medium">As…as Comparisons</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          As…as{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Comparisons</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>as…as</b> to say two things are equal: <i>She is <b>as tall as</b> her brother.</i> Use <b>not as…as</b> to show inequality: <i>This film isn't <b>as good as</b> the book.</i> Multipliers like <b>twice as…as</b> show how much bigger or smaller.
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
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))} />
                                    <span className="text-slate-900 text-sm">{opt}</span>
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
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/wish-past" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Wish + Past Simple →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>As…as Comparisons (B1)</h2>
      <div className="not-prose mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-2">Equal — as…as</div>
          <div className="text-sm text-slate-700 space-y-1 italic">
            <div>She is <b>as tall as</b> her brother.</div>
            <div>This test is <b>as difficult as</b> the last.</div>
            <div>He runs <b>as fast as</b> a professional.</div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="text-xs font-bold uppercase text-red-600 mb-2">Unequal — not as…as</div>
          <div className="text-sm text-slate-700 space-y-1 italic">
            <div>This film isn&apos;t <b>as good as</b> the book.</div>
            <div>He doesn&apos;t earn <b>as much as</b> she does.</div>
            <div>I&apos;m not <b>as tired as</b> yesterday.</div>
          </div>
        </div>
      </div>

      <h3>With multipliers</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-2 text-sm text-slate-700 italic">
        <div>He earns <b>twice as much as</b> me. (2×)</div>
        <div>This room is <b>three times as big as</b> that one. (3×)</div>
        <div>She works <b>half as many hours as</b> before. (½×)</div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800 space-y-1">
          <div><span className="font-black text-slate-900">💡 Common mistakes:</span></div>
          <div>✗ not as fast <b>than</b> → ✓ not as fast <b>as</b></div>
          <div>✗ <b>more</b> tall as → ✓ <b>as</b> tall as (use as…as, not more…as)</div>
          <div>✗ twice as <b>much than</b> → ✓ twice as much <b>as</b></div>
        </div>
      </div>
    </div>
  );
}
