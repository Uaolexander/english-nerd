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
  { title: "Comparative Adjectives", href: "/grammar/a2/comparative-adjectives", level: "A2", badge: "bg-emerald-600", reason: "Superlatives build directly on comparatives" },
  { title: "Adverbs of Manner", href: "/grammar/a2/adverbs-manner", level: "A2", badge: "bg-emerald-600", reason: "Use adverbs alongside adjectives to describe things" },
  { title: "The Definite Article", href: "/grammar/a2/articles-the", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "tall →", options: ["the tallest", "the most tall", "the taller", "tallest"], answer: 0 },
  { q: "beautiful →", options: ["the beautifulest", "the most beautiful", "the beautifuller", "most beautiful"], answer: 1 },
  { q: "big →", options: ["the bigest", "the most big", "the biggest", "the biger"], answer: 2 },
  { q: "happy →", options: ["the most happy", "the happyest", "the happiest", "the hapiest"], answer: 2 },
  { q: "good →", options: ["the most good", "the goodest", "the gooder", "the best"], answer: 3 },
  { q: "bad →", options: ["the most bad", "the baddest", "the worst", "the badder"], answer: 2 },
  { q: "hot →", options: ["the most hot", "the hotest", "the hotter", "the hottest"], answer: 3 },
  { q: "interesting →", options: ["the interestingest", "the most interesting", "the interestingst", "most interesting"], answer: 1 },
  { q: "far →", options: ["the farrest", "the most far", "the furthest", "the farther"], answer: 2 },
  { q: "cold →", options: ["the coldest", "the most cold", "the colder", "the colddest"], answer: 0 },
  { q: "popular →", options: ["the popularest", "the most popular", "the popularst", "most popular"], answer: 1 },
  { q: "thin →", options: ["the thinest", "the most thin", "the thiner", "the thinnest"], answer: 3 },
  { q: "lazy →", options: ["the most lazy", "the lazyest", "the laziest", "the lazier"], answer: 2 },
  { q: "comfortable →", options: ["the comfortablest", "the most comfortable", "the comfortabler", "most comfortable"], answer: 1 },
  { q: "large →", options: ["the larggest", "the most large", "the larger", "the largest"], answer: 3 },
  { q: "difficult →", options: ["the difficultest", "the most difficult", "the difficulter", "most difficult"], answer: 1 },
  { q: "young →", options: ["the most young", "the younger", "the youngest", "the younguest"], answer: 2 },
  { q: "busy →", options: ["the most busy", "the busyest", "the busiest", "the busier"], answer: 2 },
  { q: "expensive →", options: ["the expensivest", "the most expensivest", "the most expensive", "the expensiver"], answer: 2 },
  { q: "creative →", options: ["the creativest", "the most creative", "the creativeest", "the creatively"], answer: 1 },
];

