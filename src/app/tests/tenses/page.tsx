import TensesTestClient from "./TensesTestClient";

export const metadata = {
  title: "English Tenses Test — Which Tenses Do You Know? | English Nerd",
  description:
    "Free English tenses test — no registration required. Test all 12 tenses from Present Simple to Future Perfect Continuous and get an instant breakdown of which tenses you know.",
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
