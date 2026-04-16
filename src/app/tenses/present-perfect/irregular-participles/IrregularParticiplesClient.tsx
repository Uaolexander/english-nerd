"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PP_SPEED_QUESTIONS, PP_PDF_CONFIG } from "../ppSharedData";
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
    title: "Exercise 1 — Common irregular participles",
    instructions:
      "Choose the correct past participle for each verb. These are the most common irregular verbs in Present Perfect.",
    questions: [
      { id: "1-1",  prompt: "go → ___",    options: ["went", "goed", "gone", "go"],       correctIndex: 2, explanation: "go → went (past simple) → gone (past participle)" },
      { id: "1-2",  prompt: "see → ___",   options: ["saw", "seen", "seed", "see"],        correctIndex: 1, explanation: "see → saw → seen" },
      { id: "1-3",  prompt: "eat → ___",   options: ["ate", "eated", "eaten", "eat"],      correctIndex: 2, explanation: "eat → ate → eaten" },
      { id: "1-4",  prompt: "write → ___", options: ["wrote", "written", "writed", "writ"], correctIndex: 1, explanation: "write → wrote → written" },
      { id: "1-5",  prompt: "take → ___",  options: ["took", "taken", "taked", "take"],    correctIndex: 1, explanation: "take → took → taken" },
      { id: "1-6",  prompt: "speak → ___", options: ["spoke", "spoken", "speaked", "speak"], correctIndex: 1, explanation: "speak → spoke → spoken" },
      { id: "1-7",  prompt: "come → ___",  options: ["came", "come", "comed", "comes"],    correctIndex: 1, explanation: "come → came → come (same as base form)" },
      { id: "1-8",  prompt: "give → ___",  options: ["gave", "given", "gived", "give"],    correctIndex: 1, explanation: "give → gave → given" },
      { id: "1-9",  prompt: "know → ___",  options: ["knew", "known", "knowed", "know"],   correctIndex: 1, explanation: "know → knew → known" },
      { id: "1-10", prompt: "drive → ___", options: ["drove", "driven", "drived", "drive"], correctIndex: 1, explanation: "drive → drove → driven" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — More irregular forms",
    instructions:
      "Choose the correct past participle. These verbs have -ought, -aught, or -oken endings that often cause confusion.",
    questions: [
      { id: "2-1",  prompt: "buy → ___",    options: ["buyed", "bought", "buyed", "buy"],     correctIndex: 1, explanation: "buy → bought → bought (past simple and participle are the same)" },
      { id: "2-2",  prompt: "bring → ___",  options: ["brang", "brought", "bringed", "bring"], correctIndex: 1, explanation: "bring → brought → brought" },
      { id: "2-3",  prompt: "catch → ___",  options: ["catched", "caught", "cought", "catch"], correctIndex: 1, explanation: "catch → caught → caught" },
      { id: "2-4",  prompt: "think → ___",  options: ["thinked", "thought", "thunk", "think"], correctIndex: 1, explanation: "think → thought → thought" },
      { id: "2-5",  prompt: "teach → ___",  options: ["teached", "taught", "tought", "teach"], correctIndex: 1, explanation: "teach → taught → taught" },
      { id: "2-6",  prompt: "fall → ___",   options: ["falled", "fell", "fallen", "fall"],     correctIndex: 2, explanation: "fall → fell → fallen" },
      { id: "2-7",  prompt: "break → ___",  options: ["broke", "broken", "breaked", "break"],  correctIndex: 1, explanation: "break → broke → broken" },
      { id: "2-8",  prompt: "steal → ___",  options: ["stealed", "stole", "stolen", "steal"],  correctIndex: 2, explanation: "steal → stole → stolen" },
      { id: "2-9",  prompt: "choose → ___", options: ["chose", "chosen", "choosed", "choose"], correctIndex: 1, explanation: "choose → chose → chosen" },
      { id: "2-10", prompt: "freeze → ___", options: ["froze", "frozen", "freezed", "freeze"], correctIndex: 1, explanation: "freeze → froze → frozen" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Easily confused forms",
    instructions:
      "Some verbs look identical in all three forms. Choose the correct past participle — and note which verbs do NOT change.",
    questions: [
      { id: "3-1",  prompt: "do → ___",    options: ["did", "done", "doed", "do"],         correctIndex: 1, explanation: "do → did → done" },
      { id: "3-2",  prompt: "make → ___",  options: ["maked", "made", "make", "maden"],    correctIndex: 1, explanation: "make → made → made" },
      { id: "3-3",  prompt: "run → ___",   options: ["ran", "runned", "run", "runed"],      correctIndex: 2, explanation: "run → ran → run (base form = past participle)" },
      { id: "3-4",  prompt: "put → ___",   options: ["putted", "puted", "putten", "put"],  correctIndex: 3, explanation: "put → put → put (all three forms identical)" },
      { id: "3-5",  prompt: "cut → ___",   options: ["cutted", "cuted", "cutten", "cut"],  correctIndex: 3, explanation: "cut → cut → cut (all three forms identical)" },
      { id: "3-6",  prompt: "let → ___",   options: ["letted", "leted", "letten", "let"],  correctIndex: 3, explanation: "let → let → let (all three forms identical)" },
      { id: "3-7",  prompt: "read → ___",  options: ["readed", "red", "read", "readen"],   correctIndex: 2, explanation: "read → read → read (spelling same, but pronunciation changes: /rɛd/)" },
      { id: "3-8",  prompt: "get → ___",   options: ["getted", "goten", "got", "gat"],     correctIndex: 2, explanation: "get → got → got (British English; American English also allows 'gotten')" },
      { id: "3-9",  prompt: "hit → ___",   options: ["hitted", "hiten", "hitten", "hit"],  correctIndex: 3, explanation: "hit → hit → hit (all three forms identical)" },
      { id: "3-10", prompt: "set → ___",   options: ["setted", "seten", "setten", "set"],  correctIndex: 3, explanation: "set → set → set (all three forms identical)" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Participles in context",
    instructions:
      "Choose the correct past participle to complete each Present Perfect sentence. Focus on the verb in bold.",
    questions: [
      { id: "4-1",  prompt: "She has ___ (write) three novels.",            options: ["wrote", "written", "write", "writing"],       correctIndex: 1, explanation: "Past participle of write is written." },
      { id: "4-2",  prompt: "I have ___ (see) that film twice.",            options: ["saw", "seen", "see", "seeing"],               correctIndex: 1, explanation: "Past participle of see is seen." },
      { id: "4-3",  prompt: "They have ___ (go) home already.",             options: ["went", "gone", "go", "going"],                correctIndex: 1, explanation: "Past participle of go is gone." },
      { id: "4-4",  prompt: "He has ___ (break) his leg.",                  options: ["broke", "broken", "break", "breaking"],       correctIndex: 1, explanation: "Past participle of break is broken." },
      { id: "4-5",  prompt: "We have never ___ (eat) here before.",         options: ["ate", "eaten", "eat", "eating"],              correctIndex: 1, explanation: "Past participle of eat is eaten." },
      { id: "4-6",  prompt: "Have you ever ___ (drive) a sports car?",      options: ["drove", "driven", "drive", "driving"],        correctIndex: 1, explanation: "Past participle of drive is driven." },
      { id: "4-7",  prompt: "She has ___ (choose) a red dress.",            options: ["chose", "chosen", "choose", "choosing"],      correctIndex: 1, explanation: "Past participle of choose is chosen." },
      { id: "4-8",  prompt: "The phone has ___ (fall) off the table.",      options: ["fell", "fallen", "fall", "falling"],          correctIndex: 1, explanation: "Past participle of fall is fallen." },
      { id: "4-9",  prompt: "I have already ___ (buy) the tickets.",        options: ["bought", "buyed", "buy", "buying"],           correctIndex: 0, explanation: "Past participle of buy is bought." },
      { id: "4-10", prompt: "Has the thief been ___ (catch)?",              options: ["catched", "caught", "catch", "catching"],     correctIndex: 1, explanation: "Past participle of catch is caught." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Common",
  2: "-ought/-oken",
  3: "Tricky",
  4: "In context",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function IrregularParticiplesClient() {
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
    try { await generateLessonPDF(PP_PDF_CONFIG); } finally { setPdfLoading(false); }
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
          <span className="text-slate-700 font-medium">Irregular Past Participles</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Irregular Participles</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice the irregular past participles you need for Present Perfect. 40 multiple-choice questions covering the most common irregular verbs: from <b>gone</b> and <b>seen</b> to <b>bought</b>, <b>broken</b>, and the tricky unchanged forms like <b>put</b>, <b>cut</b>, and <b>run</b>.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="pp-irregular-participles" subject="Present Perfect" questions={PP_SPEED_QUESTIONS} variant="sidebar" /></div>
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

          {/* Right column */}
          {isPro ? (
            <TenseRecommendations tense="present-perfect" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {!isPro && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
            <div className="hidden lg:block" />
            <SpeedRound gameId="pp-irregular-participles" subject="Present Perfect" questions={PP_SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

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
  const verbs: [string, string, string][] = [
    ["be", "was/were", "been"],
    ["become", "became", "become"],
    ["begin", "began", "begun"],
    ["break", "broke", "broken"],
    ["bring", "brought", "brought"],
    ["build", "built", "built"],
    ["buy", "bought", "bought"],
    ["catch", "caught", "caught"],
    ["choose", "chose", "chosen"],
    ["come", "came", "come"],
    ["cut", "cut", "cut"],
    ["do", "did", "done"],
    ["drive", "drove", "driven"],
    ["eat", "ate", "eaten"],
    ["fall", "fell", "fallen"],
    ["feel", "felt", "felt"],
    ["find", "found", "found"],
    ["fly", "flew", "flown"],
    ["forget", "forgot", "forgotten"],
    ["freeze", "froze", "frozen"],
    ["get", "got", "got"],
    ["give", "gave", "given"],
    ["go", "went", "gone"],
    ["grow", "grew", "grown"],
    ["have", "had", "had"],
    ["hear", "heard", "heard"],
    ["hit", "hit", "hit"],
    ["keep", "kept", "kept"],
    ["know", "knew", "known"],
    ["leave", "left", "left"],
    ["let", "let", "let"],
    ["lose", "lost", "lost"],
    ["make", "made", "made"],
    ["meet", "met", "met"],
    ["put", "put", "put"],
    ["read", "read", "read"],
    ["run", "ran", "run"],
    ["see", "saw", "seen"],
    ["set", "set", "set"],
    ["speak", "spoke", "spoken"],
    ["spend", "spent", "spent"],
    ["steal", "stole", "stolen"],
    ["swim", "swam", "swum"],
    ["take", "took", "taken"],
    ["teach", "taught", "taught"],
    ["tell", "told", "told"],
    ["think", "thought", "thought"],
    ["write", "wrote", "written"],
  ];

  return (
    <div className="space-y-8">

      {/* Formula */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Present Perfect formula</div>
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "have / has", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She has written three books." />
            <Ex en="They have gone home." />
            <Ex en="Have you ever eaten sushi?" />
          </div>
        </div>
      </div>

      {/* Pattern cards */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common patterns</div>
        <div className="space-y-3">
          <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-4 space-y-2">
            <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">-en ending</span>
            <p className="text-xs text-slate-600">Many verbs add <b>-en</b> or change the vowel + add <b>-en</b>.</p>
            <div className="flex flex-wrap gap-2">
              {["write → written", "take → taken", "speak → spoken", "drive → driven", "give → given", "know → known", "fall → fallen", "break → broken", "steal → stolen", "choose → chosen", "freeze → frozen", "grow → grown"].map(v => (
                <span key={v} className="rounded-lg bg-white border border-sky-200 px-2 py-1 text-xs font-semibold text-sky-800">{v}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-violet-50 to-white border border-violet-100 p-4 space-y-2">
            <span className="inline-flex items-center rounded-xl bg-violet-500 px-3 py-1 text-xs font-black text-white">-ought / -aught</span>
            <p className="text-xs text-slate-600">Past simple and past participle are identical for these verbs.</p>
            <div className="flex flex-wrap gap-2">
              {["buy → bought", "bring → brought", "catch → caught", "think → thought", "teach → taught"].map(v => (
                <span key={v} className="rounded-lg bg-white border border-violet-200 px-2 py-1 text-xs font-semibold text-violet-800">{v}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-amber-50 to-white border border-amber-100 p-4 space-y-2">
            <span className="inline-flex items-center rounded-xl bg-amber-500 px-3 py-1 text-xs font-black text-white">Unchanged forms</span>
            <p className="text-xs text-slate-600">These verbs are identical in all three forms (base, past simple, past participle).</p>
            <div className="flex flex-wrap gap-2">
              {["put → put → put", "cut → cut → cut", "let → let → let", "hit → hit → hit", "set → set → set", "read → read → read", "run → ran → run", "come → came → come"].map(v => (
                <span key={v} className="rounded-lg bg-white border border-amber-200 px-2 py-1 text-xs font-semibold text-amber-800">{v}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full reference table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Complete reference: base → past simple → past participle</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-3 py-2 font-black text-slate-700">Base form</th>
                <th className="px-3 py-2 font-black text-amber-700">Past simple</th>
                <th className="px-3 py-2 font-black text-emerald-700">Past participle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {verbs.map(([base, ps, pp], i) => (
                <tr key={base} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-3 py-2 font-semibold text-slate-700">{base}</td>
                  <td className="px-3 py-2 text-amber-700 font-mono">{ps}</td>
                  <td className={`px-3 py-2 font-mono font-bold ${pp === base ? "text-violet-700" : "text-emerald-700"}`}>{pp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Tip:</span> Entries in <span className="text-violet-700 font-bold">purple</span> mean the past participle looks the same as the base form — but is still different from the past simple (e.g. <em>run → ran → run</em>).
        </div>
      </div>

    </div>
  );
}
