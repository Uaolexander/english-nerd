import { createServiceClient } from "@/lib/supabase/service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("app_session_token")?.value;

  if (sessionToken) {
    const service = createServiceClient();
    await service
      .from("user_sessions")
      .update({ is_active: false })
      .eq("session_token", sessionToken);

    cookieStore.delete("app_session_token");
  }

  return NextResponse.json({ ok: true });
}
