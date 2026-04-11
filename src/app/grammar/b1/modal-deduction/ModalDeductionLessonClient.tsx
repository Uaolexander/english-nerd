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
  { q: "Use 'must' for deduction when you are:", options: ["uncertain", "almost certain it's true", "certain it's false", "guessing randomly"], answer: 1 },
  { q: "Use 'can't' for deduction when you are:", options: ["almost certain it's true", "uncertain", "almost certain it's false", "completely sure"], answer: 2 },
  { q: "She's been studying 10h. She ___ be exhausted.", options: ["can't", "must", "might not", "should not"], answer: 1 },
  { q: "He just ate a huge meal. He ___ be hungry.", options: ["must", "can't", "might", "should"], answer: 1 },
  { q: "The light is on. Someone ___ be at home.", options: ["can't", "might not", "must", "would"], answer: 2 },
  { q: "She speaks 6 languages. She ___ be a native of all.", options: ["must", "can't", "might", "should"], answer: 1 },
  { q: "It's July and 35°C. You ___ be cold.", options: ["must", "can't", "might", "could"], answer: 1 },
  { q: "She earns millions. She ___ be poor.", options: ["must", "can't", "might", "should"], answer: 1 },
  { q: "'Must' for deduction vs obligation: 'He must be tired' shows:", options: ["obligation", "deduction", "possibility", "request"], answer: 1 },
  { q: "She's smiling at her phone. She ___ have received good news.", options: ["can't", "must", "might not", "wouldn't"], answer: 1 },
  { q: "Past deduction (near certain): use", options: ["must + verb", "can't + verb", "must have + past participle", "can't + past participle"], answer: 2 },
  { q: "Past deduction (impossible): use", options: ["must have + pp", "can't have + pp", "must + verb", "might + verb"], answer: 1 },
  { q: "He won easily. He ___ trained very hard.", options: ["must be", "must have trained", "can't train", "might train"], answer: 1 },
  { q: "That ___ be Tom — he's in Brazil this week.", options: ["must", "can't", "might", "should"], answer: 1 },
  { q: "She's crying. Something ___ upset her.", options: ["must upset", "must have upset", "can't upset", "might not upset"], answer: 1 },
  { q: "The fridge is empty. Someone ___ all the food.", options: ["must eat", "must have eaten", "can't eat", "might eat"], answer: 1 },
  { q: "'He looks relaxed. He ___ be on holiday.' (present)", options: ["must have been", "must be", "can't have been", "might not be"], answer: 1 },
  { q: "The baby ___ be hungry — she's crying again.", options: ["can't", "must", "might not", "wouldn't"], answer: 1 },
  { q: "She ___ not have received email — no reply yet.", options: ["must", "might", "can't", "should"], answer: 1 },
  { q: "They've been travelling 20h. They ___ be jet-lagged.", options: ["can't", "might not", "must", "wouldn't"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Modal Verbs for Deduction",
  subtitle: "must / can't / might",
  level: "B1",
  keyRule: "must = almost certain true | can't = almost certain false | might = uncertain",
  exercises: [
    {
      number: 1,
      title: "Choose must or can't",
      difficulty: "Easy",
      instruction: "Choose must or can't for deduction.",
      questions: [
        "She studied 10h. She ___ be exhausted.",
        "He just ate. He ___ be hungry now.",
        "The light is on. Someone ___ be home.",
        "She speaks 6 languages. She ___ be native of all.",
        "He worked all night. He ___ be tired.",
        "She got 100% on every test. She ___ be smart.",
        "It's 35°C. You ___ be cold.",
        "The car is gone. He ___ have left.",
        "She earns millions. She ___ be poor.",
        "Travelling 20h. They ___ be jet-lagged.",
      ],
    },
    {
      number: 2,
      title: "Choose must, can't or might",
      difficulty: "Medium",
      instruction: "Choose the correct modal for certainty level.",
      questions: [
        "No answer — they ___ be out. (uncertain)",
        "Wearing coat in summer: he ___ be cold-sensitive.",
        "She checks forecast, so it ___ rain. (impossible)",
        "Music upstairs: neighbours ___ be having party.",
        "2 days without food: he ___ be starving.",
        "I'm not sure, but she ___ know the answer.",
        "He's just a child. He ___ drive a car.",
        "She's smiling: she ___ have received good news.",
        "No one knows: he ___ have gone anywhere.",
        "36h awake: she ___ think straight. (impossible)",
      ],
    },
    {
      number: 3,
      title: "Write must / can't / might + verb",
      difficulty: "Hard",
      instruction: "Write the deduction phrase.",
      questions: [
        "He knows everyone. He ___ (live) here years.",
        "No sleep in days. She ___ (feel) terrible.",
        "That ___ (be) Tom — he's in Brazil.",
        "Passed all exams: He ___ (be) very gifted.",
        "Not sure: she ___ (leave) already.",
        "That's impossible! You ___ (be) serious!",
        "Baby crying: she ___ (be) hungry.",
        "No reply: he ___ (not/receive) the email.",
        "Been to 40 countries: she ___ (love) travel.",
        "Locked + lights off: they ___ (go) out.",
      ],
    },
    {
      number: 4,
      title: "Present or Past deduction?",
      difficulty: "Harder",
      instruction: "Choose present (must be) or past (must have + pp).",
      questions: [
        "She looks pale: She ___ feeling well now.",
        "He won easily: He ___ trained very hard.",
        "She's crying: Something ___ upset her.",
        "Fridge empty: Someone ___ all the food.",
        "He looks relaxed: He ___ on holiday now.",
        "She knew every detail: She ___ read the report.",
        "Unbelievable story: That ___ be true.",
        "Not at party: She ___ the invitation.",
        "He's smiling: He ___ good news.",
        "T-shirt in freezing cold: She ___ be cold.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "must / can't", answers: ["must", "can't", "must", "can't", "must", "must", "can't", "must", "can't", "must"] },
    { exercise: 2, subtitle: "must/can't/might", answers: ["might", "must", "can't", "must", "must", "might", "can't", "must", "might", "can't"] },
    { exercise: 3, subtitle: "Deduction phrases", answers: ["must have lived", "must feel", "can't be", "must be", "might have left", "can't be", "must be", "might not have received", "must love", "must have gone"] },
    { exercise: 4, subtitle: "Present/Past deduction", answers: ["must not be", "must have trained", "must have upset", "must have eaten", "must be", "must have read", "can't be", "can't have received", "must have heard", "must be"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Modal Verbs: Possibility", href: "/grammar/b1/modal-possibility", level: "B1", badge: "bg-violet-500", reason: "Closely related modal verb use" },
  { title: "Reported Statements", href: "/grammar/b1/reported-statements", level: "B1", badge: "bg-violet-500" },
  { title: "Defining Relative Clauses", href: "/grammar/b1/relative-clauses-defining", level: "B1", badge: "bg-violet-500" },
];

export default function ModalDeductionLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — must or can't?",
      instructions: "Choose must (almost certain it's true) or can't (almost certain it's NOT true).",
      questions: [
        { id: "e1q1", prompt: "She's been studying for 10 hours. She ___ be exhausted.", options: ["must", "can't", "might"], correctIndex: 0, explanation: "Logical conclusion from evidence → must be exhausted." },
        { id: "e1q2", prompt: "He just ate a huge meal. He ___ be hungry now.", options: ["must", "can't", "could"], correctIndex: 1, explanation: "It's impossible to be hungry after a huge meal → can't be." },
        { id: "e1q3", prompt: "The light is on. Someone ___ be at home.", options: ["must", "can't", "will"], correctIndex: 0, explanation: "Evidence (light on) → logical conclusion: must be home." },
        { id: "e1q4", prompt: "She speaks six languages perfectly. She ___ be a native speaker of all of them.", options: ["must", "can't", "should"], correctIndex: 1, explanation: "Impossible → can't be a native speaker of all six." },
        { id: "e1q5", prompt: "He's been working all night. He ___ be tired.", options: ["must", "can't", "would"], correctIndex: 0, explanation: "Working all night → logical deduction: must be tired." },
        { id: "e1q6", prompt: "She got 100% on every test this year. She ___ be very intelligent.", options: ["must", "can't", "might not"], correctIndex: 0, explanation: "Strong evidence → must be intelligent." },
        { id: "e1q7", prompt: "It's July and 35 degrees. You ___ be cold.", options: ["must", "can't", "might"], correctIndex: 1, explanation: "Impossible in 35°C → can't be cold." },
        { id: "e1q8", prompt: "The car is gone. He ___ have left already.", options: ["must", "can't", "should"], correctIndex: 0, explanation: "Evidence (car gone) → must have left." },
        { id: "e1q9", prompt: "She earns millions. She ___ be poor.", options: ["must", "can't", "might"], correctIndex: 1, explanation: "Impossible → can't be poor." },
        { id: "e1q10", prompt: "They've been travelling for 20 hours. They ___ be jet-lagged.", options: ["must", "can't", "would"], correctIndex: 0, explanation: "Strong logical conclusion → must be jet-lagged." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Deduction or Possibility?",
      instructions: "Choose must, can't, or might based on the level of certainty in the context.",
      questions: [
        { id: "e2q1", prompt: "There's no answer at the door. They ___ be out, or they ___ just be busy. (uncertain)", options: ["must … can't", "might … might", "can't … must"], correctIndex: 1, explanation: "Two uncertain possibilities → might … might." },
        { id: "e2q2", prompt: "He's wearing a winter coat in summer. He ___ be very cold-sensitive. (near certain)", options: ["might", "must", "can't"], correctIndex: 1, explanation: "Strong logical conclusion → must." },
        { id: "e2q3", prompt: "She left her umbrella at home. It ___ rain — she always checks the forecast. (near impossible)", options: ["must", "might", "can't"], correctIndex: 2, explanation: "She always checks → it can't rain (she'd have taken the umbrella)." },
        { id: "e2q4", prompt: "I hear music from upstairs. The neighbours ___ be having a party. (fairly sure)", options: ["can't", "must", "might not"], correctIndex: 1, explanation: "Evidence supports a clear conclusion → must." },
        { id: "e2q5", prompt: "He hasn't eaten in two days. He ___ be starving. (near certain)", options: ["might", "can't", "must"], correctIndex: 2, explanation: "Two days without food → must be starving." },
        { id: "e2q6", prompt: "I'm not sure, but she ___ know the answer. (uncertain)", options: ["must", "might", "can't"], correctIndex: 1, explanation: "Uncertainty expressed → might." },
        { id: "e2q7", prompt: "He's just a child. He ___ drive a car. (impossible)", options: ["must", "might", "can't"], correctIndex: 2, explanation: "Children can't drive legally → can't." },
        { id: "e2q8", prompt: "She's smiling at her phone. She ___ have received good news. (logical guess)", options: ["can't", "must", "might not"], correctIndex: 1, explanation: "Smiling at phone → must have received good news." },
        { id: "e2q9", prompt: "No one knows where he went. He ___ have gone anywhere. (uncertain)", options: ["must", "might", "can't"], correctIndex: 1, explanation: "Uncertainty → might have gone." },
        { id: "e2q10", prompt: "She's been awake for 36 hours. She ___ be able to think straight. (near impossible)", options: ["must", "might", "can't"], correctIndex: 2, explanation: "36 hours awake → can't think straight." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the deduction",
      instructions: "Complete the sentence using must, can't, or might + the verb in brackets.",
      questions: [
        { id: "e3q1", prompt: "He knows everyone here. He ___ (live) in this town for years.", correct: "must have lived", explanation: "Strong deduction about the past → must have lived." },
        { id: "e3q2", prompt: "She hasn't slept in days. She ___ (feel) terrible.", correct: "must feel", explanation: "Logical conclusion → must feel terrible." },
        { id: "e3q3", prompt: "That ___ (be) Tom — he's in Brazil this week.", correct: "can't be", explanation: "Impossible if he's abroad → can't be." },
        { id: "e3q4", prompt: "He passed every exam without studying. He ___ (be) very gifted.", correct: "must be", explanation: "Strong conclusion from evidence → must be." },
        { id: "e3q5", prompt: "I'm not sure, but she ___ (leave) already.", correct: "might have left", explanation: "Uncertainty about past event → might have left." },
        { id: "e3q6", prompt: "You ___ (be) serious — that's impossible!", correct: "can't be", explanation: "Disbelief / near-impossible → can't be serious." },
        { id: "e3q7", prompt: "The baby ___ (be) hungry — she's crying again.", correct: "must be", explanation: "Logical deduction from behaviour → must be." },
        { id: "e3q8", prompt: "He didn't reply. He ___ (not / receive) the email.", correct: "might not have received", explanation: "Possible explanation → might not have received." },
        { id: "e3q9", prompt: "She's been to 40 countries. She ___ (love) travelling.", correct: "must love", explanation: "Strong deduction → must love." },
        { id: "e3q10", prompt: "The door is locked and the lights are off. They ___ (go) out.", correct: "must have gone", explanation: "Evidence → must have gone out." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Hardest) — Present or Past Deduction?",
      instructions: "Choose the correct form: must/can't be (present) or must/can't have + past participle (past).",
      questions: [
        { id: "e4q1", prompt: "She looks pale. She ___ feeling well right now.", options: ["must not be", "must not have been", "can't have been"], correctIndex: 0, explanation: "Present state → must not be (feeling well now)." },
        { id: "e4q2", prompt: "He won the race easily. He ___ trained very hard before.", options: ["must be", "must have trained", "can't train"], correctIndex: 1, explanation: "Past preparation → must have trained." },
        { id: "e4q3", prompt: "She's crying. Something ___ her.", options: ["must upset", "must have upset", "can't upset"], correctIndex: 1, explanation: "Something happened before the crying → must have upset." },
        { id: "e4q4", prompt: "The fridge is empty. Someone ___ all the food.", options: ["must eat", "must have eaten", "can't eat"], correctIndex: 1, explanation: "Past action with present evidence → must have eaten." },
        { id: "e4q5", prompt: "He looks so relaxed. He ___ on holiday right now.", options: ["must be", "must have been", "can't have been"], correctIndex: 0, explanation: "Present observable state → must be." },
        { id: "e4q6", prompt: "She knew every detail. She ___ the report beforehand.", options: ["must read", "must have read", "can't read"], correctIndex: 1, explanation: "Past preparation → must have read." },
        { id: "e4q7", prompt: "That story ___ true — it's completely unbelievable.", options: ["can't be", "can't have been", "must be"], correctIndex: 0, explanation: "Present assessment → can't be true." },
        { id: "e4q8", prompt: "She wasn't at the party. She ___ the invitation.", options: ["can't receive", "can't have received", "must receive"], correctIndex: 1, explanation: "Past action → can't have received." },
        { id: "e4q9", prompt: "He's smiling. He ___ good news.", options: ["must hear", "must have heard", "can't hear"], correctIndex: 1, explanation: "Present result of past action → must have heard." },
        { id: "e4q10", prompt: "It's freezing outside and she's in a T-shirt. She ___ cold.", options: ["must be", "must have been", "can't be"], correctIndex: 0, explanation: "Present obvious state → must be cold." },
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
        <span className="text-slate-700 font-medium">Modal Verbs — Deduction</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Modal Verbs —{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Deduction</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>must</b> when you're almost certain something is true, and <b>can't</b> when you're almost certain it's NOT true. Use <b>might / could</b> when you're less sure: <i>She <b>must be</b> tired. That <b>can't be</b> right. He <b>might have</b> left.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-modal-deduction" subject="Modal Deduction" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-b1-modal-deduction" subject="Modal Deduction" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/zero-first-conditional" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Zero &amp; First Conditional →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Modal Verbs — Deduction (B1)</h2>
      <p>We use modal verbs to make logical deductions — conclusions based on evidence, not direct knowledge.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">The three modals of deduction</div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { modal: "must", certainty: "~90% certain it IS true", ex: "She must be tired — she worked all day.", color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
            { modal: "can't", certainty: "~90% certain it is NOT true", ex: "That can't be right — it's impossible.", color: "border-red-200 bg-red-50 text-red-700" },
            { modal: "might / could", certainty: "~50% — not sure either way", ex: "He might have missed the bus.", color: "border-amber-200 bg-amber-50 text-amber-700" },
          ].map(({ modal, certainty, ex, color }) => (
            <div key={modal} className={`rounded-xl border p-4 ${color}`}>
              <div className="text-base font-black mb-1">{modal}</div>
              <div className="text-xs mb-2">{certainty}</div>
              <div className="text-sm text-slate-600 italic">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      <h3>Present vs Past deduction</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { use: "Present deduction", color: "border-violet-200 bg-violet-50 text-violet-700", ex: "must/can't + be/know/feel…\nShe must be at work. (now)" },
          { use: "Past deduction", color: "border-sky-200 bg-sky-50 text-sky-700", ex: "must/can't + have + past participle\nShe must have left already. (before)" },
        ].map(({ use, color, ex }) => (
          <div key={use} className={`rounded-xl border p-4 ${color}`}>
            <div className="text-sm font-black mb-1">{use}</div>
            <div className="text-sm text-slate-600 whitespace-pre-line italic">{ex}</div>
          </div>
        ))}
      </div>

      <h3>Deduction vs Obligation</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-3 text-sm text-slate-700">
        <div><b>must</b> for deduction: <i>He <b>must be</b> tired.</i> (I conclude this from evidence)</div>
        <div><b>must</b> for obligation: <i>You <b>must</b> show your passport.</i> (it is required)</div>
        <div className="text-xs text-slate-400 border-t pt-2">Context makes the difference — deduction has evidence, obligation has rules.</div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 can't vs couldn't:</span> For present deduction use <b>can't</b>. <i>That can't be true.</i> Use <b>couldn't</b> for past deduction: <i>She couldn't have known — it was a secret.</i>
        </div>
      </div>
    </div>
  );
}
