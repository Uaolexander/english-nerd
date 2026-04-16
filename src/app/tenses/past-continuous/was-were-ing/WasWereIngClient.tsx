"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PASTCONT_SPEED_QUESTIONS, PASTCONT_PDF_CONFIG } from "../pastContSharedData";
import TenseRecommendations from "@/components/TenseRecommendations";

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
    title: "Exercise 1 — Affirmative: was or were?",
    instructions:
      "was = I / he / she / it (singular). were = you / we / they (plural). was/were + verb-ing = Past Continuous affirmative.",
    questions: [
      { id: "1-1",  prompt: "She ___ reading a book when I arrived.",           options: ["were", "was", "is", "be"],    correctIndex: 1, explanation: "She (singular) → was: She was reading." },
      { id: "1-2",  prompt: "They ___ playing football at 3pm.",                options: ["was", "were", "is", "be"],    correctIndex: 1, explanation: "They (plural) → were: They were playing." },
      { id: "1-3",  prompt: "I ___ watching TV all evening.",                   options: ["were", "was", "is", "be"],    correctIndex: 1, explanation: "I → was: I was watching." },
      { id: "1-4",  prompt: "We ___ waiting for over an hour!",                 options: ["was", "were", "is", "be"],    correctIndex: 1, explanation: "We (plural) → were: We were waiting." },
      { id: "1-5",  prompt: "It ___ getting dark when we arrived.",             options: ["were", "was", "is", "be"],    correctIndex: 1, explanation: "It (singular) → was: It was getting." },
      { id: "1-6",  prompt: "He ___ working late at the office.",               options: ["were", "was", "is", "be"],    correctIndex: 1, explanation: "He (singular) → was: He was working." },
      { id: "1-7",  prompt: "You ___ standing right next to me!",               options: ["was", "were", "is", "be"],    correctIndex: 1, explanation: "You → were: You were standing." },
      { id: "1-8",  prompt: "My parents ___ arguing when I got home.",          options: ["was", "were", "is", "be"],    correctIndex: 1, explanation: "My parents (= they) → were: were arguing." },
      { id: "1-9",  prompt: "The dog ___ barking outside.",                     options: ["were", "was", "are", "be"],   correctIndex: 1, explanation: "The dog (= it) → was: was barking." },
      { id: "1-10", prompt: "All the guests ___ enjoying the party.",           options: ["was", "were", "is", "be"],    correctIndex: 1, explanation: "All the guests (= they) → were: were enjoying." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: wasn't / weren't",
    instructions:
      "Negatives: was not → wasn't / were not → weren't. The -ing form stays the same.",
    questions: [
      { id: "2-1",  prompt: "I ___ listening — sorry, what did you say?",        options: ["wasn't", "weren't", "didn't", "don't"],  correctIndex: 0, explanation: "I → wasn't: I wasn't listening." },
      { id: "2-2",  prompt: "They ___ paying attention in class.",               options: ["wasn't", "weren't", "didn't", "don't"],  correctIndex: 1, explanation: "They → weren't: weren't paying." },
      { id: "2-3",  prompt: "She ___ feeling well that day.",                    options: ["wasn't", "weren't", "didn't", "don't"],  correctIndex: 0, explanation: "She → wasn't: wasn't feeling." },
      { id: "2-4",  prompt: "We ___ expecting so many people.",                  options: ["wasn't", "weren't", "didn't", "don't"],  correctIndex: 1, explanation: "We → weren't: weren't expecting." },
      { id: "2-5",  prompt: "He ___ working — he was just pretending.",          options: ["wasn't", "weren't", "didn't", "don't"],  correctIndex: 0, explanation: "He → wasn't: wasn't working." },
      { id: "2-6",  prompt: "It ___ raining when we left, luckily.",             options: ["wasn't", "weren't", "didn't", "don't"],  correctIndex: 0, explanation: "It → wasn't: wasn't raining." },
      { id: "2-7",  prompt: "You ___ looking where you were going!",             options: ["wasn't", "weren't", "didn't", "don't"],  correctIndex: 1, explanation: "You → weren't: weren't looking." },
      { id: "2-8",  prompt: "The children ___ sleeping — they were still awake.", options: ["wasn't", "weren't", "didn't", "don't"], correctIndex: 1, explanation: "The children → weren't: weren't sleeping." },
      { id: "2-9",  prompt: "I ___ joking — I meant what I said.",              options: ["wasn't", "weren't", "didn't", "don't"],  correctIndex: 0, explanation: "I → wasn't: wasn't joking." },
      { id: "2-10", prompt: "Nobody ___ expecting such a big win!",              options: ["wasn't", "weren't", "didn't", "don't"],  correctIndex: 0, explanation: "Nobody is grammatically singular → wasn't: Nobody was expecting such a big win." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: Was / Were?",
    instructions:
      "Question form: Was/Were + subject + verb-ing? Was she working? Were they playing? Short answers: Yes, he was. / No, they weren't.",
    questions: [
      { id: "3-1",  prompt: "___ she sleeping when you called?",                 options: ["Was", "Were", "Did", "Is"],    correctIndex: 0, explanation: "She → Was: Was she sleeping?" },
      { id: "3-2",  prompt: "___ they having dinner?",                           options: ["Was", "Were", "Did", "Are"],   correctIndex: 1, explanation: "They → Were: Were they having dinner?" },
      { id: "3-3",  prompt: "___ you listening to me?",                          options: ["Was", "Were", "Did", "Are"],   correctIndex: 1, explanation: "You → Were: Were you listening?" },
      { id: "3-4",  prompt: "What ___ he doing at 10pm?",                        options: ["was", "were", "did", "is"],    correctIndex: 0, explanation: "He → was: What was he doing?" },
      { id: "3-5",  prompt: "___ I talking too loudly?",                         options: ["Was", "Were", "Did", "Am"],    correctIndex: 0, explanation: "I → Was: Was I talking too loudly?" },
      { id: "3-6",  prompt: "\"Was he working late?\" — \"Yes, ___.\"",           options: ["he was", "he were", "he did", "he is"], correctIndex: 0, explanation: "Short positive answer: Yes, he was." },
      { id: "3-7",  prompt: "\"Were they waiting long?\" — \"No, ___.\"",         options: ["they weren't", "they didn't", "they wasn't", "they not"], correctIndex: 0, explanation: "Short negative answer: No, they weren't." },
      { id: "3-8",  prompt: "Where ___ you going when I saw you?",               options: ["was", "were", "did", "are"],   correctIndex: 1, explanation: "You → were: Where were you going?" },
      { id: "3-9",  prompt: "___ it snowing when you left?",                     options: ["Was", "Were", "Did", "Is"],    correctIndex: 0, explanation: "It → Was: Was it snowing?" },
      { id: "3-10", prompt: "Why ___ everyone laughing?",                        options: ["was", "were", "did", "is"],    correctIndex: 0, explanation: "Everyone (singular) → was: Why was everyone laughing?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Complete the Past Continuous sentence",
    instructions:
      "Choose the correct complete Past Continuous form. Think about: subject (was/were) + correct -ing spelling.",
    questions: [
      { id: "4-1",  prompt: "At 8pm, she ___ a letter to her friend.",           options: ["was write", "was writing", "were writing", "is writing"],            correctIndex: 1, explanation: "She → was + writing: was writing." },
      { id: "4-2",  prompt: "We ___ chess when the lights went out.",            options: ["was playing", "were played", "were playing", "are playing"],         correctIndex: 2, explanation: "We → were + playing: were playing." },
      { id: "4-3",  prompt: "He ___ when the phone rang.",                       options: ["was sleeping", "were sleeping", "is sleeping", "slept"],             correctIndex: 0, explanation: "He → was + sleeping: was sleeping." },
      { id: "4-4",  prompt: "They ___ hard all morning.",                        options: ["was studying", "were study", "were studying", "are studying"],        correctIndex: 2, explanation: "They → were + studying: were studying." },
      { id: "4-5",  prompt: "I ___ along the street when I saw the accident.",   options: ["was walk", "was walking", "were walking", "am walking"],              correctIndex: 1, explanation: "I → was + walking: was walking." },
      { id: "4-6",  prompt: "What ___ the children ___ in the garden?",          options: ["was … do", "were … do", "were … doing", "was … doing"],               correctIndex: 2, explanation: "Children (plural) → were ... doing." },
      { id: "4-7",  prompt: "She ___ very hard at the time.",                    options: ["was work", "was working", "were working", "is working"],              correctIndex: 1, explanation: "She → was + working: was working." },
      { id: "4-8",  prompt: "It ___ to rain when we left.",                      options: ["was start", "were starting", "was starting", "is starting"],          correctIndex: 2, explanation: "It → was + starting: was starting." },
      { id: "4-9",  prompt: "Why ___ you ___ so late?",                          options: ["were … work", "was … working", "were … working", "are … working"],    correctIndex: 2, explanation: "You → were ... working." },
      { id: "4-10", prompt: "___ you ___ to music when I called?",               options: ["Was … listening", "Were … listening", "Did … listening", "Are … listening"], correctIndex: 1, explanation: "You → Were + listening: Were you listening?" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "was/were",
  2: "wasn't/weren't",
  3: "Was/Were?",
  4: "Full form",
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

export default function WasWereIngClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();

  const current = SETS[exNo];

  const { save } = useProgress();

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PASTCONT_PDF_CONFIG); } finally { setPdfLoading(false); }
  }

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
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-continuous">Past Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">was / were + -ing</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">was / were + -ing</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2–B1</span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Elementary+</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          The Past Continuous needs <b>was/were</b> + <b>verb-ing</b>. 40 questions covering affirmative, negative, and questions — make sure you never mix them up.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="pastcont-was-were-ing" subject="Past Continuous" questions={PASTCONT_SPEED_QUESTIONS} variant="sidebar" /></div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

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
              <PDFButton onDownload={handlePDF} loading={pdfLoading} />
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

          {/* Right column */}
          {isPro ? (
            <TenseRecommendations tense="past-continuous" />
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/past-continuous"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Past Continuous
          </a>
          <a
            href="/tenses/past-continuous/when-while"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: when vs while →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Past Continuous — was / were + -ing</h2>
        <p className="text-slate-500 text-sm">Three forms — affirmative, negative, and questions. Learn which subjects take was and which take were.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Affirmative card */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Affirmative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "was/were", color: "yellow" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "green" }, { dim: true, text: "+" },
            { text: ".", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I was reading." />
            <Ex en="She was working." />
            <Ex en="They were playing." />
          </div>
        </div>

        {/* Negative card */}
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Negative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "wasn't/weren't", color: "red" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "green" }, { dim: true, text: "+" },
            { text: ".", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I wasn't reading." />
            <Ex en="She wasn't working." />
            <Ex en="They weren't playing." />
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[
            { text: "Was/Were", color: "violet" }, { dim: true, text: "+" },
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "green" }, { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Was I reading?" />
            <Ex en="Was she working?" />
            <Ex en="Were they playing?" />
          </div>
        </div>
      </div>

      {/* Full conjugation table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Full conjugation table (work)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Subject</th>
                <th className="text-left font-black text-emerald-600 pb-2 pr-4">✅ Affirmative</th>
                <th className="text-left font-black text-red-500 pb-2 pr-4">❌ Negative</th>
                <th className="text-left font-black text-sky-600 pb-2">❓ Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { subj: "I",         aff: "was working",    neg: "wasn't working",    q: "Was I working?",    highlight: false },
                { subj: "You",       aff: "were working",   neg: "weren't working",   q: "Were you working?", highlight: false },
                { subj: "He / She",  aff: "was working",    neg: "wasn't working",    q: "Was he working?",   highlight: true  },
                { subj: "It",        aff: "was working",    neg: "wasn't working",    q: "Was it working?",   highlight: true  },
                { subj: "We",        aff: "were working",   neg: "weren't working",   q: "Were we working?",  highlight: false },
                { subj: "They",      aff: "were working",   neg: "weren't working",   q: "Were they working?", highlight: false },
              ].map(({ subj, aff, neg, q, highlight }) => (
                <tr key={subj} className={highlight ? "bg-amber-50" : ""}>
                  <td className={`py-2 pr-4 font-black ${highlight ? "text-amber-700" : "text-slate-700"}`}>{subj}</td>
                  <td className={`py-2 pr-4 font-mono text-sm ${highlight ? "text-emerald-700 font-black" : "text-slate-600"}`}>{aff}</td>
                  <td className={`py-2 pr-4 font-mono text-sm ${highlight ? "text-red-600 font-black" : "text-slate-600"}`}>{neg}</td>
                  <td className={`py-2 font-mono text-sm ${highlight ? "text-sky-700 font-black" : "text-slate-600"}`}>{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ He / She / It rows are highlighted</b> — these always use <b>was / wasn&apos;t</b>.
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠</span>
          <h3 className="font-black text-amber-800">NEVER use &apos;did&apos; with Past Continuous!</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-1">Correct ✅</div>
            <div className="font-mono text-sm text-slate-800">Was she working?</div>
            <div className="font-mono text-sm text-slate-800">He wasn&apos;t listening.</div>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <div className="text-xs font-black text-red-600 uppercase tracking-wide mb-1">Wrong ❌</div>
            <div className="font-mono text-sm text-slate-500 line-through opacity-60">Did she be working?</div>
            <div className="font-mono text-sm text-slate-500 line-through opacity-60">He didn&apos;t listening.</div>
          </div>
        </div>
      </div>

      {/* Short answers grid */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">💬</span>
          <h3 className="font-black text-slate-900">Short answers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Question</th>
                <th className="text-left font-black text-emerald-600 pb-2 pr-4">Yes answer</th>
                <th className="text-left font-black text-red-500 pb-2">No answer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { q: "Was he sleeping?",     yes: "Yes, he was.",    no: "No, he wasn't." },
                { q: "Was it working?",      yes: "Yes, it was.",    no: "No, it wasn't." },
                { q: "Were they waiting?",   yes: "Yes, they were.", no: "No, they weren't." },
                { q: "Were you listening?",  yes: "Yes, I was.",     no: "No, I wasn't." },
              ].map(({ q, yes, no }) => (
                <tr key={q}>
                  <td className="py-2 pr-4 font-mono text-slate-700">{q}</td>
                  <td className="py-2 pr-4 font-semibold text-emerald-700">{yes}</td>
                  <td className="py-2 font-semibold text-red-600">{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
