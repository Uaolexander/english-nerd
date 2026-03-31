import type { Metadata } from "next";
import DidDidntClient from "./DidDidntClient";

export const metadata: Metadata = {
  title: "Past Simple: did / didn't / Did I? — English Nerd",
  description:
    "Master the auxiliary verb 'did' in Past Simple: negatives with didn't and questions with Did. 40 interactive multiple-choice questions.",
  alternates: { canonical: "/tenses/past-simple/did-didnt" },
};

export default function Page() {
  return <DidDidntClient />;
}
