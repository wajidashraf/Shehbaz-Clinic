# Admin-managed testimonials design

## Goal

Replace the homepage testimonial carousel's hard-coded reviews with bilingual testimonials managed through the authenticated clinic administration area. Administrators can add, edit, delete, hide, and show reviews. Each review can include a patient image; when no image is supplied, the public card uses a local default avatar.

## Data model

A dedicated `Testimonial` MongoDB model keeps testimonial concerns separate from appointments and doctors. Each record contains:

- A stable generated identifier.
- Patient name in English and Urdu.
- Treatment name in English and Urdu.
- Review text in English and Urdu.
- One treatment/review date stored as a real date.
- An optional Cloudinary image URL.
- A publication flag used to hide or show the record.
- A numeric display order.
- Standard creation and update timestamps.

Input validation trims values and enforces sensible maximum lengths. English and Urdu values are required for the patient name, treatment, and review. The date must be valid. Display order is an integer. Public repository results expose plain serializable records rather than Mongoose documents.

## Initial data

The seed process inserts simple dummy testimonials using stable identifiers. Seeding is idempotent, so running it again updates those initial records without duplicating them. After seeding, MongoDB is the only testimonial source; the public component does not merge static and database reviews.

## Public homepage

The homepage starts `listPublishedTestimonials()` alongside its existing independent server queries. It passes the resulting records and localized section labels into one `TestimonialsSection` instance. The accidental duplicate testimonial section is removed.

The carousel retains its existing appearance and behavior:

- One review card on smaller screens and two on desktop.
- Five-second automatic rotation.
- Previous, next, pause, resume, keyboard, reduced-motion, and RTL-aware behavior.
- Bilingual fields selected from the current locale.
- A local professional default avatar when `image` is absent.
- Five decorative stars, matching the current design.

When no records are published, the section returns `null` and leaves no empty public section.

## Administration experience

The administration dashboard includes a dedicated `AdminTestimonialManager`. Its form supports:

- English and Urdu patient names.
- English and Urdu treatment names.
- English and Urdu review text.
- Treatment/review date.
- Optional JPEG, PNG, or WebP image.
- Visible or hidden state.
- Display order.

Existing records appear as compact preview cards. An administrator can select a card for editing, replace or remove its image, change its visibility or order, and save. Separate Hide/Show and Delete controls support quick management. Destructive deletion requires browser confirmation. After successful mutations, the dashboard reloads the server-owned data through the existing admin data endpoint.

## API and repository boundaries

The feature uses a dedicated `/api/v1/admin/testimonials` route:

- `POST` accepts multipart form data and creates or updates a testimonial.
- `DELETE` removes a testimonial by identifier.

Both mutations require the existing origin validation and authenticated admin session. The testimonial repository owns database reads and writes:

- `listPublishedTestimonials()` returns visible records ordered by display order, then newest date.
- `listAdminTestimonials()` returns all records for administration.
- `findTestimonial()` locates an existing record.
- `saveTestimonial()` creates or updates a validated record.
- `removeTestimonial()` deletes a record.

The existing admin data response includes `testimonials`, allowing the dashboard to refresh doctors, schedules, appointments, notifications, and testimonials in one request.

## Image storage and cleanup

The existing media abstraction and Cloudinary adapter are reused. `testimonial-image` is added as an allowed media purpose. Image validation retains the existing five MiB size limit, JPEG/PNG/WebP allowlist, content-signature verification, and dimension limits.

Upload/save ordering prevents partial state:

1. Validate fields and the uploaded image.
2. Upload a new image and record its media asset.
3. Save the testimonial.
4. After a successful replacement, delete the previous stored image and media record.

If testimonial persistence fails after upload, the new upload is compensated. If old-image cleanup fails after a successful save, the API returns the saved testimonial with a `cleanupPending` signal, matching the doctor-management pattern. Deleting a testimonial similarly removes its managed image; a cleanup failure is reported without recreating the deleted database record.

## Error handling

The API returns stable error codes for unauthorized access, invalid origin, invalid input or image, missing records, upload/save failure, and deletion failure. The admin manager maps these to short actionable messages and disables repeated submissions while a request is active. Public reads fail closed: if the database cannot be reached, the existing application error handling remains responsible for the page response rather than silently showing stale hard-coded data.

## Testing

Implementation follows red-green-refactor. Tests cover:

- Testimonial input validation and serialization.
- Published-only filtering and deterministic ordering.
- Optional-image behavior and default avatar rendering.
- English and Urdu review rendering.
- Carousel behavior with database-supplied records, including empty and single-record collections.
- Authenticated API create/update/delete behavior, image compensation, and cleanup signals.
- Admin form submission plus Edit, Hide/Show, and Delete controls.
- Homepage server data flow and removal of the duplicate section.
- Seed idempotency where practical through stable identifiers and upserts.

Final verification includes focused unit tests, the broader unit suite, TypeScript, ESLint, production build, and relevant Playwright homepage/admin checks. Any unrelated pre-existing failure is reported separately with its exact command and error.

## Scope boundaries

This feature does not allow public visitors to submit testimonials, add ratings, moderate user-generated content, or associate testimonials with appointment records. Those workflows can be added later without changing the dedicated testimonial boundary.
