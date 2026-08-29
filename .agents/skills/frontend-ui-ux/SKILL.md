---
name: frontend-ui-ux
description: >-
  Expert guidelines and execution workflows for modern frontend development and UI/UX design: CSS design tokens, responsive layouts, micro-interactions, dark mode theming, accessibility (WCAG), and premium component engineering. Use this skill when designing or implementing web interfaces, styling, components, or UI refactoring.
---

# Frontend Engineering & UI/UX Design System Skill

This skill guides the creation of high-aesthetic, responsive, accessible, and performant web interfaces.

---

## Core Pillars of Premium UI/UX

### 1. Aesthetic Excellence (The "WOW" Factor)
* **Vibrant & Harmonious Palettes**: Avoid generic primary colors. Use curated HSL/OKLCH scales with clear surface contrasts.
* **Modern Typography**: Pair clean sans-serif bodies (e.g. *Inter*, *Outfit*, *Roboto*) with expressive headings (*Poppins*, *Plus Jakarta Sans*).
* **Depth & Glassmorphism**: Use subtle multi-layered shadows and backdrop blur for modern elevation.
* **Micro-Animations**: Add subtle transition effects on hover, active, focus, and state changes.

### 2. Design System & CSS Token Architecture
* Always declare centralized CSS variables in `:root` and `[data-theme="dark"]`.
* Avoid ad-hoc inline styles or hardcoded hex values in component stylesheets.
* Structure stylesheets into: Base/Reset, Tokens, Typography, Layout (Grid/Flexbox), Components, Utilities, and Responsive Media Queries.

### 3. Responsive & Mobile-First Layouts
* Use CSS Grid (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`) and Flexbox for fluid adaptations.
* Provide dedicated mobile patterns (e.g. touch-friendly buttons >= 44px, bottom navigation / sliding drawers, readable typography).

### 4. Accessibility & Semantic HTML
* Maintain proper heading hierarchy (`h1` -> `h2` -> `h3`).
* Use semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
* Ensure color contrast ratio meets WCAG AA standards (minimum 4.5:1 for normal text).
* Include clear focus states (`:focus-visible`) for keyboard navigation.

---

## References

* [Design Tokens & Theming](./references/design_tokens_and_theming.md)
* [UI/UX Component & Interaction Patterns](./references/ui_ux_component_patterns.md)
