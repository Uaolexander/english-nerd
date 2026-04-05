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
  { q: "'Never have I seen...' is?", options: ["Normal word order", "Formal inversion", "Passive voice", "Reported speech"], answer: 1 },
  { q: "Inversion is triggered by?", options: ["Adjectives at start", "Negative adverbials at start", "Questions only", "Prepositions"], answer: 1 },
  { q: "'Rarely does she go out' — word order?", options: ["Rarely + subject + verb", "Rarely + auxiliary + subject + infinitive", "Rarely + she goes", "Rarely + verb + subject"], answer: 1 },
  { q: "'No sooner had we arrived than...' structure?", options: ["No sooner + subject + verb + than", "No sooner + had + subject + pp + than", "No sooner + pp + subject + than", "No sooner + we had + pp + than"], answer: 1 },
  { q: "'Hardly had she left when...' means?", options: ["She left eventually", "She had just left when", "She left because", "She didn't leave"], answer: 1 },
  { q: "Which begins formal inversion?", options: ["Always", "Never", "Often", "Sometimes"], answer: 1 },
  { q: "'Not only did he lie...' continues with?", options: ["but also he stole", "but also stole", "and also stole", "but he also stole"], answer: 1 },
  { q: "'Under no circumstances ___ you...?'", options: ["do", "you", "are you to", "should"], answer: 2 },
  { q: "Inversion word order is like?", options: ["Statement", "Question", "Passive", "Conditional"], answer: 1 },
  { q: "'Seldom do we see...' — register is?", options: ["Informal/casual", "Formal/literary", "Neutral", "Spoken slang"], answer: 1 },
  { q: "'Only after she arrived did he...' — 'did he' is?", options: ["A question", "Inverted auxiliary", "Passive form", "Past perfect"], answer: 1 },
  { q: "'Little did I know...' means?", options: ["I knew everything", "I knew almost nothing about it", "I told him little", "I had little time"], answer: 1 },
  { q: "Which phrase requires inversion?", options: ["Yesterday I saw", "Not until midnight did I see", "Yesterday, I saw", "I never saw"], answer: 1 },
  { q: "'Barely had I sat down when...' uses which tense?", options: ["Past simple", "Past perfect", "Present perfect", "Future perfect"], answer: 1 },
  { q: "'On no account ___ you do that'?", options: ["should", "you should", "are you to", "do"], answer: 2 },
  { q: "Inversion after 'so + adjective' is?", options: ["So tired I was", "So tired was I", "So tired am I", "I was so tired"], answer: 1 },
  { q: "'Not only did she win but...' — tone is?", options: ["Casual", "Emphatic/formal", "Passive", "Reported"], answer: 1 },
  { q: "'Scarcely had they left when...' = ?", options: ["They left after a long time", "They had just left when", "They left because", "They didn't leave"], answer: 1 },
  { q: "Which adverbial does NOT trigger inversion?", options: ["Never", "Rarely", "Always", "Seldom"], answer: 2 },
  { q: "Formal inversion is common in?", options: ["Casual conversation", "Written and formal English", "Questions only", "Requests"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Formal Inversion",
  subtitle: "Never have I... / Rarely does she...",
  level: "B2",
  keyRule: "Negative adverbial at start → auxiliary + subject (question word order).",
  exercises: [
    {
      number: 1,
      title: "Identify the inverted structure",
      difficulty: "easy" as const,
      instruction: "Choose the correct inverted sentence.",
      questions: [
        "I have never seen such a sunset.",
        "She rarely goes out on weeknights.",
        "No sooner arrived than argument started.",
        "He had hardly left when she arrived.",
        "Not only did he lie — he also stole.",
        "Little did I know what would happen.",
        "Under no circ. should you tell anyone.",
        "Only then did she understand.",
        "Scarcely had they eaten when it ended.",
        "Seldom do we witness such bravery.",
      ],
    },
    {
      number: 2,
      title: "Complete the inversion",
      difficulty: "medium" as const,
      instruction: "Fill in the correct auxiliary/structure.",
      questions: [
        "Never ___ I seen such a thing.",
        "Rarely ___ she arrive late.",
        "No sooner ___ he sat down than...",
        "Hardly ___ she spoken when...",
        "Not only ___ they win but also...",
        "Little ___ we realise how serious it was.",
        "Under no circumstances ___ you leave.",
        "Only after the meeting ___ she tell him.",
        "Seldom ___ he admit he's wrong.",
        "Scarcely ___ they left when it started.",
      ],
    },
    {
      number: 3,
      title: "Inversions in context",
      difficulty: "hard" as const,
      instruction: "Choose the most natural inversion.",
      questions: [
        "I've never met anyone so talented.",
        "He had no sooner agreed, it changed.",
        "She hardly ever complains.",
        "They didn't realise until later.",
        "He not only wrote it but directed it.",
        "You should not tell anyone under any circ.",
        "She had barely arrived when it started.",
        "I knew little of what lay ahead.",
        "We seldom encounter such dedication.",
        "Only when she read it did she understand.",
      ],
    },
    {
      number: 4,
      title: "Write the inversion",
      difficulty: "hard" as const,
      instruction: "Rewrite using formal inversion (lowercase).",
      questions: [
        "I have never tasted such food. (Never...)",
        "She rarely makes mistakes. (Rarely...)",
        "He'd no sooner left than she arrived.",
        "She had barely sat down when it rang.",
        "Not only did he break it, he denied it.",
        "Under no circ. should you agree to this.",
        "I knew little of the plan. (Little...)",
        "Only then did we know the truth.",
        "Scarcely had I slept when alarm went off.",
        "So impressive was the result that...",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Inverted structures", answers: ["Never have I seen", "Rarely does she go", "No sooner had we arrived than", "Hardly had he left when", "Not only did he lie but also stole", "Little did I know", "Under no circumstances should you", "Only then did she understand", "Scarcely had they eaten when", "Seldom do we witness"] },
    { exercise: 2, subtitle: "Auxiliaries", answers: ["have", "does", "had", "had", "did", "did", "should/are you to", "did", "does", "had"] },
    { exercise: 3, subtitle: "Natural inversions", answers: ["Never have I met anyone so talented", "No sooner had he agreed than it changed", "Hardly ever does she complain", "Not until later did they realise", "Not only did he write it but also directed it", "Under no circumstances should you tell anyone", "Barely had she arrived when it started", "Little did I know what lay ahead", "Seldom do we encounter such dedication", "Only when she read it did she understand"] },
    { exercise: 4, subtitle: "Written inversions", answers: ["never have i tasted such food", "rarely does she make mistakes", "no sooner had he left than she arrived", "barely had she sat down when it rang", "not only did he break it but also denied it", "under no circumstances should you agree", "little did i know of the plan", "only then did we know the truth", "scarcely had i slept when the alarm went off", "so impressive was the result that"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Cleft Sentences", href: "/grammar/b2/cleft-sentences", level: "B2", badge: "bg-orange-500", reason: "Another B2 emphasis structure to master alongside inversion" },
  { title: "Participle Clauses", href: "/grammar/b2/participle-clauses", level: "B2", badge: "bg-orange-500", reason: "Advanced structures for formal and written English" },
  { title: "Linking Words", href: "/grammar/b2/linking-words", level: "B2", badge: "bg-orange-500" },
];

export default function InversionLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Identify the inverted structure",
      instructions: "Choose the correct inverted sentence. Remember: negative adverbial at the start → auxiliary + subject (question word order).",
      questions: [
        { id: "e1q1", prompt: "I have never seen such a beautiful sunset. → (inversion)", options: ["Never I have seen such a beautiful sunset.", "Never have I seen such a beautiful sunset.", "Never saw I such a beautiful sunset."], correctIndex: 1, explanation: "Never + have/has/had + subject. Never have I seen…" },
        { id: "e1q2", prompt: "She rarely goes out on weeknights. → (inversion)", options: ["Rarely she goes out on weeknights.", "Rarely does she go out on weeknights.", "Rarely goes she out on weeknights."], correctIndex: 1, explanation: "Rarely + does/did + subject + infinitive. Rarely does she go…" },
        { id: "e1q3", prompt: "We had no sooner arrived than the argument started. → (inversion)", options: ["No sooner had we arrived than the argument started.", "No sooner we had arrived than the argument started.", "No sooner arrived we than the argument started."], correctIndex: 0, explanation: "No sooner + had + subject + pp + than…" },
        { id: "e1q4", prompt: "He not only lied to us but also stole money. → (inversion)", options: ["Not only he lied to us but also stole money.", "Not only did he lie to us but he also stole money.", "Not only lied he to us but also stole money."], correctIndex: 1, explanation: "Not only + did + subject + infinitive… but (he) also…" },
        { id: "e1q5", prompt: "The country had barely recovered when another crisis hit. → (inversion)", options: ["Barely the country had recovered when another crisis hit.", "Barely had the country recovered when another crisis hit.", "Barely recovered the country when another crisis hit."], correctIndex: 1, explanation: "Barely/Hardly/Scarcely + had + subject + pp + when…" },
        { id: "e1q6", prompt: "I will only agree if you put that in writing. → (inversion)", options: ["Only if you put that in writing will I agree.", "Only if you put that in writing I will agree.", "Only will I agree if you put that in writing."], correctIndex: 0, explanation: "Only if + clause + will/would + subject + infinitive." },
        { id: "e1q7", prompt: "She had little realised how serious it was. → (inversion)", options: ["Little she realised how serious it was.", "Little did she realise how serious it was.", "Little has she realised how serious it was."], correctIndex: 1, explanation: "Little + did + subject + infinitive." },
        { id: "e1q8", prompt: "You should never underestimate your opponent. → (inversion)", options: ["Under no circumstances should you underestimate your opponent.", "Under no circumstances you should underestimate your opponent.", "Under no circumstances underestimate should you your opponent."], correctIndex: 0, explanation: "Under no circumstances + should/must/can + subject + infinitive." },
        { id: "e1q9", prompt: "I have only just understood what happened. → (inversion)", options: ["Only just have I understood what happened.", "Only just I understood what happened.", "Only just did I understood what happened."], correctIndex: 0, explanation: "Only just + have + subject + pp." },
        { id: "e1q10", prompt: "They had scarcely sat down when the alarm went off. → (inversion)", options: ["Scarcely they had sat down when the alarm went off.", "Scarcely had they sat down when the alarm went off.", "Scarcely sat they down when the alarm went off."], correctIndex: 1, explanation: "Scarcely + had + subject + pp + when…" },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Choose the correct inverted form",
      instructions: "Select the grammatically correct inverted sentence for each situation.",
      questions: [
        { id: "e2q1", prompt: "Under no circumstances ___ this information leave this room.", options: ["this information should", "should this information", "this information must"], correctIndex: 1, explanation: "Under no circumstances + should/must + subject." },
        { id: "e2q2", prompt: "Not until she retired ___ she travel the world.", options: ["she was able to", "was she able to", "did she able to"], correctIndex: 1, explanation: "Not until + time clause + was/did + subject + infinitive." },
        { id: "e2q3", prompt: "Seldom ___ I enjoyed a meal so much.", options: ["I have", "have I", "do I have"], correctIndex: 1, explanation: "Seldom + have + subject + pp." },
        { id: "e2q4", prompt: "No sooner ___ the phone than it rang again.", options: ["I had put down", "had I put down", "I put down"], correctIndex: 1, explanation: "No sooner + had + subject + pp + than." },
        { id: "e2q5", prompt: "Not only ___ late, but he also forgot the documents.", options: ["he arrived", "arrived he", "did he arrive"], correctIndex: 2, explanation: "Not only + did + subject + infinitive." },
        { id: "e2q6", prompt: "Only when she apologised ___ he agree to talk.", options: ["he did", "did he", "he agreed"], correctIndex: 1, explanation: "Only when + clause + did/would/could + subject." },
        { id: "e2q7", prompt: "Hardly ___ the speech when someone interrupted.", options: ["she had begun", "had she begun", "she began"], correctIndex: 1, explanation: "Hardly + had + subject + pp + when/before." },
        { id: "e2q8", prompt: "At no point ___ they consider giving up.", options: ["they did", "did they", "they considered"], correctIndex: 1, explanation: "At no point + did/could/would + subject." },
        { id: "e2q9", prompt: "Such ___ the pressure that several ministers resigned.", options: ["the pressure was", "was the pressure", "pressure was"], correctIndex: 1, explanation: "Such + was/is + subject = inverted structure for emphasis." },
        { id: "e2q10", prompt: "So ___ the crowd that the event was cancelled.", options: ["large was", "large the crowd was", "was large"], correctIndex: 0, explanation: "So + adjective + was/is + subject." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Inversion in context",
      instructions: "Read the full context. Choose the most natural inverted rewrite.",
      questions: [
        { id: "e3q1", prompt: "The CEO lied to the board AND concealed evidence. (emphasise both)", options: ["Not only did the CEO lie to the board, but he also concealed evidence.", "Not only the CEO lied to the board, but also concealed evidence.", "Not only lied the CEO to the board, but also concealed evidence."], correctIndex: 0, explanation: "Not only did + subject + infinitive, but (subject) also + past simple." },
        { id: "e3q2", prompt: "They had just left when the fire broke out.", options: ["No sooner they had left than the fire broke out.", "No sooner had they left than the fire broke out.", "Hardly did they leave than the fire broke out."], correctIndex: 1, explanation: "No sooner had + subject + pp + than." },
        { id: "e3q3", prompt: "You must not discuss this with anyone under any circumstances.", options: ["Under no circumstances you must discuss this with anyone.", "Under no circumstances must you discuss this with anyone.", "Under no circumstances discuss you this with anyone."], correctIndex: 1, explanation: "Under no circumstances + must/should + subject." },
        { id: "e3q4", prompt: "The response was so overwhelming that they had to delay the launch.", options: ["So overwhelming was the response that they had to delay the launch.", "So was overwhelming the response that they delayed the launch.", "Such the response was overwhelming that they delayed it."], correctIndex: 0, explanation: "So + adjective + was + subject + that…" },
        { id: "e3q5", prompt: "I will only help you if you are completely honest with me.", options: ["Only if you are completely honest with me will I help you.", "Only if you are completely honest with me I will help you.", "Will I help you only if you are completely honest with me."], correctIndex: 0, explanation: "Only if + condition + will/would + subject + infinitive." },
        { id: "e3q6", prompt: "They had barely reached the hotel when the storm arrived.", options: ["Barely they had reached the hotel when the storm arrived.", "Barely had they reached the hotel when the storm arrived.", "Barely did they reach the hotel when the storm arrived."], correctIndex: 1, explanation: "Barely/Scarcely/Hardly + had + subject + pp + when." },
        { id: "e3q7", prompt: "The situation was such that evacuation was necessary.", options: ["Such was the situation that evacuation was necessary.", "Such the situation was that evacuation was necessary.", "So was the situation that evacuation was necessary."], correctIndex: 0, explanation: "Such + was/is + subject + that…" },
        { id: "e3q8", prompt: "She had little idea what was waiting for her.", options: ["Little she had idea what was waiting for her.", "Little did she know what was waiting for her.", "Little had she idea what was waiting for her."], correctIndex: 1, explanation: "Little did + subject + know/realise/imagine…" },
        { id: "e3q9", prompt: "He became famous only after his death.", options: ["Only after his death he became famous.", "Only after his death became he famous.", "Only after his death did he become famous."], correctIndex: 2, explanation: "Only after + noun phrase/clause + did + subject + infinitive." },
        { id: "e3q10", prompt: "She has never in her life been treated with such disrespect.", options: ["Never in her life she has been treated with such disrespect.", "Never in her life has she been treated with such disrespect.", "Never in her life did she treated with such disrespect."], correctIndex: 1, explanation: "Never + has/have + subject + pp." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using inversion",
      instructions: "Rewrite the sentence starting with the word(s) in brackets. Write the complete rewritten sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "I have rarely seen such talent. (Rarely)", correct: "rarely have i seen such talent", explanation: "Rarely + have + subject + pp." },
        { id: "e4q2", prompt: "They had barely settled in when problems began. (Barely)", correct: "barely had they settled in when problems began", explanation: "Barely + had + subject + pp + when." },
        { id: "e4q3", prompt: "You must not under any circumstances reveal this information. (Under no circumstances)", correct: "under no circumstances must you reveal this information", explanation: "Under no circumstances + must + subject + infinitive." },
        { id: "e4q4", prompt: "She not only won the competition but also broke the record. (Not only)", correct: "not only did she win the competition but she also broke the record", explanation: "Not only did + subject + infinitive, but subject also + past simple." },
        { id: "e4q5", prompt: "He had no sooner arrived home than his phone rang. (No sooner)", correct: "no sooner had he arrived home than his phone rang", explanation: "No sooner + had + subject + pp + than." },
        { id: "e4q6", prompt: "The government will only act if there is public pressure. (Only if)", correct: "only if there is public pressure will the government act", explanation: "Only if + condition + will/would + subject + infinitive." },
        { id: "e4q7", prompt: "She had little idea how serious the situation was. (Little)", correct: "little did she know how serious the situation was", explanation: "Little did + subject + know/realise…" },
        { id: "e4q8", prompt: "The crowd was so large that the organisers were overwhelmed. (So)", correct: "so large was the crowd that the organisers were overwhelmed", explanation: "So + adjective + was + subject + that…" },
        { id: "e4q9", prompt: "He became a household name only after the film was released. (Only after)", correct: "only after the film was released did he become a household name", explanation: "Only after + clause + did + subject + infinitive." },
        { id: "e4q10", prompt: "I have seldom felt so uncomfortable. (Seldom)", correct: "seldom have i felt so uncomfortable", explanation: "Seldom + have + subject + pp." },
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
        <span className="text-slate-700 font-medium">Inversion</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Inversion</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Inversion means placing an auxiliary verb <b>before</b> the subject — like in a question — after certain negative or restrictive adverbials. It adds <b>emphasis and formality</b>: <i>Never have I seen…</i> / <i>Not only did he lie…</i> / <i>Rarely does she…</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-inversion" subject="Formal Inversion" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b2" allLabel="All B2 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b2-inversion" subject="Formal Inversion" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/cleft-sentences" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Cleft Sentences →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Inversion (B2)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { adv: "Never / Rarely / Seldom", struct: "Never have I…", ex: "Never have I seen such chaos. / Seldom does she complain." },
          { adv: "No sooner … than", struct: "No sooner had + S + pp + than…", ex: "No sooner had she left than it started raining." },
          { adv: "Hardly / Barely / Scarcely … when", struct: "Hardly had + S + pp + when…", ex: "Hardly had they arrived when the power cut out." },
          { adv: "Not only … but also", struct: "Not only did + S + inf…", ex: "Not only did he lose, but he also embarrassed himself." },
          { adv: "Under no circumstances", struct: "Under no circumstances should + S…", ex: "Under no circumstances should you open that door." },
          { adv: "Only if / Only when / Only after", struct: "Only if + clause + will/did + S…", ex: "Only if you sign will I proceed." },
          { adv: "Little / Hardly", struct: "Little did + S + know/realise…", ex: "Little did she know what lay ahead." },
          { adv: "So + adj / Such + noun", struct: "So great was the demand that…", ex: "Such was the chaos that the event was called off." },
        ].map(({ adv, struct, ex }) => (
          <div key={adv} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-orange-700 text-sm">{adv}</span>
              <span className="text-xs text-slate-500 font-mono">→ {struct}</span>
            </div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black">Rule:</span> Inversion = auxiliary verb BEFORE subject (question word order). If there is no auxiliary in the positive sentence, use <i>do/does/did</i>: <i>Rarely does she smile.</i>
        </div>
      </div>
    </div>
  );
}
