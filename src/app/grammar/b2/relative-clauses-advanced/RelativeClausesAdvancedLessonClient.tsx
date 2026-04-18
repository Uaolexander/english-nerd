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
import { useLiveSync } from "@/lib/useLiveSync";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Defining relative clause is?", options: ["In commas, extra info", "Essential to identify the noun", "Always uses 'which'", "Can be omitted freely"], answer: 1 },
  { q: "Non-defining relative clause is?", options: ["Essential info, no commas", "Extra info, always in commas", "Uses only 'that'", "Identifies the noun"], answer: 1 },
  { q: "In non-defining clauses, 'that' is?", options: ["Preferred", "Optional", "NOT used", "Required"], answer: 2 },
  { q: "'The man WHO called me' — 'who' refers to?", options: ["A thing", "A person", "A place", "A time"], answer: 1 },
  { q: "'The book WHICH/THAT I read' — these words refer to?", options: ["A person", "A thing", "A place", "A time"], answer: 1 },
  { q: "'The town WHERE I grew up' — 'where' refers to?", options: ["A person", "A thing", "A place", "A time"], answer: 2 },
  { q: "'The year WHEN she was born' — 'when' refers to?", options: ["A person", "A place", "A time", "A thing"], answer: 2 },
  { q: "'The reason WHY she left' — 'why' refers to?", options: ["A person", "A time", "A place", "A reason"], answer: 3 },
  { q: "In a defining clause, the pronoun can be omitted when?", options: ["It's the subject", "It's the object", "It refers to a person", "It follows a comma"], answer: 1 },
  { q: "'WHOSE' in relative clauses shows?", options: ["Location", "Possession", "Time", "Reason"], answer: 1 },
  { q: "'The contract, the terms of WHICH were complex...' uses?", options: ["Informal relative clause", "Formal relative clause with preposition", "Defining relative clause", "Reduced relative clause"], answer: 1 },
  { q: "Reduced relative clause replaces 'who/which + be' with?", options: ["A gerund or past participle", "A full clause", "A preposition", "An adjective only"], answer: 0 },
  { q: "'The man standing there' = ?", options: ["The man who stands there", "The man who is standing there", "The man stood there", "The standing man"], answer: 1 },
  { q: "Non-defining relative clauses give?", options: ["Essential identification", "Extra, non-essential information", "Conditional information", "Temporal information only"], answer: 1 },
  { q: "'The film, which I loved, ...' — commas mean?", options: ["Defining clause", "Non-defining clause", "Reduced clause", "Conditional clause"], answer: 1 },
  { q: "Which sentence is WRONG?", options: ["The book that I read was great", "The man, that called me, was rude", "The car which is red is mine", "The town where I grew up is small"], answer: 1 },
  { q: "Formal preposition placement in relative clause?", options: ["The person I talked to", "The person to whom I talked", "The person to who I talked", "The person whom I talked"], answer: 1 },
  { q: "Reduced passive relative clause: 'the car ___ last year'?", options: ["which stolen", "stolen", "that was stolen", "being stolen"], answer: 1 },
  { q: "Which is a correct non-defining clause?", options: ["The woman who works there is nice", "My sister, who works there, is nice", "The woman, that works there, is nice", "My sister who works there is nice"], answer: 1 },
  { q: "In formal English, 'whom' replaces 'who' when?", options: ["Subject of clause", "Object of clause or preposition", "After commas", "Before commas"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Advanced Relative Clauses",
  subtitle: "Defining, non-defining, reduced clauses",
  level: "B2",
  keyRule: "Defining = no commas, 'that' OK. Non-defining = commas, no 'that'.",
  exercises: [
    {
      number: 1,
      title: "Defining or non-defining?",
      difficulty: "easy" as const,
      instruction: "Choose: defining or non-defining clause.",
      questions: [
        "The book that I read was amazing.",
        "My mother, who is a doctor, lives in Paris.",
        "The film which won the award was long.",
        "London, where I was born, is huge.",
        "The man who called me was rude.",
        "My car, which I bought last year, broke down.",
        "The woman whose handbag was stolen called police.",
        "Sarah, whose sister I know, moved abroad.",
        "The house that was built in 1900 is listed.",
        "Oxford, where she studied, is beautiful.",
      ],
    },
    {
      number: 2,
      title: "Choose the correct relative pronoun",
      difficulty: "medium" as const,
      instruction: "Choose who, which, whose, where, when, why.",
      questions: [
        "The girl ___ won the prize smiled.",
        "The book ___ I lost was expensive.",
        "The company ___ products are popular.",
        "That's the town ___ I grew up.",
        "I remember the day ___ we first met.",
        "That's the reason ___ I left.",
        "The woman ___ I interviewed was great.",
        "The flat, ___ is on the 5th floor, is small.",
        "The year ___ she graduated was 2015.",
        "The man ___ car was stolen filed a report.",
      ],
    },
    {
      number: 3,
      title: "Reduced relative clauses",
      difficulty: "hard" as const,
      instruction: "Reduce the relative clause.",
      questions: [
        "The man who is standing there is my boss.",
        "The package which was sent yesterday arrived.",
        "The students who were selected joined the team.",
        "The woman who is sitting by the window is my aunt.",
        "The report which was submitted last week is missing.",
        "The dog that is barking is next door.",
        "The company which was founded in 1990 grew fast.",
        "The items that were ordered have arrived.",
        "The candidate who was interviewed last was best.",
        "The house that was built last year is already sold.",
      ],
    },
    {
      number: 4,
      title: "Formal and advanced relative clauses",
      difficulty: "hard" as const,
      instruction: "Rewrite using formal or advanced structures.",
      questions: [
        "The person I talked to was very helpful.",
        "This is the book I was telling you about.",
        "The woman I met her sister is very kind.",
        "The agreement the terms of it were complex.",
        "She's the director I worked for.",
        "This is the office I spent 10 years in.",
        "The project I was in charge of was cancelled.",
        "The colleague I recommended was promoted.",
        "The city I was born in is now very different.",
        "The contract I signed last month is now void.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Defining/non-defining", answers: ["Defining", "Non-defining", "Defining", "Non-defining", "Defining", "Non-defining", "Defining", "Non-defining", "Defining", "Non-defining"] },
    { exercise: 2, subtitle: "Relative pronouns", answers: ["who", "which/that", "whose", "where", "when", "why", "whom/who", "which", "when", "whose"] },
    { exercise: 3, subtitle: "Reduced clauses", answers: ["The man standing there", "The package sent yesterday", "The students selected", "The woman sitting by the window", "The report submitted last week", "The barking dog", "The company founded in 1990", "The ordered items", "The candidate interviewed last", "The house built last year"] },
    { exercise: 4, subtitle: "Formal structures", answers: ["The person to whom I talked", "This is the book about which I was telling you", "The woman whose sister I met", "The agreement the terms of which were complex", "She's the director for whom I worked", "This is the office in which I spent 10 years", "The project of which I was in charge", "The colleague whom I recommended", "The city in which I was born", "The contract which I signed"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Participle Clauses", href: "/grammar/b2/participle-clauses", level: "B2", badge: "bg-orange-500", reason: "Participle clauses are a concise alternative to relative clauses" },
  { title: "Cleft Sentences", href: "/grammar/b2/cleft-sentences", level: "B2", badge: "bg-orange-500", reason: "Cleft sentences use relative clauses for emphasis" },
  { title: "Advanced Reported Speech", href: "/grammar/b2/reported-speech-advanced", level: "B2", badge: "bg-orange-500" },
];

export default function RelativeClausesAdvancedLessonClient() {
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
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — who / whom / which / whose / where",
      instructions: "Choose the correct relative pronoun. Remember: whom = object form (formal); whose = possession; where = place.",
      questions: [
        { id: "e1q1", prompt: "The woman ___ I spoke to was very helpful.", options: ["who", "whom", "whose"], correctIndex: 1, explanation: "whom = object of the verb (I spoke to her → to whom). Formal English." },
        { id: "e1q2", prompt: "The company ___ offices are in Berlin was bought by a US firm.", options: ["which", "whose", "where"], correctIndex: 1, explanation: "whose = possessive (the company's offices)." },
        { id: "e1q3", prompt: "This is the hotel ___ we stayed last summer.", options: ["which", "that", "where"], correctIndex: 2, explanation: "where = place (we stayed in the hotel → where we stayed)." },
        { id: "e1q4", prompt: "The report ___ was published yesterday has caused controversy.", options: ["who", "which", "whom"], correctIndex: 1, explanation: "which = subject of the relative clause (the report was published)." },
        { id: "e1q5", prompt: "She's the only person ___ opinion I really trust.", options: ["who", "whom", "whose"], correctIndex: 2, explanation: "whose = possessive (her opinion → whose opinion)." },
        { id: "e1q6", prompt: "The scientist ___ won the prize gave an inspiring speech.", options: ["whom", "whose", "who"], correctIndex: 2, explanation: "who = subject of the verb (the scientist won)." },
        { id: "e1q7", prompt: "The city ___ I was born has changed dramatically.", options: ["where", "which", "whose"], correctIndex: 0, explanation: "where = place of birth." },
        { id: "e1q8", prompt: "The candidate ___ application was rejected appealed the decision.", options: ["who", "whose", "whom"], correctIndex: 1, explanation: "whose = possessive (the candidate's application)." },
        { id: "e1q9", prompt: "The book ___ she recommended was out of stock.", options: ["who", "whom", "which"], correctIndex: 2, explanation: "which = object of the verb (she recommended the book)." },
        { id: "e1q10", prompt: "He's someone ___ I've always looked up to.", options: ["which", "whom", "whose"], correctIndex: 1, explanation: "whom = object of phrasal verb (I've looked up to him → whom I've looked up to)." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Defining vs non-defining relative clauses",
      instructions: "Choose defining (no commas — identifies the noun) or non-defining (with commas — adds extra info). Select the correctly punctuated sentence.",
      questions: [
        { id: "e2q1", prompt: "Which sentence is correct? (There is only one Eiffel Tower — the clause adds extra info.)", options: ["The Eiffel Tower which is in Paris was built in 1889.", "The Eiffel Tower, which is in Paris, was built in 1889."], correctIndex: 1, explanation: "Non-defining clause: The Eiffel Tower is unique — commas are required." },
        { id: "e2q2", prompt: "Which sentence is correct? (Many students exist — the clause identifies which ones.)", options: ["Students who study regularly tend to do better.", "Students, who study regularly, tend to do better."], correctIndex: 0, explanation: "Defining clause: identifies which students — no commas." },
        { id: "e2q3", prompt: "In a non-defining relative clause, can you use 'that'?", options: ["Yes, always", "No, never", "Only in informal speech"], correctIndex: 1, explanation: "Non-defining clauses NEVER use 'that' — only who/which/whose/where/when." },
        { id: "e2q4", prompt: "Which is the correct non-defining version? (My sister is a doctor — extra info about her.)", options: ["My sister who is a doctor lives in London.", "My sister, who is a doctor, lives in London."], correctIndex: 1, explanation: "Non-defining: adds extra info about my sister (I have one sister). Commas required." },
        { id: "e2q5", prompt: "In a defining clause, can you omit the relative pronoun if it is the object?", options: ["No, never", "Yes, always", "Yes — when it is the object of the verb"], correctIndex: 2, explanation: "Contact clauses: 'The book (that) I read was great.' Object pronouns can be omitted in defining clauses." },
        { id: "e2q6", prompt: "The sentence 'This is the reason why I left' — can 'why' be replaced?", options: ["No", "Yes — with 'that' or omit it entirely", "Yes — with 'which'"], correctIndex: 1, explanation: "The reason why / the reason that / the reason I left — all correct in defining clauses." },
        { id: "e2q7", prompt: "Which relative pronoun links to the whole previous clause? e.g. 'He passed the exam, ___ surprised everyone.'", options: ["that", "which", "who"], correctIndex: 1, explanation: "'which' in a non-defining clause can refer to the entire previous clause." },
        { id: "e2q8", prompt: "Choose the correct defining clause: (Many artists exist — the clause identifies which ones.)", options: ["Artists, who became famous after death, are often underrated.", "Artists who became famous after death are often underrated."], correctIndex: 1, explanation: "Defining: no commas — identifies a specific group of artists." },
        { id: "e2q9", prompt: "Sentence: 'The day ___ we first met was rainy.' Best choice?", options: ["which", "when", "that"], correctIndex: 1, explanation: "when = time reference in a relative clause (the day when = on which day)." },
        { id: "e2q10", prompt: "'She lied to me, ___ I found unacceptable.' Best relative pronoun?", options: ["that", "who", "which"], correctIndex: 2, explanation: "which = refers to the whole clause 'she lied to me'. Non-defining." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Prepositions + whom/which and reduced relative clauses",
      instructions: "Choose the correct formal structure. Focus on preposition placement and reduced (participle) relative clauses.",
      questions: [
        { id: "e3q1", prompt: "The manager ___ I reported the problem had already left. (formal)", options: ["who I reported the problem to", "to whom I reported the problem", "whom I reported the problem"], correctIndex: 1, explanation: "Formal: preposition before whom. Informal: who … to." },
        { id: "e3q2", prompt: "The conference ___ she presented her research was in Vienna.", options: ["at which", "in which", "on which"], correctIndex: 0, explanation: "at a conference = at which (preposition must match)." },
        { id: "e3q3", prompt: "'The man sitting in the corner is my boss.' The reduced clause replaces:", options: ["who sits", "who is sitting", "who sat"], correctIndex: 1, explanation: "sitting = reduced present relative clause (= who is sitting — current action)." },
        { id: "e3q4", prompt: "'The letter written by the CEO caused a scandal.' The reduced clause means:", options: ["that was written", "that wrote", "that had been writing"], correctIndex: 0, explanation: "Past participle (written) = reduced passive relative (= that was written)." },
        { id: "e3q5", prompt: "The law ___ this case falls has not been updated for 20 years.", options: ["under which", "which under", "in which"], correctIndex: 0, explanation: "'under this law' → under which (formal fronted preposition)." },
        { id: "e3q6", prompt: "'Anyone ___ wants to join should register by Friday.'", options: ["whom", "whose", "who"], correctIndex: 2, explanation: "who = subject of the defining relative clause." },
        { id: "e3q7", prompt: "Reduce: 'The students who had finished the exam left early.'", options: ["The students finishing the exam left early.", "The students having finished the exam left early.", "The students finished the exam left early."], correctIndex: 1, explanation: "having + pp = reduced perfect relative clause (completed before leaving)." },
        { id: "e3q8", prompt: "The company ___ I worked for twenty years has just gone bankrupt.", options: ["that", "for which", "which for"], correctIndex: 1, explanation: "'I worked for the company' → for which (formal) or that/which + for (informal)." },
        { id: "e3q9", prompt: "'Most of ___ applicants were rejected.' Best quantifying relative structure?", options: ["which the", "whom the", "the"], correctIndex: 0, explanation: "most of which = quantifying relative clause referring to things (applicants = countable things in formal)." },
        { id: "e3q10", prompt: "He gave a long speech, most of ___ was irrelevant.", options: ["that", "which", "whom"], correctIndex: 1, explanation: "most of which = quantifying non-defining relative referring to the speech." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using a relative clause",
      instructions: "Combine the two sentences using an appropriate relative clause. Write the complete combined sentence (lowercase, no full stop needed).",
      questions: [
        { id: "e4q1", prompt: "I met a man. His wife is a famous architect.", correct: "i met a man whose wife is a famous architect", explanation: "whose = possessive relative pronoun." },
        { id: "e4q2", prompt: "The report has been published. It caused a lot of controversy.", correct: "the report, which caused a lot of controversy, has been published", explanation: "Non-defining: commas + which (the report is specific/unique in context)." },
        { id: "e4q3", prompt: "She works for a company. The company was founded in 1902.", correct: "she works for a company that was founded in 1902", explanation: "Defining relative clause: that/which was founded." },
        { id: "e4q4", prompt: "I spoke to a professor. I had read all of her books. (formal, object)", correct: "i spoke to a professor all of whose books i had read", explanation: "all of whose = quantifying relative with whose (formal)." },
        { id: "e4q5", prompt: "We visited the village. My grandfather was born there.", correct: "we visited the village where my grandfather was born", explanation: "where = place in a relative clause." },
        { id: "e4q6", prompt: "The woman is a doctor. She is standing over there. (reduce the clause)", correct: "the woman standing over there is a doctor", explanation: "Reduced present participle clause: standing = who is standing." },
        { id: "e4q7", prompt: "The documents were signed by the CEO. They are now public. (formal, preposition)", correct: "the documents signed by the ceo are now public", explanation: "Reduced past participle: signed by = that were signed by." },
        { id: "e4q8", prompt: "He recommended a book. I found the book fascinating.", correct: "he recommended a book which i found fascinating", explanation: "Object relative clause: which (that) I found. Pronoun can be omitted too." },
        { id: "e4q9", prompt: "She told me something. I found it hard to believe. (use which)", correct: "she told me something which i found hard to believe", explanation: "which refers to the thing she told me (object of found)." },
        { id: "e4q10", prompt: "There were fifty candidates. Only five of them were shortlisted. (use of whom)", correct: "there were fifty candidates, only five of whom were shortlisted", explanation: "Quantifying non-defining clause: only five of whom = of the fifty candidates." },
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

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo }); }
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo: n }); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Relative Clauses: Advanced</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Relative Clauses:{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Advanced</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        At B2 level, relative clauses involve <b>formal preposition + whom/which</b> (<i>the person to whom I spoke</i>), <b>non-defining clauses</b> with commas, <b>quantifying relatives</b> (<i>most of which</i>), and <b>reduced clauses</b> using participles (<i>the man sitting there</i>).
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-relative-clauses-advanced" subject="Advanced Relative Clauses" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                                  <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => { setMcqAnswers((p) => { const n = { ...p, [q.id]: oi }; broadcast({ answers: n, checked, exNo }); return n; }); }} />
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
                      <button onClick={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b2" allLabel="All B2 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b2-relative-clauses-advanced" subject="Advanced Relative Clauses" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/participle-clauses" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Participle Clauses →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Relative Clauses: Advanced (B2)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { label: "who / that", note: "Subject of the clause (people)", ex: "The man who called was my uncle." },
          { label: "whom", note: "Object form (formal — people)", ex: "The person to whom I spoke was very helpful." },
          { label: "whose", note: "Possessive (people & things)", ex: "A company whose profits fell by 30%." },
          { label: "which", note: "Things and clauses (also non-defining)", ex: "The report, which was published yesterday, caused a stir." },
          { label: "where / when / why", note: "Place / time / reason", ex: "The year when it happened. The reason why she left." },
          { label: "Preposition + which/whom", note: "Formal structure", ex: "The committee on which she sits. The colleague with whom I work." },
          { label: "Quantifying relatives", note: "most/some/none/all + of which/whom", ex: "There were 20 candidates, none of whom had experience." },
          { label: "Reduced relative clauses", note: "-ing (active) / -ed (passive) / having + pp (perfect)", ex: "The woman sitting there. The letter written by him. Having finished, she left." },
        ].map(({ label, note, ex }) => (
          <div key={label} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-orange-700 text-sm">{label}</span>
              <span className="text-xs text-slate-500">— {note}</span>
            </div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800 space-y-1">
          <div><span className="font-black">Defining vs Non-defining:</span> Defining = no commas, identifies the noun. Non-defining = commas, adds extra info.</div>
          <div>Non-defining clauses <span className="font-black">never</span> use <i>that</i>.</div>
        </div>
      </div>
    </div>
  );
}
