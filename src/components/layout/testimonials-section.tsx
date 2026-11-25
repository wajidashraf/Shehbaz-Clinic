import { HiStar, HiOutlineUser } from "react-icons/hi2";
import { ButtonLink } from "@/components/ui/button-link";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";
import { ReviewCarousel } from "@/components/ui/review-carousel";

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
    summary: `Based on ${clinicConfig.googleReviews.total} reviews on Google Maps.`,
    action: "View All Reviews",
    googleReview: "Google Review",
    overallRatingLabel: `${clinicConfig.googleReviews.rating} out of 5 stars`,
    ratingLabels: { 4: "4 out of 5 stars", 5: "5 out of 5 stars" },
    reviews: [
      {
        name: "larainb Bushra",
        rating: 5,
        review:
          "I am from Faisalabad and travelled to Shahbaz Dental Clinic for my orthodontic treatment. I am extremely satisfied with my overall experience. The clinic is very hygienic, well-maintained, and provides a comfortable environment for patients. Initially, I had a Class II malocclusion along with dental spacing and smile-related issues. After my braces treatment, I experienced significant improvement in my bite, moving from a Class II towards a Class I respectively. My dental spaces and smile have also improved remarkably. A special thanks to Dr. Sobia (BDS) for her excellent work, professional attitude, care, and guidance throughout my treatment. She is a very cooperative, dedicated, and skilled doctor. The treatment duration to 1.5 years.",
      },
      {
        name: "Mian Usman",
        rating: 5,
        review:
          "I belong to samundri I had a great experience at Shahbaz dental clinic formy rct the doctor was professional and gentle though the procedure. The was clean and hygienic and disposable kit and instrument made me feel safe and comfortable I am satisfied with treatment and I fee safe for aids and hepatitis",
      },
      {
        name: "Mrs Rana",
        rating: 5,
        review:
          "I was severe tooth pain, so i visited shahbaz dental clinic dr.sobia performed my rct and sacling and bridge. I am very satisfied with treatment and her professional care highly recommended",
      },
      {
        name: "Rana Mudassar",
        rating: 5,
        review:
          "I belong to new York city I had a great experience at shahbaz dental clinic I am sixty years old Iam satisfied my treatment just fifteen Day and completely bridge with zirconia crown and I highly recommend for dental implants",
      },
      {
        name: "Ayyan Kamboh",
        rating: 5,
        review:
          "My two molar remove and my teeth aigment completely I have completed my braces 1andhalf year very good experience came from438and got my fixed braces with Hollywood smile 😊 Iam satisfied with treatment and I feel safe …",
      },
      {
        name: "Sairah Sairah",
        rating: 5,
        review:
          "Very good experience came from the uk, and got the whitening completed with minimal pain and great results!",
      },
      {
        name: "Malik Shahid",
        rating: 5,
        review:
          "I had a great experience at Shahbaz dental clinic for my wisdom tooth removal the procedure was handled very well and I feel comfortable though the process Iam satisfied with the treatment and highly recommend thanks you for excellent and caring",
      },
    ],
  },
  ur: {
    heading: "مریضوں کے تاثرات",
    summary: `گوگل میپس پر ${clinicConfig.googleReviews.total} جائزوں کی بنیاد پر۔`,
    action: "گوگل پر تمام جائزے دیکھیں",
    googleReview: "گوگل جائزہ",
    overallRatingLabel: "۵ میں سے ۴٫۷ ستارے",
    ratingLabels: { 4: "۵ میں سے ۴ ستارے", 5: "۵ میں سے ۵ ستارے" },
    reviews: [
      {
        name: "لرینب بشریٰ",
        rating: 5,
        review:
          "میں اپنے مجموعی تجربے سے بہت مطمئن ہوں۔ کلینک صاف ستھرا اور اچھی حالت میں ہے، اور مریضوں کے لیے آرام دہ ماحول فراہم کرتا ہے۔",
      },
      {
        name: "میاں عثمان",
        rating: 5,
        review:
          "ڈاکٹر نے روٹ کینال کا علاج نرمی اور پیشہ ورانہ انداز سے کیا۔ کلینک صاف ستھرا تھا، اور ڈسپوزایبل آلات کی وجہ سے مجھے اطمینان محسوس ہوا۔",
      },
      {
        name: "مسز رانا",
        rating: 5,
        review:
          "دانت میں شدید درد کی وجہ سے شہباز ڈینٹل کلینک گئی۔ ڈاکٹر صوبیہ نے روٹ کینال، اسکیلنگ اور برج کا علاج کیا۔ میں علاج اور ان کی پیشہ ورانہ نگہداشت سے بہت مطمئن ہوں۔",
      },
      {
        name: "رانا مدثر",
        rating: 5,
        review:
          "میں نیویارک سے ہوں اور میری عمر ساٹھ سال ہے۔ شہباز ڈینٹل کلینک میں بہت اچھا تجربہ رہا۔ پندرہ دن میں زرکونیا کراؤن کے ساتھ برج کا علاج مکمل ہوا اور میں علاج سے مطمئن ہوں۔ ڈینٹل امپلانٹس کے لیے بھی کلینک کی سفارش کرتا ہوں۔",
      },
      {
        name: "ایان کمبوہ",
        rating: 5,
        review:
          "میرے دو داڑھ نکالے گئے اور تقریباً ڈیڑھ سال میں بریسز کا علاج مکمل ہوا۔ دانتوں کی ترتیب اور مسکراہٹ بہتر ہوئی۔ علاج کا بہت اچھا تجربہ رہا اور میں مطمئن ہوں۔",
      },
      {
        name: "سائرہ سائرہ",
        rating: 5,
        review:
          "برطانیہ سے آئی اور بہت اچھا تجربہ رہا۔ دانتوں کی سفیدی کا علاج معمولی درد کے ساتھ مکمل ہوا اور نتائج بہت اچھے رہے۔",
      },
      {
        name: "ملک شاہد",
        rating: 5,
        review:
          "شہباز ڈینٹل کلینک میں عقل داڑھ نکلوانے کا بہت اچھا تجربہ رہا۔ علاج اچھی طرح کیا گیا اور مجھے پورے عمل کے دوران اطمینان رہا۔ میں علاج سے مطمئن ہوں۔ بہترین نگہداشت کا شکریہ۔",
      },
    ],
  },
} satisfies Record<Locale, ReviewSectionContent>;

