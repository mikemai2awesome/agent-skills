---
name: more-css
description: Write scalable, well-architected CSS using design tokens, cascade layers, and modern organization patterns. Use this skill as the default for any real project — if it has more than a handful of CSS files, multiple components, a team, a design system, or any kind of token or theming setup, this is the right skill.
---

# More CSS

Make intentional decisions about structure, tokens, and tooling so CSS scales across components, themes, teams, and time.

> **No frameworks.** Do not use TailwindCSS, UnoCSS, Bootstrap, or any other CSS framework. Write vanilla CSS only. If a utility layer is needed, build it — don't import it.

## Core Principles

1. **Tokens first** — Define values once as custom properties; reference everywhere
2. **Layer everything** — Use `@layer` to make specificity predictable and override-safe
3. **Name with intent** — Naming conventions exist to communicate, not to decorate
4. **Tooling serves you** — Use a bundler to split files and handle imports; never let tooling substitute for clear CSS architecture
5. **Composition over inheritance** — Build components from tokens and utilities, not from each other
6. **Relative units** — Use relative values for everything except `border-width` and `outline-width`; `px` anywhere else overrides user preferences

## Architecture

### Layer Order

Always declare layers upfront to make load-order explicit:

```css
@layer config, resets, components, utilities, overrides;
```

- **config** — All design tokens as custom properties; no selectors
- **resets** — Normalize browser inconsistencies and element-level defaults (typography, links, form elements)
- **components** — Scoped, self-contained UI pieces
- **utilities** — Single-purpose helpers (`u-visuallyhidden`, `u-truncate`)
- **overrides** — Context-specific tweaks, third-party overrides

### File Structure

Organize files to mirror the layer order:

```
styles/
├── config/
│   ├── color.css        # Color custom properties
│   ├── spacing.css      # Spacing scale
│   ├── typography.css   # Font sizes, weights, families
│   └── index.css        # Imports all config files
├── resets.css
├── components/
│   ├── button.css
│   └── card.css
├── utilities.css
└── main.css             # @import or @layer everything
```

---

## Design Tokens

Use custom properties as your single source of truth. Define them in the `config` layer so every other layer can reference them.

### Use OKLCH for Colors

Define all color tokens in OKLCH. It has a wider gamut than sRGB, perceptually uniform lightness (so `oklch(40% ...)` is always visibly darker than `oklch(60% ...)`), and makes generating hover/muted variants predictable — just adjust the L value.

```css
/* Don't do this — hex values aren't perceptually predictable */
--color-bg-primary: #0066cc;
--color-bg-primary-hover: #0052a3; /* how much darker is this? */

/* Do this — lightness is explicit and adjustable */
--color-bg-primary: oklch(50% 0.2 260);
--color-bg-primary-hover: oklch(43% 0.2 260); /* clearly 7% darker */
```

This also makes dark mode token overrides straightforward — flip lightness, keep chroma and hue.

### Naming Convention

Use a `--[category]-[variant]-[modifier]` pattern. For color tokens, use `text`, `bg`, or `border` as the variant — no other color groupings:

```css
@layer config {
  :root {
    color-scheme: light dark;

    /* Color — text */
    --color-text-default: light-dark(oklch(15% 0 0), oklch(92% 0 0));
    --color-text-muted: light-dark(oklch(45% 0 0), oklch(65% 0 0));
    --color-text-on-primary: oklch(99% 0 0);
    --color-text-primary: oklch(50% 0.2 260);

    /* Color — bg */
    --color-bg-default: light-dark(oklch(98% 0 0), oklch(15% 0 0));
    --color-bg-subtle: light-dark(oklch(95% 0 0), oklch(20% 0 0));
    --color-bg-primary: oklch(50% 0.2 260);
    --color-bg-primary-hover: oklch(43% 0.2 260);

    /* Color — border */
    --color-border-default: light-dark(oklch(80% 0 0), oklch(35% 0 0));
    --color-border-primary: oklch(50% 0.2 260);

    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-12: 3rem;
    --space-16: 4rem;

    /* Typography */
    --font-family: system-ui, sans-serif;
    --font-family-code: ui-monospace, monospace;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-bold: 700;
    --line-height-tight: 1.25;
    --line-height-base: 1.5;

    /* Border */
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 0.75rem;
    --border-width: 1px;

    /* Shadow */
    --shadow-sm: 0 0.0625rem 0.125rem oklch(0% 0 0 / 0.08);
    --shadow-md: 0 0.25rem 0.5rem oklch(0% 0 0 / 0.1);
    --shadow-lg: 0 0.5rem 1.5rem oklch(0% 0 0 / 0.12);

    /* Motion */
    --duration-fast: 150ms;
    --duration-base: 250ms;
    --duration-slow: 400ms;
    --easing-default: ease;
    --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}
```

