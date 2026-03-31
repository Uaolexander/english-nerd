"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function ExtrapositionLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — It + be + adjective + that/to-inf",
      instructions: "Extraposition postpones a heavy subject clause to the end, using 'it' as a dummy subject. Choose the correct extraposition form.",
      questions: [
        { id: "e1q1", prompt: "That she passed the exam was surprising. → ___ that she passed the exam.", options: ["It was surprising", "It surprised", "There was surprising"], correctIndex: 0, explanation: "Extraposition: It + was + adjective + that + postponed clause." },
        { id: "e1q2", prompt: "___ to finish the project on time was impossible.", options: ["It proved", "It was impossible", "There was impossible"], correctIndex: 1, explanation: "It + was + adjective + to-infinitive: It was impossible to finish." },
        { id: "e1q3", prompt: "It is essential ___ all participants sign the agreement.", options: ["that", "to", "for"], correctIndex: 0, explanation: "It is essential + that + clause (mandative context): It is essential that all participants sign." },
        { id: "e1q4", prompt: "It is advisable ___ carry a copy of your passport.", options: ["that you", "to", "Both are correct"], correctIndex: 2, explanation: "Both 'It is advisable to carry' and 'It is advisable that you carry' are correct." },
        { id: "e1q5", prompt: "___ clear that further investment was needed.", options: ["It became", "There became", "It becomes"], correctIndex: 0, explanation: "It + became + adjective + that: It became clear that." },
        { id: "e1q6", prompt: "It is worth ___ the instructions carefully before you begin.", options: ["reading", "to read", "read"], correctIndex: 0, explanation: "It is worth + gerund: It is worth reading." },
        { id: "e1q7", prompt: "It is no use ___ about what might have been.", options: ["worry", "to worry", "worrying"], correctIndex: 2, explanation: "It is no use + gerund: It is no use worrying." },
        { id: "e1q8", prompt: "___ remarkable that no one was injured in the explosion.", options: ["It was", "There was", "It is being"], correctIndex: 0, explanation: "It + was + adjective + that: It was remarkable that." },
        { id: "e1q9", prompt: "It doesn't matter ___ you choose — both options are equally good.", options: ["which", "what", "Both are correct"], correctIndex: 2, explanation: "It doesn't matter + wh-clause. Both 'which' and 'what' are possible here." },
        { id: "e1q10", prompt: "___ likely that the election will be called in the autumn.", options: ["It seems", "There seems", "It seems to be"], correctIndex: 0, explanation: "It seems + adjective + that: It seems likely that." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — It seems/appears/turns out/happens that",
      instructions: "Certain verbs (seem, appear, turn out, happen, emerge, transpire) use extraposition with 'it' as a dummy subject. Choose the correct form.",
      questions: [
        { id: "e2q1", prompt: "___ that the documents had been forged.", options: ["It emerged", "There emerged", "It had emerged"], correctIndex: 0, explanation: "It emerged + that + clause = formal extraposition verb." },
        { id: "e2q2", prompt: "___ to have been a misunderstanding.", options: ["It appears", "There appears", "It is appeared"], correctIndex: 0, explanation: "It appears + to-infinitive: It appears to have been (passive perfect)." },
        { id: "e2q3", prompt: "___ that the two companies had been secretly negotiating for months.", options: ["It transpired", "There transpired", "It is transpiring"], correctIndex: 0, explanation: "It transpired + that = formal/journalistic usage." },
        { id: "e2q4", prompt: "___ that I already knew him from university.", options: ["It happened", "There happened", "It was happened"], correctIndex: 0, explanation: "It happened + that = coincidence/chance." },
        { id: "e2q5", prompt: "___ that the original budget was significantly underestimated.", options: ["It turned out", "There turned out", "It was turned out"], correctIndex: 0, explanation: "It turned out + that = result was discovered." },
        { id: "e2q6", prompt: "___ to be more complex than initially thought.", options: ["It proved", "There proved", "It was proved"], correctIndex: 0, explanation: "It proved + to-infinitive: It proved to be more complex." },
        { id: "e2q7", prompt: "___ that no one had informed the board of directors.", options: ["It appeared", "There appeared", "It is appearing"], correctIndex: 0, explanation: "It appeared + that + clause." },
        { id: "e2q8", prompt: "___ that the merger would proceed after all.", options: ["It seemed", "There seemed", "It was seemed"], correctIndex: 0, explanation: "It seemed + that = extraposition with seem." },
        { id: "e2q9", prompt: "___ that the suspect had an alibi.", options: ["It later emerged", "There later emerged", "It was later emerged"], correctIndex: 0, explanation: "It emerged + that (past, with adverb 'later')." },
        { id: "e2q10", prompt: "___ to be several errors in the original report.", options: ["There turned out", "It turned out", "Both are correct"], correctIndex: 2, explanation: "Both 'It turned out to be' (extraposition) and 'There turned out to be' (existential) are correct here." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Postponed subjects & for-to constructions",
      instructions: "Gerund and infinitive clauses as subjects can be extraposed. 'For + object + to-inf' is a frequent formal pattern. Choose the correct form.",
      questions: [
        { id: "e3q1", prompt: "To complete the project on time was not easy. → ___ not easy to complete the project on time.", options: ["It was", "There was", "It is"], correctIndex: 0, explanation: "Extraposition of to-inf: It was + adj + to + inf." },
        { id: "e3q2", prompt: "___ him to resign would be a serious mistake.", options: ["It would be", "For", "It is for"], correctIndex: 1, explanation: "For + object + to-infinitive = subject clause: For him to resign would be a serious mistake." },
        { id: "e3q3", prompt: "It would be better ___ you to reconsider your position.", options: ["for", "that", "Both are correct"], correctIndex: 2, explanation: "Both 'It would be better for you to reconsider' and 'It would be better that you reconsider' are acceptable." },
        { id: "e3q4", prompt: "It is unusual ___ such a young candidate to be appointed to this role.", options: ["for", "that", "to"], correctIndex: 0, explanation: "It is unusual + for + object + to-inf: It is unusual for such a young candidate to be appointed." },
        { id: "e3q5", prompt: "Swimming every day is beneficial. → ___ beneficial to swim every day.", options: ["It is", "There is", "It was"], correctIndex: 0, explanation: "Extraposition of gerund → it + is + adj + to + inf (infinitive preferred over gerund in extraposition)." },
        { id: "e3q6", prompt: "___ no easy task to balance the competing demands of the role.", options: ["It is", "There is", "It was"], correctIndex: 0, explanation: "It is + no + noun: It is no easy task to balance…" },
        { id: "e3q7", prompt: "___ odd that no one thought to check the figures.", options: ["It strikes me as", "It strikes to me", "It is striking me as"], correctIndex: 0, explanation: "It strikes me as + adj + that: It strikes me as odd that." },
        { id: "e3q8", prompt: "It is vital ___ the findings be independently verified.", options: ["that", "for", "to have"], correctIndex: 0, explanation: "It is vital + that + mandative subjunctive: It is vital that the findings be verified." },
        { id: "e3q9", prompt: "___ uncommon for species to adapt so rapidly.", options: ["It is", "There is", "It is being"], correctIndex: 0, explanation: "It is + adjective + for + NP + to-inf: It is uncommon for species to adapt." },
        { id: "e3q10", prompt: "What surprised everyone was ___ she had kept the secret for so long.", options: ["how", "that", "Both are correct"], correctIndex: 2, explanation: "Both 'how she had kept' (degree of surprise) and 'that she had kept' (the fact) are grammatically correct after 'was'." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using extraposition",
      instructions: "Rewrite each sentence using 'it' as a dummy subject. Write the full rewritten sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "That the project was completed on time was remarkable.", correct: "it was remarkable that the project was completed on time", explanation: "It + was + adjective + that + postponed clause." },
        { id: "e4q2", prompt: "To work in such conditions is dangerous.", correct: "it is dangerous to work in such conditions", explanation: "It + is + adjective + to-infinitive." },
        { id: "e4q3", prompt: "That no one noticed the error turned out to be fortunate.", correct: "it turned out to be fortunate that no one noticed the error", explanation: "It turned out to be + adjective + that + clause." },
        { id: "e4q4", prompt: "Asking for a second opinion is always advisable.", correct: "it is always advisable to ask for a second opinion", explanation: "It is always advisable + to-infinitive (gerund subject → extraposed infinitive)." },
        { id: "e4q5", prompt: "That the negotiations had collapsed surprised everyone.", correct: "it surprised everyone that the negotiations had collapsed", explanation: "It + surprised + object + that + clause." },
        { id: "e4q6", prompt: "For the committee to reject the proposal would be unprecedented.", correct: "it would be unprecedented for the committee to reject the proposal", explanation: "It + would be + adj + for + NP + to-inf." },
        { id: "e4q7", prompt: "That the two suspects knew each other emerged only later.", correct: "it only emerged later that the two suspects knew each other", explanation: "It + emerged + (adverb) + that + clause." },
        { id: "e4q8", prompt: "To ignore the warning signs would be irresponsible.", correct: "it would be irresponsible to ignore the warning signs", explanation: "It + would be + adjective + to-infinitive." },
        { id: "e4q9", prompt: "That the building was structurally unsound became clear during the inspection.", correct: "it became clear during the inspection that the building was structurally unsound", explanation: "It + became + clear + (adverbial) + that + clause." },
        { id: "e4q10", prompt: "For all parties to agree on a single solution appears unlikely.", correct: "it appears unlikely for all parties to agree on a single solution", explanation: "It + appears + adjective + for + NP + to-inf." },
      ],
    },
  }), []);

  const current = sets[exNo];

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
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Extraposition</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Extraposition</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Extraposition moves a heavy subject clause to the end of the sentence, using <b>it</b> as a dummy subject in its place: <i>It is remarkable that… / It is impossible to… / It seems that… / It turned out to be…</i> This structure is preferred in formal writing because it front-loads the key evaluation and postpones the detail.
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
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All C1 Grammar →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Extraposition (C1)</h2>
      <p className="not-prose mt-2 text-slate-700 text-sm">Extraposition postpones a clause (that-clause, to-infinitive, gerund) to the end of a sentence and inserts dummy <b>it</b> in subject position. This is the default in formal English — heavy subjects at the start are unusual.</p>
      <div className="not-prose mt-4 space-y-3">
        {[
          { title: "It + be + adjective + that-clause", ex: "That she survived was miraculous. → It was miraculous that she survived.\nIt is essential that all applicants complete the form." },
          { title: "It + be + adjective + to-infinitive", ex: "To make assumptions is dangerous. → It is dangerous to make assumptions.\nIt is impossible to predict the outcome." },
          { title: "It + be + adjective + for + NP + to-inf", ex: "It is unusual for a company of this size to have no HR department.\nIt would be premature for us to draw conclusions." },
          { title: "It + seem/appear/turn out/prove + that / to-inf", ex: "It seems that the situation is more serious than expected.\nIt turned out to be a false alarm.\nIt proved impossible to reach an agreement." },
          { title: "It + emerge/transpire/happen + that", ex: "It emerged that the minister had known for weeks.\nIt transpired that the two witnesses had met before.\nIt happened that I already knew the answer." },
          { title: "It + verb + object + that-clause", ex: "It surprised everyone that the proposal passed.\nIt struck me as odd that no one questioned the decision.\nIt bothers me that the issue is being ignored." },
          { title: "It is worth / no use / no good + gerund", ex: "It is worth considering all the options.\nIt is no use arguing about it now.\nIt is no good trying to hide the problem." },
        ].map(({ title, ex }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-2">{title}</div>
            <div className="italic text-slate-700 text-sm whitespace-pre-line">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Extraposition vs existential there</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div><b>It</b> = dummy subject replacing a clause: <i>It is clear that…</i></div>
          <div><b>There</b> = existential subject introducing a new referent: <i>There is a problem with…</i></div>
          <div>Do not confuse: <i>It turned out to be an error</i> ≠ <i>There turned out to be an error</i> (both are possible, but have different nuances).</div>
        </div>
      </div>
    </div>
  );
}
