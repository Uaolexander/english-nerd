import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Present Continuous Spot the Mistake — English Nerd",
  description:
    "Find the grammar mistake in each Present Continuous sentence. Practice am/is/are + verb-ing forms, negatives, and questions. Free A2 English error-correction exercise.",
  alternates: { canonical: "/tenses/present-continuous/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
