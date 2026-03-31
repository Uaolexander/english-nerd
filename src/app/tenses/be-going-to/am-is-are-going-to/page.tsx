import type { Metadata } from "next";
import AmIsAreGoingToClient from "./AmIsAreGoingToClient";

export const metadata: Metadata = {
  title: "Be Going To: am / is / are going to — English Nerd",
  description:
    "Master am, is, and are going to with 40 multiple-choice questions. Practise all forms: affirmative, negative (isn't/aren't), questions, and short answers. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/be-going-to/am-is-are-going-to" },
};

export default function Page() {
  return <AmIsAreGoingToClient />;
}
