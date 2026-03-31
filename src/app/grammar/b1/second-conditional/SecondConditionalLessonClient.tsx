"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function SecondConditionalLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct form",
      instructions: "Choose the correct verb form to complete the second conditional (if + past simple, would + infinitive).",
      questions: [
        { id: "e1q1", prompt: "If I had more money, I ___ travel the world.", options: ["would", "will", "am going to"], correctIndex: 0, explanation: "Second conditional result → would travel." },
        { id: "e1q2", prompt: "If she ___ harder, she would get better results.", options: ["worked", "works", "will work"], correctIndex: 0, explanation: "Second conditional if-clause → past simple: worked." },
        { id: "e1q3", prompt: "He would buy a car if he ___ enough money.", options: ["had", "has", "will have"], correctIndex: 0, explanation: "If-clause → past simple: had." },
        { id: "e1q4", prompt: "If I were you, I ___ accept the offer.", options: ["would", "will", "am going to"], correctIndex: 0, explanation: "Second conditional advice (if I were you) → would accept." },
        { id: "e1q5", prompt: "They ___ win more matches if they trained properly.", options: ["would", "will", "do"], correctIndex: 0, explanation: "Hypothetical result → would win." },
        { id: "e1q6", prompt: "If she ___ taller, she could be a model.", options: ["was/were", "is", "will be"], correctIndex: 0, explanation: "Unreal condition → past simple: was/were." },
        { id: "e1q7", prompt: "What ___ you do if you lost your job?", options: ["would", "will", "do"], correctIndex: 0, explanation: "Hypothetical question → would." },
        { id: "e1q8", prompt: "I ___ be so nervous if I knew more people here.", options: ["wouldn't", "won't", "don't"], correctIndex: 0, explanation: "Negative second conditional → wouldn't." },
        { id: "e1q9", prompt: "If it ___ warmer, we would go for a swim.", options: ["was/were", "is", "will be"], correctIndex: 0, explanation: "If-clause → past simple: was/were." },
        { id: "e1q10", prompt: "She would speak better if she ___ more.", options: ["practised", "practises", "will practise"], correctIndex: 0, explanation: "If-clause → past simple: practised." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — First or Second Conditional?",
      instructions: "Choose the correct tense. Is the situation real/possible (first) or hypothetical/unreal (second)?",
      questions: [
        { id: "e2q1", prompt: "If I ___ a million euros tomorrow, I'd buy a house. (winning the lottery — very unlikely)", options: ["won", "win"], correctIndex: 0, explanation: "Very unlikely → second conditional: won." },
        { id: "e2q2", prompt: "If it ___ tomorrow, we'll cancel the match. (it might rain)", options: ["rains", "rained"], correctIndex: 0, explanation: "Real future possibility → first conditional: rains." },
        { id: "e2q3", prompt: "I'd be so happy if I ___ this job. (I probably won't get it)", options: ["got", "get"], correctIndex: 0, explanation: "Unlikely/hypothetical → second: got." },
        { id: "e2q4", prompt: "If she ___ now, she'll catch the bus. (she can still leave)", options: ["leaves", "left"], correctIndex: 0, explanation: "Real possible future → first: leaves." },
        { id: "e2q5", prompt: "What would you do if you ___ invisible? (impossible)", options: ["were", "are"], correctIndex: 0, explanation: "Impossible situation → second: were." },
        { id: "e2q6", prompt: "If he ___ early, he'll be able to help us. (it's possible)", options: ["arrives", "arrived"], correctIndex: 0, explanation: "Real possible event → first: arrives." },
        { id: "e2q7", prompt: "If I ___ you, I wouldn't worry. (giving advice, I'm not you)", options: ["were", "am"], correctIndex: 0, explanation: "Hypothetical advice → second: were." },
        { id: "e2q8", prompt: "If you ___ me, I'll give you a lift. (you might ask)", options: ["ask", "asked"], correctIndex: 0, explanation: "Real future possibility → first: ask." },
        { id: "e2q9", prompt: "She'd pass the exam if she ___ more carefully. (she probably won't)", options: ["read", "reads"], correctIndex: 0, explanation: "Unlikely, hypothetical → second: read." },
        { id: "e2q10", prompt: "If he ___ his phone, he'll call you. (he should find it soon)", options: ["finds", "found"], correctIndex: 0, explanation: "Real likely future → first: finds." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the correct form",
      instructions: "Write the correct form of the verb in brackets to complete the second conditional.",
      questions: [
        { id: "e3q1", prompt: "If I ___ (be) taller, I'd play basketball.", correct: "were", explanation: "Second conditional if-clause → past simple: were (or was)." },
        { id: "e3q2", prompt: "She would travel more if she ___ (have) more free time.", correct: "had", explanation: "If-clause → past simple: had." },
        { id: "e3q3", prompt: "If he ___ (not / be) so shy, he'd make more friends.", correct: "weren't", explanation: "Negative if-clause → weren't (or wasn't)." },
        { id: "e3q4", prompt: "What would you buy if you ___ (win) the lottery?", correct: "won", explanation: "Hypothetical if-clause → won." },
        { id: "e3q5", prompt: "I ___ (not / eat) there if I were you — the reviews are terrible.", correct: "wouldn't eat", explanation: "Second conditional result → wouldn't eat." },
        { id: "e3q6", prompt: "If they ___ (live) closer, we'd see them more often.", correct: "lived", explanation: "If-clause → past simple: lived." },
        { id: "e3q7", prompt: "She ___ (be) much happier if she changed jobs.", correct: "would be", explanation: "Second conditional result → would be." },
        { id: "e3q8", prompt: "If I ___ (speak) better French, I'd move to Paris.", correct: "spoke", explanation: "If-clause → past simple: spoke." },
        { id: "e3q9", prompt: "He ___ (help) you if you asked him.", correct: "would help", explanation: "Second conditional result → would help." },
        { id: "e3q10", prompt: "If the weather ___ (be) better, we'd go to the beach.", correct: "were", explanation: "If-clause → were (or was)." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Hardest) — Mixed First & Second",
      instructions: "Read the context carefully and choose first or second conditional.",
      questions: [
        { id: "e4q1", prompt: "Context: I want to go running but it might rain. → If it ___, I'll stay inside.", options: ["rains", "rained"], correctIndex: 0, explanation: "Real future possibility → first: rains." },
        { id: "e4q2", prompt: "Context: I'm dreaming about being a rock star (I'm not). → If I ___ a rock star, I'd perform at huge concerts.", options: ["were", "am"], correctIndex: 0, explanation: "Unreal/imaginary → second: were." },
        { id: "e4q3", prompt: "Context: My friend might lend me her bike. → If she ___ me her bike, I'll cycle to work.", options: ["lends", "lent"], correctIndex: 0, explanation: "Real likely future → first: lends." },
        { id: "e4q4", prompt: "Context: I'm giving advice — I think they should quit. → If I ___ them, I would quit.", options: ["were", "am"], correctIndex: 0, explanation: "Hypothetical advice (I'm not them) → second: were." },
        { id: "e4q5", prompt: "Context: She's planning to study this evening, and it's likely. → If she ___, she'll probably pass.", options: ["studies", "studied"], correctIndex: 0, explanation: "Real likely event → first: studies." },
        { id: "e4q6", prompt: "Context: He's imagining having a superpower. → If he ___ fly, he'd never take a bus.", options: ["could", "can"], correctIndex: 0, explanation: "Imaginary/unreal → second: could." },
        { id: "e4q7", prompt: "Context: The forecast says there's a 70% chance of snow tomorrow. → If it ___, school will be cancelled.", options: ["snows", "snowed"], correctIndex: 0, explanation: "Real future possibility → first: snows." },
        { id: "e4q8", prompt: "Context: She's dreaming about being fluent in Japanese (she isn't). → If she ___ Japanese, she'd work in Tokyo.", options: ["spoke", "speaks"], correctIndex: 0, explanation: "Unreal current situation → second: spoke." },
        { id: "e4q9", prompt: "Context: The meeting might be cancelled — we're waiting for news. → If it ___, we'll have more time.", options: ["is cancelled", "were cancelled"], correctIndex: 0, explanation: "Real future event → first: is cancelled." },
        { id: "e4q10", prompt: "Context: Imagining a perfect world. → If everyone ___ each other, there would be no wars.", options: ["respected", "respects"], correctIndex: 0, explanation: "Hypothetical ideal → second: respected." },
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
        <span className="text-slate-700 font-medium">Second Conditional</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Second{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Conditional</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The <b>second conditional</b> uses <b>if + past simple, would + infinitive</b>. It expresses hypothetical or unreal situations — things that are unlikely, impossible, or just imaginary: <i>If I <b>had</b> more time, I <b>would travel</b>.</i>
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
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/all-conditionals" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: All Conditionals (0/1/2) →</a>
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Second Conditional</h2>
        <p className="text-slate-500 text-sm">Imaginary present &amp; future situations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-3">If Clause</div>
          <Formula parts={[
            { text: "If", color: "slate" },
            { dim: true },
            { text: "subject", color: "slate" },
            { dim: true },
            { text: "Past Simple", color: "sky" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>If I <b>had</b> more money…</div>
            <div>If she <b>spoke</b> French…</div>
            <div>If I <b>were</b> you…</div>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-violet-600 mb-3">Main Clause</div>
          <Formula parts={[
            { text: "subject", color: "slate" },
            { dim: true },
            { text: "would", color: "violet" },
            { dim: true },
            { text: "base verb", color: "slate" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>…I <b>would travel</b> the world.</div>
            <div>…she <b>would move</b> to Paris.</div>
            <div>…I <b>wouldn't say</b> that.</div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Full Formula</div>
        <Formula parts={[
          { text: "If", color: "slate" },
          { dim: true },
          { text: "subject", color: "slate" },
          { dim: true },
          { text: "past simple", color: "sky" },
          { text: ",", color: "slate" },
          { text: "subject", color: "slate" },
          { dim: true },
          { text: "would", color: "violet" },
          { dim: true },
          { text: "verb", color: "slate" },
        ]} />
      </div>

      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <div className="text-xs font-bold uppercase text-violet-600 mb-3">The "Were" Rule</div>
        <div className="text-sm text-slate-700 space-y-2">
          <div>In formal English, use <b>were</b> for ALL subjects (not was):</div>
          <div className="italic text-slate-600">If I <b>were</b> rich, I'd buy a yacht.</div>
          <div className="italic text-slate-600">If she <b>were</b> here, she'd know what to do.</div>
          <div className="italic text-slate-600">If I <b>were</b> you, I would accept the offer.</div>
          <div className="text-xs text-slate-400 pt-2 border-t border-violet-100">Both "were" and "was" are accepted at B1 level, but "were" is preferred in writing.</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Common Mistake</div>
        <Ex en="If I would have money, I would travel." correct={false} />
        <Ex en="If I had money, I would travel." correct={true} />
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Remember:</span> The second conditional uses PAST SIMPLE (not past perfect) in the if-clause. The main clause always uses "would + base verb" — never "would + past tense".
      </div>
    </div>
  );
}
