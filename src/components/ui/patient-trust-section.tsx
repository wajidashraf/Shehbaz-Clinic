import {
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";

const trustItems = [
  {
    title: "Convenient Location",
    description: "Easily accessible on Circular Road in the heart of Samundri.",
    icon: HiOutlineMapPin,
  },
  {
    title: "Daily Availability",
    description: "Open every day from 9:00 AM to 8:00 PM for your convenience.",
    icon: HiOutlineCalendarDays,
  },
  {
    title: "Easy Contact",
    description: "Call, WhatsApp, or request an appointment online effortlessly.",
    icon: HiOutlinePhone,
  },
];

export function PatientTrustSection() {
  return (
    <section className="bg-[var(--aqua-light)] py-5 border-t border-[var(--aqua-md)] sm:py-16 lg:py-20" aria-labelledby="patient-trust-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 id="patient-trust-title" className="text-2xl font-extrabold leading-tight text-[var(--primary-ink)] sm:text-3xl lg:text-[2.15rem]">
            Why Patients Trust Us
          </h2>
        </div>

        {/* Trust Items */}
        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 md:grid-cols-3 md:gap-7 lg:mt-14 lg:gap-10">
          {trustItems.map(({ title, description, icon: Icon }) => (
            <div key={title} className="group/trust flex flex-col items-center text-center">
              {/* Icon */}
              <div className="grid size-14 place-items-center rounded-xl bg-[var(--aqua)] text-[var(--teal)] shadow-[0_10px_26px_-20px_rgba(7,48,71,0.3)] transition-colors duration-300 group-hover/trust:bg-[var(--teal)] group-hover/trust:text-[var(--aqua-light)] sm:size-15">
                <Icon aria-hidden="true" className="size-7 stroke-[1.7]" />
              </div>

              {/* Title */}
              <h3 className="mt-5 text-base font-extrabold leading-snug text-[var(--primary-ink)] sm:text-lg">
                {title}
              </h3>

              {/* Description */}
              <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted-text)] sm:text-[15px]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}