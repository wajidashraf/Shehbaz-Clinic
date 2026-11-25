"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight, HiXMark } from "react-icons/hi2";

type GalleryImage = {
  src: string;
  alt: { en: string; ur: string };
};

const labels = {
  en: {
    open: "Preview image",
    title: "Clinic photo gallery",
    close: "Close gallery",
    previous: "Previous image",
    next: "Next image",
  },
  ur: {
    open: "تصویر بڑی کر کے دیکھیں",
    title: "کلینک کی تصاویر",
    close: "گیلری بند کریں",
    previous: "پچھلی تصویر",
    next: "اگلی تصویر",
  },
};

const controlClass =
  "fixed grid size-12 place-items-center rounded-full border border-white/25 bg-slate-950/60 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function PortfolioGallery({
  images,
  locale,
}: {
  images: readonly GalleryImage[];
  locale: "en" | "ur";
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const text = labels[locale];
  const open = selected !== null;
  const image = selected === null ? null : images[selected];

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current!;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0)
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarWidth}px`;
    Object.assign(body.style, {
      position: "fixed",
      top: `-${scrollY}px`,
      left: `-${scrollX}px`,
      width: "100%",
      overflow: "hidden",
    });
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>("button")?.focus();

    return () => {
      clearTimeout(closeTimer.current);
      dialog.close();
      Object.assign(body.style, previous);
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  function close() {
    if (closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setSelected(null);
      setClosing(false);
    }, 180);
  }

  function navigate(step: number) {
    if (closing) return;
    setSelected((current) =>
      current === null
        ? null
        : (current + step + images.length) % images.length,
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {images.map((item, index) => (
          <button
            aria-haspopup="dialog"
            aria-label={`${text.open}: ${item.alt[locale]}`}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--aqua-soft)] shadow-[0_8px_30px_-18px_rgba(18,48,53,0.32)] transition-shadow duration-300 hover:shadow-[0_18px_45px_-20px_rgba(18,48,53,0.5)] focus-visible:outline-offset-4"
            key={item.src}
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setSelected(index);
            }}
            type="button"
          >
            <Image
              alt={item.alt[locale]}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
              src={item.src}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--teal)]/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5 ring-inset"
            />
          </button>
        ))}
      </div>
      <dialog
        aria-label={text.title}
        aria-modal="true"
        className="portfolio-lightbox m-auto w-[calc(100%-2rem)] max-w-6xl overflow-visible border-0 bg-transparent p-0 text-white sm:w-[calc(100%-9rem)]"
        data-closing={closing || undefined}
        dir={locale === "ur" ? "rtl" : "ltr"}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (
            event.target === event.currentTarget ||
            event.target === event.currentTarget.querySelector("figure")
          )
            close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            const controls =
              event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            navigate(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            navigate(1);
          }
        }}
        ref={dialogRef}
      >
        {image && (
          <>
            <button
              aria-label={text.close}
              className={`${controlClass} right-4 top-[max(1rem,env(safe-area-inset-top))]`}
              onClick={close}
              type="button"
            >
              <HiXMark aria-hidden="true" className="size-6" />
            </button>
            <figure
              className="m-0"
              onTouchStart={(event) => {
                touchStart.current =
                  event.touches.length === 1
                    ? {
                        x: event.touches[0].clientX,
                        y: event.touches[0].clientY,
                      }
                    : null;
              }}
              onTouchMove={(event) => {
                if (event.touches.length !== 1) touchStart.current = null;
              }}
              onTouchCancel={() => {
                touchStart.current = null;
              }}
              onTouchEnd={(event) => {
                const start = touchStart.current;
                touchStart.current = null;
                if (!start || !event.changedTouches.length) return;
                const dx = event.changedTouches[0].clientX - start.x;
                const dy = event.changedTouches[0].clientY - start.y;
                if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy))
                  navigate(dx < 0 ? 1 : -1);
              }}
            >
              <Image
                alt={image.alt[locale]}
                className="portfolio-lightbox-image mx-auto block max-h-[calc(100dvh-10rem)] max-w-full rounded-lg object-contain shadow-2xl"
                height={1600}
                key={image.src}
                loading="eager"
                src={image.src}
                style={{ width: "auto", height: "auto" }}
                unoptimized
                width={1600}
              />
              <figcaption
                aria-atomic="true"
                aria-live="polite"
                className="mx-auto mt-4 max-w-xl space-y-1 px-12 text-center text-sm text-white/85"
              >
                <span className="block" dir="ltr">
                  {selected! + 1} / {images.length}
                </span>
                <span className="block">{image.alt[locale]}</span>
              </figcaption>
            </figure>
            {images.length > 1 && (
              <>
                <button
                  aria-label={text.previous}
                  className={`${controlClass} left-3 top-1/2 -translate-y-1/2 sm:left-5`}
                  onClick={() => navigate(-1)}
                  type="button"
                >
                  <HiChevronLeft aria-hidden="true" className="size-6" />
                </button>
                <button
                  aria-label={text.next}
                  className={`${controlClass} right-3 top-1/2 -translate-y-1/2 sm:right-5`}
                  onClick={() => navigate(1)}
                  type="button"
                >
                  <HiChevronRight aria-hidden="true" className="size-6" />
                </button>
              </>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
