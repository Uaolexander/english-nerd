import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

/**
 * GET /api/teacher/activity
 * Returns the 30 most recent student activities for this teacher's students.
 * Activity = exercise completion OR essay submission.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const svc = createServiceClient();

  // Get active students
  const { data: studentRows } = await svc
    .from("teacher_students")
    .select("student_id, nickname, student_id")
    .eq("teacher_id", user.id)
    .eq("status", "active")
    .not("student_id", "is", null);

  const studentIds = (studentRows ?? []).map((r) => r.student_id as string);
  if (studentIds.length === 0) return NextResponse.json({ ok: true, activities: [] });

  // Get profiles for student names/avatars
  const { data: profiles } = await svc
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", studentIds);
  const profileMap = new Map((profiles ?? []).map((p) => [p.id as string, p]));

  // Build nickname map
  const nicknameMap = new Map((studentRows ?? []).map((r) => [r.student_id as string, r.nickname as string | null]));

  const [progressRes, essayRes, assignmentRes] = await Promise.all([
    svc
      .from("user_progress")
      .select("id, user_id, category, level, slug, exercise_no, score, completed_at")
      .in("user_id", studentIds)
      .order("completed_at", { ascending: false })
      .limit(50),
    svc
      .from("essay_submissions")
      .select("id, student_id, assignment_id, status, submitted_at, feedback_at")
      .in("student_id", studentIds)
      .order("submitted_at", { ascending: false })
      .limit(30),
    svc
      .from("teacher_assignments")
      .select("id, title")
      .eq("teacher_id", user.id),
  ]);

  const assignmentTitleMap = new Map((assignmentRes.data ?? []).map((a) => [a.id as string, a.title as string]));

  type Activity = {
    id: string;
    type: "exercise" | "essay_submitted" | "essay_reviewed";
    studentId: string;
    studentName: string;
    studentAvatar: string | null;
    title: string;
    score: number | null;
    time: string;
  };

  const activities: Activity[] = [];

  for (const p of progressRes.data ?? []) {
    const profile = profileMap.get(p.user_id as string);
    const nickname = nicknameMap.get(p.user_id as string);
    const name = nickname || profile?.full_name || "Student";
    const slug = p.slug as string;
    const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    activities.push({
      id: `ex-${p.id}`,
      type: "exercise",
      studentId: p.user_id as string,
      studentName: name,
      studentAvatar: profile?.avatar_url ?? null,
      title: `${title}${p.exercise_no ? ` · Ex. ${p.exercise_no}` : ""}`,
      score: p.score as number,
      time: p.completed_at as string,
    });
  }

  for (const e of essayRes.data ?? []) {
    // Skip essays for assignments that no longer exist (deleted)
    if (!assignmentTitleMap.has(e.assignment_id as string)) continue;

    const profile = profileMap.get(e.student_id as string);
    const nickname = nicknameMap.get(e.student_id as string);
    const name = nickname || profile?.full_name || "Student";
    const assignTitle = assignmentTitleMap.get(e.assignment_id as string)!;

    if (e.status === "reviewed" && e.feedback_at) {
      activities.push({
        id: `essay-reviewed-${e.id}`,
        type: "essay_reviewed",
        studentId: e.student_id as string,
        studentName: name,
        studentAvatar: profile?.avatar_url ?? null,
        title: assignTitle,
        score: null,
        time: e.feedback_at as string,
      });
    }
    activities.push({
      id: `essay-sub-${e.id}`,
      type: "essay_submitted",
      studentId: e.student_id as string,
      studentName: name,
      studentAvatar: profile?.avatar_url ?? null,
      title: assignTitle,
      score: null,
      time: e.submitted_at as string,
    });
  }

  activities.sort((a, b) => b.time.localeCompare(a.time));

  return NextResponse.json({ ok: true, activities: activities.slice(0, 30) });
}
