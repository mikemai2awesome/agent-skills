# Accessibility Commitment

## 1. Our Commitment

We believe accessibility is a basic human right. This project commits to the **Web Content Accessibility Guidelines (WCAG) 2.2 Level AA** as a baseline, with Level AAA criteria considered where feasible. Accessibility is a core measure of software quality — not a follow-up task.

## 2. Contributor Requirements

To contribute to this project, follow these principles:

### Structure & Semantics

- **Semantic markup first.** Use native elements that convey meaning before reaching for custom roles or ARIA attributes.
- **Declare the language.** Set the document language and mark up any in-line language changes so assistive technologies pronounce content correctly.
- **Landmark regions and bypass mechanisms.** Provide a way for users to skip repeated blocks and navigate directly to main content areas.

### Keyboard & Input

- **Full keyboard access.** Every function must be operable with a keyboard alone. No interaction should be mouse or gesture dependent.
- **Logical focus order.** Interactive elements must receive focus in a sequence that preserves meaning and operability.
- **Visible focus indicators.** Every interactive element must display a clearly visible focus style. If you replace the default indicator, ensure the replacement meets a minimum 3:1 contrast ratio against adjacent colors.
- **Touch and pointer targets.** Interactive targets must be at least 24 by 24 CSS pixels, with 44 by 44 CSS pixels strongly preferred for primary actions.
- **Alternative to dragging.** Any drag-and-drop interaction must also be achievable with a single pointer action, such as tap-and-select or arrow-key reordering.

### Visual Design & Layout

- **Relative units.** Use relative units for text and spacing so layouts do not break when users enlarge content.
- **Reflow.** Content must reflow into a single column at a viewport width equivalent to 320 CSS pixels with no loss of information and no horizontal scrolling.
- **Color is never the sole indicator.** Always pair color with a secondary cue (such as text, pattern, or iconography) to convey information.
- **Text alignment.** Avoid full justification; the uneven word spacing creates visual "rivers" that reduce readability for everyone.

### Content & Communication

- **Text alternatives.** Provide meaningful alternatives for all non-text content — images, icons, charts, and media. Hide purely decorative content from assistive technologies.
- **Plain language.** Write in clear, everyday language. When presenting numbers, round where precision is not critical and add context to aid understanding.
- **No persistent uppercase.** Avoid setting continuous text in all capitals; it slows reading speed and is announced letter-by-letter by some screen readers.

### Forms & Error Handling

- **Visible labels.** Every form input must have a visible, persistent label. Placeholder text should be avoided.
- **Error identification.** When an error is detected, describe the problem in text and associate the message with the relevant input so assistive technologies can announce it.
- **Error recovery.** For forms that trigger legal, financial, or data-changing actions, allow users to review, correct, or reverse their submission.

### Dynamic Content & Time

- **Status messages.** Notifications, loading indicators, and inline confirmations must be announced to assistive technologies without moving focus.
- **Motion and animation.** Respect user motion preferences. Any animation or auto-playing content must be reducible or pausable through site controls or system settings.
- **Time limits.** If a session or task imposes a time limit, warn users before expiration and provide a way to extend or disable the limit.

### Predictability & Cognitive Load

- **Consistent navigation.** Navigation mechanisms that repeat across pages must appear in the same relative order.
- **Predictable behavior.** Receiving focus or changing a setting must not trigger unexpected context changes unless the user has been informed in advance.

### Third-Party Content

- **Embedded content is still your responsibility.** If the project includes third-party widgets, embedded media, or external scripts, ensure they meet the same accessibility baseline.

## 3. Reporting & Severity Taxonomy

If you find a barrier, file an issue. We prioritize fixes based on user impact:

- **Critical:** Prevents a user from completing a core task. No workaround exists.
- **High:** Causes significant difficulty for assistive technology users, even if a workaround exists.
- **Medium:** Causes minor annoyance or inconsistent behavior that degrades the experience but does not block task completion.
- **Low:** Cosmetic or edge-case inconsistency with low frequency of user impact.

## 4. Testing Requirements

Automated tools catch issues early but find only a fraction of real-world failures. Because of this, **every interface change also requires manual testing** with assistive technologies, including:

- **Screen readers** on desktop and mobile platforms
- **Voice control** software
- **Keyboard-only navigation** using Tab, arrow keys, Enter, Escape, and standard shortcut patterns
- **Display modes:** high contrast, forced colors, reduced transparency, reduced motion, and increased text size at 200%

Test complete user journeys from start to finish, not only isolated pages.

## 5. Resources & Support

Accessibility is a shared responsibility. If you have questions, are unsure whether something meets the bar, or want to discuss a tricky pattern, open a discussion thread.

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WCAG 2.2 Understanding Docs](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [The A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Inclusive Components](https://inclusive-components.design/)
- [Contrast Report](https://contrast.report/)
- [A11y Tools](https://a11y-tools.com/)
- [AssistivLabs](https://assistivlabs.com/)
