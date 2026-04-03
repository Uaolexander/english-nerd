"use client";
import { useState } from "react";
import AdUnit from "@/components/AdUnit";

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
      "Tap the word tiles in the correct order to build a Past Perfect sentence. Tap a placed word to remove it.",
    questions: [
      {
        id: "sb1-1",
        words: ["She", "had", "already", "left", "when", "I", "arrived", "."],
        correct: "She had already left when I arrived .",
        explanation: "had already left — 'already' goes between had and the past participle.",
      },
      {
        id: "sb1-2",
        words: ["They", "had", "finished", "the", "project", "before", "the", "deadline", "."],
        correct: "They had finished the project before the deadline .",
        explanation: "had finished — Past Perfect: action completed before another past event.",
      },
      {
        id: "sb1-3",
        words: ["He", "hadn't", "seen", "her", "in", "years", "."],
        correct: "He hadn't seen her in years .",
        explanation: "hadn't seen — negative Past Perfect.",
      },
      {
        id: "sb1-4",
        words: ["By", "the", "time", "we", "arrived", ",", "the", "film", "had", "started", "."],
        correct: "By the time we arrived , the film had started .",
        explanation: "had started — 'by the time' triggers Past Perfect.",
      },
      {
        id: "sb1-5",
        words: ["I", "had", "never", "tasted", "sushi", "before", "that", "evening", "."],
        correct: "I had never tasted sushi before that evening .",
        explanation: "had never tasted — 'never' goes between had and the past participle.",
      },
      {
        id: "sb1-6",
        words: ["We", "hadn't", "met", "each", "other", "before", "the", "conference", "."],
        correct: "We hadn't met each other before the conference .",
        explanation: "hadn't met — negative Past Perfect before a past event.",
      },
      {
        id: "sb1-7",
        words: ["She", "had", "lived", "in", "Rome", "for", "two", "years", "before", "moving", "."],
        correct: "She had lived in Rome for two years before moving .",
        explanation: "had lived — duration completed before another past event.",
      },
      {
        id: "sb1-8",
        words: ["He", "had", "just", "finished", "eating", "when", "the", "phone", "rang", "."],
        correct: "He had just finished eating when the phone rang .",
        explanation: "had just finished — 'just' between had and the past participle.",
      },
      {
        id: "sb1-9",
        words: ["They", "hadn't", "spoken", "to", "each", "other", "for", "years", "."],
        correct: "They hadn't spoken to each other for years .",
        explanation: "hadn't spoken — negative Past Perfect; irregular: speak → spoken.",
      },
      {
        id: "sb1-10",
        words: ["By", "2020", ",", "she", "had", "written", "three", "novels", "."],
        correct: "By 2020 , she had written three novels .",
        explanation: "had written — 'by [year]' + Past Perfect; irregular: write → written.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Questions",
    instructions:
      "Arrange the tiles to form a correct Past Perfect question. Remember: Had + subject + past participle + ?",
    questions: [
      {
        id: "sb2-1",
        words: ["Had", "they", "finished", "before", "you", "arrived", "?"],
        correct: "Had they finished before you arrived ?",
        explanation: "Had they finished? — Past Perfect question: Had + subject + past participle.",
      },
      {
        id: "sb2-2",
        words: ["Had", "she", "ever", "been", "to", "Japan", "?"],
        correct: "Had she ever been to Japan ?",
        explanation: "Had she ever been? — 'ever' between Had and the past participle.",
      },
      {
        id: "sb2-3",
        words: ["Had", "he", "eaten", "before", "the", "party", "?"],
        correct: "Had he eaten before the party ?",
        explanation: "Had he eaten? — standard Past Perfect question.",
      },
      {
        id: "sb2-4",
        words: ["Had", "the", "train", "already", "left", "?"],
        correct: "Had the train already left ?",
        explanation: "Had the train already left? — 'already' between Had and the past participle.",
      },
      {
        id: "sb2-5",
        words: ["Had", "you", "seen", "that", "film", "before", "?"],
        correct: "Had you seen that film before ?",
        explanation: "Had you seen? — 'before' at the end of the question.",
      },
      {
        id: "sb2-6",
        words: ["Had", "they", "met", "each", "other", "before", "the", "party", "?"],
        correct: "Had they met each other before the party ?",
        explanation: "Had they met? — Past Perfect question with 'before'.",
      },
      {
        id: "sb2-7",
        words: ["Had", "she", "spoken", "to", "the", "manager", "?"],
        correct: "Had she spoken to the manager ?",
        explanation: "Had she spoken? — irregular: speak → spoken.",
      },
      {
        id: "sb2-8",
        words: ["Had", "he", "lived", "there", "before", "?"],
        correct: "Had he lived there before ?",
        explanation: "Had he lived? — simple Past Perfect question.",
      },
      {
        id: "sb2-9",
        words: ["Had", "the", "meeting", "started", "by", "the", "time", "you", "arrived", "?"],
        correct: "Had the meeting started by the time you arrived ?",
        explanation: "Had the meeting started by the time…? — 'by the time' in a question.",
      },
      {
        id: "sb2-10",
        words: ["Had", "you", "ever", "tried", "Thai", "food", "before", "that", "?"],
        correct: "Had you ever tried Thai food before that ?",
        explanation: "Had you ever tried? — 'ever' between Had and the past participle.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — Mixed (Affirmative, Negative & Questions)",
    instructions:
      "A mix of Past Perfect affirmative, negative, and question sentences. Arrange the tiles carefully — pay attention to word order and contractions.",
    questions: [
      {
        id: "sb3-1",
        words: ["When", "I", "got", "home", ",", "my", "family", "had", "already", "eaten", "."],
        correct: "When I got home , my family had already eaten .",
        explanation: "had already eaten — completed before another past event.",
      },
      {
        id: "sb3-2",
        words: ["She", "hadn't", "finished", "her", "homework", "when", "her", "mother", "called", "."],
        correct: "She hadn't finished her homework when her mother called .",
        explanation: "hadn't finished — not completed before the past event.",
      },
      {
        id: "sb3-3",
        words: ["Had", "they", "ever", "visited", "Australia", "before", "that", "trip", "?"],
        correct: "Had they ever visited Australia before that trip ?",
        explanation: "Had they ever visited? — Past Perfect question with 'ever'.",
      },
      {
        id: "sb3-4",
        words: ["After", "he", "had", "read", "the", "report", ",", "he", "called", "a", "meeting", "."],
        correct: "After he had read the report , he called a meeting .",
        explanation: "had read — action completed before 'called a meeting'.",
      },
      {
        id: "sb3-5",
        words: ["I", "wished", "I", "had", "listened", "to", "her", "advice", "."],
        correct: "I wished I had listened to her advice .",
        explanation: "had listened — 'wish' about a past situation needs Past Perfect.",
      },
      {
        id: "sb3-6",
        words: ["Had", "you", "booked", "a", "table", "before", "you", "arrived", "?"],
        correct: "Had you booked a table before you arrived ?",
        explanation: "Had you booked? — Past Perfect question before a past event.",
      },
      {
        id: "sb3-7",
        words: ["He", "said", "he", "had", "never", "been", "to", "Africa", "."],
        correct: "He said he had never been to Africa .",
        explanation: "had never been — reported speech backshift + 'never' between had and participle.",
      },
      {
        id: "sb3-8",
        words: ["By", "the", "time", "she", "retired", ",", "she", "had", "worked", "there", "for", "30", "years", "."],
        correct: "By the time she retired , she had worked there for 30 years .",
        explanation: "had worked — duration up to a past reference point.",
      },
      {
        id: "sb3-9",
        words: ["They", "hadn't", "saved", "enough", "money", ",", "so", "they", "couldn't", "buy", "the", "house", "."],
        correct: "They hadn't saved enough money , so they couldn't buy the house .",
        explanation: "hadn't saved — cause (past) for the inability (past).",
      },
      {
        id: "sb3-10",
        words: ["Had", "she", "already", "left", "when", "you", "called", "?"],
        correct: "Had she already left when you called ?",
        explanation: "Had she already left? — Past Perfect question with 'already'.",
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

  const totalAnswered = current.questions.filter(
    (q) => checked[q.id]
  ).length;
  const totalCorrect = current.questions.filter(
    (q) => checked[q.id] && normalize((answers[q.id] ?? []).map((i) => q.words[i]).join(" ")) === normalize(q.correct)
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect">Past Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              Sentence Builder
            </span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">
            Medium
          </span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
            B1–B2
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the word tiles in the correct order to build a Past Perfect sentence. 30 exercises
          across three sets covering affirmative, negative, and questions.
        </p>

        {/* Layout */}
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
                          normalize(
                            (answers[cq.id] ?? []).map((wi) => cq.words[wi]).join(" ")
                          ) === normalize(cq.correct);
                        return (
                          <button
                            key={cq.id}
                            onClick={() => setQIdx(i)}
                            className={`h-2.5 w-2.5 rounded-full transition ${i === qIdx ? "bg-slate-900 scale-125" : isDone ? (isOk ? "bg-emerald-400" : "bg-red-400") : "bg-slate-200"}`}
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
                        <div className="mt-1.5 text-slate-600">{q.explanation}</div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 items-center">
                      {!isChecked ? (
                        <>
                          <button
                            onClick={checkAnswer}
                            disabled={ans.length === 0}
                            className="rounded-xl bg-[#F5DA20] px-5 py-2.5 text-sm font-black text-black hover:opacity-90 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Check
                          </button>
                          <button
                            onClick={resetQ}
                            disabled={ans.length === 0}
                            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-black/5 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Clear
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={resetQ}
                          className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Navigation between questions */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <button
                      onClick={goPrev}
                      disabled={qIdx === 0}
                      className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-black/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <div className="text-xs text-slate-500">
                      Question {qIdx + 1} of {current.questions.length}
                    </div>
                    {qIdx < current.questions.length - 1 ? (
                      <button
                        onClick={goNext}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
                      >
                        Next →
                      </button>
                    ) : exNo < 3 ? (
                      <button
                        onClick={() => switchSet((exNo + 1) as 1 | 2 | 3)}
                        className="rounded-xl bg-[#F5DA20] px-4 py-2.5 text-sm font-black text-black hover:opacity-90 transition"
                      >
                        Next Set →
                      </button>
                    ) : (
                      <div className="w-24" />
                    )}
                  </div>

                  {/* Set score summary (shown after all answered) */}
                  {totalAnswered === current.questions.length && (
                    <div
                      className={`mt-6 rounded-2xl border p-4 ${
                        totalCorrect / current.questions.length >= 0.8
                          ? "border-emerald-200 bg-emerald-50"
                          : totalCorrect / current.questions.length >= 0.5
                          ? "border-amber-200 bg-amber-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`text-3xl font-black ${
                              totalCorrect / current.questions.length >= 0.8
                                ? "text-emerald-700"
                                : totalCorrect / current.questions.length >= 0.5
                                ? "text-amber-700"
                                : "text-red-700"
                            }`}
                          >
                            {Math.round((totalCorrect / current.questions.length) * 100)}%
                          </div>
                          <div className="mt-0.5 text-sm text-slate-600">
                            {totalCorrect} out of {current.questions.length} correct
                          </div>
                        </div>
                        <div className="text-3xl">
                          {totalCorrect / current.questions.length >= 0.8
                            ? "🎉"
                            : totalCorrect / current.questions.length >= 0.5
                            ? "💪"
                            : "📖"}
                        </div>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            totalCorrect / current.questions.length >= 0.8
                              ? "bg-emerald-500"
                              : totalCorrect / current.questions.length >= 0.5
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.round((totalCorrect / current.questions.length) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {totalCorrect / current.questions.length >= 0.8
                          ? "Excellent! Move on to the next set."
                          : totalCorrect / current.questions.length >= 0.5
                          ? "Good effort! Review the incorrect ones and try again."
                          : "Keep practising — check the Explanation tab and try again."}
                      </div>
                    </div>
                  )}
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

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/past-perfect/spot-the-mistake"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Spot the Mistake
          </a>
          <a
            href="/tenses/past-perfect"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            All Past Perfect exercises →
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
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span
          key={i}
          className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}
        >
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

function Explanation() {
  return (
    <div className="space-y-8">
      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">
            + Affirmative
          </span>
          <Formula
            parts={[
              { text: "Subject", color: "sky" },
              { text: "had", color: "yellow" },
              { text: "past participle", color: "green" },
              { text: ".", color: "slate" },
            ]}
          />
          <Ex en="She had left before he arrived.  ·  They had eaten.  ·  It had happened before." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">
            − Negative
          </span>
          <Formula
            parts={[
              { text: "Subject", color: "sky" },
              { text: "hadn't", color: "red" },
              { text: "past participle", color: "green" },
              { text: ".", color: "slate" },
            ]}
          />
          <Ex en="He hadn't seen it before.  ·  We hadn't met yet.  ·  She hadn't finished." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">
            ? Question
          </span>
          <Formula
            parts={[
              { text: "Had", color: "violet" },
              { text: "subject", color: "sky" },
              { text: "past participle", color: "green" },
              { text: "?", color: "slate" },
            ]}
          />
          <Ex en="Had they finished?  ·  Had she ever been there?  ·  Had it started?" />
        </div>
      </div>

      {/* Word order tips */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Word Order Tips
        </div>
        <div className="space-y-3">
          {[
            {
              label: "Adverbs: already / just / never / ever",
              color: "violet",
              examples: [
                "She had already left. (NOT: She had left already.)",
                "I had just arrived when it started.",
                "They had never seen snow before.",
              ],
            },
            {
              label: "Questions: Had + subject first",
              color: "sky",
              examples: [
                "Had they finished? (NOT: They had finished?)",
                "Had she ever been there?",
                "Had the meeting started?",
              ],
            },
            {
              label: "Sequence with before / after / when / by the time",
              color: "green",
              examples: [
                "After she had eaten, she went for a walk.",
                "By the time I arrived, they had left.",
                "When he called, I had already eaten.",
              ],
            },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = {
              violet: "border-violet-200 bg-violet-50/50",
              sky: "border-sky-200 bg-sky-50/50",
              green: "border-emerald-200 bg-emerald-50/50",
            };
            const badgeMap: Record<string, string> = {
              violet: "bg-violet-100 text-violet-800 border-violet-200",
              sky: "bg-sky-100 text-sky-800 border-sky-200",
              green: "bg-emerald-100 text-emerald-800 border-emerald-200",
            };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span
                  className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}
                >
                  {label}
                </span>
                <div className="space-y-1">
                  {examples.map((ex) => (
                    <Ex key={ex} en={ex} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PP vs Past Simple */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Past Perfect vs Past Simple
        </div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-violet-700">Past Perfect</th>
                <th className="px-4 py-2.5 font-black text-left text-red-700">Past Simple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Action before another past event", "Action at a specific time in the past"],
                ["By the time, before, after, when + sequence needed", "Yesterday, last week, in 2020, at 5pm"],
                ["She had left before I arrived.", "She left at 8am."],
                ["By the time he called, she had finished.", "She finished and then he called."],
                ["I wish I had known.", "I knew it then."],
              ].map(([pp, ps], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-violet-800 font-mono text-xs">{pp}</td>
                  <td className="px-4 py-2.5 text-red-800 font-mono text-xs">{ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Key words for Past Perfect
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "already",
            "just",
            "never",
            "ever",
            "by the time",
            "before",
            "after",
            "when",
            "as soon as",
            "until",
            "by 5pm",
            "by then",
          ].map((t) => (
            <span
              key={t}
              className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
