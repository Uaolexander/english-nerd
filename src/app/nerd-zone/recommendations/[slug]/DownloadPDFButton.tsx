"use client";

import { useState } from "react";
import jsPDF from "jspdf";

type Word = { word: string; pos: string; meaning: string; example: string };
type Level = "A1" | "B1" | "B2" | "C1";

const H_RGB: Record<Level, [number, number, number]> = {
  A1: [245, 218, 32], B1: [124, 58, 237], B2: [234, 88, 12], C1: [2, 132, 199],
};
const D_RGB: Record<Level, [number, number, number]> = {
  A1: [150, 118, 5], B1: [76, 29, 149], B2: [154, 52, 18], C1: [7, 89, 133],
};
const DARK_HEADER: Record<Level, boolean> = { A1: true, B1: false, B2: false, C1: false };
const LETTERS = ["A", "B", "C", "D", "E", "F"];

function blankWord(example: string, word: string): string {
  const re = new RegExp(`\\b${word.replace(/[-\s]/g, "[-\\s]?")}\\b`, "gi");
  const result = example.replace(re, "_____");
  return result === example ? example.replace(word, "_____") : result;
}

export default function DownloadPDFButton({
  words, level, title, meta, tip, isPro,
}: {
  words: Word[]; level: Level; title: string; meta: string; tip: string; isPro: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const PW = 210, PH = 297, ML = 14, MR = 14, CW = PW - ML - MR;
      const hc = H_RGB[level], dc = D_RGB[level];
      const darkHdr = DARK_HEADER[level];
      const txtMain: [number, number, number] = darkHdr ? [15, 12, 5]   : [255, 255, 255];
      const txtSub:  [number, number, number] = darkHdr ? [80, 65, 10]  : [230, 222, 210];
      const txtMute: [number, number, number] = darkHdr ? [120, 98, 18] : [200, 193, 178];
      const isA1 = level === "A1";
      const HH = 56;
      const lighten = (c: [number, number, number], amt: number): [number, number, number] =>
        c.map((v) => Math.min(255, v + amt)) as [number, number, number];

      // ── shared helpers ──────────────────────────────────────────────────────
      const colHdrs = [
        { x: ML,       dot: [245, 158, 11] as [number,number,number], txt: [148, 92, 8]  as [number,number,number], label: "WORD" },
        { x: ML + 62,  dot: [16, 185, 129] as [number,number,number], txt: [5, 108, 72]  as [number,number,number], label: "MEANING" },
        { x: ML + 122, dot: [14, 165, 233] as [number,number,number], txt: [3, 105, 161] as [number,number,number], label: "EXAMPLE SENTENCE" },
      ];

      function drawTableHeader(y: number) {
        doc.setFillColor(247, 247, 251);
        doc.rect(ML, y - 9, CW, 12, "F");
        doc.setDrawColor(...dc); doc.setLineWidth(0.6);
        doc.line(ML, y - 9, ML + CW, y - 9);
        for (const ch of colHdrs) {
          doc.setFillColor(...ch.dot);
          doc.circle(ch.x + 2, y - 3, 1.5, "F");
          doc.setFontSize(6.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...ch.txt);
          doc.text(ch.label, ch.x + 6, y - 1.5);
        }
        doc.setDrawColor(215, 215, 228); doc.setLineWidth(0.2);
        doc.line(ML, y + 3, ML + CW, y + 3);
      }

      function drawPageHeader(pageNum: number, subtitle: string) {
        doc.setFillColor(...hc);
        doc.rect(0, 0, PW, 12, "F");
        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...txtMain);
        doc.text(`${title} — Practice Exercises`, ML, 8.5);
        doc.setFontSize(6.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...txtSub);
        doc.text(`${level} · ${subtitle}`, PW - MR, 8.5, { align: "right" });
      }

      function drawFooter(pageNum: number) {
        doc.setFillColor(...hc);
        doc.rect(0, PH - 12, PW, 12, "F");
        doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(...txtMain);
        doc.text("English Nerd", ML, PH - 4.5);
        doc.setFont("helvetica", "normal"); doc.setTextColor(...txtSub);
        doc.text("englishnerd.cc", PW / 2, PH - 4.5, { align: "center" });
        doc.text(`${title} · ${level} · Page ${pageNum}`, PW - MR, PH - 4.5, { align: "right" });
      }

      function drawExLabel(num: string, exTitle: string, instruction: string, y: number): number {
        // coloured square badge
        doc.setFillColor(...hc);
        doc.roundedRect(ML, y, 7, 7, 2, 2, "F");
        doc.setFontSize(8); doc.setFont("helvetica", "bold");
        doc.setTextColor(...(darkHdr ? [20, 15, 5] as [number,number,number] : [255, 255, 255] as [number,number,number]));
        doc.text(num, ML + 3.5, y + 5.2, { align: "center" });
        // title
        doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(18, 18, 30);
        doc.text(exTitle, ML + 10, y + 5.2);
        // instruction
        doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(128, 128, 148);
        doc.text(instruction, ML + 10, y + 12);
        return y + 20;
      }

      // ══════════════════════════════════════════════════════════════════
      // PAGE 1 — VOCABULARY TABLE
      // ══════════════════════════════════════════════════════════════════
      doc.setFillColor(...hc); doc.rect(0, 0, PW, HH, "F");
      doc.setFillColor(...lighten(hc, darkHdr ? 28 : 38)); doc.circle(PW - 8, 0, 44, "F");
      doc.setFillColor(...lighten(hc, darkHdr ? 48 : 18)); doc.circle(PW - 42, HH + 2, 22, "F");

      doc.setFontSize(6.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...txtMute);
      doc.text("ENGLISH NERD", ML, 9);

      doc.setFillColor(255, 255, 255); doc.roundedRect(ML, 13, 16, 8, 2, 2, "F");
      doc.setFontSize(9); doc.setFont("helvetica", "bold");
      doc.setTextColor(...(darkHdr ? dc : hc));
      doc.text(level, ML + 8, 19.2, { align: "center" });

      doc.setFontSize(23); doc.setFont("helvetica", "bold"); doc.setTextColor(...txtMain);
      doc.text(title, ML, 35);
      doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...txtMute);
      doc.text(meta, ML, 43);
      doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...txtSub);
      doc.text(`${words.length} Key Vocabulary Words`, ML, 51);

      const tableY = HH + 13;
      drawTableHeader(tableY);
      let y = tableY + 9;

      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        doc.setFontSize(7.5);
        const mLines = doc.splitTextToSize(w.meaning, 52);
        const eLines = doc.splitTextToSize(w.example, 55);
        const rowH = Math.max(10.5, 4 + Math.max(mLines.length, eLines.length, 1) * 4.6);

        if (y + rowH > PH - 50) { doc.addPage(); y = 18; drawTableHeader(y); y += 9; }

        if (i % 2 === 1) { doc.setFillColor(250, 250, 254); doc.rect(ML, y - 4, CW, rowH, "F"); }
        doc.setFillColor(...hc); doc.rect(ML, y - 4, 2.5, rowH, "F");
        doc.setDrawColor(185, 185, 200); doc.setLineWidth(0.35);
        doc.circle(ML + 8.5, y + rowH / 2 - 4, 2.4, "S");

        doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...dc);
        doc.text(w.word, ML + 15, y + 1);
        const ww = doc.getTextWidth(w.word);
        doc.setFontSize(6.5); doc.setFont("helvetica", "normal"); doc.setTextColor(162, 162, 174);
        doc.text(w.pos, ML + 15 + ww + 1.5, y + 1);
        doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(5, 100, 65);
        doc.text(mLines, ML + 62 + 3, y + 1);
        doc.setFont("helvetica", "italic"); doc.setTextColor(3, 88, 148);
        doc.text(eLines, ML + 122 + 3, y + 1);
        doc.setDrawColor(233, 233, 242); doc.setLineWidth(0.15);
        doc.line(ML, y - 4 + rowH, ML + CW, y - 4 + rowH);
        y += rowH;
      }

      // Study tip
      const tipY = y + 8;
      doc.setFontSize(7.5);
      const tipLines = doc.splitTextToSize(tip, CW - 18);
      const tipH = 15 + tipLines.length * 4.4;
      if (tipY + tipH < PH - 24) {
        doc.setFillColor(255, 251, 235); doc.roundedRect(ML, tipY, CW, tipH, 3, 3, "F");
        doc.setDrawColor(253, 230, 138); doc.setLineWidth(0.3); doc.roundedRect(ML, tipY, CW, tipH, 3, 3, "S");
        doc.setFillColor(251, 191, 36); doc.roundedRect(ML, tipY, 3.5, tipH, 1.5, 1.5, "F");
        doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(120, 76, 10);
        doc.text("Study Tip", ML + 9, tipY + 7.5);
        doc.setFont("helvetica", "normal"); doc.setTextColor(100, 65, 15);
        doc.text(tipLines, ML + 9, tipY + 13.5);
        y = tipY + tipH + 8;
      }

      // Score field
      if (y + 12 < PH - 24) {
        doc.setDrawColor(200, 200, 215); doc.setLineWidth(0.3);
        const dl = 1.5, dg = 1.5;
        for (let lx = ML; lx < ML + CW; lx += dl + dg) { const ex = Math.min(lx + dl, ML + CW); doc.line(lx, y, ex, y); doc.line(lx, y + 10, ex, y + 10); }
        for (let ly = y; ly < y + 10; ly += dl + dg) { const ey = Math.min(ly + dl, y + 10); doc.line(ML, ly, ML, ey); doc.line(ML + CW, ly, ML + CW, ey); }
        doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(155, 155, 168);
        doc.text(`My score: ___ / ${words.length}          Date: _______________          Notes: _________________________________`, ML + 5, y + 6.5);
      }

      drawFooter(1);

      // ══════════════════════════════════════════════════════════════════
      // PAGE 2 — EXERCISE 1 (Fill in Blank) + EXERCISE 2 (Word Match)
      // ══════════════════════════════════════════════════════════════════
      doc.addPage();
      drawPageHeader(2, "Exercises 1 & 2 of 3");
      let ey = 22;

      // ── Exercise 1 ──
      const ex1W = words.slice(0, 6);
      const ex1Answers = ex1W.map((w) => w.word);

      ey = drawExLabel(
        "1",
        isA1 ? "Choose the Word" : "Fill in the Blank",
        isA1
          ? "Read the sentence. Circle the correct word that fills the blank."
          : "Complete each sentence with the correct word from the vocabulary list. Write your answer.",
        ey
      );

      for (let qi = 0; qi < ex1W.length; qi++) {
        const q = ex1W[qi];
        const sentence = blankWord(q.example, q.word);
        doc.setFontSize(7.5);
        const sentLines = doc.splitTextToSize(sentence, CW - 18);
        const qH = isA1 ? sentLines.length * 4.3 + 16 : sentLines.length * 4.3 + 12;

        if (qi % 2 === 0) { doc.setFillColor(249, 249, 253); doc.rect(ML, ey - 1, CW, qH, "F"); }
        doc.setFillColor(...hc); doc.rect(ML, ey - 1, 2, qH, "F");

        doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...dc);
        doc.text(`${qi + 1}.`, ML + 4, ey + 4.5);
        doc.setFont("helvetica", "italic"); doc.setTextColor(32, 32, 50);
        doc.text(sentLines, ML + 12, ey + 4.5);

        const sentH = sentLines.length * 4.5;

        if (isA1) {
          const others = words.filter((w) => w.word !== q.word);
          const w1 = others[(qi * 2) % others.length].word;
          const w2 = others[(qi * 2 + 3) % others.length].word;
          const pool = [q.word, w1, w2];
          const rotOff = qi % 3;
          const opts = [...pool.slice(rotOff), ...pool.slice(0, rotOff)];
          const optW = (CW - 20) / 3;
          for (let oi = 0; oi < 3; oi++) {
            const ox = ML + 12 + oi * (optW + 4);
            const oy = ey + sentH + 5;
            doc.setDrawColor(185, 185, 210); doc.setLineWidth(0.4);
            doc.roundedRect(ox, oy, optW, 7, 2, 2, "S");
            doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(35, 35, 55);
            doc.text(opts[oi] ?? "", ox + optW / 2, oy + 5, { align: "center" });
          }
        } else {
          const lineY = ey + sentH + 6;
          doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(138, 138, 158);
          doc.text("Answer:", ML + 12, lineY + 1);
          doc.setDrawColor(172, 172, 195); doc.setLineWidth(0.4);
          doc.line(ML + 33, lineY + 1.5, ML + 33 + 65, lineY + 1.5);
        }
        ey += qH + 3;
      }

      ey += 8;

      // ── Exercise 2 ──
      const SHIFT = 3;
      const ex2W = words.slice(0, 6);
      const ex2Right = [...ex2W.slice(SHIFT), ...ex2W.slice(0, SHIFT)];
      const ex2Answers = ex2W.map((_, i) => LETTERS[(i + SHIFT) % 6]);

      ey = drawExLabel(
        "2",
        "Word Match",
        "Match each word (1–6) with its correct meaning (A–F). Write the letter on the line.",
        ey
      );

      const rightX2 = ML + 92;
      const rowH2 = 9.5;

      for (let i = 0; i < 6; i++) {
        const ry = ey + i * rowH2;
        if (i % 2 === 0) { doc.setFillColor(249, 249, 253); doc.rect(ML, ry - 0.5, CW, rowH2, "F"); }
        doc.setFillColor(...hc); doc.rect(ML, ry - 0.5, 2, rowH2, "F");

        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(138, 138, 158);
        doc.text(`${i + 1}.`, ML + 4, ry + 6);
        doc.setTextColor(...dc);
        doc.text(ex2W[i].word, ML + 12, ry + 6);
        // answer blank
        doc.setDrawColor(180, 180, 205); doc.setLineWidth(0.5);
        doc.line(ML + 58, ry + 6.5, ML + 74, ry + 6.5);

        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(138, 138, 158);
        doc.text(`${LETTERS[i]}.`, rightX2, ry + 6);
        doc.setFont("helvetica", "normal"); doc.setTextColor(35, 35, 55);
        const defTxt = doc.splitTextToSize(ex2Right[i].meaning, CW - 92 - 8);
        doc.text(defTxt[0], rightX2 + 9, ry + 6);

        doc.setDrawColor(228, 228, 240); doc.setLineWidth(0.15);
        doc.line(ML, ry - 0.5 + rowH2, ML + CW, ry - 0.5 + rowH2);
      }

      drawFooter(2);

      // ══════════════════════════════════════════════════════════════════
      // PAGE 3 — EXERCISE 3 (MCQ) + ANSWER KEY
      // ══════════════════════════════════════════════════════════════════
      doc.addPage();
      drawPageHeader(3, "Exercise 3 + Answer Key");
      ey = 22;

      // ── Exercise 3 ──
      const ex3W = words.slice(6, 11);
      const ex3Answers: string[] = [];
      const cPositions = [1, 2, 3, 0, 1]; // B, C, D, A, B — varied correct positions

      ey = drawExLabel(
        "3",
        "Quick-Fire Quiz",
        isA1
          ? "Look at the word and its example. Choose (A), (B), (C) or (D) for the correct meaning."
          : "Read the sentence. Choose (A), (B), (C) or (D) for the correct meaning of the missing word.",
        ey
      );

      for (let qi = 0; qi < ex3W.length; qi++) {
        const q = ex3W[qi];
        const cPos = cPositions[qi];

        const wrongMeanings = [
          words[(qi + 1) % 6].meaning,
          words[(qi + 3) % 6].meaning,
          words[(qi + 5) % 6].meaning,
        ];
        const allOpts = [...wrongMeanings];
        allOpts.splice(cPos, 0, q.meaning);
        const opts = allOpts.slice(0, 4);
        ex3Answers.push(LETTERS[cPos]);

        // Row bg
        if (qi % 2 === 0) { doc.setFillColor(249, 249, 253); }
        else { doc.setFillColor(255, 255, 255); }

        let qY = ey;
        if (isA1) {
          doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...dc);
          doc.text(`${qi + 1}.  ${q.word}`, ML + 4, qY + 5.5);
          doc.setFontSize(7); doc.setFont("helvetica", "italic"); doc.setTextColor(100, 100, 122);
          const exLines = doc.splitTextToSize(`"${q.example}"`, CW - 14);
          doc.text(exLines, ML + 12, qY + 11.5);
          qY += 8 + exLines.length * 4.2;
        } else {
          const sent = blankWord(q.example, q.word);
          doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(45, 45, 65);
          doc.text(`${qi + 1}.`, ML + 4, qY + 5.5);
          doc.setFont("helvetica", "italic"); doc.setTextColor(28, 28, 48);
          const sentLines = doc.splitTextToSize(`"${sent}"`, CW - 16);
          doc.text(sentLines, ML + 12, qY + 5.5);
          qY += 3.5 + sentLines.length * 4.5;
        }

        // 4 options — single column with indent
        for (let oi = 0; oi < 4; oi++) {
          doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...dc);
          doc.text(`(${LETTERS[oi]})`, ML + 12, qY + 4.5);
          doc.setFont("helvetica", "normal"); doc.setTextColor(35, 35, 55);
          const optLines = doc.splitTextToSize(opts[oi], CW - 28);
          doc.text(optLines, ML + 26, qY + 4.5);
          qY += Math.max(7, optLines.length * 4.2 + 1.5);
        }

        doc.setDrawColor(222, 222, 238); doc.setLineWidth(0.2);
        doc.line(ML, qY + 1, ML + CW, qY + 1);
        ey = qY + 7;
      }

      ey += 4;

      // ── Answer Key — move to new page if it doesn't fit ──
      const akH = 62;
      const footerTop = PH - 14;
      if (ey + akH > footerTop - 4) {
        drawFooter(3);
        doc.addPage();
        drawPageHeader(4, "Answer Key");
        ey = 22;
      }

      doc.setFillColor(245, 245, 252);
      doc.roundedRect(ML, ey, CW, akH, 3, 3, "F");
      doc.setDrawColor(212, 212, 232); doc.setLineWidth(0.3);
      doc.roundedRect(ML, ey, CW, akH, 3, 3, "S");
      doc.setFillColor(...dc); doc.roundedRect(ML, ey, 3.5, akH, 1.5, 1.5, "F");

      doc.setFontSize(9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(20, 20, 40);
      doc.text("Answer Key", ML + 8, ey + 9);
      doc.setFontSize(6.5); doc.setFont("helvetica", "normal"); doc.setTextColor(138, 138, 158);
      doc.text("Only check after completing all exercises on your own!", ML + 8, ey + 15.5);

      doc.setDrawColor(215, 215, 232); doc.setLineWidth(0.25);
      doc.line(ML + 8, ey + 19, ML + CW - 4, ey + 19);

      // Ex1 — word answers
      doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...dc);
      doc.text("Exercise 1:", ML + 8, ey + 28);
      doc.setFont("helvetica", "normal"); doc.setTextColor(38, 38, 60);
      doc.text(ex1Answers.map((a, i) => `${i + 1}. ${a}`).join("   "), ML + 36, ey + 28);

      // Ex2 — letter answers
      doc.setFont("helvetica", "bold"); doc.setTextColor(...dc);
      doc.text("Exercise 2:", ML + 8, ey + 38);
      doc.setFont("helvetica", "normal"); doc.setTextColor(38, 38, 60);
      doc.text(ex2Answers.map((a, i) => `${i + 1}–${a}`).join("   "), ML + 36, ey + 38);

      // Ex3 — letter answers
      doc.setFont("helvetica", "bold"); doc.setTextColor(...dc);
      doc.text("Exercise 3:", ML + 8, ey + 48);
      doc.setFont("helvetica", "normal"); doc.setTextColor(38, 38, 60);
      doc.text(ex3Answers.map((a, i) => `${i + 1}–${a}`).join("   "), ML + 36, ey + 48);

      // Score field at bottom of answer key
      doc.setFontSize(6.5); doc.setFont("helvetica", "italic"); doc.setTextColor(160, 160, 180);
      doc.text(`My total: ___ / ${ex1Answers.length + ex2Answers.length + ex3Answers.length} correct`, ML + 8, ey + 57);

      drawFooter(doc.getNumberOfPages());

      const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-study-${level.toLowerCase()}.pdf`;
      doc.save(filename);
    } finally {
      setLoading(false);
    }
  }

  if (!isPro) {
    return (
      <a
        href="/pro"
        className="inline-flex items-center gap-2 rounded-xl border border-[#F5DA20]/60 bg-[#F5DA20]/10 px-4 py-2.5 text-sm font-bold text-amber-800 hover:bg-[#F5DA20]/20 transition"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Download PDF
        <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[10px] font-black">PRO</span>
      </a>
    );
  }

  return (
    <button
      onClick={generate}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700 transition disabled:opacity-60"
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {loading ? "Generating…" : "Download PDF"}
    </button>
  );
}
