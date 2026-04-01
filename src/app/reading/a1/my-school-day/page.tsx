import type { Metadata } from "next";
import MySchoolDayClient from "./MySchoolDayClient";

export const metadata: Metadata = {
  title: "My School Day — A1 Reading — English Nerd",
  description:
    "A1 reading exercise. Read about Emma's school day and answer comprehension questions.",
  alternates: { canonical: "/reading/a1/my-school-day" },
};

export default function MySchoolDayPage() {
  return <MySchoolDayClient />;
}
