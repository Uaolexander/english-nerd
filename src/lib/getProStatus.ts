import type { SupabaseClient } from "@supabase/supabase-js";

export interface ProStatus {
  isPro: boolean;
  hadProBefore: boolean; // had PRO but it has now expired
}

/**
 * Returns current PRO status + whether the user previously had PRO (expired).
 */
export async function getProStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<ProStatus> {
  // 1. Active paid subscription — same filter as original getIsPro
  const { data: activeSub } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("is_pro", true)
    .limit(1)
    .maybeSingle();

  if (activeSub) return { isPro: true, hadProBefore: false };

  // 2. Active promo redemption
  const { data: activePromo } = await supabase
    .from("promo_redemptions")
    .select("id")
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  if (activePromo) return { isPro: true, hadProBefore: false };

  // ── Not currently PRO — check if they ever had PRO ──────────────────

  // 3. Any subscription record (including canceled)
  const { data: anySub } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  // 4. Expired promo redemption
  const { data: expiredPromo } = await supabase
    .from("promo_redemptions")
    .select("id")
    .eq("user_id", userId)
    .lte("expires_at", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  return {
    isPro: false,
    hadProBefore: anySub !== null || expiredPromo !== null,
  };
}
