"use client";

import { useMemo, useState, useEffect } from "react";
import { useLiveSync } from "@/lib/useLiveSync";
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
    title: "Exercise 1 — Before: which action gets Past Perfect?",
    instructions:
      "With 'before', the earlier action uses Past Perfect (had + past participle). Choose the correct form for the first (earlier) action.",
    questions: [
      { id: "1-1",  prompt: "She ___ already left before he arrived.",                    options: ["left", "has left", "had left", "was leaving"],     correctIndex: 2, explanation: "'had left' is the earlier action; 'arrived' is the later one. The earlier action before another past event uses Past Perfect." },
      { id: "1-2",  prompt: "Before the match started, the players ___ already warmed up.", options: ["warm up", "warmed up", "have warmed up", "had warmed up"], correctIndex: 3, explanation: "'had warmed up' (Past Perfect) shows the warm-up happened before the match started." },
      { id: "1-3",  prompt: "He ___ the report before his boss asked for it.",             options: ["finished", "has finished", "had finished", "was finishing"], correctIndex: 2, explanation: "'had finished' is earlier than 'asked' — Past Perfect for the earlier action." },
      { id: "1-4",  prompt: "Before I reached the cinema, the film ___ already started.", options: ["starts", "started", "had started", "has started"], correctIndex: 2, explanation: "'had started' — Past Perfect shows the film beginning before I reached the cinema." },
      { id: "1-5",  prompt: "They ___ dinner before the guests arrived.",                  options: ["ate", "have eaten", "eat", "had eaten"],           correctIndex: 3, explanation: "'had eaten' — the meal was completed before guests arrived." },
      { id: "1-6",  prompt: "She ___ her keys before she noticed they were gone.",         options: ["lost", "has lost", "had lost", "loses"],            correctIndex: 2, explanation: "'had lost' — losing the keys happened before she noticed." },
      { id: "1-7",  prompt: "Before the team celebrated, they ___ won three matches in a row.", options: ["win", "won", "have won", "had won"],          correctIndex: 3, explanation: "'had won' — the three wins happened before the celebration." },
      { id: "1-8",  prompt: "I ___ never tasted durian before I went to Thailand.",        options: ["never tasted", "have never tasted", "had never tasted", "never taste"], correctIndex: 2, explanation: "'had never tasted' — past experience (or lack of it) before a specific past event." },
      { id: "1-9",  prompt: "Before she answered, she ___ the question carefully.",        options: ["reads", "read", "has read", "had read"],            correctIndex: 3, explanation: "'had read' — reading came first, then she answered." },
      { id: "1-10", prompt: "The volcano ___ already erupted before anyone could evacuate.", options: ["erupts", "erupted", "has erupted", "had erupted"], correctIndex: 3, explanation: "'had erupted' — the eruption was already complete before evacuation could happen." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — After / when + Past Perfect",
    instructions:
      "With 'after', the Past Perfect clause describes the first (completed) action. With 'when', Past Perfect shows the earlier action was already done. Choose the correct form.",
    questions: [
      { id: "2-1",  prompt: "After they ___ dinner, they went for a walk.",               options: ["eat", "ate", "have eaten", "had eaten"],           correctIndex: 3, explanation: "'After they had eaten' — the meal was completed first (Past Perfect), then they walked (Past Simple)." },
      { id: "2-2",  prompt: "When I arrived, she ___ already left.",                       options: ["already left", "has already left", "had already left", "was leaving"], correctIndex: 2, explanation: "'had already left' — she left before I arrived; Past Perfect for the earlier action." },
      { id: "2-3",  prompt: "After he ___ the letter, he sent it.",                        options: ["writes", "wrote", "has written", "had written"],   correctIndex: 3, explanation: "'had written' — he finished the letter (Past Perfect) before sending it (Past Simple)." },
      { id: "2-4",  prompt: "When the police arrived, the thieves ___.",                   options: ["escape", "escaped", "had escaped", "have escaped"], correctIndex: 2, explanation: "'had escaped' — the escape was already complete when police arrived." },
      { id: "2-5",  prompt: "After she ___ the course, she applied for the job.",          options: ["complete", "completed", "has completed", "had completed"], correctIndex: 3, explanation: "'had completed' — finishing the course happened first (Past Perfect)." },
      { id: "2-6",  prompt: "When I opened the fridge, someone ___ all the milk.",         options: ["drinks", "drank", "had drunk", "has drunk"],       correctIndex: 2, explanation: "'had drunk' — the milk was gone before I opened the fridge." },
      { id: "2-7",  prompt: "After we ___ the results, we called our parents.",            options: ["see", "saw", "had seen", "have seen"],             correctIndex: 2, explanation: "'had seen' — seeing the results preceded calling parents." },
      { id: "2-8",  prompt: "When they reached the hotel, their luggage ___ already arrived.", options: ["arrives", "arrived", "has arrived", "had arrived"], correctIndex: 3, explanation: "'had arrived' — luggage was there before they got to the hotel." },
      { id: "2-9",  prompt: "After he ___ the document, he signed it.",                    options: ["read", "reads", "has read", "had read"],            correctIndex: 3, explanation: "'had read' — reading came before signing; Past Perfect + Past Simple sequence." },
      { id: "2-10", prompt: "When she got to the shop, it ___.",                           options: ["closes", "closed", "had closed", "has closed"],    correctIndex: 2, explanation: "'had closed' — the shop closed before she arrived." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — By the time / by then",
    instructions:
      "'By the time' and 'by then' signal that an action was already completed at a specific past moment. Use Past Perfect for the completed action.",
    questions: [
      { id: "3-1",  prompt: "By the time I got there, the film ___ already started.",     options: ["starts", "started", "has started", "had started"], correctIndex: 3, explanation: "'had started' — use Past Perfect after 'by the time' to show the earlier completed action." },
      { id: "3-2",  prompt: "By the time he called, I ___ gone to bed.",                  options: ["went", "go", "had gone", "have gone"],             correctIndex: 2, explanation: "'had gone' — the earlier action (going to bed) completed before his call." },
      { id: "3-3",  prompt: "By Monday, they ___ already made their decision.",           options: ["make", "made", "have made", "had made"],            correctIndex: 3, explanation: "'had made' — Past Perfect used with 'by [past time point]'." },
      { id: "3-4",  prompt: "By the time the ambulance arrived, she ___.",                options: ["recovered", "recovers", "had recovered", "was recovering"], correctIndex: 2, explanation: "'had recovered' — recovery was complete before the ambulance arrived." },
      { id: "3-5",  prompt: "By then, the situation ___ beyond control.",                  options: ["gets", "got", "had got", "has got"],                correctIndex: 2, explanation: "'had got' — 'by then' points to a past moment; Past Perfect shows what was already true by that point." },
      { id: "3-6",  prompt: "By the time the show ended, the audience ___ left.",         options: ["already left", "has already left", "had already left", "already leaves"], correctIndex: 2, explanation: "'had already left' — Past Perfect shows the departure was completed before the show ended." },
      { id: "3-7",  prompt: "By 2005, she ___ published two books.",                      options: ["publishes", "published", "has published", "had published"], correctIndex: 3, explanation: "'had published' — a past deadline (2005) triggers Past Perfect for the completed action." },
      { id: "3-8",  prompt: "By the time we finished eating, the others ___ for an hour.", options: ["waited", "wait", "had waited", "have waited"],     correctIndex: 2, explanation: "'had waited' — the waiting was in progress/completed before 'we finished eating'." },
      { id: "3-9",  prompt: "By then, I ___ forgotten her name.",                          options: ["forget", "forgot", "have forgotten", "had forgotten"], correctIndex: 3, explanation: "'had forgotten' — 'by then' with Past Perfect to show a state reached before that past moment." },
      { id: "3-10", prompt: "By the time the police came, he ___ the evidence.",          options: ["destroys", "destroyed", "had destroyed", "has destroyed"], correctIndex: 2, explanation: "'had destroyed' — the destruction was completed before police arrived." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: before / after / when / by the time",
    instructions:
      "This set mixes all sequence connectors. For each sentence, identify which action came first and choose the correct tense. The earlier action = Past Perfect; the later action = Past Simple.",
    questions: [
      { id: "4-1",  prompt: "She ___ the letter before she realised it was the wrong address.", options: ["sends", "sent", "had sent", "was sending"],    correctIndex: 2, explanation: "'had sent' — the letter was sent (Past Perfect) before she realised (Past Simple) the mistake." },
      { id: "4-2",  prompt: "After the guests ___, we finally relaxed.",                   options: ["leave", "left", "had left", "have left"],           correctIndex: 2, explanation: "'had left' — the guests' departure (Past Perfect) precedes our relaxing (Past Simple)." },
      { id: "4-3",  prompt: "By the time the doctor arrived, the patient ___ breathing.",  options: ["stops", "stopped", "had stopped", "has stopped"],  correctIndex: 2, explanation: "'had stopped' — the stopping occurred before the doctor's arrival." },
      { id: "4-4",  prompt: "When I read the news, she ___ already won the prize.",        options: ["already wins", "already won", "had already won", "has already won"], correctIndex: 2, explanation: "'had already won' — the win happened before I read the news." },
      { id: "4-5",  prompt: "He recognised her because he ___ her photo online.",          options: ["sees", "saw", "had seen", "has seen"],             correctIndex: 2, explanation: "'had seen' — seeing the photo came first; it explains why he recognised her." },
      { id: "4-6",  prompt: "Before she went on stage, she ___ her lines a hundred times.", options: ["practises", "practised", "had practised", "has practised"], correctIndex: 2, explanation: "'had practised' — practice happened before going on stage." },
      { id: "4-7",  prompt: "After they ___ the contract, the deal was official.",         options: ["sign", "signed", "had signed", "have signed"],     correctIndex: 2, explanation: "'had signed' — signing the contract (Past Perfect) came before the deal becoming official." },
      { id: "4-8",  prompt: "When we checked in, the previous guests ___ yet.",            options: ["don't leave", "didn't leave", "hadn't left", "haven't left"], correctIndex: 2, explanation: "'hadn't left' — Past Perfect negative: the previous guests were still there when we checked in." },
      { id: "4-9",  prompt: "By the time she called back, I ___ the problem myself.",     options: ["solve", "solved", "had solved", "have solved"],    correctIndex: 2, explanation: "'had solved' — solving the problem was completed before her return call." },
      { id: "4-10", prompt: "He was tired because he ___ very little the night before.",  options: ["sleeps", "slept", "had slept", "has slept"],       correctIndex: 2, explanation: "'had slept' — not sleeping enough (Past Perfect) caused tiredness (Past Simple result)." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Before",
  2: "After / When",
  3: "By the time",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function SequenceOfEventsClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();

  const current = SETS[exNo];

  const { broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<string, number | null>);
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

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
    broadcast({ answers: {}, checked: false, exNo });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setAnswers({});
    broadcast({ answers: {}, checked: false, exNo: n });
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
          <span className="text-slate-700 font-medium">Sequence of Events</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Sequence of Events</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions on expressing which past action happened first. Use Past Perfect for the earlier action with connectors: <b>before</b>, <b>after</b>, <b>when</b>, and <b>by the time</b>.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="pastperf-sequence-of-events" subject="Past Perfect" questions={PASTPERF_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                                      onChange={() => { const newAnswers = { ...answers, [q.id]: oi }; setAnswers(newAnswers); broadcast({ answers: newAnswers, checked, exNo }); }}
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
                        <button onClick={() => { setChecked(true); broadcast({ answers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
    orange: "bg-orange-100 text-orange-800 border-orange-200",
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

      {/* Timeline visual */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">The timeline rule</div>
        <div className="rounded-2xl bg-gradient-to-r from-violet-50 via-sky-50 to-emerald-50 border border-black/10 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 text-center">
              <div className="rounded-xl bg-violet-500 text-white text-xs font-black px-3 py-2 inline-block">Action 1 (earlier)</div>
              <div className="mt-1 text-xs text-violet-700 font-bold">Past Perfect</div>
              <div className="text-xs text-slate-500 font-mono">had + past participle</div>
            </div>
            <div className="text-2xl text-slate-400">→</div>
            <div className="flex-1 text-center">
              <div className="rounded-xl bg-emerald-500 text-white text-xs font-black px-3 py-2 inline-block">Action 2 (later)</div>
              <div className="mt-1 text-xs text-emerald-700 font-bold">Past Simple</div>
              <div className="text-xs text-slate-500 font-mono">verb + -ed / irregular</div>
            </div>
          </div>
          <div className="space-y-2">
            <Ex en="She had eaten → before he arrived." />
            <Ex en="After they had signed → the contract was official." />
            <Ex en="By the time I got there → the film had started." />
          </div>
        </div>
      </div>

      {/* 3 connector cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-violet-50 to-white border border-violet-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-violet-500 px-3 py-1 text-xs font-black text-white">before</span>
          <Formula parts={[
            { text: "Action 1", color: "violet" },
            { text: "(Past Perfect)", color: "yellow" },
            { text: "before", color: "slate" },
            { text: "Action 2", color: "green" },
            { text: "(Past Simple)", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She had left before he arrived." />
            <Ex en="Before I reached the station, the train had departed." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">after / when</span>
          <Formula parts={[
            { text: "After", color: "sky" },
            { text: "Action 1", color: "violet" },
            { text: "(Past Perfect)", color: "yellow" },
            { text: ", Action 2", color: "green" },
            { text: "(Past Simple)", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="After she had finished, she left." />
            <Ex en="When I arrived, he had already gone." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">by the time / by then</span>
          <Formula parts={[
            { text: "By the time", color: "green" },
            { text: "Action 2", color: "sky" },
            { text: "(Past Simple)", color: "slate" },
            { text: ", Action 1", color: "violet" },
            { text: "had + pp", color: "yellow" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By the time I arrived, the show had ended." />
            <Ex en="By 2010, he had written three novels." />
          </div>
        </div>
      </div>

      {/* Connector table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Key connectors — quick reference</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Connector</th>
                <th className="px-4 py-2.5 font-black text-violet-700">Earlier action</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Later action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["before", "Past Perfect (before the comma)", "Past Simple"],
                ["after", "Past Perfect (in the after-clause)", "Past Simple"],
                ["when", "Past Perfect (already done)", "Past Simple (discovery)"],
                ["by the time", "Past Perfect (in main clause)", "Past Simple (in by-clause)"],
                ["as soon as", "Past Perfect (first action)", "Past Simple"],
                ["already / just / never", "Signal words → use Past Perfect", "—"],
              ].map(([conn, earlier, later], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  <td className="px-4 py-2.5 font-black text-slate-800 font-mono text-xs">{conn}</td>
                  <td className="px-4 py-2.5 text-violet-700 text-xs">{earlier}</td>
                  <td className="px-4 py-2.5 text-emerald-700 text-xs">{later}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Core rule:</span> The <b>earlier</b> action uses Past Perfect; the <b>later</b> action uses Past Simple. When &ldquo;before&rdquo; or &ldquo;after&rdquo; already makes the order clear, Past Simple can sometimes replace Past Perfect — but Past Perfect is always safe and precise.<br />
          <span className="text-xs mt-1 block">She left <b>before</b> he arrived ✅ &nbsp; She <b>had left</b> before he arrived ✅ (more formal/emphatic)</span>
        </div>
      </div>

    </div>
  );
}
