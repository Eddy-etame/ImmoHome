/**
 * ImmoPro — Agent Branding Video.
 *
 * Short, editorial personal-branding clip (~4 seconds at 30fps).
 * Pure Paper & Ink: paper background, ink type, single teal accent.
 * Designed for agent-attached property listings and social posts.
 */

import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill, Sequence } from 'remotion';
import { immoProColors, immoProTypography } from '../immoProDesignSystem';

interface AgentBrandingProps {
  agentName?: string;
  title?: string;
  tagline?: string;
  yearsExperience?: number;
  transactionsCount?: number;
}

export const AgentBranding: React.FC<AgentBrandingProps> = ({
  agentName = 'Jean-Pierre Mbala',
  title = 'Expert Immobilier Senior',
  tagline = "Votre partenaire de confiance pour les biens d'exception au Cameroun.",
  yearsExperience = 12,
  transactionsCount = 180,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const tagOpacity     = interpolate(frame, [5, 30],     [0, 1], { extrapolateRight: 'clamp' });
  const nameOpacity    = interpolate(frame, [20, 55],    [0, 1], { extrapolateRight: 'clamp' });
  const titleOpacity   = interpolate(frame, [50, 85],    [0, 1], { extrapolateRight: 'clamp' });
  const taglineOpacity = interpolate(frame, [80, 110],   [0, 1], { extrapolateRight: 'clamp' });
  const statsOpacity   = interpolate(frame, [100, 130],  [0, 1], { extrapolateRight: 'clamp' });

  // Subtle entry lift on the name.
  const nameLift = interpolate(frame, [20, 70], [12, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: immoProColors.background }}>
      {/* Decorative editorial hairline */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 84,
          height: 1,
          background: `linear-gradient(90deg, ${immoProColors.foreground}88, transparent 60%)`,
        }}
      />

      {/* Brand tag */}
      <Sequence from={0} durationInFrames={durationInFrames}>
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: 80,
            fontFamily: immoProTypography.body,
            fontSize: 14,
            color: immoProColors.accent,
            letterSpacing: '0.32em',
            opacity: tagOpacity,
          }}
        >
          IMMOPRO
        </div>
      </Sequence>

      {/* Agent name (display serif) */}
      <Sequence from={15} durationInFrames={durationInFrames - 15}>
        <div
          style={{
            position: 'absolute',
            top: 160,
            left: 80,
            right: 80,
            fontFamily: immoProTypography.heading,
            fontSize: 96,
            color: immoProColors.foreground,
            lineHeight: 0.95,
            opacity: nameOpacity,
            letterSpacing: '-0.035em',
            transform: `translateY(${nameLift}px)`,
          }}
        >
          {agentName}
        </div>
      </Sequence>

      {/* Title */}
      <Sequence from={45} durationInFrames={durationInFrames - 45}>
        <div
          style={{
            position: 'absolute',
            top: 290,
            left: 80,
            fontFamily: immoProTypography.body,
            fontSize: 28,
            color: immoProColors.mutedForeground,
            opacity: titleOpacity,
            letterSpacing: '-0.005em',
          }}
        >
          {title}
        </div>
      </Sequence>

      {/* Tagline */}
      <Sequence from={75} durationInFrames={durationInFrames - 75}>
        <div
          style={{
            position: 'absolute',
            top: 360,
            left: 80,
            right: 200,
            maxWidth: 880,
            fontFamily: immoProTypography.heading,
            fontStyle: 'italic',
            fontSize: 32,
            color: immoProColors.foreground,
            opacity: taglineOpacity,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          «&nbsp;{tagline}&nbsp;»
        </div>
      </Sequence>

      {/* Stats row */}
      <Sequence from={95} durationInFrames={durationInFrames - 95}>
        <div
          style={{
            position: 'absolute',
            bottom: 110,
            left: 80,
            right: 80,
            display: 'flex',
            gap: 80,
            opacity: statsOpacity,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: immoProColors.mutedForeground, letterSpacing: '0.25em' }}>
              ANNÉES D'EXPÉRIENCE
            </div>
            <div style={{
              fontFamily: immoProTypography.heading,
              fontSize: 64,
              color: immoProColors.foreground,
              letterSpacing: '-0.02em',
            }}>
              {yearsExperience}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: immoProColors.mutedForeground, letterSpacing: '0.25em' }}>
              TRANSACTIONS
            </div>
            <div style={{
              fontFamily: immoProTypography.heading,
              fontSize: 64,
              color: immoProColors.foreground,
              letterSpacing: '-0.02em',
            }}>
              {transactionsCount}+
            </div>
          </div>
        </div>
      </Sequence>

      {/* Bottom accent bar — the single chromatic note */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: immoProColors.accent,
        }}
      />
    </AbsoluteFill>
  );
};
