import type { Metadata } from "next";
import PastPerfectQuizClient from "./PastPerfectQuizClient";

export const metadata: Metadata = {
  title: "Past Perfect Quiz — Multiple Choice | English Nerd",
  description:
    "Practice Past Perfect with 40 multiple-choice questions. Choose had/hadn't/Had, past participle forms, and sequence of events.",
  alternates: { canonical: "/tenses/past-perfect/quiz" },
};

export default function Page() {
  return <PastPerfectQuizClient />;
}
