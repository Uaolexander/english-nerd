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
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";
import { useLiveSync } from "@/lib/useLiveSync";

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type InputQ = {
  id: string;
  prompt: string;
  correct: string;
  explanation: string;
};

type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) {
  return s.trim().toLowerCase();
}

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Will (Future)", href: "/grammar/a2/will-future", level: "A2", badge: "bg-emerald-600", reason: "Compare 'going to' with 'will' for future plans" },
  { title: "Present Continuous", href: "/grammar/a2/present-continuous", level: "A2", badge: "bg-emerald-600", reason: "Present continuous for future arrangements" },
  { title: "Present Perfect (Introduction)", href: "/grammar/a2/present-perfect-intro", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "She ___ study medicine. (plan)", options: ["is going to", "are going to", "am going to", "going to"], answer: 0 },
  { q: "We ___ move to a bigger flat.", options: ["is going to", "am going to", "are going to", "going"], answer: 2 },
  { q: "I ___ call you when I get home.", options: ["is going to", "are going to", "am going to", "goes to"], answer: 2 },
  { q: "He ___ start his new job Monday.", options: ["are going to", "is going to", "am going to", "going to"], answer: 1 },
  { q: "They ___ have a baby!", options: ["is going to", "am going to", "going to", "are going to"], answer: 3 },
  { q: "Look! It ___ rain.", options: ["are going to", "am going to", "is going to", "going"], answer: 2 },
  { q: "I ___ not eat meat anymore.", options: ["is not going to", "are not going to", "am not going to", "not going to"], answer: 2 },
  { q: "Are you going to stay? — Yes, ___ .", options: ["I am", "I do", "I will", "I going"], answer: 0 },
  { q: "She ___ not come — she has an exam.", options: ["am not going to", "are not going to", "is not going to", "not going"], answer: 2 },
  { q: "We ___ buy tickets online.", options: ["is going to", "am going to", "are going to", "going to"], answer: 2 },
  { q: "___ she tell him the truth?", options: ["Are she going to", "Is she going to", "Does she going to", "Do she going to"], answer: 1 },
  { q: "You ___ slip! (visible danger)", options: ["am going to", "is going to", "are going to", "going to"], answer: 2 },
  { q: "He ___ retire next spring.", options: ["are going to", "am going to", "is going to", "going to"], answer: 2 },
  { q: "They ___ not renew the lease.", options: ["isn't going to", "am not going to", "aren't going to", "not going to"], answer: 2 },
  { q: "What ___ they do after graduation?", options: ["is they going to", "do they going to", "are they going to", "does they going to"], answer: 2 },
  { q: "___ you ___ stay or go out?", options: ["Is you going to", "Do you going to", "Are you going to", "Am you going to"], answer: 2 },
  { q: "I ___ take the earlier train.", options: ["is going to", "are going to", "am going to", "going to"], answer: 2 },
  { q: "She ___ run her first marathon.", options: ["am going to", "are going to", "is going to", "going to"], answer: 2 },
  { q: "He has booked the hotel — he ___ visit Rome.", options: ["will", "are going to", "is going to", "am going to"], answer: 2 },
  { q: "We ___ not miss this flight!", options: ["is not going to", "am not going to", "are not going to", "not going to"], answer: 2 },
];

