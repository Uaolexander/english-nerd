import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

/**
 * GET /api/teacher/assignments/results?assignmentId=xxx
 * Returns per-student completion data for a given assignment.
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("assignmentId");
  if (!assignmentId) return NextResponse.json({ ok: false, error: "assignmentId required" }, { status: 400 });

  // Verify assignment belongs to this teacher
  const { data: assignment } = await supabase
    .from("teacher_assignments")
    .select("id, category, level, slug, exercise_no")
    .eq("id", assignmentId)
    .eq("teacher_id", user.id)
    .maybeSingle();

  if (!assignment) return NextResponse.json({ ok: false, error: "Assignment not found" }, { status: 404 });

  const svc = createServiceClient();

  // Determine which student IDs this assignment targets
  const { data: targetRows } = await svc
    .from("assignment_targets")
    .select("student_id, class_id")
    .eq("assignment_id", assignmentId);

  const directStudentIds = (targetRows ?? []).filter((r) => r.student_id).map((r) => r.student_id as string);
  const classIds = (targetRows ?? []).filter((r) => r.class_id).map((r) => r.class_id as string);

  // Resolve class members
  let classStudentIds: string[] = [];
  if (classIds.length > 0) {
    const { data: members } = await svc
      .from("class_members")
      .select("student_id")
      .in("class_id", classIds);
    classStudentIds = (members ?? []).map((m) => m.student_id as string);
  }

  // Get all active students of this teacher
  const { data: teacherStudentRows } = await svc
    .from("teacher_students")
    .select("student_id, invite_email, nickname")
    .eq("teacher_id", user.id)
    .eq("status", "active")
    .not("student_id", "is", null);

  const allActiveStudents = teacherStudentRows ?? [];
  const nicknameMap = new Map(allActiveStudents.map((s) => [s.student_id as string, s.nickname as string | null]));
  const emailMap = new Map(allActiveStudents.map((s) => [s.student_id as string, s.invite_email as string]));

  // Resolve final target student IDs
  let targetStudentIds: string[];
  const isEveryone = (targetRows ?? []).length === 0;
  if (isEveryone) {
    targetStudentIds = allActiveStudents.map((s) => s.student_id as string);
  } else {
    const combined = new Set([...directStudentIds, ...classStudentIds]);
    targetStudentIds = Array.from(combined);
  }

  if (targetStudentIds.length === 0) {
    return NextResponse.json({ ok: true, students: [] });
  }

  // Fetch student profiles via auth.admin
  const profileResults = await Promise.all(
    targetStudentIds.map((id) => svc.auth.admin.getUserById(id))
  );
  const profileMap = new Map<string, { name: string; avatarUrl: string }>();
  for (const { data } of profileResults) {
    if (data?.user) {
      const m = data.user.user_metadata ?? {};
      profileMap.set(data.user.id, {
        name: (m.full_name ?? m.name ?? "") as string,
        avatarUrl: (m.avatar_url ?? m.picture ?? "") as string,
      });
    }
  }

  const isEssay = assignment.category === "essay";

  // ── Essay path ──────────────────────────────────────────────────────────
  if (isEssay) {
    const { data: submissionRows } = await svc
      .from("essay_submissions")
      .select("id, student_id, content, word_count, submitted_at, status, teacher_feedback, teacher_grade, feedback_at")
      .eq("assignment_id", assignment.id)
      .in("student_id", targetStudentIds);

    const subByStudent = new Map((submissionRows ?? []).map((s) => [s.student_id as string, s]));

    const students = targetStudentIds.map((studentId) => {
      const profile = profileMap.get(studentId);
      const sub = subByStudent.get(studentId) ?? null;
      return {
        studentId,
        email: emailMap.get(studentId) ?? "",
        name: profile?.name ?? null,
        avatarUrl: profile?.avatarUrl ?? null,
        nickname: nicknameMap.get(studentId) ?? null,
        completed: !!sub,
        score: null,
        questionsTotal: null,
        completedAt: sub?.submitted_at ?? null,
        answers: [],
        essay: sub ? {
          submissionId: sub.id as string,
          content: sub.content as string,
          wordCount: sub.word_count as number,
          submittedAt: sub.submitted_at as string,
          status: sub.status as string,
          teacherFeedback: sub.teacher_feedback as string | null,
          teacherGrade: sub.teacher_grade as string | null,
          feedbackAt: sub.feedback_at as string | null,
        } : null,
      };
    });

    students.sort((a, b) => {
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;
      return 0;
    });

    return NextResponse.json({ ok: true, students });
  }

  // ── Exercise path ───────────────────────────────────────────────────────
  let progressQuery = svc
    .from("user_progress")
    .select("id, user_id, category, level, slug, exercise_no, score, questions_total, completed_at")
    .in("user_id", targetStudentIds)
    .eq("category", assignment.category)
    .eq("slug", assignment.slug)
    .order("completed_at", { ascending: false });

  if (assignment.level) progressQuery = progressQuery.eq("level", assignment.level);
  if (assignment.exercise_no) progressQuery = progressQuery.eq("exercise_no", assignment.exercise_no);

  const { data: progressRows } = await progressQuery;

  const progressIds = (progressRows ?? []).map((r) => r.id as string);
  let answerRows: Array<{
    progress_id: string; question_index: number;
    question_text: string | null; user_answer: string | null;
    correct_answer: string | null; is_correct: boolean;
  }> = [];
  if (progressIds.length > 0) {
    const { data } = await svc
      .from("exercise_answers")
      .select("progress_id, question_index, question_text, user_answer, correct_answer, is_correct")
      .in("progress_id", progressIds)
      .order("question_index");
    answerRows = data ?? [];
  }

  const answersByProgress = new Map<string, typeof answerRows>();
  for (const a of answerRows) {
    if (!answersByProgress.has(a.progress_id)) answersByProgress.set(a.progress_id, []);
    answersByProgress.get(a.progress_id)!.push(a);
  }

  type ProgressRow = NonNullable<typeof progressRows>[number];
  const bestByUser = new Map<string, ProgressRow>();
  for (const row of (progressRows ?? [])) {
    const existing = bestByUser.get(row.user_id);
    if (!existing || row.score > existing.score) bestByUser.set(row.user_id, row);
  }

  const students = targetStudentIds.map((studentId) => {
    const profile = profileMap.get(studentId);
    const best = bestByUser.get(studentId) ?? null;
    const answers = best ? (answersByProgress.get(best.id) ?? []) : [];
    return {
      studentId,
      email: emailMap.get(studentId) ?? "",
      name: profile?.name ?? null,
      avatarUrl: profile?.avatarUrl ?? null,
      nickname: nicknameMap.get(studentId) ?? null,
      completed: !!best,
      score: best ? best.score : null,
      questionsTotal: best ? best.questions_total : null,
      completedAt: best ? best.completed_at : null,
      answers: answers.map((a) => ({
        questionIndex: a.question_index,
        questionText: a.question_text,
        userAnswer: a.user_answer,
        correctAnswer: a.correct_answer,
        isCorrect: a.is_correct,
      })),
      essay: null,
    };
  });

  students.sort((a, b) => {
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    return (b.score ?? 0) - (a.score ?? 0);
  });

  return NextResponse.json({ ok: true, students });
}
