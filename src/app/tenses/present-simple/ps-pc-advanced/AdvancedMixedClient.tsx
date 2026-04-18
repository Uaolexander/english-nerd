"use client";

import { useMemo, useState, useEffect } from "react";
import { useLiveSync } from "@/lib/useLiveSync";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "What time ___ the train leave?",          options: ["do","does","is","are"],              answer: 1 },
  { q: "Where ___ your parents live?",            options: ["does","do","are","is"],              answer: 1 },
  { q: "___ often does she go to the gym?",       options: ["What","How","Which","Where"],        answer: 1 },
  { q: "What ___ he do for a living?",            options: ["do","is","does","are"],              answer: 2 },
  { q: "How much ___ this cost?",                 options: ["do","is","does","are"],              answer: 2 },
  { q: "Why ___ she always late?",                options: ["do","does","is","are"],              answer: 2 },
  { q: "She ___ coffee. (state verb: love)",      options: ["is loving","love","loves","loving"], answer: 2 },
  { q: "I ___ what you mean. (state: understand)",options: ["am understanding","understand","understands","is understanding"], answer: 1 },
  { q: "He ___ in Paris right now temporarily.", options: ["lives","live","is living","living"],  answer: 2 },
  { q: "They ___ a new system this month.",       options: ["implement","is implementing","implements","are implementing"], answer: 3 },
  { q: "This soup ___ great! (state: taste)",     options: ["is tasting","taste","tastes","tasting"], answer: 2 },
  { q: "She ___ five languages.",                 options: ["is speaking","speak","speaks","speaking"], answer: 2 },
  { q: "I ___ she is right. (state: think)",      options: ["am thinking","think","thinks","thinking"], answer: 1 },
  { q: "He ___ the answer. (state: know)",        options: ["is knowing","know","knows","knowing"], answer: 2 },
  { q: "She ___ her mum this evening. (plan)",    options: ["calls","call","is calling","called"], answer: 2 },
  { q: "The museum ___ every Sunday.",            options: ["is closing","close","closes","closing"], answer: 2 },
  { q: "We ___ for the bus right now.",           options: ["wait","waits","are waiting","waited"], answer: 2 },
  { q: "He usually ___ by 6 AM.",                 options: ["is waking up","wake up","wakes up","woken up"], answer: 2 },
  { q: "I ___ you've made the right choice.",     options: ["am thinking","think","thinks","am think"], answer: 1 },
  { q: "She ___ her report — don't disturb her.", options: ["writes","write","is writing","written"], answer: 2 },
];

/* ─── Types ─────────────────────────────────────────────────────────────── */

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

