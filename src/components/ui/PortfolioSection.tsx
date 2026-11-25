import Image from "next/image";

type PortfolioSectionProps = {
  locale: "en" | "ur";
};

const portfolioImages = [
  {
    src: "/images/location images/locationImage (1).jpeg",
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
        <div
          className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-3
            xl:grid-cols-4
            sm:gap-4
          "
        >
          {portfolioImages.map((image) => (
            <figure
              key={image.src}
              className="
      group
      relative
      aspect-[4/3]
      overflow-hidden
      rounded-2xl
      bg-[var(--aqua-soft)]
      shadow-[0_8px_30px_-18px_rgba(18,48,53,0.32)]
      transition-shadow
      duration-300
      hover:shadow-[0_18px_45px_-20px_rgba(18,48,53,0.5)]
    "
            >
              <Image
                src={image.src}
                alt={image.alt[locale]}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
                className="
        object-cover
        transition-transform
        duration-500
        ease-out
        group-hover:scale-[1.04]
      "
              />

              <div
                aria-hidden="true"
                className="
        absolute
        inset-0
        bg-gradient-to-t
        from-[var(--teal)]/20
        via-transparent
        to-transparent
        opacity-0
        transition-opacity
        duration-300
        group-hover:opacity-100
      "
              />

              <div
                aria-hidden="true"
                className="
        pointer-events-none
        absolute
        inset-0
        rounded-2xl
        ring-1
        ring-inset
        ring-black/5
      "
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
