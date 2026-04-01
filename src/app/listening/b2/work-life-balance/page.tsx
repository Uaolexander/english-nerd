import type { Metadata } from "next";
import WorkLifeBalanceClient from "./WorkLifeBalanceClient";

export const metadata: Metadata = {
  title: "Work-Life Balance — B2 Listening — English Nerd",
  description:
    "B2 listening exercise: a dialogue about burnout, long working hours and work-life balance. Watch the video and answer 10 True or False comprehension questions.",
  alternates: { canonical: "/listening/b2/work-life-balance" },
};

export default function WorkLifeBalancePage() {
  return <WorkLifeBalanceClient />;
}
