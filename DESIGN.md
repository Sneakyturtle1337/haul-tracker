# Design Brief

## Direction
Cab-Ready Dashboard — Dark monochromatic interface optimized for quick data entry and live metric display in bright truck cab environments.

## Tone
Industrial utilitarian: no-nonsense, high-contrast, flat geometry with warm orange accent for critical CTAs and key metrics.

## Differentiation
Monochromatic background with single warm accent accent (orange) used sparingly — every UI element serves function, no decoration.

## Color Palette

| Token      | OKLCH      | Role                    |
| ---------- | ---------- | ----------------------- |
| background | 0.12 0 0   | Deep charcoal, minimal contrast strain |
| foreground | 0.9 0 0    | Near-white text, high contrast |
| card       | 0.16 0 0   | Slightly elevated surface for sections |
| primary    | 0.72 0.17 70 | Warm orange accent (CTAs, active states) |
| accent     | 0.72 0.17 70 | Same as primary — consistent warm focus |
| border     | 0.25 0 0   | Subtle grid lines, input edges |

## Typography
- Display: Space Grotesk — sharp, tech-forward, scannable headings
- Body: DM Sans — clean labels, dense form fields, table text
- Scale: Hero `text-2xl font-bold`, Labels `text-xs font-semibold uppercase`, Body `text-sm`

## Elevation & Depth
No shadows. Flat, layered backgrounds: `bg-background` (main), `bg-card` (sections, inputs). Borders define containment.

## Structural Zones

| Zone      | Background | Border | Notes                             |
| --------- | ---------- | ------ | --------------------------------- |
| Header    | bg-card    | border-b | Title, active trip status line |
| Tabs      | bg-background | border-b | Active Trip / History toggle |
| Content   | bg-background | —      | Main metric display, form fields |
| Input Row | bg-card    | border | Compact form groups, 2px radius |

## Spacing & Rhythm
Compact: `gap-2`, `py-1` on inputs, `mb-2` between sections. Minimize whitespace for rapid scanning.

## Component Patterns
- Buttons: `bg-accent` text-white, no shadow, `rounded-sm` (2px)
- Metric Display: `text-accent text-3xl font-bold` for profit/mile, miles, revenue
- Form Inputs: `bg-input border-border text-foreground`, compact padding

## Motion
None — flat, instant state changes. No decorative animations.

## Constraints
- Dark mode only (primary aesthetic)
- No shadows, no gradients, no blur
- Maximum 2-3 token uses per component (avoid color tokens spreading)
- Accent (orange) reserved for CTAs and key metrics only

## Signature Detail
Warm orange accent on dark background — industrial but not cold. Every pixel serves function in the cab.
