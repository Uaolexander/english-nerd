import type { Metadata } from "next";
import WillVsWillBeIngClient from "./WillVsWillBeIngClient";

export const metadata: Metadata = {
  title: "Future Continuous: will vs will be doing — English Nerd",
  description:
    "Master the difference between 'will' and 'will be doing': single events vs ongoing actions. 40 multiple-choice questions. Free B1 English exercise.",
  alternates: { canonical: "/tenses/future-continuous/will-vs-will-be-ing" },
};

export default function Page() {
  return <WillVsWillBeIngClient />;
}