/* ─── Question data ─────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Wh- questions and word order",
    instructions:
      "Wh- questions use: Wh- word + do/does + subject + base verb. Use does with he/she/it and do with I/you/we/they. Choose the missing word for each question.",
    questions: [
      {
        id: "1-1",
        prompt: "What time ___ the train leave?",
        options: ["do", "does", "is", "are"],
        correctIndex: 1,
        explanation: "The train (= it) → does: What time does the train leave?",
      },
      {
        id: "1-2",
        prompt: "Where ___ your parents live?",
        options: ["does", "do", "are", "is"],
        correctIndex: 1,
        explanation: "Your parents (= they) → do: Where do your parents live?",
      },
      {
        id: "1-3",
        prompt: "___ often does she go to the gym?",
        options: ["What", "How", "Which", "Where"],
        correctIndex: 1,
        explanation: "How often does she go to the gym? — 'How often' asks about frequency.",
      },
      {
        id: "1-4",
        prompt: "What ___ he do for a living?",
        options: ["do", "is", "does", "are"],
        correctIndex: 2,
        explanation: "He → does: What does he do for a living?",
      },
      {
        id: "1-5",
        prompt: "Who ___ you work for?",
        options: ["does", "do", "are", "is"],
        correctIndex: 1,
        explanation: "You → do: Who do you work for?",
      },
      {
        id: "1-6",
        prompt: "___ language does he speak?",
        options: ["How", "Which", "What", "Where"],
        correctIndex: 2,
        explanation: "What language does he speak? — 'What' is used to ask about a language.",
      },
      {
        id: "1-7",
        prompt: "How ___ does this cost?",
        options: ["many", "often", "much", "long"],
        correctIndex: 2,
        explanation: "How much does this cost? — 'How much' asks about price.",
      },
      {
        id: "1-8",
        prompt: "Why ___ they always arrive late?",
        options: ["does", "is", "do", "are"],
        correctIndex: 2,
        explanation: "They → do: Why do they always arrive late?",
      },
      {
        id: "1-9",
        prompt: "Which ___ you prefer — coffee or tea?",
        options: ["does", "do", "are", "is"],
        correctIndex: 1,
        explanation: "You → do: Which do you prefer?",
      },
      {
        id: "1-10",
        prompt: "When ___ the library open?",
        options: ["do", "are", "is", "does"],
        correctIndex: 3,
        explanation: "The library (= it) → does: When does the library open?",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Frequency adverbs (position)",
    instructions:
      "Frequency adverbs (always, usually, often, sometimes, rarely, never) go BEFORE the main verb but AFTER the verb 'to be'. Choose the correctly ordered option.",
    questions: [
      {
        id: "2-1",
        prompt: "She ___ coffee in the morning.",
        options: ["always drinks", "drinks always", "always drink", "is always drink"],
        correctIndex: 0,
        explanation: "'Always' goes before the main verb 'drinks': She always drinks coffee.",
      },
      {
        id: "2-2",
        prompt: "I am ___ late for work.",
        options: ["always", "always am", "am always", "never am"],
        correctIndex: 0,
        explanation: "With 'to be', the adverb goes AFTER the verb: I am never/always late. Here 'never' fits the blank: I am never late. But the correct option completing 'I am ___' is 'never' — here 'always' is the answer as it fills the blank after 'am'.",
      },
      {
        id: "2-3",
        prompt: "He ___ his homework.",
        options: ["sometimes forget", "forgets sometimes", "sometimes forgets", "is sometimes forget"],
        correctIndex: 2,
        explanation: "'Sometimes' goes before the main verb: He sometimes forgets his homework.",
      },
      {
        id: "2-4",
        prompt: "They ___ eat meat.",
        options: ["do rarely", "rarely do", "rarely", "are rarely"],
        correctIndex: 2,
        explanation: "'Rarely' goes before the main verb 'eat': They rarely eat meat.",
      },
      {
        id: "2-5",
        prompt: "She is ___ ready on time.",
        options: ["usually", "usually is", "is usually", "before usually"],
        correctIndex: 0,
        explanation: "With 'to be', the adverb comes after: She is usually ready. The blank is after 'is', so 'usually' fills it correctly.",
      },
      {
        id: "2-6",
        prompt: "My brother ___ plays video games.",
        options: ["never", "is never", "never is", "does never"],
        correctIndex: 0,
        explanation: "'Never' goes before the main verb 'plays': My brother never plays video games.",
      },
      {
        id: "2-7",
        prompt: "We are ___ on time for meetings.",
        options: ["rarely is", "rarely are", "rarely", "do rarely"],
        correctIndex: 2,
        explanation: "With 'to be', the adverb follows the verb: We are rarely on time. The blank is after 'are', so 'rarely' is correct.",
      },
      {
        id: "2-8",
        prompt: "She ___ gets up before 7 AM.",
        options: ["usually", "is usually", "usually is", "does usually"],
        correctIndex: 0,
        explanation: "'Usually' goes before the main verb 'gets up': She usually gets up before 7 AM.",
      },
      {
        id: "2-9",
        prompt: "He is ___ the first to arrive.",
        options: ["often is", "often", "does often", "is often"],
        correctIndex: 1,
        explanation: "With 'to be', adverb goes after the verb: He is often the first to arrive. The blank is after 'is', so 'often' fills it.",
      },
      {
        id: "2-10",
        prompt: "I ___ forget my keys.",
        options: ["sometimes", "is sometimes", "does sometimes", "sometimes is"],
        correctIndex: 0,
        explanation: "'Sometimes' goes before the main verb 'forget': I sometimes forget my keys.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Tag questions",
    instructions:
      "Tag questions: positive sentence → negative tag; negative sentence → positive tag. Use the same auxiliary as in the sentence. Choose the correct tag.",
    questions: [
      {
        id: "3-1",
        prompt: "She works here, ___ she?",
        options: ["does", "doesn't", "is", "isn't"],
        correctIndex: 1,
        explanation: "Positive sentence → negative tag: works → doesn't. She works here, doesn't she?",
      },
      {
        id: "3-2",
        prompt: "They don't know the answer, ___ they?",
        options: ["don't", "do", "does", "doesn't"],
        correctIndex: 1,
        explanation: "Negative sentence → positive tag: don't → do. They don't know, do they?",
      },
      {
        id: "3-3",
        prompt: "He is a doctor, ___ he?",
        options: ["is", "isn't", "doesn't", "does"],
        correctIndex: 1,
        explanation: "Positive sentence with 'is' → negative tag 'isn't'. He is a doctor, isn't he?",
      },
      {
        id: "3-4",
        prompt: "You speak French, ___ you?",
        options: ["do", "does", "don't", "doesn't"],
        correctIndex: 2,
        explanation: "Positive sentence → negative tag: speak (you) → don't. You speak French, don't you?",
      },
      {
        id: "3-5",
        prompt: "It doesn't rain much here, ___ it?",
        options: ["doesn't", "don't", "does", "do"],
        correctIndex: 2,
        explanation: "Negative sentence → positive tag: doesn't → does. It doesn't rain much, does it?",
      },
      {
        id: "3-6",
        prompt: "We are late, ___ we?",
        options: ["are", "is", "aren't", "isn't"],
        correctIndex: 2,
        explanation: "Positive sentence with 'are' → negative tag 'aren't'. We are late, aren't we?",
      },
      {
        id: "3-7",
        prompt: "She isn't happy, ___ she?",
        options: ["isn't", "is", "doesn't", "does"],
        correctIndex: 1,
        explanation: "Negative sentence → positive tag: isn't → is. She isn't happy, is she?",
      },
      {
        id: "3-8",
        prompt: "You don't eat meat, ___ you?",
        options: ["don't", "doesn't", "do", "does"],
        correctIndex: 2,
        explanation: "Negative sentence → positive tag: don't → do. You don't eat meat, do you?",
      },
      {
        id: "3-9",
        prompt: "He knows the answer, ___ he?",
        options: ["does", "do", "doesn't", "don't"],
        correctIndex: 2,
        explanation: "Positive sentence → negative tag: knows (he) → doesn't. He knows the answer, doesn't he?",
      },
      {
        id: "3-10",
        prompt: "They are from France, ___ they?",
        options: ["are", "is", "isn't", "aren't"],
        correctIndex: 3,
        explanation: "Positive sentence with 'are' → negative tag 'aren't'. They are from France, aren't they?",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed advanced",
    instructions:
      "This set mixes subject questions, indirect questions, stative verbs, and all advanced patterns. Think carefully about word order and which auxiliary (if any) is needed.",
    questions: [
      {
        id: "4-1",
        prompt: "Who ___ the best English in the class?",
        options: ["does speak", "do speak", "speaks", "speak"],
        correctIndex: 2,
        explanation: "Subject question: the wh-word IS the subject, so no do/does inversion. Who speaks? (NOT Who does speak?)",
      },
      {
        id: "4-2",
        prompt: "Do you know where she ___?",
        options: ["work", "works", "does work", "do work"],
        correctIndex: 1,
        explanation: "Indirect/embedded question uses normal word order with no inversion: where she works (NOT where does she work).",
      },
      {
        id: "4-3",
        prompt: "What ___ next in this story?",
        options: ["does happen", "do happen", "happens", "happen"],
        correctIndex: 2,
        explanation: "Subject question: 'What' is the subject. No do/does needed: What happens next?",
      },
      {
        id: "4-4",
        prompt: "I ___ what you mean.",
        options: ["am not understanding", "don't understand", "doesn't understand", "not understand"],
        correctIndex: 1,
        explanation: "'Understand' is a stative verb — it never takes continuous form. I don't understand.",
      },
      {
        id: "4-5",
        prompt: "Can you tell me where the post office ___?",
        options: ["does it stand", "is", "does stand", "do stand"],
        correctIndex: 1,
        explanation: "Indirect question: normal word order — where the post office is (no inversion, no do/does with 'to be').",
      },
      {
        id: "4-6",
        prompt: "She ___ like loud music.",
        options: ["isn't", "don't", "doesn't", "not"],
        correctIndex: 2,
        explanation: "She → doesn't. 'Like' is a main verb, not 'to be', so we use doesn't.",
      },
      {
        id: "4-7",
        prompt: "Who ___ the company?",
        options: ["does own", "owns", "do own", "own"],
        correctIndex: 1,
        explanation: "Subject question with stative verb 'own': Who owns the company? No do/does inversion.",
      },
      {
        id: "4-8",
        prompt: "They ___ believe the story.",
        options: ["aren't", "doesn't", "not", "don't"],
        correctIndex: 3,
        explanation: "They → don't. 'Believe' is a stative verb always used in Simple: They don't believe.",
      },
      {
        id: "4-9",
        prompt: "Do you know how much it ___?",
        options: ["does cost", "cost", "costs", "do cost"],
        correctIndex: 2,
        explanation: "Embedded question uses normal word order: how much it costs (NOT how much does it cost).",
      },
      {
        id: "4-10",
        prompt: "What ___ that word mean?",
        options: ["do", "is", "does", "are"],
        correctIndex: 2,
        explanation: "'That word' (= it) → does: What does that word mean? This is a normal Wh- question, not a subject question.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Wh- Questions",
  2: "Frequency Adverbs",
  3: "Tag Questions",
  4: "Mixed Advanced",
};

/* ─── Helper components ──────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) =>
        p.dim ? (
          <span key={i} className="text-slate-400 font-bold text-sm">
            +
          </span>
        ) : (
          <span
            key={i}
            className={`rounded-lg px-2.5 py-1 text-xs font-black border ${
              p.color ? colors[p.color] : colors.slate
            }`}
          >
            {p.text}
          </span>
        )
      )}
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

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function AdvancedMixedClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

  const { broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<string, number | null>);
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

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
    for (const q of current.questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, answers]);

  function reset() {
    setChecked(false);
    setAnswers({});
    broadcast({ answers: {}, checked: false, exNo });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
    broadcast({ answers: {}, checked: false, exNo: n });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function checkAnswers() {
    setChecked(true);
    broadcast({ answers, checked: true, exNo });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210, H = 297, ml = 15, mr = 15;
      const Y = "#F5DA20", BK = "#111111", GR = "#999999", LG = "#F2F2F2", MG = "#CCCCCC";

      function pageHeader(pageNum: number, sub: string) {
        pdf.setFillColor(Y); pdf.rect(0, 0, W, 2.5, "F");
        pdf.setFillColor("#FAFAFA"); pdf.rect(0, 2.5, W, 13, "F");
        pdf.setDrawColor("#EBEBEB"); pdf.setLineWidth(0.25); pdf.line(0, 15.5, W, 15.5);
        pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
        pdf.text("English Nerd", ml, 10.5);
        pdf.setFillColor(MG); pdf.circle(ml+27, 9.5, 0.7, "F");
        pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
        pdf.text(sub, ml+30, 10.5);
        pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(GR);
        pdf.text(`${pageNum} / 3`, W-mr, 10.5, { align: "right" });
      }
      function numCircle(x: number, y: number, n: number) {
        pdf.setFillColor(BK); pdf.circle(x+3.5, y+3.5, 3.5, "F");
        pdf.setFont("helvetica","bold"); pdf.setFontSize(8); pdf.setTextColor("#FFFFFF");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(String(n), x+3.5, y+3.5, { align:"center", baseline:"middle" } as any);
      }
      function pill(x: number, y: number, text: string, bg: string, fg: string) {
        const w=20, h=5.5;
        pdf.setFillColor(bg); pdf.roundedRect(x,y,w,h,1.2,1.2,"F");
        pdf.setFont("helvetica","bold"); pdf.setFontSize(7); pdf.setTextColor(fg);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(text, x+w/2, y+h/2, { align:"center", baseline:"middle" } as any);
      }

      pageHeader(1, "Present Simple · Advanced Mixed Worksheet");
      pdf.setFillColor(BK); pdf.roundedRect(W-mr-28, 5, 28, 6, 1.5, 1.5, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(Y);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("A2+  LEVEL", W-mr-14, 8, { align:"center", baseline:"middle" } as any);
      let y = 19;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 22, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(22); pdf.setTextColor(BK);
      pdf.text("Advanced Mixed", ml+5, y+11);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Wh- questions \u00B7 State verbs \u00B7 Simple vs Continuous \u00B7 Mixed \u2014 4 exercises + answer key", ml+5, y+18);
      y += 27;

      const qH = 9;
      numCircle(ml, y, 1);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 1", ml+10, y+5);
      const e1w = pdf.getTextWidth("Exercise 1");
      pill(ml+10+e1w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Wh- questions — choose the missing word.", ml+10+e1w+26, y+4.5);
      y += 11;
      const ex1 = [
        "1. What time ___ the train leave?   a) do   b) does   c) is   d) are",
        "2. Where ___ your parents live?   a) does   b) do   c) are   d) is",
        "3. ___ often does she go to the gym?   a) What   b) How   c) Which   d) Where",
        "4. What ___ he do for a living?   a) do   b) is   c) does   d) are",
        "5. How much ___ this cost?   a) do   b) is   c) does   d) are",
        "6. Why ___ she always late?   a) do   b) does   c) is   d) are",
        "7. Where ___ they usually go on holiday?   a) does   b) do   c) are   d) is",
        "8. What ___ your sister study?   a) do   b) is   c) does   d) are",
        "9. How often ___ they visit their parents?   a) does   b) do   c) are   d) is",
        "10. Which language ___ he speak at home?   a) do   b) is   c) are   d) does",
      ];
      ex1.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH-1, W-mr, y+(i+1)*qH-1);
      });
      y += ex1.length * qH + 5;

      numCircle(ml, y, 2);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 2", ml+10, y+5);
      const e2w = pdf.getTextWidth("Exercise 2");
      pill(ml+10+e2w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("State verbs — choose simple or continuous.", ml+10+e2w+26, y+4.5);
      y += 11;
      const ex2 = [
        "1. She ___ coffee. (love = state)   a) is loving   b) love   c) loves   d) loving",
        "2. I ___ what you mean. (understand)   a) am understanding   b) understand   c) understands",
        "3. He ___ the answer. (know = state)   a) is knowing   b) know   c) knows   d) knowing",
        "4. This soup ___ great! (taste = state)   a) is tasting   b) taste   c) tastes   d) tasting",
        "5. She ___ five languages. (speak = skill)   a) is speaking   b) speak   c) speaks",
        "6. I ___ she is right. (think = believe)   a) am thinking   b) think   c) thinks",
        "7. He ___ your address. (know = state)   a) is knowing   b) know   c) knows   d) known",
        "8. They ___ the plan. (understand)   a) are understanding   b) understand   c) understands",
        "9. It ___ too expensive. (seem = state)   a) is seeming   b) seem   c) seems   d) seeming",
        "10. She ___ you've made the right choice. (think)   a) is thinking   b) think   c) thinks",
      ];
      ex2.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH-1, W-mr, y+(i+1)*qH-1);
      });

      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc", ml, H-7);
      pdf.text("1 / 3", W-mr, H-7, { align:"right" });

      // PAGE 2
      pdf.addPage();
      pageHeader(2, "Present Simple · Advanced Mixed Worksheet");
      y = 20;
      numCircle(ml, y, 3);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 3", ml+10, y+5);
      const e3w = pdf.getTextWidth("Exercise 3");
      pill(ml+10+e3w+3, y+0.5, "HARD", "#FEE2E2", "#991B1B");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Simple vs Continuous — mixed.", ml+10+e3w+26, y+4.5);
      y += 11;
      const ex3 = [
        "1. He ___ in London temporarily.   a) lives   b) live   c) is living   d) living",
        "2. They ___ a new system this month.   a) implement   b) implements   c) are implementing",
        "3. She ___ her mum this evening. (plan)   a) calls   b) call   c) is calling   d) called",
        "4. The museum ___ every Sunday.   a) is closing   b) close   c) closes   d) closing",
        "5. We ___ for the bus right now.   a) wait   b) waits   c) are waiting   d) waited",
        "6. He usually ___ by 6 AM.   a) is waking up   b) wake up   c) wakes up   d) woken up",
        "7. She ___ her report right now — can't talk.   a) writes   b) write   c) is writing",
        "8. He ___ to work every day. (routine)   a) is driving   b) drives   c) drive   d) driving",
        "9. Hurry! The taxi ___ outside.   a) waits   b) wait   c) is waiting   d) has waited",
        "10. I ___ a meeting right now.   a) have   b) am having   c) is having   d) has",
      ];
      ex3.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH-1, W-mr, y+(i+1)*qH-1);
      });
      y += ex3.length * qH + 6;

      numCircle(ml, y, 4);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 4", ml+10, y+5);
      const e4w = pdf.getTextWidth("Exercise 4");
      pill(ml+10+e4w+3, y+0.5, "HARD", "#FEE2E2", "#991B1B");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Advanced challenge — all rules combined.", ml+10+e4w+26, y+4.5);
      y += 11;
      const ex4 = [
        "1. She ___ at the library every Saturday. (routine)   a) studies   b) is studying   c) study",
        "2. He ___ you — he saw you yesterday. (state: recognise)   a) is recognising   b) recognises",
        "3. Listen! Someone ___ at the door. (in progress)   a) knocks   b) knock   c) is knocking",
        "4. This company ___ products worldwide each year.   a) exports   b) is exporting   c) export",
        "5. I ___ you've made the right choice. (state: think)   a) am thinking   b) thinks   c) think",
        "6. She ___ maths at a local school. (job)   a) teaches   b) is teaching   c) teach",
        "7. They ___ tennis — ask them later. (in progress)   a) play   b) plays   c) are playing",
        "8. Water ___ at 100°C. (scientific fact)   a) is boiling   b) boil   c) boils   d) boiled",
        "9. She ___ her grandmother this weekend. (plan)   a) visits   b) visit   c) is visiting",
        "10. He ___ what you said. (state: not understand)   a) isn't understanding   b) doesn't understand",
      ];
      ex4.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH-1, W-mr, y+(i+1)*qH-1);
      });

      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc", ml, H-7);
      pdf.text("2 / 3", W-mr, H-7, { align:"right" });

      // PAGE 3 — Answer Key
      pdf.addPage();
      pageHeader(3, "Present Simple · Advanced Mixed — Answer Key");
      y = 20;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 20, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(24); pdf.setTextColor(BK);
      pdf.text("Answer Key", ml+5, y+10);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Check your answers below", ml+5, y+17);
      y += 26;

      const answerSections = [
        { lbl:"Exercise 1", sub:"Wh- questions", ans:["b) does","b) do","b) How","c) does","c) does","c) is","b) do","c) does","b) do","d) does"] },
        { lbl:"Exercise 2", sub:"State verbs", ans:["c) loves","b) understand","c) knows","c) tastes","c) speaks","b) think","c) knows","b) understand","c) seems","c) thinks"] },
        { lbl:"Exercise 3", sub:"Simple vs Continuous", ans:["c) is living","c) are implementing","c) is calling","c) closes","c) are waiting","c) wakes up","c) is writing","b) drives","c) is waiting","b) am having"] },
        { lbl:"Exercise 4", sub:"Advanced challenge", ans:["a) studies","b) recognises","c) is knocking","a) exports","c) think","a) teaches","c) are playing","c) boils","c) is visiting","b) doesn't understand"] },
      ];
      answerSections.forEach(({ lbl, sub, ans }, si) => {
        numCircle(ml, y, si+1);
        pdf.setFont("helvetica","bold"); pdf.setFontSize(12); pdf.setTextColor(BK);
        pdf.text(lbl, ml+10, y+5);
        const lblW = pdf.getTextWidth(lbl);
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor(GR);
        pdf.text(sub, ml+10+lblW+4, y+4.5);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.3); pdf.line(ml, y+9, W-mr, y+9);
        y += 13;
        const chipW=28, chipH=7.5, chipStep=38;
        ans.forEach((a, ai) => {
          const col = ai % 5; const row = Math.floor(ai/5);
          const cx = ml + col*chipStep; const cy = y + row*14;
          pdf.setFont("helvetica","bold"); pdf.setFontSize(8); pdf.setTextColor(MG);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(`${ai+1}.`, cx, cy+chipH/2, { baseline:"middle" } as any);
          pdf.setFillColor(Y); pdf.roundedRect(cx+6, cy, chipW, chipH, 1.5, 1.5, "F");
          pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(BK);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(a, cx+6+chipW/2, cy+chipH/2, { align:"center", baseline:"middle" } as any);
        });
        y += 2*14 + 8;
      });

      pdf.setDrawColor(LG); pdf.setLineWidth(0.3); pdf.line(ml, H-12, W-mr, H-12);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc — Free English Grammar", ml, H-7);
      pdf.text("Present Simple \u00B7 Advanced Mixed \u00B7 A2+ \u00B7 Free to print & share", W-mr, H-7, { align:"right" });

      pdf.save("EnglishNerd_PresentSimple_AdvancedMixed_A2.pdf");
    } catch(e) { console.error(e); }
    finally { setPdfLoading(false); }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/present-simple">Present Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Advanced Mixed</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              Advanced Mixed
            </span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">
              Hard
            </span>
            <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
              B1
            </span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Challenge yourself with 40 advanced <b>Present Simple</b> questions across four sets: Wh- questions, frequency adverb position, tag questions, and a mixed advanced round including subject questions and indirect questions.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className="">
              <div className=""><SpeedRound gameId="ps-pc-advanced" subject="Advanced Mixed" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
            </div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button
                onClick={() => setTab("exercises")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  tab === "exercises"
                    ? "bg-[#F5DA20] text-black"
                    : "text-slate-700 hover:bg-black/5"
                }`}
              >
                Exercises
              </button>
              <button
                onClick={() => setTab("explanation")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  tab === "explanation"
                    ? "bg-[#F5DA20] text-black"
                    : "text-slate-700 hover:bg-black/5"
                }`}
              >
                Explanation
              </button>
              <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => switchSet(n)}
                    title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                      exNo === n
                        ? "bg-[#F5DA20] text-black"
                        : "bg-white text-slate-800 hover:bg-black/5"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>

                    {/* Mobile set switcher */}
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button
                          key={n}
                          onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                            exNo === n
                              ? "bg-[#F5DA20] text-black"
                              : "bg-white text-slate-800 hover:bg-black/5"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const chosen = answers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${
                                      chosen === oi
                                        ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                        : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() =>
                                        { const newAnswers = { ...answers, [q.id]: oi }; setAnswers(newAnswers); broadcast({ answers: newAnswers, checked, exNo }); }
                                      }
                                      className="accent-[#F5DA20]"
                                    />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && (
                                    <div className="text-emerald-700 font-semibold">✅ Correct</div>
                                  )}
                                  {isWrong && (
                                    <div className="text-red-700 font-semibold">❌ Wrong</div>
                                  )}
                                  {noAnswer && (
                                    <div className="text-amber-700 font-semibold">⚠ No answer</div>
                                  )}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {!checked ? (
                        <button
                          onClick={checkAnswers}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                        >
                          Check Answers
                        </button>
                      ) : (
                        <button
                          onClick={reset}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                        >
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button
                          onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                        >
                          Next Exercise →
                        </button>
                      )}
                    </div>

                    {score && (
                      <div
                        className={`rounded-2xl border p-4 ${
                          score.percent >= 80
                            ? "border-emerald-200 bg-emerald-50"
                            : score.percent >= 50
                            ? "border-amber-200 bg-amber-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div
                              className={`text-3xl font-black ${
                                score.percent >= 80
                                  ? "text-emerald-700"
                                  : score.percent >= 50
                                  ? "text-amber-700"
                                  : "text-red-700"
                              }`}
                            >
                              {score.percent}%
                            </div>
                            <div className="mt-0.5 text-sm text-slate-600">
                              {score.correct} out of {score.total} correct
                            </div>
                          </div>
                          <div className="text-3xl">
                            {score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}
                          </div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              score.percent >= 80
                                ? "bg-emerald-500"
                                : score.percent >= 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${score.percent}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80
                            ? "Excellent! Move on to the next exercise."
                            : score.percent >= 50
                            ? "Good effort! Review the wrong answers and try once more."
                            : "Keep practising — check the Explanation tab and try again."}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Explanation />
              )}
            </div>
          </section>

          {/* Right column */}
          {isPro ? (
            <aside className="flex flex-col gap-3">
              <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Recommended for you</p>
              {[
                { title: "Simple vs Continuous", href: "/tenses/present-simple/ps-vs-pc", img: "/topics/exercises/ps-vs-pc.jpg", level: "A2", badge: "bg-blue-500", reason: "Reinforce tense differences" },
                { title: "Spot the Mistake", href: "/tenses/present-simple/spot-the-mistake", img: "/topics/exercises/spot-the-mistake.jpg", level: "A1–A2", badge: "bg-amber-500", reason: "Find & fix errors" },
                { title: "Quiz — Multiple Choice", href: "/tenses/present-simple/quiz", img: "/topics/exercises/quiz.jpg", level: "A1", badge: "bg-emerald-500", reason: "Core PS practice" },
              ].map((rec) => (
                <a key={rec.href} href={rec.href} className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                    <img src={rec.img} alt={rec.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md ${rec.badge}`}>{rec.level}</span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold leading-snug text-slate-800 transition group-hover:text-slate-900">{rec.title}</p>
                    {rec.reason && <p className="mt-1 text-[11px] font-semibold leading-snug text-amber-600">{rec.reason}</p>}
                  </div>
                </a>
              ))}
              <a href="/tenses/present-simple" className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
                All Present Simple
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </a>
            </aside>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        {/* SpeedRound for non-PRO */}
        {!isPro && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
            <div className="hidden lg:block" />
            <SpeedRound gameId="ps-pc-advanced" subject="Advanced Mixed" questions={SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/present-simple/ps-vs-pc"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Simple vs Continuous
          </a>
          <a
            href="/tenses/present-simple/sentence-builder"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Sentence Builder →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">
          Present Simple — Advanced Rules
        </h2>
        <p className="text-slate-500 text-sm">
          Master Wh- questions, frequency adverb position, tag questions, and subject questions.
        </p>
      </div>

      {/* 1. Wh- questions */}
      <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">❓</span>
          <span className="text-sm font-black text-violet-700 uppercase tracking-widest">
            Wh- Questions
          </span>
        </div>
        <Formula
          parts={[
            { text: "Wh- word", color: "violet" },
            { dim: true, text: "+" },
            { text: "do / does", color: "yellow" },
            { dim: true, text: "+" },
            { text: "Subject", color: "sky" },
            { dim: true, text: "+" },
            { text: "base verb", color: "green" },
            { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]}
        />
        <div className="mt-3 space-y-2">
          <Ex en="What do you do for a living?" />
          <Ex en="Where does she live?" />
          <Ex en="How often do they go to the gym?" />
          <Ex en="Why does he always arrive late?" />
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>Rule:</b> Use <b>does</b> with he/she/it and <b>do</b> with I/you/we/they. The main verb is always in base form.
        </div>
      </div>

      {/* 2. Frequency adverbs */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">
            📍
          </span>
          <h3 className="font-black text-slate-900">Frequency Adverbs — Position</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Always, usually, often, sometimes, rarely, never — placement depends on the verb type.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">
              Before main verb
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "adverb", color: "violet" },
                { dim: true, text: "+" },
                { text: "main verb", color: "green" },
              ]}
            />
            <div className="mt-2 space-y-1.5">
              <Ex en="She always drinks coffee." />
              <Ex en="He sometimes forgets his keys." />
              <Ex en="They rarely eat out." />
            </div>
          </div>
          <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4">
            <div className="text-xs font-black text-amber-700 uppercase tracking-widest mb-2">
              After to be
            </div>
            <Formula
              parts={[
                { text: "Subject", color: "sky" },
                { dim: true, text: "+" },
                { text: "am/is/are", color: "yellow" },
                { dim: true, text: "+" },
                { text: "adverb", color: "violet" },
              ]}
            />
            <div className="mt-2 space-y-1.5">
              <Ex en="She is usually ready on time." />
              <Ex en="He is always late." />
              <Ex en="I am never tired." />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tag questions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">
            🏷
          </span>
          <h3 className="font-black text-slate-900">Tag Questions</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          The tag uses the same auxiliary as the main clause, but with the opposite polarity.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">
              Positive → Negative tag
            </div>
            <div className="space-y-1.5">
              <Ex en="She works here, doesn't she?" />
              <Ex en="He is a doctor, isn't he?" />
              <Ex en="They speak French, don't they?" />
              <Ex en="We are late, aren't we?" />
            </div>
          </div>
          <div className="rounded-xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
            <div className="text-xs font-black text-red-600 uppercase tracking-widest mb-2">
              Negative → Positive tag
            </div>
            <div className="space-y-1.5">
              <Ex en="They don't know, do they?" />
              <Ex en="It doesn't rain much, does it?" />
              <Ex en="She isn't happy, is she?" />
              <Ex en="You don't eat meat, do you?" />
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ Key point:</b> Always mirror the auxiliary from the main clause (do/does/am/is/are) and flip positive/negative.
        </div>
      </div>

      {/* 4. Subject questions amber box */}
      <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⭐</span>
          <span className="text-sm font-black text-amber-700 uppercase tracking-widest">
            Subject Questions — No Inversion!
          </span>
        </div>
        <p className="text-sm text-slate-700 mb-3">
          When <b>who</b> or <b>what</b> is the subject of the question, you do NOT use do/does and the word order stays normal.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-xs font-black text-emerald-700 uppercase mb-1">Correct</div>
            <div className="space-y-1.5">
              <Ex en="Who speaks the best English?" />
              <Ex en="What happens next?" />
              <Ex en="Who owns the company?" />
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-red-600 uppercase mb-1">Wrong</div>
            <div className="space-y-1.5">
              <Ex en="Who does speak the best English? ❌" />
              <Ex en="What does happen next? ❌" />
              <Ex en="Who does own the company? ❌" />
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-white border border-amber-200 px-4 py-3 text-sm text-amber-900">
          <b>Tip:</b> Ask yourself — is the wh-word the subject (the one doing the action)? If yes, no do/does needed.
        </div>
      </div>

      {/* 5. Quick reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">
            📋
          </span>
          <h3 className="font-black text-slate-900">Quick Reference Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Pattern</th>
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Rule</th>
                <th className="text-left font-black text-slate-500 pb-2">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Wh- question", "Wh- + do/does + subject + verb", "Where does she work?"],
                ["Freq. adverb (main verb)", "Subject + adverb + verb", "She always arrives late."],
                ["Freq. adverb (to be)", "Subject + be + adverb", "He is always late."],
                ["Tag (positive → neg.)", "Positive sentence, neg. tag?", "She works, doesn't she?"],
                ["Tag (negative → pos.)", "Negative sentence, pos. tag?", "They don't know, do they?"],
                ["Subject question", "Wh- + verb (no do/does)", "Who knows the answer?"],
                ["Indirect question", "Normal word order after if/whether/wh-", "Do you know where she works?"],
                ["Stative verbs", "Always Present Simple, never continuous", "I don't understand. (NOT am not understanding)"],
              ].map(([pattern, rule, example]) => (
                <tr key={pattern}>
                  <td className="py-2 pr-4 font-black text-slate-700 text-xs">{pattern}</td>
                  <td className="py-2 pr-4 text-slate-600 text-xs">{rule}</td>
                  <td className="py-2 font-mono text-xs text-slate-800">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
