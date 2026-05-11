---
name: ios-a11y
description: Implement accessibility in iOS apps using Swift, UIKit, and SwiftUI. Use this skill whenever working on any iOS development task that involves: making UI elements accessible to VoiceOver or other assistive technologies, adding or reviewing accessibility labels/hints/traits/actions/values, supporting Dynamic Type or text scaling, respecting Reduce Motion or reduced transparency preferences, adapting to Dark Mode or increased contrast, building accessible forms and inputs, announcing dynamic content changes, managing focus programmatically, customizing accessibility focus order, supporting external keyboard navigation, or auditing iOS code for accessibility issues. Trigger even when the user only says "SwiftUI" or "UIKit" without mentioning "accessibility" explicitly — if they're building custom controls, modals, forms, lists, or animated views, this skill applies.
---

# iOS Accessibility

iOS provides a rich set of accessibility APIs. Use them to ensure your app works well with VoiceOver, Switch Control, Voice Control, and Keyboard Access — and that it respects user preferences like Dynamic Type, Reduce Motion, and Dark Mode.

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
Button("✕") {
    dismiss()
}
.accessibilityLabel("Close")
.accessibilityHint("Dismisses this sheet")
```

**UIKit:**
```swift
closeButton.accessibilityLabel = "Close"
closeButton.accessibilityHint = "Dismisses this sheet"
```

Don't include the element's role in the label — VoiceOver announces it separately. So "Submit button" is wrong; just "Submit" is right.

### Traits (Role and State)

Traits tell VoiceOver what an element *is* and how to interact with it. UIKit calls them `UIAccessibilityTraits`; SwiftUI uses `AccessibilityTraits`.

**SwiftUI:**
```swift
Text("Recent Orders")
    .accessibilityAddTraits(.isHeader)

Link("Terms of Service", destination: termsURL)
// Link already has the .isLink trait automatically

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

// Remove a trait
disabledButton.accessibilityTraits.remove(.button)
disabledButton.accessibilityTraits.insert(.notEnabled)
```

Common traits: `.button`, `.link`, `.header`, `.image`, `.adjustable`, `.selected`, `.notEnabled`, `.staticText`, `.searchField`, `.tabBar`, `.playsSound`, `.startsMediaSession`

### Value

Use `accessibilityValue` to describe the current state of adjustable or interactive elements — things like sliders, steppers, toggles, or progress indicators.

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

Decorative images, visual dividers, and purely presentational elements should be hidden from assistive technologies so they don't clutter the VoiceOver experience.

**SwiftUI:**
```swift
Image("decorative-background")
    .accessibilityHidden(true)

// For icons that accompany a labeled button
HStack {
    Image(systemName: "trash")
        .accessibilityHidden(true)
    Text("Delete")
}
```

**UIKit:**
```swift
decorativeImageView.isAccessibilityElement = false
separatorView.isAccessibilityElement = false
```

---

## Grouping and Order

### Combining Elements

When multiple views together form one logical unit, combine them so VoiceOver reads them as a single item. This reduces swipe count and makes content easier to understand.

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
// Make the container element accessible and hide children
containerView.isAccessibilityElement = true
containerView.accessibilityLabel = "Highly Rated, 4.8 out of 5"
imageView.isAccessibilityElement = false
titleLabel.isAccessibilityElement = false
subtitleLabel.isAccessibilityElement = false
```

Gotcha when combining: if a child `Button` is combined with `.combine`, its label won't transfer into the combined element. Either remove `.isButton` from the child first, or set `.accessibilityLabel` explicitly on the combined parent.

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

When the default left-to-right, top-to-bottom focus order doesn't match the logical reading order, override it.

**SwiftUI:**
```swift
VStack {
    Text("$29.99")
        .accessibilitySortPriority(2)   // focused first
    Text("Price")
        .accessibilitySortPriority(1)
}
```

