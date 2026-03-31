import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Future Perfect Fill in the Blank — English Nerd",
  description:
    "Practice Future Perfect by writing will have + past participle. Four exercise sets — affirmative, negative, questions, and mixed. Free B2 English exercise.",
  alternates: { canonical: "/tenses/future-perfect/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
