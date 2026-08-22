"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/v1/admin/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    }).catch(() => null);
    setBusy(false);
    if (!response?.ok) {
      setError(
        response?.status === 429
          ? "Too many attempts. Please wait and try again."
          : "Email or password is incorrect.",
      );
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={submit}>
      <label className="block font-bold">
        Email
        <input
          autoComplete="username"
          className="mt-2 min-h-12 w-full rounded-lg border border-[var(--line-strong)] bg-white px-4 outline-none focus:border-[var(--teal)]"
          name="email"
          required
          type="email"
        />
      </label>
      <label className="block font-bold">
        Password
        <input
          autoComplete="current-password"
          className="mt-2 min-h-12 w-full rounded-lg border border-[var(--line-strong)] bg-white px-4 outline-none focus:border-[var(--teal)]"
          name="password"
          required
          type="password"
        />
      </label>
      {error ? (
        <p className="text-sm font-bold text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="min-h-12 w-full rounded-full bg-[var(--teal)] px-5 font-extrabold text-[var(--primary-ink)] hover:bg-[var(--teal-dark)] hover:text-white disabled:cursor-wait disabled:opacity-60"
        disabled={busy}
        type="submit"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
