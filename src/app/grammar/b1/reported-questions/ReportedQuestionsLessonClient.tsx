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
  { q: "Reported yes/no questions use:", options: ["that", "which", "where", "if / whether"], answer: 3 },
  { q: "Reported wh-questions keep the:", options: ["auxiliary verb", "wh-word", "question mark", "inversion"], answer: 1 },
  { q: "Word order in reported questions:", options: ["Inversion (V+S)", "Statement order (S+V)", "Question order (aux+S)", "No change"], answer: 1 },
  { q: "'Are you coming?' → She asked me ___ coming.", options: ["if I was", "that I was", "what I was", "if was I"], answer: 0 },
  { q: "'Where do you live?' → He asked me ___.", options: ["where did I live", "where I lived", "where do I live", "if I lived"], answer: 1 },
  { q: "In reported questions, 'do/did' is:", options: ["kept", "changed to 'would'", "removed", "changed to 'have'"], answer: 2 },
  { q: "'Can you help?' → He asked ___ I could help.", options: ["that", "what", "if", "which"], answer: 2 },
  { q: "'Why are you late?' → She asked him ___ he was late.", options: ["if", "that", "what", "why"], answer: 3 },
  { q: "'Did she call?' → They asked ___ she had called.", options: ["what", "who", "if", "that"], answer: 2 },
  { q: "'What time is it?' → She asked ___ time it was.", options: ["if", "whether", "what", "when"], answer: 2 },
  { q: "'I was tired.' Direct question form:", options: ["Was you tired?", "Are you tired?", "Were you tired?", "Did you be tired?"], answer: 1 },
  { q: "She asked where ___.", options: ["did I live", "I lived", "do I live", "I do live"], answer: 1 },
  { q: "'How long have you been here?' → He asked how long ___.", options: ["had I been there", "I had been there", "I have been here", "was I there"], answer: 1 },
  { q: "'Will you come to the party?' → if I ___ come.", options: ["will", "would", "can", "might"], answer: 1 },
  { q: "They asked when ___ arrive.", options: ["would we", "we would", "we will", "will we"], answer: 1 },
  { q: "'Have you eaten?' → He asked ___ I had eaten.", options: ["what", "that", "if", "how"], answer: 2 },
  { q: "'How much does it cost?' → He asked how much ___ cost.", options: ["did it", "it", "does it", "it does"], answer: 1 },
  { q: "'Who did you see?' → She asked me ___ I had seen.", options: ["if", "that", "which", "who"], answer: 3 },
  { q: "In reported speech 'tomorrow' becomes:", options: ["yesterday", "the next day", "today", "last day"], answer: 1 },
  { q: "In reported speech 'here' becomes:", options: ["there", "here", "this", "near"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Reported Questions",
  subtitle: "if/whether and wh-words, statement order",
  level: "B1",
  keyRule: "Yes/no questions → if/whether. Wh-questions keep the wh-word. No inversion, no do/did.",
  exercises: [
    {
      number: 1,
      title: "if/whether or wh-word?",
      difficulty: "Easy",
      instruction: "Choose the correct word to introduce the reported question.",
      questions: [
        "'Are you coming?' → asked me ___ I was coming.",
        "'Where do you live?' → asked me ___ I lived.",
        "'Did she call?' → asked ___ she had called.",
        "'What time is it?' → asked ___ time it was.",
        "'Can you help me?' → asked ___ I could help.",
        "'Why are you late?' → asked him ___ he was late.",
        "'Have you eaten?' → asked ___ I had eaten.",
        "'Who did you see?' → asked me ___ I had seen.",
        "'How long were you there?' → asked ___ long I'd been.",
        "'Is this yours?' → asked ___ it was mine.",
      ],
    },
    {
      number: 2,
      title: "Choose the correct word order",
      difficulty: "Medium",
      instruction: "Choose: no inversion, no auxiliary do/did.",
      questions: [
        "She asked me where ___.",
        "He asked if ___.",
        "They asked what time ___.",
        "She asked whether ___.",
        "He asked why ___.",
        "I asked how much ___.",
        "She asked me if ___.",
        "He asked who ___.",
        "They asked when ___.",
        "She asked how long ___.",
      ],
    },
    {
      number: 3,
      title: "Write the reported question",
      difficulty: "Hard",
      instruction: "Write the reported clause after 'asked'.",
      questions: [
        "'Are you tired?' → She asked me ___.",
        "'Where do you work?' → He asked me ___.",
        "'Have you finished?' → She asked me ___.",
        "'What are you doing?' → He asked me ___.",
        "'Can you swim?' → She asked me ___.",
        "'Why did you leave early?' → He asked me ___.",
        "'Who did you speak to?' → She asked me ___.",
        "'How long have you been here?' → He asked me ___.",
        "'Will you come to the party?' → She asked me ___.",
        "'How much does it cost?' → He asked ___.",
      ],
    },
    {
      number: 4,
      title: "Full reported question sentences",
      difficulty: "Harder",
      instruction: "Write the complete reported question sentence.",
      questions: [
        "'Do you live nearby?' (She / asked me)",
        "'Where are you going?' (He / asked her)",
        "'Have you seen my keys?' (She / asked him)",
        "'What time will you arrive?' (He / asked me)",
        "'Can you help me tomorrow?' (She / asked him)",
        "'Why didn't you call me?' (He / asked her)",
        "'Are you coming to meeting today?' (She / asked him)",
        "'How long have you been waiting?' (He / asked me)",
        "'Did you enjoy the film?' (She / asked them)",
        "'Where were you yesterday?' (He / asked her)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Introductory words", answers: ["if", "where", "if", "what", "if", "why", "if", "who", "how", "if"] },
    { exercise: 2, subtitle: "Word order", answers: ["I lived", "she was coming", "the train left", "I had finished", "I was upset", "it cost", "I could drive", "I called", "we would arrive", "I had been waiting"] },
    { exercise: 3, subtitle: "Reported clauses", answers: ["if I was tired", "where I worked", "if I had finished", "what I was doing", "if I could swim", "why I had left early", "who I had spoken to", "how long I had been there", "if I would come to the party", "how much it cost"] },
    { exercise: 4, subtitle: "Full sentences", answers: ["she asked me if I lived nearby", "he asked her where she was going", "she asked him if he had seen her keys", "he asked me what time I would arrive", "she asked him if he could help her the next day", "he asked her why she hadn't called him", "she asked him if he was coming to the meeting that day", "he asked me how long I had been waiting", "she asked them if they had enjoyed the film", "he asked her where she had been the day before"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Reported Statements", href: "/grammar/b1/reported-statements", level: "B1", badge: "bg-violet-500", reason: "Direct companion topic in reported speech" },
  { title: "Defining Relative Clauses", href: "/grammar/b1/relative-clauses-defining", level: "B1", badge: "bg-violet-500" },
  { title: "Non-defining Relative Clauses", href: "/grammar/b1/relative-clauses-non-defining", level: "B1", badge: "bg-violet-500" },
];

export default function ReportedQuestionsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — if/whether or wh-word?",
      instructions: "Choose the correct word to introduce the reported question.",
      questions: [
        { id: "e1q1", prompt: "Direct: 'Are you coming?' → She asked me ___ I was coming.", options: ["if", "what", "that"], correctIndex: 0, explanation: "Yes/no question → use if (or whether)." },
        { id: "e1q2", prompt: "Direct: 'Where do you live?' → He asked me ___ I lived.", options: ["if", "where", "that"], correctIndex: 1, explanation: "Wh-question with 'where' → keep where." },
        { id: "e1q3", prompt: "Direct: 'Did she call?' → They asked ___ she had called.", options: ["what", "if", "who"], correctIndex: 1, explanation: "Yes/no question → if/whether." },
        { id: "e1q4", prompt: "Direct: 'What time is it?' → She asked ___ time it was.", options: ["if", "what", "whether"], correctIndex: 1, explanation: "Wh-question with 'what time' → what." },
        { id: "e1q5", prompt: "Direct: 'Can you help me?' → He asked ___ I could help him.", options: ["that", "what", "if"], correctIndex: 2, explanation: "Yes/no question → if/whether." },
        { id: "e1q6", prompt: "Direct: 'Why are you late?' → She asked him ___ he was late.", options: ["if", "why", "that"], correctIndex: 1, explanation: "Wh-question with 'why' → why." },
        { id: "e1q7", prompt: "Direct: 'Have you eaten?' → He asked ___ I had eaten.", options: ["that", "if", "what"], correctIndex: 1, explanation: "Yes/no question → if." },
        { id: "e1q8", prompt: "Direct: 'Who did you see?' → She asked me ___ I had seen.", options: ["if", "that", "who"], correctIndex: 2, explanation: "Wh-question with 'who' → who." },
        { id: "e1q9", prompt: "Direct: 'How long have you been here?' → He asked ___ long I had been there.", options: ["if", "how", "what"], correctIndex: 1, explanation: "Wh-question with 'how long' → how." },
        { id: "e1q10", prompt: "Direct: 'Is this yours?' → She asked ___ it was mine.", options: ["what", "that", "if"], correctIndex: 2, explanation: "Yes/no question → if/whether." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Choose the correct word order",
      instructions: "Choose the correct reported question form. Remember: reported questions use statement word order (no inversion, no auxiliary do/did).",
      questions: [
        { id: "e2q1", prompt: "She asked me where ___ .", options: ["did I live", "I lived", "I do live"], correctIndex: 1, explanation: "No inversion in reported questions: where I lived (not 'where did I live')." },
        { id: "e2q2", prompt: "He asked if ___ .", options: ["was she coming", "she was coming", "did she come"], correctIndex: 1, explanation: "Statement order: she was coming." },
        { id: "e2q3", prompt: "They asked what time ___ .", options: ["did the train leave", "the train left", "leaves the train"], correctIndex: 1, explanation: "No auxiliary do: what time the train left." },
        { id: "e2q4", prompt: "She asked whether ___ .", options: ["had I finished", "I had finished", "I finished"], correctIndex: 1, explanation: "Statement order: I had finished." },
        { id: "e2q5", prompt: "He asked why ___ .", options: ["was I upset", "I was upset", "I am upset"], correctIndex: 1, explanation: "Statement order + backshift: I was upset." },
        { id: "e2q6", prompt: "I asked how much ___ .", options: ["cost it", "it cost", "did it cost"], correctIndex: 1, explanation: "No inversion: how much it cost." },
        { id: "e2q7", prompt: "She asked me if ___ .", options: ["could I drive", "I could drive", "I can drive"], correctIndex: 1, explanation: "can → could; statement order: I could drive." },
        { id: "e2q8", prompt: "He asked who ___ .", options: ["did I call", "I called", "called I"], correctIndex: 1, explanation: "No inversion: who I called." },
        { id: "e2q9", prompt: "They asked when ___ .", options: ["would we arrive", "we would arrive", "we will arrive"], correctIndex: 1, explanation: "will → would; statement order: we would arrive." },
        { id: "e2q10", prompt: "She asked how long ___ .", options: ["had I been waiting", "I had been waiting", "I was waiting"], correctIndex: 1, explanation: "Statement order: I had been waiting." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the reported question",
      instructions: "Write only the reported question clause after 'asked' (e.g. 'if she was coming').",
      questions: [
        { id: "e3q1", prompt: "'Are you tired?' → She asked me ___.", correct: "if i was tired", explanation: "yes/no → if; am → was." },
        { id: "e3q2", prompt: "'Where do you work?' → He asked me ___.", correct: "where i worked", explanation: "where + statement order; do work → worked." },
        { id: "e3q3", prompt: "'Have you finished?' → She asked me ___.", correct: "if i had finished", explanation: "yes/no → if; have finished → had finished." },
        { id: "e3q4", prompt: "'What are you doing?' → He asked me ___.", correct: "what i was doing", explanation: "what + statement order; am doing → was doing." },
        { id: "e3q5", prompt: "'Can you swim?' → She asked me ___.", correct: "if i could swim", explanation: "yes/no → if; can → could." },
        { id: "e3q6", prompt: "'Why did you leave early?' → He asked me ___.", correct: "why i had left early", explanation: "why + statement order; did leave → had left." },
        { id: "e3q7", prompt: "'Who did you speak to?' → She asked me ___.", correct: "who i had spoken to", explanation: "who + statement order; did speak → had spoken." },
        { id: "e3q8", prompt: "'How long have you been here?' → He asked me ___.", correct: "how long i had been there", explanation: "how long + statement order; have been → had been; here → there." },
        { id: "e3q9", prompt: "'Will you come to the party?' → She asked me ___.", correct: "if i would come to the party", explanation: "yes/no → if; will → would." },
        { id: "e3q10", prompt: "'How much does it cost?' → He asked ___.", correct: "how much it cost", explanation: "how much + statement order; does cost → cost." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Full reported question sentences",
      instructions: "Write the complete reported question sentence, changing all pronouns, time expressions, and verb tenses.",
      questions: [
        { id: "e4q1", prompt: "'Do you live nearby?' (She asked me) →", correct: "she asked me if i lived nearby", explanation: "yes/no → if; do live → lived." },
        { id: "e4q2", prompt: "'Where are you going?' (He asked her) →", correct: "he asked her where she was going", explanation: "you → she; are going → was going." },
        { id: "e4q3", prompt: "'Have you seen my keys?' (She asked him) →", correct: "she asked him if he had seen her keys", explanation: "you → he; my → her; have seen → had seen." },
        { id: "e4q4", prompt: "'What time will you arrive?' (He asked me) →", correct: "he asked me what time i would arrive", explanation: "you → I; will → would." },
        { id: "e4q5", prompt: "'Can you help me tomorrow?' (She asked him) →", correct: "she asked him if he could help her the next day", explanation: "you → he; me → her; can → could; tomorrow → the next day." },
        { id: "e4q6", prompt: "'Why didn't you call me?' (He asked her) →", correct: "he asked her why she hadn't called him", explanation: "you → she; didn't call → hadn't called; me → him." },
        { id: "e4q7", prompt: "'Are you coming to the meeting today?' (She asked him) →", correct: "she asked him if he was coming to the meeting that day", explanation: "you → he; are coming → was coming; today → that day." },
        { id: "e4q8", prompt: "'How long have you been waiting?' (He asked me) →", correct: "he asked me how long i had been waiting", explanation: "you → I; have been waiting → had been waiting." },
        { id: "e4q9", prompt: "'Did you enjoy the film?' (She asked them) →", correct: "she asked them if they had enjoyed the film", explanation: "you → they; did enjoy → had enjoyed." },
        { id: "e4q10", prompt: "'Where were you yesterday?' (He asked her) →", correct: "he asked her where she had been the day before", explanation: "you → she; were → had been; yesterday → the day before." },
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
        <span className="text-slate-700 font-medium">Reported Speech — Questions</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Reported Speech —{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Questions</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Reported questions use <b>statement word order</b> — no inversion, no auxiliary <i>do/did</i>. Yes/no questions use <b>if</b> or <b>whether</b>; wh-questions keep the wh-word: <i>He asked me <b>where I lived</b>. She asked <b>if I was tired</b>.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-reported-questions" subject="Reported Questions" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                                <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-lg rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
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
          <SpeedRound gameId="grammar-b1-reported-questions" subject="Reported Questions" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/modal-possibility" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Modal Verbs — Possibility →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Reported Questions (B1)</h2>
      <p>When we report a question, we <b>do not use question word order</b>. The verb goes after the subject, just like in a normal statement. We also apply the same tense backshift as in reported statements.</p>

      <h3>Yes/No questions → if / whether</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-3 text-sm text-slate-700">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Direct</span>
          <span className="italic">&quot;Are you coming?&quot;</span>
          <span className="text-xs font-bold text-slate-500 uppercase">Reported</span>
          <span className="italic">She asked me <b>if / whether I was coming</b>.</span>
          <span className="text-xs font-bold text-red-500 uppercase">✗ Wrong</span>
          <span className="italic line-through text-slate-400">She asked me was I coming.</span>
        </div>
      </div>

      <h3>Wh-questions → keep the wh-word</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-3 text-sm text-slate-700">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Direct</span>
          <span className="italic">&quot;Where do you live?&quot;</span>
          <span className="text-xs font-bold text-slate-500 uppercase">Reported</span>
          <span className="italic">He asked me <b>where I lived</b>.</span>
          <span className="text-xs font-bold text-red-500 uppercase">✗ Wrong</span>
          <span className="italic line-through text-slate-400">He asked me where did I live.</span>
        </div>
      </div>

      <h3>Key rules</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { use: "Statement word order", color: "border-violet-200 bg-violet-50 text-violet-700", ex: "…where I lived (NOT where did I live)" },
          { use: "No do/did/does", color: "border-sky-200 bg-sky-50 text-sky-700", ex: "…what he wanted (NOT what did he want)" },
          { use: "Tense backshift", color: "border-emerald-200 bg-emerald-50 text-emerald-700", ex: "are → were / will → would / can → could" },
          { use: "Pronoun & time changes", color: "border-amber-200 bg-amber-50 text-amber-700", ex: "you → I/he/she · tomorrow → the next day" },
        ].map(({ use, color, ex }) => (
          <div key={use} className={`rounded-xl border p-4 ${color}`}>
            <div className="text-sm font-black mb-1">{use}</div>
            <div className="text-sm text-slate-600 italic">{ex}</div>
          </div>
        ))}
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 ask vs say/tell:</span> Use <b>asked</b> for reported questions (not <i>said</i>). <i>She <b>asked</b> me where I was going.</i> The object (me, him, her…) is common but not always required: <i>He asked <b>if</b> anyone had seen it.</i>
        </div>
      </div>
    </div>
  );
}
