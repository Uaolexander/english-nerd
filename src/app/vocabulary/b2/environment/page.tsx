import type { Metadata } from "next";
import EnvironmentClient from "./EnvironmentClient";

export const metadata: Metadata = {
  title: "The Environment — B2 Vocabulary — English Nerd",
  description:
    "B2 vocabulary exercise: learn environmental vocabulary with three activities — multiple choice, choose the word, and fill in the blanks. 10 questions each, upper-intermediate level.",
  alternates: { canonical: "/vocabulary/b2/environment" },
};

export default function EnvironmentPage() {
  return <EnvironmentClient />;
}
