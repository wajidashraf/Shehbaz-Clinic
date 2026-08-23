import {
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineStar,
  HiOutlineUserGroup,
} from "react-icons/hi2";

type ClinicHighlightsProps = {
  locale: "en" | "ur";
};

const highlights = [
  {
    icon: HiOutlineStar,
    title: "4.3/5 Rating",
    description: "Google Verified",
  },
  {
    icon: HiOutlineUserGroup,
    title: "10–11 Years",
    description: "Clinical Experience",
  },
  {
    icon: HiOutlineClock,
    title: "9AM - 8PM",
    description: "Open Daily",
  },
  {
    icon: HiOutlineMapPin,
    title: "Circular Road",
    description: "Samundri, Punjab",
  },
];

export function ClinicHighlights({
  locale,
}: ClinicHighlightsProps) {
  const isRtl = locale === "ur";

  return (
    <section
      aria-label="Clinic highlights"
      className="
        border-y border-[var(--line)]
        bg-white
        py-7
        md:py-8
      "
    >
      <div
        className="
          mx-auto grid max-w-7xl
          grid-cols-2
          gap-x-5 gap-y-7
          px-5
          sm:px-6
          md:grid-cols-4
          md:gap-x-8
          md:gap-y-0
          md:px-8
        "
      >
        {highlights.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className={`
              flex min-w-0 items-center
              gap-3
              bg-transparent
              shadow-none
              sm:gap-4
              ${
                isRtl
                  ? "flex-row-reverse text-right"
                  : "flex-row text-left"
              }
            `}
          >
            {/* Icon */}
            <div
              className="
                flex size-11 shrink-0
                items-center justify-center
                text-[#d1e6f5]
                sm:size-12
                md:size-11
                lg:size-12
              "
            >
              <Icon
                aria-hidden="true"
                className="
                  size-9
                  stroke-[1.65]
                  sm:size-10
                  md:size-9
                  lg:size-10
                "
              />
            </div>

            {/* Content */}
            <div className="min-w-0">
              <h3
                className="
                  text-[15px]
                  font-extrabold
                  leading-[1.2]
                  text-[var(--teal-dark)]

                  sm:text-sm
                  md:text-[13px]
                  lg:text-[15px]
                "
              >
                {title}
              </h3>

              <p
                className="
                  mt-1
                  text-[11px]
                  font-medium
                  leading-[1.3]
                  text-[var(--muted-text)]

                  sm:text-xs
                  md:text-[11px]
                  lg:text-xs
                "
              >
                {description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}