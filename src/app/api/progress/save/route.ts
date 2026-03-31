import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    category: "grammar" | "tenses" | "test" | "vocabulary";
    level?: string;
    slug: string;
    exerciseNo?: number;
    score: number;
    questionsTotal?: number;
  };

  const service = createServiceClient();

  // Check for an existing record for this exact exercise
  const { data: existing } = await service
    .from("user_progress")
    .select("id, score")
    .eq("user_id", user.id)
    .eq("category", body.category)
    .eq("slug", body.slug)
    .is("level", body.level ?? null)
    .is("exercise_no", body.exerciseNo ?? null)
    .maybeSingle();

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
    const { error } = await service
      .from("user_progress")
      .update({ score: body.score, questions_total: body.questionsTotal ?? null, completed_at: new Date().toISOString() })
      .eq("id", existing.id);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  } else {
    // No existing record — insert
    const { error } = await service.from("user_progress").insert({
      user_id: user.id,
      category: body.category,
      level: body.level ?? null,
      slug: body.slug,
      exercise_no: body.exerciseNo ?? null,
      score: body.score,
      questions_total: body.questionsTotal ?? null,
    });

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, saved: true, isBest: true });
}
