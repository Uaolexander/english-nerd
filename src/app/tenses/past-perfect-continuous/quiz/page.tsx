import type { Metadata } from "next";
import PastPerfectContinuousQuizClient from "./PastPerfectContinuousQuizClient";

export const metadata: Metadata = {
  title: "Past Perfect Continuous Quiz — Multiple Choice | English Nerd",
  description:
    "Practice Past Perfect Continuous with 40 multiple-choice questions: had been + -ing forms, affirmative, negative, questions, and real-context sentences.",
  alternates: { canonical: "/tenses/past-perfect-continuous/quiz" },
};

export default function Page() {
  return <PastPerfectContinuousQuizClient />;
}
