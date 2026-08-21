"use client";

import { useEffect, useState, type ReactNode } from "react";

type HeaderScrollSurfaceProps = {
  children: ReactNode;
};

export function HeaderScrollSurface({
  children,
}: HeaderScrollSurfaceProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const nextScrolled = window.scrollY > 60;

      setIsScrolled((current) =>
        current === nextScrolled ? current : nextScrolled,
      );

      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`
        border-b
        transition-[background-color,border-color,box-shadow,backdrop-filter]
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          isScrolled
            ? `
              border-white/40
              bg-white/72
              shadow-[0_10px_35px_-18px_rgba(15,23,42,0.28)]
              backdrop-blur-xl
              backdrop-saturate-150
            `
            : `
              border-slate-200/80
              bg-[#fff]
              shadow-none
              backdrop-blur-none
            `
        }
      `}
    >
      {children}
    </div>
  );
}