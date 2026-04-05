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

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Present participle clause replaces?", options: ["A noun clause", "An active clause (subject doing action)", "A passive clause", "A conditional"], answer: 1 },
  { q: "Past participle clause replaces?", options: ["An active clause", "A passive or completed action clause", "A future clause", "A question"], answer: 1 },
  { q: "'Walking to school, I saw a fox' — type?", options: ["Past participle clause", "Present participle clause", "Passive clause", "Relative clause"], answer: 1 },
  { q: "'Built in 1900, the bridge is old' — type?", options: ["Present participle clause", "Past participle clause", "Active clause", "Modal clause"], answer: 1 },
  { q: "Participle clause subject must be?", options: ["Different from main clause", "Same as main clause", "The object", "Unspecified"], answer: 1 },
  { q: "'Having finished the report, she left' — implies?", options: ["She finished after leaving", "She finished before leaving", "She left without finishing", "She was finishing when she left"], answer: 1 },
  { q: "'Having + past participle' is used for?", options: ["Action at same time", "Action completed before main action", "Action after main action", "Passive voice"], answer: 1 },
  { q: "Which is a correct participle clause?", options: ["Running to catch the bus, his bag fell", "Running to catch the bus, he dropped his bag", "Running to the bus, the bag dropped", "He running to bus, bag dropped"], answer: 1 },
  { q: "Dangling participle error occurs when?", options: ["The clause is too long", "The implied subject doesn't match main clause", "The participle is in wrong tense", "The clause is passive"], answer: 1 },
  { q: "Participle clauses are used to?", options: ["Add extra subjects", "Replace time/reason/result clauses", "Only show contrast", "Change tense"], answer: 1 },
  { q: "'-ed' participle clause can show?", options: ["Active action", "Reason or passive meaning", "Future action", "Question"], answer: 1 },
  { q: "'Exhausted after the race, she rested' — why?", options: ["She rested, then got exhausted", "Because she was exhausted", "Despite being exhausted", "While being exhausted"], answer: 1 },
  { q: "Which is WRONG participle clause?", options: ["Turning left, you'll see the bank", "Having eaten, she went to bed", "Walking in, the room felt cold", "Opening the door, she saw him"], answer: 2 },
  { q: "'Seeing him there, I waved' = ?", options: ["When I saw him, I waved", "I waved, then saw him", "Despite seeing him, I waved", "If I see him, I wave"], answer: 0 },
  { q: "Past participle clause often replaces?", options: ["Because/since (active)", "When/if (future)", "Because/since (passive)", "Although (contrast)"], answer: 2 },
  { q: "'Not knowing the answer, he guessed' — 'not' is placed?", options: ["After the participle", "Before the participle", "At end of clause", "Before the subject"], answer: 1 },
  { q: "Participle clauses make sentences?", options: ["Longer and complex", "More concise and formal", "More informal", "Identical to originals"], answer: 1 },
  { q: "Which sentence has correct participle clause?", options: ["Having lost, the trophy was given to us", "Having lost, we gave up the trophy", "Having the trophy, it was given away", "Given the trophy, it was lost"], answer: 1 },
  { q: "'Broken beyond repair, the car was sold' = ?", options: ["Because it was broken, it was sold", "Although broken, it was sold", "After it was broken, it was sold", "If broken, sell it"], answer: 0 },
  { q: "Participle clauses are most common in?", options: ["Casual speech", "Written and formal English", "Questions", "Negative sentences"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Participle Clauses",
  subtitle: "Walking to school... / Built in 1900...",
  level: "B2",
  keyRule: "Use -ing (active) or -ed (passive) to replace when/because/after clauses.",
  exercises: [
    {
      number: 1,
      title: "Present or past participle?",
      difficulty: "easy" as const,
      instruction: "Choose the correct participle form.",
      questions: [
        "___ to work, she missed the meeting.",
        "___ in 1850, the castle is beautiful.",
        "___ the test, he felt relieved.",
        "___ by the news, she sat down.",
        "___ all night, she was exhausted.",
        "___ at the top, we saw the city.",
        "___ too far, the hike was tiring.",
        "___ to music, he fell asleep.",
        "___ in glass, the building reflected.",
        "___ his wallet, he couldn't pay.",
      ],
    },
    {
      number: 2,
      title: "Combine using participle clauses",
      difficulty: "medium" as const,
      instruction: "Rewrite using a participle clause.",
      questions: [
        "Because she was tired, she went to bed.",
        "When he arrived, he noticed the damage.",
        "After she had eaten, she went for a walk.",
        "Because it was built in 1900, it is old.",
        "Since I didn't know the answer, I guessed.",
        "After he had finished, he left the room.",
        "When they entered, they saw the mess.",
        "Because she was exhausted, she rested.",
        "After it had been translated, it was published.",
        "Since she hadn't studied, she failed.",
      ],
    },
    {
      number: 3,
      title: "Dangling participles",
      difficulty: "hard" as const,
      instruction: "Identify correct vs. incorrect participle clauses.",
      questions: [
        "Running for the bus, my bag fell. (correct?)",
        "Running for the bus, I dropped my bag.",
        "Exhausted from work, the sofa was comfy.",
        "Having eaten, she went for a walk.",
        "Walking in, the room seemed cold.",
        "Built in 1920, they still live in the house.",
        "Opening the letter, she began to cry.",
        "Not knowing the route, a map was needed.",
        "Turning right, you'll see the post office.",
        "Having arrived early, the seats were good.",
      ],
    },
    {
      number: 4,
      title: "Full participle clause practice",
      difficulty: "hard" as const,
      instruction: "Rewrite or choose the best participle clause.",
      questions: [
        "She opened the door and saw him there.",
        "After he had graduated, he moved abroad.",
        "Because it was damaged, they returned it.",
        "Not knowing what to say, she left.",
        "Because she was trained as a doctor, she helped.",
        "After they had argued, they fell silent.",
        "When I entered, I noticed a strange smell.",
        "Since he was injured, he couldn't compete.",
        "After it had been rejected, the plan was revised.",
        "Because she hadn't eaten, she felt faint.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Participle forms", answers: ["Walking/Driving/Running", "Built", "Having finished / Finishing", "Shocked/Surprised", "Working", "Standing/Arriving", "Being/Going", "Listening", "Covered/Wrapped", "Having lost / Losing"] },
    { exercise: 2, subtitle: "Rewritten clauses", answers: ["Being tired, she went to bed", "Arriving, he noticed the damage", "Having eaten, she went for a walk", "Built in 1900, it is old", "Not knowing the answer, I guessed", "Having finished, he left the room", "Entering, they saw the mess", "Exhausted, she rested", "Having been translated, it was published", "Not having studied, she failed"] },
    { exercise: 3, subtitle: "Correct/Incorrect", answers: ["Incorrect (dangling)", "Correct", "Incorrect (dangling)", "Correct", "Incorrect (dangling)", "Incorrect (dangling)", "Correct", "Incorrect (dangling)", "Correct", "Incorrect (dangling)"] },
    { exercise: 4, subtitle: "Rewritten sentences", answers: ["Opening the door, she saw him", "Having graduated, he moved abroad", "Damaged, it was returned", "Not knowing what to say, she left", "Trained as a doctor, she helped", "Having argued, they fell silent", "Entering, I noticed a strange smell", "Injured, he couldn't compete", "Having been rejected, the plan was revised", "Not having eaten, she felt faint"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Advanced Relative Clauses", href: "/grammar/b2/relative-clauses-advanced", level: "B2", badge: "bg-orange-500", reason: "Participle clauses often replace relative clauses" },
  { title: "Inversion", href: "/grammar/b2/inversion", level: "B2", badge: "bg-orange-500", reason: "Both are advanced structures used for style and emphasis" },
  { title: "Cleft Sentences", href: "/grammar/b2/cleft-sentences", level: "B2", badge: "bg-orange-500" },
];

export default function ParticipleClausesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Identify the participle clause type",
      instructions: "Choose the correct participle type: present (-ing = active/simultaneous), past (-ed/pp = passive), or perfect (having + pp = completed before main verb).",
      questions: [
        { id: "e1q1", prompt: "___ her coffee, she read the morning news.", options: ["Drunk", "Drinking", "Having drunk"], correctIndex: 1, explanation: "Present participle (-ing) = simultaneous action. She drank coffee while reading." },
        { id: "e1q2", prompt: "___ the report, she submitted it to her manager.", options: ["Finishing", "Finished", "Having finished"], correctIndex: 2, explanation: "Perfect participle = action completed before the main verb (she finished first, then submitted)." },
        { id: "e1q3", prompt: "___ in 1850, the building is now a museum.", options: ["Building", "Having built", "Built"], correctIndex: 2, explanation: "Past participle (passive) = the building was built (passive meaning)." },
        { id: "e1q4", prompt: "___ carefully, the instructions seemed straightforward.", options: ["Reading", "Having read", "Read"], correctIndex: 0, explanation: "Present participle = simultaneous / manner (reading carefully = as he read)." },
        { id: "e1q5", prompt: "___ the patient, the doctor wrote up the notes.", options: ["Examined", "Examining", "Having examined"], correctIndex: 2, explanation: "Perfect participle = doctor examined the patient first, then wrote the notes." },
        { id: "e1q6", prompt: "___ in three countries, she speaks four languages.", options: ["Having grown up", "Growing up", "Grown up"], correctIndex: 0, explanation: "Having grown up = past experience that explains the present ability." },
        { id: "e1q7", prompt: "The package ___ this morning has already been opened.", options: ["arriving", "arrived", "having arrived"], correctIndex: 0, explanation: "Present participle in a reduced relative clause = the package that arrived." },
        { id: "e1q8", prompt: "___ by a well-known designer, the dress sold out immediately.", options: ["Designing", "Having designed", "Designed"], correctIndex: 2, explanation: "Past participle = passive (the dress was designed by…)." },
        { id: "e1q9", prompt: "Not ___ what to say, he stayed silent.", options: ["knowing", "known", "having known"], correctIndex: 0, explanation: "Present participle = simultaneous state. Not knowing = because he didn't know." },
        { id: "e1q10", prompt: "___ the contract, they shook hands.", options: ["Signing", "Signed", "Having signed"], correctIndex: 2, explanation: "Having signed = completed before shaking hands." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Meaning of the participle clause",
      instructions: "Participle clauses can express time, reason, condition, or result. Choose the meaning of the participle clause in each sentence.",
      questions: [
        { id: "e2q1", prompt: "Feeling unwell, she decided to stay at home.", options: ["Time (when)", "Reason (because)", "Condition (if)"], correctIndex: 1, explanation: "Feeling unwell = because she felt unwell. Reason." },
        { id: "e2q2", prompt: "Turning left at the lights, you'll find the station.", options: ["Reason", "Condition (if you turn)", "Result"], correctIndex: 1, explanation: "Turning left = if you turn left. Conditional." },
        { id: "e2q3", prompt: "He arrived late, missing the opening ceremony.", options: ["Reason", "Condition", "Result / consequence"], correctIndex: 2, explanation: "Missing the opening ceremony = as a result he missed it." },
        { id: "e2q4", prompt: "Having lived abroad for years, she adapted quickly.", options: ["Reason / background experience", "Condition", "Result"], correctIndex: 0, explanation: "Having lived abroad = because / since she had lived abroad. Reason." },
        { id: "e2q5", prompt: "Walking through the forest, they heard an owl.", options: ["Time (while)", "Condition", "Result"], correctIndex: 0, explanation: "Walking through the forest = while they were walking. Time." },
        { id: "e2q6", prompt: "Taken correctly, this medicine is very effective.", options: ["Reason", "Condition (if taken correctly)", "Result"], correctIndex: 1, explanation: "Taken correctly = if it is taken correctly. Passive conditional." },
        { id: "e2q7", prompt: "She slipped, breaking her ankle.", options: ["Time", "Condition", "Result"], correctIndex: 2, explanation: "breaking her ankle = as a result she broke her ankle." },
        { id: "e2q8", prompt: "Exhausted after the race, he collapsed on the sofa.", options: ["Reason / state", "Condition", "Time"], correctIndex: 0, explanation: "Exhausted = because he was exhausted. Reason/state." },
        { id: "e2q9", prompt: "Not having booked a table, they had to wait an hour.", options: ["Result", "Reason", "Condition"], correctIndex: 1, explanation: "Not having booked = because they hadn't booked. Reason (negative perfect)." },
        { id: "e2q10", prompt: "Knowing the answer, she raised her hand immediately.", options: ["Condition", "Time / simultaneous", "Result"], correctIndex: 1, explanation: "Knowing the answer = at the moment she knew / because she knew. Time/reason." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Choose the correct participle clause",
      instructions: "Choose the most natural participle clause to replace the adverbial clause in context.",
      questions: [
        { id: "e3q1", prompt: "After she had finished her presentation, she answered questions. → ___", options: ["Finishing her presentation, she answered questions.", "Having finished her presentation, she answered questions.", "Finished her presentation, she answered questions."], correctIndex: 1, explanation: "Having finished = perfect participle for a completed prior action." },
        { id: "e3q2", prompt: "Because he was exhausted by the journey, he went straight to bed. → ___", options: ["Exhausted by the journey, he went straight to bed.", "Having exhausted by the journey, he went to bed.", "Exhausting by the journey, he went straight to bed."], correctIndex: 0, explanation: "Exhausted = past participle (passive adjective): he was exhausted." },
        { id: "e3q3", prompt: "While she was waiting for the bus, she read a book. → ___", options: ["Having waited for the bus, she read a book.", "Waited for the bus, she read a book.", "Waiting for the bus, she read a book."], correctIndex: 2, explanation: "Waiting = present participle for a simultaneous action." },
        { id: "e3q4", prompt: "If it is stored properly, the product lasts for two years. → ___", options: ["Storing properly, the product lasts for two years.", "Stored properly, the product lasts for two years.", "Having stored properly, the product lasts for two years."], correctIndex: 1, explanation: "Stored properly = past participle in a conditional participle clause (passive)." },
        { id: "e3q5", prompt: "As a result, he fell asleep during the meeting. → He fell asleep during the meeting, ___", options: ["missing the key decisions.", "having missed the key decisions.", "missed the key decisions."], correctIndex: 0, explanation: "missing = present participle to express result/consequence." },
        { id: "e3q6", prompt: "Since she had never been to Paris before, she was very excited. → ___", options: ["Not being to Paris before, she was excited.", "Never having been to Paris before, she was very excited.", "Not having gone Paris before, she was excited."], correctIndex: 1, explanation: "Never having been = negative perfect participle for past experience." },
        { id: "e3q7", prompt: "The car was damaged in the crash. It was written off by the insurance. → The car ___, was written off by the insurance.", options: ["damaging in the crash", "damaged in the crash", "having damaged in the crash"], correctIndex: 1, explanation: "damaged in the crash = past participle (passive) as a reduced relative clause." },
        { id: "e3q8", prompt: "She didn't know what to do, so she called her friend. → ___", options: ["Not knowing what to do, she called her friend.", "Not known what to do, she called her friend.", "Having not known what to do, she called her friend."], correctIndex: 0, explanation: "Not knowing = negative present participle for a simultaneous/causal state." },
        { id: "e3q9", prompt: "The report was written by two experts. It covers all key areas. → The report ___, covers all key areas.", options: ["writing by two experts", "written by two experts", "having written by two experts"], correctIndex: 1, explanation: "written by two experts = past participle (passive reduced relative)." },
        { id: "e3q10", prompt: "He had worked there for twenty years, so he knew all the secrets. → ___", options: ["Working there for twenty years, he knew all the secrets.", "Having worked there for twenty years, he knew all the secrets.", "Worked there for twenty years, he knew all the secrets."], correctIndex: 1, explanation: "Having worked = perfect participle: completed experience that explains current knowledge." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using a participle clause",
      instructions: "Rewrite the sentence using a participle clause. Write the complete rewritten sentence (lowercase, no full stop).",
      questions: [
        { id: "e4q1", prompt: "While she was walking home, she saw an accident.", correct: "walking home, she saw an accident", explanation: "Present participle: while she was walking → walking." },
        { id: "e4q2", prompt: "After he had read the report, he called an emergency meeting.", correct: "having read the report, he called an emergency meeting", explanation: "Perfect participle: after he had read → having read." },
        { id: "e4q3", prompt: "Because she was tired, she decided to take a taxi.", correct: "feeling tired, she decided to take a taxi", explanation: "Present participle of state: because she was tired → feeling tired." },
        { id: "e4q4", prompt: "The bridge was built in the 19th century. It still carries heavy traffic.", correct: "built in the 19th century, the bridge still carries heavy traffic", explanation: "Past participle (passive): was built → built." },
        { id: "e4q5", prompt: "He tripped on the step and fell into the pool.", correct: "tripping on the step, he fell into the pool", explanation: "Present participle for sequence/result." },
        { id: "e4q6", prompt: "If you turn right here, you will see the cathedral.", correct: "turning right here, you will see the cathedral", explanation: "Present participle for conditional: if you turn → turning." },
        { id: "e4q7", prompt: "Since she had never studied French, she struggled to understand.", correct: "never having studied french, she struggled to understand", explanation: "Negative perfect participle: since she had never studied → never having studied." },
        { id: "e4q8", prompt: "The documents were signed by the director and sent to head office.", correct: "signed by the director, the documents were sent to head office", explanation: "Past participle (passive): were signed → signed." },
        { id: "e4q9", prompt: "She didn't want to cause any trouble, so she kept quiet.", correct: "not wanting to cause any trouble, she kept quiet", explanation: "Negative present participle: didn't want → not wanting." },
        { id: "e4q10", prompt: "After he had lived in Japan for three years, he was fluent in Japanese.", correct: "having lived in japan for three years, he was fluent in japanese", explanation: "Perfect participle: after he had lived → having lived." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Participle Clauses</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Participle{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Clauses</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Participle clauses replace adverbial clauses to make sentences more concise. <b>Present participle (-ing)</b> = active/simultaneous. <b>Past participle (-ed/pp)</b> = passive. <b>Perfect participle (having + pp)</b> = completed before the main verb.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-participle-clauses" subject="Participle Clauses" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b2" allLabel="All B2 topics" />
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b2-participle-clauses" subject="Participle Clauses" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/inversion" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Inversion →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Participle Clauses (B2)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { form: "Present participle (-ing)", use: "Active, simultaneous or causal", ex: "Feeling tired, she sat down. / Walking home, he called her." },
          { form: "Past participle (-ed / pp)", use: "Passive or state", ex: "Built in 1900, the house is now listed. / Exhausted, she went to bed." },
          { form: "Perfect participle (having + pp)", use: "Action completed before the main verb", ex: "Having signed the contract, they celebrated." },
          { form: "Negative participle (not + -ing)", use: "Negative simultaneous / causal", ex: "Not knowing the answer, he stayed quiet." },
          { form: "Negative perfect (never/not having + pp)", use: "Negative prior experience", ex: "Never having been abroad, she was nervous." },
        ].map(({ form, use, ex }) => (
          <div key={form} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-orange-700 text-sm">{form}</span>
              <span className="text-xs text-slate-500">— {use}</span>
            </div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800 space-y-1">
          <div><span className="font-black">Rule:</span> The subject of the participle clause must be the same as the subject of the main clause.</div>
          <div className="text-red-700"><span className="font-black">Wrong:</span> <i>Walking home, the rain started.</i> (rain wasn&apos;t walking)</div>
          <div className="text-emerald-700"><span className="font-black">Correct:</span> <i>Walking home, she got caught in the rain.</i></div>
        </div>
      </div>
    </div>
  );
}
