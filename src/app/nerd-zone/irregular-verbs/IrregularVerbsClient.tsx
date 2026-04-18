"use client";

import { useState, useMemo } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import { useLiveSync } from "@/lib/useLiveSync";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const VERBS: [string, string, string][] = [
  ["be",         "was / were",       "been"],
  ["begin",      "began",            "begun"],
  ["break",      "broke",            "broken"],
  ["bring",      "brought",          "brought"],
  ["build",      "built",            "built"],
  ["buy",        "bought",           "bought"],
  ["catch",      "caught",           "caught"],
  ["choose",     "chose",            "chosen"],
  ["come",       "came",             "come"],
  ["do",         "did",              "done"],
  ["drink",      "drank",            "drunk"],
  ["eat",        "ate",              "eaten"],
  ["fall",       "fell",             "fallen"],
  ["feel",       "felt",             "felt"],
  ["find",       "found",            "found"],
  ["fly",        "flew",             "flown"],
  ["forget",     "forgot",           "forgotten"],
  ["get",        "got",              "gotten"],
  ["give",       "gave",             "given"],
  ["go",         "went",             "gone"],
  ["have",       "had",              "had"],
  ["hear",       "heard",            "heard"],
  ["keep",       "kept",             "kept"],
  ["know",       "knew",             "known"],
  ["learn",      "learned / learnt", "learned / learnt"],
  ["leave",      "left",             "left"],
  ["lose",       "lost",             "lost"],
  ["make",       "made",             "made"],
  ["meet",       "met",              "met"],
  ["pay",        "paid",             "paid"],
  ["put",        "put",              "put"],
  ["read",       "read",             "read"],
  ["run",        "ran",              "run"],
  ["say",        "said",             "said"],
  ["see",        "saw",              "seen"],
  ["sell",       "sold",             "sold"],
  ["send",       "sent",             "sent"],
  ["sit",        "sat",              "sat"],
  ["sleep",      "slept",            "slept"],
  ["speak",      "spoke",            "spoken"],
  ["spend",      "spent",            "spent"],
  ["stand",      "stood",            "stood"],
  ["take",       "took",             "taken"],
  ["teach",      "taught",           "taught"],
  ["tell",       "told",             "told"],
  ["think",      "thought",          "thought"],
  ["understand", "understood",       "understood"],
  ["wear",       "wore",             "worn"],
  ["win",        "won",              "won"],
  ["write",      "wrote",            "written"],
];

/* ─── SpeedRound ─────────────────────────────────────────────────────────── */

const SPEED_QUESTIONS: SRQuestion[] = [
  // Fill in Past Simple (base → ____ → participle)
  { q: "go → ____ → gone?",          options: ["went","goed","come","gone"],        answer: 0 },
  { q: "write → ____ → written?",    options: ["writ","writed","wrote","writing"],  answer: 2 },
  { q: "eat → ____ → eaten?",        options: ["eated","ate","eaten","eating"],     answer: 1 },
  { q: "see → ____ → seen?",         options: ["seen","seed","sawn","saw"],         answer: 3 },
  { q: "do → ____ → done?",          options: ["does","doed","did","done"],         answer: 2 },
  { q: "break → ____ → broken?",     options: ["broken","breaked","braked","broke"],answer: 3 },
  { q: "come → ____ → come?",        options: ["comed","came","coming","come"],     answer: 1 },
  { q: "give → ____ → given?",       options: ["gived","given","give","gave"],      answer: 3 },
  { q: "find → ____ → found?",       options: ["find","finded","found","founds"],   answer: 2 },
  { q: "run → ____ → run?",          options: ["runned","ranned","run","ran"],      answer: 3 },
  // Fill in Past Participle (base → past simple → ____)
  { q: "take → took → ____?",        options: ["taken","took","taked","taking"],    answer: 0 },
  { q: "speak → spoke → ____?",      options: ["speaked","spoken","spoke","speaking"], answer: 1 },
  { q: "know → knew → ____?",        options: ["knew","knowed","knowing","known"],  answer: 3 },
  { q: "fly → flew → ____?",         options: ["flown","flew","flied","flying"],    answer: 0 },
  { q: "begin → began → ____?",      options: ["beginning","began","beginned","begun"], answer: 3 },
  { q: "fall → fell → ____?",        options: ["falled","fallen","fell","falling"], answer: 1 },
  { q: "drink → drank → ____?",      options: ["drank","drinked","drunk","drinking"],answer: 2 },
  { q: "choose → chose → ____?",     options: ["chose","choosed","choosing","chosen"], answer: 3 },
  { q: "forget → forgot → ____?",    options: ["forgotten","forgot","forgeted","forgetting"], answer: 0 },
  { q: "wear → wore → ____?",        options: ["wore","weared","worn","wearing"],   answer: 2 },
];

