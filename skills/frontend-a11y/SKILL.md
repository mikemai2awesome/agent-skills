---
name: frontend-a11y
description: Write minimal, accessible HTML, CSS, and JavaScript without over-engineering. Always use this skill when writing any HTML markup, building web components, creating or reviewing forms, adding interactive elements like buttons, dialogs, accordions, or tabs, or reviewing code for accessibility — even when the user doesn't explicitly mention accessibility. If you're about to reach for ARIA attributes, a dialog library, a focus-trap package, or a headless UI component, use this skill first.
license: MIT
metadata:
  author: mikemai2awesome
  version: "1.0"
---

# Frontend A11y

Write as little code as possible. Use native HTML elements that are already accessible instead of adding ARIA attributes to generic elements.

## Core Principles

1. **Trust the browser** — Native elements have built-in accessibility
2. **Semantic over ARIA** — Use the right element, not `role` attributes
3. **Less is more** — Every ARIA attribute you don't write is one less thing to break
4. **Native first** — Use `<dialog>`, `<details>`, `<button>` before reaching for JavaScript

## References

Read these when you need more detail than the guidelines above:

- [standards.md](references/standards.md) - Read when you need to cite WCAG 2.2 criteria, WAI-ARIA specs, or validation tools
- [patterns.md](references/patterns.md) - Read when implementing complex components like carousels, comboboxes, or feed patterns not covered above
- [browser-support.md](references/browser-support.md) - Read when you need to verify browser support for a native HTML element or feature

---

## HTML Guidelines

### Use Native Elements

The browser already provides accessible elements. Use them.

```html
<!-- Don't do this — too much code -->
<div role="button" tabindex="0" onclick="submit()">Submit</div>

<!-- Do this — native button is already accessible -->
<button type="submit">Submit</button>
```

### Don't Add Redundant Roles

Landmark elements already have implicit roles. Don't repeat them.

```html
<!-- Don't do this -->
<header role="banner">...</header>
<nav role="navigation">...</nav>
<main role="main">...</main>
<footer role="contentinfo">...</footer>

<!-- Do nothing — the browser already handles this -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>
```

### Use Semantic Elements Over Divs

Replace generic containers with meaningful elements.

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

### Skip the Title Attribute

The `title` attribute is poorly supported. Only use it on `<iframe>`.

```html
<!-- Don't do this -->
<button title="Submit form">Submit</button>

<!-- Only use title on iframe -->
<iframe src="..." title="Video player"></iframe>
```

---

## Component Patterns

Use native elements that already have the behavior you need.

### Accordion

Use native `<details>` and `<summary>`. No JavaScript needed.

```html
<!-- Don't do this — too much code -->
<div class="accordion">
  <button aria-expanded="false" aria-controls="panel-1">Section</button>
  <div id="panel-1" hidden>Content</div>
</div>

<!-- Do this — zero JavaScript required -->
<details>
  <summary>Section</summary>
  <p>Content</p>
</details>
```

### Modal Dialog

Use native `<dialog>` with `showModal()`. Focus trapping and Escape key handling are built-in.

```html
<!-- Don't do this — requires focus trap JavaScript -->
<div role="dialog" aria-modal="true" aria-labelledby="title">
  <h2 id="title">Title</h2>
  <p>Content</p>
</div>

<!-- Do this — focus trap is automatic -->
<dialog id="my-dialog">
  <h2>Title</h2>
  <p>Content</p>
  <button type="button" onclick="this.closest('dialog').close()">Close</button>
</dialog>

<button
  type="button"
  onclick="document.getElementById('my-dialog').showModal()"
>
  Open dialog
</button>
```

The `showModal()` method automatically:

- Traps focus inside the dialog
- Closes on Escape key
- Adds the `::backdrop` pseudo-element
- Marks content behind as inert

### Navigation

Use `<nav>` with `<button>` and `aria-expanded` for dropdowns.

```html
<nav>
  <ul>
    <li>
      <button aria-expanded="false" aria-controls="submenu">Products</button>
      <ul id="submenu" hidden>
        <li><a href="/product-1">Product 1</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

**Don't use** `role="menu"`, `role="menuitem"`, or `aria-haspopup` for navigation.

### Alert

A single `role="alert"` is all you need.

```html
<div role="alert">Your changes have been saved.</div>
```

### Other Patterns

When native elements aren't enough, follow these APG patterns:

- [Feed Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/examples/feed/) for infinite scroll
- [Combobox with Autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/) for custom selects
- [Switch Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-button/) for toggles
- [Manual Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/) for tabs
- [WAI Carousel Tutorial](https://www.w3.org/WAI/tutorials/carousels/) for carousels

---

## CSS Guidelines

For general CSS best practices (units, logical properties, cascade layers, color spaces), use the appropriate CSS skill alongside this one — **tiny-css** for small or minimalist projects, **more-css** for anything larger. The patterns below are specific to accessibility.

### Use ARIA Attributes as Styling Hooks

Don't create modifier classes when ARIA attributes already exist.

```css
/* Don't do this — extra classes */
.accordion-header--collapsed {
}
.accordion-header--expanded {
}

/* Do this — style the ARIA state */
[aria-expanded="false"] {
}
[aria-expanded="true"] {
}
```

More examples:

```css
[aria-current="page"] {
  font-weight: bold;
}
[aria-disabled="true"] {
  opacity: 0.6;
  cursor: not-allowed;
}
[aria-selected="true"] {
  background-color: highlight;
}
[aria-invalid="true"] {
  border-color: red;
}
```

### Don't Write All Caps in HTML

Use CSS instead so screen readers don't spell out letters.

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

### Create Consistent Focus Outlines

Ensure all interactive elements have visible, high-contrast focus indicators.

```css
*:focus-visible {
  outline: 2px solid;
  outline-offset: 2px;
}
```

### Handle Reduced Transparency

Only apply translucent or glassy effects when the user hasn't requested reduced transparency.

```css
@media (prefers-reduced-transparency: no-preference) {
  .glass-panel {
    background: oklch(100% 0 0 / 0.8);
    backdrop-filter: blur(1rem);
  }
}
```

### Respect Reduced Motion Preferences

Only animate elements when the user hasn't requested reduced motion.

```css
@media (prefers-reduced-motion: no-preference) {
  .animated-element {
    transition: transform 0.3s ease;
  }
}
```

---

## JavaScript Guidelines

- Use vanilla JavaScript only
- Don't use component libraries (Radix, Shadcn)
- Don't use utility frameworks (Tailwind CSS)

---

## Quick Reference

| Instead of                 | Use                       |
| -------------------------- | ------------------------- |
| `<div role="button">`      | `<button>`                |
| `<div role="dialog">`      | `<dialog>`                |
| `<div role="navigation">`  | `<nav>`                   |
| `<div role="banner">`      | `<header>`                |
| `<div role="main">`        | `<main>`                  |
| `<div role="contentinfo">` | `<footer>`                |
| Custom accordion JS        | `<details>` + `<summary>` |
| Focus trap library         | Native `<dialog>`         |
| `.is-expanded` class       | `[aria-expanded="true"]`  |
