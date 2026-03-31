"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function PastPerfectContinuousLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct form",
      instructions: "Choose the correct Past Perfect Continuous form (had been + -ing).",
      questions: [
        { id: "e1q1", prompt: "She was tired because she ___ all day.", options: ["had been working", "had worked", "was working"], correctIndex: 0, explanation: "had been working = emphasises duration and explains the tiredness." },
        { id: "e1q2", prompt: "When I arrived, they ___ for hours.", options: ["waited", "had waited", "had been waiting"], correctIndex: 2, explanation: "had been waiting = continuous duration up to my arrival." },
        { id: "e1q3", prompt: "His hands were dirty because he ___ the car.", options: ["had been fixing", "has been fixing", "was fixing"], correctIndex: 0, explanation: "had been fixing = visible result/evidence of the activity." },
        { id: "e1q4", prompt: "I ___ English for two years before I moved to London.", options: ["studied", "had studied", "had been studying"], correctIndex: 2, explanation: "had been studying = duration of an ongoing activity before a past event." },
        { id: "e1q5", prompt: "The ground was wet. It ___ all night.", options: ["rained", "had rained", "had been raining"], correctIndex: 2, explanation: "had been raining = continuous activity whose result (wet ground) we can see." },
        { id: "e1q6", prompt: "He ___ so long that he lost his voice.", options: ["had been singing", "had sung", "was singing"], correctIndex: 0, explanation: "had been singing = prolonged activity causing a result." },
        { id: "e1q7", prompt: "They ___ together for five years when they got married.", options: ["lived", "had been living", "have been living"], correctIndex: 1, explanation: "had been living = duration up to a past event (getting married)." },
        { id: "e1q8", prompt: "She felt sick because she ___ in the sun too long.", options: ["sat", "had sat", "had been sitting"], correctIndex: 2, explanation: "had been sitting = continuous activity causing a result." },
        { id: "e1q9", prompt: "___ you ___ long when the bus arrived?", options: ["Had / been waiting", "Have / been waiting", "Were / waiting"], correctIndex: 0, explanation: "Had you been waiting = Past Perfect Continuous question." },
        { id: "e1q10", prompt: "The children ___ all day, so they fell asleep immediately.", options: ["had played", "had been playing", "were playing"], correctIndex: 1, explanation: "had been playing = continuous activity explaining why they fell asleep." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the Past Perfect Continuous form",
      instructions: "Write the correct Past Perfect Continuous form of the verb in brackets (had been + -ing).",
      questions: [
        { id: "e2q1", prompt: "She (run) ___ for an hour before she stopped to rest.", correct: "had been running", explanation: "had been running = duration before stopping." },
        { id: "e2q2", prompt: "He was sweating because he (exercise) ___ at the gym.", correct: "had been exercising", explanation: "had been exercising = explains visible state (sweating)." },
        { id: "e2q3", prompt: "They (travel) ___ for three weeks when they finally reached the coast.", correct: "had been travelling", explanation: "had been travelling = duration up to a past point." },
        { id: "e2q4", prompt: "I (not/sleep) ___ well, so I felt exhausted.", correct: "hadn't been sleeping", explanation: "hadn't been sleeping = negative continuous." },
        { id: "e2q5", prompt: "The students (study) ___ all night before the exam.", correct: "had been studying", explanation: "had been studying = extended activity before a past event." },
        { id: "e2q6", prompt: "How long (she/wait) ___ when you got there?", correct: "had she been waiting", explanation: "had she been waiting = question form." },
        { id: "e2q7", prompt: "He smelled of paint because he (decorate) ___ all afternoon.", correct: "had been decorating", explanation: "had been decorating = explains the smell (visible result)." },
        { id: "e2q8", prompt: "We (live) ___ there for two years before we decided to move.", correct: "had been living", explanation: "had been living = duration before a past decision." },
        { id: "e2q9", prompt: "She (cry) ___ — her eyes were red.", correct: "had been crying", explanation: "had been crying = explains the visible result (red eyes)." },
        { id: "e2q10", prompt: "They (argue) ___ for ages when he finally walked out.", correct: "had been arguing", explanation: "had been arguing = ongoing activity before a final action." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Past Perfect Continuous vs Past Perfect",
      instructions: "Choose the correct tense. Think about whether duration/activity or completion matters.",
      questions: [
        { id: "e3q1", prompt: "He was exhausted because he ___ 15 miles.", options: ["had been running", "had run"], correctIndex: 1, explanation: "had run 15 miles = completed distance (result/amount) → Past Perfect." },
        { id: "e3q2", prompt: "She was out of breath because she ___.", options: ["had been running", "had run"], correctIndex: 0, explanation: "had been running = activity in progress (no specific amount) → Past Perfect Continuous." },
        { id: "e3q3", prompt: "By the time the film started, they ___ three glasses of wine.", options: ["had been drinking", "had drunk"], correctIndex: 1, explanation: "had drunk = specific completed amount → Past Perfect." },
        { id: "e3q4", prompt: "Her fingers were sore because she ___ the piano.", options: ["had been playing", "had played"], correctIndex: 0, explanation: "had been playing = prolonged activity causing a result." },
        { id: "e3q5", prompt: "I ___ the report, so I handed it in.", options: ["had been writing", "had written"], correctIndex: 1, explanation: "had written = completed task → Past Perfect." },
        { id: "e3q6", prompt: "The kitchen smelled wonderful. She ___ all morning.", options: ["had been cooking", "had cooked"], correctIndex: 0, explanation: "had been cooking = ongoing activity explaining the smell." },
        { id: "e3q7", prompt: "He already ___ when we invited him, so he said yes.", options: ["had been eating", "hadn't eaten"], correctIndex: 1, explanation: "hadn't eaten = he hadn't completed the action of eating → Past Perfect." },
        { id: "e3q8", prompt: "They were late because they ___ traffic for two hours.", options: ["had been sitting in", "had sat in"], correctIndex: 0, explanation: "had been sitting in traffic = duration of an ongoing situation." },
        { id: "e3q9", prompt: "The mechanic ___ the engine. It was ready to go.", options: ["had been fixing", "had fixed"], correctIndex: 1, explanation: "had fixed = completed repair → Past Perfect." },
        { id: "e3q10", prompt: "She looked pale because she ___ ill for days.", options: ["had been feeling", "had felt"], correctIndex: 0, explanation: "had been feeling ill = continuous state over a period." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Past Perfect Continuous, Past Perfect, or Past Simple?",
      instructions: "Write the correct tense of the verb in brackets. Think carefully about whether to use Past Perfect Continuous, Past Perfect, or Past Simple.",
      questions: [
        { id: "e4q1", prompt: "She was late because she (miss) ___ her train.", correct: "had missed", explanation: "had missed = single completed event before being late → Past Perfect." },
        { id: "e4q2", prompt: "The children were muddy because they (play) ___ outside.", correct: "had been playing", explanation: "had been playing = ongoing activity explaining the muddy result." },
        { id: "e4q3", prompt: "By the time he (arrive) ___, everyone had left.", correct: "arrived", explanation: "arrived = the reference point is Past Simple; had left = Past Perfect." },
        { id: "e4q4", prompt: "I (work) ___ on the project for six hours before the power cut.", correct: "had been working", explanation: "had been working = duration before the sudden interruption." },
        { id: "e4q5", prompt: "She (read) ___ the whole book, so she knew how it ended.", correct: "had read", explanation: "had read = completed action (the whole book) → Past Perfect." },
        { id: "e4q6", prompt: "His voice was hoarse because he (shout) ___ at the concert.", correct: "had been shouting", explanation: "had been shouting = prolonged activity explaining the hoarse voice." },
        { id: "e4q7", prompt: "They (not/eat) ___ since morning, so they were starving.", correct: "hadn't eaten", explanation: "hadn't eaten = no eating at all → Past Perfect negative." },
        { id: "e4q8", prompt: "How long (you/study) ___ before you felt ready for the exam?", correct: "had you been studying", explanation: "had you been studying = duration question → Past Perfect Continuous." },
        { id: "e4q9", prompt: "When the boss (enter) ___, the team quickly sat down.", correct: "entered", explanation: "entered = the point-in-time event → Past Simple." },
        { id: "e4q10", prompt: "I could tell she (cry) ___ — her eyes were swollen.", correct: "had been crying", explanation: "had been crying = visible evidence of an ongoing past activity." },
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
        <span className="text-slate-700 font-medium">Past Perfect Continuous</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Past Perfect{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Continuous</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The Past Perfect Continuous uses <b>had been + -ing</b>. It emphasises the <b>duration</b> of an activity that was in progress before a past event or explains the <b>visible result</b> of that activity: <i>She was tired because she <b>had been working</b> all day.</i>
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
        <a href="/grammar/b2/future-continuous" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Future Continuous →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Past Perfect Continuous (B2)</h2>
      <p>The Past Perfect Continuous (<b>had been + -ing</b>) focuses on the <b>duration</b> of an activity in progress before a past event, or on an activity whose <b>visible result</b> we can observe.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Forms (same for all subjects)</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Positive", rows: ["I / she / they had been working.", "He had been running for an hour."] },
            { label: "Negative", rows: ["I / she / they hadn't been sleeping.", "He hadn't been eating well."] },
            { label: "Question", rows: ["Had she been waiting long?", "How long had they been arguing?"] },
            { label: "Short answers", rows: ["Yes, she had. / No, she hadn't.", "Yes, they had. / No, they hadn't."] },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
              {rows.map((r) => <div key={r} className="text-sm text-slate-800 italic">{r}</div>)}
            </div>
          ))}
        </div>
      </div>

      <h3>Two main uses</h3>
      <div className="not-prose space-y-3 mt-2">
        {[
          { title: "1. Duration before a past event", ex: "She had been working for 12 hours when she finally stopped.", note: "Signal words: for, since, all day/morning/week" },
          { title: "2. Visible result / evidence", ex: "His eyes were red. He had been crying.", note: "The activity explains the observable state." },
        ].map(({ title, ex, note }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-bold text-slate-900 text-sm">{title}</div>
            <div className="mt-1 italic text-slate-700 text-sm">{ex}</div>
            <div className="mt-1 text-xs text-slate-500">{note}</div>
          </div>
        ))}
      </div>

      <h3>Past Perfect Continuous vs Past Perfect</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="text-xs font-bold text-orange-700 mb-2">CONTINUOUS — duration / activity</div>
            <div className="text-sm italic text-slate-800">She was exhausted because she had been running.</div>
            <div className="mt-1 text-xs text-slate-500">Focus on the ongoing activity.</div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <div className="text-xs font-bold text-sky-700 mb-2">SIMPLE — completed amount / result</div>
            <div className="text-sm italic text-slate-800">She had run 10 km before breakfast.</div>
            <div className="mt-1 text-xs text-slate-500">Focus on the completed distance/amount.</div>
          </div>
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Note:</span> Stative verbs (know, believe, want, love) are not used in continuous forms. Say <i>I had known her for years</i>, not ~~I had been knowing~~.
        </div>
      </div>
    </div>
  );
}
