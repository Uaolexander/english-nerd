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
  prompt: string; // sentence with a blank
  correct: string; // normalized expected answer
  explanation: string;
};

type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function SomeAnyLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose some or any",
        instructions: "Choose the correct word: some or any.",
        questions: [
          {
            id: "e1q1",
            prompt: "There is ___ milk in the fridge, so you can make some tea now.",
            options: ["some", "any", "a", "the"],
            correctIndex: 0,
            explanation: "We usually use some in positive sentences.",
          },
          {
            id: "e1q2",
            prompt: "We don't have ___ bread at home, so I need to go to the shop.",
            options: ["some", "any", "the", "an"],
            correctIndex: 1,
            explanation: "We usually use any in negative sentences.",
          },
          {
            id: "e1q3",
            prompt: "Would you like ___ sugar in your coffee, or do you drink it black?",
            options: ["some", "any", "the", "an"],
            correctIndex: 0,
            explanation: "In offers and polite questions, we often use some.",
          },
          {
            id: "e1q4",
            prompt: "Are there ___ students in the classroom, or is it empty now?",
            options: ["some", "any", "the", "an"],
            correctIndex: 1,
            explanation: "We usually use any in general questions.",
          },
          {
            id: "e1q5",
            prompt: "I bought ___ apples and bananas because we need fruit for tomorrow.",
            options: ["some", "any", "a", "the"],
            correctIndex: 0,
            explanation: "This is a positive sentence, so some is correct.",
          },
          {
            id: "e1q6",
            prompt: "She doesn't know ___ people in this town because she is new here.",
            options: ["some", "any", "the", "an"],
            correctIndex: 1,
            explanation: "After doesn't, we normally use any.",
          },
          {
            id: "e1q7",
            prompt: "Can I have ___ water, please? I'm really thirsty after the lesson.",
            options: ["some", "any", "a", "the"],
            correctIndex: 0,
            explanation: "When we ask for something politely, we often use some.",
          },
          {
            id: "e1q8",
            prompt: "There aren't ___ clean plates in the kitchen, so we must wash them.",
            options: ["some", "any", "the", "an"],
            correctIndex: 1,
            explanation: "In negative sentences, any is the usual choice.",
          },
          {
            id: "e1q9",
            prompt: "We have ___ free time this evening, so let's watch a film together.",
            options: ["some", "any", "a", "the"],
            correctIndex: 0,
            explanation: "Positive sentence = some.",
          },
          {
            id: "e1q10",
            prompt: "Do you have ___ questions before we start the next exercise?",
            options: ["some", "any", "the", "an"],
            correctIndex: 1,
            explanation: "In most questions, we use any.",
          },
        ],
      },

      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type some or any",
        instructions: "Write some or any.",
        questions: [
          {
            id: "e2q1",
            prompt: "There are ___ eggs on the table, so we can make breakfast now.",
            correct: "some",
            explanation: "This is a positive sentence, so we use some.",
          },
          {
            id: "e2q2",
            prompt: "I can't find ___ information about that museum on their website.",
            correct: "any",
            explanation: "Negative sentence = any.",
          },
          {
            id: "e2q3",
            prompt: "Would you like ___ cake? I made it this morning.",
            correct: "some",
            explanation: "Offers usually take some.",
          },
          {
            id: "e2q4",
            prompt: "Are there ___ shops near your house that sell fresh bread?",
            correct: "any",
            explanation: "General question = any.",
          },
          {
            id: "e2q5",
            prompt: "We need ___ cheese for the sandwiches for tomorrow's trip.",
            correct: "some",
            explanation: "Positive sentence = some.",
          },
          {
            id: "e2q6",
            prompt: "There isn't ___ juice left in the bottle, so I'll buy more.",
            correct: "any",
            explanation: "After isn't, use any.",
          },
          {
            id: "e2q7",
            prompt: "Can you give me ___ help with this homework task, please?",
            correct: "some",
            explanation: "Requests often use some.",
          },
          {
            id: "e2q8",
            prompt: "My brother doesn't eat ___ vegetables with his dinner.",
            correct: "any",
            explanation: "Negative sentence = any.",
          },
          {
            id: "e2q9",
            prompt: "I have ___ good friends at school, and we always sit together.",
            correct: "some",
            explanation: "Positive sentence = some.",
          },
          {
            id: "e2q10",
            prompt: "Did you buy ___ fruit at the supermarket, or did you forget?",
            correct: "any",
            explanation: "In normal questions, any is correct.",
          },
        ],
      },

      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Choose the best option",
        instructions: "Choose the correct word for each sentence.",
        questions: [
          {
            id: "e3q1",
            prompt: "There are ___ lovely photos on the wall in our living room.",
            options: ["some", "any", "a", "the"],
            correctIndex: 0,
            explanation: "It is a positive sentence, so some is the best choice.",
          },
          {
            id: "e3q2",
            prompt: "We haven't got ___ butter, so we can't make the cake tonight.",
            options: ["some", "any", "a", "an"],
            correctIndex: 1,
            explanation: "Negative sentence = any.",
          },
          {
            id: "e3q3",
            prompt: "Could I have ___ more time to finish this exercise, please?",
            options: ["some", "any", "a", "the"],
            correctIndex: 0,
            explanation: "Polite requests often use some.",
          },
          {
            id: "e3q4",
            prompt: "Do you know ___ nice places to visit in Poznań on the weekend?",
            options: ["some", "any", "a", "the"],
            correctIndex: 1,
            explanation: "This is a general question, so any fits best.",
          },
          {
            id: "e3q5",
            prompt: "I need to buy ___ paper because my notebook is full already.",
            options: ["some", "any", "a", "the"],
            correctIndex: 0,
            explanation: "Positive sentence = some.",
          },
          {
            id: "e3q6",
            prompt: "There aren't ___ buses after ten o'clock, so we should leave earlier.",
            options: ["some", "any", "the", "an"],
            correctIndex: 1,
            explanation: "Negative sentence = any.",
          },
          {
            id: "e3q7",
            prompt: "Would you like ___ sandwiches before we go to the station?",
            options: ["some", "any", "the", "an"],
            correctIndex: 0,
            explanation: "Offers usually use some.",
          },
          {
            id: "e3q8",
            prompt: "Is there ___ homework for tomorrow, or are we free this time?",
            options: ["some", "any", "a", "the"],
            correctIndex: 1,
            explanation: "In a normal question, any is the usual word.",
          },
          {
            id: "e3q9",
            prompt: "We still have ___ money left, so we can buy a drink too.",
            options: ["some", "any", "a", "the"],
            correctIndex: 0,
            explanation: "Positive sentence = some.",
          },
          {
            id: "e3q10",
            prompt: "She doesn't want ___ coffee in the evening because she can't sleep later.",
            options: ["some", "any", "a", "the"],
            correctIndex: 1,
            explanation: "Negative sentence = any.",
          },
        ],
      },

      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the sentences",
        instructions: "Write some or any.",
        questions: [
          {
            id: "e4q1",
            prompt: "We bought ___ snacks for the journey because it is a long trip.",
            correct: "some",
            explanation: "Positive sentence = some.",
          },
          {
            id: "e4q2",
            prompt: "There isn't ___ hot water, so I can't wash the dishes yet.",
            correct: "any",
            explanation: "Negative sentence = any.",
          },
          {
            id: "e4q3",
            prompt: "Would you like ___ tea with lemon, or just plain tea?",
            correct: "some",
            explanation: "Offers usually take some.",
          },
          {
            id: "e4q4",
            prompt: "Do you have ___ brothers or sisters, or are you an only child?",
            correct: "any",
            explanation: "In a general question, we usually use any.",
          },
          {
            id: "e4q5",
            prompt: "I have ___ ideas for our class project, and I want to share them.",
            correct: "some",
            explanation: "Positive sentence = some.",
          },
          {
            id: "e4q6",
            prompt: "My dad doesn't drink ___ milk in his coffee in the morning.",
            correct: "any",
            explanation: "Negative sentence = any.",
          },
          {
            id: "e4q7",
            prompt: "Can we have ___ more chairs here, please? Our friends are coming.",
            correct: "some",
            explanation: "Requests often use some.",
          },
          {
            id: "e4q8",
            prompt: "Are there ___ messages for me, or did nobody call today?",
            correct: "any",
            explanation: "This is a normal question, so any is correct.",
          },
          {
            id: "e4q9",
            prompt: "There is ___ soup in the pot if you are hungry after work.",
            correct: "some",
            explanation: "Positive sentence = some.",
          },
          {
            id: "e4q10",
            prompt: "We don't need ___ more food because there is enough for everyone.",
            correct: "any",
            explanation: "Negative sentence = any.",
          },
        ],
      },
    };
  }, []);

  // Store answers
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const current = sets[exNo];

  const score = useMemo(() => {
    if (!checked) return null;

    let correct = 0;
    let total = 0;

    if (current.type === "mcq") {
      total = current.questions.length;
      for (const q of current.questions) {
        const a = mcqAnswers[q.id];
        if (a === q.correctIndex) correct++;
      }
    } else {
      total = current.questions.length;
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }

    const percent = total ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percent };
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a1">Grammar A1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Some / Any</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Some / Any <span className="font-extrabold">— A1 grammar exercises</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Practice some and any with simple A1 sentences, clear rules, and easy exercises for positive sentences, negatives, and questions.
      </p>

      {/* Layout: left ad + center content + right ad */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left Ad */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
            <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
              300 × 600
            </div>
          </div>
        </aside>

        {/* Center */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button
              onClick={() => setTab("exercises")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Exercises
            </button>
            <button
              onClick={() => setTab("explanation")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Explanation
            </button>

            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
              Exercises:
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => switchExercise(n as 1 | 2 | 3 | 4)}
                  className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                    exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>

                  {/* Mobile exercise buttons */}
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => switchExercise(n as 1 | 2 | 3 | 4)}
                        className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                          exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Questions */}
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
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>

                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${
                                      chosen === oi
                                        ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                        : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default opacity-95" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))}
                                    />
                                    <span className="text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>

                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}

                                  <div className="mt-2 text-slate-700">
                                    <b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
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
                      const noAnswer = checked && !answered;
                      const wrong = checked && answered && !isCorrect;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>

                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>

                              <div className="mt-3 flex items-center gap-3">
                                <input
                                  value={val}
                                  disabled={checked}
                                  onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                                  placeholder="Type here…"
                                  className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]"
                                />
                              </div>

                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}

                                  <div className="mt-2 text-slate-700">
                                    <b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Controls */}
                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button
                        onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                      >
                        Check Answers
                      </button>
                    ) : (
                      <button
                        onClick={resetExercise}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                      >
                        Try Again
                      </button>
                    )}
                    {checked && exNo < 4 && (
                      <button
                        onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                      >
                        Next Exercise →
                      </button>
                    )}
                  </div>

                  {score && (
                    <div className={`rounded-2xl border p-4 ${
                      score.percent >= 80
                        ? "border-emerald-200 bg-emerald-50"
                        : score.percent >= 50
                        ? "border-amber-200 bg-amber-50"
                        : "border-red-200 bg-red-50"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-3xl font-black ${
                            score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"
                          }`}>
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
                            score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${score.percent}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {score.percent >= 80
                          ? "Excellent! You can move to the next exercise."
                          : score.percent >= 50
                          ? "Good effort! Try once more to improve your score."
                          : "Keep practising — review the Explanation tab and try again."}
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

        {/* Right Ad */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
            <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
              300 × 600
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a
          href="/grammar/a1"
          className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
        >
          ← All A1 topics
        </a>
        <a
          href="/grammar/a1/countable-uncountable"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Countable / Uncountable →
        </a>
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Some / Any</h2>
        <p className="mt-2 text-slate-600 text-sm">
          Use <b>some</b> and <b>any</b> with plural countable nouns and uncountable nouns when the exact amount does not matter. The choice depends on the sentence type — positive, negative, or question.
        </p>
      </div>

      {/* 2 gradient cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* SOME */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700">SOME — affirmative sentences</div>
          <Formula parts={[{ text: "some", color: "green" }, { dim: true, text: "+" }, { text: "noun (countable/uncountable)", color: "slate" }]} />
          <div className="space-y-2 pt-1">
            <Ex en="I have some milk." />
            <Ex en="There are some books on the table." />
            <Ex en="We need some help with this task." />
          </div>
        </div>

        {/* ANY */}
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wide text-sky-700">ANY — negative &amp; questions</div>
          <Formula parts={[{ text: "any", color: "sky" }, { dim: true, text: "+" }, { text: "noun (countable/uncountable)", color: "slate" }]} />
          <div className="space-y-2 pt-1">
            <Ex en="I don't have any milk." />
            <Ex en="Do you have any questions?" />
            <Ex en="Are there any shops near here?" />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-white shrink-0">!</span>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Reference table — some vs any</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="pb-2 text-left font-black text-slate-700 pr-4">Noun type</th>
                <th className="pb-2 text-left font-black text-slate-700 pr-4">Positive (+)</th>
                <th className="pb-2 text-left font-black text-slate-700 pr-4">Negative (−)</th>
                <th className="pb-2 text-left font-black text-slate-700">Question (?)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-slate-700">Countable</td>
                <td className="py-2.5 pr-4 text-slate-800">I have <b>some</b> books.</td>
                <td className="py-2.5 pr-4 text-slate-800">I don't have <b>any</b> books.</td>
                <td className="py-2.5 text-slate-800">Do you have <b>any</b> books?</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-slate-700">Uncountable</td>
                <td className="py-2.5 pr-4 text-slate-800">There is <b>some</b> water.</td>
                <td className="py-2.5 pr-4 text-slate-800">There isn't <b>any</b> water.</td>
                <td className="py-2.5 text-slate-800">Is there <b>any</b> water?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Special case card */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wide text-violet-700">Special case — SOME in questions (offers &amp; requests)</div>
        <p className="text-sm text-slate-600">When making an offer or polite request, use <b>some</b> in questions — you expect the answer to be <i>yes</i>.</p>
        <div className="space-y-2">
          <Ex en="Would you like some tea?" />
          <Ex en="Can I have some water, please?" />
          <Ex en="Could I get some more time?" />
        </div>
      </div>

      {/* Correction examples */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-b from-red-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wide text-red-600">Common mistakes — fix these!</div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Ex en="I don't have some money." correct={false} />
          <Ex en="I don't have any money." correct={true} />
          <Ex en="Are there some eggs?" correct={false} />
          <Ex en="Are there any eggs?" correct={true} />
          <Ex en="I have any juice." correct={false} />
          <Ex en="I have some juice." correct={true} />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Remember!</span> Use <b>some</b> in positive sentences and <b>any</b> in negatives and most questions — but <b>some</b> in offers (<i>Would you like some tea?</i>) is perfectly correct and natural.
      </div>
    </div>
  );
}