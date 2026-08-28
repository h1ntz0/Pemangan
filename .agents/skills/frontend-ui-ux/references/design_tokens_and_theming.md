# Design Tokens & Theming Architecture

A robust design token system ensures visual consistency, seamless dark mode transitions, and scalable component styling.

---

## 1. Core Token Taxonomy

```css
:root {
  /* Brand Palette (Tailored HSL / Hex) */
  --color-primary: #1e3a8a;
  --color-primary-light: #3b82f6;
  --color-primary-dark: #0f172a;
  --color-accent: #d97706;

  /* Surfaces & Backgrounds */
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-hover: #f1f5f9;
  --color-surface-translucent: rgba(255, 255, 255, 0.85);

  /* Typography & Text */
  --color-text-main: #0f172a;
  --color-text-muted: #64748b;
  --color-text-inverse: #ffffff;

  /* Borders & Dividers */
  --color-border: #cbd5e1;
  --color-border-subtle: #e2e8f0;
  --color-border-focus: #3b82f6;

  /* Status Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #0284c7;

  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Border Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows (Elevation) */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.25s ease;
}

[data-theme="dark"] {
  --color-bg: #0b1120;
  --color-surface: #131d31;
  --color-surface-hover: #1e293b;
  --color-surface-translucent: rgba(19, 29, 49, 0.85);
  --color-text-main: #f8fafc;
  --color-text-muted: #94a3b8;
  --color-border: #24324a;
  --color-border-subtle: #19253b;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.6);
}
```
