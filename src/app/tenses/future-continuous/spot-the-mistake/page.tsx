import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Future Continuous Spot the Mistake — English Nerd",
  description:
    "Find and fix grammar mistakes in Future Continuous sentences. Practice will be + verb-ing error detection. Free B1 English exercise.",
  alternates: { canonical: "/tenses/future-continuous/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
