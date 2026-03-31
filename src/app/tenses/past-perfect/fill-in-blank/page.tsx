import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Past Perfect Fill in the Blank | English Nerd",
  description:
    "Practice Past Perfect with 40 fill-in-the-blank exercises. Type had + past participle, hadn't + past participle, or question forms to complete each sentence.",
  alternates: { canonical: "/tenses/past-perfect/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
