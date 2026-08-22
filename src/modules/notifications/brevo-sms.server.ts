import "server-only";

type BrevoSmsInput = {
  apiKey: string;
  content: string;
  recipient: string;
  sender: string;
  unicodeEnabled: boolean;
};

type BrevoSmsResult = { sent: true } | { errorCode: string; sent: false };

export async function sendBrevoTransactionalSms(
  input: BrevoSmsInput,
  request: typeof fetch = fetch,
): Promise<BrevoSmsResult> {
  try {
    const response = await request(
      "https://api.brevo.com/v3/transactionalSMS/send",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": input.apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: input.content,
          recipient: input.recipient,
          sender: input.sender,
          type: "transactional",
          unicodeEnabled: input.unicodeEnabled,
        }),
      },
    );

    return response.ok
      ? { sent: true }
      : { errorCode: `provider-${response.status}`, sent: false };
  } catch {
    return { errorCode: "provider-unavailable", sent: false };
  }
}
