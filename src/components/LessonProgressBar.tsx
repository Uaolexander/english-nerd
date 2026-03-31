"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

type ExerciseResult = { exerciseNo: number | null; score: number; completedAt: string };

type LessonInfo =
  | { type: "grammar"; category: "grammar"; level: string; slug: string }
  | { type: "tenses"; category: "tenses"; level: null; slug: string };

function parsePath(pathname: string): LessonInfo | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "grammar" && parts.length === 3) {
    return { type: "grammar", category: "grammar", level: parts[1], slug: parts[2] };
  }
  if (parts[0] === "tenses" && parts.length === 2) {
    return { type: "tenses", category: "tenses", level: null, slug: parts[1] };
  }
  return null;
}

function scoreColor(score: number) {
  if (score === 100) return "text-emerald-600";
  if (score >= 80) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-400";
}

function circleBg(score: number) {
  if (score === 100) return "bg-emerald-500 border-emerald-500";
  if (score >= 80)   return "bg-emerald-400 border-emerald-400";
  if (score >= 50)   return "bg-amber-400 border-amber-400";
  return "bg-red-400 border-red-400";
}

export default function LessonProgressBar() {
  const pathname = usePathname();
  const [exercises, setExercises] = useState<ExerciseResult[]>([]);
  const [visible, setVisible] = useState(false);

  const lesson = parsePath(pathname);

  const fetchProgress = useCallback(async () => {
    if (!lesson) { setExercises([]); return; }
    const params = new URLSearchParams({ category: lesson.category, slug: lesson.slug });
    if (lesson.level) params.set("level", lesson.level);
    const res = await fetch(`/api/progress/lesson?${params}`);
    if (!res.ok) return;
    const data = await res.json() as { exercises: ExerciseResult[] };
    setExercises(data.exercises);
  }, [lesson?.category, lesson?.level, lesson?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch on lesson change
  useEffect(() => {
    if (!lesson) { setExercises([]); setVisible(false); return; }
    fetchProgress();
    // Small delay before showing so it doesn't flash on first load
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh when an exercise is saved
  useEffect(() => {
    window.addEventListener("progress-saved", fetchProgress);
    return () => window.removeEventListener("progress-saved", fetchProgress);
  }, [fetchProgress]);

  if (!lesson || !visible) return null;

  const totalExercises = 4;
  const doneCount = exercises.filter((e) => e.exerciseNo !== null).length;
  const allDone = doneCount === totalExercises;
  const progressPct = Math.round((doneCount / totalExercises) * 100);

  return (
    <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 animate-fade-in">
      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-[#0B0B0D]/90 px-4 py-3 shadow-2xl backdrop-blur-md">

        {/* Label */}
        <div className="hidden sm:flex flex-col leading-none mr-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Lesson</span>
          <span className="mt-0.5 text-xs font-bold text-white/60">
            {allDone ? "Complete! 🎉" : `${doneCount}/4 done`}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-white/10" />

        {/* Exercise circles */}
        {Array.from({ length: totalExercises }, (_, i) => {
          const no = i + 1;
          const result = exercises.find((e) => e.exerciseNo === no);
          const done = !!result;
          const perfect = result?.score === 100;

          return (
            <div key={no} className="flex flex-col items-center gap-1">
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-black transition-all duration-300
                  ${done
                    ? `${circleBg(result.score)} text-white shadow-md`
                    : "border-white/15 bg-white/5 text-white/30"
                  }`}
              >
                {done ? (
                  perfect ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )
                ) : (
                  no
                )}
                {/* Pulse ring for the next exercise to do */}
                {!done && no === doneCount + 1 && (
                  <span className="absolute inset-0 rounded-full border-2 border-[#F5DA20]/60 animate-ping opacity-50" />
                )}
              </div>
              {/* Score label */}
              <span className={`text-[9px] font-black tabular-nums leading-none ${done ? scoreColor(result.score) : "text-white/15"}`}>
                {done ? `${result.score}%` : "—"}
              </span>
            </div>
          );
        })}

        {/* Progress bar */}
        <div className="hidden sm:flex flex-col gap-1 ml-1 min-w-[48px]">
          <div className="h-1.5 w-12 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ${allDone ? "bg-emerald-400" : "bg-[#F5DA20]"}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[9px] font-bold text-white/25 tabular-nums">{progressPct}%</span>
        </div>

      </div>
    </div>
  );
}
