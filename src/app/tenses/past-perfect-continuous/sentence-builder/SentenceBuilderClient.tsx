"use client";
import { useState } from "react";

type SentenceQ = {
  id: string;
  words: string[];
  correct: string;
  explanation: string;
};
type ExSet = {
  no: 1 | 2 | 3;
  title: string;
  instructions: string;
  questions: SentenceQ[];
};

const SETS: Record<1 | 2 | 3, ExSet> = {
  1: {
    no: 1,
    title: "Set 1 — Affirmative & Negative",
    instructions:
      "Tap the word tiles in the correct order to build a Past Perfect Continuous sentence. Tap a placed word to remove it.",
    questions: [
      {
        id: "sb1-1",
        words: ["She", "had", "been", "waiting", "for", "an", "hour", "when", "he", "arrived", "."],
        correct: "She had been waiting for an hour when he arrived .",
        explanation: "had been waiting — PPC for duration (an hour) before another past event.",
      },
      {
        id: "sb1-2",
        words: ["He", "hadn't", "been", "sleeping", "well", "for", "days", "."],
        correct: "He hadn't been sleeping well for days .",
        explanation: "hadn't been sleeping — negative PPC showing lack of activity over a period.",
      },
      {
        id: "sb1-3",
        words: ["They", "had", "been", "working", "since", "early", "morning", "."],
        correct: "They had been working since early morning .",
        explanation: "had been working — PPC with 'since' for activity from a starting point.",
      },
      {
        id: "sb1-4",
        words: ["She", "hadn't", "been", "eating", "properly", ",", "so", "she", "felt", "weak", "."],
        correct: "She hadn't been eating properly , so she felt weak .",
        explanation: "hadn't been eating — negative PPC explains the past result (feeling weak).",
      },
      {
        id: "sb1-5",
        words: ["By", "the", "time", "we", "arrived", ",", "he", "had", "been", "running", "for", "20", "minutes", "."],
        correct: "By the time we arrived , he had been running for 20 minutes .",
        explanation: "had been running — PPC with 'by the time' and 'for' showing duration.",
      },
      {
        id: "sb1-6",
        words: ["I", "had", "been", "studying", "for", "three", "hours", "before", "I", "took", "a", "break", "."],
        correct: "I had been studying for three hours before I took a break .",
        explanation: "had been studying — PPC with 'for' before another past event.",
      },
      {
        id: "sb1-7",
        words: ["They", "hadn't", "been", "practising", ",", "so", "the", "performance", "was", "poor", "."],
        correct: "They hadn't been practising , so the performance was poor .",
        explanation: "hadn't been practising — negative PPC explains the poor result.",
      },
      {
        id: "sb1-8",
        words: ["The", "kitchen", "smelled", "great", "because", "she", "had", "been", "baking", "all", "morning", "."],
        correct: "The kitchen smelled great because she had been baking all morning .",
        explanation: "had been baking — PPC with 'because' explaining a visible past result.",
      },
      {
        id: "sb1-9",
        words: ["He", "had", "been", "writing", "his", "novel", "for", "two", "years", "when", "he", "finished", "it", "."],
        correct: "He had been writing his novel for two years when he finished it .",
        explanation: "had been writing — PPC with 'for' showing the duration of an ongoing activity.",
      },
      {
        id: "sb1-10",
        words: ["She", "hadn't", "been", "paying", "attention", ",", "so", "she", "missed", "the", "announcement", "."],
        correct: "She hadn't been paying attention , so she missed the announcement .",
        explanation: "hadn't been paying — negative PPC; lack of attention caused missing the announcement.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Questions & Short Answers",
    instructions:
      "Arrange the tiles to form a correct Past Perfect Continuous question or short answer. Remember: Had + subject + been + -ing?",
    questions: [
      {
        id: "sb2-1",
        words: ["Had", "they", "been", "waiting", "long", "?"],
        correct: "Had they been waiting long ?",
        explanation: "Had they been waiting? — PPC question: Had + subject + been + -ing.",
      },
      {
        id: "sb2-2",
        words: ["Had", "she", "been", "crying", "before", "the", "meeting", "?"],
        correct: "Had she been crying before the meeting ?",
        explanation: "Had she been crying? — PPC question about a past ongoing activity.",
      },
      {
        id: "sb2-3",
        words: ["Had", "he", "been", "sleeping", "when", "you", "called", "?"],
        correct: "Had he been sleeping when you called ?",
        explanation: "Had he been sleeping? — PPC question asking about an activity in progress.",
      },
      {
        id: "sb2-4",
        words: ["How", "long", "had", "you", "been", "studying", "before", "the", "exam", "?"],
        correct: "How long had you been studying before the exam ?",
        explanation: "How long had you been studying? — 'how long' question with PPC.",
      },
      {
        id: "sb2-5",
        words: ["Had", "they", "been", "arguing", "?", "—", "No", ",", "they", "hadn't", "."],
        correct: "Had they been arguing ? — No , they hadn't .",
        explanation: "Had they been arguing? — No, they hadn't. Short answer uses 'hadn't', not 'hadn't been'.",
      },
      {
        id: "sb2-6",
        words: ["Had", "she", "been", "training", "for", "long", "?"],
        correct: "Had she been training for long ?",
        explanation: "Had she been training? — PPC question about duration.",
      },
      {
        id: "sb2-7",
        words: ["Had", "you", "been", "working", "there", "long", "before", "you", "left", "?"],
        correct: "Had you been working there long before you left ?",
        explanation: "Had you been working? — PPC question with 'before' linking two past actions.",
      },
      {
        id: "sb2-8",
        words: ["Had", "it", "been", "raining", "long", "?", "—", "Yes", ",", "it", "had", "."],
        correct: "Had it been raining long ? — Yes , it had .",
        explanation: "Had it been raining? — Yes, it had. Positive short answer uses 'had'.",
      },
      {
        id: "sb2-9",
        words: ["Had", "he", "been", "running", "before", "you", "saw", "him", "?"],
        correct: "Had he been running before you saw him ?",
        explanation: "Had he been running? — PPC question about an activity before another past event.",
      },
      {
        id: "sb2-10",
        words: ["How", "long", "had", "she", "been", "living", "there", "when", "she", "moved", "?"],
        correct: "How long had she been living there when she moved ?",
        explanation: "How long had she been living? — 'how long' PPC question before a past event.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — Mixed with for / since / when / because / by the time",
    instructions:
      "A mix of affirmative, negative, and question PPC sentences. Pay attention to time expressions: for, since, when, because, by the time.",
    questions: [
      {
        id: "sb3-1",
        words: ["He", "was", "tired", "because", "he", "had", "been", "working", "all", "night", "."],
        correct: "He was tired because he had been working all night .",
        explanation: "had been working — PPC with 'because' explaining a past visible result.",
      },
      {
        id: "sb3-2",
        words: ["By", "the", "time", "the", "match", "started", ",", "it", "had", "been", "raining", "for", "an", "hour", "."],
        correct: "By the time the match started , it had been raining for an hour .",
        explanation: "had been raining — PPC with 'by the time' and 'for' showing duration.",
      },
      {
        id: "sb3-3",
        words: ["She", "hadn't", "been", "sleeping", "well", "since", "the", "accident", "."],
        correct: "She hadn't been sleeping well since the accident .",
        explanation: "hadn't been sleeping — negative PPC with 'since' for starting point of a negative state.",
      },
      {
        id: "sb3-4",
        words: ["Had", "the", "team", "been", "practising", "since", "January", "?"],
        correct: "Had the team been practising since January ?",
        explanation: "Had the team been practising? — PPC question with 'since'.",
      },
      {
        id: "sb3-5",
        words: ["When", "I", "called", ",", "she", "had", "been", "on", "the", "phone", "for", "two", "hours", "."],
        correct: "When I called , she had been on the phone for two hours .",
        explanation: "had been on the phone — PPC with 'for' describing duration at a past moment.",
      },
      {
        id: "sb3-6",
        words: ["Her", "hands", "were", "dirty", "because", "she", "had", "been", "gardening", "."],
        correct: "Her hands were dirty because she had been gardening .",
        explanation: "had been gardening — PPC with 'because' for a visible past result.",
      },
      {
        id: "sb3-7",
        words: ["By", "the", "time", "he", "retired", ",", "he", "had", "been", "teaching", "for", "30", "years", "."],
        correct: "By the time he retired , he had been teaching for 30 years .",
        explanation: "had been teaching — PPC with 'by the time' and 'for' showing total duration.",
      },
      {
        id: "sb3-8",
        words: ["They", "hadn't", "been", "communicating", "well", ",", "so", "the", "project", "failed", "."],
        correct: "They hadn't been communicating well , so the project failed .",
        explanation: "hadn't been communicating — negative PPC as cause of a past failure.",
      },
      {
        id: "sb3-9",
        words: ["He", "said", "he", "had", "been", "trying", "to", "reach", "her", "all", "day", "."],
        correct: "He said he had been trying to reach her all day .",
        explanation: "had been trying — PPC in reported speech (backshift from 'has been trying').",
      },
      {
        id: "sb3-10",
        words: ["When", "the", "results", "came", ",", "she", "had", "been", "waiting", "since", "morning", "."],
        correct: "When the results came , she had been waiting since morning .",
        explanation: "had been waiting — PPC with 'since' for the starting point of a past ongoing activity.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3, string> = {
  1: "Aff + Neg",
  2: "Questions",
  3: "Mixed",
};

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function SentenceBuilderClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3>(1);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const current = SETS[exNo];
  const q = current.questions[qIdx];
  const ans = answers[q.id] ?? [];
  const isChecked = checked[q.id] ?? false;
  const built = ans.map((i) => q.words[i]).join(" ");
  const isCorrect = isChecked && normalize(built) === normalize(q.correct);
  const used = new Set(ans);

  function switchSet(n: 1 | 2 | 3) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setQIdx(0);
    setAnswers({});
    setChecked({});
  }

  function addWord(wordIdx: number) {
    if (isChecked) return;
    setAnswers((p) => ({ ...p, [q.id]: [...(p[q.id] ?? []), wordIdx] }));
  }

  function removeWord(posIdx: number) {
    if (isChecked) return;
    setAnswers((p) => {
      const arr = [...(p[q.id] ?? [])];
      arr.splice(posIdx, 1);
      return { ...p, [q.id]: arr };
    });
  }

  function checkAnswer() {
    setChecked((p) => ({ ...p, [q.id]: true }));
  }

  function resetQ() {
    setAnswers((p) => ({ ...p, [q.id]: [] }));
    setChecked((p) => ({ ...p, [q.id]: false }));
  }

  function goNext() {
    if (qIdx < current.questions.length - 1) {
      setQIdx(qIdx + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goPrev() {
    if (qIdx > 0) {
      setQIdx(qIdx - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const totalAnswered = current.questions.filter((cq) => checked[cq.id]).length;
  const totalCorrect = current.questions.filter(
    (cq) =>
      checked[cq.id] &&
      normalize((answers[cq.id] ?? []).map((i) => cq.words[i]).join(" ")) === normalize(cq.correct)
  ).length;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect-continuous">Past Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              Sentence Builder
            </span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">
            Hard
          </span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
            B2
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the word tiles in the correct order to build a Past Perfect Continuous sentence. 30
          exercises across three sets covering affirmative, negative, questions, and time expressions.
        </p>

        {/* Layout */}
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
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3] as const).map((n) => (
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
                  {/* Set header */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3] as const).map((n) => (
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

                  {/* Progress indicator */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex gap-1">
                      {current.questions.map((cq, i) => {
                        const isDone = checked[cq.id];
                        const isOk =
                          isDone &&
                          normalize((answers[cq.id] ?? []).map((wi) => cq.words[wi]).join(" ")) ===
                            normalize(cq.correct);
                        return (
                          <button
                            key={cq.id}
                            onClick={() => setQIdx(i)}
                            className={`h-2.5 w-2.5 rounded-full transition ${
                              i === qIdx
                                ? "bg-slate-900 scale-125"
                                : isDone
                                ? isOk
                                  ? "bg-emerald-400"
                                  : "bg-red-400"
                                : "bg-slate-200"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-xs text-slate-500">
                      {qIdx + 1} / {current.questions.length}
                      {totalAnswered > 0 && (
                        <span className="ml-2 text-emerald-600 font-semibold">
                          {totalCorrect}/{totalAnswered} correct
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Question card */}
                  <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                        {qIdx + 1}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">
                        Arrange the words into a correct sentence
                      </div>
                    </div>

                    {/* Built sentence area */}
                    <div
                      className={`min-h-[56px] rounded-xl border-2 p-3 mb-4 flex flex-wrap gap-1.5 items-center transition ${
                        isChecked
                          ? isCorrect
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-red-400 bg-red-50"
                          : "border-dashed border-black/20 bg-slate-50"
                      }`}
                    >
                      {ans.length === 0 ? (
                        <span className="text-slate-400 text-sm">Tap words below to build the sentence…</span>
                      ) : (
                        ans.map((wordIdx, posIdx) => (
                          <button
                            key={posIdx}
                            onClick={() => removeWord(posIdx)}
                            disabled={isChecked}
                            className={`rounded-lg border px-2.5 py-1.5 text-sm font-semibold transition ${
                              isChecked
                                ? isCorrect
                                  ? "border-emerald-300 bg-emerald-100 text-emerald-800 cursor-default"
                                  : "border-red-300 bg-red-100 text-red-800 cursor-default"
                                : "border-[#F5DA20] bg-[#F5DA20]/20 text-slate-900 hover:bg-red-50 hover:border-red-300"
                            }`}
                          >
                            {q.words[wordIdx]}
                          </button>
                        ))
                      )}
                    </div>

                    {/* Word tiles */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {q.words.map((word, wordIdx) => {
                        const isUsed = used.has(wordIdx);
                        return (
                          <button
                            key={wordIdx}
                            onClick={() => !isUsed && addWord(wordIdx)}
                            disabled={isUsed || isChecked}
                            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                              isUsed || isChecked
                                ? "border-black/5 bg-black/5 text-slate-400 cursor-default"
                                : "border-black/10 bg-white text-slate-900 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 active:scale-95"
                            }`}
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback */}
                    {isChecked && (
                      <div className="mt-2 mb-4 text-sm">
                        {isCorrect ? (
                          <div className="text-emerald-700 font-semibold">✅ Correct!</div>
                        ) : (
                          <div>
                            <div className="text-red-700 font-semibold">❌ Not quite.</div>
                            <div className="mt-1 text-slate-700">
                              <b>Correct:</b> {q.correct}
                            </div>
                          </div>
                        )}
                        <div className="mt-1 text-slate-600">{q.explanation}</div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {!isChecked ? (
                        <>
                          <button
                            onClick={checkAnswer}
                            disabled={ans.length === 0}
                            className="rounded-xl bg-[#F5DA20] px-5 py-2.5 text-sm font-black text-black hover:opacity-90 transition disabled:opacity-40"
                          >
                            Check
                          </button>
                          <button
                            onClick={resetQ}
                            disabled={ans.length === 0}
                            className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-black/5 transition disabled:opacity-40"
                          >
                            Clear
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={resetQ}
                          className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
                        >
                          Try Again
                        </button>
                      )}
                      <button
                        onClick={goPrev}
                        disabled={qIdx === 0}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-black/5 transition disabled:opacity-40"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={goNext}
                        disabled={qIdx === current.questions.length - 1}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-black/5 transition disabled:opacity-40"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <SbExplanation />
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

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/past-perfect-continuous"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← All Past Perfect Continuous
          </a>
          <a
            href="/tenses/past-perfect-continuous/had-been-ing"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: had been + -ing →
          </a>
        </div>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}>
          {p.text}
        </span>
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

function SbExplanation() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[{ text: "Subject", color: "sky" }, { text: "had been", color: "yellow" }, { text: "verb + -ing", color: "green" }, { text: "(for/since/when…)", color: "slate" }]} />
          <Ex en="She had been waiting for an hour.  ·  They had been working since morning." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[{ text: "Subject", color: "sky" }, { text: "hadn't been", color: "red" }, { text: "verb + -ing", color: "green" }, { text: ".", color: "slate" }]} />
          <Ex en="He hadn't been sleeping well.  ·  They hadn't been communicating." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[{ text: "Had", color: "violet" }, { text: "subject", color: "sky" }, { text: "been", color: "orange" }, { text: "verb + -ing", color: "green" }, { text: "?", color: "slate" }]} />
          <Ex en="Had they been waiting long?  ·  How long had you been studying?" />
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time Expressions</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-slate-700">Expression</th>
                <th className="px-4 py-2.5 font-black text-left text-slate-700">Use</th>
                <th className="px-4 py-2.5 font-black text-left text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["for", "duration", "for 2 hours / for years"],
                ["since", "starting point", "since Monday / since 2018"],
                ["when", "another past event", "when he arrived"],
                ["by the time", "deadline in the past", "by the time she left"],
                ["because", "cause of a result", "because she had been crying"],
              ].map(([expr, use, ex], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{expr}</td>
                  <td className="px-4 py-2.5 text-slate-600">{use}</td>
                  <td className="px-4 py-2.5 text-slate-500 font-mono text-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-black mb-1">⚠ Word order matters!</div>
        <p>
          Question form: <b>Had + subject + been + -ing?</b> — NOT &ldquo;Had been + subject&rdquo;.
          <br />
          Short answers: <b>Yes, I had.</b> / <b>No, they hadn&apos;t.</b> — do NOT repeat &ldquo;been&rdquo;.
        </p>
      </div>
    </div>
  );
}
