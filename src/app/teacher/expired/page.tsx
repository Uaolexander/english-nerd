import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Subscription Expired — English Nerd",
  description: "Your Teacher subscription has expired. Renew to restore access.",
  robots: { index: false, follow: false },
};

export default async function TeacherExpiredPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
            <svg className="h-8 w-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
        </div>
        <h1 className="mb-3 text-2xl font-black text-slate-900">Subscription Expired</h1>
        <p className="mb-2 text-slate-600">Your Teacher subscription has expired.</p>
        <p className="mb-6 text-sm text-slate-500">
          Don't worry — all your student data, classes, and assignments are safely stored.
          Renew your subscription to get back full access instantly.
        </p>
        <Link
          href="/pro"
          className="block w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
        >
          Renew Teacher Plan
        </Link>
        <Link href="/account" className="mt-3 block text-sm text-slate-400 hover:text-slate-600 transition">
          Back to Account
        </Link>
      </div>
    </main>
  );
}
