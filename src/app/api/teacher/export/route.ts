import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

/**
 * GET /api/teacher/export?type=assignments|students
 * Returns a CSV download of teacher's data.
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const svc = createServiceClient();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "assignments";

  function escapeCell(val: string | number | null | undefined): string {
    if (val === null || val === undefined) return "";
    const s = String(val);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }

  function row(...cells: (string | number | null | undefined)[]): string {
    return cells.map(escapeCell).join(",");
  }

  if (type === "students") {
    const { data: studentRows } = await svc
      .from("teacher_students")
      .select("student_id, nickname, email, status, joined_at, total_completed, avg_score, last_activity")
      .eq("teacher_id", user.id)
      .eq("status", "active");

    const studentIds = (studentRows ?? []).filter((r) => r.student_id).map((r) => r.student_id as string);
    const { data: profiles } = studentIds.length
      ? await svc.from("profiles").select("id, full_name").in("id", studentIds)
      : { data: [] };
    const profileMap = new Map((profiles ?? []).map((p) => [p.id as string, p.full_name as string | null]));

    const lines = [
      row("Name", "Email", "Joined", "Exercises Done", "Avg Score", "Last Active"),
      ...(studentRows ?? []).map((s) => {
        const name = s.nickname || profileMap.get(s.student_id as string) || s.email;
        const joined = s.joined_at ? new Date(s.joined_at as string).toLocaleDateString("en-GB") : "";
        const last = s.last_activity ? new Date(s.last_activity as string).toLocaleDateString("en-GB") : "";
        return row(name, s.email, joined, s.total_completed, s.avg_score !== null ? `${s.avg_score}%` : "", last);
      }),
    ];

    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="students-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  // type === "assignments" — full results
  const { data: assignments } = await svc
    .from("teacher_assignments")
    .select("id, title, category, level, slug, exercise_no, due_date, created_at")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  if (!assignments?.length) {
    return new NextResponse("Title,Category,Level,Due Date,Submissions\n", {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="assignments-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const assignmentIds = assignments.map((a) => a.id as string);

  // Get all progress completions for teacher's students
  const { data: studentLinks } = await svc
    .from("teacher_students")
    .select("student_id, nickname, email")
    .eq("teacher_id", user.id)
    .eq("status", "active")
    .not("student_id", "is", null);

  const studentIds = (studentLinks ?? []).map((r) => r.student_id as string);
  const nicknameMap = new Map((studentLinks ?? []).map((r) => [r.student_id as string, { nickname: r.nickname as string | null, email: r.email as string }]));

  const { data: profiles } = studentIds.length
    ? await svc.from("profiles").select("id, full_name").in("id", studentIds)
    : { data: [] };
  const profileMap = new Map((profiles ?? []).map((p) => [p.id as string, p.full_name as string | null]));

  // Essay submissions
  const { data: essaySubs } = await svc
    .from("essay_submissions")
    .select("assignment_id, student_id, status, teacher_grade, submitted_at")
    .in("assignment_id", assignmentIds)
    .in("student_id", studentIds);

  // Exercise progress
  const { data: progressRows } = studentIds.length
    ? await svc.from("user_progress").select("user_id, category, level, slug, exercise_no, score, completed_at").in("user_id", studentIds)
    : { data: [] };

  const lines = [
    row("Assignment", "Category", "Level", "Student", "Score", "Completed", "Essay Status", "Essay Grade"),
  ];

  for (const a of assignments) {
    const isEssay = a.category === "essay";
    if (isEssay) {
      const subs = (essaySubs ?? []).filter((e) => e.assignment_id === a.id);
      if (subs.length === 0) {
        lines.push(row(a.title, a.category, a.level ?? "", "", "", "", "no submissions", ""));
      } else {
        for (const sub of subs) {
          const info = nicknameMap.get(sub.student_id as string);
          const name = info?.nickname || profileMap.get(sub.student_id as string) || info?.email || "";
          const date = sub.submitted_at ? new Date(sub.submitted_at as string).toLocaleDateString("en-GB") : "";
          lines.push(row(a.title, a.category, a.level ?? "", name, "", date, sub.status, sub.teacher_grade ?? ""));
        }
      }
    } else {
      const matchKey = `${a.category}|${a.level ?? ""}|${a.slug}|${a.exercise_no ?? ""}`;
      const completions = (progressRows ?? []).filter((p) =>
        `${p.category}|${p.level ?? ""}|${p.slug}|${p.exercise_no ?? ""}` === matchKey
      );
      if (completions.length === 0) {
        lines.push(row(a.title, a.category, a.level ?? "", "", "", "", "", ""));
      } else {
        for (const p of completions) {
          const info = nicknameMap.get(p.user_id as string);
          const name = info?.nickname || profileMap.get(p.user_id as string) || info?.email || "";
          const date = p.completed_at ? new Date(p.completed_at as string).toLocaleDateString("en-GB") : "";
          lines.push(row(a.title, a.category, a.level ?? "", name, p.score !== null ? `${p.score}%` : "", date, "", ""));
        }
      }
    }
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="assignments-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
