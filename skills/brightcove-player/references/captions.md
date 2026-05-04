# Captions Reference

## Styling caption text

| Selector                            | Targets                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| `.video-js .vjs-text-track-display` | Outer caption container — avoid overriding `top`/`left`, player manages position |
| `.video-js .vjs-text-track-cue`     | Individual caption line (font, color, background)                                |

**Supported properties:** `font-family`, `font-size`, `font-weight`, `color`, `background`, `background-color`, `opacity`, `text-decoration`, `text-shadow`

**Not supported:** `width`, `height`, `line-height`, `white-space`, `top`, `left`, `display`

Safari caveat: native captions ignore WebVTT inline styles — device settings take over.

---

## `ensureTrack` pattern (multi-language captions)

Use this pattern to handle source changes (multiple `loadeddata` firings) and prevent duplicate track injection:

```javascript
const captionsTrackKind = "captions";
const captionsTrackConfigs = [
  { label: "English", srclang: "en", src: "captions-en.vtt", isDefault: true },
  { label: "Chinese", srclang: "zh", src: "captions-zh.vtt" },
];

function getCaptionsTrack(textTracks, trackConfig) {
  for (var i = 0; i < textTracks.length; i++) {
    var t = textTracks[i];
    if (t.kind === captionsTrackKind && t.label === trackConfig.label && t.language === trackConfig.srclang) {
      return t;
    }
  }
  return null;
}

function ensureTrack(player, trackConfig) {
  var existing = getCaptionsTrack(player.textTracks(), trackConfig);
  if (existing) return existing;

  var ref = player.addRemoteTextTrack(
    { kind: captionsTrackKind, src: trackConfig.src, srclang: trackConfig.srclang, label: trackConfig.label, default: Boolean(trackConfig.isDefault) },
    false,
  );
  return (ref && ref.track) || getCaptionsTrack(player.textTracks(), trackConfig);
}

function ensureCaptionsTracks(player) {
  var defaultTrack = null;
  captionsTrackConfigs.forEach(function (config) {
    var track = ensureTrack(player, config);
    if (config.isDefault && track) defaultTrack = track;
  });
  if (!defaultTrack) return false;
  defaultTrack.mode = "showing";
  return true;
}

videojs.getPlayer("myPlayer").ready(function () {
  var player = this;
  var captionsReady = false; /* guard: inject tracks only once even if loadeddata fires multiple times */

  player.on("loadeddata", function () {
    if (captionsReady) return;
    captionsReady = ensureCaptionsTracks(player);
  });
});
```

---

## Caption Settings Dialog

The dialog uses `.vjs-text-track-settings` — **not** `.vjs-caption-settings`.

| Selector                                                 | Targets                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `.vjs-text-track-settings`                               | Dialog container (background, border, border-radius, font)                            |
| `.vjs-text-track-settings legend`                        | Section headings (font, size, color, letter-spacing)                                  |
| `.vjs-text-track-settings label`                         | Form labels                                                                           |
| `.vjs-text-track-settings select`                        | Dropdown inputs — add `-webkit-appearance: none` on macOS or `font-family` is ignored |
| `.vjs-text-track-settings .vjs-modal-dialog-content`     | Inner layout container (flex or grid)                                                 |
| `.vjs-text-track-settings .vjs-track-settings-colors`    | Text / Text Background / Caption Area section                                         |
| `.vjs-text-track-settings .vjs-track-settings-font`      | Font Size / Text Edge Style / Font Family section                                     |
| `.vjs-text-track-settings .vjs-track-settings-controls`  | Button row                                                                            |
| `.vjs-text-track-settings .vjs-done-button`              | Done button                                                                           |
| `.vjs-text-track-settings .vjs-default-button`           | Reset button — **not** `.vjs-reset-button`                                            |
| `.vjs-text-track-settings .vjs-control.vjs-close-button` | Close (×) button                                                                      |
