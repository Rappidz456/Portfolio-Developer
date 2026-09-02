import * as THREE from "three";

/**
 * Geometry for the hero centrepiece: a sphere of evenly spread points with one
 * tilted orbit ring around it.
 *
 * The 3D is deliberately confined to a single composition in the hero. Spread
 * across the whole page it competes with every section; held in one place it
 * reads as a centrepiece.
 */

export const SPHERE_RADIUS = 2.35;
export const RING_RADIUS = 3.7;
/** Degrees. Steep enough to read as an orbit rather than a flat disc. */
export const RING_TILT = 72;

export type PointBudget = { sphere: number; ring: number; size: number };

export function pointBudget(width: number): PointBudget {
  if (width < 640) return { sphere: 1400, ring: 240, size: 0.042 };
  if (width < 1024) return { sphere: 2100, ring: 320, size: 0.039 };
  return { sphere: 3000, ring: 420, size: 0.036 };
}

const CREAM = new THREE.Color(0xf5efc5);
const AMBER = new THREE.Color(0xd99b3c);

/**
 * Fibonacci distribution — points land evenly with no clumps or poles. Plain
 * random spherical coordinates bunch at the poles and read as noise.
 */
export function sphereField(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const tint = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;

    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;

    // Cream at the top, amber towards the base — the same light direction as
    // the CSS halo sitting behind it.
    tint.copy(CREAM).lerp(AMBER, THREE.MathUtils.clamp((0.6 - y) / 1.4, 0, 1));
    colors[i * 3] = tint.r;
    colors[i * 3 + 1] = tint.g;
    colors[i * 3 + 2] = tint.b;
  }

  return { positions, colors };
}

/** A band rather than a hairline: slight radial and vertical scatter. */
export function ringField(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const tint = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = radius + (Math.random() - 0.5) * 0.22;

    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
    positions[i * 3 + 2] = Math.sin(angle) * r;

    tint.copy(AMBER).lerp(CREAM, Math.random() * 0.5);
    colors[i * 3] = tint.r;
    colors[i * 3 + 1] = tint.g;
    colors[i * 3 + 2] = tint.b;
  }

  return { positions, colors };
}
