import type { Metadata } from "next";
import MyBodyClient from "./MyBodyClient";

export const metadata: Metadata = {
  title: "My Body — A1 Vocabulary — English Nerd",
  description:
    "A1 vocabulary exercises about body parts. Three activities: multiple choice, choose the word, and fill in the blanks.",
  alternates: { canonical: "/vocabulary/a1/my-body" },
};

export default function MyBodyPage() {
  return <MyBodyClient />;
}
