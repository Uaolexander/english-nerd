"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: MCQ[];
};

/* ─── Question data ─────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Negatives with didn't",
    instructions:
      "To make a negative in Past Simple: didn't + base form (NOT past form). The base verb stays unchanged: She didn't work. (NOT: She didn't worked.)",
    questions: [
      { id: "1-1",  prompt: "He ___ come to the party last night.",            options: ["didn't came", "didn't come", "not came", "don't came"],        correctIndex: 1, explanation: "didn't + base form: didn't come (not 'didn't came')." },
      { id: "1-2",  prompt: "I ___ see the film. Was it good?",                options: ["didn't see", "didn't saw", "not see", "don't see"],            correctIndex: 0, explanation: "didn't + base form: didn't see." },
      { id: "1-3",  prompt: "She ___ her homework last night.",                options: ["didn't did", "didn't do", "not did", "don't do"],              correctIndex: 1, explanation: "didn't + base form: didn't do." },
      { id: "1-4",  prompt: "We ___ anything to eat at the party.",            options: ["didn't had", "didn't have", "not have", "don't have"],         correctIndex: 1, explanation: "didn't + base form: didn't have." },
      { id: "1-5",  prompt: "They ___ to understand the problem.",             options: ["didn't seemed", "didn't seem", "not seemed", "don't seem"],    correctIndex: 1, explanation: "didn't + base form: didn't seem." },
      { id: "1-6",  prompt: "She ___ to work yesterday — she was ill.",        options: ["didn't went", "didn't go", "not went", "don't go"],            correctIndex: 1, explanation: "didn't + base form: didn't go (not 'didn't went')." },
      { id: "1-7",  prompt: "I ___ what to say.",                              options: ["didn't knew", "didn't know", "not know", "don't know"],        correctIndex: 1, explanation: "didn't + base form: didn't know." },
      { id: "1-8",  prompt: "He ___ the answer.",                              options: ["didn't found", "didn't find", "not found", "don't find"],      correctIndex: 1, explanation: "didn't + base form: didn't find." },
      { id: "1-9",  prompt: "We ___ a good time at the event.",                options: ["didn't had", "didn't have", "not have", "don't had"],          correctIndex: 1, explanation: "didn't + base form: didn't have." },
      { id: "1-10", prompt: "She ___ to tell anyone about it.",                options: ["didn't wanted", "didn't want", "not want", "don't want"],      correctIndex: 1, explanation: "didn't + base form: didn't want." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Questions with Did",
    instructions:
      "To form a question: Did + subject + base form? Did you go? Did he call? Short answers: Yes, I did. / No, she didn't.",
    questions: [
      { id: "2-1",  prompt: "___ you enjoy the concert last night?",           options: ["Were", "Had", "Did", "Do"],      correctIndex: 2, explanation: "Past Simple question: Did you enjoy?" },
      { id: "2-2",  prompt: "___ she call you back?",                          options: ["Was", "Had", "Is", "Did"],       correctIndex: 3, explanation: "Past Simple question: Did she call?" },
      { id: "2-3",  prompt: "___ they arrive on time?",                        options: ["Were", "Have", "Did", "Do"],     correctIndex: 2, explanation: "Did they arrive?" },
      { id: "2-4",  prompt: "Where ___ you go on holiday?",                   options: ["were", "had", "did", "do"],      correctIndex: 2, explanation: "Where did you go?" },
      { id: "2-5",  prompt: "What time ___ the film start?",                  options: ["was", "had", "did", "does"],     correctIndex: 2, explanation: "What time did the film start?" },
      { id: "2-6",  prompt: "\"Did you see that?\" — \"Yes, ___.\"",           options: ["I seen", "I saw", "I did", "I have"], correctIndex: 2, explanation: "Short answer: Yes, I did. (NOT 'Yes, I saw.')" },
      { id: "2-7",  prompt: "\"Did she win?\" — \"No, ___.\"",                 options: ["she didn't", "she wasn't", "she not", "she didn't won"], correctIndex: 0, explanation: "Short negative answer: No, she didn't." },
      { id: "2-8",  prompt: "Why ___ he leave so early?",                     options: ["was", "had", "did", "does"],     correctIndex: 2, explanation: "Why did he leave?" },
      { id: "2-9",  prompt: "How long ___ it take?",                          options: ["was", "had", "did", "does"],     correctIndex: 2, explanation: "How long did it take?" },
      { id: "2-10", prompt: "___ they like the food?",                        options: ["Were", "Have", "Did", "Do"],     correctIndex: 2, explanation: "Did they like the food?" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Short answers and mixed forms",
    instructions:
      "Short answers with did: Yes, I did. / No, she didn't. Use did/didn't in short answers — never repeat the main verb.",
    questions: [
      { id: "3-1",  prompt: "\"Did you call her?\" — \"Yes, ___\"",            options: ["I called.", "I call.", "I did.", "I was."],              correctIndex: 2, explanation: "Short positive answer: Yes, I did." },
      { id: "3-2",  prompt: "\"Did he eat?\" — \"No, ___\"",                   options: ["he ate not.", "he didn't.", "he not.", "he wasn't."],    correctIndex: 1, explanation: "Short negative answer: No, he didn't." },
      { id: "3-3",  prompt: "\"Did they win?\" — \"Yes, ___\"",                options: ["they won.", "they did.", "they do.", "they were."],      correctIndex: 1, explanation: "Short positive answer: Yes, they did." },
      { id: "3-4",  prompt: "She ___ come, but her sister ___.",               options: ["didn't / did", "don't / does", "wasn't / was", "didn't / was"], correctIndex: 0, explanation: "She didn't come, but her sister did." },
      { id: "3-5",  prompt: "He asked why I ___ tell him the truth.",          options: ["didn't", "don't", "wasn't", "weren't"],                  correctIndex: 0, explanation: "Past Simple negative: didn't tell." },
      { id: "3-6",  prompt: "___ anyone call while I was out?",                options: ["Was", "Were", "Did", "Have"],                            correctIndex: 2, explanation: "Past Simple question: Did anyone call?" },
      { id: "3-7",  prompt: "She told me she ___ understand the instructions.", options: ["didn't", "don't", "wasn't", "weren't"],                 correctIndex: 0, explanation: "Past Simple negative: didn't understand." },
      { id: "3-8",  prompt: "\"Did you finish?\" — \"No, I ___ — it was too hard.\"", options: ["didn't", "don't", "wasn't", "weren't"],           correctIndex: 0, explanation: "Short negative: No, I didn't." },
      { id: "3-9",  prompt: "___ you speak to him about it? — I really need to know.", options: ["Were", "Have", "Did", "Do"],                     correctIndex: 2, explanation: "Past Simple question: Did you speak?" },
      { id: "3-10", prompt: "He ___ realise his mistake until it was too late.", options: ["didn't", "don't", "wasn't", "weren't"],                correctIndex: 0, explanation: "Past Simple negative: didn't realise." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Spot the error: did + base form rule",
    instructions:
      "The most common mistake: using the PAST form after did/didn't instead of the BASE form. Spot and fix these errors. Choose the CORRECT sentence.",
    questions: [
      { id: "4-1",  prompt: "Which is correct?",  options: ["She didn't went to school.", "She didn't go to school.", "She not went to school.", "She no went to school."],       correctIndex: 1, explanation: "didn't + base form: didn't go (not 'didn't went')." },
      { id: "4-2",  prompt: "Which is correct?",  options: ["Did he knew the answer?", "Did he knowed the answer?", "Did he know the answer?", "He did know the answer?"],       correctIndex: 2, explanation: "Did + base form: Did he know? (not 'Did he knew?')." },
      { id: "4-3",  prompt: "Which is correct?",  options: ["I didn't saw it.", "I didn't see it.", "I not saw it.", "I no see it."],                                              correctIndex: 1, explanation: "didn't + base form: didn't see (not 'didn't saw')." },
      { id: "4-4",  prompt: "Which is correct?",  options: ["Did they came late?", "Did they come late?", "Did they comes late?", "They did came late?"],                         correctIndex: 1, explanation: "Did + base form: Did they come? (not 'Did they came?')." },
      { id: "4-5",  prompt: "Which is correct?",  options: ["He didn't called me back.", "He didn't calls me back.", "He didn't call me back.", "He not called me back."],        correctIndex: 2, explanation: "didn't + base form: didn't call (not 'didn't called')." },
      { id: "4-6",  prompt: "Which is correct?",  options: ["Did she found her keys?", "Did she find her keys?", "Did she finds her keys?", "She did found her keys?"],           correctIndex: 1, explanation: "Did + base form: Did she find? (not 'Did she found?')." },
      { id: "4-7",  prompt: "Which is correct?",  options: ["We didn't had lunch.", "We not have lunch.", "We didn't have lunch.", "We didn't has lunch."],                        correctIndex: 2, explanation: "didn't + base form: didn't have (not 'didn't had')." },
      { id: "4-8",  prompt: "Which is correct?",  options: ["Did it worked?", "Did it work?", "Did it works?", "It did worked?"],                                                 correctIndex: 1, explanation: "Did + base form: Did it work? (not 'Did it worked?')." },
      { id: "4-9",  prompt: "Which is correct?",  options: ["They didn't went home early.", "They didn't go home early.", "They not went home early.", "They didn't goes home early."], correctIndex: 1, explanation: "didn't + base form: didn't go (not 'didn't went')." },
      { id: "4-10", prompt: "Which is correct?",  options: ["Did you enjoyed the film?", "Did you enjoy the film?", "Did you enjoys the film?", "You did enjoyed the film?"],    correctIndex: 1, explanation: "Did + base form: Did you enjoy? (not 'Did you enjoyed?')." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "didn't + base",
  2: "Did + base",
  3: "Short answers",
  4: "Spot error",
};

/* ─── Helper components ─────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) =>
        p.dim ? (
          <span key={i} className="text-slate-400 font-bold text-sm">+</span>
        ) : (
          <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${p.color ? colors[p.color] : colors.slate}`}>
            {p.text}
          </span>
        )
      )}
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

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function DidDidntClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

  const { save } = useProgress();

  useEffect(() => {
    if (checked && score) {
      save(exNo, score.percent, score.total);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    for (const q of current.questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, answers]);

  function reset() {
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function checkAnswers() {
    setChecked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-simple">Past Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">did / didn&apos;t</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">did / didn&apos;t</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Elementary</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          The auxiliary verb <b>did</b> is essential for Past Simple negatives and questions. 40 questions across four sets.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <AdUnit variant="sidebar-dark" />

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button
                onClick={() => { setTab("exercises"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Exercises
              </button>
              <button
                onClick={() => { setTab("explanation"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Explanation
              </button>
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => switchSet(n)}
                    title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>

                    {/* Mobile set switcher */}
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button
                          key={n}
                          onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const chosen = answers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${
                                      chosen === oi
                                        ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                        : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() =>
                                        setAnswers((p) => ({ ...p, [q.id]: oi }))
                                      }
                                      className="accent-[#F5DA20]"
                                    />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && (
                                    <div className="text-emerald-700 font-semibold">✅ Correct</div>
                                  )}
                                  {isWrong && (
                                    <div className="text-red-700 font-semibold">❌ Wrong</div>
                                  )}
                                  {noAnswer && (
                                    <div className="text-amber-700 font-semibold">⚠ No answer</div>
                                  )}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    {q.options[q.correctIndex]} —{" "}
                                    {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {!checked ? (
                        <button
                          onClick={checkAnswers}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                        >
                          Check Answers
                        </button>
                      ) : (
                        <button
                          onClick={reset}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                        >
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button
                          onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                        >
                          Next Exercise →
                        </button>
                      )}
                    </div>

                    {score && (
                      <div
                        className={`rounded-2xl border p-4 ${
                          score.percent >= 80
                            ? "border-emerald-200 bg-emerald-50"
                            : score.percent >= 50
                            ? "border-amber-200 bg-amber-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div
                              className={`text-3xl font-black ${
                                score.percent >= 80
                                  ? "text-emerald-700"
                                  : score.percent >= 50
                                  ? "text-amber-700"
                                  : "text-red-700"
                              }`}
                            >
                              {score.percent}%
                            </div>
                            <div className="mt-0.5 text-sm text-slate-600">
                              {score.correct} out of {score.total} correct
                            </div>
                          </div>
                          <div className="text-3xl">
                            {score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}
                          </div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              score.percent >= 80
                                ? "bg-emerald-500"
                                : score.percent >= 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${score.percent}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80
                            ? "Excellent! Move on to the next exercise."
                            : score.percent >= 50
                            ? "Good effort! Review the wrong answers and try once more."
                            : "Keep practising — check the Explanation tab and try again."}
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
          <AdUnit variant="sidebar-dark" />
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/past-simple/irregular-past-simple"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Irregular Verbs
          </a>
          <a
            href="/tenses/past-simple/ps-vs-pc"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: PS vs Continuous →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">did / didn&apos;t — Past Simple Auxiliary</h2>
        <p className="text-slate-500 text-sm">Two patterns — negatives and questions. Learn the formula, then practise.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Negative card */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Negative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "didn't", color: "red" }, { dim: true, text: "+" },
            { text: "BASE verb", color: "yellow" }, { dim: true, text: "+" },
            { text: ".", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="She didn't go." />
            <Ex en="They didn't have time." />
            <Ex en="He didn't know." />
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[
            { text: "Did", color: "violet" }, { dim: true, text: "+" },
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "BASE verb", color: "yellow" }, { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Did she go?" />
            <Ex en="Did they have time?" />
            <Ex en="Did he know?" />
          </div>
        </div>

        {/* Short answers card */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💬</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Short Answers</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Yes, I did. / No, she didn&apos;t. — Repeat only &apos;did/didn&apos;t&apos;, never the main verb.
          </p>
          <div className="mt-3 space-y-2">
            <Ex en="Did you call? — Yes, I did." />
            <Ex en="Did he win? — No, he didn't." />
          </div>
        </div>
      </div>

      {/* Full conjugation table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">did / didn&apos;t — full table (go)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Subject</th>
                <th className="text-left font-black text-red-500 pb-2 pr-4">❌ Negative</th>
                <th className="text-left font-black text-sky-600 pb-2 pr-4">❓ Question</th>
                <th className="text-left font-black text-emerald-600 pb-2">💬 Short Answer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { subj: "I",      neg: "I didn't go",      q: "Did I go?",      ans: "Yes, I did." },
                { subj: "You",    neg: "You didn't go",    q: "Did you go?",    ans: "No, you didn't." },
                { subj: "He/She", neg: "He didn't go",     q: "Did he go?",     ans: "Yes, he did." },
                { subj: "We",     neg: "We didn't go",     q: "Did we go?",     ans: "No, we didn't." },
                { subj: "They",   neg: "They didn't go",   q: "Did they go?",   ans: "Yes, they did." },
              ].map(({ subj, neg, q, ans }) => (
                <tr key={subj}>
                  <td className="py-2 pr-4 font-black text-slate-700">{subj}</td>
                  <td className="py-2 pr-4 font-mono text-sm text-slate-600">{neg}</td>
                  <td className="py-2 pr-4 font-mono text-sm text-slate-600">{q}</td>
                  <td className="py-2 font-mono text-sm text-slate-600">{ans}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠</span>
          <h3 className="font-black text-amber-800">After didn&apos;t / Did, ALWAYS use the BASE form!</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-1">Correct ✅</div>
            <div className="font-mono text-sm text-slate-800">didn&apos;t <b>go</b></div>
            <div className="font-mono text-sm text-slate-800">Did she <b>call</b>?</div>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <div className="text-xs font-black text-red-600 uppercase tracking-wide mb-1">Wrong ❌</div>
            <div className="font-mono text-sm text-slate-500 line-through opacity-60">didn&apos;t went</div>
            <div className="font-mono text-sm text-slate-500 line-through opacity-60">Did she called?</div>
          </div>
        </div>
      </div>
    </div>
  );
}
