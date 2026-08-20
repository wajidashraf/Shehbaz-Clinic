# Development credentials

Keep all credentials in `.env.local`. Never paste them into chat, screenshots, documentation, or Git commits. Restart the development server after changing the file.

## MongoDB Atlas

1. Create or select an Atlas cluster.
2. Under **Database Access**, create an application database user with read/write access to the development database.
3. Under **Network Access**, allow only the current development IP address.
4. Select **Connect > Drivers** and copy the `mongodb+srv://...` connection string.
5. Replace the password placeholder locally. Percent-encode special characters in the username or password.

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DATABASE=shahbaz_clinic_dev
```

The URI must remain private. If an SRV lookup fails before authentication, check the computer or network DNS configuration and try another trusted network.

## Application session secret

Generate a different secret for each environment:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Copy the generated value into:

```env
SESSION_SECRET=
```

## Cloudinary

1. Open the Cloudinary console.
2. Open **Settings > API Keys**.
3. Copy the cloud name, API key, and API secret into the matching variables.
4. Use the existing folder name exactly as it appears in the Media Library. A `/development` child path is recommended.

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=shahbaz-dental-clinic/development
```

Do not create an unsigned upload preset. Uploads are authenticated on the server, and `CLOUDINARY_API_SECRET` must never be exposed to browser code.

## Brevo email without a domain

1. Open **Settings > Senders, Domains & IPs > Senders**.
2. Add an email address you can access and verify it using Brevo's six-digit code.
3. Open **Settings > SMTP & API > API Keys & MCP**.
4. Generate a standard API key named `Shahbaz Clinic Development`. Do not enable the MCP-key option.
5. Copy the key immediately; Brevo displays it only once.

```env
EMAIL_PROVIDER=brevo
BREVO_API_KEY=xkeysib-...
EMAIL_FROM_NAME="Shahbaz Dental Clinic"
EMAIL_FROM_ADDRESS=the-exact-verified-sender@example.com
```

When the clinic obtains a domain, authenticate it in Brevo, verify the new sender, and update `EMAIL_FROM_ADDRESS`. Application code does not need to change.

## SMS during development

Real SMS delivery is not permanently free. Keep SMS simulated until a production provider is selected:

```env
SMS_PROVIDER=development
```

## Redis and background jobs

MongoDB stores permanent clinic records. Redis supports temporary queues, retries, rate limits, and scheduled appointment reminders.

For Upstash, create a free Redis database and copy its standard TLS/TCP connection string, not the REST URL or REST token:

```env
REDIS_URL=rediss://default:password@host:6379
```

The `rediss://` prefix enables TLS. Redis can remain blank until background workers are enabled.

## Verify the configuration

```powershell
npm run seed
npm run dev
```

Then request `http://localhost:3000/api/v1/health`. A ready response reports MongoDB as `up` and Cloudinary as `configured` without exposing credentials.
