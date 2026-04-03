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

export default function RelativeClausesNonDefiningLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose who or which",
      instructions: "Choose the correct relative pronoun for the non-defining relative clause. Remember: 'that' is NOT used in non-defining clauses.",
      questions: [
        { id: "e1q1", prompt: "My sister, ___ lives in Paris, is visiting next week.", options: ["who", "which", "that"], correctIndex: 0, explanation: "Person → who. 'that' is never used in non-defining clauses." },
        { id: "e1q2", prompt: "The Eiffel Tower, ___ was built in 1889, attracts millions of tourists.", options: ["who", "which", "that"], correctIndex: 1, explanation: "Thing → which. Never 'that' in non-defining clauses." },
        { id: "e1q3", prompt: "My boss, ___ I respect a lot, gave me a promotion.", options: ["who", "which", "that"], correctIndex: 0, explanation: "Person → who." },
        { id: "e1q4", prompt: "The new law, ___ was passed last month, affects everyone.", options: ["who", "which", "that"], correctIndex: 1, explanation: "Thing → which." },
        { id: "e1q5", prompt: "My grandfather, ___ was a sailor, travelled the world.", options: ["who", "which", "that"], correctIndex: 0, explanation: "Person → who." },
        { id: "e1q6", prompt: "The film, ___ won three Oscars, is now on streaming.", options: ["who", "which", "that"], correctIndex: 1, explanation: "Thing → which." },
        { id: "e1q7", prompt: "London, ___ I visited last summer, is a wonderful city.", options: ["which", "who", "that"], correctIndex: 0, explanation: "Place (as thing) → which (or where)." },
        { id: "e1q8", prompt: "Her new novel, ___ took five years to write, is a bestseller.", options: ["who", "which", "that"], correctIndex: 1, explanation: "Thing → which." },
        { id: "e1q9", prompt: "Our neighbour, ___ is 90 years old, still goes jogging.", options: ["who", "which", "that"], correctIndex: 0, explanation: "Person → who." },
        { id: "e1q10", prompt: "The report, ___ was written by the CEO, caused controversy.", options: ["who", "which", "that"], correctIndex: 1, explanation: "Thing → which." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Defining or Non-defining?",
      instructions: "Read each sentence. Is the relative clause defining (no commas, essential) or non-defining (commas, extra info)?",
      questions: [
        { id: "e2q1", prompt: "My brother, who lives in Canada, is coming to visit.", options: ["Defining", "Non-defining"], correctIndex: 1, explanation: "Commas + extra info about a specific person (my brother) → non-defining." },
        { id: "e2q2", prompt: "The student who got 100% won a prize.", options: ["Defining", "Non-defining"], correctIndex: 0, explanation: "No commas, tells us WHICH student → defining." },
        { id: "e2q3", prompt: "Shakespeare, who was born in 1564, wrote Hamlet.", options: ["Defining", "Non-defining"], correctIndex: 1, explanation: "Commas + extra info about a named person → non-defining." },
        { id: "e2q4", prompt: "The book that I lent you is very rare.", options: ["Defining", "Non-defining"], correctIndex: 0, explanation: "No commas, identifies which book → defining." },
        { id: "e2q5", prompt: "My car, which is ten years old, needs a new engine.", options: ["Defining", "Non-defining"], correctIndex: 1, explanation: "Commas + extra info → non-defining." },
        { id: "e2q6", prompt: "People who exercise regularly live longer.", options: ["Defining", "Non-defining"], correctIndex: 0, explanation: "No commas, identifies which people → defining." },
        { id: "e2q7", prompt: "The Amazon, which is the world's largest river, flows through Brazil.", options: ["Defining", "Non-defining"], correctIndex: 1, explanation: "Named unique thing + commas → non-defining." },
        { id: "e2q8", prompt: "Do you know anyone who can help me move?", options: ["Defining", "Non-defining"], correctIndex: 0, explanation: "Identifies which kind of person → defining." },
        { id: "e2q9", prompt: "Her father, who is a surgeon, works very long hours.", options: ["Defining", "Non-defining"], correctIndex: 1, explanation: "Commas + extra info about a specific known person → non-defining." },
        { id: "e2q10", prompt: "The hotel where we stayed had an amazing view.", options: ["Defining", "Non-defining"], correctIndex: 0, explanation: "No commas, identifies which hotel → defining." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write who, which, whose or where",
      instructions: "Write the correct relative pronoun for the non-defining relative clause.",
      questions: [
        { id: "e3q1", prompt: "My mother, ___ is a teacher, loves reading.", correct: "who", explanation: "Person → who." },
        { id: "e3q2", prompt: "The museum, ___ we visited yesterday, closes on Mondays.", correct: "which", explanation: "Thing → which." },
        { id: "e3q3", prompt: "Rome, ___ I lived for two years, is a beautiful city.", correct: "where", explanation: "Place → where." },
        { id: "e3q4", prompt: "My colleague, ___ wife is a journalist, won an award.", correct: "whose", explanation: "Possession → whose." },
        { id: "e3q5", prompt: "The new bridge, ___ opened last year, saves 20 minutes.", correct: "which", explanation: "Thing → which." },
        { id: "e3q6", prompt: "My best friend, ___ I've known for 15 years, is getting married.", correct: "who", explanation: "Person → who." },
        { id: "e3q7", prompt: "Paris, ___ is the capital of France, has excellent food.", correct: "which", explanation: "Place as thing → which." },
        { id: "e3q8", prompt: "The director, ___ latest film won an Oscar, is very talented.", correct: "whose", explanation: "Possession → whose." },
        { id: "e3q9", prompt: "My flat, ___ I've lived for three years, is very small.", correct: "where", explanation: "Place → where." },
        { id: "e3q10", prompt: "The match, ___ lasted nearly four hours, was incredible.", correct: "which", explanation: "Thing → which." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Hardest) — Spot the error",
      instructions: "One sentence in each pair is correct and one has an error. Choose the correct sentence.",
      questions: [
        { id: "e4q1", prompt: "Which sentence is correct?", options: ["My sister, that lives in Oslo, is a nurse.", "My sister, who lives in Oslo, is a nurse."], correctIndex: 1, explanation: "'that' cannot be used in non-defining relative clauses → who." },
        { id: "e4q2", prompt: "Which sentence is correct?", options: ["The Nile, which is the longest river in Africa, flows north.", "The Nile, that is the longest river in Africa, flows north."], correctIndex: 0, explanation: "Non-defining → which, not that." },
        { id: "e4q3", prompt: "Which sentence is correct?", options: ["He told me about his new job which made me happy.", "He told me about his new job, which made me happy."], correctIndex: 1, explanation: "The clause refers to the whole situation → needs comma + which." },
        { id: "e4q4", prompt: "Which sentence is correct?", options: ["My parents, who they live in the countryside, visit often.", "My parents, who live in the countryside, visit often."], correctIndex: 1, explanation: "Don't repeat the subject: 'who they live' is wrong." },
        { id: "e4q5", prompt: "Which sentence is correct?", options: ["The concert, which I went to last night, was amazing.", "The concert, which I went it to last night, was amazing."], correctIndex: 0, explanation: "Don't repeat the object: 'went it to' is wrong." },
        { id: "e4q6", prompt: "Which sentence is correct?", options: ["Mr Brown who is my neighbour, won the lottery.", "Mr Brown, who is my neighbour, won the lottery."], correctIndex: 1, explanation: "Non-defining clause needs commas on both sides." },
        { id: "e4q7", prompt: "Which sentence is correct?", options: ["Her car, which is red, needs a service.", "Her car which is red needs a service."], correctIndex: 0, explanation: "Non-defining clause needs commas." },
        { id: "e4q8", prompt: "Which sentence is correct?", options: ["Tokyo, where is the capital of Japan, is very crowded.", "Tokyo, which is the capital of Japan, is very crowded."], correctIndex: 1, explanation: "'where is' is wrong here — use which is (describing, not a place you go to)." },
        { id: "e4q9", prompt: "Which sentence is correct?", options: ["My friend, whose father is a pilot, travels a lot.", "My friend, who's father is a pilot, travels a lot."], correctIndex: 0, explanation: "Possession → whose (not who's, which means 'who is')." },
        { id: "e4q10", prompt: "Which sentence is correct?", options: ["The president, who gave a speech yesterday, is popular.", "The president, that gave a speech yesterday, is popular."], correctIndex: 0, explanation: "'that' is never used in non-defining clauses → who." },
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
        <span className="text-slate-700 font-medium">Relative Clauses — Non-defining</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Relative Clauses —{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Non-defining</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        A <b>non-defining relative clause</b> adds extra, non-essential information about something already identified. It is always separated by <b>commas</b>, and <b>that</b> cannot be used: <i>My sister, <b>who lives in Paris</b>, is a teacher.</i>
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
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
        <a href="/grammar/b1/too-enough" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Too &amp; Enough →</a>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text?: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) =>
        p.dim ? (
          <span key={i} className="text-slate-400 font-bold text-sm">+</span>
        ) : (
          <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${p.color ? colors[p.color] : colors.slate}`}>
            {p.text}
          </span>
        )
      )}
    </div>
  );
}

function Ex({ en, correct = true }: { en: string; correct?: boolean }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 ${correct ? "bg-white border border-black/8" : "bg-red-50 border border-red-100"}`}>
      <span className="text-sm shrink-0">{correct ? "✅" : "❌"}</span>
      <div className={`font-semibold text-sm ${correct ? "text-slate-900" : "text-red-700 line-through"}`}>{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Non-defining Relative Clauses</h2>
        <p className="text-slate-500 text-sm">Extra information set off by commas — can be removed without changing the core meaning</p>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Formula</div>
        <Formula parts={[
          { text: "Main clause", color: "sky" },
          { dim: true },
          { text: ",", color: "red" },
          { dim: true },
          { text: "relative pronoun", color: "yellow" },
          { dim: true },
          { text: "extra info", color: "green" },
          { dim: true },
          { text: ",", color: "red" },
          { dim: true },
          { text: "rest", color: "slate" },
        ]} />
      </div>

      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
        <div className="text-xs font-bold uppercase text-violet-600 mb-3">Key Rules</div>
        <ol className="space-y-1 text-sm text-violet-900 font-semibold list-decimal list-inside">
          <li>Always use commas to separate the clause.</li>
          <li>Cannot use &quot;that&quot; — use who, which, whose, where, when.</li>
          <li>Can be removed without changing the sentence meaning.</li>
        </ol>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Relative Pronouns (no &quot;that&quot;)</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { pronoun: "who", use: "people", ex: "My sister, who lives in Paris, is a doctor.", color: "border-emerald-200 bg-emerald-50", badge: "bg-emerald-100 text-emerald-800" },
            { pronoun: "which", use: "things", ex: "The film, which won an Oscar, is on TV.", color: "border-sky-200 bg-sky-50", badge: "bg-sky-100 text-sky-800" },
            { pronoun: "whose", use: "possession", ex: "My boss, whose office is huge, is strict.", color: "border-orange-200 bg-orange-50", badge: "bg-orange-100 text-orange-800" },
            { pronoun: "where", use: "places", ex: "Rome, where I lived, is beautiful.", color: "border-violet-200 bg-violet-50", badge: "bg-violet-100 text-violet-800" },
            { pronoun: "when", use: "times", ex: "Last summer, when we met, was wonderful.", color: "border-yellow-200 bg-yellow-50", badge: "bg-yellow-100 text-yellow-800" },
          ].map(({ pronoun, use, ex, color, badge }) => (
            <div key={pronoun} className={`rounded-2xl border p-4 ${color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${badge}`}>{pronoun}</span>
                <span className="text-xs text-slate-500">{use}</span>
              </div>
              <div className="text-sm text-slate-700 italic">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Defining vs Non-defining</div>
        <div className="grid gap-2">
          {[
            ["", "Defining", "Non-defining"],
            ["Commas", "No commas", "Always commas"],
            ["Information", "Essential", "Extra"],
            ["that", "OK", "NOT OK"],
            ["Remove clause?", "Changes meaning", "Sentence still fine"],
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-3 gap-3 text-sm ${i === 0 ? "font-bold text-slate-500 text-xs uppercase pb-2 border-b border-black/10" : "text-slate-700"}`}>
              <span className={i === 0 ? "" : "font-semibold text-slate-900"}>{row[0]}</span>
              <span>{row[1]}</span>
              <span>{row[2]}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Examples</div>
        <div className="space-y-2">
          <Ex en="My sister, that lives in Paris, is a doctor." correct={false} />
          <Ex en="My sister, who lives in Paris, is a doctor." correct={true} />
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <strong>Quick test:</strong> If you can remove the clause and the sentence still makes complete sense, it&apos;s non-defining — use commas.
      </div>
    </div>
  );
}
