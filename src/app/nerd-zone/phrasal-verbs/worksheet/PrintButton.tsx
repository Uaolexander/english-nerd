"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black shadow-md hover:opacity-90 transition print:hidden"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 9V2h12v7" /><rect x="6" y="14" width="12" height="8" rx="1" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      </svg>
      Print / Save as PDF
    </button>
  );
}
