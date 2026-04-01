import type { Metadata } from "next";
import LanguageAndThoughtClient from "./LanguageAndThoughtClient";

export const metadata: Metadata = {
  title: "Language and Thought | C1 Reading | English Nerd",
  description:
    "C1 reading exercise. Read the academic article about the relationship between language and cognition and fill in the missing words.",
  alternates: { canonical: "/reading/c1/language-and-thought" },
};

export default function LanguageAndThoughtPage() {
  return <LanguageAndThoughtClient />;
}
