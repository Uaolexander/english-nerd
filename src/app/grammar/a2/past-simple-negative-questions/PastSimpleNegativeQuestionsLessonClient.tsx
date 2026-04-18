"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import PDFButton from "@/components/PDFButton";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";
import { useLiveSync } from "@/lib/useLiveSync";

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type InputQ = {
  id: string;
  prompt: string;
  correct: string;
  explanation: string;
};

type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/['']/g, "'");
}

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Past Simple (Regular)", href: "/grammar/a2/past-simple-regular", level: "A2", badge: "bg-emerald-600", reason: "Master the regular verb forms used in these questions" },
  { title: "Past Simple (Irregular)", href: "/grammar/a2/past-simple-irregular", level: "A2", badge: "bg-emerald-600", reason: "Practice irregular verbs in negative and question forms" },
  { title: "Time Expressions (Past)", href: "/grammar/a2/time-expressions-past", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "She ___ go to the party. (negative)", options: ["didn't went", "didn't go", "doesn't go", "don't go"], answer: 1 },
  { q: "___ you see the film? (question)", options: ["Do", "Does", "Did", "Was"], answer: 2 },
  { q: "They ___ enjoy the meal. (negative)", options: ["don't", "didn't enjoyed", "didn't enjoy", "doesn't"], answer: 2 },
  { q: "___ he call you? (question)", options: ["Does", "Did", "Was", "Do"], answer: 1 },
  { q: "Short answer: Yes, I ___ (to 'Did you see it?')", options: ["do", "did", "was", "seen"], answer: 1 },
  { q: "I ___ finish on time. (negative)", options: ["didn't finished", "didn't finish", "don't finish", "doesn't finish"], answer: 1 },
  { q: "Where ___ you go? (past question)", options: ["do", "does", "were", "did"], answer: 3 },
  { q: "He ___ know the answer. (negative)", options: ["didn't knew", "doesn't know", "didn't know", "don't knew"], answer: 2 },
  { q: "Short answer: No, she ___.", options: ["don't", "didn't", "wasn't", "doesn't"], answer: 1 },
  { q: "What ___ she say? (past question)", options: ["does", "did", "was", "do"], answer: 1 },
  { q: "We ___ sleep well. (negative)", options: ["didn't slept", "didn't sleep", "don't sleep", "doesn't sleep"], answer: 1 },
  { q: "___ they arrive on time? (question)", options: ["Do", "Does", "Have", "Did"], answer: 3 },
  { q: "Why ___ she come? (negative question)", options: ["doesn't", "wasn't", "didn't", "don't"], answer: 2 },
  { q: "How much ___ you pay? (past)", options: ["do", "does", "did", "have"], answer: 2 },
  { q: "I ___ expect to see you! (negative)", options: ["didn't expected", "didn't expect", "don't expected", "doesn't expect"], answer: 1 },
  { q: "Who ___ you talk to? (past)", options: ["do", "does", "have", "did"], answer: 3 },
  { q: "___ she work here before? (question)", options: ["Does", "Was", "Have", "Did"], answer: 3 },
  { q: "He ___ realise how late it was. (negative)", options: ["didn't realised", "didn't realize", "didn't realizing", "doesn't realise"], answer: 1 },
  { q: "A: Did they call? B: Yes, they ___.", options: ["called", "do", "did", "have"], answer: 2 },
  { q: "___ the lesson start at 9? (past question)", options: ["Do", "Does", "Was", "Did"], answer: 3 },
];

