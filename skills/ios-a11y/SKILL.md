---
name: ios-a11y
description: "Implement accessibility in iOS apps using Swift, UIKit, and SwiftUI. Use this skill whenever working on any iOS development task that involves: making UI elements accessible to VoiceOver or other assistive technologies, adding or reviewing accessibility labels/hints/traits/actions/values, supporting Dynamic Type or text scaling, respecting Reduce Motion or reduced transparency preferences, adapting to Dark Mode or increased contrast, building accessible forms and inputs, announcing dynamic content changes, managing focus programmatically, customizing accessibility focus order, supporting external keyboard navigation, or auditing iOS code for accessibility issues. Trigger even when the user only says \"SwiftUI\" or \"UIKit\" without mentioning \"accessibility\" explicitly — if they're building custom controls, modals, forms, lists, or animated views, this skill applies."
---

# iOS Accessibility

## Core Principles

1. **Semantic over custom** — Use standard UIKit/SwiftUI controls. They come with accessibility built in.
2. **Label everything that matters** — Every interactive element and meaningful image needs an `accessibilityLabel`.
3. **Expose the right role and state** — Use traits to communicate what an element *is* and what state it's in.
4. **Respect user preferences** — Dynamic Type, Reduce Motion, Dark Mode, Bold Text, and increased contrast are signals from the user, not optional polish.
5. **Test with VoiceOver** — Turn it on and use your app without looking. If you can't complete the main flows, something needs fixing.

---

## VoiceOver: Core Attributes

### Label and Hint

The label is what VoiceOver announces when the element is focused. The hint explains what happens when you activate it. Keep labels concise and hints optional — only add a hint when the outcome isn't obvious from the label.

**SwiftUI:**
```swift
Button("✕") { dismiss() }
    .accessibilityLabel("Close")
    .accessibilityHint("Dismisses this sheet")
```

**UIKit:**
```swift
closeButton.accessibilityLabel = "Close"
closeButton.accessibilityHint = "Dismisses this sheet"
```

Don't include the element's role in the label — VoiceOver announces it separately. So "Submit button" is wrong; just "Submit" is right.

*For pronunciation overrides and controlling how VoiceOver speaks individual words, see [accessibility-apis.md](references/accessibility-apis.md).*
### Traits (Role and State)

Traits tell VoiceOver what an element *is* and how to interact with it. UIKit calls them `UIAccessibilityTraits`; SwiftUI uses `AccessibilityTraits`.

**SwiftUI:**
```swift
Text("Recent Orders")
    .accessibilityAddTraits(.isHeader)

Toggle("Dark mode", isOn: $isDarkMode)
// Toggle already has the correct traits

Text("Step 1 of 3")
    .accessibilityAddTraits(.updatesFrequently)
```

**UIKit:**
```swift
sectionLabel.accessibilityTraits = .header
linkButton.accessibilityTraits = .link
toggleSwitch.accessibilityTraits = [.button, .selected] // when on

disabledButton.accessibilityTraits.remove(.button)
disabledButton.accessibilityTraits.insert(.notEnabled)
```

Common traits: `.button` `.link` `.header` `.image` `.adjustable` `.selected` `.notEnabled` `.staticText` `.searchField`

*For the `.adjustable` trait (custom sliders/steppers with increment/decrement actions), `accessibilityRepresentation` for fully custom controls, and `accessibilityRespondsToUserInteraction`, see [accessibility-apis.md](references/accessibility-apis.md).*

### Value

Use `accessibilityValue` to describe the current state of adjustable or interactive elements — sliders, steppers, toggles, or progress indicators.

**SwiftUI:**
```swift
Slider(value: $volume, in: 0...1)
    .accessibilityLabel("Volume")
    .accessibilityValue("\(Int(volume * 100)) percent")
```

**UIKit:**
```swift
volumeSlider.accessibilityLabel = "Volume"
volumeSlider.accessibilityValue = "\(Int(volumeSlider.value * 100)) percent"
```

### Hiding Elements

Decorative images, visual dividers, and purely presentational elements should be hidden from assistive technologies.

**SwiftUI:**
```swift
Image("decorative-background").accessibilityHidden(true)
// For icons paired with a label, hide the icon: Image(...).accessibilityHidden(true)
```

