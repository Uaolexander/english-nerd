import type { Metadata } from "next";
import MediaTechnologyClient from "./MediaTechnologyClient";

export const metadata: Metadata = {
  title: "Media & Technology — B2 Vocabulary — English Nerd",
  description:
    "B2 vocabulary exercise: read a media and technology dialogue and choose the correct word in each gap. 10 questions, upper-intermediate level.",
  alternates: { canonical: "/vocabulary/b2/media-and-technology" },
};

export default function MediaTechnologyPage() {
  return <MediaTechnologyClient />;
}
