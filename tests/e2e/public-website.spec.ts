import { expect, test, type Locator, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

async function visitHomepage(page: Page, locale: "en" | "ur") {
  await page.goto(`/${locale}`, { waitUntil: "domcontentloaded" });
}

async function documentBoundingBox(control: Locator) {
  return control.evaluate((element) => {
    const box = element.getBoundingClientRect();

    return {
      height: box.height,
      width: box.width,
      x: box.x + window.scrollX,
      y: box.y + window.scrollY,
    };
  });
}

async function isTopmostAtCenter(control: Locator) {
  await control.scrollIntoViewIfNeeded();

  return control.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const hit = document.elementFromPoint(
      box.left + box.width / 2,
      box.top + box.height / 2,
    );

    return {
      hit: hit?.tagName ?? null,
      hitClass: hit?.getAttribute("class") ?? null,
      isTarget: hit !== null && (hit === element || element.contains(hit)),
    };
  });
}

async function hamburgerHitTest(control: Locator) {
  return control.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const hit = document.elementFromPoint(x, y);
    const computed = window.getComputedStyle(element);

    return {
      box: { height: box.height, width: box.width, x: box.x, y: box.y },
      elements: document
        .elementsFromPoint(x, y)
        .slice(0, 6)
        .map((candidate) => {
          const style = window.getComputedStyle(candidate);

          return {
            ariaLabel: candidate.getAttribute("aria-label"),
            className: candidate.getAttribute("class"),
            pointerEvents: style.pointerEvents,
            tagName: candidate.tagName,
            zIndex: style.zIndex,
          };
        }),
      hit: hit?.tagName ?? null,
      hitClass: hit?.getAttribute("class") ?? null,
      isTarget: hit !== null && (hit === element || element.contains(hit)),
      pointerEvents: computed.pointerEvents,
      zIndex: computed.zIndex,
    };
  });
}

const locales = [
  {
    locale: "en",
    heroTitle: "Healthy Teeth. Confident Smiles.",
    navigation: ["About", "Services", "The Dentist", "Reviews", "Contact"],
    primaryNavigation: "Primary navigation",
    doctor: "Dr. Sobia Zulfiqar",
  },
  {
    locale: "ur",
    heroTitle: "صحت مند دانت۔ پُراعتماد مسکراہٹیں۔",
    navigation: [
      "ہمارے بارے میں",
      "خدمات",
      "ڈینٹسٹ",
      "مریضوں کے تاثرات",
      "رابطہ",
    ],
    primaryNavigation: "مرکزی نیویگیشن",
    doctor: "ڈاکٹر صوبیہ ذوالفقار",
  },
] as const;

for (const site of locales) {
  test(`${site.locale} homepage has approved anchored content`, async ({
    page,
  }) => {
    await visitHomepage(page, site.locale);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      site.heroTitle,
    );
    for (const id of ["about", "services", "dentist", "reviews", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    const dentist = page.locator("#dentist");
    await expect(
      dentist.getByRole("heading", { name: site.doctor }),
    ).toBeVisible();
    await expect(
      dentist.locator('img[src*="featureDoctor.avif"]'),
    ).toBeVisible();
    await expect(
      page.locator(`a[href^="/${site.locale}/dentists/"]`),
    ).toHaveCount(0);
    await expect(
      page.locator(`a[href^="/${site.locale}/services/"]`),
    ).toHaveCount(0);
  });

  test(`${site.locale} desktop navigation has only approved anchors`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visitHomepage(page, site.locale);
    const navigation = page.getByRole("navigation", {
      name: site.primaryNavigation,
    });
    const expectedNavigation = [
      ...site.navigation.slice(0, 4),
      site.locale === "en" ? "Portfolio" : "پورٹ فولیو",
      ...site.navigation.slice(4),
    ];
    await expect(navigation.getByRole("link")).toHaveText(expectedNavigation);
    await expect(
      navigation.getByRole("link", { name: /Home|Dentists/i }),
    ).toHaveCount(0);
  });

  test(`${site.locale} has no horizontal overflow at release viewports`, async ({
    page,
  }) => {
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await visitHomepage(page, site.locale);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
    }
  });
}

