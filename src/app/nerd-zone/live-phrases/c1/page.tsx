import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import LivePhrasesC1Client from "./LivePhrasesC1Client";

export const metadata: Metadata = {
  title: "Live Phrases C1 — Advanced English Expressions | English Nerd",
  description: "Master 12 sophisticated C1 English expressions used in journalism, business and intellectual discourse. Download a free printable worksheet with exercises and answer key.",
  keywords: ["live phrases C1", "advanced English expressions", "C1 English phrases", "idiomatic English C1", "CAE expressions"],
  alternates: { canonical: "/nerd-zone/live-phrases/c1" },
  openGraph: {
    title: "Live Phrases C1 — Advanced English Expressions | English Nerd",
    description: "12 sophisticated C1 everyday expressions + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/live-phrases/c1",
    type: "article",
  },
};

export default async function LivePhrasesC1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;
  return <LivePhrasesC1Client isPro={isPro} />;
}
