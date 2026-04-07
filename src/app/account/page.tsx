import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getProStatus } from "@/lib/getProStatus";
import { getTeacherStatus } from "@/lib/getTeacherStatus";
import { getStudentStatus } from "@/lib/getStudentStatus";
import { getRecommendations } from "@/lib/getRecommendations";
import AccountClient from "./AccountClient";
import type { ProgressStats, CertificateRecord, TeacherData, StudentAssignment } from "./AccountClient";
import type { WeakTopic } from "./DashboardTab";

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

  // Weak topics — attempted topics with best score < 70%, sorted worst first
  const weakTopics: WeakTopic[] = Object.entries(topicBestScore)
    .filter(([, score]) => score < 70)
    .map(([key, bestScore]) => {
      const [category, level, slug] = key.split(":");
      return {
        category,
        level: level || null,
        slug,
        bestScore,
        href: `/${category}${level ? `/${level}` : ""}/${slug}`,
      };
    })
    .sort((a, b) => a.bestScore - b.bestScore)
    .slice(0, 8);

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
  const { isPro, hadProBefore, expiresAt } = await getProStatus(supabase, user.id);

  // Streak freezes (PRO-only feature)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const monthlyLimit = 7; // PRO users get 7 freezes per month
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
    if (isPro) {
      const now = new Date();
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      const usedThisMonth = freezeDates.filter((d) => d >= monthStart).length;
      freezeCount = Math.max(0, monthlyLimit - usedThisMonth);
    }
  }
  const yesterdayHasActivity = dates.some((d) => d.slice(0, 10) === yesterday);
  const yesterdayHasFreeze = freezeDates.includes(yesterday);
  // Freeze only makes sense if there's a real streak to protect:
  // the day BEFORE yesterday must have activity or a freeze (so yesterday connects to it).
  const dayBeforeYesterday = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
  const hasStreakToProtect =
    dates.some((d) => d.slice(0, 10) === dayBeforeYesterday) ||
    freezeDates.includes(dayBeforeYesterday);
  canUseFreeze = isPro && !yesterdayHasActivity && !yesterdayHasFreeze && freezeCount > 0 && hasStreakToProtect;

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

  // ── Teacher data ────────────────────────────────────────────────────────
  const teacherStatus = await getTeacherStatus(supabase, user.id);
  let teacherData: TeacherData | null = null;

  if (teacherStatus.isTeacher) {
    const [studentLinksRes, classesRes, assignmentsRes] = await Promise.all([
      supabase.from("teacher_students").select("id, student_id, invite_email, status, joined_at, invite_token, nickname").eq("teacher_id", user.id).neq("status", "removed").order("invited_at", { ascending: false }),
      supabase.from("teacher_classes").select("id, name, description, created_at, emoji, class_members(student_id)").eq("teacher_id", user.id).order("created_at", { ascending: false }),
      supabase.from("teacher_assignments").select("id, title, category, level, slug, exercise_no, due_date, prompt, min_words, created_at, assignment_targets(student_id, class_id)").eq("teacher_id", user.id).order("created_at", { ascending: false }),
    ]);

    const activeStudentIds = (studentLinksRes.data ?? []).filter((s) => s.status === "active" && s.student_id).map((s) => s.student_id as string);
    const pendingStudentIds = (studentLinksRes.data ?? []).filter((s) => s.status === "pending_student" && s.student_id).map((s) => s.student_id as string);
    const allKnownStudentIds = Array.from(new Set([...activeStudentIds, ...pendingStudentIds]));
    let progressByStudent: Record<string, { total: number; avg: number | null; last: string | null }> = {};
    let profileByStudent: Record<string, { name: string; avatarUrl: string }> = {};
    if (allKnownStudentIds.length > 0) {
      const serviceClient = createServiceClient();
      const [pRowsRes, profileResults] = await Promise.all([
        activeStudentIds.length > 0
          ? supabase.from("user_progress").select("user_id, score, completed_at").in("user_id", activeStudentIds)
          : Promise.resolve({ data: [] }),
        Promise.all(allKnownStudentIds.map((id) => serviceClient.auth.admin.getUserById(id))),
      ]);
      for (const sid of activeStudentIds) {
        const rows = (pRowsRes.data ?? []).filter((r) => r.user_id === sid);
        const total = rows.length;
        const avg = total ? Math.round(rows.reduce((s, r) => s + r.score, 0) / total) : null;
        const last = rows.length ? rows.sort((a, b) => b.completed_at.localeCompare(a.completed_at))[0].completed_at : null;
        progressByStudent[sid] = { total, avg, last };
      }
      for (const { data } of profileResults) {
        if (data?.user) {
          const m = data.user.user_metadata ?? {};
          profileByStudent[data.user.id] = {
            name: (m.full_name ?? m.name ?? "") as string,
            avatarUrl: (m.avatar_url ?? m.picture ?? "") as string,
          };
        }
      }
    }

    teacherData = {
      plan: teacherStatus.plan!,
      studentLimit: teacherStatus.studentLimit,
      isInGracePeriod: teacherStatus.isInGracePeriod,
      subscriptionExpiresAt: teacherStatus.subscriptionExpiresAt,
      students: (studentLinksRes.data ?? []).map((s) => ({
        linkId: s.id, studentId: s.student_id, email: s.invite_email,
        status: s.status as "pending" | "active" | "pending_student", joinedAt: s.joined_at, inviteToken: s.invite_token,
        totalCompleted: s.student_id ? (progressByStudent[s.student_id]?.total ?? 0) : 0,
        avgScore: s.student_id ? (progressByStudent[s.student_id]?.avg ?? null) : null,
        lastActivity: s.student_id ? (progressByStudent[s.student_id]?.last ?? null) : null,
        nickname: s.nickname as string | null,
        notes: null, // requires DB migration: ALTER TABLE teacher_students ADD COLUMN notes TEXT;
        studentName: s.student_id ? (profileByStudent[s.student_id]?.name || null) : null,
        studentAvatarUrl: s.student_id ? (profileByStudent[s.student_id]?.avatarUrl || null) : null,
      })),
      classes: (classesRes.data ?? []).map((c) => ({
        id: c.id, name: c.name, description: c.description, emoji: (c.emoji as string | null) ?? "📚", createdAt: c.created_at,
        memberIds: (c.class_members as { student_id: string }[]).map((m) => m.student_id),
      })),
      assignments: (assignmentsRes.data ?? []).map((a) => ({
        id: a.id, title: a.title, category: a.category, level: a.level, slug: a.slug,
        exerciseNo: a.exercise_no, dueDate: a.due_date, prompt: a.prompt as string | null, minWords: a.min_words as number | null, createdAt: a.created_at,
        targetStudentIds: (a.assignment_targets as { student_id: string | null; class_id: string | null }[]).filter((t) => t.student_id).map((t) => t.student_id as string),
        targetClassIds: (a.assignment_targets as { student_id: string | null; class_id: string | null }[]).filter((t) => t.class_id).map((t) => t.class_id as string),
      })),
    };
  }

  // ── Student status + teacher validity check ────────────────────────────
  const svcClient = createServiceClient();
  const studentStatus = await getStudentStatus(svcClient, user.id);
  let effectiveIsStudent = studentStatus.isStudent;
  let teacherInfo: { name: string; email: string; avatarUrl: string; linkId: string } | null = null;
  let pendingTeacherInvite: { linkId: string; teacherName: string; teacherEmail: string; teacherAvatarUrl: string } | null = null;
  let validTeacherIds: string[] = [];

  // Check for pending teacher invites (student must confirm)
  if (studentStatus.pendingLinks.length > 0) {
    const firstPending = studentStatus.pendingLinks[0];
    const { data: pendingTeacherUser } = await svcClient.auth.admin.getUserById(firstPending.teacherId);
    if (pendingTeacherUser?.user) {
      const m = pendingTeacherUser.user.user_metadata ?? {};
      pendingTeacherInvite = {
        linkId: firstPending.linkId,
        teacherName: (m.full_name ?? m.name ?? "") as string,
        teacherEmail: pendingTeacherUser.user.email ?? "",
        teacherAvatarUrl: (m.avatar_url ?? m.picture ?? "") as string,
      };
    }
  }

  if (studentStatus.isStudent && studentStatus.teacherIds.length > 0) {
    const { data: teacherProfiles } = await svcClient
      .from("teacher_profiles")
      .select("user_id, is_active, subscription_expires_at")
      .in("user_id", studentStatus.teacherIds);

    const nowMs = Date.now();
    validTeacherIds = (teacherProfiles ?? [])
      .filter((p) => {
        if (p.is_active) return true;
        if (p.subscription_expires_at) {
          return nowMs < new Date(p.subscription_expires_at).getTime() + 7 * 86_400_000;
        }
        return false;
      })
      .map((p) => p.user_id as string);

    effectiveIsStudent = validTeacherIds.length > 0;

    if (validTeacherIds.length > 0) {
      const teacherId = validTeacherIds[0];
      const { data: teacherUser } = await svcClient.auth.admin.getUserById(teacherId);
      if (teacherUser?.user) {
        const m = teacherUser.user.user_metadata ?? {};
        teacherInfo = {
          name: ((m.full_name ?? m.name ?? "") as string),
          email: teacherUser.user.email ?? "",
          avatarUrl: ((m.avatar_url ?? m.picture ?? "") as string),
          linkId: studentStatus.activeLinkByTeacher[teacherId] ?? "",
        };
      }
    }
  }

  let studentAssignments: StudentAssignment[] = [];

  if (effectiveIsStudent) {
    // Use service client to bypass RLS on assignment_targets and class_members
    const svc = createServiceClient();

    const [classMemberRows, directTargets] = await Promise.all([
      svc.from("class_members").select("class_id").eq("student_id", user.id),
      svc.from("assignment_targets").select("assignment_id").eq("student_id", user.id),
    ]);
    const myClassIds = (classMemberRows.data ?? []).map((r) => r.class_id as string);
    const directAssignmentIds = (directTargets.data ?? []).map((r) => r.assignment_id as string);

    let classAssignmentIds: string[] = [];
    if (myClassIds.length > 0) {
      const { data: classTargets } = await svc.from("assignment_targets").select("assignment_id").in("class_id", myClassIds);
      classAssignmentIds = (classTargets ?? []).map((r) => r.assignment_id as string);
    }

    // "Everyone" assignments: from valid teachers with no targets
    let everyoneAssignmentIds: string[] = [];
    if (validTeacherIds.length > 0) {
      const { data: teacherAssignRows } = await svc
        .from("teacher_assignments").select("id").in("teacher_id", validTeacherIds);
      const allTeacherIds = (teacherAssignRows ?? []).map((r) => r.id as string);
      if (allTeacherIds.length > 0) {
        const { data: targetedRows } = await svc
          .from("assignment_targets").select("assignment_id").in("assignment_id", allTeacherIds);
        const targetedSet = new Set((targetedRows ?? []).map((r) => r.assignment_id as string));
        everyoneAssignmentIds = allTeacherIds.filter((id) => !targetedSet.has(id));
      }
    }

    const allAssignmentIds = Array.from(new Set([...directAssignmentIds, ...classAssignmentIds, ...everyoneAssignmentIds]));
    if (allAssignmentIds.length > 0) {
      const [aRes, essaySubsRes] = await Promise.all([
        svc.from("teacher_assignments").select("id, title, category, level, slug, exercise_no, due_date, prompt, min_words, created_at").in("id", allAssignmentIds).order("created_at", { ascending: false }),
        svc.from("essay_submissions").select("assignment_id, status, teacher_feedback, teacher_grade").eq("student_id", user.id).in("assignment_id", allAssignmentIds),
      ]);
      const essaySubMap = new Map((essaySubsRes.data ?? []).map((s) => [s.assignment_id as string, s]));
      studentAssignments = (aRes.data ?? []).map((a) => {
        const sub = essaySubMap.get(a.id);
        return {
          id: a.id, title: a.title, category: a.category, level: a.level,
          slug: a.slug, exerciseNo: a.exercise_no, dueDate: a.due_date,
          prompt: a.prompt as string | null, minWords: a.min_words as number | null,
          essayStatus: sub ? (sub.status as "submitted" | "reviewed") : null,
          essayGrade: sub?.teacher_grade as string | null ?? null,
          essayFeedback: sub?.teacher_feedback as string | null ?? null,
        };
      });
    }
  }

  const completedExerciseKeys = progress.map((r) =>
    `${r.category}:${r.level ?? ""}:${r.slug}:${r.exercise_no ?? ""}`
  );

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    (user.identities ?? []).find((id) => id.provider === "google")?.identity_data?.avatar_url ||
    (user.identities ?? []).find((id) => id.provider === "google")?.identity_data?.picture ||
    (user.identities ?? [])[0]?.identity_data?.avatar_url ||
    (user.identities ?? [])[0]?.identity_data?.picture ||
    "";

  return (
    <AccountClient
      email={user.email ?? ""}
      fullName={user.user_metadata?.full_name ?? ""}
      avatarUrl={avatarUrl}
      createdAt={user.created_at}
      provider={user.app_metadata?.provider ?? "email"}
      stats={stats}
      certificates={certificates}
      isPro={isPro && !effectiveIsStudent && !teacherStatus.isTeacher}
      hadProBefore={hadProBefore}
      isTeacher={teacherStatus.isTeacher}
      teacherData={teacherData}
      isStudent={effectiveIsStudent}
      teacherInfo={teacherInfo}
      pendingTeacherInvite={pendingTeacherInvite}
      studentAssignments={studentAssignments}
      completedExerciseKeys={completedExerciseKeys}
      streak={streak}
      weekly={weekly}
      maxWeekly={maxWeekly}
      overallPct={overallPct}
      currentLevel={currentLevel}
      recs={recs}
      freezeCount={freezeCount}
      canUseFreeze={canUseFreeze}
      weakTopics={weakTopics}
      proExpiresAt={expiresAt ?? null}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ""}
    />
  );
}
