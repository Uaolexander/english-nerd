import type { Metadata } from "next";
import AnimalsClient from "./AnimalsClient";

export const metadata: Metadata = {
  title: "Animals — A1 Vocabulary — English Nerd",
  description:
    "A1 vocabulary exercises about animals. Three activities: multiple choice, choose the correct word, and fill in the blanks.",
  alternates: { canonical: "/vocabulary/a1/animals" },
};

export default function AnimalsPage() {
  return <AnimalsClient />;
}
