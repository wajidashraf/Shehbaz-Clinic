# Shahbaz Dental Clinic Application Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a locally runnable, bilingual Next.js foundation with validated server-only configuration, MongoDB Atlas connectivity, single-branch seed data, and a tested Cloudinary media adapter.

**Architecture:** Scaffold a Next.js 16+ App Router project at the repository root and keep integration code behind focused server-only modules. MongoDB application documents use Mongoose, while Cloudinary is accessed only through an adapter that returns application-owned metadata. Locale routes render an accessible shell for English and Urdu; later plans add authentication, booking, dashboards, queues, and production deployment.

**Tech Stack:** Node.js 24, npm, Next.js 16+, React, TypeScript, Tailwind CSS, next-intl, MongoDB Atlas, Mongoose, Cloudinary Node SDK, Zod, Vitest, Testing Library, and Playwright.

## Global Constraints

- The clinic has exactly one active branch: Shahbaz Dental Clinic, Samundri, District Faisalabad, Punjab 37300, Pakistan.
- Do not render or request a branch selector.
- Store dates in UTC and render clinic times in `Asia/Karachi`.
- Use only synthetic development data.
- Do not invent the street address, telephone, WhatsApp, email, opening hours, dentist credentials, prices, policy wording, or emergency details.
- Keep `.env.local` ignored and never commit or print real MongoDB or Cloudinary credentials.
- Never prefix MongoDB or Cloudinary secrets with `NEXT_PUBLIC_`.
- Cloudinary is limited to approved public clinic, service, logo, and dentist imagery; never upload patient or clinical content.
- All Cloudinary uploads are authenticated server-side; do not create or use an unsigned upload preset.
- MongoDB Atlas must provide replica-set transactions for later booking work.
- English is the fallback language; Urdu uses complete RTL document direction.
- Target WCAG 2.2 Level AA.

---

## File structure

The plan creates or owns these files:

```text
.
├── .env.example                         # Safe variable names and non-secret defaults
├── .env.local                           # Ignored, blank credential slots for the user
├── .gitignore                           # Excludes all local environment files
├── package.json                         # Runtime, quality, test, and seed scripts
├── next.config.ts                       # Security headers and Cloudinary image host
├── vitest.config.ts                     # Unit/component test environment
├── vitest.setup.ts                      # DOM matchers and test cleanup
├── playwright.config.ts                 # Browser test configuration
├── docs/setup/credentials.md            # MongoDB and Cloudinary credential guide
├── scripts/seed.ts                      # Idempotent synthetic single-branch seed
├── src/app/[locale]/layout.tsx           # Locale metadata and document direction
├── src/app/[locale]/page.tsx             # Foundation landing page
├── src/app/[locale]/not-found.tsx        # Localized invalid-locale state
├── src/app/api/v1/health/route.ts        # Sanitized process/database readiness response
├── src/components/layout/site-header.tsx # Accessible clinic navigation and locale switch
├── src/components/layout/site-footer.tsx # Placeholder-aware clinic details
├── src/components/ui/button-link.tsx     # Shared accessible action styling
├── src/config/env.ts                     # Server-only, validated environment contract
├── src/config/public-config.ts           # Non-secret clinic constants
├── src/i18n/config.ts                     # Supported locale types and direction
├── src/i18n/request.ts                    # next-intl server request config
├── src/i18n/routing.ts                    # Locale-aware routing helpers
├── src/messages/en.json                   # English foundation copy
├── src/messages/ur.json                   # Urdu foundation copy
├── src/infrastructure/database/mongoose.ts# Cached Mongoose connection
├── src/infrastructure/database/health.ts  # Database health abstraction
├── src/modules/clinic/clinic.model.ts      # Clinic persistence schema
├── src/modules/clinic/branch.model.ts      # Branch persistence schema
├── src/modules/clinic/clinic.repository.ts # Single-branch reads and upserts
├── src/modules/media/media.types.ts        # Provider-neutral media contracts
├── src/modules/media/media.validation.ts   # MIME, byte-size, and purpose validation
├── src/modules/media/cloudinary.server.ts  # Server-only Cloudinary client configuration
├── src/modules/media/cloudinary.adapter.ts # Signed upload/delete adapter
├── src/modules/media/media-asset.model.ts  # MongoDB asset metadata
├── src/modules/media/media.repository.ts   # Metadata persistence
├── tests/unit/...                         # Pure and mocked integration tests
└── tests/e2e/foundation.spec.ts            # English/Urdu shell smoke tests
```

