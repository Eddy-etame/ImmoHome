// Remotion-inspired animation helpers for web previews
// Purpose: This utility mirrors Remotion's interpolation and easing APIs,
// allowing frame-based previews of video sequences directly on the web interface.
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function interpolate(
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  options: { extrapolateLeft?: 'clamp' | 'extend'; extrapolateRight?: 'clamp' | 'extend' } = {}
): number {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;
  const t = (frame - inMin) / (inMax - inMin);

  let eased = t;

  if (options.extrapolateLeft === 'clamp' && t < 0) eased = 0;
  if (options.extrapolateRight === 'clamp' && t > 1) eased = 1;

  return outMin + (outMax - outMin) * eased;
}

export const Easing = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  editorial: (t: number) => t * t * (3 - 2 * t), // smoothstep
};
