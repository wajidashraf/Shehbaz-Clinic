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

## Quality checks

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Never commit `.env.local`, provider secrets, patient data, or uploaded image bytes.
