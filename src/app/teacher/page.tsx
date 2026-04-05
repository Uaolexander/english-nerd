import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTeacherStatus } from "@/lib/getTeacherStatus";
import TeacherDashboard from "./TeacherDashboard";

export const metadata: Metadata = {
  title: "Teacher Dashboard — English Nerd",
};

export type StudentRow = {
  linkId: string;
  studentId: string | null;
  email: string;
  status: "pending" | "active";
  joinedAt: string | null;
  inviteToken: string;
  totalCompleted: number;
  avgScore: number | null;
  lastActivity: string | null;
};

export type ClassRow = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  memberIds: string[];
};

export type AssignmentRow = {
  id: string;
  title: string;
  category: string;
  level: string | null;
  slug: string;
  exerciseNo: number | null;
  dueDate: string | null;
  createdAt: string;
  targetStudentIds: string[];
  targetClassIds: string[];
};

export default async function TeacherPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const teacher = await getTeacherStatus(supabase, user.id);
  // If never had teacher profile at all — redirect
  if (!teacher.isTeacher && !teacher.plan) redirect("/account");
  // If had teacher but fully expired (past grace period) — show expired page
  if (!teacher.isTeacher && teacher.plan) redirect("/teacher/expired");

  // ── Fetch students ──────────────────────────────────────────────────────
  const { data: studentLinks } = await supabase
    .from("teacher_students")
    .select("id, student_id, invite_email, status, joined_at, invite_token")
    .eq("teacher_id", user.id)
    .neq("status", "removed")
    .order("invited_at", { ascending: false });

  const activeStudentIds = (studentLinks ?? [])
    .filter((s) => s.status === "active" && s.student_id)
    .map((s) => s.student_id as string);

  // Fetch progress summary for all active students
  let progressByStudent: Record<string, { total: number; avg: number | null; last: string | null }> = {};

  if (activeStudentIds.length > 0) {
    const { data: progressRows } = await supabase
      .from("user_progress")
      .select("user_id, score, completed_at")
      .in("user_id", activeStudentIds);

    for (const sid of activeStudentIds) {
      const rows = (progressRows ?? []).filter((r) => r.user_id === sid);
      const total = rows.length;
      const avg = total ? Math.round(rows.reduce((s, r) => s + r.score, 0) / total) : null;
      const last = rows.length ? rows.sort((a, b) => b.completed_at.localeCompare(a.completed_at))[0].completed_at : null;
      progressByStudent[sid] = { total, avg, last };
    }
  }

  const students: StudentRow[] = (studentLinks ?? []).map((s) => ({
    linkId: s.id,
    studentId: s.student_id,
    email: s.invite_email,
    status: s.status as "pending" | "active",
    joinedAt: s.joined_at,
    inviteToken: s.invite_token,
    totalCompleted: s.student_id ? (progressByStudent[s.student_id]?.total ?? 0) : 0,
    avgScore: s.student_id ? (progressByStudent[s.student_id]?.avg ?? null) : null,
    lastActivity: s.student_id ? (progressByStudent[s.student_id]?.last ?? null) : null,
  }));

  // ── Fetch classes ───────────────────────────────────────────────────────
  const { data: classRows } = await supabase
    .from("teacher_classes")
    .select("id, name, description, created_at, class_members(student_id)")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  const classes: ClassRow[] = (classRows ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    createdAt: c.created_at,
    memberIds: (c.class_members as { student_id: string }[]).map((m) => m.student_id),
  }));

  // ── Fetch assignments ───────────────────────────────────────────────────
  const { data: assignmentRows } = await supabase
    .from("teacher_assignments")
    .select("id, title, category, level, slug, exercise_no, due_date, created_at, assignment_targets(student_id, class_id)")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  const assignments: AssignmentRow[] = (assignmentRows ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    level: a.level,
    slug: a.slug,
    exerciseNo: a.exercise_no,
    dueDate: a.due_date,
    createdAt: a.created_at,
    targetStudentIds: (a.assignment_targets as { student_id: string | null; class_id: string | null }[])
      .filter((t) => t.student_id).map((t) => t.student_id as string),
    targetClassIds: (a.assignment_targets as { student_id: string | null; class_id: string | null }[])
      .filter((t) => t.class_id).map((t) => t.class_id as string),
  }));

  return (
    <TeacherDashboard
      teacherEmail={user.email ?? ""}
      plan={teacher.plan!}
      studentLimit={teacher.studentLimit}
      isInGracePeriod={teacher.isInGracePeriod}
      subscriptionExpiresAt={teacher.subscriptionExpiresAt}
      students={students}
      classes={classes}
      assignments={assignments}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ""}
    />
  );
}
