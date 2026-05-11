# Accessibility APIs — Extended Reference

## Live Regions

When content updates in-place (a count changes, a status updates, a message appears), post a layout changed notification so VoiceOver announces it without the user needing to navigate to it.

**SwiftUI:**
```swift
// The most reliable approach in SwiftUI is posting a UIAccessibility notification
.onChange(of: cartCount) { count in
    UIAccessibility.post(notification: .announcement, argument: "\(count) items in cart")
}
```

**UIKit:**
```swift
// Update label text, then notify
cartCountLabel.text = "\(count) items"
UIAccessibility.post(notification: .layoutChanged, argument: cartCountLabel)
```

Use `.layoutChanged` when updating in-place content. Use `.screenChanged` when the entire screen context changes.

---

## Adjustable Elements

For custom sliders, pickers, or rating controls, implement the adjustable trait so VoiceOver users can swipe up/down to adjust the value.

**SwiftUI:**
```swift
StarRatingView(rating: $rating)
    .accessibilityLabel("Rating")
    .accessibilityValue("\(rating) out of 5 stars")
    .accessibilityAdjustableAction { direction in
        switch direction {
        case .increment: rating = min(5, rating + 1)
        case .decrement: rating = max(0, rating - 1)
        @unknown default: break
        }
    }
```

**UIKit:**
```swift
class StarRatingView: UIView {
    var rating: Int = 0

    override var accessibilityTraits: UIAccessibilityTraits {
        get { .adjustable }
        set { super.accessibilityTraits = newValue }
    }

    override var accessibilityValue: String? {
        get { "\(rating) out of 5 stars" }
        set { }
    }

    override func accessibilityIncrement() {
        rating = min(5, rating + 1)
    }

    override func accessibilityDecrement() {
        rating = max(0, rating - 1)
    }
}
```

---

## Accessibility Language

When an element contains text in a language different from the app's current locale, specify the language so VoiceOver pronounces it correctly.

**UIKit:**
```swift
foreignLabel.accessibilityLanguage = "fr-FR"
foreignLabel.accessibilityLabel = "Bonjour"
```

**SwiftUI:**
There's no direct `.accessibilityLanguage()` modifier, but you can use environment locale for sub-trees:
```swift
Text("Bonjour le monde")
    .environment(\.locale, Locale(identifier: "fr-FR"))
```

---

## Focus Indicator (Keyboard Access)

For users navigating with an external keyboard, iOS draws a default focus ring. Don't suppress it. If you need a custom appearance, use `UIFocusEffect`:

**UIKit:**
```swift
override var preferredFocusEnvironments: [UIFocusEnvironment] {
    return [preferredView]
}
```

For SwiftUI's focus ring behavior, rely on the system defaults — customizing it is generally not needed or recommended.

---

## Drag and Drop — Accessibility

For drag-and-drop interactions, provide accessibility custom actions as an alternative so Switch Control and keyboard users can accomplish the same task.

**SwiftUI:**
```swift
ForEach(items) { item in
    ItemRow(item: item)
        .accessibilityAction(named: "Move up") {
            moveItem(item, direction: .up)
        }
        .accessibilityAction(named: "Move down") {
            moveItem(item, direction: .down)
        }
}
```

**UIKit:**
```swift
cell.accessibilityCustomActions = [
    UIAccessibilityCustomAction(name: "Move up") { [weak self] _ in
        self?.moveItem(at: indexPath, direction: .up)
        return true
    },
    UIAccessibilityCustomAction(name: "Move down") { [weak self] _ in
        self?.moveItem(at: indexPath, direction: .down)
        return true
    }
]
```

---

## Link Accessibility

Links should use the `.link` trait so VoiceOver users can use the rotor to navigate links on the page.

**SwiftUI:**
```swift
// Link automatically has the .isLink trait
Link("Privacy Policy", destination: privacyURL)

// For custom styled links:
Button("Privacy Policy") { openPrivacyPolicy() }
    .accessibilityAddTraits(.isLink)
```

**UIKit:**
```swift
linkButton.accessibilityTraits = .link
linkButton.accessibilityLabel = "Privacy Policy"
```

For attributed strings with tappable links:
```swift
// NSAttributedString with .link attribute is automatically accessible in UITextView
let attrStr = NSMutableAttributedString(string: "Read our Privacy Policy")
attrStr.addAttribute(.link, value: privacyURL, range: NSRange(location: 14, length: 14))
textView.attributedText = attrStr
textView.isEditable = false
```

---

## Notification Names Reference

| Notification | When to use |
|---|---|
| `.announcement` | Speak text aloud to the user |
| `.screenChanged` | Entire screen/context changed (navigation, modal appear) |
| `.layoutChanged` | Part of screen updated (new element appeared, list changed) |
| `.pageScrolled` | Screen paged/scrolled significantly |

```swift
// All take an optional `argument`:
// - .announcement: String to read aloud
// - .screenChanged/.layoutChanged: UIView or UIAccessibilityElement to focus
UIAccessibility.post(notification: .screenChanged, argument: firstInteractiveView)
```

---

## Accessibility Notifications (Runtime Changes)

Subscribe to accessibility setting changes to update your UI in real time:

