"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "She goes to school every day.  — word order check:",     options: ["She goes to school every day","She every day goes to school","Goes she to school every day","To school she goes every day"], answer: 0 },
  { q: "He drinks coffee every morning. — correct sentence?",    options: ["He every morning coffee drinks","Coffee he drinks every morning","He drinks coffee every morning","Drinks he coffee every morning"], answer: 2 },
  { q: "She doesn't watch TV in the morning. — correct?",       options: ["She watch doesn't TV in the morning","She doesn't TV watch in the morning","She doesn't watch TV in the morning","Doesn't she watch TV in the morning"], answer: 2 },
  { q: "Do you like chocolate? — correct question form?",        options: ["You do like chocolate?","Like you chocolate?","You like chocolate?","Do you like chocolate?"], answer: 3 },
  { q: "Does she work here? — correct question form?",           options: ["She does work here?","Work she here?","Does she work here?","Does she works here?"], answer: 2 },
  { q: "I don't eat meat. — correct sentence?",                  options: ["I meat don't eat","I eat don't meat","Don't I eat meat","I don't eat meat"], answer: 3 },
  { q: "They don't live near here. — correct?",                  options: ["They near don't live here","They don't live near here","Don't they live near here","They live don't near here"], answer: 1 },
  { q: "Water boils at 100 degrees. — correct?",                 options: ["At 100 degrees water boils","Water 100 degrees boils at","Water boils at 100 degrees","Boils water at 100 degrees"], answer: 2 },
  { q: "Do your parents live in the city? — correct?",           options: ["Your parents do live in the city?","Do your parents live in the city?","Does your parents live in the city?","Live your parents in the city?"], answer: 1 },
  { q: "The sun rises in the east. — correct?",                  options: ["In the east rises the sun","The sun in the east rises","Rises the sun in the east","The sun rises in the east"], answer: 3 },
  { q: "He doesn't like spicy food. — correct?",                 options: ["He like doesn't spicy food","He doesn't like spicy food","Doesn't he like spicy food","He doesn't likes spicy food"], answer: 1 },
  { q: "Does it rain a lot in autumn? — correct?",               options: ["It does rain a lot in autumn?","Rain does it a lot in autumn?","Does it rain a lot in autumn?","Does it rains a lot in autumn?"], answer: 2 },
  { q: "We don't have a car. — correct?",                        options: ["We a car don't have","Don't we have a car","We don't have a car","We doesn't have a car"], answer: 2 },
  { q: "My sister lives in London. — correct?",                  options: ["My sister in London lives","Lives my sister in London","My sister live in London","My sister lives in London"], answer: 3 },
  { q: "Does he drink coffee in the morning? — correct?",        options: ["Does he drinks coffee in the morning?","He does drink coffee in the morning?","Does he drink coffee in the morning?","Do he drink coffee in the morning?"], answer: 2 },
  { q: "I don't need to shout. — correct?",                      options: ["Don't I need to shout","I need don't to shout","I doesn't need to shout","I don't need to shout"], answer: 3 },
  { q: "Do we have a test today? — correct?",                    options: ["We do have a test today?","Have we a test today?","Do we have a test today?","Does we have a test today?"], answer: 2 },
  { q: "She doesn't know the answer. — correct?",                options: ["She know doesn't the answer","She don't know the answer","Doesn't she knows the answer","She doesn't know the answer"], answer: 3 },
  { q: "Do you study English every day? — correct?",             options: ["You do study English every day?","Do you study English every day?","Does you study English every day?","Study you English every day?"], answer: 1 },
  { q: "He listens to music every evening. — correct?",          options: ["He every evening listens to music","He listen to music every evening","He listens to music every evening","Listens he to music every evening"], answer: 2 },
];

/* ─── Types ─────────────────────────────────────────────────────────────── */

