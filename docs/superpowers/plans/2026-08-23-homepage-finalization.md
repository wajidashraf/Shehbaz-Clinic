# Shahbaz Dental Clinic Homepage Finalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finalize the approved bilingual homepage with local display content, anchored desktop/mobile navigation, the repaired Featured Dentist card, production SEO for `https://shahbazdental.com`, and an unchanged server-backed booking flow.

**Architecture:** The localized homepage becomes a prerenderable Server Component that consumes only local message files and TypeScript content objects. Interactive header disclosure and WhatsApp behavior remain small Client Components, while booking keeps its existing dynamic page, MongoDB repositories, and same-origin API routes. Shared production URL helpers feed metadata, robots, sitemap, structured data, and deployment tests so the domain cannot drift between files.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 6, next-intl 4, Tailwind CSS 4, Vitest/Testing Library, Playwright, MongoDB/Mongoose, Netlify Next.js runtime.

## Global Constraints

- Preserve the current homepage section order, visual language, imagery, card treatments, colors, and typography.
- Do not redesign an approved homepage section.
- Homepage display content must not depend on MongoDB, API calls, Cloudinary, or other runtime media services.
- Keep all English and Urdu homepage content in local components, message files, or typed configuration objects.
- Keep booking buttons, `/[locale]/book`, `/api/v1/availability`, and `/api/v1/appointments` operational and server-backed.
- Do not configure `output: "export"`; production booking requires the Next.js server runtime.
- Use the exact production origin `https://shahbazdental.com` and the verified Samundri, District Faisalabad address.
- Use the existing demo assets with exact case-sensitive paths, especially `/images/demo/featureDoctor.avif`.
- Desktop navigation order is About, Services, The Dentist, Reviews, Contact; there is no Home navigation item.
- Mobile hamburger contains the same five anchors plus the language switcher; the approved bottom quick-action bar may remain.
- Homepage dentist/service/detail links stay hidden; localized booking links remain active.
- Remove hover translation, scale, and positional icon movement from homepage controls while keeping stable color, border, and shadow feedback.
- Preserve unrelated dirty-worktree changes and stage only files named by each task.

---

## File Responsibility Map

- `src/content/homepage-content.ts`: typed, bilingual Featured Dentist and homepage-only records.
- `src/app/[locale]/page.tsx`: static homepage composition; no repository access.
- `src/components/layout/HeroSection.tsx`: local bilingual hero title and existing hero presentation.
- `src/components/ui/ClinicHighlights.tsx`, `about-section.tsx`, `patient-trust-section.tsx`, `faq-section.tsx`: component-local bilingual copy and exact local demo image paths.
- `src/components/content/featured-doctor-section.tsx`: existing Featured Dentist card presentation and `#dentist` anchor.
- `src/components/layout/testimonials-section.tsx`: local bilingual review content and `#reviews` anchor.
- `src/components/layout/mobile-menu.tsx`: mobile header disclosure state and keyboard behavior.
- `src/components/layout/site-header.tsx`, `mobile-navigation.tsx`, `site-footer.tsx`: localized homepage anchors and retained booking/contact utilities.
- `src/messages/en.json`, `src/messages/ur.json`, `src/app/[locale]/layout.tsx`: local labels and localized layout wiring.
- `src/config/public-config.ts`, `src/config/seo.ts`: clinic contact data, production origin, canonical helpers, and JSON-LD.
- `src/app/robots.ts`, `src/app/sitemap.ts`: Google crawler endpoints.
- `netlify.toml`, `.env.example`, `README.md`: server-runtime production configuration and booking prerequisites.
- Unit and E2E files under `tests/`: regression coverage and viewport/link verification.

---

### Task 1: Make Homepage Data Independent of Repositories

**Files:**
- Create: `src/content/homepage-content.ts`
- Create: `tests/unit/content/homepage-content.test.ts`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/content/featured-doctor-section.tsx`
- Modify: `tests/unit/components/featured-doctor.test.tsx`

**Interfaces:**
- Produces: `featuredHomepageDentist: DoctorRecord` with `image === "/images/demo/featureDoctor.avif"`.
- Consumes: `demoServices`, component-local/static testimonials, local next-intl messages.
- Produces: `FeaturedDoctorSection({ doctor, locale })` with component-local English/Urdu labels and a localized booking link.

- [ ] **Step 1: Add failing static-content tests**

```ts
// tests/unit/content/homepage-content.test.ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { featuredHomepageDentist } from "@/content/homepage-content";

describe("static homepage content", () => {
  it("uses the case-sensitive local Featured Dentist image", () => {
    expect(featuredHomepageDentist.image).toBe(
      "/images/demo/featureDoctor.avif",
    );
    expect(featuredHomepageDentist.name.en).toBeTruthy();
    expect(featuredHomepageDentist.name.ur).toBeTruthy();
  });

  it("does not import runtime doctor or testimonial repositories", () => {
    const source = readFileSync("src/app/[locale]/page.tsx", "utf8");
    expect(source).not.toContain("doctor.repository");
    expect(source).not.toContain("testimonial.repository");
    expect(source).toContain('export const dynamic = "force-static"');
  });
});
```

Update `featured-doctor.test.tsx` so the one-image test asserts the real image and booking behavior:

```tsx
render(
  <FeaturedDoctorSection
    doctor={featuredHomepageDentist}
    locale="en"
  />,
);
expect(screen.getByAltText(featuredHomepageDentist.imageAlt.en)).toHaveAttribute(
  "src",
  expect.stringContaining("featureDoctor.avif"),
);
expect(screen.getByTestId("featured-doctor-section")).toHaveAttribute(
  "id",
  "dentist",
);
expect(screen.getByRole("link", { name: /book/i })).toHaveAttribute(
  "href",
  "/en/book",
);
expect(screen.queryByRole("link", { name: /profile/i })).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the tests and confirm the intended failures**

