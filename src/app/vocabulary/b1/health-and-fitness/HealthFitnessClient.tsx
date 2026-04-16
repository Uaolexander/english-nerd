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

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "To exercise means to do ___.", options: ["physical activity", "homework", "cooking", "sleeping"], answer: 0 },
  { q: "A balanced diet includes ___.", options: ["only fruit", "same food daily", "a variety of healthy foods", "no food"], answer: 2 },
  { q: "A symptom is a sign that you are ___.", options: ["healthy", "ill", "tired", "hungry"], answer: 1 },
  { q: "To recover means to get ___ after illness.", options: ["sick", "tired", "better", "worried"], answer: 2 },
  { q: "Stress is a feeling of ___ and pressure.", options: ["happiness", "worry", "excitement", "love"], answer: 1 },
  { q: "A GP gives ___ advice and treatment.", options: ["legal", "financial", "medical", "cooking"], answer: 2 },
  { q: "A prescription is a document saying what ___ to take.", options: ["food", "exercise", "medicine", "vitamins"], answer: 2 },
  { q: "Overweight means weighing ___ than is healthy.", options: ["less", "more", "exactly right", "about"], answer: 1 },
  { q: "Mental health refers to your ___ wellbeing.", options: ["physical", "financial", "emotional", "social"], answer: 2 },
  { q: "To warm up means to do ___ exercise before sport.", options: ["intense", "gentle", "competitive", "heavy"], answer: 1 },
  { q: "A high temperature is a common ___ of illness.", options: ["cure", "treatment", "symptom", "prescription"], answer: 2 },
  { q: "An appointment is a fixed ___ arranged to meet someone.", options: ["place", "time", "date", "room"], answer: 1 },
  { q: "Antibiotics are a type of ___.", options: ["food", "exercise", "medicine", "vitamin"], answer: 2 },
  { q: "Stressed means having too much ___ and worry.", options: ["fun", "food", "pressure", "sleep"], answer: 2 },
  { q: "Fitness is the ability to do ___ without getting tired.", options: ["maths", "physical activities", "cooking", "reading"], answer: 1 },
  { q: "To drink ___ glasses of water a day is healthy.", options: ["two", "four", "eight", "twelve"], answer: 2 },
  { q: "Recovering from flu means getting gradually ___.", options: ["worse", "older", "better", "tired"], answer: 2 },
  { q: "A cool down is done ___ exercise.", options: ["before", "during", "after", "instead of"], answer: 2 },
  { q: "Hydrated means having enough ___ in your body.", options: ["food", "sleep", "water", "vitamins"], answer: 2 },
  { q: "Exercise at least ___ times a week is recommended.", options: ["one", "two", "three", "seven"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Health & Fitness",
  subtitle: "B1 health vocabulary — symptoms, treatment, fitness",
  level: "B1",
  keyRule: "Health vocabulary: symptom · recover · prescription · balanced diet · mental health · warm up",
  exercises: [
    {
      number: 1, title: "Exercise 1 — Multiple Choice", difficulty: "Medium",
      instruction: "Choose the correct answer.",
      questions: [
        "To exercise = to do ___ activity. (mental / physical / social)",
        "A balanced diet includes ___. (only fruit / one food / a variety)",
        "A symptom is a sign of ___. (fitness / illness / exercise)",
        "To recover = to get ___ after illness. (worse / better / bigger)",
        "Stress = a feeling of ___. (happiness / worry / excitement)",
        "A GP = a ___ doctor. (family / hospital / sports)",
        "A prescription = a document for ___. (food / medicine / exercise)",
        "Overweight = weighing ___ than is healthy. (less / more / same)",
        "Mental health = emotional ___. (fitness / diet / wellbeing)",
        "To warm up = to do ___ exercise before sport. (gentle / intense / competitive)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Multiple Choice", answers: ["physical", "a variety of healthy foods", "illness", "better", "worry", "family", "medicine", "more", "wellbeing", "gentle"] },
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
  { id: 1, question: "What does 'to exercise' mean?", options: ["To sleep", "To do physical activity", "To eat a lot", "To stay in bed"], correct: 1, explanation: "To exercise means to do physical activity such as running, swimming or going to the gym to keep your body healthy." },
  { id: 2, question: "What is a 'balanced diet'?", options: ["Eating only fruit", "Eating the same thing every day", "Eating a variety of healthy foods", "Not eating at all"], correct: 2, explanation: "A balanced diet includes a variety of foods — vegetables, fruit, protein, carbohydrates and healthy fats — to give your body all the nutrients it needs." },
  { id: 3, question: "What is a 'symptom'?", options: ["A type of medicine", "A sign of illness", "A healthy food", "A type of exercise"], correct: 1, explanation: "A symptom is a sign that you are ill, such as a headache, fever or sore throat. Doctors look at symptoms to make a diagnosis." },
  { id: 4, question: "What does 'to recover' mean?", options: ["To get sick", "To exercise more", "To get better after illness", "To lose weight"], correct: 2, explanation: "To recover means to get better after being ill or injured. Recovery can take days, weeks or even months depending on the illness." },
  { id: 5, question: "What is 'stress' in a health context?", options: ["Happiness", "A feeling of worry and pressure", "Physical exercise", "A good diet"], correct: 1, explanation: "Stress is a feeling of worry or pressure that affects your mental and physical health. Chronic stress can lead to serious health problems." },
  { id: 6, question: "What does a 'GP' (General Practitioner) do?", options: ["Works in a gym", "Teaches fitness classes", "Gives medical advice and treatment", "Sells medicines"], correct: 2, explanation: "A GP (General Practitioner) is a family doctor who gives medical advice, diagnoses illnesses and refers patients to specialists when needed." },
  { id: 7, question: "What is a 'prescription'?", options: ["A bill from the doctor", "A document from a doctor saying what medicine to take", "A type of diet", "An exercise plan"], correct: 1, explanation: "A prescription is a written document from a doctor that tells the pharmacist which medicines to give you. You need a prescription for many medicines." },
  { id: 8, question: "What does 'to be overweight' mean?", options: ["To be too thin", "To weigh more than is healthy", "To exercise too much", "To eat healthy food"], correct: 1, explanation: "Being overweight means your body weight is higher than is considered healthy for your height. It can increase the risk of various health conditions." },
  { id: 9, question: "What is 'mental health'?", options: ["The health of your body", "How smart you are", "Your emotional and psychological wellbeing", "Physical fitness"], correct: 2, explanation: "Mental health refers to your emotional and psychological wellbeing — how you think, feel and cope with daily life. It is just as important as physical health." },
  { id: 10, question: "What does 'to warm up' mean in sport?", options: ["To drink hot drinks", "To do gentle exercise before sport", "To put on warm clothes", "To stop exercising"], correct: 1, explanation: "To warm up means to do gentle, light exercise before a main workout or sport activity. This prepares your muscles and reduces the risk of injury." },
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
  { id: 1, before: "I try to", after: "at least three times a week.", options: ["exercise", "sleep all day", "skip meals"], correct: "exercise", explanation: "Regular exercise keeps your body fit and healthy. Doctors recommend at least 150 minutes of moderate exercise per week." },
  { id: 2, before: "She has a", after: "— she eats vegetables, fruit, and protein every day.", options: ["balanced diet", "sweet tooth", "bad habit"], correct: "balanced diet", explanation: "A balanced diet includes a variety of nutrients from different food groups. A sweet tooth means you like sweet foods." },
  { id: 3, before: "I have a sore throat and a high", after: ". I think I'm ill.", options: ["temperature", "energy", "speed"], correct: "temperature", explanation: "A high temperature (or fever) is a common symptom of illness. Normal body temperature is around 37°C." },
  { id: 4, before: "You should", after: "before you start running to avoid injury.", options: ["warm up", "cool down", "give up"], correct: "warm up", explanation: "Warming up prepares your body for exercise by increasing blood flow and loosening your muscles." },
  { id: 5, before: "The doctor gave me a", after: "for some antibiotics.", options: ["prescription", "receipt", "ticket"], correct: "prescription", explanation: "A prescription is needed to get medicines like antibiotics from a pharmacy. A receipt is proof of payment." },
  { id: 6, before: "I've been feeling very", after: "lately. I need to take a break.", options: ["stressed", "excited", "lucky"], correct: "stressed", explanation: "Feeling stressed means you have too much pressure and worry. Taking a break or holiday can help reduce stress levels." },
  { id: 7, before: "It's important to", after: "at least eight glasses of water a day.", options: ["drink", "eat", "sleep"], correct: "drink", explanation: "Drinking enough water (about 8 glasses or 2 litres) keeps your body hydrated and supports many bodily functions." },
  { id: 8, before: "She's been", after: "from the flu for a week now.", options: ["recovering", "suffering", "hiding"], correct: "recovering", explanation: "Recovering from an illness means getting gradually better. It takes time for your body to fully recover from flu." },
  { id: 9, before: "Regular exercise can improve your", after: "and reduce the risk of disease.", options: ["fitness", "salary", "education"], correct: "fitness", explanation: "Physical fitness is the ability to do physical activities without getting tired. Regular exercise improves fitness over time." },
  { id: 10, before: "I need to make an", after: "with my doctor next week.", options: ["appointment", "agreement", "application"], correct: "appointment", explanation: "An appointment is a fixed time arranged to meet someone, such as a doctor. You book appointments in advance." },
];

// ── Exercise 3: Fill from the box ───────────────────────────────────────────

const WORD_BOX = ["symptom", "prescription", "recovery", "lifestyle", "appointment", "injury", "vaccination", "surgery", "diagnosis", "therapy"];

type FillQ = {
  id: number;
  before: string;
  after: string;
  correct: string;
  explanation: string;
};

const EX3: FillQ[] = [
  { id: 1, before: "A headache and tiredness are common", after: "s of flu.", correct: "symptom", explanation: "Symptoms are signs that you are ill. A headache and tiredness are typical symptoms of flu or a cold." },
  { id: 2, before: "The doctor gave me a", after: "for antibiotics.", correct: "prescription", explanation: "A prescription is a written order from a doctor for specific medicine. Antibiotics require a prescription." },
  { id: 3, before: "After the operation, his", after: "was very quick.", correct: "recovery", explanation: "Recovery is the process of getting better after illness or surgery. A quick recovery means getting well faster than expected." },
  { id: 4, before: "A healthy", after: "includes regular exercise and a good diet.", correct: "lifestyle", explanation: "A lifestyle is the way you live, including your habits, diet and exercise. A healthy lifestyle reduces the risk of many diseases." },
  { id: 5, before: "I have an", after: "with the doctor on Friday.", correct: "appointment", explanation: "An appointment is a fixed, agreed time to meet your doctor or other professional. You need to book one in advance." },
  { id: 6, before: "He got an", after: "during the football match and couldn't play.", correct: "injury", explanation: "An injury is damage to your body caused by an accident or sport. Common sports injuries include sprains and fractures." },
  { id: 7, before: "Children need a", after: "to protect them from certain diseases.", correct: "vaccination", explanation: "A vaccination is an injection that protects you from a specific disease by training your immune system to fight it." },
  { id: 8, before: "She needed", after: "to remove the tumour.", correct: "surgery", explanation: "Surgery is a medical procedure where a doctor operates on your body. It is used to treat serious conditions like tumours." },
  { id: 9, before: "The doctor's", after: "was that I had high blood pressure.", correct: "diagnosis", explanation: "A diagnosis is the doctor's conclusion about what illness or condition you have, based on your symptoms and tests." },
  { id: 10, before: "He goes to", after: "once a week to help with his anxiety.", correct: "therapy", explanation: "Therapy (or psychotherapy) is a treatment that involves talking to a trained professional to improve mental health and wellbeing." },
];

// ── Vocabulary sidebar ───────────────────────────────────────────────────────

const VOCAB = [
  { word: "symptom", pos: "n.", def: "a sign of illness" },
  { word: "prescription", pos: "n.", def: "written instruction from doctor for medicine" },
  { word: "recovery", pos: "n.", def: "the process of getting better after illness" },
  { word: "lifestyle", pos: "n.", def: "the way you live" },
  { word: "vaccination", pos: "n.", def: "an injection to prevent disease" },
];

const LABELS = ["A", "B", "C", "D"];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function HealthFitnessClient() {
  const isPro = useIsPro();
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [exNo, setExNo] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

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
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers({});
    setFillAnswers({});
    setChecked(false);
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "vocabulary", level: "b1", slug: "health-and-fitness", exerciseNo: exNo, score: percent, questionsTotal: total }),
    }).catch(() => {});
  }, [checked, percent]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["B1", "/vocabulary/b1"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">Health &amp; Fitness</span>
      </nav>

      {/* Hero */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-violet-400 px-3 py-0.5 text-[11px] font-black text-black">B1</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Vocabulary</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">3 exercises · 10 questions each</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
          <span className="relative inline-block">
            Health &amp; Fitness
            <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
          Learn health and fitness vocabulary with three different activities. Each exercise uses the same words — so the more you practise, the better you remember!
        </p>
      </div>

      {/* 3-col grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

        {/* Left column */}
        {isPro ? (
          <div className=""><SpeedRound gameId="vocab-health-fitness" subject="Health & Fitness Vocabulary" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
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
          {tab === "explanation" ? <HealthFitnessExplanation /> : (
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
                    {grade === "great" ? "Excellent! Great health and fitness vocabulary!" :
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
                                onClick={() => { if (!checked) setAnswers((p) => ({ ...p, [q.id]: String(oi) })); }}
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
                                onClick={() => { if (!checked) setAnswers((p) => ({ ...p, [q.id]: opt })); }}
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
                            className={`inline-block w-32 rounded-lg border px-3 py-0.5 text-center text-sm font-bold outline-none transition-all ${
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
            <a href="/vocabulary/b1" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All B1 Exercises
            </a>
          </div>
          </div>
          )}
          </div>
        </section>

        {/* Right column */}
        {isPro ? (
          <VocabRecommendations level="b1" />
        ) : (
          <AdUnit variant="sidebar-light" />
        )}

      </div>
    </div>
  );
}

function HealthFitnessExplanation() {
  const words = [
    ["exercise", "вправлятися — do physical activity"],
    ["balanced diet", "збалансоване харчування — variety of healthy foods"],
    ["symptom", "симптом — sign that you are ill"],
    ["recover", "одужувати — get better after illness"],
    ["stress", "стрес — feeling of worry and pressure"],
    ["GP", "лікар загальної практики — family doctor"],
    ["prescription", "рецепт — document for medicine"],
    ["overweight", "надмірна вага — weighing too much"],
    ["mental health", "психічне здоров'я — emotional wellbeing"],
    ["warm up", "розминка — gentle exercise before sport"],
    ["cool down", "заспокоєння — gentle exercise after sport"],
    ["appointment", "прийом — fixed time to meet doctor"],
    ["antibiotics", "антибіотики — medicine that kills bacteria"],
    ["temperature", "температура — body heat level"],
    ["fitness", "фізична форма — ability to do physical activities"],
    ["hydrated", "зволожений — having enough water"],
    ["recovery", "одужання — the process of getting better"],
    ["wellbeing", "благополуччя — overall health and happiness"],
    ["nutrition", "харчування — the food you eat"],
    ["injury", "травма — physical damage to the body"],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-900">Health & Fitness — Vocabulary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map(([en, ua]) => (
          <div key={en} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm flex gap-2">
            <span className="font-bold text-slate-900 min-w-[100px]">{en}</span>
            <span className="text-slate-500">{ua}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">B1 Tip</div>
        <p className="text-xs text-amber-700 leading-relaxed">Do all three exercises in order. Each one uses the <strong>same vocabulary</strong> — by Exercise 3, the words will feel much more familiar!</p>
      </div>
    </div>
  );
}
