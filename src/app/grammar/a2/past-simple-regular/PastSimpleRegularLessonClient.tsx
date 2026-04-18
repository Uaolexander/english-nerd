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
  return s.trim().toLowerCase();
}

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Past Simple (Irregular)", href: "/grammar/a2/past-simple-irregular", level: "A2", badge: "bg-emerald-600", reason: "Learn the irregular verbs that don't use -ed" },
  { title: "Past Simple: Negatives & Questions", href: "/grammar/a2/past-simple-negative-questions", level: "A2", badge: "bg-emerald-600", reason: "Form negatives and questions in past simple" },
  { title: "Time Expressions (Past)", href: "/grammar/a2/time-expressions-past", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "walk → past simple?", options: ["walkd", "walked", "walkes", "walking"], answer: 1 },
  { q: "play → past simple?", options: ["plaied", "playd", "played", "playied"], answer: 2 },
  { q: "dance → past simple?", options: ["danceed", "dancied", "dancing", "danced"], answer: 3 },
  { q: "study → past simple?", options: ["studyed", "studied", "studieed", "studid"], answer: 1 },
  { q: "stop → past simple?", options: ["stoped", "stopted", "stopping", "stopped"], answer: 3 },
  { q: "like → past simple?", options: ["likeed", "liking", "liked", "likied"], answer: 2 },
  { q: "carry → past simple?", options: ["carryed", "caried", "carried", "carrid"], answer: 2 },
  { q: "plan → past simple?", options: ["planeed", "planed", "planing", "planned"], answer: 3 },
  { q: "open → past simple?", options: ["openned", "opend", "opened", "openied"], answer: 2 },
  { q: "enjoy → past simple?", options: ["enjoied", "enjoyd", "enjoyied", "enjoyed"], answer: 3 },
  { q: "drop → past simple?", options: ["droped", "dropd", "dropped", "droping"], answer: 2 },
  { q: "try → past simple?", options: ["tryed", "tryied", "tried", "trid"], answer: 2 },
  { q: "decide → past simple?", options: ["decideed", "decided", "deciding", "decidied"], answer: 1 },
  { q: "chat → past simple?", options: ["chated", "chatied", "chatd", "chatted"], answer: 3 },
  { q: "hurry → past simple?", options: ["hurryed", "hurried", "hurrid", "hurryied"], answer: 1 },
  { q: "miss → past simple?", options: ["mised", "missied", "missing", "missed"], answer: 3 },
  { q: "smile → past simple?", options: ["smileed", "smilied", "smiled", "smild"], answer: 2 },
  { q: "clap → past simple?", options: ["claped", "clapied", "claping", "clapped"], answer: 3 },
  { q: "copy → past simple?", options: ["copyed", "copied", "copyied", "copid"], answer: 1 },
  { q: "travel → past simple? (British English)", options: ["traveld", "travelied", "traveled", "travelled"], answer: 3 },
];

