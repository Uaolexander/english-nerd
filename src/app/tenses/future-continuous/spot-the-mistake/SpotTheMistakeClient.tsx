"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { FUTCONT_SPEED_QUESTIONS, FUTCONT_PDF_CONFIG } from "../futContSharedData";
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
    title: "Exercise 1 — missing 'be' or wrong auxiliary form",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "1-1",  sentence: "She will working tomorrow.",                      wrongWord: "working",    correction: ["be working"],    explanation: "Future Continuous needs 'be': will be working. Never 'will working'." },
      { mode: "click", id: "1-2",  sentence: "At 8 PM I will been watching the match.",          wrongWord: "been",       correction: ["be"],            explanation: "Use 'will be' not 'will been'. Future Continuous: will be + verb-ing." },
      { mode: "click", id: "1-3",  sentence: "They will be work all day tomorrow.",              wrongWord: "work",       correction: ["working"],       explanation: "After 'will be', the verb must take -ing: will be working." },
      { mode: "click", id: "1-4",  sentence: "He will being sleeping when you arrive.",          wrongWord: "being",      correction: ["be"],            explanation: "The form is 'will be' — not 'will being'. Future Continuous: will be + verb-ing." },
      { mode: "click", id: "1-5",  sentence: "When you call, she wills be cooking dinner.",      wrongWord: "wills",      correction: ["will"],          explanation: "'will' never takes -s. All subjects: will be + verb-ing." },
      { mode: "click", id: "1-6",  sentence: "This time next week they will be sit on the beach.", wrongWord: "sit",      correction: ["sitting"],       explanation: "After 'will be', use verb-ing: sitting, not the base form sit." },
      { mode: "click", id: "1-7",  sentence: "She will working from home this Friday.",          wrongWord: "working",    correction: ["be working"],    explanation: "Missing 'be': will be working. Future Continuous = will be + verb-ing." },
      { mode: "click", id: "1-8",  sentence: "They will been travelling all night.",             wrongWord: "been",       correction: ["be"],            explanation: "Use 'will be' not 'will been'. Future Continuous: will be + verb-ing." },
      { mode: "click", id: "1-9",  sentence: "By midnight I will be sleep.",                    wrongWord: "sleep",      correction: ["sleeping"],      explanation: "After 'will be', add -ing: sleeping, not the base form." },
      { mode: "click", id: "1-10", sentence: "The team wills be presenting tomorrow.",           wrongWord: "wills",      correction: ["will"],          explanation: "'will' is a modal and never changes form. All subjects use 'will'." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — wrong -ing spelling",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "2-1",  sentence: "At noon she'll be makeing lunch.",                 wrongWord: "makeing",    correction: ["making"],        explanation: "make → making. Drop the final -e before adding -ing." },
      { mode: "click", id: "2-2",  sentence: "By 6 AM he will be runing in the park.",           wrongWord: "runing",     correction: ["running"],       explanation: "run → running. Short CVC verb: double the final consonant." },
      { mode: "click", id: "2-3",  sentence: "They'll be siting by the pool all afternoon.",     wrongWord: "siting",     correction: ["sitting"],       explanation: "sit → sitting. Short CVC verb: double the final consonant." },
      { mode: "click", id: "2-4",  sentence: "She'll be writeing the report at that time.",      wrongWord: "writeing",   correction: ["writing"],       explanation: "write → writing. Drop the final -e before adding -ing." },
      { mode: "click", id: "2-5",  sentence: "At midnight they will be swiming in the ocean.",   wrongWord: "swiming",    correction: ["swimming"],      explanation: "swim → swimming. Short CVC verb: double the final consonant." },
      { mode: "click", id: "2-6",  sentence: "She'll be dieing her hair tomorrow.",              wrongWord: "dieing",     correction: ["dying"],         explanation: "die → dying. Verbs ending in -ie: change -ie to -y, then add -ing." },
      { mode: "click", id: "2-7",  sentence: "He will be driveing to work all next week.",       wrongWord: "driveing",   correction: ["driving"],       explanation: "drive → driving. Drop the final -e before adding -ing." },
      { mode: "click", id: "2-8",  sentence: "This time tomorrow, I'll be lieing on the beach.", wrongWord: "lieing",     correction: ["lying"],         explanation: "lie → lying. Verbs ending in -ie: change -ie to -y, then add -ing." },
      { mode: "click", id: "2-9",  sentence: "They'll be stoping for fuel on the way.",          wrongWord: "stoping",    correction: ["stopping"],      explanation: "stop → stopping. Short CVC verb: double the final consonant." },
      { mode: "click", id: "2-10", sentence: "She will be shineing a torch through the window.", wrongWord: "shineing",   correction: ["shining"],       explanation: "shine → shining. Drop the final -e before adding -ing." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — wrong question form",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "3-1",  sentence: "Will she be work tomorrow?",                    correct: ["Will she be working tomorrow?"],                  wrongWord: "work",     explanation: "After 'will be', the verb must take -ing: working, not the base form work." },
      { mode: "rewrite", id: "3-2",  sentence: "Does she will be going to the party?",          correct: ["Will she be going to the party?"],                 wrongWord: "Does",     explanation: "Future Continuous questions use 'Will' as the auxiliary — never does/do." },
      { mode: "rewrite", id: "3-3",  sentence: "Will you be work late tonight?",                correct: ["Will you be working late tonight?"],               wrongWord: "work",     explanation: "Will + subject + be + verb-ing: working, not the base form work." },
      { mode: "rewrite", id: "3-4",  sentence: "Will be she travelling next week?",             correct: ["Will she be travelling next week?"],               wrongWord: "be",       explanation: "Word order for questions: Will + subject + be + verb-ing? Not 'Will be she…'" },
      { mode: "rewrite", id: "3-5",  sentence: "Do they will be eating when I arrive?",         correct: ["Will they be eating when I arrive?"],              wrongWord: "Do",       explanation: "Future Continuous questions start with 'Will', not 'Do'." },
      { mode: "rewrite", id: "3-6",  sentence: "Will he be sleep by 10 PM?",                   correct: ["Will he be sleeping by 10 PM?"],                   wrongWord: "sleep",    explanation: "After 'will be', use -ing form: sleeping, not the base form sleep." },
      { mode: "rewrite", id: "3-7",  sentence: "Is she will be cooking dinner?",               correct: ["Will she be cooking dinner?"],                     wrongWord: "Is",       explanation: "Future Continuous questions use 'Will' as the auxiliary — not 'Is'." },
      { mode: "rewrite", id: "3-8",  sentence: "Will they working all night?",                 correct: ["Will they be working all night?"],                 wrongWord: "working",  explanation: "Missing 'be': Will they be working? Future Continuous question: Will + subject + be + verb-ing?" },
      { mode: "rewrite", id: "3-9",  sentence: "Will she be come to the meeting?",             correct: ["Will she be coming to the meeting?"],              wrongWord: "come",     explanation: "After 'will be', use -ing form: coming, not the base form come." },
      { mode: "rewrite", id: "3-10", sentence: "Where will they travelling next summer?",      correct: ["Where will they be travelling next summer?"],      wrongWord: "travelling", explanation: "Missing 'be': Where will they be travelling? Question: Will + subject + be + verb-ing?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — mixed mistakes",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "4-1",  sentence: "At 9 PM she will working on the report.",       correct: ["At 9 PM she will be working on the report."],      wrongWord: "working",  explanation: "Missing 'be': will be working. Future Continuous = will be + verb-ing." },
      { mode: "rewrite", id: "4-2",  sentence: "This time tomorrow I'll be swim in the sea.",   correct: ["This time tomorrow I'll be swimming in the sea."], wrongWord: "swim",     explanation: "After 'will be', use -ing: swimming (swim → swimming, double consonant)." },
      { mode: "rewrite", id: "4-3",  sentence: "Will you working from home tomorrow?",          correct: ["Will you be working from home tomorrow?"],          wrongWord: "working",  explanation: "Missing 'be': Will you be working? Future Continuous question needs 'be'." },
      { mode: "rewrite", id: "4-4",  sentence: "She wills be presenting the results at noon.",  correct: ["She will be presenting the results at noon."],      wrongWord: "wills",    explanation: "'will' never takes -s. All subjects: will be + verb-ing." },
      { mode: "rewrite", id: "4-5",  sentence: "By midnight they will been sleeping.",          correct: ["By midnight they will be sleeping."],               wrongWord: "been",     explanation: "Use 'will be' not 'will been'. Future Continuous: will be + verb-ing." },
      { mode: "rewrite", id: "4-6",  sentence: "Is he going to will be joining us?",            correct: ["Will he be joining us?"],                           wrongWord: "Is",       explanation: "Don't mix 'going to' and 'will'. Future Continuous: Will + subject + be + verb-ing?" },
      { mode: "rewrite", id: "4-7",  sentence: "When you arrive they are going to will be eat.", correct: ["When you arrive they will be eating."],            wrongWord: "eat",      explanation: "Use will be + verb-ing: eating. Don't mix 'going to' and 'will'." },
      { mode: "rewrite", id: "4-8",  sentence: "She'll be makeing dinner when I get home.",     correct: ["She'll be making dinner when I get home."],         wrongWord: "makeing",  explanation: "make → making. Drop the final -e before adding -ing." },
      { mode: "rewrite", id: "4-9",  sentence: "Will the team be work on this all night?",      correct: ["Will the team be working on this all night?"],      wrongWord: "work",     explanation: "After 'will be', use -ing: working, not the base form work." },
      { mode: "rewrite", id: "4-10", sentence: "Don't call at 3 — she'll be have a meeting.",   correct: ["Don't call at 3 — she'll be having a meeting."],   wrongWord: "have",     explanation: "After 'will be', use -ing: having (have → having, drop -e), not the base form." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Missing 'be'",
  2: "-ing spelling",
  3: "Question form",
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

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(FUTCONT_PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  const current = SETS[exNo];
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-continuous">Future Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Spot the Mistake</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Continuous{" "}
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

          {isPro ? (
            <div className=""><SpeedRound gameId="futcont-spot-the-mistake" subject="Future Continuous" questions={FUTCONT_SPEED_QUESTIONS} variant="sidebar" /></div>
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

          {isPro ? (
            <TenseRecommendations tense="future-continuous" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-continuous/fill-in-blank" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Fill in the Blank</a>
          <a href="/tenses/future-continuous/sentence-builder" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Sentence Builder →</a>
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
            { text: "will be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will be working.  ·  She will be sleeping.  ·  They will be travelling." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't be", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't be working tomorrow.  ·  She won't be joining us." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you be working tonight?  ·  Will she be coming?" />
          </div>
        </div>
      </div>

      {/* will be — same for all subjects */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will be is the same for ALL subjects</div>
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
                ["I", "will be working", "won't be working", "Will I be working?"],
                ["He / She / It", "will be working ★", "won't be working", "Will she be working?"],
                ["You / We / They", "will be working", "won't be working", "Will they be working?"],
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
          <span className="font-black">★ Key rule:</span> &quot;will be&quot; never changes — same form for all subjects!<br />
          <span className="text-xs">✅ She <b>will be</b> working &nbsp;|&nbsp; ❌ She <b>will working</b> (missing &quot;be&quot;) &nbsp;|&nbsp; ❌ She <b>wills be</b> working (&quot;will&quot; never takes -s)</span>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Common mistakes to avoid</div>
        <div className="space-y-1.5 mt-2 text-xs text-amber-700">
          <div>✅ She will be <b>working</b>. &nbsp;|&nbsp; ❌ She will be <b>work</b>. (base form after &quot;be&quot;)</div>
          <div>✅ Will you be <b>coming</b>? &nbsp;|&nbsp; ❌ Will you <b>coming</b>? (missing &quot;be&quot;)</div>
          <div>✅ I <b>will be</b> sleeping. &nbsp;|&nbsp; ❌ I <b>will been</b> sleeping. (&quot;been&quot; = wrong tense)</div>
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Future Continuous</div>
        <div className="space-y-2">
          {[
            { use: "Action in progress at a specific future time", ex: "At 8 PM tomorrow, I'll be watching the match." },
            { use: "Action in progress when another action happens", ex: "When you arrive, I'll be cooking dinner." },
            { use: "Polite questions about plans", ex: "Will you be using the car tonight?" },
            { use: "Planned/expected events in the future", ex: "This time next week, we'll be sitting on the beach." },
          ].map(({ use, ex }) => (
            <div key={use} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{use}</div>
              <div className="text-xs text-slate-500 mt-0.5 italic">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* -ing spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ing", ex: "work → working · play → playing · read → reading" },
            { rule: "Ends in -e → drop the -e, add -ing", ex: "make → making · come → coming · write → writing · drive → driving" },
            { rule: "Short verb (CVC) → double the final consonant", ex: "run → running · sit → sitting · swim → swimming · stop → stopping" },
            { rule: "Ends in -ie → change to -y, add -ing", ex: "die → dying · lie → lying · tie → tying" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{rule}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["at this time tomorrow", "at 8 o'clock tomorrow", "this time next week", "this time next month", "this time next year", "when you arrive", "when you call", "all day tomorrow", "soon", "tonight", "by midnight", "at noon tomorrow"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
