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

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Causative structure is?", options: ["have + object + pp", "have + pp + object", "get + verb + object", "object + have + pp"], answer: 0 },
  { q: "'I had my hair cut' means?", options: ["I cut my hair", "Someone cut my hair", "I will cut my hair", "My hair was long"], answer: 1 },
  { q: "Which is correct causative?", options: ["I had cut my car", "I had my car cut", "I cut had my car", "My car had cut"], answer: 1 },
  { q: "Get causative is more?", options: ["Formal", "Informal/colloquial", "Old-fashioned", "Incorrect"], answer: 1 },
  { q: "'She had her bag stolen' means?", options: ["She arranged it", "It happened to her", "She stole her bag", "She lost her bag"], answer: 1 },
  { q: "Which shows involuntary causative?", options: ["I had my hair cut", "He had his car stolen", "She got it painted", "They had it fixed"], answer: 1 },
  { q: "Correct causative question form?", options: ["Did you have fixed it?", "Did you have it fixed?", "Have you fixed it had?", "You had it fixed?"], answer: 1 },
  { q: "Present perfect causative of 'test eyes'?", options: ["had my eyes tested", "have had my eyes tested", "have my eyes tested", "got tested my eyes"], answer: 1 },
  { q: "Modal causative: you should ___?", options: ["have your brakes check", "have your brakes checked", "get checked your brakes", "your brakes checked"], answer: 1 },
  { q: "Object position in causative is?", options: ["After past participle", "Before past participle", "Before have/get", "At the end"], answer: 1 },
  { q: "Which is WRONG causative?", options: ["I had my car repaired", "I got my car fixed", "I had repaired my car", "She had it done"], answer: 2 },
  { q: "Future causative with 'will'?", options: ["will had it fixed", "will have it fixed", "will get fixed it", "will have fixed it"], answer: 1 },
  { q: "Past simple causative?", options: ["had it fixed", "have it fixed", "got fixed it", "had it fix"], answer: 0 },
  { q: "Both have/get are used for?", options: ["Formal writing", "Questions only", "Involuntary causative", "Future only"], answer: 2 },
  { q: "'Getting it done' tone is?", options: ["Very formal", "Neutral", "Implies effort/active", "Old-fashioned"], answer: 2 },
  { q: "Going to causative: she's going to ___?", options: ["have her hair cut", "cut have her hair", "her hair have cut", "had her hair cut"], answer: 0 },
  { q: "Present continuous causative?", options: ["is having it fixed", "is had it fixed", "is getting fixed it", "has it being fixed"], answer: 0 },
  { q: "'He got his wallet stolen' = ___?", options: ["He arranged it", "Something bad happened", "He lost it himself", "He stole a wallet"], answer: 1 },
  { q: "Which changes tense in causative?", options: ["have/get", "the object", "the past participle", "nothing"], answer: 0 },
  { q: "Past perfect causative?", options: ["had already had it sent", "had been had it sent", "had it had sent", "had have it sent"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Causative: have / get",
  subtitle: "have/get + object + past participle",
  level: "B2",
  keyRule: "have/get + object + past participle = arranged for someone else to do it.",
  exercises: [
    {
      number: 1,
      title: "Choose the correct causative",
      difficulty: "easy" as const,
      instruction: "Pick the correct causative form.",
      questions: [
        "I ___ it cut at the salon.",
        "She ___ her car serviced often.",
        "We're ___ the house painted.",
        "He needs to ___ teeth checked.",
        "Did you ___ your photo taken?",
        "They ___ their roof repaired.",
        "I must ___ this suit dry-cleaned.",
        "She ___ her nails done weekly.",
        "Where do you ___ eyes tested?",
        "They ___ a new kitchen fitted.",
      ],
    },
    {
      number: 2,
      title: "Write the causative form",
      difficulty: "medium" as const,
      instruction: "Rewrite using have/get causative.",
      questions: [
        "Plumber fixed boiler. (We/have/past):",
        "Photographer takes portrait. (She/have/pres cont):",
        "Dentist will check teeth. (He/get/future):",
        "Someone repaired phone. (I/get/past):",
        "Stylist cuts her hair. (She/have/going to):",
        "Decorator painted flat. (They/have/pres perf):",
        "Vet vaccinated dog. (We/get/past):",
        "Tailor makes suit. (He/have/pres cont):",
        "Mechanic should check brakes. (should/have):",
        "Electrician installed lights. (She/have/past):",
      ],
    },
    {
      number: 3,
      title: "have vs get + negatives",
      difficulty: "hard" as const,
      instruction: "Choose the best option.",
      questions: [
        "She ___ her bag stolen on tube.",
        "Did you ___ laptop fixed?",
        "I haven't ___ eyes tested in yrs.",
        "He ___ wallet stolen on holiday.",
        "___ you ___ docs translated?",
        "She prefers to ___ reports checked.",
        "We ___ windows cleaned at last.",
        "I need to ___ this tooth ___ out.",
        "They ___ house broken into twice.",
        "Why not ___ the leak fixed?",
      ],
    },
    {
      number: 4,
      title: "All tenses + involuntary",
      difficulty: "hard" as const,
      instruction: "Write the correct causative form.",
      questions: [
        "Thieves stole car. (involuntary/have):",
        "Tech installs alarm. (We/have/going to):",
        "By move-in cleaner done. (have/Fut Perf):",
        "Someone hacked email. (he/have/pres perf):",
        "Tailor altered dress. (She/get/past):",
        "He had parcel sent. (have/past perf):",
        "Check gas pipes. (We/should/get):",
        "Expert appraised paintings. (They/have/past):",
        "Someone broke into office. (he/get):",
        "Surgeon operates on knee. (She/have/future):",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Causative forms", answers: ["have it cut", "gets her car serviced", "having the house painted", "have his teeth checked", "have your passport photo taken", "got their roof repaired", "get this suit dry-cleaned", "has her nails done", "get your eyes tested", "had a new kitchen fitted"] },
    { exercise: 2, subtitle: "Rewritten causatives", answers: ["had our boiler fixed", "is having her portrait taken", "will get his teeth checked", "got my phone repaired", "is going to have her hair cut", "have had their flat painted", "got our dog vaccinated", "is having his suit made", "have your brakes checked", "had the new lights installed"] },
    { exercise: 3, subtitle: "have vs get", answers: ["had/got (both)", "have your laptop fixed", "had my eyes tested", "had/got (both)", "Have / had", "get her reports proofread", "had our windows cleaned", "have / pulled", "had/got (both)", "have the leak fixed"] },
    { exercise: 4, subtitle: "All tenses", answers: ["had her car stolen", "are going to have our alarm installed", "will have had the flat cleaned", "has had his email account hacked", "got her dress altered", "had already had the parcel sent", "get the gas pipes checked", "had their paintings appraised", "got his office broken into", "will have her knee operated on"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Advanced Passive", href: "/grammar/b2/passive-advanced", level: "B2", badge: "bg-orange-500", reason: "Causative builds directly on advanced passive structures" },
  { title: "Gerunds & Infinitives", href: "/grammar/b2/gerunds-infinitives", level: "B2", badge: "bg-orange-500", reason: "Have/get + object + infinitive patterns" },
  { title: "Reported Speech Advanced", href: "/grammar/b2/reported-speech-advanced", level: "B2", badge: "bg-orange-500" },
];

export default function CausativeLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct causative form",
      instructions: "Choose the correct causative structure: have/get + object + past participle.",
      questions: [
        { id: "e1q1", prompt: "I don't cut my own hair — I ___ it at the salon.", options: ["have cut", "have it cut", "cut it"], correctIndex: 1, explanation: "have it cut = have + object + past participle (causative)." },
        { id: "e1q2", prompt: "She ___ her car serviced every six months.", options: ["gets", "gets her car service", "gets her car serviced"], correctIndex: 2, explanation: "gets her car serviced = get + object + past participle." },
        { id: "e1q3", prompt: "We're ___ the house painted next week.", options: ["having", "getting", "having the house paint"], correctIndex: 0, explanation: "having the house painted = have + object + pp (arrangement in progress)." },
        { id: "e1q4", prompt: "He needs to ___ his teeth checked.", options: ["have his teeth check", "have his teeth checked", "get checked his teeth"], correctIndex: 1, explanation: "have his teeth checked = have + object + pp." },
        { id: "e1q5", prompt: "Did you ___ your passport photo taken here?", options: ["have", "get", "get your"], correctIndex: 0, explanation: "Did you have your passport photo taken? = causative question." },
        { id: "e1q6", prompt: "They ___ their roof repaired after the storm.", options: ["got their roof repaired", "got repaired their roof", "had repaired the roof"], correctIndex: 0, explanation: "got their roof repaired = get + object + pp." },
        { id: "e1q7", prompt: "I must ___ this suit dry-cleaned before the wedding.", options: ["have dry-cleaned this suit", "get this suit dry-cleaned", "get this suit dry-clean"], correctIndex: 1, explanation: "get this suit dry-cleaned = get + object + pp." },
        { id: "e1q8", prompt: "She ___ her nails done every Friday.", options: ["has", "has her nails done", "has done her nails"], correctIndex: 1, explanation: "has her nails done = have + object + pp (regular arrangement)." },
        { id: "e1q9", prompt: "Where do you usually ___ your eyes tested?", options: ["get your eyes test", "get your eyes tested", "have test your eyes"], correctIndex: 1, explanation: "get your eyes tested = get + object + pp." },
        { id: "e1q10", prompt: "They ___ a new kitchen fitted last month.", options: ["had a new kitchen fitted", "had fitted a new kitchen", "got fitted a new kitchen"], correctIndex: 0, explanation: "had a new kitchen fitted = have + object + pp (past arrangement)." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the causative form",
      instructions: "Rewrite each sentence using the causative (have/get + object + past participle). Use the tense and verb given.",
      questions: [
        { id: "e2q1", prompt: "A plumber fixed our boiler. (We / have / Past Simple): We ___.", correct: "had our boiler fixed", explanation: "had our boiler fixed = have + object + pp (past)." },
        { id: "e2q2", prompt: "A photographer is taking her portrait. (She / have / Present Continuous): She ___.", correct: "is having her portrait taken", explanation: "is having her portrait taken = present continuous causative." },
        { id: "e2q3", prompt: "The dentist will check his teeth next week. (He / get / Future): He ___.", correct: "will get his teeth checked", explanation: "will get his teeth checked = future causative with get." },
        { id: "e2q4", prompt: "Someone repaired my phone. (I / get / Past Simple): I ___.", correct: "got my phone repaired", explanation: "got my phone repaired = get + object + pp (past)." },
        { id: "e2q5", prompt: "A stylist is going to cut her hair. (She / have / going to): She ___.", correct: "is going to have her hair cut", explanation: "is going to have her hair cut = going to causative." },
        { id: "e2q6", prompt: "A decorator has painted their flat. (They / have / Present Perfect): They ___.", correct: "have had their flat painted", explanation: "have had their flat painted = present perfect causative." },
        { id: "e2q7", prompt: "The vet vaccinated our dog. (We / get / Past Simple): We ___.", correct: "got our dog vaccinated", explanation: "got our dog vaccinated = get + object + pp (past)." },
        { id: "e2q8", prompt: "A tailor is making his suit. (He / have / Present Continuous): He ___.", correct: "is having his suit made", explanation: "is having his suit made = present continuous causative." },
        { id: "e2q9", prompt: "A mechanic should check your brakes. (You / should / have): You should ___.", correct: "have your brakes checked", explanation: "have your brakes checked = modal + causative." },
        { id: "e2q10", prompt: "An electrician installed the new lights. (She / have / Past Simple): She ___.", correct: "had the new lights installed", explanation: "had the new lights installed = have + object + pp (past)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — have vs get, and negative/question forms",
      instructions: "Choose the correct option. Focus on have vs get, negatives, questions, and when the causative implies something bad happened.",
      questions: [
        { id: "e3q1", prompt: "She ___ her bag stolen on the underground.", options: ["had", "got", "both are correct"], correctIndex: 2, explanation: "Both had and got work here — when something bad happens TO you (involuntary causative)." },
        { id: "e3q2", prompt: "Did you ___ your laptop fixed in the end?", options: ["have your laptop fixed", "get your laptop fix", "get fixed your laptop"], correctIndex: 0, explanation: "Did you have your laptop fixed = question form of causative." },
        { id: "e3q3", prompt: "I haven't ___ my eyes tested for years. I really should.", options: ["had my eyes tested", "got tested my eyes", "had tested my eyes"], correctIndex: 0, explanation: "haven't had my eyes tested = present perfect negative causative." },
        { id: "e3q4", prompt: "He ___ his wallet stolen while he was on holiday.", options: ["had", "got", "both are correct"], correctIndex: 2, explanation: "Both are correct — involuntary causative (something bad happened to him)." },
        { id: "e3q5", prompt: "___ you ___ your documents translated by a professional?", options: ["Have / had", "Did / get", "Have / got"], correctIndex: 0, explanation: "Have you had your documents translated? = present perfect causative question." },
        { id: "e3q6", prompt: "She prefers to ___ her reports proofread before submission.", options: ["get her reports proofread", "get proofread her reports", "have proofread her reports"], correctIndex: 0, explanation: "get her reports proofread = get + object + pp (preferred for more informal/active tone)." },
        { id: "e3q7", prompt: "We ___ our windows cleaned — they were filthy.", options: ["finally had our windows cleaned", "finally had cleaned our windows", "finally got cleaned our windows"], correctIndex: 0, explanation: "had our windows cleaned = have + object + pp. Object must come before the pp." },
        { id: "e3q8", prompt: "I need to ___ this tooth ___ out.", options: ["have / pulled", "get / pull", "have / pulling"], correctIndex: 0, explanation: "have this tooth pulled out = have + object + pp." },
        { id: "e3q9", prompt: "They ___ their house broken into twice last year.", options: ["had", "got", "both are correct"], correctIndex: 2, explanation: "Both had and got are correct for involuntary causative (bad event)." },
        { id: "e3q10", prompt: "Why don't you ___ the leak fixed before winter?", options: ["have the leak fixed", "get fixed the leak", "have fixed the leak"], correctIndex: 0, explanation: "have the leak fixed = have + object + pp. Object always before pp." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — All tenses + involuntary causative",
      instructions: "Write the correct causative form. Pay attention to tense and whether it is voluntary (arranged) or involuntary (something bad happened).",
      questions: [
        { id: "e4q1", prompt: "Thieves stole her car. (involuntary — she / have): She ___.", correct: "had her car stolen", explanation: "had her car stolen = involuntary causative (bad event happened to her)." },
        { id: "e4q2", prompt: "A technician is going to install our new alarm. (We / have / going to): We ___.", correct: "are going to have our alarm installed", explanation: "are going to have our alarm installed = going to causative." },
        { id: "e4q3", prompt: "By the time we move in, a cleaner will have cleaned the flat. (We / have / Future Perfect): We ___.", correct: "will have had the flat cleaned", explanation: "will have had the flat cleaned = Future Perfect causative." },
        { id: "e4q4", prompt: "Someone has hacked his email account. (involuntary — he / have): He ___.", correct: "has had his email account hacked", explanation: "has had his email account hacked = Present Perfect involuntary causative." },
        { id: "e4q5", prompt: "A tailor altered her dress before the party. (She / get / Past Simple): She ___.", correct: "got her dress altered", explanation: "got her dress altered = get + object + pp (past)." },
        { id: "e4q6", prompt: "He had already sent the parcel before I asked. (reword with causative — he / have / Past Perfect): He ___.", correct: "had already had the parcel sent", explanation: "had already had the parcel sent = Past Perfect causative." },
        { id: "e4q7", prompt: "We should ask someone to check the gas pipes. (We / should / get): We should ___.", correct: "get the gas pipes checked", explanation: "get the gas pipes checked = modal + get causative." },
        { id: "e4q8", prompt: "An expert appraised their paintings. (They / have / Past Simple): They ___.", correct: "had their paintings appraised", explanation: "had their paintings appraised = have + object + pp (past)." },
        { id: "e4q9", prompt: "Someone broke into his office. (involuntary — he / get): He ___.", correct: "got his office broken into", explanation: "got his office broken into = get causative for bad/involuntary event." },
        { id: "e4q10", prompt: "A surgeon will operate on her knee next month. (She / have / Future): She ___.", correct: "will have her knee operated on", explanation: "will have her knee operated on = future causative with prepositional verb." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Causative: have / get</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Causative:{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">have / get</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The causative uses <b>have / get + object + past participle</b> to say that you arranged for someone else to do something: <i>I <b>had my hair cut</b>.</i> It can also describe something bad that happened to you: <i>She <b>had her bag stolen</b>.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-causative" subject="Causative have/get" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b2" allLabel="All B2 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b2-causative" subject="Causative have/get" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/third-conditional" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Third Conditional →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">CAUSATIVE HAVE / GET</h2>
        <p className="text-slate-500 text-sm">Arrange for someone else to do something — or describe something bad that happened to you.</p>
      </div>

      {/* 3 gradient cards for formula */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-3">Affirmative (+)</div>
          <Formula parts={[
            { text: "have / get", color: "green" },
            { text: "+", dim: true },
            { text: "object", color: "sky" },
            { text: "+", dim: true },
            { text: "past participle", color: "yellow" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>I had my hair cut.</div>
            <div>She gets her car serviced.</div>
          </div>
        </div>
        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-red-600 mb-3">Negative (−)</div>
          <Formula parts={[
            { text: "didn't have", color: "red" },
            { text: "+", dim: true },
            { text: "object", color: "sky" },
            { text: "+", dim: true },
            { text: "past participle", color: "yellow" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>I didn&apos;t have my car fixed.</div>
            <div>We didn&apos;t get it done.</div>
          </div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-3">Question (?)</div>
          <Formula parts={[
            { text: "Did you have", color: "sky" },
            { text: "+", dim: true },
            { text: "object", color: "violet" },
            { text: "+", dim: true },
            { text: "past participle", color: "yellow" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>Did you have it repaired?</div>
            <div>Where do you get your hair cut?</div>
          </div>
        </div>
      </div>

      {/* 2-col usage cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-700 mb-2">have something done</div>
          <p className="text-sm text-slate-600 mb-2">More formal. Common in writing and professional contexts.</p>
          <div className="italic text-sm text-slate-700">I had my windows cleaned.</div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-700 mb-2">get something done</div>
          <p className="text-sm text-slate-600 mb-2">More informal / colloquial. Implies making an effort to arrange it.</p>
          <div className="italic text-sm text-slate-700">I got my windows cleaned.</div>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-violet-700 mb-2">Involuntary causative</div>
          <p className="text-sm text-slate-600 mb-2">Both <b>have</b> and <b>get</b> describe something bad that happened to you (not arranged).</p>
          <div className="italic text-sm text-slate-700">She had her bag stolen. / He got his car broken into.</div>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-orange-700 mb-2">Works in all tenses</div>
          <p className="text-sm text-slate-600 mb-2">The have / get + object + pp structure works in any tense.</p>
          <div className="italic text-sm text-slate-700">She&apos;s going to have her hair dyed. / You should get your brakes checked.</div>
        </div>
      </div>

      {/* Quick reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black">!</span>
          <span className="font-black text-slate-900 text-sm">TENSE EXAMPLES</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-2 pr-4 text-left font-black text-slate-700">Tense</th>
                <th className="py-2 text-left font-black text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Present Simple", "She has her nails done every week."],
                ["Past Simple", "We had the roof repaired last month."],
                ["Present Perfect", "I've had my passport renewed."],
                ["Future (will)", "They will have the venue decorated."],
                ["Going to", "She's going to get her hair dyed."],
                ["Modal", "You should get your brakes checked."],
              ].map(([tense, ex]) => (
                <tr key={tense}>
                  <td className="py-2 pr-4 font-bold text-slate-700 whitespace-nowrap">{tense}</td>
                  <td className="py-2 italic text-slate-600">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key words */}
      <div>
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Key Words</div>
        <div className="flex flex-wrap gap-2">
          {["have done", "get done", "object + pp", "arranged", "involuntary", "by someone else"].map((w) => (
            <span key={w} className="rounded-lg border border-sky-200 bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800">{w}</span>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Common Mistake</div>
        <Ex en="I had repaired my car." correct={false} />
        <Ex en="I had my car repaired." correct={true} />
      </div>

      {/* Amber tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Key tip:</span> The object always comes <strong>before</strong> the past participle. &ldquo;Had repaired my car&rdquo; means you repaired it yourself — not causative!
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
