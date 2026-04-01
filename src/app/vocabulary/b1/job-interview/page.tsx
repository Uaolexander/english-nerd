import type { Metadata } from "next";
import JobInterviewClient from "./JobInterviewClient";

export const metadata: Metadata = {
  title: "A Job Interview — B1 Vocabulary — English Nerd",
  description:
    "B1 vocabulary exercise: read a job interview dialogue and choose the correct word in each gap. 10 questions, intermediate level.",
  alternates: { canonical: "/vocabulary/b1/job-interview" },
};

export default function JobInterviewPage() {
  return <JobInterviewClient />;
}
