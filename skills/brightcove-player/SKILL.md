---
name: brightcove-player
description: Style and fully customize the Brightcove video player UI — control bar, play button, progress bar, volume, captions, playlists, responsive sizing, and skins. Use this skill whenever the user mentions Brightcove, video-js player styling, customizing a Brightcove player, changing player colors/layout/controls, embedding a Brightcove player, making it responsive, player skins or themes, Brightcove Studio styling, or working with Brightcove playlists or captions. Also use it when the user is working with `.video-js`, `vjs-*` CSS classes, or `bc()` / `videojs.getPlayer()` / `videojs()` JavaScript APIs.
---

# Brightcove Player Customization

Brightcove players are built on Video.js. Every visual element is targetable via `.vjs-*` CSS classes. The tricky parts are specificity (the player ships with its own stylesheet) and the iframe vs. in-page embed split (iframe players block inline CSS entirely).

**Always use physical CSS properties** (`width`, `height`, `max-width`, `top`, `left`, etc.) — never logical properties (`inline-size`, `block-size`, `inset-inline-start`, etc.). Video.js itself uses physical properties throughout, and mixing logical properties into overrides creates inconsistency and can cause specificity surprises.

## Player script URL and ID terminology

Brightcove uses three distinct IDs that are easy to confuse:

| Term                 | What it is                                                         | Example               |
| -------------------- | ------------------------------------------------------------------ | --------------------- |
| **Account ID**       | Numeric Brightcove account identifier                              | `1752604059001`       |
| **Player config ID** | The player configuration created in Studio                         | `default` (or a UUID) |
| **HTML element id**  | The `id` attribute on `<video-js>` — used by `videojs.getPlayer()` | `myPlayer`            |

The CDN script URL is built from the **account ID** and **player config ID** — not the HTML element id:

```
https://players.brightcove.net/{account_id}/{player_config_id}_default/index.min.js
```

So if the account is `1752604059001` and the Studio player config is named `default`, the script URL is:

```html
<script src="https://players.brightcove.net/1752604059001/default_default/index.min.js"></script>
```

The `<video-js>` element's `id` attribute (`myPlayer`, `heroPlayer`, etc.) is separate — it's just a DOM handle for `videojs.getPlayer()`:

```html
<video-js
  id="myPlayer" <!-- HTML element id — what getPlayer() uses -->
  data-account="1752604059001" <!-- Brightcove player config ID — used in the script URL -->
  data-player="default"
  data-embed="default"
  data-video-id="4825279519001"
  class="video-js"
  controls
></video-js>
```

When a user says "player id myPlayer", they almost always mean the element id, not a Studio player config named `myPlayer`. If no Brightcove player config ID is specified, default to `data-player="default"` and the `default_default` script URL.

**Demo / preview pages** — when producing a self-contained demo HTML file, always use these known-good values so the player actually loads:

- Account: `1752604059001`
- Player config: `default`
- Video: `4825279519001`
- Script: `https://players.brightcove.net/1752604059001/default_default/index.min.js`

Never leave placeholder text like `ACCOUNT_ID` or `PLAYER_ID` in a demo file — it will produce a blank page with console errors.

---

## Embed type — decide first

| Embed type             | Where CSS lives                                    | JS access |
| ---------------------- | -------------------------------------------------- | --------- |
| **Advanced (in-page)** | `<style>` tag on the page OR Studio stylesheet     | Full      |
| **Standard (iframe)**  | Studio stylesheet only — page `<style>` won't work | Limited   |

For iframe players, upload a CSS file to a public URL and add it in **Studio → Players → Plugins → Stylesheets**, then republish.

For in-page embeds, a `<style>` block on the same page is the fastest approach.

---

## Beating Brightcove's stylesheet

The player's own stylesheet is loaded late and carries high specificity. The recommended approach is to use both techniques together:

**Unnamed cascade layer** — CSS layers declared with a name come before unnamed layers. Putting your overrides in an unnamed `@layer` block makes them beat everything, including Brightcove's injected stylesheet.

**`!important`** — even inside an unnamed layer, add `!important` on every property. Brightcove occasionally injects inline styles at runtime, and only `!important` beats those.

