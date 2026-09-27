---
name: Aura Wash System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#006387'
  on-tertiary: '#ffffff'
  tertiary-container: '#007da9'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.75rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system expresses immaculate hygiene, premium effortless care, and frictionless modern convenience. Designed for an on-demand premium laundry, dry cleaning, and fabric garment delivery service, the UI must feel as crisp, airy, and rejuvenating as freshly pressed linen. 

The aesthetic marries clinical purity with tactile warmth—avoiding cold sterility through soft rounded geometries, airy micro-interactions, luminous water-tinted surfaces, and ample breathing room. The interface reassures users of white-glove fabric safety, punctual logistic timing, and eco-conscious stewardship. Every surface communicates purity, structure, and sensory freshness.

## Colors

The palette establishes an immediate sensation of crisp water, fresh air, and pristine linen. 

- **Primary Canvas & Porcelain Layers**: Base backgrounds utilize ultra-clean porcelain tints (`#FAFCFD` as main canvas, `#F0F7FA` for recessed containers, and `#FFFFFF` for lifted cards) rather than flat grey or stark harsh white.
- **Primary Sky Accent (`#0284C7`, `#0EA5E9`, `#38BDF8`)**: Drives essential callouts, interactive actions, schedule milestones, and driver tracking.
- **Secondary Mint/Teal Accent (`#14B8A6`, `#2DD4BF`, `#E6FFFA`)**: Represents eco-friendly detergents, delicate wash cycles, cleanliness verification badges, and positive completion statuses.
- **Deep Navy Slate Neutral (`#0F172A`, `#334155`, `#64748B`)**: Delivers high-contrast, razor-sharp typography without the harshness of pure black.
- **Subtle Surface Rings & Strokes**: Borders leverage soft water-rinsed tones (`#E2E8F0` and `#BAE6FD`) at 1px thickness to cleanly separate layers without visual clutter.

## Typography

Typography relies entirely on **Plus Jakarta Sans** across display, body, and UI labels. Its geometric precision and softly rounded curves mirror the modern, friendly, and hygienic qualities of the brand.

- **Headlines**: Set tightly kerned with bold and semi-bold weights to convey modern competence and cleanliness.
- **Body Text**: Tuned for maximum legibility in service breakdowns, fabric care instructions, and order manifests.
- **Labels & Microcopy**: Formatted with distinct letter spacing and optical weights for status tags, timestamps, weight gauges, and logistical tracking badges.

## Layout & Spacing

The layout philosophy uses an uncluttered, responsive fluid grid built on an 8pt architectural rhythm, with 4pt subdivisions for micro-elements:

- **Mobile (< 768px)**: 4-column layout with `1rem` outer canvas padding and `1.25rem` column gutters. Components hug a clean single-column flow with persistent navigation bars and bottom checkout/booking trays.
- **Tablet (768px - 1024px)**: 8-column layout with `2rem` outer margin, providing side-by-side splits for pickup scheduling, order itemization, and pricing calculation.
- **Desktop (> 1024px)**: 12-column layout capped at a maximum width of `1280px` centered within a `3rem` margin. Generous whitespace around service categories, order tracking stages, and service plans prevents cognitive overload and maintains a serene feeling.

## Elevation & Depth

Visual hierarchy evokes weightless buoyancy and pristine clarity. Rather than using harsh dropshadows or heavy borders, depth is layered through soft atmospheric tinting and clean porcelain transitions.

- **Level 0 (Base Surface)**: `#FAFCFD` canvas with subtle soft tone variance.
- **Level 1 (Recessed Containers & Selection Tiles)**: `#F0F7FA` with a crisp `1px` border of `#E2E8F0` or `#BAE6FD`.
- **Level 2 (Cards, Trays, Sheets)**: Crisp white (`#FFFFFF`) with a diffuse, sky-tinted ambient shadow (`box-shadow: 0 4px 20px -2px rgba(2, 132, 199, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)`), paired with a faint `1px` outline of `#F1F5F9`.
- **Level 3 (Floating Controls, Date Pickers, Modal Dialogs)**: Pure white with increased vertical offset and soft atmospheric dispersion (`box-shadow: 0 12px 36px -4px rgba(2, 132, 199, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)`).
- **Glassmorphic Overlays**: Sticky headers and active filter bars use `backdrop-filter: blur(12px)` over `rgba(250, 252, 253, 0.85)` with a delicate underside border of `rgba(186, 230, 253, 0.45)`.

## Shapes

The shape system leverages smooth, friendly curvature matching modern mobile ergonomics and gentle fabric metaphors. 

- Standard interactive components (buttons, text fields, chips) use `0.75rem` to `1rem` (12–16px) radius.
- Cards, booking sheets, and interactive containers use `1rem` to `1.5rem` (16–24px) corner radii.
- Avatars, status pills, and toggle counters employ full pill radiuses (`9999px`) to maintain fluid touch affordances.

## Components

### Buttons
- **Primary Action**: Solid sky blue gradient fill (`#0284C7` to `#0EA5E9`), white bold typography, `1rem` border radius, high-touch padding (`0.875rem 1.5rem`), with a soft ambient cyan glow on hover/active states.
- **Secondary / Eco Action**: Soft mint tint container (`#E6FFFA`), rich teal text (`#0F766E`), and a hairline border (`#99F6E4`).
- **Ghost / Neutral**: Subtle porcelain background (`#F0F7FA`), dark slate text (`#334155`), transitioning to white with a soft border ring on hover.

### Chips & Tags
- **Pill Shape (`9999px`)**: Low-saturation pastel containers indicating laundry stages: "Sterilized", "Eco-Wash", "Delicate Press", "Out for Delivery".
- Selected chips activate a pure white fill with a vivid sky border (`#0284C7`) and primary sky text.

### Form Inputs & Selectors
- Background: `#FFFFFF`, border: `1.5px solid #E2E8F0`, rounded at `0.75rem`.
- Focus state: Ring transition to `#0EA5E9` with an outer diffuse halo (`rgba(14, 165, 233, 0.18)`), eliminating harsh contrast while preserving accessibility.

### Cards & Service Tiles
- Crisp `#FFFFFF` resting on `#FAFCFD`.
- 16px to 20px interior padding, hairline perimeter border (`#E2E8F0` or `#BAE6FD`), soft sky-tinted ambient shadow.
- Hover states softly lift with a +2px translation and an accentuated mint or aqua border tone.

### Checkboxes & Segmented Radios
- Checkboxes: Generous 20px target with smooth 6px rounded corners, filling with `#0284C7` and displaying a crisp white micro-checkmark when selected.
- Segmented Pickers: Contained within a pill-shaped `#F0F7FA` rail, featuring an animated sliding white surface indicator for selected delivery windows and garment weights.

### Specialized Service Components
- **Wash Step Progress Gauge**: Linked horizontal nodes displaying water droplet, washing, air-drying, folding, and delivery van states with continuous aqua gradient progress fills.
- **Garment Counter Stepper**: Circular `+` and `-` controls with tactile porcelain indentation, centered around large tabular numbers for count tracking.
- **Driver Pickup Card**: Floating card with live GPS progress map, driver hygiene verification badge, and direct call/message micro-actions.