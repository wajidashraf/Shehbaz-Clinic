# Booking Field Localization Design

The approved booking modal design remains unchanged. Only field presentation is corrected:

- English patient-name placeholder remains `Ahmad Ali`.
- Urdu patient-name placeholder becomes `مریض کا نام`.
- Both locales use `03xx xxxxxxx` as the mobile placeholder.
- The mobile input uses left-to-right text direction in both locales so the `03xx` prefix remains visually on the left.

Focused component tests will verify the placeholders and direction. No validation, WhatsApp payload, layout, or backend behavior changes.

The form also gains an optional localized additional-details textarea. It displays a live word count, rejects content above 100 words, and includes valid non-empty details in the WhatsApp message. No backend behavior changes.
