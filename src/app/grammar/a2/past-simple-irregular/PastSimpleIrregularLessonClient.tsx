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
  return s.trim().toLowerCase();
}

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Past Simple (Regular)", href: "/grammar/a2/past-simple-regular", level: "A2", badge: "bg-emerald-600", reason: "Compare irregular verbs with regular -ed verbs" },
  { title: "Past Simple: Negatives & Questions", href: "/grammar/a2/past-simple-negative-questions", level: "A2", badge: "bg-emerald-600", reason: "Use irregular verbs in negatives and questions" },
  { title: "Time Expressions (Past)", href: "/grammar/a2/time-expressions-past", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "go → past simple", options: ["goed", "gone", "went", "goes"], answer: 2 },
  { q: "come → past simple", options: ["comed", "come", "comes", "came"], answer: 3 },
  { q: "see → past simple", options: ["seed", "seen", "saw", "sawed"], answer: 2 },
  { q: "get → past simple", options: ["getted", "gotten", "gets", "got"], answer: 3 },
  { q: "take → past simple", options: ["taked", "taken", "took", "takes"], answer: 2 },
  { q: "give → past simple", options: ["given", "gived", "gives", "gave"], answer: 3 },
  { q: "say → past simple", options: ["sayed", "saied", "says", "said"], answer: 3 },
  { q: "buy → past simple", options: ["buyed", "boughted", "buys", "bought"], answer: 3 },
  { q: "think → past simple", options: ["thinked", "thunk", "thinks", "thought"], answer: 3 },
  { q: "leave → past simple", options: ["leaved", "lefted", "leaves", "left"], answer: 3 },
  { q: "make → past simple", options: ["maked", "makes", "made", "making"], answer: 2 },
  { q: "find → past simple", options: ["finded", "founded", "found", "finds"], answer: 2 },
  { q: "tell → past simple", options: ["telled", "told", "tells", "telling"], answer: 1 },
  { q: "know → past simple", options: ["knowed", "known", "knows", "knew"], answer: 3 },
  { q: "have → past simple", options: ["haved", "has", "have", "had"], answer: 3 },
  { q: "eat → past simple", options: ["eated", "eaten", "ate", "eats"], answer: 2 },
  { q: "drink → past simple", options: ["drinked", "drunk", "drank", "drinks"], answer: 2 },
  { q: "write → past simple", options: ["writed", "written", "writes", "wrote"], answer: 3 },
  { q: "run → past simple", options: ["runned", "runs", "run", "ran"], answer: 3 },
  { q: "feel → past simple", options: ["feeled", "felt", "feels", "fallen"], answer: 1 },
];

