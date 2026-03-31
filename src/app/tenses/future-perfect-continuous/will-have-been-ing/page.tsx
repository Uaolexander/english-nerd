import type { Metadata } from "next";
import WillHaveBeenIngClient from "./WillHaveBeenIngClient";

export const metadata: Metadata = {
  title: "Future Perfect Continuous: will have been + -ing — English Nerd",
  description:
    "40 questions to master will have been + -ing: form the Future Perfect Continuous correctly across positive, negative, and question structures. Free C1 English exercise.",
  alternates: { canonical: "/tenses/future-perfect-continuous/will-have-been-ing" },
};

export default function Page() {
  return <WillHaveBeenIngClient />;
}
