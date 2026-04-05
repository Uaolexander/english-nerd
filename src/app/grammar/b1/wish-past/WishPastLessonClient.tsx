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
  { q: "wish + ___ (present regret)", options: ["present simple", "will + verb", "past simple", "present perfect"], answer: 2 },
  { q: "'I wish I ___ taller.' Correct form:", options: ["am", "will be", "was/were", "have been"], answer: 2 },
  { q: "'She wishes she ___ drive.' Correct form:", options: ["can", "will", "could", "is able to"], answer: 2 },
  { q: "'If only' is compared to 'wish': it is ___", options: ["less emphatic", "more emphatic", "the same", "used only in the past"], answer: 1 },
  { q: "'I wish I ___ more free time.'", options: ["have", "will have", "had", "am having"], answer: 2 },
  { q: "wish + past perfect (had + pp) = regret about ___", options: ["present situation", "future plans", "past actions", "general facts"], answer: 2 },
  { q: "'I wish I ___ harder at school.' (regret)", options: ["study", "studied", "had studied", "will study"], answer: 2 },
  { q: "'If only I ___ accepted that job!'", options: ["accept", "had accepted", "have accepted", "would accept"], answer: 1 },
  { q: "Which is CORRECT?", options: ["I wish I have more time.", "I wish I had more time.", "I wish I will have more time.", "I wish I am having more time."], answer: 1 },
  { q: "Which is CORRECT?", options: ["If only she study more!", "If only she will study more!", "If only she studied more!", "If only she is studying more!"], answer: 2 },
  { q: "'He wishes he ___ at the party.' (he wasn't there)", options: ["was", "is", "will be", "had been"], answer: 3 },
  { q: "I wish + past simple refers to ___:", options: ["Past completed events", "Present/future unreal wish", "General facts", "Future plans"], answer: 1 },
  { q: "'We wish we ___ in a bigger house.' (now)", options: ["live", "lived", "had lived", "will live"], answer: 1 },
  { q: "'If only I ___ said that.' (past regret)", options: ["didn't", "hadn't", "don't", "won't"], answer: 1 },
  { q: "wish + would = wish about ___ behaviour", options: ["your own", "past events", "someone else's annoying", "general facts"], answer: 2 },
  { q: "'I wish you ___ stop making that noise!'", options: ["will", "would", "could not", "should"], answer: 1 },
  { q: "Which expresses a past regret?", options: ["I wish I had more money.", "I wish I had had more money.", "I wish I have more money.", "I wish I will have money."], answer: 1 },
  { q: "Correct use: 'I wish I ___ born here.'", options: ["was", "am", "had been", "will be"], answer: 2 },
  { q: "'She wishes she ___ the truth.' (she lied — past regret)", options: ["tells", "told", "had told", "will tell"], answer: 2 },
  { q: "wish + past simple vs. wish + past perfect:", options: ["Both express present wishes", "Past simple = present wish; past perfect = past regret", "Past perfect = present wish; past simple = past regret", "They are identical in meaning"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Wish + Past Simple/Perfect",
  subtitle: "wish / if only + past = present/past regret",
  level: "B1",
  keyRule: "wish/if only + past simple = present wish. wish/if only + past perfect (had+pp) = past regret.",
  exercises: [
    {
      number: 1,
      title: "Choose the correct form",
      difficulty: "Easy",
      instruction: "Choose the correct verb form after wish.",
      questions: [
        "I wish I ___ taller. (I'm not tall)",
        "She wishes she ___ how to drive.",
        "I wish it ___ raining. (it is raining)",
        "He wishes he ___ more free time.",
        "I wish I ___ speak French.",
        "She wishes she ___ here.",
        "We wish we ___ a bigger flat.",
        "I wish I ___ so tired all the time.",
        "He wishes he ___ play the guitar.",
        "I wish the neighbours ___ so noisy.",
      ],
    },
    {
      number: 2,
      title: "wish or if only?",
      difficulty: "Medium",
      instruction: "Choose the more emphatic option or the correct form.",
      questions: [
        "Which is more emphatic: wish or if only?",
        "Correct: 'I wish I have/had more money.'",
        "Correct: 'If only it will/stopped raining!'",
        "Correct: 'I wish I were/am on holiday.'",
        "Correct: 'I wish I could/can fly.'",
        "Correct: 'She wishes she didn't/doesn't have to work.'",
        "Correct: 'If only I knew/know the answer!'",
        "Correct: 'I wish he would/will call more often.'",
        "Correct: 'She wishes she lived/lives in Paris.'",
        "More emphatic: 'I wish I passed' or 'If only I passed!'",
      ],
    },
    {
      number: 3,
      title: "Write the wish sentence",
      difficulty: "Hard",
      instruction: "Use wish + correct verb form.",
      questions: [
        "I don't have a car. I wish I ___.",
        "She can't cook. She wishes she ___.",
        "It's raining. I wish it ___.",
        "He has to work Saturday. He wishes ___.",
        "I'm not on holiday. I wish I ___.",
        "They live far away. They wish they ___.",
        "I don't know the answer. I wish I ___.",
        "She is always late. I wish she ___.",
        "I can't afford it. I wish I ___.",
        "He is rude to me. I wish he ___.",
      ],
    },
    {
      number: 4,
      title: "Present wish or past regret?",
      difficulty: "Harder",
      instruction: "Choose: wish + past simple (present) or past perfect (regret).",
      questions: [
        "I'm tired now. I wish I ___ to bed earlier.",
        "I don't speak Spanish. I wish I ___ Spanish.",
        "He failed the test. He wishes he ___ harder.",
        "She can't come. She wishes she ___ here.",
        "I said something rude. I wish I ___ that.",
        "We missed the train. We wish we ___ earlier.",
        "She doesn't like her job. She wishes she ___.",
        "He didn't apply. He wishes he ___ the job.",
        "I live far from work. I wish I ___ closer.",
        "They argued. They wish they ___ the argument.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "wish + past simple", answers: ["was/were", "knew", "stopped", "had", "could", "were/was", "lived in", "wasn't", "could", "weren't"] },
    { exercise: 2, subtitle: "wish or if only", answers: ["if only", "had", "stopped", "were", "could", "didn't", "knew", "would", "lived", "if only"] },
    { exercise: 3, subtitle: "Write wish", answers: ["had a car", "could cook", "would stop", "he didn't have to", "were on holiday", "lived closer", "knew", "weren't always late", "could afford it", "would be nicer"] },
    { exercise: 4, subtitle: "Present or past regret", answers: ["had gone", "spoke", "had studied", "could be", "hadn't said", "had left", "liked her job", "had applied for", "lived", "hadn't had"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Second Conditional", href: "/grammar/b1/second-conditional", level: "B1", badge: "bg-violet-500", reason: "Wish uses the same past simple form as 2nd conditional" },
  { title: "All Conditionals", href: "/grammar/b1/all-conditionals", level: "B1", badge: "bg-violet-500" },
  { title: "Modal Verbs: Deduction", href: "/grammar/b1/modal-deduction", level: "B1", badge: "bg-violet-500" },
];

export default function WishPastLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct form after wish",
      instructions: "Choose the correct verb form after 'wish' (past simple for present wishes).",
      questions: [
        { id: "e1q1", prompt: "I wish I ___ taller. (I'm not tall)", options: ["was/were", "am", "will be"], correctIndex: 0, explanation: "wish + past simple for present regret: wish I were/was taller." },
        { id: "e1q2", prompt: "She wishes she ___ how to drive. (she can't)", options: ["knew", "knows", "will know"], correctIndex: 0, explanation: "wish + past simple: knew (not 'knows')." },
        { id: "e1q3", prompt: "I wish it ___ raining. (it is raining)", options: ["stopped", "stops", "will stop"], correctIndex: 0, explanation: "wish + past simple: stopped." },
        { id: "e1q4", prompt: "He wishes he ___ more free time. (he's very busy)", options: ["had", "has", "will have"], correctIndex: 0, explanation: "wish + past simple: had." },
        { id: "e1q5", prompt: "I wish I ___ speak French. (I can't)", options: ["could", "can", "will"], correctIndex: 0, explanation: "wish + could (past form of can)." },
        { id: "e1q6", prompt: "She wishes she ___ here. (she's not here)", options: ["were/was", "is", "will be"], correctIndex: 0, explanation: "wish + past simple: were/was here." },
        { id: "e1q7", prompt: "We wish we ___ a bigger flat. (our flat is small)", options: ["lived in", "live in", "will live in"], correctIndex: 0, explanation: "wish + past simple: lived in." },
        { id: "e1q8", prompt: "I wish I ___ so tired all the time.", options: ["wasn't", "am not", "won't be"], correctIndex: 0, explanation: "wish + past simple negative: wasn't." },
        { id: "e1q9", prompt: "He wishes he ___ play the guitar.", options: ["could", "can", "would"], correctIndex: 0, explanation: "wish + could: ability wish." },
        { id: "e1q10", prompt: "I wish the neighbours ___ so noisy.", options: ["weren't", "aren't", "won't be"], correctIndex: 0, explanation: "wish + past simple negative: weren't." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — wish or if only?",
      instructions: "Choose the correct sentence — both 'wish' and 'if only' use past simple, but 'if only' is more emphatic.",
      questions: [
        { id: "e2q1", prompt: "She really regrets not knowing Spanish. Which is more emphatic?", options: ["She wishes she knew Spanish.", "If only she knew Spanish!"], correctIndex: 1, explanation: "'If only' is more emphatic and emotional than 'wish'." },
        { id: "e2q2", prompt: "Which sentence is grammatically correct?", options: ["I wish I have more money.", "I wish I had more money."], correctIndex: 1, explanation: "wish + past simple: had (not present simple)." },
        { id: "e2q3", prompt: "Which sentence is grammatically correct?", options: ["If only it will stop raining!", "If only it stopped raining!"], correctIndex: 1, explanation: "if only + past simple: stopped." },
        { id: "e2q4", prompt: "Which sentence is grammatically correct?", options: ["I wish I were on holiday right now.", "I wish I am on holiday right now."], correctIndex: 0, explanation: "wish + past simple: were/was." },
        { id: "e2q5", prompt: "Which expresses a stronger wish?", options: ["I wish I could fly.", "If only I could fly!"], correctIndex: 1, explanation: "'If only' is more dramatic and emphatic." },
        { id: "e2q6", prompt: "Which is correct?", options: ["She wishes she didn't have to work so hard.", "She wishes she doesn't have to work so hard."], correctIndex: 0, explanation: "wish + past simple: didn't have to." },
        { id: "e2q7", prompt: "Which is correct?", options: ["If only I knew the answer!", "If only I know the answer!"], correctIndex: 0, explanation: "if only + past simple: knew." },
        { id: "e2q8", prompt: "Which is correct?", options: ["I wish he would stop interrupting me.", "I wish he stops interrupting me."], correctIndex: 0, explanation: "wish + would for annoying habits = I want it to change." },
        { id: "e2q9", prompt: "Which is correct?", options: ["She wishes she could come to the party.", "She wishes she can come to the party."], correctIndex: 0, explanation: "wish + could (past of can)." },
        { id: "e2q10", prompt: "Which is correct?", options: ["I wish I were better at maths.", "I wish I would be better at maths."], correctIndex: 0, explanation: "For states, use wish + were/was, not would." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the correct form",
      instructions: "Write the correct verb form after 'wish' or 'if only'.",
      questions: [
        { id: "e3q1", prompt: "I wish I ___ (know) her address.", correct: "knew", explanation: "wish + past simple: knew." },
        { id: "e3q2", prompt: "She wishes she ___ (be) more confident.", correct: "were", explanation: "wish + were/was: were." },
        { id: "e3q3", prompt: "If only he ___ (not / talk) so much!", correct: "didn't talk", explanation: "if only + past simple negative: didn't talk." },
        { id: "e3q4", prompt: "I wish I ___ (can) afford a holiday.", correct: "could", explanation: "wish + could (past of can)." },
        { id: "e3q5", prompt: "We wish we ___ (live) closer to the city.", correct: "lived", explanation: "wish + past simple: lived." },
        { id: "e3q6", prompt: "If only it ___ (not / be) so cold outside.", correct: "weren't", explanation: "if only + past negative: weren't." },
        { id: "e3q7", prompt: "He wishes he ___ (have) a better job.", correct: "had", explanation: "wish + past simple: had." },
        { id: "e3q8", prompt: "I wish she ___ (stop) making that noise — it's driving me mad!", correct: "would stop", explanation: "wish + would for annoying habits." },
        { id: "e3q9", prompt: "If only I ___ (speak) Italian!", correct: "spoke", explanation: "if only + past simple: spoke." },
        { id: "e3q10", prompt: "She wishes she ___ (not / have to) work at weekends.", correct: "didn't have to", explanation: "wish + past simple negative: didn't have to." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Hardest) — wish + past simple vs wish + would",
      instructions: "Choose the correct form. Use past simple for states/facts, use 'would' for habits/actions you want to change.",
      questions: [
        { id: "e4q1", prompt: "My neighbour plays loud music every night. I want it to stop. I wish he ___.", options: ["would stop playing", "stopped playing"], correctIndex: 0, explanation: "Annoying habit → wish + would: would stop playing." },
        { id: "e4q2", prompt: "I'm not rich. I want to be rich. I wish I ___.", options: ["would be rich", "were rich"], correctIndex: 1, explanation: "State about yourself → wish + were (not would be)." },
        { id: "e4q3", prompt: "She never listens. I want her to listen. I wish she ___.", options: ["would listen", "listened"], correctIndex: 0, explanation: "Annoying behaviour → wish + would: would listen." },
        { id: "e4q4", prompt: "I can't swim. I want to be able to swim. I wish I ___.", options: ["would swim", "could swim"], correctIndex: 1, explanation: "Ability → wish + could." },
        { id: "e4q5", prompt: "He keeps interrupting. I want him to stop. I wish he ___.", options: ["would stop interrupting", "stopped interrupting"], correctIndex: 0, explanation: "Repeated annoying action → wish + would." },
        { id: "e4q6", prompt: "I don't live in Paris. I want to live there. I wish I ___.", options: ["would live in Paris", "lived in Paris"], correctIndex: 1, explanation: "State about where you live → wish + lived (past simple)." },
        { id: "e4q7", prompt: "My boss never says 'thank you'. I want him to. I wish my boss ___.", options: ["would say thank you", "said thank you"], correctIndex: 0, explanation: "Behaviour I want changed → wish + would." },
        { id: "e4q8", prompt: "I don't understand maths well. I wish I ___ maths better.", options: ["would understand", "understood"], correctIndex: 1, explanation: "Ability/state → wish + understood (past simple)." },
        { id: "e4q9", prompt: "They keep arguing. I want it to stop. I wish they ___.", options: ["would stop arguing", "stopped arguing"], correctIndex: 0, explanation: "Annoying repeated behaviour → wish + would." },
        { id: "e4q10", prompt: "I'm not taller. I want to be. I wish I ___ taller.", options: ["would be", "were"], correctIndex: 1, explanation: "Physical state → wish + were (not would be)." },
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
        <span className="text-slate-700 font-medium">Wish + Past Simple</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Wish +{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Past Simple</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>wish + past simple</b> to express regret about the present — things you want to be different: <i>I wish I <b>knew</b> the answer.</i> Use <b>wish + would</b> for habits or behaviour you want to change: <i>I wish he <b>would stop</b> talking.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-wish-past" subject="Wish + Past" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))} />
                                    <span className="text-slate-900 text-sm">{opt}</span>
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
          <SpeedRound gameId="grammar-b1-wish-past" subject="Wish + Past" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/phrasal-verbs" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Phrasal Verbs →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Wish + Past Simple (B1)</h2>
      <div className="not-prose mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <div className="text-xs font-bold uppercase text-violet-600 mb-2">wish + past simple — present regrets</div>
          <div className="text-sm text-slate-700 space-y-1 italic">
            <div>I wish I <b>knew</b> the answer. (I don&apos;t know)</div>
            <div>She wishes she <b>were</b> taller. (she isn&apos;t)</div>
            <div>I wish I <b>could</b> swim. (I can&apos;t)</div>
          </div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-2">wish + would — annoying habits</div>
          <div className="text-sm text-slate-700 space-y-1 italic">
            <div>I wish he <b>would stop</b> talking. (he keeps talking)</div>
            <div>I wish she <b>would listen</b>. (she never listens)</div>
            <div>I wish it <b>would stop</b> raining. (it&apos;s still raining)</div>
          </div>
        </div>
      </div>

      <h3>if only — same structure, stronger feeling</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-2 text-sm text-slate-700">
        <div className="italic">I wish I knew. = <b>If only I knew!</b> (more emphatic)</div>
        <div className="italic">I wish he would stop. = <b>If only he would stop!</b></div>
      </div>

      <h3>Common mistakes</h3>
      <div className="not-prose grid gap-2 text-sm">
        {[
          ["✗ I wish I am taller.", "✓ I wish I were/was taller."],
          ["✗ I wish I would be richer.", "✓ I wish I were richer. (state → past simple)"],
          ["✗ I wish she stops.", "✓ I wish she would stop. (habit)"],
          ["✗ I wish I can drive.", "✓ I wish I could drive. (ability)"],
        ].map(([wrong, right], i) => (
          <div key={i} className="grid grid-cols-2 gap-3 rounded-xl border border-black/10 bg-white p-3">
            <span className="text-red-600 italic">{wrong}</span>
            <span className="text-emerald-700 italic">{right}</span>
          </div>
        ))}
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Key rule:</span> After <b>wish</b>, use <b>past simple</b> (was/were, had, knew…) even though you&apos;re talking about the present. This is the same as the second conditional: the past tense signals that the situation is unreal.
        </div>
      </div>
    </div>
  );
}
