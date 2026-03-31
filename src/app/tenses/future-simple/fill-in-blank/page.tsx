import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Future Simple Fill in the Blank — English Nerd",
  description:
    "Type will / won't + base form to complete Future Simple sentences. Four exercise sets — affirmative, negative, questions, and mixed. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/future-simple/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