Run: `npm test -- tests/unit/content/homepage-content.test.ts tests/unit/components/featured-doctor.test.tsx`

Expected: FAIL because `homepage-content.ts` does not exist, the page imports both repositories, the card uses the wrong image path, and it still exposes profile-oriented behavior.

- [ ] **Step 3: Add the typed local Featured Dentist record**

```ts
// src/content/homepage-content.ts
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

export const featuredHomepageDentist = {
  id: "manzoor-shahbaz",
  name: { en: "Dr. Manzoor Shahbaz", ur: "ڈاکٹر منظور شہباز" },
  title: { en: "Dental Surgeon", ur: "ڈینٹل سرجن" },
  qualification: { en: "BDS", ur: "بی ڈی ایس" },
  education: {
    en: "Professional dental education and clinical training in comprehensive patient care.",
    ur: "جامع مریضوں کی نگہداشت کے لیے پیشہ ورانہ ڈینٹل تعلیم اور طبی تربیت۔",
  },
  registration: { en: "PMDC 24988", ur: "پی ایم ڈی سی 24988" },
  biography: {
    en: "Providing careful, clearly explained dental treatment for patients in Samundri.",
    ur: "سمندری میں مریضوں کو احتیاط اور واضح رہنمائی کے ساتھ دانتوں کا علاج فراہم کرتے ہیں۔",
  },
  focusAreas: [
    { en: "General dentistry", ur: "عمومی دندان سازی" },
    { en: "Restorative treatment", ur: "دانتوں کی بحالی کا علاج" },
  ],
  languages: { en: "English, Urdu, Punjabi", ur: "انگریزی، اردو، پنجابی" },
  workingDays: { en: "Daily", ur: "روزانہ" },
  image: "/images/demo/featureDoctor.avif",
  imageAlt: {
    en: "Featured dentist at Shahbaz Dental Clinic",
    ur: "شہباز ڈینٹل کلینک کے نمایاں ڈینٹسٹ",
  },
  featuredImages: [],
  isFeatured: true,
  sortOrder: 10,
} satisfies DoctorRecord;
```

- [ ] **Step 4: Remove homepage repository access and repair the card at the source**

In `page.tsx`, replace repository imports and the five-way `Promise.all` with local/static values:

```tsx
import { featuredHomepageDentist } from "@/content/homepage-content";

export const dynamic = "force-static";

const [home] = await Promise.all([getTranslations("Home")]);

<FeaturedDoctorSection
  doctor={featuredHomepageDentist}
  locale={locale}
/>
```

Remove `listDoctors`, `listPublishedTestimonials`, the conditional featured-doctor gate, unused dentist imports/translations, and all commented dentist-directory JSX. In `featured-doctor-section.tsx`, use `doctor.image`, apply `id="dentist"` plus `scroll-mt-28`, and retain only the existing `/[locale]/book` CTA. Replace hardcoded card labels with this component-local copy:

```ts
const featuredDoctorCopy = {
  en: {
    registration: "Registration",
    experience: "Experience",
    years: "Years",
    practicingSince: "Practicing since",
    book: "Book Consultation",
  },
  ur: {
    registration: "رجسٹریشن",
    experience: "تجربہ",
    years: "سال",
    practicingSince: "پریکٹس کا آغاز",
    book: "مشاورت بک کریں",
  },
} as const;
```

- [ ] **Step 5: Run the focused tests**

Run: `npm test -- tests/unit/content/homepage-content.test.ts tests/unit/components/featured-doctor.test.tsx`

Expected: PASS with the local AVIF path, `#dentist`, booking link, and no repository imports.

- [ ] **Step 6: Commit the static homepage data boundary**

```powershell
git add -- src/content/homepage-content.ts 'src/app/[locale]/page.tsx' src/components/content/featured-doctor-section.tsx tests/unit/content/homepage-content.test.ts tests/unit/components/featured-doctor.test.tsx
git commit -m "fix: render homepage dentist from local content"
```

---

### Task 2: Localize Hero and Newly Added Homepage Sections

**Files:**
- Modify: `src/components/layout/HeroSection.tsx`
- Modify: `src/components/ui/ClinicHighlights.tsx`
- Modify: `src/components/ui/about-section.tsx`
- Modify: `src/components/ui/patient-trust-section.tsx`
- Modify: `src/components/ui/faq-section.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `tests/unit/components/hero-section.test.tsx`
- Create: `tests/unit/components/homepage-sections.test.tsx`

**Interfaces:**
- Produces: component-local `Record<Locale, ...>` content selected by the existing `locale` prop.
- Preserves: current DOM hierarchy and visual classes except necessary IDs, exact-case image paths, telephone anchors, and responsive fixes.

- [ ] **Step 1: Write failing bilingual and asset-path tests**

```tsx
// hero-section.test.tsx
render(<HeroSection home={(key) => copy[key] ?? key} locale="en" />);
expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
  "Healthy Teeth. Confident Smiles.",
);
expect(screen.getByRole("link", { name: "Book Appointment" })).toHaveAttribute(
  "href",
  "/en/book",
);
expect(screen.getByRole("link", { name: /call/i })).toHaveAttribute(
  "href",
  "tel:+923443420001",
);
```

```tsx
// tests/unit/components/homepage-sections.test.tsx
const { unmount } = render(<AboutSection locale="ur" />);
expect(screen.getByRole("region", { name: /شہباز ڈینٹل کلینک/ })).toHaveAttribute(
  "id",
  "about",
);
expect(screen.getByRole("link", { name: "+92 344 3420001" })).toHaveAttribute(
  "href",
  "tel:+923443420001",
);
expect(screen.getAllByAltText(/Shahbaz Dental Clinic|شہباز ڈینٹل کلینک/)[0]).toHaveAttribute(
  "src",
  expect.stringContaining("aboutImage1.avif"),
);
unmount();
render(<FaqSection locale="ur" />);
expect(screen.getByText("اکثر پوچھے جانے والے سوالات")).toBeVisible();
```

- [ ] **Step 2: Run the focused tests and verify failures**

Run: `npm test -- tests/unit/components/hero-section.test.tsx tests/unit/components/homepage-sections.test.tsx`

Expected: FAIL because the exact hero title is not component-local, About lacks `#about`, several components only contain English, patient/FAQ components do not accept `locale`, the About asset case is wrong, and its phone number is plain text.

