import type { Metadata } from "next";
import FuturePerfectContinuousQuizClient from "./FuturePerfectContinuousQuizClient";

export const metadata: Metadata = {
  title: "Future Perfect Continuous Quiz — English Nerd",
  description:
    "Practice the Future Perfect Continuous tense. Test will have been + verb-ing with multiple-choice questions. Free C1 interactive English exercise.",
  alternates: { canonical: "/tenses/future-perfect-continuous/quiz" },
};

export default function Page() {
  return <FuturePerfectContinuousQuizClient />;
}
