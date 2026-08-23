# Shahbaz Dental Clinic

A modular bilingual clinic application for Shahbaz Dental Clinic in Samundri, District Faisalabad, Punjab, Pakistan. English is the default language and Urdu is available with right-to-left layout support.

## Technology

- Next.js, React, TypeScript, and Tailwind CSS
- MongoDB Atlas for permanent application records
- Cloudinary for public clinic images
- Brevo for transactional email
- Redis for background queues and scheduled reminders
- Development-only simulated SMS until a production provider is selected

## Local setup

Install dependencies and create the private environment file:

```powershell
npm install
Copy-Item .env.example .env.local
```

Complete `.env.local` using [the credential guide](docs/setup/credentials.md), then initialize the single clinic and branch:

```powershell
npm run seed
npm run dev
```

Open `http://localhost:3000`. English is served at `/en` and Urdu at `/ur`. Sanitized service readiness is available at `/api/v1/health`.

## Production deployment on Netlify

This application requires the Next.js server runtime for booking, availability, appointments, and administrator routes. Do not enable `output: "export"` in `next.config.ts`.

Use the Netlify UI, CLI, or API to set production environment variables. Give runtime values both **Builds** and **Functions/Runtime** scopes: Netlify does not make variables declared in `netlify.toml` available to Functions at runtime.

- `APP_URL=https://shahbazdental.com`
- `MONGODB_URI` and `MONGODB_DATABASE`
- `SESSION_SECRET` with at least 32 characters
- Configure MongoDB Atlas network access for Netlify and the deployment operators.
- Set Cloudinary, Brevo email/SMS, Redis, or other provider variables only when that provider is enabled.

Builds use `npm run build:netlify`, which preserves the wrapper that removes an incorrect dashboard `NODE_ENV` override. Netlify publishes `.next` and runs the Next.js runtime; it is not a static-export deployment.

Before serving patients, seed and verify the clinic data:

```powershell
npm run seed
```

Confirm active dentist records and their schedules exist, then check `/api/v1/health`, `/en/book`, and `/ur/book`. Perform one controlled post-deploy booking smoke test with a clearly designated non-patient test record, verify the confirmation and clinic workflow, and remove or label that test data according to clinic policy. Do not create a real production appointment for deployment verification.

## Quality checks

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Never commit `.env.local`, provider secrets, patient data, or uploaded image bytes.
