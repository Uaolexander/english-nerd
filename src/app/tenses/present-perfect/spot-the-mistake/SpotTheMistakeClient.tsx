"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import { useLiveSync } from "@/lib/useLiveSync";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PP_SPEED_QUESTIONS, PP_PDF_CONFIG } from "../ppSharedData";
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
    title: "Exercise 1 — wrong have / has",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "1-1",  sentence: "She have finished her homework.",           wrongWord: "have",    correction: ["has"],              explanation: "She → has: She has finished. (I/you/we/they → have; he/she/it → has)" },
      { mode: "click", id: "1-2",  sentence: "They has lived here for ten years.",         wrongWord: "has",     correction: ["have"],             explanation: "They → have: They have lived." },
      { mode: "click", id: "1-3",  sentence: "He have just left the office.",              wrongWord: "have",    correction: ["has"],              explanation: "He → has: He has just left." },
      { mode: "click", id: "1-4",  sentence: "We has already eaten lunch.",                wrongWord: "has",     correction: ["have"],             explanation: "We → have: We have already eaten." },
      { mode: "click", id: "1-5",  sentence: "The film have started.",                     wrongWord: "have",    correction: ["has"],              explanation: "The film (= it) → has: The film has started." },
      { mode: "click", id: "1-6",  sentence: "You has done a great job.",                  wrongWord: "has",     correction: ["have"],             explanation: "You → have: You have done." },
      { mode: "click", id: "1-7",  sentence: "My parents has gone to Spain.",              wrongWord: "has",     correction: ["have"],             explanation: "My parents (= they) → have: They have gone." },
      { mode: "click", id: "1-8",  sentence: "It have been very cold this week.",          wrongWord: "have",    correction: ["has"],              explanation: "It → has: It has been." },
      { mode: "click", id: "1-9",  sentence: "The children has never tried sushi.",        wrongWord: "has",     correction: ["have"],             explanation: "The children (= they) → have: They have never tried." },
      { mode: "click", id: "1-10", sentence: "She have worked here since 2019.",           wrongWord: "have",    correction: ["has"],              explanation: "She → has: She has worked here since 2019." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — wrong past participle",
    instructions: "Click the wrong word, type the correct past participle form, then press Enter.",
    questions: [
      { mode: "click", id: "2-1",  sentence: "I have went to Japan twice.",               wrongWord: "went",     correction: ["been", "gone"],    explanation: "Go → been (for experience) or gone (left and not back). went is Past Simple." },
      { mode: "click", id: "2-2",  sentence: "She has taked my umbrella.",                wrongWord: "taked",    correction: ["taken"],           explanation: "Take → taken (irregular). taked does not exist." },
      { mode: "click", id: "2-3",  sentence: "He has drinked all the milk.",              wrongWord: "drinked",  correction: ["drunk"],           explanation: "Drink → drunk (irregular). drinked does not exist." },
      { mode: "click", id: "2-4",  sentence: "They have writed three emails today.",      wrongWord: "writed",   correction: ["written"],         explanation: "Write → written (irregular). writed does not exist." },
      { mode: "click", id: "2-5",  sentence: "We have buyed a new car.",                  wrongWord: "buyed",    correction: ["bought"],          explanation: "Buy → bought (irregular). buyed does not exist." },
      { mode: "click", id: "2-6",  sentence: "She has catched the bus.",                  wrongWord: "catched",  correction: ["caught"],          explanation: "Catch → caught (irregular). catched does not exist." },
      { mode: "click", id: "2-7",  sentence: "I have knowed him for years.",              wrongWord: "knowed",   correction: ["known"],           explanation: "Know → known (irregular). knowed does not exist." },
      { mode: "click", id: "2-8",  sentence: "He has falled asleep on the sofa.",        wrongWord: "falled",   correction: ["fallen"],          explanation: "Fall → fallen (irregular). falled does not exist." },
      { mode: "click", id: "2-9",  sentence: "They have gived us a big discount.",       wrongWord: "gived",    correction: ["given"],           explanation: "Give → given (irregular). gived does not exist." },
      { mode: "click", id: "2-10", sentence: "She has forgotted her password again.",    wrongWord: "forgotted", correction: ["forgotten"],       explanation: "Forget → forgotten (irregular). forgotted does not exist." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — wrong tense: Present Perfect vs Past Simple",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "3-1",  sentence: "I have seen him yesterday.",             correct: ["I saw him yesterday."],                           wrongWord: "have",      explanation: "Yesterday = specific past time → Past Simple: I saw him yesterday." },
      { mode: "rewrite", id: "3-2",  sentence: "She went to Paris three times.",         correct: ["She has been to Paris three times.", "She has gone to Paris three times."], wrongWord: "went", explanation: "No specific time, experience → Present Perfect: She has been to Paris three times." },
      { mode: "rewrite", id: "3-3",  sentence: "I have met her at a party in 2021.",     correct: ["I met her at a party in 2021."],                   wrongWord: "have",      explanation: "In 2021 = specific past time → Past Simple: I met her in 2021." },
      { mode: "rewrite", id: "3-4",  sentence: "Did you ever eat fugu?",                 correct: ["Have you ever eaten fugu?"],                       wrongWord: "Did",       explanation: "Ever + experience question → Present Perfect: Have you ever eaten fugu?" },
      { mode: "rewrite", id: "3-5",  sentence: "We have moved to this city last year.",  correct: ["We moved to this city last year."],                 wrongWord: "have",      explanation: "Last year = specific past time → Past Simple: We moved last year." },
      { mode: "rewrite", id: "3-6",  sentence: "He already finished, so he left.",       correct: ["He had already finished, so he left.", "He has already finished, so he can leave."], wrongWord: "already", explanation: "In a sequence of past events, use Past Perfect (had finished) or adjust the tense consistently." },
      { mode: "rewrite", id: "3-7",  sentence: "I live here since 2015.",                correct: ["I have lived here since 2015.", "I've lived here since 2015."], wrongWord: "live", explanation: "Since 2015 → Present Perfect: I have lived here since 2015." },
      { mode: "rewrite", id: "3-8",  sentence: "She has called me last Monday.",         correct: ["She called me last Monday."],                      wrongWord: "has",       explanation: "Last Monday = specific past time → Past Simple: She called me last Monday." },
      { mode: "rewrite", id: "3-9",  sentence: "They worked here for three years.",      correct: ["They have worked here for three years.", "They've worked here for three years."], wrongWord: "worked", explanation: "For three years (still ongoing) → Present Perfect: They have worked here for three years." },
      { mode: "rewrite", id: "3-10", sentence: "Have you finished it last night?",       correct: ["Did you finish it last night?"],                   wrongWord: "Have",      explanation: "Last night = specific past time → Past Simple: Did you finish it last night?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — mixed: word order with already / yet / just, double auxiliary, negatives",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "4-1",  sentence: "I already have finished my work.",        correct: ["I have already finished my work.", "I've already finished my work."],  wrongWord: "already",    explanation: "Already goes after have/has, before the past participle: I have already finished." },
      { mode: "rewrite", id: "4-2",  sentence: "Have you eaten yet already?",             correct: ["Have you eaten yet?", "Have you already eaten?"],                       wrongWord: "already",    explanation: "Use either yet (in questions/negatives) OR already (in affirmatives/questions for surprise). Not both." },
      { mode: "rewrite", id: "4-3",  sentence: "She hasn't never been abroad.",           correct: ["She has never been abroad.", "She hasn't been abroad."],                 wrongWord: "never",      explanation: "Double negative (hasn't + never) is incorrect. Use: She has never been abroad OR She hasn't been abroad." },
      { mode: "rewrite", id: "4-4",  sentence: "He has been just promoted.",              correct: ["He has just been promoted.", "He's just been promoted."],                wrongWord: "been",       explanation: "Just goes directly after has: He has just been promoted." },
      { mode: "rewrite", id: "4-5",  sentence: "Have you been ever to New York?",         correct: ["Have you ever been to New York?"],                                       wrongWord: "been",       explanation: "Ever goes after the subject, before the past participle: Have you ever been to New York?" },
      { mode: "rewrite", id: "4-6",  sentence: "I have have finished the report.",        correct: ["I have finished the report.", "I've finished the report."],               wrongWord: "have",       explanation: "Only one auxiliary is needed: I have finished (not I have have finished)." },
      { mode: "rewrite", id: "4-7",  sentence: "Yet have you finished the project?",      correct: ["Have you finished the project yet?"],                                    wrongWord: "Yet",        explanation: "Yet goes to the end of the question: Have you finished the project yet?" },
      { mode: "rewrite", id: "4-8",  sentence: "She didn't has eaten yet.",               correct: ["She hasn't eaten yet.", "She has not eaten yet."],                       wrongWord: "didn't",     explanation: "Present Perfect negative: hasn't / has not + past participle. Not didn't + has." },
      { mode: "rewrite", id: "4-9",  sentence: "They have been waited for an hour.",      correct: ["They have waited for an hour.", "They have been waiting for an hour."],  wrongWord: "been",       explanation: "Active voice: They have waited for an hour. Or use Present Perfect Continuous: They have been waiting." },
      { mode: "rewrite", id: "4-10", sentence: "Has she finished? Yes, she have.",        correct: ["Has she finished? Yes, she has."],                                       wrongWord: "have",       explanation: "Short answer must match the auxiliary in the question: Has → Yes, she has. (not have)" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "have/has",
  2: "Past participles",
  3: "Tense choice",
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
    try { await generateLessonPDF(PP_PDF_CONFIG); } finally { setPdfLoading(false); }
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-perfect">Present Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Spot the Mistake</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Error Hunt</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1</span>
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
            <div className=""><SpeedRound gameId="pp-spot-the-mistake" subject="Present Perfect" questions={PP_SPEED_QUESTIONS} variant="sidebar" /></div>
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

          {/* Right column */}
          {isPro ? (
            <TenseRecommendations tense="present-perfect" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {!isPro && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
            <div className="hidden lg:block" />
            <SpeedRound gameId="pp-spot-the-mistake" subject="Present Perfect" questions={PP_SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-perfect/fill-in-blank" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Fill in the Blank</a>
          <a href="/tenses/present-perfect/sentence-builder" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Sentence Builder →</a>
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
              placeholder="Type the corrected sentence… (Enter)"
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              className={`w-full rounded-lg border px-3 py-2 text-sm font-mono outline-none transition ${
                isChecked
                  ? isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"
                  : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
              }`}
            />
            {!isChecked && value.trim() && (
              <button onClick={onCheck} className="mt-2 rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-black text-black hover:opacity-90 transition">Check</button>
            )}
          </div>
          {isChecked && (
            <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
              {isCorrect && <><span className="font-black">✅ Correct!</span> {q.explanation}</>}
              {isWrong && (
                <><span className="font-black">❌ Not quite.</span> Accepted: <b className="font-mono">{q.correct[0]}</b>
                {q.correct.length > 1 && <span className="text-xs"> (or: {q.correct.slice(1).join(" / ")})</span>}. {q.explanation}</>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

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
            { text: "have / has", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I have worked.  ·  She has eaten.  ·  They have gone." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "haven't / hasn't", color: "red" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I haven't seen him.  ·  She hasn't called.  ·  They haven't arrived." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Have / Has", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "past participle", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Have you seen this film?  ·  Has she arrived?" />
          </div>
        </div>
      </div>

      {/* have / has table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">have vs has</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
                <th className="px-4 py-2.5 font-black text-sky-700">?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I / You / We / They", "have worked", "haven't worked", "Have you worked?"],
                ["He / She / It ★", "has worked", "hasn't worked", "Has she worked?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 1 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> He / She / It always use <b>has</b> / <b>hasn&apos;t</b>. After have/has use the <b>past participle</b>, never the base form.<br />
          <span className="text-xs">She <b>has finished</b> ✅ &nbsp; She <b>have finished</b> ❌ &nbsp; She <b>has finish</b> ❌</span>
        </div>
      </div>

      {/* When to use — 4 use cases */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Present Perfect</div>
        <div className="space-y-3">
          {[
            { label: "Life experience (ever / never)", color: "violet", examples: ["Have you ever been to Japan?", "I've never tried sushi."] },
            { label: "Recent past with present result (just)", color: "sky", examples: ["She has just left the office.", "I've just finished."] },
            { label: "Action still ongoing (since / for)", color: "green", examples: ["I've lived here for 5 years.", "She's worked here since 2020."] },
            { label: "Completion / achievement (already / yet)", color: "yellow", examples: ["I've already done my homework.", "Have you finished yet?"] },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = { violet: "border-violet-200 bg-violet-50/50", sky: "border-sky-200 bg-sky-50/50", green: "border-emerald-200 bg-emerald-50/50", yellow: "border-amber-200 bg-amber-50/50" };
            const badgeMap: Record<string, string> = { violet: "bg-violet-100 text-violet-800 border-violet-200", sky: "bg-sky-100 text-sky-800 border-sky-200", green: "bg-emerald-100 text-emerald-800 border-emerald-200", yellow: "bg-yellow-100 text-yellow-800 border-yellow-200" };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}>{label}</span>
                <div className="space-y-1">
                  {examples.map((ex) => <Ex key={ex} en={ex} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common irregular past participles */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common irregular past participles</div>
        <div className="flex flex-wrap gap-2">
          {[
            "be → been", "do → done", "go → gone/been", "see → seen", "eat → eaten",
            "come → come", "take → taken", "make → made", "give → given", "get → got",
            "find → found", "know → known", "think → thought", "buy → bought", "leave → left",
            "write → written", "read → read", "tell → told", "hear → heard", "feel → felt",
            "meet → met", "run → run", "fly → flown", "drink → drunk", "drive → driven",
            "break → broken", "bring → brought", "catch → caught", "fall → fallen", "forget → forgotten",
          ].map((v) => (
            <span key={v} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{v}</span>
          ))}
        </div>
      </div>

      {/* PP vs Past Simple */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Present Perfect vs Past Simple</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-emerald-700">Present Perfect</th>
                <th className="px-4 py-2.5 font-black text-left text-red-700">Past Simple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["No specific time mentioned", "Specific time mentioned"],
                ["With: ever, never, just, already, yet, since, for", "With: yesterday, last week, in 2020, ago"],
                ["I have seen that film.", "I saw that film last week."],
                ["She has just called.", "She called an hour ago."],
                ["Have you ever been to Italy?", "Did you go to Italy last year?"],
              ].map(([pp, ps], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-emerald-800 font-mono text-xs">{pp}</td>
                  <td className="px-4 py-2.5 text-red-800 font-mono text-xs">{ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["already", "yet", "just", "ever", "never", "since 2020", "since Monday", "for 5 years", "for a long time", "recently", "so far", "today", "this week", "this month", "this year", "many times", "once", "twice"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
