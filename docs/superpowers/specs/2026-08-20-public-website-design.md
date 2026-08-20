# Shahbaz Dental Clinic Four-Page Website Design

## Objective

Build a polished, bilingual, mobile-first public website for Shahbaz Dental Clinic using a light, accessible visual theme and clearly identified demonstration content. This milestone provides only Home, Services, Dentists, and an interactive Book Appointment demonstration.

## Scope

The included locale-aware routes are:

- Home: `/[locale]`
- Services: `/[locale]/services`
- Dentists: `/[locale]/dentists`
- Book Appointment: `/[locale]/book`

No other public, patient, staff, or administrator pages are included. Service-detail, dentist-profile, blog, authentication, contact, policy, and dashboard routes are excluded from this milestone.

## Navigation

The desktop header displays:

- Clinic identity linked to Home
- Home
- Services
- Dentists
- Urdu/English language switch
- A visually prominent Book Appointment button

The mobile header displays the clinic identity, language switch, booking button, and an accessible menu button containing Home, Services, and Dentists. The current locale is preserved during navigation.

The footer repeats links only to the included routes and displays the verified locality: Samundri, District Faisalabad, Punjab 37300.

## Visual direction

The website uses a light visual theme with strong, verified contrast:

- Warm off-white is the primary page background.
- White cards create clean clinical surfaces.
- Deep navy is used for headings and body text.
- Deep teal is used for primary actions and interactive states.
- Pale aqua supports informational sections.
- A restrained amber accent is limited to highlights and focus treatment.

Manrope remains the English typeface and Noto Sans Arabic remains the Urdu typeface. Large headings use compact spacing and clear weight, while body text maintains comfortable line length and line height.

The layouts avoid excessive gradients, glass effects, and low-contrast gray text. Primary text, controls, borders, and focus indicators target WCAG 2.2 Level AA contrast. Motion is subtle and disabled by the user's reduced-motion preference.

## Temporary imagery and demonstration content

Temporary local synthetic images depict a clean dental environment, general dental care, and sample professionals. Images use stable local files so the layout does not depend on third-party availability. They are not presented as photographs of Shahbaz Dental Clinic, its staff, or its patients.

The Dentists page displays explicit localized “demonstration profile” labels. Sample names, interests, languages, and availability are illustrative and are not presented as verified clinic facts. The website does not display fabricated qualifications, registrations, awards, testimonials, prices, phone numbers, exact address, or opening hours.

## Home page

The Home page includes:

- An image-led hero with the primary Book Appointment action and secondary Services link
- A clear demonstration-content notice
- Featured services linking to the Services page or preselecting a service in booking
- Sample dentist cards linking to the Dentists page or preselecting a dentist in booking
- Patient-first care principles
- Cleanliness and infection-prevention commitments written without unverifiable claims
- A concise three-step booking explanation
- Verified Samundri locality information
- An urgent-care notice stating that the website is not an emergency-response service
- A closing booking action

## Services page

The Services page displays demonstration service cards grouped into consultation, preventive care, restorative care, family care, and smile care. Each card contains a plain-language summary, illustrative duration, and Book This Service action.

Service cards do not open detail routes. Booking links pass the selected service to the booking demonstration. Content does not diagnose visitors, promise outcomes, or present illustrative pricing as real clinic pricing.

## Dentists page

The Dentists page presents a small directory of clearly labelled demonstration profiles using synthetic portraits. Each card includes a sample area of interest, languages, illustrative working days, and a Book with This Dentist action.

Dentist cards do not open profile routes. Booking links pass the selected sample dentist to the booking demonstration. A prominent notice explains that profiles must be replaced with clinic-verified staff information before launch.

## Booking demonstration

The booking page provides a mobile-first six-step experience:

1. Select a service.
2. Select a demonstration dentist or No Preference.
3. Select a demonstration date and time.
4. Enter minimum patient and contact details.
5. Review demonstration consent and contact-verification information.
6. View a demonstration confirmation.

The single Samundri branch is assigned automatically and never appears as a selector. Progress is communicated using text and step position. Each step supports back and continue controls, field-level validation, keyboard use, and screen-reader announcements.

The flow operates entirely in browser state. It does not write to MongoDB, reserve a real appointment, create an account, or send email or SMS. The confirmation screen repeats this limitation and provides routes to Home and Services.

Service and dentist query parameters may preselect an option only when they match the allow-listed demonstration records. Invalid values are ignored safely.

## Content and component architecture

Typed demonstration-data modules store services, dentists, availability, and localized copy. English and Urdu pages render the same record identifiers with localized display values. This allows later replacement by MongoDB records and Cloudinary assets without restructuring the routes.

Reusable components provide:

- Responsive header and mobile navigation
- Footer
- Section heading and page introduction
- Demonstration-content notice
- Service cards
- Dentist cards
- Optimized local image treatment
- Form fields and localized error messages
- Booking progress and step panels

Server Components remain the default. Client Components are limited to mobile navigation and the interactive booking demonstration.

## Responsive and accessibility behavior

Layouts begin as a single column and add columns only when space permits. The site must not scroll horizontally at 320 CSS pixels. Controls provide at least 44-by-44-pixel targets. Mobile booking actions remain easy to reach without obscuring content or device safe areas.

Both locales use semantic landmarks, one primary heading per page, meaningful alternative text, visible keyboard focus, explicit form labels, connected validation messages, and live status announcements. Urdu pages render with `dir="rtl"`; phone-like values, times, and mixed-script identifiers use directional isolation.

Information never relies on color alone. All animation respects `prefers-reduced-motion`.

## Error, empty, and success states

The deterministic demonstration data renders without loading placeholders. If data is unexpectedly unavailable, the page shows a localized empty-state notice and a Home link. The booking experience prevents forward navigation when required information is missing, preserves valid choices while moving backward, and shows a localized non-delivery confirmation at completion.

## Testing

Tests verify:

- Header and footer contain only approved routes
- Mobile navigation is keyboard accessible
- All four destinations render in English and Urdu
- Locale switching and RTL direction work correctly
- Services and dentists are labelled as demonstration content
- Valid booking links preselect allow-listed records and invalid values are ignored
- Booking-step validation and transitions complete without a server write
- Representative 320-pixel mobile pages do not produce horizontal overflow

Lint, TypeScript checking, unit tests, production build, and Playwright checks must pass before delivery.

## Acceptance criteria

The milestone is accepted when:

1. Home, Services, Dentists, and Book Appointment render in English and Urdu.
2. The header and footer contain only the approved navigation destinations.
3. The light theme maintains readable WCAG 2.2 Level AA contrast for primary text and controls.
4. Temporary images and demonstration profiles cannot reasonably be mistaken for verified clinic staff or facilities.
5. The site remains usable without horizontal scrolling at 320 CSS pixels.
6. The booking demonstration completes without MongoDB writes or provider messages.
7. Primary interactions are keyboard accessible and directionally correct in Urdu.
8. Automated checks pass for the implemented scope.
