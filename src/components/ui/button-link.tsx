import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
}: ButtonLinkProps) {
  const variantClass =
    variant === "primary"
      ? "bg-[var(--teal)] text-white hover:bg-[var(--teal-dark)]"
      : "border border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--teal)]";

  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition-colors ${variantClass}`}
      href={href}
    >
      {children}
    </Link>
  );
}
