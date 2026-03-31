import { createServiceClient } from "@/lib/supabase/service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("app_session_token")?.value;

  // No token: user logged in before session tracking was introduced,
  // or is not logged in at all. Never kick — just report no token.
  if (!sessionToken) {
    return NextResponse.json({ ok: true, noToken: true });
  }

  const service = createServiceClient();

  const { data } = await service
    .from("user_sessions")
    .select("id, is_active")
    .eq("session_token", sessionToken)
    .single();

  // Token exists in cookie but was deactivated (someone else logged in) — kick
  if (!data || !data.is_active) {
    cookieStore.delete("app_session_token");
    return NextResponse.json({ kicked: true }, { status: 401 });
  }

  // All good — keep session alive
  await service
    .from("user_sessions")
    .update({ last_active: new Date().toISOString() })
    .eq("session_token", sessionToken);

  return NextResponse.json({ ok: true });
}