export default function PastSimpleIrregularLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    // ── Exercise 1 ── Choose the correct past simple form
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct past simple form",
      instructions: "Pick the correct past simple form of the verb in brackets.",
      questions: [
        {
          id: "e1q1",
          prompt: "go → past simple?",
          options: ["goed", "went", "gone"],
          correctIndex: 1,
          explanation: "go → went. Completely different form — must be memorised.",
        },
        {
          id: "e1q2",
          prompt: "come → past simple?",
          options: ["comed", "come", "came"],
          correctIndex: 2,
          explanation: "come → came. Note: 'come' stays the same in past participle but the past simple is 'came'.",
        },
        {
          id: "e1q3",
          prompt: "see → past simple?",
          options: ["seed", "saw", "seen"],
          correctIndex: 1,
          explanation: "see → saw. 'Seen' is the past participle (used with have/has).",
        },
        {
          id: "e1q4",
          prompt: "get → past simple?",
          options: ["getted", "gotten", "got"],
          correctIndex: 2,
          explanation: "get → got. Short, common verb — used all the time.",
        },
        {
          id: "e1q5",
          prompt: "take → past simple?",
          options: ["taked", "took", "taken"],
          correctIndex: 1,
          explanation: "take → took. 'Taken' is the past participle.",
        },
        {
          id: "e1q6",
          prompt: "give → past simple?",
          options: ["given", "gived", "gave"],
          correctIndex: 2,
          explanation: "give → gave. 'Given' is the past participle.",
        },
        {
          id: "e1q7",
          prompt: "say → past simple?",
          options: ["sayed", "saied", "said"],
          correctIndex: 2,
          explanation: "say → said. Pronounced /sɛd/, not /seɪd/.",
        },
        {
          id: "e1q8",
          prompt: "buy → past simple?",
          options: ["buyed", "boughted", "bought"],
          correctIndex: 2,
          explanation: "buy → bought. Same pattern as think → thought.",
        },
        {
          id: "e1q9",
          prompt: "think → past simple?",
          options: ["thinked", "thought", "thunk"],
          correctIndex: 1,
          explanation: "think → thought. Pronounced /θɔːt/.",
        },
        {
          id: "e1q10",
          prompt: "leave → past simple?",
          options: ["leaved", "lefted", "left"],
          correctIndex: 2,
          explanation: "leave → left. Same pattern as feel → felt, keep → kept.",
        },
      ],
    },

    // ── Exercise 2 ── Write the past simple form
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct past simple form",
      instructions: "Type the past simple form of each irregular verb.",
      questions: [
        {
          id: "e2q1",
          prompt: "make → ____",
          correct: "made",
          explanation: "make → made. Same pattern as take → took (different, but both change vowel).",
        },
        {
          id: "e2q2",
          prompt: "find → ____",
          correct: "found",
          explanation: "find → found. Same pattern as bind → bound.",
        },
        {
          id: "e2q3",
          prompt: "tell → ____",
          correct: "told",
          explanation: "tell → told. Same pattern as sell → sold.",
        },
        {
          id: "e2q4",
          prompt: "know → ____",
          correct: "knew",
          explanation: "know → knew. Same pattern as grow → grew, blow → blew.",
        },
        {
          id: "e2q5",
          prompt: "have → ____",
          correct: "had",
          explanation: "have → had. One of the most common verbs — used constantly.",
        },
        {
          id: "e2q6",
          prompt: "do → ____",
          correct: "did",
          explanation: "do → did. Also used as the auxiliary in past simple questions.",
        },
        {
          id: "e2q7",
          prompt: "eat → ____",
          correct: "ate",
          explanation: "eat → ate. Pronounced /eɪt/.",
        },
        {
          id: "e2q8",
          prompt: "drink → ____",
          correct: "drank",
          explanation: "drink → drank. Same pattern as sing → sang, ring → rang.",
        },
        {
          id: "e2q9",
          prompt: "write → ____",
          correct: "wrote",
          explanation: "write → wrote. Same pattern as ride → rode.",
        },
        {
          id: "e2q10",
          prompt: "run → ____",
          correct: "ran",
          explanation: "run → ran. Same pattern as come → came (vowel change).",
        },
      ],
    },

    // ── Exercise 3 ── Complete sentences (MCQ)
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Complete the sentence",
      instructions: "Choose the correct past simple form to complete each sentence.",
      questions: [
        {
          id: "e3q1",
          prompt: "Yesterday she ___ (go) to the supermarket and bought a lot of food.",
          options: ["goed", "gone", "went"],
          correctIndex: 2,
          explanation: "go → went. 'Yesterday' signals a finished past action.",
        },
        {
          id: "e3q2",
          prompt: "We ___ (have) a great time at the party last night.",
          options: ["had", "haved", "have"],
          correctIndex: 0,
          explanation: "have → had. 'Last night' signals past simple.",
        },
        {
          id: "e3q3",
          prompt: "He ___ (tell) me the news this morning.",
          options: ["telled", "told", "telling"],
          correctIndex: 1,
          explanation: "tell → told. 'This morning' (as a finished time) triggers past simple.",
        },
        {
          id: "e3q4",
          prompt: "I ___ (see) that film last week — it was amazing.",
          options: ["seed", "seen", "saw"],
          correctIndex: 2,
          explanation: "see → saw. 'Last week' = finished time → past simple.",
        },
        {
          id: "e3q5",
          prompt: "They ___ (come) home very late after the concert.",
          options: ["come", "comed", "came"],
          correctIndex: 2,
          explanation: "come → came. The base form 'come' is NOT correct for past simple.",
        },
        {
          id: "e3q6",
          prompt: "She ___ (buy) a new phone on her birthday.",
          options: ["buyed", "bought", "buy"],
          correctIndex: 1,
          explanation: "buy → bought. 'On her birthday' = specific past time.",
        },
        {
          id: "e3q7",
          prompt: "We ___ (eat) at a nice Italian restaurant last Friday.",
          options: ["eated", "ate", "eaten"],
          correctIndex: 1,
          explanation: "eat → ate. 'Last Friday' = finished past → past simple.",
        },
        {
          id: "e3q8",
          prompt: "He ___ (think) the exam was easy, but he was wrong.",
          options: ["thinked", "thinking", "thought"],
          correctIndex: 2,
          explanation: "think → thought. The exam is finished → past simple.",
        },
        {
          id: "e3q9",
          prompt: "I ___ (find) my keys under the sofa this morning.",
          options: ["finded", "found", "find"],
          correctIndex: 1,
          explanation: "find → found. 'This morning' (finished) = past simple.",
        },
        {
          id: "e3q10",
          prompt: "They ___ (make) a huge mistake and had to start again.",
          options: ["maked", "made", "make"],
          correctIndex: 1,
          explanation: "make → made. Both actions are in the past.",
        },
      ],
    },

    // ── Exercise 4 ── Write the past simple in context
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the verb in past simple",
      instructions: "Write the correct past simple form of the verb in brackets.",
      questions: [
        {
          id: "e4q1",
          prompt: "Last night we ___ (sit) by the fire and talked for hours.",
          correct: "sat",
          explanation: "sit → sat. Same pattern as spit → spat.",
        },
        {
          id: "e4q2",
          prompt: "She ___ (write) him a long letter but never sent it.",
          correct: "wrote",
          explanation: "write → wrote. Same pattern as ride → rode.",
        },
        {
          id: "e4q3",
          prompt: "I ___ (read) that book last summer and loved it.",
          correct: "read",
          explanation: "read → read. The spelling is the same but the past tense is pronounced /rɛd/ (like 'red').",
        },
        {
          id: "e4q4",
          prompt: "He ___ (run) five kilometres before breakfast this morning.",
          correct: "ran",
          explanation: "run → ran. Same vowel change pattern as swim → swam.",
        },
        {
          id: "e4q5",
          prompt: "They ___ (meet) for the first time at a conference in Paris.",
          correct: "met",
          explanation: "meet → met. Same pattern as feel → felt (vowel shortens).",
        },
        {
          id: "e4q6",
          prompt: "I ___ (feel) very tired after the long journey.",
          correct: "felt",
          explanation: "feel → felt. Same pattern as keep → kept, sleep → slept.",
        },
        {
          id: "e4q7",
          prompt: "She ___ (leave) her umbrella on the bus again.",
          correct: "left",
          explanation: "leave → left. Same pattern as feel → felt.",
        },
        {
          id: "e4q8",
          prompt: "We ___ (drink) too much coffee and couldn't sleep.",
          correct: "drank",
          explanation: "drink → drank. Same vowel-change pattern as sing → sang.",
        },
        {
          id: "e4q9",
          prompt: "He ___ (get) the job and was absolutely thrilled.",
          correct: "got",
          explanation: "get → got. Very common verb.",
        },
        {
          id: "e4q10",
          prompt: "I ___ (give) her my old laptop when I bought a new one.",
          correct: "gave",
          explanation: "give → gave. Same pattern as take → took... but different direction — give → gave.",
        },
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
      for (const q of current.questions) {
        if ((mcqAnswers[q.id] ?? null) === q.correctIndex) correct++;
      }
    } else {
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a === normalize(q.correct)) correct++;
      }
    }
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, mcqAnswers, inputAnswers]);

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Past Simple: Irregular",
        subtitle: "Irregular Verb Forms — 4 exercises + answer key",
        level: "A2",
        keyRule: "Irregular verbs don't add -ed. Each has its own past form: go→went, have→had, see→saw. Same form for all pronouns.",
        exercises: [
          { number: 1, title: "Exercise 1", difficulty: "Easy", instruction: "Choose the correct past simple form.", questions: [
            "go → past simple?", "come → past simple?", "see → past simple?", "get → past simple?", "take → past simple?",
            "give → past simple?", "say → past simple?", "buy → past simple?", "think → past simple?", "leave → past simple?",
          ]},
          { number: 2, title: "Exercise 2", difficulty: "Medium", instruction: "Write the past simple form of each irregular verb.", questions: [
            "make → ____", "find → ____", "tell → ____", "know → ____", "have → ____",
            "do → ____", "eat → ____", "drink → ____", "write → ____", "run → ____",
          ]},
          { number: 3, title: "Exercise 3", difficulty: "Hard", instruction: "Choose the correct past simple to complete each sentence.", questions: [
            "Yesterday she ___ (go) to the supermarket.", "We ___ (have) a great time at the party last night.",
            "He ___ (tell) me the news this morning.", "I ___ (see) that film last week — it was amazing.",
            "They ___ (come) home very late after the concert.", "She ___ (buy) a new phone on her birthday.",
            "We ___ (eat) at a nice Italian restaurant last Friday.", "He ___ (think) the exam was easy, but he was wrong.",
            "I ___ (find) my keys under the sofa this morning.", "They ___ (make) a huge mistake and had to start again.",
          ]},
          { number: 4, title: "Exercise 4", difficulty: "Harder", instruction: "Write the correct past simple form of the verb in brackets.", questions: [
            "Last night we ___ (sit) by the fire and talked for hours.", "She ___ (write) him a long letter but never sent it.",
            "I ___ (read) that book last summer and loved it.", "He ___ (run) five kilometres before breakfast this morning.",
            "They ___ (meet) for the first time at a conference in Paris.", "I ___ (feel) very tired after the long journey.",
            "She ___ (leave) her umbrella on the bus again.", "We ___ (drink) too much coffee and couldn't sleep.",
            "He ___ (get) the job and was absolutely thrilled.", "I ___ (give) her my old laptop when I bought a new one.",
          ]},
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — choose past simple", answers: ["went", "came", "saw", "got", "took", "gave", "said", "bought", "thought", "left"] },
          { exercise: 2, subtitle: "Medium — write the form", answers: ["made", "found", "told", "knew", "had", "did", "ate", "drank", "wrote", "ran"] },
          { exercise: 3, subtitle: "Hard — complete the sentence", answers: ["went", "had", "told", "saw", "came", "bought", "ate", "thought", "found", "made"] },
          { exercise: 4, subtitle: "Harder — write in context", answers: ["sat", "wrote", "read", "ran", "met", "felt", "left", "drank", "got", "gave"] },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  function resetExercise() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  function switchExercise(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Past Simple: irregular verbs</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Past Simple{" "}
          <span className="rounded-xl bg-[#F5DA20] px-3 py-0.5 text-[#0F0F12]">
            irregular verbs
          </span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-700 border border-teal-200">
          A2
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-600">
        Irregular verbs do <b>not</b> follow the -ed rule — each one has its own past simple form that you need to memorise.
        This lesson covers the most important ones with lots of practice.
      </p>

      {/* Layout: left ad/game + center content + right ad/recommendations */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a2-past-simple-irregular" subject="Past Simple Irregular" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
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

            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-500">
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

                  {/* Mobile exercise buttons */}
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

                {/* Questions */}
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
                                        onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))}
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
                        const isCorrect = checked && answered && normalize(val) === normalize(q.correct);
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
                        onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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

        {/* Right column */}
        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/a2" allLabel="All A2 topics" />
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-light" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-past-simple-irregular" subject="Past Simple Irregular" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      {/* Bottom navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a
          href="/grammar/a2/past-simple-regular"
          className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
        >
          ← Past Simple: regular verbs
        </a>
        <a
          href="/grammar/a2/past-simple-negative-questions"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Past Simple — negatives & questions →
        </a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Past Simple — Irregular Verbs (A2)</h2>
      <p>
        Unlike regular verbs, irregular verbs do <b>not</b> add <b>-ed</b> in the past simple. Each verb has its own
        unique form — you simply need to learn them. The good news: the same form is used for <b>all persons</b> (I, you,
        he, she, we, they).
      </p>

      {/* Key principle */}
      <div className="not-prose mb-5 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">Key rule:</span> The past simple form is the <b>same for all
          pronouns</b>. I <b>went</b>, you <b>went</b>, he <b>went</b>, she <b>went</b>, we <b>went</b>, they <b>went</b>.
        </div>
      </div>

      {/* Verb table */}
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Most important irregular verbs — base form → past simple
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {[
            ["be", "was / were"],
            ["have", "had"],
            ["do", "did"],
            ["go", "went"],
            ["come", "came"],
            ["get", "got"],
            ["make", "made"],
            ["take", "took"],
            ["give", "gave"],
            ["know", "knew"],
            ["see", "saw"],
            ["say", "said"],
            ["think", "thought"],
            ["find", "found"],
            ["tell", "told"],
            ["buy", "bought"],
            ["leave", "left"],
            ["feel", "felt"],
            ["meet", "met"],
            ["keep", "kept"],
            ["eat", "ate"],
            ["drink", "drank"],
            ["write", "wrote"],
            ["read", "read*"],
            ["run", "ran"],
            ["swim", "swam"],
            ["sit", "sat"],
            ["stand", "stood"],
            ["put", "put"],
            ["let", "let"],
          ].map(([base, past]) => (
            <div key={base} className="flex items-center justify-between rounded-xl border border-black/8 bg-slate-50 px-3 py-2 text-sm">
              <span className="text-slate-500">{base}</span>
              <span className="font-black text-slate-900">→ {past}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          * <b>read</b> — the spelling is the same but the past tense is pronounced <b>/rɛd/</b> (like the colour &ldquo;red&rdquo;).
        </p>
      </div>

      <h3>Patterns to help you remember</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-2 text-xs font-bold text-slate-600">-ought / -aught group</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>think → <b>thought</b></div>
            <div>buy → <b>bought</b></div>
            <div>bring → <b>brought</b></div>
            <div>catch → <b>caught</b></div>
            <div>teach → <b>taught</b></div>
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-2 text-xs font-bold text-slate-600">vowel change: i → a</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>drink → <b>drank</b></div>
            <div>sing → <b>sang</b></div>
            <div>ring → <b>rang</b></div>
            <div>swim → <b>swam</b></div>
            <div>begin → <b>began</b></div>
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-2 text-xs font-bold text-slate-600">-ell → -old / -eft</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>tell → <b>told</b></div>
            <div>sell → <b>sold</b></div>
            <div>feel → <b>felt</b></div>
            <div>keep → <b>kept</b></div>
            <div>leave → <b>left</b></div>
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-2 text-xs font-bold text-slate-600">no change (A–A verbs)</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>put → <b>put</b></div>
            <div>let → <b>let</b></div>
            <div>cut → <b>cut</b></div>
            <div>hit → <b>hit</b></div>
            <div>read → <b>read</b> (/rɛd/)</div>
          </div>
        </div>
      </div>

      <h3>Common mistakes</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="mb-2 text-xs font-bold text-red-600">❌ Wrong</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>I <i>goed</i> to school.</div>
            <div>She <i>buyed</i> a new bag.</div>
            <div>We <i>eated</i> pizza last night.</div>
            <div>He <i>thinked</i> it was easy.</div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-2 text-xs font-bold text-emerald-700">✅ Correct</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>I <b>went</b> to school.</div>
            <div>She <b>bought</b> a new bag.</div>
            <div>We <b>ate</b> pizza last night.</div>
            <div>He <b>thought</b> it was easy.</div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-slate-700">
        Start with <b>Exercise 1</b> to test how many forms you already know, then use the table above to fill in the gaps.
      </p>
    </div>
  );
}
