"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import { useLiveSession } from "@/lib/useLiveSession";
import dynamic from "next/dynamic";
const LiveSessionBanner = dynamic(() => import("@/components/LiveSessionBanner"), { ssr: false });
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "She ___ to school every day.",           options: ["go","goes","going","gone"],          answer: 1 },
  { q: "They ___ football on Sundays.",           options: ["plays","play","playing","played"],   answer: 1 },
  { q: "He ___ coffee every morning.",            options: ["drink","drinks","is drink","drank"], answer: 1 },
  { q: "I ___ like spicy food.",                  options: ["doesn't","don't","not","isn't"],     answer: 1 },
  { q: "She ___ watch TV in the morning.",        options: ["don't","isn't","doesn't","not"],     answer: 2 },
  { q: "___ you speak French?",                   options: ["Does","Are","Do","Is"],              answer: 2 },
  { q: "___ she like jazz?",                      options: ["Do","Are","Is","Does"],              answer: 3 },
  { q: "Water ___ at 100°C.",                     options: ["boil","is boiling","boils","boiled"],answer: 2 },
  { q: "My parents ___ live in Paris.",           options: ["doesn't","isn't","don't","not"],     answer: 2 },
  { q: "The train ___ at 8 AM.",                  options: ["leave","leaving","left","leaves"],   answer: 3 },
  { q: "We ___ usually have breakfast at home.",  options: ["doesn't","no","not","don't"],        answer: 3 },
  { q: '"Does he drink coffee?" — "Yes, he ___."',options: ["do","does","is","plays"],            answer: 1 },
  { q: "How often ___ she go to the gym?",        options: ["do","is","does","are"],              answer: 2 },
  { q: "The sun ___ in the east.",                options: ["rise","rising","rised","rises"],     answer: 3 },
  { q: "My brother ___ football every weekend.",  options: ["play","is play","playing","plays"],  answer: 3 },
  { q: "___ your parents live in the city?",      options: ["Does","Is","Do","Are"],              answer: 2 },
  { q: "She ___ three languages.",                options: ["speak","is speak","speaking","speaks"],answer: 3 },
  { q: "I ___ eat meat.",                         options: ["doesn't","not","don't","no"],        answer: 2 },
  { q: "The museum ___ at 9 AM.",                 options: ["open","is open","opening","opens"],  answer: 3 },
  { q: '"Do you study English?" — "Yes, I ___."', options: ["does","am","study","do"],            answer: 3 },
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
    title: "Exercise 1 — Affirmative: he / she / it → add -s or -es",
    instructions:
      "With he, she, it (and singular nouns) the verb takes -s or -es: she works, he goes, it rains. With I, you, we, they the verb stays in its base form: I work, they go.",
    questions: [
      { id: "1-1", prompt: "She ___ to school every day.", options: ["go", "goes", "is going", "going"], correctIndex: 1, explanation: "He/she/it → add -s: goes." },
      { id: "1-2", prompt: "He ___ coffee every morning.", options: ["drink", "drinks", "is drinking", "drank"], correctIndex: 1, explanation: "He/she/it → add -s: drinks." },
      { id: "1-3", prompt: "The train ___ at 8 AM.", options: ["leave", "leaving", "leaves", "left"], correctIndex: 2, explanation: "Singular noun → add -s: leaves." },
      { id: "1-4", prompt: "My sister ___ in London.", options: ["live", "is live", "lived", "lives"], correctIndex: 3, explanation: "He/she/it → add -s: lives." },
      { id: "1-5", prompt: "It ___ a lot in winter here.", options: ["rain", "rains", "is rain", "rained"], correctIndex: 1, explanation: "It → add -s: rains." },
      { id: "1-6", prompt: "He ___ chess very well.", options: ["playing", "play", "plays", "played"], correctIndex: 2, explanation: "He/she/it → add -s: plays." },
      { id: "1-7", prompt: "The sun ___ in the east.", options: ["rise", "rising", "rised", "rises"], correctIndex: 3, explanation: "Singular noun → add -s: rises." },
      { id: "1-8", prompt: "She ___ three languages.", options: ["speak", "speaks", "is speaking", "speaking"], correctIndex: 1, explanation: "She → add -s: speaks." },
      { id: "1-9", prompt: "Tom ___ to music every evening.", options: ["listen", "listened", "listens", "listening"], correctIndex: 2, explanation: "He/she/it → add -s: listens." },
      { id: "1-10", prompt: "The class ___ at nine o'clock.", options: ["starting", "start", "started", "starts"], correctIndex: 3, explanation: "Singular noun → add -s: starts." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: don't / doesn't",
    instructions:
      "To make a negative, add don't (do not) with I / you / we / they, and doesn't (does not) with he / she / it. The main verb stays in its base form after don't / doesn't: she doesn't work (NOT doesn't works).",
    questions: [
      { id: "2-1", prompt: "I ___ eat meat.", options: ["doesn't", "don't", "not", "am not"], correctIndex: 1, explanation: "I → don't: I don't eat." },
      { id: "2-2", prompt: "She ___ watch TV in the morning.", options: ["don't", "isn't", "doesn't", "not"], correctIndex: 2, explanation: "She → doesn't: she doesn't watch." },
      { id: "2-3", prompt: "They ___ live near here.", options: ["doesn't", "don't", "aren't", "not"], correctIndex: 1, explanation: "They → don't: they don't live." },
      { id: "2-4", prompt: "He ___ like spicy food.", options: ["don't", "doesn't", "isn't", "not"], correctIndex: 1, explanation: "He → doesn't: he doesn't like." },
      { id: "2-5", prompt: "We ___ have a car.", options: ["doesn't", "aren't", "not", "don't"], correctIndex: 3, explanation: "We → don't: we don't have." },
      { id: "2-6", prompt: "My dog ___ eat vegetables.", options: ["don't", "doesn't", "isn't", "not"], correctIndex: 1, explanation: "My dog (= it) → doesn't." },
      { id: "2-7", prompt: "You ___ need to shout.", options: ["doesn't", "aren't", "don't", "not"], correctIndex: 2, explanation: "You → don't: you don't need." },
      { id: "2-8", prompt: "It ___ snow here in summer.", options: ["don't", "isn't", "not", "doesn't"], correctIndex: 3, explanation: "It → doesn't: it doesn't snow." },
      { id: "2-9", prompt: "She ___ know the answer.", options: ["doesn't", "don't", "isn't", "not"], correctIndex: 0, explanation: "She → doesn't: she doesn't know." },
      { id: "2-10", prompt: "My parents ___ speak English.", options: ["doesn't", "aren't", "not", "don't"], correctIndex: 3, explanation: "They (parents) → don't: they don't speak." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: do / does + short answers",
    instructions:
      "Questions use Do with I / you / we / they and Does with he / she / it. The main verb stays in its base form: Does she work? (NOT Does she works?) Short answers: Yes, I do. / No, she doesn't.",
    questions: [
      { id: "3-1", prompt: "___ you like chocolate?", options: ["Does", "Do", "Are", "Is"], correctIndex: 1, explanation: "You → Do: Do you like…?" },
      { id: "3-2", prompt: "___ she work here?", options: ["Do", "Is", "Does", "Are"], correctIndex: 2, explanation: "She → Does: Does she work…?" },
      { id: "3-3", prompt: "___ they speak French?", options: ["Does", "Do", "Are", "Is"], correctIndex: 1, explanation: "They → Do: Do they speak…?" },
      { id: "3-4", prompt: '"Do you play football?" — "Yes, I ___.', options: ["do", "does", "am", "play"], correctIndex: 0, explanation: "Short answer with Do: Yes, I do." },
      { id: "3-5", prompt: '"Does he drink coffee?" — "No, he ___.', options: ["don't", "doesn't", "isn't", "not"], correctIndex: 1, explanation: "Short negative answer with does: No, he doesn't." },
      { id: "3-6", prompt: '"Do they live in Paris?" — "Yes, they ___.', options: ["does", "are", "did", "do"], correctIndex: 3, explanation: "Short answer with Do: Yes, they do." },
      { id: "3-7", prompt: "___ your mother cook every day?", options: ["Do", "Is", "Does", "Has"], correctIndex: 2, explanation: "Your mother (= she) → Does." },
      { id: "3-8", prompt: '"Does she like jazz?" — "No, she ___.', options: ["don't", "isn't", "doesn't", "won't"], correctIndex: 2, explanation: "Short negative answer with does: No, she doesn't." },
      { id: "3-9", prompt: "___ it rain a lot in autumn?", options: ["Do", "Does", "Is", "Are"], correctIndex: 1, explanation: "It → Does: Does it rain…?" },
      { id: "3-10", prompt: '"Do you study English?" — "Yes, I ___.', options: ["does", "am", "study", "do"], correctIndex: 3, explanation: "Short answer with Do: Yes, I do." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all three forms",
    instructions:
      "This exercise mixes affirmative, negative, and question forms. For each sentence, decide: What is the subject? Which form fits — base verb (+s), don't/doesn't, or Do/Does?",
    questions: [
      { id: "4-1", prompt: "My brother ___ football every weekend.", options: ["play", "plays", "is plays", "to play"], correctIndex: 1, explanation: "My brother (= he) → plays." },
      { id: "4-2", prompt: "___ your parents live in the city?", options: ["Does", "Do", "Are", "Is"], correctIndex: 1, explanation: "Your parents (= they) → Do." },
      { id: "4-3", prompt: "She ___ like horror movies.", options: ["don't", "doesn't", "isn't", "not"], correctIndex: 1, explanation: "She → doesn't." },
      { id: "4-4", prompt: "Water ___ at 100 degrees Celsius.", options: ["boil", "is boiling", "boils", "boiled"], correctIndex: 2, explanation: "Water (= it) → boils. Scientific fact." },
      { id: "4-5", prompt: "We ___ usually have breakfast at home.", options: ["doesn't", "no", "not", "don't"], correctIndex: 3, explanation: "We → don't." },
      { id: "4-6", prompt: '"Does Mark play the guitar?" — "Yes, he ___.', options: ["do", "does", "plays", "is"], correctIndex: 1, explanation: "Short answer with does: Yes, he does." },
      { id: "4-7", prompt: "The museum ___ at 9 in the morning.", options: ["open", "is open", "opening", "opens"], correctIndex: 3, explanation: "The museum (= it) → opens." },
      { id: "4-8", prompt: "I ___ have a pet.", options: ["doesn't", "don't", "not", "no"], correctIndex: 1, explanation: "I → don't." },
      { id: "4-9", prompt: "How often ___ she go to the gym?", options: ["do", "is", "does", "are"], correctIndex: 2, explanation: "She → does: How often does she go…?" },
      { id: "4-10", prompt: "___ you enjoy learning English?", options: ["Does", "Do", "Are", "Is"], correctIndex: 1, explanation: "You → Do." },
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

export default function PresentSimpleQuizClient({ roomId }: { roomId?: string | null }) {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

  const { save } = useProgress();

  // ── Live session ──────────────────────────────────────────────────────────
  const live = useLiveSession(roomId ?? null);

  // Apply state received from partner — never broadcast here (avoids ping-pong)
  live.onSync((payload) => {
    setAnswers(payload.answers as Record<string, number | null>);
    setChecked(payload.checked);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

  // Save progress — only if not the teacher in a live session
  useEffect(() => {
    if (checked && score && !live.isTeacher) {
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
    if (live.isLive) live.broadcast({ answers: {}, checked: false, exNo });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (live.isLive) live.broadcast({ answers: {}, checked: false, exNo: n });
  }

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210, H = 297, ml = 15, mr = 15, cw = 180;
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
      pageHeader(1, "Present Simple · Quiz Worksheet");
      pdf.setFillColor(BK); pdf.roundedRect(W-mr-22, 5, 22, 6, 1.5, 1.5, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(7.5); pdf.setTextColor(Y);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("A1  LEVEL", W-mr-11, 8, { align:"center", baseline:"middle" } as any);
      let y = 19;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 22, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(26); pdf.setTextColor(BK);
      pdf.text("Present Simple Quiz", ml+5, y+11);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Multiple choice \u00B7 40 questions \u00B7 affirmative \u00B7 negative \u00B7 questions", ml+5, y+18);
      y += 27;

      // Exercise 1 — MCQ sentences
      numCircle(ml, y, 1);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 1", ml+10, y+5);
      const e1w = pdf.getTextWidth("Exercise 1");
      pill(ml+10+e1w+3, y+0.5, "EASY", "#D1FAE5", "#065F46");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Circle the correct option (a/b/c/d).", ml+10+e1w+26, y+4.5);
      y += 11;
      const ex1 = [
        "1. She ___ to school every day.   a) go   b) goes   c) going   d) gone",
        "2. He ___ coffee every morning.   a) drink   b) drinks   c) is drinking   d) drank",
        "3. The train ___ at 8 AM.   a) leave   b) leaving   c) leaves   d) left",
        "4. My sister ___ in London.   a) live   b) is live   c) lived   d) lives",
        "5. It ___ a lot in winter here.   a) rain   b) rains   c) is rain   d) rained",
        "6. He ___ chess very well.   a) playing   b) play   c) plays   d) played",
        "7. The sun ___ in the east.   a) rise   b) rising   c) rised   d) rises",
        "8. She ___ three languages.   a) speak   b) speaks   c) is speaking   d) speaking",
        "9. Tom ___ to music every evening.   a) listen   b) listened   c) listens   d) listening",
        "10. The class ___ at nine o'clock.   a) starting   b) start   c) started   d) starts",
      ];
      const qH = 9;
      ex1.forEach((line, i) => {
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(line, ml+2, y + i*qH, { baseline:"top" } as any);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.2);
        pdf.line(ml, y+(i+1)*qH-1, W-mr, y+(i+1)*qH-1);
      });
      y += ex1.length * qH + 4;

      // Exercise 2
      numCircle(ml, y, 2);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 2", ml+10, y+5);
      const e2w = pdf.getTextWidth("Exercise 2");
      pill(ml+10+e2w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Choose don't or doesn't.", ml+10+e2w+26, y+4.5);
      y += 11;
      const ex2 = [
        "1. I ___ eat meat.   a) doesn't   b) don't   c) not   d) am not",
        "2. She ___ watch TV in the morning.   a) don't   b) isn't   c) doesn't   d) not",
        "3. They ___ live near here.   a) doesn't   b) don't   c) aren't   d) not",
        "4. He ___ like spicy food.   a) don't   b) doesn't   c) isn't   d) not",
        "5. We ___ have a car.   a) doesn't   b) aren't   c) not   d) don't",
        "6. My dog ___ eat vegetables.   a) don't   b) doesn't   c) isn't   d) not",
        "7. You ___ need to shout.   a) doesn't   b) aren't   c) don't   d) not",
        "8. It ___ snow here in summer.   a) don't   b) isn't   c) not   d) doesn't",
        "9. She ___ know the answer.   a) doesn't   b) don't   c) isn't   d) not",
        "10. My parents ___ speak English.   a) doesn't   b) aren't   c) not   d) don't",
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
      pageHeader(2, "Present Simple · Quiz Worksheet");
      y = 20;

      numCircle(ml, y, 3);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(BK);
      pdf.text("Exercise 3", ml+10, y+5);
      const e3w = pdf.getTextWidth("Exercise 3");
      pill(ml+10+e3w+3, y+0.5, "MEDIUM", "#FEF3C7", "#92400E");
      pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(GR);
      pdf.text("Choose Do or Does.", ml+10+e3w+26, y+4.5);
      y += 11;
      const ex3 = [
        "1. ___ you like chocolate?   a) Does   b) Do   c) Are   d) Is",
        "2. ___ she work here?   a) Do   b) Is   c) Does   d) Are",
        "3. ___ they speak French?   a) Does   b) Do   c) Are   d) Is",
        "4. ___ your mother cook every day?   a) Do   b) Is   c) Does   d) Has",
        "5. ___ it rain a lot in autumn?   a) Do   b) Does   c) Is   d) Are",
        '6. "Do you play football?" — "Yes, I ___."   a) do   b) does   c) am   d) play',
        '7. "Does he drink coffee?" — "No, he ___."   a) don\'t   b) doesn\'t   c) isn\'t   d) not',
        '8. "Do they live here?" — "Yes, they ___."   a) does   b) are   c) did   d) do',
        "9. ___ I need a ticket?   a) Does   b) Is   c) Are   d) Do",
        "10. ___ she know the answer?   a) Do   b) Does   c) Is   d) Are",
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
      pdf.text("Mixed forms — affirmative, negative, question.", ml+10+e4w+26, y+4.5);
      y += 11;
      const ex4 = [
        "1. My brother ___ football every weekend.   a) play   b) plays   c) is plays   d) to play",
        "2. ___ your parents live in the city?   a) Does   b) Do   c) Are   d) Is",
        "3. She ___ like horror movies.   a) don't   b) doesn't   c) isn't   d) not",
        "4. Water ___ at 100 degrees Celsius.   a) boil   b) is boiling   c) boils   d) boiled",
        "5. We ___ usually have breakfast at home.   a) doesn't   b) no   c) not   d) don't",
        '6. "Does Mark play the guitar?" — "Yes, he ___."   a) do   b) does   c) plays   d) is',
        "7. The museum ___ at 9 in the morning.   a) open   b) is open   c) opening   d) opens",
        "8. I ___ have a pet.   a) doesn't   b) don't   c) not   d) no",
        "9. How often ___ she go to the gym?   a) do   b) is   c) does   d) are",
        "10. ___ you enjoy learning English?   a) Does   b) Do   c) Are   d) Is",
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
      pageHeader(3, "Present Simple · Quiz — Answer Key");
      y = 20;
      pdf.setFillColor(Y); pdf.rect(ml, y, 2, 20, "F");
      pdf.setFont("helvetica","bold"); pdf.setFontSize(24); pdf.setTextColor(BK);
      pdf.text("Answer Key", ml+5, y+10);
      pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(GR);
      pdf.text("Check your answers below", ml+5, y+17);
      y += 26;

      const answerSections = [
        { lbl:"Exercise 1", sub:"Affirmative — he/she/it +s/es", ans:["b) goes","b) drinks","c) leaves","d) lives","b) rains","c) plays","d) rises","b) speaks","c) listens","d) starts"] },
        { lbl:"Exercise 2", sub:"Negative — don't / doesn't", ans:["b) don't","c) doesn't","b) don't","b) doesn't","d) don't","b) doesn't","c) don't","d) doesn't","a) doesn't","d) don't"] },
        { lbl:"Exercise 3", sub:"Questions — Do / Does / short answers", ans:["b) Do","c) Does","b) Do","c) Does","b) Does","a) do","b) doesn't","d) do","d) Do","b) Does"] },
        { lbl:"Exercise 4", sub:"Mixed — all forms", ans:["b) plays","b) Do","b) doesn't","c) boils","d) don't","b) does","d) opens","b) don't","c) does","b) Do"] },
      ];
      answerSections.forEach(({ lbl, sub, ans }, si) => {
        numCircle(ml, y, si+1);
        pdf.setFont("helvetica","bold"); pdf.setFontSize(12); pdf.setTextColor(BK);
        pdf.text(lbl, ml+10, y+5);
        const lblW = pdf.getTextWidth(lbl);
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor(GR);
        pdf.text(sub, ml+10+lblW+4, y+4.5);
        pdf.setDrawColor(LG); pdf.setLineWidth(0.3);
        pdf.line(ml, y+9, W-mr, y+9);
        y += 13;
        const chipW=26, chipH=7.5, chipStep=36;
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
      pdf.text("Present Simple \u00B7 Quiz \u00B7 A1 \u00B7 Free to print & share", W-mr, H-7, { align:"right" });

      pdf.save("EnglishNerd_PresentSimple_Quiz_A1.pdf");
    } catch(e) { console.error(e); }
    finally { setPdfLoading(false); }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Live session banner */}
        {roomId && (
          <LiveSessionBanner status={live.status} isTeacher={live.isTeacher} partnerOnline={live.partnerOnline} />
        )}

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/present-simple">Present Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Present Simple</b> with 40 multiple choice questions across four sets: affirmative, negative, questions, and a mixed review. Pick the correct form and check your answers.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className="">
              <div className=""><SpeedRound gameId="ps-quiz" subject="Present Simple Quiz" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
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
                                      onChange={() => {
                                        const newAnswers = { ...answers, [q.id]: oi };
                                        setAnswers(newAnswers);
                                        if (live.isLive) live.broadcast({ answers: newAnswers, checked, exNo });
                                      }}
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
                          onClick={() => {
                            setChecked(true);
                            if (live.isLive) live.broadcast({ answers, checked: true, exNo });
                          }}
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
                { title: "Fill in the Blank", href: "/tenses/present-simple/fill-in-blank", img: "/topics/exercises/fill-in-blank.jpg", level: "A1", badge: "bg-emerald-500", reason: "Type the correct form" },
                { title: "Spot the Mistake", href: "/tenses/present-simple/spot-the-mistake", img: "/topics/exercises/spot-the-mistake.jpg", level: "A1–A2", badge: "bg-amber-500", reason: "Find & fix errors" },
                { title: "Sentence Builder", href: "/tenses/present-simple/sentence-builder", img: "/topics/exercises/sentence-builder.jpg", level: "A1", badge: "bg-emerald-500", reason: "Build sentences word by word" },
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
            <SpeedRound gameId="ps-quiz" subject="Present Simple Quiz" questions={SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/present-simple"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← All Present Simple exercises
          </a>
          <a
            href="/tenses/present-simple/fill-in-blank"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Fill in the Blank →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

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

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Present Simple — Key Rules</h2>
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
            { text: "verb (+s/es)", color: "yellow" }, { dim: true, text: "+" },
            { text: "rest", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I work here." />
            <Ex en="She works here." />
            <Ex en="They play football." />
          </div>
        </div>

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

      {/* Conjugation table */}
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
                ["I",         "I work",             "I don't work",        "Do I work?"],
                ["You",       "You work",            "You don't work",      "Do you work?"],
                ["He / She",  "She works ← (+s!)",   "She doesn't work",    "Does she work?"],
                ["It",        "It works ← (+s!)",    "It doesn't work",     "Does it work?"],
                ["We / They", "They work",           "They don't work",     "Do they work?"],
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
          <span className="font-mono">She doesn&apos;t work</span> ✅ &nbsp;|&nbsp; <span className="font-mono line-through opacity-60">She doesn&apos;t works</span> ❌
        </div>
      </div>

      {/* Short answers */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">💬</span>
          <h3 className="font-black text-slate-900">Short answers</h3>
        </div>
        <p className="text-sm text-slate-600 mb-3">Never repeat the main verb — use do / does / don&apos;t / doesn&apos;t:</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { q: "Do you work?",       yes: "Yes, I do.",        no: "No, I don't." },
            { q: "Does she work?",     yes: "Yes, she does.",    no: "No, she doesn't." },
            { q: "Do they play?",      yes: "Yes, they do.",     no: "No, they don't." },
            { q: "Does he like jazz?", yes: "Yes, he does.",     no: "No, he doesn't." },
          ].map(({ q, yes, no }) => (
            <div key={q} className="rounded-xl border border-black/8 bg-black/[0.02] px-3 py-2.5">
              <div className="text-xs font-black text-slate-500 mb-1">{q}</div>
              <div className="text-sm font-semibold text-emerald-700">{yes}</div>
              <div className="text-sm font-semibold text-red-600">{no}</div>
            </div>
          ))}
        </div>
      </div>

      {/* When to use */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm">📌</span>
          <h3 className="font-black text-slate-900">When do we use Present Simple?</h3>
        </div>
        <div className="space-y-2">
          {[
            ["Habits & routines", "She goes to the gym every morning."],
            ["Permanent states", "He lives in Paris."],
            ["Facts & general truths", "Water boils at 100°C."],
            ["Timetables & schedules", "The train leaves at 8 AM."],
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
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>Common time expressions:</b>{" "}
          <span className="text-amber-900">always · usually · often · sometimes · rarely · never · every day · on Mondays · in the morning · at 7 o&apos;clock</span>
        </div>
      </div>
    </div>
  );
}
