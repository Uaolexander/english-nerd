"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function AdvancedParticipleClausesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Perfect participles & passive participles",
      instructions: "A perfect participle (having + pp) shows an action completed before the main clause. A passive participle (being/having been + pp) shows passive meaning. Choose the correct form.",
      questions: [
        { id: "e1q1", prompt: "___ the report, she submitted it to the director.", options: ["Having written", "Writing", "Being written"], correctIndex: 0, explanation: "Having + pp = action completed before the main clause. She finished writing first, then submitted." },
        { id: "e1q2", prompt: "___ of any wrongdoing, he was free to return to work.", options: ["Clearing", "Having cleared", "Having been cleared"], correctIndex: 2, explanation: "Having been + pp = passive perfect participle. He was cleared (by others) before returning." },
        { id: "e1q3", prompt: "___ on the island for three years, she was fluent in the local language.", options: ["Living", "Having lived", "Being lived"], correctIndex: 1, explanation: "Having + pp for prior completed period: she had lived there before acquiring fluency." },
        { id: "e1q4", prompt: "___ twice for the same role, he finally gave up applying.", options: ["Being rejected", "Having been rejected", "Having rejected"], correctIndex: 1, explanation: "Having been + pp = passive + prior to main clause action (he was rejected, then gave up)." },
        { id: "e1q5", prompt: "___ the opportunity, she seized it immediately.", options: ["Presenting", "Being presented with", "Having been presented with"], correctIndex: 2, explanation: "Having been presented with = passive perfect participle (the opportunity was presented to her, then she acted)." },
        { id: "e1q6", prompt: "___ his mistake, he immediately apologised.", options: ["Realising", "Having realised", "Both are correct"], correctIndex: 2, explanation: "Both 'Realising' (simultaneous/cause) and 'Having realised' (prior action) are grammatically possible here." },
        { id: "e1q7", prompt: "___ to speak English since childhood, she had no difficulty with the interview.", options: ["Having taught", "Having been taught", "Being taught"], correctIndex: 1, explanation: "Having been taught = passive perfect: she was taught by others; this preceded the interview." },
        { id: "e1q8", prompt: "___ all night, the rescuers were exhausted by dawn.", options: ["Having worked", "Working", "Having been working"], correctIndex: 2, explanation: "Having been working = perfect continuous passive participle; emphasises duration of prior effort." },
        { id: "e1q9", prompt: "___ the data, the researchers published their findings.", options: ["Analysing", "Having analysed", "Being analysed"], correctIndex: 1, explanation: "Having analysed = perfect participle; analysis was complete before publication." },
        { id: "e1q10", prompt: "___ with a difficult choice, she took time to consider her options.", options: ["Facing", "Having faced", "Having been faced"], correctIndex: 2, explanation: "Having been faced with = passive perfect: the choice was presented to her (by circumstances), then she responded." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Absolute constructions & with + object + participle",
      instructions: "An absolute construction has its own subject, separate from the main clause subject. 'With + object + participle' describes an accompanying circumstance. Choose the correct form.",
      questions: [
        { id: "e2q1", prompt: "___ having been resolved, the talks could resume.", options: ["The dispute", "Having the dispute", "With the dispute"], correctIndex: 0, explanation: "Absolute construction: 'The dispute having been resolved' has its own subject ('the dispute') separate from the main clause." },
        { id: "e2q2", prompt: "She stood at the window, ___ crossed.", options: ["with her arms", "her arms were", "having her arms"], correctIndex: 0, explanation: "With + object + past participle: 'with her arms crossed' = accompanying circumstance." },
        { id: "e2q3", prompt: "___ complete, the team moved on to the next phase.", options: ["The assessment being", "Having the assessment", "With the assessment"], correctIndex: 0, explanation: "Absolute construction: 'The assessment being complete' — its own subject + participle." },
        { id: "e2q4", prompt: "He sat in the corner, ___ buried in his phone.", options: ["eyes", "with his eyes", "having his eyes"], correctIndex: 1, explanation: "'With his eyes buried in his phone' = with + NP + past participle." },
        { id: "e2q5", prompt: "___ done, there was nothing left to discuss.", options: ["That being", "The work being", "Having the work"], correctIndex: 1, explanation: "Absolute: 'The work being done' — subject of absolute clause is 'the work'." },
        { id: "e2q6", prompt: "She entered the room, ___ trembling.", options: ["with her hands", "her hands were", "having her hands"], correctIndex: 0, explanation: "'With her hands trembling' = with + NP + present participle (ongoing action)." },
        { id: "e2q7", prompt: "___ having been secured, the expedition set off.", options: ["The funding", "Having the funding", "With the funding"], correctIndex: 0, explanation: "Absolute construction: 'The funding having been secured' is a nominative absolute." },
        { id: "e2q8", prompt: "The old man walked slowly, ___ bent under the weight of age.", options: ["his back", "with his back", "Both are correct"], correctIndex: 2, explanation: "Both 'his back bent' (absolute) and 'with his back bent' (with + NP + pp) are correct; 'with' is more explicit." },
        { id: "e2q9", prompt: "___ completed, the bridge will connect the two cities.", options: ["Once being", "Once the construction being", "The construction once"], correctIndex: 1, explanation: "Absolute with temporal adverb: 'Once the construction [is] completed' — 'being' is often dropped in absolute constructions with adjectives/pp." },
        { id: "e2q10", prompt: "He listened to the speech, ___ folded.", options: ["arms", "with arms", "his arms"], correctIndex: 2, explanation: "Absolute without 'with': 'his arms folded' = nominative absolute construction (arms is the subject of the absolute clause)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Dangling participles & mixed types",
      instructions: "A participle clause must share its subject with the main clause — if not, it is a 'dangling participle'. Identify the correct or incorrect sentence, or choose the best form.",
      questions: [
        { id: "e3q1", prompt: "Which sentence contains a dangling participle?", options: ["Walking along the street, I noticed a strange smell.", "Walking along the street, a strange smell caught my attention.", "Both are correct"], correctIndex: 1, explanation: "'Walking along the street, a strange smell caught my attention' is incorrect: the smell cannot walk. The participle subject must match the main clause subject." },
        { id: "e3q2", prompt: "Which is grammatically correct?", options: ["Having read the report, the decision seemed clear.", "Having read the report, I found the decision clear.", "Both are correct"], correctIndex: 1, explanation: "'Having read the report, the decision seemed clear' — dangling: the decision didn't read the report. Correct: 'Having read the report, I found…'" },
        { id: "e3q3", prompt: "___ the contract carefully, the lawyer identified several ambiguities.", options: ["Reading", "Having read", "Both are correct"], correctIndex: 2, explanation: "Both are acceptable: 'Reading' (while reading) and 'Having read' (after reading). Same subject = no dangling." },
        { id: "e3q4", prompt: "Which is correct?", options: ["Tired after the long journey, the hotel room felt like paradise.", "Tired after the long journey, she found the hotel room felt like paradise.", "Both are correct"], correctIndex: 1, explanation: "Dangling: 'the hotel room' wasn't tired. Correct: the subject of the participle must be 'she'." },
        { id: "e3q5", prompt: "Generally speaking, ___ regarded as one of the greatest novels ever written.", options: ["the book is", "it is", "Both are correct"], correctIndex: 2, explanation: "'Generally speaking' is a set expression functioning as a sentence adverb — it does not require subject agreement." },
        { id: "e3q6", prompt: "___ with a tight deadline, the team worked through the weekend.", options: ["Facing", "Having faced", "Both are correct"], correctIndex: 2, explanation: "Both work: 'Facing' (present circumstance) and 'Having faced' (prior recognition of the deadline)." },
        { id: "e3q7", prompt: "Which sentence is grammatically correct?", options: ["Considering the evidence, a verdict was reached quickly.", "Considering the evidence, the jury reached a verdict quickly.", "Both are correct"], correctIndex: 1, explanation: "Dangling: the verdict doesn't consider evidence. Correct: 'Considering the evidence, the jury reached…'" },
        { id: "e3q8", prompt: "Strictly speaking, ___ not the right word to use in this context.", options: ["'impact' is", "'impact' was", "Both are correct"], correctIndex: 2, explanation: "'Strictly speaking' is a set absolute expression (like 'generally speaking', 'broadly speaking') — subject independence is acceptable." },
        { id: "e3q9", prompt: "Which sentence correctly uses a perfect participle for a prior action?", options: ["Finishing the test, she handed in her paper.", "Having finished the test, she handed in her paper.", "Both are correct"], correctIndex: 1, explanation: "'Having finished' clearly shows the test was completed BEFORE handing in — sequence is explicit." },
        { id: "e3q10", prompt: "Which sentence uses an absolute construction correctly?", options: ["Weather permitting, the match will take place on Saturday.", "Weather being permitted, the match will take place on Saturday.", "If the weather permits, the match will take place on Saturday."], correctIndex: 0, explanation: "'Weather permitting' is a fixed absolute construction. 'Weather being permitted' is unnatural — permit is not normally used in the passive here." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using an advanced participle clause",
      instructions: "Rewrite each sentence using the structure shown. Write the complete sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "After she had read the letter, she sat down and wept. (perfect participle)", correct: "having read the letter, she sat down and wept", explanation: "Having + pp: 'Having read the letter, she sat down and wept.'" },
        { id: "e4q2", prompt: "Because he had been rejected three times, he stopped applying. (passive perfect participle)", correct: "having been rejected three times, he stopped applying", explanation: "Having been + pp = passive perfect participle." },
        { id: "e4q3", prompt: "Her arms were folded and she stared at him in silence. (with + object + pp)", correct: "with her arms folded, she stared at him in silence", explanation: "With + her arms + folded = accompanying circumstance with passive past participle." },
        { id: "e4q4", prompt: "The negotiations had been concluded, so the parties signed the agreement. (absolute construction)", correct: "the negotiations having been concluded, the parties signed the agreement", explanation: "Absolute: 'The negotiations having been concluded' has its own subject." },
        { id: "e4q5", prompt: "When the project was completed, the team celebrated. (absolute construction)", correct: "the project completed, the team celebrated", explanation: "Absolute with past participle: 'The project completed, the team celebrated' — 'being' is omitted." },
        { id: "e4q6", prompt: "She spoke quietly, and her voice was trembling. (with + object + present participle)", correct: "she spoke quietly, with her voice trembling", explanation: "With + her voice + trembling = accompanying action (present participle)." },
        { id: "e4q7", prompt: "Because she had grown up in a bilingual household, she had no difficulty with the test. (perfect participle)", correct: "having grown up in a bilingual household, she had no difficulty with the test", explanation: "Having grown up = perfect participle (prior experience)." },
        { id: "e4q8", prompt: "The funds having been secured, the project was given the go-ahead. (keep the absolute construction — just check it is right)", correct: "the funds having been secured, the project was given the go-ahead", explanation: "Correct absolute construction: 'The funds having been secured' — its own subject + passive perfect participle." },
        { id: "e4q9", prompt: "He sat at his desk. His head was resting in his hands. (with + object + present participle)", correct: "he sat at his desk with his head resting in his hands", explanation: "With + his head + resting = present participle of accompanying state." },
        { id: "e4q10", prompt: "After the report had been published, the government faced intense scrutiny. (passive perfect participle — use 'the report')", correct: "the report having been published, the government faced intense scrutiny", explanation: "Absolute: 'The report having been published' — its own passive perfect participle." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Advanced Participle Clauses</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Advanced{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Participle Clauses</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Advanced participle clauses include <b>perfect participles</b> (<i>having done</i>), <b>passive perfect participles</b> (<i>having been told</i>), <b>absolute constructions</b> (<i>The work completed, we left</i>), and <b>with + object + participle</b> (<i>with her arms folded</i>). The golden rule: a participle clause shares its subject with the main clause — breaking this creates a dangling participle.
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
        <a href="/grammar/c1/complex-noun-phrases" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Complex Noun Phrases →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Advanced Participle Clauses (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { title: "Perfect participle: having + pp", body: "The action in the participle clause is completed BEFORE the main clause action.", ex: "Having read the report, she submitted it. / Having lived abroad for years, he was fluent in French." },
          { title: "Passive perfect participle: having been + pp", body: "The subject was acted upon by someone/something else before the main clause.", ex: "Having been rejected twice, he stopped applying. / Having been presented with the evidence, she changed her mind." },
          { title: "Passive present participle: being + pp", body: "The subject is being acted upon at the same time as or just before the main clause.", ex: "Being questioned by the police, she remained calm. / Being treated unfairly, he complained to HR." },
          { title: "Absolute construction: NP + participle (own subject)", body: "The participle clause has its own subject, independent of the main clause. Formal/literary.", ex: "The meeting over, the delegates dispersed. / The negotiations having been concluded, both sides signed. / Weather permitting, we will proceed." },
          { title: "With + object + participle (accompanying circumstance)", body: "'With' + noun phrase + present participle (ongoing action) or past participle (state/result).", ex: "With her arms folded, she waited patiently. (pp — state)\nWith his voice trembling, he read the verdict. (present participle — action)" },
          { title: "Dangling participle (to avoid)", body: "The participle clause subject must match the main clause subject. If not, it 'dangles'.", ex: "✅ Walking home, I saw a fox.\n❌ Walking home, a fox crossed my path. (the fox wasn't walking home)" },
          { title: "Set absolute expressions (no subject agreement required)", body: "Fixed expressions used as sentence adverbs — subject agreement not required.", ex: "Generally speaking, prices are rising. / Strictly speaking, this isn't correct. / Weather permitting, the race will start at noon." },
        ].map(({ title, body, ex }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-1">{title}</div>
            <div className="text-slate-600 text-sm mb-2">{body}</div>
            <div className="italic text-slate-700 text-sm whitespace-pre-line">{ex}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
