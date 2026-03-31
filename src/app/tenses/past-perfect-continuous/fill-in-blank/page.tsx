import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Past Perfect Continuous Fill in the Blank | English Nerd",
  description:
    "Practice Past Perfect Continuous with 40 fill-in-the-blank exercises. Type had been + -ing, hadn't been + -ing, or question forms to complete each sentence.",
  alternates: { canonical: "/tenses/past-perfect-continuous/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