- [ ] **Step 3: Configure the exact bilingual hero title inside the component**

```tsx
const heroTitles = {
  en: { primary: "Healthy Teeth.", accent: "Confident Smiles." },
  ur: { primary: "صحت مند دانت۔", accent: "پُراعتماد مسکراہٹیں۔" },
} as const;

const title = heroTitles[locale];

<h1>
  <span className="block text-[#0b4b85]">{title.primary}</span>
  <span className="block text-[#1f7ed6]">{title.accent}</span>
</h1>
```

Use `clinicConfig.phone` to build the hero `tel:` value instead of embedding the number. Keep `/images/demo/dentalRoom.avif` and the existing booking route.

- [ ] **Step 4: Add local English/Urdu objects without reshaping sections**

Each section selects copy with the same pattern. For Patient Trust, use the complete local object below:

```tsx
const patientTrustCopy = {
  en: {
    heading: "Why Patients Trust Us",
    items: [
      {
        title: "Convenient Location",
        description: "Easily accessible on Circular Road in the heart of Samundri.",
      },
      {
        title: "Daily Availability",
        description: "Open every day from 9:00 AM to 8:00 PM for your convenience.",
      },
      {
        title: "Easy Contact",
        description: "Call, WhatsApp, or request an appointment online effortlessly.",
      },
    ],
  },
  ur: {
    heading: "مریض ہم پر اعتماد کیوں کرتے ہیں",
    items: [
      {
        title: "آسان مقام",
        description: "سمندری کے مرکز میں سرکلر روڈ پر آسانی سے قابل رسائی۔",
      },
      {
        title: "روزانہ دستیابی",
        description: "آپ کی سہولت کے لیے ہر روز صبح 9 بجے سے رات 8 بجے تک کھلا ہے۔",
      },
      {
        title: "آسان رابطہ",
        description: "کال، واٹس ایپ یا آن لائن اپائنٹمنٹ کی درخواست آسانی سے کریں۔",
      },
    ],
  },
} as const;

export function PatientTrustSection({ locale }: { locale: Locale }) {
  const content = patientTrustCopy[locale];
  return (
    <section aria-labelledby="patient-trust-title">
      <h2 id="patient-trust-title">{content.heading}</h2>
      {content.items.map((item) => (
        <article key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </section>
  );
}
```

Apply the same typed `en`/`ur` selection to Clinic Highlights, About, and FAQ. Preserve every current English sentence. Provide Urdu translations for each visible heading, label, paragraph, location line, directions action, FAQ question, and FAQ answer; the Urdu FAQ heading is exactly `اکثر پوچھے جانے والے سوالات`. Add `id="about"` and `scroll-mt-28` to About. Correct every image reference to `/images/demo/aboutImage1.avif`, `/images/demo/aboutImage2.avif`, `/images/demo/aboutImage3.webp`, or `/images/demo/aboutImage4.webp`. Replace the About phone text with:

```tsx
<a dir="ltr" href={`tel:${clinicConfig.phone.replace(/\D/g, "")}`}>
  <bdi>{clinicConfig.phone}</bdi>
</a>
```

Pass `locale` to `PatientTrustSection` and `FaqSection` from `page.tsx`.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- tests/unit/components/hero-section.test.tsx tests/unit/components/homepage-sections.test.tsx`

Expected: PASS in English and Urdu with exact demo image casing and telephone URLs.

- [ ] **Step 6: Commit local bilingual section content**

```powershell
git add -- src/components/layout/HeroSection.tsx src/components/ui/ClinicHighlights.tsx src/components/ui/about-section.tsx src/components/ui/patient-trust-section.tsx src/components/ui/faq-section.tsx 'src/app/[locale]/page.tsx' tests/unit/components/hero-section.test.tsx tests/unit/components/homepage-sections.test.tsx
git commit -m "feat: localize static homepage sections"
```

---

### Task 3: Add Anchored Desktop Navigation and Accessible Mobile Hamburger

**Files:**
- Create: `src/components/layout/mobile-menu.tsx`
- Create: `tests/unit/components/mobile-menu.test.tsx`
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/components/layout/mobile-navigation.tsx`
- Modify: `src/components/layout/locale-switch.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/messages/en.json`
- Modify: `src/messages/ur.json`
- Modify: `tests/unit/components/site-header.test.tsx`

**Interfaces:**
- Produces: `MobileMenu({ labels, locale })`, where labels contain `about`, `services`, `dentist`, `reviews`, `contact`, `mobileNavigation`, `openMenu`, `closeMenu`, and `switchLanguage`.
- Consumes: `LocaleSwitch`, localized homepage root, and the same ordered anchor array as desktop navigation.

