# Book Appointment Label Design

## Goal

Use the concise English label "Book Appointment" everywhere the interface currently uses "Book an appointment" as a title or action label.

## Scope

- Update the four matching English translation values in `src/messages/en.json`.
- Preserve descriptive prose, Urdu translations, routes, booking behavior, and API behavior.
- Verify that no exact "Book an appointment" labels remain and that the relevant tests pass.

## Implementation

This is a translation-only change. No components, data models, or application logic need modification because the affected interface elements already read their labels from the English message catalog.
