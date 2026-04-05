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
  { title: "Comparative Adjectives", href: "/grammar/a2/comparative-adjectives", level: "A2", badge: "bg-emerald-600", reason: "Compare things using adjectives — a natural next step" },
  { title: "Superlative Adjectives", href: "/grammar/a2/superlative-adjectives", level: "A2", badge: "bg-emerald-600", reason: "Express the highest degree with superlatives" },
  { title: "Conjunctions (and/but/because)", href: "/grammar/a2/conjunctions", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "slow → adverb", options: ["slow", "slowly", "slowy", "slowly"], answer: 1 },
  { q: "careful → adverb", options: ["careful", "carfully", "carefully", "carefuly"], answer: 2 },
  { q: "happy → adverb", options: ["happily", "happyly", "happily", "happly"], answer: 0 },
  { q: "good → adverb", options: ["goodly", "good", "goody", "well"], answer: 3 },
  { q: "fast → adverb", options: ["fastly", "fasty", "fast", "fasted"], answer: 2 },
  { q: "hard → adverb (= with effort)", options: ["hardly", "hard", "hardily", "harded"], answer: 1 },
  { q: "beautiful → adverb", options: ["beautiful", "beautifuly", "beautifully", "beautfully"], answer: 2 },
  { q: "She speaks English very ___. (good)", options: ["good", "goodly", "betterly", "well"], answer: 3 },
  { q: "He runs very ___. (fast)", options: ["fastly", "faster", "fast", "fasted"], answer: 2 },
  { q: "quiet → adverb", options: ["quietful", "quieter", "quieting", "quietly"], answer: 3 },
  { q: "angry → adverb", options: ["angrily", "angryly", "angerly", "angry"], answer: 0 },
  { q: "She is a ___ driver. (adjective or adverb?)", options: ["carefully", "careful", "carely", "caredom"], answer: 1 },
  { q: "He drives very ___. (adjective or adverb?)", options: ["careful", "carefull", "carefully", "care"], answer: 2 },
  { q: "automatic → adverb", options: ["automaticly", "automaticaly", "automatically", "automaticful"], answer: 2 },
  { q: "easy → adverb", options: ["easly", "easyly", "easily", "easy"], answer: 2 },
  { q: "loud → adverb", options: ["loudly", "loudy", "louden", "loudful"], answer: 0 },
  { q: "correct → adverb", options: ["correctful", "corectly", "correctly", "corrected"], answer: 2 },
  { q: "warm → adverb", options: ["warmful", "warmly", "warmy", "warmily"], answer: 1 },
  { q: "polite → adverb", options: ["politly", "politely", "politely", "politeish"], answer: 1 },
  { q: "'Hardly' means ___", options: ["very much", "with effort", "almost not", "quickly"], answer: 2 },
];

