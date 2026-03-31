"use client";

import { useCallback } from "react";

/**
 * Detects category / level / slug from the current URL and saves
 * an exercise result to the user_progress table.
 *
 * URL patterns:
 *   /grammar/b1/past-continuous   → grammar, b1, past-continuous
 *   /tenses/present-simple/quiz   → tenses, null, present-simple
 *   /tests/grammar                → test, null, grammar
 */
export function useProgress() {
  const save = useCallback(
    async (exerciseNo: number | undefined, score: number, questionsTotal: number) => {
      if (typeof window === "undefined") return;

      const parts = window.location.pathname.split("/").filter(Boolean);
      if (!parts.length) return;

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
        return; // unknown route, skip
      }

      try {
        await fetch("/api/progress/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, level, slug, exerciseNo, score, questionsTotal }),
        });
      } catch {
        // Silent — never break lesson flow
      }
    },
    []
  );

  return { save };
}
