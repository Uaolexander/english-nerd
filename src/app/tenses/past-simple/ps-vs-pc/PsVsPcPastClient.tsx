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
    title: "Exercise 1 — Completed vs in progress",
    instructions:
      "Past Simple = a completed action (it happened and finished). Past Continuous = an action in progress at a specific moment in the past. Clue: 'at 8pm', 'at that moment', 'while', 'when'.",
    questions: [
      { id: "1-1",  prompt: "I ___ TV when he called.",                            options: ["watched", "was watching", "watch", "am watching"],                    correctIndex: 1, explanation: "Action in progress when interrupted → Past Continuous: was watching." },
      { id: "1-2",  prompt: "She ___ her homework and then went to bed.",           options: ["was finishing", "finished", "finish", "finishes"],                   correctIndex: 1, explanation: "Completed action → Past Simple: finished." },
      { id: "1-3",  prompt: "At 9pm last night, they ___ dinner.",                  options: ["had", "were having", "have", "are having"],                          correctIndex: 1, explanation: "Action in progress at a specific time → Past Continuous: were having." },
      { id: "1-4",  prompt: "He ___ the window and jumped out.",                    options: ["was opening", "opened", "opens", "open"],                            correctIndex: 1, explanation: "Quick completed action → Past Simple: opened." },
      { id: "1-5",  prompt: "What ___ you ___ at midnight?",                        options: ["did … do", "were … doing", "do … do", "did … doing"],                 correctIndex: 1, explanation: "Action in progress at midnight → Past Continuous question: were you doing?" },
      { id: "1-6",  prompt: "She ___ her keys while she was running.",              options: ["was dropping", "dropped", "drop", "drops"],                          correctIndex: 1, explanation: "Short sudden action → Past Simple: dropped." },
      { id: "1-7",  prompt: "When I arrived, they ___ about their holiday.",        options: ["talked", "were talking", "talk", "are talking"],                     correctIndex: 1, explanation: "Action in progress when I arrived → Past Continuous: were talking." },
      { id: "1-8",  prompt: "He ___ the report and sent it to his manager.",        options: ["was finishing", "finished", "finish", "finishes"],                   correctIndex: 1, explanation: "Completed action → Past Simple: finished." },
      { id: "1-9",  prompt: "It ___ when we left the cinema.",                      options: ["rained", "was raining", "rain", "rains"],                            correctIndex: 1, explanation: "Weather as background context → Past Continuous: was raining." },
      { id: "1-10", prompt: "She ___ home, got changed, and went out.",             options: ["was coming", "came", "come", "comes"],                               correctIndex: 1, explanation: "Series of completed actions → Past Simple: came." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — 'when' and 'while'",
    instructions:
      "'when' usually introduces a short Past Simple event that interrupted an ongoing Continuous action. 'while' usually introduces the Continuous background action.",
    questions: [
      { id: "2-1",  prompt: "I was reading a book ___ the phone rang.",             options: ["while", "when", "during", "until"],                                  correctIndex: 1, explanation: "'when' + short interrupting action (Past Simple)." },
      { id: "2-2",  prompt: "___ she was cooking, the smoke alarm went off.",       options: ["When", "While", "Until", "Before"],                                  correctIndex: 1, explanation: "'While' + Continuous background; Past Simple interruption." },
      { id: "2-3",  prompt: "He broke his arm ___ he was skiing.",                  options: ["while", "when", "until", "after"],                                   correctIndex: 0, explanation: "'while' introduces the Continuous background (skiing)." },
      { id: "2-4",  prompt: "___ I was waiting, I saw an accident.",                options: ["While", "When", "Until", "Before"],                                  correctIndex: 0, explanation: "'While' + Continuous background." },
      { id: "2-5",  prompt: "They were having lunch ___ the news broke.",           options: ["when", "while", "until", "after"],                                   correctIndex: 0, explanation: "'when' + the interrupting event." },
      { id: "2-6",  prompt: "She dropped her phone ___ she was getting off the bus.", options: ["while", "when", "until", "before"],                               correctIndex: 0, explanation: "'while' + the Continuous situation." },
      { id: "2-7",  prompt: "___ I arrived at the party, everyone was dancing.",    options: ["While", "When", "Until", "Before"],                                  correctIndex: 1, explanation: "'When' introduces the point of arrival; Continuous describes what was happening." },
      { id: "2-8",  prompt: "We were watching TV ___ the power cut happened.",      options: ["when", "while", "until", "after"],                                   correctIndex: 0, explanation: "'when' + the interrupting event." },
      { id: "2-9",  prompt: "___ she was talking on the phone, she walked into a door.", options: ["While", "When", "Until", "Before"],                             correctIndex: 0, explanation: "'While' + Continuous background." },
      { id: "2-10", prompt: "I met my wife ___ we were studying at university.",    options: ["when", "while", "until", "after"],                                   correctIndex: 0, explanation: "'when' is natural here; 'while we were studying' is also possible." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Choosing the right tense",
    instructions:
      "Past Simple: for stories, sequences of events, and complete actions. Past Continuous: for background actions, setting the scene, simultaneous ongoing actions.",
    questions: [
      { id: "3-1",  prompt: "She ___ home, ___ a shower, and went to bed.",                         options: ["was coming / was having", "came / had", "come / have", "came / was having"],                   correctIndex: 1, explanation: "Series of completed sequential actions → Past Simple: came / had." },
      { id: "3-2",  prompt: "It ___ a beautiful day. The sun ___ and birds ___.",                   options: ["was / shone / sang", "was / was shining / were singing", "is / shines / sing", "was / shining / singing"], correctIndex: 1, explanation: "Setting a scene → Past Continuous: was / was shining / were singing." },
      { id: "3-3",  prompt: "He ___ his ankle while he ___ in the park.",                           options: ["twisted / was running", "was twisting / ran", "twist / run", "twisted / run"],                 correctIndex: 0, explanation: "Short completed action (twisted) while background Continuous (was running)." },
      { id: "3-4",  prompt: "The children ___ in bed when Santa ___.",                              options: ["slept / came", "were sleeping / came", "slept / was coming", "were sleeping / was coming"],    correctIndex: 1, explanation: "Background Continuous (were sleeping) + short past event (came)." },
      { id: "3-5",  prompt: "We ___ dinner when the guests ___ to arrive.",                         options: ["were cooking / started", "cooked / were starting", "cooked / started", "were cooking / were starting"], correctIndex: 0, explanation: "Background Continuous (were cooking) + short event (started)." },
      { id: "3-6",  prompt: "I ___ to music when I ___ a strange noise outside.",                   options: ["listened / heard", "was listening / heard", "listened / was hearing", "was listening / was hearing"], correctIndex: 1, explanation: "Continuous background + short past event." },
      { id: "3-7",  prompt: "He ___ three cups of coffee and ___ his presentation.",                options: ["was drinking / finished", "drank / finished", "drank / was finishing", "was drinking / was finishing"], correctIndex: 1, explanation: "Completed sequential actions → Past Simple: drank / finished." },
      { id: "3-8",  prompt: "While she ___ the washing up, he ___ the children to sleep.",          options: ["did / put", "was doing / was putting", "was doing / put", "did / was putting"],                 correctIndex: 1, explanation: "Two simultaneous ongoing background actions → both Past Continuous." },
      { id: "3-9",  prompt: "He ___ his keys and ___ the door.",                                    options: ["was finding / opened", "found / opened", "found / was opening", "was finding / was opening"],  correctIndex: 1, explanation: "Two quick completed sequential actions → Past Simple: found / opened." },
      { id: "3-10", prompt: "What ___ you ___ at this time yesterday?",                             options: ["did … do", "were … doing", "do … do", "did … doing"],                                           correctIndex: 1, explanation: "Action in progress at a specific past time → Continuous: were you doing?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed advanced",
    instructions:
      "All patterns combined. Think about: Was it a complete action or ongoing? A sequence or a background? Interrupted by something?",
    questions: [
      { id: "4-1",  prompt: "While I ___ for the bus, I ___ into my old teacher.",              options: ["waited / ran", "was waiting / ran", "waited / was running", "was waiting / was running"],      correctIndex: 1, explanation: "Background Continuous (waiting) + short completed event (ran into)." },
      { id: "4-2",  prompt: "She ___ up, ___ a shower, and left.",                              options: ["woke / took", "was waking / was taking", "woke / was taking", "was waking / took"],              correctIndex: 0, explanation: "Morning routine = sequence of completed actions." },
      { id: "4-3",  prompt: "It ___ when we ___ out of the cinema.",                            options: ["was raining / came", "rained / were coming", "was raining / were coming", "rained / came"],     correctIndex: 0, explanation: "Background weather (Continuous) + completed exit action (Simple)." },
      { id: "4-4",  prompt: "He ___ me while I ___ in the garden.",                             options: ["called / was working", "was calling / worked", "called / worked", "was calling / was working"], correctIndex: 0, explanation: "Short past event (called) + background Continuous (was working)." },
      { id: "4-5",  prompt: "Two people ___ loudly while the teacher ___ to explain.",          options: ["were talking / was trying", "talked / tried", "talked / was trying", "were talking / tried"],    correctIndex: 0, explanation: "Two simultaneous ongoing background actions." },
      { id: "4-6",  prompt: "I ___ the film three times already.",                              options: ["was seeing", "seen", "saw", "were seeing"],                                                       correctIndex: 2, explanation: "Completed action → Past Simple: saw." },
      { id: "4-7",  prompt: "She ___ at the table and ___ a letter.",                           options: ["sat / was writing", "was sitting / wrote", "sat / wrote", "was sitting / was writing"],         correctIndex: 2, explanation: "Sequential completed actions → Past Simple: sat / wrote." },
      { id: "4-8",  prompt: "I ___ you earlier but you didn't pick up.",                        options: ["was calling", "called", "call", "were calling"],                                                  correctIndex: 1, explanation: "Completed action → Past Simple: called." },
      { id: "4-9",  prompt: "They ___ a barbecue when it ___ to rain.",                         options: ["had / was starting", "were having / started", "had / started", "were having / was starting"],   correctIndex: 1, explanation: "Background Continuous (were having) + short event (started)." },
      { id: "4-10", prompt: "While she ___ in Paris, she ___ the Eiffel Tower every day.",      options: ["was living / visited", "lived / was visiting", "lived / visited", "was living / was visiting"],  correctIndex: 0, explanation: "Background Continuous frame (was living in Paris) + habitual Simple action (visited every day)." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Completed vs ongoing",
  2: "when vs while",
  3: "Right tense",
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

export default function PsVsPcPastClient() {
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
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-simple">Past Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">PS vs Continuous</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">vs Past Continuous</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B1</span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Intermediate</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          <b>Past Simple</b> = completed action. <b>Past Continuous</b> = action in progress. Master the difference with 40 multiple-choice questions.
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
                onClick={() => { setTab("exercises"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Exercises
              </button>
              <button
                onClick={() => { setTab("explanation"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
            href="/tenses/past-simple/did-didnt"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← did / didn&apos;t
          </a>
          <a
            href="/tenses/past-simple"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            ← Back to Past Simple
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Past Simple vs Past Continuous</h2>
        <p className="text-slate-500 text-sm">Two tenses, two purposes. Know when to use each one.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Past Simple card */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Past Simple</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "verb-ed / irregular", color: "yellow" }, { dim: true, text: "+" },
            { text: ".", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="She called." />
            <Ex en="He left." />
            <Ex en="They arrived." />
          </div>
        </div>

        {/* Past Continuous card */}
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Past Continuous</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "was/were", color: "yellow" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "green" }, { dim: true, text: "+" },
            { text: ".", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="She was calling." />
            <Ex en="He was leaving." />
            <Ex en="They were arriving." />
          </div>
        </div>

        {/* Key uses card */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔑</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Key Uses</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            <b>Simple</b> = complete actions, sequences.<br />
            <b>Continuous</b> = background, interrupted.
          </p>
        </div>
      </div>

      {/* Contrast table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">When to use each tense</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-emerald-600 pb-2 pr-4">Past Simple</th>
                <th className="text-left font-black text-red-500 pb-2">Past Continuous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { simple: "Completed action",       continuous: "Action in progress" },
                { simple: "Series of events",        continuous: "Background scene" },
                { simple: "Interrupted action",      continuous: "Ongoing when interrupted" },
              ].map(({ simple, continuous }) => (
                <tr key={simple}>
                  <td className="py-2 pr-4 text-slate-700">{simple}</td>
                  <td className="py-2 text-slate-700">{continuous}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* When / While pattern box */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">📌</span>
          <h3 className="font-black text-slate-900">when vs while pattern</h3>
        </div>
        <p className="text-sm text-slate-700 mb-3">
          <b>WHILE</b> + Continuous (background) → <b>WHEN</b> + Simple (interruption)
        </p>
        <Ex en="While she was sleeping, the phone rang." />
        <Ex en="I was reading when he arrived." />
      </div>

      {/* Amber warning */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠</span>
          <h3 className="font-black text-amber-800">Use was/were, not did, for Past Continuous questions and negatives!</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-1">Correct ✅</div>
            <div className="font-mono text-sm text-slate-800">Was he working?</div>
            <div className="font-mono text-sm text-slate-800">She wasn&apos;t sleeping.</div>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <div className="text-xs font-black text-red-600 uppercase tracking-wide mb-1">Wrong ❌</div>
            <div className="font-mono text-sm text-slate-500 line-through opacity-60">Did he be working?</div>
            <div className="font-mono text-sm text-slate-500 line-through opacity-60">She didn&apos;t sleeping.</div>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">⏰</span>
          <h3 className="font-black text-slate-900">Time expressions</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2">Past Simple</div>
            <div className="space-y-1 text-sm text-slate-700">
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5">yesterday</div>
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5">last night</div>
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5">in 2010</div>
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5">at 9am / then / after that</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-red-600 uppercase tracking-wide mb-2">Past Continuous</div>
            <div className="space-y-1 text-sm text-slate-700">
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-1.5">at this time yesterday</div>
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-1.5">while / when</div>
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-1.5">at 9pm</div>
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-1.5">all day / for two hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
