import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Past Simple Fill in the Blank — English Nerd",
  description:
    "Practice the Past Simple tense by filling in the blanks. Type the correct past form of the verb in brackets. Free A2 interactive English writing exercise.",
  alternates: { canonical: "/tenses/past-simple/fill-in-blank" },
};

export default function Page() {
  return <FillInBlankClient />;
}
