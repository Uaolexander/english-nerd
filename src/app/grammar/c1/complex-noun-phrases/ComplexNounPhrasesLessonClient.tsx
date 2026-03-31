"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function ComplexNounPhrasesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Post-modifying noun phrases",
      instructions: "Nouns can be post-modified by prepositional phrases, relative clauses, participle phrases, infinitive phrases, and that-clauses. Identify the correct post-modifier.",
      questions: [
        { id: "e1q1", prompt: "The decision ___ the merger was controversial.", options: ["to approve", "of approving", "for approving"], correctIndex: 0, explanation: "Noun + to-infinitive: 'the decision to approve' (to-inf post-modifies abstract nouns like decision, attempt, offer, refusal)." },
        { id: "e1q2", prompt: "The fact ___ she had lied was difficult to ignore.", options: ["which", "that", "of which"], correctIndex: 1, explanation: "Noun + that-clause (appositive): 'the fact that she had lied' — the that-clause explains the fact." },
        { id: "e1q3", prompt: "An increase ___ the cost of living was widely reported.", options: ["of", "in", "for"], correctIndex: 1, explanation: "Increase/decrease/fall/rise + in: 'an increase in the cost of living'." },
        { id: "e1q4", prompt: "Her ability ___ difficult problems quickly impressed the panel.", options: ["to solve", "of solving", "for solving"], correctIndex: 0, explanation: "Ability + to-infinitive: 'her ability to solve'." },
        { id: "e1q5", prompt: "The announcement ___ the company would be sold came as a shock.", options: ["of", "which", "that"], correctIndex: 2, explanation: "Noun + that-clause (announcement, news, claim, suggestion, evidence): 'the announcement that the company would be sold'." },
        { id: "e1q6", prompt: "There is growing evidence ___ the treatment is effective.", options: ["of", "that", "Both are correct"], correctIndex: 2, explanation: "Both 'evidence of effectiveness' (noun + of) and 'evidence that…' (appositive that-clause) are correct." },
        { id: "e1q7", prompt: "The need ___ urgent reform has never been greater.", options: ["for", "of", "to"], correctIndex: 0, explanation: "Need + for: 'the need for urgent reform'." },
        { id: "e1q8", prompt: "Her refusal ___ acknowledge the problem frustrated her colleagues.", options: ["of", "to", "for"], correctIndex: 1, explanation: "Refusal + to-infinitive: 'her refusal to acknowledge'." },
        { id: "e1q9", prompt: "The claim ___ the vaccine had side effects was disputed.", options: ["of", "which", "that"], correctIndex: 2, explanation: "Noun + that-clause (appositive): 'the claim that the vaccine had side effects'." },
        { id: "e1q10", prompt: "Their attempt ___ break the world record ended in failure.", options: ["of", "to", "for"], correctIndex: 1, explanation: "Attempt + to-infinitive: 'their attempt to break the world record'." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Apposition & stacked premodifiers",
      instructions: "Apposition places two noun phrases side by side to describe the same thing. Stacked premodifiers (noun + noun + noun) are common in formal/academic writing. Choose the correct or more natural form.",
      questions: [
        { id: "e2q1", prompt: "Which uses apposition correctly?", options: ["My colleague, the project manager, will handle the negotiations.", "My colleague the project manager she will handle the negotiations.", "My colleague, being the project manager, will handle the negotiations."], correctIndex: 0, explanation: "Apposition: two NPs side by side, the second describing the first: 'my colleague, the project manager'." },
        { id: "e2q2", prompt: "Which is the correct stacked premodifier form?", options: ["a government-funded research programme", "a research programme funded by government", "Both are correct"], correctIndex: 2, explanation: "Both are correct; compound premodifier ('government-funded research programme') is more concise." },
        { id: "e2q3", prompt: "Which is more appropriate in formal writing?", options: ["a long-term strategy for economic development", "a strategy that is for economic development in the long term"], correctIndex: 0, explanation: "Stacked premodifiers: 'long-term economic development strategy' or 'long-term strategy for economic development' — both more concise than a verbose relative clause." },
        { id: "e2q4", prompt: "Which sentence uses apposition correctly for a title/name?", options: ["Professor Jane Williams, the lead researcher, presented her findings.", "Professor Jane Williams who is the lead researcher presented her findings.", "Professor Jane Williams, being the lead researcher, presented her findings."], correctIndex: 0, explanation: "Correct apposition: name + comma + descriptive NP + comma." },
        { id: "e2q5", prompt: "Which is the better formal rewrite of 'a plan that cuts costs'?", options: ["a cost-cutting plan", "a plan for the cutting of costs", "a plan that is for cutting of costs"], correctIndex: 0, explanation: "Compound premodifier: 'cost-cutting plan' — noun + present participle as premodifier." },
        { id: "e2q6", prompt: "Which correctly uses an appositive clause?", options: ["The idea that failure is not an option is motivating.", "The idea which failure is not an option is motivating.", "The idea of that failure is not an option is motivating."], correctIndex: 0, explanation: "Appositive that-clause after abstract nouns (idea, belief, view, claim): 'The idea that failure is not an option'." },
        { id: "e2q7", prompt: "Which is the most concise formal version of 'a meeting that takes place every year'?", options: ["an annual meeting", "a yearly-happening meeting", "a meeting happening every year"], correctIndex: 0, explanation: "Premodifying adjective: 'an annual meeting' — most concise." },
        { id: "e2q8", prompt: "Which noun phrase is correctly formed?", options: ["a ten-year prison sentence", "a ten years prison sentence", "a prison sentence of ten years"], correctIndex: 0, explanation: "Hyphenated compound number premodifier: 'a ten-year prison sentence' (no plural after hyphen)." },
        { id: "e2q9", prompt: "Which uses apposition with a pronoun correctly?", options: ["We, the undersigned, hereby declare our opposition.", "We the undersigned we hereby declare our opposition.", "We, being the undersigned, hereby declare our opposition."], correctIndex: 0, explanation: "Apposition with pronoun: 'We, the undersigned' — formal, used in legal/official texts." },
        { id: "e2q10", prompt: "Which premodifier stack is correctly hyphenated?", options: ["a high-speed rail network", "a high speed rail-network", "a high speed rail network"], correctIndex: 0, explanation: "Hyphenated compound adjective before noun: 'high-speed' (but 'rail network' is two separate nouns — no hyphen needed between them)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Complex NPs in academic context",
      instructions: "Academic writing uses dense, complex noun phrases to pack information. Identify the correctly formed or most formal option.",
      questions: [
        { id: "e3q1", prompt: "Which is the most concise academic version of 'the process by which the government makes decisions'?", options: ["the government's decision-making process", "the process of the government making decisions", "the decision-making process of the government"], correctIndex: 0, explanation: "Possessive + compound premodifier: 'the government's decision-making process' is most concise." },
        { id: "e3q2", prompt: "Which noun phrase is correctly post-modified?", options: ["the proposal submitted by the committee", "the proposal that was submitted by the committee", "Both are correct"], correctIndex: 2, explanation: "Both the reduced participle ('submitted by') and the full relative clause ('that was submitted by') are correct." },
        { id: "e3q3", prompt: "Identify the head noun in: 'the rapidly increasing rate of long-term unemployment'.", options: ["rate", "unemployment", "increase"], correctIndex: 0, explanation: "The head noun is 'rate' — everything else premodifies or post-modifies it." },
        { id: "e3q4", prompt: "Which is grammatically correct?", options: ["an evidence-based approach to policy", "an approach evidence-based to policy", "an approach to evidence-based policy"], correctIndex: 0, explanation: "Premodifier before noun: 'evidence-based approach'. 'an approach to evidence-based policy' has a different meaning." },
        { id: "e3q5", prompt: "Which post-modifier correctly completes 'the possibility ___'?", options: ["to introduce new regulations", "that new regulations will be introduced", "Both are correct"], correctIndex: 2, explanation: "Possibility + of + gerund OR possibility + that-clause are both acceptable: 'the possibility that…' / 'the possibility of introducing…'" },
        { id: "e3q6", prompt: "Which is a correctly formed complex NP?", options: ["a well-established, peer-reviewed research methodology", "a research methodology well established and peer reviewed", "Both are correct"], correctIndex: 2, explanation: "Premodifiers ('well-established, peer-reviewed') work before the noun; post-modifiers after are also possible." },
        { id: "e3q7", prompt: "Which correctly nominates the head noun in a complex NP?", options: ["The significant lack of investment in public transport infrastructure is a concern.", "The lack significant of investment in public transport infrastructure is a concern.", "The significant of investment lack in public transport infrastructure is a concern."], correctIndex: 0, explanation: "Head noun = 'lack', premodified by 'significant', post-modified by 'of investment in public transport infrastructure'." },
        { id: "e3q8", prompt: "Which NP is correctly formed with a noun + that-clause?", options: ["the belief that economic growth solves all problems", "the belief of that economic growth solves all problems", "the belief which economic growth solves all problems"], correctIndex: 0, explanation: "Noun + that-clause (appositive): 'the belief that…'. No preposition before 'that'." },
        { id: "e3q9", prompt: "Which is the most formal version of 'the way people use language'?", options: ["the way in which people use language", "the manner of people's language use", "Both are correct"], correctIndex: 2, explanation: "Both are formal and correct. 'The way in which' uses formal relative; 'the manner of people's language use' is more nominal." },
        { id: "e3q10", prompt: "Which correctly uses a non-finite post-modifier?", options: ["the first country to introduce universal healthcare", "the first country that introduced universal healthcare", "Both are correct"], correctIndex: 2, explanation: "Both the infinitive ('to introduce') and relative clause ('that introduced') are correct post-modifiers after ordinal adjectives." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Build or rewrite complex noun phrases",
      instructions: "Rewrite the phrase or sentence as a complex noun phrase, or expand into a full sentence. Write the full answer (lowercase).",
      questions: [
        { id: "e4q1", prompt: "the fact + she had resigned + [appositive that-clause]", correct: "the fact that she had resigned", explanation: "Noun + appositive that-clause: 'the fact that she had resigned'." },
        { id: "e4q2", prompt: "Rewrite as a noun phrase: 'They decided to cut the budget.' (their decision…)", correct: "their decision to cut the budget", explanation: "Possessive + noun + to-infinitive: 'their decision to cut the budget'." },
        { id: "e4q3", prompt: "Combine into one complex NP: a programme + funded by the government + for five years", correct: "a five-year government-funded programme", explanation: "Stacked premodifiers: 'five-year' (hyphenated) + 'government-funded' (compound adj) + head noun." },
        { id: "e4q4", prompt: "Rewrite as a complex NP: 'evidence that shows the approach works'", correct: "evidence that the approach works", explanation: "Noun + appositive that-clause: 'evidence that the approach works' (no verb needed after 'that' here)." },
        { id: "e4q5", prompt: "The team attempted to reduce costs. (noun phrase starting with 'the team's')", correct: "the team's attempt to reduce costs", explanation: "Possessive + attempt + to-infinitive." },
        { id: "e4q6", prompt: "Expand into a full sentence: 'the government's failure to address the housing crisis'", correct: "the government failed to address the housing crisis", explanation: "Noun phrase → finite clause: possessive → subject, noun → verb, to-inf → to-inf." },
        { id: "e4q7", prompt: "Rewrite as compact NP: 'a strategy that is designed to develop the economy over the long term'", correct: "a long-term economic development strategy", explanation: "Stacked premodifier: long-term + economic + development + strategy." },
        { id: "e4q8", prompt: "Add an appositive to introduce the speaker: 'The director announced the merger.' (The director, [his name is David Chen],…)", correct: "the director, david chen, announced the merger", explanation: "Apposition: 'The director, David Chen, announced the merger' — the name is in apposition to the title." },
        { id: "e4q9", prompt: "Rewrite with a post-modifying participle: 'the policy that was introduced last year'", correct: "the policy introduced last year", explanation: "Reduced relative: 'that was introduced' → 'introduced' (past participle)." },
        { id: "e4q10", prompt: "Rewrite as one NP with an appositive that-clause: 'The suggestion was surprising. The suggestion was that all staff should take a pay cut.'", correct: "the suggestion that all staff should take a pay cut was surprising", explanation: "Noun + appositive that-clause as subject: 'The suggestion that all staff should take a pay cut was surprising'." },
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
        <span className="text-slate-700 font-medium">Complex Noun Phrases</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Complex{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Noun Phrases</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Complex noun phrases pack large amounts of information around a head noun using <b>premodifiers</b> (adjectives, nouns, participles before the noun) and <b>post-modifiers</b> (prepositional phrases, relative clauses, infinitives, that-clauses after the noun). They are the backbone of academic and professional English.
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
      <h2>Complex Noun Phrases (C1)</h2>
      <p className="not-prose mt-2 text-slate-700 text-sm">A noun phrase has a <b>head noun</b> which can be expanded with premodifiers (before) and post-modifiers (after). Mastering this is essential for academic and professional writing.</p>
      <div className="not-prose mt-4 space-y-3">
        {[
          { title: "Premodifiers: adjective / noun / participle / compound", ex: "a significant increase | a government report | a fast-growing economy | a well-established, peer-reviewed methodology" },
          { title: "Post-modifier: prepositional phrase", ex: "the increase in inflation | a report on climate change | a lack of investment in infrastructure" },
          { title: "Post-modifier: relative clause (defining / non-defining)", ex: "the proposal that was submitted | the committee, which meets monthly, …" },
          { title: "Post-modifier: reduced participle phrase", ex: "the data collected last year | the proposals submitted by the committee | the issues remaining unresolved" },
          { title: "Post-modifier: to-infinitive", ex: "the decision to resign | an attempt to reduce costs | her ability to communicate clearly | the first country to introduce the law" },
          { title: "Post-modifier: appositive that-clause (after abstract nouns)", ex: "the fact that she lied | the claim that the data was falsified | the announcement that the company would merge | the belief that reform is possible\n→ Trigger nouns: fact, claim, belief, announcement, evidence, idea, suggestion, view, possibility, hope" },
          { title: "Apposition: NP, NP", ex: "The director, Professor Chen, presented the findings. / We, the undersigned, hereby declare…" },
          { title: "Stacked compound premodifiers (hyphenation)", ex: "a long-term economic development strategy | a government-funded research programme | a ten-year prison sentence (no plural after hyphen)" },
        ].map(({ title, ex }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-2">{title}</div>
            <div className="italic text-slate-700 text-sm whitespace-pre-line">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Noun → NP (nominalisation recap)</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div>They decided to cut the budget. → <b>their decision to cut the budget</b></div>
          <div>The government failed to act. → <b>the government's failure to act</b></div>
          <div>She refused to cooperate. → <b>her refusal to cooperate</b></div>
        </div>
      </div>
    </div>
  );
}
