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

  // Try admin API first
  const { error: adminError } = await service.auth.admin.deleteUser(user.id);

  if (!adminError) {
    return NextResponse.json({ ok: true });
  }

  console.error("[account/delete] admin.deleteUser failed:", adminError.message, "— trying raw SQL");

  // Fallback: delete directly via SQL (cascades to all related tables)
  const { error: sqlError } = await service.rpc("delete_user_by_id", { target_user_id: user.id });

  if (sqlError) {
    console.error("[account/delete] SQL fallback failed:", sqlError.message, "userId:", user.id);
    return NextResponse.json({ ok: false, error: sqlError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
