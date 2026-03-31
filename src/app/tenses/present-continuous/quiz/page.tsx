import type { Metadata } from "next";
import PresentContinuousQuizClient from "./PresentContinuousQuizClient";

export const metadata: Metadata = {
  title: "Present Continuous Quiz — English Nerd",
  description:
    "Test your knowledge of the Present Continuous tense with this multiple-choice quiz. Practice am/is/are + verb-ing forms. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/present-continuous/quiz" },
};

export default function Page() {
  return <PresentContinuousQuizClient />;
}