export default function AdverbsMannerLessonClient() {
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
      title: "Exercise 1 (Easy) — Choose the correct adverb",
      instructions: "Choose the correct adverb of manner to complete each sentence.",
      questions: [
        { id: "e1q1", prompt: "She speaks French very ___.", options: ["fluent", "fluence", "fluently"], correctIndex: 2, explanation: "fluent (adj) → fluently (adv): add -ly" },
        { id: "e1q2", prompt: "He drives very ___.", options: ["careful", "care", "carefully"], correctIndex: 2, explanation: "careful (adj) → carefully (adv): add -ly" },
        { id: "e1q3", prompt: "The children played ___ in the garden.", options: ["happy", "happiness", "happily"], correctIndex: 2, explanation: "happy → happily: change y to i, add -ly" },
        { id: "e1q4", prompt: "She sings ___.", options: ["beautiful", "beauty", "beautifully"], correctIndex: 2, explanation: "beautiful → beautifully: add -ly" },
        { id: "e1q5", prompt: "He runs very ___.", options: ["fastly", "faster", "fast"], correctIndex: 2, explanation: "fast is already an adverb — no -ly form!" },
        { id: "e1q6", prompt: "They worked very ___ all week.", options: ["hardly", "hardness", "hard"], correctIndex: 2, explanation: "hard is already an adverb. 'Hardly' means 'almost not' — completely different!" },
        { id: "e1q7", prompt: "She answered the question ___.", options: ["correct", "correction", "correctly"], correctIndex: 2, explanation: "correct (adj) → correctly (adv): add -ly" },
        { id: "e1q8", prompt: "He spoke ___ and everyone in the room heard him.", options: ["loud", "loudly", "louder"], correctIndex: 1, explanation: "loud (adj) → loudly (adv): add -ly" },
        { id: "e1q9", prompt: "She plays tennis very ___.", options: ["good", "goodly", "well"], correctIndex: 2, explanation: "good (adj) → well (adv): irregular form!" },
        { id: "e1q10", prompt: "The dog barked ___ at the stranger.", options: ["angry", "anger", "angrily"], correctIndex: 2, explanation: "angry → angrily: change y to i, add -ly" },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the adverb form",
      instructions: "Write the adverb of manner. The adjective is given in brackets.",
      questions: [
        { id: "e2q1", prompt: "She walks very (slow) ___.", correct: "slowly", explanation: "slow → slowly" },
        { id: "e2q2", prompt: "He answered (polite) ___.", correct: "politely", explanation: "polite → politely (keep the e, add -ly)" },
        { id: "e2q3", prompt: "She sings (beautiful) ___.", correct: "beautifully", explanation: "beautiful → beautifully" },
        { id: "e2q4", prompt: "He drives (careful) ___.", correct: "carefully", explanation: "careful → carefully" },
        { id: "e2q5", prompt: "They won the game (easy) ___.", correct: "easily", explanation: "easy → easily: change y to i, add -ly" },
        { id: "e2q6", prompt: "She smiled (warm) ___.", correct: "warmly", explanation: "warm → warmly" },
        { id: "e2q7", prompt: "He plays the guitar (good) ___.", correct: "well", explanation: "good → well (irregular adverb)" },
        { id: "e2q8", prompt: "They worked very (hard) ___.", correct: "hard", explanation: "hard → hard (same form for adjective and adverb)" },
        { id: "e2q9", prompt: "I spoke (quiet) ___ so as not to wake anyone.", correct: "quietly", explanation: "quiet → quietly" },
        { id: "e2q10", prompt: "She ran (fast) ___ and won the race.", correct: "fast", explanation: "fast → fast (same form, no -ly)" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Adjective or adverb?",
      instructions: "Choose the correct form — adjective or adverb. Think about what the word is describing.",
      questions: [
        { id: "e3q1", prompt: "He is a ___ driver.", options: ["careful", "carefully"], correctIndex: 0, explanation: "Adjective before noun (driver) → careful." },
        { id: "e3q2", prompt: "He drives very ___.", options: ["careful", "carefully"], correctIndex: 1, explanation: "Adverb after verb (drives) → carefully." },
        { id: "e3q3", prompt: "She has very ___ handwriting.", options: ["neat", "neatly"], correctIndex: 0, explanation: "Adjective before noun (handwriting) → neat." },
        { id: "e3q4", prompt: "She writes very ___.", options: ["neat", "neatly"], correctIndex: 1, explanation: "Adverb after verb (writes) → neatly." },
        { id: "e3q5", prompt: "Her English is very ___.", options: ["good", "well"], correctIndex: 0, explanation: "Adjective after 'is' (describing a noun) → good." },
        { id: "e3q6", prompt: "She speaks English very ___.", options: ["good", "well"], correctIndex: 1, explanation: "Adverb after verb (speaks) → well (irregular)." },
        { id: "e3q7", prompt: "It was a ___ film.", options: ["terrible", "terribly"], correctIndex: 0, explanation: "Adjective before noun (film) → terrible." },
        { id: "e3q8", prompt: "The team played ___.", options: ["terrible", "terribly"], correctIndex: 1, explanation: "Adverb after verb (played) → terribly." },
        { id: "e3q9", prompt: "He is a ___ worker — he never stops.", options: ["hard", "hardly"], correctIndex: 0, explanation: "Adjective before noun (worker) → hard." },
        { id: "e3q10", prompt: "He works very ___.", options: ["hardly", "hard"], correctIndex: 1, explanation: "Adverb after verb (works) → hard. 'Hardly' means 'almost not' — completely different!" },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Adjective or adverb? Write the correct form",
      instructions: "Write the correct form of the word in brackets — adjective or adverb. Think carefully!",
      questions: [
        { id: "e4q1", prompt: "She has a ___ voice. (beautiful)", correct: "beautiful", explanation: "Adjective before noun (voice) → beautiful." },
        { id: "e4q2", prompt: "She sings ___. (beautiful)", correct: "beautifully", explanation: "Adverb after verb (sings) → beautifully." },
        { id: "e4q3", prompt: "He gave a ___ answer. (brave)", correct: "brave", explanation: "Adjective before noun (answer) → brave." },
        { id: "e4q4", prompt: "She acted very ___. (brave)", correct: "bravely", explanation: "Adverb after verb (acted) → bravely." },
        { id: "e4q5", prompt: "Her pronunciation is very ___. (good)", correct: "good", explanation: "Adjective after 'is' (predicate adjective) → good." },
        { id: "e4q6", prompt: "She pronounces words very ___. (good)", correct: "well", explanation: "Adverb after verb (pronounces) → well (irregular)." },
        { id: "e4q7", prompt: "He finished the test ___. (quick)", correct: "quickly", explanation: "Adverb after verb (finished) → quickly." },
        { id: "e4q8", prompt: "The music is very ___. (loud)", correct: "loud", explanation: "Adjective after 'is' → loud." },
        { id: "e4q9", prompt: "She spoke ___ and clearly. (quiet)", correct: "quietly", explanation: "Adverb after verb (spoke) → quietly." },
        { id: "e4q10", prompt: "He is a ___ learner. (quick)", correct: "quick", explanation: "Adjective before noun (learner) → quick." },
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
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Adverbs of Manner",
        subtitle: "How actions are done — 4 exercises + answer key",
        level: "A2",
        keyRule: "Most adjectives → add -ly. Exceptions: good → well, fast → fast, hard → hard.",
        exercises: [
          { number: 1, title: "Exercise 1", difficulty: "Easy", instruction: "Choose the correct adverb of manner.", questions: [
            "She speaks French very ___ (fluent / fluently).",
            "He drives very ___ (careful / carefully).",
            "The children played ___ in the garden (happy / happily).",
            "She sings ___ (beautiful / beautifully).",
            "He runs very ___ (fastly / fast).",
            "They worked very ___ all week (hardly / hard).",
            "She answered the question ___ (correct / correctly).",
            "He spoke ___ and everyone heard him (loud / loudly).",
            "She plays tennis very ___ (good / well).",
            "The dog barked ___ at the stranger (angry / angrily).",
          ]},
          { number: 2, title: "Exercise 2", difficulty: "Medium", instruction: "Write the adverb form of the adjective in brackets.", questions: [
            "She walks very (slow) ___.",
            "He answered (polite) ___.",
            "She sings (beautiful) ___.",
            "He drives (careful) ___.",
            "They won the game (easy) ___.",
            "She smiled (warm) ___.",
            "He plays the guitar (good) ___.",
            "They worked very (hard) ___.",
            "I spoke (quiet) ___ so as not to wake anyone.",
            "She ran (fast) ___ and won the race.",
          ]},
          { number: 3, title: "Exercise 3", difficulty: "Hard", instruction: "Choose adjective or adverb — think about what is being described.", questions: [
            "He is a ___ driver. (careful / carefully)",
            "He drives very ___. (careful / carefully)",
            "She has very ___ handwriting. (neat / neatly)",
            "She writes very ___. (neat / neatly)",
            "Her English is very ___. (good / well)",
            "She speaks English very ___. (good / well)",
            "It was a ___ film. (terrible / terribly)",
            "The team played ___. (terrible / terribly)",
            "He is a ___ worker — never stops. (hard / hardly)",
            "He works very ___. (hardly / hard)",
          ]},
          { number: 4, title: "Exercise 4", difficulty: "Harder", instruction: "Write the correct form — adjective or adverb.", questions: [
            "She has a ___ voice. (beautiful)",
            "She sings ___. (beautiful)",
            "He gave a ___ answer. (brave)",
            "She acted very ___. (brave)",
            "Her pronunciation is very ___. (good)",
            "She pronounces words very ___. (good)",
            "He finished the test ___. (quick)",
            "The music is very ___. (loud)",
            "She spoke ___ and clearly. (quiet)",
            "He is a ___ learner. (quick)",
          ]},
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — choose adverb form", answers: ["fluently","carefully","happily","beautifully","fast","hard","correctly","loudly","well","angrily"] },
          { exercise: 2, subtitle: "Medium — write adverb", answers: ["slowly","politely","beautifully","carefully","easily","warmly","well","hard","quietly","fast"] },
          { exercise: 3, subtitle: "Hard — adj or adverb", answers: ["careful","carefully","neat","neatly","good","well","terrible","terribly","hard","hard"] },
          { exercise: 4, subtitle: "Harder — correct form", answers: ["beautiful","beautifully","brave","bravely","good","well","quickly","loud","quietly","quick"] },
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
        <span className="text-slate-700 font-medium">Adverbs of Manner</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Adverbs of{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">manner</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Adverbs of manner describe <b>how</b> an action is done: <i>She speaks <b>fluently</b>. He drives <b>carefully</b>.</i> Most are formed by adding <b>-ly</b> to an adjective. Some are irregular: <b>good → well</b>, <b>fast → fast</b>, <b>hard → hard</b>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a2-adverbs-manner" subject="Adverbs of Manner" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
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
          <div className="sticky top-24">
            <AdUnit variant="sidebar-light" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-adverbs-manner" subject="Adverbs of Manner" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/verb-ing" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Verb + -ing →</a>
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Adverbs of Manner</h2>
        <p className="text-slate-500 text-sm">Describe <strong>how</strong> an action is done — after the verb or after the object.</p>
      </div>

      {/* Formation rules */}
      <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-violet-50 to-white p-4">
        <div className="text-xs font-black uppercase tracking-wide text-violet-700 mb-3">📐 Formation Rules</div>
        <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-slate-50">
                <th className="text-left py-2 px-3 font-bold text-slate-600">Rule</th>
                <th className="text-left py-2 px-3 font-bold text-slate-600">Adjective</th>
                <th className="text-left py-2 px-3 font-bold text-slate-600">Adverb</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Most → add -ly", "slow, careful", "slowly, carefully"],
                ["Ending -e → add -ly", "polite, gentle", "politely, gently"],
                ["Ending -y → -ily", "happy, easy, angry", "happily, easily, angrily"],
                ["Ending -ic → -ally", "automatic, dramatic", "automatically, dramatically"],
              ].map(([rule, adj, adv]) => (
                <tr key={rule}>
                  <td className="py-2 px-3 text-slate-700 font-medium">{rule}</td>
                  <td className="py-2 px-3 italic text-slate-500">{adj}</td>
                  <td className="py-2 px-3 font-bold text-sky-700">{adv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Position cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700 mb-2">📍 After the Verb</div>
          <Formula parts={[{text:"Subject"},{dim:true,text:"+"},{text:"verb"},{dim:true,text:"+"},{text:"adverb",color:"green"}]} />
          <div className="mt-3 space-y-2">
            <Ex en="She sings beautifully." />
            <Ex en="He speaks quietly." />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-sky-700 mb-2">📍 After the Object</div>
          <Formula parts={[{text:"Subject"},{dim:true,text:"+"},{text:"verb"},{dim:true,text:"+"},{text:"object"},{dim:true,text:"+"},{text:"adverb",color:"sky"}]} />
          <div className="mt-3 space-y-2">
            <Ex en="She finished the test quickly." />
            <Ex en="She sings beautifully." correct={false} />
          </div>
        </div>
      </div>

      {/* Irregular adverbs */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</div>
          <span className="font-bold text-slate-800">Irregular Adverbs — no -ly!</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { adj: "good", adv: "well", ex: "She plays well." },
            { adj: "fast", adv: "fast", ex: "He runs fast." },
            { adj: "hard", adv: "hard", ex: "She works hard." },
            { adj: "late", adv: "late", ex: "He came late." },
            { adj: "early", adv: "early", ex: "I arrived early." },
            { adj: "high", adv: "high", ex: "She jumped high." },
          ].map(({ adj, adv, ex }) => (
            <div key={adj} className="rounded-xl border border-black/10 bg-slate-50 p-3">
              <div className="text-xs text-slate-400 font-semibold">{adj} →</div>
              <div className="text-lg font-black text-slate-900">{adv}</div>
              <div className="text-xs italic text-slate-500 mt-0.5">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> Adjective vs adverb — does the word describe a <strong>noun</strong>? → adjective. Does it describe <strong>how</strong> something is done? → adverb. <em>"She is a good singer."</em> (good = adjective) vs <em>"She sings well."</em> (well = adverb).
      </div>
    </div>
  );
}
