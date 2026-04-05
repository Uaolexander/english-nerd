"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF, type LessonPDFConfig } from "@/lib/generateLessonPDF";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "would for past habits: would + ___", options: ["gerund", "infinitive (base verb)", "past participle", "present tense"], answer: 1 },
  { q: "would for past habits describes:", options: ["A single past event", "A future plan", "Repeated past actions", "A present fact"], answer: 2 },
  { q: "would CANNOT be used with past ___:", options: ["actions", "routines", "states (be, have, know)", "habits"], answer: 2 },
  { q: "'Every Sunday, my dad ___ make breakfast.'", options: ["will", "is", "would", "does"], answer: 2 },
  { q: "used to vs. would: 'I used to be shy' — can you replace with 'would'?", options: ["Yes, always", "No — 'be' is a state", "Yes, sometimes", "Only in questions"], answer: 1 },
  { q: "'She ___ always bring flowers when she visited.'", options: ["will", "is", "would", "was"], answer: 2 },
  { q: "Which is WRONG?", options: ["He would play chess.", "She would visit us.", "They would be poor.", "We would walk there."], answer: 2 },
  { q: "'In summer, we ___ go to the lake every day.'", options: ["will", "would", "are", "were"], answer: 1 },
  { q: "would + past habit: needs a ___ time reference", options: ["Future", "Present", "Past", "No reference needed"], answer: 2 },
  { q: "'As a child, she ___ collect stamps.'", options: ["will", "would", "does", "is"], answer: 1 },
  { q: "Can 'would' replace 'used to' in: 'I used to have a dog'?", options: ["Yes", "No — have is a state", "Only in negative", "Only in questions"], answer: 1 },
  { q: "Negative form of would for past habits:", options: ["wouldn't + infinitive", "didn't would", "used to not", "won't"], answer: 0 },
  { q: "'My grandfather ___ tell us stories about old days.'", options: ["will", "would", "does", "is"], answer: 1 },
  { q: "'They ___ meet at the café after school.'", options: ["are", "will", "would", "do"], answer: 2 },
  { q: "Which sentence is CORRECT?", options: ["She would have long hair as a child.", "She would be tall as a child.", "She would walk to school as a child.", "She would know everyone in town."], answer: 2 },
  { q: "'On Saturdays, they ___ visit the market together.'", options: ["are", "would", "will", "do"], answer: 1 },
  { q: "'We ___ play board games every Friday evening.'", options: ["will", "would", "are", "do"], answer: 1 },
  { q: "would for habits is used in ___ style writing/speaking:", options: ["Informal only", "Formal or literary narrative", "Scientific only", "Future tense"], answer: 1 },
  { q: "Which CANNOT use would?", options: ["play tennis every day", "go swimming in summer", "live in a small village", "visit grandma on Sundays"], answer: 2 },
  { q: "'In the evenings, we ___ sit on the porch and talk.'", options: ["will", "would", "are", "do"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Would for Past Habits",
  subtitle: "would + infinitive = repeated past action",
  level: "B1",
  keyRule: "would + infinitive = repeated past action/routine. Cannot use 'would' with past states (be, have, like, know).",
  exercises: [
    {
      number: 1,
      title: "Choose the correct option",
      difficulty: "Easy",
      instruction: "Choose 'would' to express a past habit.",
      questions: [
        "Every Sunday, my dad ___ make breakfast.",
        "When I was a student, I ___ stay up late.",
        "She ___ always bring flowers when she visited.",
        "In summer, we ___ go to the lake every day.",
        "He ___ read a story to his children every night.",
        "They ___ meet at the café after school.",
        "My grandfather ___ tell us stories.",
        "As a child, she ___ collect stamps.",
        "On Saturdays, they ___ visit the market.",
        "We ___ play board games every Friday.",
      ],
    },
    {
      number: 2,
      title: "Write the correct form",
      difficulty: "Medium",
      instruction: "Write 'would' + verb for past habit.",
      questions: [
        "Every evening, my mother (read) ___ to us.",
        "In winter, we (sit) ___ by the fire.",
        "He (walk) ___ to school every day, even in rain.",
        "On Saturdays, they (visit) ___ the market.",
        "She (write) ___ long letters to her pen pal.",
        "As a student, I (spend) ___ hours in the library.",
        "My dad (cook) ___ Sunday dinner for everyone.",
        "She (practise) ___ piano every afternoon.",
        "They (play) ___ chess after school.",
        "He (bring) ___ flowers for his mother every week.",
      ],
    },
    {
      number: 3,
      title: "would or used to?",
      difficulty: "Hard",
      instruction: "Decide: use would OR used to (where would is wrong).",
      questions: [
        "I ___ be very shy as a teenager. (state)",
        "She ___ sing in the choir every week. (habit)",
        "They ___ have a big house by the sea. (state)",
        "He ___ walk to school every morning. (habit)",
        "We ___ know everyone in the village. (state)",
        "I ___ practise guitar every night. (habit)",
        "She ___ like classical music. (state)",
        "He ___ tell jokes at every party. (habit)",
        "We ___ live in a small flat. (state)",
        "She ___ cycle to work every day. (habit)",
      ],
    },
    {
      number: 4,
      title: "Error correction",
      difficulty: "Harder",
      instruction: "Correct the mistake if there is one.",
      questions: [
        "She would be a dancer when she was young.",
        "He would walk miles to get to school.",
        "I would have a cat when I was young.",
        "We would eat dinner together every evening.",
        "They would know everyone in the neighbourhood.",
        "She would practice piano every afternoon.",
        "He would love playing football as a child.",
        "We would visit our grandparents every summer.",
        "I would be scared of the dark as a child.",
        "She would bake bread every Saturday morning.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "would + habit", answers: ["would", "would", "would", "would", "would", "would", "would", "would", "would", "would"] },
    { exercise: 2, subtitle: "Write would + verb", answers: ["would read", "would sit", "would walk", "would visit", "would write", "would spend", "would cook", "would practise", "would play", "would bring"] },
    { exercise: 3, subtitle: "would or used to", answers: ["used to", "would", "used to", "would", "used to", "would", "used to", "would", "used to", "would"] },
    { exercise: 4, subtitle: "Error correction", answers: ["used to be (state)", "correct", "used to have (state)", "correct", "used to know (state)", "correct", "used to love (state)", "correct", "used to be (state)", "correct"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Used to", href: "/grammar/b1/used-to", level: "B1", badge: "bg-violet-500", reason: "The other common way to talk about past habits" },
  { title: "Past Continuous", href: "/grammar/b1/past-continuous", level: "B1", badge: "bg-violet-500" },
  { title: "So / Such", href: "/grammar/b1/so-such", level: "B1", badge: "bg-violet-500" },
];

export default function WouldPastHabitsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct option",
      instructions: "Choose 'would' or another option to complete the sentence about a past habit.",
      questions: [
        { id: "e1q1", prompt: "Every Sunday, my dad ___ make a big breakfast for the whole family.", options: ["would", "will", "is"], correctIndex: 0, explanation: "Repeated past habit → would make." },
        { id: "e1q2", prompt: "When I was a student, I ___ stay up all night studying.", options: ["will", "would", "am"], correctIndex: 1, explanation: "Past repeated action → would stay." },
        { id: "e1q3", prompt: "She ___ always bring flowers when she visited her grandmother.", options: ["will", "would", "is"], correctIndex: 1, explanation: "Repeated past action → would bring." },
        { id: "e1q4", prompt: "In summer, we ___ go to the lake almost every day.", options: ["would", "will", "are"], correctIndex: 0, explanation: "Past repeated habit → would go." },
        { id: "e1q5", prompt: "He ___ read a bedtime story to his children every night.", options: ["will", "would", "does"], correctIndex: 1, explanation: "Repeated past routine → would read." },
        { id: "e1q6", prompt: "They ___ meet at the café after school and talk for hours.", options: ["are", "will", "would"], correctIndex: 2, explanation: "Past repeated habit → would meet." },
        { id: "e1q7", prompt: "My grandfather ___ tell us stories about the old days.", options: ["would", "will", "is"], correctIndex: 0, explanation: "Repeated past action → would tell." },
        { id: "e1q8", prompt: "As a child, she ___ collect stamps from all over the world.", options: ["will", "would", "does"], correctIndex: 1, explanation: "Past repeated hobby → would collect." },
        { id: "e1q9", prompt: "On Saturdays, they ___ visit the market together.", options: ["are", "would", "will"], correctIndex: 1, explanation: "Past weekly routine → would visit." },
        { id: "e1q10", prompt: "We ___ play board games every Friday evening.", options: ["will", "would", "are"], correctIndex: 1, explanation: "Past recurring activity → would play." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct form",
      instructions: "Complete the sentences using 'would' + the verb in brackets to describe a past habit.",
      questions: [
        { id: "e2q1", prompt: "Every evening, my mother (read) ___ to us before bed.", correct: "would read", explanation: "would + infinitive for past habit." },
        { id: "e2q2", prompt: "In winter, we (sit) ___ by the fire and play board games.", correct: "would sit", explanation: "would + infinitive for past habit." },
        { id: "e2q3", prompt: "He (walk) ___ to school every day, even in the rain.", correct: "would walk", explanation: "would + infinitive for past habit." },
        { id: "e2q4", prompt: "On Saturdays, they (visit) ___ the market together.", correct: "would visit", explanation: "would + infinitive for past habit." },
        { id: "e2q5", prompt: "She (write) ___ long letters to her pen pal in France.", correct: "would write", explanation: "would + infinitive for past habit." },
        { id: "e2q6", prompt: "As a student, I (spend) ___ hours in the library.", correct: "would spend", explanation: "would + infinitive for past habit." },
        { id: "e2q7", prompt: "My uncle (tell) ___ the same jokes every Christmas.", correct: "would tell", explanation: "would + infinitive for past habit." },
        { id: "e2q8", prompt: "The children (play) ___ outside until dark.", correct: "would play", explanation: "would + infinitive for past habit." },
        { id: "e2q9", prompt: "She (bring) ___ homemade cake to every meeting.", correct: "would bring", explanation: "would + infinitive for past habit." },
        { id: "e2q10", prompt: "He (get up) ___ at 5am and go for a run.", correct: "would get up", explanation: "would + infinitive for past habit." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Would or Used to?",
      instructions: "Choose 'would' or 'used to'. For past states (be, have, know, like, love…) only 'used to' is correct.",
      questions: [
        { id: "e3q1", prompt: "She ___ be very good at maths when she was at school. [state: be]", options: ["would", "used to"], correctIndex: 1, explanation: "'be' is a state verb → only used to." },
        { id: "e3q2", prompt: "Every morning, he ___ make coffee and read the newspaper. [action]", options: ["would", "used to"], correctIndex: 0, explanation: "Repeated action → both possible, 'would' preferred for vivid narration." },
        { id: "e3q3", prompt: "I ___ have a dog called Rex. [state: possession]", options: ["would", "used to"], correctIndex: 1, explanation: "'have' as possession = state → only used to." },
        { id: "e3q4", prompt: "We ___ meet every Friday and go bowling together. [action]", options: ["would", "used to"], correctIndex: 0, explanation: "Repeated action → would is natural here." },
        { id: "e3q5", prompt: "They ___ live next door. I miss them. [state: live]", options: ["would", "used to"], correctIndex: 1, explanation: "'live' as state → only used to." },
        { id: "e3q6", prompt: "My sister ___ play the violin every evening after dinner. [action]", options: ["would", "used to"], correctIndex: 0, explanation: "Repeated action in a story → would." },
        { id: "e3q7", prompt: "He ___ love jazz, but now he prefers classical music. [state: love]", options: ["would", "used to"], correctIndex: 1, explanation: "'love' = state verb → only used to." },
        { id: "e3q8", prompt: "In summer, we ___ cycle to the beach every weekend. [action]", options: ["would", "used to"], correctIndex: 0, explanation: "Repeated past action → would." },
        { id: "e3q9", prompt: "She ___ know everyone in the village by name. [state: know]", options: ["would", "used to"], correctIndex: 1, explanation: "'know' = state verb → only used to." },
        { id: "e3q10", prompt: "Dad ___ whistle while he was cooking. [action]", options: ["would", "used to"], correctIndex: 0, explanation: "Repeated action → would." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Would or Used to?",
      instructions: "Write 'would' or 'used to' + the verb. Use 'used to' for states; 'would' for repeated actions.",
      questions: [
        { id: "e4q1", prompt: "She (know) ___ all the answers in class — she was so smart. [state]", correct: "used to know", explanation: "State verb 'know' → used to know." },
        { id: "e4q2", prompt: "Every summer, we (go) ___ camping in the mountains. [action]", correct: "would go", explanation: "Repeated action → would go." },
        { id: "e4q3", prompt: "I (have) ___ a bicycle when I was ten. [possession state]", correct: "used to have", explanation: "Possession state → used to have." },
        { id: "e4q4", prompt: "On rainy days, the kids (build) ___ forts from blankets. [action]", correct: "would build", explanation: "Repeated action → would build." },
        { id: "e4q5", prompt: "She (believe) ___ in Santa Claus until she was seven. [state]", correct: "used to believe", explanation: "State verb 'believe' → used to believe." },
        { id: "e4q6", prompt: "We (play) ___ chess every Sunday afternoon. [action]", correct: "would play", explanation: "Repeated action → would play." },
        { id: "e4q7", prompt: "He (be) ___ quite shy as a teenager. [state]", correct: "used to be", explanation: "State verb 'be' → used to be." },
        { id: "e4q8", prompt: "My parents (argue) ___ sometimes, but always made up. [repeated action]", correct: "would argue", explanation: "Repeated action → would argue." },
        { id: "e4q9", prompt: "She (love) ___ ballet — she danced every day. [state]", correct: "used to love", explanation: "State verb 'love' → used to love." },
        { id: "e4q10", prompt: "He (bring) ___ fresh bread from the bakery every Sunday. [action]", correct: "would bring", explanation: "Repeated action → would bring." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b1">Grammar B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Would — Past Habits</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Would —{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Past Habits</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        We use <b>would + infinitive</b> to describe <b>repeated past actions</b> and routines: <i>Every evening, she <b>would</b> read to us.</i> Unlike <i>used to</i>, <b>would</b> cannot describe past states (be, have, know, love…).
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-would-past-habits" subject="Would for Past Habits" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b1" allLabel="All B1 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b1-would-past-habits" subject="Would for Past Habits" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/passive-present" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Passive Voice — Present →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Would — Past Habits (B1)</h2>
      <p>We use <b>would + infinitive</b> to describe <b>repeated past actions</b> and routines that we no longer do. It is common in storytelling and reminiscing.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Structure</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Positive", rows: ["Every day, she would read to us.", "He would walk to school."] },
            { label: "Negative (rare)", rows: ["He wouldn't eat vegetables.", "They wouldn't talk to each other."] },
            { label: "With time expressions", rows: ["Every morning / In summer / As a child", "When I was young / In those days"] },
            { label: "Example paragraph", rows: ["When I was a child, we would spend summers at the farm. Dad would wake early and Mum would make breakfast."] },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
              {rows.map((r) => <div key={r} className="text-sm text-slate-800 italic">{r}</div>)}
            </div>
          ))}
        </div>
      </div>

      <h3>Would vs Used to</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { use: "Both: repeated past actions", color: "border-emerald-200 bg-emerald-50 text-emerald-700", ex: "We would / used to meet every Friday." },
          { use: "Only 'used to': past states", color: "border-red-200 bg-red-50 text-red-700", ex: "She used to be shy. ✅\nShe would be shy. ❌" },
          { use: "State verbs → used to only", color: "border-amber-200 bg-amber-50 text-amber-700", ex: "be, have, know, like, love, believe, own…" },
          { use: "'Would' sounds more literary", color: "border-violet-200 bg-violet-50 text-violet-700", ex: "Used in stories, memoirs, vivid narration." },
        ].map(({ use, color, ex }) => (
          <div key={use} className={`rounded-xl border p-4 ${color}`}>
            <div className="text-sm font-black mb-1">{use}</div>
            <div className="text-sm text-slate-600 whitespace-pre-line italic">{ex}</div>
          </div>
        ))}
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Key rule:</span> If you can replace <b>would</b> with <b>used to</b> AND the verb is a <b>state verb</b> (be, have, know…), you <b>must</b> use <i>used to</i>: <i>She <b>used to</b> love music.</i> (not &quot;would love&quot;)
        </div>
      </div>
    </div>
  );
}
