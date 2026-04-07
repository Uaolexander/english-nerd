import TensesTestClient from "./TensesTestClient";

export const metadata = {
  title: "English Tenses Test (A1–B2) – Free Grammar Quiz with Answers",
  description:
    "Free English tenses quiz — no registration required. Test all 12 tenses from Present Simple to Future Perfect Continuous and get instant answers with a full breakdown.",
  keywords: [
    "english tenses test",
    "tenses quiz",
    "test my tenses",
    "english grammar tenses",
    "present simple test",
    "past tenses test",
    "future tenses test",
  ],
  alternates: { canonical: "/tests/tenses" },
};

export default function TensesTestPage() {
  return <TensesTestClient />;
}
