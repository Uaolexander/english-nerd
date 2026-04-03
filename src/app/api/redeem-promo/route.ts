import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// Simple in-memory rate limit: 5 attempts per user per 10 minutes
const rateMap = new Map<string, { count: number; reset: number }>();
function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(userId);
  if (!entry || now > entry.reset) {
    rateMap.set(userId, { count: 1, reset: now + 10 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(req: Request) {
  // Authenticate
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "You must be signed in to redeem a promo code." }, { status: 401 });

  // Rate limit
  if (isRateLimited(user.id)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  }

  const body = await req.json() as { code?: string };
  const code = (body.code ?? "").trim().toUpperCase();
  if (!code) return NextResponse.json({ ok: false, error: "Please enter a promo code." }, { status: 400 });

  const service = createServiceClient();

  // Look up the code
  const { data: promoCode, error: codeErr } = await service
    .from("promo_codes")
    .select("id, campaign, duration_days, max_uses, used_count, is_active")
    .eq("code", code)
    .maybeSingle();

  if (codeErr) {
    console.error("[redeem-promo] lookup error:", codeErr);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }

  if (!promoCode || !promoCode.is_active) {
    return NextResponse.json({ ok: false, error: "This promo code is invalid or has expired." }, { status: 400 });
  }

  if (promoCode.used_count >= promoCode.max_uses) {
    return NextResponse.json({ ok: false, error: "This promo code has already been used." }, { status: 400 });
  }

  // Check if this user already used this code
  const { data: existing } = await service
    .from("promo_redemptions")
    .select("id")
    .eq("code_id", promoCode.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: false, error: "You have already used this promo code." }, { status: 400 });
  }

  // Calculate expiry
  const expiresAt = new Date(Date.now() + promoCode.duration_days * 24 * 60 * 60 * 1000).toISOString();

  // Insert redemption
  const { error: insertErr } = await service
    .from("promo_redemptions")
    .insert({ code_id: promoCode.id, user_id: user.id, expires_at: expiresAt });

  if (insertErr) {
    // Handle race condition (unique constraint violation)
    if (insertErr.code === "23505") {
      return NextResponse.json({ ok: false, error: "You have already used this promo code." }, { status: 400 });
    }
    console.error("[redeem-promo] insert error:", insertErr);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // Increment used_count atomically
  await service
    .from("promo_codes")
    .update({ used_count: promoCode.used_count + 1 })
    .eq("id", promoCode.id);

  const months = promoCode.duration_days >= 365
    ? `${Math.round(promoCode.duration_days / 30)} months`
    : promoCode.duration_days >= 30
    ? `${Math.round(promoCode.duration_days / 30)} month`
    : `${promoCode.duration_days} days`;

  const expiryLabel = new Date(expiresAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return NextResponse.json({
    ok: true,
    message: `🎉 PRO activated for ${months}! Your access expires on ${expiryLabel}.`,
    expiresAt,
  });
}
