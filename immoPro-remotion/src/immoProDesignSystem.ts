/**
 * ImmoPro Design System — Paper & Ink (editorial, monochrome).
 *
 * Single source of truth shared between the Astro site and Remotion compositions
 * to guarantee identical visual identity across the website and any generated video.
 *
 * Colors derived from the live OKLCH palette in `immoPro/src/styles/global.css`,
 * resolved here to hex (Remotion canvas doesn't render OKLCH natively in all
 * environments).
 */

export const immoProColors = {
  // Surfaces
  background: '#f5f3ee',       // paper
  card:       '#faf9f6',
  border:     '#d4d0c8',
  muted:      '#e8e5df',

  // Type
  foreground: '#0d0d0d',       // ink
  mutedForeground: '#6b6b6b',

  // Restricted accent — used sparingly to draw the eye to a single brand cue
  accent:     '#0F766E',       // editorial teal (kept from prior palette as the one chromatic note)
  accentSoft: '#67E8F9',       // info / metadata highlight

  // States
  destructive: '#DC2626',
} as const;

export const immoProTypography = {
  /** Editorial serif for headings — matches Astro site (`Instrument Serif`). */
  heading: '"Instrument Serif", Georgia, serif',
  /** Body/sans for everything else — matches Astro site (`Inter`). */
  body:    'Inter, system-ui, -apple-system, "Segoe UI", sans-serif',
  /** Monospace for video frame labels, timecodes, etc. */
  mono:    '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
} as const;

export const immoProStyle = {
  name: 'Paper & Ink — editorial minimalism for premium real estate',
  mood: 'Calm, restrained, monochrome with one editorial accent. Long form, slow motion.',
  heroFontSize: 'clamp(3rem, 10vw, 5.5rem)',
  headingWeight: 400,         // Instrument Serif looks best at 400, not 700
  letterSpacing: '-0.025em',  // tight tracking on display sizes
} as const;

/** Strongly typed accessor; useful in compositions to avoid stringly-typed lookups. */
export const getColor = (key: keyof typeof immoProColors) => immoProColors[key];

export type ImmoProColor = keyof typeof immoProColors;
