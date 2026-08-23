# Shahbaz Dental Clinic Homepage Finalization Design

## Objective

Finalize the existing Shahbaz Dental Clinic homepage for production without redesigning approved sections. Homepage display content must remain available without database, API, or media-service access, while the existing booking route and its backend-supported behavior remain unchanged.

## Scope Boundaries

- Preserve the current homepage section order, visual language, imagery, card treatments, colors, and typography.
- Limit visual changes to bug fixes, stable hover states, responsive layout corrections, navigation behavior, accessibility, and production readiness.
- Keep the booking buttons, `/[locale]/book` route, and current booking backend integration working.
- Do not add booking features or change booking behavior.
- Do not delete internal dentist, service, booking, admin, or API routes. Homepage navigation and cards simply stop promoting separate dentist/service pages for now.
- Preserve all existing uncommitted homepage work and modify it in place.

## Static Homepage Content

The homepage must not call doctor or testimonial repositories. It will render from local, bilingual TypeScript objects and the existing local message/catalog files only.

- Services continue to use the local demo service catalog.
- Testimonials use a local published testimonial collection.
- The featured dentist uses a local bilingual profile object with the fields needed by the existing feature card.
- Hero text and all other homepage-facing English and Urdu strings remain local.
- Homepage images use paths under `public/images/demo`; backend or Cloudinary changes cannot alter them.
- The homepage is statically renderable for both supported locales. Booking and admin pages may remain dynamic because they are outside this static-content boundary.

## Featured Dentist Card

Keep the existing approved card structure and styling. Fix its rendering at the source:

- Render it unconditionally from the local featured-dentist object instead of waiting for a database record marked `isFeatured`.
- Use the existing asset `/images/demo/featureDoctor.avif` with `next/image`.
- Keep localized name, title, qualification, education, registration, biography, and related card text.
- Give the section the anchor `id="dentist"` with an appropriate sticky-header scroll offset.
- Keep its booking call to action linked to the existing localized booking route.
- Do not link the card to a separate dentist profile page.

## Hero

- Configure the exact English title `Healthy Teeth. Confident Smiles.` directly inside the hero component.
- Configure an equivalent Urdu title in the same local hero-content object.
- Keep the existing two-line/accent treatment and approved hero layout.
- Continue using `/images/demo/dentalRoom.avif`.
- Keep the booking action linked to `/[locale]/book`.
- Generate the call action from the clinic phone configuration and use a normalized `tel:` URL.

## Homepage Navigation

There is no Home navigation item. Desktop and mobile navigation use the following homepage anchors in this order:

1. About → `#about`
2. Services → `#services`
3. The Dentist → `#dentist`
4. Reviews → `#reviews`
5. Contact → `#contact`

Emitted URLs include the localized homepage path, such as `/en#about` and `/ur#about`.

- English desktop labels are exactly `About`, `Services`, `The Dentist`, `Reviews`, and `Contact`.
- Urdu uses natural localized equivalents stored locally.
- Desktop keeps the language switcher visible in its normal header position.
- Mobile replaces the desktop navigation with an accessible hamburger button and disclosure menu containing all five links plus the language switcher.
- The hamburger exposes `aria-expanded` and `aria-controls`, has localized open/close labels, closes after navigation, and supports keyboard use and Escape dismissal.
- Navigation anchors work both from the homepage and from localized subpages by pointing to the localized homepage plus fragment.
- Sections receive scroll margins so the sticky header does not cover their headings.
- The existing mobile quick-action bar may remain as an approved utility element. Its Call, WhatsApp, Book, and Directions actions stay functional and localized; it does not replace the hamburger menu.

## Internal Link Policy

- Keep booking links and the booking route active.
- Keep external map, verified directory, social, phone, and WhatsApp links active.
- Remove or suppress homepage links to dentist profiles, service detail pages, service directory pages, and other non-booking internal pages.
- Service cards may remain informational and may retain an existing direct booking action, but must not navigate to a separate service-detail page.
- Footer quick links use the same homepage anchors and do not list Dentists as a directory destination.

## Phone and WhatsApp Behavior

- Derive phone URLs from `clinicConfig` and strip display formatting for valid `tel:` values.
- Apply `tel:` links to all homepage phone numbers and call icons, including mobile actions, hero, contact, urgent help, and header contact surfaces.
- Derive WhatsApp URLs from the configured E.164 number using `https://wa.me/<digits>`.
- Preserve prefilled messages by URL-encoding their text.
- External WhatsApp links open safely with `target="_blank"` and `rel="noopener noreferrer"` where a new tab is used.
- Validate both direct WhatsApp buttons and the floating WhatsApp chat launcher on mobile and desktop.

## Responsive and Interaction Corrections

Review the full English and Urdu homepage from a mobile-first baseline.

- Support narrow mobile widths without horizontal document overflow.
- Correct wrapping, gaps, padding, image aspect behavior, RTL alignment, and text containment without changing approved component designs.
- Ensure the sticky header, open hamburger menu, floating WhatsApp control, and mobile quick-action bar do not hide content or overlap each other.
- Add sufficient bottom clearance for the mobile quick-action bar and safe-area inset.
- Keep tap targets at least 44 CSS pixels where practical and preserve visible keyboard focus.
- Remove hover translation, scale, or positional icon movement from homepage buttons, links styled as buttons, header branding, footer actions, and homepage carousel controls. Hover feedback may change color, border, or shadow while the element remains spatially stable.
- Motion used solely to open or close the mobile menu or WhatsApp panel may remain, subject to reduced-motion preferences.

