# Advanced Snippets

## Duration badge (pre-play overlay)

A custom element injected into the player to show total duration before playback, then faded out on play. The class name (`c-player__duration`) is yours to define.

| Selector                                  | Targets                                                              |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `.video-js .c-player__duration`           | Badge container (position absolute, bottom-right, hidden by default) |
| `@container video (inline-size >= 24rem)` | Show the badge only when the player is wide enough                   |

**Use a `has-played` class on the player element** to hide the badge on play — it's cleaner than DOM removal and reusable for any other pre-play overlays you want to hide at the same time:

```css
@layer {
  .video-js .c-player__duration { display: none !important; }

  @container video (inline-size >= 24rem) {
    .video-js .c-player__duration {
      display: block !important;
      position: absolute !important;
      right: 0.5rem !important;
      bottom: 0.5rem !important;
      /* background, color, padding, border-radius tokens here */
      pointer-events: none !important;
    }

    .video-js.has-played .c-player__duration {
      display: none !important;
    }
  }
}
```

```javascript
function formatDuration(seconds) {
  return Math.floor(seconds / 60) + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");
}

videojs.getPlayer("myPlayer").ready(function () {
  var player = this;
  var playerElement = player.el();

  player.on("loadedmetadata", function () {
    var duration = player.duration();
    if (
      !isFinite(duration) ||
      duration <= 0 ||
      player.hasStarted() ||
      playerElement.querySelector(".c-player__duration")
    ) return;

    var badge = document.createElement("div");
    badge.className = "c-player__duration";
    badge.textContent = formatDuration(duration);
    playerElement.appendChild(badge);
  });

  player.on("play", function () {
    playerElement.classList.add("has-played");
  });
});
```
