/**
 * ImmoPro — Property Highlight Video.
 *
 * Editorial cinematic for a single property: image slideshow with Ken Burns motion,
 * staggered text entries (title → location → price → features), thin Paper & Ink
 * brand bar at the bottom.
 *
 * Remotion rules respected:
 * - All timing via `useCurrentFrame()` + `interpolate()` (no CSS transitions, no setTimeout).
 * - `fps` read from `useVideoConfig()`, never hardcoded.
 * - `<Sequence>` used to scope visible windows.
 */

import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill, Sequence, Img } from 'remotion';
import { immoProColors, immoProTypography } from '../immoProDesignSystem';

interface PropertyHighlightProps {
  propertyTitle?: string;
  location?: string;
  price?: string;
  features?: string[];
  imageUrls?: string[];
}

export const PropertyHighlight: React.FC<PropertyHighlightProps> = ({
  propertyTitle = 'Villa Contemporaine — Bonapriso',
  location = 'Douala, Cameroun',
  price = '285 000 000 FCFA',
  features = ['5 chambres', 'Piscine', 'Jardin clos', 'Sécurité 24/7'],
  imageUrls = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80',
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Slideshow timing — each image holds for ~2.5 seconds with quick crossfades.
  const imageHoldSeconds = 2.5;
  const imageHoldFrames = fps * imageHoldSeconds;
  const imageCount = Math.max(imageUrls.length, 1);
  const imageIndex = Math.floor(frame / imageHoldFrames) % imageCount;
  const imageProgress = (frame % imageHoldFrames) / imageHoldFrames;

  const imageOpacity = interpolate(imageProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Slow Ken Burns motion over the full duration.
  const scale = 1.03 + interpolate(frame, [0, durationInFrames], [0, 0.06], { extrapolateRight: 'clamp' });
  const xOffset = interpolate(frame, [0, durationInFrames], [-20, 20], { extrapolateRight: 'clamp' });
  const yOffset = interpolate(frame, [0, durationInFrames], [-8, 8], { extrapolateRight: 'clamp' });

  // Editorial staggered entries.
  const titleOpacity    = interpolate(frame, [15, 55],   [0, 1], { extrapolateRight: 'clamp' });
  const locationOpacity = interpolate(frame, [45, 80],   [0, 1], { extrapolateRight: 'clamp' });
  const priceOpacity    = interpolate(frame, [70, 105],  [0, 1], { extrapolateRight: 'clamp' });
  const featuresOpacity = interpolate(frame, [110, 150], [0, 1], { extrapolateRight: 'clamp' });
  const narrationOpacity = interpolate(frame, [25, 40, 60, 80], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

  // Deep editorial ink background — slightly warmer than pure black so the paper
  // tone reads as intentional in stills.
  const bg = '#0d0d0d';

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {/* Background image with crossfade and Ken Burns */}
      {imageUrls.length > 0 && (
        <Sequence from={0} durationInFrames={durationInFrames}>
          <Img
            src={imageUrls[imageIndex]}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageOpacity,
              transform: `scale(${scale}) translate(${xOffset}px, ${yOffset}px)`,
              transformOrigin: 'center',
            }}
          />
          {/* Editorial dark overlay — readable text without crushing the photo */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(13,13,13,0.32) 0%, rgba(13,13,13,0.78) 70%)',
            }}
          />
        </Sequence>
      )}

      {/* Title */}
      <Sequence from={10} durationInFrames={durationInFrames - 10}>
        <div
          style={{
            fontFamily: immoProTypography.heading,
            fontSize: 78,
            fontWeight: 400,
            color: immoProColors.background,
            padding: '90px 70px 0',
            opacity: titleOpacity,
            letterSpacing: '-0.03em',
            lineHeight: 0.98,
            textShadow: '0 4px 30px rgba(0,0,0,0.55)',
          }}
        >
          {propertyTitle}
        </div>
      </Sequence>

      {/* Location + Price */}
      <Sequence from={35} durationInFrames={durationInFrames - 35}>
        <div style={{ padding: '0 70px', marginTop: 24 }}>
          <div
            style={{
              fontFamily: immoProTypography.body,
              fontSize: 22,
              color: immoProColors.accentSoft,
              opacity: locationOpacity,
              marginBottom: 10,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {location}
          </div>
          <div
            style={{
              fontFamily: immoProTypography.heading,
              fontSize: 54,
              color: immoProColors.background,
              opacity: priceOpacity,
              letterSpacing: '-0.02em',
            }}
          >
            {price}
          </div>
        </div>
      </Sequence>

      {/* Features row */}
      <Sequence from={95} durationInFrames={durationInFrames - 95}>
        <div style={{ position: 'absolute', bottom: 110, left: 70, right: 70, opacity: featuresOpacity }}>
          <div
            style={{
              fontFamily: immoProTypography.body,
              fontSize: 13,
              color: immoProColors.accentSoft,
              letterSpacing: '0.25em',
              marginBottom: 16,
            }}
          >
            CARACTÉRISTIQUES CLÉS
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {features.map((feature, i) => (
              <div
                key={i}
                style={{
                  fontFamily: immoProTypography.body,
                  fontSize: 19,
                  color: immoProColors.background,
                  paddingBottom: 6,
                  borderBottom: `1px solid ${immoProColors.accentSoft}55`,
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </Sequence>

      {/* Voiceover / narration text */}
      <Sequence from={25} durationInFrames={60}>
        <div
          style={{
            position: 'absolute',
            bottom: 220,
            left: 70,
            right: 70,
            fontFamily: immoProTypography.heading,
            fontStyle: 'italic',
            fontSize: 22,
            color: immoProColors.background,
            opacity: narrationOpacity,
            textShadow: '0 2px 12px rgba(0,0,0,0.55)',
          }}
        >
          «&nbsp;Découvrez cette villa d'exception au cœur de Bonapriso, avec piscine et jardin privé.&nbsp;»
        </div>
      </Sequence>

      {/* Bottom brand bar */}
      <Sequence from={0} durationInFrames={durationInFrames}>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            background: 'linear-gradient(to top, rgba(13,13,13,0.96), transparent)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 70px',
            fontFamily: immoProTypography.body,
            fontSize: 13,
            color: 'rgba(245,243,238,0.72)',
            letterSpacing: '0.25em',
          }}
        >
          IMMOPRO — IMMOBILIER D'EXCEPTION AU CAMEROUN
        </div>
      </Sequence>

      {/* Top-right watermark */}
      <Sequence from={0} durationInFrames={durationInFrames}>
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 50,
            fontFamily: immoProTypography.heading,
            fontSize: 14,
            color: 'rgba(245,243,238,0.32)',
            letterSpacing: '0.3em',
          }}
        >
          IMMOPRO
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
