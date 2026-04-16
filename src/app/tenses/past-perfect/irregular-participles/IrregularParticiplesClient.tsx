"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PASTPERF_SPEED_QUESTIONS, PASTPERF_PDF_CONFIG } from "../pastPerfSharedData";
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
    title: "Exercise 1 — Common irregular participles in Past Perfect",
    instructions:
      "Choose the correct past participle to complete each Past Perfect sentence. Remember: had + past participle (NOT past simple form).",
    questions: [
      { id: "1-1",  prompt: "She had ___ to Paris many times before moving there.",   options: ["went", "gone", "go", "goes"],            correctIndex: 1, explanation: "go → went (past simple) → gone (past participle). Had gone is correct." },
      { id: "1-2",  prompt: "By the time he arrived, I had ___ the film.",             options: ["saw", "see", "seen", "seeing"],          correctIndex: 2, explanation: "see → saw (past simple) → seen (past participle). Had seen." },
      { id: "1-3",  prompt: "She had ___ him twice before he recognised her.",         options: ["meet", "met", "meeted", "meeting"],      correctIndex: 1, explanation: "meet → met (past simple) → met (past participle). Both past simple and participle are 'met'." },
      { id: "1-4",  prompt: "He had ___ the letter before sending it.",                options: ["wrote", "write", "written", "writing"],  correctIndex: 2, explanation: "write → wrote (past simple) → written (past participle). Had written." },
      { id: "1-5",  prompt: "By morning, the snow had ___ for hours.",                 options: ["fell", "fall", "fallen", "falling"],     correctIndex: 2, explanation: "fall → fell (past simple) → fallen (past participle). Had fallen." },
      { id: "1-6",  prompt: "I had ___ him about the problem before the meeting.",     options: ["tell", "told", "telled", "telling"],     correctIndex: 1, explanation: "tell → told (past simple) → told (past participle). Had told." },
      { id: "1-7",  prompt: "She had ___ the answer for years.",                       options: ["knew", "know", "known", "knowing"],      correctIndex: 2, explanation: "know → knew (past simple) → known (past participle). Had known." },
      { id: "1-8",  prompt: "They had ___ a new car the month before.",                options: ["buyed", "buy", "bought", "buying"],      correctIndex: 2, explanation: "buy → bought (past simple) → bought (past participle). Had bought." },
      { id: "1-9",  prompt: "I had ___ in that restaurant before — the food was great.", options: ["ate", "eat", "eaten", "eating"],        correctIndex: 2, explanation: "eat → ate (past simple) → eaten (past participle). Had eaten." },
      { id: "1-10", prompt: "By the time we reached the top, the sun had ___.",        options: ["rose", "rise", "risen", "rising"],       correctIndex: 2, explanation: "rise → rose (past simple) → risen (past participle). Had risen." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — -en / -n and vowel-change participles",
    instructions:
      "These verbs form past participles with -en/-n endings or vowel changes. Choose the correct past participle for each Past Perfect sentence.",
    questions: [
      { id: "2-1",  prompt: "The window had ___ in the storm.",                         options: ["breaked", "broke", "broken", "breaking"], correctIndex: 2, explanation: "break → broke → broken. Had broken is the Past Perfect form." },
      { id: "2-2",  prompt: "She had ___ the role of Lady Macbeth twice before.",       options: ["chose", "choose", "chosen", "choosing"],  correctIndex: 2, explanation: "choose → chose → chosen. Had chosen." },
      { id: "2-3",  prompt: "By then, he had ___ to work for fifteen years.",           options: ["drove", "drive", "driven", "driving"],    correctIndex: 2, explanation: "drive → drove → driven. Had driven." },
      { id: "2-4",  prompt: "They had ___ to the manager before writing the report.",   options: ["spoke", "speak", "spoken", "speaking"],   correctIndex: 2, explanation: "speak → spoke → spoken. Had spoken." },
      { id: "2-5",  prompt: "Someone had ___ her bag from the locker.",                 options: ["stole", "steal", "stolen", "stealing"],   correctIndex: 2, explanation: "steal → stole → stolen. Had stolen." },
      { id: "2-6",  prompt: "She had ___ the same dress to three events already.",      options: ["wore", "wear", "worn", "wearing"],        correctIndex: 2, explanation: "wear → wore → worn. Had worn." },
      { id: "2-7",  prompt: "By the deadline, he had ___ the whole chapter.",           options: ["wrote", "write", "written", "writing"],   correctIndex: 2, explanation: "write → wrote → written. Had written." },
      { id: "2-8",  prompt: "She had ___ on the floor when the guests arrived.",        options: ["fell", "fall", "fallen", "falling"],      correctIndex: 2, explanation: "fall → fell → fallen. Had fallen." },
      { id: "2-9",  prompt: "By 2020, the project had ___ beyond its original scope.",  options: ["grew", "grow", "grown", "growing"],       correctIndex: 2, explanation: "grow → grew → grown. Had grown." },
      { id: "2-10", prompt: "He had ___ the prize three years in a row.",               options: ["took", "take", "taken", "taking"],        correctIndex: 2, explanation: "take → took → taken. Had taken." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — -ought / -aught group in Past Perfect",
    instructions:
      "These verbs have irregular participles ending in -ought or -aught. They are the same for past simple and past participle. Choose the correct form.",
    questions: [
      { id: "3-1",  prompt: "She had ___ the tickets online before they sold out.",     options: ["buyed", "buy", "bought", "boughts"],     correctIndex: 2, explanation: "buy → bought → bought. Past simple and past participle are the same: bought." },
      { id: "3-2",  prompt: "He had ___ flowers to apologise.",                          options: ["bringed", "bring", "brought", "broughts"], correctIndex: 2, explanation: "bring → brought → brought. Had brought." },
      { id: "3-3",  prompt: "The goalkeeper had ___ the ball just in time.",             options: ["catched", "catch", "caught", "caughted"], correctIndex: 2, explanation: "catch → caught → caught. Had caught." },
      { id: "3-4",  prompt: "She had ___ English for twenty years before retiring.",     options: ["teached", "teach", "taught", "taughted"], correctIndex: 2, explanation: "teach → taught → taught. Had taught." },
      { id: "3-5",  prompt: "He had ___ carefully before making the decision.",          options: ["thinked", "think", "thought", "thoughd"], correctIndex: 2, explanation: "think → thought → thought. Had thought." },
      { id: "3-6",  prompt: "The soldiers had ___ bravely before the ceasefire.",        options: ["fighted", "fight", "fought", "foughts"],  correctIndex: 2, explanation: "fight → fought → fought. Had fought." },
      { id: "3-7",  prompt: "By the time he found the wallet, someone had ___ it in.",  options: ["bringed", "bring", "brought", "broughts"], correctIndex: 2, explanation: "bring → brought → brought. Had brought." },
      { id: "3-8",  prompt: "She had ___ him maths for three months.",                   options: ["teached", "teach", "taught", "taughted"], correctIndex: 2, explanation: "teach → taught → taught. Had taught." },
      { id: "3-9",  prompt: "By the time the firefighters came, they had ___ the fire.", options: ["fighted", "fight", "fought", "foughts"],  correctIndex: 2, explanation: "fight → fought → fought. Had fought." },
      { id: "3-10", prompt: "I hadn't ___ he would react like that.",                    options: ["thinked", "think", "thought", "thunk"],   correctIndex: 2, explanation: "think → thought → thought. Hadn't thought." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Same-form verbs and tricky forms in Past Perfect",
    instructions:
      "Some verbs have the same base, past simple and past participle (put, cut, hit, let, set). Others are easily confused. Choose the correct form for each Past Perfect sentence.",
    questions: [
      { id: "4-1",  prompt: "She had ___ the files on the wrong shelf.",                options: ["putted", "puts", "put", "putting"],       correctIndex: 2, explanation: "put → put → put. All three forms are identical. Had put." },
      { id: "4-2",  prompt: "He had ___ his finger while cooking.",                     options: ["cutted", "cuts", "cut", "cutting"],       correctIndex: 2, explanation: "cut → cut → cut. All three forms are the same. Had cut." },
      { id: "4-3",  prompt: "By the time I saw the car, someone had ___ it.",            options: ["hitten", "hitted", "hit", "hitting"],     correctIndex: 2, explanation: "hit → hit → hit. All three forms are identical. Had hit." },
      { id: "4-4",  prompt: "She had already ___ the dog in before the storm.",         options: ["letted", "lets", "let", "letting"],       correctIndex: 2, explanation: "let → let → let. All three forms are the same. Had let." },
      { id: "4-5",  prompt: "I had ___ my alarm for 6 am but it didn't ring.",          options: ["setted", "sets", "set", "setting"],       correctIndex: 2, explanation: "set → set → set. All three forms are the same. Had set." },
      { id: "4-6",  prompt: "By the finish line, she had ___ five kilometres.",          options: ["runned", "ran", "run", "runs"],           correctIndex: 2, explanation: "run → ran (past simple) → run (past participle). Had run — NOT 'had ran'." },
      { id: "4-7",  prompt: "He had ___ the report to his manager before leaving.",     options: ["gave", "give", "given", "giving"],        correctIndex: 2, explanation: "give → gave (past simple) → given (past participle). Had given — NOT 'had gave'." },
      { id: "4-8",  prompt: "She had ___ a whole novel by the time she turned 25.",     options: ["wrote", "write", "written", "writing"],   correctIndex: 2, explanation: "write → wrote → written. Had written — NOT 'had wrote'." },
      { id: "4-9",  prompt: "I realised I had ___ the wrong number.",                   options: ["dialled", "dial", "dialed", "dialled"],   correctIndex: 3, explanation: "dial → dialled (British English past participle). Had dialled." },
      { id: "4-10", prompt: "They had ___ the problem before calling for help.",        options: ["fixed", "fix", "fixing", "fixted"],       correctIndex: 0, explanation: "fix → fixed → fixed. A regular verb. Had fixed." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Common forms",
  2: "-en/-n forms",
  3: "-ought/-aught",
  4: "Same form & tricky",
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
    try { await generateLessonPDF(PASTPERF_PDF_CONFIG); } finally { setPdfLoading(false); }
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect">Past Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Irregular Participles</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Irregular Participles</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions on irregular past participles in Past Perfect context: <b>gone</b>, <b>seen</b>, <b>written</b>, <b>bought</b>, <b>put</b>, and many more — grouped by pattern.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="pastperf-irregular-participles" subject="Past Perfect" questions={PASTPERF_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                    <div className="mt-3 flex sm:hidden items-center gap-2">
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
                <PastPerfectExplanation />
              )}
            </div>
          </section>

          {/* Right column */}
          {isPro ? (
            <TenseRecommendations tense="past-perfect" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/past-perfect" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Past Perfect exercises</a>
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

function PastPerfectExplanation() {
  return (
    <div className="space-y-8">

      {/* Formula reminder */}
      <div className="rounded-2xl bg-gradient-to-b from-violet-50 to-white border border-violet-100 p-5 space-y-3">
        <span className="inline-flex items-center rounded-xl bg-violet-500 px-3 py-1 text-xs font-black text-white">Reminder: Past Perfect = had + past participle</span>
        <Formula parts={[
          { text: "had", color: "yellow" },
          { text: "past participle", color: "green" },
          { text: "(NOT past simple form!)", color: "red" },
        ]} />
        <div className="space-y-1.5">
          <Ex en="She had gone — NOT 'she had went'" />
          <Ex en="He had seen — NOT 'he had saw'" />
          <Ex en="They had run — NOT 'they had ran'" />
        </div>
      </div>

      {/* Group 1: -en/-n endings */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Group 1 — -en / -n endings</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Base form</th>
                <th className="px-4 py-2.5 font-black text-amber-700">Past simple</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past participle (had ___)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["go", "went", "gone"],
                ["see", "saw", "seen"],
                ["write", "wrote", "written"],
                ["break", "broke", "broken"],
                ["choose", "chose", "chosen"],
                ["drive", "drove", "driven"],
                ["speak", "spoke", "spoken"],
                ["steal", "stole", "stolen"],
                ["wear", "wore", "worn"],
                ["fall", "fell", "fallen"],
                ["grow", "grew", "grown"],
                ["know", "knew", "known"],
                ["take", "took", "taken"],
                ["rise", "rose", "risen"],
                ["eat", "ate", "eaten"],
              ].map(([base, ps, pp], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700 font-mono text-xs">{base}</td>
                  <td className="px-4 py-2.5 text-amber-700 font-mono text-xs">{ps}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs font-bold">{pp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group 2: -ought/-aught */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Group 2 — -ought / -aught (same past simple and participle)</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Base form</th>
                <th className="px-4 py-2.5 font-black text-amber-700">Past simple</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past participle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["buy", "bought", "bought"],
                ["bring", "brought", "brought"],
                ["catch", "caught", "caught"],
                ["teach", "taught", "taught"],
                ["think", "thought", "thought"],
                ["fight", "fought", "fought"],
              ].map(([base, ps, pp], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700 font-mono text-xs">{base}</td>
                  <td className="px-4 py-2.5 text-amber-700 font-mono text-xs">{ps}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs font-bold">{pp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group 3: same all three forms */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Group 3 — Same form (base = past simple = past participle)</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Base form</th>
                <th className="px-4 py-2.5 font-black text-amber-700">Past simple</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past participle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["put", "put", "put"],
                ["cut", "cut", "cut"],
                ["hit", "hit", "hit"],
                ["let", "let", "let"],
                ["set", "set", "set"],
                ["cost", "cost", "cost"],
                ["hurt", "hurt", "hurt"],
              ].map(([base, ps, pp], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700 font-mono text-xs">{base}</td>
                  <td className="px-4 py-2.5 text-amber-700 font-mono text-xs">{ps}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs font-bold">{pp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common confusions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common confusions</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-red-700">Wrong (past simple form)</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Correct (past participle)</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["had went", "had gone", "go → went → gone"],
                ["had saw", "had seen", "see → saw → seen"],
                ["had wrote", "had written", "write → wrote → written"],
                ["had fell", "had fallen", "fall → fell → fallen"],
                ["had ran", "had run", "run → ran → run"],
                ["had did", "had done", "do → did → done"],
                ["had came", "had come", "come → came → come"],
                ["had gave", "had given", "give → gave → given"],
              ].map(([wrong, correct, note], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-red-50/30"}>
                  <td className="px-4 py-2.5 text-red-600 font-mono text-xs line-through">{wrong}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs font-bold">{correct}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Most common mistakes:</span> &ldquo;had went&rdquo; (should be <b>had gone</b>), &ldquo;had saw&rdquo; (should be <b>had seen</b>), &ldquo;had fell&rdquo; (should be <b>had fallen</b>), &ldquo;had ran&rdquo; (should be <b>had run</b>).<br />
          <span className="text-xs mt-1 block">The past simple and past participle of irregular verbs are often different — always use the <b>third column</b> of the verb table after &ldquo;had&rdquo;.</span>
        </div>
      </div>

    </div>
  );
}
