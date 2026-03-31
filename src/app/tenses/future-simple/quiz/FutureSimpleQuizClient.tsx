"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: MCQ[];
};

/* ─── Question data ─────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — will / won't: affirmative & negative",
    instructions:
      "Future Simple uses will for all subjects (I, you, he, she, it, we, they). Use won't (= will not) for negatives. Choose the correct form to complete each sentence.",
    questions: [
      { id: "1-1", prompt: "I ___ call you later, I promise.", options: ["won't", "will", "am going to", "would"], correctIndex: 1, explanation: "Affirmative promise: I will call you later." },
      { id: "1-2", prompt: "She ___ be at the party — she has other plans.", options: ["will", "won't", "isn't", "doesn't"], correctIndex: 1, explanation: "Negative prediction: She won't be at the party." },
      { id: "1-3", prompt: "They ___ finish the project by Friday.", options: ["won't", "will", "are", "do"], correctIndex: 1, explanation: "Affirmative: They will finish the project." },
      { id: "1-4", prompt: "I ___ forget your birthday this year.", options: ["will", "won't", "am not", "don't"], correctIndex: 1, explanation: "Negative promise: I won't forget your birthday." },
      { id: "1-5", prompt: "He ___ probably be late — he always is.", options: ["won't", "will", "is", "does"], correctIndex: 1, explanation: "Prediction: He will probably be late." },
      { id: "1-6", prompt: "It ___ snow in the desert tomorrow.", options: ["will", "won't", "isn't", "doesn't"], correctIndex: 1, explanation: "Negative prediction: It won't snow in the desert." },
      { id: "1-7", prompt: "We ___ help you move house on Saturday.", options: ["won't", "will", "are", "do"], correctIndex: 1, explanation: "Affirmative offer: We will help you." },
      { id: "1-8", prompt: "The kids ___ be happy about the news.", options: ["won't", "will", "are", "do"], correctIndex: 1, explanation: "Affirmative prediction: The kids will be happy." },
      { id: "1-9", prompt: "I ___ tell anyone — I promise.", options: ["will", "won't", "am not", "don't"], correctIndex: 1, explanation: "Negative promise: I won't tell anyone." },
      { id: "1-10", prompt: "Technology ___ change a lot in the next 20 years.", options: ["won't", "will", "is", "does"], correctIndex: 1, explanation: "Prediction about the future: Technology will change a lot." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Will questions & short answers",
    instructions:
      "Questions in Future Simple: Will + subject + base form? Short answers: Yes, I/he/she/etc. will. / No, I/he/she/etc. won't. Choose the correct option.",
    questions: [
      { id: "2-1", prompt: "___ you help me with this?", options: ["Do", "Are", "Will", "Would you"], correctIndex: 2, explanation: "Future Simple question: Will you help me?" },
      { id: "2-2", prompt: "___ she come to the meeting tomorrow?", options: ["Is", "Does", "Will", "Has"], correctIndex: 2, explanation: "Future Simple question: Will she come?" },
      { id: "2-3", prompt: "\"Will you be there?\" — \"Yes, ___.\"", options: ["I do", "I am", "I will", "I can"], correctIndex: 2, explanation: "Short affirmative answer: Yes, I will." },
      { id: "2-4", prompt: "\"Will he call us back?\" — \"No, ___.\"", options: ["he won't", "he doesn't", "he isn't", "he can't"], correctIndex: 0, explanation: "Short negative answer: No, he won't." },
      { id: "2-5", prompt: "___ they arrive on time?", options: ["Are", "Do", "Will", "Have"], correctIndex: 2, explanation: "Future Simple question: Will they arrive on time?" },
      { id: "2-6", prompt: "\"Will it rain tonight?\" — \"Yes, ___.\"", options: ["it does", "it is", "it will", "it can"], correctIndex: 2, explanation: "Short affirmative answer: Yes, it will." },
      { id: "2-7", prompt: "___ we need to bring anything?", options: ["Are", "Do", "Will", "Should"], correctIndex: 2, explanation: "Future Simple question: Will we need to bring anything?" },
      { id: "2-8", prompt: "\"Will you be home late?\" — \"No, ___.\"", options: ["I don't", "I won't", "I'm not", "I haven't"], correctIndex: 1, explanation: "Short negative answer: No, I won't." },
      { id: "2-9", prompt: "___ the train be on time?", options: ["Is", "Does", "Will", "Has"], correctIndex: 2, explanation: "Future Simple question: Will the train be on time?" },
      { id: "2-10", prompt: "\"Will she pass the exam?\" — \"Yes, ___.\"", options: ["she does", "she is", "she will", "she can"], correctIndex: 2, explanation: "Short affirmative answer: Yes, she will." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Correct form after will",
    instructions:
      "After will / won't, always use the base form of the verb (the infinitive without 'to'). Never add -s, -ing, or -ed after will. Choose the correct form.",
    questions: [
      { id: "3-1", prompt: "She will ___ us at the station.", options: ["meets", "meeting", "met", "meet"], correctIndex: 3, explanation: "After will: base form. She will meet us." },
      { id: "3-2", prompt: "They won't ___ the deadline.", options: ["misses", "missing", "missed", "miss"], correctIndex: 3, explanation: "After won't: base form. They won't miss the deadline." },
      { id: "3-3", prompt: "Will he ___ the truth?", options: ["tells", "telling", "told", "tell"], correctIndex: 3, explanation: "After will in questions: base form. Will he tell the truth?" },
      { id: "3-4", prompt: "I will ___ you as soon as I arrive.", options: ["texts", "texting", "texted", "text"], correctIndex: 3, explanation: "After will: base form. I will text you." },
      { id: "3-5", prompt: "The doctor will ___ you now.", options: ["sees", "seeing", "seen", "see"], correctIndex: 3, explanation: "After will: base form. The doctor will see you now." },
      { id: "3-6", prompt: "We won't ___ the match.", options: ["loses", "losing", "lost", "lose"], correctIndex: 3, explanation: "After won't: base form. We won't lose the match." },
      { id: "3-7", prompt: "Will you ___ me a favour?", options: ["does", "doing", "did", "do"], correctIndex: 3, explanation: "After will in questions: base form. Will you do me a favour?" },
      { id: "3-8", prompt: "She will ___ her best.", options: ["tries", "trying", "tried", "try"], correctIndex: 3, explanation: "After will: base form. She will try her best." },
      { id: "3-9", prompt: "It won't ___ long.", options: ["takes", "taking", "took", "take"], correctIndex: 3, explanation: "After won't: base form. It won't take long." },
      { id: "3-10", prompt: "They will ___ us a new offer.", options: ["sends", "sending", "sent", "send"], correctIndex: 3, explanation: "After will: base form. They will send us a new offer." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: will vs be going to & context",
    instructions:
      "Use will for spontaneous decisions and predictions without evidence. Use be going to for plans already made or predictions based on visible evidence. Choose the best answer for each context.",
    questions: [
      { id: "4-1", prompt: "The phone is ringing. \"Don't worry — I ___ get it.\"", options: ["am going to get", "will get", "get", "got"], correctIndex: 1, explanation: "Spontaneous decision (made right now): I'll get it. Use will, not be going to." },
      { id: "4-2", prompt: "Look at those clouds! It ___ rain.", options: ["will", "is going to", "rains", "would"], correctIndex: 1, explanation: "Prediction based on visible evidence (clouds): it's going to rain. Use be going to." },
      { id: "4-3", prompt: "I think she ___ win the competition. She's very talented.", options: ["is going to win", "will win", "wins", "won"], correctIndex: 1, explanation: "Prediction based on opinion (I think): she will win. Use will." },
      { id: "4-4", prompt: "\"I've already booked a flight. I ___ visit Paris next month.\"", options: ["will visit", "am going to visit", "visit", "would visit"], correctIndex: 1, explanation: "Plan already made: I'm going to visit Paris. Use be going to." },
      { id: "4-5", prompt: "\"There's no milk.\" \"I ___ get some from the shop.\"", options: ["am going to get", "will get", "get", "got"], correctIndex: 1, explanation: "Spontaneous decision (decided just now): I'll get some. Use will." },
      { id: "4-6", prompt: "I ___ turn 30 next year. It's a fact.", options: ["am going to turn", "will turn", "turn", "would turn"], correctIndex: 1, explanation: "Fact about the future: I will turn 30. Use will." },
      { id: "4-7", prompt: "He looks really tired. He ___ fall asleep.", options: ["will fall", "is going to fall", "falls", "fell"], correctIndex: 1, explanation: "Prediction with visible evidence (he looks tired): he's going to fall asleep. Use be going to." },
      { id: "4-8", prompt: "She has decided — she ___ study medicine at university.", options: ["will study", "is going to study", "studies", "studied"], correctIndex: 1, explanation: "Pre-made decision / intention: she's going to study medicine. Use be going to." },
      { id: "4-9", prompt: "I promise I ___ be there by 8 o'clock.", options: ["am going to be", "will be", "am being", "was"], correctIndex: 1, explanation: "Promise: I will be there. Use will." },
      { id: "4-10", prompt: "It's very cold outside. I ___ wear a coat.", options: ["will wear", "am going to wear", "wear", "wore"], correctIndex: 1, explanation: "Spontaneous decision (reacting to situation): I'll wear a coat. Use will." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "will/won't",
  2: "Questions",
  3: "Forms",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function FutureSimpleQuizClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

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
    for (const q of current.questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, answers]);

  function reset() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setAnswers({});
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setAnswers({});
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/future-simple">Future Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Future Simple (will)</b> with 40 multiple choice questions across four sets: will/won't, questions &amp; short answers, correct forms after will, and a mixed review with will vs be going to.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const chosen = answers[q.id] ?? null;
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
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi}
                                      onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))}
                                      className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
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
                        <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                          Check Answers
                        </button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">
                          Next Exercise →
                        </button>
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
                          {score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}
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

          {/* Right ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>
        </div>

        {/* Mobile ad */}
        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-simple" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Simple exercises</a>
          <a href="/tenses/future-simple/fill-in-blank" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Fill in the Blank →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}>{p.text}</span>
      ))}
    </div>
  );
}

