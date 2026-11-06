# TaskComp Design System & Craft Guidelines

## 1. Visual Identity & Brand Philosophy
- **Style Archetype**: Modern, clean, warm productivity workspace (reminiscent of Linear, Notion, Raycast).
- **Core Principle**: Human craft over AI slop. Strictly **no blurry neon glows**, no over-saturated rainbow gradients, no floating ungrounded elements.
- **Physicality**: Crisp 1px solid borders, intentional soft elevation, warm off-white canvas, high contrast charcoal text.

---

## 2. Color System & Tokens

### Canvas & Backgrounds
- `Canvas Primary`: `#F8F9FA` (Warm off-white background)
- `Canvas Secondary`: `#F3F4F6` (Sidebar and active state wash)
- `Surface Card`: `#FFFFFF` (Pristine solid white cards)
- `Surface Hover`: `#F9FAFB`
- `Surface Active`: `#F3F4F6`

### Typography Hierarchy
- `Heading Primary`: `#111827` (Charcoal black, high readability)
- `Body Muted`: `#6B7280` (Neutral gray for secondary labels)
- `Subtle Placeholder`: `#9CA3AF`
- `Inverse Text`: `#FFFFFF`

### Borders (Anti-Slop Strictness)
- **Rule**: Never use blurry radial gradient borders or neon outline glows.
- `Hairline Border`: `rgba(0, 0, 0, 0.06)` or `border-black/[0.06]` (Ultra-crisp 1px outline for cards)
- `Divider Border`: `#E5E7EB` (Subtle 1px gray dividers)
- `Active Input Border`: `#111827` (Clean high-contrast ring)

### Category Badges (Tints & Saturated Typography)
Each category badge uses a delicate pastel background tint paired with a saturated text color for immediate visual scanning:
- **Study**:
  - Background: `#EFF6FF` (Tailwind blue-50)
  - Text: `#2563EB` (Tailwind blue-600)
  - Border: `#DBEAFE` (Tailwind blue-100)
- **Project**:
  - Background: `#F5F3FF` (Tailwind purple-50)
  - Text: `#7C3AED` (Tailwind purple-600)
  - Border: `#EDE9FE` (Tailwind purple-100)
- **Exam**:
  - Background: `#FFF1F2` (Tailwind rose-50)
  - Text: `#E11D48` (Tailwind rose-600)
  - Border: `#FFE4E6` (Tailwind rose-100)
- **Design**:
  - Background: `#FFFBEB` (Tailwind amber-50)
  - Text: `#D97706` (Tailwind amber-600)
  - Border: `#FEF3C7` (Tailwind amber-100)
- **Learning**:
  - Background: `#ECFDF5` (Tailwind emerald-50)
  - Text: `#059669` (Tailwind emerald-600)
  - Border: `#D1FAE5` (Tailwind emerald-100)

---

## 3. Spacing, Padding & Margins
- **Card Padding**: `p-5` or `p-6` (Generous breathing room)
- **Task Row Padding**: `py-3 px-4` (Compact and click-friendly)
- **Grid Gap**: `gap-4` and `gap-6`
- **Border Radii Hierarchy**:
  - Cards: `rounded-2xl` (16px)
  - Interactive Buttons / Inputs: `rounded-xl` (12px)
  - Small Pills / Badges: `rounded-full` (9999px)

---

## 4. Animation Principles (Intentional Motion)
- **Checkbox Toggle**:
  - Physics: Quick spring with subtle scale pulse (`scale: [1, 1.25, 1]`, duration: 180ms).
  - Audio: Rewarding ascending chime on complete; soft descending click on uncheck.
- **Card Hover**:
  - Hover: Crisp lift (`y: -2px`, duration: 150ms ease-out) without blurry shadow bloom.
- **List Items Reorder / Enter**:
  - Stagger: 35ms per item, slide up `8px -> 0px` with fade `0 -> 1`.
- **Command Palette & Modals**:
  - Backdrop: Fade `opacity: 0 -> 1` (backdrop-blur-sm).
  - Dialog: Scale `0.98 -> 1.0` with `y: 4px -> 0px`.
- **Lenis Smooth Scroll**:
  - Seamless 120fps inertia scrolling, no scroll jank.

---

## 5. Strict Constraints
- **File LOC Ceiling**: No single `.ts` / `.tsx` file will exceed 500 lines of code.
- **Component Reusability**: Extract shared buttons, badges, metrics cards, and inputs.
