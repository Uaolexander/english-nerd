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
  { title: "Advanced Modals", href: "/grammar/c1/advanced-modals", level: "C1", badge: "bg-sky-600", reason: "Modals are the primary grammar tool for hedging at C1 level" },
  { title: "Concession & Contrast", href: "/grammar/c1/concession-contrast", level: "C1", badge: "bg-sky-600" },
  { title: "Subjunctive", href: "/grammar/c1/subjunctive", level: "C1", badge: "bg-sky-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Hedging makes claims ___.", options: ["Less absolute/tentative", "Stronger/definite", "More formal", "More aggressive"], answer: 0 },
  { q: "'It seems that' = ___.", options: ["A hedge", "A fact", "Certainty", "A question"], answer: 0 },
  { q: "Hedging modal for possibility:", options: ["might/may", "must", "should", "will"], answer: 0 },
  { q: "'Tend to' hedges by expressing:", options: ["General tendency, not always", "Certainty", "Impossibility", "Obligation"], answer: 0 },
  { q: "'It is generally believed' = ___.", options: ["Hedge via distancing", "Strong claim", "Certainty", "Personal view"], answer: 0 },
  { q: "'Broadly speaking' is a ___.", options: ["Hedging adverb", "Discourse marker", "Intensifier", "Conjunction"], answer: 0 },
  { q: "Which hedges a claim most?", options: ["It could be argued that", "It is definitely true", "Everyone knows that", "The fact is that"], answer: 0 },
  { q: "'To some extent' means:", options: ["Partially/not fully", "Completely", "Not at all", "Very much so"], answer: 0 },
  { q: "Hedging is common in ___.", options: ["Academic writing", "Command forms", "Greetings", "Exclamations"], answer: 0 },
  { q: "'As far as we know' = ___.", options: ["Epistemic hedge", "Certainty marker", "Result marker", "Concession"], answer: 0 },
  { q: "In many ways = ___.", options: ["Partial hedge", "Strong claim", "Result", "Contrast"], answer: 0 },
  { q: "'Arguably' introduces a ___.", options: ["Contestable claim", "Certain fact", "Question", "Contradiction"], answer: 0 },
  { q: "The results ___ suggest a link.", options: ["would appear to", "definitely", "always", "must"], answer: 0 },
  { q: "'It is worth noting that' = ___.", options: ["Soft emphasis hedge", "Strong claim", "Denial", "Apology"], answer: 0 },
  { q: "Which is NOT a hedge?", options: ["This conclusively proves", "This might suggest", "It appears that", "Evidence indicates"], answer: 0 },
  { q: "'On the whole' hedges by ___.", options: ["Qualifying a general claim", "Making it absolute", "Adding more info", "Showing contrast"], answer: 0 },
  { q: "'Could be seen as' hedges ___.", options: ["An interpretation", "A fact", "A definition", "A question"], answer: 0 },
  { q: "Hedging main purpose in academia:", options: ["Show appropriate caution", "Make text longer", "Avoid passive", "Use fewer words"], answer: 0 },
  { q: "'There is evidence to suggest' ___.", options: ["Hedges a conclusion", "Proves a point", "Denies a claim", "Changes the topic"], answer: 0 },
  { q: "'Largely' = ___.", options: ["Mostly but not fully", "Completely", "Never", "Rarely"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Hedging Language",
  subtitle: "Expressing caution and tentativeness in academic writing",
  level: "C1",
  keyRule: "Hedges soften claims: might, appear to, tend to, broadly, arguably.",
  exercises: [
    {
      number: 1,
      title: "Hedging Modals & Verbs",
      difficulty: "Easy",
      instruction: "Choose the best hedging expression.",
      questions: [
        "The results ___ suggest a link.",
        "This ___ indicate a wider problem.",
        "Prices ___ continue to rise.",
        "The data ___ point to a trend.",
        "She ___ have misunderstood.",
        "The findings ___ be significant.",
        "This ___ be seen as a weakness.",
        "The situation ___ improve.",
        "Their approach ___ work better.",
        "The proposal ___ be reconsidered.",
      ],
      hint: "might / may / could / would appear to",
    },
    {
      number: 2,
      title: "Hedging Adverbs & Phrases",
      difficulty: "Medium",
      instruction: "Choose the correct hedging phrase.",
      questions: [
        "___, the plan has merit.",
        "The study is ___ accurate.",
        "___, technology brings risks.",
        "The findings are ___ positive.",
        "___, this is the best approach.",
        "This is ___ a complex issue.",
        "The results are ___ conclusive.",
        "___, costs will rise.",
        "The approach is ___ effective.",
        "___, the benefits outweigh risks.",
      ],
      hint: "Broadly speaking / largely / arguably / to some extent",
    },
    {
      number: 3,
      title: "Hedging with It-Constructions",
      difficulty: "Hard",
      instruction: "Choose the correct it-hedge.",
      questions: [
        "___ that change is needed.",
        "___ that costs will rise.",
        "___ that this is the best way.",
        "___ that more research is due.",
        "___ to be a widespread issue.",
        "___ that views are mixed.",
        "___ that the plan will work.",
        "___ that problems exist.",
        "___ clear there is no easy fix.",
        "___ to suggest a causal link.",
      ],
      hint: "It seems / It appears / It could be argued",
    },
    {
      number: 4,
      title: "Rewrite Using Hedging Language",
      difficulty: "Very Hard",
      instruction: "Rewrite to make the claim more tentative.",
      questions: [
        "Technology causes inequality.",
        "The plan will fail completely.",
        "This proves the theory correct.",
        "The economy will recover fast.",
        "Climate change is man-made.",
        "This is the wrong approach.",
        "The drug cures the disease.",
        "She made the wrong decision.",
        "This method is superior.",
        "The data shows a clear link.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Hedging Modals & Verbs", answers: ["would appear to", "might", "may", "could", "may", "could", "could", "might", "could", "might"] },
    { exercise: 2, subtitle: "Hedging Adverbs & Phrases", answers: ["Broadly speaking", "largely", "Arguably", "broadly", "To some extent", "arguably", "not entirely", "In all likelihood", "relatively", "On the whole"] },
    { exercise: 3, subtitle: "Hedging with It-Constructions", answers: ["It seems", "It appears", "It could be argued", "It is worth noting", "It appears", "It seems", "It might be hoped", "It is generally acknowledged", "It is not entirely", "There is evidence"] },
    { exercise: 4, subtitle: "Rewrite Using Hedging Language", answers: ["Technology may contribute to inequality.", "The plan could potentially fail.", "This would appear to support the theory.", "The economy might recover relatively quickly.", "Climate change is largely considered to be man-made.", "This could be seen as the wrong approach.", "The drug appears to help treat the disease.", "She may have made the wrong decision.", "This method could be considered superior.", "The data appears to suggest a possible link."] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function HedgingLanguageLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Modal verbs & tentative verbs for hedging",
      instructions: "Hedging makes claims less absolute. Modal verbs (may, might, could, would) and tentative verbs (seem, appear, tend, suggest) soften statements. Choose the best hedged form.",
      questions: [
        { id: "e1q1", prompt: "The results ___ indicate a link between diet and cognitive decline.", options: ["may", "must", "will"], correctIndex: 0, explanation: "'May indicate' = hedged claim; 'must' is too certain; 'will' is definite." },
        { id: "e1q2", prompt: "This ___ be the most significant discovery of the decade.", options: ["could", "is", "should"], correctIndex: 0, explanation: "'Could be' = tentative possibility, appropriate for hedged academic claim." },
        { id: "e1q3", prompt: "The evidence ___ to support the hypothesis.", options: ["seems", "is", "proves"], correctIndex: 0, explanation: "'Seems to support' = tentative verb; softer than 'is' or 'proves'." },
        { id: "e1q4", prompt: "Prices ___ to rise further in the coming months.", options: ["tend", "are", "will"], correctIndex: 0, explanation: "'Tend to' = typical pattern, not absolute certainty." },
        { id: "e1q5", prompt: "The data ___ that further research is needed.", options: ["suggests", "proves", "tells"], correctIndex: 0, explanation: "'Suggests' = cautious interpretation; 'proves' is too strong for uncertain data." },
        { id: "e1q6", prompt: "There ___ be several reasons for this decline.", options: ["may", "are", "must"], correctIndex: 0, explanation: "'May be' = speculative; appropriate when not certain of the cause." },
        { id: "e1q7", prompt: "The treatment ___ to be less effective in older patients.", options: ["appears", "is shown", "proves"], correctIndex: 0, explanation: "'Appears to be' = tentative observation, softer than factual 'is shown'." },
        { id: "e1q8", prompt: "This ___ not be the only factor contributing to the problem.", options: ["might", "is", "cannot"], correctIndex: 0, explanation: "'Might not be' = hedged negation: it's possible that other factors also contribute." },
        { id: "e1q9", prompt: "The findings ___ suggest a causal relationship.", options: ["would", "could", "Both are correct"], correctIndex: 2, explanation: "Both 'would suggest' (distancing) and 'could suggest' (possibility) are acceptable hedging modals." },
        { id: "e1q10", prompt: "This ___ explain the unexpected results.", options: ["might", "may", "Both are correct"], correctIndex: 2, explanation: "Both 'might' and 'may' express possibility. 'Might' is slightly more tentative." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Adverbs, qualifiers & distancing phrases",
      instructions: "Hedging adverbs (apparently, presumably, arguably, seemingly, broadly) and qualifiers (to some extent, in most cases, generally) limit the scope of a claim. Choose the most appropriate hedging expression.",
      questions: [
        { id: "e2q1", prompt: "___, the new approach is more cost-effective than the old one.", options: ["Arguably", "Obviously", "Certainly"], correctIndex: 0, explanation: "'Arguably' = this can be argued (the speaker doesn't claim certainty)." },
        { id: "e2q2", prompt: "The policy has been ___ successful in reducing emissions.", options: ["broadly", "absolutely", "completely"], correctIndex: 0, explanation: "'Broadly successful' = successful in general terms, with possible exceptions. Academic register." },
        { id: "e2q3", prompt: "The results are ___ consistent with the original hypothesis.", options: ["largely", "totally", "perfectly"], correctIndex: 0, explanation: "'Largely consistent' = mostly consistent. Hedges against total inconsistency." },
        { id: "e2q4", prompt: "The increase in demand is ___ due to population growth.", options: ["partly", "entirely", "purely"], correctIndex: 0, explanation: "'Partly due to' = one contributing factor among possibly others." },
        { id: "e2q5", prompt: "___, the investigation was conducted without proper oversight.", options: ["Apparently", "Obviously", "Clearly"], correctIndex: 0, explanation: "'Apparently' = based on what seems to be the case (distancing from direct claim)." },
        { id: "e2q6", prompt: "This approach works ___ in controlled environments but may not generalise.", options: ["well", "reasonably well", "perfectly well"], correctIndex: 1, explanation: "'Reasonably well' = adequately, with limitations — appropriate for hedged academic claim." },
        { id: "e2q7", prompt: "___, the benefits outweigh the risks.", options: ["On balance", "Definitely", "Undoubtedly"], correctIndex: 0, explanation: "'On balance' = after weighing both sides (implies acknowledgement of counter-arguments)." },
        { id: "e2q8", prompt: "The relationship between the variables is ___ complex.", options: ["somewhat", "very", "rather"], correctIndex: 0, explanation: "'Somewhat complex' hedges the degree; 'very/rather' are less hedging and more assertive." },
        { id: "e2q9", prompt: "___, higher income correlates with better health outcomes.", options: ["In general", "Always", "Inevitably"], correctIndex: 0, explanation: "'In general' = as a tendency, not an absolute rule." },
        { id: "e2q10", prompt: "This ___ explain the anomaly in the dataset.", options: ["could in part", "definitely", "must fully"], correctIndex: 0, explanation: "'Could in part explain' = double hedging: possibility (could) + partial scope (in part)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Hedging structures in academic writing",
      instructions: "Academic writing uses structures like 'it would appear that', 'it is possible that', 'there is reason to believe', 'to a certain extent'. Choose the most appropriate hedged academic sentence.",
      questions: [
        { id: "e3q1", prompt: "Which is the most appropriately hedged academic claim?", options: ["The data proves that the intervention was effective.", "The data suggests that the intervention may have been effective.", "The data shows the intervention was definitely effective."], correctIndex: 1, explanation: "'suggests' + 'may have been' = double hedge: tentative verb + modal. Appropriate for academic writing." },
        { id: "e3q2", prompt: "Which sentence uses 'it would appear' correctly?", options: ["It would appear that the original assumptions were flawed.", "It would appear the assumptions were wrong definitely.", "It appears that the assumptions were correct probably."], correctIndex: 0, explanation: "'It would appear that + clause' = formal distancing structure. 'Would' adds extra tentativeness." },
        { id: "e3q3", prompt: "Which is correctly hedged with a scope qualifier?", options: ["This applies to all cases without exception.", "This applies in most cases, though exceptions exist.", "This completely applies to every scenario."], correctIndex: 1, explanation: "'In most cases, though exceptions exist' = scope qualifier + acknowledgement of limitations." },
        { id: "e3q4", prompt: "Which best qualifies a claim using 'to some extent'?", options: ["The policy has, to some extent, achieved its objectives.", "The policy has to some extent definitely succeeded.", "The policy has completely, to some extent, worked."], correctIndex: 0, explanation: "'To some extent' = partial degree qualifier. Correctly placed within the verb phrase." },
        { id: "e3q5", prompt: "Which version hedges appropriately for an academic essay?", options: ["There is no doubt that urban sprawl causes social isolation.", "There is some evidence to suggest that urban sprawl may contribute to social isolation.", "Urban sprawl obviously causes social isolation."], correctIndex: 1, explanation: "'Some evidence to suggest' + 'may contribute' = evidential hedge + modal + scope." },
        { id: "e3q6", prompt: "Which phrase correctly distances the writer from a claim?", options: ["According to some researchers, the effect is minimal.", "All researchers agree the effect is minimal.", "It is obvious that the effect is minimal."], correctIndex: 0, explanation: "'According to some researchers' = evidential distancing. The writer doesn't personally vouch for the claim." },
        { id: "e3q7", prompt: "Which is the most cautious academic formulation?", options: ["The results confirm the theory beyond any doubt.", "The results tend to support the theory, though further research is needed.", "The results might not be completely wrong about the theory."], correctIndex: 1, explanation: "'Tend to support' + 'though further research is needed' = typical C1+ academic hedging." },
        { id: "e3q8", prompt: "Which sentence uses 'it is worth noting' correctly?", options: ["It is worth noting that the sample size was relatively small.", "It is worth noting the sample size was definitely representative.", "It is worth to note that the sample was big."], correctIndex: 0, explanation: "'It is worth noting that' = draws attention to a qualification. Correct grammar: worth + gerund." },
        { id: "e3q9", prompt: "Which uses epistemic distancing most effectively?", options: ["Inflation will rise next year.", "Inflation is expected to rise next year.", "Inflation must rise next year."], correctIndex: 1, explanation: "'Is expected to' = passive distancing from the source of the prediction. Hedges certainty." },
        { id: "e3q10", prompt: "Which sentence is over-hedged (too many qualifiers, becomes unclear)?", options: ["This may perhaps somewhat possibly suggest a partial link.", "This may suggest a partial link.", "There appears to be some evidence suggesting a possible link."], correctIndex: 0, explanation: "Over-hedging: 'may perhaps somewhat possibly' stacks too many hedges and becomes meaningless." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite as hedged academic claims",
      instructions: "Rewrite each assertive sentence as a hedged, academic-style claim using the structure shown. Write the full sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "The drug cures the disease. (may + suggest)", correct: "the data may suggest that the drug helps to treat the disease", explanation: "Double hedge: 'may' (modal) + 'suggest' (tentative verb) + weaker verb 'helps to treat' instead of 'cures'." },
        { id: "e4q2", prompt: "Poverty causes crime. (tend to + contribute to)", correct: "poverty tends to contribute to higher crime rates", explanation: "'Tends to contribute to' = habitual tendency + partial cause (not sole/direct cause)." },
        { id: "e4q3", prompt: "The new policy will fail. (it would appear that + may)", correct: "it would appear that the new policy may face significant challenges", explanation: "'It would appear that' + 'may' = distancing + modal hedge. Softer than 'will fail'." },
        { id: "e4q4", prompt: "All students benefit from smaller class sizes. (in most cases + appear to)", correct: "in most cases, students appear to benefit from smaller class sizes", explanation: "Scope qualifier ('in most cases') + tentative verb ('appear to')." },
        { id: "e4q5", prompt: "This proves that the theory is correct. (suggests / to some extent)", correct: "this suggests that the theory is, to some extent, correct", explanation: "'Suggests' + 'to some extent' = evidential hedge + degree qualifier." },
        { id: "e4q6", prompt: "Climate change is causing more frequent extreme weather events. (there is growing evidence to suggest that)", correct: "there is growing evidence to suggest that climate change is contributing to more frequent extreme weather events", explanation: "Evidential framing + 'contributing to' (weaker than 'causing')." },
        { id: "e4q7", prompt: "The economy will improve next year. (is expected to / broadly)", correct: "the economy is broadly expected to improve next year", explanation: "Passive distancing ('is expected to') + qualifier ('broadly')." },
        { id: "e4q8", prompt: "Social media makes teenagers depressed. (may + arguably)", correct: "social media may arguably contribute to depression in some teenagers", explanation: "'May' (modal) + 'arguably' (arguability hedge) + 'contribute to' + 'some' (scope limiter)." },
        { id: "e4q9", prompt: "The results confirm our hypothesis. (appear to + largely)", correct: "the results appear to largely support our hypothesis", explanation: "'Appear to' (tentative) + 'largely support' (partial, not total confirmation)." },
        { id: "e4q10", prompt: "This is the best approach. (it could be argued that + one of)", correct: "it could be argued that this is one of the most effective approaches", explanation: "'It could be argued that' (distancing + modality) + 'one of' (scope limiter)." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Hedging Language</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Hedging{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Language</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Hedging means making claims less absolute — signalling uncertainty, possibility, or limited scope. It is essential in academic writing, journalism, and professional English. Key tools: <b>modal verbs</b> (may/might/could), <b>tentative verbs</b> (seem/appear/tend/suggest), <b>hedging adverbs</b> (arguably/apparently/broadly), and <b>distancing structures</b> (it would appear that / to some extent / there is evidence to suggest).
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-c1-hedging-language" subject="Hedging Language" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-c1-hedging-language" subject="Hedging Language" questions={SPEED_QUESTIONS} />
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
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Hedging Language (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { title: "Modal verbs: possibility & tentativeness", items: ["may / might + infinitive: The results may indicate…", "could + infinitive: This could explain the anomaly.", "would + suggest: The data would suggest…", "should (expectation, not obligation): This should be…"] },
          { title: "Tentative verbs", items: ["seem / appear + to-inf: The treatment appears to be effective.", "tend to + inf: Prices tend to rise in winter.", "suggest / indicate + that-clause: The evidence suggests that…", "remain unclear / open to debate: The mechanism remains unclear."] },
          { title: "Hedging adverbs (epistemic)", items: ["arguably: Arguably, the most significant factor is…", "apparently: Apparently, the original data was incomplete.", "presumably: The delay was presumably due to logistical issues.", "seemingly: The results are seemingly contradictory.", "broadly / largely / generally: broadly consistent with previous findings"] },
          { title: "Scope qualifiers", items: ["to some extent / to a certain degree", "in most cases / in the majority of instances", "under certain conditions / in specific contexts", "partly / in part / at least in part"] },
          { title: "Distancing structures", items: ["It would appear that + clause", "It is possible / plausible that + clause", "There is (some) evidence to suggest that…", "According to some researchers / estimates…", "It could be argued that…", "It is worth noting that…"] },
        ].map(({ title, items }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-2">{title}</div>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item} className="text-sm text-slate-700 flex gap-2"><span className="text-cyan-400 font-bold shrink-0">→</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Strong → Hedged: transformation examples</div>
        <div className="text-sm text-slate-700 space-y-2">
          <div><span className="text-red-600">Strong:</span> <i>Poverty causes crime.</i><br /><span className="text-emerald-700">Hedged:</span> <i>Poverty may be one factor that contributes to higher crime rates.</i></div>
          <div><span className="text-red-600">Strong:</span> <i>The policy failed.</i><br /><span className="text-emerald-700">Hedged:</span> <i>The policy appears to have fallen short of its stated objectives in several key areas.</i></div>
          <div><span className="text-red-600">Strong:</span> <i>This proves our hypothesis.</i><br /><span className="text-emerald-700">Hedged:</span> <i>These findings tend to support the hypothesis, though further research is needed.</i></div>
        </div>
      </div>
    </div>
  );
}
