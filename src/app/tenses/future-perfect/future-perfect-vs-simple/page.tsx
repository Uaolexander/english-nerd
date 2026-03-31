import type { Metadata } from "next";
import FuturePerfectVsSimpleClient from "./FuturePerfectVsSimpleClient";

export const metadata: Metadata = {
  title: "Future Perfect vs Future Simple — English Nerd",
  description:
    "Master the difference between Future Perfect (will have done) and Future Simple (will do). 40 multiple-choice questions with mixed answers. Free B2 English exercise.",
  alternates: { canonical: "/tenses/future-perfect/future-perfect-vs-simple" },
};

export default function Page() {
  return <FuturePerfectVsSimpleClient />;
}
