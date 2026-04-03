# Agent Skills

A collection of skills for AI coding agents. Skills are packaged instructions that extend agent capabilities. Skills follow the [Agent Skills](https://code.claude.com/docs/en/skills) format.

All skills here reflect the way Mike Mai codes.

## Installation

Note: `npx skills` is a convevnient way to install but if you want to install specifically for Claude Code, drop the files into the `.claude/skills` folder.

### YOLO

Install all skills at once so you code exactly like Mike:

```shell
npx skills add mikemai2awesome/agent-skills
```

### Real Projects

These three compliment each other and work best together:

```shell
npx skills add mikemai2awesome/agent-skills --skill more-css
npx skills add mikemai2awesome/agent-skills --skill frontend-conventions
npx skills add mikemai2awesome/agent-skills --skill frontend-a11y
```

### Small or Personal Projects

These two make up a super minimal setup:

```shell
npx skills add mikemai2awesome/agent-skills --skill tiny-css
npx skills add mikemai2awesome/agent-skills --skill frontend-a11y
```

### Back In Time

`frontend-design-2010s` works in tandem with the real projects trio — install all four together:

```shell
npx skills add mikemai2awesome/agent-skills --skill more-css
npx skills add mikemai2awesome/agent-skills --skill frontend-conventions
npx skills add mikemai2awesome/agent-skills --skill frontend-a11y
npx skills add mikemai2awesome/agent-skills --skill frontend-design-2010s
```

### Well-Structured Docs

`format-storybook` is standalone and can be added if your project involves Storybook:

```shell
npx skills add mikemai2awesome/agent-skills --skill format-storybook
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected. They are also triggered mannually through `/` command.

## Available Skills

- **tiny-css:** Write minimal, efficient CSS for small or minimalist projects by trusting the browser instead of fighting it.
- **more-css:** The default CSS skill for real projects. Write scalable vanilla CSS using design tokens (`@layer config`), cascade layers, BEM naming, `light-dark()` for theming, OKLCH colors, and relative units (`rem`, `cqi`, `clamp()`). No frameworks, no Sass.
- **frontend-conventions:** Establish and enforce consistent coding standards across HTML, CSS, and JavaScript — formatting, naming cases, class prefixes, acceptable abbreviations, modifier APIs (sizes, shades, hierarchy, breakpoints), and CSS property order.
- **frontend-a11y:** Write minimal, accessible HTML, CSS, and JavaScript without over-engineering. Uses native browser elements instead of ARIA-hacking generic divs, component libraries, or focus-trap packages.
- **frontend-design-2010s:** Recreate the authentic early-2010s corporate/SaaS web aesthetic — gradient headers, glossy CTA buttons, skeuomorphic icons, horizontal band layouts, and drop shadows. Produces fluid, complete pages that feel genuinely built in 2011, not like a modern design mimicking it.
- **format-storybook:** Structure and organize Storybook files for scalability using battle-tested patterns from Cassondra Roberts. Covers story files, template files, controls, visual regression testing, and component documentation.

## Accessibility

[Accessibility Commitment](ACCESSIBILITY.md)

## License

MIT
