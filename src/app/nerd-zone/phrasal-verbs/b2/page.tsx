import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import PhrasalVerbsB2Client from "./PhrasalVerbsB2Client";

export const metadata: Metadata = {
  title: "Phrasal Verbs B2 — Upper-Intermediate English | English Nerd",
  description: "Learn 12 high-frequency B2 phrasal verbs used in professional and academic English. Download a free printable worksheet with exercises and a full answer key.",
  keywords: ["phrasal verbs B2", "upper intermediate phrasal verbs", "B2 English worksheet", "advanced phrasal verbs exercises", "IELTS phrasal verbs"],
  alternates: { canonical: "/nerd-zone/phrasal-verbs/b2" },
  openGraph: {
    title: "Phrasal Verbs B2 — Upper-Intermediate English | English Nerd",
    description: "12 essential B2 phrasal verbs + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/phrasal-verbs/b2",
    type: "article",
  },
};

export default async function PhrasalVerbsB2Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  return <PhrasalVerbsB2Client isPro={isPro} />;
}
