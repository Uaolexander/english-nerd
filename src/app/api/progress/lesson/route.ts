import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const level = searchParams.get("level") || null;
  const slug = searchParams.get("slug");

  if (!category || !slug) {
    return Response.json({ exercises: [] });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ exercises: [] });
  }

  let query = supabase
    .from("user_progress")
    .select("exercise_no, score, completed_at")
    .eq("user_id", user.id)
    .eq("category", category)
    .eq("slug", slug);

  if (level) {
    query = query.eq("level", level);
  } else {
    query = query.is("level", null);
  }

  const { data } = await query.order("score", { ascending: false });

  // Keep only the best score per exercise_no
  const best: Record<string, { exerciseNo: number | null; score: number; completedAt: string }> = {};
  for (const row of data ?? []) {
    const key = String(row.exercise_no ?? "null");
    if (!best[key]) {
      best[key] = {
        exerciseNo: row.exercise_no,
        score: row.score,
        completedAt: row.completed_at,
      };
    }
  }

  return Response.json({ exercises: Object.values(best) });
}
