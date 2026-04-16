/**
 * Shared PDF generator for all reading exercise pages.
 * Produces a 2–3 page A4 worksheet: reading text → exercise → answer key.
 */

export type ReadingPassage = {
  /** For profile cards: speaker name (e.g. "Tom", "Dr. Rivera") */
  speaker?: string;
  /** For profile cards: subtitle (e.g. "10 years old", "Urban Planner · Barcelona") */
  speakerSub?: string;
  /** The body text */
  text: string;
};

export type ReadingPDFConfig = {
  title: string;
  level: string;    // "A1", "B2", etc.
  filename: string; // e.g. "EnglishNerd_Four-Friends_A1.pdf"

  /**
   * Reading passages.
   * - Multiple entries → rendered as profile cards (2-col grid).
   * - Single entry    → rendered as a continuous article.
   */
  passages: ReadingPassage[];

  /** Provide exactly one exercise type. */
  trueFalse?: Array<{ text: string; answer: boolean }>;

  /** MCQ with numeric correct index (0-based) */
  multipleChoice?: Array<{
    question: string;
    options: string[];
    correctIndex: number;
  }>;

  /** MCQ with letter labels A / B / C */
  multipleChoiceLetter?: Array<{
    question: string;
    options: { label: string; text: string }[];
    answer: string; // "A" | "B" | "C"
  }>;

  fillBlank?: {
    wordBank: string[];
    /**
     * textParts[0] + gap1 + textParts[1] + gap2 + ... + gapN + textParts[N]
     * So textParts.length === answers.length + 1 (or equal if last part is empty)
     */
    textParts: string[];
    answers: string[]; // correct word for each gap, in order
  };
};

