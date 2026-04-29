import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendStudentLinkedEmail } from "@/lib/email";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { token } = await req.json() as { token: string };
  if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });

  const { data: invite } = await supabase
    .from("teacher_students")
    .select("id, teacher_id, invite_email, status, student_id, invite_expires_at")
    .eq("invite_token", token)
    .maybeSingle();

  if (!invite) {
    return NextResponse.json({ ok: false, error: "Invalid or expired invite link" }, { status: 404 });
  }

  if (invite.status === "active") {
    return NextResponse.json({ ok: false, error: "Invite already accepted" }, { status: 409 });
  }

  if (invite.status === "removed") {
    return NextResponse.json({ ok: false, error: "This invite is no longer valid" }, { status: 410 });
  }

  if (invite.invite_expires_at && new Date() > new Date(invite.invite_expires_at)) {
    return NextResponse.json({ ok: false, error: "This invite link has expired. Please ask your teacher to send a new invitation." }, { status: 410 });
  }

  // Verify the logged-in user's email matches the invite email
  if (user.email?.toLowerCase() !== invite.invite_email) {
    return NextResponse.json({
      ok: false,
      error: "This invitation was sent to a different email address. Please sign in with the correct account.",
    }, { status: 403 });
  }

  const { error } = await supabase
    .from("teacher_students")
    .update({
      student_id: user.id,
      status: "active",
      joined_at: new Date().toISOString(),
    })
    .eq("id", invite.id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Send student-linked email (fire-and-forget)
  if (user.email) {
    void (async () => {
      try {
        // Get student's own name from profiles
        const { data: studentProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();
        // Get teacher's name from profiles
        const { data: teacherProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", invite.teacher_id)
          .maybeSingle();
        const studentName = (studentProfile?.full_name as string | null) ?? null;
        const teacherName = (teacherProfile?.full_name as string | null) ?? null;
        await sendStudentLinkedEmail(user.email!, studentName, teacherName);
      } catch (e) {
        console.error("[invite/accept] email error:", e);
      }
    })();
  }

  return NextResponse.json({ ok: true });
}
