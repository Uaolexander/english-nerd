import type { Metadata } from "next";
import PresentPerfectQuizClient from "./PresentPerfectQuizClient";

export const metadata: Metadata = {
  title: "Present Perfect Quiz — English Nerd",
  description:
    "Test your knowledge of the Present Perfect tense with multiple-choice questions. Practice have/has + past participle, ever/never, just, already, yet. Free B1 interactive English exercise.",
  alternates: { canonical: "/tenses/present-perfect/quiz" },
};

export default function Page() {
  return <PresentPerfectQuizClient />;
}
