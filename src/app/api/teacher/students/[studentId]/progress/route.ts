import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false }, { status: 403 });

  // Verify student belongs to this teacher
  const { data: link } = await supabase
    .from("teacher_students")
    .select("invite_email")
    .eq("teacher_id", user.id)
    .eq("student_id", studentId)
    .eq("status", "active")
    .maybeSingle();

  if (!link) return NextResponse.json({ ok: false }, { status: 404 });

  const { data: progressRows } = await supabase
    .from("user_progress")
    .select("id, category, level, slug, exercise_no, score, questions_total, completed_at")
    .eq("user_id", studentId)
    .order("completed_at", { ascending: false })
    .limit(300);

  const progress = (progressRows ?? []).map((r) => ({
    id: r.id,
    category: r.category,
    level: r.level,
    slug: r.slug,
    exerciseNo: r.exercise_no,
    score: r.score,
    questionsTotal: r.questions_total,
    completedAt: r.completed_at,
  }));

  const progressIds = progress.map((p) => p.id);
  let answers: object[] = [];
  if (progressIds.length > 0) {
    const { data: answerRows } = await supabase
      .from("exercise_answers")
      .select("progress_id, question_index, question_text, user_answer, correct_answer, is_correct")
      .in("progress_id", progressIds)
      .order("question_index");

    answers = (answerRows ?? []).map((a) => ({
      progressId: a.progress_id,
      questionIndex: a.question_index,
      questionText: a.question_text,
      userAnswer: a.user_answer,
      correctAnswer: a.correct_answer,
      isCorrect: a.is_correct,
    }));
  }

  return NextResponse.json({ ok: true, progress, answers });
}
