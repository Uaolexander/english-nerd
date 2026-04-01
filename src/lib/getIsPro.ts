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
  const { data: sub, error } = await supabase
    .from("subscriptions")
    .select("is_pro, status, user_id, customer_email, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  console.log("[getIsPro] userId:", userId);
  console.log("[getIsPro] query error:", error);
  console.log("[getIsPro] latest subscription row:", sub);

  const isPro = sub?.is_pro === true;
  console.log("[getIsPro] isPro:", isPro);

  return isPro;
}
