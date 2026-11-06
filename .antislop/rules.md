# Anti-Slop: Core Rules for AI Coding Agents

## Core Principles
1. **Filter, Not a Style Guide**: Anti-slop enforces human craft, real design intent, and cuts out generic AI stereotypes.
2. **Intentionality Test**: Every visual element, color, gradient, border, and animation must serve a clear written purpose.
3. **No Decorative AI Glow / Blur**: Never use blurry radial gradients, AI-style neon glow borders, or excessive backdrop-filters that flatten hierarchy.
4. **Crisp Structural Borders**: Borders must be clean, deliberate 1px solid tones that separate visual planes cleanly without fuzzy diffusion.
5. **Dose Caps**:
   - Shadows: Used strictly for elevation on active dropdowns/dialogs; main cards sit cleanly with crisp borders.
   - Radii: Deliberate hierarchy (e.g. `rounded-2xl` for cards, `rounded-xl` for interactive items, `rounded-full` strictly for status badges).
   - Motion: Spring-physics for user interactions (checkbox ticks, modal transitions) with purpose; no infinite spinning loops.
6. **Real Interactive State**: Every badge, button, and indicator must represent real live data or provide an interactive affordance.
