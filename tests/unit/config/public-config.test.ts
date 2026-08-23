import { describe, expect, it } from "vitest";

import { clinicConfig } from "@/config/public-config";

type ContactActionConfig = {
  landlineHref: string;
  phoneHref: string;
  whatsapp: {
    href: (message?: string) => string;
    number: string;
  };
};

const contactActions = clinicConfig as typeof clinicConfig &
  ContactActionConfig;

describe("clinicConfig contact actions", () => {
  it("keeps verified phone displays paired with dialable hrefs", () => {
    expect(clinicConfig.phone).toBe("+92 344 3420001");
    expect(contactActions.phoneHref).toBe("tel:+923443420001");
    expect(clinicConfig.landline).toBe("041-3420001");
    expect(contactActions.landlineHref).toBe("tel:0413420001");
  });

  it("builds the base WhatsApp action without a query string", () => {
    expect(contactActions.whatsapp.number).toBe("+923443420001");
    expect(contactActions.whatsapp.href()).toBe("https://wa.me/923443420001");
  });

  it("encodes a WhatsApp prefilled message exactly once", () => {
    expect(contactActions.whatsapp.href("Book & ask")).toBe(
      "https://wa.me/923443420001?text=Book%20%26%20ask",
    );
  });
});
