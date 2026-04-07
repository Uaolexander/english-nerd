import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TeacherJoinClient from "./TeacherJoinClient";

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
