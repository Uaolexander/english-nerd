"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import { useLiveSync } from "@/lib/useLiveSync";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { FUTPERF_SPEED_QUESTIONS, FUTPERF_PDF_CONFIG } from "../futPerfSharedData";
import TenseRecommendations from "@/components/TenseRecommendations";

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
    title: "Exercise 1 — wrong verb form: base/simple instead of past participle",
    instructions: "Click the wrong word, type the correct past participle form, then press Enter.",
    questions: [
      { mode: "click", id: "1-1",  sentence: "By tonight, she will have go to bed.",          wrongWord: "go",      correction: ["gone"],      explanation: "will have + past participle: go → gone (irregular)." },
      { mode: "click", id: "1-2",  sentence: "By 6 PM, they will have eat all the food.",      wrongWord: "eat",     correction: ["eaten"],     explanation: "eat → eaten (irregular past participle)." },
      { mode: "click", id: "1-3",  sentence: "He will have forget about it by tomorrow.",      wrongWord: "forget",  correction: ["forgotten"], explanation: "forget → forgotten (irregular past participle)." },
      { mode: "click", id: "1-4",  sentence: "By the time you arrive, I will have leave.",     wrongWord: "leave",   correction: ["left"],      explanation: "leave → left (irregular past participle)." },
      { mode: "click", id: "1-5",  sentence: "We will have do all the work by Monday.",        wrongWord: "do",      correction: ["done"],      explanation: "do → done (irregular past participle)." },
      { mode: "click", id: "1-6",  sentence: "By next year, they will have build the bridge.", wrongWord: "build",   correction: ["built"],     explanation: "build → built (irregular past participle)." },
      { mode: "click", id: "1-7",  sentence: "She will have write the essay by noon.",         wrongWord: "write",   correction: ["written"],   explanation: "write → written (irregular past participle)." },
      { mode: "click", id: "1-8",  sentence: "By then, he will have spend all his money.",     wrongWord: "spend",   correction: ["spent"],     explanation: "spend → spent (irregular past participle)." },
      { mode: "click", id: "1-9",  sentence: "By the end of the month, we will have see the results.", wrongWord: "see", correction: ["seen"], explanation: "see → seen (irregular past participle)." },
      { mode: "click", id: "1-10", sentence: "By 8 PM, they will have make a decision.",       wrongWord: "make",    correction: ["made"],      explanation: "make → made (irregular past participle)." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — wrong past participle form",
    instructions: "Click the wrong past participle, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "2-1",  sentence: "By tonight, she will have taked the medicine.",    wrongWord: "taked",    correction: ["taken"],     explanation: "take → taken (irregular). Never 'taked'." },
      { mode: "click", id: "2-2",  sentence: "He will have buyed a new car by then.",             wrongWord: "buyed",    correction: ["bought"],    explanation: "buy → bought (irregular). Never 'buyed'." },
      { mode: "click", id: "2-3",  sentence: "By Friday, she will have writed the report.",       wrongWord: "writed",   correction: ["written"],   explanation: "write → written (irregular). Never 'writed'." },
      { mode: "click", id: "2-4",  sentence: "They will have goed home by midnight.",             wrongWord: "goed",     correction: ["gone"],      explanation: "go → gone (irregular). Never 'goed'." },
      { mode: "click", id: "2-5",  sentence: "By next week, he will have finded the answer.",     wrongWord: "finded",   correction: ["found"],     explanation: "find → found (irregular). Never 'finded'." },
      { mode: "click", id: "2-6",  sentence: "She will have eated by the time you arrive.",       wrongWord: "eated",    correction: ["eaten"],     explanation: "eat → eaten (irregular). Never 'eated'." },
      { mode: "click", id: "2-7",  sentence: "By tomorrow, he will have sended the email.",       wrongWord: "sended",   correction: ["sent"],      explanation: "send → sent (irregular). Never 'sended'." },
      { mode: "click", id: "2-8",  sentence: "By the deadline, they will have builded the app.",  wrongWord: "builded",  correction: ["built"],     explanation: "build → built (irregular). Never 'builded'." },
      { mode: "click", id: "2-9",  sentence: "I will have growed a lot by the end of the year.",  wrongWord: "growed",   correction: ["grown"],     explanation: "grow → grown (irregular). Never 'growed'." },
      { mode: "click", id: "2-10", sentence: "By the time the show ends, she will have comed back.", wrongWord: "comed", correction: ["come"],      explanation: "come → come (irregular, same form). Never 'comed'." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — wrong structure: will has / wrong auxiliary",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "3-1",  sentence: "She will has finished the work by 6 PM.",          correct: ["She will have finished the work by 6 PM."],            wrongWord: "has",        explanation: "Future Perfect uses 'will have', never 'will has'. Rule: will + have (not has)." },
      { mode: "rewrite", id: "3-2",  sentence: "By Monday, they will has read the report.",         correct: ["By Monday, they will have read the report."],          wrongWord: "has",        explanation: "'will has' is always wrong. Use 'will have' for all subjects." },
      { mode: "rewrite", id: "3-3",  sentence: "He will have forgotten? by tomorrow",               correct: ["Will he have forgotten by tomorrow?"],                 wrongWord: "forgotten?", explanation: "Questions invert will and subject: Will he have forgotten by tomorrow?" },
      { mode: "rewrite", id: "3-4",  sentence: "I will has left by the time you arrive.",           correct: ["I will have left by the time you arrive."],            wrongWord: "has",        explanation: "'will has' is always wrong. Use 'will have' — same for all subjects." },
      { mode: "rewrite", id: "3-5",  sentence: "By Friday, will she has finished?",                 correct: ["By Friday, will she have finished?"],                  wrongWord: "has",        explanation: "In questions too: Will she have...? Never 'will she has'." },
      { mode: "rewrite", id: "3-6",  sentence: "They will haven't completed the project by then.",  correct: ["They won't have completed the project by then.", "They will not have completed the project by then."], wrongWord: "haven't", explanation: "Negative Future Perfect: won't have / will not have (not 'will haven't')." },
      { mode: "rewrite", id: "3-7",  sentence: "She will have been finished the task by noon.",     correct: ["She will have finished the task by noon."],            wrongWord: "been",       explanation: "No 'been' in standard Future Perfect. Simply: will have + past participle." },
      { mode: "rewrite", id: "3-8",  sentence: "By tomorrow, have will she left?",                  correct: ["By tomorrow, will she have left?"],                    wrongWord: "have",       explanation: "Question word order: Will + subject + have + past participle?" },
      { mode: "rewrite", id: "3-9",  sentence: "He will have not finished by the deadline.",        correct: ["He won't have finished by the deadline.", "He will not have finished by the deadline."], wrongWord: "have", explanation: "Negative: won't have or will not have (not 'will have not')." },
      { mode: "rewrite", id: "3-10", sentence: "By next year, they will have been build the stadium.", correct: ["By next year, they will have built the stadium."], wrongWord: "been",       explanation: "No 'been' needed: will have built (Future Perfect simple, not continuous)." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — mixed mistakes",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "4-1",  sentence: "By 8 PM, I will have ate dinner.",                   correct: ["By 8 PM, I will have eaten dinner."],                  wrongWord: "ate",        explanation: "Past participle of eat → eaten (not 'ate', which is past simple)." },
      { mode: "rewrite", id: "4-2",  sentence: "She won't have went by then.",                        correct: ["She won't have gone by then."],                         wrongWord: "went",       explanation: "Past participle of go → gone (not 'went', which is past simple)." },
      { mode: "rewrite", id: "4-3",  sentence: "By Monday, they will has sent the invoice.",          correct: ["By Monday, they will have sent the invoice."],          wrongWord: "has",        explanation: "'will has' is always wrong — use 'will have' for all subjects." },
      { mode: "rewrite", id: "4-4",  sentence: "Will she has finished before we arrive?",             correct: ["Will she have finished before we arrive?"],             wrongWord: "has",        explanation: "Questions: Will + subject + have + past participle? Never 'will she has'." },
      { mode: "rewrite", id: "4-5",  sentence: "By next year, he will have writed three novels.",     correct: ["By next year, he will have written three novels."],     wrongWord: "writed",     explanation: "Past participle of write → written (irregular). Never 'writed'." },
      { mode: "rewrite", id: "4-6",  sentence: "I will haven't finished the project by the deadline.", correct: ["I won't have finished the project by the deadline.", "I will not have finished the project by the deadline."], wrongWord: "haven't", explanation: "Negative: won't have / will not have (not 'will haven't')." },
      { mode: "rewrite", id: "4-7",  sentence: "By the time she calls, I will have already went.",    correct: ["By the time she calls, I will have already gone."],     wrongWord: "went",       explanation: "go → gone (past participle). 'Went' is past simple, not a past participle." },
      { mode: "rewrite", id: "4-8",  sentence: "By Friday, will they have builded the house?",        correct: ["By Friday, will they have built the house?"],           wrongWord: "builded",    explanation: "Past participle of build → built. Never 'builded'." },
      { mode: "rewrite", id: "4-9",  sentence: "She will have not told him by then.",                 correct: ["She won't have told him by then.", "She will not have told him by then."], wrongWord: "have", explanation: "Negative: won't have / will not have (not 'will have not')." },
      { mode: "rewrite", id: "4-10", sentence: "By 2030, scientists will has discovered a cure.",     correct: ["By 2030, scientists will have discovered a cure."],     wrongWord: "has",        explanation: "'will has' is always wrong — always use 'will have' with all subjects." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Base → Participle",
  2: "Wrong Participle",
  3: "Wrong Structure",
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

  const { broadcast } = useLiveSync((payload) => {
    const a = payload.answers as {
      clickedIdx: Record<string, number>;
      typedFix: Record<string, string>;
      typed: Record<string, string>;
      checked: Record<string, boolean>;
      exNo: number;
    };
    setClickedIdx(a.clickedIdx ?? {});
    setTypedFix(a.typedFix ?? {});
    setTyped(a.typed ?? {});
    setChecked(a.checked ?? {});
    setExNo((a.exNo ?? 1) as 1 | 2 | 3 | 4);
  });

  function broadcastState(params: {
    clickedIdx?: Record<string, number>;
    typedFix?: Record<string, string>;
    typed?: Record<string, string>;
    checked?: Record<string, boolean>;
    exNo?: number;
  } = {}) {
    broadcast({
      answers: {
        clickedIdx: params.clickedIdx ?? clickedIdx,
        typedFix: params.typedFix ?? typedFix,
        typed: params.typed ?? typed,
        checked: params.checked ?? checked,
        exNo: params.exNo ?? exNo,
      },
      checked: false,
      exNo: params.exNo ?? exNo,
    });
  }

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(FUTPERF_PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  const current = SETS[exNo];
  const allChecked = current.questions.every((q) => checked[q.id]);

  function checkOne(qId: string) {
    const newChecked = { ...checked, [qId]: true };
    setChecked(newChecked);
    broadcastState({ checked: newChecked });
  }

  function checkAll() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const all: Record<string, boolean> = {};
    for (const q of current.questions) all[q.id] = true;
    const newChecked = { ...checked, ...all };
    setChecked(newChecked);
    broadcastState({ checked: newChecked });
  }

  function reset() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked({});
    setClickedIdx({});
    setTypedFix({});
    setTyped({});
    broadcastState({ clickedIdx: {}, typedFix: {}, typed: {}, checked: {} });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked({});
    setClickedIdx({});
    setTypedFix({});
    setTyped({});
    window.scrollTo({ top: 0, behavior: "smooth" });
    broadcastState({ clickedIdx: {}, typedFix: {}, typed: {}, checked: {}, exNo: n });
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect">Future Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Spot the Mistake</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Error Hunt</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Every sentence has <b>one grammar mistake</b>.{" "}
          <b>Sets 1–2:</b> click the wrong word and type the fix, then press <kbd className="rounded bg-black/8 px-1.5 py-0.5 text-xs font-mono">Enter</kbd>.{" "}
          <b>Sets 3–4:</b> rewrite the sentence correctly and press <kbd className="rounded bg-black/8 px-1.5 py-0.5 text-xs font-mono">Enter</kbd>.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {isPro ? (
            <div className=""><SpeedRound gameId="futperf-spot-the-mistake" subject="Future Perfect" questions={FUTPERF_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                          onClickToken={(i) => { if (!checked[q.id]) { const newClickedIdx = { ...clickedIdx, [q.id]: i }; setClickedIdx(newClickedIdx); broadcastState({ clickedIdx: newClickedIdx }); } }}
                          onTypeFix={(v) => { const newTypedFix = { ...typedFix, [q.id]: v }; setTypedFix(newTypedFix); broadcastState({ typedFix: newTypedFix }); }}
                          onCheck={() => checkOne(q.id)}
                        />
                      ) : (
                        <RewriteCard
                          key={q.id}
                          q={q}
                          idx={idx}
                          value={typed[q.id] ?? ""}
                          isChecked={checked[q.id] ?? false}
                          onChange={(v) => { const newTyped = { ...typed, [q.id]: v }; setTyped(newTyped); broadcastState({ typed: newTyped }); }}
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

          {isPro ? (
            <TenseRecommendations tense="future-perfect" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-perfect/fill-in-blank" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Fill in the Blank</a>
          <a href="/tenses/future-perfect/sentence-builder" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Sentence Builder →</a>
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
              placeholder="Rewrite the sentence correctly… (Enter)"
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              className={`w-full rounded-lg border px-3 py-2 text-sm font-mono outline-none transition ${
                isChecked
                  ? isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700"
                  : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
              }`}
            />
          </div>
          {!isChecked && value.trim() && (
            <button onClick={onCheck} className="mt-2 rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-black text-black hover:opacity-90 transition">Check</button>
          )}
          {isChecked && (
            <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
              {isCorrect ? (
                <><span className="font-black">✅ Correct!</span> {q.explanation}</>
              ) : (
                <><span className="font-black">❌ Not quite.</span> Accepted: <b className="font-mono">{q.correct[0]}</b>. {q.explanation}</>
              )}
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
            { text: "will have", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By 6 PM, she will have finished.  ·  They will have gone." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't have", color: "red" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't have finished yet.  ·  She won't have arrived by then." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "have", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you have finished by Monday?  ·  Will she have left?" />
          </div>
        </div>
      </div>

      {/* will have table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will have — same for all subjects</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Auxiliary</th>
                <th className="px-4 py-2.5 font-black text-red-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I / You / He / She", "will have ✅", "She will have finished. (NOT she will has)"],
                ["It / We / They", "will have ✅", "They will have arrived. (NOT they will has)"],
              ].map(([subj, aux, ex], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aux}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-sm">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Most common mistake:</span> &quot;will has&quot; ❌ — the auxiliary is <b>always will have</b>, never &quot;will has&quot;.<br />
          <span className="text-xs">Also: past participles never change — &quot;eated&quot; ❌, &quot;goed&quot; ❌, &quot;writed&quot; ❌</span>
        </div>
      </div>

      {/* Common mistakes */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common mistakes to avoid</div>
        <div className="space-y-2">
          {[
            { wrong: "She will has finished.", right: "She will have finished.", note: "'will has' → always 'will have'" },
            { wrong: "By then, he will have goed.", right: "By then, he will have gone.", note: "go → gone (not 'goed')" },
            { wrong: "I will have eated by 7.", right: "I will have eaten by 7.", note: "eat → eaten (not 'eated')" },
            { wrong: "They will haven't left.", right: "They won't have left.", note: "negative = won't have (not 'will haven't')" },
            { wrong: "Will she has arrived?", right: "Will she have arrived?", note: "questions too: will + have (not has)" },
          ].map(({ wrong, right, note }) => (
            <div key={wrong} className="rounded-xl bg-white border border-black/10 px-4 py-3 grid sm:grid-cols-2 gap-2 text-sm">
              <div className="text-red-700 font-mono">❌ {wrong}</div>
              <div>
                <div className="text-emerald-700 font-mono font-semibold">✅ {right}</div>
                <div className="text-xs text-slate-500 mt-0.5">{note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Irregular past participles */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Irregular past participles</div>
        <div className="flex flex-wrap gap-2">
          {[
            "go → gone", "eat → eaten", "write → written", "take → taken", "make → made",
            "leave → left", "build → built", "find → found", "spend → spent", "buy → bought",
            "send → sent", "come → come", "run → run", "tell → told", "grow → grown",
          ].map((pair) => (
            <span key={pair} className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{pair}</span>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Key time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["by tomorrow", "by Monday", "by next week", "by the time + clause", "by then", "by the end of...", "already", "yet (negative)"].map((t) => (
            <span key={t} className="rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
