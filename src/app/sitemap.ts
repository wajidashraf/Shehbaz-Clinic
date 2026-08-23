import type { MetadataRoute } from "next";

import { languageAlternates, localizedHomeUrl } from "@/config/seo";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: localizedHomeUrl(locale),
    changeFrequency: "monthly",
    priority: 1,
    alternates: {
      languages: languageAlternates,
    },
  }));
}