function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div aria-label={label} className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <span aria-hidden="true" className="relative block size-5" key={index}>
          <HiStar className="size-5 text-[#aaa]" />
          <span
            className="absolute inset-y-0 start-0 overflow-hidden"
            style={{
              width: `${Math.max(0, Math.min(1, rating - index)) * 100}%`,
            }}
          >
            <HiStar className="size-5 max-w-none text-[#facc15]" />
          </span>
        </span>
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
          <div className="mx-auto max-w-[420px] text-center sm:mx-0 sm:text-start">
            <h2
              className="text-2xl font-extrabold leading-tight text-[var(--primary-ink)] sm:text-3xl lg:text-[2.15rem]"
              id="reviews-heading"
            >
              {content.heading}
            </h2>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <StarRating
                rating={clinicConfig.googleReviews.rating}
                label={content.overallRatingLabel}
              />

              <p className="text-2xl font-extrabold text-[var(--primary-ink)]">
                {clinicConfig.googleReviews.rating} / 5
              </p>
            </div>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--muted-text)] sm:mx-0 sm:text-base">
              {content.summary}
            </p>

            <div className="mt-6">
              <ButtonLink external href={clinicConfig.mapsUrl}>
                {content.action}
              </ButtonLink>
            </div>
          </div>

          {/* RIGHT REVIEWS */}
          <ReviewCarousel label={content.heading} locale={locale}>
            {content.reviews.map((review) => (
              <ReviewCard
                googleReview={content.googleReview}
                key={review.name}
                ratingLabel={content.ratingLabels[review.rating]}
                review={review}
              />
            ))}
          </ReviewCarousel>
        </div>
      </div>
    </section>
  );
}
