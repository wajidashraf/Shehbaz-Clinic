# Public Service and Dentist Detail Pages Design

Date: 2026-08-22
Status: Approved design

## Goal

Improve the public Services and Dentists journeys so patients can first scan concise directory information, then open a dedicated page that explains a treatment or clinician clearly before booking. The experience must work equally well in English and Urdu, on mobile and desktop.

## Scope

This work covers:

- the localized Services directory at `/[locale]/services`;
- new localized service detail routes at `/[locale]/services/[serviceId]`;
- the localized Dentists directory at `/[locale]/dentists`;
- existing doctor profile routes at `/[locale]/dentists/[doctorId]`;
- shared service and dentist cards used by those pages;
- localized content and focused component/route tests.

It does not introduce an admin-managed service model or change the existing doctor database model.

## Experience Architecture

Both areas use the same information pattern:

1. The directory provides concise comparison information.
2. A clear “View details” or “View profile” action opens a stable, shareable URL.
3. The detail page provides enough context to make an informed booking choice.
4. Booking links carry the selected service or eligible dentist into the appointment form.
5. Related records keep patients exploring without returning to the directory first.

Dedicated pages are preferred over modals or expanding cards because they provide clearer navigation, better accessibility, shareable URLs, and more comfortable reading on mobile.

## Services Directory

The Services directory remains category-filterable. Each card emphasizes:

- a prominent treatment image;
- localized category and service name;
- a short localized summary;
- expected appointment duration;
- a “View service details” action.

The directory card no longer treats immediate booking as its primary action. The page introduction explains that patients can review treatment information before selecting an appointment.

## Service Detail Page

Each service receives a localized route using its existing stable service ID. The page includes:

- back navigation to the Services directory;
- category, title, treatment image, summary, and expected duration;
- a localized “Who this may help” section;
- a localized “What to expect” section;
- an assessment notice explaining that final recommendations depend on a dentist’s examination;
- a prominent booking action linking to `/[locale]/book?service=[serviceId]`;
- related services selected from the same category first, then from the remaining directory if needed.

On desktop, the booking summary remains sticky beside the longer content. On mobile it appears in the natural document flow. Unknown service IDs return the framework’s not-found response.

## Service Content Model

The current static service records remain the source of truth and gain these bilingual fields:

- `details`: a fuller treatment overview;
- `suitableFor`: a short list of common reasons a patient may seek the service;
- `expectations`: a short ordered or unordered list describing the visit;
- `clinicalNote`: a treatment-specific qualification where useful.

All fields contain English and Urdu text. The existing category, summary, duration, image mapping, and booking IDs remain unchanged.

## Dentists Directory

The Dentists page keeps the Embla carousel and presents one focused clinician card at a time. Cards remain concise and contain:

- portrait and clinic-role badge;
- professional title;
- name and qualification;
- registration when available;
- short biography excerpt;
- up to two focus areas;
- a “View profile” action.

No directory card contains an appointment button. The page introduction and no-preference booking section are simplified so the primary decision remains choosing a profile.

## Doctor Profile Page

The doctor profile becomes an image-led editorial layout using the existing doctor record. It includes:

- back navigation to the team directory;
- portrait, professional title, name, qualifications, and registration;
- biography and education;
- focus areas displayed as readable expertise items;
- working days only when data exists;
- a booking summary for doctors eligible to receive appointments;
- an Other Dentists carousel beneath the active profile.

The profile must use the existing booking policy. Dr. Manzoor Shahbaz remains informational and never receives a booking action. Missing doctor records continue to return the not-found response.

## Visual Direction

The design uses the existing Shahbaz Dental Clinic theme only: deep teal ink, clinic teal, light aqua, white, saffron accents, and the established typography. The visual character is calm clinical editorial rather than dashboard-like.

Key treatments:

- `rounded-lg` surfaces throughout;
- restrained borders and soft theme-colored shadows;
- strong image crops and readable content hierarchy;
- one memorable image-led introduction per detail page;
- smooth cubic-bezier hover and movement transitions;
- visible focus styles and minimum comfortable touch targets;
- correct logical spacing and direction-aware icons for Urdu;
- reduced-motion behavior for nonessential animation.

## Components and Boundaries

The implementation should keep responsibilities focused:

- `ServicesDirectory` owns category selection and filtered directory rendering.
- `ServiceCard` owns concise service presentation and detail navigation.
- a new service-detail component owns the localized treatment layout.
- `DentistsCarousel` owns carousel behavior only.
- `DentistCard` owns concise clinician presentation and profile navigation.
- `DoctorProfile` owns the full clinician presentation and applies the existing booking policy.
- route files load translations/data, resolve records, create metadata where appropriate, and handle not-found cases.

Server routes should pass only the records and localized labels required by client components. Independent translation and data reads should remain parallel where possible.

## Accessibility and Responsive Behavior

- Heading levels follow the page hierarchy.
- Interactive cards use explicit links rather than clickable container elements.
- Keyboard users can reach all navigation and carousel controls.
- Focus rings remain visible.
- Images have localized alternative text.
- English renders LTR and Urdu renders RTL using logical spacing utilities.
- Mobile layouts avoid horizontal overflow and keep actions full-width where helpful.
- Sticky desktop content must not obscure the site header or trap keyboard focus.

## Error and Empty States

- Unknown service and doctor IDs return the localized not-found experience.
- A service with no same-category relations falls back to other available services.
- An empty related-doctors collection omits that section.
- Optional doctor fields are omitted cleanly rather than leaving empty labels.
- Existing database connection behavior is unchanged by this UI project.

## Testing

Focused tests will verify:

- service cards navigate to localized detail routes;
- service detail pages render bilingual overview, suitability, expectations, duration, and booking links;
- invalid service IDs use not-found handling;
- related services exclude the active service;
- dentist directory cards remain profile-only;
- eligible doctor profiles provide booking and Dr. Manzoor Shahbaz does not;
- optional doctor fields render conditionally;
- English and Urdu routes preserve direction-aware navigation;
- relevant pages have no mobile horizontal overflow.

Type checking, linting, focused unit tests, and a production build are required before completion. Browser verification should run when the configured database is available.
