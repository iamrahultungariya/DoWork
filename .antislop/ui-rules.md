# Anti-Slop: UI & Visual Rules

## 1. Color Palette Discipline
- No default blue-purple-pink gradients.
- Derive all colors from `DESIGN.md`.
- Soft tinted backgrounds with high-contrast text for premium legibility.

## 2. Card & Surface Architecture
- Pure white cards (`#FFFFFF`) on subtle off-white canvas (`#F8F9FA`).
- Crisp, hairline borders: `border border-black/[0.06]` or `border-neutral-200/80` (no blurry diffusion).
- Subtle, grounded elevation: `shadow-[0_1px_3px_rgba(0,0,0,0.04)]` or `shadow-xs`.

## 3. Typography & Badges
- High-contrast headings (`#111827`).
- Balanced secondary text (`#6B7280`).
- Badges must have distinct, legible category tints (Study = light blue, Project = light purple, Exam = peach/coral, Design = amber, Learning = mint green) with matching saturated foreground text.

## 4. Animation Guidelines (Purposeful Motion)
- Checkmark toggle: Snappy micro-scale bounce with check icon morph (`scale: [1, 1.25, 1]`, duration: 180ms).
- Card entry / list stagger: Clean spring-based entry (`y: 10 -> 0`, `opacity: 0 -> 1`), duration 220ms, no lag.
- Command Palette: Instant backdrop fade (`opacity: 0.4`), scale from 0.98 to 1.0.
- No endless floating loops or distractingly slow ease-in-out animations.
