"use client";

import { useMemo, useState } from "react";

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type InputQ = {
  id: string;
  prompt: string;
  correct: string;
  explanation: string;
};

type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function WillFutureLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Will or won't?",
      instructions: "Choose will or won't to complete each sentence.",
      questions: [
        { id: "e1q1", prompt: "Don't worry — everything ___ be okay.", options: ["will", "won't", "going to"], correctIndex: 0, explanation: "will be = positive prediction / reassurance." },
        { id: "e1q2", prompt: "I promise I ___ tell anyone your secret.", options: ["will", "won't", "am going to"], correctIndex: 1, explanation: "won't tell = will not tell. A promise not to do something." },
        { id: "e1q3", prompt: "She ___ love this gift — it's perfect for her!", options: ["will", "won't", "is going to"], correctIndex: 0, explanation: "will love = confident positive prediction." },
        { id: "e1q4", prompt: "The phone is ringing — I ___ get it!", options: ["am going to", "will", "won't"], correctIndex: 1, explanation: "will get it = spontaneous decision made at the moment of speaking." },
        { id: "e1q5", prompt: "Don't ask him — he ___ help you, he never does.", options: ["will", "won't", "is not going to"], correctIndex: 1, explanation: "won't help = will not help. Negative prediction about someone's behaviour." },
        { id: "e1q6", prompt: "I think she ___ get the job — she was brilliant at the interview.", options: ["will", "won't", "is going to"], correctIndex: 0, explanation: "will get = prediction based on opinion (I think…)" },
        { id: "e1q7", prompt: "It's my birthday tomorrow — I hope you ___ forget!", options: ["will", "won't", "are going to"], correctIndex: 1, explanation: "won't forget = will not forget. Expressing hope with a negative." },
        { id: "e1q8", prompt: "The doctor says she ___ make a full recovery.", options: ["will", "won't", "is going to"], correctIndex: 0, explanation: "will make = prediction / professional opinion." },
        { id: "e1q9", prompt: "I know! I ___ call a taxi — that'll solve the problem.", options: ["am going to", "will", "won't"], correctIndex: 1, explanation: "will call = spontaneous decision decided right now." },
        { id: "e1q10", prompt: "They ___ be here by 8 — they said they would come early.", options: ["will", "won't", "are going to"], correctIndex: 0, explanation: "will be = prediction / expectation based on a promise." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write will + verb or won't + verb",
      instructions: "Write the correct form: will + verb OR won't + verb (e.g. will go, won't come).",
      questions: [
        { id: "e2q1", prompt: "Don't worry — she ___ (be) fine. I'm sure.", correct: "will be", explanation: "will be = confident reassurance / prediction." },
        { id: "e2q2", prompt: "I'm sure they ___ (love) the film — it's incredible.", correct: "will love", explanation: "will love = prediction." },
        { id: "e2q3", prompt: "He ___ (not/come) to the party — he's working late.", correct: "won't come", explanation: "won't come = will not come. Negative prediction." },
        { id: "e2q4", prompt: "I ___ (help) you move the furniture — just say when.", correct: "will help", explanation: "will help = offer / spontaneous decision." },
        { id: "e2q5", prompt: "She ___ (not/tell) anyone — I trust her completely.", correct: "won't tell", explanation: "won't tell = will not tell." },
        { id: "e2q6", prompt: "He ___ (arrive) very late — the flight lands at midnight.", correct: "will arrive", explanation: "will arrive = prediction based on flight info." },
        { id: "e2q7", prompt: "They ___ (be) surprised when they see the new office.", correct: "will be", explanation: "will be = prediction." },
        { id: "e2q8", prompt: "I promise I ___ (remember) your birthday this year.", correct: "will remember", explanation: "will remember = promise." },
        { id: "e2q9", prompt: "It ___ (not/be) a problem — we have plenty of time.", correct: "won't be", explanation: "won't be = will not be. Negative reassurance." },
        { id: "e2q10", prompt: "She ___ (pass) the exam — she's been working so hard.", correct: "will pass", explanation: "will pass = confident prediction." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Will vs Going to",
      instructions: "Choose will or going to. Think about whether it is a spontaneous decision, a plan, or a prediction.",
      questions: [
        { id: "e3q1", prompt: "Look at those dark clouds! It ___ rain any second.", options: ["is going to", "will"], correctIndex: 0, explanation: "is going to = prediction based on visible evidence (you can see the clouds)." },
        { id: "e3q2", prompt: "'I'm thirsty.' — 'Wait, I ___ get you some water.'", options: ["am going to", "will"], correctIndex: 1, explanation: "will = spontaneous decision made at the moment of speaking." },
        { id: "e3q3", prompt: "He has booked the tickets and packed his bags — he ___ visit Paris.", options: ["will", "is going to"], correctIndex: 1, explanation: "is going to = a plan already made with preparation." },
        { id: "e3q4", prompt: "I think robots ___ replace many jobs in the future.", options: ["will", "are going to"], correctIndex: 0, explanation: "will = general prediction / opinion about the distant future." },
        { id: "e3q5", prompt: "'The printer is broken!' — 'I ___ call the IT department.'", options: ["am going to", "will"], correctIndex: 1, explanation: "will = decision made right now in response to the situation." },
        { id: "e3q6", prompt: "We've already chosen the venue — we ___ get married in June.", options: ["will", "are going to"], correctIndex: 1, explanation: "are going to = a specific plan already decided." },
        { id: "e3q7", prompt: "Be careful — you ___ knock over that glass!", options: ["will", "are going to"], correctIndex: 1, explanation: "are going to = prediction based on what you can see happening." },
        { id: "e3q8", prompt: "Scientists predict that sea levels ___ rise significantly by 2100.", options: ["will", "are going to"], correctIndex: 0, explanation: "will = prediction / expert forecast about the future." },
        { id: "e3q9", prompt: "She has already told her boss — she ___ resign next Friday.", options: ["will", "is going to"], correctIndex: 1, explanation: "is going to = a firm plan already communicated." },
        { id: "e3q10", prompt: "'There's no milk left!' — 'Don't worry, I ___ buy some on my way home.'", options: ["am going to", "will"], correctIndex: 1, explanation: "will = spontaneous decision made right now." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Will or going to: write the correct form",
      instructions: "Write will + verb, won't + verb, is/are going to + verb. Context will tell you which to use.",
      questions: [
        { id: "e4q1", prompt: "She has already enrolled — she ___ (study) dentistry from September.", correct: "is going to study", explanation: "A firm plan with preparation → is going to study." },
        { id: "e4q2", prompt: "'I can't open this jar.' — 'Give it to me, I ___ (try).'", correct: "will try", explanation: "Spontaneous offer made right now → will try." },
        { id: "e4q3", prompt: "'The baby is coming!' — 'I ___ (call) a doctor!'", correct: "will call", explanation: "Immediate spontaneous decision → will call." },
        { id: "e4q4", prompt: "Look at him run — he ___ (win) this race easily!", correct: "is going to win", explanation: "Visible evidence of what is about to happen → is going to win." },
        { id: "e4q5", prompt: "I promise I ___ (finish) the report by Friday.", correct: "will finish", explanation: "Promise → will finish." },
        { id: "e4q6", prompt: "They have bought plane tickets and booked a hotel — they ___ (move) abroad.", correct: "are going to move", explanation: "A plan already made → are going to move." },
        { id: "e4q7", prompt: "'What do you want to eat?' — 'I think I ___ (have) the fish.'", correct: "will have", explanation: "Decision made at the moment of choosing → will have." },
        { id: "e4q8", prompt: "She ___ (be) a great teacher — she's so patient and kind.", correct: "will be", explanation: "General prediction / opinion about the future → will be." },
        { id: "e4q9", prompt: "Watch out! You ___ (hit) that car — brake now!", correct: "are going to hit", explanation: "Visible immediate danger → are going to hit." },
        { id: "e4q10", prompt: "He ___ (not/come) to the meeting — he just sent a message.", correct: "isn't going to come", explanation: "Already decided and communicated → isn't going to come (= is not going to come)." },
      ],
    },
  }), []);

  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const current = sets[exNo];

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    const total = current.questions.length;
    if (current.type === "mcq") {
      for (const q of current.questions) {
        if (mcqAnswers[q.id] === q.correctIndex) correct++;
      }
    } else {
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }, [checked, current, mcqAnswers, inputAnswers]);

  function resetExercise() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  function switchExercise(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Will (future)</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Will{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">future</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">
          A2
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>will</b> for <b>predictions, spontaneous decisions, promises and offers</b>. Form: <b>will + base verb</b> for all subjects. Negative: <b>won't</b> (= will not).
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
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
            ) : (
              <Explanation />
            )}
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
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">
          ← All A2 topics
        </a>
        <a href="/grammar/a2/comparative-adjectives" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
          Next: Comparative adjectives →
        </a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">WILL — FUTURE</h2>
        <p className="text-slate-500 text-sm">Predictions, spontaneous decisions, promises and offers</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-3">Affirmative (+)</div>
          <Formula parts={[{ text: "Subject", color: "sky" }, { text: "+", dim: true }, { text: "will", color: "yellow" }, { text: "+", dim: true }, { text: "base verb", color: "green" }]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>She will call you.</div>
            <div>I&apos;ll be there at 8.</div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-red-600 mb-3">Negative (−)</div>
          <Formula parts={[{ text: "Subject", color: "sky" }, { text: "+", dim: true }, { text: "won't", color: "red" }, { text: "+", dim: true }, { text: "base verb", color: "green" }]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>He won&apos;t come.</div>
            <div>They won&apos;t be late.</div>
          </div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-3">Question (?)</div>
          <Formula parts={[{ text: "Will", color: "yellow" }, { text: "+", dim: true }, { text: "subject", color: "sky" }, { text: "+", dim: true }, { text: "base verb", color: "green" }, { text: "?", dim: true }]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>Will she be there?</div>
            <div>Will you help me?</div>
          </div>
        </div>
      </div>

      {/* When to use will */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs font-bold uppercase text-slate-500 mb-2">Prediction / opinion</div>
          <div className="text-sm text-slate-700 italic">I think it will rain tomorrow.</div>
          <div className="text-sm text-slate-700 italic">She will probably pass the exam.</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs font-bold uppercase text-slate-500 mb-2">Spontaneous decision (decided NOW)</div>
          <div className="text-sm text-slate-700 italic">&ldquo;There&apos;s no coffee left.&rdquo; — &ldquo;I&apos;ll buy some.&rdquo;</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs font-bold uppercase text-slate-500 mb-2">Promise</div>
          <div className="text-sm text-slate-700 italic">I promise I will call you every day.</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs font-bold uppercase text-slate-500 mb-2">Offer or request</div>
          <div className="text-sm text-slate-700 italic">I&apos;ll carry that for you. / Will you help me?</div>
        </div>
      </div>

      {/* Will vs Going to table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black">!</span>
          <span className="font-black text-slate-900 text-sm">Will vs Going to — Quick Guide</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-slate-50">
                <th className="px-4 py-3 text-left font-bold text-slate-700">Situation</th>
                <th className="px-4 py-3 text-left font-bold text-sky-700">Use will</th>
                <th className="px-4 py-3 text-left font-bold text-violet-700">Use going to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr className="bg-white">
                <td className="px-4 py-3 text-slate-700">Decision timing</td>
                <td className="px-4 py-3 text-slate-900">Decided right now</td>
                <td className="px-4 py-3 text-slate-900">Already decided before</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="px-4 py-3 text-slate-700">Predictions</td>
                <td className="px-4 py-3 text-slate-900">Opinion, no evidence</td>
                <td className="px-4 py-3 text-slate-900">Visible evidence right now</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 text-slate-700">Example</td>
                <td className="px-4 py-3 italic text-slate-600">&ldquo;I&apos;ll have the soup.&rdquo; (decides now)</td>
                <td className="px-4 py-3 italic text-slate-600">&ldquo;I&apos;m going to have the soup.&rdquo; (planned)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Key words */}
      <div>
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Key Words (prediction signals)</div>
        <div className="flex flex-wrap gap-2">
          {["I think", "I hope", "probably", "maybe", "perhaps", "I'm sure", "I believe"].map((w) => (
            <span key={w} className="rounded-lg border border-sky-200 bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800">{w}</span>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Common Mistakes</div>
        <Ex en="She didn't will come. (wrong auxiliary)" correct={false} />
        <Ex en="She won't come." correct={true} />
        <Ex en="I will to call you later." correct={false} />
        <Ex en="I will call you later." correct={true} />
      </div>

      {/* Amber tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Contraction tip:</span> In spoken English, <b>will</b> is almost always contracted: <b>I&apos;ll, you&apos;ll, he&apos;ll, she&apos;ll, it&apos;ll, we&apos;ll, they&apos;ll</b>. The negative <b>will not</b> contracts to <b>won&apos;t</b> — never <i>willn&apos;t</i>.
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
