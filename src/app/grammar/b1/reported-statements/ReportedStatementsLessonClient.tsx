"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function ReportedStatementsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct reported verb",
      instructions: "Choose the correct backshifted verb for the reported speech.",
      questions: [
        { id: "e1q1", prompt: "Direct: 'I live in Paris.' → She said she ___ in Paris.", options: ["lives", "lived", "live"], correctIndex: 1, explanation: "Present Simple → Past Simple in reported speech: lives → lived." },
        { id: "e1q2", prompt: "Direct: 'I am tired.' → He said he ___ tired.", options: ["is", "was", "will be"], correctIndex: 1, explanation: "am/is/are → was/were: is → was." },
        { id: "e1q3", prompt: "Direct: 'I have finished.' → She said she ___ finished.", options: ["has", "had", "have"], correctIndex: 1, explanation: "Present Perfect → Past Perfect: has → had." },
        { id: "e1q4", prompt: "Direct: 'I will help you.' → He said he ___ help me.", options: ["will", "would", "shall"], correctIndex: 1, explanation: "will → would in reported speech." },
        { id: "e1q5", prompt: "Direct: 'I was cooking.' → She said she ___ cooking.", options: ["is", "was", "had been"], correctIndex: 2, explanation: "Past Continuous → Past Perfect Continuous: was cooking → had been cooking." },
        { id: "e1q6", prompt: "Direct: 'I can swim.' → He said he ___ swim.", options: ["can", "could", "would"], correctIndex: 1, explanation: "can → could in reported speech." },
        { id: "e1q7", prompt: "Direct: 'I don't know.' → She said she ___ know.", options: ["doesn't", "didn't", "don't"], correctIndex: 1, explanation: "Present Simple negative → Past Simple: doesn't → didn't." },
        { id: "e1q8", prompt: "Direct: 'I am going to leave.' → He said he ___ going to leave.", options: ["is", "was", "will be"], correctIndex: 1, explanation: "am/is → was: is going → was going." },
        { id: "e1q9", prompt: "Direct: 'I have been waiting.' → She said she ___ waiting.", options: ["has been", "had been", "was"], correctIndex: 1, explanation: "Present Perfect Continuous → Past Perfect Continuous: has been → had been." },
        { id: "e1q10", prompt: "Direct: 'I must leave.' → He said he ___ to leave.", options: ["must", "had", "would have"], correctIndex: 1, explanation: "must → had to in reported speech." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Say or Tell?",
      instructions: "Choose 'said' or 'told' to complete the reported speech sentence. Remember: tell needs an object (tell someone), say doesn't.",
      questions: [
        { id: "e2q1", prompt: "She ___ that she was tired.", options: ["said", "told"], correctIndex: 0, explanation: "No object follows → said (not 'said me')." },
        { id: "e2q2", prompt: "He ___ me that he would be late.", options: ["said", "told"], correctIndex: 1, explanation: "Object 'me' follows → told me." },
        { id: "e2q3", prompt: "They ___ that the meeting was cancelled.", options: ["said", "told"], correctIndex: 0, explanation: "No object → said." },
        { id: "e2q4", prompt: "She ___ her friend that she couldn't come.", options: ["said", "told"], correctIndex: 1, explanation: "Object 'her friend' follows → told her friend." },
        { id: "e2q5", prompt: "He ___ a joke and everyone laughed.", options: ["said", "told"], correctIndex: 1, explanation: "tell a joke is a fixed phrase: told a joke." },
        { id: "e2q6", prompt: "She ___ that she had already eaten.", options: ["told", "said"], correctIndex: 1, explanation: "No object → said." },
        { id: "e2q7", prompt: "The doctor ___ me I needed to rest.", options: ["said", "told"], correctIndex: 1, explanation: "Object 'me' follows → told me." },
        { id: "e2q8", prompt: "He ___ the truth in the end.", options: ["said", "told"], correctIndex: 1, explanation: "tell the truth is a fixed phrase → told." },
        { id: "e2q9", prompt: "She ___ goodbye and left.", options: ["said", "told"], correctIndex: 0, explanation: "say goodbye is a fixed phrase → said." },
        { id: "e2q10", prompt: "They ___ us that prices would go up.", options: ["said", "told"], correctIndex: 1, explanation: "Object 'us' follows → told us." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the reported statement",
      instructions: "Change the direct speech to reported speech. Write only the reported clause (e.g. 'she was tired').",
      questions: [
        { id: "e3q1", prompt: "'I work in a hospital.' → He said (that) he ___.", correct: "worked in a hospital", explanation: "work → worked (Present Simple → Past Simple)." },
        { id: "e3q2", prompt: "'She is coming tomorrow.' → He said (that) she ___.", correct: "was coming the next day", explanation: "is coming → was coming; tomorrow → the next day." },
        { id: "e3q3", prompt: "'I have lost my keys.' → She said (that) she ___.", correct: "had lost her keys", explanation: "have lost → had lost (Present Perfect → Past Perfect)." },
        { id: "e3q4", prompt: "'We will finish soon.' → They said (that) they ___.", correct: "would finish soon", explanation: "will → would." },
        { id: "e3q5", prompt: "'I can't find it.' → She said (that) she ___.", correct: "couldn't find it", explanation: "can't → couldn't." },
        { id: "e3q6", prompt: "'I don't like this.' → He said (that) he ___.", correct: "didn't like it", explanation: "don't like → didn't like; this → it." },
        { id: "e3q7", prompt: "'They are going to move.' → She said (that) they ___.", correct: "were going to move", explanation: "are going → were going." },
        { id: "e3q8", prompt: "'I must call her.' → He said (that) he ___ her.", correct: "had to call", explanation: "must → had to." },
        { id: "e3q9", prompt: "'I was sleeping.' → She said (that) she ___.", correct: "had been sleeping", explanation: "was sleeping → had been sleeping." },
        { id: "e3q10", prompt: "'We have been waiting.' → They said (that) they ___.", correct: "had been waiting", explanation: "have been waiting → had been waiting." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Full reported sentences",
      instructions: "Write the complete reported speech sentence, changing pronouns, time expressions, and verbs as needed.",
      questions: [
        { id: "e4q1", prompt: "Direct: 'I live here.' (She / said) →", correct: "she said she lived there", explanation: "I → she; live → lived; here → there." },
        { id: "e4q2", prompt: "Direct: 'I'll call you tomorrow.' (He / told me) →", correct: "he told me he would call me the next day", explanation: "I → he; you → me; 'll → would; tomorrow → the next day." },
        { id: "e4q3", prompt: "Direct: 'We have finished the project.' (They / said) →", correct: "they said they had finished the project", explanation: "We → they; have finished → had finished." },
        { id: "e4q4", prompt: "Direct: 'I can't come today.' (She / told him) →", correct: "she told him she couldn't come that day", explanation: "I → she; can't → couldn't; today → that day." },
        { id: "e4q5", prompt: "Direct: 'I am going to resign.' (He / said) →", correct: "he said he was going to resign", explanation: "I → he; am → was." },
        { id: "e4q6", prompt: "Direct: 'We were waiting for an hour.' (They / said) →", correct: "they said they had been waiting for an hour", explanation: "We → they; were waiting → had been waiting." },
        { id: "e4q7", prompt: "Direct: 'I don't know the answer.' (She / told me) →", correct: "she told me she didn't know the answer", explanation: "I → she; don't → didn't." },
        { id: "e4q8", prompt: "Direct: 'I must leave now.' (He / said) →", correct: "he said he had to leave then", explanation: "I → he; must → had to; now → then." },
        { id: "e4q9", prompt: "Direct: 'We'll be here tomorrow.' (They / told us) →", correct: "they told us they would be there the next day", explanation: "We → they; 'll → would; here → there; tomorrow → the next day." },
        { id: "e4q10", prompt: "Direct: 'I've never been to Japan.' (She / said) →", correct: "she said she had never been to japan", explanation: "I → she; have never been → had never been." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b1">Grammar B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Reported Speech — Statements</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Reported Speech —{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Statements</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        <b>Reported speech</b> (indirect speech) is used to say what someone said without quoting them directly. Verbs shift back in time: <i>She said she <b>was</b> tired.</i> We also change pronouns and time expressions.
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
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/reported-questions" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Reported Speech — Questions →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Reported Speech — Statements (B1)</h2>
      <p>We use <b>reported speech</b> (indirect speech) to say what someone said without quoting their exact words. The most common reporting verb is <b>said</b> or <b>told</b>.</p>

      <h3>Tense backshift</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="grid gap-2">
          {[
            ["Direct speech", "Reported speech"],
            ["Present Simple: I work", "Past Simple: she worked"],
            ["Present Continuous: I am going", "Past Continuous: she was going"],
            ["Present Perfect: I have done", "Past Perfect: she had done"],
            ["Past Simple: I went", "Past Perfect: she had gone"],
            ["will", "would"],
            ["can", "could"],
            ["must", "had to"],
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-2 gap-4 text-sm ${i === 0 ? "font-bold text-slate-500 text-xs uppercase pb-2 border-b" : "text-slate-700 italic"}`}>
              <span>{row[0]}</span>
              <span>{row[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <h3>Said vs Told</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { use: "say / said — no object", color: "border-violet-200 bg-violet-50 text-violet-700", ex: "She said (that) she was tired.\n✗ She said me that…" },
          { use: "tell / told — needs object", color: "border-sky-200 bg-sky-50 text-sky-700", ex: "He told me that he would be late.\n✗ He told that…" },
        ].map(({ use, color, ex }) => (
          <div key={use} className={`rounded-xl border p-4 ${color}`}>
            <div className="text-sm font-black mb-1">{use}</div>
            <div className="text-sm text-slate-600 whitespace-pre-line italic">{ex}</div>
          </div>
        ))}
      </div>

      <h3>Pronoun &amp; time expression changes</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="grid gap-2">
          {[
            ["Direct", "Reported"],
            ["I → she/he", "we → they"],
            ["my → her/his", "our → their"],
            ["here → there", "this → that"],
            ["now → then", "today → that day"],
            ["tomorrow → the next day", "yesterday → the day before"],
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-2 gap-4 text-sm ${i === 0 ? "font-bold text-slate-500 text-xs uppercase pb-2 border-b" : "text-slate-700"}`}>
              <span>{row[0]}</span>
              <span>{row[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 'that' is optional:</span> Both <i>&quot;She said <b>that</b> she was tired&quot;</i> and <i>&quot;She said she was tired&quot;</i> are correct. In spoken English, <i>that</i> is often omitted.
        </div>
      </div>
    </div>
  );
}
