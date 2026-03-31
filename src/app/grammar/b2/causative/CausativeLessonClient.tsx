"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function CausativeLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct causative form",
      instructions: "Choose the correct causative structure: have/get + object + past participle.",
      questions: [
        { id: "e1q1", prompt: "I don't cut my own hair — I ___ it at the salon.", options: ["have cut", "have it cut", "cut it"], correctIndex: 1, explanation: "have it cut = have + object + past participle (causative)." },
        { id: "e1q2", prompt: "She ___ her car serviced every six months.", options: ["gets", "gets her car service", "gets her car serviced"], correctIndex: 2, explanation: "gets her car serviced = get + object + past participle." },
        { id: "e1q3", prompt: "We're ___ the house painted next week.", options: ["having", "getting", "having the house paint"], correctIndex: 0, explanation: "having the house painted = have + object + pp (arrangement in progress)." },
        { id: "e1q4", prompt: "He needs to ___ his teeth checked.", options: ["have his teeth check", "have his teeth checked", "get checked his teeth"], correctIndex: 1, explanation: "have his teeth checked = have + object + pp." },
        { id: "e1q5", prompt: "Did you ___ your passport photo taken here?", options: ["have", "get", "get your"], correctIndex: 0, explanation: "Did you have your passport photo taken? = causative question." },
        { id: "e1q6", prompt: "They ___ their roof repaired after the storm.", options: ["got their roof repaired", "got repaired their roof", "had repaired the roof"], correctIndex: 0, explanation: "got their roof repaired = get + object + pp." },
        { id: "e1q7", prompt: "I must ___ this suit dry-cleaned before the wedding.", options: ["have dry-cleaned this suit", "get this suit dry-cleaned", "get this suit dry-clean"], correctIndex: 1, explanation: "get this suit dry-cleaned = get + object + pp." },
        { id: "e1q8", prompt: "She ___ her nails done every Friday.", options: ["has", "has her nails done", "has done her nails"], correctIndex: 1, explanation: "has her nails done = have + object + pp (regular arrangement)." },
        { id: "e1q9", prompt: "Where do you usually ___ your eyes tested?", options: ["get your eyes test", "get your eyes tested", "have test your eyes"], correctIndex: 1, explanation: "get your eyes tested = get + object + pp." },
        { id: "e1q10", prompt: "They ___ a new kitchen fitted last month.", options: ["had a new kitchen fitted", "had fitted a new kitchen", "got fitted a new kitchen"], correctIndex: 0, explanation: "had a new kitchen fitted = have + object + pp (past arrangement)." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the causative form",
      instructions: "Rewrite each sentence using the causative (have/get + object + past participle). Use the tense and verb given.",
      questions: [
        { id: "e2q1", prompt: "A plumber fixed our boiler. (We / have / Past Simple): We ___.", correct: "had our boiler fixed", explanation: "had our boiler fixed = have + object + pp (past)." },
        { id: "e2q2", prompt: "A photographer is taking her portrait. (She / have / Present Continuous): She ___.", correct: "is having her portrait taken", explanation: "is having her portrait taken = present continuous causative." },
        { id: "e2q3", prompt: "The dentist will check his teeth next week. (He / get / Future): He ___.", correct: "will get his teeth checked", explanation: "will get his teeth checked = future causative with get." },
        { id: "e2q4", prompt: "Someone repaired my phone. (I / get / Past Simple): I ___.", correct: "got my phone repaired", explanation: "got my phone repaired = get + object + pp (past)." },
        { id: "e2q5", prompt: "A stylist is going to cut her hair. (She / have / going to): She ___.", correct: "is going to have her hair cut", explanation: "is going to have her hair cut = going to causative." },
        { id: "e2q6", prompt: "A decorator has painted their flat. (They / have / Present Perfect): They ___.", correct: "have had their flat painted", explanation: "have had their flat painted = present perfect causative." },
        { id: "e2q7", prompt: "The vet vaccinated our dog. (We / get / Past Simple): We ___.", correct: "got our dog vaccinated", explanation: "got our dog vaccinated = get + object + pp (past)." },
        { id: "e2q8", prompt: "A tailor is making his suit. (He / have / Present Continuous): He ___.", correct: "is having his suit made", explanation: "is having his suit made = present continuous causative." },
        { id: "e2q9", prompt: "A mechanic should check your brakes. (You / should / have): You should ___.", correct: "have your brakes checked", explanation: "have your brakes checked = modal + causative." },
        { id: "e2q10", prompt: "An electrician installed the new lights. (She / have / Past Simple): She ___.", correct: "had the new lights installed", explanation: "had the new lights installed = have + object + pp (past)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — have vs get, and negative/question forms",
      instructions: "Choose the correct option. Focus on have vs get, negatives, questions, and when the causative implies something bad happened.",
      questions: [
        { id: "e3q1", prompt: "She ___ her bag stolen on the underground.", options: ["had", "got", "both are correct"], correctIndex: 2, explanation: "Both had and got work here — when something bad happens TO you (involuntary causative)." },
        { id: "e3q2", prompt: "Did you ___ your laptop fixed in the end?", options: ["have your laptop fixed", "get your laptop fix", "get fixed your laptop"], correctIndex: 0, explanation: "Did you have your laptop fixed = question form of causative." },
        { id: "e3q3", prompt: "I haven't ___ my eyes tested for years. I really should.", options: ["had my eyes tested", "got tested my eyes", "had tested my eyes"], correctIndex: 0, explanation: "haven't had my eyes tested = present perfect negative causative." },
        { id: "e3q4", prompt: "He ___ his wallet stolen while he was on holiday.", options: ["had", "got", "both are correct"], correctIndex: 2, explanation: "Both are correct — involuntary causative (something bad happened to him)." },
        { id: "e3q5", prompt: "___ you ___ your documents translated by a professional?", options: ["Have / had", "Did / get", "Have / got"], correctIndex: 0, explanation: "Have you had your documents translated? = present perfect causative question." },
        { id: "e3q6", prompt: "She prefers to ___ her reports proofread before submission.", options: ["get her reports proofread", "get proofread her reports", "have proofread her reports"], correctIndex: 0, explanation: "get her reports proofread = get + object + pp (preferred for more informal/active tone)." },
        { id: "e3q7", prompt: "We ___ our windows cleaned — they were filthy.", options: ["finally had our windows cleaned", "finally had cleaned our windows", "finally got cleaned our windows"], correctIndex: 0, explanation: "had our windows cleaned = have + object + pp. Object must come before the pp." },
        { id: "e3q8", prompt: "I need to ___ this tooth ___ out.", options: ["have / pulled", "get / pull", "have / pulling"], correctIndex: 0, explanation: "have this tooth pulled out = have + object + pp." },
        { id: "e3q9", prompt: "They ___ their house broken into twice last year.", options: ["had", "got", "both are correct"], correctIndex: 2, explanation: "Both had and got are correct for involuntary causative (bad event)." },
        { id: "e3q10", prompt: "Why don't you ___ the leak fixed before winter?", options: ["have the leak fixed", "get fixed the leak", "have fixed the leak"], correctIndex: 0, explanation: "have the leak fixed = have + object + pp. Object always before pp." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — All tenses + involuntary causative",
      instructions: "Write the correct causative form. Pay attention to tense and whether it is voluntary (arranged) or involuntary (something bad happened).",
      questions: [
        { id: "e4q1", prompt: "Thieves stole her car. (involuntary — she / have): She ___.", correct: "had her car stolen", explanation: "had her car stolen = involuntary causative (bad event happened to her)." },
        { id: "e4q2", prompt: "A technician is going to install our new alarm. (We / have / going to): We ___.", correct: "are going to have our alarm installed", explanation: "are going to have our alarm installed = going to causative." },
        { id: "e4q3", prompt: "By the time we move in, a cleaner will have cleaned the flat. (We / have / Future Perfect): We ___.", correct: "will have had the flat cleaned", explanation: "will have had the flat cleaned = Future Perfect causative." },
        { id: "e4q4", prompt: "Someone has hacked his email account. (involuntary — he / have): He ___.", correct: "has had his email account hacked", explanation: "has had his email account hacked = Present Perfect involuntary causative." },
        { id: "e4q5", prompt: "A tailor altered her dress before the party. (She / get / Past Simple): She ___.", correct: "got her dress altered", explanation: "got her dress altered = get + object + pp (past)." },
        { id: "e4q6", prompt: "He had already sent the parcel before I asked. (reword with causative — he / have / Past Perfect): He ___.", correct: "had already had the parcel sent", explanation: "had already had the parcel sent = Past Perfect causative." },
        { id: "e4q7", prompt: "We should ask someone to check the gas pipes. (We / should / get): We should ___.", correct: "get the gas pipes checked", explanation: "get the gas pipes checked = modal + get causative." },
        { id: "e4q8", prompt: "An expert appraised their paintings. (They / have / Past Simple): They ___.", correct: "had their paintings appraised", explanation: "had their paintings appraised = have + object + pp (past)." },
        { id: "e4q9", prompt: "Someone broke into his office. (involuntary — he / get): He ___.", correct: "got his office broken into", explanation: "got his office broken into = get causative for bad/involuntary event." },
        { id: "e4q10", prompt: "A surgeon will operate on her knee next month. (She / have / Future): She ___.", correct: "will have her knee operated on", explanation: "will have her knee operated on = future causative with prepositional verb." },
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
        <span className="text-slate-700 font-medium">Causative: have / get</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Causative:{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">have / get</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The causative uses <b>have / get + object + past participle</b> to say that you arranged for someone else to do something: <i>I <b>had my hair cut</b>.</i> It can also describe something bad that happened to you: <i>She <b>had her bag stolen</b>.</i>
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
        <a href="/grammar/b2/third-conditional" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Third Conditional →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Causative: have / get (B2)</h2>
      <p>The causative structure means you <b>arrange for someone else to do something</b> for you — you don&apos;t do it yourself. The structure is: <b>have / get + object + past participle</b>.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Structure</div>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          {["have / get", "+", "object", "+", "past participle"].map((p, i) => (
            <span key={i} className={p === "+" ? "text-slate-400 font-bold text-lg" : "rounded-xl border border-black/10 bg-orange-50 px-3 py-1.5 font-bold text-orange-700"}>{p}</span>
          ))}
        </div>
        <div className="mt-3 italic text-slate-700 text-sm">I had my hair cut. / She got her car repaired.</div>
      </div>

      <h3>have vs get</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2 mt-2">
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="font-bold text-orange-700 mb-1">have something done</div>
          <div className="text-sm text-slate-600">More formal. Common in writing and professional contexts.</div>
          <div className="mt-2 italic text-sm text-slate-800">I had my windows cleaned.</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="font-bold text-orange-700 mb-1">get something done</div>
          <div className="text-sm text-slate-600">More informal/colloquial. Also implies making more effort.</div>
          <div className="mt-2 italic text-sm text-slate-800">I got my windows cleaned.</div>
        </div>
      </div>

      <h3>Involuntary causative (bad events)</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-4 mt-2">
        <p className="text-sm text-slate-700">Both <b>have</b> and <b>get</b> can describe something bad that happened to you — not arranged, but suffered:</p>
        <div className="mt-2 space-y-1">
          {["She had her bag stolen. (= her bag was stolen)", "He got his car broken into. (= someone broke into his car)"].map(e => (
            <div key={e} className="italic text-sm text-slate-800">{e}</div>
          ))}
        </div>
      </div>

      <h3>All tenses — same structure</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 mt-2">
        <div className="space-y-2 text-sm">
          {[
            { tense: "Present Simple", ex: "She has her nails done every week." },
            { tense: "Past Simple", ex: "We had the roof repaired last month." },
            { tense: "Present Perfect", ex: "I've had my passport renewed." },
            { tense: "Future (will)", ex: "They will have the venue decorated." },
            { tense: "Going to", ex: "She's going to get her hair dyed." },
            { tense: "Modal", ex: "You should get your brakes checked." },
          ].map(({ tense, ex }) => (
            <div key={tense} className="grid grid-cols-[140px_1fr] gap-2 rounded-xl border border-black/10 bg-slate-50 p-2.5">
              <span className="font-bold text-orange-700 text-xs self-center">{tense}</span>
              <span className="italic text-slate-800">{ex}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">⚠ Word order:</span> The object always comes <b>before</b> the past participle. <br />
          ✅ <i>I had my car repaired.</i> &nbsp; ❌ <i>~~I had repaired my car.~~</i> (= I repaired it myself)
        </div>
      </div>
    </div>
  );
}
