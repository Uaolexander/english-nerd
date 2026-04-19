/**
 * PDF generator for listening exercise worksheets.
 * Layout: dialogue script → True/False questions → answer key.
 */

export type DialogueLine = {
  speaker: string;
  text: string;
};

export type ListeningPDFConfig = {
  title: string;
  level: string;
  filename: string;
  dialogue: DialogueLine[];
  trueFalse: Array<{ text: string; answer: boolean }>;
};

export async function generateListeningPDF(config: ListeningPDFConfig): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210, H = 297, ml = 15, mr = 15, cw = W - ml - mr;
  const Y = "#F5DA20", BK = "#111111", GR = "#888888", LG = "#F4F4F4", MG = "#CCCCCC";
  const lineH = 4.8;

  let pageNum = 1;
  let y = 20;

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

  // ─── PAGE 1 ───────────────────────────────────────────────────────────────

  pageHeader(1, "Listening Worksheet");

  // Level badge
  pdf.setFillColor(BK);
  pdf.roundedRect(W - mr - 26, 5, 26, 6, 1.5, 1.5, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(Y);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdf.text(`${config.level}  LISTENING`, W - mr - 13, 8, { align: "center", baseline: "middle" } as any);

  // Title block
  pdf.setFillColor(Y);
  pdf.rect(ml, y, 2, 16, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(BK);
  pdf.text(config.title, ml + 5, y + 8);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(GR);
  pdf.text(`True / False  ·  ${config.trueFalse.length} questions`, ml + 5, y + 13.5);
  y += 21;

  // ─── DIALOGUE ─────────────────────────────────────────────────────────────

  sectionLabel("Listen and read the dialogue");

  // Collect unique speakers to assign alternating card colors
  const speakers = [...new Set(config.dialogue.map((l) => l.speaker))];
  const cardColors: Record<string, string> = {};
  const cardBorderColors: Record<string, string> = {};
  if (speakers[0]) { cardColors[speakers[0]] = "#FAFAF8"; cardBorderColors[speakers[0]] = "#E8E8D8"; }
  if (speakers[1]) { cardColors[speakers[1]] = "#F8F8FA"; cardBorderColors[speakers[1]] = "#E0E0EC"; }

  const speakerColW = 22; // fixed width for speaker name column
  const textColW = cw - speakerColW - 6; // text width

  for (const line of config.dialogue) {
    const textLines = pdf.splitTextToSize(line.text, textColW);
    const rowH = Math.max(10, textLines.length * lineH + 6);
    ensureSpace(rowH + 2);

    const bg = cardColors[line.speaker] ?? "#FAFAFA";
    const border = cardBorderColors[line.speaker] ?? "#E8E8E8";
    const isFirst = line.speaker === speakers[0];

    // Row background
    pdf.setFillColor(bg);
    pdf.setDrawColor(border);
    pdf.setLineWidth(0.25);
    pdf.roundedRect(ml, y, cw, rowH, 1.5, 1.5, "FD");

    // Left accent bar (yellow for first speaker, slate for second)
    pdf.setFillColor(isFirst ? Y : "#AAAACC");
    pdf.roundedRect(ml, y, 2, rowH, 1, 1, "F");

    // Speaker name
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(BK);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.text(line.speaker, ml + 5, y + rowH / 2, { baseline: "middle" } as any);

    // Dialogue text
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor("#333333");
    textLines.forEach((tl: string, i: number) => {
      pdf.text(tl, ml + speakerColW + 4, y + 5 + i * lineH);
    });

    y += rowH + 2;
  }

  y += 4;

  // ─── TRUE / FALSE EXERCISE ────────────────────────────────────────────────

  ensureSpace(16);
  sectionLabel("True or False? Write TRUE or FALSE.");

  // Reserve right margin for answer box: 32mm
  const ansBoxW = 32;
  const ansBoxH = 7.5;
  const textMaxW = cw - ansBoxW - 6; // text width, leaving gap + box

  config.trueFalse.forEach((stmt, i) => {
    const numStr = `${i + 1}.`;
    const numW = 7;
    // Set font before splitTextToSize so line widths match rendering size
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    const stmtLines = pdf.splitTextToSize(stmt.text, textMaxW - numW);
    const rowH = Math.max(ansBoxH + 2, stmtLines.length * lineH + 4);
    ensureSpace(rowH + 2);

    // Subtle alternating background
    if (i % 2 === 1) {
      pdf.setFillColor("#F7F7F7");
      pdf.rect(ml, y, cw, rowH, "F");
    }

    // Number
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9.5);
    pdf.setTextColor("#555555");
    pdf.text(numStr, ml, y + lineH + 0.5);

    // Statement text (font already set above)
    pdf.setTextColor("#222222");
    stmtLines.forEach((line: string, li: number) => {
      pdf.text(line, ml + numW, y + lineH + 0.5 + li * lineH);
    });

    // Answer box (right-aligned)
    const bx = W - mr - ansBoxW;
    const by = y + (rowH - ansBoxH) / 2;
    pdf.setDrawColor(MG);
    pdf.setLineWidth(0.5);
    pdf.setFillColor("#FFFFFF");
    pdf.roundedRect(bx, by, ansBoxW, ansBoxH, 1.5, 1.5, "FD");

    // Dotted line inside box for writing
    pdf.setDrawColor("#E0E0E0");
    pdf.setLineWidth(0.3);
    pdf.line(bx + 4, by + ansBoxH - 2.5, bx + ansBoxW - 4, by + ansBoxH - 2.5);

    y += rowH + 1.5;
  });

  pageFooter();

  // ─── ANSWER KEY ───────────────────────────────────────────────────────────

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
  const answers = config.trueFalse.map((s) => (s.answer ? "TRUE" : "FALSE"));

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