**UIKit:**
```swift
// Set accessibilityElements on the container to define order
containerView.accessibilityElements = [titleLabel, priceLabel, addToCartButton]
```

---

## Focus Management

### Announcements

Post announcements to notify users of assistive technologies about important, non-visual changes — a form successfully submitted, an item added to a cart, an error appearing.

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

Wait until the current VoiceOver utterance finishes before posting — or use `UIAccessibility.post(notification: .announcement, argument:)` which queues automatically.

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
// Move focus after a layout or screen change
UIAccessibility.post(notification: .screenChanged, argument: newViewController.view)
UIAccessibility.post(notification: .layoutChanged, argument: specificView)
```

Use `.screenChanged` when the whole screen context changes (navigation push, modal appear). Use `.layoutChanged` for in-place content updates.

### Modals

When presenting a modal or overlay, mark it so VoiceOver doesn't let the user wander into content behind it.

**SwiftUI:**
```swift
// SwiftUI sheets and .fullScreenCover handle this automatically.
// For custom overlays:
ZStack {
    Color.black.opacity(0.4)
        .accessibilityHidden(true)
    VStack { /* modal content */ }
        .accessibilityAddTraits(.isModal)
}
```

**UIKit:**
```swift
modalContainerView.accessibilityViewIsModal = true
UIAccessibility.post(notification: .screenChanged, argument: modalContainerView)
```

For custom SwiftUI overlays, also handle the escape gesture so VoiceOver users can close with a two-finger scrub:
```swift
VStack { /* modal content */ }
    .accessibilityAddTraits(.isModal)
    .accessibilityAction(.escape) { isPresented = false }
```

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
        self?.deleteItem(item)
        return true
    },
    UIAccessibilityCustomAction(name: "Share") { [weak self] _ in
        self?.shareItem(item)
        return true
    }
]
```

---

## Magic Tap

Magic Tap lets VoiceOver users double-tap with two fingers anywhere on screen to toggle the app's most important action — play/pause, answer/end a call, start/stop a recording. Define at most one per screen.

**SwiftUI:**
```swift
ContentView()
    .accessibilityAction(.magicTap) {
        isPlaying.toggle()
    }
// Place on a top-level or root view
```

**UIKit:**
```swift
override func accessibilityPerformMagicTap() -> Bool {
    isPlaying.toggle()
    return true
}
```

---

## Visual Adaptations

### Dynamic Type

Text that doesn't scale with the user's preferred font size is one of the most common iOS accessibility failures. Always use text styles; never hard-code font sizes.

**SwiftUI:**
```swift
// Text() scales automatically with Dynamic Type — no extra code needed
Text("Hello world")         // uses .body by default
    .font(.headline)        // respects user's size preference

// Scale custom dimensions proportionally
@ScaledMetric(relativeTo: .body) var iconSize: CGFloat = 24
Image(systemName: "star")
    .frame(width: iconSize, height: iconSize)
```

**UIKit:**
```swift
label.font = UIFont.preferredFont(forTextStyle: .body)
label.adjustsFontForContentSizeCategory = true

// Never do this:
label.font = UIFont.systemFont(ofSize: 16) // won't scale
```

Never set a fixed height on a view that contains text — use constraints that allow growth. Use `.numberOfLines = 0` on UILabel.

### Large Content Viewer

Elements that intentionally don't scale with Dynamic Type — tab bar icons, toolbar buttons — must support the Large Content Viewer. Users with the largest accessibility text sizes hold a finger on the element to see an enlarged version in the center of the screen.

**SwiftUI:**
```swift
Button {
    composeMessage()
} label: {
    Label("Compose", systemImage: "square.and.pencil")
}
.accessibilityShowsLargeContentViewer()

// Custom content in the viewer:
Image(systemName: "plus")
    .accessibilityShowsLargeContentViewer {
        Label("Add item", systemImage: "plus")
    }
```

