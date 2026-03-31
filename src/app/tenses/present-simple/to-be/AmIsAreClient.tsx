"use client";

import { useMemo, useState } from "react";

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
      "Use am with I, is with he / she / it (and singular nouns), and are with you / we / they (and plural nouns). Pick the correct form of the verb to be.",
    questions: [
      { id: "1-1", prompt: "She ___ a doctor.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "She → is: She is a doctor." },
      { id: "1-2", prompt: "I ___ from London.", options: ["is", "are", "be", "am"], correctIndex: 3, explanation: "I → am: I am from London." },
      { id: "1-3", prompt: "They ___ very happy today.", options: ["am", "is", "be", "are"], correctIndex: 3, explanation: "They → are: They are very happy today." },
      { id: "1-4", prompt: "The weather ___ beautiful today.", options: ["am", "are", "be", "is"], correctIndex: 3, explanation: "The weather (= it) → is: The weather is beautiful today." },
      { id: "1-5", prompt: "We ___ students at this university.", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "We → are: We are students at this university." },
      { id: "1-6", prompt: "He ___ my best friend.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "He → is: He is my best friend." },
      { id: "1-7", prompt: "You ___ very talented!", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "You → are: You are very talented!" },
      { id: "1-8", prompt: "It ___ a lovely day outside.", options: ["am", "are", "be", "is"], correctIndex: 3, explanation: "It → is: It is a lovely day outside." },
      { id: "1-9", prompt: "My parents ___ at home.", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "My parents (= they) → are: My parents are at home." },
      { id: "1-10", prompt: "I ___ not sure about this.", options: ["is", "are", "be", "am"], correctIndex: 3, explanation: "I → am: I am not sure about this." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: choose isn't / aren't / 'm not",
    instructions:
      "To make a negative with to be, add not after the verb: am not (contraction: 'm not), is not → isn't, are not → aren't. Pick the correct negative form.",
    questions: [
      { id: "2-1", prompt: "She ___ at home right now.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 0, explanation: "She → isn't: She isn't at home right now." },
      { id: "2-2", prompt: "I ___ ready yet.", options: ["isn't", "aren't", "don't", "'m not"], correctIndex: 3, explanation: "I → 'm not: I'm not ready yet." },
      { id: "2-3", prompt: "They ___ from the UK.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 1, explanation: "They → aren't: They aren't from the UK." },
      { id: "2-4", prompt: "He ___ very tall.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 0, explanation: "He → isn't: He isn't very tall." },
      { id: "2-5", prompt: "We ___ in the right place.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 1, explanation: "We → aren't: We aren't in the right place." },
      { id: "2-6", prompt: "It ___ cold outside today.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 0, explanation: "It → isn't: It isn't cold outside today." },
      { id: "2-7", prompt: "You ___ wrong about this.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 1, explanation: "You → aren't: You aren't wrong about this." },
      { id: "2-8", prompt: "My sister ___ a doctor.", options: ["aren't", "isn't", "'m not", "don't"], correctIndex: 1, explanation: "My sister (= she) → isn't: My sister isn't a doctor." },
      { id: "2-9", prompt: "I ___ angry at all.", options: ["isn't", "aren't", "don't", "'m not"], correctIndex: 3, explanation: "I → 'm not: I'm not angry at all." },
      { id: "2-10", prompt: "The shops ___ open on Sunday.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 1, explanation: "The shops (= they) → aren't: The shops aren't open on Sunday." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: choose Is / Are / Am",
    instructions:
      "To form a question with to be, move the verb before the subject: Is she...? Are they...? Am I...? Short answers repeat the verb: Yes, she is. / No, they aren't.",
    questions: [
      { id: "3-1", prompt: "___ she a teacher?", options: ["Am", "Are", "Is", "Be"], correctIndex: 2, explanation: "She → Is: Is she a teacher?" },
      { id: "3-2", prompt: "___ they from France?", options: ["Am", "Is", "Be", "Are"], correctIndex: 3, explanation: "They → Are: Are they from France?" },
      { id: "3-3", prompt: "___ I in the right room?", options: ["Is", "Are", "Be", "Am"], correctIndex: 3, explanation: "I → Am: Am I in the right room?" },
      { id: "3-4", prompt: "___ he your brother?", options: ["Am", "Are", "Is", "Be"], correctIndex: 2, explanation: "He → Is: Is he your brother?" },
      { id: "3-5", prompt: "___ you ready to start?", options: ["Is", "Am", "Be", "Are"], correctIndex: 3, explanation: "You → Are: Are you ready to start?" },
      { id: "3-6", prompt: "___ it far from here?", options: ["Am", "Are", "Be", "Is"], correctIndex: 3, explanation: "It → Is: Is it far from here?" },
      { id: "3-7", prompt: "___ we late?", options: ["Is", "Am", "Are", "Be"], correctIndex: 2, explanation: "We → Are: Are we late?" },
      { id: "3-8", prompt: "___ your parents at home?", options: ["Am", "Is", "Be", "Are"], correctIndex: 3, explanation: "Your parents (= they) → Are: Are your parents at home?" },
      { id: "3-9", prompt: '"Is she happy?" — "Yes, ___."', options: ["she aren't", "I am", "she isn't", "she is"], correctIndex: 3, explanation: "Short positive answer: Yes, she is." },
      { id: "3-10", prompt: '"Are they here?" — "No, ___."', options: ["they are", "they isn't", "they aren't", "they don't"], correctIndex: 2, explanation: "Short negative answer: No, they aren't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all forms + contractions",
    instructions:
      "This exercise mixes affirmative, negative, and question forms of to be, including contractions. For each item, decide: What is the subject? Which form fits — am / is / are, negative, question, or contraction?",
    questions: [
      { id: "4-1", prompt: "He ___ my best friend. (use contraction)", options: ["'s", "is", "'re", "'m"], correctIndex: 0, explanation: "He is → contraction: 's. He's my best friend." },
      { id: "4-2", prompt: "I ___ a student.", options: ["am", "is", "are", "be"], correctIndex: 0, explanation: "I → am: I am a student." },
      { id: "4-3", prompt: "___ you tired after work?", options: ["Am", "Is", "Be", "Are"], correctIndex: 3, explanation: "You → Are: Are you tired after work?" },
      { id: "4-4", prompt: "We ___ from Spain. (use contraction)", options: ["'re", "'s", "'m", "be"], correctIndex: 0, explanation: "We are → contraction: 're. We're from Spain." },
      { id: "4-5", prompt: "My dog and cat ___ both very friendly.", options: ["am", "is", "be", "are"], correctIndex: 3, explanation: "My dog and cat (= they) → are: They are both very friendly." },
      { id: "4-6", prompt: '"Are you from Italy?" — "No, I ___ not."', options: ["am", "is", "are", "be"], correctIndex: 0, explanation: "I → am: No, I am not. (= I'm not.)" },
      { id: "4-7", prompt: "She ___ at the office today. (use negative contraction)", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 0, explanation: "She is not → contraction: isn't. She isn't at the office today." },
      { id: "4-8", prompt: "It ___ a great idea!", options: ["am", "are", "is", "be"], correctIndex: 2, explanation: "It → is: It is a great idea!" },
      { id: "4-9", prompt: "___ I the only one here?", options: ["Is", "Are", "Be", "Am"], correctIndex: 3, explanation: "I → Am: Am I the only one here?" },
      { id: "4-10", prompt: "They ___ ready yet. (use negative contraction)", options: ["aren't", "isn't", "am not", "don't"], correctIndex: 0, explanation: "They are not → contraction: aren't. They aren't ready yet." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative",
  3: "Questions",
  4: "Mixed",
};

/* ─── Helper components ─────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
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

function Ex({ en }: { en: string }) {
  return (
    <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
      <div className="font-semibold text-slate-900 text-sm">{en}</div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function AmIsAreClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

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
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function checkAnswers() {
    setChecked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-simple">Present Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">am / is / are</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">am / is / are</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Beginner</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">A1</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice the verb <b>to be</b> in Present Simple with 40 multiple choice questions across four sets: affirmative, negative, questions, and a mixed review. Pick the correct form and check your answers.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
                300 × 600
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button
                onClick={() => setTab("exercises")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Exercises
              </button>
              <button
                onClick={() => setTab("explanation")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Explanation
              </button>
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => switchSet(n)}
                    title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}
                  >
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

                    {/* Mobile set switcher */}
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button
                          key={n}
                          onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const chosen = answers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${
                                      chosen === oi
                                        ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                        : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() =>
                                        setAnswers((p) => ({ ...p, [q.id]: oi }))
                                      }
                                      className="accent-[#F5DA20]"
                                    />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && (
                                    <div className="text-emerald-700 font-semibold">✅ Correct</div>
                                  )}
                                  {isWrong && (
                                    <div className="text-red-700 font-semibold">❌ Wrong</div>
                                  )}
                                  {noAnswer && (
                                    <div className="text-amber-700 font-semibold">⚠ No answer</div>
                                  )}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    {q.options[q.correctIndex]} —{" "}
                                    {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {!checked ? (
                        <button
                          onClick={checkAnswers}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                        >
                          Check Answers
                        </button>
                      ) : (
                        <button
                          onClick={reset}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                        >
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button
                          onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                        >
                          Next Exercise →
                        </button>
                      )}
                    </div>

                    {score && (
                      <div
                        className={`rounded-2xl border p-4 ${
                          score.percent >= 80
                            ? "border-emerald-200 bg-emerald-50"
                            : score.percent >= 50
                            ? "border-amber-200 bg-amber-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div
                              className={`text-3xl font-black ${
                                score.percent >= 80
                                  ? "text-emerald-700"
                                  : score.percent >= 50
                                  ? "text-amber-700"
                                  : "text-red-700"
                              }`}
                            >
                              {score.percent}%
                            </div>
                            <div className="mt-0.5 text-sm text-slate-600">
                              {score.correct} out of {score.total} correct
                            </div>
                          </div>
                          <div className="text-3xl">
                            {score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}
                          </div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              score.percent >= 80
                                ? "bg-emerald-500"
                                : score.percent >= 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${score.percent}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80
                            ? "Excellent! Move on to the next exercise."
                            : score.percent >= 50
                            ? "Good effort! Review the wrong answers and try once more."
                            : "Keep practising — check the Explanation tab and try again."}
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
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
                300 × 600
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile ad */}
        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
            320 × 90
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/present-simple/quiz"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Present Simple Quiz
          </a>
          <a
            href="/tenses/present-simple/do-dont-do-i"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: do / does →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">am / is / are — Key Rules</h2>
        <p className="text-slate-500 text-sm">Three sentence patterns — learn the formula, then practise.</p>
      </div>

      {/* 3 sentence types */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Affirmative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "am / is / are", color: "yellow" }, { dim: true, text: "+" },
            { text: "complement", color: "slate" }, { dim: true, text: "+" },
            { text: ".", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I am a teacher." />
            <Ex en="She is from France." />
            <Ex en="They are students." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Negative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "am not / isn't / aren't", color: "red" }, { dim: true, text: "+" },
            { text: "complement", color: "slate" }, { dim: true, text: "+" },
            { text: ".", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I'm not tired." />
            <Ex en="He isn't at home." />
            <Ex en="We aren't ready." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[
            { text: "Am / Is / Are", color: "violet" }, { dim: true, text: "+" },
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "complement", color: "slate" }, { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Am I right?" />
            <Ex en="Is she a doctor?" />
            <Ex en="Are they here?" />
          </div>
        </div>
      </div>

      {/* Full conjugation table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Full conjugation — am / is / are</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Subject</th>
                <th className="text-left font-black text-emerald-600 pb-2 pr-4">✅ Affirmative</th>
                <th className="text-left font-black text-red-500 pb-2 pr-4">❌ Negative</th>
                <th className="text-left font-black text-sky-600 pb-2">❓ Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I",          "I am (I'm)",          "I am not (I'm not)",      "Am I...?"],
                ["You",        "You are (you're)",     "You aren't",              "Are you...?"],
                ["He / She",   "He is (he's) ← is!",  "He isn't",                "Is he...?"],
                ["It",         "It is (it's) ← is!",  "It isn't",                "Is it...?"],
                ["We",         "We are (we're)",       "We aren't",               "Are we...?"],
                ["They",       "They are (they're)",   "They aren't",             "Are they...?"],
              ].map(([subj, aff, neg, q]) => {
                const isHeSheIt = subj === "He / She" || subj === "It";
                return (
                  <tr key={subj} className={isHeSheIt ? "bg-amber-50/60" : ""}>
                    <td className="py-2 pr-4 font-black text-slate-700">{subj}</td>
                    <td className={`py-2 pr-4 font-mono text-sm ${isHeSheIt ? "text-emerald-700 font-black" : "text-slate-600"}`}>{aff}</td>
                    <td className={`py-2 pr-4 font-mono text-sm ${isHeSheIt ? "text-red-600 font-black" : "text-slate-600"}`}>{neg}</td>
                    <td className={`py-2 font-mono text-sm ${isHeSheIt ? "text-sky-700 font-black" : "text-slate-600"}`}>{q}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ Key point:</b> He / She / It always use <b>is</b> — never <i>are</i> or <i>am</i>!<br />
          <span className="font-mono">She is a teacher.</span> ✅ &nbsp;|&nbsp; <span className="font-mono line-through opacity-60">She are a teacher.</span> ❌
        </div>
      </div>

      {/* Contractions grid */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">🔗</span>
          <h3 className="font-black text-slate-900">Contractions</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">In spoken and informal written English, we almost always use contractions:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { full: "I am", short: "I'm" },
            { full: "you are", short: "you're" },
            { full: "he is", short: "he's" },
            { full: "she is", short: "she's" },
            { full: "it is", short: "it's" },
            { full: "we are", short: "we're" },
            { full: "they are", short: "they're" },
            { full: "is not", short: "isn't" },
            { full: "are not", short: "aren't" },
          ].map(({ full, short }) => (
            <div key={short} className="rounded-xl border border-black/10 bg-slate-50 px-3 py-2 text-center">
              <div className="text-xs text-slate-500">{full}</div>
              <div className="font-black text-slate-900 text-sm">{short}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Note: <b>am not</b> → the only accepted contraction is <b>I&apos;m not</b>. There is no <i>amn&apos;t</i> in standard English.</p>
      </div>

      {/* Short answers */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">💬</span>
          <h3 className="font-black text-slate-900">Short answers</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">Repeat only the verb to be — do not repeat the complement:</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { q: "Are you ready?",       yes: "Yes, I am.",        no: "No, I'm not." },
            { q: "Is she at home?",      yes: "Yes, she is.",      no: "No, she isn't." },
            { q: "Are they students?",   yes: "Yes, they are.",    no: "No, they aren't." },
            { q: "Is it cold today?",    yes: "Yes, it is.",       no: "No, it isn't." },
          ].map(({ q, yes, no }) => (
            <div key={q} className="rounded-xl border border-black/8 bg-black/[0.02] px-3 py-2.5">
              <div className="text-xs font-black text-slate-500 mb-1">{q}</div>
              <div className="text-sm font-semibold text-emerald-700">{yes}</div>
              <div className="text-sm font-semibold text-red-600">{no}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Uses of to be */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm">📌</span>
          <h3 className="font-black text-slate-900">Uses of to be in Present Simple</h3>
        </div>
        <div className="space-y-2">
          {[
            ["Professions", "She is a nurse. / I am a student."],
            ["Nationality & origin", "He is French. / We are from Spain."],
            ["States & feelings", "I am tired. / They are happy."],
            ["Age", "She is 25 years old. / He is 10."],
            ["Location", "She is at home. / They are in the office."],
            ["Description", "The weather is beautiful. / The film is great."],
          ].map(([use, ex]) => (
            <div key={use} className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
              <span className="text-sm shrink-0">✅</span>
              <div>
                <div className="text-xs font-black text-emerald-700 uppercase tracking-wide">{use}</div>
                <div className="font-semibold text-sm text-slate-800 italic mt-0.5">{ex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">⚠</span>
          <div>
            <div className="font-black text-amber-800 mb-1">Never use do / does with to be!</div>
            <div className="text-sm text-amber-700 space-y-1">
              <div><span className="font-mono font-semibold">Are you happy?</span> ✅</div>
              <div><span className="font-mono line-through opacity-60">Do you be happy?</span> ❌</div>
              <div className="mt-2"><span className="font-mono font-semibold">Is she a teacher?</span> ✅</div>
              <div><span className="font-mono line-through opacity-60">Does she be a teacher?</span> ❌</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
