"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { FUTCONT_SPEED_QUESTIONS, FUTCONT_PDF_CONFIG } from "../futContSharedData";
import TenseRecommendations from "@/components/TenseRecommendations";

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: MCQ[];
};

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Polite vs direct: choose the more natural question",
    instructions:
      "In each situation, choose the more natural question. Sometimes the polite Future Continuous question is better; sometimes the direct form is fine. Read the context carefully.",
    questions: [
      {
        id: "1-1",
        prompt: "You want to borrow a colleague's pen without putting pressure. Which is more polite?",
        options: [
          "Will you be using your pen this afternoon?",
          "Will you use your pen this afternoon?",
          "Do you use your pen?",
          "Are you using your pen?",
        ],
        correctIndex: 0,
        explanation: "Future Continuous 'Will you be using…?' is the most polite — you're asking about their plans without imposing.",
      },
      {
        id: "1-2",
        prompt: "A friend asks you directly about your weekend trip. The direct question is fine here.",
        options: [
          "Will you be driving to the coast?",
          "Will you drive to the coast?",
          "Are you driving to the coast?",
          "Do you drive to the coast?",
        ],
        correctIndex: 2,
        explanation: "Between friends, Present Continuous for future plans ('Are you driving?') is natural and direct.",
      },
      {
        id: "1-3",
        prompt: "A manager asks an employee in a meeting context: which is the most tactful question?",
        options: [
          "Are you finishing the report today?",
          "Do you finish the report today?",
          "Will you be finishing the report today?",
          "Have you finished the report?",
        ],
        correctIndex: 2,
        explanation: "'Will you be finishing…?' is the most tactful — it enquires about their plans rather than sounding like a demand.",
      },
      {
        id: "1-4",
        prompt: "You need to use the meeting room at 2 PM. You check with a colleague — politely.",
        options: [
          "Do you need the meeting room?",
          "Will you be needing the meeting room at 2?",
          "Will you need the meeting room?",
          "Are you using the meeting room?",
        ],
        correctIndex: 1,
        explanation: "'Will you be needing…?' — FC polite question softly enquires about plans without pressure.",
      },
      {
        id: "1-5",
        prompt: "You're making emergency plans with a friend — speed matters, polite tone is less important.",
        options: [
          "Will you be helping me move this weekend?",
          "Will you help me move this weekend?",
          "Are you going to help me move?",
          "Can you help me move?",
        ],
        correctIndex: 3,
        explanation: "In urgent requests, 'Can you help?' is the most direct and natural. FC polite questions suit softer enquiries.",
      },
      {
        id: "1-6",
        prompt: "A hotel receptionist politely checks on guests' dinner plans.",
        options: [
          "Do you eat in the restaurant tonight?",
          "Will you eat in the restaurant tonight?",
          "Will you be dining with us tonight?",
          "Are you dining in the restaurant?",
        ],
        correctIndex: 2,
        explanation: "'Will you be dining with us tonight?' — polite FC question, perfectly suited to a formal hospitality context.",
      },
      {
        id: "1-7",
        prompt: "Your flatmate wants to know your schedule — casual conversation.",
        options: [
          "Will you be coming home for dinner?",
          "Will you come home for dinner?",
          "Are you coming home for dinner?",
          "Do you come home for dinner?",
        ],
        correctIndex: 2,
        explanation: "Between flatmates, Present Continuous for a future plan ('Are you coming home?') is the most natural and casual.",
      },
      {
        id: "1-8",
        prompt: "An assistant checks with a VIP client whether they'll need the car tomorrow — very politely.",
        options: [
          "Will you need the car tomorrow?",
          "Are you using the car tomorrow?",
          "Do you use the car tomorrow?",
          "Will you be needing the car tomorrow?",
        ],
        correctIndex: 3,
        explanation: "'Will you be needing the car tomorrow?' — polite FC question appropriate for formal/service contexts.",
      },
      {
        id: "1-9",
        prompt: "A colleague asks in passing if you'll attend a quick team lunch. Casual tone is fine.",
        options: [
          "Will you be attending the team lunch?",
          "Will you attend the team lunch?",
          "Are you coming to the team lunch?",
          "Do you come to the team lunch?",
        ],
        correctIndex: 2,
        explanation: "'Are you coming to the team lunch?' — casual Present Continuous for future plans, natural between colleagues.",
      },
      {
        id: "1-10",
        prompt: "You're a guest and want to know if your host needs help preparing dinner — politely.",
        options: [
          "Do you need help cooking dinner?",
          "Are you cooking dinner alone?",
          "Will you be needing any help with dinner?",
          "Will you cook dinner?",
        ],
        correctIndex: 2,
        explanation: "'Will you be needing any help?' — polite FC question shows consideration without imposing.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Will you be…? or Will you…?",
    instructions:
      "Choose between the polite Future Continuous question ('Will you be + -ing?') and the direct Future Simple question ('Will you + base?'). Consider which sounds more natural in context.",
    questions: [
      {
        id: "2-1",
        prompt: "You want to offer someone a lift. You ask politely about their plans.",
        options: [
          "Will you be driving to the office tomorrow?",
          "Will you drive to the office tomorrow?",
          "Do you drive to the office tomorrow?",
          "Are you drive to the office tomorrow?",
        ],
        correctIndex: 0,
        explanation: "'Will you be driving…?' — polite FC enquiry about whether their plans include driving, so you can offer a lift.",
      },
      {
        id: "2-2",
        prompt: "You're making a direct promise: 'Don't worry, I ___ be there on time.'",
        options: [
          "will be being", "won't be", "will", "am going to",
        ],
        correctIndex: 2,
        explanation: "'I will be there on time.' — Future Simple for a direct promise/commitment.",
      },
      {
        id: "2-3",
        prompt: "Your boss checks if you'll hand in the project by Friday (direct question about result).",
        options: [
          "Will you be finishing the project by Friday?",
          "Will you finish the project by Friday?",
          "Are you finishing the project by Friday?",
          "Do you finish the project by Friday?",
        ],
        correctIndex: 1,
        explanation: "'Will you finish the project by Friday?' — Future Simple focuses on completion/result, which is what the boss wants to know.",
      },
      {
        id: "2-4",
        prompt: "A flight attendant politely asks a passenger about their meal preference.",
        options: [
          "Will you have the fish or the chicken?",
          "Do you want fish or chicken?",
          "Will you be having the fish or the chicken?",
          "Are you having fish or chicken?",
        ],
        correctIndex: 2,
        explanation: "'Will you be having…?' — polite FC question, standard in formal service contexts.",
      },
      {
        id: "2-5",
        prompt: "You ask your friend directly whether he'll come to your birthday party.",
        options: [
          "Will you be coming to my party?",
          "Will you come to my party?",
          "Are you coming to my party?",
          "Both B and C are natural",
        ],
        correctIndex: 3,
        explanation: "Between friends, both 'Will you come?' (Future Simple) and 'Are you coming?' (PC for future) are equally natural.",
      },
      {
        id: "2-6",
        prompt: "A waiter at an upscale restaurant: '___ you be joining us for dessert this evening?'",
        options: ["Are", "Do", "Will", "Have"],
        correctIndex: 2,
        explanation: "'Will you be joining us for dessert?' — polite FC question appropriate in a formal restaurant.",
      },
      {
        id: "2-7",
        prompt: "You want to know if your neighbour needs the parking space (indirect, polite).",
        options: [
          "Do you need the parking space?",
          "Will you use the parking space tonight?",
          "Will you be using the parking space tonight?",
          "Are you using the parking space?",
        ],
        correctIndex: 2,
        explanation: "'Will you be using the parking space?' — polite FC enquiry about plans without pressure.",
      },
      {
        id: "2-8",
        prompt: "Your colleague asks directly: 'Will the CEO ___ the meeting tomorrow?'",
        options: ["be attend", "attending", "be attending", "attend"],
        correctIndex: 3,
        explanation: "'Will the CEO attend the meeting?' — direct FC or Future Simple. 'attend' (Future Simple: Will + base) is also natural here.",
      },
      {
        id: "2-9",
        prompt: "A shop assistant politely: '___ you be paying by card or cash?'",
        options: ["Are", "Do", "Will", "Have"],
        correctIndex: 2,
        explanation: "'Will you be paying…?' — polite FC question in a service context.",
      },
      {
        id: "2-10",
        prompt: "\"___ you be staying for the second presentation?\" \"No, I have to leave early.\"",
        options: ["Are", "Do", "Will", "Did"],
        correctIndex: 2,
        explanation: "'Will you be staying…?' — polite FC question about plans.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Responding to polite questions",
    instructions:
      "Choose the best response to each polite Future Continuous question. Vary between short affirmative answers, negative answers, and longer polite replies.",
    questions: [
      {
        id: "3-1",
        prompt: "\"Will you be joining us for the board dinner?\" — \"Yes, ___\"",
        options: ["I am.", "I will.", "I do.", "I'm joining."],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, I will. (standard short answer with modal)",
      },
      {
        id: "3-2",
        prompt: "\"Will you be needing a room for the extra night?\" — \"No, ___\"",
        options: ["I won't.", "I don't.", "I'm not.", "I haven't."],
        correctIndex: 0,
        explanation: "Short negative: No, I won't.",
      },
      {
        id: "3-3",
        prompt: "\"Will you be using the company car this week?\" — \"Actually, ___ — could you let the others know?\"",
        options: [
          "I won't be using it",
          "I will be using it",
          "I don't use it",
          "I wasn't using it",
        ],
        correctIndex: 0,
        explanation: "'I won't be using it' — negative FC reply, then offering to inform others.",
      },
      {
        id: "3-4",
        prompt: "\"Will you be attending the training session tomorrow?\" — \"Yes, ___\"",
        options: ["I attend.", "I will be.", "I do.", "I am."],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, I will be. (or simply 'Yes, I will.')",
      },
      {
        id: "3-5",
        prompt: "\"Will you be presenting at the conference?\" — \"No, ___ — my colleague is doing it instead.\"",
        options: [
          "I will be",
          "I'm not",
          "I won't be",
          "I don't",
        ],
        correctIndex: 2,
        explanation: "'I won't be' — negative short answer. 'My colleague is doing it instead' confirms the negative.",
      },
      {
        id: "3-6",
        prompt: "\"Will you be finishing the report tonight?\" — \"Yes, ___ if I stay late.\"",
        options: ["I am", "I will", "I do", "I have"],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, I will. (conditional on staying late)",
      },
      {
        id: "3-7",
        prompt: "\"Will you be travelling this summer?\" — \"Actually, ___ — we're staying home this year.\"",
        options: [
          "we will be",
          "we won't be",
          "we don't",
          "we aren't",
        ],
        correctIndex: 1,
        explanation: "'we won't be' — negative reply. 'We're staying home this year' confirms the negative.",
      },
      {
        id: "3-8",
        prompt: "\"Will you be needing extra chairs for the event?\" — \"Yes, ___ — could you bring ten more?\"",
        options: [
          "we won't",
          "we won't be",
          "we will",
          "we are",
        ],
        correctIndex: 2,
        explanation: "'Yes, we will' — short affirmative. The follow-up request confirms they do need extra chairs.",
      },
      {
        id: "3-9",
        prompt: "\"Will you be coming to the team lunch on Friday?\" — \"___, I have a client meeting.\"",
        options: [
          "Yes, I will",
          "No, I won't",
          "Yes, I am",
          "No, I don't",
        ],
        correctIndex: 1,
        explanation: "'No, I won't' — negative short answer. 'I have a client meeting' explains why.",
      },
      {
        id: "3-10",
        prompt: "\"Will you be staying at the hotel or commuting?\" — \"___, the hotel.\"",
        options: [
          "No, I won't",
          "Yes, I will be staying at",
          "Staying at",
          "I'll be staying at",
        ],
        correctIndex: 3,
        explanation: "'I'll be staying at the hotel.' — natural affirmative FC reply clarifying the choice.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Rewrite as polite Future Continuous questions",
    instructions:
      "A direct question is given in brackets. Choose the correct polite Future Continuous version from the options.",
    questions: [
      {
        id: "4-1",
        prompt: "Direct: 'Will you use the projector?' → Polite FC version:",
        options: [
          "Will you be used the projector?",
          "Are you using the projector?",
          "Will you be using the projector?",
          "Do you use the projector?",
        ],
        correctIndex: 2,
        explanation: "'Will you be using the projector?' — correct FC polite question: Will + subject + be + -ing?",
      },
      {
        id: "4-2",
        prompt: "Direct: 'Will she attend the dinner?' → Polite FC version:",
        options: [
          "Will she be attending the dinner?",
          "Is she attending the dinner?",
          "Does she attend the dinner?",
          "Will she attending the dinner?",
        ],
        correctIndex: 0,
        explanation: "'Will she be attending the dinner?' — Will + subject + be + -ing?",
      },
      {
        id: "4-3",
        prompt: "Direct: 'Do you need this desk?' → Polite FC version:",
        options: [
          "Will you need this desk?",
          "Are you needing this desk?",
          "Will you be needing this desk?",
          "Do you be needing this desk?",
        ],
        correctIndex: 2,
        explanation: "'Will you be needing this desk?' — polite FC form of the question.",
      },
      {
        id: "4-4",
        prompt: "Direct: 'Will they come to the launch?' → Polite FC version:",
        options: [
          "Will they come to the launch?",
          "Will they be coming to the launch?",
          "Are they coming to the launch?",
          "Do they come to the launch?",
        ],
        correctIndex: 1,
        explanation: "'Will they be coming to the launch?' — polite FC version.",
      },
      {
        id: "4-5",
        prompt: "Direct: 'Do you want anything to drink?' (formal waiter context) → Polite FC version:",
        options: [
          "Do you be drinking anything?",
          "Are you wanting anything?",
          "Will you be wanting anything to drink?",
          "Will you drink anything?",
        ],
        correctIndex: 2,
        explanation: "'Will you be wanting anything to drink?' — classic polite FC question in formal service.",
      },
      {
        id: "4-6",
        prompt: "Direct: 'Will you stay for the second session?' → Polite FC version:",
        options: [
          "Will you be stayed for the second session?",
          "Will you be staying for the second session?",
          "Are you staying for the second session?",
          "Do you stay for the second session?",
        ],
        correctIndex: 1,
        explanation: "'Will you be staying for the second session?' — Will + subject + be + -ing?",
      },
      {
        id: "4-7",
        prompt: "Direct: 'Will he drive us to the airport?' → Polite FC version:",
        options: [
          "Will he be driving us to the airport?",
          "Is he driving us to the airport?",
          "Does he drive us to the airport?",
          "Will he drive us to the airport?",
        ],
        correctIndex: 0,
        explanation: "'Will he be driving us to the airport?' — polite FC: Will + subject + be + -ing?",
      },
      {
        id: "4-8",
        prompt: "Direct: 'Will you eat here?' (restaurant context) → Most polite FC version:",
        options: [
          "Are you eating here?",
          "Do you eat here?",
          "Will you be dining with us this evening?",
          "Will you eat here tonight?",
        ],
        correctIndex: 2,
        explanation: "'Will you be dining with us this evening?' — the most polished polite FC form for a restaurant.",
      },
      {
        id: "4-9",
        prompt: "Direct: 'Will they use the main hall?' → Polite FC version:",
        options: [
          "Are they using the main hall?",
          "Will they be using the main hall?",
          "Do they use the main hall?",
          "Will they used the main hall?",
        ],
        correctIndex: 1,
        explanation: "'Will they be using the main hall?' — Will + subject + be + -ing?",
      },
      {
        id: "4-10",
        prompt: "Direct: 'Will you need help setting up?' → Polite FC version:",
        options: [
          "Will you be needing help setting up?",
          "Are you needing help setting up?",
          "Do you need help setting up?",
          "Will you need help setting up?",
        ],
        correctIndex: 0,
        explanation: "'Will you be needing help setting up?' — polite FC enquiry about their plans.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Polite vs direct",
  2: "Will be…? vs Will…?",
  3: "Short answers",
  4: "Rewrite politely",
};

export default function PoliteQuestionsClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();

  const current = SETS[exNo];

  const { save } = useProgress();

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(FUTCONT_PDF_CONFIG); } finally { setPdfLoading(false); }
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
    for (const q of current.questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, answers]);

  function reset() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setAnswers({});
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setAnswers({});
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/future-continuous">Future Continuous</a><span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Polite Questions</span>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Future Continuous <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Polite Questions</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">40 questions on using Future Continuous for polite enquiries. Learn when &quot;Will you be coming?&quot; is softer than &quot;Will you come?&quot;</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          {isPro ? (
            <div className=""><SpeedRound gameId="futcont-polite-questions" subject="Future Continuous" questions={FUTCONT_SPEED_QUESTIONS} variant="sidebar" /></div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <PDFButton onDownload={handlePDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                ))}
              </div>
            </div>
            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const chosen = answers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))} className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600"><b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
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
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
                      )}
                    </div>
                    {score && (
                      <div className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                        <div className="flex items-center justify-between">
                          <div><div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div><div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div></div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden"><div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} /></div>
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (<Explanation />)}
            </div>
          </section>
          {isPro ? (
            <TenseRecommendations tense="future-continuous" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>
        <AdUnit variant="mobile-dark" />
        <div className="mt-10 flex items-center gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Continuous exercises</a>
        </div>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}>{p.text}</span>
      ))}
    </div>
  );
}

