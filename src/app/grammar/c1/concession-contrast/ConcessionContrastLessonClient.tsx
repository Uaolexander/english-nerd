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
import { useLiveSync } from "@/lib/useLiveSync";

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Advanced Discourse Markers", href: "/grammar/c1/advanced-discourse-markers", level: "C1", badge: "bg-sky-600", reason: "Discourse markers are essential for expressing concession and contrast" },
  { title: "Hedging Language", href: "/grammar/c1/hedging-language", level: "C1", badge: "bg-sky-600" },
  { title: "Inverted Conditionals", href: "/grammar/c1/inverted-conditionals", level: "C1", badge: "bg-sky-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "___ the rain, the match went on.", options: ["Despite", "Although", "However", "Even though"], answer: 0 },
  { q: "___ it rained, match went ahead.", options: ["Although", "Despite", "However", "In spite of"], answer: 0 },
  { q: "Despite + ___", options: ["noun phrase/gerund", "full clause", "sentence", "adjective"], answer: 0 },
  { q: "Although + ___", options: ["full clause", "noun phrase", "gerund", "adverb"], answer: 0 },
  { q: "However connects: ___", options: ["Two separate sentences", "One clause", "A noun phrase", "Gerunds"], answer: 0 },
  { q: "___ efforts, she failed to convince.", options: ["In spite of", "Even though", "However", "Despite that"], answer: 0 },
  { q: "Despite the fact that = ___", options: ["Although", "However", "In spite of", "Even so"], answer: 0 },
  { q: "Urban areas grew, ___ rural fell.", options: ["while", "despite", "however", "in spite"], answer: 0 },
  { q: "Whereas = ___", options: ["Direct two-way contrast", "Cause and effect", "Addition", "Result"], answer: 0 },
  { q: "'On the other hand' goes between:", options: ["Two separate sentences", "Two clauses", "A gerund", "Introductions"], answer: 0 },
  { q: "___ being qualified, struggled.", options: ["Despite", "Although", "In spite", "Even though"], answer: 0 },
  { q: "Yet as conjunction means:", options: ["But/however", "And", "Because", "Therefore"], answer: 0 },
  { q: "Even so = ___", options: ["Despite this", "Also", "As a result", "In addition"], answer: 0 },
  { q: "Nonetheless connects two ___.", options: ["Sentences", "Clauses", "Gerunds", "Infinitives"], answer: 0 },
  { q: "For all = ___", options: ["Despite (formal)", "Because of", "In addition to", "Without"], answer: 0 },
  { q: "While at sentence start means:", options: ["Although/even though", "At the same time", "Duration", "Contrast only"], answer: 0 },
  { q: "Granted that = ___", options: ["Admittedly/conceding", "As a result", "In addition", "Furthermore"], answer: 0 },
  { q: "'Much as' introduces:", options: ["Strong concession", "Addition", "Result", "Cause"], answer: 0 },
  { q: "'Whilst' is the ___ form of 'while'.", options: ["British English", "American English", "Formal written", "Informal spoken"], answer: 0 },
  { q: "In spite of ___ (correct form)", options: ["his best efforts", "he tried hard", "he was tired", "they worked"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Concession and Contrast",
  subtitle: "Although, despite, however, while, whereas",
  level: "C1",
  keyRule: "Despite + noun/gerund; Although + clause; However + new sentence.",
  exercises: [
    {
      number: 1,
      title: "Although / Despite / However",
      difficulty: "Easy",
      instruction: "Choose the grammatically correct form.",
      questions: [
        "___ the rain, match went on.",
        "___ it rained, match went on.",
        "Results bad. ___, optimistic.",
        "___ her efforts, she failed.",
        "___ fact that tired, continued.",
        "Rejected. ___, they resubmitted.",
        "___ being qualified, struggled.",
        "Costs rose. ___, quality same.",
        "___ all challenges, finished ok.",
        "Warned of risks. ___, invested.",
      ],
      hint: "Despite / Although / Nevertheless / Even so",
    },
    {
      number: 2,
      title: "While / Whereas / On Other Hand",
      difficulty: "Medium",
      instruction: "Choose the most appropriate connector.",
      questions: [
        "Urban grew, ___ rural declined.",
        "Fast but risky. ___, slow but safe.",
        "___ some argue tech bad, others...",
        "North exports raw, ___ south mfg.",
        "Effective. ___, side effects exist.",
        "___ transport improving, drive still.",
        "Gen A spends lot. ___, Gen B saves.",
        "East invests more, ___ west less.",
        "She is loud. ___, he is quiet.",
        "Art enriches. ___, funding is cut.",
      ],
      hint: "while / whereas / on the other hand",
    },
    {
      number: 3,
      title: "Advanced Concession: for all / much as",
      difficulty: "Hard",
      instruction: "Choose the correct advanced form.",
      questions: [
        "___ its flaws, plan has value.",
        "___ I admire her, disagree here.",
        "___ the criticism, kept going.",
        "___ its benefits, has risks too.",
        "___ her talent, she still failed.",
        "___ I respect you, this is wrong.",
        "___ the cost, it must be done.",
        "___ difficulty, succeeded anyway.",
        "___ admiring the view, disagree.",
        "___ promise, plan cannot work.",
      ],
      hint: "For all / Much as / Despite",
    },
    {
      number: 4,
      title: "Rewrite Using Concession",
      difficulty: "Very Hard",
      instruction: "Rewrite using the connector given.",
      questions: [
        "Even though it rained, went on.",
        "She failed despite hard effort.",
        "He's qualified but can't find work.",
        "Urban grew but rural declined.",
        "Costs rose but no quality gain.",
        "Rejected; still resubmitted it.",
        "Fast option risky. Other safer.",
        "Criticism didn't stop them.",
        "Good plan; has major weaknesses.",
        "Warning ignored; invested anyway.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Although / Despite / However", answers: ["Despite", "Although", "Nevertheless", "In spite of", "Despite", "Even so", "Despite", "Yet", "In spite of", "Nonetheless"] },
    { exercise: 2, subtitle: "While / Whereas / On Other Hand", answers: ["while", "On the other hand", "While", "whereas", "On the other hand", "While", "On the other hand", "whereas", "whereas", "On the other hand"] },
    { exercise: 3, subtitle: "Advanced Concession", answers: ["For all", "Much as", "Despite", "For all", "Despite", "Much as", "Despite", "Despite", "Much as", "For all its"] },
    { exercise: 4, subtitle: "Rewrite Using Concession", answers: ["Despite the rain, the match went on.", "In spite of her best efforts, she failed.", "Despite being highly qualified, she can't find work.", "Urban areas grew while rural communities declined.", "Costs rose, yet quality did not improve.", "The proposal was rejected; even so, they resubmitted it.", "The fast option is risky; on the other hand, the slow one is safer.", "Despite the criticism, they kept going.", "Although it's a good plan, it has major weaknesses.", "Although he was warned about the risks, he invested."] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function ConcessionContrastLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const { isLive, broadcast } = useLiveSync((payload) => {
    setMcqAnswers(payload.answers as Record<string, number | null>);
    setInputAnswers((payload as unknown as { inputAnswers: Record<string, string> }).inputAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Although / Despite / However: grammar rules",
      instructions: "Although/though/even though + clause. Despite/in spite of + noun/gerund. However/nevertheless/nonetheless + clause (with comma). Choose the grammatically correct form.",
      questions: [
        { id: "e1q1", prompt: "___ the heavy rain, the match went ahead.", options: ["Despite", "Although", "However"], correctIndex: 0, explanation: "Despite + noun phrase: 'Despite the heavy rain'. 'Although' requires a full clause." },
        { id: "e1q2", prompt: "___ it was raining heavily, the match went ahead.", options: ["Despite", "Although", "However"], correctIndex: 1, explanation: "Although + clause: 'Although it was raining heavily'." },
        { id: "e1q3", prompt: "The results were disappointing. ___, the team remained optimistic.", options: ["Despite", "Although", "Nevertheless"], correctIndex: 2, explanation: "Nevertheless/however connect two separate sentences; Despite/Although require one clause." },
        { id: "e1q4", prompt: "___ her best efforts, she failed to convince the board.", options: ["In spite of", "Even though", "However"], correctIndex: 0, explanation: "In spite of + noun phrase: 'In spite of her best efforts'." },
        { id: "e1q5", prompt: "___ the fact that he was exhausted, he continued working.", options: ["Despite", "However", "Even so"], correctIndex: 0, explanation: "Despite + the fact that + clause: formal alternative to 'although'." },
        { id: "e1q6", prompt: "The proposal was rejected. ___, they decided to revise and resubmit it.", options: ["Despite", "Although", "Even so"], correctIndex: 2, explanation: "'Even so' connects two sentences showing contrast: the rejection didn't stop them." },
        { id: "e1q7", prompt: "___ being highly qualified, she struggled to find work.", options: ["Despite", "Although", "In spite"], correctIndex: 0, explanation: "Despite + gerund: 'Despite being highly qualified'. Note: 'in spite' always requires 'of'." },
        { id: "e1q8", prompt: "Costs have risen. ___, quality has not improved.", options: ["Despite", "Although", "Yet"], correctIndex: 2, explanation: "'Yet' as a conjunction (= but/however) linking two main clauses showing contrast." },
        { id: "e1q9", prompt: "___ all the challenges they faced, the project was completed on time.", options: ["In spite of", "Although", "Even though"], correctIndex: 0, explanation: "In spite of + noun phrase: 'In spite of all the challenges'." },
        { id: "e1q10", prompt: "He was warned about the risks. ___, he proceeded with the investment.", options: ["Despite", "In spite of", "Nonetheless"], correctIndex: 2, explanation: "Nonetheless connects two separate sentences: = despite everything, he still proceeded." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Contrast linkers: while / whereas / on the other hand",
      instructions: "While/whereas highlight a direct contrast between two things (often simultaneous truths). 'On the other hand' introduces a contrasting point. Choose the most appropriate connector.",
      questions: [
        { id: "e2q1", prompt: "Urban areas have seen rapid growth, ___ rural communities have been in decline.", options: ["while", "despite", "however"], correctIndex: 0, explanation: "While/whereas = direct two-way contrast in a single sentence." },
        { id: "e2q2", prompt: "The first approach is fast but risky. ___, the second is slower but safer.", options: ["Whereas", "On the other hand", "While"], correctIndex: 1, explanation: "'On the other hand' introduces a contrasting alternative. Used between two separate sentences." },
        { id: "e2q3", prompt: "___ some argue that technology increases inequality, others see it as a great equaliser.", options: ["While", "Despite", "However"], correctIndex: 0, explanation: "While in sentence-initial position = although/even though (concessive sense): introduces a contrasting view." },
        { id: "e2q4", prompt: "Northern regions export mainly raw materials, ___ the south produces manufactured goods.", options: ["whereas", "nevertheless", "even so"], correctIndex: 0, explanation: "Whereas = direct contrast between two clauses of equal weight." },
        { id: "e2q5", prompt: "The treatment is effective. ___, it has significant side effects that must be considered.", options: ["While", "On the other hand", "Whereas"], correctIndex: 1, explanation: "'On the other hand' = introducing a counterpoint between two separate sentences." },
        { id: "e2q6", prompt: "___ public transport is improving, many people still prefer to drive.", options: ["While", "Despite", "However"], correctIndex: 0, explanation: "While + clause = although/even though: introducing a concessive point." },
        { id: "e2q7", prompt: "The old system was slow and unreliable; ___, the new one is fast but expensive.", options: ["while", "whereas", "Both are correct"], correctIndex: 2, explanation: "Both 'while' and 'whereas' work here in the middle of a sentence to mark contrast. 'Whereas' is slightly more formal." },
        { id: "e2q8", prompt: "She thrives under pressure, ___ her colleague finds stress debilitating.", options: ["whereas", "on the other hand", "despite"], correctIndex: 0, explanation: "Whereas = two-clause contrast in one sentence." },
        { id: "e2q9", prompt: "The first quarter showed strong growth. The second quarter, ___, saw a significant decline.", options: ["on the other hand", "whereas", "while"], correctIndex: 0, explanation: "'On the other hand' fits between two separate sentences; 'whereas' needs to link two clauses." },
        { id: "e2q10", prompt: "Some studies support the hypothesis ___ others have found contradictory results.", options: ["while", "whereas", "Both are correct"], correctIndex: 2, explanation: "Both are correct here. 'While' is slightly more common in academic writing for this balanced contrast." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Advanced concession: granted / admittedly / no matter how / for all",
      instructions: "C1 concession structures include: granted/admittedly (concede a point), no matter how/what/who (= regardless), for all (= despite), much as (= although very much). Choose the correct or most natural form.",
      questions: [
        { id: "e3q1", prompt: "___ the report raises some valid concerns, its overall conclusions are unconvincing.", options: ["Granted", "Despite", "However"], correctIndex: 0, explanation: "'Granted' + clause = conceding a point before a contrasting main claim. Formal." },
        { id: "e3q2", prompt: "___, the new policy has not delivered the promised results.", options: ["Admittedly, there are some improvements", "Admittedly there are some improvements,", "Both are correct"], correctIndex: 2, explanation: "Both punctuation forms are acceptable: 'Admittedly' can begin a sentence (followed by comma) or be inserted mid-clause." },
        { id: "e3q3", prompt: "___ hard she works, she never seems to make progress.", options: ["No matter how", "However", "Both are correct"], correctIndex: 2, explanation: "Both 'No matter how hard' and 'However hard' = regardless of how hard. Synonymous." },
        { id: "e3q4", prompt: "___ its faults, the programme has helped thousands of people.", options: ["For all", "Despite of", "In spite"], correctIndex: 0, explanation: "'For all + NP' = despite: 'For all its faults'. Note: 'despite of' is INCORRECT; 'in spite' always requires 'of'." },
        { id: "e3q5", prompt: "___ I admire her determination, I cannot support this approach.", options: ["Much as", "Even as", "While"], correctIndex: 0, explanation: "'Much as' = although very much / even though I greatly: formal concession." },
        { id: "e3q6", prompt: "___ what anyone says, I believe the decision was right.", options: ["No matter", "Despite", "However"], correctIndex: 0, explanation: "'No matter what' = regardless of what. 'No matter what anyone says' = whatever anyone says." },
        { id: "e3q7", prompt: "___ the initiative seems well-intentioned, it is poorly executed.", options: ["Admittedly", "Granted", "Both are correct"], correctIndex: 2, explanation: "Both 'Admittedly' and 'Granted' can introduce a conceded point before 'it is poorly executed'." },
        { id: "e3q8", prompt: "___ talented he may be, he still needs to develop his professional skills.", options: ["However", "No matter how", "Both are correct"], correctIndex: 2, explanation: "'However talented he may be' and 'No matter how talented he may be' are synonymous." },
        { id: "e3q9", prompt: "The project failed to meet its targets. ___, it laid the groundwork for future success.", options: ["That said", "Despite", "Although"], correctIndex: 0, explanation: "'That said' = nevertheless / having said that: introduces contrast after conceding the prior point." },
        { id: "e3q10", prompt: "___ the progress made, significant challenges remain.", options: ["For all", "Despite", "Both are correct"], correctIndex: 2, explanation: "Both 'For all the progress made' and 'Despite the progress made' are correct and interchangeable here." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using the concession/contrast structure in brackets",
      instructions: "Rewrite each sentence using the structure shown. Write the complete rewritten sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "He was very tired, but he continued working. (Despite)", correct: "despite being very tired, he continued working", explanation: "Despite + gerund: 'Despite being very tired, he continued working'." },
        { id: "e4q2", prompt: "She worked hard, but she didn't pass the exam. (In spite of)", correct: "in spite of working hard, she didn't pass the exam", explanation: "In spite of + gerund: 'In spite of working hard'." },
        { id: "e4q3", prompt: "The north is wealthy. The south is poor. (whereas — one sentence)", correct: "the north is wealthy whereas the south is poor", explanation: "Whereas links two contrasting clauses in one sentence." },
        { id: "e4q4", prompt: "The results were good. But there is still room for improvement. (That said,)", correct: "that said, there is still room for improvement", explanation: "'That said' introduces a contrasting point after acknowledging something positive." },
        { id: "e4q5", prompt: "Even though he tried many times, he couldn't solve the problem. (No matter how many times)", correct: "no matter how many times he tried, he couldn't solve the problem", explanation: "'No matter how many times' = regardless of the number of attempts." },
        { id: "e4q6", prompt: "She has many flaws, but I still respect her work. (For all)", correct: "for all her flaws, i still respect her work", explanation: "'For all + possessive + noun' = despite all her flaws." },
        { id: "e4q7", prompt: "I greatly admire his courage, but I think the plan is reckless. (Much as)", correct: "much as i admire his courage, i think the plan is reckless", explanation: "'Much as' = although I very much admire: formal concession." },
        { id: "e4q8", prompt: "It may be true that costs have risen. However, the quality has not improved. (Admittedly,)", correct: "admittedly, costs have risen, but the quality has not improved", explanation: "'Admittedly' concedes the point; 'but' introduces the contrasting claim." },
        { id: "e4q9", prompt: "He works very hard. His colleague barely does anything. (while — one sentence)", correct: "he works very hard while his colleague barely does anything", explanation: "While = two-clause direct contrast in one sentence." },
        { id: "e4q10", prompt: "The policy has some merits, but it ultimately falls short. (Granted,)", correct: "granted, the policy has some merits, but it ultimately falls short", explanation: "'Granted' + conceded point + contrasting main clause." },
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

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo }); }
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo: n }); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Concession &amp; Contrast</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Concession &amp;{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Contrast</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Concession acknowledges a point before countering it (<i>Although X, Y</i>). Contrast highlights a difference between two things (<i>X whereas Y</i>). C1 requires mastery of the grammar of each connector (clause vs noun phrase), register differences, and advanced forms: <i>granted, admittedly, much as, for all, no matter how, that said</i>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-c1-concession-contrast" subject="Concession and Contrast" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                      <button onClick={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
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
          <SpeedRound gameId="grammar-c1-concession-contrast" subject="Concession and Contrast" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/hedging-language" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Hedging Language →</a>
      </div>
    </div>
  );
}

function Explanation() {
  const rows = [
    { connector: "although / though / even though", follows: "+ clause", use: "Concession (strongest with 'even though')", ex: "Although it rained, we went out." },
    { connector: "despite / in spite of", follows: "+ noun / gerund", use: "Concession (no clause after)", ex: "Despite the rain, we went out." },
    { connector: "however / nevertheless / nonetheless", follows: "starts new sentence / clause", use: "Contrast (formal)", ex: "It rained. Nevertheless, we went out." },
    { connector: "even so / yet / still", follows: "starts new sentence", use: "Contrast (slightly informal)", ex: "It rained. Even so, we went out." },
    { connector: "while / whereas", follows: "+ clause (same sentence)", use: "Direct two-way contrast", ex: "He likes opera, whereas she prefers jazz." },
    { connector: "on the other hand", follows: "starts new sentence", use: "Introduces an alternative view", ex: "It's expensive. On the other hand, it lasts." },
    { connector: "granted / admittedly", follows: "+ clause / starts sentence", use: "Concede a point before countering", ex: "Granted, costs are high, but the benefits outweigh them." },
    { connector: "much as", follows: "+ clause", use: "Formal: 'although I greatly'", ex: "Much as I admire her work, I disagree." },
    { connector: "for all", follows: "+ noun phrase", ex: "For all its faults, the plan is workable.", use: "= Despite (formal, literary)" },
    { connector: "no matter how/what/who", follows: "+ adj/clause", use: "= Regardless of degree/identity", ex: "No matter how hard he tries, he fails." },
    { connector: "that said / having said that", follows: "starts new sentence", use: "Concede then contrast (spoken/written)", ex: "The plan has risks. That said, it may work." },
  ];
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Concession &amp; Contrast (C1)</h2>
      <div className="not-prose mt-4 overflow-x-auto rounded-2xl border border-black/10">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-black/10 bg-black/5">
            <th className="px-3 py-3 text-left font-black text-slate-700">Connector</th>
            <th className="px-3 py-3 text-left font-black text-slate-700">Follows</th>
            <th className="px-3 py-3 text-left font-black text-slate-700">Use</th>
            <th className="px-3 py-3 text-left font-black text-slate-700">Example</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-b border-black/5 ${i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}>
                <td className="px-3 py-2 font-semibold text-cyan-700 whitespace-nowrap">{r.connector}</td>
                <td className="px-3 py-2 text-slate-600 font-mono text-xs whitespace-nowrap">{r.follows}</td>
                <td className="px-3 py-2 text-slate-600 text-xs">{r.use}</td>
                <td className="px-3 py-2 italic text-slate-700 text-xs">{r.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Critical grammar traps</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div>❌ <span className="line-through">Despite it rained</span> → ✅ <b>Despite the rain</b> / <b>Although it rained</b></div>
          <div>❌ <span className="line-through">In spite it rained</span> → ✅ <b>In spite of the rain</b> (always 'in spite OF')</div>
          <div>❌ <span className="line-through">Despite of the rain</span> → ✅ <b>Despite the rain</b> (no 'of' after 'despite')</div>
          <div>❌ <span className="line-through">However the weather was bad</span> → ✅ <b>However, the weather was bad</b> (comma required)</div>
        </div>
      </div>
    </div>
  );
}