**UIKit:**
```swift
decorativeImageView.isAccessibilityElement = false
separatorView.isAccessibilityElement = false
```

---

## Grouping and Order

### Combining Elements

When multiple views together form one logical unit, combine them so VoiceOver reads them as a single item.

**SwiftUI:**
```swift
HStack {
    Image(systemName: "star.fill")
        .accessibilityHidden(true)
    VStack(alignment: .leading) {
        Text("Highly Rated")
        Text("4.8 out of 5")
    }
}
.accessibilityElement(children: .combine)
// VoiceOver reads: "Highly Rated, 4.8 out of 5"
```

**UIKit:**
```swift
containerView.isAccessibilityElement = true
containerView.accessibilityLabel = "Highly Rated, 4.8 out of 5"
imageView.isAccessibilityElement = false
titleLabel.isAccessibilityElement = false
subtitleLabel.isAccessibilityElement = false
```

Gotcha when combining: if a child `Button` is combined with `.combine`, its label won't transfer. Either remove `.isButton` from the child first, or set `.accessibilityLabel` explicitly on the combined parent.

### Grouping Controls

Use `.contain` (not `.combine`) when you want a group label announced on entry but children to stay individually focusable — the right pattern for form sections, radio groups, and card regions.

**SwiftUI:**
```swift
VStack {
    Text("Shipping address")
    TextField("Street", text: $street)
    TextField("City", text: $city)
}
.accessibilityElement(children: .contain)
.accessibilityLabel("Shipping address")
// VoiceOver announces "Shipping address, group" on entry, then reads each field individually
```

Warning: adding `.accessibilityLabel` to a container *without* `.accessibilityElement(children: .contain)` silently overrides every child element's label — this breaks Voice Control's "Tap [name]" command.

### Custom Ordering

When the default left-to-right, top-to-bottom focus order doesn't match logical reading order, override it.

**SwiftUI:**
```swift
VStack {
    Text("$29.99")
        .accessibilitySortPriority(2)   // focused first
    Text("Price")
        .accessibilitySortPriority(1)
}
```

**UIKit:** Set `accessibilityElements` on the container to define explicit order:
```swift
containerView.accessibilityElements = [titleLabel, priceLabel, addToCartButton]
```

---

## Focus Management

### Announcements

Post announcements to notify users of assistive technologies about important, non-visual changes — a form submitted, an item added to cart, an error appearing.

**SwiftUI / UIKit (both):**
```swift
// iOS 15+
AccessibilityNotification.Announcement("Item added to cart").post()

// All iOS versions
UIAccessibility.post(notification: .announcement, argument: "Item added to cart")
```

When posting from a state change, add a short delay so VoiceOver doesn't skip the announcement:
```swift
.onChange(of: itemAdded) { _ in
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
        AccessibilityNotification.Announcement("Item added to cart").post()
    }
}
```

*For live regions (auto-announcing in-place content updates) and the full notification reference, see [accessibility-apis.md](references/accessibility-apis.md).*

### Moving Focus

When presenting a new view (modal, bottom sheet, inline expansion), move VoiceOver focus to the right element so the user knows something changed.

**SwiftUI:**
```swift
@AccessibilityFocusState private var confirmFocused: Bool

VStack {
    if showConfirmation {
        Text("Order confirmed!")
            .accessibilityFocused($confirmFocused)
    }
}
.onChange(of: showConfirmation) { newValue in
    if newValue { confirmFocused = true }
}
```

**UIKit:**
```swift
UIAccessibility.post(notification: .screenChanged, argument: newViewController.view)
UIAccessibility.post(notification: .layoutChanged, argument: specificView)
```

Use `.screenChanged` when the whole screen context changes; `.layoutChanged` for in-place updates.

### Modals

Mark custom overlays so VoiceOver can't wander into background content. SwiftUI sheets and `.fullScreenCover` handle this automatically.

```swift
// SwiftUI custom overlay — also handle two-finger scrub to dismiss
VStack { /* modal content */ }
    .accessibilityAddTraits(.isModal)
    .accessibilityAction(.escape) { isPresented = false }

// UIKit
modalContainerView.accessibilityViewIsModal = true
UIAccessibility.post(notification: .screenChanged, argument: modalContainerView)
```

