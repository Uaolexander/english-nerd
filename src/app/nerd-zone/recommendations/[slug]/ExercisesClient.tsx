"use client";

import { useState, useMemo, useEffect } from "react";

type Word = { word: string; pos: string; meaning: string; example: string };

type Level = "A2" | "B1" | "B2" | "C1";

const LEVEL_ACCENT: Record<Level, { primary: string; light: string; text: string; border: string }> = {
  A2: { primary: "bg-emerald-500", light: "bg-emerald-50",    text: "text-emerald-800", border: "border-emerald-200" },
  B1: { primary: "bg-violet-500",  light: "bg-violet-50",     text: "text-violet-800",  border: "border-violet-200" },
  B2: { primary: "bg-orange-500",  light: "bg-orange-50",     text: "text-orange-800",  border: "border-orange-200" },
  C1: { primary: "bg-sky-500",     light: "bg-sky-50",        text: "text-sky-800",     border: "border-sky-200" },
};

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function blankWord(example: string, word: string): string {
  const re = new RegExp(`\\b${word.replace(/[-\s]/g, "[-\\s]?")}\\b`, "gi");
  const result = example.replace(re, "_____");
  return result === example ? example.replace(word, "_____") : result;
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[^a-zа-яёіїє\s]/gi, "").trim();
}

// ── Exercise 1: Fill in the Blank (B1+) / Choose the Word (A1) ───────────────

type FillQ = { word: string; sentence: string; options: string[] | null };

