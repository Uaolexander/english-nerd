import type { Metadata } from "next";
import FuturePerfectQuizClient from "./FuturePerfectQuizClient";

export const metadata: Metadata = {
  title: "Future Perfect Quiz — English Nerd",
  description:
    "Test your knowledge of the Future Perfect tense. Practice will have + past participle with multiple-choice questions. Free B2 interactive English exercise.",
  alternates: { canonical: "/tenses/future-perfect/quiz" },
};

export default function Page() {
  return <FuturePerfectQuizClient />;
}