function Ex({ en }: { en: string }) {
  return (
    <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
      <div className="font-semibold text-slate-900 text-sm">{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">

      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will", color: "yellow" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will work.  ·  She will go.  ·  They will be ready." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't", color: "red" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't come.  ·  He won't be there.  ·  They won't forget." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb (base form)", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you help me?  ·  Will she come?  ·  Will they be ready?" />
          </div>
        </div>
      </div>

      {/* will is same for all subjects table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will is the same for ALL subjects — no changes!</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Affirmative</th>
                <th className="px-4 py-2.5 font-black text-red-700">Negative</th>
                <th className="px-4 py-2.5 font-black text-sky-700">Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "I will work", "I won't work", "Will I work?"],
                ["You", "You will work", "You won't work", "Will you work?"],
                ["He / She / It", "She will work ★", "She won't work", "Will she work?"],
                ["We / They", "They will work", "They won't work", "Will they work?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> will never changes — no &quot;wills&quot; or &quot;willing&quot;!<br />
          <span className="text-xs">She <b>will work</b> ✅ &nbsp; She <b>wills</b> work ❌ &nbsp; She <b>will working</b> ❌</span>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">After will: ALWAYS use the base form only!</div>
        <div className="space-y-1 text-sm text-amber-900">
          <div>She will <b>go</b> ✅ &nbsp;|&nbsp; She will <b>goes</b> ❌ &nbsp;|&nbsp; She will <b>going</b> ❌ &nbsp;|&nbsp; She will <b>went</b> ❌</div>
          <div>He will <b>be</b> ready ✅ &nbsp;|&nbsp; He will <b>is</b> ready ❌</div>
        </div>
      </div>

      {/* When to use will */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use will</div>
        <div className="space-y-2">
          {[
            { label: "Spontaneous decisions", ex: "\"The phone is ringing.\" → \"I'll get it!\"" },
            { label: "Predictions based on opinion", ex: "\"I think it will rain tomorrow.\" / \"She'll probably be late.\"" },
            { label: "Promises", ex: "\"I'll call you later.\" / \"I won't forget.\"" },
            { label: "Offers and requests", ex: "\"I'll carry that for you.\" / \"Will you help me?\"" },
            { label: "Facts about the future", ex: "\"The sun will rise at 6 AM.\" / \"You will turn 30 one day.\"" },
          ].map(({ label, ex }) => (
            <div key={label} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{label}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* will vs be going to */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will vs be going to</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-b from-yellow-50 to-white border border-yellow-200 p-4 space-y-2">
            <div className="text-sm font-black text-yellow-800">will</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• Spontaneous decisions (decided right now)</div>
              <div>• Predictions based on opinion / &quot;I think&quot;</div>
              <div>• Promises &amp; offers</div>
            </div>
            <Ex en="&quot;It's hot.&quot; → &quot;I'll open the window.&quot;" />
            <Ex en="&quot;I think she'll pass the exam.&quot;" />
          </div>
          <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-200 p-4 space-y-2">
            <div className="text-sm font-black text-sky-800">be going to</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• Plans &amp; intentions already decided</div>
              <div>• Predictions with visible evidence</div>
            </div>
            <Ex en="&quot;I'm going to visit Paris next month.&quot; (booked!)" />
            <Ex en="&quot;Look at those clouds — it's going to rain.&quot;" />
          </div>
        </div>
      </div>

      {/* Contractions grid */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Contractions</div>
        <div className="flex flex-wrap gap-2">
          {[
            "I → I'll",
            "you → you'll",
            "he → he'll",
            "she → she'll",
            "it → it'll",
            "we → we'll",
            "they → they'll",
            "will not → won't",
          ].map((c) => (
            <span key={c} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{c}</span>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["tomorrow", "next week", "next month", "next year", "soon", "in the future", "one day", "later", "tonight", "in 5 years", "someday", "eventually"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
