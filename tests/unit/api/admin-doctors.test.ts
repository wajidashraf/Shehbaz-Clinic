import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/admin-api.server", () => ({
  requestHasValidOrigin: vi.fn(() => true),
  requireAdminRequest: vi.fn(async () => ({ _id: "admin-1" })),
}));

vi.mock("@/modules/doctors/doctor.repository", () => {
  class DoctorHasFutureAppointmentsError extends Error {}
  return {
    DoctorHasFutureAppointmentsError,
    findDoctor: vi.fn(),
    findDoctorIncludingInactive: vi.fn(),
    removeDoctor: vi.fn(),
    saveDoctor: vi.fn(),
  };
});

vi.mock("@/modules/media/cloudinary.server", () => ({
  getCloudinaryMediaStorage: vi.fn(),
}));

vi.mock("@/modules/media/media.repository", () => ({
  findMediaAssetBySecureUrl: vi.fn(),
  removeMediaAssetRecord: vi.fn(),
  saveMediaAsset: vi.fn(),
}));

import { DELETE } from "@/app/api/v1/admin/doctors/route";
import { getCloudinaryMediaStorage } from "@/modules/media/cloudinary.server";
import {
  DoctorHasFutureAppointmentsError,
  findDoctorIncludingInactive,
  removeDoctor,
} from "@/modules/doctors/doctor.repository";
import {
  findMediaAssetBySecureUrl,
  removeMediaAssetRecord,
} from "@/modules/media/media.repository";

const doctor = {
  id: "doctor-one",
  image: "https://images.example/portrait",
  featuredImages: [{ url: "https://images.example/gallery" }],
};

describe("admin doctor API", () => {
  const deletePublicImage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCloudinaryMediaStorage).mockReturnValue({
      uploadPublicImage: vi.fn(),
      deletePublicImage,
    });
    vi.mocked(findDoctorIncludingInactive).mockResolvedValue(doctor as never);
    vi.mocked(findMediaAssetBySecureUrl).mockImplementation(async (url) => ({
      publicId: url.endsWith("portrait") ? "clinic/portrait" : "clinic/gallery",
      secureUrl: url,
    }));
  });

  it("soft-deletes a doctor and cleans up uploaded images", async () => {
    const response = await DELETE(
      new Request("http://localhost/api/v1/admin/doctors?id=doctor-one", {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(200);
    expect(removeDoctor).toHaveBeenCalledWith("doctor-one");
    expect(deletePublicImage).toHaveBeenCalledTimes(2);
    expect(removeMediaAssetRecord).toHaveBeenCalledTimes(2);
  });

  it("keeps a doctor when future appointments still exist", async () => {
    vi.mocked(removeDoctor).mockRejectedValueOnce(
      new DoctorHasFutureAppointmentsError(),
    );

    const response = await DELETE(
      new Request("http://localhost/api/v1/admin/doctors?id=doctor-one", {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "doctor-has-appointments",
    });
    expect(deletePublicImage).not.toHaveBeenCalled();
  });
});
