"use client";

/**
 * Shared SpeedRound + PDF section for all Present Continuous exercise pages.
 */

import { useState } from "react";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PC_SPEED_QUESTIONS, PC_PDF_CONFIG } from "./pcSharedData";

export default function PresentContinuousGameSection() {
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handlePDF() {
    setPdfLoading(true);
    try {
      await generateLessonPDF(PC_PDF_CONFIG);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="mt-12 space-y-10">
      <SpeedRound questions={PC_SPEED_QUESTIONS} gameId="present-continuous" subject="Present Continuous" />
      <div className="flex items-center gap-3">
        <PDFButton onDownload={handlePDF} loading={pdfLoading} />
        <span className="text-xs text-slate-400">Download worksheet + answer key (PDF)</span>
      </div>
    </div>
  );
}
