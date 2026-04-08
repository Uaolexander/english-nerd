"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import PDFButton from "@/components/PDFButton";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Object Pronouns", href: "/grammar/a2/object-pronouns", level: "A2", badge: "bg-emerald-600", reason: "Me, him, her — closely related to possessive pronouns" },
  { title: "The Definite Article", href: "/grammar/a2/articles-the", level: "A2", badge: "bg-emerald-600", reason: "Both involve referring to specific things" },
  { title: "Have to / Don't have to", href: "/grammar/a2/have-to", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "This bag is Anna's. It's ___.", options: ["her", "hers", "his", "theirs"], answer: 1 },
  { q: "That car belongs to Tom. It's ___.", options: ["hers", "theirs", "his", "ours"], answer: 2 },
  { q: "These are my keys. They're ___.", options: ["yours", "mine", "hers", "his"], answer: 1 },
  { q: "Is this your jacket? Yes, it's ___.", options: ["mine", "his", "ours", "yours"], answer: 3 },
  { q: "This house belongs to us. It's ___.", options: ["theirs", "hers", "ours", "mine"], answer: 2 },
  { q: "That dog belongs to them. It's ___.", options: ["ours", "his", "hers", "theirs"], answer: 3 },
  { q: "My phone is black. ___ is white. (she)", options: ["Her", "His", "Hers", "Theirs"], answer: 2 },
  { q: "Our flat is small. ___ is huge. (they)", options: ["Ours", "Hers", "His", "Theirs"], answer: 3 },
  { q: "His answer was wrong. ___ was right. (I)", options: ["My", "Me", "Mine", "Yours"], answer: 2 },
  { q: "This is ___ book. (I — before a noun)", options: ["mine", "me", "my", "hers"], answer: 2 },
  { q: "That book is ___. (I — stands alone)", options: ["my", "me", "his", "mine"], answer: 3 },
  { q: "Is this ___ phone? (you — before a noun)", options: ["yours", "you", "mine", "your"], answer: 3 },
  { q: "This phone isn't mine — it must be ___. (you)", options: ["your", "you", "mine", "yours"], answer: 3 },
  { q: "A friend of ___ told me. (she)", options: ["her", "she", "hers", "his"], answer: 2 },
  { q: "___ results are better. (our — before a noun)", options: ["Ours", "Our", "Theirs", "Their"], answer: 1 },
  { q: "Their garden is bigger than ___. (we)", options: ["our", "us", "ours", "mine"], answer: 2 },
  { q: "That decision was ___. (he)", options: ["her", "hers", "him", "his"], answer: 3 },
  { q: "The red one is mine. Which is ___? (you)", options: ["your", "you", "mine", "yours"], answer: 3 },
  { q: "She left ___ bag in the car. (she — before a noun)", options: ["hers", "she", "her", "his"], answer: 2 },
  { q: "That blue car is ___. (she — stands alone)", options: ["her", "she", "his", "hers"], answer: 3 },
];

