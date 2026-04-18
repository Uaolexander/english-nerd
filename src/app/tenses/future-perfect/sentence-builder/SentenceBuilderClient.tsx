"use client";

import { useState } from "react";
import { useLiveSync } from "@/lib/useLiveSync";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { FUTPERF_SPEED_QUESTIONS, FUTPERF_PDF_CONFIG } from "../futPerfSharedData";
import TenseRecommendations from "@/components/TenseRecommendations";

/* ─── Types ─────────────────────────────────────────────────────────────── */

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

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Affirmative: will have + past participle + by...",
    instructions: "Tap the English tiles in the correct order to build an affirmative Future Perfect sentence.",
    questions: [
      { id: "1-1",  words: ["PM", "will", "6", "she", "finished", "By", "have", "."],                       correct: "By 6 PM she will have finished .",        explanation: "By 6 PM + will have finished. Affirmative Future Perfect." },
      { id: "1-2",  words: ["arrive", "you", "left", "the", "will", "time", "By", "I", "have", "."],         correct: "By the time you arrive I will have left .", explanation: "By the time you arrive + I will have left (leave → left)." },
      { id: "1-3",  words: ["year", "will", "they", "have", "next", "stadium", "the", "By", "built", "."],   correct: "By next year they will have built the stadium .", explanation: "By next year + will have built (build → built)." },
      { id: "1-4",  words: ["tomorrow", "he", "it", "forgotten", "about", "By", "will", "have", "."],        correct: "By tomorrow he will have forgotten about it .", explanation: "By tomorrow + will have forgotten (forget → forgotten)." },
      { id: "1-5",  words: ["starts", "film", "we", "eaten", "the", "have", "will", "By", "time", "the", "."], correct: "By the time the film starts we will have eaten .", explanation: "By the time the film starts + we will have eaten (eat → eaten)." },
      { id: "1-6",  words: ["Monday", "team", "the", "project", "By", "the", "will", "completed", "have", "."], correct: "By Monday the team will have completed the project .", explanation: "By Monday + will have completed (regular)." },
      { id: "1-7",  words: ["noon", "report", "written", "the", "have", "will", "she", "By", "."],           correct: "By noon she will have written the report .",  explanation: "By noon + will have written (write → written)." },
      { id: "1-8",  words: ["end", "the", "month", "of", "spent", "savings", "his", "he", "all", "will", "have", "By", "."], correct: "By the end of the month he will have spent all his savings .", explanation: "By the end of the month + will have spent (spend → spent)." },
      { id: "1-9",  words: ["you", "call", "already", "gone", "I", "will", "have", "By", "time", "the", "."], correct: "By the time you call I will have already gone .", explanation: "will have already gone (go → gone). 'already' comes between have and the participle." },
      { id: "1-10", words: ["Friday", "decision", "a", "By", "made", "they", "will", "have", "."],           correct: "By Friday they will have made a decision .",  explanation: "By Friday + will have made (make → made)." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative and questions",
    instructions: "Build negative Future Perfect sentences (won't have) and questions (Will ... have ...?).",
    questions: [
      { id: "2-1",  words: ["finished", "she", "report", "won't", "by", "have", "Friday", "the", "."],       correct: "She won't have finished the report by Friday .", explanation: "Negative: won't have + past participle. She won't have finished." },
      { id: "2-2",  words: ["arrived", "8", "PM", "by", "won't", "they", "have", "."],                       correct: "They won't have arrived by 8 PM .",            explanation: "Negative: They won't have arrived by 8 PM." },
      { id: "2-3",  words: ["finished", "you", "by", "Will", "have", "tomorrow", "?"],                       correct: "Will you have finished by tomorrow ?",          explanation: "Question: Will + subject + have + past participle?" },
      { id: "2-4",  words: ["left", "she", "by", "time", "Will", "we", "have", "arrive", "?"],               correct: "Will she have left by the time we arrive ?",   explanation: "Will she have left? Question about completed action (leave → left)." },
      { id: "2-5",  words: ["saved", "enough", "he", "by", "then", "won't", "have", "."],                    correct: "He won't have saved enough by then .",          explanation: "Negative: He won't have saved enough by then." },
      { id: "2-6",  words: ["completed", "they", "project", "Will", "the", "have", "deadline", "by", "the", "?"], correct: "Will they have completed the project by the deadline ?", explanation: "Will they have completed? Future Perfect question." },
      { id: "2-7",  words: ["eaten", "we", "won't", "starts", "by", "show", "the", "time", "have", "."],     correct: "We won't have eaten by the time the show starts .", explanation: "Negative: We won't have eaten (eat → eaten)." },
      { id: "2-8",  words: ["built", "Will", "school", "the", "by", "September", "they", "have", "?"],       correct: "Will they have built the school by September ?", explanation: "Will they have built? (build → built)." },
      { id: "2-9",  words: ["launched", "By", "the", "won't", "product", "Christmas", "company", "have", "."], correct: "By Christmas the company won't have launched the product .", explanation: "Negative: won't have launched." },
      { id: "2-10", words: ["made", "Will", "decision", "a", "they", "by", "have", "Monday", "?"],           correct: "Will they have made a decision by Monday ?",   explanation: "Will they have made? (make → made). Future Perfect question." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Mixed: affirmative, negative, and questions",
    instructions: "Build affirmative, negative, or question sentences using the Future Perfect tiles.",
    questions: [
      { id: "3-1",  words: ["PM", "work", "I", "finished", "will", "6", "my", "By", "have", "."],            correct: "By 6 PM I will have finished my work .",       explanation: "Affirmative: I will have finished my work by 6 PM." },
      { id: "3-2",  words: ["time", "arrive", "already", "left", "she", "the", "By", "will", "you", "have", "."], correct: "By the time you arrive she will have already left .", explanation: "Affirmative with 'already': she will have already left." },
      { id: "3-3",  words: ["by", "he", "Will", "then", "forgotten", "have", "?"],                           correct: "Will he have forgotten by then ?",              explanation: "Question: Will he have forgotten? (forget → forgotten)." },
      { id: "3-4",  words: ["won't", "completed", "course", "the", "she", "summer", "have", "by", "."],      correct: "She won't have completed the course by summer .", explanation: "Negative: She won't have completed by summer." },
      { id: "3-5",  words: ["year", "will", "next", "three", "she", "By", "have", "languages", "learned", "."], correct: "By next year she will have learned three languages .", explanation: "Affirmative: By next year + will have learned." },
      { id: "3-6",  words: ["money", "all", "spent", "trip", "the", "Will", "end", "of", "by", "you", "have", "the", "?"], correct: "Will you have spent all the money by the end of the trip ?", explanation: "Question: Will you have spent? (spend → spent)." },
      { id: "3-7",  words: ["won't", "Monday", "read", "report", "the", "he", "have", "by", "."],             correct: "He won't have read the report by Monday .",    explanation: "Negative: He won't have read by Monday (read → read)." },
      { id: "3-8",  words: ["2030", "scientists", "will", "By", "cure", "found", "a", "have", "."],          correct: "By 2030 scientists will have found a cure .",  explanation: "Affirmative: By 2030 + will have found (find → found)." },
      { id: "3-9",  words: ["noon", "Will", "have", "she", "office", "left", "the", "by", "?"],              correct: "Will she have left the office by noon ?",       explanation: "Question: Will she have left? (leave → left)." },
      { id: "3-10", words: ["end", "the", "year", "of", "ten", "we", "traveled", "By", "to", "countries", "will", "have", "."], correct: "By the end of the year we will have traveled to ten countries .", explanation: "Affirmative: By the end of the year + will have traveled." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3, string> = {
  1: "Affirmative",
  2: "Neg + Q",
  3: "Mixed",
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function SentenceBuilderClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3>(1);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(FUTPERF_PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  const { broadcast } = useLiveSync((payload) => {
    const a = payload.answers as {
      tiles: Record<string, number[]>;
      qIdx: number;
      checked: Record<string, boolean>;
    };
    setAnswers(a.tiles ?? {});
    setQIdx(a.qIdx ?? 0);
    setChecked(a.checked ?? {});
    setExNo((payload.exNo ?? 1) as 1 | 2 | 3);
  });

  function broadcastSB(params: {
    tiles?: Record<string, number[]>;
    qIdx?: number;
    checked?: Record<string, boolean>;
    exNo?: number;
  } = {}) {
    broadcast({
      answers: {
        tiles: params.tiles ?? answers,
        qIdx: params.qIdx ?? qIdx,
        checked: params.checked ?? checked,
      },
      checked: false,
      exNo: params.exNo ?? exNo,
    });
  }

  const current = SETS[exNo];
  const q = current.questions[qIdx];
  const ans = answers[q.id] ?? [];
  const isChecked = checked[q.id] ?? false;

  const usedSet = new Set(ans);
  const builtSentence = ans.map((i) => q.words[i]).join(" ");
  const isCorrect = normalize(builtSentence) === normalize(q.correct);

  function addWord(idx: number) {
    if (isChecked) return;
    const newAnswers = { ...answers, [q.id]: [...(answers[q.id] ?? []), idx] };
    setAnswers(newAnswers);
    broadcastSB({ tiles: newAnswers });
  }

  function removeWord(pos: number) {
    if (isChecked) return;
    const newAnswers = { ...answers, [q.id]: (answers[q.id] ?? []).filter((_, i) => i !== pos) };
    setAnswers(newAnswers);
    broadcastSB({ tiles: newAnswers });
  }

  function checkAnswer() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const newChecked = { ...checked, [q.id]: true };
    setChecked(newChecked);
    broadcastSB({ checked: newChecked });
  }

  function resetQuestion() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const newAnswers = { ...answers, [q.id]: [] };
    const newChecked = { ...checked, [q.id]: false };
    setAnswers(newAnswers);
    setChecked(newChecked);
    broadcastSB({ tiles: newAnswers, checked: newChecked });
  }

  function switchSet(n: 1 | 2 | 3) {
    setExNo(n);
    setQIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
    broadcastSB({ tiles: {}, qIdx: 0, checked: {}, exNo: n });
  }

  const completedCount = current.questions.filter((sq) => {
    const sqAns = answers[sq.id] ?? [];
    return checked[sq.id] && normalize(sqAns.map((i) => sq.words[i]).join(" ")) === normalize(sq.correct);
  }).length;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect">Future Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Builder</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the English tiles in the correct order to build a sentence. Three exercise sets — affirmative, negative &amp; questions, and mixed Future Perfect forms.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {isPro ? (
            <div className=""><SpeedRound gameId="futperf-sentence-builder" subject="Future Perfect" questions={FUTPERF_SPEED_QUESTIONS} variant="sidebar" /></div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <PDFButton onDownload={handlePDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition text-sm ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition text-sm ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question navigator */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {current.questions.map((sq, i) => {
                      const sqAns = answers[sq.id] ?? [];
                      const sqBuilt = sqAns.map((wi) => sq.words[wi]).join(" ");
                      const sqDone = checked[sq.id];
                      const sqCorrect = sqDone && normalize(sqBuilt) === normalize(sq.correct);
                      const sqWrong = sqDone && !sqCorrect;
                      return (
                        <button key={sq.id} onClick={() => { setQIdx(i); broadcastSB({ qIdx: i }); }}
                          className={`h-8 w-8 rounded-lg border text-xs font-black transition ${
                            i === qIdx ? "border-[#F5DA20] bg-[#F5DA20] text-black"
                            : sqCorrect ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                            : sqWrong ? "border-red-300 bg-red-100 text-red-600"
                            : "border-black/10 bg-white text-slate-600 hover:bg-black/5"
                          }`}>
                          {i + 1}
                        </button>
                      );
                    })}
                    <div className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                      <span className="font-black text-emerald-600">{completedCount}</span>
                      <span>/ {current.questions.length}</span>
                    </div>
                  </div>

                  {/* Question card */}
                  <div className={`rounded-2xl border p-5 md:p-6 transition ${
                    isChecked && isCorrect ? "border-emerald-300 bg-emerald-50/30"
                    : isChecked && !isCorrect ? "border-red-200 bg-red-50/20"
                    : "border-black/10 bg-white"
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">{qIdx + 1} / {current.questions.length}</span>
                      {isChecked && (
                        <span className={`text-sm font-black ${isCorrect ? "text-emerald-600" : "text-red-500"}`}>
                          {isCorrect ? "✅ Correct!" : "❌ Not quite"}
                        </span>
                      )}
                    </div>

                    {/* Answer zone */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Your sentence</div>
                      <div className={`min-h-[52px] flex flex-wrap gap-2 items-center rounded-xl border-2 border-dashed p-3 transition ${
                        isChecked && isCorrect ? "border-emerald-400 bg-emerald-50"
                        : isChecked && !isCorrect ? "border-red-300 bg-red-50"
                        : ans.length > 0 ? "border-[#F5DA20]/60 bg-[#FFFBDC]"
                        : "border-black/15 bg-black/[0.02]"
                      }`}>
                        {ans.length === 0 ? (
                          <span className="text-slate-300 text-sm select-none">Tap words below to build the sentence…</span>
                        ) : (
                          ans.map((wordIdx, pos) => (
                            <button key={pos} onClick={() => removeWord(pos)} disabled={isChecked}
                              className={`rounded-lg px-3 py-1.5 text-sm font-bold border transition select-none ${
                                isChecked
                                  ? isCorrect ? "border-emerald-300 bg-emerald-100 text-emerald-800 cursor-default"
                                    : "border-red-300 bg-red-100 text-red-700 cursor-default"
                                  : "border-[#F5DA20] bg-[#F5DA20] text-black hover:bg-amber-300 cursor-pointer"
                              }`}>
                              {q.words[wordIdx]}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Word bank */}
                    <div className="mb-5">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Word bank</div>
                      <div className="flex flex-wrap gap-2">
                        {q.words.map((word, idx) => {
                          const isUsed = usedSet.has(idx);
                          return (
                            <button key={idx} onClick={() => !isChecked && !isUsed && addWord(idx)}
                              disabled={isChecked || isUsed}
                              className={`rounded-lg px-3 py-1.5 text-sm font-bold border transition select-none ${
                                isUsed || isChecked
                                  ? "border-black/8 bg-black/[0.03] text-slate-300 cursor-default"
                                  : "border-black/15 bg-white text-slate-800 hover:border-[#F5DA20] hover:bg-[#FFF9C2] cursor-pointer active:scale-95"
                              }`}>
                              {word}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Feedback */}
                    {isChecked && (
                      <div className={`rounded-xl px-4 py-3 mb-4 text-sm ${isCorrect ? "bg-emerald-100 text-emerald-900" : "bg-amber-50 text-amber-900 border border-amber-200"}`}>
                        {isCorrect ? (
                          <span className="font-bold">👍 {q.explanation}</span>
                        ) : (
                          <>
                            <div className="font-bold mb-1">Correct sentence:</div>
                            <div className="font-mono font-black text-base">{q.correct.replace(/ \./g, ".").replace(/ \?/g, "?")}</div>
                            <div className="mt-1 text-xs text-amber-700">{q.explanation}</div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {!isChecked ? (
                        <>
                          <button onClick={checkAnswer} disabled={ans.length === 0}
                            className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                            Check
                          </button>
                          <button onClick={resetQuestion} disabled={ans.length === 0}
                            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-black/5 transition disabled:opacity-30">
                            Clear
                          </button>
                        </>
                      ) : (
                        <>
                          {!isCorrect && (
                            <button onClick={resetQuestion} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                              Try Again
                            </button>
                          )}
                          {qIdx < current.questions.length - 1 && (
                            <button onClick={() => { const nq = qIdx + 1; setQIdx(nq); broadcastSB({ qIdx: nq }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                              Next →
                            </button>
                          )}
                          {qIdx === current.questions.length - 1 && exNo < 3 && (
                            <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3)} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                              Next Set →
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <Explanation />
              )}
            </div>
          </section>

          {isPro ? (
            <TenseRecommendations tense="future-perfect" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-perfect/spot-the-mistake" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Spot the Mistake</a>
          <a href="/tenses/future-perfect" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Future Perfect →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation ─────────────────────────────────────────────────────────── */

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
            { text: "will have", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By 6 PM, I will have finished.  ·  She will have left.  ·  They will have arrived." />
            <Ex en="By the time you arrive, she will have already gone." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't have", color: "red" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She won't have finished by Friday.  ·  They won't have arrived by 8 PM." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "have", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you have finished by tomorrow?  ·  Will she have left?" />
            <Ex en={`"Will they have arrived?" — "Yes, they will." / "No, they won't."`} />
          </div>
        </div>
      </div>

      {/* will have — all subjects */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will have — same for all subjects</div>
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
                ["I", "will have finished", "won't have finished", "Will I have finished?"],
                ["You / We / They", "will have finished", "won't have finished", "Will you have finished?"],
                ["He / She / It", "will have finished ★", "won't have finished", "Will she have finished?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50" : "bg-white"}>
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
          <span className="font-black">★ Key:</span> <b>will have</b> is identical for every subject. The past participle does not change either.<br />
          <span className="text-xs">&quot;by&quot; + future time is the strongest signal for Future Perfect.</span>
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Future Perfect</div>
        <div className="space-y-2">
          {[
            { label: "Completed before a specific future time", ex: "By 6 PM, I will have finished my work." },
            { label: "Completed before another future action", ex: "By the time you arrive, she will have already left." },
            { label: "Prediction about a completed future state", ex: "He will have forgotten about it by tomorrow." },
          ].map(({ label, ex }) => (
            <div key={label} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800 mb-1.5">{label}</div>
              <Ex en={ex} />
            </div>
          ))}
        </div>
      </div>

      {/* Irregular past participles */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Irregular past participles</div>
        <div className="flex flex-wrap gap-2">
          {[
            "go → gone", "eat → eaten", "see → seen", "come → come", "take → taken",
            "make → made", "write → written", "read → read", "leave → left", "speak → spoken",
            "be → been", "have → had", "find → found", "know → known", "think → thought",
            "buy → bought", "tell → told", "build → built", "break → broken", "fall → fallen",
            "forget → forgotten", "lose → lost", "spend → spent", "send → sent", "run → run",
          ].map((pair) => (
            <span key={pair} className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{pair}</span>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Key time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["by tomorrow", "by Monday", "by next week", "by the time + clause", "by then", "by the end of...", "already", "yet (negative)", "before + future event"].map((t) => (
            <span key={t} className="rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
