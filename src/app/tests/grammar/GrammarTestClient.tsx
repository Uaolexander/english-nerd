"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import CertificateModal from "./CertificateModal";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import { useLiveSync } from "@/lib/useLiveSync";

type Level = "A1" | "A2" | "B1" | "B2" | "C1";
type Topic =
  | "To be"
  | "Articles"
  | "Present Simple"
  | "Present Continuous"
  | "There is/are"
  | "Past Simple"
  | "Past Perfect"
  | "Present Perfect"
  | "Future"
  | "Modals"
  | "Conditionals"
  | "Passive"
  | "Reported Speech"
  | "Gerunds/Infinitives"
  | "Relative Clauses"
  | "Comparatives"
  | "Prepositions"
  | "Question Tags"
  | "Wishes"
  | "Causative"
  | "Conjunctions"
  | "Advanced";

type Q = {
  id: string;
  level: Level;
  topic: Topic;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const LETTER = ["A", "B", "C", "D"] as const;

const LEVEL_COLOR: Record<Level, string> = {
  A1: "bg-emerald-100 text-emerald-700 border-emerald-200",
  A2: "bg-teal-100 text-teal-700 border-teal-200",
  B1: "bg-sky-100 text-sky-700 border-sky-200",
  B2: "bg-violet-100 text-violet-700 border-violet-200",
  C1: "bg-orange-100 text-orange-700 border-orange-200",
};

const LEVEL_LABEL: Record<Level, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-Intermediate",
  C1: "Advanced",
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function GrammarTestClient() {
  const questions: Q[] = useMemo(
    () => [
      // A1
      { id: "q1", level: "A1", topic: "To be", prompt: "I ___ a student.", options: ["am", "is", "are"], correctIndex: 0, explanation: "Use 'am' with I → I am." },
      { id: "q2", level: "A1", topic: "There is/are", prompt: "___ a supermarket near here.", options: ["There is", "There are", "There am"], correctIndex: 0, explanation: "Use 'There is' with singular nouns." },
      { id: "q3", level: "A1", topic: "Articles", prompt: "I have ___ apple.", options: ["a", "an", "the"], correctIndex: 1, explanation: "Use 'an' before vowel sounds (an apple)." },
      { id: "q4", level: "A1", topic: "Present Simple", prompt: "She ___ coffee every morning.", options: ["drink", "drinks", "drinking"], correctIndex: 1, explanation: "3rd person singular takes -s → she drinks." },
      { id: "q5", level: "A1", topic: "Present Continuous", prompt: "They ___ TV right now.", options: ["watch", "are watching", "watches"], correctIndex: 1, explanation: "Now/right now → present continuous (are watching)." },
      // A2
      { id: "q6", level: "A2", topic: "Past Simple", prompt: "We ___ to the cinema yesterday.", options: ["go", "went", "gone"], correctIndex: 1, explanation: "Past simple of go is went." },
      { id: "q7", level: "A2", topic: "Modals", prompt: "You ___ smoke here. (It's forbidden.)", options: ["must", "mustn't", "should"], correctIndex: 1, explanation: "Mustn't = prohibition (not allowed)." },
      { id: "q8", level: "A2", topic: "Articles", prompt: "___ sun is very bright today.", options: ["A", "An", "The"], correctIndex: 2, explanation: "We use 'the' for unique things (the sun)." },
      { id: "q9", level: "A2", topic: "Present Simple", prompt: "Do you ___ English at work?", options: ["use", "uses", "used"], correctIndex: 0, explanation: "After 'do' use base form → use." },
      { id: "q10", level: "A2", topic: "Present Continuous", prompt: "I can't talk. I ___ dinner.", options: ["cook", "am cooking", "cooked"], correctIndex: 1, explanation: "Action happening now → am cooking." },
      // B1
      { id: "q11", level: "B1", topic: "Present Perfect", prompt: "I ___ finished my homework.", options: ["have", "am", "did"], correctIndex: 0, explanation: "Present perfect: have/has + past participle." },
      { id: "q12", level: "B1", topic: "Present Perfect", prompt: "She has ___ to London twice.", options: ["go", "went", "been"], correctIndex: 2, explanation: "Have/has been to = visited and returned." },
      { id: "q13", level: "B1", topic: "Conditionals", prompt: "If it rains, we ___ stay at home.", options: ["will", "would", "are"], correctIndex: 0, explanation: "First conditional: If + present, will + base." },
      { id: "q14", level: "B1", topic: "Relative Clauses", prompt: "That's the man ___ lives next door.", options: ["who", "where", "what"], correctIndex: 0, explanation: "Who for people in relative clauses." },
      { id: "q15", level: "B1", topic: "Past Simple", prompt: "When I was a child, I ___ play outside every day.", options: ["used to", "use to", "am used to"], correctIndex: 0, explanation: "Used to + base verb for past habits." },
      // B2
      { id: "q16", level: "B2", topic: "Gerunds/Infinitives", prompt: "I enjoy ___ new languages.", options: ["to learn", "learn", "learning"], correctIndex: 2, explanation: "Enjoy + -ing (enjoy doing)." },
      { id: "q17", level: "B2", topic: "Passive", prompt: "The new bridge ___ built next year.", options: ["is", "will be", "will"], correctIndex: 1, explanation: "Future passive: will be + past participle." },
      { id: "q18", level: "B2", topic: "Reported Speech", prompt: "He said he ___ busy.", options: ["is", "was", "will be"], correctIndex: 1, explanation: "Reported speech backshift: is → was." },
      { id: "q19", level: "B2", topic: "Present Perfect", prompt: "I've lived here ___ 2021.", options: ["for", "since", "during"], correctIndex: 1, explanation: "Since + starting point (since 2021)." },
      { id: "q20", level: "B2", topic: "Modals", prompt: "You ___ told me earlier! (regret/criticism)", options: ["should", "shouldn't", "should have"], correctIndex: 2, explanation: "Should have + past participle = criticism about the past." },
      // C1
      { id: "q21", level: "C1", topic: "Conditionals", prompt: "If I ___ you, I would take the offer.", options: ["were", "was", "am"], correctIndex: 0, explanation: "Second conditional often uses 'were' for all persons (If I were…)." },
      { id: "q22", level: "C1", topic: "Advanced", prompt: "Hardly ___ we arrived when it started to snow.", options: ["had", "have", "did"], correctIndex: 0, explanation: "Inversion after negative adverbs: Hardly had we arrived…" },
      { id: "q23", level: "C1", topic: "Passive", prompt: "He ___ to have been fired last week.", options: ["is said", "is said that", "said"], correctIndex: 0, explanation: "Reporting structures: He is said to…" },
      { id: "q24", level: "C1", topic: "Gerunds/Infinitives", prompt: "She denied ___ the document.", options: ["to sign", "signing", "sign"], correctIndex: 1, explanation: "Deny + -ing (deny doing)." },
      { id: "q25", level: "C1", topic: "Relative Clauses", prompt: "The report, ___ was published yesterday, caused a debate.", options: ["that", "which", "what"], correctIndex: 1, explanation: "Non-defining relative clause uses which (with commas)." },
      // Mixed
      { id: "q26", level: "B1", topic: "Past Simple", prompt: "I ___ him since Monday.", options: ["didn't see", "haven't seen", "wasn't seeing"], correctIndex: 1, explanation: "Since + time period → present perfect (haven't seen)." },
      { id: "q27", level: "B2", topic: "Reported Speech", prompt: "She asked me where I ___.", options: ["live", "lived", "have lived"], correctIndex: 1, explanation: "Reported questions backshift: live → lived." },
      { id: "q28", level: "A2", topic: "There is/are", prompt: "How many students ___ in your class?", options: ["there is", "there are", "are there"], correctIndex: 2, explanation: "Question form: How many … are there?" },
      { id: "q29", level: "B2", topic: "Passive", prompt: "My phone ___ stolen yesterday.", options: ["was", "were", "is"], correctIndex: 0, explanation: "Past passive: was/were + past participle." },
      { id: "q30", level: "A2", topic: "Articles", prompt: "I saw ___ movie you recommended.", options: ["a", "an", "the"], correctIndex: 2, explanation: "The = specific thing both people know." },

      // A1 extra
      { id: "q31", level: "A1", topic: "Comparatives", prompt: "My bag is ___ than yours.", options: ["more heavy", "heavier", "heaviest"], correctIndex: 1, explanation: "Short adjectives form comparatives with -er: heavy → heavier." },
      { id: "q32", level: "A1", topic: "Present Simple", prompt: "He ___ to school by bus every day.", options: ["go", "goes", "going"], correctIndex: 1, explanation: "3rd person singular: he goes (-es after consonant + o)." },
      { id: "q33", level: "A1", topic: "To be", prompt: "We ___ very happy to see you.", options: ["am", "is", "are"], correctIndex: 2, explanation: "We → are." },
      { id: "q34", level: "A1", topic: "Articles", prompt: "Can I have ___ orange juice, please?", options: ["a", "an", "the"], correctIndex: 1, explanation: "An before vowel sounds: an orange juice." },
      { id: "q35", level: "A1", topic: "Prepositions", prompt: "The keys are ___ the table.", options: ["in", "on", "at"], correctIndex: 1, explanation: "On = on a surface (on the table)." },

      // A2 extra
      { id: "q36", level: "A2", topic: "Comparatives", prompt: "It was ___ film I've ever seen.", options: ["the most boring", "the boringer", "most boring"], correctIndex: 0, explanation: "Long adjectives: the most boring (superlative with the most)." },
      { id: "q37", level: "A2", topic: "Future", prompt: "Look at those clouds. It ___ rain.", options: ["is going to", "will going to", "going to"], correctIndex: 0, explanation: "Going to = prediction based on present evidence (clouds → rain)." },
      { id: "q38", level: "A2", topic: "Question Tags", prompt: "You're coming to the party, ___?", options: ["are you", "aren't you", "isn't it"], correctIndex: 1, explanation: "Positive statement → negative tag: You're coming, aren't you?" },
      { id: "q39", level: "A2", topic: "Past Simple", prompt: "She ___ her keys, so she couldn't get in.", options: ["loses", "lost", "has lost"], correctIndex: 1, explanation: "Past simple for a completed event in the past." },
      { id: "q40", level: "A2", topic: "Prepositions", prompt: "She's been working here ___ 2019.", options: ["for", "since", "during"], correctIndex: 1, explanation: "Since + specific starting point: since 2019." },

      // B1 extra
      { id: "q41", level: "B1", topic: "Past Perfect", prompt: "By the time I arrived, she ___ already left.", options: ["has", "had", "was"], correctIndex: 1, explanation: "Past perfect = action completed before another past event: had left." },
      { id: "q42", level: "B1", topic: "Future", prompt: "At 8 pm tonight I ___ for my exam.", options: ["study", "will be studying", "am studying"], correctIndex: 1, explanation: "Future continuous = action in progress at a specific future time." },
      { id: "q43", level: "B1", topic: "Conjunctions", prompt: "She was exhausted, ___ she kept working.", options: ["so", "however", "but"], correctIndex: 2, explanation: "But = contrast within one sentence (she was tired BUT kept working)." },
      { id: "q44", level: "B1", topic: "Conditionals", prompt: "If he had more money, he ___ buy a bigger house.", options: ["will", "would", "can"], correctIndex: 1, explanation: "Second conditional: If + past simple, would + bare infinitive." },
      { id: "q45", level: "B1", topic: "Prepositions", prompt: "She's really good ___ playing chess.", options: ["in", "at", "on"], correctIndex: 1, explanation: "Good at + gerund: good at playing." },
      { id: "q46", level: "B1", topic: "Modals", prompt: "You ___ be tired after such a long journey!", options: ["should", "must", "ought"], correctIndex: 1, explanation: "Must = strong deduction based on evidence." },
      { id: "q47", level: "B1", topic: "Question Tags", prompt: "He hasn't called yet, ___?", options: ["hasn't he", "has he", "did he"], correctIndex: 1, explanation: "Negative statement → positive tag: hasn't called, has he?" },

      // B2 extra
      { id: "q48", level: "B2", topic: "Wishes", prompt: "I wish I ___ speak French fluently. (I can't)", options: ["can", "could", "would"], correctIndex: 1, explanation: "Wish + could = desired present ability (subjunctive/past form)." },
      { id: "q49", level: "B2", topic: "Causative", prompt: "She had her car ___. (someone else did it)", options: ["repair", "repaired", "repairing"], correctIndex: 1, explanation: "Causative: have + object + past participle → had her car repaired." },
      { id: "q50", level: "B2", topic: "Past Perfect", prompt: "If they ___ the instructions, the accident wouldn't have happened.", options: ["follow", "followed", "had followed"], correctIndex: 2, explanation: "Third conditional: if + past perfect → would have. If they had followed." },
      { id: "q51", level: "B2", topic: "Gerunds/Infinitives", prompt: "I remember ___ the door — I'm sure it's locked.", options: ["to lock", "lock", "locking"], correctIndex: 2, explanation: "Remember + gerund = memory of a past event. Remember locking." },
      { id: "q52", level: "B2", topic: "Passive", prompt: "The vaccine ___ to millions of people last year.", options: ["administered", "was administered", "has administered"], correctIndex: 1, explanation: "Past passive: was/were + past participle → was administered." },
      { id: "q53", level: "B2", topic: "Conjunctions", prompt: "___ she was intelligent, she failed the exam.", options: ["Despite", "However", "Although"], correctIndex: 2, explanation: "Although + clause (subject + verb). Despite + noun/gerund." },
      { id: "q54", level: "B2", topic: "Conditionals", prompt: "If he ___ earlier, he would have caught the train.", options: ["left", "has left", "had left"], correctIndex: 2, explanation: "Third conditional: if + past perfect → had left." },
      { id: "q55", level: "B2", topic: "Reported Speech", prompt: "She told me she ___ the report the following day.", options: ["will finish", "finishes", "would finish"], correctIndex: 2, explanation: "Backshift in reported speech: will → would." },

      // C1 extra
      { id: "q56", level: "C1", topic: "Advanced", prompt: "Not until the 19th century ___ this technique widespread.", options: ["became", "did become", "become"], correctIndex: 1, explanation: "Inversion after negative adverbs: Not until… did + subject + infinitive." },
      { id: "q57", level: "C1", topic: "Advanced", prompt: "___ she to apply now, she would certainly be shortlisted.", options: ["If", "Were", "Had"], correctIndex: 1, explanation: "Were + subject + to-infinitive = formal inverted conditional (2nd type)." },
      { id: "q58", level: "C1", topic: "Advanced", prompt: "It is essential that every participant ___ the waiver form.", options: ["signs", "sign", "signed"], correctIndex: 1, explanation: "Mandative subjunctive: essential that + bare infinitive (sign, not signs)." },
      { id: "q59", level: "C1", topic: "Advanced", prompt: "The director is believed ___ the company last month.", options: ["to leave", "to have left", "having left"], correctIndex: 1, explanation: "Passive reporting + past reference: is believed + to have + pp." },
      { id: "q60", level: "C1", topic: "Advanced", prompt: "___ as it may seem, the data fully supports this conclusion.", options: ["Strange", "Strangely", "However strange"], correctIndex: 0, explanation: "Adjective + as + subject + verb = concession clause: Strange as it may seem = although it seems strange." },
    ],
    []
  );

  const total = questions.length;

  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [showCert, setShowCert] = useState(false);

  const { isLive, broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<string, number | null>);
    setSubmitted(payload.checked as boolean);
    setIdx(payload.exNo as number);
    setStarted(true);
  });

  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = questions[idx];

  const score = useMemo(() => {
    let correct = 0;
    let answered = 0;
    for (const q of questions) {
      const a = answers[q.id];
      if (a === null || a === undefined) continue;
      answered++;
      if (a === q.correctIndex) correct++;
    }
    const percent = Math.round((correct / total) * 100);
    return { correct, answered, total, percent };
  }, [answers, questions, total]);

  const { save } = useProgress();
  const isPro = useIsPro();
  useEffect(() => {
    if (submitted) {
      const answerData = questions.map((q, i) => ({
        questionIndex: i,
        questionText: `[${q.topic}] ${q.prompt}`,
        userAnswer: answers[q.id] !== undefined && answers[q.id] !== null ? q.options[answers[q.id]!] : "",
        correctAnswer: q.options[q.correctIndex],
        isCorrect: answers[q.id] === q.correctIndex,
      }));
      save(undefined, score.percent, score.total, answerData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const suggestedLevel: Level = useMemo(() => {
    const p = score.percent;
    if (p < 30) return "A1";
    if (p < 45) return "A2";
    if (p < 60) return "B1";
    if (p < 75) return "B2";
    return "C1";
  }, [score.percent]);

  const topicStats = useMemo(() => {
    const map = new Map<Topic, { correct: number; total: number }>();
    for (const q of questions) {
      if (!map.has(q.topic)) map.set(q.topic, { correct: 0, total: 0 });
      const t = map.get(q.topic)!;
      t.total += 1;
      const a = answers[q.id];
      if (submitted && a === q.correctIndex) t.correct += 1;
    }
    const rows = Array.from(map.entries()).map(([topic, v]) => ({
      topic,
      correct: v.correct,
      total: v.total,
      percent: v.total ? Math.round((v.correct / v.total) * 100) : 0,
    }));
    rows.sort((a, b) => a.percent - b.percent);
    return rows;
  }, [answers, questions, submitted]);

  const circumference = 2 * Math.PI * 54;
  const dash = useMemo(() => {
    const p = clamp(score.percent, 0, 100);
    return circumference - (p / 100) * circumference;
  }, [score.percent, circumference]);

  function start() {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setStarted(true);
    setSubmitted(false);
    setIdx(0);
    setAnswers({});
    broadcast({ answers: {}, checked: false, exNo: 0 });
  }

  function pick(optionIndex: number) {
    setAnswers((prev) => {
      const n = { ...prev, [current.id]: optionIndex };
      broadcast({ answers: n, checked: false, exNo: idx });
      return n;
    });

    // Cancel any previous pending auto-advance
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);

    // Auto-advance after 420ms (gives user time to see selection)
    autoAdvanceRef.current = setTimeout(() => {
      setIdx((currentIdx) => {
        if (currentIdx < total - 1) {
          broadcast({ answers, checked: false, exNo: currentIdx + 1 });
          return currentIdx + 1;
        }
        // On last question, auto-submit
        setSubmitted(true);
        broadcast({ answers, checked: true, exNo: currentIdx });
        return currentIdx;
      });
    }, 420);
  }

  function skip() {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setAnswers((prev) => { const n = { ...prev, [current.id]: null }; broadcast({ answers: n, checked: false, exNo: idx }); return n; });
    if (idx < total - 1) setIdx((x) => x + 1);
  }

  function next() {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (idx < total - 1) { const newIdx = idx + 1; setIdx(newIdx); broadcast({ answers, checked: false, exNo: newIdx }); }
  }

  function prev() {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (idx > 0) setIdx((x) => x - 1);
  }

  function submit() {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setSubmitted(true);
  }

  const topWeakAreas = topicStats.filter((t) => t.total >= 2).slice(0, 4);
  const answeredCount = Object.keys(answers).length;

  const topicToLesson: Record<string, string> = {
    "To be": "/grammar/a1/to-be-am-is-are",
    "There is/are": "/grammar/a1/there-is-there-are",
    "Articles": "/grammar/a1/articles-a-an",
    "Present Simple": "/grammar/a1/present-simple-i-you-we-they",
    "Past Simple": "/grammar/a2/past-simple",
    "Present Perfect": "/grammar/b1/present-perfect",
    "Modals": "/grammar/a2/modals-basics",
    "Conditionals": "/grammar/b1/conditionals-1",
    "Passive": "/grammar/b2/passive-voice",
    "Reported Speech": "/grammar/b2/reported-speech",
    "Gerunds/Infinitives": "/grammar/b2/gerunds-infinitives",
    "Relative Clauses": "/grammar/b1/relative-clauses",
    "Advanced": "/grammar/c1/advanced-structures",
  };

  const levelPath = suggestedLevel === "A1" ? "/grammar/a1"
    : suggestedLevel === "A2" ? "/grammar/a2"
    : suggestedLevel === "B1" ? "/grammar/b1"
    : suggestedLevel === "B2" ? "/grammar/b2"
    : "/grammar/c1";

  const isLastQuestion = idx === total - 1;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF0] via-white to-[#FAFAF8] text-[#0F0F12]">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="mb-2 text-sm text-black/45">
          <a href="/" className="hover:text-black/75 transition-colors">Home</a>
          <span className="mx-2 text-black/25">/</span>
          <a href="/tests" className="hover:text-black/75 transition-colors">Tests</a>
          <span className="mx-2 text-black/25">/</span>
          <span className="text-black/65">Grammar Level Test</span>
        </div>

        <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
          Grammar{" "}
          <span className="rounded-lg bg-[#F5DA20] px-2 py-0.5 text-[#0F0F12]">
            Level Test
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-black/50">
          60 questions · A1 to C1 · instant score · no registration
        </p>

        {/* ── LANDING ─────────────────────────────────────── */}
        {!started && (
          <div className={`mt-10 grid gap-6 ${!isPro ? "lg:grid-cols-[1fr_300px]" : ""}`}>
            <section className="rounded-2xl border border-black/10 bg-white/90 backdrop-blur p-8 shadow-sm">

              {/* Level pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(["A1", "A2", "B1", "B2", "C1"] as Level[]).map((l) => (
                  <span key={l} className={`rounded-full border px-3 py-1 text-xs font-bold ${LEVEL_COLOR[l]}`}>
                    {l}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl font-black md:text-3xl text-[#0F0F12]">
                Find your CEFR level in{" "}
                <span className="rounded bg-[#F5DA20] px-1.5 py-0.5 text-[#0F0F12]">15–20 minutes</span>
              </h2>
              <p className="mt-3 max-w-xl text-black/55">
                Answer 60 multiple-choice questions covering grammar from beginner
                to advanced. You&apos;ll get your score, estimated level, and a breakdown
                of your weak areas — instantly.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <StatCard label="Questions" value="60" />
                <StatCard label="Format" value="A / B / C" />
                <StatCard label="Result" value="Instant" />
              </div>

              {/* CEFR scale */}
              <div className="mt-6 rounded-xl border border-black/8 bg-black/[0.02] p-4">
                <div className="mb-2 text-xs font-bold text-black/35 uppercase tracking-wide">CEFR Scale covered</div>
                <div className="flex gap-1">
                  {(["A1", "A2", "B1", "B2", "C1"] as Level[]).map((l, i) => (
                    <div key={l} className="flex-1">
                      <div className={`h-2 rounded-full ${
                        i === 0 ? "rounded-l-full" : i === 4 ? "rounded-r-full" : ""
                      } ${
                        l === "A1" ? "bg-emerald-400" :
                        l === "A2" ? "bg-teal-400" :
                        l === "B1" ? "bg-sky-400" :
                        l === "B2" ? "bg-violet-400" :
                        "bg-orange-400"
                      }`} />
                      <div className="mt-1 text-center text-[10px] font-bold text-black/35">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={start}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#F5DA20] px-7 py-3.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm"
                >
                  Start grammar test
                </button>
                <a
                  href="/grammar/a1"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-7 py-3.5 text-sm font-semibold text-black/50 transition hover:bg-black/5"
                >
                  Browse lessons instead
                </a>
              </div>

              <p className="mt-5 text-xs text-black/30">
                This is a quick level estimate, not an official CEFR certificate.
              </p>
            </section>

            <AdUnit variant="sidebar-test" />
          </div>
        )}

        {/* ── QUESTION ─────────────────────────────────────── */}
        {started && !submitted && (
          <div className={`mt-10 grid gap-6 ${!isPro ? "lg:grid-cols-[1fr_300px]" : ""}`}>
            <section className="overflow-hidden rounded-2xl border border-black/10 bg-white/90 backdrop-blur shadow-sm">

              {/* Question header */}
              <div className="border-b border-black/8 bg-white/95 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-[#0F0F12]">
                      {idx + 1}
                      <span className="font-normal text-black/30">/{total}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prev}
                      disabled={idx === 0}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-bold text-black/45 disabled:opacity-30 hover:bg-black/5 transition"
                    >
                      ←
                    </button>
                    {isLastQuestion ? (
                      <button
                        onClick={submit}
                        className="rounded-xl bg-[#F5DA20] px-5 py-2 text-sm font-black text-black hover:opacity-90 transition"
                      >
                        Finish ✓
                      </button>
                    ) : (
                      <button
                        onClick={next}
                        className="rounded-xl border border-black/10 bg-white px-5 py-2 text-sm font-bold text-black/50 hover:bg-black/5 transition"
                      >
                        Next →
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
                  <div
                    className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                    style={{ width: `${Math.round(((idx + 1) / total) * 100)}%` }}
                  />
                </div>

                {/* Mini dot indicators */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {questions.map((q, i) => {
                    const answered = answers[q.id] !== undefined;
                    const isCurrent = i === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
                          setIdx(i);
                        }}
                        className={`h-2 rounded-full transition-all duration-200 ${
                          isCurrent
                            ? "w-5 bg-[#0F0F12]"
                            : answered
                            ? "w-2 bg-black/40"
                            : "w-2 bg-black/12"
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Auto-advance hint */}
                <p className="mt-2 text-[10px] text-black/30">
                  Selecting an answer moves to the next question automatically.
                </p>
              </div>

              {/* Question body */}
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-black leading-snug text-[#0F0F12] md:text-2xl">
                  {current.prompt}
                </h2>

                <div className="mt-6 grid gap-3">
                  {current.options.map((opt, i) => {
                    const chosen = answers[current.id];
                    const active = chosen === i;
                    return (
                      <button
                        key={i}
                        onClick={() => pick(i)}
                        className={`group flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all ${
                          active
                            ? "border-[#F5DA20] bg-[#FFFBE6] shadow-sm"
                            : "border-black/10 bg-white hover:border-black/20 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition ${
                          active
                            ? "bg-[#F5DA20] text-black"
                            : "bg-black/6 text-black/30 group-hover:bg-black/10 group-hover:text-black/60"
                        }`}>
                          {LETTER[i]}
                        </span>
                        <span className={`font-semibold transition ${active ? "text-[#0F0F12]" : "text-black/60 group-hover:text-[#0F0F12]"}`}>
                          {opt}
                        </span>
                        {active && (
                          <span className="ml-auto text-sm font-black text-black/70">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={skip}
                    className="rounded-2xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-black/40 hover:bg-black/5 transition"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => {
                      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
                      setStarted(false);
                      setSubmitted(false);
                      setIdx(0);
                      setAnswers({});
                    }}
                    className="rounded-2xl border border-transparent px-5 py-2.5 text-sm font-semibold text-black/25 hover:text-black/50 transition"
                  >
                    Restart
                  </button>
                  <span className="ml-auto text-xs text-black/30">
                    {answeredCount} of {total} answered
                  </span>
                </div>
              </div>
            </section>

            <AdUnit variant="sidebar-test" />
          </div>
        )}

        {/* ── RESULTS ─────────────────────────────────────── */}
        {submitted && (
          <div className={`mt-10 grid gap-6 ${!isPro ? "lg:grid-cols-[1fr_300px]" : ""}`}>
            <section className="overflow-hidden rounded-2xl border border-black/10 bg-white/90 backdrop-blur shadow-sm">

              {/* Score header */}
              <div className="border-b border-black/8 bg-white/95 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-8">

                  {/* SVG ring */}
                  <div className="relative flex-shrink-0">
                    <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="54"
                        fill="none"
                        stroke="#F5DA20"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dash}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-[#0F0F12]">{score.percent}%</span>
                      <span className="text-xs text-black/40">{score.correct}/{score.total}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold text-black/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F5DA20]" />
                      Estimated level
                    </div>

                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      <span className="rounded-xl bg-[#F5DA20] px-4 py-1.5 text-4xl font-black text-[#0F0F12]">
                        {suggestedLevel}
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-sm font-bold ${LEVEL_COLOR[suggestedLevel]}`}>
                        {LEVEL_LABEL[suggestedLevel]}
                      </span>
                    </div>

                    <p className="mt-2 text-black/45 text-sm">
                      {score.answered} answered · {score.total - score.answered} skipped · {score.correct} correct
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={levelPath}
                        className="inline-flex items-center rounded-2xl bg-[#F5DA20] px-5 py-2.5 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                      >
                        Go to {suggestedLevel} lessons →
                      </a>
                      {isPro ? (
                        <button
                          onClick={() => setShowCert(true)}
                          className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl px-6 py-2.5 text-sm font-black text-[#0F0F12] shadow-[0_0_0_2px_#F5DA20] transition-all duration-300 hover:shadow-[0_0_0_3px_#F5DA20,0_4px_20px_rgba(245,218,32,0.35)] hover:scale-[1.03] active:scale-[0.98]"
                          style={{ background: "linear-gradient(135deg, #F5DA20 0%, #FFE55C 50%, #F5DA20 100%)", backgroundSize: "200% 100%" }}
                        >
                          <span className="shimmer-auto pointer-events-none absolute inset-0 w-1/3 skew-x-[-20deg] bg-white/40" />
                          <span className="absolute inset-0 rounded-2xl ring-2 ring-[#F5DA20]/60 animate-ping opacity-40" />
                          <svg className="relative h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4"/><path d="M8 8v4l-3 7h14l-3-7V8"/><path d="M9 21h6"/>
                          </svg>
                          <span className="relative">Get Certificate</span>
                        </button>
                      ) : (
                        <a
                          href="/pro"
                          className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-2.5 text-sm font-bold text-black/50 transition hover:border-[#F5DA20] hover:text-black"
                        >
                          <svg className="h-4 w-4 text-[#b8a200]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          Get Certificate — Pro only
                        </a>
                      )}
                      <button
                        onClick={start}
                        className="inline-flex items-center rounded-2xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-black/45 hover:bg-black/5 transition"
                      >
                        Retake test
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-10">

                {/* Weak areas */}
                {topWeakAreas.length > 0 && (
                  <div>
                    <h3 className="text-lg font-black text-[#0F0F12]">Weak areas</h3>
                    <p className="mt-1 text-sm text-black/40">Focus on these first to improve fastest.</p>
                    <div className="mt-4 space-y-3">
                      {topWeakAreas.map((t) => {
                        const lesson = topicToLesson[t.topic];
                        return (
                          <div key={t.topic}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-black/70">{t.topic}</span>
                                {lesson && (
                                  <a
                                    href={lesson}
                                    className="rounded-full bg-[#F5DA20]/30 px-2 py-0.5 text-[10px] font-bold text-black/60 hover:bg-[#F5DA20]/60 transition"
                                  >
                                    Study →
                                  </a>
                                )}
                              </div>
                              <span className="text-black/35">{t.correct}/{t.total} · {t.percent}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/8">
                              <div
                                className="h-full rounded-full bg-[#F5DA20] transition-all"
                                style={{ width: `${t.percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Topic breakdown */}
                <div>
                  <h3 className="text-lg font-black text-[#0F0F12]">Topic breakdown</h3>
                  <p className="mt-1 text-sm text-black/40">Lower % = needs more practice.</p>
                  <div className="mt-4 grid gap-2">
                    {topicStats.map((t) => (
                      <div key={t.topic} className="flex items-center gap-4 rounded-xl border border-black/8 bg-white px-4 py-3">
                        <div className="w-36 shrink-0 text-sm font-semibold text-black/60">{t.topic}</div>
                        <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-black/8">
                          <div
                            className="h-full rounded-full bg-[#F5DA20]"
                            style={{ width: `${t.percent}%` }}
                          />
                        </div>
                        <div className="w-20 text-right text-xs text-black/35">{t.correct}/{t.total} · {t.percent}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Answer review */}
                <div>
                  <h3 className="text-lg font-black text-[#0F0F12]">Answer review</h3>
                  <p className="mt-1 text-sm text-black/40">Every question with the correct answer and explanation.</p>
                  <div className="mt-4 space-y-3">
                    {questions.map((q, i) => {
                      const a = answers[q.id];
                      const noAnswer = a === null || a === undefined;
                      const isCorrect = !noAnswer && a === q.correctIndex;
                      const isWrong = !noAnswer && !isCorrect;

                      return (
                        <div
                          key={q.id}
                          className={`rounded-2xl border p-5 ${
                            noAnswer
                              ? "border-black/8 bg-white"
                              : isCorrect
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-black/35">{i + 1}.</span>
                              <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${LEVEL_COLOR[q.level]}`}>
                                {q.level}
                              </span>
                              <span className="text-xs text-black/30">{q.topic}</span>
                            </div>
                            <span className={`text-xs font-black ${
                              noAnswer ? "text-amber-600" : isCorrect ? "text-emerald-600" : "text-red-600"
                            }`}>
                              {noAnswer ? "SKIPPED" : isCorrect ? "✓ CORRECT" : "✗ WRONG"}
                            </span>
                          </div>

                          <div className="font-semibold text-[#0F0F12]">{q.prompt}</div>

                          <div className="mt-3 grid gap-1 text-sm">
                            {!noAnswer && (
                              <div className={isCorrect ? "text-emerald-700" : "text-red-700"}>
                                Your answer: <b>{q.options[a!]}</b>
                              </div>
                            )}
                            {!isCorrect && (
                              <div className="text-emerald-700">
                                Correct: <b>{q.options[q.correctIndex]}</b>
                              </div>
                            )}
                            <div className="mt-1 text-black/45">{q.explanation}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </section>

            <AdUnit variant="sidebar-test" />
          </div>
        )}

      </div>

      {showCert && (
        <CertificateModal
          level={suggestedLevel}
          score={score}
          onClose={() => setShowCert(false)}
        />
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-4 py-4">
      <div className="text-xs text-black/35">{label}</div>
      <div className="mt-1 text-base font-black text-[#0F0F12]">{value}</div>
    </div>
  );
}