export default function PossessivePronounsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct possessive pronoun",
      instructions: "Choose the correct possessive pronoun (mine, yours, his, hers, ours, theirs).",
      questions: [
        { id: "e1q1", prompt: "This bag is Anna's. It's ___.", options: ["hers", "her", "his"], correctIndex: 0, explanation: "Anna = she → possessive pronoun: hers." },
        { id: "e1q2", prompt: "That car belongs to Tom. It's ___.", options: ["hers", "his", "theirs"], correctIndex: 1, explanation: "Tom = he → possessive pronoun: his." },
        { id: "e1q3", prompt: "These are my keys. They're ___.", options: ["yours", "mine", "hers"], correctIndex: 1, explanation: "My → possessive pronoun: mine." },
        { id: "e1q4", prompt: "Is this your jacket? Yes, it's ___.", options: ["mine", "yours", "ours"], correctIndex: 1, explanation: "Your → possessive pronoun: yours." },
        { id: "e1q5", prompt: "This house belongs to us. It's ___.", options: ["theirs", "hers", "ours"], correctIndex: 2, explanation: "Our → possessive pronoun: ours." },
        { id: "e1q6", prompt: "That dog belongs to them. It's ___.", options: ["ours", "theirs", "his"], correctIndex: 1, explanation: "Their → possessive pronoun: theirs." },
        { id: "e1q7", prompt: "My phone is black. ___ is white. (she)", options: ["Hers", "Her", "His"], correctIndex: 0, explanation: "She → possessive pronoun: hers." },
        { id: "e1q8", prompt: "Our flat is small. ___ is huge. (they)", options: ["Theirs", "Ours", "Hers"], correctIndex: 0, explanation: "They → possessive pronoun: theirs." },
        { id: "e1q9", prompt: "His answer was wrong. ___ was right. (I)", options: ["Mine", "My", "Me"], correctIndex: 0, explanation: "My → possessive pronoun: mine." },
        { id: "e1q10", prompt: "Her score was 80. ___ was 95. (he)", options: ["Hers", "His", "Yours"], correctIndex: 1, explanation: "He → possessive pronoun: his." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct possessive pronoun",
      instructions: "Write the possessive pronoun for the word in brackets.",
      questions: [
        { id: "e2q1", prompt: "This pen is mine. That one is ___ . (you)", correct: "yours", explanation: "your → yours" },
        { id: "e2q2", prompt: "Her bag is red. ___ is blue. (I)", correct: "mine", explanation: "my → mine" },
        { id: "e2q3", prompt: "My bike is new. ___ is old. (he)", correct: "his", explanation: "his → his (same form)" },
        { id: "e2q4", prompt: "His flat is small. ___ is bigger. (she)", correct: "hers", explanation: "her → hers" },
        { id: "e2q5", prompt: "Their idea was good. ___ was better. (we)", correct: "ours", explanation: "our → ours" },
        { id: "e2q6", prompt: "Our team won. ___ lost. (they)", correct: "theirs", explanation: "their → theirs" },
        { id: "e2q7", prompt: "Your results are great. ___ are even better. (I)", correct: "mine", explanation: "my → mine" },
        { id: "e2q8", prompt: "My coffee is cold. ___ is still hot. (she)", correct: "hers", explanation: "her → hers" },
        { id: "e2q9", prompt: "Their garden is lovely. ___ needs work. (we)", correct: "ours", explanation: "our → ours" },
        { id: "e2q10", prompt: "Her shoes are size 38. ___ are 42. (he)", correct: "his", explanation: "his → his" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Possessive adjective or possessive pronoun?",
      instructions: "Choose the correct word — possessive adjective (my/your/his…) or possessive pronoun (mine/yours/his…).",
      questions: [
        { id: "e3q1", prompt: "This is ___ book. (I — the book belongs to me)", options: ["my", "mine", "me"], correctIndex: 0, explanation: "'My' is a possessive adjective — it comes BEFORE a noun: my book." },
        { id: "e3q2", prompt: "That book is ___. (I — it belongs to me)", options: ["my", "mine", "me"], correctIndex: 1, explanation: "'Mine' is a possessive pronoun — it stands ALONE, no noun follows: it is mine." },
        { id: "e3q3", prompt: "Is this ___ phone? (you)", options: ["your", "yours", "you"], correctIndex: 0, explanation: "'Your' — before a noun: your phone." },
        { id: "e3q4", prompt: "This phone isn't mine — it must be ___. (you)", options: ["your", "yours", "you"], correctIndex: 1, explanation: "'Yours' — stands alone, no noun follows." },
        { id: "e3q5", prompt: "I forgot ___ umbrella. (I)", options: ["my", "mine", "me"], correctIndex: 0, explanation: "'My' — before a noun: my umbrella." },
        { id: "e3q6", prompt: "She lost her keys. Can I borrow ___? (you)", options: ["your", "yours", "you"], correctIndex: 1, explanation: "'Yours' — no noun follows. Borrow yours (= your keys)." },
        { id: "e3q7", prompt: "___ results are better than ___. (our / they)", options: ["Our / theirs", "Ours / their", "Our / their"], correctIndex: 0, explanation: "'Our results' (adj + noun) vs 'theirs' (pronoun, stands alone)." },
        { id: "e3q8", prompt: "That decision was ___. (he)", options: ["his", "her", "hers"], correctIndex: 0, explanation: "'His' is both possessive adjective AND possessive pronoun. his decision / it was his." },
        { id: "e3q9", prompt: "___ idea or ___? (my / she)", options: ["My idea or hers?", "Mine idea or her?", "My idea or her?"], correctIndex: 0, explanation: "'My idea' (adj + noun) + 'hers' (pronoun, alone)." },
        { id: "e3q10", prompt: "A friend of ___ told me. (she)", options: ["her", "hers", "she"], correctIndex: 1, explanation: "'A friend of hers' — after 'of' we use possessive pronoun, not adjective." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write possessive adjective or pronoun",
      instructions: "Write the correct form. If a noun follows the gap → possessive adjective. If the gap stands alone → possessive pronoun.",
      questions: [
        { id: "e4q1", prompt: "I love ___ job. It's really interesting. (I)", correct: "my", explanation: "'My' — before noun 'job'." },
        { id: "e4q2", prompt: "This seat is taken — it's ___. (I)", correct: "mine", explanation: "'Mine' — stands alone, no noun follows." },
        { id: "e4q3", prompt: "She left ___ bag in the car. (she)", correct: "her", explanation: "'Her' — before noun 'bag'." },
        { id: "e4q4", prompt: "That blue car is ___. (she)", correct: "hers", explanation: "'Hers' — stands alone." },
        { id: "e4q5", prompt: "We painted ___ house last summer. (we)", correct: "our", explanation: "'Our' — before noun 'house'." },
        { id: "e4q6", prompt: "Their garden is bigger than ___. (we)", correct: "ours", explanation: "'Ours' — stands alone, comparing to ours." },
        { id: "e4q7", prompt: "A colleague of ___ recommended this restaurant. (they)", correct: "theirs", explanation: "'A colleague of theirs' — after 'of', use possessive pronoun." },
        { id: "e4q8", prompt: "He forgot ___ keys again. (he)", correct: "his", explanation: "'His' — possessive adjective before 'keys'." },
        { id: "e4q9", prompt: "The red one is mine. Which one is ___? (you)", correct: "yours", explanation: "'Yours' — stands alone." },
        { id: "e4q10", prompt: "She always borrows ___ things without asking. (I)", correct: "my", explanation: "'My' — before noun 'things'." },
      ],
    },
  }), []);

  const current = sets[exNo];

  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  async function downloadPDF() {
    setPdfLoading(true);
    const config: LessonPDFConfig = {
      title: "Possessive Pronouns",
      subtitle: "mine, yours, his, hers, ours, theirs — 4 exercises + answer key",
      level: "A2",
      keyRule: "Possessive adjective (my/your…) + noun | Possessive pronoun (mine/yours…) stands alone",
      exercises: [
        {
          number: 1, title: "Exercise 1", difficulty: "Easy",
          instruction: "Choose the correct possessive pronoun (mine, yours, his, hers, ours, theirs).",
          questions: [
            "This bag is Anna's. It's ___.",
            "That car belongs to Tom. It's ___.",
            "These are my keys. They're ___.",
            "Is this your jacket? Yes, it's ___.",
            "This house belongs to us. It's ___.",
            "That dog belongs to them. It's ___.",
            "My phone is black. ___ is white. (she)",
            "Our flat is small. ___ is huge. (they)",
            "His answer was wrong. ___ was right. (I)",
            "Her score was 80. ___ was 95. (he)",
          ],
        },
        {
          number: 2, title: "Exercise 2", difficulty: "Medium",
          instruction: "Write the possessive pronoun for the word in brackets.",
          questions: [
            "This pen is mine. That one is ___ . (you)",
            "Her bag is red. ___ is blue. (I)",
            "My bike is new. ___ is old. (he)",
            "His flat is small. ___ is bigger. (she)",
            "Their idea was good. ___ was better. (we)",
            "Our team won. ___ lost. (they)",
            "Your results are great. ___ are even better. (I)",
            "My coffee is cold. ___ is still hot. (she)",
            "Their garden is lovely. ___ needs work. (we)",
            "Her shoes are size 38. ___ are 42. (he)",
          ],
        },
        {
          number: 3, title: "Exercise 3", difficulty: "Hard",
          instruction: "Choose the correct word — possessive adjective or possessive pronoun.",
          questions: [
            "This is ___ book. (I — the book belongs to me)",
            "That book is ___. (I — it belongs to me)",
            "Is this ___ phone? (you)",
            "This phone isn't mine — it must be ___. (you)",
            "I forgot ___ umbrella. (I)",
            "She lost her keys. Can I borrow ___? (you)",
            "___ results are better than ___. (our / they)",
            "That decision was ___. (he)",
            "___ idea or ___? (my / she)",
            "A friend of ___ told me. (she)",
          ],
        },
        {
          number: 4, title: "Exercise 4", difficulty: "Harder",
          instruction: "Write the correct form — possessive adjective (before noun) or pronoun (alone).",
          questions: [
            "I love ___ job. It's really interesting. (I)",
            "This seat is taken — it's ___. (I)",
            "She left ___ bag in the car. (she)",
            "That blue car is ___. (she)",
            "We painted ___ house last summer. (we)",
            "Their garden is bigger than ___. (we)",
            "A colleague of ___ recommended this restaurant. (they)",
            "He forgot ___ keys again. (he)",
            "The red one is mine. Which one is ___? (you)",
            "She always borrows ___ things without asking. (I)",
          ],
        },
      ],
      answerKey: [
        { exercise: 1, subtitle: "Easy — choose pronoun", answers: ["hers", "his", "mine", "yours", "ours", "theirs", "Hers", "Theirs", "Mine", "His"] },
        { exercise: 2, subtitle: "Medium — write pronoun", answers: ["yours", "mine", "his", "hers", "ours", "theirs", "mine", "hers", "ours", "his"] },
        { exercise: 3, subtitle: "Hard — adj or pronoun", answers: ["my", "mine", "your", "yours", "my", "yours", "Our / theirs", "his", "My idea or hers?", "hers"] },
        { exercise: 4, subtitle: "Harder — correct form", answers: ["my", "mine", "her", "hers", "our", "ours", "theirs", "his", "yours", "my"] },
      ],
    };
    await generateLessonPDF(config);
    setPdfLoading(false);
  }

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
    const total = current.questions.length;
    if (current.type === "mcq") {
      for (const q of current.questions) { if (mcqAnswers[q.id] === q.correctIndex) correct++; }
    } else {
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }, [checked, current, mcqAnswers, inputAnswers]);

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Possessive Pronouns</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Possessive Pronouns{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">mine / yours / hers…</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Possessive pronouns replace a possessive adjective + noun to avoid repetition. They stand <b>alone</b> — no noun follows: <b>mine, yours, his, hers, ours, theirs</b>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left sidebar */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a2-possessive-pronouns" subject="Possessive Pronouns" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className=""><AdUnit variant="sidebar-dark" /></div>
        )}

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
            <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
              Exercises:
              {([1, 2, 3, 4] as const).map((n) => (
                <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {([1, 2, 3, 4] as const).map((n) => (
                      <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                    ))}
                  </div>
                </div>

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
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))} />
                                    <span className="text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
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
                      const wrong = checked && answered && !isCorrect;
                      const noAnswer = checked && !answered;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3">
                                <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                    ) : (
                      <button onClick={resetExercise} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                    )}
                    {checked && exNo < 4 && (
                      <button onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
                    )}
                  </div>
                  {score && (
                    <div className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div>
                          <div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div>
                        </div>
                        <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                        <div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} />
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        {/* Right sidebar */}
        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/a2" allLabel="All A2 topics" />
        ) : (
          <AdUnit variant="sidebar-light" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-possessive-pronouns" subject="Possessive Pronouns" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/have-to" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Have to / Don't have to →</a>
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
    orange: "bg-orange-100 text-orange-800 border-orange-200",
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
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Possessive Pronouns</h2>
        <p className="text-slate-500 text-sm">mine, yours, his, hers, ours, theirs — stand alone, no noun follows</p>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black text-amber-800">!</span>
          <span className="text-sm font-bold text-slate-700">Full reference table</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-slate-50">
                <th className="px-3 py-2 text-left font-bold text-slate-600">Subject</th>
                <th className="px-3 py-2 text-left font-bold text-slate-600">Possessive adjective</th>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Possessive pronoun</th>
                <th className="px-3 py-2 text-left font-bold text-slate-600">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "my", "mine", "It's mine."],
                ["you", "your", "yours", "Is this yours?"],
                ["he", "his", "his", "That one is his."],
                ["she", "her", "hers", "The red bag is hers."],
                ["it", "its", "—", "(not used as standalone pronoun)"],
                ["we", "our", "ours", "The house is ours."],
                ["they", "their", "theirs", "The idea was theirs."],
              ].map(([sub, adj, pro, ex]) => (
                <tr key={sub} className="bg-white even:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">{sub}</td>
                  <td className="px-3 py-2 text-slate-700">{adj}</td>
                  <td className="px-3 py-2 font-black text-slate-900">{pro}</td>
                  <td className="px-3 py-2 text-slate-500 italic">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key difference card */}
      <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4">
        <div className="text-xs font-black text-violet-700 uppercase tracking-wide mb-3">Key difference</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-white border border-violet-100 p-3">
            <div className="text-xs font-bold text-slate-500 mb-2">Possessive ADJECTIVE — before a noun</div>
            <div className="text-sm text-slate-800 space-y-1 italic">
              <div>This is <b>my</b> book.</div>
              <div>Is this <b>your</b> phone?</div>
              <div>She lost <b>her</b> keys.</div>
            </div>
          </div>
          <div className="rounded-xl bg-white border border-violet-100 p-3">
            <div className="text-xs font-bold text-slate-500 mb-2">Possessive PRONOUN — stands alone</div>
            <div className="text-sm text-slate-800 space-y-1 italic">
              <div>This book is <b>mine</b>.</div>
              <div>Is this phone <b>yours</b>?</div>
              <div>Those keys are <b>hers</b>.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
        <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-3">Formula</div>
        <div className="space-y-2">
          <Formula parts={[{ text: "Noun phrase", color: "sky" }, { dim: true, text: "+" }, { text: "is / are", color: "yellow" }, { dim: true, text: "+" }, { text: "possessive pronoun", color: "violet" }]} />
          <div className="text-xs text-slate-500 pt-1">or use the possessive pronoun alone in response to a question</div>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <div className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2">Examples</div>
        <Ex en="This is mine." />
        <Ex en="This is my." correct={false} />
        <Ex en="This is her book." />
        <Ex en="This is hers book." correct={false} />
      </div>

      {/* Amber tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">No apostrophe!</span> Possessive pronouns never need an apostrophe — write <b>yours</b>, not <i>your&apos;s</i>; <b>theirs</b>, not <i>their&apos;s</i>. Also: &ldquo;a friend of <b>mine</b>&rdquo; ✅ — after the preposition <i>of</i>, always use the possessive pronoun, not the adjective.
      </div>
    </div>
  );
}
