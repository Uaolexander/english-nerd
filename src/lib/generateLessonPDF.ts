/**
 * Shared PDF worksheet generator for grammar lessons.
 * Produces a 3-page A4 PDF: exercises (p1–2) + answer key (p3).
 */

export interface PDFExercise {
  number: number;
  title: string;        // e.g. "Exercise 1"
  difficulty: string;   // e.g. "Easy"
  instruction: string;  // shown below title
  questions: string[];  // sentence strings, use ___ for gap
  hint?: string;        // optional right-aligned hint e.g. "a / an"
}

export interface PDFAnswerKey {
  exercise: number;
  subtitle: string;     // e.g. "Easy — choose a or an"
  answers: string[];    // 10 answers
}

export interface LessonPDFConfig {
  title: string;         // e.g. "Plural Nouns"
  subtitle: string;      // e.g. "Regular & Irregular Plurals — 4 exercises + answer key"
  level: string;         // "A1"
  keyRule?: string;      // One-line grammar rule shown in yellow box
  exercises: PDFExercise[];
  answerKey: PDFAnswerKey[];
}

export async function generateLessonPDF(config: LessonPDFConfig): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210, H = 297, ml = 15, mr = 15, cw = 180;
  const Y = "#F5DA20", BK = "#111111", GR = "#999999", LG = "#F2F2F2", MG = "#CCCCCC";

  // ── shared helpers ────────────────────────────────────────────────────────

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

  function difficultyStyle(d: string): [string, string] {
    if (d === "Easy") return [Y, BK];
    if (d === "Medium") return ["#DCFCE7", "#166534"];
    if (d === "Hard") return [BK, Y];
    return ["#222222", Y]; // Harder
  }

  function exHeader(ex: PDFExercise, y: number): number {
    const [bg, fg] = difficultyStyle(ex.difficulty);
    numCircle(ml, y, ex.number);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(BK);
    pdf.text(ex.title, ml + 10, y + 5);
    const tw = pdf.getTextWidth(ex.title);
    pill(ml + 10 + tw + 3, y + 0.5, ex.difficulty.toUpperCase(), bg, fg);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(GR);
    pdf.text(ex.instruction, ml + 10 + tw + 26, y + 4.5);
    // Hint rendered as a compact word-bank line below the header
    if (ex.hint) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor("#888888");
      pdf.text(`Word bank: ${ex.hint}`, ml + 10, y + 9.5);
      return y + 13; // extra height consumed by hint row
    }
    return y + 8; // normal header height (caller adds +2 gap)
  }

  function exItems(yStart: number, items: string[]): number {
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
      }
    }
    return yStart + rows * qH;
  }

  function pageFooter(pageNum: number) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(MG);
    pdf.text("englishnerd.cc", ml, H - 7);
    pdf.text(`${pageNum} / 3`, W - mr, H - 7, { align: "right" });
  }

  // ── PAGE 1 ───────────────────────────────────────────────────────────────

  pageHeader(1, "Grammar Worksheet");

  // A1 badge
  pdf.setFillColor(BK);
  pdf.roundedRect(W - mr - 22, 5, 22, 6, 1.5, 1.5, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(Y);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdf.text(`${config.level}  LEVEL`, W - mr - 11, 8, { align: "center", baseline: "middle" } as any);

  let y = 19;

  // Title block
  pdf.setFillColor(Y);
  pdf.rect(ml, y, 2, 22, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  pdf.setTextColor(BK);
  pdf.text(config.title, ml + 5, y + 11);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(GR);
  pdf.text(config.subtitle, ml + 5, y + 18);
  y += 27;

  // Key rule box (optional)
  if (config.keyRule) {
    pdf.setFillColor(Y);
    pdf.rect(ml, y, 2, 12, "F");
    pdf.setFillColor("#FFFDE7");
    pdf.rect(ml + 2, y, cw - 2, 12, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(BK);
    pdf.text("KEY RULE:", ml + 5, y + 4.5);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    pdf.setTextColor("#555555");
    pdf.text(config.keyRule, ml + 5, y + 10);
    y += 17;
  }

  // ── Exercises (dynamic: 1–4) ─────────────────────────────────────────────
  const exercises = config.exercises;
  let pageNum = 1;

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    // Start a new page for exercises 3+ (or if content would overflow)
    if (i === 2) {
      pageFooter(pageNum);
      pageNum++;
      pdf.addPage();
      pageHeader(pageNum, "Grammar Worksheet");
      y = 20;
    }
    y = exHeader(ex, y);
    y += 2;
    y = exItems(y, ex.questions);
    if (i < exercises.length - 1 && i !== 1) y += 8;
  }

  pageFooter(pageNum);

  // ── Answer Key (dynamic page number) ────────────────────────────────────

  pageNum++;
  pdf.addPage();
  pageHeader(pageNum, `${config.title} — Answer Key`);
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

  config.answerKey.forEach(({ exercise, subtitle, answers }) => {
    const rowH = 9;
    const half = Math.ceil(answers.length / 2);
    const blockHeight = 13 + half * rowH + 8;
    // Add a new page if this exercise block won't fit
    if (y + blockHeight > H - 15) {
      pageFooter(pageNum);
      pageNum++;
      pdf.addPage();
      pageHeader(pageNum, `${config.title} — Answer Key`);
      y = 20;
    }

    numCircle(ml, y, exercise);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(BK);
    pdf.text(`Exercise ${exercise}`, ml + 10, y + 5);
    const lblW = pdf.getTextWidth(`Exercise ${exercise}`);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(GR);
    pdf.text(subtitle, ml + 10 + lblW + 4, y + 4.5);
    pdf.setDrawColor(LG);
    pdf.setLineWidth(0.3);
    pdf.line(ml, y + 9, W - mr, y + 9);
    y += 13;

    // 2-column answer list — left col: answers 1-5, right col: 6-10
    const colW = cw / 2;
    for (let i = 0; i < half; i++) {
      for (let col = 0; col < 2; col++) {
        const idx = col === 0 ? i : i + half;
        if (idx >= answers.length) continue;
        const ax = ml + col * colW;
        const ay = y + i * rowH;
        // Yellow circle bullet with number
        pdf.setFillColor(Y);
        pdf.circle(ax + 2.5, ay + rowH / 2, 2.5, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7.5);
        pdf.setTextColor(BK);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(`${idx + 1}`, ax + 2.5, ay + rowH / 2, { align: "center", baseline: "middle" } as any);
        // Answer text
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor("#222222");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(answers[idx], ax + 7, ay + rowH / 2, { baseline: "middle" } as any);
        // Separator line
        pdf.setDrawColor(LG);
        pdf.setLineWidth(0.15);
        pdf.line(ax + (col === 1 ? 2 : 0), ay + rowH, ax + colW - (col === 0 ? 2 : 0), ay + rowH);
      }
    }
    y += half * rowH + 8;
  });

  pageFooter(pageNum);

  // ── Save ─────────────────────────────────────────────────────────────────
  const safeName = config.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  pdf.save(`englishnerd-${safeName}-worksheet.pdf`);
}
