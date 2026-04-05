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
  { q: "Past Simple Passive formula:", options: ["am/is/are + pp", "was/were + pp", "had + pp", "will be + pp"], answer: 1 },
  { q: "'The letter ___ sent yesterday.' (singular)", options: ["were", "are", "was", "is"], answer: 2 },
  { q: "'The windows ___ broken in storm.' (plural)", options: ["was", "is", "am", "were"], answer: 3 },
  { q: "'I ___ told about the meeting.' Correct:", options: ["were", "am", "was", "is"], answer: 2 },
  { q: "The Eiffel Tower ___ built in 1889.", options: ["were", "are", "is", "was"], answer: 3 },
  { q: "'Shakespeare wrote Hamlet.' Passive:", options: ["Hamlet was wrote by Shakespeare.", "Hamlet was written by Shakespeare.", "Hamlet were written by Shakespeare.", "Hamlet is written by Shakespeare."], answer: 1 },
  { q: "'Three people ___ arrested.' (plural)", options: ["was", "is", "am", "were"], answer: 3 },
  { q: "'She ___ offered the job.' Correct:", options: ["were", "are", "is", "was"], answer: 3 },
  { q: "Active: 'Someone stole my wallet.' → Passive:", options: ["My wallet was steal.", "My wallet were stolen.", "My wallet was stolen.", "My wallet is stolen."], answer: 2 },
  { q: "'The paintings ___ damaged in fire.' (plural)", options: ["was", "is", "am", "were"], answer: 3 },
  { q: "Active: 'The earthquake destroyed homes.' → Passive:", options: ["Homes was destroyed.", "Homes were destroyed.", "Homes are destroyed.", "Homes had destroyed."], answer: 1 },
  { q: "'The match ___ cancelled because of rain.'", options: ["were", "are", "was", "had"], answer: 2 },
  { q: "When to use Past Passive:", options: ["When the doer is known and important", "When the action matters more than the doer", "Only in formal writing", "Only for past habits"], answer: 1 },
  { q: "'The police arrested three suspects.' → Passive:", options: ["Three suspects was arrested.", "Three suspects were arrested.", "Three suspects are arrested.", "Three suspects had arrested."], answer: 1 },
  { q: "We ___ not informed about the change.", options: ["was", "is", "am", "were"], answer: 3 },
  { q: "'The report ___ written by the head of department.'", options: ["were", "are", "is", "was"], answer: 3 },
  { q: "Active: 'They showed the film at festival.' → Passive:", options: ["The film was shown.", "The film were shown.", "The film is shown.", "The film showed."], answer: 0 },
  { q: "'I ___ not invite to the party.'  Negative passive:", options: ["were not invited", "am not invited", "was not invited", "had not invited"], answer: 2 },
  { q: "Which uses was correctly?", options: ["The cars was stolen.", "The bridge was built in 1890.", "The documents was signed.", "We was not informed."], answer: 1 },
  { q: "Which is WRONG?", options: ["She was offered the job.", "He was invited to the party.", "The results were announced.", "The letter were sent."], answer: 3 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Past Simple Passive",
  subtitle: "was / were + past participle",
  level: "B1",
  keyRule: "Past Passive = was/were + past participle. Use when the action matters more than who did it.",
  exercises: [
    {
      number: 1,
      title: "Choose was or were",
      difficulty: "Easy",
      instruction: "Choose was or were.",
      questions: [
        "The letter ___ sent yesterday.",
        "The windows ___ broken in storm.",
        "I ___ told about the meeting.",
        "The cars ___ stolen from car park.",
        "The bridge ___ built in 1890.",
        "The documents ___ signed by director.",
        "She ___ offered the job last week.",
        "The paintings ___ damaged in fire.",
        "The match ___ cancelled due to rain.",
        "We ___ not informed about change.",
      ],
    },
    {
      number: 2,
      title: "Write the passive form",
      difficulty: "Medium",
      instruction: "Write was/were + past participle.",
      questions: [
        "Eiffel Tower ___ (build) in 1889.",
        "Three people ___ (arrest) after incident.",
        "The email ___ (send) to wrong address.",
        "The results ___ (announce) at noon.",
        "She ___ (give) a prize for her work.",
        "Children ___ (pick up) by grandmother.",
        "The old hospital ___ (demolish) last year.",
        "I ___ (not/invite) to the party.",
        "Two new schools ___ (open) in area.",
        "The report ___ (write) by the head.",
      ],
    },
    {
      number: 3,
      title: "Active or Past Passive?",
      difficulty: "Hard",
      instruction: "Choose active or passive.",
      questions: [
        "Scientists ___ a new planet last year.",
        "A new planet ___ by scientists last year.",
        "The fire ___ quickly by fire brigade.",
        "The fire brigade ___ the fire fast.",
        "The contract ___ by both parties.",
        "Both parties ___ the contract.",
        "Leonardo da Vinci ___ the Mona Lisa.",
        "The Mona Lisa ___ by Leonardo.",
        "Many houses ___ in earthquake.",
        "The earthquake ___ thousands of homes.",
      ],
    },
    {
      number: 4,
      title: "Active to Passive",
      difficulty: "Harder",
      instruction: "Write passive verb phrase only.",
      questions: [
        "Someone stole my wallet. → My wallet ___.",
        "Police arrested three suspects. → suspects ___.",
        "They built church in 15th century. → church ___.",
        "Shakespeare wrote Hamlet. → Hamlet ___.",
        "Someone broke the window. → window ___.",
        "Manager fired two employees. → employees ___.",
        "They showed film at festival. → film ___.",
        "Someone left lights on all night. → lights ___.",
        "Company launched product in March. → product ___.",
        "Thousands saw the match. → match ___.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "was / were", answers: ["was", "were", "was", "were", "was", "were", "was", "were", "was", "were"] },
    { exercise: 2, subtitle: "Passive forms", answers: ["was built", "were arrested", "was sent", "were announced", "was given", "were picked up", "was demolished", "was not invited", "were opened", "was written"] },
    { exercise: 3, subtitle: "Active/Passive", answers: ["discovered (active)", "was discovered", "was put out", "put out (active)", "was signed", "signed (active)", "painted (active)", "was painted", "were destroyed", "destroyed (active)"] },
    { exercise: 4, subtitle: "Passive phrases", answers: ["was stolen", "were arrested", "was built", "was written", "was broken", "were fired", "was shown", "were left", "was launched", "was seen"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Present Passive", href: "/grammar/b1/passive-present", level: "B1", badge: "bg-violet-500", reason: "The present counterpart of this tense" },
  { title: "Past Perfect", href: "/grammar/b1/past-perfect", level: "B1", badge: "bg-violet-500" },
  { title: "Past Continuous", href: "/grammar/b1/past-continuous", level: "B1", badge: "bg-violet-500" },
];

export default function PassivePastLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose was or were",
      instructions: "Choose the correct form of 'be' (was/were) to complete the Past Simple Passive.",
      questions: [
        { id: "e1q1", prompt: "The letter ___ sent yesterday.", options: ["was", "were", "is"], correctIndex: 0, explanation: "The letter = singular → was sent." },
        { id: "e1q2", prompt: "The windows ___ broken during the storm.", options: ["was", "were", "are"], correctIndex: 1, explanation: "The windows = plural → were broken." },
        { id: "e1q3", prompt: "I ___ told about the meeting this morning.", options: ["were", "was", "am"], correctIndex: 1, explanation: "I → was told." },
        { id: "e1q4", prompt: "The cars ___ stolen from the car park.", options: ["was", "were", "is"], correctIndex: 1, explanation: "The cars = plural → were stolen." },
        { id: "e1q5", prompt: "The bridge ___ built in 1890.", options: ["were", "was", "is"], correctIndex: 1, explanation: "The bridge = singular → was built." },
        { id: "e1q6", prompt: "The documents ___ signed by the director.", options: ["was", "were", "are"], correctIndex: 1, explanation: "The documents = plural → were signed." },
        { id: "e1q7", prompt: "She ___ offered the job last week.", options: ["were", "was", "is"], correctIndex: 1, explanation: "She → was offered." },
        { id: "e1q8", prompt: "The paintings ___ damaged in the fire.", options: ["was", "were", "is"], correctIndex: 1, explanation: "The paintings = plural → were damaged." },
        { id: "e1q9", prompt: "The match ___ cancelled because of the rain.", options: ["were", "was", "is"], correctIndex: 1, explanation: "The match = singular → was cancelled." },
        { id: "e1q10", prompt: "We ___ not informed about the change.", options: ["was", "were", "are"], correctIndex: 1, explanation: "We → were not informed." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the passive form",
      instructions: "Write the correct Past Simple Passive using the verb in brackets (was/were + past participle).",
      questions: [
        { id: "e2q1", prompt: "The Eiffel Tower ___ (build) in 1889.", correct: "was built", explanation: "singular → was + built." },
        { id: "e2q2", prompt: "Three people ___ (arrest) after the incident.", correct: "were arrested", explanation: "plural → were + arrested." },
        { id: "e2q3", prompt: "The email ___ (send) to the wrong address.", correct: "was sent", explanation: "singular → was + sent." },
        { id: "e2q4", prompt: "The results ___ (announce) at noon.", correct: "were announced", explanation: "plural → were + announced." },
        { id: "e2q5", prompt: "She ___ (give) a prize for her work.", correct: "was given", explanation: "she → was + given." },
        { id: "e2q6", prompt: "The children ___ (pick up) from school by their grandmother.", correct: "were picked up", explanation: "plural → were + picked up." },
        { id: "e2q7", prompt: "The old hospital ___ (demolish) last year.", correct: "was demolished", explanation: "singular → was + demolished." },
        { id: "e2q8", prompt: "I ___ (not / invite) to the party.", correct: "was not invited", explanation: "I → was not + invited." },
        { id: "e2q9", prompt: "Two new schools ___ (open) in the area.", correct: "were opened", explanation: "plural → were + opened." },
        { id: "e2q10", prompt: "The report ___ (write) by the head of department.", correct: "was written", explanation: "singular → was + written." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Active or Past Simple Passive?",
      instructions: "Choose the correct form: active Past Simple or passive (was/were + pp).",
      questions: [
        { id: "e3q1", prompt: "The scientists ___ a new planet last year.", options: ["discovered", "was discovered"], correctIndex: 0, explanation: "Scientists (subject) did the action → active: discovered." },
        { id: "e3q2", prompt: "A new planet ___ by scientists last year.", options: ["discovered", "was discovered"], correctIndex: 1, explanation: "Planet receives the action → passive: was discovered." },
        { id: "e3q3", prompt: "The fire ___ quickly by the fire brigade.", options: ["put out", "was put out"], correctIndex: 1, explanation: "The fire = patient, agent mentioned → passive: was put out." },
        { id: "e3q4", prompt: "The fire brigade ___ the fire very quickly.", options: ["put out", "was put out"], correctIndex: 0, explanation: "Fire brigade = doer → active: put out." },
        { id: "e3q5", prompt: "The contract ___ by both parties.", options: ["signed", "was signed"], correctIndex: 1, explanation: "Contract receives action → passive: was signed." },
        { id: "e3q6", prompt: "Both parties ___ the contract yesterday.", options: ["signed", "was signed"], correctIndex: 0, explanation: "Parties = doers → active: signed." },
        { id: "e3q7", prompt: "Leonardo da Vinci ___ the Mona Lisa.", options: ["painted", "was painted"], correctIndex: 0, explanation: "Leonardo = doer → active: painted." },
        { id: "e3q8", prompt: "The Mona Lisa ___ by Leonardo da Vinci.", options: ["painted", "was painted"], correctIndex: 1, explanation: "Mona Lisa = patient → passive: was painted." },
        { id: "e3q9", prompt: "Many houses ___ in the earthquake.", options: ["destroyed", "were destroyed"], correctIndex: 1, explanation: "Houses = patient (no clear agent) → passive: were destroyed." },
        { id: "e3q10", prompt: "The earthquake ___ thousands of homes.", options: ["destroyed", "were destroyed"], correctIndex: 0, explanation: "Earthquake = doer → active: destroyed." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Active to Passive",
      instructions: "Rewrite the active sentence using the Past Simple Passive. Write only the passive verb phrase (was/were + pp) or the full sentence as indicated.",
      questions: [
        { id: "e4q1", prompt: "Someone stole my wallet. → My wallet ___.", correct: "was stolen", explanation: "wallet → was stolen (someone omitted)." },
        { id: "e4q2", prompt: "The police arrested three suspects. → Three suspects ___ by the police.", correct: "were arrested", explanation: "suspects → were arrested." },
        { id: "e4q3", prompt: "They built this church in the 15th century. → This church ___ in the 15th century.", correct: "was built", explanation: "church → was built (they omitted)." },
        { id: "e4q4", prompt: "Shakespeare wrote Hamlet. → Hamlet ___ by Shakespeare.", correct: "was written", explanation: "Hamlet → was written." },
        { id: "e4q5", prompt: "Someone broke the window. → The window ___.", correct: "was broken", explanation: "window → was broken (someone omitted)." },
        { id: "e4q6", prompt: "The manager fired two employees. → Two employees ___ by the manager.", correct: "were fired", explanation: "employees → were fired." },
        { id: "e4q7", prompt: "They showed the film at the festival. → The film ___ at the festival.", correct: "was shown", explanation: "film → was shown (they omitted)." },
        { id: "e4q8", prompt: "Someone left the lights on all night. → The lights ___ on all night.", correct: "were left", explanation: "lights → were left (someone omitted)." },
        { id: "e4q9", prompt: "The company launched the product in March. → The product ___ in March by the company.", correct: "was launched", explanation: "product → was launched." },
        { id: "e4q10", prompt: "Thousands of people saw the match. → The match ___ by thousands of people.", correct: "was seen", explanation: "match → was seen." },
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
        <span className="text-slate-700 font-medium">Passive Voice — Past</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Passive Voice —{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Past</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The <b>Past Simple Passive</b> is formed with <b>was / were + past participle</b>: <i>The Eiffel Tower <b>was built</b> in 1889.</i> Use it when the action in the past matters more than who did it, or when the doer is unknown.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-passive-past" subject="Past Passive" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b1-passive-past" subject="Past Passive" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/reported-statements" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Reported Speech — Statements →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Past Simple Passive (B1)</h2>
      <p>The <b>Past Simple Passive</b> is formed with <b>was / were + past participle</b>. Use it when talking about past events where the action or result is more important than who did it.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Forms</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Positive", rows: ["The bridge was built in 1890.", "The reports were sent yesterday."] },
            { label: "Negative", rows: ["It was not (wasn't) delivered.", "They were not (weren't) invited."] },
            { label: "Question", rows: ["Was the letter signed?", "Were the documents checked?"] },
            { label: "With 'by' (agent)", rows: ["Hamlet was written by Shakespeare.", "She was told by her manager."] },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
              {rows.map((r) => <div key={r} className="text-sm text-slate-800 italic">{r}</div>)}
            </div>
          ))}
        </div>
      </div>

      <h3>When to use Past Passive</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { use: "Doer unknown or unimportant", color: "border-violet-200 bg-violet-50 text-violet-700", ex: "My car was stolen. (we don't know who)" },
          { use: "Focus on the result", color: "border-sky-200 bg-sky-50 text-sky-700", ex: "The hospital was built in 1960." },
          { use: "Formal / news reports", color: "border-emerald-200 bg-emerald-50 text-emerald-700", ex: "Three people were arrested." },
          { use: "Historical facts", color: "border-amber-200 bg-amber-50 text-amber-700", ex: "Penicillin was discovered by Fleming." },
        ].map(({ use, color, ex }) => (
          <div key={use} className={`rounded-xl border p-4 ${color}`}>
            <div className="text-sm font-black mb-1">{use}</div>
            <div className="text-sm text-slate-600 italic">{ex}</div>
          </div>
        ))}
      </div>

      <h3>Active → Passive (Past)</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-3 text-sm text-slate-700">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
          <span className="text-xs font-bold text-slate-500 uppercase">Active</span>
          <span className="italic">Shakespeare <b>wrote</b> Hamlet.</span>
          <span className="text-xs font-bold text-slate-500 uppercase">Passive</span>
          <span className="italic">Hamlet <b>was written</b> by Shakespeare.</span>
        </div>
        <div className="text-xs text-slate-500 border-t pt-3">Object → subject · verb → was/were + pp · agent (by …) optional</div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 was or were?</span> Match to the <b>new subject</b>: <b>singular → was</b>, <b>plural → were</b>. <i>The letter <b>was</b> sent. The letters <b>were</b> sent.</i>
        </div>
      </div>
    </div>
  );
}