```css
/* Named layers declared first — unnamed layer implicitly ranks above all of them */
@layer config, resets, components;

/* Unnamed layer + !important: covers both the stylesheet and runtime inline styles */
@layer {
  .c-player .video-js .vjs-big-play-button {
    background-color: var(--videojs-play-btn-bg) !important;
  }
}
```

---

## Wrapper element pattern

Wrap `<video-js>` in a container element rather than styling it from the page root. This gives you:

- An easy way to control player width and aspect ratio
- A container query root scoped to the player width (not viewport width)
- A clean specificity bump via class nesting

```html
<div class="c-player">
  <video-js
    id="myPlayer"
    data-video-id="..."
    data-account="..."
    data-player="default"
    data-embed="default"
    class="video-js"
    skin="false"
    controls
  ></video-js>
</div>
```

**Always add `skin="false"`** on the `<video-js>` element when doing a custom skin. It disables Brightcove's default skin stylesheet, giving you a clean baseline with far fewer specificity fights.

```css
.c-player {
  width: 100%;
  max-width: 56rem;
  aspect-ratio: 16 / 9;

  .video-js {
    width: 100% !important;
    height: 100% !important;
    /* Declare a container for container queries scoped to player width */
    container: video / inline-size !important;
  }
}
```

---

## Design tokens

Define all tokens on `:root` (or `.c-player` if scoping tightly). Use `--videojs-*` prefix to keep player tokens distinct from page tokens.

```css
:root {
  --videojs-fg: oklch(10% 0.01 250);
  --videojs-fg-subtle: oklch(45% 0 0 / 0.85);
  --videojs-bg-accent: oklch(49% 0.14 250);
  --videojs-bg-accent-hover: color-mix(
    in oklch,
    var(--videojs-bg-accent),
    black 10%
  );
  --videojs-bg-control: oklch(100% 0 0 / 0.97);
  --videojs-bg-progress-holder: oklch(0% 0 0 / 0.14);
  --videojs-bg-progress-play: oklch(100% 0 0 / 0.12);
  --videojs-border: oklch(80% 0 0 / 0.6);
  --videojs-border-subtle: oklch(80% 0 0 / 0.4);
}
```

Use OKLCH — perceptually uniform, so adjusting lightness for variants is predictable. Use `color-mix(in oklch, var(--base-color), black 10%)` rather than hard-coding separate values.

---

## Light / dark theming

Use the `color-scheme` property and the `light-dark()` CSS function to switch token values based on system preference:

```css
:root {
  color-scheme: light dark; /* enables system preference detection */

  --videojs-bg-accent: light-dark(oklch(49% 0.14 250), oklch(56% 0.16 250));
  --videojs-bg-control: light-dark(
    oklch(100% 0 0 / 0.97),
    oklch(22% 0.064 259 / 0.97)
  );
}

/* Override for explicit theme choice */
:root[data-theme="light"] {
  color-scheme: light;
}
:root[data-theme="dark"] {
  color-scheme: dark;
}
```

**Always initialize `data-theme` from `prefers-color-scheme` on page load** so the explicit toggle starts in sync with the system preference — otherwise users on dark OS get a light flash before JS runs:

```javascript
function setTheme(value) {
  document.documentElement.dataset.theme = value;
  /* update any toggle buttons with aria-pressed here */
}

/* Read system preference and set immediately */
setTheme(
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
);
```

---

## Play button

| Selector                                                      | Targets                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------ |
| `.video-js .vjs-big-play-button`                              | Button container (size, shape, background, border, position) |
| `.video-js .vjs-big-play-button .vjs-icon-placeholder`        | Play icon inside the button                                  |
| `.video-js .vjs-big-play-button .vjs-icon-placeholder:before` | Icon glyph (font-size, color)                                |
| `.video-js:hover .vjs-big-play-button`                        | Button on player hover                                       |
| `.video-js .vjs-big-play-button:hover`                        | Button on direct hover                                       |
| `.video-js .vjs-big-play-button:focus`                        | Button on focus                                              |
| `.video-js.vjs-mouse .vjs-big-play-button`                    | Button during mouse interaction                              |
| `#myPlayerID .vjs-big-play-button`                            | Player-specific override (highest specificity)               |

