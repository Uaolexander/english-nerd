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
  { title: "Going to (Future Plans)", href: "/grammar/a2/going-to", level: "A2", badge: "bg-emerald-600", reason: "Present continuous is also used for future arrangements" },
  { title: "Past Simple (Regular)", href: "/grammar/a2/past-simple-regular", level: "A2", badge: "bg-emerald-600", reason: "Contrast present actions with past actions" },
  { title: "Present Perfect (Introduction)", href: "/grammar/a2/present-perfect-intro", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "I ___ TV right now.", options: ["am watching", "watch", "is watching", "are watching"], answer: 0 },
  { q: "She ___ a book at the moment.", options: ["reads", "is reading", "are reading", "read"], answer: 1 },
  { q: "They ___ football in the park.", options: ["is playing", "plays", "are playing", "play"], answer: 2 },
  { q: "He ___ dinner right now.", options: ["is cooking", "are cooking", "cooks", "cook"], answer: 0 },
  { q: "We ___ to music.", options: ["listens", "is listening", "are listening", "listen"], answer: 2 },
  { q: "run → ___", options: ["runing", "running", "runnin", "runs"], answer: 1 },
  { q: "make → ___", options: ["makeing", "makking", "making", "maked"], answer: 2 },
  { q: "sit → ___", options: ["siting", "sitting", "sitin", "siting"], answer: 1 },
  { q: "Is she ___? (dance)", options: ["dancing", "danceing", "dances", "dance"], answer: 0 },
  { q: "write → ___", options: ["writeing", "writting", "writing", "writning"], answer: 2 },
  { q: "___ you listening?", options: ["Is", "Am", "Are", "Do"], answer: 2 },
  { q: "swim → ___", options: ["swiming", "swimmin", "swimming", "swims"], answer: 2 },
  { q: "He ___ (not/work) today.", options: ["isn't working", "aren't working", "doesn't working", "not working"], answer: 0 },
  { q: "What ___ she doing?", options: ["do", "are", "is", "am"], answer: 2 },
  { q: "I ___ (not) feel well.", options: ["am not feeling", "not feeling", "isn't feeling", "aren't feeling"], answer: 0 },
  { q: "begin → ___", options: ["begining", "beggining", "beginning", "beginig"], answer: 2 },
  { q: "They ___ a house.", options: ["are building", "is building", "builds", "building"], answer: 0 },
  { q: "She ___ (cry) again.", options: ["is crying", "are crying", "cries", "crying"], answer: 0 },
  { q: "get → ___", options: ["geting", "getting", "gettin", "gets"], answer: 1 },
  { q: "___ I doing this correctly?", options: ["Is", "Are", "Am", "Do"], answer: 2 },
];

