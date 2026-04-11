"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF, type LessonPDFConfig } from "@/lib/generateLessonPDF";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Advanced Inversion", href: "/grammar/c1/advanced-inversion", level: "C1", badge: "bg-sky-600", reason: "Inverted conditionals are a special case of subject-verb inversion" },
  { title: "Subjunctive", href: "/grammar/c1/subjunctive", level: "C1", badge: "bg-sky-600" },
  { title: "Advanced Modals", href: "/grammar/c1/advanced-modals", level: "C1", badge: "bg-sky-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Inverted conditional drops 'if' and:", options: ["Moves aux before subject", "Adds 'would'", "Uses passive", "Adds 'should'"], answer: 0 },
  { q: "___ I known, I'd have helped.", options: ["Had", "If", "Should", "Were"], answer: 0 },
  { q: "___ you need help, call me.", options: ["Should", "Had", "Were", "Would"], answer: 0 },
  { q: "___ it not for the rain, we'd go.", options: ["Were", "Had", "Should", "If"], answer: 0 },
  { q: "Had she arrived earlier, ___ .", options: ["she'd have seen him", "she sees him", "she saw him", "she'd see him"], answer: 0 },
  { q: "Should they refuse, ___ .", options: ["we'll take action", "we'd take action", "we took action", "we'd taken action"], answer: 0 },
  { q: "'Were it not for' = ___.", options: ["If it weren't for", "Because of", "Despite", "Although"], answer: 0 },
  { q: "Inverted type 2: Were I you, ___.", options: ["I'd apologise", "I apologise", "I apologised", "I'll apologise"], answer: 0 },
  { q: "Inverted type 3: Had they known, ___.", options: ["they'd have acted", "they'd act", "they act", "they've acted"], answer: 0 },
  { q: "Type 1 inversion uses which aux?", options: ["Should", "Had", "Were", "Would"], answer: 0 },
  { q: "Type 2 inversion uses which aux?", options: ["Were", "Should", "Had", "Will"], answer: 0 },
  { q: "Type 3 inversion uses which aux?", options: ["Had", "Were", "Should", "Would"], answer: 0 },
  { q: "___ he to resign, chaos follows.", options: ["Were", "Should", "Had", "Would"], answer: 0 },
  { q: "Inverted conditionals are used in:", options: ["Formal/written English", "Informal speech only", "Questions only", "Commands only"], answer: 0 },
  { q: "Should you change mind, ___ .", options: ["let me know", "you let me know", "let knowing", "known let"], answer: 0 },
  { q: "Had we not acted, ___ .", options: ["it'd have been worse", "it will be worse", "it was worse", "it would be worse"], answer: 0 },
  { q: "Were she here, ___ .", options: ["she'd be proud", "she was proud", "she'll be proud", "she'd been proud"], answer: 0 },
  { q: "___ I in your position, I'd quit.", options: ["Were", "Had", "Should", "Would"], answer: 0 },
  { q: "Were it possible, ___ .", options: ["I'd do it differently", "I'd done it", "I did it", "I do it"], answer: 0 },
  { q: "Had she studied harder, ___ .", options: ["she'd have passed", "she'd pass", "she passes", "she'd passed"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Inverted Conditionals",
  subtitle: "Formal conditionals without 'if': had/were/should",
  level: "C1",
  keyRule: "Inverted conditionals drop 'if' and move aux before subject.",
  exercises: [
    {
      number: 1,
      title: "Type 1 Inversion with Should",
      difficulty: "Easy",
      instruction: "Choose the correct inverted conditional.",
      questions: [
        "___ you need help, call me.",
        "___ any problems arise, contact.",
        "___ they agree, we proceed.",
        "___ she change her mind, inform.",
        "___ the plan fail, try again.",
        "___ we need more data, request.",
        "___ he be interested, show him.",
        "___ the team be available, call.",
        "___ costs increase, adjust budget.",
        "___ you wish to leave, go now.",
      ],
      hint: "Should you / Should any",
    },
    {
      number: 2,
      title: "Type 2 Inversion with Were",
      difficulty: "Medium",
      instruction: "Complete with the correct were-inversion.",
      questions: [
        "___ I you, I'd apologise now.",
        "___ it not for rain, we'd go.",
        "___ she here, she'd be proud.",
        "___ he the manager, he'd act.",
        "___ it possible, I'd help more.",
        "___ they to refuse, we'd leave.",
        "___ I in your shoes, I'd quit.",
        "___ this true, it'd be shocking.",
        "___ she aware, she'd object.",
        "___ I free this weekend, I'd come.",
      ],
      hint: "Were I / Were it not for / Were she",
    },
    {
      number: 3,
      title: "Type 3 Inversion with Had",
      difficulty: "Hard",
      instruction: "Complete with the correct had-inversion.",
      questions: [
        "___ she earlier, she'd have seen.",
        "___ we known, we'd have acted.",
        "___ they prepared, they'd have won.",
        "___ he studied, he'd have passed.",
        "___ I listened, I'd have known.",
        "___ we not acted, it'd be worse.",
        "___ she been told, she'd left.",
        "___ they checked, errors avoided.",
        "___ he agreed, plan would've worked.",
        "___ I refused, outcome different.",
      ],
      hint: "Had she / Had we not",
    },
    {
      number: 4,
      title: "Rewrite as Inverted Conditional",
      difficulty: "Very Hard",
      instruction: "Rewrite using an inverted conditional.",
      questions: [
        "If you need help, call me.",
        "If I were you, I'd apologise.",
        "If they had known, they'd acted.",
        "If it weren't for you, I'd fail.",
        "If she changes mind, let me know.",
        "If we had prepared, we'd have won.",
        "If he were here, he'd be proud.",
        "If problems arise, contact us.",
        "If they had checked, no errors.",
        "If it were possible, I'd help.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Type 1 Inversion with Should", answers: ["Should you", "Should any", "Should they", "Should she", "Should the plan", "Should we", "Should he", "Should the team", "Should costs", "Should you wish"] },
    { exercise: 2, subtitle: "Type 2 Inversion with Were", answers: ["Were I", "Were it not for", "Were she", "Were he", "Were it", "Were they", "Were I", "Were this", "Were she", "Were I"] },
    { exercise: 3, subtitle: "Type 3 Inversion with Had", answers: ["Had she arrived earlier", "Had we known", "Had they prepared", "Had he studied", "Had I listened", "Had we not acted", "Had she been told", "Had they checked", "Had he agreed", "Had I refused"] },
    { exercise: 4, subtitle: "Rewrite as Inverted Conditional", answers: ["Should you need help, call me.", "Were I you, I'd apologise.", "Had they known, they'd have acted.", "Were it not for you, I'd fail.", "Should she change her mind, let me know.", "Had we prepared, we'd have won.", "Were he here, he'd be proud.", "Should any problems arise, contact us.", "Had they checked, there would have been no errors.", "Were it possible, I'd help."] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function InvertedConditionalsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Match the inverted conditional to its if-clause equivalent",
      instructions: "Each inverted conditional has an equivalent if-clause. Choose the matching normal conditional.",
      questions: [
        { id: "e1q1", prompt: "Should you need any assistance, please contact reception.", options: ["If you needed…", "If you should need… / If you need…", "If you had needed…"], correctIndex: 1, explanation: "Should + subject + infinitive = if + present simple (polite/formal 1st conditional)." },
        { id: "e1q2", prompt: "Were I to accept this offer, I would have to relocate.", options: ["If I accepted…", "If I had accepted…", "If I will accept…"], correctIndex: 0, explanation: "Were + subject + to-infinitive = if + past simple (2nd conditional — hypothetical)." },
        { id: "e1q3", prompt: "Had she known the truth, she would have acted differently.", options: ["If she knew…", "If she knows…", "If she had known…"], correctIndex: 2, explanation: "Had + subject + pp = if + past perfect (3rd conditional — past unreal)." },
        { id: "e1q4", prompt: "Should the payment fail to arrive, we will take legal action.", options: ["If the payment failed…", "If the payment had failed…", "If the payment fails…"], correctIndex: 2, explanation: "Should + subject + infinitive = if + present simple. Formal 1st conditional." },
        { id: "e1q5", prompt: "Were he more experienced, he would be offered the role.", options: ["If he were more experienced…", "If he had been more experienced…", "If he is more experienced…"], correctIndex: 0, explanation: "Were + subject + adjective = if + were (2nd conditional)." },
        { id: "e1q6", prompt: "Had they invested earlier, they would be wealthy now.", options: ["If they invest earlier…", "If they invested earlier…", "If they had invested earlier…"], correctIndex: 2, explanation: "Had + subject + pp = if + past perfect (3rd conditional)." },
        { id: "e1q7", prompt: "Should there be any objections, please raise them now.", options: ["If there are any objections…", "If there were any objections…", "If there had been any objections…"], correctIndex: 0, explanation: "Should there be = if there are (formal open conditional)." },
        { id: "e1q8", prompt: "Were this plan to succeed, it would change the industry.", options: ["If this plan succeeds…", "If this plan had succeeded…", "If this plan were to succeed…"], correctIndex: 2, explanation: "Were + subject + to-infinitive = if + were to (formal 2nd conditional)." },
        { id: "e1q9", prompt: "Had I realised the scale of the problem, I would have escalated it.", options: ["If I realise…", "If I realised…", "If I had realised…"], correctIndex: 2, explanation: "Had + subject + pp = if + past perfect (3rd conditional)." },
        { id: "e1q10", prompt: "Should you wish to cancel, please notify us 48 hours in advance.", options: ["If you wish to cancel…", "If you wished to cancel…", "If you had wished to cancel…"], correctIndex: 0, explanation: "Should + subject + infinitive = if + present simple. Open conditional." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Form the correct inverted conditional",
      instructions: "Choose the correct inverted conditional form for each context.",
      questions: [
        { id: "e2q1", prompt: "___ any questions arise, the helpdesk is available 24 hours.", options: ["Should", "Were", "Had"], correctIndex: 0, explanation: "Should + subject + infinitive = open conditional (1st type, formal)." },
        { id: "e2q2", prompt: "___ I to resign, who would take over my responsibilities?", options: ["Should", "Had", "Were"], correctIndex: 2, explanation: "Were + subject + to-infinitive = hypothetical (2nd conditional, formal)." },
        { id: "e2q3", prompt: "___ she been present at the meeting, the outcome might have been different.", options: ["Were", "Should", "Had"], correctIndex: 2, explanation: "Had + subject + pp = past unreal (3rd conditional, formal)." },
        { id: "e2q4", prompt: "___ you require further information, do not hesitate to call.", options: ["Were", "Should", "Had"], correctIndex: 1, explanation: "Should + subject + infinitive = polite/formal open conditional." },
        { id: "e2q5", prompt: "___ the merger to go ahead, thousands of jobs would be at risk.", options: ["Had", "Were", "Should"], correctIndex: 1, explanation: "Were + subject + to-infinitive = formal hypothetical." },
        { id: "e2q6", prompt: "___ the alarm gone off, we would have evacuated in time.", options: ["Should", "Were", "Had"], correctIndex: 2, explanation: "Had + subject + pp = if the alarm had gone off (3rd conditional)." },
        { id: "e2q7", prompt: "___ I known you were coming, I would have prepared something.", options: ["Were", "Had", "Should"], correctIndex: 1, explanation: "Had + subject + pp = past unreal: had I known = if I had known." },
        { id: "e2q8", prompt: "___ the two companies to merge, the resulting entity would dominate the market.", options: ["Should", "Were", "Had"], correctIndex: 1, explanation: "Were + subject + to-infinitive = formal hypothetical." },
        { id: "e2q9", prompt: "___ you experience any side effects, stop taking the medication immediately.", options: ["Were", "Had", "Should"], correctIndex: 2, explanation: "Should + subject + infinitive = formal open conditional (medical/official instruction)." },
        { id: "e2q10", prompt: "___ they not acted swiftly, the crisis would have spiralled.", options: ["Were", "Had", "Should"], correctIndex: 1, explanation: "Had + subject + not + pp = negative 3rd conditional: had they not acted." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Inverted conditionals in context",
      instructions: "Read the full sentence and choose the correct inverted or normal form. Some require inversion; others test whether inversion is appropriate.",
      questions: [
        { id: "e3q1", prompt: "___ the evidence been stronger, the case would have gone to trial.", options: ["If", "Were", "Had"], correctIndex: 2, explanation: "Had + subject + pp = if + past perfect. Past unreal (no if needed with had)." },
        { id: "e3q2", prompt: "This is a formal letter. Best way to write: 'If you need a refund, contact us.'", options: ["Should you need a refund, contact us.", "Were you to need a refund, contact us.", "Had you needed a refund, contact us."], correctIndex: 0, explanation: "Should + subject + infinitive = formal polite open conditional. Most natural here." },
        { id: "e3q3", prompt: "___ this technology to become widely available, it would transform healthcare.", options: ["Should this technology become", "Were this technology to become", "Had this technology become"], correctIndex: 1, explanation: "Were + subject + to-infinitive = hypothetical/unlikely formal conditional." },
        { id: "e3q4", prompt: "He regrets not telling her. → ___ he told her, things might be different now.", options: ["Were", "Should", "Had"], correctIndex: 2, explanation: "Had + subject + pp = past unreal regret. Had he told her = if he had told her." },
        { id: "e3q5", prompt: "The negative inverted 3rd conditional of 'If they had not cooperated':", options: ["Had they not cooperated,", "Were they not to cooperate,", "Should they not cooperate,"], correctIndex: 0, explanation: "Had + subject + not + pp = negative past inverted conditional." },
        { id: "e3q6", prompt: "Which is the most formal way to express 'If you have any concerns'?", options: ["Should you have any concerns,", "Were you to have any concerns,", "Had you had any concerns,"], correctIndex: 0, explanation: "Should + subject + infinitive = most natural formal open conditional for correspondence." },
        { id: "e3q7", prompt: "___ I in your position, I would not have agreed. (Past hypothetical — what would I do now if I were you in the past?)", options: ["Were", "Had", "Should"], correctIndex: 1, explanation: "Had + subject + pp = past unreal: had I been in your position (3rd conditional)." },
        { id: "e3q8", prompt: "Complete formally: 'If the situation deteriorates further, ___'", options: ["should it deteriorate further,", "were it to deteriorate further,", "both are appropriate in formal writing"], correctIndex: 2, explanation: "Both 'should it deteriorate' (open) and 'were it to deteriorate' (hypothetical) are formal and appropriate." },
        { id: "e3q9", prompt: "Which sentence is NOT a correct inverted conditional?", options: ["Should he call, tell him I'm busy.", "Had she been warned, she'd have left.", "Did they arrive early, the meeting would start."], correctIndex: 2, explanation: "'Did they arrive' is not a valid inverted conditional form. Did-inversion is used in questions, not conditionals." },
        { id: "e3q10", prompt: "Mixed conditional: 'If I had taken that job, I would be in Paris now.' → Inverted form:", options: ["Had I taken that job, I would be in Paris now.", "Were I to take that job, I would be in Paris now.", "Should I have taken that job, I would be in Paris now."], correctIndex: 0, explanation: "Had + subject + pp (past condition) + would + be (present result) = inverted mixed conditional." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using inverted conditional (no 'if')",
      instructions: "Rewrite each sentence as a formal inverted conditional. Remove 'if' and invert the auxiliary. Write the complete conditional clause only (up to the comma).",
      questions: [
        { id: "e4q1", prompt: "If you should need help, please call us.", correct: "should you need help", explanation: "Should + subject + infinitive. Omit 'if'." },
        { id: "e4q2", prompt: "If she had arrived earlier, she would have met the director.", correct: "had she arrived earlier", explanation: "Had + subject + pp. Omit 'if'." },
        { id: "e4q3", prompt: "If I were to take on this project, I would need more resources.", correct: "were i to take on this project", explanation: "Were + subject + to-infinitive. Omit 'if'." },
        { id: "e4q4", prompt: "If the bank were to raise interest rates, millions would be affected.", correct: "were the bank to raise interest rates", explanation: "Were + subject + to-infinitive (formal hypothetical)." },
        { id: "e4q5", prompt: "If you have any objections, please state them now.", correct: "should you have any objections", explanation: "Should + subject + infinitive = formal open conditional." },
        { id: "e4q6", prompt: "If they had not intervened, the situation would have been catastrophic.", correct: "had they not intervened", explanation: "Had + subject + not + pp. Negative inversion." },
        { id: "e4q7", prompt: "If the proposal were to be rejected, the team would be devastated.", correct: "were the proposal to be rejected", explanation: "Were + subject + to be + pp = passive inverted conditional." },
        { id: "e4q8", prompt: "If you require a receipt, one will be provided on request.", correct: "should you require a receipt", explanation: "Should + subject + infinitive. Very formal / official register." },
        { id: "e4q9", prompt: "If I had known about the delay, I would have left earlier.", correct: "had i known about the delay", explanation: "Had + subject + pp. Past unreal." },
        { id: "e4q10", prompt: "If this medicine were to be withdrawn, patients would suffer.", correct: "were this medicine to be withdrawn", explanation: "Were + subject + to be + pp = passive inverted hypothetical." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Inverted Conditionals</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Inverted{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Conditionals</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Inverted conditionals replace <i>if</i> with auxiliary inversion for a formal register. Three patterns: <b>Should you…</b> (1st conditional), <b>Were I to…</b> (2nd conditional), <b>Had she known…</b> (3rd conditional).
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-c1-inverted-conditionals" subject="Inverted Conditionals" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                  {current.type === "mcq" ? current.questions.map((q, idx) => {
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
                  }) : current.questions.map((q, idx) => {
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
                  })}
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
                      <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}</div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/c1" allLabel="All C1 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-c1-inverted-conditionals" subject="Inverted Conditionals" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/advanced-modals" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Advanced Modal Expressions →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Inverted Conditionals (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { type: "Should + subject + infinitive", cond: "1st conditional (open/possible)", normal: "If + present simple", ex: "Should you need help, call us. / Should the system fail, restart it." },
          { type: "Were + subject + to-infinitive", cond: "2nd conditional (hypothetical)", normal: "If + were to / past simple", ex: "Were she to resign, we'd be in trouble. / Were I to accept, I'd need time." },
          { type: "Had + subject + past participle", cond: "3rd conditional (past unreal)", normal: "If + past perfect", ex: "Had I known earlier, I'd have helped. / Had they not acted, it would have failed." },
        ].map(({ type, cond, normal, ex }) => (
          <div key={type} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-cyan-700 text-sm font-mono">{type}</span>
              <span className="text-xs text-slate-500">— {cond}</span>
            </div>
            <div className="text-xs text-slate-400 mb-1">= {normal}</div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm text-slate-800 space-y-1">
          <div><span className="font-black">Negative inversion:</span> <i>Had they not cooperated</i> (= if they had not cooperated) / <i>Should you not receive a reply</i> (= if you don&apos;t receive).</div>
          <div><span className="font-black">Passive inversion:</span> <i>Were the plan to be rejected</i> / <i>Had the data been analysed</i>.</div>
          <div><span className="font-black">Mixed conditional:</span> <i>Had I taken that job, I would be in Paris now</i> — past condition + present result.</div>
          <div className="mt-2 text-slate-600">Inverted conditionals are common in <span className="font-black">formal writing, legal/business language, and academic texts</span>. Avoid them in casual speech.</div>
        </div>
      </div>
    </div>
  );
}
