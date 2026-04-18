"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";
import { useLiveSync } from "@/lib/useLiveSync";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Verb + Infinitive", href: "/grammar/a2/verb-infinitive", level: "A2", badge: "bg-emerald-600", reason: "Compare verbs that take -ing vs to-infinitive" },
  { title: "Present Continuous", href: "/grammar/a2/present-continuous", level: "A2", badge: "bg-emerald-600", reason: "Present continuous also uses the -ing form" },
  { title: "Adverbs of Manner", href: "/grammar/a2/adverbs-manner", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "I enjoy ___ in the park.", options: ["walk", "to walk", "walking", "walked"], answer: 2 },
  { q: "She hates ___ up early.", options: ["get", "to get", "getting", "got"], answer: 2 },
  { q: "They finished ___ the project.", options: ["complete", "to complete", "completing", "completed"], answer: 2 },
  { q: "He avoided ___ the topic.", options: ["mention", "to mention", "mentioning", "mentioned"], answer: 2 },
  { q: "Do you mind ___ the window?", options: ["open", "to open", "opening", "opened"], answer: 2 },
  { q: "She kept ___ despite the noise.", options: ["study", "to study", "studying", "studied"], answer: 2 },
  { q: "I miss ___ my family.", options: ["see", "to see", "seeing", "saw"], answer: 2 },
  { q: "He stopped ___.", options: ["smoke", "to smoke", "smoking", "smoked"], answer: 2 },
  { q: "She suggested ___ a walk.", options: ["take", "to take", "taking", "took"], answer: 2 },
  { q: "I look forward to ___ you.", options: ["see", "to see", "seeing", "seen"], answer: 2 },
  { q: "___ is great for your health.", options: ["Swim", "Swimming", "To swim", "Swam"], answer: 1 },
  { q: "She is good at ___.", options: ["dance", "dancing", "to dance", "danced"], answer: 1 },
  { q: "Thank you for ___!", options: ["help", "to help", "helping", "helped"], answer: 2 },
  { q: "swim → ___", options: ["swiming", "swimimg", "swimming", "swimiming"], answer: 2 },
  { q: "make → ___", options: ["makeing", "makking", "making", "makin"], answer: 2 },
  { q: "run → ___", options: ["runing", "running", "runeing", "runinge"], answer: 1 },
  { q: "lie → ___", options: ["lieing", "lying", "liying", "lie-ing"], answer: 1 },
  { q: "I'm thinking about ___ a new car.", options: ["buy", "to buy", "buying", "bought"], answer: 2 },
  { q: "Instead of ___, why not call?", options: ["write", "writing", "to write", "wrote"], answer: 1 },
  { q: "He is interested in ___ abroad.", options: ["work", "to work", "working", "worked"], answer: 2 },
];