Centering reliably: use `top: 50%; left: 50%; transform: translate(-50%, -50%)` and `margin: 0` — the default margin-based offset from Video.js doesn't account for custom button sizes.

**Fluid sizing with `clamp()` and `vi` units** — use viewport-inline units so the button scales with the player width rather than staying fixed. Always do this instead of a static rem value:

```css
:root {
  --videojs-big-btn: clamp(2rem, 8vi, 4.5rem);
  --videojs-big-btn-icon-size: clamp(1rem, 6vi, 2rem);
}

.video-js .vjs-big-play-button {
  width: var(--videojs-big-btn) !important;
  height: var(--videojs-big-btn) !important;
  font-size: var(--videojs-big-btn-icon-size) !important;
  line-height: var(--videojs-big-btn) !important;
}
```

Change accessible label text:

```javascript
videojs.getPlayer("myPlayer").ready(function () {
  this.getChild("bigPlayButton").controlText("Watch video");
});
```

---

## Control bar

| Selector                                                             | Targets                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| `.video-js .vjs-control-bar`                                         | Bar container (background, height, padding)                   |
| `.video-js .vjs-control-bar *`                                       | All descendants — useful for resetting `text-shadow` globally |
| `.video-js .vjs-control-bar .vjs-control`                            | Individual control items (color, spacing)                     |
| `.video-js .vjs-control-bar .vjs-button`                             | Button elements                                               |
| `.video-js .vjs-control-bar .vjs-button:hover`                       | Button hover state                                            |
| `.video-js:not(.vjs-has-started) .vjs-control-bar`                   | Bar before playback has started (opacity, pointer-events)     |
| `.video-js.vjs-quality-menu .vjs-quality-menu-button-HD-flag::after` | HD quality badge                                              |

Video.js ships with a `text-shadow` on control icons — reset it explicitly via `.vjs-control-bar, .vjs-control-bar *, .vjs-menu *` if your design doesn't use it.

`backdrop-filter` requires a vendor prefix for Safari — always pair them:

```css
.video-js .vjs-control-bar {
  -webkit-backdrop-filter: blur(12px) !important;
  backdrop-filter: blur(12px) !important;
}
```

Via JS:

```javascript
videojs.getPlayer("myPlayer").ready(function () {
  this.controlBar.hide(); /* or .show() */
});
```

---

## Progress / seek bar

| Selector                                                     | Targets                                                                                                         |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `.video-js .vjs-progress-control`                            | Outer wrapper — set `align-items: flex-end` to anchor the bar to the bottom edge as its hit area grows on hover |
| `.video-js .vjs-progress-holder`                             | Track container (height, transition)                                                                            |
| `.video-js .vjs-progress-control:hover .vjs-progress-holder` | Expanded track height on hover                                                                                  |
| `.video-js .vjs-play-progress`                               | Played portion (color)                                                                                          |
| `.video-js .vjs-play-progress::before`                       | Play head dot (font-size to shrink, top to re-center)                                                           |
| `.video-js .vjs-load-progress`                               | Buffered portion                                                                                                |
| `.video-js .vjs-load-progress div`                           | Buffered sub-segments                                                                                           |
| `.video-js .vjs-slider-bar`                                  | Unplayed track background                                                                                       |
| `.video-js .vjs-progress-holder.vjs-slider`                  | Slider track background                                                                                         |

---

## Volume

| Selector                                                                    | Targets                                                              |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `.video-js .vjs-volume-panel`                                               | Panel wrapper — controls expand/collapse width and transition timing |
| `.video-js .vjs-volume-panel:hover`                                         | Expanded state on hover                                              |
| `.video-js .vjs-volume-panel.vjs-hover`                                     | Expanded via keyboard/focus                                          |
| `.video-js .vjs-volume-panel.vjs-slider-active`                             | Active while scrubbing                                               |
| `.video-js .vjs-volume-control`                                             | Inner slider control (width, visibility transition)                  |
| `.video-js .vjs-volume-control.vjs-volume-control-horizontal`               | Horizontal layout alignment                                          |
| `.video-js .vjs-volume-level`                                               | Filled volume bar (color)                                            |
| `.video-js .vjs-volume-level::before`                                       | Volume thumb dot (color)                                             |
| `.video-js .vjs-volume-bar.vjs-slider-bar.vjs-slider.vjs-slider-horizontal` | Unfilled track (background)                                          |