- [ ] **Step 1: Replace outdated header expectations with failing approved-navigation tests**

```tsx
const approvedLinks = [
  ["About", "/en#about"],
  ["Services", "/en#services"],
  ["The Dentist", "/en#dentist"],
  ["Reviews", "/en#reviews"],
  ["Contact", "/en#contact"],
] as const;

render(<SiteHeader labels={englishLabels} locale="en" />);
const desktop = screen.getByRole("navigation", { name: "Primary navigation" });
for (const [name, href] of approvedLinks) {
  expect(within(desktop).getByRole("link", { name })).toHaveAttribute("href", href);
}
expect(within(desktop).queryByRole("link", { name: "Home" })).toBeNull();
expect(within(desktop).queryByRole("link", { name: "Dentists" })).toBeNull();
expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
  "aria-expanded",
  "false",
);
```

```tsx
// mobile-menu.test.tsx
const user = userEvent.setup();
render(<MobileMenu labels={englishLabels} locale="en" />);
await user.click(screen.getByRole("button", { name: "Open menu" }));
expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
  "aria-expanded",
  "true",
);
expect(screen.getByRole("link", { name: "The Dentist" })).toHaveAttribute(
  "href",
  "/en#dentist",
);
expect(screen.getByRole("link", { name: "اردو" })).toHaveAttribute("href", "/ur");
await user.keyboard("{Escape}");
expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).toBeNull();
```

- [ ] **Step 2: Run header/menu tests and confirm failures**

Run: `npm test -- tests/unit/components/site-header.test.tsx tests/unit/components/mobile-menu.test.tsx`

Expected: FAIL because the current header exposes Home/Dentists, shows the language switcher on mobile, and has no hamburger disclosure.

- [ ] **Step 3: Add local navigation labels**

Add these English keys under `Navigation`:

```json
{
  "about": "About",
  "dentist": "The Dentist",
  "reviews": "Reviews",
  "call": "Call",
  "whatsapp": "WhatsApp",
  "directions": "Directions"
}
```

Add natural Urdu equivalents:

```json
{
  "about": "ہمارے بارے میں",
  "dentist": "ڈینٹسٹ",
  "reviews": "مریضوں کے تاثرات",
  "call": "کال کریں",
  "whatsapp": "واٹس ایپ",
  "directions": "راستہ دیکھیں"
}
```

Keep existing keys needed by booking and internal pages, but do not render Home or Dentists in homepage navigation.

- [ ] **Step 4: Implement the client-side disclosure menu**

```tsx
"use client";

export function MobileMenu({ labels, locale }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        aria-controls="mobile-site-menu"
        aria-expanded={open}
        aria-label={open ? labels.closeMenu : labels.openMenu}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      {open ? (
        <nav aria-label={labels.mobileNavigation} id="mobile-site-menu">
          {navigationItems(labels, locale).map((item) => (
            <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <LocaleSwitch label={labels.switchLanguage} locale={locale} />
        </nav>
      ) : null}
    </div>
  );
}
```

Use a module-level `navigationItems` function returning exactly the five localized anchors in approved order. Keep `LocaleSwitch` visible in a desktop-only wrapper in `SiteHeader`; render another instance only inside the open mobile menu.

- [ ] **Step 5: Localize and preserve the bottom quick-action bar**

Pass `Navigation.call`, `whatsapp`, `bookShort`, and `directions` from the layout instead of hardcoded English. Keep `tel:`, `wa.me`, localized `/book`, and maps destinations. Add `aria-label` values that match the visible localized labels.

- [ ] **Step 6: Run header/menu tests**

Run: `npm test -- tests/unit/components/site-header.test.tsx tests/unit/components/mobile-menu.test.tsx tests/unit/layout/locale-switch.test.ts`

Expected: PASS with the five desktop anchors, mobile disclosure semantics, Escape closure, language switching, and quick actions.

- [ ] **Step 7: Commit navigation behavior**

```powershell
git add -- src/components/layout/mobile-menu.tsx src/components/layout/site-header.tsx src/components/layout/mobile-navigation.tsx src/components/layout/locale-switch.tsx 'src/app/[locale]/layout.tsx' src/messages/en.json src/messages/ur.json tests/unit/components/mobile-menu.test.tsx tests/unit/components/site-header.test.tsx
git commit -m "feat: add anchored responsive homepage navigation"
```

---

### Task 4: Make Reviews Static/Bilingual and Align Homepage/Footer Links

**Files:**
- Modify: `src/components/layout/testimonials-section.tsx`
- Modify: `src/components/content/services-carousel.tsx`
- Modify: `src/components/layout/site-footer.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/messages/en.json`
- Modify: `src/messages/ur.json`
- Modify: `tests/unit/components/testimonials-section.test.tsx`
- Modify: `tests/unit/components/services-carousel.test.tsx`
- Modify: `tests/unit/components/site-footer.test.tsx`

**Interfaces:**
- Produces: `TestimonialsSection({ locale }: { locale: Locale })` with local bilingual review/config objects and `id="reviews"`.
- Preserves: external Google Maps review action and localized booking route elsewhere.

- [ ] **Step 1: Write failing review, service, and footer link tests**

```tsx
render(<TestimonialsSection locale="ur" />);
expect(screen.getByTestId("testimonials-section")).toHaveAttribute("id", "reviews");
expect(screen.getByText("مریضوں کے تاثرات")).toBeVisible();
expect(screen.getByRole("link", { name: /گوگل/ })).toHaveAttribute(
  "href",
  clinicConfig.mapsUrl,
);
```

