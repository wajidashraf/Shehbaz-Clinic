# Dentist Portraits and Browser Identity Design

## Objective

Update Shahbaz Dental Clinic's public website so every named dentist has a distinct, age-appropriate South Asian stock portrait, the browser tab displays a clinic favicon, and the Next.js development indicator is hidden. Preserve the existing light, high-contrast visual system and responsive card layout.

## Portrait Direction

Use five unique, professionally lit stock portraits downloaded from reputable free-stock sources and stored in the repository as optimized WebP files. The visual assignments are:

- Dr. Sobia Ahmad: South Asian woman, approximately 30–35 years old.
- Dr. Amna Rauf: South Asian woman, approximately 30–35 years old.
- Dr. Ahmad: South Asian man, approximately 30–35 years old.
- Dr. Rauf: South Asian man, approximately 30–35 years old.
- Dr. Shahbaz: experienced South Asian man, approximately 60 years old.

Prefer portraits with a clinical or professional setting, natural expressions, neutral clothing or medical attire, and compatible lighting. Crop all images to the existing 4:3 card frame with faces kept clear at mobile and desktop sizes. Do not alter the dentist names, biographies, booking identifiers, or scheduling behavior.

Because these are temporary stock portraits rather than photographs of the named clinicians, record each source page and creator in the private project image README so the assets can be audited and replaced later. Do not add sample or demonstration language to the patient-facing pages.

## Favicon

Add a valid `favicon.ico` at the Next.js application root. Use a compact teal-and-white dental mark that remains recognizable at 16, 32, and 48 pixels. The favicon should fit the clinic's existing teal visual identity and contain no small text.

## Development Indicator

Disable the bottom-left Next.js development indicator through the supported `next.config.ts` setting. This affects only the local development overlay indicator and does not remove error reporting or application UI.

## Accessibility and Performance

Keep localized English and Urdu alternative text for every portrait. Store images locally to avoid runtime dependence on third-party image servers. Optimize dimensions and compression for the existing responsive `next/image` component without introducing a new client-side dependency.

## Verification

Add or update automated assertions that confirm the five dentists reference five distinct local portrait assets and that the Next.js development indicator is disabled. Verify the favicon is a valid ICO file, run formatting, type checking, linting, unit tests, and a production build, then visually check the English and Urdu dentist pages at desktop and mobile widths.
