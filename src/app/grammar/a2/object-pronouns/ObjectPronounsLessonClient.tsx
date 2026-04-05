"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Possessive Pronouns", href: "/grammar/a2/possessive-pronouns", level: "A2", badge: "bg-emerald-600", reason: "Mine, yours, his — the natural next step" },
  { title: "The Definite Article", href: "/grammar/a2/articles-the", level: "A2", badge: "bg-emerald-600", reason: "Articles and pronouns both refer to specific things" },
  { title: "Present Continuous", href: "/grammar/a2/present-continuous", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "I love my sister. I call ___ every day.", options: ["him", "her", "them", "it"], answer: 1 },
  { q: "Where is Tom? I can't find ___.", options: ["her", "them", "it", "him"], answer: 3 },
  { q: "I lost my keys. I can't find ___.", options: ["him", "her", "it", "them"], answer: 3 },
  { q: "Can you help ___? I don't understand.", options: ["I", "my", "me", "mine"], answer: 2 },
  { q: "This film is boring. I don't like ___.", options: ["him", "her", "them", "it"], answer: 3 },
  { q: "She looked at ___ and smiled. (we)", options: ["our", "we", "us", "ours"], answer: 2 },
  { q: "I → object pronoun:", options: ["my", "mine", "I", "me"], answer: 3 },
  { q: "he → object pronoun:", options: ["his", "him", "he", "her"], answer: 1 },
  { q: "she → object pronoun:", options: ["hers", "his", "her", "she"], answer: 2 },
  { q: "we → object pronoun:", options: ["our", "ours", "we", "us"], answer: 3 },
  { q: "they → object pronoun:", options: ["their", "theirs", "them", "they"], answer: 2 },
  { q: "Between you and ___, I think he's wrong. (I)", options: ["I", "my", "mine", "me"], answer: 3 },
  { q: "She gave ___ a message. (he)", options: ["he", "his", "him", "her"], answer: 2 },
  { q: "Can you see ___? (they)", options: ["they", "their", "theirs", "them"], answer: 3 },
  { q: "I talked to ___ this morning. (she)", options: ["she", "hers", "her", "his"], answer: 2 },
  { q: "My parents are visiting. I'm excited to see ___.", options: ["him", "her", "it", "them"], answer: 3 },
  { q: "Jake and I are waiting. Can you call ___?", options: ["him", "them", "us", "her"], answer: 2 },
  { q: "She's angry at ___. (I)", options: ["I", "my", "mine", "me"], answer: 3 },
  { q: "This bag is heavy. Can you carry ___ for me?", options: ["him", "her", "them", "it"], answer: 3 },
  { q: "He is my best friend. I trust ___ completely.", options: ["her", "them", "him", "it"], answer: 2 },
];