```tsx
render(<SiteFooter labels={labels} locale="en" />);
for (const [name, href] of approvedLinks) {
  expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
}
expect(screen.queryByRole("link", { name: "Home" })).toBeNull();
expect(screen.queryByRole("link", { name: "Dentists" })).toBeNull();
expect(screen.getByRole("link", { name: "Book" })).toHaveAttribute(
  "href",
  "/en/book",
);
```

For Services Carousel, assert that service tiles contain no links to `/services/` while keeping visible localized names.

- [ ] **Step 2: Run the focused tests and verify failures**

Run: `npm test -- tests/unit/components/testimonials-section.test.tsx tests/unit/components/services-carousel.test.tsx tests/unit/components/site-footer.test.tsx`

Expected: FAIL because Reviews is English-only and uses `#testimonials`, footer promotes Home/Dentists, and outdated test contracts still expect repository-supplied reviews.

- [ ] **Step 3: Convert Reviews to typed local bilingual content**

```tsx
type HomepageReview = {
  name: string;
  rating: number;
  review: string;
};

type ReviewSectionContent = {
  heading: string;
  summary: string;
  action: string;
  reviews: readonly HomepageReview[];
};

const reviewContent = {
  en: {
    heading: "Patient Reviews",
    summary: "Based on approximately 44 reviews on Google Maps.",
    action: "View All Reviews",
    reviews: [
      {
        name: "Rana Ali",
        rating: 4,
        review: "The doctor is experienced, the clinic is neat and clean, and the staff were helpful.",
      },
      {
        name: "Masood Ali",
        rating: 5,
        review: "I travelled from New York City for scaling and was pleased with the treatment, disposable instruments, and clean clinic.",
      },
    ],
  },
  ur: {
    heading: "مریضوں کے تاثرات",
    summary: "گوگل میپس پر تقریباً 44 جائزوں کی بنیاد پر۔",
    action: "گوگل پر تمام جائزے دیکھیں",
    reviews: [
      {
        name: "رانا علی",
        rating: 4,
        review: "ڈاکٹر تجربہ کار ہیں، کلینک صاف ستھرا ہے اور عملہ مددگار تھا۔",
      },
      {
        name: "مسعود علی",
        rating: 5,
        review: "میں اسکیلنگ کے لیے نیویارک سے آیا اور علاج، ڈسپوزایبل آلات اور کلینک کی صفائی سے مطمئن رہا۔",
      },
    ],
  },
} satisfies Record<Locale, ReviewSectionContent>;
```

Keep the current card layout, make the section `id="reviews"`, add `scroll-mt-28`, use `locale` to select content, and remove unused server testimonial props/imports from `page.tsx`.

- [ ] **Step 4: Align service/footer navigation with homepage-only policy**

Keep Services Carousel tiles informational (no detail-page links). Change footer quick links to the five approved anchors and keep a separate `/[locale]/book` CTA. Add footer label keys for About, The Dentist, Reviews, and Contact in both message files and wire them through the locale layout.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- tests/unit/components/testimonials-section.test.tsx tests/unit/components/services-carousel.test.tsx tests/unit/components/site-footer.test.tsx`

Expected: PASS with local bilingual reviews, `#reviews`, homepage-only footer anchors, and intact booking/external review actions.

- [ ] **Step 6: Commit static reviews and link policy**

```powershell
git add -- src/components/layout/testimonials-section.tsx src/components/content/services-carousel.tsx src/components/layout/site-footer.tsx 'src/app/[locale]/layout.tsx' src/messages/en.json src/messages/ur.json tests/unit/components/testimonials-section.test.tsx tests/unit/components/services-carousel.test.tsx tests/unit/components/site-footer.test.tsx
git commit -m "fix: keep homepage navigation on approved sections"
```

---

### Task 5: Remove Positional Hover Motion and Fix Mobile Layout Collisions

**Files:**
- Modify: `src/components/ui/button-link.tsx`
- Modify: `src/components/layout/locale-switch.tsx`
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/components/layout/site-footer.tsx`
- Modify: `src/components/layout/whatsapp-chat.tsx`
- Modify: `src/components/ui/about-section.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/unit/components/button-link.test.tsx`
- Create: `tests/unit/components/homepage-motion.test.ts`

**Interfaces:**
- Produces: stable hover behavior for homepage controls and sufficient mobile bottom clearance.
- Preserves: color/border/shadow hover feedback and disclosure/panel state transitions.

- [ ] **Step 1: Add failing stable-motion tests**

```tsx
render(<ButtonLink href="/en/book" icon={<span>+</span>}>Book</ButtonLink>);
const link = screen.getByRole("link", { name: "Book" });
expect(link.className).not.toMatch(/hover:-?translate|hover:scale|active:scale/);
expect(link.firstElementChild?.className ?? "").not.toMatch(
  /group-hover:-?translate/,
);
```

```ts
// homepage-motion.test.ts
const files = [
  "src/components/layout/site-header.tsx",
  "src/components/layout/site-footer.tsx",
  "src/components/layout/locale-switch.tsx",
  "src/components/ui/about-section.tsx",
];
for (const file of files) {
  expect(readFileSync(file, "utf8")).not.toMatch(
    /(?:group-)?hover:(?:-?translate|scale)/,
  );
}
```

- [ ] **Step 2: Run motion tests and confirm failures**

Run: `npm test -- tests/unit/components/button-link.test.tsx tests/unit/components/homepage-motion.test.ts`

Expected: FAIL on current ButtonLink, language switcher, header logo, footer links/buttons, About images, and WhatsApp launcher positional hover utilities.

- [ ] **Step 3: Remove positional motion without flattening hover feedback**

In `button-link.tsx`, remove `transform` from transition lists, `hover:-translate-y-*`, `active:scale-*`, icon hover offsets, and moving shine pseudo-elements. Retain fixed icons and background/border/color/shadow hover styles. Apply the same rule to the named homepage components and WhatsApp buttons, while retaining open/close panel transforms and `motion-reduce` support.

- [ ] **Step 4: Add mobile safe-area clearance and overflow containment**

Add a homepage/layout-level mobile content inset instead of hiding content behind the quick-action bar:

```css
@media (max-width: 767px) {
  body {
    padding-bottom: calc(4.75rem + env(safe-area-inset-bottom));
  }
}

