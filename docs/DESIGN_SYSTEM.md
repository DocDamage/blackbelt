# Six Sigma Training Platform - Design System

## Overview

This document describes the design system for the Six Sigma Training Platform (BlackBelt). The design tokens and utilities are defined in `src/index.css` and `src/styles/variables.css`.

---

## Color System

### Primary Colors (Professional Blue)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary-50` | `#eff6ff` | Very light backgrounds |
| `--color-primary-100` | `#dbeafe` | Light backgrounds, hover states |
| `--color-primary-200` | `#bfdbfe` | Borders, disabled states |
| `--color-primary-300` | `#93c5fd` | Secondary text on dark |
| `--color-primary-400` | `#60a5fa` | Links, accents |
| `--color-primary-500` | `#3b82f6` | Primary interactive elements |
| `--color-primary-600` | `#2563eb` | Primary buttons |
| `--color-primary-700` | `#1d4ed8` | Button hover states |
| `--color-primary-800` | `#1e3a5f` | Dark accents |
| `--color-primary-900` | `#0f172a` | Darkest shade |

### Belt Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-white-belt` | `#f8fafc` | White belt badge |
| `--color-yellow-belt` | `#fbbf24` | Yellow belt badge |
| `--color-green-belt` | `#10b981` | Green belt badge |
| `--color-black-belt` | `#1f2937` | Black belt badge |
| `--color-master-belt` | `linear-gradient(...)` | Master black belt badge |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#10b981` | Success states, positive indicators |
| `--color-warning` | `#f59e0b` | Warning states, cautions |
| `--color-error` | `#ef4444` | Error states, destructive actions |
| `--color-info` | `#3b82f6` | Informational messages |
| `--color-gold` | `#d4a574` | Premium features, highlights |

### Background & Surface

| Token | Usage |
|-------|-------|
| `--bg-primary` | Main application background |
| `--bg-secondary` | Secondary backgrounds (cards, sidebars) |
| `--bg-tertiary` | Tertiary backgrounds (inputs, hover states) |
| `--surface-card` | Card backgrounds with glass effect |
| `--surface-elevated` | Elevated surfaces (modals, dropdowns) |
| `--glass-bg` | Glass morphism overlay |
| `--glass-border` | Glass morphism borders |

### Text Colors

| Token | Usage |
|-------|-------|
| `--text-primary` | Main text, headings |
| `--text-secondary` | Secondary text, descriptions |
| `--text-muted` | Muted text, placeholders |
| `--text-inverse` | Text on light backgrounds |

---

## Typography

### Font Families

```css
--font-heading: 'Outfit', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
```

### Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 0.75rem (12px) | Captions, labels |
| `--text-sm` | 0.875rem (14px) | Small text, meta |
| `--text-base` | 1rem (16px) | Body text |
| `--text-lg` | 1.125rem (18px) | Large body text |
| `--text-xl` | 1.25rem (20px) | Small headings |
| `--text-2xl` | 1.5rem (24px) | H4 |
| `--text-3xl` | 1.875rem (30px) | H3 |
| `--text-4xl` | 2.25rem (36px) | H2 |
| `--text-5xl` | 3rem (48px) | H1, hero text |

---

## Spacing

Based on a 4px base unit:

| Token | Size | Pixels |
|-------|------|--------|
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-3` | 0.75rem | 12px |
| `--space-4` | 1rem | 16px |
| `--space-5` | 1.25rem | 20px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-10` | 2.5rem | 40px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |
| `--space-20` | 5rem | 80px |

---

## Border Radius

| Token | Size | Usage |
|-------|------|-------|
| `--radius-sm` | 0.25rem (4px) | Small elements |
| `--radius-md` | 0.5rem (8px) | Buttons, inputs |
| `--radius-lg` | 0.75rem (12px) | Cards, modals |
| `--radius-xl` | 1rem (16px) | Large cards |
| `--radius-2xl` | 1.5rem (24px) | Featured elements |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Subtle elevation |
| `--shadow-md` | Medium elevation (cards) |
| `--shadow-lg` | High elevation (dropdowns) |
| `--shadow-xl` | Maximum elevation (modals) |
| `--shadow-glow` | Blue glow for focus/primary |
| `--shadow-glow-gold` | Gold glow for premium |

---

## Transitions

| Token | Duration | Usage |
|-------|----------|-------|
| `--transition-fast` | 150ms | Micro-interactions |
| `--transition-normal` | 250ms | Standard transitions |
| `--transition-slow` | 350ms | Page transitions, animations |

---

## Layout Constants

| Token | Value | Usage |
|-------|-------|-------|
| `--sidebar-width` | 280px | Sidebar width |
| `--navbar-height` | 70px | Navbar height |
| `--max-content-width` | 1200px | Maximum content width |

---

## Component Patterns

### Buttons

```html
<!-- Primary Button -->
<button class="btn btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Secondary Action</button>

<!-- Gold/Premium Button -->
<button class="btn btn-gold">Premium Action</button>

<!-- Size Variants -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Cards

```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Card Title</h3>
    </div>
    <p class="card-description">Card description text...</p>
</div>
```

### Belt Badges

```html
<span class="belt-badge white">White Belt</span>
<span class="belt-badge yellow">Yellow Belt</span>
<span class="belt-badge green">Green Belt</span>
<span class="belt-badge black">Black Belt</span>
<span class="belt-badge master">Master Black Belt</span>
```

### Progress Bar

```html
<div class="progress-bar">
    <div class="progress-bar-fill" style="width: 75%"></div>
</div>
```

---

## Utility Classes

### Text Alignment

- `.text-center` - Center text
- `.text-right` - Right-align text
- `.text-muted` - Muted text color
- `.text-success`, `.text-warning`, `.text-error`, `.text-gold` - Semantic colors

### Flexbox

- `.flex` - Display flex
- `.flex-col` - Flex direction column
- `.items-center` - Align items center
- `.justify-center` - Justify content center
- `.justify-between` - Justify content space between
- `.gap-2`, `.gap-4`, `.gap-6`, `.gap-8` - Gap utilities

### Grid

- `.grid` - Display grid
- `.grid-cols-2`, `.grid-cols-3`, `.grid-cols-4` - Column layouts

### Margin/Padding

- `.mb-2`, `.mb-4`, `.mb-6`, `.mb-8` - Margin bottom
- `.mt-4`, `.mt-8` - Margin top

### Animations

- `.animate-fade-in` - Fade in animation
- `.animate-slide-in` - Slide in animation

---

## Accessibility

### Skip Link

A skip link is provided for keyboard users to bypass navigation:

```html
<a href="#main-content" className="skip-link">
    Skip to main content
</a>
```

### Focus States

All interactive elements have visible focus states. Focus rings use `--shadow-glow` for consistency.

### Color Contrast

All text colors meet WCAG AA contrast requirements against their respective backgrounds.

### Reduced Motion

Users can disable animations via `prefers-reduced-motion` media query. When enabled, all animations and transitions are reduced to near-instant duration:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled or reduced */
}
```

---

## Dark/Light Theme

The application uses a dark theme by default. Light theme can be activated by setting:

```html
<html data-theme="light">
```

Theme variables automatically adjust when the data attribute is set.

---

## Usage Guidelines

1. **Always use design tokens** - Never hardcode colors, sizes, or spacing
2. **Use semantic color names** - `--color-success` instead of `--color-green-belt` for success states
3. **Maintain consistent spacing** - Use spacing tokens for margins and padding
4. **Apply appropriate shadows** - Use elevation consistently to indicate hierarchy
5. **Follow component patterns** - Use established component classes for consistency

---

*Last updated: February 2026*
