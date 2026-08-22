import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminTestimonialManager } from "@/components/admin/admin-testimonial-manager";
import type { TestimonialRecord } from "@/modules/testimonials/testimonial.types";

const testimonial: TestimonialRecord = {
  id: "review-ayesha",
  name: { en: "Ayesha Khan", ur: "عائشہ خان" },
  treatment: { en: "Dental cleaning", ur: "دانتوں کی صفائی" },
  review: {
    en: "The clinic explained every step clearly and treated me gently.",
    ur: "کلینک نے ہر مرحلہ واضح کیا اور بہت نرمی سے علاج کیا۔",
  },
  dateKey: "2026-08-18",
  image: null,
  isPublished: true,
  sortOrder: 20,
};

describe("AdminTestimonialManager", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("submits all bilingual fields without requiring a patient image", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ testimonial, cleanupPending: false }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const onChanged = vi.fn();
    render(<AdminTestimonialManager testimonials={[]} onChanged={onChanged} />);

    fireEvent.change(screen.getByLabelText("Patient name (English)"), {
      target: { value: "Ali" },
    });
    fireEvent.change(screen.getByLabelText("Patient name (Urdu)"), {
      target: { value: "علی" },
    });
    fireEvent.change(screen.getByLabelText("Treatment (English)"), {
      target: { value: "Checkup" },
    });
    fireEvent.change(screen.getByLabelText("Treatment (Urdu)"), {
      target: { value: "معائنہ" },
    });
    fireEvent.change(screen.getByLabelText("Review (English)"), {
      target: { value: "Clear explanations and gentle care." },
    });
    fireEvent.change(screen.getByLabelText("Review (Urdu)"), {
      target: { value: "واضح رہنمائی اور بہت نرم انداز میں علاج کیا گیا۔" },
    });
    fireEvent.change(screen.getByLabelText("Review date"), {
      target: { value: "2026-08-20" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add testimonial" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    await waitFor(() => expect(onChanged).toHaveBeenCalledOnce());

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const body = request.body as FormData;
    expect(body.get("nameEn")).toBe("Ali");
    expect(body.get("nameUr")).toBe("علی");
    expect(body.get("image")).toBeNull();
  });

  it("can hide a published testimonial", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          testimonial: { ...testimonial, isPublished: false },
          cleanupPending: false,
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const onChanged = vi.fn();
    const user = userEvent.setup();
    render(
      <AdminTestimonialManager
        testimonials={[testimonial]}
        onChanged={onChanged}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Hide testimonial" }));

    const body = fetchMock.mock.calls[0][1]?.body as FormData;
    expect(body.get("testimonialId")).toBe("review-ayesha");
    expect(body.get("isPublished")).toBe("false");
    expect(onChanged).toHaveBeenCalledOnce();
  });

  it("keeps an open edit draft synchronized after quick hide", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          testimonial: { ...testimonial, isPublished: false },
          cleanupPending: false,
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    const { container } = render(
      <AdminTestimonialManager
        testimonials={[testimonial]}
        onChanged={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Edit testimonial" }));
    await user.click(screen.getByRole("button", { name: "Hide testimonial" }));

    expect(
      container.querySelector<HTMLInputElement>('input[name="isPublished"]'),
    ).toHaveValue("false");
  });

  it("loads an existing testimonial into the bilingual edit form", async () => {
    const user = userEvent.setup();
    render(
      <AdminTestimonialManager
        testimonials={[testimonial]}
        onChanged={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Edit testimonial" }));

    expect(screen.getByLabelText("Patient name (English)")).toHaveValue(
      "Ayesha Khan",
    );
    expect(screen.getByLabelText("Patient name (Urdu)")).toHaveValue(
      "عائشہ خان",
    );
    expect(
      screen.getByRole("button", { name: "Save testimonial" }),
    ).toBeVisible();
  });

  it("clears an unsaved image when switching between edit records", async () => {
    const secondTestimonial: TestimonialRecord = {
      ...testimonial,
      id: "review-usman",
      name: { en: "Usman Ali", ur: "عثمان علی" },
    };
    const user = userEvent.setup();
    render(
      <AdminTestimonialManager
        testimonials={[testimonial, secondTestimonial]}
        onChanged={vi.fn()}
      />,
    );

    const editButtons = screen.getAllByRole("button", {
      name: "Edit testimonial",
    });
    await user.click(editButtons[0]);
    const imageInput = screen.getByLabelText("Patient image (optional)");
    await user.upload(
      imageInput,
      new File([new Uint8Array([1])], "patient.png", { type: "image/png" }),
    );
    expect(imageInput).toHaveProperty("files.length", 1);

    await user.click(editButtons[1]);

    expect(screen.getByLabelText("Patient image (optional)")).toHaveProperty(
      "files.length",
      0,
    );
  });
});
