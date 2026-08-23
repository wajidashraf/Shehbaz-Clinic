# Task 3 Report: Anchored Desktop Navigation and Mobile Hamburger

## RED evidence

Ran:

```text
npm test -- tests/unit/components/site-header.test.tsx tests/unit/components/mobile-menu.test.tsx tests/unit/layout/locale-switch.test.ts
```

Before implementation, Vitest could not resolve the new `MobileMenu` module and
the header test showed the old `Home` and `Dentists` desktop links instead of
the required five anchors. A later RED cycle confirmed that the quick-action
bar did not yet receive the dedicated localized short `Book` label.

## GREEN evidence

The same focused suite now passes: 3 test files and 7 tests. It verifies:

- The exact desktop anchor order and destinations, with no Home/Dentists item.
- Hamburger open/closed ARIA semantics, panel contents, locale switcher,
  close-on-anchor, and Escape close.
- Arabic-script Urdu labels without mojibake.
- Localized quick-action labels, destinations, and external-link security.

## Verification

```text
npm test -- tests/unit/components/site-header.test.tsx tests/unit/components/mobile-menu.test.tsx tests/unit/layout/locale-switch.test.ts
npm run typecheck
npx prettier --check src/components/layout/mobile-menu.tsx src/components/layout/site-header.tsx src/components/layout/mobile-navigation.tsx src/app/[locale]/layout.tsx src/messages/en.json src/messages/ur.json tests/unit/components/site-header.test.tsx tests/unit/components/mobile-menu.test.tsx
git diff --check -- src/components/layout/mobile-menu.tsx src/components/layout/site-header.tsx src/components/layout/mobile-navigation.tsx src/app/[locale]/layout.tsx src/messages/en.json src/messages/ur.json tests/unit/components/site-header.test.tsx tests/unit/components/mobile-menu.test.tsx
```

All commands exited successfully. The test environment emits jsdom's expected
`Not implemented: navigation to another Document` notice after anchor clicks;
it does not fail the suite.

## Exact changed files

- `src/components/layout/mobile-menu.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/mobile-navigation.tsx`
- `src/app/[locale]/layout.tsx`
- `src/messages/en.json`
- `src/messages/ur.json`
- `tests/unit/components/site-header.test.tsx`
- `tests/unit/components/mobile-menu.test.tsx`
- `.superpowers/sdd/2026-08-23-homepage-finalization/task-3-report.md`

## Commit

`feat: add anchored responsive homepage navigation` (the commit hash is
provided in the handoff).

## Self-review and concerns

The client boundary is limited to the interactive mobile disclosure. The panel
is conditionally rendered, so it has no focusable hidden content. Existing
desktop header/top-bar/brand/booking styling and quick-action URL sources were
preserved. Legacy translation keys remain in both message files. No concerns
remain within Task 3 scope.
