# Shahbaz Dental Clinic Public Website Design

## Objective

Build a polished, bilingual, mobile-first public website for Shahbaz Dental Clinic using clearly identified demonstration content. The experience should let visitors explore the clinic, services, and sample dentist profiles and complete an interactive appointment-booking demonstration without creating real appointments or sending messages.

## Scope

This milestone includes these locale-aware routes under both `/en` and `/ur`:

- Home: `/[locale]`
- About: `/[locale]/about`
- Services: `/[locale]/services`
- Dentists: `/[locale]/dentists`
- Dentist profile: `/[locale]/dentists/[slug]`
- Booking demonstration: `/[locale]/book`
- Patient login: `/[locale]/login`
- Patient registration: `/[locale]/register`
- Patient information: `/[locale]/patient-information`
- Frequently asked questions: `/[locale]/faq`
- Contact: `/[locale]/contact`
- Directions: `/[locale]/directions`
- Urgent-care information: `/[locale]/urgent-care`
- Privacy notice: `/[locale]/privacy`
- Cookie notice: `/[locale]/cookies`
- Terms of use: `/[locale]/terms`
- Accessibility statement: `/[locale]/accessibility`
- Appointment cancellation and no-show policy: `/[locale]/cancellation-policy`

Service Details, Blog, and Blog Article pages are explicitly excluded. Service cards provide a concise summary and link directly to the booking demonstration.

Authenticated patient dashboards and all receptionist, dentist, and administrator interfaces remain outside this milestone.

## Navigation

The desktop header displays:

- Home
- Services
- Dentists
- About
- Contact
- Patient Login
- Urdu/English language switch
- A visually prominent Book Appointment action

The mobile header displays the clinic identity, language switch, booking action, and menu button. Its expanded menu exposes the primary links plus FAQ, Directions, and Urgent Care. Policy pages remain available in the footer.

The current locale is preserved when navigating. The language switch takes visitors to the equivalent locale route when possible and otherwise to that locale's home page.

## Visual direction

The interface uses a calm, contemporary dental-care identity rather than a generic software layout:

- Deep teal communicates care and confidence.
- Warm ivory replaces stark clinical white as the main canvas.
- Deep navy provides readable body and heading contrast.
- A restrained gold accent highlights important details and focus states.
- Soft aqua surfaces distinguish supporting information.
- Organic rounded shapes reference natural smiles without using tooth-shaped decoration throughout the interface.

Manrope remains the English typeface and Noto Sans Arabic remains the Urdu typeface. Headings use compact tracking and decisive weight; body copy prioritizes readability. Sections use generous spacing, asymmetric image-and-copy compositions on large screens, and simple single-column flow on small screens.

Motion is limited to subtle entrance and hover transitions and is disabled by the user's reduced-motion preference.

## Imagery and demonstration content

Temporary local synthetic images will represent a welcoming clinic environment, dental equipment, and sample professionals. They must not be presented as real photographs of Shahbaz Dental Clinic, its staff, or its patients. Dentist cards and profiles carry an explicit localized “demonstration profile” label.

No fabricated testimonial is presented as a verified patient statement. Any social-proof area uses general service commitments rather than patient quotations.

Unverified telephone numbers, WhatsApp numbers, exact street address, opening hours, dentist qualifications, professional registrations, prices, and awards are not published as facts. Related actions are labelled as pending clinic verification and cannot call or message an unrelated number. The verified locality remains:

- Samundri
- District Faisalabad
- Punjab
- Postal code 37300

The exact address and active contact methods can replace the demonstration state later through MongoDB-backed content and Cloudinary assets.

## Page composition

### Home

The home page includes a distinctive image-led hero, clear booking action, clinic introduction, featured service cards, sample dentist profiles, care principles, infection-prevention information, a short booking process, locality and directions summary, FAQ preview, urgent-care notice, and closing appointment action.

### About

The about page presents the clinic's patient-first values, the intended visit experience, cleanliness commitments, and the verified Samundri service area. It avoids unverified history, awards, or outcome claims.

### Services

The services page groups demonstration services into consultation, preventive care, restorative care, family care, and smile care. Each card contains a plain-language summary, example duration, and booking action. It does not diagnose visitors, guarantee outcomes, or link to a service-detail route.

### Dentists and dentist profile

The directory displays clearly labelled demonstration profiles with synthetic portraits, areas of interest, languages, and sample working days. Profile pages repeat the demonstration disclosure, show example services and availability, and lead to the booking demonstration. No profile is represented as a verified member of clinic staff.

### Booking demonstration

The mobile-first booking experience contains six steps:

1. Select a service.
2. Select a sample dentist or No Preference.
3. Select a demonstration date and time.
4. Enter minimum patient and contact details.
5. Review demonstration consent and contact-verification information.
6. View a demonstration confirmation.

The single Samundri branch is assigned automatically and never appears as a selector. Progress is visible with text and step position. Each step supports back and continue controls, field-level errors, keyboard use, and screen-reader announcements.

The flow operates entirely in browser state. It does not write to MongoDB, reserve a time, send email or SMS, or claim a real appointment. The final screen states this clearly and offers a route back to the home page.

### Login and registration

These pages demonstrate the intended patient access experience with accessible forms and localized validation. Submission produces a localized demonstration message and does not create an account or session. Password fields provide clear requirements and appropriate autocomplete attributes.

### Patient information and FAQ

Patient Information provides general preparation, arrival, child-visit, and aftercare guidance with a medical-information disclaimer. FAQ uses accessible disclosure controls and answers common questions about booking, timing, payments, and urgent needs without inventing clinic policy.

### Contact and directions

Contact shows the verified locality, a demonstration contact form, and a clear notice that active phone, email, WhatsApp, exact address, and hours await verification. Form submission stays local and shows a non-delivery confirmation. Directions provides the locality and travel-planning guidance without embedding an inaccurate map pin.

### Urgent care and policies

Urgent Care explains that the site is not an emergency-response service and advises visitors to seek appropriate local emergency assistance for severe symptoms. Privacy, Cookies, Terms, Accessibility, and Cancellation Policy are concise launch-ready placeholders that distinguish current demonstration behavior from future operational policy. They do not claim legal or regulatory compliance.

## Content and component architecture

Public demonstration records live in typed locale-neutral data modules using translation keys or explicit English and Urdu values. Pages render the same data structures for both locales. This keeps sample services, profiles, FAQs, navigation, and booking options consistent and makes later MongoDB replacement straightforward.

Reusable components provide:

- Page shell and section heading
- Responsive site header and mobile menu
- Footer and mobile quick-action bar
- Optimized local image treatment
- Service and dentist cards
- Notice and disclosure panels
- FAQ disclosure list
- Form fields and localized error summary
- Booking stepper and individual booking-step panels
- Policy-page layout

Server Components remain the default. Client Components are limited to interactive navigation, FAQ disclosure behavior where native details are insufficient, demonstration forms, and the booking wizard.

## Responsive and accessibility behavior

Layouts start with a single-column small-screen presentation and progressively add columns at wider breakpoints. Controls have at least 44-by-44-pixel targets. Sticky mobile actions account for safe-area insets and never obscure page content. Dense card grids collapse without horizontal scrolling.

Both locales use semantic landmarks, one primary heading per page, meaningful alternative text, visible focus, keyboard-operable controls, explicit form labels, linked validation messages, and live status announcements. Urdu pages render with `dir="rtl"`; phone-like values, times, and mixed-script identifiers use directional isolation.

Color contrast targets WCAG 2.2 Level AA. Information never relies on color alone. Motion respects `prefers-reduced-motion`.

## Error, empty, and success states

Public data modules provide deterministic content, so normal pages do not require loading placeholders. Invalid dentist slugs render the localized not-found page. Demonstration forms expose empty, invalid, submitted, and non-delivery states. The booking wizard prevents forward navigation when required data is missing and preserves completed choices while moving backward.

## Testing

Unit and component tests verify:

- Header routes and accessible mobile navigation
- Bilingual content and locale-preserving links
- Service and dentist demonstration disclosures
- Dentist-profile lookup and missing-profile behavior
- Booking-step validation and state transitions
- Demonstration form non-delivery behavior

Browser tests verify:

- Primary public navigation at mobile and desktop widths
- Complete English and Urdu booking demonstrations
- RTL document direction and language switching
- No horizontal overflow on representative phone widths
- Keyboard accessibility of menus, forms, and booking controls
- Successful rendering of every included public route

Lint, TypeScript checking, unit tests, production build, and Playwright checks must pass before delivery.

## Acceptance criteria

The milestone is accepted when:

1. Every included route renders in English and Urdu.
2. Header and footer navigation match the approved information architecture.
3. The site is usable without horizontal scrolling on a 320-pixel-wide viewport.
4. The booking demonstration completes without a server write or provider message.
5. Demonstration profiles and imagery cannot reasonably be mistaken for verified clinic staff or facilities.
6. Unverified contact and clinic information is not published as fact.
7. Primary interactions are keyboard accessible, responsive, and directionally correct in Urdu.
8. Automated checks pass for the implemented scope.
