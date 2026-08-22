import "server-only";
import { randomBytes } from "node:crypto";
import type { ClientSession } from "mongoose";
import { connectMongo } from "@/infrastructure/database/mongoose";
import {
  bookingRequestSchema,
  createNotificationDrafts,
  type AppointmentEvent,
} from "@/modules/appointments/contracts";
import {
  AppointmentModel,
  NotificationJobModel,
  SlotClaimModel,
} from "@/modules/appointments/appointment.model";
import { DentistScheduleModel } from "@/modules/scheduling/dentist-schedule.model";
import {
  createUtcDateForPakistanTime,
  generateScheduleSlots,
  getPakistanDateKey,
  scheduleChangeKeepsBookedSlots,
  scheduleInputSchema,
} from "@/modules/scheduling/availability";
import {
  dispatchAppointmentEmails,
  dispatchAppointmentSms,
  dispatchNotificationEmail,
} from "@/modules/notifications/brevo.server";
import { isNotificationRetryEligible } from "@/modules/appointments/contracts";
import { eligibleDoctorIds } from "@/modules/doctors/doctor.contracts";
import { DoctorModel } from "@/modules/doctors/doctor.model";

export class SlotUnavailableError extends Error {
  constructor() {
    super("The selected appointment slot is no longer available");
    this.name = "SlotUnavailableError";
  }
}

export class AppointmentNotFoundError extends Error {
  constructor() {
    super("Appointment not found");
    this.name = "AppointmentNotFoundError";
  }
}

export class NotificationRetryError extends Error {
  constructor() {
    super("The notification is not eligible for retry");
    this.name = "NotificationRetryError";
  }
}

