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

export default function PossessiveAdjectivesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      // EX 1: MCQ — Choose the correct possessive adjective
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose the correct possessive adjective",
        instructions: "Choose the correct possessive adjective for each sentence.",
        questions: [
          {
            id: "e1q1",
            prompt: "I have a new bike. ___ bike is blue.",
            options: ["My", "Your", "His"],
            correctIndex: 0,
            explanation: '"My" is used for "I".',
          },
          {
            id: "e1q2",
            prompt: "Anna is from Spain. ___ English teacher is very kind.",
            options: ["His", "Her", "Their"],
            correctIndex: 1,
            explanation: '"Her" is used for "she/Anna".',
          },
          {
            id: "e1q3",
            prompt: "Tom has a dog. ___ dog is very friendly.",
            options: ["His", "Her", "Our"],
            correctIndex: 0,
            explanation: '"His" is used for "he/Tom".',
          },
          {
            id: "e1q4",
            prompt: "We live in a small flat. ___ flat is near the park.",
            options: ["Their", "Our", "Its"],
            correctIndex: 1,
            explanation: '"Our" is used for "we".',
          },
          {
            id: "e1q5",
            prompt: "They have two cats. ___ cats sleep on the sofa.",
            options: ["Their", "His", "My"],
            correctIndex: 0,
            explanation: '"Their" is used for "they".',
          },
          {
            id: "e1q6",
            prompt: "You have a nice jacket. ___ jacket looks warm.",
            options: ["His", "Your", "My"],
            correctIndex: 1,
            explanation: '"Your" is used for "you".',
          },
          {
            id: "e1q7",
            prompt: "The company has a new office. ___ office is in the city centre.",
            options: ["Its", "Their", "Her"],
            correctIndex: 0,
            explanation: '"Its" is used for things/animals (here: company).',
          },
          {
            id: "e1q8",
            prompt: "I am in the kitchen. ___ coffee is on the table.",
            options: ["My", "Your", "His"],
            correctIndex: 0,
            explanation: '"My" is used for "I".',
          },
          {
            id: "e1q9",
            prompt: "He is with his sister. ___ sister is very funny.",
            options: ["Her", "His", "Their"],
            correctIndex: 1,
            explanation: '"His" is used for "he".',
          },
          {
            id: "e1q10",
            prompt: "We are in class now. ___ teacher is talking to us.",
            options: ["Our", "Their", "My"],
            correctIndex: 0,
            explanation: '"Our" is used for "we".',
          },
        ],
      },
      // EX 2: Input — Write the correct possessive adjective
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Write the correct possessive adjective",
        instructions: "Type the correct possessive adjective in each blank.",
        questions: [
          {
            id: "e2q1",
            prompt: "I have a little brother. ____ brother is six years old.",
            correct: "my",
            explanation: '"My" is for "I".',
          },
          {
            id: "e2q2",
            prompt: "You are in my class. ____ desk is near the window.",
            correct: "your",
            explanation: '"Your" is for "you".',
          },
          {
            id: "e2q3",
            prompt: "Lisa has a red bag. ____ bag is on the chair.",
            correct: "her",
            explanation: '"Her" is for "she/Lisa".',
          },
          {
            id: "e2q4",
            prompt: "Jack is at home. ____ room is very clean.",
            correct: "his",
            explanation: '"His" is for "he/Jack".',
          },
          {
            id: "e2q5",
            prompt: "The dog is eating. ____ food is in the bowl.",
            correct: "its",
            explanation: '"Its" is for animals/things. Here: dog.',
          },
          {
            id: "e2q6",
            prompt: "We have English today. ____ lesson starts at ten.",
            correct: "our",
            explanation: '"Our" is for "we".',
          },
          {
            id: "e2q7",
            prompt: "They live next door. ____ house is very big.",
            correct: "their",
            explanation: '"Their" is for "they".',
          },
          {
            id: "e2q8",
            prompt: "This phone is new. ____ screen is very clear.",
            correct: "its",
            explanation: '"Its" is for things (phone).',
          },
          {
            id: "e2q9",
            prompt: "You and I are friends. ____ friendship is important to me.",
            correct: "our",
            explanation: '"Our" is for "we" (you and I).',
          },
          {
            id: "e2q10",
            prompt: "We are ready for the trip. ____ bags are by the door.",
            correct: "our",
            explanation: '"Our" is for "we".',
          },
        ],
      },
      // EX 3: MCQ — Mixed practice, common confusion
      3: {
        type: "mcq",
        title: "Exercise 3 (Harder) — Choose the correct possessive adjective",
        instructions: "Choose the correct word for each sentence.",
        questions: [
          {
            id: "e3q1",
            prompt: "Maria is with ___ mother at the market.",
            options: ["her", "his", "their"],
            correctIndex: 0,
            explanation: '"Her" is for "she/Maria".',
          },
          {
            id: "e3q2",
            prompt: "The cat is playing with ___ toy.",
            options: ["its", "his", "their"],
            correctIndex: 0,
            explanation: '"Its" is for animals/things (cat).',
          },
          {
            id: "e3q3",
            prompt: "John and I are packing ___ suitcases.",
            options: ["our", "their", "my"],
            correctIndex: 0,
            explanation: '"Our" is for "we" (John and I).',
          },
          {
            id: "e3q4",
            prompt: "She is doing ___ homework now.",
            options: ["her", "his", "my"],
            correctIndex: 0,
            explanation: '"Her" is for "she".',
          },
          {
            id: "e3q5",
            prompt: "The children are playing with ___ friends.",
            options: ["their", "our", "his"],
            correctIndex: 0,
            explanation: '"Their" is for "they/the children".',
          },
          {
            id: "e3q6",
            prompt: "You left ___ keys on the table.",
            options: ["your", "my", "her"],
            correctIndex: 0,
            explanation: '"Your" is for "you".',
          },
          {
            id: "e3q7",
            prompt: "The dog is wagging ___ tail.",
            options: ["its", "his", "their"],
            correctIndex: 0,
            explanation: '"Its" is for animals/things (dog).',
          },
          {
            id: "e3q8",
            prompt: "My parents love ___ garden.",
            options: ["their", "our", "his"],
            correctIndex: 0,
            explanation: '"Their" is for "they/my parents".',
          },
          {
            id: "e3q9",
            prompt: "We are waiting for ___ bus.",
            options: ["our", "their", "his"],
            correctIndex: 0,
            explanation: '"Our" is for "we".',
          },
          {
            id: "e3q10",
            prompt: "Tom is looking for ___ book.",
            options: ["his", "her", "my"],
            correctIndex: 0,
            explanation: '"His" is for "he/Tom".',
          },
        ],
      },
      // EX 4: Input — Complete the sentences
      4: {
        type: "input",
        title: "Exercise 4 (Hardest) — Complete the sentences",
        instructions: "Write the correct possessive adjective in the blank.",
        questions: [
          {
            id: "e4q1",
            prompt: "Anna is reading ____ book in the garden.",
            correct: "her",
            explanation: '"Her" is for "she/Anna".',
          },
          {
            id: "e4q2",
            prompt: "We are cleaning ____ room together.",
            correct: "our",
            explanation: '"Our" is for "we".',
          },
          {
            id: "e4q3",
            prompt: "The baby is playing with ____ teddy bear.",
            correct: "its",
            explanation: '"Its" is used when the gender is unknown — for a baby we don\'t know is a boy or girl, we use "its".',
          },
          {
            id: "e4q4",
            prompt: "I am calling ____ friend now.",
            correct: "my",
            explanation: '"My" is for "I".',
          },
          {
            id: "e4q5",
            prompt: "You have ____ lunch in your bag.",
            correct: "your",
            explanation: '"Your" is for "you".',
          },
          {
            id: "e4q6",
            prompt: "They are washing ____ car.",
            correct: "their",
            explanation: '"Their" is for "they".',
          },
          {
            id: "e4q7",
            prompt: "Jack is doing ____ homework after school.",
            correct: "his",
            explanation: '"His" is for "he/Jack".',
          },
          {
            id: "e4q8",
            prompt: "Lisa and Tom are painting ____ house.",
            correct: "their",
            explanation: '"Their" is for "they/Lisa and Tom".',
          },
          {
            id: "e4q9",
            prompt: "The dog is drinking ____ water.",
            correct: "its",
            explanation: '"Its" is for animals/things (dog).',
          },
          {
            id: "e4q10",
            prompt: "We are opening ____ presents now.",
            correct: "our",
            explanation: '"Our" is for "we".',
          },
        ],
      },
    };
  }, []);

  // Store answers
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const current = sets[exNo];

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
        <span className="text-slate-700 font-medium">Possessive Adjectives</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Possessive Adjectives <span className="font-extrabold">— basics</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Learn how to use <b>my, your, his, her, its, our, their</b> to show who something belongs to. These words come before a noun and tell us whose thing it is.
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
          href="/grammar/a1/this-that-these-those"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: This / That / These / Those →
        </a>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text?: string; color?: string; dim?: boolean }> }) {
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
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Possessive Adjectives</h2>
        <p className="text-slate-500 text-sm">Replace the subject pronoun with a possessive adjective to show ownership.</p>
      </div>

      {/* Formula */}
      <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🏷️</span>
          <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Structure</span>
        </div>
        <Formula parts={[
          { text: "Possessive adjective", color: "sky" },
          { dim: true },
          { text: "Noun", color: "slate" },
        ]} />
        <div className="mt-3 space-y-2">
          <Ex en="my bag — your phone — his car" />
          <Ex en="her book — its food — our house — their dog" />
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Subject pronoun → Possessive adjective</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Subject pronoun</th>
                <th className="text-left py-2 pr-4 font-black text-sky-700">Possessive adjective</th>
                <th className="text-left py-2 font-black text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "my", "my bag"],
                ["you", "your", "your phone"],
                ["he", "his", "his car"],
                ["she", "her", "her brother"],
                ["it", "its", "its food"],
                ["we", "our", "our house"],
                ["they", "their", "their friends"],
              ].map(([pron, poss, ex]) => (
                <tr key={pron}>
                  <td className="py-2 pr-4 text-slate-500 font-semibold">{pron}</td>
                  <td className="py-2 pr-4 font-black text-sky-700">{poss}</td>
                  <td className="py-2 text-slate-700 italic">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pronoun → possessive chip grid */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">At a glance</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { pron: "I", poss: "my", color: "sky" },
            { pron: "you", poss: "your", color: "green" },
            { pron: "he", poss: "his", color: "violet" },
            { pron: "she", poss: "her", color: "red" },
            { pron: "it", poss: "its", color: "slate" },
            { pron: "we", poss: "our", color: "yellow" },
            { pron: "they", poss: "their", color: "green" },
          ].map(({ pron, poss, color }) => (
            <div key={pron} className="flex items-center gap-1.5">
              <Formula parts={[{ text: pron, color: color as "sky" | "green" | "violet" | "red" | "slate" | "yellow" }]} />
              <span className="text-slate-400 text-xs font-bold">→</span>
              <Formula parts={[{ text: poss, color: color as "sky" | "green" | "violet" | "red" | "slate" | "yellow" }]} />
            </div>
          ))}
        </div>
      </div>

      {/* Wrong vs right */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Wrong</p>
          <Ex en="This is me book." correct={false} />
          <Ex en="This is he car." correct={false} />
          <Ex en="The cat hurt it's paw." correct={false} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Correct</p>
          <Ex en="This is my book." />
          <Ex en="This is his car." />
          <Ex en="The cat hurt its paw." />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> <b>its</b> (no apostrophe) = possessive adjective. <b>it&apos;s</b> = it is. This is one of the most common mistakes in English!
      </div>
    </div>
  );
}