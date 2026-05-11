# Visual Adaptations — Extended Reference

## Text Spacing

Your layouts must accommodate increased line height, letter spacing, word spacing, and paragraph spacing. Don't use fixed-height containers for text.

**UIKit — avoid breaking text with fixed heights:**
```swift
// Wrong — clips text when spacing increases
label.frame = CGRect(x: 0, y: 0, width: 300, height: 20)

// Right — grows with content
label.numberOfLines = 0
label.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    label.topAnchor.constraint(equalTo: container.topAnchor, constant: 8),
    label.leadingAnchor.constraint(equalTo: container.leadingAnchor, constant: 16),
    label.trailingAnchor.constraint(equalTo: container.trailingAnchor, constant: -16),
    label.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -8)
])
```

**SwiftUI:** Text and VStack/HStack grow automatically — avoid `.frame(height: fixedValue)` on views that contain text.

---

## Text Truncation

Text should never be truncated in any Dynamic Type size. Test at the largest accessibility text size.

**UIKit:**
```swift
label.numberOfLines = 0              // allow unlimited lines
label.lineBreakMode = .byWordWrapping

// For scrollable areas, let content scroll instead of truncating
scrollView.addSubview(label)
```

**SwiftUI:**
```swift
Text(longContent)
    .fixedSize(horizontal: false, vertical: true)  // expands vertically

// Wrap in ScrollView if needed
ScrollView {
    Text(longContent)
}
```

If truncation is unavoidable (table cells in tight spaces), ensure the full text is available via `accessibilityLabel`:
```swift
label.accessibilityLabel = fullText
```

---

## Reflow

At the largest text size, a two-column layout may need to become single-column. Detect the content size category and adjust layout accordingly.

**SwiftUI:**
```swift
@Environment(\.sizeCategory) var sizeCategory

var isLargeText: Bool {
    sizeCategory >= .accessibilityMedium
}

var body: some View {
    Group {
        if isLargeText {
            VStack { contentViews }
        } else {
            HStack { contentViews }
        }
    }
}
```

**UIKit:**
```swift
override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
    super.traitCollectionDidChange(previousTraitCollection)
    updateLayoutForContentSizeCategory()
}

func updateLayoutForContentSizeCategory() {
    let isAccessibilitySize = traitCollection.preferredContentSizeCategory.isAccessibilityCategory
    stackView.axis = isAccessibilitySize ? .vertical : .horizontal
}
```

---

## Contrast

Text needs at least 4.5:1 contrast against its background (3:1 for large text ≥18pt or bold ≥14pt). UI components like buttons and form fields need 3:1.

Use semantic system colors — they're designed to meet contrast requirements:
- `.label` / `.secondaryLabel` / `.tertiaryLabel`
- `.systemBackground` / `.secondarySystemBackground`
- `.systemFill` / `.secondarySystemFill`

