import type { Metadata } from "next";
import AtFutureMomentClient from "./AtFutureMomentClient";

export const metadata: Metadata = {
  title: "Future Continuous: At a Future Moment — English Nerd",
  description:
    "Practice using the Future Continuous for actions in progress at a specific future moment. 40 MCQ covering time phrases like 'this time tomorrow' and 'at 3 PM'. Free B1 English exercise.",
  alternates: { canonical: "/tenses/future-continuous/at-future-moment" },
};

export default function Page() {
  return <AtFutureMomentClient />;
}