**UIKit:**
```swift
button.showsLargeContentViewer = true
button.largeContentTitle = "Compose"
button.largeContentImage = UIImage(systemName: "square.and.pencil")
button.addInteraction(UILargeContentViewerInteraction())
```

### Reduce Motion

Users with vestibular disorders or attention differences may have Reduce Motion enabled. Check this preference before playing animations or transitions.

**SwiftUI:**
```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion

var body: some View {
    Circle()
        .scaleEffect(isAnimating ? 1.2 : 1.0)
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.6), value: isAnimating)
}
```

**UIKit:**
```swift
if UIAccessibility.isReduceMotionEnabled {
    view.alpha = isVisible ? 1 : 0  // instant show/hide
} else {
    UIView.animate(withDuration: 0.4) {
        view.alpha = isVisible ? 1 : 0
    }
}

// Observe changes at runtime
NotificationCenter.default.addObserver(
    self,
    selector: #selector(reduceMotionChanged),
    name: UIAccessibility.reduceMotionStatusDidChangeNotification,
    object: nil
)
```

### Reduce Transparency

Users with visual or vestibular sensitivities may enable Reduce Transparency to remove frosted-glass blurs and low-opacity backgrounds. Replace translucent surfaces with opaque ones.

**SwiftUI:**
```swift
@Environment(\.accessibilityReduceTransparency) var reduceTransparency

RoundedRectangle(cornerRadius: 12)
    .fill(Color.white.opacity(reduceTransparency ? 1.0 : 0.4))
```

**UIKit:**
```swift
if UIAccessibility.isReduceTransparencyEnabled {
    blurView.isHidden = true
    backgroundView.alpha = 1.0
}
```

### Dark Mode

Use semantic colors — they automatically adapt. Only read `colorScheme` when the semantic color API isn't enough (e.g., custom CoreGraphics drawing).

**SwiftUI:**
```swift
// Semantic colors adapt automatically
Text("Hello").foregroundStyle(.primary)
Rectangle().fill(Color(.systemBackground))

// Custom adaptive color
Color(uiColor: UIColor { traitCollection in
    traitCollection.userInterfaceStyle == .dark
        ? UIColor(hex: "#1C1C1E")
        : UIColor(hex: "#F2F2F7")
})

// Read the environment when you need to branch logic
@Environment(\.colorScheme) var colorScheme
```

**UIKit:**
```swift
// Prefer semantic system colors — they work for free
view.backgroundColor = .systemBackground
label.textColor = .label

// Custom adaptive color
let color = UIColor { traits in
    traits.userInterfaceStyle == .dark
        ? UIColor(red: 0.11, green: 0.11, blue: 0.12, alpha: 1)
        : UIColor(red: 0.95, green: 0.95, blue: 0.97, alpha: 1)
}
```

### Increased Contrast

Some users need stronger contrast between UI elements and their backgrounds.

**SwiftUI:**
```swift
@Environment(\.colorSchemeContrast) var colorContrast

var borderColor: Color {
    colorContrast == .increased ? .primary : .secondary
}
```

**UIKit:**
```swift
if UIAccessibility.isDarkerSystemColorsEnabled {
    button.layer.borderColor = UIColor.label.cgColor
    button.layer.borderWidth = 2
}
```

### Bold Text

When the user has Bold Text enabled, your app should respond — especially for text rendered outside of standard UILabel or SwiftUI Text.

**SwiftUI:**
```swift
@Environment(\.legibilityWeight) var legibilityWeight

Text("Title")
    .fontWeight(legibilityWeight == .bold ? .bold : .regular)
```

**UIKit:**
```swift
if UIAccessibility.isBoldTextEnabled {
    label.font = UIFont.boldSystemFont(ofSize: label.font.pointSize)
}
```

Using Dynamic Type text styles handles bold text automatically for standard labels.

### Smart Invert

Smart Invert reverses display colors but skips images, media, and standard controls. Photos, maps, and charts need to opt out explicitly — otherwise they look inverted.

