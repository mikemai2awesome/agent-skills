# Preprocessor References

## Sass

### Official Documentation
https://sass-lang.com/documentation/

Full Sass reference. Use the modern `@use`/`@forward` module system — not the legacy `@import`.

### Sass Modules (@use and @forward)
https://sass-lang.com/documentation/at-rules/use/
https://sass-lang.com/documentation/at-rules/forward/

The modern Sass module system. `@use` loads a module into scope; `@forward` re-exports it. Prefer this over `@import` for all new projects.

### Sass Maps
https://sass-lang.com/documentation/values/maps/

Key/value structures in Sass. Useful for generating token scales (spacing, font sizes, breakpoints) programmatically.

### Sass Mixins
https://sass-lang.com/documentation/at-rules/mixin/

Reusable blocks of CSS. Use sparingly — prefer CSS custom properties for values and `@layer` for organization.

## PostCSS

### Official Documentation
https://postcss.org/

PostCSS is a tool for transforming CSS with JavaScript plugins. It's not a preprocessor by itself — it's a platform for plugins.

### postcss-preset-env
https://preset-env.cssdb.org/

Polyfills modern CSS features based on a target browser list. Use to write future CSS today (nesting, `:has()`, custom media queries).

### postcss-import
https://github.com/postcss/postcss-import

Resolves `@import` statements and inlines them at build time. Use to compose CSS from multiple files without a bundler.

### postcss-custom-media
https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media

Enables `@custom-media` for named breakpoints:

```css
@custom-media --viewport-sm (min-width: 36em);
@custom-media --viewport-md (min-width: 48em);

@media (--viewport-md) {
  .c-card { flex-direction: row; }
}
```

## Lightningcss

### Official Documentation
https://lightningcss.dev/

A fast CSS parser and transformer written in Rust. Handles vendor prefixes, modern CSS transforms, and minification. Good alternative to PostCSS for build pipelines that prioritize speed.

## Build Tool Integration

### Vite CSS Docs
https://vite.dev/guide/features#css

Vite natively handles CSS imports, CSS Modules, PostCSS, and Sass. Reference when configuring a Vite-based project.

### webpack CSS Loaders
https://webpack.js.org/loaders/css-loader/

Reference for configuring `css-loader`, `style-loader`, and `mini-css-extract-plugin` in a webpack project.
