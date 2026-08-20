# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Shahbaz Dental Clinic
**Generated:** 2026-08-20 15:18:15
**Category:** Medical Clinic
**Design Dials:** Variance 6/10 (Balanced / Modern) | Motion 2/10 (Subtle) | Density 4/10 (Standard)

---

## Global Rules

### Color Palette

| Role               | Hex       | CSS Variable   |
| ------------------ | --------- | -------------- |
| Primary            | `#096B61` | `--teal`       |
| Primary Hover      | `#07534C` | `--teal-dark`  |
| On Primary         | `#FFFFFF` | n/a            |
| Background         | `#F7FBFA` | `--mineral`    |
| Foreground         | `#123035` | `--ink`        |
| Muted Surface      | `#EDF7F4` | `--aqua-soft`  |
| Supporting Surface | `#DCECE8` | `--aqua`       |
| Muted Text         | `#496469` | `--muted-text` |
| Border             | `#D4E3DF` | `--line`       |
| Accent             | `#A96812` | `--saffron`    |
| Destructive        | `#A42121` | `--danger`     |

**Color Notes:** Light, high-contrast mineral white with clinical teal and a restrained saffron accent.

### Typography

- **English Font:** Manrope Variable
- **Urdu Font:** Noto Sans Arabic Variable
- **Mood:** calm, modern, bilingual, readable, community-focused
- **Source:** self-hosted npm font packages; no runtime font request

**CSS Import:**

```css
@import "@fontsource-variable/manrope";
@import "@fontsource-variable/noto-sans-arabic";
```

### Spacing Variables

_Density: 4/10 — Standard_

| Token         | Value             | Usage                     |
| ------------- | ----------------- | ------------------------- |
| `--space-xs`  | `4px` / `0.25rem` | Tight gaps                |
| `--space-sm`  | `8px` / `0.5rem`  | Icon gaps, inline spacing |
| `--space-md`  | `16px` / `1rem`   | Standard padding          |
| `--space-lg`  | `24px` / `1.5rem` | Section padding           |
| `--space-xl`  | `32px` / `2rem`   | Large gaps                |
| `--space-2xl` | `48px` / `3rem`   | Section margins           |
| `--space-3xl` | `64px` / `4rem`   | Hero padding              |

### Shadow Depths

| Level         | Value                          | Usage                       |
| ------------- | ------------------------------ | --------------------------- |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)`   | Subtle lift                 |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)`    | Cards, buttons              |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)`  | Modals, dropdowns           |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--teal);
  color: white;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 800;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line-strong);
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 800;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid var(--line-strong);
  border-radius: 16px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: var(--teal);
  outline: none;
  box-shadow: 0 0 0 3px rgba(9, 107, 97, 0.18);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Soft UI Evolution

**Keywords:** Evolved soft UI, better contrast, modern aesthetics, subtle depth, accessibility-focused, improved shadows, hybrid

**Best For:** Modern enterprise apps, SaaS platforms, health/wellness, modern business tools, professional, hybrid

**Key Effects:** Improved shadows (softer than flat, clearer than neumorphism), modern (200-300ms), focus visible, WCAG AA/AAA

### Page Pattern

**Pattern Name:** Trust & Authority + Conversion

- **CTA Placement:** Above fold
- **Section Order:** Hero > Features > CTA

---

## Motion

**Scroll Reveal** (Subtle) — Trigger: scroll (viewport enter) | Duration: 300-400ms | Easing: `power1.out`

```js
gsap.from(el, {
  opacity: 0,
  y: 12,
  duration: 0.35,
  ease: "power1.out",
  scrollTrigger: {
    trigger: el,
    start: "top 90%",
    toggleActions: "play none none reverse",
  },
});
```

**Framework notes:** Requires the ScrollTrigger plugin registered once via gsap.registerPlugin(ScrollTrigger)

- ✅ Keep the y offset small (8-16px) so it reads as a fade, not a slide
- ❌ Don't reveal below-the-fold content needed for SEO/crawlers as invisible-by-default without a no-JS fallback
- ⚡ toggleActions 'play none none reverse' avoids re-triggering on every scroll direction change

---

## Anti-Patterns (Do NOT Use)

- ❌ Outdated interface
- ❌ Confusing booking
- ❌ AI purple/pink gradients

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
