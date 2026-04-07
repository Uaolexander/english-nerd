"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import PresentContinuousGameSection from "../PresentContinuousGameSection";

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
    title: "Exercise 1 — Future arrangements",
    instructions:
      "Present Continuous describes definite future plans or arrangements already made. These are usually personal plans with someone else involved.",
    questions: [
      { id: "1-1", prompt: "I ___ my dentist tomorrow. It's booked.", options: ["see", "am seeing", "will see", "sees"], correctIndex: 1, explanation: "Arranged appointment → Present Continuous: am seeing." },
      { id: "1-2", prompt: "They ___ to Paris next week. Flights are booked.", options: ["travel", "are travelling", "will travel", "travels"], correctIndex: 1, explanation: "Definite plan → Present Continuous: are travelling." },
      { id: "1-3", prompt: "She ___ a job interview this Friday.", options: ["has", "have", "is having", "are having"], correctIndex: 2, explanation: "Arranged future event → Present Continuous: is having." },
      { id: "1-4", prompt: "We ___ dinner with the Smiths on Saturday.", options: ["have", "had", "are having", "will having"], correctIndex: 2, explanation: "Social arrangement → Present Continuous: are having." },
      { id: "1-5", prompt: "He ___ early tomorrow — his train is at 6am.", options: ["leave", "leaves", "is leaving", "will leaving"], correctIndex: 2, explanation: "Personal plan/arrangement → Present Continuous: is leaving." },
      { id: "1-6", prompt: "What ___ you ___ this weekend?", options: ["do … do", "are … doing", "does … do", "will … do"], correctIndex: 1, explanation: "Asking about plans → Present Continuous: are you doing." },
      { id: "1-7", prompt: "I'm sorry, I can't meet then. I ___ my parents that evening.", options: ["visit", "am visiting", "visited", "visits"], correctIndex: 1, explanation: "Fixed arrangement → Present Continuous: am visiting." },
      { id: "1-8", prompt: "The president ___ the country on Monday.", options: ["leaves", "leave", "is leaving", "are leaving"], correctIndex: 2, explanation: "Scheduled/arranged departure → Present Continuous: is leaving." },
      { id: "1-9", prompt: "My sister ___ a baby in June.", options: ["has", "have", "is having", "are having"], correctIndex: 2, explanation: "Known future event → Present Continuous: is having." },
      { id: "1-10", prompt: "___ you ___ anything after class today?", options: ["Do … do", "Are … doing", "Does … do", "Is … doing"], correctIndex: 1, explanation: "Asking about immediate future plans → Present Continuous: Are you doing?" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — 'always' + Continuous for irritation",
    instructions:
      "\"Always\" normally goes with Present Simple. But \"always\" + Present Continuous expresses annoyance or criticism about a repeated behaviour: She's always leaving her things everywhere!",
    questions: [
      { id: "2-1", prompt: "He ___ always ___ his keys. It drives me mad!", options: ["does … lose", "is … losing", "does … losing", "is … lose"], correctIndex: 1, explanation: "\"always\" + Continuous = annoying habit: is always losing." },
      { id: "2-2", prompt: "She ___ to the gym every morning. (neutral habit)", options: ["is going", "goes", "go", "are going"], correctIndex: 1, explanation: "Neutral routine → Simple: goes (NOT continuous here — no irritation)." },
      { id: "2-3", prompt: "You ___ always ___ late! Why can't you be on time?", options: ["do … arrive", "are … arriving", "does … arrive", "is … arriving"], correctIndex: 1, explanation: "Irritation about repeated behaviour: are always arriving." },
      { id: "2-4", prompt: "My cat ___ always ___ on my keyboard when I'm working!", options: ["does … sit", "is … sitting", "does … sitting", "is … sit"], correctIndex: 1, explanation: "Annoying habit: is always sitting." },
      { id: "2-5", prompt: "He usually ___ to work. It's his routine. (no irritation)", options: ["is driving", "drives", "drive", "are driving"], correctIndex: 1, explanation: "Neutral routine → Simple: drives." },
      { id: "2-6", prompt: "They ___ always ___ the toilet roll empty. It's so annoying!", options: ["do … leave", "are … leaving", "does … leave", "is … leaving"], correctIndex: 1, explanation: "Annoying habit: are always leaving." },
      { id: "2-7", prompt: "She ___ always ___ things from my desk without asking!", options: ["does … take", "is … taking", "does … taking", "is … take"], correctIndex: 1, explanation: "Irritation: is always taking." },
      { id: "2-8", prompt: "I ___ never ___ my keys. I'm very organised. (neutral)", options: ["am … losing", "do … lose", "does … lose", "is … losing"], correctIndex: 1, explanation: "Neutral negative habit → Simple: I never lose." },
      { id: "2-9", prompt: "He ___ always ___ his phone on speaker in public places. So rude!", options: ["does … use", "is … using", "does … using", "is … use"], correctIndex: 1, explanation: "Annoying repeated behaviour: is always using." },
      { id: "2-10", prompt: "My neighbours ___ always ___ loud music late at night.", options: ["do … play", "are … playing", "does … play", "is … playing"], correctIndex: 1, explanation: "Annoying habit: are always playing." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Dual-meaning verbs",
    instructions:
      "Some verbs change meaning when used in Continuous vs Simple: have (= own vs activity), think (= opinion vs process), see (= understand vs meet/consult), look (= appearance vs deliberately looking).",
    questions: [
      { id: "3-1", prompt: "I ___ a great time at this party!", options: ["have", "has", "am having", "is having"], correctIndex: 2, explanation: "\"have a great time\" = activity/experience → Continuous: am having." },
      { id: "3-2", prompt: "She ___ long dark hair.", options: ["is having", "are having", "have", "has"], correctIndex: 3, explanation: "\"have\" = possession (stative) → Simple: has." },
      { id: "3-3", prompt: "I ___ this is the wrong decision.", options: ["am thinking", "think", "thinks", "is thinking"], correctIndex: 1, explanation: "\"think\" = opinion → Simple: think." },
      { id: "3-4", prompt: "He ___ about moving to another city.", options: ["thinks", "think", "is thinking", "are thinking"], correctIndex: 2, explanation: "\"think about\" = considering (active process) → Continuous: is thinking." },
      { id: "3-5", prompt: "I ___ what you mean now. Thanks for explaining.", options: ["am seeing", "sees", "see", "is seeing"], correctIndex: 2, explanation: "\"see\" = understand → Simple: see." },
      { id: "3-6", prompt: "She ___ a specialist about her back problems.", options: ["sees", "see", "is seeing", "are seeing"], correctIndex: 2, explanation: "\"see\" = consulting/meeting → Continuous: is seeing." },
      { id: "3-7", prompt: "You ___ tired. Are you OK?", options: ["are looking", "look", "looks", "is looking"], correctIndex: 1, explanation: "\"look\" = appearance (stative) → Simple: look." },
      { id: "3-8", prompt: "She ___ for her glasses — she can't find them.", options: ["looks", "look", "is looking", "are looking"], correctIndex: 2, explanation: "\"look for\" = active search → Continuous: is looking." },
      { id: "3-9", prompt: "This sauce ___ fantastic! What's in it?", options: ["is tasting", "are tasting", "taste", "tastes"], correctIndex: 3, explanation: "\"taste\" = sensation/quality → Simple: tastes." },
      { id: "3-10", prompt: "The chef ___ the food before serving it.", options: ["tastes", "taste", "is tasting", "are tasting"], correctIndex: 2, explanation: "\"taste\" = deliberate action → Continuous: is tasting." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — All advanced patterns",
    instructions:
      "Mix of future arrangements, 'always' irritation, dual-meaning verbs, stative verbs, and simple vs continuous contrast.",
    questions: [
      { id: "4-1", prompt: "I ___ always ___ my umbrella and it always rains!", options: ["do … forget", "am … forgetting", "does … forget", "is … forgetting"], correctIndex: 1, explanation: "Annoying habit (self-criticism): am always forgetting." },
      { id: "4-2", prompt: "She ___ a conference in Berlin next month.", options: ["attends", "attend", "is attending", "are attending"], correctIndex: 2, explanation: "Future arrangement → Present Continuous: is attending." },
      { id: "4-3", prompt: "They ___ their new house. They're very proud.", options: ["are owning", "own", "is owning", "owns"], correctIndex: 1, explanation: "\"own\" is always stative → Simple: own." },
      { id: "4-4", prompt: "He ___ always ___ the last biscuit. I'm tired of it!", options: ["does … eat", "is … eating", "does … eating", "is … eat"], correctIndex: 1, explanation: "Irritation about habit: is always eating." },
      { id: "4-5", prompt: "We ___ a new sales strategy this quarter.", options: ["try", "tries", "are trying", "is trying"], correctIndex: 2, explanation: "Temporary/current situation → Continuous: are trying." },
      { id: "4-6", prompt: "The train ___ at 9:15. (scheduled timetable)", options: ["is leaving", "leave", "leaves", "are leaving"], correctIndex: 2, explanation: "Fixed timetable → Present Simple: leaves." },
      { id: "4-7", prompt: "I ___ she is telling the truth.", options: ["am believing", "believe", "believes", "is believing"], correctIndex: 1, explanation: "\"believe\" = stative → Simple: believe." },
      { id: "4-8", prompt: "More young people ___ to big cities these days.", options: ["move", "moves", "are moving", "is moving"], correctIndex: 2, explanation: "\"These days\" = ongoing trend → Continuous: are moving." },
      { id: "4-9", prompt: "She ___ a shower, so she can't answer the phone.", options: ["has", "have", "is having", "are having"], correctIndex: 2, explanation: "\"have a shower\" = activity → Continuous: is having." },
      { id: "4-10", prompt: "I ___ this film is overrated.", options: ["am thinking", "think", "thinks", "is thinking"], correctIndex: 1, explanation: "\"think\" = opinion → Simple: think." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Future plans",
  2: "Always+irritation",
  3: "Dual verbs",
  4: "All patterns",
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

export default function AdvancedMixPcClient() {
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
          <span className="text-slate-700 font-medium">Advanced Mix</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Advanced Mix</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">Intermediate</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">B1–B2</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Push your Present Continuous further: <b>future plans</b>, <b>annoying habits with &apos;always&apos;</b>, <b>dual-meaning verbs</b>, and the trickiest cases. 40 MCQ questions.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <AdUnit variant="sidebar-dark" />

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
          <AdUnit variant="sidebar-dark" />
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        <PresentContinuousGameSection />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/present-continuous/ps-vs-pc"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Simple vs Continuous
          </a>
          <a
            href="/tenses/present-continuous"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Back to Present Continuous →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Advanced Present Continuous Patterns</h2>
        <p className="text-slate-500 text-sm">Three key advanced uses — learn the pattern, then practise.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Future Arrangements</span>
          </div>
          <Formula parts={[
            { text: "am/is/are", color: "yellow" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "green" }, { dim: true, text: "+" },
            { text: "next week / tomorrow", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I'm seeing my dentist tomorrow." />
            <Ex en="We're flying to Rome next Friday." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">😤</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">&apos;always&apos; for Irritation</span>
          </div>
          <Formula parts={[
            { text: "am/is/are", color: "yellow" }, { dim: true, text: "+" },
            { text: "always", color: "red" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "green" },
            { text: "!", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="He's always losing his keys!" />
            <Ex en="You're always arriving late!" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Dual-Meaning Verbs</span>
          </div>
          <Formula parts={[
            { text: "have/think/see/look/taste", color: "violet" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="She has long hair. (= own)" />
            <Ex en="She's having lunch. (= activity)" />
          </div>
        </div>
      </div>

      {/* Dual meaning verbs table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Dual Meaning Verbs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Verb</th>
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Simple meaning</th>
                <th className="text-left font-black text-slate-500 pb-2">Continuous meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["have", "own / possess", "do an activity (have lunch, shower)"],
                ["think", "believe / opinion", "consider / process"],
                ["see", "understand", "meet / consult"],
                ["look", "appearance", "deliberately look for"],
                ["taste", "quality/flavour", "deliberate tasting"],
              ].map(([verb, simple, cont]) => (
                <tr key={verb}>
                  <td className="py-2 pr-4 font-mono font-black text-violet-700">{verb}</td>
                  <td className="py-2 pr-4 text-slate-600">{simple}</td>
                  <td className="py-2 text-slate-600">{cont}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Amber warning */}
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ &apos;always&apos; + Simple = neutral habit vs &apos;always&apos; + Continuous = annoying behaviour!</b><br />
          <span className="font-mono">She always drinks tea.</span> (neutral) vs{" "}
          <span className="font-mono">She&apos;s always interrupting me!</span> (annoying)
        </div>
      </div>
    </div>
  );
}
