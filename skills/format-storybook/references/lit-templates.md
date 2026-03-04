# Lit Template Resources

## Lit Documentation

### Lit
https://lit.dev/

Official Lit documentation. Lightweight library for building web components.

### lit-html
https://lit.dev/docs/libraries/standalone-templates/

Standalone templating library for rendering HTML. Use for Storybook templates.

### Template Syntax
https://lit.dev/docs/templates/overview/

Guide for writing Lit templates with expressions and bindings.

## Directives

### classMap
https://lit.dev/docs/templates/directives/#classmap

Apply conditional classes based on object properties. Use for dynamic class names.

```javascript
import { classMap } from 'lit/directives/class-map.js';

classMap({
  'button': true,
  'button--primary': isPrimary,
  'button--disabled': isDisabled
})
```

### styleMap
https://lit.dev/docs/templates/directives/#stylemap

Apply inline styles from object. Use for dynamic CSS properties.

```javascript
import { styleMap } from 'lit/directives/style-map.js';

styleMap({
  color: textColor,
  backgroundColor: bgColor
})
```

### ifDefined
https://lit.dev/docs/templates/directives/#ifdefined

Only render attribute when value is defined. Use for optional attributes.

```javascript
import { ifDefined } from 'lit/directives/if-defined.js';

html`<button aria-label=${ifDefined(label)}>`
```

### when
https://lit.dev/docs/templates/directives/#when

Conditionally render one of two templates. Use for if/else rendering.

```javascript
import { when } from 'lit/directives/when.js';

when(condition, () => html`<div>True</div>`, () => html`<div>False</div>`)
```

### repeat
https://lit.dev/docs/templates/directives/#repeat

Efficiently render lists with keys. Use for dynamic lists.

```javascript
import { repeat } from 'lit/directives/repeat.js';

repeat(items, (item) => item.id, (item) => html`<li>${item.name}</li>`)
```

## Installation

```bash
npm install lit
```

## Browser Support

Lit works in all modern browsers. For older browsers, use polyfills:

https://lit.dev/docs/tools/requirements/
