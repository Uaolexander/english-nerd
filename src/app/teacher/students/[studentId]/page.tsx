import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTeacherStatus } from "@/lib/getTeacherStatus";
import StudentDetailClient from "./StudentDetailClient";

export const metadata: Metadata = {
  title: "Student Progress — English Nerd",
};

export type ProgressRow = {
  id: string;
  category: string;
  level: string | null;
  slug: string;
  exerciseNo: number | null;
  score: number;
  questionsTotal: number | null;
  completedAt: string;
};

export type AnswerRow = {
  progressId: string;
  questionIndex: number;
  questionText: string | null;
  userAnswer: string | null;
  correctAnswer: string | null;
  isCorrect: boolean;
};

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) redirect("/account");

  // Verify this student belongs to this teacher
  const { data: link } = await supabase
    .from("teacher_students")
    .select("invite_email")
    .eq("teacher_id", user.id)
    .eq("student_id", studentId)
    .eq("status", "active")
    .maybeSingle();

  if (!link) notFound();

  // Fetch student progress (teacher RLS policy allows this)
  const { data: progressRows } = await supabase
    .from("user_progress")
    .select("id, category, level, slug, exercise_no, score, questions_total, completed_at")
    .eq("user_id", studentId)
    .order("completed_at", { ascending: false })
    .limit(300);

  const progress: ProgressRow[] = (progressRows ?? []).map((r) => ({
    id: r.id,
    category: r.category,
    level: r.level,
    slug: r.slug,
    exerciseNo: r.exercise_no,
    score: r.score,
    questionsTotal: r.questions_total,
    completedAt: r.completed_at,
  }));

  // Fetch detailed answers for all progress rows
  const progressIds = progress.map((p) => p.id);
  let answers: AnswerRow[] = [];
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

  return (
    <StudentDetailClient
      studentEmail={link.invite_email}
      studentId={studentId}
      progress={progress}
      answers={answers}
    />
  );
}
