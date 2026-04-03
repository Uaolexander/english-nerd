"use client";

import { useState } from "react";
import { useIsPro } from "@/lib/ProContext";

function ProUpsellModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16 sm:pt-20"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#F5DA20] via-amber-400 to-[#F5DA20]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-slate-500 transition hover:bg-black/10"
          aria-label="Close"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="px-7 pb-8 pt-7">
          {/* Icon */}
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F5DA20] to-amber-500 shadow-lg shadow-[#F5DA20]/30">
            <svg className="h-7 w-7 text-amber-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black text-slate-900">PDF Worksheets</h2>
          <p className="mt-1 text-sm font-semibold text-amber-600">PRO Feature</p>

          {/* Description */}
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Download print-ready PDF worksheets with exercises and answer keys for every lesson — available exclusively for PRO members.
          </p>

          {/* Features */}
          <ul className="mt-4 space-y-2">
            {[
              "4 graded exercises per lesson",
              "Full answer key included",
              "Print-ready A4 format",
              "All Grammar A1 & A2 lessons",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F5DA20] text-[10px] font-black text-black">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="mt-7 flex flex-col gap-3">
            <a
              href="/pro"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F5DA20] to-amber-400 px-5 py-3.5 text-sm font-black text-black shadow-lg shadow-[#F5DA20]/25 transition hover:opacity-90"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
              </svg>
              Get PRO
            </a>
            <a
              href="/pro"
              className="flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-black/5"
            >
              Learn more about PRO
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PDFButton({
  onDownload,
  loading,
}: {
  onDownload: () => void;
  loading: boolean;
}) {
  const isPro = useIsPro();
  const [showModal, setShowModal] = useState(false);

  if (isPro) {
    return (
      <>
        <button
          onClick={onDownload}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl bg-[#F5DA20] px-3.5 py-2 text-sm font-black text-black transition hover:bg-[#ffe033] disabled:opacity-50"
        >
          {loading ? (
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          {loading ? "Generating…" : "PDF"}
        </button>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        title="Download PDF — Pro only"
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400 transition hover:border-[#F5DA20] hover:text-slate-600"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#F5DA20] text-[7px] font-black text-black">★</span>
      </button>

      {showModal && <ProUpsellModal onClose={() => setShowModal(false)} />}
    </>
  );
}
