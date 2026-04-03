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
    title: "Exercise 1 — Affirmative: choose have / has",
    instructions:
      "Present Perfect affirmative uses have or has + past participle. Use have with I / you / we / they, and has with he / she / it.",
    questions: [
      { id: "1-1",  prompt: "She ___ finished her homework.",              options: ["have", "has", "is", "are"],         correctIndex: 1, explanation: "She → has: She has finished." },
      { id: "1-2",  prompt: "I ___ visited Paris twice.",                  options: ["has", "have", "am", "was"],         correctIndex: 1, explanation: "I → have: I have visited." },
      { id: "1-3",  prompt: "They ___ lived here for ten years.",          options: ["has", "is", "have", "are"],         correctIndex: 2, explanation: "They → have: They have lived." },
      { id: "1-4",  prompt: "He ___ just left the office.",                options: ["have", "has", "had", "is"],         correctIndex: 1, explanation: "He → has: He has just left." },
      { id: "1-5",  prompt: "We ___ already eaten lunch.",                 options: ["has", "is", "are", "have"],         correctIndex: 3, explanation: "We → have: We have already eaten." },
      { id: "1-6",  prompt: "The film ___ started.",                       options: ["have", "are", "has", "is"],         correctIndex: 2, explanation: "The film (= it) → has: The film has started." },
      { id: "1-7",  prompt: "You ___ done a great job.",                   options: ["has", "have", "had", "are"],        correctIndex: 1, explanation: "You → have: You have done." },
      { id: "1-8",  prompt: "My parents ___ gone to Spain.",               options: ["has", "is", "have", "are"],         correctIndex: 2, explanation: "My parents (= they) → have: They have gone." },
      { id: "1-9",  prompt: "It ___ been very cold this week.",            options: ["have", "are", "were", "has"],       correctIndex: 3, explanation: "It → has: It has been." },
      { id: "1-10", prompt: "The children ___ never tried sushi.",         options: ["has", "have", "are", "were"],       correctIndex: 1, explanation: "The children (= they) → have: They have never tried." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: choose haven't / hasn't",
    instructions:
      "Negative Present Perfect: subject + haven't / hasn't + past participle. Use haven't with I / you / we / they, and hasn't with he / she / it.",
    questions: [
      { id: "2-1",  prompt: "She ___ called me yet.",                      options: ["haven't", "hasn't", "didn't", "isn't"],    correctIndex: 1, explanation: "She → hasn't: She hasn't called yet." },
      { id: "2-2",  prompt: "I ___ seen that film.",                       options: ["hasn't", "didn't", "haven't", "wasn't"],   correctIndex: 2, explanation: "I → haven't: I haven't seen." },
      { id: "2-3",  prompt: "They ___ finished the project yet.",          options: ["hasn't", "didn't", "aren't", "haven't"],   correctIndex: 3, explanation: "They → haven't: They haven't finished." },
      { id: "2-4",  prompt: "He ___ eaten anything today.",                options: ["haven't", "hasn't", "didn't", "isn't"],    correctIndex: 1, explanation: "He → hasn't: He hasn't eaten." },
      { id: "2-5",  prompt: "We ___ been to Japan.",                       options: ["hasn't", "weren't", "didn't", "haven't"], correctIndex: 3, explanation: "We → haven't: We haven't been." },
      { id: "2-6",  prompt: "It ___ rained for weeks.",                    options: ["haven't", "didn't", "hasn't", "wasn't"],   correctIndex: 2, explanation: "It → hasn't: It hasn't rained." },
      { id: "2-7",  prompt: "You ___ answered my question.",               options: ["hasn't", "haven't", "didn't", "weren't"], correctIndex: 1, explanation: "You → haven't: You haven't answered." },
      { id: "2-8",  prompt: "My sister ___ arrived yet.",                  options: ["haven't", "didn't", "hasn't", "isn't"],   correctIndex: 2, explanation: "My sister (= she) → hasn't: She hasn't arrived." },
      { id: "2-9",  prompt: "The results ___ been published yet.",         options: ["hasn't", "weren't", "haven't", "aren't"], correctIndex: 2, explanation: "The results (= they) → haven't: They haven't been published." },
      { id: "2-10", prompt: "He ___ spoken to her since Monday.",          options: ["haven't", "hasn't", "didn't", "isn't"],   correctIndex: 1, explanation: "He → hasn't: He hasn't spoken." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions, ever / never + short answers",
    instructions:
      "Present Perfect questions use Have / Has + subject + past participle. Short answers repeat have / has — never the main verb. Ever means 'at any time in your life'.",
    questions: [
      { id: "3-1",  prompt: "___ she ever been to Australia?",             options: ["Have", "Did", "Was", "Has"],             correctIndex: 3, explanation: "She → Has: Has she ever been…?" },
      { id: "3-2",  prompt: "___ you finished your report?",               options: ["Has", "Did", "Are", "Have"],             correctIndex: 3, explanation: "You → Have: Have you finished…?" },
      { id: "3-3",  prompt: "___ they ever tried Indian food?",            options: ["Has", "Did", "Have", "Are"],             correctIndex: 2, explanation: "They → Have: Have they ever tried…?" },
      { id: "3-4",  prompt: '"Have you seen him?" — "No, ___.\'',          options: ["I haven't", "I didn't", "I hasn't", "I don't"], correctIndex: 0, explanation: "Short negative answer with have: No, I haven't." },
      { id: "3-5",  prompt: '"Has she called?" — "Yes, ___.\'',            options: ["she did", "she have", "she has", "she is"], correctIndex: 2, explanation: "Short positive answer with has: Yes, she has." },
      { id: "3-6",  prompt: "I have ___ been to China.",                   options: ["ever", "already", "never", "just"],      correctIndex: 2, explanation: "Never = not at any time. 'I have never been to China.'" },
      { id: "3-7",  prompt: '"Have they arrived?" — "Yes, ___.\'',         options: ["they did", "they have", "they has", "they are"], correctIndex: 1, explanation: "Short positive answer: Yes, they have." },
      { id: "3-8",  prompt: "___ he ever eaten octopus?",                  options: ["Have", "Did", "Was", "Has"],             correctIndex: 3, explanation: "He → Has: Has he ever eaten…?" },
      { id: "3-9",  prompt: '"Has it worked?" — "No, ___.\'',              options: ["it hasn't", "it haven't", "it didn't", "it isn't"], correctIndex: 0, explanation: "Short negative with has: No, it hasn't." },
      { id: "3-10", prompt: "Have you ___ met a famous person?",           options: ["never", "just", "already", "ever"],      correctIndex: 3, explanation: "Ever is used in questions about life experience." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all forms + Present Perfect vs Past Simple",
    instructions:
      "This exercise mixes all Present Perfect forms and tests whether to use Present Perfect or Past Simple. Key rule: use Present Perfect with no specific time / with since / for / ever / never / just / already / yet; use Past Simple with specific times (yesterday, last week, in 2020).",
    questions: [
      { id: "4-1",  prompt: "I ___ just finished the book.",               options: ["have", "had", "has", "did"],             correctIndex: 0, explanation: "I → have: I have just finished. 'Just' signals Present Perfect." },
      { id: "4-2",  prompt: "She ___ work here since 2019.",               options: ["worked", "works", "is working", "has worked"], correctIndex: 3, explanation: "Since 2019 → Present Perfect: She has worked here since 2019." },
      { id: "4-3",  prompt: "We ___ to Rome last summer.",                 options: ["have gone", "have been", "went", "go"],   correctIndex: 2, explanation: "Last summer = specific past time → Past Simple: We went to Rome." },
      { id: "4-4",  prompt: "Have you done your homework ___?",            options: ["since", "just", "ever", "yet"],          correctIndex: 3, explanation: "Yet is used in questions about completion: Have you done it yet?" },
      { id: "4-5",  prompt: "He has ___ eaten — he's not hungry.",         options: ["yet", "since", "already", "never"],      correctIndex: 2, explanation: "Already in affirmative means something happened sooner than expected." },
      { id: "4-6",  prompt: "I ___ meet her at a party in 2021.",          options: ["have met", "has met", "met", "meet"],    correctIndex: 2, explanation: "In 2021 = specific time → Past Simple: I met her in 2021." },
      { id: "4-7",  prompt: "They have lived in London ___ five years.",   options: ["since", "ago", "for", "in"],             correctIndex: 2, explanation: "For + period of time: They have lived there for five years." },
      { id: "4-8",  prompt: "___ you ever ridden a horse?",                options: ["Did", "Have", "Had", "Were"],             correctIndex: 1, explanation: "Ever + Present Perfect question: Have you ever ridden…?" },
      { id: "4-9",  prompt: "She ___ her keys yesterday.",                 options: ["has lost", "have lost", "lost", "loses"], correctIndex: 2, explanation: "Yesterday = specific past time → Past Simple: She lost her keys." },
      { id: "4-10", prompt: "I haven't seen him ___ last Monday.",         options: ["for", "ago", "yet", "since"],            correctIndex: 3, explanation: "Since + point in time: I haven't seen him since last Monday." },
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

export default function PresentPerfectQuizClient() {
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
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Present Perfect</b> with 40 multiple choice questions across four sets: affirmative (have/has), negative (haven't/hasn't), questions + ever/never, and a mixed review including Present Perfect vs Past Simple.
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
          <a href="/tenses/present-perfect/fill-in-blank" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Fill in the Blank →</a>
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
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "have / has", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I have worked.  ·  She has eaten.  ·  They have gone." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "haven't / hasn't", color: "red" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I haven't seen him.  ·  She hasn't called.  ·  They haven't arrived." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Have / Has", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "past participle", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Have you seen this film?  ·  Has she arrived?  ·  Have they eaten?" />
          </div>
        </div>
      </div>

      {/* have / has table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">have vs has</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
                <th className="px-4 py-2.5 font-black text-sky-700">?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I / You / We / They", "have worked", "haven't worked", "Have you worked?"],
                ["He / She / It ★", "has worked", "hasn't worked", "Has she worked?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 1 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> He / She / It always use <b>has</b> and <b>hasn&apos;t</b>.<br />
          <span className="text-xs">She <b>has</b> finished ✅ &nbsp; She <b>have</b> finished ❌ &nbsp;|&nbsp; The verb after have/has must be the <b>past participle</b>, not the base form.</span>
        </div>
      </div>

      {/* When to use — 4 use cases */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Present Perfect</div>
        <div className="space-y-3">
          {[
            { label: "Life experience (ever / never)", color: "violet", examples: ["Have you ever been to Japan?", "I've never tried sushi.", "She has visited 20 countries."] },
            { label: "Recent past with present result (just)", color: "sky", examples: ["She has just left the office.", "I've just finished my homework.", "They have just arrived."] },
            { label: "Action still ongoing (since / for)", color: "green", examples: ["I've lived here for 5 years.", "She's worked here since 2020.", "We've known each other for a decade."] },
            { label: "Completion / achievement (already / yet)", color: "yellow", examples: ["I've already done my homework.", "Have you finished yet?", "He hasn't called yet."] },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = { violet: "border-violet-200 bg-violet-50/50", sky: "border-sky-200 bg-sky-50/50", green: "border-emerald-200 bg-emerald-50/50", yellow: "border-amber-200 bg-amber-50/50" };
            const badgeMap: Record<string, string> = { violet: "bg-violet-100 text-violet-800 border-violet-200", sky: "bg-sky-100 text-sky-800 border-sky-200", green: "bg-emerald-100 text-emerald-800 border-emerald-200", yellow: "bg-yellow-100 text-yellow-800 border-yellow-200" };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}>{label}</span>
                <div className="space-y-1">
                  {examples.map((ex) => <Ex key={ex} en={ex} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common irregular past participles */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common irregular past participles</div>
        <div className="flex flex-wrap gap-2">
          {[
            "be → been", "do → done", "go → gone", "see → seen", "eat → eaten",
            "come → come", "take → taken", "make → made", "give → given", "get → got",
            "find → found", "know → known", "think → thought", "buy → bought", "leave → left",
            "write → written", "read → read", "tell → told", "hear → heard", "feel → felt",
            "meet → met", "run → run", "fly → flown", "drink → drunk", "drive → driven",
            "break → broken", "bring → brought", "build → built", "catch → caught", "choose → chosen",
            "fall → fallen", "forget → forgotten", "grow → grown", "keep → kept", "lose → lost",
            "pay → paid", "send → sent", "sleep → slept", "spend → spent", "wear → worn",
          ].map((v) => (
            <span key={v} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{v}</span>
          ))}
        </div>
      </div>

      {/* PP vs Past Simple */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Present Perfect vs Past Simple</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-emerald-700">Present Perfect</th>
                <th className="px-4 py-2.5 font-black text-left text-red-700">Past Simple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["No specific time mentioned", "Specific time mentioned"],
                ["With: ever, never, just, already, yet, since, for, recently, so far", "With: yesterday, last week, in 2020, two years ago"],
                ["I have seen that film.", "I saw that film last week."],
                ["She has just called.", "She called an hour ago."],
                ["Have you ever been to Italy?", "Did you go to Italy last year?"],
              ].map(([pp, ps], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-emerald-800 font-mono text-xs">{pp}</td>
                  <td className="px-4 py-2.5 text-red-800 font-mono text-xs">{ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["already", "yet", "just", "ever", "never", "since 2020", "since Monday", "for 5 years", "for a long time", "recently", "so far", "today", "this week", "this month", "this year", "many times", "once", "twice", "several times", "in my life"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
