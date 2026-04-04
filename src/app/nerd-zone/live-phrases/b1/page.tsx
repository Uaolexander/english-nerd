import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import LivePhrasesB1Client from "./LivePhrasesB1Client";

export const metadata: Metadata = {
  title: "Live Phrases B1 — Intermediate English Expressions | English Nerd",
  description: "Master 12 essential B1 English expressions used in everyday conversations and the workplace. Download a free printable worksheet with exercises and answer key.",
  keywords: ["live phrases B1", "intermediate English expressions", "B1 English phrases", "everyday English B1", "natural English expressions"],
  alternates: { canonical: "/nerd-zone/live-phrases/b1" },
  openGraph: {
    title: "Live Phrases B1 — Intermediate English Expressions | English Nerd",
    description: "12 essential B1 everyday expressions + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/live-phrases/b1",
    type: "article",
  },
};

export default async function LivePhrasesB1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;
  return <LivePhrasesB1Client isPro={isPro} />;
}
