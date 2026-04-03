"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "She was born ___ 1990.", options: ["on", "in", "at", "by"], answer: 1 },
  { q: "I saw him ___ Monday.", options: ["in", "at", "on", "by"], answer: 2 },
  { q: "He called me ___ midnight.", options: ["on", "in", "at", "by"], answer: 2 },
  { q: "They left ___ Christmas Eve.", options: ["in", "at", "on", "by"], answer: 2 },
  { q: "I went there two weeks ___.", options: ["since", "before", "ago", "for"], answer: 2 },
  { q: "She worked there ___ three years.", options: ["since", "ago", "at", "for"], answer: 3 },
  { q: "He moved here ___ 2015.", options: ["on", "at", "in", "by"], answer: 2 },
  { q: "I haven't seen her ___ school.", options: ["for", "ago", "since", "in"], answer: 2 },
  { q: "They met ___ a party.", options: ["on", "at", "in", "by"], answer: 1 },
  { q: "She called him ___ the afternoon.", options: ["at", "on", "in", "by"], answer: 2 },
  { q: "I went to Paris ___ year.", options: ["ago", "last", "in", "since"], answer: 1 },
  { q: "He left ___ night — I haven't heard since.", options: ["in", "last", "ago", "on"], answer: 1 },
  { q: "We went camping ___ summer.", options: ["on", "at", "in", "last"], answer: 3 },
  { q: "She arrived ___ the evening.", options: ["at", "on", "in", "by"], answer: 2 },
  { q: "I met him ___ a conference.", options: ["on", "at", "in", "by"], answer: 1 },
  { q: "He was popular ___ the 1990s.", options: ["on", "at", "in", "by"], answer: 2 },
  { q: "She graduated ___ June.", options: ["on", "at", "in", "by"], answer: 2 },
  { q: "They got married ___ the weekend.", options: ["in", "on", "at", "by"], answer: 2 },
  { q: "I saw the film ___ last night.", options: ["in", "on", "—", "at"], answer: 2 },
  { q: "She was born ___ 14 March.", options: ["in", "at", "on", "by"], answer: 2 },
];

export default function TimeExpressionsPastLessonClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct time expression",
      instructions: "Choose the correct time expression for the past simple.",
      questions: [
        { id: "e1q1", prompt: "I went to Paris ___ year.", options: ["last", "ago", "in"], correctIndex: 0, explanation: "last + period: last year, last week, last month." },
        { id: "e1q2", prompt: "She called me ___ minutes ago.", options: ["last", "few", "a few"], correctIndex: 2, explanation: "a few minutes ago = a short time in the past." },
        { id: "e1q3", prompt: "He was born ___ 1995.", options: ["at", "on", "in"], correctIndex: 2, explanation: "in + year: He was born in 1995." },
        { id: "e1q4", prompt: "They left ___.", options: ["yesterday", "last yesterday", "the yesterday"], correctIndex: 0, explanation: "yesterday = the day before today. No article needed." },
        { id: "e1q5", prompt: "I saw her ___ Monday.", options: ["in", "at", "on"], correctIndex: 2, explanation: "on + day of the week: on Monday, on Friday." },
        { id: "e1q6", prompt: "We went camping ___ summer.", options: ["on", "last", "in the"], correctIndex: 1, explanation: "last summer = the most recent summer." },
        { id: "e1q7", prompt: "He moved here three years ___.", options: ["before", "ago", "since"], correctIndex: 1, explanation: "number + ago = time before now: three years ago." },
        { id: "e1q8", prompt: "She finished school ___ June.", options: ["on", "in", "at"], correctIndex: 1, explanation: "in + month: in June, in March." },
        { id: "e1q9", prompt: "I met him ___ a conference in 2019.", options: ["in", "at", "on"], correctIndex: 1, explanation: "at + event: at a conference, at a party." },
        { id: "e1q10", prompt: "They got married ___ the weekend.", options: ["in", "on", "at"], correctIndex: 2, explanation: "at the weekend (British English) = on the weekend." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the preposition",
      instructions: "Write the correct preposition: in, on, or at.",
      questions: [
        { id: "e2q1", prompt: "She was born ___ 14 March 1990.", correct: "on", explanation: "on + specific date" },
        { id: "e2q2", prompt: "He started the job ___ 2018.", correct: "in", explanation: "in + year" },
        { id: "e2q3", prompt: "They met ___ university.", correct: "at", explanation: "at + institution/place (at university, at school, at work)" },
        { id: "e2q4", prompt: "I got home ___ midnight.", correct: "at", explanation: "at + specific time (at midnight, at noon, at 6pm)" },
        { id: "e2q5", prompt: "He called me ___ Tuesday morning.", correct: "on", explanation: "on + day of the week" },
        { id: "e2q6", prompt: "She graduated ___ the summer of 2020.", correct: "in", explanation: "in + season / in + the summer of..." },
        { id: "e2q7", prompt: "They lived there ___ the 1980s.", correct: "in", explanation: "in + decade: in the 1980s, in the 1990s" },
        { id: "e2q8", prompt: "I saw the accident ___ the corner.", correct: "at", explanation: "at the corner = at that location" },
        { id: "e2q9", prompt: "She arrived ___ Christmas Eve.", correct: "on", explanation: "on + specific day/date (on Christmas Eve, on Monday)" },
        { id: "e2q10", prompt: "He called ___ the evening.", correct: "in", explanation: "in the morning / in the afternoon / in the evening" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Choose the natural time expression",
      instructions: "Choose the most natural and correct time expression for each sentence.",
      questions: [
        { id: "e3q1", prompt: "I haven't seen her ___ we were at school.", options: ["ago", "since", "for"], correctIndex: 1, explanation: "since = from a point in time to now: since we were at school." },
        { id: "e3q2", prompt: "She lived in London ___ three years.", options: ["since", "ago", "for"], correctIndex: 2, explanation: "for + period of time: for three years." },
        { id: "e3q3", prompt: "He left ___ an hour.", options: ["ago", "for", "since"], correctIndex: 0, explanation: "an hour ago = one hour before now." },
        { id: "e3q4", prompt: "They moved here ___ 2015.", options: ["ago", "for", "in"], correctIndex: 2, explanation: "in + year: they moved in 2015." },
        { id: "e3q5", prompt: "I saw the film ___ last night.", options: ["in", "on", "—"], correctIndex: 2, explanation: "No preposition with yesterday, last night, last week, etc." },
        { id: "e3q6", prompt: "She called him ___ the afternoon.", options: ["on", "in", "at"], correctIndex: 1, explanation: "in the morning / afternoon / evening (not 'at')" },
        { id: "e3q7", prompt: "They got married ___ Christmas Day.", options: ["in", "at", "on"], correctIndex: 2, explanation: "on + specific day: on Christmas Day, on my birthday." },
        { id: "e3q8", prompt: "I studied French ___ five years at school.", options: ["since", "ago", "for"], correctIndex: 2, explanation: "for + period of time." },
        { id: "e3q9", prompt: "He was very popular ___ the 1990s.", options: ["on", "at", "in"], correctIndex: 2, explanation: "in + decade: in the 1990s." },
        { id: "e3q10", prompt: "She fell asleep ___ the middle of the film.", options: ["on", "at", "in"], correctIndex: 2, explanation: "in the middle of = during the middle part." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the time expression",
      instructions: "Write the correct time expression: yesterday, last, ago, in, on, at, for, since.",
      questions: [
        { id: "e4q1", prompt: "I saw him two weeks ___.", correct: "ago", explanation: "number + ago: two weeks ago." },
        { id: "e4q2", prompt: "___ morning I had a really important meeting.", correct: "yesterday", explanation: "yesterday morning = the morning of the day before today." },
        { id: "e4q3", prompt: "She worked there ___ ten years before retiring.", correct: "for", explanation: "for + duration: for ten years." },
        { id: "e4q4", prompt: "He left ___ night — I haven't heard from him since.", correct: "last", explanation: "last night = the night before today." },
        { id: "e4q5", prompt: "They've been friends ___ they were children.", correct: "since", explanation: "since + point in time: since they were children." },
        { id: "e4q6", prompt: "She was born ___ a cold winter night in 1988.", correct: "on", explanation: "on + specific night/day." },
        { id: "e4q7", prompt: "I used to live there ___ the early 2000s.", correct: "in", explanation: "in + period/decade." },
        { id: "e4q8", prompt: "He arrived exactly ___ midnight.", correct: "at", explanation: "at + specific clock time." },
        { id: "e4q9", prompt: "She got the job ___ Monday and started on Wednesday.", correct: "on", explanation: "on + day of the week." },
        { id: "e4q10", prompt: "They moved to the new office ___ January.", correct: "in", explanation: "in + month." },
      ],
    },
  }), []);

  const current = sets[exNo];

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
    const total = current.questions.length;
    if (current.type === "mcq") {
      for (const q of current.questions) { if (mcqAnswers[q.id] === q.correctIndex) correct++; }
    } else {
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }, [checked, current, mcqAnswers, inputAnswers]);

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Time Expressions: Past",
        subtitle: "in / on / at / ago / for / since — 4 exercises + answer key",
        level: "A2",
        keyRule: "in + year/month/season/decade. on + day/date. at + time/event. No preposition with: yesterday, last, ago.",
        exercises: [
          {
            number: 1,
            title: "Exercise 1",
            difficulty: "Easy",
            instruction: "Choose the correct time expression.",
            questions: [
              "I went to Paris ___ year. (last / ago / in)",
              "She called me ___ minutes ago. (last / few / a few)",
              "He was born ___ 1995. (at / on / in)",
              "They left ___. (yesterday / last yesterday / the yesterday)",
              "I saw her ___ Monday. (in / at / on)",
              "We went camping ___ summer. (on / last / in the)",
              "He moved here three years ___. (before / ago / since)",
              "She finished school ___ June. (on / in / at)",
              "I met him ___ a conference in 2019. (in / at / on)",
              "They got married ___ the weekend. (in / on / at)",
            ],
            hint: "last / a few / in / yesterday / on / last / ago / in / at / at",
          },
          {
            number: 2,
            title: "Exercise 2",
            difficulty: "Medium",
            instruction: "Write the correct preposition: in, on, or at.",
            questions: [
              "She was born ___ 14 March 1990.",
              "He started the job ___ 2018.",
              "They met ___ university.",
              "I got home ___ midnight.",
              "He called me ___ Tuesday morning.",
              "She graduated ___ the summer of 2020.",
              "They lived there ___ the 1980s.",
              "I saw the accident ___ the corner.",
              "She arrived ___ Christmas Eve.",
              "He called ___ the evening.",
            ],
          },
          {
            number: 3,
            title: "Exercise 3",
            difficulty: "Hard",
            instruction: "Choose the correct time expression.",
            questions: [
              "I haven't seen her ___ we were at school. (ago / since / for)",
              "She lived in London ___ three years. (since / ago / for)",
              "He left ___ an hour. (ago / for / since)",
              "They moved here ___ 2015. (ago / for / in)",
              "I saw the film ___ last night. (in / on / —)",
              "She called him ___ the afternoon. (on / in / at)",
              "They got married ___ Christmas Day. (in / at / on)",
              "I studied French ___ five years at school. (since / ago / for)",
              "He was very popular ___ the 1990s. (on / at / in)",
              "She fell asleep ___ the middle of the film. (on / at / in)",
            ],
            hint: "since / for / ago / in / — / in / on / for / in / in",
          },
          {
            number: 4,
            title: "Exercise 4",
            difficulty: "Harder",
            instruction: "Write: yesterday, last, ago, in, on, at, for, or since.",
            questions: [
              "I saw him two weeks ___.",
              "___ morning I had a really important meeting.",
              "She worked there ___ ten years before retiring.",
              "He left ___ night — I haven't heard from him since.",
              "They've been friends ___ they were children.",
              "She was born ___ a cold winter night in 1988.",
              "I used to live there ___ the early 2000s.",
              "He arrived exactly ___ midnight.",
              "She got the job ___ Monday and started on Wednesday.",
              "They moved to the new office ___ January.",
            ],
          },
        ],
        answerKey: [
          {
            exercise: 1,
            subtitle: "Easy — choose the time expression",
            answers: ["last", "a few", "in", "yesterday", "on", "last", "ago", "in", "at", "at"],
          },
          {
            exercise: 2,
            subtitle: "Medium — write in, on, or at",
            answers: ["on", "in", "at", "at", "on", "in", "in", "at", "on", "in"],
          },
          {
            exercise: 3,
            subtitle: "Hard — choose the expression",
            answers: ["since", "for", "ago", "in", "—", "in", "on", "for", "in", "in"],
          },
          {
            exercise: 4,
            subtitle: "Harder — write the expression",
            answers: ["ago", "Yesterday", "for", "last", "since", "on", "in", "at", "on", "in"],
          },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Time Expressions: Past</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Time expressions{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">past</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Past simple time expressions tell us <b>when</b> something happened: <b>yesterday, last week, two years ago, in 2020, on Monday, at midnight</b>. Choosing the right preposition — <b>in, on,</b> or <b>at</b> — is one of the most common challenges for English learners.
      </p>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[300px_1fr_300px]">
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a2-time-expressions-past" subject="Time Expressions: Past" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className="sticky top-24"><AdUnit variant="sidebar-dark" /></div>
        )}

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>

            <PDFButton onDownload={downloadPDF} loading={pdfLoading} />

            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
              Exercises:
              {([1, 2, 3, 4] as const).map((n) => (
                <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {([1, 2, 3, 4] as const).map((n) => (
                      <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  {current.type === "mcq" ? (
                    current.questions.map((q, idx) => {
                      const chosen = mcqAnswers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))} />
                                    <span className="text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    current.questions.map((q, idx) => {
                      const val = inputAnswers[q.id] ?? "";
                      const answered = normalize(val) !== "";
                      const isCorrect = checked && answered && normalize(val) === normalize(q.correct);
                      const wrong = checked && answered && !isCorrect;
                      const noAnswer = checked && !answered;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3">
                                <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-sm rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                    ) : (
                      <button onClick={resetExercise} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                    )}
                    {checked && exNo < 4 && (
                      <button onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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
                        {score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        {isPro ? (
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Recommended</div>
              <div className="space-y-2">
                <a href="/grammar/a2" className="flex items-center gap-3 rounded-xl p-2 hover:bg-black/5 transition">
                  <span className="text-lg">📚</span>
                  <div><div className="text-sm font-bold text-slate-900">All A2 Lessons</div><div className="text-xs text-slate-500">Complete the level</div></div>
                </a>
                <a href="/grammar/b1" className="flex items-center gap-3 rounded-xl p-2 hover:bg-black/5 transition">
                  <span className="text-lg">🚀</span>
                  <div><div className="text-sm font-bold text-slate-900">B1 Grammar</div><div className="text-xs text-slate-500">Next level up</div></div>
                </a>
                <a href="/tenses/present-simple" className="flex items-center gap-3 rounded-xl p-2 hover:bg-black/5 transition">
                  <span className="text-lg">⏰</span>
                  <div><div className="text-sm font-bold text-slate-900">Present Simple</div><div className="text-xs text-slate-500">Essential tense</div></div>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="sticky top-24"><AdUnit variant="sidebar-light" /></div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-time-expressions-past" subject="Time Expressions: Past" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/present-perfect-intro" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Present Perfect →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Time Expressions: Past (A2)</h2>

      <div className="not-prose mt-4 grid gap-4 md:grid-cols-3">
        {[
          {
            prep: "IN",
            color: "border-sky-200 bg-sky-50 text-sky-700",
            uses: ["years: in 1995, in 2020", "months: in June, in March", "seasons: in summer, in winter", "decades: in the 1990s", "parts of day: in the morning/afternoon/evening"],
          },
          {
            prep: "ON",
            color: "border-emerald-200 bg-emerald-50 text-emerald-700",
            uses: ["days: on Monday, on Friday", "dates: on 15 March", "special days: on Christmas Day", "on my birthday", "on that day"],
          },
          {
            prep: "AT",
            color: "border-violet-200 bg-violet-50 text-violet-700",
            uses: ["times: at 6pm, at midnight, at noon", "at the weekend (BrE)", "at Christmas (the period)", "at night", "at events: at a party"],
          },
        ].map(({ prep, color, uses }) => (
          <div key={prep} className={`rounded-2xl border p-4 ${color}`}>
            <div className="text-2xl font-black mb-3">{prep}</div>
            <div className="space-y-1">
              {uses.map((u) => <div key={u} className="text-sm text-slate-700">{u}</div>)}
            </div>
          </div>
        ))}
      </div>

      <h3>No preposition needed</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-sm text-slate-700 mb-2">These time expressions use <b>no preposition</b>:</div>
        <div className="flex flex-wrap gap-2">
          {["yesterday", "yesterday morning/afternoon/evening", "last night", "last week", "last month", "last year", "last summer", "two days ago", "a week ago"].map((e) => (
            <span key={e} className="rounded-xl border border-black/10 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">{e}</span>
          ))}
        </div>
        <div className="mt-3 text-sm text-slate-500 italic">❌ NOT: <span className="line-through">in yesterday</span>, <span className="line-through">on last week</span></div>
      </div>

      <h3>Ago vs for vs since</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-3 text-sm text-slate-700">
        <div><b>ago</b> = time before now (used with past simple): <i>She left <b>two hours ago</b>.</i></div>
        <div><b>for</b> = duration / length of time: <i>He lived there <b>for three years</b>.</i></div>
        <div><b>since</b> = from a point in time until now: <i>I haven&apos;t seen him <b>since 2020</b>.</i></div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Quick rule:</span> <b>in</b> = long/general periods (years, months, seasons). <b>on</b> = specific days and dates. <b>at</b> = precise times and short periods. No preposition with <i>yesterday, last, ago</i>.
        </div>
      </div>
    </div>
  );
}
