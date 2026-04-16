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
  { q: "What is 'climate change'?", options: ["Changes in fashion", "Long-term shifts in global temperatures", "Daily weather", "Ocean pollution"], answer: 1 },
  { q: "What are 'fossil fuels'?", options: ["Solar and wind energy", "Nuclear power", "Oil, coal and gas", "Hydrogen fuel"], answer: 2 },
  { q: "What does 'renewable energy' mean?", options: ["Energy from oil", "Energy that never runs out", "Nuclear energy", "Expensive energy"], answer: 1 },
  { q: "What is 'deforestation'?", options: ["Planting new trees", "Clearing forests", "A type of pollution", "Ocean damage"], answer: 1 },
  { q: "What is a 'carbon footprint'?", options: ["A footprint in ash", "Total greenhouse gas emissions caused by a person", "A type of shoe", "A tax system"], answer: 1 },
  { q: "What does 'biodiversity' mean?", options: ["Air pollution", "Ocean temperature", "Chemical farming", "Variety of plant and animal life"], answer: 3 },
  { q: "A greenhouse gas ___ heat in the atmosphere.", options: ["creates", "traps", "removes", "generates"], answer: 1 },
  { q: "What does 'sustainable' mean?", options: ["Expensive", "Harmful", "Able to continue without damaging nature", "Very fast"], answer: 2 },
  { q: "What is 'acid rain'?", options: ["Clean rain", "Heavy rain", "Rain containing harmful chemicals", "Snow"], answer: 2 },
  { q: "What is 'conservation'?", options: ["Destroying habitats", "Building cities", "Industrial farming", "Protection of nature"], answer: 3 },
  { q: "Gases released into the atmosphere are called ___.", options: ["emissions", "resources", "fuels", "pollutants"], answer: 0 },
  { q: "A prolonged period of low rainfall is a ___.", options: ["flood", "drought", "hurricane", "monsoon"], answer: 1 },
  { q: "A species at risk of extinction is ___.", options: ["vulnerable", "invasive", "endangered", "extinct"], answer: 2 },
  { q: "A community of living things and their environment is an ___.", options: ["habitat", "ecosystem", "biome", "reserve"], answer: 1 },
  { q: "To ___ means to use resources faster than they are replaced.", options: ["conserve", "deplete", "recycle", "restore"], answer: 1 },
  { q: "Air ___ in major cities has reached dangerous levels.", options: ["temperature", "quality", "pollution", "pressure"], answer: 2 },
  { q: "The melting of polar ice caps is caused by ___.", options: ["deforestation", "acid rain", "global warming", "conservation"], answer: 2 },
  { q: "Wind and solar are examples of ___ energy.", options: ["fossil", "nuclear", "clean/renewable", "synthetic"], answer: 2 },
  { q: "The ___ of coral reefs is threatened by warming oceans.", options: ["economy", "biodiversity", "atmosphere", "pollution"], answer: 1 },
  { q: "Reforestation means ___.", options: ["cutting down trees", "planting new trees", "burning forests", "clearing land"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "The Environment",
  subtitle: "B2 environmental vocabulary — 3 exercises",
  level: "B2",
  keyRule: "Environmental vocabulary: emissions · deforestation · biodiversity · sustainable · renewable · carbon footprint · ecosystem",
  exercises: [
    {
      number: 1, title: "Multiple Choice", difficulty: "Upper-Intermediate",
      instruction: "Choose the correct answer (A, B, C or D).",
      questions: [
        "What is 'climate change'? A) Fashion changes B) Long-term shifts in temperatures C) Daily forecasts D) A pollution type",
        "What are 'fossil fuels'? A) Renewable sources B) Oil, coal and gas C) Solar energy D) Nuclear power",
        "What does 'renewable energy' mean? A) Oil energy B) Energy that never runs out C) Nuclear energy D) Expensive energy",
        "What is 'deforestation'? A) Planting trees B) Clearing forests C) A pollution type D) Ocean pollution",
        "What is the 'carbon footprint'? A) A shoe type B) Total greenhouse emissions C) A footprint in ash D) A tax",
      ],
    },
    {
      number: 2, title: "Choose the Word", difficulty: "Upper-Intermediate",
      instruction: "Choose the correct word for each gap.",
      questions: [
        "We need to reduce our ___ by using less energy. (carbon footprint / bank balance / social media)",
        "The government plans to ___ plastic bags to reduce waste. (ban / promote / sell)",
        "Solar panels are a form of ___ that helps reduce CO2. (renewable energy / fossil fuel / nuclear power)",
        "Large-scale ___ is destroying wildlife habitats. (deforestation / conservation / reforestation)",
        "The ___ of coral reefs is threatened by rising temperatures. (biodiversity / atmosphere / economy)",
      ],
    },
    {
      number: 3, title: "Fill in the Blanks", difficulty: "Upper-Intermediate",
      instruction: "Use words from the box to complete the sentences.",
      questions: [
        "We must reduce CO2 ___ to slow climate change. (emissions)",
        "Cutting down forests causes ___ and destroys habitats. (deforestation)",
        "The rainforest has incredible ___ — thousands of species live there. (biodiversity)",
        "We need ___ development that meets today's needs. (sustainable)",
        "Wind and solar are examples of ___ energy. (renewable)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Multiple Choice", answers: ["B", "B", "B", "B", "B"] },
    { exercise: 2, subtitle: "Choose the Word", answers: ["carbon footprint", "ban", "renewable energy", "deforestation", "biodiversity"] },
    { exercise: 3, subtitle: "Fill in the Blanks", answers: ["emissions", "deforestation", "biodiversity", "sustainable", "renewable"] },
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
  { id: 1, question: "What is 'climate change'?", options: ["Changes in fashion trends", "Long-term shifts in global temperatures and weather patterns", "Daily weather forecasts", "A type of pollution"], correct: 1, explanation: "Climate change refers to long-term shifts in global temperatures and weather patterns, largely caused by human activities such as burning fossil fuels." },
  { id: 2, question: "What are 'fossil fuels'?", options: ["Renewable energy sources", "Oil, coal and gas formed from ancient organisms", "Solar and wind energy", "Nuclear power"], correct: 1, explanation: "Fossil fuels — oil, coal and gas — were formed over millions of years from the remains of ancient organisms. They release CO2 when burned." },
  { id: 3, question: "What does 'renewable energy' mean?", options: ["Energy from oil and gas", "Energy that can never be replaced", "Energy from sources that naturally replenish", "Nuclear energy"], correct: 2, explanation: "Renewable energy comes from sources that are naturally replenished, such as sunlight, wind and water. Unlike fossil fuels, they do not run out." },
  { id: 4, question: "What is 'deforestation'?", options: ["Planting new trees", "The process of clearing forests", "A type of pollution", "Ocean pollution"], correct: 1, explanation: "Deforestation is the large-scale removal of forests, often to make land available for farming or development. It destroys habitats and releases CO2." },
  { id: 5, question: "What is the 'carbon footprint'?", options: ["A type of shoe", "The total greenhouse gas emissions caused by a person or organisation", "A footprint left in ash", "A type of tax"], correct: 1, explanation: "A carbon footprint measures the total greenhouse gas emissions — especially CO2 — produced by an individual, company or product." },
  { id: 6, question: "What does 'biodiversity' mean?", options: ["Air pollution", "The variety of plant and animal life in an area", "Chemical farming", "Ocean temperature"], correct: 1, explanation: "Biodiversity refers to the variety of all living things — plants, animals and microorganisms — in a particular area or on Earth as a whole." },
  { id: 7, question: "What is a 'greenhouse gas'?", options: ["A gas used for cooking", "A gas that traps heat in the atmosphere", "Clean air", "Oxygen"], correct: 1, explanation: "Greenhouse gases such as CO2 and methane trap heat in the Earth's atmosphere, causing the planet to warm — the greenhouse effect." },
  { id: 8, question: "What does 'sustainable' mean?", options: ["Using resources faster than they can be replaced", "Able to be maintained without damaging the environment", "Very expensive", "Illegal"], correct: 1, explanation: "Sustainable development meets present needs without compromising the ability of future generations to meet their own needs." },
  { id: 9, question: "What is 'acid rain'?", options: ["Clean rain", "Rain that contains harmful chemicals from pollution", "Heavy tropical rain", "Snow"], correct: 1, explanation: "Acid rain forms when pollutants such as sulphur dioxide and nitrogen oxides mix with water vapour in the atmosphere, creating acidic precipitation that harms ecosystems." },
  { id: 10, question: "What is 'conservation'?", options: ["Destroying natural habitats", "The protection and preservation of nature", "Industrial farming", "Building new cities"], correct: 1, explanation: "Conservation involves protecting and preserving natural environments, wildlife and resources for future generations." },
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
  { id: 1, before: "We need to reduce our", after: "by using less energy at home.", options: ["carbon footprint", "bank balance", "social media"], correct: "carbon footprint", explanation: "Reducing your carbon footprint means lowering the amount of greenhouse gases you produce, for example by using less electricity or driving less." },
  { id: 2, before: "The government plans to", after: "plastic bags to reduce waste.", options: ["ban", "promote", "sell"], correct: "ban", explanation: "Banning plastic bags means making them illegal. Promoting or selling them would increase, not reduce, plastic waste." },
  { id: 3, before: "Solar panels are a form of", after: "that helps reduce CO2 emissions.", options: ["renewable energy", "fossil fuel", "nuclear power"], correct: "renewable energy", explanation: "Solar panels convert sunlight into electricity — a renewable energy source that produces no direct CO2 emissions." },
  { id: 4, before: "Large-scale", after: "is destroying wildlife habitats in the Amazon.", options: ["deforestation", "conservation", "reforestation"], correct: "deforestation", explanation: "Deforestation — the large-scale clearing of trees — is destroying the habitats of thousands of species in the Amazon rainforest." },
  { id: 5, before: "The", after: "of coral reefs is threatened by rising ocean temperatures.", options: ["biodiversity", "atmosphere", "economy"], correct: "biodiversity", explanation: "Coral reefs are home to a huge variety of marine life. Rising ocean temperatures cause coral bleaching, which threatens this biodiversity." },
  { id: 6, before: "We must find", after: "alternatives to petrol and diesel engines.", options: ["sustainable", "cheap", "fast"], correct: "sustainable", explanation: "Sustainable alternatives — such as electric vehicles powered by renewable energy — can meet transport needs without damaging the environment." },
  { id: 7, before: "Air", after: "in major cities has reached dangerous levels.", options: ["pollution", "traffic", "noise"], correct: "pollution", explanation: "Air pollution from vehicle emissions and industry can cause serious health problems and has reached dangerous levels in many urban areas." },
  { id: 8, before: "The melting of the polar ice caps is caused by", after: ".", options: ["global warming", "deforestation", "ocean pollution"], correct: "global warming", explanation: "Global warming — the rise in Earth's average temperature caused by greenhouse gas emissions — is melting polar ice caps and raising sea levels." },
  { id: 9, before: "Governments are investing in", after: "energy like wind and solar.", options: ["clean", "cheap", "old"], correct: "clean", explanation: "Clean energy produces little or no pollution or greenhouse gas emissions. Wind and solar are the most common examples." },
  { id: 10, before: "Wildlife", after: "programmes help protect endangered species.", options: ["conservation", "pollution", "destruction"], correct: "conservation", explanation: "Wildlife conservation programmes work to protect animals and plants that are at risk of extinction, often through habitat protection and breeding schemes." },
];

// ── Exercise 3: Fill from the box ───────────────────────────────────────────

const WORD_BOX = ["emissions", "deforestation", "biodiversity", "sustainable", "renewable", "carbon footprint", "ecosystem", "drought", "endangered", "conservation"];

type FillQ = {
  id: number;
  before: string;
  after: string;
  correct: string;
  explanation: string;
};

const EX3: FillQ[] = [
  { id: 1, before: "We must reduce CO2", after: "to slow down climate change.", correct: "emissions", explanation: "Emissions are gases released into the atmosphere. Reducing CO2 emissions is essential to limiting global warming." },
  { id: 2, before: "Cutting down forests causes", after: "and destroys animal habitats.", correct: "deforestation", explanation: "Deforestation is the clearing of forests. It destroys habitats and releases stored CO2 back into the atmosphere." },
  { id: 3, before: "The rainforest has incredible", after: "— thousands of species live there.", correct: "biodiversity", explanation: "Biodiversity refers to the variety of life in an area. The Amazon rainforest is one of the most biodiverse places on Earth." },
  { id: 4, before: "We need", after: "development that meets today's needs without harming the future.", correct: "sustainable", explanation: "Sustainable development balances economic growth with environmental protection, ensuring resources remain available for future generations." },
  { id: 5, before: "Wind and solar are examples of", after: "energy.", correct: "renewable", explanation: "Renewable energy sources like wind and solar are naturally replenished and produce no direct greenhouse gas emissions." },
  { id: 6, before: "Flying frequently dramatically increases your", after: ".", correct: "carbon footprint", explanation: "Aviation is one of the most carbon-intensive activities. Each long-haul flight significantly increases a person's carbon footprint." },
  { id: 7, before: "The ocean is a complex", after: "where all living things depend on each other.", correct: "ecosystem", explanation: "An ecosystem is a community of living organisms interacting with their environment. The ocean ecosystem is home to millions of species." },
  { id: 8, before: "Due to climate change, some regions now face severe", after: "and water shortages.", correct: "drought", explanation: "A drought is a prolonged period of abnormally low rainfall. Climate change is making droughts more frequent and severe in many regions." },
  { id: 9, before: "The blue whale is an", after: "species — there are very few left.", correct: "endangered", explanation: "An endangered species is one at serious risk of extinction. The blue whale was hunted almost to extinction and remains vulnerable today." },
  { id: 10, before: "Wildlife", after: "efforts have helped some species recover.", correct: "conservation", explanation: "Conservation efforts — such as protected nature reserves and anti-poaching laws — have helped some endangered species increase their populations." },
];

// ── Vocabulary sidebar ───────────────────────────────────────────────────────

const VOCAB = [
  { word: "emissions", pos: "n.pl.", def: "gases released into the atmosphere" },
  { word: "deforestation", pos: "n.", def: "the clearing of forests" },
  { word: "biodiversity", pos: "n.", def: "the variety of life in a given area" },
  { word: "ecosystem", pos: "n.", def: "a community of living things and their environment" },
  { word: "drought", pos: "n.", def: "a long period without rain" },
];

const LABELS = ["A", "B", "C", "D"];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function EnvironmentClient() {
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
    : (exNo === 1 ? EX1 : EX2).filter((q) => answers[q.id] != null).length;

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
      body: JSON.stringify({ category: "vocabulary", level: "b2", slug: "environment", exerciseNo: exNo, score: percent, questionsTotal: total }),
    }).catch(() => {});
  }, [checked, percent]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["B2", "/vocabulary/b2"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">The Environment</span>
      </nav>

      {/* Hero */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-orange-400 px-3 py-0.5 text-[11px] font-black text-black">B2</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Vocabulary</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">3 exercises · 10 questions each</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
          <span className="relative inline-block">
            The Environment
            <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
          Learn environmental vocabulary with three different activities. Each exercise uses the same words — so the more you practise, the better you remember!
        </p>
      </div>

      {/* 3-col grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

        {/* Left column */}
        {isPro ? (
          <div className=""><SpeedRound gameId="vocab-environment" subject="Environment Vocabulary" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
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
          {tab === "explanation" ? <EnvironmentExplanation /> : (
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
                    const used = Object.values(fillAnswers).some((v) => normalize(v) === normalize(w));
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
                    {grade === "great" ? "Excellent! Great environmental vocabulary!" :
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
            <a href="/vocabulary/b2" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All B2 Exercises
            </a>
          </div>
        </div>
        )}
          </div>
        </section>

        {/* Right column */}
        {isPro ? (
          <VocabRecommendations level="b2" />
        ) : (
          <AdUnit variant="sidebar-light" />
        )}

      </div>
    </div>
  );
}

function EnvironmentExplanation() {
  const words = [
    ["climate change", "зміна клімату — long-term shifts in global temperatures"],
    ["fossil fuels", "викопне паливо — oil, coal and gas formed from ancient organisms"],
    ["renewable energy", "відновлювана енергія — energy from sources that naturally replenish"],
    ["deforestation", "вирубка лісів — the large-scale clearing of forests"],
    ["carbon footprint", "вуглецевий слід — total greenhouse gas emissions caused by a person"],
    ["biodiversity", "біорізноманіття — the variety of plant and animal life in an area"],
    ["greenhouse gas", "парниковий газ — a gas that traps heat in the atmosphere"],
    ["sustainable", "сталий — able to be maintained without damaging the environment"],
    ["acid rain", "кислотний дощ — rain containing harmful chemicals from pollution"],
    ["conservation", "охорона природи — protection and preservation of nature"],
    ["emissions", "викиди — gases released into the atmosphere"],
    ["drought", "посуха — a prolonged period of abnormally low rainfall"],
    ["endangered", "під загрозою зникнення — at serious risk of extinction"],
    ["ecosystem", "екосистема — a community of living things and their environment"],
    ["pollution", "забруднення — harmful substances in the environment"],
    ["global warming", "глобальне потепління — rise in Earth's average temperature"],
    ["reforestation", "лісовідновлення — planting new trees to replace cleared forests"],
    ["habitat", "середовище існування — the natural home of an animal or plant"],
    ["recycle", "переробляти — to process materials to use again"],
    ["ozone layer", "озоновий шар — layer of atmosphere that absorbs UV radiation"],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-900">The Environment — Vocabulary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map(([en, ua]) => (
          <div key={en} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm flex gap-2">
            <span className="font-bold text-slate-900 min-w-[120px]">{en}</span>
            <span className="text-slate-500">{ua}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">B2 Tip</div>
        <p className="text-xs text-amber-700 leading-relaxed">
          Do all three exercises in order. Each one uses the <strong>same vocabulary</strong> — by Exercise 3, the words will feel much more familiar! Focus on collocations like "reduce emissions", "protect biodiversity", and "carbon footprint".
        </p>
      </div>
    </div>
  );
}
