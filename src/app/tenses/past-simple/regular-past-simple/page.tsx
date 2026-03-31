import type { Metadata } from "next";
import RegularPastClient from "./RegularPastClient";

export const metadata: Metadata = {
  title: "Past Simple: Regular Verbs -ed Spelling — English Nerd",
  description:
    "Master the -ed spelling rules for Past Simple regular verbs. walk→walked, stop→stopped, study→studied, dance→danced. 40 interactive questions.",
  alternates: { canonical: "/tenses/past-simple/regular-past-simple" },
};

export default function Page() {
  return <RegularPastClient />;
}
