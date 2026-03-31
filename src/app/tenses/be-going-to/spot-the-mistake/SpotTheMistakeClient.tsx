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
    title: "Exercise 1 — Wrong am / is / are",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "1-1",  sentence: "She are going to leave tomorrow.",          wrongWord: "are",    correction: ["is"],    explanation: "She → is: She is going to leave. (I am, he/she/it is, you/we/they are)" },
      { mode: "click", id: "1-2",  sentence: "I is going to visit my parents.",           wrongWord: "is",     correction: ["am"],    explanation: "I → am: I am going to visit." },
      { mode: "click", id: "1-3",  sentence: "He are going to study medicine.",           wrongWord: "are",    correction: ["is"],    explanation: "He → is: He is going to study." },
      { mode: "click", id: "1-4",  sentence: "They is going to play football.",           wrongWord: "is",     correction: ["are"],   explanation: "They → are: They are going to play." },
      { mode: "click", id: "1-5",  sentence: "We is going to travel to Japan.",           wrongWord: "is",     correction: ["are"],   explanation: "We → are: We are going to travel." },
      { mode: "click", id: "1-6",  sentence: "The weather are going to be great.",        wrongWord: "are",    correction: ["is"],    explanation: "The weather (= it) → is: The weather is going to be great." },
      { mode: "click", id: "1-7",  sentence: "It are going to rain tonight.",             wrongWord: "are",    correction: ["is"],    explanation: "It → is: It is going to rain." },
      { mode: "click", id: "1-8",  sentence: "My parents is going to move abroad.",       wrongWord: "is",     correction: ["are"],   explanation: "My parents (= they) → are: My parents are going to move." },
      { mode: "click", id: "1-9",  sentence: "You is going to love this film!",           wrongWord: "is",     correction: ["are"],   explanation: "You → are: You are going to love." },
      { mode: "click", id: "1-10", sentence: "The children is going to perform tonight.", wrongWord: "is",     correction: ["are"],   explanation: "The children (= they) → are: The children are going to perform." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Missing 'to' or wrong verb form after going to",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "2-1",  sentence: "He is going work from home today.",         wrongWord: "work",     correction: ["to work"],      explanation: "After going, you need 'to': going to work — not just 'going work'." },
      { mode: "click", id: "2-2",  sentence: "She is going to working on the project.",   wrongWord: "working",  correction: ["work"],          explanation: "After going to, the verb must be base form: work (not working)." },
      { mode: "click", id: "2-3",  sentence: "They are going studied French.",            wrongWord: "studied",  correction: ["to study"],      explanation: "After going, you need 'to + base form': going to study (not going studied)." },
      { mode: "click", id: "2-4",  sentence: "I am going buy a new laptop.",              wrongWord: "buy",      correction: ["to buy"],        explanation: "After going, you need 'to': going to buy (not just going buy)." },
      { mode: "click", id: "2-5",  sentence: "We are going to traveled to Spain.",        wrongWord: "traveled", correction: ["travel"],        explanation: "After going to, the verb must be base form: travel (not traveled)." },
      { mode: "click", id: "2-6",  sentence: "She is going to visits her aunt.",          wrongWord: "visits",   correction: ["visit"],         explanation: "After going to, the verb must be base form: visit (not visits)." },
      { mode: "click", id: "2-7",  sentence: "He is going finish this report tonight.",   wrongWord: "finish",   correction: ["to finish"],     explanation: "After going, you need 'to': going to finish (not going finish)." },
      { mode: "click", id: "2-8",  sentence: "They are going to waited for the bus.",     wrongWord: "waited",   correction: ["wait"],          explanation: "After going to, the verb must be base form: wait (not waited)." },
      { mode: "click", id: "2-9",  sentence: "I am going to applied for the job.",        wrongWord: "applied",  correction: ["apply"],         explanation: "After going to, the verb must be base form: apply (not applied)." },
      { mode: "click", id: "2-10", sentence: "She is going calls her friend later.",      wrongWord: "calls",    correction: ["to call"],       explanation: "After going, you need 'to + base form': going to call (not going calls)." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Wrong negative or question form",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "3-1",  sentence: "She don't going to come tonight.",              correct: ["She isn't going to come tonight.", "She is not going to come tonight."],    wrongWord: "don't",    explanation: "Negatives with be going to use isn't / aren't, not don't / doesn't." },
      { mode: "rewrite", id: "3-2",  sentence: "They doesn't going to wait any longer.",        correct: ["They aren't going to wait any longer.", "They are not going to wait any longer."], wrongWord: "doesn't", explanation: "They → aren't / are not (not doesn't). Negatives use the correct form of be." },
      { mode: "rewrite", id: "3-3",  sentence: "Is she going to leaves?",                       correct: ["Is she going to leave?"],                                                   wrongWord: "leaves",   explanation: "After going to, the verb must be base form: leave (not leaves)." },
      { mode: "rewrite", id: "3-4",  sentence: "Does he going to call back?",                   correct: ["Is he going to call back?"],                                                wrongWord: "Does",     explanation: "Questions with be going to use Is/Am/Are — not does. Is he going to call back?" },
      { mode: "rewrite", id: "3-5",  sentence: "Are they going to coming to the party?",        correct: ["Are they going to come to the party?"],                                     wrongWord: "coming",   explanation: "After going to, the verb must be base form: come (not coming)." },
      { mode: "rewrite", id: "3-6",  sentence: "She going to visit her parents.",               correct: ["She is going to visit her parents.", "She's going to visit her parents."],  wrongWord: "going",    explanation: "Be going to needs the auxiliary: She is going to visit (not just going to)." },
      { mode: "rewrite", id: "3-7",  sentence: "We don't are going to stay.",                   correct: ["We aren't going to stay.", "We are not going to stay."],                    wrongWord: "don't",    explanation: "Negatives with be going to: We aren't going to stay. Never use don't + are." },
      { mode: "rewrite", id: "3-8",  sentence: "Do you going to apply for the job?",            correct: ["Are you going to apply for the job?"],                                      wrongWord: "Do",       explanation: "Questions with be going to use Are/Is/Am — not do/does. Are you going to apply?" },
      { mode: "rewrite", id: "3-9",  sentence: "He aren't going to finish on time.",            correct: ["He isn't going to finish on time.", "He is not going to finish on time."],  wrongWord: "aren't",   explanation: "He → isn't / is not (not aren't). isn't is for he/she/it." },
      { mode: "rewrite", id: "3-10", sentence: "They is not going to join us.",                 correct: ["They aren't going to join us.", "They are not going to join us."],           wrongWord: "is",       explanation: "They → aren't / are not (not is not). is is only for he/she/it." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed errors",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "4-1",  sentence: "I am go to start a new job next month.",        correct: ["I am going to start a new job next month.", "I'm going to start a new job next month."], wrongWord: "go",      explanation: "The structure is am/is/are + going to + base form: I am going to start." },
      { mode: "rewrite", id: "4-2",  sentence: "She is going to buys a new car.",               correct: ["She is going to buy a new car.", "She's going to buy a new car."],           wrongWord: "buys",     explanation: "After going to, the verb must be base form: buy (not buys)." },
      { mode: "rewrite", id: "4-3",  sentence: "Is she going to pass? Yes, she going.",         correct: ["Is she going to pass? Yes, she is."],                                       wrongWord: "going",    explanation: "Short answers use only the auxiliary: Yes, she is. (NOT she going)" },
      { mode: "rewrite", id: "4-4",  sentence: "He don't is going to retire.",                  correct: ["He isn't going to retire.", "He is not going to retire."],                   wrongWord: "don't",    explanation: "Negatives with be going to use isn't / is not — never don't + is." },
      { mode: "rewrite", id: "4-5",  sentence: "They not going to travel this year.",           correct: ["They aren't going to travel this year.", "They are not going to travel this year."], wrongWord: "not",  explanation: "Negatives need the full auxiliary: aren't going to or are not going to." },
      { mode: "rewrite", id: "4-6",  sentence: "Are they going to moved to London?",            correct: ["Are they going to move to London?"],                                         wrongWord: "moved",    explanation: "After going to, the verb must be base form: move (not moved)." },
      { mode: "rewrite", id: "4-7",  sentence: "Are you going to stay? No, I don't.",           correct: ["Are you going to stay? No, I'm not."],                                      wrongWord: "don't",    explanation: "Short negative: No, I'm not. (NOT I don't)" },
      { mode: "rewrite", id: "4-8",  sentence: "We isn't going to come to the meeting.",        correct: ["We aren't going to come to the meeting.", "We are not going to come to the meeting."], wrongWord: "isn't", explanation: "We → aren't / are not (not isn't). isn't is only for he/she/it." },
      { mode: "rewrite", id: "4-9",  sentence: "She is go to be a great doctor.",               correct: ["She is going to be a great doctor.", "She's going to be a great doctor."],   wrongWord: "go",      explanation: "The structure is is + going to + base form: She is going to be." },
      { mode: "rewrite", id: "4-10", sentence: "What they are going to do about it?",           correct: ["What are they going to do about it?"],                                       wrongWord: "they",     explanation: "Wh- questions: What + auxiliary + subject + going to + base form? → What are they going to do?" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "am/is/are",
  2: "going to",
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
          <a className="hover:text-slate-900 transition" href="/tenses/be-going-to">Be Going To</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Spot the Mistake</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Be Going To{" "}
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
          <a href="/tenses/be-going-to/fill-in-blank" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Fill in the Blank</a>
          <a href="/tenses/be-going-to/sentence-builder" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Sentence Builder →</a>
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
            <button onClick={onCheck} className="mt-2 rounded-lg bg-[#F5DA20] px-4 py-1.5 text-xs font-black text-black hover:opacity-90 transition">Check</button>
          )}
          {isChecked && (
            <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
              {isCorrect && <><span className="font-black">✅ Correct!</span> {q.explanation}</>}
              {isWrong && (
                <>
                  <span className="font-black">❌ Not quite.</span> Correct: <b className="font-mono">{q.correct[0]}</b><br />
                  <span className="text-xs mt-1 block">{q.explanation}</span>
                </>
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
            { text: "am / is / are", color: "yellow" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I am going to work.  ·  She is going to leave.  ·  They are going to play." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "am not / isn't / aren't", color: "red" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I'm not going to stay.  ·  She isn't going to come.  ·  They aren't going to wait." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Am / Is / Are", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Am I going to pass?  ·  Is she going to leave?  ·  Are they going to join us?" />
          </div>
        </div>
      </div>

      {/* am / is / are table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Which auxiliary to use</div>
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
                ["I", "am going to work", "'m not going to work", "Am I going to work?"],
                ["He / She / It", "is going to work ★", "isn't going to work", "Is she going to work?"],
                ["You", "are going to work", "aren't going to work", "Are you going to work?"],
                ["We / They", "are going to work", "aren't going to work", "Are they going to work?"],
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
          <span className="font-black">★ Key rule:</span> <b>&quot;going to&quot;</b> never changes — only <b>am / is / are</b> changes!<br />
          <span className="text-xs">She <b>is</b> going to leave ✅ &nbsp; She <b>are</b> going to leave ❌ &nbsp; She is going to <b>leaves</b> ❌</span>
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use be going to</div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="text-sm font-black text-emerald-800 mb-2">1. Plans and intentions (already decided)</div>
            <Ex en="I'm going to visit my parents this weekend." />
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
            <div className="text-sm font-black text-sky-800 mb-2">2. Predictions based on visible evidence</div>
            <Ex en="Look at those clouds — it's going to rain!" />
          </div>
        </div>
      </div>

      {/* be going to vs will */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Be going to vs Will</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-violet-700">be going to</th>
                <th className="px-4 py-2.5 font-black text-sky-700">will</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Pre-planned decisions", "Spontaneous decisions"],
                ["Predictions with visible evidence", "General predictions (opinion)"],
                ["I'm going to buy a car. (planned)", "I'll help you carry that. (spontaneous)"],
              ].map(([a, b], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-violet-700 text-sm">{a}</td>
                  <td className="px-4 py-2.5 text-sky-700 text-sm">{b}</td>
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
          {["tomorrow", "next week", "next month", "next year", "soon", "tonight", "this weekend", "in the future", "this summer"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
