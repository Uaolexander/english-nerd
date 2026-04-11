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
  { q: "Zero conditional formula:", options: ["if + past, present", "if + present, will + verb", "if + present, present", "if + past, would + verb"], answer: 2 },
  { q: "First conditional formula:", options: ["if + present, present", "if + past, would + verb", "if + present, will + verb", "if + past, past"], answer: 2 },
  { q: "Zero conditional expresses:", options: ["Hypothetical situations", "General truths and facts", "Unlikely future events", "Past habits"], answer: 1 },
  { q: "First conditional expresses:", options: ["Impossible situations", "Past regrets", "Real/likely future possibilities", "General scientific facts"], answer: 2 },
  { q: "'If you heat ice, it ___.' (zero conditional)", options: ["will melt", "would melt", "melts", "melt"], answer: 2 },
  { q: "'If it ___ tomorrow, we'll cancel.' (first conditional)", options: ["rained", "rains", "would rain", "has rained"], answer: 1 },
  { q: "In the if-clause of first conditional, use:", options: ["will + verb", "would + verb", "present simple", "past simple"], answer: 2 },
  { q: "'If she ___ hard, she'll pass.' Correct form:", options: ["will study", "studied", "studies", "would study"], answer: 2 },
  { q: "Zero vs First: 'If you exercise, you feel better.' This is ___", options: ["First — real future", "Zero — general truth", "Second — hypothetical", "Third — past regret"], answer: 1 },
  { q: "Zero vs First: 'If it rains, I'll take an umbrella.' This is ___", options: ["Zero — fact", "First — real future", "Second — unlikely", "Third — regret"], answer: 1 },
  { q: "Can you use 'when' instead of 'if' in zero conditional?", options: ["No, never", "Yes, with same meaning", "Only in questions", "Only with negatives"], answer: 1 },
  { q: "'Unless you study, you ___ fail.' Unless = ___", options: ["if", "if not", "even if", "when"], answer: 1 },
  { q: "'If you ___ help, call me.' (zero or first?)", options: ["need — zero", "need — first", "needed — first", "will need — zero"], answer: 1 },
  { q: "Which is WRONG in the if-clause?", options: ["If it rains…", "If she studies…", "If he will come…", "If they leave early…"], answer: 2 },
  { q: "First conditional: negative result: 'If she doesn't hurry, she ___ miss the train.'", options: ["would", "might/will", "missed", "misses"], answer: 1 },
  { q: "'Metals ___ when heated.' Zero conditional:", options: ["will expand", "would expand", "expand", "expanded"], answer: 2 },
  { q: "'If I ___ free, I'll come to the party.' First conditional:", options: ["am", "was", "would be", "will be"], answer: 0 },
  { q: "Which uses zero conditional correctly?", options: ["If I was a bird, I'd fly.", "If you heat water, it boils.", "If it rains, I'll stay home.", "If she studies, she'd pass."], answer: 1 },
  { q: "Which uses first conditional correctly?", options: ["If he studied, he passes.", "If she works hard, she would succeed.", "If they leave now, they'll catch the bus.", "If water freezes, it expands."], answer: 2 },
  { q: "'___ it gets cold, the pipes freeze.' (general fact)", options: ["If", "When", "Both if/when", "Unless"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Zero & First Conditional",
  subtitle: "if + present → present | if + present → will",
  level: "B1",
  keyRule: "Zero: if + present, present (facts). First: if + present, will + infinitive (real future). Never use 'will' in the if-clause.",
  exercises: [
    {
      number: 1,
      title: "Zero Conditional: facts",
      difficulty: "Easy",
      instruction: "Complete the zero conditional (general truths).",
      questions: [
        "If you heat water to 100°C, it ___.",
        "Plants ___ if they don't get enough water.",
        "If you ___ ice, it melts.",
        "She always ___ a headache if sleepless.",
        "If you mix red and blue, you ___ purple.",
        "Metals ___ when you heat them.",
        "If I drink coffee late, I ___ sleep.",
        "If you ___ a dog, it trusts you.",
        "The engine ___ if there's no oil.",
        "If you ___ in the sun too long, you burn.",
      ],
    },
    {
      number: 2,
      title: "First Conditional: real future",
      difficulty: "Medium",
      instruction: "Complete the first conditional.",
      questions: [
        "If it rains tomorrow, we ___ stay inside.",
        "If she ___ hard, she'll pass the exam.",
        "We'll miss the train if we ___ leave now.",
        "If he calls, I ___ tell him the news.",
        "She ___ be angry if you forget her birthday.",
        "If they ___ the project, they'll get a bonus.",
        "If you don't eat, you ___ be hungry later.",
        "He'll be late if he ___ leave now.",
        "If I ___ time, I'll visit you this weekend.",
        "I ___ call you if I need help.",
      ],
    },
    {
      number: 3,
      title: "Zero or First Conditional?",
      difficulty: "Hard",
      instruction: "Choose the correct conditional type.",
      questions: [
        "Ice melts if you ___ it. (fact)",
        "If you ___ early, you'll get a seat. (future)",
        "Water ___ at 100°C. (fact)",
        "If I ___ tired, I go to bed. (habit/fact)",
        "If she ___, she'll feel better. (future)",
        "The alarm goes off if you ___ the wire. (fact)",
        "If he ___ the interview, he'll get the job.",
        "If you run fast, you ___ tired quickly. (fact)",
        "If it ___ warm, we'll have a barbecue.",
        "If plants don't get water, they ___. (fact)",
      ],
    },
    {
      number: 4,
      title: "First Conditional with unless/when",
      difficulty: "Harder",
      instruction: "Complete using if, unless, or when.",
      questions: [
        "___ you don't hurry, you'll be late.",
        "___ it rains, we'll stay inside.",
        "___ you study, you'll fail. (if not)",
        "I'll help you ___ you ask me.",
        "___ the weather is nice, we'll go out.",
        "She won't pass ___ she revises.",
        "___ I see him, I'll give him the message.",
        "He'll be upset ___ you forget.",
        "___ they arrive, we'll start eating.",
        "We won't go ___ it stops raining.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Zero conditional", answers: ["boils", "die", "heat", "gets", "get", "expand", "can't", "feed", "overheats", "stay"] },
    { exercise: 2, subtitle: "First conditional", answers: ["will", "studies", "don't", "will", "will", "finish", "will", "doesn't", "have", "will"] },
    { exercise: 3, subtitle: "Zero or first", answers: ["heat", "arrive", "boils", "feel", "exercises", "cut", "passes", "get", "gets", "die"] },
    { exercise: 4, subtitle: "unless/when/if", answers: ["If", "If", "Unless", "if", "If", "unless", "When", "if", "When", "unless"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "All Conditionals", href: "/grammar/b1/all-conditionals", level: "B1", badge: "bg-violet-500", reason: "See all three conditional types together" },
  { title: "Second Conditional", href: "/grammar/b1/second-conditional", level: "B1", badge: "bg-violet-500" },
  { title: "Modal Verbs: Possibility", href: "/grammar/b1/modal-possibility", level: "B1", badge: "bg-violet-500" },
];

export default function ZeroFirstConditionalLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Zero Conditional: facts and habits",
      instructions: "Choose the correct verb form to complete the zero conditional sentence (if + present simple, present simple).",
      questions: [
        { id: "e1q1", prompt: "If you heat water to 100°C, it ___.", options: ["boils", "will boil", "would boil"], correctIndex: 0, explanation: "Zero conditional = scientific fact → if + present, present: boils." },
        { id: "e1q2", prompt: "Plants ___ if they don't get enough water.", options: ["die", "will die", "would die"], correctIndex: 0, explanation: "General truth → present simple in both clauses." },
        { id: "e1q3", prompt: "If you ___ ice, it melts.", options: ["heat", "will heat", "heated"], correctIndex: 0, explanation: "Zero conditional → if + present simple." },
        { id: "e1q4", prompt: "She always ___ a headache if she doesn't sleep enough.", options: ["gets", "will get", "got"], correctIndex: 0, explanation: "Habitual result → zero conditional: gets." },
        { id: "e1q5", prompt: "If you mix red and blue, you ___ purple.", options: ["get", "will get", "would get"], correctIndex: 0, explanation: "Fact → zero conditional: get." },
        { id: "e1q6", prompt: "Metals ___ when you heat them.", options: ["expand", "will expand", "would expand"], correctIndex: 0, explanation: "Scientific law → present simple." },
        { id: "e1q7", prompt: "If I drink coffee late, I ___ sleep.", options: ["can't", "won't", "wouldn't"], correctIndex: 0, explanation: "Personal habitual fact → can't (present)." },
        { id: "e1q8", prompt: "If you ___ a dog, it trusts you.", options: ["feed", "will feed", "fed"], correctIndex: 0, explanation: "Zero conditional: general truth about dogs → feed." },
        { id: "e1q9", prompt: "The engine ___ if there's no oil.", options: ["overheats", "will overheat", "overheated"], correctIndex: 0, explanation: "Factual result → present simple: overheats." },
        { id: "e1q10", prompt: "If you ___ in the sun too long, you get sunburned.", options: ["stay", "will stay", "stayed"], correctIndex: 0, explanation: "Zero conditional → if + present simple." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Easy-Medium) — First Conditional: real future",
      instructions: "Choose the correct verb form to complete the first conditional sentence (if + present simple, will + infinitive).",
      questions: [
        { id: "e2q1", prompt: "If it rains tomorrow, we ___ stay inside.", options: ["will", "would", "are"], correctIndex: 0, explanation: "First conditional: real future possibility → will stay." },
        { id: "e2q2", prompt: "If she ___ hard, she'll pass the exam.", options: ["studies", "will study", "studied"], correctIndex: 0, explanation: "If-clause → present simple (not will): studies." },
        { id: "e2q3", prompt: "We'll miss the train if we ___ leave now.", options: ["don't", "won't", "didn't"], correctIndex: 0, explanation: "If-clause uses present simple → don't leave." },
        { id: "e2q4", prompt: "If he calls, I ___ tell him the news.", options: ["will", "would", "am"], correctIndex: 0, explanation: "First conditional result → will tell." },
        { id: "e2q5", prompt: "She ___ be angry if you forget her birthday.", options: ["will", "would", "is"], correctIndex: 0, explanation: "Likely future result → will be." },
        { id: "e2q6", prompt: "If they ___ the project, they'll get a bonus.", options: ["finish", "will finish", "finished"], correctIndex: 0, explanation: "If-clause → present simple: finish." },
        { id: "e2q7", prompt: "I'll lend you my car if you ___ careful.", options: ["are", "will be", "were"], correctIndex: 0, explanation: "Condition: present simple → are careful." },
        { id: "e2q8", prompt: "If the weather is good, we ___ have a picnic.", options: ["will", "would", "should"], correctIndex: 0, explanation: "Real future plan → will have." },
        { id: "e2q9", prompt: "He ___ get the job if he prepares well.", options: ["will", "would", "shall"], correctIndex: 0, explanation: "First conditional: real future → will get." },
        { id: "e2q10", prompt: "If you ___ your homework, you won't go out.", options: ["don't do", "won't do", "didn't do"], correctIndex: 0, explanation: "If-clause → present simple negative: don't do." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Zero or First Conditional?",
      instructions: "Choose the correct form. Think about whether it's a general fact (zero) or a specific future situation (first).",
      questions: [
        { id: "e3q1", prompt: "If you touch a hot stove, you ___ yourself.", options: ["burn", "will burn"], correctIndex: 0, explanation: "General scientific/physical fact → zero conditional: burn." },
        { id: "e3q2", prompt: "If you touch that stove tomorrow, you ___ yourself.", options: ["burn", "will burn"], correctIndex: 1, explanation: "Specific future warning → first conditional: will burn." },
        { id: "e3q3", prompt: "Plants grow better if they ___ enough sunlight.", options: ["get", "will get"], correctIndex: 0, explanation: "General truth → zero: get." },
        { id: "e3q4", prompt: "The plant will die if you ___ it water.", options: ["don't give", "won't give"], correctIndex: 0, explanation: "First conditional: specific warning → if + present: don't give." },
        { id: "e3q5", prompt: "If I eat too much, I always ___ ill.", options: ["feel", "will feel"], correctIndex: 0, explanation: "Personal habitual fact → zero: feel." },
        { id: "e3q6", prompt: "I ___ ill if I eat all that cake tonight.", options: ["feel", "will feel"], correctIndex: 1, explanation: "Specific future situation → first: will feel." },
        { id: "e3q7", prompt: "If water freezes, it ___ into ice.", options: ["turns", "will turn"], correctIndex: 0, explanation: "Physical law → zero: turns." },
        { id: "e3q8", prompt: "If it freezes tonight, the roads ___ icy.", options: ["are", "will be"], correctIndex: 1, explanation: "Specific future event → first: will be." },
        { id: "e3q9", prompt: "Babies cry if they ___ hungry.", options: ["are", "will be"], correctIndex: 0, explanation: "General truth about babies → zero: are." },
        { id: "e3q10", prompt: "The baby ___ cry if you wake her up.", options: ["cries", "will cry"], correctIndex: 1, explanation: "Specific future warning → first: will cry." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the correct form",
      instructions: "Write the correct form of the verb in brackets. Decide if it's zero or first conditional.",
      questions: [
        { id: "e4q1", prompt: "If you ___ (not / study), you will fail the test. (first)", correct: "don't study", explanation: "First conditional if-clause → present simple negative: don't study." },
        { id: "e4q2", prompt: "Ice ___ (melt) if the temperature rises above 0°C. (zero)", correct: "melts", explanation: "Scientific fact → zero conditional: melts." },
        { id: "e4q3", prompt: "If she ___ (call) me, I'll tell her the news. (first)", correct: "calls", explanation: "First conditional if-clause → present simple: calls." },
        { id: "e4q4", prompt: "If you press this button, the machine ___. (stop) (zero)", correct: "stops", explanation: "General mechanical fact → zero: stops." },
        { id: "e4q5", prompt: "We ___ (miss) the bus if we don't hurry. (first)", correct: "will miss", explanation: "First conditional result → will miss." },
        { id: "e4q6", prompt: "Dogs ___ (bark) if they hear strangers. (zero)", correct: "bark", explanation: "General truth → zero: bark." },
        { id: "e4q7", prompt: "If you ___ (leave) now, you'll catch the last train. (first)", correct: "leave", explanation: "First conditional if-clause → present simple: leave." },
        { id: "e4q8", prompt: "If I ___ (not / have) breakfast, I get a headache. (zero)", correct: "don't have", explanation: "Personal habitual fact → zero: don't have." },
        { id: "e4q9", prompt: "She ___ (be) upset if you forget her birthday. (first)", correct: "will be", explanation: "First conditional: specific future → will be." },
        { id: "e4q10", prompt: "If you ___ (mix) yellow and blue, you get green. (zero)", correct: "mix", explanation: "Scientific fact → zero: mix." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b1">Grammar B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Zero &amp; First Conditional</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Zero &amp;{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">First Conditional</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        <b>Zero conditional</b> (if + present, present) expresses general facts and habits: <i>If you heat water, it boils.</i> <b>First conditional</b> (if + present, will) expresses real, likely future situations: <i>If it rains, I'll stay home.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-zero-first-conditional" subject="Zero & First Conditional" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-b1-zero-first-conditional" subject="Zero & First Conditional" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/second-conditional" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Second Conditional →</a>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text?: string; color?: string; dim?: boolean }> }) {
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Zero &amp; First Conditional</h2>
        <p className="text-slate-500 text-sm">Facts &amp; habits vs real future possibilities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-3">Zero Conditional — General Truths</div>
          <Formula parts={[
            { text: "If", color: "slate" },
            { dim: true },
            { text: "Present Simple", color: "green" },
            { text: ",", color: "slate" },
            { text: "Present Simple", color: "green" },
          ]} />
          <div className="mt-4 space-y-2">
            <Ex en="If you heat water to 100°C, it boils." />
            <Ex en="Plants die if they don't get enough water." />
            <Ex en="If you mix red and blue, you get purple." />
          </div>
          <div className="mt-3 text-xs text-slate-500">Use: facts, scientific laws, general truths, habits. Always true.</div>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-3">First Conditional — Real Future</div>
          <Formula parts={[
            { text: "If", color: "slate" },
            { dim: true },
            { text: "Present Simple", color: "sky" },
            { text: ",", color: "slate" },
            { text: "will", color: "yellow" },
            { dim: true },
            { text: "verb", color: "slate" },
          ]} />
          <div className="mt-4 space-y-2">
            <Ex en="If it rains, I'll take an umbrella." />
            <Ex en="If she studies hard, she'll pass the exam." />
            <Ex en="We'll miss the train if we don't leave now." />
          </div>
          <div className="mt-3 text-xs text-slate-500">Use: real, likely future situations. The condition might actually happen.</div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black">!</span>
          <span className="font-black text-slate-900 text-sm">Quick Reference</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Type</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">If clause</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">Main clause</th>
                <th className="text-left py-2 font-black text-slate-700">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2 pr-4 font-semibold text-emerald-700">Zero</td>
                <td className="py-2 pr-4 text-slate-600">If + present simple</td>
                <td className="py-2 pr-4 text-slate-600">present simple</td>
                <td className="py-2 text-slate-600">General truths</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-semibold text-sky-700">First</td>
                <td className="py-2 pr-4 text-slate-600">If + present simple</td>
                <td className="py-2 pr-4 text-slate-600">will + verb</td>
                <td className="py-2 text-slate-600">Real future</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Common Mistake</div>
        <Ex en="If it will rain, I'll stay." correct={false} />
        <Ex en="If it rains, I'll stay." correct={true} />
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Remember:</span> NEVER use "will" in the if-clause of the first conditional. The if-clause always takes the present simple, even when talking about the future.
      </div>
    </div>
  );
}
