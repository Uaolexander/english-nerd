import type { Metadata } from "next";
import ByTheTimeClient from "./ByTheTimeClient";

export const metadata: Metadata = {
  title: "Future Perfect: by the time / by then — English Nerd",
  description:
    "Practice Future Perfect with 'by the time', 'by then', and 'by + year'. 40 multiple-choice questions on the key deadline trigger words. Free B2 English exercise.",
  alternates: { canonical: "/tenses/future-perfect/by-the-time" },
};

export default function Page() {
  return <ByTheTimeClient />;
}