function FillInBlank({ words, level }: { words: Word[]; level: Level }) {
  const a = LEVEL_ACCENT[level];

  const [questions, setQuestions] = useState<FillQ[]>([]);
  useEffect(() => {
    setQuestions(shuffled(words).slice(0, 6).map((w) => {
      return { word: w.word, sentence: blankWord(w.example, w.word), options: null };
    }));
  }, [words]);

  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const results = useMemo(() => {
    if (!checked || questions.length === 0) return {};
    return Object.fromEntries(questions.map((q, i) => {
      return [i, normalize(inputs[i] ?? "") === normalize(q.word)];
    }));
  }, [checked, questions, inputs]);

  const score = Object.values(results).filter(Boolean).length;
  function reset() { setInputs({}); setChecked(false); }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className={`px-6 py-4 border-b border-slate-100 flex items-center gap-3 ${a.light}`}>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${a.primary} text-white text-sm font-black`}>
          1
        </div>
        <div>
          <div className="text-base font-black text-slate-900">Fill in the Blank</div>
          <div className="text-xs text-slate-500">Type the missing word from the vocabulary list</div>
        </div>
        {checked && (
          <span className={`ml-auto text-lg font-black ${score === questions.length ? "text-emerald-600" : score >= questions.length / 2 ? "text-amber-600" : "text-red-500"}`}>
            {score}/{questions.length}
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-50">
        {questions.map((q, i) => {
          const val = inputs[i] ?? "";
          const isCorrect = results[i] === true;
          const isWrong = results[i] === false;

          return (
            <div key={i} className={`px-6 py-4 transition-colors ${isCorrect ? "bg-emerald-50/50" : isWrong ? "bg-red-50/40" : ""}`}>
              <div className="flex items-start gap-3">
                <span className="shrink-0 mt-1 w-5 text-[11px] font-black text-slate-300">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {q.sentence.split("_____").map((part, pi) => (
                      <span key={pi}>
                        {part}
                        {pi === 0 && (
                          <input
                            value={val}
                            disabled={checked}
                            onChange={(e) => setInputs((p) => ({ ...p, [i]: e.target.value }))}
                            placeholder="..."
                            className={`mx-1 inline-block w-28 rounded-lg border px-2.5 py-1 text-sm font-bold outline-none transition ${
                              isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
                              isWrong   ? "border-red-300 bg-red-50 text-red-600" :
                              "border-slate-200 bg-slate-50 text-slate-900 focus:border-[#F5DA20]"
                            }`}
                          />
                        )}
                      </span>
                    ))}
                  </p>
                  {checked && isWrong && (
                    <p className="mt-1 text-xs font-semibold text-slate-500">✓ {q.word}</p>
                  )}
                </div>
                {checked && (
                  <span className="shrink-0 mt-1 text-sm font-black">
                    {isCorrect ? <span className="text-emerald-600">✓</span> : <span className="text-red-500">✗</span>}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-3">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            className={`rounded-xl ${a.primary} px-5 py-2 text-sm font-black text-white transition hover:opacity-90`}
          >
            Check Answers
          </button>
        ) : (
          <button onClick={reset} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
            Try Again
          </button>
        )}
        {checked && (
          <div className={`text-sm font-bold ${score === questions.length ? "text-emerald-600" : "text-slate-500"}`}>
            {score === questions.length ? "🎉 Perfect!" : score >= Math.ceil(questions.length / 2) ? "💪 Good effort!" : "📖 Keep studying!"}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Exercise 2: Word Match ─────────────────────────────────────────────────────

function WordMatch({ words, level }: { words: Word[]; level: Level }) {
  const a = LEVEL_ACCENT[level];

  const [pairs, setPairs] = useState<Word[]>([]);
  const [rightDefs, setRightDefs] = useState<string[]>([]);
  useEffect(() => {
    const p = shuffled(words).slice(0, 6);
    setPairs(p);
    setRightDefs(shuffled(p.map((w) => w.meaning)));
  }, [words]);

  const leftWords = pairs.map((p) => p.word);

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({}); // word → meaning
  const [wrong, setWrong] = useState<string | null>(null);

  const matchedCount = Object.keys(matched).length;
  const isDone = matchedCount === pairs.length;

  function handleWordClick(word: string) {
    if (matched[word]) return;
    setSelectedWord((prev) => prev === word ? null : word);
    setWrong(null);
  }

  function handleDefClick(def: string) {
    if (!selectedWord) return;
    const defAlreadyMatched = Object.values(matched).includes(def);
    if (defAlreadyMatched) return;
    const correct = pairs.find((p) => p.word === selectedWord)?.meaning === def;
    if (correct) {
      setMatched((m) => ({ ...m, [selectedWord]: def }));
      setSelectedWord(null);
    } else {
      setWrong(selectedWord);
      setTimeout(() => { setWrong(null); setSelectedWord(null); }, 700);
    }
  }

  function reset() { setMatched({}); setSelectedWord(null); setWrong(null); }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className={`px-6 py-4 border-b border-slate-100 flex items-center gap-3 ${a.light}`}>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${a.primary} text-white text-sm font-black`}>
          2
        </div>
        <div>
          <div className="text-base font-black text-slate-900">Word Match</div>
          <div className="text-xs text-slate-500">Click a word, then click its definition</div>
        </div>
        {isDone && <span className="ml-auto text-sm font-black text-emerald-600">🎉 All matched!</span>}
        {!isDone && matchedCount > 0 && (
          <span className="ml-auto text-sm font-bold text-slate-400">{matchedCount}/{pairs.length}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 p-5">
        {/* Left — words */}
        <div className="flex flex-col gap-2">
          {leftWords.map((word) => {
            const isMatched = !!matched[word];
            const isSelected = selectedWord === word;
            const isWrongWord = wrong === word;
            return (
              <button
                key={word}
                onClick={() => handleWordClick(word)}
                disabled={isMatched}
                className={`rounded-xl border px-4 py-2.5 text-left text-sm font-black transition ${
                  isMatched ? "border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default" :
                  isSelected ? `${a.primary} border-transparent text-black shadow-md` :
                  isWrongWord ? "border-red-300 bg-red-50 text-red-600 animate-[shake_0.4s_ease-in-out]" :
                  "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white"
                }`}
              >
                {isMatched && <span className="mr-1.5 text-emerald-500">✓</span>}
                {word}
              </button>
            );
          })}
        </div>

        {/* Right — definitions */}
        <div className="flex flex-col gap-2">
          {rightDefs.map((def) => {
            const matchedWord = Object.keys(matched).find((w) => matched[w] === def);
            const isMatched = !!matchedWord;
            const canClick = !!selectedWord && !isMatched;
            return (
              <button
                key={def}
                onClick={() => handleDefClick(def)}
                disabled={!canClick && !isMatched}
                className={`rounded-xl border px-3 py-2.5 text-left text-xs leading-snug transition ${
                  isMatched ? "border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default" :
                  canClick ? "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 cursor-pointer" :
                  "border-slate-100 bg-slate-50/60 text-slate-400"
                }`}
              >
                {def}
              </button>
            );
          })}
        </div>
      </div>

      {isDone && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-emerald-600 font-bold">Excellent work! All {pairs.length} pairs matched.</span>
          <button onClick={reset} className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            Play again
          </button>
        </div>
      )}
    </div>
  );
}

