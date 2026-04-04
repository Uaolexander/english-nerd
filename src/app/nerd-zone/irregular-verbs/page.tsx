import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import IrregularVerbsClient from "./IrregularVerbsClient";

export const metadata: Metadata = {
  title: "Irregular Verbs — Nerd Zone — English Nerd",
  description:
    "Top 50 essential irregular verb forms with 4 exercises, SpeedRound game and printable PDF worksheet. Know these and you'll handle almost any English text.",
  alternates: { canonical: "/nerd-zone/irregular-verbs" },
};

export default async function IrregularVerbsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  return <IrregularVerbsClient isPro={isPro} />;
}
