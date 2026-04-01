import type { Metadata } from "next";
import AttentionEconomyClient from "./AttentionEconomyClient";

export const metadata: Metadata = {
  title: "The Attention Economy | C1 Reading | English Nerd",
  description:
    "C1 reading exercise. Read the analytical essay about how tech companies compete for human attention.",
  alternates: { canonical: "/reading/c1/the-attention-economy" },
};

export default function AttentionEconomyPage() {
  return <AttentionEconomyClient />;
}
