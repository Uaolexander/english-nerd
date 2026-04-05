import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

/**
 * GET /api/teacher/assignments/summaries
 * Returns completion counts for all assignments of this teacher.
 * { summaries: { [assignmentId]: { completedCount, unreviewedCount } } }
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const svc = createServiceClient();

  const [assignmentRes, studentRes] = await Promise.all([
    svc.from("teacher_assignments").select("id, category, level, slug, exercise_no").eq("teacher_id", user.id),
    svc.from("teacher_students").select("student_id").eq("teacher_id", user.id).eq("status", "active").not("student_id", "is", null),
  ]);

  const assignments = assignmentRes.data ?? [];
  const studentIds = (studentRes.data ?? []).map((r) => r.student_id as string);

  const summaries: Record<string, { completedCount: number; unreviewedCount: number }> = {};
  for (const a of assignments) {
    summaries[a.id] = { completedCount: 0, unreviewedCount: 0 };
  }

  if (assignments.length === 0) return NextResponse.json({ ok: true, summaries });

  // ── Essays ──────────────────────────────────────────────────────────────
  const essayIds = assignments.filter((a) => a.category === "essay").map((a) => a.id);
  if (essayIds.length > 0) {
    const conditions = studentIds.length > 0
      ? svc.from("essay_submissions").select("assignment_id, status").in("assignment_id", essayIds).in("student_id", studentIds)
      : svc.from("essay_submissions").select("assignment_id, status").in("assignment_id", essayIds);
    const { data: subs } = await conditions;
    for (const sub of subs ?? []) {
      summaries[sub.assignment_id as string].completedCount++;
      if (sub.status === "submitted") summaries[sub.assignment_id as string].unreviewedCount++;
    }
  }

  // ── Exercises ────────────────────────────────────────────────────────────
  const exerciseAssignments = assignments.filter((a) => a.category !== "essay");
  if (exerciseAssignments.length > 0 && studentIds.length > 0) {
    const { data: progressRows } = await svc
      .from("user_progress")
      .select("user_id, category, level, slug, exercise_no")
      .in("user_id", studentIds);

    // Map: "category|level|slug|exercise_no" → Set<userId>
    const completedByKey = new Map<string, Set<string>>();
    for (const p of progressRows ?? []) {
      const key = `${p.category}|${p.level ?? ""}|${p.slug}|${p.exercise_no ?? ""}`;
      if (!completedByKey.has(key)) completedByKey.set(key, new Set());
      completedByKey.get(key)!.add(p.user_id as string);
    }

    for (const a of exerciseAssignments) {
      const key = `${a.category}|${a.level ?? ""}|${a.slug}|${a.exercise_no ?? ""}`;
      const users = completedByKey.get(key);
      summaries[a.id].completedCount = users ? users.size : 0;
    }
  }

  return NextResponse.json({ ok: true, summaries });
}
