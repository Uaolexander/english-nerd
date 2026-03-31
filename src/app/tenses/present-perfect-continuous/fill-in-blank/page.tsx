import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Present Perfect Continuous Fill in the Blank — English Nerd",
  description:
    "Type the correct Present Perfect Continuous form of the verb in brackets. Practice have/has been + verb-ing in affirmative, negative, question, and mixed sets.",
  alternates: { canonical: "/tenses/present-perfect-continuous/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
