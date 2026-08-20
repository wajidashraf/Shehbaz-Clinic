# Shehbaz Dental Clinic MVP Design

**Date:** 2026-08-20  
**Status:** Approved for implementation planning  
**Clinic:** Shehbaz Dental Clinic  
**Location:** Samundri, District Faisalabad, Punjab 37300, Pakistan  
**Time zone:** Asia/Karachi  
**Languages:** English and Urdu

## 1. Executive summary

The first delivery is a working vertical slice of a secure bilingual dental-clinic platform. It includes a public website, patient authentication, an appointment-booking wizard, a basic patient portal, and a basic receptionist calendar. MongoDB Atlas is the system of record. A transaction-backed interval-claim model prevents overlapping appointments even when concurrent requests select the same time.

The product serves one clinic branch. Patients never select a branch; all appointments are assigned automatically to Shehbaz Dental Clinic in Samundri. The data model retains clinic and branch boundaries so additional branches can be introduced later without changing appointment ownership.

The MVP uses only synthetic development data. Production email, SMS, deployment, real clinic content, and real patient use remain explicitly gated on provider setup, verified clinic information, security review, restore testing, and legal/privacy review.

## 2. Confirmed decisions

- Use a modular Next.js application rather than separate frontend and backend deployments.
- Use TypeScript, the Next.js App Router, and Tailwind CSS.
- Use MongoDB Atlas and Mongoose.
- Validate every server boundary with Zod.
- Store secrets only in local or deployment environment variables.
- Use a separately runnable Redis/BullMQ worker in the same repository for queued notifications and scheduled work.
- Use development email and SMS adapters during the MVP; they must not contact real recipients.
- Use English as the fallback locale and provide complete Urdu RTL foundations.
- Use npm as the package manager.
- Target a locally runnable application first. A private staging deployment follows only after the core booking flow passes its tests.

## 3. Clinic configuration and production gates

The initial branch configuration is:

- Clinic name: Shehbaz Dental Clinic
- City/tehsil: Samundri
- District: Faisalabad
- Province: Punjab
- Postal code: 37300
- Country: Pakistan
- Time zone: Asia/Karachi
- Currency: PKR

The following values are intentionally absent and must remain visibly marked as unverified configuration until the clinic supplies and approves them:

- Complete street address
- Primary telephone number
- WhatsApp number and permission to display it
- Clinic email address
- Google Maps link or coordinates
- Opening hours, Friday hours, and breaks
- Dentist names, photographs, qualifications, registrations, languages, and availability
- Final service catalogue, durations, buffers, prices, and preparation instructions
- Cancellation deadline and no-show rules
- Emergency and after-hours wording
- Logo, domain, policy text, and policy versions
- Production email and SMS providers

No implementation may invent these values. Synthetic records must be unmistakably labelled as demonstration data.

## 4. Scope

### 4.1 Included in the MVP

- Responsive public homepage
- Public service listing and service-detail pages
- English and Urdu locale routes and layout direction
- Patient registration, login, logout, and session revocation
- Development contact-verification flow
- Password reset foundation
- Synthetic services, dentists, schedules, and clinic configuration
- Service, dentist, date/time, details, verification/consent, and confirmation booking steps
- No-preference dentist selection
- Transactional temporary slot holds
- Conflict-safe appointment confirmation
- Basic patient dashboard with upcoming and previous appointments
- Basic appointment detail and permitted cancellation/rescheduling entry points
- Basic receptionist daily/weekly calendar
- Receptionist appointment search, status changes, rescheduling, and cancellation
- Role-based and resource-level authorization
- Appointment status history and audit logging
- Provider-independent email and SMS interfaces
- Development notification mailbox and delivery status
- Background job foundations, retries, and idempotency
- Automated unit, integration, concurrency, authorization, localization, accessibility, and browser tests
- Local setup and environment templates

### 4.2 Deferred from the MVP

- Real email or SMS delivery
- Full administrator content-management system
- Full dentist dashboard and leave workflow
- Advanced reports and exports
- Automated waiting-list offers
- Marketing communications
- Pre-visit medical forms
- Clinical records, X-rays, prescriptions, treatment plans, and invoices
- Production hosting and production database access
- Real clinic content, testimonials, photographs, or patient data

Deferred modules must not be represented in the UI as functioning features.

## 5. Architecture

The repository is a modular monolith. Next.js renders public and authenticated interfaces and exposes versioned route handlers. Business rules live in domain modules rather than pages or route handlers. MongoDB repositories isolate persistence. Provider adapters isolate email, SMS, queues, hashing, clocks, and identifiers.

Primary modules:

