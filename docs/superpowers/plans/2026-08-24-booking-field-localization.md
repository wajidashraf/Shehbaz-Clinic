# Booking Field Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct localized field presentation and add optional appointment details limited to 100 words.

**Architecture:** Keep localized copy in the existing modal copy object. Apply `dir="ltr"` only to the telephone input so the surrounding Urdu modal remains RTL.

**Tech Stack:** React, TypeScript, Vitest, Testing Library

## Global Constraints

- Preserve the approved modal design.
- Do not change form validation, WhatsApp submission, or backend code.
- Use `03xx xxxxxxx` in English and Urdu.
- Include optional valid details in the existing WhatsApp message without calling the backend.

---

### Task 1: Correct booking-field presentation

**Files:**
- Modify: `src/components/booking/booking-request-modal.tsx`
- Test: `tests/unit/components/booking-request-modal.test.tsx`

**Interfaces:**
- Consumes: `BookingRequestModal({ locale })`
- Produces: localized placeholders and an LTR telephone input

- [ ] **Step 1: Write failing assertions**

Assert that English and Urdu mobile inputs have placeholder `03xx xxxxxxx` and `dir="ltr"`, and the Urdu name input has placeholder `مریض کا نام`.

- [ ] **Step 2: Verify the focused test fails**

Run `npx vitest run tests/unit/components/booking-request-modal.test.tsx --reporter=dot` and expect placeholder/direction assertion failures.

- [ ] **Step 3: Implement the minimal copy and direction changes**

Set both `mobilePlaceholder` values to `03xx xxxxxxx`, set the Urdu `patientPlaceholder` to `مریض کا نام`, and add `dir="ltr"` to the mobile input.

- [ ] **Step 4: Verify the change**

Run the focused test, ESLint, and TypeScript checks and expect them all to pass.

### Task 2: Add optional appointment details

**Files:**
- Modify: `src/components/booking/booking-request-modal.tsx`
- Test: `tests/unit/components/booking-request-modal.test.tsx`

**Interfaces:**
- Consumes: the existing local form draft and WhatsApp message builder
- Produces: an optional `details` value included in WhatsApp when valid

- [ ] **Step 1: Write failing assertions**

Assert that the localized textarea is optional, shows its word count, blocks a 101-word value, and includes a valid value in the generated WhatsApp URL.

- [ ] **Step 2: Verify the focused test fails**

Run `npx vitest run tests/unit/components/booking-request-modal.test.tsx --reporter=dot` and expect the new details-field assertions to fail.

- [ ] **Step 3: Implement the field and limit**

Add localized field copy, a `details` draft property, a whitespace-based word counter, validation above 100 words, a textarea, and conditional WhatsApp message content.

- [ ] **Step 4: Verify all scoped changes**

Run the focused test, ESLint, TypeScript checks, and the production build and expect them all to pass.