export default function PresentContinuousLessonClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct present continuous form",
      instructions: "Choose the correct present continuous form for each sentence.",
      questions: [
        { id: "e1q1", prompt: "Look! The dog ___ in the garden.", options: ["is running", "runs", "running"], correctIndex: 0, explanation: "is + running. We use present continuous for an action happening right now." },
        { id: "e1q2", prompt: "We ___ to your message right now.", options: ["listening", "are listening", "is listening"], correctIndex: 1, explanation: "We → are + listening." },
        { id: "e1q3", prompt: "She ___ a nap on the sofa.", options: ["has", "is having", "are having"], correctIndex: 1, explanation: "She → is + having. Note: 'have' drops the -e before adding -ing." },
        { id: "e1q4", prompt: "I can't talk — I ___ dinner.", options: ["am cooking", "is cooking", "cook"], correctIndex: 0, explanation: "I → am + cooking." },
        { id: "e1q5", prompt: "They ___ a new school.", options: ["builds", "is building", "are building"], correctIndex: 2, explanation: "They → are + building." },
        { id: "e1q6", prompt: "He ___ on his phone in class!", options: ["is playing", "are playing", "plays"], correctIndex: 0, explanation: "He → is + playing." },
        { id: "e1q7", prompt: "My sister ___ for her keys.", options: ["looking", "are looking", "is looking"], correctIndex: 2, explanation: "She → is + looking." },
        { id: "e1q8", prompt: "Look at her — she ___!", options: ["cries", "is crying", "are crying"], correctIndex: 1, explanation: "She → is + crying. Verbs ending in consonant + y: keep the y and add -ing." },
        { id: "e1q9", prompt: "We ___ a brilliant film right now.", options: ["watches", "watching", "are watching"], correctIndex: 2, explanation: "We → are + watching." },
        { id: "e1q10", prompt: "The children ___. Please be quiet.", options: ["is sleeping", "are sleeping", "sleeps"], correctIndex: 1, explanation: "They (children) → are + sleeping." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the -ing form",
      instructions: "Write the correct -ing form of each verb. Pay attention to spelling rules.",
      questions: [
        { id: "e2q1", prompt: "run → ____", correct: "running", explanation: "CVC rule: short vowel + single consonant → double the consonant. run → running." },
        { id: "e2q2", prompt: "make → ____", correct: "making", explanation: "Ends in silent -e: drop the -e and add -ing. make → making." },
        { id: "e2q3", prompt: "sit → ____", correct: "sitting", explanation: "CVC rule: sit → sitting (double the t)." },
        { id: "e2q4", prompt: "study → ____", correct: "studying", explanation: "Ends in -y: just add -ing. study → studying." },
        { id: "e2q5", prompt: "swim → ____", correct: "swimming", explanation: "CVC rule: swim → swimming (double the m)." },
        { id: "e2q6", prompt: "write → ____", correct: "writing", explanation: "Ends in silent -e: drop the -e. write → writing." },
        { id: "e2q7", prompt: "get → ____", correct: "getting", explanation: "CVC rule: get → getting (double the t)." },
        { id: "e2q8", prompt: "dance → ____", correct: "dancing", explanation: "Ends in silent -e: drop the -e. dance → dancing." },
        { id: "e2q9", prompt: "put → ____", correct: "putting", explanation: "CVC rule: put → putting (double the t)." },
        { id: "e2q10", prompt: "begin → ____", correct: "beginning", explanation: "Two-syllable verb, stress on last syllable (be-GIN): double the final consonant. begin → beginning." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Complete the sentence",
      instructions: "Choose the correct present continuous form to complete each sentence.",
      questions: [
        { id: "e3q1", prompt: "___ she ___ to music right now?", options: ["Is she listening", "Does she listen", "Are she listening"], correctIndex: 0, explanation: "Questions: Is/Are + subject + verb-ing? She → Is she listening?" },
        { id: "e3q2", prompt: "They ___ at us — how embarrassing!", options: ["are staring", "is staring", "stares"], correctIndex: 0, explanation: "They → are + staring (drop the -e)." },
        { id: "e3q3", prompt: "I ___ the dishes. I'll call you back.", options: ["am washing", "washing", "is washing"], correctIndex: 0, explanation: "I → am + washing." },
        { id: "e3q4", prompt: "He ___ well today — I think he's tired.", options: ["is not working", "not working", "doesn't work"], correctIndex: 0, explanation: "Negative: He is not working / He isn't working." },
        { id: "e3q5", prompt: "___ you ___ anything tomorrow evening?", options: ["Are you doing", "Do you do", "Is you doing"], correctIndex: 0, explanation: "We can use present continuous for future plans. Are you doing = do you have plans?" },
        { id: "e3q6", prompt: "Look at the sky! It ___ darker every minute.", options: ["is getting", "gets", "getting"], correctIndex: 0, explanation: "Something happening right now, visibly changing → is getting." },
        { id: "e3q7", prompt: "We ___ for the bus — it's very late.", options: ["are still waiting", "still wait", "is still waiting"], correctIndex: 0, explanation: "We → are + waiting. 'Still' goes between are and the -ing verb." },
        { id: "e3q8", prompt: "She ___ Spanish this year at evening classes.", options: ["is learning", "are learning", "learns"], correctIndex: 0, explanation: "A temporary situation happening around now → is learning." },
        { id: "e3q9", prompt: "I ___ to music — I prefer silence when I work.", options: ["am not listening", "don't listen", "is not listening"], correctIndex: 0, explanation: "Negative: I am not listening / I'm not listening." },
        { id: "e3q10", prompt: "What ___ he ___ with my pen?!", options: ["is he doing", "does he do", "are he doing"], correctIndex: 0, explanation: "Question: What is he doing? = What is happening right now?" },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the correct present continuous form",
      instructions: "Write the correct present continuous form of the verb in brackets (positive or negative as shown).",
      questions: [
        { id: "e4q1", prompt: "She ___ (not/answer) her phone — maybe she's busy.", correct: "isn't answering", explanation: "Negative: She isn't answering / She is not answering." },
        { id: "e4q2", prompt: "We ___ (plan) a surprise party for Emma.", correct: "are planning", explanation: "plan → planning (CVC: double the n). We → are planning." },
        { id: "e4q3", prompt: "He ___ (sit) next to the window at the back.", correct: "is sitting", explanation: "sit → sitting (CVC: double the t). He → is sitting." },
        { id: "e4q4", prompt: "I ___ (not/feel) very well — I think I have a cold.", correct: "am not feeling", explanation: "Negative: I am not feeling / I'm not feeling." },
        { id: "e4q5", prompt: "They ___ (argue) again — I can hear them through the wall.", correct: "are arguing", explanation: "argue → arguing (drop the -e). They → are arguing." },
        { id: "e4q6", prompt: "The cat ___ (sleep) on my laptop keyboard again!", correct: "is sleeping", explanation: "sleep → sleeping. The cat → is sleeping." },
        { id: "e4q7", prompt: "She ___ (write) her thesis at the moment.", correct: "is writing", explanation: "write → writing (drop the -e). She → is writing." },
        { id: "e4q8", prompt: "Look — it ___ (snow)! This is the first snow this year!", correct: "is snowing", explanation: "It → is + snowing. Something happening right now." },
        { id: "e4q9", prompt: "I ___ (think) about your offer. Give me a few days.", correct: "am thinking", explanation: "Think → thinking. I → am thinking. ('Think' can be used in continuous when it means 'consider'.)" },
        { id: "e4q10", prompt: "Why ___ he ___ (smile) like that? What does he know?", correct: "is he smiling", explanation: "Question: Why is he smiling? (is + subject + verb-ing)" },
      ],
    },
  }), []);

  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

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
        if (mcqAnswers[q.id] === q.correctIndex) correct++;
      }
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
        title: "Present Continuous",
        subtitle: "am / is / are + verb-ing — 4 exercises + answer key",
        level: "A2",
        keyRule: "Subject + am/is/are + verb-ing. Actions happening right now or temporary situations around the present.",
        exercises: [
          {
            number: 1,
            title: "Exercise 1",
            difficulty: "Easy",
            instruction: "Choose the correct present continuous form.",
            questions: [
              "Look! The dog ___ in the garden. (is running / runs)",
              "We ___ to your message right now. (are listening / is listening)",
              "She ___ a nap on the sofa. (is having / are having)",
              "I can't talk — I ___ dinner. (am cooking / is cooking)",
              "They ___ a new school. (are building / is building)",
              "He ___ on his phone in class! (is playing / are playing)",
              "My sister ___ for her keys. (is looking / looking)",
              "Look at her — she ___! (is crying / are crying)",
              "We ___ a brilliant film right now. (are watching / watches)",
              "The children ___. Please be quiet. (are sleeping / is sleeping)",
            ],
          },
          {
            number: 2,
            title: "Exercise 2",
            difficulty: "Medium",
            instruction: "Write the correct -ing form of each verb.",
            questions: [
              "run → ___",
              "make → ___",
              "sit → ___",
              "study → ___",
              "swim → ___",
              "write → ___",
              "get → ___",
              "dance → ___",
              "put → ___",
              "begin → ___",
            ],
          },
          {
            number: 3,
            title: "Exercise 3",
            difficulty: "Harder",
            instruction: "Choose the correct present continuous form.",
            questions: [
              "___ she ___ to music right now? (Is she listening / Does she listen)",
              "They ___ at us — how embarrassing! (are staring / is staring)",
              "I ___ the dishes. I'll call you back. (am washing / is washing)",
              "He ___ well today — I think he's tired. (is not working / not working)",
              "___ you ___ anything tomorrow evening? (Are you doing / Do you do)",
              "Look at the sky! It ___ darker every minute. (is getting / gets)",
              "We ___ for the bus — it's very late. (are still waiting / still wait)",
              "She ___ Spanish this year at evening classes. (is learning / are learning)",
              "I ___ to music — I prefer silence when I work. (am not listening / don't listen)",
              "What ___ he ___ with my pen?! (is he doing / does he do)",
            ],
          },
          {
            number: 4,
            title: "Exercise 4",
            difficulty: "Hardest",
            instruction: "Write the correct present continuous form of the verb in brackets.",
            questions: [
              "She ___ (not/answer) her phone — maybe she's busy.",
              "We ___ (plan) a surprise party for Emma.",
              "He ___ (sit) next to the window at the back.",
              "I ___ (not/feel) very well — I think I have a cold.",
              "They ___ (argue) again — I can hear them through the wall.",
              "The cat ___ (sleep) on my laptop keyboard again!",
              "She ___ (write) her thesis at the moment.",
              "Look — it ___ (snow)! This is the first snow this year!",
              "I ___ (think) about your offer. Give me a few days.",
              "Why ___ he ___ (smile) like that? What does he know?",
            ],
          },
        ],
        answerKey: [
          {
            exercise: 1,
            subtitle: "Easy — choose the correct form",
            answers: ["is running", "are listening", "is having", "am cooking", "are building", "is playing", "is looking", "is crying", "are watching", "are sleeping"],
          },
          {
            exercise: 2,
            subtitle: "Medium — write the -ing form",
            answers: ["running", "making", "sitting", "studying", "swimming", "writing", "getting", "dancing", "putting", "beginning"],
          },
          {
            exercise: 3,
            subtitle: "Harder — complete the sentence",
            answers: ["Is she listening", "are staring", "am washing", "is not working", "Are you doing", "is getting", "are still waiting", "is learning", "am not listening", "is he doing"],
          },
          {
            exercise: 4,
            subtitle: "Hardest — write the full form",
            answers: ["isn't answering", "are planning", "is sitting", "am not feeling", "are arguing", "is sleeping", "is writing", "is snowing", "am thinking", "is he smiling"],
          },
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
        <span className="text-slate-700 font-medium">Present Continuous</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Present Continuous{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">am / is / are + -ing</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">
          A2
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use the present continuous to talk about <b>actions happening right now</b> or <b>temporary situations</b> around the present. The form is: <b>am / is / are + verb-ing</b>.
      </p>

      {/* Layout */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a2-present-continuous" subject="Present Continuous" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className="sticky top-24"><AdUnit variant="sidebar-dark" /></div>
        )}

        {/* Center */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          {/* Tabs */}
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
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
                                <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
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

                {/* Controls */}
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
          <SpeedRound gameId="grammar-a2-present-continuous" subject="Present Continuous" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      {/* Bottom navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">
          ← All A2 topics
        </a>
        <a href="/grammar/a2/going-to" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
          Next: Going to →
        </a>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) =>
        p.dim ? (
          <span key={i} className="text-slate-400 font-bold text-sm">+</span>
        ) : (
          <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${p.color ? colors[p.color] : colors.slate}`}>
            {p.text}
          </span>
        )
      )}
    </div>
  );
}

function Ex({ en, correct = true }: { en: string; correct?: boolean }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 ${correct ? "bg-white border border-black/8" : "bg-red-50 border border-red-100"}`}>
      <span className="text-sm shrink-0">{correct ? "✅" : "❌"}</span>
      <div className={`font-semibold text-sm ${correct ? "text-slate-900" : "text-red-700 line-through"}`}>{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Present Continuous</h2>
        <p className="text-slate-500 text-sm">Actions happening now or around now — am / is / are + verb-ing</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2">Affirmative (+)</div>
          <Formula parts={[{ text: "Subject", color: "sky" }, { dim: true, text: "+" }, { text: "am/is/are", color: "yellow" }, { dim: true, text: "+" }, { text: "verb-ing", color: "green" }]} />
          <div className="mt-2 text-xs italic text-slate-600">She is reading a book.</div>
        </div>
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4">
          <div className="text-xs font-black text-red-700 uppercase tracking-wide mb-2">Negative (−)</div>
          <Formula parts={[{ text: "Subject", color: "sky" }, { dim: true, text: "+" }, { text: "am/is/are", color: "yellow" }, { dim: true, text: "+" }, { text: "not", color: "red" }, { dim: true, text: "+" }, { text: "verb-ing", color: "green" }]} />
          <div className="mt-2 text-xs italic text-slate-600">They aren&apos;t watching TV.</div>
        </div>
        <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
          <div className="text-xs font-black text-sky-700 uppercase tracking-wide mb-2">Question (?)</div>
          <Formula parts={[{ text: "Am/Is/Are", color: "yellow" }, { dim: true, text: "+" }, { text: "Subject", color: "sky" }, { dim: true, text: "+" }, { text: "verb-ing", color: "green" }, { text: "?", color: "slate" }]} />
          <div className="mt-2 text-xs italic text-slate-600">Are you listening?</div>
        </div>
      </div>

      {/* Spelling rules */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black text-amber-800">!</span>
          <span className="text-sm font-bold text-slate-700">-ing spelling rules</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { rule: "Most verbs → add -ing", ex: "work → working, eat → eating" },
            { rule: "Ends in -e → drop e, add -ing", ex: "make → making, write → writing" },
            { rule: "Ends in -ie → change to -ying", ex: "lie → lying, die → dying" },
            { rule: "CVC (short vowel) → double + -ing", ex: "run → running, sit → sitting" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl border border-black/10 bg-slate-50 p-3">
              <div className="text-xs font-bold text-slate-800">{rule}</div>
              <div className="text-xs text-slate-500 italic mt-1">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage cards */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2">Now — right now</div>
          <div className="text-sm text-slate-700 space-y-1">
            <div className="italic">Look! It&apos;s raining.</div>
            <div className="italic">She is talking on the phone.</div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {["right now", "at this moment", "look!"].map(w => (
              <span key={w} className="rounded-lg bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-800">{w}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
          <div className="text-xs font-black text-sky-700 uppercase tracking-wide mb-2">Temporary / around now</div>
          <div className="text-sm text-slate-700 space-y-1">
            <div className="italic">He is living with his parents this year.</div>
            <div className="italic">I&apos;m studying for exams this week.</div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {["this week", "currently", "this month", "at the moment"].map(w => (
              <span key={w} className="rounded-lg bg-sky-100 border border-sky-200 px-2 py-0.5 text-xs font-bold text-sky-800">{w}</span>
            ))}
          </div>
        </div>
      </div>

      {/* am/is/are reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black text-amber-800">!</span>
          <span className="text-sm font-bold text-slate-700">am / is / are — quick reference</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-slate-50">
                <th className="px-3 py-2 text-left font-bold text-slate-600">Subject</th>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Auxiliary</th>
                <th className="px-3 py-2 text-left font-bold text-slate-600">Contraction</th>
                <th className="px-3 py-2 text-left font-bold text-slate-600">Negative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "am", "I'm", "I'm not"],
                ["he / she / it", "is", "he's / she's", "isn't"],
                ["you / we / they", "are", "you're / we're", "aren't"],
              ].map(([sub, aux, contr, neg]) => (
                <tr key={sub} className="bg-white even:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">{sub}</td>
                  <td className="px-3 py-2 font-black text-slate-900">{aux}</td>
                  <td className="px-3 py-2 text-slate-700 italic">{contr}</td>
                  <td className="px-3 py-2 text-red-700 italic">{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <div className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2">Examples</div>
        <Ex en="I am eating lunch." />
        <Ex en="I am eat lunch." correct={false} />
        <Ex en="She is making dinner." />
        <Ex en="She is makeing dinner." correct={false} />
      </div>

      {/* Amber tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Stative verbs NEVER take -ing!</span> Verbs that describe states, not actions, are not used in continuous form: <b>know, like, love, want, need, understand, believe, have</b> (possession). Say <b>I know</b>, not <i>I am knowing</i>.
      </div>
    </div>
  );
}
