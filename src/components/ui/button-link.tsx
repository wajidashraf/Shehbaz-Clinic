import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  children: ReactNode;
  compactLabel?: string;
  href: string;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  children,
  compactLabel,
  href,
  variant = "primary",
}: ButtonLinkProps) {
  const variantClass =
    variant === "primary"
      ? "bg-[var(--teal)] text-[var(--primary-ink)] hover:bg-[var(--teal-dark)] hover:text-white"
      : "border border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--teal)]";

  return (
    <Link
      aria-label={
        compactLabel && typeof children === "string" ? children : undefined
      }
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-3 text-center text-sm font-extrabold transition-[color,background-color,border-color,transform] hover:-translate-y-0.5 sm:px-5 ${variantClass}`}
      href={href}
    >
      {compactLabel ? (
        <>
          <span className="sm:hidden">{compactLabel}</span>
          <span className="hidden sm:inline">{children}</span>
        </>
      ) : (
        children
      )}
    </Link>
  );
}
