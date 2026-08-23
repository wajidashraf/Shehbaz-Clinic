import {
  HiOutlineBolt,
  HiOutlineClipboardDocumentCheck,
  HiOutlineFaceSmile,
  HiOutlineHeart,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";

import { getLocalizedText, type DemoService } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";

type ServicesCarouselProps = {
  locale: Locale;
  services: readonly DemoService[];
};

const serviceIcons = [
  HiOutlineClipboardDocumentCheck,
  HiOutlineSparkles,
  HiOutlineBolt,
  HiOutlineFaceSmile,
  HiOutlineSquares2X2,
  HiOutlineWrenchScrewdriver,
  HiOutlineShieldCheck,
  HiOutlineHeart,
];

export function ServicesCarousel({ locale, services }: ServicesCarouselProps) {
  const visibleServices = services.slice(0, 8);

  if (!visibleServices.length) return null;

  return (
    <section aria-label="Dental services" className="py-0 px-5 lg:px-0">
      <div className="mx-auto max-w-7xl">
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:mt-12 lg:grid-cols-4">
          {visibleServices.map((service, index) => {
            const Icon =
              serviceIcons[index % serviceIcons.length] ??
              HiOutlineWrenchScrewdriver;

            return (
              <div
                key={service.id}
                className="group/service-card flex min-h-[195px] flex-col rounded-2xl border border-white/70 bg-white p-6 shadow-[0_10px_28px_-22px_rgba(7,48,71,0.3)] transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-white hover:shadow-[0_18px_38px_-24px_rgba(7,48,71,0.42)] sm:min-h-[205px] md:min-h-[215px] lg:min-h-[220px] lg:p-7"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--aqua)] text-[var(--teal)] transition-colors duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/service-card:bg-[var(--teal)] group-hover/service-card:text-[var(--aqua-light)]">
                  <Icon
                    aria-hidden="true"
                    className="size-7 stroke-[1.7] text-[var(--teal)] transition-colors duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/service-card:text-[var(--aqua-light)]"
                  />
                </div>

                <h3 className="mt-6 text-lg font-extrabold leading-snug text-[var(--primary-ink)] md:text-base lg:text-[1.05rem]">
                  {getLocalizedText(service.name, locale)}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[var(--muted-text)]">
                  {getLocalizedText(service.summary, locale)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-white/70 bg-[var(--aqua)] px-5 py-4 text-center sm:mt-12 sm:px-7">
          <p className="text-xs font-medium italic leading-5 text-[var(--teal-dark)] sm:text-sm">
            Disclaimer: Treatment suitability varies by patient. A dental
            professional should assess your individual condition before
            treatment.
          </p>
        </div>
      </div>
    </section>
  );
}
