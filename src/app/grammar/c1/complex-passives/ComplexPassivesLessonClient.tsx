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
  { title: "Passive Infinitives", href: "/grammar/c1/passive-infinitives", level: "C1", badge: "bg-sky-600", reason: "Closely related passive constructions at C1 level" },
  { title: "Reported Speech C1", href: "/grammar/c1/reported-speech-c1", level: "C1", badge: "bg-sky-600" },
  { title: "Nominalisation", href: "/grammar/c1/nominalisation", level: "C1", badge: "bg-sky-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "We need to ___ the boiler ___ .", options: ["have / checked", "have / check", "get / checking", "had / check"], answer: 0 },
  { q: "She ___ her portrait ___ by artist.", options: ["had / painted", "got / paint", "has / painting", "had / paint"], answer: 0 },
  { q: "Causative: have + object + ___", options: ["past participle", "bare infinitive", "gerund", "to-infinitive"], answer: 0 },
  { q: "'get + object + pp' is ___.", options: ["Informal causative", "Formal causative", "Active voice", "Unnatural"], answer: 0 },
  { q: "He ___ passport ___ stolen.", options: ["had / stolen", "got / steal", "has / stole", "had / steal"], answer: 0 },
  { q: "In passive: 'make' needs ___.", options: ["to-infinitive", "bare infinitive", "gerund", "past participle"], answer: 0 },
  { q: "She was seen ___ the building.", options: ["leaving", "leave", "to leave", "left"], answer: 0 },
  { q: "They were heard ___ in corridor.", options: ["arguing", "to argue", "argue", "argued"], answer: 0 },
  { q: "She was given ___ to study.", options: ["a scholarship", "with scholarship", "for scholarship", "scholarship for"], answer: 0 },
  { q: "Two-object passive: which object can become subject?", options: ["Either object", "Only direct", "Only indirect", "Neither"], answer: 0 },
  { q: "He gets his car ___ every 6 months.", options: ["serviced", "service", "servicing", "to service"], answer: 0 },
  { q: "She's having a new kitchen ___.", options: ["installed", "install", "installing", "to install"], answer: 0 },
  { q: "They were told ___ essays in.", options: ["to hand", "hand", "handing", "handed"], answer: 0 },
  { q: "They were allowed ___ leave.", options: ["to", "not to", "for", "in order"], answer: 0 },
  { q: "'have something done' meaning:", options: ["Arrange for someone else", "Do it yourself", "Passive voice", "Modal expression"], answer: 0 },
  { q: "She was seen leaving = she ___.", options: ["Was seen as she left", "Left secretly", "Saw someone leaving", "Refused to leave"], answer: 0 },
  { q: "He was made ___ report again.", options: ["to rewrite", "rewrite", "rewriting", "rewritten"], answer: 0 },
  { q: "She was made ___ wait outside.", options: ["to", "for", "into", "about"], answer: 0 },
  { q: "We're getting the office ___.", options: ["redecorated", "redecorate", "redecorating", "to redecorate"], answer: 0 },
  { q: "CEO had resignation letter ___.", options: ["drafted", "draft", "drafting", "to draft"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Complex Passives",
  subtitle: "Causative have/get, two-object passives, make/see/hear",
  level: "C1",
  keyRule: "have/get + object + past participle = causative passive.",
  exercises: [
    {
      number: 1,
      title: "Causative have/get",
      difficulty: "Easy",
      instruction: "Choose the correct causative form.",
      questions: [
        "Need to ___ boiler ___ soon.",
        "She ___ portrait ___ by artist.",
        "I'm going to ___ hair ___ today.",
        "They ___ house ___ last month.",
        "You should ___ documents ___.",
        "He ___ car ___ every 6 months.",
        "She's having kitchen ___.",
        "We're ___ the office ___ this week.",
        "CEO had resignation letter ___.",
        "He ___ passport ___ stolen. (bad)",
      ],
      hint: "have / checked / had / painted / get / cut",
    },
    {
      number: 2,
      title: "Two-Object & Make/See/Hear",
      difficulty: "Medium",
      instruction: "Choose the correct passive form.",
      questions: [
        "I was made ___ report again.",
        "She was seen ___ the building.",
        "They were heard ___ in corridor.",
        "Children not allowed ___.",
        "Students told ___ essays in.",
        "She was given ___ to study.",
        "He was awarded ___ prize.",
        "We were shown ___ to the room.",
        "She was heard ___ loudly.",
        "He was noticed ___ away.",
      ],
      hint: "to rewrite / leaving / arguing / to leave",
    },
    {
      number: 3,
      title: "Passive Reporting Structures",
      difficulty: "Hard",
      instruction: "Choose the correct passive reporting form.",
      questions: [
        "It is said ___ he is talented.",
        "He is believed ___ be innocent.",
        "They are known ___ left early.",
        "It was reported ___ funds missing.",
        "She is thought ___ be an expert.",
        "He is alleged ___ commit fraud.",
        "It is understood ___ talks fail.",
        "They were expected ___ arrive.",
        "It is claimed ___ he escaped.",
        "She is considered ___ best.",
      ],
      hint: "that / to / to have / to be",
    },
    {
      number: 4,
      title: "Rewrite Using Complex Passive",
      difficulty: "Very Hard",
      instruction: "Rewrite using the structure given.",
      questions: [
        "Someone checked the boiler. (have)",
        "Someone painted portrait. (had)",
        "They made him rewrite report.",
        "Someone saw her leave building.",
        "Someone gave her scholarship.",
        "They told students hand in.",
        "Someone stole his passport. (had)",
        "Someone heard them arguing.",
        "They showed us to the room.",
        "Someone drafted the letter. (had)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Causative have/get", answers: ["have / checked", "had / painted", "get / cut", "had / valued", "have / scanned", "gets / serviced", "installed", "getting / redecorated", "drafted", "had / stolen"] },
    { exercise: 2, subtitle: "Two-Object & Make/See/Hear", answers: ["to rewrite", "leaving", "arguing", "to leave", "to hand", "a scholarship", "a prize", "the way", "singing", "slipping"] },
    { exercise: 3, subtitle: "Passive Reporting Structures", answers: ["that", "to be", "to have left", "that", "to be", "to have committed", "that", "to arrive", "that", "to be the"] },
    { exercise: 4, subtitle: "Rewrite Using Complex Passive", answers: ["We had the boiler checked.", "She had her portrait painted.", "He was made to rewrite the report.", "She was seen leaving the building.", "She was given a scholarship.", "Students were told to hand in their essays.", "He had his passport stolen.", "They were heard arguing.", "We were shown to the room.", "He had his resignation letter drafted."] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function ComplexPassivesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Causative have/get + object + past participle",
      instructions: "The causative structure (have/get something done) means arranging for someone else to do something. Choose the correct form.",
      questions: [
        { id: "e1q1", prompt: "We need to ___ the boiler ___ before winter.", options: ["have / checked", "have / check", "get / checking"], correctIndex: 0, explanation: "have + object (the boiler) + past participle (checked) = causative passive." },
        { id: "e1q2", prompt: "She ___ her portrait ___ by a famous artist last year.", options: ["got / paint", "had / painted", "has / painting"], correctIndex: 1, explanation: "had + object + past participle = causative (past tense)." },
        { id: "e1q3", prompt: "I'm going to ___ my hair ___ this afternoon.", options: ["get / cut", "get / cutting", "have / cut"], correctIndex: 0, explanation: "get + object + past participle is the informal equivalent of have + object + pp." },
        { id: "e1q4", prompt: "They ___ their house ___ by the insurance company last month.", options: ["had / valued", "have / value", "got / valuing"], correctIndex: 0, explanation: "had + object + past participle = causative (the valuing was done by someone else)." },
        { id: "e1q5", prompt: "You should ___ those old documents ___ professionally.", options: ["have / scan", "have / scanned", "get / scan"], correctIndex: 1, explanation: "have + object + past participle: have + those old documents + scanned." },
        { id: "e1q6", prompt: "He ___ his car ___ every six months.", options: ["gets / serviced", "gets / service", "has / servicing"], correctIndex: 0, explanation: "gets + object + past participle = regular causative habit." },
        { id: "e1q7", prompt: "She's having a new kitchen ___.", options: ["install", "installing", "installed"], correctIndex: 2, explanation: "have + object + past participle: a new kitchen + installed." },
        { id: "e1q8", prompt: "We're ___ the whole office ___ this weekend.", options: ["getting / redecorate", "getting / redecorated", "having / redecorating"], correctIndex: 1, explanation: "getting + object + past participle = informal causative." },
        { id: "e1q9", prompt: "The CEO had his resignation letter ___.", options: ["drafts", "drafted", "drafting"], correctIndex: 1, explanation: "had + object + past participle: resignation letter + drafted." },
        { id: "e1q10", prompt: "He ___ his passport ___ stolen while on holiday. (bad experience)", options: ["had / stolen", "got / steal", "has / stole"], correctIndex: 0, explanation: "had + object + past participle also describes an unwanted experience suffered by the subject." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Two-object passives & passive with make/let/see/hear",
      instructions: "Some verbs take two objects; either can become the subject of a passive. Verbs like make, see, hear change their infinitive form in the passive. Choose the correct option.",
      questions: [
        { id: "e2q1", prompt: "I was made ___ the whole report again.", options: ["rewrite", "to rewrite", "rewriting"], correctIndex: 1, explanation: "make (active) takes bare infinitive; in the passive, to-infinitive is required: was made to rewrite." },
        { id: "e2q2", prompt: "She was seen ___ the building late at night.", options: ["leave", "to leave", "leaving"], correctIndex: 2, explanation: "see (active) can take -ing; in the passive, both to leave and leaving are possible, but 'leaving' emphasises an ongoing action in progress." },
        { id: "e2q3", prompt: "They were heard ___ in the corridor.", options: ["argue", "to argue", "arguing"], correctIndex: 2, explanation: "hear (active) + -ing → passive: were heard arguing (action in progress)." },
        { id: "e2q4", prompt: "The children were not allowed ___.", options: ["leave", "to leave", "leaving"], correctIndex: 1, explanation: "allow (active) + to-infinitive → passive: were not allowed to leave." },
        { id: "e2q5", prompt: "The students were told ___ their essays in by Friday.", options: ["to hand", "hand", "handing"], correctIndex: 0, explanation: "tell + object + to-infinitive → passive: were told to hand (to-inf stays)." },
        { id: "e2q6", prompt: "She was given ___ to study abroad.", options: ["a scholarship", "with a scholarship", "for a scholarship"], correctIndex: 0, explanation: "give takes two objects: she was given a scholarship = the indirect object becomes the subject." },
        { id: "e2q7", prompt: "He was shown ___ the door politely.", options: ["to", "at", ""], correctIndex: 2, explanation: "show + two objects: he was shown the door (direct object stays, no preposition needed)." },
        { id: "e2q8", prompt: "We were made ___ waiting for three hours.", options: ["to keep", "keep", "keeping"], correctIndex: 0, explanation: "was/were made + to-infinitive in the passive: we were made to keep waiting." },
        { id: "e2q9", prompt: "The suspect was seen ___ the car at around midnight.", options: ["to drive", "drive", "drove"], correctIndex: 0, explanation: "see + bare infinitive (active) → see + to-infinitive (passive): was seen to drive." },
        { id: "e2q10", prompt: "A bonus was promised ___.", options: ["us", "to us", "for us"], correctIndex: 0, explanation: "promise + two objects: a bonus was promised us (or 'to us' — both acceptable, 'us' is more formal)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Get-passive & complex contexts",
      instructions: "The get-passive (get + past participle) is informal and suggests the subject is involved or affected. Choose the best passive form for the context.",
      questions: [
        { id: "e3q1", prompt: "Several protesters ___ during the demonstration.", options: ["were arrested", "got arrested", "Both are correct"], correctIndex: 2, explanation: "Both 'were arrested' (neutral) and 'got arrested' (informal, suggests involvement) are grammatically correct here." },
        { id: "e3q2", prompt: "He ___ in a fight outside the club last night. (informal context, suggests fault)", options: ["was involved", "got involved", "had involved"], correctIndex: 1, explanation: "get + past participle = informal; suggests active involvement or fault on the subject's part." },
        { id: "e3q3", prompt: "The window ___ while the builders were working. (accidental)", options: ["was broken", "got broken", "Both are correct"], correctIndex: 2, explanation: "Both work; 'got broken' emphasises an accidental, unplanned event more strongly." },
        { id: "e3q4", prompt: "She ___ a pay rise last month. (two-object passive)", options: ["was given", "got", "had given"], correctIndex: 0, explanation: "Two-object passive: she was given a pay rise (the indirect object becomes the subject)." },
        { id: "e3q5", prompt: "The report ___ by the committee before it was published.", options: ["had approved", "was approved", "approved"], correctIndex: 1, explanation: "Standard passive: was approved by the committee." },
        { id: "e3q6", prompt: "I need to ___ my teeth ___ — I haven't been to the dentist in ages.", options: ["have / checked", "get / check", "make / checked"], correctIndex: 0, explanation: "Causative: have + object + past participle. 'Get / checked' is also valid but 'have / checked' is given first." },
        { id: "e3q7", prompt: "They ___ pay a fine of £500. (legal obligation — passive of make)", options: ["were made to", "were made", "got made to"], correctIndex: 0, explanation: "make + bare infinitive → passive: were made to + infinitive." },
        { id: "e3q8", prompt: "Nobody ___ leave the building until the alarm was reset.", options: ["was let to", "was allowed to", "was let"], correctIndex: 1, explanation: "let is not normally passivised; use allow instead: was allowed to leave." },
        { id: "e3q9", prompt: "She ___ her laptop ___ twice this year.", options: ["has had / repaired", "has got / repair", "had / repairing"], correctIndex: 0, explanation: "has had + object + past participle = causative (present perfect)." },
        { id: "e3q10", prompt: "The children were heard ___ a song in the next room.", options: ["to sing", "singing", "Both are correct"], correctIndex: 2, explanation: "hear + bare/continuous (active) → passive: were heard to sing OR were heard singing. Both are correct." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using the structure in brackets",
      instructions: "Rewrite each sentence using the structure shown in brackets. Write the full rewritten sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "Someone repaired my car last week. (have — causative)", correct: "i had my car repaired last week", explanation: "have + object + past participle: I had my car repaired." },
        { id: "e4q2", prompt: "The teacher made the students copy out the rules. (passive — make)", correct: "the students were made to copy out the rules", explanation: "make + bare inf → passive: were made + to-infinitive." },
        { id: "e4q3", prompt: "A thief stole her wallet while she was on the bus. (have — bad experience)", correct: "she had her wallet stolen while she was on the bus", explanation: "have + object + past participle = unwanted experience suffered by the subject." },
        { id: "e4q4", prompt: "People heard him shouting in the corridor. (passive — hear)", correct: "he was heard shouting in the corridor", explanation: "hear + -ing → passive: was heard + -ing." },
        { id: "e4q5", prompt: "A mechanic is going to service our van next Tuesday. (get — causative)", correct: "we are going to get our van serviced next tuesday", explanation: "get + object + past participle = informal causative." },
        { id: "e4q6", prompt: "The director gave her the lead role. (passive — two-object, use 'her' as subject)", correct: "she was given the lead role", explanation: "Two-object passive: she (indirect object) was given the lead role." },
        { id: "e4q7", prompt: "The security guard didn't let anyone leave before the police arrived. (passive — let → allow)", correct: "no one was allowed to leave before the police arrived", explanation: "let is not passivised; use allow: was allowed to leave." },
        { id: "e4q8", prompt: "Someone painted our house while we were away. (have — causative)", correct: "we had our house painted while we were away", explanation: "have + object + past participle." },
        { id: "e4q9", prompt: "A neighbour saw the suspect climbing over the fence. (passive — see)", correct: "the suspect was seen climbing over the fence", explanation: "see + -ing → passive: was seen + -ing." },
        { id: "e4q10", prompt: "The company promised the workers a substantial bonus. (passive — use 'the workers' as subject)", correct: "the workers were promised a substantial bonus", explanation: "Two-object passive: the workers (indirect object) were promised a substantial bonus." },
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
        <span className="text-slate-700 font-medium">Complex Passives</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Complex{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Passives</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Beyond the basic passive, C1 includes the <b>causative</b> (<i>have/get something done</i>), <b>two-object passives</b> (<i>she was given a role</i>), <b>passive with perception verbs</b> (<i>was seen leaving / was made to wait</i>), and the informal <b>get-passive</b>. Each has distinct rules and register.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-c1-complex-passives" subject="Complex Passives" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-c1-complex-passives" subject="Complex Passives" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/ellipsis-substitution" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Ellipsis &amp; Substitution →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Complex Passives (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { title: "Causative: have + object + past participle", body: "Arrangement: someone does something for you. Tense is on 'have'.", ex: "I had my car repaired. / She's having her portrait painted. / We'll have it delivered." },
          { title: "Causative: get + object + past participle (informal)", body: "Same meaning as 'have' but more informal. Often implies effort or involvement.", ex: "I got my hair cut. / Can you get the printer fixed?" },
          { title: "Have + object + past participle (bad experience)", body: "When something happens TO the subject (not arranged by them).", ex: "He had his wallet stolen. / She had her car broken into." },
          { title: "Two-object passives", body: "Verbs with indirect + direct objects (give, send, show, offer, tell, promise, teach): either object can be the subject.", ex: "She was given a scholarship. / A bonus was promised the workers. / He was shown the door." },
          { title: "Passive with make", body: "Active: make + bare infinitive. Passive: be made + to-infinitive.", ex: "They made us wait. → We were made to wait. / She was made to sign the contract." },
          { title: "Passive with see/hear/watch", body: "Active: see/hear + bare inf OR -ing. Passive: be seen/heard + to-inf OR -ing.", ex: "He was seen to enter the building. / She was heard arguing with her manager." },
          { title: "Get-passive (informal)", body: "get + past participle = passive with focus on the subject's involvement, accident, or unfortunate event.", ex: "He got arrested. / The window got broken. / She got promoted." },
        ].map(({ title, body, ex }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-1">{title}</div>
            <div className="text-slate-600 text-sm mb-2">{body}</div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Key differences</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div><b>let</b> is NOT normally used in the passive — use <b>allow</b> instead: <i>No one was allowed to leave.</i></div>
          <div><b>make (passive)</b> requires <b>to</b>-infinitive: <i>was made to do it</i> (not *was made do).</div>
          <div><b>have/get something done</b>: bad experience uses the same structure — context makes it clear.</div>
        </div>
      </div>
    </div>
  );
}
