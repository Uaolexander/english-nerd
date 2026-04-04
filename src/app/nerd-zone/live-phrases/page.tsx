import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import LivePhrasesA1Client from "./LivePhrasesA1Client";

export const metadata: Metadata = {
  title: "Live Phrases A1 — Everyday English Expressions | English Nerd",
  description: "Learn 24 essential A1-A2 everyday English expressions that native speakers use constantly. Download a free printable fill-in-the-blank worksheet with answer key.",
  keywords: ["live phrases A1", "everyday English expressions", "natural English phrases", "A1 English expressions", "beginner English phrases"],
  alternates: { canonical: "/nerd-zone/live-phrases" },
  openGraph: {
    title: "Live Phrases A1 — Everyday English Expressions | English Nerd",
    description: "24 essential A1-A2 everyday expressions + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/live-phrases",
    type: "article",
  },
};

export default async function LivePhrasesA1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;
  return <LivePhrasesA1Client isPro={isPro} />;
}
