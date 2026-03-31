import type { Metadata } from "next";
import PresentSimpleQuizClient from "./PresentSimpleQuizClient";

export const metadata: Metadata = {
  title: "Present Simple Quiz — Multiple Choice — English Nerd",
  description:
    "Practice Present Simple with 40 multiple choice questions. Affirmative, negative and question forms. Free A1 English exercise with instant feedback.",
  alternates: { canonical: "/tenses/present-simple/quiz" },
};

export default function Page() {
  return <PresentSimpleQuizClient />;
}

