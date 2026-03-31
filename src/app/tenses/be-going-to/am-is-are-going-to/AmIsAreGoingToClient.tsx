"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

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

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — am / is / are going to: affirmative",
    instructions:
      "Choose the correct form of 'be' (am, is, are) to complete each going to sentence. The subject determines the form: I → am; he/she/it → is; you/we/they → are.",
    questions: [
      { id: "1-1", prompt: "I ___ going to visit my grandparents this weekend.", options: ["am", "is", "are", "be"], correctIndex: 0, explanation: "I + am going to. Always: I am going to." },
      { id: "1-2", prompt: "She ___ going to start a new job next month.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "She (3rd person singular) + is going to." },
      { id: "1-3", prompt: "They ___ going to move to a bigger apartment.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "They (plural) + are going to." },
      { id: "1-4", prompt: "He ___ going to take an online course in Python.", options: ["am", "are", "is", "be"], correctIndex: 2, explanation: "He (3rd person singular) + is going to." },
      { id: "1-5", prompt: "We ___ going to celebrate our anniversary in Paris.", options: ["are", "is", "am", "be"], correctIndex: 0, explanation: "We (plural) + are going to." },
      { id: "1-6", prompt: "I ___ going to learn how to drive this year.", options: ["is", "am", "are", "be"], correctIndex: 1, explanation: "I + am going to." },
      { id: "1-7", prompt: "The government ___ going to introduce new regulations.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "The government (3rd person singular) + is going to." },
      { id: "1-8", prompt: "You ___ going to love this film — it's amazing.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "You + are going to." },
      { id: "1-9", prompt: "It ___ going to be a long day — we have three meetings.", options: ["am", "are", "is", "be"], correctIndex: 2, explanation: "It (3rd person singular) + is going to." },
      { id: "1-10", prompt: "My parents ___ going to fly to Australia to see my sister.", options: ["are", "is", "am", "be"], correctIndex: 0, explanation: "My parents (plural) + are going to." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: isn't / aren't / am not going to",
    instructions:
      "Choose the correct negative form. Remember: I'm not (never 'I amn't'); he/she/it isn't; you/we/they aren't. Answers are mixed.",
    questions: [
      { id: "2-1", prompt: "She ___ going to accept the offer — she wants more money.", options: ["isn't", "aren't", "am not", "not going"], correctIndex: 0, explanation: "She (singular) → isn't going to." },
      { id: "2-2", prompt: "They ___ going to come to the party — they have other plans.", options: ["isn't", "aren't", "am not", "not going"], correctIndex: 1, explanation: "They (plural) → aren't going to." },
      { id: "2-3", prompt: "I ___ going to give up — I'll keep trying.", options: ["isn't", "am not", "aren't", "not going"], correctIndex: 1, explanation: "I → am not going to (contracted: I'm not going to)." },
      { id: "2-4", prompt: "He ___ going to renew his subscription.", options: ["aren't", "am not", "not going", "isn't"], correctIndex: 3, explanation: "He (singular) → isn't going to." },
      { id: "2-5", prompt: "We ___ going to use the old system anymore.", options: ["aren't", "isn't", "am not", "not going"], correctIndex: 0, explanation: "We (plural) → aren't going to." },
      { id: "2-6", prompt: "It ___ going to be easy — there are many challenges.", options: ["aren't", "isn't", "am not", "not going"], correctIndex: 1, explanation: "It (singular) → isn't going to." },
      { id: "2-7", prompt: "I ___ going to mention this to anyone.", options: ["isn't", "aren't", "am not", "not going"], correctIndex: 2, explanation: "I → am not going to." },
      { id: "2-8", prompt: "The kids ___ going to enjoy the museum — they hate history.", options: ["isn't", "am not", "not going", "aren't"], correctIndex: 3, explanation: "The kids (plural) → aren't going to." },
      { id: "2-9", prompt: "My boss ___ going to approve this budget request.", options: ["aren't", "isn't", "am not", "not going"], correctIndex: 1, explanation: "My boss (singular) → isn't going to." },
      { id: "2-10", prompt: "You ___ going to believe what just happened!", options: ["isn't", "am not", "aren't", "not going"], correctIndex: 2, explanation: "You (plural/singular) → aren't going to." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions & short answers",
    instructions:
      "Choose the correct question form or short answer. Questions: Am/Is/Are + subject + going to…? Short answers must use the correct form of 'be'.",
    questions: [
      { id: "3-1", prompt: "___ she going to attend the conference?", options: ["Is", "Am", "Are", "Does"], correctIndex: 0, explanation: "She (singular) → Is she going to…?" },
      { id: "3-2", prompt: "\"Are they going to move?\" — \"Yes, ___.\"", options: ["they are", "they will", "they do", "they going"], correctIndex: 0, explanation: "Short affirmative: Yes, they are." },
      { id: "3-3", prompt: "___ you going to take the exam again?", options: ["Is", "Am", "Are", "Do"], correctIndex: 2, explanation: "You → Are you going to…?" },
      { id: "3-4", prompt: "\"Is he going to resign?\" — \"No, ___.\"", options: ["he won't", "he isn't", "he doesn't", "he not"], correctIndex: 1, explanation: "Short negative: No, he isn't." },
      { id: "3-5", prompt: "___ I going to need a visa for this trip?", options: ["Is", "Are", "Do", "Am"], correctIndex: 3, explanation: "I → Am I going to…?" },
      { id: "3-6", prompt: "\"Are you going to accept the offer?\" — \"Yes, ___.\"", options: ["I am", "I will", "I do", "I going"], correctIndex: 0, explanation: "Short affirmative: Yes, I am." },
      { id: "3-7", prompt: "___ the team going to present on Friday?", options: ["Am", "Is", "Are", "Do"], correctIndex: 1, explanation: "The team (singular) → Is the team going to…?" },
      { id: "3-8", prompt: "\"Is she going to cook tonight?\" — \"No, ___.\"", options: ["she won't", "she doesn't", "she not", "she isn't"], correctIndex: 3, explanation: "Short negative: No, she isn't." },
      { id: "3-9", prompt: "___ we going to have enough time to finish?", options: ["Is", "Am", "Are", "Do"], correctIndex: 2, explanation: "We → Are we going to…?" },
      { id: "3-10", prompt: "\"Are they going to announce the results today?\" — \"Yes, ___.\"", options: ["they will", "they are", "they do", "they going"], correctIndex: 1, explanation: "Short affirmative: Yes, they are." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — All forms mixed + going to vs will",
    instructions:
      "Mix of all forms: am/is/are going to (affirmative, negative, question) and contrast with will. Choose the most natural answer. Correct answers vary throughout.",
    questions: [
      { id: "4-1", prompt: "\"The phone is ringing.\" \"___ answer it.\" (spontaneous decision)", options: ["I'll", "I'm going to", "I am going to", "Shall I"], correctIndex: 0, explanation: "Spontaneous decision made NOW → I'll (will). Not going to." },
      { id: "4-2", prompt: "She ___ start a yoga class next month — she enrolled yesterday.", options: ["will start", "is going to start", "starts", "start"], correctIndex: 1, explanation: "Enrolled already = pre-made plan → is going to start." },
      { id: "4-3", prompt: "___ they going to hire more staff this year?", options: ["Is", "Am", "Are", "Do"], correctIndex: 2, explanation: "They → Are they going to…?" },
      { id: "4-4", prompt: "I ___ going to miss the deadline — I haven't started yet.", options: ["aren't", "isn't", "will", "am"], correctIndex: 3, explanation: "I + am going to (affirmative — predicting based on the situation)." },
      { id: "4-5", prompt: "\"Are you going to call him?\" — \"No, ___.\"", options: ["I'm not", "I am", "I will", "I won't"], correctIndex: 0, explanation: "Short negative answer to 'Are you going to…': No, I'm not." },
      { id: "4-6", prompt: "They ___ going to launch the app — the investors pulled out.", options: ["are", "aren't", "am", "isn't"], correctIndex: 1, explanation: "They (plural) negative → aren't going to launch." },
      { id: "4-7", prompt: "Look at those dark clouds — it ___ storm tonight.", options: ["will", "is going to", "storms", "stormed"], correctIndex: 1, explanation: "Visible evidence (dark clouds) → is going to storm." },
      { id: "4-8", prompt: "He ___ going to retire at 65 — it's his plan.", options: ["are", "am", "will", "is"], correctIndex: 3, explanation: "He + is going to (affirmative, pre-made plan)." },
      { id: "4-9", prompt: "\"___ she going to accept the promotion?\" \"I'm not sure.\"", options: ["Am", "Is", "Are", "Do"], correctIndex: 1, explanation: "She (singular) → Is she going to…?" },
      { id: "4-10", prompt: "I ___ going to take the bus today — I'm running late.", options: ["are", "isn't", "am", "will"], correctIndex: 2, explanation: "I + am going to (I've decided to take the bus)." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative",
  3: "Questions",
  4: "Mixed",
};

export default function AmIsAreGoingToClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/be-going-to">Be Going To</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">am / is / are going to</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Be Going To{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">am / is / are going to</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Easy</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions to master the correct form of <b>be going to</b>: <b>am going to</b> (I), <b>is going to</b> (he/she/it), <b>are going to</b> (you/we/they), negatives and questions.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>

          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))} className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600"><b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
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
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
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

        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/be-going-to" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Be Going To exercises</a>
        </div>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
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
      {/* 3 gradient formula cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "am/is/are", color: "violet" },
            { text: "going to", color: "sky" },
            { text: "verb", color: "green" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I am going to study. (= I'm going to study.)" />
            <Ex en="She is going to travel. (= She's going to travel.)" />
            <Ex en="They are going to move. (= They're going to move.)" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "am not / isn't / aren't", color: "red" },
            { text: "going to", color: "sky" },
            { text: "verb", color: "green" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I'm not going to eat that." />
            <Ex en="He isn't going to come. / She isn't going to apply." />
            <Ex en="We aren't going to wait. / They aren't going to change." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Am/Is/Are", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "going to", color: "sky" },
            { text: "verb?", color: "green" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Am I going to need a jacket?" />
            <Ex en="Is she going to join us?" />
            <Ex en="Are they going to accept the offer?" />
          </div>
        </div>
      </div>

      {/* Full conjugation table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Full conjugation table</div>
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
                ["I", "I'm going to go", "I'm not going to go", "Am I going to go?"],
                ["You", "You're going to go", "You aren't going to go", "Are you going to go?"],
                ["He / She / It", "She's going to go ★", "She isn't going to go", "Is she going to go?"],
                ["We", "We're going to go", "We aren't going to go", "Are we going to go?"],
                ["They", "They're going to go", "They aren't going to go", "Are they going to go?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50 font-bold" : i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-xs">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key:</span> he/she/it always use <b>is</b> — never &quot;are&quot; or &quot;am&quot;.<br />
          <span className="text-xs">She <b>is</b> going to go ✅ &nbsp;|&nbsp; She <b>are</b> going to go ❌ &nbsp;|&nbsp; I <b>am not</b> going to go ✅ (never &quot;I amn&apos;t&quot;)</span>
        </div>
      </div>

      {/* Short answers */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short answers</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Question</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Yes</th>
                <th className="px-4 py-2.5 font-black text-red-700">No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Are you going to…?", "Yes, I am.", "No, I'm not."],
                ["Is he/she going to…?", "Yes, he is.", "No, she isn't."],
                ["Are they going to…?", "Yes, they are.", "No, they aren't."],
                ["Am I going to…?", "Yes, you are.", "No, you aren't."],
              ].map(([q, yes, no], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{q}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{yes}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-xs">{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contractions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common contractions</div>
        <div className="flex flex-wrap gap-2">
          {["I am → I'm", "he is → he's", "she is → she's", "it is → it's", "we are → we're", "they are → they're", "you are → you're", "is not → isn't", "are not → aren't"].map((c) => (
            <span key={c} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
