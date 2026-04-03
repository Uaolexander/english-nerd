"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import LessonBottomNav from "@/components/LessonBottomNav";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "I want ___ apple.",                              options: ["a","an","the","—"],   answer: 1 },
  { q: "She has ___ dog.",                               options: ["an","a","the","—"],   answer: 1 },
  { q: "He is ___ honest man.",                          options: ["a","an","the","—"],   answer: 1 },
  { q: "I saw ___ elephant at the zoo.",                 options: ["a","an","the","—"],   answer: 1 },
  { q: "That is ___ university.",                        options: ["an","a","the","—"],   answer: 1 },
  { q: "She is ___ engineer.",                           options: ["a","an","the","—"],   answer: 1 },
  { q: "It takes ___ hour to get there.",                options: ["a","an","the","—"],   answer: 1 },
  { q: "He bought ___ new car.",                         options: ["an","a","the","—"],   answer: 1 },
  { q: "They live in ___ old house.",                    options: ["a","an","the","—"],   answer: 1 },
  { q: "I need ___ umbrella.",                           options: ["a","an","the","—"],   answer: 1 },
  { q: "There is ___ cat on the roof.",                  options: ["an","a","the","—"],   answer: 1 },
  { q: "She is reading ___ interesting book.",           options: ["a","an","the","—"],   answer: 1 },
  { q: "It was ___ awful experience.",                   options: ["a","an","the","—"],   answer: 1 },
  { q: "He plays ___ guitar.",                           options: ["an","a","the","—"],   answer: 2 },
  { q: "Can I ask ___ question?",                        options: ["the","an","a","—"],   answer: 2 },
  { q: "I am ___ teacher.",                              options: ["an","the","—","a"],   answer: 3 },
  { q: "She wants to be ___ actress.",                   options: ["a","the","—","an"],   answer: 3 },
  { q: "He is ___ good student.",                        options: ["an","the","—","a"],   answer: 3 },
  { q: "We need ___ answer now.",                        options: ["the","—","an","a"],   answer: 2 },
  { q: "I have ___ idea!",                               options: ["a","the","—","an"],   answer: 3 },
  { q: "___ sun rises in the east.",                     options: ["A","An","The","—"],   answer: 2 },
  { q: "She eats ___ egg every morning.",                options: ["a","the","—","an"],   answer: 3 },
  { q: "He found ___ euro on the street.",               options: ["a","an","the","—"],   answer: 1 },
  { q: "It was ___ one-off event.",                      options: ["an","the","a","—"],   answer: 2 },
  { q: "She sent me ___ email.",                         options: ["the","an","—","a"],   answer: 3 },
];

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type InputQ = {
  id: string;
  prompt: string; // sentence with a blank
  correct: string; // normalized expected answer
  explanation: string;
};

