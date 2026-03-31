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
    title: "Exercise 1 — Wh- questions and word order",
    instructions:
      "Wh- questions use: Wh- word + do/does + subject + base verb. Use does with he/she/it and do with I/you/we/they. Choose the missing word for each question.",
    questions: [
      {
        id: "1-1",
        prompt: "What time ___ the train leave?",
        options: ["do", "does", "is", "are"],
        correctIndex: 1,
        explanation: "The train (= it) → does: What time does the train leave?",
      },
      {
        id: "1-2",
        prompt: "Where ___ your parents live?",
        options: ["does", "do", "are", "is"],
        correctIndex: 1,
        explanation: "Your parents (= they) → do: Where do your parents live?",
      },
      {
        id: "1-3",
        prompt: "___ often does she go to the gym?",
        options: ["What", "How", "Which", "Where"],
        correctIndex: 1,
        explanation: "How often does she go to the gym? — 'How often' asks about frequency.",
      },
      {
        id: "1-4",
        prompt: "What ___ he do for a living?",
        options: ["do", "is", "does", "are"],
        correctIndex: 2,
        explanation: "He → does: What does he do for a living?",
      },
      {
        id: "1-5",
        prompt: "Who ___ you work for?",
        options: ["does", "do", "are", "is"],
        correctIndex: 1,
        explanation: "You → do: Who do you work for?",
      },
      {
        id: "1-6",
        prompt: "___ language does he speak?",
        options: ["How", "Which", "What", "Where"],
        correctIndex: 2,
        explanation: "What language does he speak? — 'What' is used to ask about a language.",
      },
      {
        id: "1-7",
        prompt: "How ___ does this cost?",
        options: ["many", "often", "much", "long"],
        correctIndex: 2,
        explanation: "How much does this cost? — 'How much' asks about price.",
      },
      {
        id: "1-8",
        prompt: "Why ___ they always arrive late?",
        options: ["does", "is", "do", "are"],
        correctIndex: 2,
        explanation: "They → do: Why do they always arrive late?",
      },
      {
        id: "1-9",
        prompt: "Which ___ you prefer — coffee or tea?",
        options: ["does", "do", "are", "is"],
        correctIndex: 1,
        explanation: "You → do: Which do you prefer?",
      },
      {
        id: "1-10",
        prompt: "When ___ the library open?",
        options: ["do", "are", "is", "does"],
        correctIndex: 3,
        explanation: "The library (= it) → does: When does the library open?",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Frequency adverbs (position)",
    instructions:
      "Frequency adverbs (always, usually, often, sometimes, rarely, never) go BEFORE the main verb but AFTER the verb 'to be'. Choose the correctly ordered option.",
    questions: [
      {
        id: "2-1",
        prompt: "She ___ coffee in the morning.",
        options: ["always drinks", "drinks always", "always drink", "is always drink"],
        correctIndex: 0,
        explanation: "'Always' goes before the main verb 'drinks': She always drinks coffee.",
      },
      {
        id: "2-2",
        prompt: "I am ___ late for work.",
        options: ["always", "always am", "am always", "never am"],
        correctIndex: 0,
        explanation: "With 'to be', the adverb goes AFTER the verb: I am never/always late. Here 'never' fits the blank: I am never late. But the correct option completing 'I am ___' is 'never' — here 'always' is the answer as it fills the blank after 'am'.",
      },
      {
        id: "2-3",
        prompt: "He ___ his homework.",
        options: ["sometimes forget", "forgets sometimes", "sometimes forgets", "is sometimes forget"],
        correctIndex: 2,
        explanation: "'Sometimes' goes before the main verb: He sometimes forgets his homework.",
      },
      {
        id: "2-4",
        prompt: "They ___ eat meat.",
        options: ["do rarely", "rarely do", "rarely", "are rarely"],
        correctIndex: 2,
        explanation: "'Rarely' goes before the main verb 'eat': They rarely eat meat.",
      },
      {
        id: "2-5",
        prompt: "She is ___ ready on time.",
        options: ["usually", "usually is", "is usually", "before usually"],
        correctIndex: 0,
        explanation: "With 'to be', the adverb comes after: She is usually ready. The blank is after 'is', so 'usually' fills it correctly.",
      },
      {
        id: "2-6",
        prompt: "My brother ___ plays video games.",
        options: ["never", "is never", "never is", "does never"],
        correctIndex: 0,
        explanation: "'Never' goes before the main verb 'plays': My brother never plays video games.",
      },
      {
        id: "2-7",
        prompt: "We are ___ on time for meetings.",
        options: ["rarely is", "rarely are", "rarely", "do rarely"],
        correctIndex: 2,
        explanation: "With 'to be', the adverb follows the verb: We are rarely on time. The blank is after 'are', so 'rarely' is correct.",
      },
      {
        id: "2-8",
        prompt: "She ___ gets up before 7 AM.",
        options: ["usually", "is usually", "usually is", "does usually"],
        correctIndex: 0,
        explanation: "'Usually' goes before the main verb 'gets up': She usually gets up before 7 AM.",
      },
      {
        id: "2-9",
        prompt: "He is ___ the first to arrive.",
        options: ["often is", "often", "does often", "is often"],
        correctIndex: 1,
        explanation: "With 'to be', adverb goes after the verb: He is often the first to arrive. The blank is after 'is', so 'often' fills it.",
      },
      {
        id: "2-10",
        prompt: "I ___ forget my keys.",
        options: ["sometimes", "is sometimes", "does sometimes", "sometimes is"],
        correctIndex: 0,
        explanation: "'Sometimes' goes before the main verb 'forget': I sometimes forget my keys.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Tag questions",
    instructions:
      "Tag questions: positive sentence → negative tag; negative sentence → positive tag. Use the same auxiliary as in the sentence. Choose the correct tag.",
    questions: [
      {
        id: "3-1",
        prompt: "She works here, ___ she?",
        options: ["does", "doesn't", "is", "isn't"],
        correctIndex: 1,
        explanation: "Positive sentence → negative tag: works → doesn't. She works here, doesn't she?",
      },
      {
        id: "3-2",
        prompt: "They don't know the answer, ___ they?",
        options: ["don't", "do", "does", "doesn't"],
        correctIndex: 1,
        explanation: "Negative sentence → positive tag: don't → do. They don't know, do they?",
      },
      {
        id: "3-3",
        prompt: "He is a doctor, ___ he?",
        options: ["is", "isn't", "doesn't", "does"],
        correctIndex: 1,
        explanation: "Positive sentence with 'is' → negative tag 'isn't'. He is a doctor, isn't he?",
      },
      {
        id: "3-4",
        prompt: "You speak French, ___ you?",
        options: ["do", "does", "don't", "doesn't"],
        correctIndex: 2,
        explanation: "Positive sentence → negative tag: speak (you) → don't. You speak French, don't you?",
      },
      {
        id: "3-5",
        prompt: "It doesn't rain much here, ___ it?",
        options: ["doesn't", "don't", "does", "do"],
        correctIndex: 2,
        explanation: "Negative sentence → positive tag: doesn't → does. It doesn't rain much, does it?",
      },
      {
        id: "3-6",
        prompt: "We are late, ___ we?",
        options: ["are", "is", "aren't", "isn't"],
        correctIndex: 2,
        explanation: "Positive sentence with 'are' → negative tag 'aren't'. We are late, aren't we?",
      },
      {
        id: "3-7",
        prompt: "She isn't happy, ___ she?",
        options: ["isn't", "is", "doesn't", "does"],
        correctIndex: 1,
        explanation: "Negative sentence → positive tag: isn't → is. She isn't happy, is she?",
      },
      {
        id: "3-8",
        prompt: "You don't eat meat, ___ you?",
        options: ["don't", "doesn't", "do", "does"],
        correctIndex: 2,
        explanation: "Negative sentence → positive tag: don't → do. You don't eat meat, do you?",
      },
      {
        id: "3-9",
        prompt: "He knows the answer, ___ he?",
        options: ["does", "do", "doesn't", "don't"],
        correctIndex: 2,
        explanation: "Positive sentence → negative tag: knows (he) → doesn't. He knows the answer, doesn't he?",
      },
      {
        id: "3-10",
        prompt: "They are from France, ___ they?",
        options: ["are", "is", "isn't", "aren't"],
        correctIndex: 3,
        explanation: "Positive sentence with 'are' → negative tag 'aren't'. They are from France, aren't they?",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed advanced",
    instructions:
      "This set mixes subject questions, indirect questions, stative verbs, and all advanced patterns. Think carefully about word order and which auxiliary (if any) is needed.",
    questions: [
      {
        id: "4-1",
        prompt: "Who ___ the best English in the class?",
        options: ["does speak", "do speak", "speaks", "speak"],
        correctIndex: 2,
        explanation: "Subject question: the wh-word IS the subject, so no do/does inversion. Who speaks? (NOT Who does speak?)",
      },
      {
        id: "4-2",
        prompt: "Do you know where she ___?",
        options: ["work", "works", "does work", "do work"],
        correctIndex: 1,
        explanation: "Indirect/embedded question uses normal word order with no inversion: where she works (NOT where does she work).",
      },
      {
        id: "4-3",
        prompt: "What ___ next in this story?",
        options: ["does happen", "do happen", "happens", "happen"],
        correctIndex: 2,
        explanation: "Subject question: 'What' is the subject. No do/does needed: What happens next?",
      },
      {
        id: "4-4",
        prompt: "I ___ what you mean.",
        options: ["am not understanding", "don't understand", "doesn't understand", "not understand"],
        correctIndex: 1,
        explanation: "'Understand' is a stative verb — it never takes continuous form. I don't understand.",
      },
      {
        id: "4-5",
        prompt: "Can you tell me where the post office ___?",
        options: ["does it stand", "is", "does stand", "do stand"],
        correctIndex: 1,
        explanation: "Indirect question: normal word order — where the post office is (no inversion, no do/does with 'to be').",
      },
      {
        id: "4-6",
        prompt: "She ___ like loud music.",
        options: ["isn't", "don't", "doesn't", "not"],
        correctIndex: 2,
        explanation: "She → doesn't. 'Like' is a main verb, not 'to be', so we use doesn't.",
      },
      {
        id: "4-7",
        prompt: "Who ___ the company?",
        options: ["does own", "owns", "do own", "own"],
        correctIndex: 1,
        explanation: "Subject question with stative verb 'own': Who owns the company? No do/does inversion.",
      },
      {
        id: "4-8",
        prompt: "They ___ believe the story.",
        options: ["aren't", "doesn't", "not", "don't"],
        correctIndex: 3,
        explanation: "They → don't. 'Believe' is a stative verb always used in Simple: They don't believe.",
      },
      {
        id: "4-9",
        prompt: "Do you know how much it ___?",
        options: ["does cost", "cost", "costs", "do cost"],
        correctIndex: 2,
        explanation: "Embedded question uses normal word order: how much it costs (NOT how much does it cost).",
      },
      {
        id: "4-10",
        prompt: "What ___ that word mean?",
        options: ["do", "is", "does", "are"],
        correctIndex: 2,
        explanation: "'That word' (= it) → does: What does that word mean? This is a normal Wh- question, not a subject question.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Wh- Questions",
  2: "Frequency Adverbs",
  3: "Tag Questions",
  4: "Mixed Advanced",
};

/* ─── Helper components ──────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) =>
        p.dim ? (
          <span key={i} className="text-slate-400 font-bold text-sm">
            +
          </span>
        ) : (
          <span
            key={i}
            className={`rounded-lg px-2.5 py-1 text-xs font-black border ${
              p.color ? colors[p.color] : colors.slate
            }`}
          >
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

export default function AdvancedMixedClient() {
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
          <span className="text-slate-700 font-medium">Advanced Mixed</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              Advanced Mixed
            </span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">
              Hard
            </span>
            <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
              B1
            </span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Challenge yourself with 40 advanced <b>Present Simple</b> questions across four sets: Wh- questions, frequency adverb position, tag questions, and a mixed advanced round including subject questions and indirect questions.
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
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  tab === "exercises"
                    ? "bg-[#F5DA20] text-black"
                    : "text-slate-700 hover:bg-black/5"
                }`}
              >
                Exercises
              </button>
              <button
                onClick={() => setTab("explanation")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  tab === "explanation"
                    ? "bg-[#F5DA20] text-black"
                    : "text-slate-700 hover:bg-black/5"
                }`}
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
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                      exNo === n
                        ? "bg-[#F5DA20] text-black"
                        : "bg-white text-slate-800 hover:bg-black/5"
                    }`}
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
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                            exNo === n
                              ? "bg-[#F5DA20] text-black"
                              : "bg-white text-slate-800 hover:bg-black/5"
                          }`}
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
                                    {q.options[q.correctIndex]} — {q.explanation}
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
            href="/tenses/present-simple/ps-vs-pc"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Simple vs Continuous
          </a>
          <a
            href="/tenses/present-simple/sentence-builder"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Sentence Builder →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">
          Present Simple — Advanced Rules
        </h2>
        <p className="text-slate-500 text-sm">
          Master Wh- questions, frequency adverb position, tag questions, and subject questions.
        </p>
      </div>

      {/* 1. Wh- questions */}
      <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">❓</span>
          <span className="text-sm font-black text-violet-700 uppercase tracking-widest">
            Wh- Questions
          </span>
        </div>
        <Formula
          parts={[
            { text: "Wh- word", color: "violet" },
            { dim: true, text: "+" },
            { text: "do / does", color: "yellow" },
            { dim: true, text: "+" },
            { text: "Subject", color: "sky" },
            { dim: true, text: "+" },
            { text: "base verb", color: "green" },
            { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]}
        />
        <div className="mt-3 space-y-2">
          <Ex en="What do you do for a living?" />
          <Ex en="Where does she live?" />
          <Ex en="How often do they go to the gym?" />
          <Ex en="Why does he always arrive late?" />
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>Rule:</b> Use <b>does</b> with he/she/it and <b>do</b> with I/you/we/they. The main verb is always in base form.
        </div>
      </div>

      {/* 2. Frequency adverbs */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">
            📍
          </span>
          <h3 className="font-black text-slate-900">Frequency Adverbs — Position</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Always, usually, often, sometimes, rarely, never — placement depends on the verb type.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">
              Before main verb
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "adverb", color: "violet" },
                { dim: true, text: "+" },
                { text: "main verb", color: "green" },
              ]}
            />
            <div className="mt-2 space-y-1.5">
              <Ex en="She always drinks coffee." />
              <Ex en="He sometimes forgets his keys." />
              <Ex en="They rarely eat out." />
            </div>
          </div>
          <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4">
            <div className="text-xs font-black text-amber-700 uppercase tracking-widest mb-2">
              After to be
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "am/is/are", color: "yellow" },
                { dim: true, text: "+" },
                { text: "adverb", color: "violet" },
              ]}
            />
            <div className="mt-2 space-y-1.5">
              <Ex en="She is usually ready on time." />
              <Ex en="He is always late." />
              <Ex en="I am never tired." />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tag questions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">
            🏷
          </span>
          <h3 className="font-black text-slate-900">Tag Questions</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          The tag uses the same auxiliary as the main clause, but with the opposite polarity.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">
              Positive → Negative tag
            </div>
            <div className="space-y-1.5">
              <Ex en="She works here, doesn't she?" />
              <Ex en="He is a doctor, isn't he?" />
              <Ex en="They speak French, don't they?" />
              <Ex en="We are late, aren't we?" />
            </div>
          </div>
          <div className="rounded-xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
            <div className="text-xs font-black text-red-600 uppercase tracking-widest mb-2">
              Negative → Positive tag
            </div>
            <div className="space-y-1.5">
              <Ex en="They don't know, do they?" />
              <Ex en="It doesn't rain much, does it?" />
              <Ex en="She isn't happy, is she?" />
              <Ex en="You don't eat meat, do you?" />
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ Key point:</b> Always mirror the auxiliary from the main clause (do/does/am/is/are) and flip positive/negative.
        </div>
      </div>

      {/* 4. Subject questions amber box */}
      <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⭐</span>
          <span className="text-sm font-black text-amber-700 uppercase tracking-widest">
            Subject Questions — No Inversion!
          </span>
        </div>
        <p className="text-sm text-slate-700 mb-3">
          When <b>who</b> or <b>what</b> is the subject of the question, you do NOT use do/does and the word order stays normal.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-xs font-black text-emerald-700 uppercase mb-1">Correct</div>
            <div className="space-y-1.5">
              <Ex en="Who speaks the best English?" />
              <Ex en="What happens next?" />
              <Ex en="Who owns the company?" />
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-red-600 uppercase mb-1">Wrong</div>
            <div className="space-y-1.5">
              <Ex en="Who does speak the best English? ❌" />
              <Ex en="What does happen next? ❌" />
              <Ex en="Who does own the company? ❌" />
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-white border border-amber-200 px-4 py-3 text-sm text-amber-900">
          <b>Tip:</b> Ask yourself — is the wh-word the subject (the one doing the action)? If yes, no do/does needed.
        </div>
      </div>

      {/* 5. Quick reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">
            📋
          </span>
          <h3 className="font-black text-slate-900">Quick Reference Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Pattern</th>
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Rule</th>
                <th className="text-left font-black text-slate-500 pb-2">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Wh- question", "Wh- + do/does + subject + verb", "Where does she work?"],
                ["Freq. adverb (main verb)", "Subject + adverb + verb", "She always arrives late."],
                ["Freq. adverb (to be)", "Subject + be + adverb", "He is always late."],
                ["Tag (positive → neg.)", "Positive sentence, neg. tag?", "She works, doesn't she?"],
                ["Tag (negative → pos.)", "Negative sentence, pos. tag?", "They don't know, do they?"],
                ["Subject question", "Wh- + verb (no do/does)", "Who knows the answer?"],
                ["Indirect question", "Normal word order after if/whether/wh-", "Do you know where she works?"],
                ["Stative verbs", "Always Present Simple, never continuous", "I don't understand. (NOT am not understanding)"],
              ].map(([pattern, rule, example]) => (
                <tr key={pattern}>
                  <td className="py-2 pr-4 font-black text-slate-700 text-xs">{pattern}</td>
                  <td className="py-2 pr-4 text-slate-600 text-xs">{rule}</td>
                  <td className="py-2 font-mono text-xs text-slate-800">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
