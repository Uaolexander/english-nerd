"use client";

import { useCallback } from "react";

export type SaveResult = {
  ok: boolean;
  saved: boolean;
  isBest: boolean;
  message?: string;
};

/**
 * Detects category / level / slug from the current URL and saves
 * an exercise result to the user_progress table.
 *
 * URL patterns:
 *   /grammar/b1/past-continuous   → grammar, b1, past-continuous
 *   /tenses/present-simple/quiz   → tenses, null, present-simple
 *   /tests/grammar                → test, null, grammar
 *
 * Returns a SaveResult so the caller can optionally show feedback:
 *   { saved: true, isBest: true }                      → new best score saved
 *   { saved: false, message: "Your best result…" }     → existing score is better
 *   { saved: false, message: "Perfect score already…"} → already 100%
 */
export function useProgress() {
  const save = useCallback(
    async (exerciseNo: number | undefined, score: number, questionsTotal: number): Promise<SaveResult> => {
      if (typeof window === "undefined") return { ok: false, saved: false, isBest: false };

      const parts = window.location.pathname.split("/").filter(Boolean);
      if (!parts.length) return { ok: false, saved: false, isBest: false };

      const first = parts[0];
      let category: "grammar" | "tenses" | "test" | "vocabulary" = "grammar";
      let level: string | undefined;
      let slug: string;

      if (first === "grammar" && parts.length >= 3) {
        category = "grammar";
        level = parts[1];
        slug = parts[2];
      } else if (first === "tenses" && parts.length >= 2) {
        category = "tenses";
        slug = parts[1];
      } else if (first === "tests") {
        category = "test";
        slug = parts[1] ?? "general";
      } else if (first === "vocabulary") {
        category = "vocabulary";
        slug = parts[1] ?? "general";
      } else {
        return { ok: false, saved: false, isBest: false };
      }

      try {
        const res = await fetch("/api/progress/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, level, slug, exerciseNo, score, questionsTotal }),
        });
        if (!res.ok) return { ok: false, saved: false, isBest: false };
        return await res.json() as SaveResult;
      } catch {
        // Silent — never break lesson flow
        return { ok: false, saved: false, isBest: false };
      }
    },
    []
  );

  return { save };
}
