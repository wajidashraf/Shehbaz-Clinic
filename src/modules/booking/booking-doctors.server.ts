import "server-only";

import { demoDentists } from "@/content/demo-content";
import { listDoctors } from "@/modules/doctors/doctor.repository";

export function listBookingDoctors() {
  return process.env.PLAYWRIGHT_TEST === "1" ? demoDentists : listDoctors();
}