/* ─── Exercise types ─────────────────────────────────────────────────────── */

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
  | { type: "mcq";   title: string; instructions: string; questions: MCQ[]   }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

/* ─── Exercises ──────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExerciseSet> = {
  1: {
    type: "mcq",
    title: "Exercise 1 — Choose Past Simple",
    instructions: "Choose the correct Past Simple form of the verb in bold.",
    questions: [
      { id:"e1q1",  prompt:"Yesterday, I ___ to school.",              options:["went","goed","gone"],    correctIndex:0, explanation:"go → went (irregular)" },
      { id:"e1q2",  prompt:"She ___ a letter to her friend.",          options:["wrote","written","writed"], correctIndex:0, explanation:"write → wrote" },
      { id:"e1q3",  prompt:"We ___ a great film last night.",          options:["seen","sawed","saw"],    correctIndex:2, explanation:"see → saw" },
      { id:"e1q4",  prompt:"He ___ his homework quickly.",             options:["done","did","doed"],     correctIndex:1, explanation:"do → did" },
      { id:"e1q5",  prompt:"They ___ pizza for dinner.",               options:["eaten","eated","ate"],   correctIndex:2, explanation:"eat → ate" },
      { id:"e1q6",  prompt:"I ___ my keys this morning.",              options:["finded","found","find"], correctIndex:1, explanation:"find → found" },
      { id:"e1q7",  prompt:"She ___ a new laptop last week.",          options:["buyed","boughted","bought"], correctIndex:2, explanation:"buy → bought" },
      { id:"e1q8",  prompt:"The children ___ in the park.",            options:["ran","runned","run"],    correctIndex:0, explanation:"run → ran" },
      { id:"e1q9",  prompt:"He ___ me about his trip.",                options:["telled","told","tell"],  correctIndex:1, explanation:"tell → told" },
      { id:"e1q10", prompt:"We ___ home after midnight.",              options:["comed","come","came"],   correctIndex:2, explanation:"come → came" },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type Past Simple",
    instructions: "Type the Past Simple form of the verb in brackets.",
    questions: [
      { id:"e2q1",  prompt:"Last night, she ___ (go) to the cinema.",        correct:"went",      explanation:"go → went" },
      { id:"e2q2",  prompt:"I ___ (have) a great idea this morning.",        correct:"had",       explanation:"have → had" },
      { id:"e2q3",  prompt:"We ___ (make) a big mistake.",                   correct:"made",      explanation:"make → made" },
      { id:"e2q4",  prompt:"He ___ (give) me a birthday card.",              correct:"gave",      explanation:"give → gave" },
      { id:"e2q5",  prompt:"She ___ (take) my umbrella by accident.",        correct:"took",      explanation:"take → took" },
      { id:"e2q6",  prompt:"They ___ (speak) for two hours.",                correct:"spoke",     explanation:"speak → spoke" },
      { id:"e2q7",  prompt:"I ___ (know) the answer immediately.",           correct:"knew",      explanation:"know → knew" },
      { id:"e2q8",  prompt:"The team ___ (win) the match.",                  correct:"won",       explanation:"win → won" },
      { id:"e2q9",  prompt:"She ___ (leave) her job last month.",            correct:"left",      explanation:"leave → left" },
      { id:"e2q10", prompt:"We ___ (lose) the game in the last minute.",     correct:"lost",      explanation:"lose → lost" },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — Choose Past Participle",
    instructions: "Choose the correct Past Participle to complete the present perfect sentence.",
    questions: [
      { id:"e3q1",  prompt:"She has ___ a wonderful book.",                        options:["wrote","written","writed"],   correctIndex:1, explanation:"write → written (past participle)" },
      { id:"e3q2",  prompt:"Have you ever ___ Thai food?",                         options:["ate","eating","eaten"],       correctIndex:2, explanation:"eat → eaten" },
      { id:"e3q3",  prompt:"I have ___ my wallet.",                                options:["lose","losed","lost"],        correctIndex:2, explanation:"lose → lost" },
      { id:"e3q4",  prompt:"Has he ___ the agreement?",                            options:["broke","broken","breaked"],   correctIndex:1, explanation:"break → broken" },
      { id:"e3q5",  prompt:"They have ___ to Paris before.",                       options:["went","goed","gone"],         correctIndex:2, explanation:"go → gone" },
      { id:"e3q6",  prompt:"She has ___ me her phone number.",                     options:["gave","give","given"],        correctIndex:2, explanation:"give → given" },
      { id:"e3q7",  prompt:"Has the train ___ yet?",                               options:["came","coming","come"],       correctIndex:2, explanation:"come → come (past participle)" },
      { id:"e3q8",  prompt:"I've ___ that film three times.",                      options:["saw","see","seen"],           correctIndex:2, explanation:"see → seen" },
      { id:"e3q9",  prompt:"He has ___ English for many years.",                   options:["spoke","speaking","spoken"],  correctIndex:2, explanation:"speak → spoken" },
      { id:"e3q10", prompt:"Have you ___ your keys?",                              options:["find","finded","found"],      correctIndex:2, explanation:"find → found" },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed: Past Simple & Participle",
    instructions: "Read the sentence carefully. Write Past Simple or Past Participle of the verb in brackets.",
    questions: [
      { id:"e4q1",  prompt:"The storm ___ many trees. (break — Past Simple)",           correct:"broke",       explanation:"break → broke (Past Simple)" },
      { id:"e4q2",  prompt:"She has ___ the wrong bus. (take — Past Participle)",       correct:"taken",       explanation:"take → taken (Past Participle)" },
      { id:"e4q3",  prompt:"They ___ the bridge in 1990. (build — Past Simple)",       correct:"built",       explanation:"build → built (Past Simple)" },
      { id:"e4q4",  prompt:"I've never ___ in a helicopter. (fly — Past Participle)",  correct:"flown",       explanation:"fly → flown (Past Participle)" },
      { id:"e4q5",  prompt:"He ___ to lock the door. (forget — Past Simple)",          correct:"forgot",      explanation:"forget → forgot (Past Simple)" },
      { id:"e4q6",  prompt:"We've ___ each other for years. (know — Past Participle)", correct:"known",       explanation:"know → known (Past Participle)" },
      { id:"e4q7",  prompt:"She ___ the blue dress. (choose — Past Simple)",           correct:"chose",       explanation:"choose → chose (Past Simple)" },
      { id:"e4q8",  prompt:"Has anyone ___ my glasses? (see — Past Participle)",       correct:"seen",        explanation:"see → seen (Past Participle)" },
      { id:"e4q9",  prompt:"He ___ for twelve hours. (sleep — Past Simple)",           correct:"slept",       explanation:"sleep → slept (Past Simple)" },
      { id:"e4q10", prompt:"I've finally ___ this chapter. (understand — Past Participle)", correct:"understood", explanation:"understand → understood" },
    ],
  },
};

/* ─── PDF config ─────────────────────────────────────────────────────────── */