// ── Exercise 3: Multiple Choice ───────────────────────────────────────────────

function MultipleChoice({ words, level }: { words: Word[]; level: Level }) {
  const a = LEVEL_ACCENT[level];

  type MCQ = { word: string; correct: string; options: string[]; example: string; fullExample: string };
  const [questions, setQuestions] = useState<MCQ[]>([]);
  useEffect(() => {
    const pool = shuffled(words).slice(0, 5);
    setQuestions(pool.map((q) => {
      const wrong = shuffled(words.filter((w) => w.word !== q.word)).slice(0, 3);
      const options = shuffled([q.meaning, ...wrong.map((w) => w.meaning)]);
      return {
        word: q.word,
        correct: q.meaning,
        options,
        example: blankWord(q.example, q.word),
        fullExample: q.example,
      };
    }));
  }, [words]);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const score = checked ? questions.filter((q, i) => answers[i] === q.correct).length : 0;
  function reset() { setAnswers({}); setChecked(false); }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className={`px-6 py-4 border-b border-slate-100 flex items-center gap-3 ${a.light}`}>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${a.primary} text-white text-sm font-black`}>
          3
        </div>
        <div>
          <div className="text-base font-black text-slate-900">Quick-Fire Quiz</div>
          <div className="text-xs text-slate-500">See a sentence — choose the right meaning</div>
        </div>
        {checked && (
          <span className={`ml-auto text-lg font-black ${score === questions.length ? "text-emerald-600" : score >= 3 ? "text-amber-600" : "text-red-500"}`}>
            {score}/{questions.length}
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-50">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const isCorrect = checked && chosen === q.correct;
          const isWrong = checked && !!chosen && chosen !== q.correct;
          return (
            <div key={qi} className={`p-5 transition-colors ${isCorrect ? "bg-emerald-50/30" : isWrong ? "bg-red-50/20" : ""}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-black text-slate-500">{qi + 1}</span>
                <p className="text-sm text-slate-700 italic leading-relaxed">&ldquo;{q.example}&rdquo;</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pl-9">
                {q.options.map((opt) => {
                  const isThis = chosen === opt;
                  const showCorrect = checked && opt === q.correct;
                  return (
                    <button
                      key={opt}
                      disabled={checked}
                      onClick={() => setAnswers((p) => ({ ...p, [qi]: opt }))}
                      className={`rounded-xl border px-3 py-2 text-left text-xs leading-snug font-medium transition ${
                        showCorrect          ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-black" :
                        isThis && isWrong   ? "border-red-300 bg-red-50 text-red-700 line-through" :
                        isThis              ? `${a.primary} border-transparent text-black font-black` :
                        checked             ? "border-slate-100 bg-slate-50 text-slate-300 cursor-default" :
                        "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white cursor-pointer"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-3">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={Object.keys(answers).length < questions.length}
            className={`rounded-xl ${a.primary} px-5 py-2 text-sm font-black text-black transition hover:opacity-90 disabled:opacity-40`}
          >
            Check Answers
          </button>
        ) : (
          <button onClick={reset} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
            Try Again
          </button>
        )}
        {!checked && Object.keys(answers).length < questions.length && (
          <span className="text-xs text-slate-400">Answer all {questions.length} questions to check</span>
        )}
        {checked && (
          <div className={`text-sm font-bold ${score === questions.length ? "text-emerald-600" : "text-slate-500"}`}>
            {score === questions.length ? "🔥 Flawless!" : score >= 3 ? "👍 Well done!" : "📚 Review the list!"}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Pro Gate ──────────────────────────────────────────────────────────────────

function LoginGateExercises() {
  return (
    <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden">
      <div className="pointer-events-none select-none blur-sm opacity-40 p-6 space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="h-4 w-40 rounded bg-slate-200 mb-3" />
            <div className="space-y-2">
              {[1, 2, 3].map((r) => (
                <div key={r} className="h-3 rounded bg-slate-100" style={{ width: `${60 + r * 12}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/75 backdrop-blur-[2px]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 shadow-lg">
          <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div className="text-center px-6">
          <div className="text-xl font-black text-slate-900">Log in to practise</div>
          <div className="mt-1.5 text-sm text-slate-500 max-w-xs">
            Create a free account to unlock all 3 interactive exercises for this content.
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Log in
          </a>
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-slate-700"
          >
            Sign up free →
          </a>
        </div>
      </div>
    </div>
  );
}

function ProGateExercises({ title }: { title: string }) {
  return (
    <div className="relative rounded-2xl border-2 border-dashed border-[#F5DA20]/50 bg-gradient-to-br from-amber-50 to-yellow-50 overflow-hidden">
      {/* Blurred preview of exercises */}
      <div className="pointer-events-none select-none blur-sm opacity-40 p-6 space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="h-4 w-40 rounded bg-slate-200 mb-3" />
            <div className="space-y-2">
              {[1, 2, 3].map((r) => (
                <div key={r} className="h-3 rounded bg-slate-100" style={{ width: `${60 + r * 12}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-[2px]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5DA20] shadow-lg">
          <svg className="h-8 w-8 text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="text-center px-6">
          <div className="text-xl font-black text-slate-900">Unlock exercises for {title}</div>
          <div className="mt-1.5 text-sm text-slate-500 max-w-xs">
            3 interactive exercises — Fill in the Blank, Word Match and Quick-Fire Quiz — available with Pro.
          </div>
        </div>
        <ul className="flex flex-col gap-1.5 text-sm text-slate-600">
          {["Fill in the Blank", "Word Match game", "Quick-Fire MCQ quiz"].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F5DA20] text-[10px] font-black text-black">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <a
          href="/pro"
          className="mt-1 inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black shadow-md transition hover:bg-[#e8cf00] hover:shadow-[0_4px_20px_rgba(245,218,32,0.5)]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Get Pro — Unlock all exercises
        </a>
      </div>
    </div>
  );
}

// ── Score tracker ─────────────────────────────────────────────────────────────

function ScoreRing({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const [p, setP] = useState(0);
  useEffect(() => { const t = setTimeout(() => setP(pct), 200); return () => clearTimeout(t); }, [pct]);
  const r = 26, circ = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16">
        <svg width="64" height="64" className="-rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5"/>
          <circle cx="32" cy="32" r={r} fill="none" stroke="#F5DA20" strokeWidth="5"
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ * (1 - p / 100)}
            className="transition-all duration-1000 ease-out"/>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-900">{pct}%</span>
      </div>
      <div>
        <div className="text-sm font-black text-slate-900">Overall Progress</div>
        <div className="text-xs text-slate-400">{done} of {total} exercises done</div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ExercisesClient({
  words,
  level,
  title,
  isPro,
  isProSlug,
  isLoginSlug,
  isLoggedIn,
}: {
  words: Word[];
  level: Level;
  title: string;
  isPro: boolean;
  isProSlug: boolean;
  isLoginSlug: boolean;
  isLoggedIn: boolean;
}) {
  const showExercises =
    (!isProSlug || isPro) && (!isLoginSlug || isLoggedIn);

  const gateType = !isLoggedIn && isLoginSlug ? "login" : "pro";

  return (
    <div className="mt-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Practice Exercises</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            {showExercises
              ? "3 exercises auto-generated from the vocabulary above"
              : gateType === "login"
              ? "Log in to practice these words"
              : "Unlock with Pro to practice these words"}
          </p>
        </div>
        {isProSlug && (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#F5DA20] px-3.5 py-1.5 text-xs font-black text-black shadow-sm">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            PRO
          </span>
        )}
        {isLoginSlug && (
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-black text-slate-600 shadow-sm">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Free with account
          </span>
        )}
      </div>

      {showExercises ? (
        <div className="space-y-5">
          <FillInBlank words={words} level={level} />
          <WordMatch words={words} level={level} />
          <MultipleChoice words={words} level={level} />
        </div>
      ) : gateType === "login" ? (
        <LoginGateExercises />
      ) : (
        <ProGateExercises title={title} />
      )}
    </div>
  );
}
