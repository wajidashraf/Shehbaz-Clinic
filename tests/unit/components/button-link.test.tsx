import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ButtonLink } from "@/components/ui/button-link";

describe("ButtonLink", () => {
  it("keeps the button and its icon spatially stable while retaining hover feedback", () => {
    render(
      <ButtonLink href="/test" icon={<span>Arrow</span>}>
        Test action
      </ButtonLink>,
    );

    const button = screen.getByRole("link", { name: "Test action" });
    const icon = button.querySelector('[aria-hidden="true"]');

    expect(button).toHaveClass(
      "rounded-lg",
      "ease-[cubic-bezier(0.65,0,0.35,1)]",
      "hover:bg-[var(--teal-dark)]",
      "hover:shadow-[0_10px_26px_color-mix(in_srgb,var(--teal)_38%,transparent)]",
    );
    expect(button.className).not.toMatch(
      /(?:hover|group-hover|active):.*(?:translate|scale)/,
    );
    expect(button.className).not.toContain(
      "transition-[background-color,border-color,color,box-shadow,transform]",
    );
    expect(button.className).not.toMatch(/before:.*translate/);
    expect(icon).not.toBeNull();
    expect(icon?.className).not.toMatch(
      /(?:hover|group-hover|active):.*(?:translate|scale)/,
    );
    expect(icon?.className).not.toMatch(/(?:^|\s)transform-gpu(?:\s|$)/);
  });
});
