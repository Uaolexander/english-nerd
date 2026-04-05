import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

function makeToken(email: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createHmac("sha256", secret).update(email.toLowerCase().trim()).digest("hex");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://englishnerd.cc";

  if (!email || !token) {
    return new Response(errorPage("Invalid unsubscribe link."), { status: 400, headers: { "Content-Type": "text/html" } });
  }

  const expected = makeToken(email);
  if (token !== expected) {
    return new Response(errorPage("This unsubscribe link is invalid or has expired."), { status: 400, headers: { "Content-Type": "text/html" } });
  }

  const supabase = createServiceClient();
  await supabase.from("email_opt_outs").upsert({ email: email.toLowerCase().trim() });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Unsubscribed — English Nerd</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
<div style="text-align:center;max-width:480px;padding:40px 24px;">
  <a href="${SITE}" style="text-decoration:none;display:inline-block;margin-bottom:32px;">
    <span style="display:inline-block;background:#111827;border-radius:12px;padding:7px 14px;">
      <span style="font-size:16px;font-weight:900;letter-spacing:-0.4px;color:#F5DA20;">English Nerd</span>
    </span>
  </a>
  <div style="background:#ffffff;border-radius:20px;padding:36px 32px;box-shadow:0 1px 3px rgba(0,0,0,0.07),0 8px 32px rgba(0,0,0,0.06);">
    <div style="font-size:40px;margin-bottom:16px;">✓</div>
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:900;color:#111827;">Unsubscribed</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
      <strong style="color:#111827;">${email}</strong> has been removed from assignment notifications.
    </p>
    <p style="margin:0;font-size:13px;color:#9CA3AF;line-height:1.6;">
      You can still log in and use English Nerd normally.<br/>
      Changed your mind? Update your preferences in your account settings.
    </p>
  </div>
  <p style="margin:24px 0 0;font-size:12px;color:#9CA3AF;">
    <a href="${SITE}" style="color:#9CA3AF;text-decoration:underline;">englishnerd.cc</a>
  </p>
</div>
</body>
</html>`;

  return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
}

function errorPage(msg: string) {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://englishnerd.cc";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Error — English Nerd</title></head>
<body style="margin:0;padding:0;background:#F4F4F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
<div style="text-align:center;max-width:400px;padding:40px 24px;">
  <div style="background:#fff;border-radius:20px;padding:36px 32px;box-shadow:0 8px 32px rgba(0,0,0,0.06);">
    <div style="font-size:40px;margin-bottom:16px;">✗</div>
    <h1 style="margin:0 0 12px;font-size:20px;font-weight:900;color:#111827;">Something went wrong</h1>
    <p style="margin:0;font-size:14px;color:#6B7280;">${msg}</p>
  </div>
  <p style="margin:24px 0 0;font-size:12px;color:#9CA3AF;"><a href="${SITE}" style="color:#9CA3AF;text-decoration:underline;">englishnerd.cc</a></p>
</div>
</body>
</html>`;
}
