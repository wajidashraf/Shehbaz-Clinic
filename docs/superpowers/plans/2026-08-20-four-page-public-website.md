# Four-Page Public Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a modern, light, bilingual, mobile-first Home, Services, Dentists, and interactive Book Appointment experience using safe demonstration content and local temporary images.

**Architecture:** Next.js Server Components render public pages from typed bilingual demonstration records. Small Client Components own only mobile navigation and browser-only booking state. Existing locale routing, shared layout, and Tailwind CSS remain the foundation; no API route or database write participates in the booking demonstration.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, next-intl, next/image, Vitest, Testing Library, Playwright.

## Global Constraints

- Include only Home, Services, Dentists, and Book Appointment routes in site navigation.
- Keep English as the default locale and support Urdu with full RTL behavior.
- Use a light theme with WCAG 2.2 Level AA contrast for primary text and controls.
- Use local synthetic images and label sample dentist records as demonstration profiles.
- Do not expose unverified contact information, qualifications, prices, opening hours, or clinic claims.
- The booking flow must not write to MongoDB or call email, SMS, or other providers.
- The site must remain usable without horizontal scrolling at 320 CSS pixels.

---

### Task 1: Typed demonstration content

**Files:**
- Create: `src/content/demo-content.ts`
- Create: `tests/unit/content/demo-content.test.ts`

**Interfaces:**
- Produces: `LocalizedText`, `DemoService`, `DemoDentist`, `demoServices`, `demoDentists`, `getLocalizedText()`, `findDemoService()`, and `findDemoDentist()`.
- Consumes: `Locale` from `src/i18n/config.ts`.

- [ ] **Step 1: Write the failing content-contract test**

```ts
import { describe, expect, it } from "vitest";
import {
  demoDentists,
  demoServices,
  findDemoDentist,
  findDemoService,
  getLocalizedText,
} from "@/content/demo-content";

describe("demonstration content", () => {
  it("provides stable bilingual services and dentists", () => {
    expect(demoServices.length).toBeGreaterThanOrEqual(6);
    expect(demoDentists.length).toBeGreaterThanOrEqual(3);
    expect(getLocalizedText(demoServices[0].name, "ur")).not.toBe("");
    expect(findDemoService(demoServices[0].id)?.id).toBe(demoServices[0].id);
    expect(findDemoDentist("unknown")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run `npm test -- tests/unit/content/demo-content.test.ts` and confirm module resolution fails**
- [ ] **Step 3: Implement immutable bilingual records and allow-list lookup helpers**
- [ ] **Step 4: Re-run the focused test and confirm it passes**
- [ ] **Step 5: Commit with `git commit -m "feat: add bilingual demonstration content"`**

### Task 2: Light design system and responsive site shell

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/mobile-navigation.tsx`
- Modify: `src/components/layout/site-footer.tsx`
- Modify: `src/components/ui/button-link.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/messages/en.json`
- Modify: `src/messages/ur.json`
- Modify: `tests/unit/components/site-header.test.tsx`

**Interfaces:**
- Produces: a header containing only Home, Services, Dentists, locale switch, and Book Appointment; an accessible mobile disclosure menu; light-theme CSS tokens and shared section utilities.
- Consumes: locale-aware labels supplied by the layout.

- [ ] **Step 1: Replace the header test with failing assertions for the approved routes and mobile menu**

```tsx
expect(screen.getByRole("link", { name: "Dentists" })).toHaveAttribute(
  "href",
  "/en/dentists",
);
expect(screen.queryByRole("link", { name: /login/i })).not.toBeInTheDocument();
expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
```

- [ ] **Step 2: Run the header test and confirm the missing Dentists/menu behavior fails**
- [ ] **Step 3: Implement the approved desktop navigation, client-side mobile menu, simplified footer, and locale labels**
- [ ] **Step 4: Refine light-theme tokens, focus treatment, spacing, card surfaces, safe-area behavior, and reduced motion in `globals.css`**
- [ ] **Step 5: Re-run the header tests, lint, and TypeScript checks**
- [ ] **Step 6: Commit with `git commit -m "feat: refine responsive public shell"`**

### Task 3: Shared cards and three content pages

