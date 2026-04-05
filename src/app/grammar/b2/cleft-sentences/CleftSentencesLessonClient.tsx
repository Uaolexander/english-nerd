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

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "It-cleft structure is?", options: ["What X is...", "It was X who/that...", "X is what...", "That X was..."], answer: 1 },
  { q: "Wh-cleft structure is?", options: ["It was X that...", "What X does is...", "Where X is...", "That X did..."], answer: 1 },
  { q: "'It was JOHN who called' is?", options: ["Wh-cleft", "It-cleft", "Pseudo-cleft", "None"], answer: 1 },
  { q: "'What I need is time' is?", options: ["It-cleft", "Wh-cleft", "Inversion", "Passive"], answer: 1 },
  { q: "It-cleft uses who for?", options: ["Things", "Places", "People", "Time"], answer: 2 },
  { q: "It-cleft uses 'that' for?", options: ["Only people", "Things/places/time", "Only verbs", "Only reasons"], answer: 1 },
  { q: "Wh-cleft emphasises?", options: ["A person", "An action or idea", "Only time", "Only places"], answer: 1 },
  { q: "'What she did was resign' is?", options: ["It-cleft", "Wh-cleft", "Passive", "Inversion"], answer: 1 },
  { q: "'It wasn't until she read it...' is?", options: ["Negative it-cleft", "Wh-cleft", "Passive cleft", "Question"], answer: 0 },
  { q: "Both it-cleft and wh-cleft can?", options: ["Emphasise elements", "Only use past tense", "Only use 'that'", "Avoid emphasis"], answer: 0 },
  { q: "Which is correct it-cleft?", options: ["It is John that called", "It is John which called", "It is John calling", "It is John he called"], answer: 0 },
  { q: "Which is correct wh-cleft?", options: ["What I want is to rest", "What I want is rest to", "What do I want is rest", "What I want are rest"], answer: 0 },
  { q: "Cleft sentences are used to?", options: ["Avoid emphasis", "Add emphasis/focus", "Make passive voice", "Change tense"], answer: 1 },
  { q: "In 'It was in 1969 that...' what is emphasised?", options: ["The subject", "The time", "The action", "The reason"], answer: 1 },
  { q: "'What caused the delay was X' — what is X?", options: ["The subject", "The object", "The reason", "The focused element"], answer: 3 },
  { q: "Negative it-cleft: 'It was NOT the money that...' emphasises?", options: ["The money", "That money is NOT the reason", "Questions", "Passive"], answer: 1 },
  { q: "Wh-cleft with action: 'What she did was ___?'", options: ["to sleep", "sleeping", "sleep (bare infinitive)", "slept"], answer: 2 },
  { q: "Which cleft emphasises place best?", options: ["Wh-cleft", "It-cleft", "Both equally", "Neither"], answer: 1 },
  { q: "'What we lack is X' — this is a?", options: ["It-cleft", "Wh-cleft", "Passive", "Inversion"], answer: 1 },
  { q: "It-cleft can emphasise all EXCEPT?", options: ["Subject", "Object", "The whole sentence meaning", "Time/place/reason"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Cleft Sentences",
  subtitle: "It was X who/that... and What X is...",
  level: "B2",
  keyRule: "It-cleft: It was X who/that... Wh-cleft: What X does is...",
  exercises: [
    {
      number: 1,
      title: "It-cleft or wh-cleft?",
      difficulty: "easy" as const,
      instruction: "Choose the correct cleft type.",
      questions: [
        "JOHN called me. (emphasise subject)",
        "I need TIME. (emphasise object)",
        "She left b/c NOISE. (emphasise reason)",
        "I want you to LISTEN. (emphasise action)",
        "She forgot to lock door.",
        "He told HER, not me.",
        "IN 1969 they landed on moon.",
        "I find her HONESTY impressive.",
        "NOISE woke me up.",
        "She wants to TRAVEL the world.",
      ],
    },
    {
      number: 2,
      title: "Complete the cleft sentence",
      difficulty: "medium" as const,
      instruction: "Fill in the missing part.",
      questions: [
        "It was the director ___ made the decision.",
        "What surprised me most ___ her reaction.",
        "It ___ the salary that attracted her.",
        "What we need ___ a complete overhaul.",
        "It was ___ Paris that they fell in love.",
        "What ___ me most was his indifference.",
        "It was ___ that caused the accident.",
        "What the company ___ is better comms.",
        "It ___ until I read it that I understood.",
        "What she ___ do was call the police.",
      ],
    },
    {
      number: 3,
      title: "Clefts in context",
      difficulty: "hard" as const,
      instruction: "Choose the most natural cleft sentence.",
      questions: [
        "They wanted to COMMUNICATE better.",
        "The CEO signed the letter — nobody else.",
        "It wasn't until she apologised it improved.",
        "The SOLUTION is what we're missing.",
        "He sent message to HER, not me.",
        "She finally RESIGNED.",
        "REPORT changed her mind.",
        "He makes me feel UNDERSTOOD.",
        "IN THE LIBRARY they found manuscript.",
        "We need you to COMMIT.",
      ],
    },
    {
      number: 4,
      title: "Write the cleft sentence",
      difficulty: "hard" as const,
      instruction: "Rewrite as a cleft sentence (lowercase).",
      questions: [
        "John broke the window. (it-cleft — John)",
        "I need more support. (wh-cleft)",
        "She solved it by staying calm. (it-cleft)",
        "They need to update software. (wh-cleft)",
        "He realised in 2019. (it-cleft — 2019)",
        "She didn't understand until she read it.",
        "Budget cuts caused delay. (wh-cleft)",
        "He wants to be taken seriously. (wh-cleft)",
        "I first met her in Vienna. (it-cleft)",
        "Her dedication impressed us. (wh-cleft)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Cleft types", answers: ["It was John who called me", "What I need is time", "It was because of the noise that she left", "What I want is for you to listen", "What she did was forget to lock the door", "It was her that he told", "It was in 1969 that they landed", "What I find most impressive is her honesty", "It was the noise that woke me up", "What she really wants is to travel"] },
    { exercise: 2, subtitle: "Missing parts", answers: ["who", "was", "was not", "is", "in", "shocked", "his speeding", "lacks", "wasn't", "did"] },
    { exercise: 3, subtitle: "Natural cleft sentences", answers: ["What they wanted was to communicate better", "It was the CEO who signed the letter", "It was not until she apologised that things improved", "What we are missing is a solution", "It was to her that he sent the message", "What she finally did was resign", "Both are correct", "What I appreciate is that he makes me feel understood", "It was in the library that they found it", "What we need is for you to commit"] },
    { exercise: 4, subtitle: "Written cleft sentences", answers: ["it was john who broke the window", "what i need is more support", "it was by staying calm that she solved the problem", "what they really need to do is update the software", "it was in 2019 that he realised his mistake", "it wasn't until she read the contract that she understood", "what caused the delay was the budget cuts", "what he wants is to be taken seriously", "it was in vienna that i first met her", "what impressed us the most was her dedication"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Inversion", href: "/grammar/b2/inversion", level: "B2", badge: "bg-orange-500", reason: "Both inversion and cleft sentences are used for emphasis" },
  { title: "Advanced Relative Clauses", href: "/grammar/b2/relative-clauses-advanced", level: "B2", badge: "bg-orange-500", reason: "Cleft sentences use relative clause structure (It is X that...)" },
  { title: "Linking Words", href: "/grammar/b2/linking-words", level: "B2", badge: "bg-orange-500" },
];

export default function CleftSentencesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — It-cleft or wh-cleft?",
      instructions: "Choose the correct type: It-cleft = 'It was X that/who…' (emphasises a specific element). Wh-cleft = 'What I need is…' (emphasises the idea/action).",
      questions: [
        { id: "e1q1", prompt: "JOHN called me, not Sarah. (emphasise the subject)", options: ["What called me was John.", "It was John who called me.", "It is John that calling me."], correctIndex: 1, explanation: "It-cleft: It was John who called me — emphasises the person." },
        { id: "e1q2", prompt: "I need TIME, not money. (emphasise the object)", options: ["What I need is time.", "It is time what I need.", "What need is time."], correctIndex: 0, explanation: "Wh-cleft: What I need is time — emphasises the thing needed." },
        { id: "e1q3", prompt: "She left BECAUSE of the noise, not the smell. (emphasise the reason)", options: ["What she left was because of the noise.", "It was because of the noise that she left.", "It was the noise why she left."], correctIndex: 1, explanation: "It-cleft with 'that': It was because of the noise that she left." },
        { id: "e1q4", prompt: "I want you to LISTEN, not to argue. (emphasise the action)", options: ["It is listen that I want.", "What I want is for you to listen.", "What I want you doing is listen."], correctIndex: 1, explanation: "Wh-cleft: What I want is for you to listen." },
        { id: "e1q5", prompt: "She FORGOT to lock the door — that's what happened.", options: ["It was forgetting the door that she did.", "What she did was forget to lock the door.", "What she forgot was locking the door."], correctIndex: 1, explanation: "Wh-cleft: What she did was forget to lock the door." },
        { id: "e1q6", prompt: "He told HER, not me. (emphasise the indirect object)", options: ["It was her who he told.", "What he told was her.", "It was her that he told."], correctIndex: 2, explanation: "It-cleft: It was her that he told — emphasises the person." },
        { id: "e1q7", prompt: "IN 1969 they landed on the moon. (emphasise the time)", options: ["It was in 1969 that they landed on the moon.", "What they did in 1969 was landing on the moon.", "It was 1969 when they landed on the moon."], correctIndex: 0, explanation: "It-cleft with time: It was in 1969 that…" },
        { id: "e1q8", prompt: "I find her HONESTY most impressive. (emphasise with wh-cleft)", options: ["It is her honesty that I find most impressive.", "What I find most impressive is her honesty.", "What most impresses me is that her honesty."], correctIndex: 1, explanation: "Wh-cleft: What I find most impressive is her honesty." },
        { id: "e1q9", prompt: "The NOISE, not the smell, woke me up. (it-cleft)", options: ["It was the noise that woke me up.", "What woke me up was the noise.", "It was the noise which it woke me up."], correctIndex: 0, explanation: "It-cleft: It was the noise that woke me up." },
        { id: "e1q10", prompt: "She really wants to TRAVEL the world. (wh-cleft, emphasise the desire)", options: ["It is travelling that she really wants.", "What she really wants is to travel the world.", "What she really wants is travel the world."], correctIndex: 1, explanation: "Wh-cleft: What she really wants is to travel the world." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Complete the cleft sentence",
      instructions: "Choose the missing part of the cleft sentence.",
      questions: [
        { id: "e2q1", prompt: "It was the director ___ made the final decision.", options: ["which", "that", "who"], correctIndex: 2, explanation: "who for people in It-clefts (though 'that' is also acceptable)." },
        { id: "e2q2", prompt: "What surprised me most ___ her reaction.", options: ["is", "was", "were"], correctIndex: 1, explanation: "was = past tense wh-cleft (matching the narrative)." },
        { id: "e2q3", prompt: "It ___ the salary that attracted her to the job.", options: ["was not", "is not", "wasn't"], correctIndex: 0, explanation: "Negative it-cleft: It was not the salary that… (past tense context)." },
        { id: "e2q4", prompt: "What we need ___ a complete overhaul of the system.", options: ["is", "are", "be"], correctIndex: 0, explanation: "What we need is = singular wh-cleft (what + singular noun)." },
        { id: "e2q5", prompt: "It was ___ Paris that they first fell in love.", options: ["at", "in", "on"], correctIndex: 1, explanation: "In Paris — the preposition is kept before the focused element in it-clefts." },
        { id: "e2q6", prompt: "What ___ me most was his complete indifference.", options: ["shocked", "shocking", "shock"], correctIndex: 0, explanation: "What shocked me most was = standard wh-cleft with past verb." },
        { id: "e2q7", prompt: "It was ___ that caused the accident, not the icy road.", options: ["his speeding", "he speed", "him speeding that"], correctIndex: 0, explanation: "It was his speeding that caused… — noun phrase or gerund as the focus." },
        { id: "e2q8", prompt: "What the company ___ is better communication between departments.", options: ["lacks", "lack", "is lacking"], correctIndex: 0, explanation: "What the company lacks is… — simple present in the wh-clause." },
        { id: "e2q9", prompt: "It ___ until I read the report that I understood the problem.", options: ["is", "was not", "wasn't"], correctIndex: 2, explanation: "It wasn't until… that = a common negative it-cleft pattern." },
        { id: "e2q10", prompt: "What she ___ do was call the police immediately.", options: ["should", "did", "should have done was"], correctIndex: 1, explanation: "What she did was call the police — wh-cleft with did + bare infinitive." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Clefts in context",
      instructions: "Choose the most natural cleft sentence to express the emphasis shown. Both it-cleft and wh-cleft options are included.",
      questions: [
        { id: "e3q1", prompt: "Emphasise: They wanted to COMMUNICATE better, not just work harder.", options: ["It was communicating better that they wanted.", "What they wanted was to communicate better, not just work harder.", "What they wanted was communicate better."], correctIndex: 1, explanation: "Wh-cleft: What they wanted was to communicate better. (to + infinitive after 'be')." },
        { id: "e3q2", prompt: "Emphasise: The CEO signed the letter — nobody else.", options: ["What the CEO did was sign the letter.", "It was the CEO who signed the letter.", "What signed the letter was the CEO."], correctIndex: 1, explanation: "It-cleft: It was the CEO who signed — emphasises the person." },
        { id: "e3q3", prompt: "Emphasise: It wasn't until she apologised that things improved.", options: ["What improved things was her apology.", "It was not until she apologised that things improved.", "It was things improving after she apologised."], correctIndex: 1, explanation: "Negative it-cleft: It was not until… that = emphasis on timing." },
        { id: "e3q4", prompt: "Emphasise: The SOLUTION is what we're missing, not more data.", options: ["It was a solution that we are missing.", "What we are missing is a solution, not more data.", "What missing is a solution."], correctIndex: 1, explanation: "Wh-cleft: What we are missing is a solution." },
        { id: "e3q5", prompt: "Emphasise: He sent the message to HER, not to me.", options: ["What he sent to her was the message.", "It was to her that he sent the message.", "It was her who he sent the message to."], correctIndex: 1, explanation: "It-cleft: It was to her that he sent the message — emphasises recipient." },
        { id: "e3q6", prompt: "Emphasise: She finally RESIGNED — that's what she did.", options: ["It was resigning that she finally did.", "What she finally did was resign.", "It was finally that she resigned."], correctIndex: 1, explanation: "Wh-cleft: What she finally did was resign." },
        { id: "e3q7", prompt: "Emphasise: The REPORT, not the meeting, changed her mind.", options: ["What changed her mind was the report.", "It was the report that changed her mind.", "Both are correct"], correctIndex: 2, explanation: "Both are natural here: It-cleft (It was the report that…) and Wh-cleft (What changed her mind was the report)." },
        { id: "e3q8", prompt: "Emphasise: He makes me feel UNDERSTOOD — that's what I appreciate.", options: ["What I appreciate is that he makes me feel understood.", "It is feeling understood that I appreciate.", "What I appreciate it is feeling understood."], correctIndex: 0, explanation: "Wh-cleft: What I appreciate is that he makes me feel understood." },
        { id: "e3q9", prompt: "Emphasise: IN THE LIBRARY they found the manuscript.", options: ["What they found in the library was the manuscript.", "It was in the library that they found the manuscript.", "The library was where they found the manuscript."], correctIndex: 1, explanation: "It-cleft with place: It was in the library that they found it." },
        { id: "e3q10", prompt: "Emphasise: We need you to COMMIT, not to just show up.", options: ["What we need is for you to commit, not just show up.", "It is committing that we need from you.", "What need from you is to commit."], correctIndex: 0, explanation: "Wh-cleft: What we need is for you to commit." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the cleft sentence",
      instructions: "Rewrite the sentence as a cleft sentence using the structure shown. Write the complete sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "John broke the window. (It-cleft — emphasise John)", correct: "it was john who broke the window", explanation: "It was + focus + who/that + rest of sentence." },
        { id: "e4q2", prompt: "I need more support. (Wh-cleft — emphasise what you need)", correct: "what i need is more support", explanation: "What + subject + verb + is/was + focus." },
        { id: "e4q3", prompt: "She solved the problem by staying calm. (It-cleft — emphasise by staying calm)", correct: "it was by staying calm that she solved the problem", explanation: "It was + prepositional phrase + that…" },
        { id: "e4q4", prompt: "They really need to update the software. (Wh-cleft)", correct: "what they really need to do is update the software", explanation: "What + subject + need to do + is + infinitive." },
        { id: "e4q5", prompt: "He realised his mistake in 2019. (It-cleft — emphasise in 2019)", correct: "it was in 2019 that he realised his mistake", explanation: "It was + time phrase + that + clause." },
        { id: "e4q6", prompt: "She didn't understand until she read the contract. (Negative it-cleft — It wasn't until…)", correct: "it wasn't until she read the contract that she understood", explanation: "It wasn't until + clause + that + positive main clause." },
        { id: "e4q7", prompt: "The budget cuts caused the delay. (Wh-cleft — emphasise cause)", correct: "what caused the delay was the budget cuts", explanation: "What + verb + was + subject." },
        { id: "e4q8", prompt: "He wants to be taken seriously. (Wh-cleft — emphasise what he wants)", correct: "what he wants is to be taken seriously", explanation: "What + subject + wants + is + infinitive." },
        { id: "e4q9", prompt: "I first met her in Vienna. (It-cleft — emphasise in Vienna)", correct: "it was in vienna that i first met her", explanation: "It was + place + that + clause." },
        { id: "e4q10", prompt: "Her dedication impressed us the most. (Wh-cleft)", correct: "what impressed us the most was her dedication", explanation: "What + verb + object + was + subject." },
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
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Cleft Sentences</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Cleft{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Sentences</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Cleft sentences split a single idea into two clauses to <b>emphasise</b> one part. <b>It-cleft</b>: <i>It was John who called</i>. <b>Wh-cleft</b> (pseudo-cleft): <i>What I need is time</i>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-cleft-sentences" subject="Cleft Sentences" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <SpeedRound gameId="grammar-b2-cleft-sentences" subject="Cleft Sentences" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/linking-words" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Linking Words →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Cleft Sentences (B2)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { type: "It-cleft (person)", struct: "It was + person + who + …", ex: "It was Maria who found the solution." },
          { type: "It-cleft (thing/reason/time/place)", struct: "It was + element + that + …", ex: "It was in 1969 that they landed on the moon. / It was because of the traffic that she was late." },
          { type: "Negative it-cleft", struct: "It wasn't until + clause + that + …", ex: "It wasn't until she read the email that she understood." },
          { type: "Wh-cleft (pseudo-cleft)", struct: "What + subject + verb + is/was + focus", ex: "What I need is more time. / What surprised me was her reaction." },
          { type: "Reversed wh-cleft", struct: "Focus + is/was + what + subject + verb", ex: "More time is what I need." },
          { type: "Wh-cleft with action", struct: "What + subject + did + was + bare infinitive", ex: "What she did was resign immediately." },
        ].map(({ type, struct, ex }) => (
          <div key={type} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-orange-700 text-sm">{type}</span>
              <span className="text-xs text-slate-500 font-mono">{struct}</span>
            </div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800 space-y-1">
          <div><span className="font-black">It-cleft vs Wh-cleft:</span></div>
          <div>It-cleft = emphasises a <i>specific known element</i>: <i>It was John who did it</i> (not someone else).</div>
          <div>Wh-cleft = emphasises an <i>idea or new information</i>: <i>What we need is a plan</i>.</div>
        </div>
      </div>
    </div>
  );
}
