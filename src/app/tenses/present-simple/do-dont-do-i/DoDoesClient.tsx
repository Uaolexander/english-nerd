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
  { q: "___ she like jazz?",                    options: ["Do","Does","Is","Are"],              answer: 1 },
  { q: "___ they live near here?",               options: ["Does","Do","Is","Are"],              answer: 1 },
  { q: "___ he play football?",                  options: ["Do","Does","Is","Are"],              answer: 1 },
  { q: "___ you speak French?",                  options: ["Does","Do","Is","Are"],              answer: 1 },
  { q: "___ it rain a lot here?",                options: ["Do","Does","Is","Are"],              answer: 1 },
  { q: "___ the train leave at 8?",              options: ["Do","Are","Does","Is"],              answer: 2 },
  { q: "She ___ like spicy food.",               options: ["don't","doesn't","isn't","aren't"], answer: 1 },
  { q: "I ___ eat breakfast every morning.",     options: ["doesn't","isn't","don't","aren't"], answer: 2 },
  { q: "They ___ live near here.",               options: ["doesn't","don't","aren't","isn't"], answer: 1 },
  { q: "He ___ watch TV much.",                  options: ["don't","doesn't","isn't","aren't"], answer: 1 },
  { q: "We ___ have a car.",                     options: ["doesn't","isn't","aren't","don't"], answer: 3 },
  { q: "My dog ___ eat vegetables.",             options: ["don't","doesn't","isn't","aren't"], answer: 1 },
  { q: '"Do you like jazz?" — "Yes, I ___."',   options: ["does","is","am","do"],              answer: 3 },
  { q: '"Does she work?" — "No, she ___."',      options: ["don't","isn't","doesn't","won't"],  answer: 2 },
  { q: '"Do they live here?" — "Yes, they ___."',options: ["does","are","did","do"],            answer: 3 },
  { q: "___ I need a ticket?",                   options: ["Does","Is","Are","Do"],             answer: 3 },
  { q: "You ___ need to worry.",                 options: ["doesn't","isn't","aren't","don't"], answer: 3 },
  { q: "It ___ snow here in summer.",            options: ["don't","isn't","aren't","doesn't"], answer: 3 },
  { q: "She ___ know the answer.",               options: ["doesn't","don't","isn't","aren't"], answer: 0 },
  { q: "My parents ___ speak English.",          options: ["doesn't","don't","isn't","aren't"], answer: 1 },
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
    title: "Exercise 1 — Questions: choose Do or Does",
    instructions:
      "To form a yes/no question in Present Simple, use Do with I / you / we / they and Does with he / she / it (and singular nouns). The main verb always stays in its base form.",
    questions: [
      { id: "1-1",  prompt: "___ she like jazz?",                      options: ["Do", "Does", "Is", "Are"],  correctIndex: 1, explanation: "She → Does: Does she like jazz?" },
      { id: "1-2",  prompt: "___ they live near here?",                options: ["Does", "Do", "Is", "Are"],  correctIndex: 1, explanation: "They → Do: Do they live near here?" },
      { id: "1-3",  prompt: "___ he play football?",                   options: ["Do", "Does", "Is", "Are"],  correctIndex: 1, explanation: "He → Does: Does he play football?" },
      { id: "1-4",  prompt: "___ you speak French?",                   options: ["Does", "Do", "Is", "Are"],  correctIndex: 1, explanation: "You → Do: Do you speak French?" },
      { id: "1-5",  prompt: "___ your parents work in the city?",      options: ["Does", "Is", "Do", "Are"],  correctIndex: 2, explanation: "Your parents (= they) → Do: Do your parents work in the city?" },
      { id: "1-6",  prompt: "___ it rain a lot here?",                 options: ["Do", "Does", "Is", "Are"],  correctIndex: 1, explanation: "It → Does: Does it rain a lot here?" },
      { id: "1-7",  prompt: "___ we need to bring anything?",          options: ["Does", "Is", "Are", "Do"],  correctIndex: 3, explanation: "We → Do: Do we need to bring anything?" },
      { id: "1-8",  prompt: "___ the train leave at 8?",               options: ["Do", "Are", "Does", "Is"],  correctIndex: 2, explanation: "The train (= it) → Does: Does the train leave at 8?" },
      { id: "1-9",  prompt: "___ I need a ticket?",                    options: ["Does", "Is", "Are", "Do"],  correctIndex: 3, explanation: "I → Do: Do I need a ticket?" },
      { id: "1-10", prompt: "___ she know the answer?",                options: ["Do", "Does", "Is", "Are"],  correctIndex: 1, explanation: "She → Does: Does she know the answer?" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negatives: choose don't or doesn't",
    instructions:
      "To make a negative in Present Simple, use don't (do not) with I / you / we / they, and doesn't (does not) with he / she / it. The main verb always stays in its base form after don't / doesn't.",
    questions: [
      { id: "2-1",  prompt: "She ___ like spicy food.",               options: ["don't", "doesn't", "isn't", "aren't"], correctIndex: 1, explanation: "She → doesn't: She doesn't like spicy food." },
      { id: "2-2",  prompt: "I ___ eat breakfast every morning.",     options: ["doesn't", "isn't", "don't", "aren't"], correctIndex: 2, explanation: "I → don't: I don't eat breakfast every morning." },
      { id: "2-3",  prompt: "They ___ live near here.",               options: ["doesn't", "don't", "aren't", "isn't"], correctIndex: 1, explanation: "They → don't: They don't live near here." },
      { id: "2-4",  prompt: "He ___ watch TV much.",                  options: ["don't", "doesn't", "isn't", "aren't"], correctIndex: 1, explanation: "He → doesn't: He doesn't watch TV much." },
      { id: "2-5",  prompt: "We ___ have a car.",                     options: ["doesn't", "isn't", "aren't", "don't"], correctIndex: 3, explanation: "We → don't: We don't have a car." },
      { id: "2-6",  prompt: "My dog ___ eat vegetables.",             options: ["don't", "doesn't", "isn't", "aren't"], correctIndex: 1, explanation: "My dog (= it) → doesn't: My dog doesn't eat vegetables." },
      { id: "2-7",  prompt: "You ___ need to worry.",                 options: ["doesn't", "isn't", "aren't", "don't"], correctIndex: 3, explanation: "You → don't: You don't need to worry." },
      { id: "2-8",  prompt: "It ___ snow here in summer.",            options: ["don't", "isn't", "aren't", "doesn't"], correctIndex: 3, explanation: "It → doesn't: It doesn't snow here in summer." },
      { id: "2-9",  prompt: "She ___ know the answer.",               options: ["doesn't", "don't", "isn't", "aren't"], correctIndex: 0, explanation: "She → doesn't: She doesn't know the answer." },
      { id: "2-10", prompt: "My parents ___ speak English.",          options: ["doesn't", "don't", "isn't", "aren't"], correctIndex: 1, explanation: "My parents (= they) → don't: My parents don't speak English." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Short answers + base form after do / does",
    instructions:
      "Short answers use do / does / don't / doesn't — never repeat the main verb. After doesn't or does, the main verb always stays in its base form: she doesn't drink (NOT drinks), does he play (NOT plays).",
    questions: [
      { id: "3-1", prompt: '"Do you study English?" — "Yes, ___."',         options: ["I do", "I does", "I am", "I study"],       correctIndex: 0, explanation: "Short positive answer with Do: Yes, I do." },
      { id: "3-2", prompt: '"Does she like jazz?" — "No, ___."',            options: ["she don't", "she isn't", "she doesn't", "she no"], correctIndex: 2, explanation: "Short negative answer with Does: No, she doesn't." },
      { id: "3-3", prompt: '"Do they live here?" — "No, ___."',             options: ["they doesn't", "they aren't", "they don't", "they no"], correctIndex: 2, explanation: "Short negative answer with Do: No, they don't." },
      { id: "3-4", prompt: '"Does he work here?" — "Yes, ___."',            options: ["he do", "he does", "he is", "he works"],    correctIndex: 1, explanation: "Short positive answer with Does: Yes, he does." },
      { id: "3-5", prompt: "She doesn't ___ coffee.",                       options: ["drink", "drinks", "drinking", "drank"],     correctIndex: 0, explanation: "After doesn't, the verb stays in base form: drink." },
      { id: "3-6", prompt: "Does he ___ the guitar?",                       options: ["play", "plays", "playing", "played"],       correctIndex: 0, explanation: "After Does, the verb stays in base form: play." },
      { id: "3-7", prompt: "They don't ___ on weekends.",                   options: ["work", "works", "working", "worked"],       correctIndex: 0, explanation: "After don't, the verb stays in base form: work." },
      { id: "3-8", prompt: "Does she ___ French?",                          options: ["speak", "speaks", "speaking", "spoke"],     correctIndex: 0, explanation: "After Does, the verb stays in base form: speak." },
      { id: "3-9", prompt: "Do they ___ near here?",                        options: ["live", "lives", "living", "lived"],          correctIndex: 0, explanation: "After Do, the verb stays in base form: live." },
      { id: "3-10", prompt: "He doesn't ___ early.",                        options: ["wake", "wakes", "waking", "woke"],           correctIndex: 0, explanation: "After doesn't, the verb stays in base form: wake." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: questions, negatives, short answers",
    instructions:
      "This exercise mixes all three patterns. For each item, decide whether you need Do/Does for a question, don't/doesn't for a negative, a short answer, or a base form verb. Remember: do/does is NOT used with the verb to be.",
    questions: [
      { id: "4-1",  prompt: "___ your sister work in the city?",             options: ["Do", "Is", "Does", "Are"],                correctIndex: 2, explanation: "Your sister (= she) → Does: Does your sister work in the city?" },
      { id: "4-2",  prompt: "I ___ understand this grammar rule.",           options: ["doesn't", "isn't", "don't", "no"],         correctIndex: 2, explanation: "I → don't: I don't understand this grammar rule." },
      { id: "4-3",  prompt: '"Does Tom play chess?" — "Yes, ___."',          options: ["he do", "he is", "he plays", "he does"],   correctIndex: 3, explanation: "Short positive answer with Does: Yes, he does." },
      { id: "4-4",  prompt: "My cat ___ like loud noises.",                  options: ["don't", "isn't", "aren't", "doesn't"],     correctIndex: 3, explanation: "My cat (= it) → doesn't: My cat doesn't like loud noises." },
      { id: "4-5",  prompt: "___ you and your family eat together every day?", options: ["Does", "Is", "Are", "Do"],               correctIndex: 3, explanation: "You and your family (= we/they) → Do: Do you and your family eat together every day?" },
      { id: "4-6",  prompt: '"Is she tired?" — which is CORRECT?',           options: ["Do she tired?", "Does she tired?", "Is she tired?", "Does she is tired?"], correctIndex: 2, explanation: "With the verb to be, use is/are/am — NOT do/does." },
      { id: "4-7",  prompt: "He ___ go to the gym regularly.",               options: ["don't", "doesn't", "isn't", "aren't"],     correctIndex: 1, explanation: "He → doesn't: He doesn't go to the gym regularly." },
      { id: "4-8",  prompt: "___ it take long to get there?",                options: ["Do", "Is", "Are", "Does"],                 correctIndex: 3, explanation: "It → Does: Does it take long to get there?" },
      { id: "4-9",  prompt: '"Do they speak Spanish?" — "No, ___."',         options: ["they doesn't", "they aren't", "they don't", "they no"], correctIndex: 2, explanation: "Short negative answer with Do: No, they don't." },
      { id: "4-10", prompt: "We ___ usually stay up late.",                  options: ["doesn't", "isn't", "aren't", "don't"],     correctIndex: 3, explanation: "We → don't: We don't usually stay up late." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Questions",
  2: "Negatives",
  3: "Short Ans.",
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

export default function DoDoesClient() {
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

      pageHeader(1, "Present Simple · do / does / don't / doesn't Worksheet");
      pdf.setFillColor(BK); pdf.roundedRect(W-mr-22, 5, 22, 6, 1.5, 1.5, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(Y);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("A1  LEVEL", W-mr-11, 8, { align:"center", baseline:"middle" } as any);
      let y = 19;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 22, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(22); pdf.setTextColor(BK);
      pdf.text("do / does / don't / doesn't", ml+5, y+11);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Questions \u00B7 Negatives \u00B7 Short answers \u00B7 Mixed \u2014 4 exercises + answer key", ml+5, y+18);
      y += 27;

      const qH = 9;
      numCircle(ml, y, 1);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 1", ml+10, y+5);
      const e1w = pdf.getTextWidth("Exercise 1");
      pill(ml+10+e1w+3, y+0.5, "EASY", "#D1FAE5", "#065F46");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Questions — choose Do or Does.", ml+10+e1w+26, y+4.5);
      y += 11;
      const ex1 = [
        "1. ___ she like jazz?   a) Do   b) Does   c) Is   d) Are",
        "2. ___ they live near here?   a) Does   b) Do   c) Is   d) Are",
        "3. ___ he play football?   a) Do   b) Does   c) Is   d) Are",
        "4. ___ you speak French?   a) Does   b) Do   c) Is   d) Are",
        "5. ___ your parents work in the city?   a) Does   b) Is   c) Do   d) Are",
        "6. ___ it rain a lot here?   a) Do   b) Does   c) Is   d) Are",
        "7. ___ we need to bring anything?   a) Does   b) Is   c) Are   d) Do",
        "8. ___ the train leave at 8?   a) Do   b) Are   c) Does   d) Is",
        "9. ___ I need a ticket?   a) Does   b) Is   c) Are   d) Do",
        "10. ___ she know the answer?   a) Do   b) Does   c) Is   d) Are",
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
      pdf.text("Negatives — choose don't or doesn't.", ml+10+e2w+26, y+4.5);
      y += 11;
      const ex2 = [
        "1. She ___ like spicy food.   a) don't   b) doesn't   c) isn't   d) aren't",
        "2. I ___ eat breakfast every morning.   a) doesn't   b) isn't   c) don't   d) aren't",
        "3. They ___ live near here.   a) doesn't   b) don't   c) aren't   d) isn't",
        "4. He ___ watch TV much.   a) don't   b) doesn't   c) isn't   d) aren't",
        "5. We ___ have a car.   a) doesn't   b) isn't   c) aren't   d) don't",
        "6. My dog ___ eat vegetables.   a) don't   b) doesn't   c) isn't   d) aren't",
        "7. You ___ need to worry.   a) doesn't   b) isn't   c) aren't   d) don't",
        "8. It ___ snow here in summer.   a) don't   b) isn't   c) aren't   d) doesn't",
        "9. She ___ know the answer.   a) doesn't   b) don't   c) isn't   d) aren't",
        "10. My parents ___ speak English.   a) doesn't   b) don't   c) isn't   d) aren't",
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
      pageHeader(2, "Present Simple · do / does / don't / doesn't Worksheet");
      y = 20;
      numCircle(ml, y, 3);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 3", ml+10, y+5);
      const e3w = pdf.getTextWidth("Exercise 3");
      pill(ml+10+e3w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Short answers — choose the correct form.", ml+10+e3w+26, y+4.5);
      y += 11;
      const ex3 = [
        '1. "Do you like chocolate?" — "Yes, I ___."   a) does   b) am   c) did   d) do',
        '2. "Does she work here?" — "No, she ___."   a) don\'t   b) isn\'t   c) doesn\'t   d) not',
        '3. "Do they live in Paris?" — "Yes, they ___."   a) does   b) are   c) did   d) do',
        '4. "Does he drink coffee?" — "Yes, he ___."   a) do   b) does   c) is   d) plays',
        '5. "Do you speak Spanish?" — "No, I ___."   a) doesn\'t   b) isn\'t   c) don\'t   d) not',
        '6. "Does she like jazz?" — "No, she ___."   a) don\'t   b) isn\'t   c) doesn\'t   d) won\'t',
        '7. "Do they have a dog?" — "Yes, they ___."   a) does   b) are   c) have   d) do',
        '8. "Does it rain a lot?" — "No, it ___."   a) don\'t   b) isn\'t   c) doesn\'t   d) not',
        '9. "Do we need tickets?" — "Yes, you ___."   a) does   b) are   c) do   d) need',
        '10. "Does Mark play guitar?" — "Yes, he ___."   a) do   b) does   c) plays   d) is',
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
      pdf.text("Mixed — all forms.", ml+10+e4w+26, y+4.5);
      y += 11;
      const ex4 = [
        "1. ___ your sister speak Italian?   a) Do   b) Is   c) Are   d) Does",
        "2. He ___ like horror films.   a) don't   b) doesn't   c) isn't   d) aren't",
        "3. ___ they know the answer?   a) Does   b) Are   c) Do   d) Is",
        "4. We ___ usually eat out on weekdays.   a) doesn't   b) don't   c) isn't   d) aren't",
        '5. "Does she run every day?" — "Yes, she ___."   a) do   b) is   c) does   d) runs',
        "6. She ___ eat breakfast at home.   a) don't   b) doesn't   c) isn't   d) aren't",
        "7. ___ it get cold in winter here?   a) Do   b) Are   c) Is   d) Does",
        '8. "Do you study French?" — "No, I ___."   a) doesn\'t   b) don\'t   c) isn\'t   d) not',
        "9. My parents ___ live in the city.   a) doesn't   b) don't   c) isn't   d) aren't",
        "10. ___ he know your address?   a) Do   b) Are   c) Is   d) Does",
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
      pageHeader(3, "Present Simple · do / does — Answer Key");
      y = 20;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 20, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(24); pdf.setTextColor(BK);
      pdf.text("Answer Key", ml+5, y+10);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Check your answers below", ml+5, y+17);
      y += 26;

      const answerSections = [
        { lbl:"Exercise 1", sub:"Questions — Do / Does", ans:["b) Does","b) Do","b) Does","b) Do","c) Do","b) Does","d) Do","c) Does","d) Do","b) Does"] },
        { lbl:"Exercise 2", sub:"Negatives — don't / doesn't", ans:["b) doesn't","c) don't","b) don't","b) doesn't","d) don't","b) doesn't","d) don't","d) doesn't","a) doesn't","b) don't"] },
        { lbl:"Exercise 3", sub:"Short answers", ans:["d) do","c) doesn't","d) do","b) does","c) don't","c) doesn't","d) do","c) doesn't","c) do","b) does"] },
        { lbl:"Exercise 4", sub:"Mixed", ans:["d) Does","b) doesn't","c) Do","b) don't","c) does","b) doesn't","d) Does","b) don't","b) don't","d) Does"] },
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
      pdf.text("Present Simple \u00B7 do / does \u00B7 A1 \u00B7 Free to print & share", W-mr, H-7, { align:"right" });

      pdf.save("EnglishNerd_PresentSimple_DoDoesClient_A1.pdf");
    } catch(e) { console.error(e); }
    finally { setPdfLoading(false); }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/present-simple">Present Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">do / does</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">do / does</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">Easy</span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A1</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>do</b>, <b>does</b>, <b>don&apos;t</b> and <b>doesn&apos;t</b> in Present Simple with 40 multiple choice questions across four sets: questions, negatives, short answers, and a mixed review.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className="">
              <div className=""><SpeedRound gameId="ps-do-does" subject="do / does / don't / doesn't" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
            </div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button
                onClick={() => { setTab("exercises"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Exercises
              </button>
              <button
                onClick={() => { setTab("explanation"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
                { title: "am / is / are", href: "/tenses/present-simple/to-be", img: "/topics/exercises/to-be.jpg", level: "A1", badge: "bg-emerald-500", reason: "Practise to be forms" },
                { title: "Quiz — Multiple Choice", href: "/tenses/present-simple/quiz", img: "/topics/exercises/quiz.jpg", level: "A1", badge: "bg-emerald-500", reason: "Test all PS forms" },
                { title: "Fill in the Blank", href: "/tenses/present-simple/fill-in-blank", img: "/topics/exercises/fill-in-blank.jpg", level: "A1", badge: "bg-emerald-500", reason: "Write the correct form" },
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
            <SpeedRound gameId="ps-do-does" subject="do / does / don't / doesn't" questions={SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/present-simple/to-be"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← am / is / are
          </a>
          <a
            href="/tenses/present-simple/ps-vs-pc"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Simple vs Continuous →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">do / does / don&apos;t / doesn&apos;t — Key Rules</h2>
        <p className="text-slate-500 text-sm">Three patterns — questions, negatives, and short answers. Learn the formula, then practise.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Question card */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[
            { text: "Do / Does", color: "violet" }, { dim: true, text: "+" },
            { text: "subject", color: "sky" }, { dim: true, text: "+" },
            { text: "verb (base)", color: "yellow" }, { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Do you work here?" />
            <Ex en="Does she like coffee?" />
            <Ex en="Do they play football?" />
          </div>
        </div>

        {/* Negative card */}
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Negative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "don't / doesn't", color: "red" }, { dim: true, text: "+" },
            { text: "verb (base)", color: "yellow" }, { dim: true, text: "+" },
            { text: ".", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I don't eat meat." />
            <Ex en="She doesn't work here." />
            <Ex en="They don't have a car." />
          </div>
        </div>

        {/* Short answers card */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💬</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Short Answers</span>
          </div>
          <Formula parts={[
            { text: "Yes / No", color: "slate" }, { dim: true, text: "+" },
            { text: "subject", color: "sky" }, { dim: true, text: "+" },
            { text: "do/does/don't/doesn't", color: "green" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Yes, I do. / No, I don't." />
            <Ex en="Yes, she does. / No, she doesn't." />
            <Ex en="Yes, they do. / No, they don't." />
          </div>
        </div>
      </div>

      {/* Full conjugation table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Do / Does — full table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Subject</th>
                <th className="text-left font-black text-sky-600 pb-2 pr-4">❓ Question</th>
                <th className="text-left font-black text-red-500 pb-2">❌ Negative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { subj: "I",          q: "Do I work?",       neg: "I don't work.",       highlight: false },
                { subj: "You",        q: "Do you work?",     neg: "You don't work.",     highlight: false },
                { subj: "We",         q: "Do we work?",      neg: "We don't work.",      highlight: false },
                { subj: "They",       q: "Do they work?",    neg: "They don't work.",    highlight: false },
                { subj: "He / She",   q: "Does he work?",    neg: "He doesn't work.",    highlight: true  },
                { subj: "It",         q: "Does it work?",    neg: "It doesn't work.",    highlight: true  },
              ].map(({ subj, q, neg, highlight }) => (
                <tr key={subj} className={highlight ? "bg-amber-50" : ""}>
                  <td className={`py-2 pr-4 font-black ${highlight ? "text-amber-700" : "text-slate-700"}`}>{subj}</td>
                  <td className={`py-2 pr-4 font-mono text-sm ${highlight ? "text-sky-700 font-black" : "text-slate-600"}`}>{q}</td>
                  <td className={`py-2 font-mono text-sm ${highlight ? "text-red-600 font-black" : "text-slate-600"}`}>{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ He / She / It rows are highlighted</b> — these use <b>Does / doesn&apos;t</b> instead of Do / don&apos;t.
        </div>
      </div>

      {/* Amber warning — base form */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠</span>
          <h3 className="font-black text-amber-800">After doesn&apos;t / does — verb ALWAYS stays in BASE FORM!</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-1">Correct ✅</div>
            <div className="font-mono text-sm text-slate-800">She doesn&apos;t <b>work</b>.</div>
            <div className="font-mono text-sm text-slate-800">Does he <b>go</b> to school?</div>
            <div className="font-mono text-sm text-slate-800">They don&apos;t <b>play</b>.</div>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <div className="text-xs font-black text-red-600 uppercase tracking-wide mb-1">Wrong ❌</div>
            <div className="font-mono text-sm text-slate-500 line-through opacity-60">She doesn&apos;t works.</div>
            <div className="font-mono text-sm text-slate-500 line-through opacity-60">Does he goes to school?</div>
            <div className="font-mono text-sm text-slate-500 line-through opacity-60">They don&apos;t plays.</div>
          </div>
        </div>
      </div>

      {/* Short answers table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">💬</span>
          <h3 className="font-black text-slate-900">Short answers</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">Never repeat the main verb — use do / does / don&apos;t / doesn&apos;t only:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Question</th>
                <th className="text-left font-black text-emerald-600 pb-2 pr-4">Yes answer</th>
                <th className="text-left font-black text-red-500 pb-2">No answer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { q: "Do you work?",       yes: "Yes, I do.",        no: "No, I don't." },
                { q: "Do they live here?", yes: "Yes, they do.",     no: "No, they don't." },
                { q: "Does she like jazz?",yes: "Yes, she does.",    no: "No, she doesn't." },
                { q: "Does he play?",      yes: "Yes, he does.",     no: "No, he doesn't." },
                { q: "Does it work?",      yes: "Yes, it does.",     no: "No, it doesn't." },
              ].map(({ q, yes, no }) => (
                <tr key={q}>
                  <td className="py-2 pr-4 font-mono text-slate-700">{q}</td>
                  <td className="py-2 pr-4 font-semibold text-emerald-700">{yes}</td>
                  <td className="py-2 font-semibold text-red-600">{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key rule: do/does NOT used with to be */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">📌</span>
          <h3 className="font-black text-slate-900">Key rule: do / does is NOT used with the verb to be</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">The verb <b>to be</b> (am / is / are) forms its own questions and negatives — it never uses do / does.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2">Correct ✅</div>
            <div className="space-y-2">
              <Ex en="Is she tired?" />
              <Ex en="He isn't at home." />
              <Ex en="Are they ready?" />
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-red-600 uppercase tracking-wide mb-2">Wrong ❌</div>
            <div className="space-y-2">
              <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5 opacity-50">
                <div className="font-semibold text-slate-900 text-sm line-through">Does she is tired?</div>
              </div>
              <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5 opacity-50">
                <div className="font-semibold text-slate-900 text-sm line-through">He doesn&apos;t is at home.</div>
              </div>
              <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5 opacity-50">
                <div className="font-semibold text-slate-900 text-sm line-through">Do they are ready?</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-100 text-sm">🕐</span>
          <h3 className="font-black text-slate-900">Common time expressions with Present Simple</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">These words and phrases often appear in sentences using do / does / don&apos;t / doesn&apos;t:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "always", "usually", "often", "sometimes", "rarely", "never",
            "every day", "every week", "every morning", "on Mondays",
            "at the weekend", "in the morning", "once a week", "twice a month",
          ].map((expr) => (
            <span key={expr} className="rounded-lg px-3 py-1.5 text-xs font-black border bg-sky-50 text-sky-800 border-sky-200">
              {expr}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <Ex en="Do you always eat breakfast?" />
          <Ex en="She usually doesn't work on Sundays." />
          <Ex en="Does he ever play tennis?" />
        </div>
      </div>
    </div>
  );
}
