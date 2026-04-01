import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns whether the given user currently has Pro access.
 * Source of truth: the most recent row in public.subscriptions.
 * Falls back to false if no subscription record exists.
 */
export async function getIsPro(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("is_pro")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return sub?.is_pro === true;
}
