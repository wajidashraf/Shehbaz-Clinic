import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

const alternates = {
  en: "https://shahbazdental.com/en",
  ur: "https://shahbazdental.com/ur",
  "x-default": "https://shahbazdental.com/en",
};

describe("metadata routes", () => {
  it("publishes the production crawler directives", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      host: "https://shahbazdental.com",
      sitemap: "https://shahbazdental.com/sitemap.xml",
    });
  });

  it("publishes only the two localized home pages", () => {
    expect(sitemap()).toEqual([
      {
        url: "https://shahbazdental.com/en",
        changeFrequency: "monthly",
        priority: 1,
        alternates: { languages: alternates },
      },
      {
        url: "https://shahbazdental.com/ur",
        changeFrequency: "monthly",
        priority: 1,
        alternates: { languages: alternates },
      },
    ]);
  });
});
