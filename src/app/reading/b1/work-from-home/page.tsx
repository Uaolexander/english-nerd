import type { Metadata } from "next";
import WorkFromHomeClient from "./WorkFromHomeClient";

export const metadata: Metadata = {
  title: "Work From Home | B1 Reading | English Nerd",
  description:
    "B1 reading exercise. Read the blog post about remote work and fill in the missing words.",
  alternates: { canonical: "/reading/b1/work-from-home" },
};

export default function WorkFromHomePage() {
  return <WorkFromHomeClient />;
}
