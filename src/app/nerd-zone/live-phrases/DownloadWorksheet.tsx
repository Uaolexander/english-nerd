"use client";

import { useRef, useState } from "react";

export type Exercise = { before: string; answer: string; after: string };

type Props = {
  isLoggedIn: boolean;
  level: string;
  title: string;
  wordBank: string[];
  exercises: Exercise[];
  loginRedirect: string;
  filename: string;
};

const PAGE_W = 794;
const PAGE_H = 1123;
const C = { fontFamily: "system-ui, -apple-system, sans-serif" } as const;

function Header({ level, tag }: { level: string; tag: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F5DA20", padding: "14px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, backgroundColor: "#000", borderRadius: 8, overflow: "hidden" }}>
          <span style={{ ...C, display: "block", width: 28, height: 28, lineHeight: "28px", textAlign: "center", fontSize: 10, fontWeight: 900, color: "#F5DA20" }}>EN</span>
        </div>
        <span style={{ ...C, fontSize: 13, fontWeight: 900, color: "#000", lineHeight: "20px" }}>EnglishNerd.cc</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ ...C, display: "inline-block", height: 24, lineHeight: "24px", paddingLeft: 12, paddingRight: 12, fontSize: 10, fontWeight: 900, backgroundColor: "#000", color: "#F5DA20", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>{level} Level</span>
        <span style={{ ...C, display: "inline-block", height: 24, lineHeight: "22px", paddingLeft: 12, paddingRight: 12, fontSize: 10, fontWeight: 900, border: "2px solid #000", color: "#000", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>{tag}</span>
      </div>
    </div>
  );
}

function Footer({ page }: { page: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc", padding: "10px 32px" }}>
      <span style={{ ...C, fontSize: 10, color: "#94a3b8" }}>EnglishNerd.cc — Free for registered users</span>
      <span style={{ ...C, fontSize: 10, color: "#94a3b8" }}>{page}</span>
    </div>
  );
}

