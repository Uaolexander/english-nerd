import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendTeacherWelcomeEmail } from "@/lib/email";

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "You must be signed in." }, { status: 401 });

  if (isRateLimited(user.id)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }

  const { code } = await req.json() as { code?: string };
  const normalizedCode = (code ?? "").trim().toUpperCase();
  if (!normalizedCode) return NextResponse.json({ ok: false, error: "Please enter a voucher code." }, { status: 400 });

  const service = createServiceClient();

  // Look up voucher
  const { data: voucher } = await service
    .from("teacher_vouchers")
    .select("id, allowed_email, plan, student_limit, duration_days, is_active")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (!voucher || !voucher.is_active) {
    return NextResponse.json({ ok: false, error: "Invalid or inactive voucher code." }, { status: 400 });
  }

  // Personal voucher check — must match logged-in user's email
  if (voucher.allowed_email) {
    if (user.email?.toLowerCase() !== voucher.allowed_email.toLowerCase()) {
      return NextResponse.json({
        ok: false,
        error: "This voucher is not valid for your account.",
      }, { status: 403 });
    }
  }

  // Monthly reuse check — find the most recent redemption for this user+voucher
  const { data: lastRedemption } = await service
    .from("teacher_voucher_redemptions")
    .select("redeemed_at, expires_at")
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
      return NextResponse.json({
        ok: false,
        error: `This voucher was already used this period. You can use it again on ${formatted}.`,
      }, { status: 400 });
    }
  }

  // Calculate new expiry
  const expiresAt = new Date(Date.now() + voucher.duration_days * 24 * 60 * 60 * 1000).toISOString();

  // Upsert teacher_profiles
  const { error: upsertErr } = await service
    .from("teacher_profiles")
    .upsert({
      user_id: user.id,
      plan: voucher.plan,
      student_limit: voucher.student_limit,
      is_active: true,
      subscription_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (upsertErr) {
    console.error("[redeem-voucher] upsert error:", upsertErr);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // Log the redemption
  await service.from("teacher_voucher_redemptions").insert({
    voucher_id: voucher.id,
    user_id: user.id,
    expires_at: expiresAt,
  });

  const expiryLabel = new Date(expiresAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  // Send teacher welcome email (fire-and-forget)
  if (user.email) {
    void (async () => {
      try {
        const { data: profile } = await service
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();
        const name = (profile?.full_name as string | null) ?? null;
        await sendTeacherWelcomeEmail(user.email!, name, voucher.student_limit ?? 10);
      } catch (e) {
        console.error("[redeem-voucher] email error:", e);
      }
    })();
  }

  return NextResponse.json({
    ok: true,
    message: `Teacher access activated until ${expiryLabel}.`,
    expiresAt,
    plan: voucher.plan,
  });
}