### Theming with Tokens

Define each theme-aware token once using `light-dark()` and let the browser switch automatically based on `color-scheme`. For user-togglable themes, just flip `color-scheme` — no token values need to be repeated:

```css
@layer config {
  /* User-toggled theme — light-dark() reads color-scheme automatically */
  [data-theme="light"] {
    color-scheme: light;
  }
  [data-theme="dark"] {
    color-scheme: dark;
  }
}
```

---

## Units

### Font Sizes in `rem`, Not `px`

`rem` scales with the user's browser default font size and system text-size preferences. `px` ignores both — a user who sets their browser to 20px large text gets no benefit from your `font-size: 16px` declaration.

```css
/* Don't do this — px overrides the user's preferences */
--font-size-md: 16px;
.c-heading { font-size: 24px; }

/* Do this — rem respects the browser default */
--font-size-md: 1rem;
--font-size-2xl: 1.5rem;
```

All font-size tokens must be in `rem`. Never override them with `px` in components.

#### Fluid Type with `clamp()` and Container Query Units

For headings and display text that should scale with available space, use `clamp()` with a container query unit (`cqi`) as the ideal value. `cqi` is 1% of the container's inline size — it responds to the element's actual container, not the viewport, so type in a narrow card column scales correctly even when the viewport is wide.

`rem` must remain the anchor for the minimum value so the type hierarchy still works when a user zooms to 200%+.

```css
/* Fluid heading: scales between 1.25rem and 3rem based on container width */
h1 {
  font-size: clamp(1.25rem, 5cqi, 3rem);
}
```

`cqi` requires the parent to establish a containment context:

```css
.c-card {
  container-type: inline-size;
}
```

Use `vb` as the fluid value only when no containment context exists and the type genuinely scales with the viewport block axis. For most UI components, `cqi` is the right choice.

### Fluid Values for Layouts

Fluid layouts adapt to available space without hard-coded breakpoints. Prefer intrinsic sizing over media queries — let the content and container determine when things wrap or resize.

Preferred units for layout:

- `%` and `fr` — proportional sizing within grid and flex containers
- `vi` / `vb` / `dvi` / `dvb` — logical viewport units (inline and block axis); prefer these over `vw`/`vh` so layouts work across writing modes and directions
- `ch` — character-width unit; ideal for setting minimum column widths based on readable content width
- `min()`, `max()`, `clamp()` — responsive sizing in a single declaration without a breakpoint
- `rem` — spacing tokens are already in `rem`; use them for gaps and padding

`border-width` and `outline-width` are the only `px` exceptions — hairline borders and focus rings should stay crisp at a fixed thickness regardless of zoom. Everything else (shadows, spacing, radii) uses relative units.

#### Grid: `auto-fit` + `minmax()`

`repeat(auto-fit, minmax())` creates a self-wrapping column grid with no media queries. Columns expand to fill space (`auto-fit`) and wrap when they'd drop below the minimum (`minmax()`).

```css
.c-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(20ch, 1fr));
}
```

Use `ch` for the minimum — it ties the breakpoint to readable content width rather than an arbitrary pixel value. Use a component-scoped custom property to make it overridable per instance:

```css
.c-grid {
  --c-grid-col-min: 20ch;
  grid-template-columns: repeat(auto-fit, minmax(var(--c-grid-col-min), 1fr));
}
```

