import type { Metadata } from "next";
import HadPastParticipleClient from "./HadPastParticipleClient";

export const metadata: Metadata = {
  title: "Past Perfect: had / hadn't / Had I? — English Nerd",
  description:
    "Master the auxiliary verb 'had' in Past Perfect: affirmatives, negatives with hadn't, and questions with Had. 40 interactive multiple-choice questions.",
  alternates: { canonical: "/tenses/past-perfect/had-past-participle" },
};

export default function Page() {
  return <HadPastParticipleClient />;
}
