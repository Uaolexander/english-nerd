import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

function deviceHint(ua: string): string {
  if (/iPhone|iPad/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unknown device";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  // Allow max 2 concurrent sessions — if limit reached, deactivate the oldest one
  const { data: activeSessions } = await service
    .from("user_sessions")
    .select("id, created_at")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (activeSessions && activeSessions.length >= 3) {
    // Deactivate the oldest session(s) to keep the count at 2 (we're about to add a new one)
    const toDeactivate = activeSessions.slice(0, activeSessions.length - 2);
    await service
      .from("user_sessions")
      .update({ is_active: false })
      .in("id", toDeactivate.map((s) => s.id));
  }

  // Create new session
  const sessionToken = randomUUID();
  const ua = request.headers.get("user-agent") ?? "";
  const rawIp =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ip = rawIp.split(",")[0].trim();

  await service.from("user_sessions").insert({
    user_id: user.id,
    session_token: sessionToken,
    device_hint: deviceHint(ua),
    ip_address: ip,
  });

  const cookieStore = await cookies();
  cookieStore.set("app_session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
