"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "She ___ (go) to school every day.",        options: ["go","goes","going","gone"],            answer: 1 },
  { q: "They ___ (live) in New York.",              options: ["lives","lived","live","living"],        answer: 2 },
  { q: "He ___ (drink) coffee every morning.",      options: ["drink","drank","drinking","drinks"],   answer: 3 },
  { q: "I ___ (work) in a hospital.",               options: ["works","working","worked","work"],      answer: 3 },
  { q: "My cat ___ (sleep) all day.",               options: ["sleep","sleeping","slept","sleeps"],   answer: 3 },
  { q: "She ___ (watch) TV every evening.",         options: ["watch","watched","watching","watches"],answer: 3 },
  { q: "I ___ (not / eat) meat.",                   options: ["doesn't eat","not eat","don't eat","no eat"],answer: 2 },
  { q: "She ___ (not / watch) TV in the morning.",  options: ["don't watch","not watch","doesn't watch","no watch"],answer: 2 },
  { q: "He ___ (not / like) spicy food.",           options: ["don't like","not like","doesn't like","no like"],answer: 2 },
  { q: "We ___ (not / have) a car.",                options: ["doesn't have","not have","no have","don't have"],answer: 3 },
  { q: "The children ___ (play) in the garden.",    options: ["plays","playing","played","play"],     answer: 3 },
  { q: "My dog ___ (not / eat) vegetables.",        options: ["don't eat","not eat","doesn't eat","no eat"],answer: 2 },
  { q: "She ___ (teach) maths at school.",          options: ["teach","teached","teaching","teaches"],answer: 3 },
  { q: "Water ___ (boil) at 100°C.",                options: ["boil","is boiling","boiled","boils"],  answer: 3 },
  { q: "The train ___ (leave) at 8 AM.",            options: ["leave","left","leaving","leaves"],     answer: 3 },
  { q: "You ___ (speak) very fast.",                options: ["speaks","speaking","spoke","speak"],   answer: 3 },
  { q: "We ___ (study) English every week.",        options: ["studies","studied","studying","study"],answer: 3 },
  { q: "She ___ (not / know) the answer.",          options: ["don't know","not know","doesn't know","no know"],answer: 2 },
  { q: "The museum ___ (open) at 9 AM.",            options: ["open","opening","opened","opens"],     answer: 3 },
  { q: "My brother ___ (play) football on weekends.",options: ["play","playing","played","plays"],   answer: 3 },
];

/* ─── Types ─────────────────────────────────────────────────────────────── */

type InputQ = {
  id: string;
  prompt: string;        // sentence with ___ for the gap
  hint: string;          // verb in brackets shown to the user, e.g. "(go)"
  correct: string[];     // accepted answers (all lowercase, trimmed)
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: InputQ[];
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/'/g, "'").replace(/'/g, "'");
}