test("mobile controls are topmost and accept real clicks at 320px and 375px", async ({
  page,
}) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 800 });
    await visitHomepage(page, "en");

    const hamburger = page.getByRole("button", { name: "Open menu" });
    const quickBook = page
      .getByRole("navigation", { name: "Quick actions" })
      .getByRole("link", { name: "Book", exact: true });
    const heroBook = page
      .getByRole("region", { name: "Healthy Teeth. Confident Smiles." })
      .getByRole("link", { name: "Book Appointment" });
    const whatsapp = page.getByRole("button", {
      name: "Chat with us on WhatsApp",
    });
    const sectionBook = page
      .locator("#dentist")
      .getByRole("link", { name: "Book Consultation" });
    const footerAbout = page
      .locator("footer")
      .getByRole("link", { name: "About" });

    for (const control of [
      hamburger,
      quickBook,
      heroBook,
      whatsapp,
      sectionBook,
      footerAbout,
    ]) {
      const hitTest = await isTopmostAtCenter(control);
      expect(hitTest.isTarget, JSON.stringify(hitTest)).toBe(true);
      await control.click({ trial: true });
    }

    await hamburger.click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Close menu" }).click();

    await whatsapp.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close WhatsApp chat" }).click();

    await quickBook.click();
    await expect(
      page.getByRole("dialog", { name: "Book Appointment" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Close appointment form" })
      .click();
    await footerAbout.click();
    await expect(page).toHaveURL(/\/en#about$/);
  }
});

test("the hamburger is topmost and opens by touch in both locales at narrow widths", async ({
  browser,
}) => {
  for (const locale of ["en", "ur"] as const) {
    for (const width of [280, 320, 375, 390]) {
      const context = await browser.newContext({
        baseURL: "http://127.0.0.1:3100",
        hasTouch: true,
        isMobile: true,
        viewport: { width, height: 800 },
      });
      const page = await context.newPage();
      const hamburger = page.locator(
        'button[aria-controls="mobile-navigation-panel"]',
      );

      try {
        await visitHomepage(page, locale);
        await expect(hamburger).toHaveAttribute("aria-expanded", "false");
        const hitTest = await hamburgerHitTest(hamburger);
        expect(
          hitTest.isTarget,
          JSON.stringify({ locale, width, hitTest }),
        ).toBe(true);

        await hamburger.tap();
        await expect(hamburger).toHaveAttribute("aria-expanded", "true");
        await hamburger.click();
        await expect(hamburger).toHaveAttribute("aria-expanded", "false");
      } finally {
        await context.close();
      }
    }
  }
});

test("the mobile menu exposes five anchors, closes on navigation and Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await visitHomepage(page, "en");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(menu.getByRole("link")).toHaveCount(6);
  await expect(menu.getByRole("link", { name: "The Dentist" })).toHaveAttribute(
    "href",
    "/en#dentist",
  );
  await expect(menu.getByRole("link", { name: "اردو" })).toBeVisible();
  await menu.getByRole("link", { name: "The Dentist" }).click();
  await expect(page).toHaveURL(/\/en#dentist$/);
  await expect(page.locator("#dentist")).toBeInViewport();
  await expect(page.locator("#mobile-navigation-panel")).toHaveCount(0);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-navigation-panel")).toHaveCount(0);
});

test("mobile quick actions and WhatsApp do not overlap", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await visitHomepage(page, "en");
  const quickActions = page.getByRole("navigation", { name: "Quick actions" });
  const whatsapp = page.getByRole("button", {
    name: "Chat with us on WhatsApp",
  });
  const [quickBox, whatsappBox] = await Promise.all([
    quickActions.boundingBox(),
    whatsapp.boundingBox(),
  ]);
  expect(quickBox).not.toBeNull();
  expect(whatsappBox).not.toBeNull();
  expect(whatsappBox!.y + whatsappBox!.height).toBeLessThanOrEqual(quickBox!.y);
});

test("hover affordances do not shift representative controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await visitHomepage(page, "en");
  const controls = [
    page.getByRole("link", { name: "Book Appointment" }).first(),
    page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "About" }),
    page.getByRole("button", { name: "Chat with us on WhatsApp" }),
    page.locator("footer").getByRole("link", { name: "Book Appointment" }),
  ];
  for (const control of controls) {
    await control.scrollIntoViewIfNeeded();
    const before = await documentBoundingBox(control);
    await control.hover();
    expect(await documentBoundingBox(control)).toEqual(before);
  }
});

test("public contact, booking, external-link, robots and sitemap contracts are correct", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await visitHomepage(page, "en");
  const whatsapp = page.locator('a[href="https://wa.me/923443420001"]').first();
  await expect(
    page.locator('a[href="tel:+923443420001"]:visible').first(),
  ).toBeVisible();
  await expect(whatsapp).toHaveAttribute("target", "_blank");
  await expect(whatsapp).toHaveAttribute("rel", /noopener noreferrer/);
  await expect(
    page.getByRole("link", { name: "Book", exact: true }),
  ).toHaveAttribute("href", "/en/book");
  const [robots, sitemap] = await Promise.all([
    request.get("/robots.txt"),
    request.get("/sitemap.xml"),
  ]);
  expect(await robots.text()).toContain("Disallow: /admin");
  expect(await robots.text()).toContain("Disallow: /api");
  expect(await sitemap.text()).toContain("/en");
  expect(await sitemap.text()).toContain("/ur");
});

test("the English booking request opens WhatsApp with entered details", async ({ page }) => {
  await page.goto("/en/book?service=consultation&dentist=no-preference");
  await expect(page).toHaveURL(/\/en\?booking=1&service=consultation$/);
  const dialog = page.getByRole("dialog", { name: "Book Appointment" });
  await expect(dialog).toBeVisible();
  await page.evaluate(() => {
    window.open = (url) => {
      document.body.dataset.openedWhatsApp = String(url);
      return null;
    };
  });
  await page.getByLabel("Full name").fill("Ali Khan");
  await page.getByLabel("Mobile number").fill("+92 300 0000000");
  await page.getByLabel("Preferred date").fill("2026-09-01");
  await page.getByLabel("Email (optional)").fill("ali@example.com");
  await page.getByRole("button", { name: "Send Appointment Request" }).click();
  const openedUrl = await page.locator("body").getAttribute("data-opened-whats-app");
  expect(openedUrl).toContain("https://wa.me/923443420001");
  expect(decodeURIComponent(openedUrl ?? "")).toContain("Ali Khan");
});

test("the Urdu booking request opens WhatsApp in RTL", async ({
  page,
}) => {
  await page.goto("/ur/book?service=consultation&dentist=no-preference");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAttribute("dir", "rtl");
  await page.evaluate(() => {
    window.open = (url) => {
      document.body.dataset.openedWhatsApp = String(url);
      return null;
    };
  });
  await dialog.locator('input[autocomplete="name"]').fill("Ali Khan");
  await dialog.locator('input[autocomplete="tel"]').fill("0300 0000000");
  await dialog.locator('input[type="date"]').fill("2026-09-01");
  await dialog.locator('button[type="submit"]').click();
  const openedUrl = await page.locator("body").getAttribute("data-opened-whats-app");
  expect(openedUrl).toContain("https://wa.me/923443420001");
  expect(decodeURIComponent(openedUrl ?? "")).toContain("Ali Khan");
});
