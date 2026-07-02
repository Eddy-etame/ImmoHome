/**
 * ImmoPro — 3D Virtual Tour.
 *
 * A slow, editorial camera move around a placeholder building geometry.
 * Remotion 3D rules respected:
 *  - Uses `ThreeCanvas` from `@remotion/three` (NOT `Canvas` from `@react-three/fiber`).
 *  - No `useFrame` from R3F — camera position is driven by `useCurrentFrame()` + `interpolate()`.
 *  - All timing derived from `useVideoConfig()` so the composition is fps-agnostic.
 *
 * Replace the placeholder geometry with a real `<gltf />` model in production.
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { immoProColors, immoProTypography } from '../immoProDesignSystem';

interface Building3DTourProps {
  propertyTitle?: string;
  location?: string;
}

export const Building3DTour: React.FC<Building3DTourProps> = ({
  propertyTitle = 'Villa Contemporaine — Bonapriso',
  location = 'Douala, Cameroun',
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Camera moves smoothly around the building. All derived from frame.
  const cameraX = interpolate(frame, [0, durationInFrames], [-9, 9], { extrapolateRight: 'clamp' });
  const cameraZ = interpolate(frame, [0, durationInFrames], [22, 9], { extrapolateRight: 'clamp' });
  const cameraY = interpolate(frame, [0, durationInFrames / 2, durationInFrames], [3, 6, 4], { extrapolateRight: 'clamp' });

  // Editorial overlay fade-in
  const titleOpacity = interpolate(frame, [10, 50], [0, 1], { extrapolateRight: 'clamp' });
  const locationOpacity = interpolate(frame, [40, 80], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0d0d' }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          position: [cameraX, cameraY, cameraZ],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[12, 20, 10]} intensity={1.1} castShadow />
        <directionalLight position={[-12, 16, -10]} intensity={0.4} />

        {/* Placeholder building (procedural, no external assets) */}
        <group>
          {/* Main structure */}
          <mesh position={[0, 4, 0]} castShadow>
            <boxGeometry args={[12, 8, 10]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.85} metalness={0.05} />
          </mesh>

          {/* Roof */}
          <mesh position={[0, 9, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[8, 3, 4]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.7} />
          </mesh>

          {/* Glowing windows — the single accent note in the 3D scene */}
          {[-4, 0, 4].map((x, i) => (
            <mesh key={i} position={[x, 5, 5.05]}>
              <planeGeometry args={[2, 2]} />
              <meshStandardMaterial
                color={immoProColors.accentSoft}
                emissive={immoProColors.accentSoft}
                emissiveIntensity={0.45}
              />
            </mesh>
          ))}

          {/* Ground plane */}
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial color="#181818" roughness={1} />
          </mesh>
        </group>
      </ThreeCanvas>

      {/* Editorial overlays — Paper & Ink type on the cinematic dark background */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 80,
          fontFamily: immoProTypography.heading,
          fontSize: 56,
          color: immoProColors.background,
          letterSpacing: '-0.025em',
          opacity: titleOpacity,
          textShadow: '0 2px 16px rgba(0,0,0,0.6)',
        }}
      >
        {propertyTitle}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 152,
          left: 80,
          fontFamily: immoProTypography.body,
          fontSize: 18,
          color: immoProColors.accentSoft,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: locationOpacity,
        }}
      >
        {location}
      </div>

      {/* Bottom hairline (brand cue) */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 80,
          width: 64,
          height: 1,
          background: immoProColors.accent,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 80,
          fontFamily: immoProTypography.body,
          fontSize: 12,
          color: 'rgba(245,243,238,0.55)',
          letterSpacing: '0.3em',
        }}
      >
        IMMOPRO · VISITE 3D
      </div>
    </AbsoluteFill>
  );
};