**SwiftUI:**
```swift
Image("productPhoto")
    .accessibilityIgnoresInvertColors()
```

**UIKit:**
```swift
photoImageView.accessibilityIgnoresInvertColors = true
```

Detect the setting when you need to adapt other UI:
```swift
@Environment(\.accessibilityInvertColors) var invertColors  // SwiftUI
UIAccessibility.isInvertColorsEnabled                       // UIKit
```

### Dim Flashing Lights

iOS 17+ exposes a user preference to stop flashing animations. Respect it to avoid triggering seizures or migraines — and ideally avoid flashing content entirely.

**SwiftUI:**
```swift
@Environment(\.accessibilityDimFlashingLights) var dimFlashingLights

Circle()
    .foregroundStyle(dimFlashingLights ? .gray : flashColor)
    .animation(dimFlashingLights ? nil : flashAnimation, value: isFlashing)
```

---

## Input Accessibility

### Labels for Input Fields

Every form field needs a visible label and an `accessibilityLabel`. A placeholder alone is not sufficient — it disappears when the user starts typing.

**SwiftUI:**
```swift
// LabeledContent or VStack with explicit label
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

Voice Control users activate elements by speaking their visible label. When a label is ambiguous, too short, or not naturally speakable, use `accessibilityInputLabels` to provide alternatives. The first entry is what Voice Control displays with "Show Names".

**SwiftUI:**
```swift
Button("→") { nextPage() }
    .accessibilityLabel("Next page")   // VoiceOver reads this
    .accessibilityInputLabels(["Next", "Next page", "Forward"])
    // Voice Control: user can say "Tap Next" or "Tap Forward"
```

### Error Handling

Show the error message visually *and* announce it so VoiceOver users know something is wrong.

**SwiftUI:**
```swift
@State private var emailError: String? = nil

