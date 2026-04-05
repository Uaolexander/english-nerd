"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import PDFButton from "@/components/PDFButton";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Conjunctions (and/but/because)", href: "/grammar/a2/conjunctions", level: "A2", badge: "bg-emerald-600", reason: "Describe movement in longer, connected sentences" },
  { title: "Verb + Infinitive", href: "/grammar/a2/verb-infinitive", level: "A2", badge: "bg-emerald-600", reason: "Many movement phrases use infinitive constructions" },
  { title: "Present Continuous", href: "/grammar/a2/present-continuous", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "She walked ___ the room and sat down.", options: ["in", "to", "into", "through"], answer: 2 },
  { q: "He ran ___ the bridge (from one side to other).", options: ["along", "through", "into", "across"], answer: 3 },
  { q: "We walked ___ the tunnel (entered one end, exit other).", options: ["across", "through", "along", "into"], answer: 1 },
  { q: "She went ___ the stairs slowly (upward).", options: ["on", "to", "up", "along"], answer: 2 },
  { q: "He fell ___ the ladder (downward).", options: ["along", "from", "down", "across"], answer: 2 },
  { q: "She came ___ of the house quickly.", options: ["away", "from", "out", "through"], answer: 2 },
  { q: "He walked ___ the river path for an hour (following length).", options: ["across", "through", "into", "along"], answer: 3 },
  { q: "We drove ___ the city looking for parking.", options: ["across", "through", "around", "into"], answer: 2 },
  { q: "She ran ___ the finish line (going past it).", options: ["through", "past", "along", "across"], answer: 1 },
  { q: "The river flows ___ the valley (following its length).", options: ["across", "through", "along", "into"], answer: 2 },
  { q: "She swam ___ the lake (from one bank to the other).", options: ["along", "through", "into", "across"], answer: 3 },
  { q: "We walked ___ the forest (in one side, out the other).", options: ["across", "through", "along", "into"], answer: 1 },
  { q: "She jumped ___ the puddle (above and over).", options: ["through", "into", "over", "across"], answer: 2 },
  { q: "He climbed ___ the wall (to the top and down).", options: ["along", "through", "over", "across"], answer: 2 },
  { q: "The children ran ___ the playground (in different directions).", options: ["along", "through", "across", "around"], answer: 3 },
  { q: "He dived ___ the water (entering a space).", options: ["in", "through", "into", "to"], answer: 2 },
  { q: "She drove ___ the hospital for her appointment (destination).", options: ["into", "at", "to", "past"], answer: 2 },
  { q: "He jumped ___ the fence into the garden (obstacle).", options: ["through", "across", "along", "over"], answer: 3 },
  { q: "They walked ___ the old town, exploring streets.", options: ["along", "through", "around", "across"], answer: 2 },
  { q: "She went ___ the stairs to the ground floor (downward).", options: ["up", "along", "through", "down"], answer: 3 },
];

