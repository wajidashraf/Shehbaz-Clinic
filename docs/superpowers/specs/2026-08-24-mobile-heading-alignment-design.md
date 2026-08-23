# Mobile Homepage Heading Alignment

## Scope

Adjust homepage heading alignment only at mobile widths. Preserve the approved visual design, content, navigation, section order, and tablet/desktop presentation.

## Responsive behavior

- Hide the hero eyebrow below the `sm` breakpoint.
- Center the hero title and description below the `sm` breakpoint.
- Restore the existing locale-aware hero alignment from the `sm` breakpoint upward: left for English and right for Urdu.
- Center each homepage section's complete heading block—eyebrow, title, and description—below the `sm` breakpoint.
- Preserve each section's existing alignment from the `sm` breakpoint upward.
- Include the Portfolio section heading while preserving the new `{labels.portfolio}` navigation links and `#portfolio` anchor.

## Implementation boundaries

- Prefer responsive utility classes in the shared `SectionHeading` component for sections already using it.
- Apply targeted responsive classes to bespoke homepage heading components, including the hero and Portfolio section.
- Do not introduce global heading selectors that could affect booking, admin, or internal pages.
- Do not change typography, colors, copy, spacing, buttons, images, card layouts, navigation behavior, or desktop presentation.

## Accessibility and localization

- Hiding the hero eyebrow is presentational and mobile-only; the hero's accessible section label remains available.
- English and Urdu text retain their correct direction and desktop alignment.
- Heading hierarchy and accessible names remain unchanged.

## Verification

- Verify English and Urdu at a mobile viewport below `sm`.
- Verify the hero eyebrow is hidden and the hero title/description are centered.
- Verify all homepage eyebrow/title/description blocks are centered on mobile, including Portfolio.
- Verify at `sm` and desktop widths that existing locale-aware alignment is preserved.
- Run focused component tests, type checking, and linting for the changed files.