When using custom colors, verify with [WWCAG Contrast Checker](https://webaim.org/resources/contrastchecker/) or Xcode's Accessibility Inspector.

For users who have **Increase Contrast** enabled, prefer stronger borders, higher contrast text, and avoid pure transparency:

**SwiftUI:**
```swift
@Environment(\.colorSchemeContrast) var contrast

var separatorColor: Color {
    contrast == .increased ? Color(.separator) : Color(.separator).opacity(0.5)
}
```

**UIKit:**
```swift
if UIAccessibility.isDarkerSystemColorsEnabled {
    view.layer.borderColor = UIColor.label.cgColor
    view.layer.borderWidth = 1
    view.backgroundColor = .systemBackground
}
```

---

## Grayscale / Differentiate Without Color

Don't rely on color alone to convey meaning. When a user enables **Differentiate Without Color** or **Grayscale**, your UI must still communicate status.

**SwiftUI:**
```swift
@Environment(\.accessibilityDifferentiateWithoutColor) var differentiateWithoutColor

HStack {
    if differentiateWithoutColor {
        Image(systemName: status == .error ? "xmark.circle" : "checkmark.circle")
    }
    Text(statusMessage)
        .foregroundStyle(status == .error ? .red : .green)
}
```

**UIKit:**
```swift
if UIAccessibility.shouldDifferentiateWithoutColor {
    iconImageView.image = UIImage(systemName: isError ? "xmark.circle" : "checkmark.circle")
    iconImageView.isHidden = false
}
```

---

## Frequent Flashes

Content that flashes more than 3 times per second can trigger seizures in users with photosensitive epilepsy. This applies to any animation, video, or UI element.

The rule: no element should flash more than 3 times in any 1-second window.

If you have animated content that may violate this, gate it behind the Reduce Motion check — or simply remove the flashing behavior.

---

## Screen Orientation

Support both portrait and landscape by default. Some users mount their device in a fixed orientation for physical or accessibility reasons.

**UIKit — allow all orientations:**
```swift
// AppDelegate
func application(_ application: UIApplication,
    supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
    return .all
}

// Per-view controller override (if some screens need restriction):
override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
    return .all
}
```

**SwiftUI:** Orientation support is controlled at the app target level in Xcode (General → Deployment Info → Device Orientation).

---

## Localization

Assistive technologies use the locale for pronunciation. Mark your strings for localization and ensure the app's locale is set correctly.

**UIKit:**
```swift
// All user-visible strings should use NSLocalizedString
label.text = NSLocalizedString("welcome_message", comment: "Greeting on home screen")

// App locale follows device locale automatically when you provide Localizable.strings files.
```

**SwiftUI:**
```swift
// Text("key") automatically calls NSLocalizedString
Text("welcome_message")  // looks up in Localizable.strings

// For dynamic strings:
Text(LocalizedStringKey(dynamicKey))
```

Use `.xcstrings` (String Catalogs, Xcode 15+) for managing translations.

---

## Bold Text in Depth

Dynamic Type text styles automatically respond to Bold Text — UIFont.preferredFont(forTextStyle:) returns a bold variant automatically when the setting is on.

Custom fonts need explicit handling:

**UIKit:**
```swift
func adaptiveFont(name: String, size: CGFloat, style: UIFont.TextStyle) -> UIFont {
    let baseFont: UIFont
    if UIAccessibility.isBoldTextEnabled {
        baseFont = UIFont(name: "\(name)-Bold", size: size) ?? UIFont.boldSystemFont(ofSize: size)
    } else {
        baseFont = UIFont(name: name, size: size) ?? UIFont.systemFont(ofSize: size)
    }
    return UIFontMetrics(forTextStyle: style).scaledFont(for: baseFont)
}
```

**SwiftUI:**
```swift
@Environment(\.legibilityWeight) var legibilityWeight

Text("Title")
    .fontWeight(legibilityWeight == .bold ? .heavy : .semibold)
```

---

## Dark Mode — Common Pitfalls

- Don't use fixed hex colors for any UI element visible against a background
- Images with white elements invisible on white background: provide dark-mode variants in your asset catalog
- CGColor doesn't adapt — resolve it when you use it, not when you store it:

```swift
// Wrong — captured once, doesn't update
layer.borderColor = UIColor.systemBlue.cgColor // stale if scheme changes

// Right — resolve in traitCollectionDidChange or use dynamic provider
override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
    super.traitCollectionDidChange(previousTraitCollection)
    layer.borderColor = UIColor.systemBlue.cgColor
}
```

---

## Large Content Viewer

Elements that intentionally don't scale with Dynamic Type — tab bar icons, toolbar buttons — must support the Large Content Viewer. Users with the largest accessibility text sizes hold a finger on the element to see an enlarged version in the center of the screen.

**SwiftUI:**
```swift
Button { composeMessage() } label: {
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

---

## Reduce Transparency

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

---

## Smart Invert

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

---

## Dim Flashing Lights

iOS 17+ exposes a user preference to stop flashing animations. Respect it — and ideally avoid flashing content entirely.

**SwiftUI:**
```swift
@Environment(\.accessibilityDimFlashingLights) var dimFlashingLights

Circle()
    .foregroundStyle(dimFlashingLights ? .gray : flashColor)
    .animation(dimFlashingLights ? nil : flashAnimation, value: isFlashing)
```

---

## Increased Contrast

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

---

## Bold Text

Dynamic Type text styles (`UIFont.preferredFont(forTextStyle:)`) automatically return a bold variant when Bold Text is enabled. Custom fonts need explicit handling — see "Bold Text in Depth" below.

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

---

## Dark Mode (Basic Patterns)

Use semantic colors — they automatically adapt. Only read `colorScheme` when the semantic color API isn't enough (e.g., custom CoreGraphics drawing).

**SwiftUI:**
```swift
Text("Hello").foregroundStyle(.primary)
Rectangle().fill(Color(.systemBackground))

// Custom adaptive color
Color(uiColor: UIColor { traitCollection in
    traitCollection.userInterfaceStyle == .dark
        ? UIColor(hex: "#1C1C1E")
        : UIColor(hex: "#F2F2F7")
})
```

**UIKit:**
```swift
view.backgroundColor = .systemBackground
label.textColor = .label

let color = UIColor { traits in
    traits.userInterfaceStyle == .dark
        ? UIColor(red: 0.11, green: 0.11, blue: 0.12, alpha: 1)
        : UIColor(red: 0.95, green: 0.95, blue: 0.97, alpha: 1)
}
```

---

## Audio and Media Accessibility

### Audio Control

Never autoplay audio that plays for more than 3 seconds without giving the user a way to stop it. Provide pause/stop controls.

### Captions

For video playback, `AVPlayerViewController` shows captions automatically when the user has Closed Captions enabled:

```swift
let player = AVPlayer(url: videoURL)
let controller = AVPlayerViewController()
controller.player = player
// Captions are shown automatically from tracks in the media
present(controller, animated: true)
```

Embed closed caption tracks in your video files (SRT, WebVTT, or embedded CEA-608/708).

### Audio Description

If your video contains important visual information that isn't narrated, provide an audio description track. AVPlayer supports audio description tracks — include them in your media files and label them as "Audio Description" in the asset.

### Transcript

Provide a text transcript for any audio content (podcasts, voice messages, audio guides). Link to it from the media player screen.
