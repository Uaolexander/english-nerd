"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function ShouldShouldntLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Should or shouldn't?",
      instructions: "Choose should or shouldn't to complete each sentence.",
      questions: [
        { id: "e1q1", prompt: "You look exhausted. You ___ go to bed earlier.", options: ["should", "shouldn't"], correctIndex: 0, explanation: "Going to bed earlier is good advice here → should." },
        { id: "e1q2", prompt: "That film is terrible. You ___ waste your time on it.", options: ["should", "shouldn't"], correctIndex: 1, explanation: "Not a good idea to watch it → shouldn't." },
        { id: "e1q3", prompt: "I have a headache. ___ I take an aspirin?", options: ["Should", "Shouldn't"], correctIndex: 0, explanation: "Asking for advice → Should I...?" },
        { id: "e1q4", prompt: "He eats too much junk food. He ___ eat more vegetables.", options: ["should", "shouldn't"], correctIndex: 0, explanation: "Positive advice → should." },
        { id: "e1q5", prompt: "She drives too fast. She ___ slow down.", options: ["should", "shouldn't"], correctIndex: 0, explanation: "Advice to improve behaviour → should." },
        { id: "e1q6", prompt: "The weather is perfect! We ___ go for a walk.", options: ["should", "shouldn't"], correctIndex: 0, explanation: "Recommendation → should." },
        { id: "e1q7", prompt: "You ___ be late for your interview — it creates a terrible impression.", options: ["should", "shouldn't"], correctIndex: 1, explanation: "Being late is not a good idea → shouldn't." },
        { id: "e1q8", prompt: "I think you ___ apologise — you were quite rude.", options: ["should", "shouldn't"], correctIndex: 0, explanation: "Advice: apologising is the right thing → should." },
        { id: "e1q9", prompt: "He&apos;s really ill. He ___ go to work today.", options: ["should", "shouldn't"], correctIndex: 1, explanation: "Going to work while ill is not a good idea → shouldn't." },
        { id: "e1q10", prompt: "You ___ forget to save your work — you might lose everything!", options: ["should", "shouldn't"], correctIndex: 1, explanation: "Forgetting is not a good idea → shouldn't." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write should or shouldn't",
      instructions: "Write should or shouldn't to complete each sentence.",
      questions: [
        { id: "e2q1", prompt: "You have a headache. You ___ take an aspirin.", correct: "should", explanation: "Advice: taking an aspirin is helpful → should." },
        { id: "e2q2", prompt: "It&apos;s very cold outside. You ___ wear a coat.", correct: "should", explanation: "Advice for wellbeing → should." },
        { id: "e2q3", prompt: "He smokes too much. He ___ really stop.", correct: "should", explanation: "Strong advice to change a bad habit → should." },
        { id: "e2q4", prompt: "She ___ eat so much fast food — it&apos;s really unhealthy.", correct: "shouldn't", explanation: "Eating too much fast food is not a good idea → shouldn't." },
        { id: "e2q5", prompt: "You&apos;re learning English. You ___ practise every day.", correct: "should", explanation: "Advice for improvement → should." },
        { id: "e2q6", prompt: "The bus ___ be this late again — it&apos;s the third time this week!", correct: "shouldn't", explanation: "It&apos;s not acceptable / not right → shouldn't." },
        { id: "e2q7", prompt: "I think you ___ tell her the truth.", correct: "should", explanation: "Personal recommendation → should." },
        { id: "e2q8", prompt: "Children ___ stay up past midnight on school nights.", correct: "shouldn't", explanation: "Not a good idea for children → shouldn't." },
        { id: "e2q9", prompt: "You ___ try this restaurant — the food is incredible!", correct: "should", explanation: "Strong positive recommendation → should." },
        { id: "e2q10", prompt: "We ___ waste water — it&apos;s a precious resource.", correct: "shouldn't", explanation: "Wasting water is not right → shouldn't." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Should vs other modals",
      instructions: "Choose the most natural modal. Think about whether it's advice, obligation, or prohibition.",
      questions: [
        { id: "e3q1", prompt: "It&apos;s the law. You ___ wear a seatbelt.", options: ["should", "have to", "shouldn't"], correctIndex: 1, explanation: "It's the law = external obligation → have to (not just advice)." },
        { id: "e3q2", prompt: "In my opinion, you ___ read this book — it&apos;s brilliant.", options: ["have to", "mustn't", "should"], correctIndex: 2, explanation: "Personal recommendation / opinion → should." },
        { id: "e3q3", prompt: "You ___ use your phone here. It&apos;s strictly forbidden.", options: ["shouldn't", "should", "mustn't"], correctIndex: 2, explanation: "Forbidden = prohibition → mustn't (stronger than shouldn't)." },
        { id: "e3q4", prompt: "I really feel I ___ apologise — I was awful to her.", options: ["should", "must", "have to"], correctIndex: 1, explanation: "Strong internal feeling / personal necessity → must." },
        { id: "e3q5", prompt: "If you want to feel healthier, you ___ exercise more often.", options: ["must", "have to", "should"], correctIndex: 2, explanation: "Friendly advice / recommendation → should." },
        { id: "e3q6", prompt: "He ___ shout at his colleagues like that — it&apos;s very unpleasant.", options: ["mustn't", "should", "shouldn't"], correctIndex: 2, explanation: "Opinion: it&apos;s not a good behaviour → shouldn't." },
        { id: "e3q7", prompt: "You ___ pay extra — Wi-Fi is included in the price.", options: ["shouldn't", "don't have to", "mustn't"], correctIndex: 1, explanation: "No obligation → don't have to (not prohibition, just not necessary)." },
        { id: "e3q8", prompt: "I think she ___ take the job — it sounds perfect for her.", options: ["has to", "must", "should"], correctIndex: 2, explanation: "Friendly personal advice → should." },
        { id: "e3q9", prompt: "You ___ bring your passport — it&apos;s required by law.", options: ["should", "have to", "must"], correctIndex: 1, explanation: "Legal/external requirement → have to." },
        { id: "e3q10", prompt: "Doctors say people ___ sleep at least 7 hours a night.", options: ["must", "should", "have to"], correctIndex: 1, explanation: "General recommendation / advice from experts → should." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write should or shouldn't",
      instructions: "Write should or shouldn't. Think about whether the advice is positive or negative.",
      questions: [
        { id: "e4q1", prompt: "He eats junk food every day. He ___ eat more vegetables.", correct: "should", explanation: "Positive advice → should." },
        { id: "e4q2", prompt: "You ___ drink and drive — it&apos;s extremely dangerous.", correct: "shouldn't", explanation: "Not a good idea, dangerous → shouldn't." },
        { id: "e4q3", prompt: "I&apos;m not sure what to do. What do you think I ___?", correct: "should", explanation: "Asking for advice → should (What should I do?)." },
        { id: "e4q4", prompt: "She ___ be so negative all the time — it affects everyone.", correct: "shouldn't", explanation: "Not a good behaviour → shouldn't." },
        { id: "e4q5", prompt: "You ___ always check your work before submitting it.", correct: "should", explanation: "Good habit / advice → should." },
        { id: "e4q6", prompt: "We ___ throw rubbish on the street — it&apos;s bad for the environment.", correct: "shouldn't", explanation: "Not a good action → shouldn't." },
        { id: "e4q7", prompt: "In my view, the government ___ invest more in public transport.", correct: "should", explanation: "Opinion / recommendation → should." },
        { id: "e4q8", prompt: "You ___ judge people before you really know them.", correct: "shouldn't", explanation: "Not a good idea → shouldn't." },
        { id: "e4q9", prompt: "I think you ___ apply for that job — you&apos;re perfect for it!", correct: "should", explanation: "Strong positive recommendation → should." },
        { id: "e4q10", prompt: "He ___ be so rude to the customers — it&apos;s very unprofessional.", correct: "shouldn't", explanation: "Criticism of bad behaviour → shouldn't." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Should / Shouldn't</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Should /{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">shouldn&apos;t</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>should</b> to give advice, make recommendations, or express opinions about the right thing to do. Use <b>shouldn&apos;t</b> when something is not a good idea. <b>Should</b> is softer than <b>must</b> or <b>have to</b> — it&apos;s a suggestion, not a rule.
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
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/adverbs-manner" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Adverbs of Manner →</a>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Should / Shouldn&apos;t — Advice</h2>
        <p className="text-slate-500 text-sm">should = advice and recommendations — the same form for ALL subjects</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2">Affirmative (+)</div>
          <Formula parts={[{ text: "Subject", color: "sky" }, { dim: true, text: "+" }, { text: "should", color: "yellow" }, { dim: true, text: "+" }, { text: "verb", color: "green" }]} />
          <div className="mt-2 text-xs italic text-slate-600">You should eat more vegetables.</div>
        </div>
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4">
          <div className="text-xs font-black text-red-700 uppercase tracking-wide mb-2">Negative (−)</div>
          <Formula parts={[{ text: "Subject", color: "sky" }, { dim: true, text: "+" }, { text: "shouldn't", color: "red" }, { dim: true, text: "+" }, { text: "verb", color: "green" }]} />
          <div className="mt-2 text-xs italic text-slate-600">You shouldn&apos;t stay up late.</div>
        </div>
        <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
          <div className="text-xs font-black text-sky-700 uppercase tracking-wide mb-2">Question (?)</div>
          <Formula parts={[{ text: "Should", color: "yellow" }, { dim: true, text: "+" }, { text: "Subject", color: "sky" }, { dim: true, text: "+" }, { text: "verb", color: "green" }, { text: "?", color: "slate" }]} />
          <div className="mt-2 text-xs italic text-slate-600">Should I call her?</div>
        </div>
      </div>

      {/* Key rule card */}
      <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4">
        <div className="text-xs font-black text-violet-700 uppercase tracking-wide mb-2">Key rule — same for ALL subjects</div>
        <div className="grid gap-2 sm:grid-cols-3 text-sm text-slate-700">
          {[
            "I should rest.",
            "You should rest.",
            "He should rest.",
            "She should rest.",
            "We should rest.",
            "They should rest.",
          ].map(s => (
            <div key={s} className="rounded-lg bg-white border border-violet-100 px-3 py-2 italic">{s}</div>
          ))}
        </div>
        <div className="mt-2 text-xs text-violet-700 font-semibold">No -s, no change — should is always should</div>
      </div>

      {/* Usage cards */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
          <div className="text-xs font-black text-sky-700 uppercase tracking-wide mb-2">Giving advice</div>
          <div className="text-sm text-slate-700 italic">You should see a doctor. / You should drink more water.</div>
        </div>
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2">Opinion / recommendation</div>
          <div className="text-sm text-slate-700 italic">You should try this film. / I think they should invest more.</div>
        </div>
      </div>

      {/* Short answers */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black text-amber-800">!</span>
          <span className="text-sm font-bold text-slate-700">Short answers</span>
        </div>
        <div className="grid gap-2 md:grid-cols-2 text-sm text-slate-700">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 italic">Should I try? — <b>Yes, you should.</b></div>
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 italic">Should we hurry? — <b>No, we shouldn&apos;t.</b></div>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <div className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2">Examples</div>
        <Ex en="She should rest." />
        <Ex en="She should to rest." correct={false} />
        <Ex en="You should go home." />
        <Ex en="You shoulds go home." correct={false} />
      </div>

      {/* Amber tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">should + base verb, NO &ldquo;to&rdquo;!</span> Always say <b>should go</b>, not <i>should to go</i>. Should is a modal verb — it is followed directly by the base verb with no infinitive marker.
      </div>
    </div>
  );
}
