"use client";

import { useEffect, useState } from "react";
import type { SaveResult } from "@/lib/useProgress";

type Toast = { id: number; saved: boolean; message: string };

let nextId = 0;

export default function ProgressToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function onSaved(e: Event) {
      const result = (e as CustomEvent<SaveResult>).detail;

      let message: string;
      if (result.saved) {
        message = "Progress saved.";
      } else if (result.message) {
        message = result.message;
      } else {
        return; // no feedback for silent failures (e.g. unauthenticated)
      }

      const id = ++nextId;
      setToasts((prev) => [...prev, { id, saved: result.saved, message }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    }

    window.addEventListener("progress-saved", onSaved);
    return () => window.removeEventListener("progress-saved", onSaved);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-[72px] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none lg:bottom-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-sm font-semibold shadow-lg backdrop-blur-sm transition-all animate-fade-in
            ${t.saved
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
              : "border-amber-200 bg-amber-50/95 text-amber-800"
            }`}
        >
          {t.saved
            ? <svg className="h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg className="h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          }
          {t.message}
        </div>
      ))}
    </div>
  );
}