Files in later modules may consume these interfaces but must not bypass them.

---

### Task 1: Scaffold the Next.js application and quality commands

**Files:**

- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `tests/unit/scaffold.test.ts`

**Interfaces:**

- Consumes: Node.js `>=24 <25` and npm `>=11` installed locally.
- Produces: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run test:e2e` commands used by every later task.

- [ ] **Step 1: Scaffold the project manually with current locked packages**

The workspace folder is named `Clinic`, which is not a valid lowercase npm package name. Initialize the package explicitly rather than asking `create-next-app` to derive a package name from the folder.

Run from the repository root as separate commands:

```powershell
npm init -y
npm pkg set name="shahbaz-dental-clinic"
npm pkg set private=true --json
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss eslint eslint-config-next
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

Create `next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

Create `postcss.config.mjs`:

```js
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

Create `eslint.config.mjs`:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([".next/**", "coverage/**", "playwright-report/**"]),
]);
```

Create a temporary `src/app/layout.tsx` and `src/app/page.tsx` so the scaffold can build before locale routing exists:

```tsx
// src/app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// src/app/page.tsx
export default function Page() {
  return <main>Shahbaz Dental Clinic</main>;
}
```

Create `src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
```

Expected: npm records exact versions in `package-lock.json`; `Prompt.md` and `docs/` remain unchanged.

- [ ] **Step 2: Install test and formatting dependencies**

Run:

```powershell
npm install -D vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test prettier prettier-plugin-tailwindcss
```

Expected: `package.json` and `package-lock.json` contain the test dependencies.

- [ ] **Step 3: Add the quality scripts**

Add these scripts to `package.json` without removing the generated scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "engines": {
    "node": ">=24 <25"
  }
}
```

- [ ] **Step 4: Write the initial failing scaffold test**

Create `tests/unit/scaffold.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import packageJson from "../../package.json";

describe("project scaffold", () => {
  it("exposes every required quality command", () => {
    expect(packageJson.scripts).toMatchObject({
      build: "next build",
      lint: "eslint .",
      typecheck: "tsc --noEmit",
      test: "vitest run",
      "test:e2e": "playwright test",
    });
  });
});
```

- [ ] **Step 5: Configure Vitest and run the test**

Create `vitest.config.ts`:

```ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    restoreMocks: true,
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Run:

```powershell
npm test
npm run lint
npm run typecheck
```

Expected: all three commands pass.

- [ ] **Step 6: Commit the scaffold**

```powershell
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs public src/app vitest.config.ts vitest.setup.ts tests/unit/scaffold.test.ts
git commit -m "build: scaffold clinic Next.js application"
```

---

### Task 2: Define and validate the environment contract

**Files:**

- Create: `.env.example`
- Create: `.env.local`
- Modify: `.gitignore`
- Create: `src/config/env.ts`
- Create: `tests/unit/config/env.test.ts`

**Interfaces:**

- Consumes: `zod` and `server-only` packages.
- Produces: `getServerEnv(source?: NodeJS.ProcessEnv): ServerEnv`, `isCloudinaryConfigured(env: ServerEnv): boolean`, and a safe local configuration template.

- [ ] **Step 1: Install runtime validation dependencies**

```powershell
npm install zod server-only
```

- [ ] **Step 2: Write failing environment tests**

Create `tests/unit/config/env.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getServerEnv, isCloudinaryConfigured } from "@/config/env";

const base = {
  NODE_ENV: "test",
  APP_URL: "http://localhost:3000",
  MONGODB_URI: "mongodb+srv://user:password@example.mongodb.net/",
  MONGODB_DATABASE: "shahbaz_clinic_test",
  SESSION_SECRET: "a".repeat(64),
};

