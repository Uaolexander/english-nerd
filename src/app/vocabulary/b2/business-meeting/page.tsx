import type { Metadata } from "next";
import BusinessMeetingClient from "./BusinessMeetingClient";

export const metadata: Metadata = {
  title: "A Business Meeting — B2 Vocabulary — English Nerd",
  description:
    "B2 vocabulary exercise: read a business meeting dialogue and choose the correct word in each gap. 10 questions, upper-intermediate level.",
  alternates: { canonical: "/vocabulary/b2/business-meeting" },
};

export default function BusinessMeetingPage() {
  return <BusinessMeetingClient />;
}
