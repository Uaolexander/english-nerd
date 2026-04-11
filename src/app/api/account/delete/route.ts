import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  // Delete the user — Supabase cascades to user_progress, user_sessions, certificates
  const { error } = await service.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("[account/delete] Supabase error:", error.message, "userId:", user.id);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
