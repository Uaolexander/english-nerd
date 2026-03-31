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
    title: "Exercise 1 — Affirmative: choose am / is / are",
    instructions:
      "Present Continuous uses am / is / are + verb-ing. Use am with I, is with he / she / it (and singular nouns), and are with you / we / they.",
    questions: [
      { id: "1-1", prompt: "She ___ reading a book right now.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "She → is: She is reading." },
      { id: "1-2", prompt: "I ___ cooking dinner at the moment.", options: ["is", "are", "am", "be"], correctIndex: 2, explanation: "I → am: I am cooking." },
      { id: "1-3", prompt: "They ___ playing football in the park.", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "They → are: They are playing." },
      { id: "1-4", prompt: "He ___ working from home today.", options: ["are", "am", "is", "be"], correctIndex: 2, explanation: "He → is: He is working." },
      { id: "1-5", prompt: "We ___ watching a film tonight.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "We → are: We are watching." },
      { id: "1-6", prompt: "The dog ___ sleeping on the sofa.", options: ["am", "are", "is", "be"], correctIndex: 2, explanation: "The dog (= it) → is: The dog is sleeping." },
      { id: "1-7", prompt: "You ___ doing a great job!", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "You → are: You are doing." },
      { id: "1-8", prompt: "My parents ___ visiting my aunt this weekend.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "My parents (= they) → are." },
      { id: "1-9", prompt: "It ___ raining outside.", options: ["am", "are", "is", "be"], correctIndex: 2, explanation: "It → is: It is raining." },
      { id: "1-10", prompt: "The children ___ making a lot of noise.", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "The children (= they) → are." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: isn't / aren't / 'm not",
    instructions:
      "Negative Present Continuous: I'm not + verb-ing, he/she/it isn't + verb-ing, you/we/they aren't + verb-ing. Never use 'don't' or 'doesn't' with continuous forms.",
    questions: [
      { id: "2-1", prompt: "She ___ working today — she's ill.", options: ["don't", "isn't", "aren't", "not"], correctIndex: 1, explanation: "She → isn't: She isn't working." },
      { id: "2-2", prompt: "I ___ listening to you.", options: ["isn't", "don't", "'m not", "aren't"], correctIndex: 2, explanation: "I → 'm not: I'm not listening." },
      { id: "2-3", prompt: "They ___ coming to the party.", options: ["isn't", "doesn't", "aren't", "not"], correctIndex: 2, explanation: "They → aren't: They aren't coming." },
      { id: "2-4", prompt: "He ___ paying attention in class.", options: ["aren't", "isn't", "don't", "not"], correctIndex: 1, explanation: "He → isn't: He isn't paying attention." },
      { id: "2-5", prompt: "We ___ going out tonight.", options: ["isn't", "doesn't", "aren't", "not"], correctIndex: 2, explanation: "We → aren't: We aren't going." },
      { id: "2-6", prompt: "It ___ snowing at the moment.", options: ["don't", "aren't", "isn't", "not"], correctIndex: 2, explanation: "It → isn't: It isn't snowing." },
      { id: "2-7", prompt: "You ___ wearing a coat — aren't you cold?", options: ["isn't", "don't", "aren't", "not"], correctIndex: 2, explanation: "You → aren't: You aren't wearing." },
      { id: "2-8", prompt: "My phone ___ charging.", options: ["don't", "aren't", "isn't", "not"], correctIndex: 2, explanation: "My phone (= it) → isn't: My phone isn't charging." },
      { id: "2-9", prompt: "She ___ talking to me any more.", options: ["don't", "isn't", "aren't", "not"], correctIndex: 1, explanation: "She → isn't: She isn't talking." },
      { id: "2-10", prompt: "The kids ___ doing their homework.", options: ["isn't", "doesn't", "aren't", "not"], correctIndex: 2, explanation: "The kids (= they) → aren't: They aren't doing." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: Is / Am / Are + short answers",
    instructions:
      "Questions invert the subject and the auxiliary: Am I…? Is he/she/it…? Are you/we/they…? Short answers use am / is / are — never repeat the main verb.",
    questions: [
      { id: "3-1", prompt: "___ she sleeping?", options: ["Am", "Are", "Is", "Do"], correctIndex: 2, explanation: "She → Is: Is she sleeping?" },
      { id: "3-2", prompt: "___ you listening to me?", options: ["Is", "Am", "Does", "Are"], correctIndex: 3, explanation: "You → Are: Are you listening?" },
      { id: "3-3", prompt: "___ they coming to the meeting?", options: ["Is", "Am", "Are", "Do"], correctIndex: 2, explanation: "They → Are: Are they coming?" },
      { id: "3-4", prompt: '"Is it raining?" — "Yes, ___.', options: ["it rains", "it does", "it is", "it are"], correctIndex: 2, explanation: "Short answer with is: Yes, it is." },
      { id: "3-5", prompt: '"Are you working?" — "No, ___.', options: ["I'm not", "I don't", "I isn't", "I aren't"], correctIndex: 0, explanation: "Short negative answer: No, I'm not." },
      { id: "3-6", prompt: '"Is she coming?" — "Yes, ___.', options: ["she does", "she is", "she are", "she am"], correctIndex: 1, explanation: "Short answer with is: Yes, she is." },
      { id: "3-7", prompt: "___ he watching TV right now?", options: ["Are", "Am", "Is", "Does"], correctIndex: 2, explanation: "He → Is: Is he watching?" },
      { id: "3-8", prompt: '"Are they leaving?" — "No, ___.', options: ["they don't", "they isn't", "they aren't", "they not"], correctIndex: 2, explanation: "Short negative answer: No, they aren't." },
      { id: "3-9", prompt: "___ I talking too fast?", options: ["Is", "Are", "Am", "Do"], correctIndex: 2, explanation: "I → Am: Am I talking…?" },
      { id: "3-10", prompt: '"Is he working from home?" — "No, ___.', options: ["he doesn't", "he not", "he isn't", "he aren't"], correctIndex: 2, explanation: "Short negative answer: No, he isn't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all three forms",
    instructions:
      "This exercise mixes affirmative, negative, and question forms. Decide which auxiliary (am / is / are / isn't / aren't / 'm not) fits each sentence.",
    questions: [
      { id: "4-1", prompt: "Look! The cat ___ climbing the tree.", options: ["are", "am", "is", "be"], correctIndex: 2, explanation: "The cat (= it) → is: The cat is climbing." },
      { id: "4-2", prompt: "___ you enjoying the party?", options: ["Is", "Am", "Are", "Do"], correctIndex: 2, explanation: "You → Are: Are you enjoying…?" },
      { id: "4-3", prompt: "I ___ feeling very well today.", options: ["aren't", "isn't", "'m not", "not"], correctIndex: 2, explanation: "I + negative → 'm not: I'm not feeling." },
      { id: "4-4", prompt: '"Is she studying?" — "Yes, ___.', options: ["she does", "she is", "she are", "she am"], correctIndex: 1, explanation: "Short answer with is: Yes, she is." },
      { id: "4-5", prompt: "They ___ waiting for the bus.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "They → are: They are waiting." },
      { id: "4-6", prompt: "He ___ talking on the phone right now.", options: ["aren't", "am not", "isn't", "not"], correctIndex: 2, explanation: "He + negative → isn't: He isn't talking." },
      { id: "4-7", prompt: "___ it raining in the city too?", options: ["Am", "Are", "Is", "Do"], correctIndex: 2, explanation: "It → Is: Is it raining?" },
      { id: "4-8", prompt: "We ___ having a great time here.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "We → are: We are having." },
      { id: "4-9", prompt: '"Are you coming?" — "No, ___.', options: ["I don't", "I isn't", "I'm not", "I aren't"], correctIndex: 2, explanation: "Short negative: No, I'm not." },
      { id: "4-10", prompt: "She ___ wearing headphones — she can't hear you.", options: ["are", "is", "am", "be"], correctIndex: 1, explanation: "She → is: She is wearing." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative",
  3: "Questions",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function PresentContinuousQuizClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-continuous">Present Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Present Continuous</b> with 40 multiple choice questions across four sets: affirmative, negative, questions, and a mixed review. Pick the correct form and check your answers.
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
          <a href="/tenses/present-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Present Continuous exercises</a>
          <a href="/tenses/present-continuous/fill-in-blank" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Fill in the Blank →</a>
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
            { text: "am / is / are", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I am working.  ·  She is reading.  ·  They are playing." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "'m not / isn't / aren't", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I'm not working.  ·  She isn't reading.  ·  They aren't playing." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Am / Is / Are", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Am I working?  ·  Is she reading?  ·  Are they playing?" />
          </div>
        </div>
      </div>

      {/* am / is / are table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Which auxiliary to use</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
                <th className="px-4 py-2.5 font-black text-sky-700">?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "am working", "'m not working", "Am I working?"],
                ["He / She / It", "is working ★", "isn't working", "Is he working?"],
                ["You / We / They", "are working", "aren't working", "Are you working?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 1 ? "bg-amber-50 font-bold" : "bg-white"}>
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
          <span className="font-black">★ Key rule:</span> Never use <b>don&apos;t / doesn&apos;t</b> with continuous forms!<br />
          <span className="text-xs">She <b>isn&apos;t</b> working ✅ &nbsp; She doesn&apos;t working ❌</span>
        </div>
      </div>

      {/* Short answers */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short answers</div>
        <div className="space-y-2">
          {[
            { q: "Is she reading?", yes: "Yes, she is.", no: "No, she isn't." },
            { q: "Are they coming?", yes: "Yes, they are.", no: "No, they aren't." },
            { q: "Are you working?", yes: "Yes, I am.", no: "No, I'm not." },
          ].map(({ q, yes, no }) => (
            <div key={q} className="rounded-xl bg-white border border-black/10 px-4 py-3 grid sm:grid-cols-3 gap-2 text-sm">
              <div className="font-semibold text-slate-700">{q}</div>
              <div className="text-emerald-700 font-semibold">{yes}</div>
              <div className="text-red-700 font-semibold">{no}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stative verbs */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Stative verbs — no continuous form!</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {["know", "believe", "understand", "like", "love", "hate", "want", "need", "seem", "own", "belong", "have (possession)"].map((v) => (
            <span key={v} className="rounded-lg bg-white border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">{v}</span>
          ))}
        </div>
        <div className="mt-2 text-xs text-amber-700">✅ I know the answer. &nbsp;|&nbsp; ❌ I am knowing the answer.</div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">📌 Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["now", "right now", "at the moment", "currently", "today", "this week", "this year", "look!", "listen!"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