export default function VerbIngLessonClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
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

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the -ing form",
      instructions: "Choose the correct form after each verb. These verbs always take -ing.",
      questions: [
        { id: "e1q1", prompt: "I enjoy ___ in the park on Sundays.", options: ["walk", "to walk", "walking"], correctIndex: 2, explanation: "enjoy + -ing: I enjoy walking." },
        { id: "e1q2", prompt: "She hates ___ up early.", options: ["get", "to get", "getting"], correctIndex: 2, explanation: "hate + -ing: She hates getting up." },
        { id: "e1q3", prompt: "They finished ___ the project.", options: ["complete", "to complete", "completing"], correctIndex: 2, explanation: "finish + -ing: They finished completing the project." },
        { id: "e1q4", prompt: "He avoided ___ the difficult subject.", options: ["mention", "to mention", "mentioning"], correctIndex: 2, explanation: "avoid + -ing: He avoided mentioning it." },
        { id: "e1q5", prompt: "Do you mind ___ the window?", options: ["open", "to open", "opening"], correctIndex: 2, explanation: "mind + -ing: Do you mind opening the window?" },
        { id: "e1q6", prompt: "She kept ___ despite all the noise.", options: ["study", "to study", "studying"], correctIndex: 2, explanation: "keep + -ing: She kept studying." },
        { id: "e1q7", prompt: "I miss ___ my family.", options: ["see", "to see", "seeing"], correctIndex: 2, explanation: "miss + -ing: I miss seeing my family." },
        { id: "e1q8", prompt: "He stopped ___.", options: ["smoke", "to smoke", "smoking"], correctIndex: 2, explanation: "stop + -ing = he no longer does it: He stopped smoking." },
        { id: "e1q9", prompt: "She suggested ___ a walk.", options: ["take", "to take", "taking"], correctIndex: 2, explanation: "suggest + -ing: She suggested taking a walk." },
        { id: "e1q10", prompt: "I look forward to ___ you again.", options: ["see", "to see", "seeing"], correctIndex: 2, explanation: "'look forward to' + -ing (to here is a preposition, not an infinitive marker)" },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct -ing form",
      instructions: "Write the -ing form of the verb in brackets. Watch the spelling!",
      questions: [
        { id: "e2q1", prompt: "She enjoys (swim) ___ in the sea.", correct: "swimming", explanation: "swim → swimming (double m: short vowel + single consonant)" },
        { id: "e2q2", prompt: "He finished (write) ___ the report.", correct: "writing", explanation: "write → writing (drop the silent e)" },
        { id: "e2q3", prompt: "I don't mind (wait) ___ a few minutes.", correct: "waiting", explanation: "wait → waiting (add -ing)" },
        { id: "e2q4", prompt: "She avoided (make) ___ eye contact.", correct: "making", explanation: "make → making (drop the silent e)" },
        { id: "e2q5", prompt: "They kept (argue) ___ about nothing.", correct: "arguing", explanation: "argue → arguing (drop the e)" },
        { id: "e2q6", prompt: "He misses (live) ___ near the city.", correct: "living", explanation: "live → living (drop the e)" },
        { id: "e2q7", prompt: "I can't help (laugh) ___ at his jokes.", correct: "laughing", explanation: "laugh → laughing (add -ing)" },
        { id: "e2q8", prompt: "She stopped (run) ___ and caught her breath.", correct: "running", explanation: "run → running (double n: short vowel + single consonant)" },
        { id: "e2q9", prompt: "Do you enjoy (cook) ___ Italian food?", correct: "cooking", explanation: "cook → cooking (add -ing)" },
        { id: "e2q10", prompt: "I look forward to (hear) ___ from you.", correct: "hearing", explanation: "hear → hearing (add -ing)" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — -ing after prepositions and as subject",
      instructions: "Choose the correct form. Pay attention to prepositions and sentence subjects.",
      questions: [
        { id: "e3q1", prompt: "___ is great for your health.", options: ["Swim", "Swimming", "To swim"], correctIndex: 1, explanation: "-ing as subject of sentence (gerund): Swimming is great for your health." },
        { id: "e3q2", prompt: "___ a foreign language takes time and patience.", options: ["Learn", "To learn", "Learning"], correctIndex: 2, explanation: "Gerund as subject: Learning a foreign language…" },
        { id: "e3q3", prompt: "She is good at ___.", options: ["dance", "dancing", "to dance"], correctIndex: 1, explanation: "After prepositions (at, in, of, for, about…) use -ing: good at dancing." },
        { id: "e3q4", prompt: "He is interested in ___ abroad.", options: ["work", "to work", "working"], correctIndex: 2, explanation: "After preposition 'in' → -ing: interested in working." },
        { id: "e3q5", prompt: "What about ___ for a walk?", options: ["go", "to go", "going"], correctIndex: 2, explanation: "After 'about' (preposition) → -ing: What about going?" },
        { id: "e3q6", prompt: "Thank you for ___!", options: ["help", "to help", "helping"], correctIndex: 2, explanation: "After preposition 'for' → -ing: Thank you for helping!" },
        { id: "e3q7", prompt: "Instead of ___, why don't you call her?", options: ["write", "writing", "to write"], correctIndex: 1, explanation: "After preposition 'instead of' → -ing: Instead of writing." },
        { id: "e3q8", prompt: "I'm thinking about ___ a new car.", options: ["buy", "to buy", "buying"], correctIndex: 2, explanation: "After preposition 'about' → -ing: thinking about buying." },
        { id: "e3q9", prompt: "___ is my favourite hobby.", options: ["Cook", "To cook", "Cooking"], correctIndex: 2, explanation: "Gerund as subject: Cooking is my favourite hobby." },
        { id: "e3q10", prompt: "He's not very good at ___ decisions quickly.", options: ["make", "making", "to make"], correctIndex: 1, explanation: "After preposition 'at' → -ing: good at making decisions." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the correct -ing form (spelling rules!)",
      instructions: "Write the -ing form of the verb in brackets. Be careful with spelling.",
      questions: [
        { id: "e4q1", prompt: "She is (sit) ___ by the window.", correct: "sitting", explanation: "sit → sitting (double t: short vowel + single consonant)" },
        { id: "e4q2", prompt: "I am (run) ___ late — wait for me!", correct: "running", explanation: "run → running (double n)" },
        { id: "e4q3", prompt: "He stopped (make) ___ excuses.", correct: "making", explanation: "make → making (drop e)" },
        { id: "e4q4", prompt: "They kept (swim) ___ for an hour.", correct: "swimming", explanation: "swim → swimming (double m)" },
        { id: "e4q5", prompt: "She's (lie) ___ on the sofa.", correct: "lying", explanation: "lie → lying (ie → y)" },
        { id: "e4q6", prompt: "I'm (plan) ___ a surprise party.", correct: "planning", explanation: "plan → planning (double n: short vowel + single consonant)" },
        { id: "e4q7", prompt: "He began (write) ___ the email.", correct: "writing", explanation: "write → writing (drop e)" },
        { id: "e4q8", prompt: "Are you (travel) ___ alone?", correct: "travelling", explanation: "travel → travelling (British English doubles l before -ing)" },
        { id: "e4q9", prompt: "She started (forget) ___ things.", correct: "forgetting", explanation: "forget → forgetting (double t: stressed short vowel + single consonant)" },
        { id: "e4q10", prompt: "I avoid (get) ___ up before 7.", correct: "getting", explanation: "get → getting (double t: short vowel + single consonant)" },
      ],
    },
  }), []);

  const current = sets[exNo];

  const { save } = useProgress();

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

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Verb + -ing",
        subtitle: "enjoy, finish, avoid, mind… + spelling rules — 4 exercises + answer key",
        level: "A2",
        keyRule: "These verbs take -ing: enjoy, finish, avoid, mind, miss, keep, suggest, stop. Also use -ing after prepositions and as a sentence subject.",
        exercises: [
          {
            number: 1,
            title: "Exercise 1",
            difficulty: "Easy",
            instruction: "Choose the correct -ing form after each verb.",
            questions: [
              "I enjoy ___ in the park on Sundays. (walk / to walk / walking)",
              "She hates ___ up early. (get / to get / getting)",
              "They finished ___ the project. (complete / to complete / completing)",
              "He avoided ___ the difficult subject. (mention / to mention / mentioning)",
              "Do you mind ___ the window? (open / to open / opening)",
              "She kept ___ despite all the noise. (study / to study / studying)",
              "I miss ___ my family. (see / to see / seeing)",
              "He stopped ___. (smoke / to smoke / smoking)",
              "She suggested ___ a walk. (take / to take / taking)",
              "I look forward to ___ you again. (see / to see / seeing)",
            ],
            hint: "walking / getting / completing / mentioning / opening / studying / seeing / smoking / taking / seeing",
          },
          {
            number: 2,
            title: "Exercise 2",
            difficulty: "Medium",
            instruction: "Write the correct -ing form of the verb in brackets.",
            questions: [
              "She enjoys (swim) ___ in the sea.",
              "He finished (write) ___ the report.",
              "I don't mind (wait) ___ a few minutes.",
              "She avoided (make) ___ eye contact.",
              "They kept (argue) ___ about nothing.",
              "He misses (live) ___ near the city.",
              "I can't help (laugh) ___ at his jokes.",
              "She stopped (run) ___ and caught her breath.",
              "Do you enjoy (cook) ___ Italian food?",
              "I look forward to (hear) ___ from you.",
            ],
          },
          {
            number: 3,
            title: "Exercise 3",
            difficulty: "Hard",
            instruction: "Choose the correct form. Think about prepositions and gerund subjects.",
            questions: [
              "___ is great for your health. (Swim / Swimming / To swim)",
              "___ a foreign language takes time. (Learn / To learn / Learning)",
              "She is good at ___. (dance / dancing / to dance)",
              "He is interested in ___ abroad. (work / to work / working)",
              "What about ___ for a walk? (go / to go / going)",
              "Thank you for ___! (help / to help / helping)",
              "Instead of ___, why don't you call? (write / writing / to write)",
              "I'm thinking about ___ a new car. (buy / to buy / buying)",
              "___ is my favourite hobby. (Cook / To cook / Cooking)",
              "He's not very good at ___ decisions. (make / making / to make)",
            ],
            hint: "Swimming / Learning / dancing / working / going / helping / writing / buying / Cooking / making",
          },
          {
            number: 4,
            title: "Exercise 4",
            difficulty: "Harder",
            instruction: "Write the -ing form of the verb in brackets. Watch the spelling!",
            questions: [
              "She is (sit) ___ by the window.",
              "I am (run) ___ late — wait for me!",
              "He stopped (make) ___ excuses.",
              "They kept (swim) ___ for an hour.",
              "She's (lie) ___ on the sofa.",
              "I'm (plan) ___ a surprise party.",
              "He began (write) ___ the email.",
              "Are you (travel) ___ alone?",
              "She started (forget) ___ things.",
              "I avoid (get) ___ up before 7.",
            ],
          },
        ],
        answerKey: [
          {
            exercise: 1,
            subtitle: "Easy — choose the -ing form",
            answers: ["walking", "getting", "completing", "mentioning", "opening", "studying", "seeing", "smoking", "taking", "seeing"],
          },
          {
            exercise: 2,
            subtitle: "Medium — write the -ing form",
            answers: ["swimming", "writing", "waiting", "making", "arguing", "living", "laughing", "running", "cooking", "hearing"],
          },
          {
            exercise: 3,
            subtitle: "Hard — prepositions and gerund subjects",
            answers: ["Swimming", "Learning", "dancing", "working", "going", "helping", "writing", "buying", "Cooking", "making"],
          },
          {
            exercise: 4,
            subtitle: "Harder — spelling rules",
            answers: ["sitting", "running", "making", "swimming", "lying", "planning", "writing", "travelling", "forgetting", "getting"],
          },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo }); }
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo: n }); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Verb + -ing</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Verb +{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">-ing</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Some verbs are always followed by the <b>-ing form</b>: <i>enjoy, finish, avoid, mind, miss, keep, suggest, stop</i>. The -ing form is also used after <b>prepositions</b> and as the <b>subject</b> of a sentence.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a2-verb-ing" subject="Verb + -ing" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className=""><AdUnit variant="sidebar-dark" /></div>
        )}

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>

            <PDFButton onDownload={downloadPDF} loading={pdfLoading} />

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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/a2" allLabel="All A2 topics" />
        ) : (
          <AdUnit variant="sidebar-light" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-verb-ing" subject="Verb + -ing" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/verb-infinitive" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Verb + to-Infinitive →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Verb + -ing (A2)</h2>
      <p>Some verbs are <b>always followed by the -ing form</b>. You cannot use <i>to + infinitive</i> after them.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Verbs that take -ing</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { verb: "enjoy", ex: "I enjoy reading." },
            { verb: "finish", ex: "She finished eating." },
            { verb: "avoid", ex: "He avoids making mistakes." },
            { verb: "mind", ex: "Do you mind waiting?" },
            { verb: "miss", ex: "I miss living there." },
            { verb: "keep", ex: "She kept talking." },
            { verb: "suggest", ex: "He suggested leaving." },
            { verb: "stop", ex: "I stopped smoking." },
            { verb: "can't help", ex: "I can't help laughing." },
            { verb: "look forward to", ex: "I look forward to seeing you." },
          ].map(({ verb, ex }) => (
            <div key={verb} className="flex items-center gap-3 rounded-xl border border-black/10 bg-slate-50 px-4 py-2">
              <span className="font-black text-sky-700 min-w-[110px]">{verb}</span>
              <span className="text-sm italic text-slate-600">{ex}</span>
            </div>
          ))}
        </div>
      </div>

      <h3>-ing after prepositions</h3>
      <p>After <b>any preposition</b> (at, in, of, for, about, without, before, after, instead of…), always use <b>-ing</b>:</p>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-2 text-sm text-slate-700">
        <div>She&apos;s good <b>at</b> <b>dancing</b>.</div>
        <div>He&apos;s interested <b>in</b> <b>learning</b> Spanish.</div>
        <div>Thank you <b>for</b> <b>helping</b>!</div>
        <div><b>Before</b> <b>going</b> out, check the weather.</div>
        <div>Instead <b>of</b> <b>calling</b>, send a message.</div>
      </div>

      <h3>-ing as the subject of a sentence (gerund)</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-2 text-sm text-slate-700">
        <div><b>Swimming</b> is great for your health.</div>
        <div><b>Learning</b> a language takes time.</div>
        <div><b>Cooking</b> is my favourite hobby.</div>
      </div>

      <h3>Spelling rules for -ing</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-bold text-slate-700">Rule</th>
                <th className="text-left py-2 pr-4 font-bold text-slate-700">Example</th>
                <th className="text-left py-2 font-bold text-slate-700">-ing form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Most verbs: just add -ing", "read, play, go", "reading, playing, going"],
                ["Ending in silent -e: drop e, add -ing", "make, write, live", "making, writing, living"],
                ["Short vowel + single consonant: double it", "run, sit, swim, get", "running, sitting, swimming, getting"],
                ["Ending in -ie: change to -y + ing", "lie, die, tie", "lying, dying, tying"],
              ].map(([rule, ex, ing]) => (
                <tr key={rule}>
                  <td className="py-2 pr-4 text-slate-700">{rule}</td>
                  <td className="py-2 pr-4 italic text-slate-600">{ex}</td>
                  <td className="py-2 font-semibold text-sky-700">{ing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Tip:</span> <b>look forward to</b> + -ing is a very common mistake. The <i>to</i> here is a <b>preposition</b>, not an infinitive marker — so use -ing: <i>&ldquo;I look forward to <b>seeing</b> you&rdquo;</i>, NOT <i>&ldquo;I look forward to see you&rdquo;</i>.
        </div>
      </div>
    </div>
  );
}
