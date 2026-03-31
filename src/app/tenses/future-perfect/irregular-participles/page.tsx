import type { Metadata } from "next";
import IrregularParticiplesClient from "./IrregularParticiplesClient";

export const metadata: Metadata = {
  title: "Future Perfect: Irregular Past Participles — English Nerd",
  description:
    "Practice irregular past participles in Future Perfect context ('will have + pp'). 40 questions covering go/see/do, -en group, -ought/-aught group, and same-form verbs. Free B2 English exercise.",
  alternates: { canonical: "/tenses/future-perfect/irregular-participles" },
};

export default function Page() {
  return <IrregularParticiplesClient />;
}
