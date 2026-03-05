# Agent Skills

A collection of skills for AI coding agents. Skills are packaged instructions that extend agent capabilities. Skills follow the [Agent Skills](https://code.claude.com/docs/en/skills) format.

All skills here reflect the way Mike Mai codes.

## Available Skills

### frontend-conventions

Establish and enforce consistent coding standards across HTML, CSS, and JavaScript — formatting, naming cases, class prefixes, acceptable abbreviations, modifier APIs (sizes, shades, hierarchy, breakpoints), and CSS property order.

Use when:

- Naming a new class, variable, component, or file
- Setting up a new project's coding conventions
- Choosing a prefix for a new CSS category
- Reviewing code for naming or formatting consistency

### frontend-a11y

Write minimal, accessible HTML, CSS, and JavaScript without over-engineering. Uses native browser elements instead of ARIA-hacking generic divs, component libraries, or focus-trap packages.

Use when:

- Writing any HTML markup
- Building web components or interactive elements (buttons, dialogs, accordions, tabs)
- Creating or reviewing forms
- Reviewing code for accessibility

Pair with **tiny-css** or **more-css** for CSS guidance.

### tiny-css

Write minimal, efficient CSS for small or minimalist projects by trusting the browser instead of fighting it. For anything beyond a personal site or prototype, use **more-css** instead.

Use when:

- Working on a personal site, prototype, or simple landing page
- Setting up base styles without a build system
- Reviewing CSS for unnecessary declarations

### more-css

The default CSS skill for real projects. Write scalable CSS using design tokens (`@layer config`), cascade layers, BEM naming, and preprocessors.

Use when:

- Working on any multi-component or team project
- Setting up a design token system and `config/` layer
- Organizing CSS across many components with `@layer config, resets, components, utilities, overrides`
- Using Sass or PostCSS

### format-storybook

Structure and organize Storybook files for scalability using battle-tested patterns. Covers story files, template files, controls, visual regression testing, and component documentation.

Use when:

- Creating or editing any Storybook story file
- Writing template files with Lit
- Organizing a component library
- Setting up visual regression tests with Chromatic

## Installation

```shell
npx skills add mikemai2awesome/agent-skills
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

## License

MIT
