"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function PresentPerfectContinuousLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct form",
      instructions: "Choose the correct Present Perfect Continuous form (have/has been + -ing).",
      questions: [
        { id: "e1q1", prompt: "She ___ all morning and she looks exhausted.", options: ["worked", "has been working", "is working"], correctIndex: 1, explanation: "has been working = ongoing activity with a visible result (looks exhausted)." },
        { id: "e1q2", prompt: "I ___ here for two hours — where have you been?", options: ["waited", "have been waiting", "am waiting"], correctIndex: 1, explanation: "have been waiting = duration up to now." },
        { id: "e1q3", prompt: "They ___ since 9am — they deserve a break.", options: ["studied", "have been studying", "were studying"], correctIndex: 1, explanation: "have been studying = started in the past, still ongoing." },
        { id: "e1q4", prompt: "He looks tired — he ___ all night.", options: ["drove", "has been driving", "drives"], correctIndex: 1, explanation: "has been driving = reason for looking tired (ongoing activity)." },
        { id: "e1q5", prompt: "How long ___ you ___ English?", options: ["did/learn", "have/been learning", "are/learning"], correctIndex: 1, explanation: "How long + have been + -ing for duration." },
        { id: "e1q6", prompt: "We ___ about this for weeks without a solution.", options: ["talked", "have been talking", "talk"], correctIndex: 1, explanation: "have been talking = ongoing process, still continuing." },
        { id: "e1q7", prompt: "She ___ — her eyes are red and she has tissues.", options: ["was crying", "has been crying", "cried"], correctIndex: 1, explanation: "has been crying = visible present result of a recent activity." },
        { id: "e1q8", prompt: "I ___ well lately — maybe I'm coming down with something.", options: ["didn't feel", "haven't been feeling", "wasn't feeling"], correctIndex: 1, explanation: "haven't been feeling = ongoing state up to now." },
        { id: "e1q9", prompt: "It ___ all week — the garden is flooded.", options: ["rained", "has been raining", "rains"], correctIndex: 1, explanation: "has been raining = ongoing weather condition with a result." },
        { id: "e1q10", prompt: "___ he ___ long? His coffee is cold.", options: ["Did/wait", "Has/been waiting", "Was/waiting"], correctIndex: 1, explanation: "Has he been waiting = duration question." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the Present Perfect Continuous form",
      instructions: "Write the correct Present Perfect Continuous form (have/has been + -ing).",
      questions: [
        { id: "e2q1", prompt: "She (work) ___ on this project for months.", correct: "has been working", explanation: "she + has been + working" },
        { id: "e2q2", prompt: "I (wait) ___ for you for over an hour!", correct: "have been waiting", explanation: "I + have been + waiting" },
        { id: "e2q3", prompt: "He (not/sleep) ___ well lately.", correct: "hasn't been sleeping", explanation: "he + hasn't been + sleeping" },
        { id: "e2q4", prompt: "They (argue) ___ all evening.", correct: "have been arguing", explanation: "they + have been + arguing" },
        { id: "e2q5", prompt: "How long (you/study) ___ English?", correct: "have you been studying", explanation: "have + you + been + studying" },
        { id: "e2q6", prompt: "It (rain) ___ since yesterday morning.", correct: "has been raining", explanation: "it + has been + raining" },
        { id: "e2q7", prompt: "She (learn) ___ to drive — she had a lesson this morning.", correct: "has been learning", explanation: "she + has been + learning" },
        { id: "e2q8", prompt: "I (think) ___ about your offer all week.", correct: "have been thinking", explanation: "I + have been + thinking" },
        { id: "e2q9", prompt: "We (look) ___ for a new flat for months.", correct: "have been looking", explanation: "we + have been + looking" },
        { id: "e2q10", prompt: "(he/exercise) ___ recently? He looks great.", correct: "has he been exercising", explanation: "has + he + been + exercising" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Present Perfect Continuous vs Present Perfect Simple",
      instructions: "Choose the most natural form. Think about whether you focus on the activity (continuous) or the result/completion (simple).",
      questions: [
        { id: "e3q1", prompt: "I ___ this book — it's brilliant! You should read it.", options: ["have been reading", "have read"], correctIndex: 1, explanation: "have read = completed action, result = I finished it and recommend it." },
        { id: "e3q2", prompt: "I ___ this book all week but I haven't finished it.", options: ["have read", "have been reading"], correctIndex: 1, explanation: "have been reading = ongoing, incomplete action (still in progress)." },
        { id: "e3q3", prompt: "She ___ all afternoon — she's covered in paint.", options: ["has painted", "has been painting"], correctIndex: 1, explanation: "has been painting = focus on the activity itself, with a visible result." },
        { id: "e3q4", prompt: "She ___ three rooms so far.", options: ["has been painting", "has painted"], correctIndex: 1, explanation: "has painted = completed quantity (three rooms = counted result)." },
        { id: "e3q5", prompt: "They ___ about the problem but haven't found a solution yet.", options: ["have talked", "have been talking"], correctIndex: 1, explanation: "have been talking = ongoing process with no result yet." },
        { id: "e3q6", prompt: "I ___ my keys! Has anyone seen them?", options: ["have been losing", "have lost"], correctIndex: 1, explanation: "have lost = present result (they are missing now)." },
        { id: "e3q7", prompt: "He ___ here for 10 years.", options: ["has been working", "has worked"], correctIndex: 0, explanation: "has been working = emphasises ongoing duration (still works there)." },
        { id: "e3q8", prompt: "You look hot — ___ you ___?", options: ["Have/run", "Have/been running"], correctIndex: 1, explanation: "Have you been running = focus on recent activity (explains appearance)." },
        { id: "e3q9", prompt: "We ___ three meetings this week.", options: ["have been having", "have had"], correctIndex: 1, explanation: "have had = completed number of events (three = countable result)." },
        { id: "e3q10", prompt: "I ___ all day — I need a break.", options: ["have worked", "have been working"], correctIndex: 1, explanation: "have been working = focus on the ongoing effort/activity all day." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the correct form",
      instructions: "Write Present Perfect Continuous OR Present Perfect Simple depending on context.",
      questions: [
        { id: "e4q1", prompt: "The kids (play) ___ outside all day — look how dirty they are.", correct: "have been playing", explanation: "Activity + visible result → have been playing." },
        { id: "e4q2", prompt: "She (feel) ___ unwell since Monday.", correct: "has been feeling", explanation: "Ongoing state → has been feeling." },
        { id: "e4q3", prompt: "I (try) ___ to call you all morning!", correct: "have been trying", explanation: "Repeated ongoing effort → have been trying." },
        { id: "e4q4", prompt: "How long (you/work) ___ here?", correct: "have you been working", explanation: "How long = duration question → have you been working." },
        { id: "e4q5", prompt: "He (not/eat) ___ properly — he's lost weight.", correct: "hasn't been eating", explanation: "Ongoing habit + visible result → hasn't been eating." },
        { id: "e4q6", prompt: "I (read) ___ four books this month — a new record!", correct: "have read", explanation: "Completed count (four books) → have read (simple)." },
        { id: "e4q7", prompt: "They (renovate) ___ their kitchen — it still isn't finished.", correct: "have been renovating", explanation: "Ongoing, incomplete → have been renovating." },
        { id: "e4q8", prompt: "She (run) ___ every day this week — she's in training.", correct: "has been running", explanation: "Repeated ongoing activity → has been running." },
        { id: "e4q9", prompt: "It (snow) ___ — the roads are icy.", correct: "has been snowing", explanation: "Recent ongoing activity with present result → has been snowing." },
        { id: "e4q10", prompt: "I (already/finish) ___ the report — you can send it.", correct: "have already finished", explanation: "Completed action, result ready → have already finished (simple)." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b1">Grammar B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Present Perfect Continuous</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Present Perfect{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Continuous</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The Present Perfect Continuous uses <b>have / has been + -ing</b>. It emphasises the <b>duration</b> or <b>ongoing nature</b> of an activity that started in the past and continues now, or has just stopped with a visible result: <i>She <b>has been crying</b> — her eyes are red.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <AdUnit variant="sidebar-dark" />

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

        <AdUnit variant="sidebar-dark" />
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/used-to" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Used to →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Present Perfect Continuous (B1)</h2>
      <p>Formed with <b>have / has been + verb-ing</b>. It focuses on the <b>activity itself</b> — its duration, ongoing nature, or recent visible result — rather than its completion.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Forms</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Positive", rows: ["I / you / we / they have been working.", "He / she / it has been working."] },
            { label: "Negative", rows: ["I / you / we / they haven't been working.", "He / she / it hasn't been working."] },
            { label: "Question", rows: ["Have I / you / we / they been working?", "Has he / she / it been working?"] },
            { label: "How long?", rows: ["How long have you been waiting?", "How long has it been raining?"] },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
              {rows.map((r) => <div key={r} className="text-sm text-slate-800 italic">{r}</div>)}
            </div>
          ))}
        </div>
      </div>

      <h3>Continuous vs Simple — when to choose</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
          <div className="text-xs font-bold text-violet-600 mb-2">CONTINUOUS — focus on activity</div>
          <div className="space-y-2 text-sm text-slate-700">
            <div>Duration: <i>I&apos;ve been waiting <b>for an hour</b>.</i></div>
            <div>Ongoing: <i>She&apos;s been working all day.</i></div>
            <div>Visible result: <i>He&apos;s been running — he&apos;s sweating.</i></div>
          </div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <div className="text-xs font-bold text-sky-600 mb-2">SIMPLE — focus on result/completion</div>
          <div className="space-y-2 text-sm text-slate-700">
            <div>Completed: <i>I&apos;ve <b>read</b> that book. (= finished it)</i></div>
            <div>Count: <i>She&apos;s written <b>three emails</b>.</i></div>
            <div>State verbs: <i>I&apos;ve known him for years.</i></div>
          </div>
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
        <div className="text-sm text-slate-800">
          <span className="font-black text-red-700">⚠ State verbs don&apos;t use continuous:</span> Verbs like <b>know, believe, understand, love, hate, want, need</b> are not normally used in continuous form.<br />
          <i>✅ I&apos;ve known him for years.</i> &nbsp; <i>❌ I&apos;ve been knowing him for years.</i>
        </div>
      </div>

      <div className="not-prose mt-3 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Ask yourself:</span> Is the focus on <b>how long</b> or <b>the activity</b>? → use Continuous. Is the focus on <b>how many / whether it&apos;s done</b>? → use Simple.
        </div>
      </div>
    </div>
  );
}