function createReference() {
  return `SDC-${new Date().getUTCFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function isDuplicateKey(error: unknown) {
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000,
  );
}

async function eligibleSchedules(dentistId: string, dateKey: string) {
  const currentDoctorIds = await DoctorModel.distinct("id", {
    isActive: { $ne: false },
  });
  const eligibleIds = eligibleDoctorIds(dentistId, currentDoctorIds);
  if (eligibleIds.length === 0) return [];
  const query = { dateKey, dentistId: { $in: eligibleIds } };
  return DentistScheduleModel.find(query).sort({ dentistId: 1 }).lean();
}

export async function getAvailableSlots(dentistId: string, dateKey: string) {
  await connectMongo();
  const schedules = await eligibleSchedules(dentistId, dateKey);
  const now = new Date();
  const results: Array<{ dentistId: string; time: string }> = [];

  for (const schedule of schedules) {
    const generated = generateScheduleSlots(schedule);
    const claims = await SlotClaimModel.find({
      dentistId: schedule.dentistId,
      startAtUtc: { $in: generated.map((slot) => slot.startAtUtc) },
    })
      .select("startAtUtc")
      .lean();
    const occupied = new Set(
      claims.map((claim) => claim.startAtUtc.toISOString()),
    );

    for (const slot of generated) {
      if (slot.startAtUtc <= now || occupied.has(slot.startAtUtc.toISOString()))
        continue;
      if (
        !results.some(
          (result) =>
            result.time === slot.time && dentistId === "no-preference",
        )
      ) {
        results.push({ dentistId: schedule.dentistId, time: slot.time });
      }
    }
  }

  return results.sort((a, b) => a.time.localeCompare(b.time));
}

export async function createConfirmedAppointment(input: unknown) {
  const booking = bookingRequestSchema.parse(input);
  const database = await connectMongo();

  if (booking.time === "") {
    const selectedDoctorExists = await DoctorModel.exists(
      booking.dentistId === "no-preference"
        ? { isActive: { $ne: false } }
        : { id: booking.dentistId, isActive: { $ne: false } },
    );
    if (!selectedDoctorExists) throw new SlotUnavailableError();
    if (booking.dateKey < getPakistanDateKey())
      throw new SlotUnavailableError();
    if (
      (await getAvailableSlots(booking.dentistId, booking.dateKey)).length > 0
    )
      throw new SlotUnavailableError();

    const publicReference = createReference();
    await database.connection.transaction(async (session) => {
      await AppointmentModel.create(
        [
          {
            publicReference,
            dentistId: booking.dentistId,
            serviceId: booking.serviceId,
            requestedDateKey: booking.dateKey,
            startAtUtc: null,
            durationMinutes: null,
            patientName: booking.patientName,
            mobile: booking.mobile,
            email: booking.email || null,
            locale: booking.locale,
            status: "confirmed",
            history: [
              {
                from: null,
                to: "confirmed",
                actor: "guest",
                at: new Date(),
              },
            ],
          },
        ],
        { session },
      );
      await NotificationJobModel.insertMany(
        createNotificationDrafts({
          appointmentReference: publicReference,
          email: booking.email || undefined,
          mobile: booking.mobile,
          event: "booking-confirmed",
        }),
        { session },
      );
    });

    await Promise.allSettled([
      dispatchAppointmentEmails(publicReference),
      dispatchAppointmentSms(publicReference),
    ]);
    return {
      publicReference,
      status: "confirmed" as const,
      timePending: true,
    };
  }

  const schedules = await eligibleSchedules(booking.dentistId, booking.dateKey);
  const candidates = schedules.filter((schedule) =>
    generateScheduleSlots(schedule).some((slot) => slot.time === booking.time),
  );
  if (candidates.length === 0) throw new SlotUnavailableError();

  let createdReference = "";
  for (const schedule of candidates) {
    const startAtUtc = createUtcDateForPakistanTime(
      booking.dateKey,
      booking.time,
    );
    if (startAtUtc <= new Date()) throw new SlotUnavailableError();
    const publicReference = createReference();

    try {
      await database.connection.transaction(async (session) => {
        await SlotClaimModel.create(
          [
            {
              dentistId: schedule.dentistId,
              startAtUtc,
              appointmentReference: publicReference,
            },
          ],
          { session },
        );
        await AppointmentModel.create(
          [
            {
              publicReference,
              dentistId: schedule.dentistId,
              serviceId: booking.serviceId,
              requestedDateKey: booking.dateKey,
              startAtUtc,
              durationMinutes: schedule.slotDurationMinutes,
              patientName: booking.patientName,
              mobile: booking.mobile,
              email: booking.email || null,
              locale: booking.locale,
              status: "confirmed",
              history: [
                {
                  from: null,
                  to: "confirmed",
                  actor: "guest",
                  at: new Date(),
                },
              ],
            },
          ],
          { session },
        );
        await NotificationJobModel.insertMany(
          createNotificationDrafts({
            appointmentReference: publicReference,
            email: booking.email || undefined,
            mobile: booking.mobile,
            event: "booking-confirmed",
          }),
          { session },
        );
        createdReference = publicReference;
      });
      break;
    } catch (error) {
      if (isDuplicateKey(error) && booking.dentistId === "no-preference")
        continue;
      if (isDuplicateKey(error)) throw new SlotUnavailableError();
      throw error;
    }
  }

  if (!createdReference) throw new SlotUnavailableError();

  await Promise.allSettled([
    dispatchAppointmentEmails(createdReference),
    dispatchAppointmentSms(createdReference),
  ]);
  return {
    publicReference: createdReference,
    status: "confirmed" as const,
    timePending: false,
  };
}

export async function listAdminData() {
  await connectMongo();
  const [schedules, appointments, notifications] = await Promise.all([
    DentistScheduleModel.find({ dateKey: { $gte: getPakistanDateKey() } })
      .sort({ dateKey: 1, opensAt: 1 })
      .lean(),
    AppointmentModel.find().sort({ startAtUtc: -1 }).limit(200).lean(),
    NotificationJobModel.find().sort({ createdAt: -1 }).limit(200).lean(),
  ]);
  return {
    schedules: schedules.map((schedule) => ({
      _id: String(schedule._id),
      dentistId: schedule.dentistId,
      dateKey: schedule.dateKey,
      opensAt: schedule.opensAt,
      closesAt: schedule.closesAt,
      slotDurationMinutes: schedule.slotDurationMinutes,
    })),
    appointments: appointments.map((appointment) => ({
      publicReference: appointment.publicReference,
      dentistId: appointment.dentistId,
      serviceId: appointment.serviceId,
      requestedDateKey:
        appointment.requestedDateKey ??
        (appointment.startAtUtc
          ? getPakistanDateKey(appointment.startAtUtc)
          : ""),
      startAtUtc: appointment.startAtUtc?.toISOString() ?? null,
      durationMinutes: appointment.durationMinutes ?? null,
      patientName: appointment.patientName,
      mobile: appointment.mobile,
      email: appointment.email,
      status: appointment.status,
    })),
    notifications: notifications.map((notification) => ({
      _id: String(notification._id),
      appointmentReference: notification.appointmentReference,
      channel: notification.channel,
      event: notification.event,
      status: notification.status,
    })),
  };
}

export async function retryNotificationEmail(id: string) {
  await connectMongo();
  const notification = await NotificationJobModel.findById(id).lean();
  if (!notification || !isNotificationRetryEligible(notification)) {
    throw new NotificationRetryError();
  }
  if (!(await dispatchNotificationEmail(id)))
    throw new NotificationRetryError();
}

export async function upsertSchedule(input: unknown) {
  const schedule = scheduleInputSchema.parse(input);
  await connectMongo();
  if (
    !(await DoctorModel.exists({
      id: schedule.dentistId,
      isActive: { $ne: false },
    }))
  ) {
    throw new Error("The selected doctor does not exist");
  }
  const generated = new Set(
    generateScheduleSlots(schedule).map((slot) =>
      slot.startAtUtc.toISOString(),
    ),
  );
  const dayStart = createUtcDateForPakistanTime(schedule.dateKey, "00:00");
  const dayEnd = createUtcDateForPakistanTime(schedule.dateKey, "23:59");
  const [existingSchedule, claims] = await Promise.all([
    DentistScheduleModel.findOne({
      dentistId: schedule.dentistId,
      dateKey: schedule.dateKey,
    }).lean(),
    SlotClaimModel.find({
      dentistId: schedule.dentistId,
      startAtUtc: { $gte: dayStart, $lte: dayEnd },
    }).lean(),
  ]);
  if (
    !scheduleChangeKeepsBookedSlots(
      existingSchedule,
      schedule,
      claims.length > 0,
    )
  ) {
    throw new Error("A schedule with appointments cannot be changed");
  }
  if (claims.some((claim) => !generated.has(claim.startAtUtc.toISOString()))) {
    throw new Error("Schedule conflicts with an existing appointment");
  }

  return DentistScheduleModel.findOneAndUpdate(
    { dentistId: schedule.dentistId, dateKey: schedule.dateKey },
    { $set: schedule },
    { returnDocument: "after", upsert: true, runValidators: true },
  ).lean();
}

export async function deleteSchedule(id: string) {
  await connectMongo();
  const schedule = await DentistScheduleModel.findById(id).lean();
  if (!schedule) return;
  const generated = generateScheduleSlots(schedule).map(
    (slot) => slot.startAtUtc,
  );
  if (
    await SlotClaimModel.exists({
      dentistId: schedule.dentistId,
      startAtUtc: { $in: generated },
    })
  ) {
    throw new Error("A schedule with appointments cannot be deleted");
  }
  await DentistScheduleModel.deleteOne({ _id: id });
}

async function appendNotificationJobs(
  appointment: {
    publicReference: string;
    email?: string | null;
    mobile: string;
  },
  event: AppointmentEvent,
  session: ClientSession,
) {
  await NotificationJobModel.insertMany(
    createNotificationDrafts({
      appointmentReference: appointment.publicReference,
      email: appointment.email || undefined,
      mobile: appointment.mobile,
      event,
    }),
    { session },
  );
}

export async function cancelAppointment(reference: string, reason: string) {
  if (reason.trim().length < 3)
    throw new Error("Cancellation reason is required");
  const database = await connectMongo();
  await database.connection.transaction(async (session) => {
    const appointment = await AppointmentModel.findOne({
      publicReference: reference,
      status: "confirmed",
    }).session(session);
    if (!appointment) throw new AppointmentNotFoundError();
    await SlotClaimModel.deleteOne({ appointmentReference: reference }).session(
      session,
    );
    appointment.status = "cancelled";
    appointment.cancellationReason = reason.trim();
    appointment.history.push({
      from: "confirmed",
      to: "cancelled",
      actor: "admin",
      reason: reason.trim(),
      at: new Date(),
    });
    await appointment.save({ session });
    await appendNotificationJobs(appointment, "appointment-cancelled", session);
  });
  await dispatchAppointmentEmails(reference);
}

export async function rescheduleAppointment(
  reference: string,
  input: { dateKey: string; time: string },
) {
  const database = await connectMongo();
  await database.connection.transaction(async (session) => {
    const appointment = await AppointmentModel.findOne({
      publicReference: reference,
      status: "confirmed",
    }).session(session);
    if (!appointment) throw new AppointmentNotFoundError();
    if (
      !(await DoctorModel.exists({
        id: appointment.dentistId,
        isActive: { $ne: false },
      }).session(session))
    )
      throw new SlotUnavailableError();
    const schedule = await DentistScheduleModel.findOne({
      dentistId: appointment.dentistId,
      dateKey: input.dateKey,
    }).session(session);
    if (
      !schedule ||
      !generateScheduleSlots(schedule).some((slot) => slot.time === input.time)
    )
      throw new SlotUnavailableError();
    const newStart = createUtcDateForPakistanTime(input.dateKey, input.time);
    if (newStart <= new Date()) throw new SlotUnavailableError();

    try {
      await SlotClaimModel.create(
        [
          {
            dentistId: appointment.dentistId,
            startAtUtc: newStart,
            appointmentReference: `${reference}:replacement`,
          },
        ],
        { session },
      );
    } catch (error) {
      if (isDuplicateKey(error)) throw new SlotUnavailableError();
      throw error;
    }
    await SlotClaimModel.deleteOne({ appointmentReference: reference }).session(
      session,
    );
    await SlotClaimModel.updateOne(
      { appointmentReference: `${reference}:replacement` },
      { $set: { appointmentReference: reference } },
      { session },
    );
    appointment.startAtUtc = newStart;
    appointment.durationMinutes = schedule.slotDurationMinutes;
    appointment.requestedDateKey = input.dateKey;
    appointment.history.push({
      from: "confirmed",
      to: "confirmed",
      actor: "admin",
      reason: "Appointment rescheduled",
      at: new Date(),
    });
    await appointment.save({ session });
    await appendNotificationJobs(
      appointment,
      "appointment-rescheduled",
      session,
    );
  });
  await dispatchAppointmentEmails(reference);
}
