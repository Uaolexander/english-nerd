"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PC_SPEED_QUESTIONS, PC_PDF_CONFIG } from "../pcSharedData";

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
    title: "Exercise 1 — wrong auxiliary: am / is / are",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "1-1",  sentence: "She are reading a book right now.",       wrongWord: "are",     correction: ["is"],    explanation: "She → is: She is reading. (I am, he/she/it is, you/we/they are)" },
      { mode: "click", id: "1-2",  sentence: "I is cooking dinner at the moment.",      wrongWord: "is",      correction: ["am"],    explanation: "I → am: I am cooking." },
      { mode: "click", id: "1-3",  sentence: "He are working from home today.",         wrongWord: "are",     correction: ["is"],    explanation: "He → is: He is working." },
      { mode: "click", id: "1-4",  sentence: "They is playing football in the park.",   wrongWord: "is",      correction: ["are"],   explanation: "They → are: They are playing." },
      { mode: "click", id: "1-5",  sentence: "We is watching a film tonight.",          wrongWord: "is",      correction: ["are"],   explanation: "We → are: We are watching." },
      { mode: "click", id: "1-6",  sentence: "The dog are sleeping on the sofa.",       wrongWord: "are",     correction: ["is"],    explanation: "The dog (= it) → is: The dog is sleeping." },
      { mode: "click", id: "1-7",  sentence: "It are raining outside.",                wrongWord: "are",     correction: ["is"],    explanation: "It → is: It is raining." },
      { mode: "click", id: "1-8",  sentence: "My parents is visiting my aunt today.",   wrongWord: "is",      correction: ["are"],   explanation: "My parents (= they) → are: My parents are visiting." },
      { mode: "click", id: "1-9",  sentence: "You is doing a great job.",               wrongWord: "is",      correction: ["are"],   explanation: "You → are: You are doing." },
      { mode: "click", id: "1-10", sentence: "The children is making a lot of noise.",  wrongWord: "is",      correction: ["are"],   explanation: "The children (= they) → are: The children are making." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — wrong negative form or wrong -ing spelling",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "2-1",  sentence: "She doesn't working today.",              wrongWord: "doesn't",  correction: ["isn't", "is not"],     explanation: "Continuous negatives use isn't / is not, not doesn't." },
      { mode: "click", id: "2-2",  sentence: "They don't coming to the party.",         wrongWord: "don't",    correction: ["aren't", "are not"],    explanation: "Continuous negatives use aren't / are not, not don't." },
      { mode: "click", id: "2-3",  sentence: "He don't paying attention in class.",     wrongWord: "don't",    correction: ["isn't", "is not"],      explanation: "He → isn't / is not (not don't). Continuous: isn't + verb-ing." },
      { mode: "click", id: "2-4",  sentence: "I doesn't feeling very well today.",      wrongWord: "doesn't",  correction: ["'m not", "am not"],     explanation: "I → 'm not / am not (not doesn't). Continuous: am not + verb-ing." },
      { mode: "click", id: "2-5",  sentence: "We doesn't going out tonight.",           wrongWord: "doesn't",  correction: ["aren't", "are not"],    explanation: "We → aren't / are not (not doesn't). Continuous: aren't + verb-ing." },
      { mode: "click", id: "2-6",  sentence: "She is runing in the park.",              wrongWord: "runing",   correction: ["running"],              explanation: "Short verb ending in vowel + consonant → double the consonant: run → running." },
      { mode: "click", id: "2-7",  sentence: "He is makeing a sandwich.",               wrongWord: "makeing",  correction: ["making"],               explanation: "Verbs ending in -e: drop the -e then add -ing: make → making (NOT makeing)." },
      { mode: "click", id: "2-8",  sentence: "They are siting on the bench.",           wrongWord: "siting",   correction: ["sitting"],              explanation: "Short verb ending in vowel + consonant → double the consonant: sit → sitting." },
      { mode: "click", id: "2-9",  sentence: "She is dieing her hair.",                 wrongWord: "dieing",   correction: ["dying"],                explanation: "Verbs ending in -ie: change -ie to -y then add -ing: die → dying (NOT dieing)." },
      { mode: "click", id: "2-10", sentence: "The sun is shineing brightly.",           wrongWord: "shineing", correction: ["shining"],              explanation: "Verbs ending in -e: drop the -e then add -ing: shine → shining (NOT shineing)." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — word order and question form",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "3-1",  sentence: "She reading is a book.",                    correct: ["She is reading a book."],                       wrongWord: "reading",   explanation: "Word order: subject + is/am/are + verb-ing. The auxiliary comes before the -ing verb." },
      { mode: "rewrite", id: "3-2",  sentence: "Is she what doing?",                        correct: ["What is she doing?"],                           wrongWord: "Is",        explanation: "Wh- question order: What + auxiliary + subject + verb-ing?" },
      { mode: "rewrite", id: "3-3",  sentence: "He working is from home today.",             correct: ["He is working from home today."],               wrongWord: "working",   explanation: "Subject + is + verb-ing: He is working." },
      { mode: "rewrite", id: "3-4",  sentence: "Where they are going?",                     correct: ["Where are they going?"],                        wrongWord: "they",      explanation: "In questions, the auxiliary comes before the subject: Where are they going?" },
      { mode: "rewrite", id: "3-5",  sentence: "Do you are listening to me?",               correct: ["Are you listening to me?"],                     wrongWord: "Do",        explanation: "Present Continuous questions use the auxiliary are/is/am — not do/does." },
      { mode: "rewrite", id: "3-6",  sentence: "Does she is coming to the party?",          correct: ["Is she coming to the party?"],                  wrongWord: "Does",      explanation: "Present Continuous questions invert subject and is/am/are — not does." },
      { mode: "rewrite", id: "3-7",  sentence: "They are not study right now.",             correct: ["They are not studying right now.", "They aren't studying right now."], wrongWord: "study", explanation: "After are, the verb must be in -ing form: studying (not the base form study)." },
      { mode: "rewrite", id: "3-8",  sentence: "Is he work in the garden?",                 correct: ["Is he working in the garden?"],                 wrongWord: "work",      explanation: "After is, the verb must take -ing: working (not the base form work)." },
      { mode: "rewrite", id: "3-9",  sentence: "She is not play the piano at the moment.",  correct: ["She is not playing the piano at the moment.", "She isn't playing the piano at the moment."], wrongWord: "play", explanation: "After is, the verb must take -ing: playing." },
      { mode: "rewrite", id: "3-10", sentence: "Why are she crying?",                       correct: ["Why is she crying?"],                           wrongWord: "are",       explanation: "She → is (not are). Why is she crying?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — mixed: stative verbs, tense confusion, negatives",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "4-1",  sentence: "I am knowing the answer.",               correct: ["I know the answer."],                                                   wrongWord: "knowing",  explanation: "'Know' is a stative verb — it describes a state, not an action. Stative verbs don't use continuous: I know (NOT I am knowing)." },
      { mode: "rewrite", id: "4-2",  sentence: "She is wanting a coffee.",               correct: ["She wants a coffee."],                                                  wrongWord: "wanting",  explanation: "'Want' is a stative verb. Use Present Simple: She wants (NOT is wanting)." },
      { mode: "rewrite", id: "4-3",  sentence: "They are not coming? Yes, they are not.", correct: ["Are they coming? No, they aren't.", "Are they coming? No, they are not."], wrongWord: "They",   explanation: "Yes/No question needs inversion: Are they coming? Short answer: No, they aren't." },
      { mode: "rewrite", id: "4-4",  sentence: "He don't is talking to me.",              correct: ["He isn't talking to me.", "He is not talking to me."],                   wrongWord: "don't",    explanation: "Present Continuous negatives use isn't / is not — never don't with the auxiliary." },
      { mode: "rewrite", id: "4-5",  sentence: "I am belong to this team.",               correct: ["I belong to this team."],                                               wrongWord: "am",       explanation: "'Belong' is a stative verb. Use Present Simple: I belong (NOT I am belonging / am belong)." },
      { mode: "rewrite", id: "4-6",  sentence: "Is she working? Yes, she working.",       correct: ["Is she working? Yes, she is."],                                         wrongWord: "working",  explanation: "Short answers use the auxiliary only: Yes, she is. (NOT she working)" },
      { mode: "rewrite", id: "4-7",  sentence: "He is understand the lesson.",            correct: ["He understands the lesson."],                                           wrongWord: "understand", explanation: "'Understand' is a stative verb. Use Present Simple: He understands (NOT is understanding / is understand)." },
      { mode: "rewrite", id: "4-8",  sentence: "They isn't watching TV.",                 correct: ["They aren't watching TV.", "They are not watching TV."],                 wrongWord: "isn't",    explanation: "They → aren't / are not (not isn't). isn't is only for he/she/it." },
      { mode: "rewrite", id: "4-9",  sentence: "She are not listening to the teacher.",   correct: ["She is not listening to the teacher.", "She isn't listening to the teacher."], wrongWord: "are", explanation: "She → is (not are). She is not / isn't listening." },
      { mode: "rewrite", id: "4-10", sentence: "What they are talking about?",            correct: ["What are they talking about?"],                                         wrongWord: "they",     explanation: "Wh- questions: What + auxiliary + subject + verb-ing? → What are they talking about?" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "am/is/are",
  2: "Negatives & -ing",
  3: "Word order",
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
  const allChecked = current.questions.every((q) => checked[q.id]);

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PC_PDF_CONFIG); } finally { setPdfLoading(false); }
  }

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
          <a className="hover:text-slate-900 transition" href="/tenses/present-continuous">Present Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Spot the Mistake</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Continuous{" "}
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
            <div className="">
              <div className=""><SpeedRound gameId="pc-spot-the-mistake" subject="Present Continuous" questions={PC_SPEED_QUESTIONS} variant="sidebar" /></div>
            </div>
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
            <aside className="flex flex-col gap-3">
              <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Recommended for you</p>
              {[
                { title: "Fill in the Blank", href: "/tenses/present-continuous/fill-in-blank", img: "/topics/exercises/fill-in-blank.jpg", level: "A2", badge: "bg-emerald-500", reason: "Type the correct form" },
                { title: "Sentence Builder", href: "/tenses/present-continuous/sentence-builder", img: "/topics/exercises/sentence-builder-present-continuous.jpg", level: "A2", badge: "bg-emerald-500", reason: "Build sentences word by word" },
                { title: "Stative Verbs", href: "/tenses/present-continuous/stative-verbs", img: "/topics/exercises/stative-verbs.jpg", level: "A2", badge: "bg-violet-500", reason: "Verbs that don't use -ing" },
              ].map((rec) => (
                <a key={rec.href} href={rec.href} className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                    <img src={rec.img} alt={rec.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md ${rec.badge}`}>{rec.level}</span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold leading-snug text-slate-800 transition group-hover:text-slate-900">{rec.title}</p>
                    {rec.reason && <p className="mt-1 text-[11px] font-semibold leading-snug text-amber-600">{rec.reason}</p>}
                  </div>
                </a>
              ))}
              <a href="/tenses/present-continuous" className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
                All Present Continuous
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </a>
            </aside>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        {!isPro && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
            <div className="hidden lg:block" />
            <SpeedRound gameId="pc-spot-the-mistake" subject="Present Continuous" questions={PC_SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-continuous/fill-in-blank" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Fill in the Blank</a>
          <a href="/tenses/present-continuous/sentence-builder" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Sentence Builder →</a>
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
            { text: "am / is / are", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <Ex en="She is reading.  ·  They are playing.  ·  I am working." />
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "'m not / isn't / aren't", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <Ex en="She isn't reading.  ·  They aren't playing.  ·  I'm not working." />
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Am / Is / Are", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <Ex en="Is she reading?  ·  Are they playing?  ·  Am I working?" />
        </div>
      </div>

      {/* Common mistakes */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common mistakes to watch for</div>
        <div className="space-y-3">
          {[
            {
              type: "Wrong auxiliary",
              wrong: "She are reading.  /  He am working.  /  They is playing.",
              correct: "She is reading.  /  He is working.  /  They are playing.",
              rule: "am → I only · is → he/she/it · are → you/we/they",
            },
            {
              type: "Using don't / doesn't instead of isn't / aren't",
              wrong: "She doesn't working.  /  They don't coming.",
              correct: "She isn't working.  /  They aren't coming.",
              rule: "Continuous negatives always use isn't / aren't / 'm not — never don't / doesn't.",
            },
            {
              type: "-ing spelling: double consonant",
              wrong: "She is runing.  /  He is siting.",
              correct: "She is running.  /  He is sitting.",
              rule: "Short verb ending in vowel + consonant → double it: run → running · sit → sitting.",
            },
            {
              type: "-ing spelling: drop the -e",
              wrong: "He is makeing.  /  She is writeing.",
              correct: "He is making.  /  She is writing.",
              rule: "Verbs ending in -e: drop -e before adding -ing: make → making · write → writing.",
            },
            {
              type: "Stative verbs in continuous form",
              wrong: "I am knowing the answer.  /  She is wanting coffee.",
              correct: "I know the answer.  /  She wants coffee.",
              rule: "Stative verbs (know/want/like/own…) describe states — they don't take -ing form.",
            },
            {
              type: "Question word order",
              wrong: "Where they are going?  /  Does she is coming?",
              correct: "Where are they going?  /  Is she coming?",
              rule: "Invert subject and auxiliary. Never use do/does in Present Continuous questions.",
            },
          ].map(({ type, wrong, correct, rule }) => (
            <div key={type} className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-black text-slate-800 mb-2">{type}</div>
              <div className="grid sm:grid-cols-2 gap-2 mb-2">
                <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2">
                  <div className="text-[10px] font-black uppercase text-red-400 mb-1">Wrong ❌</div>
                  <div className="italic text-red-700 text-sm">{wrong}</div>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
                  <div className="text-[10px] font-black uppercase text-emerald-500 mb-1">Correct ✅</div>
                  <div className="italic text-emerald-800 text-sm">{correct}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium">{rule}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
