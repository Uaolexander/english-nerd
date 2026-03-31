import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const { error } = await supabase.from("user_progress").insert({
    user_id: user.id,
    category: body.category,
    level: body.level ?? null,
    slug: body.slug,
    exercise_no: body.exerciseNo ?? null,
    score: body.score,
    questions_total: body.questionsTotal ?? null,
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
