import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiter: 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) return true;

  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  try {
    const { message, page } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (message.trim().length > 1000) {
      return NextResponse.json({ error: "Message too long." }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    const text = `📬 *New message — English Nerd*\n\n${message.trim()}\n\n_Sent from: ${page ?? "englishnerd.cc"}_`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
