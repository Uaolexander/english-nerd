import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns whether the given user currently has Pro access.
 * Checks paid subscriptions (is_pro = true) OR an active promo redemption
 * (expires_at > now()).
 */
export async function getIsPro(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  // 1. Paid subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("is_pro", true)
    .limit(1)
    .maybeSingle();

  if (sub) return true;

  // 2. Active promo redemption
  const { data: promo } = await supabase
    .from("promo_redemptions")
    .select("id")
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  return promo !== null;
}
