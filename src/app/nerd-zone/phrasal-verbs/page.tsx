import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import PhrasalVerbsA1Client from "./PhrasalVerbsA1Client";

export const metadata: Metadata = {
  title: "Phrasal Verbs A1 — Beginner English | English Nerd",
  description: "Learn 12 essential A1 phrasal verbs with meanings and examples. Download a free printable fill-in-the-blank worksheet with answer key — perfect for beginners.",
  keywords: ["phrasal verbs A1", "beginner phrasal verbs", "English phrasal verbs worksheet", "A1 English exercises", "learn phrasal verbs"],
  alternates: { canonical: "/nerd-zone/phrasal-verbs" },
  openGraph: {
    title: "Phrasal Verbs A1 — Beginner English | English Nerd",
    description: "12 essential A1 phrasal verbs + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/phrasal-verbs",
    type: "article",
  },
};

export default async function PhrasalVerbsA1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  return <PhrasalVerbsA1Client isPro={isPro} />;
}