export default function DownloadWorksheet({ isLoggedIn, level, title, wordBank, exercises, loginRedirect, filename }: Props) {
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210, H = 297;
      for (const [ref, addPage] of [[page1Ref, false], [page2Ref, true]] as const) {
        const canvas = await html2canvas(ref.current!, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
        if (addPage) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, W, H);
      }
      pdf.save(filename);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <a href={`/login?next=${loginRedirect}`} className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-black text-black shadow-[0_0_0_2px_#F5DA20] transition-all duration-300 hover:shadow-[0_0_0_3px_#F5DA20,0_4px_20px_rgba(245,218,32,0.35)] hover:scale-[1.03] active:scale-[0.98]">
        <span className="shimmer-auto pointer-events-none absolute inset-0 w-1/3 skew-x-[-20deg] bg-white/40" />
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Log in to download worksheet
      </a>
    );
  }

  return (
    <>
      <button onClick={handleDownload} disabled={loading} className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-[#F5DA20] px-6 py-3.5 text-sm font-black text-black shadow-[0_0_0_2px_#F5DA20] transition-all duration-300 hover:shadow-[0_0_0_3px_#F5DA20,0_4px_20px_rgba(245,218,32,0.45)] hover:scale-[1.03] active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait">
        <span className="shimmer-auto pointer-events-none absolute inset-0 w-1/3 skew-x-[-20deg] bg-white/50" />
        {loading ? (
          <><svg className="h-4 w-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20"/></svg>Generating PDF…</>
        ) : (
          <><svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>Download Worksheet</>
        )}
      </button>

      {/* PAGE 1 */}
      <div ref={page1Ref} style={{ position: "fixed", left: -9999, top: 0, width: PAGE_W, height: PAGE_H, backgroundColor: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Header level={level} tag="Worksheet" />
        <div style={{ flex: 1, padding: "28px 32px 0", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ ...C, fontSize: 30, fontWeight: 900, color: "#0f172a", margin: 0 }}>{title}</h1>
            <p style={{ ...C, fontSize: 15, fontWeight: 600, color: "#64748b", margin: "4px 0 0" }}>Fill in the Blanks</p>
            <div style={{ width: 56, height: 4, backgroundColor: "#F5DA20", borderRadius: 4, marginTop: 10 }} />
          </div>
          <div style={{ border: "2px dashed #94a3b8", borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0", padding: "8px 16px" }}>
              <span style={{ ...C, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569" }}>Word Bank — use each expression once</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px" }}>
              {wordBank.map((v) => (
                <span key={v} style={{ ...C, border: "1px solid #cbd5e1", borderRadius: 10, padding: "5px 12px", fontSize: 13, fontWeight: 700, color: "#334155", backgroundColor: "#fff" }}>{v}</span>
              ))}
            </div>
          </div>
          <p style={{ ...C, fontSize: 12, fontStyle: "italic", color: "#64748b", marginBottom: 16 }}>Fill in each blank with the correct expression from the word bank above. Use each one once. Change the form if necessary.</p>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, flex: 1 }}>
            {exercises.map(({ before, after }, i) => (
              <li key={i} style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
                <span style={{ ...C, flexShrink: 0, display: "inline-block", width: 22, height: 22, lineHeight: "22px", textAlign: "center", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.07)", fontSize: 11, fontWeight: 900, color: "#475569", marginTop: 1 }}>{i + 1}</span>
                <span style={{ ...C, fontSize: 14, color: "#1e293b", lineHeight: 1.6 }}>
                  {before}<span style={{ display: "inline-block", width: 130, borderBottom: "2px solid #475569", verticalAlign: "bottom", marginLeft: 2, marginRight: 2 }} />{after}
                </span>
              </li>
            ))}
          </ol>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 16px", backgroundColor: "#f8fafc", marginTop: 8, marginBottom: 20 }}>
            <span style={{ ...C, fontSize: 13, fontWeight: 600, color: "#64748b" }}>Name: <span style={{ display: "inline-block", width: 160, borderBottom: "1px solid #94a3b8", verticalAlign: "bottom" }} /></span>
            <span style={{ ...C, fontSize: 13, fontWeight: 700, color: "#334155" }}>Score: <strong>____ / 10</strong></span>
          </div>
        </div>
        <Footer page="Page 1 of 2" />
      </div>

      {/* PAGE 2 */}
      <div ref={page2Ref} style={{ position: "fixed", left: -9999, top: 0, width: PAGE_W, height: PAGE_H, backgroundColor: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Header level={level} tag="Answer Key" />
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#dcfce7", overflow: "hidden" }}>
              <span style={{ display: "block", width: 36, height: 36, lineHeight: "36px", textAlign: "center", fontSize: 18 }}>✓</span>
            </div>
            <div>
              <h1 style={{ ...C, fontSize: 28, fontWeight: 900, color: "#0f172a", margin: 0 }}>Answer Key</h1>
              <p style={{ ...C, fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>{title} — Fill in the Blanks · {level}</p>
            </div>
          </div>
          <div style={{ width: 56, height: 4, backgroundColor: "#4ade80", borderRadius: 4, marginBottom: 20 }} />
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {exercises.map(({ before, answer, after }, i) => (
              <li key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start", backgroundColor: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0", padding: "10px 14px" }}>
                <span style={{ ...C, flexShrink: 0, display: "inline-block", width: 22, height: 22, lineHeight: "22px", textAlign: "center", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.07)", fontSize: 11, fontWeight: 900, color: "#475569", marginTop: 1 }}>{i + 1}</span>
                <span style={{ ...C, fontSize: 14, color: "#1e293b", lineHeight: 1.6 }}>
                  {before}<strong style={{ color: "#dc2626" }}>{answer}</strong>{after}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <Footer page="Page 2 of 2" />
      </div>
    </>
  );
}
