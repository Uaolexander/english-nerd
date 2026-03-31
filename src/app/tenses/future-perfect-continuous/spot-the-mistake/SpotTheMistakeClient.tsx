"use client";

import { useMemo, useRef, useState } from "react";

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
    title: "Exercise 1 — Wrong form: missing 'have been' or wrong order",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "1-1",  sentence: "By next June, she will been working here for five years.",      wrongWord: "been",     correction: ["have been"],     explanation: "The correct form is will have been working — 'have' is missing before 'been'." },
      { mode: "click", id: "1-2",  sentence: "They will have working on the project for three months by then.", wrongWord: "have",     correction: ["have been"],     explanation: "will have been working — 'been' is needed after 'have' in Future Perfect Continuous." },
      { mode: "click", id: "1-3",  sentence: "She will been studying all morning by the time you arrive.",    wrongWord: "been",     correction: ["have been"],     explanation: "will have been studying — 'have' is missing: will + have + been + verb-ing." },
      { mode: "click", id: "1-4",  sentence: "He will have been teach at this school for 20 years by 2030.",  wrongWord: "teach",    correction: ["teaching"],      explanation: "will have been teaching — needs the -ing form: teaching, not the base verb teach." },
      { mode: "click", id: "1-5",  sentence: "By midnight, we will have been danced for five hours.",         wrongWord: "danced",   correction: ["dancing"],       explanation: "will have been dancing — present participle required, not past participle 'danced'." },
      { mode: "click", id: "1-6",  sentence: "By the time you read this, I will been travelling for a year.", wrongWord: "been",     correction: ["have been"],     explanation: "will have been travelling — 'have' is missing before 'been'." },
      { mode: "click", id: "1-7",  sentence: "She will have been waited for over two hours when we arrive.",  wrongWord: "waited",   correction: ["waiting"],       explanation: "will have been waiting — present participle 'waiting', not past participle 'waited'." },
      { mode: "click", id: "1-8",  sentence: "By 2030, they will been building the new bridge for ten years.", wrongWord: "been",    correction: ["have been"],     explanation: "will have been building — 'have' is required: will + have + been + -ing." },
      { mode: "click", id: "1-9",  sentence: "He will have run for four hours when he crosses the finish line.", wrongWord: "run",   correction: ["been running"],  explanation: "To emphasise duration, use will have been running, not will have run (Future Perfect)." },
      { mode: "click", id: "1-10", sentence: "By next year, I will have been work here for a decade.",        wrongWord: "work",     correction: ["working"],       explanation: "will have been working — the -ing form is required: working, not the base verb work." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Stative verbs in continuous OR wrong -ing spelling",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "2-1",  sentence: "By then, I will have been knowing her for ten years.",          wrongWord: "knowing",   correction: ["known"],         explanation: "'Know' is a stative verb — no continuous form. Use Future Perfect: will have known." },
      { mode: "click", id: "2-2",  sentence: "She will have been wanting a new job for months by then.",      wrongWord: "wanting",   correction: ["wanted"],        explanation: "'Want' is a stative verb. Use Future Perfect: will have wanted (or restructure the sentence)." },
      { mode: "click", id: "2-3",  sentence: "He will have been runing for three hours when he finishes.",    wrongWord: "runing",    correction: ["running"],       explanation: "run → running: CVC rule — double the final consonant (not runing)." },
      { mode: "click", id: "2-4",  sentence: "By Friday, she will have been writeing her novel for a year.",  wrongWord: "writeing",  correction: ["writing"],       explanation: "write → writing: drop the -e before -ing (NOT writeing)." },
      { mode: "click", id: "2-5",  sentence: "They will have been likeing the new system for months by then.", wrongWord: "likeing",  correction: ["liked"],         explanation: "'Like' is a stative verb — no continuous form. Use Future Perfect: will have liked." },
      { mode: "click", id: "2-6",  sentence: "By September, he will have been siting at that desk for years.", wrongWord: "siting",   correction: ["sitting"],       explanation: "sit → sitting: CVC rule — double the final t (NOT siting)." },
      { mode: "click", id: "2-7",  sentence: "She will have been owning the car for two years by then.",      wrongWord: "owning",    correction: ["owned"],         explanation: "'Own' is a stative verb. Use Future Perfect: will have owned the car for two years." },
      { mode: "click", id: "2-8",  sentence: "By Tuesday, they will have been swiming for three weeks.",      wrongWord: "swiming",   correction: ["swimming"],      explanation: "swim → swimming: CVC rule — double the final m (NOT swiming)." },
      { mode: "click", id: "2-9",  sentence: "He will have been understanding the problem for hours.",        wrongWord: "understanding", correction: ["understood"], explanation: "'Understand' is a stative verb — no continuous. Use Future Perfect: will have understood." },
      { mode: "click", id: "2-10", sentence: "By next month, she will have been makeing the same mistake.",   wrongWord: "makeing",   correction: ["making"],        explanation: "make → making: drop the final -e before adding -ing (NOT makeing)." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Wrong question form or missing 'for' with duration",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "3-1",  sentence: "Will she have been working here since five years by June?",           correct: ["Will she have been working here for five years by June?"],                                                      wrongWord: "since",          explanation: "Use 'for' (not 'since') with a period of time: for five years." },
      { mode: "rewrite", id: "3-2",  sentence: "How long she will have been waiting when we get there?",              correct: ["How long will she have been waiting when we get there?"],                                                       wrongWord: "she",            explanation: "Question word order: How long + will + subject + have been + verb-ing?" },
      { mode: "rewrite", id: "3-3",  sentence: "Will they have working on the project for a year by December?",       correct: ["Will they have been working on the project for a year by December?"],                                          wrongWord: "working",        explanation: "The correct structure is will + have been + working — 'been' is missing." },
      { mode: "rewrite", id: "3-4",  sentence: "By next year, she will have been live here since ten years.",         correct: ["By next year, she will have been living here for ten years."],                                                  wrongWord: "live",           explanation: "Two errors: 'live' should be 'living' (-ing form), and 'since' should be 'for' (period of time)." },
      { mode: "rewrite", id: "3-5",  sentence: "Will you have been studying since three hours when the exam starts?", correct: ["Will you have been studying for three hours when the exam starts?"],                                            wrongWord: "since",          explanation: "'For' is used with a period of duration (three hours), not 'since'." },
      { mode: "rewrite", id: "3-6",  sentence: "How long will they been building the new stadium?",                   correct: ["How long will they have been building the new stadium?"],                                                      wrongWord: "been",           explanation: "'Have' is missing: How long will they have been building?" },
      { mode: "rewrite", id: "3-7",  sentence: "Will he have been teaches English for 30 years by retirement?",       correct: ["Will he have been teaching English for 30 years by retirement?"],                                             wrongWord: "teaches",        explanation: "After 'have been' use the present participle: teaching, not 'teaches'." },
      { mode: "rewrite", id: "3-8",  sentence: "She will have been waited two hours when you finally show up.",       correct: ["She will have been waiting for two hours when you finally show up."],                                          wrongWord: "waited",         explanation: "Use 'waiting' (present participle) not 'waited'. Also add 'for' before the duration." },
      { mode: "rewrite", id: "3-9",  sentence: "By March, how long will he have been work there?",                    correct: ["By March, how long will he have been working there?"],                                                         wrongWord: "work",           explanation: "Use the -ing form: working, not the base verb 'work'." },
      { mode: "rewrite", id: "3-10", sentence: "Will we have been lived in this city for twenty years by 2035?",      correct: ["Will we have been living in this city for twenty years by 2035?"],                                             wrongWord: "lived",          explanation: "Use 'living' (present participle) not 'lived' (past participle)." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed mistakes",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "4-1",  sentence: "By the time he retires, he will been teaching for 40 years.",         correct: ["By the time he retires, he will have been teaching for 40 years."],                                             wrongWord: "been",           explanation: "'Have' is missing: will have been teaching. The full auxiliary is will + have + been." },
      { mode: "rewrite", id: "4-2",  sentence: "She will have been knowing the truth for a long time by then.",       correct: ["She will have known the truth for a long time by then."],                                                      wrongWord: "knowing",        explanation: "'Know' is a stative verb — use Future Perfect (will have known), not continuous." },
      { mode: "rewrite", id: "4-3",  sentence: "\"Will you have been waiting long?\" — \"Yes, I will have been.\"",   correct: ["\"Will you have been waiting long?\" — \"Yes, I will.\""],                                                    wrongWord: "have",           explanation: "Short answers only use the modal: Yes, I will. (Not 'I will have been'.)" },
      { mode: "rewrite", id: "4-4",  sentence: "By next month, they will have been discus the problem for half a year.", correct: ["By next month, they will have been discussing the problem for half a year."],                             wrongWord: "discus",         explanation: "'discus' should be 'discussing' — the -ing participle form is required." },
      { mode: "rewrite", id: "4-5",  sentence: "He won't have been worked for more than an hour when she calls.",     correct: ["He won't have been working for more than an hour when she calls."],                                           wrongWord: "worked",         explanation: "Use 'working' (present participle) not 'worked' (past participle)." },
      { mode: "rewrite", id: "4-6",  sentence: "How long will they have been wait for the results?",                  correct: ["How long will they have been waiting for the results?"],                                                       wrongWord: "wait",           explanation: "Use the -ing form: waiting, not the base verb 'wait'." },
      { mode: "rewrite", id: "4-7",  sentence: "By 2026, we will have been lieing here for two years.",               correct: ["By 2026, we will have been lying here for two years."],                                                        wrongWord: "lieing",         explanation: "lie → lying: -ie verbs change to -y before adding -ing (NOT lieing)." },
      { mode: "rewrite", id: "4-8",  sentence: "\"Will she have been sleeping long?\" — \"No, she hasn't.\"",         correct: ["\"Will she have been sleeping long?\" — \"No, she won't.\""],                                               wrongWord: "hasn't",         explanation: "Future short answers use 'won't' (not 'hasn't'): No, she won't." },
      { mode: "rewrite", id: "4-9",  sentence: "By the time you join me, I will have been swiming in the ocean for hours.", correct: ["By the time you join me, I will have been swimming in the ocean for hours."],                       wrongWord: "swiming",        explanation: "swim → swimming: CVC rule — double the final consonant (NOT swiming)." },
      { mode: "rewrite", id: "4-10", sentence: "She will have been believe in this cause for decades by the election.", correct: ["She will have believed in this cause for decades by the election."],                                       wrongWord: "believe",        explanation: "'Believe' is a stative verb — use Future Perfect (will have believed), not continuous." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Wrong form",
  2: "Stative & -ing",
  3: "Questions",
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect-continuous">Future Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Spot the Mistake</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Error Hunt</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">C1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Every sentence has <b>one grammar mistake</b>.{" "}
          <b>Sets 1–2:</b> click the wrong word and type the fix, then press <kbd className="rounded bg-black/8 px-1.5 py-0.5 text-xs font-mono">Enter</kbd>.{" "}
          <b>Sets 3–4:</b> rewrite the sentence correctly and press <kbd className="rounded bg-black/8 px-1.5 py-0.5 text-xs font-mono">Enter</kbd>.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>

          {/* Main */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
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

          {/* Right ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>
        </div>

        {/* Mobile ad */}
        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-perfect-continuous/fill-in-blank" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Fill in the Blank</a>
          <a href="/tenses/future-perfect-continuous/sentence-builder" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Sentence Builder →</a>
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
            { text: "will have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will have been working for 3 hours.  ·  She will have been studying all day." />
            <Ex en="They will have been waiting.  ·  He'll have been teaching for 20 years." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't have been", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't have been working long.  ·  She won't have been waiting." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you have been working for long?  ·  Will she have been waiting long?" />
            <Ex en="How long will you have been working there by next year?" />
          </div>
        </div>
      </div>

      {/* Same form table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will have been is the same for ALL subjects</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Affirmative</th>
                <th className="px-4 py-2.5 font-black text-red-700">Negative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I / You / He / She / It / We / They", "will have been working", "won't have been working"],
              ].map(([subj, aff, neg], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stative verbs */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Stative verbs — no continuous form!</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {["know", "believe", "understand", "like", "love", "hate", "want", "need", "seem", "own", "belong", "have (possession)"].map((v) => (
            <span key={v} className="rounded-lg bg-white border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">{v}</span>
          ))}
        </div>
        <div className="mt-2 text-xs text-amber-700">✅ By then, I will have known her for 10 years. &nbsp;|&nbsp; ❌ I will have been knowing her.</div>
      </div>

      {/* FPC vs Future Perfect */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">FPC vs Future Perfect</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Future Perfect Continuous</div>
            <div className="text-xs text-slate-500 mb-2">Emphasises duration / ongoing process</div>
            <Ex en="By 5 PM, I'll have been working for 8 hours." />
          </div>
          <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
            <div className="text-xs font-black text-sky-700 uppercase tracking-widest mb-2">Future Perfect Simple</div>
            <div className="text-xs text-slate-500 mb-2">Emphasises completion / result</div>
            <Ex en="By 5 PM, I'll have finished the report." />
          </div>
        </div>
      </div>

      {/* -ing spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ing", ex: "work → working · play → playing · read → reading" },
            { rule: "Ends in -e → drop the -e, add -ing", ex: "make → making · come → coming · write → writing" },
            { rule: "Short verb (CVC) → double the final consonant", ex: "run → running · sit → sitting · swim → swimming" },
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
          {["by next year", "for + duration", "by the time", "how long", "when + future clause", "by + future date", "by then", "for hours / days / years"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
