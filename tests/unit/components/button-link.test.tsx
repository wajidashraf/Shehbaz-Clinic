import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ButtonLink } from "@/components/ui/button-link";

describe("ButtonLink", () => {
  it("uses a compact radius and smooth ease-in-out motion", () => {
    render(<ButtonLink href="/test">Test action</ButtonLink>);

    expect(screen.getByRole("link", { name: "Test action" })).toHaveClass(
      "rounded-lg",
      "ease-[cubic-bezier(0.65,0,0.35,1)]",
    );
  });
});
