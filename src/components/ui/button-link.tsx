"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonSize = "small" | "default" | "large";

interface ButtonLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
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
  /* =========================================================
     BUTTON SIZE
  ========================================================= */

  const sizeMap: Record<ButtonSize, string> = {
    small: `
      min-h-9
      gap-1.5
      px-3.5
      py-2
      text-xs
    `,

    default: `
      min-h-11
      gap-2
      px-5
      py-2.5
      text-sm
    `,

    large: `
      min-h-14
      gap-2.5
      px-7
      py-3.5
      text-base
    `,
  };

  /* =========================================================
     BUTTON VARIANTS
  ========================================================= */

  const variantMap: Record<ButtonVariant, string> = {
    /* -------------------------------------------------------
       PRIMARY
    ------------------------------------------------------- */

    primary: `
      border
      border-transparent

      bg-[var(--teal)]
      text-white

      shadow-[0_4px_14px_color-mix(in_srgb,var(--teal)_24%,transparent)]

      hover:bg-[var(--teal-dark)]

      hover:shadow-[0_10px_26px_color-mix(in_srgb,var(--teal)_38%,transparent)]

      active:bg-[var(--teal-dark)]

      focus-visible:ring-[var(--teal-dark)]

    `,

    /* -------------------------------------------------------
       SECONDARY
    ------------------------------------------------------- */

    secondary: `
      border
      border-[var(--line-strong)]

      bg-white
      text-[var(--ink)]

      shadow-[0_2px_6px_color-mix(in_srgb,var(--ink)_5%,transparent)]

      hover:border-[var(--teal)]
      hover:bg-[var(--aqua-soft)]
      hover:text-[var(--teal-dark)]

      hover:shadow-[0_8px_22px_color-mix(in_srgb,var(--teal)_13%,transparent)]

      active:border-[var(--teal-dark)]
      active:bg-[var(--aqua)]

      focus-visible:ring-[var(--saffron)]

    `,

    /* -------------------------------------------------------
       GHOST
    ------------------------------------------------------- */

    ghost: `
      border
      border-transparent

      bg-transparent
      text-[var(--muted-text)]

      shadow-none

      hover:bg-[var(--mineral)]
      hover:text-[var(--ink)]

      hover:shadow-[0_6px_18px_color-mix(in_srgb,var(--ink)_6%,transparent)]

      active:bg-[var(--aqua-soft)]

      focus-visible:ring-[var(--saffron)]
    `,

    /* -------------------------------------------------------
       DANGER
    ------------------------------------------------------- */

    danger: `
      border
      border-transparent

      bg-[var(--danger)]
      text-white

      shadow-[0_4px_14px_color-mix(in_srgb,var(--danger)_24%,transparent)]

      hover:bg-[#8a1a1a]

      hover:shadow-[0_10px_26px_color-mix(in_srgb,var(--danger)_38%,transparent)]

      active:bg-[#7a1717]

      focus-visible:ring-[#8a1a1a]

    `,
  };

  /* =========================================================
     PREMIUM MOTION
  ========================================================= */

  const motionBase = `
  group inline-flex items-center justify-center rounded-lg text-center font-semibold tracking-[-0.01em] whitespace-nowrap select-none
  transition-[background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mineral)] motion-reduce:transition-none
`;

  /* =========================================================
     ICON MOTION
  ========================================================= */

  const iconMotion = `
    relative
    z-10

    inline-flex
    shrink-0

  `;

  /* =========================================================
     EXTERNAL LINK
  ========================================================= */

  const linkProps = external
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  /* =========================================================
     ACCESSIBILITY
  ========================================================= */

  const ariaLabel =
    compactLabel && typeof children === "string" ? children : undefined;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Link
      aria-disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${motionBase}

        ${
          disabled
            ? `
              pointer-events-none
              opacity-40
              grayscale
            `
            : ""
        }

        ${sizeMap[size]}
        ${variantMap[variant]}
        ${className}
      `}
      href={disabled ? "#" : href}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : 0}
      {...linkProps}
      {...rest}
    >
      {/* =====================================================
          LEFT ICON
      ===================================================== */}

      {icon && iconPosition === "left" && (
        <span
          aria-hidden="true"
          className={`
            ${iconMotion}
          `}
        >
          {icon}
        </span>
      )}

      {/* =====================================================
          LABEL
      ===================================================== */}

      <span className="relative z-10">
        {compactLabel ? (
          <>
            <span className="sm:hidden">{compactLabel}</span>

            <span className="hidden sm:inline">{children}</span>
          </>
        ) : (
          children
        )}
      </span>

      {/* =====================================================
          RIGHT ICON
      ===================================================== */}

      {icon && iconPosition === "right" && (
        <span
          aria-hidden="true"
          className={`
            ${iconMotion}
          `}
        >
          {icon}
        </span>
      )}
    </Link>
  );
}