- `clinic`: clinic and single-branch configuration
- `identity`: users, credentials, sessions, verification, password resets, and MFA
- `authorization`: roles, permissions, and resource-level policy checks
- `patients`: minimum patient profile and preferences
- `dentists`: public profiles and service assignments
- `services`: service catalogue, durations, buffers, and localized content
- `scheduling`: opening rules, availability rules, exceptions, and slot calculation
- `appointments`: holds, confirmation, transitions, rescheduling, and cancellation
- `notifications`: templates, jobs, adapters, delivery events, and webhook contracts
- `consent`: versioned patient acknowledgements and notification consent
- `audit`: append-only security and business activity records

Route handlers authenticate, validate, authorize, call one domain use case, and translate its result into a consistent API response. They do not contain scheduling or persistence logic. UI components consume typed application services and never access MongoDB directly.

The notification worker shares domain contracts with the web process but runs independently. A web deployment can therefore scale without duplicating scheduled notification execution.

## 6. Route and screen structure

Locale-aware public routes use `/en/...` and `/ur/...`.

Public MVP routes:

- Home
- Services
- Service details
- Book an appointment
- Patient registration
- Patient login
- Contact verification
- Appointment confirmation
- Privacy notice placeholder
- Cancellation/no-show policy placeholder
- Urgent-care notice placeholder

Authenticated patient routes:

- Dashboard
- Appointment details
- Appointment management
- Profile and communication preferences
- Sessions and secure logout

Authenticated receptionist routes:

- Daily and weekly appointment calendar
- Appointment search and details
- Create appointment for a patient
- Reschedule or cancel appointment
- Check in, complete, or mark no-show
- Notification delivery status and development resend

The single branch is automatically assigned by the server. No public or staff booking form presents a branch selector in the MVP.

## 7. MongoDB model

Initial collections:

- `clinics`
- `branches`
- `users`
- `sessions`
- `patients`
- `dentists`
- `services`
- `dentistServices`
- `availabilityRules`
- `scheduleExceptions`
- `appointments`
- `appointmentStatusHistory`
- `slotClaims`
- `contactVerifications`
- `passwordResetTokens`
- `mfaFactors`
- `consentRecords`
- `notificationJobs`
- `notificationDeliveryEvents`
- `auditLogs`
- `idempotencyRecords`

MongoDB `ObjectId` values are internal. Public appointment references and public resource locators use cryptographically random UUIDs or equivalently strong opaque identifiers. Dates are stored as UTC `Date` values and rendered in Asia/Karachi.

Important indexes include:

- Unique normalized email identity where email login is enabled
- Unique normalized mobile identity where mobile login is enabled
- Unique session token digest
- Unique appointment public reference
- Unique compound slot claim on `branchId`, `dentistId`, and `intervalStartUtc`
- TTL on temporary slot-claim `expiresAt`
- TTL on verification, reset, session, and idempotency expiry fields where appropriate
- Appointment calendar indexes on branch, dentist, patient, start time, and status
- Audit indexes on actor, target, action, and timestamp

Mongoose schemas use strict mode and explicit indexes. Zod application schemas remain the canonical request/response validation boundary. Database migrations create and verify required indexes before an environment is considered ready.

## 8. Availability and booking design

Availability is calculated from:

- Configured branch opening hours
- Friday-specific hours
- Branch holidays and closures
- Dentist recurring working hours
- Dentist leave, breaks, and blocked periods
- Services assigned to the dentist
- Service duration and pre/post buffers
- Minimum booking notice and maximum advance period
- Existing active slot claims

The server calculates candidate slots; the browser never declares a slot valid. Availability responses are advisory because another user may acquire a slot before submission.

### 8.1 Interval claims

Each appointment consumes a contiguous set of five-minute intervals covering service time and configured buffers. Every interval is represented by a `slotClaims` document. The compound unique index on branch, dentist, and interval start makes overlapping claims impossible at the database boundary.

### 8.2 Temporary hold transaction

When a patient chooses a slot, the server:

1. Revalidates service, dentist, branch, schedule, and time against the server clock.
2. Resolves “No preference” to one eligible dentist deterministically.
3. Identifies and removes expired claims for the requested interval set.
4. Starts a MongoDB transaction.
5. Inserts every interval claim with a common hold identifier and expiration.
6. Creates a pending-verification appointment and initial status history.
7. Writes the relevant audit event.
8. Commits all writes together.

A duplicate-key conflict aborts the transaction. The API returns a localized slot-unavailable result and fresh availability suggestions without revealing another patient.

### 8.3 Confirmation and expiration

