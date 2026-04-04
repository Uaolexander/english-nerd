import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import PhrasalVerbsC1Client from "./PhrasalVerbsC1Client";

export const metadata: Metadata = {
  title: "Phrasal Verbs C1 — Advanced English | English Nerd",
  description: "Master 12 sophisticated C1 phrasal verbs for advanced English speakers. Download a free printable worksheet with challenging exercises and a full answer key.",
  keywords: ["phrasal verbs C1", "advanced phrasal verbs", "C1 English worksheet", "advanced English exercises", "CAE phrasal verbs", "C1 level English"],
  alternates: { canonical: "/nerd-zone/phrasal-verbs/c1" },
  openGraph: {
    title: "Phrasal Verbs C1 — Advanced English | English Nerd",
    description: "12 sophisticated C1 phrasal verbs + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/phrasal-verbs/c1",
    type: "article",
  },
};

export default async function PhrasalVerbsC1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  return <PhrasalVerbsC1Client isPro={isPro} />;
}