Use `auto-fill` instead of `auto-fit` when you want empty columns to preserve their space (e.g. keeping a grid locked to N columns even when fewer items are present).

#### Flexbox: Deconstructed Pancake

For flex layouts where items should wrap independently at their own threshold, use `flex: 1 1 <min>`. Each item grows and shrinks freely but won't collapse below the minimum before wrapping.

```css
.c-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.c-list > * {
  flex: 1 1 20ch;
}
```

This allows `ch` units (unlike the flex albatross `calc()` trick) and lets each item wrap independently rather than all items breaking at once.

---

## Naming Conventions

### Component Classes

Use BEM (Block, Element, Modifier) for components — it's verbose but unambiguous at scale:

```css
/* Block */
.c-card {
}

/* Element (part of the block) */
.c-card__header {
}
.c-card__body {
}
.c-card__footer {
}

/* Modifier (variant of block or element) */
.c-card--featured {
}
.c-card__header--compact {
}
```

### Class Prefixes

Use the `c-` prefix for components, `u-` for utilities, and `js-` for JavaScript hooks (never styled).

State classes use `is-` / `has-` (e.g. `.is-loading`, `.has-error`), but prefer ARIA attribute selectors where possible (e.g. `[aria-expanded="true"]`, `[aria-disabled="true"]`).

```html
<div class="c-card c-card--featured js-expandable">
  <div class="c-card__header">...</div>
</div>
```

---

## Component CSS

### Structure

Each component file should follow a consistent internal structure:

```css
@layer components {
  /* 1. Block */
  .c-button {
    /* Layout */
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding-block: var(--space-2);
    padding-inline: var(--space-4);

    /* Typography */
    font-family: var(--font-family);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-tight);

    /* Visual */
    background-color: var(--color-bg-primary);
    color: var(--color-text-on-primary);
    border: var(--border-width) solid transparent;
    border-radius: var(--border-radius-md);

    /* Interaction */
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--easing-default);
  }

  /* 2. States */
  .c-button:hover {
    background-color: var(--color-bg-primary-hover);
  }

  .c-button:focus-visible {
    outline: 2px solid var(--color-border-primary);
    outline-offset: 0.125rem;
  }

  [aria-disabled="true"].c-button,
  .c-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 3. Modifiers */
  .c-button--ghost {
    background-color: transparent;
    border-color: var(--color-border-primary);
    color: var(--color-text-primary);
  }

  .c-button--sm {
    padding-block: var(--space-1);
    padding-inline: var(--space-3);
    font-size: var(--font-size-sm);
  }
}
```

### Only token references inside components

Components reference tokens — they never hardcode values. If you find yourself writing a raw color or a raw value inside a component, define a token for it first. This applies to focus styles too — always reference a token for the outline color so it stays on-brand and themeable.

Use `:focus-visible` (not `:focus`) for keyboard-only focus rings.

---

## Quick Reference

| Situation               | Pattern                                            |
| ----------------------- | -------------------------------------------------- |
| Defining a color value  | Token in `@layer config`                           |
| Building a UI component | `.c-` class in `@layer components`                 |
| One-off helper          | `.u-` class in `@layer utilities`                  |
| JS needs a hook         | `.js-` class, never styled                         |
| Component state         | ARIA attribute selector, then `.is-`/`.has-`       |
| Theming / dark mode     | `light-dark()` in tokens; `color-scheme` to toggle |
| Font sizes              | `rem` tokens only — never `px`                     |
| Layout sizing           | `%`, `fr`, `vi`/`vb`/`dvi`/`dvb`, `min()`/`clamp()`, `rem` — `px` only for `border-width` and `outline-width` |

## References

Read these when you need more detail than the guidelines above:

- [architecture.md](references/architecture.md) - Read when designing the full CSS architecture for a large project, including token systems, file structure, and layer strategies
- [modern-css.md](references/modern-css.md) - Read when you need specifics on modern CSS features, browser support for user preference queries, advanced typography options, or CSS tooling recommendations
