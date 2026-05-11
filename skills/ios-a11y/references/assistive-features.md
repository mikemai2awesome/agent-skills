# Assistive Features — Reference

Quick reference for iOS assistive technologies. Useful when you need to understand how users will interact with your app, or when testing a specific feature.

---

## VoiceOver

VoiceOver is the built-in screen reader. Available on iPhone, iPad, Apple Watch.

### Turn On/Off

- **Settings** → Accessibility → VoiceOver → toggle
- **Siri**: "Turn on VoiceOver" / "Turn off VoiceOver"
- **Accessibility Shortcut**: Triple-press side button or home button (if configured in Settings → Accessibility → Accessibility Shortcut)

### Core Gestures

| Gesture | Action |
|---|---|
| Single tap | Select and read element |
| Swipe right | Next element |
| Swipe left | Previous element |
| Double tap | Activate selected element |
| Two-finger tap | Pause/resume reading |
| Two-finger swipe up | Read from top |
| Two-finger swipe down | Read from current element |
| Three-finger swipe up/down/left/right | Scroll |
| Four-finger tap top | Go to first element |
| Four-finger tap bottom | Go to last element |
| Two-finger rotate | Adjust rotor |
| Two-finger Z-shape | Dismiss/go back |

### Rotor

The rotor is a virtual dial (two-finger rotate) that lets users jump between specific element types: headings, links, buttons, form fields, etc.

For users to navigate by headings, mark your section labels with `.isHeader` / `.header` trait. For link navigation, use `.link` trait or the `Link` view in SwiftUI.

---

## Switch Control

Switch Control lets users control their device with one or more external switches — especially for people with motor disabilities who can't use a touchscreen.

### Turn On/Off

- **Settings** → Accessibility → Switch Control → toggle
- **Siri**: "Turn on Switch Control"
- **Accessibility Shortcut**: Triple-press side button/home button (if configured)

### How it works

By default, Switch Control auto-scans: it highlights elements or groups sequentially. The user presses their switch to select the highlighted item, then a contextual menu appears with available actions.

Three scan methods:
- **Auto Scan** (single switch): Items are highlighted automatically; switch press selects
- **Manual Scan** (two switches): One switch moves to next element, another selects
- **Step Scan**: Similar to manual, different interaction style

### What this means for developers

- Group related items (using `accessibilityElements` / `.accessibilityElement(children:)`) so Switch Control users can navigate to a group and then drill in, rather than scanning every individual sub-element.
- Provide `accessibilityCustomActions` for multi-step interactions (swipe-to-delete, drag-to-reorder) — Switch Control users cannot perform these gestures directly.
- Ensure all interactive elements are reachable — Switch Control relies on `isAccessibilityElement = true`.

---

## Voice Control

Voice Control lets users control their device by voice. Available on iOS 13+.

### Turn On/Off

- **Settings** → Accessibility → Voice Control → toggle
- **Siri**: "Turn on Voice Control"
- **Accessibility Shortcut**: Triple-press (if configured)
- **Disable by voice**: "Turn off Voice Control"

### How it works

Users speak commands or element names to interact. Voice Control shows numbers over all tappable elements ("Show numbers") or labels ("Show names"). Users say the number or label to tap it.

### What this means for developers

- Every interactive element **must** have a visible label or an `accessibilityLabel`. If a button has only an icon, Voice Control shows a number, but saying the button's name won't work. Give all interactive elements `accessibilityLabel`.
- Labels shown by Voice Control come from `accessibilityLabel` — keep them short, unique, and matching the visible text where possible.
- Don't use images of text — they can't be read as labels.

### Useful Voice Control Commands

```
"Tap [element name]"   — tap an element by its label
"Show numbers"         — display numbers on all interactive elements
"[number]"             — tap the element with that number
"Scroll down/up"       — scroll the page
"Go back"              — navigate back
"Go home"              — home screen
"Show me what to say"  — list available commands for current screen
```

---

## Keyboard Access

Keyboard Access lets users control their device with an external keyboard. Available on iPhone, iPad, iPod.

### Connect a Keyboard

- **Bluetooth**: Settings → Bluetooth → connect keyboard
- **Wired**: via USB-C or Lightning adapter

### Enable Extended Keyboard Features

Settings → Accessibility → Keyboards → Extended Keyboard Features → turn on

### Core Keys

| Key | Action |
|---|---|
| Tab | Next element |
| Shift + Tab | Previous element |
| Arrow keys | Navigate within lists/pickers |
| Space | Activate selected element |
| Escape | Close/go back |

### Important Shortcuts

| Action | Mac keyboard | Windows keyboard |
|---|---|---|
| Switch apps | Cmd + Tab | Win + Tab |
| Search (Spotlight) | Cmd + Space | Win + Space |
| Home screen | Cmd + H | Win + H |
| Screenshot | Cmd + Shift + 3 | Win + Shift + 3 |

### What this means for developers

- All interactive elements must be reachable by Tab. Use `UIFocusGuide` to bridge focus gaps. In SwiftUI, `.focusable()` ensures custom views can receive keyboard focus.
- On iPad, holding Command shows available keyboard shortcuts — implement `keyCommands` in UIKit or `.keyboardShortcut()` in SwiftUI for your most common actions.
- Test navigation with Tab and arrow keys for any form or list in your app.
- Don't rely on gesture-only interactions — everything must also work with keyboard.

---

## AssistiveTouch

AssistiveTouch creates a floating virtual button that can replace hardware buttons and enable custom gestures for users with limited motor ability.

Developers generally don't need to do anything specific for AssistiveTouch — it works with the standard touch event system. However:
- Ensure all interactive elements have sufficient tap target size (44×44pt) — AssistiveTouch users often have imprecise control.
- Avoid requiring pressure-sensitive or Force Touch interactions as the only way to perform an action.

---

## Zoom

iOS Zoom magnifies the entire screen or a portion of it. Users can use full-screen zoom or window zoom.

For developers:
- Zoom interacts with the entire UIKit rendering pipeline — no special code needed.
- Test that your app works correctly when zoomed in (content shouldn't overlap or become inaccessible).
- Avoid placing critical content in the corners — it's harder to reach when zoomed.

---

## Testing Checklist

| Check | How |
|---|---|
| VoiceOver reads all interactive elements | Enable VoiceOver, navigate with swipe |
| Element labels are concise and meaningful | VoiceOver announces them; check for "button button" or empty labels |
| Roles are correct (headers, links, buttons) | Use Accessibility Inspector; swipe through with VoiceOver rotor |
| Focus order is logical | Navigate forward and backward with VoiceOver |
| Dynamic content is announced | Post actions; listen for announcements |
| Dynamic Type scales correctly | Settings → largest accessibility size |
| No truncated text at large size | Inspect visually at largest Dynamic Type |
| Reduce Motion is respected | Settings → Reduce Motion → check animations |
| Dark Mode looks correct | Toggle in Control Center |
| Increased contrast looks correct | Settings → Accessibility → Increase Contrast |
| Tap targets ≥ 44×44pt | Accessibility Inspector → Audit |
| Missing labels caught | Accessibility Inspector → Audit → "No label" warnings |
