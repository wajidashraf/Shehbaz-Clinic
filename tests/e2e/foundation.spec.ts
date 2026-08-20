import { expect, test } from "@playwright/test";

test("the default route resolves to the English clinic page", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByText("Shahbaz Dental Clinic").first()).toBeVisible();
});

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

test("public HTML does not expose server configuration", async ({ page }) => {
  await page.goto("/en");
  const html = await page.content();

  expect(html).not.toContain("mongodb+srv://");
  expect(html).not.toContain("CLOUDINARY_API_SECRET");
  expect(html).not.toContain("BREVO_API_KEY");
  expect(html).not.toContain("xkeysib-");
});
