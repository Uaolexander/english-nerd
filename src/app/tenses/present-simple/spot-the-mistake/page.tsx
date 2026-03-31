import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Present Simple Spot the Mistake — English Nerd",
  description:
    "Find the grammar mistake in each Present Simple sentence. Practice he/she/it forms, negatives, and questions. Free A1 English error-correction exercise.",
  alternates: { canonical: "/tenses/present-simple/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
