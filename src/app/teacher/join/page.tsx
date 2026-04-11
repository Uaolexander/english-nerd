import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendStudentLinkedEmail } from "@/lib/email";

export const metadata: Metadata = {
  title: "Join Class — English Nerd",
  description: "Accept your teacher's invitation and join your English class on English Nerd.",
  robots: { index: false, follow: false },
};

export default async function TeacherJoinPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) redirect("/");

  const supabase = await createClient();
  const service = createServiceClient();

  // Look up the invite via service client (bypasses RLS — needed for unauthenticated visitors)
  const { data: invite } = await service
    .from("teacher_students")
    .select("id, teacher_id, invite_email, status")
    .eq("invite_token", token)
    .maybeSingle();

  if (!invite || invite.status === "removed") redirect("/");

  // Already accepted
  if (invite.status === "active") redirect("/account?joined=1");

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in → redirect to login with next param pointing back here
  if (!user) {
    const next = encodeURIComponent(`/teacher/join?token=${token}`);
    redirect(`/login?next=${next}`);
  }

  // Logged in but wrong email
  if (user.email?.toLowerCase() !== invite.invite_email.toLowerCase()) {
    redirect(`/teacher/join/wrong-email?token=${token}&expected=${encodeURIComponent(invite.invite_email)}&current=${encodeURIComponent(user.email ?? "")}`);
  }

  // ── Auto-accept ───────────────────────────────────────────────────────────

  await service
    .from("teacher_students")
    .update({
      student_id: user.id,
      status: "active",
      joined_at: new Date().toISOString(),
    })
    .eq("id", invite.id);

  // Send confirmation email (fire-and-forget)
  if (user.email) {
    try {
      const [{ data: studentProfile }, { data: teacherProfile }] = await Promise.all([
        service.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        service.from("profiles").select("full_name").eq("id", invite.teacher_id).maybeSingle(),
      ]);
      const studentName = (studentProfile?.full_name as string | null) ?? null;
      const teacherName = (teacherProfile?.full_name as string | null) ?? null;
      await sendStudentLinkedEmail(user.email, studentName, teacherName);
    } catch (e) {
      console.error("[teacher/join] email error:", e);
    }
  }

  redirect("/account?joined=1");
}