VStack(alignment: .leading) {
    TextField("Email", text: $email)
        .accessibilityLabel("Email")
    if let error = emailError {
        Text(error)
            .foregroundStyle(.red)
            .font(.caption)
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

### Keyboard Type and Content Type

Correct keyboard and content types reduce typing effort for everyone, and enable password managers and autofill for accessibility.

```swift
// SwiftUI
TextField("Phone", text: $phone)
    .keyboardType(.phonePad)
    .textContentType(.telephoneNumber)

SecureField("Password", text: $password)
    .textContentType(.password)

TextField("Username", text: $username)
    .textContentType(.username)
    .autocapitalization(.none)

// UIKit
textField.keyboardType = .phonePad
textField.textContentType = .telephoneNumber
```

### Tap Target Size

Interactive elements must be at least 44×44 points to be reliably tappable, especially for users with motor impairments.

**SwiftUI:**
```swift
// Expand the tappable area without changing visual size
Button("Save") { save() }
    .frame(minWidth: 44, minHeight: 44)
    .contentShape(Rectangle())
```

**UIKit:**
```swift
// Override point(inside:with:) to expand the hit area
override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
    let expanded = bounds.insetBy(dx: -10, dy: -10)
    return expanded.contains(point)
}
```

---

## Screen Structure

### Screen Title

Every screen needs a title. It orients all users, but especially those using VoiceOver who may have just navigated to a new screen and hear it announced.

**SwiftUI:**
```swift
NavigationStack {
    ContentView()
        .navigationTitle("Order History")
}
```

**UIKit:**
```swift
title = "Order History"
// or
navigationItem.title = "Order History"
```

### Section Headers

Mark section headers explicitly so VoiceOver users can jump between sections with the rotor.

**SwiftUI:**
```swift
Text("Recent")
    .font(.headline)
    .accessibilityAddTraits(.isHeader)
```

**UIKit:**
```swift
sectionLabel.accessibilityTraits = .header
```

### Screen Orientation

Support both portrait and landscape unless there's a compelling reason not to. Many users mount their devices in a fixed orientation.

**UIKit:**
```swift
// In AppDelegate or SceneDelegate, return both orientations:
func application(_ application: UIApplication,
    supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
    return .all
}
```

---

## Checking AT State at Runtime

Sometimes you need to adjust behavior when a specific assistive technology is active.

```swift
UIAccessibility.isVoiceOverRunning
UIAccessibility.isSwitchControlRunning
UIAccessibility.isReduceMotionEnabled
UIAccessibility.isDarkerSystemColorsEnabled
UIAccessibility.isBoldTextEnabled
UIAccessibility.isGrayscaleEnabled
UIAccessibility.preferredContentSizeCategory  // current Dynamic Type size
```

Subscribe to changes:
```swift
NotificationCenter.default.addObserver(
    forName: UIAccessibility.voiceOverStatusDidChangeNotification,
    object: nil, queue: .main
) { _ in
    // update UI for VoiceOver
}
```

---

## Testing

### Manual Testing

- **VoiceOver**: Settings → Accessibility → VoiceOver. Navigate core flows without looking at the screen. Every element should have a meaningful label, correct role, and logical focus order.
- **Accessibility Inspector**: Xcode → Open Developer Tool → Accessibility Inspector. Run audits to catch missing labels, small targets, and contrast issues.
- **Dynamic Type**: Settings → Accessibility → Display & Text Size → Larger Text. Drag to the largest accessibility size; verify nothing clips or truncates.
- **Reduce Motion**: Settings → Accessibility → Motion → Reduce Motion.
- **Dark Mode**: Settings → Display & Brightness → Dark.
- **Increased Contrast**: Settings → Accessibility → Display & Text Size → Increase Contrast.
- **Reduce Transparency**: Settings → Accessibility → Display & Text Size → Reduce Transparency.
- **Smart Invert**: Settings → Accessibility → Display & Text Size → Smart Invert. Verify photos and charts are excluded.
- **Voice Control**: Settings → Accessibility → Voice Control. Use "Show Names" to verify every interactive element has a unique, speakable label.

### Automated Testing with XCTest

`performAccessibilityAudit()` (iOS 17+) catches missing labels, small tap targets, contrast failures, and text clipping in one call:

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
    issue.auditType == .contrast  // suppress contrast false positives
}
```

For what the audit misses (duplicate labels, redundant role words, heading traits), write manual assertions:
```swift
XCTAssertFalse(app.buttons["closeButton"].label.isEmpty)
XCTAssertFalse(app.buttons["closeButton"].label.lowercased().contains("button"))
XCTAssertNotEqual(app.buttons["edit1"].label, app.buttons["edit2"].label)
```

Use `.accessibilityIdentifier()` to give UI test targets stable IDs that VoiceOver never reads — don't use it as a substitute for `.accessibilityLabel`:
```swift
Button("✕") { dismiss() }
    .accessibilityLabel("Close")              // VoiceOver reads this
    .accessibilityIdentifier("closeButton")   // XCTest uses this
```

---

## Reference Files

Read these when you need more depth:

- [accessibility-apis.md](references/accessibility-apis.md) — Full reference for less common APIs: live regions, adjustable elements, drag-and-drop accessibility, accessibility language, focus indicators, accessibility notifications, `accessibilityRepresentation` for custom controls, custom VoiceOver Rotor, VoiceOver pronunciation modifiers, `accessibilityRespondsToUserInteraction`
- [visual-adaptations.md](references/visual-adaptations.md) — Text spacing, text truncation prevention, frequent flash rules, reflow, localization, bold text in depth
- [input-patterns.md](references/input-patterns.md) — Input gestures, motion input, cancellation, predictable behavior, timing adjustments, authentication, drag-and-drop alternatives
- [assistive-features.md](references/assistive-features.md) — VoiceOver gestures reference, Switch Control setup, Voice Control commands, Keyboard Access shortcuts
