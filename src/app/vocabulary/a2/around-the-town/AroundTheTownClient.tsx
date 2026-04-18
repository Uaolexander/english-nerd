"use client";

import { useState, useEffect } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import VocabRecommendations from "@/components/VocabRecommendations";
import { useLiveSync } from "@/lib/useLiveSync";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Where do you borrow books?", options: ["museum", "library", "bakery", "gym"], answer: 1 },
  { q: "Where do you buy medicine?", options: ["café", "school", "pharmacy", "hotel"], answer: 2 },
  { q: "Where do you exercise?", options: ["bank", "gym", "hospital", "church"], answer: 1 },
  { q: "Where do you stay when travelling?", options: ["restaurant", "library", "hotel", "market"], answer: 2 },
  { q: "Where do you see old paintings?", options: ["supermarket", "museum", "bakery", "post office"], answer: 1 },
  { q: "Where do you send a letter?", options: ["post office", "police station", "park", "cinema"], answer: 0 },
  { q: "Where do you watch a film?", options: ["theatre", "museum", "cinema", "library"], answer: 2 },
  { q: "Where do you get money?", options: ["baker", "bank", "butcher", "café"], answer: 1 },
  { q: "Straight ahead means:", options: ["turn left", "turn right", "go forward", "stop here"], answer: 2 },
  { q: "Near means:", options: ["far", "expensive", "close", "loud"], answer: 2 },
  { q: "A bus ___ is where buses stop.", options: ["stop", "meal", "window", "park"], answer: 0 },
  { q: "The pharmacy is ___ the bank and the post office.", options: ["beside", "inside", "between", "above"], answer: 2 },
  { q: "Next ___ means directly beside.", options: ["of", "to", "at", "on"], answer: 1 },
  { q: "Lost means you don't know ___.", options: ["where you are", "what time it is", "the price", "the name"], answer: 0 },
  { q: "A turning is a road that ___.", options: ["goes straight", "goes off to the side", "goes underground", "stops"], answer: 1 },
  { q: "Far away means a ___.", options: ["long distance", "short distance", "quick journey", "wrong turn"], answer: 0 },
  { q: "The right side is the opposite of ___.", options: ["straight", "left", "back", "above"], answer: 1 },
  { q: "A bank is for ___.", options: ["food", "books", "money", "medicine"], answer: 2 },
  { q: "A museum shows ___ objects.", options: ["food", "historical", "new", "cheap"], answer: 1 },
  { q: "A gym has equipment for ___.", options: ["sleeping", "reading", "exercise", "cooking"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Around the Town",
  subtitle: "A2 vocabulary — places in town + directions",
  level: "A2",
  keyRule: "Places: library · pharmacy · gym · museum · post office · cinema · bank",
  exercises: [
    {
      number: 1, title: "Exercise 1 — Multiple Choice", difficulty: "Easy",
      instruction: "Choose the correct answer.",
      questions: [
        "Where do you go to borrow books? (Museum / Library / Bakery / Gym)",
        "Where do you go to buy medicine? (Café / School / Pharmacy / Hotel)",
        "Where do you go to exercise? (Bank / Gym / Hospital / Church)",
        "Where do you stay when you travel? (Restaurant / Library / Hotel / Market)",
        "Where do you go to see old paintings? (Supermarket / Museum / Bakery / Post office)",
        "Where do you go to send a letter? (Post office / Police station / Park / Cinema)",
        "Where do you go to see a film? (Theatre / Museum / Cinema / Library)",
        "Where can you get money? (Baker / Bank / Butcher / Café)",
        "What word means 'to go in a direction'? (Wait / Turn / Stop / Sit)",
        "What does 'straight ahead' mean? (Turn left / Turn right / Go forward / Stop here)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Multiple Choice", answers: ["Library", "Pharmacy", "Gym", "Hotel", "Museum", "Post office", "Cinema", "Bank", "Turn", "Go forward without turning"] },
  ],
};

// ── Exercise 1: ABCD Multiple Choice ────────────────────────────────────────

type MCQ = {
  id: number;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
};

const EX1: MCQ[] = [
  { id: 1, question: "Where do you go to borrow books?", options: ["Museum", "Library", "Bakery", "Gym"], correct: 1, explanation: "A library is a place where you can borrow books for free. A museum has art and history, a bakery sells bread, and a gym is for exercise." },
  { id: 2, question: "Where do you go to buy medicine?", options: ["Café", "School", "Pharmacy", "Hotel"], correct: 2, explanation: "A pharmacy is a shop where you can buy medicine and health products. A café is for food and drinks, a school is for studying, and a hotel is for staying overnight." },
  { id: 3, question: "Where do you go to exercise?", options: ["Bank", "Gym", "Hospital", "Church"], correct: 1, explanation: "A gym is a place with equipment for exercise. A bank is for money, a hospital is for sick people, and a church is for religious services." },
  { id: 4, question: "Where do you stay when you travel to another city?", options: ["Restaurant", "Library", "Hotel", "Market"], correct: 2, explanation: "A hotel is a building with rooms where you can stay when you are travelling. A restaurant is for eating, a library is for books, and a market is for shopping." },
  { id: 5, question: "Where do you go to see old paintings and sculptures?", options: ["Supermarket", "Museum", "Bakery", "Post office"], correct: 1, explanation: "A museum is a building where you can see historical or artistic objects. A supermarket is for food shopping, a bakery sells bread, and a post office handles letters." },
  { id: 6, question: "Where do you go to send a letter?", options: ["Post office", "Police station", "Park", "Cinema"], correct: 0, explanation: "A post office is where you go to send letters and parcels. A police station is for crime reports, a park is outdoors, and a cinema shows films." },
  { id: 7, question: "Where do you go to see a film?", options: ["Theatre", "Museum", "Cinema", "Library"], correct: 2, explanation: "A cinema is a building where you watch films on a big screen. A theatre shows live plays, a museum has historical objects, and a library has books." },
  { id: 8, question: "Where can you get money?", options: ["Baker", "Bank", "Butcher", "Café"], correct: 1, explanation: "A bank is where you can get money, open accounts, and manage your finances. A baker sells bread, a butcher sells meat, and a café serves drinks." },
  { id: 9, question: "What word means 'to go in a direction'?", options: ["Wait", "Turn", "Stop", "Sit"], correct: 1, explanation: "To turn means to change direction when walking or driving. Wait, stop, and sit do not describe moving in a direction." },
  { id: 10, question: "What does 'straight ahead' mean?", options: ["Turn left", "Turn right", "Go forward without turning", "Stop here"], correct: 2, explanation: "Straight ahead means to continue going forward in the same direction without turning left or right." },
];

// ── Exercise 2: Choose the correct word ─────────────────────────────────────

type ChoiceQ = {
  id: number;
  before: string;
  after: string;
  options: string[];
  correct: string;
  explanation: string;
};

const EX2: ChoiceQ[] = [
  { id: 1, before: "Excuse me, is the library", after: "here?", options: ["near", "heavy", "delicious"], correct: "near", explanation: "Near means close in distance. When asking for directions, you ask if a place is near. Heavy and delicious don't describe location." },
  { id: 2, before: "Go", after: "and then turn left.", options: ["straight ahead", "slowly away", "very fast"], correct: "straight ahead", explanation: "Straight ahead means to go forward without turning. It is a common direction phrase. Slowly away and very fast are not direction phrases." },
  { id: 3, before: "The supermarket is on the", after: "side of the street.", options: ["right", "loud", "cheap"], correct: "right", explanation: "Right refers to the direction — the opposite of left. When giving directions, we say something is on the right or left side." },
  { id: 4, before: "I need to go to the", after: "to get some money.", options: ["bank", "beach", "forest"], correct: "bank", explanation: "A bank is where you go to get money or manage your finances. A beach and a forest are not places for financial services." },
  { id: 5, before: "The bus", after: "is opposite the park.", options: ["stop", "meal", "window"], correct: "stop", explanation: "A bus stop is a place where buses stop to let passengers on and off. Meal and window are not related to public transport." },
  { id: 6, before: "Take the first", after: "on the left.", options: ["turning", "building", "coffee"], correct: "turning", explanation: "A turning is a road or street that goes off in another direction. Take the first turning means turn at the first street on the left." },
  { id: 7, before: "The hotel is next", after: "the train station.", options: ["to", "at", "on"], correct: "to", explanation: "Next to means directly beside something. The hotel is next to the train station — they are side by side." },
  { id: 8, before: "How far is it? Is it", after: "?", options: ["far away", "heavy rain", "big noise"], correct: "far away", explanation: "Far away means a long distance. When asking about distance, you ask if something is far away. Heavy rain and big noise are not distance phrases." },
  { id: 9, before: "The pharmacy is", after: "the bank and the post office.", options: ["between", "inside", "above"], correct: "between", explanation: "Between means in the middle of two things. If the pharmacy is between the bank and the post office, it is in the middle of the two buildings." },
  { id: 10, before: "I'm", after: ". Can you help me find the station?", options: ["lost", "tired", "hungry"], correct: "lost", explanation: "Lost means you don't know where you are. When you are lost, you ask someone to help you find your way. Tired means you need rest and hungry means you need food." },
];

// ── Exercise 3: Fill from the box ───────────────────────────────────────────

const WORD_BOX = ["library", "pharmacy", "cinema", "museum", "hotel", "bus stop", "post office", "bakery", "gym", "bank"];

type FillQ = {
  id: number;
  before: string;
  after: string;
  correct: string;
  explanation: string;
};

const EX3: FillQ[] = [
  { id: 1, before: "I go to the", after: "to borrow books for free.", correct: "library", explanation: "A library is a public building where you can borrow books at no cost." },
  { id: 2, before: "I need to buy some aspirin from the", after: ".", correct: "pharmacy", explanation: "A pharmacy is a shop that sells medicine and health products. Aspirin is a common medicine." },
  { id: 3, before: "Let's go to the", after: "tonight — there's a great new film!", correct: "cinema", explanation: "A cinema is a place where you watch films on a large screen." },
  { id: 4, before: "We visited the art", after: "and saw some beautiful paintings.", correct: "museum", explanation: "A museum is a building where you can see art, historical objects, and cultural collections." },
  { id: 5, before: "We stayed in a nice", after: "near the city centre.", correct: "hotel", explanation: "A hotel is a building with rooms for travellers to sleep in, usually with services like breakfast and cleaning." },
  { id: 6, before: "I wait for the number 12 at the", after: "on the main road.", correct: "bus stop", explanation: "A bus stop is a marked place on a road where buses stop to let passengers get on and off." },
  { id: 7, before: "I need to send this letter. Where is the nearest", after: "?", correct: "post office", explanation: "A post office is a place where you can send letters and parcels, and buy stamps." },
  { id: 8, before: "I love fresh bread from the", after: "near my house.", correct: "bakery", explanation: "A bakery is a shop that makes and sells bread, cakes, and pastries." },
  { id: 9, before: "I go to the", after: "three times a week to keep fit.", correct: "gym", explanation: "A gym is a place with exercise equipment where people go to keep fit and healthy." },
  { id: 10, before: "I need to take out some cash from the", after: ".", correct: "bank", explanation: "A bank is a financial institution where you can keep money and take out cash." },
];

// ── Vocabulary sidebar ───────────────────────────────────────────────────────

const VOCAB = [
  { word: "pharmacy", pos: "n.", def: "a shop where you can buy medicine" },
  { word: "museum", pos: "n.", def: "a building where you can see historical or artistic objects" },
  { word: "bakery", pos: "n.", def: "a shop that makes and sells bread and cakes" },
  { word: "gym", pos: "n.", def: "a place with equipment for exercise" },
  { word: "opposite", pos: "prep.", def: "directly facing something or someone" },
];

const LABELS = ["A", "B", "C", "D"];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function AroundTheTownClient() {
  const isPro = useIsPro();
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [exNo, setExNo] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const { isLive, broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<number, string | null>);
    setFillAnswers((payload as unknown as { fillAnswers: Record<number, string> }).fillAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3);
  });

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  const questions = exNo === 1 ? EX1 : exNo === 2 ? EX2 : EX3;
  const total = questions.length;

  const answeredCount = exNo === 3
    ? EX3.filter((q) => (fillAnswers[q.id] ?? "").trim() !== "").length
    : EX1.filter((q) => answers[q.id] != null).length;

  const allAnswered = answeredCount === total;

  const correctCount = checked
    ? exNo === 1
      ? EX1.reduce((n, q) => n + (answers[q.id] === String(q.correct) ? 1 : 0), 0)
      : exNo === 2
      ? EX2.reduce((n, q) => n + (answers[q.id] === q.correct ? 1 : 0), 0)
      : EX3.reduce((n, q) => n + (normalize(fillAnswers[q.id] ?? "") === normalize(q.correct) ? 1 : 0), 0)
    : null;

  const percent = correctCount !== null ? Math.round((correctCount / total) * 100) : null;
  const grade = percent === null ? null : percent >= 80 ? "great" : percent >= 60 ? "ok" : "low";

  function switchEx(n: 1 | 2 | 3) {
    setExNo(n);
    setAnswers({});
    setFillAnswers({});
    setChecked(false);
    broadcast({ answers: {}, checked: false, exNo: n });
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    broadcast({ answers, checked: true, exNo });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers({});
    setFillAnswers({});
    setChecked(false);
    broadcast({ answers: {}, checked: false, exNo });
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "vocabulary", level: "a2", slug: "around-the-town", exerciseNo: exNo, score: percent, questionsTotal: total }),
    }).catch(() => {});
  }, [checked, percent]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["A2", "/vocabulary/a2"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">Around the Town</span>
      </nav>

      {/* Hero */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-emerald-400 px-3 py-0.5 text-[11px] font-black text-black">A2</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Vocabulary</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">3 exercises · 10 questions each</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
          <span className="relative inline-block">
            Around the Town
            <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
          Learn places in town and directions vocabulary with three different activities. Each exercise uses the same words — so the more you practise, the better you remember!
        </p>
      </div>

      {/* 3-col grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

        {/* Left column */}
        {isPro ? (
          <div className=""><SpeedRound gameId="vocab-around-the-town" subject="Around the Town Vocabulary" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
        ) : (
          <AdUnit variant="sidebar-dark" />
        )}

        {/* Main */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

          {/* Tab bar */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Vocabulary</button>
            <PDFButton onDownload={handlePDF} loading={pdfLoading} />
          </div>

          <div className="p-6 md:p-8">
          {tab === "explanation" ? <AroundTheTownExplanation /> : (
          <div className="space-y-5">

          {/* Exercise switcher */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            <div className="flex items-stretch border-b border-slate-100">
              {([
                { n: 1 as const, label: "Exercise 1", sub: "A B C D" },
                { n: 2 as const, label: "Exercise 2", sub: "Choose" },
                { n: 3 as const, label: "Exercise 3", sub: "Fill in" },
              ]).map(({ n, label, sub }) => (
                <button
                  key={n}
                  onClick={() => switchEx(n)}
                  className={`flex flex-1 flex-col items-center gap-0.5 px-4 py-3.5 text-sm transition border-r last:border-r-0 border-slate-100 ${
                    exNo === n
                      ? "bg-[#F5DA20]/15 font-black text-slate-900 border-b-2 border-b-[#F5DA20]"
                      : "font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${exNo === n ? "text-slate-600" : "text-slate-300"}`}>{sub}</span>
                </button>
              ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between bg-slate-50/80 px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-[15px] font-black text-slate-900">
                  {exNo === 1 && "Multiple Choice — Choose the correct answer (A, B, C or D)"}
                  {exNo === 2 && "Choose the Word — Select the best option for each gap"}
                  {exNo === 3 && "Fill in the Blanks — Use the words from the box"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {exNo === 1 && "Read each question and choose one answer from four options."}
                  {exNo === 2 && "Read each sentence and choose the word that fits best."}
                  {exNo === 3 && "Use each word from the box once. Read the sentences carefully."}
                </p>
              </div>
              {!checked ? (
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-[#F5DA20] transition-all duration-300" style={{ width: `${(answeredCount / total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 tabular-nums">{answeredCount}/{total}</span>
                </div>
              ) : (
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black border ${
                  grade === "great" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                  grade === "ok"   ? "border-amber-200 bg-amber-50 text-amber-700" :
                                     "border-red-200 bg-red-50 text-red-700"
                }`}>{correctCount}/{total}</span>
              )}
            </div>

            {/* Word box for Ex 3 */}
            {exNo === 3 && (
              <div className="border-b border-slate-100 bg-[#F5DA20]/6 px-6 py-4">
                <p className="mb-3 text-xs font-black text-slate-500 uppercase tracking-wide">Words to use:</p>
                <div className="flex flex-wrap gap-2">
                  {WORD_BOX.map((w) => {
                    const used = Object.values(fillAnswers).some((v) => normalize(v) === w);
                    return (
                      <span
                        key={w}
                        className={`rounded-xl border px-4 py-1.5 text-sm font-bold transition ${
                          used
                            ? "border-slate-200 bg-slate-100 text-slate-300 line-through"
                            : "border-[#F5DA20] bg-[#F5DA20]/15 text-slate-800"
                        }`}
                      >
                        {w}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Score panel */}
            {checked && percent !== null && (
              <div className={`flex items-center gap-5 px-6 py-5 border-b border-slate-100 ${
                grade === "great" ? "bg-emerald-50" :
                grade === "ok"   ? "bg-amber-50" :
                                   "bg-red-50"
              }`}>
                <div className={`text-5xl font-black tabular-nums leading-none ${
                  grade === "great" ? "text-emerald-600" :
                  grade === "ok"   ? "text-amber-600" : "text-red-600"
                }`}>{percent}<span className="text-2xl">%</span></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-700">{correctCount} out of {total} correct</div>
                  <div className="mt-2.5 h-2 w-full rounded-full bg-black/8 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${
                      grade === "great" ? "bg-emerald-500" :
                      grade === "ok"   ? "bg-amber-400" : "bg-red-500"
                    }`} style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {grade === "great" ? "Excellent! Great town and directions vocabulary!" :
                     grade === "ok"   ? "Good effort! Try once more to improve." :
                                        "Keep practising — review the explanations below."}
                  </p>
                </div>
                <div className="text-4xl">{grade === "great" ? "🎉" : grade === "ok" ? "💪" : "📖"}</div>
              </div>
            )}

            {/* Questions */}
            <div className="divide-y divide-slate-50">

              {/* ── Exercise 1: ABCD ── */}
              {exNo === 1 && EX1.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = checked && chosen === String(q.correct);
                const isWrong   = checked && chosen != null && chosen !== String(q.correct);

                return (
                  <div key={q.id} className={`px-6 py-6 transition-colors duration-200 ${isCorrect ? "bg-emerald-50/60" : isWrong ? "bg-red-50/60" : ""}`}>
                    <div className="flex gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect ? "bg-emerald-500 text-white" :
                        isWrong   ? "bg-red-500 text-white" :
                        chosen != null ? "bg-[#F5DA20] text-black" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold text-slate-900 leading-snug mb-4">{q.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oi) => {
                            const sel    = chosen === String(oi);
                            const ok     = checked && sel && oi === q.correct;
                            const bad    = checked && sel && oi !== q.correct;
                            const reveal = checked && !sel && oi === q.correct;
                            return (
                              <button
                                key={oi}
                                onClick={() => { if (!checked) setAnswers((p) => { const n = { ...p, [q.id]: String(oi) }; broadcast({ answers: n, checked: false, exNo }); return n; }); }}
                                disabled={checked}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all duration-150 ${
                                  ok     ? "bg-emerald-500 text-white shadow-sm" :
                                  bad    ? "bg-red-500 text-white shadow-sm" :
                                  reveal ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700" :
                                  sel    ? "bg-[#F5DA20] text-black shadow-sm" :
                                  checked ? "border border-slate-100 bg-slate-50 text-slate-300" :
                                  "border border-slate-200 bg-white text-slate-700 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 active:scale-[0.98]"
                                }`}
                              >
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                  ok     ? "bg-white/20 text-white" :
                                  bad    ? "bg-white/20 text-white" :
                                  reveal ? "bg-emerald-200 text-emerald-700" :
                                  sel    ? "bg-black/10 text-black" :
                                  checked ? "bg-slate-100 text-slate-300" :
                                  "bg-slate-100 text-slate-500"
                                }`}>{LABELS[oi]}</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">{isCorrect ? "✓ Correct! " : `✗ The answer is ${q.options[q.correct]}. `}</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── Exercise 2: Choose the word ── */}
              {exNo === 2 && EX2.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = checked && chosen === q.correct;
                const isWrong   = checked && chosen != null && chosen !== q.correct;

                return (
                  <div key={q.id} className={`px-6 py-6 transition-colors duration-200 ${isCorrect ? "bg-emerald-50/60" : isWrong ? "bg-red-50/60" : ""}`}>
                    <div className="flex gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect ? "bg-emerald-500 text-white" :
                        isWrong   ? "bg-red-500 text-white" :
                        chosen != null ? "bg-[#F5DA20] text-black" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] text-slate-800 leading-relaxed font-medium">
                          {q.before}{" "}
                          <span className={`inline-block min-w-[90px] rounded-lg px-3 py-0.5 text-center font-black transition-all ${
                            isCorrect ? "bg-emerald-100 text-emerald-700" :
                            isWrong   ? "bg-red-100 text-red-600 line-through" :
                            chosen    ? "bg-[#F5DA20]/30 text-slate-800" :
                            "border-2 border-dashed border-slate-200 text-slate-300"
                          }`}>{chosen ?? "???"}</span>
                          {" "}{q.after}
                        </p>
                        {isWrong && (
                          <p className="mt-1 text-sm font-semibold text-emerald-600">✓ Correct answer: <span className="font-black">{q.correct}</span></p>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {q.options.map((opt) => {
                            const sel    = chosen === opt;
                            const ok     = checked && sel && opt === q.correct;
                            const bad    = checked && sel && opt !== q.correct;
                            const reveal = checked && !sel && opt === q.correct;
                            return (
                              <button
                                key={opt}
                                onClick={() => { if (!checked) setAnswers((p) => { const n = { ...p, [q.id]: opt }; broadcast({ answers: n, checked: false, exNo }); return n; }); }}
                                disabled={checked}
                                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-150 ${
                                  ok     ? "bg-emerald-500 text-white shadow-sm" :
                                  bad    ? "bg-red-500 text-white shadow-sm" :
                                  reveal ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700" :
                                  sel    ? "bg-[#F5DA20] text-black shadow-sm" :
                                  checked ? "border border-slate-100 bg-slate-50 text-slate-300" :
                                  "border border-slate-200 bg-white text-slate-700 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 active:scale-95"
                                }`}
                              >{opt}</button>
                            );
                          })}
                        </div>
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">{isCorrect ? "✓ Correct! " : "Explanation: "}</span>{q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── Exercise 3: Fill in the blanks ── */}
              {exNo === 3 && EX3.map((q, idx) => {
                const val = fillAnswers[q.id] ?? "";
                const isCorrect = checked && normalize(val) === normalize(q.correct);
                const isWrong   = checked && val.trim() !== "" && !isCorrect;
                const noAnswer  = checked && val.trim() === "";

                return (
                  <div key={q.id} className={`px-6 py-6 transition-colors duration-200 ${isCorrect ? "bg-emerald-50/60" : (isWrong || noAnswer) ? "bg-red-50/60" : ""}`}>
                    <div className="flex gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect   ? "bg-emerald-500 text-white" :
                        isWrong || noAnswer ? "bg-red-500 text-white" :
                        val.trim()  ? "bg-[#F5DA20] text-black" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] text-slate-800 leading-relaxed font-medium">
                          {q.before}{" "}
                          <input
                            type="text"
                            value={val}
                            disabled={checked}
                            onChange={(e) => setFillAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                            placeholder="________"
                            className={`inline-block w-36 rounded-lg border px-3 py-0.5 text-center text-sm font-bold outline-none transition-all ${
                              isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
                              isWrong   ? "border-red-300 bg-red-50 text-red-600 line-through" :
                              noAnswer  ? "border-red-200 bg-red-50" :
                              val.trim() ? "border-[#F5DA20] bg-[#F5DA20]/15 text-slate-900 focus:ring-2 focus:ring-[#F5DA20]/30" :
                              "border-slate-200 bg-white text-slate-900 focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
                            }`}
                          />{" "}
                          {q.after}
                        </p>
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">
                              {isCorrect ? "✓ Correct! " : `✗ The answer is "${q.correct}". `}
                            </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              {!checked ? (
                <>
                  <button
                    onClick={check}
                    disabled={!allAnswered}
                    className="rounded-xl bg-[#F5DA20] px-6 py-2.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm disabled:opacity-35 disabled:cursor-not-allowed"
                  >
                    Check Answers
                  </button>
                  {exNo === 3 && (
                    <button
                      onClick={() => {
                        const all: Record<number, string> = {};
                        EX3.forEach((q) => { all[q.id] = q.correct; });
                        setFillAnswers(all);
                        setChecked(true);
                        broadcast({ answers, checked: true, exNo });
                      }}
                      className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition underline underline-offset-2"
                    >
                      Show Answers
                    </button>
                  )}
                  {!allAnswered && exNo !== 3 && (
                    <span className="text-xs text-slate-400">{total - answeredCount} question{total - answeredCount !== 1 ? "s" : ""} remaining</span>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={reset} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                    Try Again
                  </button>
                  {exNo < 3 && (
                    <button onClick={() => switchEx((exNo + 1) as 2 | 3)} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition">
                      Next Exercise →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <a href="/vocabulary/a2" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All A2 Exercises
            </a>
          </div>
          </div>
          )}
          </div>
        </section>

        {/* Right column */}
        {isPro ? (
          <VocabRecommendations level="a2" />
        ) : (
          <AdUnit variant="sidebar-light" />
        )}

      </div>
    </div>
  );
}

function AroundTheTownExplanation() {
  const words = [
    ["library", "бібліотека — borrow books for free"],
    ["pharmacy", "аптека — buy medicine"],
    ["gym", "спортзал — exercise equipment"],
    ["museum", "музей — historical/art objects"],
    ["hotel", "готель — stay overnight when travelling"],
    ["post office", "пошта — send letters and parcels"],
    ["cinema", "кінотеатр — watch films"],
    ["bank", "банк — manage money"],
    ["near", "близько — not far away"],
    ["straight ahead", "прямо — go forward without turning"],
    ["turn left/right", "повернути ліворуч/праворуч"],
    ["bus stop", "автобусна зупинка — where buses stop"],
    ["turning", "поворот — road that goes off to the side"],
    ["next to", "поруч із — directly beside"],
    ["between", "між — in the middle of two things"],
    ["far away", "далеко — a long distance"],
    ["lost", "заблукати — don't know where you are"],
    ["police station", "поліцейська дільниця"],
    ["park", "парк — outdoor green area"],
    ["market", "ринок — outdoor shopping area"],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-900">Around the Town — Vocabulary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map(([en, ua]) => (
          <div key={en} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm flex gap-2">
            <span className="font-bold text-slate-900 min-w-[100px]">{en}</span>
            <span className="text-slate-500">{ua}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">A2 Tip</div>
        <p className="text-xs text-amber-700 leading-relaxed">Do all three exercises in order. Each one uses the <strong>same vocabulary</strong> — by Exercise 3, the words will feel much more familiar!</p>
      </div>
    </div>
  );
}
