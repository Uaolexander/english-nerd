import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { token } = await req.json() as { token: string };
  if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });

  const { data: invite } = await supabase
    .from("teacher_students")
    .select("id, invite_email, status")
    .eq("invite_token", token)
    .maybeSingle();

  if (!invite) {
    return NextResponse.json({ ok: false, error: "Invalid or expired invite link" }, { status: 404 });
  }

  if (invite.status === "active") {
    return NextResponse.json({ ok: false, error: "Invite already accepted" }, { status: 409 });
  }

  if (invite.status === "declined") {
    return NextResponse.json({ ok: true }); // already declined — idempotent
  }

  if (user.email?.toLowerCase() !== invite.invite_email) {
    return NextResponse.json({
      ok: false,
      error: `This invite was sent to ${invite.invite_email}.`,
    }, { status: 403 });
  }

  const { error } = await supabase
    .from("teacher_students")
    .update({ status: "declined" })
    .eq("id", invite.id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
