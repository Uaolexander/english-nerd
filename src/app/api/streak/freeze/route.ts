import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const isPro = await getIsPro(supabase, user.id);
  if (!isPro) return Response.json({ error: "Streak freeze is a Pro feature" }, { status: 403 });
  const monthlyLimit = 7;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const dayBeforeYesterday = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);

  // Check that yesterday is not already covered
  const { count: alreadyCovered } = await supabase
    .from("streak_freezes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("protected_date", yesterday);
  if ((alreadyCovered ?? 0) > 0) {
    return Response.json({ error: "Yesterday is already protected" }, { status: 409 });
  }

  // Check yesterday has no real activity
  const { count: activityYesterday } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("completed_at", `${yesterday}T00:00:00Z`)
    .lt("completed_at", `${today}T00:00:00Z`);
  if ((activityYesterday ?? 0) > 0) {
    return Response.json({ error: "You already had activity yesterday" }, { status: 409 });
  }

  // Check that there's a streak worth protecting (activity or freeze on day before yesterday)
  const { count: activityDbY } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("completed_at", `${dayBeforeYesterday}T00:00:00Z`)
    .lt("completed_at", `${yesterday}T00:00:00Z`);
  const { count: freezeDbY } = await supabase
    .from("streak_freezes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("protected_date", dayBeforeYesterday);
  if ((activityDbY ?? 0) === 0 && (freezeDbY ?? 0) === 0) {
    return Response.json({ error: "No streak to protect" }, { status: 422 });
  }

  // Check monthly limit
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const { count } = await supabase
    .from("streak_freezes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("protected_date", monthStart);

  if ((count ?? 0) >= monthlyLimit) {
    return Response.json({ error: "Monthly freeze limit reached" }, { status: 429 });
  }

  const { error } = await supabase
    .from("streak_freezes")
    .upsert({ user_id: user.id, protected_date: yesterday }, { onConflict: "user_id,protected_date" });

  if (error) return Response.json({ error: "Failed to activate freeze" }, { status: 500 });

  return Response.json({ success: true, protected_date: yesterday });
}
