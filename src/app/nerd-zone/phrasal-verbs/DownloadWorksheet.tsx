"use client";

import { useRef, useState } from "react";

const WORD_BANK = [
  "come in", "get up", "turn on", "turn off", "put on",
  "take off", "look for", "wake up", "pick up", "go out",
];

const EXERCISES: { before: string; answer: string; after: string }[] = [
  { before: "",                                    answer: "Come in",    after: ", please! The teacher is ready to start the lesson."  },
  { before: "I usually ",                          answer: "get up",     after: " at 7 o'clock every morning."                         },
  { before: "Can you ",                            answer: "turn on",    after: " the lights? It's too dark in here."                  },
  { before: "Please ",                             answer: "turn off",   after: " your phone — the film is about to start."            },
  { before: "It's cold outside. Don't forget to ", answer: "put on",     after: " your coat before you leave."                         },
  { before: "I always ",                           answer: "take off",   after: " my shoes before entering the house."                 },
  { before: "I usually ",                          answer: "wake up",    after: " very early because of the birds outside."            },
  { before: "Have you seen my keys? I'm ",         answer: "looking for", after: " them everywhere."                                  },
  { before: "Can you ",                            answer: "pick up",    after: " that box? It's too heavy for me."                   },
  { before: "They love to ",                       answer: "go out",     after: " and try new restaurants at the weekend."             },
];

// Shared A4 dimensions (794×1123px = A4 at 96dpi)
const PAGE_W = 794;
const PAGE_H = 1123;

function Header({ tag }: { tag: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F5DA20", padding: "14px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, backgroundColor: "#000", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: "#F5DA20", fontFamily: "system-ui" }}>EN</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 900, fontFamily: "system-ui", color: "#000" }}>EnglishNerd.cc</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 900, backgroundColor: "#000", color: "#F5DA20", padding: "3px 10px", borderRadius: 20, fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: "0.08em" }}>A1 Level</span>
        <span style={{ fontSize: 10, fontWeight: 900, border: "2px solid #000", color: "#000", padding: "3px 10px", borderRadius: 20, fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: "0.08em" }}>{tag}</span>
      </div>
    </div>
  );
}

function Footer({ page }: { page: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc", padding: "10px 32px" }}>
      <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "system-ui" }}>EnglishNerd.cc — Free for registered users</span>
      <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "system-ui" }}>{page}</span>
    </div>
  );
}

export default function DownloadWorksheet({ isLoggedIn }: { isLoggedIn: boolean }) {
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
        const el = ref.current!;
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
        if (addPage) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, W, H);
      }

      pdf.save("PhrasalVerbs_A1_Worksheet_EnglishNerd.pdf");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <a
        href="/login?next=/nerd-zone/phrasal-verbs"
        className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-black text-black shadow-[0_0_0_2px_#F5DA20] transition-all duration-300 hover:shadow-[0_0_0_3px_#F5DA20,0_4px_20px_rgba(245,218,32,0.35)] hover:scale-[1.03] active:scale-[0.98]"
      >
        <span className="shimmer-auto pointer-events-none absolute inset-0 w-1/3 skew-x-[-20deg] bg-white/40" />
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Log in to download worksheet
      </a>
    );
  }

  return (
    <>
      {/* Shimmer download button */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-[#F5DA20] px-6 py-3.5 text-sm font-black text-black shadow-[0_0_0_2px_#F5DA20] transition-all duration-300 hover:shadow-[0_0_0_3px_#F5DA20,0_4px_20px_rgba(245,218,32,0.45)] hover:scale-[1.03] active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
      >
        <span className="shimmer-auto pointer-events-none absolute inset-0 w-1/3 skew-x-[-20deg] bg-white/50" />
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20"/></svg>
            Generating PDF…
          </>
        ) : (
          <>
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>
            Download Worksheet
          </>
        )}
      </button>

      {/* ─── Hidden A4 pages for PDF generation ─────────────────────── */}
      {/* PAGE 1 */}
      <div
        ref={page1Ref}
        style={{ position: "fixed", left: -9999, top: 0, width: PAGE_W, height: PAGE_H, backgroundColor: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        <Header tag="Worksheet" />

        <div style={{ flex: 1, padding: "28px 32px 0", display: "flex", flexDirection: "column" }}>
          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0f172a", fontFamily: "system-ui", margin: 0 }}>Phrasal Verbs</h1>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#64748b", fontFamily: "system-ui", margin: "4px 0 0" }}>Fill in the Blanks</p>
            <div style={{ width: 56, height: 4, backgroundColor: "#F5DA20", borderRadius: 4, marginTop: 10 }} />
          </div>

          {/* Word bank */}
          <div style={{ border: "2px dashed #94a3b8", borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0", padding: "8px 16px" }}>
              <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569", fontFamily: "system-ui" }}>Word Bank — use each verb once</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px" }}>
              {WORD_BANK.map((v) => (
                <span key={v} style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: "5px 12px", fontSize: 13, fontWeight: 700, color: "#334155", backgroundColor: "#fff", fontFamily: "system-ui" }}>
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <p style={{ fontSize: 12, fontStyle: "italic", color: "#64748b", fontFamily: "system-ui", marginBottom: 16 }}>
            Fill in each blank with the correct phrasal verb from the word bank above. Use each verb once. Change the form if necessary.
          </p>

          {/* Exercises */}
          <ol style={{ listStyle: "none", margin: 0, padding: 0, flex: 1 }}>
            {EXERCISES.map(({ before, after }, i) => (
              <li key={i} style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#475569", fontFamily: "system-ui", marginTop: 1 }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, color: "#1e293b", fontFamily: "system-ui", lineHeight: 1.6 }}>
                  {before}
                  <span style={{ display: "inline-block", width: 120, borderBottom: "2px solid #475569", verticalAlign: "bottom", marginLeft: 2, marginRight: 2 }} />
                  {after}
                </span>
              </li>
            ))}
          </ol>

          {/* Score */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 16px", backgroundColor: "#f8fafc", marginTop: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b", fontFamily: "system-ui" }}>
              Name: <span style={{ display: "inline-block", width: 160, borderBottom: "1px solid #94a3b8", verticalAlign: "bottom" }} />
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#334155", fontFamily: "system-ui" }}>Score: <strong>____ / 10</strong></span>
          </div>
        </div>

        <Footer page="Page 1 of 2" />
      </div>

      {/* PAGE 2 */}
      <div
        ref={page2Ref}
        style={{ position: "fixed", left: -9999, top: 0, width: PAGE_W, height: PAGE_H, backgroundColor: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        <Header tag="Answer Key" />

        <div style={{ flex: 1, padding: "28px 32px", overflowY: "hidden" }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16 }}>✓</span>
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", fontFamily: "system-ui", margin: 0 }}>Answer Key</h1>
              <p style={{ fontSize: 12, color: "#64748b", fontFamily: "system-ui", margin: "2px 0 0" }}>Phrasal Verbs — Fill in the Blanks · A1</p>
            </div>
          </div>
          <div style={{ width: 56, height: 4, backgroundColor: "#4ade80", borderRadius: 4, marginBottom: 20 }} />

          {/* Answers */}
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {EXERCISES.map(({ before, answer, after }, i) => (
              <li key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start", backgroundColor: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0", padding: "10px 14px" }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#475569", fontFamily: "system-ui", marginTop: 1 }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, color: "#1e293b", fontFamily: "system-ui", lineHeight: 1.6 }}>
                  {before}
                  <strong style={{ color: "#dc2626", fontFamily: "system-ui" }}>{answer}</strong>
                  {after}
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
