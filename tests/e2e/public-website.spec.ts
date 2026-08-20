import { expect, test } from "@playwright/test";

const englishPages = [
  ["/en", "A clearer path to a healthier smile"],
  ["/en/services", "Dental care, explained simply"],
  ["/en/dentists", "A future home for verified dentist profiles"],
  ["/en/book", "Book an appointment"],
] as const;

const urduPages = [
  ["/ur", "صحت مند مسکراہٹ کی طرف ایک واضح راستہ"],
  ["/ur/services", "دانتوں کی نگہداشت، آسان وضاحت کے ساتھ"],
  ["/ur/dentists", "تصدیق شدہ ڈینٹسٹ پروفائلز کے لیے مستقبل کی جگہ"],
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

test("the English demonstration booking completes without a real appointment claim", async ({
  page,
}) => {
  await page.goto("/en/book?service=consultation&dentist=no-preference");

  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Tuesday · Demo date").click();
  await page.getByLabel("10:00 AM").click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Full name").fill("Ali Khan");
  await page.getByLabel("Mobile number").fill("0300 0000000");
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByRole("checkbox", { name: /I understand this is a demonstration/ })
    .check();
  await page.getByRole("button", { name: "Complete demo booking" }).click();

  await expect(
    page.getByRole("heading", { name: "The demonstration is complete" }),
  ).toBeVisible();
  await expect(page.getByText("No appointment was created")).toBeVisible();
});

test("the Urdu demonstration booking completes in RTL", async ({ page }) => {
  await page.goto("/ur/book?service=consultation&dentist=no-preference");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  await page.getByRole("button", { name: "جاری رکھیں" }).click();
  await page.getByRole("button", { name: "جاری رکھیں" }).click();
  await page.getByLabel("منگل · نمونہ تاریخ").click();
  await page.getByLabel("صبح 10:00").click();
  await page.getByRole("button", { name: "جاری رکھیں" }).click();
  await page.getByLabel("پورا نام").fill("علی خان");
  await page.getByLabel("موبائل نمبر").fill("0300 0000000");
  await page.getByRole("button", { name: "جاری رکھیں" }).click();
  await page.getByRole("checkbox", { name: /میں سمجھتا\/سمجھتی ہوں/ }).check();
  await page.getByRole("button", { name: "نمونہ بکنگ مکمل کریں" }).click();

  await expect(
    page.getByRole("heading", { name: "مظاہرہ مکمل ہوگیا" }),
  ).toBeVisible();
});
