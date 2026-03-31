import type { Metadata } from "next";
import PastContinuousQuizClient from "./PastContinuousQuizClient";

export const metadata: Metadata = {
  title: "Past Continuous Quiz — English Nerd",
  description:
    "Practice the Past Continuous tense with multiple-choice questions. Was/were + verb-ing forms. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/past-continuous/quiz" },
};

export default function Page() {
  return <PastContinuousQuizClient />;
}
