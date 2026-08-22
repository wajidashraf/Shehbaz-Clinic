import "server-only";
import { getServerEnv } from "@/config/env";
import {
  AppointmentModel,
  NotificationJobModel,
} from "@/modules/appointments/appointment.model";
import { demoServices, getLocalizedText } from "@/content/demo-content";
import { findDoctorIncludingInactive } from "@/modules/doctors/doctor.repository";
import type { Locale } from "@/i18n/config";
import {
  appointmentSmsText,
  normalizePakistanSmsRecipient,
} from "@/modules/notifications/appointment-sms";
import { sendBrevoTransactionalSms } from "@/modules/notifications/brevo-sms.server";

const eventSubjects = {
  "booking-confirmed": "Appointment confirmed — Shahbaz Dental Clinic",
  "appointment-cancelled": "Appointment cancelled — Shahbaz Dental Clinic",
  "appointment-rescheduled": "Appointment rescheduled — Shahbaz Dental Clinic",
} as const;

function appointmentEmailText(
  appointment: {
    publicReference: string;
    dentistId: string;
    serviceId: string;
    requestedDateKey?: string | null;
    startAtUtc?: Date | null;
  },
  dentistName: string,
) {
  const service = demoServices.find(
    (item) => item.id === appointment.serviceId,
  );
  const when = appointment.startAtUtc
    ? new Intl.DateTimeFormat("en-PK", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Karachi",
      }).format(appointment.startAtUtc)
    : `${new Intl.DateTimeFormat("en-PK", {
        dateStyle: "full",
        timeZone: "Asia/Karachi",
      }).format(
        new Date(`${appointment.requestedDateKey}T00:00:00+05:00`),
      )} (time will be informed as soon as possible via WhatsApp or phone call)`;

  return [
    `Appointment reference: ${appointment.publicReference}`,
    `Service: ${service?.name.en ?? appointment.serviceId}`,
    `Dentist: ${dentistName}`,
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
    { returnDocument: "after" },
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
    const dentist = await findDoctorIncludingInactive(appointment.dentistId);
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
        textContent: appointmentEmailText(
          appointment,
          dentist?.name.en ?? appointment.dentistId,
        ),
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

export async function dispatchAppointmentSms(reference: string) {
  const environment = getServerEnv();
  if (environment.SMS_PROVIDER !== "brevo") return false;
  const jobs = await NotificationJobModel.find({
    appointmentReference: reference,
    channel: "sms",
    event: "booking-confirmed",
    status: { $in: ["pending-provider", "failed"] },
  })
    .select("_id")
    .lean();

  const results = await Promise.all(
    jobs.map((job) => dispatchNotificationSms(String(job._id))),
  );
  return results.some(Boolean);
}

export async function dispatchNotificationSms(jobId: string) {
  const environment = getServerEnv();
  if (environment.SMS_PROVIDER !== "brevo") return false;

  const job = await NotificationJobModel.findOneAndUpdate(
    {
      _id: jobId,
      channel: "sms",
      event: "booking-confirmed",
      status: { $in: ["pending-provider", "failed"] },
    },
    { $set: { status: "processing" } },
    { returnDocument: "after" },
  );
  if (!job) return false;

  let sent = false;
  try {
    const appointment = await AppointmentModel.findOne({
      publicReference: job.appointmentReference,
    }).lean();
    if (!appointment) {
      job.status = "failed";
      job.lastErrorCode = "appointment-missing";
    } else {
      const recipient = normalizePakistanSmsRecipient(job.recipient);
      if (!recipient) {
        job.status = "failed";
        job.lastErrorCode = "invalid-recipient";
      } else {
        const locale = appointment.locale as Locale;
        const dentist = await findDoctorIncludingInactive(
          appointment.dentistId,
        );
        const service = demoServices.find(
          (item) => item.id === appointment.serviceId,
        );
        const smsBase = {
          dentistName: dentist
            ? getLocalizedText(dentist.name, locale)
            : appointment.dentistId,
          locale,
          publicReference: appointment.publicReference,
          serviceName: service
            ? getLocalizedText(service.name, locale)
            : appointment.serviceId,
        };
        const content = appointment.startAtUtc
          ? appointmentSmsText({
              ...smsBase,
              startAtUtc: appointment.startAtUtc,
            })
          : appointmentSmsText({
              ...smsBase,
              requestedDateKey: appointment.requestedDateKey!,
            });
        const result = await sendBrevoTransactionalSms({
          apiKey: environment.BREVO_API_KEY!,
          content,
          recipient,
          sender: environment.BREVO_SMS_SENDER!,
          unicodeEnabled: locale === "ur",
        });

        job.status = result.sent ? "sent" : "failed";
        job.sentAt = result.sent ? new Date() : null;
        job.lastErrorCode = result.sent ? null : result.errorCode;
        sent = result.sent;
      }
    }
  } catch {
    job.status = "failed";
    job.lastErrorCode = "provider-unavailable";
  }
  job.attempts += 1;
  await job.save();
  return sent;
}
