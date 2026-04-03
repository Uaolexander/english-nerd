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

export default function PassivePresentLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose am / is / are",
      instructions: "Choose the correct form of 'be' (am/is/are) to complete the Present Simple Passive.",
      questions: [
        { id: "e1q1", prompt: "English ___ spoken in many countries around the world.", options: ["am", "is", "are"], correctIndex: 1, explanation: "English = singular noun → is spoken." },
        { id: "e1q2", prompt: "These cars ___ made in Germany.", options: ["is", "am", "are"], correctIndex: 2, explanation: "These cars = plural → are made." },
        { id: "e1q3", prompt: "I ___ paid at the end of the month.", options: ["are", "is", "am"], correctIndex: 2, explanation: "I → am paid." },
        { id: "e1q4", prompt: "The letters ___ delivered every morning.", options: ["is", "are", "am"], correctIndex: 1, explanation: "The letters = plural → are delivered." },
        { id: "e1q5", prompt: "The meeting ___ held every Friday at 9 a.m.", options: ["are", "am", "is"], correctIndex: 2, explanation: "The meeting = singular → is held." },
        { id: "e1q6", prompt: "New employees ___ trained by the manager.", options: ["is", "are", "am"], correctIndex: 1, explanation: "New employees = plural → are trained." },
        { id: "e1q7", prompt: "The website ___ updated regularly.", options: ["are", "am", "is"], correctIndex: 2, explanation: "The website = singular → is updated." },
        { id: "e1q8", prompt: "The windows ___ cleaned every week.", options: ["is", "am", "are"], correctIndex: 2, explanation: "The windows = plural → are cleaned." },
        { id: "e1q9", prompt: "Rice ___ grown in many Asian countries.", options: ["am", "are", "is"], correctIndex: 2, explanation: "Rice = uncountable singular → is grown." },
        { id: "e1q10", prompt: "You ___ not allowed to park here.", options: ["am", "is", "are"], correctIndex: 2, explanation: "You → are not allowed." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the passive form",
      instructions: "Write the correct Present Simple Passive using the verb in brackets (am/is/are + past participle).",
      questions: [
        { id: "e2q1", prompt: "Coffee ___ (grow) in Brazil and Colombia.", correct: "is grown", explanation: "coffee → is + grown (grow → grew → grown)." },
        { id: "e2q2", prompt: "The reports ___ (write) by the team every week.", correct: "are written", explanation: "the reports → are + written." },
        { id: "e2q3", prompt: "I ___ (invite) to all the company events.", correct: "am invited", explanation: "I → am + invited." },
        { id: "e2q4", prompt: "These phones ___ (sell) all over the world.", correct: "are sold", explanation: "these phones → are + sold." },
        { id: "e2q5", prompt: "The data ___ (store) on a secure server.", correct: "is stored", explanation: "the data → is + stored." },
        { id: "e2q6", prompt: "New students ___ (welcome) at the orientation.", correct: "are welcomed", explanation: "new students → are + welcomed." },
        { id: "e2q7", prompt: "The film ___ (direct) by a famous director.", correct: "is directed", explanation: "the film → is + directed." },
        { id: "e2q8", prompt: "Mistakes ___ (make) sometimes — that's normal.", correct: "are made", explanation: "mistakes → are + made." },
        { id: "e2q9", prompt: "The bill ___ (pay) by the company.", correct: "is paid", explanation: "the bill → is + paid." },
        { id: "e2q10", prompt: "Languages ___ (teach) in all schools here.", correct: "are taught", explanation: "languages → are + taught." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Active or Passive?",
      instructions: "Choose the best option: active or passive form.",
      questions: [
        { id: "e3q1", prompt: "This bridge ___ every year by the city council.", options: ["inspects", "is inspected"], correctIndex: 1, explanation: "The subject (bridge) receives the action → passive: is inspected." },
        { id: "e3q2", prompt: "The manager ___ the report every Monday morning.", options: ["reviews", "is reviewed"], correctIndex: 0, explanation: "The manager does the action → active: reviews." },
        { id: "e3q3", prompt: "Thousands of emails ___ every day.", options: ["send", "are sent"], correctIndex: 1, explanation: "Emails receive the action → passive: are sent." },
        { id: "e3q4", prompt: "She ___ three languages fluently.", options: ["speaks", "is spoken"], correctIndex: 0, explanation: "She is the doer → active: speaks." },
        { id: "e3q5", prompt: "The new rules ___ to all students.", options: ["apply", "are applied"], correctIndex: 1, explanation: "Rules receive the action → passive: are applied." },
        { id: "e3q6", prompt: "My sister ___ yoga every morning.", options: ["does", "is done"], correctIndex: 0, explanation: "My sister is the doer → active: does." },
        { id: "e3q7", prompt: "Rice ___ in many Asian countries.", options: ["grows", "is grown"], correctIndex: 1, explanation: "Rice = product of cultivation → passive: is grown." },
        { id: "e3q8", prompt: "The dog ___ by my neighbour when I travel.", options: ["looks after", "is looked after"], correctIndex: 1, explanation: "Dog receives care → passive: is looked after." },
        { id: "e3q9", prompt: "They ___ a new hospital in the city centre.", options: ["build", "is built"], correctIndex: 0, explanation: "'They' is the active subject → active: build." },
        { id: "e3q10", prompt: "Cheese ___ from milk.", options: ["makes", "is made"], correctIndex: 1, explanation: "Cheese is the product → passive: is made." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Active to Passive",
      instructions: "Rewrite the active sentence in the passive. Write only the passive verb phrase (am/is/are + pp). Omit the agent if it's 'people' or 'someone'.",
      questions: [
        { id: "e4q1", prompt: "People speak French in Quebec. → French ___ in Quebec.", correct: "is spoken", explanation: "French → is spoken (people omitted)." },
        { id: "e4q2", prompt: "Someone delivers the newspaper every morning. → The newspaper ___.", correct: "is delivered", explanation: "newspaper → is delivered (someone omitted)." },
        { id: "e4q3", prompt: "The factory produces 500 cars a day. → 500 cars ___ a day by the factory.", correct: "are produced", explanation: "500 cars → are produced." },
        { id: "e4q4", prompt: "People eat pizza all over Italy. → Pizza ___ all over Italy.", correct: "is eaten", explanation: "pizza → is eaten (people omitted)." },
        { id: "e4q5", prompt: "The company employs 200 people. → 200 people ___ by the company.", correct: "are employed", explanation: "200 people → are employed." },
        { id: "e4q6", prompt: "Someone cleans the office every night. → The office ___ every night.", correct: "is cleaned", explanation: "office → is cleaned (someone omitted)." },
        { id: "e4q7", prompt: "People grow tea in India and China. → Tea ___ in India and China.", correct: "is grown", explanation: "tea → is grown (people omitted)." },
        { id: "e4q8", prompt: "They hold the festival in July every year. → The festival ___ in July every year.", correct: "is held", explanation: "festival → is held." },
        { id: "e4q9", prompt: "The bank charges a fee. → A fee ___ by the bank.", correct: "is charged", explanation: "a fee → is charged." },
        { id: "e4q10", prompt: "People use this road every day. → This road ___ every day.", correct: "is used", explanation: "this road → is used (people omitted)." },
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
        <span className="text-slate-700 font-medium">Passive Voice — Present</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Passive Voice —{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Present</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The <b>Present Simple Passive</b> is formed with <b>am / is / are + past participle</b>: <i>English <b>is spoken</b> here.</i> We use it when the action is more important than who does it, or when the doer is unknown or obvious.
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
        <a href="/grammar/b1/passive-past" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Passive Voice — Past →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Passive Voice — Present Simple (B1)</h2>
      <p>The <b>Present Simple Passive</b> is formed with <b>am / is / are + past participle</b>. We use it when the action matters more than the person doing it.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Forms</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Positive", rows: ["English is spoken here.", "Cars are made in this factory.", "I am paid monthly."] },
            { label: "Negative", rows: ["It is not sold here.", "They are not included.", "I am not invited."] },
            { label: "Question", rows: ["Is it made in the UK?", "Are they trained here?", "Am I included?"] },
            { label: "With 'by' (agent)", rows: ["Coffee is grown by farmers.", "The report is written by the team.", "I am paid by the company."] },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
              {rows.map((r) => <div key={r} className="text-sm text-slate-800 italic">{r}</div>)}
            </div>
          ))}
        </div>
      </div>

      <h3>When to use the passive</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { use: "Doer is unknown", color: "border-violet-200 bg-violet-50 text-violet-700", ex: "My bike was stolen. (we don't know who)" },
          { use: "Doer is obvious", color: "border-sky-200 bg-sky-50 text-sky-700", ex: "The criminal is arrested. (by police — obvious)" },
          { use: "Action is more important", color: "border-emerald-200 bg-emerald-50 text-emerald-700", ex: "Oil is found in the North Sea." },
          { use: "Formal / scientific writing", color: "border-amber-200 bg-amber-50 text-amber-700", ex: "The results are analysed carefully." },
        ].map(({ use, color, ex }) => (
          <div key={use} className={`rounded-xl border p-4 ${color}`}>
            <div className="text-sm font-black mb-1">{use}</div>
            <div className="text-sm text-slate-600 italic">{ex}</div>
          </div>
        ))}
      </div>

      <h3>Active → Passive transformation</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-3 text-sm text-slate-700">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
          <span className="text-xs font-bold text-slate-500 uppercase">Active</span>
          <span className="italic">People <b>speak</b> English here.</span>
          <span className="text-xs font-bold text-slate-500 uppercase">Passive</span>
          <span className="italic">English <b>is spoken</b> here.</span>
        </div>
        <div className="text-xs text-slate-500 border-t pt-3">Object becomes subject · verb becomes is/are + pp · agent (by …) optional</div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 am / is / are?</span> Match to the <b>new subject</b>: <b>I → am</b>, <b>he/she/it/singular → is</b>, <b>you/we/they/plural → are</b>.
        </div>
      </div>
    </div>
  );
}
