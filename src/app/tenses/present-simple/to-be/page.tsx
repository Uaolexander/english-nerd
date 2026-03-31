import type { Metadata } from "next";
import AmIsAreClient from "./AmIsAreClient";

export const metadata: Metadata = {
  title: "Present Simple: am / is / are — English Nerd",
  description:
    "Practice the verb 'to be' in Present Simple. Choose am, is or are in affirmative, negative and question forms. Free A1 interactive English exercise.",
  alternates: { canonical: "/tenses/present-simple/to-be" },
};

export default function Page() {
  return <AmIsAreClient />;
}