For the horizontal inline panel, use asymmetric transition delays — open fast (no delay), close with a delay so the cursor can escape without the panel collapsing mid-move.

Switch to vertical volume via JS options:

```javascript
bc("myPlayer", {
  controlBar: {
    volumePanel: { inline: false, vertical: true },
  },
});
```

---

## Time display & tooltip

| Selector                        | Targets                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `.video-js .vjs-time-control`   | Base wrapper (hidden by default; use container query to show at wider widths) |
| `.video-js .vjs-current-time`   | Current time value                                                            |
| `.video-js .vjs-duration`       | Total duration value                                                          |
| `.video-js .vjs-time-divider`   | Separator between current time and duration                                   |
| `.video-js .vjs-remaining-time` | Time remaining (hide when current + duration are both shown)                  |
| `.video-js .vjs-time-tooltip`   | Seek position tooltip that appears on progress bar hover                      |

Container queries require `container: video / inline-size` on `.video-js` (set in the wrapper section above).

---

## Duration badge (pre-play overlay)

A custom element injected into the player to show total duration before playback, then hidden on play. Scope it with `@container video (inline-size >= 24rem)` so it only appears when the player is wide enough. Use a `has-played` class on `.video-js` to hide it on play — cleaner than DOM removal and reusable for any pre-play overlays.

For the full CSS and JS implementation, see `references/snippets.md`.

---

## Dock text (title / description overlay)

The dock text appears at the top of the player. Use `.vjs-dock-text` (not `.vjs-title-bar`) — they coexist but serve different purposes.

| Selector                               | Targets                                          |
| -------------------------------------- | ------------------------------------------------ |
| `.video-js .vjs-dock-text`             | Overlay container (background gradient, padding) |
| `.video-js .vjs-dock-title`            | Title text                                       |
| `.video-js .vjs-dock-description`      | Description text                                 |
| `.video-js .vjs-title-bar`             | Alternative title bar overlay at the top         |
| `.video-js .vjs-title-bar-title`       | Title in the title bar                           |
| `.video-js .vjs-title-bar-description` | Description in the title bar                     |

---

## Popup menus

| Selector                                                       | Targets                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `.video-js .vjs-menu-button-popup .vjs-menu`                   | Menu wrapper                                                       |
| `.video-js .vjs-menu-button-popup .vjs-menu .vjs-menu-content` | Menu content box (background, border, font)                        |
| `.video-js .vjs-menu li.vjs-menu-item`                         | Individual menu items                                              |
| `.video-js .vjs-menu li.vjs-menu-item:hover`                   | Item hover state                                                   |
| `.video-js .vjs-menu li.vjs-menu-item:focus`                   | Item focus state                                                   |
| `.video-js .vjs-menu li.vjs-selected`                          | Currently selected/active item                                     |
| `.video-js .vjs-menu li.vjs-selected:hover`                    | Selected item hover (needs its own rule to avoid being overridden) |

---

## Context menu

The right-click context menu is a separate menu from the popup menus above — it uses `.vjs-contextmenu-ui-menu`. Always theme it alongside the popup menus or it will look unstyled against your custom skin.

| Selector                                     | Targets                      |
| -------------------------------------------- | ---------------------------- |
| `.vjs-contextmenu-ui-menu .vjs-menu-content` | Menu box (background, color) |

```css
@layer {
  .c-player .vjs-contextmenu-ui-menu .vjs-menu-content {
    color: var(--videojs-text) !important;
    background-color: var(--videojs-menu-bg) !important;
  }
}
```

---

## Captions / subtitles

### Adding captions

The CC button only appears when the player has at least one text track. When using `data-video-id`, the player loads its source asynchronously — a `<track>` element inside `<video-js>` is often ignored. Use `addRemoteTextTrack()` on the `loadeddata` event instead.