type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function ArticlesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      // EX 1: easiest, MCQ (a/an)
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose a / an",
        instructions: "Choose the correct article: a or an.",
        questions: [
          {
            id: "e1q1",
            prompt: "I have ___ dog.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "Dog starts with a consonant sound /d/ → a.",
          },
          {
            id: "e1q2",
            prompt: "She has ___ umbrella.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Umbrella starts with a vowel sound /ʌ/ → an.",
          },
          {
            id: "e1q3",
            prompt: "It is ___ book.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "Book starts with a consonant sound /b/ → a.",
          },
          {
            id: "e1q4",
            prompt: "He is ___ engineer.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Engineer starts with a vowel sound /en/ → an.",
          },
          {
            id: "e1q5",
            prompt: "I want ___ apple.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Apple starts with a vowel sound /æ/ → an.",
          },
          {
            id: "e1q6",
            prompt: "This is ___ car.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "Car starts with a consonant sound /k/ → a.",
          },
          {
            id: "e1q7",
            prompt: "We need ___ hotel.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "Hotel starts with a consonant sound /h/ → a.",
          },
          {
            id: "e1q8",
            prompt: "It's ___ orange.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Orange starts with a vowel sound /ɒ/ → an.",
          },
          {
            id: "e1q9",
            prompt: "He bought ___ new phone.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "New starts with a consonant sound /n/ → a.",
          },
          {
            id: "e1q10",
            prompt: "She is ___ artist.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Artist starts with a vowel sound /ɑː/ → an.",
          },
        ],
      },

      // EX 2: input (a/an)
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type a / an",
        instructions: "Write a or an.",
        questions: [
          {
            id: "e2q1",
            prompt: "It's ___ pen.",
            correct: "a",
            explanation: "Pen → consonant sound /p/ → a.",
          },
          {
            id: "e2q2",
            prompt: "He has ___ idea.",
            correct: "an",
            explanation: "Idea → vowel sound /aɪ/ → an.",
          },
          {
            id: "e2q3",
            prompt: "She wants ___ sandwich.",
            correct: "a",
            explanation: "Sandwich → consonant sound /s/ → a.",
          },
          {
            id: "e2q4",
            prompt: "I need ___ answer.",
            correct: "an",
            explanation: "Answer starts with a vowel sound /ɑː/ (silent \"w\") → an.",
          },
          {
            id: "e2q5",
            prompt: "This is ___ chair.",
            correct: "a",
            explanation: "Chair → consonant sound /tʃ/ → a.",
          },
          {
            id: "e2q6",
            prompt: "It's ___ egg.",
            correct: "an",
            explanation: "Egg → vowel sound /e/ → an.",
          },
          {
            id: "e2q7",
            prompt: "He is ___ teacher.",
            correct: "a",
            explanation: "Teacher → consonant sound /t/ → a.",
          },
          {
            id: "e2q8",
            prompt: "She has ___ office.",
            correct: "an",
            explanation: "Office → vowel sound /ɒ/ → an.",
          },
          {
            id: "e2q9",
            prompt: "I see ___ bird.",
            correct: "a",
            explanation: "Bird → consonant sound /b/ → a.",
          },
          {
            id: "e2q10",
            prompt: "We have ___ exam today.",
            correct: "an",
            explanation: "Exam → vowel sound /ɪ/ → an.",
          },
        ],
      },

      // EX 3: harder (sound rules: silent letters / /juː/)
      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Sound rules",
        instructions: "Choose a or an. Focus on pronunciation (sound), not spelling.",
        questions: [
          {
            id: "e3q1",
            prompt: "He is ___ honest man.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Honest has silent \"h\" → starts with a vowel sound → an.",
          },
          {
            id: "e3q2",
            prompt: "It's ___ hour.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Hour has silent \"h\" → /aʊ/ → an.",
          },
          {
            id: "e3q3",
            prompt: "She is ___ university student.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "University starts with /juː/ (y-sound) → a.",
          },
          {
            id: "e3q4",
            prompt: "I need ___ USB cable.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "USB is often said /juː-es-biː/ → starts with /j/ → a.",
          },
          {
            id: "e3q5",
            prompt: "He wants ___ European trip.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "European starts with /juː/ → a.",
          },
          {
            id: "e3q6",
            prompt: "She bought ___ one-way ticket.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "One starts with /w/ sound → a.",
          },
          {
            id: "e3q7",
            prompt: "It's ___ unusual day.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Unusual starts with a vowel sound /ʌ/ → an.",
          },
          {
            id: "e3q8",
            prompt: "This is ___ useful app.",
            options: ["a", "an"],
            correctIndex: 0,
            explanation: "Useful starts with /juː/ → a.",
          },
          {
            id: "e3q9",
            prompt: "He is ___ actor.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "Actor starts with a vowel sound /æ/ → an.",
          },
          {
            id: "e3q10",
            prompt: "She has ___ MBA.",
            options: ["a", "an"],
            correctIndex: 1,
            explanation: "MBA starts with the sound /em/ → vowel sound → an.",
          },
        ],
      },

      // EX 4: sentence building (input)
      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the sentences",
        instructions: "Write a or an.",
        questions: [
          {
            id: "e4q1",
            prompt: "My brother is ___ doctor.",
            correct: "a",
            explanation: "Doctor → consonant sound /d/ → a.",
          },
          {
            id: "e4q2",
            prompt: "There is ___ airport near my city.",
            correct: "an",
            explanation: "Airport → vowel sound /eə/ → an.",
          },
          {
            id: "e4q3",
            prompt: "I want to buy ___ jacket.",
            correct: "a",
            explanation: "Jacket → consonant sound /dʒ/ → a.",
          },
          {
            id: "e4q4",
            prompt: "She is ___ English teacher.",
            correct: "an",
            explanation: "English starts with a vowel sound /ɪ/ → an.",
          },
          {
            id: "e4q5",
            prompt: "He has ___ small apartment.",
            correct: "a",
            explanation: "Small starts with /s/ → a.",
          },
          {
            id: "e4q6",
            prompt: "It's ___ interesting book.",
            correct: "an",
            explanation: "Interesting starts with /ɪ/ → an.",
          },
          {
            id: "e4q7",
            prompt: "I need ___ map.",
            correct: "a",
            explanation: "Map starts with /m/ → a.",
          },
          {
            id: "e4q8",
            prompt: "She wants ___ orange juice.",
            correct: "an",
            explanation: "Orange starts with a vowel sound → an.",
          },
          {
            id: "e4q9",
            prompt: "He is ___ tall man.",
            correct: "a",
            explanation: "Tall starts with /t/ → a.",
          },
          {
            id: "e4q10",
            prompt: "This is ___ easy question.",
            correct: "an",
            explanation: "Easy starts with /iː/ → an.",
          },
        ],
      },
    };
  }, []);

  // Store answers
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const current = sets[exNo];

  const { save } = useProgress();
  const isPro = useIsPro();

  useEffect(() => {
    if (checked && score) {
      save(exNo, score.percent, score.total);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const score = useMemo(() => {
    if (!checked) return null;

    let correct = 0;
    let total = 0;

    if (current.type === "mcq") {
      total = current.questions.length;
      for (const q of current.questions) {
        const a = mcqAnswers[q.id];
        if (a === q.correctIndex) correct++;
      }
    } else {
      total = current.questions.length;
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }

    const percent = total ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percent };
  }, [checked, current, mcqAnswers, inputAnswers]);

  function resetExercise() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const W = 210, H = 297, ml = 15, mr = 15, cw = 180;
      const Y = "#F5DA20", BK = "#111111", GR = "#999999", LG = "#F2F2F2", MG = "#CCCCCC";

      // ── shared helpers ──────────────────────────────────────────────
      function pageHeader(pageNum: number, sub: string) {
        pdf.setFillColor(Y);
        pdf.rect(0, 0, W, 2.5, "F");
        pdf.setFillColor("#FAFAFA");
        pdf.rect(0, 2.5, W, 13, "F");
        pdf.setDrawColor("#EBEBEB");
        pdf.setLineWidth(0.25);
        pdf.line(0, 15.5, W, 15.5);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(BK);
        pdf.text("English Nerd", ml, 10.5);
        pdf.setFillColor(MG);
        pdf.circle(ml + 27, 9.5, 0.7, "F");
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        pdf.setTextColor(GR);
        pdf.text(sub, ml + 30, 10.5);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7.5);
        pdf.setTextColor(GR);
        pdf.text(`${pageNum} / 3`, W - mr, 10.5, { align: "right" });
      }

      function numCircle(x: number, y: number, n: number) {
        pdf.setFillColor(BK);
        pdf.circle(x + 3.5, y + 3.5, 3.5, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor("#FFFFFF");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(String(n), x + 3.5, y + 3.5, { align: "center", baseline: "middle" } as any);
      }

      function pill(x: number, y: number, text: string, bg: string, fg: string) {
        const w = 20, h = 5.5;
        pdf.setFillColor(bg);
        pdf.roundedRect(x, y, w, h, 1.2, 1.2, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7);
        pdf.setTextColor(fg);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(text, x + w / 2, y + h / 2, { align: "center", baseline: "middle" } as any);
      }

      function exHeader(y: number, n: number, title: string, lvl: string, lvlBg: string, lvlFg: string, instr: string) {
        numCircle(ml, y, n);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(BK);
        pdf.text(title, ml + 10, y + 5);
        const tw = pdf.getTextWidth(title);
        pill(ml + 10 + tw + 3, y + 0.5, lvl.toUpperCase(), lvlBg, lvlFg);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        pdf.setTextColor(GR);
        pdf.text(instr, ml + 10 + tw + 26, y + 4.5);
      }

      function exItems(yStart: number, items: string[], showOpts: boolean): number {
        const qH = 9.5, colW = cw / 2;
        const rows = Math.ceil(items.length / 2);
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < 2; col++) {
            const i = row * 2 + col;
            if (i >= items.length) continue;
            const qx = ml + col * colW;
            const qy = yStart + row * qH;
            pdf.setDrawColor(LG);
            pdf.setLineWidth(0.2);
            pdf.line(qx + (col === 1 ? 2 : 0), qy + qH, qx + colW - (col === 0 ? 2 : 0), qy + qH);
            if (col === 1) pdf.line(ml + colW, qy, ml + colW, qy + qH);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(8);
            pdf.setTextColor(MG);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pdf.text(`${i + 1}.`, qx + (col === 1 ? 4 : 0), qy + qH / 2, { baseline: "middle" } as any);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor("#222222");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pdf.text(items[i], qx + (col === 1 ? 10 : 6), qy + qH / 2, { baseline: "middle" } as any);
            if (showOpts) {
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(7.5);
              pdf.setTextColor(MG);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pdf.text("a / an", qx + colW - (col === 1 ? 4 : 6), qy + qH / 2, { align: "right", baseline: "middle" } as any);
            }
          }
        }
        return yStart + rows * qH;
      }

      // ── PAGE 1 ──────────────────────────────────────────────────────
      pageHeader(1, "Grammar Worksheet");

      // A1 badge
      pdf.setFillColor(BK);
      pdf.roundedRect(W - mr - 22, 5, 22, 6, 1.5, 1.5, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(Y);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("A1  LEVEL", W - mr - 11, 8, { align: "center", baseline: "middle" } as any);

      let y = 19;

      // Title block
      pdf.setFillColor(Y);
      pdf.rect(ml, y, 2, 22, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(26);
      pdf.setTextColor(BK);
      pdf.text("Articles \u2014 a / an", ml + 5, y + 11);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(GR);
      pdf.text("a \u00B7 an  \u2014  4 graded exercises + answer key", ml + 5, y + 18);
      y += 27;

      // Grammar reference label
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(MG);
      pdf.text("GRAMMAR REFERENCE", ml, y);
      y += 5;

      // Grammar table
      const tCols = [36, 54, 50, 40];
      const tHdrs = ["Rule", "Use", "Example (+)", "Example (-)"];
      const tData = [
        ["a", "before consonant sounds", "a dog, a car, a house", "not an dog"],
        ["an", "before vowel sounds", "an apple, an egg", "not a apple"],
        ["a/an", "singular countable nouns only", "a book, an idea", "not a water"],
      ];
      const tRowH = 9;

      let tx = ml;
      tHdrs.forEach((h, ci) => {
        pdf.setFillColor(BK);
        pdf.rect(tx, y, tCols[ci], tRowH, "F");
        pdf.setDrawColor("#2A2A2A");
        pdf.setLineWidth(0.2);
        pdf.rect(tx, y, tCols[ci], tRowH, "S");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(Y);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(h, tx + 3, y + tRowH / 2, { baseline: "middle" } as any);
        tx += tCols[ci];
      });
      y += tRowH;

      tData.forEach((row) => {
        tx = ml;
        row.forEach((cell, ci) => {
          pdf.setFillColor(ci === 0 ? "#FAFAFA" : "#FFFFFF");
          pdf.rect(tx, y, tCols[ci], tRowH, "F");
          pdf.setDrawColor(LG);
          pdf.setLineWidth(0.2);
          pdf.rect(tx, y, tCols[ci], tRowH, "S");
          pdf.setFont("helvetica", ci === 0 ? "bold" : "normal");
          pdf.setFontSize(10);
          pdf.setTextColor(ci === 0 ? BK : "#444444");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(cell, tx + 3, y + tRowH / 2, { baseline: "middle" } as any);
          tx += tCols[ci];
        });
        y += tRowH;
      });
      y += 4;

      // Key rule
      pdf.setFillColor(Y);
      pdf.rect(ml, y, 2, 12, "F");
      pdf.setFillColor("#FFFDE7");
      pdf.rect(ml + 2, y, cw - 2, 12, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(BK);
      pdf.text("Key rule:", ml + 5, y + 4.5);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);
      pdf.setTextColor("#555555");
      pdf.text("Listen to the SOUND, not the letter: a university (you-ni) \u00B7 an hour (ow-er)", ml + 5, y + 9);
      y += 16;

      // Exercise 1
      exHeader(y, 1, "Exercise 1", "Easy", Y, BK, "Choose a or an.");
      y += 10;
      y = exItems(y, [
        "I have ___ dog.", "She has ___ umbrella.", "It is ___ book.", "He is ___ engineer.",
        "I want ___ apple.", "This is ___ car.", "We need ___ hotel.", "She ate ___ orange.",
        "He is ___ honest man.", "It takes ___ hour.",
      ], true);
      y += 7;

      // Exercise 2
      exHeader(y, 2, "Exercise 2", "Medium", "#DCFCE7", "#166534", "Fill in: a or an.");
      y += 10;
      y = exItems(y, [
        "I am ___ teacher.", "She is ___ actress.", "He bought ___ new car.", "They live in ___ old house.",
        "I need ___ umbrella.", "There is ___ cat.", "She is ___ interesting person.", "It was ___ awful day.",
        "He plays ___ guitar.", "Can I ask ___ question?",
      ], false);

      // Footer p1
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(MG);
      pdf.text("englishnerd.cc", ml, H - 7);
      pdf.text("1 / 3", W - mr, H - 7, { align: "right" });

      // ── PAGE 2 ──────────────────────────────────────────────────────
      pdf.addPage();
      pageHeader(2, "Articles: a / an");
      y = 20;

      exHeader(y, 3, "Exercise 3", "Hard", BK, Y, "Choose: a, an, or no article (\u2014).");
      y += 10;
      y = exItems(y, [
        "I play ___ tennis.", "___ sun rises in the east.", "She sent me ___ email.", "He is ___ good student.",
        "We need ___ answer now.", "I have ___ idea!", "___ sky is blue today.", "She eats ___ egg every morning.",
        "He found ___ euro.", "It was ___ one-off event.",
      ], false);
      y += 8;

      exHeader(y, 4, "Exercise 4", "Harder", "#222222", Y, "Choose the correct option.");
      y += 10;
      y = exItems(y, [
        "I am ___ teacher. (a/an)", "She wants to be ___ actress. (a/an)", "___ sun rises in the east. (A/The)",
        "He plays ___ guitar. (a/the)", "It takes ___ hour. (a/an)", "I saw ___ elephant. (a/an)",
        "That is ___ university. (a/an)", "She is ___ engineer. (a/an)", "He bought ___ new car. (a/an)",
        "They live in ___ old house. (a/an)",
      ], false);
      y += 10;

      // Quick reminder
      pdf.setFillColor(Y);
      pdf.rect(ml, y, 2, 18, "F");
      pdf.setFillColor("#FFFDE7");
      pdf.rect(ml + 2, y, cw - 2, 18, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(GR);
      pdf.text("QUICK REMINDER", ml + 5, y + 4.5);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor("#333333");
      pdf.text("a + consonant sound: a dog, a car, a house, a university", ml + 5, y + 10);
      pdf.setFontSize(9);
      pdf.setTextColor("#666666");
      pdf.text("an + vowel sound: an apple, an egg, an hour, an honest man", ml + 5, y + 15.5);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(MG);
      pdf.text("englishnerd.cc", ml, H - 7);
      pdf.text("2 / 3", W - mr, H - 7, { align: "right" });

      // ── PAGE 3: Answer Key ──────────────────────────────────────────
      pdf.addPage();
      pageHeader(3, "Articles: a / an \u2014 Answer Key");
      y = 20;

      pdf.setFillColor(Y);
      pdf.rect(ml, y, 2, 20, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.setTextColor(BK);
      pdf.text("Answer Key", ml + 5, y + 10);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(GR);
      pdf.text("Check your answers below", ml + 5, y + 17);
      y += 26;

      const sections = [
        { lbl: "Exercise 1", sub: "Easy \u2014 a or an", ans: ["a","an","a","an","an","a","a","an","an","an"] },
        { lbl: "Exercise 2", sub: "Medium \u2014 a or an", ans: ["a","an","a","an","an","a","an","an","\u2014","a"] },
        { lbl: "Exercise 3", sub: "Hard \u2014 a, an, or no article", ans: ["\u2014","The","an","a","an","an","The","an","a","a"] },
        { lbl: "Exercise 4", sub: "Harder \u2014 choose", ans: ["a","an","The","the","an","an","a","an","a","an"] },
      ];

      sections.forEach(({ lbl, sub, ans }, si) => {
        numCircle(ml, y, si + 1);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(BK);
        pdf.text(lbl, ml + 10, y + 5);
        const lblW = pdf.getTextWidth(lbl);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(GR);
        pdf.text(sub, ml + 10 + lblW + 4, y + 4.5);
        pdf.setDrawColor(LG);
        pdf.setLineWidth(0.3);
        pdf.line(ml, y + 9, W - mr, y + 9);
        y += 13;

        // Answer chips: 5 per row × 2 rows
        const chipW = 26, chipH = 7.5, chipStep = 36;
        ans.forEach((a, ai) => {
          const col = ai % 5;
          const row = Math.floor(ai / 5);
          const cx = ml + col * chipStep;
          const cy = y + row * 14;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(8);
          pdf.setTextColor(MG);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(`${ai + 1}.`, cx, cy + chipH / 2, { baseline: "middle" } as any);
          pdf.setFillColor(Y);
          pdf.roundedRect(cx + 6, cy, chipW, chipH, 1.5, 1.5, "F");
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(9);
          pdf.setTextColor(BK);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(a, cx + 6 + chipW / 2, cy + chipH / 2, { align: "center", baseline: "middle" } as any);
        });
        y += 2 * 14 + 8;
      });

      // Footer p3
      pdf.setDrawColor(LG);
      pdf.setLineWidth(0.3);
      pdf.line(ml, H - 12, W - mr, H - 12);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(MG);
      pdf.text("englishnerd.cc \u2014 Free English Grammar", ml, H - 7);
      pdf.text("Articles: a / an \u00B7 A1 \u00B7 Free to print & share", W - mr, H - 7, { align: "right" });

      pdf.save("EnglishNerd_Articles-a-an_A1.pdf");
    } catch (e) {
      console.error(e);
    } finally {
      setPdfLoading(false);
    }
  }

  function switchExercise(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a1">Grammar A1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Articles: a / an</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Articles <span className="font-extrabold">— a / an</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>a</b> and <b>an</b> with singular countable nouns when you talk about something for the first time.
      </p>

      {/* Layout: left + center + right */}
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound
              gameId="grammar-a1-articles"
              subject="a / an"
              questions={SPEED_QUESTIONS}
              variant="sidebar"
            />
          </div>
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}

        {/* Center */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button
              onClick={() => setTab("exercises")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Exercises
            </button>
            <button
              onClick={() => setTab("explanation")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Explanation
            </button>

            <PDFButton onDownload={downloadPDF} loading={pdfLoading} />

            <div className="ml-auto hidden sm:flex items-center gap-1.5">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => switchExercise(n as 1 | 2 | 3 | 4)}
                  className={`h-8 w-8 rounded-lg border border-black/10 text-sm font-bold transition ${
                    exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>

                  {/* Mobile exercise buttons */}
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => switchExercise(n as 1 | 2 | 3 | 4)}
                        className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                          exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Questions */}
                <div className="mt-8 space-y-5">
                  {current.type === "mcq" ? (
                    current.questions.map((q, idx) => {
                      const chosen = mcqAnswers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>

                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${
                                      chosen === oi
                                        ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                        : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default opacity-95" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))}
                                    />
                                    <span className="text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>

                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}

                                  <div className="mt-2 text-slate-700">
                                    <b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    current.questions.map((q, idx) => {
                      const val = inputAnswers[q.id] ?? "";
                      const answered = normalize(val) !== "";
                      const isCorrect = checked && answered && normalize(val) === normalize(q.correct);
                      const noAnswer = checked && !answered;
                      const wrong = checked && answered && !isCorrect;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>

                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>

                              <div className="mt-3 flex items-center gap-3">
                                <input
                                  value={val}
                                  disabled={checked}
                                  onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                                  placeholder="Type here…"
                                  className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]"
                                />
                              </div>

                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}

                                  <div className="mt-2 text-slate-700">
                                    <b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Controls */}
                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button
                        onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                      >
                        Check Answers
                      </button>
                    ) : (
                      <button
                        onClick={resetExercise}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                      >
                        Try Again
                      </button>
                    )}
                    {checked && exNo < 4 && (
                      <button
                        onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                      >
                        Next Exercise →
                      </button>
                    )}
                  </div>

                  {score && (
                    <div className={`rounded-2xl border p-4 ${
                      score.percent >= 80
                        ? "border-emerald-200 bg-emerald-50"
                        : score.percent >= 50
                        ? "border-amber-200 bg-amber-50"
                        : "border-red-200 bg-red-50"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-3xl font-black ${
                            score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"
                          }`}>
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
                            score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${score.percent}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {score.percent >= 80
                          ? "Excellent! You can move to the next exercise."
                          : score.percent >= 50
                          ? "Good effort! Try once more to improve your score."
                          : "Keep practising — review the Explanation tab and try again."}
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
              {
                title: 'Verb "to be": am / is / are',
                href: "/grammar/a1/to-be-am-is-are",
                img: "/topics/a1/to-be-am-is-are.jpg",
                level: "A1",
                badge: "bg-emerald-500",
                reason: "Master the basics first",
              },
              {
                title: "Present Simple",
                href: "/grammar/a1/present-simple-i-you-we-they",
                img: "/topics/a1/present-simple-i-you-we-they.jpg",
                level: "A1",
                badge: "bg-emerald-500",
                reason: "Next step after articles",
              },
              {
                title: "Plural Nouns",
                href: "/grammar/a1/plural-nouns",
                img: "/topics/a1/plural-nouns.jpg",
                level: "A1",
                badge: "bg-emerald-500",
              },
            ].map((rec) => (
              <a key={rec.href} href={rec.href}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <img src={rec.img} alt={rec.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md ${rec.badge}`}>
                    {rec.level}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-bold leading-snug text-slate-800 transition group-hover:text-slate-900">{rec.title}</p>
                  {rec.reason && <p className="mt-1 text-[11px] font-semibold leading-snug text-amber-600">{rec.reason}</p>}
                </div>
              </a>
            ))}
            <a href="/grammar/a1"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              All A1 topics
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </a>
          </aside>
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}
      </div>

      {/* Speed Round — only for non-Pro, aligned to center column */}
      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound
            gameId="grammar-a1-articles"
            subject="Articles: a / an"
            questions={SPEED_QUESTIONS}
          />
          <div className="hidden lg:block" />
        </div>
      )}

      <LessonBottomNav
        backHref="/grammar/a1"
        backLabel="All A1 topics"
        nextHref="/grammar/a1/plural-nouns"
        nextLabel="Plural Nouns"
        nextDescription="Regular & irregular plurals"
      />
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text?: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
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