html,
body {
  max-width: 100%;
  overflow-x: clip;
}
```

Position the WhatsApp launcher above the quick-action bar on mobile and restore its existing desktop position at `md`. Ensure header/menu widths use `min-w-0`, wrapping, logical inset utilities, and no negative horizontal offsets at narrow widths.

- [ ] **Step 5: Run motion tests and component regression tests**

Run: `npm test -- tests/unit/components/button-link.test.tsx tests/unit/components/homepage-motion.test.ts tests/unit/components/site-header.test.tsx`

Expected: PASS with spatially stable controls and preserved focus/hover styles.

- [ ] **Step 6: Commit interaction and mobile containment fixes**

```powershell
git add -- src/components/ui/button-link.tsx src/components/layout/locale-switch.tsx src/components/layout/site-header.tsx src/components/layout/site-footer.tsx src/components/layout/whatsapp-chat.tsx src/components/ui/about-section.tsx src/app/globals.css tests/unit/components/button-link.test.tsx tests/unit/components/homepage-motion.test.ts
git commit -m "fix: stabilize homepage interactions and mobile layout"
```

---

### Task 6: Centralize Phone/WhatsApp URLs and Verify Every Homepage Action

**Files:**
- Modify: `src/config/public-config.ts`
- Modify: `src/components/layout/HeroSection.tsx`
- Modify: `src/components/layout/mobile-navigation.tsx`
- Modify: `src/components/layout/whatsapp-chat.tsx`
- Modify: `src/components/content/clinic-contact-section.tsx`
- Modify: `src/components/content/urgent-help-section.tsx`
- Modify: `src/components/ui/headerTopBar.tsx`
- Modify: `src/components/ui/about-section.tsx`
- Create: `tests/unit/config/public-config.test.ts`
- Modify: relevant component tests under `tests/unit/components/`

**Interfaces:**
- Produces: `clinicConfig.phoneHref`, `clinicConfig.landlineHref`, and `clinicConfig.whatsapp.href(message?: string)` or equivalent pure helpers.
- Consumes: one verified mobile number, landline, WhatsApp E.164 number, and maps URL.

- [ ] **Step 1: Write failing URL normalization tests**

```ts
expect(clinicConfig.phoneHref).toBe("tel:+923443420001");
expect(clinicConfig.landlineHref).toBe("tel:0413420001");
expect(clinicConfig.whatsapp.href()).toBe("https://wa.me/923443420001");
expect(clinicConfig.whatsapp.href("Book & ask")).toBe(
  "https://wa.me/923443420001?text=Book%20%26%20ask",
);
```

Update component tests to assert all rendered phone/call controls use one of the two `tel:` values and all WhatsApp controls start with `https://wa.me/923443420001`.

- [ ] **Step 2: Run URL/component tests and verify failures**

Run: `npm test -- tests/unit/config/public-config.test.ts tests/unit/components/urgent-help-section.test.tsx tests/unit/components/site-header.test.tsx`

Expected: FAIL because URL normalization is duplicated and no shared configured href helpers exist.

- [ ] **Step 3: Add pure configured URL helpers and replace duplicates**

```ts
const digits = (value: string) => value.replace(/\D/g, "");
const phoneHref = (value: string) =>
  `tel:${value.trim().startsWith("+") ? "+" : ""}${digits(value)}`;
const whatsappHref = (number: string, message?: string) => {
  const base = `https://wa.me/${digits(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
```

Expose immutable configured values/helpers from `clinicConfig` and consume them in Hero, header top bar, mobile actions, About, Contact, Urgent Help, and WhatsApp Chat. Preserve `target="_blank" rel="noopener noreferrer"` for new-tab WhatsApp actions.

- [ ] **Step 4: Run focused URL and component tests**

Run: `npm test -- tests/unit/config/public-config.test.ts tests/unit/components/urgent-help-section.test.tsx tests/unit/components/site-header.test.tsx`

Expected: PASS with consistent callable phone and WhatsApp URLs.

- [ ] **Step 5: Commit contact-link normalization**

```powershell
git add -- src/config/public-config.ts src/components/layout/HeroSection.tsx src/components/layout/mobile-navigation.tsx src/components/layout/whatsapp-chat.tsx src/components/content/clinic-contact-section.tsx src/components/content/urgent-help-section.tsx src/components/ui/headerTopBar.tsx src/components/ui/about-section.tsx tests/unit/config/public-config.test.ts tests/unit/components/urgent-help-section.test.tsx tests/unit/components/site-header.test.tsx
git commit -m "fix: normalize homepage phone and WhatsApp actions"
```

---

### Task 7: Add Production Metadata, Robots, Sitemap, and Clinic Structured Data

**Files:**
- Create: `src/config/seo.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `tests/unit/config/seo.test.ts`
- Create: `tests/unit/app/metadata-routes.test.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/messages/en.json`
- Modify: `src/messages/ur.json`

