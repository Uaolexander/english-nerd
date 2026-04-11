import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  sendProExpiredEmail,
  sendProExpiringSoonEmail,
  sendTeacherExpiredEmail,
  sendTeacherExpiringSoonEmail,
} from "@/lib/email";

export const runtime = "nodejs";

// Vercel Cron sends CRON_SECRET as a Bearer token in Authorization header.
function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();

  // ── Windows ──────────────────────────────────────────────────────────────
  // "Just expired": expired in the last 24 hours
  const expiredFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const expiredTo   = now.toISOString();

  // "Expiring soon": expires in 6–8 days (to catch the "7 days" window once)
  const soonFrom = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString();
  const soonTo   = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString();

  let sent = 0;
  let errors = 0;

  // ── 1. PRO promo_redemptions ─────────────────────────────────────────────

  // Just expired
  const { data: expiredPromos } = await supabase
    .from("promo_redemptions")
    .select("user_id, expires_at, profiles(full_name), auth_users:user_id(email)")
    .gte("expires_at", expiredFrom)
    .lte("expires_at", expiredTo);

  for (const row of expiredPromos ?? []) {
    const email = (row as { auth_users?: { email?: string } }).auth_users?.email;
    const name  = (row as { profiles?: { full_name?: string } }).profiles?.full_name ?? null;
    if (!email) continue;
    try {
      await sendProExpiredEmail(email, name);
      sent++;
    } catch {
      errors++;
    }
  }

  // Expiring soon
  const { data: soonPromos } = await supabase
    .from("promo_redemptions")
    .select("user_id, expires_at, profiles(full_name), auth_users:user_id(email)")
    .gte("expires_at", soonFrom)
    .lte("expires_at", soonTo);

  for (const row of soonPromos ?? []) {
    const email    = (row as { auth_users?: { email?: string } }).auth_users?.email;
    const name     = (row as { profiles?: { full_name?: string } }).profiles?.full_name ?? null;
    const expiresAt = (row as { expires_at: string }).expires_at;
    if (!email) continue;
    const daysLeft = Math.ceil((new Date(expiresAt).getTime() - now.getTime()) / 86400000);
    try {
      await sendProExpiringSoonEmail(email, name, expiresAt, daysLeft);
      sent++;
    } catch {
      errors++;
    }
  }

  // ── 2. Teacher teacher_voucher_redemptions ───────────────────────────────

  // Just expired
  const { data: expiredTeachers } = await supabase
    .from("teacher_voucher_redemptions")
    .select("user_id, expires_at, profiles(full_name), auth_users:user_id(email)")
    .gte("expires_at", expiredFrom)
    .lte("expires_at", expiredTo);

  for (const row of expiredTeachers ?? []) {
    const email = (row as { auth_users?: { email?: string } }).auth_users?.email;
    const name  = (row as { profiles?: { full_name?: string } }).profiles?.full_name ?? null;
    if (!email) continue;
    try {
      await sendTeacherExpiredEmail(email, name);
      sent++;
    } catch {
      errors++;
    }
  }

  // Expiring soon
  const { data: soonTeachers } = await supabase
    .from("teacher_voucher_redemptions")
    .select("user_id, expires_at, profiles(full_name), auth_users:user_id(email)")
    .gte("expires_at", soonFrom)
    .lte("expires_at", soonTo);

  for (const row of soonTeachers ?? []) {
    const email    = (row as { auth_users?: { email?: string } }).auth_users?.email;
    const name     = (row as { profiles?: { full_name?: string } }).profiles?.full_name ?? null;
    const expiresAt = (row as { expires_at: string }).expires_at;
    if (!email) continue;
    const daysLeft = Math.ceil((new Date(expiresAt).getTime() - now.getTime()) / 86400000);
    try {
      await sendTeacherExpiringSoonEmail(email, name, expiresAt, daysLeft);
      sent++;
    } catch {
      errors++;
    }
  }

  console.log(`[cron/promo-expiry] sent=${sent} errors=${errors}`);
  return NextResponse.json({ ok: true, sent, errors });
}
