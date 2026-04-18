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
  { q: "What is 'inequality'?", options: ["Equal treatment", "Unfair difference between groups", "A type of law", "A government"], answer: 1 },
  { q: "What does 'discrimination' mean?", options: ["Fair treatment", "Unfair treatment based on race or gender", "A type of education", "A tax"], answer: 1 },
  { q: "What is 'poverty'?", options: ["Having too much money", "The state of being very poor", "A type of crime", "A policy"], answer: 1 },
  { q: "What does 'diversity' mean?", options: ["Everyone being the same", "Variety of different people and cultures", "A type of discrimination", "A political party"], answer: 1 },
  { q: "What is 'homelessness'?", options: ["Having a large house", "Having no permanent place to live", "A type of poverty", "A community issue"], answer: 1 },
  { q: "What is 'gender equality'?", options: ["Men and women having different rights", "Men and women having equal rights", "A type of discrimination", "A programme"], answer: 1 },
  { q: "What does 'integration' mean?", options: ["Separating different groups", "Combining groups into a united society", "A type of conflict", "A social problem"], answer: 1 },
  { q: "What is 'social mobility'?", options: ["Using public transport", "Moving between social classes", "Moving to another city", "A type of migration"], answer: 1 },
  { q: "What is 'a welfare state'?", options: ["A very rich country", "A system of government social protection", "A type of economy", "A private company"], answer: 1 },
  { q: "What does 'marginalised' mean?", options: ["Very powerful", "Excluded from society", "Well-educated", "Financially successful"], answer: 1 },
  { q: "The wealth gap has ___ in recent decades.", options: ["closed", "widened", "disappeared", "stabilised"], answer: 1 },
  { q: "To ___ means to give someone power and confidence.", options: ["isolate", "discriminate", "empower", "marginalise"], answer: 2 },
  { q: "Economic ___ gives people tools to improve their lives.", options: ["discrimination", "empowerment", "inequality", "poverty"], answer: 1 },
  { q: "A ___ system protects citizens during unemployment or illness.", options: ["welfare", "banking", "education", "media"], answer: 0 },
  { q: "Racial ___ means unequal rights between racial groups.", options: ["harmony", "tolerance", "inequality", "diversity"], answer: 2 },
  { q: "Community projects help ___ people.", options: ["isolate", "ignore", "empower", "discriminate"], answer: 2 },
  { q: "The government tackled ___ among young people.", options: ["tourism", "education", "homelessness", "diversity"], answer: 2 },
  { q: "A person who has been ___ faces exclusion from society.", options: ["empowered", "marginalised", "integrated", "educated"], answer: 1 },
  { q: "Education is the key driver of ___.", options: ["poverty", "social mobility", "discrimination", "welfare"], answer: 1 },
  { q: "Successful ___ of immigrants requires support.", options: ["isolation", "integration", "discrimination", "marginalisation"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Social Issues",
  subtitle: "B2 social issues vocabulary — 3 exercises",
  level: "B2",
  keyRule: "Social issues vocabulary: inequality · discrimination · poverty · diversity · homelessness · welfare · integration · social mobility",
  exercises: [
    {
      number: 1, title: "Multiple Choice", difficulty: "Upper-Intermediate",
      instruction: "Choose the correct answer (A, B, C or D).",
      questions: [
        "What is 'inequality'? A) Equal treatment B) Unfair difference C) A law type D) A government",
        "What does 'discrimination' mean? A) Fair treatment B) Unfair treatment based on race/gender C) Education type D) A tax",
        "What is 'poverty'? A) Having too much money B) The state of being very poor C) A crime type D) A policy",
        "What does 'diversity' mean? A) Everyone the same B) Variety of people and cultures C) A discrimination type D) A party",
        "What is 'social mobility'? A) Using public transport B) Moving between social classes C) Moving cities D) Migration type",
      ],
    },
    {
      number: 2, title: "Choose the Word", difficulty: "Upper-Intermediate",
      instruction: "Choose the correct word for each gap.",
      questions: [
        "The gap between rich and poor has ___ in recent decades. (widened / closed / disappeared)",
        "Women still face ___ in the workplace. (discrimination / promotion / equality)",
        "The government launched a campaign to tackle ___ among young people. (homelessness / education / tourism)",
        "Schools should promote ___ by celebrating different backgrounds. (diversity / uniformity / competition)",
        "We need to improve ___ so talent determines success. (social mobility / social media / public transport)",
      ],
    },
    {
      number: 3, title: "Fill in the Blanks", difficulty: "Upper-Intermediate",
      instruction: "Use words from the box to complete the sentences.",
      questions: [
        "Economic ___ means some have far more opportunities than others. (inequality)",
        "Millions of children grow up in ___ without access to education. (poverty)",
        "Racial and gender ___ are still widespread. (discrimination)",
        "A diverse workplace benefits from the ___ of employees. (diversity)",
        "The ___ system protects citizens during unemployment. (welfare)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Multiple Choice", answers: ["B", "B", "B", "B", "B"] },
    { exercise: 2, subtitle: "Choose the Word", answers: ["widened", "discrimination", "homelessness", "diversity", "social mobility"] },
    { exercise: 3, subtitle: "Fill in the Blanks", answers: ["inequality", "poverty", "discrimination", "diversity", "welfare"] },
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
  { id: 1, question: "What is 'inequality'?", options: ["Equal treatment for everyone", "An unfair situation where some people have much more than others", "A type of law", "A form of government"], correct: 1, explanation: "Inequality refers to an unfair difference in wealth, opportunities or treatment between groups of people in society." },
  { id: 2, question: "What does 'discrimination' mean?", options: ["Treating people fairly", "Treating people unfairly because of race, gender, etc.", "A type of education", "A tax system"], correct: 1, explanation: "Discrimination means treating someone unfairly because of characteristics such as race, gender, age, religion or disability." },
  { id: 3, question: "What is 'poverty'?", options: ["Having too much money", "The state of being very poor", "A type of crime", "A government policy"], correct: 1, explanation: "Poverty is the state of having very little money and lacking access to basic necessities such as food, shelter and healthcare." },
  { id: 4, question: "What does 'diversity' mean?", options: ["Everyone being the same", "Having a variety of different people, ideas, and cultures", "A type of discrimination", "A political party"], correct: 1, explanation: "Diversity refers to the presence of a wide range of different people, backgrounds, ideas and cultures within a group or society." },
  { id: 5, question: "What is 'homelessness'?", options: ["Having a very large house", "The state of having no permanent place to live", "A type of poverty", "A community issue"], correct: 1, explanation: "Homelessness is the condition of having no stable or permanent home. It is often caused by poverty, unemployment or lack of affordable housing." },
  { id: 6, question: "What is 'gender equality'?", options: ["Men and women having different rights", "Men and women having the same rights and opportunities", "A type of discrimination", "A government programme"], correct: 1, explanation: "Gender equality means that people of all genders have equal rights, responsibilities and opportunities in all areas of life." },
  { id: 7, question: "What does 'integration' mean?", options: ["Separating different groups", "Combining different groups into a united society", "A type of conflict", "A social problem"], correct: 1, explanation: "Integration is the process of bringing different groups — such as immigrants and the existing population — together into a unified society." },
  { id: 8, question: "What is 'social mobility'?", options: ["Using public transport", "The ability to move from one social class to another", "Moving to another city", "A type of migration"], correct: 1, explanation: "Social mobility refers to the ability of individuals or families to move between social classes, typically through education, employment or income." },
  { id: 9, question: "What is 'a welfare state'?", options: ["A very rich country", "A system where the government provides social protection", "A type of economy", "A private company"], correct: 1, explanation: "A welfare state is a system in which the government takes responsibility for providing social protection, including healthcare, education and benefits for those in need." },
  { id: 10, question: "What does 'marginalised' mean?", options: ["Very powerful", "Treated as unimportant and excluded from society", "Well-educated", "Financially successful"], correct: 1, explanation: "Marginalised groups are those pushed to the edges of society, often facing exclusion, discrimination and limited access to resources and opportunities." },
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
  { id: 1, before: "The gap between the rich and poor has", after: "significantly in recent decades.", options: ["widened", "closed", "disappeared"], correct: "widened", explanation: "The wealth gap has widened — meaning it has grown larger — in many countries, with the rich getting richer and the poor falling further behind." },
  { id: 2, before: "Women still face", after: "in the workplace despite legal protections.", options: ["discrimination", "promotion", "equality"], correct: "discrimination", explanation: "Despite equal rights legislation, many women still face discrimination — unfair treatment — in hiring, pay and promotion." },
  { id: 3, before: "The government launched a campaign to tackle", after: "among young people.", options: ["homelessness", "education", "tourism"], correct: "homelessness", explanation: "Tackling homelessness means taking action to reduce the number of people living without permanent shelter, particularly vulnerable young people." },
  { id: 4, before: "Schools should promote", after: "by celebrating students from different backgrounds.", options: ["diversity", "uniformity", "competition"], correct: "diversity", explanation: "Promoting diversity in schools means embracing and celebrating students from different cultural, ethnic and social backgrounds." },
  { id: 5, before: "Millions of people still live in", after: "and cannot afford basic necessities.", options: ["poverty", "luxury", "comfort"], correct: "poverty", explanation: "Living in poverty means lacking the financial resources to meet basic needs such as food, clean water and housing." },
  { id: 6, before: "We need to improve", after: "so that talent, not background, determines success.", options: ["social mobility", "social media", "public transport"], correct: "social mobility", explanation: "Improving social mobility means ensuring that a person's ability and effort — not their class background — determine how far they can go in life." },
  { id: 7, before: "The", after: "system provides healthcare and benefits to those in need.", options: ["welfare", "banking", "education"], correct: "welfare", explanation: "The welfare system is the network of government programmes and benefits designed to support citizens who are unemployed, ill or otherwise in need." },
  { id: 8, before: "People from", after: "groups often have less access to education and jobs.", options: ["marginalised", "privileged", "educated"], correct: "marginalised", explanation: "Marginalised groups — such as ethnic minorities or people with disabilities — often face systemic barriers that limit their access to education and employment." },
  { id: 9, before: "Racial", after: "remains a serious issue in many countries.", options: ["inequality", "harmony", "tolerance"], correct: "inequality", explanation: "Racial inequality refers to the unequal distribution of wealth, opportunities and rights between people of different racial backgrounds." },
  { id: 10, before: "Community projects help", after: "people and give them a sense of belonging.", options: ["empower", "ignore", "isolate"], correct: "empower", explanation: "To empower people means to give them the confidence, skills and resources to take control of their own lives and contribute to their community." },
];

// ── Exercise 3: Fill from the box ───────────────────────────────────────────

const WORD_BOX = ["inequality", "poverty", "discrimination", "diversity", "homelessness", "welfare", "integration", "marginalised", "empowerment", "social mobility"];

type FillQ = {
  id: number;
  before: string;
  after: string;
  correct: string;
  explanation: string;
};

const EX3: FillQ[] = [
  { id: 1, before: "Economic", after: "means some people have far more opportunities than others.", correct: "inequality", explanation: "Economic inequality describes the unequal distribution of wealth and opportunities in society, often passing from generation to generation." },
  { id: 2, before: "Millions of children grow up in", after: "without access to education.", correct: "poverty", explanation: "Poverty denies children access to education, healthcare and opportunities, often trapping them in a cycle that is difficult to escape." },
  { id: 3, before: "Racial and gender", after: "are still widespread in many industries.", correct: "discrimination", explanation: "Discrimination based on race or gender remains a significant problem in many workplaces, affecting hiring, pay and career progression." },
  { id: 4, before: "A diverse workplace benefits from the", after: "of its employees' backgrounds.", correct: "diversity", explanation: "Workplace diversity brings together different perspectives, experiences and skills, which can improve creativity, problem-solving and decision-making." },
  { id: 5, before: "Rising house prices are a major cause of", after: "in big cities.", correct: "homelessness", explanation: "When housing costs rise faster than wages, many people — especially young people and those on low incomes — are priced out of the market and may become homeless." },
  { id: 6, before: "The", after: "system protects citizens during unemployment or illness.", correct: "welfare", explanation: "The welfare system provides financial and social support to people during periods of unemployment, illness, disability or other hardship." },
  { id: 7, before: "Successful", after: "of immigrants into society requires support and education.", correct: "integration", explanation: "Effective integration helps immigrants learn the language, understand the culture and participate fully in society, benefiting both immigrants and host communities." },
  { id: 8, before: "Policies must protect", after: "communities who face systemic disadvantage.", correct: "marginalised", explanation: "Marginalised communities — those pushed to the edges of society — require targeted policies and support to overcome systemic barriers to participation and opportunity." },
  { id: 9, before: "Economic", after: "gives people the tools to improve their own lives.", correct: "empowerment", explanation: "Economic empowerment provides people with the financial resources, skills and opportunities they need to become self-sufficient and improve their living conditions." },
  { id: 10, before: "Education is the key driver of", after: "for working-class families.", correct: "social mobility", explanation: "Education is widely recognised as the most effective route to social mobility, allowing people from disadvantaged backgrounds to access better opportunities." },
];

// ── Vocabulary sidebar ───────────────────────────────────────────────────────

const VOCAB = [
  { word: "inequality", pos: "n.", def: "an unfair difference between groups of people" },
  { word: "discrimination", pos: "n.", def: "unfair treatment based on race, gender, etc." },
  { word: "welfare", pos: "n.", def: "government support for people in need" },
  { word: "integration", pos: "n.", def: "combining different groups into one society" },
  { word: "empower", pos: "v.", def: "to give someone confidence and control over their life" },
];

const LABELS = ["A", "B", "C", "D"];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function SocialIssuesClient() {
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
      body: JSON.stringify({ category: "vocabulary", level: "b2", slug: "social-issues", exerciseNo: exNo, score: percent, questionsTotal: total }),
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
        <span className="text-slate-700 font-medium">Social Issues</span>
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
            Social Issues
            <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
          Learn social issues vocabulary with three different activities. Each exercise uses the same words — so the more you practise, the better you remember!
        </p>
      </div>

      {/* 3-col grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

        {/* Left column */}
        {isPro ? (
          <div className=""><SpeedRound gameId="vocab-social-issues" subject="Social Issues Vocabulary" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
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
          {tab === "explanation" ? <SocialIssuesExplanation /> : (
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
                    {grade === "great" ? "Excellent! Great social issues vocabulary!" :
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

function SocialIssuesExplanation() {
  const words = [
    ["inequality", "нерівність — unfair difference in wealth or opportunities between groups"],
    ["discrimination", "дискримінація — unfair treatment based on race, gender, age, etc."],
    ["poverty", "бідність — the state of having very little money"],
    ["diversity", "різноманітність — variety of different people, ideas and cultures"],
    ["homelessness", "бездомність — the condition of having no stable home"],
    ["gender equality", "гендерна рівність — equal rights for people of all genders"],
    ["integration", "інтеграція — combining different groups into one unified society"],
    ["social mobility", "соціальна мобільність — ability to move between social classes"],
    ["welfare state", "соціальна держава — government provides social protection"],
    ["marginalised", "маргіналізований — pushed to the edges of society"],
    ["empower", "розширювати права — to give someone confidence and control"],
    ["empowerment", "розширення прав — process of gaining power and confidence"],
    ["welfare", "добробут/соціальний захист — government support for people in need"],
    ["widened", "розширився — increased (of a gap or difference)"],
    ["tackle", "вирішувати — to deal with a difficult problem"],
    ["privilege", "привілей — a special advantage available to some but not others"],
    ["systemic", "системний — relating to the whole system, not just individuals"],
    ["barrier", "бар'єр — an obstacle that prevents progress"],
    ["inclusive", "інклюзивний — welcoming and including everyone"],
    ["stereotype", "стереотип — a fixed, oversimplified idea about a group"],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-900">Social Issues — Vocabulary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map(([en, ua]) => (
          <div key={en} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm flex gap-2">
            <span className="font-bold text-slate-900 min-w-[110px]">{en}</span>
            <span className="text-slate-500">{ua}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">B2 Tip</div>
        <p className="text-xs text-amber-700 leading-relaxed">
          Do all three exercises in order. Each one uses the <strong>same vocabulary</strong> — by Exercise 3, the words will feel much more familiar! Focus on noun forms: inequality, discrimination, empowerment, integration.
        </p>
      </div>
    </div>
  );
}