export default function SuperlativeAdjectivesLessonClient() {
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
      title: "Exercise 1 (Easy) — Choose the correct superlative form",
      instructions: "Choose the correct superlative form of the adjective.",
      questions: [
        { id: "e1q1", prompt: "tall →", options: ["the tallest", "the most tall", "the taller"], correctIndex: 0, explanation: "Short adjective: the + adj + -est. tall → the tallest." },
        { id: "e1q2", prompt: "beautiful →", options: ["the most beautiful", "the beautifulest", "the beautifuller"], correctIndex: 0, explanation: "Long adjective: the most beautiful." },
        { id: "e1q3", prompt: "big →", options: ["the biggest", "the most big", "the bigest"], correctIndex: 0, explanation: "CVC: double the g. big → the biggest." },
        { id: "e1q4", prompt: "happy →", options: ["the happiest", "the most happy", "the happyest"], correctIndex: 0, explanation: "Consonant + y: y → i + est. happy → the happiest." },
        { id: "e1q5", prompt: "expensive →", options: ["the most expensive", "the expensivest", "the most expensivest"], correctIndex: 0, explanation: "Long adjective: the most expensive." },
        { id: "e1q6", prompt: "good →", options: ["the best", "the most good", "the goodest"], correctIndex: 0, explanation: "Irregular: good → the best." },
        { id: "e1q7", prompt: "bad →", options: ["the worst", "the baddest", "the most bad"], correctIndex: 0, explanation: "Irregular: bad → the worst." },
        { id: "e1q8", prompt: "hot →", options: ["the hottest", "the most hot", "the hotest"], correctIndex: 0, explanation: "CVC: double the t. hot → the hottest." },
        { id: "e1q9", prompt: "interesting →", options: ["the most interesting", "the interestingest", "the interestingst"], correctIndex: 0, explanation: "Long adjective: the most interesting." },
        { id: "e1q10", prompt: "far →", options: ["the furthest", "the farrest", "the most far"], correctIndex: 0, explanation: "Irregular: far → the furthest (or farthest)." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the superlative form",
      instructions: "Write the full superlative form, including 'the' (e.g. the tallest, the most popular).",
      questions: [
        { id: "e2q1", prompt: "cold →", correct: "the coldest", explanation: "Short: cold → the coldest." },
        { id: "e2q2", prompt: "popular →", correct: "the most popular", explanation: "3-syllable: the most popular." },
        { id: "e2q3", prompt: "thin →", correct: "the thinnest", explanation: "CVC: double the n. thin → the thinnest." },
        { id: "e2q4", prompt: "lazy →", correct: "the laziest", explanation: "Consonant + y: lazy → the laziest." },
        { id: "e2q5", prompt: "good →", correct: "the best", explanation: "Irregular: good → the best." },
        { id: "e2q6", prompt: "bad →", correct: "the worst", explanation: "Irregular: bad → the worst." },
        { id: "e2q7", prompt: "comfortable →", correct: "the most comfortable", explanation: "Long: the most comfortable." },
        { id: "e2q8", prompt: "busy →", correct: "the busiest", explanation: "Consonant + y: busy → the busiest." },
        { id: "e2q9", prompt: "large →", correct: "the largest", explanation: "Ends in -e: add -st only. large → the largest." },
        { id: "e2q10", prompt: "difficult →", correct: "the most difficult", explanation: "Long: the most difficult." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Complete the sentence",
      instructions: "Choose the correct superlative form to complete each sentence.",
      questions: [
        { id: "e3q1", prompt: "It's ___ (cold) day of the year — it's -15°C!", options: ["the coldest", "the most cold", "coldest"], correctIndex: 0, explanation: "Short: the coldest. Always use 'the' with superlatives." },
        { id: "e3q2", prompt: "She is ___ (good) player on the whole team.", options: ["the best", "the most good", "the gooder"], correctIndex: 0, explanation: "Irregular: good → the best." },
        { id: "e3q3", prompt: "This is ___ (expensive) restaurant in the city.", options: ["the most expensive", "the expensivest", "the more expensive"], correctIndex: 0, explanation: "Long: the most expensive." },
        { id: "e3q4", prompt: "He made ___ (bad) decision of his career.", options: ["the worst", "the baddest", "the most bad"], correctIndex: 0, explanation: "Irregular: bad → the worst." },
        { id: "e3q5", prompt: "That was ___ (interesting) film I've ever seen.", options: ["the most interesting", "the interestingest", "the more interesting"], correctIndex: 0, explanation: "Long: the most interesting." },
        { id: "e3q6", prompt: "Mount Everest is ___ (high) mountain in the world.", options: ["the highest", "the most high", "the higher"], correctIndex: 0, explanation: "Short: high → the highest." },
        { id: "e3q7", prompt: "This is ___ (happy) day of my life!", options: ["the happiest", "the most happy", "the happyest"], correctIndex: 0, explanation: "Consonant + y: happy → the happiest." },
        { id: "e3q8", prompt: "She's ___ (creative) student in the class.", options: ["the most creative", "the creativest", "the creativeest"], correctIndex: 0, explanation: "Ends in -e, 3 syllables: the most creative." },
        { id: "e3q9", prompt: "He is ___ (lazy) person I've ever met.", options: ["the laziest", "the most lazy", "the lazyest"], correctIndex: 0, explanation: "Consonant + y: lazy → the laziest." },
        { id: "e3q10", prompt: "That's ___ (far) I've ever run.", options: ["the furthest", "the farrest", "the most far"], correctIndex: 0, explanation: "Irregular: far → the furthest (or farthest)." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the full superlative phrase",
      instructions: "Write the correct superlative form including 'the' (e.g. the oldest, the most comfortable).",
      questions: [
        { id: "e4q1", prompt: "She's ___ (old) of the three sisters.", correct: "the oldest", explanation: "Short: old → the oldest." },
        { id: "e4q2", prompt: "That's ___ (bad) film I've ever watched.", correct: "the worst", explanation: "Irregular: bad → the worst." },
        { id: "e4q3", prompt: "This is ___ (comfortable) chair in the office.", correct: "the most comfortable", explanation: "Long: the most comfortable." },
        { id: "e4q4", prompt: "He's ___ (young) player ever to win the championship.", correct: "the youngest", explanation: "Short: young → the youngest." },
        { id: "e4q5", prompt: "It was ___ (hot) summer on record.", correct: "the hottest", explanation: "CVC: hot → the hottest (double the t)." },
        { id: "e4q6", prompt: "That's ___ (good) idea you've had all week.", correct: "the best", explanation: "Irregular: good → the best." },
        { id: "e4q7", prompt: "This is ___ (big) pizza I've ever eaten.", correct: "the biggest", explanation: "CVC: big → the biggest (double the g)." },
        { id: "e4q8", prompt: "He's ___ (popular) teacher in the whole school.", correct: "the most popular", explanation: "3-syllable: the most popular." },
        { id: "e4q9", prompt: "It's ___ (thin) phone currently on the market.", correct: "the thinnest", explanation: "CVC: thin → the thinnest (double the n)." },
        { id: "e4q10", prompt: "That was ___ (beautiful) sunset I've ever seen.", correct: "the most beautiful", explanation: "Long: the most beautiful." },
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

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Superlative Adjectives",
        subtitle: "the -est / the most — 4 exercises + answer key",
        level: "A2",
        keyRule: "Short adjectives: the + -est (the tallest). Long adjectives: the most + adj (the most beautiful). Irregular: good→the best, bad→the worst, far→the furthest.",
        exercises: [
          {
            number: 1,
            title: "Exercise 1",
            difficulty: "Easy",
            instruction: "Choose the correct superlative form.",
            questions: [
              "tall → ___",
              "beautiful → ___",
              "big → ___",
              "happy → ___",
              "expensive → ___",
              "good → ___",
              "bad → ___",
              "hot → ___",
              "interesting → ___",
              "far → ___",
            ],
            hint: "the tallest / the most beautiful / the biggest / the happiest / the most expensive / the best / the worst / the hottest / the most interesting / the furthest",
          },
          {
            number: 2,
            title: "Exercise 2",
            difficulty: "Medium",
            instruction: "Write the full superlative form including 'the'.",
            questions: [
              "cold → ___",
              "popular → ___",
              "thin → ___",
              "lazy → ___",
              "good → ___",
              "bad → ___",
              "comfortable → ___",
              "busy → ___",
              "large → ___",
              "difficult → ___",
            ],
          },
          {
            number: 3,
            title: "Exercise 3",
            difficulty: "Harder",
            instruction: "Choose the correct superlative form to complete the sentence.",
            questions: [
              "It's ___ (cold) day of the year — it's -15°C!",
              "She is ___ (good) player on the whole team.",
              "This is ___ (expensive) restaurant in the city.",
              "He made ___ (bad) decision of his career.",
              "That was ___ (interesting) film I've ever seen.",
              "Mount Everest is ___ (high) mountain in the world.",
              "This is ___ (happy) day of my life!",
              "She's ___ (creative) student in the class.",
              "He is ___ (lazy) person I've ever met.",
              "That's ___ (far) I've ever run.",
            ],
          },
          {
            number: 4,
            title: "Exercise 4",
            difficulty: "Hardest",
            instruction: "Write the correct superlative form including 'the'.",
            questions: [
              "She's ___ (old) of the three sisters.",
              "That's ___ (bad) film I've ever watched.",
              "This is ___ (comfortable) chair in the office.",
              "He's ___ (young) player ever to win the championship.",
              "It was ___ (hot) summer on record.",
              "That's ___ (good) idea you've had all week.",
              "This is ___ (big) pizza I've ever eaten.",
              "He's ___ (popular) teacher in the whole school.",
              "It's ___ (thin) phone currently on the market.",
              "That was ___ (beautiful) sunset I've ever seen.",
            ],
          },
        ],
        answerKey: [
          {
            exercise: 1,
            subtitle: "Easy — choose the superlative",
            answers: ["the tallest", "the most beautiful", "the biggest", "the happiest", "the most expensive", "the best", "the worst", "the hottest", "the most interesting", "the furthest"],
          },
          {
            exercise: 2,
            subtitle: "Medium — write the superlative",
            answers: ["the coldest", "the most popular", "the thinnest", "the laziest", "the best", "the worst", "the most comfortable", "the busiest", "the largest", "the most difficult"],
          },
          {
            exercise: 3,
            subtitle: "Harder — complete the sentence",
            answers: ["the coldest", "the best", "the most expensive", "the worst", "the most interesting", "the highest", "the happiest", "the most creative", "the laziest", "the furthest"],
          },
          {
            exercise: 4,
            subtitle: "Hardest — write the full superlative",
            answers: ["the oldest", "the worst", "the most comfortable", "the youngest", "the hottest", "the best", "the biggest", "the most popular", "the thinnest", "the most beautiful"],
          },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Superlative Adjectives</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Superlative Adjectives{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">the -est / the most</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use superlative adjectives to say something is the <b>highest degree</b> in a group. Short adjectives: <b>the + -est</b>. Long adjectives: <b>the most</b>. Always use <b>the</b> before a superlative.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a2-superlative-adjectives" subject="Superlative Adjectives" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className=""><AdUnit variant="sidebar-dark" /></div>
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

        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/a2" allLabel="All A2 topics" />
        ) : (
          <AdUnit variant="sidebar-light" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-superlative-adjectives" subject="Superlative Adjectives" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/articles-the" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Articles: a / an / the →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Superlative Adjectives (A2)</h2>
      <p>Superlative adjectives compare <b>one thing to the whole group</b> — it is the highest degree. Always use <b>the</b> before a superlative. Often followed by <b>in</b> (place/group) or <b>of</b> (time/set).</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Rules at a glance</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { rule: "Short (1 syllable): the + adj + -est", ex: "tall → the tallest, cold → the coldest" },
            { rule: "Ends in -e: the + adj + -st", ex: "nice → the nicest, large → the largest" },
            { rule: "CVC: double consonant + -est", ex: "big → the biggest, hot → the hottest" },
            { rule: "Consonant + y: the + adj(y→i) + -est", ex: "happy → the happiest, busy → the busiest" },
            { rule: "Long (2+ syllables): the most + adj", ex: "beautiful → the most beautiful" },
            { rule: "Irregular forms", ex: "good → the best, bad → the worst, far → the furthest" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-sm font-bold text-slate-800">{rule}</div>
              <div className="mt-1 text-sm text-slate-500 italic">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      <h3>Comparative vs Superlative</h3>
      <div className="not-prose overflow-x-auto rounded-2xl border border-black/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-slate-50">
              <th className="px-4 py-3 text-left font-bold text-slate-700">Adjective</th>
              <th className="px-4 py-3 text-left font-bold text-slate-700">Comparative</th>
              <th className="px-4 py-3 text-left font-bold text-slate-700">Superlative</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {[
              ["tall", "taller", "the tallest"],
              ["big", "bigger", "the biggest"],
              ["happy", "happier", "the happiest"],
              ["beautiful", "more beautiful", "the most beautiful"],
              ["good", "better", "the best"],
              ["bad", "worse", "the worst"],
            ].map(([adj, comp, sup]) => (
              <tr key={adj} className="bg-white even:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-800">{adj}</td>
                <td className="px-4 py-3 text-slate-600 italic">{comp}</td>
                <td className="px-4 py-3 text-slate-900 font-semibold">{sup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">Key rule:</span> Always use <b>the</b> with superlatives — never omit it. <i className="text-red-600">She is best student.</i> ❌ → <i className="text-emerald-700">She is <b>the</b> best student.</i> ✅
        </div>
      </div>
    </div>
  );
}