export async function generateReadingPDF(config: ReadingPDFConfig): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210, H = 297, ml = 15, mr = 15, cw = W - ml - mr;
  const Y = "#F5DA20", BK = "#111111", GR = "#888888", LG = "#F4F4F4";
  const MG = "#CCCCCC";

  let pageNum = 1;
  let y = 20;

  // ─── helpers ──────────────────────────────────────────────────────────────

  function pageHeader(pn: number, sub: string) {
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
    pdf.circle(ml + 29, 9.5, 0.7, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(GR);
    pdf.text(sub, ml + 32, 10.5);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(GR);
    pdf.text(String(pn), W - mr, 10.5, { align: "right" });
  }

  function pageFooter() {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(MG);
    pdf.text("englishnerd.cc", ml, H - 7);
    pdf.text(`${config.title} · ${config.level}`, W - mr, H - 7, { align: "right" });
  }

  /** Returns true if a new page was added. */
  function ensureSpace(needed: number): boolean {
    if (y + needed > H - 22) {
      pageFooter();
      pageNum++;
      pdf.addPage();
      pageHeader(pageNum, config.title);
      y = 22;
      return true;
    }
    return false;
  }

  function sectionLabel(label: string) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(MG);
    pdf.text(label.toUpperCase(), ml, y);
    y += 5;
  }

  // ─── PAGE 1: header + title ───────────────────────────────────────────────

  pageHeader(1, "Reading Worksheet");

  // Level badge top-right
  pdf.setFillColor(BK);
  pdf.roundedRect(W - mr - 22, 5, 22, 6, 1.5, 1.5, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(Y);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdf.text(`${config.level}  READING`, W - mr - 11, 8, { align: "center", baseline: "middle" } as any);

  // Title block
  pdf.setFillColor(Y);
  pdf.rect(ml, y, 2, 16, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(BK);
  pdf.text(config.title, ml + 5, y + 8);

  const exTypeSub = config.trueFalse
    ? "True / False"
    : config.fillBlank
    ? "Fill in the Blank"
    : "Multiple Choice";
  const passageSub =
    config.passages.length > 1
      ? `${config.passages.length} texts`
      : "reading + questions";
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(GR);
  pdf.text(`${exTypeSub} · ${passageSub}`, ml + 5, y + 13.5);
  y += 21;

  // ─── READING TEXT ─────────────────────────────────────────────────────────

  sectionLabel("Read the text");

  const lineH = 4.8;

  if (config.passages.length > 1) {
    // Profile cards: 2-column grid
    const cardGap = 6;
    const cardW = (cw - cardGap) / 2;

    for (let i = 0; i < config.passages.length; i += 2) {
      const left = config.passages[i];
      const right = config.passages[i + 1];

      const leftLines = pdf.splitTextToSize(left.text, cardW - 10);
      const rightLines = right ? pdf.splitTextToSize(right.text, cardW - 10) : [];

      const leftH = (left.speaker ? 11 : 0) + leftLines.length * lineH + 8;
      const rightH = right
        ? (right.speaker ? 11 : 0) + rightLines.length * lineH + 8
        : 0;
      const rowH = Math.max(leftH, rightH);

      ensureSpace(rowH + 4);
      const rowY = y;

      for (let col = 0; col < 2; col++) {
        const p = col === 0 ? left : right;
        const pLines = col === 0 ? leftLines : rightLines;
        if (!p) continue;

        const cx = ml + col * (cardW + cardGap);

        // Card background
        pdf.setFillColor(col === 0 ? "#FAFAF8" : "#F8F8FA");
        pdf.setDrawColor("#E8E8E8");
        pdf.setLineWidth(0.3);
        pdf.roundedRect(cx, rowY, cardW, rowH, 2, 2, "FD");

        // Yellow left accent
        pdf.setFillColor(Y);
        pdf.roundedRect(cx, rowY, 2.5, rowH, 1, 1, "F");

        let iy = rowY + 5;
        if (p.speaker) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(9.5);
          pdf.setTextColor(BK);
          pdf.text(p.speaker, cx + 7, iy);
          iy += 5;
          if (p.speakerSub) {
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(7.5);
            pdf.setTextColor(GR);
            pdf.text(p.speakerSub, cx + 7, iy);
            iy += 5;
          }
        }

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor("#333333");
        pLines.forEach((line: string) => {
          pdf.text(line, cx + 7, iy);
          iy += lineH;
        });
      }

      y = rowY + rowH + 5;
    }
  } else {
    // Single article
    const article = config.passages[0];
    const paragraphs = article.text.split(/\n\n+/);

    for (const para of paragraphs) {
      const lines = pdf.splitTextToSize(para.trim(), cw);
      const paraH = lines.length * lineH + 3;
      ensureSpace(paraH);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor("#222222");
      lines.forEach((line: string) => {
        pdf.text(line, ml, y);
        y += lineH;
      });
      y += 3; // paragraph gap
    }
  }

  y += 4;

  // ─── EXERCISE ─────────────────────────────────────────────────────────────

  if (config.trueFalse) {
    ensureSpace(12);
    sectionLabel("True or False? Write TRUE or FALSE.");

    config.trueFalse.forEach((stmt, i) => {
      const stmtLines = pdf.splitTextToSize(`${i + 1}.  ${stmt.text}`, cw - 38);
      const rowH = Math.max(9, stmtLines.length * lineH) + 3;
      ensureSpace(rowH);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);
      pdf.setTextColor("#222222");
      stmtLines.forEach((line: string, li: number) => {
        pdf.text(line, ml, y + li * lineH + 4);
      });

      // TRUE / FALSE boxes
      const bx = W - mr - 38;
      pdf.setDrawColor(MG);
      pdf.setLineWidth(0.4);
      pdf.setFillColor("#FFFFFF");
      pdf.roundedRect(bx, y, 17, 7.5, 1, 1, "FD");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(GR);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("TRUE", bx + 8.5, y + 4.2, { align: "center", baseline: "middle" } as any);

      pdf.roundedRect(bx + 20, y, 17, 7.5, 1, 1, "FD");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text("FALSE", bx + 28.5, y + 4.2, { align: "center", baseline: "middle" } as any);

      y += rowH;
    });
  } else if (config.fillBlank) {
    ensureSpace(20);
    sectionLabel("Word bank");

    // Word bank box
    const bankH = 11;
    pdf.setFillColor(LG);
    pdf.setDrawColor("#E0E0E0");
    pdf.setLineWidth(0.3);
    pdf.roundedRect(ml, y, cw, bankH, 2, 2, "FD");
    const bankStr = config.fillBlank.wordBank.join("   ·   ");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(BK);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.text(bankStr, W / 2, y + bankH / 2, { align: "center", baseline: "middle" } as any);
    y += bankH + 6;

    sectionLabel("Fill in the blanks");

    // Reconstruct gapped text
    let fullText = "";
    config.fillBlank.textParts.forEach((part, i) => {
      fullText += part;
      if (i < config.fillBlank!.answers.length) {
        fullText += `_____(${i + 1})_____`;
      }
    });
    const textLines = pdf.splitTextToSize(fullText, cw);
    const textH = textLines.length * (lineH + 0.8);
    ensureSpace(textH);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor("#222222");
    textLines.forEach((line: string) => {
      pdf.text(line, ml, y);
      y += lineH + 0.8;
    });
    y += 4;
  } else if (config.multipleChoice) {
    ensureSpace(12);
    sectionLabel("Choose the best answer.");

    config.multipleChoice.forEach((q, i) => {
      const qLines = pdf.splitTextToSize(`${i + 1}.  ${q.question}`, cw);
      const optTexts = q.options.map(
        (opt, oi) => `    ${String.fromCharCode(65 + oi)})   ${opt}`
      );
      const totalH = qLines.length * lineH + optTexts.length * 5.5 + 5;
      ensureSpace(totalH + 4);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9.5);
      pdf.setTextColor(BK);
      qLines.forEach((line: string, li: number) => {
        pdf.text(line, ml, y + li * lineH + 4);
      });
      y += qLines.length * lineH + 2;

      optTexts.forEach((opt) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor("#444444");
        pdf.text(opt, ml, y + 4);
        y += 5.5;
      });
      y += 4;
    });
  } else if (config.multipleChoiceLetter) {
    ensureSpace(12);
    sectionLabel("Choose the best answer.");

    config.multipleChoiceLetter.forEach((q, i) => {
      const qLines = pdf.splitTextToSize(`${i + 1}.  ${q.question}`, cw);
      const totalH = qLines.length * lineH + q.options.length * 5.5 + 5;
      ensureSpace(totalH + 4);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9.5);
      pdf.setTextColor(BK);
      qLines.forEach((line: string, li: number) => {
        pdf.text(line, ml, y + li * lineH + 4);
      });
      y += qLines.length * lineH + 2;

      q.options.forEach((opt) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor("#444444");
        pdf.text(`    ${opt.label})   ${opt.text}`, ml, y + 4);
        y += 5.5;
      });
      y += 4;
    });
  }

  pageFooter();

  // ─── ANSWER KEY PAGE ──────────────────────────────────────────────────────

  pageNum++;
  pdf.addPage();
  pageHeader(pageNum, `${config.title} — Answer Key`);
  y = 22;

  pdf.setFillColor(Y);
  pdf.rect(ml, y, 2, 15, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(BK);
  pdf.text("Answer Key", ml + 5, y + 7);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(GR);
  pdf.text("Check your answers below", ml + 5, y + 13);
  y += 20;

  pdf.setDrawColor(LG);
  pdf.setLineWidth(0.3);
  pdf.line(ml, y, W - mr, y);
  y += 7;

  const cols = 4;
  const chipW = 30, chipH = 8;
  const chipStepX = cw / cols;

  let answers: string[] = [];

  if (config.trueFalse) {
    answers = config.trueFalse.map((s) => (s.answer ? "TRUE" : "FALSE"));
  } else if (config.fillBlank) {
    answers = config.fillBlank.answers;
  } else if (config.multipleChoice) {
    answers = config.multipleChoice.map((q) =>
      String.fromCharCode(65 + q.correctIndex)
    );
  } else if (config.multipleChoiceLetter) {
    answers = config.multipleChoiceLetter.map((q) => q.answer);
  }

  answers.forEach((ans, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = ml + col * chipStepX;
    const cy = y + row * (chipH + 6);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(MG);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.text(`${i + 1}.`, cx, cy + chipH / 2, { baseline: "middle" } as any);

    pdf.setFillColor(Y);
    pdf.roundedRect(cx + 9, cy, chipW, chipH, 1.5, 1.5, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(BK);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.text(ans, cx + 9 + chipW / 2, cy + chipH / 2, { align: "center", baseline: "middle" } as any);
  });

  const keyRows = Math.ceil(answers.length / cols);
  y += keyRows * (chipH + 6) + 12;

  // Note
  pdf.setFillColor(LG);
  pdf.setDrawColor("#E0E0E0");
  pdf.setLineWidth(0.3);
  const noteH = 11;
  pdf.roundedRect(ml, y, cw, noteH, 2, 2, "FD");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor("#555555");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdf.text("englishnerd.cc — Free to print and share with your students.", W / 2, y + noteH / 2, { align: "center", baseline: "middle" } as any);

  pageFooter();

  pdf.save(config.filename);
}
