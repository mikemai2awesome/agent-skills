---
name: tiny-a11y
description: Write minimal, accessible HTML, CSS, and JavaScript. Use when building web components, writing HTML markup, creating forms, or reviewing code for accessibility.
license: MIT
metadata:
  author: mikemai2awesome
  version: "1.0"
---

# Tiny A11y

Write as little code as possible. Use native HTML elements that are already accessible instead of adding ARIA attributes to generic elements.

## Core Principles

1. **Trust the browser** — Native elements have built-in accessibility
2. **Semantic over ARIA** — Use the right element, not `role` attributes
3. **Less is more** — Every ARIA attribute you don't write is one less thing to break
4. **Native first** — Use `<dialog>`, `<details>`, `<button>` before reaching for JavaScript

## References

- Use [WCAG 2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/) for accessibility guidance
- Use [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) for ARIA attributes
- Use [APG Gherkin](https://github.com/AFixt/apg-gherkin) for component test cases

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

### Use Focus-Visible

Only show focus rings when needed.

```css
/* Don't do this — shows ring on click */
button:focus {
  outline: 2px solid;
}

/* Do this — only shows ring for keyboard users */
button:focus-visible {
  outline: 2px solid;
  outline-offset: 2px;
}
```

### Respect Motion Preferences

Only animate when the user allows it.

```css
@media (prefers-reduced-motion: no-preference) {
  .animated {
    transition: transform 0.3s ease;
  }
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
