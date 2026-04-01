import type { Metadata } from "next";
import SocialIssuesClient from "./SocialIssuesClient";

export const metadata: Metadata = {
  title: "Social Issues — B2 Vocabulary — English Nerd",
  description:
    "B2 vocabulary exercise: learn social issues vocabulary with three activities — multiple choice, choose the word, and fill in the blanks. 10 questions each, upper-intermediate level.",
  alternates: { canonical: "/vocabulary/b2/social-issues" },
};

export default function SocialIssuesPage() {
  return <SocialIssuesClient />;
}
