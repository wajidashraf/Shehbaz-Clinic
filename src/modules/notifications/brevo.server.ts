import "server-only";
import { getServerEnv } from "@/config/env";
import {
  AppointmentModel,
  NotificationJobModel,
} from "@/modules/appointments/appointment.model";
import { demoDentists, demoServices } from "@/content/demo-content";

const eventSubjects = {
  "booking-confirmed": "Appointment confirmed — Shahbaz Dental Clinic",
  "appointment-cancelled": "Appointment cancelled — Shahbaz Dental Clinic",
  "appointment-rescheduled": "Appointment rescheduled — Shahbaz Dental Clinic",
} as const;

function appointmentEmailText(appointment: {
  publicReference: string;
  dentistId: string;
  serviceId: string;
  startAtUtc: Date;
}) {
  const dentist = demoDentists.find(
    (item) => item.id === appointment.dentistId,
  );
  const service = demoServices.find(
    (item) => item.id === appointment.serviceId,
  );
  const when = new Intl.DateTimeFormat("en-PK", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Karachi",
  }).format(appointment.startAtUtc);

  return [
    `Appointment reference: ${appointment.publicReference}`,
    `Service: ${service?.name.en ?? appointment.serviceId}`,
    `Dentist: ${dentist?.name.en ?? appointment.dentistId}`,
    `Date and time: ${when}`,
    "Shahbaz Dental Clinic, Samundri, District Faisalabad, Punjab 37300",
  ].join("\n");
}

export async function dispatchAppointmentEmails(reference: string) {
  const environment = getServerEnv();
  if (environment.EMAIL_PROVIDER !== "brevo") return;
  const jobs = await NotificationJobModel.find({
    appointmentReference: reference,
    channel: "email",
    status: { $in: ["queued", "failed"] },
  })
    .select("_id")
    .lean();

  for (const job of jobs) await dispatchNotificationEmail(String(job._id));
}

export async function dispatchNotificationEmail(jobId: string) {
  const environment = getServerEnv();
  if (environment.EMAIL_PROVIDER !== "brevo") return false;

  const job = await NotificationJobModel.findOneAndUpdate(
    {
      _id: jobId,
      channel: "email",
      status: { $in: ["queued", "failed"] },
    },
    { $set: { status: "processing" } },
    { new: true },
  );
  if (!job) return false;

  const appointment = await AppointmentModel.findOne({
    publicReference: job.appointmentReference,
  }).lean();
  if (!appointment) {
    job.status = "failed";
    job.lastErrorCode = "appointment-missing";
    job.attempts += 1;
    await job.save();
    return false;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": environment.BREVO_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: environment.EMAIL_FROM_ADDRESS,
          name: environment.EMAIL_FROM_NAME,
        },
        subject: eventSubjects[job.event as keyof typeof eventSubjects],
        textContent: appointmentEmailText(appointment),
        to: [{ email: job.recipient }],
      }),
    });

    if (!response.ok) throw new Error(`provider-${response.status}`);
    job.status = "sent";
    job.sentAt = new Date();
    job.lastErrorCode = null;
  } catch (error) {
    job.status = "failed";
    job.lastErrorCode =
      error instanceof Error && /^provider-\d+$/.test(error.message)
        ? error.message
        : "provider-unavailable";
  }
  job.attempts += 1;
  await job.save();
  return job.status === "sent";
}
