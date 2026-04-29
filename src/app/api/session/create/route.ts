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

  // Allow max 2 concurrent sessions — deactivate oldest when limit would be exceeded
  const { data: activeSessions } = await service
    .from("user_sessions")
    .select("id, created_at")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (activeSessions && activeSessions.length >= 2) {
    // Keep only the newest 1 before adding this new session → total stays at 2
    const toDeactivate = activeSessions.slice(0, activeSessions.length - 1);
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