**Files:**
- Create: `src/components/content/demo-notice.tsx`
- Create: `src/components/content/service-card.tsx`
- Create: `src/components/content/dentist-card.tsx`
- Create: `src/components/ui/section-heading.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Create: `src/app/[locale]/services/page.tsx`
- Create: `src/app/[locale]/dentists/page.tsx`
- Create: `public/images/demo/clinic-hero.webp`
- Create: `public/images/demo/care-room.webp`
- Create: `public/images/demo/dentist-1.webp`
- Create: `public/images/demo/dentist-2.webp`
- Create: `public/images/demo/dentist-3.webp`
- Create: `tests/unit/components/public-cards.test.tsx`

**Interfaces:**
- Produces: reusable localized `ServiceCard`, `DentistCard`, `DemoNotice`, and `SectionHeading` components.
- Consumes: Task 1 records and `Locale`.

- [ ] **Step 1: Write failing card tests**

```tsx
render(<DentistCard dentist={demoDentists[0]} locale="en" />);
expect(screen.getByText("Demonstration profile")).toBeVisible();
expect(screen.getByRole("link", { name: /book with/i })).toHaveAttribute(
  "href",
  `/en/book?dentist=${demoDentists[0].id}`,
);
```

- [ ] **Step 2: Run the focused tests and confirm missing components fail**
- [ ] **Step 3: Generate restrained synthetic dental imagery, store optimized local WebP assets, and add accurate localized alt text**
- [ ] **Step 4: Implement shared cards and notices with semantic markup and `next/image`**
- [ ] **Step 5: Build the image-led Home page, categorized Services page, and demonstration Dentists directory**
- [ ] **Step 6: Re-run focused tests, lint, TypeScript checks, and production build**
- [ ] **Step 7: Commit with `git commit -m "feat: build public clinic discovery pages"`**

### Task 4: Interactive booking demonstration

**Files:**
- Create: `src/modules/booking/demo-booking.ts`
- Create: `src/components/booking/booking-wizard.tsx`
- Create: `src/app/[locale]/book/page.tsx`
- Create: `tests/unit/booking/demo-booking.test.ts`
- Create: `tests/unit/components/booking-wizard.test.tsx`

**Interfaces:**
- Produces: `BookingDraft`, `BookingStep`, `createBookingDraft()`, `validateBookingStep()`, `resolveBookingPrefill()`, and `BookingWizard`.
- Consumes: allow-listed service and dentist records from Task 1 and `service`/`dentist` search parameters.

- [ ] **Step 1: Write failing domain tests for safe preselection and step validation**

```ts
expect(resolveBookingPrefill({ service: demoServices[0].id }).serviceId).toBe(
  demoServices[0].id,
);
expect(resolveBookingPrefill({ dentist: "unknown" }).dentistId).toBe("");
expect(validateBookingStep("service", createBookingDraft())).toEqual({
  serviceId: "Choose a service to continue.",
});
```

- [ ] **Step 2: Run the domain test and confirm the booking module is missing**
- [ ] **Step 3: Implement pure initial-state, allow-list, and localized validation helpers**
- [ ] **Step 4: Re-run domain tests and confirm they pass**
- [ ] **Step 5: Write a failing component test that completes the six visible steps and expects a non-delivery confirmation**
- [ ] **Step 6: Implement the keyboard-accessible wizard with visible progress, inline errors, back/continue controls, and browser-only state**
- [ ] **Step 7: Re-run booking tests, then the complete unit suite**
- [ ] **Step 8: Commit with `git commit -m "feat: add appointment booking demonstration"`**

### Task 5: Responsive browser coverage and final polish

**Files:**
- Modify: `tests/e2e/foundation.spec.ts`
- Create: `tests/e2e/public-website.spec.ts`
- Modify: `src/app/[locale]/not-found.tsx` if excluded-route links remain
- Modify: public components only where a failing browser test demonstrates a defect

**Interfaces:**
- Consumes: all completed pages and interactions.
- Produces: repeatable route, RTL, responsive, keyboard, booking, and secret-exposure checks.

- [ ] **Step 1: Add failing Playwright cases for all four routes in both locales, approved navigation only, 320-pixel overflow, and English/Urdu booking completion**

```ts
test("the public pages fit a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/en");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
```

- [ ] **Step 2: Run the new browser file and confirm the unimplemented expectations fail**
- [ ] **Step 3: Fix only demonstrated responsive, focus, content, or RTL defects**
- [ ] **Step 4: Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build`, and `npm run test:e2e`**
- [ ] **Step 5: Inspect representative desktop, 320-pixel English, and 320-pixel Urdu screenshots for clipping, contrast, hierarchy, and image treatment**
- [ ] **Step 6: Commit with `git commit -m "test: verify responsive public website"`**