export default function PrepositionsMovementLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct preposition of movement",
      instructions: "Choose the correct preposition to describe the movement.",
      questions: [
        { id: "e1q1", prompt: "She walked ___ the room and sat down.", options: ["into", "in", "to"], correctIndex: 0, explanation: "into = movement from outside to inside a room." },
        { id: "e1q2", prompt: "He ran ___ the bridge.", options: ["across", "through", "along"], correctIndex: 0, explanation: "across = movement from one side to the other (of a flat surface)." },
        { id: "e1q3", prompt: "The cat jumped ___ the box.", options: ["into", "in", "to"], correctIndex: 0, explanation: "into = movement entering a container or space." },
        { id: "e1q4", prompt: "We walked ___ the tunnel.", options: ["across", "through", "along"], correctIndex: 1, explanation: "through = movement entering one side and exiting the other (enclosed space)." },
        { id: "e1q5", prompt: "She went ___ the stairs slowly.", options: ["up", "on", "to"], correctIndex: 0, explanation: "up the stairs = moving in an upward direction on the stairs." },
        { id: "e1q6", prompt: "He fell ___ the ladder.", options: ["down", "along", "from"], correctIndex: 0, explanation: "down = movement in a downward direction." },
        { id: "e1q7", prompt: "We drove ___ the park to get to the museum.", options: ["past", "across", "through"], correctIndex: 0, explanation: "past = movement going alongside/beside something without stopping." },
        { id: "e1q8", prompt: "She came ___ of the house quickly.", options: ["out", "away", "from"], correctIndex: 0, explanation: "out of = movement from inside to outside." },
        { id: "e1q9", prompt: "He walked ___ the river path for an hour.", options: ["along", "across", "through"], correctIndex: 0, explanation: "along = movement following the length of something (a path, river, road)." },
        { id: "e1q10", prompt: "We drove ___ the city looking for a place to park.", options: ["around", "across", "through"], correctIndex: 0, explanation: "around = movement in a circular path, covering an area." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct preposition",
      instructions: "Write the correct preposition of movement: to, into, out of, through, across, along, up, down, past, around.",
      questions: [
        { id: "e2q1", prompt: "She ran ___ the finish line and won the race.", correct: "past", explanation: "past = going beside/beyond a point." },
        { id: "e2q2", prompt: "He climbed ___ the mountain slowly.", correct: "up", explanation: "up = moving in an upward direction." },
        { id: "e2q3", prompt: "The children walked ___ the park path.", correct: "along", explanation: "along = following the length of a path." },
        { id: "e2q4", prompt: "She walked ___ the door and left.", correct: "out of", explanation: "out of = leaving an enclosed space." },
        { id: "e2q5", prompt: "We drove ___ the tunnel in less than a minute.", correct: "through", explanation: "through = entering one end and exiting the other." },
        { id: "e2q6", prompt: "He swam ___ the river.", correct: "across", explanation: "across = from one side to the other." },
        { id: "e2q7", prompt: "She went ___ the stairs to get to the ground floor.", correct: "down", explanation: "down = moving in a downward direction." },
        { id: "e2q8", prompt: "The dog ran ___ the garden chasing its ball.", correct: "around", explanation: "around = moving in circles or covering an area." },
        { id: "e2q9", prompt: "He walked ___ the shop and bought a coffee.", correct: "into", explanation: "into = entering an enclosed space." },
        { id: "e2q10", prompt: "She drove ___ the hospital for her appointment.", correct: "to", explanation: "to = movement towards a destination." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Choose the most accurate preposition",
      instructions: "Choose the preposition that best describes the specific movement. Think about direction and context.",
      questions: [
        { id: "e3q1", prompt: "The river flows ___ the valley.", options: ["across", "through", "along"], correctIndex: 2, explanation: "along = following the length of the valley." },
        { id: "e3q2", prompt: "She swam ___ the lake.", options: ["along", "through", "across"], correctIndex: 2, explanation: "across = from one bank to the other (crossing)." },
        { id: "e3q3", prompt: "We walked ___ the forest.", options: ["across", "through", "along"], correctIndex: 1, explanation: "through = entering the forest and coming out the other side." },
        { id: "e3q4", prompt: "He crawled ___ a hole in the fence.", options: ["along", "through", "across"], correctIndex: 1, explanation: "through = entering one side and exiting the other (a hole/gap)." },
        { id: "e3q5", prompt: "She jumped ___ the puddle.", options: ["over", "through", "into"], correctIndex: 0, explanation: "over = movement going above and to the other side (jumping over an obstacle)." },
        { id: "e3q6", prompt: "The bus goes ___ the school on its route.", options: ["through", "past", "across"], correctIndex: 1, explanation: "past = moving alongside something without entering it." },
        { id: "e3q7", prompt: "He climbed ___ the wall.", options: ["over", "through", "along"], correctIndex: 0, explanation: "over = going from one side to the top and down the other." },
        { id: "e3q8", prompt: "She took the lift ___ to the third floor.", options: ["to up", "down", "up"], correctIndex: 2, explanation: "up = moving to a higher level." },
        { id: "e3q9", prompt: "The children ran ___ the playground.", options: ["along", "through", "around"], correctIndex: 2, explanation: "around = moving in different directions within an area." },
        { id: "e3q10", prompt: "He dived ___ the water.", options: ["in", "through", "into"], correctIndex: 2, explanation: "into = movement entering a space (water, a pool)." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the correct preposition",
      instructions: "Write the correct preposition. These require careful thought about the type and direction of movement.",
      questions: [
        { id: "e4q1", prompt: "She walked ___ the bridge connecting the two parts of the city.", correct: "across", explanation: "across = crossing from one side to the other." },
        { id: "e4q2", prompt: "He ran ___ the building to get to the other side.", correct: "around", explanation: "around = going around the perimeter of something." },
        { id: "e4q3", prompt: "The cat climbed ___ the tree and couldn't get down.", correct: "up", explanation: "up = moving to a higher position." },
        { id: "e4q4", prompt: "She sneaked ___ of the meeting room without anyone noticing.", correct: "out of", explanation: "out of = leaving an enclosed space." },
        { id: "e4q5", prompt: "They sailed ___ the islands before heading home.", correct: "past", explanation: "past = moving alongside without stopping." },
        { id: "e4q6", prompt: "He jumped ___ the fence into the garden.", correct: "over", explanation: "over = above and to the other side of an obstacle." },
        { id: "e4q7", prompt: "We hiked ___ the mountain path for six hours.", correct: "along", explanation: "along = following the path." },
        { id: "e4q8", prompt: "She drove ___ the tunnel to avoid the traffic.", correct: "through", explanation: "through = entering one end and exiting the other." },
        { id: "e4q9", prompt: "He fell ___ the slope and twisted his ankle.", correct: "down", explanation: "down = movement in a downward direction." },
        { id: "e4q10", prompt: "They walked ___ the old town, exploring the streets.", correct: "around", explanation: "around = exploring / moving through different parts of an area." },
      ],
    },
  }), []);

  const current = sets[exNo];

  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  async function downloadPDF() {
    setPdfLoading(true);
    const config: LessonPDFConfig = {
      title: "Prepositions of Movement",
      subtitle: "to, into, out of, through, across, along… — 4 exercises + answer key",
      level: "A2",
      keyRule: "into (enter) | out of (exit) | through (enclosed) | across (cross) | along (follow length) | past (go by)",
      exercises: [
        {
          number: 1, title: "Exercise 1", difficulty: "Easy",
          instruction: "Choose the correct preposition to describe the movement.",
          questions: [
            "She walked ___ the room and sat down.",
            "He ran ___ the bridge (from one side to the other).",
            "The cat jumped ___ the box.",
            "We walked ___ the tunnel.",
            "She went ___ the stairs slowly.",
            "He fell ___ the ladder.",
            "We drove ___ the park to get to the museum.",
            "She came ___ of the house quickly.",
            "He walked ___ the river path for an hour.",
            "We drove ___ the city looking for a place to park.",
          ],
        },
        {
          number: 2, title: "Exercise 2", difficulty: "Medium",
          instruction: "Write the correct preposition: to, into, out of, through, across, along, up, down, past, around.",
          questions: [
            "She ran ___ the finish line and won the race.",
            "He climbed ___ the mountain slowly.",
            "The children walked ___ the park path.",
            "She walked ___ the door and left.",
            "We drove ___ the tunnel in less than a minute.",
            "He swam ___ the river.",
            "She went ___ the stairs to get to the ground floor.",
            "The dog ran ___ the garden chasing its ball.",
            "He walked ___ the shop and bought a coffee.",
            "She drove ___ the hospital for her appointment.",
          ],
        },
        {
          number: 3, title: "Exercise 3", difficulty: "Hard",
          instruction: "Choose the preposition that best describes the specific movement.",
          questions: [
            "The river flows ___ the valley.",
            "She swam ___ the lake.",
            "We walked ___ the forest.",
            "He crawled ___ a hole in the fence.",
            "She jumped ___ the puddle.",
            "The bus goes ___ the school on its route.",
            "He climbed ___ the wall.",
            "She took the lift ___ to the third floor.",
            "The children ran ___ the playground.",
            "He dived ___ the water.",
          ],
        },
        {
          number: 4, title: "Exercise 4", difficulty: "Harder",
          instruction: "Write the correct preposition. Think carefully about direction and context.",
          questions: [
            "She walked ___ the bridge connecting the two parts of the city.",
            "He ran ___ the building to get to the other side.",
            "The cat climbed ___ the tree and couldn't get down.",
            "She sneaked ___ of the meeting room without anyone noticing.",
            "They sailed ___ the islands before heading home.",
            "He jumped ___ the fence into the garden.",
            "We hiked ___ the mountain path for six hours.",
            "She drove ___ the tunnel to avoid the traffic.",
            "He fell ___ the slope and twisted his ankle.",
            "They walked ___ the old town, exploring the streets.",
          ],
        },
      ],
      answerKey: [
        { exercise: 1, subtitle: "Easy — choose preposition", answers: ["into", "across", "into", "through", "up", "down", "past", "out", "along", "around"] },
        { exercise: 2, subtitle: "Medium — write preposition", answers: ["past", "up", "along", "out of", "through", "across", "down", "around", "into", "to"] },
        { exercise: 3, subtitle: "Hard — best preposition", answers: ["along", "across", "through", "through", "over", "past", "over", "up", "around", "into"] },
        { exercise: 4, subtitle: "Harder — careful context", answers: ["across", "around", "up", "out of", "past", "over", "along", "through", "down", "around"] },
      ],
    };
    await generateLessonPDF(config);
    setPdfLoading(false);
  }

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

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Prepositions of Movement</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Prepositions of{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">movement</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Prepositions of movement describe <b>how</b> and <b>where</b> something moves: <i>She walked <b>into</b> the room. He ran <b>across</b> the bridge. We drove <b>through</b> the tunnel.</i> Each preposition gives specific information about the direction or path of movement.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left sidebar */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a2-prepositions-movement" subject="Prepositions of Movement" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className="sticky top-24"><AdUnit variant="sidebar-dark" /></div>
        )}

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
            <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
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
                        {score.percent >= 80 ? "Excellent! You've completed all A2 grammar topics!" : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        {/* Right sidebar */}
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
          <SpeedRound gameId="grammar-a2-prepositions-movement" subject="Prepositions of Movement" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">A2 Complete! View all topics →</a>
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Prepositions of Movement</h2>
        <p className="text-slate-500 text-sm">to, into, out of, through, across, along, up, down, past, over, under, around</p>
      </div>

      {/* Preposition cards grid */}
      <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4">
        <div className="text-xs font-black text-violet-700 uppercase tracking-wide mb-3">Prepositions at a glance</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { prep: "to", emoji: "➡️", meaning: "destination", ex: "I'm going to the shop." },
            { prep: "into", emoji: "🚪", meaning: "entering a space", ex: "She walked into the room." },
            { prep: "out of", emoji: "🏃", meaning: "exiting a space", ex: "He ran out of the building." },
            { prep: "through", emoji: "🚇", meaning: "moving inside a space (entry → exit)", ex: "The train goes through the tunnel." },
            { prep: "across", emoji: "🌊", meaning: "from one side to another", ex: "She swam across the river." },
            { prep: "along", emoji: "🏖️", meaning: "following a line", ex: "We walked along the beach." },
            { prep: "up / down", emoji: "⬆️", meaning: "vertical movement", ex: "He ran up the stairs." },
            { prep: "past", emoji: "🏫", meaning: "going by something", ex: "Drive past the school." },
            { prep: "over / under", emoji: "🦅", meaning: "above / below", ex: "The bird flew over the lake." },
            { prep: "around", emoji: "🔄", meaning: "circular movement", ex: "They walked around the park." },
          ].map(({ prep, emoji, meaning, ex }) => (
            <div key={prep} className="rounded-xl bg-white border border-violet-100 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{emoji}</span>
                <span className="font-black text-violet-800 text-sm">{prep}</span>
                <span className="text-xs text-slate-400">— {meaning}</span>
              </div>
              <div className="text-sm italic text-slate-600">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Formula */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
        <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-3">Formula</div>
        <Formula parts={[
          { text: "Subject", color: "sky" },
          { dim: true, text: "+" },
          { text: "verb of movement", color: "green" },
          { dim: true, text: "+" },
          { text: "preposition", color: "violet" },
          { dim: true, text: "+" },
          { text: "place", color: "yellow" },
        ]} />
        <div className="mt-2 text-xs text-slate-500 italic">She walked into the room. / He swam across the river.</div>
      </div>

      {/* Tricky three */}
      <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
        <div className="text-xs font-black text-sky-700 uppercase tracking-wide mb-3">The tricky three: across / through / along</div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { prep: "across", visual: "→|→", desc: "Crossing a flat surface", ex: "swim across the lake" },
            { prep: "through", visual: "→[  ]→", desc: "Moving inside an enclosed space", ex: "drive through a tunnel" },
            { prep: "along", visual: "→→→→", desc: "Following the length of something", ex: "walk along the beach" },
          ].map(({ prep, visual, desc, ex }) => (
            <div key={prep} className="rounded-xl bg-white border border-sky-100 p-3">
              <div className="font-black text-sky-800 text-sm">{prep}</div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">{visual}</div>
              <div className="text-xs text-slate-600 mt-1">{desc}</div>
              <div className="text-xs italic text-sky-700 mt-1">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <div className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2">Examples</div>
        <Ex en="She walked into the room." />
        <Ex en="We drove through the tunnel." />
        <Ex en="I go at the shop." correct={false} />
        <Ex en="I go to the shop." />
      </div>

      {/* Amber tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Destination = &ldquo;to&rdquo;, not &ldquo;at&rdquo;!</span> Always say <b>go to the shop</b>, <b>travel to London</b> — never &ldquo;go at&rdquo;. Use <b>at</b> only when you are already at a location (at the shop, at school).
      </div>
    </div>
  );
}