*For the escape gesture protocol, custom rotor entries, and focus indicators for Keyboard Access, see [accessibility-apis.md](references/accessibility-apis.md).*

### Keyboard Dismiss Focus

Text fields don't return VoiceOver focus after keyboard dismissal. Use `@AccessibilityFocusState` to send it back explicitly:

```swift
@AccessibilityFocusState private var fieldFocused: Bool

TextField("Name", text: $name)
    .accessibilityFocused($fieldFocused)
    .toolbar {
        ToolbarItem(placement: .keyboard) {
            Button("Done") {
                dismissKeyboard()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    fieldFocused = true
                }
            }
        }
    }
```

---

## Custom Actions

When an element supports multiple actions (swipe to delete, long-press to share, drag to reorder), expose them as accessibility actions so Switch Control and VoiceOver users can access them without the gesture.

**SwiftUI:**
```swift
Text(item.name)
    .accessibilityAction(named: "Delete") { deleteItem(item) }
    .accessibilityAction(named: "Share") { shareItem(item) }
    .accessibilityAction(named: "Move up") { moveItemUp(item) }
```

**UIKit:**
```swift
cell.accessibilityCustomActions = [
    UIAccessibilityCustomAction(name: "Delete") { [weak self] _ in
        self?.deleteItem(item); return true
    }
]
```

*For drag-and-drop accessibility and Switch Control scanning behavior, see [assistive-features.md](references/assistive-features.md).*

---

## Magic Tap

Magic Tap (two-finger double-tap anywhere on screen) toggles the app's primary action — play/pause, answer/end a call. Define at most one per screen. See [accessibility-apis.md](references/accessibility-apis.md) for the implementation.

---

## Visual Adaptations

### Dynamic Type

Text that doesn't scale with the user's preferred font size is one of the most common iOS accessibility failures. Always use text styles; never hard-code font sizes.

**SwiftUI:**
```swift
Text("Hello world")
    .font(.headline)        // respects user's size preference

@ScaledMetric(relativeTo: .body) var iconSize: CGFloat = 24
Image(systemName: "star")
    .frame(width: iconSize, height: iconSize)
```

**UIKit:**
```swift
label.font = UIFont.preferredFont(forTextStyle: .body)
label.adjustsFontForContentSizeCategory = true
// Never: UIFont.systemFont(ofSize: 16)
```

Never set a fixed height on a view that contains text. Use `.numberOfLines = 0` on UILabel.

*For text spacing overrides, preventing truncation at accessibility sizes, reflow layouts, and localization, see [visual-adaptations.md](references/visual-adaptations.md).*

### Reduce Motion

Users with vestibular disorders may have Reduce Motion enabled. Check this before playing animations.

**SwiftUI:**
```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion

Circle()
    .scaleEffect(isAnimating ? 1.2 : 1.0)
    .animation(reduceMotion ? nil : .easeInOut(duration: 0.6), value: isAnimating)
```

**UIKit:**
```swift
if UIAccessibility.isReduceMotionEnabled {
    view.alpha = isVisible ? 1 : 0
} else {
    UIView.animate(withDuration: 0.4) { view.alpha = isVisible ? 1 : 0 }
}
```

*For Large Content Viewer, Reduce Transparency, Dark Mode, Increased Contrast, Bold Text, Smart Invert, Dim Flashing Lights, and audio/media accessibility, see [visual-adaptations.md](references/visual-adaptations.md).*

---

## Input Accessibility

### Labels for Input Fields

Every form field needs a visible label and an `accessibilityLabel`. A placeholder alone is not sufficient — it disappears when the user starts typing.

**SwiftUI:**
```swift
VStack(alignment: .leading) {
    Text("Email address")
        .font(.caption)
    TextField("Email address", text: $email)
        .keyboardType(.emailAddress)
        .textContentType(.emailAddress)
        .accessibilityLabel("Email address")
}
```

**UIKit:**
```swift
emailTextField.placeholder = "Email address"
emailTextField.accessibilityLabel = "Email address"
emailTextField.keyboardType = .emailAddress
emailTextField.textContentType = .emailAddress
```

