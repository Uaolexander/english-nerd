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

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Verb + -ing", href: "/grammar/a2/verb-ing", level: "A2", badge: "bg-emerald-600", reason: "Some verbs take -ing instead of to-infinitive" },
  { title: "Have to / Don't have to", href: "/grammar/a2/have-to", level: "A2", badge: "bg-emerald-600", reason: "Have to is followed by a bare infinitive" },
  { title: "Going to (Future Plans)", href: "/grammar/a2/going-to", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "I want ___ a coffee.", options: ["have", "having", "to have", "had"], answer: 2 },
  { q: "She decided ___ the job.", options: ["accept", "accepting", "to accept", "accepted"], answer: 2 },
  { q: "He hopes ___ a doctor.", options: ["become", "becoming", "to become", "became"], answer: 2 },
  { q: "They agreed ___ earlier.", options: ["meet", "meeting", "to meet", "met"], answer: 2 },
  { q: "She refused ___ me.", options: ["help", "helping", "to help", "helped"], answer: 2 },
  { q: "I managed ___ it on time.", options: ["finish", "finishing", "to finish", "finished"], answer: 2 },
  { q: "He promised ___ back soon.", options: ["come", "coming", "to come", "came"], answer: 2 },
  { q: "She plans ___ abroad.", options: ["study", "studying", "to study", "studied"], answer: 2 },
  { q: "I enjoy ___ chess.", options: ["play", "to play", "playing", "played"], answer: 2 },
  { q: "He finished ___ the report.", options: ["write", "to write", "writing", "written"], answer: 2 },
  { q: "Do you mind ___ the window?", options: ["close", "to close", "closing", "closed"], answer: 2 },
  { q: "She avoided ___ him.", options: ["meet", "to meet", "meeting", "met"], answer: 2 },
  { q: "They chose ___ by train.", options: ["travel", "travelling", "to travel", "travelled"], answer: 2 },
  { q: "I expect ___ there by 6.", options: ["be", "being", "to be", "been"], answer: 2 },
  { q: "He suggested ___ the early train.", options: ["take", "to take", "taking", "took"], answer: 2 },
  { q: "I look forward to ___ you.", options: ["see", "to see", "seeing", "seen"], answer: 2 },
  { q: "She kept ___ me.", options: ["interrupt", "to interrupt", "interrupting", "interrupted"], answer: 2 },
  { q: "I miss ___ near the sea.", options: ["live", "to live", "living", "lived"], answer: 2 },
  { q: "He'd like ___ a table.", options: ["book", "to book", "booking", "booked"], answer: 1 },
  { q: "We plan ___ in September.", options: ["travel", "travelled", "to travel", "travelling"], answer: 2 },
];

export default function VerbInfinitiveLessonClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the to-infinitive form",
      instructions: "Choose the correct form. These verbs always take to + infinitive.",
      questions: [
        { id: "e1q1", prompt: "I want ___ a coffee, please.", options: ["have", "having", "to have"], correctIndex: 2, explanation: "want + to-infinitive: I want to have a coffee." },
        { id: "e1q2", prompt: "She decided ___ the job.", options: ["accept", "accepting", "to accept"], correctIndex: 2, explanation: "decide + to-infinitive: She decided to accept." },
        { id: "e1q3", prompt: "He hopes ___ a doctor one day.", options: ["become", "becoming", "to become"], correctIndex: 2, explanation: "hope + to-infinitive: He hopes to become a doctor." },
        { id: "e1q4", prompt: "They agreed ___ earlier.", options: ["meet", "meeting", "to meet"], correctIndex: 2, explanation: "agree + to-infinitive: They agreed to meet earlier." },
        { id: "e1q5", prompt: "She refused ___ me.", options: ["help", "helping", "to help"], correctIndex: 2, explanation: "refuse + to-infinitive: She refused to help." },
        { id: "e1q6", prompt: "I managed ___ it on time.", options: ["finish", "finishing", "to finish"], correctIndex: 2, explanation: "manage + to-infinitive: I managed to finish it." },
        { id: "e1q7", prompt: "He promised ___ back soon.", options: ["come", "coming", "to come"], correctIndex: 2, explanation: "promise + to-infinitive: He promised to come back." },
        { id: "e1q8", prompt: "She plans ___ abroad next year.", options: ["study", "studying", "to study"], correctIndex: 2, explanation: "plan + to-infinitive: She plans to study abroad." },
        { id: "e1q9", prompt: "They chose ___ by train.", options: ["travel", "travelling", "to travel"], correctIndex: 2, explanation: "choose + to-infinitive: They chose to travel by train." },
        { id: "e1q10", prompt: "I expect ___ there by 6pm.", options: ["be", "being", "to be"], correctIndex: 2, explanation: "expect + to-infinitive: I expect to be there by 6pm." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the to-infinitive form",
      instructions: "Write the to-infinitive form of the verb in brackets.",
      questions: [
        { id: "e2q1", prompt: "She wants (go) ___ to Paris.", correct: "to go", explanation: "want + to go" },
        { id: "e2q2", prompt: "He decided (sell) ___ his car.", correct: "to sell", explanation: "decide + to sell" },
        { id: "e2q3", prompt: "I hope (pass) ___ the exam.", correct: "to pass", explanation: "hope + to pass" },
        { id: "e2q4", prompt: "They agreed (split) ___ the bill.", correct: "to split", explanation: "agree + to split" },
        { id: "e2q5", prompt: "She refused (answer) ___ the question.", correct: "to answer", explanation: "refuse + to answer" },
        { id: "e2q6", prompt: "He managed (open) ___ the stuck window.", correct: "to open", explanation: "manage + to open" },
        { id: "e2q7", prompt: "I promised (be) ___ on time.", correct: "to be", explanation: "promise + to be" },
        { id: "e2q8", prompt: "She plans (visit) ___ her parents next month.", correct: "to visit", explanation: "plan + to visit" },
        { id: "e2q9", prompt: "He chose (stay) ___ at home.", correct: "to stay", explanation: "choose + to stay" },
        { id: "e2q10", prompt: "I expect (hear) ___ from them soon.", correct: "to hear", explanation: "expect + to hear" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — -ing or to-infinitive?",
      instructions: "Choose the correct form. Some verbs take -ing, some take to-infinitive.",
      questions: [
        { id: "e3q1", prompt: "I enjoy ___ chess in the evenings.", options: ["play", "to play", "playing"], correctIndex: 2, explanation: "enjoy → always -ing: I enjoy playing chess." },
        { id: "e3q2", prompt: "She wants ___ a new laptop.", options: ["buy", "to buy", "buying"], correctIndex: 1, explanation: "want → always to-infinitive: She wants to buy." },
        { id: "e3q3", prompt: "He finished ___ the report at midnight.", options: ["write", "to write", "writing"], correctIndex: 2, explanation: "finish → always -ing: He finished writing." },
        { id: "e3q4", prompt: "They decided ___ a different route.", options: ["take", "to take", "taking"], correctIndex: 1, explanation: "decide → always to-infinitive: They decided to take." },
        { id: "e3q5", prompt: "I'd like ___ a table for two.", options: ["book", "to book", "booking"], correctIndex: 1, explanation: "would like → always to-infinitive: I'd like to book." },
        { id: "e3q6", prompt: "Do you mind ___ the window?", options: ["close", "to close", "closing"], correctIndex: 2, explanation: "mind → always -ing: Do you mind closing?" },
        { id: "e3q7", prompt: "He hopes ___ into a good university.", options: ["get", "to get", "getting"], correctIndex: 1, explanation: "hope → always to-infinitive: He hopes to get in." },
        { id: "e3q8", prompt: "She avoided ___ him at the party.", options: ["meet", "to meet", "meeting"], correctIndex: 2, explanation: "avoid → always -ing: She avoided meeting him." },
        { id: "e3q9", prompt: "I promised ___ back by 10pm.", options: ["come", "to come", "coming"], correctIndex: 1, explanation: "promise → always to-infinitive: I promised to come." },
        { id: "e3q10", prompt: "He suggested ___ the earlier train.", options: ["take", "to take", "taking"], correctIndex: 2, explanation: "suggest → always -ing: He suggested taking." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write -ing or to-infinitive",
      instructions: "Write the correct form of the verb in brackets. Think carefully about which pattern each verb follows.",
      questions: [
        { id: "e4q1", prompt: "She agreed (help) ___ us move house.", correct: "to help", explanation: "agree + to-infinitive" },
        { id: "e4q2", prompt: "He kept (interrupt) ___ me while I was speaking.", correct: "interrupting", explanation: "keep + -ing" },
        { id: "e4q3", prompt: "I expect (finish) ___ the project by Friday.", correct: "to finish", explanation: "expect + to-infinitive" },
        { id: "e4q4", prompt: "She avoided (answer) ___ my question.", correct: "answering", explanation: "avoid + -ing" },
        { id: "e4q5", prompt: "He managed (find) ___ a parking space.", correct: "to find", explanation: "manage + to-infinitive" },
        { id: "e4q6", prompt: "I look forward to (see) ___ you next week.", correct: "seeing", explanation: "look forward to + -ing (to is a preposition here)" },
        { id: "e4q7", prompt: "She refused (sign) ___ the contract.", correct: "to sign", explanation: "refuse + to-infinitive" },
        { id: "e4q8", prompt: "He suggested (order) ___ food online.", correct: "ordering", explanation: "suggest + -ing" },
        { id: "e4q9", prompt: "We plan (travel) ___ in September.", correct: "to travel", explanation: "plan + to-infinitive" },
        { id: "e4q10", prompt: "I miss (live) ___ near the sea.", correct: "living", explanation: "miss + -ing" },
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
        title: "Verb + to-Infinitive",
        subtitle: "want, decide, hope, agree, refuse… — 4 exercises + answer key",
        level: "A2",
        keyRule: "These verbs are always followed by to + base verb: want, decide, hope, agree, refuse, manage, promise, plan, choose, expect.",
        exercises: [
          {
            number: 1,
            title: "Exercise 1",
            difficulty: "Easy",
            instruction: "Choose: base verb / -ing / to-infinitive.",
            questions: [
              "I want ___ a coffee, please. (have / having / to have)",
              "She decided ___ the job. (accept / accepting / to accept)",
              "He hopes ___ a doctor one day. (become / becoming / to become)",
              "They agreed ___ earlier. (meet / meeting / to meet)",
              "She refused ___ me. (help / helping / to help)",
              "I managed ___ it on time. (finish / finishing / to finish)",
              "He promised ___ back soon. (come / coming / to come)",
              "She plans ___ abroad next year. (study / studying / to study)",
              "They chose ___ by train. (travel / travelling / to travel)",
              "I expect ___ there by 6pm. (be / being / to be)",
            ],
            hint: "to have / to accept / to become / to meet / to help / to finish / to come / to study / to travel / to be",
          },
          {
            number: 2,
            title: "Exercise 2",
            difficulty: "Medium",
            instruction: "Write the to-infinitive form of the verb in brackets.",
            questions: [
              "She wants (go) ___ to Paris.",
              "He decided (sell) ___ his car.",
              "I hope (pass) ___ the exam.",
              "They agreed (split) ___ the bill.",
              "She refused (answer) ___ the question.",
              "He managed (open) ___ the stuck window.",
              "I promised (be) ___ on time.",
              "She plans (visit) ___ her parents next month.",
              "He chose (stay) ___ at home.",
              "I expect (hear) ___ from them soon.",
            ],
          },
          {
            number: 3,
            title: "Exercise 3",
            difficulty: "Hard",
            instruction: "Choose the correct form: -ing or to-infinitive.",
            questions: [
              "I enjoy ___ chess in the evenings. (play / to play / playing)",
              "She wants ___ a new laptop. (buy / to buy / buying)",
              "He finished ___ the report at midnight. (write / to write / writing)",
              "They decided ___ a different route. (take / to take / taking)",
              "I'd like ___ a table for two. (book / to book / booking)",
              "Do you mind ___ the window? (close / to close / closing)",
              "He hopes ___ into a good university. (get / to get / getting)",
              "She avoided ___ him at the party. (meet / to meet / meeting)",
              "I promised ___ back by 10pm. (come / to come / coming)",
              "He suggested ___ the earlier train. (take / to take / taking)",
            ],
            hint: "playing / to buy / writing / to take / to book / closing / to get / meeting / to come / taking",
          },
          {
            number: 4,
            title: "Exercise 4",
            difficulty: "Harder",
            instruction: "Write the correct form of the verb in brackets.",
            questions: [
              "She agreed (help) ___ us move house.",
              "He kept (interrupt) ___ me while I was speaking.",
              "I expect (finish) ___ the project by Friday.",
              "She avoided (answer) ___ my question.",
              "He managed (find) ___ a parking space.",
              "I look forward to (see) ___ you next week.",
              "She refused (sign) ___ the contract.",
              "He suggested (order) ___ food online.",
              "We plan (travel) ___ in September.",
              "I miss (live) ___ near the sea.",
            ],
          },
        ],
        answerKey: [
          {
            exercise: 1,
            subtitle: "Easy — to-infinitive form",
            answers: ["to have", "to accept", "to become", "to meet", "to help", "to finish", "to come", "to study", "to travel", "to be"],
          },
          {
            exercise: 2,
            subtitle: "Medium — write the to-infinitive",
            answers: ["to go", "to sell", "to pass", "to split", "to answer", "to open", "to be", "to visit", "to stay", "to hear"],
          },
          {
            exercise: 3,
            subtitle: "Hard — -ing or to-infinitive",
            answers: ["playing", "to buy", "writing", "to take", "to book", "closing", "to get", "meeting", "to come", "taking"],
          },
          {
            exercise: 4,
            subtitle: "Harder — correct form",
            answers: ["to help", "interrupting", "to finish", "answering", "to find", "seeing", "to sign", "ordering", "to travel", "living"],
          },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Verb + to-Infinitive</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Verb +{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">to-infinitive</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Some verbs are always followed by <b>to + base verb</b> (to-infinitive): <i>want, decide, hope, agree, refuse, manage, promise, plan, choose, expect</i>. Exercise 3 contrasts these with verbs that take <b>-ing</b>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a2-verb-infinitive" subject="Verb + to-Infinitive" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/a2" allLabel="All A2 topics" />
        ) : (
          <AdUnit variant="sidebar-light" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-verb-infinitive" subject="Verb + to-Infinitive" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/conjunctions" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Conjunctions →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Verb + to-Infinitive (A2)</h2>
      <p>Some verbs are <b>always followed by to + base verb</b> (to-infinitive). You cannot use -ing after them.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Verbs that take to-infinitive</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { verb: "want", ex: "I want to go home." },
            { verb: "decide", ex: "She decided to stay." },
            { verb: "hope", ex: "He hopes to pass." },
            { verb: "agree", ex: "They agreed to help." },
            { verb: "refuse", ex: "She refused to answer." },
            { verb: "manage", ex: "He managed to fix it." },
            { verb: "promise", ex: "I promised to call." },
            { verb: "plan", ex: "She plans to visit." },
            { verb: "choose", ex: "He chose to leave." },
            { verb: "expect", ex: "I expect to finish soon." },
            { verb: "offer", ex: "She offered to help." },
            { verb: "would like", ex: "I'd like to book a table." },
          ].map(({ verb, ex }) => (
            <div key={verb} className="flex items-center gap-3 rounded-xl border border-black/10 bg-slate-50 px-4 py-2">
              <span className="font-black text-sky-700 min-w-[90px]">{verb}</span>
              <span className="text-sm italic text-slate-600">{ex}</span>
            </div>
          ))}
        </div>
      </div>

      <h3>To-infinitive vs -ing: quick reference</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-sky-600 mb-3">Verbs + to-infinitive</div>
          <div className="space-y-1 text-sm text-slate-700">
            {["want", "decide", "hope", "agree", "refuse", "manage", "promise", "plan", "choose", "expect"].map(v => (
              <span key={v} className="inline-block mr-2 font-semibold">{v}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-emerald-600 mb-3">Verbs + -ing</div>
          <div className="space-y-1 text-sm text-slate-700">
            {["enjoy", "finish", "avoid", "mind", "miss", "keep", "suggest", "stop"].map(v => (
              <span key={v} className="inline-block mr-2 font-semibold">{v}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Memory trick:</span> Verbs about <b>future decisions / plans</b> tend to take to-infinitive (<i>want to, decide to, plan to, hope to</i>). Verbs about <b>ongoing actions or feelings</b> tend to take -ing (<i>enjoy doing, keep doing, miss doing</i>).
        </div>
      </div>
    </div>
  );
}
