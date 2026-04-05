import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/student/teacher-link
 * Body: { action: "accept" | "reject", linkId: string }
 * Accept or reject a pending teacher invite. Also handles "unlink" for active links.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { action, linkId } = await req.json() as { action: "accept" | "reject" | "unlink"; linkId: string };
  if (!action || !linkId) return NextResponse.json({ ok: false, error: "action and linkId required" }, { status: 400 });

  const svc = createServiceClient();

  // Verify the link belongs to this student
  const { data: link } = await svc
    .from("teacher_students")
    .select("id, student_id, status")
    .eq("id", linkId)
    .maybeSingle();

  if (!link || link.student_id !== user.id) {
    return NextResponse.json({ ok: false, error: "Link not found" }, { status: 404 });
  }

  if (action === "accept") {
    if (link.status !== "pending_student") {
      return NextResponse.json({ ok: false, error: "Nothing to accept" }, { status: 409 });
    }
    const { error } = await svc.from("teacher_students").update({ status: "active", joined_at: new Date().toISOString() }).eq("id", linkId);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "reject" || action === "unlink") {
    const { error } = await svc.from("teacher_students").update({ status: "removed" }).eq("id", linkId);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
