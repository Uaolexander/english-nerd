import type { Metadata } from "next";
import FutureSimpleQuizClient from "./FutureSimpleQuizClient";

export const metadata: Metadata = {
  title: "Future Simple Quiz — English Nerd",
  description:
    "Practice the Future Simple tense (will) with multiple-choice questions. Test will/won't + base form, questions, short answers, and will vs be going to. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/future-simple/quiz" },
};

export default function Page() {
  return <FutureSimpleQuizClient />;
}
