import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Past Continuous Fill in the Blank — English Nerd",
  description:
    "Type the correct Past Continuous form of the verb. Practice was/were + verb-ing in affirmative, negative, and question forms. Free A2 English exercise.",
  alternates: { canonical: "/tenses/past-continuous/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