function Ex({ en }: { en: string }) {
  return (
    <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
      <div className="font-semibold text-slate-900 text-sm">{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">Polite FC Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you be using the car tonight?" />
            <Ex en="Will you be needing any help?" />
            <Ex en="Will you be joining us for dinner?" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">Direct Future Simple Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "base verb", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you use the car tonight?" />
            <Ex en="Will you come to the meeting?" />
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Direct vs Polite — comparison</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-red-700">Direct (will + base)</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Polite FC (will be + -ing)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Will you come to the party?", "Will you be coming to the party?"],
                ["Will you use the printer?", "Will you be using the printer?"],
                ["Will she attend the conference?", "Will she be attending the conference?"],
                ["Will you need anything?", "Will you be needing anything?"],
              ].map(([direct, polite], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-red-700 font-mono text-xs">{direct}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{polite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Why is FC more polite?</div>
        <div className="text-xs text-amber-700 space-y-1 mt-2">
          <div>✅ &quot;Will you be coming?&quot; — asks about existing plans (not putting pressure on them)</div>
          <div>⚠ &quot;Will you come?&quot; — sounds more like a request or demand</div>
          <div>✅ FC polite questions are common in formal settings: hotels, offices, service industry</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short answers</div>
        <div className="space-y-2">
          {[
            { q: "Will you be joining us?", yes: "Yes, I will.", no: "No, I won't." },
            { q: "Will she be attending?", yes: "Yes, she will.", no: "No, she won't." },
            { q: "Will they be needing help?", yes: "Yes, they will.", no: "No, they won't." },
          ].map(({ q, yes, no }) => (
            <div key={q} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800 mb-1 italic">{q}</div>
              <div className="flex gap-4 text-xs">
                <span className="text-emerald-700 font-mono">✅ {yes}</span>
                <span className="text-red-700 font-mono">❌ {no}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common polite FC phrases</div>
        <div className="flex flex-wrap gap-2">
          {[
            "Will you be joining us?",
            "Will you be needing…?",
            "Will you be using…?",
            "Will you be staying…?",
            "Will you be dining…?",
            "Will you be attending…?",
          ].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
