import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Future Continuous Fill in the Blank — English Nerd",
  description:
    "Type the correct Future Continuous form of the verb. Practice will be + verb-ing in affirmative, negative, and question forms. Free B1 English exercise.",
  alternates: { canonical: "/tenses/future-continuous/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
