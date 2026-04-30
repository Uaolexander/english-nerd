"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF, type LessonPDFConfig } from "@/lib/generateLessonPDF";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";
import { useLiveSync } from "@/lib/useLiveSync";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "'However' connects?", options: ["Two nouns", "Two contrasting sentences", "Reasons", "Conditions"], answer: 1 },
  { q: "'Despite' is followed by?", options: ["Subject + verb", "Noun/gerund", "Adjective", "Adverb"], answer: 1 },
  { q: "'Although' is followed by?", options: ["Noun/gerund", "Subject + verb (clause)", "Adjective", "Preposition"], answer: 1 },
  { q: "'Therefore' shows?", options: ["Contrast", "Cause and result", "Addition", "Concession"], answer: 1 },
  { q: "'In addition to' is followed by?", options: ["Subject + verb", "Noun/gerund", "Adjective", "Adverb"], answer: 1 },
  { q: "'Nevertheless' means?", options: ["Because of that", "In spite of that", "In addition to that", "As a result"], answer: 1 },
  { q: "'Furthermore' adds?", options: ["Contrast", "More information", "Cause", "Condition"], answer: 1 },
  { q: "'As a result' expresses?", options: ["Contrast", "Cause and consequence", "Concession", "Addition"], answer: 1 },
  { q: "'Even though' is similar to?", options: ["Despite", "Although", "However", "Therefore"], answer: 1 },
  { q: "'In spite of the fact that' is followed by?", options: ["Noun", "Gerund", "Clause (subject + verb)", "Adjective"], answer: 2 },
  { q: "'Consequently' is similar to?", options: ["However", "Nevertheless", "Therefore", "Although"], answer: 2 },
  { q: "'Whereas' compares?", options: ["Similar ideas", "Contrasting ideas", "Results", "Causes"], answer: 1 },
  { q: "'Due to' is followed by?", options: ["Subject + verb", "Noun/gerund", "Adjective", "Adverb"], answer: 1 },
  { q: "'On the contrary' means?", options: ["In addition", "Quite the opposite", "Because of", "In spite of"], answer: 1 },
  { q: "'Nonetheless' is used for?", options: ["Addition", "Concession/contrast", "Cause", "Condition"], answer: 1 },
  { q: "'Owing to' is followed by?", options: ["Subject + verb", "Noun/gerund", "Adjective", "Adverb"], answer: 1 },
  { q: "'As long as' expresses?", options: ["Contrast", "Condition", "Cause", "Addition"], answer: 1 },
  { q: "'What is more' adds?", options: ["Contrast", "Cause", "Even more information", "Concession"], answer: 2 },
  { q: "'Provided that' expresses?", options: ["Contrast", "Cause", "Condition", "Concession"], answer: 2 },
  { q: "'In contrast' compares?", options: ["Similar things", "Different/opposite things", "Causes", "Results"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Linking Words",
  subtitle: "Connectors: contrast, cause, addition, result",
  level: "B2",
  keyRule: "Match the linker to its grammatical category: +clause, +noun, or sentence connector.",
  exercises: [
    {
      number: 1,
      title: "Choose the correct linking word",
      difficulty: "easy" as const,
      instruction: "Pick the best linking word/phrase.",
      questions: [
        "The project was delayed. ___, we met deadline.",
        "___ the heavy rain, the match continued.",
        "___ she was exhausted, she kept working.",
        "She studied hard. ___, she failed.",
        "___ its cost, the phone sold well.",
        "He was late. ___, he missed the start.",
        "___ working hard, he earned little.",
        "It was cold. ___, we went for a walk.",
        "___ she was ill, she came to work.",
        "Traffic was bad. ___, I was on time.",
      ],
    },
    {
      number: 2,
      title: "Contrast or cause/result?",
      difficulty: "medium" as const,
      instruction: "Choose linker matching the relationship.",
      questions: [
        "He failed the exam ___ studying all night.",
        "She got the job ___ her lack of experience.",
        "The plan failed. ___, we had to start again.",
        "___ it was expensive, they bought it anyway.",
        "He arrived late ___ the traffic jam.",
        "Sales fell. ___, staff were made redundant.",
        "___ her nerves, she gave a great speech.",
        "He's very intelligent. ___, he's lazy.",
        "She applied ___ knowing she'd be rejected.",
        "___ the delay, we reached our destination.",
      ],
    },
    {
      number: 3,
      title: "Formal linking words",
      difficulty: "hard" as const,
      instruction: "Choose the most natural formal connector.",
      questions: [
        "He was well-qualified. ___, he was rejected.",
        "She improved her skills. ___ she got promoted.",
        "___ its size, the city has few museums.",
        "Costs rose. ___, profits fell sharply.",
        "___ the findings were alarming, no action taken.",
        "He apologised. ___, she didn't forgive him.",
        "___ long hours, she completed the project.",
        "Sales dropped. ___, we reviewed our strategy.",
        "___ the report, we changed the approach.",
        "___ the storm, the event was cancelled.",
      ],
    },
    {
      number: 4,
      title: "Rewrite using linking words",
      difficulty: "hard" as const,
      instruction: "Rewrite with the linker in brackets.",
      questions: [
        "Despite the cost, it was worth it. (In spite of)",
        "She worked hard but she didn't succeed. (Although)",
        "Because of traffic I was late. (Due to)",
        "He's smart. Also, he's hard-working. (Furthermore)",
        "She failed but tried again. (Nevertheless)",
        "The film was long. Still, I enjoyed it. (However)",
        "Traffic was bad. So I was late. (As a result)",
        "He works hard. But earns little. (Despite)",
        "She's talented. Also creative. (What is more)",
        "You can go if you finish your work. (As long as)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Linker choice", answers: ["However", "Despite", "Although", "Nevertheless", "Despite", "As a result", "Despite/In spite of", "Nevertheless", "Even though", "Nevertheless"] },
    { exercise: 2, subtitle: "Contrast vs cause/result", answers: ["despite", "despite/in spite of", "As a result/Consequently", "Although/Even though", "due to/because of", "Consequently/Therefore", "Despite/In spite of", "However", "despite/even though", "Despite/In spite of"] },
    { exercise: 3, subtitle: "Formal connectors", answers: ["Nevertheless/However", "Consequently/As a result", "Despite/In spite of", "Consequently/As a result", "Although/Even though", "Nevertheless/However", "Despite/In spite of", "Consequently/As a result", "As a result of/Due to", "Due to/Owing to"] },
    { exercise: 4, subtitle: "Rewritten sentences", answers: ["In spite of the cost, it was worth it", "Although she worked hard, she didn't succeed", "Due to traffic, I was late", "Furthermore, he is hard-working", "Nevertheless, she tried again", "However, I enjoyed it", "As a result, I was late", "Despite working hard, he earns little", "What is more, she is creative", "As long as you finish your work, you can go"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Advanced Quantifiers", href: "/grammar/b2/quantifiers-advanced", level: "B2", badge: "bg-orange-500", reason: "Quantifiers work hand-in-hand with linking words in complex sentences" },
  { title: "Cleft Sentences", href: "/grammar/b2/cleft-sentences", level: "B2", badge: "bg-orange-500", reason: "Cleft sentences use linking structures for emphasis" },
  { title: "Inversion", href: "/grammar/b2/inversion", level: "B2", badge: "bg-orange-500" },
];

export default function LinkingWordsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const { isLive, broadcast } = useLiveSync((payload) => {
    setMcqAnswers(payload.answers as Record<string, number | null>);
    setInputAnswers(payload.inputAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct linking word",
      instructions: "Choose the best linking word or phrase. Pay attention to the grammar: some are followed by a clause (subject + verb), others by a noun/gerund.",
      questions: [
        { id: "e1q1", prompt: "The project was delayed. ___, we managed to meet the deadline.", options: ["Despite", "However", "Although"], correctIndex: 1, explanation: "However = contrast between two sentences. Followed by a comma." },
        { id: "e1q2", prompt: "___ the heavy rain, the match continued.", options: ["Although", "Despite", "However"], correctIndex: 1, explanation: "Despite + noun/gerund (no subject+verb after it). Despite the rain." },
        { id: "e1q3", prompt: "___ she was exhausted, she kept working.", options: ["Despite", "In spite of", "Although"], correctIndex: 2, explanation: "Although + clause (subject + verb). Although she was exhausted." },
        { id: "e1q4", prompt: "He was well prepared; ___, he failed the exam.", options: ["moreover", "nevertheless", "therefore"], correctIndex: 1, explanation: "Nevertheless = despite what was just said, a surprising contrast." },
        { id: "e1q5", prompt: "She speaks French fluently. ___, she can also read Italian.", options: ["However", "Nevertheless", "Moreover"], correctIndex: 2, explanation: "Moreover = in addition (adds a positive point)." },
        { id: "e1q6", prompt: "The report was unclear; ___, the board rejected it.", options: ["consequently", "nevertheless", "in contrast"], correctIndex: 0, explanation: "Consequently = as a result / therefore (cause → effect)." },
        { id: "e1q7", prompt: "___ being tired, she attended the full meeting.", options: ["Although", "Despite", "However"], correctIndex: 1, explanation: "Despite + gerund: despite being tired." },
        { id: "e1q8", prompt: "He studied for months. ___, he didn't pass.", options: ["Therefore", "Even so", "Moreover"], correctIndex: 1, explanation: "Even so = despite that fact (unexpected result)." },
        { id: "e1q9", prompt: "The new policy will save money. ___, it will reduce waste.", options: ["However", "In addition", "Nevertheless"], correctIndex: 1, explanation: "In addition = furthermore / also (adds another point)." },
        { id: "e1q10", prompt: "___ the fact that it was expensive, they bought it.", options: ["Despite", "In spite of", "Both are correct"], correctIndex: 2, explanation: "Both 'despite the fact that' and 'in spite of the fact that' are correct — followed by a that-clause." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Contrast, addition, result, or concession?",
      instructions: "Choose the linking word that expresses the correct relationship: contrast, addition, result, purpose, or concession.",
      questions: [
        { id: "e2q1", prompt: "She left early ___ she wouldn't miss the last train.", options: ["so that", "in order to", "despite"], correctIndex: 0, explanation: "so that + clause = purpose (followed by subject + verb)." },
        { id: "e2q2", prompt: "He left early ___ catch the last train.", options: ["so that", "in order to", "therefore"], correctIndex: 1, explanation: "in order to + infinitive = purpose (no subject needed)." },
        { id: "e2q3", prompt: "The product is expensive. ___, it sells extremely well.", options: ["Therefore", "Nonetheless", "Furthermore"], correctIndex: 1, explanation: "Nonetheless = despite this (concession + unexpected result)." },
        { id: "e2q4", prompt: "Sales increased. ___, customer satisfaction improved.", options: ["Furthermore", "However", "Consequently"], correctIndex: 0, explanation: "Furthermore = adds another positive development." },
        { id: "e2q5", prompt: "She worked hard. ___, she was promoted. (cause → result)", options: ["Nevertheless", "As a result", "In contrast"], correctIndex: 1, explanation: "As a result = because of this (cause and effect)." },
        { id: "e2q6", prompt: "City life is fast and expensive. ___, rural life is calm and affordable.", options: ["In addition", "By contrast", "As a result"], correctIndex: 1, explanation: "By contrast = to compare two opposite situations." },
        { id: "e2q7", prompt: "He trains every day ___ improving his performance.", options: ["with a view to", "so that", "in order that"], correctIndex: 0, explanation: "with a view to + gerund = purpose (formal)." },
        { id: "e2q8", prompt: "___ the initial setbacks, the team delivered an excellent result.", options: ["Although", "Despite", "However"], correctIndex: 1, explanation: "Despite + noun phrase = concession." },
        { id: "e2q9", prompt: "The plan was rejected. ___, the team revised it and resubmitted.", options: ["Consequently", "Nevertheless", "Moreover"], correctIndex: 1, explanation: "Nevertheless = even so / despite that (unexpected positive response)." },
        { id: "e2q10", prompt: "The app is user-friendly. ___, it is very affordable. (add information)", options: ["In contrast", "What is more", "Consequently"], correctIndex: 1, explanation: "What is more = moreover / in addition (informal tone)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Formal vs informal; correct grammar",
      instructions: "Choose the correct option. Some questions test grammar (clause vs noun phrase). Others test register (formal vs informal).",
      questions: [
        { id: "e3q1", prompt: "Which is grammatically correct?", options: ["In spite of she was late, she got the job.", "In spite of being late, she got the job.", "In spite of she being late, she got the job."], correctIndex: 1, explanation: "In spite of + gerund or noun phrase. NOT followed by a subject+verb clause." },
        { id: "e3q2", prompt: "Which is grammatically correct?", options: ["Although the high cost, the project was approved.", "Although the project was expensive, it was approved.", "Although of the high cost, it was approved."], correctIndex: 1, explanation: "Although + subject + verb (clause). NOT followed by a noun phrase directly." },
        { id: "e3q3", prompt: "The most formal way to add a contrasting point:", options: ["But", "However", "Yet"], correctIndex: 1, explanation: "However = most formal contrast connector (used in formal writing). 'But' and 'Yet' are less formal." },
        { id: "e3q4", prompt: "Which is correct for purpose with a clause?", options: ["She trained hard in order to she could qualify.", "She trained hard so that she could qualify.", "She trained hard despite qualifying."], correctIndex: 1, explanation: "so that + subject + could/would = purpose clause." },
        { id: "e3q5", prompt: "What is the most formal equivalent of 'also'?", options: ["Plus", "Furthermore", "And also"], correctIndex: 1, explanation: "Furthermore = very formal addition marker, common in academic and business writing." },
        { id: "e3q6", prompt: "Which sentence is correct?", options: ["Despite of the noise, she slept well.", "Despite the noise, she slept well.", "Despite that the noise, she slept well."], correctIndex: 1, explanation: "Despite (NOT 'despite of') + noun/gerund." },
        { id: "e3q7", prompt: "He was injured. ___, he finished the race. (strongest surprise/determination)", options: ["However", "Nevertheless", "Even so"], correctIndex: 1, explanation: "Nevertheless = strongest, most formal concession. Even so = informal. However = neutral." },
        { id: "e3q8", prompt: "She didn't study. ___, she passed easily. (unexpected)", options: ["Therefore", "Nonetheless", "Consequently"], correctIndex: 1, explanation: "Nonetheless = despite the above (concession). Not a cause-effect connector." },
        { id: "e3q9", prompt: "The most formal way to say 'because of this':", options: ["so", "therefore", "hence"], correctIndex: 2, explanation: "Hence = very formal cause-result marker, common in academic texts." },
        { id: "e3q10", prompt: "Which is correct?", options: ["Consequently of the flood, the road was closed.", "As a result of the flood, the road was closed.", "Consequently the flood, the road was closed."], correctIndex: 1, explanation: "As a result of + noun phrase. 'Consequently' is followed by a comma and a clause, not a noun phrase." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Complete with one linking word or phrase",
      instructions: "Write the correct linking word or short phrase (1–4 words). Check grammar: clause vs noun/gerund after the linker.",
      questions: [
        { id: "e4q1", prompt: "___ the bad weather, the ceremony took place outdoors.", correct: "despite", explanation: "Despite + noun phrase (no clause). In spite of also accepted." },
        { id: "e4q2", prompt: "She studied medicine ___ she could help her community.", correct: "so that", explanation: "so that + subject + verb = purpose clause." },
        { id: "e4q3", prompt: "The results were impressive. ___, the board approved the budget.", correct: "consequently", explanation: "Consequently = as a result. Placed at the start of a new sentence." },
        { id: "e4q4", prompt: "He was not qualified. ___, he was given the job.", correct: "nevertheless", explanation: "Nevertheless = despite this (unexpected outcome). Nonetheless also accepted." },
        { id: "e4q5", prompt: "The company expanded rapidly. ___, it opened offices in three new countries.", correct: "moreover", explanation: "Moreover = in addition (adds further positive info). Furthermore also accepted." },
        { id: "e4q6", prompt: "___ she had very little experience, she performed brilliantly.", correct: "although", explanation: "Although + clause (subject + verb). Even though also accepted." },
        { id: "e4q7", prompt: "The new system is faster. ___, the old system was more reliable.", correct: "however", explanation: "However = contrast between two sentences." },
        { id: "e4q8", prompt: "He left early ___ missing the rush-hour traffic.", correct: "in order to avoid", explanation: "in order to avoid + gerund = purpose. (Or: so as to avoid)" },
        { id: "e4q9", prompt: "Profits fell sharply. ___, the CEO resigned.", correct: "as a result", explanation: "As a result = consequently. Followed by a comma and a clause." },
        { id: "e4q10", prompt: "The hotel was luxurious. ___, the service was outstanding.", correct: "what is more", explanation: "What is more = moreover / furthermore (informal-to-neutral addition). In addition also accepted." },
      ],
    },
  }), []);

  const current = sets[exNo];

  const { save } = useProgress();
  const isPro = useIsPro();

  async function handleDownloadPDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PDF_CONFIG); } catch (e) { console.error(e); } finally { setPdfLoading(false); }
  }

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

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, inputAnswers: {}, checked: false, exNo }); }
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, inputAnswers: {}, checked: false, exNo: n }); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Linking Words &amp; Discourse Markers</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Linking Words{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">&amp; Discourse Markers</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Linking words connect ideas and show the relationship between them: <b>contrast</b> (however, nevertheless), <b>addition</b> (moreover, furthermore), <b>result</b> (consequently, therefore), <b>concession</b> (despite, although), <b>purpose</b> (so that, in order to).
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-linking-words" subject="Linking Words" questions={SPEED_QUESTIONS} variant="sidebar" />
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
            <PDFButton onDownload={handleDownloadPDF} loading={pdfLoading} />
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
                  {current.type === "mcq" ? current.questions.map((q, idx) => {
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
                                  <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => { setMcqAnswers((p) => { const n = { ...p, [q.id]: oi }; broadcast({ answers: n, checked, exNo }); return n; }); }} />
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
                  }) : current.questions.map((q, idx) => {
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
                              <input value={val} disabled={checked} onChange={(e) => { const n = { ...inputAnswers, [q.id]: e.target.value }; setInputAnswers(n); broadcast({ answers: mcqAnswers, inputAnswers: n, checked, exNo }); }} placeholder="Type here…" className="w-full max-w-lg rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
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
                  })}
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button onClick={() => { setChecked(true); broadcast({ answers: mcqAnswers, inputAnswers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
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
                      <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}</div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b2" allLabel="All B2 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b2-linking-words" subject="Linking Words" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/quantifiers-advanced" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Quantifiers Advanced →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Linking Words &amp; Discourse Markers (B2)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { cat: "Contrast", words: "However, Nevertheless, Nonetheless, Even so, Yet", note: "+ sentence (after comma)" },
          { cat: "Concession (clause)", words: "Although, Even though, While, Whereas", note: "+ subject + verb" },
          { cat: "Concession (noun/gerund)", words: "Despite, In spite of", note: "+ noun or gerund (NOT + clause)" },
          { cat: "Addition", words: "Moreover, Furthermore, In addition, What is more, Besides", note: "+ sentence" },
          { cat: "Result / Consequence", words: "Therefore, Consequently, As a result, Hence, Thus", note: "+ sentence" },
          { cat: "Purpose (clause)", words: "So that, In order that", note: "+ subject + can/could/would" },
          { cat: "Purpose (infinitive)", words: "In order to, So as to, With a view to (+ gerund)", note: "+ infinitive / gerund" },
          { cat: "Comparison / Contrast", words: "By contrast, In comparison, On the other hand", note: "+ sentence" },
        ].map(({ cat, words, note }) => (
          <div key={cat} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-orange-700 text-sm">{cat}</span>
              <span className="text-xs text-slate-500">{note}</span>
            </div>
            <div className="text-slate-700 text-sm">{words}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800 space-y-1">
          <div><span className="font-black">Key grammar traps:</span></div>
          <div><span className="font-black">Despite / In spite of</span> → + noun/gerund: <i>Despite the rain.</i> NOT <i>Despite it rained.</i></div>
          <div><span className="font-black">Although / Even though</span> → + clause: <i>Although it rained.</i> NOT <i>Although the rain.</i></div>
          <div><span className="font-black">However</span> → connects two sentences (with a comma), NOT two clauses in one sentence.</div>
        </div>
      </div>
    </div>
  );
}
