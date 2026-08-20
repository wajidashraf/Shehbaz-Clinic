"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminDoctorManager } from "@/components/admin/admin-doctor-manager";
import { demoServices } from "@/content/demo-content";
import { isNotificationRetryEligible } from "@/modules/appointments/contracts";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

type Schedule = {
  _id: string;
  dentistId: string;
  dateKey: string;
  opensAt: string;
  closesAt: string;
  slotDurationMinutes: number;
};

type Appointment = {
  publicReference: string;
  dentistId: string;
  serviceId: string;
  startAtUtc: string;
  durationMinutes: number;
  patientName: string;
  mobile: string;
  email?: string | null;
  status: "confirmed" | "cancelled";
};

type Notification = {
  _id: string;
  appointmentReference: string;
  channel: "email" | "sms";
  event: string;
  status: string;
};

export type AdminData = {
  doctors: DoctorRecord[];
  doctorNames: Record<string, string>;
  schedules: Schedule[];
  appointments: Appointment[];
  notifications: Notification[];
};

function dentistName(id: string, doctorNames: Record<string, string>) {
  return doctorNames[id] ?? id;
}

function serviceName(id: string) {
  return demoServices.find((service) => service.id === id)?.name.en ?? id;
}

export function AdminDashboard({ initialData }: { initialData: AdminData }) {
  const router = useRouter();
  const [data, setData] = useState<AdminData>(initialData);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/v1/admin/data", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }
    if (!response.ok) {
      setMessage("Unable to load clinic administration data.");
      return;
    }
    setData(await response.json());
  }

  async function saveSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/v1/admin/data", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        dentistId: form.get("dentistId"),
        dateKey: form.get("dateKey"),
        opensAt: form.get("opensAt"),
        closesAt: form.get("closesAt"),
        slotDurationMinutes: Number(form.get("slotDurationMinutes")),
      }),
    });
    setBusy(false);
    setMessage(
      response.ok
        ? "Schedule saved."
        : "The schedule is invalid or conflicts with an appointment.",
    );
    if (response.ok) await load();
  }

  async function removeSchedule(id: string) {
    if (!window.confirm("Delete this schedule?")) return;
    const response = await fetch(
      `/api/v1/admin/data?id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
    setMessage(
      response.ok
        ? "Schedule deleted."
        : "Schedules with confirmed appointments cannot be deleted.",
    );
    if (response.ok) await load();
  }

  async function updateAppointment(
    reference: string,
    body: Record<string, string>,
  ) {
    const response = await fetch(
      `/api/v1/admin/appointments/${encodeURIComponent(reference)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    setMessage(
      response.ok
        ? "Appointment updated."
        : "The appointment could not be updated. Check the selected slot.",
    );
    if (response.ok) await load();
  }

  async function logout() {
    await fetch("/api/v1/admin/session", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function retryNotification(id: string) {
    setBusy(true);
    setMessage("");
    const response = await fetch(
      `/api/v1/admin/notifications/${encodeURIComponent(id)}/retry`,
      { method: "POST" },
    );
    setBusy(false);
    setMessage(
      response.ok
        ? "Notification sent."
        : "The email could not be sent. Check the provider settings and retry.",
    );
    if (response.ok) await load();
  }

  return (
    <main className="min-h-dvh bg-[var(--mineral)]">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-extrabold tracking-[0.14em] text-[var(--teal-dark)] uppercase">
              Shahbaz Dental Clinic
            </p>
            <h1 className="text-xl font-extrabold">Administration</h1>
          </div>
          <button
            className="min-h-11 rounded-full border border-[var(--line-strong)] bg-white px-4 font-bold hover:bg-[var(--aqua-soft)]"
            onClick={logout}
            type="button"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {message ? (
          <p
            className="rounded-2xl bg-[var(--aqua)] px-4 py-3 font-bold"
            role="status"
          >
            {message}
          </p>
        ) : null}

        <AdminDoctorManager doctors={data.doctors} onChanged={load} />

        <section className="rounded-[2rem] border border-[var(--line)] bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-extrabold">Add or update a schedule</h2>
          <p className="mt-2 text-[var(--muted-text)]">
            Slots are generated separately for each dentist and date.
          </p>
          <form
            className="mt-6 grid gap-4 md:grid-cols-5"
            onSubmit={saveSchedule}
          >
            <label className="font-bold">
              Dentist
              <select
                className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line-strong)] bg-white px-3"
                name="dentistId"
              >
                {data.doctors.map((dentist) => (
                  <option key={dentist.id} value={dentist.id}>
                    {dentist.name.en}
                  </option>
                ))}
              </select>
            </label>
            <label className="font-bold">
              Date
              <input
                className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line-strong)] px-3"
                name="dateKey"
                required
                type="date"
              />
            </label>
            <label className="font-bold">
              Opening
              <input
                className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line-strong)] px-3"
                defaultValue="09:00"
                name="opensAt"
                required
                type="time"
              />
            </label>
            <label className="font-bold">
              Closing
              <input
                className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line-strong)] px-3"
                defaultValue="17:00"
                name="closesAt"
                required
                type="time"
              />
            </label>
            <label className="font-bold">
              Slot duration
              <select
                className="mt-2 min-h-12 w-full rounded-xl border border-[var(--line-strong)] bg-white px-3"
                defaultValue="30"
                name="slotDurationMinutes"
              >
                {[15, 20, 30, 45, 60].map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} minutes
                  </option>
                ))}
              </select>
            </label>
            <button
              className="min-h-12 rounded-full bg-[var(--teal)] px-5 font-extrabold text-white hover:bg-[var(--teal-dark)] md:col-span-5 md:justify-self-start"
              disabled={busy}
              type="submit"
            >
              {busy ? "Saving…" : "Save schedule"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold">Upcoming schedules</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.schedules.map((schedule) => (
              <article
                className="rounded-2xl border border-[var(--line)] bg-white p-5"
                key={schedule._id}
              >
                <p className="font-extrabold">
                  {dentistName(schedule.dentistId, data.doctorNames)}
                </p>
                <p className="mt-2 text-[var(--muted-text)]">
                  {schedule.dateKey} · {schedule.opensAt}–{schedule.closesAt}
                </p>
                <p className="mt-1 text-sm font-bold">
                  {schedule.slotDurationMinutes}-minute slots
                </p>
                <button
                  className="mt-4 min-h-11 font-bold text-[var(--danger)]"
                  onClick={() => removeSchedule(schedule._id)}
                  type="button"
                >
                  Delete schedule
                </button>
              </article>
            ))}
            {data.schedules.length === 0 ? (
              <p>No future schedules yet.</p>
            ) : null}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold">Appointments</h2>
          <div className="mt-4 space-y-4">
            {data.appointments.map((appointment) => (
              <article
                className="rounded-2xl border border-[var(--line)] bg-white p-5"
                key={appointment.publicReference}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold">{appointment.patientName}</p>
                    <p className="text-sm text-[var(--muted-text)]">
                      <bdi>{appointment.publicReference}</bdi> ·{" "}
                      {appointment.status}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--aqua-soft)] px-3 py-1 text-sm font-bold">
                    {dentistName(appointment.dentistId, data.doctorNames)}
                  </span>
                </div>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="font-bold">Service</dt>
                    <dd>{serviceName(appointment.serviceId)}</dd>
                  </div>
                  <div>
                    <dt className="font-bold">Date and time</dt>
                    <dd>
                      {new Intl.DateTimeFormat("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Karachi",
                      }).format(new Date(appointment.startAtUtc))}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold">Mobile</dt>
                    <dd>
                      <bdi>{appointment.mobile}</bdi>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold">Email</dt>
                    <dd>{appointment.email || "Not provided"}</dd>
                  </div>
                </dl>
                {appointment.status === "confirmed" ? (
                  <div className="mt-5 grid gap-3 border-t border-[var(--line)] pt-5 lg:grid-cols-2">
                    <form
                      className="flex flex-wrap gap-2"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const form = new FormData(event.currentTarget);
                        void updateAppointment(appointment.publicReference, {
                          action: "reschedule",
                          dateKey: String(form.get("dateKey")),
                          time: String(form.get("time")),
                        });
                      }}
                    >
                      <input
                        aria-label="New appointment date"
                        className="min-h-11 rounded-xl border border-[var(--line-strong)] px-3"
                        name="dateKey"
                        required
                        type="date"
                      />
                      <input
                        aria-label="New appointment time"
                        className="min-h-11 rounded-xl border border-[var(--line-strong)] px-3"
                        name="time"
                        required
                        type="time"
                      />
                      <button
                        className="min-h-11 rounded-full bg-[var(--teal)] px-4 font-bold text-white"
                        type="submit"
                      >
                        Reschedule
                      </button>
                    </form>
                    <form
                      className="flex flex-wrap gap-2 lg:justify-end"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const reason = String(
                          new FormData(event.currentTarget).get("reason"),
                        );
                        if (window.confirm("Cancel this appointment?"))
                          void updateAppointment(appointment.publicReference, {
                            action: "cancel",
                            reason,
                          });
                      }}
                    >
                      <input
                        aria-label="Cancellation reason"
                        className="min-h-11 rounded-xl border border-[var(--line-strong)] px-3"
                        name="reason"
                        placeholder="Cancellation reason"
                        required
                      />
                      <button
                        className="min-h-11 rounded-full border border-[var(--danger)] px-4 font-bold text-[var(--danger)]"
                        type="submit"
                      >
                        Cancel appointment
                      </button>
                    </form>
                  </div>
                ) : null}
              </article>
            ))}
            {data.appointments.length === 0 ? (
              <p>No appointments yet.</p>
            ) : null}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold">Notification delivery</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="bg-[var(--aqua-soft)]">
                <tr>
                  <th className="p-4">Appointment</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.notifications.map((notification) => (
                  <tr
                    className="border-t border-[var(--line)]"
                    key={notification._id}
                  >
                    <td className="p-4 font-bold">
                      <bdi>{notification.appointmentReference}</bdi>
                    </td>
                    <td className="p-4">{notification.channel}</td>
                    <td className="p-4">{notification.event}</td>
                    <td className="p-4">{notification.status}</td>
                    <td className="p-4">
                      {isNotificationRetryEligible(notification) ? (
                        <button
                          className="min-h-11 rounded-full border border-[var(--line-strong)] px-4 font-bold text-[var(--teal-dark)]"
                          disabled={busy}
                          onClick={() =>
                            void retryNotification(notification._id)
                          }
                          type="button"
                        >
                          Retry email
                        </button>
                      ) : (
                        <span aria-hidden="true">â€”</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
