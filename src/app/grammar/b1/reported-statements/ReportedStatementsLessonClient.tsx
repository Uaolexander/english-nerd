"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";
import { useLiveSync } from "@/lib/useLiveSync";
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
  { q: "Reported speech: 'I live in Paris.' → She said she ___ in Paris.", options: ["lives", "live", "lived", "will live"], answer: 2 },
  { q: "Reported speech: 'I am tired.' → He said he ___ tired.", options: ["is", "am", "will be", "was"], answer: 3 },
  { q: "Reported speech: 'I have finished.' → She said she ___ finished.", options: ["has", "have", "had", "is"], answer: 2 },
  { q: "Reported speech: 'I will help you.' → He said he ___ help me.", options: ["will", "shall", "would", "could"], answer: 2 },
  { q: "Reported speech: 'I can swim.' → He said he ___ swim.", options: ["can", "will", "shall", "could"], answer: 3 },
  { q: "Reported speech: 'I must leave.' → He said he ___ to leave.", options: ["must", "would", "had", "should"], answer: 2 },
  { q: "'say' vs 'tell': 'She ___ that she was tired.'", options: ["told", "told me", "said", "said me"], answer: 2 },
  { q: "'say' vs 'tell': 'He ___ me that he'd be late.'", options: ["said", "said me", "told", "say"], answer: 2 },
  { q: "Fixed: 'tell a joke' → Past tense:", options: ["said a joke", "told a joke", "said joke", "told joke"], answer: 1 },
  { q: "Fixed: 'say goodbye' → Past tense:", options: ["told goodbye", "said goodbye", "said goodbye to", "told goodbye to"], answer: 1 },
  { q: "In reported speech 'now' becomes:", options: ["here", "there", "then", "today"], answer: 2 },
  { q: "In reported speech 'today' becomes:", options: ["yesterday", "that day", "the next day", "this day"], answer: 1 },
  { q: "In reported speech 'tomorrow' becomes:", options: ["yesterday", "that day", "the next day", "later"], answer: 2 },
  { q: "Backshift: 'was cooking' → reported speech:", options: ["was cooking", "had been cooking", "would be cooking", "is cooking"], answer: 1 },
  { q: "Backshift: 'have been waiting' → reported:", options: ["have been waiting", "had been waiting", "were waiting", "was waiting"], answer: 1 },
  { q: "Backshift: 'don't like' → reported:", options: ["doesn't like", "didn't like", "won't like", "wouldn't like"], answer: 1 },
  { q: "'I am going to resign.' → He said he ___ to resign.", options: ["is going", "was going", "will go", "would go"], answer: 1 },
  { q: "'They are going to move.' → she said they ___ to move.", options: ["are going", "were going", "will go", "would go"], answer: 1 },
  { q: "Which backshift is WRONG?", options: ["live → lived", "will → would", "can → could", "must → musted"], answer: 3 },
  { q: "'I have been waiting.' → She said she ___ waiting.", options: ["has been", "had been", "was", "is"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Reported Statements",
  subtitle: "Backshift, say vs tell, time expressions",
  level: "B1",
  keyRule: "Backshift: present→past, will→would, can→could, must→had to. 'tell' needs an object; 'say' does not.",
  exercises: [
    {
      number: 1,
      title: "Choose the backshifted verb",
      difficulty: "Easy",
      instruction: "Choose the correct backshifted verb.",
      questions: [
        "'I live in Paris.' → She said she ___ in Paris.",
        "'I am tired.' → He said he ___ tired.",
        "'I have finished.' → She said she ___ finished.",
        "'I will help you.' → He said he ___ help me.",
        "'I was cooking.' → She said she ___ cooking.",
        "'I can swim.' → He said he ___ swim.",
        "'I don't know.' → She said she ___ know.",
        "'I am going to leave.' → He said he ___ going to leave.",
        "'I have been waiting.' → She said she ___ waiting.",
        "'I must leave.' → He said he ___ to leave.",
      ],
    },
    {
      number: 2,
      title: "Said or Told?",
      difficulty: "Medium",
      instruction: "Choose 'said' or 'told'. Tell needs an object.",
      questions: [
        "She ___ that she was tired.",
        "He ___ me that he would be late.",
        "They ___ that the meeting was cancelled.",
        "She ___ her friend that she couldn't come.",
        "He ___ a joke and everyone laughed.",
        "She ___ that she had already eaten.",
        "The doctor ___ me I needed to rest.",
        "He ___ the truth in the end.",
        "She ___ goodbye and left.",
        "They ___ us that prices would go up.",
      ],
    },
    {
      number: 3,
      title: "Write the reported statement",
      difficulty: "Hard",
      instruction: "Write the reported clause only.",
      questions: [
        "'I work in hospital.' → He said he ___.",
        "'She is coming tomorrow.' → He said she ___.",
        "'I have lost my keys.' → She said she ___.",
        "'We will finish soon.' → They said they ___.",
        "'I can't find it.' → She said she ___.",
        "'I don't like this.' → He said he ___.",
        "'They are going to move.' → She said they ___.",
        "'I must call her.' → He said he ___ her.",
        "'I was sleeping.' → She said she ___.",
        "'We have been waiting.' → They said they ___.",
      ],
    },
    {
      number: 4,
      title: "Full reported sentences",
      difficulty: "Harder",
      instruction: "Write the complete reported speech sentence.",
      questions: [
        "Direct: 'I live here.' (She / said)",
        "Direct: 'I'll call you tomorrow.' (He / told me)",
        "Direct: 'We have finished the project.' (They / said)",
        "Direct: 'I can't come today.' (She / told him)",
        "Direct: 'I am going to resign.' (He / said)",
        "Direct: 'We were waiting for an hour.' (They / said)",
        "Direct: 'I don't know the answer.' (She / told me)",
        "Direct: 'I must leave now.' (He / said)",
        "Direct: 'We'll be here tomorrow.' (They / told us)",
        "Direct: 'I've never been to Japan.' (She / said)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Backshifted verbs", answers: ["lived", "was", "had", "would", "had been", "could", "didn't", "was", "had been", "had"] },
    { exercise: 2, subtitle: "said / told", answers: ["said", "told", "said", "told", "told", "said", "told", "told", "said", "told"] },
    { exercise: 3, subtitle: "Reported clauses", answers: ["worked in a hospital", "was coming the next day", "had lost her keys", "would finish soon", "couldn't find it", "didn't like it", "were going to move", "had to call", "had been sleeping", "had been waiting"] },
    { exercise: 4, subtitle: "Full sentences", answers: ["she said she lived there", "he told me he would call me the next day", "they said they had finished the project", "she told him she couldn't come that day", "he said he was going to resign", "they said they had been waiting for an hour", "she told me she didn't know the answer", "he said he had to leave then", "they told us they would be there the next day", "she said she had never been to japan"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Reported Questions", href: "/grammar/b1/reported-questions", level: "B1", badge: "bg-violet-500", reason: "Direct companion topic in reported speech" },
  { title: "Defining Relative Clauses", href: "/grammar/b1/relative-clauses-defining", level: "B1", badge: "bg-violet-500" },
  { title: "Modal Verbs: Deduction", href: "/grammar/b1/modal-deduction", level: "B1", badge: "bg-violet-500" },
];

export default function ReportedStatementsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const { isLive, broadcast } = useLiveSync((payload) => {
    setMcqAnswers(payload.answers as Record<string, number | null>);
    setInputAnswers(payload.inputAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct reported verb",
      instructions: "Choose the correct backshifted verb for the reported speech.",
      questions: [
        { id: "e1q1", prompt: "Direct: 'I live in Paris.' → She said she ___ in Paris.", options: ["lives", "lived", "live"], correctIndex: 1, explanation: "Present Simple → Past Simple in reported speech: lives → lived." },
        { id: "e1q2", prompt: "Direct: 'I am tired.' → He said he ___ tired.", options: ["is", "was", "will be"], correctIndex: 1, explanation: "am/is/are → was/were: is → was." },
        { id: "e1q3", prompt: "Direct: 'I have finished.' → She said she ___ finished.", options: ["has", "had", "have"], correctIndex: 1, explanation: "Present Perfect → Past Perfect: has → had." },
        { id: "e1q4", prompt: "Direct: 'I will help you.' → He said he ___ help me.", options: ["will", "would", "shall"], correctIndex: 1, explanation: "will → would in reported speech." },
        { id: "e1q5", prompt: "Direct: 'I was cooking.' → She said she ___ cooking.", options: ["is", "was", "had been"], correctIndex: 2, explanation: "Past Continuous → Past Perfect Continuous: was cooking → had been cooking." },
        { id: "e1q6", prompt: "Direct: 'I can swim.' → He said he ___ swim.", options: ["can", "could", "would"], correctIndex: 1, explanation: "can → could in reported speech." },
        { id: "e1q7", prompt: "Direct: 'I don't know.' → She said she ___ know.", options: ["doesn't", "didn't", "don't"], correctIndex: 1, explanation: "Present Simple negative → Past Simple: doesn't → didn't." },
        { id: "e1q8", prompt: "Direct: 'I am going to leave.' → He said he ___ going to leave.", options: ["is", "was", "will be"], correctIndex: 1, explanation: "am/is → was: is going → was going." },
        { id: "e1q9", prompt: "Direct: 'I have been waiting.' → She said she ___ waiting.", options: ["has been", "had been", "was"], correctIndex: 1, explanation: "Present Perfect Continuous → Past Perfect Continuous: has been → had been." },
        { id: "e1q10", prompt: "Direct: 'I must leave.' → He said he ___ to leave.", options: ["must", "had", "would have"], correctIndex: 1, explanation: "must → had to in reported speech." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Say or Tell?",
      instructions: "Choose 'said' or 'told' to complete the reported speech sentence. Remember: tell needs an object (tell someone), say doesn't.",
      questions: [
        { id: "e2q1", prompt: "She ___ that she was tired.", options: ["said", "told"], correctIndex: 0, explanation: "No object follows → said (not 'said me')." },
        { id: "e2q2", prompt: "He ___ me that he would be late.", options: ["said", "told"], correctIndex: 1, explanation: "Object 'me' follows → told me." },
        { id: "e2q3", prompt: "They ___ that the meeting was cancelled.", options: ["said", "told"], correctIndex: 0, explanation: "No object → said." },
        { id: "e2q4", prompt: "She ___ her friend that she couldn't come.", options: ["said", "told"], correctIndex: 1, explanation: "Object 'her friend' follows → told her friend." },
        { id: "e2q5", prompt: "He ___ a joke and everyone laughed.", options: ["said", "told"], correctIndex: 1, explanation: "tell a joke is a fixed phrase: told a joke." },
        { id: "e2q6", prompt: "She ___ that she had already eaten.", options: ["told", "said"], correctIndex: 1, explanation: "No object → said." },
        { id: "e2q7", prompt: "The doctor ___ me I needed to rest.", options: ["said", "told"], correctIndex: 1, explanation: "Object 'me' follows → told me." },
        { id: "e2q8", prompt: "He ___ the truth in the end.", options: ["said", "told"], correctIndex: 1, explanation: "tell the truth is a fixed phrase → told." },
        { id: "e2q9", prompt: "She ___ goodbye and left.", options: ["said", "told"], correctIndex: 0, explanation: "say goodbye is a fixed phrase → said." },
        { id: "e2q10", prompt: "They ___ us that prices would go up.", options: ["said", "told"], correctIndex: 1, explanation: "Object 'us' follows → told us." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the reported statement",
      instructions: "Change the direct speech to reported speech. Write only the reported clause (e.g. 'she was tired').",
      questions: [
        { id: "e3q1", prompt: "'I work in a hospital.' → He said (that) he ___.", correct: "worked in a hospital", explanation: "work → worked (Present Simple → Past Simple)." },
        { id: "e3q2", prompt: "'She is coming tomorrow.' → He said (that) she ___.", correct: "was coming the next day", explanation: "is coming → was coming; tomorrow → the next day." },
        { id: "e3q3", prompt: "'I have lost my keys.' → She said (that) she ___.", correct: "had lost her keys", explanation: "have lost → had lost (Present Perfect → Past Perfect)." },
        { id: "e3q4", prompt: "'We will finish soon.' → They said (that) they ___.", correct: "would finish soon", explanation: "will → would." },
        { id: "e3q5", prompt: "'I can't find it.' → She said (that) she ___.", correct: "couldn't find it", explanation: "can't → couldn't." },
        { id: "e3q6", prompt: "'I don't like this.' → He said (that) he ___.", correct: "didn't like it", explanation: "don't like → didn't like; this → it." },
        { id: "e3q7", prompt: "'They are going to move.' → She said (that) they ___.", correct: "were going to move", explanation: "are going → were going." },
        { id: "e3q8", prompt: "'I must call her.' → He said (that) he ___ her.", correct: "had to call", explanation: "must → had to." },
        { id: "e3q9", prompt: "'I was sleeping.' → She said (that) she ___.", correct: "had been sleeping", explanation: "was sleeping → had been sleeping." },
        { id: "e3q10", prompt: "'We have been waiting.' → They said (that) they ___.", correct: "had been waiting", explanation: "have been waiting → had been waiting." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Full reported sentences",
      instructions: "Write the complete reported speech sentence, changing pronouns, time expressions, and verbs as needed.",
      questions: [
        { id: "e4q1", prompt: "Direct: 'I live here.' (She / said) →", correct: "she said she lived there", explanation: "I → she; live → lived; here → there." },
        { id: "e4q2", prompt: "Direct: 'I'll call you tomorrow.' (He / told me) →", correct: "he told me he would call me the next day", explanation: "I → he; you → me; 'll → would; tomorrow → the next day." },
        { id: "e4q3", prompt: "Direct: 'We have finished the project.' (They / said) →", correct: "they said they had finished the project", explanation: "We → they; have finished → had finished." },
        { id: "e4q4", prompt: "Direct: 'I can't come today.' (She / told him) →", correct: "she told him she couldn't come that day", explanation: "I → she; can't → couldn't; today → that day." },
        { id: "e4q5", prompt: "Direct: 'I am going to resign.' (He / said) →", correct: "he said he was going to resign", explanation: "I → he; am → was." },
        { id: "e4q6", prompt: "Direct: 'We were waiting for an hour.' (They / said) →", correct: "they said they had been waiting for an hour", explanation: "We → they; were waiting → had been waiting." },
        { id: "e4q7", prompt: "Direct: 'I don't know the answer.' (She / told me) →", correct: "she told me she didn't know the answer", explanation: "I → she; don't → didn't." },
        { id: "e4q8", prompt: "Direct: 'I must leave now.' (He / said) →", correct: "he said he had to leave then", explanation: "I → he; must → had to; now → then." },
        { id: "e4q9", prompt: "Direct: 'We'll be here tomorrow.' (They / told us) →", correct: "they told us they would be there the next day", explanation: "We → they; 'll → would; here → there; tomorrow → the next day." },
        { id: "e4q10", prompt: "Direct: 'I've never been to Japan.' (She / said) →", correct: "she said she had never been to japan", explanation: "I → she; have never been → had never been." },
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

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, inputAnswers: {}, checked: false, exNo }); }
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, inputAnswers: {}, checked: false, exNo: n }); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b1">Grammar B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Reported Speech — Statements</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Reported Speech —{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Statements</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        <b>Reported speech</b> (indirect speech) is used to say what someone said without quoting them directly. Verbs shift back in time: <i>She said she <b>was</b> tired.</i> We also change pronouns and time expressions.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-reported-statements" subject="Reported Statements" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => { setMcqAnswers((p) => { const n = { ...p, [q.id]: oi }; broadcast({ answers: n, checked, exNo }); return n; }); }} />
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
                                <input value={val} disabled={checked} onChange={(e) => { const n = { ...inputAnswers, [q.id]: e.target.value }; setInputAnswers(n); broadcast({ answers: mcqAnswers, inputAnswers: n, checked, exNo }); }} placeholder="Type here…" className="w-full max-w-lg rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
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
                      <button onClick={() => { setChecked(true); broadcast({ answers: mcqAnswers, inputAnswers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
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
          <SpeedRound gameId="grammar-b1-reported-statements" subject="Reported Statements" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/reported-questions" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Reported Speech — Questions →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">REPORTED SPEECH — STATEMENTS</h2>
        <p className="text-slate-500 text-sm">Tense backshift, said vs told, pronoun and time expression changes</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-3">Basic Structure</div>
          <Formula parts={[
            { text: "said/told", color: "green" },
            { text: "(that)", color: "slate" },
            { text: "reported clause", color: "sky" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>She said she was tired.</div>
            <div>He told me he would be late.</div>
          </div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-3">SAY — no object</div>
          <Formula parts={[
            { text: "subject", color: "slate" },
            { text: "said", color: "sky" },
            { text: "(that) + clause", color: "sky" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>She said she was tired. ✓</div>
            <div className="text-red-500 line-through not-italic">She said me that… ✗</div>
          </div>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-violet-600 mb-3">TELL — needs object</div>
          <Formula parts={[
            { text: "subject", color: "slate" },
            { text: "told", color: "violet" },
            { text: "object", color: "yellow" },
            { text: "(that) + clause", color: "violet" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>He told me he was late. ✓</div>
            <div className="text-red-500 line-through not-italic">He told that… ✗</div>
          </div>
        </div>
      </div>

      {/* Tense backshift table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black">!</span>
          <span className="font-black text-slate-900 text-sm">TENSE BACKSHIFT — ONE STEP BACK IN TIME</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Direct speech</th>
                <th className="text-left py-2 font-black text-slate-700">Reported speech</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr><td className="py-2 pr-4 text-slate-600 italic">Present Simple: I work</td><td className="py-2 text-slate-600 italic">Past Simple: she worked</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600 italic">Present Continuous: I am going</td><td className="py-2 text-slate-600 italic">Past Continuous: she was going</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600 italic">Present Perfect: I have done</td><td className="py-2 text-slate-600 italic">Past Perfect: she had done</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600 italic">Past Simple: I went</td><td className="py-2 text-slate-600 italic">Past Perfect: she had gone</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600 italic">will</td><td className="py-2 text-slate-600 italic">would</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600 italic">can</td><td className="py-2 text-slate-600 italic">could</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600 italic">must</td><td className="py-2 text-slate-600 italic">had to</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expression changes */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black">!</span>
          <span className="font-black text-slate-900 text-sm">TIME EXPRESSION CHANGES</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Direct</th>
                <th className="text-left py-2 font-black text-slate-700">Reported</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr><td className="py-2 pr-4 text-slate-600">now</td><td className="py-2 text-slate-600">then</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600">today</td><td className="py-2 text-slate-600">that day</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600">tomorrow</td><td className="py-2 text-slate-600">the next day / the following day</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600">yesterday</td><td className="py-2 text-slate-600">the day before</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600">here</td><td className="py-2 text-slate-600">there</td></tr>
              <tr><td className="py-2 pr-4 text-slate-600">this</td><td className="py-2 text-slate-600">that</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Key words */}
      <div>
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Key Reporting Verbs</div>
        <div className="flex flex-wrap gap-2">
          {["said", "told", "explained", "admitted", "promised", "claimed", "added", "mentioned"].map((w) => (
            <span key={w} className="rounded-lg border border-sky-200 bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800">{w}</span>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Common Mistakes</div>
        <Ex en="She said me that she was tired." correct={false} />
        <Ex en="She told me that she was tired." correct={true} />
        <Ex en="He told that he would be late." correct={false} />
        <Ex en="He said that he would be late." correct={true} />
      </div>

      {/* Amber tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Key tip:</span> The word <strong>that</strong> is optional in reported speech — &ldquo;She said she was tired&rdquo; and &ldquo;She said that she was tired&rdquo; are both correct. In spoken English, <em>that</em> is usually dropped.
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
