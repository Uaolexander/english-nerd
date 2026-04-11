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
  { title: "Concession & Contrast", href: "/grammar/c1/concession-contrast", level: "C1", badge: "bg-sky-600", reason: "Both involve linking ideas cohesively at C1 level" },
  { title: "Hedging Language", href: "/grammar/c1/hedging-language", level: "C1", badge: "bg-sky-600" },
  { title: "Ellipsis & Substitution", href: "/grammar/c1/ellipsis-substitution", level: "C1", badge: "bg-sky-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Which marker means 'as a result'?", options: ["Consequently", "Furthermore", "Nevertheless", "Admittedly"], answer: 0 },
  { q: "Which marker ADDS a point of equal weight?", options: ["Furthermore", "However", "In contrast", "Albeit"], answer: 0 },
  { q: "Which marker INTRODUCES an example?", options: ["For instance", "Therefore", "On the contrary", "Hence"], answer: 0 },
  { q: "'Hence' expresses what relationship?", options: ["Result/reason", "Contrast", "Addition", "Concession"], answer: 0 },
  { q: "Which marker REFORMULATES a point?", options: ["In other words", "Moreover", "Given", "Consequently"], answer: 0 },
  { q: "'Albeit' is best described as:", options: ["Formal 'although'", "Addition marker", "Result marker", "Structuring marker"], answer: 0 },
  { q: "'Admittedly' is used to:", options: ["Concede before contrasting", "Add a new point", "Summarise", "Introduce examples"], answer: 0 },
  { q: "Which phrase OPENS a topic formally?", options: ["With regard to", "What is more", "In conclusion", "Namely"], answer: 0 },
  { q: "'Namely' is used to:", options: ["Specify items mentioned", "Contrast two ideas", "Show a result", "Summarise"], answer: 0 },
  { q: "Which marker CLOSES/SUMMARISES formally?", options: ["In conclusion", "Furthermore", "In other words", "Albeit"], answer: 0 },
  { q: "'That said' introduces:", options: ["A contrasting point", "An example", "A result", "A definition"], answer: 0 },
  { q: "'Above all' is used to:", options: ["Emphasise key point", "Add more info", "Show contrast", "Reformulate"], answer: 0 },
  { q: "Which is a SEQUENCING marker?", options: ["Subsequently", "Nonetheless", "Namely", "Albeit"], answer: 0 },
  { q: "'On the whole' signals:", options: ["Overall judgement", "Cause and effect", "Specific example", "Contrast"], answer: 0 },
  { q: "'Given' introduces:", options: ["Background context", "A conclusion", "An addition", "A contrast"], answer: 0 },
  { q: "Which two markers both mean 'despite this'?", options: ["Even so / Nonetheless", "Hence / Thus", "Namely / That is", "Turning to / Regarding"], answer: 0 },
  { q: "'It should be noted' is used to:", options: ["Draw attention formally", "Introduce result", "Summarise", "Concede"], answer: 0 },
  { q: "'What is more' implies the added point is:", options: ["Even more significant", "Contrasting", "A result", "An example"], answer: 0 },
  { q: "Which marker means 'in the same way'?", options: ["Similarly", "Consequently", "Admittedly", "Hence"], answer: 0 },
  { q: "'In the first instance' means:", options: ["As a first step", "For example", "In conclusion", "As a result"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Advanced Discourse Markers",
  subtitle: "Markers for result, addition, structuring, reformulation, emphasis",
  level: "C1",
  keyRule: "Discourse markers organise formal writing by linking ideas logically.",
  exercises: [
    {
      number: 1,
      title: "Result & Addition Markers",
      difficulty: "Easy",
      instruction: "Choose the correct discourse marker.",
      questions: [
        "Demand fell. ___, costs rose. (result)",
        "It was late. ___, it was cold.",
        "Many failed. ___, John succeeded.",
        "Costs rose. ___, output fell.",
        "She won. ___, she set a record.",
        "Data shows risk. ___, act now.",
        "It rained. ___, they cancelled.",
        "Slow progress. ___, poor morale.",
        "Sales grew. ___, profits rose.",
        "Plan failed. ___, find a new one.",
      ],
      hint: "Consequently / Furthermore / However",
    },
    {
      number: 2,
      title: "Structuring Markers",
      difficulty: "Medium",
      instruction: "Fill in the structuring marker.",
      questions: [
        "___ costs, the budget is tight.",
        "___, establish the scope.",
        "___ approved, then audited.",
        "___, goals were not met.",
        "___ funding, two options exist.",
        "Good points. ___, weaknesses too.",
        "___, evidence shows reform needed.",
        "___ cost, option A wins.",
        "___ context, result is expected.",
        "Long study. ___, be cautious.",
      ],
      hint: "With regard to / In conclusion / That said",
    },
    {
      number: 3,
      title: "Reformulation & Emphasis",
      difficulty: "Hard",
      instruction: "Choose the best emphasis marker.",
      questions: [
        "Insignificant. ___, no firm conclusion.",
        "Issues arise, ___ data privacy.",
        "___ methodology has limits.",
        "Flawed — ___, a false assumption.",
        "Effective; ___, cost-efficient too.",
        "___, consequences may be severe.",
        "Approved, ___ after debate.",
        "Broadly good. ___, failed in cities.",
        "Risks noted, ___ cybersecurity.",
        "___, approach has merit. But…",
      ],
      hint: "In other words / Above all / Admittedly",
    },
    {
      number: 4,
      title: "Write the Missing Marker",
      difficulty: "Very Hard",
      instruction: "Write one discourse marker per gap.",
      questions: [
        "Costs up 30%. ___, scaled back.",
        "Faster. ___, far more reliable.",
        "Complex. ___, many stakeholders.",
        "Affected: ___ HR and Finance.",
        "___ its flaws, good proposals.",
        "___ economic benefits, costs too.",
        "Positive, ___ far from conclusive.",
        "Has merit. ___, overlooks issues.",
        "___ evidence, not confirmed yet.",
        "___, benefits outweigh the costs.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Result & Addition", answers: ["Consequently", "Furthermore", "However", "As a result", "What is more", "Hence", "As a result", "Moreover", "In addition", "Therefore"] },
    { exercise: 2, subtitle: "Structuring Markers", answers: ["In terms of", "In the first instance", "Initially / subsequently", "In conclusion", "Turning to", "That said", "On the whole", "In terms of", "In light of", "Even so"] },
    { exercise: 3, subtitle: "Reformulation & Emphasis", answers: ["In other words", "in particular", "It should be noted", "that is to say", "what is more", "Above all", "albeit", "That said", "notably", "Admittedly"] },
    { exercise: 4, subtitle: "Write the Missing Marker", answers: ["consequently", "what is more", "that is to say", "namely", "for all", "with regard to", "albeit", "that said", "given", "on the whole"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function AdvancedDiscourseMarkersLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Result, addition & exemplification markers",
      instructions: "Discourse markers organise information in formal writing and speech. Choose the marker that best fits the logical relationship shown.",
      questions: [
        { id: "e1q1", prompt: "Demand fell sharply. ___, several factories had to close. (result)", options: ["Consequently", "Furthermore", "Nevertheless"], correctIndex: 0, explanation: "Consequently = as a result of this (formal cause-effect marker)." },
        { id: "e1q2", prompt: "The project was over budget. ___, it was delivered six months late. (additional negative)", options: ["What is more", "On the contrary", "That said"], correctIndex: 0, explanation: "'What is more' / 'Moreover' = additionally (adds another point of equal or greater weight)." },
        { id: "e1q3", prompt: "Many countries have adopted the policy. ___, Germany introduced it in 2018. (example)", options: ["For instance", "In contrast", "Therefore"], correctIndex: 0, explanation: "'For instance' / 'For example' introduce a specific illustration of the previous point." },
        { id: "e1q4", prompt: "The evidence is inconclusive. ___, further research is required. (result/recommendation)", options: ["Hence", "Whereas", "Although"], correctIndex: 0, explanation: "'Hence' = for this reason / therefore. Formal, used in academic writing." },
        { id: "e1q5", prompt: "The treatment is expensive. ___, it has significant side effects. (adding a further negative point)", options: ["Furthermore", "However", "In contrast"], correctIndex: 0, explanation: "'Furthermore' / 'Moreover' = in addition to what has been said (same direction)." },
        { id: "e1q6", prompt: "The study confirmed previous findings. ___, it identified several new variables. (adding a positive point)", options: ["In addition", "Nevertheless", "By contrast"], correctIndex: 0, explanation: "'In addition' = also / and also (adds a point in the same direction)." },
        { id: "e1q7", prompt: "The regulations are unclear. ___, companies struggle to comply. (result)", options: ["As a result", "In contrast", "Granted"], correctIndex: 0, explanation: "'As a result' = because of this. Standard cause-effect discourse marker." },
        { id: "e1q8", prompt: "Several factors contributed to the decline — ___, poor management and lack of investment. (exemplification)", options: ["namely", "therefore", "nevertheless"], correctIndex: 0, explanation: "'Namely' introduces specific items that were referred to generally in the previous clause." },
        { id: "e1q9", prompt: "The infrastructure is outdated. ___, the digital systems are equally problematic. (adding, equal weight)", options: ["Similarly", "On the contrary", "Therefore"], correctIndex: 0, explanation: "'Similarly' = in the same way / likewise: introduces a parallel point." },
        { id: "e1q10", prompt: "Emissions have risen by 12%. ___, this figure is likely to increase further. (adding concern)", options: ["Moreover", "Nevertheless", "In contrast"], correctIndex: 0, explanation: "'Moreover' adds a point of equal or greater significance in the same direction." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Structuring markers: opening, ordering, closing",
      instructions: "Formal discourse uses specific markers to open arguments (with regard to, in terms of), sequence them (in the first instance, subsequently), and close them (in conclusion, to sum up, all in all). Choose the most appropriate marker.",
      questions: [
        { id: "e2q1", prompt: "___ the financial implications, the costs are significant.", options: ["With regard to", "In terms of", "Both are correct"], correctIndex: 2, explanation: "Both 'with regard to' and 'in terms of' introduce the topic being addressed. Slight difference: 'in terms of' is more specific." },
        { id: "e2q2", prompt: "___, it is necessary to establish the scope of the investigation.", options: ["In the first instance", "To begin", "Firstly"], correctIndex: 0, explanation: "'In the first instance' = as a first step (formal, legal/official register)." },
        { id: "e2q3", prompt: "___ the committee approved the budget; ___ it commissioned a full audit.", options: ["Initially / subsequently", "Firstly / lately", "To begin with / in the end"], correctIndex: 0, explanation: "'Initially' + 'subsequently' = temporal sequencing in formal narrative." },
        { id: "e2q4", prompt: "___, the policy has failed to achieve its intended goals.", options: ["In conclusion", "To sum up", "Both are correct"], correctIndex: 2, explanation: "Both 'In conclusion' and 'To sum up' introduce the final summarising statement." },
        { id: "e2q5", prompt: "___ the question of funding, two main options have been proposed.", options: ["Turning to", "With reference to", "Both are correct"], correctIndex: 2, explanation: "Both are used to shift focus to a new topic in formal discourse." },
        { id: "e2q6", prompt: "The proposal has several strengths. ___, there are also notable weaknesses.", options: ["That said", "At the same time", "Both are correct"], correctIndex: 2, explanation: "Both introduce a contrasting consideration after acknowledging the previous point." },
        { id: "e2q7", prompt: "___, the evidence points to a clear need for regulatory reform.", options: ["On the whole", "All in all", "Both are correct"], correctIndex: 2, explanation: "Both 'on the whole' and 'all in all' signal an overall summary/conclusion." },
        { id: "e2q8", prompt: "___ cost, the proposed solution is clearly superior.", options: ["In terms of", "Regarding", "Both are correct"], correctIndex: 2, explanation: "Both 'in terms of' and 'regarding' introduce the criterion/dimension being discussed." },
        { id: "e2q9", prompt: "___ the broader context, this finding is not surprising.", options: ["In light of", "Given", "Both are correct"], correctIndex: 2, explanation: "'In light of' and 'given' both introduce background context that explains the subsequent claim." },
        { id: "e2q10", prompt: "The data was collected over three years. ___, the findings should be treated with caution.", options: ["Even so", "Nonetheless", "Both are correct"], correctIndex: 2, explanation: "Both 'even so' and 'nonetheless' = despite what has been said, there is still reason for caution." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Reformulation, clarification & emphasis markers",
      instructions: "Reformulation markers (in other words, that is to say, to put it differently) restate or clarify. Emphasis markers (above all, in particular, especially, it should be noted) highlight key points. Choose the most appropriate marker.",
      questions: [
        { id: "e3q1", prompt: "The results were statistically insignificant. ___, they do not allow us to draw firm conclusions.", options: ["In other words", "On the contrary", "What is more"], correctIndex: 0, explanation: "'In other words' = that is to say: reformulates the previous statement more plainly." },
        { id: "e3q2", prompt: "Several issues arise from this approach, ___ the question of data privacy.", options: ["in particular", "above all", "Both are correct"], correctIndex: 2, explanation: "Both 'in particular' and 'above all' introduce the most important/specific item from a list." },
        { id: "e3q3", prompt: "___ that the methodology used in this study has significant limitations.", options: ["It should be noted", "It should be told", "It is to be noted that"], correctIndex: 0, explanation: "'It should be noted that' = formal emphasis marker drawing attention to an important qualification." },
        { id: "e3q4", prompt: "The approach is fundamentally flawed — ___, it rests on a false assumption.", options: ["that is to say", "in other words", "Both are correct"], correctIndex: 2, explanation: "Both 'that is to say' (formal/written) and 'in other words' (neutral) introduce a clarifying restatement." },
        { id: "e3q5", prompt: "The new approach is effective; ___, it is also considerably more cost-efficient.", options: ["what is more", "in addition", "Both are correct"], correctIndex: 2, explanation: "Both add a further point in the same direction: 'what is more' implies the added point is even more significant." },
        { id: "e3q6", prompt: "___, the long-term consequences of this decision may be severe.", options: ["Above all", "Most importantly", "Both are correct"], correctIndex: 2, explanation: "Both 'above all' and 'most importantly' emphasise the most critical point." },
        { id: "e3q7", prompt: "The proposal was approved, ___ after considerable debate.", options: ["albeit", "although", "even"], correctIndex: 0, explanation: "'Albeit' = although / even though (formal, clause-shortening). It was approved, albeit after debate." },
        { id: "e3q8", prompt: "The policy is broadly effective. ___, it has failed in urban areas.", options: ["That said", "Even so", "Both are correct"], correctIndex: 2, explanation: "Both introduce a specific qualification after a general concession." },
        { id: "e3q9", prompt: "The report draws attention to the risks, ___ those related to cybersecurity.", options: ["notably", "especially", "Both are correct"], correctIndex: 2, explanation: "Both 'notably' and 'especially' single out a specific example from a more general statement." },
        { id: "e3q10", prompt: "___, this approach has its merits. However, a more nuanced strategy is needed.", options: ["Admittedly", "To put it differently", "In conclusion"], correctIndex: 0, explanation: "'Admittedly' = conceding a point before introducing a contrasting view." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Complete with the most appropriate discourse marker",
      instructions: "Write the single best discourse marker for the gap. The relationship in brackets tells you the function needed. Write the marker only (lowercase, including punctuation if it's part of the phrase).",
      questions: [
        { id: "e4q1", prompt: "Costs increased by 30%. ___, the project had to be scaled back. (result → formal)", correct: "consequently", explanation: "'Consequently' = as a result. Formal cause-effect marker." },
        { id: "e4q2", prompt: "The new system is faster. ___, it is far more reliable. (adding a further positive)", correct: "what is more", explanation: "'What is more' adds a point of equal or greater significance." },
        { id: "e4q3", prompt: "The situation is complex. ___, it involves multiple stakeholders with conflicting interests. (reformulate/clarify)", correct: "that is to say", explanation: "'That is to say' = in other words: clarifies the complexity." },
        { id: "e4q4", prompt: "Several departments were affected, ___ HR and Finance. (specify)", correct: "namely", explanation: "'Namely' introduces specific items previously referred to in general terms." },
        { id: "e4q5", prompt: "___ its weaknesses, the report makes several important recommendations. (despite/concede → formal)", correct: "for all", explanation: "'For all' + noun phrase = despite. Formal: 'For all its weaknesses'." },
        { id: "e4q6", prompt: "___ the economic benefits, the environmental costs must also be considered. (turning to a new aspect)", correct: "with regard to", explanation: "'With regard to' introduces a new dimension of the discussion." },
        { id: "e4q7", prompt: "The results were positive, ___ far from conclusive. (contrast within same sentence — formal)", correct: "albeit", explanation: "'Albeit' = although/even though (shortening): positive, albeit far from conclusive." },
        { id: "e4q8", prompt: "The proposal has merit. ___, it overlooks several practical constraints. (balanced contrast)", correct: "that said", explanation: "'That said' = having acknowledged the merit, there is still a problem." },
        { id: "e4q9", prompt: "___ the evidence currently available, the hypothesis cannot be confirmed. (context that limits)", correct: "given", explanation: "'Given' + NP = in light of / considering: 'Given the evidence currently available'." },
        { id: "e4q10", prompt: "___, the benefits of the programme outweigh its costs. (overall conclusion)", correct: "on the whole", explanation: "'On the whole' = overall / in general: introduces a balanced concluding judgement." },
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
        <span className="text-slate-700 font-medium">Advanced Discourse Markers</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Advanced{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Discourse Markers</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Discourse markers are words and phrases that organise the flow of formal writing and speech. C1 requires command of markers for <b>result</b> (consequently, hence, thereby), <b>addition</b> (furthermore, what is more), <b>structuring</b> (with regard to, in the first instance), <b>reformulation</b> (in other words, that is to say), and <b>emphasis</b> (above all, it should be noted, notably).
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-c1-advanced-discourse-markers" subject="Advanced Discourse Markers" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-c1-advanced-discourse-markers" subject="Advanced Discourse Markers" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All C1 Grammar →</a>
      </div>
    </div>
  );
}

function Explanation() {
  const groups = [
    {
      label: "Result / Consequence",
      markers: [
        { m: "consequently", note: "formal; cause → result" },
        { m: "hence", note: "very formal; academic/legal" },
        { m: "therefore", note: "neutral; most common" },
        { m: "as a result", note: "neutral; widely used" },
        { m: "thereby", note: "formal; often + -ing clause" },
        { m: "thus", note: "very formal; academic prose" },
      ],
    },
    {
      label: "Addition",
      markers: [
        { m: "furthermore", note: "formal; adds equal/stronger point" },
        { m: "moreover", note: "formal; adds stronger point" },
        { m: "what is more", note: "semi-formal; emphasises escalation" },
        { m: "in addition (to)", note: "neutral; very common" },
        { m: "similarly / likewise", note: "introduces parallel point" },
      ],
    },
    {
      label: "Structuring / Framing",
      markers: [
        { m: "with regard to / regarding", note: "introduces topic/aspect" },
        { m: "in terms of", note: "introduces criterion/dimension" },
        { m: "in the first instance", note: "formal: as a first step" },
        { m: "subsequently / thereafter", note: "formal sequencing" },
        { m: "turning to", note: "shifts to a new topic" },
        { m: "in light of / given", note: "introduces context" },
      ],
    },
    {
      label: "Reformulation / Clarification",
      markers: [
        { m: "in other words", note: "neutral; restates more plainly" },
        { m: "that is to say", note: "formal; precise clarification" },
        { m: "to put it differently", note: "rephrases with new angle" },
        { m: "namely", note: "specifies items mentioned generally" },
      ],
    },
    {
      label: "Emphasis / Highlighting",
      markers: [
        { m: "above all / most importantly", note: "introduces the key point" },
        { m: "in particular / notably", note: "singles out a specific example" },
        { m: "it should be noted that", note: "formal attention-drawing" },
        { m: "especially", note: "semi-formal; specifies" },
      ],
    },
    {
      label: "Concession / Contrast",
      markers: [
        { m: "that said / having said that", note: "acknowledge then contrast" },
        { m: "even so / nonetheless", note: "= despite this, still…" },
        { m: "admittedly / granted", note: "concede a point before countering" },
        { m: "albeit", note: "formal: although/even if (clause-shortening)" },
      ],
    },
    {
      label: "Conclusion / Summary",
      markers: [
        { m: "in conclusion / to conclude", note: "formal closing" },
        { m: "to sum up / in summary", note: "neutral closing" },
        { m: "on the whole / all in all", note: "balanced overall judgement" },
        { m: "overall", note: "neutral; most common in writing" },
      ],
    },
  ];
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Advanced Discourse Markers (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {groups.map(({ label, markers }) => (
          <div key={label} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-3">{label}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              {markers.map(({ m, note }) => (
                <div key={m} className="text-sm flex gap-2">
                  <span className="font-semibold text-slate-900 shrink-0">{m}</span>
                  <span className="text-slate-500">— {note}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Register note</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div><b>Very formal (academic/legal):</b> hence, thus, thereby, in the first instance, that is to say</div>
          <div><b>Formal (essay/report):</b> consequently, furthermore, moreover, with regard to, it should be noted</div>
          <div><b>Semi-formal (mixed writing):</b> what is more, that said, in other words, on the whole</div>
          <div><b>Avoid in formal writing:</b> also (at start of sentence), plus, but (at start of sentence in formal essays)</div>
        </div>
      </div>
    </div>
  );
}
