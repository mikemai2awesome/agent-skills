---
name: frontend-design-2010s
description: Create web interfaces with an authentic early-2010s aesthetic. Use this skill when the user wants a 2010s-era, Web 2.0, or retro corporate web look — gradient headers, glossy buttons, skeuomorphic icons, horizontal band layouts, and drop shadows from circa 2010–2014.
---

This skill guides the visual aesthetic of early-2010s web interfaces — the genuine design language of the era, not parody. Polished, professional, slightly heavy, and utterly confident in its gradients.

**This skill is responsible for visual design only.** Use scalable vanilla CSS with design tokens (`@layer config`), cascade layers, and BEM naming. Use native HTML elements for accessibility — `<button>`, `<dialog>`, `<details>` — rather than ARIA-hacking divs. Use `dash-case` for HTML attributes, `--dash-case` for CSS custom properties, `camelCase` for JavaScript, and prefix component classes with `c-`, utilities with `u-`, JavaScript hooks with `js-`.

The user provides a component, page, or layout to build. They may include context about the brand, product, or audience.

## Design Thinking

Before building, internalize the era and commit to it fully:

- **Era**: This is 2010–2014 corporate/SaaS web. The world had just discovered HTML5 and was thrilled about it. Flat design hadn't happened yet. Every interface earned its depth through gradients, shadows, and gloss. Embrace all of it — this aesthetic was genuinely considered beautiful and modern at the time.
- **Structure**: Pages are composed of clear horizontal bands stacking top to bottom — header, hero, feature strip, content sections, footer. Each band has a distinct background. Fluid layout — content fills the viewport with generous side padding. Everything is contained and deliberate.
- **Tone**: Confident, professional, slightly corporate but approachable. This era of web design wanted to say: *we are a real business and we built this ourselves.* Headings are loud and bold. CTAs are impossible to miss.
- **Differentiation**: The brand's primary color lives in the header and accents. The CTA color is often a high-energy contrast — the button that demands to be clicked. Every section knows its job and does it without subtlety.

**CRITICAL**: Commit to the era's visual grammar completely. Half-measures produce confusion, not charm. A glossy button needs the gloss. A gradient header needs the gradient. The depth is the point.

Then implement working code (HTML/CSS/JS) that is:
- Production-grade and fully functional
- Visually faithful to the era in every detail
- Cohesive — every element should look like it belongs to the same website
- Complete — the full page, not just a fragment, unless a component is explicitly requested

## Frontend Aesthetics Guidelines

Focus on:

- **Typography**: Headings are bold, uppercase, and condensed — muscular and loud. Pair a heavy display font (Oswald, Bebas Neue, Anton) with a clean humanist sans-serif body (Open Sans, Lato, Source Sans Pro) for readable contrast. Nav and label text is uppercase with generous letter-spacing. Text shadows on large headings add subtle depth. Never write uppercase text in HTML — use `text-transform: uppercase` in CSS so screen readers read it naturally.
- **Color & Chrome**: The brand palette informs the header and accent color, but the chrome — gradients, shadows, gloss — is universal and non-negotiable. Headers are dark and gradient (never flat). Section headings use a bright accent hue. CTA buttons use a saturated action color that contrasts with the header. Backgrounds alternate between white and light gray to delineate sections. Everything feels considered and layered. Define all color tokens in OKLCH — the era's saturated, deep hues translate naturally into OKLCH's perceptually uniform space.
- **Color Contrast**: Non-negotiable. Body text must meet 4.5:1 contrast against its background; large text and headings must meet 3:1. This era's dark headers and saturated accents make it tempting to use muted or mid-tone text — don't. Check every pairing: nav links on gradient headers, subtext on hero sections, any text over accent-colored bands.
- **Depth & Shadows**: Drop shadows appear on navigation, cards, buttons, images, and video players. Nothing floats without grounding. Inputs feel recessed. Buttons feel raised. The visual hierarchy is communicated through depth, not just size.
- **Glossy Buttons**: The signature UI element of this era. CTA buttons have a top-half gloss — a translucent white `::after` overlay covering the top 50% — that makes them feel clickable before you even hover. Rounded corners (small, 3–5px), a slightly darker border, and a drop shadow complete the effect. Never flat, never outlined.
- **Layout & Spatial Composition**: Horizontal bands. Two-column splits for content sections. Three- or four-column feature strips. Symmetry and predictability are virtues here — the era valued clarity over surprise. Product mockups (devices at angles, stacked screenshots) fill right-side hero columns. Icon-heading-body triads populate feature sections. Use CSS Grid and Flexbox — modern layout methods produce the same visual result with far better code.
- **Responsive Navigation**: The nav must collapse to a hamburger menu on small viewports — by 2012–2014 this was standard practice even on "corporate" sites. The hamburger `<button>` should fit the era: small border-radius, a subtle gradient, a drop shadow — not a flat or outline button. Use `aria-expanded` to toggle the mobile menu open/closed. The mobile nav panel (full-width, stacked links) should inherit the header's gradient background. On larger viewports the hamburger hides and the horizontal nav links reappear.
- **Skeuomorphic Details**: Icons suggest real objects — gears, clouds, globes, color wheels — not abstract glyphs. Video players look like video players. Form inputs look inset into the surface. The interface constantly reminds you that it has mass and texture, not just pixels.

NEVER produce flat design — no shadows, no gradients, no depth — that is a different era entirely and breaks the illusion immediately. Avoid thin fonts, outline buttons, and large border radii. This must feel like it was built in 2011.

Adapt the palette to the user's brand — but always maintain the era's structural grammar. When no palette is given, derive one from the product's context: deep slate for enterprise tools, rich navy for finance, dark teal for tech, deep charcoal for developer products. Pair it with a high-energy CTA color that pops.

**IMPORTANT**: The magic of this aesthetic is its sincerity. It was never trying to be ironic. Build it the way a talented 2011 web designer would — with pride, with polish, and with absolute conviction that gradients are good.
