# CSS Architecture References

## Cascade Layers

### MDN: @layer
https://developer.mozilla.org/en-US/docs/Web/CSS/@layer

Comprehensive documentation on the `@layer` at-rule, including layer ordering, anonymous layers, and import syntax.

### CSS Tricks: A Complete Guide to CSS Cascade Layers
https://css-tricks.com/css-cascade-layers/

In-depth guide covering layer creation, ordering, nesting, and how layers interact with specificity and `!important`.

## Design Tokens

### Design Tokens Community Group
https://design-tokens.github.io/community-group/format-spec/

The W3C Design Tokens specification. Reference for naming, types, and structure when building a token system.

### Style Dictionary
https://styledictionary.io/

A tool for transforming and distributing design tokens across platforms (CSS, iOS, Android). Reference when tokens need to be shared across multiple output targets.

## Naming Conventions

### BEM (Block Element Modifier)
https://getbem.com/naming/

Official BEM naming documentation. Reference for component class naming rules and examples.

### CUBE CSS
https://cube.fyi/

A CSS methodology oriented towards simplicity, pragmatism, and consistency. Alternative to BEM that aligns well with cascade layers.

## Layout Patterns

### Every Layout
https://every-layout.dev/

A series of robust, composable CSS layout primitives (Stack, Cluster, Grid, Center, etc.) with explanations of the underlying layout theory. The source for the layout patterns in this skill.

### MDN: CSS Grid Layout
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

Reference for CSS Grid. Use for complex two-dimensional layouts within the `patterns` layer.

### MDN: CSS Flexible Box Layout
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout

Reference for Flexbox. Use for one-dimensional layouts and component internals.

## Custom Properties

### MDN: Using CSS custom properties
https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

Full guide to CSS custom properties including inheritance, fallback values, and JavaScript access.

### MDN: @property
https://developer.mozilla.org/en-US/docs/Web/CSS/@property

Register custom properties with a type, inheritance behavior, and initial value. Useful for animatable tokens.
