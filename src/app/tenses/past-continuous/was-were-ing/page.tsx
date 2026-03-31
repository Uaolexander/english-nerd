import type { Metadata } from "next";
import WasWereIngClient from "./WasWereIngClient";

export const metadata: Metadata = {
  title: "Past Continuous: was / were + -ing — English Nerd",
  description:
    "Master the structure of Past Continuous: was/were + verb-ing. Affirmative, negative, and questions with was and were. 40 interactive MCQ questions.",
  alternates: { canonical: "/tenses/past-continuous/was-were-ing" },
};

export default function Page() {
  return <WasWereIngClient />;
}
