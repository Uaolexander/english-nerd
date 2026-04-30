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
  { q: "Mixed A: past condition → present result uses?", options: ["would have + pp", "would + infinitive", "had + pp", "will + infinitive"], answer: 1 },
  { q: "Mixed B: present condition → past result uses?", options: ["would + infinitive", "would have + pp", "will + infinitive", "had + pp"], answer: 1 },
  { q: "'If I had slept more, I wouldn't be tired now' is?", options: ["Mixed B", "Mixed A", "Third conditional", "Second conditional"], answer: 1 },
  { q: "'If she weren't stubborn, she'd have listened' is?", options: ["Mixed A", "Mixed B", "Third conditional", "Second conditional"], answer: 1 },
  { q: "Mixed A if-clause uses?", options: ["Past simple", "Past perfect", "Present simple", "would + verb"], answer: 1 },
  { q: "Mixed B if-clause uses?", options: ["Past perfect", "Past simple/were", "Present simple", "would + verb"], answer: 1 },
  { q: "Which clue word suggests Mixed A?", options: ["yesterday", "now / currently", "always", "never"], answer: 1 },
  { q: "Mixed A result clause = ?", options: ["would have + pp", "would + infinitive", "had + pp", "will + infinitive"], answer: 1 },
  { q: "Mixed B result clause = ?", options: ["would + infinitive", "would have + pp", "had + pp", "will + infinitive"], answer: 1 },
  { q: "'If he weren't so shy, he'd have spoken' shows?", options: ["Past condition → present result", "Present character → past missed action", "General truth", "First conditional"], answer: 1 },
  { q: "'If she had studied, she'd be a doctor now' is?", options: ["Mixed B", "Mixed A", "Third conditional", "Second conditional"], answer: 1 },
  { q: "In Mixed B if-clause 'were' replaces?", options: ["was only", "was/were (hypothetical)", "had been", "would be"], answer: 1 },
  { q: "Mixed conditionals combine which types?", options: ["Zero + First", "Second + Third", "First + Second", "Zero + Third"], answer: 1 },
  { q: "'If he spoke better, he'd have got the job' is?", options: ["Mixed A", "Mixed B", "Third", "Second"], answer: 1 },
  { q: "Result of Mixed A is about?", options: ["Past", "The present moment", "Future only", "General truth"], answer: 1 },
  { q: "Result of Mixed B is about?", options: ["The present moment", "A specific past event", "Future plan", "General truth"], answer: 1 },
  { q: "Which is a Mixed A sentence?", options: ["If he'd been careful, he'd be fine now", "If she were taller, she'd have made the team", "If it rains, I'll stay in", "If I had money, I'd travel"], answer: 0 },
  { q: "Which is a Mixed B sentence?", options: ["If he'd saved money, he'd be rich now", "If she were less stubborn, she'd have agreed", "If I knew, I'd tell you", "If it were sunny, I'd go out"], answer: 1 },
  { q: "Mixed conditional is more complex because?", options: ["It uses two different times", "It has no result clause", "It only uses past tense", "It requires modal verbs"], answer: 0 },
  { q: "Which is NOT a mixed conditional?", options: ["If I'd saved more, I'd be richer now", "If she were nicer, she'd have more friends", "If I had studied, I would have passed", "If she weren't tired, she'd have come"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Mixed Conditionals",
  subtitle: "Past condition → present result and vice versa",
  level: "B2",
  keyRule: "Mixed A: if + Past Perfect → would + infinitive. Mixed B: if + Past Simple → would have + pp.",
  exercises: [
    {
      number: 1,
      title: "Identify the mixed type",
      difficulty: "easy" as const,
      instruction: "Choose the correct mixed conditional form.",
      questions: [
        "If I'd slept more, I ___ tired now.",
        "If she weren't stubborn, she ___ listened.",
        "He ___ lead it if he had more experience.",
        "If he'd worked harder, he ___ a better job.",
        "She'd be fluent if she ___ those classes.",
        "If I ___ more confident, I'd have applied.",
        "They ___ richer if they'd invested wisely.",
        "If he weren't so shy, he ___ spoken up.",
        "She ___ be a doctor if she'd graduated.",
        "If they'd planned it, they ___ struggling.",
      ],
    },
    {
      number: 2,
      title: "Write the correct form",
      difficulty: "medium" as const,
      instruction: "Complete with the correct mixed conditional verb.",
      questions: [
        "If I (save) ___ more, I'd be comfortable.",
        "If she (not/be) ___ so rash, she'd have succeeded.",
        "He (speak) ___ better if he'd taken the course.",
        "If they (invest) ___, they'd be millionaires.",
        "She (have) ___ more friends if she were nicer.",
        "If he (be) ___ more careful, he'd have passed.",
        "We (know) ___ the answer if we'd paid attention.",
        "She (earn) ___ more if she'd studied finance.",
        "He (attend) ___ if he weren't so antisocial.",
        "If we (leave) ___ earlier, we'd be there now.",
      ],
    },
    {
      number: 3,
      title: "Mixed conditionals in context",
      difficulty: "hard" as const,
      instruction: "Choose the best mixed conditional form.",
      questions: [
        "If he'd taken the medicine, he ___ better now.",
        "She ___ to advice if she weren't so stubborn.",
        "If I'd studied harder, I ___ stressed now.",
        "He ___ richer if he hadn't quit his job.",
        "If she ___ more patient, she'd have succeeded.",
        "They ___ here now if the project hadn't failed.",
        "If I weren't so tired, I ___ gone to the party.",
        "She'd have more confidence if she ___ introvert.",
        "If we hadn't argued, we ___ still together now.",
        "He ___ promoted if he showed more initiative.",
      ],
    },
    {
      number: 4,
      title: "Full mixed conditional practice",
      difficulty: "hard" as const,
      instruction: "Write both verbs in the correct mixed form.",
      questions: [
        "If I (sleep) more, I (not/be) tired now.",
        "She (listen) if she (not/be) so stubborn.",
        "If he (study), he (not/struggle) now.",
        "We (still together) if we (not/argue) then.",
        "If she (take) the job, she (be) rich now.",
        "He (attend) if he (not/be) so antisocial.",
        "If they (invest) wisely, they (be) successful.",
        "She (win) if she (train) harder last year.",
        "If I (know) then, I (not/do) it now.",
        "He (live) abroad if he (not/have) debts.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Mixed conditional forms", answers: ["wouldn't be", "would have listened", "would lead", "would have got", "had taken", "were", "would be", "would have spoken", "would", "wouldn't be"] },
    { exercise: 2, subtitle: "Written verb forms", answers: ["had saved", "weren't", "would speak", "had invested", "would have", "were", "would know", "would earn", "would have attended", "had left"] },
    { exercise: 3, subtitle: "Contextual choice", answers: ["would feel", "would have listened", "wouldn't be", "would be", "were", "would be", "would have gone", "weren't such an", "would still be", "would have been"] },
    { exercise: 4, subtitle: "Both verb forms", answers: ["had slept / wouldn't be", "would have listened / weren't", "had studied / wouldn't be struggling", "would still be together / hadn't argued", "had taken / would be", "would have attended / weren't", "had invested / would be", "would have won / had trained", "had known / wouldn't do", "would live / didn't have"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] }
  | { type: "story"; title: string; instructions: string; passage: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase().replace(/[.,!?;:]+/g, "").replace(/\s+/g, " "); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Third Conditional", href: "/grammar/b2/third-conditional", level: "B2", badge: "bg-orange-500", reason: "Foundation for mixed conditionals" },
  { title: "Wish / Would", href: "/grammar/b2/wish-would", level: "B2", badge: "bg-orange-500", reason: "Hypothetical structures that pair with conditionals" },
  { title: "All B2 Conditionals", href: "/grammar/b2/all-conditionals-b2", level: "B2", badge: "bg-orange-500" },
];

export default function MixedConditionalsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const { isLive, broadcast } = useLiveSync((payload) => {
    setMcqAnswers(payload.answers as Record<string, number | null>);
    setInputAnswers((payload as unknown as { inputAnswers: Record<string, string> }).inputAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4 | 5);
  });
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4 | 5, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Identify the mixed conditional type",
      instructions: "Choose the correct mixed conditional form. Remember: Type A = past condition → present result. Type B = present condition → past result.",
      questions: [
        { id: "e1q1", prompt: "If I had slept more last night, I ___ so tired now.", options: ["wouldn't be", "wouldn't have been", "wasn't"], correctIndex: 0, explanation: "wouldn't be = present result of a past condition (Type A mixed)." },
        { id: "e1q2", prompt: "If she weren't so stubborn, she ___ to your advice yesterday.", options: ["would listen", "would have listened", "listened"], correctIndex: 1, explanation: "would have listened = past result of a present condition (Type B mixed)." },
        { id: "e1q3", prompt: "He ___ the project if he had more experience. (He doesn't)", options: ["would have led", "would lead", "had led"], correctIndex: 1, explanation: "would lead = present result from ongoing present condition (Type B → present)." },
        { id: "e1q4", prompt: "If I ___ my passport, I could travel right now.", options: ["had renewed", "renewed", "hadn't lost"], correctIndex: 2, explanation: "hadn't lost = past action causing a present limitation (Type A if-clause)." },
        { id: "e1q5", prompt: "If she had taken the scholarship, she ___ at Oxford now.", options: ["would study", "would be studying", "studied"], correctIndex: 1, explanation: "would be studying = present in-progress result of a past condition." },
        { id: "e1q6", prompt: "If he ___ so irresponsible, he wouldn't have lost his job.", options: ["isn't", "weren't", "hadn't been"], correctIndex: 1, explanation: "weren't = present condition explaining a past result (Type B mixed)." },
        { id: "e1q7", prompt: "I ___ you at the party if I had known you were going.", options: ["would see", "would have seen", "had seen"], correctIndex: 1, explanation: "would have seen = past result of a past condition (Third Conditional — not mixed). But if the result is still relevant now, it can be mixed." },
        { id: "e1q8", prompt: "If she hadn't moved abroad, she ___ near her parents now.", options: ["would live", "would have lived", "lives"], correctIndex: 0, explanation: "would live = present state as result of past decision (Type A mixed)." },
        { id: "e1q9", prompt: "If he were more organised, he ___ all those deadlines last year.", options: ["wouldn't miss", "wouldn't have missed", "hadn't missed"], correctIndex: 1, explanation: "wouldn't have missed = past result of present character flaw (Type B mixed)." },
        { id: "e1q10", prompt: "If I had chosen a different career, I ___ much happier today.", options: ["would be", "would have been", "was"], correctIndex: 0, explanation: "would be = present state as result of a past choice (Type A mixed)." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct mixed conditional form",
      instructions: "Complete the mixed conditional. Write only the missing verb phrase.",
      questions: [
        { id: "e2q1", prompt: "If I had taken that job offer, I (earn) ___ much more money now.", correct: "would be earning", explanation: "would be earning = present ongoing result of a past decision." },
        { id: "e2q2", prompt: "If she weren't so shy, she (apply) ___ for the role last year.", correct: "would have applied", explanation: "would have applied = past result of a present characteristic." },
        { id: "e2q3", prompt: "He (not/be) ___ in debt now if he had saved more money.", correct: "wouldn't be", explanation: "wouldn't be = present state as result of past behaviour." },
        { id: "e2q4", prompt: "If they hadn't missed the train, they (arrive) ___ by now.", correct: "would have arrived", explanation: "would have arrived = completed past result of a past event." },
        { id: "e2q5", prompt: "If I spoke better French, I (get) ___ the job in Paris last year.", correct: "would have got", explanation: "would have got = past result of a present skill gap." },
        { id: "e2q6", prompt: "She (live) ___ in London now if she had accepted the transfer.", correct: "would be living", explanation: "would be living = present situation as result of a past decision." },
        { id: "e2q7", prompt: "If he weren't so careless, he (not/make) ___ so many mistakes yesterday.", correct: "wouldn't have made", explanation: "wouldn't have made = past result of present character trait." },
        { id: "e2q8", prompt: "I (not/be) ___ so tired today if I hadn't stayed up so late.", correct: "wouldn't be", explanation: "wouldn't be = present state as result of past action." },
        { id: "e2q9", prompt: "If she had studied harder at school, she (have) ___ more options now.", correct: "would have", explanation: "would have = present state result. (Also 'would have more options'.)" },
        { id: "e2q10", prompt: "If he didn't have a fear of flying, he (travel) ___ to Australia last year.", correct: "would have travelled", explanation: "would have travelled = past result of a present condition (phobia)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Mixed vs Pure Second vs Pure Third",
      instructions: "Choose the correct conditional type. Think carefully: is the condition past or present? Is the result past or present?",
      questions: [
        { id: "e3q1", prompt: "If I were taller, I ___ a better basketball player. (general — no time reference)", options: ["would be", "would have been", "had been"], correctIndex: 0, explanation: "would be = Second Conditional (hypothetical present). No mixed needed — both present." },
        { id: "e3q2", prompt: "If I had been born taller, I ___ a professional basketball player now.", options: ["would be", "would have been", "was"], correctIndex: 0, explanation: "would be = Mixed Conditional Type A: past birth condition → present career result." },
        { id: "e3q3", prompt: "If he hadn't crashed the car, he ___ it to work yesterday.", options: ["drove", "would drive", "would have driven"], correctIndex: 2, explanation: "would have driven = Third Conditional (past condition → past result)." },
        { id: "e3q4", prompt: "If he hadn't crashed the car, we ___ a car to use now.", options: ["would have", "would have had", "had"], correctIndex: 0, explanation: "would have = Mixed Conditional (past crash → present lack of a car)." },
        { id: "e3q5", prompt: "She ___ so miserable right now if she had chosen a job she loves.", options: ["wouldn't be", "wouldn't have been", "wasn't"], correctIndex: 0, explanation: "wouldn't be = Mixed: past choice → present state." },
        { id: "e3q6", prompt: "If you hadn't interrupted me, I ___ the report by now.", options: ["would finish", "would have finished", "finished"], correctIndex: 1, explanation: "would have finished = Third Conditional result (completed past task disrupted)." },
        { id: "e3q7", prompt: "If you weren't always late, your boss ___ you last month.", options: ["wouldn't fire", "wouldn't have fired", "hadn't fired"], correctIndex: 1, explanation: "wouldn't have fired = Mixed Type B: present habit → past result." },
        { id: "e3q8", prompt: "If I had more confidence, I ___ that presentation yesterday.", options: ["would give", "would have given", "had given"], correctIndex: 1, explanation: "would have given = Mixed Type B: present trait → past result." },
        { id: "e3q9", prompt: "They ___ in a bigger house now if they had bought property ten years ago.", options: ["would live", "would have lived", "lived"], correctIndex: 0, explanation: "would live = Mixed Type A: past decision → present living situation." },
        { id: "e3q10", prompt: "If she spoke Spanish, she ___ that job in Madrid. (She still has a chance)", options: ["would get", "would have got", "gets"], correctIndex: 0, explanation: "would get = Second Conditional (still possible in the present/future — not mixed)." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the full mixed conditional sentence",
      instructions: "Write the complete verb phrase for both clauses. The context tells you which type of mixed conditional to use.",
      questions: [
        { id: "e4q1", prompt: "She is afraid of dogs (present). She (not/adopt) ___ the puppy last year.", correct: "wouldn't have adopted", explanation: "wouldn't have adopted = present fear → past decision (Type B)." },
        { id: "e4q2", prompt: "He didn't sleep well (past). He (feel) ___ much better now.", correct: "would feel", explanation: "would feel = past cause → present state (Type A)." },
        { id: "e4q3", prompt: "I don't know how to cook (present). I (not/order) ___ so much takeaway last week.", correct: "wouldn't have ordered", explanation: "wouldn't have ordered = present skill gap → past behaviour (Type B)." },
        { id: "e4q4", prompt: "They invested in property ten years ago (past). They (be) ___ very wealthy now.", correct: "would be", explanation: "would be = past action → present state (Type A)." },
        { id: "e4q5", prompt: "He is incredibly talented (present). If he had entered the competition, he (win) ___.", correct: "would have won", explanation: "would have won = present talent → past outcome (Type B)." },
        { id: "e4q6", prompt: "She didn't study medicine (past). She (not/work) ___ as a doctor now.", correct: "wouldn't be working", explanation: "wouldn't be working = past choice → present career (Type A)." },
        { id: "e4q7", prompt: "He is very impatient (present). He (handle) ___ the situation better last night.", correct: "would have handled", explanation: "would have handled = present character → past behaviour (Type B)." },
        { id: "e4q8", prompt: "I missed the conference (past). I (know) ___ about the new project by now.", correct: "would know", explanation: "would know = past event → present knowledge gap (Type A)." },
        { id: "e4q9", prompt: "She doesn't have a driving licence (present). She (offer) ___ to drive us home last night.", correct: "would have offered", explanation: "would have offered = present limitation → past action (Type B)." },
        { id: "e4q10", prompt: "They didn't build the dam (past). The valley (still/flood) ___ every year now.", correct: "would still be flooding", explanation: "would still be flooding = past failure to act → present ongoing situation (Type A)." },
      ],
    },
    5: {
      type: "story" as const,
      title: "Exercise 5 (Story) — Open the brackets",
      instructions: "Read the story about Maria's career choices. Open the brackets using mixed conditionals: past condition → present result (if + past perfect, would + infinitive now) or present condition → past result (if + past simple, would have + past participle).",
      passage: "Maria is a school librarian. She enjoys her job, but sometimes she wonders what life might have been like if she had made different choices.\n\nShe studied literature at university but dropped out in her second year. If she (1)(finish) her degree, she would be a qualified teacher today. Instead, she has always worked in libraries.\n\nShe was offered a promotion five years ago but turned it down because she lacked confidence. If she (2)(accept) that promotion, she would be managing her own library branch by now.\n\nHer colleague says: \"If you (3)(be) more confident in yourself, you would have taken the chance when it appeared.\" Maria knows he is right — her self-doubt has held her back.\n\nMaria thinks about the future. If she (4)(start) an online teaching course now, she would have a teaching qualification within two years. That is still possible.\n\nShe also reflects on a specific decision. She once refused to relocate to the capital for a senior role. If she (5)(not / be) so attached to her hometown, she would have accepted the offer — and her salary would be much higher now.\n\nLooking ahead, if Maria (6)(apply) for the head librarian position next spring, she might finally get the recognition she deserves. It is not too late.\n\nShe tells herself: \"If I (7)(know) then what I know now, I (8)(make) very different decisions.\" But she is still optimistic about the years ahead.",
      questions: [
        { id: "e5q1", prompt: "(1) If she _____ (finish) her degree", correct: "had finished", explanation: "Mixed conditional: past if-clause → past perfect; result is present state (would be today)." },
        { id: "e5q2", prompt: "(2) If she _____ (accept) that promotion", correct: "had accepted", explanation: "Mixed conditional: past if-clause → past perfect; result refers to the present (by now)." },
        { id: "e5q3", prompt: "(3) If you _____ (be) more confident in yourself", correct: "were", explanation: "Mixed conditional: present condition → past result; if + past simple (were)." },
        { id: "e5q4", prompt: "(4) If she _____ (start) an online course now", correct: "started", explanation: "Second conditional: hypothetical present condition → future result; past simple." },
        { id: "e5q5", prompt: "(5) If she _____ (not / be) so attached to her hometown", correct: "hadn't been", explanation: "Mixed conditional: past if-clause → past perfect negative; result is present (salary now)." },
        { id: "e5q6", prompt: "(6) if Maria _____ (apply) for the position", correct: "applies", explanation: "First conditional: real future possibility → present simple in if-clause." },
        { id: "e5q7", prompt: "(7) If I _____ (know) then what I know now", correct: "had known", explanation: "Mixed conditional: past if-clause → past perfect; contrasting past knowledge with present awareness." },
        { id: "e5q8", prompt: "(8) I _____ (make) very different decisions", correct: "would have made", explanation: "Mixed conditional: result of past condition → would have + past participle." },
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

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo }); }
  function switchExercise(n: 1 | 2 | 3 | 4 | 5) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo: n }); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Mixed Conditionals</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Mixed{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Conditionals</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Mixed Conditionals combine elements of the Second and Third Conditional when the <b>time of the condition and result are different</b>. Type A: <i>past condition → present result</i>. Type B: <i>present condition → past result</i>.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-mixed-conditionals" subject="Mixed Conditionals" questions={SPEED_QUESTIONS} variant="sidebar" />
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
              {([1, 2, 3, 4, 5] as const).map((n) => (
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
                    {([1, 2, 3, 4, 5] as const).map((n) => (
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
                    })
                  ) : current.type === "input" ? (
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
                                <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-sm rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
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
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
                        <p className="text-sm font-bold uppercase tracking-wider text-violet-600 mb-3">Read the story</p>
                        {current.passage.split('\n').filter(Boolean).map((para, i) => (
                          <p key={i} className="text-slate-700 leading-relaxed mb-2 last:mb-0">{para}</p>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-700">Open the brackets — write the correct form:</p>
                        {current.questions.map((q, idx) => {
                          const val = inputAnswers[q.id] ?? "";
                          const answered = normalize(val) !== "";
                          const isCorrect = checked && answered && normalize(val) === normalize(q.correct);
                          const wrong = checked && answered && !isCorrect;
                          const noAnswer = checked && !answered;
                          return (
                            <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                              <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">({idx + 1})</div>
                                <div className="flex-1">
                                  <div className="font-bold text-slate-900">{q.prompt}</div>
                                  <div className="mt-3">
                                    <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type the correct form…" className="w-full max-w-sm rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
                                  </div>
                                  {checked && (
                                    <div className="mt-3 text-sm">
                                      {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                      {wrong && <div className="text-red-700 font-semibold">❌ Wrong — correct: <b>{q.correct}</b></div>}
                                      {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer — correct: <b>{q.correct}</b></div>}
                                      <div className="mt-1 text-slate-600">{q.explanation}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button onClick={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                    ) : (
                      <button onClick={resetExercise} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                    )}
                    {checked && exNo < 5 && (
                      <button onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4 | 5)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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

        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b2" allLabel="All B2 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b2-mixed-conditionals" subject="Mixed Conditionals" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/all-conditionals-b2" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: All Conditionals →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Mixed Conditionals (B2)</h2>
      <p>Mixed Conditionals are used when the <b>time of the condition is different from the time of the result</b>. There are two main types.</p>

      <div className="not-prose mt-4 space-y-4">
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <div className="text-sm font-black text-orange-700 mb-2">TYPE A — Past condition → Present result</div>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div className="rounded-xl border border-orange-200 bg-white p-3">
              <div className="text-xs font-bold text-slate-500 mb-1">IF-CLAUSE (past)</div>
              <div className="font-mono text-slate-800">If + Past Perfect</div>
              <div className="italic text-slate-600 mt-1">If I had studied medicine…</div>
            </div>
            <div className="rounded-xl border border-orange-200 bg-white p-3">
              <div className="text-xs font-bold text-slate-500 mb-1">RESULT CLAUSE (present)</div>
              <div className="font-mono text-slate-800">would + infinitive</div>
              <div className="italic text-slate-600 mt-1">…I would be a doctor now.</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-orange-700">The past choice has consequences for the present.</div>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <div className="text-sm font-black text-sky-700 mb-2">TYPE B — Present condition → Past result</div>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div className="rounded-xl border border-sky-200 bg-white p-3">
              <div className="text-xs font-bold text-slate-500 mb-1">IF-CLAUSE (present)</div>
              <div className="font-mono text-slate-800">If + Past Simple (were/didn&apos;t)</div>
              <div className="italic text-slate-600 mt-1">If she weren&apos;t so shy…</div>
            </div>
            <div className="rounded-xl border border-sky-200 bg-white p-3">
              <div className="text-xs font-bold text-slate-500 mb-1">RESULT CLAUSE (past)</div>
              <div className="font-mono text-slate-800">would have + past participle</div>
              <div className="italic text-slate-600 mt-1">…she would have applied last year.</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-sky-700">A present trait/state explains a past outcome.</div>
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Key question to ask yourself:</span><br />
          <b>When is the condition?</b> Past → use Past Perfect in the if-clause.<br />
          <b>When is the result?</b> Present → use <i>would + infinitive</i>. Past → use <i>would have + pp</i>.
        </div>
      </div>
    </div>
  );
}