## Accessibility

- Use semantic header, navigation, main, section, and footer landmarks.
- Associate section headings and labels where applicable.
- Preserve the skip link and ensure it remains keyboard visible.
- Provide useful alternative text for meaningful clinic and dentist images; keep decorative imagery empty or hidden from assistive technology.
- Maintain readable color contrast, visible focus rings, keyboard operation, logical focus order, and correct Urdu `lang`/`dir` behavior.
- Avoid nested interactive elements and prevent hidden mobile-menu controls from remaining focusable.

## SEO and Production Configuration

The authoritative production origin is `https://shahbazdental.com` (the user-facing root may be written as `https://shahbazdental.com/`; metadata uses normalized absolute URLs).

- Configure `metadataBase` with the production origin.
- Generate locale-specific canonical URLs for `/en` and `/ur` and reciprocal `hreflang` alternates, including an `x-default` entry.
- Improve localized titles and descriptions naturally with the clinic's real location: Circular Road near Ahle Hadees Masjid, Samundri, District Faisalabad, Punjab 37300, Pakistan.
- Use natural phrases such as dental clinic, dentist, dental doctor, dental treatment, and dental problems without keyword stuffing.
- Add appropriate Open Graph and Twitter metadata using a local demo image.
- Add static `robots.ts` and `sitemap.ts` outputs that reference `https://shahbazdental.com`, list both localized homepage URLs, and point crawlers to `https://shahbazdental.com/sitemap.xml`.
- The sitemap response must be valid XML at `/sitemap.xml`, expose absolute canonical URLs for `/en` and `/ur`, include language alternates where supported by Next.js metadata routes, and omit admin, API, booking-confirmation, dentist-profile, and service-detail URLs.
- The robots response must allow public crawling, disallow `/admin` and `/api`, and advertise the absolute sitemap URL so it can be submitted to Google Search Console.
- Keep admin pages excluded from indexing. Non-promoted internal pages may remain routable; only accurate, production-ready URLs should be included in the sitemap.
- Set the production `APP_URL` example/default and deployment configuration to the live domain without exposing secrets.
- Add structured data for the clinic only if all values come from verified local clinic configuration.

## Production Booking Readiness

The homepage is static-content-driven, but the application must not be configured as a static export because booking requires server-rendered pages and API routes.

- Preserve the dynamic localized booking page and the `/api/v1/availability` and `/api/v1/appointments` handlers.
- Keep the existing same-origin booking requests. Configure `APP_URL=https://shahbazdental.com` in production so origin validation accepts requests submitted from the live domain.
- Keep the Netlify Next.js runtime deployment path; do not add `output: "export"` or another setting that removes server functions.
- Document and validate the required production variables: `APP_URL`, `MONGODB_URI`, `MONGODB_DATABASE`, and a `SESSION_SECRET` of at least 32 characters. Provider credentials remain optional unless their provider is enabled.
- Ensure the production MongoDB deployment permits connections from the hosting runtime and contains the dentist and schedule records required by the existing booking page. Static homepage doctor content does not replace booking database records.
- Keep booking URLs localized and same-origin, including direct homepage CTAs and service-prefill query strings.
- Production verification must load `/en/book` and `/ur/book`, confirm the availability endpoint reaches the configured database, and verify appointment submission behavior against a controlled production-like test slot without leaving unwanted live appointments.
- If production credentials or seeded schedules are unavailable during implementation, report that external prerequisite explicitly; code, build, origin validation, and automated integration behavior must still be verified locally.

## Validation Strategy

Automated component and integration tests will cover:

- The homepage does not import or call doctor/testimonial repositories.
- The featured dentist renders from local content and uses `/images/demo/featureDoctor.avif`.
- The hero emits the exact English title and local Urdu title.
- Desktop navigation contains the five approved links, excludes Home, and targets the correct localized homepage fragments.
- The mobile hamburger exposes accessible state, contains the same links and language switcher, and closes correctly.
- Homepage booking links still target the existing localized booking route.
- Phone and WhatsApp URLs are normalized correctly.
- Metadata, canonical alternates, robots, and sitemap use `https://shahbazdental.com`.
- Production configuration retains the server runtime, uses the live `APP_URL`, and leaves booking page/API routes operational.
- Homepage controls do not include hover translation or scale utilities.

Fresh lint, type-check, unit-test, production-build, and relevant Playwright checks will run before completion. Browser validation will cover at least narrow mobile, standard mobile, tablet, and desktop viewports in both English and Urdu, checking overflow, sticky navigation offsets, menu behavior, action-link destinations, and content visibility.

## Success Criteria

- Both localized homepages render their complete content when MongoDB and external media services are unavailable.
- The existing Featured Dentist card displays correctly with the local AVIF image and no redesign.
- The exact approved navigation scrolls to visible homepage sections.
- Booking remains functional and unchanged outside homepage-link preservation.
- Phone and WhatsApp actions open the correct native/external targets.
- No homepage element creates unintended horizontal overflow or unstable hover movement.
- Production metadata and crawler files consistently use `https://shahbazdental.com` and the verified Samundri address.
- The deployed application retains the server-side booking architecture and documents every environment/database prerequisite needed for live booking.
- All required verification commands finish successfully, or any pre-existing unrelated failures are reported precisely.