describe("server environment", () => {
  it("accepts the required MongoDB and application values", () => {
    expect(getServerEnv(base).MONGODB_DATABASE).toBe("shahbaz_clinic_test");
  });

  it("rejects a partial Cloudinary credential set", () => {
    expect(() =>
      getServerEnv({ ...base, CLOUDINARY_CLOUD_NAME: "clinic" }),
    ).toThrow(/Cloudinary credentials must be provided together/);
  });

  it("reports Cloudinary as configured only when all credentials exist", () => {
    const env = getServerEnv({
      ...base,
      CLOUDINARY_CLOUD_NAME: "clinic",
      CLOUDINARY_API_KEY: "123456789",
      CLOUDINARY_API_SECRET: "secret-value",
    });
    expect(isCloudinaryConfigured(env)).toBe(true);
  });
});
```

- [ ] **Step 3: Verify the tests fail**

```powershell
npm test -- tests/unit/config/env.test.ts
```

Expected: FAIL because `@/config/env` does not exist.

- [ ] **Step 4: Implement the server-only schema**

Create `src/config/env.ts` with `import "server-only"` and this contract:

```ts
import "server-only";
import { z } from "zod";

const optionalCredential = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    APP_URL: z.string().url(),
    MONGODB_URI: z.string().min(1),
    MONGODB_DATABASE: z.string().regex(/^[a-zA-Z0-9_-]+$/),
    SESSION_SECRET: z.string().min(32),
    CLOUDINARY_CLOUD_NAME: optionalCredential,
    CLOUDINARY_API_KEY: optionalCredential,
    CLOUDINARY_API_SECRET: optionalCredential,
    CLOUDINARY_FOLDER: z.string().default("shahbaz-dental-clinic/development"),
    REDIS_URL: optionalCredential,
  })
  .superRefine((value, context) => {
    const credentials = [
      value.CLOUDINARY_CLOUD_NAME,
      value.CLOUDINARY_API_KEY,
      value.CLOUDINARY_API_SECRET,
    ];
    if (credentials.some(Boolean) && !credentials.every(Boolean)) {
      context.addIssue({
        code: "custom",
        message: "Cloudinary credentials must be provided together",
      });
    }
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(
  source: NodeJS.ProcessEnv = process.env,
): ServerEnv {
  return serverEnvSchema.parse(source);
}

export function isCloudinaryConfigured(env: ServerEnv): boolean {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET,
  );
}
```

- [ ] **Step 5: Create safe environment files and verify ignore rules**

Create both `.env.example` and the ignored `.env.local` with these keys; `.env.local` contains no real values yet:

```dotenv
NODE_ENV=development
APP_URL=http://localhost:3000
MONGODB_URI=
MONGODB_DATABASE=shahbaz_clinic_dev
SESSION_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=shahbaz-dental-clinic/development
REDIS_URL=
```

Ensure `.gitignore` contains:

```gitignore
.env*
!.env.example
```

Run:

```powershell
git check-ignore .env.local
git check-ignore .env.example
npm test -- tests/unit/config/env.test.ts
```

Expected: `.env.local` is ignored, `.env.example` is not ignored, and tests pass.

- [ ] **Step 6: Commit the environment contract**

```powershell
git add .env.example .gitignore package.json package-lock.json src/config/env.ts tests/unit/config/env.test.ts
git commit -m "feat: validate server integration settings"
```

---

### Task 3: Add the bilingual accessible application shell

**Files:**

- Create: `src/config/public-config.ts`
- Create: `src/i18n/config.ts`
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/messages/en.json`
- Create: `src/messages/ur.json`
- Create: `src/proxy.ts`
- Delete: `src/app/layout.tsx`
- Delete: `src/app/page.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `src/app/[locale]/not-found.tsx`
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/site-footer.tsx`
- Create: `src/components/ui/button-link.tsx`
- Create: `tests/unit/i18n/config.test.ts`
- Create: `tests/unit/components/site-header.test.tsx`

**Interfaces:**

- Consumes: Next.js App Router and `next-intl`.
- Produces: `Locale = "en" | "ur"`, `isLocale(value): value is Locale`, `getDirection(locale): "ltr" | "rtl"`, and locale-aware navigation used by all screens.

- [ ] **Step 1: Install localization support**

```powershell
npm install next-intl
```

- [ ] **Step 2: Write failing locale tests**

Create `tests/unit/i18n/config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getDirection, isLocale } from "@/i18n/config";

describe("locale configuration", () => {
  it("supports English and Urdu only", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ur")).toBe(true);
    expect(isLocale("pa")).toBe(false);
  });

  it("uses RTL only for Urdu", () => {
    expect(getDirection("en")).toBe("ltr");
    expect(getDirection("ur")).toBe("rtl");
  });
});
```

Create `tests/unit/components/site-header.test.tsx` with a `NextIntlClientProvider` wrapper and assert that English renders a link to `/ur` labelled `اردو`, while Urdu renders a link to `/en` labelled `English`.

- [ ] **Step 3: Run tests to verify failure**

```powershell
npm test -- tests/unit/i18n/config.test.ts tests/unit/components/site-header.test.tsx
```

Expected: FAIL because locale configuration and the header do not exist.

- [ ] **Step 4: Implement the locale contract and non-secret clinic config**

Create `src/i18n/config.ts`:

```ts
export const locales = ["en", "ur"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ur" ? "rtl" : "ltr";
}
```

Create `src/config/public-config.ts`:

```ts
export const clinicConfig = {
  name: "Shahbaz Dental Clinic",
  location: {
    city: "Samundri",
    district: "Faisalabad",
    province: "Punjab",
    postalCode: "37300",
    country: "Pakistan",
  },
  timeZone: "Asia/Karachi",
  currency: "PKR",
  streetAddress: null,
  phone: null,
  email: null,
  mapsUrl: null,
} as const;
```

- [ ] **Step 5: Implement locale routing, messages, and layouts**

Delete the temporary root layout/page from Task 1. Configure `next-intl` request/routing helpers and `src/proxy.ts` so `/` redirects to `/en`, supported locale paths render, and unknown locale segments return not found. Make `src/app/[locale]/layout.tsx` the root layout for locale routes and set `<html lang={locale} dir={getDirection(locale)}>` there.

The dictionaries must include the same keys:

```json
{
  "Navigation": {
    "home": "Home",
    "services": "Services",
    "book": "Book an Appointment",
    "login": "Patient Login",
    "switchLanguage": "اردو"
  },
  "Home": {
    "eyebrow": "Dental care in Samundri",
    "title": "Clear, respectful dental care for every family",
    "description": "Explore services and request an appointment with Shahbaz Dental Clinic.",
    "detailsPending": "Complete contact details and opening hours will be published after clinic verification."
  }
}
```

The Urdu file supplies professionally neutral equivalent copy, retains the clinic's English name until its Urdu spelling is verified, and uses the same JSON keys.

- [ ] **Step 6: Implement and test the accessible shell**

Build the header, footer, skip link, language switch, and primary booking link. Use logical CSS properties, visible focus, semantic landmarks, and at least 44-pixel interactive targets. Do not render unavailable phone, address, or directions actions.

Run:

```powershell
npm test -- tests/unit/i18n/config.test.ts tests/unit/components/site-header.test.tsx
npm run lint
npm run typecheck
```

Expected: tests and checks pass.

- [ ] **Step 7: Commit the bilingual shell**

```powershell
git add src/app src/components src/config/public-config.ts src/i18n src/messages src/proxy.ts tests/unit/i18n tests/unit/components package.json package-lock.json
git commit -m "feat: add bilingual accessible application shell"
```

---

### Task 4: Add MongoDB infrastructure and the single-branch seed

**Files:**

- Create: `src/infrastructure/database/mongoose.ts`
- Create: `src/infrastructure/database/health.ts`
- Create: `src/modules/clinic/clinic.model.ts`
- Create: `src/modules/clinic/branch.model.ts`
- Create: `src/modules/clinic/clinic.repository.ts`
- Create: `scripts/seed.ts`
- Modify: `package.json`
- Create: `tests/unit/database/health.test.ts`
- Create: `tests/unit/clinic/clinic.repository.test.ts`

**Interfaces:**

- Consumes: `getServerEnv()`, Mongoose, and the confirmed clinic configuration.
- Produces: `connectMongo(): Promise<typeof mongoose>`, `checkMongoHealth(): Promise<DatabaseHealth>`, `getActiveBranch(): Promise<BranchRecord>`, and `upsertDevelopmentClinic(): Promise<void>`.

- [ ] **Step 1: Install MongoDB dependencies and seed runner**

```powershell
npm install mongoose mongodb
npm install -D tsx
```

Add to `package.json`:

```json
{
  "scripts": {
    "seed": "tsx scripts/seed.ts"
  }
}
```

- [ ] **Step 2: Write failing connection and repository tests**

The health test injects a fake connector and asserts that it returns only `{ status: "up" | "down" }`, never the URI or raw error. The repository test injects a fake model and asserts that `getActiveBranch()` queries exactly `{ isActive: true }`, rejects multiple active branches, and returns the Samundri branch when exactly one exists.

Use this public health type:

```ts
export type DatabaseHealth = {
  status: "up" | "down";
};
```

- [ ] **Step 3: Run tests to verify failure**

```powershell
npm test -- tests/unit/database/health.test.ts tests/unit/clinic/clinic.repository.test.ts
```

Expected: FAIL because the database modules do not exist.

- [ ] **Step 4: Implement a cached server-only Mongoose connection**

`connectMongo()` must:

- Import `server-only`.
- Obtain `MONGODB_URI` and `MONGODB_DATABASE` only through `getServerEnv()`.
- Cache the connection promise on a typed `globalThis` property during development hot reload.
- Use `serverSelectionTimeoutMS: 5000`.
- Never log the connection string or raw authentication error.
- Clear a rejected cached promise so a later request can retry.

- [ ] **Step 5: Implement clinic and branch models**

The clinic schema stores `name`, `defaultLocale`, `supportedLocales`, `timeZone`, and timestamps. The branch schema stores `clinicId`, `name`, structured locality fields, `timeZone`, `isActive`, and timestamps. Create a partial unique index enforcing one seeded branch key and an index on `isActive`.

The repository interface is:

```ts
export type BranchRecord = {
  id: string;
  clinicId: string;
  name: string;
  city: "Samundri";
  district: "Faisalabad";
  province: "Punjab";
  postalCode: "37300";
  country: "Pakistan";
  timeZone: "Asia/Karachi";
};

export async function getActiveBranch(): Promise<BranchRecord>;
export async function upsertDevelopmentClinic(): Promise<void>;
```

- [ ] **Step 6: Implement and run the idempotent synthetic seed**

`scripts/seed.ts` loads `.env.local` through `@next/env`, connects, upserts the clinic and one active Samundri branch using stable seed keys, prints only record counts, and closes the connection in `finally`.

Run after the user adds MongoDB credentials:

```powershell
npm run seed
npm run seed
```

Expected: both runs succeed and the second run does not create duplicates.

- [ ] **Step 7: Run unit checks and commit**

```powershell
npm test -- tests/unit/database/health.test.ts tests/unit/clinic/clinic.repository.test.ts
npm run lint
npm run typecheck
git add package.json package-lock.json scripts src/infrastructure/database src/modules/clinic tests/unit/database tests/unit/clinic
git commit -m "feat: add MongoDB clinic foundation"
```

---

### Task 5: Add the Cloudinary public-media adapter

**Files:**

- Create: `src/modules/media/media.types.ts`
- Create: `src/modules/media/media.validation.ts`
- Create: `src/modules/media/cloudinary.server.ts`
- Create: `src/modules/media/cloudinary.adapter.ts`
- Create: `src/modules/media/media-asset.model.ts`
- Create: `src/modules/media/media.repository.ts`
- Create: `tests/unit/media/media.validation.test.ts`
- Create: `tests/unit/media/cloudinary.adapter.test.ts`

**Interfaces:**

- Consumes: `getServerEnv()`, `connectMongo()`, and the Cloudinary Node SDK.
- Produces: `MediaStorage` with `uploadPublicImage(input): Promise<StoredMedia>` and `deletePublicImage(publicId): Promise<void>`; `saveMediaAsset(asset): Promise<MediaAssetRecord>`.

- [ ] **Step 1: Install the Cloudinary SDK and image-signature detector**

```powershell
npm install cloudinary file-type
```

- [ ] **Step 2: Define the provider-neutral contract**

Create `src/modules/media/media.types.ts`:

```ts
export const mediaPurposes = [
  "clinic-logo",
  "clinic-photo",
  "service-image",
  "dentist-portrait",
] as const;

export type MediaPurpose = (typeof mediaPurposes)[number];

export type UploadPublicImageInput = {
  bytes: Uint8Array;
  declaredMimeType: string;
  purpose: MediaPurpose;
  altText: { en: string; ur?: string };
  actorUserId: string;
};

export type StoredMedia = {
  assetId: string;
  publicId: string;
  version: number;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resourceType: "image";
};

export interface MediaStorage {
  uploadPublicImage(input: UploadPublicImageInput): Promise<StoredMedia>;
  deletePublicImage(publicId: string): Promise<void>;
}
```

- [ ] **Step 3: Write failing media validation tests**

Test these exact rules:

- Only JPEG, PNG, and WebP are accepted.
- The detected byte signature must match the declared MIME type.
- Empty content is rejected.
- Files larger than 5 MiB are rejected.
- English alt text is required and limited to 240 characters.
- A purpose outside `mediaPurposes` is rejected.

Run:

```powershell
npm test -- tests/unit/media/media.validation.test.ts
```

Expected: FAIL because validation does not exist.

- [ ] **Step 4: Implement validation before provider access**

Create `validatePublicImage(input): Promise<ValidatedPublicImage>` using Zod for metadata and `fileTypeFromBuffer()` for the actual bytes. Return an immutable validated object; do not retain base64 strings or log bytes.

- [ ] **Step 5: Write failing Cloudinary adapter tests**

Inject a narrow fake Cloudinary client and assert:

- Upload uses resource type `image`, the configured clinic folder, a random public ID, and `overwrite: false`.
- Upload rejects when Cloudinary credentials are not configured.
- The adapter maps only known response fields into `StoredMedia` and ignores unknown response fields.
- Delete uses `invalidate: true` and resource type `image`.
- Errors are converted to `MediaStorageUnavailableError` without credentials or provider payloads.

- [ ] **Step 6: Implement the server-only Cloudinary client and adapter**

`cloudinary.server.ts` imports `server-only`, configures `cloud_name`, `api_key`, `api_secret`, and `secure: true`, and returns a narrow injected client. `cloudinary.adapter.ts` converts validated bytes to a stream or data URI entirely on the server, performs an authenticated upload, and maps the result to `StoredMedia`.

Do not export the configured Cloudinary SDK object to client-reachable modules.

- [ ] **Step 7: Store provider metadata in MongoDB**

The `mediaAssets` schema stores:

```ts
type MediaAssetRecord = StoredMedia & {
  purpose: MediaPurpose;
  altText: { en: string; ur?: string };
  actorUserId: string;
  createdAt: Date;
  updatedAt: Date;
};
```

Add unique indexes on `assetId` and `publicId`. Do not store the original file bytes in MongoDB.

- [ ] **Step 8: Run checks and commit**

```powershell
npm test -- tests/unit/media
npm run lint
npm run typecheck
git add package.json package-lock.json src/modules/media tests/unit/media
git commit -m "feat: add secure Cloudinary media adapter"
```

---

### Task 6: Add sanitized health reporting and setup documentation

**Files:**

- Create: `src/app/api/v1/health/route.ts`
- Create: `tests/unit/api/health.test.ts`
- Create: `docs/setup/credentials.md`
- Modify: `README.md`

**Interfaces:**

- Consumes: `checkMongoHealth()` and `isCloudinaryConfigured()`.
- Produces: `GET /api/v1/health` returning only process status, database readiness, and Cloudinary configuration state.

- [ ] **Step 1: Write the failing health route test**

Create `tests/unit/api/health.test.ts` and inject/mock health dependencies. Assert the JSON shape exactly:

```ts
{
  status: "ok",
  services: {
    mongodb: "up",
    cloudinary: "configured"
  }
}
```

Also assert the serialized response does not contain `mongodb+srv`, `api_secret`, `CLOUDINARY_API_SECRET`, stack traces, hostnames, usernames, or raw error messages.

- [ ] **Step 2: Run the test to verify failure**

```powershell
npm test -- tests/unit/api/health.test.ts
```

Expected: FAIL because the route does not exist.

- [ ] **Step 3: Implement the route**

Return HTTP 200 when MongoDB is up and HTTP 503 when it is down. Cloudinary is `configured` or `not-configured`; missing Cloudinary credentials do not make the public-site foundation unhealthy. Set `Cache-Control: no-store`.

- [ ] **Step 4: Write the credential guide**

`docs/setup/credentials.md` must tell the user:

1. MongoDB Atlas: create/select a cluster, create an application database user, allow only the current development IP, choose Connect > Drivers, and copy the `mongodb+srv://...` string into `MONGODB_URI` after replacing the password placeholder.
2. MongoDB: set `MONGODB_DATABASE=shahbaz_clinic_dev`; do not paste the URI into chat.
3. Cloudinary: open Console Settings > API Keys and copy Cloud name, API key, and API secret into the three matching variables.
4. Cloudinary: do not create an unsigned preset and never expose the API secret to browser code.
5. Generate `SESSION_SECRET` locally with a cryptographically secure command and never share it.
6. Restart `npm run dev` after changing `.env.local`.
7. Run `npm run seed`, then request `/api/v1/health` and confirm MongoDB is `up` and Cloudinary is `configured`.

- [ ] **Step 5: Update README and run checks**

README setup commands:

```powershell
npm install
Copy-Item .env.example .env.local
npm run seed
npm run dev
```

Run:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: all checks pass with test-safe environment values; the build does not expose server secrets.

- [ ] **Step 6: Commit health and setup documentation**

```powershell
git add README.md docs/setup src/app/api/v1/health tests/unit/api
git commit -m "docs: add database and media credential setup"
```

---

### Task 7: Add browser smoke tests and perform foundation verification

**Files:**

- Create: `playwright.config.ts`
- Create: `tests/e2e/foundation.spec.ts`
- Create: `tests/e2e/global-setup.ts`
- Modify: `package.json`

**Interfaces:**

- Consumes: the locale routes and setup from Tasks 1–6.
- Produces: repeatable verification that the foundation is usable in both directions and keeps secret variables server-side.

- [ ] **Step 1: Configure Playwright**

Create a config that builds the production application, starts `next start` on `http://127.0.0.1:3000`, tests Chromium, and captures traces only on first retry. Use an explicit setup/teardown owner for the server process because Playwright's managed web-server process group leaves Next.js child processes open on Windows. A pre-existing local server may be reused outside CI; CI must require a clean port.

- [ ] **Step 2: Write the failing browser tests**

Create `tests/e2e/foundation.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("English foundation is LTR and links to Urdu", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("link", { name: "اردو" })).toHaveAttribute(
    "href",
    "/ur",
  );
});

test("Urdu foundation is RTL and links to English", async ({ page }) => {
  await page.goto("/ur");
  await expect(page.locator("html")).toHaveAttribute("lang", "ur");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("link", { name: "English" })).toHaveAttribute(
    "href",
    "/en",
  );
});

test("browser output does not contain server credentials", async ({ page }) => {
  await page.goto("/en");
  const html = await page.content();
  expect(html).not.toContain("mongodb+srv://");
  expect(html).not.toContain("CLOUDINARY_API_SECRET");
});
```

- [ ] **Step 3: Run the tests and fix only foundation defects**

```powershell
npx playwright install chromium
npm run test:e2e
```

Expected: all three tests pass. If the environment blocks browser installation, record that exact limitation and retain the test for CI; do not weaken assertions.

- [ ] **Step 4: Run the complete verification suite**

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
git status --short
```

Expected: all automated checks pass; `.env.local` is absent from Git status; only `Prompt.md` may remain intentionally untracked.

- [ ] **Step 5: Commit browser verification**

```powershell
git add playwright.config.ts tests/e2e package.json package-lock.json
git commit -m "test: verify bilingual application foundation"
```

## Plan self-review

- Scope is limited to the application foundation and integration boundaries. Authentication, appointments, dashboards, queues, and production deployment remain separate implementation plans.
- Every sensitive environment value is server-only and `.env.local` is ignored.
- Cloudinary stores only approved public imagery; patient and clinical uploads are explicitly prohibited.
- MongoDB is the record store; Cloudinary public IDs and metadata are stored in `mediaAssets`.
- The branch is fixed to Samundri and no branch selector is created.
- Every task ends with focused tests and a commit.
- Later plans can consume the declared database, localization, configuration, and media interfaces without changing their responsibilities.
