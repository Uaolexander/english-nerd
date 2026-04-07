import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  // Verify webhook secret if configured
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (header !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await req.json();
    const message = body.message;

    // Only process replies to messages
    if (!message?.reply_to_message?.text) {
      return NextResponse.json({ ok: true });
    }

    // Extract thread_id from the original message (marked with 🔑)
    const originalText: string = message.reply_to_message.text ?? "";
    const match = originalText.match(/🔑\s([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/);
    if (!match) return NextResponse.json({ ok: true });

    const threadId = match[1];
    const replyContent: string = (message.text ?? "").trim();
    if (!replyContent) return NextResponse.json({ ok: true });

    const service = createServiceClient();

    // Verify thread exists
    const { data: thread } = await service
      .from("feedback_threads")
      .select("id")
      .eq("id", threadId)
      .maybeSingle();

    if (!thread) return NextResponse.json({ ok: true });

    // Save owner reply
    await service.from("feedback_messages").insert({
      thread_id: threadId,
      content: replyContent,
      is_owner_reply: true,
      is_read: false,
    });

    await service
      .from("feedback_threads")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", threadId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
