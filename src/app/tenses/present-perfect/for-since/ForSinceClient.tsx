"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

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
    title: "Exercise 1 — for or since?",
    instructions:
      "Choose for or since to complete each sentence. Remember: for + period of time (three years, ages, a week); since + point in time (2019, Monday, I was a child).",
    questions: [
      { id: "1-1",  prompt: "I have lived here ___ 2015.",                      options: ["for", "since", "during", "from"],    correctIndex: 1, explanation: "2015 is a point in time → since: I have lived here since 2015." },
      { id: "1-2",  prompt: "She has worked at this company ___ three years.",  options: ["since", "for", "during", "in"],      correctIndex: 1, explanation: "Three years is a period of time → for: She has worked here for three years." },
      { id: "1-3",  prompt: "He hasn't called me ___ last Tuesday.",            options: ["for", "since", "from", "after"],     correctIndex: 1, explanation: "Last Tuesday is a point in time → since." },
      { id: "1-4",  prompt: "We have known each other ___ a long time.",        options: ["since", "for", "ago", "from"],       correctIndex: 1, explanation: "A long time is a period → for: We have known each other for a long time." },
      { id: "1-5",  prompt: "They have been married ___ June.",                 options: ["for", "since", "in", "at"],          correctIndex: 1, explanation: "June is a point in time → since: They have been married since June." },
      { id: "1-6",  prompt: "I haven't eaten anything ___ this morning.",       options: ["for", "since", "in", "from"],        correctIndex: 1, explanation: "This morning is a point in time → since." },
      { id: "1-7",  prompt: "She has been learning English ___ six months.",    options: ["since", "for", "during", "in"],      correctIndex: 1, explanation: "Six months is a period → for: She has been learning for six months." },
      { id: "1-8",  prompt: "The shop has been closed ___ ages.",               options: ["since", "for", "from", "ago"],       correctIndex: 1, explanation: "Ages is a period → for: closed for ages." },
      { id: "1-9",  prompt: "I have been a teacher ___ I graduated.",           options: ["for", "since", "when", "after"],     correctIndex: 1, explanation: "Since can be followed by a clause: since I graduated." },
      { id: "1-10", prompt: "He has worked nights ___ two weeks.",              options: ["since", "for", "during", "in"],      correctIndex: 1, explanation: "Two weeks is a period → for: He has worked nights for two weeks." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Choose the correct for/since expression",
    instructions:
      "Choose the expression that correctly completes each Present Perfect sentence.",
    questions: [
      { id: "2-1",  prompt: "I have known her ___.",                            options: ["since last year", "for last year", "since a year", "for 2022"],    correctIndex: 0, explanation: "Last year is a point in time → since last year." },
      { id: "2-2",  prompt: "They haven't spoken ___.",                         options: ["since three days", "for three days", "for Monday", "since days"],  correctIndex: 1, explanation: "Three days is a period → for three days." },
      { id: "2-3",  prompt: "She has lived in Paris ___.",                      options: ["for 2018", "since 2018", "for since 2018", "during 2018"],         correctIndex: 1, explanation: "2018 is a point in time → since 2018." },
      { id: "2-4",  prompt: "He has been ill ___.",                             options: ["since a week", "for a week", "for Monday", "since weeks"],         correctIndex: 1, explanation: "A week is a period → for a week." },
      { id: "2-5",  prompt: "We have been waiting ___.",                        options: ["since an hour", "for an hour", "since hours", "for yesterday"],    correctIndex: 1, explanation: "An hour is a period → for an hour." },
      { id: "2-6",  prompt: "I haven't seen him ___.",                          options: ["for his birthday", "since his birthday", "for the party last", "since a long"], correctIndex: 1, explanation: "His birthday is a point in time → since his birthday." },
      { id: "2-7",  prompt: "The museum has been open ___.",                    options: ["for 1890", "since 1890", "for the 1890", "during 1890"],           correctIndex: 1, explanation: "1890 is a starting point in time → since 1890." },
      { id: "2-8",  prompt: "She hasn't slept properly ___.",                   options: ["for her exams started", "since her exams started", "since days", "for the Monday"], correctIndex: 1, explanation: "A clause with a starting point → since her exams started." },
      { id: "2-9",  prompt: "I have been learning Spanish ___.",                options: ["since five years", "for five years", "since long", "for 2015"],    correctIndex: 1, explanation: "Five years is a period → for five years." },
      { id: "2-10", prompt: "They have been friends ___.",                      options: ["for childhood", "since childhood", "for they were children", "since years"], correctIndex: 1, explanation: "Childhood is a point in life → since childhood." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — How long questions",
    instructions:
      "Choose the best answer or best question word for How long questions with Present Perfect.",
    questions: [
      { id: "3-1",  prompt: "___ long have you lived here?",                    options: ["What", "When", "How", "Since"],      correctIndex: 2, explanation: "How long asks about duration. How long have you lived here?" },
      { id: "3-2",  prompt: '"How long have you been a doctor?" — "___."',      options: ["Since ten years", "For ten years", "Ten years ago", "In ten years"], correctIndex: 1, explanation: "Ten years is a period of time → For ten years." },
      { id: "3-3",  prompt: '"How long has she lived here?" — "___."',          options: ["Since 2019", "For 2019", "In 2019", "During 2019"],                correctIndex: 0, explanation: "2019 is a point in time → Since 2019." },
      { id: "3-4",  prompt: "How long ___ they been married?",                  options: ["do", "did", "are", "have"],          correctIndex: 3, explanation: "How long + have/has + subject + past participle: How long have they been married?" },
      { id: "3-5",  prompt: '"How long has it been raining?" — "___."',         options: ["Since an hour", "For an hour", "In an hour", "During an hour"],    correctIndex: 1, explanation: "An hour is a period → For an hour." },
      { id: "3-6",  prompt: "How long has she ___ this job?",                   options: ["has", "did", "had", "was having"],   correctIndex: 2, explanation: "Present Perfect: How long has she had this job?" },
      { id: "3-7",  prompt: '"How long have you known him?" — "___."',          options: ["Since we were at school", "For we were at school", "Since years", "For school"], correctIndex: 0, explanation: "A clause marking the starting point → Since we were at school." },
      { id: "3-8",  prompt: "___ have you been waiting here?",                  options: ["How long", "Since when", "For how", "What time"],                 correctIndex: 0, explanation: "How long asks about duration in the present perfect context." },
      { id: "3-9",  prompt: '"How long have they owned the shop?" — "___."',    options: ["Since twenty years", "For twenty years", "In twenty years", "During years"], correctIndex: 1, explanation: "Twenty years is a period → For twenty years." },
      { id: "3-10", prompt: "How long ___ he been learning French?",            options: ["is", "was", "did", "has"],           correctIndex: 3, explanation: "How long has he been learning French? (Present Perfect Continuous)" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: for, since + PP forms",
    instructions:
      "This mixed set combines choosing for/since with choosing the correct Present Perfect form. Some questions also test have/has.",
    questions: [
      { id: "4-1",  prompt: "I ___ been here since nine o'clock.",              options: ["has", "have", "am", "did"],          correctIndex: 1, explanation: "I → have: I have been here since nine o'clock." },
      { id: "4-2",  prompt: "She has worked here ___ 2020.",                    options: ["for", "since", "during", "in"],      correctIndex: 1, explanation: "2020 is a point in time → since: She has worked here since 2020." },
      { id: "4-3",  prompt: "They ___ been friends for over a decade.",         options: ["has", "have", "are", "was"],         correctIndex: 1, explanation: "They → have: They have been friends for over a decade." },
      { id: "4-4",  prompt: "He hasn't phoned ___ Monday.",                     options: ["for", "since", "in", "at"],          correctIndex: 1, explanation: "Monday is a point in time → since Monday." },
      { id: "4-5",  prompt: "How long ___ she lived in Tokyo?",                 options: ["did", "does", "has", "is"],          correctIndex: 2, explanation: "How long + has + subject: How long has she lived in Tokyo?" },
      { id: "4-6",  prompt: "We haven't had a holiday ___ two years.",          options: ["since", "for", "ago", "in"],         correctIndex: 1, explanation: "Two years is a period → for: for two years." },
      { id: "4-7",  prompt: "The kids ___ been in bed since eight.",            options: ["has", "have", "are", "were"],        correctIndex: 1, explanation: "The kids (= they) → have: They have been in bed since eight." },
      { id: "4-8",  prompt: "She has loved cooking ___ she was a child.",       options: ["for", "since", "when", "after"],     correctIndex: 1, explanation: "Since + clause (a starting point): since she was a child." },
      { id: "4-9",  prompt: "He ___ owned that car for fifteen years.",         options: ["have", "has", "had", "is"],          correctIndex: 1, explanation: "He → has: He has owned that car for fifteen years." },
      { id: "4-10", prompt: "I haven't eaten fast food ___ a very long time.",  options: ["since", "for", "in", "during"],      correctIndex: 1, explanation: "A very long time is a period → for: for a very long time." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "for or since",
  2: "Expressions",
  3: "How long",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function ForSinceClient() {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setAnswers({});
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setAnswers({});
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-perfect">Present Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">for vs since</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">for vs since</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Easy</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Master the difference between <b>for</b> and <b>since</b> in Present Perfect sentences. <b>For</b> describes a period of time; <b>since</b> marks the starting point. 40 multiple-choice questions covering both prepositions, <em>How long</em> questions, and mixed forms.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <AdUnit variant="sidebar-dark" />

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
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
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const chosen = answers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi}
                                      onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))}
                                      className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {!checked ? (
                        <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                          Check Answers
                        </button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">
                          Next Exercise →
                        </button>
                      )}
                    </div>
                    {score && (
                      <div className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div>
                            <div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div>
                          </div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}
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

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-perfect" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Present Perfect exercises</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}>{p.text}</span>
      ))}
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

      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">for — period of time</span>
          <Formula parts={[
            { text: "have/has", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: "for", color: "sky" },
            { text: "period of time", color: "slate" },
          ]} />
          <p className="text-xs text-slate-600">Use <b>for</b> to say how long something has lasted. It is followed by a length of time.</p>
          <div className="space-y-1.5">
            <Ex en="I have lived here for three years." />
            <Ex en="She has worked here for a long time." />
            <Ex en="They haven't spoken for ages." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-violet-50 to-white border border-violet-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-violet-500 px-3 py-1 text-xs font-black text-white">since — starting point</span>
          <Formula parts={[
            { text: "have/has", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: "since", color: "violet" },
            { text: "point in time", color: "slate" },
          ]} />
          <p className="text-xs text-slate-600">Use <b>since</b> to show when something started. It is followed by a point in time or a clause.</p>
          <div className="space-y-1.5">
            <Ex en="I have lived here since 2019." />
            <Ex en="She has worked here since Monday." />
            <Ex en="They haven't spoken since the argument." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">How long…?</span>
          <Formula parts={[
            { text: "How long", color: "green" },
            { text: "have / has", color: "yellow" },
            { text: "subject", color: "sky" },
            { text: "past participle", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="How long have you lived here? — For two years. / Since 2022." />
            <Ex en="How long has she been a teacher? — For ten years. / Since she was 25." />
          </div>
        </div>
      </div>

      {/* Contrast table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">for vs since — contrast</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-sky-700">for + period</th>
                <th className="px-4 py-2.5 font-black text-violet-700">since + point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["for two days", "since Tuesday"],
                ["for a week", "since last Monday"],
                ["for three months", "since March"],
                ["for six years", "since 2018"],
                ["for ages", "since childhood"],
                ["for a long time", "since I was young"],
              ].map(([f, s], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-sky-800 font-mono text-xs">{f}</td>
                  <td className="px-4 py-2.5 text-violet-800 font-mono text-xs">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Common mistake:</span> Do NOT use <b>since</b> with a period of time, and do NOT use <b>for</b> with a point in time.<br />
          <span className="text-xs block mt-1">I have lived here <b>since</b> three years ❌ → <b>for</b> three years ✅<br />I have lived here <b>for</b> 2020 ❌ → <b>since</b> 2020 ✅</span>
        </div>
      </div>

      {/* Timeline visual */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Timeline</div>
        <div className="rounded-2xl border border-black/10 bg-slate-50 p-5">
          <div className="text-xs text-slate-500 mb-3 font-semibold">Example: &ldquo;I have lived here since 2020 / for 4 years.&rdquo;</div>
          <div className="relative flex items-center">
            <div className="flex-1 h-1 bg-slate-300 rounded-full"></div>
            <div className="absolute left-0 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-violet-500 border-2 border-white shadow"></div>
              <div className="mt-1.5 text-xs font-bold text-violet-700 whitespace-nowrap">2020 (since)</div>
            </div>
            <div className="absolute left-1/2 right-0 h-1 bg-sky-400 rounded-full"></div>
            <div className="absolute right-0 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow"></div>
              <div className="mt-1.5 text-xs font-bold text-emerald-700 whitespace-nowrap">Now</div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <span className="rounded-lg bg-sky-100 border border-sky-200 px-3 py-1 text-xs font-bold text-sky-800">← for 4 years →</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 text-center">The <span className="text-violet-700 font-bold">violet dot</span> = starting point (<b>since</b>). The <span className="text-sky-600 font-bold">blue line</span> = duration (<b>for</b>).</p>
        </div>
      </div>

    </div>
  );
}
