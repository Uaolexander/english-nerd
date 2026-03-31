import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Be Going To — Fill in the Blank — English Nerd",
  description:
    "Type the correct 'be going to' form of the verb in brackets. Practice affirmative, negative, and question forms with 40 exercises.",
  alternates: { canonical: "/tenses/be-going-to/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
