---
name: frontend-design-2010s
description: Create web interfaces with an authentic early-2010s aesthetic (roughly 2010–2014) — the polished corporate and SaaS look with gradient headers, glossy buttons, skeuomorphic icons, horizontal band layouts, and drop shadows. Use this skill whenever the user asks for a 2010s, 2011-era, 2012-era, Web 2.0, retro corporate, or "old glossy website" look, or references the time when the first iPhones were new, even if they never name the era exactly. Do not use it for modern flat, minimal, or current-day SaaS design.
---

This skill guides the visual aesthetic of early-2010s web interfaces — the genuine design language of the era, not parody. Polished, professional, slightly heavy, and utterly confident in its gradients.

The user provides a component, page, or layout to build. They may include context about the brand, product, or audience.

## Design Thinking

Before building, internalize the era and commit to it fully:

- **Era**: This is 2010–2014 corporate and SaaS web. Flat design had not happened yet. Every interface earned its depth through gradients, shadows, and gloss. Aim for the confident middle of the era, not the earlier Web 2.0 novelty of badges, starbursts, and reflections. Embrace the era's polish — this look was genuinely considered beautiful and modern at the time.
- **Structure**: Pages are composed of clear horizontal bands stacking top to bottom — header, hero, feature strip, content sections, footer. Each band has a distinct background. Content fills the viewport with generous side padding. Everything is contained and deliberate.
- **Tone**: Confident, professional, slightly corporate but approachable. This era of web design wanted to say: *we are a real business and we built this ourselves.* Headings are loud and bold. Calls to action are impossible to miss.
- **Differentiation**: The brand's primary color lives in the header and accents. The action color is often a high-energy contrast — the button that demands to be clicked. Every section knows its job and does it without subtlety.

**CRITICAL**: Commit to the era's visual grammar completely. Half-measures produce confusion, not charm. A glossy button needs the gloss. A gradient header needs the gradient. The depth is the point.

Then deliver working code that is:
- Production-grade and fully functional
- Visually faithful to the era in every detail
- Cohesive — every element should look like it belongs to the same website
- Complete — the full page, not just a fragment, unless a component is explicitly requested

## Working With Other Skills

This skill decides how the interface looks. It does not decide how the code is written. When the project already uses skills or conventions for code architecture, naming, or accessibility, follow them in full and apply the era's look through them. Do not drop good engineering practice to get the aesthetic, and do not water down the aesthetic to fit tidy code. The two goals do not conflict.

## Frontend Aesthetics Guidelines

Focus on:

- **Typography**: Headings are bold, uppercase, and condensed — muscular and loud. Pair a heavy display face with a clean humanist sans-serif body for readable contrast. Navigation and label text is uppercase with generous letter spacing. Large headings carry a subtle shadow for depth. Uppercase is a visual treatment, not content: keep the source text in normal case so screen readers read it naturally.
- **Color and Chrome**: The brand palette informs the header and accent color, but the chrome — gradients, shadows, gloss — is universal and non-negotiable. Headers are dark and gradient, never flat. Section headings use a bright accent hue. Primary action buttons use a saturated color that contrasts with the header. Backgrounds alternate between white and light gray to delineate sections. Everything feels considered and layered. The era's saturated, deep hues should look rich, not neon.
- **Color Contrast**: Non-negotiable. Body text must meet 4.5:1 contrast against its background. Large text and headings must meet 3:1. This era's dark headers and saturated accents make it tempting to use muted or mid-tone text — don't. Check every pairing: nav links on gradient headers, subtext on hero sections, any text over accent-colored bands.
- **Depth and Shadows**: Shadows appear on navigation, cards, buttons, images, and video players. Nothing floats without grounding. Inputs feel recessed. Buttons feel raised. The visual hierarchy is communicated through depth, not just size.
- **Glossy Buttons**: The signature element of this era. Primary buttons have a bright, translucent highlight across their top half, over a slightly darker lower half, so they feel clickable before you hover. Corners are small and slightly rounded, with a darker edge and a grounding shadow. Pressed states look physically pushed in. Never flat, never outlined.
- **Layout and Spatial Composition**: Horizontal bands. Two-column splits for content sections. Three- or four-column feature strips. Symmetry and predictability are virtues here — the era valued clarity over surprise. Product mockups (devices at angles, stacked screenshots) fill the right side of hero areas. Icon, heading, and body triads populate feature sections. Layouts must still adapt to small screens, as responsive design was mainstream by 2012.
- **Navigation on Small Screens**: Navigation collapses behind a menu control on small viewports. The control matches the era: small corners, a subtle gradient, a shadow — not a flat or outlined button. The open panel inherits the header's gradient and stacks its links. The control tells assistive technology whether the menu is open or closed. On larger viewports, the full horizontal navigation returns.
- **Skeuomorphic Details**: Icons suggest real objects — gears, clouds, globes, color wheels — not abstract glyphs. Render them as filled, colorful, softly dimensional pictures, never as thin outline icons. Video players look like video players. Form inputs look inset into the surface. The interface constantly reminds you that it has mass and texture, not just pixels.

## Where Sincerity Breaks

The look works only when it is earnest. These tip it into parody, so avoid them: scrolling banners, hit counters, "under construction" badges, rainbow dividers, novelty fonts, cartoon mascots, and bevels so heavy that text becomes hard to read. Gloss and depth are applied with a steady hand and the same restraint across every element.

NEVER produce flat design — no shadows, no gradients, no depth — that is a different era entirely and breaks the illusion immediately. Avoid thin fonts, outline buttons, and large corner radii. This must feel like it was built in 2011.

## Palette

Adapt the palette to the user's brand, but always keep the era's structural grammar. When no palette is given, derive one from the product's context: deep slate for enterprise tools, rich navy for finance, dark teal for tech, deep charcoal for developer products. Pair it with a high-energy action color that pops.

**IMPORTANT**: The magic of this aesthetic is its sincerity. It was never trying to be ironic. Build it the way a talented 2011 web designer would — with pride, with polish, and with absolute conviction that gradients are good.
