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
  { q: "Future Continuous structure is?", options: ["will have + pp", "will be + -ing", "would be + -ing", "will + infinitive"], answer: 1 },
  { q: "Future Continuous is used for?", options: ["Completed future action", "Action in progress at future moment", "Past habit", "General truth"], answer: 1 },
  { q: "'At 8pm I will be eating' means?", options: ["I will eat at 8pm", "Eating is in progress at 8pm", "I ate at 8pm", "I might eat at 8pm"], answer: 1 },
  { q: "Which is correct Future Continuous?", options: ["will eating", "will be eating", "will been eating", "would eating"], answer: 1 },
  { q: "Future Continuous negative?", options: ["won't be working", "will not working", "won't been working", "will be not working"], answer: 0 },
  { q: "Future Continuous question form?", options: ["Will he be working?", "Will he working?", "He will be working?", "Does he will work?"], answer: 0 },
  { q: "'This time next week' signals?", options: ["Past continuous", "Future continuous", "Present continuous", "Future perfect"], answer: 1 },
  { q: "Future Continuous can express?", options: ["Past regrets", "Polite inquiry about plans", "Completed actions", "General truths"], answer: 1 },
  { q: "'Will you be using the car later?' is?", options: ["A command", "A polite question about plans", "A future perfect", "An inversion"], answer: 1 },
  { q: "Future Continuous parallel action: while + clause uses?", options: ["Past simple", "Future perfect", "Future continuous in both", "Present simple"], answer: 2 },
  { q: "Which adverb signals Future Continuous?", options: ["Yesterday", "By then", "At this time tomorrow", "Already"], answer: 2 },
  { q: "Can Future Continuous be used to predict?", options: ["No, never", "Yes, ongoing prediction", "Only with 'might'", "Only negative"], answer: 1 },
  { q: "'-ing' form in Future Continuous is?", options: ["Present participle", "Past participle", "Infinitive", "Gerund"], answer: 0 },
  { q: "Which is NOT Future Continuous use?", options: ["Action at specific future time", "Polite enquiry", "Future result before deadline", "Parallel future actions"], answer: 2 },
  { q: "'Don't call — he will be sleeping' means?", options: ["He slept", "He will be in the middle of sleeping", "He might sleep", "He has slept"], answer: 1 },
  { q: "Future Continuous vs Future Simple: difference?", options: ["No difference", "Cont. = in progress, Simple = instant", "Simple is more formal", "Cont. is only for questions"], answer: 1 },
  { q: "'By this time next year' uses?", options: ["Future continuous", "Future perfect", "Past perfect", "Present perfect"], answer: 1 },
  { q: "Which is a polite Future Continuous question?", options: ["Do you use the car?", "Will you be needing anything?", "Are you going to need?", "Did you need anything?"], answer: 1 },
  { q: "Future Continuous with 'while' means?", options: ["Sequential actions", "Simultaneous future actions", "Past actions", "Conditional actions"], answer: 1 },
  { q: "'She will be working when I arrive' — working refers to?", options: ["Completed action", "Action already done", "Ongoing at arrival time", "Starting after arrival"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Future Continuous",
  subtitle: "will be + -ing: action in progress at a future time",
  level: "B2",
  keyRule: "will be + -ing = action in progress at a specific future moment.",
  exercises: [
    {
      number: 1,
      title: "Choose the correct form",
      difficulty: "easy" as const,
      instruction: "Pick the correct Future Continuous form.",
      questions: [
        "At 8pm tomorrow, I ___ dinner.",
        "This time next week, she ___ in Spain.",
        "Don't call — he ___ his online class.",
        "They ___ the project at midnight.",
        "I ___ in the office at 3pm tomorrow.",
        "She ___ her presentation this time Fri.",
        "We ___ our exams next Monday morning.",
        "He ___ at the airport when you call.",
        "By noon, they ___ the final session.",
        "I ___ dinner when she arrives.",
      ],
    },
    {
      number: 2,
      title: "Write the Future Continuous",
      difficulty: "medium" as const,
      instruction: "Write the correct Future Continuous form.",
      questions: [
        "At 10pm (she/work) on her report.",
        "This time tomorrow (I/fly) to Rome.",
        "Don't come at 3 — (we/have) a meeting.",
        "(he/still sleep) when I get back?",
        "They (not/wait) for us at the station.",
        "What (you/do) at 6pm on Saturday?",
        "She (teach) all day on Tuesday.",
        "At midnight (they/still argue)?",
        "I (not/use) the car this afternoon.",
        "By evening (he/drive) back from Paris.",
      ],
    },
    {
      number: 3,
      title: "Choose: Future Continuous or Simple",
      difficulty: "hard" as const,
      instruction: "Select the best tense for the context.",
      questions: [
        "The train ___ at 9:05 sharp. (depart)",
        "I ___ in the library at 2pm. (study)",
        "___ you ___ the projector later?",
        "She ___ when you call. (probably work)",
        "He ___ the report by Friday. (complete)",
        "I'll call when I ___ this meeting.",
        "They ___ the speech all morning.",
        "___ you ___ past the post office?",
        "We ___ the whole time. (talk)",
        "He ___ before you even get there.",
      ],
    },
    {
      number: 4,
      title: "All Future Continuous uses",
      difficulty: "hard" as const,
      instruction: "Write the full answer using Future Continuous.",
      questions: [
        "Predict: (she/probably work) late tonight.",
        "Parallel: While I cook, (he/set the table).",
        "Polite Q: (you/use) the printer at 4pm?",
        "At a point: At 9am (they/board the plane).",
        "Not done: She (not/attend) the meeting.",
        "Duration: All evening (I/help) my sister.",
        "Q: What (you/do) this time tomorrow?",
        "Negative: He (not/sleep) at 11pm.",
        "Prediction: (it/rain) when we land?",
        "Simultaneous: (they/perform) while we eat.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Future Continuous forms", answers: ["will be having", "will be sitting", "will be attending", "will be working", "will be working", "will be giving", "will be taking", "will be waiting", "will be running", "will be cooking"] },
    { exercise: 2, subtitle: "Written forms", answers: ["she will be working", "I will be flying", "we will be having", "Will he still be sleeping", "they won't be waiting", "What will you be doing", "She will be teaching", "Will they still be arguing", "I won't be using", "he will be driving"] },
    { exercise: 3, subtitle: "Best tense choice", answers: ["will depart", "will be studying", "Will / be using", "will probably be working", "will have completed", "finish", "will be practising", "Will / be going", "will be talking", "will have left"] },
    { exercise: 4, subtitle: "Full Future Continuous answers", answers: ["She will probably be working", "he will be setting the table", "Will you be using", "they will be boarding the plane", "She won't be attending", "I will be helping", "What will you be doing", "He won't be sleeping", "Will it be raining", "they will be performing"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Future Perfect", href: "/grammar/b2/future-perfect", level: "B2", badge: "bg-orange-500", reason: "Future Perfect is the natural companion to Future Continuous" },
  { title: "Past Perfect Continuous", href: "/grammar/b2/past-perfect-continuous", level: "B2", badge: "bg-orange-500", reason: "Continuous aspect in complex time frames" },
  { title: "Modal Perfect", href: "/grammar/b2/modal-perfect", level: "B2", badge: "bg-orange-500" },
];

export default function FutureContinuousLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct Future Continuous form",
      instructions: "Choose the correct Future Continuous form (will be + -ing).",
      questions: [
        { id: "e1q1", prompt: "At 8pm tomorrow, I ___ dinner with my family.", options: ["will have", "will be having", "am having"], correctIndex: 1, explanation: "will be having = action in progress at a specific future time." },
        { id: "e1q2", prompt: "This time next week, she ___ on the beach in Spain.", options: ["will sit", "will be sitting", "is sitting"], correctIndex: 1, explanation: "will be sitting = in progress at a future moment." },
        { id: "e1q3", prompt: "Don't call at noon — he ___ his online class.", options: ["attends", "will attend", "will be attending"], correctIndex: 2, explanation: "will be attending = activity in progress at that moment." },
        { id: "e1q4", prompt: "___ you ___ in the office tomorrow morning?", options: ["Will / work", "Will / be working", "Are / working"], correctIndex: 1, explanation: "Will you be working? = polite question about future plans." },
        { id: "e1q5", prompt: "They ___ the project all day, so don't disturb them.", options: ["will work on", "will be working on", "work on"], correctIndex: 1, explanation: "will be working on = ongoing activity for a whole future period." },
        { id: "e1q6", prompt: "I ___ past the post office, so I can post your letter.", options: ["will pass", "will be passing", "am passing"], correctIndex: 1, explanation: "will be passing = naturally in the course of events — a polite offer." },
        { id: "e1q7", prompt: "At midnight, the team ___ the New Year.", options: ["will celebrate", "will be celebrating", "celebrates"], correctIndex: 1, explanation: "will be celebrating = in progress at midnight." },
        { id: "e1q8", prompt: "She ___ a presentation when the CEO walks in.", options: ["gives", "will give", "will be giving"], correctIndex: 2, explanation: "will be giving = in progress at a future moment." },
        { id: "e1q9", prompt: "We ___ you when you land, so just look for us.", options: ["will wait", "will be waiting", "wait"], correctIndex: 1, explanation: "will be waiting = in progress when you arrive." },
        { id: "e1q10", prompt: "I hope the sun ___ when we get there.", options: ["shines", "will shine", "will be shining"], correctIndex: 2, explanation: "will be shining = in progress at that future moment." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the Future Continuous form",
      instructions: "Write the correct Future Continuous form of the verb in brackets (will be + -ing).",
      questions: [
        { id: "e2q1", prompt: "At 9am tomorrow, I (have) ___ my morning meeting.", correct: "will be having", explanation: "will be having = in progress at that specific time." },
        { id: "e2q2", prompt: "This time next year, she (study) ___ at university.", correct: "will be studying", explanation: "will be studying = in progress at that future point." },
        { id: "e2q3", prompt: "(they/use) ___ the conference room at 3pm?", correct: "will they be using", explanation: "Will they be using = polite inquiry about plans." },
        { id: "e2q4", prompt: "Don't come at 7 — we (eat) ___ dinner.", correct: "will be eating", explanation: "will be eating = in progress at 7pm." },
        { id: "e2q5", prompt: "He (not/sleep) ___ — he never goes to bed before midnight.", correct: "won't be sleeping", explanation: "won't be sleeping = negative Future Continuous." },
        { id: "e2q6", prompt: "I (drive) ___ past your house, so I can give you a lift.", correct: "will be driving", explanation: "will be driving = naturally in the course of events." },
        { id: "e2q7", prompt: "The builders (work) ___ all weekend on the new road.", correct: "will be working", explanation: "will be working = ongoing activity across a future period." },
        { id: "e2q8", prompt: "How long (you/wait) ___ by the time she arrives?", correct: "will you be waiting", explanation: "will you be waiting = question about ongoing future activity." },
        { id: "e2q9", prompt: "I can't meet on Friday — I (travel) ___ to Berlin.", correct: "will be travelling", explanation: "will be travelling = in progress that day." },
        { id: "e2q10", prompt: "The children (play) ___ in the park at that time.", correct: "will be playing", explanation: "will be playing = in progress at that future moment." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Future Continuous vs will / going to",
      instructions: "Choose the most natural form. Think about whether the action is in progress, a decision, or a plan.",
      questions: [
        { id: "e3q1", prompt: "Watch out! That vase ___!", options: ["will fall", "will be falling", "is going to fall"], correctIndex: 2, explanation: "is going to fall = we can see the evidence right now — imminent event." },
        { id: "e3q2", prompt: "I've decided — I ___ the new job.", options: ["will take", "will be taking", "am going to take"], correctIndex: 0, explanation: "will take = spontaneous decision at the moment of speaking." },
        { id: "e3q3", prompt: "At 10am tomorrow, the board ___ the new proposal.", options: ["discusses", "will be discussing", "is going to discuss"], correctIndex: 1, explanation: "will be discussing = in progress at that specific time." },
        { id: "e3q4", prompt: "We've booked flights. We ___ to Rome next month.", options: ["will fly", "will be flying", "are going to fly"], correctIndex: 2, explanation: "are going to fly = fixed plan with arrangement already made." },
        { id: "e3q5", prompt: "I promise I ___ you as soon as I land.", options: ["will call", "will be calling", "am going to call"], correctIndex: 0, explanation: "will call = promise / offer → will." },
        { id: "e3q6", prompt: "In 2030, scientists ___ new solutions to climate change.", options: ["will develop", "will be developing", "are going to develop"], correctIndex: 1, explanation: "will be developing = ongoing activity at a future point in time." },
        { id: "e3q7", prompt: "He looks exhausted — he ___ to bed early tonight.", options: ["will go", "will be going", "is going to go"], correctIndex: 2, explanation: "is going to go = evidence-based prediction (he's exhausted)." },
        { id: "e3q8", prompt: "Don't ring at 8 — I ___ the kids to bed.", options: ["put", "will be putting", "will put"], correctIndex: 1, explanation: "will be putting = activity in progress at that time." },
        { id: "e3q9", prompt: "A: The printer's broken. B: I ___ it for you.", options: ["will fix", "will be fixing", "am going to fix"], correctIndex: 0, explanation: "will fix = spontaneous offer." },
        { id: "e3q10", prompt: "Next summer, I ___ my thesis for months.", options: ["write", "will be writing", "will have written"], correctIndex: 1, explanation: "will be writing = ongoing activity across that period." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — will / going to / Future Continuous / Future Perfect",
      instructions: "Write the most appropriate future form of the verb in brackets. Multiple tenses are tested.",
      questions: [
        { id: "e4q1", prompt: "Look at those clouds — it (rain) ___.", correct: "is going to rain", explanation: "is going to rain = evidence of immediate future." },
        { id: "e4q2", prompt: "At this time tomorrow, we (fly) ___ over the Alps.", correct: "will be flying", explanation: "will be flying = in progress at a specific future moment." },
        { id: "e4q3", prompt: "A: There's no milk. B: Don't worry, I (get) ___ some.", correct: "will get", explanation: "will get = spontaneous decision." },
        { id: "e4q4", prompt: "By the time you arrive, I (finish) ___ cooking.", correct: "will have finished", explanation: "will have finished = completed before a future point → Future Perfect." },
        { id: "e4q5", prompt: "We (meet) ___ every Tuesday this term — it's in the calendar.", correct: "are going to meet", explanation: "are going to meet = pre-arranged plan." },
        { id: "e4q6", prompt: "He (not/be) ___ at the office at 3 — he has a doctor's appointment.", correct: "won't be", explanation: "won't be = negative will (simple fact about future)." },
        { id: "e4q7", prompt: "In ten years, robots (do) ___ most factory work.", correct: "will be doing", explanation: "will be doing = ongoing state at a future point." },
        { id: "e4q8", prompt: "By 2030, the company (open) ___ 50 new branches.", correct: "will have opened", explanation: "will have opened = completed by a future deadline → Future Perfect." },
        { id: "e4q9", prompt: "She (present) ___ her findings at noon tomorrow. She practised all week.", correct: "will be presenting", explanation: "will be presenting = in progress at noon." },
        { id: "e4q10", prompt: "A: I can't come to the meeting. B: That's fine — I (record) ___ it for you.", correct: "will record", explanation: "will record = spontaneous offer / promise." },
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
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Future Continuous</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Future{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Continuous</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The Future Continuous uses <b>will be + -ing</b>. It describes an action that will be <b>in progress</b> at a specific future time, or something happening naturally in the course of events: <i>At 8pm I <b>will be watching</b> the game.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-future-continuous" subject="Future Continuous" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-b2-future-continuous" subject="Future Continuous" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/future-perfect" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Future Perfect →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Future Continuous (B2)</h2>
      <p>The Future Continuous (<b>will be + -ing</b>) describes an action that will be <b>in progress</b> at a specific future moment, or something that will happen naturally as part of the course of events.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Forms</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Positive", rows: ["I / she / they will be working.", "He will be waiting for you."] },
            { label: "Negative", rows: ["I / she / they won't be sleeping.", "He won't be using the car."] },
            { label: "Question", rows: ["Will she be attending the meeting?", "Will you be using the laptop?"] },
            { label: "Short answers", rows: ["Yes, she will. / No, she won't.", "Yes, I will. / No, I won't."] },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
              {rows.map((r) => <div key={r} className="text-sm text-slate-800 italic">{r}</div>)}
            </div>
          ))}
        </div>
      </div>

      <h3>Main uses</h3>
      <div className="not-prose space-y-3 mt-2">
        {[
          { title: "1. In progress at a specific future time", ex: "At 10pm tomorrow, I'll be watching the final.", note: "Signal words: at (time), this time tomorrow/next week" },
          { title: "2. Natural course of events (polite)", ex: "I'll be passing the shop anyway, so I'll get some bread.", note: "Less direct than 'will' — sounds more natural/polite." },
          { title: "3. Polite questions about plans", ex: "Will you be needing the car tonight?", note: "Softer than 'Are you going to use the car?'" },
        ].map(({ title, ex, note }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-bold text-slate-900 text-sm">{title}</div>
            <div className="mt-1 italic text-slate-700 text-sm">{ex}</div>
            <div className="mt-1 text-xs text-slate-500">{note}</div>
          </div>
        ))}
      </div>

      <h3>Comparison with other future forms</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="space-y-3 text-sm">
          {[
            { form: "will + infinitive", use: "Spontaneous decisions, promises, offers", ex: "I'll help you." },
            { form: "going to + infinitive", use: "Plans already decided, evidence-based predictions", ex: "It's going to rain — look at those clouds." },
            { form: "will be + -ing", use: "In progress at a future point, natural course of events", ex: "At noon I'll be presenting to the board." },
          ].map(({ form, use, ex }) => (
            <div key={form} className="grid grid-cols-[1fr_2fr] gap-2 rounded-xl border border-black/10 bg-slate-50 p-3">
              <div className="font-bold text-orange-700">{form}</div>
              <div>
                <div className="text-slate-700">{use}</div>
                <div className="italic text-slate-500 mt-0.5">{ex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
