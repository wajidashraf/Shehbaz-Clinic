import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/admin-api.server", () => ({
  requestHasValidOrigin: vi.fn(() => true),
  requireAdminRequest: vi.fn(async () => ({ _id: "admin-1" })),
}));

vi.mock("@/modules/testimonials/testimonial.repository", () => ({
  findTestimonial: vi.fn(),
  removeTestimonial: vi.fn(),
  saveTestimonial: vi.fn(),
}));

vi.mock("@/modules/media/cloudinary.server", () => ({
  getCloudinaryMediaStorage: vi.fn(),
}));

vi.mock("@/modules/media/media.repository", () => ({
  findMediaAssetBySecureUrl: vi.fn(),
  removeMediaAssetRecord: vi.fn(),
  saveMediaAsset: vi.fn(),
}));

import { DELETE, POST } from "@/app/api/v1/admin/testimonials/route";
import { getCloudinaryMediaStorage } from "@/modules/media/cloudinary.server";
import {
  findMediaAssetBySecureUrl,
  removeMediaAssetRecord,
} from "@/modules/media/media.repository";
import { MediaValidationError } from "@/modules/media/media.validation";
import {
  findTestimonial,
  removeTestimonial,
  saveTestimonial,
} from "@/modules/testimonials/testimonial.repository";

const savedTestimonial = {
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

function testimonialForm(overrides: Record<string, string> = {}) {
  const form = new FormData();
  const fields = {
    testimonialId: "",
    nameEn: "Ayesha Khan",
    nameUr: "عائشہ خان",
    treatmentEn: "Dental cleaning",
    treatmentUr: "دانتوں کی صفائی",
    reviewEn: "The clinic explained every step clearly and treated me gently.",
    reviewUr: "کلینک نے ہر مرحلہ واضح کیا اور بہت نرمی سے علاج کیا۔",
    dateKey: "2026-08-18",
    isPublished: "true",
    sortOrder: "20",
    ...overrides,
  };
  for (const [name, value] of Object.entries(fields)) form.set(name, value);
  return form;
}

describe("admin testimonial API", () => {
  const deletePublicImage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCloudinaryMediaStorage).mockReturnValue({
      uploadPublicImage: vi.fn(),
      deletePublicImage,
    });
    vi.mocked(findTestimonial).mockResolvedValue(null);
    vi.mocked(saveTestimonial).mockResolvedValue(savedTestimonial);
  });

  it("creates a bilingual testimonial without requiring an image", async () => {
    const response = await POST(
      new Request("http://localhost/api/v1/admin/testimonials", {
        method: "POST",
        body: testimonialForm(),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      cleanupPending: false,
      testimonial: savedTestimonial,
    });
    expect(saveTestimonial).toHaveBeenCalledWith(
      expect.objectContaining({
        image: null,
        isPublished: true,
        sortOrder: 20,
      }),
    );
  });

  it("updates an existing testimonial to hidden without losing its image", async () => {
    const existing = {
      ...savedTestimonial,
      image: "https://images.example/review-ayesha",
    };
    vi.mocked(findTestimonial).mockResolvedValue(existing);
    vi.mocked(saveTestimonial).mockResolvedValue({
      ...existing,
      isPublished: false,
    });

    const response = await POST(
      new Request("http://localhost/api/v1/admin/testimonials", {
        method: "POST",
        body: testimonialForm({
          testimonialId: "review-ayesha",
          isPublished: "false",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(saveTestimonial).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "review-ayesha",
        image: "https://images.example/review-ayesha",
        isPublished: false,
      }),
    );
    expect(deletePublicImage).not.toHaveBeenCalled();
  });

  it("returns a client error for an invalid testimonial image", async () => {
    const uploadPublicImage = vi
      .fn()
      .mockRejectedValue(new MediaValidationError("Unsupported image type"));
    vi.mocked(getCloudinaryMediaStorage).mockReturnValue({
      uploadPublicImage,
      deletePublicImage,
    });
    const form = testimonialForm();
    const image = new File([new Uint8Array([1, 2, 3])], "patient.jpg", {
      type: "image/jpeg",
    });
    Object.defineProperty(image, "arrayBuffer", {
      value: async () => new Uint8Array([1, 2, 3]).buffer,
    });
    form.set("image", image);

    const request = new Request("http://localhost/api/v1/admin/testimonials", {
      method: "POST",
    });
    vi.spyOn(request, "formData").mockResolvedValue(form);
    const response = await POST(request);

    const responseBody = await response.json();
    expect({
      responseBody,
      status: response.status,
      uploadCalls: uploadPublicImage.mock.calls.length,
    }).toEqual({
      responseBody: { error: "invalid-image" },
      status: 400,
      uploadCalls: 1,
    });
    expect(saveTestimonial).not.toHaveBeenCalled();
  });

  it("deletes a testimonial and its managed image", async () => {
    vi.mocked(findTestimonial).mockResolvedValue({
      ...savedTestimonial,
      image: "https://images.example/review-ayesha",
    });
    vi.mocked(findMediaAssetBySecureUrl).mockResolvedValue({
      publicId: "clinic/testimonials/review-ayesha",
      secureUrl: "https://images.example/review-ayesha",
    });

    const response = await DELETE(
      new Request(
        "http://localhost/api/v1/admin/testimonials?id=review-ayesha",
        { method: "DELETE" },
      ),
    );

    expect(response.status).toBe(200);
    expect(removeTestimonial).toHaveBeenCalledWith("review-ayesha");
    expect(deletePublicImage).toHaveBeenCalledWith(
      "clinic/testimonials/review-ayesha",
    );
    expect(removeMediaAssetRecord).toHaveBeenCalledWith(
      "clinic/testimonials/review-ayesha",
    );
  });

  it("reports pending image cleanup without reporting the deletion as failed", async () => {
    vi.mocked(findTestimonial).mockResolvedValue({
      ...savedTestimonial,
      image: "https://images.example/review-ayesha",
    });
    vi.mocked(findMediaAssetBySecureUrl).mockResolvedValue({
      publicId: "clinic/testimonials/review-ayesha",
      secureUrl: "https://images.example/review-ayesha",
    });
    deletePublicImage.mockRejectedValueOnce(
      new Error("Cloudinary unavailable"),
    );

    const response = await DELETE(
      new Request(
        "http://localhost/api/v1/admin/testimonials?id=review-ayesha",
        { method: "DELETE" },
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      cleanupPending: true,
    });
    expect(removeTestimonial).toHaveBeenCalledWith("review-ayesha");
  });
});
