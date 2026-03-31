import type { Metadata } from "next";
import PresentPerfectContinuousQuizClient from "./PresentPerfectContinuousQuizClient";

export const metadata: Metadata = {
  title: "Present Perfect Continuous Quiz — English Nerd",
  description:
    "Practice the Present Perfect Continuous tense with 40 multiple-choice questions. Test have/has been + verb-ing forms across affirmative, negative, question, and mixed sets.",
  alternates: { canonical: "/tenses/present-perfect-continuous/quiz" },
};

export default function Page() {
  return <PresentPerfectContinuousQuizClient />;
}
