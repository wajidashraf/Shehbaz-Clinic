type SectionHeadingProps = {
  align?: "start" | "center";
  description?: string;
  eyebrow: string;
  title: string;
};

export function SectionHeading({
  align = "start",
  description,
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
      }
    >
      <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--teal-dark)] uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-[var(--muted-text)] sm:text-lg sm:leading-8">
          {description}
        </p>
      ) : null}
    </div>
  );
}
