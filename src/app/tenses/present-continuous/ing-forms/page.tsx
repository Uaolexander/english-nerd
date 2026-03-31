import type { Metadata } from "next";
import IngFormsClient from "./IngFormsClient";

export const metadata: Metadata = {
  title: "Present Continuous: -ing Spelling Rules — English Nerd",
  description:
    "Practice the -ing spelling rules for Present Continuous. stop→stopping, run→running, make→making, study→studying. 40 interactive questions.",
  alternates: { canonical: "/tenses/present-continuous/ing-forms" },
};

export default function Page() {
  return <IngFormsClient />;
}
