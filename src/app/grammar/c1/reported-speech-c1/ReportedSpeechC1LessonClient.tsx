"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function ReportedSpeechC1LessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Complex reporting verb patterns",
      instructions: "C1 reporting verbs take specific grammatical patterns: verb + to-inf, verb + that-clause, verb + -ing, verb + object + to-inf, verb + prep + -ing. Choose the correct pattern.",
      questions: [
        { id: "e1q1", prompt: "She insisted ___ the meeting being rescheduled.", options: ["on", "that", "to"], correctIndex: 0, explanation: "insist on + gerund: 'insisted on the meeting being rescheduled'." },
        { id: "e1q2", prompt: "He denied ___ the documents.", options: ["to forge", "forging", "that forged"], correctIndex: 1, explanation: "deny + gerund: 'denied forging the documents'." },
        { id: "e1q3", prompt: "They warned us ___ proceeding without proper authorisation.", options: ["against", "about not", "on not"], correctIndex: 0, explanation: "warn + object + against + gerund: 'warned us against proceeding'." },
        { id: "e1q4", prompt: "She admitted ___ the deadline.", options: ["missing", "to miss", "to have missed"], correctIndex: 0, explanation: "admit + gerund: 'admitted missing the deadline'." },
        { id: "e1q5", prompt: "He offered ___ the full cost.", options: ["paying", "to pay", "that he pay"], correctIndex: 1, explanation: "offer + to-infinitive: 'offered to pay'." },
        { id: "e1q6", prompt: "The lawyer advised her ___ anything without consulting him first.", options: ["not to sign", "not signing", "against sign"], correctIndex: 0, explanation: "advise + object + not + to-infinitive: 'advised her not to sign'." },
        { id: "e1q7", prompt: "The committee objected ___ the proposal being fast-tracked.", options: ["to", "against", "at"], correctIndex: 0, explanation: "object to + gerund: 'objected to the proposal being fast-tracked'." },
        { id: "e1q8", prompt: "He urged the board ___ before making a decision.", options: ["to wait", "waiting", "that they wait"], correctIndex: 0, explanation: "urge + object + to-infinitive: 'urged the board to wait'." },
        { id: "e1q9", prompt: "She threatened ___ if they didn't comply.", options: ["to resign", "resigning", "that resign"], correctIndex: 0, explanation: "threaten + to-infinitive: 'threatened to resign'." },
        { id: "e1q10", prompt: "He boasted ___ never having made a loss.", options: ["of", "about", "Both are correct"], correctIndex: 2, explanation: "boast of/about + gerund: both 'of' and 'about' are correct with boast." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Tense shifts & when NOT to backshift",
      instructions: "Backshifting moves tenses one step back in reported speech. However, if something is still true or the original speech is recent/co-text clear, backshifting is often optional. Choose the best reported form.",
      questions: [
        { id: "e2q1", prompt: "\"The Earth orbits the Sun.\" → The teacher explained that the Earth ___ the Sun.", options: ["orbits", "orbited", "Both are correct"], correctIndex: 2, explanation: "Permanent/scientific fact: both 'orbits' (no backshift — still true) and 'orbited' (standard backshift) are acceptable." },
        { id: "e2q2", prompt: "\"I will never betray you.\" → He promised that he ___ never betray her.", options: ["will", "would", "Both are correct"], correctIndex: 1, explanation: "Standard backshift: will → would in reported speech." },
        { id: "e2q3", prompt: "\"I have been working here for ten years.\" → She said she ___ there for ten years.", options: ["has been working", "had been working", "Both are correct"], correctIndex: 2, explanation: "If still currently true, no backshift is possible ('has been working'); if past context, 'had been working'. Both can be correct depending on when it was said." },
        { id: "e2q4", prompt: "\"You must sign this form.\" → She told me I ___ sign the form.", options: ["must", "had to", "Both are correct"], correctIndex: 2, explanation: "must (obligation) → had to (standard backshift) OR must can remain if the obligation is still current." },
        { id: "e2q5", prompt: "\"We might be wrong.\" → They admitted they ___ be wrong.", options: ["might", "may", "Both are correct"], correctIndex: 0, explanation: "might does not backshift further; it remains 'might' in reported speech." },
        { id: "e2q6", prompt: "\"I saw her yesterday.\" → He said he ___ her the day before.", options: ["saw", "had seen", "Both are correct"], correctIndex: 2, explanation: "saw → had seen (standard backshift). 'saw' is also acceptable in informal/recent speech. Time adverb 'yesterday' → 'the day before'." },
        { id: "e2q7", prompt: "\"We should invest more.\" → The analyst argued that they ___ invest more.", options: ["should", "ought to", "Both are correct"], correctIndex: 0, explanation: "should does not backshift — it stays 'should' in reported speech." },
        { id: "e2q8", prompt: "\"I can't come.\" → She told us she ___ come.", options: ["can't", "couldn't", "Both are correct"], correctIndex: 1, explanation: "can → could (standard backshift). 'can't' is only kept if the inability is still current at reporting time." },
        { id: "e2q9", prompt: "\"This policy is fundamentally flawed.\" → The expert maintained that the policy ___ fundamentally flawed.", options: ["is", "was", "Both are correct"], correctIndex: 2, explanation: "If the expert still holds this view, 'is' is preferred; 'was' is standard backshift. Both are acceptable." },
        { id: "e2q10", prompt: "\"I would rather stay.\" → She said she ___ rather stay.", options: ["would", "had", "could"], correctIndex: 0, explanation: "would rather does not backshift further — stays as 'would rather' in reported speech." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Reporting verbs in context: formal & nuanced",
      instructions: "Choose the reporting verb that most accurately captures the meaning and register of the original statement.",
      questions: [
        { id: "e3q1", prompt: "\"You really should visit the exhibition before it closes.\" (strong recommendation)", options: ["He said to visit.", "He strongly recommended visiting the exhibition.", "He told that visiting the exhibition."], correctIndex: 1, explanation: "recommend + gerund: 'recommended visiting'. Strong recommendation = 'strongly recommended'." },
        { id: "e3q2", prompt: "\"If you don't pay by Friday, we will take legal action.\" (threat/warning)", options: ["She informed them to pay.", "She threatened to take legal action if they didn't pay by Friday.", "She warned that pay by Friday."], correctIndex: 1, explanation: "threaten + to-infinitive (consequence clause): 'threatened to take legal action if they didn't pay'." },
        { id: "e3q3", prompt: "\"I'm sorry I didn't come to the meeting.\" (regret for past action)", options: ["She apologised for not coming to the meeting.", "She apologised to not come to the meeting.", "She apologised that she doesn't come."], correctIndex: 0, explanation: "apologise for + gerund: 'apologised for not coming'." },
        { id: "e3q4", prompt: "\"It wasn't me who took the money.\" (deny guilt)", options: ["He refused taking the money.", "He denied having taken the money.", "He denied to take the money."], correctIndex: 1, explanation: "deny + gerund (or perfect gerund for prior action): 'denied having taken'." },
        { id: "e3q5", prompt: "\"You can't do this. It goes against everything we agreed.\" (formal objection)", options: ["He protested against them doing it.", "He objected to them doing it.", "Both are correct"], correctIndex: 2, explanation: "Both 'protest against' and 'object to' + gerund/NP are correct for formal objections." },
        { id: "e3q6", prompt: "\"Let me carry that for you.\" (offer)", options: ["He said to carry it.", "He offered to carry it.", "He proposed carrying it."], correctIndex: 1, explanation: "offer + to-infinitive: 'offered to carry it'." },
        { id: "e3q7", prompt: "\"I absolutely did not leak the information.\" (strong denial)", options: ["She strongly denied leaking the information.", "She refused leaking the information.", "She denied to leak the information."], correctIndex: 0, explanation: "deny + gerund: 'denied leaking'. 'Strongly denied' captures the emphatic original." },
        { id: "e3q8", prompt: "\"I insist that you reconsider your position.\" (demand)", options: ["He insisted on their reconsidering their position.", "He insisted that they reconsider their position.", "Both are correct"], correctIndex: 2, explanation: "insist on + gerund/NP OR insist + that + subjunctive: both are correct." },
        { id: "e3q9", prompt: "\"I'll look into it and get back to you.\" (informal promise)", options: ["He promised to look into it.", "He told to look into it.", "He said to look into it and get back."], correctIndex: 0, explanation: "promise + to-infinitive: 'promised to look into it and get back'." },
        { id: "e3q10", prompt: "\"Why don't we consider a different approach?\" (gentle suggestion)", options: ["She proposed that they consider a different approach.", "She insisted they consider a different approach.", "She suggested to consider a different approach."], correctIndex: 0, explanation: "propose/suggest + that + clause (or + gerund). 'Suggested to consider' is non-standard; use 'suggested considering' or 'proposed that they consider'." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Report the statement using the verb given",
      instructions: "Report each statement using the verb in brackets. Write the complete reported sentence (lowercase). Change pronouns and tenses as needed.",
      questions: [
        { id: "e4q1", prompt: "\"I'll help you with the report.\" (offer)", correct: "she offered to help me with the report", explanation: "offer + to-infinitive; pronoun shift: I → she, you → me." },
        { id: "e4q2", prompt: "\"You should avoid making promises you can't keep.\" (advise)", correct: "he advised me to avoid making promises i couldn't keep", explanation: "advise + object + to-inf; modal backshift: can't → couldn't." },
        { id: "e4q3", prompt: "\"I didn't take any documents from the office.\" (deny)", correct: "she denied taking any documents from the office", explanation: "deny + gerund; tense absorbed into context." },
        { id: "e4q4", prompt: "\"Please don't tell anyone about this.\" (beg)", correct: "he begged me not to tell anyone about it", explanation: "beg + object + not + to-inf; pronoun: this → it." },
        { id: "e4q5", prompt: "\"We really must cut our carbon emissions.\" (urge)", correct: "she urged them to cut their carbon emissions", explanation: "urge + object + to-inf; backshift: must → (implied necessity stays in inf structure)." },
        { id: "e4q6", prompt: "\"I've always wanted to work in this field.\" (admit — regret/confession tone)", correct: "he admitted that he had always wanted to work in that field", explanation: "admit + that-clause; backshift: have → had; this → that." },
        { id: "e4q7", prompt: "\"I won't work under these conditions.\" (refuse)", correct: "she refused to work under those conditions", explanation: "refuse + to-inf; pronoun shift; these → those." },
        { id: "e4q8", prompt: "\"Why don't we delay the vote until more information is available?\" (suggest)", correct: "he suggested delaying the vote until more information was available", explanation: "suggest + gerund; backshift: is → was." },
        { id: "e4q9", prompt: "\"If you misuse the funds, we will press charges.\" (warn)", correct: "they warned him that if he misused the funds they would press charges", explanation: "warn + object + that-clause; backshift: will → would, misuse → misused." },
        { id: "e4q10", prompt: "\"I'd like to apologise for my behaviour at the conference.\" (apologise)", correct: "she apologised for her behaviour at the conference", explanation: "apologise for + gerund/noun; 'I'd like to apologise' → reported as past action 'apologised for'." },
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
        <span className="text-slate-700 font-medium">Reported Speech: Advanced</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Reported Speech:{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Advanced</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        C1 reported speech goes beyond basic backshifting. Key areas: <b>complex reporting verb patterns</b> (insist on -ing, warn against, deny -ing, object to), <b>when NOT to backshift</b> (permanent facts, modals that don't change), and <b>nuanced verb choice</b> — picking the verb that accurately captures the speaker's intent, tone, and register.
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
        <a href="/grammar/c1/concession-contrast" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Concession &amp; Contrast →</a>
      </div>
    </div>
  );
}

function Explanation() {
  const verbTable = [
    { verb: "insist on", pattern: "+ gerund / NP", ex: "insisted on reviewing the contract" },
    { verb: "deny", pattern: "+ gerund", ex: "denied leaking the information" },
    { verb: "admit", pattern: "+ gerund / that-clause", ex: "admitted making an error / admitted that she was wrong" },
    { verb: "warn", pattern: "+ object + against + gerund", ex: "warned them against investing" },
    { verb: "advise", pattern: "+ object + to-inf / against + gerund", ex: "advised her to wait / advised against rushing" },
    { verb: "object to", pattern: "+ gerund / NP", ex: "objected to the proposal being changed" },
    { verb: "offer", pattern: "+ to-inf", ex: "offered to help" },
    { verb: "refuse", pattern: "+ to-inf", ex: "refused to cooperate" },
    { verb: "threaten", pattern: "+ to-inf", ex: "threatened to resign" },
    { verb: "urge", pattern: "+ object + to-inf", ex: "urged the committee to reconsider" },
    { verb: "apologise for", pattern: "+ gerund / NP", ex: "apologised for missing the deadline" },
    { verb: "boast of/about", pattern: "+ gerund", ex: "boasted of never having lost a case" },
    { verb: "propose / suggest", pattern: "+ gerund / that-clause", ex: "proposed delaying the vote / suggested that they wait" },
    { verb: "accuse of", pattern: "+ gerund", ex: "accused him of lying under oath" },
  ];
  const noBackshift = [
    { rule: "Permanent truths / scientific facts", ex: "She said water boils at 100°C. (not boiled)" },
    { rule: "Modals: should, would, might, could, ought to", ex: "He said she might be right. (might stays)" },
    { rule: "would rather / had better", ex: "She said she would rather not attend. (stays)" },
    { rule: "Still-current states or conditions", ex: "He said the report is on your desk. (is, not was, if still there)" },
  ];
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Reported Speech: Advanced (C1)</h2>
      <div className="not-prose mt-4 overflow-x-auto rounded-2xl border border-black/10">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-black/10 bg-black/5"><th className="px-4 py-3 text-left font-black text-slate-700">Verb</th><th className="px-4 py-3 text-left font-black text-slate-700">Pattern</th><th className="px-4 py-3 text-left font-black text-slate-700">Example</th></tr></thead>
          <tbody>
            {verbTable.map((r, i) => (
              <tr key={i} className={`border-b border-black/5 ${i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}>
                <td className="px-4 py-2 font-semibold text-cyan-700">{r.verb}</td>
                <td className="px-4 py-2 text-slate-600 font-mono text-xs">{r.pattern}</td>
                <td className="px-4 py-2 italic text-slate-700">{r.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-4">
        <div className="font-black text-cyan-700 text-sm mb-3">When NOT to backshift</div>
        <div className="space-y-2">
          {noBackshift.map(({ rule, ex }) => (
            <div key={rule} className="text-sm">
              <span className="font-semibold text-slate-800">{rule}: </span>
              <span className="italic text-slate-700">{ex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
