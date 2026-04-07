import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tour } = await req.json();
  if (!["pro", "teacher", "student"].includes(tour)) {
    return NextResponse.json({ error: "Invalid tour" }, { status: 400 });
  }

  const service = createServiceClient();
  const { error } = await service.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, [`${tour}_tour_done`]: true },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
