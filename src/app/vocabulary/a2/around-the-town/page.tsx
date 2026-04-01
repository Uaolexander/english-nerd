import type { Metadata } from "next";
import AroundTheTownClient from "./AroundTheTownClient";

export const metadata: Metadata = {
  title: "Around the Town — A2 Vocabulary — English Nerd",
  description:
    "A2 vocabulary exercises about places in town and directions. Three activities: multiple choice, choose the correct word, and fill in the blanks.",
  alternates: { canonical: "/vocabulary/a2/around-the-town" },
};

export default function AroundTheTownPage() {
  return <AroundTheTownClient />;
}
