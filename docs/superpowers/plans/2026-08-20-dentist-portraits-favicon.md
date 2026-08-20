# Dentist Portraits and Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the five named dentists distinct, age-appropriate South Asian stock portraits, add a valid clinic favicon, and hide the Next.js development indicator.

**Architecture:** Keep portrait paths in the existing static clinic-content records and serve optimized WebP files from `public/images/dentists`. Generate a multi-size ICO deterministically from a small SVG source so the binary asset is reproducible. Configure the development indicator through the typed Next.js configuration without changing runtime application components.

**Tech Stack:** Next.js 16.3, React 19, TypeScript 6, `next/image`, Sharp 0.35, Vitest 4, Playwright 1.62.

## Global Constraints

- Preserve the existing light, high-contrast visual system and responsive 4:3 dentist-card layout.
- Use five unique South Asian stock portraits stored locally as optimized WebP files.
- Sobia and Amna are women approximately 30–35; Ahmad and Rauf are men approximately 30–35; Shahbaz is an experienced man approximately 60.
- Do not change dentist names, biographies, booking identifiers, scheduling behavior, or patient-facing copy.
- Do not add sample or demonstration language to patient-facing pages.
- Keep localized English and Urdu alternative text.
- Add no new client-side dependency.
- Preserve unrelated user changes, including generated `next-env.d.ts` changes while the development server is running.

---

### Task 1: Distinct Local Dentist Portraits

**Files:**
- Create: `public/images/dentists/sobia-ahmad.webp`
- Create: `public/images/dentists/amna-rauf.webp`
- Create: `public/images/dentists/ahmad.webp`
- Create: `public/images/dentists/rauf.webp`
- Create: `public/images/dentists/shahbaz.webp`
- Create: `public/images/dentists/README.md`
- Modify: `src/content/demo-content.ts`
- Modify: `tests/unit/content/demo-content.test.ts`

**Interfaces:**
- Consumes: `DemoDentist.image: string` and the existing `DentistCard` use of `next/image`.
- Produces: five unique local paths under `/images/dentists/*.webp`, each resolving to a 1200 × 900 WebP asset.

- [ ] **Step 1: Write the failing content test**

Add this test after the existing dentist-record test in `tests/unit/content/demo-content.test.ts`:

```ts
it("assigns every dentist a distinct local portrait", () => {
  const portraits = demoDentists.map((dentist) => dentist.image);

  expect(portraits).toEqual([
    "/images/dentists/sobia-ahmad.webp",
    "/images/dentists/amna-rauf.webp",
    "/images/dentists/ahmad.webp",
    "/images/dentists/rauf.webp",
    "/images/dentists/shahbaz.webp",
  ]);
  expect(new Set(portraits)).toHaveLength(5);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm test -- tests/unit/content/demo-content.test.ts
```

Expected: FAIL because the current records reuse `/images/demo/dentist-1.webp` and `/images/demo/dentist-2.webp`.

- [ ] **Step 3: Download the five approved Pexels stock photos**

Use each page's `Free download` link, retaining the original only long enough to optimize it:

- Sobia: Dr. Haror's Wellness, `https://www.pexels.com/photo/professional-female-doctor-portrait-in-clinic-32428850/`
- Amna: dr aparna jaswal, `https://www.pexels.com/photo/photo-of-a-doctor-standing-with-her-arms-crossed-5738735/`
- Ahmad: Oys Photography, `https://www.pexels.com/photo/docto-19438558/`
- Rauf: Oys Photography, `https://www.pexels.com/photo/doctor-19438563/`
- Shahbaz: World Sikh Organization of Canada, `https://www.pexels.com/photo/a-man-wearing-a-white-laboratory-gown-and-head-scarf-14797916/`

Inspect every downloaded image before use. Reject any download that is watermarked, does not show the intended age/gender presentation, or cannot keep the face visible in a 4:3 crop.

- [ ] **Step 4: Normalize the portraits with Sharp**

For each source image, use Sharp's cover resize with a face-aware position and WebP quality 82:

```ts
await sharp(sourcePath)
  .resize(1200, 900, { fit: "cover", position: "attention" })
  .webp({ quality: 82 })
  .toFile(destinationPath);
```

Save only the five optimized outputs in `public/images/dentists`; do not commit temporary originals.

- [ ] **Step 5: Update the content mapping**

Change only the five `image` properties in `src/content/demo-content.ts`:

```ts
image: "/images/dentists/sobia-ahmad.webp",
image: "/images/dentists/amna-rauf.webp",
image: "/images/dentists/ahmad.webp",
image: "/images/dentists/rauf.webp",
image: "/images/dentists/shahbaz.webp",
```

Keep each line in its matching dentist record and preserve all localized alternative text.

- [ ] **Step 6: Record the stock sources privately**

Create `public/images/dentists/README.md` with a row for each local filename, photographer/organization, exact Pexels source page, Pexels free-use status, and replacement note. State that these are temporary stock portraits and must be replaced by approved clinic photographs before a final identity-sensitive production launch.

- [ ] **Step 7: Run the focused test and asset check**

Run:

```powershell
npm test -- tests/unit/content/demo-content.test.ts
node --input-type=module -e "import sharp from 'sharp'; const files=['sobia-ahmad','amna-rauf','ahmad','rauf','shahbaz']; for(const name of files){const data=await sharp('public/images/dentists/'+name+'.webp').metadata(); if(data.width!==1200||data.height!==900||data.format!=='webp') throw new Error(name); console.log(name+': 1200x900 webp');}"
```

Expected: the test passes and all five assets report `1200x900 webp`.

- [ ] **Step 8: Commit the portrait task**

```powershell
git add -- tests/unit/content/demo-content.test.ts src/content/demo-content.ts public/images/dentists
git commit -m "feat: add distinct dentist portraits"
```

