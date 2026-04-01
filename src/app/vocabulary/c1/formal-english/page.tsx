import type { Metadata } from "next";
import FormalEnglishClient from "./FormalEnglishClient";

export const metadata: Metadata = {
  title: "Formal English — C1 Vocabulary — English Nerd",
  description:
    "C1 vocabulary exercises about formal and academic English. Three activities: multiple choice, choose the word, and fill in the blanks. Advanced level.",
  alternates: { canonical: "/vocabulary/c1/formal-english" },
};

export default function FormalEnglishPage() {
  return <FormalEnglishClient />;
}
