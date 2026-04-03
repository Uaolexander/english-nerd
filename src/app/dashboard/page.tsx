import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import { getRecommendations } from "@/lib/getRecommendations";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — English Nerd Pro",
  robots: { index: false },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function computeStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const days = Array.from(new Set(dates.map((d) => d.slice(0, 10)))).sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  if (days[0] !== today && days[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round(
      (new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / 86_400_000
    );
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function weeklyActivity(dates: string[]): { day: string; label: string; count: number }[] {
  const result = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    const iso = d.toISOString().slice(0, 10);
    const count = dates.filter((x) => x.slice(0, 10) === iso).length;
    result.push({ day: iso, label: dayNames[d.getDay()], count });
  }
  return result;
}

function levelFromScore(score: number): string {
  if (score >= 90) return "C1";
  if (score >= 75) return "B2";
  if (score >= 60) return "B1";
  if (score >= 40) return "A2";
  return "A1";
}

const LEVEL_TOTALS: Record<string, number> = {
  a1: 76, a2: 80, b1: 84, b2: 72, c1: 72,
};

const TOTAL_EXERCISES = Object.values(LEVEL_TOTALS).reduce((a, b) => a + b, 0);

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const isPro = await getIsPro(supabase, user.id);

  const { data: rows } = await supabase
    .from("user_progress")
    .select("category, level, slug, score, questions_total, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(500);

  const progress = rows ?? [];

  // ── Compute stats ────────────────────────────────────────────────────────
  const dates = progress.map((r) => r.completed_at as string);
  const streak = computeStreak(dates);
  const weekly = weeklyActivity(dates);
  const maxWeekly = Math.max(...weekly.map((w) => w.count), 1);

  const totalCompleted = progress.length;
  const avgScore = totalCompleted
    ? Math.round(progress.reduce((s, r) => s + (r.score as number), 0) / totalCompleted)
    : 0;

  const topicBestScore: Record<string, number> = {};
  for (const r of progress) {
    const key = `${r.category}:${r.level ?? ""}:${r.slug}`;
    topicBestScore[key] = Math.max(topicBestScore[key] ?? 0, r.score as number);
  }
  const topicsMastered = Object.values(topicBestScore).filter((s) => s >= 80).length;

  const levelKeys = ["a1", "a2", "b1", "b2", "c1"] as const;
  const byLevel: Record<string, { completed: number; avgScore: number; pct: number }> = {};
  for (const lvl of levelKeys) {
    const lvlRows = progress.filter((r) => r.level === lvl);
    const completed = lvlRows.length;
    const avg = completed
      ? Math.round(lvlRows.reduce((s, r) => s + (r.score as number), 0) / completed)
      : 0;
    const pct = Math.round((completed / (LEVEL_TOTALS[lvl] ?? 1)) * 100);
    byLevel[lvl] = { completed, avgScore: avg, pct: Math.min(pct, 100) };
  }

  const overallPct = Math.round((totalCompleted / TOTAL_EXERCISES) * 100);

  const recentActivity = progress.slice(0, 6).map((r) => ({
    category: r.category as string,
    level: r.level as string | null,
    slug: r.slug as string,
    score: r.score as number,
    completed_at: r.completed_at as string,
  }));

  const testResults: { grammar?: number; tenses?: number; vocabulary?: number } = {};
  for (const r of progress) {
    if (r.category === "test") {
      const key = r.slug as "grammar" | "tenses" | "vocabulary";
      if (!(key in testResults)) testResults[key] = r.score as number;
    }
  }

  // Current level is derived only from the grammar test result.
  // null means the user hasn't taken the test yet.
  const currentLevel: string | null =
    testResults.grammar !== undefined ? levelFromScore(testResults.grammar) : null;

  const recs = getRecommendations({
    totalCompleted,
    recentActivity: recentActivity.map((r) => ({ slug: r.slug })),
    byLevel,
    testResults,
  });

  const name = (user.user_metadata?.full_name as string | undefined) ?? "";
  const firstName = name.split(" ")[0] || user.email?.split("@")[0] || "Learner";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <DashboardClient
      firstName={firstName}
      email={user.email ?? ""}
      greeting={greeting}
      isPro={isPro}
      streak={streak}
      totalCompleted={totalCompleted}
      avgScore={avgScore}
      topicsMastered={topicsMastered}
      overallPct={overallPct}
      currentLevel={currentLevel}
      byLevel={byLevel}
      weekly={weekly}
      maxWeekly={maxWeekly}
      recentActivity={recentActivity}
      recs={recs}
      createdAt={user.created_at}
    />
  );
}
