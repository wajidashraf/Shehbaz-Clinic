import { expect, test } from "@playwright/test";

const englishPages = [
  ["/en", "A clearer path to a healthier smile"],
  ["/en/services", "Dental care, explained simply"],
  ["/en/dentists", "Choose the right dentist for your visit"],
  ["/en/book", "Book an appointment"],
] as const;

const urduPages = [
  ["/ur", "صحت مند مسکراہٹ کی طرف ایک واضح راستہ"],
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
  ).toHaveAttribute("href", "/en/services");
  await expect(
    navigation.getByRole("link", { name: "Dentists" }),
  ).toHaveAttribute("href", "/en/dentists");
  await expect(
    navigation.getByRole("link", { name: "Book an appointment" }),
  ).toHaveAttribute("href", "/en/book");
  await expect(
    navigation.getByRole("link", { name: /login|about|contact/i }),
  ).toHaveCount(0);
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
  await page.route("**/api/v1/availability?**", (route) =>
    route.fulfill({ json: { slots: [{ time: "10:00" }] } }),
  );
  await page.route("**/api/v1/appointments", (route) =>
    route.fulfill({
      status: 201,
      json: { publicReference: "SDC-2026-EN1234", status: "confirmed" },
    }),
  );
  await page.goto("/en/book?service=consultation&dentist=no-preference");

  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Appointment date").fill("2026-09-01");
  await page.getByRole("radio", { name: /10:00/i }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Full name").fill("Ali Khan");
  await page.getByLabel("Mobile number").fill("0300 0000000");
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByRole("checkbox", { name: /I consent to Shahbaz Dental Clinic/ })
    .check();
  await page.getByRole("button", { name: "Confirm appointment" }).click();

  await expect(
    page.getByRole("heading", { name: "Your appointment is confirmed" }),
  ).toBeVisible();
  await expect(page.getByText("SDC-2026-EN1234")).toBeVisible();
});

test("the Urdu guest booking confirms an appointment in RTL", async ({
  page,
}) => {
  await page.route("**/api/v1/availability?**", (route) =>
    route.fulfill({ json: { slots: [{ time: "10:00" }] } }),
  );
  await page.route("**/api/v1/appointments", (route) =>
    route.fulfill({
      status: 201,
      json: { publicReference: "SDC-2026-UR1234", status: "confirmed" },
    }),
  );
  await page.goto("/ur/book?service=consultation&dentist=no-preference");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  await page.getByRole("button", { name: "جاری رکھیں" }).click();
  await page.getByRole("button", { name: "جاری رکھیں" }).click();
  await page.getByLabel("اپائنٹمنٹ کی تاریخ").fill("2026-09-01");
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "جاری رکھیں" }).click();
  await page.getByLabel("پورا نام").fill("علی خان");
  await page.getByLabel("موبائل نمبر").fill("0300 0000000");
  await page.getByRole("button", { name: "جاری رکھیں" }).click();
  await page.getByRole("checkbox", { name: /میں شہباز ڈینٹل کلینک/ }).check();
  await page.getByRole("button", { name: "اپائنٹمنٹ کی تصدیق کریں" }).click();

  await expect(
    page.getByRole("heading", { name: "آپ کی اپائنٹمنٹ کی تصدیق ہوگئی ہے" }),
  ).toBeVisible();
  await expect(page.getByText("SDC-2026-UR1234")).toBeVisible();
});
