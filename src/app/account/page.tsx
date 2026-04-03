import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProStatus } from "@/lib/getProStatus";
import { getRecommendations } from "@/lib/getRecommendations";
import AccountClient from "./AccountClient";
import type { ProgressStats, CertificateRecord } from "./AccountClient";

const LEVEL_TOTALS: Record<string, number> = {
  a1: 76, a2: 80, b1: 84, b2: 72, c1: 72,
};
const TOTAL_EXERCISES = Object.values(LEVEL_TOTALS).reduce((a, b) => a + b, 0);

function computeStreak(dates: string[], freezeDates: string[] = []): number {
  if (!dates.length && !freezeDates.length) return 0;
  const days = Array.from(new Set([
    ...dates.map((d) => d.slice(0, 10)),
    ...freezeDates,
  ])).sort().reverse();
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
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    const iso = d.toISOString().slice(0, 10);
    result.push({ day: iso, label: dayNames[d.getDay()], count: dates.filter((x) => x.slice(0, 10) === iso).length });
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

export const metadata: Metadata = {
  title: "My Account — English Nerd",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all progress rows for this user
  const { data: rows } = await supabase
    .from("user_progress")
    .select("id, category, level, slug, exercise_no, score, questions_total, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(500);

  const progress = rows ?? [];

  // ── Aggregate stats ─────────────────────────────────────────────────
  const totalCompleted = progress.length;

  const avgScore = totalCompleted
    ? Math.round(progress.reduce((s, r) => s + r.score, 0) / totalCompleted)
    : null;

  // A topic is "mastered" if the best score on that topic is >= 80
  const topicBestScore: Record<string, number> = {};
  for (const r of progress) {
    const key = `${r.category}:${r.level ?? ""}:${r.slug}`;
    topicBestScore[key] = Math.max(topicBestScore[key] ?? 0, r.score);
  }
  const topicsMastered = Object.values(topicBestScore).filter((s) => s >= 80).length;

  // Recent activity — last 8 unique exercise completions
  const recentActivity = progress.slice(0, 8).map((r) => ({
    id: r.id,
    category: r.category as string,
    level: r.level as string | null,
    slug: r.slug as string,
    exercise_no: r.exercise_no as number | null,
    score: r.score as number,
    completed_at: r.completed_at as string,
  }));

  // By level stats (with pct for dashboard tab)
  const levelKeys = ["a1", "a2", "b1", "b2", "c1"] as const;
  const byLevel: ProgressStats["byLevel"] = {};
  for (const lvl of levelKeys) {
    const lvlRows = progress.filter((r) => r.level === lvl);
    const completed = lvlRows.length;
    byLevel[lvl] = {
      completed,
      avgScore: completed ? Math.round(lvlRows.reduce((s, r) => s + r.score, 0) / completed) : 0,
      pct: Math.min(Math.round((completed / (LEVEL_TOTALS[lvl] ?? 1)) * 100), 100),
    };
  }

  // Most recent score per test type (progress is ordered DESC so first = most recent)
  const testResults: ProgressStats["testResults"] = {};
  for (const r of progress) {
    if (r.category === "test") {
      const key = r.slug as "grammar" | "tenses" | "vocabulary";
      if (!(key in testResults)) testResults[key] = r.score;
    }
  }

  const stats: ProgressStats = {
    totalCompleted,
    avgScore,
    topicsMastered,
    recentActivity,
    byLevel,
    testResults,
  };

  // Dashboard stats
  const dates = progress.map((r) => r.completed_at as string);
  const weekly = weeklyActivity(dates);
  const maxWeekly = Math.max(...weekly.map((w) => w.count), 1);
  const overallPct = Math.round((totalCompleted / TOTAL_EXERCISES) * 100);
  const currentLevel: string | null =
    testResults.grammar !== undefined ? levelFromScore(testResults.grammar) : null;

  const recs = getRecommendations({
    totalCompleted,
    recentActivity: recentActivity.map((r) => ({ slug: r.slug })),
    byLevel,
    testResults,
  });

  // Pro status
  const { isPro, hadProBefore } = await getProStatus(supabase, user.id);

  // Streak freezes
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const monthlyLimit = isPro ? 7 : 2;
  let freezeDates: string[] = [];
  let freezeCount = 0;
  let canUseFreeze = false;

  const { data: freezeRows } = await supabase
    .from("streak_freezes")
    .select("protected_date")
    .eq("user_id", user.id)
    .order("protected_date", { ascending: false });
  if (freezeRows) {
    freezeDates = freezeRows.map((r) => r.protected_date as string);
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const usedThisMonth = freezeDates.filter((d) => d >= monthStart).length;
    freezeCount = Math.max(0, monthlyLimit - usedThisMonth);
  }
  const yesterdayHasActivity = dates.some((d) => d.slice(0, 10) === yesterday);
  const yesterdayHasFreeze = freezeDates.includes(yesterday);
  // Freeze only makes sense if there's a real streak to protect:
  // the day BEFORE yesterday must have activity or a freeze (so yesterday connects to it).
  const dayBeforeYesterday = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
  const hasStreakToProtect =
    dates.some((d) => d.slice(0, 10) === dayBeforeYesterday) ||
    freezeDates.includes(dayBeforeYesterday);
  canUseFreeze = !yesterdayHasActivity && !yesterdayHasFreeze && freezeCount > 0 && hasStreakToProtect;

  const streak = computeStreak(dates, freezeDates);

  // Fetch certificates
  const { data: certRows } = await supabase
    .from("certificates")
    .select("id, level, score_percent, score_correct, score_total, holder_name, issued_at")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  const certificates: CertificateRecord[] = (certRows ?? []).map((r) => ({
    id: r.id,
    level: r.level,
    scorePercent: r.score_percent,
    scoreCorrect: r.score_correct,
    scoreTotal: r.score_total,
    holderName: r.holder_name,
    issuedAt: r.issued_at,
  }));

  return (
    <AccountClient
      email={user.email ?? ""}
      fullName={user.user_metadata?.full_name ?? ""}
      avatarUrl={user.user_metadata?.avatar_url ?? ""}
      createdAt={user.created_at}
      provider={user.app_metadata?.provider ?? "email"}
      stats={stats}
      certificates={certificates}
      isPro={isPro}
      hadProBefore={hadProBefore}
      streak={streak}
      weekly={weekly}
      maxWeekly={maxWeekly}
      overallPct={overallPct}
      currentLevel={currentLevel}
      recs={recs}
      freezeCount={freezeCount}
      canUseFreeze={canUseFreeze}
    />
  );
}
