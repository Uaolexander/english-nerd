import type { Metadata } from "next";
import WillWontClient from "./WillWontClient";

export const metadata: Metadata = {
  title: "Future Simple: will / won't / Will I? — English Nerd",
  description:
    "Master will, won't and Will I? with 40 multiple-choice questions. Practice affirmative, negative and question forms of Future Simple. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/future-simple/will-wont" },
};

export default function Page() {
  return <WillWontClient />;
}
