"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "I ___ a student.",                     options: ["am","is","are","be"],       answer: 0 },
  { q: "She ___ from Spain.",                  options: ["am","is","are","be"],       answer: 1 },
  { q: "They ___ very happy today.",           options: ["am","is","are","be"],       answer: 2 },
  { q: "He ___ my best friend.",               options: ["am","is","are","be"],       answer: 1 },
  { q: "We ___ students at this university.",  options: ["am","is","are","be"],       answer: 2 },
  { q: "You ___ very talented!",               options: ["am","is","are","be"],       answer: 2 },
  { q: "It ___ a lovely day outside.",         options: ["am","are","be","is"],       answer: 3 },
  { q: "The weather ___ beautiful today.",     options: ["am","are","be","is"],       answer: 3 },
  { q: "My parents ___ at home.",              options: ["am","is","are","be"],       answer: 2 },
  { q: "I ___ not sure about this.",           options: ["is","are","be","am"],       answer: 3 },
  { q: "She ___ not at home right now.",       options: ["aren't","isn't","'m not","don't"], answer: 1 },
  { q: "I ___ ready yet.",                     options: ["isn't","aren't","don't","'m not"], answer: 3 },
  { q: "They ___ from the UK.",                options: ["isn't","aren't","'m not","don't"], answer: 1 },
  { q: "We ___ in the right place.",           options: ["isn't","aren't","'m not","don't"], answer: 1 },
  { q: "___ you ready?",                       options: ["Am","Is","Are","Be"],       answer: 2 },
  { q: "___ he a doctor?",                     options: ["Am","Are","Be","Is"],       answer: 3 },
  { q: "___ they at school?",                  options: ["Am","Is","Be","Are"],       answer: 3 },
  { q: "Where ___ my keys?",                   options: ["am","is","be","are"],       answer: 3 },
  { q: "How old ___ you?",                     options: ["am","is","be","are"],       answer: 3 },
  { q: "What ___ your name?",                  options: ["am","are","be","is"],       answer: 3 },
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
    title: "Exercise 1 — Affirmative: choose am / is / are",
    instructions:
      "Use am with I, is with he / she / it (and singular nouns), and are with you / we / they (and plural nouns). Pick the correct form of the verb to be.",
    questions: [
      { id: "1-1", prompt: "She ___ a doctor.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "She → is: She is a doctor." },
      { id: "1-2", prompt: "I ___ from London.", options: ["is", "are", "be", "am"], correctIndex: 3, explanation: "I → am: I am from London." },
      { id: "1-3", prompt: "They ___ very happy today.", options: ["am", "is", "be", "are"], correctIndex: 3, explanation: "They → are: They are very happy today." },
      { id: "1-4", prompt: "The weather ___ beautiful today.", options: ["am", "are", "be", "is"], correctIndex: 3, explanation: "The weather (= it) → is: The weather is beautiful today." },
      { id: "1-5", prompt: "We ___ students at this university.", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "We → are: We are students at this university." },
      { id: "1-6", prompt: "He ___ my best friend.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "He → is: He is my best friend." },
      { id: "1-7", prompt: "You ___ very talented!", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "You → are: You are very talented!" },
      { id: "1-8", prompt: "It ___ a lovely day outside.", options: ["am", "are", "be", "is"], correctIndex: 3, explanation: "It → is: It is a lovely day outside." },
      { id: "1-9", prompt: "My parents ___ at home.", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "My parents (= they) → are: My parents are at home." },
      { id: "1-10", prompt: "I ___ not sure about this.", options: ["is", "are", "be", "am"], correctIndex: 3, explanation: "I → am: I am not sure about this." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: choose isn't / aren't / 'm not",
    instructions:
      "To make a negative with to be, add not after the verb: am not (contraction: 'm not), is not → isn't, are not → aren't. Pick the correct negative form.",
    questions: [
      { id: "2-1", prompt: "She ___ at home right now.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 0, explanation: "She → isn't: She isn't at home right now." },
      { id: "2-2", prompt: "I ___ ready yet.", options: ["isn't", "aren't", "don't", "'m not"], correctIndex: 3, explanation: "I → 'm not: I'm not ready yet." },
      { id: "2-3", prompt: "They ___ from the UK.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 1, explanation: "They → aren't: They aren't from the UK." },
      { id: "2-4", prompt: "He ___ very tall.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 0, explanation: "He → isn't: He isn't very tall." },
      { id: "2-5", prompt: "We ___ in the right place.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 1, explanation: "We → aren't: We aren't in the right place." },
      { id: "2-6", prompt: "It ___ cold outside today.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 0, explanation: "It → isn't: It isn't cold outside today." },
      { id: "2-7", prompt: "You ___ wrong about this.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 1, explanation: "You → aren't: You aren't wrong about this." },
      { id: "2-8", prompt: "My sister ___ a doctor.", options: ["aren't", "isn't", "'m not", "don't"], correctIndex: 1, explanation: "My sister (= she) → isn't: My sister isn't a doctor." },
      { id: "2-9", prompt: "I ___ angry at all.", options: ["isn't", "aren't", "don't", "'m not"], correctIndex: 3, explanation: "I → 'm not: I'm not angry at all." },
      { id: "2-10", prompt: "The shops ___ open on Sunday.", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 1, explanation: "The shops (= they) → aren't: The shops aren't open on Sunday." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: choose Is / Are / Am",
    instructions:
      "To form a question with to be, move the verb before the subject: Is she...? Are they...? Am I...? Short answers repeat the verb: Yes, she is. / No, they aren't.",
    questions: [
      { id: "3-1", prompt: "___ she a teacher?", options: ["Am", "Are", "Is", "Be"], correctIndex: 2, explanation: "She → Is: Is she a teacher?" },
      { id: "3-2", prompt: "___ they from France?", options: ["Am", "Is", "Be", "Are"], correctIndex: 3, explanation: "They → Are: Are they from France?" },
      { id: "3-3", prompt: "___ I in the right room?", options: ["Is", "Are", "Be", "Am"], correctIndex: 3, explanation: "I → Am: Am I in the right room?" },
      { id: "3-4", prompt: "___ he your brother?", options: ["Am", "Are", "Is", "Be"], correctIndex: 2, explanation: "He → Is: Is he your brother?" },
      { id: "3-5", prompt: "___ you ready to start?", options: ["Is", "Am", "Be", "Are"], correctIndex: 3, explanation: "You → Are: Are you ready to start?" },
      { id: "3-6", prompt: "___ it far from here?", options: ["Am", "Are", "Be", "Is"], correctIndex: 3, explanation: "It → Is: Is it far from here?" },
      { id: "3-7", prompt: "___ we late?", options: ["Is", "Am", "Are", "Be"], correctIndex: 2, explanation: "We → Are: Are we late?" },
      { id: "3-8", prompt: "___ your parents at home?", options: ["Am", "Is", "Be", "Are"], correctIndex: 3, explanation: "Your parents (= they) → Are: Are your parents at home?" },
      { id: "3-9", prompt: '"Is she happy?" — "Yes, ___."', options: ["she aren't", "I am", "she isn't", "she is"], correctIndex: 3, explanation: "Short positive answer: Yes, she is." },
      { id: "3-10", prompt: '"Are they here?" — "No, ___."', options: ["they are", "they isn't", "they aren't", "they don't"], correctIndex: 2, explanation: "Short negative answer: No, they aren't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all forms + contractions",
    instructions:
      "This exercise mixes affirmative, negative, and question forms of to be, including contractions. For each item, decide: What is the subject? Which form fits — am / is / are, negative, question, or contraction?",
    questions: [
      { id: "4-1", prompt: "He ___ my best friend. (use contraction)", options: ["'s", "is", "'re", "'m"], correctIndex: 0, explanation: "He is → contraction: 's. He's my best friend." },
      { id: "4-2", prompt: "I ___ a student.", options: ["am", "is", "are", "be"], correctIndex: 0, explanation: "I → am: I am a student." },
      { id: "4-3", prompt: "___ you tired after work?", options: ["Am", "Is", "Be", "Are"], correctIndex: 3, explanation: "You → Are: Are you tired after work?" },
      { id: "4-4", prompt: "We ___ from Spain. (use contraction)", options: ["'re", "'s", "'m", "be"], correctIndex: 0, explanation: "We are → contraction: 're. We're from Spain." },
      { id: "4-5", prompt: "My dog and cat ___ both very friendly.", options: ["am", "is", "be", "are"], correctIndex: 3, explanation: "My dog and cat (= they) → are: They are both very friendly." },
      { id: "4-6", prompt: '"Are you from Italy?" — "No, I ___ not."', options: ["am", "is", "are", "be"], correctIndex: 0, explanation: "I → am: No, I am not. (= I'm not.)" },
      { id: "4-7", prompt: "She ___ at the office today. (use negative contraction)", options: ["isn't", "aren't", "'m not", "don't"], correctIndex: 0, explanation: "She is not → contraction: isn't. She isn't at the office today." },
      { id: "4-8", prompt: "It ___ a great idea!", options: ["am", "are", "is", "be"], correctIndex: 2, explanation: "It → is: It is a great idea!" },
      { id: "4-9", prompt: "___ I the only one here?", options: ["Is", "Are", "Be", "Am"], correctIndex: 3, explanation: "I → Am: Am I the only one here?" },
      { id: "4-10", prompt: "They ___ ready yet. (use negative contraction)", options: ["aren't", "isn't", "am not", "don't"], correctIndex: 0, explanation: "They are not → contraction: aren't. They aren't ready yet." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative",
  3: "Questions",
  4: "Mixed",
};

/* ─── Helper components ─────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
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

function Ex({ en }: { en: string }) {
  return (
    <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
      <div className="font-semibold text-slate-900 text-sm">{en}</div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function AmIsAreClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function checkAnswers() {
    setChecked(true);
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

      pageHeader(1, "Present Simple · am / is / are Worksheet");
      pdf.setFillColor(BK); pdf.roundedRect(W-mr-22, 5, 22, 6, 1.5, 1.5, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(Y);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("A1  LEVEL", W-mr-11, 8, { align:"center", baseline:"middle" } as any);
      let y = 19;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 22, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(26); pdf.setTextColor(BK);
      pdf.text("am / is / are", ml+5, y+11);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Affirmative \u00B7 Negative \u00B7 Questions \u00B7 Mixed \u2014 4 graded exercises + answer key", ml+5, y+18);
      y += 27;

      numCircle(ml, y, 1);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 1", ml+10, y+5);
      const e1w = pdf.getTextWidth("Exercise 1");
      pill(ml+10+e1w+3, y+0.5, "EASY", "#D1FAE5", "#065F46");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Affirmative — choose am / is / are.", ml+10+e1w+26, y+4.5);
      y += 11;
      const qH = 9;
      const ex1 = [
        "1. She ___ a doctor.   a) am   b) is   c) are   d) be",
        "2. I ___ from London.   a) is   b) are   c) be   d) am",
        "3. They ___ very happy today.   a) am   b) is   c) be   d) are",
        "4. The weather ___ beautiful today.   a) am   b) are   c) be   d) is",
        "5. We ___ students at this university.   a) am   b) is   c) are   d) be",
        "6. He ___ my best friend.   a) am   b) is   c) are   d) be",
        "7. You ___ very talented!   a) am   b) is   c) are   d) be",
        "8. It ___ a lovely day outside.   a) am   b) are   c) be   d) is",
        "9. My parents ___ at home.   a) am   b) is   c) are   d) be",
        "10. I ___ not sure about this.   a) is   b) are   c) be   d) am",
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
      pdf.text("Negative — choose isn't / aren't / 'm not.", ml+10+e2w+26, y+4.5);
      y += 11;
      const ex2 = [
        "1. She ___ at home right now.   a) isn't   b) aren't   c) 'm not   d) don't",
        "2. I ___ ready yet.   a) isn't   b) aren't   c) don't   d) 'm not",
        "3. They ___ from the UK.   a) isn't   b) aren't   c) 'm not   d) don't",
        "4. He ___ very tall.   a) isn't   b) aren't   c) 'm not   d) don't",
        "5. We ___ in the right place.   a) isn't   b) aren't   c) 'm not   d) don't",
        "6. It ___ cold outside today.   a) isn't   b) aren't   c) 'm not   d) don't",
        "7. You ___ wrong about this.   a) isn't   b) aren't   c) 'm not   d) don't",
        "8. My sister ___ a doctor.   a) aren't   b) isn't   c) 'm not   d) don't",
        "9. I ___ angry at all.   a) isn't   b) aren't   c) don't   d) 'm not",
        "10. The shops ___ open on Sunday.   a) isn't   b) aren't   c) 'm not   d) don't",
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
      pageHeader(2, "Present Simple · am / is / are Worksheet");
      y = 20;
      numCircle(ml, y, 3);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 3", ml+10, y+5);
      const e3w = pdf.getTextWidth("Exercise 3");
      pill(ml+10+e3w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Questions — choose the correct question word.", ml+10+e3w+26, y+4.5);
      y += 11;
      const ex3 = [
        "1. ___ you from here?   a) Am   b) Is   c) Are   d) Be",
        "2. ___ she a teacher?   a) Am   b) Is   c) Are   d) Be",
        "3. ___ they at school?   a) Am   b) Is   c) Are   d) Be",
        "4. ___ he your brother?   a) Am   b) Is   c) Are   d) Be",
        "5. ___ I late?   a) Am   b) Is   c) Are   d) Be",
        "6. ___ it cold outside?   a) Am   b) Is   c) Are   d) Be",
        "7. Where ___ my keys?   a) am   b) is   c) be   d) are",
        "8. How old ___ you?   a) am   b) is   c) be   d) are",
        "9. What ___ your name?   a) am   b) are   c) be   d) is",
        "10. Why ___ she so tired?   a) am   b) are   c) be   d) is",
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
      pdf.text("Mixed — affirmative, negative, question.", ml+10+e4w+26, y+4.5);
      y += 11;
      const ex4 = [
        "1. I ___ happy today.   a) is   b) are   c) am   d) be",
        "2. ___ you tired after work?   a) Am   b) Is   c) Are   d) Be",
        "3. She ___ my colleague.   a) am   b) is   c) are   d) be",
        "4. We ___ not ready yet.   a) am   b) is   c) are   d) be",
        "5. ___ it a good idea?   a) Am   b) Are   c) Is   d) Be",
        "6. They ___ at the office right now.   a) am   b) is   c) be   d) are",
        "7. He ___ not from here.   a) am   b) is   c) are   d) be",
        "8. Where ___ the bathroom?   a) am   b) are   c) is   d) be",
        "9. You ___ so creative!   a) am   b) is   c) be   d) are",
        "10. It ___ very cold today.   a) am   b) are   c) be   d) is",
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
      pageHeader(3, "Present Simple · am / is / are — Answer Key");
      y = 20;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 20, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(24); pdf.setTextColor(BK);
      pdf.text("Answer Key", ml+5, y+10);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Check your answers below", ml+5, y+17);
      y += 26;

      const answerSections = [
        { lbl:"Exercise 1", sub:"Affirmative — am / is / are", ans:["b) is","d) am","d) are","d) is","c) are","b) is","c) are","d) is","c) are","d) am"] },
        { lbl:"Exercise 2", sub:"Negative — isn't / aren't / 'm not", ans:["a) isn't","d) 'm not","b) aren't","a) isn't","b) aren't","a) isn't","b) aren't","b) isn't","d) 'm not","b) aren't"] },
        { lbl:"Exercise 3", sub:"Questions — Am / Is / Are", ans:["c) Are","b) Is","c) Are","b) Is","a) Am","b) Is","d) are","d) are","d) is","d) is"] },
        { lbl:"Exercise 4", sub:"Mixed", ans:["c) am","c) Are","b) is","c) are","c) Is","d) are","b) is","c) is","d) are","d) is"] },
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
        const chipW=24, chipH=7.5, chipStep=36;
        ans.forEach((a, ai) => {
          const col = ai % 5; const row = Math.floor(ai/5);
          const cx = ml + col*chipStep; const cy = y + row*14;
          pdf.setFont("helvetica","bold"); pdf.setFontSize(8); pdf.setTextColor(MG);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(`${ai+1}.`, cx, cy+chipH/2, { baseline:"middle" } as any);
          pdf.setFillColor(Y); pdf.roundedRect(cx+6, cy, chipW, chipH, 1.5, 1.5, "F");
          pdf.setFont("helvetica","bold"); pdf.setFontSize(8); pdf.setTextColor(BK);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(a, cx+6+chipW/2, cy+chipH/2, { align:"center", baseline:"middle" } as any);
        });
        y += 2*14 + 8;
      });

      pdf.setDrawColor(LG); pdf.setLineWidth(0.3); pdf.line(ml, H-12, W-mr, H-12);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc — Free English Grammar", ml, H-7);
      pdf.text("Present Simple \u00B7 am / is / are \u00B7 A1 \u00B7 Free to print & share", W-mr, H-7, { align:"right" });

      pdf.save("EnglishNerd_PresentSimple_AmIsAre_A1.pdf");
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
          <span className="text-slate-700 font-medium">am / is / are</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">am / is / are</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Beginner</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">A1</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice the verb <b>to be</b> in Present Simple with 40 multiple choice questions across four sets: affirmative, negative, questions, and a mixed review. Pick the correct form and check your answers.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className="">
              <div className=""><SpeedRound gameId="ps-to-be" subject="am / is / are" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
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
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Exercises
              </button>
              <button
                onClick={() => setTab("explanation")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
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
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}
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
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}
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
                                        setAnswers((p) => ({ ...p, [q.id]: oi }))
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
                                    {q.options[q.correctIndex]} —{" "}
                                    {q.explanation}
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
                { title: "Quiz — Multiple Choice", href: "/tenses/present-simple/quiz", img: "/topics/exercises/quiz.jpg", level: "A1", badge: "bg-emerald-500", reason: "Test all PS forms" },
                { title: "Fill in the Blank", href: "/tenses/present-simple/fill-in-blank", img: "/topics/exercises/fill-in-blank.jpg", level: "A1", badge: "bg-emerald-500", reason: "Write the correct form" },
                { title: "do / does / don't / doesn't", href: "/tenses/present-simple/do-dont-do-i", img: "/topics/exercises/do-does.jpg", level: "A1", badge: "bg-emerald-500", reason: "Auxiliaries practice" },
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
            <SpeedRound gameId="ps-to-be" subject="am / is / are" questions={SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/present-simple/quiz"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Present Simple Quiz
          </a>
          <a
            href="/tenses/present-simple/do-dont-do-i"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: do / does →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">am / is / are — Key Rules</h2>
        <p className="text-slate-500 text-sm">Three sentence patterns — learn the formula, then practise.</p>
      </div>

      {/* 3 sentence types */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Affirmative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "am / is / are", color: "yellow" }, { dim: true, text: "+" },
            { text: "complement", color: "slate" }, { dim: true, text: "+" },
            { text: ".", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I am a teacher." />
            <Ex en="She is from France." />
            <Ex en="They are students." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Negative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "am not / isn't / aren't", color: "red" }, { dim: true, text: "+" },
            { text: "complement", color: "slate" }, { dim: true, text: "+" },
            { text: ".", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I'm not tired." />
            <Ex en="He isn't at home." />
            <Ex en="We aren't ready." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[
            { text: "Am / Is / Are", color: "violet" }, { dim: true, text: "+" },
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "complement", color: "slate" }, { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Am I right?" />
            <Ex en="Is she a doctor?" />
            <Ex en="Are they here?" />
          </div>
        </div>
      </div>

      {/* Full conjugation table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Full conjugation — am / is / are</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Subject</th>
                <th className="text-left font-black text-emerald-600 pb-2 pr-4">✅ Affirmative</th>
                <th className="text-left font-black text-red-500 pb-2 pr-4">❌ Negative</th>
                <th className="text-left font-black text-sky-600 pb-2">❓ Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I",          "I am (I'm)",          "I am not (I'm not)",      "Am I...?"],
                ["You",        "You are (you're)",     "You aren't",              "Are you...?"],
                ["He / She",   "He is (he's) ← is!",  "He isn't",                "Is he...?"],
                ["It",         "It is (it's) ← is!",  "It isn't",                "Is it...?"],
                ["We",         "We are (we're)",       "We aren't",               "Are we...?"],
                ["They",       "They are (they're)",   "They aren't",             "Are they...?"],
              ].map(([subj, aff, neg, q]) => {
                const isHeSheIt = subj === "He / She" || subj === "It";
                return (
                  <tr key={subj} className={isHeSheIt ? "bg-amber-50/60" : ""}>
                    <td className="py-2 pr-4 font-black text-slate-700">{subj}</td>
                    <td className={`py-2 pr-4 font-mono text-sm ${isHeSheIt ? "text-emerald-700 font-black" : "text-slate-600"}`}>{aff}</td>
                    <td className={`py-2 pr-4 font-mono text-sm ${isHeSheIt ? "text-red-600 font-black" : "text-slate-600"}`}>{neg}</td>
                    <td className={`py-2 font-mono text-sm ${isHeSheIt ? "text-sky-700 font-black" : "text-slate-600"}`}>{q}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ Key point:</b> He / She / It always use <b>is</b> — never <i>are</i> or <i>am</i>!<br />
          <span className="font-mono">She is a teacher.</span> ✅ &nbsp;|&nbsp; <span className="font-mono line-through opacity-60">She are a teacher.</span> ❌
        </div>
      </div>

      {/* Contractions grid */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">🔗</span>
          <h3 className="font-black text-slate-900">Contractions</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">In spoken and informal written English, we almost always use contractions:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { full: "I am", short: "I'm" },
            { full: "you are", short: "you're" },
            { full: "he is", short: "he's" },
            { full: "she is", short: "she's" },
            { full: "it is", short: "it's" },
            { full: "we are", short: "we're" },
            { full: "they are", short: "they're" },
            { full: "is not", short: "isn't" },
            { full: "are not", short: "aren't" },
          ].map(({ full, short }) => (
            <div key={short} className="rounded-xl border border-black/10 bg-slate-50 px-3 py-2 text-center">
              <div className="text-xs text-slate-500">{full}</div>
              <div className="font-black text-slate-900 text-sm">{short}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Note: <b>am not</b> → the only accepted contraction is <b>I&apos;m not</b>. There is no <i>amn&apos;t</i> in standard English.</p>
      </div>

      {/* Short answers */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">💬</span>
          <h3 className="font-black text-slate-900">Short answers</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">Repeat only the verb to be — do not repeat the complement:</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { q: "Are you ready?",       yes: "Yes, I am.",        no: "No, I'm not." },
            { q: "Is she at home?",      yes: "Yes, she is.",      no: "No, she isn't." },
            { q: "Are they students?",   yes: "Yes, they are.",    no: "No, they aren't." },
            { q: "Is it cold today?",    yes: "Yes, it is.",       no: "No, it isn't." },
          ].map(({ q, yes, no }) => (
            <div key={q} className="rounded-xl border border-black/8 bg-black/[0.02] px-3 py-2.5">
              <div className="text-xs font-black text-slate-500 mb-1">{q}</div>
              <div className="text-sm font-semibold text-emerald-700">{yes}</div>
              <div className="text-sm font-semibold text-red-600">{no}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Uses of to be */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm">📌</span>
          <h3 className="font-black text-slate-900">Uses of to be in Present Simple</h3>
        </div>
        <div className="space-y-2">
          {[
            ["Professions", "She is a nurse. / I am a student."],
            ["Nationality & origin", "He is French. / We are from Spain."],
            ["States & feelings", "I am tired. / They are happy."],
            ["Age", "She is 25 years old. / He is 10."],
            ["Location", "She is at home. / They are in the office."],
            ["Description", "The weather is beautiful. / The film is great."],
          ].map(([use, ex]) => (
            <div key={use} className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
              <span className="text-sm shrink-0">✅</span>
              <div>
                <div className="text-xs font-black text-emerald-700 uppercase tracking-wide">{use}</div>
                <div className="font-semibold text-sm text-slate-800 italic mt-0.5">{ex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">⚠</span>
          <div>
            <div className="font-black text-amber-800 mb-1">Never use do / does with to be!</div>
            <div className="text-sm text-amber-700 space-y-1">
              <div><span className="font-mono font-semibold">Are you happy?</span> ✅</div>
              <div><span className="font-mono line-through opacity-60">Do you be happy?</span> ❌</div>
              <div className="mt-2"><span className="font-mono font-semibold">Is she a teacher?</span> ✅</div>
              <div><span className="font-mono line-through opacity-60">Does she be a teacher?</span> ❌</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
