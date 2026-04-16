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

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Background vs event",
    instructions:
      "Past Continuous = background/scene (what was happening). Past Simple = event/action (what happened). The Continuous sets the stage; the Simple tells the story.",
    questions: [
      { id: "1-1", prompt: "Last night, I ___ dinner when my friend arrived.", options: ["cooked", "was cooking", "cook", "am cooking"], correctIndex: 1, explanation: "Background scene (Continuous) interrupted by the arrival (Simple)." },
      { id: "1-2", prompt: "He ___ the door and saw a stranger.", options: ["was opening", "opened", "open", "opens"], correctIndex: 1, explanation: "Sequential completed actions → Past Simple: opened." },
      { id: "1-3", prompt: "The sun ___ and birds were singing when we arrived.", options: ["shone", "was shining", "shine", "shines"], correctIndex: 1, explanation: "Scene-setting background → Past Continuous: was shining." },
      { id: "1-4", prompt: "She ___ a report all morning — she couldn't stop.", options: ["was writing", "wrote", "write", "writes"], correctIndex: 0, explanation: "Ongoing process throughout the morning → Past Continuous: was writing." },
      { id: "1-5", prompt: "The children ___ their rooms when I checked on them.", options: ["cleaned", "were cleaning", "clean", "cleans"], correctIndex: 1, explanation: "Background action in progress when I checked → Past Continuous." },
      { id: "1-6", prompt: "He ___ three coffees and called a taxi.", options: ["was drinking", "drank", "drink", "drinks"], correctIndex: 1, explanation: "Completed actions in sequence → Past Simple: drank." },
      { id: "1-7", prompt: "People ___ outside the shop for hours before it opened.", options: ["waited", "were waiting", "wait", "waits"], correctIndex: 1, explanation: "Ongoing situation over a period → Past Continuous: were waiting." },
      { id: "1-8", prompt: "She ___ at the screen for a moment and then smiled.", options: ["was staring", "stared", "stare", "stares"], correctIndex: 1, explanation: "Short completed action in sequence → Past Simple: stared." },
      { id: "1-9", prompt: "We ___ chess while we were waiting for dinner.", options: ["played", "were playing", "play", "plays"], correctIndex: 1, explanation: "Ongoing activity during the wait → Past Continuous: were playing." },
      { id: "1-10", prompt: "Suddenly, the alarm ___.", options: ["was going off", "went off", "go off", "goes off"], correctIndex: 1, explanation: "'Suddenly' + short event → Past Simple: went off." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Describing a past scene",
    instructions:
      "When telling a story, use Past Continuous to describe what was happening in the background, and Past Simple for the events that moved the story forward.",
    questions: [
      { id: "2-1", prompt: "It ___ a cold winter evening. The streets ___ empty.", options: ["was / were", "is / are", "was / are", "is / were"], correctIndex: 0, explanation: "Setting the scene with state verbs → both Past: It was... streets were." },
      { id: "2-2", prompt: "A few people ___ near the entrance, checking their phones.", options: ["stood", "were standing", "stand", "stands"], correctIndex: 1, explanation: "Background scene description → Past Continuous: were standing." },
      { id: "2-3", prompt: "Suddenly, a door ___ open and a man ran out.", options: ["was flying", "flew", "fly", "flies"], correctIndex: 1, explanation: "Sudden past event → Past Simple: flew." },
      { id: "2-4", prompt: "He ___ and nearly knocked me over.", options: ["was pushing", "pushed", "push", "pushes"], correctIndex: 1, explanation: "Completed action in the sequence → Past Simple: pushed." },
      { id: "2-5", prompt: "People ___ and shouting in the street.", options: ["ran", "were running", "run", "runs"], correctIndex: 1, explanation: "Background scene description → Past Continuous: were running." },
      { id: "2-6", prompt: "I didn't know what ___.", options: ["was happening", "happened", "happen", "happens"], correctIndex: 0, explanation: "Ongoing unclear situation → Past Continuous: was happening." },
      { id: "2-7", prompt: "I ___ to call the police when I saw a sign on the door.", options: ["was deciding", "decided", "decide", "decides"], correctIndex: 1, explanation: "Sequential completed action → Past Simple: decided." },
      { id: "2-8", prompt: "The sign ___ that it was a film set.", options: ["was saying", "said", "say", "says"], correctIndex: 1, explanation: "Information on the sign = completed statement → Past Simple: said." },
      { id: "2-9", prompt: "A crew of 50 people ___ the scene when I walked past.", options: ["filmed", "were filming", "film", "films"], correctIndex: 1, explanation: "Background activity in progress → Past Continuous: were filming." },
      { id: "2-10", prompt: "I ___ out loud when I finally understood!", options: ["was laughing", "laughed", "laugh", "laughs"], correctIndex: 1, explanation: "Short completed reaction → Past Simple: laughed." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Simultaneous past actions",
    instructions:
      "Past Continuous + Past Continuous = two actions happening at the same time. Both actions are ongoing in the background. 'while' links them.",
    questions: [
      { id: "3-1", prompt: "While she was cooking, he ___ the table.", options: ["set", "was setting", "sets", "setting"], correctIndex: 1, explanation: "Two simultaneous ongoing actions → both Continuous: was setting." },
      { id: "3-2", prompt: "The children were playing ___ their parents were talking.", options: ["while", "when", "until", "because"], correctIndex: 0, explanation: "'while' connects two simultaneous Continuous actions." },
      { id: "3-3", prompt: "He ___ the news while she was reading a book.", options: ["watched", "was watching", "watches", "watch"], correctIndex: 1, explanation: "Simultaneous background action → Past Continuous: was watching." },
      { id: "3-4", prompt: "While some students ___, others were taking notes.", options: ["slept", "were sleeping", "sleep", "sleeps"], correctIndex: 1, explanation: "Two groups doing different things simultaneously → Past Continuous: were sleeping." },
      { id: "3-5", prompt: "I was typing ___ my colleague was on the phone next to me.", options: ["while", "when", "until", "because"], correctIndex: 0, explanation: "'while' = two simultaneous ongoing actions." },
      { id: "3-6", prompt: "She ___ and he was playing guitar — it was a lovely evening.", options: ["sang", "was singing", "sings", "sing"], correctIndex: 1, explanation: "Scene description with two ongoing activities → both Continuous." },
      { id: "3-7", prompt: "While the surgeon ___ the operation, the nurse was helping.", options: ["performed", "was performing", "performs", "perform"], correctIndex: 1, explanation: "Two simultaneous actions → both Continuous." },
      { id: "3-8", prompt: "The fans ___ cheering while the players were warming up.", options: ["were", "was", "are", "is"], correctIndex: 0, explanation: "Two simultaneous Continuous actions: were cheering." },
      { id: "3-9", prompt: "He was working while his wife ___ dinner.", options: ["was making", "made", "makes", "make"], correctIndex: 0, explanation: "Simultaneous → both Continuous." },
      { id: "3-10", prompt: "While I ___ a nap, someone moved my car!", options: ["was taking", "took", "take", "takes"], correctIndex: 0, explanation: "Continuous background (nap) + Simple event (moved)." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: tell the whole story",
    instructions:
      "Choose the correct form for each gap. Think about whether the action is background (Continuous) or an event (Simple).",
    questions: [
      { id: "4-1", prompt: "It ___ a beautiful day and the birds ___.", options: ["was / were singing", "is / are singing", "was / sang", "is / sang"], correctIndex: 0, explanation: "Scene-setting: was + were singing." },
      { id: "4-2", prompt: "While we ___ for the bus, it started to snow.", options: ["were waiting", "waited", "wait", "waits"], correctIndex: 0, explanation: "Background Continuous: were waiting." },
      { id: "4-3", prompt: "I ___ along the street when I stepped in a puddle.", options: ["walked", "was walking", "walk", "walks"], correctIndex: 1, explanation: "Background Continuous: was walking." },
      { id: "4-4", prompt: "She ___ lunch when her boss called.", options: ["ate", "was eating", "eat", "eats"], correctIndex: 1, explanation: "Background Continuous: was eating." },
      { id: "4-5", prompt: "We ___ chess — it was going to be a quiet evening.", options: ["played", "were playing", "play", "plays"], correctIndex: 1, explanation: "Background scene description → Past Continuous." },
      { id: "4-6", prompt: "Suddenly, he ___ up and left the room.", options: ["was standing", "stood", "stands", "stand"], correctIndex: 1, explanation: "'Suddenly' + short event → Past Simple: stood." },
      { id: "4-7", prompt: "The storm ___ while we were driving home.", options: ["started", "was starting", "starts", "start"], correctIndex: 0, explanation: "Short event during background Continuous → Past Simple: started." },
      { id: "4-8", prompt: "We ___ hard all afternoon — it was exhausting.", options: ["worked", "were working", "work", "works"], correctIndex: 1, explanation: "Ongoing activity throughout the afternoon → Past Continuous." },
      { id: "4-9", prompt: "She ___ the letter, sealed it, and posted it.", options: ["was writing", "wrote", "write", "writes"], correctIndex: 1, explanation: "Sequence of completed actions → Past Simple: wrote." },
      { id: "4-10", prompt: "He ___ when I knocked on the door — I could hear the snoring.", options: ["slept", "was sleeping", "sleep", "sleeps"], correctIndex: 1, explanation: "Ongoing background state → Past Continuous: was sleeping." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Background/Event",
  2: "Scene-setting",
  3: "Simultaneous",
  4: "Full story",
};

function Formula({ parts }: { parts: Array<{ text?: string; color?: string; dim?: boolean }> }) {
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

export default function PsVsPcFromPcClient() {
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
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-continuous">Past Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">PS vs Continuous</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">vs Past Simple</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Intermediate</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">B1</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          The Past Continuous sets the scene; the Past Simple tells the story. 40 questions to master when to use each tense.
        </p>

        {/* 3-col grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="pastcont-ps-vs-pc" subject="Past Continuous" questions={PASTCONT_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                        <button key={n} onClick={() => switchSet(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))} className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600"><b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
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
                        <button onClick={checkAnswers} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
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
          <a href="/tenses/past-continuous/when-while" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← when vs while</a>
          <a href="/tenses/past-continuous/interrupted-actions" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Interrupted Actions →</a>
        </div>

      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Past Continuous vs Past Simple — Telling a Story</h2>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">
          Every good story has a background and events. Use Past Continuous to paint the scene; use Past Simple to move the action forward.
        </p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-emerald-700">Past Continuous = Scene</div>
          <Formula parts={[
            { text: "was/were", color: "yellow" },
            { dim: true },
            { text: "verb-ing", color: "green" },
            { text: "= background", color: "slate" },
          ]} />
          <div className="space-y-1.5 pt-1">
            <Ex en="It was raining." />
            <Ex en="People were walking." />
            <Ex en="She was cooking." />
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-red-700">Past Simple = Event</div>
          <Formula parts={[
            { text: "verb-ed/irregular", color: "yellow" },
            { text: "= what happened", color: "red" },
          ]} />
          <div className="space-y-1.5 pt-1">
            <Ex en="Suddenly he arrived." />
            <Ex en="She dropped the glass." />
            <Ex en="They laughed." />
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-sky-700">Together — a full story</div>
          <div className="space-y-1.5">
            <Ex en="The sun was shining." />
            <Ex en="Birds were singing." />
            <Ex en="We were having a picnic when it suddenly started to rain." />
            <Ex en="We grabbed our things and ran." />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-black/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-black/10">
              <th className="text-left px-4 py-3 font-black text-slate-700">Past Continuous</th>
              <th className="text-left px-4 py-3 font-black text-slate-700">Past Simple</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            <tr className="bg-white">
              <td className="px-4 py-3 text-slate-700">Scene / background</td>
              <td className="px-4 py-3 text-slate-700">Event that moves the story</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="px-4 py-3 text-slate-700">Ongoing process</td>
              <td className="px-4 py-3 text-slate-700">Short completed action</td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-3 text-slate-700">Simultaneous actions</td>
              <td className="px-4 py-3 text-slate-700">Sequence: first… then…</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Amber warning */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex gap-3">
        <div className="text-lg shrink-0">⚠️</div>
        <div className="text-sm text-amber-800">
          <b className="font-black">Clue words for Simple:</b> suddenly, immediately, then, after that, next.{" "}
          <b className="font-black">Clue words for Continuous:</b> while, all day, at that moment, at the time, still.
        </div>
      </div>
    </div>
  );
}
