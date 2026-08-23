const faqs = [
  {
    question: "How often should I visit the dentist for a checkup?",
    answer:
      "Regular dental checkups help identify oral health concerns early. The recommended frequency can vary depending on your individual dental condition and treatment needs.",
  },
  {
    question: "Will dental treatment be painful?",
    answer:
      "Comfort depends on the type of procedure and your individual condition. Dentists may use appropriate pain-management or local anaesthesia options when required to make treatment more comfortable.",
  },
  {
    question: "How long does a dental procedure usually take?",
    answer:
      "Treatment time varies by procedure. A routine checkup or cleaning may be relatively short, while procedures such as root canal treatment, braces, or restorative work may require longer or multiple visits.",
  },
  {
    question: "How should I prepare for my dental appointment?",
    answer:
      "Bring any relevant dental or medical information and let the dentist know about concerns, symptoms, medications, or previous treatments so your condition can be assessed appropriately.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2
            id="faq-title"
            className="text-2xl font-extrabold leading-tight text-[var(--primary-ink)] sm:text-3xl lg:text-[2.15rem]"
          >
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-text)] sm:text-base">
            Helpful answers to common questions about dental checkups,
            treatments, and appointments.
          </p>
        </div>

        {/* FAQs */}
        <div className="mx-auto mt-9 max-w-4xl space-y-3 sm:mt-10 sm:space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--aqua-light)] transition-[border-color,box-shadow] duration-300 open:border-[var(--aqua)] open:shadow-[0_14px_32px_-26px_rgba(7,48,71,0.35)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-left marker:hidden sm:px-6">
                <span className="text-sm font-extrabold leading-6 text-[var(--primary-ink)] sm:text-base">
                  {faq.question}
                </span>

                <span className="pointer-events-none grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--aqua)] text-[var(--teal)] transition-[background-color,color,transform] duration-300 group-open:rotate-180 group-open:bg-[var(--teal)] group-open:text-white">
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </summary>

              <div className="border-t border-[var(--line)] px-5 pb-5 pt-4 sm:px-6">
                <p className="text-sm leading-6 text-[var(--muted-text)] sm:text-[15px] sm:leading-7">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}