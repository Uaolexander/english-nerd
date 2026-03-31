import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    level: string;
    scorePercent: number;
    scoreCorrect: number;
    scoreTotal: number;
    holderName: string;
  };

  const { error } = await supabase.from("certificates").insert({
    user_id: user.id,
    level: body.level,
    score_percent: body.scorePercent,
    score_correct: body.scoreCorrect,
    score_total: body.scoreTotal,
    holder_name: body.holderName,
  });

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