export default function PastSimpleRegularLessonClient() {
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
    // ── Exercise 1 ── Choose the correct past simple form (spelling focus)
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct past simple form",
      instructions: "Pick the correctly spelled past simple form of the verb in brackets.",
      questions: [
        {
          id: "e1q1",
          prompt: "walk → past simple?",
          options: ["walked", "walkd", "walkes"],
          correctIndex: 0,
          explanation: "Most verbs: simply add -ed. walk → walked.",
        },
        {
          id: "e1q2",
          prompt: "play → past simple?",
          options: ["plaied", "played", "playd"],
          correctIndex: 1,
          explanation: "Vowel + y → just add -ed. play → played.",
        },
        {
          id: "e1q3",
          prompt: "dance → past simple?",
          options: ["danceed", "dancied", "danced"],
          correctIndex: 2,
          explanation: "Verb ending in -e: add only -d. dance → danced.",
        },
        {
          id: "e1q4",
          prompt: "study → past simple?",
          options: ["studyed", "studied", "studieed"],
          correctIndex: 1,
          explanation: "Consonant + y → change y to i, then add -ed. study → studied.",
        },
        {
          id: "e1q5",
          prompt: "stop → past simple?",
          options: ["stoped", "stopped", "stopted"],
          correctIndex: 1,
          explanation: "Short CVC verb (consonant-vowel-consonant): double the last consonant. stop → stopped.",
        },
        {
          id: "e1q6",
          prompt: "like → past simple?",
          options: ["likeed", "liked", "liking"],
          correctIndex: 1,
          explanation: "Verb ending in -e: add only -d. like → liked.",
        },
        {
          id: "e1q7",
          prompt: "carry → past simple?",
          options: ["carryed", "carried", "caried"],
          correctIndex: 1,
          explanation: "Consonant + y → change y to i, add -ed. carry → carried.",
        },
        {
          id: "e1q8",
          prompt: "plan → past simple?",
          options: ["planeed", "planed", "planned"],
          correctIndex: 2,
          explanation: "CVC verb: double the last consonant. plan → planned.",
        },
        {
          id: "e1q9",
          prompt: "open → past simple?",
          options: ["openned", "opened", "opend"],
          correctIndex: 1,
          explanation: "Two-syllable verbs with stress on first syllable do NOT double: open → opened.",
        },
        {
          id: "e1q10",
          prompt: "enjoy → past simple?",
          options: ["enjoied", "enjoyd", "enjoyed"],
          correctIndex: 2,
          explanation: "Vowel + y → add -ed. enjoy → enjoyed.",
        },
      ],
    },

    // ── Exercise 2 ── Write the past simple form
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct past simple form",
      instructions: "Type the past simple form of each verb. Pay attention to spelling rules.",
      questions: [
        {
          id: "e2q1",
          prompt: "work → ____",
          correct: "worked",
          explanation: "Just add -ed. work → worked.",
        },
        {
          id: "e2q2",
          prompt: "clean → ____",
          correct: "cleaned",
          explanation: "Just add -ed. clean → cleaned.",
        },
        {
          id: "e2q3",
          prompt: "hope → ____",
          correct: "hoped",
          explanation: "Ends in -e: add only -d. hope → hoped.",
        },
        {
          id: "e2q4",
          prompt: "marry → ____",
          correct: "married",
          explanation: "Consonant + y: change y to i, add -ed. marry → married.",
        },
        {
          id: "e2q5",
          prompt: "drop → ____",
          correct: "dropped",
          explanation: "CVC verb: double the final consonant. drop → dropped.",
        },
        {
          id: "e2q6",
          prompt: "travel → ____",
          correct: "travelled",
          explanation: "British English: travel → travelled (double l). American English: traveled. Both are correct.",
        },
        {
          id: "e2q7",
          prompt: "try → ____",
          correct: "tried",
          explanation: "Consonant + y: y → i + -ed. try → tried.",
        },
        {
          id: "e2q8",
          prompt: "decide → ____",
          correct: "decided",
          explanation: "Ends in -e: add only -d. decide → decided.",
        },
        {
          id: "e2q9",
          prompt: "listen → ____",
          correct: "listened",
          explanation: "Just add -ed. listen → listened.",
        },
        {
          id: "e2q10",
          prompt: "chat → ____",
          correct: "chatted",
          explanation: "CVC verb (one syllable, stressed): double the t. chat → chatted.",
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
          prompt: "Yesterday I ___ (walk) to school because I missed the bus.",
          options: ["walked", "walking", "walks"],
          correctIndex: 0,
          explanation: "'Yesterday' shows a finished past action → walked.",
        },
        {
          id: "e3q2",
          prompt: "She ___ (study) until midnight to prepare for her test.",
          options: ["studying", "studyed", "studied"],
          correctIndex: 2,
          explanation: "Consonant + y → studied.",
        },
        {
          id: "e3q3",
          prompt: "They ___ (stop) the car and took some photos.",
          options: ["stoped", "stopped", "stopping"],
          correctIndex: 1,
          explanation: "CVC: double the p → stopped.",
        },
        {
          id: "e3q4",
          prompt: "We ___ (visit) my grandparents last weekend.",
          options: ["visited", "visitted", "visiting"],
          correctIndex: 0,
          explanation: "Just add -ed. visit → visited (the second syllable is not stressed, so no doubling).",
        },
        {
          id: "e3q5",
          prompt: "He ___ (plan) the whole trip himself.",
          options: ["planed", "planned", "planing"],
          correctIndex: 1,
          explanation: "CVC: double the n → planned.",
        },
        {
          id: "e3q6",
          prompt: "The children ___ (play) football all afternoon.",
          options: ["plaied", "played", "plaid"],
          correctIndex: 1,
          explanation: "Vowel + y → just add -ed → played.",
        },
        {
          id: "e3q7",
          prompt: "I ___ (decide) to stay home and rest.",
          options: ["decideed", "decided", "deciding"],
          correctIndex: 1,
          explanation: "Ends in -e: add only -d → decided.",
        },
        {
          id: "e3q8",
          prompt: "She ___ (carry) all the shopping bags by herself.",
          options: ["carryed", "carried", "caryed"],
          correctIndex: 1,
          explanation: "Consonant + y → y to i + -ed → carried.",
        },
        {
          id: "e3q9",
          prompt: "We ___ (enjoy) the concert very much.",
          options: ["enjoied", "enjoyed", "enjoy"],
          correctIndex: 1,
          explanation: "Vowel + y → add -ed → enjoyed.",
        },
        {
          id: "e3q10",
          prompt: "He ___ (open) the window because it was hot.",
          options: ["openned", "opend", "opened"],
          correctIndex: 2,
          explanation: "Two-syllable verb stressed on 1st syllable: no doubling → opened.",
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
          prompt: "Last night I ___ (finish) all my homework.",
          correct: "finished",
          explanation: "Just add -ed. finish → finished.",
        },
        {
          id: "e4q2",
          prompt: "She ___ (smile) and said nothing.",
          correct: "smiled",
          explanation: "Ends in -e: add only -d → smiled.",
        },
        {
          id: "e4q3",
          prompt: "We ___ (chat) for hours at the café.",
          correct: "chatted",
          explanation: "CVC verb: double the t → chatted.",
        },
        {
          id: "e4q4",
          prompt: "He ___ (copy) the notes from the board.",
          correct: "copied",
          explanation: "Consonant + y: y → i + -ed → copied.",
        },
        {
          id: "e4q5",
          prompt: "They ___ (arrive) late to the party.",
          correct: "arrived",
          explanation: "Ends in -e: add only -d → arrived.",
        },
        {
          id: "e4q6",
          prompt: "I ___ (miss) the last train home.",
          correct: "missed",
          explanation: "Just add -ed. miss → missed.",
        },
        {
          id: "e4q7",
          prompt: "She ___ (clap) her hands when she heard the news.",
          correct: "clapped",
          explanation: "CVC verb: double the p → clapped.",
        },
        {
          id: "e4q8",
          prompt: "We ___ (hurry) to catch the bus.",
          correct: "hurried",
          explanation: "Consonant + y: y → i + -ed → hurried.",
        },
        {
          id: "e4q9",
          prompt: "He ___ (join) the gym six months ago.",
          correct: "joined",
          explanation: "Just add -ed. join → joined.",
        },
        {
          id: "e4q10",
          prompt: "They ___ (empty) the bin before they left.",
          correct: "emptied",
          explanation: "Consonant + y: y → i + -ed → emptied.",
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
      title: "Past Simple: Regular Verbs",
      subtitle: "Spelling rules for -ed — 4 exercises + answer key",
      level: "A2",
      keyRule: "Most verbs: +ed | ends in -e: +d | consonant+y: y→i+ed | CVC: double consonant+ed",
      exercises: [
        {
          number: 1, title: "Exercise 1", difficulty: "Easy",
          instruction: "Choose the correctly spelled past simple form.",
          questions: [
            "walk → past simple?",
            "play → past simple?",
            "dance → past simple?",
            "study → past simple?",
            "stop → past simple?",
            "like → past simple?",
            "carry → past simple?",
            "plan → past simple?",
            "open → past simple?",
            "enjoy → past simple?",
          ],
        },
        {
          number: 2, title: "Exercise 2", difficulty: "Medium",
          instruction: "Write the past simple form of each verb.",
          questions: [
            "work → ____",
            "clean → ____",
            "hope → ____",
            "marry → ____",
            "drop → ____",
            "travel → ____ (British English)",
            "try → ____",
            "decide → ____",
            "listen → ____",
            "chat → ____",
          ],
        },
        {
          number: 3, title: "Exercise 3", difficulty: "Hard",
          instruction: "Choose the correct past simple form to complete the sentence.",
          questions: [
            "Yesterday I ___ (walk) to school because I missed the bus.",
            "She ___ (study) until midnight for her test.",
            "They ___ (stop) the car and took some photos.",
            "We ___ (visit) my grandparents last weekend.",
            "He ___ (plan) the whole trip himself.",
            "The children ___ (play) football all afternoon.",
            "I ___ (decide) to stay home and rest.",
            "She ___ (carry) all the shopping bags by herself.",
            "We ___ (enjoy) the concert very much.",
            "He ___ (open) the window because it was hot.",
          ],
        },
        {
          number: 4, title: "Exercise 4", difficulty: "Harder",
          instruction: "Write the correct past simple form of the verb in brackets.",
          questions: [
            "Last night I ___ (finish) all my homework.",
            "She ___ (smile) and said nothing.",
            "We ___ (chat) for hours at the café.",
            "He ___ (copy) the notes from the board.",
            "They ___ (arrive) late to the party.",
            "I ___ (miss) the last train home.",
            "She ___ (clap) her hands when she heard the news.",
            "We ___ (hurry) to catch the bus.",
            "He ___ (join) the gym six months ago.",
            "They ___ (empty) the bin before they left.",
          ],
        },
      ],
      answerKey: [
        { exercise: 1, subtitle: "Easy — choose spelling", answers: ["walked", "played", "danced", "studied", "stopped", "liked", "carried", "planned", "opened", "enjoyed"] },
        { exercise: 2, subtitle: "Medium — write form", answers: ["worked", "cleaned", "hoped", "married", "dropped", "travelled", "tried", "decided", "listened", "chatted"] },
        { exercise: 3, subtitle: "Hard — complete sentence", answers: ["walked", "studied", "stopped", "visited", "planned", "played", "decided", "carried", "enjoyed", "opened"] },
        { exercise: 4, subtitle: "Harder — write in context", answers: ["finished", "smiled", "chatted", "copied", "arrived", "missed", "clapped", "hurried", "joined", "emptied"] },
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
        const accepted = [normalize(q.correct)];
        // travel accepts both British and American spelling
        if (q.id === "e2q6") accepted.push("traveled");
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
        <span className="text-slate-700 font-medium">Past Simple: regular verbs</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Past Simple{" "}
          <span className="rounded-xl bg-[#F5DA20] px-3 py-0.5 text-[#0F0F12]">
            regular verbs
          </span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-700 border border-teal-200">
          A2
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-600">
        Regular verbs form the past simple by adding <b>-ed</b> to the base form. There are a few important spelling
        rules you need to know — this lesson covers all of them with practice.
      </p>

      {/* Layout */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

        {/* Left sidebar */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a2-past-simple-regular" subject="Past Simple Regular Verbs" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                      {/* Progress bar */}
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
          <SpeedRound gameId="grammar-a2-past-simple-regular" subject="Past Simple Regular Verbs" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      {/* Next / Prev lesson navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a
          href="/grammar/a2"
          className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
        >
          ← All A2 topics
        </a>
        <a
          href="/grammar/a2/past-simple-irregular"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Past Simple — irregular verbs →
        </a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Past Simple — Regular Verbs (A2)</h2>
      <p>
        To talk about finished actions in the past, we use the <b>past simple</b>. For regular verbs, the rule is
        simple: add <b>-ed</b> to the base form. But there are several spelling rules to know.
      </p>

      {/* Spelling rules table */}
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Spelling rules — 4 patterns
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-slate-50 p-4">
            <div className="mb-1.5 text-xs font-bold text-slate-600">1. Most verbs → add -ed</div>
            <div className="space-y-1 text-sm text-slate-900">
              <div>walk → <b>walked</b></div>
              <div>open → <b>opened</b></div>
              <div>listen → <b>listened</b></div>
              <div>visit → <b>visited</b></div>
            </div>
          </div>
          <div className="rounded-xl border border-black/10 bg-slate-50 p-4">
            <div className="mb-1.5 text-xs font-bold text-slate-600">2. Ends in -e → add only -d</div>
            <div className="space-y-1 text-sm text-slate-900">
              <div>dance → <b>danced</b></div>
              <div>like → <b>liked</b></div>
              <div>hope → <b>hoped</b></div>
              <div>decide → <b>decided</b></div>
            </div>
          </div>
          <div className="rounded-xl border border-black/10 bg-slate-50 p-4">
            <div className="mb-1.5 text-xs font-bold text-slate-600">3. Consonant + y → y to i + -ed</div>
            <div className="space-y-1 text-sm text-slate-900">
              <div>study → <b>studied</b></div>
              <div>try → <b>tried</b></div>
              <div>carry → <b>carried</b></div>
              <div>hurry → <b>hurried</b></div>
            </div>
            <div className="mt-2 text-xs text-slate-500">But vowel + y → just -ed: play → played, enjoy → enjoyed</div>
          </div>
          <div className="rounded-xl border border-black/10 bg-slate-50 p-4">
            <div className="mb-1.5 text-xs font-bold text-slate-600">4. Short CVC → double last consonant + -ed</div>
            <div className="space-y-1 text-sm text-slate-900">
              <div>stop → <b>stopped</b></div>
              <div>plan → <b>planned</b></div>
              <div>drop → <b>dropped</b></div>
              <div>chat → <b>chatted</b></div>
            </div>
            <div className="mt-2 text-xs text-slate-500">CVC = one syllable ending consonant-vowel-consonant</div>
          </div>
        </div>
      </div>

      <h3>Pronunciation of -ed</h3>
      <p>The -ed ending is pronounced three different ways depending on the final sound of the verb:</p>

      <div className="not-prose grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-1.5 text-xs font-bold text-slate-600">/t/ — after voiceless sounds</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>walked <span className="text-slate-400">/wɔːkt/</span></div>
            <div>cooked <span className="text-slate-400">/kʊkt/</span></div>
            <div>missed <span className="text-slate-400">/mɪst/</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-1.5 text-xs font-bold text-slate-600">/d/ — after voiced sounds</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>played <span className="text-slate-400">/pleɪd/</span></div>
            <div>cleaned <span className="text-slate-400">/kliːnd/</span></div>
            <div>listened <span className="text-slate-400">/lɪsənd/</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="mb-1.5 text-xs font-bold text-slate-600">/ɪd/ — after -t or -d</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>visited <span className="text-slate-400">/vɪzɪtɪd/</span></div>
            <div>wanted <span className="text-slate-400">/wɒntɪd/</span></div>
            <div>decided <span className="text-slate-400">/dɪsaɪdɪd/</span></div>
          </div>
        </div>
      </div>

      <h3>Common mistakes</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="mb-2 text-xs font-bold text-red-600">❌ Wrong</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>She <i>studyed</i> hard. <span className="text-slate-500">(y after consonant)</span></div>
            <div>He <i>stoped</i> suddenly. <span className="text-slate-500">(CVC: double p)</span></div>
            <div>We <i>danceed</i> all night. <span className="text-slate-500">(ends in -e)</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-2 text-xs font-bold text-emerald-700">✅ Correct</div>
          <div className="space-y-1 text-sm text-slate-900">
            <div>She <b>studied</b> hard.</div>
            <div>He <b>stopped</b> suddenly.</div>
            <div>We <b>danced</b> all night.</div>
          </div>
        </div>
      </div>

      <div className="not-prose mt-5 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">Remember:</span> Regular verbs use the same -ed form for{" "}
          <b>all persons</b> — I walked, you walked, he walked, she walked, we walked, they walked. No exceptions.
        </div>
      </div>

      <p className="mt-4 text-slate-700">
        Start with <b>Exercise 1</b> to practise the spelling rules, then move to Exercise 3–4 to use them in real sentences.
      </p>
    </div>
  );
}
