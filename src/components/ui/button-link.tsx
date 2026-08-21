"use client";

import Link from "next/link";
import type { ReactNode, AnchorHTMLAttributes } from "react";

// ═══════════════════════════════════════════════════════════════
//  ButtonLink — Premium Dental Clinic Edition
//  Built for: Manrope Variable | Tailwind CSS v4 | Next.js App Router
// ═══════════════════════════════════════════════════════════════
//
//  Theme mapping (from your globals.css):
//  ───────────────────────────────────────
//  --ink          #123035   (primary text)
//  --primary-ink  #073047   (deep headings)
//  --teal         #2093e0   (brand blue — CTA bg)
//  --teal-dark    #00678f   (hover / active states)
//  --aqua         #d9f3fd   (selection / active tint)
//  --aqua-soft    #eefaff   (hover surface)
//  --mineral      #f7fcff   (page background)
//  --saffron      #a96812   (focus outline — accessibility)
//  --line         #cee6f0   (subtle borders)
//  --line-strong  #91c7dc   (visible borders)
//  --muted-text   #496469   (secondary text)
//  --danger       #a42121   (error states)
//
//  Motion curve:
//  ─────────────
//  cubic-bezier(0.22, 1, 0.36, 1)
//  → fast attack, luxuriously long deceleration (500 ms)
// ═══════════════════════════════════════════════════════════════

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "small" | "default" | "large";

interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  compactLabel?: string;
  external?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "default",
  icon,
  iconPosition = "right",
  compactLabel,
  external = false,
  disabled = false,
  className = "",
  onClick,
  ...rest
}: ButtonLinkProps) {
  // ── Size scale ────────────────────────────────────────────
  const sizeMap: Record<ButtonSize, string> = {
    small:  "min-h-9  px-3.5 py-2    text-xs   gap-1.5",
    default:"min-h-11 px-5   py-2.5  text-sm   gap-2",
    large:  "min-h-14 px-7   py-3.5  text-base gap-2.5",
  };

  // ── Variant palettes ──────────────────────────────────────
  const variantMap: Record<ButtonVariant, string> = {
    /* ═══ PRIMARY ═══
       Your exact specification — preserved verbatim.
       Bright blue CTA with diagonal shimmer sweep. */
    primary: `
      relative
      overflow-hidden
      border border-transparent

      bg-[var(--teal)]
      text-white

      shadow-[0_4px_14px_color-mix(in_srgb,var(--teal)_30%,transparent)]
      hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--teal)_45%,transparent)]

      hover:bg-[var(--teal-dark)]
      active:bg-[var(--teal-dark)]

      focus-visible:ring-[var(--teal-dark)]

      before:absolute
      before:inset-0
      before:-translate-x-full
      before:bg-gradient-to-r
      before:from-transparent
      before:via-white/10
      before:to-transparent

      hover:before:translate-x-full

      before:transition-transform
      before:duration-700
      before:ease-[cubic-bezier(0.4,0,0.2,1)]
    `,

    /* ═══ SECONDARY ═══
       Clean outline button for non-primary actions.
       Fills with soft aqua on hover. */
    secondary: `
      relative
      overflow-hidden
      border border-[var(--line-strong)]

      bg-white
      text-[var(--ink)]

      shadow-[0_1px_3px_color-mix(in_srgb,var(--ink)_4%,transparent)]
      hover:shadow-[0_4px_12px_color-mix(in_srgb,var(--teal)_10%,transparent)]

      hover:border-[var(--teal)]
      hover:bg-[var(--aqua-soft)]
      hover:text-[var(--teal-dark)]

      active:bg-[var(--aqua)]
      active:border-[var(--teal-dark)]

      focus-visible:ring-[var(--saffron)]

      before:absolute
      before:inset-0
      before:-translate-x-full
      before:bg-gradient-to-r
      before:from-transparent
      before:via-[var(--teal)]/5
      before:to-transparent

      hover:before:translate-x-full

      before:transition-transform
      before:duration-700
      before:ease-[cubic-bezier(0.4,0,0.2,1)]
    `,

    /* ═══ GHOST ═══
       Minimal footprint — ideal for footer links,
       pagination, or low-priority actions. */
    ghost: `
      border border-transparent
      bg-transparent
      text-[var(--muted-text)]

      hover:bg-[var(--mineral)]
      hover:text-[var(--ink)]

      active:bg-[var(--aqua-soft)]

      focus-visible:ring-[var(--saffron)]
    `,

    /* ═══ DANGER ═══
       Destructive actions: cancel appointment,
       delete account, revoke consent. */
    danger: `
      relative
      overflow-hidden
      border border-transparent

      bg-[var(--danger)]
      text-white

      shadow-[0_4px_14px_color-mix(in_srgb,var(--danger)_30%,transparent)]
      hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--danger)_45%,transparent)]

      hover:bg-[#8a1a1a]
      active:bg-[#7a1717]

      focus-visible:ring-[#8a1a1a]

      before:absolute
      before:inset-0
      before:-translate-x-full
      before:bg-gradient-to-r
      before:from-transparent
      before:via-white/10
      before:to-transparent

      hover:before:translate-x-full

      before:transition-transform
      before:duration-700
      before:ease-[cubic-bezier(0.4,0,0.2,1)]
    `,
  };

  // ── Motion & interaction base ─────────────────────────────
  const motionBase = `
    group
    inline-flex
    items-center
    justify-center
    rounded-xl
    text-center
    font-semibold
    tracking-[-0.01em]
    whitespace-nowrap
    select-none

    /* Premium easing — fast start, long luxurious deceleration */
    transition-all
    duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]

    /* Lift on hover */
    hover:-translate-y-[3px]

    /* Press feedback */
    active:translate-y-0
    active:scale-[0.985]
    active:duration-150

    /* Focus ring (box-shadow) — complements global :focus-visible outline */
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-offset-2
    focus-visible:ring-offset-[var(--mineral)]
  `;

  // ── Icon animation ────────────────────────────────────────
  const iconMotion = `
    inline-flex
    shrink-0
    transition-transform
    duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]
  `;

  const iconHoverOffset =
    iconPosition === "left"
      ? "group-hover:-translate-x-0.5"
      : "group-hover:translate-x-0.5";

  // ── Link behaviour ────────────────────────────────────────
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const ariaLabel =
    compactLabel && typeof children === "string" ? children : undefined;

  return (
    <Link
      href={disabled ? "#" : href}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={`
        ${motionBase}
        ${disabled ? "pointer-events-none opacity-40 grayscale" : ""}
        ${sizeMap[size]}
        ${variantMap[variant]}
        ${className}
      `}
      {...linkProps}
      {...rest}
    >
      {/* ── Icon (left) ─────────────────────────────────── */}
      {icon && iconPosition === "left" && (
        <span
          className={`${iconMotion} ${iconHoverOffset}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      {/* ── Label ───────────────────────────────────────── */}
      {compactLabel ? (
        <>
          <span className="sm:hidden">{compactLabel}</span>
          <span className="hidden sm:inline">{children}</span>
        </>
      ) : (
        children
      )}

      {/* ── Icon (right) ────────────────────────────────── */}
      {icon && iconPosition === "right" && (
        <span
          className={`${iconMotion} ${iconHoverOffset}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════
//  Usage Examples
// ═══════════════════════════════════════════════════════════════
/*
  import { ButtonLink } from "@/components/ButtonLink";

  // 1. Hero primary CTA
  <ButtonLink
    href="/book"
    variant="primary"
    size="large"
    icon={
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    }
  >
    Book Appointment
  </ButtonLink>

  // 2. Secondary outline
  <ButtonLink
    href="/services"
    variant="secondary"
    icon={
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    }
  >
    Explore Services
  </ButtonLink>

  // 3. Compact label for mobile header
  <ButtonLink href="/book" variant="primary" compactLabel="Book">
    Book Appointment
  </ButtonLink>

  // 4. Ghost footer link
  <ButtonLink href="/privacy" variant="ghost" size="small">
    Privacy Notice
  </ButtonLink>

  // 5. Danger — cancel action
  <ButtonLink href="/cancel" variant="danger" size="small">
    Cancel Appointment
  </ButtonLink>

  // 6. External directions
  <ButtonLink
    href="https://maps.google.com/?q=..."
    variant="secondary"
    external
    icon={
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    }
    iconPosition="left"
  >
    Get Directions
  </ButtonLink>

  // 7. Disabled state
  <ButtonLink href="/book" variant="primary" disabled>
    Fully Booked
  </ButtonLink>
*/