---

### Task 2: Reproducible Favicon and Hidden Development Indicator

**Files:**
- Create: `scripts/generate-favicon.mjs`
- Create: `src/app/favicon.ico`
- Create: `tests/unit/assets/favicon.test.ts`
- Create: `tests/unit/config/next-config.test.ts`
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: Sharp's `sharp(input).resize().png().toBuffer()` and Next.js `NextConfig.devIndicators`.
- Produces: `src/app/favicon.ico`, a three-image ICO containing 16 × 16, 32 × 32, and 48 × 48 PNG frames; `nextConfig.devIndicators === false`.

- [ ] **Step 1: Write the failing favicon test**

Create `tests/unit/assets/favicon.test.ts`:

```ts
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("clinic favicon", () => {
  it("is a valid multi-size ICO file", async () => {
    const bytes = await readFile(path.resolve("src/app/favicon.ico"));

    expect([...bytes.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    expect(bytes.readUInt16LE(4)).toBe(3);
    expect([6, 22, 38].map((offset) => bytes[offset])).toEqual([16, 32, 48]);
  });
});
```

- [ ] **Step 2: Write the failing Next.js configuration test**

Create `tests/unit/config/next-config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("Next.js development chrome", () => {
  it("disables the bottom-left development indicator", () => {
    expect(nextConfig).toMatchObject({ devIndicators: false });
  });
});
```

- [ ] **Step 3: Run both tests and verify RED**

Run:

```powershell
npm test -- tests/unit/assets/favicon.test.ts tests/unit/config/next-config.test.ts
```

Expected: FAIL because `src/app/favicon.ico` does not exist and `devIndicators` is not configured.

- [ ] **Step 4: Add the deterministic favicon generator**

Create `scripts/generate-favicon.mjs`. It must:

1. Define a 64 × 64 teal rounded-square SVG with a white tooth silhouette and no text.
2. Render 16, 32, and 48 pixel PNG buffers with Sharp.
3. Write the ICO header (`reserved=0`, `type=1`, `count=3`), one 16-byte directory entry per PNG, and the concatenated PNG payloads.
4. Write the result to `src/app/favicon.ico`.

Use this SVG body:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="15" fill="#087f73"/>
  <path fill="#fff" d="M32 13c-5.6-3.7-13.4-3.1-17.2 1.9-4.7 6.1-1.8 14 1.1 20.2 2.8 5.9 3.4 15.8 7.6 15.8 3.4 0 3.1-10.6 8.5-10.6s5.1 10.6 8.5 10.6c4.2 0 4.8-9.9 7.6-15.8 2.9-6.2 5.8-14.1 1.1-20.2C45.4 9.9 37.6 9.3 32 13Z"/>
  <path fill="none" stroke="#087f73" stroke-linecap="round" stroke-width="3" d="M32 14.5c2.4 2.1 5 3.2 8 3.5"/>
</svg>
```

For each ICO directory entry, set width and height to its size, color count and reserved to zero, planes to 1, bit depth to 32, then store the PNG byte length and cumulative payload offset as little-endian unsigned integers.

- [ ] **Step 5: Generate the favicon**

Run:

```powershell
node scripts/generate-favicon.mjs
```

Expected: `src/app/favicon.ico` exists and contains three PNG-backed frames.

- [ ] **Step 6: Disable the development indicator**

Add this top-level property to the typed object in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
```

- [ ] **Step 7: Run focused tests and verify GREEN**

Run:

```powershell
npm test -- tests/unit/assets/favicon.test.ts tests/unit/config/next-config.test.ts
```

Expected: both tests pass.

- [ ] **Step 8: Commit the browser-identity task**

```powershell
git add -- scripts/generate-favicon.mjs src/app/favicon.ico tests/unit/assets/favicon.test.ts tests/unit/config/next-config.test.ts next.config.ts
git commit -m "feat: add clinic favicon and hide dev indicator"
```

---

### Task 3: Responsive and Production Verification

**Files:**
- Modify only if an assertion exposes a requirement gap: `tests/e2e/public-website.spec.ts`
- Preserve: `next-env.d.ts`

**Interfaces:**
- Consumes: the five content records, local WebP files, favicon route, and existing English/Urdu dentist pages.
- Produces: verification evidence for desktop, mobile, bilingual rendering, favicon delivery, and production compilation.

- [ ] **Step 1: Run static and unit verification**

Run each command independently:

```powershell
npm run format:check
npm run typecheck
npm run lint
npm test
```

Expected: every command exits 0 with all unit tests passing.

- [ ] **Step 2: Run production and browser verification**

Run:

```powershell
npm run test:e2e
```

Expected: the production build succeeds and all Playwright tests pass.

- [ ] **Step 3: Inspect the public pages at both responsive widths**

With the local server running, inspect `/en/dentists` and `/ur/dentists` at 1440 × 1000 and 390 × 844. Confirm:

- all five unique portraits load without distortion;
- female/male/age presentation follows the approved mapping;
- faces remain visible in the 4:3 crop;
- English remains left-to-right and Urdu remains right-to-left;
- no horizontal overflow appears at 390 pixels;
- the browser tab requests `/favicon.ico` successfully;
- the bottom-left Next.js indicator is absent in development.

- [ ] **Step 4: Review the final diff and workspace state**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; only intentional implementation files or the known Next.js-generated `next-env.d.ts` change remain.

- [ ] **Step 5: Commit any test-only correction from verification**

If Step 3 required an E2E assertion correction, stage only that test and commit it:

```powershell
git add -- tests/e2e/public-website.spec.ts
git commit -m "test: cover dentist portrait presentation"
```

If no correction was needed, do not create an empty commit.
