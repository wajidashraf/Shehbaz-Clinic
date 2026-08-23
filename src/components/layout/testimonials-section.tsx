import { HiStar, HiOutlineUser } from "react-icons/hi2";
import { ButtonLink } from "@/components/ui/button-link";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";

type HomepageReview = {
  name: string;
  rating: 4 | 5;
  review: string;
};

type ReviewSectionContent = {
  heading: string;
  summary: string;
  action: string;
  googleReview: string;
  overallRatingLabel: string;
  ratingLabels: Record<HomepageReview["rating"], string>;
  reviews: readonly HomepageReview[];
};

const reviewContent = {
  en: {
    heading: "Patient Reviews",
    summary: "Based on approximately 44 reviews on Google Maps.",
    action: "View All Reviews",
    googleReview: "Google Review",
    overallRatingLabel: "4.3 out of 5 stars",
    ratingLabels: { 4: "4 out of 5 stars", 5: "5 out of 5 stars" },
    reviews: [
      {
        name: "Rana Ali",
        rating: 4,
        review:
          "Doctor are very nice and well experienced in their field. Clinic is very neat and clean. Staff behaviour very satisfied.",
      },
      {
        name: "Masood Ali",
        rating: 5,
        review:
          "I live in New York City, but I am coming to Shahbaz Dental Clinic Samundri. My first visit was for scaling. I am very happy because my treatment is very good, the instruments are disposable, and the clinic is very neat and clean.",
      },
    ],
  },
  ur: {
    heading: "مریضوں کے تاثرات",
    summary: "گوگل میپس پر تقریباً 44 جائزوں کی بنیاد پر۔",
    action: "گوگل پر تمام جائزے دیکھیں",
    googleReview: "گوگل جائزہ",
    overallRatingLabel: "۵ میں سے ۴٫۳ ستارے",
    ratingLabels: { 4: "۵ میں سے ۴ ستارے", 5: "۵ میں سے ۵ ستارے" },
    reviews: [
      {
        name: "رانا علی",
        rating: 4,
        review: "ڈاکٹر تجربہ کار ہیں، کلینک صاف ستھرا ہے اور عملہ مددگار تھا۔",
      },
      {
        name: "مسعود علی",
        rating: 5,
        review:
          "میں اسکیلنگ کے لیے نیویارک سے آیا اور علاج، ڈسپوزایبل آلات اور کلینک کی صفائی سے مطمئن رہا۔",
      },
    ],
  },
} satisfies Record<Locale, ReviewSectionContent>;

function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div aria-label={label} className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <HiStar
          key={index}
          aria-hidden="true"
          className={`size-5 ${index < rating ? "text-[#facc15]" : "text-[#aaa]"}`}
        />
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4.5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M20.5 12.2c0-.7-.1-1.4-.2-2H12v3.7h4.8a4.1 4.1 0 0 1-1.8 2.7v2.3h2.9c1.7-1.6 2.6-3.9 2.6-6.7Z"
        fill="currentColor"
      />
      <path
        d="M12 21c2.4 0 4.5-.8 6-2.1L15 16.6c-.8.5-1.8.9-3 .9-2.3 0-4.3-1.6-5-3.7H4v2.4A9 9 0 0 0 12 21Z"
        fill="currentColor"
        opacity=".85"
      />
      <path
        d="M7 13.8a5.4 5.4 0 0 1 0-3.5V7.9H4a9 9 0 0 0 0 8.3l3-2.4Z"
        fill="currentColor"
        opacity=".65"
      />
      <path
        d="M12 6.5c1.4 0 2.6.5 3.6 1.4l2.7-2.7A9 9 0 0 0 4 7.9l3 2.4c.7-2.2 2.7-3.8 5-3.8Z"
        fill="currentColor"
        opacity=".8"
      />
    </svg>
  );
}

function ReviewCard({
  review,
  googleReview,
  ratingLabel,
}: {
  review: HomepageReview;
  googleReview: string;
  ratingLabel: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--aqua-light)] p-5 transition-[border-color,box-shadow] duration-300 hover:border-[var(--line-strong)] hover:shadow-[0_16px_36px_-28px_rgba(7,48,71,0.32)] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <StarRating rating={review.rating} label={ratingLabel} />
      </div>

      <blockquote className="mt-4 flex-1">
        <p className="line-clamp-5 text-sm italic leading-6 text-[var(--muted-text)] sm:line-clamp-6 sm:text-[15px]">
          “{review.review}”
        </p>
      </blockquote>

      <div className="mt-5 flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--teal)] text-white">
          <HiOutlineUser aria-hidden="true" className="size-5" />
        </span>

        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-[var(--primary-ink)] sm:text-base">
            {review.name}
          </p>

          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-[var(--muted-text)]">
            <span className="text-[var(--teal)]">
              <GoogleIcon />
            </span>
            {googleReview}
          </p>
        </div>
      </div>
    </article>
  );
}

export function TestimonialsSection({ locale }: { locale: Locale }) {
  const content = reviewContent[locale];

  return (
    <section
      aria-labelledby="reviews-heading"
      className="scroll-mt-28 bg-white py-14 sm:py-16 lg:py-20"
      data-testid="testimonials-section"
      id="reviews"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-9 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center lg:gap-12">
          {/* LEFT REVIEW SUMMARY */}
          <div className="max-w-[420px]">
            <h2
              className="text-2xl font-extrabold leading-tight text-[var(--primary-ink)] sm:text-3xl lg:text-[2.15rem]"
              id="reviews-heading"
            >
              {content.heading}
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <StarRating rating={5} label={content.overallRatingLabel} />

              <p className="text-2xl font-extrabold text-[var(--primary-ink)]">
                4.3 / 5
              </p>
            </div>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted-text)] sm:text-base">
              {content.summary}
            </p>

            <div className="mt-6">
              <ButtonLink external href={clinicConfig.mapsUrl}>
                {content.action}
              </ButtonLink>
            </div>
          </div>

          {/* RIGHT REVIEWS */}
          <div className="grid items-stretch gap-5 md:grid-cols-2 lg:gap-6">
            {content.reviews.map((review) => (
              <ReviewCard
                googleReview={content.googleReview}
                key={review.name}
                ratingLabel={content.ratingLabels[review.rating]}
                review={review}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
