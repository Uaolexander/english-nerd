import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import PhrasalVerbsB1Client from "./PhrasalVerbsB1Client";

export const metadata: Metadata = {
  title: "Phrasal Verbs B1 — Intermediate English | English Nerd",
  description: "Master 12 essential B1 phrasal verbs for intermediate English learners. Download a free printable worksheet with 10 fill-in-the-blank exercises and an answer key.",
  keywords: ["phrasal verbs B1", "intermediate phrasal verbs", "B1 English worksheet", "phrasal verbs exercises", "intermediate English"],
  alternates: { canonical: "/nerd-zone/phrasal-verbs/b1" },
  openGraph: {
    title: "Phrasal Verbs B1 — Intermediate English | English Nerd",
    description: "12 essential B1 phrasal verbs + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/phrasal-verbs/b1",
    type: "article",
  },
};

export default async function PhrasalVerbsB1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  return <PhrasalVerbsB1Client isPro={isPro} />;
}
