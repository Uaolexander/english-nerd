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
  { title: "Advanced Participle Clauses", href: "/grammar/c1/advanced-participle-clauses", level: "C1", badge: "bg-sky-600", reason: "Both expand noun/clause modification at C1 level" },
  { title: "Complex Noun Phrases", href: "/grammar/c1/complex-noun-phrases", level: "C1", badge: "bg-sky-600" },
  { title: "Ellipsis & Substitution", href: "/grammar/c1/ellipsis-substitution", level: "C1", badge: "bg-sky-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "She arrived late, ___ annoyed everyone.", options: ["which", "that", "what", "who"], answer: 0 },
  { q: "Sentential relative 'which' refers to:", options: ["Whole preceding clause", "A noun only", "A person", "Nothing specific"], answer: 0 },
  { q: "The report ___ we based decision.", options: ["on which", "which", "that", "in which"], answer: 0 },
  { q: "The professor ___ she had studied.", options: ["with whom", "with who", "that", "which"], answer: 0 },
  { q: "___ arrives first should set up.", options: ["Whoever", "Whomever", "Anyone", "Someone"], answer: 0 },
  { q: "___ she goes, makes new friends.", options: ["Wherever", "Whenever", "However", "Whatever"], answer: 0 },
  { q: "The prize goes to ___ scores best.", options: ["whoever", "whomever", "that person", "anyone"], answer: 0 },
  { q: "The building ___ conference held.", options: ["in which", "where that", "which", "that"], answer: 0 },
  { q: "'Whomever' is used when it is:", options: ["Object of a verb/prep", "Subject of a clause", "Always correct", "Never correct"], answer: 0 },
  { q: "Preposition + whom/which is:", options: ["Formal style", "Informal style", "Incorrect", "Optional only"], answer: 0 },
  { q: "The letter ___ never replied.", options: ["to whom it was addressed", "which addressed", "that addressed", "to who addressed"], answer: 0 },
  { q: "Pass message to ___ is in charge.", options: ["whoever", "whomever", "who", "the one"], answer: 0 },
  { q: "'That' can introduce:", options: ["Defining clauses only", "Non-defining clauses", "Sentential relatives", "Free relatives"], answer: 0 },
  { q: "She passed every exam, ___ amazed.", options: ["which", "that", "who", "what"], answer: 0 },
  { q: "The committee ___ proposal submitted.", options: ["to which", "that", "to who", "which"], answer: 0 },
  { q: "___ said that misunderstood it.", options: ["Whoever", "Whomever", "Whatever", "However"], answer: 0 },
  { q: "Free relative 'whatever' means:", options: ["Anything that", "Which thing", "Who knows", "Nothing"], answer: 0 },
  { q: "'However' as free relative means:", options: ["In any way that", "Despite", "Contrast", "Addition"], answer: 0 },
  { q: "The circumstances ___ they arrived.", options: ["in which", "which", "in that", "that"], answer: 0 },
  { q: "He resigned, ___ surprised everyone.", options: ["which", "that", "what", "who"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Advanced Relative Clauses",
  subtitle: "Sentential relatives, preposition+which/whom, free relatives",
  level: "C1",
  keyRule: "'Which' refers to whole clauses; prep+whom is formal.",
  exercises: [
    {
      number: 1,
      title: "Sentential & Formal Relatives",
      difficulty: "Easy",
      instruction: "Choose the correct relative pronoun.",
      questions: [
        "Arrived late, ___ annoyed everyone.",
        "Went bankrupt, ___ no surprise.",
        "Report ___ we based decision.",
        "Professor ___ she had studied.",
        "Building ___ conference held.",
        "He resigned, ___ left no leader.",
        "Committee ___ proposal submitted.",
        "Passed every exam, ___ delighted.",
        "Circumstances ___ they arrived.",
        "Letter ___ minister never replied.",
      ],
      hint: "which / on which / with whom / in which",
    },
    {
      number: 2,
      title: "Whoever / Whatever / Whichever",
      difficulty: "Medium",
      instruction: "Choose the correct free relative.",
      questions: [
        "___ arrives first sets up room.",
        "Choose ___ colour you prefer.",
        "___ she goes, makes friends.",
        "___ said that misunderstood.",
        "Prize to ___ scores highest.",
        "Pass message to ___ in charge.",
        "I'll support ___ you decide.",
        "___ the cost, it must be done.",
        "Give it to ___ needs it most.",
        "___ happens, stay calm.",
      ],
      hint: "Whoever / wherever / whatever / whichever",
    },
    {
      number: 3,
      title: "Formal vs Informal Relatives",
      difficulty: "Hard",
      instruction: "Rewrite informally or formally.",
      questions: [
        "Formal: whom the letter addressed.",
        "Formal: on which they relied.",
        "Formal: in which it took place.",
        "Formal: to whom she spoke.",
        "Informal → formal: report we used.",
        "Formal: by which she succeeded.",
        "Correct or incorrect: 'with who'?",
        "Formal: from which she came.",
        "'That' vs 'which' in non-defining.",
        "Sentential: She won, ___ shocked.",
      ],
      hint: "whom/which with preposition fronted",
    },
    {
      number: 4,
      title: "Complete the Relative Clause",
      difficulty: "Very Hard",
      instruction: "Complete with one word or phrase.",
      questions: [
        "She won, ___ amazed the crowd.",
        "The city ___ she was born is old.",
        "The man ___ car was stolen called.",
        "Report ___ decision was based wrong.",
        "___ arrives first opens the door.",
        "I'll take ___ option is cheapest.",
        "She called whoever ___ available.",
        "Building ___ signed is historical.",
        "The board ___ report submitted.",
        "He left, ___ caused a problem.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Sentential & Formal Relatives", answers: ["which", "which", "on which", "with whom", "in which", "which", "to which", "which", "in which", "to whom"] },
    { exercise: 2, subtitle: "Whoever / Whatever / Whichever", answers: ["Whoever", "whichever / whatever", "Wherever", "Whoever", "whoever", "whoever", "whatever", "Whatever", "whoever", "Whatever"] },
    { exercise: 3, subtitle: "Formal vs Informal Relatives", answers: ["to whom the letter was addressed", "the report on which they relied", "the venue in which it took place", "the person to whom she spoke", "the report on which we based our decision", "the method by which she succeeded", "Incorrect (should be 'with whom')", "the place from which she came", "'that' cannot be used in non-defining", "which"] },
    { exercise: 4, subtitle: "Complete the Relative Clause", answers: ["which", "in which / where", "whose", "on which", "Whoever", "whichever", "who was", "in which the treaty was", "to which the report was submitted", "which"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function AdvancedRelativeClausesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Sentential relatives & preposition + which/whom",
      instructions: "A sentential relative clause (introduced by 'which') refers to the whole preceding clause. Formal English prefers preposition + which/whom instead of a stranded preposition. Choose the correct form.",
      questions: [
        { id: "e1q1", prompt: "She arrived two hours late, ___ annoyed everyone.", options: ["which", "that", "what"], correctIndex: 0, explanation: "Sentential relative: 'which' refers to the whole situation (her being late). 'That' cannot introduce a non-defining clause." },
        { id: "e1q2", prompt: "The company went bankrupt, ___ came as no surprise.", options: ["which", "that", "what"], correctIndex: 0, explanation: "'which' refers back to the whole preceding clause. 'What' cannot introduce a relative clause here." },
        { id: "e1q3", prompt: "The report ___ we based our decision was later discredited.", options: ["that", "on which", "which"], correctIndex: 1, explanation: "Formal preposition fronting: 'on which we based our decision' (we based our decision on the report)." },
        { id: "e1q4", prompt: "The professor ___ she had studied was awarded a Nobel Prize.", options: ["with whom", "that", "who"], correctIndex: 0, explanation: "Formal: 'with whom she had studied' (she had studied with the professor). 'with who' is non-standard." },
        { id: "e1q5", prompt: "The building ___ the conference took place was magnificent.", options: ["in which", "where that", "which"], correctIndex: 0, explanation: "'in which' = formal equivalent of 'where': the building in which = the building where." },
        { id: "e1q6", prompt: "He resigned, ___ meant the project was left without a leader.", options: ["which", "that", "what"], correctIndex: 0, explanation: "Sentential relative: 'which' refers to the whole event of his resignation." },
        { id: "e1q7", prompt: "The committee ___ the proposal was submitted rejected it immediately.", options: ["to whom", "to which", "that"], correctIndex: 1, explanation: "Formal: 'to which the proposal was submitted' (the proposal was submitted to the committee)." },
        { id: "e1q8", prompt: "She passed every exam with distinction, ___ delighted her tutors.", options: ["which", "that", "who"], correctIndex: 0, explanation: "Sentential relative referring to the whole achievement." },
        { id: "e1q9", prompt: "The circumstances ___ they arrived were far from ideal.", options: ["in which", "which", "in that"], correctIndex: 0, explanation: "'in which' = under which / in which circumstances." },
        { id: "e1q10", prompt: "The minister ___ the letter was addressed never replied.", options: ["to whom", "to who", "which"], correctIndex: 0, explanation: "Formal: to + whom (not 'who') after a preposition." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — whoever/whatever/whichever/whenever/wherever",
      instructions: "Free relatives (whoever, whatever, whichever, whenever, wherever, however) function as noun clauses and mean 'anyone who', 'anything that', etc. Choose the correct form.",
      questions: [
        { id: "e2q1", prompt: "___ arrives first should start setting up the room.", options: ["Whoever", "Whomever", "Anyone who"], correctIndex: 0, explanation: "'Whoever' = any person who; it functions as the subject. 'Whomever' would be the object form." },
        { id: "e2q2", prompt: "You can choose ___ colour you prefer — all are available.", options: ["whatever", "whichever", "Both are correct"], correctIndex: 2, explanation: "Both 'whatever colour' (any colour at all) and 'whichever colour' (from a known set of options) are acceptable." },
        { id: "e2q3", prompt: "___ she goes, she always makes new friends.", options: ["Wherever", "Whenever", "However"], correctIndex: 0, explanation: "'Wherever' = in any place where." },
        { id: "e2q4", prompt: "___ said that clearly didn't understand the situation.", options: ["Whoever", "Whomever", "Whatever"], correctIndex: 0, explanation: "'Whoever said that' = the person who said that (subject position)." },
        { id: "e2q5", prompt: "The prize will be awarded to ___ scores highest.", options: ["whoever", "whomever", "the one who"], correctIndex: 0, explanation: "'Whoever scores highest' — though this is after 'to', 'whoever' is the subject of 'scores', so nominative is correct." },
        { id: "e2q6", prompt: "Please pass the message to ___ is in charge today.", options: ["whoever", "whomever", "the person whom"], correctIndex: 0, explanation: "'Whoever is in charge' = nominative (subject of 'is in charge')." },
        { id: "e2q7", prompt: "___ you decide, I will support you.", options: ["Whatever", "Whichever", "However"], correctIndex: 0, explanation: "'Whatever you decide' = no matter what you decide (free relative as object)." },
        { id: "e2q8", prompt: "I will repay ___ helped me during that difficult time.", options: ["whoever", "whomever", "everyone who"], correctIndex: 0, explanation: "'whoever helped me' — subject of 'helped', so nominative 'whoever' is correct even though it follows 'repay'." },
        { id: "e2q9", prompt: "___ hard he tries, he never seems to satisfy his supervisor.", options: ["However", "Whatever", "Wherever"], correctIndex: 0, explanation: "'However hard he tries' = no matter how hard." },
        { id: "e2q10", prompt: "Take ___ seat you like — they're all equally uncomfortable.", options: ["whichever", "whatever", "Both are correct"], correctIndex: 0, explanation: "'Whichever' is preferred when choosing from a defined set of options (the seats in a specific room)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Reduced relative clauses",
      instructions: "Relative clauses can be reduced to participial phrases. Active → present participle (-ing); passive → past participle (-ed/pp); stative → adjective. Choose the correctly reduced form.",
      questions: [
        { id: "e3q1", prompt: "The man who was standing in the doorway turned out to be the director. → The man ___ in the doorway…", options: ["standing", "who stood", "stood"], correctIndex: 0, explanation: "Active progressive relative → reduced: 'who was standing' → 'standing' (present participle)." },
        { id: "e3q2", prompt: "The documents that were submitted last week have been approved. → The documents ___ last week…", options: ["submitting", "submitted", "that submitted"], correctIndex: 1, explanation: "Passive relative → reduced past participle: 'that were submitted' → 'submitted'." },
        { id: "e3q3", prompt: "Anyone who wishes to attend must register in advance. → Anyone ___ to attend…", options: ["wishing", "wished", "that wishes"], correctIndex: 0, explanation: "Active relative → reduced present participle: 'who wishes' → 'wishing'." },
        { id: "e3q4", prompt: "The bridge which connects the two islands was built in 1932. → The bridge ___ the two islands…", options: ["connecting", "connected", "that connects"], correctIndex: 0, explanation: "Active relative → reduced present participle: 'which connects' → 'connecting'." },
        { id: "e3q5", prompt: "The results that are shown in Table 3 are inconclusive. → The results ___ in Table 3…", options: ["showing", "shown", "that show"], correctIndex: 1, explanation: "Passive relative → reduced past participle: 'that are shown' → 'shown'." },
        { id: "e3q6", prompt: "Which sentence correctly reduces 'the issues which remain unresolved'?", options: ["the issues remaining unresolved", "the issues remained unresolved", "the unresolved issues"], correctIndex: 2, explanation: "Adjectival participle as premodifier: 'the unresolved issues' — stative meaning allows front placement." },
        { id: "e3q7", prompt: "The applicants who were considered suitable were invited to interview. → The applicants ___ suitable…", options: ["considering", "considered", "who considered"], correctIndex: 1, explanation: "Passive relative → 'considered' (reduced past participle)." },
        { id: "e3q8", prompt: "Which is the correct reduced version of 'the company which is based in Dublin'?", options: ["the company based in Dublin", "the company basing in Dublin", "the Dublin-based company"], correctIndex: 2, explanation: "Both 'the company based in Dublin' and 'the Dublin-based company' are correct; the latter is a compound premodifier." },
        { id: "e3q9", prompt: "Students who study hard tend to perform well in exams. → Students ___ hard…", options: ["studying", "studied", "that study"], correctIndex: 0, explanation: "Active habitual relative → reduced present participle: 'who study' → 'studying'." },
        { id: "e3q10", prompt: "The treaty, which was signed in 1648, ended the Thirty Years' War. → The treaty, ___ in 1648, …", options: ["signing", "signed", "having signed"], correctIndex: 1, explanation: "Non-defining passive relative → reduced past participle: 'which was signed' → 'signed'." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Combine or rewrite using a relative clause",
      instructions: "Combine the sentences or rewrite using the structure shown. Write the full sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "She submitted the proposal. The committee accepted it unanimously. (…, which…)", correct: "she submitted the proposal, which the committee accepted unanimously", explanation: "Non-defining relative: 'which the committee accepted unanimously' refers to the proposal." },
        { id: "e4q2", prompt: "The professor gave a lecture. I had read all his books before. (formal: …whose books…)", correct: "the professor whose books i had read gave a lecture", explanation: "Whose + possessive: 'the professor whose books I had read'." },
        { id: "e4q3", prompt: "He made no comment, and this surprised everyone. (…, which…)", correct: "he made no comment, which surprised everyone", explanation: "Sentential relative: 'which surprised everyone' refers to the whole fact." },
        { id: "e4q4", prompt: "Anyone wins the competition will receive a full scholarship. (use 'whoever')", correct: "whoever wins the competition will receive a full scholarship", explanation: "Free relative: 'Whoever wins' = any person who wins." },
        { id: "e4q5", prompt: "The letter was addressed to the director. She never replied. (formal: to whom…)", correct: "the letter was addressed to the director, to whom she never replied", explanation: "Preposition fronting in non-defining clause: to + whom." },
        { id: "e4q6", prompt: "The data that was collected over five years has now been analysed. (reduce the relative clause)", correct: "the data collected over five years has now been analysed", explanation: "Passive relative → reduced past participle: 'that was collected' → 'collected'." },
        { id: "e4q7", prompt: "The town has changed a lot. I grew up there. (formal: …in which…)", correct: "the town in which i grew up has changed a lot", explanation: "Formal: preposition + which instead of stranded preposition ('the town which I grew up in')." },
        { id: "e4q8", prompt: "Students who fail the assessment will be given one opportunity to resit. (reduce)", correct: "students failing the assessment will be given one opportunity to resit", explanation: "Active relative → reduced present participle: 'who fail' → 'failing'." },
        { id: "e4q9", prompt: "You can take whichever approach. It seems most appropriate to you. (combine using 'whichever')", correct: "you can take whichever approach seems most appropriate to you", explanation: "Free relative as noun phrase: 'whichever approach seems most appropriate to you'." },
        { id: "e4q10", prompt: "The study produced surprising results. Nobody had predicted this. (…, which…)", correct: "the study produced surprising results, which nobody had predicted", explanation: "Sentential relative: 'which nobody had predicted' refers to the surprising results being produced." },
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
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Advanced Relative Clauses</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Advanced{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Relative Clauses</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Beyond basic relative clauses, C1 requires mastery of <b>sentential relatives</b> (<i>She resigned, which surprised everyone</i>), <b>formal preposition fronting</b> (<i>the building in which / the person to whom</i>), <b>free relatives</b> (<i>whoever/whatever/whichever</i>), and <b>reduced relative clauses</b> (present and past participle phrases).
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-c1-advanced-relative-clauses" subject="Advanced Relative Clauses" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-c1-advanced-relative-clauses" subject="Advanced Relative Clauses" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/advanced-participle-clauses" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Advanced Participle Clauses →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Advanced Relative Clauses (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { title: "Sentential relative: …, which + clause", body: "'Which' refers to the entire preceding clause, not just a noun. Cannot use 'that' here.", ex: "She passed all her exams, which delighted her parents. / He resigned, which nobody expected." },
          { title: "Formal preposition fronting: prep + which / whom", body: "In formal English, move the preposition before the relative pronoun instead of leaving it at the end.", ex: "Informal: the house that I grew up in\nFormal: the house in which I grew up\nFormal: the person to whom I spoke / the committee to which it was submitted" },
          { title: "Free relatives: whoever / whatever / whichever / wherever / whenever / however", body: "No antecedent noun needed — the word acts as both conjunction and pronoun.", ex: "Whoever arrives first should open the windows. / Whatever you decide, I'll support you. / However hard she tried, she couldn't solve it." },
          { title: "Reduced relative clauses — present participle (active)", body: "Replace 'who/which + is/are + -ing' or 'who/which + verb' with just the -ing form.", ex: "The man standing at the door = the man who is standing / the man who stands.\nStudents wishing to enrol should contact the office." },
          { title: "Reduced relative clauses — past participle (passive)", body: "Replace 'which/that + is/are/was/were + pp' with just the past participle.", ex: "The documents submitted last week = the documents that were submitted last week.\nThe proposal approved by the board = the proposal that was approved." },
          { title: "Compound premodifier from reduced relative", body: "Adjectival participles can move in front of the noun, often hyphenated.", ex: "the Dublin-based company = the company based in Dublin\nthe well-known author = the author who is well known" },
        ].map(({ title, body, ex }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-1">{title}</div>
            <div className="text-slate-600 text-sm mb-2">{body}</div>
            <div className="italic text-slate-700 text-sm whitespace-pre-line">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">who vs whom vs whose</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div><b>who</b> = subject of the relative clause: <i>the person who spoke</i></div>
          <div><b>whom</b> = object of the relative clause (or after a preposition): <i>the person whom I met / to whom I wrote</i></div>
          <div><b>whose</b> = possessive: <i>the professor whose research influenced the field</i></div>
        </div>
      </div>
    </div>
  );
}
