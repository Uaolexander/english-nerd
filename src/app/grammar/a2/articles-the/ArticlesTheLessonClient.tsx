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

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "I saw ___ cat (first mention)", options: ["the", "an", "a", "—"], answer: 2 },
  { q: "___ cat was black (second mention)", options: ["A", "An", "—", "The"], answer: 3 },
  { q: "She is ___ engineer", options: ["a", "the", "—", "an"], answer: 3 },
  { q: "She is ___ honest person", options: ["a", "an", "the", "—"], answer: 1 },
  { q: "___ dogs are loyal (general)", options: ["The", "A", "—", "An"], answer: 2 },
  { q: "We visited ___ Eiffel Tower", options: ["a", "an", "—", "the"], answer: 3 },
  { q: "She plays ___ violin", options: ["a", "an", "—", "the"], answer: 3 },
  { q: "I don't eat ___ meat (general)", options: ["a", "the", "an", "—"], answer: 3 },
  { q: "They live in ___ France", options: ["a", "the", "an", "—"], answer: 3 },
  { q: "I need ___ umbrella", options: ["a", "the", "—", "an"], answer: 3 },
  { q: "Can you pass ___ salt, please?", options: ["a", "an", "—", "the"], answer: 3 },
  { q: "___ Amazon is the longest river", options: ["A", "An", "The", "—"], answer: 2 },
  { q: "___ love is important (abstract)", options: ["The", "A", "An", "—"], answer: 3 },
  { q: "She is ___ best student (superlative)", options: ["a", "an", "—", "the"], answer: 3 },
  { q: "He went to ___ school (institution)", options: ["a", "the", "an", "—"], answer: 3 },
  { q: "Do you play ___ chess?", options: ["a", "the", "an", "—"], answer: 3 },
  { q: "They live in ___ United Kingdom", options: ["a", "an", "—", "the"], answer: 3 },
  { q: "___ sun rises in the east", options: ["A", "An", "—", "The"], answer: 3 },
  { q: "___ happiness cannot be bought", options: ["The", "A", "An", "—"], answer: 3 },
  { q: "She plays ___ piano every evening", options: ["a", "an", "—", "the"], answer: 3 },
];

