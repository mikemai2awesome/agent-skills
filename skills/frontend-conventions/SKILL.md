---
name: frontend-conventions
description: Define and enforce consistent coding standards across HTML, CSS, and JavaScript. Always use this skill when naming a new class, variable, component, or file; setting up a new project's conventions; choosing a class prefix for a new CSS category; deciding on modifier API names (sizes, shades, hierarchy, breakpoints); or reviewing code for formatting and naming consistency. If you're about to invent a prefix, abbreviation, or modifier name without checking the conventions first, use this skill.
license: MIT
metadata:
  author: mikemai2awesome
  version: "1.0"
---

# Frontend Conventions

A shared system of rules for naming, formatting, and structuring code across HTML, CSS, and JavaScript. Consistency here is what makes a codebase feel like it was written by one person, regardless of team size.

For HTML semantics and accessibility rules, use **frontend-a11y**. For CSS architecture and component structure, use **more-css** or **tiny-css**.

## Code Formatting

### General

| Setting                    | Value  |
| -------------------------- | ------ |
| Indentation                | spaces |
| Tab size                   | 2      |
| Translate tabs to spaces   | Yes    |
| Trim trailing whitespace   | Yes    |
| New line at end of file    | Yes    |

### Quotes by File Type

| File type | Quote style |
| --------- | ----------- |
| `.html`   | `"double"`  |
| `.css`    | `'single'`  |
| `.scss`   | `'single'`  |
| `.js`     | `'single'`  |
| `.json`   | `"double"`  |
| `.yml`    | none in general; `'single'` when forcing a string or using special characters; `"double"` when parsing escape codes |

### Naming Cases

| What you're naming             | Case style                                     |
| ------------------------------ | ---------------------------------------------- |
| HTML attributes and values     | `dash-case`                                    |
| CSS custom property            | `--dash-case`                                  |
| SCSS var / function / mixin    | public: `dash-case` · private: `_dash-case`    |
| JavaScript variable / function | `camelCase`                                    |
| JavaScript class               | `PascalCase`                                   |
| File names                     | `dash-case.extension`                          |

---

## Naming Prefixes

All CSS classes are prefixed by category so their purpose is immediately visible in HTML. For CSS architecture and usage in stylesheets, see **more-css**.

| Category        | Prefix |
| --------------- | ------ |
| Component       | `c-`   |
| Utility         | `u-`   |
| JavaScript hook | `js-`  |

`js-` classes are never styled — they exist solely as selectors for JavaScript behavior.

### Namespacing

When working within a named project or library, prefix everything with a project namespace to prevent collisions:

| Scope             | Namespace |
| ----------------- | --------- |
| Global/custom property | `--namespace-property-name` |
| Scoped/component property | `--prefix-namespace-block-property` |

Examples:
```css
/* Global token */
var(--mmn-color-magenta)

/* Scoped to a component */
var(--c-mmn-card-border-radius)
```

### Frontend Naming Patterns

| Type | Pattern | Example |
| ---- | ------- | ------- |
| HTML custom element | `<namespace-element-name>` | `<mmn-card>` |
| HTML data attribute | `data-namespace-attribute` | `data-mmn-uuid="rng1928"` |
| CSS selector | `class="prefix-namespace-block__element--modifier"` | `class="c-mmn-card__media--video"` |
| JS selector | `class="js-namespace-target"` | `class="js-mmn-card-for-ab-test"` |

---

## Acceptable Abbreviations

Only use abbreviations from this list — everything else is spelled out in full.

| Full word      | Abbreviation |
| -------------- | ------------ |
| Image          | `img`        |
| Background     | `bg`         |
| Minimum        | `min`        |
| Maximum        | `max`        |
| Call to action | `cta`        |
| Column         | `col`        |
| Column span    | `colspan`    |
| Row span       | `rowspan`    |

---

## Modifier API

Use these standardized modifier names so any developer can predict class names without checking documentation.

### Size Scale

`2xs` · `xs` · `sm` · `md` · `lg` · `xl` · `2xl`

```html
<!-- The 2xl heading component -->
<h1 class="c-mmn-heading--2xl">...</h1>
```

### Tints and Shades

`xxlight` · `xlight` · `light` · `medium` · `dark` · `xdark` · `xxdark`

```html
<!-- The xdark magenta utility color -->
<span class="u-mmn-color-magenta-xdark">...</span>
```

### Hierarchy

`primary` · `secondary` · `tertiary`

```html
<!-- The primary button component -->
<button class="c-mmn-button--primary" type="button">...</button>
```

### Responsive Behavior

Apply a utility or modifier at a specific breakpoint using `@from-` and `@until-` suffixes:

| Syntax | Meaning |
| ------ | ------- |
| `behavior@from-[breakpoint]` | Apply from this breakpoint and up |
| `behavior@until-[breakpoint]` | Apply below this breakpoint |

```html
<!-- Full width from the sm breakpoint and beyond -->
<div class="u-mmn-full-width@from-sm">...</div>

<!-- Full width below the sm breakpoint only -->
<div class="u-mmn-full-width@until-sm">...</div>
```

---

## CSS Property Order

Write CSS properties in this order within every rule. Grouping by concern (display → position → size → space → typography → border → background → advanced) makes rules easier to scan and diff.

```css
.selector {
  @extend;
  @include;

  content;

  /* Display */
  display;
  grid;
  grid-*;
  flex;
  flex-*;
  justify-*;
  align-*;
  place-*;
  order;
  box-sizing;
  appearance;
  visibility;
  opacity;

  /* Position */
  position;
  top;
  right;
  bottom;
  left;
  float;
  clear;
  transform;
  z-index;

  /* Size */
  width;
  min-width;
  max-width;
  height;
  min-height;
  max-height;
  overflow;

  /* Space — prefer logical properties (margin-inline, padding-block) */
  margin;
  margin-block;
  margin-block-start;
  margin-block-end;
  margin-inline;
  margin-inline-start;
  margin-inline-end;
  padding;
  padding-block;
  padding-block-start;
  padding-block-end;
  padding-inline;
  padding-inline-start;
  padding-inline-end;

  /* Typography */
  font;
  font-family;
  font-style;
  font-size;
  font-weight;
  font-feature-settings;
  font-variant;
  line-height;
  list-style;
  color;
  text-align;
  text-decoration;
  text-transform;
  text-wrap;
  letter-spacing;
  vertical-align;
  cursor;
  pointer-events;
  user-select;

  /* Border */
  border;
  border-radius;
  border-width;
  border-style;
  border-color;
  border-image;
  box-shadow;
  outline;

  /* Background */
  background;
  background-color;
  background-image;
  background-position;
  background-repeat;
  background-size;
  backdrop-filter;

  /* Advanced */
  filter;
  will-change;
  transition;
  animation;
}
```