function isAccepted(val: string, correct: string[]) {
  const n = normalize(val);
  return correct.some((c) => normalize(c) === n);
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Affirmative: write the correct verb form",
    instructions:
      "Write the correct Present Simple form of the verb in brackets. With he / she / it add -s or -es. With I / you / we / they use the base form.",
    questions: [
      { id: "1-1", prompt: "She ___ (go) to school every day.", hint: "(go)", correct: ["goes"], explanation: "She → add -s: goes." },
      { id: "1-2", prompt: "They ___ (live) in New York.", hint: "(live)", correct: ["live"], explanation: "They → base form: live." },
      { id: "1-3", prompt: "He ___ (drink) coffee every morning.", hint: "(drink)", correct: ["drinks"], explanation: "He → add -s: drinks." },
      { id: "1-4", prompt: "I ___ (work) in a hospital.", hint: "(work)", correct: ["work"], explanation: "I → base form: work." },
      { id: "1-5", prompt: "The train ___ (leave) at 8 AM.", hint: "(leave)", correct: ["leaves"], explanation: "Singular noun → add -s: leaves." },
      { id: "1-6", prompt: "We ___ (study) English every week.", hint: "(study)", correct: ["study"], explanation: "We → base form: study." },
      { id: "1-7", prompt: "My cat ___ (sleep) all day.", hint: "(sleep)", correct: ["sleeps"], explanation: "My cat (= it) → add -s: sleeps." },
      { id: "1-8", prompt: "You ___ (speak) very fast.", hint: "(speak)", correct: ["speak"], explanation: "You → base form: speak." },
      { id: "1-9", prompt: "She ___ (watch) TV every evening.", hint: "(watch)", correct: ["watches"], explanation: "She + verb ending in -ch → add -es: watches." },
      { id: "1-10", prompt: "The children ___ (play) in the garden.", hint: "(play)", correct: ["play"], explanation: "The children (= they) → base form: play." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: write don't or doesn't + verb",
    instructions:
      "Write the full negative form: don't or doesn't + the base form of the verb in brackets. Remember: he / she / it → doesn't; I / you / we / they → don't.",
    questions: [
      { id: "2-1", prompt: "I ___ (eat) meat.", hint: "(eat)", correct: ["don't eat"], explanation: "I → don't eat." },
      { id: "2-2", prompt: "She ___ (watch) TV in the morning.", hint: "(watch)", correct: ["doesn't watch"], explanation: "She → doesn't watch." },
      { id: "2-3", prompt: "They ___ (live) near here.", hint: "(live)", correct: ["don't live"], explanation: "They → don't live." },
      { id: "2-4", prompt: "He ___ (like) spicy food.", hint: "(like)", correct: ["doesn't like"], explanation: "He → doesn't like." },
      { id: "2-5", prompt: "We ___ (have) a car.", hint: "(have)", correct: ["don't have"], explanation: "We → don't have." },
      { id: "2-6", prompt: "My dog ___ (eat) vegetables.", hint: "(eat)", correct: ["doesn't eat"], explanation: "My dog (= it) → doesn't eat." },
      { id: "2-7", prompt: "You ___ (need) to shout.", hint: "(need)", correct: ["don't need"], explanation: "You → don't need." },
      { id: "2-8", prompt: "It ___ (snow) here in summer.", hint: "(snow)", correct: ["doesn't snow"], explanation: "It → doesn't snow." },
      { id: "2-9", prompt: "She ___ (know) the answer.", hint: "(know)", correct: ["doesn't know"], explanation: "She → doesn't know." },
      { id: "2-10", prompt: "My parents ___ (speak) English.", hint: "(speak)", correct: ["don't speak"], explanation: "My parents (= they) → don't speak." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: write the question form",
    instructions:
      "Write the correct question or short answer using the verb in brackets. Use Do or Does at the start. The main verb stays in the base form after Do / Does.",
    questions: [
      { id: "3-1", prompt: "___ you like chocolate? (like)", hint: "(like)", correct: ["do you like chocolate?", "do you like chocolate"], explanation: "You → Do: Do you like chocolate?" },
      { id: "3-2", prompt: "___ she work here? (work)", hint: "(work)", correct: ["does she work here?", "does she work here"], explanation: "She → Does: Does she work here?" },
      { id: "3-3", prompt: "___ they speak French? (speak)", hint: "(speak)", correct: ["do they speak french?", "do they speak french"], explanation: "They → Do: Do they speak French?" },
      { id: "3-4", prompt: "___ he play the guitar? (play)", hint: "(play)", correct: ["does he play the guitar?", "does he play the guitar"], explanation: "He → Does: Does he play the guitar?" },
      { id: "3-5", prompt: "___ your parents live in the city? (live)", hint: "(live)", correct: ["do your parents live in the city?", "do your parents live in the city"], explanation: "Your parents (= they) → Do." },
      { id: "3-6", prompt: "___ it rain a lot in autumn? (rain)", hint: "(rain)", correct: ["does it rain a lot in autumn?", "does it rain a lot in autumn"], explanation: "It → Does: Does it rain a lot in autumn?" },
      { id: "3-7", prompt: "\"Does he drink coffee?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["he does", "yes, he does"], explanation: "Short answer with does: Yes, he does." },
      { id: "3-8", prompt: "\"Do you study English?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i do", "yes, i do"], explanation: "Short answer with do: Yes, I do." },
      { id: "3-9", prompt: "\"Does she like jazz?\" — \"No, ___.\"", hint: "(short answer)", correct: ["she doesn't", "no, she doesn't"], explanation: "Short negative answer: No, she doesn't." },
      { id: "3-10", prompt: "\"Do they live here?\" — \"No, ___.\"", hint: "(short answer)", correct: ["they don't", "no, they don't"], explanation: "Short negative answer: No, they don't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all forms",
    instructions:
      "Write the correct Present Simple form of the verb in brackets: affirmative, negative or question. Read the sentence carefully to decide which form is needed.",
    questions: [
      { id: "4-1", prompt: "My brother ___ (play) football every weekend.", hint: "(play)", correct: ["plays"], explanation: "My brother (= he) → plays." },
      { id: "4-2", prompt: "I ___ (not / like) getting up early.", hint: "(not / like)", correct: ["don't like"], explanation: "I + negative → don't like." },
      { id: "4-3", prompt: "___ she work on weekends? (work)", hint: "(work)", correct: ["does she work on weekends?", "does she work on weekends"], explanation: "She → Does she work…?" },
      { id: "4-4", prompt: "Water ___ (boil) at 100 degrees Celsius.", hint: "(boil)", correct: ["boils"], explanation: "Water (= it) → boils. Scientific fact." },
      { id: "4-5", prompt: "We ___ (not / have) a garden.", hint: "(not / have)", correct: ["don't have"], explanation: "We + negative → don't have." },
      { id: "4-6", prompt: "How often ___ (she / go) to the gym?", hint: "(she / go)", correct: ["does she go", "does she go to the gym?", "does she go to the gym"], explanation: "She → Does she go…?" },
      { id: "4-7", prompt: "The museum ___ (open) at 9 in the morning.", hint: "(open)", correct: ["opens"], explanation: "The museum (= it) → opens." },
      { id: "4-8", prompt: "He ___ (not / eat) breakfast at home.", hint: "(not / eat)", correct: ["doesn't eat"], explanation: "He + negative → doesn't eat." },
      { id: "4-9", prompt: "\"___ (you / enjoy) learning English?\"", hint: "(you / enjoy)", correct: ["do you enjoy", "do you enjoy learning english?", "do you enjoy learning english"], explanation: "You → Do you enjoy…?" },
      { id: "4-10", prompt: "She ___ (teach) maths at a local school.", hint: "(teach)", correct: ["teaches"], explanation: "She + verb ending in -ch → teaches." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative",
  3: "Questions",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function FillInBlankClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

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
      if (isAccepted(answers[q.id] ?? "", q.correct)) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, answers]);

  function reset() {
    setChecked(false);
    setAnswers({});
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
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

      // PAGE 1
      pageHeader(1, "Present Simple · Fill in the Blank Worksheet");
      pdf.setFillColor(BK); pdf.roundedRect(W-mr-22, 5, 22, 6, 1.5, 1.5, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(Y);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("A1  LEVEL", W-mr-11, 8, { align:"center", baseline:"middle" } as any);
      let y = 19;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 22, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(26); pdf.setTextColor(BK);
      pdf.text("Fill in the Blank", ml+5, y+11);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Write the correct Present Simple form of the verb in brackets.", ml+5, y+18);
      y += 27;

      numCircle(ml, y, 1);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 1", ml+10, y+5);
      const e1w = pdf.getTextWidth("Exercise 1");
      pill(ml+10+e1w+3, y+0.5, "EASY", "#D1FAE5", "#065F46");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Affirmative — write the correct form.", ml+10+e1w+26, y+4.5);
      y += 11;
      const qH = 10;
      const ex1 = [
        "1. She _______________ (go) to school every day.",
        "2. They _______________ (live) in New York.",
        "3. He _______________ (drink) coffee every morning.",
        "4. I _______________ (work) in a hospital.",
        "5. The train _______________ (leave) at 8 AM.",
        "6. We _______________ (study) English every week.",
        "7. My cat _______________ (sleep) all day.",
        "8. You _______________ (speak) very fast.",
        "9. She _______________ (watch) TV every evening.",
        "10. The children _______________ (play) in the garden.",
      ];
      ex1.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor("#222222");
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
      pdf.text("Negative — write don't / doesn't + verb.", ml+10+e2w+26, y+4.5);
      y += 11;
      const ex2 = [
        "1. I _______________ (eat) meat.",
        "2. She _______________ (watch) TV in the morning.",
        "3. They _______________ (live) near here.",
        "4. He _______________ (like) spicy food.",
        "5. We _______________ (have) a car.",
        "6. My dog _______________ (eat) vegetables.",
        "7. You _______________ (need) to shout.",
        "8. It _______________ (snow) here in summer.",
        "9. She _______________ (know) the answer.",
        "10. My parents _______________ (speak) English.",
      ];
      ex2.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor("#222222");
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
      pageHeader(2, "Present Simple · Fill in the Blank Worksheet");
      y = 20;
      numCircle(ml, y, 3);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 3", ml+10, y+5);
      const e3w = pdf.getTextWidth("Exercise 3");
      pill(ml+10+e3w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Questions — write Do/Does + subject + verb.", ml+10+e3w+26, y+4.5);
      y += 11;
      const ex3 = [
        "1. _______________ you like chocolate? (like)",
        "2. _______________ she work here? (work)",
        "3. _______________ they speak French? (speak)",
        "4. _______________ he play the guitar? (play)",
        "5. _______________ your parents live in the city? (live)",
        "6. _______________ it rain a lot in autumn? (rain)",
        '7. "Does he drink coffee?" — "Yes, _______________."',
        '8. "Do you study English?" — "Yes, _______________."',
        '9. "Does she like jazz?" — "No, _______________."',
        '10. "Do they live here?" — "No, _______________."',
      ];
      ex3.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor("#222222");
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
        "1. My brother _______________ (play) football every weekend.",
        "2. I _______________ (not / like) getting up early.",
        "3. _______________ she work on weekends? (work)",
        "4. Water _______________ (boil) at 100 degrees Celsius.",
        "5. We _______________ (not / have) a garden.",
        "6. How often _______________ (she / go) to the gym?",
        "7. The museum _______________ (open) at 9 in the morning.",
        "8. He _______________ (not / eat) breakfast at home.",
        '9. "_______________ (you / enjoy) learning English?"',
        "10. She _______________ (teach) maths at a local school.",
      ];
      ex4.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor("#222222");
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
      pageHeader(3, "Present Simple · Fill in the Blank — Answer Key");
      y = 20;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 20, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(24); pdf.setTextColor(BK);
      pdf.text("Answer Key", ml+5, y+10);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Check your answers below", ml+5, y+17);
      y += 26;

      const answerSections = [
        { lbl:"Exercise 1", sub:"Affirmative", ans:["goes","live","drinks","work","leaves","study","sleeps","speak","watches","play"] },
        { lbl:"Exercise 2", sub:"Negative", ans:["don't eat","doesn't watch","don't live","doesn't like","don't have","doesn't eat","don't need","doesn't snow","doesn't know","don't speak"] },
        { lbl:"Exercise 3", sub:"Questions & short answers", ans:["Do you","Does she","Do they","Does he","Do your parents","Does it","he does","I do","she doesn't","they don't"] },
        { lbl:"Exercise 4", sub:"Mixed", ans:["plays","don't like","Does she work","boils","don't have","does she go","opens","doesn't eat","Do you enjoy","teaches"] },
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
        const chipW=30, chipH=7.5, chipStep=40;
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
      pdf.text("Present Simple \u00B7 Fill in the Blank \u00B7 A1 \u00B7 Free to print & share", W-mr, H-7, { align:"right" });

      pdf.save("EnglishNerd_PresentSimple_FillInBlank_A1.pdf");
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
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Present Simple</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions, and mixed. Check your spelling carefully.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className="">
              <SpeedRound gameId="ps-fill-in-blank" subject="Present Simple Writing" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                  <div className="mt-8 space-y-4">
                    {current.questions.map((q, idx) => {
                      const val = answers[q.id] ?? "";
                      const answered = normalize(val) !== "";
                      const correct = checked && answered && isAccepted(val, q.correct);
                      const wrong = checked && answered && !correct;
                      const noAnswer = checked && !answered;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              {/* Sentence displayed with blank */}
                              <div className="font-semibold text-slate-900 leading-relaxed">
                                {q.prompt.split("___").map((part, i, arr) =>
                                  i < arr.length - 1 ? (
                                    <span key={i}>
                                      {part}
                                      <span className="inline-block align-baseline mx-1">
                                        <input
                                          type="text"
                                          value={val}
                                          disabled={checked}
                                          autoComplete="off"
                                          autoCorrect="off"
                                          autoCapitalize="off"
                                          spellCheck={false}
                                          placeholder={q.hint}
                                          onChange={(e) =>
                                            setAnswers((p) => ({ ...p, [q.id]: e.target.value }))
                                          }
                                          className={`rounded-lg border px-3 py-1 text-sm font-mono outline-none transition min-w-[120px] ${
                                            checked
                                              ? correct
                                                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                                : wrong
                                                ? "border-red-400 bg-red-50 text-red-800"
                                                : noAnswer
                                                ? "border-amber-300 bg-amber-50"
                                                : ""
                                              : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
                                          }`}
                                        />
                                      </span>
                                    </span>
                                  ) : (
                                    part
                                  )
                                )}
                              </div>

                              {/* Feedback */}
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {correct && (
                                    <div className="text-emerald-700 font-semibold">✅ Correct</div>
                                  )}
                                  {wrong && (
                                    <div className="text-red-700 font-semibold">❌ Wrong — you wrote: <span className="font-mono">{val}</span></div>
                                  )}
                                  {noAnswer && (
                                    <div className="text-amber-700 font-semibold">⚠ No answer</div>
                                  )}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    <span className="font-mono font-bold text-slate-800">{q.correct[0]}</span>{" "}
                                    — {q.explanation}
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
                          onClick={() => setChecked(true)}
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
                { title: "Quiz — Multiple Choice", href: "/tenses/present-simple/quiz", img: "/topics/exercises/quiz.jpg", level: "A1", badge: "bg-emerald-500", reason: "Test what you know" },
                { title: "am / is / are", href: "/tenses/present-simple/to-be", img: "/topics/exercises/to-be.jpg", level: "A1", badge: "bg-emerald-500", reason: "Practise to be forms" },
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
            <SpeedRound gameId="ps-fill-in-blank" subject="Present Simple Writing" questions={SPEED_QUESTIONS} />
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
            ← Multiple Choice
          </a>
          <a
            href="/tenses/present-simple/spot-the-mistake"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Spot the Mistake →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

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

      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "verb", color: "yellow" },
            { text: "(+ -s / -es for he/she/it)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I / You / We / They work every day." />
            <Ex en="He / She / It works every day." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "don't / doesn't", color: "red" },
            { text: "verb (base form)", color: "yellow" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I / You / We / They don't work." />
            <Ex en="He / She / It doesn't work." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Do / Does", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb (base form)", color: "yellow" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Do you / we / they work here?" />
            <Ex en="Does he / she / it work here?" />
          </div>
        </div>
      </div>

      {/* Conjugation table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Conjugation table</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
                <th className="px-4 py-2.5 font-black text-sky-700">?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "work", "don't work", "Do I work?"],
                ["You", "work", "don't work", "Do you work?"],
                ["He / She / It", "works ★", "doesn't work", "Does he work?"],
                ["We", "work", "don't work", "Do we work?"],
                ["They", "work", "don't work", "Do they work?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> After <b>doesn&apos;t</b> and <b>does</b> the verb <b>always stays in the base form</b> — no -s!<br />
          <span className="text-xs">She <b>doesn&apos;t work</b> ✅ &nbsp; She doesn&apos;t works ❌ &nbsp;|&nbsp; Does he <b>work</b>? ✅ &nbsp; Does he works? ❌</span>
        </div>
      </div>

      {/* Spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">He / She / It — spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -s", ex: "work → works · play → plays · like → likes · drink → drinks" },
            { rule: "Ends in -ch, -sh, -ss, -x, -o → add -es", ex: "watch → watches · go → goes · do → does · fix → fixes" },
            { rule: "Consonant + y → change y → i, add -es", ex: "study → studies · carry → carries · try → tries" },
            { rule: "Vowel + y → just add -s", ex: "play → plays · say → says · enjoy → enjoys" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{rule}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Irregular verbs */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">Two irregular verbs to memorise</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-black/8 bg-white p-3">
            <div className="font-bold text-slate-900 mb-1 text-sm">have</div>
            <div className="text-slate-600 text-xs space-y-0.5">
              <div>I / you / we / they <b>have</b></div>
              <div>he / she / it <b className="text-amber-700">has</b> ← irregular!</div>
            </div>
          </div>
          <div className="rounded-xl border border-black/8 bg-white p-3">
            <div className="font-bold text-slate-900 mb-1 text-sm">be</div>
            <div className="text-slate-600 text-xs space-y-0.5">
              <div>I <b>am</b> · you/we/they <b>are</b></div>
              <div>he / she / it <b className="text-amber-700">is</b></div>
            </div>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">📌 Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["always", "usually", "often", "sometimes", "rarely", "never", "every day", "every week", "on Mondays", "in the morning", "at night", "twice a week"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
