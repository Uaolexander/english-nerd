import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TeacherRedeemClient from "./TeacherRedeemClient";

export const metadata: Metadata = {
  title: "Activate Teacher Access — English Nerd",
};

export default async function TeacherRedeemPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/teacher/redeem");

  return <TeacherRedeemClient email={user.email ?? ""} />;
}
