import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// In-memory rate limiter: 10 per IP per 5 min
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 10;

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

// GET — fetch thread messages + unread count
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();

  const { data: thread } = await service
    .from("feedback_threads")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!thread) return NextResponse.json({ messages: [], unread: 0 });

  const { data: messages } = await service
    .from("feedback_messages")
    .select("id, content, is_owner_reply, is_read, created_at")
    .eq("thread_id", thread.id)
    .order("created_at", { ascending: true });

  const unread = (messages ?? []).filter((m) => m.is_owner_reply && !m.is_read).length;

  return NextResponse.json({ messages: messages ?? [], unread });
}

// PATCH — mark all owner replies as read
export async function PATCH() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();

  const { data: thread } = await service
    .from("feedback_threads")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!thread) return NextResponse.json({ ok: true });

  await service
    .from("feedback_messages")
    .update({ is_read: true })
    .eq("thread_id", thread.id)
    .eq("is_owner_reply", true)
    .eq("is_read", false);

  return NextResponse.json({ ok: true });
}

// POST — send a new message
export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { message, plan, page } = body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.trim().length > 1000) {
    return NextResponse.json({ error: "Message too long." }, { status: 400 });
  }

  const service = createServiceClient();
  const email = user.email ?? "";

  // Find or create thread
  let { data: thread } = await service
    .from("feedback_threads")
    .select("id, telegram_message_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!thread) {
    const { data: newThread, error } = await service
      .from("feedback_threads")
      .insert({ user_id: user.id, user_email: email, user_plan: plan ?? "Free" })
      .select("id, telegram_message_id")
      .single();
    if (error) return NextResponse.json({ error: "DB error." }, { status: 500 });
    thread = newThread;
  } else {
    await service
      .from("feedback_threads")
      .update({ user_plan: plan ?? "Free", last_message_at: new Date().toISOString() })
      .eq("id", thread.id);
  }

  // Save to DB
  const { error: msgError } = await service
    .from("feedback_messages")
    .insert({ thread_id: thread.id, content: message.trim(), is_owner_reply: false });

  if (msgError) return NextResponse.json({ error: "DB error." }, { status: 500 });

  // Send to Telegram
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const pageLine = page ? `\n🔗 ${page}` : "";
    // 🔑 marks the thread ID — used by webhook to find the thread
    const text = `💬 Feedback — English Nerd\n🔑 ${thread.id}\n\n${message.trim()}\n\n👤 ${email} · ${plan ?? "Free"}${pageLine}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: undefined,
        ...(thread.telegram_message_id
          ? { reply_to_message_id: thread.telegram_message_id }
          : {}),
      }),
    });

    if (tgRes.ok && !thread.telegram_message_id) {
      const tgData = await tgRes.json();
      await service
        .from("feedback_threads")
        .update({ telegram_message_id: tgData.result?.message_id })
        .eq("id", thread.id);
    }
  }

  return NextResponse.json({ ok: true });
}
