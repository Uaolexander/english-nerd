import type { Metadata } from "next";
import WillBeIngClient from "./WillBeIngClient";

export const metadata: Metadata = {
  title: "Future Continuous: will be + -ing — English Nerd",
  description:
    "Master the 'will be + -ing' structure of the Future Continuous tense. 40 multiple-choice questions covering affirmative, negative, question forms and -ing spelling. Free B1 interactive English exercise.",
  alternates: { canonical: "/tenses/future-continuous/will-be-ing" },
};

export default function Page() {
  return <WillBeIngClient />;
}