**Always use the `ensureTrack` pattern** — it handles source changes (multiple `loadeddata` firings) and deduplicates tracks so they aren't added twice. The pattern uses a `captionsReady` guard and calls `addRemoteTextTrack()` on `loadeddata`. For the full implementation (including multi-language support), see `references/captions.md`.

> **Local dev caveat:** browsers block `.vtt` files loaded via `file://`. Serve from a local HTTP server (e.g. `npx serve .`).

### Styling caption text

For caption text selectors, supported/unsupported properties, and Safari caveats, see `references/captions.md`.

---

## Caption settings dialog

The dialog uses `.vjs-text-track-settings` — **not** `.vjs-caption-settings`. For the full selector table, see `references/captions.md`.

---

## Adding a custom element to the control bar

```javascript
videojs.getPlayer("myPlayer").ready(function () {
  var btn = document.createElement("div");
  btn.className = "vjs-control vjs-button my-custom-btn";
  btn.innerHTML = '<span class="vjs-icon-placeholder">★</span>';

  var spacer = document.querySelector(".vjs-spacer");
  spacer.style.justifyContent = "flex-end";
  spacer.appendChild(btn);
});
```

---

## Fullscreen button

| Selector                                                         | Targets                 |
| ---------------------------------------------------------------- | ----------------------- |
| `.video-js .vjs-fullscreen-control`                              | Button (color, display) |
| `.video-js .vjs-fullscreen-control:hover`                        | Button hover state      |
| `.video-js .vjs-fullscreen-control .vjs-icon-placeholder:before` | Button icon glyph       |

To remove it on iOS (native fullscreen is handled by the browser), check `videojs.browser.IS_IOS` inside `.ready()` and remove the `.vjs-fullscreen-control` element from the DOM.

---

## Playlist

| Selector                                      | Targets                                     |
| --------------------------------------------- | ------------------------------------------- |
| `.vjs-mouse.vjs-playlist`                     | Playlist container (background, text color) |
| `.vjs-playlist-item`                          | Individual item                             |
| `.vjs-playlist-item:hover`                    | Item hover state                            |
| `.vjs-playlist-item.vjs-selected`             | Currently playing item                      |
| `.vjs-playlist-vertical`                      | Vertical layout (flex column)               |
| `.vjs-playlist-horizontal`                    | Horizontal layout (flex row, overflow)      |
| `.vjs-playlist .vjs-playlist-thumbnail`       | Thumbnail image                             |
| `.vjs-playlist .vjs-playlist-title-container` | Title area                                  |
| `.vjs-playlist .vjs-playlist-duration`        | Duration badge on each item                 |

---

## Responsive sizing

`aspect-ratio` has universal browser support. The old padding-top intrinsic ratio trick is no longer necessary.

### Option A — wrapper + `aspect-ratio` (recommended)

Use the wrapper element pattern (see above) — it already covers `aspect-ratio`, `width: 100%`, and the `container` declaration needed for container queries.

### Option B — built-in Video.js fluid classes

Add to `<video-js>`:

| Class       | Ratio           |
| ----------- | --------------- |
| `vjs-fluid` | 2.4:1 (default) |
| `vjs-16-9`  | 16:9            |
| `vjs-4-3`   | 4:3             |

Or configure in Studio: **Players → Player Information → Sizing → Responsive**.

---

## Fixed sizing

```html
<video-js width="960" height="540" ...></video-js>
```

Or CSS:

```css
.video-js {
  width: 960px !important;
  height: 540px !important;
}
```

---

## Studio workflow checklist

1. **Players module** → select or create a player
2. **Styling** tab → set colors, skin, and basic appearance via GUI
3. **Plugins → Stylesheets** → add a URL to a hosted CSS file for anything Studio's GUI can't do
4. **Plugins → Scripts** → add a URL to a hosted JS file for runtime customization
5. **Publish & Embed → Publish Changes** — required after any Studio edit

Use the `{PLAYER_CLASS}` selector token only inside Studio-hosted stylesheets (not in page `<style>` tags) — it resolves to the player's generated class at publish time.
