import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendProGainedEmail, sendTeacherWelcomeEmail } from "@/lib/email";

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
    .select("id, campaign, duration_days, max_uses, used_count, is_active, valid_from, valid_until")
    .eq("code", code)
    .maybeSingle();

  if (codeErr) {
    console.error("[redeem-promo] lookup error:", codeErr);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }

  if (!promoCode || !promoCode.is_active) {
    // Not a Pro promo code — check if it's a teacher voucher
    const { data: voucher } = await service
      .from("teacher_vouchers")
      .select("id, allowed_email, plan, student_limit, duration_days, is_active, valid_from, valid_until")
      .eq("code", code)
      .maybeSingle();

    if (voucher && voucher.is_active) {
      // Personal voucher check
      if (voucher.allowed_email && user.email?.toLowerCase() !== voucher.allowed_email.toLowerCase()) {
        return NextResponse.json({ ok: false, error: "This voucher is not valid for your account." }, { status: 403 });
      }

      // Date validity check
      const nowTs = new Date();
      if (voucher.valid_from && nowTs < new Date(voucher.valid_from)) {
        return NextResponse.json({ ok: false, error: "This voucher is not active yet." }, { status: 400 });
      }
      if (voucher.valid_until && nowTs > new Date(voucher.valid_until)) {
        return NextResponse.json({ ok: false, error: "This voucher has expired." }, { status: 400 });
      }

      // Monthly reuse check
      const { data: lastRedemption } = await service
        .from("teacher_voucher_redemptions")
        .select("redeemed_at")
        .eq("voucher_id", voucher.id)
        .eq("user_id", user.id)
        .order("redeemed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastRedemption) {
        const daysSinceLast = (Date.now() - new Date(lastRedemption.redeemed_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLast < voucher.duration_days) {
          const nextAvailable = new Date(lastRedemption.redeemed_at);
          nextAvailable.setDate(nextAvailable.getDate() + voucher.duration_days);
          const formatted = nextAvailable.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
          return NextResponse.json({ ok: false, error: `Already used this period. Available again on ${formatted}.` }, { status: 400 });
        }
      }

      const expiresAt = new Date(Date.now() + voucher.duration_days * 24 * 60 * 60 * 1000).toISOString();

      await service.from("teacher_profiles").upsert({
        user_id: user.id,
        plan: voucher.plan,
        student_limit: voucher.student_limit,
        is_active: true,
        subscription_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      await service.from("teacher_voucher_redemptions").insert({
        voucher_id: voucher.id,
        user_id: user.id,
        expires_at: expiresAt,
      });

      const expiryLabel = new Date(expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

      // Send teacher welcome email (fire-and-forget)
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      const name = freshUser?.user_metadata?.full_name ?? freshUser?.user_metadata?.name ?? null;
      void sendTeacherWelcomeEmail(user.email!, name, voucher.student_limit ?? 10);

      return NextResponse.json({
        ok: true,
        message: `🎓 Teacher access activated until ${expiryLabel}!`,
        expiresAt,
        isTeacher: true,
        plan: voucher.plan,
      });
    }

    return NextResponse.json({ ok: false, error: "This promo code is invalid or has expired." }, { status: 400 });
  }

  // Check date validity
  const now = new Date();
  if (promoCode.valid_from && now < new Date(promoCode.valid_from)) {
    return NextResponse.json({ ok: false, error: "This promo code is not active yet." }, { status: 400 });
  }
  if (promoCode.valid_until && now > new Date(promoCode.valid_until)) {
    return NextResponse.json({ ok: false, error: "This promo code has expired." }, { status: 400 });
  }

  if (promoCode.used_count >= promoCode.max_uses) {
    return NextResponse.json({ ok: false, error: "This promo code has already reached its limit." }, { status: 400 });
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

  // Increment used_count atomically — only if still within limit to prevent overflow
  await service
    .from("promo_codes")
    .update({ used_count: promoCode.used_count + 1 })
    .eq("id", promoCode.id)
    .lt("used_count", promoCode.max_uses);

  const months = promoCode.duration_days >= 365
    ? `${Math.round(promoCode.duration_days / 30)} months`
    : promoCode.duration_days >= 30
    ? `${Math.round(promoCode.duration_days / 30)} month`
    : `${promoCode.duration_days} days`;

  const expiryLabel = new Date(expiresAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  // Send PRO welcome email (fire-and-forget)
  const { data: { user: freshUser } } = await supabase.auth.getUser();
  const name = freshUser?.user_metadata?.full_name ?? freshUser?.user_metadata?.name ?? null;
  void sendProGainedEmail(user.email!, name, expiresAt);

  return NextResponse.json({
    ok: true,
    message: `🎉 PRO activated for ${months}! Your access expires on ${expiryLabel}.`,
    expiresAt,
  });
}
