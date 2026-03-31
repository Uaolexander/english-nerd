import type { Metadata } from "next";
import FutureContinuousQuizClient from "./FutureContinuousQuizClient";

export const metadata: Metadata = {
  title: "Future Continuous Quiz — English Nerd",
  description:
    "Practice the Future Continuous tense with multiple-choice questions. Test your knowledge of will be + verb-ing forms. Free B1 interactive English exercise.",
  alternates: { canonical: "/tenses/future-continuous/quiz" },
};

export default function Page() {
  return <FutureContinuousQuizClient />;
}
