"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function NominalisationLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Identifying nominalisations",
      instructions: "Nominalisation converts verbs or adjectives into noun phrases. Identify the correct nominalised form of the word in brackets.",
      questions: [
        { id: "e1q1", prompt: "There has been a significant ___ in unemployment. (reduce)", options: ["reduction", "reducing", "reduced"], correctIndex: 0, explanation: "reduce → reduction (noun suffix -tion)." },
        { id: "e1q2", prompt: "The government announced an ___ in public spending. (increase)", options: ["increase", "increasing", "increased"], correctIndex: 0, explanation: "increase can function as both verb and noun (no suffix change needed here): an increase in." },
        { id: "e1q3", prompt: "The ___ of the new policy was widely debated. (implement)", options: ["implementation", "implementing", "implemented"], correctIndex: 0, explanation: "implement → implementation (noun suffix -ation)." },
        { id: "e1q4", prompt: "Her ___ to leave was influenced by personal reasons. (decide)", options: ["decision", "deciding", "decisive"], correctIndex: 0, explanation: "decide → decision (noun suffix -sion)." },
        { id: "e1q5", prompt: "The report highlights the ___ of early intervention. (important)", options: ["importance", "importantly", "importation"], correctIndex: 0, explanation: "important (adj.) → importance (noun suffix -ance)." },
        { id: "e1q6", prompt: "The ___ of the merger took several months. (approve)", options: ["approval", "approving", "approved"], correctIndex: 0, explanation: "approve → approval (noun suffix -al)." },
        { id: "e1q7", prompt: "The study examines the ___ between poverty and health. (relate)", options: ["relationship", "relating", "relative"], correctIndex: 0, explanation: "relate → relationship (compound noun suffix)." },
        { id: "e1q8", prompt: "There was a clear ___ in standards. (deteriorate)", options: ["deterioration", "deteriorating", "deterior"], correctIndex: 0, explanation: "deteriorate → deterioration (-tion suffix)." },
        { id: "e1q9", prompt: "The committee reached a ___ on the budget. (agree)", options: ["agreement", "agreeing", "agreeable"], correctIndex: 0, explanation: "agree → agreement (noun suffix -ment)." },
        { id: "e1q10", prompt: "The ___ of new technology has transformed the industry. (develop)", options: ["development", "developing", "developed"], correctIndex: 0, explanation: "develop → development (-ment suffix)." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Prepositions after nominalisations",
      instructions: "Nominalisations take specific prepositions. Common patterns: increase/rise/fall/reduction/decline IN; effect/impact ON; decision/agreement/need/attempt TO; cause OF; reason FOR. Choose the correct preposition.",
      questions: [
        { id: "e2q1", prompt: "There has been a sharp rise ___ the cost of living.", options: ["in", "of", "on"], correctIndex: 0, explanation: "rise/increase/fall/drop/reduction + in + noun: a rise in the cost." },
        { id: "e2q2", prompt: "The decision ___ close the factory was controversial.", options: ["of", "to", "for"], correctIndex: 1, explanation: "decision + to + infinitive: the decision to close." },
        { id: "e2q3", prompt: "The research focuses on the effect ___ stress ___ productivity.", options: ["of / on", "on / of", "of / of"], correctIndex: 0, explanation: "effect OF [cause] ON [affected thing]: the effect of stress on productivity." },
        { id: "e2q4", prompt: "There is a growing need ___ affordable housing.", options: ["to", "for", "of"], correctIndex: 1, explanation: "need + for: a need for affordable housing." },
        { id: "e2q5", prompt: "The government made an attempt ___ curb inflation.", options: ["of", "for", "to"], correctIndex: 2, explanation: "attempt + to + infinitive: an attempt to curb." },
        { id: "e2q6", prompt: "The report examines the causes ___ the financial crisis.", options: ["for", "of", "in"], correctIndex: 1, explanation: "cause(s) + of: the causes of the crisis." },
        { id: "e2q7", prompt: "There is no justification ___ such extreme measures.", options: ["of", "for", "to"], correctIndex: 1, explanation: "justification + for: justification for the measures." },
        { id: "e2q8", prompt: "The study shows a correlation ___ diet and mental health.", options: ["between", "of", "in"], correctIndex: 0, explanation: "correlation/relationship/link + between: a correlation between X and Y." },
        { id: "e2q9", prompt: "There was a significant decline ___ voter turnout.", options: ["of", "in", "on"], correctIndex: 1, explanation: "decline/fall/drop/reduction + in: a decline in turnout." },
        { id: "e2q10", prompt: "The agreement ___ implement the reforms was signed.", options: ["of", "for", "to"], correctIndex: 2, explanation: "agreement + to + infinitive: an agreement to implement." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Nominalisation in formal vs informal register",
      instructions: "Nominalisation is characteristic of academic and formal writing. It makes text more objective and impersonal. Choose the more formal, nominalised version.",
      questions: [
        { id: "e3q1", prompt: "Which version is more formal/academic?", options: ["Prices increased significantly.", "There was a significant increase in prices."], correctIndex: 1, explanation: "'a significant increase in prices' uses nominalisation (increase as a noun), which is more formal and impersonal." },
        { id: "e3q2", prompt: "Which uses nominalisation correctly?", options: ["The company decided to merge with its competitor.", "The company's decision to merge with its competitor was announced."], correctIndex: 1, explanation: "'The company's decision to merge' = nominalisation. This is more compact and formal than 'the company decided'." },
        { id: "e3q3", prompt: "Which is more academic in register?", options: ["They analysed the data carefully and found clear patterns.", "A careful analysis of the data revealed clear patterns."], correctIndex: 1, explanation: "'A careful analysis of the data' = subject nominalisation. Removes the agent and uses 'analysis' as a noun." },
        { id: "e3q4", prompt: "Which correctly nominalises 'the government approved the budget'?", options: ["The government approving the budget happened.", "The government's approval of the budget was announced yesterday."], correctIndex: 1, explanation: "'approval of the budget' = nominalised form. 'The government's approval of' is the correct structure." },
        { id: "e3q5", prompt: "Which is the more appropriate formal rewrite of 'They failed to meet the deadline'?", options: ["Their failure to meet the deadline had serious consequences.", "The fact they failed to meet the deadline had serious consequences."], correctIndex: 0, explanation: "'Their failure to meet the deadline' = clean nominalisation; more concise than 'the fact that they failed'." },
        { id: "e3q6", prompt: "Which correctly uses nominalisation with a result structure?", options: ["Because the price fell, demand increased.", "The fall in price led to an increase in demand."], correctIndex: 1, explanation: "'The fall in price' and 'an increase in demand' = both nominalised. 'Led to' links cause and effect formally." },
        { id: "e3q7", prompt: "Which is better academic style?", options: ["We found that students performed better when they were motivated.", "The findings indicate a positive correlation between motivation and student performance."], correctIndex: 1, explanation: "Nominalisation + impersonal subject: 'The findings indicate' / 'a positive correlation between motivation and student performance'." },
        { id: "e3q8", prompt: "What is the correct nominalisation of 'they recommended that all staff attend the training'?", options: ["Their recommendation that all staff attend the training was unanimous.", "Their recommending all staff attend was unanimous."], correctIndex: 0, explanation: "'Their recommendation that…' = correct formal nominalisation with that-clause." },
        { id: "e3q9", prompt: "Which accurately nominalises 'the government will invest in infrastructure'?", options: ["The government's investment in infrastructure is planned.", "The investing by the government in infrastructure is planned."], correctIndex: 0, explanation: "'The government's investment in infrastructure' = possessive + noun + preposition. 'The investing' is grammatically awkward." },
        { id: "e3q10", prompt: "Which version is preferred in academic writing?", options: ["Researchers discovered that the drug reduces inflammation.", "The discovery that the drug reduces inflammation was significant."], correctIndex: 1, explanation: "'The discovery that…' = nominalised subject. Focuses on the result rather than the agent." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using nominalisation",
      instructions: "Rewrite each sentence using a nominalised structure. Write the complete rewritten sentence (lowercase). Use the structure shown in brackets where given.",
      questions: [
        { id: "e4q1", prompt: "Prices rose sharply last year. (There was…)", correct: "there was a sharp rise in prices last year", explanation: "There was + article + adjective + nominalisation + preposition: a sharp rise in prices." },
        { id: "e4q2", prompt: "The government decided to raise taxes. (The government's…)", correct: "the government's decision to raise taxes was controversial", explanation: "The government's + decision + to-infinitive = standard possessive nominalisation." },
        { id: "e4q3", prompt: "They failed to implement the policy effectively. (Their…)", correct: "their failure to implement the policy effectively had serious consequences", explanation: "Their failure to + infinitive = nominalised subject." },
        { id: "e4q4", prompt: "Unemployment fell significantly. (There was…)", correct: "there was a significant fall in unemployment", explanation: "There was + article + adjective + fall in + noun." },
        { id: "e4q5", prompt: "The committee approved the new regulations. (The committee's…)", correct: "the committee's approval of the new regulations was unanimous", explanation: "The committee's + approval + of = possessive + nominalisation + of-phrase." },
        { id: "e4q6", prompt: "The results show that there is a strong link between diet and cancer risk. (nominalise the verb phrase)", correct: "the results show a strong link between diet and cancer risk", explanation: "Remove 'that there is' and use the nominalisation 'link' directly as the object." },
        { id: "e4q7", prompt: "They investigated how the drug affects the immune system. (Their investigation…)", correct: "their investigation into how the drug affects the immune system revealed new insights", explanation: "Their investigation + into + clause = nominalised subject with into-phrase." },
        { id: "e4q8", prompt: "The cost of raw materials increased, so production costs rose. (The increase…)", correct: "the increase in the cost of raw materials led to a rise in production costs", explanation: "The increase in X led to a rise in Y = formal nominalised cause-effect structure." },
        { id: "e4q9", prompt: "The researchers found that exposure to noise reduces concentration. (The findings suggest…)", correct: "the findings suggest that exposure to noise leads to a reduction in concentration", explanation: "leads to a reduction in = nominalised effect (reduction in, not 'reduces')." },
        { id: "e4q10", prompt: "The board agreed to restructure the company. (The board's…)", correct: "the board's agreement to restructure the company was announced at the meeting", explanation: "The board's agreement to + infinitive = standard formal nominalisation." },
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
        <span className="text-slate-700 font-medium">Nominalisation</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Nominalisation</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Nominalisation is the process of turning verbs and adjectives into nouns or noun phrases: <i>decide → decision</i>, <i>increase → an increase in</i>, <i>important → importance</i>. It is a hallmark of formal academic and professional writing, making text more concise, impersonal, and objective.
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
      <h2>Nominalisation (C1)</h2>
      <p className="not-prose mt-2 text-slate-700 text-sm">Nominalisation creates noun phrases from verbs or adjectives. It is central to academic and professional writing because it is more concise and impersonal.</p>
      <div className="not-prose mt-4 space-y-3">
        {[
          { title: "Common suffixes: verb → noun", pairs: [["decide", "decision"], ["implement", "implementation"], ["approve", "approval"], ["develop", "development"], ["agree", "agreement"], ["reduce", "reduction"], ["deteriorate", "deterioration"], ["refer", "reference"]] },
          { title: "Common suffixes: adjective → noun", pairs: [["important", "importance"], ["significant", "significance"], ["effective", "effectiveness / efficacy"], ["stable", "stability"], ["equal", "equality"]] },
        ].map(({ title, pairs }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-3">{title}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {pairs.map(([from, to]) => (
                <div key={from} className="rounded-xl bg-black/5 px-3 py-2 text-sm">
                  <span className="text-slate-500">{from}</span> → <span className="font-bold text-slate-900">{to}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {[
          { title: "Key preposition patterns after nominalisations", items: ["increase / rise / fall / decline / reduction + IN: a rise in unemployment", "effect / impact / influence + ON: the effect on productivity", "decision / agreement / failure / attempt + TO: a decision to merge", "cause / analysis / approval + OF: the approval of the plan", "need / reason / justification + FOR: a need for reform", "relationship / link / correlation + BETWEEN: a link between X and Y"] },
          { title: "Why nominalise? (academic register)", items: ["Impersonal: 'A rise in prices occurred' vs 'Prices rose'", "Concise: 'Their failure to comply had consequences' vs 'Because they failed to comply, there were consequences'", "Allows modification: 'a sharp, unexpected rise in prices'", "Focuses on events/concepts rather than agents"] },
        ].map(({ title, items }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-2">{title}</div>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item} className="text-slate-700 text-sm flex gap-2"><span className="text-cyan-400 font-bold">→</span>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Cause-effect nominalisation pattern</div>
        <div className="text-sm text-slate-700 italic">The increase in raw material costs led to a significant rise in production costs, resulting in a reduction in profit margins.</div>
        <div className="text-sm text-slate-500 mt-1">Note: verb → noun at every stage (increase, rise, reduction) + linking verbs (led to, resulting in).</div>
      </div>
    </div>
  );
}
