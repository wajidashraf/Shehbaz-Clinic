import { z } from "zod";
import { demoDentists, demoServices } from "@/content/demo-content";
import { dateKeySchema } from "@/modules/scheduling/availability";

const serviceIds = demoServices.map((service) => service.id);
const dentistIds = demoDentists.map((dentist) => dentist.id);

export const bookingRequestSchema = z.object({
  serviceId: z.string().refine((value) => serviceIds.includes(value)),
  dentistId: z
    .string()
    .refine((value) => value === "no-preference" || dentistIds.includes(value)),
  dateKey: dateKeySchema,
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  patientName: z.string().trim().min(2).max(100),
  mobile: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9 -]{7,19}$/),
  email: z.union([z.email(), z.literal("")]).optional(),
  locale: z.enum(["en", "ur"]),
  consent: z.literal(true),
});

export const appointmentEventSchema = z.enum([
  "booking-confirmed",
  "appointment-cancelled",
  "appointment-rescheduled",
]);

export type AppointmentEvent = z.infer<typeof appointmentEventSchema>;

export function isNotificationRetryEligible(notification: {
  channel: string;
  status: string;
}) {
  return (
    notification.channel === "email" &&
    ["queued", "failed"].includes(notification.status)
  );
}

type NotificationDraftInput = {
  appointmentReference: string;
  email?: string;
  mobile: string;
  event: AppointmentEvent;
};

export function createNotificationDrafts(input: NotificationDraftInput) {
  const drafts: Array<{
    appointmentReference: string;
    channel: "email" | "sms";
    event: AppointmentEvent;
    recipient: string;
    status: "queued" | "pending-provider";
  }> = [];

  if (input.email) {
    drafts.push({
      appointmentReference: input.appointmentReference,
      channel: "email",
      event: input.event,
      recipient: input.email,
      status: "queued",
    });
  }

  drafts.push({
    appointmentReference: input.appointmentReference,
    channel: "sms",
    event: input.event,
    recipient: input.mobile,
    status: "pending-provider",
  });

  return drafts;
}
