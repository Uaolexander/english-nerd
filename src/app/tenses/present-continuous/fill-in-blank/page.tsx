import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Present Continuous Fill in the Blank — English Nerd",
  description:
    "Fill in the gaps with the correct Present Continuous form. Practice am/is/are + verb-ing in affirmative, negative, and question sentences. Free A2 English exercise.",
  alternates: { canonical: "/tenses/present-continuous/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
