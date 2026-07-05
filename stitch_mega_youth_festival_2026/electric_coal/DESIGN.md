---
name: Electric Coal
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c6c6cf'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8f9099'
  outline-variant: '#45464e'
  surface-tint: '#b9c5f2'
  primary: '#b9c5f2'
  on-primary: '#222f53'
  primary-container: '#0d1b3e'
  on-primary-container: '#7784ad'
  inverse-primary: '#515d84'
  secondary: '#44dada'
  on-secondary: '#003737'
  secondary-container: '#00bbbc'
  on-secondary-container: '#004545'
  tertiary: '#ffb3ae'
  on-tertiary: '#68000c'
  tertiary-container: '#430005'
  on-tertiary-container: '#f24246'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b9c5f2'
  on-primary-fixed: '#0b1a3d'
  on-primary-fixed-variant: '#39456b'
  secondary-fixed: '#69f7f7'
  secondary-fixed-dim: '#44dada'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f50'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ae'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#930016'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  display-xl:
    fontFamily: Anybody
    fontSize: 84px
    fontWeight: '900'
    lineHeight: 80px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: 0em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.1em
spacing:
  base: 8px
  section-gap-desktop: 120px
  section-gap-mobile: 64px
  container-max-width: 1280px
  gutter: 24px
---

## Brand & Style
The design system is engineered for a high-energy youth festival, blending the raw intensity of a midnight concert with the precision of a modern digital experience. The brand personality is "Electric Industrial"—nodding to Dhanbad's heritage while pivoting sharply toward a futuristic, tech-forward youth culture.

The style is a hybrid of **High-Contrast/Bold** and **Minimalist-Techno**. It utilizes massive, punchy typography reminiscent of festival headliner posters, set against deep, immersive backgrounds. Visual interest is driven by "Torn-Ticket" motifs, jagged edges, and high-saturation accents that guide the eye toward conversion points. The emotional response should be one of urgency, exclusivity, and raw kinetic energy.

## Colors
The palette is dominated by the midnight depth of the primary navy, providing a canvas where the cyan "Electric" accents can glow. 

- **Primary (#0D1B3E):** Use for the main canvas and deep-section backgrounds.
- **Accent Cyan (#3ED6D6):** Reserved for headlines, primary CTAs, and active states. It represents the "energy" of the festival.
- **Urgency Red (#C41E2A):** Used sparingly for "Limited Tickets," "Live Now," or critical alerts to create high-tension contrast against the cyan.
- **Contrast Black (#000000):** Used for "Torn Ticket" cards and footer blocks to ground the floating UI elements.
- **White (#FFFFFF):** Primary text color to ensure maximum readability against the dark surfaces.

## Typography
This design system utilizes a high-impact typographic hierarchy to emulate event posters.

- **Headlines (Anybody):** A variable, expressive sans-serif. Use the Bold and Black weights for titles. On desktop, large display sizes should use negative letter-spacing to create a "packed" feel.
- **Body (Hanken Grotesk):** Chosen for its contemporary, clean geometry. It maintains high legibility even at smaller sizes against dark backgrounds.
- **Data/Labels (Space Mono):** Used for dates, times, and venue coordinates to add a "technical/ticket" aesthetic. Always use uppercase for labels to maintain a structured look.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for mobile-first consumption. 

- **The "Tear" Break:** Sections should not always be divided by straight horizontal lines. Use a "Torn Paper" or "Perforated Ticket" jagged edge SVG mask to separate the primary navy backgrounds from the contrast black blocks.
- **Margins:** Use wide horizontal margins (24px) on mobile to allow elements to breathe, expanding to a max-width container of 1280px for desktop.
- **Rhythm:** Use a strict 8px base grid. Section gaps are intentionally generous (120px on desktop) to ensure the massive typography doesn't feel cramped.
- **Mobile Reflow:** For the lineup grid, move from a 4-column desktop layout to a 1-column high-impact stacked layout on mobile.

## Elevation & Depth
This system eschews traditional shadows in favor of **Tonal Layering** and **High-Contrast Outlines**.

- **Surface Levels:** 
  - Level 0: Primary Navy (#0D1B3E)
  - Level 1: Contrast Black (#000000) cards.
  - Level 2: Cyan Outlines (1px solid #3ED6D6) for interactive elements.
- **Depth:** Instead of blur, use 4px or 8px "Hard Shadows" (offset strokes) in Cyan or Red to give elements a "Pop-Art" or "Poster" feel.
- **Interactive States:** When hovering over a card, the 1px Cyan border should expand to 4px to create a physical "press" sensation.

## Shapes
The shape language is **Sharp and Brutalist**. 

- **Corners:** All primary buttons, cards, and input fields must have a 0px border radius. This reinforces the professional, modern, and high-energy "Industrial" vibe of Dhanbad.
- **The Ticket Notch:** Specific "Event Pass" cards should feature a semi-circle cutout on the left and right edges (the "perforation notch") to lean into the festival motif.
- **Angled Cuts:** Use 45-degree clipped corners for secondary buttons to create a "tech-wear" aesthetic.

## Components
- **Primary CTA:** Solid Cyan (#3ED6D6) background with Black (#000000) Bold Anybody text. No border-radius. On mobile, these should be sticky to the bottom of the viewport with a slight glassmorphism backdrop blur behind the container.
- **Lineup Cards:** Black background, 1px Cyan border. On hover, the Cyan border thickens and the artist's name shifts from White to Cyan.
- **Urgency Chips:** Red (#C41E2A) background with White text in Space Mono. Used for "Sold Out" or "Few Left" indicators.
- **Torn Section Divider:** A custom SVG component that creates a jagged white or black horizontal edge between background shifts.
- **Input Fields:** Black background with a bottom-only 2px Cyan border. Labels use Space Mono in Cyan.
- **Event Pass:** A specialized card component with a "perforated" line (dashed stroke) separating the "Event Details" from the "QR Code/Price" section.