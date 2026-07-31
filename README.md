<img width="1280" height="672" alt="the phrase 'agent skills' set in the typeface Big Caslon. black text on crimson red background." src="https://github.com/user-attachments/assets/9881727c-8178-4701-b346-6f67f0a95ba0" />

# Agent Skills

A collection of skills for AI coding agents. Skills are packaged instructions that extend agent capabilities. Skills follow the [Agent Skills](https://code.claude.com/docs/en/skills) format.

All skills here reflect the way Mike Mai codes.

> **Before you install:** Agent skills should evolve over time and be tailored specifically to your projects. When you use these skills, treat them as a starting point. Bring them into your project and customize to fit your own tech stack. As your project grows, keep evolving the skills.

## Installation

Note: `npx skills` is a convenient way to install but if you want to install specifically for Claude Code, drop the files into the `.claude/skills` folder.

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

### Branded Video Player

`brightcove-player` is standalone for projects that use the Brightcove video player:

```shell
npx skills add mikemai2awesome/agent-skills --skill brightcove-player
```

### How Do You Like Them Apples

`ios-a11y` is standalone for iOS projects using Swift, UIKit, or SwiftUI:

```shell
npx skills add mikemai2awesome/agent-skills --skill ios-a11y
```

### Play Devil's Advocate

`socratic-provocateur` is standalone and only runs when you explicitly invoke it:

```shell
npx skills add mikemai2awesome/agent-skills --skill socratic-provocateur
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected. They are also triggered manually through `/` command.

## Available Skills

- **tiny-css:** Write minimal, efficient CSS for small or minimalist projects by trusting the browser instead of fighting it.
- **more-css:** The default CSS skill for real projects. Write scalable vanilla CSS using design tokens (`@layer config`), cascade layers, BEM naming, `light-dark()` for theming, OKLCH colors, and relative units (`rem`, `cqi`, `clamp()`). No frameworks, no Sass.
- **frontend-design-2010s:** Recreate the authentic early-2010s corporate/SaaS web aesthetic — gradient headers, glossy CTA buttons, skeuomorphic icons, horizontal band layouts, and drop shadows. Produces fluid, complete pages that feel genuinely built in 2011, not like a modern design mimicking it.
- **frontend-conventions:** Establish and enforce consistent coding standards across HTML, CSS, and JavaScript — formatting, naming cases, class prefixes, acceptable abbreviations, modifier APIs (sizes, shades, hierarchy, breakpoints), and CSS property order.
- **frontend-a11y:** Write minimal, accessible HTML, CSS, and JavaScript without over-engineering. Uses native browser elements instead of ARIA-hacking generic divs, component libraries, or focus-trap packages.
- **ios-a11y:** Implement accessibility in iOS apps using Swift, UIKit, and SwiftUI — VoiceOver labels/hints/traits/actions, Dynamic Type, Reduce Motion, Dark Mode, focus management, custom rotors, Voice Control, Switch Control, and XCTest audits. Based on [Appt Docs](https://appt.org/en/docs) and [CVS SwiftUI Accessibility](https://github.com/cvs-health/ios-swiftui-accessibility-techniques).
- **brightcove-player:** Style and fully customize the Brightcove video player UI — control bar, play button, progress bar, volume, captions, playlists, responsive sizing, and skins. Works with `.vjs-*` CSS classes, in-page and iframe embeds, and the `bc()` / `videojs` JavaScript APIs.
- **format-storybook:** Structure and organize Storybook files for scalability using battle-tested patterns from Cassondra Roberts. Covers story files, template files, controls, visual regression testing, and component documentation. Based on "[A Storybook format that scales with you](https://allons-y.llc/posts/2025-10-31/)" by Cassondra Roberts.
- **socratic-provocateur:** Challenge the user's code, architecture, or debugging reasoning using the Socratic method — pointed, open-ended questions that expose unexamined assumptions instead of handing over fixes or verdicts. Only runs when explicitly invoked (e.g. "poke holes in this," "play devil's advocate on this design").

## Accessibility

[Accessibility Commitment](ACCESSIBILITY.md)

## License

MIT
