import type { Metadata } from "next";
import WillHavePastParticipleClient from "./WillHavePastParticipleClient";

export const metadata: Metadata = {
  title: "Future Perfect: will have + past participle — English Nerd",
  description:
    "Master the Future Perfect structure: will have + past participle. 40 MCQ covering affirmative, negative, question forms, and choosing correct past participles. Free B2 English exercise.",
  alternates: { canonical: "/tenses/future-perfect/will-have-past-participle" },
};

export default function Page() {
  return <WillHavePastParticipleClient />;
}
