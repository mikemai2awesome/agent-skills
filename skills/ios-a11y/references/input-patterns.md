# Input Patterns — Extended Reference

## Keyboard Type and Content Type

Correct keyboard and content types reduce typing effort and enable password managers and autofill.

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

---

## Tap Target Size

Interactive elements must be at least 44×44 points to be reliably tappable, especially for users with motor impairments.

**SwiftUI:**
```swift
Button("Save") { save() }
    .frame(minWidth: 44, minHeight: 44)
    .contentShape(Rectangle())
```

**UIKit** — override `point(inside:with:)` to expand the hit area without changing visual size:
```swift
override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
    let expanded = bounds.insetBy(dx: -10, dy: -10)
    return expanded.contains(point)
}
```

---

## Input Gestures

Functionality that requires a custom gesture (pinch, multi-finger swipe, long press) must also be available through a simpler interaction — a button, control, or accessibility custom action. This is essential for Switch Control and Voice Control users who can't perform complex gestures.

**SwiftUI:**
```swift
// Gesture-activated action
ZStack {
    Image(systemName: "photo")
        .gesture(LongPressGesture().onEnded { _ in showOptions() })

    // Accessibility alternative via custom action
        .accessibilityAction(named: "Show options") { showOptions() }
}
```

**UIKit:**
```swift
let longPress = UILongPressGestureRecognizer(target: self, action: #selector(showOptions))
imageView.addGestureRecognizer(longPress)

// Provide the same action accessibly
imageView.accessibilityCustomActions = [
    UIAccessibilityCustomAction(name: "Show options") { [weak self] _ in
        self?.showOptions()
        return true
    }
]
```

---

## Input Cancellation

Users should be able to cancel accidental taps, especially on destructive actions. Don't trigger actions on touch-down (`.onPressed` / `UIControlEvents.touchDown`); trigger on touch-up inside.

**SwiftUI:**
Button actions fire on release by default — this is correct. Avoid `DragGesture` or custom gesture recognizers that fire on `began` for irreversible actions.

**UIKit:**
```swift
// Always use .touchUpInside for destructive or significant actions
button.addTarget(self, action: #selector(deleteItem), for: .touchUpInside)

// Not this — fires before the user can slide their finger away to cancel
button.addTarget(self, action: #selector(deleteItem), for: .touchDown)
```

---

## Input Motion

If your app responds to device motion (shake to undo, tilt to scroll), provide an alternative control. Check whether the user has Shake to Undo turned off or uses a device in a fixed mount.

**UIKit — shake to undo alternative:**
```swift
// Provide a visible undo button instead of relying solely on shake
navigationItem.leftBarButtonItem = UIBarButtonItem(
    barButtonSystemItem: .undo,
    target: self,
    action: #selector(undoLastAction)
)

// Also still support shake for users who prefer it
override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
    if motion == .motionShake { undoLastAction() }
}
```

---

## Predictable Behavior

Changing focus to an element should never automatically trigger an action. For example, don't submit a form when the last field receives focus, and don't navigate away when a picker value changes.

Make context changes explicit — require a "Done" or "Apply" button.

**SwiftUI:**
```swift
// Wrong — changes context immediately on selection
Picker("Sort by", selection: $sortOrder) {
    ForEach(SortOrder.allCases) { Text($0.label) }
}
.onChange(of: sortOrder) { _ in navigateToResults() } // don't do this

// Right — navigate only when the user confirms
Button("Apply") { navigateToResults() }
```

---

## Input Instructions

When a field has format requirements that the label alone doesn't communicate, add instructions visible before the field is focused (not just in a tooltip or placeholder).

**SwiftUI:**
```swift
VStack(alignment: .leading, spacing: 4) {
    Text("Date of birth")
        .font(.subheadline)
    Text("Format: MM/DD/YYYY")
        .font(.caption)
        .foregroundStyle(.secondary)
    TextField("MM/DD/YYYY", text: $dateOfBirth)
        .keyboardType(.numbersAndPunctuation)
        .accessibilityLabel("Date of birth")
        .accessibilityHint("Format: month, day, year with slashes")
}
```

---

## Authentication

Support biometric and password manager authentication. Don't block paste in password fields — it harms users who use password managers.

**UIKit:**
```swift
// Never disable paste
// passwordTextField.isEnabled = false is fine; but don't override paste(_:) to block it

// Use Local Authentication for biometrics
import LocalAuthentication

let context = LAContext()
if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: nil) {
    context.evaluatePolicy(
        .deviceOwnerAuthenticationWithBiometrics,
        localizedReason: "Sign in to your account"
    ) { success, error in
        DispatchQueue.main.async {
            if success { self.handleSignIn() }
        }
    }
}
```

**SwiftUI:**
```swift
SecureField("Password", text: $password)
    .textContentType(.password)
// Don't disable paste or copy on this field
```

---

