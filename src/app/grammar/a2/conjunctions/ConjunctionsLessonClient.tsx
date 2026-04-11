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
  { title: "Prepositions of Movement", href: "/grammar/a2/prepositions-movement", level: "A2", badge: "bg-emerald-600", reason: "Prepositions connect ideas just like conjunctions do" },
  { title: "Verb + Infinitive", href: "/grammar/a2/verb-infinitive", level: "A2", badge: "bg-emerald-600", reason: "Build longer sentences with infinitive clauses" },
  { title: "Verb + -ing", href: "/grammar/a2/verb-ing", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "I was tired ___ I went to bed early.", options: ["but", "although", "and", "so"], answer: 3 },
  { q: "She likes coffee ___ she doesn't like tea.", options: ["so", "and", "but", "or"], answer: 2 },
  { q: "I like swimming ___ cycling. (addition)", options: ["but", "or", "so", "and"], answer: 3 },
  { q: "She didn't eat ___ she wasn't hungry.", options: ["so", "but", "because", "and"], answer: 2 },
  { q: "Would you like tea ___ coffee? (choice)", options: ["and", "but", "so", "or"], answer: 3 },
  { q: "Call me ___ you arrive.", options: ["so", "because", "when", "but"], answer: 2 },
  { q: "He's rich ___ he's not happy.", options: ["so", "because", "and", "but"], answer: 3 },
  { q: "___ she studied hard, she didn't pass.", options: ["Because", "So", "Although", "When"], answer: 2 },
  { q: "I was reading ___ he was watching TV.", options: ["when", "after", "before", "while"], answer: 3 },
  { q: "She turned off the lights ___ she left.", options: ["while", "when", "after", "before"], answer: 3 },
  { q: "He failed ___ he didn't practise enough.", options: ["although", "so", "but", "because"], answer: 3 },
  { q: "She was tired, ___ she took a nap.", options: ["although", "but", "because", "so"], answer: 3 },
  { q: "___ it was cold, we went for a walk.", options: ["Because", "So", "Although", "When"], answer: 2 },
  { q: "___ finishing the test, she left. (sequence)", options: ["Before", "While", "After", "So"], answer: 2 },
  { q: "I listened to music ___ I cooked dinner.", options: ["after", "before", "so", "while"], answer: 3 },
  { q: "He ate dinner ___ going to bed. (sequence)", options: ["before", "while", "after", "when"], answer: 2 },
  { q: "___ he was tired, he kept working.", options: ["Because", "So", "While", "Although"], answer: 3 },
  { q: "She smiled ___ she opened the letter.", options: ["although", "so", "when", "before"], answer: 2 },
  { q: "I felt better ___ I took the medicine. (sequence)", options: ["before", "while", "so", "after"], answer: 3 },
  { q: "It rained, ___ we went inside.", options: ["although", "but", "because", "so"], answer: 3 },
];

