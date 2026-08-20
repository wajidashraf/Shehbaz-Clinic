"use client";

import { useState } from "react";
import { ServiceCard } from "@/components/content/service-card";
import type { DemoService } from "@/content/demo-content";
import { getLocalizedText } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";

type ServicesDirectoryProps = {
  labels: {
    all: string;
    book: string;
    duration: string;
    minutes: string;
  };
  locale: Locale;
  services: readonly DemoService[];
};

export function ServicesDirectory({
  labels,
  locale,
  services,
}: ServicesDirectoryProps) {
  const [category, setCategory] = useState("all");
  const categories = Array.from(
    new Map(
      services.map((service) => [service.category.en, service.category]),
    ).values(),
  );
  const visibleServices =
    category === "all"
      ? services
      : services.filter((service) => service.category.en === category);

  return (
    <>
      <div className="sticky top-[4.75rem] z-30 border-y border-[var(--line)] bg-[var(--mineral)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-4 sm:flex-wrap sm:px-6 lg:px-8">
          <button
            aria-pressed={category === "all"}
            className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-extrabold transition-colors ${
              category === "all"
                ? "border-[var(--teal)] bg-[var(--teal)] text-[var(--primary-ink)]"
                : "border-[var(--line-strong)] bg-white hover:border-[var(--teal)]"
            }`}
            onClick={() => setCategory("all")}
            type="button"
          >
            {labels.all}
          </button>
          {categories.map((item) => (
            <button
              aria-pressed={category === item.en}
              className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-extrabold transition-colors ${
                category === item.en
                  ? "border-[var(--teal)] bg-[var(--teal)] text-[var(--primary-ink)]"
                  : "border-[var(--line-strong)] bg-white hover:border-[var(--teal)]"
              }`}
              key={item.en}
              onClick={() => setCategory(item.en)}
              type="button"
            >
              {getLocalizedText(item, locale)}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-[var(--aqua-soft)]">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:px-6 md:grid-cols-2 lg:px-8 xl:grid-cols-3">
          {visibleServices.map((service) => (
            <div data-testid="service-directory-card" key={service.id}>
              <ServiceCard labels={labels} locale={locale} service={service} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
