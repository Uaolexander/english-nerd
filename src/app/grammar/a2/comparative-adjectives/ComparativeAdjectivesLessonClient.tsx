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

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Superlative Adjectives", href: "/grammar/a2/superlative-adjectives", level: "A2", badge: "bg-emerald-600", reason: "The next step after comparatives" },
  { title: "Adverbs of Manner", href: "/grammar/a2/adverbs-manner", level: "A2", badge: "bg-emerald-600", reason: "Modify verbs just like adjectives modify nouns" },
  { title: "Conjunctions (and/but/because)", href: "/grammar/a2/conjunctions", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "old → comparative", options: ["more old", "oldest", "older", "oldier"], answer: 2 },
  { q: "beautiful → comparative", options: ["beautifuler", "more beautiful", "beautifuller", "beautiest"], answer: 1 },
  { q: "big → comparative", options: ["biger", "bigest", "more big", "bigger"], answer: 3 },
  { q: "happy → comparative", options: ["happyer", "more happy", "happiest", "happier"], answer: 3 },
  { q: "good → comparative", options: ["gooder", "more good", "better", "best"], answer: 2 },
  { q: "bad → comparative", options: ["badder", "more bad", "worst", "worse"], answer: 3 },
  { q: "thin → comparative", options: ["thiner", "more thin", "thinnest", "thinner"], answer: 3 },
  { q: "far → comparative", options: ["farer", "farther", "more far", "farest"], answer: 1 },
  { q: "hot → comparative", options: ["hoter", "more hot", "hottest", "hotter"], answer: 3 },
  { q: "easy → comparative", options: ["more easy", "easyier", "easiest", "easier"], answer: 3 },
  { q: "interesting → comparative", options: ["interestinger", "most interesting", "more interesting", "interestingier"], answer: 2 },
  { q: "tall → comparative", options: ["more tall", "tallest", "tallier", "taller"], answer: 3 },
  { q: "safe → comparative", options: ["safier", "more safe", "safest", "safer"], answer: 3 },
  { q: "busy → comparative", options: ["busyer", "more busy", "busiest", "busier"], answer: 3 },
  { q: "comfortable → comparative", options: ["comfortabler", "most comfortable", "more comfortable", "comfortablier"], answer: 2 },
  { q: "She is ___ than her sister. (tall)", options: ["more tall", "tallest", "tallier", "taller"], answer: 3 },
  { q: "little → comparative", options: ["littler", "least", "more little", "less"], answer: 3 },
  { q: "much → comparative", options: ["mucher", "most", "more", "morer"], answer: 2 },
  { q: "noisy → comparative", options: ["more noisy", "noisiest", "noisier", "noisyer"], answer: 2 },
  { q: "famous → comparative", options: ["famouser", "famousier", "famousest", "more famous"], answer: 3 },
];

export default function ComparativeAdjectivesLessonClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct comparative form",
      instructions: "Choose the correct comparative adjective.",
      questions: [
        { id: "e1q1", prompt: "old →", options: ["older", "more old", "most old"], correctIndex: 0, explanation: "Short adjective (1 syllable): add -er. old → older." },
        { id: "e1q2", prompt: "beautiful →", options: ["more beautiful", "beautifuler", "beautifuller"], correctIndex: 0, explanation: "Long adjective (3+ syllables): use more. more beautiful." },
        { id: "e1q3", prompt: "big →", options: ["bigger", "more big", "bigest"], correctIndex: 0, explanation: "CVC rule: double the final consonant. big → bigger." },
        { id: "e1q4", prompt: "happy →", options: ["happier", "more happy", "happyer"], correctIndex: 0, explanation: "Ends in consonant + y: change y → i, add -er. happy → happier." },
        { id: "e1q5", prompt: "expensive →", options: ["more expensive", "expensiver", "expensiveer"], correctIndex: 0, explanation: "Long adjective: use more. more expensive." },
        { id: "e1q6", prompt: "good →", options: ["better", "more good", "gooder"], correctIndex: 0, explanation: "Irregular comparative: good → better. Must be memorised." },
        { id: "e1q7", prompt: "bad →", options: ["worse", "badder", "more bad"], correctIndex: 0, explanation: "Irregular comparative: bad → worse. Must be memorised." },
        { id: "e1q8", prompt: "interesting →", options: ["more interesting", "interestinger", "most interesting"], correctIndex: 0, explanation: "Long adjective: more interesting." },
        { id: "e1q9", prompt: "thin →", options: ["thinner", "more thin", "thiner"], correctIndex: 0, explanation: "CVC rule: thin → thinner (double the n)." },
        { id: "e1q10", prompt: "far →", options: ["further", "farer", "more far"], correctIndex: 0, explanation: "Irregular: far → further (or farther). Both are correct." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the comparative form",
      instructions: "Write the comparative form of the adjective (e.g. taller, more modern). Do not include 'than'.",
      questions: [
        { id: "e2q1", prompt: "tall →", correct: "taller", explanation: "Short: tall → taller." },
        { id: "e2q2", prompt: "modern →", correct: "more modern", explanation: "2-syllable ending in -ern: more modern." },
        { id: "e2q3", prompt: "hot →", correct: "hotter", explanation: "CVC: hot → hotter (double the t)." },
        { id: "e2q4", prompt: "difficult →", correct: "more difficult", explanation: "Long adjective: more difficult." },
        { id: "e2q5", prompt: "young →", correct: "younger", explanation: "Short: young → younger." },
        { id: "e2q6", prompt: "lazy →", correct: "lazier", explanation: "Consonant + y: lazy → lazier." },
        { id: "e2q7", prompt: "comfortable →", correct: "more comfortable", explanation: "Long adjective: more comfortable." },
        { id: "e2q8", prompt: "safe →", correct: "safer", explanation: "Ends in -e: add -r only. safe → safer." },
        { id: "e2q9", prompt: "busy →", correct: "busier", explanation: "Consonant + y: busy → busier." },
        { id: "e2q10", prompt: "famous →", correct: "more famous", explanation: "2-syllable ending in -ous: more famous." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Complete the sentence",
      instructions: "Choose the correct comparative form to complete each sentence.",
      questions: [
        { id: "e3q1", prompt: "My new car is ___ than my old one.", options: ["faster", "more fast", "most fast"], correctIndex: 0, explanation: "Short adjective: fast → faster." },
        { id: "e3q2", prompt: "This book is ___ than the film.", options: ["more interesting", "interestinger", "most interesting"], correctIndex: 0, explanation: "Long adjective: more interesting." },
        { id: "e3q3", prompt: "She speaks English ___ than her sister.", options: ["more good", "gooder", "better"], correctIndex: 2, explanation: "Irregular: good → better." },
        { id: "e3q4", prompt: "Today is even ___ than yesterday.", options: ["hotter", "more hot", "hottest"], correctIndex: 0, explanation: "CVC: hot → hotter." },
        { id: "e3q5", prompt: "The second exam was ___ the first.", options: ["easier than", "more easy than", "easiest than"], correctIndex: 0, explanation: "Consonant + y: easy → easier than." },
        { id: "e3q6", prompt: "His second novel was ___ his first.", options: ["badder than", "more bad than", "worse than"], correctIndex: 2, explanation: "Irregular: bad → worse than." },
        { id: "e3q7", prompt: "This flat is ___ the one we saw yesterday.", options: ["more expensive than", "expensiver than", "most expensive than"], correctIndex: 0, explanation: "Long adjective: more expensive than." },
        { id: "e3q8", prompt: "Cities are getting ___ every year.", options: ["noisier", "more noisy", "noisiest"], correctIndex: 0, explanation: "Consonant + y: noisy → noisier." },
        { id: "e3q9", prompt: "He's ___ he looks.", options: ["older than", "more old than", "oldest than"], correctIndex: 0, explanation: "Short adjective: old → older than." },
        { id: "e3q10", prompt: "This new design is ___ the original.", options: ["more creative than", "creativer than", "most creative than"], correctIndex: 0, explanation: "3-syllable adjective: more creative than." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write comparative + than",
      instructions: "Write the correct comparative form + than (e.g. heavier than, more patient than).",
      questions: [
        { id: "e4q1", prompt: "This bag is ___ (heavy) the one I had before.", correct: "heavier than", explanation: "Consonant + y: heavy → heavier than." },
        { id: "e4q2", prompt: "She is ___ (patient) her brother.", correct: "more patient than", explanation: "2-syllable adjective: more patient than." },
        { id: "e4q3", prompt: "The new phone is ___ (expensive) the old model.", correct: "more expensive than", explanation: "Long adjective: more expensive than." },
        { id: "e4q4", prompt: "He runs ___ (fast) anyone else in the team.", correct: "faster than", explanation: "Short adjective: faster than." },
        { id: "e4q5", prompt: "My results were ___ (bad) I expected.", correct: "worse than", explanation: "Irregular: bad → worse than." },
        { id: "e4q6", prompt: "Today's weather is ___ (warm) yesterday.", correct: "warmer than", explanation: "Short adjective: warm → warmer than." },
        { id: "e4q7", prompt: "This exercise is ___ (difficult) the previous one.", correct: "more difficult than", explanation: "Long adjective: more difficult than." },
        { id: "e4q8", prompt: "She looks ___ (happy) she did last year.", correct: "happier than", explanation: "Consonant + y: happy → happier than." },
        { id: "e4q9", prompt: "The traffic today is ___ (bad) usual.", correct: "worse than", explanation: "Irregular: bad → worse than." },
        { id: "e4q10", prompt: "This hotel is ___ (comfortable) the last one we stayed in.", correct: "more comfortable than", explanation: "Long adjective: more comfortable than." },
      ],
    },
  }), []);

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

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Comparative Adjectives",
        subtitle: "-er / more — 4 exercises + answer key",
        level: "A2",
        keyRule: "Short adjectives: add -er. Long adjectives: more + adj. Always use 'than' after the comparative.",
        exercises: [
          { number: 1, title: "Exercise 1", difficulty: "Easy", instruction: "Choose the correct comparative form.", questions: [
            "old → ___ (older / more old / most old)",
            "beautiful → ___ (more beautiful / beautifuler / beautifuller)",
            "big → ___ (bigger / more big / bigest)",
            "happy → ___ (happier / more happy / happyer)",
            "expensive → ___ (more expensive / expensiver / expensiveer)",
            "good → ___ (better / more good / gooder)",
            "bad → ___ (worse / badder / more bad)",
            "interesting → ___ (more interesting / interestinger / most interesting)",
            "thin → ___ (thinner / more thin / thiner)",
            "far → ___ (further / farer / more far)",
          ]},
          { number: 2, title: "Exercise 2", difficulty: "Medium", instruction: "Write the comparative form. Do not include 'than'.", questions: [
            "tall → ___",
            "modern → ___",
            "hot → ___",
            "difficult → ___",
            "young → ___",
            "lazy → ___",
            "comfortable → ___",
            "safe → ___",
            "busy → ___",
            "famous → ___",
          ]},
          { number: 3, title: "Exercise 3", difficulty: "Hard", instruction: "Choose the correct comparative to complete the sentence.", questions: [
            "My new car is ___ than my old one. (faster / more fast / most fast)",
            "This book is ___ than the film. (more interesting / interestinger / most interesting)",
            "She speaks English ___ than her sister. (more good / gooder / better)",
            "Today is even ___ than yesterday. (hotter / more hot / hottest)",
            "The second exam was ___ the first. (easier than / more easy than / easiest than)",
            "His second novel was ___ his first. (badder than / more bad than / worse than)",
            "This flat is ___ the one we saw yesterday. (more expensive than / expensiver than / most expensive than)",
            "Cities are getting ___ every year. (noisier / more noisy / noisiest)",
            "He's ___ he looks. (older than / more old than / oldest than)",
            "This design is ___ the original. (more creative than / creativer than / most creative than)",
          ]},
          { number: 4, title: "Exercise 4", difficulty: "Harder", instruction: "Write comparative + than (e.g. heavier than, more patient than).", questions: [
            "This bag is ___ (heavy) the one I had before.",
            "She is ___ (patient) her brother.",
            "The new phone is ___ (expensive) the old model.",
            "He runs ___ (fast) anyone else in the team.",
            "My results were ___ (bad) I expected.",
            "Today's weather is ___ (warm) yesterday.",
            "This exercise is ___ (difficult) the previous one.",
            "She looks ___ (happy) she did last year.",
            "The traffic today is ___ (bad) usual.",
            "This hotel is ___ (comfortable) the last one we stayed in.",
          ]},
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — comparative forms", answers: ["older","more beautiful","bigger","happier","more expensive","better","worse","more interesting","thinner","further"] },
          { exercise: 2, subtitle: "Medium — write comparative", answers: ["taller","more modern","hotter","more difficult","younger","lazier","more comfortable","safer","busier","more famous"] },
          { exercise: 3, subtitle: "Hard — complete the sentence", answers: ["faster","more interesting","better","hotter","easier than","worse than","more expensive than","noisier","older than","more creative than"] },
          { exercise: 4, subtitle: "Harder — comparative + than", answers: ["heavier than","more patient than","more expensive than","faster than","worse than","warmer than","more difficult than","happier than","worse than","more comfortable than"] },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Comparative Adjectives</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Comparative Adjectives{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">-er / more</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use comparative adjectives to compare two people or things. Short adjectives add <b>-er + than</b>. Long adjectives use <b>more + adjective + than</b>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a2-comparative-adjectives" subject="Comparative Adjectives" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-a2-comparative-adjectives" subject="Comparative Adjectives" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/superlative-adjectives" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Superlative adjectives →</a>
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Comparative Adjectives</h2>
        <p className="text-slate-500 text-sm">Used to compare two people, things or ideas. Always use <strong>than</strong> after the comparative.</p>
      </div>

      {/* Formula */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
        <div className="text-xs font-black uppercase tracking-wide text-emerald-700 mb-2">✅ Structure</div>
        <Formula parts={[
          {text:"Subject"},{dim:true,text:"+"},{text:"to be"},{dim:true,text:"+"},
          {text:"adjective-er / more + adj",color:"green"},{dim:true,text:"+"},{text:"than",color:"yellow"},{dim:true,text:"+"},{text:"noun"}
        ]} />
        <div className="mt-3 space-y-2">
          <Ex en="She is taller than her sister." />
          <Ex en="This phone is more expensive than mine." />
        </div>
      </div>

      {/* Formation rules */}
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: "Short (1 syllable) → add -er", color: "border-emerald-200 from-emerald-50", labelColor: "text-emerald-700", ex: "tall→taller, fast→faster, old→older" },
          { label: "Ends in -e → add -r only", color: "border-sky-200 from-sky-50", labelColor: "text-sky-700", ex: "nice→nicer, large→larger, safe→safer" },
          { label: "CVC short vowel → double + -er", color: "border-violet-200 from-violet-50", labelColor: "text-violet-700", ex: "big→bigger, hot→hotter, thin→thinner" },
          { label: "-y ending → change to -ier", color: "border-orange-200 from-orange-50", labelColor: "text-orange-700", ex: "happy→happier, easy→easier, busy→busier" },
        ].map(({ label, color, labelColor, ex }) => (
          <div key={label} className={`rounded-2xl border-2 bg-gradient-to-b to-white p-4 ${color}`}>
            <div className={`text-xs font-black uppercase tracking-wide mb-2 ${labelColor}`}>{label}</div>
            <div className="text-sm text-slate-600 italic">{ex}</div>
          </div>
        ))}
      </div>

      {/* 2+ syllables */}
      <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
        <div className="text-xs font-black uppercase tracking-wide text-sky-700 mb-2">📏 2+ Syllables → more + adjective</div>
        <Formula parts={[{text:"more",color:"sky"},{dim:true,text:"+"},{text:"beautiful / expensive / interesting"}]} />
        <div className="mt-3 space-y-2">
          <Ex en="This film is more interesting than that one." />
          <Ex en="She is more tall than me." correct={false} />
          <Ex en="She is taller than me." />
        </div>
      </div>

      {/* Irregular forms table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</div>
          <span className="font-bold text-slate-800">Irregular Forms — Must Memorise</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-slate-50">
                <th className="text-left py-2 px-3 font-bold text-slate-600">Base</th>
                <th className="text-left py-2 px-3 font-bold text-slate-600">Comparative</th>
                <th className="text-left py-2 px-3 font-bold text-slate-600">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["good","better","She is better at tennis."],
                ["bad","worse","The weather is worse today."],
                ["far","further / farther","The shop is further than I thought."],
                ["little","less","I have less time now."],
                ["much / many","more","She has more experience."],
              ].map(([base, comp, ex]) => (
                <tr key={base}>
                  <td className="py-2 px-3 italic text-slate-500">{base}</td>
                  <td className="py-2 px-3 font-black text-slate-900">{comp}</td>
                  <td className="py-2 px-3 text-slate-600">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> Use <strong>than</strong> (not "then") when comparing — <em>"She is taller than me."</em> NOT <em>"She is taller then me."</em>
      </div>
    </div>
  );
}