export default function ArticlesTheLessonClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose a, an, the or — (no article)",
      instructions: "Choose the correct article. Select '—' when no article is needed.",
      questions: [
        { id: "e1q1", prompt: "I saw ___ cat in the garden.", options: ["a", "an", "the", "—"], correctIndex: 0, explanation: "'A' — first mention of a singular countable noun." },
        { id: "e1q2", prompt: "___ cat was black and white.", options: ["A", "An", "The", "—"], correctIndex: 2, explanation: "'The' — second mention (we already know which cat)." },
        { id: "e1q3", prompt: "She is ___ engineer.", options: ["a", "an", "the", "—"], correctIndex: 1, explanation: "'An' — 'engineer' starts with a vowel sound /ɛ/, so we use 'an': an engineer." },
        { id: "e1q4", prompt: "She is ___ honest person.", options: ["a", "an", "the", "—"], correctIndex: 1, explanation: "'An' — 'honest' starts with a silent h, so the vowel sound /ɒ/ follows. an honest person." },
        { id: "e1q5", prompt: "___ dogs are loyal animals.", options: ["A", "The", "—", "An"], correctIndex: 2, explanation: "No article — general statement about all dogs. Plural nouns in general statements take no article." },
        { id: "e1q6", prompt: "We visited ___ Eiffel Tower.", options: ["a", "an", "the", "—"], correctIndex: 2, explanation: "'The' — unique, one-of-a-kind landmarks always take 'the'." },
        { id: "e1q7", prompt: "She plays ___ violin beautifully.", options: ["a", "an", "the", "—"], correctIndex: 2, explanation: "'The' — musical instruments always use 'the': play the piano, the guitar, the violin." },
        { id: "e1q8", prompt: "I don't eat ___ meat.", options: ["a", "the", "—", "an"], correctIndex: 2, explanation: "No article — 'meat' is uncountable in a general statement." },
        { id: "e1q9", prompt: "They live in ___ France.", options: ["a", "the", "—", "an"], correctIndex: 2, explanation: "No article — most countries take no article. Exception: the USA, the UK, the Netherlands." },
        { id: "e1q10", prompt: "I need ___ umbrella — it's raining.", options: ["a", "an", "the", "—"], correctIndex: 1, explanation: "'An' — umbrella starts with a vowel sound /ʌ/. First mention." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — A, an, the or — in context",
      instructions: "Choose the correct article for each gap. Think carefully about context.",
      questions: [
        { id: "e2q1", prompt: "Can you pass ___ salt, please?", options: ["a", "the", "—", "an"], correctIndex: 1, explanation: "'The' — specific item on the table we can both see." },
        { id: "e2q2", prompt: "She works as ___ nurse at the local hospital.", options: ["a", "an", "the", "—"], correctIndex: 0, explanation: "'A' — profession, singular countable. 'nurse' starts with consonant /n/." },
        { id: "e2q3", prompt: "___ Amazon is the longest river in South America.", options: ["A", "The", "—", "An"], correctIndex: 1, explanation: "'The' — rivers always take 'the': the Thames, the Nile, the Amazon." },
        { id: "e2q4", prompt: "___ love is the most important thing in life.", options: ["A", "The", "—", "An"], correctIndex: 2, explanation: "No article — abstract nouns in general statements: love, happiness, freedom." },
        { id: "e2q5", prompt: "She is ___ best student in the class.", options: ["a", "the", "—", "an"], correctIndex: 1, explanation: "'The' — superlatives always use 'the': the best, the biggest, the most popular." },
        { id: "e2q6", prompt: "He went to ___ school by bus.", options: ["a", "the", "—", "an"], correctIndex: 2, explanation: "No article — 'go to school/work/hospital/church' as institutions, not specific buildings." },
        { id: "e2q7", prompt: "I'll have ___ sandwich and ___ orange juice.", options: ["a / an", "a / a", "the / the", "an / an"], correctIndex: 0, explanation: "'A sandwich' (consonant sound) + 'an orange juice' (vowel sound /ɒ/)." },
        { id: "e2q8", prompt: "Do you play ___ chess?", options: ["a", "the", "—", "an"], correctIndex: 2, explanation: "No article — sports and games: play chess, play football, play tennis." },
        { id: "e2q9", prompt: "They live in ___ United Kingdom.", options: ["a", "the", "—", "an"], correctIndex: 1, explanation: "'The' — some countries need 'the': the USA, the UK, the Netherlands, the Philippines." },
        { id: "e2q10", prompt: "I saw ___ amazing film last night. ___ film was about space.", options: ["an / The", "a / The", "the / A", "an / A"], correctIndex: 0, explanation: "'An amazing film' (first mention, vowel sound) + 'The film' (second mention)." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the correct article",
      instructions: "Type the correct article: a, an, the — or a single dash — for no article.",
      questions: [
        { id: "e3q1", prompt: "He wants to be ___ architect.", correct: "an", explanation: "'An' — architect starts with vowel sound /ɑː/." },
        { id: "e3q2", prompt: "___ Pacific Ocean is the largest ocean on Earth.", correct: "the", explanation: "'The' — oceans, seas, and rivers always take 'the'." },
        { id: "e3q3", prompt: "I read ___ interesting article this morning.", correct: "an", explanation: "'An' — first mention, vowel sound /ɪ/." },
        { id: "e3q4", prompt: "___ water boils at 100 degrees Celsius.", correct: "—", explanation: "No article — uncountable noun in a scientific/general statement." },
        { id: "e3q5", prompt: "She bought ___ new dress for the wedding.", correct: "a", explanation: "'A' — first mention, singular countable noun." },
        { id: "e3q6", prompt: "We watched ___ sunset from the rooftop.", correct: "the", explanation: "'The' — there is only one sunset (unique in context)." },
        { id: "e3q7", prompt: "___ Mount Fuji is in Japan.", correct: "—", explanation: "No article — most mountains take no article. Exception: the Alps, the Andes (mountain ranges)." },
        { id: "e3q8", prompt: "He is ___ only person I trust.", correct: "the", explanation: "'The' — 'only' makes it unique/specific." },
        { id: "e3q9", prompt: "___ happiness cannot be bought.", correct: "—", explanation: "No article — abstract noun in a general statement." },
        { id: "e3q10", prompt: "She plays ___ piano every evening.", correct: "the", explanation: "'The' — musical instruments always take 'the'." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Articles in longer context",
      instructions: "Type a, an, the or — (dash for zero article) for each blank.",
      questions: [
        { id: "e4q1", prompt: "I'd like ___ coffee with ___ milk, please.", correct: "a / —", explanation: "'A coffee' (one cup, countable) + no article before uncountable 'milk' in general use." },
        { id: "e4q2", prompt: "She studies at ___ Oxford University.", correct: "—", explanation: "No article — named universities, schools and colleges generally take no article." },
        { id: "e4q3", prompt: "___ sun rises in the east.", correct: "the", explanation: "'The sun' — unique celestial body. Also: the moon, the earth (as planet)." },
        { id: "e4q4", prompt: "He is ___ tallest boy in the class.", correct: "the", explanation: "'The' — superlative always requires 'the'." },
        { id: "e4q5", prompt: "There's ___ spider in the bath!", correct: "a", explanation: "'A' — first mention, singular countable, indefinite." },
        { id: "e4q6", prompt: "We go to ___ church on Sundays.", correct: "—", explanation: "No article — go to church/school/hospital/work = the institution, not the building." },
        { id: "e4q7", prompt: "That was ___ worst meal I've ever had.", correct: "the", explanation: "'The' — superlative (the worst)." },
        { id: "e4q8", prompt: "___ life is short — enjoy it!", correct: "—", explanation: "No article — abstract noun / philosophical general statement." },
        { id: "e4q9", prompt: "Can you turn off ___ TV? I'm trying to sleep.", correct: "the", explanation: "'The TV' — specific, the one we both know about in this room." },
        { id: "e4q10", prompt: "She gave me ___ advice that changed my life.", correct: "—", explanation: "No article — 'advice' is uncountable. You cannot say 'an advice'." },
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

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Articles: a / an / the",
        subtitle: "Definite, indefinite & zero article — 4 exercises + answer key",
        level: "A2",
        keyRule: "a/an = first mention or indefinite. the = specific or unique. No article = general or abstract.",
        exercises: [
          { number: 1, title: "Exercise 1", difficulty: "Easy", instruction: "Choose a, an, the or — (no article).", hint: "a / an / the / —", questions: [
            "I saw ___ cat in the garden.",
            "___ cat was black and white.",
            "She is ___ engineer.",
            "She is ___ honest person.",
            "___ dogs are loyal animals.",
            "We visited ___ Eiffel Tower.",
            "She plays ___ violin beautifully.",
            "I don't eat ___ meat.",
            "They live in ___ France.",
            "I need ___ umbrella — it's raining.",
          ]},
          { number: 2, title: "Exercise 2", difficulty: "Medium", instruction: "Choose a, an, the or — in context.", hint: "a / an / the / —", questions: [
            "Can you pass ___ salt, please?",
            "She works as ___ nurse at the local hospital.",
            "___ Amazon is the longest river in South America.",
            "___ love is the most important thing in life.",
            "She is ___ best student in the class.",
            "He went to ___ school by bus.",
            "I'll have ___ sandwich and ___ orange juice.",
            "Do you play ___ chess?",
            "They live in ___ United Kingdom.",
            "I saw ___ amazing film last night. ___ film was about space.",
          ]},
          { number: 3, title: "Exercise 3", difficulty: "Hard", instruction: "Write the correct article: a, an, the — or a dash for no article.", questions: [
            "He wants to be ___ architect.",
            "___ Pacific Ocean is the largest ocean on Earth.",
            "I read ___ interesting article this morning.",
            "___ water boils at 100 degrees Celsius.",
            "She bought ___ new dress for the wedding.",
            "We watched ___ sunset from the rooftop.",
            "___ Mount Fuji is in Japan.",
            "He is ___ only person I trust.",
            "___ happiness cannot be bought.",
            "She plays ___ piano every evening.",
          ]},
          { number: 4, title: "Exercise 4", difficulty: "Harder", instruction: "Write a, an, the or — for each blank.", questions: [
            "I'd like ___ coffee with ___ milk, please.",
            "She studies at ___ Oxford University.",
            "___ sun rises in the east.",
            "He is ___ tallest boy in the class.",
            "There's ___ spider in the bath!",
            "We go to ___ church on Sundays.",
            "That was ___ worst meal I've ever had.",
            "___ life is short — enjoy it!",
            "Can you turn off ___ TV?",
            "She gave me ___ advice that changed my life.",
          ]},
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — basic articles", answers: ["a","the","an","an","—","the","the","—","—","an"] },
          { exercise: 2, subtitle: "Medium — articles in context", answers: ["the","a","the","—","the","—","a / an","—","the","an / The"] },
          { exercise: 3, subtitle: "Hard — write the article", answers: ["an","the","an","—","a","the","—","the","—","the"] },
          { exercise: 4, subtitle: "Harder — longer context", answers: ["a / —","—","the","the","a","—","the","—","the","—"] },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Articles: a / an / the</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Articles{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">a / an / the / zero</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Articles tell us whether a noun is <b>specific or general, known or unknown</b>. English has three articles — <b>a, an, the</b> — and a <b>zero article</b> (no article) for general and abstract meanings.
      </p>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a2-articles-the" subject="Articles: a / an / the" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))} />
                                    <span className="font-bold text-slate-900">{opt}</span>
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
                                <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder='Type a / an / the / — …' className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
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
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Recommended</div>
              <div className="space-y-2">
                <a href="/grammar/a2" className="flex items-center gap-3 rounded-xl p-2 hover:bg-black/5 transition">
                  <span className="text-lg">📚</span>
                  <div><div className="text-sm font-bold text-slate-900">All A2 Lessons</div><div className="text-xs text-slate-500">Complete the level</div></div>
                </a>
                <a href="/grammar/b1" className="flex items-center gap-3 rounded-xl p-2 hover:bg-black/5 transition">
                  <span className="text-lg">🚀</span>
                  <div><div className="text-sm font-bold text-slate-900">B1 Grammar</div><div className="text-xs text-slate-500">Next level up</div></div>
                </a>
                <a href="/tenses/present-simple" className="flex items-center gap-3 rounded-xl p-2 hover:bg-black/5 transition">
                  <span className="text-lg">⏰</span>
                  <div><div className="text-sm font-bold text-slate-900">Present Simple</div><div className="text-xs text-slate-500">Essential tense</div></div>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-light" />
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/object-pronouns" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Object pronouns →</a>
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">The Definite Article — the</h2>
        <p className="text-slate-500 text-sm">Used for specific, known, or unique things that both speaker and listener can identify.</p>
      </div>

      {/* 4 use-case cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700 mb-2">🔁 Already Mentioned</div>
          <p className="text-xs text-slate-500 mb-3">Use <strong>the</strong> when the listener already knows which one.</p>
          <div className="space-y-2">
            <Ex en="I saw a dog. The dog was barking." />
            <Ex en="She bought a coat. The coat was red." />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-sky-700 mb-2">🌍 Unique Things</div>
          <p className="text-xs text-slate-500 mb-3">Only one exists in the world.</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["the sun","the moon","the Earth","the internet","the sky"].map(t => (
              <span key={t} className="rounded-lg px-2.5 py-1 text-xs font-black border bg-sky-100 text-sky-800 border-sky-200">{t}</span>
            ))}
          </div>
          <Ex en="The sun rises in the east." />
        </div>
        <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-violet-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-violet-700 mb-2">🏆 Superlatives</div>
          <p className="text-xs text-slate-500 mb-3">Always use <strong>the</strong> before superlatives.</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["the best","the tallest","the most expensive","the worst"].map(t => (
              <span key={t} className="rounded-lg px-2.5 py-1 text-xs font-black border bg-violet-100 text-violet-800 border-violet-200">{t}</span>
            ))}
          </div>
          <Ex en="She is the best student in the class." />
        </div>
        <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-b from-orange-50 to-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-orange-700 mb-2">🏛 Specific Places & Groups</div>
          <p className="text-xs text-slate-500 mb-3">Institutions and shared public places.</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["the police","the cinema","the bank","the hospital"].map(t => (
              <span key={t} className="rounded-lg px-2.5 py-1 text-xs font-black border bg-orange-100 text-orange-800 border-orange-200">{t}</span>
            ))}
          </div>
          <Ex en="I went to the cinema last night." />
        </div>
      </div>

      {/* When NOT to use the */}
      <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
        <div className="text-xs font-black uppercase tracking-wide text-red-600 mb-3">🚫 When NOT to Use "the"</div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {["languages","meals","sports","most countries","proper names"].map(t => (
            <span key={t} className="rounded-lg px-2.5 py-1 text-xs font-black border bg-red-100 text-red-800 border-red-200">{t}</span>
          ))}
        </div>
        <div className="space-y-2">
          <Ex en="She speaks English." />
          <Ex en="We had breakfast at 8." />
          <Ex en="He plays football every day." />
          <Ex en="She speaks the English." correct={false} />
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</div>
          <span className="font-bold text-slate-800">With "the" vs Without "the"</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs font-bold text-emerald-700 mb-2">WITH "the"</div>
            <div className="space-y-1 text-sm text-slate-700">
              {["the United States","the UK","the Netherlands","the Amazon (river)","the Pacific (ocean)","the Eiffel Tower"].map(r => (
                <div key={r} className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5 font-medium">{r}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 mb-2">WITHOUT "the"</div>
            <div className="space-y-1 text-sm text-slate-700">
              {["France, Japan, Ukraine","breakfast, lunch, dinner","English, Spanish, French","Mount Everest","football, tennis","school, work, bed"].map(r => (
                <div key={r} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5">{r}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> No "the" before most countries — but exceptions exist: <strong>the United States, the UK, the Netherlands, the Philippines</strong>. These are plural or contain a common noun (kingdom, states).
      </div>
    </div>
  );
}
