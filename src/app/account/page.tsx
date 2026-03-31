import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "My Account — English Nerd",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AccountClient
      email={user.email ?? ""}
      fullName={user.user_metadata?.full_name ?? ""}
      avatarUrl={user.user_metadata?.avatar_url ?? ""}
      createdAt={user.created_at}
      provider={user.app_metadata?.provider ?? "email"}
    />
  );
}
