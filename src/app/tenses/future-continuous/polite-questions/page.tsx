import type { Metadata } from "next";
import PoliteQuestionsClient from "./PoliteQuestionsClient";

export const metadata: Metadata = {
  title: "Future Continuous: Polite Questions — English Nerd",
  description:
    "Learn how to use Future Continuous for polite questions: 'Will you be using the car?' vs 'Will you use the car?' 40 multiple-choice questions. Free B1 English exercise.",
  alternates: { canonical: "/tenses/future-continuous/polite-questions" },
};

export default function Page() {
  return <PoliteQuestionsClient />;
}
