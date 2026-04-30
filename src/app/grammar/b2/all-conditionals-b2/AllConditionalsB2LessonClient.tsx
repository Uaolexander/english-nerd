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
import { useLiveSync } from "@/lib/useLiveSync";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Zero conditional uses which tense?", options: ["Past simple", "Present simple", "Future simple", "Past perfect"], answer: 1 },
  { q: "First conditional: real or imaginary?", options: ["Imaginary past", "Real future", "Hypothetical present", "General truth"], answer: 1 },
  { q: "Second conditional if-clause verb form?", options: ["Past perfect", "Present simple", "Past simple / were", "will + verb"], answer: 2 },
  { q: "Third conditional result clause?", options: ["would + verb", "would have + pp", "had + pp", "will have + pp"], answer: 1 },
  { q: "Mixed A: past condition → present result uses?", options: ["would have + pp", "would + verb", "had + pp", "will + verb"], answer: 1 },
  { q: "Mixed B: present condition → past result uses?", options: ["would + verb", "would have + pp", "will have + pp", "had + pp"], answer: 1 },
  { q: "'If I were rich' is which conditional?", options: ["Zero", "First", "Second", "Third"], answer: 2 },
  { q: "'If it rains, I will stay in' is?", options: ["Zero", "First", "Second", "Mixed"], answer: 1 },
  { q: "Which conditional uses Past Perfect in if-clause?", options: ["Zero", "First", "Second", "Third"], answer: 3 },
  { q: "Zero conditional describes?", options: ["Imaginary future", "General truths/facts", "Past regrets", "Present wishes"], answer: 1 },
  { q: "'If she hadn't left, she would be here now' is?", options: ["Second", "Third", "Mixed A", "Mixed B"], answer: 2 },
  { q: "'If he were calmer, he'd have passed' is?", options: ["Third", "Mixed A", "Mixed B", "Second"], answer: 2 },
  { q: "First conditional if-clause uses?", options: ["Past simple", "Present simple", "Past perfect", "would + verb"], answer: 1 },
  { q: "'If you heat ice, it melts' = which type?", options: ["First", "Zero", "Second", "Mixed"], answer: 1 },
  { q: "Which is correct 2nd conditional?", options: ["If I will win", "If I won", "If I had won", "If I win"], answer: 1 },
  { q: "Which is correct 3rd conditional result?", options: ["would win", "would have won", "had won", "will have won"], answer: 1 },
  { q: "Second conditional refers to?", options: ["Real future event", "Hypothetical present/future", "Past fact", "General truth"], answer: 1 },
  { q: "'Were' in 2nd conditional replaces?", options: ["was/were", "only was", "only were", "had been"], answer: 0 },
  { q: "Mixed A has past condition + which result?", options: ["Past result", "Present result", "Future result", "No result"], answer: 1 },
  { q: "Which modal is NOT used in conditional results?", options: ["would", "could", "might", "will (3rd)"], answer: 3 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "All Conditionals (0–3 + Mixed)",
  subtitle: "Zero, first, second, third and mixed conditionals",
  level: "B2",
  keyRule: "Match if-clause tense to result clause tense based on time and reality.",
  exercises: [
    {
      number: 1,
      title: "Choose the conditional type",
      difficulty: "easy" as const,
      instruction: "Pick the correct conditional form.",
      questions: [
        "If you heat water, it ___. (zero)",
        "If it rains, we ___ inside. (1st)",
        "If I ___ rich, I'd travel. (2nd)",
        "If they'd left, they ___ it. (3rd)",
        "Metals ___ when heated.",
        "If I ___ time, I'd learn. (2nd)",
        "If she weren't busy, she ___.",
        "If you ___ now, you'll miss it.",
        "If I had saved more, I ___ now.",
        "Plants die if they ___ water.",
      ],
    },
    {
      number: 2,
      title: "Write the verb form",
      difficulty: "medium" as const,
      instruction: "Complete with the correct form.",
      questions: [
        "If you (mix) ___ red+blue = purple.",
        "If she (study) ___, she'd pass.",
        "If he (call) ___, I'll tell you.",
        "She (not/be) ___ stressed now.",
        "If hired more staff, (not/miss) ___.",
        "If he (be) ___ confident, he'd spoke.",
        "If apple in air, it (turn) ___ brown.",
        "If I (win) ___ lottery, I'd buy house.",
        "If they (warn) ___ us, we'd be ready.",
        "She (speak) ___ French if she'd taken.",
      ],
    },
    {
      number: 3,
      title: "All types in context",
      difficulty: "hard" as const,
      instruction: "Choose the best option for the context.",
      questions: [
        "You ___ sunburnt without sunscreen.",
        "If I spoke Mandarin, I ___ that deal.",
        "If alarm hadn't gone, I ___ the meeting.",
        "Plants die if they ___ enough water.",
        "If she'd taken medicine, she ___ better.",
        "I ___ you if I were in that situation.",
        "If bridge ___ in 1990, lives were saved.",
        "If you press this button, machine ___.",
        "She ___ lonely if she'd kept in touch.",
        "If government doesn't act, situation ___.",
      ],
    },
    {
      number: 4,
      title: "Full mixed practice",
      difficulty: "hard" as const,
      instruction: "Write correct forms of BOTH verbs.",
      questions: [
        "If water (reach) 100°C, it (boil) ___.",
        "If not organised, she (not/forget) ___.",
        "If I (know) ___, I (tell) ___ you.",
        "If invested 10 yrs ago, (be) ___ now.",
        "If (not/break) leg, (play) ___ final.",
        "If (add) too much salt, it (taste) ___.",
        "If more savings, I (not/worry) ___ now.",
        "If (be) confident, (apply) ___ last yr.",
        "If (not/snow), roads (not/close) ___.",
        "If he (speak) slowly, I (understand).",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Conditional forms", answers: ["boils", "will stay", "were", "would have met", "expand", "had", "wouldn't have made", "turn off", "would be", "don't get"] },
    { exercise: 2, subtitle: "Verb forms", answers: ["mix", "studied", "calls", "wouldn't be", "wouldn't have missed", "were", "turns", "won", "had warned", "would speak"] },
    { exercise: 3, subtitle: "Contextual choice", answers: ["will get", "would have got", "would be missing", "don't get", "would feel", "would forgive", "had been built", "starts", "wouldn't be", "will worsen"] },
    { exercise: 4, subtitle: "Both verb forms", answers: ["reaches / boils", "weren't / wouldn't have forgotten", "knew / would tell", "had invested / would be", "hadn't broken / would have played", "add / tastes", "had had / wouldn't be worrying", "were / would have applied", "hadn't snowed / wouldn't have closed", "spoke / would understand"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] }
  | { type: "story"; title: string; instructions: string; passage: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase().replace(/[.,!?;:]+/g, "").replace(/\s+/g, " "); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Third Conditional", href: "/grammar/b2/third-conditional", level: "B2", badge: "bg-orange-500", reason: "Deep dive into one of the B2 conditionals" },
  { title: "Mixed Conditionals", href: "/grammar/b2/mixed-conditionals", level: "B2", badge: "bg-orange-500", reason: "Combine past and present conditional time frames" },
  { title: "Wish / Would", href: "/grammar/b2/wish-would", level: "B2", badge: "bg-orange-500" },
];

export default function AllConditionalsB2LessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const { isLive, broadcast } = useLiveSync((payload) => {
    setMcqAnswers(payload.answers as Record<string, number | null>);
    setInputAnswers((payload as unknown as { inputAnswers: Record<string, string> }).inputAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4 | 5);
  });
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4 | 5, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 — Identify the conditional type",
      instructions: "Choose the correct form. The conditional type is given in brackets as a clue.",
      questions: [
        { id: "e1q1", prompt: "If you heat water to 100°C, it ___. (zero)", options: ["boils", "would boil", "boiled"], correctIndex: 0, explanation: "Zero conditional = general truth. Present simple in both clauses." },
        { id: "e1q2", prompt: "If it rains tomorrow, we ___ the picnic. (first)", options: ["cancel", "would cancel", "will cancel"], correctIndex: 2, explanation: "First conditional = real future possibility. If + present, will + infinitive." },
        { id: "e1q3", prompt: "If I ___ a millionaire, I would donate half my wealth. (second)", options: ["am", "was", "were"], correctIndex: 2, explanation: "Second conditional if-clause = were (hypothetical present)." },
        { id: "e1q4", prompt: "If they had left on time, they ___ the deadline. (third)", options: ["would meet", "would have met", "had met"], correctIndex: 1, explanation: "Third conditional result = would + have + pp." },
        { id: "e1q5", prompt: "If she hadn't moved abroad, she ___ here now. (mixed A)", options: ["would be", "would have been", "was"], correctIndex: 0, explanation: "Mixed Type A: past condition → present result. would + infinitive." },
        { id: "e1q6", prompt: "Metals ___ when heated. (zero)", options: ["expand", "will expand", "would expand"], correctIndex: 0, explanation: "Zero conditional = scientific fact. Present simple." },
        { id: "e1q7", prompt: "If I ___ more time, I'd learn a new language. (second)", options: ["had", "have", "would have"], correctIndex: 0, explanation: "Second conditional if-clause = past simple (had)." },
        { id: "e1q8", prompt: "If she weren't so impatient, she ___ that mistake last week. (mixed B)", options: ["wouldn't make", "wouldn't have made", "hadn't made"], correctIndex: 1, explanation: "Mixed Type B: present condition → past result. wouldn't have + pp." },
        { id: "e1q9", prompt: "If you ___ your phone now, you'll miss the message. (first)", options: ["turn off", "turned off", "will turn off"], correctIndex: 0, explanation: "First conditional if-clause = present simple (turn off)." },
        { id: "e1q10", prompt: "If I had invested in that company, I ___ very rich now. (mixed A)", options: ["would be", "would have been", "was"], correctIndex: 0, explanation: "Mixed Type A: past decision → present state. would + infinitive." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 — Write the correct verb form",
      instructions: "Write the correct form of the verb in brackets. The conditional type is not given — you must decide.",
      questions: [
        { id: "e2q1", prompt: "If you (mix) ___ red and blue, you get purple.", correct: "mix", explanation: "Zero conditional — present simple: If you mix…" },
        { id: "e2q2", prompt: "If she (study) ___ harder, she would pass the exam. (she doesn't study hard)", correct: "studied", explanation: "Second conditional if-clause: past simple (studied)." },
        { id: "e2q3", prompt: "If he (call) ___, I'll let you know.", correct: "calls", explanation: "First conditional if-clause: present simple (calls)." },
        { id: "e2q4", prompt: "She (not/be) ___ so stressed now if she had planned better.", correct: "wouldn't be", explanation: "Mixed Type A result: wouldn't be = wouldn't + infinitive." },
        { id: "e2q5", prompt: "If they had hired more staff, they (not/miss) ___ the deadline.", correct: "wouldn't have missed", explanation: "Third conditional result: wouldn't have + pp." },
        { id: "e2q6", prompt: "If he (be) ___ more confident, he would have spoken up at the meeting.", correct: "were", explanation: "Mixed Type B if-clause: present condition — were (hypothetical)." },
        { id: "e2q7", prompt: "If you leave a cut apple in the air, it (turn) ___ brown.", correct: "turns", explanation: "Zero conditional: general scientific fact — present simple." },
        { id: "e2q8", prompt: "If I (win) ___ the lottery, I'd buy a house in the countryside.", correct: "won", explanation: "Second conditional if-clause: past simple (won)." },
        { id: "e2q9", prompt: "If they (warn) ___ us earlier, we would have been prepared.", correct: "had warned", explanation: "Third conditional if-clause: Past Perfect (had warned)." },
        { id: "e2q10", prompt: "She (speak) ___ better French now if she had taken those classes.", correct: "would speak", explanation: "Mixed Type A result: would + infinitive." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 — All types in context",
      instructions: "Read the whole sentence and choose the correct form. No clues given — think about the time and reality of the condition.",
      questions: [
        { id: "e3q1", prompt: "You ___ sunburnt if you don't put on sunscreen.", options: ["get", "will get", "got"], correctIndex: 1, explanation: "will get = First Conditional (likely real consequence in the near future)." },
        { id: "e3q2", prompt: "If I spoke better Mandarin, I ___ that deal last year.", options: ["would have got", "would get", "got"], correctIndex: 0, explanation: "would have got = Mixed Type B: present language skill → past business outcome." },
        { id: "e3q3", prompt: "If the alarm hadn't gone off, I ___ the meeting right now.", options: ["miss", "would miss", "would be missing"], correctIndex: 2, explanation: "would be missing = Mixed Type A: past alarm helped → present meeting not missed." },
        { id: "e3q4", prompt: "Plants die if they ___ enough water.", options: ["don't get", "didn't get", "wouldn't get"], correctIndex: 0, explanation: "don't get = Zero Conditional (biological fact)." },
        { id: "e3q5", prompt: "If she had taken the medicine, she ___ better by now.", options: ["would feel", "would have felt", "feels"], correctIndex: 0, explanation: "would feel = Mixed Type A: past action → present state." },
        { id: "e3q6", prompt: "I ___ you if I were in that situation.", options: ["will forgive", "forgave", "would forgive"], correctIndex: 2, explanation: "would forgive = Second Conditional (hypothetical advice)." },
        { id: "e3q7", prompt: "If the bridge ___ in 1990, hundreds of lives would have been saved.", options: ["was built", "had been built", "were built"], correctIndex: 1, explanation: "had been built = Third Conditional if-clause (passive, Past Perfect)." },
        { id: "e3q8", prompt: "If you press this button, the machine ___.", options: ["starts", "would start", "started"], correctIndex: 0, explanation: "starts = Zero Conditional (mechanical fact)." },
        { id: "e3q9", prompt: "She ___ so lonely now if she had kept in touch with her old friends.", options: ["wouldn't be", "wouldn't have been", "isn't"], correctIndex: 0, explanation: "wouldn't be = Mixed Type A: past behaviour → present emotional state." },
        { id: "e3q10", prompt: "If the government doesn't act, the situation ___.", options: ["worsened", "would worsen", "will worsen"], correctIndex: 2, explanation: "will worsen = First Conditional (real, current threat with likely future result)." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 — Full mixed practice: write the complete verb form",
      instructions: "Write the correct form of BOTH verbs in brackets. The conditionals are mixed — no clues.",
      questions: [
        { id: "e4q1", prompt: "If water (reach) ___ 100°C, it (boil) ___.", correct: "reaches / boils", explanation: "Zero conditional: present simple in both clauses." },
        { id: "e4q2", prompt: "If she (not/be) ___ so disorganised, she (not/forget) ___ the appointment last week.", correct: "weren't / wouldn't have forgotten", explanation: "Mixed Type B: present trait → past result." },
        { id: "e4q3", prompt: "If I (know) ___ the answer, I (tell) ___ you.", correct: "knew / would tell", explanation: "Second conditional: past simple → would + infinitive." },
        { id: "e4q4", prompt: "If they (invest) ___ in renewable energy ten years ago, they (be) ___ much more competitive now.", correct: "had invested / would be", explanation: "Mixed Type A: past decision → present competitive position." },
        { id: "e4q5", prompt: "If he (not/break) ___ his leg, he (play) ___ in the final last Saturday.", correct: "hadn't broken / would have played", explanation: "Third conditional: Past Perfect → would have + pp." },
        { id: "e4q6", prompt: "If you (add) ___ too much salt to the dish, it (taste) ___ terrible.", correct: "add / tastes", explanation: "Zero conditional: factual cooking principle." },
        { id: "e4q7", prompt: "If I (have) ___ more savings, I (not/worry) ___ about the renovation costs right now.", correct: "had had / wouldn't be worrying", explanation: "Mixed Type A: past saving behaviour → present financial anxiety." },
        { id: "e4q8", prompt: "If she (be) ___ more confident, she (apply) ___ for the promotion last year.", correct: "were / would have applied", explanation: "Mixed Type B: present character trait → past missed opportunity." },
        { id: "e4q9", prompt: "If it (not/snow) ___ so heavily, the roads (not/close) ___.", correct: "hadn't snowed / wouldn't have closed", explanation: "Third conditional: Past Perfect → would have + pp." },
        { id: "e4q10", prompt: "If he (speak) ___ more slowly, I (understand) ___ him better.", correct: "spoke / would understand", explanation: "Second conditional: hypothetical present — spoke → would understand." },
      ],
    },
    5: {
      type: "story" as const,
      title: "Exercise 5 (Story) — Open the brackets",
      instructions: "Read the story. Open the brackets using the correct conditional: first, second, third, or mixed.",
      passage: "Daniel is a project manager preparing for a critical business trip to Berlin. The company's biggest contract depends on the outcome.\n\nHe has already confirmed the meeting. If the client (1)(sign) the contract next week, the company will secure funding for the whole year. That is the realistic goal.\n\nDaniel is also thinking about risks. If the airline (2)(cancel) the flight, he would have to take the train overnight — exhausting, but manageable. This is unlikely but possible.\n\nHe thinks about a colleague who was in a similar situation last year. If Anna (3)(prepare) her presentation more carefully, the client would have accepted it. Unfortunately, she rushed and lost the deal.\n\nThere is still regret in the office about that lost opportunity. If the company (4)(win) that contract last year, it would have a much stronger market position today.\n\nDaniel is determined not to repeat the same mistake. If he (5)(be) better at prioritising, he would have started his own preparation two weeks ago. He is only starting now.\n\nHe calls his assistant for help. \"If you (6)(send) the final slides to me by tomorrow morning, I will review them before the flight.\" She promises to do so.\n\nDaniel also adds: \"If everything (7)(go) well in Berlin, I think we should celebrate as a team.\" It is an exciting prospect.\n\nFinally, he reminds himself: \"If I (8)(not / stay) focused over the next few days, I could lose this deal.\" He closes his laptop and gets to work.",
      questions: [
        { id: "e5q1", prompt: "(1) If the client _____ (sign) the contract", correct: "signs", explanation: "First conditional if-clause → present simple: signs (real future possibility)." },
        { id: "e5q2", prompt: "(2) If the airline _____ (cancel) the flight", correct: "cancelled", explanation: "Second conditional if-clause → past simple: cancelled (unlikely/hypothetical)." },
        { id: "e5q3", prompt: "(3) If Anna _____ (prepare) her presentation more carefully", correct: "had prepared", explanation: "Third conditional if-clause → past perfect: had prepared (past unreal)." },
        { id: "e5q4", prompt: "(4) If the company _____ (win) that contract last year", correct: "had won", explanation: "Mixed conditional if-clause → past perfect: had won (past condition → present result)." },
        { id: "e5q5", prompt: "(5) If he _____ (be) better at prioritising", correct: "were", explanation: "Mixed conditional: present condition → past result; if + past simple (were)." },
        { id: "e5q6", prompt: "(6) If you _____ (send) the slides by tomorrow morning", correct: "send", explanation: "First conditional if-clause → present simple: send (real near-future plan)." },
        { id: "e5q7", prompt: "(7) If everything _____ (go) well in Berlin", correct: "goes", explanation: "First conditional if-clause → present simple: goes." },
        { id: "e5q8", prompt: "(8) If I _____ (not / stay) focused", correct: "don't stay", explanation: "First conditional if-clause → present simple negative: don't stay." },
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

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo }); }
  function switchExercise(n: 1 | 2 | 3 | 4 | 5) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo: n }); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">All Conditionals (0–3 + Mixed)</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          All Conditionals{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">(0–3 + Mixed)</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Full practice of all conditional types: <b>zero, first, second, third</b> and <b>mixed</b> — all in one place. No clues given in the harder exercises. Think about whether the situation is real, hypothetical present, hypothetical past, or mixed time.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-all-conditionals-b2" subject="All Conditionals" questions={SPEED_QUESTIONS} variant="sidebar" />
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
              {([1, 2, 3, 4, 5] as const).map((n) => (
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
                    {([1, 2, 3, 4, 5] as const).map((n) => (
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
                  ) : current.type === "input" ? (
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
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
                        <p className="text-sm font-bold uppercase tracking-wider text-violet-600 mb-3">Read the story</p>
                        {current.passage.split('\n').filter(Boolean).map((para, i) => (
                          <p key={i} className="text-slate-700 leading-relaxed mb-2 last:mb-0">{para}</p>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-700">Open the brackets — write the correct form:</p>
                        {current.questions.map((q, idx) => {
                          const val = inputAnswers[q.id] ?? "";
                          const answered = normalize(val) !== "";
                          const isCorrect = checked && answered && normalize(val) === normalize(q.correct);
                          const wrong = checked && answered && !isCorrect;
                          const noAnswer = checked && !answered;
                          return (
                            <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                              <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">({idx + 1})</div>
                                <div className="flex-1">
                                  <div className="font-bold text-slate-900">{q.prompt}</div>
                                  <div className="mt-3">
                                    <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type the correct form…" className="w-full max-w-sm rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
                                  </div>
                                  {checked && (
                                    <div className="mt-3 text-sm">
                                      {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                      {wrong && <div className="text-red-700 font-semibold">❌ Wrong — correct: <b>{q.correct}</b></div>}
                                      {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer — correct: <b>{q.correct}</b></div>}
                                      <div className="mt-1 text-slate-600">{q.explanation}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button onClick={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                    ) : (
                      <button onClick={resetExercise} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                    )}
                    {checked && exNo < 5 && (
                      <button onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4 | 5)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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
          <SpeedRound gameId="grammar-b2-all-conditionals-b2" subject="All Conditionals" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/wish-would" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Wish + Would / Past Perfect →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>All Conditionals — Quick Reference (B2)</h2>

      <div className="not-prose mt-4 space-y-3">
        {[
          {
            type: "Zero",
            badge: "bg-slate-100 text-slate-700",
            ifClause: "If + Present Simple",
            result: "Present Simple",
            use: "General truths, scientific facts, habits",
            ex: "If you heat ice, it melts.",
          },
          {
            type: "First",
            badge: "bg-green-100 text-green-700",
            ifClause: "If + Present Simple",
            result: "will + infinitive",
            use: "Real, likely future situations",
            ex: "If it rains, I'll stay in.",
          },
          {
            type: "Second",
            badge: "bg-blue-100 text-blue-700",
            ifClause: "If + Past Simple (were)",
            result: "would + infinitive",
            use: "Hypothetical present/future — unlikely or imaginary",
            ex: "If I were rich, I would travel everywhere.",
          },
          {
            type: "Third",
            badge: "bg-violet-100 text-violet-700",
            ifClause: "If + Past Perfect",
            result: "would/could/might have + pp",
            use: "Hypothetical past — things that didn't happen",
            ex: "If I had studied, I would have passed.",
          },
          {
            type: "Mixed A",
            badge: "bg-orange-100 text-orange-700",
            ifClause: "If + Past Perfect",
            result: "would + infinitive",
            use: "Past condition → present result",
            ex: "If she had studied, she would be a doctor now.",
          },
          {
            type: "Mixed B",
            badge: "bg-rose-100 text-rose-700",
            ifClause: "If + Past Simple (were)",
            result: "would have + pp",
            use: "Present condition → past result",
            ex: "If he weren't so lazy, he would have finished it yesterday.",
          },
        ].map(({ type, badge, ifClause, result, use, ex }) => (
          <div key={type} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`rounded-full px-3 py-0.5 text-xs font-black ${badge}`}>{type}</span>
              <span className="text-xs text-slate-500">{use}</span>
            </div>
            <div className="grid gap-1 text-sm md:grid-cols-2">
              <div className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-slate-700">{ifClause}</div>
              <div className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-slate-700">{result}</div>
            </div>
            <div className="mt-2 italic text-slate-600 text-sm">{ex}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
