"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type ExerciseSet = { type: "mcq"; title: string; instructions: string; questions: MCQ[] };

export default function PhrasalVerbsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Meaning: give up, look after, find out, put off",
      instructions: "Choose the correct meaning of the phrasal verb in bold.",
      questions: [
        { id: "e1q1", prompt: "She decided to give up smoking.", options: ["start", "quit / stop", "continue"], correctIndex: 1, explanation: "give up = stop doing something, especially a habit." },
        { id: "e1q2", prompt: "He looks after his younger siblings.", options: ["looks for", "takes care of", "ignores"], correctIndex: 1, explanation: "look after = take care of someone or something." },
        { id: "e1q3", prompt: "I'll find out what time the train leaves.", options: ["discover / learn", "forget", "book"], correctIndex: 0, explanation: "find out = discover or get information." },
        { id: "e1q4", prompt: "They put off the meeting until next week.", options: ["cancelled", "postponed", "attended"], correctIndex: 1, explanation: "put off = postpone, delay." },
        { id: "e1q5", prompt: "Don't give up — you're nearly there!", options: ["slow down", "stop trying", "hurry up"], correctIndex: 1, explanation: "give up = stop trying." },
        { id: "e1q6", prompt: "She looks after the office when the boss is away.", options: ["looks at", "manages / takes care of", "leaves"], correctIndex: 1, explanation: "look after = be responsible for." },
        { id: "e1q7", prompt: "I found out that she'd lied.", options: ["discovered", "forgot", "believed"], correctIndex: 0, explanation: "find out = discover a fact." },
        { id: "e1q8", prompt: "Let's put off our decision for now.", options: ["make", "delay", "announce"], correctIndex: 1, explanation: "put off = delay making a decision." },
        { id: "e1q9", prompt: "He gave up his job to travel.", options: ["resigned from", "started", "enjoyed"], correctIndex: 0, explanation: "give up = leave / resign from." },
        { id: "e1q10", prompt: "Can you look after my cat while I'm away?", options: ["ignore", "take care of", "feed only"], correctIndex: 1, explanation: "look after = take care of." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Meaning: turn on/off, pick up, carry on, set up",
      instructions: "Choose the correct meaning of the phrasal verb in bold.",
      questions: [
        { id: "e2q1", prompt: "Please turn on the lights — it's dark in here.", options: ["switch off", "switch on", "break"], correctIndex: 1, explanation: "turn on = switch on / activate." },
        { id: "e2q2", prompt: "She picked up Spanish while living abroad.", options: ["learned naturally", "studied formally", "forgot"], correctIndex: 0, explanation: "pick up = learn informally / naturally." },
        { id: "e2q3", prompt: "Carry on — don't let me interrupt you.", options: ["stop", "slow down", "continue"], correctIndex: 2, explanation: "carry on = continue." },
        { id: "e2q4", prompt: "They set up a new company last year.", options: ["closed", "established / started", "sold"], correctIndex: 1, explanation: "set up = establish / start." },
        { id: "e2q5", prompt: "Turn off the TV and go to bed.", options: ["switch on", "repair", "switch off"], correctIndex: 2, explanation: "turn off = switch off / deactivate." },
        { id: "e2q6", prompt: "He picked up a cold from his colleagues.", options: ["gave away", "caught", "cured"], correctIndex: 1, explanation: "pick up = catch (an illness)." },
        { id: "e2q7", prompt: "Please carry on with your work.", options: ["finish", "continue", "restart"], correctIndex: 1, explanation: "carry on = continue." },
        { id: "e2q8", prompt: "They set up a fundraising event.", options: ["attended", "organised / arranged", "cancelled"], correctIndex: 1, explanation: "set up = organise / arrange." },
        { id: "e2q9", prompt: "Can you pick up some milk on your way home?", options: ["buy / collect", "drop", "forget"], correctIndex: 0, explanation: "pick up = collect / buy while passing." },
        { id: "e2q10", prompt: "Turn on the heating — it's cold.", options: ["switch off", "repair", "activate"], correctIndex: 2, explanation: "turn on = activate / switch on." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Hard) — In context: choose the right phrasal verb",
      instructions: "Choose the correct phrasal verb to complete the sentence.",
      questions: [
        { id: "e3q1", prompt: "He decided to ___ his bad habits and start fresh.", options: ["give up", "give in", "give out"], correctIndex: 0, explanation: "give up = stop / quit bad habits." },
        { id: "e3q2", prompt: "Can you ___ the children while I cook dinner?", options: ["look for", "look after", "look into"], correctIndex: 1, explanation: "look after = take care of." },
        { id: "e3q3", prompt: "I need to ___ more about the course before I apply.", options: ["find out", "find up", "find off"], correctIndex: 0, explanation: "find out = get more information." },
        { id: "e3q4", prompt: "The match was ___ because of the bad weather.", options: ["put on", "put off", "put up"], correctIndex: 1, explanation: "put off = postponed." },
        { id: "e3q5", prompt: "She ___ three languages just by travelling.", options: ["turned on", "picked up", "set up"], correctIndex: 1, explanation: "pick up = learn informally." },
        { id: "e3q6", prompt: "The government ___ new rules to reduce pollution.", options: ["set up", "turned on", "gave up"], correctIndex: 0, explanation: "set up = established / introduced." },
        { id: "e3q7", prompt: "Don't ___ now — the finish line is just ahead!", options: ["carry on", "give up", "find out"], correctIndex: 1, explanation: "give up = stop trying." },
        { id: "e3q8", prompt: "Please ___ your work — I'll be back in five minutes.", options: ["turn off", "carry on with", "put off"], correctIndex: 1, explanation: "carry on with = continue." },
        { id: "e3q9", prompt: "She ___ the oven before she left the house.", options: ["turned on", "turned off", "set up"], correctIndex: 1, explanation: "turn off = switch off." },
        { id: "e3q10", prompt: "He ___ a cough from someone at the office.", options: ["gave up", "picked up", "found out"], correctIndex: 1, explanation: "pick up = catch (illness)." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Harder) — Mixed phrasal verbs in context",
      instructions: "Choose the correct phrasal verb. These questions mix all the phrasal verbs from this lesson.",
      questions: [
        { id: "e4q1", prompt: "I can't believe she ___ her dream of becoming a doctor.", options: ["gave up", "set up", "turned off"], correctIndex: 0, explanation: "give up = abandon a dream or goal." },
        { id: "e4q2", prompt: "Could you ___ my plants while I'm on holiday?", options: ["find out", "look after", "carry on"], correctIndex: 1, explanation: "look after = take care of." },
        { id: "e4q3", prompt: "Have you ___ where the party is yet?", options: ["set up", "found out", "put off"], correctIndex: 1, explanation: "find out = discover information." },
        { id: "e4q4", prompt: "The concert has been ___ until further notice.", options: ["turned on", "looked after", "put off"], correctIndex: 2, explanation: "put off = postponed." },
        { id: "e4q5", prompt: "She ___ a small business from her bedroom.", options: ["picked up", "set up", "gave up"], correctIndex: 1, explanation: "set up = established." },
        { id: "e4q6", prompt: "Despite the difficulties, he ___ and finished his degree.", options: ["carried on", "turned off", "put off"], correctIndex: 0, explanation: "carry on = continue despite difficulties." },
        { id: "e4q7", prompt: "The kids ___ some bad language at school.", options: ["turned on", "gave up", "picked up"], correctIndex: 2, explanation: "pick up = learned informally (bad habits too)." },
        { id: "e4q8", prompt: "Don't forget to ___ all the lights when you leave.", options: ["turn off", "set up", "carry on"], correctIndex: 0, explanation: "turn off = switch off." },
        { id: "e4q9", prompt: "She ___ a charity to help homeless people.", options: ["gave up", "found out", "set up"], correctIndex: 2, explanation: "set up = established." },
        { id: "e4q10", prompt: "I ___ that my flight had been cancelled.", options: ["carried on", "found out", "looked after"], correctIndex: 1, explanation: "find out = discovered the fact." },
      ],
    },
  }), []);

  const current = sets[exNo];

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    const total = current.questions.length;
    for (const q of current.questions) { if (mcqAnswers[q.id] === q.correctIndex) correct++; }
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }, [checked, current, mcqAnswers]);

  function resetExercise() { setChecked(false); setMcqAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b1">Grammar B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Phrasal Verbs</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Phrasal{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Verbs</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        A <b>phrasal verb</b> is a verb combined with a particle (preposition or adverb) that creates a new meaning: <i>give <b>up</b></i> (quit), <i>look <b>after</b></i> (take care of). This lesson covers the most common B1 phrasal verbs: <b>give up, look after, find out, put off, turn on/off, pick up, carry on, set up</b>.
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
                  {current.questions.map((q, idx) => {
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
                      <div className="mt-2 text-xs text-slate-500">
                        {score.percent >= 80 ? "Excellent! You've completed all B1 topics." : score.percent >= 50 ? "Good effort! Review any phrasal verbs you missed." : "Keep practising — check the Explanation tab for the full list."}
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

      <div className="mt-10 flex items-center justify-start gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
      </div>
    </div>
  );
}

function Explanation() {
  const verbs = [
    { verb: "give up", meaning: "stop doing sth / quit", example: "She gave up smoking." },
    { verb: "look after", meaning: "take care of", example: "He looks after his sister." },
    { verb: "find out", meaning: "discover / learn information", example: "I found out she was leaving." },
    { verb: "put off", meaning: "postpone / delay", example: "They put off the meeting." },
    { verb: "turn on", meaning: "switch on / activate", example: "Turn on the lights." },
    { verb: "turn off", meaning: "switch off / deactivate", example: "Turn off the TV." },
    { verb: "pick up", meaning: "learn informally / collect / catch", example: "She picked up French quickly." },
    { verb: "carry on", meaning: "continue", example: "Carry on — don't stop!" },
    { verb: "set up", meaning: "establish / arrange / start", example: "They set up a new business." },
  ];

  return (
    <div className="prose max-w-none prose-slate">
      <h2>Phrasal Verbs — B1 Reference</h2>
      <p>A phrasal verb is a verb + particle (preposition/adverb). The meaning is often idiomatic — different from the individual words.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="grid gap-2">
          {[["Phrasal verb", "Meaning", "Example"], ...verbs.map(v => [v.verb, v.meaning, v.example])].map((row, i) => (
            <div key={i} className={`grid grid-cols-3 gap-3 text-sm ${i === 0 ? "font-bold text-slate-500 text-xs uppercase pb-2 border-b" : "text-slate-700"}`}>
              <span className={i === 0 ? "" : "font-black text-slate-900"}>{row[0]}</span>
              <span>{row[1]}</span>
              <span className="italic">{row[2]}</span>
            </div>
          ))}
        </div>
      </div>

      <h3>Separable vs inseparable</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { type: "Separable — object can go between verb and particle", color: "border-sky-200 bg-sky-50 text-sky-700", ex: "Turn off the lights. ✓\nTurn the lights off. ✓\nTurn them off. ✓ (pronoun: must go between)" },
          { type: "Inseparable — object always after particle", color: "border-violet-200 bg-violet-50 text-violet-700", ex: "Look after the children. ✓\n✗ Look the children after.\nLook after them. ✓" },
        ].map(({ type, color, ex }) => (
          <div key={type} className={`rounded-xl border p-4 ${color}`}>
            <div className="text-sm font-black mb-1">{type}</div>
            <div className="text-sm text-slate-600 whitespace-pre-line italic">{ex}</div>
          </div>
        ))}
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Pronoun rule:</span> With separable phrasal verbs, pronouns <b>must</b> go between the verb and particle: <i>Turn it off</i> ✓ / <i>Turn off it</i> ✗
        </div>
      </div>
    </div>
  );
}
