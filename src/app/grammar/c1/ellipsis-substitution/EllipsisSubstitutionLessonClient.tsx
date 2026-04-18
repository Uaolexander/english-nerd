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
  { title: "Advanced Discourse Markers", href: "/grammar/c1/advanced-discourse-markers", level: "C1", badge: "bg-sky-600", reason: "Both are key cohesion devices in advanced writing" },
  { title: "Advanced Relative Clauses", href: "/grammar/c1/advanced-relative-clauses", level: "C1", badge: "bg-sky-600" },
  { title: "Extraposition", href: "/grammar/c1/extraposition", level: "C1", badge: "bg-sky-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "'Do so' is used to substitute:", options: ["A verb phrase", "A noun", "An adjective", "A clause"], answer: 0 },
  { q: "'So' substitutes after think/believe:", options: ["A whole clause", "A noun phrase", "An adverb", "A verb only"], answer: 0 },
  { q: "Can I come? Yes, ___ can.", options: ["you", "it", "do", "that"], answer: 0 },
  { q: "She left and so ___ John.", options: ["did", "has", "was", "had"], answer: 0 },
  { q: "Will she win? I think ___.", options: ["so", "it", "that", "this"], answer: 0 },
  { q: "'Not' substitutes a negative clause:", options: ["I hope not", "I hope no", "I hope never", "I hope none"], answer: 0 },
  { q: "Ellipsis means:", options: ["Omitting understood words", "Repeating key words", "Changing word order", "Adding extra words"], answer: 0 },
  { q: "She can sing and I can ___ too.", options: ["(nothing)", "do", "sing", "it"], answer: 0 },
  { q: "'One' substitutes a singular ___.", options: ["Countable noun", "Uncountable noun", "Verb phrase", "Whole clause"], answer: 0 },
  { q: "I don't like this hat. Try the red ___.", options: ["one", "it", "ones", "that"], answer: 0 },
  { q: "She passed and so did I. ('so did I' =)", options: ["I also passed", "I passed before her", "I tried too", "She failed"], answer: 0 },
  { q: "Auxiliary ellipsis: I can't run but she ___.", options: ["can", "does", "is", "will"], answer: 0 },
  { q: "Substitution of 'that' after verbs:", options: ["say / think / know", "run / walk / jump", "is / are / was", "have / had / has"], answer: 0 },
  { q: "He said he'd come and he ___ so.", options: ["did", "has", "was", "had"], answer: 0 },
  { q: "'Ones' substitutes:", options: ["Plural countable nouns", "Uncountable nouns", "Verb phrases", "Clauses"], answer: 0 },
  { q: "I wanted to help but wasn't able ___.", options: ["to", "doing", "for", "of"], answer: 0 },
  { q: "Gapping omits:", options: ["Repeated verb in parallel", "Subject only", "Object only", "Adjective only"], answer: 0 },
  { q: "She likes jazz and he ___ rock.", options: ["(nothing / gapping)", "likes too", "does rock", "plays jazz"], answer: 0 },
  { q: "'Do so' vs 'do it': 'do so' is ___.", options: ["More formal", "More informal", "Identical", "Always incorrect"], answer: 0 },
  { q: "I called her but she didn't ___.", options: ["reply", "replied", "replying", "have replied"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Ellipsis and Substitution",
  subtitle: "Avoiding repetition: do so, one/ones, so, not, gapping",
  level: "C1",
  keyRule: "Ellipsis = omit; substitution = replace with do so/one/so/not.",
  exercises: [
    {
      number: 1,
      title: "Substitution with do so / one / ones",
      difficulty: "Easy",
      instruction: "Choose the correct substitute.",
      questions: [
        "She left. John did ___ too.",
        "Try this hat or the red ___.",
        "I think ___ (that he's right).",
        "Will it rain? I hope ___.",
        "I don't like these. Try those ___.",
        "She sang well and he did ___ too.",
        "One chair broke; the other ___ fine.",
        "I'd buy the blue ___.",
        "She helped and I did ___ too.",
        "Won't he come? I believe ___.",
      ],
      hint: "so / one / ones / not",
    },
    {
      number: 2,
      title: "Ellipsis: Omitting Words",
      difficulty: "Medium",
      instruction: "Identify what is omitted or choose correct ellipsis.",
      questions: [
        "She can sing and I can ___ too.",
        "I wanted to help but wasn't able ___.",
        "He said he'd come and ___ did.",
        "She likes jazz; he ___ rock.",
        "I'll try if you ___ .",
        "Tom passed and so ___ Jerry.",
        "Can you help? Yes, I ___.",
        "She likes tea, not coffee, and he ___.",
        "I should call but I don't want ___.",
        "We hoped to win and we ___.",
      ],
      hint: "(nothing) / to / did / will",
    },
    {
      number: 3,
      title: "So / Not After Reporting Verbs",
      difficulty: "Hard",
      instruction: "Choose the correct form after the reporting verb.",
      questions: [
        "Will they agree? I expect ___.",
        "Did she pass? I believe ___.",
        "Will it work? I'm afraid ___.",
        "Is he wrong? I think ___.",
        "Is she coming? I hope ___.",
        "Did they fail? I'm afraid ___.",
        "Will it rain? I suppose ___.",
        "Is it correct? I believe ___.",
        "Did he resign? I heard ___.",
        "Will she recover? I hope ___.",
      ],
      hint: "so / not",
    },
    {
      number: 4,
      title: "Rewrite Using Ellipsis or Substitution",
      difficulty: "Very Hard",
      instruction: "Rewrite avoiding repetition.",
      questions: [
        "She sang well and he sang well.",
        "I like this book. Buy this book.",
        "He promised he'd come, he came.",
        "She can help and I can help too.",
        "I bought the red hat not blue hat.",
        "Tom studies hard; Anna studies hard.",
        "She said she'd finish, she finished.",
        "He hoped to pass and he passed.",
        "I'll come if she comes.",
        "They left and we left too.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Substitution with do so / one / ones", answers: ["so", "one", "so", "not", "ones", "so", "ones (were)", "one", "so", "not"] },
    { exercise: 2, subtitle: "Ellipsis: Omitting Words", answers: ["(nothing)", "to", "he", "(nothing - gapping)", "will", "did", "can", "(nothing - gapping)", "to", "did"] },
    { exercise: 3, subtitle: "So / Not After Reporting Verbs", answers: ["so", "so", "not", "so", "so", "so", "so", "so", "so", "so"] },
    { exercise: 4, subtitle: "Rewrite Using Ellipsis or Substitution", answers: ["She sang well and so did he.", "I like this book. Buy it.", "He promised he'd come and did so.", "She can help and so can I.", "I bought the red hat, not the blue one.", "Tom studies hard and so does Anna.", "She said she'd finish and did so.", "He hoped to pass and did.", "I'll come if she does.", "They left and so did we."] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function EllipsisSubstitutionLessonClient() {
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
      title: "Exercise 1 (Easy) — So/Neither + auxiliary substitution",
      instructions: "We use 'so + auxiliary + subject' (positive) and 'neither/nor + auxiliary + subject' (negative) to avoid repeating a verb phrase. Choose the correct form.",
      questions: [
        { id: "e1q1", prompt: "\"I love jazz.\" \"___ I.\" (agree, positive)", options: ["So do", "Neither do", "So am"], correctIndex: 0, explanation: "So + do + I = agreeing with a positive simple present statement (love = lexical verb → do)." },
        { id: "e1q2", prompt: "\"I can't swim.\" \"___ my sister.\" (agree, negative)", options: ["So can", "Neither can", "Nor does"], correctIndex: 1, explanation: "Neither/nor + can + subject = agreeing with a negative statement." },
        { id: "e1q3", prompt: "\"She's been to Japan.\" \"___ Tom.\" (agree)", options: ["So has", "Neither has", "So does"], correctIndex: 0, explanation: "So + has + Tom = agreeing with present perfect positive." },
        { id: "e1q4", prompt: "\"We didn't enjoy the film.\" \"___ I.\" (agree, negative)", options: ["So did", "Neither did", "Nor was"], correctIndex: 1, explanation: "Neither + did + I = agreeing with a past negative statement." },
        { id: "e1q5", prompt: "\"He's very tall.\" \"___ his brother.\" (agree)", options: ["So is", "Neither is", "So does"], correctIndex: 0, explanation: "So + is = agreeing with 'is' (to be)." },
        { id: "e1q6", prompt: "\"I won't be attending.\" \"___ Maria.\" (agree, negative)", options: ["Neither will", "So will", "Neither won't"], correctIndex: 0, explanation: "Neither + will = agreeing with a negative future statement. No double negative." },
        { id: "e1q7", prompt: "\"They were late.\" \"___ we.\" (agree)", options: ["So were", "So was", "Neither were"], correctIndex: 0, explanation: "So + were + we = agreeing with 'were' (plural)." },
        { id: "e1q8", prompt: "\"I have no idea what to do.\" \"___ I.\" (agree, negative)", options: ["Neither do", "So do", "Neither am"], correctIndex: 0, explanation: "'Have no idea' is negative → Neither do I (have no idea)." },
        { id: "e1q9", prompt: "\"She could play the violin as a child.\" \"___ I.\" (agree)", options: ["So could", "Neither could", "So did"], correctIndex: 0, explanation: "So + could = agreeing with a past ability statement." },
        { id: "e1q10", prompt: "\"I'm not ready.\" \"___ James.\" (agree, negative)", options: ["So isn't", "Neither is", "Neither isn't"], correctIndex: 1, explanation: "Neither + is + James = agreeing with a negative 'to be' statement." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — So/Not substitution & do so",
      instructions: "'I think/hope/believe so' and 'I think/hope not' substitute for a full clause. 'Do so' replaces a verb phrase. Choose the correct form.",
      questions: [
        { id: "e2q1", prompt: "\"Is the meeting at three?\" \"I ___ — let me check.\" (you're not sure, positive)", options: ["think so", "think not", "think it"], correctIndex: 0, explanation: "'I think so' = I think that's true. Substitutes for 'I think the meeting is at three'." },
        { id: "e2q2", prompt: "\"Will it rain tomorrow?\" \"I hope ___.\" (you hope it won't)", options: ["so", "not", "it not"], correctIndex: 1, explanation: "'I hope not' = I hope it won't rain. 'hope not' is correct; 'hope so' would mean hoping it will rain." },
        { id: "e2q3", prompt: "\"Does he know about the redundancies?\" \"I'm afraid ___.\" (it's true, bad news)", options: ["so", "not", "it"], correctIndex: 0, explanation: "'I'm afraid so' = unfortunately, yes. Substitutes for 'I'm afraid he does know'." },
        { id: "e2q4", prompt: "\"She asked me to submit the form, and I ___ immediately.\" (performed the action)", options: ["did so", "did it so", "so did"], correctIndex: 0, explanation: "'did so' = did that / did what she asked. 'Do so' is a formal substitute for a previously mentioned verb phrase." },
        { id: "e2q5", prompt: "\"Are you going to apply for the position?\" \"I'm considering ___.\" (the action)", options: ["doing so", "so doing", "to do so"], correctIndex: 0, explanation: "'doing so' after 'considering' (gerund required): considering + doing so." },
        { id: "e2q6", prompt: "\"Is the project on schedule?\" \"I believe ___ — though I should double-check.\" (positive belief)", options: ["so", "not", "it is so"], correctIndex: 0, explanation: "'I believe so' = I believe that it is. Clean substitution." },
        { id: "e2q7", prompt: "\"You'll need to sign this document.\" \"If required to ___, I'd like legal advice first.\"", options: ["do so", "do it so", "so do"], correctIndex: 0, explanation: "'do so' = do that / sign the document. Formal and avoids repetition." },
        { id: "e2q8", prompt: "\"Has the report been submitted?\" \"I'm not sure. I ___.\" (don't think it has)", options: ["think not", "don't think so", "Both are correct"], correctIndex: 2, explanation: "Both 'I think not' (formal) and 'I don't think so' (neutral) are correct here." },
        { id: "e2q9", prompt: "\"Will they cancel the event?\" \"It appears ___.\" (you think they will)", options: ["so", "not", "they will"], correctIndex: 0, explanation: "'It appears so' = it seems they will cancel it." },
        { id: "e2q10", prompt: "\"You promised to call me.\" \"I know — I should ___ sooner.\"", options: ["have done so", "have done it so", "do so"], correctIndex: 0, explanation: "'have done so' = have done that. Perfect aspect: should have done so (sooner than I did)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Ellipsis: omitting repeated elements",
      instructions: "Ellipsis means omitting words that are clear from context. Choose the sentence where ellipsis is correctly applied — or identify what has been omitted.",
      questions: [
        { id: "e3q1", prompt: "Which sentence uses correct ellipsis in the second clause?", options: ["She can sing well, and her sister can sing well too.", "She can sing well, and her sister can too.", "She can sing well, and her sister too can."], correctIndex: 1, explanation: "Correct ellipsis: '…and her sister can too' — 'sing well' is omitted after the auxiliary." },
        { id: "e3q2", prompt: "What has been omitted in: 'He studied hard and passed, but didn't celebrate.'?", options: ["'he' is omitted before 'passed' and 'didn't celebrate'", "The subject 'he' and auxiliary 'did' before 'celebrate' are omitted", "Nothing — no ellipsis"], correctIndex: 0, explanation: "Subject ellipsis in coordinated clauses: 'he' omitted before 'passed' and before 'didn't celebrate'." },
        { id: "e3q3", prompt: "Which is grammatically correct?", options: ["I wanted to call her, but didn't want to.", "I wanted to call her, but didn't to.", "I wanted to call her, but didn't want."], correctIndex: 0, explanation: "Correct ellipsis: 'didn't want to' — the infinitive is retained as a dummy (bare infinitive dropped, 'to' stays)." },
        { id: "e3q4", prompt: "\"Did you finish the report?\" \"I did, yes.\" What is omitted?", options: ["'finish the report' is omitted after 'did'", "'yes' replaces 'finish the report'", "Nothing is omitted"], correctIndex: 0, explanation: "VP ellipsis: 'I did (finish the report)' — the main verb phrase is dropped after the auxiliary." },
        { id: "e3q5", prompt: "Which sentence shows correct gapping (omitting repeated verb in parallel clauses)?", options: ["Tom ordered pasta and Maria ordered risotto.", "Tom ordered pasta and Maria risotto.", "Tom ordered pasta and Maria had risotto."], correctIndex: 1, explanation: "Gapping: 'Tom ordered pasta and Maria [ordered] risotto' — the repeated verb is dropped from the second clause." },
        { id: "e3q6", prompt: "\"Are you coming?\" \"If possible, ___!\" Which completes the ellipsis?", options: ["I will come", "yes", "I will"], correctIndex: 2, explanation: "'I will' = I will [come], with 'come' elided after the modal." },
        { id: "e3q7", prompt: "Which correctly uses to-infinitive ellipsis?", options: ["She left early because she wanted to.", "She left early because she wanted.", "She left early because she wanted to leave."], correctIndex: 0, explanation: "Retained 'to' (stranded): 'she wanted to [leave]' — the infinitive is omitted but 'to' is kept." },
        { id: "e3q8", prompt: "Identify the sentence with incorrect ellipsis.", options: ["He arrived late, and so did she.", "She doesn't like coffee, and neither does he.", "They were happy, and she also was."], correctIndex: 2, explanation: "'she also was' is unnatural — correct form: 'so was she' (so + auxiliary + subject)." },
        { id: "e3q9", prompt: "Which sentence correctly uses auxiliary substitution?", options: ["I haven't called her yet, but I plan to.", "I haven't called her yet, but I plan to do.", "I haven't called her yet, but I plan."], correctIndex: 0, explanation: "'I plan to [call her]' — infinitive phrase retained as 'to' after 'plan'." },
        { id: "e3q10", prompt: "\"You should apologise.\" \"I know I ___.\"\nWhich completes the substitution correctly?", options: ["should", "should to", "should apologise"], correctIndex: 0, explanation: "Auxiliary substitution: 'I know I should [apologise]' — only the modal is needed." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using ellipsis or substitution",
      instructions: "Shorten each response using the substitution or ellipsis structure shown in brackets. Write the complete shortened response (lowercase).",
      questions: [
        { id: "e4q1", prompt: "\"Do you think the package will arrive today?\" \"I think the package will arrive today.\" (so-substitution)", correct: "i think so", explanation: "'I think so' replaces 'I think the package will arrive today'." },
        { id: "e4q2", prompt: "\"Is the conference cancelled?\" \"I hope the conference isn't cancelled.\" (hope not-substitution)", correct: "i hope not", explanation: "'I hope not' replaces the full negative clause." },
        { id: "e4q3", prompt: "\"She loves hiking.\" \"He loves hiking too.\" (so + auxiliary agreement)", correct: "so does he", explanation: "'So does he' = he loves hiking too (simple present, lexical verb → does)." },
        { id: "e4q4", prompt: "\"I don't enjoy commuting.\" \"My colleague doesn't enjoy commuting either.\" (neither + auxiliary)", correct: "neither does my colleague", explanation: "Neither + does + my colleague = agreeing with a negative statement." },
        { id: "e4q5", prompt: "\"The manager asked her to draft the proposal, and she drafted the proposal without delay.\" (do so)", correct: "the manager asked her to draft the proposal, and she did so without delay", explanation: "'did so' replaces 'drafted the proposal' — formal substitution." },
        { id: "e4q6", prompt: "\"I was supposed to attend but I didn't attend.\" (VP ellipsis)", correct: "i was supposed to attend but i didn't", explanation: "VP ellipsis: 'didn't [attend]' — the verb is omitted after the auxiliary." },
        { id: "e4q7", prompt: "\"Will you support the proposal?\" \"I'm inclined to support the proposal.\" (to-infinitive ellipsis)", correct: "i'm inclined to", explanation: "'I'm inclined to [support it]' — the infinitive is dropped but 'to' is retained." },
        { id: "e4q8", prompt: "\"They haven't signed the contract yet.\" \"We haven't signed the contract yet either.\" (neither + auxiliary)", correct: "neither have we", explanation: "Neither + have + we = agreeing with a negative present perfect." },
        { id: "e4q9", prompt: "\"Has the invoice been sent?\" \"I believe the invoice has been sent.\" (so-substitution)", correct: "i believe so", explanation: "'I believe so' = I believe it has." },
        { id: "e4q10", prompt: "\"She wanted to leave early, and she left early.\" (gapping/subject ellipsis)", correct: "she wanted to leave early, and did", explanation: "Subject + verb gapping: 'and [she] did [leave early]' — both subject and verb phrase elided." },
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
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo: n }); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Ellipsis &amp; Substitution</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Ellipsis &amp;{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Substitution</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        <b>Ellipsis</b> omits words already clear from context (<i>She can sing, and her sister can too</i>). <b>Substitution</b> replaces them with a pro-form: <i>so/not</i> for clauses (<i>I think so</i>), <i>do so</i> for verb phrases, and <i>so/neither + auxiliary</i> for agreement (<i>So do I / Neither did she</i>). These are markers of advanced, fluent English.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-c1-ellipsis-substitution" subject="Ellipsis and Substitution" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                            <div className="font-bold text-slate-900 whitespace-pre-line">{q.prompt}</div>
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
          <SpeedRound gameId="grammar-c1-ellipsis-substitution" subject="Ellipsis and Substitution" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/nominalisation" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Nominalisation →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Ellipsis &amp; Substitution (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { title: "So + auxiliary + subject (positive agreement)", body: "Agree with a positive statement. The auxiliary matches the tense/verb of the original.", ex: "\"I love jazz.\" → \"So do I.\" / \"She's been promoted.\" → \"So has Tom.\"" },
          { title: "Neither/Nor + auxiliary + subject (negative agreement)", body: "Agree with a negative statement.", ex: "\"I can't drive.\" → \"Neither can I.\" / \"We didn't enjoy it.\" → \"Nor did we.\"" },
          { title: "So / Not substitution (I think/hope/believe/expect)", body: "Replace a whole clause after think, hope, believe, expect, suppose, be afraid.", ex: "\"Is it ready?\" \"I think so.\" / \"Will it rain?\" \"I hope not.\"" },
          { title: "Do so (formal VP substitution)", body: "Replace a verb phrase formally, especially after request/instruction verbs.", ex: "She asked me to submit the form, and I did so immediately." },
          { title: "VP ellipsis (omitting the main verb phrase)", body: "Omit repeated verb phrases; retain the auxiliary or 'to'.", ex: "\"Did you call her?\" \"I did.\" / \"I wanted to go, but she didn't want to.\"" },
          { title: "Subject ellipsis in coordinated clauses", body: "Omit the subject when it's the same across clauses joined by and/but.", ex: "He arrived late and [he] left early. / She locked the door but [she] forgot the keys." },
          { title: "Gapping (omitting repeated verb)", body: "In parallel structures, the repeated verb in the second clause is dropped.", ex: "Tom ordered pasta and Maria [ordered] risotto." },
        ].map(({ title, body, ex }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-1">{title}</div>
            <div className="text-slate-600 text-sm mb-2">{body}</div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Common pitfalls</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div><b>so am I</b> vs <b>so do I</b>: match the auxiliary — use <i>am</i> only with <i>to be</i>.</div>
          <div><b>I don't think so</b> = natural; <b>I think not</b> = formal/literary.</div>
          <div><b>do so</b> is formal; in speech, <b>do it / do that</b> is more common.</div>
          <div>Retained <b>to</b>: "I wanted to [go]" — 'to' stays even when the infinitive is dropped.</div>
        </div>
      </div>
    </div>
  );
}
