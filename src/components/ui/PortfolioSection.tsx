import Image from "next/image";

type PortfolioSectionProps = {
  locale: "en" | "ur";
};

const portfolioImages = [
  {
    src: "https://images.pexels.com/photos/12427085/pexels-photo-12427085.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: {
      en: "Modern dental clinic and treatment equipment",
      ur: "جدید ڈینٹل کلینک اور علاج کے آلات",
    },
  },
  {
    src: "https://images.pexels.com/photos/3845723/pexels-photo-3845723.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: {
      en: "Dentist performing a dental examination",
      ur: "ڈینٹسٹ مریض کے دانتوں کا معائنہ کرتے ہوئے",
    },
  },
  {
    src: "https://images.pexels.com/photos/5355926/pexels-photo-5355926.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: {
      en: "Dental team providing patient care",
      ur: "ڈینٹل ٹیم مریض کو علاج فراہم کرتے ہوئے",
    },
  },
  {
    src: "https://images.pexels.com/photos/5355894/pexels-photo-5355894.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: {
      en: "Patient receiving a dental checkup",
      ur: "مریض دانتوں کا معائنہ کرواتے ہوئے",
    },
  },
  {
    src: "https://images.pexels.com/photos/6812569/pexels-photo-6812569.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: {
      en: "Dentist and assistant examining a patient",
      ur: "ڈینٹسٹ اور اسسٹنٹ مریض کا معائنہ کرتے ہوئے",
    },
  },
  {
    src: "https://images.pexels.com/photos/5355698/pexels-photo-5355698.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: {
      en: "Professional dental treatment",
      ur: "پیشہ ورانہ دانتوں کا علاج",
    },
  },
  {
    src: "https://images.pexels.com/photos/19976586/pexels-photo-19976586.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: {
      en: "Modern dental treatment procedure",
      ur: "جدید دانتوں کے علاج کا طریقہ",
    },
  },
  {
    src: "https://images.pexels.com/photos/18523995/pexels-photo-18523995.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: {
      en: "Dental professionals treating a patient",
      ur: "ڈینٹل ماہرین مریض کا علاج کرتے ہوئے",
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
        "Explore moments from our clinic, treatments, facilities, and the professional dental care we provide to our patients.",
    },
    ur: {
      eyebrow: "ہماری گیلری",
      title: "ہماری ڈینٹل کیئر کی ایک جھلک",
      description:
        "ہمارے کلینک، علاج، سہولیات اور مریضوں کو فراہم کی جانے والی پیشہ ورانہ ڈینٹل کیئر کی چند جھلکیاں دیکھیں۔",
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
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
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
