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
  { q: "used to + ___", options: ["gerund (-ing)", "infinitive (base)", "past participle", "present tense"], answer: 1 },
  { q: "'I used to live in Rome.' Tense of 'used to'?", options: ["Present", "Future", "Past only", "Both present and past"], answer: 2 },
  { q: "Negative form of 'used to':", options: ["didn't used to", "didn't use to", "wasn't used to", "used not"], answer: 1 },
  { q: "Question form: '___ you use to play football?'", options: ["Was", "Were", "Did", "Do"], answer: 2 },
  { q: "used to = ___ past habit or state", options: ["a current", "a repeated / permanent", "a single", "a future"], answer: 1 },
  { q: "Which is CORRECT?", options: ["Did she used to smoke?", "Did she use to smoke?", "Was she used to smoke?", "Is she used to smoke?"], answer: 1 },
  { q: "Which is CORRECT?", options: ["He used to being shy.", "He used to be shy.", "He was used to be shy.", "He use to be shy."], answer: 1 },
  { q: "'___ your parents use to work abroad?'", options: ["Were", "Is", "Did", "Do"], answer: 2 },
  { q: "'I ___ like vegetables, but now I love them.'", options: ["didn't use to", "don't use to", "wasn't used to", "used to not"], answer: 0 },
  { q: "used to refers to:", options: ["Something still happening now", "Something in the past, no longer true", "Something about the future", "A general fact"], answer: 1 },
  { q: "Which is WRONG?", options: ["She used to be a dancer.", "They used to meet every week.", "He use to play tennis.", "We used to live near the sea."], answer: 2 },
  { q: "Correct negative: 'We ___ have a car.'", options: ["used to not have", "didn't use to have", "didn't used to have", "weren't used to have"], answer: 1 },
  { q: "'My grandfather ___ tell us stories.' Correct form:", options: ["use to", "was used to", "used to", "is used to"], answer: 2 },
  { q: "used to is only used in which tense?", options: ["Present", "Future", "Past", "All tenses"], answer: 2 },
  { q: "What does 'She used to live in Brazil' imply?", options: ["She lives there now.", "She doesn't live there now.", "She will live there.", "She has always lived there."], answer: 1 },
  { q: "'___ he use to work late?' (question form)", options: ["Was", "Is", "Did", "Has"], answer: 2 },
  { q: "used to vs. would: would CANNOT be used with ___", options: ["actions", "past habits", "states (be, have, like)", "routines"], answer: 2 },
  { q: "'I ___ play chess every day as a child.'", options: ["am used to", "used to", "is used to", "use to"], answer: 1 },
  { q: "Correct question: 'Did you use to ___ sport?'", options: ["played", "playing", "play", "plays"], answer: 2 },
  { q: "'We ___ not have a TV when I was young.'", options: ["use to", "used to", "are used to", "were used to"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "used to",
  subtitle: "used to + infinitive (past habits & states)",
  level: "B1",
  keyRule: "used to + infinitive = past habit or state no longer true. Negative: didn't use to. Question: Did … use to?",
  exercises: [
    {
      number: 1,
      title: "Choose the correct form",
      difficulty: "Easy",
      instruction: "Choose the correct form of used to.",
      questions: [
        "She ___ live in Paris. (used to / use to)",
        "They ___ play football on Saturdays.",
        "He ___ smoke, but he quit.",
        "___ you ___ walk to school?",
        "I ___ like vegetables. (negative)",
        "My grandfather ___ tell us stories.",
        "We ___ have a dog.",
        "She ___ be very shy.",
        "___ your parents ___ work abroad?",
        "He ___ be the best student.",
      ],
    },
    {
      number: 2,
      title: "Write the correct form",
      difficulty: "Medium",
      instruction: "Write used to, didn't use to, or did ... use to.",
      questions: [
        "My family (live) ___ in a village.",
        "I (not/eat) ___ fish, but I love it now.",
        "(your parents/work) ___ abroad?",
        "She (be) ___ a teacher before.",
        "We (not/have) ___ a car.",
        "He (spend) ___ summers at the beach.",
        "(you/walk) ___ to school?",
        "They (not/watch) ___ much TV.",
        "I (want) ___ be an actor.",
        "She (not/like) ___ coffee.",
      ],
    },
    {
      number: 3,
      title: "True or false? Correct the errors",
      difficulty: "Hard",
      instruction: "Correct the mistake if there is one.",
      questions: [
        "Did she used to live here?",
        "We used to be good friends.",
        "He didn't used to like sport.",
        "I use to work in London.",
        "Did you use to have a pet?",
        "They used to went to that school.",
        "She was used to be a nurse.",
        "We didn't use to eat out much.",
        "Do you used to play chess?",
        "He used to love skiing.",
      ],
    },
    {
      number: 4,
      title: "used to or past simple?",
      difficulty: "Harder",
      instruction: "Decide: use 'used to' or past simple.",
      questions: [
        "I ___ go to school by bus. (habit)",
        "She ___ call me yesterday. (once)",
        "We ___ live in a flat. (past state)",
        "He ___ break his leg last winter.",
        "They ___ meet every Sunday. (habit)",
        "I ___ visit Rome in 2019. (one trip)",
        "She ___ be very shy. (past state)",
        "He ___ buy a new laptop last week.",
        "We ___ go camping every summer.",
        "They ___ move to London in 2022.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "used to forms", answers: ["used to", "used to", "used to", "Did / use to", "didn't use to", "used to", "used to", "used to", "Did / use to", "used to"] },
    { exercise: 2, subtitle: "Write the form", answers: ["used to live", "didn't use to eat", "did your parents use to work", "used to be", "didn't use to have", "used to spend", "did you use to walk", "didn't use to watch", "used to want", "didn't use to like"] },
    { exercise: 3, subtitle: "Correct errors", answers: ["Did she use to live here?", "correct", "He didn't use to like sport.", "I used to work in London.", "correct", "They used to go to that school.", "She used to be a nurse.", "correct", "Did you use to play chess?", "correct"] },
    { exercise: 4, subtitle: "used to or past simple", answers: ["used to", "called", "used to", "broke", "used to", "visited", "used to", "bought", "used to", "moved"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Would (Past Habits)", href: "/grammar/b1/would-past-habits", level: "B1", badge: "bg-violet-500", reason: "The other way to express past habits" },
  { title: "Past Continuous", href: "/grammar/b1/past-continuous", level: "B1", badge: "bg-violet-500" },
  { title: "Past Perfect", href: "/grammar/b1/past-perfect", level: "B1", badge: "bg-violet-500" },
];

export default function UsedToLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct form",
      instructions: "Choose the correct form of 'used to' to complete each sentence.",
      questions: [
        { id: "e1q1", prompt: "She ___ live in Paris before she moved to London.", options: ["used to", "use to", "was used to"], correctIndex: 0, explanation: "Positive form: used to + infinitive." },
        { id: "e1q2", prompt: "They ___ play football every Saturday as kids.", options: ["use to", "used to", "are used to"], correctIndex: 1, explanation: "Past habit: used to play." },
        { id: "e1q3", prompt: "He ___ smoke, but he quit two years ago.", options: ["used to", "use to", "is used to"], correctIndex: 0, explanation: "Past state no longer true: used to smoke." },
        { id: "e1q4", prompt: "___ you ___ walk to school when you were young?", options: ["Did / use to", "Did / used to", "Were / used to"], correctIndex: 0, explanation: "Question form: Did + subject + use to (no -d)." },
        { id: "e1q5", prompt: "I ___ like vegetables, but now I love them.", options: ["didn't use to", "didn't used to", "wasn't used to"], correctIndex: 0, explanation: "Negative: didn't use to (no -d after did)." },
        { id: "e1q6", prompt: "My grandfather ___ tell us stories every night.", options: ["use to", "was used to", "used to"], correctIndex: 2, explanation: "Past habit: used to tell." },
        { id: "e1q7", prompt: "We ___ have a dog, but he died last year.", options: ["used to", "are used to", "use to"], correctIndex: 0, explanation: "Past state: used to have." },
        { id: "e1q8", prompt: "She ___ be very shy, but now she's very confident.", options: ["is used to", "used to", "uses to"], correctIndex: 1, explanation: "Past state no longer true: used to be." },
        { id: "e1q9", prompt: "___ your parents ___ work abroad?", options: ["Did / used to", "Did / use to", "Were / used to"], correctIndex: 1, explanation: "Question: Did + subject + use to (no -d in infinitive)." },
        { id: "e1q10", prompt: "He ___ be the best student in class.", options: ["use to", "used to", "is used to"], correctIndex: 1, explanation: "Past state: used to be." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct form",
      instructions: "Write the correct form of 'used to' (positive, negative, or question) using the verb in brackets.",
      questions: [
        { id: "e2q1", prompt: "My family (live) ___ in a small village.", correct: "used to live", explanation: "Positive: used to live." },
        { id: "e2q2", prompt: "I (not / eat) ___ fish, but I love it now.", correct: "didn't use to eat", explanation: "Negative: didn't use to eat." },
        { id: "e2q3", prompt: "(your parents / work) ___ abroad? [question]", correct: "did your parents use to work", explanation: "Question: Did your parents use to work?" },
        { id: "e2q4", prompt: "She (be) ___ a teacher before she became a doctor.", correct: "used to be", explanation: "Past state: used to be." },
        { id: "e2q5", prompt: "We (not / have) ___ a car when I was a child.", correct: "didn't use to have", explanation: "Negative: didn't use to have." },
        { id: "e2q6", prompt: "He (spend) ___ his summers at the beach.", correct: "used to spend", explanation: "Past habit: used to spend." },
        { id: "e2q7", prompt: "(you / watch) ___ cartoons as a child? [question]", correct: "did you use to watch", explanation: "Question: Did you use to watch?" },
        { id: "e2q8", prompt: "They (not / argue) ___ so much when they were younger.", correct: "didn't use to argue", explanation: "Negative: didn't use to argue." },
        { id: "e2q9", prompt: "She (have) ___ long hair when she was a teenager.", correct: "used to have", explanation: "Past state: used to have." },
        { id: "e2q10", prompt: "I (not / know) ___ how to cook, but now I'm quite good.", correct: "didn't use to know", explanation: "Negative past state: didn't use to know." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Used to or Past Simple?",
      instructions: "Choose the best option: 'used to' or Past Simple. Think about whether it's a habit/state or a single event.",
      questions: [
        { id: "e3q1", prompt: "We ___ to Rome in 2019 and stayed for a week.", options: ["used to go", "went"], correctIndex: 1, explanation: "Single completed event in the past → Past Simple: went." },
        { id: "e3q2", prompt: "She ___ have long hair when she was a teenager.", options: ["used to", "had"], correctIndex: 0, explanation: "Past state, no longer true → used to have." },
        { id: "e3q3", prompt: "I ___ my keys yesterday and couldn't get in.", options: ["used to lose", "lost"], correctIndex: 1, explanation: "Single event yesterday → Past Simple: lost." },
        { id: "e3q4", prompt: "They ___ spend every summer at their grandparents' farm.", options: ["used to", "spent"], correctIndex: 0, explanation: "Repeated past habit → used to spend." },
        { id: "e3q5", prompt: "He ___ the window and let some fresh air in.", options: ["used to open", "opened"], correctIndex: 1, explanation: "Single completed action → Past Simple: opened." },
        { id: "e3q6", prompt: "We ___ not have smartphones — life was very different.", options: ["used to", "did"], correctIndex: 0, explanation: "Past state no longer true → used to (not have)." },
        { id: "e3q7", prompt: "She ___ the exam last Monday.", options: ["used to pass", "passed"], correctIndex: 1, explanation: "Single event last Monday → Past Simple: passed." },
        { id: "e3q8", prompt: "I ___ love reading comics when I was little.", options: ["used to", "loved"], correctIndex: 0, explanation: "Past habit/state, implies contrast with now → used to love." },
        { id: "e3q9", prompt: "He ___ the company in 2010 and ran it for 15 years.", options: ["used to found", "founded"], correctIndex: 1, explanation: "Specific past event → Past Simple: founded." },
        { id: "e3q10", prompt: "They ___ have dinner together every Sunday.", options: ["used to", "had"], correctIndex: 0, explanation: "Repeated past habit → used to have." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Used to or Past Simple?",
      instructions: "Write 'used to' or Past Simple of the verb in brackets. The context hint tells you which to use.",
      questions: [
        { id: "e4q1", prompt: "I (visit) ___ my aunt every summer as a child. [habit]", correct: "used to visit", explanation: "Repeated habit: used to visit." },
        { id: "e4q2", prompt: "She (call) ___ me yesterday to say hello. [single event]", correct: "called", explanation: "Single past event: called." },
        { id: "e4q3", prompt: "He (not / like) ___ coffee, but now he drinks three cups a day. [past state]", correct: "didn't use to like", explanation: "Negative past state: didn't use to like." },
        { id: "e4q4", prompt: "They (move) ___ to Canada in 2015. [single event]", correct: "moved", explanation: "Single past event: moved." },
        { id: "e4q5", prompt: "We (play) ___ chess every evening after dinner. [habit]", correct: "used to play", explanation: "Repeated habit: used to play." },
        { id: "e4q6", prompt: "She (win) ___ the competition last year. [single event]", correct: "won", explanation: "Single past event: won." },
        { id: "e4q7", prompt: "I (not / know) ___ how to drive until I was 25. [past state]", correct: "didn't use to know", explanation: "Negative past state: didn't use to know." },
        { id: "e4q8", prompt: "He (buy) ___ a new car in March. [single event]", correct: "bought", explanation: "Single past event: bought." },
        { id: "e4q9", prompt: "My parents (argue) ___ a lot, but now they get on well. [habit, contrast with now]", correct: "used to argue", explanation: "Past habit with contrast to now: used to argue." },
        { id: "e4q10", prompt: "We (see) ___ a great film last Friday. [single event]", correct: "saw", explanation: "Single past event: saw." },
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
        <span className="text-slate-700 font-medium">Used to</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Used{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">to</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        We use <b>used to + infinitive</b> to talk about <b>past habits</b> and <b>past states</b> that are no longer true: <i>She <b>used to</b> live in Paris.</i> The negative is <b>didn&apos;t use to</b> and the question is <b>Did … use to</b>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-used-to" subject="Used To" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b1" allLabel="All B1 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b1-used-to" subject="Used To" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/would-past-habits" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Would — Past Habits →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">USED TO</h2>
        <p className="text-slate-500 text-sm">Past habits and states that no longer happen</p>
      </div>

      {/* 3 gradient cards for formula */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-3">Affirmative (+)</div>
          <Formula parts={[{ text: "subject" }, { text: "+", dim: true }, { text: "used to", color: "green" }, { text: "+", dim: true }, { text: "infinitive", color: "sky" }]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>She used to live in Paris.</div>
            <div>They used to play every day.</div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-red-600 mb-3">Negative (−)</div>
          <Formula parts={[{ text: "subject" }, { text: "+", dim: true }, { text: "didn't", color: "red" }, { text: "+", dim: true }, { text: "use to", color: "green" }, { text: "+", dim: true }, { text: "infinitive", color: "sky" }]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>I didn&apos;t use to like fish.</div>
            <div>She didn&apos;t use to smoke.</div>
          </div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-3">Question (?)</div>
          <Formula parts={[{ text: "Did", color: "yellow" }, { text: "+", dim: true }, { text: "subject" }, { text: "+", dim: true }, { text: "use to", color: "green" }, { text: "+", dim: true }, { text: "infinitive", color: "sky" }]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>Did you use to live here?</div>
            <div>Did they use to play?</div>
          </div>
        </div>
      </div>

      {/* 2-col usage cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-2">Past Habits</div>
          <div className="text-sm text-slate-700">Actions done regularly in the past that no longer happen.</div>
          <div className="mt-2 italic text-slate-600 text-sm">I used to play tennis every weekend. (I don&apos;t anymore)</div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-2">Past States</div>
          <div className="text-sm text-slate-700">Situations or conditions that were true in the past but are no longer true now.</div>
          <div className="mt-2 italic text-slate-600 text-sm">She used to be very shy. (She isn&apos;t now)</div>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-violet-600 mb-2">Contrast with Present</div>
          <div className="text-sm text-slate-700">Often implies things are different now — great for storytelling.</div>
          <div className="mt-2 italic text-slate-600 text-sm">I didn&apos;t use to like coffee, but now I love it.</div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-amber-600 mb-2">Used to vs Past Simple</div>
          <div className="text-sm text-slate-700">Used to = repeated habit/state. Past Simple = one completed event.</div>
          <div className="mt-2 italic text-slate-600 text-sm">We visited them in 2019. (once) vs We used to visit every summer. (habit)</div>
        </div>
      </div>

      {/* Quick reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black">!</span>
          <span className="font-black text-slate-900 text-sm">USED TO — FORMS AT A GLANCE</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Form</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">Structure</th>
                <th className="text-left py-2 font-black text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2 pr-4 text-slate-600 font-semibold">Positive</td>
                <td className="py-2 pr-4 text-slate-600">subject + used to + inf</td>
                <td className="py-2 text-slate-600 italic">He used to walk to school.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-slate-600 font-semibold">Negative</td>
                <td className="py-2 pr-4 text-slate-600">subject + didn&apos;t use to + inf</td>
                <td className="py-2 text-slate-600 italic">I didn&apos;t use to like it.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-slate-600 font-semibold">Question</td>
                <td className="py-2 pr-4 text-slate-600">Did + subject + use to + inf</td>
                <td className="py-2 text-slate-600 italic">Did she use to work here?</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-slate-600 font-semibold">Short answer</td>
                <td className="py-2 pr-4 text-slate-600">Yes, I did. / No, I didn&apos;t.</td>
                <td className="py-2 text-slate-600 italic">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Common Time Markers</div>
        <div className="flex flex-wrap gap-2">
          {["when I was young", "as a child", "in those days", "back then", "years ago", "before", "once"].map((w) => (
            <span key={w} className="rounded-lg border border-sky-200 bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800">{w}</span>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Common Mistake</div>
        <Ex en="Did she used to live here?" correct={false} />
        <Ex en="Did she use to live here?" correct={true} />
        <Ex en="She didn't used to like fish." correct={false} />
        <Ex en="She didn't use to like fish." correct={true} />
      </div>

      {/* Amber tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Key tip:</span> After <em>did</em>, always write <em>use to</em> (no -d). The -d only appears in the affirmative: <em>used to</em>.
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
