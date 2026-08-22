import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServiceDetail } from "@/components/content/service-detail";
import { demoServices } from "@/content/demo-content";

const labels = {
  back: "Back to all services",
  book: "Book this service",
  bookingDescription: "Choose your dentist, date, and available time.",
  bookingTitle: "Ready to plan your visit?",
  clinicalNote: "Clinical guidance",
  duration: "Expected appointment",
  minutes: "minutes",
  overview: "Treatment overview",
  related: "Related services",
  suitableFor: "Who this may help",
  viewDetails: "View service details",
  whatToExpect: "What to expect",
};

describe("ServiceDetail", () => {
  it("presents treatment guidance before the booking action", () => {
    const service = demoServices.find((item) => item.id === "root-canal")!;
    const relatedServices = demoServices.filter((item) => item.id === "filling");

    render(
      <ServiceDetail
        labels={labels}
        locale="en"
        relatedServices={relatedServices}
        service={service}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Root canal assessment" }),
    ).toBeVisible();
    expect(screen.getByText(service.details.en)).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Who this may help" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "What to expect" }),
    ).toBeVisible();
    expect(screen.getByText(service.clinicalNote.en)).toBeVisible();
    expect(screen.getByRole("link", { name: "Book this service" })).toHaveAttribute(
      "href",
      "/en/book?service=root-canal",
    );
    expect(screen.getByRole("link", { name: "View service details" })).toHaveAttribute(
      "href",
      "/en/services/filling",
    );
  });

  it("renders the complete Urdu service record", () => {
    const service = demoServices.find((item) => item.id === "cleaning")!;

    render(
      <ServiceDetail
        labels={{
          ...labels,
          back: "تمام خدمات پر واپس جائیں",
          book: "یہ خدمت بک کریں",
          clinicalNote: "طبی رہنمائی",
          suitableFor: "یہ خدمت کن کے لیے مفید ہو سکتی ہے",
          whatToExpect: "ملاقات میں کیا ہوگا",
        }}
        locale="ur"
        relatedServices={[]}
        service={service}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: service.name.ur })).toBeVisible();
    expect(screen.getByText(service.details.ur)).toBeVisible();
    expect(screen.getByText(service.suitableFor[0]!.ur)).toBeVisible();
    expect(screen.getByText(service.expectations[0]!.ur)).toBeVisible();
  });
});
