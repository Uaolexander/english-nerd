import type { Metadata } from "next";
import AdvancedMixedClient from "./AdvancedMixedClient";

export const metadata: Metadata = {
  title: "Present Simple Advanced Mixed — English Nerd",
  description:
    "Challenge yourself with advanced Present Simple exercises: Wh- questions, tag questions, frequency adverbs, and subject questions. B1 English.",
  alternates: { canonical: "/tenses/present-simple/ps-pc-advanced" },
};

export default function Page() {
  return <AdvancedMixedClient />;
}
