import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTeacherStatus } from "@/lib/getTeacherStatus";
import { sendStudentInviteEmail } from "@/lib/email";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const teacher = await getTeacherStatus(supabase, user.id);
  if (!teacher.isTeacher) {
    return NextResponse.json({ ok: false, error: "Not a teacher account" }, { status: 403 });
  }

  const { email } = await req.json() as { email: string };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return NextResponse.json({ ok: false, error: "Invalid email address" }, { status: 400 });
  }

  // Prevent teacher from inviting themselves
  if (email.trim().toLowerCase() === user.email?.toLowerCase()) {
    return NextResponse.json({ ok: false, error: "You cannot invite yourself as a student" }, { status: 400 });
  }

  // Check student limit
  if (teacher.activeStudentCount >= teacher.studentLimit) {
    return NextResponse.json({
      ok: false,
      error: `Student limit reached (${teacher.studentLimit} for your plan)`,
    }, { status: 403 });
  }

  // Check if already invited or active
  const { data: existing } = await supabase
    .from("teacher_students")
    .select("id, status")
    .eq("teacher_id", user.id)
    .eq("invite_email", email.toLowerCase())
    .neq("status", "removed")
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      ok: false,
      error: existing.status === "active" ? "This student is already in your list" : "Invite already sent",
    }, { status: 409 });
  }

  // Try to resolve student_id from email (uses existing get_user_id_by_email RPC)
  const serviceSupabase = (await import("@/lib/supabase/service")).createServiceClient();
  const { data: studentIdRow } = await serviceSupabase.rpc("get_user_id_by_email", {
    lookup_email: email.toLowerCase(),
  });
  const studentId = studentIdRow ?? null;

  // Generate invite token (expires in 7 days)
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // If student has an account, set status to pending_student so they must confirm
  const newStatus = studentId ? "pending_student" : "pending";

  const { error } = await supabase.from("teacher_students").insert({
    teacher_id: user.id,
    student_id: studentId,
    invite_email: email.toLowerCase(),
    invite_token: token,
    invite_expires_at: expiresAt,
    status: newStatus,
    joined_at: null,
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/teacher/join?token=${token}`;

  // Send invitation email to student
  const teacherName = (user.user_metadata?.full_name as string | undefined) ?? null;
  try {
    await sendStudentInviteEmail(email.toLowerCase(), teacherName, inviteUrl, !!studentId);
  } catch (emailErr) {
    console.error("[teacher/invite] Failed to send invite email:", emailErr);
    // Don't fail the request — invite is created, email is best-effort
  }

  return NextResponse.json({
    ok: true,
    status: newStatus,
    inviteToken: token,
    inviteUrl,
  });
}
