import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { clinicConfig } from "@/config/public-config";

type HeroSectionProps = {
  locale: "en" | "ur";
};

const heroCopy = {
  en: {
    eyebrow: "Thoughtful dental care in Samundri",
    titlePrimary: "Healthy Teeth.",
    titleAccent: "Confident Smiles.",
    description:
      "We deliver personalized dental treatments with modern technology and gentle care, ensuring healthy, confident smiles for every patient.",
    book: "Book Appointment",
    callNow: "Call now",
    imageAlt: "A bright, modern dental treatment room",
    registrationLabel: "PHC registration",
    reviews: "44+ Google Reviews",
  },
  ur: {
    eyebrow: "سمندری میں توجہ کے ساتھ دانتوں کی نگہداشت",
    titlePrimary: "صحت مند دانت۔",
    titleAccent: "پُراعتماد مسکراہٹیں۔",
    description:
      "ہم جدید ٹیکنالوجی اور نرم نگہداشت کے ساتھ ہر مریض کے لیے ذاتی ضرورت کے مطابق علاج فراہم کرتے ہیں، تاکہ صحت مند اور پُراعتماد مسکراہٹیں یقینی بنائی جا سکیں۔",
    book: "اپائنٹمنٹ بک کریں",
    callNow: "ابھی کال کریں",
    imageAlt: "روشن اور جدید ڈینٹل ٹریٹمنٹ روم",
    registrationLabel: "پی ایچ سی رجسٹریشن",
    reviews: "44+ گوگل جائزے",
  },
} as const;

export function HeroSection({ locale }: HeroSectionProps) {
  const isRtl = locale === "ur";
  const content = heroCopy[locale];

  return (
    <section
      aria-label={`${content.titlePrimary} ${content.titleAccent}`}
      className=" relative isolate overflow-hidden  bg-[linear-gradient(135deg,#eef5fb_0%,#edf6fc_55%,#f8fbfe_100%)]  py-10 sm:py-12 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="  pointer-events-none absolute -start-32 -top-32 hidden  size-[28rem] rounded-full bg-[var(--aqua)]/50 blur-3xl lg:block "
      />

      <div
        className="
          relative z-10 mx-auto grid max-w-7xl items-center gap-10
          px-5 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8
        "
      >
        {/* LEFT CONTENT */}
        <div className={isRtl ? "text-right" : "text-left"}>
          <p
            className={`
              inline-flex w-fit items-center gap-2 rounded-full
              bg-[#dfeaf7] px-5 py-3 text-[13px] font-extrabold
              text-[#1976d2] shadow-sm
              ${isRtl ? "leading-6" : "uppercase tracking-[0.01em]"}
            `}
          >
            {content.eyebrow}
          </p>

          <div className="mt-8">
            <h1
              className={`
                text-[clamp(2.2rem,6vw,3.75rem)]
                font-extrabold leading-[1.06]
                tracking-[-0.04em]
                text-[#0b4b85]
                ${isRtl ? "tracking-normal" : ""}
              `}
            >
              <span className="block">{content.titlePrimary}</span>{" "}
              <span className="block text-[#1f7ed6]">
                {content.titleAccent}
              </span>
            </h1>
          </div>

          <p
            className="
              mt-7 max-w-[580px]
              text-lg leading-[1.75]
              text-[#4f647b]
              sm:text-[1.28rem]
              lg:text-lg lg:leading-8
            "
          >
            {content.description}
          </p>

          {/* MOBILE + DESKTOP CTA */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <ButtonLink
              href={`/${locale}/book`}
              size="large"
              className="
                w-full justify-center rounded-[1.15rem]
                bg-[#1976d2] px-7 py-4 text-base font-bold text-white
                shadow-[0_14px_30px_-14px_rgba(25,118,210,0.55)]
                transition-all duration-300
                sm:w-auto
              "
              icon={
                <svg
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 3v4M16 3v4M3 10h18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              }
            >
              {content.book}
            </ButtonLink>

            <ButtonLink
              href={clinicConfig.phoneHref}
              size="large"
              variant="secondary"
              className="
                w-full justify-center rounded-[1.15rem]
                border border-[#c8d2dc] bg-white px-7 py-4
                text-base font-bold text-[#0b4b85]
                shadow-[0_10px_24px_-18px_rgba(7,48,71,0.35)]
                transition-all duration-300
                sm:w-auto
              "
              icon={
                <svg
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.15 12.8 19.86 19.86 0 0 1 2.08 4.09 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.61a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.47-1.24a2 2 0 0 1 2.11-.45c.83.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              {content.callNow}
            </ButtonLink>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative pt-2 lg:pt-0">
          <div
            className="
              relative overflow-hidden rounded-[2rem]
              border-[8px] border-white bg-white
              shadow-[0_30px_70px_-32px_rgba(7,48,71,0.45)]
              h-[min(62vw,420px)]
              min-h-[290px]
              sm:h-[360px]
              lg:h-[clamp(340px,38vw,425px)]
              lg:max-h-[425px]
            "
          >
            <Image
              src="/images/demo/dentalRoom.avif"
              alt={content.imageAlt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover object-center lg:object-[52%_center]"
            />
          </div>

          {/* DESKTOP TRUST BADGES ONLY */}
          <div
            className="
              absolute -end-6 -top-6 hidden
              items-center gap-3 rounded-2xl border border-white
              bg-white/95 px-4 py-3 shadow-[0_16px_40px_-18px_rgba(7,48,71,0.45)]
              backdrop-blur-xl lg:flex
            "
          >
            <div className="grid size-10 place-items-center rounded-full bg-emerald-500 text-white">
              ✓
            </div>
            <div>
              <strong className="block text-sm font-extrabold text-[var(--primary-ink)]">
                {content.registrationLabel}
              </strong>
              <bdi className="block text-xs font-semibold text-[var(--muted-text)]">
                PMDC 24988
              </bdi>
            </div>
          </div>

          <div
            className="
              absolute -bottom-6 -start-6 hidden
              items-center gap-3 rounded-2xl border border-white
              bg-white/95 px-4 py-3 shadow-[0_18px_44px_-18px_rgba(7,48,71,0.4)]
              backdrop-blur-xl lg:flex
            "
          >
            <div className="grid size-10 place-items-center rounded-full bg-yellow-400 text-white">
              ★
            </div>
            <div>
              <strong className="block text-lg font-extrabold leading-none text-[var(--primary-ink)]">
                4.3 / 5
              </strong>
              <span className="mt-1 block text-xs font-semibold text-[var(--muted-text)]">
                {content.reviews}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
