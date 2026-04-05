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
  { title: "Inverted Conditionals", href: "/grammar/c1/inverted-conditionals", level: "C1", badge: "bg-sky-600", reason: "Both express hypothetical and non-factual conditions" },
  { title: "Advanced Modals", href: "/grammar/c1/advanced-modals", level: "C1", badge: "bg-sky-600" },
  { title: "Hedging Language", href: "/grammar/c1/hedging-language", level: "C1", badge: "bg-sky-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "The mandative subjunctive uses:", options: ["Bare infinitive (all persons)", "Past tense", "Present + -s", "Would + inf"], answer: 0 },
  { q: "They insisted he ___ present.", options: ["be", "was", "is", "were"], answer: 0 },
  { q: "She recommended he ___ the post.", options: ["apply for", "applies for", "applied for", "applying for"], answer: 0 },
  { q: "It is essential that she ___ early.", options: ["leave", "leaves", "left", "leaving"], answer: 0 },
  { q: "Were subjunctive uses:", options: ["Were (all persons)", "Was for 1st/3rd", "Depending on person", "Would + were"], answer: 0 },
  { q: "If I ___ you, I'd apologise.", options: ["were", "was", "am", "be"], answer: 0 },
  { q: "As if he ___ the boss. (not true)", options: ["were", "was", "is", "be"], answer: 0 },
  { q: "I wish I ___ taller.", options: ["were", "was", "am", "be"], answer: 0 },
  { q: "Mandative after 'suggest' + that:", options: ["bare inf", "past simple", "present simple", "would + inf"], answer: 0 },
  { q: "It is vital that they ___ informed.", options: ["be", "are", "were", "being"], answer: 0 },
  { q: "The committee proposed he ___ .", options: ["resign", "resigns", "resigned", "resigning"], answer: 0 },
  { q: "She acted as though she ___ tired.", options: ["were", "was", "is", "be"], answer: 0 },
  { q: "I demanded that he ___ us.", options: ["join", "joins", "joined", "joining"], answer: 0 },
  { q: "Mandative subjunctive is common in:", options: ["American English", "British spoken", "Informal texts", "Commands only"], answer: 0 },
  { q: "He looked as if he ___ a ghost.", options: ["had seen", "has seen", "saw", "sees"], answer: 0 },
  { q: "It's important that she ___ on time.", options: ["arrive", "arrives", "arrived", "arriving"], answer: 0 },
  { q: "Were it not for her, ___ .", options: ["we'd have failed", "we fail", "we'd fail", "we failing"], answer: 0 },
  { q: "The suggestion that he ___ removed.", options: ["be", "is", "was", "were"], answer: 0 },
  { q: "I wish she ___ here now.", options: ["were", "was", "is", "be"], answer: 0 },
  { q: "It is crucial that they ___ told.", options: ["be", "are", "were", "being"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Subjunctive",
  subtitle: "Mandative and were-subjunctive in formal English",
  level: "C1",
  keyRule: "Mandative uses bare inf; were-subjunctive for hypotheticals.",
  exercises: [
    {
      number: 1,
      title: "Mandative Subjunctive",
      difficulty: "Easy",
      instruction: "Choose the correct mandative subjunctive form.",
      questions: [
        "They insisted he ___ present.",
        "It's vital that she ___ early.",
        "The board required he ___ report.",
        "She recommended he ___ the post.",
        "It is essential that they ___ told.",
        "The proposal that he ___ removed.",
        "I demand that he ___ the meeting.",
        "It is crucial they ___ informed.",
        "She suggested the plan ___ changed.",
        "They proposed she ___ the committee.",
      ],
      hint: "be / leave / submit / apply for",
    },
    {
      number: 2,
      title: "Were-Subjunctive",
      difficulty: "Medium",
      instruction: "Choose the correct were-subjunctive form.",
      questions: [
        "If I ___ you, I'd apologise.",
        "As if he ___ the boss.",
        "I wish I ___ taller.",
        "She acted as though ___ tired.",
        "If she ___ here, she'd help.",
        "He talked as if he ___ an expert.",
        "I wish she ___ here now.",
        "Were it not for help, ___ failed.",
        "If he ___ more careful, no problem.",
        "She acts as though nothing ___.",
      ],
      hint: "were (all persons for hypotheticals)",
    },
    {
      number: 3,
      title: "Mixed Subjunctive Practice",
      difficulty: "Hard",
      instruction: "Choose subjunctive or indicative.",
      questions: [
        "It's important she ___ the truth.",
        "They insisted it ___ done today.",
        "I wish he ___ more reliable.",
        "The fact that she ___ right is clear.",
        "It was proposed the fee ___ waived.",
        "She spoke as if she ___ in charge.",
        "We demand that access ___ granted.",
        "He acts as if he ___ never wrong.",
        "It's vital the report ___ accurate.",
        "I wish they ___ here to see this.",
      ],
      hint: "tell / be / were / is / were waived",
    },
    {
      number: 4,
      title: "Rewrite Using Subjunctive",
      difficulty: "Very Hard",
      instruction: "Rewrite using the subjunctive mood.",
      questions: [
        "They said he must be there.",
        "She wants to be taller.",
        "He acts as though he's the boss.",
        "They required him to resign.",
        "I want her to attend the meeting.",
        "The committee said he must leave.",
        "She looked like she had seen ghost.",
        "They proposed his removal.",
        "I think she should be promoted.",
        "If only he was more careful.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Mandative Subjunctive", answers: ["be", "leave", "submit", "apply for", "be", "be", "attend", "be", "be", "chair"] },
    { exercise: 2, subtitle: "Were-Subjunctive", answers: ["were", "were", "were", "were", "were", "were", "were", "we'd have", "were", "had happened"] },
    { exercise: 3, subtitle: "Mixed Subjunctive Practice", answers: ["tell", "be", "were", "is", "be waived", "were", "be granted", "were", "be", "were"] },
    { exercise: 4, subtitle: "Rewrite Using Subjunctive", answers: ["They insisted that he be there.", "I wish I were taller.", "He acts as if he were the boss.", "They required that he resign.", "I insist that she attend the meeting.", "The committee demanded that he leave.", "She looked as if she had seen a ghost.", "They proposed that he be removed.", "I suggest she be promoted.", "If only he were more careful."] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function SubjunctiveLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Mandative subjunctive: bare infinitive in that-clauses",
      instructions: "After verbs like suggest, recommend, insist, demand, require, propose — and adjectives like essential, vital, important, necessary — a formal that-clause uses the bare infinitive (no -s, no was/were, same for all persons).",
      questions: [
        { id: "e1q1", prompt: "The doctor suggested that she ___ more rest.", options: ["gets", "get", "got"], correctIndex: 1, explanation: "Mandative subjunctive: suggest + that + bare infinitive. 'get', not 'gets'." },
        { id: "e1q2", prompt: "It is essential that every delegate ___ the opening session.", options: ["attends", "attend", "attended"], correctIndex: 1, explanation: "essential that + bare infinitive: 'attend', not 'attends'." },
        { id: "e1q3", prompt: "The committee insisted that the report ___ revised.", options: ["is", "was", "be"], correctIndex: 2, explanation: "Mandative subjunctive (passive): that + subject + be + pp. 'be revised'." },
        { id: "e1q4", prompt: "I recommend that he ___ legal advice before signing.", options: ["seeks", "seek", "should seek"], correctIndex: 1, explanation: "Formal subjunctive: recommend + that + bare infinitive. 'seek', not 'seeks'." },
        { id: "e1q5", prompt: "It is vital that the package ___ delivered by noon.", options: ["is", "be", "was"], correctIndex: 1, explanation: "vital that + bare infinitive (passive): 'be delivered'." },
        { id: "e1q6", prompt: "The judge demanded that the witness ___ the truth.", options: ["tells", "tell", "told"], correctIndex: 1, explanation: "demand + that + bare infinitive: 'tell'." },
        { id: "e1q7", prompt: "They proposed that a new committee ___ formed.", options: ["is", "was", "be"], correctIndex: 2, explanation: "propose + that + bare infinitive (passive): 'be formed'." },
        { id: "e1q8", prompt: "It is important that no one ___ the findings prematurely.", options: ["publishes", "publish", "published"], correctIndex: 1, explanation: "important that + bare infinitive: 'publish'." },
        { id: "e1q9", prompt: "She requested that all applications ___ submitted online.", options: ["are", "be", "were"], correctIndex: 1, explanation: "request + that + bare infinitive (passive): 'be submitted'." },
        { id: "e1q10", prompt: "The manager required that each employee ___ a full report.", options: ["submits", "submit", "submitted"], correctIndex: 1, explanation: "require + that + bare infinitive: 'submit'." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Were-subjunctive and if I were",
      instructions: "The were-subjunctive is used in hypothetical conditions (if I were, were she to…) and after wish/as if/as though. 'Was' is informal; 'were' is formal/correct at C1.",
      questions: [
        { id: "e2q1", prompt: "If I ___ you, I would apply for the promotion.", options: ["was", "were", "am"], correctIndex: 1, explanation: "If I were you = standard subjunctive for advice. Formal and correct at C1." },
        { id: "e2q2", prompt: "She acts as if she ___ the only person in the room.", options: ["is", "was", "were"], correctIndex: 2, explanation: "as if + were = hypothetical/unreal comparison (she's not the only person)." },
        { id: "e2q3", prompt: "I wish it ___ possible to undo the past.", options: ["is", "was", "were"], correctIndex: 2, explanation: "wish + were = hypothetical present wish (it's not possible)." },
        { id: "e2q4", prompt: "___ she to accept the offer, the project would be transformed.", options: ["If", "Were", "Should"], correctIndex: 1, explanation: "Were + subject + to-infinitive = formal inverted conditional (= if she were to accept)." },
        { id: "e2q5", prompt: "He spoke as though he ___ an expert, but he clearly wasn't.", options: ["is", "were", "has been"], correctIndex: 1, explanation: "as though + were = hypothetical manner (he's not an expert)." },
        { id: "e2q6", prompt: "If the government ___ to raise taxes, there would be protests.", options: ["were", "was", "is"], correctIndex: 0, explanation: "If + subject + were to + infinitive = formal hypothetical conditional." },
        { id: "e2q7", prompt: "I'd rather he ___ here in person for the meeting.", options: ["is", "were", "be"], correctIndex: 1, explanation: "would rather + subject + past subjunctive (were) = preference about someone else's action." },
        { id: "e2q8", prompt: "Suppose she ___ to resign — what would happen then?", options: ["was", "were", "is"], correctIndex: 1, explanation: "Suppose + were to = formal hypothetical (same as if she were to)." },
        { id: "e2q9", prompt: "It's not as if he ___ incapable of doing the work.", options: ["is", "were", "be"], correctIndex: 1, explanation: "not as if + were = hypothetical/subjunctive tone, contradicting a false impression." },
        { id: "e2q10", prompt: "If only this ___ easier — but it clearly isn't.", options: ["is", "was", "were"], correctIndex: 2, explanation: "if only + were = strong wish about a present unreal situation." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Mandative vs indicative: choose the right register",
      instructions: "Some sentences require the formal mandative subjunctive (bare infinitive). Others use normal indicative (present/past simple). Choose based on context and the trigger verb/adjective.",
      questions: [
        { id: "e3q1", prompt: "He thinks that she ___ a good teacher. (opinion, not demand)", options: ["be", "is", "were"], correctIndex: 1, explanation: "think (opinion) → indicative: she is. Not a mandative context." },
        { id: "e3q2", prompt: "We insist that the contractor ___ the work by Friday. (demand)", options: ["finishes", "finish", "finished"], correctIndex: 1, explanation: "insist (demand) → mandative subjunctive: bare infinitive 'finish'." },
        { id: "e3q3", prompt: "It is crucial that the CEO ___ personally aware of this risk. (formal directive)", options: ["is", "be", "was"], correctIndex: 1, explanation: "crucial that → mandative subjunctive: 'be' (bare infinitive, not 'is')." },
        { id: "e3q4", prompt: "She believes that he ___ the best candidate. (belief)", options: ["be", "is", "were"], correctIndex: 1, explanation: "believe (opinion/report) → indicative: 'is'. No subjunctive needed." },
        { id: "e3q5", prompt: "The protocol requires that each sample ___ tested twice. (rule)", options: ["is", "be", "was"], correctIndex: 1, explanation: "require (rule/demand) → mandative subjunctive: 'be tested' (passive bare infinitive)." },
        { id: "e3q6", prompt: "It is strange that he ___ here. He said he was busy. (fact-based surprise)", options: ["be", "is", "were"], correctIndex: 1, explanation: "strange that + indicative = surprise about a real fact (he IS here). Not a directive." },
        { id: "e3q7", prompt: "The report recommends that salaries ___ reviewed annually. (formal)", options: ["are", "be", "were"], correctIndex: 1, explanation: "recommend → mandative subjunctive: 'be reviewed'." },
        { id: "e3q8", prompt: "It is odd that she ___ absent again. (real observation)", options: ["be", "is", "were"], correctIndex: 1, explanation: "odd that + indicative = commenting on a real situation. NOT mandative." },
        { id: "e3q9", prompt: "The board proposed that the dividend ___ suspended. (formal decision)", options: ["is", "be", "was"], correctIndex: 1, explanation: "propose (formal decision) → mandative subjunctive: 'be suspended'." },
        { id: "e3q10", prompt: "She suggested that the meeting ___ postponed due to the weather. (recommendation)", options: ["is", "be", "was"], correctIndex: 1, explanation: "suggest (recommendation) → mandative subjunctive: 'be postponed'." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the correct subjunctive form",
      instructions: "Complete each sentence with the correct subjunctive form of the verb in brackets. Write only the missing verb phrase.",
      questions: [
        { id: "e4q1", prompt: "The committee recommended that the policy (review) ___.", correct: "be reviewed", explanation: "Mandative subjunctive (passive): be + past participle." },
        { id: "e4q2", prompt: "It is imperative that the data (back up) ___ immediately.", correct: "be backed up", explanation: "Mandative subjunctive (passive): be backed up." },
        { id: "e4q3", prompt: "If I (be) ___ in your position, I would negotiate harder.", correct: "were", explanation: "Were-subjunctive: if + were (not was) for hypothetical condition." },
        { id: "e4q4", prompt: "She demanded that he (leave) ___ the room at once.", correct: "leave", explanation: "demand + that + bare infinitive: leave (not leaves/left)." },
        { id: "e4q5", prompt: "I wish the process (be) ___ simpler. It's unnecessarily complicated.", correct: "were", explanation: "wish + were = hypothetical wish about a present situation." },
        { id: "e4q6", prompt: "It is vital that every participant (sign) ___ the consent form.", correct: "sign", explanation: "vital that + bare infinitive: sign." },
        { id: "e4q7", prompt: "She spoke as though she (know) ___ every detail, but she was bluffing.", correct: "knew", explanation: "as though + past tense (or were) for hypothetical manner. Knew is the natural past subjunctive here." },
        { id: "e4q8", prompt: "The regulations stipulate that all staff (complete) ___ the training by December.", correct: "complete", explanation: "stipulate (mandate) + that + bare infinitive: complete." },
        { id: "e4q9", prompt: "___ she to discover the truth, the consequences would be severe. (Were)", correct: "were she to discover", explanation: "Were + subject + to-infinitive = formal inverted conditional." },
        { id: "e4q10", prompt: "I'd rather he (not/tell) ___ the others yet. It's too early.", correct: "didn't tell", explanation: "would rather + subject + past simple (didn't tell) for preference about someone else." },
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
        <span className="text-slate-700 font-medium">Subjunctive Mood</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Subjunctive{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Mood</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The <b>mandative subjunctive</b> uses a bare infinitive (no -s, no auxiliary) in <i>that</i>-clauses after verbs like <i>suggest, insist, demand, recommend</i> and adjectives like <i>essential, vital, necessary</i>. The <b>were-subjunctive</b> appears in hypothetical conditions and after <i>wish / as if</i>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-c1-subjunctive" subject="Subjunctive" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-c1-subjunctive" subject="Subjunctive" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/inverted-conditionals" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Inverted Conditionals →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Subjunctive Mood (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { type: "Mandative subjunctive", note: "After demand/suggest/recommend/insist/require/propose/vital/essential/important/necessary", ex: "It is essential that he be informed. / She insisted that the work be completed.", rule: "Bare infinitive — no -s, no was/were, same for all persons." },
          { type: "Were-subjunctive (hypothetical)", note: "After if / wish / as if / as though / suppose / if only", ex: "If I were you, I'd refuse. / I wish it were simpler. / She acted as if she were in charge.", rule: "Were for all persons (not was) in formal/written English." },
          { type: "Were to (formal hypothetical)", note: "If + subject + were to + infinitive", ex: "If the deal were to fall through, we'd lose millions.", rule: "More formal than 'if + past simple' — suggests unlikely or very serious scenario." },
          { type: "Would rather + past subjunctive", note: "Preference about someone else's action", ex: "I'd rather he didn't tell anyone. / She'd rather we were there in person.", rule: "would rather + subject + past simple (not infinitive)." },
        ].map(({ type, note, ex, rule }) => (
          <div key={type} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-cyan-700 text-sm">{type}</span>
              <span className="text-xs text-slate-500">— {note}</span>
            </div>
            <div className="italic text-slate-700 text-sm mb-1">{ex}</div>
            <div className="text-xs text-slate-500 font-medium">{rule}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm text-slate-800 space-y-1">
          <div><span className="font-black">Mandative trigger verbs:</span> suggest, recommend, insist, demand, require, propose, ask, stipulate, urge</div>
          <div><span className="font-black">Mandative trigger adjectives/nouns:</span> essential, vital, important, necessary, imperative, crucial, a requirement, a priority</div>
          <div className="mt-2 text-slate-600">In American English the mandative subjunctive is the norm. In British English, <i>should + infinitive</i> is also acceptable: <i>It is essential that he should be informed.</i></div>
        </div>
      </div>
    </div>
  );
}
