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
  { q: "Zero conditional: if + present → ?", options: ["present simple", "will + verb", "would + verb", "past simple"], answer: 0 },
  { q: "First conditional result clause uses:", options: ["will + infinitive", "would + infinitive", "present simple", "past simple"], answer: 0 },
  { q: "Second conditional if-clause uses:", options: ["past simple", "present simple", "will + verb", "future simple"], answer: 0 },
  { q: "Which is a zero conditional?", options: ["If I won, I'd buy a house.", "If you heat water, it boils.", "If it rains, I'll stay.", "If I were you, I'd go."], answer: 1 },
  { q: "Which is a first conditional?", options: ["If I had a car, I'd drive.", "If water freezes, it's ice.", "If he calls, I'll answer.", "If I were rich, I'd travel."], answer: 2 },
  { q: "Which is a second conditional?", options: ["If she studies, she'll pass.", "Ice melts if it warms up.", "If I were you, I'd apologise.", "If you press here, it opens."], answer: 2 },
  { q: "'If I ___ you, I'd say sorry.' Missing word:", options: ["am", "were", "will be", "would be"], answer: 1 },
  { q: "Can you use 'will' in the if-clause?", options: ["Yes, always", "No, never", "Only in first conditional", "Only in zero conditional"], answer: 1 },
  { q: "Zero conditional is used for:", options: ["Hypothetical situations", "Real future plans", "General facts and habits", "Past regrets"], answer: 2 },
  { q: "'If I had £1M, I ___ travel.' Correct:", options: ["will", "would", "should", "could not"], answer: 1 },
  { q: "Second conditional expresses:", options: ["General facts", "Real future plans", "Hypothetical situations", "Past habits"], answer: 2 },
  { q: "Which sentence is WRONG?", options: ["If it rains, I'll stay home.", "If it will rain, I'll stay.", "If I were tall, I'd play basketball.", "If you heat it, it expands."], answer: 1 },
  { q: "'If she ___ hard, she'll pass.' Correct form:", options: ["will study", "studies", "studied", "would study"], answer: 1 },
  { q: "What type? 'If glass breaks, handle it carefully.'", options: ["First", "Second", "Zero", "Third"], answer: 2 },
  { q: "'Glass ___ if you drop it.' Zero conditional:", options: ["would break", "will break", "breaks", "broke"], answer: 2 },
  { q: "First conditional is used for:", options: ["Impossible dreams", "Unlikely situations", "Real possible future", "Scientific laws only"], answer: 2 },
  { q: "'If he ___ his glasses, he can't read.' Zero:", options: ["doesn't wear", "didn't wear", "wouldn't wear", "won't wear"], answer: 0 },
  { q: "Which pair is correct for 2nd conditional?", options: ["if + present, will + verb", "if + past, would + verb", "if + past, will + verb", "if + present, would + verb"], answer: 1 },
  { q: "Comma rule: which is correct?", options: ["I'll stay if, it rains.", "If it rains I'll stay.", "If it rains, I'll stay.", "I'll stay, if it rains."], answer: 2 },
  { q: "'What ___ you do if you lost your job?' Correct:", options: ["will", "would", "do", "could"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "All Conditionals (0 / 1 / 2)",
  subtitle: "Zero, First, and Second Conditionals",
  level: "B1",
  keyRule: "Zero: if+present→present | First: if+present→will | Second: if+past→would",
  exercises: [
    {
      number: 1,
      title: "Write the verb form (Zero/First)",
      difficulty: "Easy",
      instruction: "Write the correct verb form.",
      questions: [
        "If you heat metal, it ___ (expand).",
        "If it ___ (rain) tomorrow, we'll cancel.",
        "She always ___ (get) headaches if tired.",
        "If he calls, I ___ (tell) him.",
        "Water ___ (freeze) below 0°C.",
        "If they ___ (not/hurry), they'll miss it.",
        "Plants ___ (die) without water.",
        "If dogs ___ (can) talk, life'd differ.",
        "If I ___ (be) you, I'd say sorry.",
        "Ice cream ___ (melt) in the sun.",
      ],
    },
    {
      number: 2,
      title: "Choose the correct form",
      difficulty: "Medium",
      instruction: "Choose: had / passes / were / contracts.",
      questions: [
        "If I ___ a car, I'd drive to work.",
        "If he ___ the exam, he'll celebrate.",
        "If I ___ fluent in Chinese, I'd apply.",
        "Metal ___ if you cool it down.",
        "I'll call if I ___ any problems.",
        "She'd be happy if you ___ her.",
        "Glass ___ if you drop it.",
        "If she ___ her diet, she'll feel better.",
        "I ___ be so nervous here. (wouldn't)",
        "If he ___ harder, he'd get promoted.",
      ],
    },
    {
      number: 3,
      title: "Choose the conditional type",
      difficulty: "Hard",
      instruction: "Which type: Zero, First or Second?",
      questions: [
        "If I were a bird, I'd fly away.",
        "If you mix red + blue, get purple.",
        "If it's sunny, we'll go out.",
        "'If I ___ you, I'd apologise.' = ?",
        "If she's late, she'll miss the meeting.",
        "Babies cry if they're hungry.",
        "If I spoke Japanese, I'd work there.",
        "If you flip switch, the light goes off.",
        "Impossible: If it will rain, I'll go.",
        "If he ___ glasses, he can't read.",
      ],
    },
    {
      number: 4,
      title: "Correct the errors",
      difficulty: "Harder",
      instruction: "Find and fix the mistake.",
      questions: [
        "If it will rain, I'll stay home.",
        "If I would have money, I'd buy car.",
        "If she studies, she would pass.",
        "If I am you, I'd apologise.",
        "If metals heat, they would expand.",
        "If he has more time, he'd travel.",
        "If you will press this, it opens.",
        "I'll stay home if it would rain.",
        "If she lived there, she will know.",
        "If dogs could talk, life is different.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Verb forms", answers: ["expands", "rains", "gets", "will tell", "freezes", "don't hurry", "die", "could", "were", "melts"] },
    { exercise: 2, subtitle: "Correct forms", answers: ["had", "passes", "were", "contracts", "have", "visited", "breaks", "improves", "wouldn't", "worked"] },
    { exercise: 3, subtitle: "Conditional types", answers: ["Second", "Zero", "First", "Second", "First", "Zero", "Second", "Zero", "Error (will in if-clause)", "Zero"] },
    { exercise: 4, subtitle: "Corrected sentences", answers: ["If it rains", "If I had money", "she will pass", "If I were you", "they expand", "he would travel", "If you press", "if it rains", "she would know", "life would be different"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Zero & First Conditional", href: "/grammar/b1/zero-first-conditional", level: "B1", badge: "bg-violet-500", reason: "Foundation before all conditionals" },
  { title: "Second Conditional", href: "/grammar/b1/second-conditional", level: "B1", badge: "bg-violet-500" },
  { title: "Wish + Past", href: "/grammar/b1/wish-past", level: "B1", badge: "bg-violet-500" },
];

export default function AllConditionalsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "input",
      title: "Exercise 1 (Easy) — Write the correct verb form",
      instructions: "Write the correct form of the verb in brackets. The sentences are a mix of zero, first, and second conditionals.",
      questions: [
        { id: "e1q1", prompt: "If you heat metal, it ___ (expand). (zero)", correct: "expands", explanation: "Zero conditional → present simple: expands." },
        { id: "e1q2", prompt: "If it ___ (rain) tomorrow, we'll cancel the picnic. (first)", correct: "rains", explanation: "First conditional if-clause → present simple: rains." },
        { id: "e1q3", prompt: "If I ___ (have) a million pounds, I'd buy a castle. (second)", correct: "had", explanation: "Second conditional if-clause → past simple: had." },
        { id: "e1q4", prompt: "She always ___ (get) headaches if she doesn't sleep. (zero)", correct: "gets", explanation: "Zero conditional result → present simple: gets." },
        { id: "e1q5", prompt: "If he calls me, I ___ (tell) him the news. (first)", correct: "will tell", explanation: "First conditional result → will tell." },
        { id: "e1q6", prompt: "If I ___ (be) you, I wouldn't say that. (second)", correct: "were", explanation: "Second conditional if-clause → were (standard form)." },
        { id: "e1q7", prompt: "Water ___ (freeze) if the temperature drops below 0°C. (zero)", correct: "freezes", explanation: "Zero conditional result → present simple: freezes." },
        { id: "e1q8", prompt: "If they ___ (not / hurry), they'll miss the bus. (first)", correct: "don't hurry", explanation: "First conditional negative if-clause → don't hurry." },
        { id: "e1q9", prompt: "If dogs ___ (can) talk, life would be very different. (second)", correct: "could", explanation: "Second conditional if-clause → could (past form of can)." },
        { id: "e1q10", prompt: "Plants ___ (die) if they don't get water. (zero)", correct: "die", explanation: "Zero conditional result → present simple: die." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Choose the correct verb form",
      instructions: "Choose the correct form. There are zero, first, and second conditionals mixed together.",
      questions: [
        { id: "e2q1", prompt: "If I ___ a car, I'd drive to work every day. (I don't have one)", options: ["had", "have", "will have"], correctIndex: 0, explanation: "Unreal present → Second conditional: had." },
        { id: "e2q2", prompt: "If you press this button, the alarm ___.", options: ["goes off", "would go off", "went off"], correctIndex: 0, explanation: "Factual/mechanical truth → Zero conditional: goes off." },
        { id: "e2q3", prompt: "She ___ be delighted if you visited her. (she'd really like a visit)", options: ["would", "will", "does"], correctIndex: 0, explanation: "Hypothetical, unlikely → Second: would." },
        { id: "e2q4", prompt: "If he ___ the exam, he'll go to university. (he's working hard)", options: ["passes", "passed", "will pass"], correctIndex: 0, explanation: "Real future possibility → First: passes." },
        { id: "e2q5", prompt: "Glass ___ if you drop it.", options: ["breaks", "would break", "will break"], correctIndex: 0, explanation: "General fact → Zero: breaks." },
        { id: "e2q6", prompt: "If I ___ fluent in Chinese, I'd get that job easily.", options: ["were", "am", "will be"], correctIndex: 0, explanation: "Unreal/hypothetical → Second: were." },
        { id: "e2q7", prompt: "I'll call you if I ___ any problems.", options: ["have", "had", "would have"], correctIndex: 0, explanation: "Real future → First: have." },
        { id: "e2q8", prompt: "If she ___ her diet, she'll feel much better.", options: ["improves", "improved", "would improve"], correctIndex: 0, explanation: "Real future action and result → First: improves." },
        { id: "e2q9", prompt: "Metal ___ if you cool it down.", options: ["contracts", "would contract", "will contract"], correctIndex: 0, explanation: "Scientific law → Zero: contracts." },
        { id: "e2q10", prompt: "If he ___ harder, he might get promoted. (he could do it)", options: ["worked", "works", "will work"], correctIndex: 0, explanation: "Hypothetical but possible → Second: worked." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Hard) — Write the correct form",
      instructions: "Write the correct form of the verb in brackets. The conditional type is given in brackets.",
      questions: [
        { id: "e3q1", prompt: "If you ___ (not / eat) breakfast, you feel tired. (zero)", correct: "don't eat", explanation: "Zero conditional if-clause → present simple: don't eat." },
        { id: "e3q2", prompt: "If she ___ (pass) the test, she'll celebrate. (first)", correct: "passes", explanation: "First conditional if-clause → present simple: passes." },
        { id: "e3q3", prompt: "If I ___ (be) rich, I'd give a lot to charity. (second)", correct: "were", explanation: "Second conditional if-clause → past simple: were." },
        { id: "e3q4", prompt: "We ___ (go) to the beach if it's sunny on Saturday. (first)", correct: "will go", explanation: "First conditional result → will go." },
        { id: "e3q5", prompt: "Ice cream ___ (melt) if you leave it in the sun. (zero)", correct: "melts", explanation: "Zero conditional result → present simple: melts." },
        { id: "e3q6", prompt: "He ___ (travel) more if he had more holiday time. (second)", correct: "would travel", explanation: "Second conditional result → would travel." },
        { id: "e3q7", prompt: "If the bus ___ (not / come), I'll take a taxi. (first)", correct: "doesn't come", explanation: "First conditional if-clause → present negative: doesn't come." },
        { id: "e3q8", prompt: "Dogs ___ (follow) you if you give them food. (zero)", correct: "follow", explanation: "Zero conditional result → present simple: follow." },
        { id: "e3q9", prompt: "She ___ (be) a great teacher if she chose that career. (second)", correct: "would be", explanation: "Second conditional result → would be." },
        { id: "e3q10", prompt: "If you ___ (study) tonight, you'll be ready for the test. (first)", correct: "study", explanation: "First conditional if-clause → present simple: study." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Harder) — Mixed challenge",
      instructions: "Read each sentence and choose the correct option. These questions test your understanding of all three types.",
      questions: [
        { id: "e4q1", prompt: "Which sentence uses the SECOND conditional correctly?", options: ["If it rains, I'll stay home.", "If I were a bird, I'd fly away.", "If you heat water, it boils."], correctIndex: 1, explanation: "If I were a bird → unreal/impossible → Second conditional." },
        { id: "e4q2", prompt: "Which sentence uses the ZERO conditional correctly?", options: ["If I won the lottery, I'd be rich.", "If you mix red and blue, you get purple.", "If she calls, I'll answer."], correctIndex: 1, explanation: "Colour mixing = scientific fact → Zero conditional." },
        { id: "e4q3", prompt: "Which sentence uses the FIRST conditional correctly?", options: ["If I had time, I'd help.", "If it's sunny tomorrow, we'll go out.", "If you freeze water, it becomes ice."], correctIndex: 1, explanation: "Real future possibility → First conditional." },
        { id: "e4q4", prompt: "'If I ___ you, I'd apologise.' What's the missing word?", options: ["am", "were", "will be"], correctIndex: 1, explanation: "If I were you → standard Second conditional advice phrase." },
        { id: "e4q5", prompt: "'If she ___, she'll miss the meeting.' (She might be late)", options: ["is late", "were late", "was late"], correctIndex: 0, explanation: "Real future possibility → First conditional: is late." },
        { id: "e4q6", prompt: "'Babies ___ if they're hungry.' Which form fits?", options: ["will cry", "would cry", "cry"], correctIndex: 2, explanation: "General truth about babies → Zero conditional: cry." },
        { id: "e4q7", prompt: "What does this sentence express? 'If I spoke Japanese, I'd work in Tokyo.'", options: ["A real future plan", "A hypothetical situation (I don't speak Japanese)", "A general fact"], correctIndex: 1, explanation: "The speaker doesn't speak Japanese → Second conditional = hypothetical." },
        { id: "e4q8", prompt: "'If you ___ this switch, the light goes off.' (always true)", options: ["flip", "flipped", "will flip"], correctIndex: 0, explanation: "Zero conditional fact → present simple: flip." },
        { id: "e4q9", prompt: "Which sentence is grammatically INCORRECT?", options: ["If I had more time, I would read more.", "If it will rain, I'll take an umbrella.", "If plants don't get light, they die."], correctIndex: 1, explanation: "Never use 'will' in the if-clause: ✗ If it will rain → ✓ If it rains." },
        { id: "e4q10", prompt: "'If he ___ his glasses, he can't read.' (general truth)", options: ["doesn't wear", "didn't wear", "wouldn't wear"], correctIndex: 0, explanation: "Zero conditional fact about him → doesn't wear." },
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
        <span className="text-slate-700 font-medium">All Conditionals (0 / 1 / 2)</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          All Conditionals{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">0 / 1 / 2</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Mixed practice for all three conditionals. <b>Zero</b> (if + present → present) for facts and habits. <b>First</b> (if + present → will) for real future situations. <b>Second</b> (if + past → would) for hypothetical and unreal situations.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-all-conditionals" subject="All Conditionals" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                        {score.percent >= 80 ? "Excellent! You've mastered all three conditionals." : score.percent >= 50 ? "Good effort! Review any conditional you're unsure about." : "Keep practising — check the Explanation tab for a summary of all three."}
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
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b1-all-conditionals" subject="All Conditionals" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/relative-clauses-defining" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Relative Clauses — Defining →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">ALL CONDITIONALS OVERVIEW</h2>
        <p className="text-slate-500 text-sm">Zero, First, and Second conditionals — when to use each and how to form them</p>
      </div>

      {/* 3 gradient cards for the three conditionals */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-3">Zero Conditional</div>
          <Formula parts={[
            { text: "If", color: "slate" },
            { text: "present simple", color: "sky" },
            { text: "→", dim: true },
            { text: "present simple", color: "sky" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>If you heat water, it boils.</div>
            <div>If I'm tired, I go to bed.</div>
          </div>
          <div className="mt-3 text-xs text-slate-500">Use: facts, laws, habits — always true</div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-3">First Conditional</div>
          <Formula parts={[
            { text: "If", color: "slate" },
            { text: "present simple", color: "green" },
            { text: "→", dim: true },
            { text: "will + verb", color: "yellow" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>If it rains, I'll stay home.</div>
            <div>If he calls, I'll answer.</div>
          </div>
          <div className="mt-3 text-xs text-slate-500">Use: real, possible future situations</div>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-violet-600 mb-3">Second Conditional</div>
          <Formula parts={[
            { text: "If", color: "slate" },
            { text: "past simple", color: "violet" },
            { text: "→", dim: true },
            { text: "would + verb", color: "violet" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>If I had £1M, I'd travel.</div>
            <div>If I were you, I'd apologise.</div>
          </div>
          <div className="mt-3 text-xs text-slate-500">Use: hypothetical, unreal or unlikely</div>
        </div>
      </div>

      {/* Usage cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-2">Zero — General Truth</div>
          <div className="text-sm text-slate-700">Use when something is always true — a fact, scientific law, or reliable habit. Both clauses use present simple.</div>
          <div className="mt-2 italic text-slate-600 text-sm">If you mix red and blue, you get purple.</div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-2">First — Real Future</div>
          <div className="text-sm text-slate-700">Use for realistic, possible future outcomes. The if-clause sets a condition; the result clause uses will.</div>
          <div className="mt-2 italic text-slate-600 text-sm">If she studies hard, she'll pass the exam.</div>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-violet-600 mb-2">Second — Unreal Present</div>
          <div className="text-sm text-slate-700">Use for imaginary or unlikely situations. The past tense in the if-clause signals unreality — not past time.</div>
          <div className="mt-2 italic text-slate-600 text-sm">If I lived in Paris, I'd visit the Louvre every week.</div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-amber-600 mb-2">Comma Rule</div>
          <div className="text-sm text-slate-700">Put a comma after the if-clause when it comes first. No comma is needed when the main clause comes first.</div>
          <div className="mt-2 italic text-slate-600 text-sm">If it rains, I'll stay. / I'll stay if it rains.</div>
        </div>
      </div>

      {/* Quick reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black">!</span>
          <span className="font-black text-slate-900 text-sm">QUICK REFERENCE — ALL THREE TYPES</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Type</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">If-clause</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">Result clause</th>
                <th className="text-left py-2 font-black text-slate-700">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2 pr-4 text-slate-600 font-semibold">Zero</td>
                <td className="py-2 pr-4 text-slate-600">present simple</td>
                <td className="py-2 pr-4 text-slate-600">present simple</td>
                <td className="py-2 text-slate-600">always true</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-slate-600 font-semibold">First</td>
                <td className="py-2 pr-4 text-slate-600">present simple</td>
                <td className="py-2 pr-4 text-slate-600">will + infinitive</td>
                <td className="py-2 text-slate-600">real / possible future</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-slate-600 font-semibold">Second</td>
                <td className="py-2 pr-4 text-slate-600">past simple</td>
                <td className="py-2 pr-4 text-slate-600">would + infinitive</td>
                <td className="py-2 text-slate-600">hypothetical / unreal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Key words */}
      <div>
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Key Words & Phrases</div>
        <div className="flex flex-wrap gap-2">
          {["if", "unless", "when", "as long as", "provided that", "would", "will", "might", "could"].map((w) => (
            <span key={w} className="rounded-lg border border-sky-200 bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800">{w}</span>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Common Mistakes</div>
        <Ex en="If it will rain tomorrow, I'll stay home." correct={false} />
        <Ex en="If it rains tomorrow, I'll stay home." correct={true} />
        <Ex en="If I would have money, I'd buy a car." correct={false} />
        <Ex en="If I had money, I'd buy a car." correct={true} />
      </div>

      {/* Amber tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Key tip:</span> Never use <strong>will</strong> or <strong>would</strong> in the if-clause. Use present simple for zero/first conditionals and past simple for second conditionals — even though you are talking about the present or future.
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
