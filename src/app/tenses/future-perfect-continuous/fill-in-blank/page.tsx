import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Future Perfect Continuous Fill in the Blank — English Nerd",
  description:
    "Write the correct Future Perfect Continuous form. Practice will have been + verb-ing in affirmative, negative, and question sentences. Free C1 English exercise.",
  alternates: { canonical: "/tenses/future-perfect-continuous/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