export default function ObjectPronounsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct object pronoun",
      instructions: "Choose the correct object pronoun to replace the underlined word or phrase.",
      questions: [
        { id: "e1q1", prompt: "I love my sister. I call ___ every day.", options: ["her", "him", "them"], correctIndex: 0, explanation: "My sister = she → object pronoun: her." },
        { id: "e1q2", prompt: "Where is Tom? I can't find ___.", options: ["her", "him", "them"], correctIndex: 1, explanation: "Tom = he → object pronoun: him." },
        { id: "e1q3", prompt: "I lost my keys. I can't find ___.", options: ["him", "her", "them"], correctIndex: 2, explanation: "Keys = they (plural) → object pronoun: them." },
        { id: "e1q4", prompt: "Do you know Anna and Peter? I met ___ yesterday.", options: ["him", "her", "them"], correctIndex: 2, explanation: "Anna and Peter = they → object pronoun: them." },
        { id: "e1q5", prompt: "Can you help ___? I don't understand this exercise.", options: ["I", "me", "my"], correctIndex: 1, explanation: "I → object pronoun: me." },
        { id: "e1q6", prompt: "She is talking to ___ right now. (you)", options: ["you", "your", "yours"], correctIndex: 0, explanation: "you → object pronoun: you (same form for subject and object)." },
        { id: "e1q7", prompt: "This film is boring. I don't like ___.", options: ["him", "it", "them"], correctIndex: 1, explanation: "Film = it (singular thing) → object pronoun: it." },
        { id: "e1q8", prompt: "She looked at ___ and smiled. (we)", options: ["our", "us", "we"], correctIndex: 1, explanation: "We → object pronoun: us." },
        { id: "e1q9", prompt: "He is my best friend. I trust ___ completely.", options: ["him", "her", "them"], correctIndex: 0, explanation: "He → object pronoun: him." },
        { id: "e1q10", prompt: "The children are hungry. Please feed ___.", options: ["it", "him", "them"], correctIndex: 2, explanation: "Children = they → object pronoun: them." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct object pronoun",
      instructions: "Write the correct object pronoun for the subject in brackets.",
      questions: [
        { id: "e2q1", prompt: "Subject: I → object pronoun: ____", correct: "me", explanation: "I → me" },
        { id: "e2q2", prompt: "Subject: he → object pronoun: ____", correct: "him", explanation: "he → him" },
        { id: "e2q3", prompt: "Subject: she → object pronoun: ____", correct: "her", explanation: "she → her" },
        { id: "e2q4", prompt: "Subject: we → object pronoun: ____", correct: "us", explanation: "we → us" },
        { id: "e2q5", prompt: "Subject: they → object pronoun: ____", correct: "them", explanation: "they → them" },
        { id: "e2q6", prompt: "Subject: it → object pronoun: ____", correct: "it", explanation: "it → it (same form)" },
        { id: "e2q7", prompt: "Subject: you → object pronoun: ____", correct: "you", explanation: "you → you (same form, singular and plural)" },
        { id: "e2q8", prompt: "She sent ___ a message. (he)", correct: "him", explanation: "he → him" },
        { id: "e2q9", prompt: "Can you see ___? (they)", correct: "them", explanation: "they → them" },
        { id: "e2q10", prompt: "I talked to ___ this morning. (she)", correct: "her", explanation: "she → her" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Complete the sentence",
      instructions: "Choose the correct object pronoun. Pay attention to the verb and what comes before.",
      questions: [
        { id: "e3q1", prompt: "My mum made a cake. She baked ___ for my birthday.", options: ["it", "him", "them"], correctIndex: 0, explanation: "Cake = it → she baked it." },
        { id: "e3q2", prompt: "I really like Sarah. I'm going to invite ___ to the party.", options: ["him", "her", "them"], correctIndex: 1, explanation: "Sarah = she → invite her." },
        { id: "e3q3", prompt: "This is a great book. I recommend ___.", options: ["it", "him", "them"], correctIndex: 0, explanation: "Book = it → recommend it." },
        { id: "e3q4", prompt: "Could you give ___ a hand? We can't move this sofa alone.", options: ["us", "them", "him"], correctIndex: 0, explanation: "We → give us a hand." },
        { id: "e3q5", prompt: "Jake and I are waiting. Can you call ___ when you arrive?", options: ["us", "them", "him"], correctIndex: 0, explanation: "Jake and I = we → call us." },
        { id: "e3q6", prompt: "She's angry at ___. I don't know why. (I)", options: ["me", "I", "my"], correctIndex: 0, explanation: "I → object pronoun: me. After prepositions always use object pronoun." },
        { id: "e3q7", prompt: "I haven't seen the new Marvel film yet. Have you seen ___?", options: ["it", "him", "them"], correctIndex: 0, explanation: "Film = it → seen it." },
        { id: "e3q8", prompt: "My parents are visiting next week. I'm really excited to see ___.", options: ["him", "her", "them"], correctIndex: 2, explanation: "Parents = they → see them." },
        { id: "e3q9", prompt: "Between you and ___, I think he's wrong. (I)", options: ["me", "I", "my"], correctIndex: 0, explanation: "Between you and me — always use object pronoun after prepositions: between, for, with, to..." },
        { id: "e3q10", prompt: "This bag is too heavy. Can you carry ___ for me?", options: ["it", "him", "them"], correctIndex: 0, explanation: "Bag = it → carry it." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the object pronoun",
      instructions: "Write the correct object pronoun for the word or group in brackets.",
      questions: [
        { id: "e4q1", prompt: "She showed ___ the photos. (I)", correct: "me", explanation: "I → me. Indirect object." },
        { id: "e4q2", prompt: "He wrote ___ a long letter. (she)", correct: "her", explanation: "she → her." },
        { id: "e4q3", prompt: "They invited ___ to dinner. (we)", correct: "us", explanation: "we → us." },
        { id: "e4q4", prompt: "I'll text ___ later. (he)", correct: "him", explanation: "he → him." },
        { id: "e4q5", prompt: "Can you help ___ with this? (they)", correct: "them", explanation: "they → them." },
        { id: "e4q6", prompt: "She gave ___ the wrong address. (I)", correct: "me", explanation: "I → me." },
        { id: "e4q7", prompt: "I told ___ the truth. (she)", correct: "her", explanation: "she → her." },
        { id: "e4q8", prompt: "This is for ___. Happy birthday! (you)", correct: "you", explanation: "you → you (same form)." },
        { id: "e4q9", prompt: "The dog followed ___ home. (we)", correct: "us", explanation: "we → us." },
        { id: "e4q10", prompt: "Did you see ___? He was right here. (he)", correct: "him", explanation: "he → him." },
      ],
    },
  }), []);

  const current = sets[exNo];

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

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Object Pronouns",
        subtitle: "me / him / her / us / them — 4 exercises + answer key",
        level: "A2",
        keyRule: "After a verb or preposition use object pronouns: me, you, him, her, it, us, them. Never I, he, she, we, they.",
        exercises: [
          { number: 1, title: "Exercise 1", difficulty: "Easy", instruction: "Choose the correct object pronoun.", questions: [
            "I love my sister. I call ___ every day.", "Where is Tom? I can't find ___.", "I lost my keys. I can't find ___.",
            "Do you know Anna and Peter? I met ___ yesterday.", "Can you help ___? I don't understand this exercise.",
            "She is talking to ___ right now. (you)", "This film is boring. I don't like ___.",
            "She looked at ___ and smiled. (we)", "He is my best friend. I trust ___ completely.",
            "The children are hungry. Please feed ___.",
          ]},
          { number: 2, title: "Exercise 2", difficulty: "Medium", instruction: "Write the correct object pronoun for the subject given.", questions: [
            "Subject: I → object pronoun: ____", "Subject: he → object pronoun: ____", "Subject: she → object pronoun: ____",
            "Subject: we → object pronoun: ____", "Subject: they → object pronoun: ____", "Subject: it → object pronoun: ____",
            "Subject: you → object pronoun: ____", "She sent ___ a message. (he)", "Can you see ___? (they)",
            "I talked to ___ this morning. (she)",
          ]},
          { number: 3, title: "Exercise 3", difficulty: "Hard", instruction: "Choose the correct object pronoun. Pay attention to context.", questions: [
            "My mum made a cake. She baked ___ for my birthday.", "I really like Sarah. I'm going to invite ___ to the party.",
            "This is a great book. I recommend ___.", "Could you give ___ a hand? We can't move this sofa alone.",
            "Jake and I are waiting. Can you call ___ when you arrive?", "She's angry at ___. I don't know why. (I)",
            "I haven't seen the new film yet. Have you seen ___?", "My parents are visiting. I'm excited to see ___.",
            "Between you and ___, I think he's wrong. (I)", "This bag is too heavy. Can you carry ___ for me?",
          ]},
          { number: 4, title: "Exercise 4", difficulty: "Harder", instruction: "Write the correct object pronoun for the word in brackets.", questions: [
            "She showed ___ the photos. (I)", "He wrote ___ a long letter. (she)", "They invited ___ to dinner. (we)",
            "I'll text ___ later. (he)", "Can you help ___ with this? (they)", "She gave ___ the wrong address. (I)",
            "I told ___ the truth. (she)", "This is for ___. Happy birthday! (you)", "The dog followed ___ home. (we)",
            "Did you see ___? He was right here. (he)",
          ]},
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — choose object pronoun", answers: ["her", "him", "them", "them", "me", "you", "it", "us", "him", "them"] },
          { exercise: 2, subtitle: "Medium — write the pronoun", answers: ["me", "him", "her", "us", "them", "it", "you", "him", "them", "her"] },
          { exercise: 3, subtitle: "Hard — pronoun in context", answers: ["it", "her", "it", "us", "us", "me", "it", "them", "me", "it"] },
          { exercise: 4, subtitle: "Harder — write from brackets", answers: ["me", "her", "us", "him", "them", "me", "her", "you", "us", "him"] },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Object Pronouns</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Object Pronouns{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">me / him / them…</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Object pronouns replace nouns that receive the action of a verb or follow a preposition. They are: <b>me, you, him, her, it, us, them</b>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a2-object-pronouns" subject="Object Pronouns" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
            <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
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

        {/* Right column */}
        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/a2" allLabel="All A2 topics" />
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-light" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-object-pronouns" subject="Object Pronouns" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/possessive-pronouns" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Possessive pronouns →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Object Pronouns (A2)</h2>
      <p>Object pronouns are used when the noun is the <b>object</b> of a verb or comes after a <b>preposition</b>. They replace the noun to avoid repetition.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Subject → Object pronoun</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[["I", "me"], ["you", "you"], ["he", "him"], ["she", "her"], ["it", "it"], ["we", "us"], ["they", "them"], ["you (pl.)", "you"]].map(([sub, obj]) => (
            <div key={sub} className="rounded-xl border border-black/10 bg-slate-50 p-3 text-center">
              <div className="text-xs text-slate-500 font-semibold">{sub}</div>
              <div className="text-xl font-black text-slate-900 mt-1">{obj}</div>
            </div>
          ))}
        </div>
      </div>

      <h3>Where to use object pronouns</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { title: "After a verb (direct object)", ex: ["I love her.", "Can you help me?", "She called him."] },
          { title: "After a verb (indirect object)", ex: ["She gave me the keys.", "He told us the truth.", "They sent her flowers."] },
          { title: "After prepositions", ex: ["This gift is for you.", "Come with us!", "Between you and me..."] },
          { title: "After 'be' in spoken English", ex: ["'Who's there?' — 'It's me!'", "'Who did that?' — 'Not him!'"] },
        ].map(({ title, ex }) => (
          <div key={title} className="rounded-xl border border-black/10 bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-800 mb-2">{title}</div>
            {ex.map((e) => <div key={e} className="text-sm text-slate-600 italic">{e}</div>)}
          </div>
        ))}
      </div>

      <div className="not-prose mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="text-xs font-bold text-red-600 mb-2">❌ Common mistakes</div>
          <div className="text-sm text-slate-900 space-y-1">
            <div><i>Between you and <b>I</b>...</i> ❌</div>
            <div><i>She gave <b>I</b> the book.</i> ❌</div>
            <div><i>He called <b>she</b> last night.</i> ❌</div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-bold text-emerald-700 mb-2">✅ Correct</div>
          <div className="text-sm text-slate-900 space-y-1">
            <div><i>Between you and <b>me</b>...</i></div>
            <div><i>She gave <b>me</b> the book.</i></div>
            <div><i>He called <b>her</b> last night.</i></div>
          </div>
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800"><span className="font-black text-slate-900">Key rule:</span> After a verb or preposition → always use the <b>object</b> pronoun (me, him, her, us, them), never the subject pronoun (I, he, she, we, they).</div>
      </div>
    </div>
  );
}