## Redundant Input

Don't ask users to re-enter information already provided in the same session. Use `textContentType` to pre-fill from autofill/Keychain. Don't ask users to type their email twice on sign-up forms.

```swift
// Good — use textContentType so autofill can help
TextField("Email", text: $email)
    .textContentType(.emailAddress)
    .keyboardType(.emailAddress)

SecureField("Password", text: $password)
    .textContentType(.newPassword) // iOS generates and stores a strong password
```

---

## Keyboard Order (External Keyboard)

For apps used on iPad with external keyboards, the tab order should follow a logical reading sequence. Use `UIFocusGuide` to bridge gaps in the focus chain and `accessibilityElements` to define order for VoiceOver.

**UIKit:**
```swift
// Create a focus guide to route keyboard focus between non-adjacent views
let focusGuide = UIFocusGuide()
view.addLayoutGuide(focusGuide)
NSLayoutConstraint.activate([
    focusGuide.topAnchor.constraint(equalTo: lastColumnButton.bottomAnchor),
    focusGuide.leadingAnchor.constraint(equalTo: firstColumnButton.leadingAnchor),
    focusGuide.widthAnchor.constraint(equalTo: firstColumnButton.widthAnchor),
    focusGuide.heightAnchor.constraint(equalToConstant: 1)
])
focusGuide.preferredFocusEnvironments = [nextRowFirstButton]
```

**SwiftUI:**
SwiftUI handles tab focus automatically in forms. For custom layouts, use `.focusable()` and ensure your view hierarchy follows the desired order.

---

## Keyboard Shortcuts

For iPad apps, provide keyboard shortcuts for common actions. Use `UIKeyCommand` or SwiftUI's `.keyboardShortcut()`.

**SwiftUI:**
```swift
Button("New Message") { composeMessage() }
    .keyboardShortcut("n", modifiers: .command)

Button("Search") { openSearch() }
    .keyboardShortcut("f", modifiers: .command)
```

**UIKit:**
```swift
override var keyCommands: [UIKeyCommand]? {
    return [
        UIKeyCommand(
            title: "New Message",
            action: #selector(composeMessage),
            input: "n",
            modifierFlags: .command
        ),
        UIKeyCommand(
            title: "Search",
            action: #selector(openSearch),
            input: "f",
            modifierFlags: .command
        )
    ]
}
```

---

## Adjustable Timing

If your app has timed interactions (session expiry, auto-dismissing alerts, auto-advancing carousels), users must be able to turn off, extend, or adjust the time limit. At minimum, warn them before the time expires and give them a way to extend.

Avoid auto-dismissing alerts and toasts when VoiceOver is running — VoiceOver users need more time to hear the content:

**UIKit:**
```swift
func showToast(_ message: String) {
    let duration: TimeInterval = UIAccessibility.isVoiceOverRunning ? 6.0 : 2.0
    // show toast, dismiss after duration
}
```

---

## Search Functionality

On screens with large lists or complex content, provide search so users don't need to browse everything to find what they need — this particularly helps users with cognitive disabilities.

**SwiftUI:**
```swift
@State private var searchText = ""

NavigationStack {
    List(filteredItems) { item in ItemRow(item: item) }
        .searchable(text: $searchText, prompt: "Search orders")
        .navigationTitle("Orders")
}

var filteredItems: [Item] {
    searchText.isEmpty ? items : items.filter {
        $0.name.localizedCaseInsensitiveContains(searchText)
    }
}
```

**UIKit:**
```swift
let searchController = UISearchController(searchResultsController: nil)
searchController.searchResultsUpdater = self
searchController.obscuresBackgroundDuringPresentation = false
navigationItem.searchController = searchController
```

---

## Skip Navigation / Skip to Content

On screens with repeated navigation (tab bars, toolbars, long headers), provide a way to jump to the main content. For VoiceOver, this typically means setting the content area as the initial focus when the screen appears.

**UIKit:**
```swift
override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    // Move VoiceOver focus to main content, skipping nav bar
    UIAccessibility.post(notification: .screenChanged, argument: mainContentView)
}
```

For keyboard users, the equivalent is a "Skip to main content" button revealed on first Tab press — less common in iOS than web, but relevant for iPadOS keyboard navigation.

---

## Screen Help

For complex screens, provide contextual help accessible from the screen itself — not just in a separate help section.

**UIKit:**
```swift
// Add a help button to the navigation bar
navigationItem.rightBarButtonItem = UIBarButtonItem(
    image: UIImage(systemName: "questionmark.circle"),
    style: .plain,
    target: self,
    action: #selector(showHelp)
)
```

**SwiftUI:**
```swift
.toolbar {
    ToolbarItem(placement: .navigationBarTrailing) {
        Button {
            showHelp = true
        } label: {
            Image(systemName: "questionmark.circle")
        }
        .accessibilityLabel("Help")
    }
}
```
