---
name: a11y
description: Write accessible HTML and CSS following WCAG 2.2 AA standards. Use when building web components, writing HTML markup, creating forms, adding ARIA attributes, or when the user asks about accessibility.
license: MIT
metadata:
  author: mikemai2awesome
  version: "1.0"
---

# A11y Rules

Vibe code responsibly and accessibly. Write semantic HTML, lightweight CSS, and vanilla JavaScript that meets WCAG 2.2 AA standards.

## Core Principles

1. **Accessibility first** — All code should meet WCAG 2.2 standards
2. **Semantic HTML** — Use meaningful elements that convey structure and purpose
3. **Lightweight CSS** — Modern CSS with cascade layers, logical properties, and motion preferences
4. **Responsive design** — Use relative units and fluid layouts
5. **Progressive enhancement** — Build with vanilla JavaScript and focus on core functionality

## References

- Use [WCAG 2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/) for accessibility guidance
- Use [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) for ARIA attributes
- Use [APG Gherkin](https://github.com/AFixt/apg-gherkin) for component test cases
- Use [Design Tokens](https://designtokens.fyi/) for design systems terminology

## Implementation Priority

1. Semantic HTML structure
2. Accessible markup and ARIA attributes (only when semantic HTML is not enough)
3. CSS architecture with proper layering
4. Responsive, relative units
5. Progressive enhancement with JavaScript
6. Accessibility testing and validation

---

## HTML Standards

### Use Semantic Elements

Use meaningful HTML elements instead of generic `<div>` and `<span>` without context.

```html
<!-- Don't do this -->
<div class="header">
  <div class="nav">...</div>
</div>

<!-- Do this -->
<header>
  <nav>...</nav>
</header>
```

### Avoid Redundant Roles

Don't add redundant role attributes to landmark elements.

```html
<!-- Don't do this -->
<header role="banner">...</header>
<nav role="navigation">...</nav>
<main role="main">...</main>
<footer role="contentinfo">...</footer>

<!-- Do this -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>
```

### Use Semantic HTML Before ARIA

Only use ARIA when semantic HTML cannot achieve the desired accessibility.

```html
<!-- Don't do this -->
<div role="button" tabindex="0">Submit</div>

<!-- Do this -->
<button type="submit">Submit</button>
```

### Don't Use Title Attribute

Avoid the `title` attribute except on `<iframe>` elements.

```html
<!-- Don't do this -->
<button title="Submit form">Submit</button>

<!-- Do this on iframe -->
<iframe src="..." title="Video player"></iframe>
```

---

## Component Patterns

Follow these established patterns when building accessible components.

### Accordion

Use native `<details>` and `<summary>` elements.

```html
<details>
  <summary>Section title</summary>
  <p>Expandable content goes here.</p>
</details>
```

### Modal Dialog

Use native `<dialog>` element.

```html
<dialog id="my-dialog">
  <h2>Dialog title</h2>
  <p>Dialog content.</p>
  <button type="button">Close</button>
</dialog>
```

### Navigation

Use `<nav>` with `<button>` and `aria-expanded` for multi-level navigation.

```html
<nav>
  <ul>
    <li>
      <button aria-expanded="false" aria-controls="submenu-1">Products</button>
      <ul id="submenu-1" hidden>
        <li><a href="/product-1">Product 1</a></li>
        <li><a href="/product-2">Product 2</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

**Don't use** `role="menu"`, `role="menuitem"`, or `aria-haspopup` for navigation.

### Alert

Follow [Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/examples/alert/).

```html
<div role="alert">
  Your changes have been saved.
</div>
```

### Feed (Infinite Scroll)

Follow [Feed Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/examples/feed/).

### Combobox / Custom Select

Follow [Combobox with Autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/).

### Switch

Follow [Switch Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-button/).

### Tabs

Follow [Manual Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/).

### Carousel

Follow [WAI Carousel Tutorial](https://www.w3.org/WAI/tutorials/carousels/).

---

## CSS Standards

### Use OKLCH for Colors

```css
:root {
  --color-primary: oklch(50% 0.2 260);
  --color-surface: oklch(98% 0 0);
}
```

### Use Relative Units

Use `rem`, `em`, `%`, `vw`, `vh` instead of `px`, except for borders.

```css
/* Don't do this */
.card {
  padding: 16px;
  font-size: 14px;
}

/* Do this */
.card {
  padding: 1rem;
  font-size: 0.875rem;
}
```

### Use Logical Properties

Support all languages and writing directions.

```css
/* Don't do this */
.card {
  margin-left: 1rem;
  padding-top: 2rem;
  width: 20rem;
}

/* Do this */
.card {
  margin-inline-start: 1rem;
  padding-block-start: 2rem;
  inline-size: 20rem;
}
```

### Use Cascade Layers

Organize CSS with cascade layers.

```css
@layer config, resets, components, utilities;

@layer config {
  :root {
    --color-primary: oklch(50% 0.2 260);
  }
}

@layer resets {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

@layer components {
  .c-button { /* component styles */ }
}

@layer utilities {
  .u-visually-hidden { /* utility styles */ }
}
```

### Class Naming Prefixes

- `c-` for component classes
- `u-` for utility classes
- `js-` for JavaScript selectors

```css
.c-card { /* component */ }
.u-text-center { /* utility */ }
```

```html
<div class="c-card js-accordion">...</div>
```

### Use Focus-Visible

Use `:focus-visible` instead of `:focus`.

```css
/* Don't do this */
button:focus {
  outline: 2px solid blue;
}

/* Do this */
button:focus-visible {
  outline: 2px solid blue;
}
```

### Respect Motion Preferences

Wrap transitions and animations in reduced motion media query.

```css
@media (prefers-reduced-motion: no-preference) {
  .animated {
    transition: transform 0.3s ease;
  }
}
```

### Don't Write All Caps in HTML

Use CSS `text-transform` instead.

```html
<!-- Don't do this -->
<span>SUBMIT</span>

<!-- Do this -->
<span class="u-uppercase">Submit</span>
```

```css
.u-uppercase {
  text-transform: uppercase;
}
```

### Use Autoprefixer

Use [Autoprefixer](https://github.com/postcss/autoprefixer) for vendor prefix management instead of writing prefixes manually.

---

## JavaScript Standards

- Use vanilla JavaScript only (no frameworks or libraries)
- Don't use Radix or Shadcn
- Don't use Tailwind CSS

---

## Response Guidelines

When providing recommendations:

- Prioritize web development resources and best practices
- Reference modern and accessible web technologies
- Provide clear and concise explanations
- Avoid deprecated or outdated technologies
- Emphasize accessibility and user-friendly design
