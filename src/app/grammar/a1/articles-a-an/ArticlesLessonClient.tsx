"use client";

import { useMemo, useState } from "react";
import LessonBottomNav from "@/components/LessonBottomNav";

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

export default function ArticlesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      // EX 1: easiest, MCQ (a/an)
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose a / an",
        instructions: "Choose the correct article: a or an.",
        questions: [
          {
            id: "e1q1",
            prompt: "I have ___ dog.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "Dog starts with a consonant sound /d/ → a.",
          },
          {
            id: "e1q2",
            prompt: "She has ___ umbrella.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Umbrella starts with a vowel sound /ʌ/ → an.",
          },
          {
            id: "e1q3",
            prompt: "It is ___ book.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "Book starts with a consonant sound /b/ → a.",
          },
          {
            id: "e1q4",
            prompt: "He is ___ engineer.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Engineer starts with a vowel sound /en/ → an.",
          },
          {
            id: "e1q5",
            prompt: "I want ___ apple.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Apple starts with a vowel sound /æ/ → an.",
          },
          {
            id: "e1q6",
            prompt: "This is ___ car.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "Car starts with a consonant sound /k/ → a.",
          },
          {
            id: "e1q7",
            prompt: "We need ___ hotel.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "Hotel starts with a consonant sound /h/ → a.",
          },
          {
            id: "e1q8",
            prompt: "It's ___ orange.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Orange starts with a vowel sound /ɒ/ → an.",
          },
          {
            id: "e1q9",
            prompt: "He bought ___ new phone.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "New starts with a consonant sound /n/ → a.",
          },
          {
            id: "e1q10",
            prompt: "She is ___ artist.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Artist starts with a vowel sound /ɑː/ → an.",
          },
        ],
      },

      // EX 2: input (a/an)
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type a / an",
        instructions: "Write a or an.",
        questions: [
          {
            id: "e2q1",
            prompt: "It's ___ pen.",
            correct: "a",
            explanation: "Pen → consonant sound /p/ → a.",
          },
          {
            id: "e2q2",
            prompt: "He has ___ idea.",
            correct: "an",
            explanation: "Idea → vowel sound /aɪ/ → an.",
          },
          {
            id: "e2q3",
            prompt: "She wants ___ sandwich.",
            correct: "a",
            explanation: "Sandwich → consonant sound /s/ → a.",
          },
          {
            id: "e2q4",
            prompt: "I need ___ answer.",
            correct: "an",
            explanation: "Answer starts with a vowel sound /ɑː/ (silent \"w\") → an.",
          },
          {
            id: "e2q5",
            prompt: "This is ___ chair.",
            correct: "a",
            explanation: "Chair → consonant sound /tʃ/ → a.",
          },
          {
            id: "e2q6",
            prompt: "It's ___ egg.",
            correct: "an",
            explanation: "Egg → vowel sound /e/ → an.",
          },
          {
            id: "e2q7",
            prompt: "He is ___ teacher.",
            correct: "a",
            explanation: "Teacher → consonant sound /t/ → a.",
          },
          {
            id: "e2q8",
            prompt: "She has ___ office.",
            correct: "an",
            explanation: "Office → vowel sound /ɒ/ → an.",
          },
          {
            id: "e2q9",
            prompt: "I see ___ bird.",
            correct: "a",
            explanation: "Bird → consonant sound /b/ → a.",
          },
          {
            id: "e2q10",
            prompt: "We have ___ exam today.",
            correct: "an",
            explanation: "Exam → vowel sound /ɪ/ → an.",
          },
        ],
      },

      // EX 3: harder (sound rules: silent letters / /juː/)
      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Sound rules",
        instructions: "Choose a or an. Focus on pronunciation (sound), not spelling.",
        questions: [
          {
            id: "e3q1",
            prompt: "He is ___ honest man.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Honest has silent \"h\" → starts with a vowel sound → an.",
          },
          {
            id: "e3q2",
            prompt: "It's ___ hour.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Hour has silent \"h\" → /aʊ/ → an.",
          },
          {
            id: "e3q3",
            prompt: "She is ___ university student.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "University starts with /juː/ (y-sound) → a.",
          },
          {
            id: "e3q4",
            prompt: "I need ___ USB cable.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "USB is often said /juː-es-biː/ → starts with /j/ → a.",
          },
          {
            id: "e3q5",
            prompt: "He wants ___ European trip.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "European starts with /juː/ → a.",
          },
          {
            id: "e3q6",
            prompt: "She bought ___ one-way ticket.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "One starts with /w/ sound → a.",
          },
          {
            id: "e3q7",
            prompt: "It's ___ unusual day.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Unusual starts with a vowel sound /ʌ/ → an.",
          },
          {
            id: "e3q8",
            prompt: "This is ___ useful app.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "Useful starts with /juː/ → a.",
          },
          {
            id: "e3q9",
            prompt: "He is ___ actor.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Actor starts with a vowel sound /æ/ → an.",
          },
          {
            id: "e3q10",
            prompt: "She has ___ MBA.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "MBA starts with the sound /em/ → vowel sound → an.",
          },
        ],
      },

      // EX 4: sentence building (input)
      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the sentences",
        instructions: "Write a or an.",
        questions: [
          {
            id: "e4q1",
            prompt: "My brother is ___ doctor.",
            correct: "a",
            explanation: "Doctor → consonant sound /d/ → a.",
          },
          {
            id: "e4q2",
            prompt: "There is ___ airport near my city.",
            correct: "an",
            explanation: "Airport → vowel sound /eə/ → an.",
          },
          {
            id: "e4q3",
            prompt: "I want to buy ___ jacket.",
            correct: "a",
            explanation: "Jacket → consonant sound /dʒ/ → a.",
          },
          {
            id: "e4q4",
            prompt: "She is ___ English teacher.",
            correct: "an",
            explanation: "English starts with a vowel sound /ɪ/ → an.",
          },
          {
            id: "e4q5",
            prompt: "He has ___ small apartment.",
            correct: "a",
            explanation: "Small starts with /s/ → a.",
          },
          {
            id: "e4q6",
            prompt: "It's ___ interesting book.",
            correct: "an",
            explanation: "Interesting starts with /ɪ/ → an.",
          },
          {
            id: "e4q7",
            prompt: "I need ___ map.",
            correct: "a",
            explanation: "Map starts with /m/ → a.",
          },
          {
            id: "e4q8",
            prompt: "She wants ___ orange juice.",
            correct: "an",
            explanation: "Orange starts with a vowel sound → an.",
          },
          {
            id: "e4q9",
            prompt: "He is ___ tall man.",
            correct: "a",
            explanation: "Tall starts with /t/ → a.",
          },
          {
            id: "e4q10",
            prompt: "This is ___ easy question.",
            correct: "an",
            explanation: "Easy starts with /iː/ → an.",
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
        <span className="text-slate-700 font-medium">Articles: a / an</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Articles <span className="font-extrabold">— a / an</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>a</b> and <b>an</b> with singular countable nouns when you talk about something for the first time.
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

      <LessonBottomNav
        backHref="/grammar/a1"
        backLabel="All A1 topics"
        nextHref="/grammar/a1/plural-nouns"
        nextLabel="Plural Nouns"
        nextDescription="Regular & irregular plurals"
      />
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
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Articles — a / an</h2>
        <p className="text-slate-500 text-sm">Use before singular countable nouns. The choice depends on SOUND, not spelling.</p>
      </div>

      {/* 2 gradient cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔵</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">a — before consonant sounds</span>
          </div>
          <Formula parts={[
            { text: "a", color: "sky" },
            { dim: true },
            { text: "consonant sound", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="a dog (/d/ sound)" />
            <Ex en="a book (/b/ sound)" />
            <Ex en="a university (/juː/ sound)" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🟢</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">an — before vowel sounds</span>
          </div>
          <Formula parts={[
            { text: "an", color: "green" },
            { dim: true },
            { text: "vowel sound", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="an apple (/æ/ sound)" />
            <Ex en="an egg (/e/ sound)" />
            <Ex en="an hour (silent h → /aʊ/ sound)" />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Quick reference — a vs an</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-6 font-black text-sky-700">a + consonant sound</th>
                <th className="text-left py-2 font-black text-emerald-700">an + vowel sound</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["a dog", "an apple"],
                ["a book", "an egg"],
                ["a car", "an hour"],
                ["a house", "an idea"],
                ["a year", "an umbrella"],
              ].map(([a, an]) => (
                <tr key={a}>
                  <td className="py-2 pr-6 text-slate-700">{a}</td>
                  <td className="py-2 text-slate-700">{an}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sound rule exceptions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Tricky sound cases</h3>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Use AN (silent h)</p>
            <div className="space-y-2">
              <Ex en="an hour (h is silent)" />
              <Ex en="an honest man (h is silent)" />
            </div>
          </div>
          <div>
            <p className="text-xs font-black text-sky-700 uppercase tracking-widest mb-2">Use A (vowel letter, /juː/ sound)</p>
            <div className="space-y-2">
              <Ex en="a university (sounds like 'yu')" />
              <Ex en="a European (sounds like 'yu')" />
            </div>
          </div>
        </div>
      </div>

      {/* When to use a/an */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">When to use a / an</h3>
        </div>
        <div className="space-y-2">
          <Ex en="She's a doctor. (jobs)" />
          <Ex en="I have a cat. (singular countable nouns)" />
          <Ex en="It's a bird! (saying what something is)" />
        </div>
      </div>

      {/* Wrong vs right */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Wrong</p>
          <Ex en="a apple" correct={false} />
          <Ex en="an book" correct={false} />
          <Ex en="a hour" correct={false} />
          <Ex en="an university" correct={false} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Correct</p>
          <Ex en="an apple" />
          <Ex en="a book" />
          <Ex en="an hour" />
          <Ex en="a university" />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> It&apos;s the SOUND that matters, not the letter — &quot;an hour&quot; not &quot;a hour&quot; because the H is silent. Say the word aloud and trust your ear.
      </div>
    </div>
  );
}