export default function PastSimpleNegativeQuestionsLessonClient() {
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

    // ── Exercise 1 ── MCQ: negatives and questions (basic recognition)
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct form",
      instructions: "Choose the correct negative or question form for each sentence.",
      questions: [
        {
          id: "e1q1",
          prompt: "She ___ go to school yesterday. (negative)",
          options: ["didn't went", "didn't go", "doesn't go"],
          correctIndex: 1,
          explanation: "Negative: didn't + base form. 'Didn't went' is wrong — after didn't always use the base form.",
        },
        {
          id: "e1q2",
          prompt: "___ you see that film last night? (question)",
          options: ["Did", "Does", "Were"],
          correctIndex: 0,
          explanation: "Questions in past simple use Did + subject + base form.",
        },
        {
          id: "e1q3",
          prompt: "They ___ enjoy the party. (negative)",
          options: ["don't", "didn't enjoyed", "didn't enjoy"],
          correctIndex: 2,
          explanation: "Negative: didn't + base form → didn't enjoy.",
        },
        {
          id: "e1q4",
          prompt: "___ he call you this morning? (question)",
          options: ["Does", "Did", "Was"],
          correctIndex: 1,
          explanation: "Past simple question: Did + subject + base form.",
        },
        {
          id: "e1q5",
          prompt: "I ___ finish my homework last night. (negative)",
          options: ["didn't finished", "didn't finish", "don't finish"],
          correctIndex: 1,
          explanation: "didn't + base form. Never add -ed after didn't.",
        },
        {
          id: "e1q6",
          prompt: "___ they arrive on time? (question)",
          options: ["Did", "Do", "Have"],
          correctIndex: 0,
          explanation: "Did + subject + base form for all past simple questions.",
        },
        {
          id: "e1q7",
          prompt: "He ___ know the answer. (negative)",
          options: ["didn't knew", "doesn't know", "didn't know"],
          correctIndex: 2,
          explanation: "didn't + base form → didn't know. 'Knew' is already past, so don't use it after didn't.",
        },
        {
          id: "e1q8",
          prompt: "___ she work here before? (question)",
          options: ["Does", "Was", "Did"],
          correctIndex: 2,
          explanation: "Did + subject + base form.",
        },
        {
          id: "e1q9",
          prompt: "We ___ sleep well last night. (negative)",
          options: ["didn't slept", "didn't sleep", "don't sleep"],
          correctIndex: 1,
          explanation: "didn't + base form → didn't sleep.",
        },
        {
          id: "e1q10",
          prompt: "Yes, I ___. (short answer to 'Did you enjoy it?')",
          options: ["did", "do", "enjoyed"],
          correctIndex: 0,
          explanation: "Short answer: Yes, I did. / No, I didn't. Don't repeat the full verb.",
        },
      ],
    },

    // ── Exercise 2 ── Input: write the negative or question form
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the negative or question form",
      instructions: "Rewrite each sentence as a negative or question as indicated. Write only the missing part.",
      questions: [
        {
          id: "e2q1",
          prompt: "She went to the gym. → She ___ to the gym. (negative)",
          correct: "didn't go",
          explanation: "didn't + base form: went → go. She didn't go to the gym.",
        },
        {
          id: "e2q2",
          prompt: "They watched TV last night. → ___ they watch TV last night? (question)",
          correct: "Did",
          explanation: "Question: Did + subject + base form. Did they watch TV last night?",
        },
        {
          id: "e2q3",
          prompt: "He bought a new car. → He ___ a new car. (negative)",
          correct: "didn't buy",
          explanation: "didn't + base form: bought → buy. He didn't buy a new car.",
        },
        {
          id: "e2q4",
          prompt: "You finished the report. → ___ you finish the report? (question)",
          correct: "Did",
          explanation: "Did + subject + base form. Did you finish the report?",
        },
        {
          id: "e2q5",
          prompt: "I called you twice. → I ___ you twice. (negative)",
          correct: "didn't call",
          explanation: "didn't + base form → didn't call.",
        },
        {
          id: "e2q6",
          prompt: "We met them at the airport. → We ___ them at the airport. (negative)",
          correct: "didn't meet",
          explanation: "didn't + base form: met → meet. We didn't meet them.",
        },
        {
          id: "e2q7",
          prompt: "She studied for the exam. → ___ she study for the exam? (question)",
          correct: "Did",
          explanation: "Did + subject + base form. Did she study for the exam?",
        },
        {
          id: "e2q8",
          prompt: "He told you the truth. → He ___ you the truth. (negative)",
          correct: "didn't tell",
          explanation: "didn't + base form: told → tell. He didn't tell you the truth.",
        },
        {
          id: "e2q9",
          prompt: "They left early. → ___ they leave early? (question)",
          correct: "Did",
          explanation: "Did + subject + base form. Did they leave early?",
        },
        {
          id: "e2q10",
          prompt: "I understood everything. → I ___ everything. (negative)",
          correct: "didn't understand",
          explanation: "didn't + base form: understood → understand. I didn't understand everything.",
        },
      ],
    },

    // ── Exercise 3 ── MCQ: mixed negatives, questions, short answers
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Choose the correct option",
      instructions: "Choose the best answer to complete each sentence.",
      questions: [
        {
          id: "e3q1",
          prompt: "A: Did you enjoy the concert? B: No, I ___.",
          options: ["didn't", "don't", "wasn't"],
          correctIndex: 0,
          explanation: "Negative short answer: No, I didn't.",
        },
        {
          id: "e3q2",
          prompt: "Where ___ you go last weekend?",
          options: ["did", "do", "were"],
          correctIndex: 0,
          explanation: "Wh-question in past simple: Where + did + subject + base form.",
        },
        {
          id: "e3q3",
          prompt: "She ___ tell anyone about the surprise party.",
          options: ["doesn't", "didn't told", "didn't tell"],
          correctIndex: 2,
          explanation: "Negative: didn't + base form → didn't tell.",
        },
        {
          id: "e3q4",
          prompt: "What ___ he say when you told him?",
          options: ["does", "did", "was"],
          correctIndex: 1,
          explanation: "Past simple Wh-question: What + did + subject + base form.",
        },
        {
          id: "e3q5",
          prompt: "A: Did they call back? B: Yes, they ___.",
          options: ["called", "do", "did"],
          correctIndex: 2,
          explanation: "Positive short answer: Yes, they did.",
        },
        {
          id: "e3q6",
          prompt: "Why ___ she come to the meeting?",
          options: ["didn't", "doesn't", "wasn't"],
          correctIndex: 0,
          explanation: "Why didn't + subject + base form — negative Wh-question in past simple.",
        },
        {
          id: "e3q7",
          prompt: "He ___ realise how late it was.",
          options: ["didn't realised", "didn't realize", "didn't realizing"],
          correctIndex: 1,
          explanation: "didn't + base form → didn't realize (or realise — both spellings accepted).",
        },
        {
          id: "e3q8",
          prompt: "How much ___ you pay for that jacket?",
          options: ["did", "do", "have"],
          correctIndex: 0,
          explanation: "How much + did + subject + base form.",
        },
        {
          id: "e3q9",
          prompt: "I ___ expect to see you here!",
          options: ["didn't expected", "didn't expect", "don't expected"],
          correctIndex: 1,
          explanation: "didn't + base form → didn't expect.",
        },
        {
          id: "e3q10",
          prompt: "Who ___ you speak to at the office?",
          options: ["do", "did", "have"],
          correctIndex: 1,
          explanation: "Who + did + subject + base form. Past simple Wh-question.",
        },
      ],
    },

    // ── Exercise 4 ── Input: full sentence transformation
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Complete the sentence",
      instructions: "Write the full missing part (negative or question auxiliary + verb) in the blank.",
      questions: [
        {
          id: "e4q1",
          prompt: "I went to bed early. → I ___ to bed late. (negative)",
          correct: "didn't go",
          explanation: "didn't + base form: went → go.",
        },
        {
          id: "e4q2",
          prompt: "They won the match. → ___ they win the match? (question — write the auxiliary only)",
          correct: "Did",
          explanation: "Past simple question starts with Did.",
        },
        {
          id: "e4q3",
          prompt: "She knew the answer. → She ___ the answer. (negative)",
          correct: "didn't know",
          explanation: "didn't + base form: knew → know.",
        },
        {
          id: "e4q4",
          prompt: "He took the bus. → He ___ the bus. (negative)",
          correct: "didn't take",
          explanation: "didn't + base form: took → take.",
        },
        {
          id: "e4q5",
          prompt: "We had a great time. → ___ you have a great time? (question — write the auxiliary only)",
          correct: "Did",
          explanation: "Did + subject + base form for past simple questions.",
        },
        {
          id: "e4q6",
          prompt: "You sent the email. → You ___ the email. (negative)",
          correct: "didn't send",
          explanation: "didn't + base form: sent → send.",
        },
        {
          id: "e4q7",
          prompt: "She found her keys. → She ___ her keys. (negative)",
          correct: "didn't find",
          explanation: "didn't + base form: found → find.",
        },
        {
          id: "e4q8",
          prompt: "They spoke to the manager. → ___ they speak to the manager? (question — write the auxiliary only)",
          correct: "Did",
          explanation: "Did + subject + base form.",
        },
        {
          id: "e4q9",
          prompt: "He made a reservation. → He ___ a reservation. (negative)",
          correct: "didn't make",
          explanation: "didn't + base form: made → make.",
        },
        {
          id: "e4q10",
          prompt: "I told her the truth. → I ___ her the truth. (negative)",
          correct: "didn't tell",
          explanation: "didn't + base form: told → tell.",
        },
      ],
    },
  }), []);

  const current = sets[exNo];

  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  async function downloadPDF() {
    setPdfLoading(true);
    const config: LessonPDFConfig = {
      title: "Past Simple: Negatives & Questions",
      subtitle: "didn't / Did — 4 exercises + answer key",
      level: "A2",
      keyRule: "didn't + base form (NOT past form!) | Did + subject + base form?",
      exercises: [
        {
          number: 1, title: "Exercise 1", difficulty: "Easy",
          instruction: "Choose the correct negative or question form.",
          questions: [
            "She ___ go to school yesterday. (negative)",
            "___ you see that film last night? (question)",
            "They ___ enjoy the party. (negative)",
            "___ he call you this morning? (question)",
            "I ___ finish my homework last night. (negative)",
            "___ they arrive on time? (question)",
            "He ___ know the answer. (negative)",
            "___ she work here before? (question)",
            "We ___ sleep well last night. (negative)",
            "Yes, I ___. (short answer to 'Did you enjoy it?')",
          ],
        },
        {
          number: 2, title: "Exercise 2", difficulty: "Medium",
          instruction: "Write the negative or question form in the blank.",
          questions: [
            "She went to the gym. → She ___ to the gym. (negative)",
            "They watched TV. → ___ they watch TV? (question)",
            "He bought a new car. → He ___ a new car. (negative)",
            "You finished the report. → ___ you finish the report? (question)",
            "I called you twice. → I ___ you twice. (negative)",
            "We met them at the airport. → We ___ them there. (negative)",
            "She studied for the exam. → ___ she study? (question)",
            "He told you the truth. → He ___ you the truth. (negative)",
            "They left early. → ___ they leave early? (question)",
            "I understood everything. → I ___ everything. (negative)",
          ],
        },
        {
          number: 3, title: "Exercise 3", difficulty: "Hard",
          instruction: "Choose the best answer to complete each sentence.",
          questions: [
            "A: Did you enjoy the concert? B: No, I ___.",
            "Where ___ you go last weekend?",
            "She ___ tell anyone about the surprise party.",
            "What ___ he say when you told him?",
            "A: Did they call back? B: Yes, they ___.",
            "Why ___ she come to the meeting?",
            "He ___ realise how late it was.",
            "How much ___ you pay for that jacket?",
            "I ___ expect to see you here!",
            "Who ___ you speak to at the office?",
          ],
        },
        {
          number: 4, title: "Exercise 4", difficulty: "Harder",
          instruction: "Write the full missing part (negative or question auxiliary + verb).",
          questions: [
            "I went to bed early. → I ___ to bed late. (negative)",
            "They won the match. → ___ they win? (write auxiliary only)",
            "She knew the answer. → She ___ the answer. (negative)",
            "He took the bus. → He ___ the bus. (negative)",
            "We had a great time. → ___ you have a great time? (auxiliary)",
            "You sent the email. → You ___ the email. (negative)",
            "She found her keys. → She ___ her keys. (negative)",
            "They spoke to the manager. → ___ they speak? (auxiliary)",
            "He made a reservation. → He ___ a reservation. (negative)",
            "I told her the truth. → I ___ her the truth. (negative)",
          ],
        },
      ],
      answerKey: [
        { exercise: 1, subtitle: "Easy — choose form", answers: ["didn't go", "Did", "didn't enjoy", "Did", "didn't finish", "Did", "didn't know", "Did", "didn't sleep", "did"] },
        { exercise: 2, subtitle: "Medium — write form", answers: ["didn't go", "Did", "didn't buy", "Did", "didn't call", "didn't meet", "Did", "didn't tell", "Did", "didn't understand"] },
        { exercise: 3, subtitle: "Hard — choose best answer", answers: ["didn't", "did", "didn't tell", "did", "did", "didn't", "didn't realize", "did", "didn't expect", "did"] },
        { exercise: 4, subtitle: "Harder — write full form", answers: ["didn't go", "Did", "didn't know", "didn't take", "Did", "didn't send", "didn't find", "Did", "didn't make", "didn't tell"] },
      ],
    };
    await generateLessonPDF(config);
    setPdfLoading(false);
  }

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
      for (const q of current.questions) {
        if ((mcqAnswers[q.id] ?? null) === q.correctIndex) correct++;
      }
    } else {
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        // accept both "realise" and "realize" spelling for e3q7
        const accepted = [normalize(q.correct)];
        if (q.id === "e3q7") accepted.push("didn't realise");
        if (accepted.includes(a)) correct++;
      }
    }
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, mcqAnswers, inputAnswers]);

  function resetExercise() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
    broadcast({ answers: {}, checked: false, exNo });
  }

  function switchExercise(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
    broadcast({ answers: {}, checked: false, exNo: n });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Past Simple: negatives & questions</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Past Simple{" "}
          <span className="rounded-xl bg-[#F5DA20] px-3 py-0.5 text-[#0F0F12]">
            negatives & questions
          </span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-700 border border-teal-200">
          A2
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-600">
        To make negatives and questions in the past simple, we use the auxiliary <b>did / didn&apos;t</b> — and the
        main verb always goes back to its <b>base form</b>.
      </p>

      {/* Layout */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

        {/* Left sidebar */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a2-past-simple-negative-questions" subject="Past Simple Negatives & Questions" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className=""><AdUnit variant="sidebar-dark" /></div>
        )}

        {/* Center */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button
              onClick={() => setTab("exercises")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Exercises
            </button>
            <button
              onClick={() => setTab("explanation")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Explanation
            </button>

            <PDFButton onDownload={downloadPDF} loading={pdfLoading} />

            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              Exercises:
              {([1, 2, 3, 4] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => switchExercise(n)}
                  className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                    exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>

                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-500">
                    <span>Exercises:</span>
                    {([1, 2, 3, 4] as const).map((n) => (
                      <button
                        key={n}
                        onClick={() => switchExercise(n)}
                        className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                          exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  {current.type === "mcq"
                    ? current.questions.map((q, idx) => {
                        const chosen = mcqAnswers[q.id] ?? null;
                        const isCorrect = checked && chosen === q.correctIndex;
                        const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                        const noAnswer = checked && chosen === null;

                        return (
                          <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-900">{q.prompt}</div>
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                  {q.options.map((opt, oi) => (
                                    <label
                                      key={oi}
                                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${
                                        chosen === oi
                                          ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                          : "border-black/10 bg-white hover:bg-black/5"
                                      } ${checked ? "cursor-default" : ""}`}
                                    >
                                      <input
                                        type="radio"
                                        name={q.id}
                                        disabled={checked}
                                        checked={chosen === oi}
                                        onChange={() => { setMcqAnswers((p) => { const n = { ...p, [q.id]: oi }; broadcast({ answers: n, checked, exNo }); return n; }); }}
                                      />
                                      <span className="text-slate-900">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                                {checked && (
                                  <div className="mt-3 text-sm">
                                    {isCorrect && <div className="font-semibold text-emerald-700">✅ Correct</div>}
                                    {isWrong && <div className="font-semibold text-red-700">❌ Wrong</div>}
                                    {noAnswer && <div className="font-semibold text-amber-700">⚠ No answer</div>}
                                    <div className="mt-2 text-slate-700">
                                      <b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : current.questions.map((q, idx) => {
                        const val = inputAnswers[q.id] ?? "";
                        const answered = normalize(val) !== "";
                        const accepted = [normalize(q.correct)];
                        if (q.id === "e3q7") accepted.push("didn't realise");
                        const isCorrect = checked && answered && accepted.includes(normalize(val));
                        const noAnswer = checked && !answered;
                        const wrong = checked && answered && !isCorrect;

                        return (
                          <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-900">{q.prompt}</div>
                                <div className="mt-3">
                                  <input
                                    value={val}
                                    disabled={checked}
                                    onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                                    placeholder="Type here…"
                                    className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20 transition"
                                  />
                                </div>
                                {checked && (
                                  <div className="mt-3 text-sm">
                                    {isCorrect && <div className="font-semibold text-emerald-700">✅ Correct</div>}
                                    {wrong && <div className="font-semibold text-red-700">❌ Wrong</div>}
                                    {noAnswer && <div className="font-semibold text-amber-700">⚠ No answer</div>}
                                    <div className="mt-2 text-slate-700">
                                      <b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                </div>

                {/* Controls */}
                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button
                        onClick={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                      >
                        Check Answers
                      </button>
                    ) : (
                      <button
                        onClick={resetExercise}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                      >
                        Try Again
                      </button>
                    )}
                    {checked && exNo < 4 && (
                      <button
                        onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                      >
                        Next Exercise →
                      </button>
                    )}
                  </div>

                  {score && (
                    <div className={`rounded-2xl border p-4 ${
                      score.percent >= 80
                        ? "border-emerald-200 bg-emerald-50"
                        : score.percent >= 50
                        ? "border-amber-200 bg-amber-50"
                        : "border-red-200 bg-red-50"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-3xl font-black ${
                            score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"
                          }`}>
                            {score.percent}%
                          </div>
                          <div className="mt-0.5 text-sm text-slate-600">
                            {score.correct} out of {score.total} correct
                          </div>
                        </div>
                        <div className="text-3xl">
                          {score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}
                        </div>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${score.percent}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {score.percent >= 80
                          ? "Excellent! You can move to the next exercise."
                          : score.percent >= 50
                          ? "Good effort! Try once more to improve your score."
                          : "Keep practising — review the Explanation tab and try again."}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Explanation />
            )}
          </div>
        </section>

        {/* Right sidebar */}
        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/a2" allLabel="All A2 topics" />
        ) : (
          <AdUnit variant="sidebar-light" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-past-simple-negative-questions" subject="Past Simple Negatives & Questions" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      {/* Bottom navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a
          href="/grammar/a2/past-simple-irregular"
          className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
        >
          ← Past Simple: irregular verbs
        </a>
        <a
          href="/grammar/a2/present-continuous"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Present Continuous →
        </a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Past Simple — Negatives &amp; Questions (A2)</h2>
      <p>
        For <b>negatives</b> and <b>questions</b> in the past simple, we use the auxiliary verb <b>did</b>. The most
        important rule: after <b>did / didn&apos;t</b>, the main verb always returns to its <b>base form</b> — even if
        it is an irregular verb.
      </p>

      {/* Structure cards */}
      <div className="not-prose mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Affirmative</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>Subject + <b>past verb</b></div>
            <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs">
              She <b>went</b> home.<br />
              They <b>bought</b> tickets.
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Negative</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>Subject + <b>didn&apos;t</b> + base form</div>
            <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs">
              She <b>didn&apos;t go</b> home.<br />
              They <b>didn&apos;t buy</b> tickets.
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Question</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div><b>Did</b> + subject + base form?</div>
            <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs">
              <b>Did</b> she go home?<br />
              <b>Did</b> they buy tickets?
            </div>
          </div>
        </div>
      </div>

      {/* Key rule */}
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">The golden rule:</span> <b>didn&apos;t</b> and <b>Did</b> already carry the past tense — so the main verb <b>always goes back to base form</b>.
          <div className="mt-2 grid gap-1 sm:grid-cols-2 text-xs font-mono">
            <div className="rounded-lg bg-red-100 px-2 py-1 text-red-800">She didn&apos;t <s>went</s> ❌</div>
            <div className="rounded-lg bg-emerald-100 px-2 py-1 text-emerald-800">She didn&apos;t <b>go</b> ✅</div>
            <div className="rounded-lg bg-red-100 px-2 py-1 text-red-800">Did he <s>bought</s>? ❌</div>
            <div className="rounded-lg bg-emerald-100 px-2 py-1 text-emerald-800">Did he <b>buy</b>? ✅</div>
          </div>
        </div>
      </div>

      <h3>Short answers</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-2 text-xs font-bold text-slate-600">Positive short answer</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>Did you enjoy it? → <b>Yes, I did.</b></div>
            <div>Did she call? → <b>Yes, she did.</b></div>
            <div>Did they win? → <b>Yes, they did.</b></div>
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-2 text-xs font-bold text-slate-600">Negative short answer</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>Did you enjoy it? → <b>No, I didn&apos;t.</b></div>
            <div>Did she call? → <b>No, she didn&apos;t.</b></div>
            <div>Did they win? → <b>No, they didn&apos;t.</b></div>
          </div>
        </div>
      </div>

      <h3>Wh-questions in past simple</h3>
      <div className="not-prose rounded-xl border border-black/10 bg-white p-4">
        <div className="mb-2 text-xs font-bold text-slate-600">Structure: Wh-word + did + subject + base form</div>
        <div className="grid gap-2 sm:grid-cols-2 text-sm text-slate-900">
          <div><b>Where</b> did you go last night?</div>
          <div><b>What</b> did she say?</div>
          <div><b>When</b> did they arrive?</div>
          <div><b>Why</b> didn&apos;t he come?</div>
          <div><b>How much</b> did you pay?</div>
          <div><b>Who</b> did you talk to?</div>
        </div>
      </div>

      <h3>Common mistakes</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="mb-2 text-xs font-bold text-red-600">❌ Wrong</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>She didn&apos;t <i>went</i> to school.</div>
            <div>Did he <i>bought</i> a new car?</div>
            <div>They didn&apos;t <i>called</i> us.</div>
            <div>Did you <i>enjoyed</i> the film?</div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-2 text-xs font-bold text-emerald-700">✅ Correct</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>She didn&apos;t <b>go</b> to school.</div>
            <div>Did he <b>buy</b> a new car?</div>
            <div>They didn&apos;t <b>call</b> us.</div>
            <div>Did you <b>enjoy</b> the film?</div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-slate-700">
        Start with <b>Exercise 1</b> to practise recognising correct forms, then move to Exercise 2 to transform sentences yourself.
      </p>
    </div>
  );
}
