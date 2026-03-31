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
    title: "Exercise 1 — Habits vs right now",
    instructions:
      "Present Simple = habits, routines, facts. Present Continuous = actions happening right now. Time expressions help: always/usually/every day = Simple; now/at the moment/currently = Continuous.",
    questions: [
      { id: "1-1", prompt: "She ___ to work every day.", options: ["is walking", "walks", "walk", "are walking"], correctIndex: 1, explanation: "\"Every day\" = habit → Present Simple: walks." },
      { id: "1-2", prompt: "He ___ a report right now — don't disturb him.", options: ["writes", "write", "is writing", "are writing"], correctIndex: 2, explanation: "\"Right now\" → Present Continuous: is writing." },
      { id: "1-3", prompt: "I usually ___ tea for breakfast.", options: ["am drinking", "drink", "drinks", "is drinking"], correctIndex: 1, explanation: "\"Usually\" = habit → Present Simple: drink." },
      { id: "1-4", prompt: "Look! The baby ___.", options: ["smiles", "smile", "is smiling", "are smiling"], correctIndex: 2, explanation: "\"Look!\" signals right now → Present Continuous: is smiling." },
      { id: "1-5", prompt: "They ___ football every Saturday.", options: ["are playing", "is playing", "plays", "play"], correctIndex: 3, explanation: "\"Every Saturday\" = routine → Present Simple: play." },
      { id: "1-6", prompt: "She ___ on the phone at the moment.", options: ["talks", "talk", "is talking", "are talking"], correctIndex: 2, explanation: "\"At the moment\" → Present Continuous: is talking." },
      { id: "1-7", prompt: "Water ___ at 100°C.", options: ["is boiling", "are boiling", "boil", "boils"], correctIndex: 3, explanation: "Scientific fact → Present Simple: boils." },
      { id: "1-8", prompt: "I ___ for the bus. It's late.", options: ["wait", "waits", "am waiting", "are waiting"], correctIndex: 2, explanation: "Action in progress now → Present Continuous: am waiting." },
      { id: "1-9", prompt: "He ___ three languages.", options: ["is speaking", "are speaking", "speaks", "speak"], correctIndex: 2, explanation: "Ability = permanent fact → Present Simple: speaks." },
      { id: "1-10", prompt: "What ___ you ___ right now?", options: ["do … do", "are … doing", "does … do", "is … doing"], correctIndex: 1, explanation: "\"Right now\" → Continuous question: What are you doing?" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Temporary vs permanent",
    instructions:
      "Present Continuous can describe a temporary situation (currently, this week, this year), while Present Simple describes permanent or long-term states.",
    questions: [
      { id: "2-1", prompt: "She usually ___ in London, but this month she ___ in Paris.", options: ["lives / is working", "is living / works", "lives / works", "is living / is working"], correctIndex: 0, explanation: "\"Usually\" = permanent → Simple; \"this month\" = temporary → Continuous: lives / is working." },
      { id: "2-2", prompt: "I ___ French at university. It's my major.", options: ["am studying", "study", "studies", "is studying"], correctIndex: 1, explanation: "Long-term/permanent study → Present Simple: study." },
      { id: "2-3", prompt: "He ___ harder this semester. He wants to pass.", options: ["works", "work", "is working", "are working"], correctIndex: 2, explanation: "\"This semester\" = temporary change → Present Continuous: is working." },
      { id: "2-4", prompt: "___ you ___ anything special this evening?", options: ["Do … do", "Are … doing", "Does … do", "Is … doing"], correctIndex: 1, explanation: "Future arrangement → Present Continuous question: Are you doing?" },
      { id: "2-5", prompt: "She ___ for a new flat — she hates her current one.", options: ["looks", "look", "is looking", "are looking"], correctIndex: 2, explanation: "Temporary ongoing activity → Present Continuous: is looking." },
      { id: "2-6", prompt: "He ___ as a waiter, but he's looking for a better job.", options: ["works", "is working", "work", "are working"], correctIndex: 1, explanation: "Temporary job (implied) → Present Continuous: is working. Also \"works\" is acceptable but Continuous stresses temporariness." },
      { id: "2-7", prompt: "I ___ a great book this week — I can't put it down.", options: ["read", "reads", "is reading", "am reading"], correctIndex: 3, explanation: "\"This week\" = temporary → Present Continuous: am reading." },
      { id: "2-8", prompt: "They ___ in a big house. They've lived there for years.", options: ["are living", "live", "lives", "is living"], correctIndex: 1, explanation: "\"For years\" = permanent/long-term → Present Simple: live." },
      { id: "2-9", prompt: "She normally ___ the 8am train, but today she ___ a taxi.", options: ["takes / is taking", "is taking / takes", "take / take", "takes / takes"], correctIndex: 0, explanation: "\"Normally\" = habit → Simple; today's exception → Continuous: takes / is taking." },
      { id: "2-10", prompt: "My sister ___ as a doctor. She qualified last year.", options: ["is working", "work", "works", "are working"], correctIndex: 2, explanation: "Permanent profession → Present Simple: works." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Time expression clues",
    instructions:
      "Look at the time expression. It tells you which tense to use:\n• Simple: always, usually, often, sometimes, never, every day/week, on Mondays\n• Continuous: now, at the moment, currently, today, this week/month/year, Look!, Listen!",
    questions: [
      { id: "3-1", prompt: "Listen! Someone ___ the piano.", options: ["plays", "play", "is playing", "are playing"], correctIndex: 2, explanation: "\"Listen!\" = right now → Present Continuous: is playing." },
      { id: "3-2", prompt: "I ___ the gym three times a week.", options: ["am going", "goes", "is going", "go"], correctIndex: 3, explanation: "\"Three times a week\" = routine → Present Simple: go." },
      { id: "3-3", prompt: "She ___ dinner tonight. It smells amazing.", options: ["cooks", "cook", "is cooking", "are cooking"], correctIndex: 2, explanation: "\"Tonight\" (in progress) → Present Continuous: is cooking." },
      { id: "3-4", prompt: "He ___ never ___ vegetables. He hates them.", options: ["is … eating", "does … eat", "does … eats", "is … eat"], correctIndex: 1, explanation: "\"Never\" = habitual fact → Present Simple negative: doesn't eat." },
      { id: "3-5", prompt: "They ___ a new restaurant downtown this year.", options: ["open", "opens", "are opening", "is opening"], correctIndex: 2, explanation: "\"This year\" = current/temporary plan → Present Continuous: are opening." },
      { id: "3-6", prompt: "I ___ always ___ my coffee black.", options: ["am … drinking", "do … drink", "does … drink", "is … drinking"], correctIndex: 1, explanation: "\"Always\" = habit → Present Simple: I always drink." },
      { id: "3-7", prompt: "She ___ currently ___ a report for her boss.", options: ["does … write", "is … writing", "does … writing", "is … write"], correctIndex: 1, explanation: "\"Currently\" → Present Continuous: is writing." },
      { id: "3-8", prompt: "On Sundays, we ___ to my grandparents' house.", options: ["are going", "is going", "goes", "go"], correctIndex: 3, explanation: "\"On Sundays\" = regular habit → Present Simple: go." },
      { id: "3-9", prompt: "Look at them! They ___ in the park.", options: ["run", "runs", "are running", "is running"], correctIndex: 2, explanation: "\"Look!\" = right now → Present Continuous: are running." },
      { id: "3-10", prompt: "He ___ at this company for 10 years already.", options: ["works", "is working", "work", "working"], correctIndex: 0, explanation: "Long-term permanent state → Present Simple: works." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed (advanced)",
    instructions:
      "Apply all the rules: habits vs now, temporary vs permanent, stative verbs, and time expressions.",
    questions: [
      { id: "4-1", prompt: "She ___ better today — she was ill yesterday.", options: ["feels", "is feeling", "feel", "are feeling"], correctIndex: 1, explanation: "Temporary improvement → Present Continuous: is feeling better." },
      { id: "4-2", prompt: "Cats ___ a lot. It's their nature.", options: ["are sleeping", "is sleeping", "sleeps", "sleep"], correctIndex: 3, explanation: "General fact about cats → Present Simple: sleep." },
      { id: "4-3", prompt: "I ___ you! You're making a mistake.", options: ["am warning", "warn", "warns", "is warning"], correctIndex: 0, explanation: "Action happening right now → Present Continuous: am warning." },
      { id: "4-4", prompt: "The company ___ a lot of money at the moment due to the recession.", options: ["loses", "lose", "is losing", "are losing"], correctIndex: 2, explanation: "\"At the moment\" = temporary → Present Continuous: is losing." },
      { id: "4-5", prompt: "She ___ very well — she must practice every day.", options: ["is singing", "sings", "sing", "are singing"], correctIndex: 1, explanation: "Permanent ability/fact → Present Simple: sings." },
      { id: "4-6", prompt: "What time ___ the film ___ tonight?", options: ["is … starting", "does … start", "does … starts", "is … start"], correctIndex: 1, explanation: "Scheduled event (timetable) → Present Simple: does it start." },
      { id: "4-7", prompt: "More and more people ___ to cities these days.", options: ["move", "moves", "are moving", "is moving"], correctIndex: 2, explanation: "\"These days\" = ongoing trend → Present Continuous: are moving." },
      { id: "4-8", prompt: "I ___ to agree with you on this one.", options: ["am tending", "tend", "tends", "is tending"], correctIndex: 1, explanation: "\"Tend\" = general pattern → Present Simple: tend." },
      { id: "4-9", prompt: "The weather ___ much better this summer.", options: ["gets", "get", "is getting", "are getting"], correctIndex: 2, explanation: "\"This summer\" = current temporary trend → Present Continuous: is getting." },
      { id: "4-10", prompt: "He ___ his teeth three times a day.", options: ["is brushing", "are brushing", "brushes", "brush"], correctIndex: 2, explanation: "\"Three times a day\" = habit → Present Simple: brushes." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Habits vs Now",
  2: "Temp vs Perm",
  3: "Time Clues",
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

export default function PsVsPcClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-continuous">Present Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Simple vs Continuous</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Simple vs Continuous</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700 border border-blue-200">Intermediate</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">B1</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Choose between <b>Present Simple</b> (habits, facts) and <b>Present Continuous</b> (now, temporary). 40 multiple-choice questions in four sets.
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
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{current.instructions}</p>

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
            href="/tenses/present-continuous/stative-verbs"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Stative Verbs
          </a>
          <a
            href="/tenses/present-continuous/ps-pc-advanced"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Advanced Mix →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Present Simple vs Present Continuous</h2>
        <p className="text-slate-500 text-sm">Two tenses, two uses — learn the difference and the time expression clues.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Present Simple</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "verb(s)", color: "yellow" }, { dim: true, text: "+" },
            { text: "every day", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="She walks to work." />
            <Ex en="He speaks French." />
            <Ex en="Water boils at 100°C." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">▶</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Present Continuous</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "am/is/are", color: "yellow" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "green" }, { dim: true, text: "+" },
            { text: "now", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="She is walking to work." />
            <Ex en="He is speaking French." />
            <Ex en="Water is boiling — watch out!" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚖</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Key Difference</span>
          </div>
          <div className="mt-2 space-y-2.5 text-sm">
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
              <span className="font-black text-emerald-700">Simple</span>
              <span className="text-slate-600 ml-2">= permanent / habitual</span>
            </div>
            <div className="rounded-lg bg-sky-50 border border-sky-200 px-3 py-2">
              <span className="font-black text-sky-700">Continuous</span>
              <span className="text-slate-600 ml-2">= temporary / in progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contrast table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Simple vs Continuous — contrast pairs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-emerald-600 pb-2 pr-6">Present Simple</th>
                <th className="text-left font-black text-sky-600 pb-2">Present Continuous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["She lives in Paris. (permanent)", "She's living in Paris. (temporary)"],
                ["I work as a teacher.", "I'm working on a project."],
                ["He drives to work. (habit)", "He's driving right now. (now)"],
                ["They play tennis on Fridays.", "They're playing tennis at the moment."],
              ].map(([simple, cont]) => (
                <tr key={simple}>
                  <td className="py-2 pr-6 font-mono text-slate-700">{simple}</td>
                  <td className="py-2 font-mono text-slate-700">{cont}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Amber warning */}
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ Stative verbs</b> (know, want, love, believe, own...) are <b>NEVER used in continuous</b>:<br />
          <span className="font-mono">I know</span> ✅ &nbsp;/&nbsp; <span className="font-mono line-through opacity-60">I am knowing</span> ❌
        </div>
      </div>

      {/* Time expressions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">🕐</span>
          <h3 className="font-black text-slate-900">Time expression clues</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Present Simple</div>
            <div className="flex flex-wrap gap-1.5">
              {["always", "usually", "often", "sometimes", "never", "every day", "on Mondays", "generally", "in general"].map((t) => (
                <span key={t} className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-800">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-sky-700 uppercase tracking-widest mb-2">Present Continuous</div>
            <div className="flex flex-wrap gap-1.5">
              {["now", "at the moment", "currently", "today", "this week", "Look!", "Listen!", "these days", "still"].map((t) => (
                <span key={t} className="rounded-lg bg-sky-50 border border-sky-200 px-2 py-1 text-xs font-semibold text-sky-800">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
