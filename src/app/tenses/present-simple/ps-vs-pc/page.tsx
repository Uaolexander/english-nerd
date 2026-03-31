import type { Metadata } from "next";
import SimpleVsContinuousClient from "./SimpleVsContinuousClient";

export const metadata: Metadata = {
  title: "Present Simple vs Present Continuous — English Nerd",
  description:
    "Learn when to use Present Simple or Present Continuous. Practice choosing the right tense with context clues and stative verbs. A2 English exercise.",
  alternates: { canonical: "/tenses/present-simple/ps-vs-pc" },
};

export default function Page() {
  return <SimpleVsContinuousClient />;
}
