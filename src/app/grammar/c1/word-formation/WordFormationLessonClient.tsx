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

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Nominalisation", href: "/grammar/c1/nominalisation", level: "C1", badge: "bg-sky-600", reason: "Nominalisation relies directly on word formation skills" },
  { title: "Advanced Discourse Markers", href: "/grammar/c1/advanced-discourse-markers", level: "C1", badge: "bg-sky-600" },
  { title: "Complex Noun Phrases", href: "/grammar/c1/complex-noun-phrases", level: "C1", badge: "bg-sky-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "'happy' → opposite with un-:", options: ["unhappy", "dishappy", "inhappy", "mishappy"], answer: 0 },
  { q: "'honest' → opposite with dis-:", options: ["dishonest", "unhonest", "inhonest", "mishonest"], answer: 0 },
  { q: "'possible' → opposite:", options: ["impossible", "unpossible", "dispossible", "nonpossible"], answer: 0 },
  { q: "'legal' → opposite:", options: ["illegal", "unlegal", "nonlegal", "dislegal"], answer: 0 },
  { q: "'regular' → opposite:", options: ["irregular", "unregular", "disregular", "nonregular"], answer: 0 },
  { q: "'over' + estimate =", options: ["overestimate", "overestimation", "overestimated", "overly"], answer: 0 },
  { q: "Suffix -ful means:", options: ["Full of", "Without", "Too much", "Before"], answer: 0 },
  { q: "Suffix -less means:", options: ["Without", "Full of", "Too much", "Again"], answer: 0 },
  { q: "'care' + -less =", options: ["careless", "carefull", "uncaring", "carely"], answer: 0 },
  { q: "'use' + -ful =", options: ["useful", "useless", "useable", "userful"], answer: 0 },
  { q: "Prefix mis- means:", options: ["Wrongly/badly", "Not", "Too much", "Again"], answer: 0 },
  { q: "Prefix re- means:", options: ["Again", "Not", "Too much", "Wrongly"], answer: 0 },
  { q: "Prefix pre- means:", options: ["Before", "After", "Again", "Not"], answer: 0 },
  { q: "Prefix post- means:", options: ["After", "Before", "Again", "Not"], answer: 0 },
  { q: "Suffix -ise/-ize creates:", options: ["Verbs", "Nouns", "Adjectives", "Adverbs"], answer: 0 },
  { q: "Suffix -tion creates:", options: ["Nouns", "Verbs", "Adjectives", "Adverbs"], answer: 0 },
  { q: "Suffix -ous creates:", options: ["Adjectives", "Nouns", "Verbs", "Adverbs"], answer: 0 },
  { q: "'courage' + -ous =", options: ["courageous", "couragy", "courageful", "couragy"], answer: 0 },
  { q: "'under' + estimate =", options: ["underestimate", "underestimation", "undervalue", "subvalue"], answer: 0 },
  { q: "'interpret' + mis- =", options: ["misinterpret", "disinterpret", "uninterpret", "noninterpret"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Word Formation",
  subtitle: "Prefixes, suffixes, and word building at C1",
  level: "C1",
  keyRule: "Prefixes change meaning; suffixes change word class.",
  exercises: [
    {
      number: 1,
      title: "Negative Prefixes",
      difficulty: "Easy",
      instruction: "Add the correct negative prefix.",
      questions: [
        "___ + happy = unhappy",
        "___ + honest = dishonest",
        "___ + possible = impossible",
        "___ + legal = illegal",
        "___ + regular = irregular",
        "___ + responsible = irresponsible",
        "___ + agree = disagree",
        "___ + accurate = inaccurate",
        "___ + moral = immoral",
        "___ + logical = illogical",
      ],
      hint: "un- / dis- / im- / il- / ir-",
    },
    {
      number: 2,
      title: "Suffixes: -ful / -less / -ous",
      difficulty: "Medium",
      instruction: "Add the correct suffix to form an adjective.",
      questions: [
        "care + ___ = careless",
        "use + ___ = useful",
        "hope + ___ = hopeless",
        "courage + ___ = courageous",
        "harm + ___ = harmless",
        "beauty + ___ = beautiful",
        "danger + ___ = dangerous",
        "home + ___ = homeless",
        "wonder + ___ = wonderful",
        "mystery + ___ = mysterious",
      ],
      hint: "-less / -ful / -ous",
    },
    {
      number: 3,
      title: "Prefixes: over- / under- / mis- / re-",
      difficulty: "Hard",
      instruction: "Add the correct prefix.",
      questions: [
        "___ + estimate (too high) = ___",
        "___ + estimate (too low) = ___",
        "___ + interpret (wrongly) = ___",
        "___ + write (again) = ___",
        "___ + work (too much) = ___",
        "___ + understand (wrongly) = ___",
        "___ + use (wrongly) = ___",
        "___ + pay (too little) = ___",
        "___ + read (again) = ___",
        "___ + judge (wrongly) = ___",
      ],
      hint: "over- / under- / mis- / re-",
    },
    {
      number: 4,
      title: "Form the Correct Word",
      difficulty: "Very Hard",
      instruction: "Use the base word to form the correct part of speech.",
      questions: [
        "DECIDE: The ___ was final.",
        "ACHIEVE: Her ___ was remarkable.",
        "DEVELOP: Rapid ___ was noted.",
        "ANALYSE: The ___ was thorough.",
        "IMPROVE: The ___ was clear.",
        "COMPETE: They faced ___ challenges.",
        "INNOVATE: Their ___ inspired.",
        "ORGANISE: The ___ was poor.",
        "COURAGE: She showed great ___.",
        "MYSTERY: He behaved ___.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Negative Prefixes", answers: ["un-", "dis-", "im-", "il-", "ir-", "ir-", "dis-", "in-", "im-", "il-"] },
    { exercise: 2, subtitle: "Suffixes: -ful / -less / -ous", answers: ["-less", "-ful", "-less", "-ous", "-less", "-ful", "-ous", "-less", "-ful", "-ous"] },
    { exercise: 3, subtitle: "Prefixes: over- / under- / mis- / re-", answers: ["overestimate", "underestimate", "misinterpret", "rewrite", "overwork", "misunderstand", "misuse", "underpay", "reread", "misjudge"] },
    { exercise: 4, subtitle: "Form the Correct Word", answers: ["decision", "achievement", "development", "analysis", "improvement", "competitive", "innovation", "organisation", "courage", "mysteriously"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function WordFormationLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const { isLive, broadcast } = useLiveSync((payload) => {
    setMcqAnswers(payload.answers as Record<string, number | null>);
    setInputAnswers((payload as unknown as { inputAnswers: Record<string, string> }).inputAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Prefixes: meaning and form",
      instructions: "Prefixes change meaning without changing the word class. Common C1 prefixes: mis- (wrongly), over- (too much), under- (too little), re- (again), dis- (not/reverse), out- (surpass). Choose the correct prefixed form.",
      questions: [
        { id: "e1q1", prompt: "The project was ___managed — nobody knew who was responsible for what.", options: ["mismanaged", "unmanaged", "dismanaged"], correctIndex: 0, explanation: "mis- = done wrongly/badly: mismanaged (managed badly)." },
        { id: "e1q2", prompt: "She felt the committee had ___ the importance of the environmental impact.", options: ["underestimated", "misestimated", "overestimated"], correctIndex: 0, explanation: "under- = too little: underestimated (estimated less than the actual importance)." },
        { id: "e1q3", prompt: "Staff are consistently ___ — they work long hours for very little pay.", options: ["overpaid", "underpaid", "mispaid"], correctIndex: 1, explanation: "under- = too little: underpaid (paid less than deserved)." },
        { id: "e1q4", prompt: "The contract will need to be ___ before it can be signed.", options: ["redrafted", "misdrafted", "underdrafted"], correctIndex: 0, explanation: "re- = again: redrafted (drafted again)." },
        { id: "e1q5", prompt: "His qualifications were ___looked during the hiring process.", options: ["overlooked", "overlooked", "underlook"], correctIndex: 0, explanation: "overlooked = failed to notice (over- here means 'past/beyond', not 'too much')." },
        { id: "e1q6", prompt: "The report ___ the long-term risks of the strategy.", options: ["downplayed", "underplayed", "Both are correct"], correctIndex: 2, explanation: "Both downplay and underplay mean to minimise the significance of something." },
        { id: "e1q7", prompt: "Several key witnesses ___ the timeline of events.", options: ["misremembered", "unremembered", "disremembered"], correctIndex: 0, explanation: "mis- = incorrectly: misremembered (remembered incorrectly)." },
        { id: "e1q8", prompt: "The government was accused of ___ the severity of the crisis.", options: ["underreporting", "misreporting", "Both are correct"], correctIndex: 2, explanation: "Both are correct: underreporting (reporting less than actual) and misreporting (reporting inaccurately) overlap here." },
        { id: "e1q9", prompt: "Many young employees feel they are ___ in their current roles.", options: ["underutilised", "misutilised", "oututilised"], correctIndex: 0, explanation: "under- = too little: underutilised (their skills are not used enough)." },
        { id: "e1q10", prompt: "The new model ___ its rivals in terms of fuel efficiency.", options: ["outperforms", "overperforms", "misperforms"], correctIndex: 0, explanation: "out- = surpasses: outperforms (does better than) rivals." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Suffixes: forming nouns, adjectives, verbs",
      instructions: "Suffixes change the word class. Key patterns: verb → noun (-tion/-sion, -ment, -al, -ance/-ence), adjective → noun (-ity, -ness, -cy), noun/verb → adjective (-ous, -ive, -al, -ful, -less), noun/adjective → verb (-ify, -ise/-ize, -en). Choose the correct derived form.",
      questions: [
        { id: "e2q1", prompt: "The ___ of the new regulation has been widely praised. (implement)", options: ["implementation", "implementment", "implementing"], correctIndex: 0, explanation: "implement → implementation (verb → noun, -ation suffix)." },
        { id: "e2q2", prompt: "The findings cast doubt on the ___ of the current approach. (effect)", options: ["effectivity", "effectiveness", "effection"], correctIndex: 1, explanation: "effective → effectiveness (adjective → noun, -ness suffix). 'Effectivity' is non-standard." },
        { id: "e2q3", prompt: "The committee was unable to reach a ___ on the matter. (conclude)", options: ["conclusion", "conclusment", "conclusity"], correctIndex: 0, explanation: "conclude → conclusion (-sion suffix)." },
        { id: "e2q4", prompt: "The plan was criticised for its ___ — it couldn't be practically applied. (impractical)", options: ["impracticality", "impracticalness", "Both are correct"], correctIndex: 0, explanation: "'Impracticality' is the standard form. '-ness' is possible but less common for adjectives ending in '-al'." },
        { id: "e2q5", prompt: "She was praised for the ___ of her argument. (coherent)", options: ["coherency", "coherence", "Both are correct"], correctIndex: 2, explanation: "Both coherence and coherency are acceptable noun forms of coherent, though coherence is more common." },
        { id: "e2q6", prompt: "The new software aims to ___ the process. (simple)", options: ["simplify", "simplise", "simplefy"], correctIndex: 0, explanation: "simple → simplify (adjective → verb, -ify suffix)." },
        { id: "e2q7", prompt: "The situation is highly ___ and could change rapidly. (fluid)", options: ["fluidic", "fluidity", "fluid"], correctIndex: 2, explanation: "fluid is already an adjective: 'highly fluid situation'. No suffix needed; 'fluidity' is the noun form." },
        { id: "e2q8", prompt: "The evidence was ___. Nothing could be proven either way. (conclude)", options: ["inconclusive", "unconcluding", "inconcluding"], correctIndex: 0, explanation: "inconclusive = adjective (not able to produce a conclusion). in- (negative) + conclude → conclusive → inconclusive." },
        { id: "e2q9", prompt: "There is a need to ___ the regulations across all member states. (harm → standard)", options: ["harmonise", "harmonify", "harmonite"], correctIndex: 0, explanation: "harmonise (or harmonize) = verb formed from harmony + -ise." },
        { id: "e2q10", prompt: "The ___ of remote work has transformed how companies operate. (prevalent)", options: ["prevalence", "prevalency", "prevalentness"], correctIndex: 0, explanation: "prevalent → prevalence (adjective → noun, -ence suffix)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Word families & negative prefixes",
      instructions: "Negative prefixes: un- (most common), in-/im-/il-/ir- (before certain letters), dis-, non-, a-. Many words have only one acceptable form — others allow two. Choose the correct negative or word-family form.",
      questions: [
        { id: "e3q1", prompt: "The decision seemed completely ___. Nobody could explain the logic. (rational)", options: ["irrational", "unrational", "disrational"], correctIndex: 0, explanation: "ir- is used before roots beginning with 'r': irrational. 'Unrational' is non-standard." },
        { id: "e3q2", prompt: "His behaviour was described as ___. (responsible)", options: ["irresponsible", "unresponsible", "disresponsible"], correctIndex: 0, explanation: "ir- before 'r': irresponsible. 'Unresponsible' does not exist." },
        { id: "e3q3", prompt: "The figures in the report were ___. (accurate)", options: ["inaccurate", "unaccurate", "disaccurate"], correctIndex: 0, explanation: "in- before roots beginning with vowels (commonly): inaccurate. 'Unaccurate' is non-standard." },
        { id: "e3q4", prompt: "The two sides held fundamentally ___ views. (compatible)", options: ["incompatible", "uncompatible", "discompatible"], correctIndex: 0, explanation: "in- before 'c': incompatible." },
        { id: "e3q5", prompt: "The project was deemed ___. (legal)", options: ["illegal", "unlegal", "nonlegal"], correctIndex: 0, explanation: "il- before 'l': illegal. 'Unlegal' does not exist." },
        { id: "e3q6", prompt: "The instructions were ___. Nobody could understand them. (legible)", options: ["illegible", "unlegible", "nonlegible"], correctIndex: 0, explanation: "il- before 'l': illegible." },
        { id: "e3q7", prompt: "The policy was criticised as ___. (logical)", options: ["illogical", "unlogical", "dislogical"], correctIndex: 0, explanation: "il- before 'l': illogical." },
        { id: "e3q8", prompt: "She remained ___ in her support for the proposal. (unwavering)", options: ["unwavering", "nonwavering", "diswaveringly"], correctIndex: 0, explanation: "unwavering is the standard adjective. un- before verbs/adjectives in this pattern." },
        { id: "e3q9", prompt: "The contract included a ___ clause. (standard)", options: ["non-standard", "unstandard", "instandard"], correctIndex: 0, explanation: "non- is used for technical/formal negation, especially with nouns and compound adjectives: non-standard." },
        { id: "e3q10", prompt: "The merger was described as ___. (precedent)", options: ["unprecedented", "unprecedent", "nonprecedented"], correctIndex: 0, explanation: "unprecedented is the correct form (un- + precedented). 'Unprecedent' is not an adjective; 'nonprecedented' is non-standard." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Form the correct word",
      instructions: "Use the base word in brackets to form the correct word for each gap. Write only the missing word (lowercase).",
      questions: [
        { id: "e4q1", prompt: "The ___ of the experiment was questioned by several reviewers. (valid)", correct: "validity", explanation: "valid (adj) → validity (noun, -ity suffix)." },
        { id: "e4q2", prompt: "Her ___ to detail is what makes her an exceptional editor. (attentive)", correct: "attention", explanation: "attentive → attention (noun form of the attent- root; or: attend → attention)." },
        { id: "e4q3", prompt: "The situation calls for immediate ___. (act)", correct: "action", explanation: "act → action (verb → noun, -ion suffix)." },
        { id: "e4q4", prompt: "The committee was split, reflecting a deep ___ within the party. (divide)", correct: "division", explanation: "divide → division (verb → noun, -sion suffix)." },
        { id: "e4q5", prompt: "The results were largely ___. Further trials are needed. (conclude)", correct: "inconclusive", explanation: "in- + conclude → conclusive → inconclusive (negative adjective)." },
        { id: "e4q6", prompt: "Her presentation lacked ___. The arguments were not well connected. (coherent)", correct: "coherence", explanation: "coherent → coherence (adjective → noun, -ence suffix)." },
        { id: "e4q7", prompt: "The government plans to ___ the tax system. (simple)", correct: "simplify", explanation: "simple → simplify (adjective → verb, -ify suffix)." },
        { id: "e4q8", prompt: "The report highlighted widespread ___ of public funds. (misuse)", correct: "misuse", explanation: "misuse (noun) = use of public funds in the wrong way; mis- prefix already present." },
        { id: "e4q9", prompt: "Many employees feel ___ in their current positions. (value)", correct: "undervalued", explanation: "under- + value → undervalued (past participle used as adjective: not valued enough)." },
        { id: "e4q10", prompt: "The ___ of the new guidelines has been delayed. (implement)", correct: "implementation", explanation: "implement → implementation (verb → noun, -ation suffix)." },
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

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Word Formation</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Word{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Formation</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Word formation creates new words from existing ones using <b>prefixes</b> (mis-, over-, under-, re-, out-, il-, ir-), <b>suffixes</b> (-tion, -ity, -ness, -ous, -ify, -ise), and <b>conversion</b> (using a word in a different class without changing its form). Mastering word families is essential for C1 vocabulary range and accuracy.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-c1-word-formation" subject="Word Formation" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                              <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-lg rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
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
                      <button onClick={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/c1" allLabel="All C1 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-c1-word-formation" subject="Word Formation" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/advanced-discourse-markers" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Advanced Discourse Markers →</a>
      </div>
    </div>
  );
}

function Explanation() {
  const prefixes = [
    { prefix: "mis-", meaning: "wrongly / badly", ex: "mismanage, misinterpret, mislead, misuse" },
    { prefix: "over-", meaning: "too much / beyond", ex: "overestimate, overlook, overreact, overpay" },
    { prefix: "under-", meaning: "too little / below", ex: "underestimate, underpay, undermine, understate" },
    { prefix: "re-", meaning: "again", ex: "redraft, reconsider, restructure, renegotiate" },
    { prefix: "out-", meaning: "surpass / beyond", ex: "outperform, outnumber, outlast, outweigh" },
    { prefix: "dis-", meaning: "not / reverse", ex: "disagree, discourage, disregard, discredit" },
    { prefix: "un-", meaning: "not (most common)", ex: "unprecedented, unwavering, unresolved, undo" },
    { prefix: "in-/im-/il-/ir-", meaning: "not (before specific letters)", ex: "inaccurate, impossible, illegal, irrational" },
    { prefix: "non-", meaning: "not (technical/neutral)", ex: "non-standard, non-renewable, non-compliance" },
  ];
  const suffixes = [
    { suffix: "-tion / -sion", from: "verb → noun", ex: "implement → implementation, conclude → conclusion" },
    { suffix: "-ment", from: "verb → noun", ex: "develop → development, assess → assessment" },
    { suffix: "-ance / -ence", from: "adj/verb → noun", ex: "coherent → coherence, prevalent → prevalence" },
    { suffix: "-ity / -ty", from: "adj → noun", ex: "valid → validity, stable → stability, equal → equality" },
    { suffix: "-ness", from: "adj → noun", ex: "effective → effectiveness, aware → awareness" },
    { suffix: "-ous", from: "noun → adj", ex: "ambition → ambitious, caution → cautious" },
    { suffix: "-ive", from: "verb → adj", ex: "conclude → conclusive, produce → productive" },
    { suffix: "-ify", from: "noun/adj → verb", ex: "simple → simplify, intense → intensify" },
    { suffix: "-ise / -ize", from: "noun/adj → verb", ex: "modern → modernise, standard → standardise" },
  ];
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Word Formation (C1)</h2>
      <div className="not-prose mt-4 overflow-x-auto rounded-2xl border border-black/10">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-black/10 bg-black/5"><th className="px-4 py-3 text-left font-black text-slate-700">Prefix</th><th className="px-4 py-3 text-left font-black text-slate-700">Meaning</th><th className="px-4 py-3 text-left font-black text-slate-700">Examples</th></tr></thead>
          <tbody>{prefixes.map((r, i) => (<tr key={i} className={`border-b border-black/5 ${i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}><td className="px-4 py-2 font-semibold text-cyan-700">{r.prefix}</td><td className="px-4 py-2 text-slate-600">{r.meaning}</td><td className="px-4 py-2 italic text-slate-700">{r.ex}</td></tr>))}</tbody>
        </table>
      </div>
      <div className="not-prose mt-4 overflow-x-auto rounded-2xl border border-black/10">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-black/10 bg-black/5"><th className="px-4 py-3 text-left font-black text-slate-700">Suffix</th><th className="px-4 py-3 text-left font-black text-slate-700">Function</th><th className="px-4 py-3 text-left font-black text-slate-700">Examples</th></tr></thead>
          <tbody>{suffixes.map((r, i) => (<tr key={i} className={`border-b border-black/5 ${i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}><td className="px-4 py-2 font-semibold text-cyan-700">{r.suffix}</td><td className="px-4 py-2 text-slate-600">{r.from}</td><td className="px-4 py-2 italic text-slate-700">{r.ex}</td></tr>))}</tbody>
        </table>
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Negative prefix rules</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div><b>in-</b> before vowels and most consonants: <i>inaccurate, incapable, informal</i></div>
          <div><b>im-</b> before p/b/m: <i>impossible, imbalance, immature</i></div>
          <div><b>il-</b> before l: <i>illegal, illegible, illogical</i></div>
          <div><b>ir-</b> before r: <i>irrational, irresponsible, irregular</i></div>
          <div><b>un-</b> is the most general: <i>unprecedented, unwavering, unresolved</i></div>
        </div>
      </div>
    </div>
  );
}
