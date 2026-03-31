import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Present Perfect Fill in the Blank — English Nerd",
  description:
    "Type the correct Present Perfect form of the verb in brackets. Practice have/has + past participle in affirmative, negative, question, and mixed exercises. Free B1 English exercise.",
  alternates: { canonical: "/tenses/present-perfect/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
