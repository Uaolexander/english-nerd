import type { Metadata } from "next";
import EthicsOfAiArtClient from "./EthicsOfAiArtClient";

export const metadata: Metadata = {
  title: "The Ethics of AI-Generated Art — C1 Listening — English Nerd",
  description:
    "C1 listening exercise: a dialogue between an illustrator and a gallery curator debating creativity, copyright, and the impact of AI on the art world. 12 True or False comprehension questions.",
  alternates: { canonical: "/listening/c1/ethics-of-ai-art" },
};

export default function EthicsOfAiArtPage() {
  return <EthicsOfAiArtClient />;
}