**Interfaces:**
- Produces: `SITE_URL`, `localizedHomeUrl(locale)`, `homeLanguageAlternates`, `clinicJsonLd(locale)`, `robots()`, and `sitemap()`.
- Consumes: `clinicConfig`, `Locale`, local Metadata translations, `/images/demo/dentalRoom.avif`.

- [ ] **Step 1: Write failing SEO helper and metadata-route tests**

```ts
expect(SITE_URL.origin).toBe("https://shahbazdental.com");
expect(localizedHomeUrl("en")).toBe("https://shahbazdental.com/en");
expect(homeLanguageAlternates).toEqual({
  en: "https://shahbazdental.com/en",
  ur: "https://shahbazdental.com/ur",
  "x-default": "https://shahbazdental.com/en",
});
```

```ts
const robotResult = robots();
expect(robotResult.sitemap).toBe("https://shahbazdental.com/sitemap.xml");
expect(robotResult.rules).toMatchObject({
  userAgent: "*",
  allow: "/",
  disallow: ["/admin", "/api"],
});

const entries = sitemap();
expect(entries.map((entry) => entry.url)).toEqual([
  "https://shahbazdental.com/en",
  "https://shahbazdental.com/ur",
]);
expect(entries.every((entry) => entry.alternates?.languages?.["x-default"])).toBe(true);
```

- [ ] **Step 2: Run SEO tests and confirm failures**

Run: `npm test -- tests/unit/config/seo.test.ts tests/unit/app/metadata-routes.test.ts`

Expected: FAIL because the SEO helper and metadata route files do not exist.

- [ ] **Step 3: Add a single production SEO configuration**

```ts
export const SITE_URL = new URL("https://shahbazdental.com");
export const localizedHomeUrl = (locale: Locale) =>
  new URL(`/${locale}`, SITE_URL).toString().replace(/\/$/, "");
export const homeLanguageAlternates = {
  en: localizedHomeUrl("en"),
  ur: localizedHomeUrl("ur"),
  "x-default": localizedHomeUrl("en"),
} as const;
```

Build `clinicJsonLd(locale)` from `clinicConfig.name`, phone, address, coordinates, opening hours, and `localizedHomeUrl(locale)` only. Do not add unverified prices, services, reviews, or staff claims.

- [ ] **Step 4: Implement Next.js 16 metadata routes**

```ts
// src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    host: SITE_URL.origin,
  };
}
```

```ts
// src/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: localizedHomeUrl(locale),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages: homeLanguageAlternates },
  }));
}
```

- [ ] **Step 5: Expand localized metadata and render JSON-LD**

Return `metadataBase`, canonical, language alternates, localized keyword-rich title/description, Open Graph, Twitter card, local AVIF image, and index/follow robots from `[locale]/layout.tsx`. Use natural Samundri/Faisalabad phrases in `Metadata` messages. Render the local structured data with escaped JSON:

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(clinicJsonLd(locale)).replace(/</g, "\\u003c"),
  }}
  type="application/ld+json"
/>
```

- [ ] **Step 6: Run SEO tests**

Run: `npm test -- tests/unit/config/seo.test.ts tests/unit/app/metadata-routes.test.ts`

Expected: PASS with the exact production origin, two localized sitemap entries, alternates, crawler rules, and verified clinic structured data.

- [ ] **Step 7: Commit production SEO**

```powershell
git add -- src/config/seo.ts src/app/robots.ts src/app/sitemap.ts 'src/app/[locale]/layout.tsx' src/messages/en.json src/messages/ur.json tests/unit/config/seo.test.ts tests/unit/app/metadata-routes.test.ts
git commit -m "feat: add production metadata and sitemap"
```

---

### Task 8: Preserve Booking on the Production Server Runtime

**Files:**
- Modify: `netlify.toml`
- Modify: `.env.example`
- Modify: `README.md`
- Modify: `src/modules/auth/admin-api.server.ts`
- Modify: `tests/unit/auth/admin-origin.test.ts`
- Modify: `tests/unit/config/env.test.ts`
- Modify: `tests/unit/config/next-config.test.ts`
- Modify: `tests/e2e/public-website.spec.ts`

**Interfaces:**
- Consumes: `APP_URL=https://shahbazdental.com`, forwarded Netlify host/protocol headers, MongoDB environment values.
- Preserves: relative same-origin fetches from Booking Wizard to availability and appointment APIs.

- [ ] **Step 1: Add failing production booking configuration tests**

```ts
expect(getServerEnv({
  ...baseEnvironment,
  NODE_ENV: "production",
  APP_URL: "https://shahbazdental.com",
}).APP_URL).toBe("https://shahbazdental.com");
```

```ts
expect(nextConfig.output).not.toBe("export");
```

Add an origin test where the runtime URL is internal, the browser origin is `https://shahbazdental.com`, and `process.env.APP_URL` is the production domain; expect acceptance. Keep the malicious-origin rejection test.

- [ ] **Step 2: Run booking configuration tests and verify the new origin case fails**

Run: `npm test -- tests/unit/auth/admin-origin.test.ts tests/unit/config/env.test.ts tests/unit/config/next-config.test.ts tests/unit/components/booking-wizard.test.tsx`

Expected: the new production-origin test FAILS when forwarded headers are absent; existing booking behavior tests continue to pass.

- [ ] **Step 3: Add the configured production origin to same-origin validation**

