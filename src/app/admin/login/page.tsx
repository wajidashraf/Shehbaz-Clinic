import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getCurrentAdmin } from "@/modules/auth/admin-session.server";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");

  return (
    <main className="grid min-h-dvh place-items-center bg-[var(--mineral)] px-4 py-12">
      <section className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-white p-7 shadow-[0_24px_70px_-44px_rgba(18,48,53,0.55)] sm:p-9">
        <span className="grid size-12 place-items-center rounded-[40%] bg-[var(--teal)] font-extrabold text-white">
          S
        </span>
        <p className="mt-7 text-xs font-extrabold tracking-[0.16em] text-[var(--teal-dark)] uppercase">
          Protected administration
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.045em]">
          Admin sign in
        </h1>
        <p className="mt-3 leading-7 text-[var(--muted-text)]">
          Manage dentist schedules and confirmed appointments.
        </p>
        <AdminLoginForm />
        <Link
          className="mt-6 inline-flex min-h-11 items-center font-bold text-[var(--teal-dark)]"
          href="/en"
        >
          Return to website
        </Link>
      </section>
    </main>
  );
}
