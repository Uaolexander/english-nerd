import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

/**
 * POST /api/teacher/essays — save feedback + grade for an essay submission
 * Body: { submissionId, feedback, grade }
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { submissionId, feedback, grade } = await req.json() as {
    submissionId: string;
    feedback: string;
    grade?: string;
  };
  if (!submissionId) return NextResponse.json({ ok: false, error: "submissionId required" }, { status: 400 });

  const svc = createServiceClient();

  // Verify this submission belongs to a student of this teacher
  const { data: sub } = await svc
    .from("essay_submissions")
    .select("id, assignment_id, student_id")
    .eq("id", submissionId)
    .maybeSingle();

  if (!sub) return NextResponse.json({ ok: false, error: "Submission not found" }, { status: 404 });

  const { data: assignment } = await svc
    .from("teacher_assignments")
    .select("id")
    .eq("id", sub.assignment_id)
    .eq("teacher_id", user.id)
    .maybeSingle();

  if (!assignment) return NextResponse.json({ ok: false, error: "Not your assignment" }, { status: 403 });

  const { error } = await svc
    .from("essay_submissions")
    .update({
      teacher_feedback: feedback?.trim() || null,
      teacher_grade: grade?.trim() || null,
      feedback_at: new Date().toISOString(),
      status: "reviewed",
    })
    .eq("id", submissionId);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