const PDF_CONFIG: LessonPDFConfig = {
  title: "Irregular Verbs",
  subtitle: "Past Simple & Past Participle — 4 exercises + answer key",
  level: "B1",
  keyRule: "Base form → Past Simple → Past Participle  |  go → went → gone",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Write the Past Simple form of the verb in brackets.",
      questions: [
        "Yesterday, I ___ to school. (go)",
        "She ___ a letter to her friend. (write)",
        "We ___ a great film last night. (see)",
        "He ___ his homework quickly. (do)",
        "They ___ pizza for dinner. (eat)",
        "I ___ my keys this morning. (find)",
        "She ___ a new laptop last week. (buy)",
        "The children ___ in the park. (run)",
        "He ___ me about his trip. (tell)",
        "We ___ home after midnight. (come)",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the Past Simple form of the verb in brackets.",
      questions: [
        "Last night, she ___ (go) to the cinema.",
        "I ___ (have) a great idea this morning.",
        "We ___ (make) a big mistake.",
        "He ___ (give) me a birthday card.",
        "She ___ (take) my umbrella by accident.",
        "They ___ (speak) for two hours.",
        "I ___ (know) the answer immediately.",
        "The team ___ (win) the match.",
        "She ___ (leave) her job last month.",
        "We ___ (lose) the game in the last minute.",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the correct Past Participle of the verb in brackets.",
      questions: [
        "She has ___ a wonderful book. (write)",
        "Have you ever ___ Thai food? (eat)",
        "I have ___ my wallet. (lose)",
        "Has he ___ the agreement? (break)",
        "They have ___ to Paris before. (go)",
        "She has ___ me her phone number. (give)",
        "Has the train ___ yet? (come)",
        "I've ___ that film three times. (see)",
        "He has ___ English for many years. (speak)",
        "Have you ___ your keys? (find)",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Write Past Simple or Past Participle based on the context.",
      questions: [
        "The storm ___ many trees. (break — Past Simple)",
        "She has ___ the wrong bus. (take — Past Participle)",
        "They ___ the bridge in 1990. (build — Past Simple)",
        "I've never ___ in a helicopter. (fly — Past Participle)",
        "He ___ to lock the door. (forget — Past Simple)",
        "We've ___ each other for years. (know — Past Participle)",
        "She ___ the blue dress. (choose — Past Simple)",
        "Has anyone ___ my glasses? (see — Past Participle)",
        "He ___ for twelve hours. (sleep — Past Simple)",
        "I've finally ___ this chapter. (understand — Past Participle)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — Past Simple", answers: ["went","wrote","saw","did","ate","found","bought","ran","told","came"] },
    { exercise: 2, subtitle: "Medium — Past Simple", answers: ["went","had","made","gave","took","spoke","knew","won","left","lost"] },
    { exercise: 3, subtitle: "Medium — Past Participle", answers: ["written","eaten","lost","broken","gone","given","come","seen","spoken","found"] },
    { exercise: 4, subtitle: "Hard — Mixed forms", answers: ["broke","taken","built","flown","forgot","known","chose","seen","slept","understood"] },
  ],
};

/* ─── MCQ Exercise component ─────────────────────────────────────────────── */

function MCQExercise({ set, checked, answers, onAnswer, onCheck, onReset }: {
  set: Extract<ExerciseSet, { type: "mcq" }>;
  checked: boolean;
  answers: Record<string, number>;
  onAnswer: (id: string, i: number) => void;
  onCheck: () => void;
  onReset: () => void;
}) {
  const score = checked
    ? set.questions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;

  return (
    <div>
      <p className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        {set.instructions}
      </p>
      <div className="space-y-5">
        {set.questions.map((q, qi) => {
          const chosen = answers[q.id] ?? -1;
          const isCorrect = checked && chosen === q.correctIndex;
          const isWrong   = checked && chosen !== q.correctIndex && chosen !== -1;
          return (
            <div key={q.id}>
              <p className="mb-2 text-sm font-semibold text-slate-800">
                <span className="mr-1.5 text-slate-400">{qi + 1}.</span>
                {q.prompt}
              </p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  let cls = "rounded-xl border px-4 py-2 text-sm font-semibold transition ";
                  if (!checked) {
                    cls += isChosen
                      ? "border-sky-400 bg-sky-100 text-sky-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50";
                  } else if (oi === q.correctIndex) {
                    cls += "border-emerald-400 bg-emerald-50 text-emerald-800";
                  } else if (isChosen) {
                    cls += "border-red-300 bg-red-50 text-red-700 line-through";
                  } else {
                    cls += "border-slate-100 bg-slate-50 text-slate-400";
                  }
                  return (
                    <button key={oi} disabled={checked} className={cls} onClick={() => onAnswer(q.id, oi)}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {checked && (isCorrect || isWrong) && (
                <p className={`mt-1.5 text-xs font-semibold ${isCorrect ? "text-emerald-600" : "text-red-500"}`}>
                  {isCorrect ? "✓ Correct!" : `✗ ${q.explanation}`}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-3">
        {!checked ? (
          <button
            onClick={onCheck}
            disabled={Object.keys(answers).length < set.questions.length}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-black text-white transition hover:bg-slate-700 disabled:opacity-40"
          >
            Check answers
          </button>
        ) : (
          <>
            <div className={`rounded-xl px-5 py-2.5 text-sm font-black ${score === set.questions.length ? "bg-emerald-500 text-white" : score >= 7 ? "bg-[#F5DA20] text-black" : "bg-slate-200 text-slate-700"}`}>
              {score} / {set.questions.length}
            </div>
            <button onClick={onReset} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Input Exercise component ───────────────────────────────────────────── */

function InputExercise({ set, checked, answers, onAnswer, onCheck, onReset }: {
  set: Extract<ExerciseSet, { type: "input" }>;
  checked: boolean;
  answers: Record<string, string>;
  onAnswer: (id: string, v: string) => void;
  onCheck: () => void;
  onReset: () => void;
}) {
  const score = checked
    ? set.questions.filter((q) => normalize(answers[q.id] ?? "") === normalize(q.correct)).length
    : 0;

  return (
    <div>
      <p className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        {set.instructions}
      </p>
      <div className="space-y-4">
        {set.questions.map((q, qi) => {
          const val       = answers[q.id] ?? "";
          const isCorrect = checked && normalize(val) === normalize(q.correct);
          const isWrong   = checked && normalize(val) !== normalize(q.correct);
          const parts     = q.prompt.split("___");
          return (
            <div key={q.id} className="flex flex-wrap items-center gap-1">
              <span className="text-sm text-slate-400 mr-1">{qi + 1}.</span>
              <span className="text-sm text-slate-800">{parts[0]}</span>
              <input
                type="text"
                value={val}
                disabled={checked}
                onChange={(e) => onAnswer(q.id, e.target.value)}
                placeholder="___"
                className={`w-28 rounded-lg border px-3 py-1.5 text-center text-sm font-semibold outline-none transition
                  ${!checked ? "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  : isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-red-300 bg-red-50 text-red-700"}`}
              />
              <span className="text-sm text-slate-800">{parts[1]}</span>
              {checked && isWrong && (
                <span className="ml-1 text-xs text-emerald-600 font-semibold">→ {q.correct}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-3">
        {!checked ? (
          <button
            onClick={onCheck}
            disabled={Object.keys(answers).filter(k => (answers as Record<string,string>)[k].trim()).length < set.questions.length}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-black text-white transition hover:bg-slate-700 disabled:opacity-40"
          >
            Check answers
          </button>
        ) : (
          <>
            <div className={`rounded-xl px-5 py-2.5 text-sm font-black ${score === set.questions.length ? "bg-emerald-500 text-white" : score >= 7 ? "bg-[#F5DA20] text-black" : "bg-slate-200 text-slate-700"}`}>
              {score} / {set.questions.length}
            </div>
            <button onClick={onReset} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function IrregularVerbsClient({ isPro }: { isPro: boolean }) {
  const [showAll, setShowAll]   = useState(false);
  const [exNo, setExNo]         = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked]   = useState(false);
  const [mcqAnswers, setMcqAnswers]     = useState<Record<string, number>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const { isLive, broadcast } = useLiveSync((payload) => {
    setMcqAnswers(payload.answers as Record<string, number>);
    setInputAnswers((payload as unknown as { inputAnswers: Record<string, string> }).inputAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

  const visibleVerbs = showAll ? VERBS : VERBS.slice(0, 5);
  const currentSet   = SETS[exNo];

  function switchEx(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
    broadcast({ answers: {}, checked: false, exNo: n });
  }

  async function handleDownloadPDF() {
    const { generateLessonPDF } = await import("@/lib/generateLessonPDF");
    await generateLessonPDF(PDF_CONFIG);
  }

  const DIFFICULTIES = ["Easy", "Medium", "Medium", "Hard"];
  const DIFF_COLORS  = ["bg-emerald-100 text-emerald-700", "bg-[#F5DA20] text-black", "bg-[#F5DA20] text-black", "bg-red-100 text-red-700"];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">Irregular Verbs</span>
        </nav>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-[11px] font-black text-sky-700">Grammar</span>
              <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">Top 50</span>
              <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">All levels</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
              Irregular{" "}
              <span className="relative inline-block">
                Verbs
                <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
              The 50 most essential verb forms in English. Master these and you&apos;ll understand almost any sentence you read or hear.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <div className="flex items-center gap-2.5 rounded-xl bg-white border border-slate-200 px-4 py-2.5 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="text-sm font-black text-slate-900">Base form</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-black text-emerald-800">Past Simple</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-sky-50 border border-sky-200 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                <span className="text-sm font-black text-sky-800">Past Participle</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isPro ? (
                <a href="/api/materials/download?slug=irregular-verbs-50"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-[#F5DA20] px-6 py-3.5 text-sm font-black text-black shadow-md hover:opacity-90 transition">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>
                  Download Reference PDF
                </a>
              ) : (
                <a href="/pro"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-[#F5DA20] px-6 py-3.5 text-sm font-black text-black shadow-md hover:opacity-90 transition">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>
                  PRO only — Upgrade to download
                </a>
              )}
              <p className="text-xs text-slate-400">PRO · PDF · 4 pages</p>
            </div>
          </div>

          {/* Cover image */}
          <div className="shrink-0 self-start">
            <a href={isPro ? "/api/materials/download?slug=irregular-verbs-50" : "/pro"}
              className="group relative block w-[190px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-shadow hover:shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/topics/nerd-zone/irregular-verbs-50.jpg" alt="Irregular Verbs PDF cover"
                style={{ aspectRatio: "210/297" }} className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              <div className="absolute top-2.5 left-2.5 rounded-full bg-[#F5DA20] px-2 py-0.5 text-[10px] font-black text-black shadow">PDF</div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5DA20] shadow-lg">
                  {isPro
                    ? <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>
                    : <svg className="h-5 w-5" viewBox="0 0 24 24" fill="black"><path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>
                  }
                </div>
                <span className="text-xs font-black text-white">{isPro ? "Download PDF" : "PRO only"}</span>
              </div>
            </a>
          </div>
        </div>

        {/* ── Verb Table ────────────────────────────────────────────────── */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 grid grid-cols-[2.5rem_1fr_1fr_1fr] border-b-2 border-slate-200 bg-white">
            <div className="px-4 py-4"><span className="text-[10px] font-black uppercase tracking-widest text-slate-300">#</span></div>
            <div className="flex items-center gap-2 border-l border-slate-100 px-4 py-4">
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Base form</span>
            </div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-4 py-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Past Simple</span>
            </div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-4 py-4">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Past Participle</span>
            </div>
          </div>

          {/* Rows */}
          <div>
            {visibleVerbs.map(([base, past, participle], i) => (
              <div key={base}
                className={`group grid grid-cols-[2.5rem_1fr_1fr_1fr] border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
                <div className="flex items-center px-4 py-3.5">
                  <span className="text-[11px] font-bold text-slate-300 group-hover:text-slate-400">{i + 1}</span>
                </div>
                <div className="flex items-center border-l border-slate-50 px-4 py-3.5">
                  <span className="text-sm font-black text-slate-900">{base}</span>
                </div>
                <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-4 py-3.5 group-hover:bg-emerald-50/60">
                  <span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">{past}</span>
                </div>
                <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-4 py-3.5 group-hover:bg-sky-50/60">
                  <span className="inline-flex rounded-lg bg-sky-100 px-2.5 py-1 text-sm font-semibold text-sky-800">{participle}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Show all / collapse button */}
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 flex items-center justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {showAll ? (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>
                  Collapse
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>
                  Show all 50 verbs
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Study tip ─────────────────────────────────────────────────── */}
        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">
              Don&apos;t try to memorise all 50 at once. Start with the top 20 — <em>be, go, have, do, make, say, get, come, know, take, give, find, think, see, tell, become, leave, feel, put, bring</em> — they cover 80% of everyday English.
            </p>
          </div>
        </div>

        {/* ── Exercises + SpeedRound layout ─────────────────────────────── */}
        <div className="mt-8">
          <AdUnit variant="inline-light" />
        </div>

        <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_340px]">

          {/* LEFT: Exercises */}
          <div>
            {/* Section header */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F5DA20] shadow-sm" />
              <h2 className="text-2xl font-black text-slate-900">Practice Exercises</h2>
            </div>

            {/* Exercise tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {([1, 2, 3, 4] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => switchEx(n)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
                    exNo === n
                      ? "bg-slate-900 text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  Ex {n}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${DIFF_COLORS[n - 1]}`}>
                    {DIFFICULTIES[n - 1]}
                  </span>
                </button>
              ))}
            </div>

            {/* Exercise card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-black text-slate-900">{currentSet.title}</h3>

              {currentSet.type === "mcq" ? (
                <MCQExercise
                  set={currentSet}
                  checked={checked}
                  answers={mcqAnswers as Record<string, number>}
                  onAnswer={(id, i) => setMcqAnswers((prev) => { const n = { ...prev, [id]: i }; broadcast({ answers: n, checked: false, exNo }); return n; })}
                  onCheck={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); }}
                  onReset={() => { setChecked(false); setMcqAnswers({}); broadcast({ answers: {}, checked: false, exNo }); }}
                />
              ) : (
                <InputExercise
                  set={currentSet}
                  checked={checked}
                  answers={inputAnswers as Record<string, string>}
                  onAnswer={(id, v) => setInputAnswers((prev) => { const n = { ...prev, [id]: v }; broadcast({ answers: mcqAnswers, checked: false, exNo }); return n; })}
                  onCheck={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); }}
                  onReset={() => { setChecked(false); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo }); }}
                />
              )}
            </div>

            {/* Worksheet PDF button */}
            <div className="mt-6 flex items-center gap-3">
              <PDFButton onDownload={handleDownloadPDF} loading={false} />
              <p className="text-xs text-slate-400">PRO · Worksheet PDF · 4 exercises + answer key</p>
            </div>
          </div>

          {/* RIGHT: SpeedRound */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm" />
              <h2 className="text-2xl font-black text-slate-900">SpeedRound <span className="text-sm font-bold text-amber-500 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">GAME</span></h2>
            </div>
            <SpeedRound questions={SPEED_QUESTIONS} gameId="irregular-verbs" />
          </div>
        </div>

        {/* ── Bottom nav ────────────────────────────────────────────────── */}
        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
          {!isPro && (
            <a href="/pro"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-4 py-2.5 text-sm font-bold text-black hover:opacity-90 transition shadow-sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>
              Unlock all with PRO
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