```ts
const configuredOrigin = process.env.APP_URL;
if (configuredOrigin) {
  try {
    allowedOrigins.add(new URL(configuredOrigin).origin);
  } catch {
    return false;
  }
}
```

Keep request URL and trusted forwarded origin support. Do not allow wildcard origins or arbitrary host headers.

- [ ] **Step 4: Configure and document Netlify production requirements**

Add the non-secret live origin to `netlify.toml`:

```toml
[build.environment]
  APP_URL = "https://shahbazdental.com"
```

Keep `.env.example` usable locally, but add an adjacent comment stating the production value exactly. Add a README “Production deployment” section listing `APP_URL`, `MONGODB_URI`, `MONGODB_DATABASE`, `SESSION_SECRET`, MongoDB network access, `npm run seed`, dentist schedules, `/api/v1/health`, `/en/book`, and `/ur/book`. State explicitly that `output: "export"` must not be enabled.

- [ ] **Step 5: Retain and update mocked production booking E2E coverage**

Update the English and Urdu booking E2E tests only where homepage/header copy changes affect locators. Keep route interception for availability and appointment POST so the test verifies browser form wiring without creating live records. Add assertions that both requests use relative same-origin `/api/v1/...` URLs.

- [ ] **Step 6: Run production-booking tests**

Run: `npm test -- tests/unit/auth/admin-origin.test.ts tests/unit/config/env.test.ts tests/unit/config/next-config.test.ts tests/unit/components/booking-wizard.test.tsx`

Expected: PASS with live-domain origin acceptance, malicious-origin rejection, server runtime retained, and booking wizard API behavior unchanged.

- [ ] **Step 7: Commit production booking readiness**

```powershell
git add -- netlify.toml .env.example README.md src/modules/auth/admin-api.server.ts tests/unit/auth/admin-origin.test.ts tests/unit/config/env.test.ts tests/unit/config/next-config.test.ts tests/e2e/public-website.spec.ts
git commit -m "fix: preserve booking on production runtime"
```

---

### Task 9: Mobile-First E2E, Accessibility Review, and Full Verification

**Files:**
- Modify: `tests/e2e/public-website.spec.ts`
- Modify: `tests/e2e/foundation.spec.ts`
- Modify: only homepage files implicated by a reproduced E2E/accessibility failure

**Interfaces:**
- Verifies: approved anchors, menu, static Featured Dentist, both locales, callable contact links, booking links, crawler endpoints, viewport overflow, and production build route classification.

- [ ] **Step 1: Add failing homepage E2E assertions before final responsive fixes**

```ts
for (const locale of ["en", "ur"] as const) {
  test(`${locale} homepage anchors and static feature card`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator("#about")).toBeVisible();
    await expect(page.locator("#services")).toBeVisible();
    await expect(page.locator("#dentist img")).toHaveAttribute(
      "src",
      /featureDoctor\.avif/,
    );
    await expect(page.locator("#reviews")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
  });
}
```

Add a 320px hamburger test that opens the menu, checks the five links and language switcher, clicks `The Dentist`, verifies the URL fragment and visible feature section, and confirms no horizontal overflow. Add 375px, 768px, and 1440px overflow checks for `/en` and `/ur`. Add link assertions for `tel:+923443420001`, `tel:0413420001`, `https://wa.me/923443420001`, localized `/book`, `/robots.txt`, and `/sitemap.xml`.

- [ ] **Step 2: Run the relevant E2E file and capture exact failures**

Run: `npm run build`

Expected: build completes before Playwright; route output shows localized homepages prerendered while booking and API routes remain server-capable.

Run: `npx playwright test tests/e2e/public-website.spec.ts --project=chromium`

Expected: new tests reveal any remaining overflow, sticky-offset, hamburger, or locator issues before fixes.

- [ ] **Step 3: Apply only evidence-backed responsive/accessibility fixes**

For each failure, record the viewport, locale, element, and computed overflow source. Adjust only the implicated breakpoint/gap/inset/scroll-margin/focus behavior. Do not restructure or restyle approved sections. Verify the specific failing test after each change.

- [ ] **Step 4: Run the Web Interface Guidelines review**

Fetch the current Web Interface Guidelines required by the `web-design-guidelines` skill and audit the homepage component files. Fix in-scope accessibility findings such as missing labels, focus indication, invalid nested controls, undersized tap targets, incorrect directionality, or focusable hidden content. Record any out-of-scope finding without redesigning the homepage.

- [ ] **Step 5: Run the complete verification suite fresh**

Run each command separately and inspect its exit code and full output:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test tests/e2e/public-website.spec.ts --project=chromium
```

Expected: all commands exit `0`; the build exposes `/robots.txt` and `/sitemap.xml`, prerenders `/en` and `/ur`, and retains dynamic booking/API behavior.

- [ ] **Step 6: Inspect the final diff and requirement checklist**

Run:

```powershell
git diff --check
git status --short
git diff --stat 078b2b4..HEAD
```

Confirm every design success criterion has direct code/test evidence, no unrelated dirty file was staged, and the pre-existing user assets remain present.

- [ ] **Step 7: Commit final E2E/accessibility corrections**

```powershell
git add -- tests/e2e/public-website.spec.ts tests/e2e/foundation.spec.ts src/app/globals.css
git commit -m "test: verify production-ready clinic homepage"
```

- [ ] **Step 8: Report deployment-only prerequisites accurately**

Report the verified commands and the exact live prerequisites that cannot be proven without production credentials: Netlify environment variables, MongoDB network access, seeded dentist records/schedules, and a controlled post-deploy booking smoke test. Do not claim that a live appointment was created unless that request was actually executed and its record was safely handled.