function Ex({ en, correct = true }: { en: string; correct?: boolean }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 ${correct ? "bg-white border border-black/8" : "bg-red-50 border border-red-100"}`}>
      <span className="text-sm shrink-0">{correct ? "✅" : "❌"}</span>
      <div className={`font-semibold text-sm ${correct ? "text-slate-900" : "text-red-700 line-through"}`}>{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Articles — a / an</h2>
        <p className="text-slate-500 text-sm">Use before singular countable nouns. The choice depends on SOUND, not spelling.</p>
      </div>

      {/* 2 gradient cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔵</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">a — before consonant sounds</span>
          </div>
          <Formula parts={[
            { text: "a", color: "sky" },
            { dim: true },
            { text: "consonant sound", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="a dog (/d/ sound)" />
            <Ex en="a book (/b/ sound)" />
            <Ex en="a university (/juː/ sound)" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🟢</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">an — before vowel sounds</span>
          </div>
          <Formula parts={[
            { text: "an", color: "green" },
            { dim: true },
            { text: "vowel sound", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="an apple (/æ/ sound)" />
            <Ex en="an egg (/e/ sound)" />
            <Ex en="an hour (silent h → /aʊ/ sound)" />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Quick reference — a vs an</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-6 font-black text-sky-700">a + consonant sound</th>
                <th className="text-left py-2 font-black text-emerald-700">an + vowel sound</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["a dog", "an apple"],
                ["a book", "an egg"],
                ["a car", "an hour"],
                ["a house", "an idea"],
                ["a year", "an umbrella"],
              ].map(([a, an]) => (
                <tr key={a}>
                  <td className="py-2 pr-6 text-slate-700">{a}</td>
                  <td className="py-2 text-slate-700">{an}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sound rule exceptions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Tricky sound cases</h3>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Use AN (silent h)</p>
            <div className="space-y-2">
              <Ex en="an hour (h is silent)" />
              <Ex en="an honest man (h is silent)" />
            </div>
          </div>
          <div>
            <p className="text-xs font-black text-sky-700 uppercase tracking-widest mb-2">Use A (vowel letter, /juː/ sound)</p>
            <div className="space-y-2">
              <Ex en="a university (sounds like 'yu')" />
              <Ex en="a European (sounds like 'yu')" />
            </div>
          </div>
        </div>
      </div>

      {/* When to use a/an */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">When to use a / an</h3>
        </div>
        <div className="space-y-2">
          <Ex en="She's a doctor. (jobs)" />
          <Ex en="I have a cat. (singular countable nouns)" />
          <Ex en="It's a bird! (saying what something is)" />
        </div>
      </div>

      {/* Wrong vs right */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Wrong</p>
          <Ex en="a apple" correct={false} />
          <Ex en="an book" correct={false} />
          <Ex en="a hour" correct={false} />
          <Ex en="an university" correct={false} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Correct</p>
          <Ex en="an apple" />
          <Ex en="a book" />
          <Ex en="an hour" />
          <Ex en="a university" />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> It&apos;s the SOUND that matters, not the letter — &quot;an hour&quot; not &quot;a hour&quot; because the H is silent. Say the word aloud and trust your ear.
      </div>
    </div>
  );
}