
"use client";

import { useMemo, useState, useRef } from "react";

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type InputQ = {
  id: string;
  prompt: string; // with ____ gap
  correct: string; // normalized expected answer
  explanation: string;
};

type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function ArticlesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      // EX 1: easiest, MCQ
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose the correct option",
        instructions: "Choose am / is / are.",
        questions: [
          {
            id: "e1q1",
            prompt: "I _____ a student.",
            options: ["am", "is", "are"],
            correctIndex: 0,
            explanation: "Use am with I.",
          },
          {
            id: "e1q2",
            prompt: "She _____ from Poland.",
            options: ["am", "is", "are"],
            correctIndex: 1,
            explanation: "Use is with he/she/it.",
          },
          {
            id: "e1q3",
            prompt: "They _____ at home.",
            options: ["am", "is", "are"],
            correctIndex: 2,
            explanation: "Use are with we/you/they.",
          },
          {
            id: "e1q4",
            prompt: "My name _____ Alex.",
            options: ["am", "is", "are"],
            correctIndex: 1,
            explanation: "Name = it → is.",
          },
          {
            id: "e1q5",
            prompt: "You _____ my friend.",
            options: ["am", "is", "are"],
            correctIndex: 2,
            explanation: "Use are with you.",
          },
          {
            id: "e1q6",
            prompt: "We _____ happy today.",
            options: ["am", "is", "are"],
            correctIndex: 2,
            explanation: "Use are with we.",
          },
          {
            id: "e1q7",
            prompt: "It _____ cold outside.",
            options: ["am", "is", "are"],
            correctIndex: 1,
            explanation: "Use is with it.",
          },
          {
            id: "e1q8",
            prompt: "I _____ 10 years old.",
            options: ["am", "is", "are"],
            correctIndex: 0,
            explanation: "Use am with I.",
          },
          {
            id: "e1q9",
            prompt: "You _____ late.",
            options: ["am", "is", "are"],
            correctIndex: 2,
            explanation: "Use are with you.",
          },
          {
            id: "e1q10",
            prompt: "He _____ a teacher.",
            options: ["am", "is", "are"],
            correctIndex: 1,
            explanation: "Use is with he.",
          },
        ],
      },

      // EX 2: fill am/is/are
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type the missing word",
        instructions: "Write am / is / are. (No punctuation needed.)",
        questions: [
          {
            id: "e2q1",
            prompt: "I _____ from the USA.",
            correct: "am",
            explanation: "I → am.",
          },
          {
            id: "e2q2",
            prompt: "She _____ my sister.",
            correct: "is",
            explanation: "She → is.",
          },
          {
            id: "e2q3",
            prompt: "They _____ students.",
            correct: "are",
            explanation: "They → are.",
          },
          {
            id: "e2q4",
            prompt: "We _____ in a café.",
            correct: "are",
            explanation: "We → are.",
          },
          {
            id: "e2q5",
            prompt: "It _____ my phone.",
            correct: "is",
            explanation: "It → is.",
          },
          {
            id: "e2q6",
            prompt: "You _____ very kind.",
            correct: "are",
            explanation: "You → are.",
          },
          {
            id: "e2q7",
            prompt: "My parents _____ at work.",
            correct: "are",
            explanation: "Plural (parents) → are.",
          },
          {
            id: "e2q8",
            prompt: "The weather _____ nice.",
            correct: "is",
            explanation: "Weather = it → is.",
          },
          {
            id: "e2q9",
            prompt: "I _____ tired.",
            correct: "am",
            explanation: "I → am.",
          },
          {
            id: "e2q10",
            prompt: "You _____ ready.",
            correct: "are",
            explanation: "You → are.",
          },
        ],
      },

      // EX 3: negatives
      3: {
        type: "input",
        title: "Exercise 3 (Hard) — Negatives",
        instructions: "Write am not / isn't / aren't.",
        questions: [
          {
            id: "e3q1",
            prompt: "I _____ a doctor.",
            correct: "am not",
            explanation: "Negative with I → am not.",
          },
          {
            id: "e3q2",
            prompt: "He _____ at home.",
            correct: "isn't",
            explanation: "Negative with he → isn't.",
          },
          {
            id: "e3q3",
            prompt: "They _____ late.",
            correct: "aren't",
            explanation: "Negative with they → aren't.",
          },
          {
            id: "e3q4",
            prompt: "She _____ happy today.",
            correct: "isn't",
            explanation: "Negative with she → isn't.",
          },
          {
            id: "e3q5",
            prompt: "We _____ in the office.",
            correct: "aren't",
            explanation: "Negative with we → aren't.",
          },
          {
            id: "e3q6",
            prompt: "It _____ my bag.",
            correct: "isn't",
            explanation: "Negative with it → isn't.",
          },
          {
            id: "e3q7",
            prompt: "You _____ wrong.",
            correct: "aren't",
            explanation: "Negative with you → aren't.",
          },
          {
            id: "e3q8",
            prompt: "I _____ hungry.",
            correct: "am not",
            explanation: "Negative with I → am not.",
          },
          {
            id: "e3q9",
            prompt: "My name _____ John.",
            correct: "isn't",
            explanation: "Name = it → isn't.",
          },
          {
            id: "e3q10",
            prompt: "They _____ here.",
            correct: "aren't",
            explanation: "Negative with they → aren't.",
          },
        ],
      },

      // EX 4: questions
      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Questions",
        instructions: "Write Am I / Is he-she-it / Are you-we-they. (No question mark needed.)",
        questions: [
          {
            id: "e4q1",
            prompt: "_____ late? (I)",
            correct: "am i",
            explanation: "Question with I → Am I…?",
          },
          {
            id: "e4q2",
            prompt: "_____ your teacher? (she)",
            correct: "is she",
            explanation: "Question with she → Is she…?",
          },
          {
            id: "e4q3",
            prompt: "_____ at school? (they)",
            correct: "are they",
            explanation: "Question with they → Are they…?",
          },
          {
            id: "e4q4",
            prompt: "_____ okay? (you)",
            correct: "are you",
            explanation: "Question with you → Are you…?",
          },
          {
            id: "e4q5",
            prompt: "_____ from Spain? (he)",
            correct: "is he",
            explanation: "Question with he → Is he…?",
          },
          {
            id: "e4q6",
            prompt: "_____ friends? (we)",
            correct: "are we",
            explanation: "Question with we → Are we…?",
          },
          {
            id: "e4q7",
            prompt: "_____ your phone? (it)",
            correct: "is it",
            explanation: "Question with it → Is it…?",
          },
          {
            id: "e4q8",
            prompt: "_____ ready? (they)",
            correct: "are they",
            explanation: "Question with they → Are they…?",
          },
          {
            id: "e4q9",
            prompt: "_____ tired? (I)",
            correct: "am i",
            explanation: "Question with I → Am I…?",
          },
          {
            id: "e4q10",
            prompt: "_____ in the right place? (we)",
            correct: "are we",
            explanation: "Question with we → Are we…?",
          },
        ],
      },
    };
  }, []);

  // Store answers
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);

  const current = sets[exNo];

  const score = useMemo(() => {
    if (!checked) return null;

    let correct = 0;
    let total = 0;

    if (current.type === "mcq") {
      total = current.questions.length;
      for (const q of current.questions) {
        const a = mcqAnswers[q.id];
        if (a === q.correctIndex) correct++;
      }
    } else {
      total = current.questions.length;
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }

    const percent = total ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percent };
  }, [checked, current, mcqAnswers, inputAnswers]);

  function resetExercise() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  async function downloadPDF() {
    if (!page1Ref.current || !page2Ref.current || !page3Ref.current) return;
    setPdfLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210, H = 297;
      const refs = [page1Ref, page2Ref, page3Ref];
      for (let i = 0; i < refs.length; i++) {
        const canvas = await html2canvas(refs[i].current!, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const img = canvas.toDataURL("image/png");
        if (i > 0) pdf.addPage();
        pdf.addImage(img, "PNG", 0, 0, W, H);
      }
      pdf.save("EnglishNerd_Verb-to-be_A1.pdf");
    } catch (e) { console.error(e); }
    finally { setPdfLoading(false); }
  }

  function switchExercise(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a1">Grammar A1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Verb "to be" (am / is / are)</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Verb "to be" <span className="font-extrabold">— am / is / are</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>am / is / are</b> to talk about who you are, what something is, and how people feel. Practice with 4 graded exercises.
      </p>

      {/* Layout: left ad + center content + right ad */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left Ad */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
            <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
              300 × 600
            </div>
          </div>
        </aside>

        {/* Center */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button
              onClick={() => setTab("exercises")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Exercises
            </button>
            <button
              onClick={() => setTab("explanation")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Explanation
            </button>

            <button
              onClick={downloadPDF}
              disabled={pdfLoading}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition text-slate-700 hover:bg-black/5 disabled:opacity-50"
            >
              {pdfLoading ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  PDF
                </>
              )}
            </button>

            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
              Exercises:
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => switchExercise(n as 1 | 2 | 3 | 4)}
                  className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                    exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>

                  {/* Mobile exercise buttons */}
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => switchExercise(n as 1 | 2 | 3 | 4)}
                        className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                          exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Questions */}
                <div className="mt-8 space-y-5">
                  {current.type === "mcq" ? (
                    current.questions.map((q, idx) => {
                      const chosen = mcqAnswers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>

                              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${
                                      chosen === oi
                                        ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                        : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default opacity-95" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))}
                                    />
                                    <span className="text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>

                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}

                                  <div className="mt-2 text-slate-700">
                                    <b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    current.questions.map((q, idx) => {
                      const val = inputAnswers[q.id] ?? "";
                      const answered = normalize(val) !== "";
                      const isCorrect = checked && answered && normalize(val) === normalize(q.correct);
                      const noAnswer = checked && !answered;
                      const wrong = checked && answered && !isCorrect;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>

                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>

                              <div className="mt-3 flex items-center gap-3">
                                <input
                                  value={val}
                                  disabled={checked}
                                  onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                                  placeholder="Type here…"
                                  className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]"
                                />
                              </div>

                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}

                                  <div className="mt-2 text-slate-700">
                                    <b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Controls */}
                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button
                        onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                      >
                        Check Answers
                      </button>
                    ) : (
                      <button
                        onClick={resetExercise}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                      >
                        Try Again
                      </button>
                    )}
                    {checked && exNo < 4 && (
                      <button
                        onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                      >
                        Next Exercise →
                      </button>
                    )}
                  </div>

                  {score && (
                    <div className={`rounded-2xl border p-4 ${
                      score.percent >= 80
                        ? "border-emerald-200 bg-emerald-50"
                        : score.percent >= 50
                        ? "border-amber-200 bg-amber-50"
                        : "border-red-200 bg-red-50"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-3xl font-black ${
                            score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"
                          }`}>
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
                            score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${score.percent}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {score.percent >= 80
                          ? "Excellent! You can move to the next exercise."
                          : score.percent >= 50
                          ? "Good effort! Try once more to improve your score."
                          : "Keep practising — review the Explanation tab and try again."}
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

        {/* Right Ad */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
            <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
              300 × 600
            </div>
          </div>
        </aside>
      </div>

      {/* ─── Hidden PDF pages ─── */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px", pointerEvents: "none" }}>

        {/* ── PAGE 1 ── */}
        <div ref={page1Ref} style={{ width: "794px", height: "1123px", background: "#ffffff", overflow: "hidden", fontFamily: "'Helvetica Neue', Arial, sans-serif", color: "#111", boxSizing: "border-box" }}>
          {/* Top accent stripe */}
          <div style={{ height: "5px", background: "#F5DA20" }} />
          {/* Header */}
          <div style={{ padding: "16px 44px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ebebeb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: 900, fontSize: "15px", color: "#111", letterSpacing: "-0.01em" }}>English Nerd</span>
              <span style={{ width: "1px", height: "14px", background: "#ddd", display: "inline-block" }} />
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#999", letterSpacing: "0.02em" }}>Grammar Worksheet</span>
            </div>
            <span style={{ background: "#111", color: "#F5DA20", fontWeight: 800, fontSize: "9px", padding: "4px 12px", borderRadius: "100px", letterSpacing: "0.12em", display: "inline-flex", alignItems: "center", lineHeight: "1" }}>A1 LEVEL</span>
          </div>

          {/* Title block */}
          <div style={{ padding: "28px 44px 0", display: "flex", alignItems: "flex-start", gap: "18px" }}>
            <div style={{ width: "4px", height: "52px", background: "#F5DA20", borderRadius: "2px", flexShrink: 0, marginTop: "4px" }} />
            <div>
              <div style={{ fontSize: "34px", fontWeight: 900, color: "#111", lineHeight: "1.05", letterSpacing: "-0.02em" }}>Verb &ldquo;to be&rdquo;</div>
              <div style={{ fontSize: "13px", color: "#999", marginTop: "6px", fontWeight: 400, letterSpacing: "0.01em" }}>am &middot; is &middot; are &nbsp;&mdash;&nbsp; 4 graded exercises + answer key</div>
            </div>
          </div>

          {/* Grammar table */}
          <div style={{ padding: "22px 44px 18px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#bbb", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "10px" }}>Grammar Reference</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: "#111" }}>
                  {["Subject", "Affirmative (+)", "Negative (−)", "Question (?)"].map((h, i) => (
                    <th key={i} style={{ padding: "9px 14px", textAlign: "left", fontWeight: 700, fontSize: "10px", color: "#F5DA20", letterSpacing: "0.04em", borderRight: i < 3 ? "1px solid #2a2a2a" : "none" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  ["I", "I am a student.  (I'm)", "I am not tired.", "Am I late?"],
                  ["He / She / It", "She is my friend.  (she's)", "It isn't cold.", "Is he here?"],
                  ["You / We / They", "They are at home.  (they're)", "We aren't ready.", "Are you late?"],
                ] as string[][]).map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: "9px 14px", borderRight: ci < 3 ? "1px solid #f0f0f0" : "none", fontWeight: ci === 0 ? 700 : 400, fontSize: "12px", color: ci === 0 ? "#111" : "#444", background: ci === 0 ? "#fafafa" : "#fff" }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Key rule — left-border accent style */}
            <div style={{ marginTop: "10px", borderLeft: "3px solid #F5DA20", paddingLeft: "14px", paddingTop: "6px", paddingBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "#555" }}>
                <strong style={{ color: "#111" }}>Key rule: &nbsp;</strong>
                I → <strong style={{ color: "#111" }}>am</strong>
                {"  ·  "}He / She / It → <strong style={{ color: "#111" }}>is</strong>
                {"  ·  "}You / We / They → <strong style={{ color: "#111" }}>are</strong>
              </span>
            </div>
          </div>

          {/* Exercises 1 & 2 */}
          {([
            { n: 1, title: "Exercise 1", level: "Easy", sub: "Circle the correct form.", items: [["I _____ a student.", "am · is · are"], ["She _____ from Poland.", "am · is · are"], ["They _____ at home.", "am · is · are"], ["My name _____ Alex.", "am · is · are"], ["You _____ my friend.", "am · is · are"], ["We _____ happy today.", "am · is · are"], ["It _____ cold outside.", "am · is · are"], ["I _____ 10 years old.", "am · is · are"], ["You _____ late.", "am · is · are"], ["He _____ a teacher.", "am · is · are"]], opts: true },
            { n: 2, title: "Exercise 2", level: "Medium", sub: "Fill in the blank with am / is / are.", items: [["I _____ from the USA."], ["She _____ my sister."], ["They _____ students."], ["We _____ in a café."], ["It _____ my phone."], ["You _____ very kind."], ["My parents _____ at work."], ["The weather _____ nice."], ["I _____ tired."], ["You _____ ready."]], opts: false },
          ] as { n: number; title: string; level: string; sub: string; items: string[][]; opts: boolean }[]).map(({ n, title, level, sub, items, opts }) => (
            <div key={n} style={{ margin: "0 44px 16px" }}>
              {/* Exercise header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
                <span style={{ background: "#111", color: "#fff", fontWeight: 900, fontSize: "10px", width: "22px", height: "22px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: "1", flexShrink: 0 }}>{n}</span>
                <span style={{ fontWeight: 800, fontSize: "13px", color: "#111" }}>{title}</span>
                <span style={{ background: "#F5DA20", color: "#111", fontWeight: 700, fontSize: "9px", padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", lineHeight: "1" }}>{level.toUpperCase()}</span>
                <span style={{ color: "#aaa", fontSize: "11px" }}>{sub}</span>
              </div>
              {/* Items */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                {items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px 7px 0", borderBottom: "1px solid #f2f2f2", paddingLeft: i % 2 === 1 ? "14px" : "0", borderLeft: i % 2 === 1 ? "1px solid #f2f2f2" : "none" }}>
                    <span style={{ fontWeight: 700, fontSize: "10px", color: "#ccc", minWidth: "18px", flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ flex: 1, fontSize: "12px", color: "#222" }}>{item[0]}</span>
                    {opts && item[1] && <span style={{ fontSize: "9.5px", color: "#bbb", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>{item[1]}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div style={{ position: "absolute", bottom: "18px", left: "44px", right: "44px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "9px", color: "#ccc", letterSpacing: "0.04em" }}>englishnerd.cc</span>
            <span style={{ fontSize: "9px", color: "#ccc" }}>1 / 3</span>
          </div>
        </div>

        {/* ── PAGE 2 ── */}
        <div ref={page2Ref} style={{ width: "794px", height: "1123px", background: "#ffffff", overflow: "hidden", fontFamily: "'Helvetica Neue', Arial, sans-serif", color: "#111", boxSizing: "border-box", position: "relative" }}>
          <div style={{ height: "5px", background: "#F5DA20" }} />
          <div style={{ padding: "16px 44px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ebebeb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: 900, fontSize: "15px", color: "#111", letterSpacing: "-0.01em" }}>English Nerd</span>
              <span style={{ width: "1px", height: "14px", background: "#ddd", display: "inline-block" }} />
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#999" }}>Verb &ldquo;to be&rdquo; &mdash; am / is / are</span>
            </div>
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#bbb", letterSpacing: "0.06em" }}>PAGE 2 / 3</span>
          </div>

          <div style={{ padding: "30px 44px 0" }}>
            {([
              { n: 3, title: "Exercise 3", level: "Hard", sub: "Write the correct negative form.", items: ["I _____ a doctor.", "He _____ at home.", "They _____ late.", "She _____ happy today.", "We _____ in the office.", "It _____ my bag.", "You _____ wrong.", "I _____ hungry.", "My name _____ John.", "They _____ here."] },
              { n: 4, title: "Exercise 4", level: "Harder", sub: "Write the correct question form at the start.", items: ["_____ late? (I)", "_____ your teacher? (she)", "_____ at school? (they)", "_____ okay? (you)", "_____ from Spain? (he)", "_____ friends? (we)", "_____ your phone? (it)", "_____ ready? (they)", "_____ tired? (I)", "_____ in the right place? (we)"] },
            ] as { n: number; title: string; level: string; sub: string; items: string[] }[]).map(({ n, title, level, sub, items }) => (
              <div key={n} style={{ marginBottom: "30px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ background: "#111", color: "#fff", fontWeight: 900, fontSize: "10px", width: "22px", height: "22px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: "1", flexShrink: 0 }}>{n}</span>
                  <span style={{ fontWeight: 800, fontSize: "13px", color: "#111" }}>{title}</span>
                  <span style={{ background: "#111", color: "#F5DA20", fontWeight: 700, fontSize: "9px", padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", lineHeight: "1" }}>{level.toUpperCase()}</span>
                  <span style={{ color: "#aaa", fontSize: "11px" }}>{sub}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                  {items.map((prompt, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px 8px 0", borderBottom: "1px solid #f2f2f2", paddingLeft: i % 2 === 1 ? "14px" : "0", borderLeft: i % 2 === 1 ? "1px solid #f2f2f2" : "none" }}>
                      <span style={{ fontWeight: 700, fontSize: "10px", color: "#ccc", minWidth: "18px", flexShrink: 0 }}>{i + 1}.</span>
                      <span style={{ fontSize: "12px", color: "#222" }}>{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Reminder box */}
            <div style={{ borderLeft: "3px solid #F5DA20", paddingLeft: "14px", paddingTop: "8px", paddingBottom: "8px", marginTop: "8px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "5px" }}>Quick Reminder</div>
              <div style={{ fontSize: "12px", color: "#444", lineHeight: "1.8" }}>
                I → <strong style={{ color: "#111" }}>am</strong>{"  ·  "}He / She / It → <strong style={{ color: "#111" }}>is</strong>{"  ·  "}You / We / They → <strong style={{ color: "#111" }}>are</strong><br />
                Negatives: <strong style={{ color: "#111" }}>am not</strong> / <strong style={{ color: "#111" }}>isn&apos;t</strong> / <strong style={{ color: "#111" }}>aren&apos;t</strong>{"  ·  "}Questions: invert subject and verb.
              </div>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: "18px", left: "44px", right: "44px", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "9px", color: "#ccc", letterSpacing: "0.04em" }}>englishnerd.cc</span>
            <span style={{ fontSize: "9px", color: "#ccc" }}>2 / 3</span>
          </div>
        </div>

        {/* ── PAGE 3: Answer Key ── */}
        <div ref={page3Ref} style={{ width: "794px", height: "1123px", background: "#ffffff", overflow: "hidden", fontFamily: "'Helvetica Neue', Arial, sans-serif", color: "#111", boxSizing: "border-box", position: "relative" }}>
          <div style={{ height: "5px", background: "#F5DA20" }} />
          <div style={{ padding: "16px 44px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ebebeb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: 900, fontSize: "15px", color: "#111", letterSpacing: "-0.01em" }}>English Nerd</span>
              <span style={{ width: "1px", height: "14px", background: "#ddd", display: "inline-block" }} />
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#999" }}>Verb &ldquo;to be&rdquo; &mdash; am / is / are</span>
            </div>
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#bbb", letterSpacing: "0.06em" }}>PAGE 3 / 3 — ANSWER KEY</span>
          </div>

          <div style={{ padding: "30px 44px 0" }}>
            {/* Title */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "28px" }}>
              <div style={{ width: "4px", height: "42px", background: "#F5DA20", borderRadius: "2px", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#111", letterSpacing: "-0.02em", lineHeight: "1.1" }}>Answer Key</div>
                <div style={{ fontSize: "12px", color: "#aaa", marginTop: "5px" }}>Check your answers below</div>
              </div>
            </div>

            {([
              { label: "Exercise 1", sub: "Easy — circle am / is / are", answers: ["am", "is", "are", "is", "are", "are", "is", "am", "are", "is"] },
              { label: "Exercise 2", sub: "Medium — fill in am / is / are", answers: ["am", "is", "are", "are", "is", "are", "are", "is", "am", "are"] },
              { label: "Exercise 3", sub: "Hard — negatives", answers: ["am not", "isn't", "aren't", "isn't", "aren't", "isn't", "aren't", "am not", "isn't", "aren't"] },
              { label: "Exercise 4", sub: "Harder — questions", answers: ["Am I", "Is she", "Are they", "Are you", "Is he", "Are we", "Is it", "Are they", "Am I", "Are we"] },
            ] as { label: string; sub: string; answers: string[] }[]).map(({ label, sub, answers }, idx) => (
              <div key={label} style={{ marginBottom: "18px" }}>
                {/* Section header */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", paddingBottom: "8px", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ background: "#111", color: "#fff", fontWeight: 900, fontSize: "10px", width: "22px", height: "22px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: "1", flexShrink: 0 }}>{idx + 1}</span>
                  <span style={{ fontWeight: 800, fontSize: "13px", color: "#111" }}>{label}</span>
                  <span style={{ fontSize: "11px", color: "#aaa" }}>{sub}</span>
                </div>
                {/* Answers grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {answers.map((ans, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ color: "#ccc", fontWeight: 700, fontSize: "10px", minWidth: "16px", flexShrink: 0 }}>{i + 1}.</span>
                      <span style={{ fontWeight: 700, background: "#F5DA20", padding: "3px 9px", borderRadius: "4px", color: "#111", fontSize: "11px", display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: "1" }}>{ans}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", bottom: "18px", left: "44px", right: "44px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: "12px" }}>
            <span style={{ fontSize: "9px", color: "#ccc", letterSpacing: "0.04em" }}>englishnerd.cc — Free English Grammar</span>
            <span style={{ fontSize: "9px", color: "#ccc" }}>Verb &ldquo;to be&rdquo; · A1 · Free to print &amp; share</span>
          </div>
        </div>

      </div>

      {/* Bottom navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a
          href="/grammar/a1"
          className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
        >
          ← All A1 topics
        </a>
        <a
          href="/grammar/a1/there-is-there-are"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: There is / There are →
        </a>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
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

function Ex({ en, correct = true }: { en: string; correct?: boolean }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 ${correct ? "bg-white border border-black/8" : "bg-red-50 border border-red-100"}`}>
      <span className="text-sm shrink-0">{correct ? "✅" : "❌"}</span>
      <div className={`font-semibold text-sm ${correct ? "text-slate-900" : "text-red-700 line-through"}`}>{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">To Be — am / is / are</h2>
        <p className="text-slate-500 text-sm">Learn the three present-tense forms of "to be" and when to use each one.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Affirmative */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Affirmative</span>
          </div>
          <Formula parts={[{ text: "Subject", color: "green" }, { dim: true, text: "+" }, { text: "am / is / are", color: "sky" }, { dim: true, text: "+" }, { text: "rest" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="I am a student." />
            <Ex en="She is from Poland." />
            <Ex en="They are at home." />
          </div>
        </div>

        {/* Negative */}
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-700 uppercase tracking-widest">Negative</span>
          </div>
          <Formula parts={[{ text: "Subject", color: "green" }, { dim: true, text: "+" }, { text: "am not / isn't / aren't", color: "red" }, { dim: true, text: "+" }, { text: "rest" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="I'm not tired." />
            <Ex en="She isn't late." />
            <Ex en="They aren't ready." />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[{ text: "Am / Is / Are", color: "sky" }, { dim: true, text: "+" }, { text: "Subject", color: "green" }, { dim: true, text: "+" }, { text: "rest ?" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="Am I right?" />
            <Ex en="Is she your friend?" />
            <Ex en="Are they at school?" />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Full reference table — to be</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Subject</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">+ (affirmative)</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">− (negative)</th>
                <th className="text-left py-2 font-black text-slate-700">? (question)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2 pr-4 font-bold text-slate-900">I</td>
                <td className="py-2 pr-4 text-slate-700">I <b>am</b> happy. <span className="text-slate-400 text-xs">(I'm)</span></td>
                <td className="py-2 pr-4 text-slate-700">I <b>am not</b> tired. <span className="text-slate-400 text-xs">(I'm not)</span></td>
                <td className="py-2 text-slate-700"><b>Am</b> I right?</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold text-slate-900">He / She / It</td>
                <td className="py-2 pr-4 text-slate-700">She <b>is</b> kind. <span className="text-slate-400 text-xs">(she's)</span></td>
                <td className="py-2 pr-4 text-slate-700">He <b>isn't</b> home.</td>
                <td className="py-2 text-slate-700"><b>Is</b> it cold?</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold text-slate-900">You / We / They</td>
                <td className="py-2 pr-4 text-slate-700">They <b>are</b> busy. <span className="text-slate-400 text-xs">(they're)</span></td>
                <td className="py-2 pr-4 text-slate-700">We <b>aren't</b> late.</td>
                <td className="py-2 text-slate-700"><b>Are</b> you ready?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjective word grid */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm font-black text-violet-700">A</span>
          <h3 className="font-black text-slate-900">Common adjectives used with "to be"</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["happy", "tired", "hungry", "ready", "late", "busy", "right", "wrong", "cold", "hot"].map((adj) => (
            <span key={adj} className="rounded-lg px-3 py-1.5 text-xs font-black border bg-violet-100 text-violet-800 border-violet-200">{adj}</span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Example: <span className="font-semibold text-slate-700">I am hungry. / She is tired. / They are ready.</span></p>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Common mistake:</b> Never mix subjects and verb forms. <span className="line-through">I is</span> and <span className="line-through">She am</span> are always wrong. Remember: <b>I → am</b>, <b>he/she/it → is</b>, <b>you/we/they → are</b>.
      </div>
    </div>
  );
}

