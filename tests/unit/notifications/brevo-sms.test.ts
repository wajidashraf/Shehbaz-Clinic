import { describe, expect, it, vi } from "vitest";
import { sendBrevoTransactionalSms } from "@/modules/notifications/brevo-sms.server";

describe("Brevo transactional SMS", () => {
  it("sends appointment details through Brevo's current SMS endpoint", async () => {
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ messageId: 1511882900100020 }), {
        status: 201,
      }),
    );

    await expect(
      sendBrevoTransactionalSms(
        {
          apiKey: "xkeysib-synthetic-key",
          content: "Appointment details",
          recipient: "923001234567",
          sender: "ShahbazDent",
          unicodeEnabled: true,
        },
        request,
      ),
    ).resolves.toEqual({ sent: true });
    expect(request).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/transactionalSMS/send",
      expect.objectContaining({
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": "xkeysib-synthetic-key",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: "Appointment details",
          recipient: "923001234567",
          sender: "ShahbazDent",
          type: "transactional",
          unicodeEnabled: true,
        }),
      }),
    );
  });

  it("returns a sanitized provider error", async () => {
    const request = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 400 }));

    await expect(
      sendBrevoTransactionalSms(
        {
          apiKey: "xkeysib-synthetic-key",
          content: "Appointment details",
          recipient: "923001234567",
          sender: "ShahbazDent",
          unicodeEnabled: false,
        },
        request,
      ),
    ).resolves.toEqual({ errorCode: "provider-400", sent: false });
  });
});
