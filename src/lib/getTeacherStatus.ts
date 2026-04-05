import type { SupabaseClient } from "@supabase/supabase-js";

export interface TeacherStatus {
  isTeacher: boolean;
  plan: "starter" | "solo" | "plus" | null;
  studentLimit: number;
  activeStudentCount: number;
  isActive: boolean;
  /** True when subscription expired but within 7-day grace period — dashboard still accessible */
  isInGracePeriod: boolean;
  subscriptionExpiresAt: string | null;
}

export async function getTeacherStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<TeacherStatus> {
  const { data: profile } = await supabase
    .from("teacher_profiles")
    .select("plan, student_limit, is_active, subscription_expires_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile) {
    return { isTeacher: false, plan: null, studentLimit: 0, activeStudentCount: 0, isActive: false, isInGracePeriod: false, subscriptionExpiresAt: null };
  }

  const now = Date.now();
  // Grace period = 7 days after subscription_expires_at
  const gracePeriodEnd = profile.subscription_expires_at
    ? new Date(profile.subscription_expires_at).getTime() + 7 * 24 * 60 * 60 * 1000
    : null;
  const inGracePeriod = !profile.is_active && gracePeriodEnd !== null && now < gracePeriodEnd;

  if (!profile.is_active && !inGracePeriod) {
    // Subscription fully expired (past grace period) — data preserved, dashboard locked
    return { isTeacher: false, plan: profile.plan as "starter" | "solo" | "plus", studentLimit: 0, activeStudentCount: 0, isActive: false, isInGracePeriod: false, subscriptionExpiresAt: profile.subscription_expires_at };
  }

  const { count } = await supabase
    .from("teacher_students")
    .select("id", { count: "exact", head: true })
    .eq("teacher_id", userId)
    .eq("status", "active");

  return {
    isTeacher: true,
    plan: profile.plan as "starter" | "solo" | "plus",
    studentLimit: profile.student_limit,
    activeStudentCount: count ?? 0,
    isActive: profile.is_active,
    isInGracePeriod: inGracePeriod,
    subscriptionExpiresAt: profile.subscription_expires_at,
  };
}
