import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TeacherJoinClient from "./TeacherJoinClient";

export default async function TeacherJoinPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) redirect("/");

  const supabase = await createClient();

  // Look up the invite
  const { data: invite } = await supabase
    .from("teacher_students")
    .select("id, teacher_id, invite_email, status")
    .eq("invite_token", token)
    .maybeSingle();

  if (!invite || invite.status === "removed") redirect("/");
  if (invite.status === "active") redirect("/account?joined=1");

  // Get teacher name
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <TeacherJoinClient
      token={token}
      inviteEmail={invite.invite_email}
      isLoggedIn={!!user}
      currentUserEmail={user?.email ?? null}
    />
  );
}
