import type { Metadata } from "next";
import AdvancedMixPcClient from "./AdvancedMixPcClient";

export const metadata: Metadata = {
  title: "Present Continuous: Advanced Mix — English Nerd",
  description:
    "Advanced Present Continuous exercises: stative verbs with dual meanings, future arrangements, always with continuous for irritation, and tricky cases. 40 questions.",
  alternates: { canonical: "/tenses/present-continuous/ps-pc-advanced" },
};

export default function Page() {
  return <AdvancedMixPcClient />;
}
