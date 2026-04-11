"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF, type LessonPDFConfig } from "@/lib/generateLessonPDF";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Future Perfect structure is?", options: ["will be + -ing", "will have + pp", "would have + pp", "will + infinitive"], answer: 1 },
  { q: "Future Perfect means action is?", options: ["Ongoing at future point", "Completed before future point", "Started in past", "General future truth"], answer: 1 },
  { q: "'By Friday' signals which tense?", options: ["Future continuous", "Future perfect", "Past perfect", "Present perfect"], answer: 1 },
  { q: "Which is correct Future Perfect?", options: ["will have finished", "will has finished", "would finished", "have will finished"], answer: 0 },
  { q: "Future Perfect negative?", options: ["won't have finished", "will not finished", "won't finished", "will have not finished"], answer: 0 },
  { q: "Future Perfect question?", options: ["Will she have arrived?", "She will have arrived?", "Has she will arrived?", "Will she arrived?"], answer: 0 },
  { q: "'By the time you arrive, we ___ dinner' uses?", options: ["Future continuous", "Future perfect", "Past perfect", "Present perfect"], answer: 1 },
  { q: "Duration completed before future point uses?", options: ["Future simple", "Future continuous", "Future perfect", "Present perfect"], answer: 2 },
  { q: "'He will have been teaching for 10 years' is?", options: ["Future perfect", "Future perf. continuous", "Past perfect", "Future continuous"], answer: 1 },
  { q: "'By then' is a signal for?", options: ["Past perfect", "Future continuous", "Future perfect", "Present perfect"], answer: 2 },
  { q: "Future Perfect expresses certainty about?", options: ["A past action", "A completed future action", "An ongoing future action", "A hypothesis"], answer: 1 },
  { q: "Which sentence uses Future Perfect correctly?", options: ["I will finish by 5pm", "I will have finished by 5pm", "I have finished by 5pm", "I had finished by 5pm"], answer: 1 },
  { q: "Past participle in Future Perfect is?", options: ["Third form of verb", "Present participle", "-ing form", "Infinitive"], answer: 0 },
  { q: "The deadline marker 'by' means?", options: ["After a time", "Before or at a time", "Exactly at a time", "During a time"], answer: 1 },
  { q: "Future Perfect Continuous adds emphasis on?", options: ["Completion", "Duration leading to a point", "General truth", "Certainty"], answer: 1 },
  { q: "'Before she leaves, he ___ the report' uses?", options: ["will finish", "will have finished", "finishes", "finished"], answer: 1 },
  { q: "When is Future Perfect NOT used?", options: ["Actions complete before future", "Duration up to future point", "Actions in progress at future point", "Predictions of completion"], answer: 2 },
  { q: "Which time expression fits Future Perfect?", options: ["at 5pm tomorrow", "by next month", "this time tomorrow", "right now"], answer: 1 },
  { q: "Future Perfect passive of 'build the bridge'?", options: ["will have been built", "will be built", "would have built", "will have built"], answer: 0 },
  { q: "'She will have lived here 20 years by June' expresses?", options: ["Ongoing action", "Completed duration", "Past regret", "General habit"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Future Perfect",
  subtitle: "will have + past participle",
  level: "B2",
  keyRule: "will have + pp = action completed BEFORE a specific future point.",
  exercises: [
    {
      number: 1,
      title: "Choose the correct form",
      difficulty: "easy" as const,
      instruction: "Pick the correct Future Perfect form.",
      questions: [
        "By Friday, I ___ the report.",
        "By the time you arrive, we ___ dinner.",
        "She ___ English 10 yrs by graduation.",
        "They ___ the project before the meeting.",
        "He ___ all his work by 6pm.",
        "By tomorrow morning, I ___ the book.",
        "She ___ the exam three times by May.",
        "They ___ for 5 hours when we join.",
        "He ___ the report before you read it.",
        "By the end of the year, we ___.",
      ],
    },
    {
      number: 2,
      title: "Write the Future Perfect",
      difficulty: "medium" as const,
      instruction: "Write the correct Future Perfect form.",
      questions: [
        "By 5pm (she/finish) the presentation.",
        "By then (we/eat) already.",
        "When you arrive, (he/leave) already.",
        "(they/not/complete) the survey by noon.",
        "(she/live) here 20 yrs by June.",
        "By midnight (I/write) 2000 words.",
        "(he/not/return) before I leave.",
        "By next week (we/paint) the whole flat.",
        "She (study) 5 years by the time she grad.",
        "(they/already/decide) by then.",
      ],
    },
    {
      number: 3,
      title: "Future Perfect in context",
      difficulty: "hard" as const,
      instruction: "Choose the best tense for the context.",
      questions: [
        "She ___ three cups before noon. (drink)",
        "By Saturday they ___ the album. (record)",
        "I'll call you when I ___ the task.",
        "The builders ___ the roof by winter.",
        "___ he ___ all his lines by Friday?",
        "She ___ the company for 30 years.",
        "By the time I arrive, the show ___.",
        "___ they ___ the budget by then?",
        "He ___ English for a decade by 2030.",
        "By the deadline (they/not/send) it.",
      ],
    },
    {
      number: 4,
      title: "Full Future Perfect practice",
      difficulty: "hard" as const,
      instruction: "Write the complete Future Perfect sentence.",
      questions: [
        "finish project / by Monday",
        "she / live here / for 10 years / by June",
        "they / not / complete / the survey / by noon",
        "he / read / the whole book / by tonight",
        "we / travel / 500km / by the time we stop",
        "she / not / arrive / before the meeting starts",
        "the team / build / the app / by next quarter",
        "I / sleep / 8 hours / by 7am",
        "he / graduate / before she starts uni",
        "they / win / five awards / by the ceremony",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Future Perfect forms", answers: ["will have finished", "will have eaten", "will have studied", "will have completed", "will have finished", "will have read", "will have taken", "will have been working", "will have submitted", "will have achieved our target"] },
    { exercise: 2, subtitle: "Written forms", answers: ["she will have finished", "we will have already eaten", "he will have already left", "they won't have completed", "she will have lived", "I will have written", "he won't have returned", "we will have painted", "She will have studied", "they will have already decided"] },
    { exercise: 3, subtitle: "Best tense choice", answers: ["will have drunk", "will have recorded", "have finished", "will have repaired", "Will / have learnt", "will have worked for", "will have ended", "Will / have approved", "will have studied", "they won't have sent it"] },
    { exercise: 4, subtitle: "Full sentences", answers: ["I will have finished the project by Monday", "She will have lived here for 10 years by June", "They won't have completed the survey by noon", "He will have read the whole book by tonight", "We will have travelled 500km", "She won't have arrived before the meeting", "The team will have built the app", "I will have slept 8 hours by 7am", "He will have graduated before she starts", "They will have won five awards"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Future Continuous", href: "/grammar/b2/future-continuous", level: "B2", badge: "bg-orange-500", reason: "Future Continuous is the key companion to Future Perfect" },
  { title: "Past Perfect Continuous", href: "/grammar/b2/past-perfect-continuous", level: "B2", badge: "bg-orange-500", reason: "Perfect continuous aspect across different time frames" },
  { title: "Advanced Passive", href: "/grammar/b2/passive-advanced", level: "B2", badge: "bg-orange-500" },
];

export default function FuturePerfectLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct Future Perfect form",
      instructions: "Choose the correct Future Perfect form (will have + past participle).",
      questions: [
        { id: "e1q1", prompt: "By Friday, I ___ the report.", options: ["will finish", "will have finished", "will be finishing"], correctIndex: 1, explanation: "will have finished = completed before Friday → Future Perfect." },
        { id: "e1q2", prompt: "By the time you arrive, we ___ dinner.", options: ["have eaten", "will eat", "will have eaten"], correctIndex: 2, explanation: "will have eaten = before you arrive (future point) → Future Perfect." },
        { id: "e1q3", prompt: "She ___ English for 10 years by the time she graduates.", options: ["will study", "will have studied", "will be studying"], correctIndex: 1, explanation: "will have studied = duration completed before graduation." },
        { id: "e1q4", prompt: "___ you ___ the book by next Monday?", options: ["Will / read", "Will / have read", "Will / be reading"], correctIndex: 1, explanation: "Will you have read = Future Perfect question." },
        { id: "e1q5", prompt: "By 2030, scientists ___ a cure for many diseases.", options: ["find", "will find", "will have found"], correctIndex: 2, explanation: "will have found = completed before 2030 → Future Perfect." },
        { id: "e1q6", prompt: "Don't call at 9 — she ___ to bed by then.", options: ["goes", "will go", "will have gone"], correctIndex: 2, explanation: "will have gone = completed before 9pm → Future Perfect." },
        { id: "e1q7", prompt: "They ___ this building for 5 years by the time it's finished.", options: ["will build", "will have been building", "will have built"], correctIndex: 1, explanation: "will have been building = duration up to completion → Future Perfect Continuous (also acceptable)." },
        { id: "e1q8", prompt: "By next spring, we ___ in this flat for two years.", options: ["will live", "will have lived", "will be living"], correctIndex: 1, explanation: "will have lived = duration completed by next spring." },
        { id: "e1q9", prompt: "He ___ all his savings by the end of the trip.", options: ["will spend", "will have spent", "will be spending"], correctIndex: 1, explanation: "will have spent = completed before the end of the trip." },
        { id: "e1q10", prompt: "By the time the film starts, they ___ the popcorn!", options: ["eat", "will eat", "will have eaten"], correctIndex: 2, explanation: "will have eaten = completed before the film starts." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the Future Perfect form",
      instructions: "Write the correct Future Perfect form of the verb in brackets (will have + past participle).",
      questions: [
        { id: "e2q1", prompt: "By tomorrow morning, I (sleep) ___ for 10 hours.", correct: "will have slept", explanation: "will have slept = completed before tomorrow morning." },
        { id: "e2q2", prompt: "She (finish) ___ her degree by June.", correct: "will have finished", explanation: "will have finished = completed before June." },
        { id: "e2q3", prompt: "(he/write) ___ the report by the time the meeting starts?", correct: "will he have written", explanation: "will he have written = Future Perfect question." },
        { id: "e2q4", prompt: "We (not/read) ___ all the material before the exam.", correct: "won't have read", explanation: "won't have read = negative Future Perfect." },
        { id: "e2q5", prompt: "By 2025, they (sell) ___ over a million copies.", correct: "will have sold", explanation: "will have sold = completed by a future point." },
        { id: "e2q6", prompt: "I (live) ___ here for 20 years by my next birthday.", correct: "will have lived", explanation: "will have lived = duration completed by a future date." },
        { id: "e2q7", prompt: "The construction team (complete) ___ the bridge before winter.", correct: "will have completed", explanation: "will have completed = finished before a future point." },
        { id: "e2q8", prompt: "She (travel) ___ to 30 countries by the time she's 40.", correct: "will have travelled", explanation: "will have travelled = completed by age 40." },
        { id: "e2q9", prompt: "How many books (you/read) ___ by the end of the year?", correct: "will you have read", explanation: "will you have read = Future Perfect question about quantity." },
        { id: "e2q10", prompt: "They (not/arrive) ___ by 8 — the traffic is terrible.", correct: "won't have arrived", explanation: "won't have arrived = negative — not completed by 8." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Future Perfect vs Future Continuous vs will",
      instructions: "Choose the most appropriate future form. Think about completion, duration in progress, or simple future fact.",
      questions: [
        { id: "e3q1", prompt: "At noon tomorrow, I ___ my presentation — come and watch.", options: ["will give", "will be giving", "will have given"], correctIndex: 1, explanation: "will be giving = in progress at noon → Future Continuous." },
        { id: "e3q2", prompt: "Don't come at 5 — I ___ the report by then.", options: ["don't finish", "won't have finished", "won't be finishing"], correctIndex: 1, explanation: "won't have finished = not completed by 5 → Future Perfect negative." },
        { id: "e3q3", prompt: "By the end of this year, she ___ 500 hours of research.", options: ["will be doing", "will do", "will have done"], correctIndex: 2, explanation: "will have done = completed before end of year → Future Perfect." },
        { id: "e3q4", prompt: "I think it ___ rain tomorrow — look at the forecast.", options: ["will", "will be raining", "will have rained"], correctIndex: 0, explanation: "will rain = simple prediction → will." },
        { id: "e3q5", prompt: "In two years, he ___ for the company for a decade.", options: ["works", "will be working", "will have worked"], correctIndex: 2, explanation: "will have worked = completed period → Future Perfect." },
        { id: "e3q6", prompt: "This time next month, we ___ somewhere on the coast.", options: ["will relax", "will be relaxing", "will have relaxed"], correctIndex: 1, explanation: "will be relaxing = in progress at a future moment → Future Continuous." },
        { id: "e3q7", prompt: "She ___ all her savings by the end of the holiday unless she's careful.", options: ["will spend", "will be spending", "will have spent"], correctIndex: 2, explanation: "will have spent = completed by end of holiday → Future Perfect." },
        { id: "e3q8", prompt: "Don't call at 7 — they ___ dinner then.", options: ["will have", "will be having", "will have had"], correctIndex: 1, explanation: "will be having = in progress at 7 → Future Continuous." },
        { id: "e3q9", prompt: "By 2050, sea levels ___ by 20 cm, scientists warn.", options: ["rise", "will be rising", "will have risen"], correctIndex: 2, explanation: "will have risen = completed change by 2050 → Future Perfect." },
        { id: "e3q10", prompt: "A: Are you busy later? B: Yes, I ___ from 3 to 5.", options: ["will work", "will be working", "will have worked"], correctIndex: 1, explanation: "will be working = in progress during that period → Future Continuous." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Mixed Future Tenses",
      instructions: "Write the correct future form: will, going to, Future Continuous, or Future Perfect.",
      questions: [
        { id: "e4q1", prompt: "By the time the guests arrive, I (cook) ___ everything.", correct: "will have cooked", explanation: "will have cooked = completed before they arrive → Future Perfect." },
        { id: "e4q2", prompt: "Watch out! That ladder (fall) ___.", correct: "is going to fall", explanation: "is going to fall = evidence of imminent event → going to." },
        { id: "e4q3", prompt: "At 9am on Monday, we (have) ___ our team briefing.", correct: "will be having", explanation: "will be having = in progress at that time → Future Continuous." },
        { id: "e4q4", prompt: "She (study) ___ medicine for six years by the time she qualifies.", correct: "will have studied", explanation: "will have studied = completed duration → Future Perfect." },
        { id: "e4q5", prompt: "A: The printer is jammed. B: I (have) ___ a look.", correct: "will have", explanation: "will have a look = spontaneous offer → will." },
        { id: "e4q6", prompt: "This time tomorrow, they (fly) ___ over the Atlantic.", correct: "will be flying", explanation: "will be flying = in progress at that time → Future Continuous." },
        { id: "e4q7", prompt: "We (not/finish) ___ the project by the deadline unless we work faster.", correct: "won't have finished", explanation: "won't have finished = not completed by deadline → Future Perfect negative." },
        { id: "e4q8", prompt: "I've made up my mind — I (apply) ___ for the scholarship.", correct: "am going to apply", explanation: "am going to apply = decision already made → going to." },
        { id: "e4q9", prompt: "How long (you/wait) ___ by the time the doctor sees you?", correct: "will you have been waiting", explanation: "will you have been waiting = duration up to a future point → Future Perfect Continuous." },
        { id: "e4q10", prompt: "She (work) ___ here for 25 years next spring.", correct: "will have been working", explanation: "will have been working = duration up to next spring → Future Perfect Continuous (also: will have worked)." },
      ],
    },
  }), []);

  const current = sets[exNo];

  const { save } = useProgress();
  const isPro = useIsPro();

  async function handleDownloadPDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PDF_CONFIG); } catch (e) { console.error(e); } finally { setPdfLoading(false); }
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

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Future Perfect</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Future{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Perfect</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The Future Perfect uses <b>will have + past participle</b>. It describes an action that will be <b>completed before</b> a specific future time or event: <i>By Friday, I <b>will have finished</b> the report.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-future-perfect" subject="Future Perfect" questions={SPEED_QUESTIONS} variant="sidebar" />
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
            <PDFButton onDownload={handleDownloadPDF} loading={pdfLoading} />
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b2" allLabel="All B2 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b2-future-perfect" subject="Future Perfect" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/passive-advanced" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Passive Voice Advanced →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Future Perfect (B2)</h2>
      <p>The Future Perfect (<b>will have + past participle</b>) describes an action that will be <b>completed before</b> a specific future time or another future event.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Forms</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Positive", rows: ["I / she / they will have finished.", "By noon, he will have left."] },
            { label: "Negative", rows: ["I / she / they won't have finished.", "She won't have arrived by 8."] },
            { label: "Question", rows: ["Will you have finished by then?", "Will she have left by midnight?"] },
            { label: "Short answers", rows: ["Yes, I will. / No, I won't.", "Yes, she will. / No, she won't."] },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
              {rows.map((r) => <div key={r} className="text-sm text-slate-800 italic">{r}</div>)}
            </div>
          ))}
        </div>
      </div>

      <h3>Key signal words</h3>
      <div className="not-prose flex flex-wrap gap-2 mt-2">
        {["by (+ time/date)", "by the time", "before", "by then", "in (+ period)", "when"].map((w) => (
          <span key={w} className="rounded-xl border border-black/10 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">{w}</span>
        ))}
      </div>

      <h3>Future Perfect vs Future Continuous</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="text-xs font-bold text-orange-700 mb-2">FUTURE PERFECT — completed by a point</div>
            <div className="text-sm italic text-slate-800">By 6pm, I will have written the report.</div>
            <div className="mt-1 text-xs text-slate-500">The report will be done before 6pm.</div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <div className="text-xs font-bold text-sky-700 mb-2">FUTURE CONTINUOUS — in progress at a point</div>
            <div className="text-sm italic text-slate-800">At 6pm, I will be writing the report.</div>
            <div className="mt-1 text-xs text-slate-500">The report will still be in progress at 6pm.</div>
          </div>
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Tip:</span> After <i>by the time</i>, <i>when</i>, <i>before</i>, <i>after</i>, <i>as soon as</i> — use <b>present simple</b>, not a future tense: <i>By the time she <b>arrives</b> (not will arrive), I will have cooked dinner.</i>
        </div>
      </div>
    </div>
  );
}
