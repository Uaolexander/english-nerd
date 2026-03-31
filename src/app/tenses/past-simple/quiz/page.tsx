import type { Metadata } from "next";
import PastSimpleQuizClient from "./PastSimpleQuizClient";

export const metadata: Metadata = {
  title: "Past Simple Quiz — English Nerd",
  description:
    "Test your knowledge of the Past Simple tense with this multiple-choice quiz. Practice regular and irregular past forms, negatives, and questions. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/past-simple/quiz" },
};

export default function Page() {
  return <PastSimpleQuizClient />;
}