type SentenceQ = {
  id: string;
  words: string[];
  correct: string;
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3;
  title: string;
  instructions: string;
  questions: SentenceQ[];
};

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Affirmative & Negative",
    instructions: "Tap the English tiles in the correct order to build the sentence.",
    questions: [
      { id: "1-1",  words: ["every", "She", ".", "school", "goes", "to", "day"],          correct: "She goes to school every day .",       explanation: "She → goes (add -s). Affirmative: subject + verb(+s) + rest." },
      { id: "1-2",  words: ["morning", "He", "coffee", ".", "every", "drinks"],            correct: "He drinks coffee every morning .",      explanation: "He → drinks (add -s)." },
      { id: "1-3",  words: ["London", "lives", ".", "My", "in", "sister"],                 correct: "My sister lives in London .",           explanation: "My sister (= she) → lives (add -s)." },
      { id: "1-4",  words: ["east", "in", "rises", ".", "the", "sun", "The"],              correct: "The sun rises in the east .",           explanation: "The sun (= it) → rises (add -s). Scientific fact." },
      { id: "1-5",  words: ["100", "at", "Water", ".", "degrees", "boils"],                correct: "Water boils at 100 degrees .",          explanation: "Water (= it) → boils (add -s). Scientific fact." },
      { id: "1-6",  words: ["eat", ".", "I", "meat", "don't"],                             correct: "I don't eat meat .",                   explanation: "I → don't + base form: eat." },
      { id: "1-7",  words: ["TV", "watch", "morning", "the", ".", "doesn't", "in", "She"], correct: "She doesn't watch TV in the morning .", explanation: "She → doesn't + base form: watch (NOT watches)." },
      { id: "1-8",  words: ["food", "He", "like", ".", "doesn't", "spicy"],                correct: "He doesn't like spicy food .",          explanation: "He → doesn't + base form: like." },
      { id: "1-9",  words: ["here", "don't", "near", ".", "They", "live"],                 correct: "They don't live near here .",           explanation: "They → don't + base form: live." },
      { id: "1-10", words: ["have", ".", "We", "car", "don't", "a"],                       correct: "We don't have a car .",                 explanation: "We → don't + base form: have." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Questions",
    instructions: "Build the English question using the tiles in the correct order.",
    questions: [
      { id: "2-1",  words: ["chocolate", "you", "Do", "?", "like"],                        correct: "Do you like chocolate ?",              explanation: "You → Do: Do you like…?" },
      { id: "2-2",  words: ["here", "Does", "?", "work", "she"],                           correct: "Does she work here ?",                 explanation: "She → Does: Does she work…? (NOT Does she works)" },
      { id: "2-3",  words: ["French", "they", "?", "Do", "speak"],                         correct: "Do they speak French ?",               explanation: "They → Do: Do they speak…?" },
      { id: "2-4",  words: ["the", "Does", "?", "play", "guitar", "he"],                   correct: "Does he play the guitar ?",            explanation: "He → Does: Does he play…?" },
      { id: "2-5",  words: ["in", "Do", "city", "your", "?", "the", "live", "parents"],    correct: "Do your parents live in the city ?",   explanation: "Your parents (= they) → Do." },
      { id: "2-6",  words: ["rain", "Does", "in", "a", "autumn", "lot", "?", "it"],        correct: "Does it rain a lot in autumn ?",        explanation: "It → Does: Does it rain…?" },
      { id: "2-7",  words: ["your", "Does", "?", "on", "weekends", "mother", "work"],      correct: "Does your mother work on weekends ?",  explanation: "Your mother (= she) → Does." },
      { id: "2-8",  words: ["a", "Do", "today", "?", "we", "test", "have"],                correct: "Do we have a test today ?",            explanation: "We → Do: Do we have…?" },
      { id: "2-9",  words: ["the", "Does", "?", "in", "coffee", "morning", "he", "drink"], correct: "Does he drink coffee in the morning ?", explanation: "He → Does: Does he drink…? (NOT Does he drinks)" },
      { id: "2-10", words: ["English", "Do", "?", "every", "study", "you", "day"],         correct: "Do you study English every day ?",     explanation: "You → Do: Do you study…?" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Mixed: all forms",
    instructions: "Build affirmative, negative, or question sentences using the tiles.",
    questions: [
      { id: "3-1",  words: ["the", "Monday", "She", "goes", "every", "gym", "to", "."],    correct: "She goes to the gym every Monday .",   explanation: "She → goes (affirmative, add -s)." },
      { id: "3-2",  words: ["cold", "I", "like", "weather", "don't", "."],                 correct: "I don't like cold weather .",           explanation: "I → don't + base form: like." },
      { id: "3-3",  words: ["Do", "a", "?", "they", "dog", "have"],                        correct: "Do they have a dog ?",                 explanation: "They → Do: Do they have…?" },
      { id: "3-4",  words: ["on", "He", "weekends", ".", "work", "doesn't"],               correct: "He doesn't work on weekends .",         explanation: "He → doesn't + base form: work (NOT works)." },
      { id: "3-5",  words: ["Does", "cooking", "?", "enjoy", "she"],                       correct: "Does she enjoy cooking ?",              explanation: "She → Does: Does she enjoy…?" },
      { id: "3-6",  words: ["on", "We", "Fridays", "school", "don't", ".", "to", "go"],    correct: "We don't go to school on Fridays .",   explanation: "We → don't + base form: go." },
      { id: "3-7",  words: ["PM", "9", "The", ".", "at", "closes", "shop"],                correct: "The shop closes at 9 PM .",             explanation: "The shop (= it) → closes (add -s)." },
      { id: "3-8",  words: ["every", "Does", "day", "?", "read", "he", "newspaper", "the"], correct: "Does he read the newspaper every day ?", explanation: "He → Does: Does he read…? (NOT Does he reads)" },
      { id: "3-9",  words: ["vegetables", "doesn't", "My", ".", "cat", "eat"],             correct: "My cat doesn't eat vegetables .",       explanation: "My cat (= it) → doesn't + base form: eat." },
      { id: "3-10", words: ["at", "English", "Do", "?", "home", "you", "speak"],           correct: "Do you speak English at home ?",        explanation: "You → Do: Do you speak…?" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3, string> = {
  1: "Aff + Neg",
  2: "Questions",
  3: "Mixed",
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function SentenceBuilderClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3>(1);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const current = SETS[exNo];
  const q = current.questions[qIdx];
  const ans = answers[q.id] ?? [];
  const isChecked = checked[q.id] ?? false;

  const usedSet = new Set(ans);
  const builtSentence = ans.map((i) => q.words[i]).join(" ");
  const isCorrect = normalize(builtSentence) === normalize(q.correct);

  function addWord(idx: number) {
    if (isChecked) return;
    setAnswers((p) => ({ ...p, [q.id]: [...(p[q.id] ?? []), idx] }));
  }

  function removeWord(pos: number) {
    if (isChecked) return;
    setAnswers((p) => ({ ...p, [q.id]: (p[q.id] ?? []).filter((_, i) => i !== pos) }));
  }

  function checkAnswer() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked((p) => ({ ...p, [q.id]: true }));
  }

  function resetQuestion() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAnswers((p) => ({ ...p, [q.id]: [] }));
    setChecked((p) => ({ ...p, [q.id]: false }));
  }

  function switchSet(n: 1 | 2 | 3) {
    setExNo(n);
    setQIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  const completedCount = current.questions.filter((sq) => {
    const sqAns = answers[sq.id] ?? [];
    return checked[sq.id] && normalize(sqAns.map((i) => sq.words[i]).join(" ")) === normalize(sq.correct);
  }).length;

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

      pageHeader(1, "Present Simple · Sentence Builder Worksheet");
      pdf.setFillColor(BK); pdf.roundedRect(W-mr-22, 5, 22, 6, 1.5, 1.5, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(Y);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("A1  LEVEL", W-mr-11, 8, { align:"center", baseline:"middle" } as any);
      let y = 19;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 22, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(24); pdf.setTextColor(BK);
      pdf.text("Sentence Builder", ml+5, y+11);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Put the words in the correct order to form sentences.", ml+5, y+18);
      y += 27;

      numCircle(ml, y, 1);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 1", ml+10, y+5);
      const e1w = pdf.getTextWidth("Exercise 1");
      pill(ml+10+e1w+3, y+0.5, "EASY", "#D1FAE5", "#065F46");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Affirmative & Negative — reorder the words.", ml+10+e1w+26, y+4.5);
      y += 11;
      const qH = 12;
      const ex1 = [
        "1. every / She / . / school / goes / to / day",
        "2. morning / He / coffee / . / every / drinks",
        "3. London / lives / . / My / in / sister",
        "4. east / in / rises / . / the / sun / The",
        "5. 100 / at / Water / . / degrees / boils",
        "6. eat / . / I / meat / don't",
        "7. TV / watch / morning / the / . / doesn't / in / She",
        "8. food / He / like / . / doesn't / spicy",
        "9. here / don't / near / . / They / live",
        "10. have / . / We / car / don't / a",
      ];
      ex1.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9.5); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setFont("helvetica","normal"); pdf.setFontSize(8); pdf.setTextColor(MG);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text("→ ______________________________", ml+2, y + i*qH + 5, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH, W-mr, y+(i+1)*qH);
      });

      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc", ml, H-7);
      pdf.text("1 / 3", W-mr, H-7, { align:"right" });

      // PAGE 2
      pdf.addPage();
      pageHeader(2, "Present Simple · Sentence Builder Worksheet");
      y = 20;
      numCircle(ml, y, 2);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 2", ml+10, y+5);
      const e2w = pdf.getTextWidth("Exercise 2");
      pill(ml+10+e2w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Questions — put in the right order.", ml+10+e2w+26, y+4.5);
      y += 11;
      const ex2 = [
        "1. chocolate / you / Do / ? / like",
        "2. here / Does / ? / work / she",
        "3. French / they / ? / Do / speak",
        "4. the / Does / ? / play / guitar / he",
        "5. in / Do / city / your / ? / the / live / parents",
        "6. rain / Does / in / a / autumn / lot / ? / it",
        "7. your / Does / ? / on / weekends / mother / work",
        "8. a / Do / today / ? / we / test / have",
        "9. the / Does / ? / in / coffee / morning / he / drink",
        "10. English / Do / ? / every / study / you / day",
      ];
      ex2.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9.5); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setFont("helvetica","normal"); pdf.setFontSize(8); pdf.setTextColor(MG);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text("→ ______________________________", ml+2, y + i*qH + 5, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH, W-mr, y+(i+1)*qH);
      });
      y += ex2.length * qH + 6;

      numCircle(ml, y, 3);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 3", ml+10, y+5);
      const e3w = pdf.getTextWidth("Exercise 3");
      pill(ml+10+e3w+3, y+0.5, "HARD", "#FEE2E2", "#991B1B");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Mixed — affirmative, negative, question.", ml+10+e3w+26, y+4.5);
      y += 11;
      const ex3 = [
        "1. Monday / She / every / gym / goes / the / to / .",
        "2. cold / I / like / weather / don't / .",
        "3. Do / a / ? / they / dog / have",
        "4. on / He / weekends / . / work / doesn't",
        "5. Does / cooking / ? / enjoy / she",
      ];
      ex3.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9.5); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setFont("helvetica","normal"); pdf.setFontSize(8); pdf.setTextColor(MG);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text("→ ______________________________", ml+2, y + i*qH + 5, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH, W-mr, y+(i+1)*qH);
      });

      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc", ml, H-7);
      pdf.text("2 / 3", W-mr, H-7, { align:"right" });

      // PAGE 3 — Answer Key
      pdf.addPage();
      pageHeader(3, "Present Simple · Sentence Builder — Answer Key");
      y = 20;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 20, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(24); pdf.setTextColor(BK);
      pdf.text("Answer Key", ml+5, y+10);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Check your sentences below", ml+5, y+17);
      y += 26;

      const answerSections = [
        { lbl:"Exercise 1", sub:"Affirmative & Negative", ans:["She goes to school every day .","He drinks coffee every morning .","My sister lives in London .","The sun rises in the east .","Water boils at 100 degrees .","I don't eat meat .","She doesn't watch TV in the morning .","He doesn't like spicy food .","They don't live near here .","We don't have a car ."] },
        { lbl:"Exercise 2", sub:"Questions", ans:["Do you like chocolate ?","Does she work here ?","Do they speak French ?","Does he play the guitar ?","Do your parents live in the city ?","Does it rain a lot in autumn ?","Does your mother work on weekends ?","Do we have a test today ?","Does he drink coffee in the morning ?","Do you study English every day ?"] },
        { lbl:"Exercise 3", sub:"Mixed", ans:["She goes to the gym every Monday .","I don't like cold weather .","Do they have a dog ?","He doesn't work on weekends .","Does she enjoy cooking ?"] },
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
        ans.forEach((a, ai) => {
          pdf.setFont("helvetica","bold"); pdf.setFontSize(8); pdf.setTextColor(MG);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(`${ai+1}.`, ml, y + ai*9 + 4, { baseline:"middle" } as any);
          pdf.setFillColor(Y); pdf.roundedRect(ml+7, y + ai*9, 155, 7, 1.2, 1.2, "F");
          pdf.setFont("helvetica","bold"); pdf.setFontSize(8.5); pdf.setTextColor(BK);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(a, ml+9, y + ai*9 + 3.5, { baseline:"middle" } as any);
        });
        y += ans.length * 9 + 6;
      });

      pdf.setDrawColor(LG); pdf.setLineWidth(0.3); pdf.line(ml, H-12, W-mr, H-12);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc — Free English Grammar", ml, H-7);
      pdf.text("Present Simple \u00B7 Sentence Builder \u00B7 A1 \u00B7 Free to print & share", W-mr, H-7, { align:"right" });

      pdf.save("EnglishNerd_PresentSimple_SentenceBuilder_A1.pdf");
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
          <span className="text-slate-700 font-medium">Sentence Builder</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Builder</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Tap the English tiles in the correct order to build a sentence. Three exercise sets — affirmative & negative, questions, and mixed.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className="">
              <div className=""><SpeedRound gameId="ps-sentence-builder" subject="Sentence Builder" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
            </div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition text-sm ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    {/* Mobile set switcher */}
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition text-sm ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question navigator */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {current.questions.map((sq, i) => {
                      const sqAns = answers[sq.id] ?? [];
                      const sqBuilt = sqAns.map((wi) => sq.words[wi]).join(" ");
                      const sqDone = checked[sq.id];
                      const sqCorrect = sqDone && normalize(sqBuilt) === normalize(sq.correct);
                      const sqWrong = sqDone && !sqCorrect;
                      return (
                        <button key={sq.id} onClick={() => setQIdx(i)}
                          className={`h-8 w-8 rounded-lg border text-xs font-black transition ${
                            i === qIdx ? "border-[#F5DA20] bg-[#F5DA20] text-black"
                            : sqCorrect ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                            : sqWrong ? "border-red-300 bg-red-100 text-red-600"
                            : "border-black/10 bg-white text-slate-600 hover:bg-black/5"
                          }`}>
                          {i + 1}
                        </button>
                      );
                    })}
                    <div className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                      <span className="font-black text-emerald-600">{completedCount}</span>
                      <span>/ {current.questions.length}</span>
                    </div>
                  </div>

                  {/* Question card */}
                  <div className={`rounded-2xl border p-5 md:p-6 transition ${
                    isChecked && isCorrect ? "border-emerald-300 bg-emerald-50/30"
                    : isChecked && !isCorrect ? "border-red-200 bg-red-50/20"
                    : "border-black/10 bg-white"
                  }`}>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        {qIdx + 1} / {current.questions.length}
                      </span>
                      {isChecked && (
                        <span className={`text-sm font-black ${isCorrect ? "text-emerald-600" : "text-red-500"}`}>
                          {isCorrect ? "✅ Correct!" : "❌ Not quite"}
                        </span>
                      )}
                    </div>

                    {/* Answer zone */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Your sentence</div>
                      <div className={`min-h-[52px] flex flex-wrap gap-2 items-center rounded-xl border-2 border-dashed p-3 transition ${
                        isChecked && isCorrect ? "border-emerald-400 bg-emerald-50"
                        : isChecked && !isCorrect ? "border-red-300 bg-red-50"
                        : ans.length > 0 ? "border-[#F5DA20]/60 bg-[#FFFBDC]"
                        : "border-black/15 bg-black/[0.02]"
                      }`}>
                        {ans.length === 0 ? (
                          <span className="text-slate-300 text-sm select-none">Tap words below to build the sentence…</span>
                        ) : (
                          ans.map((wordIdx, pos) => (
                            <button key={pos} onClick={() => removeWord(pos)} disabled={isChecked}
                              className={`rounded-lg px-3 py-1.5 text-sm font-bold border transition select-none ${
                                isChecked
                                  ? isCorrect ? "border-emerald-300 bg-emerald-100 text-emerald-800 cursor-default"
                                    : "border-red-300 bg-red-100 text-red-700 cursor-default"
                                  : "border-[#F5DA20] bg-[#F5DA20] text-black hover:bg-amber-300 cursor-pointer"
                              }`}>
                              {q.words[wordIdx]}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Word bank */}
                    <div className="mb-5">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Word bank</div>
                      <div className="flex flex-wrap gap-2">
                        {q.words.map((word, idx) => {
                          const isUsed = usedSet.has(idx);
                          return (
                            <button key={idx} onClick={() => !isChecked && !isUsed && addWord(idx)}
                              disabled={isChecked || isUsed}
                              className={`rounded-lg px-3 py-1.5 text-sm font-bold border transition select-none ${
                                isUsed || isChecked
                                  ? "border-black/8 bg-black/[0.03] text-slate-300 cursor-default"
                                  : "border-black/15 bg-white text-slate-800 hover:border-[#F5DA20] hover:bg-[#FFF9C2] cursor-pointer active:scale-95"
                              }`}>
                              {word}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Feedback */}
                    {isChecked && (
                      <div className={`rounded-xl px-4 py-3 mb-4 text-sm ${isCorrect ? "bg-emerald-100 text-emerald-900" : "bg-amber-50 text-amber-900 border border-amber-200"}`}>
                        {isCorrect ? (
                          <span className="font-bold">👍 {q.explanation}</span>
                        ) : (
                          <>
                            <div className="font-bold mb-1">Correct sentence:</div>
                            <div className="font-mono font-black text-base">{q.correct.replace(/ \./g, ".").replace(/ \?/g, "?")}</div>
                            <div className="mt-1 text-xs text-amber-700">{q.explanation}</div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {!isChecked ? (
                        <>
                          <button onClick={checkAnswer} disabled={ans.length === 0}
                            className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                            Check
                          </button>
                          <button onClick={resetQuestion} disabled={ans.length === 0}
                            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-black/5 transition disabled:opacity-30">
                            Clear
                          </button>
                        </>
                      ) : (
                        <>
                          {!isCorrect && (
                            <button onClick={resetQuestion} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                              Try Again
                            </button>
                          )}
                          {qIdx < current.questions.length - 1 && (
                            <button onClick={() => setQIdx((p) => p + 1)} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                              Next →
                            </button>
                          )}
                          {qIdx === current.questions.length - 1 && exNo < 3 && (
                            <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3)} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                              Next Set →
                            </button>
                          )}
                        </>
                      )}
                    </div>
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
                { title: "Quiz — Multiple Choice", href: "/tenses/present-simple/quiz", img: "/topics/exercises/quiz.jpg", level: "A1", badge: "bg-emerald-500", reason: "Test your knowledge" },
                { title: "Fill in the Blank", href: "/tenses/present-simple/fill-in-blank", img: "/topics/exercises/fill-in-blank.jpg", level: "A1", badge: "bg-emerald-500", reason: "Write correct verb forms" },
                { title: "Spot the Mistake", href: "/tenses/present-simple/spot-the-mistake", img: "/topics/exercises/spot-the-mistake.jpg", level: "A1–A2", badge: "bg-amber-500", reason: "Find & correct errors" },
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
            <SpeedRound gameId="ps-sentence-builder" subject="Sentence Builder" questions={SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-simple/spot-the-mistake" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Spot the Mistake</a>
          <a href="/tenses/present-simple" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Present Simple →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation ─────────────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
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

function Explanation() {
  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">How to Build Sentences</h2>
        <p className="text-slate-500 text-sm">Three patterns — learn the formula, then practise.</p>
      </div>

      {/* 3 sentence types */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Affirmative */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Affirmative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "verb(+s)", color: "yellow" }, { dim: true, text: "+" },
            { text: "rest", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I work here." />
            <Ex en="She works here." />
            <Ex en="They play football." />
          </div>
        </div>

        {/* Negative */}
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Negative</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "don't / doesn't", color: "red" }, { dim: true, text: "+" },
            { text: "verb", color: "yellow" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I don't work." />
            <Ex en="She doesn't work." />
            <Ex en="They don't play." />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[
            { text: "Do / Does", color: "violet" }, { dim: true, text: "+" },
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "verb", color: "yellow" }, { dim: true, text: "+" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Do you work?" />
            <Ex en="Does she work?" />
            <Ex en="Do they play?" />
          </div>
        </div>
      </div>

      {/* He/She/It rule */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">He / She / It — the golden rule</h3>
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
                ["I",          "I work",           "I don't work",          "Do I work?"],
                ["You",        "You work",          "You don't work",        "Do you work?"],
                ["He / She",   "She works ← (+s!)", "She doesn't work",      "Does she work?"],
                ["It",         "It works ← (+s!)",  "It doesn't work",       "Does it work?"],
                ["We / They",  "They work",         "They don't work",       "Do they work?"],
              ].map(([subj, aff, neg, q]) => (
                <tr key={subj}>
                  <td className="py-2 pr-4 font-black text-slate-700">{subj}</td>
                  <td className={`py-2 pr-4 font-mono text-sm ${subj.startsWith("He") || subj === "It" ? "text-emerald-700 font-black" : "text-slate-600"}`}>{aff}</td>
                  <td className={`py-2 pr-4 font-mono text-sm ${subj.startsWith("He") || subj === "It" ? "text-red-600 font-black" : "text-slate-600"}`}>{neg}</td>
                  <td className={`py-2 font-mono text-sm ${subj.startsWith("He") || subj === "It" ? "text-sky-700 font-black" : "text-slate-600"}`}>{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ Key point:</b> after <b>doesn't</b> and <b>does</b> the verb is ALWAYS in base form — no -s!<br />
          <span className="font-mono">She doesn't work</span> ✅ &nbsp;|&nbsp; <span className="font-mono line-through opacity-60">She doesn't works</span> ❌
        </div>
      </div>

      {/* Verb list */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <h3 className="font-black text-slate-900 mb-4">Common verbs in Present Simple</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {[
            "work", "live", "go", "eat", "drink", "speak",
            "study", "like", "have", "play", "read", "watch",
            "know", "think", "need", "come", "take", "help",
            "enjoy", "close", "rise", "use",
          ].map((verb) => (
            <div key={verb} className="flex items-center rounded-xl bg-black/[0.025] px-3 py-2">
              <span className="font-black text-slate-900 text-sm">{verb}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Adverb position */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">📌</span>
          <h3 className="font-black text-slate-900">Word order with frequency adverbs</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">Always, usually, often, sometimes, never — go <b>before the main verb</b> but <b>after to be</b>.</p>
        <div className="space-y-2">
          {[
            ["She always arrives on time.", true],
            ["I never eat fast food.", true],
            ["He is always happy.", true],
            ["Always she arrives late.", false],
          ].map(([en, ok]) => (
            <div key={en as string} className={`flex items-start gap-2 rounded-xl px-3 py-2.5 ${ok ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
              <span className="text-sm shrink-0">{ok ? "✅" : "❌"}</span>
              <div className={`font-semibold text-sm ${ok ? "text-emerald-800" : "text-red-700 line-through"}`}>{en as string}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