```swift
// VoiceOver
NotificationCenter.default.addObserver(
    forName: UIAccessibility.voiceOverStatusDidChangeNotification,
    object: nil, queue: .main) { _ in ... }

// Reduce Motion
NotificationCenter.default.addObserver(
    forName: UIAccessibility.reduceMotionStatusDidChangeNotification,
    object: nil, queue: .main) { _ in ... }

// Bold Text
NotificationCenter.default.addObserver(
    forName: UIAccessibility.boldTextStatusDidChangeNotification,
    object: nil, queue: .main) { _ in ... }

// Dynamic Type size
NotificationCenter.default.addObserver(
    forName: UIContentSizeCategory.didChangeNotification,
    object: nil, queue: .main) { _ in ... }

// Invert Colors
NotificationCenter.default.addObserver(
    forName: UIAccessibility.invertColorsStatusDidChangeNotification,
    object: nil, queue: .main) { _ in ... }
```

---

## Accessibility Frame (Hit Area Expansion)

When an element's visual frame is smaller than its recommended 44×44pt tap target, expand its accessible hit area:

**UIKit:**
```swift
// Option 1: override accessibilityFrame
override var accessibilityFrame: CGRect {
    return UIAccessibility.convertToScreenCoordinates(
        bounds.insetBy(dx: -10, dy: -10),
        in: self
    )
}

// Option 2: override point(inside:with:) for touch
override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
    return bounds.insetBy(dx: -12, dy: -12).contains(point)
}
```

---

## Escape Gesture

VoiceOver's escape gesture (two-finger scrub) should dismiss modals and navigate back. UIKit navigation controllers handle this automatically. For custom modals, implement the protocol:

**UIKit:**
```swift
override func accessibilityPerformEscape() -> Bool {
    dismiss(animated: true)
    return true
}
```

---

## Linting for Accessibility

Use `SwiftLint` with accessibility rules enabled to catch common issues automatically. Add to your `.swiftlint.yml`:

```yaml
opt_in_rules:
  - accessibility_label_for_image
  - accessibility_trait_for_button
```

Also run **Xcode's Accessibility Inspector** (Xcode → Open Developer Tool → Accessibility Inspector) → Audit to scan for missing labels, small targets, and contrast failures.

---

## Accessibility Representation

For custom controls that can't be made accessible through standard modifiers alone, use `.accessibilityRepresentation` to overlay a hidden native control that provides the correct accessibility behavior. VoiceOver interacts with the native control instead of the custom view.

**SwiftUI:**
```swift
// Custom toggle that looks different from the native Toggle
CustomToggleView(isOn: $isOn)
    .accessibilityRepresentation {
        Toggle("Dark mode", isOn: $isOn)
    }
// VoiceOver sees a native Toggle with all its built-in traits and behavior
```

This is particularly useful for custom sliders, steppers, and rating controls where you want precise visual control but need correct accessibility behavior without reimplementing it yourself.

---

## Custom VoiceOver Rotor

Create a custom rotor entry so VoiceOver users can jump between specific elements using the rotor (two-finger rotate, then swipe up/down).

**SwiftUI:**
```swift
// Let users navigate between error fields via the rotor
var body: some View {
    Form { /* fields */ }
        .accessibilityRotor("Errors") {
            ForEach(errorFields) { field in
                AccessibilityRotorEntry(field.label, id: field.id)
            }
        }
}
```

```swift
// Navigate to specific text ranges within a Text view
Text(articleContent)
    .accessibilityRotor("Headings") {
        ForEach(headingRanges) { heading in
            AccessibilityRotorEntry(heading.title, textRange: heading.range)
        }
    }
```

Built-in rotor categories (use these before creating custom ones): `.headings`, `.links`, `.buttons`, `.images`, `.textFields`, `.tables`, `.lists`, `.landmarks`.

---

## VoiceOver Pronunciation

Control how VoiceOver speaks specific text:

**SwiftUI:**
```swift
// Speak every punctuation character (useful for code snippets)
Text("print(\"Hello, world!\")")
    .speechAlwaysIncludesPunctuation()

// Spell out characters individually (useful for abbreviations or acronyms
// that VoiceOver incorrectly merges into a word)
Text("SKU")
    .speechSpellsOutCharacters()

// Adjust pitch for emphasis or spoken quotes
var attributed = AttributedString("Warning: file will be deleted")
attributed[attributed.range(of: "Warning")!].accessibilitySpeechAdjustedPitch = 0.7
Text(attributed)
```

Note: `.accessibilityLanguage()` doesn't exist in SwiftUI. For per-view locale, use `.environment(\.locale, Locale(identifier: "fr-FR"))` to affect pronunciation for a sub-tree.

---

## accessibilityRespondsToUserInteraction

Controls whether an element participates in the focus order for Switch Control, Voice Control, and Full Keyboard Access. Use sparingly — prefer making elements properly focusable or hidden rather than toggling this.

**SwiftUI:**
```swift
// Make a custom non-interactive element respond to interaction
decorativeButton
    .accessibilityRespondsToUserInteraction(false)  // remove from focus order

// Make a non-standard interactive element focusable
customGestureView
    .accessibilityRespondsToUserInteraction(true)
```