### Voice Control Labels

Voice Control users activate elements by speaking their visible label. When a label is ambiguous or not naturally speakable, use `accessibilityInputLabels` to provide alternatives.

```swift
Button("→") { nextPage() }
    .accessibilityLabel("Next page")
    .accessibilityInputLabels(["Next", "Next page", "Forward"])
```

*For how Voice Control's "Show Names" and "Show Numbers" modes work, and how to verify your UI, see [assistive-features.md](references/assistive-features.md).*

### Error Handling

Show the error message visually *and* announce it so VoiceOver users know something is wrong.

**SwiftUI:**
```swift
VStack(alignment: .leading) {
    TextField("Email", text: $email)
        .accessibilityLabel("Email")
    if let error = emailError {
        Text(error).foregroundStyle(.red).font(.caption)
    }
}
.onChange(of: emailError) { newError in
    if let error = newError {
        AccessibilityNotification.Announcement(error).post()
    }
}
```

**UIKit:**
```swift
func showError(_ message: String) {
    errorLabel.text = message
    errorLabel.isHidden = false
    UIAccessibility.post(notification: .announcement, argument: message)
}
```

*For keyboard type and content type, tap target sizing, timing adjustments, and accessible authentication, see [input-patterns.md](references/input-patterns.md).*

---

## Screen Structure

### Screen Title

Every screen needs a title — it orients all users, especially VoiceOver users navigating to a new screen.

**SwiftUI:** `NavigationStack { ContentView().navigationTitle("Order History") }`

**UIKit:** `navigationItem.title = "Order History"`

### Section Headers

Mark section headers so VoiceOver users can jump between sections with the rotor.

**SwiftUI:** `Text("Recent").font(.headline).accessibilityAddTraits(.isHeader)`

**UIKit:** `sectionLabel.accessibilityTraits = .header`

*For screen orientation support, see [visual-adaptations.md](references/visual-adaptations.md).*

---

## Checking AT State at Runtime

```swift
UIAccessibility.isVoiceOverRunning
UIAccessibility.isSwitchControlRunning
UIAccessibility.isReduceMotionEnabled
UIAccessibility.isDarkerSystemColorsEnabled
UIAccessibility.isBoldTextEnabled
UIAccessibility.isGrayscaleEnabled
UIAccessibility.preferredContentSizeCategory  // current Dynamic Type size
```

*For subscribing to runtime change notifications, see [accessibility-apis.md](references/accessibility-apis.md).*

---

## Testing

### Manual Testing

- **VoiceOver**: Navigate core flows without looking at the screen. Every element should have a meaningful label, correct role, and logical focus order.
- **Accessibility Inspector**: Xcode → Open Developer Tool → Accessibility Inspector. Run audits for missing labels, small targets, and contrast issues.
- **Dynamic Type**: Test at the largest accessibility size; verify nothing clips or truncates.
- **Voice Control**: Settings → Accessibility → Voice Control. Use "Show Names" to verify every interactive element has a unique, speakable label.

*For a full testing checklist and how to enable/use VoiceOver, Switch Control, Voice Control, and Keyboard Access, see [assistive-features.md](references/assistive-features.md).*

### Automated Testing with XCTest

`performAccessibilityAudit()` (iOS 17+) catches missing labels, small tap targets, contrast failures, and text clipping:

```swift
func testMyScreen() throws {
    let app = XCUIApplication()
    app.launch()
    navigateToMyScreen(app)
    try app.performAccessibilityAudit()
    app.swipeUp()  // audit below-fold content too
    try app.performAccessibilityAudit()
}
```

Filter known false positives:
```swift
try app.performAccessibilityAudit { issue in
    issue.auditType == .contrast
}
```

Write manual assertions for what the audit misses (duplicate labels, redundant role words, heading traits):
```swift
// XCTest IDs go in .accessibilityIdentifier() — VoiceOver never reads them
XCTAssertFalse(app.buttons["closeButton"].label.isEmpty)
XCTAssertFalse(app.buttons["closeButton"].label.lowercased().contains("button"))
XCTAssertNotEqual(app.buttons["edit1"].label, app.buttons["edit2"].label)
```
