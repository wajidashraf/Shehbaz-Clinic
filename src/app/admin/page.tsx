import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getCurrentAdmin } from "@/modules/auth/admin-session.server";
import { listAdminData } from "@/modules/appointments/appointment.repository";
import {
  listDoctorNamesIncludingInactive,
  listDoctors,
} from "@/modules/doctors/doctor.repository";
import { listAdminTestimonials } from "@/modules/testimonials/testimonial.repository";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await getCurrentAdmin())) redirect("/admin/login");
  const [data, doctors, doctorNames, testimonials] = await Promise.all([
    listAdminData(),
    listDoctors(),
    listDoctorNamesIncludingInactive(),
    listAdminTestimonials(),
  ]);
  return (
    <AdminDashboard
      initialData={{ ...data, doctors, doctorNames, testimonials }}
    />
  );
}
