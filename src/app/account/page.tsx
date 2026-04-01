import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import AccountClient from "./AccountClient";
import type { ProgressStats, CertificateRecord } from "./AccountClient";

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

  // By level stats
  const levelKeys = ["a1", "a2", "b1", "b2", "c1"] as const;
  const byLevel: ProgressStats["byLevel"] = {};
  for (const lvl of levelKeys) {
    const lvlRows = progress.filter((r) => r.level === lvl);
    byLevel[lvl] = {
      completed: lvlRows.length,
      avgScore: lvlRows.length
        ? Math.round(lvlRows.reduce((s, r) => s + r.score, 0) / lvlRows.length)
        : 0,
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

  // Pro status — source of truth is subscriptions table
  console.log("[account/page] user.id:", user.id);
  console.log("[account/page] user.email:", user.email);
  const isPro = await getIsPro(supabase, user.id);
  console.log("[account/page] isPro result:", isPro);

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
    />
  );
}
