"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "He are a doctor.  — the mistake is:",           options: ["He","are","a","doctor"],            answer: 1 },
  { q: "I are from Ukraine.  — the mistake is:",        options: ["I","are","from","Ukraine"],         answer: 1 },
  { q: "They is busy right now.  — the mistake is:",    options: ["They","is","busy","right"],         answer: 1 },
  { q: "She have a great idea.  — the mistake is:",     options: ["She","have","a","great"],           answer: 1 },
  { q: "He have a brother in Canada.  — the mistake is:", options: ["He","have","brother","Canada"],  answer: 1 },
  { q: "She do her homework after dinner.  — the mistake is:", options: ["She","do","homework","dinner"], answer: 1 },
  { q: "The sun rise in the east every day.  — the mistake is:", options: ["sun","rise","east","every"], answer: 1 },
  { q: "Water boil at 100 degrees.  — the mistake is:", options: ["Water","boil","at","degrees"],      answer: 1 },
  { q: "She cans speak three languages.  — the mistake is:", options: ["She","cans","speak","languages"], answer: 1 },
  { q: "He musts leave by six o'clock.  — the mistake is:", options: ["He","musts","leave","six"],     answer: 1 },
  { q: "She doesn't works on Sundays.  — the mistake is:", options: ["She","doesn't","works","Sundays"], answer: 2 },
  { q: "I doesn't eat breakfast.  — the mistake is:",   options: ["I","doesn't","eat","breakfast"],    answer: 1 },
  { q: "They doesn't live near here.  — the mistake is:", options: ["They","doesn't","live","near"],  answer: 1 },
  { q: "Does she works here?  — the mistake is:",       options: ["Does","she","works","here"],        answer: 2 },
  { q: "Do he play football?  — the mistake is:",       options: ["Do","he","play","football"],        answer: 0 },
  { q: "He go to the gym every day.  — the mistake is:", options: ["He","go","to","gym"],              answer: 1 },
  { q: "She don't like horror films.  — the mistake is:", options: ["She","don't","like","films"],     answer: 1 },
  { q: "We goes to school by bus.  — the mistake is:",  options: ["We","goes","to","school"],          answer: 1 },
  { q: "Does your parents work in the city?  — the mistake is:", options: ["Does","your","parents","work"], answer: 0 },
  { q: "He don't eat vegetables.  — the mistake is:",   options: ["He","don't","eat","vegetables"],    answer: 1 },
];

/* ─── Types ─────────────────────────────────────────────────────────────── */

type ClickQ = {
  mode: "click";
  id: string;
  sentence: string;
  wrongWord: string;
  correction: string[];  // first = shown in feedback; all = accepted
  explanation: string;
};

type RewriteQ = {
  mode: "rewrite";
  id: string;
  sentence: string;
  correct: string[];   // first = displayed answer; all = accepted
  wrongWord: string;
  explanation: string;
};

