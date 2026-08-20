import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getCurrentAdmin } from "@/modules/auth/admin-session.server";
import { listAdminData } from "@/modules/appointments/appointment.repository";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await getCurrentAdmin())) redirect("/admin/login");
  return <AdminDashboard initialData={await listAdminData()} />;
}
