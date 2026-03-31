import type { Metadata } from "next";
import WhenWhileClient from "./WhenWhileClient";

export const metadata: Metadata = {
  title: "Past Continuous: when vs while — English Nerd",
  description:
    "Master the difference between 'when' and 'while' in Past Continuous sentences. Interrupted actions and simultaneous actions. 40 MCQ questions.",
  alternates: { canonical: "/tenses/past-continuous/when-while" },
};

export default function Page() {
  return <WhenWhileClient />;
}
