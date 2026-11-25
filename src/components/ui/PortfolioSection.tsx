import { PortfolioGallery } from "@/components/ui/portfolio-gallery";

type PortfolioSectionProps = {
  locale: "en" | "ur";
};

const portfolioImages = [
  {
    src: "/images/location images/locationImage (1).png",
    alt: {
      en: "Exterior of Shahbaz Dental Clinic",
      ur: "شہباز ڈینٹل کلینک کا بیرونی منظر",
    },
  },
  {
    src: "/images/location images/locationImage (4).jpeg",
    alt: {
      en: "Clinic entrance and waiting area",
      ur: "کلینک کا داخلی راستہ اور انتظار گاہ",
    },
  },
  {
    src: "/images/location images/locationImage (6).jpeg",
    alt: {
      en: "Seating in the clinic waiting area",
      ur: "کلینک کی انتظار گاہ میں نشستیں",
    },
  },
  {
    src: "/images/location images/locationImage (10).jpeg",
    alt: {
      en: "Clinic reception and waiting area",
      ur: "کلینک کا استقبالیہ اور انتظار گاہ",
    },
  },
  {
    src: "/images/location images/locationImage (11).jpeg",
    alt: {
      en: "Waiting area beside the clinic entrance",
      ur: "کلینک کے داخلی راستے کے پاس انتظار گاہ",
    },
  },
  {
    src: "/images/location images/locationImage (2).jpeg",
    alt: {
      en: "Shahbaz Dental Clinic exterior at night",
      ur: "رات کے وقت شہباز ڈینٹل کلینک کا بیرونی منظر",
    },
  },
  {
    src: "/images/location images/locationImage (3).jpeg",
    alt: {
      en: "Clinic building and entrance at night",
      ur: "رات کے وقت کلینک کی عمارت اور داخلی راستہ",
    },
  },
  {
    src: "/images/location images/locationImage (5).jpeg",
    alt: {
      en: "Clinic signs beside the street",
      ur: "سڑک کے کنارے کلینک کے بورڈ",
    },
  },
  {
    src: "/images/location images/locationImage (7).jpeg",
    alt: {
      en: "Clinic sterilization room",
      ur: "کلینک کا جراثیم کشی کا کمرہ",
    },
  },
  {
    src: "/images/location images/locationImage (8).jpeg",
    alt: {
      en: "Hallway inside the clinic",
      ur: "کلینک کے اندر راہداری",
    },
  },
  {
    src: "/images/location images/locationImage (9).jpeg",
    alt: {
      en: "Clinic side entrance and surrounding street",
      ur: "کلینک کا بغلی داخلی راستہ اور آس پاس کی سڑک",
    },
  },
  {
    src: "/images/location images/locationImage (12).jpeg",
    alt: {
      en: "Shahbaz Dental Clinic signs outside the building",
      ur: "عمارت کے باہر شہباز ڈینٹل کلینک کے بورڈ",
    },
  },
  {
    src: "/images/location images/locationImage (13).jpeg",
    alt: {
      en: "Front of the Shahbaz Dental Clinic building",
      ur: "شہباز ڈینٹل کلینک کی عمارت کا سامنے کا منظر",
    },
  },
  {
    src: "/images/location images/locationImage (14).jpeg",
    alt: {
      en: "Clinic waiting area and reception desk",
      ur: "کلینک کی انتظار گاہ اور استقبالیہ میز",
    },
  },
  {
    src: "/images/location images/locationImage (15).jpeg",
    alt: {
      en: "Dental clinic signs at the entrance",
      ur: "داخلی راستے پر ڈینٹل کلینک کے بورڈ",
    },
  },
  {
    src: "/images/location images/locationImage (16).jpeg",
    alt: {
      en: "Side view of the clinic building and street",
      ur: "کلینک کی عمارت اور سڑک کا بغلی منظر",
    },
  },
];

export function PortfolioSection({ locale }: PortfolioSectionProps) {
  const isRtl = locale === "ur";

  const content = {
    en: {
      eyebrow: "Our Portfolio",
      title: "A glimpse inside our dental care",
      description:
        "Take a look at our clinic, from the entrance and reception to the waiting area and facilities.",
    },
    ur: {
      eyebrow: "ہماری گیلری",
      title: "ہماری ڈینٹل کیئر کی ایک جھلک",
      description:
        "ہمارے کلینک کے داخلی راستے، استقبالیے، انتظار گاہ اور سہولیات کی چند جھلکیاں دیکھیں۔",
    },
  };

  const text = content[locale];

  return (
    <section
      id="portfolio"
      dir={isRtl ? "rtl" : "ltr"}
      aria-labelledby="portfolio-title"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <p
            className="
              mb-3
              text-sm
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--teal)]
            "
          >
            {text.eyebrow}
          </p>

          <h2
            id="portfolio-title"
            className="
              text-balance
              text-2xl
              font-bold
              tracking-tight
              text-[var(--ink)]
              sm:text-3xl
              lg:text-4xl
            "
          >
            {text.title}
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-slate-600
              sm:text-base
            "
          >
            {text.description}
          </p>
        </div>

        {/* Portfolio Grid */}
        <PortfolioGallery images={portfolioImages} locale={locale} />
      </div>
    </section>
  );
}
