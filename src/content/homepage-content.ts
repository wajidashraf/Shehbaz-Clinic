import { demoDentists } from "@/content/demo-content";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

const sobiaZulfiqar = demoDentists.find(
  (dentist) => dentist.id === "sobia-zulfiqar",
);

if (!sobiaZulfiqar) {
  throw new Error(
    "The verified Sobia Zulfiqar record is required for the homepage.",
  );
}

export const featuredHomepageDentist: DoctorRecord = {
  ...sobiaZulfiqar,
  image: "/images/demo/featureDoctor.avif",
  isFeatured: true,
};
