import type { Metadata } from "next";
import ForDurationFutureClient from "./ForDurationFutureClient";

export const metadata: Metadata = {
  title: "FPC: Duration Up to a Future Point — English Nerd",
  description:
    "40 questions about using for and since with Future Perfect Continuous to express how long an action will have been going on by a specific future point. Free C1 English exercise.",
  alternates: { canonical: "/tenses/future-perfect-continuous/for-duration-future" },
};

export default function Page() {
  return <ForDurationFutureClient />;
}
