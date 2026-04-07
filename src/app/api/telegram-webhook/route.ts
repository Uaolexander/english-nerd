import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

function extractThreadId(text: string): string | null {
  const match = text.match(/🔑\s*([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
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

    if (!message?.reply_to_message) return NextResponse.json({ ok: true });

    // Extract thread ID from the original message (text or caption — handles photo replies)
    const originalText: string =
      message.reply_to_message.text ?? message.reply_to_message.caption ?? "";
    const threadId = extractThreadId(originalText);
    if (!threadId) return NextResponse.json({ ok: true });

    const isPhoto = Array.isArray(message.photo) && message.photo.length > 0;
    const replyText: string = (message.text ?? message.caption ?? "").trim();

    // Need at least text or photo
    if (!isPhoto && !replyText) return NextResponse.json({ ok: true });

    const service = createServiceClient();

    // Verify thread exists
    const { data: thread } = await service
      .from("feedback_threads")
      .select("id")
      .eq("id", threadId)
      .maybeSingle();

    if (!thread) return NextResponse.json({ ok: true });

    let imageUrl: string | null = null;

    if (isPhoto) {
      // Get largest photo
      const largest = message.photo[message.photo.length - 1];
      const token = process.env.TELEGRAM_BOT_TOKEN!;

      // Get file path from Telegram
      const fileRes = await fetch(
        `https://api.telegram.org/bot${token}/getFile?file_id=${largest.file_id}`
      );
      const fileData = await fileRes.json();
      const filePath: string = fileData.result?.file_path;

      if (filePath) {
        // Download from Telegram
        const imgRes = await fetch(
          `https://api.telegram.org/file/bot${token}/${filePath}`
        );
        if (imgRes.ok) {
          const imgBuffer = await imgRes.arrayBuffer();
          const ext = filePath.split(".").pop() ?? "jpg";
          const storagePath = `tg-${Date.now()}.${ext}`;

          const { error: uploadError } = await service.storage
            .from("feedback-images")
            .upload(storagePath, Buffer.from(imgBuffer), {
              contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
              upsert: false,
            });

          if (!uploadError) {
            const { data } = service.storage
              .from("feedback-images")
              .getPublicUrl(storagePath);
            imageUrl = data.publicUrl;
          }
        }
      }
    }

    // Save owner reply
    await service.from("feedback_messages").insert({
      thread_id: threadId,
      content: replyText,
      image_url: imageUrl,
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
