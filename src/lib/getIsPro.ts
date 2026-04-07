import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns whether the given user has any paid access (PRO, Teacher, or Student).
 * Used to hide ads and unlock full layout across the site.
 */
export async function getIsPro(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const [subRes, promoRes, teacherRes, studentRes] = await Promise.all([
    // 1. Paid PRO subscription
    supabase.from("subscriptions").select("id").eq("user_id", userId).eq("is_pro", true).limit(1).maybeSingle(),
    // 2. Active promo redemption
    supabase.from("promo_redemptions").select("id").eq("user_id", userId).gt("expires_at", new Date().toISOString()).limit(1).maybeSingle(),
    // 3. Active teacher profile
    supabase.from("teacher_profiles").select("id").eq("user_id", userId).eq("is_active", true).limit(1).maybeSingle(),
    // 4. Active student link
    supabase.from("teacher_students").select("id").eq("student_id", userId).eq("status", "active").limit(1).maybeSingle(),
  ]);

  return !!(subRes.data || promoRes.data || teacherRes.data || studentRes.data);
}
