import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns whether the given user currently has Pro access.
 * Checks for ANY row where is_pro = true — safe against multiple
 * webhook events creating multiple rows for the same subscription.
 */
export async function getIsPro(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("is_pro", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[getIsPro] query error:", error);
    return false;
  }

  return data !== null;
}
