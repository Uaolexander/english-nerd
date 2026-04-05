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
  { q: "Use 'who' in a relative clause for:", options: ["places", "things", "times", "people"], answer: 3 },
  { q: "Use 'which' in a relative clause for:", options: ["people", "places only", "things", "times"], answer: 2 },
  { q: "Use 'where' in a relative clause for:", options: ["people", "times", "things", "places"], answer: 3 },
  { q: "Use 'when' in a relative clause for:", options: ["people", "times", "things", "places"], answer: 1 },
  { q: "Use 'whose' to show:", options: ["time", "place", "possession", "reason"], answer: 2 },
  { q: "'The woman ___ lives next door is a doctor.'", options: ["which", "whose", "where", "who"], answer: 3 },
  { q: "'The book ___ changed my life.' Correct:", options: ["who", "whose", "where", "which"], answer: 3 },
  { q: "'The man ___ bag was stolen called police.'", options: ["who", "which", "whose", "where"], answer: 2 },
  { q: "'This is the restaurant ___ we had our date.'", options: ["which", "who", "whose", "where"], answer: 3 },
  { q: "Can 'that' replace 'who' and 'which' in defining clauses?", options: ["Never", "Only for things", "Only for people", "Yes, for both"], answer: 3 },
  { q: "'Is there anything ___ I can do to help?'", options: ["who", "which", "where", "that"], answer: 3 },
  { q: "'The year ___ she was born was 1995.'", options: ["which", "whose", "where", "when"], answer: 3 },
  { q: "When can 'that' be omitted in defining clauses?", options: ["Always", "Never", "When it's the subject", "When it's the object"], answer: 3 },
  { q: "'The book (that) I read was amazing.' Can 'that' be omitted?", options: ["No — it's subject", "No — it's object", "Yes — it's object", "Yes — it's subject"], answer: 2 },
  { q: "'The man who called me is my uncle.' Can 'who' be omitted?", options: ["Yes — object pronoun", "No — subject pronoun", "Yes — subject pronoun", "No — object pronoun"], answer: 1 },
  { q: "'The company ___ she works for is successful.'", options: ["who", "whose", "where", "which"], answer: 3 },
  { q: "Defining relative clause: commas needed?", options: ["Always", "Never", "Sometimes", "Only for 'which'"], answer: 1 },
  { q: "'The students ___ passed got certificates.'", options: ["which", "whose", "where", "who"], answer: 3 },
  { q: "'I know a girl ___ father is a famous actor.'", options: ["who", "which", "where", "whose"], answer: 3 },
  { q: "'The laptop ___ I bought last month is broken.'", options: ["who", "whose", "where", "which"], answer: 3 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Defining Relative Clauses",
  subtitle: "who / which / that / where / when / whose",
  level: "B1",
  keyRule: "who = people | which/that = things | where = places | when = times | whose = possession",
  exercises: [
    {
      number: 1,
      title: "Choose who, which or whose",
      difficulty: "Easy",
      instruction: "Choose the correct relative pronoun.",
      questions: [
        "The woman ___ lives next door is a doctor.",
        "This is the book ___ changed my life.",
        "The students ___ passed got certificates.",
        "I hate films ___ have sad endings.",
        "The man ___ bag was stolen called police.",
        "The restaurant ___ we had our date.",
        "The company ___ she works for is successful.",
        "The person ___ you need is in room 5.",
        "I know a girl ___ father is famous.",
        "The year ___ she was born was 1995.",
      ],
    },
    {
      number: 2,
      title: "Choose who/which/where/when/whose",
      difficulty: "Medium",
      instruction: "Choose the best relative pronoun.",
      questions: [
        "The town ___ I grew up has changed a lot.",
        "I remember the day ___ we first met.",
        "Children ___ are playing are my cousins.",
        "Is this the key ___ opens the front door?",
        "The teacher ___ class I missed was strict.",
        "I love cities ___ have good transport.",
        "She's the person ___ never gives up.",
        "2020 was the year ___ everything changed.",
        "The laptop ___ I bought is already broken.",
        "The man ___ car broke down asked us.",
      ],
    },
    {
      number: 3,
      title: "Write the relative pronoun",
      difficulty: "Hard",
      instruction: "Write who/which/that/where/when/whose.",
      questions: [
        "The hotel ___ we stayed was comfortable.",
        "She's the singer ___ voice I love.",
        "I know someone ___ can help you.",
        "This is the film ___ won five Oscars.",
        "The summer ___ we met was very hot.",
        "The doctor ___ treated me was kind.",
        "Is there anything ___ I can do to help?",
        "The company ___ she works for pays well.",
        "I need someone ___ is good at maths.",
        "The village ___ I was born has a church.",
      ],
    },
    {
      number: 4,
      title: "Can the pronoun be omitted?",
      difficulty: "Harder",
      instruction: "Can be omitted (object) or cannot (subject)?",
      questions: [
        "The book (that) I read last week was great.",
        "The man who called me is my uncle.",
        "The film (that) we watched was boring.",
        "The woman who lives upstairs is a nurse.",
        "The restaurant (that) you recommended.",
        "The car which broke down = my friend's.",
        "The song (that) she sang was beautiful.",
        "I know someone whose sister is famous.",
        "The exam (that) I failed was very hard.",
        "The students who passed got a certificate.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Relative pronouns", answers: ["who", "which", "who", "which", "whose", "where", "which", "who", "whose", "when"] },
    { exercise: 2, subtitle: "Relative pronouns", answers: ["where", "when", "who", "which", "whose", "which", "who", "when", "which", "whose"] },
    { exercise: 3, subtitle: "Written pronouns", answers: ["where", "whose", "who", "that", "when", "who", "that", "which", "who", "where"] },
    { exercise: 4, subtitle: "Omitted or not", answers: ["Can be omitted", "Cannot be omitted", "Can be omitted", "Cannot be omitted", "Can be omitted", "Cannot be omitted", "Can be omitted", "Cannot be omitted", "Can be omitted", "Cannot be omitted"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Non-defining Relative Clauses", href: "/grammar/b1/relative-clauses-non-defining", level: "B1", badge: "bg-violet-500", reason: "The companion to defining relative clauses" },
  { title: "Reported Statements", href: "/grammar/b1/reported-statements", level: "B1", badge: "bg-violet-500" },
  { title: "Reported Questions", href: "/grammar/b1/reported-questions", level: "B1", badge: "bg-violet-500" },
];

export default function RelativeClausesDefiningLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct relative pronoun",
      instructions: "Choose who, which, or that to complete the defining relative clause.",
      questions: [
        { id: "e1q1", prompt: "The woman ___ lives next door is a doctor.", options: ["who", "which", "whose"], correctIndex: 0, explanation: "Person → who (or that): the woman who lives next door." },
        { id: "e1q2", prompt: "This is the book ___ changed my life.", options: ["who", "which", "whose"], correctIndex: 1, explanation: "Thing → which (or that): the book which changed my life." },
        { id: "e1q3", prompt: "The students ___ passed the exam got certificates.", options: ["who", "which", "where"], correctIndex: 0, explanation: "People → who." },
        { id: "e1q4", prompt: "I hate films ___ have sad endings.", options: ["who", "which", "whom"], correctIndex: 1, explanation: "Thing → which (or that)." },
        { id: "e1q5", prompt: "The man ___ bag was stolen called the police.", options: ["who", "which", "whose"], correctIndex: 2, explanation: "Possession → whose: the man whose bag was stolen." },
        { id: "e1q6", prompt: "This is the restaurant ___ we had our first date.", options: ["which", "who", "where"], correctIndex: 2, explanation: "Place → where: the restaurant where we had our date." },
        { id: "e1q7", prompt: "The company ___ she works for is very successful.", options: ["which", "who", "whose"], correctIndex: 0, explanation: "Thing → which (or that): the company which she works for." },
        { id: "e1q8", prompt: "The person ___ you need to speak to is in room 5.", options: ["whose", "which", "who"], correctIndex: 2, explanation: "Person → who (or that)." },
        { id: "e1q9", prompt: "I know a girl ___ father is a famous actor.", options: ["who", "whose", "which"], correctIndex: 1, explanation: "Possession → whose." },
        { id: "e1q10", prompt: "The year ___ she was born was 1995.", options: ["which", "when", "whose"], correctIndex: 1, explanation: "Time → when: the year when she was born." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — who, which, where, when, whose or that?",
      instructions: "Choose the best relative pronoun. In some sentences, 'that' is also possible — choose the most precise option.",
      questions: [
        { id: "e2q1", prompt: "The town ___ I grew up has changed a lot.", options: ["where", "which", "who"], correctIndex: 0, explanation: "Place → where." },
        { id: "e2q2", prompt: "I remember the day ___ we first met.", options: ["where", "when", "whose"], correctIndex: 1, explanation: "Time → when." },
        { id: "e2q3", prompt: "The children ___ are playing in the park are my cousins.", options: ["whose", "which", "who"], correctIndex: 2, explanation: "People → who." },
        { id: "e2q4", prompt: "Is this the key ___ opens the front door?", options: ["who", "which", "where"], correctIndex: 1, explanation: "Thing → which." },
        { id: "e2q5", prompt: "The teacher ___ class I missed was very strict.", options: ["who", "whose", "which"], correctIndex: 1, explanation: "Possession → whose: the teacher whose class I missed." },
        { id: "e2q6", prompt: "I love cities ___ have good public transport.", options: ["where", "which", "whose"], correctIndex: 1, explanation: "Thing (cities) + relative clause → which." },
        { id: "e2q7", prompt: "She's the kind of person ___ never gives up.", options: ["which", "who", "whose"], correctIndex: 1, explanation: "Person → who." },
        { id: "e2q8", prompt: "2020 was the year ___ everything changed.", options: ["where", "whose", "when"], correctIndex: 2, explanation: "Year → when." },
        { id: "e2q9", prompt: "The laptop ___ I bought last month is already broken.", options: ["who", "which", "where"], correctIndex: 1, explanation: "Thing → which." },
        { id: "e2q10", prompt: "The man ___ car broke down asked us for help.", options: ["who", "which", "whose"], correctIndex: 2, explanation: "Possession → whose." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the relative pronoun",
      instructions: "Write the correct relative pronoun (who, which, that, where, when, whose).",
      questions: [
        { id: "e3q1", prompt: "The hotel ___ we stayed was very comfortable.", correct: "where", explanation: "Place → where." },
        { id: "e3q2", prompt: "She's the singer ___ voice I love.", correct: "whose", explanation: "Possession → whose." },
        { id: "e3q3", prompt: "I know someone ___ can help you.", correct: "who", explanation: "Person → who (or that)." },
        { id: "e3q4", prompt: "This is the film ___ won five Oscars.", correct: "that", explanation: "Thing → that (or which)." },
        { id: "e3q5", prompt: "The summer ___ we met was very hot.", correct: "when", explanation: "Time → when." },
        { id: "e3q6", prompt: "The doctor ___ treated me was very kind.", correct: "who", explanation: "Person → who (or that)." },
        { id: "e3q7", prompt: "Is there anything ___ I can do to help?", correct: "that", explanation: "Thing after anything → that (not which)." },
        { id: "e3q8", prompt: "The company ___ she works for pays very well.", correct: "which", explanation: "Thing → which (or that)." },
        { id: "e3q9", prompt: "I need someone ___ is good at maths.", correct: "who", explanation: "Person → who (or that)." },
        { id: "e3q10", prompt: "The village ___ I was born has a beautiful church.", correct: "where", explanation: "Place → where." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Hardest) — Can the relative pronoun be omitted?",
      instructions: "In defining relative clauses, the pronoun can be omitted when it is the object of the clause. Choose 'can be omitted' or 'cannot be omitted'.",
      questions: [
        { id: "e4q1", prompt: "The book (that) I read last week was amazing.", options: ["Can be omitted", "Cannot be omitted"], correctIndex: 0, explanation: "Object relative pronoun → can be omitted: The book I read last week…" },
        { id: "e4q2", prompt: "The man who called me is my uncle.", options: ["Can be omitted", "Cannot be omitted"], correctIndex: 1, explanation: "Subject relative pronoun (who = subject of 'called') → cannot be omitted." },
        { id: "e4q3", prompt: "The film (that) we watched was boring.", options: ["Can be omitted", "Cannot be omitted"], correctIndex: 0, explanation: "Object relative pronoun → can be omitted." },
        { id: "e4q4", prompt: "The woman who lives upstairs is a nurse.", options: ["Can be omitted", "Cannot be omitted"], correctIndex: 1, explanation: "Subject pronoun (who = subject of 'lives') → cannot be omitted." },
        { id: "e4q5", prompt: "The restaurant (that) you recommended was excellent.", options: ["Can be omitted", "Cannot be omitted"], correctIndex: 0, explanation: "Object pronoun → can be omitted." },
        { id: "e4q6", prompt: "The car which broke down belongs to my friend.", options: ["Can be omitted", "Cannot be omitted"], correctIndex: 1, explanation: "Subject pronoun (which = subject of 'broke down') → cannot be omitted." },
        { id: "e4q7", prompt: "The song (that) she sang was beautiful.", options: ["Can be omitted", "Cannot be omitted"], correctIndex: 0, explanation: "Object pronoun → can be omitted." },
        { id: "e4q8", prompt: "I know someone whose sister is famous.", options: ["Can be omitted", "Cannot be omitted"], correctIndex: 1, explanation: "Whose (possession) → cannot be omitted." },
        { id: "e4q9", prompt: "The exam (that) I failed was very difficult.", options: ["Can be omitted", "Cannot be omitted"], correctIndex: 0, explanation: "Object pronoun → can be omitted." },
        { id: "e4q10", prompt: "The students who passed got a certificate.", options: ["Can be omitted", "Cannot be omitted"], correctIndex: 1, explanation: "Subject pronoun (who = subject of 'passed') → cannot be omitted." },
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
        <span className="text-slate-700 font-medium">Relative Clauses — Defining</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Relative Clauses —{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Defining</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        A <b>defining relative clause</b> identifies exactly which person, thing or place we mean. It gives essential information — without it, the sentence loses its meaning. No commas: <i>The man <b>who called</b> is my uncle.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-relative-clauses-defining" subject="Defining Relative Clauses" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b1-relative-clauses-defining" subject="Defining Relative Clauses" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/relative-clauses-non-defining" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Relative Clauses — Non-defining →</a>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text?: string; color?: string; dim?: boolean }> }) {
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Defining Relative Clauses</h2>
        <p className="text-slate-500 text-sm">Identify exactly which person, thing or place — no commas</p>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Formula</div>
        <Formula parts={[
          { text: "Main clause", color: "sky" },
          { dim: true },
          { text: "relative pronoun", color: "yellow" },
          { dim: true },
          { text: "relative clause", color: "green" },
        ]} />
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Relative Pronouns</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { pronoun: "who", use: "people", ex: "The man who called…", color: "border-emerald-200 bg-emerald-50", badge: "bg-emerald-100 text-emerald-800" },
            { pronoun: "which", use: "things", ex: "The book which I read…", color: "border-sky-200 bg-sky-50", badge: "bg-sky-100 text-sky-800" },
            { pronoun: "that", use: "people or things", ex: "The film that I saw…", color: "border-yellow-200 bg-yellow-50", badge: "bg-yellow-100 text-yellow-800" },
            { pronoun: "where", use: "places", ex: "The town where I grew up…", color: "border-violet-200 bg-violet-50", badge: "bg-violet-100 text-violet-800" },
            { pronoun: "whose", use: "possession", ex: "The girl whose bag was stolen…", color: "border-orange-200 bg-orange-50", badge: "bg-orange-100 text-orange-800" },
            { pronoun: "when", use: "time", ex: "The year when I graduated…", color: "border-red-200 bg-red-50", badge: "bg-red-100 text-red-800" },
          ].map(({ pronoun, use, ex, color, badge }) => (
            <div key={pronoun} className={`rounded-2xl border p-4 ${color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${badge}`}>{pronoun}</span>
                <span className="text-xs text-slate-500">{use}</span>
              </div>
              <div className="text-sm text-slate-700 italic">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
        <div className="text-xs font-bold uppercase text-violet-600 mb-2">Key Rule</div>
        <div className="text-sm font-black text-violet-900 mb-1">Defining clauses CANNOT be removed</div>
        <div className="text-sm text-slate-600">They identify <em>which one</em> we mean. Without them, the sentence loses its essential meaning.</div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">No Commas Rule</div>
        <div className="text-sm text-slate-700 mb-3">Defining clauses have <strong>NO commas</strong> — the clause is glued to the noun it defines.</div>
        <div className="space-y-2">
          <Ex en="The man who called is my uncle." correct={true} />
          <Ex en="The book, that I read, was good." correct={false} />
          <Ex en="The book that I read was good." correct={true} />
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">More Examples</div>
        <div className="space-y-2">
          <Ex en="The man which called is my uncle." correct={false} />
          <Ex en="The man who called is my uncle." correct={true} />
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <strong>Tip:</strong> &quot;that&quot; can replace &quot;who&quot; or &quot;which&quot; in defining clauses — but it cannot be omitted when it is the subject of the relative clause.
      </div>
    </div>
  );
}