Successful contact verification and required consent convert the appointment and every related claim from temporary to reserved in one transaction. Confirmed claims do not have an expiration date. Expired holds are treated as unavailable to their former owner and available to new requests. Application cleanup runs before acquisition; MongoDB TTL cleanup is a secondary garbage-collection mechanism and is not the correctness mechanism.

### 8.4 Rescheduling and cancellation

Rescheduling acquires the new interval set before releasing the old set, then updates the appointment and histories atomically. If new-slot acquisition fails, the old appointment remains unchanged. Cancellation changes status and releases claims in one transaction. Staff overrides require a permission, a reason, and an audit event.

## 9. Appointment states

The MVP supports:

- Pending verification
- Pending receptionist approval
- Confirmed
- Checked in
- In progress
- Completed
- Rescheduled
- Cancelled by patient
- Cancelled by clinic
- No-show

Every transition is checked against an explicit state machine. Status changes append an immutable history entry containing previous state, next state, actor, timestamp, reason when required, and notification event identifier when created.

## 10. Authentication and authorization

- Passwords use Argon2id with reviewed parameters.
- Verification codes and reset tokens are random, expire quickly, have retry limits, and are stored only as digests.
- Authentication responses do not disclose whether an identity exists.
- Sessions are database backed, stored in Secure/HttpOnly/SameSite cookies, expire, rotate when privileges change, and can be revoked.
- State-changing browser requests require same-origin/CSRF protection.
- Receptionist accounts require TOTP MFA before access to staff routes.
- Patient MFA is outside this MVP but the identity model permits it later.
- Route protection is not sufficient: every use case applies role and resource-level authorization.
- Patients can access only their own appointment resources.
- Receptionists receive only operational permissions required for appointment work.
- Seeded administrator access is development-only and cannot be used in production.

## 11. Privacy and security

- Collect only contact and appointment information needed for the booking workflow.
- Do not collect detailed medical histories in public forms.
- Never place private patient data in URLs, analytics, logs, exceptions, or notification subjects.
- Mask email addresses and mobile numbers unless the active task requires full display.
- Use structured allow-listed audit metadata rather than arbitrary serialized requests.
- Apply rate limits to login, verification, password reset, availability, holds, booking, and resend actions.
- Set restrictive security headers and Content Security Policy.
- Avoid raw HTML rendering for untrusted content.
- Use TLS for Atlas and deployment traffic.
- Keep provider and database credentials outside source control.
- Separate appointment notification consent from optional marketing consent; marketing is not implemented in the MVP.
- Treat Atlas encryption at rest as infrastructure protection, not a substitute for application authorization and data minimization.

The application must not claim legal or regulatory compliance. Pakistan-specific privacy, healthcare, consumer, communications, and retention obligations require professional review before production use.

## 12. Notifications

Domain events create notification jobs through an outbox-compatible application service. Each logical notification has a deterministic idempotency key derived from event, appointment, recipient, channel, template version, and scheduled time.

The MVP implements:

- Provider-independent email and SMS adapter contracts
- Development adapters that record sanitized previews locally
- BullMQ queues for email, SMS, and scheduled reminders
- Exponential retry for temporary errors
- Permanent-failure classification
- Delivery-event history
- Duplicate prevention
- Template version, locale, masked recipient, attempts, and provider identifier metadata

Development adapters must never send network messages. Production provider adapters and signed webhook endpoints are later modules, but their interfaces are established in this MVP.

## 13. Localization and content direction

- English route prefix: `/en`
- Urdu route prefix: `/ur`
- English document metadata: `lang="en"`, `dir="ltr"`
- Urdu document metadata: `lang="ur"`, `dir="rtl"`
- English is the safe fallback locale.
- Navigation, controls, validation, errors, status messages, and transactional templates use translation dictionaries.
- Localized service and policy content uses explicit language variants.
- Phone numbers, times, and appointment references are rendered in direction-isolated spans.
- User locale preference is stored after registration.
- Untranslated administrator content falls back to English and is visibly flagged to authorized staff.

English UI typography uses a readable modern sans-serif. Urdu UI body copy uses a legible Arabic-script interface font; Nastaliq is limited to branding or large display text when readability remains acceptable.

## 14. Interface design

The visual system uses deep navy for trust and primary text, accessible teal for primary actions, soft blue for calm informational surfaces, white and light gray for clinical cleanliness, and a restrained warm accent for warnings. Statuses always include text or icons and never rely on color alone.

The booking interface is a mobile-first six-step wizard:

1. Service
2. Dentist or No preference
3. Date and available time
4. Minimum patient/contact details
5. Verification and consent
6. Confirmation

The home page prioritizes Book an Appointment, followed by clinic contact and directions placeholders. The mobile layout uses large touch targets and concise sections. The receptionist calendar provides accessible status labels, keyboard-operable controls, and list alternatives to dense calendar views.

