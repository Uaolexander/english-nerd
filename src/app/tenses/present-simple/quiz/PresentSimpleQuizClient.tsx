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
    title: "Exercise 1 — Affirmative: he / she / it → add -s or -es",
    instructions:
      "With he, she, it (and singular nouns) the verb takes -s or -es: she works, he goes, it rains. With I, you, we, they the verb stays in its base form: I work, they go.",
    questions: [
      { id: "1-1", prompt: "She ___ to school every day.", options: ["go", "goes", "is going", "going"], correctIndex: 1, explanation: "He/she/it → add -s: goes." },
      { id: "1-2", prompt: "He ___ coffee every morning.", options: ["drink", "drinks", "is drinking", "drank"], correctIndex: 1, explanation: "He/she/it → add -s: drinks." },
      { id: "1-3", prompt: "The train ___ at 8 AM.", options: ["leave", "leaving", "leaves", "left"], correctIndex: 2, explanation: "Singular noun → add -s: leaves." },
      { id: "1-4", prompt: "My sister ___ in London.", options: ["live", "is live", "lived", "lives"], correctIndex: 3, explanation: "He/she/it → add -s: lives." },
      { id: "1-5", prompt: "It ___ a lot in winter here.", options: ["rain", "rains", "is rain", "rained"], correctIndex: 1, explanation: "It → add -s: rains." },
      { id: "1-6", prompt: "He ___ chess very well.", options: ["playing", "play", "plays", "played"], correctIndex: 2, explanation: "He/she/it → add -s: plays." },
      { id: "1-7", prompt: "The sun ___ in the east.", options: ["rise", "rising", "rised", "rises"], correctIndex: 3, explanation: "Singular noun → add -s: rises." },
      { id: "1-8", prompt: "She ___ three languages.", options: ["speak", "speaks", "is speaking", "speaking"], correctIndex: 1, explanation: "She → add -s: speaks." },
      { id: "1-9", prompt: "Tom ___ to music every evening.", options: ["listen", "listened", "listens", "listening"], correctIndex: 2, explanation: "He/she/it → add -s: listens." },
      { id: "1-10", prompt: "The class ___ at nine o'clock.", options: ["starting", "start", "started", "starts"], correctIndex: 3, explanation: "Singular noun → add -s: starts." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: don't / doesn't",
    instructions:
      "To make a negative, add don't (do not) with I / you / we / they, and doesn't (does not) with he / she / it. The main verb stays in its base form after don't / doesn't: she doesn't work (NOT doesn't works).",
    questions: [
      { id: "2-1", prompt: "I ___ eat meat.", options: ["doesn't", "don't", "not", "am not"], correctIndex: 1, explanation: "I → don't: I don't eat." },
      { id: "2-2", prompt: "She ___ watch TV in the morning.", options: ["don't", "isn't", "doesn't", "not"], correctIndex: 2, explanation: "She → doesn't: she doesn't watch." },
      { id: "2-3", prompt: "They ___ live near here.", options: ["doesn't", "don't", "aren't", "not"], correctIndex: 1, explanation: "They → don't: they don't live." },
      { id: "2-4", prompt: "He ___ like spicy food.", options: ["don't", "doesn't", "isn't", "not"], correctIndex: 1, explanation: "He → doesn't: he doesn't like." },
      { id: "2-5", prompt: "We ___ have a car.", options: ["doesn't", "aren't", "not", "don't"], correctIndex: 3, explanation: "We → don't: we don't have." },
      { id: "2-6", prompt: "My dog ___ eat vegetables.", options: ["don't", "doesn't", "isn't", "not"], correctIndex: 1, explanation: "My dog (= it) → doesn't." },
      { id: "2-7", prompt: "You ___ need to shout.", options: ["doesn't", "aren't", "don't", "not"], correctIndex: 2, explanation: "You → don't: you don't need." },
      { id: "2-8", prompt: "It ___ snow here in summer.", options: ["don't", "isn't", "not", "doesn't"], correctIndex: 3, explanation: "It → doesn't: it doesn't snow." },
      { id: "2-9", prompt: "She ___ know the answer.", options: ["doesn't", "don't", "isn't", "not"], correctIndex: 0, explanation: "She → doesn't: she doesn't know." },
      { id: "2-10", prompt: "My parents ___ speak English.", options: ["doesn't", "aren't", "not", "don't"], correctIndex: 3, explanation: "They (parents) → don't: they don't speak." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: do / does + short answers",
    instructions:
      "Questions use Do with I / you / we / they and Does with he / she / it. The main verb stays in its base form: Does she work? (NOT Does she works?) Short answers: Yes, I do. / No, she doesn't.",
    questions: [
      { id: "3-1", prompt: "___ you like chocolate?", options: ["Does", "Do", "Are", "Is"], correctIndex: 1, explanation: "You → Do: Do you like…?" },
      { id: "3-2", prompt: "___ she work here?", options: ["Do", "Is", "Does", "Are"], correctIndex: 2, explanation: "She → Does: Does she work…?" },
      { id: "3-3", prompt: "___ they speak French?", options: ["Does", "Do", "Are", "Is"], correctIndex: 1, explanation: "They → Do: Do they speak…?" },
      { id: "3-4", prompt: '"Do you play football?" — "Yes, I ___.', options: ["do", "does", "am", "play"], correctIndex: 0, explanation: "Short answer with Do: Yes, I do." },
      { id: "3-5", prompt: '"Does he drink coffee?" — "No, he ___.', options: ["don't", "doesn't", "isn't", "not"], correctIndex: 1, explanation: "Short negative answer with does: No, he doesn't." },
      { id: "3-6", prompt: '"Do they live in Paris?" — "Yes, they ___.', options: ["does", "are", "did", "do"], correctIndex: 3, explanation: "Short answer with Do: Yes, they do." },
      { id: "3-7", prompt: "___ your mother cook every day?", options: ["Do", "Is", "Does", "Has"], correctIndex: 2, explanation: "Your mother (= she) → Does." },
      { id: "3-8", prompt: '"Does she like jazz?" — "No, she ___.', options: ["don't", "isn't", "doesn't", "won't"], correctIndex: 2, explanation: "Short negative answer with does: No, she doesn't." },
      { id: "3-9", prompt: "___ it rain a lot in autumn?", options: ["Do", "Does", "Is", "Are"], correctIndex: 1, explanation: "It → Does: Does it rain…?" },
      { id: "3-10", prompt: '"Do you study English?" — "Yes, I ___.', options: ["does", "am", "study", "do"], correctIndex: 3, explanation: "Short answer with Do: Yes, I do." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all three forms",
    instructions:
      "This exercise mixes affirmative, negative, and question forms. For each sentence, decide: What is the subject? Which form fits — base verb (+s), don't/doesn't, or Do/Does?",
    questions: [
      { id: "4-1", prompt: "My brother ___ football every weekend.", options: ["play", "plays", "is plays", "to play"], correctIndex: 1, explanation: "My brother (= he) → plays." },
      { id: "4-2", prompt: "___ your parents live in the city?", options: ["Does", "Do", "Are", "Is"], correctIndex: 1, explanation: "Your parents (= they) → Do." },
      { id: "4-3", prompt: "She ___ like horror movies.", options: ["don't", "doesn't", "isn't", "not"], correctIndex: 1, explanation: "She → doesn't." },
      { id: "4-4", prompt: "Water ___ at 100 degrees Celsius.", options: ["boil", "is boiling", "boils", "boiled"], correctIndex: 2, explanation: "Water (= it) → boils. Scientific fact." },
      { id: "4-5", prompt: "We ___ usually have breakfast at home.", options: ["doesn't", "no", "not", "don't"], correctIndex: 3, explanation: "We → don't." },
      { id: "4-6", prompt: '"Does Mark play the guitar?" — "Yes, he ___.', options: ["do", "does", "plays", "is"], correctIndex: 1, explanation: "Short answer with does: Yes, he does." },
      { id: "4-7", prompt: "The museum ___ at 9 in the morning.", options: ["open", "is open", "opening", "opens"], correctIndex: 3, explanation: "The museum (= it) → opens." },
      { id: "4-8", prompt: "I ___ have a pet.", options: ["doesn't", "don't", "not", "no"], correctIndex: 1, explanation: "I → don't." },
      { id: "4-9", prompt: "How often ___ she go to the gym?", options: ["do", "is", "does", "are"], correctIndex: 2, explanation: "She → does: How often does she go…?" },
      { id: "4-10", prompt: "___ you enjoy learning English?", options: ["Does", "Do", "Are", "Is"], correctIndex: 1, explanation: "You → Do." },
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

export default function PresentSimpleQuizClient() {
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
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
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
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Present Simple</b> with 40 multiple choice questions across four sets: affirmative, negative, questions, and a mixed review. Pick the correct form and check your answers.
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
                          onClick={() => setChecked(true)}
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
            href="/tenses/present-simple"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← All Present Simple exercises
          </a>
          <a
            href="/tenses/present-simple/fill-in-blank"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Fill in the Blank →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

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

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Present Simple — Key Rules</h2>
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
            { text: "verb (+s/es)", color: "yellow" }, { dim: true, text: "+" },
            { text: "rest", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I work here." />
            <Ex en="She works here." />
            <Ex en="They play football." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Negative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "don't / doesn't", color: "red" }, { dim: true, text: "+" },
            { text: "verb", color: "yellow" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I don't work." />
            <Ex en="She doesn't work." />
            <Ex en="They don't play." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[
            { text: "Do / Does", color: "violet" }, { dim: true, text: "+" },
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "verb", color: "yellow" }, { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Do you work?" />
            <Ex en="Does she work?" />
            <Ex en="Do they play?" />
          </div>
        </div>
      </div>

      {/* Conjugation table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">He / She / It — the golden rule</h3>
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
                ["I",         "I work",             "I don't work",        "Do I work?"],
                ["You",       "You work",            "You don't work",      "Do you work?"],
                ["He / She",  "She works ← (+s!)",   "She doesn't work",    "Does she work?"],
                ["It",        "It works ← (+s!)",    "It doesn't work",     "Does it work?"],
                ["We / They", "They work",           "They don't work",     "Do they work?"],
              ].map(([subj, aff, neg, q]) => (
                <tr key={subj}>
                  <td className="py-2 pr-4 font-black text-slate-700">{subj}</td>
                  <td className={`py-2 pr-4 font-mono text-sm ${subj.startsWith("He") || subj === "It" ? "text-emerald-700 font-black" : "text-slate-600"}`}>{aff}</td>
                  <td className={`py-2 pr-4 font-mono text-sm ${subj.startsWith("He") || subj === "It" ? "text-red-600 font-black" : "text-slate-600"}`}>{neg}</td>
                  <td className={`py-2 font-mono text-sm ${subj.startsWith("He") || subj === "It" ? "text-sky-700 font-black" : "text-slate-600"}`}>{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ Key point:</b> after <b>doesn't</b> and <b>does</b> the verb is ALWAYS in base form — no -s!<br />
          <span className="font-mono">She doesn&apos;t work</span> ✅ &nbsp;|&nbsp; <span className="font-mono line-through opacity-60">She doesn&apos;t works</span> ❌
        </div>
      </div>

      {/* Short answers */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">💬</span>
          <h3 className="font-black text-slate-900">Short answers</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">Never repeat the main verb — use do / does / don&apos;t / doesn&apos;t:</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { q: "Do you work?",       yes: "Yes, I do.",        no: "No, I don't." },
            { q: "Does she work?",     yes: "Yes, she does.",    no: "No, she doesn't." },
            { q: "Do they play?",      yes: "Yes, they do.",     no: "No, they don't." },
            { q: "Does he like jazz?", yes: "Yes, he does.",     no: "No, he doesn't." },
          ].map(({ q, yes, no }) => (
            <div key={q} className="rounded-xl border border-black/8 bg-black/[0.02] px-3 py-2.5">
              <div className="text-xs font-black text-slate-500 mb-1">{q}</div>
              <div className="text-sm font-semibold text-emerald-700">{yes}</div>
              <div className="text-sm font-semibold text-red-600">{no}</div>
            </div>
          ))}
        </div>
      </div>

      {/* When to use */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">📌</span>
          <h3 className="font-black text-slate-900">When do we use Present Simple?</h3>
        </div>
        <div className="space-y-2">
          {[
            ["Habits & routines", "She goes to the gym every morning."],
            ["Permanent states", "He lives in Paris."],
            ["Facts & general truths", "Water boils at 100°C."],
            ["Timetables & schedules", "The train leaves at 8 AM."],
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
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>Common time expressions:</b>{" "}
          <span className="text-amber-900">always · usually · often · sometimes · rarely · never · every day · on Mondays · in the morning · at 7 o&apos;clock</span>
        </div>
      </div>
    </div>
  );
}
