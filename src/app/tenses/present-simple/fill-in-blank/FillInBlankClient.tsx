"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type InputQ = {
  id: string;
  prompt: string;        // sentence with ___ for the gap
  hint: string;          // verb in brackets shown to the user, e.g. "(go)"
  correct: string[];     // accepted answers (all lowercase, trimmed)
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: InputQ[];
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/'/g, "'").replace(/'/g, "'");
}

function isAccepted(val: string, correct: string[]) {
  const n = normalize(val);
  return correct.some((c) => normalize(c) === n);
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Affirmative: write the correct verb form",
    instructions:
      "Write the correct Present Simple form of the verb in brackets. With he / she / it add -s or -es. With I / you / we / they use the base form.",
    questions: [
      { id: "1-1", prompt: "She ___ (go) to school every day.", hint: "(go)", correct: ["goes"], explanation: "She → add -s: goes." },
      { id: "1-2", prompt: "They ___ (live) in New York.", hint: "(live)", correct: ["live"], explanation: "They → base form: live." },
      { id: "1-3", prompt: "He ___ (drink) coffee every morning.", hint: "(drink)", correct: ["drinks"], explanation: "He → add -s: drinks." },
      { id: "1-4", prompt: "I ___ (work) in a hospital.", hint: "(work)", correct: ["work"], explanation: "I → base form: work." },
      { id: "1-5", prompt: "The train ___ (leave) at 8 AM.", hint: "(leave)", correct: ["leaves"], explanation: "Singular noun → add -s: leaves." },
      { id: "1-6", prompt: "We ___ (study) English every week.", hint: "(study)", correct: ["study"], explanation: "We → base form: study." },
      { id: "1-7", prompt: "My cat ___ (sleep) all day.", hint: "(sleep)", correct: ["sleeps"], explanation: "My cat (= it) → add -s: sleeps." },
      { id: "1-8", prompt: "You ___ (speak) very fast.", hint: "(speak)", correct: ["speak"], explanation: "You → base form: speak." },
      { id: "1-9", prompt: "She ___ (watch) TV every evening.", hint: "(watch)", correct: ["watches"], explanation: "She + verb ending in -ch → add -es: watches." },
      { id: "1-10", prompt: "The children ___ (play) in the garden.", hint: "(play)", correct: ["play"], explanation: "The children (= they) → base form: play." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: write don't or doesn't + verb",
    instructions:
      "Write the full negative form: don't or doesn't + the base form of the verb in brackets. Remember: he / she / it → doesn't; I / you / we / they → don't.",
    questions: [
      { id: "2-1", prompt: "I ___ (eat) meat.", hint: "(eat)", correct: ["don't eat"], explanation: "I → don't eat." },
      { id: "2-2", prompt: "She ___ (watch) TV in the morning.", hint: "(watch)", correct: ["doesn't watch"], explanation: "She → doesn't watch." },
      { id: "2-3", prompt: "They ___ (live) near here.", hint: "(live)", correct: ["don't live"], explanation: "They → don't live." },
      { id: "2-4", prompt: "He ___ (like) spicy food.", hint: "(like)", correct: ["doesn't like"], explanation: "He → doesn't like." },
      { id: "2-5", prompt: "We ___ (have) a car.", hint: "(have)", correct: ["don't have"], explanation: "We → don't have." },
      { id: "2-6", prompt: "My dog ___ (eat) vegetables.", hint: "(eat)", correct: ["doesn't eat"], explanation: "My dog (= it) → doesn't eat." },
      { id: "2-7", prompt: "You ___ (need) to shout.", hint: "(need)", correct: ["don't need"], explanation: "You → don't need." },
      { id: "2-8", prompt: "It ___ (snow) here in summer.", hint: "(snow)", correct: ["doesn't snow"], explanation: "It → doesn't snow." },
      { id: "2-9", prompt: "She ___ (know) the answer.", hint: "(know)", correct: ["doesn't know"], explanation: "She → doesn't know." },
      { id: "2-10", prompt: "My parents ___ (speak) English.", hint: "(speak)", correct: ["don't speak"], explanation: "My parents (= they) → don't speak." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: write the question form",
    instructions:
      "Write the correct question or short answer using the verb in brackets. Use Do or Does at the start. The main verb stays in the base form after Do / Does.",
    questions: [
      { id: "3-1", prompt: "___ you like chocolate? (like)", hint: "(like)", correct: ["do you like chocolate?", "do you like chocolate"], explanation: "You → Do: Do you like chocolate?" },
      { id: "3-2", prompt: "___ she work here? (work)", hint: "(work)", correct: ["does she work here?", "does she work here"], explanation: "She → Does: Does she work here?" },
      { id: "3-3", prompt: "___ they speak French? (speak)", hint: "(speak)", correct: ["do they speak french?", "do they speak french"], explanation: "They → Do: Do they speak French?" },
      { id: "3-4", prompt: "___ he play the guitar? (play)", hint: "(play)", correct: ["does he play the guitar?", "does he play the guitar"], explanation: "He → Does: Does he play the guitar?" },
      { id: "3-5", prompt: "___ your parents live in the city? (live)", hint: "(live)", correct: ["do your parents live in the city?", "do your parents live in the city"], explanation: "Your parents (= they) → Do." },
      { id: "3-6", prompt: "___ it rain a lot in autumn? (rain)", hint: "(rain)", correct: ["does it rain a lot in autumn?", "does it rain a lot in autumn"], explanation: "It → Does: Does it rain a lot in autumn?" },
      { id: "3-7", prompt: "\"Does he drink coffee?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["he does", "yes, he does"], explanation: "Short answer with does: Yes, he does." },
      { id: "3-8", prompt: "\"Do you study English?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i do", "yes, i do"], explanation: "Short answer with do: Yes, I do." },
      { id: "3-9", prompt: "\"Does she like jazz?\" — \"No, ___.\"", hint: "(short answer)", correct: ["she doesn't", "no, she doesn't"], explanation: "Short negative answer: No, she doesn't." },
      { id: "3-10", prompt: "\"Do they live here?\" — \"No, ___.\"", hint: "(short answer)", correct: ["they don't", "no, they don't"], explanation: "Short negative answer: No, they don't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all forms",
    instructions:
      "Write the correct Present Simple form of the verb in brackets: affirmative, negative or question. Read the sentence carefully to decide which form is needed.",
    questions: [
      { id: "4-1", prompt: "My brother ___ (play) football every weekend.", hint: "(play)", correct: ["plays"], explanation: "My brother (= he) → plays." },
      { id: "4-2", prompt: "I ___ (not / like) getting up early.", hint: "(not / like)", correct: ["don't like"], explanation: "I + negative → don't like." },
      { id: "4-3", prompt: "___ she work on weekends? (work)", hint: "(work)", correct: ["does she work on weekends?", "does she work on weekends"], explanation: "She → Does she work…?" },
      { id: "4-4", prompt: "Water ___ (boil) at 100 degrees Celsius.", hint: "(boil)", correct: ["boils"], explanation: "Water (= it) → boils. Scientific fact." },
      { id: "4-5", prompt: "We ___ (not / have) a garden.", hint: "(not / have)", correct: ["don't have"], explanation: "We + negative → don't have." },
      { id: "4-6", prompt: "How often ___ (she / go) to the gym?", hint: "(she / go)", correct: ["does she go", "does she go to the gym?", "does she go to the gym"], explanation: "She → Does she go…?" },
      { id: "4-7", prompt: "The museum ___ (open) at 9 in the morning.", hint: "(open)", correct: ["opens"], explanation: "The museum (= it) → opens." },
      { id: "4-8", prompt: "He ___ (not / eat) breakfast at home.", hint: "(not / eat)", correct: ["doesn't eat"], explanation: "He + negative → doesn't eat." },
      { id: "4-9", prompt: "\"___ (you / enjoy) learning English?\"", hint: "(you / enjoy)", correct: ["do you enjoy", "do you enjoy learning english?", "do you enjoy learning english"], explanation: "You → Do you enjoy…?" },
      { id: "4-10", prompt: "She ___ (teach) maths at a local school.", hint: "(teach)", correct: ["teaches"], explanation: "She + verb ending in -ch → teaches." },
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

export default function FillInBlankClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

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
      if (isAccepted(answers[q.id] ?? "", q.correct)) correct++;
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
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Present Simple</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions, and mixed. Check your spelling carefully.
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
                  <div className="mt-8 space-y-4">
                    {current.questions.map((q, idx) => {
                      const val = answers[q.id] ?? "";
                      const answered = normalize(val) !== "";
                      const correct = checked && answered && isAccepted(val, q.correct);
                      const wrong = checked && answered && !correct;
                      const noAnswer = checked && !answered;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              {/* Sentence displayed with blank */}
                              <div className="font-semibold text-slate-900 leading-relaxed">
                                {q.prompt.split("___").map((part, i, arr) =>
                                  i < arr.length - 1 ? (
                                    <span key={i}>
                                      {part}
                                      <span className="inline-block align-baseline mx-1">
                                        <input
                                          type="text"
                                          value={val}
                                          disabled={checked}
                                          autoComplete="off"
                                          autoCorrect="off"
                                          autoCapitalize="off"
                                          spellCheck={false}
                                          placeholder={q.hint}
                                          onChange={(e) =>
                                            setAnswers((p) => ({ ...p, [q.id]: e.target.value }))
                                          }
                                          className={`rounded-lg border px-3 py-1 text-sm font-mono outline-none transition min-w-[120px] ${
                                            checked
                                              ? correct
                                                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                                : wrong
                                                ? "border-red-400 bg-red-50 text-red-800"
                                                : noAnswer
                                                ? "border-amber-300 bg-amber-50"
                                                : ""
                                              : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
                                          }`}
                                        />
                                      </span>
                                    </span>
                                  ) : (
                                    part
                                  )
                                )}
                              </div>

                              {/* Feedback */}
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {correct && (
                                    <div className="text-emerald-700 font-semibold">✅ Correct</div>
                                  )}
                                  {wrong && (
                                    <div className="text-red-700 font-semibold">❌ Wrong — you wrote: <span className="font-mono">{val}</span></div>
                                  )}
                                  {noAnswer && (
                                    <div className="text-amber-700 font-semibold">⚠ No answer</div>
                                  )}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    <span className="font-mono font-bold text-slate-800">{q.correct[0]}</span>{" "}
                                    — {q.explanation}
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
          <AdUnit variant="sidebar-dark" />
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/present-simple/quiz"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Multiple Choice
          </a>
          <a
            href="/tenses/present-simple/spot-the-mistake"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Spot the Mistake →
          </a>
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
            { text: "verb", color: "yellow" },
            { text: "(+ -s / -es for he/she/it)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I / You / We / They work every day." />
            <Ex en="He / She / It works every day." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "don't / doesn't", color: "red" },
            { text: "verb (base form)", color: "yellow" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I / You / We / They don't work." />
            <Ex en="He / She / It doesn't work." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Do / Does", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb (base form)", color: "yellow" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Do you / we / they work here?" />
            <Ex en="Does he / she / it work here?" />
          </div>
        </div>
      </div>

      {/* Conjugation table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Conjugation table</div>
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
                ["I", "work", "don't work", "Do I work?"],
                ["You", "work", "don't work", "Do you work?"],
                ["He / She / It", "works ★", "doesn't work", "Does he work?"],
                ["We", "work", "don't work", "Do we work?"],
                ["They", "work", "don't work", "Do they work?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50 font-bold" : "bg-white"}>
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
          <span className="font-black">★ Key rule:</span> After <b>doesn&apos;t</b> and <b>does</b> the verb <b>always stays in the base form</b> — no -s!<br />
          <span className="text-xs">She <b>doesn&apos;t work</b> ✅ &nbsp; She doesn&apos;t works ❌ &nbsp;|&nbsp; Does he <b>work</b>? ✅ &nbsp; Does he works? ❌</span>
        </div>
      </div>

      {/* Spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">He / She / It — spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -s", ex: "work → works · play → plays · like → likes · drink → drinks" },
            { rule: "Ends in -ch, -sh, -ss, -x, -o → add -es", ex: "watch → watches · go → goes · do → does · fix → fixes" },
            { rule: "Consonant + y → change y → i, add -es", ex: "study → studies · carry → carries · try → tries" },
            { rule: "Vowel + y → just add -s", ex: "play → plays · say → says · enjoy → enjoys" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{rule}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Irregular verbs */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">Two irregular verbs to memorise</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-black/8 bg-white p-3">
            <div className="font-bold text-slate-900 mb-1 text-sm">have</div>
            <div className="text-slate-600 text-xs space-y-0.5">
              <div>I / you / we / they <b>have</b></div>
              <div>he / she / it <b className="text-amber-700">has</b> ← irregular!</div>
            </div>
          </div>
          <div className="rounded-xl border border-black/8 bg-white p-3">
            <div className="font-bold text-slate-900 mb-1 text-sm">be</div>
            <div className="text-slate-600 text-xs space-y-0.5">
              <div>I <b>am</b> · you/we/they <b>are</b></div>
              <div>he / she / it <b className="text-amber-700">is</b></div>
            </div>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">📌 Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["always", "usually", "often", "sometimes", "rarely", "never", "every day", "every week", "on Mondays", "in the morning", "at night", "twice a week"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
