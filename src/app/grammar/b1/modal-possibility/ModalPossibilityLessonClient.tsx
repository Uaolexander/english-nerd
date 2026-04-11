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
  { q: "Which modal expresses possibility?", options: ["must", "can't", "might", "will definitely"], answer: 2 },
  { q: "'She ___ be at the library.' (uncertain)", options: ["must", "might", "will", "should"], answer: 1 },
  { q: "'It ___ rain later — bring umbrella.' (uncertain future)", options: ["must", "will", "could", "should"], answer: 2 },
  { q: "May / might / could all express:", options: ["certainty", "possibility", "obligation", "impossibility"], answer: 1 },
  { q: "'I ___ come to the party, but not sure.' Correct:", options: ["must", "might", "will", "should"], answer: 1 },
  { q: "'She ___ be right — I hadn't thought of that.'", options: ["must", "might", "will", "can't"], answer: 1 },
  { q: "Past possibility: 'He ___ have missed the bus.'", options: ["must have", "might have", "can't have", "will have"], answer: 1 },
  { q: "'It ___ not rain tomorrow.' Means:", options: ["It will definitely be sunny.", "There's a chance it won't rain.", "It will definitely rain.", "It must be sunny."], answer: 1 },
  { q: "Which expresses MORE certainty?", options: ["She might come.", "She could come.", "She will probably come.", "She may come."], answer: 2 },
  { q: "Which expresses LEAST certainty?", options: ["She should be there.", "She will be there.", "She might be there.", "She ought to be there."], answer: 2 },
  { q: "'The keys ___ be in the kitchen.' Correct:", options: ["must", "could", "will", "can't"], answer: 1 },
  { q: "'She ___ not have seen your message.' (possible)", options: ["must", "may", "will", "should"], answer: 1 },
  { q: "Which is a past possibility?", options: ["She might be home.", "She could be home.", "She might have left.", "She must be home."], answer: 2 },
  { q: "'This ___ be a problem.' (possible)", options: ["must", "will", "could", "can't"], answer: 2 },
  { q: "'You ___ be right.' The speaker thinks:", options: ["You are wrong.", "Possibly you are right.", "You are definitely right.", "You should be right."], answer: 1 },
  { q: "'They ___ arrive any minute.' (expected)", options: ["might not", "could not", "should", "must not"], answer: 2 },
  { q: "'It ___ have been a mistake.' This refers to:", options: ["a certain past event", "a possible past event", "a future event", "a general truth"], answer: 1 },
  { q: "Best way to say 50% chance of rain:", options: ["It will rain.", "It must rain.", "It might rain.", "It can't rain."], answer: 2 },
  { q: "'There ___ be an accident.' (explaining road closure)", options: ["must", "will", "could", "can't"], answer: 2 },
  { q: "'Don't call now — they ___ be sleeping.'", options: ["must", "may", "will", "can't"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Modal Verbs for Possibility",
  subtitle: "may / might / could",
  level: "B1",
  keyRule: "may / might / could = possible (not certain) | might have + pp = past possibility",
  exercises: [
    {
      number: 1,
      title: "Choose might, may or could",
      difficulty: "Easy",
      instruction: "Choose the best modal for possibility.",
      questions: [
        "She ___ be at the library. (uncertain)",
        "It ___ rain later — bring umbrella.",
        "He ___ not have seen your message.",
        "There's a chance we ___ finish early.",
        "She ___ be right — I hadn't thought of it.",
        "Don't call — they ___ be sleeping.",
        "The meeting ___ start late. We'll see.",
        "I ___ come to the party — not sure yet.",
        "No answer. She ___ have left already.",
        "Keys ___ be in kitchen — I left them there.",
      ],
    },
    {
      number: 2,
      title: "Possibility vs Certainty",
      difficulty: "Medium",
      instruction: "Choose the modal matching the certainty level.",
      questions: [
        "He's late again. He ___ have missed bus. (possible)",
        "She knows topic well. She ___ pass. (certain)",
        "Undecided: I ___ go, I ___ not. (50/50)",
        "No light on. They ___ be out. (fairly possible)",
        "Roads icy. Journey ___ take longer. (possible)",
        "Don't worry — it ___ not be as bad. (possible)",
        "She practises daily. She ___ win. (likely)",
        "Left my phone. It ___ be in my bag. (possible)",
        "They said 6pm. They ___ arrive any minute.",
        "Difficult exam. Some students ___ fail.",
      ],
    },
    {
      number: 3,
      title: "Write might / may / could + verb",
      difficulty: "Hard",
      instruction: "Write the possibility phrase.",
      questions: [
        "Not sure about tomorrow: I ___ (come).",
        "Not answering: she ___ (be) busy.",
        "Take coat — it ___ (get) cold later.",
        "He ___ (not/know) about the change.",
        "Chance they ___ (cancel) the event.",
        "She ___ (be) at home — try calling.",
        "Test ___ (not/be) as hard as we thought.",
        "I left keys inside: I ___ (lock) myself out.",
        "Road closed: there ___ (be) an accident.",
        "Traffic bad: they ___ (arrive) late.",
      ],
    },
    {
      number: 4,
      title: "Choose the correct interpretation",
      difficulty: "Harder",
      instruction: "What does the sentence mean?",
      questions: [
        "'She might be at work.' This means:",
        "'He could have taken wrong train.' This means:",
        "'It may not rain tomorrow.' This means:",
        "'They might not know.' This means:",
        "'This could be a problem.' This means:",
        "Which is MORE certain?",
        "Which is LEAST certain?",
        "'You could be right.' Speaker thinks:",
        "'It may have been a mistake.' Refers to:",
        "Best way to say 50% chance of rain:",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Possibility modals", answers: ["might", "could", "may", "could", "might", "may", "could", "might", "may", "could"] },
    { exercise: 2, subtitle: "Certainty levels", answers: ["might have", "will", "might / might not", "may", "could", "might", "should", "could", "should", "might"] },
    { exercise: 3, subtitle: "Possibility phrases", answers: ["might come", "may be", "could get", "might not know", "might cancel", "could be", "may not be", "might have locked", "could be", "might arrive"] },
    { exercise: 4, subtitle: "Meanings", answers: ["It's possible she's at work", "It's possible he took wrong train", "There's a chance it won't rain", "It's possible they don't know", "It's possible this will cause a problem", "She will probably come", "She might be there", "Possibly you are right", "A possible past event", "It might rain"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Modal Verbs: Deduction", href: "/grammar/b1/modal-deduction", level: "B1", badge: "bg-violet-500", reason: "Closely related modal verb use" },
  { title: "Second Conditional", href: "/grammar/b1/second-conditional", level: "B1", badge: "bg-violet-500" },
  { title: "Wish + Past", href: "/grammar/b1/wish-past", level: "B1", badge: "bg-violet-500" },
];

export default function ModalPossibilityLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — might, may or could?",
      instructions: "Choose the best modal verb for possibility. All three can sometimes work — choose the most natural one.",
      questions: [
        { id: "e1q1", prompt: "I'm not sure where she is. She ___ be at the library.", options: ["might", "must", "will"], correctIndex: 0, explanation: "'Might' expresses uncertainty about a current or future situation." },
        { id: "e1q2", prompt: "It ___ rain later — bring an umbrella just in case.", options: ["must", "could", "should"], correctIndex: 1, explanation: "'Could' expresses a future possibility that is uncertain." },
        { id: "e1q3", prompt: "He hasn't replied yet. He ___ not have seen your message.", options: ["may", "will", "must"], correctIndex: 0, explanation: "'May not' = it's possible he hasn't seen it." },
        { id: "e1q4", prompt: "There's a chance we ___ finish early today.", options: ["could", "must", "will"], correctIndex: 0, explanation: "'Could' = there's a chance / possibility." },
        { id: "e1q5", prompt: "She ___ be right — I hadn't thought of that.", options: ["might", "must", "shall"], correctIndex: 0, explanation: "'Might' = it's possible she is right." },
        { id: "e1q6", prompt: "Don't call now — they ___ be sleeping.", options: ["may", "will", "do"], correctIndex: 0, explanation: "'May be sleeping' = possibly sleeping right now." },
        { id: "e1q7", prompt: "The meeting ___ start late. We'll see.", options: ["could", "must", "shall"], correctIndex: 0, explanation: "'Could start late' = it's a possibility." },
        { id: "e1q8", prompt: "I ___ come to the party, but I'm not sure yet.", options: ["might", "must", "would"], correctIndex: 0, explanation: "'Might come' = uncertain possibility." },
        { id: "e1q9", prompt: "There's no answer. She ___ have left already.", options: ["may", "shall", "will"], correctIndex: 0, explanation: "'May have left' = possibly she has already left." },
        { id: "e1q10", prompt: "The keys ___ be in the kitchen — I left them there.", options: ["could", "must", "shall"], correctIndex: 0, explanation: "'Could be' = it's possible they're there." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Possibility vs Certainty",
      instructions: "Choose the modal that fits the meaning in brackets.",
      questions: [
        { id: "e2q1", prompt: "He's late again. He ___ have missed the bus. (possible)", options: ["might", "will", "should"], correctIndex: 0, explanation: "'Might have' = it's possible this happened in the past." },
        { id: "e2q2", prompt: "She knows this topic inside out. She ___ pass. (almost certain)", options: ["could", "might", "will"], correctIndex: 2, explanation: "'Will' = near certainty / strong expectation." },
        { id: "e2q3", prompt: "I haven't decided yet — I ___ go, I ___ not. (50/50)", options: ["might … might", "will … will", "must … must"], correctIndex: 0, explanation: "'Might … might not' expresses uncertainty in both directions." },
        { id: "e2q4", prompt: "There's no light on. They ___ be out. (fairly possible)", options: ["may", "must", "will"], correctIndex: 0, explanation: "'May be out' = it's quite possible." },
        { id: "e2q5", prompt: "The roads are icy. The journey ___ take longer. (possible)", options: ["could", "must", "shall"], correctIndex: 0, explanation: "'Could take longer' = a real possibility." },
        { id: "e2q6", prompt: "Don't worry — it ___ not be as bad as you think. (possible)", options: ["might", "will", "must"], correctIndex: 0, explanation: "'Might not be' = it's possible it won't be bad." },
        { id: "e2q7", prompt: "She practises every day. She ___ win the competition. (likely)", options: ["should", "might not", "could not"], correctIndex: 0, explanation: "'Should win' = it's likely / expected." },
        { id: "e2q8", prompt: "I left my phone somewhere. It ___ be in my bag. (possible)", options: ["could", "must", "will"], correctIndex: 0, explanation: "'Could be' = one possible location." },
        { id: "e2q9", prompt: "They said they'd be here by 6. They ___ arrive any minute. (expected)", options: ["should", "might not", "could not"], correctIndex: 0, explanation: "'Should arrive' = expected to arrive." },
        { id: "e2q10", prompt: "It's a difficult exam. Some students ___ fail. (possible)", options: ["might", "must", "will"], correctIndex: 0, explanation: "'Might fail' = it's possible some students will fail." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the correct modal phrase",
      instructions: "Complete the sentence with might, may, or could + the verb in brackets.",
      questions: [
        { id: "e3q1", prompt: "I'm not sure about tomorrow. I ___ (come) to the meeting.", correct: "might come", explanation: "Uncertainty about future → might come." },
        { id: "e3q2", prompt: "She's not answering. She ___ (be) busy.", correct: "may be", explanation: "Present possibility → may be." },
        { id: "e3q3", prompt: "Take a coat — it ___ (get) cold later.", correct: "could get", explanation: "Future possibility → could get." },
        { id: "e3q4", prompt: "He ___ (not / know) about the change yet.", correct: "might not know", explanation: "Negative possibility → might not know." },
        { id: "e3q5", prompt: "There's a chance they ___ (cancel) the event.", correct: "might cancel", explanation: "Uncertain future event → might cancel." },
        { id: "e3q6", prompt: "She ___ (be) at home — try calling her.", correct: "could be", explanation: "Suggestion of possibility → could be." },
        { id: "e3q7", prompt: "The test ___ (not / be) as hard as we thought.", correct: "may not be", explanation: "Negative possibility → may not be." },
        { id: "e3q8", prompt: "I left the keys inside. I ___ (have / lock) myself out.", correct: "might have locked", explanation: "Past possibility → might have locked." },
        { id: "e3q9", prompt: "This road is closed. There ___ (be) an accident.", correct: "could be", explanation: "Present possibility explaining a situation → could be." },
        { id: "e3q10", prompt: "They ___ (arrive) late — the traffic is terrible.", correct: "might arrive", explanation: "Uncertain future → might arrive." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Hardest) — Choose the correct meaning",
      instructions: "Read the sentence and choose the correct interpretation.",
      questions: [
        { id: "e4q1", prompt: "'She might be at work.' This means:", options: ["She is definitely at work.", "It's possible she's at work.", "She should be at work."], correctIndex: 1, explanation: "'Might' = it's possible — not certain." },
        { id: "e4q2", prompt: "'He could have taken the wrong train.' This means:", options: ["It's possible he took the wrong train.", "He definitely took the wrong train.", "He should have taken the right train."], correctIndex: 0, explanation: "'Could have' = past possibility — we don't know for sure." },
        { id: "e4q3", prompt: "'It may not rain tomorrow.' This means:", options: ["It will definitely be sunny.", "There's a chance it won't rain.", "It will probably rain."], correctIndex: 1, explanation: "'May not' = it's possible it won't rain." },
        { id: "e4q4", prompt: "'They might not know about this.' This means:", options: ["They definitely don't know.", "It's possible they don't know.", "They shouldn't know."], correctIndex: 1, explanation: "'Might not' = uncertainty, not certainty." },
        { id: "e4q5", prompt: "'This could be a problem.' This means:", options: ["This is definitely a problem.", "It's possible this will cause a problem.", "This is not a problem."], correctIndex: 1, explanation: "'Could be' = possibility, not fact." },
        { id: "e4q6", prompt: "Which sentence expresses MORE certainty?", options: ["She might come.", "She will probably come.", "She could come."], correctIndex: 1, explanation: "'Will probably' > 'might' / 'could' in terms of certainty." },
        { id: "e4q7", prompt: "Which sentence expresses LEAST certainty?", options: ["She should be there by now.", "She might be there.", "She will be there."], correctIndex: 1, explanation: "'Might' is the least certain — just a possibility." },
        { id: "e4q8", prompt: "'You could be right.' The speaker thinks:", options: ["You are wrong.", "It's possible you are right.", "You are definitely right."], correctIndex: 1, explanation: "'Could be right' = I'm not sure, but it's possible." },
        { id: "e4q9", prompt: "'It may have been a mistake.' This refers to:", options: ["A possible past event.", "A definite past event.", "A future possibility."], correctIndex: 0, explanation: "'May have been' = past possibility." },
        { id: "e4q10", prompt: "Which is the most natural way to say there's a 50% chance of rain?", options: ["It will rain.", "It might rain.", "It must rain."], correctIndex: 1, explanation: "'It might rain' = uncertain possibility — perfect for 50/50." },
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
        <span className="text-slate-700 font-medium">Modal Verbs — Possibility</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Modal Verbs —{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Possibility</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>might</b>, <b>may</b>, and <b>could</b> to talk about things that are <b>possibly</b> true now or in the future. All three express uncertainty: <i>It <b>might</b> rain. She <b>could</b> be right. He <b>may</b> not know.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-modal-possibility" subject="Modal Possibility" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-b1-modal-possibility" subject="Modal Possibility" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/modal-deduction" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Modal Verbs — Deduction →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Modal Verbs — Possibility (B1)</h2>
      <p>Use <b>might</b>, <b>may</b>, and <b>could</b> to say something is <b>possibly</b> true or will possibly happen. All are followed by the <b>bare infinitive</b> (no <i>to</i>).</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">The three modals of possibility</div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { modal: "might", note: "Uncertain possibility (50% or less)", ex: "It might rain later." },
            { modal: "may", note: "Slightly more formal than might, similar meaning", ex: "She may not come." },
            { modal: "could", note: "One of several possibilities", ex: "He could be at work." },
          ].map(({ modal, note, ex }) => (
            <div key={modal} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-base font-black text-slate-900 mb-1">{modal}</div>
              <div className="text-xs text-slate-500 mb-2">{note}</div>
              <div className="text-sm text-slate-700 italic">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      <h3>Forms</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { use: "Present / future possibility", color: "border-violet-200 bg-violet-50 text-violet-700", ex: "She might be at home.\nIt could rain tomorrow." },
          { use: "Negative possibility", color: "border-sky-200 bg-sky-50 text-sky-700", ex: "He may not know.\nThey might not come." },
          { use: "Past possibility", color: "border-emerald-200 bg-emerald-50 text-emerald-700", ex: "She might have left already.\nHe could have missed the bus." },
          { use: "Questions (could only)", color: "border-amber-200 bg-amber-50 text-amber-700", ex: "Could she be right?\n(might/may rarely used in questions)" },
        ].map(({ use, color, ex }) => (
          <div key={use} className={`rounded-xl border p-4 ${color}`}>
            <div className="text-sm font-black mb-1">{use}</div>
            <div className="text-sm text-slate-600 whitespace-pre-line italic">{ex}</div>
          </div>
        ))}
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Certainty scale:</span>
          <div className="mt-2 flex items-center gap-2 flex-wrap text-sm">
            <span className="rounded-lg bg-red-100 px-2 py-1 text-red-700 font-semibold">can't (impossible)</span>
            <span className="text-slate-400">→</span>
            <span className="rounded-lg bg-amber-100 px-2 py-1 text-amber-700 font-semibold">might / may / could</span>
            <span className="text-slate-400">→</span>
            <span className="rounded-lg bg-sky-100 px-2 py-1 text-sky-700 font-semibold">should (likely)</span>
            <span className="text-slate-400">→</span>
            <span className="rounded-lg bg-emerald-100 px-2 py-1 text-emerald-700 font-semibold">must (almost certain)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