export default function GoingToLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct going to form",
      instructions: "Choose the correct form of 'going to' for each sentence.",
      questions: [
        { id: "e1q1", prompt: "She ___ study medicine at university.", options: ["is going to", "are going to", "going to"], correctIndex: 0, explanation: "She → is going to study." },
        { id: "e1q2", prompt: "We ___ move to a bigger flat next year.", options: ["going to", "is going to", "are going to"], correctIndex: 2, explanation: "We → are going to move." },
        { id: "e1q3", prompt: "I ___ call you as soon as I get home.", options: ["is going to", "am going to", "are going to"], correctIndex: 1, explanation: "I → am going to call." },
        { id: "e1q4", prompt: "He ___ start his new job on Monday.", options: ["is going to", "are going to", "am going to"], correctIndex: 0, explanation: "He → is going to start." },
        { id: "e1q5", prompt: "They ___ have a baby — they told me this morning!", options: ["is going to", "am going to", "are going to"], correctIndex: 2, explanation: "They → are going to have." },
        { id: "e1q6", prompt: "She ___ not come to the party — she has an exam.", options: ["is not going to", "are not going to", "am not going to"], correctIndex: 0, explanation: "She → is not going to come. (= isn't going to come)" },
        { id: "e1q7", prompt: "Look at those clouds! It ___ rain.", options: ["is going to", "are going to", "going to"], correctIndex: 0, explanation: "It → is going to rain. We use going to when we can see evidence." },
        { id: "e1q8", prompt: "I ___ not eat meat anymore — I made the decision last week.", options: ["are not going to", "am not going to", "is not going to"], correctIndex: 1, explanation: "I → am not going to eat." },
        { id: "e1q9", prompt: "He ___ learn to drive this summer.", options: ["is going to", "am going to", "are going to"], correctIndex: 0, explanation: "He → is going to learn." },
        { id: "e1q10", prompt: "We ___ buy tickets for the concert online.", options: ["is going to", "am going to", "are going to"], correctIndex: 2, explanation: "We → are going to buy." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct going to form",
      instructions: "Complete the sentence with the correct going to form. Write the full phrase: am going to / is going to / are going to + verb.",
      questions: [
        { id: "e2q1", prompt: "She ___ (study) all night before the exam.", correct: "is going to study", explanation: "She → is going to study." },
        { id: "e2q2", prompt: "They ___ (travel) to Japan this summer.", correct: "are going to travel", explanation: "They → are going to travel." },
        { id: "e2q3", prompt: "I ___ (cook) pasta for dinner tonight.", correct: "am going to cook", explanation: "I → am going to cook." },
        { id: "e2q4", prompt: "He ___ (buy) a new phone next week.", correct: "is going to buy", explanation: "He → is going to buy." },
        { id: "e2q5", prompt: "We ___ (watch) the match at Mike's house.", correct: "are going to watch", explanation: "We → are going to watch." },
        { id: "e2q6", prompt: "She ___ (meet) her old school friends this Saturday.", correct: "is going to meet", explanation: "She → is going to meet." },
        { id: "e2q7", prompt: "They ___ (open) a new café in the city centre.", correct: "are going to open", explanation: "They → are going to open." },
        { id: "e2q8", prompt: "I ___ (start) learning Spanish next month.", correct: "am going to start", explanation: "I → am going to start." },
        { id: "e2q9", prompt: "He ___ (ask) his boss for a raise.", correct: "is going to ask", explanation: "He → is going to ask." },
        { id: "e2q10", prompt: "We ___ (move) to a new city in the spring.", correct: "are going to move", explanation: "We → are going to move." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Going to in context",
      instructions: "Choose the correct option. Some questions test going to questions and negatives.",
      questions: [
        { id: "e3q1", prompt: "___ you ___ stay at home or go out tonight?", options: ["Are you going to", "Is you going to", "Do you going to"], correctIndex: 0, explanation: "Questions: Are/Is/Am + subject + going to + verb? You → Are you going to?" },
        { id: "e3q2", prompt: "Look at him! He ___ fall off that ladder!", options: ["is going to", "will", "are going to"], correctIndex: 0, explanation: "We can see the danger (evidence) → going to. He is going to fall!" },
        { id: "e3q3", prompt: "She ___ not renew her contract. She told her boss yesterday.", options: ["is not going to", "are not going to", "am not going to"], correctIndex: 0, explanation: "Negative: She is not going to / She isn't going to renew." },
        { id: "e3q4", prompt: "What ___ they ___ after they graduate?", options: ["are they going to do", "is they going to do", "do they going to do"], correctIndex: 0, explanation: "What are they going to do? — question word + are + they + going to + verb." },
        { id: "e3q5", prompt: "We ___ not miss this flight — we have to be there!", options: ["are not going to", "is not going to", "am not going to"], correctIndex: 0, explanation: "We → are not going to miss." },
        { id: "e3q6", prompt: "He has already booked the hotel — he ___ visit Rome.", options: ["is going to", "will", "are going to"], correctIndex: 0, explanation: "A planned intention with preparation → going to." },
        { id: "e3q7", prompt: "___ she ___ tell him the truth?", options: ["Is she going to", "Are she going to", "Does she going to"], correctIndex: 0, explanation: "She → Is she going to tell?" },
        { id: "e3q8", prompt: "I ___ not eat junk food anymore. I made a decision this morning.", options: ["am not going to", "is not going to", "are not going to"], correctIndex: 0, explanation: "I → am not going to eat." },
        { id: "e3q9", prompt: "They ___ retire next year — they've been planning it for ages.", options: ["are going to", "is going to", "going to"], correctIndex: 0, explanation: "They → are going to retire. A plan they've prepared for." },
        { id: "e3q10", prompt: "It's very icy outside. Be careful — you ___ slip!", options: ["are going to", "will", "is going to"], correctIndex: 0, explanation: "You → are going to slip. Visible danger/evidence." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Positive, negative and question forms",
      instructions: "Write the correct going to form (positive, negative with isn't/aren't, or question). Include the subject where shown.",
      questions: [
        { id: "e4q1", prompt: "I've decided — I ___ (leave) this job by the end of the year.", correct: "am going to leave", explanation: "I → am going to leave. A decision already made." },
        { id: "e4q2", prompt: "Look at those black clouds — it ___ (rain) any second now!", correct: "is going to rain", explanation: "It → is going to rain. Clear visible evidence." },
        { id: "e4q3", prompt: "She ___ (not/eat) meat anymore. She decided last month.", correct: "isn't going to eat", explanation: "She → isn't going to eat (= is not going to eat)." },
        { id: "e4q4", prompt: "We ___ (celebrate) with a big dinner on Friday.", correct: "are going to celebrate", explanation: "We → are going to celebrate." },
        { id: "e4q5", prompt: "He ___ (retire) next spring — he's been counting the days!", correct: "is going to retire", explanation: "He → is going to retire. A definite future plan." },
        { id: "e4q6", prompt: "They ___ (not/renew) their lease — they want to buy a house.", correct: "aren't going to renew", explanation: "They → aren't going to renew (= are not going to renew)." },
        { id: "e4q7", prompt: "I ___ (take) the earlier train — it gets there faster.", correct: "am going to take", explanation: "I → am going to take." },
        { id: "e4q8", prompt: "She ___ (run) her first marathon in April. She's been training for months.", correct: "is going to run", explanation: "She → is going to run. Clear intention + preparation." },
        { id: "e4q9", prompt: "We ___ (not/go) to the beach — the weather looks awful.", correct: "aren't going to go", explanation: "We → aren't going to go (= are not going to go)." },
        { id: "e4q10", prompt: "He ___ (propose) to her tonight! He's got the ring and everything!", correct: "is going to propose", explanation: "He → is going to propose. A clear plan." },
      ],
    },
  }), []);

  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const { isLive, broadcast } = useLiveSync((payload) => {
    setMcqAnswers(payload.answers as Record<string, number | null>);
    setInputAnswers((payload as unknown as { inputAnswers: Record<string, string> }).inputAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

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
      for (const q of current.questions) {
        if (mcqAnswers[q.id] === q.correctIndex) correct++;
      }
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
        title: "Going to",
        subtitle: "Future Plans & Intentions — 4 exercises + answer key",
        level: "A2",
        keyRule: "Subject + am/is/are + going to + base verb → for plans already decided or evidence-based predictions.",
        exercises: [
          { number: 1, title: "Exercise 1", difficulty: "Easy", instruction: "Choose the correct going to form.", questions: [
            "She ___ study medicine at university.", "We ___ move to a bigger flat next year.", "I ___ call you as soon as I get home.",
            "He ___ start his new job on Monday.", "They ___ have a baby!", "She ___ not come — she has an exam.",
            "Look at those clouds! It ___ rain.", "I ___ not eat meat anymore.", "He ___ learn to drive this summer.",
            "We ___ buy tickets for the concert online.",
          ]},
          { number: 2, title: "Exercise 2", difficulty: "Medium", instruction: "Write am/is/are going to + verb.", questions: [
            "She ___ (study) all night before the exam.", "They ___ (travel) to Japan this summer.", "I ___ (cook) pasta for dinner tonight.",
            "He ___ (buy) a new phone next week.", "We ___ (watch) the match at Mike's house.", "She ___ (meet) her school friends Saturday.",
            "They ___ (open) a new café in the city centre.", "I ___ (start) learning Spanish next month.",
            "He ___ (ask) his boss for a raise.", "We ___ (move) to a new city in the spring.",
          ]},
          { number: 3, title: "Exercise 3", difficulty: "Hard", instruction: "Choose the correct option (questions, negatives, context).", questions: [
            "___ you ___ stay at home or go out tonight?", "Look at him! He ___ fall off that ladder!",
            "She ___ not renew her contract. She told her boss yesterday.", "What ___ they ___ after they graduate?",
            "We ___ not miss this flight — we have to be there!", "He has already booked the hotel — he ___ visit Rome.",
            "___ she ___ tell him the truth?", "I ___ not eat junk food anymore. I decided this morning.",
            "They ___ retire next year — they've been planning it for ages.", "It's icy outside — you ___ slip!",
          ]},
          { number: 4, title: "Exercise 4", difficulty: "Harder", instruction: "Write the correct going to form (positive, negative or question).", questions: [
            "I've decided — I ___ (leave) this job by the end of the year.", "Look at those black clouds — it ___ (rain) any second!",
            "She ___ (not/eat) meat anymore. She decided last month.", "We ___ (celebrate) with a big dinner on Friday.",
            "He ___ (retire) next spring — he's been counting the days!", "They ___ (not/renew) their lease — they want to buy.",
            "I ___ (take) the earlier train — it gets there faster.", "She ___ (run) her first marathon in April.",
            "We ___ (not/go) to the beach — the weather looks awful.", "He ___ (propose) tonight! He's got the ring!",
          ]},
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — choose going to form", answers: ["is going to", "are going to", "am going to", "is going to", "are going to", "is not going to", "is going to", "am not going to", "is going to", "are going to"] },
          { exercise: 2, subtitle: "Medium — write am/is/are going to", answers: ["is going to study", "are going to travel", "am going to cook", "is going to buy", "are going to watch", "is going to meet", "are going to open", "am going to start", "is going to ask", "are going to move"] },
          { exercise: 3, subtitle: "Hard — questions & negatives", answers: ["Are you going to", "is going to", "is not going to", "are they going to do", "are not going to", "is going to", "Is she going to", "am not going to", "are going to", "are going to"] },
          { exercise: 4, subtitle: "Harder — mixed forms", answers: ["am going to leave", "is going to rain", "isn't going to eat", "are going to celebrate", "is going to retire", "aren't going to renew", "am going to take", "is going to run", "aren't going to go", "is going to propose"] },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  function resetExercise() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
    broadcast({ answers: {}, checked: false, exNo });
  }

  function switchExercise(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
    broadcast({ answers: {}, checked: false, exNo: n });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Going to</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Going to{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">future plans</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">
          A2
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>going to</b> to talk about <b>plans and intentions</b> you have already decided, or to make predictions based on <b>what you can see right now</b>. Form: <b>am / is / are + going to + base verb</b>.
      </p>

      {/* Layout: left ad/game + center content + right ad/recommendations */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a2-going-to" subject="Going to" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <AdUnit variant="sidebar-dark" />

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
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => { setMcqAnswers((p) => { const n = { ...p, [q.id]: oi }; broadcast({ answers: n, checked, exNo }); return n; }); }} />
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
                      <button onClick={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
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
            ) : (
              <Explanation />
            )}
          </div>
        </section>

        {/* Right column */}
        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/a2" allLabel="All A2 topics" />
        ) : (
          <AdUnit variant="sidebar-light" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-going-to" subject="Going to" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">
          ← All A2 topics
        </a>
        <a href="/grammar/a2/will-future" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
          Next: Will (future) →
        </a>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
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

function Ex({ en, correct = true }: { en: string; correct?: boolean }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 ${correct ? "bg-white border border-black/8" : "bg-red-50 border border-red-100"}`}>
      <span className="text-sm shrink-0">{correct ? "✅" : "❌"}</span>
      <div className={`font-semibold text-sm ${correct ? "text-slate-900" : "text-red-700 line-through"}`}>{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Be Going To — Plans &amp; Predictions</h2>
        <p className="text-slate-500 text-sm">Used for plans already decided and predictions based on visible evidence.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700 mb-2">✅ Affirmative</div>
          <Formula parts={[{text:"Subject"},{dim:true,text:"+"},{text:"am/is/are",color:"green"},{dim:true,text:"+"},{text:"going to"},{dim:true,text:"+"},{text:"verb"}]} />
          <div className="mt-3 space-y-2">
            <Ex en="I'm going to travel next summer." />
            <Ex en="She is going to study tonight." />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-red-600 mb-2">❌ Negative</div>
          <Formula parts={[{text:"Subject"},{dim:true,text:"+"},{text:"am/is/are",color:"red"},{dim:true,text:"+"},{text:"not"},{dim:true,text:"+"},{text:"going to"},{dim:true,text:"+"},{text:"verb"}]} />
          <div className="mt-3 space-y-2">
            <Ex en="He isn't going to come." />
            <Ex en="I going to travel." correct={false} />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-sky-700 mb-2">❓ Question</div>
          <Formula parts={[{text:"Am/Is/Are",color:"sky"},{dim:true,text:"+"},{text:"subject"},{dim:true,text:"+"},{text:"going to"},{dim:true,text:"+"},{text:"verb"},{text:"?"}]} />
          <div className="mt-3 space-y-2">
            <Ex en="Are you going to stay?" />
            <Ex en="Is she going to call?" />
          </div>
        </div>
      </div>

      {/* Usage cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-violet-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-violet-700 mb-2">📋 Plans &amp; Intentions</div>
          <p className="text-xs text-slate-500 mb-3">A decision made before the moment of speaking.</p>
          <Ex en="I'm going to study medicine." />
          <div className="mt-2">
            <Ex en="We're going to move to Spain next year." />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-b from-orange-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-orange-700 mb-2">🌩 Evidence-based Predictions</div>
          <p className="text-xs text-slate-500 mb-3">You can see something happening right now.</p>
          <Ex en="Look at those clouds — it's going to rain!" />
          <div className="mt-2">
            <Ex en="Watch out — you're going to fall!" />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</div>
          <span className="font-bold text-slate-800">Subject Forms — am / is / are</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-slate-50">
                <th className="text-left py-2 px-3 font-bold text-slate-600">Subject</th>
                <th className="text-left py-2 px-3 font-bold text-slate-600">Full form</th>
                <th className="text-left py-2 px-3 font-bold text-slate-600">Contraction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I","I am going to","I'm going to"],
                ["he / she / it","he is going to","he's going to"],
                ["you / we / they","they are going to","they're going to"],
              ].map(([subj, full, short]) => (
                <tr key={subj}>
                  <td className="py-2 px-3 font-semibold text-slate-700">{subj}</td>
                  <td className="py-2 px-3 text-slate-500">{full}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{short}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> going to vs will — plans with evidence → <strong>going to</strong>; spontaneous decisions → <strong>will</strong>. <em>"I'm going to buy a car"</em> (planned) vs <em>"I'll take the red one"</em> (spontaneous choice in the shop).
      </div>
    </div>
  );
}
