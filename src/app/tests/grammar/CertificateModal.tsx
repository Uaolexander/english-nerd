"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";

type Level = "A1" | "A2" | "B1" | "B2" | "C1";

const LEVEL_LABEL: Record<Level, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-Intermediate",
  C1: "Advanced",
};

type Props = {
  level: Level;
  score: { correct: number; total: number; percent: number };
  onClose: () => void;
  onSaved?: () => void; // called after cert is saved to DB
};

export default function CertificateModal({ level, score, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function downloadPDF() {
    if (!name.trim()) return;
    if (!certRef.current) return;
    setLoading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Clone the cert element into a temp container outside the scaled preview
      // wrapper — html2canvas picks up parent CSS transforms and clips, which
      // causes the scaled preview context to corrupt the output PDF.
      const clone = certRef.current.cloneNode(true) as HTMLElement;
      const tmp = document.createElement("div");
      tmp.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:794px;height:562px;overflow:visible;z-index:-1;transform:none;";
      tmp.appendChild(clone);
      document.body.appendChild(tmp);

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(tmp);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageW = 297;
      const pageH = 210;
      pdf.addImage(imgData, "PNG", 0, 0, pageW, pageH);
      pdf.save(`EnglishNerd_Certificate_${name.replace(/\s+/g, "_")}.pdf`);

      // Save to account (silent — never blocks the download)
      try {
        const res = await fetch("/api/certificates/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            level,
            scorePercent: score.percent,
            scoreCorrect: score.correct,
            scoreTotal: score.total,
            holderName: name.trim(),
          }),
        });
        if (res.ok) onSaved?.();
      } catch { /* silent */ }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="flex min-h-full items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
      <div className="w-full max-w-3xl rounded-2xl border border-black/10 bg-white shadow-2xl overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <div>
            <h2 className="text-lg font-black text-[#0F0F12]">Download Certificate</h2>
            <p className="text-xs text-black/45 mt-0.5">Enter your name — it will appear on the certificate.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/40 hover:bg-black/5 transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Name input */}
        <div className="px-6 py-4 border-b border-black/8 bg-slate-50">
          <label className="text-xs font-bold text-black/50 block mb-1.5">Your full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Smith"
            className="w-full rounded-xl border border-black/12 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F0F12] placeholder:text-black/25 outline-none focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20 transition"
          />
        </div>

        {/* Certificate preview */}
        <div className="px-6 py-5 bg-slate-50">
          <p className="text-xs font-bold text-black/35 uppercase tracking-wide mb-3">Preview</p>

          {/* Scaled wrapper — certRef stays 794×562 for PDF; visually scaled to 65% */}
          <div style={{ width: "516px", height: "365px", overflow: "hidden", borderRadius: "8px", boxShadow: "0 2px 16px rgba(0,0,0,0.10)", margin: "0 auto" }}>
            <div style={{ transform: "scale(0.65)", transformOrigin: "top left", width: "794px", height: "562px", pointerEvents: "none" }}>

          {/* The actual certificate div that gets rendered to PDF */}
          <div
            ref={certRef}
            style={{
              width: "794px",
              height: "562px",
              background: "#ffffff",
              position: "relative",
              fontFamily: "Georgia, 'Times New Roman', serif",
              overflow: "hidden",
            }}
          >
            {/* Top yellow bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "8px", background: "#F5DA20" }} />

            {/* Bottom yellow bar */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "8px", background: "#F5DA20" }} />

            {/* Left accent */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "8px", bottom: 0, background: "#F5DA20" }} />

            {/* Right accent */}
            <div style={{ position: "absolute", top: 0, right: 0, width: "8px", bottom: 0, background: "#F5DA20" }} />

            {/* Inner content area */}
            <div style={{
              position: "absolute",
              top: "28px",
              left: "28px",
              right: "28px",
              bottom: "28px",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 60px",
            }}>

              {/* Logo / brand */}
              <div style={{
                position: "absolute",
                top: "28px",
                left: "0",
                right: "0",
                textAlign: "center",
                fontFamily: "Georgia, serif",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "3px",
                color: "rgba(0,0,0,0.35)",
                textTransform: "uppercase",
              }}>
                EnglishNerd
              </div>

              {/* Certificate of */}
              <p style={{
                fontSize: "11px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.35)",
                fontFamily: "Georgia, serif",
                marginBottom: "12px",
                marginTop: "0",
              }}>
                Certificate of Achievement
              </p>

              {/* "This certifies that" */}
              <p style={{
                fontSize: "14px",
                color: "rgba(0,0,0,0.45)",
                fontFamily: "Georgia, serif",
                marginBottom: "10px",
                marginTop: "0",
                fontStyle: "italic",
              }}>
                This certifies that
              </p>

              {/* Name */}
              <div style={{
                fontSize: name.trim() ? "38px" : "24px",
                fontWeight: "700",
                fontFamily: "Georgia, serif",
                color: name.trim() ? "#0F0F12" : "rgba(0,0,0,0.2)",
                letterSpacing: "-0.5px",
                textAlign: "center",
                marginBottom: "14px",
                lineHeight: "1.1",
                minHeight: "46px",
                display: "flex",
                alignItems: "center",
              }}>
                {name.trim() || "Your Name Here"}
              </div>

              {/* Descriptor */}
              <p style={{
                fontSize: "13px",
                color: "rgba(0,0,0,0.45)",
                fontFamily: "Georgia, serif",
                marginBottom: "22px",
                marginTop: "0",
                fontStyle: "italic",
                textAlign: "center",
              }}>
                has successfully completed the English Grammar Level Test
              </p>

              {/* Level badge */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "22px",
              }}>
                <div style={{
                  background: "#F5DA20",
                  borderRadius: "10px",
                  padding: "10px 28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}>
                  <span style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    fontFamily: "Georgia, serif",
                    color: "#0F0F12",
                    lineHeight: "1",
                  }}>{level}</span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    fontFamily: "Georgia, serif",
                    color: "rgba(0,0,0,0.6)",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginTop: "4px",
                  }}>{LEVEL_LABEL[level]}</span>
                </div>

                <div style={{ width: "1px", height: "60px", background: "rgba(0,0,0,0.1)" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", color: "#0F0F12", fontFamily: "Georgia, serif" }}>
                      {score.correct}/{score.total}
                    </span>
                    <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>
                      correct answers
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", color: "#0F0F12", fontFamily: "Georgia, serif" }}>
                      {score.percent}%
                    </span>
                    <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>
                      score
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: "120px", height: "1px", background: "rgba(0,0,0,0.12)", marginBottom: "16px" }} />

              {/* Date + disclaimer */}
              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontSize: "11px",
                  color: "rgba(0,0,0,0.35)",
                  fontFamily: "Georgia, serif",
                  marginBottom: "4px",
                  marginTop: "0",
                }}>
                  {today}
                </p>
                <p style={{
                  fontSize: "9px",
                  color: "rgba(0,0,0,0.2)",
                  fontFamily: "Georgia, serif",
                  marginTop: "0",
                  letterSpacing: "0.5px",
                }}>
                  englishnerd.cc · This is an informal assessment, not an official CEFR certificate.
                </p>
              </div>
            </div>
          </div>

            </div>{/* end scale wrapper */}
          </div>{/* end width container */}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-black/8">
          <button
            onClick={onClose}
            className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-black/50 hover:bg-black/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={downloadPDF}
            disabled={!name.trim() || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-6 py-2.5 text-sm font-black text-black hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Generating…
              </>
            ) : (
              <>
                ↓ Download PDF
              </>
            )}
          </button>
        </div>
      </div>
      </div>
    </div>,
    document.body
  );
}
