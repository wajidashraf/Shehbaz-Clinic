# Appointments and Admin Scheduling Design

**Date:** 2026-08-20  
**Status:** Approved for direct implementation

## Scope

Convert the public booking journey into a real guest appointment flow backed by MongoDB. Add an English-only authenticated admin area at `/admin` for dentist schedules and appointment operations. Remove all public sample and demonstration wording while retaining replaceable temporary content and imagery.

## Dentist directory

The public directory contains Dr. Sobia Ahmad, Dr. Amna Rauf, Dr. Ahmad, Dr. Rauf, and Dr. Shahbaz. Temporary care focus, languages, working-day copy, biographies, and images may be used until the clinic supplies verified replacements. The website does not invent qualifications, registrations, awards, or treatment guarantees.

## Scheduling and booking

Admin creates date-specific schedules separately for each dentist by choosing a date, opening time, closing time, and slot duration. The server generates candidate slots in `Asia/Karachi`, removes occupied times, and never trusts a browser-declared slot.

Guests book with a name, mobile number, and optional email. A valid submission immediately creates a confirmed appointment. A MongoDB transaction inserts a unique slot claim, appointment, initial history record, audit record, and notification jobs. A competing booking receives a localized slot-unavailable response.

Admin can list appointments, cancel with a reason, and reschedule to another available slot. Rescheduling acquires the new claim before releasing the old one in the same transaction. Cancellation releases the claim. Schedule deletion or shortening is rejected when it would invalidate a confirmed appointment.

## Admin authentication

`/admin/login` accepts the administrator email and password. A one-time seed command reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local`, stores an Argon2id password hash in MongoDB, and never persists plaintext credentials. Successful login creates a database-backed session represented by a random token in a Secure-in-production, HttpOnly, SameSite cookie. Only token digests are stored. Admin pages and every admin mutation enforce the admin role server-side. Login attempts are rate limited. TOTP MFA is deferred.

## Notifications

Booking, cancellation, and rescheduling create email and SMS jobs. After the database commit, Brevo email is attempted when the patient supplied an email and Brevo is configured. Delivery success or sanitized failure is recorded without logging patient details. SMS jobs remain recorded as pending-provider until paid Brevo SMS credentials are configured. Admin can inspect delivery state and safely retry eligible email jobs.

Notification failure never rolls back a confirmed booking or appointment change.

## Routes

- Public: existing `/en` and `/ur` Home, Services, Dentists, and Book Appointment routes.
- Admin: `/admin/login` and protected `/admin`, English only.
- APIs: public availability and booking endpoints plus protected admin session, schedule, appointment-operation, and notification-retry endpoints.

## Validation and testing

Zod validates all API input. Dates are stored in UTC and displayed in Pakistan time. Private data is excluded from URLs, logs, and error responses. Tests cover authentication, authorization, slot generation, double-booking conflict, booking persistence, cancellation, rescheduling, notification state, both public locales, admin access control, and mobile overflow.
