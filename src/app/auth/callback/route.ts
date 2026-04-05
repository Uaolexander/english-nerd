import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sendWelcomeEmail } from "@/lib/email";

function deviceHint(ua: string): string {
  if (/iPhone|iPad/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unknown device";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  // OAuth provider sent back an error (e.g. user denied access)
  const oauthError = searchParams.get("error");
  const oauthErrorDesc = searchParams.get("error_description");
  if (oauthError) {
    console.error("[auth/callback] OAuth provider error:", oauthError, oauthErrorDesc);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(oauthErrorDesc ?? oauthError)}`
    );
  }

  if (!code) {
    console.error("[auth/callback] No code param received. Full URL:", request.url);
    return NextResponse.redirect(`${origin}/login?error=no_code_in_callback`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Create app session (invalidates all other active sessions for this account)
  const redirectTo = `${origin}${next}`;
  const response = NextResponse.redirect(redirectTo);

  if (user) {
    try {
      const service = createServiceClient();

      // Allow max 2 concurrent sessions — deactivate oldest if limit reached
      const { data: activeSessions } = await service
        .from("user_sessions")
        .select("id, created_at")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (activeSessions && activeSessions.length >= 3) {
        const toDeactivate = activeSessions.slice(0, activeSessions.length - 2);
        await service
          .from("user_sessions")
          .update({ is_active: false })
          .in("id", toDeactivate.map((s) => s.id));
      }

      const sessionToken = randomUUID();
      const ua = request.headers.get("user-agent") ?? "";
      const rawIp =
        request.headers.get("x-forwarded-for") ??
        request.headers.get("x-real-ip") ??
        "unknown";

      await service.from("user_sessions").insert({
        user_id: user.id,
        session_token: sessionToken,
        device_hint: deviceHint(ua),
        ip_address: rawIp.split(",")[0].trim(),
      });

      response.cookies.set("app_session_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    } catch (err) {
      console.error("[auth/callback] Failed to create app session:", err);
      // Non-fatal — user is still logged in via Supabase auth
    }
  }

  // Send welcome email to brand-new users (registered within last 60s)
  if (user && (Date.now() - new Date(user.created_at).getTime()) < 60_000) {
    const name = (user.user_metadata?.full_name as string | null) ?? null;
    void sendWelcomeEmail(user.email!, name);
  }

  return response;
}
