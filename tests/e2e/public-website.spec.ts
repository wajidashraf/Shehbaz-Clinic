import { expect, test } from "@playwright/test";

const englishPages = [
  ["/en", "Your trusted partner in dental health"],
  ["/en/services", "Dental care, explained simply"],
  ["/en/dentists", "Choose the right dentist for your visit"],
  ["/en/book", "Book Appointment"],
] as const;

const urduPages = [
  ["/ur", "دانتوں کی صحت کے لیے آپ کا قابلِ اعتماد ساتھی"],
  ["/ur/services", "دانتوں کی نگہداشت، آسان وضاحت کے ساتھ"],
  ["/ur/dentists", "اپنی ملاقات کے لیے مناسب ڈینٹسٹ منتخب کریں"],
  ["/ur/book", "اپائنٹمنٹ بک کریں"],
] as const;

for (const [path, heading] of [...englishPages, ...urduPages]) {
  test(`${path} renders its primary content`, async ({ page }) => {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
  });
}

test("the header exposes only approved destinations", async ({ page }) => {
  await page.goto("/en");
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });

  await expect(navigation.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/en",
  );
  await expect(
    navigation.getByRole("link", { name: "Services" }),
  ).toHaveAttribute("href", "/en#services");
  await expect(
    navigation.getByRole("link", { name: "Dentists" }),
  ).toHaveAttribute("href", "/en#dentists");
  await expect(
    navigation.getByRole("link", { name: "Book Appointment" }),
  ).toHaveAttribute("href", "/en/book");
  await expect(
    navigation.getByRole("link", { name: /login|about|contact/i }),
  ).toHaveCount(0);
});

test("doctor cards open localized profiles without appointment actions", async ({
  page,
}) => {
  await page.goto("/en");
  const dentistSection = page.locator("#dentists");
  const profileLink = dentistSection.getByRole("link", {
    name: "View Profile",
  });
  await expect(profileLink).toHaveAttribute(
    "href",
    /\/en\/dentists\/[a-z0-9-]+$/,
  );
  await expect(dentistSection.getByRole("link", { name: /book/i })).toHaveCount(
    0,
  );
});

test("Dr. Manzoor Shahbaz has an informational profile without booking", async ({
  page,
}) => {
  await page.goto("/en/dentists/manzoor-shahbaz");
  const profile = page.locator("main article").first();
  await expect(
    profile.getByRole("heading", { level: 1, name: "Dr. Manzoor Shahbaz" }),
  ).toBeVisible();
  await expect(profile.getByRole("link", { name: /book/i })).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Meet the rest of our dental team" }),
  ).toBeVisible();
});

test("the English-only admin area redirects guests to its protected sign in", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { level: 1, name: "Admin sign in" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test("language switching preserves an approved nested route", async ({
  page,
}) => {
  await page.goto("/en/services");

  await expect(page.getByRole("link", { name: "اردو" })).toHaveAttribute(
    "href",
    "/ur/services",
  );
});

for (const [path] of [...englishPages, ...urduPages]) {
  test(`${path} has no 320px horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(path);

    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasOverflow).toBe(false);
  });
}

test("the English guest booking confirms an appointment", async ({ page }) => {
  const availabilityRequests: URL[] = [];
  const appointmentRequests: URL[] = [];
  await page.route("**/api/v1/availability?**", (route) => {
    availabilityRequests.push(new URL(route.request().url()));
    return route.fulfill({ json: { slots: [{ time: "10:00" }] } });
  });
  await page.route("**/api/v1/appointments", (route) => {
    appointmentRequests.push(new URL(route.request().url()));
    return route.fulfill({
      status: 201,
      json: { publicReference: "SDC-2026-EN1234", status: "confirmed" },
    });
  });
  await page.goto("/en/book?service=consultation&dentist=no-preference");

  await page.getByLabel("Full name").fill("Ali Khan");
  await page.getByLabel("Mobile number").fill("+92 300 0000000");
  await page.getByLabel("Appointment date").fill("2026-09-01");
  await page.getByLabel("Available time").selectOption("10:00");
  await page
    .getByRole("checkbox", { name: /I consent to Shahbaz Dental Clinic/ })
    .check();
  await page.getByRole("button", { name: "Confirm appointment" }).click();

  await expect(
    page.getByRole("heading", { name: "Your appointment is confirmed" }),
  ).toBeVisible();
  await expect(page.getByText("SDC-2026-EN1234")).toBeVisible();
  expect(availabilityRequests).toHaveLength(1);
  expect(availabilityRequests[0]).toMatchObject({
    origin: new URL(page.url()).origin,
    pathname: "/api/v1/availability",
    search: "?dentistId=no-preference&dateKey=2026-09-01",
  });
  expect(appointmentRequests).toHaveLength(1);
  expect(appointmentRequests[0]).toMatchObject({
    origin: new URL(page.url()).origin,
    pathname: "/api/v1/appointments",
    search: "",
  });
});

test("the Urdu guest booking confirms an appointment in RTL", async ({
  page,
}) => {
  const availabilityRequests: URL[] = [];
  const appointmentRequests: URL[] = [];
  await page.route("**/api/v1/availability?**", (route) => {
    availabilityRequests.push(new URL(route.request().url()));
    return route.fulfill({ json: { slots: [{ time: "10:00" }] } });
  });
  await page.route("**/api/v1/appointments", (route) => {
    appointmentRequests.push(new URL(route.request().url()));
    return route.fulfill({
      status: 201,
      json: { publicReference: "SDC-2026-UR1234", status: "confirmed" },
    });
  });
  await page.goto("/ur/book?service=consultation&dentist=no-preference");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  await page.locator("#booking-name").fill("Ali Khan");
  await page.locator("#booking-mobile").fill("0300 0000000");
  await page.locator("#booking-date").fill("2026-09-01");
  await page.locator("#booking-time").selectOption("10:00");
  await page.locator('input[type="checkbox"]').check();
  await page.locator('button[type="submit"]').click();

  await expect(page.locator("#booking-confirmation-title")).toBeVisible();
  await expect(page.getByText("SDC-2026-UR1234")).toBeVisible();
  expect(availabilityRequests).toHaveLength(1);
  expect(availabilityRequests[0]).toMatchObject({
    origin: new URL(page.url()).origin,
    pathname: "/api/v1/availability",
    search: "?dentistId=no-preference&dateKey=2026-09-01",
  });
  expect(appointmentRequests).toHaveLength(1);
  expect(appointmentRequests[0]).toMatchObject({
    origin: new URL(page.url()).origin,
    pathname: "/api/v1/appointments",
    search: "",
  });
});
