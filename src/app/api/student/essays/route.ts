import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/student/essays — submit or re-submit an essay
 * GET  /api/student/essays?assignmentId=xxx — get own submission status
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("assignmentId");
  if (!assignmentId) return NextResponse.json({ ok: false, error: "assignmentId required" }, { status: 400 });

  const svc = createServiceClient();
  const { data } = await svc
    .from("essay_submissions")
    .select("id, content, word_count, submitted_at, status, teacher_feedback, teacher_grade, feedback_at")
    .eq("assignment_id", assignmentId)
    .eq("student_id", user.id)
    .maybeSingle();

  return NextResponse.json({ ok: true, submission: data ?? null });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const { assignmentId, content } = await req.json() as { assignmentId: string; content: string };
  if (!assignmentId || !content?.trim()) {
    return NextResponse.json({ ok: false, error: "assignmentId and content required" }, { status: 400 });
  }

  const wordCount = content.trim().split(/\s+/).length;
  const svc = createServiceClient();

  const { data: existing } = await svc
    .from("essay_submissions")
    .select("id")
    .eq("assignment_id", assignmentId)
    .eq("student_id", user.id)
    .maybeSingle();

  if (existing) {
    // Re-submit: update content, reset feedback
    const { error } = await svc
      .from("essay_submissions")
      .update({
        content: content.trim(),
        word_count: wordCount,
        submitted_at: new Date().toISOString(),
        status: "submitted",
        teacher_feedback: null,
        teacher_grade: null,
        feedback_at: null,
      })
      .eq("id", existing.id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  } else {
    const { error } = await svc.from("essay_submissions").insert({
      assignment_id: assignmentId,
      student_id: user.id,
      content: content.trim(),
      word_count: wordCount,
      status: "submitted",
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
