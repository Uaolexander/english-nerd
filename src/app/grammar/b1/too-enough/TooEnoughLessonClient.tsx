"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function TooEnoughLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — too or enough?",
      instructions: "Choose 'too' or 'enough' to complete the sentence.",
      questions: [
        { id: "e1q1", prompt: "This coffee is ___ hot to drink.", options: ["too", "enough"], correctIndex: 0, explanation: "too + adjective = more than needed/wanted: too hot." },
        { id: "e1q2", prompt: "She isn't old ___ to drive.", options: ["too", "enough"], correctIndex: 1, explanation: "adjective + enough = the required amount: old enough." },
        { id: "e1q3", prompt: "I'm ___ tired to go out tonight.", options: ["too", "enough"], correctIndex: 0, explanation: "too + adjective: too tired." },
        { id: "e1q4", prompt: "He doesn't earn ___ money to buy a house.", options: ["too", "enough"], correctIndex: 1, explanation: "enough + noun: enough money." },
        { id: "e1q5", prompt: "The bag is ___ heavy for me to carry.", options: ["too", "enough"], correctIndex: 0, explanation: "too + adjective: too heavy." },
        { id: "e1q6", prompt: "Is there ___ time to finish the project?", options: ["too", "enough"], correctIndex: 1, explanation: "enough + noun: enough time." },
        { id: "e1q7", prompt: "This jacket is ___ small — I need a bigger size.", options: ["too", "enough"], correctIndex: 0, explanation: "too + adjective: too small." },
        { id: "e1q8", prompt: "Are you warm ___? Do you need a blanket?", options: ["too", "enough"], correctIndex: 1, explanation: "adjective + enough: warm enough." },
        { id: "e1q9", prompt: "I can't sleep — it's ___ noisy outside.", options: ["too", "enough"], correctIndex: 0, explanation: "too + adjective: too noisy." },
        { id: "e1q10", prompt: "There aren't ___ chairs for everyone.", options: ["too", "enough"], correctIndex: 1, explanation: "enough + noun (plural): enough chairs." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Position of too and enough",
      instructions: "Choose the sentence with the correct word order.",
      questions: [
        { id: "e2q1", prompt: "Which is correct?", options: ["She is enough tall to reach it.", "She is tall enough to reach it."], correctIndex: 1, explanation: "enough comes AFTER the adjective: tall enough." },
        { id: "e2q2", prompt: "Which is correct?", options: ["It's too cold to swim.", "It's cold too to swim."], correctIndex: 0, explanation: "too comes BEFORE the adjective: too cold." },
        { id: "e2q3", prompt: "Which is correct?", options: ["There is enough food for everyone.", "There is food enough for everyone."], correctIndex: 0, explanation: "enough comes BEFORE the noun: enough food." },
        { id: "e2q4", prompt: "Which is correct?", options: ["He runs too slowly to win.", "He runs slowly too to win."], correctIndex: 0, explanation: "too comes BEFORE the adverb: too slowly." },
        { id: "e2q5", prompt: "Which is correct?", options: ["I don't have money enough.", "I don't have enough money."], correctIndex: 1, explanation: "enough before noun: enough money." },
        { id: "e2q6", prompt: "Which is correct?", options: ["The film was enough boring to leave.", "The film was boring enough to leave."], correctIndex: 1, explanation: "enough after adjective: boring enough." },
        { id: "e2q7", prompt: "Which is correct?", options: ["She speaks quickly too.", "She speaks too quickly."], correctIndex: 1, explanation: "too before adverb: too quickly." },
        { id: "e2q8", prompt: "Which is correct?", options: ["We have enough time to finish.", "We have time enough to finish."], correctIndex: 0, explanation: "enough before noun: enough time." },
        { id: "e2q9", prompt: "Which is correct?", options: ["He is enough strong to lift it.", "He is strong enough to lift it."], correctIndex: 1, explanation: "enough after adjective: strong enough." },
        { id: "e2q10", prompt: "Which is correct?", options: ["It was too expensive to buy.", "It was expensive too to buy."], correctIndex: 0, explanation: "too before adjective: too expensive." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write too or enough",
      instructions: "Complete the sentence with 'too' or 'enough'. Put it in the correct position.",
      questions: [
        { id: "e3q1", prompt: "The soup is ___ hot to eat. (too/enough)", correct: "too", explanation: "too + hot: the soup is too hot to eat." },
        { id: "e3q2", prompt: "He isn't experienced ___ for this job.", correct: "enough", explanation: "adjective + enough: experienced enough." },
        { id: "e3q3", prompt: "There isn't ___ space in the car for everyone.", correct: "enough", explanation: "enough + noun: enough space." },
        { id: "e3q4", prompt: "She's ___ young to understand this.", correct: "too", explanation: "too + adjective: too young." },
        { id: "e3q5", prompt: "I didn't have ___ money to buy it.", correct: "enough", explanation: "enough + noun: enough money." },
        { id: "e3q6", prompt: "The film is ___ long — it lasts four hours!", correct: "too", explanation: "too + adjective: too long." },
        { id: "e3q7", prompt: "Are you fit ___ to run a marathon?", correct: "enough", explanation: "adjective + enough: fit enough." },
        { id: "e3q8", prompt: "He speaks ___ fast for me to understand.", correct: "too", explanation: "too + adverb: too fast." },
        { id: "e3q9", prompt: "We don't have ___ time to finish everything.", correct: "enough", explanation: "enough + noun: enough time." },
        { id: "e3q10", prompt: "It was ___ cold to go outside without a coat.", correct: "too", explanation: "too + adjective: too cold." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Hardest) — too, enough + to-infinitive",
      instructions: "Choose the correct sentence. Pay attention to too/enough with to-infinitive constructions and for + object.",
      questions: [
        { id: "e4q1", prompt: "Which is correct?", options: ["It's too heavy for me to carry.", "It's too heavy for me carrying."], correctIndex: 0, explanation: "too + adj + for + person + to-infinitive: too heavy for me to carry." },
        { id: "e4q2", prompt: "Which is correct?", options: ["She's old enough that she can vote.", "She's old enough to vote."], correctIndex: 1, explanation: "enough + to-infinitive is more natural: old enough to vote." },
        { id: "e4q3", prompt: "Which is correct?", options: ["The box is too big for it to fit in the car.", "The box is too big to fit in the car."], correctIndex: 1, explanation: "When subject and object are the same, no 'for it': too big to fit." },
        { id: "e4q4", prompt: "Which is correct?", options: ["There isn't enough room for everyone to sit.", "There isn't room enough for everyone to sit."], correctIndex: 0, explanation: "enough + noun: enough room." },
        { id: "e4q5", prompt: "Which is correct?", options: ["He's too weak for lifting the box.", "He's too weak to lift the box."], correctIndex: 1, explanation: "too + adj + to-infinitive: too weak to lift." },
        { id: "e4q6", prompt: "Choose the sentence that means 'She can't reach it — she's short':", options: ["She's too short to reach it.", "She's short enough to reach it."], correctIndex: 0, explanation: "too short = not tall enough → can't reach it." },
        { id: "e4q7", prompt: "Choose the sentence that means 'He can do it — he's strong':", options: ["He's too strong to do it.", "He's strong enough to do it."], correctIndex: 1, explanation: "strong enough = has sufficient strength → can do it." },
        { id: "e4q8", prompt: "Which is correct?", options: ["It was too dark for us to see anything.", "It was too dark for us seeing anything."], correctIndex: 0, explanation: "too + adj + for + person + to-infinitive." },
        { id: "e4q9", prompt: "Which is correct?", options: ["Do you have enough confidence speaking in public?", "Do you have enough confidence to speak in public?"], correctIndex: 1, explanation: "enough + noun + to-infinitive: enough confidence to speak." },
        { id: "e4q10", prompt: "Which is correct?", options: ["She isn't enough fast to qualify.", "She isn't fast enough to qualify."], correctIndex: 1, explanation: "adjective + enough: fast enough to qualify." },
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
        <span className="text-slate-700 font-medium">Too &amp; Enough</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Too &amp;{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Enough</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        <b>Too</b> means more than needed (negative): <i>It&apos;s <b>too hot</b> to drink.</i> <b>Enough</b> means the right amount (positive or negative): <i>She&apos;s <b>tall enough</b> to reach it. / There isn&apos;t <b>enough time</b>.</i> Position matters: <b>too</b> before adjective, <b>enough</b> after adjective but before noun.
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
        <a href="/grammar/b1/so-such" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: So &amp; Such →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Too &amp; Enough (B1)</h2>

      <div className="not-prose mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="text-xs font-bold uppercase text-red-600 mb-2">TOO — more than needed</div>
          <div className="grid gap-2 text-sm">
            <div><span className="font-black text-slate-900">too + adjective</span><br /><span className="italic text-slate-600">It&apos;s too hot to eat.</span></div>
            <div><span className="font-black text-slate-900">too + adverb</span><br /><span className="italic text-slate-600">She speaks too quickly.</span></div>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-2">ENOUGH — sufficient amount</div>
          <div className="grid gap-2 text-sm">
            <div><span className="font-black text-slate-900">adjective + enough</span><br /><span className="italic text-slate-600">She&apos;s tall enough to reach it.</span></div>
            <div><span className="font-black text-slate-900">enough + noun</span><br /><span className="italic text-slate-600">We have enough time.</span></div>
          </div>
        </div>
      </div>

      <h3>With to-infinitive</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-3 text-sm text-slate-700">
        <div className="italic">It&apos;s <b>too cold</b> <b>to swim</b>. (= so cold that we can&apos;t swim)</div>
        <div className="italic">She&apos;s <b>old enough</b> <b>to drive</b>. (= sufficiently old)</div>
        <div className="italic">It&apos;s <b>too heavy</b> <b>for me to carry</b>. (for + person + to-infinitive)</div>
        <div className="italic">There isn&apos;t <b>enough room</b> <b>for everyone to sit</b>.</div>
      </div>

      <h3>Patterns at a glance</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="grid gap-2">
          {[
            ["Pattern", "Example"],
            ["too + adj", "too tired, too small, too late"],
            ["too + adv", "too fast, too slowly, too often"],
            ["adj + enough", "tall enough, warm enough, good enough"],
            ["enough + noun", "enough money, enough time, enough chairs"],
            ["not + adj + enough", "not tall enough, not warm enough"],
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-2 gap-4 text-sm ${i === 0 ? "font-bold text-slate-500 text-xs uppercase pb-2 border-b" : "text-slate-700"}`}>
              <span className={i === 0 ? "" : "font-semibold text-slate-900"}>{row[0]}</span>
              <span className="italic">{row[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 too ≠ very:</span> <b>too</b> implies a problem — something prevents an action. <b>very</b> is neutral intensifier.
          <div className="mt-2 grid gap-1 italic text-slate-700">
            <div>It&apos;s <b>very</b> hot. (just an observation)</div>
            <div>It&apos;s <b>too</b> hot to drink. (so hot I can&apos;t drink it)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
