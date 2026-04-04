import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import LivePhrasesB2Client from "./LivePhrasesB2Client";

export const metadata: Metadata = {
  title: "Live Phrases B2 — Upper-Intermediate English Expressions | English Nerd",
  description: "Learn 12 sophisticated B2 English expressions used in professional and academic English. Download a free printable worksheet with exercises and answer key.",
  keywords: ["live phrases B2", "upper intermediate English expressions", "B2 English phrases", "professional English expressions", "IELTS expressions"],
  alternates: { canonical: "/nerd-zone/live-phrases/b2" },
  openGraph: {
    title: "Live Phrases B2 — Upper-Intermediate English Expressions | English Nerd",
    description: "12 essential B2 everyday expressions + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/live-phrases/b2",
    type: "article",
  },
};

export default async function LivePhrasesB2Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;
  return <LivePhrasesB2Client isPro={isPro} />;
}
