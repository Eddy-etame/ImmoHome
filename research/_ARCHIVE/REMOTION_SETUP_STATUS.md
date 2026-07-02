# Remotion Video Production Setup for ImmoPro

**Date**: 2026-05-28

## Folders Created

- `immoPro-remotion/` — Dedicated Remotion workspace for generating all video assets
- Will be used alongside the Astro site (`immoPro-astro/`)

## Current Status

- Scaffolded with `create-video@latest --blank --no-tailwind`
- Will be configured to use the **ImmoPro Design System** from UI/UX Pro Max (colors, typography)
- Will follow best practices from `remotion-skills`

## Planned First Compositions (Pragmatic Order)

1. **PropertyHighlight** — 45-60s cinematic video for individual listings
   - Uses Pro Max color palette
   - Elegant text animations (guided by Remotion Skills)
   - Photo slideshow + subtle motion
   - Agent voiceover placeholder (later: ElevenLabs integration)

2. **MarketReport** — Monthly/quarterly market update videos for social media

3. **AgentBranding** — Short intro videos for agents

## How Remotion Will Be Used With Other Skills

- **UI/UX Pro Max** → Defines the visual language that must be respected in every video (colors, typography, mood)
- **Remotion Skills** → Provides the rules for writing high-quality compositions (Tailwind usage in Remotion, sequencing, text animations, audio, etc.)
- **MagicUI patterns** → Inspiration for motion timing and visual hierarchy that translates well from web to video

## Next Steps (I can execute now)

- Install dependencies in `immoPro-remotion`
- Configure Tailwind properly for Remotion (following the specific rules in remotion-skills)
- Create the first `PropertyHighlight` composition using Pro Max colors
- Set up a way to pass property data into the composition (for dynamic generation)

All video work will be logged here and in the main integration plan.