export default function ConjunctionsLessonClient() {
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
      title: "Exercise 1 (Easy) — Choose the correct conjunction",
      instructions: "Choose the correct conjunction to join the two ideas.",
      questions: [
        { id: "e1q1", prompt: "I was tired ___ I went to bed early.", options: ["but", "so", "although"], correctIndex: 1, explanation: "so = result / consequence: I was tired, so I went to bed." },
        { id: "e1q2", prompt: "She likes coffee ___ she doesn't like tea.", options: ["and", "or", "but"], correctIndex: 2, explanation: "but = contrast between two opposing ideas." },
        { id: "e1q3", prompt: "He was late ___ he missed the train.", options: ["because", "so", "but"], correctIndex: 1, explanation: "so = result: He was late, so he missed the train." },
        { id: "e1q4", prompt: "I like swimming ___ cycling.", options: ["but", "and", "so"], correctIndex: 1, explanation: "and = addition: connecting two things you like." },
        { id: "e1q5", prompt: "She didn't eat ___ she wasn't hungry.", options: ["so", "because", "but"], correctIndex: 1, explanation: "because = reason/cause: She didn't eat because she wasn't hungry." },
        { id: "e1q6", prompt: "Would you like tea ___ coffee?", options: ["and", "but", "or"], correctIndex: 2, explanation: "or = choice between options." },
        { id: "e1q7", prompt: "___ I finished work, I went to the gym.", options: ["Because", "After", "So"], correctIndex: 1, explanation: "After = time sequence: first finished work, then went to gym." },
        { id: "e1q8", prompt: "Call me ___ you arrive.", options: ["so", "when", "because"], correctIndex: 1, explanation: "when = at the time that something happens." },
        { id: "e1q9", prompt: "He's rich ___ he's not happy.", options: ["so", "because", "but"], correctIndex: 2, explanation: "but = contrast: rich contrasts with not happy." },
        { id: "e1q10", prompt: "She studied hard ___ she passed the exam.", options: ["so", "but", "although"], correctIndex: 0, explanation: "so = result: studied hard → passed the exam." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct conjunction",
      instructions: "Write the correct conjunction: and, but, or, so, because, when, after, before, although, while.",
      questions: [
        { id: "e2q1", prompt: "I woke up early ___ I missed the alarm.", correct: "but", explanation: "Contrast: woke up early BUT missed the alarm." },
        { id: "e2q2", prompt: "She was nervous ___ she had her first interview.", correct: "when", explanation: "when = at the time of the interview." },
        { id: "e2q3", prompt: "He didn't pass ___ he didn't study enough.", correct: "because", explanation: "because = reason for not passing." },
        { id: "e2q4", prompt: "I love pizza ___ pasta.", correct: "and", explanation: "and = adding two things I love." },
        { id: "e2q5", prompt: "She was late, ___ she missed the beginning.", correct: "so", explanation: "so = result/consequence." },
        { id: "e2q6", prompt: "___ leaving, remember to lock the door.", correct: "before", explanation: "before = the action comes first in time." },
        { id: "e2q7", prompt: "I listened to music ___ I cooked dinner.", correct: "while", explanation: "while = two actions happening at the same time." },
        { id: "e2q8", prompt: "Do you prefer tea ___ coffee?", correct: "or", explanation: "or = choice between two options." },
        { id: "e2q9", prompt: "___ it was cold, we went for a walk.", correct: "although", explanation: "although = despite the cold, we still went." },
        { id: "e2q10", prompt: "___ finishing the test, she left the room.", correct: "after", explanation: "after = sequence: finished test, then left." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Choose the most accurate conjunction",
      instructions: "Choose the conjunction that best fits the meaning. Think about cause, contrast, time, and result.",
      questions: [
        { id: "e3q1", prompt: "___ she studied hard, she didn't pass.", options: ["Because", "Although", "So"], correctIndex: 1, explanation: "although = despite studying hard, she still failed (unexpected result)." },
        { id: "e3q2", prompt: "I was reading ___ he was watching TV.", options: ["when", "while", "after"], correctIndex: 1, explanation: "while = two actions at the same time." },
        { id: "e3q3", prompt: "He ate dinner ___ going to bed.", options: ["after", "before", "while"], correctIndex: 0, explanation: "after = first he ate, then he went to bed." },
        { id: "e3q4", prompt: "She turned off the lights ___ she left.", options: ["while", "when", "before"], correctIndex: 2, explanation: "before = she turned off lights, THEN left." },
        { id: "e3q5", prompt: "I'll call you ___ I get there.", options: ["while", "when", "although"], correctIndex: 1, explanation: "when = at the moment I arrive." },
        { id: "e3q6", prompt: "He failed ___ he didn't practise enough.", options: ["although", "because", "so"], correctIndex: 1, explanation: "because = gives the reason for failing." },
        { id: "e3q7", prompt: "It was expensive, ___ we bought it anyway.", options: ["so", "but", "because"], correctIndex: 1, explanation: "but = contrast: expensive, but we still bought it." },
        { id: "e3q8", prompt: "She was tired, ___ she took a nap.", options: ["although", "but", "so"], correctIndex: 2, explanation: "so = result: tired → took a nap." },
        { id: "e3q9", prompt: "___ he is young, he is very experienced.", options: ["Although", "Because", "So"], correctIndex: 0, explanation: "although = contrast: young age vs experience." },
        { id: "e3q10", prompt: "I listen to podcasts ___ I commute.", options: ["before", "so", "while"], correctIndex: 2, explanation: "while = simultaneous: listening and commuting at the same time." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the correct conjunction",
      instructions: "Write the best conjunction for the context. Think carefully about cause, contrast, time, or result.",
      questions: [
        { id: "e4q1", prompt: "___ he was tired, he kept working.", correct: "although", explanation: "although = unexpected: tired, but kept working anyway." },
        { id: "e4q2", prompt: "She checked her email ___ having breakfast.", correct: "while", explanation: "while = two actions happening simultaneously." },
        { id: "e4q3", prompt: "I felt much better ___ I took the medicine.", correct: "after", explanation: "after = sequence: took medicine, then felt better." },
        { id: "e4q4", prompt: "The film was long, ___ it was worth it.", correct: "but", explanation: "but = contrast: long vs worth watching." },
        { id: "e4q5", prompt: "She didn't sleep well ___ she was anxious.", correct: "because", explanation: "because = reason for not sleeping well." },
        { id: "e4q6", prompt: "He always checks the map ___ leaving the house.", correct: "before", explanation: "before = checks map first, then leaves." },
        { id: "e4q7", prompt: "It started raining, ___ we went inside.", correct: "so", explanation: "so = result: rain → went inside." },
        { id: "e4q8", prompt: "I noticed she was upset ___ I asked what was wrong.", correct: "so", explanation: "so = result/logical sequence: noticed → asked." },
        { id: "e4q9", prompt: "She smiled ___ she opened the letter.", correct: "when", explanation: "when = at the moment she opened the letter." },
        { id: "e4q10", prompt: "___ it was raining, we decided to stay in.", correct: "because", explanation: "because = reason for staying in: rain." },
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
        title: "Conjunctions",
        subtitle: "Linking ideas — 4 exercises + answer key",
        level: "A2",
        keyRule: "and=addition, but=contrast, so=result, because=reason, although=despite, when/while/before/after=time.",
        exercises: [
          { number: 1, title: "Exercise 1", difficulty: "Easy", instruction: "Choose the correct conjunction to join the two ideas.", questions: [
            "I was tired ___ I went to bed early. (but / so / although)",
            "She likes coffee ___ she doesn't like tea. (and / or / but)",
            "He was late ___ he missed the train. (because / so / but)",
            "I like swimming ___ cycling. (but / and / so)",
            "She didn't eat ___ she wasn't hungry. (so / because / but)",
            "Would you like tea ___ coffee? (and / but / or)",
            "___ I finished work, I went to the gym. (Because / After / So)",
            "Call me ___ you arrive. (so / when / because)",
            "He's rich ___ he's not happy. (so / because / but)",
            "She studied hard ___ she passed the exam. (so / but / although)",
          ]},
          { number: 2, title: "Exercise 2", difficulty: "Medium", instruction: "Write the correct conjunction: and, but, or, so, because, when, after, before, although, while.", questions: [
            "I woke up early ___ I missed the alarm.",
            "She was nervous ___ she had her first interview.",
            "He didn't pass ___ he didn't study enough.",
            "I love pizza ___ pasta.",
            "She was late, ___ she missed the beginning.",
            "___ leaving, remember to lock the door.",
            "I listened to music ___ I cooked dinner.",
            "Do you prefer tea ___ coffee?",
            "___ it was cold, we went for a walk.",
            "___ finishing the test, she left the room.",
          ]},
          { number: 3, title: "Exercise 3", difficulty: "Hard", instruction: "Choose the conjunction that best fits the meaning.", questions: [
            "___ she studied hard, she didn't pass. (Because / Although / So)",
            "I was reading ___ he was watching TV. (when / while / after)",
            "He ate dinner ___ going to bed. (after / before / while)",
            "She turned off the lights ___ she left. (while / when / before)",
            "I'll call you ___ I get there. (while / when / although)",
            "He failed ___ he didn't practise enough. (although / because / so)",
            "It was expensive, ___ we bought it anyway. (so / but / because)",
            "She was tired, ___ she took a nap. (although / but / so)",
            "___ he is young, he is very experienced. (Although / Because / So)",
            "I listen to podcasts ___ I commute. (before / so / while)",
          ]},
          { number: 4, title: "Exercise 4", difficulty: "Harder", instruction: "Write the best conjunction: although, while, after, but, because, before, so, when.", questions: [
            "___ he was tired, he kept working.",
            "She checked her email ___ having breakfast.",
            "I felt much better ___ I took the medicine.",
            "The film was long, ___ it was worth it.",
            "She didn't sleep well ___ she was anxious.",
            "He always checks the map ___ leaving the house.",
            "It started raining, ___ we went inside.",
            "I noticed she was upset ___ I asked what was wrong.",
            "She smiled ___ she opened the letter.",
            "___ it was raining, we decided to stay in.",
          ]},
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — choose conjunction", answers: ["so","but","so","and","because","or","After","when","but","so"] },
          { exercise: 2, subtitle: "Medium — write conjunction", answers: ["but","when","because","and","so","before","while","or","although","after"] },
          { exercise: 3, subtitle: "Hard — best conjunction", answers: ["Although","while","after","before","when","because","but","so","Although","while"] },
          { exercise: 4, subtitle: "Harder — write conjunction", answers: ["although","while","after","but","because","before","so","so","when","because"] },
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
        <span className="text-slate-700 font-medium">Conjunctions</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Conjunctions{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">linking ideas</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Conjunctions join clauses or ideas. <b>And, but, or, so</b> are coordinating conjunctions. <b>Because, although, when, while, before, after</b> are subordinating conjunctions that give reasons, contrast, or show time relationships.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a2-conjunctions" subject="Conjunctions" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-a2-conjunctions" subject="Conjunctions" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/time-expressions-past" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Time Expressions: Past →</a>
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Conjunctions — Connecting Ideas</h2>
        <p className="text-slate-500 text-sm">Conjunctions connect words, phrases, and clauses to express relationships between ideas.</p>
      </div>

      {/* 3 type cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700 mb-2">🔗 Coordinating</div>
          <p className="text-xs text-slate-500 mb-3">Join two equal clauses or ideas.</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["and","but","or","so","yet"].map(w => (
              <span key={w} className="rounded-lg px-2.5 py-1 text-xs font-black border bg-emerald-100 text-emerald-800 border-emerald-200">{w}</span>
            ))}
          </div>
          <Formula parts={[{text:"clause"},{dim:true,text:"+"},{text:"and/but/or",color:"green"},{dim:true,text:"+"},{text:"clause"}]} />
          <div className="mt-3 space-y-2">
            <Ex en="I was tired, but I kept working." />
            <Ex en="Tea or coffee?" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-sky-700 mb-2">🔀 Subordinating</div>
          <p className="text-xs text-slate-500 mb-3">Join a main clause with a subordinate clause.</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["because","although","when","if","while","unless","until"].map(w => (
              <span key={w} className="rounded-lg px-2.5 py-1 text-xs font-black border bg-sky-100 text-sky-800 border-sky-200">{w}</span>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <Ex en="I left because I was tired." />
            <Ex en="Call me when you arrive." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-violet-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-violet-700 mb-2">🔄 Correlative</div>
          <p className="text-xs text-slate-500 mb-3">Pairs that work together.</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["either…or","neither…nor","both…and","not only…but also"].map(w => (
              <span key={w} className="rounded-lg px-2.5 py-1 text-xs font-black border bg-violet-100 text-violet-800 border-violet-200">{w}</span>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <Ex en="Both tea and coffee are fine." />
            <Ex en="Either you come, or I leave." />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</div>
          <span className="font-bold text-slate-800">Quick Reference</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-slate-50">
                <th className="text-left py-2 px-3 font-bold text-slate-600">Conjunction</th>
                <th className="text-left py-2 px-3 font-bold text-slate-600">Meaning</th>
                <th className="text-left py-2 px-3 font-bold text-slate-600">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["and","addition","I like tea and coffee."],
                ["but","contrast","She's rich but unhappy."],
                ["or","choice","Tea or coffee?"],
                ["so","result","I was tired, so I left."],
                ["yet","unexpected contrast","It's expensive, yet popular."],
                ["because","reason","I left because I was tired."],
                ["although","despite","Although it was cold, we went out."],
                ["when","time","Call me when you arrive."],
                ["while","same time","She sang while she cooked."],
                ["if","condition","I'll help if you need me."],
              ].map(([conj, meaning, ex]) => (
                <tr key={conj}>
                  <td className="py-2 px-3 font-black text-slate-900">{conj}</td>
                  <td className="py-2 px-3 text-slate-500">{meaning}</td>
                  <td className="py-2 px-3 italic text-slate-600">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <Ex en="I was tired, but I kept working." />
        <Ex en="I was tired, but kept working I." correct={false} />
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> When a coordinating conjunction (and, but, or, so) joins two full clauses, put a <strong>comma before</strong> the conjunction — <em>"I was tired, but I kept working."</em>
      </div>
    </div>
  );
}
