import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    category: "grammar" | "tenses" | "test" | "vocabulary" | "reading" | "listening";
    level?: string;
    slug: string;
    exerciseNo?: number;
    score: number;
    questionsTotal?: number;
    /** Optional: per-question breakdown for teacher analytics */
    answers?: Array<{
      questionIndex: number;
      questionText?: string;
      userAnswer?: string;
      correctAnswer?: string;
      isCorrect: boolean;
    }>;
  };

  const level = body.level ?? null;
  const exerciseNo = body.exerciseNo ?? null;

  // Check for an existing record for this exact exercise
  // Use .eq() for non-null values, .is() only for NULL checks
  let query = supabase
    .from("user_progress")
    .select("id, score")
    .eq("user_id", user.id)
    .eq("category", body.category)
    .eq("slug", body.slug);

  query = level !== null ? query.eq("level", level) : query.is("level", null);
  query = exerciseNo !== null ? query.eq("exercise_no", exerciseNo) : query.is("exercise_no", null);

  const { data: existing, error: selectError } = await query.maybeSingle();

  if (selectError) {
    return NextResponse.json({ ok: false, error: selectError.message }, { status: 500 });
  }

  // Already perfect — never overwrite
  if (existing?.score === 100) {
    return NextResponse.json({ ok: true, saved: false, isBest: false, message: "Perfect score already achieved." });
  }

  // Existing score is better or equal — skip
  if (existing && body.score <= existing.score) {
    return NextResponse.json({ ok: true, saved: false, isBest: false, message: "Your best result is already higher." });
  }

  if (existing) {
    // New score is better — update in place
    const { error } = await supabase
      .from("user_progress")
      .update({
        score: body.score,
        questions_total: body.questionsTotal ?? null,
        completed_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  } else {
    // No existing record — insert
    const { error } = await supabase.from("user_progress").insert({
      user_id: user.id,
      category: body.category,
      level,
      slug: body.slug,
      exercise_no: exerciseNo,
      score: body.score,
      questions_total: body.questionsTotal ?? null,
    });

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Save detailed per-question answers if provided
  if (body.answers && body.answers.length > 0) {
    // Get the progress row id for the foreign key
    let progressId: string | null = null;
    let idQuery = supabase
      .from("user_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("category", body.category)
      .eq("slug", body.slug);
    idQuery = level !== null ? idQuery.eq("level", level) : idQuery.is("level", null);
    idQuery = exerciseNo !== null ? idQuery.eq("exercise_no", exerciseNo) : idQuery.is("exercise_no", null);
    const { data: progressRow } = await idQuery.maybeSingle();
    progressId = progressRow?.id ?? null;

    // Delete old answers for this exercise (keep only latest attempt)
    if (progressId) {
      await supabase.from("exercise_answers").delete().eq("progress_id", progressId);
    }

    const answerRows = body.answers.map((a) => ({
      progress_id: progressId,
      user_id: user.id,
      category: body.category,
      level,
      slug: body.slug,
      exercise_no: exerciseNo,
      question_index: a.questionIndex,
      question_text: a.questionText ?? null,
      user_answer: a.userAnswer ?? null,
      correct_answer: a.correctAnswer ?? null,
      is_correct: a.isCorrect,
    }));

    await supabase.from("exercise_answers").insert(answerRows);
  }

  return NextResponse.json({ ok: true, saved: true, isBest: true });
}
