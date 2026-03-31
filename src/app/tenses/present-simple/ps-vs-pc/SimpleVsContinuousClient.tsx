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
    title: "Exercise 1 — Choose the correct form (clear context clues)",
    instructions:
      "Each sentence contains a time expression or context clue. Use Present Simple for habits, routines, facts, and permanent states. Use Present Continuous for actions happening right now or temporary situations.",
    questions: [
      {
        id: "1-1",
        prompt: "Look! She ___ in the park.",
        options: ["runs", "is running", "run", "running"],
        correctIndex: 1,
        explanation: "\"Look!\" signals an action happening right now → Present Continuous: is running.",
      },
      {
        id: "1-2",
        prompt: "I ___ to the gym every Monday.",
        options: ["am going", "go", "goes", "going"],
        correctIndex: 1,
        explanation: "\"Every Monday\" is a routine → Present Simple: go.",
      },
      {
        id: "1-3",
        prompt: "They ___ TV right now.",
        options: ["watch", "watches", "are watching", "is watching"],
        correctIndex: 2,
        explanation: "\"Right now\" signals an action in progress → Present Continuous: are watching.",
      },
      {
        id: "1-4",
        prompt: "Water ___ at 0°C.",
        options: ["is freezing", "freeze", "freezes", "froze"],
        correctIndex: 2,
        explanation: "Scientific fact / general truth → Present Simple: freezes.",
      },
      {
        id: "1-5",
        prompt: "He ___ on the phone at the moment.",
        options: ["talks", "talk", "is talking", "talking"],
        correctIndex: 2,
        explanation: "\"At the moment\" indicates an ongoing action → Present Continuous: is talking.",
      },
      {
        id: "1-6",
        prompt: "She usually ___ tea for breakfast.",
        options: ["is drinking", "are drinking", "drink", "drinks"],
        correctIndex: 3,
        explanation: "\"Usually\" marks a habit → Present Simple: drinks (she → +s).",
      },
      {
        id: "1-7",
        prompt: "Listen! Someone ___ on the door.",
        options: ["knocks", "knock", "is knocking", "knocked"],
        correctIndex: 2,
        explanation: "\"Listen!\" signals an action happening right now → Present Continuous: is knocking.",
      },
      {
        id: "1-8",
        prompt: "My father ___ as an engineer.",
        options: ["is working", "are working", "work", "works"],
        correctIndex: 3,
        explanation: "Permanent job/state → Present Simple: works (he → +s).",
      },
      {
        id: "1-9",
        prompt: "We ___ for the exam this week.",
        options: ["study", "studies", "is studying", "are studying"],
        correctIndex: 3,
        explanation: "\"This week\" indicates a temporary ongoing situation → Present Continuous: are studying.",
      },
      {
        id: "1-10",
        prompt: "The sun ___ in the west.",
        options: ["is setting", "set", "are setting", "sets"],
        correctIndex: 3,
        explanation: "General truth / fact of nature → Present Simple: sets.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Stative vs active meaning",
    instructions:
      "Some verbs (have, think, taste, see, look…) can be EITHER stative OR active depending on the meaning. Stative meaning → Present Simple. Active / physical meaning → Present Continuous. Read the context carefully!",
    questions: [
      {
        id: "2-1",
        prompt: "She ___ a beautiful house in the countryside.",
        options: ["is having", "have", "has", "are having"],
        correctIndex: 2,
        explanation: "\"Have\" = possession (stative) → Present Simple: has. Compare: She's having a party. (= activity)",
      },
      {
        id: "2-2",
        prompt: "They ___ dinner right now. Please don't disturb them.",
        options: ["have", "has", "is having", "are having"],
        correctIndex: 3,
        explanation: "\"Have dinner\" = activity (non-stative) → Present Continuous: are having. Compare: She has a car. (= possession)",
      },
      {
        id: "2-3",
        prompt: "I ___ this is a great idea!",
        options: ["am thinking", "thinks", "think", "is thinking"],
        correctIndex: 2,
        explanation: "\"Think\" = opinion (stative) → Present Simple: think. Compare: I'm thinking about it. (= mental process in progress)",
      },
      {
        id: "2-4",
        prompt: "She ___ about changing her job at the moment.",
        options: ["thinks", "think", "are thinking", "is thinking"],
        correctIndex: 3,
        explanation: "\"Think about\" = active mental process in progress → Present Continuous: is thinking. Compare: I think you're right. (= opinion)",
      },
      {
        id: "2-5",
        prompt: "This coffee ___ really bitter.",
        options: ["is tasting", "taste", "tastes", "are tasting"],
        correctIndex: 2,
        explanation: "\"Taste\" = flavour / sensation (stative) → Present Simple: tastes. Compare: The chef is tasting the soup. (= deliberate action)",
      },
      {
        id: "2-6",
        prompt: "The chef ___ the sauce to see if it needs more salt.",
        options: ["tastes", "taste", "is tasting", "are tasting"],
        correctIndex: 2,
        explanation: "\"Taste\" = deliberate physical action → Present Continuous: is tasting. Compare: This tastes great. (= sensation)",
      },
      {
        id: "2-7",
        prompt: "I ___ what you mean. That makes sense.",
        options: ["am seeing", "sees", "see", "is seeing"],
        correctIndex: 2,
        explanation: "\"See\" = understand (stative) → Present Simple: see. Compare: She's seeing a doctor. (= visiting / meeting)",
      },
      {
        id: "2-8",
        prompt: "He ___ a shower right now — he'll call you back in a minute.",
        options: ["has", "have", "are having", "is having"],
        correctIndex: 3,
        explanation: "\"Have a shower\" = activity (non-stative) → Present Continuous: is having. Compare: He has a car. (= possession)",
      },
      {
        id: "2-9",
        prompt: "You ___ tired. Did you sleep well last night?",
        options: ["are looking", "look", "looks", "is looking"],
        correctIndex: 1,
        explanation: "\"Look\" = appearance (stative) → Present Simple: look. Compare: She's looking out of the window. (= deliberate action)",
      },
      {
        id: "2-10",
        prompt: "He ___ a great time at the party — look at him dance!",
        options: ["has", "have", "are having", "is having"],
        correctIndex: 3,
        explanation: "\"Have a great time\" = activity / experience → Present Continuous: is having. Compare: He has two sisters. (= possession/fact)",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Permanent vs temporary",
    instructions:
      "Some sentences describe both a permanent situation (Simple) and a temporary one (Continuous). Choose the correct form for each blank, paying attention to whether the situation is a permanent fact or a temporary arrangement.",
    questions: [
      {
        id: "3-1",
        prompt: "He usually ___ in Rome, but this year he ___ in London.",
        options: ["lives / is living", "is living / lives", "lives / lives", "is living / is living"],
        correctIndex: 0,
        explanation: "Permanent home → Simple (lives); temporary arrangement this year → Continuous (is living).",
      },
      {
        id: "3-2",
        prompt: "I ___ as a teacher but this week I ___ a training course.",
        options: ["am working / attend", "work / am attending", "work / attend", "am working / am attending"],
        correctIndex: 1,
        explanation: "Permanent job → Simple (work); temporary situation this week → Continuous (am attending).",
      },
      {
        id: "3-3",
        prompt: "She normally ___ to work but today she ___ the bus.",
        options: ["drives / is taking", "is driving / takes", "drives / takes", "is driving / is taking"],
        correctIndex: 0,
        explanation: "Normal routine → Simple (drives); today's exception → Continuous (is taking).",
      },
      {
        id: "3-4",
        prompt: "He ___ French, but this month he ___ Spanish too.",
        options: ["teaches / is teaching", "is teaching / teaches", "teaches / teaches", "is teaching / is teaching"],
        correctIndex: 0,
        explanation: "Permanent job → Simple (teaches); extra temporary duty → Continuous (is teaching).",
      },
      {
        id: "3-5",
        prompt: "They ___ in a big house, but right now they ___ in a small flat while it's being repaired.",
        options: ["live / are staying", "are living / stay", "live / stay", "are living / are staying"],
        correctIndex: 0,
        explanation: "Permanent residence → Simple (live); temporary arrangement → Continuous (are staying).",
      },
      {
        id: "3-6",
        prompt: "My sister ___ at the city hospital, but this week she ___ at a clinic downtown.",
        options: ["works / is working", "is working / works", "works / works", "is working / is working"],
        correctIndex: 0,
        explanation: "Permanent place of work → Simple (works); temporary this week → Continuous (is working).",
      },
      {
        id: "3-7",
        prompt: "He always ___ the newspaper in the morning, but today he ___ a magazine.",
        options: ["reads / is reading", "is reading / reads", "reads / reads", "is reading / is reading"],
        correctIndex: 0,
        explanation: "Habit with \"always\" → Simple (reads); today's exception → Continuous (is reading).",
      },
      {
        id: "3-8",
        prompt: "We ___ at home on Sundays, but this Sunday we ___ to a restaurant.",
        options: ["eat / are going", "are eating / go", "eat / go", "are eating / are going"],
        correctIndex: 0,
        explanation: "Regular Sunday habit → Simple (eat); a specific future arrangement → Continuous (are going).",
      },
      {
        id: "3-9",
        prompt: "She ___ maths at a secondary school, but this term she ___ a new curriculum.",
        options: ["teaches / is testing", "is teaching / tests", "teaches / tests", "is teaching / is testing"],
        correctIndex: 0,
        explanation: "Permanent job → Simple (teaches); temporary this term → Continuous (is testing).",
      },
      {
        id: "3-10",
        prompt: "He ___ his own business, but currently he ___ for a startup as a consultant.",
        options: ["runs / is working", "is running / works", "runs / works", "is running / is working"],
        correctIndex: 0,
        explanation: "Permanent fact → Simple (runs); temporary consulting role → Continuous (is working).",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed advanced",
    instructions:
      "A mixed set testing all contrasts: stative verbs, now vs always, temporary vs permanent, and tricky meaning changes depending on the tense. Choose the best answer for each sentence.",
    questions: [
      {
        id: "4-1",
        prompt: "I ___ coffee. (habit)",
        options: ["am drinking", "drink", "drinks", "is drinking"],
        correctIndex: 1,
        explanation: "Habitual action → Present Simple: drink.",
      },
      {
        id: "4-2",
        prompt: "I ___ coffee right now.",
        options: ["drink", "drinks", "am drinking", "is drinking"],
        correctIndex: 2,
        explanation: "\"Right now\" = action in progress → Present Continuous: am drinking.",
      },
      {
        id: "4-3",
        prompt: "I ___ you're right. (opinion)",
        options: ["am thinking", "thinks", "is thinking", "think"],
        correctIndex: 3,
        explanation: "\"Think\" used as a stative (= have an opinion) → Present Simple: think.",
      },
      {
        id: "4-4",
        prompt: "I ___ about the problem right now. (active mental process)",
        options: ["think", "thinks", "am thinking", "is thinking"],
        correctIndex: 2,
        explanation: "\"Think about\" as an active process happening now is acceptable in Continuous: am thinking.",
      },
      {
        id: "4-5",
        prompt: "Prices ___ these days.",
        options: ["rise", "rises", "is rising", "are rising"],
        correctIndex: 3,
        explanation: "Changing/developing situation → Present Continuous: are rising.",
      },
      {
        id: "4-6",
        prompt: "___ you understand the instructions?",
        options: ["Are", "Is", "Do", "Does"],
        correctIndex: 2,
        explanation: "\"Understand\" is stative → question uses Present Simple: Do you understand?",
      },
      {
        id: "4-7",
        prompt: "We ___ them on Saturday. (arrangement)",
        options: ["meet", "meets", "is meeting", "are meeting"],
        correctIndex: 3,
        explanation: "Future arrangement → Present Continuous: are meeting.",
      },
      {
        id: "4-8",
        prompt: "The Earth ___ around the sun.",
        options: ["is orbiting", "orbit", "are orbiting", "orbits"],
        correctIndex: 3,
        explanation: "Scientific fact / general truth → Present Simple: orbits.",
      },
      {
        id: "4-9",
        prompt: "She ___ in Paris. (permanent)",
        options: ["is living", "are living", "live", "lives"],
        correctIndex: 3,
        explanation: "Permanent state → Present Simple: lives (she → +s).",
      },
      {
        id: "4-10",
        prompt: "He ___ in Paris for a few months. (temporary)",
        options: ["lives", "live", "is living", "are living"],
        correctIndex: 2,
        explanation: "\"For a few months\" = temporary situation → Present Continuous: is living.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Context Clues",
  2: "Stative Verbs",
  3: "Perm vs Temp",
  4: "Mixed",
};

/* ─── Helper components ─────────────────────────────────────────────────── */

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

export default function SimpleVsContinuousClient() {
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

  function handleCheck() {
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
          <span className="text-slate-700 font-medium">Simple vs Continuous</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">vs Continuous</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">
              Medium
            </span>
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">
              A2
            </span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Master the difference between <b>Present Simple</b> and <b>Present Continuous</b> with 40 multiple choice questions across four sets: context clues, stative verbs, permanent vs temporary, and advanced mixed.
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
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => switchSet(n)}
                    title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                      exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
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
                          onClick={handleCheck}
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
                <Explanation Formula={Formula} Ex={Ex} />
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
            href="/tenses/present-simple/do-dont-do-i"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← do / does
          </a>
          <a
            href="/tenses/present-simple/ps-pc-advanced"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Advanced Mixed →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

function Explanation({
  Formula,
  Ex,
}: {
  Formula: (props: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) => React.JSX.Element;
  Ex: (props: { en: string }) => React.JSX.Element;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">
          Present Simple vs Present Continuous
        </h2>
        <p className="text-slate-500 text-sm">
          Two tenses — two different perspectives on time. Learn when to use each.
        </p>
      </div>

      {/* Two gradient cards side by side */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Present Simple card */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">
              Present Simple
            </span>
          </div>
          <div className="space-y-2 mb-3">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wide mb-1">
              Affirmative
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "verb (+s/es)", color: "green" },
              ]}
            />
            <div className="text-xs font-black text-slate-500 uppercase tracking-wide mt-2 mb-1">
              Negative
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "don't / doesn't", color: "red" },
                { dim: true, text: "+" },
                { text: "verb", color: "green" },
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <Ex en="She drinks coffee every morning." />
            <Ex en="Water boils at 100°C." />
            <Ex en="He lives in London." />
          </div>
        </div>

        {/* Present Continuous card */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">
              Present Continuous
            </span>
          </div>
          <div className="space-y-2 mb-3">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wide mb-1">
              Affirmative
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "am/is/are", color: "violet" },
                { dim: true, text: "+" },
                { text: "verb + -ing", color: "yellow" },
              ]}
            />
            <div className="text-xs font-black text-slate-500 uppercase tracking-wide mt-2 mb-1">
              Negative
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "am/is/are not", color: "red" },
                { dim: true, text: "+" },
                { text: "verb + -ing", color: "yellow" },
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <Ex en="She is talking on the phone." />
            <Ex en="I'm staying at a hotel this week." />
            <Ex en="Prices are rising." />
          </div>
        </div>
      </div>

      {/* When to use comparison table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">
            📋
          </span>
          <h3 className="font-black text-slate-900">When to use each tense</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-emerald-600 pb-2 pr-4">
                  ✅ Present Simple
                </th>
                <th className="text-left font-black text-sky-600 pb-2">
                  🔄 Present Continuous
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Habits & routines", "Actions happening RIGHT NOW"],
                ["General truths / facts", "Temporary situations"],
                ["Permanent states", "Changing / developing situations"],
                ["Stative verbs (always!)", "Future arrangements"],
              ].map(([simple, continuous], i) => (
                <tr key={i}>
                  <td className="py-2.5 pr-4 text-slate-700">
                    <span className="text-emerald-600 font-bold mr-1.5">•</span>
                    {simple}
                  </td>
                  <td className="py-2.5 text-slate-700">
                    <span className="text-sky-600 font-bold mr-1.5">•</span>
                    {continuous}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
            <div className="text-xs font-black text-emerald-700 mb-1">Simple examples</div>
            <div className="text-sm text-slate-700 italic">She teaches maths. (job)</div>
            <div className="text-sm text-slate-700 italic">I work at a hospital. (permanent)</div>
          </div>
          <div className="rounded-xl bg-sky-50 border border-sky-100 px-3 py-2">
            <div className="text-xs font-black text-sky-700 mb-1">Continuous examples</div>
            <div className="text-sm text-slate-700 italic">She is teaching a new class this term. (temporary)</div>
            <div className="text-sm text-slate-700 italic">We are meeting them on Saturday. (arrangement)</div>
          </div>
        </div>
      </div>

      {/* Stative verbs amber warning */}
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠</span>
          <h3 className="font-black text-amber-800">Stative verbs — NEVER use in Continuous!</h3>
        </div>
        <p className="text-sm text-amber-700 mb-4">
          These verbs describe states, feelings, possession, or mental processes. They are always used in Present Simple, even when talking about right now.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {[
            "know", "want", "like", "love", "hate",
            "believe", "understand", "own", "belong",
            "seem", "need", "prefer", "remember",
            "forget", "mean", "cost", "contain",
          ].map((verb) => (
            <div
              key={verb}
              className="rounded-lg bg-white border border-amber-200 px-2.5 py-1.5 text-center text-sm font-black text-amber-800"
            >
              {verb}
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="rounded-xl bg-white border border-amber-200 px-3 py-2">
            <span className="text-emerald-600 font-black text-xs mr-2">✅</span>
            <span className="text-sm font-semibold text-slate-900">I know the answer.</span>
            <span className="ml-2 text-xs text-slate-500">(NOT: I am knowing…)</span>
          </div>
          <div className="rounded-xl bg-white border border-amber-200 px-3 py-2">
            <span className="text-emerald-600 font-black text-xs mr-2">✅</span>
            <span className="text-sm font-semibold text-slate-900">She loves chocolate.</span>
            <span className="ml-2 text-xs text-slate-500">(NOT: She is loving…)</span>
          </div>
          <div className="rounded-xl bg-white border border-amber-200 px-3 py-2">
            <span className="text-emerald-600 font-black text-xs mr-2">✅</span>
            <span className="text-sm font-semibold text-slate-900">This bag belongs to me.</span>
            <span className="ml-2 text-xs text-slate-500">(NOT: This bag is belonging…)</span>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">
            🕐
          </span>
          <h3 className="font-black text-slate-900">Time expression clues</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2">
              Present Simple
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "always", "usually", "often", "sometimes",
                "rarely", "never", "every day", "every week",
                "on Mondays", "in the morning", "at 7 o'clock",
              ].map((expr) => (
                <span
                  key={expr}
                  className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                >
                  {expr}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-sky-700 uppercase tracking-wide mb-2">
              Present Continuous
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "now", "right now", "at the moment",
                "currently", "today", "this week",
                "this month", "this year", "look!", "listen!", "at present",
              ].map((expr) => (
                <span
                  key={expr}
                  className="rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-800"
                >
                  {expr}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contrast examples */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">
            ↔
          </span>
          <h3 className="font-black text-slate-900">Contrast: same verb, different meaning</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              simple: "I drink coffee.",
              simpleNote: "habit",
              continuous: "I'm drinking coffee.",
              continuousNote: "right now",
            },
            {
              simple: "He lives in Paris.",
              simpleNote: "permanent",
              continuous: "He's living in Paris.",
              continuousNote: "temporary",
            },
            {
              simple: "She teaches maths.",
              simpleNote: "her job",
              continuous: "She's teaching a new class this term.",
              continuousNote: "temporary",
            },
            {
              simple: "I think you're right.",
              simpleNote: "opinion (stative)",
              continuous: "I'm thinking about it.",
              continuousNote: "active process",
            },
          ].map(({ simple, simpleNote, continuous, continuousNote }, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-2">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wide mb-1">
                  Simple — {simpleNote}
                </div>
                <div className="font-semibold text-slate-900 text-sm italic">{simple}</div>
              </div>
              <div className="rounded-xl bg-sky-50 border border-sky-200 px-3 py-2.5">
                <div className="text-xs font-black text-sky-600 uppercase tracking-wide mb-1">
                  Continuous — {continuousNote}
                </div>
                <div className="font-semibold text-slate-900 text-sm italic">{continuous}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