type Q = ClickQ | RewriteQ;

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: Q[];
};

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — to be, have/has, -s/-es, modals",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "1-1",  sentence: "He are a doctor.",                       wrongWord: "are",     correction: ["is"],      explanation: "He → is (not are). To be: I am, you are, he/she/it is." },
      { mode: "click", id: "1-2",  sentence: "I are from Ukraine.",                    wrongWord: "are",     correction: ["am"],      explanation: "I → am (not are). To be: I am, you are, he/she/it is." },
      { mode: "click", id: "1-3",  sentence: "They is busy right now.",                wrongWord: "is",      correction: ["are"],     explanation: "They → are (not is). To be: I am, you are, he/she/it is, we/they are." },
      { mode: "click", id: "1-4",  sentence: "She have a great idea.",                 wrongWord: "have",    correction: ["has"],     explanation: "She (= he/she/it) → has: She has a great idea." },
      { mode: "click", id: "1-5",  sentence: "He have a brother in Canada.",           wrongWord: "have",    correction: ["has"],     explanation: "He (= he/she/it) → has: He has a brother in Canada." },
      { mode: "click", id: "1-6",  sentence: "She do her homework after dinner.",      wrongWord: "do",      correction: ["does"],    explanation: "She (= he/she/it) → does as a main verb: She does her homework." },
      { mode: "click", id: "1-7",  sentence: "The sun rise in the east every day.",    wrongWord: "rise",    correction: ["rises"],   explanation: "The sun (= it) → add -s: rises. A scientific fact still follows 3rd-person rules." },
      { mode: "click", id: "1-8",  sentence: "Water boil at 100 degrees Celsius.",     wrongWord: "boil",    correction: ["boils"],   explanation: "Water (= it) → boils. Scientific / general truths use Present Simple." },
      { mode: "click", id: "1-9",  sentence: "She cans speak three languages.",        wrongWord: "cans",    correction: ["can"],     explanation: "Modal verbs never take -s: can (NOT cans). Same for must, should, will." },
      { mode: "click", id: "1-10", sentence: "He musts leave by six o'clock.",         wrongWord: "musts",   correction: ["must"],    explanation: "Modal verbs never take -s: must (NOT musts)." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — negatives: to be, don't/doesn't, modals",
    instructions: "Click the wrong word, type the correct form, then press Enter.",
    questions: [
      { mode: "click", id: "2-1",  sentence: "She aren't at home today.",                      wrongWord: "aren't",  correction: ["isn't", "is not"],    explanation: "She (= he/she/it) → isn't / is not (not aren't). To be negative: he/she/it isn't." },
      { mode: "click", id: "2-2",  sentence: "They isn't ready to leave.",                     wrongWord: "isn't",   correction: ["aren't", "are not"],   explanation: "They → aren't / are not (not isn't). To be negative: we/they aren't." },
      { mode: "click", id: "2-3",  sentence: "She don't like jazz music.",                     wrongWord: "don't",   correction: ["doesn't", "does not"], explanation: "She (= he/she/it) → doesn't / does not." },
      { mode: "click", id: "2-4",  sentence: "I doesn't eat breakfast.",                       wrongWord: "doesn't", correction: ["don't", "do not"],     explanation: "I → don't / do not. 'Doesn't' is only for he/she/it." },
      { mode: "click", id: "2-5",  sentence: "We doesn't play tennis on weekdays.",            wrongWord: "doesn't", correction: ["don't", "do not"],     explanation: "We → don't / do not." },
      { mode: "click", id: "2-6",  sentence: "She doesn't speaks French very well.",           wrongWord: "speaks",  correction: ["speak"],               explanation: "After 'doesn't' the verb stays in base form: speak (NOT speaks)." },
      { mode: "click", id: "2-7",  sentence: "He doesn't eats lunch at school.",               wrongWord: "eats",    correction: ["eat"],                 explanation: "After 'doesn't' the verb stays in base form: eat (NOT eats)." },
      { mode: "click", id: "2-8",  sentence: "They shouldn't leaves before dinner.",           wrongWord: "leaves",  correction: ["leave"],               explanation: "After a modal (should/can/must) the verb stays in base form: leave (NOT leaves)." },
      { mode: "click", id: "2-9",  sentence: "She can swims very fast.",                       wrongWord: "swims",   correction: ["swim"],                explanation: "After 'can' the verb stays in base form: swim (NOT swims)." },
      { mode: "click", id: "2-10", sentence: "He must works late on Fridays.",                 wrongWord: "works",   correction: ["work"],                explanation: "After 'must' the verb stays in base form: work (NOT works)." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — word order, questions with to be & modals",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "3-1",  sentence: "Always she arrives late.",               correct: ["She always arrives late."],             wrongWord: "Always",  explanation: "Frequency adverbs (always, never, often…) go BEFORE the main verb: She always arrives." },
      { mode: "rewrite", id: "3-2",  sentence: "She goes never to the gym.",             correct: ["She never goes to the gym."],           wrongWord: "never",   explanation: "Frequency adverbs go BEFORE the main verb: She never goes." },
      { mode: "rewrite", id: "3-3",  sentence: "Often I drink coffee in the morning.",   correct: ["I often drink coffee in the morning."], wrongWord: "Often",   explanation: "Frequency adverbs go BEFORE the main verb and AFTER the subject: I often drink." },
      { mode: "rewrite", id: "3-4",  sentence: "She always is late for work.",           correct: ["She is always late for work.", "She's always late for work."],         wrongWord: "always",  explanation: "With 'to be', frequency adverbs go AFTER the verb: She is always late." },
      { mode: "rewrite", id: "3-5",  sentence: "Do he is a teacher?",                   correct: ["Is he a teacher?"],                     wrongWord: "Do",      explanation: "With 'to be', you don't need Do/Does. Invert subject and verb: Is he…?" },
      { mode: "rewrite", id: "3-6",  sentence: "Does she is happy?",                    correct: ["Is she happy?"],                        wrongWord: "Does",    explanation: "With 'to be', invert the subject and 'is': Is she happy? — no Does needed." },
      { mode: "rewrite", id: "3-7",  sentence: "Do they are students?",                 correct: ["Are they students?"],                   wrongWord: "Do",      explanation: "With 'to be', invert subject and verb: Are they…? — no Do needed." },
      { mode: "rewrite", id: "3-8",  sentence: "Can she to drive a car?",               correct: ["Can she drive a car?"],                 wrongWord: "to",      explanation: "After modal verbs (can, must, should…) the infinitive has NO 'to': Can she drive?" },
      { mode: "rewrite", id: "3-9",  sentence: "He must to work on weekends.",          correct: ["He must work on weekends."],            wrongWord: "to",      explanation: "After 'must' the verb has NO 'to': He must work (NOT must to work)." },
      { mode: "rewrite", id: "3-10", sentence: "Does he can speak French?",             correct: ["Can he speak French?"],                 wrongWord: "Does",    explanation: "Modal verbs form questions by inverting with the subject — no Does needed: Can he…?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — mixed: to be, double negatives, stative verbs",
    instructions: "Read the incorrect sentence. Type the corrected version and press Enter.",
    questions: [
      { mode: "rewrite", id: "4-1",  sentence: "She doesn't be at home on Sundays.",         correct: ["She isn't at home on Sundays.", "She is not at home on Sundays."],                                        wrongWord: "doesn't",  explanation: "The verb 'be' makes its own negative: isn't / is not — not with doesn't." },
      { mode: "rewrite", id: "4-2",  sentence: "They are not like classical music.",          correct: ["They don't like classical music.", "They do not like classical music."],                                       wrongWord: "are",      explanation: "Negatives with action verbs use don't / doesn't — not are/is: They don't like." },
      { mode: "rewrite", id: "4-3",  sentence: "I am agree with you.",                        correct: ["I agree with you."],                                                                                             wrongWord: "am",       explanation: "'Agree' is an action verb — it doesn't go with 'am/is/are': I agree (NOT I am agree)." },
      { mode: "rewrite", id: "4-4",  sentence: "She can't to ride a bicycle.",                correct: ["She can't ride a bicycle.", "She cannot ride a bicycle.", "She can not ride a bicycle."],                        wrongWord: "to",       explanation: "After modals the infinitive has NO 'to': can't ride / cannot ride." },
      { mode: "rewrite", id: "4-5",  sentence: "I am not never rude to people.",              correct: ["I am never rude to people.", "I'm never rude to people."],                                                       wrongWord: "not",      explanation: "Double negative: 'not never' is incorrect. Use 'never' alone: I am never rude." },
      { mode: "rewrite", id: "4-6",  sentence: "Does she able to drive a car?",               correct: ["Is she able to drive a car?"],                                                                                    wrongWord: "Does",     explanation: "'Able to' uses 'to be', not do/does. Is she able to…?" },
      { mode: "rewrite", id: "4-7",  sentence: "She not works on Sundays.",                   correct: ["She doesn't work on Sundays.", "She does not work on Sundays."],                                                  wrongWord: "not",      explanation: "To make a negative with action verbs you need doesn't + base form: doesn't work." },
      { mode: "rewrite", id: "4-8",  sentence: "He is know the answer.",                      correct: ["He knows the answer."],                                                                                           wrongWord: "is",       explanation: "'Know' is an action verb — it doesn't combine with 'is': He knows (NOT is know)." },
      { mode: "rewrite", id: "4-9",  sentence: "Always he is angry in the morning.",          correct: ["He is always angry in the morning."],                                                                             wrongWord: "Always",   explanation: "With 'to be', frequency adverbs go AFTER the verb: He is always angry." },
      { mode: "rewrite", id: "4-10", sentence: "Do she is a nurse?",                          correct: ["Is she a nurse?"],                                                                                                wrongWord: "Do",       explanation: "With 'to be', just invert subject and verb: Is she…? — no Do/Does needed." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "to be & modals",
  2: "Negatives",
  3: "Word order",
  4: "Mixed",
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

type Token = { text: string; isPunct: boolean };

function tokenize(sentence: string): Token[] {
  const parts: Token[] = [];
  for (const word of sentence.split(/\s+/).filter(Boolean)) {
    const m = word.match(/^(.+?)([.!?,])$/);
    if (m && m[1].length > 0) {
      parts.push({ text: m[1], isPunct: false });
      parts.push({ text: m[2], isPunct: true });
    } else if (/^[.!?,]$/.test(word)) {
      parts.push({ text: word, isPunct: true });
    } else {
      parts.push({ text: word, isPunct: false });
    }
  }
  return parts;
}

function normWord(s: string) {
  return s.trim().toLowerCase().replace(/[''`]/g, "'");
}

function normSentence(s: string) {
  return s.trim().toLowerCase().replace(/[''`]/g, "'").replace(/\s+/g, " ").replace(/[.!?,]+$/, "").trim();
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function SpotTheMistakeClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);

  // Per-question checked state
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // click-word state
  const [clickedIdx, setClickedIdx] = useState<Record<string, number>>({});
  const [typedFix, setTypedFix] = useState<Record<string, string>>({});

  // rewrite state
  const [typed, setTyped] = useState<Record<string, string>>({});

  const current = SETS[exNo];
  const allChecked = current.questions.every((q) => checked[q.id]);

  function checkOne(qId: string) {
    setChecked((p) => ({ ...p, [qId]: true }));
  }

  function checkAll() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const all: Record<string, boolean> = {};
    for (const q of current.questions) all[q.id] = true;
    setChecked((p) => ({ ...p, ...all }));
  }

  function reset() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked({});
    setClickedIdx({});
    setTypedFix({});
    setTyped({});
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const { save } = useProgress();

  useEffect(() => {
    if (checked && score) {
      save(exNo, score.percent, score.total);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const score = useMemo(() => {
    if (!allChecked) return null;
    let correct = 0;
    for (const q of current.questions) {
      if (q.mode === "click") {
        const tokens = tokenize(q.sentence);
        const idx = clickedIdx[q.id];
        const clickedToken = idx !== undefined ? tokens[idx] : null;
        const rightWord = clickedToken != null && normWord(clickedToken.text) === normWord(q.wrongWord);
        const rightFix = q.correction.some(c => normWord(typedFix[q.id] ?? "") === normWord(c));
        if (rightWord && rightFix) correct++;
      } else {
        if (q.correct.some((c) => normSentence(typed[q.id] ?? "") === normSentence(c))) correct++;
      }
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [allChecked, current, clickedIdx, typedFix, typed]);

  const checkedCount = current.questions.filter((q) => checked[q.id]).length;

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

      pageHeader(1, "Present Simple · Spot the Mistake Worksheet");
      pdf.setFillColor(BK); pdf.roundedRect(W-mr-28, 5, 28, 6, 1.5, 1.5, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(Y);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("A1–A2 LEVEL", W-mr-14, 8, { align:"center", baseline:"middle" } as any);
      let y = 19;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 22, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(26); pdf.setTextColor(BK);
      pdf.text("Spot the Mistake", ml+5, y+11);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Find the grammar error in each sentence and write the correction.", ml+5, y+18);
      y += 27;

      numCircle(ml, y, 1);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 1", ml+10, y+5);
      const e1w = pdf.getTextWidth("Exercise 1");
      pill(ml+10+e1w+3, y+0.5, "EASY", "#D1FAE5", "#065F46");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Underline the error and write the correction.", ml+10+e1w+26, y+4.5);
      y += 11;
      const qH = 11;
      const ex1 = [
        "1. He are a doctor.                                       → ___________",
        "2. I are from Ukraine.                                    → ___________",
        "3. They is busy right now.                                → ___________",
        "4. She have a great idea.                                 → ___________",
        "5. He have a brother in Canada.                           → ___________",
        "6. She do her homework after dinner.                      → ___________",
        "7. The sun rise in the east every day.                    → ___________",
        "8. Water boil at 100 degrees Celsius.                     → ___________",
        "9. She cans speak three languages.                        → ___________",
        "10. He musts leave by six o'clock.                        → ___________",
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
      pdf.text("Negatives — find & correct the error.", ml+10+e2w+26, y+4.5);
      y += 11;
      const ex2 = [
        "1. She doesn't works on Sundays.                          → ___________",
        "2. I doesn't eat breakfast.                               → ___________",
        "3. They doesn't live near here.                           → ___________",
        "4. He don't like coffee.                                  → ___________",
        "5. We doesn't have a car.                                 → ___________",
        "6. She don't speak French.                                → ___________",
        "7. It don't rain much in summer.                          → ___________",
        "8. My dog doesn't eats vegetables.                        → ___________",
        "9. You doesn't need to worry.                             → ___________",
        "10. My parents doesn't speak English.                     → ___________",
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
      pageHeader(2, "Present Simple · Spot the Mistake Worksheet");
      y = 20;
      numCircle(ml, y, 3);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 3", ml+10, y+5);
      const e3w = pdf.getTextWidth("Exercise 3");
      pill(ml+10+e3w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Questions — correct the error.", ml+10+e3w+26, y+4.5);
      y += 11;
      const ex3 = [
        "1. Does she works here?                                   → ___________",
        "2. Do he play football?                                   → ___________",
        "3. Does they live in London?                              → ___________",
        "4. Does your parents work in the city?                    → ___________",
        "5. Do she like jazz?                                      → ___________",
        "6. Does he drinks coffee?                                 → ___________",
        "7. Do it rain a lot here?                                 → ___________",
        "8. Does we need to bring anything?                        → ___________",
        "9. Do the train leave at 8?                               → ___________",
        "10. Does they speak French?                               → ___________",
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
      pdf.text("Mixed — rewrite the sentence correctly.", ml+10+e4w+26, y+4.5);
      y += 11;
      const ex4 = [
        "1. He go to the gym every day.",
        "2. She don't like horror films.",
        "3. We goes to school by bus.",
        "4. He don't eat vegetables.",
        "5. Does she works late?",
        "6. Do he speak Italian?",
        "7. She cans drive a car.",
        "8. My sister have a dog.",
        "9. They doesn't live near here.",
        "10. Does your sister like jazz?  (→ rewrite as negative)",
      ];
      ex4.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor(MG);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text("→ _________________________________", ml+2, y + i*qH + 5.5, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH+3, W-mr, y+(i+1)*qH+3);
      });

      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc", ml, H-7);
      pdf.text("2 / 3", W-mr, H-7, { align:"right" });

      // PAGE 3 — Answer Key
      pdf.addPage();
      pageHeader(3, "Present Simple · Spot the Mistake — Answer Key");
      y = 20;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 20, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(24); pdf.setTextColor(BK);
      pdf.text("Answer Key", ml+5, y+10);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Check your corrections below", ml+5, y+17);
      y += 26;

      const answerSections = [
        { lbl:"Exercise 1", sub:"to be, have/has, -s/-es, modals", ans:["is","am","are","has","has","does","rises","boils","can","must"] },
        { lbl:"Exercise 2", sub:"Negatives — don't / doesn't", ans:["doesn't work","don't eat","don't live","doesn't like","don't have","doesn't speak","doesn't rain","doesn't eat","don't need","don't speak"] },
        { lbl:"Exercise 3", sub:"Questions — Do / Does", ans:["Does she work","Does he play","Do they live","Do your parents","Does she like","Does he drink","Does it rain","Do we need","Does the train","Do they speak"] },
        { lbl:"Exercise 4", sub:"Mixed rewrite", ans:["goes","doesn't like","go","doesn't eat","Does she work","Does he speak","can","has","don't live","Your sister doesn't like jazz."] },
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
          pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(BK);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(a, cx+6+chipW/2, cy+chipH/2, { align:"center", baseline:"middle" } as any);
        });
        y += 2*14 + 8;
      });

      pdf.setDrawColor(LG); pdf.setLineWidth(0.3); pdf.line(ml, H-12, W-mr, H-12);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(MG);
      pdf.text("englishnerd.cc — Free English Grammar", ml, H-7);
      pdf.text("Present Simple \u00B7 Spot the Mistake \u00B7 A1\u2013A2 \u00B7 Free to print & share", W-mr, H-7, { align:"right" });

      pdf.save("EnglishNerd_PresentSimple_SpotTheMistake.pdf");
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
          <span className="text-slate-700 font-medium">Spot the Mistake</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Error Hunt</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A1 – A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Every sentence has <b>one grammar mistake</b>.{" "}
          <b>Sets 1–2:</b> click the wrong word and type the fix, then press <kbd className="rounded bg-black/8 px-1.5 py-0.5 text-xs font-mono">Enter</kbd>.{" "}
          <b>Sets 3–4:</b> rewrite the sentence correctly and press <kbd className="rounded bg-black/8 px-1.5 py-0.5 text-xs font-mono">Enter</kbd>.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className="sticky top-24">
              <SpeedRound gameId="ps-spot-the-mistake" subject="Spot the Mistake" questions={SPEED_QUESTIONS} variant="sidebar" />
            </div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          {/* Main */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
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
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 ${exNo <= 2 ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700"}`}>
                        {exNo <= 2 ? "Click mode" : "Rewrite mode"}
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mb-1">{current.title}</h2>
                      <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                      {/* Mobile set switcher */}
                      <div className="mt-3 flex sm:hidden items-center gap-2">
                        <span className="text-slate-400 text-xs">Set:</span>
                        {([1, 2, 3, 4] as const).map((n) => (
                          <button key={n} onClick={() => switchSet(n)}
                            className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition text-sm ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Progress counter */}
                    <div className="shrink-0 flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2">
                      <span className="text-lg font-black text-slate-900">{checkedCount}</span>
                      <span className="text-slate-400 text-sm">/ {current.questions.length}</span>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {current.questions.map((q, idx) =>
                      q.mode === "click" ? (
                        <ClickCard
                          key={q.id}
                          q={q}
                          idx={idx}
                          clickedIdx={clickedIdx[q.id]}
                          typedFix={typedFix[q.id] ?? ""}
                          isChecked={checked[q.id] ?? false}
                          onClickToken={(i) => !checked[q.id] && setClickedIdx((p) => ({ ...p, [q.id]: i }))}
                          onTypeFix={(v) => setTypedFix((p) => ({ ...p, [q.id]: v }))}
                          onCheck={() => checkOne(q.id)}
                        />
                      ) : (
                        <RewriteCard
                          key={q.id}
                          q={q}
                          idx={idx}
                          value={typed[q.id] ?? ""}
                          isChecked={checked[q.id] ?? false}
                          onChange={(v) => setTyped((p) => ({ ...p, [q.id]: v }))}
                          onCheck={() => checkOne(q.id)}
                        />
                      )
                    )}
                  </div>

                  {/* Bottom actions */}
                  <div className="mt-8 space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {!allChecked && (
                        <button onClick={checkAll} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                          Check All
                        </button>
                      )}
                      <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                        Reset
                      </button>
                      {allChecked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">
                          Next Exercise →
                        </button>
                      )}
                    </div>

                    {score && (
                      <div className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div>
                            <div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div>
                          </div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎯" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80 ? "Sharp eye! Move on to Sentence Builder." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}
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
            <aside className="sticky top-24 flex flex-col gap-3">
              <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Recommended for you</p>
              {[
                { title: "Fill in the Blank", href: "/tenses/present-simple/fill-in-blank", img: "/topics/exercises/fill-in-blank.jpg", level: "A1", badge: "bg-emerald-500", reason: "Write the correct form" },
                { title: "Quiz — Multiple Choice", href: "/tenses/present-simple/quiz", img: "/topics/exercises/quiz.jpg", level: "A1", badge: "bg-emerald-500", reason: "Choose the right option" },
                { title: "Simple vs Continuous", href: "/tenses/present-simple/ps-vs-pc", img: "/topics/exercises/ps-vs-pc.jpg", level: "A2", badge: "bg-blue-500", reason: "Distinguish tense usage" },
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
            <SpeedRound gameId="ps-spot-the-mistake" subject="Spot the Mistake" questions={SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-simple/fill-in-blank" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Fill in the Blank</a>
          <a href="/tenses/present-simple/sentence-builder" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Sentence Builder →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Click-word card ─────────────────────────────────────────────────────── */

function ClickCard({ q, idx, clickedIdx, typedFix, isChecked, onClickToken, onTypeFix, onCheck }: {
  q: ClickQ; idx: number; clickedIdx: number | undefined; typedFix: string;
  isChecked: boolean; onClickToken: (i: number) => void; onTypeFix: (v: string) => void; onCheck: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const tokens = tokenize(q.sentence);

  const clickedToken = clickedIdx !== undefined ? tokens[clickedIdx] : null;
  const rightWord = clickedToken != null && normWord(clickedToken.text) === normWord(q.wrongWord);
  const rightFix = q.correction.some((c) => normWord(typedFix) === normWord(c));
  const isCorrect = isChecked && rightWord && rightFix;
  const isWrong = isChecked && (!rightWord || !rightFix);
  const noAnswer = isChecked && clickedIdx === undefined;

  return (
    <div className={`rounded-2xl border bg-white p-5 transition ${isCorrect ? "border-emerald-300" : isWrong || noAnswer ? "border-red-200" : "border-black/10"}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${isCorrect ? "bg-emerald-100 text-emerald-700" : isWrong || noAnswer ? "bg-red-100 text-red-600" : "bg-black/5 text-slate-700"}`}>
          {isCorrect ? "✓" : isWrong || noAnswer ? "✗" : idx + 1}
        </div>
        <div className="flex-1">
          {/* Word tiles */}
          <div className="flex flex-wrap gap-1.5 items-baseline mb-3">
            {tokens.map((token, i) => {
              if (token.isPunct) return <span key={i} className="text-slate-400 text-base select-none">{token.text}</span>;
              const isSelected = i === clickedIdx;
              const isTheWrong = isChecked && normWord(token.text) === normWord(q.wrongWord);
              let cls = "rounded-lg px-2.5 py-1 text-base font-semibold border transition select-none ";
              if (isChecked) {
                if (isTheWrong) cls += rightWord && rightFix ? "border-emerald-400 bg-emerald-100 text-emerald-800" : "border-red-300 bg-red-100 text-red-700";
                else if (isSelected) cls += "border-red-200 bg-red-50 text-red-400 line-through";
                else cls += "border-transparent bg-transparent text-slate-600 cursor-default";
              } else {
                cls += isSelected ? "border-[#F5DA20] bg-[#FFF9C2] text-slate-900 ring-2 ring-[#F5DA20]/40 cursor-pointer" : "border-black/10 bg-white text-slate-800 hover:border-[#F5DA20]/60 hover:bg-[#FFFBDC] cursor-pointer";
              }
              return (
                <button key={i} onClick={() => { onClickToken(i); setTimeout(() => inputRef.current?.focus(), 50); }} disabled={isChecked} className={cls}>
                  {token.text}
                </button>
              );
            })}
          </div>

          {/* Correction input */}
          <div className={`flex items-center gap-2 transition-opacity ${clickedIdx === undefined && !isChecked ? "opacity-40" : "opacity-100"}`}>
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Correct form:</span>
            <input
              ref={inputRef}
              type="text"
              value={typedFix}
              onChange={(e) => onTypeFix(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && clickedIdx !== undefined && typedFix.trim()) onCheck(); }}
              disabled={isChecked || clickedIdx === undefined}
              placeholder={clickedIdx !== undefined ? `Fix "${tokens[clickedIdx]?.text}"… (Enter)` : "Click a word first"}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              className={`rounded-lg border px-3 py-1.5 text-sm font-mono outline-none transition min-w-[170px] ${
                isChecked
                  ? rightFix && rightWord ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700"
                  : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20 disabled:bg-black/[0.02] disabled:text-slate-400"
              }`}
            />
            {!isChecked && clickedIdx !== undefined && typedFix.trim() && (
              <button onClick={onCheck} className="rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-black text-black hover:opacity-90 transition">Check</button>
            )}
          </div>

          {/* Feedback */}
          {isChecked && (
            <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
              {isCorrect && <><span className="font-black">✅ Correct!</span> {q.explanation}</>}
              {noAnswer && <><span className="font-black">⚠ No answer.</span> The error was <b className="font-mono">"{q.wrongWord}"</b> → <b className="font-mono">{q.correction.join(" / ")}</b>. {q.explanation}</>}
              {isWrong && !noAnswer && (
                <>{!rightWord && <><span className="font-black">❌ Wrong word.</span> The error was <b className="font-mono">"{q.wrongWord}"</b> → <b className="font-mono">{q.correction.join(" / ")}</b>. </>}
                {rightWord && !rightFix && <><span className="font-black">❌ Right word, wrong fix.</span> Accepted: <b className="font-mono">{q.correction.join(" / ")}</b>. </>}
                {q.explanation}</>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Rewrite card ────────────────────────────────────────────────────────── */

function RewriteCard({ q, idx, value, isChecked, onChange, onCheck }: {
  q: RewriteQ; idx: number; value: string; isChecked: boolean;
  onChange: (v: string) => void; onCheck: () => void;
}) {
  const isCorrect = isChecked && q.correct.some((c) => normSentence(value) === normSentence(c));
  const isWrong = isChecked && !isCorrect;

  function WrongHighlight() {
    const lower = q.sentence.toLowerCase();
    const start = lower.indexOf(q.wrongWord.toLowerCase());
    if (start === -1) return <>{q.sentence}</>;
    return (
      <>{q.sentence.slice(0, start)}<span className="underline decoration-red-400 decoration-2 text-red-600 font-bold">{q.sentence.slice(start, start + q.wrongWord.length)}</span>{q.sentence.slice(start + q.wrongWord.length)}</>
    );
  }

  return (
    <div className={`rounded-2xl border bg-white p-5 transition ${isCorrect ? "border-emerald-300" : isWrong ? "border-red-200" : "border-black/10"}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${isCorrect ? "bg-emerald-100 text-emerald-700" : isWrong ? "bg-red-100 text-red-600" : "bg-black/5 text-slate-700"}`}>
          {isCorrect ? "✓" : isWrong ? "✗" : idx + 1}
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold italic text-slate-700 mb-3 leading-relaxed">
            {isChecked ? <WrongHighlight /> : q.sentence}
          </p>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Your correction:</label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) onCheck(); }}
              disabled={isChecked}
              placeholder="Type the corrected sentence… (Enter to check)"
              autoComplete="off" autoCorrect="off" spellCheck={false}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium outline-none transition ${
                isChecked
                  ? isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"
                  : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
              }`}
            />
          </div>
          {isChecked && (
            <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
              {isCorrect
                ? <><span className="font-black">✅ Correct!</span> {q.explanation}</>
                : <><span className="font-black">❌ </span>Correct sentence: <span className="font-mono font-black text-slate-800">{q.correct[0]}</span><div className="mt-1 text-xs text-slate-600">{q.explanation}</div></>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation ─────────────────────────────────────────────────────────── */

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
            { text: "verb (+ -s/-es for he/she/it)", color: "yellow" },
            { text: ".", color: "slate" },
          ]} />
          <Ex en="She works every day.  ·  They live in London." />
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "don't / doesn't", color: "red" },
            { text: "verb (base form)", color: "yellow" },
            { text: ".", color: "slate" },
          ]} />
          <Ex en="She doesn't work.  ·  They don't live here." />
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Do / Does", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb (base form)", color: "yellow" },
            { text: "?", color: "slate" },
          ]} />
          <Ex en="Does she work here?  ·  Do they live nearby?" />
        </div>
      </div>

      {/* Common mistakes */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common mistakes to watch for</div>
        <div className="space-y-3">
          {[
            {
              type: "to be forms",
              wrong: "He are a doctor.  /  I are from here.  /  They is tired.",
              correct: "He is a doctor.  /  I am from here.  /  They are tired.",
              rule: "Three forms: I am · you/we/they are · he/she/it is",
            },
            {
              type: "have vs has",
              wrong: "She have a car.  /  He have a dog.",
              correct: "She has a car.  /  He has a dog.",
              rule: "'Have' is irregular — he/she/it form is 'has', not 'haves'.",
            },
            {
              type: "Modal verbs never take -s",
              wrong: "She cans swim.  /  He musts leave early.",
              correct: "She can swim.  /  He must leave early.",
              rule: "can · must · should · will · may — same for all persons, no -s ever.",
            },
            {
              type: "Base form after doesn't / does",
              wrong: "She doesn't speaks French.  /  Does he works?",
              correct: "She doesn't speak French.  /  Does he work?",
              rule: "The -s is already inside 'doesn't/does' — the main verb stays in base form.",
            },
            {
              type: "Frequency adverbs — position",
              wrong: "Always she arrives late.  /  She goes never to the gym.",
              correct: "She always arrives late.  /  She never goes to the gym.",
              rule: "Before the main verb, but AFTER 'to be': She is always late.",
            },
            {
              type: "Questions with to be — no Do/Does needed",
              wrong: "Do he is a teacher?  /  Does she is happy?",
              correct: "Is he a teacher?  /  Is she happy?",
              rule: "Invert subject and verb directly: Is he…? Are they…? — never use Do/Does.",
            },
          ].map(({ type, wrong, correct, rule }) => (
            <div key={type} className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-black text-slate-800 mb-2">{type}</div>
              <div className="grid sm:grid-cols-2 gap-2 mb-2">
                <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2">
                  <div className="text-[10px] font-black uppercase text-red-400 mb-1">Wrong ❌</div>
                  <div className="italic text-red-700 text-sm">{wrong}</div>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
                  <div className="text-[10px] font-black uppercase text-emerald-500 mb-1">Correct ✅</div>
                  <div className="italic text-emerald-800 text-sm">{correct}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium">{rule}</div>
            </div>
          ))}
        </div>
      </div>

      {/* No to after modals */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">No &apos;to&apos; after modal verbs</div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm mt-2">
          <div className="rounded-xl bg-white border border-black/8 px-3 py-2 text-red-700 italic">She can <b>to</b> swim. ❌<br />He must <b>to</b> work. ❌</div>
          <div className="rounded-xl bg-white border border-black/8 px-3 py-2 text-emerald-700 italic">She can swim. ✅<br />He must work. ✅</div>
        </div>
      </div>

    </div>
  );
}
