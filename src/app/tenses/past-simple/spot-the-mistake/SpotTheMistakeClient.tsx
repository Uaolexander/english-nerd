"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import TenseRecommendations from "@/components/TenseRecommendations";
import { PS_SPEED_QUESTIONS, PS_PDF_CONFIG } from "../psSharedData";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type ClickQ = {
  mode: "click";
  id: string;
  sentence: string;
  wrongWord: string;
  correction: string[];
  explanation: string;
};

type RewriteQ = {
  mode: "rewrite";
  id: string;
  sentence: string;
  correct: string[];
  wrongWord: string;
  explanation: string;
};

type Q = ClickQ | RewriteQ;

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: Q[];
};

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Wrong regular past forms",
    instructions: "Click the wrong word, type the correct past form, then press Enter.",
    questions: [
      { mode: "click", id: "1-1",  sentence: "She studyed hard for the exam.",          wrongWord: "studyed",   correction: ["studied"],   explanation: "study → studied (consonant + y → ied, NOT studyed)" },
      { mode: "click", id: "1-2",  sentence: "He stoped the car at the lights.",        wrongWord: "stoped",    correction: ["stopped"],   explanation: "stop → stopped (CVC: double the final consonant, NOT stoped)" },
      { mode: "click", id: "1-3",  sentence: "They liveed in Rome for two years.",      wrongWord: "liveed",    correction: ["lived"],     explanation: "live → lived (drop silent -e, add -d, NOT liveed)" },
      { mode: "click", id: "1-4",  sentence: "She likeed the film very much.",          wrongWord: "likeed",    correction: ["liked"],     explanation: "like → liked (drop silent -e, add -d, NOT likeed)" },
      { mode: "click", id: "1-5",  sentence: "He droped his phone on the floor.",       wrongWord: "droped",    correction: ["dropped"],   explanation: "drop → dropped (CVC: double final consonant, NOT droped)" },
      { mode: "click", id: "1-6",  sentence: "We tryed a new restaurant last week.",    wrongWord: "tryed",     correction: ["tried"],     explanation: "try → tried (consonant + y → ied, NOT tryed)" },
      { mode: "click", id: "1-7",  sentence: "She closeed all the windows before bed.", wrongWord: "closeed",   correction: ["closed"],    explanation: "close → closed (drop silent -e, add -d, NOT closeed)" },
      { mode: "click", id: "1-8",  sentence: "They planed a surprise party for her.",   wrongWord: "planed",    correction: ["planned"],   explanation: "plan → planned (CVC: double final consonant, NOT planed)" },
      { mode: "click", id: "1-9",  sentence: "He carryed all the heavy bags himself.",  wrongWord: "carryed",   correction: ["carried"],   explanation: "carry → carried (consonant + y → ied, NOT carryed)" },
      { mode: "click", id: "1-10", sentence: "She finishs her homework before dinner.", wrongWord: "finishs",   correction: ["finished"],  explanation: "finish → finished (past simple needs -ed, NOT present -s)" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Wrong irregular past forms",
    instructions: "Click the wrong word, type the correct irregular past form, then press Enter.",
    questions: [
      { mode: "click", id: "2-1",  sentence: "She goed to the shops yesterday.",        wrongWord: "goed",      correction: ["went"],      explanation: "go → went (irregular — there is no 'goed')" },
      { mode: "click", id: "2-2",  sentence: "He taked my umbrella by mistake.",        wrongWord: "taked",     correction: ["took"],      explanation: "take → took (irregular — there is no 'taked')" },
      { mode: "click", id: "2-3",  sentence: "They eated all the pizza last night.",    wrongWord: "eated",     correction: ["ate"],       explanation: "eat → ate (irregular — there is no 'eated')" },
      { mode: "click", id: "2-4",  sentence: "She maked a delicious cake for us.",      wrongWord: "maked",     correction: ["made"],      explanation: "make → made (irregular — there is no 'maked')" },
      { mode: "click", id: "2-5",  sentence: "He buyed a new phone last month.",        wrongWord: "buyed",     correction: ["bought"],    explanation: "buy → bought (irregular — there is no 'buyed')" },
      { mode: "click", id: "2-6",  sentence: "We seed a great film at the cinema.",     wrongWord: "seed",      correction: ["saw"],       explanation: "see → saw (irregular — there is no 'seed')" },
      { mode: "click", id: "2-7",  sentence: "She writed a long letter to her mother.", wrongWord: "writed",    correction: ["wrote"],     explanation: "write → wrote (irregular — there is no 'writed')" },
      { mode: "click", id: "2-8",  sentence: "He thinked about it for a long time.",    wrongWord: "thinked",   correction: ["thought"],   explanation: "think → thought (irregular — there is no 'thinked')" },
      { mode: "click", id: "2-9",  sentence: "They comed home very late.",              wrongWord: "comed",     correction: ["came"],      explanation: "come → came (irregular — there is no 'comed')" },
      { mode: "click", id: "2-10", sentence: "She bringed flowers to the party.",       wrongWord: "bringed",   correction: ["brought"],   explanation: "bring → brought (irregular — there is no 'bringed')" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Negatives with wrong structure",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter. Focus on didn't + base form.",
    questions: [
      { mode: "rewrite", id: "3-1",  sentence: "She didn't worked yesterday.",               correct: ["She didn't work yesterday."],                                           wrongWord: "worked",    explanation: "After didn't, use the base form: didn't work (NOT didn't worked)" },
      { mode: "rewrite", id: "3-2",  sentence: "He didn't went to school today.",            correct: ["He didn't go to school today."],                                        wrongWord: "went",      explanation: "After didn't, use the base form: didn't go (NOT didn't went)" },
      { mode: "rewrite", id: "3-3",  sentence: "They didn't ate anything for lunch.",        correct: ["They didn't eat anything for lunch."],                                  wrongWord: "ate",       explanation: "After didn't, use the base form: didn't eat (NOT didn't ate)" },
      { mode: "rewrite", id: "3-4",  sentence: "Did she went to the party?",                correct: ["Did she go to the party?"],                                             wrongWord: "went",      explanation: "After Did, use the base form: Did she go (NOT Did she went)" },
      { mode: "rewrite", id: "3-5",  sentence: "Did they finished the project?",            correct: ["Did they finish the project?"],                                         wrongWord: "finished",  explanation: "After Did, use the base form: Did they finish (NOT Did they finished)" },
      { mode: "rewrite", id: "3-6",  sentence: "She doesn't study last night.",             correct: ["She didn't study last night."],                                         wrongWord: "doesn't",   explanation: "Past events use didn't (not doesn't). She didn't study." },
      { mode: "rewrite", id: "3-7",  sentence: "He don't call me back.",                   correct: ["He didn't call me back."],                                              wrongWord: "don't",     explanation: "Past Simple negative: didn't + base form (NOT don't)" },
      { mode: "rewrite", id: "3-8",  sentence: "Did you enjoyed the holiday?",             correct: ["Did you enjoy the holiday?"],                                           wrongWord: "enjoyed",   explanation: "After Did, use the base form: Did you enjoy (NOT Did you enjoyed)" },
      { mode: "rewrite", id: "3-9",  sentence: "I not went to work yesterday.",            correct: ["I didn't go to work yesterday."],                                       wrongWord: "not",       explanation: "Past negative needs didn't: I didn't go (NOT I not went)" },
      { mode: "rewrite", id: "3-10", sentence: "She didn't bought anything at the market.", correct: ["She didn't buy anything at the market."],                               wrongWord: "bought",    explanation: "After didn't, use the base form: didn't buy (NOT didn't bought)" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed mistakes",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "4-1",  sentence: "Yesterday she go to the doctor.",            correct: ["Yesterday she went to the doctor."],                                    wrongWord: "go",        explanation: "Past Simple needs the past form: went (not base form go)" },
      { mode: "rewrite", id: "4-2",  sentence: "He writed a book about his life.",           correct: ["He wrote a book about his life."],                                      wrongWord: "writed",    explanation: "write → wrote (irregular — there is no 'writed')" },
      { mode: "rewrite", id: "4-3",  sentence: "Did she went shopping yesterday?",           correct: ["Did she go shopping yesterday?"],                                       wrongWord: "went",      explanation: "After Did, use the base form: Did she go (NOT Did she went)" },
      { mode: "rewrite", id: "4-4",  sentence: "They didn't came to the meeting.",           correct: ["They didn't come to the meeting."],                                     wrongWord: "came",      explanation: "After didn't, use the base form: didn't come (NOT didn't came)" },
      { mode: "rewrite", id: "4-5",  sentence: "She taked the bus to work this morning.",    correct: ["She took the bus to work this morning."],                               wrongWord: "taked",     explanation: "take → took (irregular — there is no 'taked')" },
      { mode: "rewrite", id: "4-6",  sentence: "He studyed at university for four years.",   correct: ["He studied at university for four years."],                             wrongWord: "studyed",   explanation: "study → studied (consonant + y → ied, NOT studyed)" },
      { mode: "rewrite", id: "4-7",  sentence: "Does she call you last night?",              correct: ["Did she call you last night?"],                                         wrongWord: "Does",      explanation: "Past Simple questions use Did (not does/do). Did she call?" },
      { mode: "rewrite", id: "4-8",  sentence: "I seen a great documentary yesterday.",      correct: ["I saw a great documentary yesterday."],                                 wrongWord: "seen",      explanation: "Past Simple of see is saw (not seen — that is the past participle)" },
      { mode: "rewrite", id: "4-9",  sentence: "They stoped at a petrol station on the way.", correct: ["They stopped at a petrol station on the way."],                        wrongWord: "stoped",    explanation: "stop → stopped (CVC: double the final consonant, NOT stoped)" },
      { mode: "rewrite", id: "4-10", sentence: "She didn't told me about the party.",        correct: ["She didn't tell me about the party."],                                  wrongWord: "told",      explanation: "After didn't, use the base form: didn't tell (NOT didn't told)" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Regular -ed",
  2: "Irregulars",
  3: "Neg & Q",
  4: "Mixed",
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

type Token = { text: string; isPunct: boolean };

function tokenize(sentence: string): Token[] {
  const parts: Token[] = [];
  for (const word of sentence.split(/\s+/).filter(Boolean)) {
    const m = word.match(/^(.+?)([.!?,])$/);
    if (m && m[1].length > 0) {
      parts.push({ text: m[1], isPunct: false });
      parts.push({ text: m[2], isPunct: true });
    } else if (/^[.!?,]$/.test(word)) {
      parts.push({ text: word, isPunct: true });
    } else {
      parts.push({ text: word, isPunct: false });
    }
  }
  return parts;
}

function normWord(s: string) {
  return s.trim().toLowerCase().replace(/[''`]/g, "'");
}

function normSentence(s: string) {
  return s.trim().toLowerCase().replace(/[''`]/g, "'").replace(/\s+/g, " ").replace(/[.!?,]+$/, "").trim();
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function SpotTheMistakeClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [clickedIdx, setClickedIdx] = useState<Record<string, number>>({});
  const [typedFix, setTypedFix] = useState<Record<string, string>>({});
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();

  const current = SETS[exNo];

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PS_PDF_CONFIG); } finally { setPdfLoading(false); }
  }
  const allChecked = current.questions.every((q) => checked[q.id]);

  function checkOne(qId: string) {
    setChecked((p) => ({ ...p, [qId]: true }));
  }

  function checkAll() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const all: Record<string, boolean> = {};
    for (const q of current.questions) all[q.id] = true;
    setChecked((p) => ({ ...p, ...all }));
  }

  function reset() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked({});
    setClickedIdx({});
    setTypedFix({});
    setTyped({});
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const { save } = useProgress();

  useEffect(() => {
    if (checked && score) {
      save(exNo, score.percent, score.total);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const score = useMemo(() => {
    if (!allChecked) return null;
    let correct = 0;
    for (const q of current.questions) {
      if (q.mode === "click") {
        const tokens = tokenize(q.sentence);
        const idx = clickedIdx[q.id];
        const clickedToken = idx !== undefined ? tokens[idx] : null;
        const rightWord = clickedToken != null && normWord(clickedToken.text) === normWord(q.wrongWord);
        const rightFix = q.correction.some((c) => normWord(typedFix[q.id] ?? "") === normWord(c));
        if (rightWord && rightFix) correct++;
      } else {
        if (q.correct.some((c) => normSentence(typed[q.id] ?? "") === normSentence(c))) correct++;
      }
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [allChecked, current, clickedIdx, typedFix, typed]);

  const checkedCount = current.questions.filter((q) => checked[q.id]).length;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-simple">Past Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Spot the Mistake</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Error Hunt</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Every sentence has <b>one grammar mistake</b>.{" "}
          <b>Sets 1–2:</b> click the wrong word and type the fix, then press <kbd className="rounded bg-black/8 px-1.5 py-0.5 text-xs font-mono">Enter</kbd>.{" "}
          <b>Sets 3–4:</b> rewrite the sentence correctly and press <kbd className="rounded bg-black/8 px-1.5 py-0.5 text-xs font-mono">Enter</kbd>.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="ps-spot-the-mistake" subject="Past Simple" questions={PS_SPEED_QUESTIONS} variant="sidebar" /></div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          {/* Main */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <PDFButton onDownload={handlePDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition text-sm ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 ${exNo <= 2 ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700"}`}>
                        {exNo <= 2 ? "Click mode" : "Rewrite mode"}
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mb-1">{current.title}</h2>
                      <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                      <div className="mt-3 flex sm:hidden items-center gap-2">
                        <span className="text-slate-400 text-xs">Set:</span>
                        {([1, 2, 3, 4] as const).map((n) => (
                          <button key={n} onClick={() => switchSet(n)}
                            className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition text-sm ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2">
                      <span className="text-lg font-black text-slate-900">{checkedCount}</span>
                      <span className="text-slate-400 text-sm">/ {current.questions.length}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {current.questions.map((q, idx) =>
                      q.mode === "click" ? (
                        <ClickCard
                          key={q.id}
                          q={q}
                          idx={idx}
                          clickedIdx={clickedIdx[q.id]}
                          typedFix={typedFix[q.id] ?? ""}
                          isChecked={checked[q.id] ?? false}
                          onClickToken={(i) => !checked[q.id] && setClickedIdx((p) => ({ ...p, [q.id]: i }))}
                          onTypeFix={(v) => setTypedFix((p) => ({ ...p, [q.id]: v }))}
                          onCheck={() => checkOne(q.id)}
                        />
                      ) : (
                        <RewriteCard
                          key={q.id}
                          q={q}
                          idx={idx}
                          value={typed[q.id] ?? ""}
                          isChecked={checked[q.id] ?? false}
                          onChange={(v) => setTyped((p) => ({ ...p, [q.id]: v }))}
                          onCheck={() => checkOne(q.id)}
                        />
                      )
                    )}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {!allChecked && (
                        <button onClick={checkAll} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                          Check All
                        </button>
                      )}
                      <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                        Reset
                      </button>
                      {allChecked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">
                          Next Exercise →
                        </button>
                      )}
                    </div>
                    {score && (
                      <div className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div>
                            <div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div>
                          </div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎯" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80 ? "Sharp eye! Move on to Sentence Builder." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}
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
            <TenseRecommendations tense="past-simple" />
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/past-simple/fill-in-blank" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Fill in the Blank</a>
          <a href="/tenses/past-simple/sentence-builder" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Sentence Builder →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Click-word card ─────────────────────────────────────────────────────── */

function ClickCard({ q, idx, clickedIdx, typedFix, isChecked, onClickToken, onTypeFix, onCheck }: {
  q: ClickQ; idx: number; clickedIdx: number | undefined; typedFix: string;
  isChecked: boolean; onClickToken: (i: number) => void; onTypeFix: (v: string) => void; onCheck: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const tokens = tokenize(q.sentence);

  const clickedToken = clickedIdx !== undefined ? tokens[clickedIdx] : null;
  const rightWord = clickedToken != null && normWord(clickedToken.text) === normWord(q.wrongWord);
  const rightFix = q.correction.some((c) => normWord(typedFix) === normWord(c));
  const isCorrect = isChecked && rightWord && rightFix;
  const isWrong = isChecked && (!rightWord || !rightFix);
  const noAnswer = isChecked && clickedIdx === undefined;

  return (
    <div className={`rounded-2xl border bg-white p-5 transition ${isCorrect ? "border-emerald-300" : isWrong || noAnswer ? "border-red-200" : "border-black/10"}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${isCorrect ? "bg-emerald-100 text-emerald-700" : isWrong || noAnswer ? "bg-red-100 text-red-600" : "bg-black/5 text-slate-700"}`}>
          {isCorrect ? "✓" : isWrong || noAnswer ? "✗" : idx + 1}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 items-baseline mb-3">
            {tokens.map((token, i) => {
              if (token.isPunct) return <span key={i} className="text-slate-400 text-base select-none">{token.text}</span>;
              const isSelected = i === clickedIdx;
              const isTheWrong = isChecked && normWord(token.text) === normWord(q.wrongWord);
              let cls = "rounded-lg px-2.5 py-1 text-base font-semibold border transition select-none ";
              if (isChecked) {
                if (isTheWrong) cls += rightWord && rightFix ? "border-emerald-400 bg-emerald-100 text-emerald-800" : "border-red-300 bg-red-100 text-red-700";
                else if (isSelected) cls += "border-red-200 bg-red-50 text-red-400 line-through";
                else cls += "border-transparent bg-transparent text-slate-600 cursor-default";
              } else {
                cls += isSelected ? "border-[#F5DA20] bg-[#FFF9C2] text-slate-900 ring-2 ring-[#F5DA20]/40 cursor-pointer" : "border-black/10 bg-white text-slate-800 hover:border-[#F5DA20]/60 hover:bg-[#FFFBDC] cursor-pointer";
              }
              return (
                <button key={i} onClick={() => { onClickToken(i); setTimeout(() => inputRef.current?.focus(), 50); }} disabled={isChecked} className={cls}>
                  {token.text}
                </button>
              );
            })}
          </div>

          <div className={`flex items-center gap-2 transition-opacity ${clickedIdx === undefined && !isChecked ? "opacity-40" : "opacity-100"}`}>
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Correct form:</span>
            <input
              ref={inputRef}
              type="text"
              value={typedFix}
              onChange={(e) => onTypeFix(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && clickedIdx !== undefined && typedFix.trim()) onCheck(); }}
              disabled={isChecked || clickedIdx === undefined}
              placeholder={clickedIdx !== undefined ? `Fix "${tokens[clickedIdx]?.text}"… (Enter)` : "Click a word first"}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              className={`rounded-lg border px-3 py-1.5 text-sm font-mono outline-none transition min-w-[170px] ${
                isChecked
                  ? rightFix && rightWord ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700"
                  : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20 disabled:bg-black/[0.02] disabled:text-slate-400"
              }`}
            />
            {!isChecked && clickedIdx !== undefined && typedFix.trim() && (
              <button onClick={onCheck} className="rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-black text-black hover:opacity-90 transition">Check</button>
            )}
          </div>

          {isChecked && (
            <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
              {isCorrect && <><span className="font-black">✅ Correct!</span> {q.explanation}</>}
              {noAnswer && <><span className="font-black">⚠ No answer.</span> The error was <b className="font-mono">&quot;{q.wrongWord}&quot;</b> → <b className="font-mono">{q.correction.join(" / ")}</b>. {q.explanation}</>}
              {isWrong && !noAnswer && (
                <>{!rightWord && <><span className="font-black">❌ Wrong word.</span> The error was <b className="font-mono">&quot;{q.wrongWord}&quot;</b> → <b className="font-mono">{q.correction.join(" / ")}</b>. </>}
                {rightWord && !rightFix && <><span className="font-black">❌ Right word, wrong fix.</span> Accepted: <b className="font-mono">{q.correction.join(" / ")}</b>. </>}
                {q.explanation}</>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Rewrite card ────────────────────────────────────────────────────────── */

function RewriteCard({ q, idx, value, isChecked, onChange, onCheck }: {
  q: RewriteQ; idx: number; value: string; isChecked: boolean;
  onChange: (v: string) => void; onCheck: () => void;
}) {
  const isCorrect = isChecked && q.correct.some((c) => normSentence(value) === normSentence(c));
  const isWrong = isChecked && !isCorrect;

  function WrongHighlight() {
    const lower = q.sentence.toLowerCase();
    const start = lower.indexOf(q.wrongWord.toLowerCase());
    if (start === -1) return <>{q.sentence}</>;
    return (
      <>{q.sentence.slice(0, start)}<span className="underline decoration-red-400 decoration-2 text-red-600 font-bold">{q.sentence.slice(start, start + q.wrongWord.length)}</span>{q.sentence.slice(start + q.wrongWord.length)}</>
    );
  }

  return (
    <div className={`rounded-2xl border bg-white p-5 transition ${isCorrect ? "border-emerald-300" : isWrong ? "border-red-200" : "border-black/10"}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${isCorrect ? "bg-emerald-100 text-emerald-700" : isWrong ? "bg-red-100 text-red-600" : "bg-black/5 text-slate-700"}`}>
          {isCorrect ? "✓" : isWrong ? "✗" : idx + 1}
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold italic text-slate-700 mb-3 leading-relaxed">
            {isChecked ? <WrongHighlight /> : q.sentence}
          </p>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Your correction:</label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) onCheck(); }}
              disabled={isChecked}
              placeholder="Type the corrected sentence… (Enter to check)"
              autoComplete="off" autoCorrect="off" spellCheck={false}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium outline-none transition ${
                isChecked
                  ? isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"
                  : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
              }`}
            />
          </div>
          {isChecked && (
            <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
              {isCorrect
                ? <><span className="font-black">✅ Correct!</span> {q.explanation}</>
                : <><span className="font-black">❌ </span>Correct sentence: <span className="font-mono font-black text-slate-800">{q.correct[0]}</span><div className="mt-1 text-xs text-slate-600">{q.explanation}</div></>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation ─────────────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}>{p.text}</span>
      ))}
    </div>
  );
}

function Ex({ en }: { en: string }) {
  return (
    <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
      <div className="font-semibold text-slate-900 text-sm">{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">

      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "past form", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <Ex en="She worked hard.  ·  He went home.  ·  They played tennis." />
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "didn't", color: "red" },
            { text: "base form", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <Ex en="She didn't work.  ·  He didn't go.  ·  They didn't play." />
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Did", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "base form", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <Ex en="Did she work?  ·  Did he go?  ·  Did they play?" />
        </div>
      </div>

      {/* Common mistakes */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common mistakes to watch for</div>
        <div className="space-y-3">
          {[
            {
              type: "Spelling: wrong -ed",
              wrong: "stoped · studyed · liveed · droped",
              correct: "stopped · studied · lived · dropped",
              rule: "CVC → double consonant · consonant+y → ied · silent-e → just add -d",
            },
            {
              type: "Irregular form",
              wrong: "goed · taked · eated · writed · buyed",
              correct: "went · took · ate · wrote · bought",
              rule: "Irregular verbs have unique past forms — memorise them!",
            },
            {
              type: "didn't + past form (wrong!)",
              wrong: "She didn't went. · He didn't ate.",
              correct: "She didn't go. · He didn't eat.",
              rule: "After didn't, always use the BASE form of the verb",
            },
            {
              type: "Did + past form (wrong!)",
              wrong: "Did she went? · Did they finished?",
              correct: "Did she go? · Did they finish?",
              rule: "After Did, always use the BASE form of the verb",
            },
            {
              type: "Present tense for past events",
              wrong: "She doesn't go yesterday. · He don't call me.",
              correct: "She didn't go yesterday. · He didn't call me.",
              rule: "Past events need didn't — not doesn't / don't",
            },
          ].map(({ type, wrong, correct, rule }) => (
            <div key={type} className="rounded-xl bg-white border border-black/10 px-4 py-3 space-y-1.5">
              <div className="text-sm font-black text-slate-800">{type}</div>
              <div className="text-xs font-mono text-red-600 line-through">{wrong}</div>
              <div className="text-xs font-mono text-emerald-700 font-bold">{correct}</div>
              <div className="text-xs text-slate-500">{rule}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">Key rule: base form after didn&apos;t and Did</div>
        <div className="space-y-1 text-xs text-amber-700">
          <div>She <b>didn&apos;t go</b> ✅ &nbsp;|&nbsp; She didn&apos;t went ❌</div>
          <div><b>Did</b> he eat? ✅ &nbsp;|&nbsp; Did he ate? ❌</div>
        </div>
      </div>

      {/* Irregular verbs grid */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common irregular verbs</div>
        <div className="flex flex-wrap gap-2">
          {[
            "go → went", "have → had", "see → saw", "eat → ate", "come → came",
            "take → took", "make → made", "give → gave", "say → said", "do → did",
            "get → got", "find → found", "know → knew", "think → thought", "buy → bought",
            "leave → left", "write → wrote", "tell → told", "hear → heard", "begin → began",
            "feel → felt", "meet → met", "run → ran", "sit → sat", "stand → stood",
            "fly → flew", "drink → drank", "drive → drove", "wake → woke", "speak → spoke",
            "bring → brought", "build → built", "catch → caught", "fall → fell", "keep → kept",
            "lose → lost", "pay → paid", "put → put", "send → sent", "sleep → slept",
            "spend → spent", "teach → taught", "wear → wore", "win → won",
          ].map((v) => (
            <span key={v} className="rounded-lg bg-violet-50 border border-violet-200 px-2.5 py-1 text-xs font-semibold text-violet-800">{v}</span>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["yesterday", "last week", "last month", "last year", "last night", "ago", "in 2020", "when I was young", "this morning", "in the past", "once", "at that time"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