Accessibility targets WCAG 2.2 Level AA and includes semantic landmarks, skip navigation, correct headings, visible focus, keyboard operation, labelled fields, linked error summaries, live regions, at least 44-by-44-pixel primary touch targets, reduced motion, responsive text, sufficient contrast, and full RTL behavior.

## 15. API design

Route handlers are versioned under `/api/v1`. Initial resources include:

- Authentication, verification, password reset, sessions, and staff MFA
- Services and dentists
- Availability
- Appointment holds, confirmation, details, rescheduling, cancellation, and status transitions
- Patient profile and notification preferences
- Receptionist calendar and appointment operations
- Development notification deliveries

Every endpoint provides:

- Input and output validation
- Authentication where required
- Role and resource authorization
- Rate limiting appropriate to risk
- Correlation identifier
- Consistent localized-safe errors
- Idempotency for booking and notification mutations
- Audit logging for sensitive actions

Errors use a stable machine code, localized user message, field-error map when applicable, and correlation ID. Stack traces, identifiers belonging to other patients, and raw provider/database errors are never returned.

## 16. Testing strategy

### Unit tests

- Pakistan mobile-number normalization
- Time-zone conversion and date formatting
- Availability intersection and exception precedence
- Interval generation and service buffers
- Appointment state transitions
- Role and resource policies
- Zod validation and localized error mapping
- Notification idempotency and retry classification

### Integration tests

- Run against a MongoDB replica set, not a standalone mock
- Temporary hold creation and expiry
- Transaction rollback on partial interval conflict
- Two concurrent patients competing for one slot
- No-preference dentist assignment
- Confirmation, cancellation, and rescheduling atomicity
- Immutable history and audit creation
- Session revocation and receptionist MFA enforcement
- Patient isolation from other patients' resources

### Browser and accessibility tests

- Complete English and Urdu booking journeys
- RTL layout and mixed-direction identifiers
- Keyboard-only booking and staff navigation
- Automated accessibility checks on primary screens
- Mobile, tablet, and desktop viewport coverage
- Slow/error/loading/empty/success states

Tests use only synthetic identities and appointments. The first milestone is accepted only when the primary booking journey passes, a concurrent duplicate booking cannot succeed, authorization isolation passes, and English/Urdu critical flows have no serious automated accessibility violations.

## 17. Local development and configuration

The repository commits `.env.example` and ignores `.env.local`. Required local values include MongoDB connection details, application URL, session secret, encryption/pepper material where used, and Redis connection details. Secrets must not be pasted into chat or committed.

MongoDB Atlas supplies replica-set transactions. The developer creates an application-specific database user, restricts the Atlas IP access list, and places the connection string in `.env.local`. Redis may run locally through Docker for the MVP worker. Synthetic seed commands create the one Samundri branch, demonstration services, demonstration dentists, schedules, and test users.

Startup validation fails fast when required environment variables are missing or malformed. Production mode refuses development notification adapters and demonstration credentials.

## 18. Acceptance criteria

The MVP is ready for its next review when:

1. A visitor can switch between English and Urdu and navigate public pages.
2. A patient can register, verify contact through the development channel, and sign in.
3. A patient can select a service, dentist or No preference, and an available time.
4. Every appointment is assigned to the single Samundri branch without branch selection.
5. Two concurrent requests cannot confirm overlapping time with the same dentist.
6. Service duration and buffers, branch hours, dentist hours, breaks, leave, and existing claims affect availability.
7. Appointment times display correctly in Asia/Karachi.
8. The patient can see only their appointments.
9. Receptionist access requires the role and MFA and supports the approved appointment operations.
10. Appointment mutations create status history and sanitized audit records.
11. Development notifications are queued once and never reach real recipients.
12. Critical English and Urdu flows are keyboard accessible and pass the defined automated checks.
13. The application starts from documented commands with only the documented local prerequisites.

## 19. Delivery sequence

Implementation planning will decompose the MVP into independently testable increments:

1. Repository, runtime, configuration, and quality gates
2. Localization and accessible application shell
3. MongoDB connection, schemas, indexes, and synthetic seed data
4. Authentication, sessions, MFA, and authorization
5. Public services and dentist discovery
6. Availability calculation
7. Transactional holds and appointment confirmation
8. Booking wizard
9. Patient dashboard and appointment management
10. Receptionist calendar and operations
11. Notification worker and development adapters
12. End-to-end security, accessibility, and concurrency verification

Each increment must include its own tests and documentation. Production integrations and deployment are intentionally separate specifications after this vertical slice is accepted.
